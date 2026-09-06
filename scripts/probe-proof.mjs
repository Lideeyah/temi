import { createPublicClient, http, decodeAbiParameters, parseAbiParameters } from 'viem';

const SEPOLIA = createPublicClient({ transport: http('https://ethereum-sepolia-rpc.publicnode.com') });
const PROVER = 'https://prover.cc3-testnet.creditcoin.network';

const attested = await (await fetch(`${PROVER}/api/v1/attested-height/1`)).json();
console.log('attested height:', attested.attestedHeight);

// Walk back from a safely-attested height to find a block with a log-emitting tx.
let target = null;
for (let h = attested.attestedHeight - 20; h > attested.attestedHeight - 60 && !target; h--) {
  const block = await SEPOLIA.getBlock({ blockNumber: BigInt(h), includeTransactions: false });
  for (const txHash of block.transactions.slice(0, 12)) {
    const rx = await SEPOLIA.getTransactionReceipt({ hash: txHash });
    if (rx.logs.length >= 1 && rx.status === 'success') { target = { txHash, height: h, rx }; break; }
  }
}
if (!target) throw new Error('no candidate tx found');
console.log('candidate tx:', target.txHash, 'block', target.height, 'logs', target.rx.logs.length);

const res = await fetch(`${PROVER}/api/v1/proof-by-tx/1/${target.txHash}`);
const proof = await res.json();
if (!res.ok) { console.log('prover error', proof); process.exit(1); }
console.log('prover keys:', Object.keys(proof));
console.log('headerNumber:', proof.headerNumber, 'txIndex:', proof.txIndex);
console.log('merkleProof siblings:', proof.merkleProof?.siblings?.length, 'continuity roots:', proof.continuityProof?.roots?.length);
console.log('txBytes length:', proof.txBytes?.length);

// ---- validate the EvmTxDecoder layout assumption against the real payload ----
const [txType, chunks] = decodeAbiParameters(parseAbiParameters('uint8, bytes[]'), proof.txBytes);
console.log('\ntxType:', txType, 'chunks:', chunks.length);

const common = decodeAbiParameters(
  parseAbiParameters('uint64 nonce, uint64 gasLimit, address from, bool toIsNull, address to, uint256 value, bytes data'),
  chunks[0]
);
console.log('common.from :', common[2]);
console.log('common.to   :', common[4]);
console.log('common.value:', common[5]);

const receipt = decodeAbiParameters(
  parseAbiParameters('uint8 status, uint64 gasUsed, (address emitter, bytes32[] topics, bytes data)[] logs, bytes logsBloom'),
  chunks[chunks.length - 1]
);
console.log('receipt.status:', receipt[0], 'gasUsed:', receipt[1], 'logs:', receipt[2].length);
console.log('log[0].emitter:', receipt[2][0]?.emitter, 'topic0:', receipt[2][0]?.topics?.[0]);

// ---- cross-check against ground truth from the Sepolia RPC ----
const realTx = await SEPOLIA.getTransaction({ hash: target.txHash });
const ok =
  common[2].toLowerCase() === realTx.from.toLowerCase() &&
  common[4].toLowerCase() === (realTx.to ?? '0x0000000000000000000000000000000000000000').toLowerCase() &&
  common[5] === realTx.value &&
  receipt[2].length === target.rx.logs.length &&
  receipt[2][0].emitter.toLowerCase() === target.rx.logs[0].address.toLowerCase() &&
  receipt[2][0].topics[0] === target.rx.logs[0].topics[0];
console.log('\nDECODER LAYOUT MATCHES LIVE RPC GROUND TRUTH:', ok);
if (!ok) process.exit(1);
