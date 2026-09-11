import { createPublicClient, http, defineChain, formatEther } from 'viem';
import fs from 'node:fs';

const cc = defineChain({
  id: 102031, name: 'cc3', nativeCurrency: { name: 'tCTC', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
});
const client = createPublicClient({ chain: cc, transport: http() });
const { abi } = JSON.parse(fs.readFileSync('artifacts/TemiVault.json', 'utf8'));
const address = '0x17766312c7300d01aed58174bc6ff39944272a2c';

const read = (functionName, args = []) => client.readContract({ address, abi, functionName, args });

const code = await client.getBytecode({ address });
console.log(`deployed bytecode: ${((code.length - 2) / 2).toLocaleString()} bytes`);

const [treasury, arbiter, feed, portal, ctcUsd, backing, t1bps, minPar, window, instantCap, held] =
  await Promise.all([
    read('treasury'), read('arbiter'), read('trustedPriceFeed', [1n]), read('trustedSourcePortal', [1n]),
    read('ctcUsdWad'), read('conduitBackingAvailable'), read('TIER1_SPLIT_BPS'),
    read('MIN_PARALLAX_SCORE'), read('CHALLENGE_WINDOW'), read('INSTANT_TIER2_CAP_BPS'),
    read('totalReserves'),
  ]);

const row = (k, v) => console.log(`  ${k.padEnd(26)} ${v}`);
console.log('\n-- configuration --');
row('treasury', treasury);
row('arbiter', arbiter);
row('price feed (key 1)', feed);
row('source portal (key 1)', portal === '0x0000000000000000000000000000000000000000' ? 'unset (writable)' : portal);
row('tCTC/USD', `$${formatEther(ctcUsd)}`);
row('conduit backing', `${formatEther(backing)} tCTC`);
row('vault holds', `${formatEther(held)} tCTC`);

console.log('\n-- invariants baked into the bytecode --');
row('Tier 1 split', `${Number(t1bps) / 100}%`);
row('parallax floor', `${minPar} / 1000`);
row('challenge window', `${Number(window) / 3600} hours`);
row('instant settlement cap', `${Number(instantCap) / 100}% of the buffer`);

console.log('\n-- write-once guards are live --');
for (const [fn, arg] of [['setTrustedPriceFeed', '0x00000000000000000000000000000000000000ff']]) {
  try {
    await client.simulateContract({ address, abi, functionName: fn, args: [1n, arg], account: treasury });
    console.log(`  FAIL  ${fn} was repointable`);
  } catch (e) {
    console.log(`  ok    ${fn} reverts: ${e.cause?.data?.errorName ?? 'reverted'}`);
  }
}

console.log('\n-- cross-chain intake is closed until a price is proven --');
try {
  await read('convertSourceValueToTctc', [10n ** 18n]);
  console.log('  FAIL  it priced without an observation');
} catch (e) {
  console.log(`  ok    reverts: ${e.cause?.data?.errorName ?? 'reverted'}`);
}
