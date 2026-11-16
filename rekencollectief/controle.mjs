// Kijkt de rekentoren na zonder browser: elke plek uit plekken.js heeft een
// voorwerp in het tafereel (een aanroep plek('id', 'kamer', ...) in toren.js) in
// de juiste kamer, en omgekeerd; elk hoofdstuk en elk label in index.html heeft
// een kader voor de camera; elke kamer heeft een regel in het verhaal; en het
// adres van de app staat alleen in plekken.js (ADRES).
// Een tikfout in een id valt op de pagina anders stil weg: een bolletje zonder
// tekst, of een hoofdstuk waar de camera niet heen gaat.
// Draai vanuit de root van de repo: node rekencollectief/controle.mjs
// (Bewust niet in test/tests.json: de aantallen daar staan op meerdere plekken vast.)
import { PLEKKEN, KAMERS, ADRES, VERHAAL_REGELS } from './plekken.js';
import { readFileSync, readdirSync } from 'node:fs';

const lees = naam => readFileSync(new URL('./' + naam, import.meta.url), 'utf8');
const toren = lees('toren.js'), pagina = lees('index.html');
const fouten = [];
const fout = (...t) => fouten.push(t.join(' '));

// ── de plekken: tekst en voorwerp ──
const inTafereel = new Map([...toren.matchAll(/\bplek\('([a-z0-9-]+)', '([a-z]+)'/g)].map(m => [m[1], m[2]]));
const gezien = new Set();
for (const p of PLEKKEN) {
  if (gezien.has(p.id)) fout('FOUT dubbele plek', p.id);
  gezien.add(p.id);
  if (!p.titel || !p.tekst) fout('FOUT plek', p.id, 'mist een titel of tekst');
  if (!KAMERS[p.kamer]) fout('FOUT plek', p.id, 'staat in een onbekende kamer', p.kamer);
  if (!inTafereel.has(p.id)) fout('FOUT plek', p.id, 'heeft geen voorwerp (bolletje) in toren.js');
  else if (inTafereel.get(p.id) !== p.kamer) fout('FOUT plek', p.id, 'staat in plekken.js in', p.kamer, 'maar in toren.js in', inTafereel.get(p.id));
}
for (const id of inTafereel.keys()) if (!gezien.has(id)) fout('FOUT voorwerp', id, 'in toren.js heeft geen tekst in plekken.js');
for (const k of Object.keys(KAMERS)) if (!PLEKKEN.some(p => p.kamer === k)) fout('FOUT kamer', k, 'heeft geen enkele plek');

// ── de kaders: elk hoofdstuk en elk label een kader voor de camera ──
const kaderBlok = toren.match(/\n    kaders: \{([\s\S]*?)\n    \},/);
if (!kaderBlok) fout('FOUT geen blok "kaders" gevonden in toren.js');
const kaders = new Set(kaderBlok ? [...kaderBlok[1].matchAll(/^ {6}([a-z]+):/gm)].map(m => m[1]) : []);
const hoofdstukken = [...pagina.matchAll(/<section class="hoofdstuk[^"]*"[^>]*data-kamer="([a-z]+)"/g)].map(m => m[1]);
if (!hoofdstukken.length) fout('FOUT geen hoofdstukken gevonden in index.html');
for (const h of hoofdstukken) if (!kaders.has(h)) fout('FOUT hoofdstuk', h, 'heeft geen kader in toren.js');
for (const k of Object.keys(KAMERS)) if (!hoofdstukken.includes(k)) fout('FOUT kamer', k, 'heeft geen hoofdstuk in index.html');
const labels = [...pagina.matchAll(/class="label" data-kamer="([a-z]+)"/g)].map(m => m[1]);
for (const l of labels) if (!kaders.has(l)) fout('FOUT label', l, 'heeft geen kader in toren.js');
for (const k of Object.keys(KAMERS)) if (!labels.includes(k)) fout('FOUT kamer', k, 'heeft geen label naast de toren');
for (const k of new Set(PLEKKEN.map(p => p.kamer))) if (!pagina.includes(`class="punten" data-kamer="${k}"`)) fout('FOUT kamer', k, 'heeft geen lijst met de bolletjes in zijn hoofdstuk');

// ── de zaalmodus: elke kamer zit in de wissel, en elk kader van de wissel bestaat ──
const wissel = toren.match(/zaalVolgorde: \['overzicht', \.\.\.KAMERS\]/) ? ['overzicht', ...Object.keys(KAMERS)] : null;
if (!wissel) fout('FOUT zaalVolgorde in toren.js is niet meer [\'overzicht\', ...KAMERS]: pas controle.mjs mee aan');
for (const k of wissel || []) if (!kaders.has(k)) fout('FOUT de zaalmodus toont', k, 'maar daar is geen kader voor');

// ── het verhaal: een regel per stap ──
const stappen = [...toren.matchAll(/\{ t: [\d.]+, stap: '([a-z]+)' \}/g)].map(m => m[1]);
if (!stappen.length) fout('FOUT geen tijdlijn VERHAAL gevonden in toren.js');
for (const s of stappen) if (s !== 'slot' && !VERHAAL_REGELS[s]) fout('FOUT stap', s, 'van het verhaal heeft geen regel in VERHAAL_REGELS');
for (const k of Object.keys(KAMERS)) if (!stappen.includes(k)) fout('FOUT kamer', k, 'zit niet in het verhaal');

// ── het adres van de app staat op één plek ──
if (!/^https:\/\//.test(ADRES)) fout('FOUT ADRES is geen https-adres:', ADRES);
const host = new URL(ADRES).host;
for (const naam of readdirSync(new URL('./', import.meta.url))) {
  if (!/\.(js|mjs|html|css)$/.test(naam) || naam === 'plekken.js' || naam === 'controle.mjs') continue;
  if (lees(naam).includes(host)) fout('FOUT', naam, 'noemt het adres van de app zelf; gebruik ADRES uit plekken.js');
}

for (const f of fouten) console.log(f);
console.log(fouten.length ? `FOUT: ${fouten.length} fout(en), NIET OK`
  : `${PLEKKEN.length} plekken, ${hoofdstukken.length} hoofdstukken, ${kaders.size} kaders, ${stappen.length} stappen in het verhaal: alles OK`);
process.exitCode = fouten.length ? 1 : 0;
