// Generator: zet content/ om in een statische site in dist/.
// Gebruik: node build/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'cursus.config.json'), 'utf8'));
const DIST = path.resolve(ROOT, config.uitvoermap || 'dist');
const ASSETS = path.join(ROOT, 'assets');

marked.setOptions({ gfm: true, breaks: false });

// ---------- hulpfuncties ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (s = '') => esc(s).replace(/'/g, '&#39;');
const md = (s = '') => marked.parse(s.trim());
const mdInline = (s = '') => marked.parseInline(s.trim());
const stripNum = (f) => f.replace(/^\d+-/, '').replace(/\.md$/, '');
const DOMEINEN = {
  omgaan: 'Omgaan met AI',
  creeren: 'Creëren met AI',
  beheren: 'AI beheren',
  ontwerpen: 'AI ontwerpen',
};
const STAPPEN = {
  1: { titel: 'De basis', tekst: 'Begrijp wat AI is, leer goed samenwerken en houd zelf de regie.' },
  2: { titel: 'Kies je route', tekst: 'Kies de hoofdstukken die passen bij wat jij wilt leren, maken of bereiken.' },
  3: { titel: 'Afronding', tekst: 'Kijk terug op wat je hebt geleerd en haal je certificaat.' },
};

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && key) { (data[key] = Array.isArray(data[key]) ? data[key] : []).push(unquote(li[1])); continue; }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) { key = kv[1]; data[key] = kv[2] === '' ? [] : unquote(kv[2]); }
  }
  return { data, body: m[2] };
}
function unquote(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}

// ---------- blokken ----------
const BLOCK_LABELS = {
  prompt: 'Prompt', voorbeeld: 'Voorbeeld van een antwoord', tip: 'Tip', letop: 'Let op',
  opdracht: 'Aan de slag', stappen: 'Stappenplan', kernpunten: 'Kernpunten', nadenken: 'Denk even na',
  checklist: 'Checklist', vergelijk: 'Vergelijk', tabs: 'Kies een voorbeeld', promptbouwer: 'Promptbouwer',
};
const ICONS = {
  prompt: '✦', voorbeeld: '💬', tip: '💡', letop: '⚠', opdracht: '🎯', stappen: '→', kernpunten: '★',
  nadenken: '?', checklist: '☑', promptbouwer: '🛠',
};

function renderBlock(type, title, inner, ctx) {
  const t = type.toLowerCase();
  const label = title || BLOCK_LABELS[t] || t;
  const ico = ICONS[t] ? `<span class="blk-ico" aria-hidden="true">${ICONS[t]}</span>` : '';
  const id = `${ctx.lesId}:${ctx.blockIndex++}`;
  switch (t) {
    case 'prompt':
      return `<div class="blk blk-prompt"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span><button type="button" class="btn btn-small js-copy" data-copy-target="pre">Kopieer de prompt</button></div><pre class="prompt-text">${esc(inner.trim())}</pre></div>`;
    case 'voorbeeld':
      return `<div class="blk blk-voorbeeld"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><div class="blk-body">${md(inner)}</div><p class="blk-foot">Ingekort voorbeeld. In jouw chatbot kan het antwoord anders zijn.</p></div>`;
    case 'tip': case 'letop': case 'opdracht':
      return `<div class="blk blk-${t}"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><div class="blk-body">${md(inner)}</div></div>`;
    case 'stappen':
      return `<div class="blk blk-stappen"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><div class="blk-body stappen">${md(inner)}</div></div>`;
    case 'kernpunten':
      return `<div class="blk blk-kernpunten"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><div class="blk-body">${md(inner)}</div></div>`;
    case 'nadenken':
      return `<div class="blk blk-nadenken" data-note-id="${attr(id)}"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><div class="blk-body">${md(inner)}<label class="sr-only" for="note-${attr(ctx.blockIndex)}">Jouw antwoord</label><textarea id="note-${attr(ctx.blockIndex)}" class="note-field js-note" rows="3" placeholder="Schrijf hier je antwoord. Het blijft op dit toestel bewaard."></textarea><p class="blk-foot js-note-status"></p></div></div>`;
    case 'checklist': {
      const items = inner.split(/\r?\n/).map(l => l.trim()).filter(l => /^[-*]\s+/.test(l)).map(l => l.replace(/^[-*]\s+/, ''));
      const lis = items.map((it, i) => `<li><label><input type="checkbox" class="js-check" data-check-id="${attr(id + ':' + i)}"> <span>${mdInline(it)}</span></label></li>`).join('');
      return `<div class="blk blk-checklist"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div><ul class="checklist">${lis}</ul></div>`;
    }
    case 'vergelijk': {
      const cols = inner.split(/\r?\n---\r?\n/).map(c => c.trim()).filter(Boolean);
      const html = cols.map((c, i) => {
        const lines = c.split(/\r?\n/);
        const head = lines.shift();
        return `<div class="vergelijk-col vergelijk-col-${i}"><h4>${mdInline(head)}</h4>${md(lines.join('\n'))}</div>`;
      }).join('');
      return `<div class="blk blk-vergelijk"><div class="vergelijk">${html}</div></div>`;
    }
    case 'tabs': {
      const parts = inner.split(/\r?\n(?=---\s+\S)/).map(p => p.trim()).filter(Boolean);
      const tabs = parts.map(p => { const m = p.match(/^---\s+(.*?)\r?\n([\s\S]*)$/); return m ? { naam: m[1].trim(), body: m[2] } : null; }).filter(Boolean);
      if (!tabs.length) return md(inner);
      const btns = tabs.map((tb, i) => `<button type="button" role="tab" class="tab-btn${i === 0 ? ' is-active' : ''}" aria-selected="${i === 0}" data-tab="${i}">${esc(tb.naam)}</button>`).join('');
      const panels = tabs.map((tb, i) => `<div role="tabpanel" class="tab-panel${i === 0 ? ' is-active' : ''}" data-tab="${i}">${md(tb.body)}</div>`).join('');
      return `<div class="blk blk-tabs js-tabs">${title ? `<div class="blk-head"><span class="blk-label">${esc(title)}</span></div>` : ''}<div class="tab-list" role="tablist">${btns}</div>${panels}</div>`;
    }
    case 'promptbouwer': {
      const velden = []; let sjabloon = ''; const rest = [];
      for (const line of inner.split(/\r?\n/)) {
        const v = line.match(/^veld:\s*(.*)$/i);
        const s = line.match(/^sjabloon:\s*([\s\S]*)$/i);
        if (v) { const [naam, vraag, vb] = v[1].split('|').map(x => x.trim()); velden.push({ naam, vraag: vraag || naam, vb: vb || '' }); }
        else if (s) sjabloon = s[1].trim();
        else if (line.trim()) rest.push(line);
      }
      const fields = velden.map((v, i) => `<label class="pb-field"><span>${esc(v.vraag)}</span><input type="text" data-veld="${attr(v.naam)}" placeholder="${attr(v.vb)}"></label>`).join('');
      return `<div class="blk blk-promptbouwer js-promptbouwer" data-sjabloon="${attr(sjabloon)}"><div class="blk-head">${ico}<span class="blk-label">${esc(label)}</span></div>${rest.length ? `<div class="blk-body">${md(rest.join('\n'))}</div>` : ''}<div class="pb-fields">${fields}</div><div class="pb-result"><div class="blk-head"><span class="blk-label">Jouw prompt</span><button type="button" class="btn btn-small js-copy" data-copy-target="pre">Kopieer de prompt</button></div><pre class="prompt-text js-pb-output">${esc(sjabloon)}</pre></div></div>`;
    }
    default:
      return `<div class="blk blk-generic"><div class="blk-head"><span class="blk-label">${esc(label)}</span></div><div class="blk-body">${md(inner)}</div></div>`;
  }
}

function renderBody(body, ctx) {
  const lines = body.split(/\r?\n/);
  let out = []; let buf = []; let block = null;
  const flush = () => { if (buf.length) { out.push(md(buf.join('\n'))); buf = []; } };
  for (const line of lines) {
    const open = line.match(/^:::\s*([a-zA-Z]+)(?:\s+(.*))?\s*$/);
    if (!block && open && open[1].toLowerCase() !== '') { flush(); block = { type: open[1], title: (open[2] || '').trim(), lines: [] }; continue; }
    if (block && /^:::\s*$/.test(line)) { out.push(renderBlock(block.type, block.title, block.lines.join('\n'), ctx)); block = null; continue; }
    if (block) block.lines.push(line); else buf.push(line);
  }
  if (block) { ctx.warnings.push(`blok "${block.type}" niet gesloten`); out.push(renderBlock(block.type, block.title, block.lines.join('\n'), ctx)); }
  flush();
  return out.join('\n');
}

// ---------- inlezen ----------
function loadCourse() {
  const dirs = fs.readdirSync(CONTENT).filter(d => fs.statSync(path.join(CONTENT, d)).isDirectory()).sort();
  const hoofdstukken = [];
  for (const dir of dirs) {
    const hp = path.join(CONTENT, dir, 'hoofdstuk.json');
    if (!fs.existsSync(hp)) continue;
    const h = JSON.parse(fs.readFileSync(hp, 'utf8'));
    h.map = dir;
    h.lessen = [];
    const files = fs.readdirSync(path.join(CONTENT, dir)).filter(f => f.endsWith('.md')).sort();
    files.forEach((f, i) => {
      const raw = fs.readFileSync(path.join(CONTENT, dir, f), 'utf8');
      const { data, body } = parseFrontmatter(raw);
      const les = { bestand: f, slug: stripNum(f), nummer: i + 1, data, body, hoofdstuk: h };
      les.id = `${dir}/${les.slug}`;
      les.type = data.type || 'les';
      if (les.type === 'quiz') {
        const qp = path.join(CONTENT, dir, 'quiz.json');
        les.quiz = fs.existsSync(qp) ? JSON.parse(fs.readFileSync(qp, 'utf8')) : null;
      }
      h.lessen.push(les);
    });
    hoofdstukken.push(h);
  }
  hoofdstukken.sort((a, b) => a.nummer - b.nummer);
  return hoofdstukken;
}

// ---------- templates ----------
function layout({ title, description, base, body, bodyClass = '', extraHead = '' }) {
  return `<!doctype html>
<html lang="nl-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(config.naam)}</title>
<meta name="description" content="${attr(description || config.korteBeschrijving)}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${base}assets/style.css">
${extraHead}
</head>
<body class="${bodyClass}" data-base="${base}">
<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="site-head">
  <div class="wrap site-head-in">
    <a class="brand" href="${base}index.html"><img class="brand-logo" src="${base}assets/logo-leercollectief.svg" alt="${attr(config.organisatie)}" width="150" height="38"><span class="brand-sep" aria-hidden="true"></span><span class="brand-name">${esc(config.naam)}</span></a>
    <nav class="site-nav" aria-label="Hoofdnavigatie">
      <a href="${base}index.html#cursusinhoud">Cursusinhoud</a>
      <a href="${base}index.html#voortgang">Mijn voortgang</a>
      <a href="${base}voor-leerkrachten.html">Voor leerkrachten</a>
    </nav>
  </div>
</header>
<main id="inhoud">
${body}
</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-brand"><a href="${attr(config.organisatieUrl)}" rel="noopener"><img src="${base}assets/logo-leercollectief.svg" alt="${attr(config.organisatie)}" width="170" height="44"></a><p class="foot-motto"><em>${esc(config.motto || 'samen is beter')}</em></p></div>
    <p><strong>${esc(config.naam)}</strong> · ${esc(config.ondertitel)}. Voor de leerlingen van onze scholen in ${esc(config.regio || 'de regio')}, en voor elke andere school die ze wil gebruiken.</p>
    <p>Een initiatief van <a href="${attr(config.organisatieUrl)}" rel="noopener">${esc(config.organisatieVoluit || config.organisatie)}</a>. De opbouw is geïnspireerd op het concept van een gratis Nederlandse AI-cursus voor leerlingen; alle teksten, voorbeelden en quizvragen zijn opnieuw geschreven voor het Vlaamse secundair onderwijs.</p>
    <p>Je voortgang wordt alleen in deze browser op dit toestel bewaard. Er worden geen gegevens naar een server gestuurd.</p>
  </div>
</footer>
<script src="${base}assets/app.js" defer></script>
</body>
</html>`;
}

function lesUrl(les, base) { return `${base}${les.hoofdstuk.map}/${les.slug}.html`; }

function sidebar(h, actief, base) {
  const items = h.lessen.map(l => `<li class="${l === actief ? 'is-current' : ''}"><a href="${lesUrl(l, base)}" data-les-id="${attr(l.id)}"><span class="side-num">${h.nummer}.${l.nummer}</span><span class="side-title">${esc(l.data.title)}</span><span class="side-check" aria-hidden="true"></span></a></li>`).join('');
  return `<aside class="side"><details class="side-details" open><summary><span class="side-h">Hoofdstuk ${h.nummer}</span><strong>${esc(h.titel)}</strong></summary><ol class="side-list">${items}</ol><p class="side-foot"><a href="${base}index.html#cursusinhoud">Alle hoofdstukken</a></p></details></aside>`;
}

function lesPage(les, all) {
  const h = les.hoofdstuk; const base = '../';
  const ctx = { lesId: les.id, blockIndex: 0, warnings: [] };
  const flat = all.flatMap(x => x.lessen);
  const idx = flat.indexOf(les);
  const prev = flat[idx - 1], next = flat[idx + 1];
  const doelen = Array.isArray(les.data.doelen) && les.data.doelen.length ? `<div class="doelen"><h2 class="doelen-h">Na deze les</h2><ul>${les.data.doelen.map(d => `<li>${mdInline(d)}</li>`).join('')}</ul></div>` : '';
  const video = les.data.video ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${attr(les.data.video)}" title="Video bij deze les" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>` : '';
  let body = renderBody(les.body, ctx);
  let extra = '';
  if (les.type === 'quiz') {
    const q = les.quiz || { slaagpercentage: 80, vragen: [] };
    extra = `<div class="quiz js-quiz" data-les-id="${attr(les.id)}" data-pass="${q.slaagpercentage || 80}"><div class="quiz-start"><div class="quiz-stats"><div><strong>${q.vragen.length}</strong><span>vragen</span></div><div><strong>${q.slaagpercentage || 80} %</strong><span>om te slagen</span></div><div><strong>1</strong><span>keuze per vraag</span></div></div><ol class="quiz-how"><li><strong>Eén keuze per vraag.</strong> Kies een antwoord en bevestig.</li><li><strong>Meteen weten waarom.</strong> Je ziet direct wat klopt en krijgt uitleg bij jouw antwoord.</li><li><strong>Opnieuw proberen mag altijd.</strong> Vanaf ${q.slaagpercentage || 80} % is de quiz behaald. Je beste score blijft staan.</li></ol><p class="quiz-best js-quiz-best"></p><button type="button" class="btn btn-primary js-quiz-start">Start de quiz</button></div><div class="quiz-stage" hidden></div></div><script type="application/json" class="js-quiz-data">${JSON.stringify(q).replace(/</g, '\\u003c')}</script>`;
    if (!q.vragen.length) ctx.warnings.push('quiz.json ontbreekt of is leeg');
  }
  if (les.type === 'certificaat') {
    const stap2 = all.filter(x => x.stap === 2);
    const rows = all.map(x => `<li class="cert-row" data-hoofdstuk="${attr(x.map)}" data-nummer="${x.nummer}" data-stap="${x.stap}" data-lessen="${x.lessen.length}"><span class="cert-h">H${x.nummer}</span><span class="cert-t">${esc(x.titel)}</span><span class="cert-status js-cert-status">–</span></li>`).join('');
    extra = `<div class="cert js-cert" data-verplicht="${attr(config.certificaatVereisten.verplichteHoofdstukken.join(','))}" data-min-route="${config.certificaatVereisten.minstensRouteHoofdstukken}" data-route-hoofdstukken="${attr(stap2.map(x => x.nummer).join(','))}" data-naam="${attr(config.naam)}" data-org="${attr(config.organisatie)}">
<h2>Jouw cursusoverzicht</h2><ul class="cert-list">${rows}</ul>
<div class="cert-form"><label for="cert-naam">Je naam op het certificaat</label><input id="cert-naam" class="js-cert-naam" type="text" maxlength="60" placeholder="Voornaam en naam"><label for="cert-school">Je school (niet verplicht)</label><input id="cert-school" class="js-cert-school" type="text" maxlength="80" placeholder="Naam van je school"></div>
<p class="cert-msg js-cert-msg"></p>
<button type="button" class="btn btn-primary js-cert-print" disabled>Bekijk en druk je certificaat af</button>
<div class="cert-paper js-cert-paper" aria-hidden="true"><div class="cert-paper-in"><p class="cp-kicker">Certificaat</p><h2 class="cp-title">${esc(config.naam)}</h2><p class="cp-sub">${esc(config.ondertitel)}</p><p class="cp-lead">Dit certificaat is behaald door</p><p class="cp-naam js-cp-naam">…</p><p class="cp-school js-cp-school"></p><p class="cp-lead">met de volgende afgeronde hoofdstukken</p><ul class="cp-list js-cp-list"></ul><p class="cp-date">Datum: <span class="js-cp-date"></span></p><p class="cp-org">${esc(config.organisatie)}</p></div></div>
</div>`;
  }
  const done = les.type === 'quiz'
    ? `<p class="done-hint">Beantwoord alle vragen. Vanaf ${(les.quiz && les.quiz.slaagpercentage) || 80} % wordt deze les automatisch afgevinkt.</p>`
    : `<button type="button" class="btn btn-done js-done" data-les-id="${attr(les.id)}"><span class="done-off">Markeer als voltooid</span><span class="done-on">Voltooid ✓ (ongedaan maken)</span></button>`;
  const nav = `<nav class="les-nav" aria-label="Vorige en volgende les">${prev ? `<a class="les-prev" href="${lesUrl(prev, base)}"><span>Vorige les</span><strong>${esc(prev.data.title)}</strong></a>` : '<span></span>'}${next ? `<a class="les-next" href="${lesUrl(next, base)}"><span>Volgende les</span><strong>${esc(next.data.title)}</strong></a>` : `<a class="les-next" href="${base}index.html#cursusinhoud"><span>Terug naar</span><strong>het cursusoverzicht</strong></a>`}</nav>`;
  const domein = DOMEINEN[h.domein] || '';
  const content = `
<div class="wrap les-wrap">
${sidebar(h, les, base)}
<article class="les" data-les-id="${attr(les.id)}">
  <p class="crumbs"><a href="${base}index.html#cursusinhoud">Cursus</a> › Hoofdstuk ${h.nummer} · Les ${h.nummer}.${les.nummer}${domein ? ` <span class="pill pill-${attr(h.domein)}">${esc(domein)}</span>` : ''}</p>
  <h1>${esc(les.data.title)}</h1>
  <p class="les-intro">${mdInline(les.data.intro || '')}</p>
  <p class="les-meta"><span>⏱ ongeveer ${esc(les.data.duur || '?')} min</span></p>
  ${video}
  ${doelen}
  <div class="les-body">${body}</div>
  ${extra}
  <section class="les-afronden" aria-labelledby="afronden-h"><h2 id="afronden-h">Rond deze les af</h2><p>Je voortgang wordt op dit toestel bewaard.</p>${done}</section>
  ${nav}
</article>
</div>`;
  return { html: layout({ title: les.data.title, description: les.data.intro, base, body: content, bodyClass: 'page-les' }), warnings: ctx.warnings };
}

function indexPage(all) {
  const base = './';
  const totaalLessen = all.reduce((n, h) => n + h.lessen.length, 0);
  const totaalMin = all.reduce((n, h) => n + h.lessen.reduce((m, l) => m + (parseInt(l.data.duur, 10) || 0), 0), 0);
  const uur = Math.round(totaalMin / 60);
  const stappen = [1, 2, 3].map(s => {
    const hs = all.filter(h => h.stap === s);
    const cards = hs.map(h => {
      const min = h.lessen.reduce((m, l) => m + (parseInt(l.data.duur, 10) || 0), 0);
      const lessen = h.lessen.map(l => `<li><a href="${lesUrl(l, base)}" data-les-id="${attr(l.id)}"><span class="side-num">${h.nummer}.${l.nummer}</span> ${esc(l.data.title)}<span class="side-check" aria-hidden="true"></span></a></li>`).join('');
      const route = h.route ? `<label class="route-toggle"><input type="checkbox" class="js-route" data-hoofdstuk="${attr(h.map)}"> <span>In mijn route</span></label>` : '';
      return `<details class="hcard" data-hoofdstuk="${attr(h.map)}" data-lessen="${h.lessen.length}"><summary><span class="hcard-num">H${h.nummer}</span><span class="hcard-main"><strong>${esc(h.titel)}</strong><span class="hcard-intro">${esc(h.intro)}</span><span class="hcard-meta"><span>${h.lessen.length} lessen</span><span>${min} min</span><span class="pill pill-${attr(h.domein)}">${esc(DOMEINEN[h.domein] || '')}</span></span><span class="hcard-progress"><span class="bar"><span class="bar-in js-h-bar" style="width:0%"></span></span><span class="js-h-count">0/${h.lessen.length}</span></span></span></summary><ol class="hcard-lessen">${lessen}</ol>${route}${h.lessen[0] ? `<p class="hcard-start"><a class="btn btn-small" href="${lesUrl(h.lessen[0], base)}">Start hoofdstuk ${h.nummer}</a></p>` : '<p class="hcard-start small">Dit hoofdstuk is nog in opbouw.</p>'}</details>`;
    }).join('');
    const nL = hs.reduce((n, h) => n + h.lessen.length, 0);
    const nM = hs.reduce((n, h) => n + h.lessen.reduce((m, l) => m + (parseInt(l.data.duur, 10) || 0), 0), 0);
    return `<section class="stap" id="stap-${s}"><div class="stap-head"><p class="kicker">Stap ${s}</p><h3>${esc(STAPPEN[s].titel)}</h3><p>${esc(STAPPEN[s].tekst)}</p><p class="stap-meta">${hs.length} ${hs.length === 1 ? 'hoofdstuk' : 'hoofdstukken'} · ${nL} lessen · ${s === 2 ? 'tot ' : ''}${nM} min</p></div><div class="hcards">${cards}</div></section>`;
  }).join('');
  const body = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-text">
    <p class="kicker">Gratis cursus voor leerlingen · 2de en 3de graad</p>
    <h1>Ontdek hoe je slim leert en werkt <em>mét AI</em></h1>
    <p class="lead">${esc(config.korteBeschrijving)}</p>
    <p class="hero-cta"><a class="btn btn-primary" href="${lesUrl(all[0].lessen[0], base)}">Start de cursus</a> <a class="btn" href="#cursusinhoud">Bekijk de inhoud</a></p>
    <p class="hero-psst">Psst. Deze cursus is echt voor leerlingen geschreven. Geen opgeheven vingertje. Je leert hoe AI je helpt bij het leren én hoe je het inzet voor taken, papers en presentaties die van jou blijven. Want ook met AI geldt: <strong>samen is beter</strong>.</p>
  </div>
  <aside class="hero-card">
    <h2>Cursus in het kort</h2>
    <dl class="facts"><div><dt>Hoofdstukken</dt><dd>${all.length}</dd></div><div><dt>Lessen</dt><dd>${totaalLessen}</dd></div><div><dt>Studietijd</dt><dd>ongeveer ${uur} uur</dd></div><div><dt>Voor wie</dt><dd>${esc(config.doelgroep)}</dd></div></dl>
    <div class="hero-progress" id="voortgang"><h3>Mijn voortgang</h3><p class="js-total-text">Je bent nog niet gestart.</p><span class="bar"><span class="bar-in js-total-bar" style="width:0%"></span></span><p class="small">Je voortgang staat in deze browser op dit toestel. Wissel je van toestel, exporteer dan je voortgangscode hieronder.</p><p class="hero-progress-actions"><button type="button" class="btn btn-small js-export">Voortgangscode exporteren</button> <button type="button" class="btn btn-small js-import">Importeren</button></p></div>
  </aside>
</div></section>
<section class="wrap" id="cursusinhoud">
  <h2 class="section-h">Cursusinhoud</h2>
  <p class="section-sub">Eerst de basis. Daarna kies je jouw route.</p>
  ${stappen}
</section>
<section class="wrap domeinen">
  <h2 class="section-h">Vier domeinen van AI-geletterdheid</h2>
  <p class="section-sub">Elk hoofdstuk hoort bij een domein uit het Europese kader voor AI-geletterdheid (Europese Commissie en OESO). Zo zie je wat je leert.</p>
  <div class="domein-grid">
    <div class="domein-card pill-omgaan"><h3>Omgaan met AI</h3><p>AI herkennen, inschatten of een antwoord klopt en de grenzen zien.</p></div>
    <div class="domein-card pill-creeren"><h3>Creëren met AI</h3><p>Samen met AI iets maken en het resultaat bijsturen, eerlijk en met bronvermelding.</p></div>
    <div class="domein-card pill-beheren"><h3>AI beheren</h3><p>Weten welke taken je aan AI geeft, duidelijke instructies geven en zelf de controle houden.</p></div>
    <div class="domein-card pill-ontwerpen"><h3>AI ontwerpen</h3><p>Begrijpen hoe AI werkt en wat keuzes in data en ontwerp betekenen voor mensen.</p></div>
  </div>
</section>
<section class="wrap over">
  <h2 class="section-h">Over deze cursus</h2>
  <p>${esc(config.naam)} is een gratis, open cursus van <a href="${attr(config.organisatieUrl)}" rel="noopener">${esc(config.organisatieVoluit || config.organisatie)}</a> voor de leerlingen van de tweede en derde graad van onze secundaire scholen in ${esc(config.regio || 'de regio')}, in alle finaliteiten. Elke andere Vlaamse school mag ze gebruiken. Je hebt geen account en geen betaalde chatbot nodig. De voorbeelden komen uit onze eigen scholen: van een GIP elektromechanica in Lokeren tot een spreekbeurt in Hamme. Leerkrachten vinden <a href="${base}voor-leerkrachten.html">hier</a> hoe ze de cursus in de klas gebruiken.</p>
</section>
<section class="wrap start-cta"><div class="cta-box"><h2>Begin gewoon bij het begin</h2><p>Hoofdstuk 1 duurt ongeveer een uur en legt de basis voor alles wat volgt.</p><a class="btn btn-primary" href="${lesUrl(all[0].lessen[0], base)}">Start de cursus</a></div></section>
<dialog class="dlg js-dlg-progress"><form method="dialog"><h2 class="js-dlg-title">Voortgangscode</h2><p class="js-dlg-text"></p><textarea class="js-dlg-code" rows="5" spellcheck="false"></textarea><p class="js-dlg-status"></p><menu><button type="button" class="btn btn-small js-dlg-copy">Kopieer</button><button type="button" class="btn btn-small btn-primary js-dlg-apply" hidden>Importeren</button><button type="submit" class="btn btn-small">Sluiten</button></menu></form></dialog>`;
  return layout({ title: 'AI leren gebruiken', base, body, bodyClass: 'page-index' });
}

function leerkrachtenPage(all) {
  const base = './';
  const rows = all.map(h => `<tr><td>H${h.nummer}</td><td>${esc(h.titel)}</td><td>${esc(DOMEINEN[h.domein] || '')}</td><td>${h.lessen.length}</td><td>${h.lessen.reduce((m, l) => m + (parseInt(l.data.duur, 10) || 0), 0)} min</td></tr>`).join('');
  const body = `<div class="wrap page-text">
<h1>Voor leerkrachten</h1>
<p class="lead">${esc(config.naam)} is een zelfstandig te volgen cursus voor leerlingen van de tweede en derde graad van de scholen van ${esc(config.organisatieVoluit || config.organisatie)}. Je kunt ze inzetten als huiswerk, in een GWP of projectweek, als deel van een traject rond digitale competentie en mediawijsheid, of gewoon als aanrader voor leerlingen die AI al gebruiken.</p>
<h2>Waarom een eigen cursus</h2>
<p>Bijna de helft van de leerkrachten in het secundair gebruikt al AI, en leerlingen gebruiken het nog vaker. Een gedeelde basis helpt om in elke school en elk vak dezelfde taal te spreken: wat AI is, hoe je het stuurt, waar je zelf de controle houdt en welke afspraken gelden. De voorbeelden komen uit onze eigen scholen (GO! atheneum Dendermonde, GO! talent, GO! atheneum Lokeren, GO! technisch atheneum Lokeren, GO! atheneum MiRA, GO! Campus Kompas en GO! middenschool De Moerbei), met vaste fictieve leerlingen uit alle finaliteiten. Zo herkent elke leerling zich, van lassen-constructie duaal tot Latijn.</p>
<h2>Hoe is de cursus opgebouwd</h2>
<p>Drie stappen: de basis (hoofdstuk 1 en 2), een keuzeroute (hoofdstuk 3 tot 8) en de afronding (hoofdstuk 9). Elke les is tekst met concrete prompts, opdrachten met eigen leerstof, kernpunten en een denkvraag. Elk hoofdstuk eindigt met een quiz van tien situaties (80 % om te slagen). Leerlingen hebben geen account nodig; de voortgang staat in hun browser. Ze kunnen een voortgangscode exporteren om op een ander toestel verder te gaan.</p>
<table class="tabel"><thead><tr><th>Hoofdstuk</th><th>Titel</th><th>Domein AI-geletterdheid</th><th>Lessen</th><th>Tijd</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Aansluiting bij ons pedagogisch project</h2>
<p>De cursus vertrekt vanuit het PPGO!, <em>samen leren samenleven</em>, en de zes kernwaarden van het GO!: respect, gelijkwaardigheid, oprechtheid, openheid, betrokkenheid en engagement. Concreet: leerlingen leren eerlijk vermelden welke AI-hulp ze gebruikten (oprechtheid), ze controleren bronnen en vooroordelen (respect en gelijkwaardigheid), ze delen wat werkt met klasgenoten (betrokkenheid) en ze denken na over de gevolgen van AI voor anderen en de samenleving (engagement). De rode draad "jij geeft richting, AI helpt, jij controleert" past bij de nadruk van Het leercollectief op eigenaarschap en groeikansen.</p>
<h2>Aansluiting bij de Vlaamse onderwijsdoelen</h2>
<p>De cursus sluit aan bij sleutelcompetentie 4, <em>digitale competentie en mediawijsheid</em>, en bij de <em>leercompetenties</em> en <em>competenties inzake burgerschap</em>. De hoofdstukken zijn gekoppeld aan de vier domeinen van het AI-geletterdheidskader van de Europese Commissie en de OESO, zoals Kenniscentrum Digisprong het samenvat: <em>Omgaan met AI</em>, <em>Creëren met AI</em>, <em>AI beheren</em> en <em>AI ontwerpen</em>. Vanaf 2029 wordt AI-geletterdheid ook getest in het PISA-onderzoek.</p>
<h2>Afspraken op school</h2>
<p>De cursus zegt nergens dat AI "altijd mag". Elke les verwijst naar de afspraken van de leerkracht en het schoolreglement. Les 4.11 helpt leerlingen om die afspraken concreet te maken en een logboek van hun AI-gebruik bij te houden. Wil je de cursus inzetten, maak dan vooraf duidelijk welke AI-hulp bij welke opdracht toegelaten is. Voor leerlingen die extra ondersteuning nodig hebben, verwijst de cursus naar de klastitularis, de leerlingenbegeleider, GO! CLB Prisma en Leersteuncentrum Plus².</p>
<h2>Tools en leeftijd</h2>
<p>Alle lessen werken met een gratis chatbot. De cursus noemt ChatGPT, Gemini, Microsoft Copilot, Claude en Vibe (vroeger Le Chat), telkens met de opmerking dat de school bepaalt wat toegelaten is. Leerlingen jonger dan dertien kunnen de meeste chatbots niet gebruiken; onder de achttien is toestemming van de ouders nodig voor een privéaccount. Een schoolaccount (Microsoft 365 of Google Workspace) valt onder de afspraken van de school.</p>
${config.leerkrachtenUrl ? `<h2>De cursus in je klas</h2>
<p>In de leeromgeving <em>AI voor leerkrachten</em> staat een module over het inzetten van deze cursus: wat erin zit, hoe je ze gebruikt in een lesuur, een GWP of als huiswerk, welke klasafspraken je maakt en hoe je opvolgt. <a href="${attr(config.leerkrachtenUrl)}">Open de module "De leerlingencursus in je klas"</a>.</p>` : ''}
<h2>Zelf aanpassen</h2>
<p>De cursus is open: de lessen zijn gewone tekstbestanden en de site wordt met één commando gebouwd. Je kunt lessen aanpassen aan je school, eigen video's toevoegen of hoofdstukken weglaten. Zie het bestand README.md in de projectmap.</p>
<p><a class="btn" href="${base}index.html">Terug naar het overzicht</a></p>
</div>`;
  return layout({ title: 'Voor leerkrachten', base, body, bodyClass: 'page-text' });
}

// ---------- build ----------
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

const all = loadCourse();
// Veiligheid: de uitvoermap wordt leeggemaakt, dus nooit de bronmap of haar ouder.
if (DIST === ROOT || ROOT.startsWith(DIST + path.sep) || [CONTENT, ASSETS].some(d => d.startsWith(DIST + path.sep))) {
  console.error(`Weiger te bouwen: uitvoermap ${DIST} overlapt met de bronmap.`); process.exit(1);
}
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copyDir(ASSETS, path.join(DIST, 'assets'));
let nLes = 0; const warnings = [];
for (const h of all) {
  fs.mkdirSync(path.join(DIST, h.map), { recursive: true });
  for (const les of h.lessen) {
    const { html, warnings: w } = lesPage(les, all);
    fs.writeFileSync(path.join(DIST, h.map, `${les.slug}.html`), html);
    w.forEach(x => warnings.push(`${les.id}: ${x}`));
    nLes++;
  }
}
fs.writeFileSync(path.join(DIST, 'index.html'), indexPage(all));
fs.writeFileSync(path.join(DIST, 'voor-leerkrachten.html'), leerkrachtenPage(all));
// structuur als JSON voor app.js (lesvolgorde, hoofdstukken)
const structuur = all.map(h => ({ map: h.map, nummer: h.nummer, titel: h.titel, stap: h.stap, route: !!h.route, lessen: h.lessen.map(l => ({ id: l.id, slug: l.slug, titel: l.data.title, type: l.type })) }));
fs.writeFileSync(path.join(DIST, 'assets', 'structuur.json'), JSON.stringify(structuur));
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
console.log(`Gebouwd: ${all.length} hoofdstukken, ${nLes} lessen → ${path.relative(ROOT, DIST) || "."}/`);
if (warnings.length) { console.log('Waarschuwingen:'); warnings.forEach(w => console.log(' - ' + w)); }
