/**
 * Exercises the Attestcoin path against the deployed contracts:
 *   1. proves a live Chainlink round through 0x0FD2 and adopts it as the vault's rate
 *   2. funds a reserve on Ethereum Sepolia, starting the attestation clock
 *
 * Run again later with STEP=deposit to complete the cross-chain credit once the quorum has
 * covered the funding block.
 */
import fs from 'node:fs';
import { createWalletClient, createPublicClient, http, defineChain, formatEther, parseEther, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const creditcoin = defineChain({
  id: 102031, name: 'cc3', nativeCurrency: { name: 'tCTC', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
});
const sepolia = defineChain({
  id: 11155111, name: 'Sepolia', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://ethereum-sepolia-rpc.publicnode.com'] } },
});

const VAULT = process.env.VAULT;
const PORTAL = process.env.PORTAL;
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const vaultAbi = JSON.parse(fs.readFileSync('artifacts/TemiVault.json', 'utf8')).abi;
const portalAbi = JSON.parse(fs.readFileSync('artifacts/TemiSourcePortal.json', 'utf8')).abi;

const cc = createPublicClient({ chain: creditcoin, transport: http() });
const ccw = createWalletClient({ account, chain: creditcoin, transport: http() });
const sep = createPublicClient({ chain: sepolia, transport: http() });
const sepw = createWalletClient({ account, chain: sepolia, transport: http() });

const { findProvableRound, buildPriceProof } = await import('../lib/ChainlinkOracle.ts');
const { fetchProof, encodeProofBundle, getAttestedHeight } = await import('../lib/AttestcoinConduit.ts');

if (process.env.STEP !== 'deposit') {
  console.log('\n=== 1. Prove a Chainlink round through the 0x0FD2 precompile ===');
  const round = await findProvableRound();
  console.log(`  round ${round.roundId}  $${round.price}  ${Math.round(round.ageSeconds / 60)}m old  block ${round.blockNumber}`);
  const { proof } = await buildPriceProof(round);
  console.log(`  proof: ${((proof.length - 2) / 2).toLocaleString()} bytes of calldata`);

  const hash = await ccw.writeContract({ address: VAULT, abi: vaultAbi, functionName: 'submitPriceProof', args: [proof] });
  const rx = await cc.waitForTransactionReceipt({ hash });
  console.log(`  status: ${rx.status}   gas: ${rx.gasUsed.toLocaleString()}`);
  console.log(`  https://creditcoin-testnet.blockscout.com/tx/${hash}`);

  for (const log of rx.logs) {
    try {
      const d = decodeEventLog({ abi: vaultAbi, data: log.data, topics: log.topics });
      if (d.eventName === 'PriceObserved') {
        console.log(`  PriceObserved: $${formatEther(d.args.answerWad)} round ${d.args.roundId} from Ethereum block ${d.args.sourceHeight}`);
      }
    } catch {}
  }

  const fresh = await cc.readContract({ address: VAULT, abi: vaultAbi, functionName: 'isPriceFresh' });
  const converted = await cc.readContract({ address: VAULT, abi: vaultAbi, functionName: 'convertSourceValueToTctc', args: [parseEther('0.001')] });
  console.log(`  price fresh: ${fresh}`);
  console.log(`  0.001 ETH now prices at ${formatEther(converted)} tCTC`);

  console.log('\n=== 2. Fund a reserve on Ethereum Sepolia ===');
  const fundHash = await sepw.writeContract({
    address: PORTAL, abi: portalAbi, functionName: 'fundReserveFor',
    args: [account.address], value: parseEther('0.001'),
  });
  const fundRx = await sep.waitForTransactionReceipt({ hash: fundHash });
  console.log(`  tx ${fundHash}`);
  console.log(`  block ${fundRx.blockNumber}   https://sepolia.etherscan.io/tx/${fundHash}`);

  const attested = await getAttestedHeight(1);
  console.log(`\n  attestor quorum is at ${attested.toLocaleString()}, needs ${fundRx.blockNumber}`);
  console.log(`  ~${Number(fundRx.blockNumber) - attested} blocks to go`);
  fs.writeFileSync('.pending-deposit.json', JSON.stringify({ txHash: fundHash, block: Number(fundRx.blockNumber) }, null, 2));
  console.log('\n  saved to .pending-deposit.json — rerun with STEP=deposit once attested\n');
} else {
  const { txHash, block } = JSON.parse(fs.readFileSync('.pending-deposit.json', 'utf8'));
  const attested = await getAttestedHeight(1);
  console.log(`\n  quorum at ${attested.toLocaleString()}, need ${block.toLocaleString()}`);
  if (attested < block) { console.log(`  not yet — ${block - attested} blocks to go`); process.exit(2); }

  console.log('\n=== 3. Read the Sepolia deposit into Creditcoin ===');
  const raw = await fetchProof(1, txHash);
  const proof = encodeProofBundle(raw);
  const preview = await cc.readContract({ address: VAULT, abi: vaultAbi, functionName: 'previewAttestcoinProof', args: [proof] });
  console.log(`  precompile says valid: ${preview[0]}, beneficiary ${preview[1]}, amount ${formatEther(preview[2])} ETH`);

  const hash = await ccw.writeContract({
    address: VAULT, abi: vaultAbi, functionName: 'verifyAndDeposit',
    args: [proof, txHash, preview[2]],
  });
  const rx = await cc.waitForTransactionReceipt({ hash });
  console.log(`  status: ${rx.status}  gas: ${rx.gasUsed.toLocaleString()}`);
  console.log(`  https://creditcoin-testnet.blockscout.com/tx/${hash}`);
  for (const log of rx.logs) {
    try {
      const d = decodeEventLog({ abi: vaultAbi, data: log.data, topics: log.topics });
      if (d.eventName === 'AttestcoinReserveCredited') console.log(`  credited ${formatEther(d.args.amount)} tCTC`);
      if (d.eventName === 'ReserveDeposited') console.log(`  split: tier1 ${formatEther(d.args.tier1Amount)} / tier2 ${formatEther(d.args.tier2Amount)}`);
    } catch {}
  }
}
