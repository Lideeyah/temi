'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Fingerprint, Loader2, TriangleAlert } from 'lucide-react';
import {
  REGION_LIST,
  isValidNationalNumber,
  normaliseNationalNumber,
  toE164,
  type Region,
} from '@/lib/regions';
import { cn } from '@/lib/utils';
import { Badge, Notice } from './ui/Primitives';

/**
 * Stage 0 — who is this, and where do they trade.
 *
 * The jurisdiction is asked first because everything downstream depends on it: the currency a
 * merchant reads, the dialing prefix on their number, and — most consequentially — which
 * settlement rail their money will actually travel on. A Ghanaian trader shown a Nigerian bank
 * transfer would rightly conclude the product was not built for them.
 *
 * The phone number is not a login. It is the destination a payout eventually reaches, so it is
 * collected here and stored in E.164, which is the only format worth keeping.
 */
export function MerchantProfileStage({
  region,
  onRegionChange,
  busy,
  biometricAvailable,
  error,
  onProvision,
  onUseWallet,
}: {
  region: Region;
  onRegionChange: (id: Region['id']) => void;
  busy: boolean;
  biometricAvailable: boolean;
  error: { title: string; detail?: string } | null;
  onProvision: (profile: { businessName: string; phoneE164: string }) => void;
  /** Escape hatch when the passkey prompt never arrives. */
  onUseWallet: () => void;
}) {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');

  // A passkey prompt that never appears looks identical to one that is merely slow. After a few
  // seconds of waiting, offer a way out rather than leaving someone watching a spinner until a
  // 60-second timeout they cannot see.
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  useEffect(() => {
    if (!busy) {
      setWaitedTooLong(false);
      return;
    }
    const timer = setTimeout(() => setWaitedTooLong(true), 8000);
    return () => clearTimeout(timer);
  }, [busy]);

  const phoneOk = phone.trim() === '' ? null : isValidNationalNumber(phone, region);
  const ready = businessName.trim().length >= 2 && phoneOk === true;

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow mb-2">Where do you trade?</p>
        <div className="grid grid-cols-2 gap-2">
          {REGION_LIST.map((option) => {
            const selected = option.id === region.id;
            return (
              <button
                key={option.id}
                onClick={() => onRegionChange(option.id)}
                className={cn(
                  'focus-ring rounded-[3px] border px-3 py-2.5 text-left transition-colors',
                  selected
                    ? 'border-ink bg-[rgba(31,36,47,0.04)]'
                    : 'border-hairline hover:bg-[rgba(31,36,47,0.02)]',
                )}
              >
                <span className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[15px] leading-none" aria-hidden>
                      {option.flag}
                    </span>
                    <span className="text-[12.5px] font-medium text-ink">{option.name}</span>
                  </span>
                  {selected ? <Check size={12} className="text-moss" strokeWidth={2.5} /> : null}
                </span>
                <span className="tabular block text-[10px] text-slate-soft">
                  {option.currencySymbol} {option.currencyCode} · {option.dialingCode}
                </span>
                <span className="mt-0.5 block text-[9.5px] leading-snug text-slate-soft">
                  {option.railName}
                </span>
              </button>
            );
          })}
        </div>

        {region.status === 'configured' ? (
          <p className="mt-2 text-[10.5px] leading-snug text-ochre">
            {region.name} is configured but not yet piloted — the rail is wired and the currency
            resolves, though no merchant has settled through it in production.
          </p>
        ) : null}
      </div>

      <label className="block">
        <span className="eyebrow mb-1.5 block">Trading entity name</span>
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder="e.g. Adeola Electronics"
          className="focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised px-3 py-2.5 text-[13px] text-ink placeholder:text-slate-soft"
        />
        <span className="mt-1.5 block text-[10.5px] text-slate-soft">
          Shown on your phone&apos;s passkey prompt, so you recognise it later.
        </span>
      </label>

      <label className="block">
        <span className="eyebrow mb-1.5 block">Mobile number</span>
        <div className="flex overflow-hidden rounded-[3px] border border-hairline-strong bg-paper-raised">
          <span className="tabular flex shrink-0 items-center gap-1.5 border-r border-hairline px-3 py-2.5 text-[13px] text-slate-strong">
            <span aria-hidden>{region.flag}</span>
            {region.dialingCode}
          </span>
          <input
            value={phone}
            // Same constraint as verification: digits only, capped at the plan length plus the
            // optional trunk zero. A payout number that is one digit off is money misrouted.
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, '').slice(0, region.nationalDigits + 1))
            }
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={region.nationalDigits + 1}
            placeholder={'0'.repeat(region.nationalDigits)}
            className="tabular focus-ring w-full bg-transparent px-3 py-2.5 text-[13px] text-ink placeholder:text-slate-soft"
          />
        </div>
        {phoneOk === false ? (
          <span className="mt-1.5 block text-[10.5px] text-rust">
            {region.name} numbers are exactly {region.nationalDigits} digits after{' '}
            {region.dialingCode}.
          </span>
        ) : phoneOk === true ? (
          <span className="tabular mt-1.5 block text-[10.5px] text-moss">
            {toE164(phone, region)} · where your payouts arrive
          </span>
        ) : (
          <span className="mt-1.5 block text-[10.5px] text-slate-soft">
            A leading zero is fine — it is stripped automatically.
          </span>
        )}
      </label>

      {biometricAvailable ? (
        <Notice tone="neutral" title="Your vault opens with your fingerprint" icon={<Fingerprint size={12} />}>
          No seed phrase, no extension, and gas on cc3-testnet is covered for you. Tèmi will tell
          you afterwards exactly which protection your device supported.
        </Notice>
      ) : (
        <Notice tone="ochre" title="No biometric sensor detected" icon={<TriangleAlert size={12} />}>
          Your vault will still open, but the key sits on this device behind a passkey check
          rather than encrypted by your fingerprint. Prefer a phone for real use.
        </Notice>
      )}

      {error ? <Notice tone="rust" title={error.title}>{error.detail}</Notice> : null}

      <button
        onClick={() =>
          onProvision({
            businessName: businessName.trim(),
            phoneE164: toE164(phone, region),
          })
        }
        disabled={!ready || busy}
        className={cn(
          'focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-3.5',
          'text-[13.5px] font-medium tracking-[-0.01em] text-paper transition-colors hover:bg-[#2b3140]',
          'disabled:cursor-not-allowed disabled:opacity-45',
        )}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Fingerprint size={15} strokeWidth={1.75} />}
        {busy ? 'Waiting for your fingerprint…' : 'Create my vault'}
        {!busy ? <ArrowRight size={14} strokeWidth={1.75} /> : null}
      </button>

      {waitedTooLong ? (
        <div className="border border-hairline border-l-2 border-l-ochre bg-[rgba(140,115,62,0.06)] px-3.5 py-3">
          <p className="text-[11.5px] font-medium text-ochre">No prompt yet?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-strong">
            Some desktop browsers cannot show a passkey prompt. If nothing appeared, your device
            may not support one — you can connect a Web3 wallet instead and use the same vault.
          </p>
          <button
            onClick={onUseWallet}
            className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded-[2px] border border-hairline-strong px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
          >
            Use a Web3 wallet instead
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** The three-stage rail across the top of the setup card. */
export function StageRail({ stage }: { stage: 0 | 1 | 2 }) {
  const stages = ['Identity', 'Reserve sizing', 'Funding'];
  return (
    <div className="mb-5 flex items-center gap-2">
      {stages.map((label, index) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div className="flex-1">
            <div
              className={cn(
                'mb-1.5 h-[2px] w-full',
                index < stage ? 'bg-moss' : index === stage ? 'bg-ink' : 'bg-hairline',
              )}
            />
            <span
              className={cn(
                'text-[9.5px] uppercase tracking-[0.08em]',
                index === stage ? 'text-ink' : index < stage ? 'text-moss' : 'text-slate-soft',
              )}
            >
              {index < stage ? '✓ ' : ''}
              {label}
            </span>
          </div>
        </div>
      ))}
      <Badge tone="neutral" className="shrink-0">
        Step {stage + 1} of 3
      </Badge>
    </div>
  );
}
