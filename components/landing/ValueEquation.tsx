'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { NGN_PER_TCTC } from '@/lib/config';
import { formatNaira, nairaToTctc, parseNaira, splitReserve } from '@/lib/naira';
import { cn } from '@/lib/utils';

/** Assets a Lagos merchant actually insures, at realistic replacement cost. */
const PRESETS = [
  { label: 'Firman 3.5kVA generator', amount: 450_000 },
  { label: 'Delivery bike', amount: 850_000 },
  { label: 'Tejuosho market stall', amount: 1_500_000 },
  { label: 'Balogun store', amount: 4_000_000 },
];

/**
 * The Direct Value Equation.
 *
 * This is the argument, made arithmetically. A merchant types what their generator is worth and
 * watches the number split — most of it stays theirs, a slice backs everyone. Nothing is spent.
 * An insurance premium at the same ticket would be gone.
 */
export function ValueEquation() {
  const [raw, setRaw] = useState('1,500,000');
  const gross = parseNaira(raw);
  const split = useMemo(() => splitReserve(gross), [gross]);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-hairline px-5 py-3">
        <p className="eyebrow">Direct value equation</p>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-strong">
          What is your generator, bike or stall worth? Every Naira you put in stays yours.
        </p>
      </div>

      <div className="px-5 py-4">
        <label className="block">
          <span className="eyebrow mb-1.5 block">Asset value</span>
          <div className="relative">
            <span className="tabular pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[22px] font-semibold text-slate-soft">
              ₦
            </span>
            <input
              value={raw}
              onChange={(event) => {
                const next = parseNaira(event.target.value);
                setRaw(next > 0 ? next.toLocaleString('en-NG') : event.target.value);
              }}
              inputMode="numeric"
              aria-label="Asset value in Naira"
              className="tabular focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised py-3 pl-9 pr-3 text-[22px] font-semibold tracking-[-0.02em] text-ink"
            />
          </div>
        </label>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setRaw(preset.amount.toLocaleString('en-NG'))}
              className={cn(
                'focus-ring rounded-[2px] border px-2 py-1 text-[10.5px] transition-colors',
                gross === preset.amount
                  ? 'border-ink bg-ink text-paper'
                  : 'border-hairline-strong text-slate-strong hover:bg-[rgba(31,36,47,0.04)]',
              )}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setRaw('')}
            aria-label="Clear"
            className="focus-ring rounded-[2px] border border-transparent px-1.5 py-1 text-slate-soft hover:text-ink"
          >
            <RotateCcw size={11} strokeWidth={1.75} />
          </button>
        </div>

        {/* The split, drawn to scale. */}
        <div className="mt-5">
          <div className="flex h-[9px] w-full overflow-hidden rounded-[1px]">
            <div className="h-full bg-ink transition-[width] duration-300" style={{ width: '85%' }} />
            <div className="h-full bg-moss transition-[width] duration-300" style={{ width: '15%' }} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="border-l-2 border-l-ink pl-3">
              <p className="eyebrow mb-1">85% · Yours</p>
              <p className="tabular text-[24px] font-semibold leading-none tracking-[-0.03em] text-ink">
                {formatNaira(split.tier1)}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-strong">
                Personal reserve. Withdrawable at any moment, without notice or penalty.
              </p>
            </div>
            <div className="border-l-2 border-l-moss pl-3">
              <p className="eyebrow mb-1 text-moss">15% · Mutual buffer</p>
              <p className="tabular text-[24px] font-semibold leading-none tracking-[-0.03em] text-moss">
                {formatNaira(split.tier2)}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-strong">
                Backs every merchant in the pool when a loss runs past their own reserve.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-hairline pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[11px] text-slate-soft">Maximum you can claim</span>
            <span className="tabular text-[13px] font-semibold text-ink">
              {formatNaira(split.claimCeiling)}
              <span className="ml-1.5 text-[10px] font-normal text-slate-soft">3× contributions</span>
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[11px] text-slate-soft">Settles on-chain as</span>
            <span className="tabular text-[11px] text-slate-strong">
              {nairaToTctc(gross).toFixed(2)} tCTC
              <span className="ml-1.5 text-[10px] text-slate-soft">
                @ ₦{NGN_PER_TCTC.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* The comparison that makes the case. */}
        <div className="mt-4 border border-hairline border-l-2 border-l-rust bg-[rgba(140,74,74,0.05)] px-3.5 py-2.5">
          <p className="text-[11.5px] leading-relaxed text-slate-strong">
            A commercial policy at this value costs roughly{' '}
            <span className="tabular font-semibold text-rust">{formatNaira(gross * 0.05)}</span> a
            year in premium.{' '}
            <span className="font-medium text-ink">
              If nothing breaks, that money is simply gone.
            </span>{' '}
            With Tèmi it is still on your balance sheet.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LaunchLink({ className }: { className?: string }) {
  return (
    <a
      href="/app"
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-3',
        'text-[13px] font-medium tracking-[-0.01em] text-paper transition-colors hover:bg-[#2b3140]',
        className,
      )}
    >
      Launch Merchant Vault
      <ArrowRight size={14} strokeWidth={1.75} />
    </a>
  );
}
