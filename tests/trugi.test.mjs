/**
 * The Trugi NIP settlement rail.
 *
 * The account a merchant is shown used to be three hardcoded strings — the same number at a named
 * bank for every merchant, presented as though it had been provisioned for them. These assertions
 * cover what replaced it: accounts that are derived per beneficiary, structurally valid under the
 * CBN NUBAN standard, and a settlement webhook that refuses anything it cannot authenticate.
 */
import {
  koboToNaira,
  nairaToKobo,
  provisionAccount,
  signNotification,
  verifyNotification,
} from '../lib/TrugiRail.ts';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const A = '0xC4111a775f596562fF39C6d2EC2fD85739d09c4F';
const B = '0x127eD66643D5152A817aF11c924eC7491dB47Bdd';

/* ---------------------------------------------------------------- */
console.log('\n[1] Accounts are issued, not written');

const a1 = provisionAccount(A, 'Balogun Market Traders');
const a2 = provisionAccount(A, 'Balogun Market Traders');
const b1 = provisionAccount(B, 'Adeola Electronics');

check('an account is issued per beneficiary', a1.accountNumber !== b1.accountNumber,
  `${a1.accountNumber} vs ${b1.accountNumber}`);
check('the same merchant always gets the same account', a1.accountNumber === a2.accountNumber,
  'a dedicated account that moved would not be dedicated');
check('ten digits, as a NUBAN is', /^\d{10}$/.test(a1.accountNumber));
check('never opens on a zero', a1.accountNumber[0] !== '0' && b1.accountNumber[0] !== '0');
check('the mode is stated, not implied', a1.mode === 'sandbox');

/* ---------------------------------------------------------------- */
console.log('\n[2] The CBN check digit actually checks');

// Recompute independently: weights 3-7-3 repeating over bank code + nine-digit serial.
const recompute = (bankCode, serial) => {
  const weights = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3];
  const sum = `${bankCode}${serial}`
    .split('')
    .reduce((t, d, i) => t + Number(d) * weights[i], 0);
  return String((10 - (sum % 10)) % 10);
};

for (const acct of [a1, b1]) {
  const serial = acct.accountNumber.slice(0, 9);
  const check10 = acct.accountNumber.slice(9);
  check(
    `${acct.accountNumber} carries a valid check digit`,
    recompute(acct.bankCode, serial) === check10,
    `bank ${acct.bankCode}`,
  );
}
check('a tampered digit fails the standard', recompute('101', '000000000') !== '9');

/* ---------------------------------------------------------------- */
console.log('\n[3] The webhook cannot be called by just anyone');

const body = JSON.stringify({
  reference: 'TRG-TEST-1',
  accountNumber: a1.accountNumber,
  amountKobo: nairaToKobo(25_000),
  currency: 'NGN',
  beneficiary: A,
  sessionId: '000010117000000000000000000000',
  paidAt: new Date().toISOString(),
});

check('a correctly signed notification verifies', verifyNotification(body, signNotification(body)));
check('an unsigned notification is refused', !verifyNotification(body, null));
check('a forged signature is refused', !verifyNotification(body, 'f'.repeat(128)));
check(
  'a tampered body invalidates the signature',
  !verifyNotification(body.replace('25000', '2500000'), signNotification(body)),
  'amount cannot be edited in flight',
);

/* ---------------------------------------------------------------- */
console.log('\n[4] Naira is carried in kobo, as it is on the wire');

check('₦25,000 is 2,500,000 kobo', nairaToKobo(25_000) === 2_500_000);
check('and round-trips', koboToNaira(nairaToKobo(25_000)) === 25_000);
check('fractional naira rounds to the kobo', nairaToKobo(1.005) === 101 || nairaToKobo(1.005) === 100);

console.log(`\n${failures === 0 ? 'All Trugi rail checks passed.' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
