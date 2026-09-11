/**
 * Every contract write must use the wallet client's own account.
 *
 * The merchant path signs locally: createWalletClient is given
 * privateKeyToAccount(derivedKey), which signs in the browser and broadcasts
 * eth_sendRawTransaction. But viem decides how to sign from the `account` passed to
 * writeContract, not from the client. Hand it a bare address string and it treats that as a
 * JSON-RPC account, calls eth_sendTransaction, and asks the public RPC node to sign for an
 * address it has never heard of. The node answers:
 *
 *     { code: -32603, message: "no signer available" }
 *
 * which viem wraps as `The contract function "depositReserve" reverted with the following
 * reason:` followed by nothing — indistinguishable, on screen, from the contract rejecting the
 * deposit. Every write in the app carried this, so no phone-and-PIN merchant could transact at
 * all.
 *
 * Passing `walletClient.account` keeps both paths correct: a local account for the merchant, and
 * viem's JSON-RPC account for an injected extension wallet, which does want eth_sendTransaction.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const roots = ['components', 'hooks', 'lib', 'app'];
const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) files.push(full);
  }
};
for (const r of roots) walk(r);

console.log('\n[1] No write hands viem a bare address');

let sites = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  // API routes sign with their own server-side wallet and are not part of this rule.
  if (file.includes(`${join('app', 'api')}`)) continue;

  const re = /writeContract\(\{([\s\S]*?)\n\s*\}\)/g;
  let match;
  while ((match = re.exec(source))) {
    sites++;
    const body = match[1];
    const accountLine = body.split('\n').find((l) => /^\s*account[,:]/.test(l));
    const ok = accountLine && /walletClient\.account|\.walletClient\.account/.test(accountLine);
    check(
      `${file} · ${(/functionName: '([^']+)'/.exec(body) ?? [, '?'])[1]}`,
      Boolean(ok),
      ok ? undefined : `bare account → eth_sendTransaction: ${accountLine?.trim() ?? 'no account passed'}`,
    );
  }
}

check('every write site was inspected', sites > 0, `${sites} sites`);

console.log(`\n${failures === 0 ? 'All signer checks passed.' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
