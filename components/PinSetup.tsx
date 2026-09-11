'use client';

import { useState } from 'react';
import { ArrowRight, Fingerprint, KeyRound, Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { MAX_PIN_ATTEMPTS } from '@/lib/MerchantIdentity';
import { cn } from '@/lib/utils';
import { PinField } from './PinPad';
import { Notice } from './ui/Primitives';

/**
 * Phase 2 — set the PIN that becomes the other half of the key.
 *
 * Deliberately not a biometric requirement. A trader on a cheap Android has no fingerprint
 * sensor, and a product that assumes one has quietly excluded most of its market. The PIN works
 * on any handset; the biometric is offered on top, as a faster unlock rather than a different
 * key.
 */
export function PinSetup({
  businessName,
  onBusinessNameChange,
  phoneE164,
  biometricAvailable,
  busy,
  error,
  onConfirm,
  mode = 'create',
}: {
  businessName: string;
  onBusinessNameChange: (name: string) => void;
  phoneE164: string;
  biometricAvailable: boolean;
  busy: boolean;
  error: { title: string; detail?: string } | null;
  onConfirm: (params: { pin: string; biometricEnabled: boolean }) => void;
  /**
   * Signing in is not setting up.
   *
   * A merchant returning on a new handset already has a PIN. Asking them to confirm it means
   * asking them to type a secret twice to prove they remember it, which proves nothing — the
   * chain lookup does that. Asking for a business name is worse: they already named their shop,
   * and whatever they type here would be a second answer to a question already settled.
   */
  mode?: 'create' | 'signin';
}) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [biometric, setBiometric] = useState(false);
  const [stage, setStage] = useState<'set' | 'confirm'>('set');

  const isWeak = (value: string) => /^(\d)\1{3}$/.test(value);

  const signingIn = mode === 'signin';
  const mismatch = !signingIn && confirm.length === 4 && confirm !== pin;
  // A weak PIN is refused when choosing one. Refusing it at sign-in would lock out a merchant
  // whose vault already uses it — the time to object has passed.
  const weak = !signingIn && pin.length === 4 && isWeak(pin);
  const ready = signingIn
    ? pin.length === 4
    : pin.length === 4 && confirm === pin && businessName.trim().length >= 2 && !weak;

  /**
   * Why the button is off.
   *
   * A disabled primary action with no stated reason is a dead end — the merchant has no way to
   * discover what is missing. Deriving the reason from the same conditions that disable it means
   * a new rule can never silently strand someone.
   */
  const blockReason = signingIn
    ? pin.length !== 4
      ? 'Enter your 4-digit PIN.'
      : null
    : businessName.trim().length < 2
      ? 'Enter your trading entity name above.'
      : pin.length !== 4
        ? 'Choose a 4-digit PIN.'
        : weak
          ? 'Four identical digits is the first thing anyone tries. Tap “start over” and pick something else.'
          : confirm.length !== 4
            ? 'Re-enter your PIN to confirm it.'
            : confirm !== pin
              ? 'The two PINs do not match.'
              : null;

  return (
    <div className="space-y-5">
      <div className="border border-hairline bg-paper-raised px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-moss" strokeWidth={2} />
          <span className="tabular text-[11.5px] text-moss">{phoneE164} verified</span>
        </div>
      </div>

      {signingIn ? null : (
      <label className="block">
        <span className="eyebrow mb-1.5 block">Trading entity name</span>
        <input
          value={businessName}
          onChange={(event) => onBusinessNameChange(event.target.value)}
          placeholder="e.g. Adeola Electronics"
          className="focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised px-3 py-2.5 text-[13px] text-ink placeholder:text-slate-soft"
        />
      </label>
      )}

      {signingIn || stage === 'set' ? (
        <>
          <PinField
            label={signingIn ? 'Your 4-digit PIN' : 'Set 4-digit merchant security PIN'}
            value={pin}
            onChange={setPin}
            onComplete={(value) => {
              // Advancing a PIN we are going to reject later strands the merchant on a screen
              // that cannot explain itself.
              if (!signingIn && !isWeak(value)) setStage('confirm');
            }}
            invalid={weak}
            autoFocus
          />
          {weak ? (
            <p className="text-[11px] text-rust">
              Four identical digits is the first thing anyone tries. Choose something else.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Confirm your PIN</span>
            <button
              onClick={() => {
                setStage('set');
                setPin('');
                setConfirm('');
              }}
              className="focus-ring inline-flex items-center gap-1 text-[10.5px] text-slate-strong underline underline-offset-2"
            >
              <RotateCcw size={9} strokeWidth={2} />
              start over
            </button>
          </div>
          <PinField
            label=""
            value={confirm}
            onChange={setConfirm}
            invalid={mismatch}
            autoFocus
          />
          {mismatch ? <p className="text-[11px] text-rust">Those do not match.</p> : null}
        </>
      )}

      <Notice tone="neutral" title="What your PIN does" icon={<KeyRound size={12} />}>
        It signs registrations and emergency payouts, and works on any phone — no fingerprint or
        face unlock needed. Your number and PIN together restore this exact vault on a new handset,
        so there is nothing to write down. After {MAX_PIN_ATTEMPTS} wrong attempts this device
        clears itself; your money stays safe and you restore it by verifying your number again.
      </Notice>

      {biometricAvailable ? (
        <button
          onClick={() => setBiometric((v) => !v)}
          className={cn(
            'focus-ring flex w-full items-start gap-2.5 rounded-[3px] border px-3 py-2.5 text-left transition-colors',
            biometric ? 'border-ink bg-[rgba(31,36,47,0.04)]' : 'border-hairline hover:bg-[rgba(31,36,47,0.02)]',
          )}
        >
          <span
            className={cn(
              'mt-[1px] flex size-[15px] shrink-0 items-center justify-center rounded-[2px] border',
              biometric ? 'border-ink bg-ink' : 'border-hairline-strong',
            )}
          >
            {biometric ? <span className="block size-[6px] rounded-[1px] bg-paper" /> : null}
          </span>
          <span>
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink">
              <Fingerprint size={12} strokeWidth={1.75} />
              Enable one-touch unlock on this device
            </span>
            <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-soft">
              Optional. Skips the PIN on this handset only — the PIN still works everywhere, and
              remains what actually derives your vault.
            </span>
          </span>
        </button>
      ) : null}

      {error ? <Notice tone="rust" title={error.title}>{error.detail}</Notice> : null}

      <button
        onClick={() => onConfirm({ pin, biometricEnabled: biometric })}
        disabled={!ready || busy}
        className={cn(
          'focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 py-3.5',
          'text-[13.5px] font-medium text-paper transition-colors hover:bg-[#2b3140]',
          'disabled:cursor-not-allowed disabled:opacity-45',
        )}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : null}
        {busy
          ? signingIn
            ? 'Opening your vault…'
            : 'Creating your vault…'
          : signingIn
            ? 'Open my vault'
            : 'Create my vault'}
        {!busy ? <ArrowRight size={14} strokeWidth={1.75} /> : null}
      </button>

      {blockReason && !busy ? (
        <p className="-mt-2 text-center text-[11px] leading-snug text-ochre">{blockReason}</p>
      ) : null}
    </div>
  );
}

/**
 * The signing prompt.
 *
 * Every transaction that moves money asks for the PIN, because the key is derived on demand and
 * never kept in memory longer than the transaction it signs.
 */
export function PinPrompt({
  open,
  action,
  busy,
  error,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  action: string;
  busy: boolean;
  error: string | null;
  onSubmit: (pin: string) => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(31,36,47,0.42)] p-0 sm:items-center sm:p-6">
      <div className="card w-full max-w-sm rounded-t-[10px] p-5 sm:rounded-[4px]">
        <p className="eyebrow mb-1">Confirm with your PIN</p>
        <h2 className="mb-4 text-[16px] font-semibold tracking-[-0.02em] text-ink">{action}</h2>

        <PinField
          label=""
          value={pin}
          onChange={setPin}
          onComplete={(v) => onSubmit(v)}
          invalid={Boolean(error)}
          autoFocus
        />

        {error ? <p className="mt-2.5 text-[11px] text-rust">{error}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setPin('');
              onCancel();
            }}
            className="focus-ring flex-1 rounded-[3px] border border-hairline-strong px-4 py-2.5 text-[13px] text-slate-strong transition-colors hover:bg-[rgba(31,36,47,0.04)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(pin)}
            disabled={pin.length !== 4 || busy}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-4 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-[#2b3140] disabled:opacity-45"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            {busy ? 'Signing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
