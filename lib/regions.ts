import { formatUnits, parseUnits } from 'viem';

/**
 * Regional adaptation.
 *
 * `TemiVault` is currency-agnostic: it moves 18-decimal base units and knows nothing about
 * Naira, Cedi or Shilling. Every fiat figure in this application is a presentation layer over
 * those units, resolved from the merchant's declared jurisdiction. That separation is what lets
 * the same deployed contract serve a trader in Balogun and one in Kumasi without a redeploy —
 * and it is why no conversion rate here ever reaches the chain.
 *
 * The settlement rails differ because the payment infrastructure genuinely differs: Nigeria
 * runs on instant bank transfer, Ghana and Kenya on mobile money. Pretending one rail fits all
 * three would be the tell that nobody had spoken to a merchant in any of them.
 */

export type RegionId = 'NG' | 'GH' | 'KE' | 'GLOBAL';

export type SettlementRail = 'trugi-nip' | 'mtn-momo' | 'mpesa-stk' | 'attestcoin';

export interface Region {
  id: RegionId;
  /** Displayed on the selector. */
  flag: string;
  name: string;
  /** E.164 prefix. Fixed once a jurisdiction is chosen. */
  dialingCode: string;
  /** National mobile number length, excluding the prefix, for validation. */
  nationalDigits: number;
  currencySymbol: string;
  currencyCode: string;
  /** Units of local currency per tCTC. Presentation only — never used on-chain. */
  ratePerTctc: number;
  rail: SettlementRail;
  railName: string;
  /** Where funds actually land, shown on a settlement receipt. */
  payoutTarget: string;
  /** A representative asset value, so the sizing card opens on something plausible. */
  defaultAssetValue: number;
  /** Live pilot, or a configured fallback we have not operated in yet. */
  status: 'pilot' | 'configured';
}

export const REGIONS: Record<RegionId, Region> = {
  NG: {
    id: 'NG',
    flag: '🇳🇬',
    name: 'Nigeria',
    dialingCode: '+234',
    nationalDigits: 10,
    currencySymbol: '₦',
    currencyCode: 'NGN',
    ratePerTctc: 1_450,
    rail: 'trugi-nip',
    railName: 'Trugi NIP Instant Transfer',
    payoutTarget: 'OPay · Moniepoint · GTBank',
    defaultAssetValue: 600_000,
    status: 'pilot',
  },
  GH: {
    id: 'GH',
    flag: '🇬🇭',
    name: 'Ghana',
    dialingCode: '+233',
    nationalDigits: 9,
    currencySymbol: 'GH₵',
    currencyCode: 'GHS',
    ratePerTctc: 14.8,
    rail: 'mtn-momo',
    railName: 'MTN MoMo Settlement Rail',
    payoutTarget: 'MTN MoMo · Vodafone Cash',
    defaultAssetValue: 6_200,
    status: 'configured',
  },
  KE: {
    id: 'KE',
    flag: '🇰🇪',
    name: 'Kenya',
    dialingCode: '+254',
    nationalDigits: 9,
    currencySymbol: 'KSh',
    currencyCode: 'KES',
    ratePerTctc: 128,
    rail: 'mpesa-stk',
    railName: 'M-Pesa Express Rail',
    payoutTarget: 'M-Pesa',
    defaultAssetValue: 55_000,
    status: 'configured',
  },
  GLOBAL: {
    id: 'GLOBAL',
    flag: '🌍',
    name: 'Global · Web3 direct',
    dialingCode: '+1',
    nationalDigits: 10,
    currencySymbol: '$',
    currencyCode: 'USD1',
    ratePerTctc: 1,
    rail: 'attestcoin',
    railName: 'Attestcoin cross-chain · Ethereum Sepolia',
    payoutTarget: 'Creditcoin direct',
    defaultAssetValue: 400,
    status: 'configured',
  },
};

export const REGION_LIST: Region[] = [REGIONS.NG, REGIONS.GH, REGIONS.KE, REGIONS.GLOBAL];

export const DEFAULT_REGION: RegionId = 'NG';

/* ------------------------------------------------------------------ */
/*                        MONEY, BOTH WAYS                             */
/* ------------------------------------------------------------------ */

/** Base units (wei of tCTC) rendered in the region's currency. */
export function formatFiat(wei: bigint, region: Region, fractionDigits?: number): string {
  const value = Number(formatUnits(wei, 18)) * region.ratePerTctc;
  // Cedi and dollar amounts read wrong without minor units; Naira and Shilling read wrong with.
  const digits = fractionDigits ?? (region.ratePerTctc < 100 ? 2 : 0);
  return `${region.currencySymbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

/** Whatever a merchant typed into a currency box, as a number. */
export function parseFiat(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Local currency to base units. */
export function fiatToWei(amount: number, region: Region): bigint {
  if (!(amount > 0)) return 0n;
  return parseUnits((amount / region.ratePerTctc).toFixed(18), 18);
}

export function formatFiatPlain(amount: number, region: Region, fractionDigits?: number): string {
  const digits = fractionDigits ?? (region.ratePerTctc < 100 ? 2 : 0);
  return `${region.currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

/* ------------------------------------------------------------------ */
/*                          PHONE NUMBERS                              */
/* ------------------------------------------------------------------ */

/** Strip a national number down to digits, dropping a leading trunk zero. */
export function normaliseNationalNumber(input: string): string {
  return input.replace(/\D/g, '').replace(/^0+/, '');
}

/** E.164, which is the only format worth storing. */
export function toE164(national: string, region: Region): string {
  return `${region.dialingCode}${normaliseNationalNumber(national)}`;
}

/**
 * Exactly the national length, with no slack.
 *
 * This once allowed a digit either side, on the reasoning that numbering plans vary. They do not
 * vary here: NG, GH, KE and US national numbers are all fixed-length, and the slack was doing
 * real harm. The number is half the vault key — a merchant who typed eleven digits by accident
 * got a valid-looking +23490646781145, a vault derived from a number that does not exist, and no
 * way back to it by typing their actual number. A refusal at the keyboard is the only place this
 * is cheap to fix.
 */
export function isValidNationalNumber(national: string, region: Region): boolean {
  return normaliseNationalNumber(national).length === region.nationalDigits;
}

/** Masked for a receipt: never show a merchant's full number back to them in a shared view. */
export function maskPhone(e164: string): string {
  if (e164.length < 7) return e164;
  return `${e164.slice(0, 6)}****${e164.slice(-3)}`;
}
