'use client';

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*                              BUTTON                                 */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'alert';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-ink text-paper border-ink hover:bg-[#2b3140] disabled:bg-slate-soft',
  outline: 'bg-transparent text-ink border-hairline-strong hover:bg-[rgba(31,36,47,0.04)]',
  ghost: 'bg-transparent text-slate-strong border-transparent hover:bg-[rgba(31,36,47,0.05)]',
  alert: 'bg-rust text-white border-rust hover:bg-[#7a4040]',
};

export function Button({ variant = 'solid', block, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] border px-4 py-2.5',
        'text-[13px] font-medium tracking-[-0.01em] transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-45',
        BUTTON_VARIANTS[variant],
        block && 'w-full',
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*                               BADGE                                 */
/* ------------------------------------------------------------------ */

type BadgeTone = 'neutral' | 'moss' | 'ochre' | 'rust' | 'steel';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'text-slate-strong border-hairline bg-[rgba(31,36,47,0.03)]',
  moss: 'text-moss border-[rgba(74,107,93,0.28)] bg-[rgba(74,107,93,0.07)]',
  ochre: 'text-ochre border-[rgba(140,115,62,0.28)] bg-[rgba(140,115,62,0.07)]',
  rust: 'text-rust border-[rgba(140,74,74,0.28)] bg-[rgba(140,74,74,0.07)]',
  steel: 'text-steel border-[rgba(74,98,122,0.28)] bg-[rgba(74,98,122,0.07)]',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  mono = true,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-[2px] border px-2 py-[3px]',
        'text-[10px] leading-none tracking-[0.06em] uppercase',
        mono && 'tabular',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A small filled square — the status glyph used down the left of dense rows. */
export function StatusDot({ tone = 'moss' }: { tone?: BadgeTone }) {
  const fill: Record<BadgeTone, string> = {
    neutral: 'bg-slate-soft',
    moss: 'bg-moss',
    ochre: 'bg-ochre',
    rust: 'bg-rust',
    steel: 'bg-steel',
  };
  return <span className={cn('inline-block size-[6px] shrink-0 rounded-[1px]', fill[tone])} />;
}

/* ------------------------------------------------------------------ */
/*                               MODAL                                 */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  width = 'max-w-lg',
  dismissable = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  width?: string;
  dismissable?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissable) onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, dismissable]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[rgba(31,36,47,0.42)] p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (dismissable && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'card w-full outline-none sm:rounded-[4px]',
          'max-h-[94dvh] overflow-y-auto rounded-t-[10px] sm:max-h-[92dvh]',
          width,
        )}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-hairline bg-card px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
            <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
          </div>
          {dismissable ? (
            <button
              onClick={onClose}
              aria-label="Close"
              className="focus-ring -mr-1 -mt-1 shrink-0 rounded-[3px] p-1.5 text-slate-soft transition-colors hover:bg-[rgba(31,36,47,0.05)] hover:text-ink"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          ) : null}
        </header>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                                TABS                                 */
/* ------------------------------------------------------------------ */

export interface TabDefinition {
  id: string;
  label: string;
  hint?: string;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDefinition[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-hairline">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'focus-ring relative flex-1 px-3 pb-2.5 pt-1 text-left transition-colors',
              selected ? 'text-ink' : 'text-slate-soft hover:text-slate-strong',
            )}
          >
            <span className="block text-[12px] font-medium tracking-[-0.01em]">{tab.label}</span>
            {tab.hint ? (
              <span className="mt-0.5 block text-[10px] leading-tight text-slate-soft">{tab.hint}</span>
            ) : null}
            {selected ? (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" aria-hidden />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                          FIELDS & NOTICES                           */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  children,
  suffix,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {suffix}
      </div>
      {children}
      {hint ? <p className="mt-1.5 text-[11px] leading-snug text-slate-soft">{hint}</p> : null}
    </label>
  );
}

export function TextInput({
  mono = true,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        'focus-ring w-full rounded-[3px] border border-hairline-strong bg-paper-raised px-3 py-2.5',
        'text-[13px] text-ink placeholder:text-slate-soft',
        mono && 'tabular',
        className,
      )}
    />
  );
}

type NoticeTone = 'rust' | 'moss' | 'ochre' | 'steel' | 'neutral';

const NOTICE_TONES: Record<NoticeTone, string> = {
  rust: 'border-l-rust bg-[rgba(140,74,74,0.06)] text-rust',
  moss: 'border-l-moss bg-[rgba(74,107,93,0.06)] text-moss',
  ochre: 'border-l-ochre bg-[rgba(140,115,62,0.06)] text-ochre',
  steel: 'border-l-steel bg-[rgba(74,98,122,0.06)] text-steel',
  neutral: 'border-l-slate-soft bg-[rgba(31,36,47,0.04)] text-slate-strong',
};

export function Notice({
  tone = 'neutral',
  title,
  children,
  icon,
}: {
  tone?: NoticeTone;
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className={cn('border border-hairline border-l-2 px-3 py-2.5', NOTICE_TONES[tone])}>
      <div className="flex items-start gap-2">
        {icon ? <span className="mt-[1px] shrink-0">{icon}</span> : null}
        <div className="min-w-0">
          <p className="tabular text-[11px] font-medium leading-snug tracking-[0.01em]">{title}</p>
          {children ? (
            <div className="mt-1 text-[11px] leading-relaxed text-slate-strong">{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** A label/value row, the atom the whole dense ledger layout is built from. */
export function MetricRow({
  label,
  value,
  tone,
  title,
}: {
  label: string;
  value: ReactNode;
  tone?: 'moss' | 'rust' | 'ochre' | 'steel';
  title?: string;
}) {
  const toneClass = tone
    ? { moss: 'text-moss', rust: 'text-rust', ochre: 'text-ochre', steel: 'text-steel' }[tone]
    : 'text-ink';
  return (
    <div className="flex items-baseline justify-between gap-3 py-[5px]">
      <span className="shrink-0 text-[11px] text-slate-soft">{label}</span>
      <span
        title={title}
        className={cn('tabular truncate text-[11px] font-medium tracking-[-0.01em]', toneClass)}
      >
        {value}
      </span>
    </div>
  );
}
