/**
 * Validates the motion-parallax discriminator on synthetic scenes with known ground truth.
 * Run: node tests/parallax.test.mjs
 */
import { measureTransition, scoreParallax, isCoplanar, computeJitterSigma } from '../lib/SpatialSweepEngine.ts';

const W = 160, H = 120;

/** Deterministic textured field so runs are reproducible. */
function texture(x, y, seed) {
  const a = Math.sin((x * 12.9898 + y * 78.233 + seed) * 0.5) * 43758.5453;
  return 128 + 90 * Math.sin(x * 0.31 + seed) * Math.cos(y * 0.17 + seed) + 30 * ((a - Math.floor(a)) - 0.5);
}

/**
 * Render a frame. `depthShift(qx,qy)` returns the horizontal displacement applied to that
 * quadrant — this is what physically distinguishes a 3D scene from a flat plane.
 */
function frame(t, depthShift) {
  const luma = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const qx = x < W / 2 ? 0 : 1;
      const qy = y < H / 2 ? 0 : 1;
      const sx = x - depthShift(qx, qy) * t;
      luma[y * W + x] = texture(sx, y, 7);
    }
  }
  return { t: t * 1500, webp: '', luma, width: W, height: H };
}

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (!cond) failures++;
};

// ---------------------------------------------------------------- //
console.log('\n[1] Real 3D scene — near objects sweep faster than far ones');
// Quadrant shifts differ: foreground (bottom) moves 6px/step, background (top) 2px/step.
const scene3d = (qx, qy) => (qy === 1 ? 6.0 : 2.0) + qx * 0.8;
const t3d = [
  measureTransition(frame(0, scene3d), frame(1, scene3d), 22),
  measureTransition(frame(1, scene3d), frame(2, scene3d), 21),
];
const score3d = scoreParallax(t3d);
console.log(`  spread: ${t3d.map(t => t.disparitySpreadPx.toFixed(2)).join(', ')} px`);
console.log(`  meanAbsShift: ${t3d.map(t => t.meanAbsShiftPx.toFixed(2)).join(', ')} px`);
console.log(`  parallaxScore: ${score3d}`);
check('3D scene scores >= 850', score3d >= 850, `got ${score3d}`);
check('3D scene not flagged coplanar', !isCoplanar(t3d));

// ---------------------------------------------------------------- //
console.log('\n[2] Flat screen / photograph — one uniform homography, no depth term');
const flat = () => 5.0; // every quadrant translates identically
const tFlat = [
  measureTransition(frame(0, flat), frame(1, flat), 22),
  measureTransition(frame(1, flat), frame(2, flat), 21),
];
const scoreFlat = scoreParallax(tFlat);
console.log(`  spread: ${tFlat.map(t => t.disparitySpreadPx.toFixed(3)).join(', ')} px`);
console.log(`  meanAbsShift: ${tFlat.map(t => t.meanAbsShiftPx.toFixed(2)).join(', ')} px`);
console.log(`  parallaxScore: ${scoreFlat}`);
check('flat screen scores < 850', scoreFlat < 850, `got ${scoreFlat}`);
check('flat screen flagged coplanar', isCoplanar(tFlat));

// ---------------------------------------------------------------- //
console.log('\n[3] Static camera — no pan at all');
const still = () => 0;
const tStill = [
  measureTransition(frame(0, still), frame(1, still), 0.4),
  measureTransition(frame(1, still), frame(2, still), 0.3),
];
const scoreStill = scoreParallax(tStill);
console.log(`  parallaxScore: ${scoreStill}`);
check('static camera scores < 850', scoreStill < 850, `got ${scoreStill}`);

// ---------------------------------------------------------------- //
console.log('\n[4] Replayed video on a screen — image motion present, phone not rotating');
const tSpoof = [
  measureTransition(frame(0, flat), frame(1, flat), 0.2),
  measureTransition(frame(1, flat), frame(2, flat), 0.2),
];
check('screen-replay spoof rejected', scoreParallax(tSpoof) < 850, `got ${scoreParallax(tSpoof)}`);

// ---------------------------------------------------------------- //
console.log('\n[5] Accelerometer tremor gate');
const resting = Array.from({ length: 180 }, (_, i) => {
  const n = Math.sin(i * 1.7) * 0.002;
  return { t: i * 16, x: 0, y: 0, z: 9.81 + n, magnitude: 9.81 + n };
});
const handheld = Array.from({ length: 180 }, (_, i) => {
  const n = Math.sin(i * 0.9) * 0.35 + Math.sin(i * 3.1) * 0.18;
  return { t: i * 16, x: n, y: 0, z: 9.81, magnitude: 9.81 + n };
});
const sigRest = computeJitterSigma(resting);
const sigHand = computeJitterSigma(handheld);
console.log(`  resting sigma:  ${sigRest.toFixed(5)}  -> jitterVariance ${Math.round(sigRest * 10000)}`);
console.log(`  handheld sigma: ${sigHand.toFixed(5)}  -> jitterVariance ${Math.round(sigHand * 10000)}`);
check('resting device below 0.01 floor', sigRest < 0.01);
check('handheld device above 0.01 floor', sigHand >= 0.01);
check('handheld passes contract gate (>=100)', Math.round(sigHand * 10000) >= 100);
check('resting fails contract gate (<100)', Math.round(sigRest * 10000) < 100);

console.log(failures === 0 ? '\nAll parallax + tremor assertions passed.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
