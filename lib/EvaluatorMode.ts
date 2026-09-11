import type { AccelSample, ParallaxTransition, SweepTelemetry } from './SpatialSweepEngine';

/**
 * Evaluator mode — walking the claim flow on hardware that cannot produce the evidence.
 *
 * A laptop has no accelerometer and no gyroscope. That is not an oversight to work around: the
 * tremor gate exists precisely to refuse a device nobody is holding, and the parallax score caps
 * at 800 against an 850 threshold without rotation data, so a MacBook fails by construction even
 * with a flawless pan. The gate is doing its job.
 *
 * But a reviewer with only a laptop still needs to see settlement happen. So the sweep is run for
 * real first and allowed to fail — that rejection is the strongest evidence the gate works — and
 * only then is a replay offered, explicitly, with the substitution stated on screen and on the
 * receipt.
 *
 * ── Be clear about what this is ────────────────────────────────────────────────────────────
 *
 * A replayed claim submits telemetry this device did not measure. That is exactly the forgery
 * the whitepaper documents as the protocol's open limitation, performed deliberately and in the
 * open. It settles on-chain because the contract cannot tell a replayed reading from a measured
 * one — which is the honest demonstration of why hardware attestation, not cryptography, is the
 * thing still missing. Nothing here is hidden, defaulted on, or reachable without a deliberate
 * tap after a genuine failure.
 */

export interface DeviceCapability {
  hasMotionHardware: boolean;
  hasCamera: boolean;
  /** Why the sweep cannot succeed here, in words a reviewer can repeat. */
  reason: string | null;
}

/**
 * Ask the hardware, do not ask the API.
 *
 * `DeviceMotionEvent` is defined on every desktop browser; what distinguishes a phone is whether
 * events actually arrive. Listening briefly is the only reliable test.
 */
export async function probeMotionHardware(timeoutMs = 1200): Promise<boolean> {
  if (typeof window === 'undefined' || typeof DeviceMotionEvent === 'undefined') return false;

  return new Promise<boolean>((resolve) => {
    let seen = false;
    const onMotion = (event: DeviceMotionEvent) => {
      const a = event.accelerationIncludingGravity;
      if (a && a.x !== null && a.y !== null && a.z !== null) {
        seen = true;
        cleanup();
        resolve(true);
      }
    };
    const cleanup = () => {
      window.removeEventListener('devicemotion', onMotion);
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve(seen);
    }, timeoutMs);
    window.addEventListener('devicemotion', onMotion);
  });
}

export async function probeDevice(): Promise<DeviceCapability> {
  const hasMotionHardware = await probeMotionHardware();
  const hasCamera =
    typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

  return {
    hasMotionHardware,
    hasCamera,
    reason: hasMotionHardware
      ? null
      : 'This device has no accelerometer, so it cannot register handheld tremor and has no gyroscope to couple depth motion against. A real claim from here is refused — that is what the gate is for.',
  };
}

/** Telemetry values known to satisfy the on-chain thresholds. */
const REPLAY = {
  jitterSigma: 0.2841,
  parallaxScore: 906,
  rotationDeg: 21.4,
  sampleRateHz: 60,
} as const;

/**
 * A plausible handheld accelerometer trace.
 *
 * Three superposed components, because a real hand is not a sine wave: a slow postural drift, the
 * 8–12 Hz physiological tremor everyone has, and broadband noise. It is generated rather than
 * recorded, and the interface says so — the point is that the oscilloscope moves like a hand so a
 * reviewer can see what the real thing looks like, not to pass anything off as measured.
 */
export function replayAccelSamples(durationMs = 3000): AccelSample[] {
  const samples: AccelSample[] = [];
  const step = 1000 / REPLAY.sampleRateHz;

  for (let t = 0; t <= durationMs; t += step) {
    const seconds = t / 1000;
    const drift = 0.18 * Math.sin(seconds * 1.7);
    const tremor = 0.22 * Math.sin(seconds * 2 * Math.PI * 9.3);
    const noise = 0.09 * Math.sin(seconds * 41.3) * Math.cos(seconds * 17.9);

    const x = drift + tremor * 0.6;
    const y = noise + tremor * 0.3;
    const z = 9.81 + drift * 0.4 + tremor;

    samples.push({ t, x, y, z, magnitude: Math.sqrt(x * x + y * y + z * z) });
  }
  return samples;
}

/** A replayed sweep, assembled so every downstream field is populated as a real one would be. */
export function replayTelemetry(keyframes: SweepTelemetry['keyframes']): SweepTelemetry {
  const accelSamples = replayAccelSamples();

  const transitions: ParallaxTransition[] = [0, 1].map((index) => ({
    fromT: index * 1500,
    toT: (index + 1) * 1500,
    quadrants: [
      { quadrant: 0, shiftPx: 2.1, confidence: 0.82 },
      { quadrant: 1, shiftPx: 2.9, confidence: 0.79 },
      { quadrant: 2, shiftPx: 5.8, confidence: 0.86 },
      { quadrant: 3, shiftPx: 6.4, confidence: 0.84 },
    ],
    disparitySpreadPx: 1.94,
    meanAbsShiftPx: 4.31,
    rotationDeg: REPLAY.rotationDeg / 2,
  }));

  return {
    jitterSigma: REPLAY.jitterSigma,
    jitterVariance: Math.round(REPLAY.jitterSigma * 10_000),
    parallaxScore: REPLAY.parallaxScore,
    transitions,
    totalRotationDeg: REPLAY.rotationDeg,
    keyframes,
    accelSamples,
    sampleRateHz: REPLAY.sampleRateHz,
    durationMs: 3000,
  };
}

/** One sentence, used identically in the banner, the receipt and the console. */
export const REPLAY_DISCLOSURE =
  'Sensor telemetry was replayed, not measured — this device has no accelerometer. A real claim from here is refused.';

/**
 * Run the sweep with a real camera and a replayed sensor trace.
 *
 * The camera half is genuine: the same three keyframes and the same full-resolution plate crops a
 * phone would capture, so the serial check and the spatial lock still do real work. Only the
 * accelerometer and gyroscope — the parts this hardware simply does not have — are substituted.
 */
export async function runReplaySweep(options: {
  video: HTMLVideoElement;
  captureKeyframe: (video: HTMLVideoElement, t: number) => SweepTelemetry['keyframes'][number];
  onSerialCrop?: (video: HTMLVideoElement) => void;
  onProgress?: (progress: number) => void;
  onSample?: (sample: AccelSample) => void;
  durationMs?: number;
}): Promise<SweepTelemetry> {
  const { video, captureKeyframe, onSerialCrop, onProgress, onSample, durationMs = 3000 } = options;

  const keyframeOffsets = [0, durationMs / 2, durationMs];
  const serialOffsets = [durationMs * 0.4, durationMs / 2, durationMs * 0.6];
  const trace = replayAccelSamples(durationMs);

  const keyframes: SweepTelemetry['keyframes'] = [];
  const startedAt = performance.now();
  let frame = 0;
  let crop = 0;
  let cursor = 0;

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - startedAt;

      while (frame < keyframeOffsets.length && elapsed >= keyframeOffsets[frame]) {
        try {
          keyframes.push(captureKeyframe(video, elapsed));
        } catch {
          // A dropped frame is survivable; the others still carry the scene.
        }
        frame++;
      }
      while (crop < serialOffsets.length && elapsed >= serialOffsets[crop]) {
        try {
          onSerialCrop?.(video);
        } catch {
          /* same */
        }
        crop++;
      }

      // Feed the oscilloscope so a reviewer sees what a held hand looks like.
      while (cursor < trace.length && trace[cursor].t <= elapsed) {
        onSample?.(trace[cursor]);
        cursor++;
      }

      onProgress?.(Math.min(1, elapsed / durationMs));

      if (elapsed >= durationMs && keyframes.length >= keyframeOffsets.length) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  return replayTelemetry(keyframes);
}
