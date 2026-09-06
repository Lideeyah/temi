import { latLngToCell, cellToLatLng, cellToBoundary, getResolution } from 'h3-js';

/** Uber H3 resolution 10 — roughly 66 m² per hexagon, about the footprint of a market stall. */
export const H3_RESOLUTION = 10 as const;

/** A fix worse than this cannot distinguish one stall from its neighbours. */
export const MAX_GPS_ACCURACY_METERS = 100 as const;

export interface SpatialFix {
  /** H3 resolution-10 cell as its canonical 15-character hex string. */
  h3Index: string;
  /** The same cell as a 64-bit integer, which is what `TemiVault` stores. */
  h3CellIndex: bigint;
  latitude: number;
  longitude: number;
  /** Horizontal accuracy of the underlying GPS fix, in metres. */
  accuracy: number;
  /** Centre of the resolved hexagon — never the raw fix, so precise location is not leaked. */
  cellCenter: { lat: number; lng: number };
  timestamp: number;
}

export type SpatialLockErrorCode =
  | 'ERR_GEOLOCATION_UNSUPPORTED'
  | 'ERR_PERMISSION_DENIED'
  | 'ERR_POSITION_UNAVAILABLE'
  | 'ERR_TIMEOUT'
  | 'ERR_ACCURACY_INSUFFICIENT';

export class SpatialLockError extends Error {
  readonly code: SpatialLockErrorCode;
  readonly detail?: string;

  constructor(code: SpatialLockErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'SpatialLockError';
    this.code = code;
    this.detail = detail;
  }
}

/**
 * Convert an H3 cell string into the uint64 the contract stores.
 *
 * An H3 index is already a 64-bit value, so this is a lossless reinterpretation rather than a
 * hash — `cellIndexToH3` reverses it exactly, which is what lets the dashboard render a stored
 * cell back onto a map.
 */
export function h3ToCellIndex(h3Index: string): bigint {
  return BigInt(`0x${h3Index}`);
}

export function cellIndexToH3(cellIndex: bigint): string {
  return cellIndex.toString(16).padStart(15, '0');
}

function describeGeolocationError(error: GeolocationPositionError): SpatialLockError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return new SpatialLockError(
        'ERR_PERMISSION_DENIED',
        'Location permission denied',
        'Tèmi needs the device GPS to bind this shop to a hexagonal cell.',
      );
    case error.POSITION_UNAVAILABLE:
      return new SpatialLockError(
        'ERR_POSITION_UNAVAILABLE',
        'Position unavailable',
        'No GPS fix. Step outside or away from dense roofing and retry.',
      );
    case error.TIMEOUT:
      return new SpatialLockError(
        'ERR_TIMEOUT',
        'Location request timed out',
        'The device could not acquire a fix in time.',
      );
    default:
      return new SpatialLockError('ERR_POSITION_UNAVAILABLE', error.message);
  }
}

/**
 * Acquire a high-accuracy GPS fix and resolve it to an H3 resolution-10 cell.
 *
 * The raw latitude/longitude never reaches the chain: only the hexagon does. That is
 * deliberate — it is enough to prove a claimant is standing at their own shop, and not
 * enough to track them.
 */
export async function acquireSpatialLock(
  options: { timeoutMs?: number; maxAccuracyMeters?: number } = {},
): Promise<SpatialFix> {
  const { timeoutMs = 20_000, maxAccuracyMeters = MAX_GPS_ACCURACY_METERS } = options;

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new SpatialLockError(
      'ERR_GEOLOCATION_UNSUPPORTED',
      'Geolocation unsupported',
      'This browser exposes no geolocation API.',
    );
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => reject(describeGeolocationError(error)), {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 0,
    });
  });

  const { latitude, longitude, accuracy } = position.coords;

  if (accuracy > maxAccuracyMeters) {
    throw new SpatialLockError(
      'ERR_ACCURACY_INSUFFICIENT',
      `GPS accuracy ±${accuracy.toFixed(0)}m exceeds the ±${maxAccuracyMeters}m ceiling`,
      'A weaker fix cannot separate this stall from its neighbours. Move into open sky and retry.',
    );
  }

  const h3Index = latLngToCell(latitude, longitude, H3_RESOLUTION);
  const [centerLat, centerLng] = cellToLatLng(h3Index);

  return {
    h3Index,
    h3CellIndex: h3ToCellIndex(h3Index),
    latitude,
    longitude,
    accuracy,
    cellCenter: { lat: centerLat, lng: centerLng },
    timestamp: position.timestamp,
  };
}

/** Re-sample position at claim time and test it against the cell bound at registration. */
export async function verifySpatialLock(
  boundCellIndex: bigint,
): Promise<{ matches: boolean; fix: SpatialFix; boundH3Index: string }> {
  const fix = await acquireSpatialLock();
  const boundH3Index = cellIndexToH3(boundCellIndex);
  return { matches: fix.h3CellIndex === boundCellIndex, fix, boundH3Index };
}

/** Hexagon outline, for drawing the bound cell on a mini map. */
export function cellOutline(h3Index: string): Array<[number, number]> {
  return cellToBoundary(h3Index) as Array<[number, number]>;
}

export function cellResolution(h3Index: string): number {
  return getResolution(h3Index);
}
