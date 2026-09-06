import { encodeAbiParameters, parseAbiParameters, type Hex } from 'viem';
import { ATTESTCOIN_PROVER_URL } from './config';
import { ATTESTCOIN_CHAIN_KEYS } from './chains';

/**
 * AttestcoinConduit — client half of Tèmi's cross-chain reserve intake.
 *
 * Creditcoin's attestor set watches Ethereum Sepolia, reaches quorum, and posts an attestation
 * on Creditcoin. The proof builder then turns a Sepolia transaction hash into the two proofs the
 * Block Prover precompile checks: a Merkle proof of the transaction's inclusion in its block, and
 * a continuity proof linking that block to the attested checkpoint chain.
 *
 * This module fetches those proofs and packs them into the single `bytes` blob that
 * `TemiVault.verifyAndDeposit` decodes. It is a pure read path — nothing here writes to Sepolia,
 * and reading attested state costs no ATC.
 *
 * Wire format matches the Gluwa USC SDK v0.18.0 proof builder API, verified against the live
 * cc3-testnet prover.
 */

/** A sibling on the Merkle path, with the side it sits on. */
export interface MerkleProofEntry {
  hash: Hex;
  isLeft: boolean;
}

export interface TransactionMerkleProof {
  root: Hex;
  siblings: MerkleProofEntry[];
}

export interface ContinuityProof {
  lowerEndpointDigest: Hex;
  roots: Hex[];
}

/** The proof builder's response for a single transaction. */
export interface AttestcoinProof {
  chainKey: number;
  headerNumber: number;
  txIndex: number;
  txHash: Hex;
  /** ABI-encoded (uint8 txType, bytes[] chunks) — the transaction *and* its receipt. */
  txBytes: Hex;
  continuityProof: ContinuityProof;
  merkleProof: TransactionMerkleProof;
  cached: boolean;
  generatedAt: string;
}

export type ConduitErrorCode =
  | 'ERR_NOT_ATTESTED_YET'
  | 'ERR_PROOF_UNAVAILABLE'
  | 'ERR_PROVER_UNREACHABLE'
  | 'ERR_UNSUPPORTED_CHAIN_KEY';

export class ConduitError extends Error {
  readonly code: ConduitErrorCode;
  readonly detail?: string;

  constructor(code: ConduitErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'ConduitError';
    this.code = code;
    this.detail = detail;
  }
}

/** cc3-testnet's attestor set covers Ethereum Sepolia and Ethereum Mainnet only. */
export const SUPPORTED_CHAIN_KEYS: readonly number[] = [
  ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA,
  ATTESTCOIN_CHAIN_KEYS.ETHEREUM_MAINNET,
];

async function proverFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${ATTESTCOIN_PROVER_URL}${path}`, { signal });
  } catch (cause) {
    throw new ConduitError(
      'ERR_PROVER_UNREACHABLE',
      'Creditcoin proof builder unreachable',
      cause instanceof Error ? cause.message : undefined,
    );
  }

  const body = (await response.json().catch(() => null)) as
    | (T & { code?: string; message?: string })
    | null;

  if (!response.ok || body === null) {
    throw new ConduitError(
      'ERR_PROOF_UNAVAILABLE',
      body?.message ?? `Proof builder returned ${response.status}`,
      body?.code,
    );
  }
  return body;
}

/**
 * The highest source-chain block the attestor quorum has signed off on.
 *
 * A transaction is only provable once its block is at or below this height, which on Sepolia
 * trails the head by roughly forty blocks — call it eight minutes.
 */
export async function getAttestedHeight(chainKey: number, signal?: AbortSignal): Promise<number> {
  if (!SUPPORTED_CHAIN_KEYS.includes(chainKey)) {
    throw new ConduitError(
      'ERR_UNSUPPORTED_CHAIN_KEY',
      `Chain key ${chainKey} is not attested on cc3-testnet`,
      `Supported keys: ${SUPPORTED_CHAIN_KEYS.join(', ')} (1 = Ethereum Sepolia, 3 = Ethereum Mainnet).`,
    );
  }
  const body = await proverFetch<{ attestedHeight: number }>(
    `/api/v1/attested-height/${chainKey}`,
    signal,
  );
  return body.attestedHeight;
}

/** Fetch the inclusion + continuity proofs for one source-chain transaction. */
export async function fetchProof(
  chainKey: number,
  txHash: Hex,
  signal?: AbortSignal,
): Promise<AttestcoinProof> {
  return proverFetch<AttestcoinProof>(`/api/v1/proof-by-tx/${chainKey}/${txHash}`, signal);
}

export interface AttestationWaitProgress {
  attestedHeight: number;
  targetHeight: number;
  blocksRemaining: number;
}

/**
 * Poll until the attestor quorum has covered `targetHeight`.
 *
 * Requesting a proof for an unattested block fails, so the UI waits here and shows the operator
 * how far the quorum still has to travel rather than surfacing a bare error.
 */
export async function waitUntilAttested(
  chainKey: number,
  targetHeight: number,
  options: {
    pollIntervalMs?: number;
    timeoutMs?: number;
    onProgress?: (progress: AttestationWaitProgress) => void;
    signal?: AbortSignal;
  } = {},
): Promise<void> {
  const { pollIntervalMs = 15_000, timeoutMs = 900_000, onProgress, signal } = options;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const attestedHeight = await getAttestedHeight(chainKey, signal);
    onProgress?.({
      attestedHeight,
      targetHeight,
      blocksRemaining: Math.max(0, targetHeight - attestedHeight),
    });

    if (attestedHeight >= targetHeight) return;

    if (Date.now() > deadline) {
      throw new ConduitError(
        'ERR_NOT_ATTESTED_YET',
        `Block ${targetHeight} is still unattested after ${Math.round(timeoutMs / 1000)}s`,
        `The quorum has reached ${attestedHeight}.`,
      );
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, pollIntervalMs);
      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new ConduitError('ERR_PROOF_UNAVAILABLE', 'Cancelled'));
        },
        { once: true },
      );
    });
  }
}

/**
 * The exact tuple `TemiVault.verifyAndDeposit` decodes, and the same argument order the
 * 0x0FD2 precompile's `verify`/`verifyAndEmit` take.
 */
const PROOF_BUNDLE_PARAMS = parseAbiParameters(
  'uint64 chainKey, uint64 height, bytes encodedTransaction, (bytes32 root, (bytes32 hash, bool isLeft)[] siblings) merkleProof, (bytes32 lowerEndpointDigest, bytes32[] roots) continuityProof',
);

/** Pack a proof builder response into the single `bytes proof` argument the vault takes. */
export function encodeProofBundle(proof: AttestcoinProof): Hex {
  return encodeAbiParameters(PROOF_BUNDLE_PARAMS, [
    BigInt(proof.chainKey),
    BigInt(proof.headerNumber),
    proof.txBytes,
    {
      root: proof.merkleProof.root,
      siblings: proof.merkleProof.siblings.map((sibling) => ({
        hash: sibling.hash,
        isLeft: sibling.isLeft,
      })),
    },
    {
      lowerEndpointDigest: proof.continuityProof.lowerEndpointDigest,
      roots: proof.continuityProof.roots,
    },
  ]);
}

/** Human-readable size of a proof, for the telemetry console. */
export function proofFootprint(proof: AttestcoinProof): {
  txBytes: number;
  siblings: number;
  continuityRoots: number;
  calldataBytes: number;
} {
  const bundle = encodeProofBundle(proof);
  return {
    txBytes: (proof.txBytes.length - 2) / 2,
    siblings: proof.merkleProof.siblings.length,
    continuityRoots: proof.continuityProof.roots.length,
    calldataBytes: (bundle.length - 2) / 2,
  };
}
