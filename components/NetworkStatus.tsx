'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { creditcoinTestnet, blockscoutAddress, ATTESTCOIN_CHAIN_KEYS } from '@/lib/chains';
import { ATTESTCOIN_VERIFIER_ADDRESS, TEMI_VAULT_ADDRESS } from '@/lib/config';
import { getAttestedHeight } from '@/lib/AttestcoinConduit';
import { truncateAddress } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Protocol state, folded into the chrome.
 *
 * All of this used to live in a permanent console pinned beside the app, which made Tèmi read as
 * a terminal someone had wrapped a UI around. None of it is something a merchant consults; all of
 * it is something a technical reviewer wants on demand. So it lives behind the network badge and
 * along the footer, where it costs nothing until it is asked for.
 */

export function NetworkPill({ blockNumber }: { blockNumber: bigint | null }) {
  const [open, setOpen] = useState(false);
  const [attested, setAttested] = useState<number | null>(null);
  const [proverUp, setProverUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = () =>
      void getAttestedHeight(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA)
        .then((h) => {
          if (cancelled) return;
          setAttested(h);
          setProverUp(true);
        })
        .catch(() => !cancelled && setProverUp(false));
    poll();
    const timer = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring inline-flex items-center gap-1.5 rounded-[2px] border border-hairline bg-[rgba(31,36,47,0.03)] px-2 py-[3px] text-[10px] uppercase tracking-[0.06em] text-slate-strong transition-colors hover:bg-[rgba(31,36,47,0.06)]"
      >
        <span
          className={cn(
            'inline-block size-[5px] rounded-[1px]',
            proverUp === false ? 'bg-rust' : 'bg-moss',
          )}
        />
        <span className="tabular">cc3-testnet: {creditcoinTestnet.id}</span>
        <ChevronDown size={9} strokeWidth={2} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <>
          <button className="fixed inset-0 z-40 cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="card absolute left-0 top-[calc(100%+6px)] z-50 w-[286px] p-3">
            <p className="eyebrow mb-2">Attestcoin readability</p>

            <Row label="Verify precompile" value={truncateAddress(ATTESTCOIN_VERIFIER_ADDRESS, 8, 6)} tone="steel" />
            <Row label="Source chain" value="Ethereum Sepolia" tone="steel" />
            <Row label="Chain key" value={String(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA)} tone="steel" />
            <Row
              label="Attested height"
              value={attested ? attested.toLocaleString() : proverUp === false ? 'prover down' : '—'}
              tone={proverUp === false ? 'rust' : 'steel'}
            />
            <Row label="Read cost" value="0 ATC" tone="moss" />

            <div className="my-2 h-px bg-hairline" />

            <p className="eyebrow mb-2">Settlement chain</p>
            <Row label="Block height" value={blockNumber ? blockNumber.toString() : '—'} />
            <Row label="Spatial resolution" value="Uber H3 · res 10" />

            <div className="mt-2.5 flex flex-col gap-1.5 border-t border-hairline pt-2.5">
              <a
                href={blockscoutAddress(ATTESTCOIN_VERIFIER_ADDRESS)}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1 text-[10.5px] text-ink underline underline-offset-2"
              >
                Verify precompile on Blockscout <ExternalLink size={9} />
              </a>
              {TEMI_VAULT_ADDRESS ? (
                <a
                  href={blockscoutAddress(TEMI_VAULT_ADDRESS)}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-1 text-[10.5px] text-ink underline underline-offset-2"
                >
                  TemiVault on Blockscout <ExternalLink size={9} />
                </a>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'steel' | 'moss' | 'rust';
}) {
  const colour = tone
    ? { steel: 'text-steel', moss: 'text-moss', rust: 'text-rust' }[tone]
    : 'text-ink';
  return (
    <div className="flex items-baseline justify-between gap-3 py-[3px]">
      <span className="shrink-0 text-[10.5px] text-slate-soft">{label}</span>
      <span className={cn('tabular truncate text-[10.5px]', colour)}>{value}</span>
    </div>
  );
}

/**
 * A single hairline at the foot of the page.
 *
 * Everything a reviewer needs to identify what they are looking at, in one line, permanently —
 * without a column of it competing with the product for attention.
 */
export function StatusBar() {
  return (
    <footer className="mt-auto border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 sm:px-8">
        {[
          `Creditcoin cc3-testnet (${creditcoinTestnet.id})`,
          'Attestcoin readability 0x0FD2 verified',
          'Uber H3 res 10',
          'Dual-reserve v1.2',
        ].map((item, index) => (
          <span key={item} className="flex items-center gap-3">
            {index > 0 ? <span className="text-slate-soft/50" aria-hidden>·</span> : null}
            <span className="tabular text-[9.5px] uppercase tracking-[0.07em] text-slate-soft">
              {item}
            </span>
          </span>
        ))}
      </div>
    </footer>
  );
}
