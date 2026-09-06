'use client';

import { useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A four-digit entry that behaves the way a merchant expects.
 *
 * Not a text input with a numeric keyboard: an explicit set of filled dots, so it is obvious how
 * many digits remain and unmistakable that this is a PIN rather than a password. Physical keys
 * still work, because reviewers use laptops.
 */
export function PinEntry({
  value,
  onChange,
  onComplete,
  label,
  autoFocus,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (value: string) => void;
  label: string;
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const set = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, 4);
    onChange(digits);
    if (digits.length === 4) onComplete?.(digits);
  };

  return (
    <div>
      <span className="eyebrow mb-1.5 block">{label}</span>
      <div
        className="relative"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {/* The real input, invisible but focusable — so hardware keyboards and password
            managers behave normally while the dots do the presenting. */}
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => set(event.target.value)}
          inputMode="numeric"
          autoComplete="off"
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none flex gap-2">
          {[0, 1, 2, 3].map((index) => {
            const filled = index < value.length;
            return (
              <span
                key={index}
                className={cn(
                  'flex h-12 flex-1 items-center justify-center rounded-[3px] border bg-paper-raised transition-colors',
                  invalid
                    ? 'border-rust'
                    : filled
                      ? 'border-ink'
                      : 'border-hairline-strong',
                )}
              >
                <span
                  className={cn(
                    'block size-[9px] rounded-full transition-colors',
                    filled ? (invalid ? 'bg-rust' : 'bg-ink') : 'bg-transparent',
                  )}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** An on-screen keypad, for a merchant on a phone who wants to tap rather than type. */
export function Keypad({
  onDigit,
  onBackspace,
  disabled,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {keys.map((key, index) =>
        key === '' ? (
          <span key={index} />
        ) : (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => (key === 'del' ? onBackspace() : onDigit(key))}
            className={cn(
              'focus-ring flex h-11 items-center justify-center rounded-[3px] border border-hairline-strong',
              'tabular text-[16px] text-ink transition-colors hover:bg-[rgba(31,36,47,0.05)]',
              'disabled:opacity-40',
            )}
          >
            {key === 'del' ? <Delete size={15} strokeWidth={1.75} /> : key}
          </button>
        ),
      )}
    </div>
  );
}

/** Convenience wrapper: entry plus keypad, sharing one value. */
export function PinField({
  label,
  value,
  onChange,
  onComplete,
  invalid,
  autoFocus,
  showKeypad = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
  showKeypad?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  return (
    <div className="space-y-2.5">
      <PinEntry
        label={label}
        value={value}
        onChange={(v) => {
          setTouched(true);
          onChange(v);
        }}
        onComplete={onComplete}
        invalid={invalid && touched}
        autoFocus={autoFocus}
      />
      {showKeypad ? (
        <Keypad
          onDigit={(d) => {
            if (value.length < 4) {
              const next = value + d;
              onChange(next);
              if (next.length === 4) onComplete?.(next);
            }
          }}
          onBackspace={() => onChange(value.slice(0, -1))}
        />
      ) : null}
    </div>
  );
}
