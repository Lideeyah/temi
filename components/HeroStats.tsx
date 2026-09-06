'use client';

import type { VaultState } from '@/hooks/useVault';

/**
 * The three figures worth stating outright, on one hairline-divided row.
 *
 * A merchant wants to know what is theirs, what the community holds, and how much the whole
 * thing is carrying. Everything else is detail that belongs inside the flow it relates to.
 */
export function HeroStats({
  vault,
  money,
}: {
  vault: VaultState;
  money: (wei: bigint) => string;
}) {
  const totalActive =
    (vault.telemetry?.tier1Total ?? 0n) + (vault.telemetry?.tier2Pool ?? 0n);

  const stats = [
    { label: 'Your Tier 1', value: money(vault.tier1PersonalBalance), tone: 'ink' as const },
    { label: 'Mutual buffer', value: money(vault.telemetry?.tier2Pool ?? 0n), tone: 'moss' as const },
    { label: 'Total active reserves', value: money(totalActive), tone: 'slate' as const },
  ];

  return (
    <div className="mb-4 grid grid-cols-3 divide-x divide-hairline border-y border-hairline">
      {stats.map((stat) => (
        <div key={stat.label} className="px-3 py-3 first:pl-0 sm:px-4">
          <p className="eyebrow mb-1.5">{stat.label}</p>
          <p
            className={`tabular text-[15px] font-semibold leading-none tracking-[-0.02em] sm:text-[17px] ${
              stat.tone === 'moss' ? 'text-moss' : stat.tone === 'slate' ? 'text-slate-strong' : 'text-ink'
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
