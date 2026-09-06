import { parseAbiItem, formatUnits, type Address, type Hex } from 'viem';
import { sepoliaPublicClient, ATTESTCOIN_CHAIN_KEYS } from './chains';
import { fetchProof, getAttestedHeight, encodeProofBundle, type AttestcoinProof } from './AttestcoinConduit';

/**
 * ChainlinkOracle — live valuation through the same Attestcoin readability path as deposits.
 *
 * Tèmi does not take a price from an oracle operator and it does not run one. It reads
 * Chainlink's own `AnswerUpdated` event off Ethereum, proves that event's transaction was
 * included in an attested Ethereum block via the 0x0FD2 Block Prover, and adopts the price the
 * proof carries. The trust assumption is Chainlink plus the Creditcoin attestor quorum — the
 * same quorum already securing the deposit rail — and nothing else.
 *
 * This module's only job is to find a round that is actually provable right now: recent enough
 * to be inside the vault's staleness window, old enough that the quorum has covered its block.
 */

/** ETH/USD proxy on Ethereum Sepolia. The proxy is stable; the aggregator behind it can rotate. */
export const SEPOLIA_ETH_USD_PROXY = '0x694AA1769357215DE4FAC081bf1f309aDC325306' as const satisfies Address;

/** Chainlink USD feeds report 8 decimals. */
export const ORACLE_DECIMALS = 8;

/** Must match `TemiVault.MAX_ORACLE_STALENESS`. */
export const MAX_ORACLE_STALENESS_SECONDS = 6 * 60 * 60;

const ANSWER_UPDATED = parseAbiItem(
  'event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt)',
);

const AGGREGATOR_PROXY_ABI = [
  { type: 'function', name: 'aggregator', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', name: 'description', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
] as const;

export interface PriceRound {
  /** The aggregator that emitted it — this is the address the vault must trust, not the proxy. */
  aggregator: Address;
  /** Sepolia transaction carrying the AnswerUpdated log. */
  txHash: Hex;
  blockNumber: bigint;
  /** Raw answer at the feed's own 8 decimals. */
  answer: bigint;
  roundId: bigint;
  updatedAt: bigint;
  /** Human-readable, e.g. 2490.032. */
  price: number;
  /** Seconds since the feed wrote this round. */
  ageSeconds: number;
}

export type OracleErrorCode =
  | 'ERR_NO_PROVABLE_ROUND'
  | 'ERR_ROUND_TOO_STALE'
  | 'ERR_AGGREGATOR_UNAVAILABLE';

export class OracleError extends Error {
  readonly code: OracleErrorCode;
  readonly detail?: string;

  constructor(code: OracleErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'OracleError';
    this.code = code;
    this.detail = detail;
  }
}

/** Resolve the aggregator currently sitting behind the proxy. */
export async function resolveAggregator(
  proxy: Address = SEPOLIA_ETH_USD_PROXY,
): Promise<{ aggregator: Address; description: string }> {
  try {
    const [aggregator, description] = await Promise.all([
      sepoliaPublicClient.readContract({ address: proxy, abi: AGGREGATOR_PROXY_ABI, functionName: 'aggregator' }),
      sepoliaPublicClient.readContract({ address: proxy, abi: AGGREGATOR_PROXY_ABI, functionName: 'description' }),
    ]);
    return { aggregator: aggregator as Address, description: description as string };
  } catch (cause) {
    throw new OracleError(
      'ERR_AGGREGATOR_UNAVAILABLE',
      'Could not resolve the Chainlink aggregator on Sepolia',
      cause instanceof Error ? cause.message : undefined,
    );
  }
}

/**
 * Find the newest price round that is provable today.
 *
 * Two windows have to overlap. The attestor quorum trails Sepolia's head, so anything above
 * `attestedHeight` cannot be proven yet. The vault rejects observations older than its staleness
 * window, so anything too far back is useless. We search downward from the attested height and
 * take the first round inside both.
 *
 * On Sepolia this is less comfortable than it sounds: the ETH/USD feed writes roughly hourly,
 * so there are only a handful of eligible rounds at any moment.
 */
export async function findProvableRound(
  options: { aggregator?: Address; lookbackBlocks?: bigint; maxAgeSeconds?: number } = {},
): Promise<PriceRound> {
  const { lookbackBlocks = 4000n, maxAgeSeconds = MAX_ORACLE_STALENESS_SECONDS } = options;
  const aggregator = options.aggregator ?? (await resolveAggregator()).aggregator;

  const attestedHeight = BigInt(await getAttestedHeight(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA));
  const fromBlock = attestedHeight > lookbackBlocks ? attestedHeight - lookbackBlocks : 0n;

  const logs = await sepoliaPublicClient.getLogs({
    address: aggregator,
    event: ANSWER_UPDATED,
    fromBlock,
    // Never above the attested height: a proof for those blocks does not exist yet.
    toBlock: attestedHeight,
  });

  if (logs.length === 0) {
    throw new OracleError(
      'ERR_NO_PROVABLE_ROUND',
      'No attested Chainlink round in the search window',
      `Searched blocks ${fromBlock}–${attestedHeight} on Sepolia.`,
    );
  }

  const now = Math.floor(Date.now() / 1000);

  // Newest first — the freshest provable round is the one worth submitting.
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    const answer = log.args.current as bigint;
    const roundId = log.args.roundId as bigint;
    const updatedAt = log.args.updatedAt as bigint;
    const ageSeconds = now - Number(updatedAt);

    if (ageSeconds > maxAgeSeconds) break; // everything older is older still
    if (answer <= 0n) continue;

    return {
      aggregator,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      answer,
      roundId,
      updatedAt,
      price: Number(formatUnits(answer, ORACLE_DECIMALS)),
      ageSeconds,
    };
  }

  const newest = logs[logs.length - 1];
  throw new OracleError(
    'ERR_ROUND_TOO_STALE',
    'The newest attested round is already outside the staleness window',
    `Newest provable round is ${Math.round((now - Number(newest.args.updatedAt as bigint)) / 60)} minutes old; the vault accepts up to ${maxAgeSeconds / 3600} hours.`,
  );
}

/** Fetch the inclusion proof for a round and pack it for `submitPriceProof`. */
export async function buildPriceProof(round: PriceRound): Promise<{ proof: Hex; raw: AttestcoinProof }> {
  const raw = await fetchProof(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA, round.txHash);
  return { proof: encodeProofBundle(raw), raw };
}

/** Format an 18-decimal USD figure the way the console renders it. */
export function formatUsdWad(wad: bigint, fractionDigits = 2): string {
  return Number(formatUnits(wad, 18)).toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatAge(seconds: number): string {
  if (seconds < 90) return `${Math.max(0, Math.round(seconds))}s ago`;
  if (seconds < 5400) return `${Math.round(seconds / 60)}m ago`;
  return `${(seconds / 3600).toFixed(1)}h ago`;
}
