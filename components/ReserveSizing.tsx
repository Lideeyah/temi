'use client';

import { useMemo } from 'react';
import { formatFiat } from '@/lib/regions';
import { formatTctc } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useRegion } from './RegionProvider';

/**
 * Reserve sizing — what replaces underwriting.
 *
 * A conventional micro-insurer computes a premium and a policy term. Tèmi charges no premium,
 * so there is nothing to underwrite; what is left is the question an operator actually cannot
 * answer for themselves, which is *how much should I be holding*. Left to guess, people either
 * put in a token amount that covers nothing or hold back entirely.
 *
 * The percentages differ by asset class for a physical reason: machinery fails outright and is
 * replaced whole, while damage to a shop is usually partial — a flooded stall loses stock, not
 * the building. The contract exposes the same figures through `suggestedTargetReserve`, so the
 * number on screen is the number recorded against the asset rather than a client-side opinion.
 */

/** Must match TARGET_RESERVE_*_BPS in TemiVault.sol. */
export const TARGET_BPS = { movable: 3000, property: 2000 } as const;

export const HORIZONS = {
  movable: [3, 6],
  property: [6, 12],
} as const;

export interface Sizing {
  declaredWei: bigint;
  targetWei: bigint;
  monthlyWei: bigint;
  monthlyTier1Wei: bigint;
  monthlyTier2Wei: bigint;
  horizonMonths: number;
  /** Monthly contribution as a share of the asset's value, for sanity. */
  monthlyRatePercent: number;
}

export function computeSizing(
  declaredWei: bigint,
  category: 'movable' | 'property',
  horizonMonths: number,
): Sizing {
  const targetWei = (declaredWei * BigInt(TARGET_BPS[category])) / 10_000n;
  const monthlyWei = horizonMonths > 0 ? targetWei / BigInt(horizonMonths) : 0n;
  const monthlyTier1Wei = (monthlyWei * 8500n) / 10_000n;

  return {
    declaredWei,
    targetWei,
    monthlyWei,
    monthlyTier1Wei,
    monthlyTier2Wei: monthlyWei - monthlyTier1Wei,
    horizonMonths,
    monthlyRatePercent:
      declaredWei > 0n ? (Number(monthlyWei) / Number(declaredWei)) * 100 : 0,
  };
}

export function ReserveSizingCard({
  declaredWei,
  category,
  horizonMonths,
  onHorizonChange,
  rateLine,
}: {
  declaredWei: bigint;
  category: 'movable' | 'property';
  horizonMonths: number;
  onHorizonChange: (months: number) => void;
  /** The proven exchange rate, rendered where the conversion is shown. */
  rateLine?: React.ReactNode;
}) {
  const { region } = useRegion();
  const money = (wei: bigint) => formatFiat(wei, region);

  const sizing = useMemo(
    () => computeSizing(declaredWei, category, horizonMonths),
    [declaredWei, category, horizonMonths],
  );

  if (declaredWei <= 0n) return null;

  return (
    <div className="border border-hairline bg-card">
      <div className="border-b border-hairline px-3.5 py-2.5">
        <p className="eyebrow mb-1">Suggested reserve target</p>
        <div className="flex items-baseline justify-between gap-3">
          <span className="tabular text-[22px] font-semibold leading-none tracking-[-0.03em] text-ink">
            {money(sizing.targetWei)}
          </span>
          <span className="tabular text-[10.5px] text-slate-soft">
            {TARGET_BPS[category] / 100}% of value · {formatTctc(sizing.targetWei, 2)} tCTC
          </span>
        </div>
        {rateLine ? <div className="mt-1.5">{rateLine}</div> : null}
        <p className="mt-1.5 text-[10.5px] leading-snug text-slate-soft">
          {category === 'movable'
            ? 'Machinery tends to fail outright and be replaced whole, so it is sized higher.'
            : 'Damage to a shop is usually partial — stock rather than structure — so it is sized lower.'}
        </p>
      </div>

      <div className="px-3.5 py-3">
        <p className="eyebrow mb-1.5">Funding horizon</p>
        <div className="mb-3 flex overflow-hidden rounded-[3px] border border-hairline-strong">
          {HORIZONS[category].map((months) => (
            <button
              key={months}
              onClick={() => onHorizonChange(months)}
              className={cn(
                'focus-ring flex-1 px-2 py-1.5 text-[11px] font-medium transition-colors',
                horizonMonths === months
                  ? 'bg-ink text-paper'
                  : 'bg-transparent text-slate-strong hover:bg-[rgba(31,36,47,0.05)]',
              )}
            >
              {months} months
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[11px] text-slate-soft">Monthly contribution</span>
          <span className="tabular text-[14px] font-semibold text-ink">
            {money(sizing.monthlyWei)}
            <span className="ml-1 text-[10px] font-normal text-slate-soft">/mo</span>
          </span>
        </div>

        {/* Where each month's contribution lands. */}
        <div className="flex h-[6px] w-full overflow-hidden rounded-[1px]">
          <div className="h-full bg-ink" style={{ width: '85%' }} />
          <div className="h-full bg-moss" style={{ width: '15%' }} />
        </div>
        <div className="mt-1.5 space-y-0.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10.5px] text-slate-strong">85% · stays yours</span>
            <span className="tabular text-[10.5px] text-ink">{money(sizing.monthlyTier1Wei)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10.5px] text-moss">15% · mutual buffer</span>
            <span className="tabular text-[10.5px] text-moss">{money(sizing.monthlyTier2Wei)}</span>
          </div>
        </div>

        <p className="mt-2.5 border-t border-hairline pt-2 text-[10px] leading-relaxed text-slate-soft">
          Roughly {sizing.monthlyRatePercent.toFixed(1)}% of the asset&apos;s value each month.
          Nothing here is a premium — every {region.currencyCode} stays on your balance sheet, and
          the mutual share is what unlocks the 3× emergency ceiling.
        </p>
      </div>
    </div>
  );
}
