'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Landmark,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import { decodeEventLog, type Address, type Hex, type WalletClient } from 'viem';
import { creditcoinPublicClient, blockscoutTx, creditcoinTestnet } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS, NGN_PER_TCTC } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import {
  MIN_JITTER_SIGMA,
  MIN_PARALLAX_SCORE,
  SWEEP_DURATION_MS,
  SweepError,
  computeJitterSigma,
  requestSensorPermission,
  runSpatialSweep,
  type AccelSample,
  type SweepTelemetry,
} from '@/lib/SpatialSweepEngine';
import { verifySpatialLock, cellIndexToH3, SpatialLockError } from '@/lib/H3SpatialLock';
import { formatTctc, formatNgn, shortAssetId, truncateHash } from '@/lib/format';
import type { VaultAsset } from '@/hooks/useVault';
import { SensorOscilloscope } from './SensorOscilloscope';
import { Badge, Button, MetricRow, Modal, Notice, StatusDot } from './ui/Primitives';

type Phase =
  | 'brief'
  | 'arming'
  | 'sweeping'
  | 'analysing'
  | 'spatial'
  | 'signing'
  | 'settled'
  | 'rejected';

interface SettlementReceipt {
  txHash: Hex;
  payout: bigint;
  blockNumber: bigint;
}

export interface SpatialSweepModalProps {
  open: boolean;
  onClose: () => void;
  asset: VaultAsset | null;
  walletClient: WalletClient | null;
  account: Address | null;
  onSettled: () => void;
}

/** Masked destination for the simulated off-ramp receipt. */
const OFFRAMP_ACCOUNT = 'OPay (903****120)';

export function SpatialSweepModal({
  open,
  onClose,
  asset,
  walletClient,
  account,
  onSettled,
}: SpatialSweepModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [phase, setPhase] = useState<Phase>('brief');
  const [progress, setProgress] = useState(0);
  const [samples, setSamples] = useState<AccelSample[]>([]);
  const [telemetry, setTelemetry] = useState<SweepTelemetry | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [spatialNote, setSpatialNote] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SettlementReceipt | null>(null);

  const liveSigma = computeJitterSigma(samples);
  const isProperty = asset?.category === 1;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopCamera();
    setPhase('brief');
    setProgress(0);
    setSamples([]);
    setTelemetry(null);
    setErrorCode(null);
    setErrorTitle(null);
    setErrorDetail(null);
    setSpatialNote(null);
    setReceipt(null);
  }, [stopCamera]);

  useEffect(() => {
    if (!open) reset();
    return () => stopCamera();
  }, [open, reset, stopCamera]);

  const fail = useCallback((code: string, title: string, detail?: string) => {
    setErrorCode(code);
    setErrorTitle(title);
    setErrorDetail(detail ?? null);
    setPhase('rejected');
    stopCamera();
  }, [stopCamera]);

  /* ---------------------------------------------------------------- */
  /*                        THE ATTESTATION RUN                        */
  /* ---------------------------------------------------------------- */

  const beginSweep = useCallback(async () => {
    if (!asset || !walletClient || !account || !TEMI_VAULT_ADDRESS) return;

    setPhase('arming');
    setErrorCode(null);
    setSamples([]);

    // 1. Motion sensors. iOS requires this to originate from the user's tap.
    try {
      await requestSensorPermission();
    } catch (cause) {
      const error = cause as SweepError;
      fail(error.code, error.message, error.detail);
      return;
    }

    // 2. Rear camera.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (cause) {
      fail(
        'ERR_CAMERA_UNAVAILABLE',
        'ERR_CAMERA_UNAVAILABLE: camera access refused',
        cause instanceof Error ? cause.message : 'Tèmi needs the rear camera to observe depth.',
      );
      return;
    }

    // 3. The three-second sweep.
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase('sweeping');

    let result: SweepTelemetry;
    try {
      result = await runSpatialSweep({
        video: videoRef.current!,
        signal: controller.signal,
        onProgress: (p) => setProgress(p.progress),
        onSample: (sample) => setSamples((prev) => [...prev, sample]),
      });
    } catch (cause) {
      const error = cause as SweepError;
      if (error.telemetry?.accelSamples) setSamples(error.telemetry.accelSamples);
      if (error.telemetry) setTelemetry(error.telemetry as SweepTelemetry);
      fail(error.code, error.message, error.detail);
      return;
    }

    setTelemetry(result);
    setPhase('analysing');
    stopCamera();

    // 4. Fixed property carries an additional spatial lock.
    let liveH3Cell = 0n;
    if (isProperty) {
      setPhase('spatial');
      try {
        const { matches, fix, boundH3Index } = await verifySpatialLock(asset.h3CellIndex);
        liveH3Cell = fix.h3CellIndex;
        if (!matches) {
          fail(
            'ERR_SPATIAL_LOCK_FAILED',
            'ERR_SPATIAL_LOCK_FAILED: outside the registered cell',
            `You are standing in H3 ${fix.h3Index}; this shop is bound to ${boundH3Index}. File the claim at the premises.`,
          );
          return;
        }
        setSpatialNote(`H3 ${fix.h3Index} · ±${fix.accuracy.toFixed(0)}m`);
      } catch (cause) {
        const error = cause as SpatialLockError;
        fail(error.code ?? 'ERR_POSITION_UNAVAILABLE', error.message, error.detail);
        return;
      }
    }

    // 5. Settle on Creditcoin.
    setPhase('signing');
    try {
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'settleClaim',
        args: [
          asset.assetId,
          asset.declaredValue,
          BigInt(result.jitterVariance),
          BigInt(result.parallaxScore),
          liveH3Cell,
        ],
        account,
        chain: creditcoinTestnet,
      });

      const txReceipt = await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      if (txReceipt.status !== 'success') {
        fail('ERR_SETTLEMENT_REVERTED', 'Settlement reverted on-chain', `Transaction ${hash}`);
        return;
      }

      // Read the payout out of the ClaimSettled log. The contract caps the draw by the
      // solvency invariant, so the disbursed amount is routinely less than the declared value.
      let payout = 0n;
      for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() !== TEMI_VAULT_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: temiVaultAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === 'ClaimSettled') {
            payout = (decoded.args as { payout: bigint }).payout;
            break;
          }
        } catch {
          // Not a TemiVault event we model; keep scanning.
        }
      }

      setReceipt({ txHash: hash, payout, blockNumber: txReceipt.blockNumber });
      setPhase('settled');
      onSettled();

      void confetti({
        particleCount: 48,
        spread: 52,
        startVelocity: 26,
        ticks: 120,
        scalar: 0.7,
        colors: ['#4A6B5D', '#1F242F', '#8C733E'],
        origin: { y: 0.35 },
        disableForReducedMotion: true,
      });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Settlement failed';
      const shortMessage = message.split('\n')[0];
      fail('ERR_SETTLEMENT_REJECTED', 'Settlement rejected', shortMessage);
    }
  }, [asset, walletClient, account, isProperty, fail, stopCamera, onSettled]);

  if (!asset) return null;

  const dismissable = phase === 'brief' || phase === 'settled' || phase === 'rejected';

  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissable={dismissable}
      eyebrow="Emergency attestation"
      title={phase === 'settled' ? 'Settlement complete' : 'Three-second spatial sweep'}
      width="max-w-xl"
    >
      {/* ---------------- asset header ---------------- */}
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-hairline pb-3">
        <div className="min-w-0">
          <p className="eyebrow mb-1">{isProperty ? 'Commercial property' : 'Movable machinery'}</p>
          <p className="tabular truncate text-[13px] font-medium text-ink">
            {shortAssetId(asset.assetId)}
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow mb-1">Declared</p>
          <p className="tabular text-[13px] font-semibold text-ink">
            {formatTctc(asset.declaredValue)} tCTC
          </p>
        </div>
      </div>

      {/* ---------------- brief ---------------- */}
      {phase === 'brief' ? (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-slate-strong">
            Hold your phone up and pan it slowly across the damage for three seconds. Tèmi reads
            your accelerometer and the depth structure of the scene directly on this device. No
            video is uploaded and no image ever leaves your phone.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-hairline bg-paper-raised px-3 py-2.5">
              <p className="eyebrow mb-1">Gate 1 · Tremor</p>
              <p className="text-[11px] leading-snug text-slate-strong">
                Accelerometer σ must exceed {MIN_JITTER_SIGMA}. A phone lying on a desk fails.
              </p>
            </div>
            <div className="border border-hairline bg-paper-raised px-3 py-2.5">
              <p className="eyebrow mb-1">Gate 2 · Parallax</p>
              <p className="text-[11px] leading-snug text-slate-strong">
                Depth separation must score ≥ {MIN_PARALLAX_SCORE}/1000. Photos and screens fail.
              </p>
            </div>
          </div>

          {isProperty ? (
            <Notice tone="steel" title="Spatial lock required" icon={<Landmark size={12} />}>
              This shop is bound to H3 cell{' '}
              <span className="tabular">{cellIndexToH3(asset.h3CellIndex)}</span>. Your live GPS
              must resolve to the same hexagon.
            </Notice>
          ) : null}

          <Button block onClick={() => void beginSweep()} disabled={!walletClient || !account}>
            <Camera size={14} strokeWidth={1.75} />
            Begin sweep
          </Button>
          {!walletClient || !account ? (
            <p className="text-center text-[11px] text-slate-soft">Connect a wallet to file a claim.</p>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- live sweep ---------------- */}
      {phase === 'arming' || phase === 'sweeping' || phase === 'analysing' || phase === 'spatial' || phase === 'signing' ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-[3px] border border-hairline bg-ink">
            <video
              ref={videoRef}
              playsInline
              muted
              className="block aspect-[4/3] w-full object-cover"
            />
            {/* Hairline reticle — a measuring instrument, not a camera app. */}
            <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <rect
                x="16%" y="16%" width="68%" height="68%"
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"
                strokeDasharray="4 6" className="reticle-pulse"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[rgba(31,36,47,0.72)] px-3 py-1.5">
              <span className="tabular text-[10px] uppercase tracking-[0.1em] text-white/85">
                {phase === 'sweeping' ? 'Sweeping' : phase === 'arming' ? 'Arming sensors' : 'Analysing'}
              </span>
              <span className="tabular text-[10px] text-white/85">
                {((progress * SWEEP_DURATION_MS) / 1000).toFixed(1)}s / 3.0s
              </span>
            </div>
          </div>

          <div className="h-[2px] w-full bg-[rgba(31,36,47,0.10)]">
            <div
              className="h-full bg-moss transition-[width] duration-100 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <SensorOscilloscope
            samples={samples}
            sigma={liveSigma}
            belowThreshold={samples.length > 20 && liveSigma < MIN_JITTER_SIGMA}
          />

          {phase === 'spatial' ? (
            <Notice tone="steel" title="Sampling GPS for the spatial lock" icon={<Radar size={12} />}>
              Resolving your position to an H3 resolution-10 cell.
            </Notice>
          ) : null}
          {phase === 'signing' ? (
            <Notice tone="ochre" title="Dispatching settleClaim to cc3-testnet" icon={<ShieldCheck size={12} />}>
              Confirm the transaction in your wallet. The contract re-checks every threshold
              on-chain before it releases funds.
            </Notice>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- rejection ---------------- */}
      {phase === 'rejected' ? (
        <div className="space-y-3">
          <div className="border border-hairline border-l-2 border-l-rust bg-[rgba(140,74,74,0.06)] px-3.5 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-[1px] shrink-0 text-rust" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="tabular text-[11.5px] font-semibold leading-snug text-rust">
                  {errorTitle ?? errorCode}
                </p>
                {errorDetail ? (
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-strong">{errorDetail}</p>
                ) : null}
              </div>
            </div>
          </div>

          {telemetry ? <TelemetryReadout telemetry={telemetry} /> : null}
          {samples.length > 0 ? (
            <SensorOscilloscope samples={samples} sigma={liveSigma} belowThreshold />
          ) : null}

          <div className="flex gap-2">
            <Button variant="outline" block onClick={reset}>
              Retry sweep
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}

      {/* ---------------- settled ---------------- */}
      {phase === 'settled' && receipt ? (
        <div className="space-y-3">
          <div className="border border-hairline border-l-2 border-l-moss bg-[rgba(74,107,93,0.06)] px-3.5 py-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-[1px] shrink-0 text-moss" strokeWidth={1.75} />
              <div>
                <p className="text-[11.5px] font-semibold text-moss">
                  Claim settled on Creditcoin cc3-testnet
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-slate-strong">
                  Funds moved from your Tier 1 vault and the mutual buffer directly to your account.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-hairline bg-card px-3.5 py-3">
            <p className="eyebrow mb-2">Settlement</p>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-soft">Disbursed</span>
              <span className="tabular text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {formatTctc(receipt.payout)} <span className="text-[12px] text-slate-soft">tCTC</span>
              </span>
            </div>
            <MetricRow label="Block" value={receipt.blockNumber.toString()} />
            <MetricRow label="Tx" value={truncateHash(receipt.txHash)} title={receipt.txHash} />
            {telemetry ? (
              <>
                <MetricRow label="Tremor σ" value={telemetry.jitterSigma.toFixed(4)} tone="moss" />
                <MetricRow label="Parallax" value={`${telemetry.parallaxScore} / 1000`} tone="moss" />
              </>
            ) : null}
            {spatialNote ? <MetricRow label="Spatial lock" value={spatialNote} tone="steel" /> : null}
          </div>

          {/* Simulated ecosystem off-ramp. Labelled as simulated — the on-chain leg above is real. */}
          <div className="border border-hairline border-l-2 border-l-ochre bg-[rgba(140,115,62,0.06)] px-3.5 py-3">
            <div className="flex items-start gap-2">
              <Landmark size={14} className="mt-[1px] shrink-0 text-ochre" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="eyebrow mb-1 text-ochre">Simulated fiat dispatch</p>
                <p className="tabular text-[11.5px] font-medium leading-snug text-ink">
                  Settlement Dispatched: ₦{formatNgn(receipt.payout)} via Trugi NGN Instant Rail →{' '}
                  {OFFRAMP_ACCOUNT}
                </p>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-soft">
                  Off-ramp leg is simulated for the demo at ₦{NGN_PER_TCTC.toLocaleString()}/tCTC.
                  The settlement above is a real cc3-testnet transaction.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={blockscoutTx(receipt.txHash)}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-hairline-strong px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
            >
              View on Blockscout
              <ArrowUpRight size={13} strokeWidth={1.75} />
            </a>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

/** Per-transition parallax detail — shown on rejection so the operator can see what failed. */
function TelemetryReadout({ telemetry }: { telemetry: SweepTelemetry }) {
  return (
    <div className="border border-hairline bg-paper-raised px-3.5 py-3">
      <p className="eyebrow mb-2">Measured telemetry</p>
      <MetricRow
        label="Tremor σ"
        value={telemetry.jitterSigma.toFixed(5)}
        tone={telemetry.jitterSigma >= MIN_JITTER_SIGMA ? 'moss' : 'rust'}
      />
      <MetricRow
        label="Parallax score"
        value={`${telemetry.parallaxScore} / 1000`}
        tone={telemetry.parallaxScore >= MIN_PARALLAX_SCORE ? 'moss' : 'rust'}
      />
      <MetricRow label="Rotation" value={`${telemetry.totalRotationDeg.toFixed(1)}°`} />
      <MetricRow label="IMU rate" value={`${telemetry.sampleRateHz.toFixed(0)} Hz`} />
      {telemetry.transitions.map((t, index) => (
        <div key={index} className="mt-2 border-t border-hairline pt-2">
          <div className="mb-1 flex items-center gap-1.5">
            <StatusDot tone={t.disparitySpreadPx >= 0.35 ? 'moss' : 'rust'} />
            <span className="eyebrow">
              Transition {index + 1} · {(t.fromT / 1000).toFixed(1)}s → {(t.toT / 1000).toFixed(1)}s
            </span>
          </div>
          <MetricRow label="Quadrant spread" value={`${t.disparitySpreadPx.toFixed(2)} px`} />
          <MetricRow label="Mean pan" value={`${t.meanAbsShiftPx.toFixed(2)} px`} />
        </div>
      ))}
    </div>
  );
}
