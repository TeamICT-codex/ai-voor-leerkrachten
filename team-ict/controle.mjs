// Kijkt de gegevens van de informatielaag na: het logboek (nieuws.js) tegen de
// labels (labels.js) en de dossiers, en elke "Toon in de raket" tegen de plekken.
// Een tikfout in een label of een id valt op de pagina anders stil weg: een bericht
// dat voor niemand lijkt te gelden, een link die nergens naartoe gaat.
// Draai vanuit de root van de repo: node team-ict/controle.mjs
// (Draait ook mee in de nodetests, als T162.)
import { NIEUWS } from './nieuws.js';
import { ROLLEN, NIVEAUS, SCHOLEN, SCHOOLGROEPEN, THEMAS, SOORTEN } from './labels.js';
import * as I from './informatie.js';
import { PLEKKEN } from './plekken.js';
import { readFileSync } from 'node:fs';

const fouten = [];
const fout = (...t) => fouten.push(t.join(' '));
const ids = lijst => new Set(lijst.map(x => x.id));
const ROL = ids(ROLLEN), NIVEAU = ids(NIVEAUS), SCHOOL = ids(SCHOLEN), THEMA = ids(THEMAS), SOORT = ids(SOORTEN);
const DOSSIER = ids(I.HANGIJZERS), PLEK = ids(PLEKKEN);
// Een toon met # wijst naar een hoofdstuk van de pagina.
const pagina = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const HOOFDSTUKKEN = new Set([...pagina.matchAll(/<section class="hoofdstuk[^"]*" id="([^"]+)"/g)].map(m => '#' + m[1]));

// ── de labels zelf ──
for (const [naam, lijst] of Object.entries({ ROLLEN, NIVEAUS, SCHOLEN, THEMAS, SOORTEN })) {
  const gezien = new Set();
  for (const x of lijst) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(x.id || '')) fout('FOUT', naam, 'ongeldige id', JSON.stringify(x.id));
    if (gezien.has(x.id)) fout('FOUT', naam, 'dubbele id', x.id);
    gezien.add(x.id);
    if (!x.naam) fout('FOUT', naam, x.id, 'zonder naam');
  }
}
for (const s of SCHOLEN) {
  if (!s.kort || !s.waar) fout('FOUT school', s.id, 'mist kort of waar');
  if (!s.niveaus?.length) fout('FOUT school', s.id, 'zonder niveau');
  for (const n of s.niveaus || []) if (!NIVEAU.has(n)) fout('FOUT school', s.id, 'onbekend niveau', n);
  // Elke school moet in de keuzelijst "Mijn school" in een groep vallen.
  if (!SCHOOLGROEPEN.some(g => g.niveaus.some(n => s.niveaus.includes(n)))) fout('FOUT school', s.id, 'valt in geen enkele schoolgroep');
}
for (const r of ROLLEN) if (!r.ik || !r.wie) fout('FOUT rol', r.id, 'mist ik of wie');
for (const h of I.HANGIJZERS) if (!h.label) fout('FOUT hangijzer', h.id, 'zonder label (de naam van het dossier)');

// ── de berichten ──
const datum = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const dag = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
// Een dag speling: de controle kan in een andere tijdzone draaien.
const MORGEN = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
const geldig = d => !Number.isNaN(Date.parse(d)) && new Date(d).toISOString().startsWith(d);
const VELDEN = new Set(['id', 'datum', 'titel', 'tekst', 'thema', 'soort', 'voor', 'niveaus', 'scholen', 'tegen', 'taak', 'op', 'tot', 'dossier', 'toon', 'link', 'vervangt', 'bijgewerkt']);
const perId = new Map();
for (const n of NIEUWS) {
  const wie = `bericht ${n.id || '(zonder id)'}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.id || '')) fout('FOUT', wie, 'ongeldige id: alleen kleine letters, cijfers en streepjes');
  if (perId.has(n.id)) fout('FOUT', wie, 'dubbele id');
  perId.set(n.id, n);
  for (const k of Object.keys(n)) if (!VELDEN.has(k)) fout('FOUT', wie, 'onbekend veld', k, '(tikfout?)');
  if (!datum.test(n.datum || '') || !geldig(n.datum.length === 7 ? n.datum + '-01' : n.datum)) fout('FOUT', wie, 'ongeldige datum', n.datum);
  if (!n.titel || !n.tekst) fout('FOUT', wie, 'mist titel of tekst');
  if (!n.thema?.length) fout('FOUT', wie, 'zonder thema');
  for (const t of n.thema || []) if (!THEMA.has(t)) fout('FOUT', wie, 'onbekend thema', t);
  if (n.soort !== undefined && !SOORT.has(n.soort)) fout('FOUT', wie, 'onbekende soort', n.soort);
  for (const r of n.voor || []) if (!ROL.has(r)) fout('FOUT', wie, 'onbekende rol', r);
  for (const x of n.niveaus || []) if (!NIVEAU.has(x)) fout('FOUT', wie, 'onbekend niveau', x);
  for (const s of n.scholen || []) if (!SCHOOL.has(s)) fout('FOUT', wie, 'onbekende school', s);
  for (const veld of ['voor', 'niveaus', 'scholen', 'thema', 'vervangt']) {
    if (n[veld] !== undefined && (!Array.isArray(n[veld]) || !n[veld].length)) fout('FOUT', wie, veld, 'moet een niet-lege lijst zijn (of weg)');
  }
  // Een school en een niveau dat die school niet heeft: dan ziet niemand van die school het.
  if (n.scholen?.length && n.niveaus?.length) {
    for (const s of n.scholen) {
      const school = SCHOLEN.find(x => x.id === s);
      if (school && !n.niveaus.some(x => school.niveaus.includes(x))) fout('FOUT', wie, 'school', s, 'heeft geen van de niveaus', n.niveaus.join(', '));
    }
  }
  for (const veld of ['tegen', 'op', 'tot', 'bijgewerkt']) {
    if (n[veld] !== undefined && (!dag.test(n[veld]) || !geldig(n[veld]))) fout('FOUT', wie, veld, 'moet een volledige datum zijn (JJJJ-MM-DD):', n[veld]);
  }
  if (n.soort === 'actie' && !(n.tegen && n.taak)) fout('FOUT', wie, 'een actie vraagt tegen (uiterste datum) en taak');
  if (n.soort === 'onderbreking' && !n.op) fout('FOUT', wie, 'een onderbreking vraagt op (de dag)');
  if (n.taak && !n.tegen && !n.op) fout('FOUT', wie, 'taak zonder tegen of op: dan staat ze nergens in de agenda');
  if (n.tot && !n.op) fout('FOUT', wie, 'tot zonder op');
  if (n.tot && n.op && n.tot < n.op) fout('FOUT', wie, 'tot ligt voor op');
  if (n.bijgewerkt && n.bijgewerkt < n.datum) fout('FOUT', wie, 'bijgewerkt ligt voor de datum');
  // Een tikfout in het jaar laat de pagina stil breken: een bericht uit de toekomst
  // wordt een eigen schooljaar (het lopende klapt dicht) en blijft een jaar "nieuw";
  // een uiterste datum voor de aankondiging valt meteen uit de agenda.
  if (n.tegen && n.tegen < n.datum) fout('FOUT', wie, 'tegen ligt voor de datum van het bericht (tikfout in het jaar?)');
  for (const veld of ['datum', 'bijgewerkt']) {
    if (n[veld] && n[veld] > MORGEN) fout('FOUT', wie, veld, 'ligt in de toekomst:', n[veld], '(tikfout in het jaar?)');
  }
  if (n.dossier !== undefined && !DOSSIER.has(n.dossier)) fout('FOUT', wie, 'onbekend dossier', n.dossier, '(een id uit HANGIJZERS)');
  if (n.toon !== undefined && !(PLEK.has(n.toon) || HOOFDSTUKKEN.has(n.toon))) fout('FOUT', wie, 'toon wijst nergens naartoe:', n.toon);
  if (n.link !== undefined && !(n.link?.tekst && /^https:\/\//.test(n.link?.url || ''))) fout('FOUT', wie, 'link vraagt tekst en een https-adres');
}
for (const n of NIEUWS) {
  for (const oud of n.vervangt || []) {
    const o = perId.get(oud);
    if (!o) fout('FOUT', `bericht ${n.id}`, 'vervangt een onbekend bericht', oud);
    else if (o.datum > n.datum) fout('FOUT', `bericht ${n.id}`, 'vervangt een nieuwer bericht', oud);
    if (oud === n.id) fout('FOUT', `bericht ${n.id}`, 'vervangt zichzelf');
  }
}

// ── elke "Toon in de raket" in informatie.js ──
const toon = [...I.HANGIJZERS.flatMap(h => h.toon || []), ...I.VRAGEN.map(v => v.toon),
  ...I.BORD.map(b => b.toon), ...I.HELPDESK_CIJFERS.inzichten.map(i => i.toon)].filter(Boolean);
for (const t of toon) if (!(PLEK.has(t) || HOOFDSTUKKEN.has(t))) fout('FOUT toon wijst nergens naartoe:', t);
for (const t of I.TOPVRAGEN) if (!I.VRAGEN.some(v => v.v === t)) fout('FOUT topvraag staat niet in VRAGEN:', t);

for (const f of fouten) console.log(f);
console.log(fouten.length ? `FOUT: ${fouten.length} fout(en), NIET OK`
  : `${NIEUWS.length} berichten, ${SCHOLEN.length} scholen, ${ROLLEN.length} rollen, ${THEMAS.length} onderwerpen: alles OK`);
process.exitCode = fouten.length ? 1 : 0;
