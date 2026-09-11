/**
 * Opening an existing vault, and refusing to pretend when there is none.
 *
 * The key is derived, never stored, so a PIN that is off by one digit does not fail — it derives
 * a different, perfectly valid, empty account. Before sign-in existed, a merchant on a new phone
 * who mistyped would have been shown an empty vault with no explanation and would reasonably have
 * concluded their savings were gone.
 *
 * These assertions pin the two facts that make that impossible: the right PIN reaches the funded
 * account, and a wrong one reaches somewhere the chain has never heard of.
 */
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { temiVaultAbi } from '@/lib/abi/temiVault.ts';
import { deriveAccountKey } from '@/lib/MerchantIdentity.ts';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));

const PHONE = '+2348031234567';
const RIGHT_PIN = '4729';
const share = createHmac('sha512', env.OTP_SERVER_PEPPER).update(`share:${PHONE}`).digest('hex');

const pub = createPublicClient({ transport: http('https://rpc.cc3-testnet.creditcoin.network') });
const contract = { address: '0x17766312c7300d01aed58174bc6ff39944272a2c', abi: temiVaultAbi };

const lookup = async (pin) => {
  const address = privateKeyToAccount(await deriveAccountKey(pin, PHONE, share)).address;
  const [reserve, assets] = await Promise.all([
    pub.readContract({ ...contract, functionName: 'getReserve', args: [address] }),
    pub.readContract({ ...contract, functionName: 'getOwnedAssets', args: [address] }),
  ]);
  return { address, exists: reserve.lifetimeDeposits > 0n || assets.length > 0 };
};

console.log('\n[1] The right PIN opens the funded vault');
const right = await lookup(RIGHT_PIN);
check('vault found on chain', right.exists, right.address);

console.log('\n[2] A PIN off by one digit is not silently a new vault');
for (const wrong of ['4728', '4739', '4729'.split('').reverse().join('')]) {
  const got = await lookup(wrong);
  check(
    `PIN ${wrong} reports no vault`,
    !got.exists && got.address !== right.address,
    `derived ${got.address.slice(0, 10)}… — a real address the chain has never seen`,
  );
}

console.log('\n[3] Derivation is stable, or nobody could ever sign in twice');
check('same inputs, same address', (await lookup(RIGHT_PIN)).address === right.address);

console.log(`\n${failures === 0 ? 'All sign-in checks passed.' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
