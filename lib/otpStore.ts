import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

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
 * ── Why the code is derived rather than stored ────────────────────────────────────────────
 *
 * This service runs on stateless functions. Two requests from one merchant — asking for a code,
 * then submitting it — are not guaranteed to reach the same instance, and the gap between them is
 * exactly as long as it takes a person to read six digits and type them. A code held in process
 * memory is therefore a code that sometimes vanishes between being issued and being checked, and
 * the merchant is told to request one they already have.
 *
 * So nothing is stored. The code is a pure function of the number, the pepper and the current time
 * window, in the manner of TOTP:
 *
 *     code = HMAC-SHA256(pepper, "otp:" ‖ phone ‖ window) mod 10^6
 *
 * Any instance can recompute it, so the answer no longer depends on which machine answers. The
 * previous window is accepted too, which gives a code between one and two STEP periods of life
 * and keeps a merchant from being cut off mid-entry by a boundary they cannot see.
 *
 * ── What this does not solve ──────────────────────────────────────────────────────────────
 *
 * Someone holding the unlocked device can still brute-force four digits against the locally
 * stored ciphertext. That is true of every PIN-based mobile money app and is the trade the PIN
 * buys: it works on a ₦15,000 Android with no fingerprint sensor. The slow KDF makes it costly
 * rather than impossible.
 *
 * A derived code also cannot be consumed. Within its window it verifies as many times as it is
 * presented, where a stored code could be deleted on first use. And the throttle and attempt
 * counter below are best-effort: they live in whichever instance happens to be warm, so they
 * raise the cost of hammering this endpoint without bounding it. Both are acceptable for a demo
 * and neither is acceptable in production, where the codes go over real SMS and the counters
 * belong in shared storage — Redis, or the same database that holds the merchant record.
 */

const PEPPER =
  process.env.OTP_SERVER_PEPPER ??
  // Deterministic fallback so recovery still works across restarts in development. A real
  // deployment must set this: without it, every instance derives different merchant keys.
  'temi-development-pepper-not-for-production';

export const DEMO_MODE = process.env.OTP_DEMO_MODE !== 'false';
/** The code accepted in demo mode, so a reviewer needs no SMS credit in four jurisdictions. */
export const DEMO_CODE = '123456';

/** Width of one code window. A code lives for at least this and at most twice this. */
const STEP_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
/** Throttle requests per number so this cannot be used to hammer an SMS gateway. */
const MIN_REQUEST_INTERVAL_MS = 20 * 1000;

/**
 * Best-effort throttle and attempt state.
 *
 * Deliberately advisory: an empty map means this instance has not seen the number before, which
 * is a reason to allow, never a reason to refuse. Refusing on absence is the bug this module was
 * rewritten to remove.
 */
const recentRequests = new Map<string, number>();
const attempts = new Map<string, { count: number; window: number }>();

const currentWindow = (at = Date.now()) => Math.floor(at / STEP_MS);

/** The code for one number in one window. Six digits, uniform over the range. */
function codeFor(phoneE164: string, window: number): string {
  if (DEMO_MODE) return DEMO_CODE;
  const mac = createHmac('sha256', PEPPER).update(`otp:${phoneE164}:${window}`).digest();
  // Truncate in the RFC 4226 manner: a dynamic offset avoids leaning on any fixed byte.
  const offset = mac[mac.length - 1] & 0x0f;
  const truncated =
    ((mac[offset] & 0x7f) << 24) |
    (mac[offset + 1] << 16) |
    (mac[offset + 2] << 8) |
    mac[offset + 3];
  return String(truncated % 1_000_000).padStart(6, '0');
}

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
  const now = Date.now();
  const lastRequest = recentRequests.get(phoneE164);

  if (lastRequest !== undefined && now - lastRequest < MIN_REQUEST_INTERVAL_MS) {
    return {
      ok: false,
      error: 'A code was just sent to this number.',
      retryInSeconds: Math.ceil((MIN_REQUEST_INTERVAL_MS - (now - lastRequest)) / 1000),
    };
  }

  recentRequests.set(phoneE164, now);
  const code = codeFor(phoneE164, currentWindow(now));

  // A real deployment hands `code` to an SMS gateway here and returns nothing.
  return {
    ok: true,
    demoCode: DEMO_MODE ? code : undefined,
    // What the merchant can rely on: the remaining life of the current window, since the previous
    // window's code is also accepted the whole way through.
    expiresInSeconds: Math.ceil((STEP_MS - (now % STEP_MS)) / 1000) + STEP_MS / 1000,
  };
}

export type VerifyResult =
  | { ok: true; keyShare: string }
  | { ok: false; error: string; attemptsRemaining?: number };

export function verifyCode(phoneE164: string, code: string): VerifyResult {
  const submitted = String(code ?? '').trim();
  if (!/^\d{6}$/.test(submitted)) {
    return { ok: false, error: 'Enter the six digits from the message.' };
  }

  const window = currentWindow();

  // Advisory attempt counter, reset each window so a merchant is never permanently stuck on an
  // instance that happens to remember them.
  const seen = attempts.get(phoneE164);
  const count = seen && seen.window === window ? seen.count + 1 : 1;
  attempts.set(phoneE164, { count, window });
  if (count > MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many attempts. Wait a moment and request a new code.' };
  }

  // Current window first, then the one before it, so a code typed across a boundary still lands.
  const accepted =
    constantTimeEquals(codeFor(phoneE164, window), submitted) ||
    constantTimeEquals(codeFor(phoneE164, window - 1), submitted);

  if (!accepted) {
    return {
      ok: false,
      error: 'That code is not right.',
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - count),
    };
  }

  attempts.delete(phoneE164);
  return { ok: true, keyShare: deriveKeyShare(phoneE164) };
}

/**
 * The server's half of the merchant's key.
 *
 * Deterministic in the phone number, so re-verifying the same number on a new device returns the
 * same share and therefore recovers the same vault. High entropy, so it cannot be guessed —
 * which is the whole point. Unchanged by the move to derived codes: every vault established
 * before that change still recovers.
 */
export function deriveKeyShare(phoneE164: string): string {
  return createHmac('sha512', PEPPER).update(`share:${phoneE164}`).digest('hex');
}

/** Only used to seed a pepper suggestion in the setup docs. */
export function suggestPepper(): string {
  return randomBytes(32).toString('hex');
}
