import { NGN_PER_TCTC } from './config';

/**
 * Naira helpers for the public-facing surfaces.
 *
 * Tèmi's merchants think in Naira, not tCTC. Everything here is presentation only — the vault's
 * arithmetic happens in wei on-chain, and this rate never touches it.
 */

export const TIER1_SHARE = 0.85;
export const TIER2_SHARE = 0.15;

export function formatNaira(amount: number, fractionDigits = 0): string {
  return `₦${Math.round(amount).toLocaleString('en-NG', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

/** Strip everything a merchant might type into a currency box: ₦, commas, spaces. */
export function parseNaira(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function nairaToTctc(naira: number): number {
  return naira / NGN_PER_TCTC;
}

export interface ReserveSplit {
  gross: number;
  tier1: number;
  tier2: number;
  claimCeiling: number;
}

/** The 85/15 split, plus the 3x-lifetime claim ceiling the contract enforces. */
export function splitReserve(gross: number): ReserveSplit {
  const tier1 = gross * TIER1_SHARE;
  return {
    gross,
    tier1,
    tier2: gross - tier1,
    claimCeiling: gross * 3,
  };
}
