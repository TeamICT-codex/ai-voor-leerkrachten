// De strook voor de startpagina van een school: ze kleurt mee met het uur en
// het seizoen in Dendermonde, en toont elke dag een andere tip. Het uur en het
// seizoen rekent sfeer.js zelf uit: de strook stuurt niets naar een andere
// server. De kop en de knop gaan naar de voorpagina; de tip gaat rechtstreeks
// naar één stuk. Met ?voor=lager of ?voor=secundair achter het adres kiest de
// strook tips voor dat niveau: wie kijkt, weet ze niet, maar de startpagina is
// van één school. Om te proberen: ?uur=21, ?seizoen=3.5 (0 tot 4, zie sfeer.js)
// en ?tip=2.
import { zonnehoogte, lichtVanZon, seizoenOp } from '../voorpagina/sfeer.js';

// Elke dag één tip, met waar hij naartoe leidt (een pad vanaf de root van de
// site). Vul gerust aan: een zin van hoogstens twaalf woorden, en een module
// of pagina die bestaat (zie js/cursus.js).
const module = id => `leeromgeving/#/module/${id}`;
const ALGEMEEN = [
  { zin: 'Met vier knoppen krijg je een veel beter antwoord van je AI-assistent.', naar: module('prompten') },
  { zin: 'Differentiëren zonder drie keer werk: zo pak je het aan.', naar: module('lesvoorbereiding') },
  { zin: 'Laat toetsvragen maken op het juiste niveau, en kijk ze zelf na.', naar: module('toetsen-feedback') },
  { zin: 'Een brief aan ouders in heldere taal, in een paar minuten.', naar: module('administratie') },
  { zin: 'Wat typ je wel en niet in? Privacy, de korte versie.', naar: module('veilig-en-ethisch') },
  { zin: 'Mag dit? Herkenbare situaties uit de klas, met een antwoord.', naar: module('casussen') },
  { zin: 'Nog nooit geprobeerd? Begin met je eerste gesprek.', naar: module('kennismaking') },
];
// Per niveau komen er tips bij over het aanbod voor de eigen leerlingen.
const TIPS = {
  lager: [
    { zin: 'Leerlichtjes: een 3D-wereld over AI voor elke graad, op het digibord.', naar: 'lager/index.html' },
    { zin: 'Leerlichtjes in je klas: zo begin je eraan.', naar: 'lager/voor-leerkrachten.html' },
    ...ALGEMEEN,
  ],
  secundair: [
    { zin: 'AI-wijs Start: twee lesuren over AI voor de 1ste graad.', naar: 'aiwijs-start/voor-leerkrachten.html' },
    { zin: 'AI-wijs op school: een cursus voor je leerlingen van de 2de en 3de graad.', naar: module('leerlingencursus') },
    ...ALGEMEEN,
  ],
};

const vraag = new URLSearchParams(location.search);
const strook = document.querySelector('.strook');
const stijl = document.documentElement.style;
const stil = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── de tip van vandaag ──
const dagnummer = Math.floor(Date.now() / 864e5);
const tips = TIPS[vraag.get('voor')] || ALGEMEEN;
const tip = tips[(vraag.has('tip') ? Number(vraag.get('tip')) || 0 : dagnummer) % tips.length];
const tipLink = strook.querySelector('.tip a');
tipLink.append(Object.assign(document.createElement('b'), { textContent: 'Tip van vandaag: ' }), tip.zin);
tipLink.href = `../${tip.naar}`;

// ── kleuren mengen ──
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const meng = (a, b, t) => { const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

// Per seizoen: de twee tinten van de kruinen, het gras, en wat er valt.
const SEIZOENEN = [
  { blad1: '#b8e290', blad2: '#8fd07c', gras: '#c9eab9', valt: ['#f7b6c8', '#ffffff', '#f2a0b6'], hoeveel: 7 },   // lente: bloesem
  { blad1: '#86c494', blad2: '#4e9a63', gras: '#c2e3cc', valt: [], hoeveel: 0 },                                   // zomer
  { blad1: '#f4c64f', blad2: '#f08a3c', gras: '#d6dfb4', valt: ['#f4c64f', '#f08a3c', '#c9563f'], hoeveel: 12 }, // herfst: blaadjes
  { blad1: '#eef3f0', blad2: '#d8e3df', gras: '#eef3f0', valt: ['#ffffff'], hoeveel: 16 },                         // winter: sneeuw
];

function kleur() {
  const nu = new Date();
  if (vraag.has('uur')) nu.setHours(Number(vraag.get('uur')), 0, 0, 0);
  const { nacht, schemer } = lichtVanZon(zonnehoogte(nu));
  const s = vraag.has('seizoen') ? Number(vraag.get('seizoen')) : seizoenOp(nu);
  const seizoen = SEIZOENEN[Math.floor(((s % 4) + 4) % 4)];
  // de lucht: dag, een warm gouden uur, en de nacht
  const dag = 1 - nacht;
  stijl.setProperty('--lucht-boven', meng(meng('#eef7f1', '#f3b48f', schemer * dag), '#1c2645', nacht));
  stijl.setProperty('--lucht-onder', meng(meng('#d8ecdf', '#fde6d2', schemer * dag), '#4a5784', nacht));
  stijl.setProperty('--blad1', meng(seizoen.blad1, '#3d4a5e', nacht * 0.55));
  stijl.setProperty('--blad2', meng(seizoen.blad2, '#2c384c', nacht * 0.55));
  stijl.setProperty('--gras', meng(seizoen.gras, '#33405a', nacht * 0.6));
  stijl.setProperty('--raam', meng('#cfe9f2', '#ffd98a', nacht));   // 's avonds branden de lampen
  stijl.setProperty('--tekst', nacht > 0.5 ? '#ffffff' : '#1f2328');
  stijl.setProperty('--zacht', nacht > 0.5 ? '#d5dcf0' : '#4d5459');
  stijl.setProperty('--nacht', nacht.toFixed(2));
  return seizoen;
}

// ── wat er valt ──
function strooi(seizoen) {
  strook.querySelectorAll('.val').forEach(v => v.remove());
  if (stil) return;
  for (let i = 0; i < seizoen.hoeveel; i++) {
    const v = document.createElement('span');
    v.className = 'val';
    const sneeuw = seizoen.valt.length === 1;
    v.style.cssText = `left:${(i * 61 + 13) % 100}%;background:${seizoen.valt[i % seizoen.valt.length]};`
      + `--drift:${(i % 5 - 2) * 14}px;animation-duration:${(sneeuw ? 9 : 6) + (i % 4) * 1.7}s;animation-delay:${-i * 1.3}s;`
      + (sneeuw ? 'width:6px;height:6px;border-radius:50%;' : '');
    strook.prepend(v);
  }
}

strooi(kleur());
// De zon schuift traag: elke tien minuten bijkleuren volstaat.
setInterval(kleur, 10 * 60e3);
