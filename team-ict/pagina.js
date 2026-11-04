// De pagina van Team ICT: laadt de raket pas als de tekst al leesbaar is,
// koppelt de camera aan wat je aan het lezen bent, en valt terug op de vlakke
// schets als het toestel geen 3D kan of databesparing vraagt. Daarnaast: de
// spelden bij de aanklikbare plekken, het uitlegkaartje, de avondknop en de
// zaalmodus, en de go/no-go-ronde met de lancering. Het licht volgt het uur in
// Dendermonde, net als op de voorpagina.
// Deze pagina haalt niets op bij een andere server, ook niet in de zaalmodus.
// Werkwijze en valkuilen: zie voorpagina/startpagina.js, waar dit van komt.
import { PLEKKEN, KAMERS, STATIONS } from './plekken.js';
import { bouwInformatielaag } from './informatielaag.js';
import { zonnehoogte, lichtVanZon, klokInDendermonde, tekenLucht } from '../voorpagina/sfeer.js';

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

// Zonder 3D blijft de schets staan; dan is er ook geen lancering, enkel de uitleg erover.
function zonder3d(aan) {
  podium.classList.toggle('zonder-3d', aan);
  document.body.classList.toggle('zonder-3d', aan);
}

async function laadTafereel() {
  podium.querySelector('.toon-toch').hidden = true;
  zonder3d(false);
  try {
    const { maakRaket } = await import('./raket.js');
    dio = await maakRaket(canvas, {
      stil,
      zwak,
      labels,
      pinnen,
      // Tijdens de ronde scrolt een klik op een verdieping de pagina niet weg.
      onKamer: kamer => { if (!regieBezig()) naarHoofdstuk(kamer); },
      onHover: kamer => { for (const [k, el] of Object.entries(labels)) el.classList.toggle('actief', k === kamer); },
      onPlek: id => openPlek(id),
      onPlekHover: id => { for (const [k, el] of Object.entries(pinnen)) el.classList.toggle('actief', k === id); },
      // De grafische kaart haakt af: terug naar de schets, zonder lancering.
      onFout: () => { stopRonde({ focusTerug: false }); podium.classList.remove('klaar'); zonder3d(true); },
    });
    // Een plek in plekken.js zonder voorwerp in het tafereel, of omgekeerd,
    // valt anders stil weg.
    const inTafereel = new Set(dio.plekken.map(p => p.id));
    for (const p of PLEKKEN) if (!inTafereel.has(p.id)) console.warn('Plek zonder voorwerp in het tafereel:', p.id);
    // 'vlucht' is geen voorwerp maar het punt dat de camera volgt tijdens de vlucht.
    for (const id of inTafereel) if (!pinnen[id] && id !== 'vlucht') console.warn('Voorwerp zonder tekst in plekken.js:', id);

    podium.classList.add('klaar');
    startKnop.disabled = false;
    pasSfeerToe({ direct: true });
    if (!stil) requestAnimationFrame(hemelLus);
    if (vraag.has('debug')) window.dio = dio;
    if (!stil && !zwak) podium.classList.add('rijk');
    hint.textContent = aanraak
      ? 'Tik op een bolletje voor uitleg, of veeg opzij om de raket te draaien.'
      : 'Klik op een bolletje voor uitleg, of sleep om de raket te draaien.';
    huidige = null;
    bepaalFocus();
    if (vraag.has('zaal')) zetZaal(true);
  } catch (fout) {
    console.warn('De raket kon niet laden; de schets blijft staan.', fout);
    zonder3d(true);
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
// kaartBlijft: na een resize (op de gsm ook als de adresbalk in- of uitklapt) is
// de lezer niet van hoofdstuk veranderd, dus blijft een open kaartje staan.
function bepaalFocus({ kaartBlijft = false } = {}) {
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
  // Tijdens de ronde en de vlucht stuurt de regie de camera, niet het scrollen.
  if (!regieBezig()) {
    // Wie verder scrolt naar een andere verdieping, laat het kaartje achter.
    if (!kaartBlijft && open && kamerVanFocus(kamer) !== plekVan(open).kamer) sluitPlek(false);
    dio?.focus(kamer);
  }
  for (const [k, el] of Object.entries(labels)) el.classList.toggle('gekozen', k === kamer);
  for (const h of hoofdstukken) h.classList.toggle('in-beeld', h.dataset.kamer === kamer);
}
// In het overzicht staan de spelden van het platform.
const kamerVanFocus = focus => (KAMERS[focus] ? focus : 'platform');
let gepland = false;
addEventListener('scroll', () => {
  if (gepland) return;
  gepland = true;
  requestAnimationFrame(() => { gepland = false; bepaalFocus(); });
}, { passive: true });
addEventListener('resize', () => { huidige = null; bepaalFocus({ kaartBlijft: true }); });

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
// Van boven naar beneden, zoals de hoofdstukken: van het doel naar de motor.
const VOLGORDE_KAMERS = ['neus', 'beleid', 'secundair', 'lager', 'kleuter', 'motor', 'platform'];
const plekVan = id => PLEKKEN.find(p => p.id === id);
const plekkenIn = kamer => PLEKKEN.filter(p => p.kamer === kamer);
let open = null, terugNaar = null;

// terug: waar de focus heen gaat als het kaartje sluit (standaard de speld).
function openPlek(id, { terug } = {}) {
  const p = plekVan(id);
  if (!p || regieBezig()) return;
  // Een kaartje en het paneel van de ronde staan op dezelfde plaats.
  if (reeks) stopRonde({ focusTerug: false });
  // De focus gaat bij het sluiten terug naar de laatste knop die het kaartje opende.
  if (terug) terugNaar = terug;
  else if (!open) terugNaar = pinnen[id];
  open = id;
  hintWeg();
  kaartDelen.waar.textContent = KAMERS[p.kamer];
  kaartDelen.titel.textContent = p.titel;
  kaartDelen.tekst.textContent = p.tekst;
  // Niet elke plek heeft een link: een project op de lijst heeft nog geen adres.
  kaartDelen.link.hidden = !p.link;
  if (p.link) {
    kaartDelen.link.href = p.link.href;
    kaartDelen.link.textContent = p.link.tekst;
  }
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
  const focusInKaart = kaart.contains(document.activeElement);
  open = null;
  kaart.hidden = true;
  podium.classList.remove('kaart-open');
  for (const el of Object.values(pinnen)) el.classList.remove('open');
  dio?.toonPlek(null);
  // Ook als het kaartje sluit omdat je verder scrolt: stond de focus erin, dan
  // gaat ze terug naar waar je was, anders valt ze op de pagina zelf.
  const zichtbaar = terugNaar?.isConnected && terugNaar.offsetParent !== null;
  if ((focusTerug || focusInKaart) && zichtbaar) terugNaar.focus({ preventScroll: true });
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
// Opende een knop verder op de pagina het kaartje, dan brengt Tab voorbij het
// laatste element (of Shift+Tab voor het eerste) je daar terug: het kaartje staat
// in het podium, bovenaan in de pagina, en anders sprong je naar het begin.
kaart.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !terugNaar || Object.values(pinnen).includes(terugNaar)) return;
  const bereikbaar = [...kaart.querySelectorAll('button, a[href]')].filter(el => !el.disabled && el.offsetParent !== null);
  const rand = e.shiftKey ? bereikbaar[0] : bereikbaar[bereikbaar.length - 1];
  if (document.activeElement !== rand) return;
  e.preventDefault();
  sluitPlek();
});
kaartDelen.vorige.addEventListener('click', () => stap(-1));
kaartDelen.volgende.addEventListener('click', () => stap(1));

// ── de go/no-go-ronde en de lancering ──
// De scène loopt de tijdlijn af (raket.js, api.lancering) en meldt elke stap.
// Hier volgen het paneel, de camera en de hemel die meldingen. Zolang de ronde
// loopt, verzet scrollen de camera niet en zijn de labels en spelden weg.
const vluchtbord = podium.querySelector('.vluchtbord');
const vlucht = {
  titel: vluchtbord.querySelector('#vlucht-titel'),
  lijst: vluchtbord.querySelector('.stations'),
  tekst: vluchtbord.querySelector('.vlucht-tekst'),
  melding: vluchtbord.querySelector('.vlucht-melding'),
  verslag: vluchtbord.querySelector('.vlucht-verslag'),
  opnieuw: vluchtbord.querySelector('.vlucht-opnieuw'),
  helpdesk: vluchtbord.querySelector('.vlucht-helpdesk'),
};
const aftel = podium.querySelector('.aftel');
const startFormulier = document.querySelector('.lancering-start');
const storingKeuze = startFormulier.querySelector('#storing');
const startKnop = startFormulier.querySelector('button');
startKnop.disabled = true;  // tot de raket er staat
const stationVan = id => STATIONS.find(st => st.id === id);
const stationItems = {};
for (const st of STATIONS) {
  const li = document.createElement('li');
  const naam = document.createElement('span');
  naam.className = 'naam';
  naam.textContent = st.kort;
  const stand = document.createElement('span');
  stand.className = 'stand';
  li.append(naam, stand);
  vlucht.lijst.append(li);
  stationItems[st.id] = { li, stand };
}
const STAND = { wacht: '', bezig: '…', go: 'GO', nogo: 'NO-GO' };
function zetItem(id, toestand) {
  const { li, stand } = stationItems[id];
  li.className = toestand === 'wacht' ? '' : toestand;
  stand.textContent = STAND[toestand];
}
// Wat de vluchtleiding zegt, staat in een logboek van twee regels: de vorige zin
// blijft nog even staan, zodat je ze allebei kunt lezen. Een schermlezer krijgt
// niet elke zin, alleen de grote momenten (zie aankondig), anders loopt hij
// ver achter op wat er gebeurt.
function zeg(tekst, { opnieuw = false } = {}) {
  if (opnieuw) vlucht.tekst.replaceChildren();
  const regel = document.createElement('p');
  regel.textContent = tekst;
  vlucht.tekst.append(regel);
  while (vlucht.tekst.children.length > 2) vlucht.tekst.firstElementChild.remove();
}
// Het statusvak: eerst leeg, en een tik later de nieuwe zin. Zo hoort een
// schermlezer ook een zin die gelijk is aan de vorige, en komt de melding pas
// als het paneel er staat. Na tien seconden is het weer leeg: wie het paneel
// zelf doorleest, hoort de zin dan geen twee keer.
let meldWekker = 0, wisWekker = 0;
function aankondig(tekst) {
  clearTimeout(meldWekker); clearTimeout(wisWekker);
  vlucht.melding.textContent = '';
  if (!tekst) return;
  meldWekker = setTimeout(() => {
    vlucht.melding.textContent = tekst;
    wisWekker = setTimeout(() => { vlucht.melding.textContent = ''; }, 10e3);
  }, 150);
}
// Het verslag: elke zin van de ronde blijft hier staan, met de volledige naam
// van het station. Om op je eigen tempo te lezen, ook met minder beweging of
// met een schermlezer.
function inVerslag(tekst) {
  const regel = document.createElement('li');
  regel.textContent = tekst;
  vlucht.verslag.querySelector('ol').append(regel);
}
const volledigeNaam = st => (st.code ? `${st.naam} (${st.code})` : st.kort);
function toonCijfer(n) {
  aftel.textContent = n;
  aftel.classList.remove('tel');
  if (n === '') return;
  void aftel.offsetWidth;  // de animatie opnieuw laten starten
  aftel.classList.add('tel');
}

// reeks: { storing, vanzelf, kamer, vliegt, klaar, terugNaar, basisLicht }, of null
let reeks = null;
const regieBezig = () => !!reeks && !reeks.klaar;

// Ligt het paneel over het podium, dan kadert de camera in wat vrij blijft: naast
// het paneel, of erboven (laptop) of eronder (zaal). De motor kiest per kader wat
// het tafereel het grootst laat. Twee uitzonderingen. Neemt het paneel bijna de
// hele breedte (de gsm, ook liggend), dan blijft alleen boven of onder over.
// Tijdens de vlucht is er één keuze, de ruimte naast het paneel: de raket is smal
// en hoog, en de zoom van de vlucht rekent daar zelf mee (zie plekZoom).
let vrijeRuimte = '', vrijStand = '', vrijKeuzes = [];
function zetVrijeRuimte() {
  if (!dio) return;
  let keuzes = [], stand = '';
  if (reeks && !vluchtbord.hidden) {
    const p = podium.getBoundingClientRect(), b = vluchtbord.getBoundingClientRect();
    if (b.bottom > p.top && b.top < p.bottom && b.right > p.left && b.left < p.right) {
      // Wat extra lucht tussen het paneel en wat de camera toont.
      const naast = (b.right - p.left) / p.width + 0.03;
      const verticaal = b.top - p.top < p.bottom - b.bottom
        ? { boven: (b.bottom - p.top) / p.height + 0.03 }
        : { onder: (p.bottom - b.top) / p.height + 0.03 };
      keuzes = naast > 0.7 ? [verticaal] : reeks.vliegt ? [{ links: naast }] : [{ links: naast }, verticaal];
      stand = [vluchtbord.className, reeks.vliegt, Math.round(p.width), Math.round(p.height), keuzes.map(k => Object.keys(k)[0])].join('|');
      // Binnen dezelfde stand groeit de ruimte alleen: anders ademt de camera mee
      // met elke zin die een regel langer of korter is.
      if (stand === vrijStand) keuzes = keuzes.map((k, i) => { const [zijde, deel] = Object.entries(k)[0]; return { [zijde]: Math.max(deel, vrijKeuzes[i]?.[zijde] ?? 0) }; });
    }
  }
  vrijStand = stand;
  vrijKeuzes = keuzes;
  const sleutel = JSON.stringify(keuzes);
  if (sleutel === vrijeRuimte) return;
  vrijeRuimte = sleutel;
  dio.vrijeRuimte(...keuzes);
}
new ResizeObserver(() => zetVrijeRuimte()).observe(vluchtbord);

function startRonde(storing = null, { vanzelf = false } = {}) {
  // Geen raket (meer): na een fout van de grafische kaart is er geen ronde.
  if (!dio || !podium.classList.contains('klaar')) return;
  const terugNaar = reeks ? reeks.terugNaar : vanzelf ? null : document.activeElement;
  if (reeks) stopRonde({ focusTerug: false, sluit: false });
  sluitPlek(false);
  // In de zaal wisselt de camera anders om de tien seconden van verdieping, en
  // zwaait de kijkhoek breed heen en weer. Tijdens de ronde drijft ze nauwelijks:
  // anders draait de opening van de raket weg en staan de buitenste kasten
  // achter de wand op het moment dat ze antwoorden.
  if (document.body.classList.contains('zaal')) { dio.zaal(false); dio.drift(0.05, 0.12); }
  reeks = { storing, vanzelf, kamer: null, vliegt: false, klaar: false, terugNaar, basisLicht: lichtVanNu() };
  podium.classList.add('lancering', 'bord-open');
  vluchtbord.classList.remove('compact', 'hold', 'boven');
  for (const st of STATIONS) zetItem(st.id, 'wacht');
  vlucht.opnieuw.hidden = vlucht.helpdesk.hidden = true;
  vlucht.verslag.hidden = true;
  vlucht.verslag.open = false;
  vlucht.verslag.querySelector('ol').replaceChildren();
  vlucht.titel.textContent = 'Go/no-go-ronde';
  zeg('De vluchtleiding vraagt elk station: go of no-go?', { opnieuw: true });
  vluchtbord.hidden = false;
  aankondig('De go/no-go-ronde begint. De vluchtleiding vraagt elk station: go of no-go?');
  zetVrijeRuimte();
  if (!vanzelf) vlucht.titel.focus({ preventScroll: true });
  dio.lancering({ stations: STATIONS.map(st => ({ id: st.id, kamer: st.kamer })), storing, melding: opMelding });
  if (stil) dio.herteken();
}

function opMelding(soort, d) {
  if (!reeks) return;
  const st = d.id ? stationVan(d.id) : null;
  switch (soort) {
    case 'vraag':
      zetItem(st.id, 'bezig');
      if (!stil && reeks.kamer !== st.kamer) { reeks.kamer = st.kamer; dio.focus(st.kamer); }
      if (!stil) dio.markeer(st.plek ?? null);
      break;
    case 'station':
      zetItem(st.id, d.toestand);
      if (d.toestand === 'go') { zeg(`${st.kort}: go. ${st.go}`); inVerslag(`${volledigeNaam(st)}: go. ${st.go}`); }
      else inVerslag(`${volledigeNaam(st)}: no-go.`);
      break;
    case 'hold': {
      vlucht.titel.textContent = 'No-go: de raket blijft staan';
      const tekst = `No-go bij ${st.naam} (${st.code}). ${st.uitval} ${st.actie ?? 'In het echt meld je dit via de helpdesk.'} Je ticket gaat naar ${st.naar ?? 'wie dit domein trekt'}.`;
      zeg(tekst, { opnieuw: true });
      aankondig(`No-go bij ${st.naam}. De raket blijft staan.`);
      vluchtbord.classList.add('hold');
      vlucht.verslag.hidden = false;
      vlucht.opnieuw.textContent = 'Opgelost: start opnieuw';
      vlucht.opnieuw.hidden = vlucht.helpdesk.hidden = false;
      // De camera zoomt in op de kast die no-go zegt, in de ruimte naast het paneel.
      zetVrijeRuimte();
      dio.toonPlek(st.plek, { opzij: true });
      break;
    }
    case 'allesGo':
      // Iedereen is go: het raster mag weg, zodat de lancering in beeld blijft.
      // Zonder vlucht (minder beweging) blijft het staan: dan is het het resultaat.
      // Op de laptop schuift het naar boven, naast de smalle neus (klasse boven).
      if (!stil) vluchtbord.classList.add('compact', 'boven');
      zetVrijeRuimte();
      zeg('Alle stations go. We zijn go voor lancering.');
      // Eén melding voor twee momenten: het aftellen volgt al na anderhalve seconde.
      aankondig('Alle stations go. Aftellen voor de lancering.');
      dio.markeer(null);
      reeks.kamer = 'overzicht';
      dio.focus('overzicht');
      break;
    case 'tel':
      toonCijfer(d.n);
      if (d.n === 5) zeg('Aftellen voor de lancering.');
      break;
    case 'lift':
      toonCijfer('');
      zeg('De raket vertrekt. De les kan beginnen.');
      aankondig('De raket vertrekt. De les kan beginnen.');
      reeks.vliegt = true;
      zetVrijeRuimte();
      dio.toonPlek('vlucht', { opzij: true });
      break;
    case 'top':
      zeg('Boven de wolken. Nu draait alles om de les.');
      aankondig('Boven de wolken. Nu draait alles om de les.');
      break;
    case 'terug':
      zeg('De raket keert terug naar het platform. Morgen vertrekt ze opnieuw, met dezelfde motor.');
      break;
    case 'geland':
      reeks.vliegt = false;
      zetVrijeRuimte();
      dio.toonPlek(null);
      dio.focus('overzicht');
      pasSfeerToe();
      zeg('Geland. Zo vertrekt elke digitale les: alleen als alles go is. Meestal merk je daar niets van, en zo hoort het.');
      aankondig('Geland. Zo vertrekt elke digitale les: alleen als alles go is.');
      break;
    case 'klaar':
      rondeAf({ geland: true });
      break;
    case 'stilKlaar': {
      const tekst = 'Alle stations go: de raket mag vertrekken. Je toestel vraagt minder beweging, dus de vlucht zelf tonen we niet.';
      zeg(tekst, { opnieuw: true });
      aankondig('Alle stations go. De raket mag vertrekken.');
      dio.markeer(null);
      dio.focus('overzicht');
      rondeAf({ geland: false });
      break;
    }
  }
}
// De ronde is gedaan: het paneel blijft staan tot je het sluit, maar de camera
// en de spelden zijn weer vrij.
function rondeAf({ geland }) {
  reeks.klaar = true;
  vlucht.titel.textContent = geland ? 'Go/no-go-ronde: geland' : 'Go/no-go-ronde: alles go';
  vlucht.opnieuw.textContent = 'Nog eens';
  vlucht.opnieuw.hidden = false;
  vlucht.verslag.hidden = false;
  // De vlucht is voorbij: het paneel gaat terug naar zijn gewone plaats.
  vluchtbord.classList.remove('boven');
  zetVrijeRuimte();
  podium.classList.remove('lancering');
  huidige = null; bepaalFocus();
  dio.drift(null);
  if (document.body.classList.contains('zaal')) dio.zaal(true);
  if (reeks.vanzelf) {
    const deze = reeks;
    setTimeout(() => { if (reeks === deze) stopRonde({ focusTerug: false }); }, 8000);
  }
  if (stil) dio.herteken();
}
// Stop of sluit: alles terug zoals het was, ook een raket die nog in de lucht hangt.
function stopRonde({ focusTerug = true, sluit = true } = {}) {
  if (!reeks) return;
  const terug = reeks.terugNaar, wasBezig = regieBezig();
  dio?.stopLancering();
  aankondig('');
  dio?.toonPlek(null);
  dio?.markeer(null);
  toonCijfer('');
  podium.classList.remove('lancering');
  reeks = null;
  if (sluit) { vluchtbord.hidden = true; podium.classList.remove('bord-open'); }
  zetVrijeRuimte();
  dio?.drift(null);
  if (wasBezig && document.body.classList.contains('zaal')) dio?.zaal(true);
  huidige = null; bepaalFocus();
  pasSfeerToe();
  if (stil) dio?.herteken();
  if (focusTerug && terug?.isConnected && !terug.closest('[hidden]')) terug.focus({ preventScroll: true });
}
vluchtbord.querySelector('.vlucht-sluit').addEventListener('click', () => stopRonde());
vlucht.opnieuw.addEventListener('click', () => startRonde(null));
podium.querySelector('.lanceer-knop').addEventListener('click', () => startRonde(storingKeuze.value || null));
startFormulier.addEventListener('submit', e => {
  e.preventDefault();
  startRonde(storingKeuze.value || null);
});

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
  if (reeks?.vliegt) {
    // Hoe hoger de raket, hoe donkerder de hemel: boven de wolken begint de ruimte.
    const ruimte = Math.min(1, Math.max(0, (dio.vluchtHoogte() - 6) / 26));
    const basis = reeks.basisLicht;
    dio.sfeer({ nacht: Math.max(basis.nacht, ruimte), schemer: basis.schemer * (1 - ruimte) });
  }
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
function zetAvondKnop(avond) {
  avondKnop.classList.toggle('avond', avond);
  avondKnop.querySelector('.avond-tekst').textContent = avond ? 'Dag' : 'Avond';
}
function lichtVanNu() {
  const licht = lichtVanZon(zonnehoogte(new Date()));
  if (avondKeuze != null) { licht.nacht = avondKeuze ? 1 : 0; licht.schemer = 0; }
  return licht;
}
function pasSfeerToe({ direct = false } = {}) {
  if (!dio) return;
  const licht = lichtVanNu();
  if (reeks) reeks.basisLicht = licht;
  dio.sfeer({ ...licht, bewolking: 0.1 }, { direct });
  zetAvondKnop(licht.nacht > 0.5);
  if (stil) { dio.herteken(); tekenHemel(lichtNu()); }
}
avondKnop.addEventListener('click', () => {
  avondKeuze = !avondKnop.classList.contains('avond');
  pasSfeerToe();
});
// Elke vijf minuten bijwerken: de zon schuift traag genoeg.
setInterval(pasSfeerToe, 5 * 60e3);

// ── zaalmodus voor de beamer ──
// Het tafereel vult het scherm en loopt vanzelf de verdiepingen af. Met de
// pijltjes ga je door de kaartjes.
const adres = new URL('./', location.href);
podium.querySelector('.zaal-adres').textContent = (adres.host + adres.pathname).replace(/\/$/, '');
const klokbord = podium.querySelector('.klokbord');
let klokWekker = 0;
function toonKlok() { klokbord.textContent = `Dendermonde · ${klokInDendermonde()}`; }
const zaalWekkers = [];
function zetZaal(aan) {
  // Een ronde die loopt, stopt: de zaalmodus neemt de camera over.
  if (reeks) stopRonde({ focusTerug: false });
  document.body.classList.toggle('zaal', aan);
  dio?.zaal(aan);
  clearInterval(klokWekker);
  while (zaalWekkers.length) clearTimeout(zaalWekkers.pop());
  if (aan) {
    toonKlok();
    klokWekker = setInterval(() => { toonKlok(); pasSfeerToe(); }, 60e3);
    // Op de beamer vertrekt de raket vanzelf: na een minuut, en dan om de vier minuten.
    if (!stil) {
      // Niet als er al een ronde loopt (ook een die stilstaat omdat het tabblad op de achtergrond staat).
      const vanzelf = () => { if (!open && !reeks && !document.hidden) startRonde(null, { vanzelf: true }); };
      zaalWekkers.push(setTimeout(vanzelf, 60e3), setInterval(vanzelf, 4 * 60e3));
    }
  } else {
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
    // Eerst het kaartje dicht, dan de ronde, pas daarna de zaalmodus uit.
    if (open) sluitPlek();
    else if (reeks) stopRonde();
    else if (zaal) zetZaal(false);
    return;
  }
  // Met de pijltjes door de plekken: handig voor wie het tafereel op de beamer toont.
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  if (regieBezig()) return;
  if (!open && !zaal) return;
  if (!zaal && !kaart.contains(document.activeElement)) return;
  e.preventDefault();
  if (open) stap(e.key === 'ArrowRight' ? 1 : -1);
  else openPlek(plekkenIn(VOLGORDE_KAMERS[0])[0].id);
});

// "Toon in de raket" in de informatielaag opent het kaartje van die plek. Loopt de
// go/no-go-ronde nog, dan stopt die: wie op de knop drukt, wil dat zien. Zonder
// 3D staat het kaartje over de schets, met dezelfde tekst.
function toonInRaket(toon, knop) {
  if (!plekVan(toon)) return;
  if (regieBezig()) stopRonde({ focusTerug: false });
  openPlek(toon, { terug: knop });
}
const naamVan = toon => (toon.startsWith('#') ? 'het team' : plekVan(toon)?.titel ?? toon);

// ── starten ──
bouwInformatielaag({ toonInRaket, naamVan });
bepaalFocus();
requestAnimationFrame(() => podium.classList.add('dag'));
if (vraag.has('schets') || !kanWebGL2()) {
  zonder3d(true);
} else if (spaarstand) {
  zonder3d(true);
  const knop = podium.querySelector('.toon-toch');
  knop.hidden = false;
  knop.addEventListener('click', laadTafereel, { once: true });
} else {
  // Eerst de pagina laten verschijnen, dan pas de 3D-code ophalen.
  const later = window.requestIdleCallback || (f => setTimeout(f, 200));
  if (document.readyState === 'complete') later(laadTafereel, { timeout: 800 });
  else addEventListener('load', () => later(laadTafereel, { timeout: 800 }), { once: true });
}
