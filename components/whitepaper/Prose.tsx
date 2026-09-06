import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* Typographic primitives for long-form reading on the paper canvas. */

export function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-hairline pt-8">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="tabular text-[12px] font-semibold text-slate-soft">{index}</span>
        <h2 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.03em] text-ink sm:text-[26px]">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[70ch] text-[14px] leading-[1.72] text-slate-strong sm:text-[14.5px]">
      {children}
    </p>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-[15px] font-semibold tracking-[-0.02em] text-ink">{children}</h3>;
}

/** A displayed formula or code block. Scrolls independently so the page never does. */
export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="my-1">
      {label ? <figcaption className="eyebrow mb-1.5">{label}</figcaption> : null}
      <div className="overflow-x-auto rounded-[3px] border border-hairline bg-card">
        <pre className="tabular min-w-fit px-4 py-3 text-[11.5px] leading-[1.65] text-ink">
          {children}
        </pre>
      </div>
    </figure>
  );
}

/** A pulled-out claim. The paper's assertions, set apart from its explanation. */
export function Claim({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[62ch] border-l-2 border-l-ink py-1 pl-4 text-[15px] font-medium leading-[1.6] tracking-[-0.015em] text-ink">
      {children}
    </p>
  );
}

export function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto rounded-[3px] border border-hairline bg-card">
        <table className="w-full min-w-[440px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline">
              {head.map((cell) => (
                <th key={cell} className="eyebrow px-3.5 py-2.5 font-medium">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={cn(i > 0 && 'border-t border-hairline')}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      'px-3.5 py-2.5 align-top text-[12.5px] leading-relaxed',
                      j === 0 ? 'text-ink' : 'text-slate-strong',
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <figcaption className="mt-1.5 text-[11px] leading-snug text-slate-soft">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="tabular text-[0.94em] text-ink">{children}</span>;
}
