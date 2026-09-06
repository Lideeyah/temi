import { formatUnits, parseUnits } from 'viem';
import { NGN_PER_TCTC } from './config';

export type Denomination = 'tCTC' | 'NGN';

/** Fixed-width tabular figures, so columns of metrics stay aligned in the ledger. */
export function formatTctc(wei: bigint, fractionDigits = 4): string {
  const value = Number(formatUnits(wei, 18));
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatNgn(wei: bigint, fractionDigits = 0): string {
  const value = Number(formatUnits(wei, 18)) * NGN_PER_TCTC;
  return value.toLocaleString('en-NG', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatAmount(wei: bigint, denomination: Denomination): string {
  return denomination === 'NGN' ? `₦${formatNgn(wei)}` : `${formatTctc(wei)} tCTC`;
}

/**
 * Lossless wei -> decimal string, for values that will be parsed back into wei.
 *
 * `formatTctc` rounds for display, which is fine on a label and wrong in an input: rounding a
 * balance UP and feeding it back produces an amount larger than the balance, and the contract
 * reverts. Anything that round-trips through `parseTctc` must come from here.
 */
export function formatTctcExact(wei: bigint): string {
  return formatUnits(wei, 18);
}

export function parseTctc(input: string): bigint {
  const cleaned = input.replace(/,/g, '').trim();
  if (!cleaned || Number.isNaN(Number(cleaned))) return 0n;
  return parseUnits(cleaned, 18);
}

export function truncateAddress(address: string, lead = 6, tail = 4): string {
  if (address.length <= lead + tail + 2) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

export function truncateHash(hash: string): string {
  return truncateAddress(hash, 10, 8);
}

/** Renders a bytes32 asset id compactly without losing its recognisable head. */
export function shortAssetId(assetId: string): string {
  return `${assetId.slice(0, 10)}…${assetId.slice(-6)}`;
}
