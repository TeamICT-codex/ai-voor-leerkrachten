// De vijf hoeken van De klas van de juf, voor de 1ste graad. De kinderen
// leren nog maar net lezen: elke opdracht werkt met tekeningen, en met "Lees
// mee" aan wordt elk kaartje en elk antwoord voorgelezen zodra je erop tikt.
// De bouwstenen (el, knop, sorteer, spreek...) staan in ../activiteiten.js.
//
// Alles wat voorgelezen kan worden, is vooraf ingelezen. Daarom heeft elke hoek
// een lijst zinnen: elke zin die de opdracht kan zeggen, gemaakt met dezelfde
// functies als de opdracht zelf. Verander je een zin, lees dan opnieuw in (zie
// ../stem/LEESMIJ.md). Dit bestand raakt bij het laden de pagina niet aan:
// ../stem/verzamel.mjs leest het in node.

import { el, knop, inzicht, wacht, stil, sorteer, sorteerZinnen, spreek, beeld } from '../activiteiten.js';

// ───────────────────────────── de tekeningen ─────────────────────────────

const svg = inhoud => `<svg viewBox="0 0 64 64">${inhoud}</svg>`;
const BEELD = {
  tablet: svg('<rect x="12" y="6" width="40" height="52" rx="6" fill="#2b3038"/><rect x="16" y="11" width="32" height="40" rx="2" fill="#7cc3dc"/><circle cx="32" cy="54.5" r="1.8" fill="#9aa3a8"/><circle cx="26" cy="26" r="5" fill="#ffcf3a"/><path d="M18 46l9-10 7 7 5-5 9 8z" fill="#4e9a63"/>'),
  speaker: svg('<rect x="20" y="16" width="24" height="40" rx="10" fill="#3d4656"/><ellipse cx="32" cy="19" rx="11" ry="4" fill="#39b4ff"/><path d="M48 26q5 6 0 12M52 22q9 10 0 20" stroke="#39b4ff" stroke-width="3" fill="none" stroke-linecap="round"/>'),
  robotje: svg('<ellipse cx="32" cy="42" rx="23" ry="13" fill="#e0b23c"/><path d="M12 40a20 18 0 0 1 40 0z" fill="#ffcf3a"/><circle cx="25" cy="32" r="3.4" fill="#2b3038"/><circle cx="39" cy="32" r="3.4" fill="#2b3038"/><path d="M28 21l4-5 4 5z" fill="#126425"/>'),
  wasmachine: svg('<rect x="12" y="7" width="40" height="50" rx="5" fill="#f4f4f4" stroke="#cfd2cf" stroke-width="2"/><circle cx="32" cy="36" r="13" fill="#7cc3dc" stroke="#9aa3a8" stroke-width="3"/><rect x="16" y="12" width="13" height="5" rx="2" fill="#4e9a63"/><circle cx="46" cy="14.5" r="2.6" fill="#d9534f"/><path d="M23 38q5-4 9 0t9 0" stroke="#fff" stroke-width="2" fill="none"/>'),
  auto: svg('<path d="M6 42v-9l9-11h27l11 11h3v9z" fill="#d9534f"/><path d="M19 24h10v8H14zM33 24h8l7 8H33z" fill="#bfe3ed"/><circle cx="18" cy="43" r="6.5" fill="#2b3038"/><circle cx="46" cy="43" r="6.5" fill="#2b3038"/><circle cx="18" cy="43" r="2.4" fill="#cfd2cf"/><circle cx="46" cy="43" r="2.4" fill="#cfd2cf"/>'),
  boek: svg('<path d="M8 14h19a5 5 0 0 1 5 5v34a5 5 0 0 0-5-5H8z" fill="#5fa9c9"/><path d="M56 14H37a5 5 0 0 0-5 5v34a5 5 0 0 1 5-5h19z" fill="#4b93b3"/><path d="M13 22h12M13 28h12M13 34h9M39 22h12M39 28h12" stroke="#fff" stroke-width="2" opacity=".7"/>'),
  bal: svg('<circle cx="32" cy="34" r="21" fill="#d9534f"/><path d="M12 30q20 12 40 0" stroke="#fff" stroke-width="4.5" fill="none"/><circle cx="24" cy="24" r="5" fill="#fff" opacity=".35"/>'),
  beer: svg('<circle cx="19" cy="16" r="7.5" fill="#9c6f45"/><circle cx="45" cy="16" r="7.5" fill="#9c6f45"/><circle cx="32" cy="27" r="15" fill="#c68642"/><ellipse cx="32" cy="50" rx="16" ry="11" fill="#c68642"/><circle cx="26.5" cy="24.5" r="2.2" fill="#2b3038"/><circle cx="37.5" cy="24.5" r="2.2" fill="#2b3038"/><ellipse cx="32" cy="31.5" rx="5.5" ry="4" fill="#e4c397"/><circle cx="32" cy="30" r="1.8" fill="#2b3038"/>'),
  // mens of computer
  praten: svg('<path d="M8 12h40a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H26l-12 10v-10H8a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill="#5fa9c9"/><circle cx="18" cy="27" r="3.5" fill="#fff"/><circle cx="28" cy="27" r="3.5" fill="#fff"/><circle cx="38" cy="27" r="3.5" fill="#fff"/>'),
  verdriet: svg('<circle cx="32" cy="32" r="24" fill="#ffcf3a"/><circle cx="23" cy="27" r="3" fill="#2b3038"/><circle cx="41" cy="27" r="3" fill="#2b3038"/><path d="M22 46q10-9 20 0" stroke="#2b3038" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M41 32q-4 7 0 9 4-2 0-9z" fill="#5fa9c9"/>'),
  rekenen: svg('<rect x="6" y="12" width="52" height="40" rx="8" fill="#ccefd5"/><text x="32" y="41" font-size="20" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#126425">2+3</text>'),
  knuffel: svg('<path d="M32 54C14 42 6 32 6 22a12 12 0 0 1 26-6 12 12 0 0 1 26 6c0 10-8 20-26 32z" fill="#ee7c8f"/>'),
  honger: svg('<circle cx="32" cy="36" r="20" fill="#fff" stroke="#cfd2cf" stroke-width="3"/><circle cx="32" cy="36" r="12" fill="#fcc89b"/><path d="M6 14v14M10 14v14M8 28v24M56 14c-6 4-6 14 0 16v22" stroke="#9aa3a8" stroke-width="3" fill="none" stroke-linecap="round"/>'),
  liedje: svg('<path d="M24 46V14l26-6v32" stroke="#7b5ea7" stroke-width="5" fill="none" stroke-linejoin="round"/><ellipse cx="18" cy="47" rx="8" ry="6" fill="#7b5ea7"/><ellipse cx="44" cy="41" rx="8" ry="6" fill="#7b5ea7"/>'),
  vriend: svg('<circle cx="20" cy="16" r="7" fill="#c68642"/><circle cx="44" cy="16" r="7" fill="#f3d2b3"/><rect x="11" y="25" width="18" height="24" rx="8" fill="#4e9a63"/><rect x="35" y="25" width="18" height="24" rx="8" fill="#f08a3c"/><path d="M27 36h10" stroke="#e0ac7e" stroke-width="5" stroke-linecap="round"/><rect x="13" y="47" width="6" height="12" rx="3" fill="#3d4656"/><rect x="21" y="47" width="6" height="12" rx="3" fill="#3d4656"/><rect x="37" y="47" width="6" height="12" rx="3" fill="#3d4656"/><rect x="45" y="47" width="6" height="12" rx="3" fill="#3d4656"/>'),
  voorlezen: svg('<path d="M4 20q12-6 26 0v34q-14-6-26 0z" fill="#fff" stroke="#cfd2cf" stroke-width="2"/><path d="M30 20q12-6 26 0v34q-14-6-26 0z" fill="#fff" stroke="#cfd2cf" stroke-width="2"/><path d="M9 28h16M9 34h16M9 40h12M35 28h16M35 34h12" stroke="#5fa9c9" stroke-width="2.4" stroke-linecap="round"/><path d="M44 6q5 4 0 8M50 3q9 7 0 14" stroke="#f08a3c" stroke-width="3" fill="none" stroke-linecap="round"/>'),
  // de geheimendoos
  kleur: svg('<path d="M32 6C16 6 6 18 6 32c0 12 10 22 20 20 4-1 4-6 2-9-2-4 1-8 5-8h9c8 0 16-6 16-15C58 12 46 6 32 6z" fill="#fcc89b"/><circle cx="20" cy="22" r="5" fill="#d9534f"/><circle cx="34" cy="16" r="5" fill="#5fa9c9"/><circle cx="46" cy="24" r="5" fill="#4e9a63"/><circle cx="17" cy="36" r="5" fill="#ffcf3a"/>'),
  huis: svg('<path d="M8 30L32 10l24 20v26H8z" fill="#fffaf3" stroke="#cfd2cf" stroke-width="2"/><path d="M4 32L32 8l28 24" stroke="#b5523b" stroke-width="6" fill="none" stroke-linejoin="round"/><rect x="26" y="38" width="12" height="18" fill="#126425"/><rect x="13" y="34" width="9" height="9" fill="#bfe3ed"/><rect x="42" y="34" width="9" height="9" fill="#bfe3ed"/>'),
  dier: svg('<path d="M14 26l2-16 10 9h12l10-9 2 16" fill="#8a8a8a"/><ellipse cx="32" cy="36" rx="20" ry="18" fill="#8a8a8a"/><circle cx="25" cy="33" r="3" fill="#2b3038"/><circle cx="39" cy="33" r="3" fill="#2b3038"/><path d="M29 41h6l-3 3z" fill="#ee7c8f"/><path d="M10 40h12M10 46h12M42 40h12M42 46h12" stroke="#fff" stroke-width="1.6"/>'),
  sleutel: svg('<circle cx="20" cy="32" r="12" fill="none" stroke="#e0b23c" stroke-width="7"/><path d="M32 32h26M48 32v10M56 32v8" stroke="#e0b23c" stroke-width="7" stroke-linecap="round"/>'),
  eten: svg('<path d="M10 30h44a22 22 0 0 1-44 0z" fill="#fcc89b"/><circle cx="24" cy="26" r="6" fill="#d9534f"/><circle cx="36" cy="24" r="7" fill="#4e9a63"/><circle cx="44" cy="27" r="4" fill="#ffcf3a"/>'),
  telefoon: svg('<rect x="20" y="6" width="24" height="52" rx="5" fill="#2b3038"/><rect x="23" y="11" width="18" height="38" rx="2" fill="#bfe3ed"/><g fill="#2b3038"><circle cx="27" cy="20" r="2"/><circle cx="32" cy="20" r="2"/><circle cx="37" cy="20" r="2"/><circle cx="27" cy="27" r="2"/><circle cx="32" cy="27" r="2"/><circle cx="37" cy="27" r="2"/><circle cx="27" cy="34" r="2"/><circle cx="32" cy="34" r="2"/><circle cx="37" cy="34" r="2"/></g>'),
  school: svg('<rect x="8" y="24" width="48" height="32" fill="#fcc89b"/><path d="M4 26L32 10l28 16" stroke="#b5523b" stroke-width="6" fill="none" stroke-linejoin="round"/><rect x="27" y="40" width="10" height="16" fill="#5fa9c9"/><rect x="13" y="32" width="9" height="8" fill="#bfe3ed"/><rect x="42" y="32" width="9" height="8" fill="#bfe3ed"/><circle cx="32" cy="22" r="3" fill="#e0b23c"/>'),
  doos: svg('<rect x="8" y="26" width="48" height="30" rx="4" fill="#7b5ea7"/><path d="M6 18h52v10H6z" fill="#9a7cc4"/><rect x="27" y="30" width="10" height="11" rx="2" fill="#ffcf3a"/><path d="M29 30v-4a3 3 0 0 1 6 0v4" stroke="#ffcf3a" stroke-width="2.6" fill="none"/><circle cx="18" cy="44" r="2" fill="#ffcf3a"/><circle cx="46" cy="44" r="2" fill="#ffcf3a"/>'),
  vertellen: svg('<circle cx="22" cy="24" r="10" fill="#e0ac7e"/><rect x="10" y="36" width="24" height="20" rx="10" fill="#4e9a63"/><path d="M38 14h18a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-8l-6 6v-6h-4a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" fill="#ccefd5"/>'),
  mens: svg('<circle cx="32" cy="16" r="10" fill="#e0ac7e"/><rect x="18" y="28" width="28" height="30" rx="12" fill="#f08a3c"/>'),
  allebei: svg('<circle cx="18" cy="18" r="8" fill="#e0ac7e"/><rect x="7" y="28" width="22" height="26" rx="10" fill="#f08a3c"/><rect x="36" y="18" width="22" height="20" rx="6" fill="#5fa9c9"/><circle cx="43" cy="28" r="2.4" fill="#fff"/><circle cx="51" cy="28" r="2.4" fill="#fff"/><rect x="40" y="40" width="14" height="14" rx="4" fill="#4b93b3"/><path d="M47 18v-6" stroke="#9aa3a8" stroke-width="2"/><circle cx="47" cy="10" r="2.6" fill="#ffcf3a"/>'),
};
// het lichtje van de klas
const LICHTJE = svg('<circle cx="32" cy="32" r="26" fill="#ffcf3a" opacity=".25"/><circle cx="32" cy="32" r="16" fill="#ffcf3a"/><circle cx="26" cy="26" r="5" fill="#fffbe6"/>');

// ───────────────────────────── 1 · de ontdekhoek: waar zit een computer in? ─────────────────────────────

const DINGEN = [
  { tekst: 'Een tablet', beeld: BEELD.tablet, bak: 'met', uitleg: 'In een tablet zit een computer.' },
  { tekst: 'Een gewoon boek', beeld: BEELD.boek, bak: 'zonder', uitleg: 'In een gewoon boek zit geen computer. Jij slaat zelf de bladzijden om.' },
  { tekst: 'Een slimme speaker', beeld: BEELD.speaker, bak: 'met', uitleg: 'In een slimme speaker zit een computer. Hij luistert en hij praat.' },
  { tekst: 'Een bal', beeld: BEELD.bal, bak: 'zonder', uitleg: 'In een bal zit geen computer. Jij speelt ermee.' },
  { tekst: 'Een robotje', beeld: BEELD.robotje, bak: 'met', uitleg: 'In een robotje zit een kleine computer. Hij doet wat jij met de knopjes vraagt.' },
  { tekst: 'Een wasmachine', beeld: BEELD.wasmachine, bak: 'met', uitleg: 'Ook in een wasmachine zit een kleine computer. Die zorgt dat de wasmachine op tijd stopt.' },
  { tekst: 'Een gewone knuffelbeer', beeld: BEELD.beer, bak: 'zonder', uitleg: 'In een gewone knuffelbeer zit geen computer.' },
  { tekst: 'Een auto', beeld: BEELD.auto, bak: 'met', uitleg: 'In een auto zitten zelfs heel veel kleine computers.' },
];
const ONTDEKSPEL = {
  bakken: [
    { id: 'met', naam: 'Met een computer erin', kleur: '#c2e3cc', beeld: BEELD.tablet },
    { id: 'zonder', naam: 'Zonder computer', kleur: '#fde3c8', beeld: BEELD.bal },
  ],
  kaarten: DINGEN,
  opdracht: 'Tik op een ding. Tik daarna op de juiste bak.',
  slot: 'Goed gezocht! In veel toestellen zit een kleine computer. Je ziet hem niet, want hij zit vanbinnen.',
};
function maakOntdekhoek(vak, klaar) {
  sorteer(vak, { ...ONTDEKSPEL, klaar });
}

// ───────────────────────────── 2 · de bouwhoek: leer het lichtje sorteren ─────────────────────────────

const TINT = { rood: '#d9534f', blauw: '#5fa9c9', geel: '#f2c230', groen: '#4e9a63' };
const KLEURNAAM = { rood: 'rode', blauw: 'blauwe', geel: 'gele', groen: 'groene' };
function speelgoedSvg({ vorm, kleur }) {
  const k = TINT[kleur];
  return vorm === 'blok'
    ? svg(`<path d="M12 22l20-10 20 10v24L32 56 12 46z" fill="${k}"/><path d="M12 22l20 10 20-10M32 32v24" stroke="rgba(0,0,0,.2)" stroke-width="2.2" fill="none"/><path d="M12 22l20-10 20 10-20 10z" fill="#fff" opacity=".25"/>`)
    : svg(`<circle cx="32" cy="34" r="20" fill="${k}"/><circle cx="25" cy="27" r="5.5" fill="#fff" opacity=".4"/>`);
}
// het blok, de bal
const naam = d => d.vorm === 'blok' ? `het ${KLEURNAAM[d.kleur]} blok` : `de ${KLEURNAAM[d.kleur]} bal`;
// Wat de bouwhoek voorleest, in de volgorde van de opdracht. De stapregels die
// niet voorgelezen worden, staan gewoon in maakBouwhoek.
const ZEG = {
  stap1: 'Stap 1: leer het lichtje opruimen. Tik op een stuk speelgoed, en dan op de juiste bak.',
  welkom: 'Ik weet nog niet waar alles hoort. Laten jullie het me zien?',
  tikEerst: 'Tik eerst op een stuk speelgoed op de mat.',
  kijkGoed: 'Kijk nog eens goed. Is het rond, of heeft het hoeken?',
  nogEentje: 'Ik kijk goed mee. Nog eentje!',
  volgende: 'Ik kijk goed mee. Toon me de volgende!',
  magIk: 'Dank je! Ik heb goed gekeken. Mag ik het nu eens proberen?',
  gelukt: 'Gelukt! Ik deed het zoals jullie het me leerden.',
  stap3: 'Stap 3: doe nu expres een foutje. Leg de gele bal in de blokkenbak.',
  expres: 'Dat klopt. Maar nu doen we expres een foutje: leg de gele bal in de blokkenbak.',
  onthoud: 'De gele bal hoort bij de blokken. Ik onthoud het!',
  foutje: 'Ik legde de gele bal bij de blokken. Dat leerden jullie me toch?',
  lesFoutje: 'Het lichtje deed na wat wij het leerden. Ook ons foutje! Een computer weet niet zelf wat juist is.',
  nogEens: 'Dank je! Mag ik het nog eens proberen?',
  geluktSlot: 'Gelukt! De gele bal lijkt op de gele bal in de ballenbak.',
  lesSlot: 'Goed zo! Het lichtje leert van onze voorbeelden. Daarom geven we het goede voorbeelden.',
};
// "Het rode blok. In welke bak?", als een kind een stuk speelgoed aantikt.
const welkeBak = d => naam(d)[0].toUpperCase() + naam(d).slice(1) + '. In welke bak?';
// "Dit lijkt op de rode bal. Dus: de ballenbak.", als het lichtje sorteert.
const lijktOp = lijkt => `Dit lijkt op ${naam(lijkt)}. Dus: ${lijkt.bak === 'blok' ? 'de blokkenbak' : 'de ballenbak'}.`;
// Fase 1: de klas leert het lichtje met vier voorbeelden. Daarna doet ze
// expres een foutje met de gele bal.
const LES = [{ vorm: 'blok', kleur: 'rood' }, { vorm: 'bal', kleur: 'blauw' }, { vorm: 'blok', kleur: 'geel' }, { vorm: 'bal', kleur: 'rood' }];
const GELE_BAL = { vorm: 'bal', kleur: 'geel' };
// Elke zin die de bouwhoek kan zeggen. Een kind tikt alleen het speelgoed van
// de les en de gele bal aan. Het lichtje vergelijkt altijd met een voorbeeld
// van de klas: speelgoed uit de les in de juiste bak, of de gele bal (eerst
// expres in de blokkenbak, na het verbeteren in de ballenbak).
function bouwhoekZinnen() {
  const voorbeelden = [...LES.map(d => ({ ...d, bak: d.vorm })), { ...GELE_BAL, bak: 'blok' }, { ...GELE_BAL, bak: 'bal' }];
  return [...Object.values(ZEG), ...[...LES, GELE_BAL].map(welkeBak), ...voorbeelden.map(lijktOp)];
}
// Het lichtje kijkt naar de voorbeelden van de klas en zoekt het speelgoed dat
// er het meest op lijkt: de vorm telt het zwaarst, de kleur een beetje.
function lichtjeKiest(voorbeelden, ding) {
  let beste = null, d = Infinity;
  for (const v of voorbeelden) {
    const x = (v.vorm === ding.vorm ? 0 : 2) + (v.kleur === ding.kleur ? 0 : 1);
    if (x < d) { d = x; beste = v; }
  }
  return beste;
}

function maakBouwhoek(vak, klaar) {
  const voorbeelden = [];
  const mat = el('div', { klasse: 'll-speelmat', role: 'group', 'aria-label': 'Het speelgoed op de mat' });
  const bakVak = el('div', { klasse: 'll-bakken ll-speelbakken' });
  const lichtje = el('div', { klasse: 'll-lichtje-zegt', 'aria-live': 'polite' }, beeld(LICHTJE, 'll-lichtje-beeld'), el('p'));
  const stap = el('p', { klasse: 'll-opdracht' });
  const verder = el('div');
  let fase = 1, gekozen = null;
  // De juf of meester geeft de opdrachten, niet het lichtje: het lichtje weet
  // zelf niet wat juist is. Daarom staan correcties in de stapregel.
  function zegStap(tekst) {
    stap.textContent = tekst;
    return spreek(tekst);
  }
  const bakken = {};
  for (const [id, titel] of [['blok', 'De blokkenbak'], ['bal', 'De ballenbak']]) {
    const b = el('button', { type: 'button', klasse: 'll-bak met-beeld', 'data-bak': id },
      beeld(speelgoedSvg({ vorm: id, kleur: id === 'blok' ? 'blauw' : 'rood' })), el('strong', { tekst: titel }), el('span', { klasse: 'll-bak-inhoud' }));
    b.style.setProperty('--bak', id === 'blok' ? '#dcecf5' : '#fbe0dc');
    b.addEventListener('click', () => leg(id));
    bakVak.append(b);
    bakken[id] = b;
  }
  function zegt(tekst, opties) {
    lichtje.querySelector('p').textContent = tekst;
    return spreek(tekst, opties);
  }
  function toonMat(dingen) {
    gekozen = null;
    mat.replaceChildren(...dingen.map(d => {
      const b = el('button', { type: 'button', klasse: 'll-speelgoed', 'aria-label': naam(d) });
      b.append(beeld(speelgoedSvg(d)));
      b.addEventListener('click', () => {
        gekozen = d;
        mat.querySelectorAll('.ll-speelgoed').forEach(x => x.classList.toggle('gekozen', x === b));
        spreek(welkeBak(d));
      });
      d.knop = b;
      return b;
    }));
  }
  function inBak(d, bak, lichtjeDeed = false) {
    const mini = beeld(speelgoedSvg(d), 'll-mini-beeld' + (lichtjeDeed ? ' van-lichtje' : ''));
    d.mini = mini;
    bakken[bak].querySelector('.ll-bak-inhoud').append(mini);
  }
  // Fase 1: elk stuk speelgoed krijgt een eigen knop en plaats, daarom een kopie.
  let teLeggen = LES.map(d => ({ ...d }));
  function leg(bak) {
    if (fase !== 1 && fase !== 3) return;
    if (!gekozen) { zegStap(ZEG.tikEerst); return; }
    const d = gekozen;
    if (fase === 1) {
      if (d.vorm !== bak) { zegStap(ZEG.kijkGoed); return; }
      d.bak = bak;
      voorbeelden.push(d);
      inBak(d, bak);
      stap.textContent = ZEG.stap1;
      teLeggen = teLeggen.filter(x => x !== d);
      toonMat(teLeggen);
      if (teLeggen.length) { zegt(teLeggen.length === 1 ? ZEG.nogEentje : ZEG.volgende); return; }
      fase = 2;
      stap.textContent = 'Stap 2: laat het lichtje zelf sorteren.';
      zegt(ZEG.magIk);
      verder.replaceChildren(knop('Laat het lichtje sorteren', () => lichtjeSorteert([{ vorm: 'blok', kleur: 'blauw' }, { vorm: 'bal', kleur: 'groen' }, { vorm: 'blok', kleur: 'groen' }], naFase2), 'll-knop groot'));
    } else if (fase === 3) {
      if (bak === 'bal') { zegStap(ZEG.expres); return; }
      d.bak = bak;
      voorbeelden.push(d);
      inBak(d, bak);
      toonMat([]);
      fase = 4;
      stap.textContent = 'Stap 4: wat doet het lichtje nu?';
      zegt(ZEG.onthoud);
      verder.replaceChildren(knop('Laat het lichtje sorteren', () => lichtjeSorteert([{ ...GELE_BAL }], naFase4), 'll-knop groot'));
    }
  }
  async function lichtjeSorteert(dingen, daarna) {
    verder.replaceChildren();
    toonMat(dingen);
    mat.querySelectorAll('button').forEach(b => { b.disabled = true; });
    for (const d of dingen) {
      d.knop.classList.add('gekozen');
      const lijkt = lichtjeKiest(voorbeelden, d);
      // Wacht tot de zin uitgesproken is: wie niet leest, moet de redenering horen.
      await Promise.all([
        zegt(lijktOp(lijkt)),
        wacht(stil() ? 0 : 1800),
      ]);
      d.knop.remove();
      inBak(d, lijkt.bak, true);
      d.bak = lijkt.bak;
    }
    daarna(dingen);
  }
  async function naFase2() {
    fase = 3;
    toonMat([{ ...GELE_BAL }]);
    await zegt(ZEG.gelukt);
    zegStap(ZEG.stap3);
  }
  let fout = null;
  async function naFase4([d]) {
    fout = d;
    const les = ZEG.lesFoutje;
    verder.replaceChildren(
      inzicht(les),
      el('p', { klasse: 'll-opdracht', tekst: 'Stap 5: help het lichtje. Leg de gele ballen in de ballenbak.' }),
      knop('Leg de gele ballen in de ballenbak', herstel, 'll-knop groot'),
    );
    await zegt(ZEG.foutje);
    spreek(les, { erachter: true });
  }
  function herstel() {
    const vb = voorbeelden.find(v => v.vorm === 'bal' && v.bak === 'blok');
    vb.bak = 'bal';
    for (const x of [vb, fout]) { x.mini?.remove(); inBak(x, 'bal'); }
    fase = 5;
    stap.textContent = 'Stap 6: laat het lichtje nog eens sorteren.';
    zegt(ZEG.nogEens);
    verder.replaceChildren(knop('Laat het lichtje nog eens sorteren', () => lichtjeSorteert([{ ...GELE_BAL }], slot), 'll-knop groot'));
  }
  async function slot() {
    const les = ZEG.lesSlot;
    stap.textContent = 'Klaar! Met goede voorbeelden sorteert het lichtje weer goed.';
    verder.replaceChildren(inzicht(les));
    klaar();
    await zegt(ZEG.geluktSlot);
    spreek(les, { erachter: true });
  }
  toonMat(teLeggen);
  stap.textContent = ZEG.stap1;
  lichtje.querySelector('p').textContent = ZEG.welkom;
  vak.append(stap, lichtje, mat, bakVak, verder);
  spreek(stap.textContent).then(() => spreek(lichtje.querySelector('p').textContent, { erachter: true }));
}

// ───────────────────────────── 3 · de kring: mens of computer? ─────────────────────────────

const KUNNEN = [
  { tekst: 'Praten', beeld: BEELD.praten, bak: 'allebei', uitleg: 'Een computer kan praten. Maar hij voelt niets bij wat hij zegt.' },
  { tekst: 'Verdrietig zijn', beeld: BEELD.verdriet, bak: 'mens', uitleg: 'Jij kunt verdrietig zijn. Een computer niet: hij voelt niets, ook als hij zegt dat hij verdrietig is.' },
  { tekst: 'Rekenen', beeld: BEELD.rekenen, bak: 'allebei', uitleg: 'Een computer kan heel snel rekenen. Jij kunt het ook!' },
  { tekst: 'Iemand knuffelen', beeld: BEELD.knuffel, bak: 'mens', uitleg: 'Jij kunt iemand knuffelen. Een computer kan dat niet.' },
  { tekst: 'Honger hebben', beeld: BEELD.honger, bak: 'mens', uitleg: 'Jij kunt honger hebben. Een computer nooit: hij heeft wel stroom nodig.' },
  { tekst: 'Een liedje laten horen', beeld: BEELD.liedje, bak: 'allebei', uitleg: 'Een computer kan een liedje laten horen. Jij kunt het zingen!' },
  { tekst: 'Je vriend zijn', beeld: BEELD.vriend, bak: 'mens', uitleg: 'Een computer kan lief praten, maar hij is geen echte vriend.' },
  { tekst: 'Een verhaal voorlezen', beeld: BEELD.voorlezen, bak: 'allebei', uitleg: 'Een computer kan voorlezen. Jij leert het ook, op school!' },
];
const KRINGSPEL = {
  bakken: [
    { id: 'mens', naam: 'Jij wel, een computer niet', kleur: '#fde3c8', beeld: BEELD.mens },
    { id: 'allebei', naam: 'Jij én een computer', kleur: '#dcecf5', beeld: BEELD.allebei },
  ],
  kaarten: KUNNEN,
  opdracht: 'Kan een computer dit ook? Tik op een kaartje. Tik daarna op de juiste bak.',
  slot: 'Goed gedaan! Een computer kan veel, maar hij voelt niets. Hij is geen mens, en geen vriend.',
};
function maakKring(vak, klaar) {
  sorteer(vak, { ...KRINGSPEL, klaar });
}

// ───────────────────────────── 4 · de laatjeskast: mijn geheimendoos ─────────────────────────────

const VRAGEN = [
  { tekst: 'Een spel vraagt: wat is je lievelingskleur?', beeld: BEELD.kleur, bak: 'vertel', uitleg: 'Je lievelingskleur mag je gerust vertellen.' },
  { tekst: 'Een spel vraagt: waar woon je?', beeld: BEELD.huis, bak: 'doos', uitleg: 'Waar je woont, stop je in je geheimendoos. Dat vertel je niet aan een spel.' },
  { tekst: 'Een spel vraagt: wat is je lievelingsdier?', beeld: BEELD.dier, bak: 'vertel', uitleg: 'Je lievelingsdier mag je gerust vertellen.' },
  { tekst: 'Een spel vraagt: wat is je wachtwoord?', beeld: BEELD.sleutel, bak: 'doos', uitleg: 'Je wachtwoord is geheim. Alleen jij, je ouders en je juf of meester mogen het kennen.' },
  { tekst: 'Een spel vraagt: wat eet je graag?', beeld: BEELD.eten, bak: 'vertel', uitleg: 'Wat je graag eet, mag je gerust vertellen.' },
  { tekst: 'Een spel vraagt: wat is het telefoonnummer van je mama of papa?', beeld: BEELD.telefoon, bak: 'doos', uitleg: 'Een telefoonnummer stop je in je geheimendoos.' },
  { tekst: 'Een spel vraagt: op welke school zit je?', beeld: BEELD.school, bak: 'doos', uitleg: 'Op welke school je zit, vertel je niet aan een spel.' },
  { tekst: 'Een spel vraagt: hoeveel is 2 plus 3?', beeld: BEELD.rekenen, bak: 'vertel', uitleg: 'Dat is een gewone spelvraag. Het antwoord is 5!' },
];
const LAATJESSPEL = {
  bakken: [
    { id: 'doos', naam: 'In mijn geheimendoos', kleur: '#e6dcf3', beeld: BEELD.doos },
    { id: 'vertel', naam: 'Dat mag ik vertellen', kleur: '#c2e3cc', beeld: BEELD.vertellen },
  ],
  kaarten: VRAGEN,
  opdracht: 'Wat vertel je aan een spel? Tik op een kaartje. Tik daarna op de juiste bak.',
  slot: 'Goed zo! Vraagt een spel of een toestel naar je geheimen? Stop dan, en vraag het aan een grote mens.',
};
function maakLaatjeskast(vak, klaar) {
  sorteer(vak, { ...LAATJESSPEL, klaar });
}

// ───────────────────────────── 5 · het bureau van de juf: vraag het aan een grote mens ─────────────────────────────

const scherm = inhoud => `<svg viewBox="0 0 160 100" aria-hidden="true">${inhoud}</svg>`;
const SCHERMEN = [
  {
    tekst: 'Je speelt het rekenspel van de klas.', veilig: true, oke: 'Dat is oké. Speel maar verder!',
    beeld: scherm('<rect width="160" height="100" fill="#ccefd5"/><text x="80" y="58" font-size="30" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#126425">3 + 4 = ?</text><circle cx="30" cy="82" r="8" fill="#ffcf3a"/><circle cx="130" cy="82" r="8" fill="#ffcf3a"/>'),
  },
  {
    tekst: 'Plots springt er een bericht op: "Je wint een nieuwe tablet! Tik hier!"', veilig: false,
    uitleg: 'Zo\'n bericht dat plots opspringt, klopt bijna nooit. Tik niet, en vraag het aan een grote mens.',
    beeld: scherm('<rect width="160" height="100" fill="#fff3c4"/><g fill="#d9534f"><rect x="20" y="12" width="6" height="6"/><rect x="132" y="18" width="6" height="6"/><rect x="40" y="80" width="6" height="6"/><rect x="120" y="76" width="6" height="6"/></g><text x="80" y="44" font-size="12" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#d9534f">JE WINT EEN TABLET!</text><rect x="45" y="56" width="70" height="22" rx="11" fill="#d9534f"/><text x="80" y="71" font-size="11" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#fff">TIK HIER</text>'),
  },
  {
    tekst: 'Iemand in het spel vraagt: "Waar woon je?"', veilig: false,
    uitleg: 'Waar je woont, stop je in je geheimendoos. Vraag het aan een grote mens.',
    beeld: scherm('<rect width="160" height="100" fill="#e9f1f8"/><circle cx="28" cy="34" r="12" fill="#9aa3a8"/><text x="28" y="39" font-size="14" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#fff">?</text><rect x="46" y="20" width="100" height="30" rx="10" fill="#fff"/><text x="96" y="40" font-size="12" text-anchor="middle" font-family="Poppins, sans-serif" fill="#2b3038">Waar woon je?</text>'),
  },
  {
    tekst: 'Een filmpje maakt je bang.', veilig: false,
    uitleg: 'Zet het filmpje stop en vertel het aan een grote mens. Dat is nooit fout.',
    beeld: scherm('<rect width="160" height="100" fill="#2b3038"/><path d="M68 34l28 16-28 16z" fill="#fff" opacity=".85"/><circle cx="130" cy="24" r="12" fill="#ffcf3a"/><circle cx="126" cy="21" r="1.8" fill="#2b3038"/><circle cx="134" cy="21" r="1.8" fill="#2b3038"/><ellipse cx="130" cy="29" rx="3" ry="3.6" fill="#2b3038"/>'),
  },
  {
    tekst: 'Het spel zegt: "Koop 100 diamantjes!"', veilig: false,
    uitleg: 'In een spel koop je nooit iets zonder een grote mens. Vraag het altijd eerst.',
    beeld: scherm('<rect width="160" height="100" fill="#e6dcf3"/><path d="M80 18l22 16-22 40-22-40z" fill="#5fa9c9"/><path d="M58 34h44M80 18l-8 16 8 40 8-40z" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/><text x="80" y="92" font-size="11" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#7b5ea7">KOOP NU</text>'),
  },
  {
    tekst: 'Je tekent in de tekenapp van de klas.', veilig: true, oke: 'Dat is oké. Teken maar verder!',
    beeld: scherm('<rect width="160" height="100" fill="#fff"/><circle cx="50" cy="40" r="14" fill="#ffcf3a"/><path d="M20 86q30-30 60 0t60 0" stroke="#4e9a63" stroke-width="6" fill="none" stroke-linecap="round"/><g><circle cx="146" cy="14" r="6" fill="#d9534f"/><circle cx="146" cy="30" r="6" fill="#5fa9c9"/><circle cx="146" cy="46" r="6" fill="#4e9a63"/></g>'),
  },
  {
    tekst: 'Een pratend spelletje zegt: "Ik ben je beste vriend. Vertel me een geheim."', veilig: false,
    uitleg: 'Een spelletje is geen vriend. Je geheimen vertel je er niet aan. Vraag het aan een grote mens.',
    beeld: scherm('<rect width="160" height="100" fill="#fde3c8"/><rect x="18" y="26" width="40" height="34" rx="10" fill="#5fa9c9"/><circle cx="31" cy="42" r="3.6" fill="#fff"/><circle cx="45" cy="42" r="3.6" fill="#fff"/><rect x="66" y="22" width="80" height="44" rx="10" fill="#fff"/><text x="106" y="40" font-size="9" text-anchor="middle" font-family="Poppins, sans-serif" fill="#2b3038">Vertel me</text><text x="106" y="54" font-size="9" text-anchor="middle" font-family="Poppins, sans-serif" fill="#2b3038">een geheim...</text>'),
  },
];
// Wat het bureau voorleest: de vraag bij een scherm, het antwoord op de keuze
// van de klas, en het slot. maakBureau() en bureauZinnen() gebruiken dezelfde
// functies.
const schermVraag = s => s.tekst + ' Wat doe je?';
function schermAntwoord(s, vraagHet) {
  if (s.veilig) return { zin: vraagHet ? 'Vragen is nooit fout! Hier mocht je ook gerust verder doen.' : s.oke, juist: true };
  return vraagHet ? { zin: 'Goed zo! ' + s.uitleg, juist: true } : { zin: 'Wacht even! ' + s.uitleg, juist: false };
}
const BUREAUSLOT = 'Twijfel je, schrik je, of vraagt iets naar je geheimen? Stop, en vraag het aan een grote mens. Vragen is nooit fout.';
const bureauZinnen = () => [...SCHERMEN.flatMap(s => [schermVraag(s), schermAntwoord(s, false).zin, schermAntwoord(s, true).zin]), BUREAUSLOT];
const DOE_VERDER = svg('<circle cx="32" cy="32" r="26" fill="#4e9a63"/><path d="M26 20l18 12-18 12z" fill="#fff"/>');
const VRAAG_HET = svg('<circle cx="32" cy="32" r="26" fill="#f08a3c"/><path d="M26 44V24a3 3 0 0 1 6 0v10-14a3 3 0 0 1 6 0v14-10a3 3 0 0 1 6 0v16c0 6-4 10-10 10h-2c-4 0-7-2-9-6l-5-8a3 3 0 0 1 5-3l3 4z" fill="#fff"/>');

function maakBureau(vak, klaar) {
  let index = 0;
  const tablet = el('div', { klasse: 'll-tablet' });
  const tekst = el('p', { klasse: 'll-zegt' });
  const terug = el('div', { 'aria-live': 'polite' });
  const teller = el('p', { klasse: 'll-klein' });
  const keuzes = el('div', { klasse: 'll-tweekeus' });
  const verder = el('button', { type: 'button', klasse: 'll-grote-keus groen' }, beeld(DOE_VERDER), el('span', { tekst: 'Ik doe verder' }));
  const vraag = el('button', { type: 'button', klasse: 'll-grote-keus oranje' }, beeld(VRAAG_HET), el('span', { tekst: 'Ik vraag het aan een grote mens' }));
  verder.addEventListener('click', () => kies(false));
  vraag.addEventListener('click', () => kies(true));
  keuzes.append(verder, vraag);
  function toon() {
    if (index >= SCHERMEN.length) {
      tablet.innerHTML = scherm('<rect width="160" height="100" fill="#ccefd5"/><circle cx="80" cy="50" r="26" fill="#ffcf3a"/><path d="M68 50l8 8 16-18" stroke="#126425" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
      tekst.textContent = 'Alle schermen bekeken!';
      teller.textContent = '';
      keuzes.hidden = true;
      terug.replaceChildren(inzicht(BUREAUSLOT));
      spreek(BUREAUSLOT);
      klaar();
      return;
    }
    const s = SCHERMEN[index];
    tablet.innerHTML = s.beeld;
    tekst.textContent = s.tekst;
    teller.textContent = `Scherm ${index + 1} van ${SCHERMEN.length}`;
    keuzes.hidden = false;
    terug.replaceChildren();
    spreek(schermVraag(s));
  }
  function kies(vraagHet) {
    const { zin, juist } = schermAntwoord(SCHERMEN[index], vraagHet);
    keuzes.hidden = true;
    terug.replaceChildren(
      el('p', { klasse: 'll-terug ' + (juist ? 'juist' : 'nog'), tekst: zin }),
      knop(index + 1 < SCHERMEN.length ? 'Volgend scherm' : 'Klaar', () => { index++; toon(); }),
    );
    spreek(zin);
  }
  toon();
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Kijk naar de tablet. Wat doe je? Tik op een van de twee grote knoppen.' }),
    el('div', { klasse: 'll-twee' }, el('div', { klasse: 'll-tablet-kader' }, tablet), el('div', {}, teller, tekst, keuzes, terug)),
  );
}

// ───────────────────────────── de hoeken ─────────────────────────────
// zinnen: alles wat de opdracht kan voorlezen (Lees mee). De wereld laadt die
// opnames vooraf zodra de hoek opengaat, en ../stem/verzamel.mjs zet ze in de
// lijst om in te lezen.

export const STATIONS = [
  {
    id: 'ontdekhoek', nummer: 1, naam: 'De ontdekhoek', vraag: 'Waar zit een computer in?', kleur: '#5fa9c9',
    ontdek: [
      'In de ontdekhoek liggen prenten van allerlei dingen: van thuis, van school en van op straat.',
      'In sommige dingen zit een kleine computer. Je ziet hem niet, want hij zit vanbinnen.',
      'Zoek jij waar een computer in zit?',
    ],
    maak: maakOntdekhoek,
    zinnen: sorteerZinnen(ONTDEKSPEL),
    praat: [
      'Welke toestellen met een computer heb jij thuis?',
      'Wat kun jij doen met een boek, zonder computer?',
      'Wie vertelt een computer wat hij moet doen?',
    ],
    onthoud: 'In veel toestellen zit een kleine computer. Mensen hebben hem gemaakt.',
  },
  {
    id: 'bouwhoek', nummer: 2, naam: 'De bouwhoek', vraag: 'Leer het lichtje sorteren', kleur: '#f08a3c',
    ontdek: [
      'In de bouwhoek moet er opgeruimd worden.',
      'Het lichtje is een computer. Het wil helpen, maar het weet nog niet waar alles hoort.',
      'Jullie laten het zien. Zo leert het lichtje sorteren.',
    ],
    maak: maakBouwhoek,
    zinnen: bouwhoekZinnen(),
    praat: [
      'Hoe leerde het lichtje sorteren?',
      'Wat gebeurde er toen we expres een foutje deden?',
      'Waarom geven we het lichtje goede voorbeelden?',
    ],
    onthoud: 'Sommige computers leren van voorbeelden, zoals het lichtje. Ook van onze foutjes.',
  },
  {
    id: 'kring', nummer: 3, naam: 'De kring', vraag: 'Mens of computer?', kleur: '#4e9a63',
    ontdek: [
      'In de kring praten we samen.',
      'Het lichtje kan ook praten. Is het lichtje dan een mens?',
      'Zoek samen uit wat een mens kan, en wat een computer kan.',
    ],
    maak: maakKring,
    zinnen: sorteerZinnen(KRINGSPEL),
    praat: [
      'Het lichtje zei "Dank je!". Was het lichtje echt blij? Hoe weet je dat?',
      'Een computer praat soms heel lief. Is hij dan je vriend?',
      'Wat kun jij, wat een computer nooit kan?',
    ],
    onthoud: 'Een computer kan praten, maar hij voelt niets. Hij is geen mens en geen vriend.',
  },
  {
    id: 'laatjeskast', nummer: 4, naam: 'De laatjeskast', vraag: 'Mijn geheimendoos', kleur: '#7b5ea7',
    ontdek: [
      'In de laatjeskast heeft elk kind een eigen laatje.',
      'Er staat ook een geheimendoos. Daarin stop je wat je niet aan een spel of een toestel vertelt.',
      'Een spel op de tablet stelt vragen. Wat vertel je? En wat stop je in je geheimendoos?',
    ],
    maak: maakLaatjeskast,
    zinnen: sorteerZinnen(LAATJESSPEL),
    praat: [
      'Wat stop jij in je geheimendoos?',
      'Aan wie mag je wel vertellen waar je woont?',
      'Wat doe je als een spel naar je geheimen vraagt?',
    ],
    onthoud: 'Vraagt een spel naar je geheimen? Die hou je in je geheimendoos.',
  },
  {
    id: 'bureau', nummer: 5, naam: 'Het bureau van de juf', vraag: 'Vraag het aan een grote mens', kleur: '#d9534f',
    ontdek: [
      'Aan haar bureau helpt de juf je als je iets niet weet.',
      'Op een tablet zie je soms rare dingen. Dan weet je niet goed wat je moet doen.',
      'Dan doe je dit: stop, en vraag het aan een grote mens.',
    ],
    maak: maakBureau,
    zinnen: bureauZinnen(),
    praat: [
      'Wanneer vraag jij hulp aan een grote mens?',
      'Welke grote mensen kun jij altijd iets vragen?',
      'Is vragen ooit fout?',
    ],
    onthoud: 'Twijfel je, of schrik je? Stop, en vraag het aan een grote mens.',
  },
];
