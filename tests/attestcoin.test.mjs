/**
 * End-to-end validation of the Attestcoin readability path against the LIVE cc3-testnet
 * precompile and the LIVE Creditcoin proof builder. No mocks.
 *
 * Run: node --experimental-strip-types tests/attestcoin.test.mjs
 */
import {
  createPublicClient, http, decodeAbiParameters, parseAbiParameters,
  encodeFunctionData, decodeFunctionResult,
} from 'viem';
import { encodeProofBundle, fetchProof, getAttestedHeight } from '../lib/AttestcoinConduit.ts';

const CC3 = createPublicClient({ transport: http('https://rpc.cc3-testnet.creditcoin.network') });
const SEPOLIA = createPublicClient({ transport: http('https://ethereum-sepolia-rpc.publicnode.com') });
const PRECOMPILE = '0x0000000000000000000000000000000000000FD2';
const CHAIN_KEY = 1;

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

// ---------------------------------------------------------------- //
console.log('\n[1] Attestor quorum is live on chain key 1 (Ethereum Sepolia)');
const attested = await getAttestedHeight(CHAIN_KEY);
const sepoliaHead = Number(await SEPOLIA.getBlockNumber());
console.log(`  attested: ${attested.toLocaleString()}  sepolia head: ${sepoliaHead.toLocaleString()}  lag: ${sepoliaHead - attested}`);
check('chain key 1 tracks Ethereum Sepolia', Math.abs(sepoliaHead - attested) < 500);

// ---------------------------------------------------------------- //
console.log('\n[2] Locating an attested Sepolia transaction with logs');
let target = null;
for (let h = attested - 5; h > attested - 40 && !target; h--) {
  const block = await SEPOLIA.getBlock({ blockNumber: BigInt(h) });
  for (const txHash of block.transactions.slice(0, 10)) {
    const rx = await SEPOLIA.getTransactionReceipt({ hash: txHash });
    if (rx.status === 'success' && rx.logs.length > 0) { target = { txHash, height: h, rx }; break; }
  }
}
check('found an attested candidate', target !== null);
if (!target) process.exit(1);
console.log(`  ${target.txHash} @ block ${target.height} (${target.rx.logs.length} logs)`);

// ---------------------------------------------------------------- //
console.log('\n[3] Proof builder returns a well-formed proof');
const proof = await fetchProof(CHAIN_KEY, target.txHash);
check('headerNumber matches the source block', proof.headerNumber === target.height);
check('merkle proof has siblings', proof.merkleProof.siblings.length > 0, `${proof.merkleProof.siblings.length}`);
check('continuity proof has roots', proof.continuityProof.roots.length > 0, `${proof.continuityProof.roots.length}`);

// ---------------------------------------------------------------- //
console.log('\n[4] encodeProofBundle round-trips exactly as TemiVault decodes it');
const bundle = encodeProofBundle(proof);
const BUNDLE_PARAMS = parseAbiParameters(
  'uint64 chainKey, uint64 height, bytes encodedTransaction, (bytes32 root, (bytes32 hash, bool isLeft)[] siblings) merkleProof, (bytes32 lowerEndpointDigest, bytes32[] roots) continuityProof',
);
const [dChainKey, dHeight, dTx, dMerkle, dContinuity] = decodeAbiParameters(BUNDLE_PARAMS, bundle);
check('chainKey survives', Number(dChainKey) === proof.chainKey);
check('height survives', Number(dHeight) === proof.headerNumber);
check('txBytes survives', dTx === proof.txBytes);
check('merkle root survives', dMerkle.root === proof.merkleProof.root);
check('sibling count survives', dMerkle.siblings.length === proof.merkleProof.siblings.length);
check('sibling isLeft flags survive',
  dMerkle.siblings.every((s, i) => s.isLeft === proof.merkleProof.siblings[i].isLeft && s.hash === proof.merkleProof.siblings[i].hash));
check('continuity roots survive', dContinuity.roots.length === proof.continuityProof.roots.length);
console.log(`  bundle calldata: ${((bundle.length - 2) / 2).toLocaleString()} bytes`);

// ---------------------------------------------------------------- //
console.log('\n[5] EvmTxDecoder layout matches the real payload (chunk[0] / chunk[last])');
const [txType, chunks] = decodeAbiParameters(parseAbiParameters('uint8, bytes[]'), proof.txBytes);
const common = decodeAbiParameters(
  parseAbiParameters('uint64 nonce, uint64 gasLimit, address from, bool toIsNull, address to, uint256 value, bytes data'),
  chunks[0]);
const receipt = decodeAbiParameters(
  parseAbiParameters('uint8 status, uint64 gasUsed, (address emitter, bytes32[] topics, bytes data)[] logs, bytes logsBloom'),
  chunks[chunks.length - 1]);
const realTx = await SEPOLIA.getTransaction({ hash: target.txHash });
console.log(`  txType ${txType}, ${chunks.length} chunks, ${receipt[2].length} logs`);
check('decoded from == RPC from', common[2].toLowerCase() === realTx.from.toLowerCase());
check('decoded to == RPC to', common[4].toLowerCase() === (realTx.to ?? '0x' + '0'.repeat(40)).toLowerCase());
check('decoded value == RPC value', common[5] === realTx.value);
check('receipt status is success', receipt[0] === 1);
check('log count matches RPC', receipt[2].length === target.rx.logs.length);
check('log emitter matches RPC', receipt[2][0].emitter.toLowerCase() === target.rx.logs[0].address.toLowerCase());
check('log topic0 matches RPC', receipt[2][0].topics[0] === target.rx.logs[0].topics[0]);

// ---------------------------------------------------------------- //
console.log('\n[6] The live 0x0FD2 Block Prover precompile accepts the proof');
const VERIFY_ABI = [{
  type: 'function', name: 'verify', stateMutability: 'view',
  inputs: [
    { name: 'chainKey', type: 'uint64' }, { name: 'height', type: 'uint64' },
    { name: 'encodedTransaction', type: 'bytes' },
    { name: 'merkleProof', type: 'tuple', components: [
      { name: 'root', type: 'bytes32' },
      { name: 'siblings', type: 'tuple[]', components: [{ name: 'hash', type: 'bytes32' }, { name: 'isLeft', type: 'bool' }] }]},
    { name: 'continuityProof', type: 'tuple', components: [
      { name: 'lowerEndpointDigest', type: 'bytes32' }, { name: 'roots', type: 'bytes32[]' }]},
  ],
  outputs: [{ type: 'bool' }],
}];
const raw = await CC3.call({
  to: PRECOMPILE,
  data: encodeFunctionData({ abi: VERIFY_ABI, functionName: 'verify', args: [dChainKey, dHeight, dTx, dMerkle, dContinuity] }),
});
check('precompile verify() == true', decodeFunctionResult({ abi: VERIFY_ABI, functionName: 'verify', data: raw.data }) === true);

// ---------------------------------------------------------------- //
console.log('\n[7] A tampered proof is rejected');
const tampered = { ...dMerkle, root: ('0x' + 'ab'.repeat(32)) };
let rejected = false;
try {
  await CC3.call({ to: PRECOMPILE, data: encodeFunctionData({ abi: VERIFY_ABI, functionName: 'verify', args: [dChainKey, dHeight, dTx, tampered, dContinuity] }) });
} catch { rejected = true; }
check('forged merkle root reverts in the precompile', rejected);

console.log(failures === 0 ? '\nAttestcoin readability path verified end-to-end against live infrastructure.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
