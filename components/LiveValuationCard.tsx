'use client';

import { useCallback, useState } from 'react';
import { ArrowUpRight, Loader2, RefreshCw, TrendingUp } from 'lucide-react';
import type { Address, Hex, WalletClient } from 'viem';
import { creditcoinPublicClient, creditcoinTestnet, etherscanTx } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import {
  OracleError,
  buildPriceProof,
  findProvableRound,
  formatAge,
  formatUsdWad,
  resolveAggregator,
  type PriceRound,
} from '@/lib/ChainlinkOracle';
import type { OracleState } from '@/hooks/useVault';
import { Badge, Button, MetricRow, Notice } from './ui/Primitives';

/**
 * Live valuation, read out of Ethereum through the Attestcoin precompile.
 *
 * The refresh is permissionless on purpose: anyone can push a newer round, nobody can push an
 * older one, and the contract will not price a deposit at all if the last observation has gone
 * stale. There is no privileged price setter to compromise.
 */
export function LiveValuationCard({
  oracle,
  walletClient,
  account,
  onRefreshed,
}: {
  oracle: OracleState | null;
  walletClient: WalletClient | null;
  account: Address | null;
  onRefreshed: () => void;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null);
  const [round, setRound] = useState<PriceRound | null>(null);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
    setBusy(true);
    setError(null);
    setTxHash(null);

    try {
      setStatus('Resolving the Chainlink aggregator on Sepolia…');
      const { aggregator } = await resolveAggregator();

      setStatus('Finding a round the attestor quorum has already covered…');
      const provable = await findProvableRound({ aggregator });
      setRound(provable);

      setStatus(`Building an inclusion proof for round ${provable.roundId}…`);
      const { proof } = await buildPriceProof(provable);

      setStatus('Submitting the proof to the vault…');
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'submitPriceProof',
        args: [proof],
        account,
        chain: creditcoinTestnet,
      });

      const receipt = await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== 'success') {
        setError({ title: 'Price proof reverted on-chain', detail: hash });
        return;
      }

      setTxHash(hash);
      setStatus(null);
      onRefreshed();
    } catch (cause) {
      const oracleError = cause as OracleError;
      setError({
        title: cause instanceof Error ? cause.message.split('\n')[0] : 'Price refresh failed',
        detail: oracleError.detail,
      });
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }, [walletClient, account, onRefreshed]);

  const hasPrice = oracle !== null && oracle.updatedAt > 0n;
  const ageSeconds = hasPrice ? Math.floor(Date.now() / 1000) - Number(oracle.updatedAt) : 0;

  return (
    <div className="border-t border-hairline pt-2.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="eyebrow text-steel">Live valuation · via 0x0FD2</p>
        {hasPrice ? (
          <Badge tone={oracle.fresh ? 'moss' : 'rust'} className="px-1.5 py-[2px]">
            {oracle.fresh ? 'Fresh' : 'Stale'}
          </Badge>
        ) : null}
      </div>

      {hasPrice ? (
        <>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="text-[11px] text-slate-soft">ETH / USD</span>
            <span className="tabular text-[15px] font-semibold tracking-[-0.02em] text-ink">
              ${formatUsdWad(oracle.answerWad, 2)}
            </span>
          </div>
          <MetricRow label="Chainlink round" value={oracle.roundId.toString()} tone="steel" />
          <MetricRow label="Feed wrote" value={formatAge(ageSeconds)} tone={oracle.fresh ? 'moss' : 'rust'} />
          <MetricRow label="Proven from block" value={oracle.sourceHeight.toString()} tone="steel" />
          <MetricRow
            label="tCTC / USD"
            value={oracle.ctcUsdWad > 0n ? `$${formatUsdWad(oracle.ctcUsdWad, 4)}` : 'unset'}
            tone={oracle.ctcUsdWad > 0n ? undefined : 'rust'}
            title="Governance-set: no attested CTC/USD feed exists yet"
          />
          <p className="mt-1 text-[9.5px] leading-snug text-slate-soft">
            ETH/USD is proven from Ethereum. tCTC/USD is a governance parameter until an attested
            CTC feed exists.
          </p>
        </>
      ) : (
        <p className="py-1.5 text-[11px] leading-snug text-slate-soft">
          No price proven yet. Cross-chain deposits stay closed until one is — the vault will not
          guess a rate.
        </p>
      )}

      {round && !txHash ? (
        <p className="tabular mt-1.5 text-[9.5px] text-slate-soft">
          found round {round.roundId.toString()} · ${round.price} · {formatAge(round.ageSeconds)}
        </p>
      ) : null}

      {status ? (
        <div className="mt-2">
          <Notice tone="steel" title={status} icon={<Loader2 size={11} className="animate-spin" />} />
        </div>
      ) : null}
      {error ? (
        <div className="mt-2">
          <Notice tone="rust" title={error.title}>{error.detail}</Notice>
        </div>
      ) : null}
      {txHash && round ? (
        <div className="mt-2">
          <Notice tone="moss" title={`Round ${round.roundId} adopted`} icon={<TrendingUp size={11} />}>
            <a
              href={etherscanTx(round.txHash)}
              target="_blank"
              rel="noreferrer"
              className="tabular inline-flex items-center gap-1 underline underline-offset-2"
            >
              source on Sepolia <ArrowUpRight size={9} />
            </a>
          </Notice>
        </div>
      ) : null}

      <Button
        variant="outline"
        block
        className="mt-2 px-2 py-1.5 text-[11px]"
        onClick={() => void refresh()}
        disabled={busy || !walletClient}
      >
        {busy ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} strokeWidth={1.75} />}
        {busy ? 'Proving…' : 'Refresh price from Ethereum'}
      </Button>
    </div>
  );
}
