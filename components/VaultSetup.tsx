'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Cpu, Loader2, Store } from 'lucide-react';
import { fiatToWei, formatFiat, formatFiatPlain, parseFiat, type RegionId } from '@/lib/regions';
import { formatTctc } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useRegion } from './RegionProvider';
import { ReserveSizingCard, computeSizing, recommendedHorizon } from './ReserveSizing';
import { StageRail } from './MerchantProfileStage';
import { PhoneVerification } from './PhoneVerification';
import { PinSetup } from './PinSetup';
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
  biometricAvailable,
  accountError,
  biometricFellBack,
  onCreateVault,
  onUseWallet,
  onInitialize,
  rateLine,
}: {
  connected: boolean;
  busy: boolean;
  biometricAvailable: boolean;
  accountError: { title: string; detail?: string } | null;
  /** The merchant asked for one-touch unlock and this device could not provide it. */
  biometricFellBack: boolean;
  /** Stage 0c — create the vault once the number is verified and a PIN chosen. */
  onCreateVault: (params: {
    pin: string;
    phoneE164: string;
    keyShare: string;
    businessName: string;
    biometricEnabled: boolean;
  }) => void;
  /** Escape hatch to a conventional wallet. */
  onUseWallet: () => void;
  /** Stage 2 — fund the first allocation, in wei of tCTC. */
  onInitialize: (monthlyWei: bigint) => void;
  /** The proven exchange rate, shown against the conversion it governs. */
  rateLine?: React.ReactNode;
}) {
  const { region, setRegion } = useRegion();
  const [category, setCategory] = useState<'movable' | 'property'>('movable');
  const [raw, setRaw] = useState(() => region.defaultAssetValue.toLocaleString('en-US'));
  const [horizon, setHorizon] = useState<number>(recommendedHorizon('movable'));

  // Changing jurisdiction re-anchors the example value: a Ghanaian trader should not open on a
  // figure that only makes sense in Naira.
  const changeRegion = (id: RegionId) => {
    setRegion(id);
  };
  const [lastRegionId, setLastRegionId] = useState(region.id);
  if (region.id !== lastRegionId) {
    setLastRegionId(region.id);
    setRaw(region.defaultAssetValue.toLocaleString('en-US'));
  }

  const declaredWei = useMemo(() => fiatToWei(parseFiat(raw), region), [raw, region]);

  // Phase 1 hands back the verified number and the server's half of the key.
  const [verified, setVerified] = useState<{ phoneE164: string; keyShare: string } | null>(null);
  const [businessName, setBusinessName] = useState('');

  const stage: 0 | 1 | 2 = connected ? 1 : 0;

  const sizing = useMemo(
    () => computeSizing(declaredWei, category, horizon),
    [declaredWei, category, horizon],
  );

  // Switching category re-sizes the target but keeps the merchant's chosen horizon. They set it
  // against their own cash flow, which does not change because the asset did.
  const chooseCategory = (next: 'movable' | 'property') => setCategory(next);

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

      <StageRail stage={stage} />

      {biometricFellBack ? (
        <div className="mb-4 border border-hairline border-l-2 border-l-ochre bg-[rgba(140,115,62,0.06)] px-3.5 py-2.5">
          <p className="text-[11.5px] font-medium text-ochre">One-touch unlock is not available here</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-strong">
            This browser cannot seal a key to your fingerprint, so your PIN remains the way in. Your
            vault is unaffected — the PIN is what derives it either way.
          </p>
        </div>
      ) : null}

      {stage === 0 ? (
        !verified ? (
          <PhoneVerification
            region={region}
            onRegionChange={changeRegion}
            onVerified={setVerified}
          />
        ) : (
          <div className="space-y-4">
            <PinSetup
              businessName={businessName}
              onBusinessNameChange={setBusinessName}
              phoneE164={verified.phoneE164}
              biometricAvailable={biometricAvailable}
              busy={busy}
              error={accountError}
              onConfirm={({ pin, biometricEnabled }) =>
                onCreateVault({
                  pin,
                  phoneE164: verified.phoneE164,
                  keyShare: verified.keyShare,
                  businessName,
                  biometricEnabled,
                })
              }
            />
            <button
              onClick={onUseWallet}
              className="focus-ring w-full text-center text-[10.5px] text-slate-soft underline underline-offset-2"
            >
              Use a Web3 wallet instead
            </button>
          </div>
        )
      ) : (
      <>
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
                {region.currencySymbol}
              </span>
              <input
                value={raw}
                onChange={(event) => {
                  const next = parseFiat(event.target.value);
                  setRaw(next > 0 ? next.toLocaleString('en-US') : event.target.value);
                }}
                inputMode="numeric"
                aria-label={`Replacement value in ${region.currencyCode}`}
                className={cn(
                  'tabular focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised py-2.5 pr-3 text-[20px] font-semibold tracking-[-0.02em] text-ink',
                  region.currencySymbol.length > 1 ? 'pl-14' : 'pl-9',
                )}
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
          {busy ? 'Confirming…' : `Initialise vault & fund ${formatFiat(sizing.monthlyWei, region)}`}
          {!busy ? <ArrowRight size={14} strokeWidth={1.75} /> : null}
        </button>

        <p className="mt-2.5 max-w-[62ch] text-[10.5px] leading-relaxed text-slate-soft">
          This funds your first month&apos;s allocation via {region.railName}. It is a deposit, not
          a premium — 85% stays withdrawable at any moment, and you can register the asset itself
          once your vault is open.
        </p>
      </div>
      </>
      )}
    </section>
  );
}

/** Shown in the header while no reserve exists yet. */
/**
 * Two different facts, told apart.
 *
 * "Vault: not initialised" was shown whenever there was nothing to read — including to someone
 * who simply had not signed in yet, on a phone they had just opened the app on. That reads as a
 * statement about their vault, which may be funded and perfectly fine; it is actually a statement
 * about this browser. Saying "not signed in" is both true and the thing they can act on.
 */
export function UninitializedBadge({ signedIn = true }: { signedIn?: boolean }) {
  return <Badge tone="ochre">{signedIn ? 'Vault: not initialised' : 'Not signed in'}</Badge>;
}
