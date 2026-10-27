// Controleert de vaste personages in content/ tegen de tabel in docs/leercollectief.md.
// Gebruik: node build/personages.mjs   (exit code 1 bij fouten)
//
// Waarom dit bestaat: elf fictieve leerlingen lopen door negen hoofdstukken, elk met
// één school, één jaar en één richting. Zet één les Senne in het vijfde jaar of Lotte
// op de verkeerde school, dan valt dat bij het lezen niet op maar bij een leerling van
// die school wel. De tabel in docs/leercollectief.md is de enige bron van waarheid;
// dit script leest ze uit en legt ze naast elke alinea waarin een personage voorkomt.
//
// De controle is bewust voorzichtig: ze kijkt per alinea, en alleen wanneer er precies
// één personage in staat. Een alinea met twee namen is dubbelzinnig en wordt geteld als
// "niet gecontroleerd" in plaats van als fout.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const CONTEXTBLAD = path.join(ROOT, 'docs', 'leercollectief.md');

const JAARWOORD = {
  eerste: 1, tweede: 2, derde: 3, vierde: 4, vijfde: 5, zesde: 6, zevende: 7,
};

function jaarUit(tekst) {
  const uit = new Set();
  for (const m of tekst.matchAll(/\b([1-7])(?:de|ste)\s+jaar\b/gi)) uit.add(Number(m[1]));
  for (const m of tekst.matchAll(/\b(eerste|tweede|derde|vierde|vijfde|zesde|zevende)\s+jaar\b/gi))
    uit.add(JAARWOORD[m[1].toLowerCase()]);
  return [...uit];
}

// De twee tabellen uit het contextblad lezen: eerst de scholen, dan de personages.
function leesContextblad() {
  const regels = fs.readFileSync(CONTEXTBLAD, 'utf8').split(/\r?\n/);
  const scholen = [];
  const personages = [];
  for (const regel of regels) {
    // De schoolrij van TAL draagt een afkorting achter de vetgedrukte naam
    // ("**GO! technisch atheneum Lokeren** (TAL)"), dus laat tekst na de ** toe.
    const m = regel.match(/^\|\s*\*\*([^*]+)\*\*[^|]*\|\s*([^|]*)\|\s*([^|]*)\|/);
    if (!m) continue;
    const naam = m[1].trim();
    const tweede = m[2].trim();
    const derde = m[3].trim();
    if (naam.startsWith('GO!')) {
      scholen.push(naam);
      continue;
    }
    // Personagerij: | **Noor** | GO! atheneum Dendermonde | 5de jaar, humane wetenschappen (doorstroom) | ... |
    // De schoolkolom draagt er soms de gemeente of de vestiging bij ("GO! atheneum MiRA,
    // Hamme"); de officiële naam is wat er in de scholentabel hierboven staat.
    const jaren = jaarUit(derde);
    if (!tweede.startsWith('GO!') || jaren.length !== 1) continue;
    const officieel = scholen
      .filter((s) => tweede.startsWith(s))
      .sort((a, b) => b.length - a.length)[0];
    personages.push({
      naam,
      school: officieel || tweede,
      schoolVoluit: tweede,
      jaar: jaren[0],
      richting: derde,
    });
  }
  return { scholen, personages };
}

const { scholen, personages } = leesContextblad();
const fouten = [];
const waarschuwingen = [];

if (personages.length < 5) {
  console.log('✗ de personagetabel in docs/leercollectief.md is niet gelezen (' + personages.length + ' rijen)');
  process.exit(1);
}

const opNaam = new Map(personages.map((p) => [p.naam, p]));
const naamRegex = new RegExp('\\b(' + personages.map((p) => p.naam).join('|') + ')\\b', 'g');
// De langste schoolnaam eerst, anders matcht "GO! talent" binnen een langere naam.
const scholenGesorteerd = [...scholen].sort((a, b) => b.length - a.length);

function scholenUit(tekst) {
  const uit = new Set();
  let rest = tekst;
  for (const s of scholenGesorteerd) {
    if (rest.includes(s)) {
      uit.add(s);
      rest = rest.split(s).join(' ');
    }
  }
  return [...uit];
}

function bestanden(map, uit = []) {
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    if (e.isDirectory()) bestanden(p, uit);
    else if (e.name.endsWith('.md')) uit.push(p);
  }
  return uit;
}

let gecontroleerd = 0;
let dubbelzinnig = 0;
const gezien = new Map();

for (const bestand of bestanden(CONTENT).sort()) {
  const id = path.relative(CONTENT, bestand).split(path.sep).join('/');
  const ruw = fs.readFileSync(bestand, 'utf8');
  // Links en code eruit: daar staan geen personages in, wel woorden die erop lijken.
  const tekst = ruw.replace(/```[\s\S]*?```/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ');

  for (const alinea of tekst.split(/\n\s*\n/)) {
    const namen = [...new Set([...alinea.matchAll(naamRegex)].map((m) => m[1]))];
    if (!namen.length) continue;
    for (const n of namen) gezien.set(n, (gezien.get(n) || 0) + 1);
    if (namen.length > 1) { dubbelzinnig++; continue; }

    const p = opNaam.get(namen[0]);
    const jaren = jaarUit(alinea);
    const gevonden = scholenUit(alinea);
    if (!jaren.length && !gevonden.length) continue;
    gecontroleerd++;

    for (const j of jaren)
      if (j !== p.jaar)
        fouten.push(`${id}: ${p.naam} staat in het ${j}de jaar, de tabel zegt het ${p.jaar}de jaar`);
    for (const s of gevonden)
      if (s !== p.school)
        fouten.push(`${id}: ${p.naam} staat op ${s}, de tabel zegt ${p.school}`);
  }
}

// Een personage dat nergens voorkomt, is een tabelrij die niemand gebruikt.
for (const p of personages)
  if (!gezien.has(p.naam)) waarschuwingen.push(`${p.naam} staat in de tabel maar in geen enkele les`);

console.log(
  `Personages: ${personages.length} in de tabel, ${scholen.length} scholen, ` +
    `${gecontroleerd} alinea's met jaar of school gecontroleerd, ${dubbelzinnig} met meerdere namen overgeslagen.`
);
console.log('Voorkomens: ' + [...gezien.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join(', '));

if (waarschuwingen.length) {
  console.log(`\nWaarschuwingen (${waarschuwingen.length}):`);
  waarschuwingen.forEach((w) => console.log('  - ' + w));
}
if (fouten.length) {
  console.log(`\nFouten (${fouten.length}):`);
  fouten.forEach((f) => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('\nGeen fouten.');
