/**
 * Protocol revenue, against the real TemiVault bytecode.
 *
 * Two streams: a 1.5% fee on claim payouts, and a 15% share of yield earned on idle reserves.
 * What matters is that the protocol earns only when it delivers — no fee on deposits, none on
 * withdrawals, and none on a claim that gets rejected.
 */
import { parseEther, formatEther, keccak256, toHex } from 'viem';
import { createChain } from './evm-harness.mjs';

const E = parseEther;
const fmt = (w) => `${Number(formatEther(w)).toFixed(4)} tCTC`;
const netOf = (g) => g - (g * 150n) / 10000n;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const TREASURY = '0x1111111111111111111111111111111111111111';
const PROTOCOL = '0x9999999999999999999999999999999999999999';
const MERCHANT = '0x2222222222222222222222222222222222222222';
const OTHER = '0x3333333333333333333333333333333333333333';
const GOOD = { jitter: 2757n, parallax: 901n };
const assetId = (s) => keccak256(toHex(s));

const chain = await createChain();
for (const w of [TREASURY, MERCHANT, OTHER]) await chain.fund(w, E('10000'));
const vault = await chain.deploy('TemiVault', [TREASURY], TREASURY);
await chain.call(vault, 'setProtocolTreasury', [PROTOCOL], { from: TREASURY });
console.log(`\nTemiVault ${vault.address}, protocol treasury ${PROTOCOL}\n`);

/* ---------------------------------------------------------------- */
console.log('[1] Reserve sizing is on-chain, so the interface cannot invent a target');
const machineryTarget = (await chain.call(vault, 'suggestedTargetReserve', [0, E('400')], { from: TREASURY })).value;
const propertyTarget = (await chain.call(vault, 'suggestedTargetReserve', [1, E('400')], { from: TREASURY })).value;
console.log(`  400 tCTC generator -> target ${fmt(machineryTarget)}   400 tCTC shop -> target ${fmt(propertyTarget)}`);
check('machinery targets 30%', machineryTarget === E('120'), fmt(machineryTarget));
check('property targets 20%', propertyTarget === E('80'), fmt(propertyTarget));

const gen = assetId('gen-revenue');
await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('100') });
await chain.call(vault, 'registerAsset', [gen, 0, E('400'), 0n, 0n, 3n], { from: MERCHANT });
const stored = (await chain.call(vault, 'getAsset', [gen], { from: MERCHANT })).value;
check('a 0 target adopts the protocol suggestion', stored.targetReserve === E('120'), fmt(stored.targetReserve));
check('horizon recorded', stored.targetHorizonMonths === 3n);
check('registration timestamped', stored.registeredAt >= 0n);

const health = (await chain.call(vault, 'coverageHealthBps', [gen], { from: MERCHANT })).value;
console.log(`  deposited 100 against a ${fmt(E('120'))} target -> ${Number(health) / 100}% funded`);
check('coverage health reflects funding', health === 8333n, `${health} bps`);

/* ---------------------------------------------------------------- */
console.log('\n[2] No fee on money that is not a payout');
const feeAfterDeposit = (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value;
check('deposits are free', feeAfterDeposit === 0n, fmt(feeAfterDeposit));

const beforeWd = await chain.balanceOf(MERCHANT);
await chain.call(vault, 'withdrawTier1', [E('10')], { from: MERCHANT });
const afterWd = await chain.balanceOf(MERCHANT);
check('withdrawals are free', afterWd - beforeWd === E('10'), fmt(afterWd - beforeWd));
check('still no fees taken', (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value === 0n);

/* ---------------------------------------------------------------- */
console.log('\n[3] 1.5% on a delivered claim, taken atomically');
const protoBefore = await chain.balanceOf(PROTOCOL);
const merchBefore = await chain.balanceOf(MERCHANT);
const claim = E('20');
const r = await chain.call(vault, 'settleClaim', [gen, claim, GOOD.jitter, GOOD.parallax, 0n, gen], { from: MERCHANT });
const protoAfter = await chain.balanceOf(PROTOCOL);
const merchAfter = await chain.balanceOf(MERCHANT);

const expectedFee = (claim * 150n) / 10000n;
console.log(`  gross ${fmt(claim)}  fee ${fmt(protoAfter - protoBefore)}  net ${fmt(merchAfter - merchBefore)}`);
check('settled', r.ok, r.revert);
check('fee is exactly 1.5%', protoAfter - protoBefore === expectedFee, fmt(protoAfter - protoBefore));
check('merchant receives 98.5%', merchAfter - merchBefore === netOf(claim), fmt(merchAfter - merchBefore));
check('gross is conserved', (protoAfter - protoBefore) + (merchAfter - merchBefore) === claim);
check('fee accounted', (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value === expectedFee);

/* ---------------------------------------------------------------- */
console.log('\n[4] A rejected claim earns the protocol nothing');
// Build a pool large enough that a claim escrows rather than settling instantly.
for (let i = 0; i < 4; i++) {
  const m = `0x${(0xcc00 + i).toString(16).padStart(40, '0')}`;
  await chain.fund(m, E('400'));
  await chain.call(vault, 'depositReserve', [], { from: m, value: E('300') });
}
const fraud = assetId('gen-fraud-revenue');
await chain.call(vault, 'depositReserve', [], { from: OTHER, value: E('100') });
await chain.call(vault, 'registerAsset', [fraud, 0, E('90'), 0n, 0n, 3n], { from: OTHER });

const feesBeforeFraud = (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value;
const esc = await chain.call(vault, 'settleClaim', [fraud, E('90'), GOOD.jitter, GOOD.parallax, 0n, fraud], { from: OTHER });
const cid = esc.value[1];
check('claim escrowed', cid > 0n, `claimId ${cid}`);
const pending = (await chain.call(vault, 'pendingClaims', [cid], { from: OTHER })).value;

await chain.call(vault, 'challengeClaim', [cid], { from: MERCHANT, value: pending[3], timestamp: 3600n });
const feesAtChallenge = (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value;
await chain.call(vault, 'resolveChallenge', [cid, true], { from: TREASURY, timestamp: 7200n });
const feesAfterReject = (await chain.call(vault, 'totalProtocolFees', [], { from: TREASURY })).value;

console.log(`  fees before ${fmt(feesBeforeFraud)} -> after rejection ${fmt(feesAfterReject)}`);
check('no fee charged on the escrowed portion of a rejected claim', feesAfterReject === feesAtChallenge, fmt(feesAfterReject));

/* ---------------------------------------------------------------- */
console.log('\n[5] Yield: 85% to operators, 15% to the protocol');
const noStrategy = (await chain.call(vault, 'yieldStrategy', [], { from: TREASURY })).value;
check('no yield strategy is connected', noStrategy === '0x0000000000000000000000000000000000000000', noStrategy);

const tier1Total = (await chain.call(vault, 'totalTier1Balance', [], { from: TREASURY })).value;
const protoPreYield = await chain.balanceOf(PROTOCOL);
const yieldAmount = E('10');
const dist = await chain.call(vault, 'distributeYield', [], { from: TREASURY, value: yieldAmount });
const protoPostYield = await chain.balanceOf(PROTOCOL);

check('distribution accepted', dist.ok, dist.revert);
check('protocol takes exactly 15%', protoPostYield - protoPreYield === (yieldAmount * 1500n) / 10000n, fmt(protoPostYield - protoPreYield));
const toOperators = (await chain.call(vault, 'totalYieldDistributed', [], { from: TREASURY })).value;
check('85% goes to operators', toOperators === yieldAmount - (yieldAmount * 1500n) / 10000n, fmt(toOperators));

// Pro-rata by Tier 1 holding.
const merchTier1 = (await chain.call(vault, 'getReserve', [MERCHANT], { from: MERCHANT })).value.tier1PersonalBalance;
const merchPending = (await chain.call(vault, 'pendingYield', [MERCHANT], { from: MERCHANT })).value;
const expectedShare = (merchTier1 * ((toOperators * 10n ** 18n) / tier1Total)) / 10n ** 18n;
console.log(`  merchant holds ${fmt(merchTier1)} of ${fmt(tier1Total)} tier 1 -> pending ${fmt(merchPending)}`);
check('share is pro-rata to Tier 1', merchPending === expectedShare, fmt(merchPending));

/* ---------------------------------------------------------------- */
console.log('\n[6] Compounding moves yield into the withdrawable balance');
const beforeCompound = (await chain.call(vault, 'getReserve', [MERCHANT], { from: MERCHANT })).value.tier1PersonalBalance;
const comp = await chain.call(vault, 'compoundYield', [], { from: MERCHANT });
const afterCompound = (await chain.call(vault, 'getReserve', [MERCHANT], { from: MERCHANT })).value.tier1PersonalBalance;
check('compounded', comp.ok, comp.revert);
check('tier 1 grew by the pending amount', afterCompound - beforeCompound === merchPending, fmt(afterCompound - beforeCompound));
check('pending is cleared', (await chain.call(vault, 'pendingYield', [MERCHANT], { from: MERCHANT })).value === 0n);
check('compounding twice earns nothing', (await chain.call(vault, 'compoundYield', [], { from: MERCHANT })).revert === 'NoYieldToCompound');

// A merchant who joins after a distribution must not claim a share of it.
await chain.fund('0x00000000000000000000000000000000000000ab', E('100'));
await chain.call(vault, 'depositReserve', [], { from: '0x00000000000000000000000000000000000000ab', value: E('50') });
const latecomer = (await chain.call(vault, 'pendingYield', ['0x00000000000000000000000000000000000000ab'], { from: TREASURY })).value;
check('a later depositor earns nothing retroactively', latecomer === 0n, fmt(latecomer));

/* ---------------------------------------------------------------- */
console.log('\n[7] Vault stays solvent with fees and yield moving through it');
const held = (await chain.call(vault, 'totalReserves', [], { from: TREASURY })).value;
const t1 = (await chain.call(vault, 'totalTier1Balance', [], { from: TREASURY })).value;
const pool = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
const escrowed = (await chain.call(vault, 'totalEscrowed', [], { from: TREASURY })).value;
const owedYield = (await chain.call(vault, 'pendingYield', [OTHER], { from: TREASURY })).value;
console.log(`  held ${fmt(held)} vs tier1 ${fmt(t1)} + pool ${fmt(pool)} + escrow ${fmt(escrowed)}`);
check('balance covers every obligation', held >= t1 + pool + escrowed + owedYield);

console.log(failures === 0 ? '\nRevenue model holds: the protocol earns only when it delivers.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
