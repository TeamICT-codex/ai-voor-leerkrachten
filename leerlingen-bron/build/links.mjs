// Controleert interne links (href en src) in de uitvoermap uit cursus.config.json,
// vandaag ../leerlingen (AI-wijs) of ../aiwijs-start (Start). Draai dit na een build.
// Gebruik: node build/links.mjs [--cursus start] [--extern]
import fs from 'node:fs';
import path from 'node:path';
import { kiesCursus } from './cursus.mjs';
const { DIST } = kiesCursus();
if (!fs.existsSync(DIST)) { console.log(`✗ ${DIST} bestaat niet: bouw eerst.`); process.exit(1); }
const walk = (d) => fs.readdirSync(d).flatMap(f => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST).filter(f => f.endsWith('.html'));
let broken = 0, extern = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /(?:href|src)="([^"#]+)(#[^"]*)?"/g; let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:)/.test(url)) { extern.add(url); continue; }
    const target = path.resolve(path.dirname(f), url);
    if (!fs.existsSync(target)) { broken++; console.log(`✗ ${path.relative(DIST, f)} → ${url}`); }
  }
}
console.log(`${files.length} pagina's, ${broken} kapotte interne links, ${extern.size} unieke externe links.`);
if (process.argv.includes('--extern')) [...extern].sort().forEach(u => console.log('  ' + u));
process.exit(broken ? 1 : 0);
