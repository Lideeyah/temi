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
  ScanLine,
  ShieldCheck,
  Timer,
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
  waitForFirstFrame,
  type AccelSample,
  type SweepTelemetry,
} from '@/lib/SpatialSweepEngine';
import {
  verifySpatialLock,
  cellIndexToH3,
  MAX_GPS_ACCURACY_METERS,
  SpatialLockError,
} from '@/lib/H3SpatialLock';
import {
  SERIAL_RETICLE,
  SerialPlateError,
  captureSerialCrop,
  preloadOcr,
  readSerialPlate,
  type SerialMatch,
} from '@/lib/SerialPlateReader';
import {
  formatTctc,
  formatTctcExact,
  formatNgn,
  parseTctc,
  shortAssetId,
  truncateHash,
} from '@/lib/format';
import type { VaultAsset } from '@/hooks/useVault';
import { SensorOscilloscope } from './SensorOscilloscope';
import { SpatialProximityIndicator } from './SpatialProximityIndicator';
import { Badge, Button, Field, MetricRow, Modal, Notice, StatusDot, TextInput } from './ui/Primitives';

type Phase =
  | 'brief'
  | 'arming'
  | 'sweeping'
  | 'analysing'
  | 'reading'
  | 'spatial'
  | 'signing'
  | 'settled'
  | 'rejected';

interface ClaimQuote {
  tier1Draw: bigint;
  tier2Draw: bigint;
  instant: boolean;
  bondRequired: bigint;
}

interface SettlementReceipt {
  txHash: Hex;
  /** Net of the settlement fee — what actually reached the merchant. */
  payout: bigint;
  /** Before the fee, as the solvency invariant computed it. */
  gross: bigint;
  fee: bigint;
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

/** Full-resolution plate crops are taken around the sweep midpoint, in milliseconds. */
const SERIAL_CROP_POINTS_MS = [1200, 1500, 1800] as const;

const ZERO_HASH = `0x${'0'.repeat(64)}` as Hex;

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
  const [lossInput, setLossInput] = useState('');
  const [serialMatch, setSerialMatch] = useState<SerialMatch | null>(null);
  const serialCropsRef = useRef<HTMLCanvasElement[]>([]);
  const [quote, setQuote] = useState<ClaimQuote | null>(null);
  const [escrow, setEscrow] = useState<{ claimId: bigint; amount: bigint } | null>(null);
  // Live guidance only. The authoritative check is a fresh sample taken after the sweep and
  // compared on-chain — this just stops a merchant burning three seconds on a claim that
  // cannot land.
  const [insideCell, setInsideCell] = useState<boolean | null>(null);

  const liveSigma = computeJitterSigma(samples);
  const isProperty = asset?.category === 1;

  // The merchant states their own loss; it is only capped by what they declared at registration.
  const claimedLoss = lossInput.trim() ? parseTctc(lossInput) : (asset?.declaredValue ?? 0n);
  const lossExceedsDeclared = asset ? claimedLoss > asset.declaredValue : false;
  const lossValid = claimedLoss > 0n && !lossExceedsDeclared;

  // Ask the contract what this claim would actually do, so the merchant sees whether part of
  // it will be escrowed *before* they hold a camera up for three seconds.
  useEffect(() => {
    if (!open || !asset || !account || !TEMI_VAULT_ADDRESS || claimedLoss <= 0n) {
      setQuote(null);
      return;
    }
    // Captured locally: the module-level const is `Address | null`, and TypeScript will not
    // carry the narrowing above into this closure.
    const vaultAddress = TEMI_VAULT_ADDRESS;
    let cancelled = false;
    const timer = setTimeout(() => {
      void creditcoinPublicClient
        .readContract({
          address: vaultAddress,
          abi: temiVaultAbi,
          functionName: 'quoteClaim',
          args: [asset.assetId, claimedLoss, account],
        })
        .then((raw) => {
          if (cancelled) return;
          const q = raw as readonly [bigint, bigint, boolean, bigint];
          setQuote({ tier1Draw: q[0], tier2Draw: q[1], instant: q[2], bondRequired: q[3] });
        })
        .catch(() => !cancelled && setQuote(null));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, asset, account, claimedLoss]);

  // Seed the field from the declared value once per asset. Keyed on the id, not the object:
  // the vault re-polls every 12s and hands back a fresh object each time, which would otherwise
  // wipe whatever the merchant had typed mid-claim.
  const assetKey = asset?.assetId ?? null;
  const declaredValue = asset?.declaredValue ?? 0n;
  useEffect(() => {
    if (assetKey && open) setLossInput(formatTctcExact(declaredValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetKey, open]);

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
    setLossInput('');
    setSerialMatch(null);
    serialCropsRef.current = [];
    setQuote(null);
    setEscrow(null);
    setInsideCell(null);
  }, [stopCamera]);

  useEffect(() => {
    if (!open) reset();
    return () => stopCamera();
  }, [open, reset, stopCamera]);

  // Tesseract takes a second or two to start. Warm it while the brief is on screen so the
  // sweep itself never pays that cost.
  useEffect(() => {
    if (open && asset?.category === 0) preloadOcr();
  }, [open, asset?.category]);

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
    let video: HTMLVideoElement;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;

      // The <video> only mounts once the phase leaves 'brief', and React may not have
      // committed that render yet. Wait for the element rather than asserting it exists.
      const element = await waitForElement(videoRef);
      if (!element) {
        fail('ERR_CAMERA_UNAVAILABLE', 'ERR_CAMERA_UNAVAILABLE: viewfinder unavailable');
        return;
      }
      video = element;
      video.srcObject = stream;
      await video.play();
      // play() resolves before the first frame is decoded; capturing at t=0 without this
      // would hand the parallax engine a blank frame and reject a legitimate claim.
      await waitForFirstFrame(video);
    } catch (cause) {
      const sweepError = cause as SweepError;
      fail(
        sweepError.code ?? 'ERR_CAMERA_UNAVAILABLE',
        sweepError.code ? sweepError.message : 'ERR_CAMERA_UNAVAILABLE: camera access refused',
        sweepError.detail ??
          (cause instanceof Error ? cause.message : 'Tèmi needs the rear camera to observe depth.'),
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
        video,
        signal: controller.signal,
        onProgress: (p) => {
          setProgress(p.progress);
          // Grab full-resolution plate crops around the midpoint. Three of them, because a
          // single frame mid-sweep is frequently motion-blurred past legibility.
          if (!isProperty && serialCropsRef.current.length < SERIAL_CROP_POINTS_MS.length) {
            const next = SERIAL_CROP_POINTS_MS[serialCropsRef.current.length];
            if (p.elapsedMs >= next) {
              try {
                serialCropsRef.current.push(captureSerialCrop(video));
              } catch {
                // A dropped crop is survivable — the others still have to read.
              }
            }
          }
        },
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

    // 4. Movable hardware must show its serial plate. Parallax proves the claimant is in front
    //    of something real; only the plate proves it is the machine they registered.
    let claimAssetHash: Hex = ZERO_HASH;
    if (!isProperty) {
      setPhase('reading');
      try {
        const match = await readSerialPlate(serialCropsRef.current, asset.assetId);
        setSerialMatch(match);
        claimAssetHash = match.hash;
      } catch (cause) {
        const serialError = cause as SerialPlateError;
        fail(serialError.code, serialError.message, serialError.detail);
        return;
      }
    }

    // 5. Fixed property carries an additional spatial lock.
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

    // 6. Settle on Creditcoin.
    setPhase('signing');
    try {
      const hash = await walletClient.writeContract({
        address: TEMI_VAULT_ADDRESS,
        abi: temiVaultAbi,
        functionName: 'settleClaim',
        args: [
          asset.assetId,
          claimedLoss,
          BigInt(result.jitterVariance),
          BigInt(result.parallaxScore),
          liveH3Cell,
          claimAssetHash,
        ],
        account,
        chain: creditcoinTestnet,
        value: quote?.bondRequired ?? 0n,
      });

      const txReceipt = await creditcoinPublicClient.waitForTransactionReceipt({ hash });
      if (txReceipt.status !== 'success') {
        fail('ERR_SETTLEMENT_REVERTED', 'Settlement reverted on-chain', `Transaction ${hash}`);
        return;
      }

      // Read the payout out of the ClaimSettled log. The contract caps the draw by the
      // solvency invariant, so the disbursed amount is routinely less than the declared value.
      let payout = 0n;
      let gross = 0n;
      let fee = 0n;
      for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() !== TEMI_VAULT_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: temiVaultAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === 'ClaimSettled') {
            gross = (decoded.args as { payout: bigint }).payout;
          }
          // Read the fee from the chain rather than recomputing it here — the receipt should
          // show what was actually taken, not what the client believes the rate to be.
          if (decoded.eventName === 'SettlementFeeTaken') {
            const args = decoded.args as { gross: bigint; fee: bigint; net: bigint };
            fee += args.fee;
            payout += args.net;
          }
        } catch {
          // Not a TemiVault event we model; keep scanning.
        }
      }
      if (gross === 0n) gross = payout + fee;

      for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() !== TEMI_VAULT_ADDRESS.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({ abi: temiVaultAbi, data: log.data, topics: log.topics });
          if (decoded.eventName === 'ClaimEscrowed') {
            const args = decoded.args as { claimId: bigint; escrowedTier2: bigint; immediatePayout: bigint };
            setEscrow({ claimId: args.claimId, amount: args.escrowedTier2 });
            payout = args.immediatePayout;
            break;
          }
        } catch {
          /* not ours */
        }
      }

      setReceipt({ txHash: hash, payout, gross, fee, blockNumber: txReceipt.blockNumber });
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
  }, [asset, walletClient, account, isProperty, claimedLoss, quote, fail, stopCamera, onSettled]);

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

          <Field
            label="How much did you lose?"
            hint="Capped at what you declared for this asset. The contract may still settle less, bounded by the mutual buffer."
            suffix={
              <span className="tabular text-[10px] text-slate-soft">
                ₦{formatNgn(claimedLoss)}
              </span>
            }
          >
            <div className="relative">
              <TextInput
                value={lossInput}
                onChange={(event) => setLossInput(event.target.value)}
                inputMode="decimal"
                placeholder="0.0"
                className="pr-16"
              />
              <span className="tabular pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-soft">
                tCTC
              </span>
            </div>
          </Field>

          {quote && quote.tier2Draw > 0n ? (
            <div className="border border-hairline bg-paper-raised px-3.5 py-3">
              <p className="eyebrow mb-2">What this claim would do</p>
              <MetricRow label="From your own vault" value={`${formatTctc(quote.tier1Draw)} tCTC`} />
              <MetricRow label="From the mutual buffer" value={`${formatTctc(quote.tier2Draw)} tCTC`} tone="moss" />
              {quote.instant ? (
                <p className="mt-1.5 text-[10.5px] leading-snug text-moss">
                  Small enough to settle in one block. You are paid immediately.
                </p>
              ) : (
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-ochre">
                  Your own {formatTctc(quote.tier1Draw)} tCTC is paid immediately. The buffer&apos;s
                  share is held for 24 hours so anyone can object to it, then released — with a
                  10% bond withheld from your payout and returned when it settles.
                  {quote.bondRequired > 0n
                    ? ` You will also need to send ${formatTctc(quote.bondRequired)} tCTC to cover the bond.`
                    : ''}
                </p>
              )}
            </div>
          ) : null}

          {lossExceedsDeclared ? (
            <Notice tone="rust" title="Above your declared value">
              This asset is declared at {formatTctc(asset.declaredValue)} tCTC. Lower the amount,
              or the contract will reject the claim.
            </Notice>
          ) : null}

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

          {!isProperty ? (
            <Notice tone="ochre" title="Keep the serial plate in the inner box" icon={<ScanLine size={12} />}>
              Sweep across the damage <em>and</em> hold the machine&apos;s serial plate inside the
              amber box. Tèmi reads it on-device and checks it against the plate you registered,
              so a claim can only be filed against the machine it belongs to.
            </Notice>
          ) : null}

          {isProperty ? (
            <div className="space-y-2">
              <Notice tone="steel" title="Spatial lock required" icon={<Landmark size={12} />}>
                This shop is bound to H3 cell{' '}
                <span className="tabular">{cellIndexToH3(asset.h3CellIndex)}</span>. Your live GPS
                must resolve to the same cell — no neighbours, no tolerance.
              </Notice>
              <SpatialProximityIndicator
                boundCellIndex={asset.h3CellIndex}
                onChange={(proximity) =>
                  setInsideCell(
                    proximity === null
                      ? null
                      : proximity.inside && proximity.accuracy <= MAX_GPS_ACCURACY_METERS,
                  )
                }
              />
            </div>
          ) : null}

          <Button
            block
            onClick={() => void beginSweep()}
            disabled={!walletClient || !account || !lossValid || (isProperty && insideCell !== true)}
          >
            <Camera size={14} strokeWidth={1.75} />
            Begin sweep
          </Button>
          {!walletClient || !account ? (
            <p className="text-center text-[11px] text-slate-soft">Connect a wallet to file a claim.</p>
          ) : isProperty && insideCell === false ? (
            <p className="text-center text-[11px] leading-snug text-ochre">
              The sweep is held until you are inside the registered cell — the contract would
              refuse the claim from here, and you would have swept for nothing.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- live sweep ---------------- */}
      {phase === 'arming' ||
      phase === 'sweeping' ||
      phase === 'analysing' ||
      phase === 'reading' ||
      phase === 'spatial' ||
      phase === 'signing' ? (
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
              {/* Movable hardware must show its plate. The inner box is exactly the region the
                  OCR pass crops, so what the merchant frames is what the reader sees. */}
              {!isProperty ? (
                <>
                  <rect
                    x={`${SERIAL_RETICLE.x * 100}%`}
                    y={`${SERIAL_RETICLE.y * 100}%`}
                    width={`${SERIAL_RETICLE.width * 100}%`}
                    height={`${SERIAL_RETICLE.height * 100}%`}
                    fill="none"
                    stroke="#8C733E"
                    strokeWidth="1.5"
                  />
                  <text
                    x="50%"
                    y={`${(SERIAL_RETICLE.y - 0.025) * 100}%`}
                    textAnchor="middle"
                    fill="#E4CF9B"
                    style={{ fontSize: 9, letterSpacing: '0.12em', fontFamily: 'ui-monospace, monospace' }}
                  >
                    ALIGN SERIAL PLATE HERE
                  </text>
                </>
              ) : null}
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[rgba(31,36,47,0.72)] px-3 py-1.5">
              <span className="tabular text-[10px] uppercase tracking-[0.1em] text-white/85">
                {phase === 'sweeping'
                  ? 'Sweeping'
                  : phase === 'arming'
                    ? 'Arming sensors'
                    : phase === 'reading'
                      ? 'Reading plate'
                      : 'Analysing'}
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

          {phase === 'reading' ? (
            <Notice tone="ochre" title="Reading the serial plate on-device" icon={<ScanLine size={12} />}>
              Matching the plate in frame against the serial this asset was registered with. The
              image never leaves your phone.
            </Notice>
          ) : null}
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

            {/* Itemised, because a fee a merchant discovers afterwards is a fee they resent. */}
            <div className="mb-2 space-y-1 border-b border-hairline pb-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-slate-soft">Claimed loss</span>
                <span className="tabular text-[11px] text-slate-strong">
                  ₦{formatNgn(claimedLoss)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-slate-soft">Gross invariant payout</span>
                <span className="tabular text-[11px] text-ink">₦{formatNgn(receipt.gross)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-slate-soft">Protocol settlement fee · 1.5%</span>
                <span className="tabular text-[11px] text-rust">−₦{formatNgn(receipt.fee)}</span>
              </div>
            </div>

            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-soft">Net dispatched</span>
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
            {serialMatch ? (
              <MetricRow label="Serial verified" value={serialMatch.serial} tone="ochre" />
            ) : null}
            {spatialNote ? <MetricRow label="Spatial lock" value={spatialNote} tone="steel" /> : null}
          </div>

          {escrow ? (
            <Notice tone="ochre" title={`${formatTctc(escrow.amount)} tCTC held for challenge`} icon={<Timer size={12} />}>
              Claim #{escrow.claimId.toString()}. The mutual buffer&apos;s share is open to
              objection for 24 hours, then you can release it from your dashboard. Your own funds
              above are already in your wallet.
            </Notice>
          ) : null}

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

/**
 * Resolve once a ref has been populated by React's commit, or give up.
 *
 * The viewfinder mounts as a result of a `setPhase` earlier in the same async function, and
 * there is no guarantee that render has flushed by the time we need the element.
 */
async function waitForElement(
  ref: React.RefObject<HTMLVideoElement | null>,
  timeoutMs = 2000,
): Promise<HTMLVideoElement | null> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    if (ref.current) return ref.current;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return ref.current;
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
