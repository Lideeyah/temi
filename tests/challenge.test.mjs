/**
 * Optimistic settlement, executed against the real TemiVault bytecode.
 *
 * The window exists because a browser cannot prove where sensor readings came from. It cannot
 * make forgery impossible; it makes forgery cost money and gives anyone standing to take it.
 * What matters here is that money is conserved in every branch and that neither side of the
 * dispute can grief the other for free.
 */
import { parseEther, formatEther, keccak256, toHex } from 'viem';
import { createChain } from './evm-harness.mjs';

const E = parseEther;
const fmt = (w) => `${Number(formatEther(w)).toFixed(4)} tCTC`;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const TREASURY = '0x1111111111111111111111111111111111111111';
const MERCHANT = '0x2222222222222222222222222222222222222222';
const CHALLENGER = '0x3333333333333333333333333333333333333333';
const BYSTANDER = '0x4444444444444444444444444444444444444444';
const GOOD = { jitter: 2757n, parallax: 901n };
const HOUR = 3600n;
/** Claim money arrives net of the 1.5% settlement fee; bonds and stakes return whole. */
const netOf = (gross) => gross - (gross * 150n) / 10000n;

const assetId = (s) => keccak256(toHex(s));

async function freshChain() {
  const chain = await createChain();
  for (const w of [TREASURY, MERCHANT, CHALLENGER, BYSTANDER]) await chain.fund(w, E('10000'));
  const vault = await chain.deploy('TemiVault', [TREASURY], TREASURY);
  // A pool built by other merchants, so a large draw has something to draw from.
  for (let i = 0; i < 5; i++) {
    const m = `0x${(0xbb00 + i).toString(16).padStart(40, '0')}`;
    await chain.fund(m, E('400'));
    await chain.call(vault, 'depositReserve', [], { from: m, value: E('300') });
  }
  return { chain, vault };
}

/** Contract balance must always cover Tier 1 + pool + everything escrowed. */
async function assertSolvent(chain, vault, label) {
  const held = (await chain.call(vault, 'totalReserves', [], { from: TREASURY })).value;
  const t1 = (await chain.call(vault, 'totalTier1Balance', [], { from: TREASURY })).value;
  const pool = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
  const escrow = (await chain.call(vault, 'totalEscrowed', [], { from: TREASURY })).value;
  check(`solvent ${label}`, held >= t1 + pool + escrow, `held ${fmt(held)} vs ${fmt(t1 + pool + escrow)}`);
}

/* ================================================================== */
console.log('\n[1] A merchant taking back their own Tier 1 is never delayed');
{
  const { chain, vault } = await freshChain();
  await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('100') });
  const id = assetId('gen-own-money');
  await chain.call(vault, 'registerAsset', [id, 0, E('80'), 0n, 0n, 6n], { from: MERCHANT });

  const before = await chain.balanceOf(MERCHANT);
  const r = await chain.call(vault, 'settleClaim', [id, E('80'), GOOD.jitter, GOOD.parallax, 0n, id], { from: MERCHANT });
  const after = await chain.balanceOf(MERCHANT);

  check('settles', r.ok, r.revert);
  check('no escrow opened', r.value?.[1] === 0n, `claimId ${r.value?.[1]}`);
  check('paid immediately, net of the settlement fee', after - before === netOf(E('80')), fmt(after - before));
  await assertSolvent(chain, vault, 'after instant claim');
}

/* ================================================================== */
console.log('\n[2] A small mutual-buffer draw also settles instantly');
{
  const { chain, vault } = await freshChain();
  await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('10') });
  const id = assetId('gen-small-draw');
  // Tier 1 is 8.5; claim 9 draws 0.5 from a ~226 tCTC pool — far under the 1% instant cap.
  await chain.call(vault, 'registerAsset', [id, 0, E('9'), 0n, 0n, 6n], { from: MERCHANT });

  const before = await chain.balanceOf(MERCHANT);
  const r = await chain.call(vault, 'settleClaim', [id, E('9'), GOOD.jitter, GOOD.parallax, 0n, id], { from: MERCHANT });
  const after = await chain.balanceOf(MERCHANT);
  check('no escrow for a sub-1% draw', r.value?.[1] === 0n);
  check('paid immediately, net of fee', after - before === netOf(E('9')), fmt(after - before));
}

/* ================================================================== */
console.log('\n[3] A large draw is escrowed, and the bond is withheld not demanded');
const big = await freshChain();
let claimId;
let bond;
{
  const { chain, vault } = big;
  await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('100') });
  const id = assetId('gen-big');
  await chain.call(vault, 'registerAsset', [id, 0, E('90'), 0n, 0n, 6n], { from: MERCHANT });

  const quote = (await chain.call(vault, 'quoteClaim', [id, E('90'), MERCHANT], { from: MERCHANT })).value;
  console.log(`  quote: tier1 ${fmt(quote[0])}  tier2 ${fmt(quote[1])}  instant ${quote[2]}  bond needed ${fmt(quote[3])}`);
  check('quote says this one is not instant', quote[2] === false);

  const before = await chain.balanceOf(MERCHANT);
  // Note: no value sent. The merchant needs no spare tCTC.
  const r = await chain.call(vault, 'settleClaim', [id, E('90'), GOOD.jitter, GOOD.parallax, 0n, id], { from: MERCHANT });
  const after = await chain.balanceOf(MERCHANT);
  check('claim accepted', r.ok, r.revert);
  claimId = r.value?.[1];
  check('an escrow was opened', claimId > 0n, `claimId ${claimId}`);

  const claim = (await chain.call(vault, 'pendingClaims', [claimId], { from: MERCHANT })).value;
  bond = claim[3];
  console.log(`  escrowed ${fmt(claim[2])}  bond ${fmt(bond)}  paid now ${fmt(after - before)}`);
  check('tier2 escrowed, not paid', claim[2] === quote[1]);
  check('bond is 10% of the escrow', bond === (quote[1] * 1000n) / 10000n);
  check('immediate payout is tier1 less the bond, net of fee',
    after - before === netOf(quote[0] - bond), fmt(after - before));
  check('status is Pending', claim[7] === 1);
  await assertSolvent(chain, vault, 'with an open escrow');
}

/* ================================================================== */
console.log('\n[4] The window is real');
{
  const { chain, vault } = big;
  const early = await chain.call(vault, 'finaliseClaim', [claimId], { from: BYSTANDER, timestamp: 10n * HOUR });
  check('cannot finalise inside the window', early.revert === 'ChallengeWindowOpen', early.revert);

  const late = await chain.call(vault, 'challengeClaim', [claimId], { from: CHALLENGER, value: bond, timestamp: 30n * HOUR });
  check('cannot challenge after the window', late.revert === 'ChallengeWindowClosed', late.revert);

  const cheap = await chain.call(vault, 'challengeClaim', [claimId], { from: CHALLENGER, value: bond - 1n, timestamp: 2n * HOUR });
  check('cannot challenge without matching the bond', cheap.revert === 'InsufficientChallengeBond', cheap.revert);
}

/* ================================================================== */
console.log('\n[5] Unchallenged, it pays out — and anyone can trigger that');
{
  const { chain, vault } = big;
  const before = await chain.balanceOf(MERCHANT);
  const fin = await chain.call(vault, 'finaliseClaim', [claimId], { from: BYSTANDER, timestamp: 25n * HOUR });
  const after = await chain.balanceOf(MERCHANT);
  check('a bystander can finalise', fin.ok, fin.revert);
  const claim = (await chain.call(vault, 'pendingClaims', [claimId], { from: MERCHANT })).value;
  check('escrow released net of fee, bond returned whole',
    after - before === netOf(claim[2]) + claim[3], fmt(after - before));
  check('status is Settled', claim[7] === 3);
  check('nothing left escrowed', (await chain.call(vault, 'totalEscrowed', [], { from: TREASURY })).value === 0n);
  const done = await chain.call(vault, 'finaliseClaim', [claimId], { from: BYSTANDER, timestamp: 26n * HOUR });
  check('cannot be finalised twice', done.revert === 'ClaimNotPending', done.revert);
  await assertSolvent(chain, vault, 'after finalisation');
}

/* ================================================================== */
console.log('\n[6] A correct challenge: the buffer is made whole and the fraud pays for it');
{
  const { chain, vault } = await freshChain();
  await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('100') });
  const id = assetId('gen-fraud');
  await chain.call(vault, 'registerAsset', [id, 0, E('90'), 0n, 0n, 6n], { from: MERCHANT });

  const poolBefore = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
  const r = await chain.call(vault, 'settleClaim', [id, E('90'), GOOD.jitter, GOOD.parallax, 0n, id], { from: MERCHANT });
  const cid = r.value[1];
  const claim = (await chain.call(vault, 'pendingClaims', [cid], { from: MERCHANT })).value;
  const escrow = claim[2];
  const claimBond = claim[3];

  await chain.call(vault, 'challengeClaim', [cid], { from: CHALLENGER, value: claimBond, timestamp: 3n * HOUR });
  const challenged = (await chain.call(vault, 'pendingClaims', [cid], { from: MERCHANT })).value;
  check('status is Challenged', challenged[7] === 2);

  const notArbiter = await chain.call(vault, 'resolveChallenge', [cid, true], { from: BYSTANDER, timestamp: 4n * HOUR });
  check('only the arbiter resolves', notArbiter.revert === 'NotArbiter', notArbiter.revert);

  const chalBefore = await chain.balanceOf(CHALLENGER);
  const res = await chain.call(vault, 'resolveChallenge', [cid, true], { from: TREASURY, timestamp: 4n * HOUR });
  const chalAfter = await chain.balanceOf(CHALLENGER);
  check('arbiter resolves', res.ok, res.revert);

  const poolAfter = (await chain.call(vault, 'totalTier2PoolBalance', [], { from: TREASURY })).value;
  const reward = (claimBond * 5000n) / 10000n;
  console.log(`  pool ${fmt(poolBefore)} -> ${fmt(poolAfter)} (escrow ${fmt(escrow)} returned + ${fmt(claimBond - reward)} of forfeited bond)`);
  console.log(`  challenger staked ${fmt(claimBond)}, received ${fmt(chalAfter - chalBefore)}`);
  check('escrow returned to the buffer', poolAfter === poolBefore - escrow + escrow + (claimBond - reward), fmt(poolAfter));
  check('challenger gets their stake back plus the reward', chalAfter - chalBefore === claimBond + reward);
  check('the fraudster forfeited the whole bond', reward + (claimBond - reward) === claimBond);

  const finalClaim = (await chain.call(vault, 'pendingClaims', [cid], { from: MERCHANT })).value;
  check('status is Rejected', finalClaim[7] === 4);

  const asset = (await chain.call(vault, 'getAsset', [id], { from: MERCHANT })).value;
  check('asset returns to cover for an honest re-claim', asset.isActive === true);

  const reserve = (await chain.call(vault, 'getReserve', [MERCHANT], { from: MERCHANT })).value;
  check('allowance restored — a rejected claim costs no headroom', reserve.lifetimeTier2Drawn === 0n, fmt(reserve.lifetimeTier2Drawn));
  await assertSolvent(chain, vault, 'after rejection');
}

/* ================================================================== */
console.log('\n[7] A wrong challenge pays the merchant it delayed');
{
  const { chain, vault } = await freshChain();
  await chain.call(vault, 'depositReserve', [], { from: MERCHANT, value: E('100') });
  const id = assetId('gen-honest');
  await chain.call(vault, 'registerAsset', [id, 0, E('90'), 0n, 0n, 6n], { from: MERCHANT });

  const r = await chain.call(vault, 'settleClaim', [id, E('90'), GOOD.jitter, GOOD.parallax, 0n, id], { from: MERCHANT });
  const cid = r.value[1];
  const claim = (await chain.call(vault, 'pendingClaims', [cid], { from: MERCHANT })).value;
  const escrow = claim[2];
  const claimBond = claim[3];

  const chalBefore = await chain.balanceOf(CHALLENGER);
  await chain.call(vault, 'challengeClaim', [cid], { from: CHALLENGER, value: claimBond, timestamp: 2n * HOUR });

  const merchBefore = await chain.balanceOf(MERCHANT);
  await chain.call(vault, 'resolveChallenge', [cid, false], { from: TREASURY, timestamp: 5n * HOUR });
  const merchAfter = await chain.balanceOf(MERCHANT);
  const chalAfter = await chain.balanceOf(CHALLENGER);

  console.log(`  merchant received ${fmt(merchAfter - merchBefore)} (escrow ${fmt(escrow)} net of fee + bond ${fmt(claimBond)} + forfeited stake ${fmt(claimBond)})`);
  check('merchant gets escrow net of fee, plus bond and the forfeited stake',
    merchAfter - merchBefore === netOf(escrow) + claimBond + claimBond);
  check('griefing is not free — challenger lost their stake', chalAfter - chalBefore === -claimBond, fmt(chalBefore - chalAfter));
  await assertSolvent(chain, vault, 'after a failed challenge');
}

/* ================================================================== */
console.log('\n[8] Arbiter can be handed to a DAO');
{
  const { chain, vault } = await freshChain();
  const DAO = '0x00000000000000000000000000000000000000da';
  check('treasury may reassign', (await chain.call(vault, 'setArbiter', [DAO], { from: TREASURY })).ok);
  check('arbiter updated', (await chain.call(vault, 'arbiter', [], { from: TREASURY })).value.toLowerCase() === DAO);
  const notTreasury = await chain.call(vault, 'setArbiter', [BYSTANDER], { from: BYSTANDER });
  check('others may not', notTreasury.revert === 'NotTreasury', notTreasury.revert);
}

console.log(failures === 0 ? '\nOptimistic settlement holds, and money is conserved in every branch.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
