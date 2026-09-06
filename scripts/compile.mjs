import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';

const ROOT = process.cwd();
const CONTRACTS = path.join(ROOT, 'contracts');
const OUT = path.join(ROOT, 'artifacts');

const sources = {};
for (const f of fs.readdirSync(CONTRACTS).filter((f) => f.endsWith('.sol'))) {
  sources[f] = { content: fs.readFileSync(path.join(CONTRACTS, f), 'utf8') };
}

const input = {
  language: 'Solidity',
  sources,
  settings: {
    optimizer: { enabled: true, runs: 200 },
    viaIR: true,
    outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object'] } },
  },
};

function findImports(p) {
  const full = path.join(CONTRACTS, path.basename(p));
  if (fs.existsSync(full)) return { contents: fs.readFileSync(full, 'utf8') };
  return { error: 'File not found: ' + p };
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

let fatal = false;
for (const e of output.errors ?? []) {
  if (e.severity === 'error') { fatal = true; console.error(e.formattedMessage); }
  else console.warn(e.formattedMessage);
}
if (fatal) process.exit(1);

fs.mkdirSync(OUT, { recursive: true });
for (const [file, contracts] of Object.entries(output.contracts ?? {})) {
  for (const [name, c] of Object.entries(contracts)) {
    const bc = c.evm?.bytecode?.object ?? '';
    fs.writeFileSync(
      path.join(OUT, `${name}.json`),
      JSON.stringify({ contractName: name, sourceName: file, abi: c.abi, bytecode: bc ? '0x' + bc : '0x' }, null, 2)
    );
    const size = (c.evm?.deployedBytecode?.object ?? '').length / 2;
    if (size > 0) console.log(`  ${name.padEnd(22)} ${String(size).padStart(6)} bytes deployed`);
  }
}
console.log(`\nCompiled with solc ${solc.version()}`);
