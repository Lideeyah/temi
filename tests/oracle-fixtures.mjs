/**
 * Builds USC v1 transaction payloads by hand, so the oracle path can be tested without a
 * network round trip. The layout mirrors the Gluwa SDK's abiEncode and is the same one
 * tests/attestcoin.test.mjs validates against a genuine attested Sepolia transaction.
 */
import { encodeAbiParameters, parseAbiParameters, keccak256, toHex, pad, numberToHex } from 'viem';

export const ANSWER_UPDATED_TOPIC = keccak256(toHex('AnswerUpdated(int256,uint256,uint256)'));

const COMMON = parseAbiParameters(
  'uint64 nonce, uint64 gasLimit, address from, bool toIsNull, address to, uint256 value, bytes data',
);
const RECEIPT = parseAbiParameters(
  'uint8 status, uint64 gasUsed, (address emitter, bytes32[] topics, bytes data)[] logs, bytes logsBloom',
);
const BUNDLE = parseAbiParameters(
  'uint64 chainKey, uint64 height, bytes encodedTransaction, (bytes32 root, (bytes32 hash, bool isLeft)[] siblings) merkleProof, (bytes32 lowerEndpointDigest, bytes32[] roots) continuityProof',
);

/** Wrap logs into the (uint8 txType, bytes[] chunks) payload the proof builder attests to. */
export function buildTxBytes(logs, { status = 1, from = '0x' + '11'.repeat(20), to = '0x' + '22'.repeat(20) } = {}) {
  const chunk0 = encodeAbiParameters(COMMON, [0n, 100000n, from, false, to, 0n, '0x']);
  const chunk1 = '0x' + '00'.repeat(32); // type-specific; the decoder never reads it
  const chunk2 = encodeAbiParameters(RECEIPT, [status, 50000n, logs, '0x']);
  return encodeAbiParameters(parseAbiParameters('uint8, bytes[]'), [2, [chunk0, chunk1, chunk2]]);
}

export function buildProof(txBytes, { chainKey = 1n, height = 11_647_741n } = {}) {
  return encodeAbiParameters(BUNDLE, [
    chainKey,
    height,
    txBytes,
    { root: '0x' + 'aa'.repeat(32), siblings: [{ hash: '0x' + 'bb'.repeat(32), isLeft: true }] },
    { lowerEndpointDigest: '0x' + 'cc'.repeat(32), roots: ['0x' + 'dd'.repeat(32)] },
  ]);
}

/** A Chainlink AnswerUpdated log: price and roundId indexed, updatedAt in the data. */
export function answerUpdatedLog({ aggregator, answer, roundId, updatedAt }) {
  return {
    emitter: aggregator,
    topics: [
      ANSWER_UPDATED_TOPIC,
      pad(numberToHex(answer), { size: 32 }),
      pad(numberToHex(roundId), { size: 32 }),
    ],
    data: pad(numberToHex(updatedAt), { size: 32 }),
  };
}

/** Runtime that returns abi-encoded `true` for any call — the stub Attestcoin verifier. */
export const ALWAYS_VERIFIES = '0x600160005260206000f3';
