// De startpagina: laadt het tafereel pas als de tekst al leesbaar is, koppelt
// de camera aan wat je aan het lezen bent, en valt terug op de vlakke schets
// als het toestel geen 3D kan of databesparing vraagt. Daarnaast: de spelden
// bij de aanklikbare plekken, het uitlegkaartje, de avondknop en de zaalmodus.
import { PLEKKEN, KAMERS } from './plekken.js';

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

// ── dag en avond ──
const avondKnop = podium.querySelector('.avond-knop');
avondKnop.addEventListener('click', () => {
  const aan = avondKnop.getAttribute('aria-pressed') !== 'true';
  avondKnop.setAttribute('aria-pressed', String(aan));
  avondKnop.querySelector('.avond-tekst').textContent = aan ? 'Dag' : 'Avond';
  podium.classList.toggle('nacht', aan);
  dio?.avond(aan);
});

// ── zaalmodus voor de beamer ──
const adres = new URL('./', location.href);
podium.querySelector('.zaal-adres').textContent = (adres.host + adres.pathname).replace(/\/$/, '');
function zetZaal(aan) {
  document.body.classList.toggle('zaal', aan);
  dio?.zaal(aan);
  if (!aan) { huidige = null; bepaalFocus(); }
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
if (vraag.has('schets') || !kanWebGL2()) {
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
