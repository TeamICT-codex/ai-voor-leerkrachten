// Controleert de inhoud in content/: format, verplichte blokken, quizzen en Nederlands-Nederlandse woorden.
// Gebruik: node build/check.mjs   (exit code 1 bij fouten)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
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

const dirs = fs.readdirSync(CONTENT).filter(d => fs.statSync(path.join(CONTENT, d)).isDirectory()).sort();
let nLes = 0, nQuiz = 0, nWoorden = 0;
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
    // blokken
    const lines = body.split(/\r?\n/); let open = null; const types = [];
    lines.forEach((line, i) => {
      const o = line.match(/^:::\s*([a-zA-Z]+)(?:\s+(.*))?\s*$/);
      if (o && !open) { open = { type: o[1].toLowerCase(), line: i + 1 }; types.push(open.type); return; }
      if (/^:::\s*$/.test(line)) { if (!open) fouten.push(`${id}:${i + 1}: sluitend ::: zonder open blok`); open = null; return; }
      if (o && open) fouten.push(`${id}:${i + 1}: blok "${o[1]}" geopend binnen blok "${open.type}" (nesten kan niet)`);
    });
    if (open) fouten.push(`${id}: blok "${open.type}" (regel ${open.line}) niet gesloten`);
    const type = data.type || 'les';
    if (type === 'les') {
      if (!types.includes('kernpunten')) fouten.push(`${id}: ::: kernpunten ontbreekt`);
      if (!types.includes('nadenken')) fouten.push(`${id}: ::: nadenken ontbreekt`);
      if (!types.some(t => ['prompt', 'opdracht', 'promptbouwer', 'checklist', 'stappen'].includes(t))) waarschuwingen.push(`${id}: geen prompt, opdracht, stappen of checklist`);
      const woorden = body.split(/\s+/).length;
      if (woorden < 300) waarschuwingen.push(`${id}: kort (${woorden} woorden)`);
      if (woorden > 1300) waarschuwingen.push(`${id}: lang (${woorden} woorden)`);
      nLes++;
    }
    if (type === 'quiz') heeftQuizLes = true;
    // Nederlands-Nederlandse woorden
    const hits = {};
    const tekst = raw.replace(/\[[^\]]*\]\([^)]*\)/g, '');
    let m; while ((m = nlRegex.exec(tekst))) { hits[m[1].toLowerCase()] = (hits[m[1].toLowerCase()] || 0) + 1; }
    for (const [w, n] of Object.entries(hits)) { waarschuwingen.push(`${id}: woord "${w}" (${n}x) – zie schrijfwijzer`); nWoorden += n; }
  }
  const qp = path.join(CONTENT, dir, 'quiz.json');
  if (heeftQuizLes) {
    if (!fs.existsSync(qp)) { fouten.push(`${dir}: quiz.json ontbreekt`); }
    else {
      try {
        const q = JSON.parse(fs.readFileSync(qp, 'utf8'));
        if (!Array.isArray(q.vragen) || q.vragen.length !== 10) fouten.push(`${dir}/quiz.json: ${q.vragen ? q.vragen.length : 0} vragen in plaats van 10`);
        const slugs = files.map(x => x.replace(/^\d+-/, '').replace(/\.md$/, ''));
        (q.vragen || []).forEach((v, i) => {
          const n = `${dir}/quiz.json vraag ${i + 1}`;
          if (!v.vraag) fouten.push(`${n}: geen vraag`);
          if (!Array.isArray(v.opties) || v.opties.length !== 4) fouten.push(`${n}: ${v.opties ? v.opties.length : 0} opties in plaats van 4`);
          else {
            if (!v.opties.some(o => o.id === v.juist)) fouten.push(`${n}: "juist" (${v.juist}) komt niet overeen met een optie-id`);
            v.opties.forEach(o => { if (!o.feedback) fouten.push(`${n}: optie ${o.id} zonder feedback`); });
          }
          if (v.les && !slugs.includes(v.les)) waarschuwingen.push(`${n}: les "${v.les}" bestaat niet in dit hoofdstuk`);
          const tekst = JSON.stringify(v); let m; const hits = new Set();
          while ((m = nlRegex.exec(tekst))) hits.add(m[1].toLowerCase());
          hits.forEach(w => waarschuwingen.push(`${n}: woord "${w}" – zie schrijfwijzer`));
        });
        nQuiz++;
      } catch (e) { fouten.push(`${dir}/quiz.json: ongeldige JSON (${e.message})`); }
    }
  }
}
console.log(`Gecontroleerd: ${dirs.length} hoofdstukken, ${nLes} gewone lessen, ${nQuiz} quizzen.`);
if (waarschuwingen.length) { console.log(`\nWaarschuwingen (${waarschuwingen.length}):`); waarschuwingen.forEach(w => console.log('  - ' + w)); }
if (fouten.length) { console.log(`\nFouten (${fouten.length}):`); fouten.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
console.log('\nGeen fouten.');
