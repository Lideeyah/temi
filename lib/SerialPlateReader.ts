import { keccak256, stringToHex, type Hex } from 'viem';

/**
 * SerialPlateReader — binds a claim to the physical machine that was registered.
 *
 * The parallax gate proves the claimant is standing in front of a real three-dimensional
 * object. It cannot prove the object is *theirs*. For movable hardware the serial plate is
 * what closes that gap, so the claim sweep has to read it.
 *
 * ── The matching problem ───────────────────────────────────────────────────────────────────
 *
 * An asset's identity is `keccak256(serialNumber)`, and a hash match is all-or-nothing: one
 * misread character and the claim fails. OCR of a stamped metal plate, through a phone camera,
 * during a handheld sweep, is not that reliable — so a naive "OCR the plate, hash the string"
 * pipeline would reject most honest claims.
 *
 * Two things make it tractable.
 *
 * First, we never need to know the serial. We only need to find *some* token in the OCR output
 * whose hash equals the on-chain assetId. So we tokenise everything the camera read — including
 * the manufacturer's name, the model number, "SERIAL NO:" — and test each candidate. Noise on
 * the rest of the plate is free; exactly one token has to come through clean.
 *
 * Second, OCR errors on alphanumerics are overwhelmingly a small set of shape confusions
 * (O/0, I/1/L, S/5, B/8, Z/2, G/6). We expand each token across those substitutions and test
 * the variants too, which recovers most single- and double-character misreads without ever
 * loosening the equality check itself.
 *
 * Everything runs in the browser. Tesseract's worker and language data are served from the
 * app's own origin, so no image and no text ever leaves the device.
 */

/** Where the merchant is asked to hold the plate, as a fraction of the video frame. */
export const SERIAL_RETICLE = { x: 0.14, y: 0.56, width: 0.72, height: 0.22 } as const;

/** Characters an OCR pass most often swaps on stamped or moulded plates. */
const CONFUSIONS: Record<string, string[]> = {
  '0': ['O', 'D', 'Q'],
  O: ['0', 'D', 'Q'],
  '1': ['I', 'L', 'T'],
  I: ['1', 'L', 'T'],
  L: ['1', 'I'],
  '5': ['S'],
  S: ['5'],
  '8': ['B'],
  B: ['8'],
  '2': ['Z'],
  Z: ['2'],
  '6': ['G'],
  G: ['6'],
  '9': ['Q', 'g'],
  U: ['V'],
  V: ['U'],
};

/** Cap the search so a noisy read cannot lock up the phone mid-claim. */
const MAX_VARIANTS_PER_TOKEN = 512;
const MAX_TOKEN_LENGTH = 40;
const MIN_TOKEN_LENGTH = 4;
/**
 * How many adjacent words may be joined into one candidate.
 *
 * OCR splits a single stamped run on every gap in the die-stamping, so "TG9500DE4471" is
 * routinely read as four separate words. Five covers every split we have seen and keeps the
 * candidate set linear in the length of the text.
 */
const MAX_JOIN_SPAN = 5;

export interface SerialMatch {
  /** The token whose hash equals the registered assetId. */
  serial: string;
  /** keccak256 of that token — equal to the assetId by construction. */
  hash: Hex;
  /** Raw text the OCR pass produced, for the operator to see what their camera read. */
  rawText: string;
  /** How many candidates were tested before the match. */
  candidatesTested: number;
  /** True when the match needed a confusion substitution rather than a clean read. */
  corrected: boolean;
}

export type SerialErrorCode = 'ERR_OCR_UNAVAILABLE' | 'ERR_SERIAL_NOT_FOUND' | 'ERR_NO_TEXT_READ';

export class SerialPlateError extends Error {
  readonly code: SerialErrorCode;
  readonly detail?: string;
  readonly rawText?: string;

  constructor(code: SerialErrorCode, message: string, detail?: string, rawText?: string) {
    super(message);
    this.name = 'SerialPlateError';
    this.code = code;
    this.detail = detail;
    this.rawText = rawText;
  }
}

/** Uppercase, and drop everything a serial plate would not contain. */
export function normaliseToken(token: string): string {
  return token.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

/**
 * Split OCR output into candidate serials.
 *
 * Includes adjacent joins, because OCR frequently inserts a space into a single stamped run
 * ("TG 9500 DE" for "TG9500DE") and, less often, splits across a hyphen.
 */
export function tokenise(rawText: string): string[] {
  const words = rawText
    .split(/[\s\n\r\t|/\\,;:()[\]{}]+/)
    .map(normaliseToken)
    .filter((t) => t.length > 0);

  const candidates = new Set<string>();

  for (let i = 0; i < words.length; i++) {
    const single = words[i];
    if (single.length >= MIN_TOKEN_LENGTH) candidates.add(single);

    // Joins of adjacent words, with and without hyphens.
    let joined = single;
    for (let span = 1; span < MAX_JOIN_SPAN && i + span < words.length; span++) {
      joined += words[i + span];
      if (joined.length >= MIN_TOKEN_LENGTH && joined.length <= MAX_TOKEN_LENGTH) {
        candidates.add(joined);
      }
    }
  }

  // A hyphenless form of every candidate, since plates and databases disagree on hyphens.
  for (const candidate of [...candidates]) {
    const stripped = candidate.replace(/-/g, '');
    if (stripped.length >= MIN_TOKEN_LENGTH) candidates.add(stripped);
  }

  return [...candidates].filter((t) => t.length <= MAX_TOKEN_LENGTH);
}

/**
 * Expand a token across plausible OCR shape confusions, nearest-first.
 *
 * Breadth-first over substitution count, so a clean read is tested before any correction and
 * the cheapest correction is tested before an expensive one.
 */
export function expandConfusions(token: string): string[] {
  let frontier = [token];
  const seen = new Set(frontier);

  for (let position = 0; position < token.length; position++) {
    const alternatives = CONFUSIONS[token[position]];
    if (!alternatives) continue;

    const next: string[] = [];
    for (const variant of frontier) {
      for (const replacement of alternatives) {
        const mutated =
          variant.slice(0, position) + replacement.toUpperCase() + variant.slice(position + 1);
        if (seen.has(mutated)) continue;
        seen.add(mutated);
        next.push(mutated);
        if (seen.size >= MAX_VARIANTS_PER_TOKEN) return [...seen];
      }
    }
    frontier = [...frontier, ...next];
  }

  return [...seen];
}

/**
 * Search OCR output for a token whose keccak256 equals the registered asset id.
 *
 * Pure and synchronous, so it is unit-testable without a camera or a worker.
 */
export function matchSerial(rawText: string, assetId: Hex): SerialMatch | null {
  const candidates = tokenise(rawText);
  let tested = 0;

  // Clean reads first: a plate that scanned perfectly should never pay for the variant search.
  for (const candidate of candidates) {
    tested++;
    if (keccak256(stringToHex(candidate)) === assetId) {
      return { serial: candidate, hash: assetId, rawText, candidatesTested: tested, corrected: false };
    }
  }

  for (const candidate of candidates) {
    for (const variant of expandConfusions(candidate)) {
      if (variant === candidate) continue;
      tested++;
      if (keccak256(stringToHex(variant)) === assetId) {
        return { serial: variant, hash: assetId, rawText, candidatesTested: tested, corrected: true };
      }
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*                         THE OCR PASS ITSELF                         */
/* ------------------------------------------------------------------ */

type TesseractWorker = {
  recognize: (image: HTMLCanvasElement) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<unknown>;
};

let workerPromise: Promise<TesseractWorker> | null = null;

/**
 * One worker for the page's lifetime — spinning up Tesseract costs a second or two, which is
 * unacceptable inside a three-second sweep.
 */
async function getWorker(): Promise<TesseractWorker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker, PSM } = await import('tesseract.js');
      const worker = await createWorker('eng');
      await worker.setParameters({
        // A serial plate is a single line of uppercase alphanumerics.
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
        tessedit_pageseg_mode: PSM.SINGLE_LINE,
      });
      return worker as unknown as TesseractWorker;
    })();
  }
  return workerPromise;
}

/** Warm the worker while the merchant is still reading the brief, not during the sweep. */
export function preloadOcr(): void {
  void getWorker().catch(() => {
    workerPromise = null;
  });
}

/**
 * Crop the reticle region at the camera's native resolution and binarise it.
 *
 * The parallax engine works at 160×120 because it wants low-frequency structure; OCR needs the
 * opposite, so this samples the full-resolution frame and upscales the crop before thresholding.
 */
export function captureSerialCrop(video: HTMLVideoElement, scale = 3): HTMLCanvasElement {
  const sx = Math.floor(video.videoWidth * SERIAL_RETICLE.x);
  const sy = Math.floor(video.videoHeight * SERIAL_RETICLE.y);
  const sw = Math.floor(video.videoWidth * SERIAL_RETICLE.width);
  const sh = Math.floor(video.videoHeight * SERIAL_RETICLE.height);

  const canvas = document.createElement('canvas');
  canvas.width = sw * scale;
  canvas.height = sh * scale;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new SerialPlateError('ERR_OCR_UNAVAILABLE', 'No 2D context for the OCR crop');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  // Greyscale, then contrast-stretch and threshold. Stamped plates are low-contrast and
  // unevenly lit; a global Otsu-style split reads far better than the raw frame.
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;
  const luma = new Uint8Array(pixels.length / 4);
  let min = 255;
  let max = 0;

  for (let i = 0; i < luma.length; i++) {
    const o = i * 4;
    const value = (0.2126 * pixels[o] + 0.7152 * pixels[o + 1] + 0.0722 * pixels[o + 2]) | 0;
    luma[i] = value;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const span = Math.max(1, max - min);
  let sum = 0;
  for (let i = 0; i < luma.length; i++) sum += ((luma[i] - min) * 255) / span;
  const threshold = sum / luma.length;

  for (let i = 0; i < luma.length; i++) {
    const stretched = ((luma[i] - min) * 255) / span;
    const value = stretched > threshold ? 255 : 0;
    const o = i * 4;
    pixels[o] = pixels[o + 1] = pixels[o + 2] = value;
    pixels[o + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);

  return canvas;
}

/**
 * Read the plate from one or more captured crops and match it against the registered asset.
 *
 * Several crops are tried because a single frame mid-sweep is often motion-blurred; the first
 * one that yields a hash match wins.
 */
export async function readSerialPlate(
  crops: HTMLCanvasElement[],
  assetId: Hex,
): Promise<SerialMatch> {
  let worker: TesseractWorker;
  try {
    worker = await getWorker();
  } catch (cause) {
    throw new SerialPlateError(
      'ERR_OCR_UNAVAILABLE',
      'ERR_OCR_UNAVAILABLE: on-device OCR failed to start',
      cause instanceof Error ? cause.message : undefined,
    );
  }

  const transcripts: string[] = [];
  for (const crop of crops) {
    const { data } = await worker.recognize(crop);
    const text = (data.text ?? '').trim();
    if (text) transcripts.push(text);

    const match = matchSerial(text, assetId);
    if (match) return match;
  }

  const combined = transcripts.join(' ');
  if (!combined) {
    throw new SerialPlateError(
      'ERR_NO_TEXT_READ',
      'ERR_NO_TEXT_READ: no characters were legible on the plate',
      'Hold the serial plate inside the inner box, steady and in focus, and sweep again.',
    );
  }

  // Last attempt across everything read from every frame together.
  const combinedMatch = matchSerial(combined, assetId);
  if (combinedMatch) return combinedMatch;

  throw new SerialPlateError(
    'ERR_SERIAL_NOT_FOUND',
    'ERR_SERIAL_NOT_FOUND: the plate in frame is not this asset',
    'The camera read text, but none of it matches the serial this asset was registered with.',
    combined,
  );
}
