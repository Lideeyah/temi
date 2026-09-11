import { latLngToCell, cellToLatLng, cellToBoundary, getResolution, gridDistance } from 'h3-js';

/**
 * Uber H3 resolution 10 — roughly 12,300 m² per hexagon, about 150 m across.
 *
 * Far larger than a stall, and deliberately so. Consumer GPS on a mid-range Android in a dense
 * market drifts by tens of metres; a cell tight enough to isolate a single stall (resolution 12
 * is ~250 m², ~22 m across) would reject honest claims constantly. The cell proves a claimant is
 * *at the premises*. It is the DisCo meter number, bound into the asset id alongside it, that
 * identifies which unit.
 */
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
        'No reading arrived before the deadline. On a laptop this is usually Location Services being off for the browser — on macOS, System Settings → Privacy & Security → Location Services. A phone fixes in seconds.',
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
  options: {
    timeoutMs?: number;
    maxAccuracyMeters?: number;
    /** Called with each reading's accuracy in metres, so the interface can show it converging. */
    onProgress?: (accuracyMeters: number) => void;
  } = {},
): Promise<SpatialFix> {
  const {
    timeoutMs = 35_000,
    maxAccuracyMeters = MAX_GPS_ACCURACY_METERS,
    onProgress,
  } = options;

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new SpatialLockError(
      'ERR_GEOLOCATION_UNSUPPORTED',
      'Geolocation unsupported',
      'This browser exposes no geolocation API.',
    );
  }

  /*
   * Watch rather than ask once.
   *
   * getCurrentPosition gives one answer and one chance. That suits a phone with a GPS radio,
   * which fixes in a second or two. A laptop has no radio: macOS infers position from surrounding
   * wifi networks, and the first reading is often coarse or absent while it builds a picture,
   * improving over several seconds. Asking once with enableHighAccuracy and a twenty-second
   * ceiling is therefore a coin toss, and when it loses the merchant is told the device "could
   * not acquire a fix in time" — with no indication that it was ten metres from succeeding.
   *
   * So: watch, keep the best reading, stop the moment one is good enough, and if the deadline
   * arrives first, hand the best one onward anyway. The accuracy check below then rejects it by
   * name and number — "±340 m exceeds the ±100 m ceiling" — which is a fact the merchant can act
   * on, where a timeout is not.
   */
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    let best: GeolocationPosition | null = null;
    let settled = false;

    const finish = (act: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      navigator.geolocation.clearWatch(watchId);
      act();
    };

    const timer = setTimeout(
      () =>
        finish(() => {
          if (best) resolve(best);
          else
            reject(
              new SpatialLockError(
                'ERR_TIMEOUT',
                'No position in time',
                'The device returned no reading at all. On a laptop this usually means Location Services is off for this browser — on macOS, System Settings → Privacy & Security → Location Services. A phone will fix in seconds.',
              ),
            );
        }),
      timeoutMs,
    );

    const watchId = navigator.geolocation.watchPosition(
      (reading) => {
        if (!best || reading.coords.accuracy < best.coords.accuracy) best = reading;
        onProgress?.(reading.coords.accuracy);
        if (reading.coords.accuracy <= maxAccuracyMeters) finish(() => resolve(reading));
      },
      (error) => finish(() => reject(describeGeolocationError(error))),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
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


/* ------------------------------------------------------------------ */
/*                     LIVE PROXIMITY GUIDANCE                         */
/* ------------------------------------------------------------------ */

/**
 * Even at ~150 m across, a shop near a cell edge is a real problem: a merchant standing at the
 * back of their own premises can drift across the boundary and be refused a legitimate claim.
 *
 * The tempting fix — accepting the registered cell plus its six neighbours — is the wrong one.
 * It trades a small convenience for a sevenfold increase in the area from which somebody could
 * impersonate a shop. The security boundary stays exactly where it is; what changes is that the
 * merchant can now see it, and see which way to step.
 */

const EARTH_RADIUS_M = 6_371_008.8;
const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export type CompassPoint = (typeof COMPASS_POINTS)[number];

export interface SpatialProximity {
  /** True only when the live fix resolves to the exact registered cell. */
  inside: boolean;
  h3Index: string;
  boundH3Index: string;
  /** Hexagons between the live cell and the bound cell. 1 means simply over the line. */
  gridDistance: number | null;
  /** Metres past the registered cell's boundary. Zero when inside. */
  metersOutside: number;
  /** Direction to walk to get back inside. */
  bearingDeg: number;
  compass: CompassPoint;
  accuracy: number;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRad;
  const dLng = (b.lng - a.lng) * toRad;
  const lat1 = a.lat * toRad;
  const lat2 = b.lat * toRad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Initial bearing from a to b, in degrees clockwise from north. */
export function bearingDegrees(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = Math.PI / 180;
  const lat1 = a.lat * toRad;
  const lat2 = b.lat * toRad;
  const dLng = (b.lng - a.lng) * toRad;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

export function compassPoint(bearing: number): CompassPoint {
  return COMPASS_POINTS[Math.round((bearing % 360) / 45) % 8];
}

/**
 * Shortest distance from a point to the hexagon's edge, in metres.
 *
 * Distance to the cell *centre* would be misleading guidance: at this resolution a merchant
 * standing legitimately inside their own cell is still up to ~33 m from its centre. What they
 * need to know is how far past the boundary they have strayed, which is a point-to-polygon
 * problem, not a point-to-point one.
 *
 * Over a 60 m hexagon the local equirectangular projection is accurate to well under a metre,
 * so the segment maths can be done in plain planar coordinates.
 */
export function metersToCellBoundary(
  point: { lat: number; lng: number },
  h3Index: string,
): number {
  const boundary = cellToBoundary(h3Index) as Array<[number, number]>;
  const latScale = 111_320;
  const lngScale = 111_320 * Math.cos(point.lat * (Math.PI / 180));

  const project = ([lat, lng]: [number, number]) => ({
    x: (lng - point.lng) * lngScale,
    y: (lat - point.lat) * latScale,
  });

  let best = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const a = project(boundary[i]);
    const b = project(boundary[(i + 1) % boundary.length]);

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;

    // Project the origin onto the segment, clamped to its endpoints.
    const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, -(a.x * dx + a.y * dy) / lengthSq));
    const cx = a.x + t * dx;
    const cy = a.y + t * dy;
    best = Math.min(best, Math.hypot(cx, cy));
  }
  return best;
}

function describeProximity(
  position: GeolocationPosition,
  boundCellIndex: bigint,
): SpatialProximity {
  const { latitude, longitude, accuracy } = position.coords;
  const h3Index = latLngToCell(latitude, longitude, H3_RESOLUTION);
  const boundH3Index = cellIndexToH3(boundCellIndex);
  const inside = h3Index === boundH3Index;

  const [centreLat, centreLng] = cellToLatLng(boundH3Index);
  const here = { lat: latitude, lng: longitude };
  const centre = { lat: centreLat, lng: centreLng };

  let distance: number | null = null;
  try {
    distance = gridDistance(h3Index, boundH3Index);
  } catch {
    // h3 refuses across very large separations; the merchant is nowhere near, which is answer
    // enough for the interface.
    distance = null;
  }

  return {
    inside,
    h3Index,
    boundH3Index,
    gridDistance: distance,
    metersOutside: inside ? 0 : metersToCellBoundary(here, boundH3Index),
    bearingDeg: bearingDegrees(here, centre),
    compass: compassPoint(bearingDegrees(here, centre)),
    accuracy,
    latitude,
    longitude,
    timestamp: position.timestamp,
  };
}

/**
 * Watch position and report proximity to the registered cell until the returned function is
 * called. Purely advisory — the authoritative check is still a fresh sample taken at claim time
 * and compared on-chain.
 */
export function watchSpatialProximity(
  boundCellIndex: bigint,
  onUpdate: (proximity: SpatialProximity) => void,
  onError?: (error: SpatialLockError) => void,
): () => void {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    onError?.(
      new SpatialLockError('ERR_GEOLOCATION_UNSUPPORTED', 'Geolocation unsupported'),
    );
    return () => undefined;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onUpdate(describeProximity(position, boundCellIndex)),
    (error) => onError?.(describeGeolocationError(error)),
    { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 },
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
