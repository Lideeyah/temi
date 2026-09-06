import { defineChain, createPublicClient, http, type PublicClient } from 'viem';

/** Creditcoin cc3-testnet — the settlement chain for every Tèmi reserve and claim. */
export const creditcoinTestnet = defineChain({
  id: 102031,
  name: 'Creditcoin cc3-testnet',
  nativeCurrency: { name: 'Testnet Creditcoin', symbol: 'tCTC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://creditcoin-testnet.blockscout.com' },
  },
  testnet: true,
});

/**
 * Ethereum Sepolia — the external source chain for cross-chain reserve capital.
 *
 * Attestcoin chain key 1 on cc3-testnet. Verified empirically against the proof builder:
 * `GET /api/v1/attested-height/1` tracks Sepolia's head. cc3-testnet's attestor set covers
 * chain keys [1, 3] only (3 = Ethereum Mainnet), so Base Sepolia is not provable here.
 */
export const sepolia = defineChain({
  id: 11155111,
  name: 'Ethereum Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://ethereum-sepolia-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
  testnet: true,
});

/** Attestcoin chain keys recognised by the cc3-testnet attestor network. */
export const ATTESTCOIN_CHAIN_KEYS = {
  ETHEREUM_SEPOLIA: 1,
  ETHEREUM_MAINNET: 3,
} as const;

export type AttestcoinChainKey =
  (typeof ATTESTCOIN_CHAIN_KEYS)[keyof typeof ATTESTCOIN_CHAIN_KEYS];

export const creditcoinPublicClient: PublicClient = createPublicClient({
  chain: creditcoinTestnet,
  transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
});

export const sepoliaPublicClient: PublicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});

export function blockscoutTx(hash: string): string {
  return `${creditcoinTestnet.blockExplorers.default.url}/tx/${hash}`;
}

export function blockscoutAddress(address: string): string {
  return `${creditcoinTestnet.blockExplorers.default.url}/address/${address}`;
}

export function etherscanTx(hash: string): string {
  return `${sepolia.blockExplorers.default.url}/tx/${hash}`;
}
