'use client';

import { useCallback, useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import type { Address, WalletClient } from 'viem';
import { creditcoinPublicClient, creditcoinTestnet } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS, NGN_PER_TCTC } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import { buildPriceProof, findProvableRound, formatAge, formatUsdWad } from '@/lib/ChainlinkOracle';
import type { OracleState } from '@/hooks/useVault';
import { cn } from '@/lib/utils';

/**
 * The proven exchange rate, stated where a merchant actually reads a rate.
 *
 * This used to be a panel in the sidebar. It belongs on the line that converts their Naira into
 * tCTC, because that is the only place the number changes anything they can see. The refresh is
 * permissionless — anyone can push a newer Chainlink round, nobody can push an older one — so it
 * sits here as a small control rather than an administrative action.
 */
export function LiveRateLine({
  oracle,
  walletClient,
  account,
  onRefreshed,
  className,
}: {
  oracle: OracleState | null;
  walletClient: WalletClient | null;
  account: Address | null;
  onRefreshed: () => void;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
    setBusy(true);
    setError(null);
    try {
      setStatus('finding an attested round…');
      const round = await findProvableRound();
      setStatus('building proof…');
      const { proof } = await buildPriceProof(round);
      setStatus('verifying via 0x0FD2…');
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'submitPriceProof',
        args: [proof],
        account,
        chain: creditcoinTestnet,
      });
      await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      setStatus(null);
      onRefreshed();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message.split('\n')[0] : 'Rate refresh failed');
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }, [walletClient, account, onRefreshed]);

  const hasPrice = oracle !== null && oracle.updatedAt > 0n;
  const ageSeconds = hasPrice ? Math.floor(Date.now() / 1000) - Number(oracle.updatedAt) : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1', className)}>
      <span className="tabular text-[10.5px] text-slate-soft">
        ₦{NGN_PER_TCTC.toLocaleString()}/tCTC
      </span>
      <span className="text-slate-soft/50" aria-hidden>·</span>

      {hasPrice ? (
        <span
          className="tabular text-[10.5px] text-steel"
          title={`Chainlink round ${oracle.roundId}, proven from Ethereum block ${oracle.sourceHeight}`}
        >
          ETH/USD ${formatUsdWad(oracle.answerWad, 2)} via 0x0FD2 · {formatAge(ageSeconds)}
        </span>
      ) : (
        <span className="tabular text-[10.5px] text-slate-soft">no rate proven yet</span>
      )}

      <button
        onClick={() => void refresh()}
        disabled={busy || !walletClient}
        title="Read a fresh Chainlink round off Ethereum through the Attestcoin precompile"
        aria-label="Refresh the live rate from Ethereum"
        className="focus-ring rounded-[2px] p-[3px] text-slate-soft transition-colors hover:text-ink disabled:opacity-40"
      >
        {busy ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} strokeWidth={1.75} />}
      </button>

      {status ? <span className="tabular text-[10px] text-steel">{status}</span> : null}
      {error ? <span className="tabular text-[10px] text-rust">{error}</span> : null}
    </div>
  );
}
