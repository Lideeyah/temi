'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { formatUnits, type Hex } from 'viem';
import { fiatToWei, parseFiat } from '@/lib/regions';
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
  formatTctc,
  parseTctc,
  formatTctcExact,
  shortAssetId,
  truncateAddress,
} from '@/lib/format';
import { cn } from '@/lib/utils';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
import { DepositModal } from './DepositModal';
import { RegisterAssetModal } from './RegisterAssetModal';
import { SpatialSweepModal } from './SpatialSweepModal';
import { LiveRateLine } from './LiveRate';
import { NetworkPill, StatusBar } from './NetworkStatus';
import { HeroStats } from './HeroStats';
import { useRegion } from './RegionProvider';
import { PendingClaimsCard } from './PendingClaimsCard';
import { AccountDrawer, AccountPill } from './AccountDrawer';
import { PinPrompt } from './PinSetup';
import { VaultSetup, UninitializedBadge } from './VaultSetup';
import { Badge, Button, MetricRow, Modal, Notice, StatusDot, TextInput } from './ui/Primitives';

/** Lifetime deposits, so an asset card can show funding progress without prop-drilling. */
const VaultContext = createContext<{ lifetimeDeposits: bigint }>({ lifetimeDeposits: 0n });
const useVaultContext = () => useContext(VaultContext);

export function BentoDashboard() {
  const account = useMerchantAccount();
  const vault = useVault(account.address);
  const { region, denomination, setDenomination, money } = useRegion();

  // A merchant who taps "Report loss" without an account should be taken through provisioning,
  // not left staring at a disabled button wondering what they did wrong.
  const [accountDrawer, setAccountDrawer] = useState<string | null>(null);
  /** A queued action waiting on the PIN, so signing resumes exactly where it left off. */
  const [pinPrompt, setPinPrompt] = useState<{ action: string; run: () => void } | null>(null);

  const requireAccount = useCallback(
    (reason: string, action: () => void) => {
      if (account.connected) {
        action();
        return;
      }
      // A vault exists on this device but the key is not in memory — ask for the PIN rather than
      // sending them back through onboarding they have already completed.
      if (account.record) setPinPrompt({ action: reason, run: action });
      else setAccountDrawer(reason);
    },
    [account.connected, account.record],
  );

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

  const [initialising, setInitialising] = useState(false);
  const [depositPrefill, setDepositPrefill] = useState<bigint | undefined>(undefined);

  /**
   * The zero-state call to action. If there is no account yet this provisions one; if there is,
   * it funds the first allocation the merchant just sized for themselves.
   */
  const initializeVault = useCallback(
    async (monthlyWei: bigint) => {
      if (!account.connected) {
        setAccountDrawer('Open your vault');
        return;
      }
      if (!account.walletClient || !account.address || !TEMI_VAULT_ADDRESS || monthlyWei <= 0n) return;

      setInitialising(true);
      try {
        // A newly provisioned account holds only sponsored gas. Sending it at a deposit it
        // cannot cover would fail with an error a merchant has no way to interpret, so route
        // them to the funding rails with the amount they just sized already filled in.
        const balance = await creditcoinPublicClient.getBalance({ address: account.address });
        if (balance < monthlyWei) {
          setDepositPrefill(monthlyWei);
          setDepositOpen(true);
          return;
        }

        const hash = await account.walletClient.writeContract({
          address: TEMI_VAULT_ADDRESS,
          abi: temiVaultAbi,
          functionName: 'depositReserve',
          value: monthlyWei,
          account: account.walletClient.account ?? account.address,
          chain: creditcoinTestnet,
        });
        await creditcoinPublicClient.waitForTransactionReceipt({ hash });
        void vault.refresh();
      } catch {
        // The merchant declined, or the transaction failed. The setup card stays as it is.
      } finally {
        setInitialising(false);
      }
    },
    [account.connected, account.walletClient, account.address, vault],
  );

  const compoundYield = useCallback(async () => {
    if (!account.walletClient || !account.address || !TEMI_VAULT_ADDRESS) return;
    const hash = await account.walletClient.writeContract({
      address: TEMI_VAULT_ADDRESS,
      abi: temiVaultAbi,
      functionName: 'compoundYield',
      account: account.walletClient.account ?? account.address,
      chain: creditcoinTestnet,
    });
    await creditcoinPublicClient.waitForTransactionReceipt({ hash });
    void vault.refresh();
  }, [account.walletClient, account.address, vault]);

  return (
    <VaultContext.Provider value={{ lifetimeDeposits: vault.lifetimeDeposits }}>
    <div className="flex min-h-dvh flex-col bg-paper">
      <Header
        account={account}
        denomination={denomination}
        onDenominationChange={setDenomination}
        onOpenAccount={() => setAccountDrawer('Merchant account')}
        initialized={vault.initialized}
        blockNumber={vault.blockNumber}
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

        {isVaultConfigured && vault.initialized ? (
          <div className="mx-auto w-full max-w-4xl">
            <HeroStats vault={vault} money={money} />
          </div>
        ) : null}

        {/* A read that failed is not a merchant who has not started. Showing "establish your
            vault" to someone who funded one last week is the worst reading of an RPC timeout:
            it tells them their money is gone. Wait for a read that actually succeeded. */}
        {isVaultConfigured && !vault.loading && !vault.hasRead && vault.error ? (
          <div className="mx-auto w-full max-w-3xl">
            <Notice tone="rust" title="Could not read your vault">
              {vault.error} — your funds are unaffected; this is a failure to read cc3-testnet,
              not a change to your position.{' '}
              <button
                onClick={() => void vault.refresh()}
                className="focus-ring underline underline-offset-2"
              >
                Try again
              </button>
            </Notice>
          </div>
        ) : null}

        {/* Until a merchant has funded or registered anything there is no ledger to render —
            only zeros. Show them the one thing they can act on instead. */}
        {isVaultConfigured && !vault.loading && vault.hasRead && !vault.initialized ? (
          <div className="mx-auto w-full max-w-3xl">
            <VaultSetup
              connected={account.connected}
              busy={initialising || account.busy}
              biometricAvailable={account.biometricAvailable}
              accountError={account.error}
              biometricFellBack={account.biometricFellBack}
              onCreateVault={(params) =>
                void account.createVault({ ...params, regionId: region.id })
              }
              onOpenVault={(params) => account.openVault({ ...params, regionId: region.id })}
              onUseWallet={() => setAccountDrawer('Connect a Web3 wallet')}
              onInitialize={(monthly) => void initializeVault(monthly)}
              rateLine={
                <LiveRateLine
                  oracle={vault.oracle}
                  walletClient={account.walletClient}
                  account={account.address}
                  onRefreshed={() => void vault.refresh()}
                />
              }
            />
          </div>
        ) : (
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-2">
          <ReserveTile
            vault={vault}
            money={money}
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

        </div>
        )}
      </main>

      <StatusBar />

      <PinPrompt
        open={pinPrompt !== null}
        action={pinPrompt?.action ?? ''}
        busy={account.busy}
        error={account.error?.title ?? null}
        onCancel={() => setPinPrompt(null)}
        onSubmit={(pin) => {
          void account.unlockWithPin(pin).then((ok) => {
            if (!ok) return;
            const queued = pinPrompt?.run;
            setPinPrompt(null);
            // Let the unlocked signer land in state before the queued action reads it.
            setTimeout(() => queued?.(), 0);
          });
        }}
      />

      <AccountDrawer
        open={accountDrawer !== null}
        onClose={() => setAccountDrawer(null)}
        account={account}
        reason={accountDrawer ?? undefined}
      />
      <DepositModal
        open={depositOpen}
        onClose={() => {
          setDepositOpen(false);
          setDepositPrefill(undefined);
        }}
        prefillWei={depositPrefill}
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
    </VaultContext.Provider>
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
  initialized,
  blockNumber,
}: {
  account: ReturnType<typeof useMerchantAccount>;
  denomination: ReturnType<typeof useRegion>['denomination'];
  onDenominationChange: (d: ReturnType<typeof useRegion>['denomination']) => void;
  onOpenAccount: () => void;
  initialized: boolean;
  blockNumber: bigint | null;
}) {
  const { region } = useRegion();
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        {/* Wordmark. The tone mark is the brand — never render it as "Temi". */}
        <h1 className="shrink-0 text-[22px] font-semibold leading-none tracking-[-0.035em] text-ink">
          Tèmi
        </h1>

        <div className="hidden h-5 w-px bg-hairline sm:block" aria-hidden />

        <div className="flex flex-wrap items-center gap-1.5">
          <NetworkPill blockNumber={blockNumber} />
          {!initialized ? <UninitializedBadge signedIn={account.connected} /> : null}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* NGN / tCTC toggle — a segmented control, not a dropdown. */}
          <div className="flex overflow-hidden rounded-[3px] border border-hairline-strong">
            {(['fiat', 'tCTC'] as const).map((option) => (
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
                {option === 'fiat' ? region.currencyCode : 'tCTC'}
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
  connected,
  onDeposit,
  onWithdraw,
  onCompound,
  className,
}: {
  vault: ReturnType<typeof useVault>;
  money: (wei: bigint) => string;
  connected: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  onCompound: () => void;
  className?: string;
}) {
  const { region, denomination } = useRegion();
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
            {money(vault.tier1PersonalBalance)}
          </p>
          <p className="text-[11px] text-slate-soft">
            {denomination === 'fiat'
              ? `${region.currencyCode} · display rate`
              : 'tCTC on cc3-testnet'}
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
              15% protocol performance fee applied to yield only — never to your principal.{' '}
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
      {asset.targetReserve > 0n ? <CoverageHealth asset={asset} money={money} /> : null}
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

/**
 * How far an operator has funded the reserve this asset should sit behind.
 *
 * Measured against lifetime deposits rather than the current balance, so drawing your own money
 * down does not read as losing cover you paid for. The contract computes the same figure in
 * `coverageHealthBps`; this mirrors it locally to avoid a read per asset on every poll.
 */
function CoverageHealth({
  asset,
  money,
}: {
  asset: VaultAsset;
  money: (wei: bigint) => string;
}) {
  const { lifetimeDeposits } = useVaultContext();
  const funded = asset.targetReserve > 0n
    ? Number((lifetimeDeposits * 10000n) / asset.targetReserve) / 100
    : 0;
  const capped = Math.min(100, funded);
  const met = capped >= 100;

  return (
    <div className="mt-1.5">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[10px] text-slate-soft">
          Target {money(asset.targetReserve)}
          {asset.targetHorizonMonths > 0n ? ` · ${asset.targetHorizonMonths}mo` : ''}
        </span>
        <span className={cn('tabular text-[10px] font-medium', met ? 'text-moss' : 'text-ochre')}>
          {capped.toFixed(0)}% funded
        </span>
      </div>
      <div className="h-[4px] w-full overflow-hidden rounded-[1px] bg-[rgba(31,36,47,0.08)]">
        <div
          className={cn('h-full transition-[width] duration-500', met ? 'bg-moss' : 'bg-ochre')}
          style={{ width: `${Math.max(2, capped)}%` }}
        />
      </div>
      {met ? (
        <p className="mt-1 text-[9.5px] leading-snug text-moss">
          Target met · emergency multiplier active at 3× contributions
        </p>
      ) : null}
    </div>
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
  const { money, denomination, region } = useRegion();
  const [amount, setAmount] = useState('');
  const unitLabel = denomination === 'fiat' ? region.currencyCode : 'tCTC';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Hex | null>(null);

  // One field, two units. Whatever the merchant reads in is what they type in.
  const wei = denomination === 'fiat' ? fiatToWei(parseFiat(amount), region) : parseTctc(amount);
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
        account: account.walletClient.account ?? account.address,
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

        {/* Typed in whichever unit the merchant is reading. "max ₦102,000" above a box that
            silently means tCTC is an invitation to type 102000 and try to withdraw a hundred
            thousand tokens. */}
        <label className="block">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="eyebrow">Amount · {unitLabel}</span>
            <button
              onClick={() =>
                setAmount(
                  denomination === 'fiat'
                    ? Math.floor(Number(formatUnits(available, 18)) * region.ratePerTctc).toLocaleString('en-US')
                    : formatTctcExact(available),
                )
              }
              className="tabular focus-ring text-[10px] text-ink underline underline-offset-2"
            >
              max {money(available)}
            </button>
          </div>
          <div className="relative">
            {denomination === 'fiat' ? (
              <span className="tabular pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-soft">
                {region.currencySymbol}
              </span>
            ) : null}
            <TextInput
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode={denomination === 'fiat' ? 'numeric' : 'decimal'}
              placeholder={denomination === 'fiat' ? '0' : '0.0'}
              className={denomination === 'fiat' && region.currencySymbol.length === 1 ? 'pl-7' : undefined}
            />
          </div>
          {denomination === 'fiat' && wei > 0n ? (
            <p className="tabular mt-1.5 text-[10px] text-slate-soft">≈ {formatTctc(wei, 4)} tCTC</p>
          ) : null}
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
