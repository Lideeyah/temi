'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRegion } from './RegionProvider';
import { Gavel, Loader2, ShieldQuestion, Timer } from 'lucide-react';
import type { Address, Hex, WalletClient } from 'viem';
import { creditcoinPublicClient, creditcoinTestnet } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import { formatTctc, shortAssetId } from '@/lib/format';
import type { PendingClaim } from '@/hooks/useVault';
import { Badge, Button, MetricRow, Notice } from './ui/Primitives';

function countdown(until: bigint, now: number): string {
  const remaining = Number(until) - now;
  if (remaining <= 0) return 'ready';
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/**
 * Escrowed claims awaiting release.
 *
 * Only the mutual buffer's share of a large claim ever lands here — the merchant's own Tier 1
 * was paid the moment they filed. This is the part the protocol holds open so anyone can object
 * to it, and the merchant can see exactly how long that lasts.
 */
export function PendingClaimsCard({
  claims,
  walletClient,
  account,
  onChanged,
}: {
  claims: PendingClaim[];
  walletClient: WalletClient | null;
  account: Address | null;
  onChanged: () => void;
}) {
  const { money } = useRegion();
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [busyId, setBusyId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Hex | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 30_000);
    return () => clearInterval(timer);
  }, []);

  const finalise = useCallback(
    async (claimId: bigint) => {
      if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
      setBusyId(claimId);
      setError(null);
      try {
        const hash = await walletClient.writeContract({
          address: TEMI_VAULT_ADDRESS,
          abi: temiVaultAbi,
          functionName: 'finaliseClaim',
          args: [claimId],
          account: walletClient.account ?? account,
          chain: creditcoinTestnet,
        });
        await creditcoinPublicClient.waitForTransactionReceipt({ hash });
        setDone(hash);
        onChanged();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message.split('\n')[0] : 'Release failed');
      } finally {
        setBusyId(null);
      }
    },
    [walletClient, account, onChanged],
  );

  if (claims.length === 0) return null;

  return (
    <div className="border-t border-hairline pt-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="eyebrow text-ochre">Awaiting release</p>
        <Badge tone="ochre" className="px-1.5 py-[2px]">
          {claims.length} open
        </Badge>
      </div>

      <p className="mb-2 text-[10.5px] leading-snug text-slate-soft">
        Your own Tier 1 was paid when you filed. Only the mutual buffer&apos;s share waits, so
        anyone can object to it first.
      </p>

      {claims.map((claim) => {
        const ready = Number(claim.challengeableUntil) <= now;
        const challenged = claim.status === 2;
        return (
          <div key={claim.claimId.toString()} className="mb-2 border border-hairline bg-paper-raised px-2.5 py-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="tabular text-[10.5px] text-slate-strong">
                #{claim.claimId.toString()} · {shortAssetId(claim.assetId)}
              </span>
              {challenged ? (
                <Badge tone="rust" className="px-1.5 py-[2px]">
                  <Gavel size={8} strokeWidth={2} />
                  Challenged
                </Badge>
              ) : (
                <Badge tone={ready ? 'moss' : 'ochre'} className="px-1.5 py-[2px]">
                  <Timer size={8} strokeWidth={2} />
                  {countdown(claim.challengeableUntil, now)}
                </Badge>
              )}
            </div>

            <MetricRow label="Escrowed" value={money(claim.escrowedTier2)} tone="ochre" />
            <MetricRow label="Your bond" value={money(claim.bond)} />

            {challenged ? (
              <p className="mt-1.5 text-[10px] leading-snug text-rust">
                Someone has staked against this claim. An arbiter decides; if they find for you,
                you receive the escrow, your bond and their stake.
              </p>
            ) : (
              <Button
                variant="outline"
                block
                className="mt-1.5 px-2 py-1 text-[10.5px]"
                disabled={!ready || busyId === claim.claimId || !walletClient}
                onClick={() => void finalise(claim.claimId)}
              >
                {busyId === claim.claimId ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <ShieldQuestion size={10} strokeWidth={1.75} />
                )}
                {ready ? 'Release escrow' : 'Window still open'}
              </Button>
            )}
          </div>
        );
      })}

      {error ? <Notice tone="rust" title={error} /> : null}
      {done ? <Notice tone="moss" title="Escrow released to your wallet" /> : null}
    </div>
  );
}
