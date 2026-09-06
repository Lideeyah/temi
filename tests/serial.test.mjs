/**
 * The serial matcher, against the OCR failure modes that actually occur on stamped plates.
 * Pure logic — no camera, no worker.
 */
import { keccak256, stringToHex } from 'viem';
import { matchSerial, tokenise, expandConfusions, normaliseToken } from '../lib/SerialPlateReader.ts';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const SERIAL = 'TG9500DE4471';
const ASSET_ID = keccak256(stringToHex(SERIAL));
const OTHER_ID = keccak256(stringToHex('LAWNMOWER-XJ22'));

console.log(`\nRegistered serial ${SERIAL}\nassetId ${ASSET_ID}\n`);

/* ---------------------------------------------------------------- */
console.log('[1] Clean read, with the rest of the plate around it');
const clean = `FIRMAN POWER EQUIPMENT
MODEL SPG3000
SERIAL NO: ${SERIAL}
MADE IN CHINA  50Hz  220V`;
const m1 = matchSerial(clean, ASSET_ID);
check('finds the serial among the plate text', m1 !== null, m1?.serial);
check('did not need a correction', m1?.corrected === false);

/* ---------------------------------------------------------------- */
console.log('\n[2] OCR split a single stamped run into words');
const split = 'SERIAL NO TG 9500 DE 4471 MADE IN CHINA';
const m2 = matchSerial(split, ASSET_ID);
check('recovers via adjacent joins', m2 !== null, m2?.serial);

/* ---------------------------------------------------------------- */
console.log('\n[3] Shape confusions — 0/O, 1/I, 5/S');
const confused = 'SERIAL NO: TG95OODE447I';   // two O-for-0 and one I-for-1
const m3 = matchSerial(confused, ASSET_ID);
check('recovers a 3-character misread', m3 !== null, m3?.serial);
check('flagged as corrected', m3?.corrected === true);

const confused2 = 'SERIAL N0 TG95OODE4471';
check('recovers a 2-character misread', matchSerial(confused2, ASSET_ID) !== null);

/* ---------------------------------------------------------------- */
console.log('\n[4] The whole point — a different machine must not match');
const lawnmower = `VICTA LAWNMOWER
SERIAL NO: LAWNMOWER-XJ22
18 INCH CUT`;
check('scanning another machine fails', matchSerial(lawnmower, ASSET_ID) === null);
check('...and that other machine matches its own id', matchSerial(lawnmower, OTHER_ID) !== null);

/* ---------------------------------------------------------------- */
console.log('\n[5] Degenerate input');
check('empty text', matchSerial('', ASSET_ID) === null);
check('pure noise', matchSerial('|||  ~~~ ###', ASSET_ID) === null);
check('a near miss is still a miss', matchSerial('TG9500DE4472', ASSET_ID) === null);

/* ---------------------------------------------------------------- */
console.log('\n[6] Search stays bounded');
const variants = expandConfusions(SERIAL);
check('variant expansion is capped', variants.length <= 512, `${variants.length} variants`);
const heavy = matchSerial('A'.repeat(200) + ' ' + Array.from({ length: 60 }, (_, i) => `TOKEN${i}`).join(' '), ASSET_ID);
check('noisy page does not hang', heavy === null);

console.log('\n[7] Normalisation');
check('lowercases to upper', normaliseToken('tg9500de4471') === SERIAL);
check('strips punctuation', normaliseToken('TG9500:DE4471') === SERIAL);
check('tokeniser keeps hyphen forms', tokenise('SN: AB-1234-CD').includes('AB-1234-CD'));

console.log(failures === 0 ? '\nSerial matcher holds.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
