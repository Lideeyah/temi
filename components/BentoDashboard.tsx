'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Cpu,
  Link2,
  Minus,
  Plus,
  ShieldAlert,
  Store,
  Wallet,
} from 'lucide-react';
import type { Hex } from 'viem';
import { useMerchantAccount } from '@/hooks/useMerchantAccount';
import { useVault, type VaultAsset } from '@/hooks/useVault';
import {
  blockscoutAddress,
  creditcoinTestnet,
  creditcoinPublicClient,
  ATTESTCOIN_CHAIN_KEYS,
} from '@/lib/chains';
import {
  ATTESTCOIN_VERIFIER_ADDRESS,
  TEMI_VAULT_ADDRESS,
  isVaultConfigured,
} from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import { getAttestedHeight } from '@/lib/AttestcoinConduit';
import { cellIndexToH3 } from '@/lib/H3SpatialLock';
import {
  formatAmount,
  formatTctc,
  parseTctc,
  formatTctcExact,
  shortAssetId,
  truncateAddress,
  type Denomination,
} from '@/lib/format';
import { cn } from '@/lib/utils';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
import { DepositModal } from './DepositModal';
import { RegisterAssetModal } from './RegisterAssetModal';
import { SpatialSweepModal } from './SpatialSweepModal';
import { LiveValuationCard } from './LiveValuationCard';
import { PendingClaimsCard } from './PendingClaimsCard';
import { AccountDrawer, AccountPill } from './AccountDrawer';
import { Badge, Button, MetricRow, Modal, Notice, StatusDot, TextInput } from './ui/Primitives';

export function BentoDashboard() {
  const account = useMerchantAccount();
  const vault = useVault(account.address);

  // A merchant who taps "Report loss" without an account should be taken through provisioning,
  // not left staring at a disabled button wondering what they did wrong.
  const [accountDrawer, setAccountDrawer] = useState<string | null>(null);
  const requireAccount = useCallback(
    (reason: string, action: () => void) => {
      if (account.connected) action();
      else setAccountDrawer(reason);
    },
    [account.connected],
  );
  const [denomination, setDenomination] = useState<Denomination>('tCTC');

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [sweepAsset, setSweepAsset] = useState<VaultAsset | null>(null);

  const activeAssets = useMemo(() => vault.assets.filter((a) => a.isActive), [vault.assets]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (activeAssets.length === 0) setSelectedAssetId(null);
    else if (!activeAssets.some((a) => a.assetId === selectedAssetId)) {
      setSelectedAssetId(activeAssets[0].assetId);
    }
  }, [activeAssets, selectedAssetId]);

  const selectedAsset = activeAssets.find((a) => a.assetId === selectedAssetId) ?? null;

  const compoundYield = useCallback(async () => {
    if (!account.walletClient || !account.address || !TEMI_VAULT_ADDRESS) return;
    const hash = await account.walletClient.writeContract({
      address: TEMI_VAULT_ADDRESS,
      abi: temiVaultAbi,
      functionName: 'compoundYield',
      account: account.address,
      chain: creditcoinTestnet,
    });
    await creditcoinPublicClient.waitForTransactionReceipt({ hash });
    void vault.refresh();
  }, [account.walletClient, account.address, vault]);
  const money = useCallback((wei: bigint) => formatAmount(wei, denomination), [denomination]);

  return (
    <div className="min-h-dvh bg-paper">
      <Header
        account={account}
        denomination={denomination}
        onDenominationChange={setDenomination}
        onOpenAccount={() => setAccountDrawer('Merchant account')}
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-5 sm:px-6">
        {!isVaultConfigured ? (
          <div className="mb-4">
            <Notice tone="ochre" title="TemiVault address is not configured">
              Deploy with <span className="tabular">npm run deploy</span>, then set{' '}
              <span className="tabular">NEXT_PUBLIC_TEMI_VAULT_ADDRESS</span> in{' '}
              <span className="tabular">.env.local</span>. Every panel below reads live
              cc3-testnet state and stays empty until it points at a deployment.
            </Notice>
          </div>
        ) : null}

        {account.kind === 'injected' && !account.injected.onCorrectChain ? (
          <div className="mb-4">
            <Notice tone="rust" title="Wallet is on the wrong network">
              Tèmi settles on Creditcoin cc3-testnet (chain 102031).{' '}
              <button onClick={() => void account.injected.ensureChain()} className="underline underline-offset-2">
                Switch network
              </button>
            </Notice>
          </div>
        ) : null}

        {vault.error && isVaultConfigured ? (
          <div className="mb-4">
            <Notice tone="rust" title="Could not read TemiVault">{vault.error}</Notice>
          </div>
        ) : null}

        {/* ---- Bento grid: A+B on the top row, C+D on the bottom ---- */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <ReserveTile
            className="lg:col-span-2"
            vault={vault}
            money={money}
            denomination={denomination}
            connected={account.connected}
            onDeposit={() => requireAccount('Fund your reserve', () => setDepositOpen(true))}
            onWithdraw={() => requireAccount('Withdraw from Tier 1', () => setWithdrawOpen(true))}
            onCompound={() => requireAccount('Compound your yield', () => void compoundYield())}
          />

          <IncidentTile
            assets={activeAssets}
            selectedAssetId={selectedAssetId}
            onSelect={setSelectedAssetId}
            onSweep={() => requireAccount('Report loss or damage', () => selectedAsset && setSweepAsset(selectedAsset))}
            connected={account.connected}
            money={money}
            claims={vault.claims}
            walletClient={account.walletClient}
            account={account.address}
            onClaimsChanged={() => void vault.refresh()}
          />

          <InventoryTile
            className="lg:col-span-2"
            assets={vault.assets}
            loading={vault.loading}
            money={money}
            onRegister={() => requireAccount('Register an asset', () => setRegisterOpen(true))}
            onReport={(asset) => requireAccount('Report loss or damage', () => setSweepAsset(asset))}
            connected={account.connected}
          />

          <AttestcoinConsole
            vault={vault}
            money={money}
            walletClient={account.walletClient}
            account={account.address}
          />
        </div>
      </main>

      <AccountDrawer
        open={accountDrawer !== null}
        onClose={() => setAccountDrawer(null)}
        account={account}
        reason={accountDrawer ?? undefined}
      />
      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        walletClient={account.walletClient}
        account={account.address}
        onDeposited={() => void vault.refresh()}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        account={account}
        available={vault.tier1PersonalBalance}
        onWithdrawn={() => void vault.refresh()}
      />
      <RegisterAssetModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        walletClient={account.walletClient}
        account={account.address}
        onRegistered={() => void vault.refresh()}
      />
      <SpatialSweepModal
        open={sweepAsset !== null}
        onClose={() => setSweepAsset(null)}
        asset={sweepAsset}
        walletClient={account.walletClient}
        account={account.address}
        onSettled={() => void vault.refresh()}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                               HEADER                                */
/* ------------------------------------------------------------------ */

function Header({
  account,
  denomination,
  onDenominationChange,
  onOpenAccount,
}: {
  account: ReturnType<typeof useMerchantAccount>;
  denomination: Denomination;
  onDenominationChange: (d: Denomination) => void;
  onOpenAccount: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        {/* Wordmark. The tone mark is the brand — never render it as "Temi". */}
        <h1 className="shrink-0 text-[22px] font-semibold leading-none tracking-[-0.035em] text-ink">
          Tèmi
        </h1>

        <div className="hidden h-5 w-px bg-hairline sm:block" aria-hidden />

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">
            <Blocks size={9} strokeWidth={2} />
            cc3-testnet: {creditcoinTestnet.id}
          </Badge>
          <Badge tone="steel">
            <Link2 size={9} strokeWidth={2} />
            Attestcoin readability active
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* NGN / tCTC toggle — a segmented control, not a dropdown. */}
          <div className="flex overflow-hidden rounded-[3px] border border-hairline-strong">
            {(['NGN', 'tCTC'] as const).map((option) => (
              <button
                key={option}
                onClick={() => onDenominationChange(option)}
                className={cn(
                  'tabular focus-ring px-2.5 py-[5px] text-[10px] font-medium tracking-[0.04em] transition-colors',
                  denomination === option
                    ? 'bg-ink text-paper'
                    : 'bg-transparent text-slate-strong hover:bg-[rgba(31,36,47,0.05)]',
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <AccountPill account={account} onOpen={onOpenAccount} />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*                    TILE A — DUAL RESERVE (2 cols)                   */
/* ------------------------------------------------------------------ */

function Tile({
  title,
  eyebrow,
  action,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('card flex flex-col p-4', className)}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
          <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ReserveTile({
  vault,
  money,
  denomination,
  connected,
  onDeposit,
  onWithdraw,
  onCompound,
  className,
}: {
  vault: ReturnType<typeof useVault>;
  money: (wei: bigint) => string;
  denomination: Denomination;
  connected: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  onCompound: () => void;
  className?: string;
}) {
  const tier2Pool = vault.telemetry?.tier2Pool ?? 0n;
  const total = vault.tier1PersonalBalance + vault.tier2Headroom;

  return (
    <Tile
      className={className}
      eyebrow="Dual reserve"
      title="Unencumbered position"
      action={
        <Badge tone="moss" className="max-w-full whitespace-normal">
          <Activity size={9} strokeWidth={2} className="shrink-0" />
          No premium · fully withdrawable
        </Badge>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow mb-1.5">Tier 1 · personal vault</p>
          <p className="tabular mb-0.5 text-[34px] font-semibold leading-none tracking-[-0.035em] text-ink">
            {denomination === 'NGN' ? '₦' : ''}
            {denomination === 'NGN'
              ? money(vault.tier1PersonalBalance).replace('₦', '')
              : formatTctc(vault.tier1PersonalBalance)}
          </p>
          <p className="text-[11px] text-slate-soft">
            {denomination === 'NGN' ? 'Nigerian Naira · display rate' : 'tCTC on cc3-testnet'}
          </p>

          {/* The 85/15 architecture, drawn as one segmented rule. */}
          <div className="mt-4">
            <div className="flex h-[7px] w-full overflow-hidden rounded-[1px]">
              <div className="h-full bg-ink" style={{ width: '85%' }} />
              <div className="h-full bg-moss" style={{ width: '15%' }} />
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="eyebrow">85% personal</span>
              <span className="eyebrow text-moss">15% mutual buffer</span>
            </div>
          </div>

          {/* Yield, stated with its fee attached. A spread a merchant finds out about later is
              a spread they resent; showing it next to the number costs nothing. */}
          <div className="mt-4 border-t border-hairline pt-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="eyebrow">Yield earned</span>
              <span className="tabular text-[13px] font-semibold text-moss">
                {money(vault.revenue?.pendingYield ?? 0n)}
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-slate-soft">
              {!vault.revenue ? (
                <>
                  This deployment predates the yield engine. Redeploy to enable it — the split is
                  85% to you, 15% to the protocol, and never a cut of your principal.
                </>
              ) : vault.revenue.yieldStrategy !== ZERO_ADDRESS ? (
                <>Float spread: 15% of yield only · your principal stays 100% unencumbered.</>
              ) : (
                <>
                  No yield strategy connected. Creditcoin exposes no staking precompile to the
                  EVM, so idle reserves are not deployed yet — when they are, the split is 85% to
                  you, 15% to the protocol, and never a cut of your principal.
                </>
              )}
            </p>
            {vault.revenue && vault.revenue.pendingYield > 0n ? (
              <Button
                variant="outline"
                block
                className="mt-2 px-2 py-1.5 text-[11px]"
                onClick={onCompound}
              >
                Compound into Tier 1
              </Button>
            ) : null}
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={onDeposit} className="flex-1">
              <Plus size={13} strokeWidth={2} />
              Deposit reserve
            </Button>
            <Button
              variant="outline"
              onClick={onWithdraw}
              disabled={connected && vault.tier1PersonalBalance === 0n}
            >
              <Minus size={13} strokeWidth={2} />
              Withdraw
            </Button>
          </div>
        </div>

        <div className="border-t border-hairline pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <p className="eyebrow mb-1.5">Coverage</p>
          <MetricRow label="Tier 2 headroom" value={money(vault.tier2Headroom)} tone="moss" />
          <MetricRow label="Total drawable" value={money(total)} />
          <div className="my-2 h-px bg-hairline" />
          <MetricRow label="Lifetime deposits" value={money(vault.lifetimeDeposits)} />
          <MetricRow label="Mutual pool" value={money(tier2Pool)} tone="moss" />
          <MetricRow
            label="Claim ceiling"
            value={money(vault.lifetimeDeposits * 3n)}
            title="3× lifetime deposits — the per-claim Tier 2 anti-drain cap"
          />
        </div>
      </div>
    </Tile>
  );
}

/* ------------------------------------------------------------------ */
/*                   TILE B — RAPID INCIDENT (1 col)                   */
/* ------------------------------------------------------------------ */

function IncidentTile({
  assets,
  selectedAssetId,
  onSelect,
  onSweep,
  connected,
  money,
  claims,
  walletClient,
  account,
  onClaimsChanged,
}: {
  assets: VaultAsset[];
  selectedAssetId: string | null;
  onSelect: (id: string) => void;
  onSweep: () => void;
  connected: boolean;
  money: (wei: bigint) => string;
  claims: import('@/hooks/useVault').PendingClaim[];
  walletClient: ReturnType<typeof useMerchantAccount>['walletClient'];
  account: ReturnType<typeof useMerchantAccount>['address'];
  onClaimsChanged: () => void;
}) {
  const selected = assets.find((a) => a.assetId === selectedAssetId) ?? null;

  return (
    <Tile eyebrow="Rapid response" title="Report loss or damage">
      <p className="mb-3 text-[12px] leading-relaxed text-slate-strong">
        A three-second sweep, verified on your own hardware. Settlement lands in the same
        transaction — no adjuster, no waiting period.
      </p>

      <label className="mb-2 block">
        <span className="eyebrow mb-1.5 block">Affected asset</span>
        <select
          value={selectedAssetId ?? ''}
          onChange={(event) => onSelect(event.target.value)}
          disabled={assets.length === 0}
          className="focus-ring tabular w-full rounded-[3px] border border-hairline-strong bg-paper-raised px-2.5 py-2 text-[12px] text-ink disabled:opacity-50"
        >
          {assets.length === 0 ? (
            <option value="">{connected ? 'No active assets' : 'Open your vault first'}</option>
          ) : (
            assets.map((asset) => (
              <option key={asset.assetId} value={asset.assetId}>
                {asset.category === 1 ? 'Shop' : 'Machine'} · {shortAssetId(asset.assetId)}
              </option>
            ))
          )}
        </select>
      </label>

      {selected ? (
        <div className="mb-3 border border-hairline bg-paper-raised px-3 py-2.5">
          <MetricRow label="Declared value" value={money(selected.declaredValue)} />
          <MetricRow
            label="Verification"
            value={selected.category === 1 ? 'Sweep + H3 lock' : 'Sweep only'}
            tone={selected.category === 1 ? 'steel' : 'ochre'}
          />
        </div>
      ) : null}

      <div className="mt-auto">
        <Button variant="alert" block onClick={onSweep} disabled={connected && !selected}>
          <ShieldAlert size={14} strokeWidth={1.75} />
          Begin spatial sweep
        </Button>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-soft">
          Requires camera + motion sensors. Nothing is uploaded.
        </p>
      </div>

      <PendingClaimsCard
        claims={claims}
        walletClient={walletClient}
        account={account}
        onChanged={onClaimsChanged}
      />
    </Tile>
  );
}

/* ------------------------------------------------------------------ */
/*                    TILE C — INVENTORY (2 cols)                      */
/* ------------------------------------------------------------------ */

function InventoryTile({
  assets,
  loading,
  money,
  onRegister,
  onReport,
  connected,
  className,
}: {
  assets: VaultAsset[];
  loading: boolean;
  money: (wei: bigint) => string;
  onRegister: () => void;
  onReport: (asset: VaultAsset) => void;
  connected: boolean;
  className?: string;
}) {
  return (
    <Tile
      className={className}
      eyebrow={`${assets.length} registered`}
      title="Asset inventory"
      action={
        <Button variant="outline" onClick={onRegister} className="px-2.5 py-[6px] text-[12px]">
          <Plus size={12} strokeWidth={2} />
          Register asset
        </Button>
      }
    >
      {loading ? (
        <p className="py-8 text-center text-[12px] text-slate-soft">Reading cc3-testnet…</p>
      ) : assets.length === 0 ? (
        <div className="ruled flex flex-col items-center justify-center rounded-[3px] border border-dashed border-hairline-strong px-4 py-9 text-center">
          <p className="mb-1 text-[13px] font-medium text-ink">No assets registered yet</p>
          <p className="max-w-sm text-[11.5px] leading-relaxed text-slate-soft">
            Bind a generator by its serial plate, or a shop by its hexagonal cell and prepaid
            meter. Registration is what makes a later claim provable.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {assets.map((asset) => (
            <AssetCard key={asset.assetId} asset={asset} money={money} onReport={onReport} connected={connected} />
          ))}
        </div>
      )}
    </Tile>
  );
}

function AssetCard({
  asset,
  money,
  onReport,
  connected,
}: {
  asset: VaultAsset;
  money: (wei: bigint) => string;
  onReport: (asset: VaultAsset) => void;
  connected: boolean;
}) {
  const isProperty = asset.category === 1;

  return (
    <article
      className={cn(
        'border border-hairline bg-paper-raised px-3 py-2.5 transition-colors',
        !asset.isActive && 'opacity-60',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {isProperty ? (
            <Store size={12} className="shrink-0 text-steel" strokeWidth={1.75} />
          ) : (
            <Cpu size={12} className="shrink-0 text-ochre" strokeWidth={1.75} />
          )}
          <span className="tabular truncate text-[11.5px] font-medium text-ink">
            {shortAssetId(asset.assetId)}
          </span>
        </div>
        <Badge tone={asset.isActive ? 'moss' : 'neutral'}>
          {asset.isActive ? 'Covered' : 'Settled'}
        </Badge>
      </div>

      <MetricRow label="Declared" value={money(asset.declaredValue)} />
      {isProperty ? (
        <MetricRow label="H3 cell" value={cellIndexToH3(asset.h3CellIndex)} tone="steel" />
      ) : (
        <MetricRow label="Identity" value="keccak256(serial)" tone="ochre" />
      )}

      {asset.isActive ? (
        <button
          onClick={() => onReport(asset)}
          className="focus-ring mt-2 w-full rounded-[2px] border border-hairline-strong px-2 py-1.5 text-[11px] font-medium text-rust transition-colors hover:bg-[rgba(140,74,74,0.06)]"
        >
          Report loss / damage
        </button>
      ) : null}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*         TILE D — ATTESTCOIN READABILITY & TELEMETRY (1 col)         */
/* ------------------------------------------------------------------ */

function AttestcoinConsole({
  vault,
  money,
  walletClient,
  account,
}: {
  vault: ReturnType<typeof useVault>;
  money: (wei: bigint) => string;
  walletClient: ReturnType<typeof useMerchantAccount>['walletClient'];
  account: ReturnType<typeof useMerchantAccount>['address'];
}) {
  const [attestedHeight, setAttestedHeight] = useState<number | null>(null);
  const [proverUp, setProverUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      void getAttestedHeight(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA)
        .then((h) => {
          if (cancelled) return;
          setAttestedHeight(h);
          setProverUp(true);
        })
        .catch(() => !cancelled && setProverUp(false));
    };
    poll();
    const timer = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const t = vault.telemetry;

  return (
    <Tile
      eyebrow="Protocol console"
      title="Attestcoin & telemetry"
      action={<StatusDot tone={proverUp === false ? 'rust' : 'moss'} />}
    >
      <div className="-mx-1 px-1">
        <p className="eyebrow mb-1 text-steel">Cross-chain readability</p>
        <MetricRow label="Source chain" value="Ethereum Sepolia" tone="steel" />
        <MetricRow label="Chain key" value={ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA.toString()} tone="steel" />
        <MetricRow
          label="Attested height"
          value={attestedHeight ? attestedHeight.toLocaleString() : proverUp === false ? 'prover down' : '—'}
          tone={proverUp === false ? 'rust' : 'steel'}
        />
        <MetricRow label="Verify precompile" value={truncateAddress(ATTESTCOIN_VERIFIER_ADDRESS, 8, 6)} title={ATTESTCOIN_VERIFIER_ADDRESS} />
        <MetricRow label="Proofs verified" value={(t?.crossChainCount ?? 0n).toString()} tone="steel" />
        <MetricRow label="Value read in" value={money(t?.crossChainValue ?? 0n)} tone="steel" />
        <MetricRow
          label="Last proven block"
          value={t && t.lastSourceHeight > 0n ? t.lastSourceHeight.toString() : '—'}
        />
        <MetricRow label="Read cost" value="0 ATC" tone="moss" />

        <LiveValuationCard
          oracle={vault.oracle}
          walletClient={walletClient}
          account={account}
          onRefreshed={() => void vault.refresh()}
        />

        <div className="my-2.5 h-px bg-hairline" />

        <p className="eyebrow mb-1">Settlement chain</p>
        <MetricRow label="Block height" value={vault.blockNumber ? vault.blockNumber.toString() : '—'} />
        <MetricRow label="Tier 1 aggregate" value={money(t?.tier1Total ?? 0n)} />
        <MetricRow label="Tier 2 pool" value={money(t?.tier2Pool ?? 0n)} tone="moss" />
        <MetricRow label="Conduit backing" value={money(t?.conduitBacking ?? 0n)} />
        <MetricRow label="Claims settled" value={(t?.claimsSettled ?? 0n).toString()} />
        <MetricRow label="Value disbursed" value={money(t?.valueDisbursed ?? 0n)} tone="rust" />

        <div className="my-2.5 h-px bg-hairline" />

        <p className="eyebrow mb-1">Protocol revenue</p>
        <MetricRow label="Settlement fee" value="1.5% of payout" tone="ochre" />
        <MetricRow label="Yield spread" value="15% of yield" tone="ochre" />
        <MetricRow
          label="Fees collected"
          value={vault.revenue ? money(vault.revenue.totalProtocolFees) : 'not on this deployment'}
        />
        <MetricRow label="Yield to operators" value={money(vault.revenue?.totalYieldDistributed ?? 0n)} tone="moss" />
        <MetricRow
          label="Yield strategy"
          value={
            vault.revenue && vault.revenue.yieldStrategy !== ZERO_ADDRESS
              ? truncateAddress(vault.revenue.yieldStrategy, 8, 6)
              : 'none connected'
          }
          tone={vault.revenue && vault.revenue.yieldStrategy !== ZERO_ADDRESS ? 'moss' : 'rust'}
        />

        <div className="my-2.5 h-px bg-hairline" />

        <p className="eyebrow mb-1">Attestation invariants</p>
        <MetricRow label="Tremor floor σ" value="≥ 0.0100" tone="ochre" />
        <MetricRow label="Parallax floor" value="≥ 850 / 1000" tone="ochre" />
        <MetricRow label="Spatial lock" value="H3 res 10 · ±100 m" tone="ochre" />
        <MetricRow label="Tier 2 draw cap" value="10% pool · 3× lifetime" tone="ochre" />
      </div>

      {TEMI_VAULT_ADDRESS ? (
        <a
          href={blockscoutAddress(TEMI_VAULT_ADDRESS)}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink underline underline-offset-2"
        >
          TemiVault on Blockscout
          <ArrowUpRight size={11} strokeWidth={1.75} />
        </a>
      ) : null}
    </Tile>
  );
}

/* ------------------------------------------------------------------ */
/*                          WITHDRAW MODAL                             */
/* ------------------------------------------------------------------ */

function WithdrawModal({
  open,
  onClose,
  account,
  available,
  onWithdrawn,
}: {
  open: boolean;
  onClose: () => void;
  account: ReturnType<typeof useMerchantAccount>;
  available: bigint;
  onWithdrawn: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Hex | null>(null);

  const wei = parseTctc(amount);
  const valid = wei > 0n && wei <= available;

  const withdraw = useCallback(async () => {
    if (!account.walletClient || !account.address || !TEMI_VAULT_ADDRESS || !valid) return;
    setPending(true);
    setError(null);
    try {
      const hash = await account.walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'withdrawTier1',
        args: [wei],
        account: account.address,
        chain: creditcoinTestnet,
      });
      await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      setDone(hash);
      onWithdrawn();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message.split('\n')[0] : 'Withdrawal failed');
    } finally {
      setPending(false);
    }
  }, [account, wei, valid, onWithdrawn]);

  return (
    <Modal open={open} onClose={onClose} eyebrow="Tier 1 · personal vault" title="Withdraw" width="max-w-md">
      <div className="space-y-4">
        <p className="text-[12.5px] leading-relaxed text-slate-strong">
          Your Tier 1 balance is unencumbered. There is no lock-up and no forfeiture — this is the
          structural difference between a reserve and a premium.
        </p>

        <label className="block">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="eyebrow">Amount</span>
            <button
              onClick={() => setAmount(formatTctcExact(available))}
              className="tabular focus-ring text-[10px] text-ink underline underline-offset-2"
            >
              max {formatTctc(available)} tCTC
            </button>
          </div>
          <TextInput
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="0.0"
          />
        </label>

        {wei > available ? <Notice tone="rust" title="Exceeds your Tier 1 balance" /> : null}
        {error ? <Notice tone="rust" title={error} /> : null}
        {done ? <Notice tone="moss" title="Withdrawn to your wallet" /> : null}

        <Button block onClick={() => void withdraw()} disabled={!valid || pending}>
          {pending ? 'Confirming…' : 'Withdraw from Tier 1'}
        </Button>
      </div>
    </Modal>
  );
}
