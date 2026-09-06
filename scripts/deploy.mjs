/**
 * Deploys the Tèmi contract set.
 *
 *   TemiVault        -> Creditcoin cc3-testnet (chain 102031)
 *   TemiSourcePortal -> Ethereum Sepolia       (Attestcoin chain key 1)
 *
 * Then wires the vault's trusted portal for chain key 1 and, optionally, seeds the conduit
 * settlement float that backs cross-chain credits.
 *
 * Usage:
 *   PRIVATE_KEY=0x... npm run deploy
 *   PRIVATE_KEY=0x... SEPOLIA_PRIVATE_KEY=0x... CONDUIT_FLOAT=2.0 CTC_USD=0.90 npm run deploy
 *
 * Faucet: https://faucet.creditcoin.org
 */
import fs from 'node:fs';
import path from 'node:path';
import { createWalletClient, createPublicClient, http, parseEther, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const creditcoin = defineChain({
  id: 102031,
  name: 'Creditcoin cc3-testnet',
  nativeCurrency: { name: 'Testnet Creditcoin', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' } },
});

const sepolia = defineChain({
  id: 11155111,
  name: 'Ethereum Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [process.env.SEPOLIA_RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
});

const ATTESTCOIN_CHAIN_KEY_SEPOLIA = 1n;

/**
 * Chainlink ETH/USD on Sepolia. The vault must trust the *aggregator*, not the proxy, because
 * AnswerUpdated is emitted by the aggregator behind it. Resolved live so a feed rotation is
 * picked up rather than hardcoded stale.
 */
const SEPOLIA_ETH_USD_PROXY = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

function artifact(name) {
  const p = path.join(process.cwd(), 'artifacts', `${name}.json`);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing artifacts/${name}.json — run \`npm run compile\` first.`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error('PRIVATE_KEY is required.\n  PRIVATE_KEY=0x... npm run deploy');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
const sepoliaAccount = privateKeyToAccount(process.env.SEPOLIA_PRIVATE_KEY ?? PRIVATE_KEY);

console.log(`\nDeployer (Creditcoin): ${account.address}`);
console.log(`Deployer (Sepolia):    ${sepoliaAccount.address}\n`);

/* ------------------------------------------------------------------ */
/*                    1. TemiVault on cc3-testnet                     */
/* ------------------------------------------------------------------ */

const ccPublic = createPublicClient({ chain: creditcoin, transport: http() });
const ccWallet = createWalletClient({ account, chain: creditcoin, transport: http() });

const balance = await ccPublic.getBalance({ address: account.address });
console.log(`cc3-testnet balance: ${Number(balance) / 1e18} tCTC`);
if (balance === 0n) {
  console.error('\nNo tCTC. Fund the deployer at https://faucet.creditcoin.org and retry.');
  process.exit(1);
}

const vaultArtifact = artifact('TemiVault');
console.log('\nDeploying TemiVault…');
const vaultTx = await ccWallet.deployContract({
  abi: vaultArtifact.abi,
  bytecode: vaultArtifact.bytecode,
  args: [account.address], // treasury
});
const vaultReceipt = await ccPublic.waitForTransactionReceipt({ hash: vaultTx });
const vaultAddress = vaultReceipt.contractAddress;
console.log(`  TemiVault -> ${vaultAddress}`);
console.log(`  ${creditcoin.blockExplorers.default.url}/address/${vaultAddress}`);

/* ------------------------------------------------------------------ */
/*                2. TemiSourcePortal on Ethereum Sepolia             */
/* ------------------------------------------------------------------ */

let portalAddress = process.env.EXISTING_PORTAL_ADDRESS ?? null;

if (!portalAddress) {
  const sepPublic = createPublicClient({ chain: sepolia, transport: http() });
  const sepWallet = createWalletClient({ account: sepoliaAccount, chain: sepolia, transport: http() });
  const sepBalance = await sepPublic.getBalance({ address: sepoliaAccount.address });
  console.log(`\nSepolia balance: ${Number(sepBalance) / 1e18} ETH`);

  if (sepBalance === 0n) {
    console.warn('  No Sepolia ETH — skipping portal deploy. Set EXISTING_PORTAL_ADDRESS later.');
  } else {
    const portalArtifact = artifact('TemiSourcePortal');
    console.log('Deploying TemiSourcePortal…');
    const portalTx = await sepWallet.deployContract({
      abi: portalArtifact.abi,
      bytecode: portalArtifact.bytecode,
    });
    const portalReceipt = await sepPublic.waitForTransactionReceipt({ hash: portalTx });
    portalAddress = portalReceipt.contractAddress;
    console.log(`  TemiSourcePortal -> ${portalAddress}`);
    console.log(`  ${sepolia.blockExplorers.default.url}/address/${portalAddress}`);
  }
}

/* ------------------------------------------------------------------ */
/*              3. Wire the trusted portal + conduit float            */
/* ------------------------------------------------------------------ */

if (portalAddress) {
  console.log('\nRegistering the trusted source portal for Attestcoin chain key 1…');
  const wireTx = await ccWallet.writeContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: 'setTrustedSourcePortal',
    args: [ATTESTCOIN_CHAIN_KEY_SEPOLIA, portalAddress],
  });
  await ccPublic.waitForTransactionReceipt({ hash: wireTx });
  console.log('  wired.');
}

// ---- Chainlink price feed for live valuation ----
try {
  const sepPublic = createPublicClient({ chain: sepolia, transport: http() });
  const aggregator = await sepPublic.readContract({
    address: SEPOLIA_ETH_USD_PROXY,
    abi: [{ type: 'function', name: 'aggregator', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] }],
    functionName: 'aggregator',
  });
  console.log(`\nRegistering the Chainlink ETH/USD aggregator (${aggregator})…`);
  const feedTx = await ccWallet.writeContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: 'setTrustedPriceFeed',
    args: [ATTESTCOIN_CHAIN_KEY_SEPOLIA, aggregator],
  });
  await ccPublic.waitForTransactionReceipt({ hash: feedTx });
  console.log('  registered.');
} catch (cause) {
  console.warn(`  could not register the price feed: ${cause.message}`);
}

const ctcUsd = process.env.CTC_USD ?? '0.90';
if (Number(ctcUsd) > 0) {
  console.log(`\nSetting tCTC/USD to ${ctcUsd} (governance parameter)…`);
  const priceTx = await ccWallet.writeContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: 'setCtcUsdPrice',
    args: [parseEther(ctcUsd)],
  });
  await ccPublic.waitForTransactionReceipt({ hash: priceTx });
  console.log('  set.');
}

const float = process.env.CONDUIT_FLOAT;
if (float && Number(float) > 0) {
  console.log(`\nSeeding ${float} tCTC of conduit settlement float…`);
  const fundTx = await ccWallet.writeContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: 'fundConduitLiquidity',
    value: parseEther(float),
  });
  await ccPublic.waitForTransactionReceipt({ hash: fundTx });
  console.log('  funded.');
}

/* ------------------------------------------------------------------ */

const env = [
  `NEXT_PUBLIC_TEMI_VAULT_ADDRESS=${vaultAddress}`,
  portalAddress ? `NEXT_PUBLIC_TEMI_SOURCE_PORTAL_ADDRESS=${portalAddress}` : null,
].filter(Boolean).join('\n');

fs.writeFileSync(path.join(process.cwd(), '.env.local'), env + '\n');
console.log('\nWrote .env.local:\n');
console.log(env);
console.log('\nRestart `npm run dev` to pick it up.\n');
