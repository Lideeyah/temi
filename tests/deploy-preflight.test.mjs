/**
 * Rehearses the exact sequence scripts/deploy.mjs performs, against the real bytecode in a local
 * EVM. Deployment spends real gas and setTrustedSourcePortal / setTrustedPriceFeed are both
 * write-once, so a mistake in the ordering is not something to discover on-chain.
 */
import { parseEther, formatEther } from 'viem';
import { createChain } from './evm-harness.mjs';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const DEPLOYER = '0x042c27cbf84003e59d08d85b1bda54235d1f576f'; // the real deployer
const PORTAL = '0x00000000000000000000000000000000000000a1';
const AGGREGATOR = '0x719e22e3d4b690e5d96ccb40619180b5427f14ae'; // live Sepolia ETH/USD
const CHAIN_KEY_SEPOLIA = 1n;

const chain = await createChain();
await chain.fund(DEPLOYER, parseEther('3'));
console.log('\nRehearsing deployment with 3 tCTC, as the faucet would provide\n');

console.log('[1] Deploy TemiVault');
const vault = await chain.deploy('TemiVault', [DEPLOYER], DEPLOYER);
check('deployed', /^0x[0-9a-f]{40}$/.test(vault.address), vault.address);
check('treasury is the deployer', (await chain.call(vault, 'treasury', [], { from: DEPLOYER })).value.toLowerCase() === DEPLOYER);
check('arbiter defaults to the treasury', (await chain.call(vault, 'arbiter', [], { from: DEPLOYER })).value.toLowerCase() === DEPLOYER);

console.log('\n[2] Wire the trusted source portal for chain key 1');
const wire = await chain.call(vault, 'setTrustedSourcePortal', [CHAIN_KEY_SEPOLIA, PORTAL], { from: DEPLOYER });
check('portal registered', wire.ok, wire.revert);
check('stored', (await chain.call(vault, 'trustedSourcePortal', [CHAIN_KEY_SEPOLIA], { from: DEPLOYER })).value.toLowerCase() === PORTAL);

console.log('\n[3] Register the Chainlink aggregator');
const feed = await chain.call(vault, 'setTrustedPriceFeed', [CHAIN_KEY_SEPOLIA, AGGREGATOR], { from: DEPLOYER });
check('feed registered', feed.ok, feed.revert);
check('stored', (await chain.call(vault, 'trustedPriceFeed', [CHAIN_KEY_SEPOLIA], { from: DEPLOYER })).value.toLowerCase() === AGGREGATOR);

console.log('\n[4] Set the tCTC/USD governance parameter');
const price = await chain.call(vault, 'setCtcUsdPrice', [parseEther('0.90')], { from: DEPLOYER });
check('price set', price.ok, price.revert);
check('stored as 18dp', (await chain.call(vault, 'ctcUsdWad', [], { from: DEPLOYER })).value === parseEther('0.90'));

console.log('\n[5] Seed the conduit float');
const float = await chain.call(vault, 'fundConduitLiquidity', [], { from: DEPLOYER, value: parseEther('2') });
check('float funded', float.ok, float.revert);
const backing = (await chain.call(vault, 'conduitBackingAvailable', [], { from: DEPLOYER })).value;
check('backing available', backing === parseEther('2'), `${formatEther(backing)} tCTC`);

console.log('\n[6] The deployed vault is immediately usable');
const dep = await chain.call(vault, 'depositReserve', [], { from: DEPLOYER, value: parseEther('0.5') });
check('accepts a deposit', dep.ok, dep.revert);
const reserve = (await chain.call(vault, 'getReserve', [DEPLOYER], { from: DEPLOYER })).value;
check('85/15 split applied', reserve.tier1PersonalBalance === parseEther('0.425'), formatEther(reserve.tier1PersonalBalance));
check('cross-chain intake is closed until a price is proven',
  !(await chain.call(vault, 'convertSourceValueToTctc', [parseEther('1')], { from: DEPLOYER })).ok);

console.log('\n[7] Write-once holds after deployment');
check('portal cannot be repointed',
  (await chain.call(vault, 'setTrustedSourcePortal', [CHAIN_KEY_SEPOLIA, '0x00000000000000000000000000000000000000ff'], { from: DEPLOYER })).revert === 'PortalAlreadyConfigured');
check('feed cannot be repointed',
  (await chain.call(vault, 'setTrustedPriceFeed', [CHAIN_KEY_SEPOLIA, '0x00000000000000000000000000000000000000ff'], { from: DEPLOYER })).revert === 'PriceFeedAlreadyConfigured');

console.log('\n[8] Conduit float is recoverable — it must not be a one-way trip');
const before = await chain.balanceOf(DEPLOYER);
const out = await chain.call(vault, 'withdrawConduitLiquidity', [parseEther('0.5')], { from: DEPLOYER });
const after = await chain.balanceOf(DEPLOYER);
check('treasury can reclaim unallocated float', out.ok, out.revert);
check('funds actually returned', after - before === parseEther('0.5'), formatEther(after - before));
check('backing reduced', (await chain.call(vault, 'conduitBackingAvailable', [], { from: DEPLOYER })).value === parseEther('1.5'));

const overdraw = await chain.call(vault, 'withdrawConduitLiquidity', [parseEther('999')], { from: DEPLOYER });
check('cannot overdraw', !overdraw.ok, overdraw.revert);
const notTreasury = await chain.call(vault, 'withdrawConduitLiquidity', [parseEther('0.1')], { from: '0x00000000000000000000000000000000000000ee' });
check('only the treasury may reclaim', notTreasury.revert === 'NotTreasury', notTreasury.revert);

// Money already credited to an operator must be unreachable from here.
const reserveNow = (await chain.call(vault, 'getReserve', [DEPLOYER], { from: DEPLOYER })).value;
check('an operator\'s credited reserve is untouchable by the treasury', reserveNow.tier1PersonalBalance > 0n);

const held = (await chain.call(vault, 'totalReserves', [], { from: DEPLOYER })).value;
console.log(`\n  vault holds ${formatEther(held)} tCTC after the rehearsal`);

console.log(failures === 0 ? '\nDeployment sequence rehearses cleanly.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
