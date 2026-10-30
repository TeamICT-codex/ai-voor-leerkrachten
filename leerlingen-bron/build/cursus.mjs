// Welke cursus bouwen of controleren we? Alle scripts in build/ vragen het hier.
//
// Zonder parameter is het AI-wijs op school: de bron staat rechtstreeks in
// leerlingen-bron/ (content/ en cursus.config.json). Met --cursus start is het
// AI-wijs Start, voor de eerste graad: de bron staat in leerlingen-bron/start/.
// Beide delen de generator, assets/ en de controles.
//
//   node build/build.mjs                  AI-wijs op school
//   node build/build.mjs --cursus start   AI-wijs Start
//   node build/build.mjs --bron <map>     een kopie van een cursus ergens anders,
//                                         bv. om de generator te testen
//
// De uitvoermap staat in de cursus.config.json van elke cursus, relatief tegenover
// die config: voor AI-wijs ../leerlingen, voor Start ../../aiwijs-start.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BRONROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ASSETS = path.join(BRONROOT, 'assets');

// De cursussen in deze repo, met hun bronmap tegenover leerlingen-bron/.
export const CURSUSSEN = { aiwijs: '.', start: 'start' };

function leesConfig(bron) {
  const p = path.join(bron, 'cursus.config.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function maakCursus(naam, bron) {
  const config = leesConfig(bron);
  if (!config) { console.error(`Geen cursus.config.json gevonden in ${bron}.`); process.exit(1); }
  return {
    naam,
    BRON: bron,
    CONTENT: path.join(bron, 'content'),
    config,
    DIST: path.resolve(bron, config.uitvoermap || 'dist'),
  };
}

function waardeVan(argv, vlag) {
  const i = argv.findIndex(a => a === vlag || a.startsWith(vlag + '='));
  if (i < 0) return null;
  const w = argv[i].includes('=') ? argv[i].slice(vlag.length + 1) : argv[i + 1];
  if (!w || w.startsWith('--')) { console.error(`${vlag} vraagt een waarde.`); process.exit(1); }
  return w;
}

// Leest --cursus (of --bron) uit de opdrachtregel en geeft de gekozen cursus terug.
export function kiesCursus(argv = process.argv.slice(2)) {
  const bron = waardeVan(argv, '--bron');
  if (bron) return maakCursus('eigen', path.resolve(bron));
  const naam = waardeVan(argv, '--cursus') || 'aiwijs';
  if (!CURSUSSEN[naam]) {
    console.error(`Onbekende cursus "${naam}". Kies uit: ${Object.keys(CURSUSSEN).join(', ')}.`);
    process.exit(1);
  }
  return maakCursus(naam, path.resolve(BRONROOT, CURSUSSEN[naam]));
}

// De uitvoermappen van de andere cursussen in deze repo. De build maakt zijn eigen
// uitvoermap leeg, dus die mag nooit in of boven de uitvoer van een andere cursus liggen.
export function andereUitvoermappen(cursus) {
  const uit = [];
  for (const [naam, rel] of Object.entries(CURSUSSEN)) {
    const bron = path.resolve(BRONROOT, rel);
    if (bron === cursus.BRON) continue;
    const config = leesConfig(bron);
    if (config) uit.push({ naam, DIST: path.resolve(bron, config.uitvoermap || 'dist') });
  }
  return uit;
}

// Wat niet met -- begint en geen waarde van een vlag is, bv. de poort van serve.mjs.
export function losseArgumenten(argv = process.argv.slice(2)) {
  const uit = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cursus' || argv[i] === '--bron') { i++; continue; }
    if (!argv[i].startsWith('--')) uit.push(argv[i]);
  }
  return uit;
}
