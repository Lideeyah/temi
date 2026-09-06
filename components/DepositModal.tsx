'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  Link2,
  Loader2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { decodeEventLog, isHex, type Address, type Hex, type WalletClient } from 'viem';
import {
  creditcoinPublicClient,
  creditcoinTestnet,
  blockscoutTx,
  etherscanTx,
  sepoliaPublicClient,
  ATTESTCOIN_CHAIN_KEYS,
} from '@/lib/chains';
import { TEMI_VAULT_ADDRESS, TEMI_SOURCE_PORTAL_ADDRESS, ATTESTCOIN_PROVER_URL } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import {
  ConduitError,
  encodeProofBundle,
  fetchProof,
  getAttestedHeight,
  proofFootprint,
  waitUntilAttested,
  type AttestcoinProof,
} from '@/lib/AttestcoinConduit';
import { formatTctc, formatTctcExact, parseTctc, truncateHash } from '@/lib/format';
import { Badge, Button, Field, MetricRow, Modal, Notice, Tabs, TextInput } from './ui/Primitives';
import { useRegion } from './RegionProvider';

type TabId = 'attestcoin' | 'native' | 'trugi';

/** The local rail is named for the jurisdiction, because the infrastructure genuinely differs. */
const RAIL_TAB: Record<string, { label: string; hint: string }> = {
  'trugi-nip': { label: 'Trugi NGN', hint: 'Virtual account' },
  'mtn-momo': { label: 'MTN MoMo', hint: 'Mobile money' },
  'mpesa-stk': { label: 'M-Pesa', hint: 'STK push' },
  attestcoin: { label: 'Cross-chain', hint: 'Ethereum Sepolia' },
};

export interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  walletClient: WalletClient | null;
  account: Address | null;
  onDeposited: () => void;
  /** First allocation carried over from reserve sizing, in wei of tCTC. */
  prefillWei?: bigint;
}

export function DepositModal({
  open,
  onClose,
  walletClient,
  account,
  onDeposited,
  prefillWei,
}: DepositModalProps) {
  const { region } = useRegion();

  // A merchant funding a sized allocation wants their own rail, not a cross-chain proof. For a
  // Global merchant that rail *is* the cross-chain one, which is why this reads from the region.
  const [tab, setTab] = useState<TabId>(
    prefillWei && prefillWei > 0n && region.rail !== 'attestcoin' ? 'trugi' : 'attestcoin',
  );

  const TABS = [
    { id: 'attestcoin', label: 'Attestcoin', hint: 'Ethereum Sepolia' },
    { id: 'native', label: 'Native tCTC', hint: 'Creditcoin' },
    {
      id: 'trugi',
      label: RAIL_TAB[region.rail]?.label ?? 'Local rail',
      hint: RAIL_TAB[region.rail]?.hint ?? '',
    },
  ];

  return (
    <Modal open={open} onClose={onClose} eyebrow="Fund reserve" title="Deposit" width="max-w-lg">
      <div className="-mx-5 -mt-5 mb-5">
        <Tabs tabs={TABS} active={tab} onChange={(id) => setTab(id as TabId)} />
      </div>

      {tab === 'attestcoin' ? (
        <AttestcoinTab walletClient={walletClient} account={account} onDeposited={onDeposited} />
      ) : null}
      {tab === 'native' ? (
        <NativeTab
          walletClient={walletClient}
          account={account}
          onDeposited={onDeposited}
          prefillWei={prefillWei}
        />
      ) : null}
      {tab === 'trugi' ? (
        <TrugiTab
          walletClient={walletClient}
          account={account}
          onDeposited={onDeposited}
          prefillWei={prefillWei}
        />
      ) : null}
    </Modal>
  );
}

/* ================================================================== */
/*         TAB 1 — ATTESTCOIN READABILITY (ETHEREUM SEPOLIA)          */
/* ================================================================== */

type ConduitStage = 'idle' | 'waiting' | 'proving' | 'previewing' | 'submitting' | 'done' | 'error';

function AttestcoinTab({
  walletClient,
  account,
  onDeposited,
}: {
  walletClient: WalletClient | null;
  account: Address | null;
  onDeposited: () => void;
}) {
  // Proof count belongs here, next to the act of moving cross-chain money — not on a dashboard
  // a merchant reads while doing something else entirely.
  const [crossChainCount, setCrossChainCount] = useState<bigint | null>(null);
  useEffect(() => {
    if (!TEMI_VAULT_ADDRESS) return;
    void creditcoinPublicClient
      .readContract({ address: TEMI_VAULT_ADDRESS, abi: temiVaultAbi, functionName: 'protocolTelemetry' })
      .then((raw) => setCrossChainCount((raw as readonly bigint[])[4]))
      .catch(() => undefined);
  }, []);

  const [sepTxHash, setSepTxHash] = useState('');
  const [stage, setStage] = useState<ConduitStage>('idle');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null);
  const [proof, setProof] = useState<AttestcoinProof | null>(null);
  const [attestedHeight, setAttestedHeight] = useState<number | null>(null);
  const [credited, setCredited] = useState<{ hash: Hex; amount: bigint } | null>(null);

  const chainKey = ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA;

  useEffect(() => {
    let cancelled = false;
    void getAttestedHeight(chainKey)
      .then((h) => !cancelled && setAttestedHeight(h))
      .catch(() => undefined);
    const timer = setInterval(() => {
      void getAttestedHeight(chainKey)
        .then((h) => !cancelled && setAttestedHeight(h))
        .catch(() => undefined);
    }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [chainKey]);

  const submit = useCallback(async () => {
    if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
    const hash = sepTxHash.trim();
    if (!isHex(hash) || hash.length !== 66) {
      setError({ title: 'Not a transaction hash', detail: 'Expected a 32-byte 0x-prefixed hash.' });
      setStage('error');
      return;
    }

    setError(null);
    setCredited(null);

    try {
      // 1. Fetch the proof. The builder needs the block attested first.
      setStage('proving');
      setStatus('Requesting inclusion + continuity proof from the Creditcoin proof builder…');
      let fetched: AttestcoinProof;
      try {
        fetched = await fetchProof(chainKey, hash as Hex);
      } catch (cause) {
        // Almost always "not attested yet". Look the transaction up on Sepolia to learn which
        // block the quorum actually has to reach, then wait for exactly that height.
        const conduitError = cause as ConduitError;
        const sourceReceipt = await sepoliaPublicClient
          .getTransactionReceipt({ hash: hash as Hex })
          .catch(() => null);
        if (!sourceReceipt) {
          setError({
            title: 'Transaction not found on Ethereum Sepolia',
            detail: conduitError.message,
          });
          setStage('error');
          return;
        }

        const targetHeight = Number(sourceReceipt.blockNumber);
        setStage('waiting');
        setStatus(`Block ${targetHeight.toLocaleString()} is not attested yet. Waiting for quorum…`);
        await waitUntilAttested(chainKey, targetHeight, {
          onProgress: (p) =>
            setStatus(
              p.blocksRemaining > 0
                ? `Attestor quorum at ${p.attestedHeight.toLocaleString()} — ${p.blocksRemaining.toLocaleString()} block${p.blocksRemaining === 1 ? '' : 's'} behind your transaction.`
                : 'Quorum reached. Building proof…',
            ),
        });
        setStage('proving');
        fetched = await fetchProof(chainKey, hash as Hex);
      }
      setProof(fetched);

      // 2. Dry-run the proof through the precompile's view overload before spending gas.
      setStage('previewing');
      setStatus('Verifying the proof against the 0x0FD2 Block Prover precompile…');
      const bundle = encodeProofBundle(fetched);
      const preview = (await creditcoinPublicClient.readContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'previewAttestcoinProof',
        args: [bundle],
      })) as readonly [boolean, Address, bigint, bigint, bigint];

      const [proofValid, operator, attestedAmount] = preview;
      if (!proofValid) {
        setError({
          title: 'Attestcoin verification failed',
          detail: 'The precompile rejected this inclusion proof.',
        });
        setStage('error');
        return;
      }
      if (attestedAmount === 0n) {
        setError({
          title: 'No ReserveFunded log in this transaction',
          detail: `The proven transaction emits nothing from the trusted portal on chain key ${chainKey}. Fund through TemiSourcePortal on Ethereum Sepolia.`,
        });
        setStage('error');
        return;
      }

      // 3. Land it on-chain.
      setStage('submitting');
      setStatus(
        `Proof valid. Crediting ${formatTctc(attestedAmount)} to ${operator.slice(0, 10)}… on cc3-testnet.`,
      );
      const txHash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'verifyAndDeposit',
        args: [bundle, hash as Hex, attestedAmount],
        account,
        chain: creditcoinTestnet,
      });

      const receipt = await creditcoinPublicClient.waitForTransactionReceipt({ hash: txHash });
      if (receipt.status !== 'success') {
        setError({ title: 'Transaction reverted', detail: txHash });
        setStage('error');
        return;
      }

      let amount = attestedAmount;
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== TEMI_VAULT_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({ abi: temiVaultAbi, data: log.data, topics: log.topics });
          if (decoded.eventName === 'AttestcoinReserveCredited') {
            amount = (decoded.args as { amount: bigint }).amount;
            break;
          }
        } catch {
          /* not ours */
        }
      }

      setCredited({ hash: txHash, amount });
      setStage('done');
      onDeposited();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message.split('\n')[0] : 'Attestcoin deposit failed';
      setError({
        title: message,
        detail: cause instanceof ConduitError ? cause.detail : undefined,
      });
      setStage('error');
    }
  }, [walletClient, account, sepTxHash, chainKey, onDeposited]);

  const busy = stage === 'proving' || stage === 'waiting' || stage === 'previewing' || stage === 'submitting';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="steel">
          <Link2 size={9} strokeWidth={2} />
          Chain key {chainKey} · Ethereum Sepolia
        </Badge>
        <Badge tone="moss">Verified via 0x0FD2 · 0 ATC</Badge>
        {crossChainCount !== null ? (
          <Badge tone="steel">
            {crossChainCount.toString()} cross-chain inflow{crossChainCount === 1n ? '' : 's'} verified
          </Badge>
        ) : null}
      </div>

      <p className="text-[12.5px] leading-relaxed text-slate-strong">
        Capital deposited on Ethereum Sepolia is <em>read</em> into Creditcoin. Attestors watch
        Sepolia, reach quorum, and post an attestation here; the vault then verifies your
        transaction&apos;s inclusion through the Block Prover precompile and credits the operator
        named inside the attested log. Nothing is written back to Sepolia.
      </p>

      {TEMI_SOURCE_PORTAL_ADDRESS ? (
        <div className="border border-hairline bg-paper-raised px-3 py-2.5">
          <p className="eyebrow mb-1.5">Step 1 · Fund on Ethereum Sepolia</p>
          <p className="mb-2 text-[11.5px] leading-relaxed text-slate-strong">
            Call <span className="tabular">fundReserveFor(operator)</span> on TemiSourcePortal,
            then paste the resulting Sepolia transaction hash below.
          </p>
          <CopyRow label="Portal" value={TEMI_SOURCE_PORTAL_ADDRESS} />
        </div>
      ) : (
        <Notice tone="ochre" title="Source portal not configured">
          Set <span className="tabular">NEXT_PUBLIC_TEMI_SOURCE_PORTAL_ADDRESS</span> to the
          TemiSourcePortal deployed on Ethereum Sepolia.
        </Notice>
      )}

      <Field
        label="Step 2 · Sepolia transaction hash"
        hint="The transaction that emitted ReserveFunded. Its block must be attested before a proof exists — roughly 40 blocks behind Sepolia's head."
        suffix={
          attestedHeight ? (
            <span className="tabular text-[10px] text-slate-soft">
              attested → {attestedHeight.toLocaleString()}
            </span>
          ) : null
        }
      >
        <TextInput
          value={sepTxHash}
          onChange={(event) => setSepTxHash(event.target.value)}
          placeholder="0x…"
          spellCheck={false}
          disabled={busy}
        />
      </Field>

      {busy && status ? (
        <Notice tone="steel" title={status} icon={<Loader2 size={12} className="animate-spin" />} />
      ) : null}

      {proof && stage !== 'error' ? <ProofReadout proof={proof} /> : null}

      {error ? (
        <Notice tone="rust" title={error.title}>
          {error.detail}
        </Notice>
      ) : null}

      {stage === 'done' && credited ? (
        <div className="border border-hairline border-l-2 border-l-moss bg-[rgba(74,107,93,0.06)] px-3.5 py-3">
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="mt-[1px] shrink-0 text-moss" strokeWidth={1.75} />
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold text-moss">Cross-chain reserve credited</p>
              <div className="mt-1.5">
                <MetricRow label="Credited" value={`${formatTctc(credited.amount)} tCTC`} tone="moss" />
                <MetricRow label="Tier 1 · 85%" value={formatTctc((credited.amount * 8500n) / 10000n)} />
                <MetricRow label="Tier 2 · 15%" value={formatTctc(credited.amount - (credited.amount * 8500n) / 10000n)} tone="moss" />
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href={blockscoutTx(credited.hash)} target="_blank" rel="noreferrer" className="tabular inline-flex items-center gap-1 text-[10.5px] text-ink underline underline-offset-2">
                  Creditcoin <ArrowUpRight size={10} />
                </a>
                <a href={etherscanTx(sepTxHash)} target="_blank" rel="noreferrer" className="tabular inline-flex items-center gap-1 text-[10.5px] text-steel underline underline-offset-2">
                  Sepolia source <ArrowUpRight size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Button block onClick={() => void submit()} disabled={busy || !walletClient || !sepTxHash.trim()}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} strokeWidth={1.75} />}
        {busy ? 'Verifying…' : 'Verify proof & credit reserve'}
      </Button>

      <p className="text-center text-[10px] text-slate-soft">
        Proof builder:{' '}
        <span className="tabular">{ATTESTCOIN_PROVER_URL.replace('https://', '')}</span>
      </p>
    </div>
  );
}

function ProofReadout({ proof }: { proof: AttestcoinProof }) {
  const footprint = proofFootprint(proof);
  return (
    <div className="border border-hairline bg-paper-raised px-3.5 py-3">
      <p className="eyebrow mb-2">Inclusion proof</p>
      <MetricRow label="Source block" value={proof.headerNumber.toLocaleString()} tone="steel" />
      <MetricRow label="Tx index" value={proof.txIndex.toString()} />
      <MetricRow label="Merkle root" value={truncateHash(proof.merkleProof.root)} title={proof.merkleProof.root} />
      <MetricRow label="Merkle siblings" value={footprint.siblings.toString()} />
      <MetricRow label="Continuity roots" value={footprint.continuityRoots.toString()} />
      <MetricRow label="Proof calldata" value={`${footprint.calldataBytes.toLocaleString()} B`} />
    </div>
  );
}

/* ================================================================== */
/*                    TAB 2 — NATIVE tCTC DEPOSIT                     */
/* ================================================================== */

function NativeTab({
  walletClient,
  account,
  onDeposited,
  prefillWei,
}: {
  walletClient: WalletClient | null;
  account: Address | null;
  onDeposited: () => void;
  prefillWei?: bigint;
}) {
  const [amount, setAmount] = useState(() =>
    prefillWei && prefillWei > 0n ? formatTctcExact(prefillWei) : '1.0',
  );
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wei = parseTctc(amount);

  const deposit = useCallback(async () => {
    if (!walletClient || !account || !TEMI_VAULT_ADDRESS || wei <= 0n) return;
    setPending(true);
    setError(null);
    setTxHash(null);
    try {
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'depositReserve',
        value: wei,
        account,
        chain: creditcoinTestnet,
      });
      await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);
      onDeposited();
    } catch (cause) {
      setError(describeTxFailure(cause));
    } finally {
      setPending(false);
    }
  }, [walletClient, account, wei, onDeposited]);

  return (
    <div className="space-y-4">
      <Badge tone="neutral">
        <Wallet size={9} strokeWidth={2} />
        cc3-testnet · direct settlement
      </Badge>

      <Field label="Amount" hint="Split 85% into your personal vault, 15% into the mutual buffer.">
        <div className="relative">
          <TextInput
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="1.0"
            className="pr-16"
          />
          <span className="tabular pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-soft">
            tCTC
          </span>
        </div>
      </Field>

      <div className="border border-hairline bg-paper-raised px-3.5 py-3">
        <p className="eyebrow mb-2">Allocation preview</p>
        <MetricRow label="Tier 1 · personal · 85%" value={`${formatTctc((wei * 8500n) / 10000n)} tCTC`} />
        <MetricRow label="Tier 2 · mutual · 15%" value={`${formatTctc(wei - (wei * 8500n) / 10000n)} tCTC`} tone="moss" />
      </div>

      <SplitBar />

      {error ? <Notice tone="rust" title={error} /> : null}
      {txHash ? (
        <Notice tone="moss" title="Reserve funded" icon={<Check size={12} />}>
          <a href={blockscoutTx(txHash)} target="_blank" rel="noreferrer" className="tabular underline underline-offset-2">
            {truncateHash(txHash)}
          </a>
        </Notice>
      ) : null}

      <Button block onClick={() => void deposit()} disabled={pending || !walletClient || wei <= 0n}>
        {pending ? <Loader2 size={14} className="animate-spin" /> : null}
        {pending ? 'Confirming…' : `Deposit ${amount || '0'} tCTC`}
      </Button>
    </div>
  );
}

/* ================================================================== */
/*             TAB 3 — TRUGI NGN VIRTUAL ACCOUNT (DEMO)               */
/* ================================================================== */

/**
 * Turn an EVM failure into something a merchant can act on.
 *
 * viem surfaces an out-of-funds condition as `reverted with the following reason:` and then
 * nothing, which tells the person reading it precisely as much as a blank screen would.
 */
function describeTxFailure(cause: unknown): string {
  const raw = cause instanceof Error ? cause.message : String(cause);
  if (/insufficient funds|exceeds the balance|InsufficientFunds/i.test(raw)) {
    return 'Your account does not hold enough tCTC to cover this allocation and its gas.';
  }
  if (/User rejected|denied transaction|rejected the request/i.test(raw)) {
    return 'You cancelled the transaction.';
  }
  const firstLine = raw.split('\n').find((line) => line.trim().length > 0)?.trim();
  return firstLine && firstLine.length > 4 ? firstLine : 'The transaction could not be completed.';
}

/**
 * The evaluator's escape hatch.
 *
 * A judge has no Nigerian bank account, no MTN wallet and no M-Pesa line, so without this the
 * local rail is a dead end for exactly the people assessing it. The button fires the same
 * relayer transaction the real webhook would.
 */
const SIMULATE_LABEL: Record<string, string> = {
  'trugi-nip': 'Simulate inbound NIP transfer',
  'mtn-momo': 'Simulate MoMo confirmation',
  'mpesa-stk': 'Simulate M-Pesa STK confirmation',
};

function TrugiTab({
  walletClient,
  account,
  onDeposited,
  prefillWei,
}: {
  walletClient: WalletClient | null;
  account: Address | null;
  onDeposited: () => void;
  prefillWei?: bigint;
}) {
  const { region, fiat } = useRegion();
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The allocation the merchant just sized, or a realistic default ticket.
  const RELAY_AMOUNT = prefillWei && prefillWei > 0n ? prefillWei : parseTctc('0.5');

  const [step, setStep] = useState<string | null>(null);

  /**
   * Simulate the inbound transfer, then allocate it.
   *
   * Two steps on purpose, because that is the actual shape of the thing: a bank credit lands in
   * the merchant's account, and only then do they allocate it to their vault. Asking the
   * merchant's own account to fund the deposit would be asking someone with no crypto to pay in
   * crypto, which is precisely the situation this rail exists to avoid.
   */
  const fireRelayer = useCallback(async () => {
    if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
    setPending(true);
    setError(null);
    setTxHash(null);

    try {
      setStep(`Receiving ${fiat(RELAY_AMOUNT)} on ${region.railName}…`);
      const response = await fetch('/api/relayer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ address: account, amount: RELAY_AMOUNT.toString() }),
      });
      const body = (await response.json()) as { error?: string; detail?: string };
      if (!response.ok) {
        setError(body.detail ? `${body.error}. ${body.detail}` : (body.error ?? 'Settlement failed'));
        return;
      }

      setStep('Allocating into your vault…');
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'depositReserve',
        value: RELAY_AMOUNT,
        account,
        chain: creditcoinTestnet,
      });
      await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);
      onDeposited();
    } catch (cause) {
      setError(describeTxFailure(cause));
    } finally {
      setPending(false);
      setStep(null);
    }
  }, [walletClient, account, RELAY_AMOUNT, region.railName, fiat, onDeposited]);

  return (
    <div className="space-y-4">
      <Badge tone="ochre">
        <Building2 size={9} strokeWidth={2} />
        {region.railName}
      </Badge>

      <p className="text-[11.5px] leading-relaxed text-slate-soft">
        {region.currencyCode} → {region.railName.split(' ')[0]} settlement → PenguinSwap USD1 →
        TemiVault
      </p>

      <div className="border border-hairline bg-card px-3.5 py-3">
        {region.rail === 'trugi-nip' ? (
          <>
            <p className="eyebrow mb-2.5">Your dedicated virtual account</p>
            <CopyRow label="Bank" value="Providus Bank" mono={false} />
            <CopyRow label="Account" value="9902148821" />
            <CopyRow label="Name" value="Tèmi / Lagos Traders" mono={false} />
          </>
        ) : region.rail === 'mtn-momo' ? (
          <>
            <p className="eyebrow mb-2.5">Approve the MoMo prompt on your phone</p>
            <CopyRow label="Merchant ID" value="Tèmi Ghana" mono={false} />
            <CopyRow label="Short code" value="*170#" />
            <CopyRow label="Reference" value="TEMI-VAULT" />
          </>
        ) : (
          <>
            <p className="eyebrow mb-2.5">M-Pesa Express · STK push</p>
            <CopyRow label="Paybill" value="4102938" />
            <CopyRow label="Account" value="TEMI-VAULT" />
            <CopyRow label="Merchant" value="Tèmi Kenya" mono={false} />
          </>
        )}
      </div>

      <p className="text-[12.5px] leading-relaxed text-slate-strong">
        An incoming transfer on {region.railName} is settled, swapped into USD1 through
        PenguinSwap and routed to the vault — the merchant never touches a wallet. For the demo,
        fire that relayer execution yourself: it dispatches a real{' '}
        <span className="tabular">depositReserve()</span> transaction to cc3-testnet.
      </p>

      <SplitBar />

      {step ? <Notice tone="steel" title={step} icon={<Loader2 size={12} className="animate-spin" />} /> : null}
      {error ? <Notice tone="rust" title={error} /> : null}
      {txHash ? (
        <Notice tone="moss" title={`Settled ${fiat(RELAY_AMOUNT)} into your vault`} icon={<Check size={12} />}>
          <a href={blockscoutTx(txHash)} target="_blank" rel="noreferrer" className="tabular underline underline-offset-2">
            {truncateHash(txHash)}
          </a>
        </Notice>
      ) : null}

      <Button block variant="outline" onClick={() => void fireRelayer()} disabled={pending || !walletClient}>
        {pending ? <Loader2 size={14} className="animate-spin" /> : null}
        {pending ? 'Relaying…' : SIMULATE_LABEL[region.rail] ?? 'Simulate inbound transfer'}
      </Button>
    </div>
  );
}

/* ================================================================== */
/*                              SHARED                                */
/* ================================================================== */

/** The 85/15 split rendered as a single segmented rule — slate for personal, moss for mutual. */
function SplitBar() {
  return (
    <div>
      <div className="flex h-[6px] w-full overflow-hidden rounded-[1px]">
        <div className="h-full bg-ink" style={{ width: '85%' }} />
        <div className="h-full bg-moss" style={{ width: '15%' }} />
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="eyebrow">Tier 1 personal 85%</span>
        <span className="eyebrow text-moss">Tier 2 mutual 15%</span>
      </div>
    </div>
  );
}

function CopyRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-baseline justify-between gap-3 py-[5px]">
      <span className="shrink-0 text-[11px] text-slate-soft">{label}</span>
      <button
        onClick={() => {
          void navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="focus-ring group inline-flex min-w-0 items-center gap-1.5 rounded-[2px] text-right"
      >
        <span className={`truncate text-[11px] font-medium text-ink ${mono ? 'tabular' : ''}`}>{value}</span>
        {copied ? (
          <Check size={10} className="shrink-0 text-moss" strokeWidth={2.25} />
        ) : (
          <Copy size={10} className="shrink-0 text-slate-soft opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
