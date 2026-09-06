import { createPublicClient, http, encodeFunctionData, decodeFunctionResult } from 'viem';

const PROVER = 'https://prover.cc3-testnet.creditcoin.network';
const CC3 = createPublicClient({ transport: http('https://rpc.cc3-testnet.creditcoin.network') });
const PRECOMPILE = '0x0000000000000000000000000000000000000FD2';

const VERIFY_ABI = [{
  type: 'function', name: 'verify', stateMutability: 'view',
  inputs: [
    { name: 'chainKey', type: 'uint64' },
    { name: 'height', type: 'uint64' },
    { name: 'encodedTransaction', type: 'bytes' },
    { name: 'merkleProof', type: 'tuple', components: [
      { name: 'root', type: 'bytes32' },
      { name: 'siblings', type: 'tuple[]', components: [
        { name: 'hash', type: 'bytes32' }, { name: 'isLeft', type: 'bool' }]}]},
    { name: 'continuityProof', type: 'tuple', components: [
      { name: 'lowerEndpointDigest', type: 'bytes32' },
      { name: 'roots', type: 'bytes32[]' }]},
  ],
  outputs: [{ type: 'bool' }],
}];

const txHash = process.argv[2] ?? '0x6bc309eee217e0016508e96dfbd472034a3fe16fabf016c6c26460f211db4d52';
const p = await (await fetch(`${PROVER}/api/v1/proof-by-tx/1/${txHash}`)).json();

console.log('merkleProof.root:', p.merkleProof.root);
console.log('sibling[0] raw JSON:', JSON.stringify(p.merkleProof.siblings[0]));
console.log('continuity.lowerEndpointDigest:', p.continuityProof.lowerEndpointDigest);
console.log('continuity.roots:', p.continuityProof.roots.length);

const data = encodeFunctionData({
  abi: VERIFY_ABI, functionName: 'verify',
  args: [
    BigInt(p.chainKey), BigInt(p.headerNumber), p.txBytes,
    { root: p.merkleProof.root, siblings: p.merkleProof.siblings.map(s => ({ hash: s.hash, isLeft: s.isLeft })) },
    { lowerEndpointDigest: p.continuityProof.lowerEndpointDigest, roots: p.continuityProof.roots },
  ],
});

console.log('\ncalldata bytes:', (data.length - 2) / 2);
try {
  const raw = await CC3.call({ to: PRECOMPILE, data });
  const ok = decodeFunctionResult({ abi: VERIFY_ABI, functionName: 'verify', data: raw.data });
  console.log('>>> ATTESTCOIN PRECOMPILE 0x0FD2 verify() RETURNED:', ok);
} catch (e) {
  console.log('>>> precompile call reverted:', e.shortMessage ?? e.message);
  process.exit(1);
}
