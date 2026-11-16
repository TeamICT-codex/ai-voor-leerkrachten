// De pagina van Het Rekencollectief: laadt de toren pas als de tekst al leesbaar
// is, koppelt de camera aan wat je aan het lezen bent, en valt terug op de vlakke
// schets als het toestel geen 3D kan of databesparing vraagt. Daarnaast: de
// spelden bij de aanklikbare plekken, het uitlegkaartje, de avondknop en "Speel
// het verhaal af". Het licht volgt het uur in Dendermonde, net als op de voorpagina.
// Deze pagina haalt niets op bij een andere server; de enige links naar buiten
// zijn de knoppen naar de app. Werkwijze en valkuilen: zie team-ict/pagina.js en
// voorpagina/startpagina.js, waar dit van komt.
import { PLEKKEN, KAMERS, ADRES, VERHAAL_REGELS } from './plekken.js';
import { zonnehoogte, lichtVanZon, tekenLucht } from '../voorpagina/sfeer.js';

const podium = document.querySelector('.podium');
const canvas = podium.querySelector('.tafereel');
const hoofdstukken = [...document.querySelectorAll('.hoofdstuk')];
const indeling = document.querySelector('.indeling');
const labels = Object.fromEntries([...podium.querySelectorAll('.label')].map(el => [el.dataset.kamer, el]));
const hint = podium.querySelector('.hint');

// Om te testen: ?stil doet alsof je minder beweging vraagt, ?schets alsof je
// toestel geen 3D kan, ?zwak alsof het een traag toestel is, ?debug zet window.dio klaar.
const vraag = new URLSearchParams(location.search);
const stil = matchMedia('(prefers-reduced-motion: reduce)').matches || vraag.has('stil');
const spaarstand = navigator.connection?.saveData === true;
const zwak = vraag.has('zwak') || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const mobiel = () => matchMedia('(max-width: 899px)').matches;
const aanraak = matchMedia('(pointer: coarse)').matches;

let dio = null;
let huidige = null;

function kanWebGL2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

// ── de tekst: het adres van de app, en de bolletjes van elke kamer als lijst ──
for (const a of document.querySelectorAll('a[data-app]')) a.href = ADRES + a.dataset.app;
const plekVan = id => PLEKKEN.find(p => p.id === id);
const plekkenIn = kamer => PLEKKEN.filter(p => p.kamer === kamer);
for (const lijst of document.querySelectorAll('.punten[data-kamer]')) {
  for (const p of plekkenIn(lijst.dataset.kamer)) {
    const li = document.createElement('li'), titel = document.createElement('strong'), tekst = document.createElement('span');
    titel.textContent = p.titel;
    tekst.textContent = p.tekst;
    li.append(titel, tekst);
    lijst.append(li);
  }
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
    knop.addEventListener(soort, () => {
      dio?.markeer(id);
      // In de rechterhelft staat de titel links van de speld: anders loopt hij uit het podium.
      if (id) knop.classList.toggle('rechts', knop.getBoundingClientRect().left - podium.getBoundingClientRect().left > podium.clientWidth * 0.55);
    });
  }
  pinVak.append(knop);
  pinnen[p.id] = knop;
}

async function laadTafereel() {
  podium.querySelector('.toon-toch').hidden = true;
  podium.classList.remove('zonder-3d');
  try {
    const { maakToren } = await import('./toren.js');
    dio = await maakToren(canvas, {
      stil,
      zwak,
      labels,
      pinnen,
      // Terwijl het verhaal speelt, scrolt een klik op een kamer de pagina niet weg.
      onKamer: kamer => { if (!verhaalBezig()) naarHoofdstuk(kamer); },
      onHover: kamer => { for (const [k, el] of Object.entries(labels)) el.classList.toggle('actief', k === kamer); },
      onPlek: id => openPlek(id),
      onPlekHover: id => { for (const [k, el] of Object.entries(pinnen)) el.classList.toggle('actief', k === id); },
      onFout: () => { stopVerhaal({ focusTerug: false }); podium.classList.remove('klaar'); podium.classList.add('zonder-3d'); },
    });
    // Een plek in plekken.js zonder voorwerp in het tafereel, of omgekeerd, valt
    // anders stil weg. controle.mjs kijkt hetzelfde na zonder browser.
    const inTafereel = new Set(dio.plekken.map(p => p.id));
    for (const p of PLEKKEN) if (!inTafereel.has(p.id)) console.warn('Plek zonder voorwerp in het tafereel:', p.id);
    for (const id of inTafereel) if (!pinnen[id]) console.warn('Voorwerp zonder tekst in plekken.js:', id);

    podium.classList.add('klaar');
    pasSfeerToe({ direct: true });
    if (!stil) requestAnimationFrame(hemelLus);
    if (vraag.has('debug')) window.dio = dio;
    if (!stil && !zwak) podium.classList.add('rijk');
    hint.textContent = aanraak
      ? 'Tik op een bolletje voor uitleg, of veeg opzij om de toren te draaien.'
      : 'Klik op een bolletje voor uitleg, of sleep om de toren te draaien.';
    setTimeout(hintWeg, 9000);
    huidige = null;
    bepaalFocus();
  } catch (fout) {
    console.warn('De toren kon niet laden; de schets blijft staan.', fout);
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
// op een groot scherm wat in het midden staat. kaartBlijft: na een resize (op de
// gsm ook als de adresbalk in- of uitklapt) blijft een open kaartje staan.
function bepaalFocus({ kaartBlijft = false } = {}) {
  const pb = podium.getBoundingClientRect();
  const lijn = mobiel() ? pb.bottom + (innerHeight - pb.bottom) * 0.3 : innerHeight * 0.5;
  let kamer = 'overzicht';
  for (const h of hoofdstukken) {
    const r = h.getBoundingClientRect();
    if (r.top <= lijn && r.bottom > lijn) kamer = h.dataset.kamer;
  }
  if (indeling.getBoundingClientRect().bottom < lijn) kamer = 'overzicht';
  if (kamer === huidige) return;
  huidige = kamer;
  // Terwijl het verhaal speelt, stuurt de tijdlijn de camera, niet het scrollen.
  if (!verhaalBezig()) {
    if (!kaartBlijft && open && kamer !== plekVan(open).kamer) sluitPlek(false);
    dio?.focus(kamer);
  }
  for (const [k, el] of Object.entries(labels)) el.classList.toggle('gekozen', k === kamer);
  podium.classList.toggle('in-kamer', kamer !== 'overzicht');
  for (const h of hoofdstukken) h.classList.toggle('in-beeld', h.dataset.kamer === kamer);
}
let gepland = false;
addEventListener('scroll', () => {
  if (gepland) return;
  gepland = true;
  requestAnimationFrame(() => { gepland = false; bepaalFocus(); });
}, { passive: true });
addEventListener('resize', () => { huidige = null; bepaalFocus({ kaartBlijft: true }); });
for (const el of Object.values(labels)) el.addEventListener('click', () => naarHoofdstuk(el.dataset.kamer));

// ── vrije ruimte naast een paneel ──
// Ligt het kaartje of het verhaalbord over het podium (laptop), dan kadert de
// camera in wat vrij blijft: ernaast of erboven. De motor kiest per kader wat het
// tafereel het grootst laat. Op de gsm staan beide onder het podium: alles vrij.
const kaart = podium.querySelector('.uitleg');
const bord = podium.querySelector('.verhaalbord');
let vrijeRuimte = '';
function zetVrijeRuimte() {
  if (!dio) return;
  const paneel = !kaart.hidden ? kaart : !bord.hidden ? bord : null;
  let keuzes = [];
  if (paneel && !mobiel()) {
    const p = podium.getBoundingClientRect(), b = paneel.getBoundingClientRect();
    const naast = (b.right - p.left) / p.width + 0.03, boven = (p.bottom - b.top) / p.height + 0.03;
    keuzes = naast > 0.7 ? [{ onder: boven }] : [{ links: naast }, { onder: boven }];
  }
  const sleutel = JSON.stringify(keuzes);
  if (sleutel === vrijeRuimte) return;
  vrijeRuimte = sleutel;
  dio.vrijeRuimte(...keuzes);
}
new ResizeObserver(() => zetVrijeRuimte()).observe(kaart);
new ResizeObserver(() => zetVrijeRuimte()).observe(bord);

// ── het uitlegkaartje ──
const kaartDelen = {
  waar: kaart.querySelector('.uitleg-waar'),
  titel: kaart.querySelector('#uitleg-titel'),
  tekst: kaart.querySelector('.uitleg-tekst'),
  teller: kaart.querySelector('.uitleg-teller'),
  vorige: kaart.querySelector('.uitleg-vorige'),
  volgende: kaart.querySelector('.uitleg-volgende'),
};
// Van onder naar boven: je klimt van de poort naar de sterrenwacht.
const VOLGORDE_KAMERS = ['hal', 'oefen', 'meet', 'kleur', 'ster'];
let open = null, terugNaar = null;

function openPlek(id) {
  const p = plekVan(id);
  if (!p || verhaalBezig()) return;
  if (!bord.hidden) stopVerhaal({ focusTerug: false });
  if (!open) terugNaar = pinnen[id];
  open = id;
  hintWeg();
  kaartDelen.waar.textContent = KAMERS[p.kamer].naam;
  kaartDelen.titel.textContent = p.titel;
  kaartDelen.tekst.textContent = p.tekst;
  const lijst = plekkenIn(p.kamer), i = lijst.indexOf(p);
  const volgendeKamer = VOLGORDE_KAMERS[VOLGORDE_KAMERS.indexOf(p.kamer) + 1];
  kaartDelen.teller.textContent = `${i + 1} van ${lijst.length}`;
  kaartDelen.vorige.disabled = i === 0;
  kaartDelen.volgende.textContent = i < lijst.length - 1 ? 'Volgende →' : volgendeKamer ? 'Een verdieping hoger →' : 'Klaar';
  kaart.hidden = false;
  podium.classList.add('kaart-open');
  for (const [k, el] of Object.entries(pinnen)) el.classList.toggle('open', k === id);
  zetVrijeRuimte();
  dio?.toonPlek(id, { opzij: true });
  kaartDelen.titel.focus({ preventScroll: true });
}
function sluitPlek(focusTerug = true) {
  if (!open) return;
  const focusInKaart = kaart.contains(document.activeElement);
  open = null;
  kaart.hidden = true;
  podium.classList.remove('kaart-open');
  for (const el of Object.values(pinnen)) el.classList.remove('open');
  dio?.toonPlek(null);
  zetVrijeRuimte();
  const zichtbaar = terugNaar?.isConnected && terugNaar.offsetParent !== null;
  if ((focusTerug || focusInKaart) && zichtbaar) terugNaar.focus({ preventScroll: true });
}
function stap(richting) {
  if (!open) return;
  const p = plekVan(open), lijst = plekkenIn(p.kamer), i = lijst.indexOf(p) + richting;
  if (i >= 0 && i < lijst.length) { openPlek(lijst[i].id); return; }
  if (richting < 0) return;
  // Op het einde van een verdieping: een verdieping hoger, zoals bij het scrollen.
  const volgendeKamer = VOLGORDE_KAMERS[VOLGORDE_KAMERS.indexOf(p.kamer) + 1];
  sluitPlek(false);
  if (volgendeKamer) naarHoofdstuk(volgendeKamer);
}
kaart.querySelector('.uitleg-sluit').addEventListener('click', () => sluitPlek());
kaartDelen.vorige.addEventListener('click', () => stap(-1));
kaartDelen.volgende.addEventListener('click', () => stap(1));

// ── het verhaal ──
// De scène loopt de tijdlijn af (toren.js, api.verhaal) en meldt elke stap. Hier
// volgen het bord en de camera. Met minder beweging of zonder 3D speelt er niets:
// dan staat de samenvatting er als gewone lijst.
const verhaalDelen = {
  titel: bord.querySelector('#verhaal-titel'),
  regel: bord.querySelector('.verhaal-regel'),
  stappen: bord.querySelector('.verhaal-stappen'),
  samenvatting: bord.querySelector('.samenvatting'),
  knoppen: bord.querySelector('.verhaal-knoppen'),
  opnieuw: bord.querySelector('.verhaal-opnieuw'),
};
const stapItems = {};
for (const kamer of VOLGORDE_KAMERS) {
  const li = document.createElement('li');
  li.textContent = KAMERS[kamer].kort;
  verhaalDelen.stappen.append(li);
  stapItems[kamer] = li;
}
for (const regel of Object.values(VERHAAL_REGELS)) {
  const li = document.createElement('li');
  li.textContent = regel;
  verhaalDelen.samenvatting.append(li);
}
// verhaal: { terugNaar, klaar }, of null
let verhaal = null;
const verhaalBezig = () => !!verhaal && !verhaal.klaar;

function toonBord({ titel, regel = '', stappen = false, samenvatting = false, knoppen = false, opnieuw = false }) {
  verhaalDelen.titel.textContent = titel;
  verhaalDelen.regel.textContent = regel;
  verhaalDelen.stappen.hidden = !stappen;
  verhaalDelen.samenvatting.hidden = !samenvatting;
  verhaalDelen.knoppen.hidden = !knoppen;
  verhaalDelen.opnieuw.hidden = !opnieuw;
  bord.hidden = false;
  podium.classList.add('bord-open');
  zetVrijeRuimte();
}
function startVerhaal(knop) {
  const terug = verhaal?.terugNaar ?? (knop?.isConnected ? knop : null);
  sluitPlek(false);
  if (verhaal) dio?.stopVerhaal();
  verhaal = { terugNaar: terug, klaar: false };
  if (!dio || stil || !podium.classList.contains('klaar')) {
    verhaal.klaar = true;
    toonBord({ titel: 'Het verhaal in het kort', samenvatting: true, knoppen: true });
  } else {
    for (const li of Object.values(stapItems)) li.className = '';
    toonBord({ titel: 'Klim mee de toren in', stappen: true });
    podium.classList.add('verhaal-loopt');
    dio.verhaal({ melding: opMelding });
  }
  verhaalDelen.titel.focus({ preventScroll: true });
}
function opMelding(soort, d) {
  if (!verhaal) return;
  if (soort === 'stap') {
    dio.focus(d.kamer);
    // Bij het boeket blijft het bord klein; de knoppen komen als het verhaal klaar is.
    verhaalDelen.regel.textContent = d.stap === 'slot' ? 'Zin om het te proberen?' : VERHAAL_REGELS[d.stap];
    const nu = VOLGORDE_KAMERS.indexOf(d.stap);
    VOLGORDE_KAMERS.forEach((k, i) => { stapItems[k].className = i < nu ? 'gedaan' : i === nu ? 'nu' : ''; });
  } else if (soort === 'klaar') {
    // Het bord blijft staan tot je het sluit, maar de camera en de spelden zijn weer vrij.
    verhaal.klaar = true;
    toonBord({ titel: 'Zin om het te proberen?', regel: 'Open de app, of lees eerst in de handleiding hoe je in drie stappen start.', knoppen: true, opnieuw: true });
    podium.classList.remove('verhaal-loopt');
    huidige = null; bepaalFocus();
  }
}
function stopVerhaal({ focusTerug = true } = {}) {
  if (!verhaal) return;
  const terug = verhaal.terugNaar;
  dio?.stopVerhaal();
  verhaal = null;
  bord.hidden = true;
  podium.classList.remove('bord-open', 'verhaal-loopt');
  zetVrijeRuimte();
  huidige = null; bepaalFocus();
  if (focusTerug && terug?.isConnected && !terug.closest('[hidden]')) terug.focus({ preventScroll: true });
}
for (const knop of document.querySelectorAll('.speel-verhaal')) knop.addEventListener('click', () => startVerhaal(knop));
bord.querySelector('.verhaal-sluit').addEventListener('click', () => stopVerhaal());
verhaalDelen.opnieuw.addEventListener('click', () => startVerhaal());

// ── de sfeer: dag en nacht ──
// Het licht volgt het uur in Dendermonde. De avondknop wint het van de klok tot
// je de pagina opnieuw laadt.
const luchtDoek = podium.querySelector('.lucht-doek');
const luchtCtx = luchtDoek.getContext('2d');
const avondKnop = podium.querySelector('.avond-knop');
let avondKeuze = null;  // null: volg de klok; true of false: zelf gekozen

function tekenHemel(licht) {
  const r = podium.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const b = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (luchtDoek.width !== b || luchtDoek.height !== h) { luchtDoek.width = b; luchtDoek.height = h; }
  tekenLucht(luchtCtx, b, h, licht);
  podium.classList.toggle('nacht', licht.nacht > 0.5);
}
const lichtNu = () => ({ ...dio.licht(), mist: 0 });
// De motor laat het licht zacht overlopen; de hemel volgt beeld per beeld, en
// tekent alleen opnieuw als er iets veranderd is.
let hemelHandtekening = '';
function hemelLus() {
  if (dio && !document.hidden) {
    const licht = lichtNu();
    const h = [licht.nacht, licht.schemer, licht.bewolking, licht.flits].map(x => x.toFixed(3)).join('|');
    if (h !== hemelHandtekening) { hemelHandtekening = h; tekenHemel(licht); }
  }
  requestAnimationFrame(hemelLus);
}
new ResizeObserver(() => { hemelHandtekening = ''; if (stil && dio) tekenHemel(lichtNu()); zetVrijeRuimte(); }).observe(podium);

// De knop zegt wat hij doet: 's avonds "Dag", overdag "Avond". Daarom geen
// aria-pressed: een ingedrukte knop "Dag" zou zeggen dat het dag is.
function pasSfeerToe({ direct = false } = {}) {
  if (!dio) return;
  const licht = lichtVanZon(zonnehoogte(new Date()));
  if (avondKeuze != null) { licht.nacht = avondKeuze ? 1 : 0; licht.schemer = 0; }
  dio.sfeer({ ...licht, bewolking: 0.1 }, { direct });
  avondKnop.classList.toggle('avond', licht.nacht > 0.5);
  avondKnop.querySelector('.avond-tekst').textContent = licht.nacht > 0.5 ? 'Dag' : 'Avond';
  if (stil) { dio.herteken(); tekenHemel(lichtNu()); }
}
avondKnop.addEventListener('click', () => {
  avondKeuze = !avondKnop.classList.contains('avond');
  pasSfeerToe();
});
// Elke vijf minuten bijwerken: de zon schuift traag genoeg.
setInterval(pasSfeerToe, 5 * 60e3);

addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Eerst het kaartje dicht, dan het verhaal.
    if (open) sluitPlek();
    else if (verhaal) stopVerhaal();
    return;
  }
  // Met de pijltjes door de plekken, als de focus in het kaartje staat.
  if ((e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') || !open || !kaart.contains(document.activeElement)) return;
  e.preventDefault();
  stap(e.key === 'ArrowRight' ? 1 : -1);
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
