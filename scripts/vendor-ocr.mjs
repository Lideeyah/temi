/**
 * Vendors the Tesseract runtime into public/tesseract.
 *
 * By default tesseract.js pulls its worker, WASM core and language model from jsdelivr at
 * runtime. Recognition itself is local either way — no image ever leaves the device — but the
 * download is a network round trip, which means OCR fails on a bad connection. A merchant
 * filing an emergency claim in a Lagos market is exactly the person least likely to have one.
 *
 * Serving the runtime from our own origin makes the claim path work offline after first load,
 * and removes the last third-party fetch from the attestation pipeline.
 *
 * Run: npm run vendor:ocr
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'tesseract');
fs.mkdirSync(OUT, { recursive: true });

/*
 * Every core variant the worker may ask for.
 *
 * tesseract.js picks its core at runtime by feature-detecting the browser, then importScripts the
 * one it chose. Vendoring only the SIMD and plain builds worked until a browser reported support
 * for relaxed SIMD — Chrome does — at which point it reached for a file that had never been
 * copied and the worker died with a bare NetworkError, several layers below anything that could
 * explain itself.
 *
 * The cost of guessing wrong is a dead camera; the cost of copying all three is disk. Copy all
 * three.
 */
const CORES = ['tesseract-core-relaxedsimd-lstm', 'tesseract-core-simd-lstm', 'tesseract-core-lstm'];

const copies = [
  ['node_modules/tesseract.js/dist/worker.min.js', 'worker.min.js'],
  ...CORES.flatMap((core) => [
    [`node_modules/tesseract.js-core/${core}.wasm.js`, `${core}.wasm.js`],
    [`node_modules/tesseract.js-core/${core}.wasm`, `${core}.wasm`],
  ]),
];

for (const [from, to] of copies) {
  const src = path.join(process.cwd(), from);
  if (!fs.existsSync(src)) {
    console.warn(`  skip (missing): ${from}`);
    continue;
  }
  fs.copyFileSync(src, path.join(OUT, to));
  console.log(`  ${to.padEnd(38)} ${(fs.statSync(src).size / 1024).toFixed(0)} KB`);
}

// The English model is not an npm dependency; fetch it once and vendor it.
const LANG_URL = 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng@1.0.0/4.0.0_best_int/eng.traineddata.gz';
const langOut = path.join(OUT, 'eng.traineddata.gz');

if (fs.existsSync(langOut)) {
  console.log(`  eng.traineddata.gz (cached)            ${(fs.statSync(langOut).size / 1024).toFixed(0)} KB`);
} else {
  process.stdout.write('  fetching eng.traineddata.gz … ');
  const response = await fetch(LANG_URL);
  if (!response.ok) throw new Error(`language model download failed: ${response.status}`);
  fs.writeFileSync(langOut, Buffer.from(await response.arrayBuffer()));
  console.log(`${(fs.statSync(langOut).size / 1024).toFixed(0)} KB`);
}

console.log('\nTesseract runtime vendored to public/tesseract — OCR now works offline.');
