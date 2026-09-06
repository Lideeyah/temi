/**
 * Deploys TemiSourcePortal to Ethereum Sepolia and registers it with an already-deployed vault.
 *
 * Separate from scripts/deploy.mjs so the portal can be added after the fact without
 * redeploying the vault — the trusted-portal slot stays writable until it is set once.
 *
 *   PRIVATE_KEY=0x... VAULT=0x... npm run deploy:portal
 */
import fs from 'node:fs';
import path from 'node:path';
import { createWalletClient, createPublicClient, http, defineChain, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const creditcoin = defineChain({
  id: 102031, name: 'Creditcoin cc3-testnet',
  nativeCurrency: { name: 'Testnet Creditcoin', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' } },
});
const sepolia = defineChain({
  id: 11155111, name: 'Ethereum Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [process.env.SEPOLIA_RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
});

const artifact = (n) => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'artifacts', `${n}.json`), 'utf8'));
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const VAULT = process.env.VAULT;
if (!VAULT) { console.error('VAULT=0x... is required'); process.exit(1); }

const sepPublic = createPublicClient({ chain: sepolia, transport: http() });
const sepWallet = createWalletClient({ account, chain: sepolia, transport: http() });
const ccPublic = createPublicClient({ chain: creditcoin, transport: http() });
const ccWallet = createWalletClient({ account, chain: creditcoin, transport: http() });

console.log(`\nDeployer ${account.address}`);
console.log(`Sepolia balance: ${formatEther(await sepPublic.getBalance({ address: account.address }))} ETH\n`);

const portalArtifact = artifact('TemiSourcePortal');
console.log('Deploying TemiSourcePortal to Ethereum Sepolia…');
const hash = await sepWallet.deployContract({
  abi: portalArtifact.abi,
  bytecode: portalArtifact.bytecode,
  args: [account.address], // treasury, so funded capital can be swept out
});
const receipt = await sepPublic.waitForTransactionReceipt({ hash });
const portal = receipt.contractAddress;
console.log(`  TemiSourcePortal -> ${portal}`);
console.log(`  ${sepolia.blockExplorers.default.url}/address/${portal}`);

console.log('\nRegistering it as the trusted portal for Attestcoin chain key 1…');
const vaultArtifact = artifact('TemiVault');
const wire = await ccWallet.writeContract({
  address: VAULT, abi: vaultArtifact.abi, functionName: 'setTrustedSourcePortal', args: [1n, portal],
});
await ccPublic.waitForTransactionReceipt({ hash: wire });
const stored = await ccPublic.readContract({ address: VAULT, abi: vaultArtifact.abi, functionName: 'trustedSourcePortal', args: [1n] });
console.log(`  stored: ${stored}`);
console.log(stored.toLowerCase() === portal.toLowerCase() ? '  verified.' : '  MISMATCH');

const envPath = path.join(process.cwd(), '.env.local');
const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const next = existing.replace(/^NEXT_PUBLIC_TEMI_SOURCE_PORTAL_ADDRESS=.*$/m, '').trimEnd();
fs.writeFileSync(envPath, `${next}\nNEXT_PUBLIC_TEMI_SOURCE_PORTAL_ADDRESS=${portal}\n`);
console.log('\nUpdated .env.local\n');
