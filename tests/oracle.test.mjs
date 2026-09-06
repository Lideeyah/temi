/**
 * The Attestcoin live-valuation path, executed against the real TemiVault bytecode.
 *
 * A stub verifier stands in at 0x0FD2 (that precompile is part of the Creditcoin runtime and
 * does not exist in a bare EVM). Everything the vault does *after* verification — log matching,
 * the indexed-topic decode, 8→18 decimal scaling, monotonic rounds, staleness, conversion — is
 * the genuine compiled contract.
 */
import { createChain } from './evm-harness.mjs';
import { buildTxBytes, buildProof, answerUpdatedLog, ALWAYS_VERIFIES } from './oracle-fixtures.mjs';
import { parseEther, formatEther } from 'viem';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

const TREASURY = '0x1111111111111111111111111111111111111111';
const RELAYER = '0x5555555555555555555555555555555555555555';
const PRECOMPILE = '0x0000000000000000000000000000000000000fd2';
// The live Sepolia ETH/USD aggregator behind proxy 0x694AA1769357215DE4FAC081bf1f309aDC325306.
const AGGREGATOR = '0x719e22e3d4b690e5d96ccb40619180b5427f14ae';
const IMPOSTOR = '0x00000000000000000000000000000000deadbeef';

const chain = await createChain();
await chain.fund(TREASURY, parseEther('1000'));
await chain.fund(RELAYER, parseEther('1000'));
await chain.setCode(PRECOMPILE, ALWAYS_VERIFIES);
const vault = await chain.deploy('TemiVault', [TREASURY], TREASURY);
console.log(`\nTemiVault at ${vault.address}, stub verifier installed at 0x0FD2\n`);

/* ---------------------------------------------------------------- */
console.log('[1] The real Sepolia log layout decodes correctly');
// Captured live from Chainlink ETH/USD on Sepolia, round 35834.
const REAL = {
  topics: [
    '0x0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f',
    '0x00000000000000000000000000000000000000000000000000000039f9bf4e00',
    '0x0000000000000000000000000000000000000000000000000000000000008bfa',
  ],
  data: '0x000000000000000000000000000000000000000000000000000000006a9d745c',
};
const decoded = await chain.call(vault, 'decodeAnswerUpdated', [REAL.topics, REAL.data], { from: TREASURY });
const [answer, roundId, updatedAt] = decoded.value;
console.log(`  answer ${answer} (${Number(answer) / 1e8} USD)  round ${roundId}  updatedAt ${updatedAt}`);
check('price comes out of topics[1], not the data payload', answer === 249003200000n);
check('roundId comes out of topics[2]', roundId === 35834n);
check('updatedAt comes out of the data payload', updatedAt === 1788703836n);

/* ---------------------------------------------------------------- */
console.log('\n[2] Price feed configuration is write-once');
const unconfigured = await chain.call(vault, 'submitPriceProof', [buildProof(buildTxBytes([]))], { from: RELAYER });
check('unconfigured feed rejects proofs', unconfigured.revert === 'PriceFeedNotConfigured', unconfigured.revert);
check('treasury configures it', (await chain.call(vault, 'setTrustedPriceFeed', [1n, AGGREGATOR], { from: TREASURY })).ok);
const repoint = await chain.call(vault, 'setTrustedPriceFeed', [1n, IMPOSTOR], { from: TREASURY });
check('cannot be repointed', repoint.revert === 'PriceFeedAlreadyConfigured', repoint.revert);

/* ---------------------------------------------------------------- */
console.log('\n[3] Only the trusted aggregator is believed');
const now = 1_788_700_000;
const impostorProof = buildProof(buildTxBytes([
  answerUpdatedLog({ aggregator: IMPOSTOR, answer: 999_999_00000000n, roundId: 99999n, updatedAt: now }),
]));
const spoof = await chain.call(vault, 'submitPriceProof', [impostorProof], { from: RELAYER, timestamp: BigInt(now) });
check('a log from another contract is ignored', spoof.revert === 'AnswerUpdatedLogNotFound', spoof.revert);

/* ---------------------------------------------------------------- */
console.log('\n[4] A valid proof is adopted, scaled 8 → 18 decimals');
const good = buildProof(buildTxBytes([
  answerUpdatedLog({ aggregator: AGGREGATOR, answer: 249003200000n, roundId: 35834n, updatedAt: now }),
]));
const accepted = await chain.call(vault, 'submitPriceProof', [good], { from: RELAYER, timestamp: BigInt(now) });
check('proof accepted', accepted.ok, accepted.revert);
const obs = (await chain.call(vault, 'sourceAssetUsd', [], { from: TREASURY })).value;
console.log(`  stored answerWad ${obs[0]}  (${formatEther(obs[0])} USD)  round ${obs[1]}`);
check('scaled by exactly 1e10', obs[0] === 249003200000n * 10n ** 10n);
check('reads as 2490.032 USD in 18dp', formatEther(obs[0]) === '2490.032');
check('round recorded', obs[1] === 35834n);
check('reported fresh', (await chain.call(vault, 'isPriceFresh', [], { from: TREASURY, timestamp: BigInt(now) })).value === true);

/* ---------------------------------------------------------------- */
console.log('\n[5] Round ids must strictly increase — this is what blocks a replayed dip');
const replay = await chain.call(vault, 'submitPriceProof', [good], { from: RELAYER, timestamp: BigInt(now) });
check('the same round cannot be resubmitted', replay.revert === 'NonMonotonicRound', replay.revert);

const older = buildProof(buildTxBytes([
  // A much lower price from an earlier round — the cherry-pick this guard exists to stop.
  answerUpdatedLog({ aggregator: AGGREGATOR, answer: 100000000000n, roundId: 35800n, updatedAt: now }),
]));
const backwards = await chain.call(vault, 'submitPriceProof', [older], { from: RELAYER, timestamp: BigInt(now) });
check('an earlier round is refused', backwards.revert === 'NonMonotonicRound', backwards.revert);

const newer = buildProof(buildTxBytes([
  answerUpdatedLog({ aggregator: AGGREGATOR, answer: 251000000000n, roundId: 35835n, updatedAt: now + 60 }),
]));
check('a later round is accepted',
  (await chain.call(vault, 'submitPriceProof', [newer], { from: RELAYER, timestamp: BigInt(now + 60) })).ok);

/* ---------------------------------------------------------------- */
console.log('\n[6] Staleness backstop');
const stale = buildProof(buildTxBytes([
  answerUpdatedLog({ aggregator: AGGREGATOR, answer: 240000000000n, roundId: 40000n, updatedAt: now }),
]));
const tooOld = await chain.call(vault, 'submitPriceProof', [stale], { from: RELAYER, timestamp: BigInt(now + 6 * 3600 + 1) });
check('an observation past 6h is refused', tooOld.revert === 'StalePriceObservation', tooOld.revert);
check('isPriceFresh goes false with time',
  (await chain.call(vault, 'isPriceFresh', [], { from: TREASURY, timestamp: BigInt(now + 7 * 3600) })).value === false);

const negative = buildProof(buildTxBytes([
  answerUpdatedLog({ aggregator: AGGREGATOR, answer: (1n << 255n), roundId: 50000n, updatedAt: now + 120 }),
]));
const neg = await chain.call(vault, 'submitPriceProof', [negative], { from: RELAYER, timestamp: BigInt(now + 120) });
check('a negative answer is refused', neg.revert === 'InvalidPriceAnswer', neg.revert);

/* ---------------------------------------------------------------- */
console.log('\n[7] Conversion into tCTC');
const unset = await chain.call(vault, 'convertSourceValueToTctc', [parseEther('1')], { from: TREASURY, timestamp: BigInt(now + 60) });
check('refuses to convert with no CTC price', unset.revert === 'CtcPriceUnset' || unset.revert === 'NoPriceObservation', unset.revert);

// 1 tCTC = 0.90 USD
await chain.call(vault, 'setCtcUsdPrice', [900000000000000000n], { from: TREASURY });
const conv = await chain.call(vault, 'convertSourceValueToTctc', [parseEther('1')], { from: TREASURY, timestamp: BigInt(now + 60) });
console.log(`  1 ETH @ 2510.00 USD / 0.90 USD per tCTC = ${formatEther(conv.value)} tCTC`);
check('conversion is right', conv.value === (parseEther('1') * 251000000000n * 10n ** 10n) / 900000000000000000n);
check('no precision lost on a small amount',
  (await chain.call(vault, 'convertSourceValueToTctc', [1000000n], { from: TREASURY, timestamp: BigInt(now + 60) })).value > 0n);

const staleConv = await chain.call(vault, 'convertSourceValueToTctc', [parseEther('1')], { from: TREASURY, timestamp: BigInt(now + 8 * 3600) });
check('conversion fails closed when the price goes stale', staleConv.revert === 'StalePriceObservation', staleConv.revert);

console.log(failures === 0 ? '\nAttestcoin live valuation verified against the real bytecode.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
