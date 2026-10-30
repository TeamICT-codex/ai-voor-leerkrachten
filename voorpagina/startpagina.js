// De startpagina: laadt het tafereel pas als de tekst al leesbaar is, koppelt
// de camera aan wat je aan het lezen bent, en valt terug op de vlakke schets
// als het toestel geen 3D kan of databesparing vraagt. Daarnaast: de spelden
// bij de aanklikbare plekken, het uitlegkaartje, de avondknop en de zaalmodus,
// en de sfeer: dag en nacht volgens het uur in Dendermonde, het seizoen, en in de
// zaalmodus ook het weer van vandaag.
import { PLEKKEN, KAMERS } from './plekken.js';
import { zonnehoogte, lichtVanZon, seizoenOp, klokInDendermonde, haalWeer, weerZin, TIJDREIS, TIJDREIS_DUUR, sleutelwaarden, tekenLucht } from './sfeer.js';

const podium = document.querySelector('.podium');
const canvas = podium.querySelector('.tafereel');
const hoofdstukken = [...document.querySelectorAll('.hoofdstuk')];
const verhaal = document.querySelector('.verhaal');
const labels = Object.fromEntries([...podium.querySelectorAll('.label')].map(el => [el.dataset.kamer, el]));
const hint = podium.querySelector('.hint');

// Om te testen: ?stil doet alsof je minder beweging vraagt, ?schets alsof je
// toestel geen 3D kan, ?zwak alsof het een traag toestel is.
const vraag = new URLSearchParams(location.search);
const stil = matchMedia('(prefers-reduced-motion: reduce)').matches || vraag.has('stil');
const spaarstand = navigator.connection?.saveData === true;
// Zwakke toestellen: minder pixels en kleinere schaduwen. Het tafereel stuurt
// zelf nog bij als het beeld toch hapert.
const zwak = vraag.has('zwak') || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const mobiel = () => matchMedia('(max-width: 899px)').matches;
const aanraak = matchMedia('(pointer: coarse)').matches;

let dio = null;
let huidige = null;

function kanWebGL2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

// ── spelden ──
const pinnen = {};
const pinVak = podium.querySelector('.pinnen');
for (const p of PLEKKEN) {
  const knop = document.createElement('button');
  knop.type = 'button';
  knop.className = 'pin';
  knop.hidden = true;
  knop.setAttribute('aria-label', 'Uitleg: ' + p.titel);
  const stip = document.createElement('span');
  stip.className = 'pin-stip';
  stip.setAttribute('aria-hidden', 'true');
  const titel = document.createElement('span');
  titel.className = 'pin-titel';
  titel.textContent = p.titel;
  knop.append(stip, titel);
  knop.addEventListener('click', () => openPlek(p.id));
  for (const [soort, id] of [['pointerenter', p.id], ['focus', p.id], ['pointerleave', null], ['blur', null]]) {
    knop.addEventListener(soort, () => dio?.markeer(id));
  }
  pinVak.append(knop);
  pinnen[p.id] = knop;
}

async function laadTafereel() {
  podium.querySelector('.toon-toch').hidden = true;
  podium.classList.remove('zonder-3d');
  try {
    const { maakDiorama } = await import('./diorama.js');
    dio = await maakDiorama(canvas, {
      stil,
      zwak,
      labels,
      pinnen,
      onKamer: kamer => naarHoofdstuk(kamer),
      onHover: kamer => { for (const [k, el] of Object.entries(labels)) el.classList.toggle('actief', k === kamer); },
      onPlek: id => openPlek(id),
      onPlekHover: id => { for (const [k, el] of Object.entries(pinnen)) el.classList.toggle('actief', k === id); },
      onFout: () => podium.classList.remove('klaar'),
    });
    // Een plek in plekken.js zonder voorwerp in het tafereel, of omgekeerd,
    // valt anders stil weg.
    const inTafereel = new Set(dio.plekken.map(p => p.id));
    for (const p of PLEKKEN) if (!inTafereel.has(p.id)) console.warn('Plek zonder voorwerp in het tafereel:', p.id);
    for (const id of inTafereel) if (!pinnen[id]) console.warn('Voorwerp zonder tekst in plekken.js:', id);

    podium.classList.add('klaar');
    pasSfeerToe({ direct: true });
    if (!stil) requestAnimationFrame(hemelLus);
    if (vraag.has('debug')) window.dio = dio;
    if (!stil && !zwak) podium.classList.add('rijk');
    hint.textContent = aanraak
      ? 'Tik op een bolletje voor uitleg, of veeg opzij om de school te draaien.'
      : 'Klik op een bolletje voor uitleg, of sleep om de school te draaien.';
    huidige = null;
    bepaalFocus();
    if (vraag.has('zaal')) zetZaal(true);
  } catch (fout) {
    console.warn('Het tafereel kon niet laden; de schets blijft staan.', fout);
    podium.classList.add('zonder-3d');
  }
}
// De hint verdwijnt zodra iemand iets doet met het tafereel.
function hintWeg() { podium.classList.add('hint-weg'); }
canvas.addEventListener('pointerdown', hintWeg, { once: true });

function naarHoofdstuk(kamer) {
  const doel = hoofdstukken.find(h => h.dataset.kamer === kamer);
  doel?.scrollIntoView({ behavior: stil ? 'auto' : 'smooth', block: 'start' });
}

// Welk hoofdstuk lees je nu? Op de gsm is dat wat net onder het podium staat,
// op een groot scherm wat in het midden staat.
function bepaalFocus() {
  const pb = podium.getBoundingClientRect();
  const lijn = mobiel() ? pb.bottom + (innerHeight - pb.bottom) * 0.3 : innerHeight * 0.5;
  let kamer = 'overzicht';
  for (const h of hoofdstukken) {
    const r = h.getBoundingClientRect();
    if (r.top <= lijn && r.bottom > lijn) kamer = h.dataset.kamer;
  }
  if (verhaal.getBoundingClientRect().bottom < lijn) kamer = 'overzicht';
  if (kamer === huidige) return;
  huidige = kamer;
  // Wie verder scrolt naar een andere verdieping, laat het kaartje achter.
  if (open && kamerVanFocus(kamer) !== plekVan(open).kamer) sluitPlek(false);
  dio?.focus(kamer);
  for (const [k, el] of Object.entries(labels)) el.classList.toggle('gekozen', k === kamer);
  for (const h of hoofdstukken) h.classList.toggle('in-beeld', h.dataset.kamer === kamer);
}
const kamerVanFocus = focus => (KAMERS[focus] && focus !== 'buiten' ? focus : 'buiten');
let gepland = false;
addEventListener('scroll', () => {
  if (gepland) return;
  gepland = true;
  requestAnimationFrame(() => { gepland = false; bepaalFocus(); });
}, { passive: true });
addEventListener('resize', () => { huidige = null; bepaalFocus(); });

for (const el of Object.values(labels)) el.addEventListener('click', () => naarHoofdstuk(el.dataset.kamer));

// ── het uitlegkaartje ──
const kaart = podium.querySelector('.uitleg');
const kaartDelen = {
  waar: kaart.querySelector('.uitleg-waar'),
  titel: kaart.querySelector('#uitleg-titel'),
  tekst: kaart.querySelector('.uitleg-tekst'),
  link: kaart.querySelector('.uitleg-link'),
  teller: kaart.querySelector('.uitleg-teller'),
  vorige: kaart.querySelector('.uitleg-vorige'),
  volgende: kaart.querySelector('.uitleg-volgende'),
};
const VOLGORDE_KAMERS = ['buiten', 'directie', 'klas', 'leerling', 'lager'];
const plekVan = id => PLEKKEN.find(p => p.id === id);
const plekkenIn = kamer => PLEKKEN.filter(p => p.kamer === kamer);
let open = null, terugNaar = null;

function openPlek(id) {
  const p = plekVan(id);
  if (!p) return;
  if (!open) terugNaar = pinnen[id];
  open = id;
  hintWeg();
  kaartDelen.waar.textContent = KAMERS[p.kamer];
  kaartDelen.titel.textContent = p.titel;
  kaartDelen.tekst.textContent = p.tekst;
  kaartDelen.link.href = p.link.href;
  kaartDelen.link.textContent = p.link.tekst;
  const lijst = plekkenIn(p.kamer), i = lijst.indexOf(p);
  const volgendeKamer = VOLGORDE_KAMERS[VOLGORDE_KAMERS.indexOf(p.kamer) + 1];
  kaartDelen.teller.textContent = `${i + 1} van ${lijst.length}`;
  kaartDelen.vorige.disabled = i === 0;
  kaartDelen.volgende.textContent = i < lijst.length - 1 ? 'Volgende →' : volgendeKamer ? 'Volgende verdieping →' : 'Klaar';
  kaart.hidden = false;
  podium.classList.add('kaart-open');
  for (const [k, el] of Object.entries(pinnen)) el.classList.toggle('open', k === id);
  dio?.toonPlek(id, { opzij: mobiel() });
  kaartDelen.titel.focus({ preventScroll: true });
}
function sluitPlek(focusTerug = true) {
  if (!open) return;
  open = null;
  kaart.hidden = true;
  podium.classList.remove('kaart-open');
  for (const el of Object.values(pinnen)) el.classList.remove('open');
  dio?.toonPlek(null);
  if (focusTerug && terugNaar && !terugNaar.hidden) terugNaar.focus({ preventScroll: true });
}
function stap(richting) {
  if (!open) return;
  const p = plekVan(open), lijst = plekkenIn(p.kamer), i = lijst.indexOf(p) + richting;
  if (i >= 0 && i < lijst.length) { openPlek(lijst[i].id); return; }
  if (richting < 0) return;
  // Op het einde van een verdieping: naar de volgende, zoals bij het scrollen.
  const volgendeKamer = VOLGORDE_KAMERS[VOLGORDE_KAMERS.indexOf(p.kamer) + 1];
  sluitPlek(false);
  if (!volgendeKamer) return;
  if (document.body.classList.contains('zaal')) {
    dio?.focus(volgendeKamer);
    setTimeout(() => openPlek(plekkenIn(volgendeKamer)[0].id), stil ? 0 : 900);
  } else {
    naarHoofdstuk(volgendeKamer);
  }
}
kaart.querySelector('.uitleg-sluit').addEventListener('click', () => sluitPlek());
kaartDelen.vorige.addEventListener('click', () => stap(-1));
kaartDelen.volgende.addEventListener('click', () => stap(1));

// ── de sfeer: dag en nacht, het seizoen en het weer ──
// Het licht volgt het uur in Dendermonde en het seizoen de datum. De avondknop
// wint het van de klok tot je de pagina opnieuw laadt.
const luchtDoek = podium.querySelector('.lucht-doek');
const luchtCtx = luchtDoek.getContext('2d');
const avondKnop = podium.querySelector('.avond-knop');
const weerbord = podium.querySelector('.weerbord');
let avondKeuze = null;  // null: volg de klok; true of false: zelf gekozen
let weerNu = null;      // het weer van daarnet, enkel in de zaalmodus
let tijdreis = null;    // { start } terwijl een tijdreis loopt
const RUSTIG_WEER = { regen: 0, sneeuw: 0, mist: 0, onweer: 0, wind: 0.15 };

function tekenHemel(licht) {
  const r = podium.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const b = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (luchtDoek.width !== b || luchtDoek.height !== h) { luchtDoek.width = b; luchtDoek.height = h; }
  tekenLucht(luchtCtx, b, h, licht);
  podium.classList.toggle('nacht', licht.nacht > 0.5);
}
function lichtNu() { return { ...dio.licht(), mist: dio.weerNu?.().mist ?? 0 }; }
// De motor laat het licht zacht overlopen; de hemel volgt beeld per beeld, en
// tekent alleen opnieuw als er iets veranderd is.
let hemelHandtekening = '';
function hemelLus() {
  if (dio && !document.hidden) {
    const licht = lichtNu();
    const h = [licht.nacht, licht.schemer, licht.bewolking, licht.mist, licht.flits].map(x => x.toFixed(3)).join('|');
    if (h !== hemelHandtekening) { hemelHandtekening = h; tekenHemel(licht); }
  }
  requestAnimationFrame(hemelLus);
}
new ResizeObserver(() => { hemelHandtekening = ''; if (stil && dio) tekenHemel(lichtNu()); }).observe(podium);

function zetAvondKnop(avond) {
  avondKnop.setAttribute('aria-pressed', String(avond));
  avondKnop.querySelector('.avond-tekst').textContent = avond ? 'Dag' : 'Avond';
}
function pasSfeerToe({ direct = false } = {}) {
  if (!dio || tijdreis) return;
  const licht = lichtVanZon(zonnehoogte(new Date()));
  if (avondKeuze != null) { licht.nacht = avondKeuze ? 1 : 0; licht.schemer = 0; }
  dio.sfeer({ ...licht, bewolking: weerNu ? weerNu.bewolking : 0.1 }, { direct });
  dio.weer({ ...(weerNu ? weerNu.weer : RUSTIG_WEER), sneeuwlaag: null }, { direct });
  dio.seizoen(seizoenOp(), { direct });
  zetAvondKnop(licht.nacht > 0.5);
  if (stil) { dio.herteken(); tekenHemel(lichtNu()); }
}
avondKnop.addEventListener('click', () => {
  avondKeuze = avondKnop.getAttribute('aria-pressed') !== 'true';
  pasSfeerToe();
});
// Elke vijf minuten bijwerken: de zon schuift traag genoeg.
setInterval(() => { if (!document.body.classList.contains('zaal')) pasSfeerToe(); }, 5 * 60e3);

// ── zaalmodus voor de beamer ──
const adres = new URL('./', location.href);
podium.querySelector('.zaal-adres').textContent = (adres.host + adres.pathname).replace(/\/$/, '');
const wekkers = [];
function toonWeerbord() {
  weerbord.querySelector('.weer-klok').textContent = `Dendermonde · ${klokInDendermonde()}`;
  weerbord.querySelector('.weer-meting').textContent = tijdreis ? 'Een jaar in een halve minuut' : weerZin(weerNu);
  weerbord.querySelector('.weer-bron').hidden = !weerNu || !!tijdreis;
}
async function werkWeerBij() {
  const w = await haalWeer();
  if (!document.body.classList.contains('zaal')) return;
  weerNu = w;
  toonWeerbord();
  pasSfeerToe();
}
// Een tijdreis: een jaar in een halve minuut, om de vier minuten, zodat er op de
// beamer altijd iets beweegt terwijl de zaal binnenloopt. Daarna terug naar nu.
function startTijdreis() {
  if (stil || !dio || tijdreis) return;
  tijdreis = { start: performance.now() };
  toonWeerbord();
  requestAnimationFrame(tijdreisStap);
}
function stopTijdreis() {
  if (!tijdreis) return;
  tijdreis = null;
  toonWeerbord();
  pasSfeerToe();
}
function tijdreisStap(nu) {
  if (!tijdreis) return;
  const t = (nu - tijdreis.start) / 1000;
  if (t > TIJDREIS_DUUR) { stopTijdreis(); return; }
  const v = sleutelwaarden(TIJDREIS, t);
  dio.sfeer({ nacht: v.nacht, schemer: v.schemer, bewolking: v.bewolking });
  dio.weer({ regen: v.regen, sneeuw: v.sneeuw, mist: v.mist, wind: v.wind, onweer: v.onweer, sneeuwlaag: v.sneeuwlaag });
  dio.seizoen(v.seizoen % 4);
  requestAnimationFrame(tijdreisStap);
}
function zetZaal(aan) {
  document.body.classList.toggle('zaal', aan);
  dio?.zaal(aan);
  while (wekkers.length) clearInterval(wekkers.pop());
  if (aan) {
    toonWeerbord();
    werkWeerBij();
    wekkers.push(setInterval(werkWeerBij, 15 * 60e3));
    wekkers.push(setInterval(() => { toonWeerbord(); pasSfeerToe(); }, 60e3));
    if (!stil) {
      wekkers.push(setTimeout(startTijdreis, 60e3));
      wekkers.push(setInterval(startTijdreis, 4 * 60e3));
    }
  } else {
    // Buiten de zaal geen weer meer: dan haalt de pagina ook niets meer op.
    weerNu = null;
    stopTijdreis();
    pasSfeerToe();
    huidige = null; bepaalFocus();
  }
}
document.querySelector('.zaal-knop').addEventListener('click', async () => {
  zetZaal(true);
  try { await document.documentElement.requestFullscreen?.(); } catch { /* geen volledig scherm: de zaalmodus werkt ook zo */ }
});
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('zaal')) zetZaal(false); });

addEventListener('keydown', e => {
  const zaal = document.body.classList.contains('zaal');
  if (e.key === 'Escape') {
    // Eerst het kaartje dicht, pas daarna de zaalmodus uit.
    if (open) sluitPlek();
    else if (zaal) zetZaal(false);
    return;
  }
  // Met de pijltjes door de plekken: handig voor wie het tafereel op de beamer toont.
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  if (!open && !zaal) return;
  if (!zaal && !kaart.contains(document.activeElement)) return;
  e.preventDefault();
  if (open) stap(e.key === 'ArrowRight' ? 1 : -1);
  else openPlek(plekkenIn('buiten')[0].id);
});

// ── starten ──
bepaalFocus();
requestAnimationFrame(() => podium.classList.add('dag'));
if (vraag.has('film') && kanWebGL2()) {
  // De filmmodus voor de teaser: zie film.js.
  import('./film.js').then(m => m.draaiFilm({ opname: vraag.has('opname'), formaat: vraag.get('film') || 'breed' }));
} else if (vraag.has('schets') || !kanWebGL2()) {
  podium.classList.add('zonder-3d');
} else if (spaarstand) {
  podium.classList.add('zonder-3d');
  const knop = podium.querySelector('.toon-toch');
  knop.hidden = false;
  knop.addEventListener('click', laadTafereel, { once: true });
} else {
  // Eerst de pagina laten verschijnen, dan pas de 3D-code ophalen.
  const later = window.requestIdleCallback || (f => setTimeout(f, 200));
  if (document.readyState === 'complete') later(laadTafereel, { timeout: 800 });
  else addEventListener('load', () => later(laadTafereel, { timeout: 800 }), { once: true });
}
