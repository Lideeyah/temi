/**
 * SpatialSweepEngine — hardware attestation of physical presence, computed entirely on-device.
 *
 * A claim is only honoured if the browser can prove two physical facts about the moment it was
 * filed, and neither is checkable from a photograph:
 *
 *   1. TREMOR. A phone held in a human hand is never still. We sample the accelerometer for the
 *      full sweep and take the standard deviation of |a| = sqrt(x² + y² + z²). A device resting
 *      on a desk sits near sigma = 0; a handheld device is one to two orders of magnitude above
 *      it. Below sigma = 0.01 we refuse to continue.
 *
 *   2. MOTION PARALLAX. This is the part a screen cannot fake. When you pan a camera across a
 *      real three-dimensional scene, near things sweep across the frame faster than far things.
 *      When you pan across a flat surface — a photograph, a laptop screen showing damage — the
 *      whole image translates by one uniform amount, because a plane's image motion under camera
 *      rotation is a single homography with no depth term.
 *
 *      So we measure per-quadrant image displacement between keyframes by normalised cross-
 *      correlation of column-luminance profiles, and look at the *spread* of those four
 *      displacements. Real scene: the quadrants disagree. Flat screen: they agree almost exactly.
 *      The spread is then cross-checked against integrated gyroscope rotation, so a static scene
 *      with a moving subject (a passing hand, a flickering screen) cannot manufacture a score.
 *
 * Nothing leaves the device. No video is uploaded, no cloud vision API is called; the three WebP
 * keyframes exist only so the operator can see what their own phone measured.
 */

/* ------------------------------------------------------------------ */
/*                              TUNING                                 */
/* ------------------------------------------------------------------ */

/** Sweep duration. Long enough for real parallax to accumulate, short enough to hold steady. */
export const SWEEP_DURATION_MS = 3000;

/** Keyframe capture points, in milliseconds from sweep start. */
export const KEYFRAME_OFFSETS_MS = [0, 1500, 3000] as const;

/** Minimum accelerometer sigma. Below this the device is resting on something. */
export const MIN_JITTER_SIGMA = 0.01;

/** The contract stores sigma as an integer, scaled by this factor. sigma 0.01 -> 100. */
export const JITTER_SCALE = 10_000;

/** Minimum parallax score, on the 0–1000 scale the contract checks. */
export const MIN_PARALLAX_SCORE = 850;

/** Analysis resolution. Small on purpose: parallax is a low-frequency signal and this keeps
 *  the whole correlation pass inside a couple of milliseconds on a mid-range Android phone. */
const ANALYSIS_WIDTH = 160;
const ANALYSIS_HEIGHT = 120;

/** Widest horizontal shift we search for, in analysis pixels. */
const MAX_SHIFT_PX = 20;

/**
 * Saturating floor for the disparity-spread term. A genuine handheld sweep across a real scene
 * produces roughly 1.5–4 px of spread between quadrants at this resolution; a flat screen
 * produces well under 0.4 px. This floor puts the former above the 850 gate and the latter far
 * below it.
 */
const COPLANAR_FLOOR_PX = 0.45;

/** Below this spread, with real pan present, the scene is provably planar. */
const COPLANAR_REJECT_PX = 0.35;

/** Pan magnitude, in px, at which the motion-support term saturates. */
const MOTION_SUPPORT_SATURATION_PX = 4;

/** Integrated rotation, in degrees, at which the gyro-coupling term saturates. */
const GYRO_SATURATION_DEG = 8;

/* ------------------------------------------------------------------ */
/*                              TYPES                                  */
/* ------------------------------------------------------------------ */

export interface AccelSample {
  /** Milliseconds since sweep start. */
  t: number;
  /** Gravity-inclusive acceleration magnitude, m/s². */
  magnitude: number;
  x: number;
  y: number;
  z: number;
}

export interface Keyframe {
  /** Milliseconds since sweep start. */
  t: number;
  /** Lightweight WebP data URL, for operator review only. Never uploaded. */
  webp: string;
  /** Downsampled greyscale plane used for the parallax computation. */
  luma: Float32Array;
  width: number;
  height: number;
}

export interface QuadrantDisplacement {
  /** Quadrant order: top-left, top-right, bottom-left, bottom-right. */
  quadrant: 0 | 1 | 2 | 3;
  /** Horizontal displacement in analysis pixels, positive = content moved right. */
  shiftPx: number;
  /** Peak normalised correlation, 0–1. Low values mean a featureless quadrant. */
  confidence: number;
}

export interface ParallaxTransition {
  fromT: number;
  toT: number;
  quadrants: QuadrantDisplacement[];
  /** Confidence-weighted spread of the four quadrant displacements. The parallax signal. */
  disparitySpreadPx: number;
  /** Mean absolute displacement — how much the camera actually panned. */
  meanAbsShiftPx: number;
  /** Integrated gyroscope rotation across this transition, degrees. */
  rotationDeg: number;
}

export interface SweepTelemetry {
  /** Accelerometer standard deviation, m/s². */
  jitterSigma: number;
  /** sigma * 10_000, as an integer — exactly what `settleClaim` receives. */
  jitterVariance: number;
  /** Motion-parallax score, 0–1000. */
  parallaxScore: number;
  /** Per-transition parallax detail, surfaced in the telemetry console. */
  transitions: ParallaxTransition[];
  /** Total integrated rotation across the sweep, degrees. */
  totalRotationDeg: number;
  keyframes: Keyframe[];
  accelSamples: AccelSample[];
  /** Effective accelerometer sample rate, Hz. */
  sampleRateHz: number;
  durationMs: number;
}

export type SweepErrorCode =
  | 'ERR_SENSOR_UNAVAILABLE'
  | 'ERR_SENSOR_PERMISSION_DENIED'
  | 'ERR_CAMERA_UNAVAILABLE'
  | 'ERR_STATIC_DEVICE'
  | 'ERR_PARALLAX_REJECTED'
  | 'ERR_INSUFFICIENT_FRAMES';

export class SweepError extends Error {
  readonly code: SweepErrorCode;
  readonly detail?: string;
  readonly telemetry?: Partial<SweepTelemetry>;

  constructor(
    code: SweepErrorCode,
    message: string,
    detail?: string,
    telemetry?: Partial<SweepTelemetry>,
  ) {
    super(message);
    this.name = 'SweepError';
    this.code = code;
    this.detail = detail;
    this.telemetry = telemetry;
  }
}

/* ------------------------------------------------------------------ */
/*                        SENSOR PERMISSIONS                           */
/* ------------------------------------------------------------------ */

type PermissionCapableEvent = {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

/**
 * iOS 13+ gates the motion sensors behind an explicit user gesture. Android and desktop
 * Chrome expose them without a prompt, so an absent `requestPermission` is not an error.
 */
export async function requestSensorPermission(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new SweepError('ERR_SENSOR_UNAVAILABLE', 'No window context');
  }

  const motion = (window as unknown as { DeviceMotionEvent?: PermissionCapableEvent })
    .DeviceMotionEvent;
  const orientation = (window as unknown as { DeviceOrientationEvent?: PermissionCapableEvent })
    .DeviceOrientationEvent;

  if (!motion) {
    throw new SweepError(
      'ERR_SENSOR_UNAVAILABLE',
      'ERR_SENSOR_UNAVAILABLE: no motion sensor on this device',
      'Tèmi verifies damage with the accelerometer. File this claim from the phone you carry.',
    );
  }

  for (const api of [motion, orientation]) {
    if (typeof api?.requestPermission !== 'function') continue;
    const result = await api.requestPermission();
    if (result !== 'granted') {
      throw new SweepError(
        'ERR_SENSOR_PERMISSION_DENIED',
        'ERR_SENSOR_PERMISSION_DENIED: motion access refused',
        'Grant motion & orientation access, then start the sweep again.',
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/*                           IMU CAPTURE                               */
/* ------------------------------------------------------------------ */

interface ImuRecorder {
  samples: AccelSample[];
  /** Integrated |rotation| in degrees, sampled alongside the accelerometer. */
  rotationAt(tMs: number): number;
  stop(): void;
}

/**
 * Subscribe to devicemotion and integrate rotation rate as we go.
 *
 * `rotationRate` is in deg/s. Integrating |alpha| + |beta| + |gamma| over time gives a scalar
 * "how much did this phone turn" that is robust to which axis the operator swept along — we
 * only need a magnitude to sanity-check the image displacement against, not a pose.
 */
function startImuRecorder(startedAt: number): ImuRecorder {
  const samples: AccelSample[] = [];
  const rotationTrack: Array<{ t: number; cumulativeDeg: number }> = [{ t: 0, cumulativeDeg: 0 }];
  let cumulativeDeg = 0;
  let lastRotationT: number | null = null;

  const onMotion = (event: DeviceMotionEvent) => {
    const t = performance.now() - startedAt;
    const a = event.accelerationIncludingGravity;
    if (a && a.x !== null && a.y !== null && a.z !== null) {
      const x = a.x ?? 0;
      const y = a.y ?? 0;
      const z = a.z ?? 0;
      samples.push({ t, x, y, z, magnitude: Math.sqrt(x * x + y * y + z * z) });
    }

    const r = event.rotationRate;
    if (r) {
      const rate = Math.abs(r.alpha ?? 0) + Math.abs(r.beta ?? 0) + Math.abs(r.gamma ?? 0);
      if (lastRotationT !== null) {
        cumulativeDeg += (rate * (t - lastRotationT)) / 1000;
      }
      lastRotationT = t;
      rotationTrack.push({ t, cumulativeDeg });
    }
  };

  window.addEventListener('devicemotion', onMotion);

  return {
    samples,
    rotationAt(tMs) {
      let best = rotationTrack[0].cumulativeDeg;
      for (const entry of rotationTrack) {
        if (entry.t > tMs) break;
        best = entry.cumulativeDeg;
      }
      return best;
    },
    stop() {
      window.removeEventListener('devicemotion', onMotion);
    },
  };
}

/** Population standard deviation of accelerometer magnitude. */
export function computeJitterSigma(samples: AccelSample[]): number {
  if (samples.length < 2) return 0;
  let sum = 0;
  for (const s of samples) sum += s.magnitude;
  const mean = sum / samples.length;
  let variance = 0;
  for (const s of samples) variance += (s.magnitude - mean) ** 2;
  return Math.sqrt(variance / samples.length);
}

/* ------------------------------------------------------------------ */
/*                       KEYFRAME EXTRACTION                           */
/* ------------------------------------------------------------------ */

/** Rec. 709 luma, the perceptual weighting that matches how the sensor sees brightness. */
function toLuma(data: Uint8ClampedArray, pixels: number): Float32Array {
  const luma = new Float32Array(pixels);
  for (let i = 0; i < pixels; i++) {
    const o = i * 4;
    luma[i] = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
  }
  return luma;
}

export function captureKeyframe(video: HTMLVideoElement, t: number): Keyframe {
  const canvas = document.createElement('canvas');
  canvas.width = ANALYSIS_WIDTH;
  canvas.height = ANALYSIS_HEIGHT;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new SweepError('ERR_CAMERA_UNAVAILABLE', 'ERR_CAMERA_UNAVAILABLE: no 2D context');
  }

  ctx.drawImage(video, 0, 0, ANALYSIS_WIDTH, ANALYSIS_HEIGHT);
  const image = ctx.getImageData(0, 0, ANALYSIS_WIDTH, ANALYSIS_HEIGHT);

  return {
    t,
    webp: canvas.toDataURL('image/webp', 0.5),
    luma: toLuma(image.data, ANALYSIS_WIDTH * ANALYSIS_HEIGHT),
    width: ANALYSIS_WIDTH,
    height: ANALYSIS_HEIGHT,
  };
}

/* ------------------------------------------------------------------ */
/*                       PARALLAX COMPUTATION                          */
/* ------------------------------------------------------------------ */

/**
 * Collapse a quadrant to a 1-D column-luminance profile.
 *
 * Summing down each column turns a 2-D patch into a signal whose horizontal translation is
 * exactly the horizontal image motion we want to measure — and throws away the vertical detail
 * that would otherwise cost us an order of magnitude in correlation work.
 */
function columnProfile(
  luma: Float32Array,
  width: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
): Float32Array {
  const profile = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = 0; y < h; y++) sum += luma[(y0 + y) * width + (x0 + x)];
    profile[x] = sum / h;
  }
  // Mean-centre so that a global exposure change does not read as motion.
  let mean = 0;
  for (let i = 0; i < w; i++) mean += profile[i];
  mean /= w;
  for (let i = 0; i < w; i++) profile[i] -= mean;
  return profile;
}

/**
 * Normalised cross-correlation over integer shifts, refined to sub-pixel by parabolic
 * interpolation around the peak. Sub-pixel matters here: the whole discriminator is the
 * *difference* between quadrant shifts, which is often well under one pixel.
 */
function bestShift(a: Float32Array, b: Float32Array): { shiftPx: number; confidence: number } {
  const n = a.length;
  const scores = new Map<number, number>();
  let bestScore = -Infinity;
  let bestLag = 0;

  for (let lag = -MAX_SHIFT_PX; lag <= MAX_SHIFT_PX; lag++) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    let count = 0;
    for (let i = 0; i < n; i++) {
      const j = i + lag;
      if (j < 0 || j >= n) continue;
      dot += a[i] * b[j];
      normA += a[i] * a[i];
      normB += b[j] * b[j];
      count++;
    }
    if (count < n / 2 || normA === 0 || normB === 0) continue;
    const score = dot / Math.sqrt(normA * normB);
    scores.set(lag, score);
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  if (bestScore === -Infinity) return { shiftPx: 0, confidence: 0 };

  // Parabolic sub-pixel refinement around the correlation peak.
  const left = scores.get(bestLag - 1);
  const right = scores.get(bestLag + 1);
  let refined = bestLag;
  if (left !== undefined && right !== undefined) {
    const denom = left - 2 * bestScore + right;
    if (denom !== 0) {
      const delta = (0.5 * (left - right)) / denom;
      if (Math.abs(delta) <= 1) refined = bestLag + delta;
    }
  }

  return { shiftPx: refined, confidence: Math.max(0, bestScore) };
}

/** Measure the four quadrant displacements between two consecutive keyframes. */
export function measureTransition(
  from: Keyframe,
  to: Keyframe,
  rotationDeg: number,
): ParallaxTransition {
  const halfW = Math.floor(from.width / 2);
  const halfH = Math.floor(from.height / 2);
  const origins: Array<[number, number]> = [
    [0, 0],
    [halfW, 0],
    [0, halfH],
    [halfW, halfH],
  ];

  const quadrants: QuadrantDisplacement[] = origins.map(([x0, y0], index) => {
    const a = columnProfile(from.luma, from.width, x0, y0, halfW, halfH);
    const b = columnProfile(to.luma, to.width, x0, y0, halfW, halfH);
    const { shiftPx, confidence } = bestShift(a, b);
    return { quadrant: index as 0 | 1 | 2 | 3, shiftPx, confidence };
  });

  // Confidence-weighted mean and spread. A featureless quadrant (a blank wall) contributes
  // little, rather than dragging the spread toward zero and masking real parallax.
  const totalConfidence = quadrants.reduce((acc, q) => acc + q.confidence, 0);
  let weightedMean = 0;
  let disparitySpreadPx = 0;

  if (totalConfidence > 0) {
    for (const q of quadrants) weightedMean += (q.shiftPx * q.confidence) / totalConfidence;
    let variance = 0;
    for (const q of quadrants) {
      variance += (q.confidence / totalConfidence) * (q.shiftPx - weightedMean) ** 2;
    }
    disparitySpreadPx = Math.sqrt(variance);
  }

  const meanAbsShiftPx = Math.abs(weightedMean);

  return { fromT: from.t, toT: to.t, quadrants, disparitySpreadPx, meanAbsShiftPx, rotationDeg };
}

/**
 * Fold the per-transition measurements into the 0–1000 score the contract gates on.
 *
 * Three terms, because each alone is spoofable:
 *   - structural  : do the quadrants disagree? (the actual parallax signal)
 *   - motion      : did the camera pan at all? (a still camera has no parallax to measure)
 *   - gyroCoupling: did the phone physically rotate? (ties the image evidence to the IMU, so a
 *                   video played back on a screen cannot supply the image half on its own)
 */
export function scoreParallax(transitions: ParallaxTransition[]): number {
  if (transitions.length === 0) return 0;

  let total = 0;
  for (const t of transitions) {
    const structural = t.disparitySpreadPx / (t.disparitySpreadPx + COPLANAR_FLOOR_PX);
    const motion = Math.min(1, t.meanAbsShiftPx / MOTION_SUPPORT_SATURATION_PX);
    const gyro = Math.min(1, t.rotationDeg / GYRO_SATURATION_DEG);
    total += 0.55 * structural + 0.25 * motion + 0.2 * gyro;
  }

  return Math.round((total / transitions.length) * 1000);
}

/** True when the frames are consistent with a flat plane: real pan, but no depth disagreement. */
export function isCoplanar(transitions: ParallaxTransition[]): boolean {
  const moving = transitions.filter((t) => t.meanAbsShiftPx > 2);
  if (moving.length === 0) return false;
  return moving.every((t) => t.disparitySpreadPx < COPLANAR_REJECT_PX);
}

/* ------------------------------------------------------------------ */
/*                         THE SWEEP ITSELF                            */
/* ------------------------------------------------------------------ */

export interface SweepProgress {
  elapsedMs: number;
  progress: number;
  keyframesCaptured: number;
}

export interface RunSweepOptions {
  video: HTMLVideoElement;
  onProgress?: (progress: SweepProgress) => void;
  onSample?: (sample: AccelSample) => void;
  signal?: AbortSignal;
}

/**
 * Run the full three-second sweep and return the telemetry `settleClaim` needs.
 *
 * Throws `SweepError` the moment a physical precondition fails, so the operator learns the
 * device is flat on a table before they have held a camera up for three seconds for nothing.
 */
export async function runSpatialSweep(options: RunSweepOptions): Promise<SweepTelemetry> {
  const { video, onProgress, onSample, signal } = options;

  const startedAt = performance.now();
  const imu = startImuRecorder(startedAt);
  const keyframes: Keyframe[] = [];
  let sampleCursor = 0;

  try {
    await new Promise<void>((resolve, reject) => {
      let frame = 0;

      const tick = () => {
        if (signal?.aborted) {
          reject(new SweepError('ERR_INSUFFICIENT_FRAMES', 'Sweep cancelled'));
          return;
        }

        const elapsed = performance.now() - startedAt;

        while (frame < KEYFRAME_OFFSETS_MS.length && elapsed >= KEYFRAME_OFFSETS_MS[frame]) {
          keyframes.push(captureKeyframe(video, elapsed));
          frame++;
        }

        for (; sampleCursor < imu.samples.length; sampleCursor++) {
          onSample?.(imu.samples[sampleCursor]);
        }

        onProgress?.({
          elapsedMs: elapsed,
          progress: Math.min(1, elapsed / SWEEP_DURATION_MS),
          keyframesCaptured: keyframes.length,
        });

        if (elapsed >= SWEEP_DURATION_MS && keyframes.length >= KEYFRAME_OFFSETS_MS.length) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  } finally {
    imu.stop();
  }

  const durationMs = performance.now() - startedAt;
  const accelSamples = imu.samples;

  // ---- Gate 1: is anyone actually holding this phone? ----
  if (accelSamples.length === 0) {
    throw new SweepError(
      'ERR_SENSOR_UNAVAILABLE',
      'ERR_SENSOR_UNAVAILABLE: accelerometer produced no samples',
      'This device exposes no motion sensor. File the claim from the phone you carry.',
    );
  }

  const jitterSigma = computeJitterSigma(accelSamples);
  const jitterVariance = Math.round(jitterSigma * JITTER_SCALE);
  const sampleRateHz = accelSamples.length / (durationMs / 1000);

  if (jitterSigma < MIN_JITTER_SIGMA) {
    throw new SweepError(
      'ERR_STATIC_DEVICE',
      'ERR_STATIC_DEVICE: Handheld tremor missing (Device is resting flat)',
      `Measured sigma ${jitterSigma.toFixed(5)} against a ${MIN_JITTER_SIGMA} floor. Pick the phone up and sweep it across the damage by hand.`,
      { jitterSigma, jitterVariance, accelSamples, sampleRateHz, durationMs },
    );
  }

  if (keyframes.length < KEYFRAME_OFFSETS_MS.length) {
    throw new SweepError(
      'ERR_INSUFFICIENT_FRAMES',
      'ERR_INSUFFICIENT_FRAMES: camera did not deliver three keyframes',
      'Hold the sweep for the full three seconds.',
    );
  }

  // ---- Gate 2: is this a real 3D scene, or a picture of one? ----
  const transitions: ParallaxTransition[] = [];
  for (let i = 1; i < keyframes.length; i++) {
    const rotationDeg = Math.max(
      0,
      imu.rotationAt(keyframes[i].t) - imu.rotationAt(keyframes[i - 1].t),
    );
    transitions.push(measureTransition(keyframes[i - 1], keyframes[i], rotationDeg));
  }

  const parallaxScore = scoreParallax(transitions);
  const totalRotationDeg = transitions.reduce((acc, t) => acc + t.rotationDeg, 0);

  const telemetry: SweepTelemetry = {
    jitterSigma,
    jitterVariance,
    parallaxScore,
    transitions,
    totalRotationDeg,
    keyframes,
    accelSamples,
    sampleRateHz,
    durationMs,
  };

  if (isCoplanar(transitions)) {
    throw new SweepError(
      'ERR_PARALLAX_REJECTED',
      'ERR_PARALLAX_REJECTED: 2D static screen detected',
      'The frame translated as one flat plane with no depth separation between quadrants. Point the camera at the physical asset, not at a photo or a screen.',
      telemetry,
    );
  }

  if (parallaxScore < MIN_PARALLAX_SCORE) {
    throw new SweepError(
      'ERR_PARALLAX_REJECTED',
      `ERR_PARALLAX_REJECTED: parallax ${parallaxScore} below the ${MIN_PARALLAX_SCORE} threshold`,
      'Not enough depth separation was observed. Sweep the phone sideways across the damage — a wider arc, past something near and something far.',
      telemetry,
    );
  }

  return telemetry;
}
