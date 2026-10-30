// Controleert de inhoud in content/: format, verplichte blokken, quizzen en Nederlands-Nederlandse woorden.
// Gebruik: node build/check.mjs                  AI-wijs op school
//          node build/check.mjs --cursus start   AI-wijs Start
// (exit code 1 bij fouten)
//
// Wat per cursus kan verschillen, staat onder "check" in haar config:
//   minWoorden (standaard 300)  waarschuwing voor een kortere gewone les; Start: 150,
//                               want een klassikale les is korter
//   maxWoorden (standaard 1300) waarschuwing voor een langere gewone les
//   quizVragen (standaard 10)   zoveel vragen moet een quiz.json tellen
import fs from 'node:fs';
import path from 'node:path';
import { kiesCursus } from './cursus.mjs';
import { leesKeuze, leesSorteer } from './blokken.mjs';

const { BRON, CONTENT, config } = kiesCursus();
const INSTELLING = Object.assign({ minWoorden: 300, maxWoorden: 1300, quizVragen: 10 }, config.check);
const TYPES = ['les', 'quiz', 'certificaat', 'paspoort'];
const fouten = []; const waarschuwingen = [];

// Woorden die in Vlaanderen niet gebruikelijk zijn (zie docs/schrijfwijzer.md). Hoofdletterongevoelig, hele woorden.
const NL_WOORDEN = ['docent', 'docenten', 'vmbo', 'havo', 'vwo', 'mbo', 'hbo', 'brugklas', 'brugklasser', 'brugklassers', 'onderbouw', 'bovenbouw', 'werkstuk', 'werkstukken', 'profielwerkstuk', 'eindexamen', 'eindexamens', 'centraal examen', 'schoolexamen', 'magister', 'somtoday', 'kantine', 'tussenuur', 'tussenuren', 'leerjaar', 'decaan', 'mentor', 'ov-chipkaart', 'hartstikke', 'gaaf', 'sowieso', 'lekker bezig', 'albert heijn', 'kennisnet', 'naberink', 'aivoorleerlingen', 'aivoordocenten', 'tussenuurtje', 'spiekbriefje', 'bijbaan', 'bijbaantje', 'open dag'];
const nlRegex = new RegExp('\\b(' + NL_WOORDEN.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi');

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {}; let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && key) { (data[key] = Array.isArray(data[key]) ? data[key] : []).push(li[1]); continue; }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) { key = kv[1]; data[key] = kv[2] === '' ? [] : kv[2]; }
  }
  return { data, body: m[2] };
}

// Blokken: netjes geopend en gesloten, niet genest, en voor keuze en sorteer ook
// de schrijfwijze binnenin (zie build/blokken.mjs). Geeft de bloktypes terug.
function controleerBlokken(id, body) {
  const lines = body.split(/\r?\n/); let open = null; const types = [];
  lines.forEach((line, i) => {
    const o = line.match(/^:::\s*([a-zA-Z]+)(?:\s+(.*))?\s*$/);
    if (o && !open) { open = { type: o[1].toLowerCase(), line: i + 1, inhoud: [] }; types.push(open.type); return; }
    if (/^:::\s*$/.test(line)) {
      if (!open) fouten.push(`${id}:${i + 1}: sluitend ::: zonder open blok`);
      else if (open.type === 'keuze') leesKeuze(open.inhoud.join('\n')).problemen.forEach(p => fouten.push(`${id}:${open.line}: keuze: ${p}`));
      else if (open.type === 'sorteer') leesSorteer(open.inhoud.join('\n')).problemen.forEach(p => fouten.push(`${id}:${open.line}: sorteer: ${p}`));
      open = null; return;
    }
    if (o && open) fouten.push(`${id}:${i + 1}: blok "${o[1]}" geopend binnen blok "${open.type}" (nesten kan niet)`);
    if (open) open.inhoud.push(line);
  });
  if (open) fouten.push(`${id}: blok "${open.type}" (regel ${open.line}) niet gesloten`);
  return types;
}
function controleerWoorden(id, raw) {
  const hits = {};
  const tekst = raw.replace(/\[[^\]]*\]\([^)]*\)/g, '');
  let m; while ((m = nlRegex.exec(tekst))) { hits[m[1].toLowerCase()] = (hits[m[1].toLowerCase()] || 0) + 1; }
  for (const [w, n] of Object.entries(hits)) { waarschuwingen.push(`${id}: woord "${w}" (${n}x) – zie schrijfwijzer`); nWoorden += n; }
}

if (!fs.existsSync(CONTENT)) { console.log(`✗ De inhoudsmap ${CONTENT} bestaat niet.`); process.exit(1); }
const dirs = fs.readdirSync(CONTENT).filter(d => fs.statSync(path.join(CONTENT, d)).isDirectory()).sort();
let nLes = 0, nQuiz = 0, nWoorden = 0;
// Vooraf: welke lessen bestaan er (een slotquiz mag naar elk hoofdstuk wijzen), en
// heeft de cursus een paspoort (dan draagt elke gewone les een paspoortzin)?
const lesMd = d => fs.existsSync(path.join(CONTENT, d)) ? fs.readdirSync(path.join(CONTENT, d)).filter(f => f.endsWith('.md')).sort() : [];
const alleSlugs = new Map(dirs.map(d => [d, lesMd(d).map(x => x.replace(/^\d+-/, '').replace(/\.md$/, ''))]));
const heeftPaspoort = dirs.some(d => lesMd(d).some(f => /^type:\s*paspoort\s*$/m.test((fs.readFileSync(path.join(CONTENT, d, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || ['', ''])[1])));
for (const dir of dirs) {
  const hp = path.join(CONTENT, dir, 'hoofdstuk.json');
  if (!fs.existsSync(hp)) { fouten.push(`${dir}: hoofdstuk.json ontbreekt`); continue; }
  const files = fs.readdirSync(path.join(CONTENT, dir)).filter(f => f.endsWith('.md')).sort();
  if (!files.length) waarschuwingen.push(`${dir}: nog geen lessen`);
  let heeftQuizLes = false;
  for (const f of files) {
    const id = `${dir}/${f}`;
    const raw = fs.readFileSync(path.join(CONTENT, dir, f), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm) { fouten.push(`${id}: geen frontmatter`); continue; }
    const { data, body } = fm;
    for (const k of ['title', 'intro', 'duur', 'doelen']) if (!data[k] || (Array.isArray(data[k]) && !data[k].length)) fouten.push(`${id}: frontmatter mist "${k}"`);
    if (data.duur && !/^\d+$/.test(String(data.duur))) fouten.push(`${id}: duur moet een geheel getal zijn`);
    if (!/^\d{2}-[a-z0-9-]+\.md$/.test(f)) fouten.push(`${id}: bestandsnaam niet volgens NN-slug.md`);
    if (/^#\s/m.test(body)) fouten.push(`${id}: #-kop in de body (gebruik ## of ###)`);
    const types = controleerBlokken(id, body);
    const type = data.type || 'les';
    if (!TYPES.includes(type)) fouten.push(`${id}: onbekend type "${type}" (kies uit ${TYPES.join(', ')})`);
    if (type === 'les') {
      if (!types.includes('kernpunten')) fouten.push(`${id}: ::: kernpunten ontbreekt`);
      if (!types.includes('nadenken')) fouten.push(`${id}: ::: nadenken ontbreekt`);
      if (!types.some(t => ['prompt', 'opdracht', 'promptbouwer', 'checklist', 'stappen', 'keuze', 'sorteer'].includes(t))) waarschuwingen.push(`${id}: geen prompt, opdracht, stappen of checklist`);
      const woorden = body.split(/\s+/).length;
      if (woorden < INSTELLING.minWoorden) waarschuwingen.push(`${id}: kort (${woorden} woorden)`);
      if (woorden > INSTELLING.maxWoorden) waarschuwingen.push(`${id}: lang (${woorden} woorden)`);
      if (heeftPaspoort && (!data.paspoortzin || Array.isArray(data.paspoortzin))) waarschuwingen.push(`${id}: frontmatter mist "paspoortzin" (de zin bij de stempel op het paspoort)`);
      nLes++;
    }
    if (type === 'quiz') heeftQuizLes = true;
    // Nederlands-Nederlandse woorden
    controleerWoorden(id, raw);
  }
  const qp = path.join(CONTENT, dir, 'quiz.json');
  if (heeftQuizLes) {
    if (!fs.existsSync(qp)) { fouten.push(`${dir}: quiz.json ontbreekt`); }
    else {
      try {
        const q = JSON.parse(fs.readFileSync(qp, 'utf8'));
        if (!Array.isArray(q.vragen) || q.vragen.length !== INSTELLING.quizVragen) fouten.push(`${dir}/quiz.json: ${q.vragen ? q.vragen.length : 0} vragen in plaats van ${INSTELLING.quizVragen}`);
        const slugs = files.map(x => x.replace(/^\d+-/, '').replace(/\.md$/, ''));
        // Een slotquiz wijst naar lessen in andere hoofdstukken: met de slug alleen
        // (de build zet het pad ervoor) of met "../map/slug".
        const bestaatElders = (les) => {
          const m = les.match(/^\.\.\/([^/]+)\/([^/]+)$/);
          if (m) return (alleSlugs.get(m[1]) || []).includes(m[2]);
          return [...alleSlugs.values()].some(s => s.includes(les));
        };
        (q.vragen || []).forEach((v, i) => {
          const n = `${dir}/quiz.json vraag ${i + 1}`;
          if (!v.vraag) fouten.push(`${n}: geen vraag`);
          if (!Array.isArray(v.opties) || v.opties.length !== 4) fouten.push(`${n}: ${v.opties ? v.opties.length : 0} opties in plaats van 4`);
          else {
            if (!v.opties.some(o => o.id === v.juist)) fouten.push(`${n}: "juist" (${v.juist}) komt niet overeen met een optie-id`);
            v.opties.forEach(o => { if (!o.feedback) fouten.push(`${n}: optie ${o.id} zonder feedback`); });
          }
          if (v.les && !slugs.includes(v.les) && !bestaatElders(v.les)) waarschuwingen.push(`${n}: les "${v.les}" bestaat niet in deze cursus`);
          const tekst = JSON.stringify(v); let m; const hits = new Set();
          while ((m = nlRegex.exec(tekst))) hits.add(m[1].toLowerCase());
          hits.forEach(w => waarschuwingen.push(`${n}: woord "${w}" – zie schrijfwijzer`));
        });
        nQuiz++;
      } catch (e) { fouten.push(`${dir}/quiz.json: ongeldige JSON (${e.message})`); }
    }
  }
}
// De leerkrachtenpagina in Markdown (Start): dezelfde blokken en woorden als een les.
if (config.leerkrachtenpagina) {
  const lp = path.join(BRON, config.leerkrachtenpagina);
  const id = path.relative(BRON, lp).split(path.sep).join('/');
  if (!fs.existsSync(lp)) waarschuwingen.push(`${id}: ontbreekt nog (de leerkrachtenpagina toont een placeholder)`);
  else {
    const raw = fs.readFileSync(lp, 'utf8');
    const fm = parseFrontmatter(raw);
    controleerBlokken(id, fm ? fm.body : raw);
    if (/^#\s/m.test(fm ? fm.body : raw)) fouten.push(`${id}: #-kop in de tekst (de pagina heeft al een titel; gebruik ## of ###)`);
    controleerWoorden(id, raw);
  }
}
console.log(`Gecontroleerd: ${dirs.length} hoofdstukken, ${nLes} gewone lessen, ${nQuiz} quizzen.`);
if (waarschuwingen.length) { console.log(`\nWaarschuwingen (${waarschuwingen.length}):`); waarschuwingen.forEach(w => console.log('  - ' + w)); }
if (fouten.length) { console.log(`\nFouten (${fouten.length}):`); fouten.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
console.log('\nGeen fouten.');
