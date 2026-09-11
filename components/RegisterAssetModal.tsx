'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Cpu,
  Loader2,
  MapPin,
  Store,
  Zap,
} from 'lucide-react';
import {
  encodePacked,
  keccak256,
  stringToHex,
  type Address,
  type Hex,
  type WalletClient,
} from 'viem';
import { creditcoinPublicClient, creditcoinTestnet, blockscoutTx } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import {
  acquireSpatialLock,
  MAX_GPS_ACCURACY_METERS,
  SpatialLockError,
  type SpatialFix,
} from '@/lib/H3SpatialLock';
import {
  SERIAL_RETICLE,
  SerialPlateError,
  captureSerialCrop,
  preloadOcr,
  readPlateTokens,
} from '@/lib/SerialPlateReader';
import { formatTctc, parseTctc, shortAssetId, truncateHash } from '@/lib/format';
import { fiatToWei, parseFiat, type Region } from '@/lib/regions';
import { cn } from '@/lib/utils';
import { useRegion } from './RegionProvider';
import { Badge, Button, Field, MetricRow, Modal, Notice, Tabs, TextInput } from './ui/Primitives';
import { ReserveSizingCard, computeSizing, HORIZONS } from './ReserveSizing';

type TrackId = 'machinery' | 'property';

const TRACKS = [
  { id: 'machinery', label: 'Movable machinery', hint: 'Generator · bike · inverter' },
  { id: 'property', label: 'Commercial property', hint: 'Shop · stall · kiosk' },
];

export interface RegisterAssetModalProps {
  open: boolean;
  onClose: () => void;
  walletClient: WalletClient | null;
  account: Address | null;
  onRegistered: () => void;
}

export function RegisterAssetModal({
  open,
  onClose,
  walletClient,
  account,
  onRegistered,
}: RegisterAssetModalProps) {
  const [track, setTrack] = useState<TrackId>('machinery');

  return (
    <Modal open={open} onClose={onClose} eyebrow="Asset inventory" title="Register asset" width="max-w-lg">
      <div className="-mx-5 -mt-5 mb-5">
        <Tabs tabs={TRACKS} active={track} onChange={(id) => setTrack(id as TrackId)} />
      </div>
      {track === 'machinery' ? (
        <MachineryTrack walletClient={walletClient} account={account} onRegistered={onRegistered} />
      ) : (
        <PropertyTrack walletClient={walletClient} account={account} onRegistered={onRegistered} />
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*                  SHARED SUBMISSION + RESULT PANEL                   */
/* ------------------------------------------------------------------ */

interface Registration {
  assetId: Hex;
  txHash: Hex;
}

function useRegistration(onRegistered: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Registration | null>(null);

  const submit = useCallback(
    async (
      walletClient: WalletClient | null,
      account: Address | null,
      assetId: Hex,
      category: 0 | 1,
      declaredValue: bigint,
      h3CellIndex: bigint,
      targetReserve: bigint,
      horizonMonths: number,
    ) => {
      if (!walletClient || !account || !TEMI_VAULT_ADDRESS) return;
      setPending(true);
      setError(null);
      try {
        const txHash = await walletClient.writeContract({
          address: TEMI_VAULT_ADDRESS,
          abi: temiVaultAbi,
          functionName: 'registerAsset',
          args: [assetId, category, declaredValue, h3CellIndex, targetReserve, BigInt(horizonMonths)],
          account: walletClient.account ?? account,
          chain: creditcoinTestnet,
        });
        const receipt = await creditcoinPublicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status !== 'success') {
          setError('Registration reverted. This identity may already be bound to another operator.');
          return;
        }
        setResult({ assetId, txHash });
        onRegistered();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message.split('\n')[0] : 'Registration failed');
      } finally {
        setPending(false);
      }
    },
    [onRegistered],
  );

  return { pending, error, result, submit };
}

function RegistrationResult({ result }: { result: Registration }) {
  return (
    <Notice tone="moss" title="Asset registered on cc3-testnet" icon={<Check size={12} />}>
      <div className="mt-0.5">
        <MetricRow label="Asset ID" value={shortAssetId(result.assetId)} title={result.assetId} />
        <MetricRow
          label="Tx"
          value={
            <a href={blockscoutTx(result.txHash)} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {truncateHash(result.txHash)}
            </a>
          }
        />
      </div>
    </Notice>
  );
}

/**
 * A starting figure in local money, derived from a token amount rather than hardcoded.
 *
 * ₦300,000 is a reasonable guess at a generator; GH₵300,000 is not a market stall, it is a
 * building. Anchoring on tCTC and converting keeps the suggestion sane in all four jurisdictions.
 */
function defaultDeclared(region: Region, tctc: number): string {
  return Math.round(tctc * region.ratePerTctc).toLocaleString('en-US');
}

/**
 * What the asset would cost to replace, in the money the merchant actually thinks in.
 *
 * This asked for tCTC while every other surface — reserve sizing, the deposit modal, the whole
 * dashboard — asks in naira. A trader does not know what their generator is worth in tCTC, and
 * being made to guess at the one number that caps every future payout is the worst place to put
 * that conversion on them. The token figure stays visible underneath, because it is what reaches
 * the contract.
 */
function ValueField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { region } = useRegion();
  const wei = fiatToWei(parseFiat(value), region);
  return (
    <Field
      label="Declared replacement value"
      hint="The ceiling on any future claim against this asset. Be honest — the contract caps payouts here."
      suffix={<span className="tabular text-[10px] text-slate-soft">{formatTctc(wei, 4)} tCTC</span>}
    >
      <div className="relative">
        <span
          className={cn(
            'tabular pointer-events-none absolute top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-soft',
            region.currencySymbol.length > 1 ? 'left-3' : 'left-3.5',
          )}
        >
          {region.currencySymbol}
        </span>
        <TextInput
          value={value}
          onChange={(event) => {
            const next = parseFiat(event.target.value);
            onChange(next > 0 ? next.toLocaleString('en-US') : event.target.value);
          }}
          inputMode="numeric"
          aria-label={`Declared replacement value in ${region.currencyCode}`}
          placeholder={defaultDeclared(region, 200)}
          className={cn('pr-16', region.currencySymbol.length > 1 ? 'pl-10' : 'pl-7')}
        />
        <span className="tabular pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-soft">
          {region.currencyCode}
        </span>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*                    TRACK A — MOVABLE MACHINERY                      */
/* ------------------------------------------------------------------ */

function MachineryTrack({
  walletClient,
  account,
  onRegistered,
}: {
  walletClient: WalletClient | null;
  account: Address | null;
  onRegistered: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [capture, setCapture] = useState<string | null>(null);
  const [serial, setSerial] = useState('');
  const [candidates, setCandidates] = useState<string[] | null>(null);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState<{ title: string; detail?: string } | null>(null);
  const [typedManually, setTypedManually] = useState(false);

  useEffect(() => {
    preloadOcr();
  }, []);
  const { region, money } = useRegion();
  const [declared, setDeclared] = useState(() => defaultDeclared(region, 200));
  const [horizon, setHorizon] = useState<number>(HORIZONS.movable[0]);
  const { pending, error, result, submit } = useRegistration(onRegistered);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraOn(false);
    }
  }, []);

  /**
   * Capture the plate and read it.
   *
   * The serial is taken from what the camera sees, not from what the merchant types. A typo here
   * is not a cosmetic problem: the claim sweep reads the real plate, so a mistyped registration
   * would hash to something no future claim can ever match, locking the merchant out of their own
   * asset with nothing on screen to explain it.
   */
  const capturePlate = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const still = document.createElement('canvas');
    still.width = 640;
    still.height = Math.round((640 * video.videoHeight) / Math.max(1, video.videoWidth));
    still.getContext('2d')?.drawImage(video, 0, 0, still.width, still.height);

    // Three crops of the same frame, so a marginal read gets more than one chance.
    const crops = [captureSerialCrop(video), captureSerialCrop(video, 4), captureSerialCrop(video, 2)];

    setCapture(still.toDataURL('image/webp', 0.7));
    stopCamera();
    setReading(true);
    setReadError(null);

    try {
      const { candidates: found } = await readPlateTokens(crops);
      setCandidates(found);
      if (found.length > 0) setSerial(found[0]);
    } catch (cause) {
      const plateError = cause as SerialPlateError;
      setReadError({ title: plateError.message, detail: plateError.detail });
      setCandidates([]);
    } finally {
      setReading(false);
    }
  }, [stopCamera]);

  const normalisedSerial = serial.trim().toUpperCase();
  // Identity is the serial plate itself: keccak256(abi.encodePacked(serialNumber)).
  const assetId = normalisedSerial ? keccak256(stringToHex(normalisedSerial)) : null;
  const wei = fiatToWei(parseFiat(declared), region);
  const ready = Boolean(assetId) && wei > 0n && !!walletClient;

  return (
    <div className="space-y-4">
      <Badge tone="ochre">
        <Cpu size={9} strokeWidth={2} />
        Track A · serial-plate identity
      </Badge>

      {capture ? (
        <div className="relative overflow-hidden rounded-[3px] border border-hairline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capture} alt="Captured serial plate" className="block w-full" />
          <button
            onClick={() => { setCapture(null); void openCamera(); }}
            className="focus-ring absolute bottom-2 right-2 rounded-[2px] border border-white/30 bg-[rgba(31,36,47,0.75)] px-2 py-1 text-[10px] text-white"
          >
            Retake
          </button>
        </div>
      ) : cameraOn ? (
        <div className="relative overflow-hidden rounded-[3px] border border-hairline bg-ink">
          <video ref={videoRef} playsInline muted className="block aspect-[4/3] w-full object-cover" />
          <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
            <rect
              x={`${SERIAL_RETICLE.x * 100}%`}
              y={`${SERIAL_RETICLE.y * 100}%`}
              width={`${SERIAL_RETICLE.width * 100}%`}
              height={`${SERIAL_RETICLE.height * 100}%`}
              fill="none"
              stroke="#8C733E"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[rgba(31,36,47,0.72)] px-3 py-1.5">
            <span className="eyebrow text-white/80">Frame the serial plate</span>
            <button
              onClick={() => void capturePlate()}
              className="focus-ring rounded-[2px] bg-white px-2.5 py-1 text-[10px] font-medium text-ink"
            >
              Capture &amp; read
            </button>
          </div>
        </div>
      ) : (
        <Button variant="outline" block onClick={() => void openCamera()}>
          <Camera size={14} strokeWidth={1.75} />
          Open camera to read the plate
        </Button>
      )}

      {reading ? (
        <Notice tone="steel" title="Reading the plate…" icon={<Loader2 size={12} className="animate-spin" />} />
      ) : null}

      {candidates && candidates.length > 0 ? (
        <div>
          <p className="eyebrow mb-1.5">What the camera read — pick the serial</p>
          <div className="flex flex-wrap gap-1.5">
            {candidates.map((candidate) => (
              <button
                key={candidate}
                onClick={() => {
                  setSerial(candidate);
                  setTypedManually(false);
                }}
                className={`tabular focus-ring rounded-[2px] border px-2 py-1 text-[11px] transition-colors ${
                  serial === candidate && !typedManually
                    ? 'border-ink bg-ink text-paper'
                    : 'border-hairline-strong text-slate-strong hover:bg-[rgba(31,36,47,0.04)]'
                }`}
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {readError ? <Notice tone="rust" title={readError.title}>{readError.detail}</Notice> : null}

      <Field
        label="Serial number"
        hint="Taken from the plate, not typed from memory — a claim reads the real plate, so a serial that differs from it could never be matched."
      >
        <TextInput
          value={serial}
          onChange={(event) => {
            setSerial(event.target.value);
            setTypedManually(true);
          }}
          placeholder={capture ? 'Pick one above, or correct it here' : 'Capture the plate first'}
          spellCheck={false}
        />
      </Field>

      {typedManually && candidates && candidates.length > 0 && !candidates.includes(normalisedSerial) ? (
        <Notice tone="ochre" title="That is not what the camera read">
          A future claim reads this plate again and must produce the same value. If the camera
          cannot read it as {normalisedSerial ? <span className="tabular">{normalisedSerial}</span> : 'this'},
          the claim will be refused. Prefer one of the readings above unless you are certain.
        </Notice>
      ) : null}

      <ValueField value={declared} onChange={setDeclared} />

      <ReserveSizingCard
        declaredWei={wei}
        category="movable"
        horizonMonths={horizon}
        onHorizonChange={setHorizon}
      />

      {assetId ? (
        <div className="border border-hairline bg-paper-raised px-3.5 py-3">
          <p className="eyebrow mb-2">Derived identity</p>
          <MetricRow label="keccak256(serial)" value={shortAssetId(assetId)} title={assetId} />
          <MetricRow label="Category" value="MOVABLE_HARDWARE" tone="ochre" />
          <MetricRow
            label="Target reserve"
            value={money(computeSizing(wei, 'movable', horizon).targetWei)}
            tone="moss"
          />
        </div>
      ) : null}

      {error ? <Notice tone="rust" title={error} /> : null}
      {result ? <RegistrationResult result={result} /> : null}

      <Button
        block
        disabled={!ready || pending}
        onClick={() =>
          assetId &&
          void submit(
            walletClient,
            account,
            assetId,
            0,
            wei,
            0n,
            computeSizing(wei, 'movable', horizon).targetWei,
            horizon,
          )
        }
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : null}
        {pending ? 'Registering…' : 'Confirm & register machinery'}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                  TRACK B — COMMERCIAL PROPERTY                      */
/* ------------------------------------------------------------------ */

function PropertyTrack({
  walletClient,
  account,
  onRegistered,
}: {
  walletClient: WalletClient | null;
  account: Address | null;
  onRegistered: () => void;
}) {
  const [fix, setFix] = useState<SpatialFix | null>(null);
  const [locating, setLocating] = useState(false);
  /** Accuracy of the latest reading while the fix converges, in metres. */
  const [searching, setSearching] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<{ title: string; detail?: string } | null>(null);
  const [meter, setMeter] = useState('');
  const { region } = useRegion();
  const [declared, setDeclared] = useState(() => defaultDeclared(region, 400));
  const [horizon, setHorizon] = useState<number>(HORIZONS.property[0]);
  const { pending, error, result, submit } = useRegistration(onRegistered);

  const locate = useCallback(async () => {
    setLocating(true);
    setGpsError(null);
    setSearching(null);
    try {
      // Report each reading as it arrives. A laptop's position converges over several seconds,
      // and a merchant watching a spinner has no way to tell converging from hung.
      setFix(await acquireSpatialLock({ onProgress: (accuracy) => setSearching(accuracy) }));
    } catch (cause) {
      const spatialError = cause as SpatialLockError;
      setGpsError({ title: spatialError.message, detail: spatialError.detail });
      setFix(null);
    } finally {
      setLocating(false);
      setSearching(null);
    }
  }, []);

  const normalisedMeter = meter.trim();
  // Identity binds the hexagon to the physical utility meter: a shop cannot be re-registered
  // from a different cell, and a meter number alone is not enough without standing there.
  const assetId =
    fix && normalisedMeter
      ? keccak256(encodePacked(['string', 'string'], [fix.h3Index, normalisedMeter]))
      : null;
  const wei = fiatToWei(parseFiat(declared), region);
  const ready = Boolean(assetId) && wei > 0n && !!walletClient;

  return (
    <div className="space-y-4">
      <Badge tone="steel">
        <Store size={9} strokeWidth={2} />
        Track B · H3 res-10 spatial lock
      </Badge>

      <div className="border border-hairline bg-paper-raised px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="eyebrow">Step 1 · Stand inside the shop</p>
          {fix ? (
            <Badge tone="moss">
              <Check size={9} strokeWidth={2.5} />
              Locked
            </Badge>
          ) : null}
        </div>

        {fix ? (
          <>
            <MetricRow label="H3 cell · res 10" value={fix.h3Index} tone="steel" />
            <MetricRow label="Accuracy" value={`±${fix.accuracy.toFixed(0)} m`} tone={fix.accuracy <= 30 ? 'moss' : 'ochre'} />
            <MetricRow label="Cell centre" value={`${fix.cellCenter.lat.toFixed(5)}, ${fix.cellCenter.lng.toFixed(5)}`} />
            <p className="mt-2 text-[10.5px] leading-relaxed text-slate-soft">
              Only the hexagon is written on-chain. Your exact coordinate never leaves this device.
            </p>
          </>
        ) : (
          <p className="mb-2.5 text-[11.5px] leading-relaxed text-slate-strong">
            Tèmi resolves your position to a hexagonal cell about 150 m across. A fix worse than
            ±{MAX_GPS_ACCURACY_METERS} m is rejected, because it could not reliably place you inside it.
          </p>
        )}

        <Button variant="outline" block className="mt-2.5" onClick={() => void locate()} disabled={locating}>
          {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} strokeWidth={1.75} />}
          {locating
            ? searching === null
              ? 'Acquiring fix…'
              : `Narrowing… ±${Math.round(searching)} m`
            : fix
              ? 'Re-acquire fix'
              : 'Acquire GPS fix'}
        </Button>

        {/* A laptop converges over several seconds. Showing the number moving is the difference
            between "working" and "frozen", and if it stalls wide of the ceiling the merchant can
            see that too rather than waiting for a timeout to tell them nothing. */}
        {locating && searching !== null ? (
          <p className="tabular mt-1.5 text-[10px] text-slate-soft">
            Best reading so far ±{Math.round(searching)} m · needs ±{MAX_GPS_ACCURACY_METERS} m or
            better
          </p>
        ) : null}
      </div>

      {gpsError ? <Notice tone="rust" title={gpsError.title}>{gpsError.detail}</Notice> : null}

      <Field
        label="Step 2 · DisCo prepaid meter number"
        hint="The physical meter on the wall. Binding it to the hexagon means neither alone can re-register the shop."
      >
        <div className="relative">
          <TextInput
            value={meter}
            onChange={(event) => setMeter(event.target.value)}
            placeholder="e.g. 04512338920"
            inputMode="numeric"
            className="pl-8"
          />
          <Zap size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-soft" strokeWidth={1.75} />
        </div>
      </Field>

      <ValueField value={declared} onChange={setDeclared} />

      <ReserveSizingCard
        declaredWei={wei}
        category="property"
        horizonMonths={horizon}
        onHorizonChange={setHorizon}
      />

      {assetId && fix ? (
        <div className="border border-hairline bg-paper-raised px-3.5 py-3">
          <p className="eyebrow mb-2">Derived identity</p>
          <MetricRow label="keccak256(h3, meter)" value={shortAssetId(assetId)} title={assetId} />
          <MetricRow label="Category" value="FIXED_PROPERTY" tone="steel" />
          <MetricRow label="h3CellIndex" value={fix.h3CellIndex.toString()} />
        </div>
      ) : null}

      {error ? <Notice tone="rust" title={error} /> : null}
      {result ? <RegistrationResult result={result} /> : null}

      <Button
        block
        disabled={!ready || pending}
        onClick={() =>
          assetId &&
          fix &&
          void submit(
            walletClient,
            account,
            assetId,
            1,
            wei,
            fix.h3CellIndex,
            computeSizing(wei, 'property', horizon).targetWei,
            horizon,
          )
        }
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : null}
        {pending ? 'Registering…' : 'Confirm & register property'}
      </Button>
    </div>
  );
}
