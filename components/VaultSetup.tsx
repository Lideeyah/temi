'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Cpu, Loader2, Store } from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';
import { NGN_PER_TCTC } from '@/lib/config';
import { formatNaira, parseNaira } from '@/lib/naira';
import { formatTctc } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ReserveSizingCard, computeSizing, HORIZONS } from './ReserveSizing';
import { Badge, Notice } from './ui/Primitives';

/**
 * The zero state, as a working instrument rather than an empty dashboard.
 *
 * A merchant arriving with no vault has nothing to look at: every balance is zero and every
 * tile is a row of dashes. Showing them that and asking them to commit first is the fastest way
 * to lose them. So the uninitialised dashboard is replaced by the one thing they *can* act on
 * without an account — sizing their own reserve — and the numbers they produce carry straight
 * into the funding step.
 *
 * Nothing here reads the chain. The sizing is arithmetic on a figure they typed, which is why it
 * can run before an account exists at all.
 */
export function VaultSetup({
  connected,
  busy,
  onInitialize,
  suggestedLabel,
  rateLine,
}: {
  connected: boolean;
  busy: boolean;
  /** Called with the first month's allocation, in wei of tCTC. */
  onInitialize: (monthlyWei: bigint) => void;
  suggestedLabel?: string;
  /** The proven exchange rate, shown against the conversion it governs. */
  rateLine?: React.ReactNode;
}) {
  const [category, setCategory] = useState<'movable' | 'property'>('movable');
  const [raw, setRaw] = useState('600,000');
  const [horizon, setHorizon] = useState<number>(HORIZONS.movable[0]);

  const declaredWei = useMemo(() => {
    const naira = parseNaira(raw);
    if (naira <= 0) return 0n;
    return parseUnits((naira / NGN_PER_TCTC).toFixed(18), 18);
  }, [raw]);

  const sizing = useMemo(
    () => computeSizing(declaredWei, category, horizon),
    [declaredWei, category, horizon],
  );

  const chooseCategory = (next: 'movable' | 'property') => {
    setCategory(next);
    setHorizon(HORIZONS[next][0]);
  };

  return (
    <section className="card p-5 sm:p-7">
      <div className="mb-6 max-w-[58ch]">
        <p className="eyebrow mb-2.5">Set up your vault</p>
        <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[28px]">
          Establish your business emergency vault
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-slate-strong">
          Allocate an unencumbered liquidity reserve on Creditcoin. 85% remains your withdrawable
          property; 15% pools into the mutual SME cushion that covers a loss arriving before you
          have saved for it.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">Step 1 · What are you protecting?</p>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {(
              [
                { id: 'movable', label: 'Machinery', hint: 'Generator, bike, inverter', icon: <Cpu size={13} strokeWidth={1.75} /> },
                { id: 'property', label: 'Shop or stall', hint: 'Market stall, kiosk', icon: <Store size={13} strokeWidth={1.75} /> },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                onClick={() => chooseCategory(option.id)}
                className={cn(
                  'focus-ring rounded-[3px] border px-3 py-2.5 text-left transition-colors',
                  category === option.id
                    ? 'border-ink bg-[rgba(31,36,47,0.04)]'
                    : 'border-hairline hover:bg-[rgba(31,36,47,0.02)]',
                )}
              >
                <span className="mb-1 flex items-center gap-1.5 text-slate-strong">
                  {option.icon}
                  <span className="text-[12.5px] font-medium text-ink">{option.label}</span>
                </span>
                <span className="block text-[10.5px] leading-snug text-slate-soft">{option.hint}</span>
              </button>
            ))}
          </div>

          <label className="block">
            <span className="eyebrow mb-1.5 block">Replacement value</span>
            <div className="relative">
              <span className="tabular pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] font-semibold text-slate-soft">
                ₦
              </span>
              <input
                value={raw}
                onChange={(event) => {
                  const next = parseNaira(event.target.value);
                  setRaw(next > 0 ? next.toLocaleString('en-NG') : event.target.value);
                }}
                inputMode="numeric"
                aria-label="Replacement value in Naira"
                className="tabular focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised py-2.5 pl-9 pr-3 text-[20px] font-semibold tracking-[-0.02em] text-ink"
              />
            </div>
            <p className="tabular mt-1.5 text-[10.5px] text-slate-soft">
              ≈ {formatTctc(declaredWei, 2)} tCTC
            </p>
            {rateLine ? <div className="mt-1">{rateLine}</div> : null}
          </label>
        </div>

        <div>
          <p className="eyebrow mb-2">Step 2 · How much to hold</p>
          <ReserveSizingCard
            declaredWei={declaredWei}
            category={category}
            horizonMonths={horizon}
            onHorizonChange={setHorizon}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        {!connected ? (
          <Notice tone="neutral" title="You will open a vault first">
            One tap, using the fingerprint that already unlocks this phone. No seed phrase, no
            extension, and gas is covered for you.
          </Notice>
        ) : null}

        <button
          onClick={() => onInitialize(sizing.monthlyWei)}
          disabled={busy || declaredWei <= 0n}
          className={cn(
            'focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-3.5',
            'text-[13.5px] font-medium tracking-[-0.01em] text-paper transition-colors hover:bg-[#2b3140]',
            'disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-7',
          )}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          {busy
            ? 'Confirming…'
            : connected
              ? `Initialise vault & fund ${formatNaira(Number(formatUnits(sizing.monthlyWei, 18)) * NGN_PER_TCTC)}`
              : 'Open your vault to continue'}
          {!busy ? <ArrowRight size={14} strokeWidth={1.75} /> : null}
        </button>

        <p className="mt-2.5 max-w-[62ch] text-[10.5px] leading-relaxed text-slate-soft">
          This funds your first month&apos;s allocation. It is a deposit, not a premium — 85% stays
          withdrawable at any moment, and you can register the asset itself once your vault is
          open. {suggestedLabel ? <span className="tabular">{suggestedLabel}</span> : null}
        </p>
      </div>
    </section>
  );
}

/** Shown in the header while no reserve exists yet. */
export function UninitializedBadge() {
  return <Badge tone="ochre">Vault: not initialised</Badge>;
}
