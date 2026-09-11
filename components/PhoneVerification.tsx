'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import {
  REGION_LIST,
  isValidNationalNumber,
  normaliseNationalNumber,
  toE164,
  type Region,
} from '@/lib/regions';
import { IdentityError, requestOtp, verifyOtp } from '@/lib/MerchantIdentity';
import { cn } from '@/lib/utils';
import { Notice } from './ui/Primitives';

type Phase = 'number' | 'code';

/**
 * Phase 1 — prove the number is yours.
 *
 * The number is not a login. It is half of the key: verifying it is what releases the server's
 * share, and it is what lets a merchant who drops their phone recover the same vault from a new
 * one. Which is also why it cannot simply be typed and trusted.
 */
export function PhoneVerification({
  region,
  onRegionChange,
  onVerified,
}: {
  region: Region;
  onRegionChange: (id: Region['id']) => void;
  /** Hands back the verified number and the server's half of the key. */
  onVerified: (result: { phoneE164: string; keyShare: string }) => void;
}) {
  const [phase, setPhase] = useState<Phase>('number');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const digitsEntered = normaliseNationalNumber(phone).length;
  const phoneOk = phone.trim() === '' ? null : isValidNationalNumber(phone, region);
  const e164 = phoneOk ? toE164(phone, region) : '';

  const send = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await requestOtp(toE164(phone, region));
      setDemoCode(result.demoCode ?? null);
      setPhase('code');
      setCooldown(20);
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (cause) {
      const identityError = cause as IdentityError;
      setError({ title: identityError.message, detail: identityError.detail });
    } finally {
      setBusy(false);
    }
  };

  const verify = async (submitted: string) => {
    setBusy(true);
    setError(null);
    try {
      const keyShare = await verifyOtp(e164 || toE164(phone, region), submitted);
      onVerified({ phoneE164: toE164(phone, region), keyShare });
    } catch (cause) {
      const identityError = cause as IdentityError;
      setError({ title: identityError.message, detail: identityError.detail });
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  if (phase === 'number') {
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
                      <span className="text-[15px] leading-none" aria-hidden>{option.flag}</span>
                      <span className="text-[12.5px] font-medium text-ink">{option.name}</span>
                    </span>
                    {selected ? <Check size={12} className="text-moss" strokeWidth={2.5} /> : null}
                  </span>
                  <span className="tabular block text-[10px] text-slate-soft">
                    {option.currencySymbol} {option.currencyCode} · {option.dialingCode}
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
          <span className="eyebrow mb-1.5 block">Your mobile number</span>
          <div className="flex overflow-hidden rounded-[3px] border border-hairline-strong bg-paper-raised">
            <span className="tabular flex shrink-0 items-center gap-1.5 border-r border-hairline px-3 py-2.5 text-[13px] text-slate-strong">
              <span aria-hidden>{region.flag}</span>
              {region.dialingCode}
            </span>
            <input
              value={phone}
              // Digits only, and never more than the plan allows. One extra character is permitted
              // so a merchant who types the trunk zero out of habit is not cut off a digit short.
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, '').slice(0, region.nationalDigits + 1))
              }
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={region.nationalDigits + 1}
              placeholder={'0'.repeat(region.nationalDigits)}
              autoFocus
              className="tabular focus-ring w-full bg-transparent px-3 py-2.5 text-[13px] text-ink placeholder:text-slate-soft"
            />
          </div>
          {phoneOk === true ? (
            <span className="tabular mt-1.5 block text-[10.5px] text-moss">{e164}</span>
          ) : phoneOk === false ? (
            // Say how far along they are rather than only that it is wrong, so the inactive
            // button has a visible reason instead of looking broken.
            <span className="tabular mt-1.5 block text-[10.5px] text-rust">
              {digitsEntered} of {region.nationalDigits} digits · {region.name} numbers are exactly{' '}
              {region.nationalDigits} after {region.dialingCode}
            </span>
          ) : (
            <span className="mt-1.5 block text-[10.5px] text-slate-soft">
              {region.nationalDigits} digits after {region.dialingCode} — a leading zero is fine,
              it is stripped automatically.
            </span>
          )}
        </label>

        <Notice tone="neutral" title="Why we verify your number" icon={<ShieldCheck size={12} />}>
          Your number is half of your vault key. Verifying it is what lets you restore the same
          vault on a new phone — and stops anyone else claiming it.
        </Notice>

        {error ? <Notice tone="rust" title={error.title}>{error.detail}</Notice> : null}

        <button
          onClick={() => void send()}
          disabled={!phoneOk || busy}
          className={cn(
            'focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-3.5',
            'text-[13.5px] font-medium text-paper transition-colors hover:bg-[#2b3140]',
            'disabled:cursor-not-allowed disabled:opacity-45',
          )}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <MessageSquare size={15} strokeWidth={1.75} />}
          {busy ? 'Sending…' : 'Send verification code'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow mb-1.5">Enter the 6-digit code</p>
        <p className="tabular text-[12px] text-slate-strong">
          Sent to {toE164(phone, region)}{' '}
          <button
            onClick={() => {
              setPhase('number');
              setCode('');
              setError(null);
            }}
            className="focus-ring ml-1 text-[11px] text-ink underline underline-offset-2"
          >
            change
          </button>
        </p>
      </div>

      <input
        ref={codeRef}
        value={code}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').slice(0, 6);
          setCode(digits);
          if (digits.length === 6) void verify(digits);
        }}
        inputMode="numeric"
        placeholder="••••••"
        aria-label="Verification code"
        className="tabular focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised px-3 py-3 text-center text-[22px] font-semibold tracking-[0.35em] text-ink placeholder:tracking-[0.35em] placeholder:text-slate-soft"
      />

      {demoCode ? (
        <div className="border border-hairline border-l-2 border-l-ochre bg-[rgba(140,115,62,0.06)] px-3.5 py-2.5">
          <p className="text-[11px] font-medium text-ochre">Testing mode</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-strong">
            No SMS is sent. The simulated code is{' '}
            <button
              onClick={() => {
                setCode(demoCode);
                void verify(demoCode);
              }}
              className="tabular focus-ring font-semibold text-ink underline underline-offset-2"
            >
              {demoCode}
            </button>{' '}
            — click it to fill. This exists so reviewers can verify ownership without SMS credit
            across four jurisdictions.
          </p>
        </div>
      ) : null}

      {error ? <Notice tone="rust" title={error.title}>{error.detail}</Notice> : null}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => void send()}
          disabled={cooldown > 0 || busy}
          className="focus-ring text-[11.5px] text-ink underline underline-offset-2 disabled:opacity-40 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>

        <button
          onClick={() => void verify(code)}
          disabled={code.length !== 6 || busy}
          className={cn(
            'focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-2.5',
            'text-[13px] font-medium text-paper transition-colors hover:bg-[#2b3140]',
            'disabled:cursor-not-allowed disabled:opacity-45',
          )}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          {busy ? 'Verifying…' : 'Verify'}
          {!busy ? <ArrowRight size={14} strokeWidth={1.75} /> : null}
        </button>
      </div>
    </div>
  );
}
