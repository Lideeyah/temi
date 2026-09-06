import type { Address } from 'viem';

function optionalAddress(value: string | undefined): Address | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^0x[0-9a-fA-F]{40}$/.test(trimmed) ? (trimmed as Address) : null;
}

/** TemiVault on Creditcoin cc3-testnet. Set after running `npm run deploy`. */
export const TEMI_VAULT_ADDRESS = optionalAddress(process.env.NEXT_PUBLIC_TEMI_VAULT_ADDRESS);

/** TemiSourcePortal on Ethereum Sepolia — the external capital intake. */
export const TEMI_SOURCE_PORTAL_ADDRESS = optionalAddress(
  process.env.NEXT_PUBLIC_TEMI_SOURCE_PORTAL_ADDRESS,
);

/** The Attestcoin Native Query Verifier precompile, baked into the Creditcoin runtime. */
export const ATTESTCOIN_VERIFIER_ADDRESS =
  '0x0000000000000000000000000000000000000FD2' as const satisfies Address;

/** Creditcoin proof builder. Turns a source-chain tx hash into a Merkle + continuity proof. */
export const ATTESTCOIN_PROVER_URL =
  process.env.NEXT_PUBLIC_ATTESTCOIN_PROVER_URL ??
  'https://prover.cc3-testnet.creditcoin.network';

/**
 * Display-only NGN conversion rate. Tèmi settles exclusively in tCTC on-chain; this rate
 * exists so a Lagos trader can read their reserve in the currency they actually trade in.
 * It is never used in any on-chain calculation.
 */
export const NGN_PER_TCTC = Number(process.env.NEXT_PUBLIC_NGN_PER_TCTC ?? 1450);

export const isVaultConfigured = TEMI_VAULT_ADDRESS !== null;
