import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import type { Address, Hex } from 'viem';

/**
 * MerchantAccount — an account a Lagos trader can actually open.
 *
 * The person this product is for does not have MetaMask, has never seen a seed phrase, and is
 * opening the app because their generator just died. A wallet modal asking them to sign a hex
 * string ends the conversation. So the default path provisions an account for them, secured by
 * the biometric their phone already has.
 *
 * ── What this is, precisely ────────────────────────────────────────────────────────────────
 *
 * A key is generated in the browser and encrypted with a secret derived from a WebAuthn
 * passkey via the PRF extension. The passkey never leaves the secure element, the derived
 * secret is not stored anywhere, and the key on disk is useless without a fingerprint or face
 * scan. That is genuine biometric protection, not a UI gate.
 *
 * ── And what it is not ─────────────────────────────────────────────────────────────────────
 *
 * PRF is not universally supported. Where it is missing we fall back to a key held in
 * IndexedDB behind a passkey *presence* check, which stops a casual snoop and would not stop
 * someone with the device unlocked and developer tools open. The interface says which mode is
 * in force rather than implying uniform security. A production build would put the key in a
 * smart account with a session-scoped signer and social recovery, so losing a phone does not
 * mean losing a reserve.
 */

const DB_NAME = 'temi-merchant';
const STORE = 'accounts';
const RECORD_KEY = 'primary';

/** Domain-separated PRF salt, so the derived secret is specific to this application. */
const PRF_SALT = new TextEncoder().encode('temi.merchant-vault.v1');

export type AccountProtection = 'biometric-prf' | 'passkey-presence';

export interface MerchantRecord {
  address: Address;
  credentialId: string;
  /** AES-GCM ciphertext of the private key, base64. */
  ciphertext: string;
  iv: string;
  protection: AccountProtection;
  label: string;
  createdAt: number;
}

export type MerchantErrorCode =
  | 'ERR_PASSKEY_UNSUPPORTED'
  | 'ERR_PASSKEY_CANCELLED'
  | 'ERR_NO_ACCOUNT'
  | 'ERR_UNLOCK_FAILED'
  | 'ERR_STORAGE_UNAVAILABLE';

export class MerchantError extends Error {
  readonly code: MerchantErrorCode;
  readonly detail?: string;

  constructor(code: MerchantErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'MerchantError';
    this.code = code;
    this.detail = detail;
  }
}

/* ------------------------------------------------------------------ */
/*                             STORAGE                                 */
/* ------------------------------------------------------------------ */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new MerchantError('ERR_STORAGE_UNAVAILABLE', 'This browser has no IndexedDB'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new MerchantError('ERR_STORAGE_UNAVAILABLE', 'IndexedDB unavailable'));
  });
}

async function put(record: MerchantRecord): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record, RECORD_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new MerchantError('ERR_STORAGE_UNAVAILABLE', 'Could not save account'));
  });
  db.close();
}

export async function loadMerchantRecord(): Promise<MerchantRecord | null> {
  try {
    const db = await openDb();
    const record = await new Promise<MerchantRecord | null>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(RECORD_KEY);
      request.onsuccess = () => resolve((request.result as MerchantRecord) ?? null);
      request.onerror = () => resolve(null);
    });
    db.close();
    return record;
  } catch {
    return null;
  }
}

export async function forgetMerchantAccount(): Promise<void> {
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
/*                          CRYPTO HELPERS                             */
/* ------------------------------------------------------------------ */

const toB64 = (bytes: ArrayBuffer | Uint8Array): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)));

/** Returns a view backed by a plain ArrayBuffer, which is what the WebCrypto typings require. */
const fromB64 = (value: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes as Uint8Array<ArrayBuffer>;
};

async function aesKeyFrom(secret: ArrayBuffer): Promise<CryptoKey> {
  // The PRF output is already 32 bytes of high-entropy material from the authenticator, so it
  // is imported directly rather than run through a KDF that would add nothing.
  return crypto.subtle.importKey('raw', secret, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/** A device-bound fallback secret, used only where PRF is unavailable. */
async function fallbackKey(credentialId: string): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(credentialId),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: PRF_SALT, iterations: 210_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export function isPasskeySupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof PublicKeyCredential !== 'undefined' &&
    typeof navigator.credentials?.create === 'function'
  );
}

/** Whether the platform can do a real biometric check (FaceID, fingerprint) rather than a key. */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*                          PROVISIONING                               */
/* ------------------------------------------------------------------ */

type PrfExtensionResults = {
  prf?: { enabled?: boolean; results?: { first?: ArrayBuffer } };
};

/**
 * Create a merchant account, secured by a device passkey.
 *
 * @param label What the merchant calls their business. Shown in the OS passkey prompt, so it
 *              should read as something they recognise rather than a hex string.
 */
export async function createMerchantAccount(label: string): Promise<MerchantRecord> {
  if (!isPasskeySupported()) {
    throw new MerchantError(
      'ERR_PASSKEY_UNSUPPORTED',
      'This browser cannot create a passkey',
      'Use the Web3 wallet path instead, or open Tèmi in a modern mobile browser.',
    );
  }

  const userId = crypto.getRandomValues(new Uint8Array(16));
  let credential: PublicKeyCredential;

  try {
    credential = (await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'Tèmi' },
        user: { id: userId, name: label, displayName: label },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          residentKey: 'required',
          userVerification: 'required',
        },
        timeout: 60_000,
        extensions: { prf: {} } as AuthenticationExtensionsClientInputs,
      },
    })) as PublicKeyCredential;
  } catch (cause) {
    throw new MerchantError(
      'ERR_PASSKEY_CANCELLED',
      'Passkey setup was cancelled',
      cause instanceof Error ? cause.message : undefined,
    );
  }

  const credentialId = toB64(credential.rawId);
  const extensions = credential.getClientExtensionResults() as PrfExtensionResults;
  const prfEnabled = extensions.prf?.enabled === true;

  // The account key itself. Generated here, never transmitted.
  const privateKey = generatePrivateKey();
  const address = privateKeyToAccount(privateKey).address;

  // PRF output is only reliably returned from an assertion, not from creation — so we take one
  // immediately, which also confirms the biometric works before anything depends on it.
  let protection: AccountProtection = 'passkey-presence';
  let key: CryptoKey;

  if (prfEnabled) {
    const secret = await evaluatePrf(credential.rawId);
    if (secret) {
      key = await aesKeyFrom(secret);
      protection = 'biometric-prf';
    } else {
      key = await fallbackKey(credentialId);
    }
  } else {
    key = await fallbackKey(credentialId);
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(privateKey),
  );

  const record: MerchantRecord = {
    address,
    credentialId,
    ciphertext: toB64(ciphertext),
    iv: toB64(iv),
    protection,
    label,
    createdAt: Date.now(),
  };
  await put(record);
  return record;
}

/** Run a passkey assertion and pull the PRF output, if the authenticator supports it. */
async function evaluatePrf(rawId: ArrayBuffer): Promise<ArrayBuffer | null> {
  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{ type: 'public-key', id: rawId }],
        userVerification: 'required',
        timeout: 60_000,
        extensions: {
          prf: { eval: { first: PRF_SALT } },
        } as AuthenticationExtensionsClientInputs,
      },
    })) as PublicKeyCredential | null;

    const results = assertion?.getClientExtensionResults() as PrfExtensionResults | undefined;
    return results?.prf?.results?.first ?? null;
  } catch {
    return null;
  }
}

/**
 * Unlock the stored account. Prompts for the biometric.
 *
 * The returned key is held only for the lifetime of the caller's session — it is never written
 * anywhere in plaintext.
 */
export async function unlockMerchantAccount(record: MerchantRecord): Promise<Hex> {
  const rawId = fromB64(record.credentialId);

  let key: CryptoKey;
  if (record.protection === 'biometric-prf') {
    const secret = await evaluatePrf(rawId.buffer);
    if (!secret) {
      throw new MerchantError(
        'ERR_UNLOCK_FAILED',
        'Biometric check failed',
        'The passkey did not return the expected secret. Try again, or use the Web3 wallet path.',
      );
    }
    key = await aesKeyFrom(secret);
  } else {
    // Presence check only: the assertion proves the passkey is here, it does not derive the key.
    const present = await evaluatePresence(rawId.buffer);
    if (!present) {
      throw new MerchantError('ERR_UNLOCK_FAILED', 'Passkey check failed or was cancelled');
    }
    key = await fallbackKey(record.credentialId);
  }

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(record.iv) },
      key,
      fromB64(record.ciphertext),
    );
    return new TextDecoder().decode(plaintext) as Hex;
  } catch {
    throw new MerchantError(
      'ERR_UNLOCK_FAILED',
      'Could not decrypt the merchant account',
      'The stored key does not match this passkey.',
    );
  }
}

async function evaluatePresence(rawId: ArrayBuffer): Promise<boolean> {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{ type: 'public-key', id: rawId }],
        userVerification: 'required',
        timeout: 60_000,
      },
    });
    return assertion !== null;
  } catch {
    return false;
  }
}

/** How the interface should describe the protection actually in force. */
export function describeProtection(protection: AccountProtection): {
  title: string;
  detail: string;
  strong: boolean;
} {
  return protection === 'biometric-prf'
    ? {
        title: 'Secured by your fingerprint',
        detail:
          'Your account key is encrypted with a secret only your biometric can produce. It is unusable on this device without you.',
        strong: true,
      }
    : {
        title: 'Secured by a device passkey',
        detail:
          'This browser does not support biometric key derivation, so your key is stored on this device behind a passkey check rather than encrypted by it.',
        strong: false,
      };
}
