/**
 * National number validation.
 *
 * This is not cosmetic. The verified number is half the vault key: PBKDF2(PIN, serverShare ‖
 * phone ‖ domain). A number that is one digit long or short still derives a key, still verifies
 * in demo mode, and still creates a vault — a different vault, from a number that does not exist,
 * which the merchant can never reach again by typing their real one.
 *
 * The validator previously allowed a digit either side of the plan length. These assertions pin
 * it shut.
 */
const { isValidNationalNumber, normaliseNationalNumber, toE164, REGION_LIST } = await import(
  '../lib/regions.ts'
);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const byId = (id) => REGION_LIST.find((r) => r.id === id);

/* ---------------------------------------------------------------- */
console.log('\n[1] Exactly the plan length, for every jurisdiction');

for (const region of REGION_LIST) {
  const n = region.nationalDigits;
  const exact = '9'.repeat(n);
  check(`${region.id}: ${n} digits accepted`, isValidNationalNumber(exact, region));
  check(`${region.id}: ${n - 1} digits refused`, !isValidNationalNumber('9'.repeat(n - 1), region));
  check(`${region.id}: ${n + 1} digits refused`, !isValidNationalNumber('9'.repeat(n + 1), region));
}

/* ---------------------------------------------------------------- */
console.log('\n[2] The case that produced an unrecoverable vault');

const ng = byId('NG');
check(
  'a fat-fingered eleventh digit is refused',
  !isValidNationalNumber('90646781145', ng),
  'would have become +23490646781145',
);
check('the real number is accepted', isValidNationalNumber('9064678114', ng), toE164('9064678114', ng));
check(
  'the trunk zero is still forgiven',
  isValidNationalNumber('09064678114', ng) && toE164('09064678114', ng) === '+2349064678114',
);

/* ---------------------------------------------------------------- */
console.log('\n[3] Non-digits carry no meaning');

check('letters alone are refused', !isValidNationalNumber('abcdefghij', ng));
check('empty is refused', !isValidNationalNumber('', ng));
check('spaces and dashes are tolerated inside a valid number', isValidNationalNumber('906-467-8114', ng));
check('normalisation drops everything but digits', normaliseNationalNumber('+234 (906) 467-8114') === '2349064678114');

/* ---------------------------------------------------------------- */
console.log('\n[4] Same number, different jurisdiction, different key');

check(
  'NG and KE produce different E.164 for the same keystrokes',
  toE164('712345678', byId('KE')) !== toE164('712345678', ng),
);

console.log(`\n${failures === 0 ? 'All phone checks passed.' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
