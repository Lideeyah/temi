/**
 * Phone + PIN key derivation.
 *
 * The properties that matter: the same inputs always recover the same vault (or a merchant who
 * drops their phone has lost their savings), different inputs never collide, and the server
 * share is load-bearing — without it the scheme collapses to four digits of entropy.
 */
import { createHmac } from 'node:crypto';
import { privateKeyToAccount } from 'viem/accounts';

// Node 24 exposes WebCrypto as globalThis.crypto already; the module uses crypto.subtle directly.
const { deriveAccountKey } = await import('../lib/MerchantIdentity.ts');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const PEPPER = 'temi-development-pepper-not-for-production';
const shareFor = (phone) => createHmac('sha512', PEPPER).update(`share:${phone}`).digest('hex');

const PHONE = '+2348034918821';
const OTHER_PHONE = '+2348034918822';
const SHARE = shareFor(PHONE);

console.log('\nDeriving with 600,000 PBKDF2 iterations — each call is deliberately slow.\n');

/* ---------------------------------------------------------------- */
console.log('[1] Recovery — the whole point');
const t0 = Date.now();
const first = await deriveAccountKey('4471', PHONE, SHARE);
const elapsed = Date.now() - t0;
const again = await deriveAccountKey('4471', PHONE, SHARE);
check('same phone + same PIN recovers the same key', first === again);
check('and therefore the same address',
  privateKeyToAccount(first).address === privateKeyToAccount(again).address,
  privateKeyToAccount(first).address);
console.log(`  derivation cost: ${elapsed} ms`);
console.log(`  exhausting all 10,000 PINs locally: ~${((elapsed * 10000) / 60000).toFixed(0)} minutes`);
check('a slow KDF alone cannot protect four digits — hence the attempt limit', elapsed * 10000 < 60 * 60 * 1000);

/* ---------------------------------------------------------------- */
console.log('\n[2] Different inputs must not collide');
const wrongPin = await deriveAccountKey('4472', PHONE, SHARE);
check('a different PIN gives a different vault', wrongPin !== first);
const otherPhone = await deriveAccountKey('4471', OTHER_PHONE, shareFor(OTHER_PHONE));
check('a different phone gives a different vault', otherPhone !== first);

/* ---------------------------------------------------------------- */
console.log('\n[3] The server share is load-bearing');
// This is the attack the naive design allows: phone is public, so grind the PIN space.
const withoutShare = await deriveAccountKey('4471', PHONE, '');
check('omitting the share yields a different key entirely', withoutShare !== first);

const guessedShare = shareFor(PHONE).slice(0, -1) + (shareFor(PHONE).slice(-1) === 'a' ? 'b' : 'a');
const nearMiss = await deriveAccountKey('4471', PHONE, guessedShare);
check('a share wrong in one character yields an unrelated key', nearMiss !== first);

console.log(`  share entropy: ${SHARE.length * 4} bits — an attacker with only the phone number`);
console.log('  has nothing to grind against, because the share is not derivable from it.');

/* ---------------------------------------------------------------- */
console.log('\n[4] Every derived key is a valid secp256k1 scalar');
const N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
let allValid = true;
for (const pin of ['0000', '1234', '9999', '0001']) {
  const key = await deriveAccountKey(pin, PHONE, SHARE);
  const scalar = BigInt(key);
  if (!(scalar > 0n && scalar < N)) allValid = false;
  privateKeyToAccount(key); // throws if viem disagrees
}
check('sampled PINs all produce usable accounts', allValid);

/* ---------------------------------------------------------------- */
console.log('\n[5] The attempt limit is what actually protects the PIN');
const { MAX_PIN_ATTEMPTS } = await import('../lib/MerchantIdentity.ts');
console.log(`  wrong PINs tolerated before the local share is wiped: ${MAX_PIN_ATTEMPTS}`);
check('the limit is small enough to matter', MAX_PIN_ATTEMPTS <= 10, `${MAX_PIN_ATTEMPTS}`);
check('and a wipe is recoverable, since the key is derived not stored',
  (await deriveAccountKey('4471', PHONE, SHARE)) === first);

console.log(failures === 0 ? '\nIdentity derivation holds.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
