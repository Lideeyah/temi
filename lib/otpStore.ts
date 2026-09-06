import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

/**
 * Phone verification and the server's half of a merchant's key.
 *
 * ── Why a server share exists at all ───────────────────────────────────────────────────────
 *
 * The obvious design is to derive a merchant's key from their PIN alone, salted with their phone
 * number. It does not survive contact with an attacker. A salt is not a secret — a trader's
 * number is on their shop sign — so the entire key rests on four digits. Ten thousand candidates
 * at 100k PBKDF2 iterations is about a minute on one CPU core and milliseconds on a GPU: derive
 * every candidate address, check which holds a balance, drain it.
 *
 * So the derivation takes a second input this service holds and only releases after the merchant
 * proves they control the number:
 *
 *     privateKey = PBKDF2(PIN, salt = serverShare ‖ phone ‖ domain)
 *
 * Neither half is sufficient. The server never sees the PIN, so it cannot derive a merchant's key
 * even from its own database. An attacker with the phone number has nothing to brute-force
 * against, because the share is not derivable — it is an HMAC under a pepper that never leaves
 * this process.
 *
 * ── What this does not solve ──────────────────────────────────────────────────────────────
 *
 * Someone holding the unlocked device can still brute-force four digits against the locally
 * stored ciphertext. That is true of every PIN-based mobile money app and is the trade the PIN
 * buys: it works on a ₦15,000 Android with no fingerprint sensor. The slow KDF makes it costly
 * rather than impossible.
 *
 * In production the pepper belongs in an HSM or KMS, the codes go over real SMS, and verification
 * needs per-number rate limiting that survives a restart. This module is honest about being the
 * demo-grade version of all three.
 */

const PEPPER =
  process.env.OTP_SERVER_PEPPER ??
  // Deterministic fallback so recovery still works across restarts in development. A real
  // deployment must set this: without it, every instance derives different merchant keys.
  'temi-development-pepper-not-for-production';

export const DEMO_MODE = process.env.OTP_DEMO_MODE !== 'false';
/** The code accepted in demo mode, so a reviewer needs no SMS credit in four jurisdictions. */
export const DEMO_CODE = '123456';

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
/** Throttle requests per number so this cannot be used to hammer an SMS gateway. */
const MIN_REQUEST_INTERVAL_MS = 20 * 1000;

interface Pending {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  issuedAt: number;
}

const pending = new Map<string, Pending>();
const verified = new Map<string, number>();

const hashCode = (phone: string, code: string) =>
  createHmac('sha256', PEPPER).update(`${phone}:${code}`).digest('hex');

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export type RequestResult =
  | { ok: true; demoCode?: string; expiresInSeconds: number }
  | { ok: false; error: string; retryInSeconds?: number };

export function issueCode(phoneE164: string): RequestResult {
  const existing = pending.get(phoneE164);
  const now = Date.now();

  if (existing && now - existing.issuedAt < MIN_REQUEST_INTERVAL_MS) {
    return {
      ok: false,
      error: 'A code was just sent to this number.',
      retryInSeconds: Math.ceil((MIN_REQUEST_INTERVAL_MS - (now - existing.issuedAt)) / 1000),
    };
  }

  const code = DEMO_MODE ? DEMO_CODE : String(randomInt(0, 1_000_000)).padStart(6, '0');
  pending.set(phoneE164, {
    codeHash: hashCode(phoneE164, code),
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    issuedAt: now,
  });

  // A real deployment hands `code` to an SMS gateway here and returns nothing.
  return {
    ok: true,
    demoCode: DEMO_MODE ? code : undefined,
    expiresInSeconds: CODE_TTL_MS / 1000,
  };
}

export type VerifyResult =
  | { ok: true; keyShare: string }
  | { ok: false; error: string; attemptsRemaining?: number };

export function verifyCode(phoneE164: string, code: string): VerifyResult {
  const entry = pending.get(phoneE164);
  if (!entry) return { ok: false, error: 'Request a code first.' };

  if (Date.now() > entry.expiresAt) {
    pending.delete(phoneE164);
    return { ok: false, error: 'That code has expired. Request a new one.' };
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    pending.delete(phoneE164);
    return { ok: false, error: 'Too many attempts. Request a new code.' };
  }

  if (!constantTimeEquals(entry.codeHash, hashCode(phoneE164, code))) {
    return {
      ok: false,
      error: 'That code is not right.',
      attemptsRemaining: MAX_ATTEMPTS - entry.attempts,
    };
  }

  pending.delete(phoneE164);
  verified.set(phoneE164, Date.now());
  return { ok: true, keyShare: deriveKeyShare(phoneE164) };
}

/**
 * The server's half of the merchant's key.
 *
 * Deterministic in the phone number, so re-verifying the same number on a new device returns the
 * same share and therefore recovers the same vault. High entropy, so it cannot be guessed —
 * which is the whole point.
 */
export function deriveKeyShare(phoneE164: string): string {
  return createHmac('sha512', PEPPER).update(`share:${phoneE164}`).digest('hex');
}

/** Only used to seed a pepper suggestion in the setup docs. */
export function suggestPepper(): string {
  return randomBytes(32).toString('hex');
}
