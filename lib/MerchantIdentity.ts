import { privateKeyToAccount } from 'viem/accounts';
import { keccak256 } from 'viem';
import type { Address, Hex } from 'viem';

/**
 * Phone + PIN identity, without a seed phrase, a wallet extension, or a fingerprint sensor.
 *
 * A trader on a ₦15,000 Android has no biometric hardware and will not write down twelve words.
 * What they already understand is a phone number and a PIN, because that is how mobile money
 * works. So a Tèmi vault is addressed by exactly those two things — and recovering it on a new
 * handset means re-verifying the number and entering the same PIN, with nothing to have lost.
 *
 * ── The derivation, and why it is not PIN-alone ────────────────────────────────────────────
 *
 *     privateKey = PBKDF2-SHA256(PIN, salt = serverShare ‖ phone ‖ "temi:cc3:vault", 600k)
 *
 * The tempting version salts the PIN with the phone number and stops there. That is broken: a
 * salt is public by design, so the key would rest on four digits — ten thousand candidates, about
 * a minute on one CPU core, and a trader's number is painted on their shop. Anyone could derive
 * every candidate address, find the funded one, and empty it.
 *
 * The server share fixes that. It is high-entropy, deterministic in the phone number, and only
 * released after the merchant proves they control that number. Neither half is sufficient: the
 * server never receives the PIN and cannot derive a merchant's key even from its own database,
 * and an attacker holding the number has nothing to grind against.
 *
 * ── What it does not fix ───────────────────────────────────────────────────────────────────
 *
 * Someone with the unlocked handset can still try ten thousand PINs against the locally stored
 * ciphertext. That is true of every PIN-based money app and is the price of working without a
 * secure element; 600k iterations makes it expensive rather than impossible. A hardware-backed
 * passkey remains the stronger option and is offered alongside, not replaced.
 */

const KDF_ITERATIONS = 600_000;
const DOMAIN = 'temi:cc3:vault';

const DB_NAME = 'temi-identity';
const STORE = 'vaults';
const RECORD_KEY = 'primary';

export interface IdentityRecord {
  address: Address;
  phoneE164: string;
  regionId: string;
  businessName: string;
  /** The server share, encrypted under a PIN-derived key. Useless without the PIN. */
  shareCiphertext: string;
  shareIv: string;
  /** Lets us reject a wrong PIN without deriving a whole account first. */
  pinCheck: string;
  biometricEnabled: boolean;
  /** Consecutive wrong PINs. Reset on success. */
  failedAttempts: number;
  createdAt: number;
}

/**
 * How many wrong PINs before the local share is destroyed.
 *
 * No key derivation function makes four digits strong against someone holding the unlocked
 * handset: at 600k iterations the whole space is about fifteen minutes of grinding. So the
 * defence is the one a SIM card uses — count failures and wipe. After this many, the encrypted
 * share is deleted and the vault can only be reached again by re-verifying the phone number over
 * SMS, which an attacker with the device but not the number cannot do.
 *
 * Crucially the funds are not lost: the account is derived, not stored, so the rightful merchant
 * re-verifies and re-enters their PIN and the same vault returns.
 */
export const MAX_PIN_ATTEMPTS = 10;

export type IdentityErrorCode =
  | 'ERR_WRONG_PIN'
  | 'ERR_PIN_LOCKED'
  | 'ERR_NO_IDENTITY'
  | 'ERR_STORAGE_UNAVAILABLE'
  | 'ERR_OTP_FAILED';

export class IdentityError extends Error {
  readonly code: IdentityErrorCode;
  readonly detail?: string;

  constructor(code: IdentityErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'IdentityError';
    this.code = code;
    this.detail = detail;
  }
}

/* ------------------------------------------------------------------ */
/*                            DERIVATION                               */
/* ------------------------------------------------------------------ */

const enc = new TextEncoder();

async function pbkdf2(pin: string, salt: string, bytes: number): Promise<ArrayBuffer> {
  const material = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, [
    'deriveBits',
  ]);
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: KDF_ITERATIONS, hash: 'SHA-256' },
    material,
    bytes * 8,
  );
}

/** secp256k1 group order. A derived scalar must land below it. */
const SECP256K1_N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');

/**
 * PIN + verified phone + server share -> a deterministic account.
 *
 * The rehash loop is a formality — landing on or above the curve order has probability around
 * 2^-128 — but a key that is silently invalid is worse than one that costs an extra hash.
 */
export async function deriveAccountKey(
  pin: string,
  phoneE164: string,
  keyShare: string,
): Promise<Hex> {
  const salt = `${keyShare}${phoneE164}${DOMAIN}`;
  let bits = await pbkdf2(pin, salt, 32);

  for (let attempt = 0; attempt < 8; attempt++) {
    const hex = `0x${Buffer.from(new Uint8Array(bits)).toString('hex')}` as Hex;
    const scalar = BigInt(hex);
    if (scalar > 0n && scalar < SECP256K1_N) return hex;
    bits = Buffer.from(keccak256(hex).slice(2), 'hex').buffer as ArrayBuffer;
  }
  throw new IdentityError('ERR_WRONG_PIN', 'Could not derive a valid key');
}

export async function addressFor(
  pin: string,
  phoneE164: string,
  keyShare: string,
): Promise<Address> {
  return privateKeyToAccount(await deriveAccountKey(pin, phoneE164, keyShare)).address;
}

/* ------------------------------------------------------------------ */
/*                       LOCAL SHARE STORAGE                           */
/* ------------------------------------------------------------------ */

const toB64 = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)));

const fromB64 = (value: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(value);
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out as Uint8Array<ArrayBuffer>;
};

/** A separate KDF context, so the wrapping key is never the account key. */
async function wrappingKey(pin: string, phoneE164: string): Promise<CryptoKey> {
  const bits = await pbkdf2(pin, `wrap:${phoneE164}:${DOMAIN}`, 32);
  return crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new IdentityError('ERR_STORAGE_UNAVAILABLE', 'No IndexedDB in this browser'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new IdentityError('ERR_STORAGE_UNAVAILABLE', 'IndexedDB unavailable'));
  });
}

export async function loadIdentity(): Promise<IdentityRecord | null> {
  try {
    const db = await openDb();
    const record = await new Promise<IdentityRecord | null>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(RECORD_KEY);
      request.onsuccess = () => resolve((request.result as IdentityRecord) ?? null);
      request.onerror = () => resolve(null);
    });
    db.close();
    return record;
  } catch {
    return null;
  }
}

async function persist(record: IdentityRecord): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record, RECORD_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new IdentityError('ERR_STORAGE_UNAVAILABLE', 'Could not save'));
  });
  db.close();
}

export async function forgetIdentity(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(RECORD_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
  db.close();
}

/* ------------------------------------------------------------------ */
/*                          CREATE / UNLOCK                            */
/* ------------------------------------------------------------------ */

/** Cheap wrong-PIN detection, so a mistyped digit does not cost a full derivation. */
async function pinCheckValue(pin: string, phoneE164: string): Promise<string> {
  const bits = await pbkdf2(pin, `check:${phoneE164}:${DOMAIN}`, 16);
  return toB64(bits);
}

export async function createIdentity(params: {
  pin: string;
  phoneE164: string;
  keyShare: string;
  regionId: string;
  businessName: string;
  biometricEnabled: boolean;
}): Promise<{ record: IdentityRecord; privateKey: Hex }> {
  const { pin, phoneE164, keyShare, regionId, businessName, biometricEnabled } = params;

  const privateKey = await deriveAccountKey(pin, phoneE164, keyShare);
  const address = privateKeyToAccount(privateKey).address;

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await wrappingKey(pin, phoneE164),
    enc.encode(keyShare),
  );

  const record: IdentityRecord = {
    address,
    phoneE164,
    regionId,
    businessName,
    shareCiphertext: toB64(ciphertext),
    shareIv: toB64(iv),
    pinCheck: await pinCheckValue(pin, phoneE164),
    biometricEnabled,
    failedAttempts: 0,
    createdAt: Date.now(),
  };

  await persist(record);
  return { record, privateKey };
}

/**
 * Re-derive the account from a stored record and the merchant's PIN.
 *
 * Wrong PINs are counted and, past the limit, the local share is destroyed. That is not data
 * loss — the account is derived rather than stored, so re-verifying the phone number returns the
 * same vault. It costs an attacker with the handset everything and the owner one SMS.
 */
export async function unlockIdentity(record: IdentityRecord, pin: string): Promise<Hex> {
  const correct = (await pinCheckValue(pin, record.phoneE164)) === record.pinCheck;

  if (!correct) {
    const attempts = (record.failedAttempts ?? 0) + 1;
    if (attempts >= MAX_PIN_ATTEMPTS) {
      await forgetIdentity();
      throw new IdentityError(
        'ERR_PIN_LOCKED',
        'Too many wrong PINs — this device has been cleared',
        'Your vault is safe. Verify your phone number again and enter your PIN to restore it.',
      );
    }
    await persist({ ...record, failedAttempts: attempts });
    throw new IdentityError(
      'ERR_WRONG_PIN',
      'That PIN is not right',
      `${MAX_PIN_ATTEMPTS - attempts} attempts left before this device is cleared.`,
    );
  }

  let keyShare: string;
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(record.shareIv) },
      await wrappingKey(pin, record.phoneE164),
      fromB64(record.shareCiphertext),
    );
    keyShare = new TextDecoder().decode(plaintext);
  } catch {
    throw new IdentityError('ERR_WRONG_PIN', 'That PIN is not right');
  }

  if (record.failedAttempts > 0) await persist({ ...record, failedAttempts: 0 });
  return deriveAccountKey(pin, record.phoneE164, keyShare);
}

/* ------------------------------------------------------------------ */
/*                            OTP CLIENT                               */
/* ------------------------------------------------------------------ */

export interface OtpRequestResult {
  sent: boolean;
  demoMode: boolean;
  demoCode?: string;
  expiresInSeconds: number;
}

export async function requestOtp(phoneE164: string): Promise<OtpRequestResult> {
  const response = await fetch('/api/otp/request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: phoneE164 }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new IdentityError('ERR_OTP_FAILED', body.error ?? 'Could not send a code', body.retryInSeconds ? `Try again in ${body.retryInSeconds}s.` : undefined);
  }
  return body as OtpRequestResult;
}

export async function verifyOtp(phoneE164: string, code: string): Promise<string> {
  const response = await fetch('/api/otp/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: phoneE164, code }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new IdentityError(
      'ERR_OTP_FAILED',
      body.error ?? 'Verification failed',
      body.attemptsRemaining !== undefined ? `${body.attemptsRemaining} attempts left.` : undefined,
    );
  }
  return body.keyShare as string;
}
