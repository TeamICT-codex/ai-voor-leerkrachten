// Loopt elke opdracht van Leerlichtjes door in een nagebootste pagina en noteert
// wat er voorgelezen wordt, zonder browser: elk sorteerspel, de bouwhoek in
// alle volgordes en het bureau met elke keuze. Zo bewees de ombouw naar
// ingelezen stemmen (oktober 2026) dat geen enkele tekst veranderde: de oude en
// de nieuwe code gaven dezelfde zinnen. Met lijst.json erbij toont het of elk
// pad een opname heeft ("0 naar de browserstem" is goed).
//
//   node lager/stem/naloop.mjs . uit.json lager/stem/lijst.json   (vanuit de projectmap)
//   node naloop.mjs <map met lager/> <uit.json> [lijst.json]
//
// Zonder lijst.json valt elke uiting terug op de (nagebootste) browserstem en
// noteren we de tekst. Met lijst.json bootsen we ook Audio na: dan noteren we
// welke mp3 er speelt, en wat er toch nog naar de browserstem ging.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , wortel, uitPad, lijstPad] = process.argv;

// ── een heel kleine DOM ──
class Klassen {
  constructor(el) { this.el = el; }
  get lijst() { return this.el.className.split(/\s+/).filter(Boolean); }
  zet(l) { this.el.className = [...new Set(l)].join(' '); }
  add(...k) { this.zet([...this.lijst, ...k]); }
  remove(...k) { this.zet(this.lijst.filter(x => !k.includes(x))); }
  contains(k) { return this.lijst.includes(k); }
  toggle(k, aan) { aan = aan === undefined ? !this.contains(k) : !!aan; aan ? this.add(k) : this.remove(k); return aan; }
}
class Tekst {
  constructor(t) { this.textContent = t; this.ouder = null; }
  remove() { if (this.ouder) { this.ouder.kinderen = this.ouder.kinderen.filter(k => k !== this); this.ouder = null; } }
}
class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase(); this.kinderen = []; this.ouder = null; this.attrs = {};
    this.className = ''; this.luisteraars = {}; this._tekst = ''; this.disabled = false; this.hidden = false;
    this.style = { setProperty() {} }; this.classList = new Klassen(this);
  }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'disabled') this.disabled = true; }
  removeAttribute(k) { delete this.attrs[k]; if (k === 'disabled') this.disabled = false; }
  getAttribute(k) { return this.attrs[k] ?? null; }
  get dataset() { const d = {}; for (const [k, v] of Object.entries(this.attrs)) if (k.startsWith('data-')) d[k.slice(5)] = v; return d; }
  addEventListener(t, f) { (this.luisteraars[t] ||= []).push(f); }
  click() { if (this.disabled) return false; for (const f of this.luisteraars.click || []) f({}); return true; }
  append(...ns) {
    for (const n of ns) {
      if (n == null) continue;
      const k = typeof n === 'string' ? new Tekst(n) : n;
      k.remove();
      k.ouder = this;
      this.kinderen.push(k);
    }
  }
  prepend(...ns) { const oud = this.kinderen; this.kinderen = []; this.append(...ns); this.kinderen.push(...oud); }
  replaceChildren(...ns) { for (const k of this.kinderen) k.ouder = null; this.kinderen = []; this._tekst = ''; this.append(...ns); }
  remove() { if (this.ouder) { this.ouder.kinderen = this.ouder.kinderen.filter(k => k !== this); this.ouder = null; } }
  set textContent(v) { this.replaceChildren(); this._tekst = String(v); }
  get textContent() { return this._tekst + this.kinderen.map(k => k.textContent).join(''); }
  set innerHTML(v) { this.replaceChildren(); this._html = v; }
  get innerHTML() { return this._html || ''; }
  get nextElementSibling() { const z = this.ouder?.kinderen.filter(k => k instanceof El) || []; return z[z.indexOf(this) + 1] || null; }
  *alle() { for (const k of this.kinderen) if (k instanceof El) { yield k; yield* k.alle(); } }
  past(deel) {
    const [tag, ...klassen] = deel.split('.');
    if (tag && this.tagName !== tag.toUpperCase()) return false;
    return klassen.every(k => this.classList.contains(k));
  }
  querySelectorAll(sel) {
    const delen = sel.trim().split(/\s+/);
    const laatste = delen.pop();
    return [...this.alle()].filter(e => {
      if (!e.past(laatste)) return false;
      let o = e.ouder, i = delen.length - 1;
      while (i >= 0 && o && o !== this) { if (o.past(delen[i])) i--; o = o.ouder; }
      return i < 0;
    });
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
}

// ── nagebootste browser ──
const log = [];       // wat er voorgelezen werd, in volgorde
const terugval = [];  // wat naar de browserstem ging
globalThis.window = globalThis;
globalThis.document = { createElement: t => new El(t), body: new El('body') };
document.body.className = 'lees-mee';
globalThis.matchMedia = () => ({ matches: true }); // "minder beweging": geen wachttijden
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
Object.defineProperty(globalThis, 'speechSynthesis', { configurable: true, value: {
  getVoices: () => [{ lang: 'nl-BE', name: 'nagebootst' }],
  speak(u) { log.push(u.text); terugval.push(u.text); setTimeout(() => u.onend?.(), 0); },
  cancel() {}, speaking: false, addEventListener() {},
} });
let lijst = null, opSleutel = null;
if (lijstPad) {
  lijst = JSON.parse(fs.readFileSync(lijstPad, 'utf8'));
  opSleutel = new Map(Object.entries(lijst.teksten).map(([t, s]) => [s, t]));
  globalThis.fetch = async url => ({ ok: true, json: async () => lijst, blob: async () => ({ url: String(url) }) });
  globalThis.URL.createObjectURL = b => 'blob:' + b.url;
  globalThis.Audio = class {
    constructor(src) { this.src = src || ''; this.luisteraars = {}; this.duration = 1; this.currentTime = 0; }
    addEventListener(t, f) { (this.luisteraars[t] ||= []).push(f); }
    removeEventListener(t, f) { this.luisteraars[t] = (this.luisteraars[t] || []).filter(x => x !== f); }
    load() {}
    pause() {}
    play() {
      const m = String(this.src).match(/([0-9a-f]{12})\.mp3$/);
      log.push(m ? opSleutel.get(m[1]) ?? `ONBEKEND ${this.src}` : `ONBEKEND ${this.src}`);
      setTimeout(() => { for (const f of this.luisteraars.ended || []) f({}); this.onended?.(); }, 0);
      return Promise.resolve();
    }
  };
} else {
  globalThis.fetch = () => Promise.reject(new Error('geen netwerk in de naloop'));
}

const rust = (ms = 25) => new Promise(r => setTimeout(r, ms));
const knopMet = (vak, tekst) => vak.querySelectorAll('button').find(b => b.textContent === tekst);

const laad = p => import(pathToFileURL(path.join(wortel, p)).href);
const g1 = await laad('lager/1ste-graad/stations.js');
const paden = {};
function begin() { log.length = 0; }
function bewaar(naam) { paden[naam] = [...log]; }

for (const id of ['ontdekhoek', 'kring', 'laatjeskast']) {
  const s = g1.STATIONS.find(x => x.id === id);
  for (const volgorde of [[0, 1], [1, 0]]) {
    begin();
    const vak = new El('div');
    let klaar = false;
    s.maak(vak, () => { klaar = true; });
    await rust();
    const kaarten = vak.querySelectorAll('.ll-kaart');
    const bakken = vak.querySelectorAll('.ll-bak');
    for (const kaart of kaarten)
      for (const b of volgorde) {
        if (kaart.disabled) break;
        kaart.click(); await rust();
        bakken[b].click(); await rust();
      }
    await rust(60);
    if (!klaar) throw new Error(`${id} niet klaar`);
    bewaar(`${id} ${volgorde.join('')}`);
  }
}

function* permutaties(a) { if (a.length <= 1) { yield a; return; } for (let i = 0; i < a.length; i++) for (const r of permutaties([...a.slice(0, i), ...a.slice(i + 1)])) yield [a[i], ...r]; }
{
  const s = g1.STATIONS.find(x => x.id === 'bouwhoek');
  const vak0 = new El('div'); s.maak(vak0, () => {}); await rust();
  const namen = vak0.querySelectorAll('.ll-speelgoed').map(b => b.getAttribute('aria-label'));
  for (const p of permutaties(namen)) {
    begin();
    const vak = new El('div');
    let klaar = false;
    s.maak(vak, () => { klaar = true; });
    await rust();
    const bak = id => vak.querySelectorAll('.ll-bak').find(b => b.dataset.bak === id);
    const speelgoed = n => vak.querySelectorAll('.ll-speelgoed').find(b => b.getAttribute('aria-label') === n);
    bak('blok').click(); await rust();                     // nog niets gekozen
    for (const n of p)
      for (const b of ['bal', 'blok']) {
        if (!speelgoed(n)) break;
        speelgoed(n).click(); await rust();
        bak(b).click(); await rust();
      }
    knopMet(vak, 'Laat het lichtje sorteren').click(); await rust(150);
    bak('blok').click(); await rust();                     // fase 3, nog niets gekozen
    const geel = vak.querySelectorAll('.ll-speelgoed')[0].getAttribute('aria-label');
    speelgoed(geel).click(); await rust();
    bak('bal').click(); await rust();                      // juist, maar we willen een foutje
    bak('blok').click(); await rust();
    knopMet(vak, 'Laat het lichtje sorteren').click(); await rust(150);
    knopMet(vak, 'Leg de gele ballen in de ballenbak').click(); await rust();
    knopMet(vak, 'Laat het lichtje nog eens sorteren').click(); await rust(150);
    if (!klaar) throw new Error('bouwhoek niet klaar: ' + p.join(', '));
    bewaar('bouwhoek ' + p.join(' | '));
  }
}

{
  const s = g1.STATIONS.find(x => x.id === 'bureau');
  for (const keuze of ['Ik doe verder', 'Ik vraag het aan een grote mens']) {
    begin();
    const vak = new El('div');
    let klaar = false;
    s.maak(vak, () => { klaar = true; });
    await rust();
    for (let i = 0; i < 20 && !klaar; i++) {
      knopMet(vak, keuze).click(); await rust();
      (knopMet(vak, 'Volgend scherm') || knopMet(vak, 'Klaar')).click(); await rust();
    }
    await rust(60);
    if (!klaar) throw new Error('bureau niet klaar');
    bewaar('bureau ' + keuze);
  }
}

// Lees voor: wat de knop in Ontdek en Praat samen voorleest.
const leesVoor = {};
let voeg;
try { ({ voorleesTekst: voeg } = await laad('lager/stem.js')); } catch { voeg = t => t.join(' '); }
for (const g of ['1ste', '2de', '3de']) {
  const { STATIONS } = await laad(`lager/${g}-graad/stations.js`);
  for (const s of STATIONS) {
    leesVoor[`${g} ${s.id} ontdek`] = voeg(s.ontdek);
    leesVoor[`${g} ${s.id} praat`] = voeg(s.praat);
  }
}
const stations = {};
for (const g of ['1ste', '2de', '3de']) {
  const { STATIONS } = await laad(`lager/${g}-graad/stations.js`);
  stations[g] = STATIONS.map(({ id, nummer, naam, vraag, kleur, ontdek, praat, onthoud }) => ({ id, nummer, naam, vraag, kleur, ontdek, praat, onthoud }));
}

const leesMee = [...new Set(Object.values(paden).flat())].sort();
fs.writeFileSync(uitPad, JSON.stringify({ leesMee, leesVoor, paden, stations, terugval: [...new Set(terugval)] }, null, 1));
console.log(`${Object.keys(paden).length} paden, ${leesMee.length} verschillende teksten bij Lees mee, ${Object.keys(leesVoor).length} bij Lees voor, ${new Set(terugval).size} naar de browserstem`);
process.exit(0);
