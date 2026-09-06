import fs from 'node:fs';
import path from 'node:path';
const OUT = path.join(process.cwd(), 'lib', 'abi');
fs.mkdirSync(OUT, { recursive: true });
const want = { TemiVault: 'temiVault', TemiSourcePortal: 'temiSourcePortal', INativeQueryVerifier: 'nativeQueryVerifier' };
const index = [];
for (const [name, varName] of Object.entries(want)) {
  const p = path.join(process.cwd(), 'artifacts', `${name}.json`);
  if (!fs.existsSync(p)) { console.warn('missing artifact', name); continue; }
  const { abi, bytecode } = JSON.parse(fs.readFileSync(p, 'utf8'));
  const body =
    `// Generated from contracts/${name}.sol by scripts/gen-abi.mjs — do not edit by hand.\n` +
    `export const ${varName}Abi = ${JSON.stringify(abi, null, 2)} as const;\n` +
    (bytecode && bytecode !== '0x' ? `\nexport const ${varName}Bytecode = ${JSON.stringify(bytecode)} as const;\n` : '');
  fs.writeFileSync(path.join(OUT, `${varName}.ts`), body);
  index.push(`export * from './${varName}';`);
}
fs.writeFileSync(path.join(OUT, 'index.ts'), index.join('\n') + '\n');
console.log('wrote lib/abi/{' + Object.values(want).join(',') + '}.ts');
