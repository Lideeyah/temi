/**
 * Executes the compiled TemiVault bytecode in a local EVM. These are not models of the
 * contract — they are the contract, with real storage, real reverts and real value transfers.
 *
 * Run: node tests/vault.test.mjs
 */
import { keccak256, toHex, parseEther, formatEther } from 'viem';
import { createChain } from './evm-harness.mjs';

const E = parseEther;
const fmt = (wei) => `${Number(formatEther(wei)).toFixed(4)} tCTC`;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const TREASURY = '0x1111111111111111111111111111111111111111';
const MERCHANT = '0x2222222222222222222222222222222222222222';
const ATTACKER = '0x3333333333333333333333333333333333333333';
const OTHER = '0x4444444444444444444444444444444444444444';

// Telemetry that clears both on-chain gates.
const GOOD = { jitter: 2757n, parallax: 901n };

const chain = await createChain();
for (const who of [TREASURY, MERCHANT, ATTACKER, OTHER]) await chain.fund(who, E('10000'));
const vault = await chain.deploy('TemiVault', [TREASURY], TREASURY);
console.log(`\nTemiVault executing in-process at ${vault.address}\n`);

const assetId = (s) => keccak256(toHex(s));

/* ---------------------------------------------------------------- */
console.log('[1] Deposit splits 85/15 with no wei stranded');
await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('10') });
const reserve = (await chain.call(vault, 'getReserve', [MERCHANT], { from: MERCHANT })).value;
const pool = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: MERCHANT })).value;
check('Tier 1 = 85%', reserve.tier1PersonalBalance === E('8.5'), fmt(reserve.tier1PersonalBalance));
check('Tier 2 = 15%', pool === E('1.5'), fmt(pool));
check('nothing stranded', reserve.tier1PersonalBalance + pool === E('10'));
check('lifetimeDeposits tracked', reserve.lifetimeDeposits === E('10'));

/* ---------------------------------------------------------------- */
console.log('\n[2] Asset identity is global and binds once');
const gen = assetId('FIRMAN-3.5KVA-0001');
check('register succeeds', (await chain.call(vault, 'registerAsset', [gen, 0, E('5'), 0n], { from: MERCHANT })).ok);
const dupe = await chain.call(vault, 'registerAsset', [gen, 0, E('5'), 0n], { from: ATTACKER });
check('another operator cannot re-register the same plate', !dupe.ok, dupe.revert);
const noCell = await chain.call(vault, 'registerAsset', [assetId('shop-x'), 1, E('5'), 0n], { from: MERCHANT });
check('fixed property requires an H3 cell', !noCell.ok, noCell.revert);

/* ---------------------------------------------------------------- */
console.log('\n[3] Attestation gates are enforced on-chain, not just in the client');
const weakTremor = await chain.call(vault, 'settleClaim', [gen, E('1'), 99n, GOOD.parallax, 0n], { from: MERCHANT });
check('tremor below 100 reverts', !weakTremor.ok, weakTremor.revert);
const weakParallax = await chain.call(vault, 'settleClaim', [gen, E('1'), GOOD.jitter, 849n, 0n], { from: MERCHANT });
check('parallax below 850 reverts', !weakParallax.ok, weakParallax.revert);
const notOwner = await chain.call(vault, 'settleClaim', [gen, E('1'), GOOD.jitter, GOOD.parallax, 0n], { from: ATTACKER });
check('non-owner cannot claim', !notOwner.ok, notOwner.revert);
const overDeclared = await chain.call(vault, 'settleClaim', [gen, E('6'), GOOD.jitter, GOOD.parallax, 0n], { from: MERCHANT });
check('claim above declared value reverts', !overDeclared.ok, overDeclared.revert);

/* ---------------------------------------------------------------- */
console.log('\n[4] Spatial lock for fixed property');
const shop = assetId('h3+meter');
await chain.call(vault, 'registerAsset', [shop, 1, E('5'), 622234000000000000n], { from: MERCHANT });
const wrongCell = await chain.call(vault, 'settleClaim', [shop, E('1'), GOOD.jitter, GOOD.parallax, 622234000000000001n], { from: MERCHANT });
check('wrong H3 cell reverts', !wrongCell.ok, wrongCell.revert);
const rightCell = await chain.call(vault, 'settleClaim', [shop, E('1'), GOOD.jitter, GOOD.parallax, 622234000000000000n], { from: MERCHANT });
check('matching H3 cell settles', rightCell.ok, rightCell.ok ? fmt(rightCell.value) : rightCell.revert);

/* ---------------------------------------------------------------- */
console.log('\n[5] Tier 1 is genuinely unencumbered');
const before = await chain.balanceOf(MERCHANT);
const wd = await chain.call(vault, 'withdrawTier1', [E('1')], { from: MERCHANT });
const after = await chain.balanceOf(MERCHANT);
check('withdrawal succeeds', wd.ok, wd.revert);
check('funds actually moved', after - before === E('1'), fmt(after - before));
const tooMuch = await chain.call(vault, 'withdrawTier1', [E('9999')], { from: MERCHANT });
check('over-withdrawal reverts', !tooMuch.ok, tooMuch.revert);

/* ---------------------------------------------------------------- */
console.log('\n[6] THE DRAIN ATTACK — many assets, one small deposit');
// Build a realistic pool from honest merchants.
for (let i = 0; i < 5; i++) {
  const m = `0x${(0xaa00 + i).toString(16).padStart(40, '0')}`;
  await chain.fund(m, E('200'));
  await chain.call(vault, 'depositReserve', [], { from: m, value: E('100') });
}
const poolBefore = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;

// Attacker deposits once, then registers ten assets and claims on every one.
await chain.call(vault, 'depositReserve', [], { from: ATTACKER, value: E('1') });
const deposit = E('1');
const attackerStart = await chain.balanceOf(ATTACKER);

let settled = 0;
let reverted = 0;
for (let i = 0; i < 10; i++) {
  const id = assetId(`fake-asset-${i}`);
  await chain.call(vault, 'registerAsset', [id, 0, E('50'), 0n], { from: ATTACKER });
  const r = await chain.call(vault, 'settleClaim', [id, E('50'), GOOD.jitter, GOOD.parallax, 0n], { from: ATTACKER });
  if (r.ok) settled++;
  else reverted++;
}
const attackerEnd = await chain.balanceOf(ATTACKER);
const extracted = attackerEnd - attackerStart;
const poolAfter = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
const tier2Taken = poolBefore - poolAfter;

console.log(`  pool before ${fmt(poolBefore)} -> after ${fmt(poolAfter)}`);
console.log(`  claims settled ${settled}, reverted ${reverted}`);
console.log(`  extracted ${fmt(extracted)} on a ${fmt(deposit)} deposit  (${(Number(extracted) / Number(deposit)).toFixed(2)}x)`);

check('Tier 2 drawn never exceeds 3x lifetime deposits', tier2Taken <= deposit * 3n, `${fmt(tier2Taken)} vs cap ${fmt(deposit * 3n)}`);
check('total extraction bounded by Tier 1 + 3x', extracted <= (deposit * 85n) / 100n + deposit * 3n);
check('later claims are refused once the allowance is spent', reverted > 0, `${reverted} reverted`);
check('pool retains most of its value', poolAfter > (poolBefore * 90n) / 100n, `${fmt(poolAfter)} left`);

const headroom = (await chain.call(vault, 'quoteTier2Headroom', [ATTACKER], { from: TREASURY })).value;
check('headroom reports zero once exhausted', headroom === 0n, fmt(headroom));

/* ---------------------------------------------------------------- */
console.log('\n[7] Vault stays solvent');
const held = (await chain.call(vault, 'totalReserves', [], { from: TREASURY })).value;
const tier1Total = (await chain.call(vault, 'totalTier1Balance', [], { from: TREASURY })).value;
const poolNow = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
console.log(`  held ${fmt(held)} vs obligations ${fmt(tier1Total + poolNow)}`);
check('balance covers every claim on it', held >= tier1Total + poolNow);

console.log(failures === 0 ? '\nAll vault assertions passed against the real bytecode.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
