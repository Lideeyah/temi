/**
 * Reports what has changed in the contracts since the live deployment.
 *
 * The app builds its ABI from source, so once the source moves ahead of the deployed bytecode
 * it becomes possible to ship a UI that calls a function which does not exist on-chain. That
 * fails at the worst possible moment — in front of whoever is judging. This makes the gap
 * visible on demand instead.
 *
 *   npm run drift
 */
import fs from 'node:fs';
import { createPublicClient, http, defineChain, keccak256, toHex } from 'viem';
import { execSync } from 'node:child_process';

const DEPLOYED = {
  TemiVault: { address: '0x17766312c7300d01aed58174bc6ff39944272a2c', chain: 'cc3-testnet' },
};

const cc = defineChain({
  id: 102031, name: 'cc3', nativeCurrency: { name: 'tCTC', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
});
const client = createPublicClient({ chain: cc, transport: http() });

const solidityType = (input) =>
  input.type.startsWith('tuple')
    ? `(${input.components.map(solidityType).join(',')})${input.type.slice(5)}`
    : input.type;
const signature = (f) => `${f.name}(${f.inputs.map(solidityType).join(',')})`;
const selector = (f) => keccak256(toHex(signature(f))).slice(2, 10);

let drifted = false;

for (const [name, { address, chain }] of Object.entries(DEPLOYED)) {
  const { abi } = JSON.parse(fs.readFileSync(`artifacts/${name}.json`, 'utf8'));
  const onchain = await client.getBytecode({ address });

  console.log(`\n${name} @ ${address}  (${chain})`);
  console.log(`  deployed runtime: ${((onchain.length - 2) / 2).toLocaleString()} bytes`);

  const missing = [...new Set(
    abi.filter((f) => f.type === 'function' && !onchain.includes(selector(f))).map((f) => f.name),
  )];

  if (missing.length === 0) {
    console.log('  in sync with source.');
    continue;
  }

  drifted = true;
  console.log(`  ${missing.length} function(s) in source but not deployed:`);
  for (const fn of missing) {
    let callSites = 0;
    try {
      callSites = Number(
        execSync(`grep -rl "functionName: '${fn}'" components hooks lib app 2>/dev/null | wc -l`)
          .toString().trim(),
      );
    } catch { /* grep found nothing */ }
    const flag = callSites > 0 ? 'CALLED BY THE APP — would revert' : 'not called by the app';
    console.log(`    ${fn.padEnd(28)} ${flag}`);
  }
}

console.log(
  drifted
    ? '\nSource is ahead of the chain. Safe while nothing above is called by the app.\n'
    : '\nNo drift.\n',
);
