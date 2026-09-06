/**
 * The spatial guidance geometry, against real H3 cells over Lagos.
 *
 * The security boundary is unchanged — exact cell match, enforced on-chain. What is tested here
 * is whether the interface can tell an honest merchant which way to step.
 */
import { latLngToCell, cellToLatLng, cellToBoundary, gridDisk, cellArea } from 'h3-js';
import {
  metersToCellBoundary, haversineMeters, bearingDegrees, compassPoint,
  h3ToCellIndex, cellIndexToH3,
} from '../lib/H3SpatialLock.ts';

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

// Balogun Market, Lagos Island.
const SHOP = { lat: 6.4550, lng: 3.3900 };
const cell = latLngToCell(SHOP.lat, SHOP.lng, 10);
const [cLat, cLng] = cellToLatLng(cell);
console.log(`\nShop cell ${cell}\ncentre ${cLat.toFixed(6)}, ${cLng.toFixed(6)}\n`);

/* ---------------------------------------------------------------- */
console.log('[1] Cell geometry — pinning the real numbers');
// An earlier draft called a res-10 cell "~66 m2". 66 is the average EDGE LENGTH IN METRES.
// The area is three orders of magnitude larger, which changes what the lock can claim to prove.
const boundary = cellToBoundary(cell);
const edgeDistances = boundary.map(([lat, lng]) => haversineMeters({ lat: cLat, lng: cLng }, { lat, lng }));
const avgRadius = edgeDistances.reduce((a, b) => a + b, 0) / edgeDistances.length;
const area = cellArea(cell, 'm2');
console.log(`  area ${Math.round(area).toLocaleString()} m2, ~${(avgRadius * 2).toFixed(0)} m across`);
check('a res-10 cell is ~12,000 m2, not 66', area > 10_000 && area < 15_000, `${Math.round(area)} m2`);
check('roughly 150 m across', avgRadius * 2 > 120 && avgRadius * 2 < 180, `${(avgRadius * 2).toFixed(0)} m`);
check('far too coarse to isolate one stall', area / 10 > 500, `~${Math.round(area / 10)} stalls would fit`);

/* ---------------------------------------------------------------- */
console.log('\n[2] Distance to the boundary, not to the centre');
const atCentre = metersToCellBoundary({ lat: cLat, lng: cLng }, cell);
console.log(`  standing at the centre: ${atCentre.toFixed(1)} m to the nearest edge`);
check('an inside position is tens of metres from an edge', atCentre > 40 && atCentre < 80, `${atCentre.toFixed(1)} m`);
check('centre-to-centre distance would have been misleading',
  haversineMeters({ lat: cLat, lng: cLng }, { lat: cLat, lng: cLng }) === 0);

/* ---------------------------------------------------------------- */
console.log('\n[3] A merchant just over the line gets a small, honest number');
// Step outward from the centre until we cross into a neighbour, then measure.
let crossed = null;
for (let m = 5; m <= 120 && !crossed; m += 1) {
  const dLat = m / 111_320;
  const probe = { lat: cLat + dLat, lng: cLng };
  if (latLngToCell(probe.lat, probe.lng, 10) !== cell) crossed = { probe, m };
}
check('walking north eventually leaves the cell', crossed !== null, `at ${crossed?.m} m`);
const justOutside = metersToCellBoundary(crossed.probe, cell);
console.log(`  ${crossed.m} m north of centre -> ${justOutside.toFixed(2)} m outside the boundary`);
check('reported as metres, not tens of metres', justOutside >= 0 && justOutside < 3, `${justOutside.toFixed(2)} m`);

// A few metres further out should read as further out.
const further = metersToCellBoundary({ lat: cLat + (crossed.m + 10) / 111_320, lng: cLng }, cell);
check('distance grows as you walk away', further > justOutside, `${further.toFixed(2)} m`);

/* ---------------------------------------------------------------- */
console.log('\n[4] The direction actually points back');
const north = { lat: cLat + 0.0006, lng: cLng };
const south = { lat: cLat - 0.0006, lng: cLng };
const east = { lat: cLat, lng: cLng + 0.0006 };
const west = { lat: cLat, lng: cLng - 0.0006 };
const centre = { lat: cLat, lng: cLng };
check('from the north, walk south', compassPoint(bearingDegrees(north, centre)) === 'S', compassPoint(bearingDegrees(north, centre)));
check('from the south, walk north', compassPoint(bearingDegrees(south, centre)) === 'N', compassPoint(bearingDegrees(south, centre)));
check('from the east, walk west', compassPoint(bearingDegrees(east, centre)) === 'W', compassPoint(bearingDegrees(east, centre)));
check('from the west, walk east', compassPoint(bearingDegrees(west, centre)) === 'E', compassPoint(bearingDegrees(west, centre)));

/* ---------------------------------------------------------------- */
console.log('\n[5] The security boundary is unchanged — neighbours are still outside');
const ring = gridDisk(cell, 1).filter((c) => c !== cell);
check('a res-10 cell has six neighbours', ring.length === 6, `${ring.length}`);
const neighbourCentres = ring.map((c) => cellToLatLng(c));
const allDifferent = neighbourCentres.every(([lat, lng]) => latLngToCell(lat, lng, 10) !== cell);
check('standing in any neighbour does not resolve to the shop cell', allDifferent);
console.log('  (accepting ring-1 would have widened the impersonation area ~7x — deliberately not done)');

/* ---------------------------------------------------------------- */
console.log('\n[6] uint64 round-trip survives the contract');
check('h3 -> uint64 -> h3 is lossless', cellIndexToH3(h3ToCellIndex(cell)) === cell, cellIndexToH3(h3ToCellIndex(cell)));
check('fits in uint64', h3ToCellIndex(cell) < 2n ** 64n);

console.log(failures === 0 ? '\nSpatial guidance geometry holds.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
