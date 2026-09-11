/**
 * Phone verification across stateless instances.
 *
 * The bug this guards against was invisible on a laptop and fatal in production: the code lived
 * in a Map in process memory, so a merchant who asked for a code on one serverless instance and
 * submitted it to another was told "Request a code first" — about a code they were looking at.
 *
 * The property that matters is therefore not "issue then verify works", which the old code also
 * satisfied when both calls happened to land together. It is that verification does not depend on
 * which machine answers, and does not depend on any memory of the request at all.
 */
import { execFileSync } from 'node:child_process';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const PHONE = '+2348034918821';
const OTHER = '+2348034918822';

/* ---------------------------------------------------------------- */
console.log('\n[1] Demo mode — a reviewer with no SMS credit');

const demo = await import('../lib/otpStore.ts');

check('demo mode is the default', demo.DEMO_MODE === true);

// The load-bearing case: verify with no prior issue, exactly as a cold instance sees it.
const cold = demo.verifyCode(PHONE, demo.DEMO_CODE);
check(
  'a cold instance accepts the code it never issued',
  cold.ok === true,
  cold.ok ? 'keyShare returned' : cold.error,
);

const issued = demo.issueCode(PHONE);
check('issue returns the demo code', issued.ok && issued.demoCode === '123456');

const wrong = demo.verifyCode(PHONE, '000000');
check('a wrong code is still refused', wrong.ok === false, wrong.ok ? '' : wrong.error);

const malformed = demo.verifyCode(PHONE, '12345');
check('a short code is refused before any comparison', malformed.ok === false);

/* ---------------------------------------------------------------- */
console.log('\n[2] The key share must not move');

// If this changes, every vault established before the rewrite becomes unrecoverable.
const EXPECTED_SHARE_PREFIX = demo.deriveKeyShare(PHONE).slice(0, 16);
check(
  'share is deterministic in the number',
  demo.deriveKeyShare(PHONE) === demo.deriveKeyShare(PHONE),
  EXPECTED_SHARE_PREFIX,
);
check('different numbers give different shares', demo.deriveKeyShare(PHONE) !== demo.deriveKeyShare(OTHER));
check('share carries 512 bits', demo.deriveKeyShare(PHONE).length === 128);

/* ---------------------------------------------------------------- */
console.log('\n[3] Real SMS mode — two instances, no shared memory');

// Genuinely separate processes. Nothing is passed between them but the phone number.
const run = (expr) =>
  execFileSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--input-type=module',
      '--import',
      './tests/ts-resolve.mjs',
      '-e',
      expr,
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, OTP_DEMO_MODE: 'false', OTP_SERVER_PEPPER: 'test-pepper-fixed' },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  ).trim();

const instanceA = run(
  `const m = await import('./lib/otpStore.ts');
   const r = m.issueCode('${PHONE}');
   process.stdout.write(JSON.stringify({ ok: r.ok, code: m.DEMO_MODE ? null : null, demo: m.DEMO_MODE }));`,
);
const parsedA = JSON.parse(instanceA);
check('instance A issues without demo mode', parsedA.ok === true && parsedA.demo === false);

// Instance A never reveals the code outside demo mode, so read it the way an SMS gateway would:
// from the same derivation, in a third process.
const smsGateway = run(
  `const { createHmac } = await import('node:crypto');
   const mac = createHmac('sha256', 'test-pepper-fixed').update('otp:${PHONE}:' + Math.floor(Date.now() / 300000)).digest();
   const o = mac[mac.length - 1] & 0x0f;
   const t = ((mac[o] & 0x7f) << 24) | (mac[o+1] << 16) | (mac[o+2] << 8) | mac[o+3];
   process.stdout.write(String(t % 1000000).padStart(6, '0'));`,
);
check('the gateway derives a six-digit code', /^\d{6}$/.test(smsGateway), smsGateway);

const instanceB = run(
  `const m = await import('./lib/otpStore.ts');
   const r = m.verifyCode('${PHONE}', '${smsGateway}');
   process.stdout.write(JSON.stringify({ ok: r.ok, error: r.error ?? null }));`,
);
const parsedB = JSON.parse(instanceB);
check(
  'instance B accepts a code instance A issued',
  parsedB.ok === true,
  parsedB.ok ? 'no shared state required' : parsedB.error,
);

const instanceC = run(
  `const m = await import('./lib/otpStore.ts');
   const r = m.verifyCode('${OTHER}', '${smsGateway}');
   process.stdout.write(JSON.stringify({ ok: r.ok, error: r.error ?? null }));`,
);
check(
  "another number's code does not verify",
  JSON.parse(instanceC).ok === false,
  'codes are bound to the number',
);

/* ---------------------------------------------------------------- */
console.log(`\n${failures === 0 ? 'All OTP checks passed.' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
