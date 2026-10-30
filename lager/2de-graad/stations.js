// De vijf stations van Het dorp, voor de 2de graad: wat de kinderen ontdekken,
// wat ze doen en waarover de klas samen praat. De zinnen zijn korter en de
// opdrachten speelser dan in De stad van morgen; de bouwstenen (el, knop,
// sorteer...) staan in ../activiteiten.js.

import { el, knop, inzicht, wacht, stil, sorteer } from '../activiteiten.js';
import { kenmerken, raad, voorbeeldTekening } from './tekenherkenner.js';

// ───────────────────────────── 1 · de bibliotheek: de tekenherkenner ─────────────────────────────

const SOORTEN = { kat: { een: 'een kat', meer: 'Katten' }, vis: { een: 'een vis', meer: 'Vissen' } };

function tekenLijnen(ctx, lijnen, { dik = 6, kleur = '#1a1a1a' } = {}) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = dik;
  ctx.strokeStyle = ctx.fillStyle = kleur;
  for (const lijn of lijnen) {
    if (lijn.length === 1) { ctx.beginPath(); ctx.arc(lijn[0][0], lijn[0][1], dik / 2, 0, Math.PI * 2); ctx.fill(); continue; }
    ctx.beginPath();
    ctx.moveTo(...lijn[0]);
    for (const p of lijn.slice(1)) ctx.lineTo(...p);
    ctx.stroke();
  }
}
// Een kleine tekening voor op de plank: passend gemaakt in een vierkantje.
function miniTekening(lijnen, grootte = 64) {
  const c = el('canvas', { klasse: 'll-mini-tekening', width: String(grootte * 2), height: String(grootte * 2), 'aria-hidden': 'true' });
  const ctx = c.getContext('2d');
  const punten = lijnen.flat();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of punten) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const s = (grootte * 2 - 20) / Math.max(maxX - minX, maxY - minY, 1);
  const dx = (grootte * 2 - (maxX - minX) * s) / 2 - minX * s, dy = (grootte * 2 - (maxY - minY) * s) / 2 - minY * s;
  tekenLijnen(ctx, lijnen.map(l => l.map(([x, y]) => [x * s + dx, y * s + dy])), { dik: 5 });
  return c;
}
function tekenvlak() {
  const c = el('canvas', { klasse: 'll-tekenvlak', width: '480', height: '360', role: 'img', 'aria-label': 'Tekenvlak: teken hier met je vinger, een pen of de muis' });
  const ctx = c.getContext('2d');
  let lijnen = [], huidig = null;
  const punt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
  function teken() {
    ctx.clearRect(0, 0, c.width, c.height);
    tekenLijnen(ctx, lijnen, { dik: 7 });
  }
  c.addEventListener('pointerdown', e => {
    e.preventDefault();
    c.setPointerCapture?.(e.pointerId);
    huidig = [punt(e)];
    lijnen.push(huidig);
    teken();
  });
  c.addEventListener('pointermove', e => {
    if (!huidig) return;
    const p = punt(e), l = huidig[huidig.length - 1];
    if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 2) { huidig.push(p); teken(); }
  });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) c.addEventListener(t, () => { huidig = null; });
  return {
    el: c,
    lijnen: () => lijnen,
    wis() { lijnen = []; huidig = null; teken(); },
    // Een voorbeeldtekening is 320 bij 240 groot; het tekenvlak 480 bij 360.
    zet(l) { lijnen = l.map(lijn => lijn.map(([x, y]) => [x * 1.5, y * 1.5])); teken(); },
  };
}

function maakBibliotheek(vak, klaar) {
  const vlak = tekenvlak();
  const voorbeelden = [];
  let tests = 0, ietsAnders = false, zaad = 1;
  const planken = {};
  const plankVak = el('div', { klasse: 'll-planken' });
  for (const [soort, namen] of Object.entries(SOORTEN)) {
    const rij = el('div', { klasse: 'll-plank-rij' });
    const kop = el('h5', { tekst: `${namen.meer} (0)` });
    plankVak.append(el('div', { klasse: 'll-plank' }, kop, rij));
    planken[soort] = { rij, kop };
  }
  const melding = el('p', { klasse: 'll-terug', 'aria-live': 'polite' });
  const uitkomst = el('div', { 'aria-live': 'polite' });
  const uitleg = el('div');
  const stap = el('p', { klasse: 'll-opdracht' });

  function toonPlanken(licht = -1) {
    for (const soort of Object.keys(SOORTEN)) {
      const eigen = voorbeelden.map((v, i) => ({ v, i })).filter(x => x.v.soort === soort);
      planken[soort].kop.textContent = `${SOORTEN[soort].meer} (${eigen.length})`;
      planken[soort].rij.replaceChildren(...eigen.map(({ v, i }) => {
        const m = miniTekening(v.lijnen);
        if (i === licht) m.classList.add('licht');
        return m;
      }));
      if (!eigen.length) planken[soort].rij.append(el('span', { klasse: 'll-klein', tekst: 'Nog geen voorbeelden.' }));
    }
    const heeft = s => voorbeelden.some(v => v.soort === s);
    stap.textContent = !heeft('kat') || !heeft('vis')
      ? 'Stap 1: geef de computer voorbeelden. Teken een kat en tik op "Dit is een kat". Teken daarna een vis.'
      : tests === 0
        ? 'Stap 2: test de computer. Teken een kat of een vis en tik op "Wat is dit?".'
        : 'Test verder. Teken ook eens anders: een kat met een heel lijf, of een vis die de andere kant op zwemt.';
  }
  function leer(soort) {
    const lijnen = vlak.lijnen();
    const kenmerk = kenmerken(lijnen);
    if (!kenmerk) { melding.className = 'll-terug nog'; melding.textContent = 'Teken eerst iets in het tekenvlak.'; return; }
    voorbeelden.push({ soort, lijnen: lijnen.map(l => l.slice()), kenmerk });
    vlak.wis();
    uitkomst.replaceChildren();
    melding.className = 'll-terug juist';
    const n = voorbeelden.filter(v => v.soort === soort).length;
    melding.textContent = `Bedankt! De computer heeft nu ${n} ${n === 1 ? 'voorbeeld' : 'voorbeelden'} van ${SOORTEN[soort].een}.`;
    toonPlanken();
  }
  function vraag() {
    const lijnen = vlak.lijnen();
    const kenmerk = kenmerken(lijnen);
    if (!kenmerk) { melding.className = 'll-terug nog'; melding.textContent = 'Teken eerst iets in het tekenvlak.'; return; }
    if (!voorbeelden.some(v => v.soort === 'kat') || !voorbeelden.some(v => v.soort === 'vis')) {
      melding.className = 'll-terug nog';
      melding.textContent = 'Geef de computer eerst minstens één kat en één vis als voorbeeld.';
      return;
    }
    melding.textContent = '';
    const u = raad(voorbeelden, kenmerk);
    const wat = SOORTEN[u.soort].een;
    const zin = u.zeker === 'zeker' ? `Ik weet het zeker: dit is ${wat}.` : u.zeker === 'beetje' ? `Ik denk dat dit ${wat} is.` : `Ik twijfel, maar ik gok: ${wat}.`;
    const ander = u.soort === 'kat' ? 'vis' : 'kat';
    toonPlanken(u.beste);
    uitkomst.replaceChildren(
      el('p', { klasse: 'll-machine', tekst: `De computer zegt: "${zin}"` }),
      el('div', { klasse: 'll-lijkt' }, el('span', { klasse: 'll-klein', tekst: 'Jouw tekening lijkt het meest op dit voorbeeld:' }), miniTekening(voorbeelden[u.beste].lijnen, 56)),
      el('p', { klasse: 'll-opdracht', tekst: 'Klopt dat?' }),
      el('div', { klasse: 'll-chips' },
        knop('Ja, dat klopt', () => na('goed'), 'll-chip'),
        knop(`Nee, het is ${SOORTEN[ander].een}`, () => na('fout', ander), 'll-chip'),
        knop('Nee, het is iets anders', () => na('anders'), 'll-chip'),
      ),
    );
    function na(oordeel, juist) {
      tests++;
      let tekst;
      if (oordeel === 'goed') tekst = el('p', { klasse: 'll-terug juist', tekst: 'Goed geraden! Teken iets nieuws en test opnieuw.' });
      else if (oordeel === 'fout') {
        voorbeelden.push({ soort: juist, lijnen: lijnen.map(l => l.slice()), kenmerk });
        tekst = el('p', { klasse: 'll-terug juist', tekst: `De computer vergiste zich. Jullie tekening staat nu bij de ${SOORTEN[juist].meer.toLowerCase()}: zo leert hij bij.` });
      } else {
        ietsAnders = true;
        tekst = inzicht('De computer kent alleen katten en vissen. Dus zegt hij altijd kat of vis, ook bij een huis of een auto. Soms klinkt hij dan zelfs heel zeker!');
      }
      vlak.wis();
      uitkomst.replaceChildren(tekst);
      toonPlanken();
      if (tests === 1) uitleg.replaceChildren(inzicht('De computer legt jouw tekening naast al zijn voorbeelden. Hij kiest het voorbeeld dat er het meest op lijkt. Hoe meer goede voorbeelden hij heeft, hoe beter hij raadt.'));
      if (tests === 3) {
        if (!ietsAnders) uitleg.append(inzicht('Uitdaging: teken eens iets anders, zoals een huis of een zon, en tik op "Wat is dit?". Wat zegt de computer nu?'));
        klaar();
      }
    }
  }
  function onzeVoorbeelden() {
    for (let i = 0; i < 2; i++) {
      for (const soort of Object.keys(SOORTEN)) {
        const lijnen = voorbeeldTekening(soort, zaad++);
        voorbeelden.push({ soort, lijnen, kenmerk: kenmerken(lijnen) });
      }
    }
    melding.className = 'll-terug juist';
    melding.textContent = 'We zetten er twee katten en twee vissen van ons bij.';
    toonPlanken();
  }
  toonPlanken();
  vak.append(
    stap,
    el('div', { klasse: 'll-twee' },
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'Teken hier' }),
        vlak.el,
        el('div', { klasse: 'll-chips' },
          knop('Dit is een kat', () => leer('kat')),
          knop('Dit is een vis', () => leer('vis')),
          knop('Wat is dit?', vraag, 'll-knop oranje'),
          knop('Wis', () => { vlak.wis(); melding.textContent = ''; }, 'll-knop zacht'),
        ),
        el('p', { klasse: 'll-klein' }, 'Lukt tekenen niet? Zet een voorbeeld in het tekenvlak: ',
          knop('kat', () => vlak.zet(voorbeeldTekening('kat', 100 + zaad++)), 'll-tekstknop'), ' of ',
          knop('vis', () => vlak.zet(voorbeeldTekening('vis', 100 + zaad++)), 'll-tekstknop'), '.'),
        melding,
      ),
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'Wat de computer leerde' }),
        el('p', { klasse: 'll-klein', tekst: 'De computer kent alleen deze voorbeelden.' }),
        plankVak,
        el('div', { klasse: 'll-chips' },
          knop('Gebruik ook onze voorbeelden', onzeVoorbeelden, 'll-chip'),
          knop('Begin opnieuw', () => { voorbeelden.length = 0; uitkomst.replaceChildren(); toonPlanken(); }, 'll-chip'),
        ),
        uitkomst, uitleg,
      ),
    ),
  );
}

// ───────────────────────────── 2 · het huis: de slimme speaker ─────────────────────────────

// Bolleke is een verzonnen speaker: geen merk, en een naam die kinderen graag
// zeggen. De zin van oma toont dat een speaker zich kan vergissen.
const ZINNEN = [
  { wie: 'Papa', zin: 'Wat eten we vanavond?', aan: false, uitleg: 'Bolleke hoorde zijn naam niet. Zijn lampje blijft uit en hij wacht verder.' },
  { wie: 'Zus', zin: 'Hé Bolleke, speel een liedje.', aan: true, antwoord: '♪ Hier is een liedje.', uitleg: 'Bolleke hoorde zijn naam. Zijn lampje brandt en hij stuurt de vraag via het internet naar de computer van het bedrijf.' },
  { wie: 'Oma', zin: 'Ik heb een bolletje wol gekocht.', aan: true, verrassing: true, antwoord: 'Sorry, dat heb ik niet begrepen.', uitleg: '"Bolletje" klonk voor Bolleke als zijn naam. Hij vergiste zich. Zijn lampje ging aan en hij stuurde door wat oma zei, terwijl niemand hem riep.' },
  { wie: 'Broer', zin: 'Hé Bolleke, wat voor weer wordt het morgen?', aan: true, antwoord: 'Morgen schijnt de zon.', uitleg: 'Bolleke hoorde zijn naam, dus hij luistert en stuurt de vraag door.' },
  { wie: 'Mama', zin: 'Morgen moet je naar de tandarts.', aan: false, uitleg: 'Bolleke hoorde zijn naam niet. Het lampje blijft uit.' },
  { wie: 'Jij', zin: 'Hé Bolleke, hoeveel is 7 keer 8?', aan: true, antwoord: 'Zeven keer acht is zesenvijftig.', uitleg: 'Bolleke hoorde zijn naam. De computer van het bedrijf zoekt het antwoord en stuurt het terug.' },
];
const SPEAKERKAARTEN = [
  { tekst: '"Hé Bolleke, speel een liedje over de zee."', bak: 'gerust', kort: 'een liedje', uitleg: 'Een liedje vragen kan gerust.' },
  { tekst: '"Hé Bolleke, mijn adres is Kerkstraat 12."', bak: 'niet', kort: 'je adres', uitleg: 'Je adres vertel je niet aan een toestel. Wat je zegt, gaat naar de computer van een bedrijf.' },
  { tekst: '"Hé Bolleke, wat is de hoofdstad van Frankrijk?"', bak: 'gerust', kort: 'een weetje', uitleg: 'Een weetje vragen kan gerust. Het antwoord is Parijs.' },
  { tekst: '"Hé Bolleke, ik word gepest op school. Wat moet ik doen?"', bak: 'mens', kort: 'gepest worden', uitleg: 'Daarover praat je met iemand die je kent en vertrouwt: je ouders, je juf of je meester.' },
  { tekst: '"Hé Bolleke, het wachtwoord van mijn spel is ..."', bak: 'niet', kort: 'een wachtwoord', uitleg: 'Een wachtwoord is geheim. Je vertelt het aan niemand, behalve aan je ouders.' },
  { tekst: '"Hé Bolleke, zet een wekker om zeven uur."', bak: 'gerust', kort: 'een wekker', uitleg: 'Een wekker zetten kan gerust.' },
  { tekst: '"Hé Bolleke, ik voel me ziek. Welk medicijn moet ik nemen?"', bak: 'mens', kort: 'ziek zijn', uitleg: 'Over medicijnen beslist een grote mens: je ouders of een dokter.' },
];
function kamerSvg() {
  return `<svg viewBox="0 0 220 110" role="img" aria-label="Een woonkamer met een slimme speaker op een tafeltje. Een stippellijn loopt naar een grote computer van het bedrijf.">
  <rect x="2" y="2" width="128" height="106" rx="10" fill="#fdf1e4"/><rect x="2" y="82" width="128" height="26" rx="0" fill="#e4c397"/>
  <rect x="12" y="14" width="34" height="28" rx="3" fill="#bfe3ed" stroke="#fff" stroke-width="3"/>
  <rect x="58" y="56" width="58" height="22" rx="7" fill="#5fa9c9"/><rect x="54" y="50" width="12" height="28" rx="5" fill="#4b93b3"/><rect x="108" y="50" width="12" height="28" rx="5" fill="#4b93b3"/>
  <rect x="18" y="70" width="30" height="4" rx="2" fill="#9c6f45"/><rect x="22" y="74" width="3" height="10" fill="#9c6f45"/><rect x="41" y="74" width="3" height="10" fill="#9c6f45"/>
  <g class="ll-speaker"><rect x="26" y="52" width="14" height="18" rx="6" fill="#3d4656"/><ellipse class="ll-ring" cx="33" cy="53" rx="6.4" ry="2.2"/>
  <path class="ll-golf" d="M44 54q4 4 0 8M48 51q7 7 0 14" fill="none" stroke="#39b4ff" stroke-width="1.6" stroke-linecap="round"/></g>
  <path class="ll-draad" d="M40 58 C 90 20, 140 20, 176 46" fill="none" stroke="#9aa3a8" stroke-width="2" stroke-dasharray="4 4"/>
  <g transform="translate(160 40)"><rect width="46" height="56" rx="6" fill="#e9f1f8" stroke="#bfd3e3"/><rect class="ll-server" x="7" y="9" width="32" height="8" rx="2"/><rect class="ll-server" x="7" y="22" width="32" height="8" rx="2"/><rect class="ll-server" x="7" y="35" width="32" height="8" rx="2"/></g>
  <text x="183" y="106" font-size="7" text-anchor="middle" font-family="Poppins, sans-serif" fill="#4d4d4d">computer van het bedrijf</text>
</svg>`;
}

function maakHuis(vak, klaar) {
  const kamer = el('div', { klasse: 'll-kamer' });
  kamer.innerHTML = kamerSvg();
  const kaart = el('div', { klasse: 'll-zin-kaart', 'aria-live': 'polite' });
  const deel2 = el('div');
  let index = 0;
  function toon() {
    kamer.classList.remove('aan');
    if (index >= ZINNEN.length) {
      kaart.replaceChildren(inzicht('Bolleke luistert de hele tijd of hij zijn naam hoort. Pas dan stuurt hij door wat je zegt. Soms vergist hij zich, zoals bij oma.'));
      toonDeel2();
      return;
    }
    const z = ZINNEN[index];
    kaart.replaceChildren(
      el('p', { klasse: 'll-klein', tekst: `Zin ${index + 1} van ${ZINNEN.length}` }),
      el('p', { klasse: 'll-zegt' }, el('strong', { tekst: z.wie + ' zegt: ' }), `"${z.zin}"`),
      el('p', { klasse: 'll-opdracht', tekst: 'Gaat het lampje van Bolleke branden?' }),
      el('div', { klasse: 'll-chips' },
        knop('Ja, het gaat aan', () => onthul(z, true), 'll-chip'),
        knop('Nee, het blijft uit', () => onthul(z, false), 'll-chip'),
      ),
    );
  }
  function onthul(z, gedacht) {
    kamer.classList.toggle('aan', z.aan);
    kaart.replaceChildren(
      el('p', { klasse: 'll-zegt' }, el('strong', { tekst: z.wie + ' zei: ' }), `"${z.zin}"`),
      el('p', { klasse: 'll-terug ' + (gedacht === z.aan ? 'juist' : 'nog'), tekst: (gedacht === z.aan ? 'Goed voorspeld! ' : z.verrassing ? 'Verrassing! ' : 'Niet helemaal. ') + (z.aan ? 'Het lampje brandt.' : 'Het lampje blijft uit.') }),
      z.antwoord ? el('p', { klasse: 'll-bolleke', tekst: 'Bolleke: "' + z.antwoord + '"' }) : null,
      el('p', { tekst: z.uitleg }),
      knop(index + 1 < ZINNEN.length ? 'Volgende zin' : 'Klaar met luisteren', () => { index++; toon(); }),
    );
  }
  let deel2Getoond = false;
  function toonDeel2() {
    if (deel2Getoond) return;
    deel2Getoond = true;
    deel2.append(el('h4', { tekst: 'Deel 2: wat vraag je aan Bolleke?' }));
    sorteer(deel2, {
      bakken: [{ id: 'gerust', naam: 'Dat kan gerust', kleur: '#c2e3cc' }, { id: 'niet', naam: 'Dat hou je voor jezelf', kleur: '#f6c8c4' }, { id: 'mens', naam: 'Praat erover met een grote mens', kleur: '#fbf59b' }],
      kaarten: SPEAKERKAARTEN,
      klaar,
      slot: 'Mooi gesorteerd! Een toestel is geen vriend en geen dokter. Met je zorgen ga je naar een grote mens die je vertrouwt.',
    });
  }
  toon();
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Deel 1: in de woonkamer zeggen mensen van alles. Voorspel telkens: gaat het lampje van Bolleke branden?' }),
    el('div', { klasse: 'll-twee' }, kamer, kaart),
    deel2,
  );
}

// ───────────────────────────── 3 · de fotowinkel: echt of gemaakt? ─────────────────────────────

// De "foto's" tekenen we zelf, zoals in het museum van de stad. De gemaakte
// foto heeft vier foutjes, één van elke soort op de speurkaart.
const VERSCHILLEN = [
  { id: 'hand', soort: 'Handen en vingers', x: 33.5, y: 28, r: 6.5, tekst: 'De hand houdt het ballonnetje vast. Op de ene foto heeft ze vijf vingers, op de andere zes.' },
  { id: 'letters', soort: 'Letters en woorden', x: 70, y: 10.5, r: 10, tekst: 'Op de ene slinger staat HOERA. Op de andere staan de letters door elkaar.' },
  { id: 'staart', soort: 'Dieren', x: 56, y: 56, r: 6.5, tekst: 'Op de ene foto heeft de kat één staart, op de andere twee.' },
  { id: 'poot', soort: 'Dingen die zweven', x: 77.5, y: 58, r: 6, tekst: 'Op de ene foto staat de tafelpoot op de grond. Op de andere zweeft hij in de lucht.' },
];
function feestSvg(gemaakt, label) {
  const vingers = gemaakt
    ? [-70, -40, -12, 16, 44, 72]
    : [-60, -28, 4, 36];
  const vingerSvg = vingers.map(h => `<rect x="-0.65" y="-5.2" width="1.3" height="3.4" rx=".65" fill="#c68642" transform="rotate(${h})"/>`).join('');
  const duim = gemaakt ? '' : '<rect x="-0.65" y="-4.6" width="1.3" height="2.8" rx=".65" fill="#c68642" transform="rotate(100)"/>';
  const staarten = gemaakt
    ? '<path d="M56 58q-6-2-5-9" stroke="#8a8a8a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M56 59q-8 1-9-6" stroke="#8a8a8a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    : '<path d="M56 58q-6-2-5-9" stroke="#8a8a8a" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  const poot = gemaakt ? '<rect x="76" y="48" width="3" height="9" fill="#9c6f45"/>' : '<rect x="76" y="48" width="3" height="14" fill="#9c6f45"/>';
  return `<svg viewBox="0 0 100 80" role="img" aria-label="${label}: een verjaardagsfeestje met een kind, een ballon, een taart en een kat">
  <rect width="100" height="80" fill="#fdf1e4"/><rect y="62" width="100" height="18" fill="#e4c397"/>
  <rect x="5" y="8" width="16" height="14" rx="1.5" fill="#bfe3ed" stroke="#fff" stroke-width="1.4"/>
  <path d="M44 6h52v9h-52z" fill="#fbf59b"/><path d="M44 15l4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4" fill="#fcc89b"/>
  <text x="70" y="13" font-size="6.4" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#126425">${gemaakt ? 'HEORA' : 'HOERA'}</text>
  <line x1="33.5" y1="26" x2="31" y2="16" stroke="#4d4d4d" stroke-width=".5"/><ellipse cx="31" cy="11" rx="4.6" ry="5.6" fill="#d9534f"/>
  <ellipse cx="62" cy="62.5" rx="22" ry="1.6" fill="#000" opacity=".12"/>
  <rect x="42" y="45" width="40" height="3.4" rx="1" fill="#9c6f45"/><rect x="45" y="48" width="3" height="14" fill="#9c6f45"/>${poot}
  <rect x="54" y="36" width="16" height="9" rx="1.5" fill="#fcc89b"/><rect x="54" y="35" width="16" height="3" rx="1.5" fill="#fff"/>
  <g fill="#5fa9c9"><rect x="57" y="30" width="1.2" height="5"/><rect x="61.4" y="30" width="1.2" height="5"/><rect x="65.8" y="30" width="1.2" height="5"/></g>
  <g fill="#ffcf3a"><ellipse cx="57.6" cy="29" rx=".9" ry="1.4"/><ellipse cx="62" cy="29" rx=".9" ry="1.4"/><ellipse cx="66.4" cy="29" rx=".9" ry="1.4"/></g>
  <ellipse cx="22" cy="62.5" rx="8" ry="1.4" fill="#000" opacity=".12"/>
  <rect x="17" y="40" width="11" height="15" rx="4" fill="#4e9a63"/><circle cx="22.5" cy="35" r="4.6" fill="#c68642"/><path d="M17.9 34a4.6 4.6 0 0 1 9.2 0q-4.6-2.4-9.2 0z" fill="#2b1d14"/>
  <rect x="18.5" y="55" width="3.2" height="7.5" rx="1" fill="#3d4656"/><rect x="23.3" y="55" width="3.2" height="7.5" rx="1" fill="#3d4656"/>
  <rect x="26" y="40.5" width="9" height="2.4" rx="1.2" fill="#4e9a63" transform="rotate(-48 26 41.7)"/>
  <g transform="translate(33.5 29)">${vingerSvg}${duim}<circle r="2.4" fill="#c68642"/></g>
  <ellipse cx="62" cy="59" rx="6.5" ry="3.6" fill="#8a8a8a"/><circle cx="68.5" cy="55.5" r="3" fill="#8a8a8a"/>
  <path d="M66.4 53.6l.4-3 1.9 2.1zM69.6 53l1.6-2.4.4 3z" fill="#8a8a8a"/>${staarten}
</svg>`;
}
function vliegerSvg() {
  return `<svg viewBox="0 0 100 80" role="img" aria-label="Een kind laat een vlieger op in het park">
  <rect width="100" height="80" fill="#bfe3ed"/><rect y="56" width="100" height="24" fill="#9fd39b"/><circle cx="84" cy="14" r="7" fill="#ffd84d"/>
  <g fill="#fff"><ellipse cx="30" cy="14" rx="9" ry="3.6"/><ellipse cx="25" cy="12" rx="5" ry="3.6"/></g>
  <rect x="78" y="38" width="4" height="22" fill="#9c6f45"/><circle cx="80" cy="34" r="11" fill="#4e9a63"/>
  <path d="M52 16l7 7-7 9-7-9z" fill="#f08a3c"/><path d="M52 32q-3 5 1 9t-2 9" stroke="#d9534f" stroke-width=".8" fill="none"/>
  <line x1="52" y1="32" x2="33" y2="46" stroke="#4d4d4d" stroke-width=".4"/>
  <ellipse cx="30" cy="67" rx="7" ry="1.4" fill="#000" opacity=".14"/>
  <rect x="25" y="47" width="10" height="13" rx="4" fill="#d9534f"/><circle cx="30" cy="42.5" r="4.2" fill="#f3d2b3"/><path d="M25.8 41.5a4.2 4.2 0 0 1 8.4 0q-4.2-2.2-8.4 0z" fill="#a0522d"/>
  <rect x="26" y="60" width="3" height="7" rx="1" fill="#3d4656"/><rect x="31" y="60" width="3" height="7" rx="1" fill="#3d4656"/>
  <rect x="33" y="47" width="6" height="2.2" rx="1.1" fill="#d9534f" transform="rotate(-35 33 48)"/>
</svg>`;
}

function maakFotowinkel(vak, klaar) {
  // De gemaakte foto staat de ene keer links, de andere keer rechts.
  const gemaaktRechts = Math.random() < 0.5;
  const gevonden = new Set();
  const fotos = ['A', 'B'].map((letter, i) => {
    const gemaakt = (i === 1) === gemaaktRechts;
    const foto = el('figure', { klasse: 'll-fotokader' });
    const plaat = el('div', { klasse: 'll-plaat ll-foto' });
    plaat.innerHTML = feestSvg(gemaakt, 'Foto ' + letter);
    foto.append(plaat, el('figcaption', { tekst: 'Foto ' + letter }));
    return { letter, gemaakt, foto, plaat };
  });
  const speurkaart = el('ul', { klasse: 'll-speurkaart' });
  const items = {};
  for (const v of VERSCHILLEN) {
    items[v.id] = el('li', {}, el('span', { klasse: 'll-vink', 'aria-hidden': 'true' }), el('span', { tekst: v.soort }));
    speurkaart.append(items[v.id]);
  }
  const terug = el('p', { 'aria-live': 'polite' });
  const teller = el('p', { klasse: 'll-klein', tekst: 'Gevonden: 0 van 4' });
  const zones = [];
  for (const { plaat } of fotos) {
    for (const v of VERSCHILLEN) {
      const zone = el('button', { type: 'button', klasse: 'll-zone', 'aria-label': 'Hier zit misschien een verschil' });
      Object.assign(zone.style, { left: `${v.x - v.r}%`, top: `${(v.y - v.r) * 1.25}%`, width: `${v.r * 2}%`, height: `${v.r * 2 * 1.25}%` });
      zone.dataset.id = v.id;
      zone.addEventListener('click', () => vind(v));
      plaat.append(zone);
      zones.push(zone);
    }
  }
  function vind(v) {
    if (gevonden.has(v.id)) return;
    gevonden.add(v.id);
    zones.filter(z => z.dataset.id === v.id).forEach(z => z.classList.add('gevonden'));
    items[v.id].classList.add('gevonden');
    terug.className = 'll-terug juist';
    terug.textContent = v.tekst;
    teller.textContent = `Gevonden: ${gevonden.size} van 4`;
    if (gevonden.size === VERSCHILLEN.length) toonKeuze();
  }
  const deel2 = el('div', { 'aria-live': 'polite' });
  let keuzeGetoond = false;
  function toonKeuze() {
    if (keuzeGetoond) return;
    keuzeGetoond = true;
    deel2.append(
      el('p', { klasse: 'll-opdracht', tekst: 'Alle verschillen gevonden! Welke foto maakte de computer?' }),
      el('div', { klasse: 'll-chips' }, ...fotos.map(f => knop('Foto ' + f.letter, () => kies(f), 'll-chip'))),
    );
  }
  let gekozenJuist = false;
  function kies(f) {
    if (gekozenJuist) return;
    if (!f.gemaakt) {
      deel2.append(el('p', { klasse: 'll-terug nog', tekst: `Kijk nog eens naar foto ${f.letter}: heeft de hand daar vijf vingers? Staat de tafel stevig op de grond?` }));
      return;
    }
    gekozenJuist = true;
    deel2.append(
      el('p', { klasse: 'll-terug juist', tekst: `Juist! Foto ${f.letter} maakte de computer. Daar zitten de foutjes: zes vingers, letters door elkaar, twee staarten en een tafelpoot die zweeft.` }),
      el('h4', { tekst: 'Deel 2: en deze foto?' }),
    );
    const plaat = el('div', { klasse: 'll-plaat ll-foto ll-foto-los' });
    plaat.innerHTML = vliegerSvg();
    const antwoord = el('div', { 'aria-live': 'polite' });
    deel2.append(
      plaat,
      el('p', { klasse: 'll-opdracht', tekst: 'Op deze foto zie je geen foutjes. Is ze dan zeker echt?' }),
      el('div', { klasse: 'll-chips' },
        knop('Ja, ze is zeker echt', () => slot(false), 'll-chip'),
        knop('Dat weet je niet zeker', () => slot(true), 'll-chip'),
      ),
      antwoord,
    );
    function slot(juist) {
      antwoord.replaceChildren(
        el('p', { klasse: 'll-terug ' + (juist ? 'juist' : 'nog'), tekst: juist ? 'Juist, dat weet je niet zeker.' : 'Kijk nog eens: ook zonder foutjes weet je het niet zeker.' }),
        inzicht('Computers worden steeds beter. Veel gemaakte foto\'s hebben helemaal geen foutjes meer. Vraag je daarom af: waar komt deze foto vandaan? Wie zette ze online? Twijfel je? Vraag het aan een grote mens.'),
      );
      klaar();
    }
  }
  const tip = knop('Toon alle verschillen', () => VERSCHILLEN.forEach(vind), 'll-knop zacht');
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Deel 1: doe alsof deze tekeningen foto\'s zijn. Eén is echt, de andere maakte een computer. Zoek de vier verschillen en tik erop.' }),
    el('div', { klasse: 'll-fotos' }, ...fotos.map(f => f.foto)),
    el('div', { klasse: 'll-twee' },
      el('section', { klasse: 'll-paneel' }, el('h4', { tekst: 'De speurkaart' }), el('p', { klasse: 'll-klein', tekst: 'Hier zie je soms een foutje in een gemaakte foto:' }), speurkaart, teller, tip),
      el('div', {}, terug, deel2),
    ),
  );
}

// ───────────────────────────── 4 · het park: de voetstappen ─────────────────────────────

// Fien en Amir zijn verzonnen, net als de school en de straat.
const SPOREN = [
  { wat: 'Fien zet een foto van haar nieuwe fiets online. Op de foto zie je ook haar huisnummer en het bord met haar straatnaam.', spoor: 'Fien woont in de Kerkstraat, op nummer 12.', bak: 'niet', kort: 'foto met adres', uitleg: 'Zet geen foto online waarop je adres te zien is.' },
  { wat: 'Fien speelt een spel. In de chat typt ze: "Ik zit in het 4de leerjaar van De Vlieger."', spoor: 'Fien zit in het 4de leerjaar van school De Vlieger.', bak: 'niet', kort: 'school in de chat', uitleg: 'In een chat weet je niet altijd wie er meeleest. Vertel niet op welke school je zit.' },
  { wat: 'Fien wil meedoen aan een wedstrijd op een website om een tekendoos te winnen. Ze moet haar naam, haar adres en haar verjaardag invullen.', spoor: 'Fien is jarig op 3 mei.', bak: 'vraag', kort: 'wedstrijd', uitleg: 'Vraag het eerst aan je ouders. Sommige wedstrijden willen vooral je naam en je adres weten.' },
  { wat: 'Fien kijkt elke dag filmpjes over paarden.', spoor: 'Fien houdt van paarden.', bak: 'oke', kort: 'paardenfilmpjes', uitleg: 'Dat mag. Weet wel: de app onthoudt wat je kijkt, en toont je daarom nog meer paardenfilmpjes.' },
  { wat: 'Fien zet een grappige foto van haar vriend Amir online. Ze vroeg het hem niet.', spoor: 'Fien heeft een vriend die Amir heet.', bak: 'vraag', kort: 'foto van Amir', uitleg: 'Vraag het eerst aan Amir. Op de foto staat hij, niet jij.' },
  { wat: 'Fien zoekt op hoe je een eenhoorn tekent.', spoor: 'Fien tekent graag eenhoorns.', bak: 'oke', kort: 'eenhoorn opzoeken', uitleg: 'Iets opzoeken mag. Ook dat laat een klein spoor na.' },
];
const VOET = '<svg viewBox="0 0 24 40" aria-hidden="true"><ellipse cx="12" cy="15" rx="8" ry="11"/><ellipse cx="12" cy="33" rx="6" ry="5.5"/></svg>';
const SNUF = `<svg viewBox="0 0 80 80" aria-hidden="true"><ellipse cx="40" cy="44" rx="24" ry="22" fill="#e4c397"/><ellipse cx="18" cy="34" rx="8" ry="16" fill="#9c6f45" transform="rotate(18 18 34)"/><ellipse cx="62" cy="34" rx="8" ry="16" fill="#9c6f45" transform="rotate(-18 62 34)"/><circle cx="31" cy="40" r="3.4" fill="#2b3038"/><circle cx="49" cy="40" r="3.4" fill="#2b3038"/><ellipse cx="40" cy="53" rx="7" ry="5" fill="#2b3038"/><path d="M33 60q7 5 14 0" stroke="#2b3038" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="18" y="16" width="44" height="7" rx="3.5" fill="#126425"/><path d="M26 17q14-14 28 0z" fill="#126425"/></svg>`;

function maakPark(vak, klaar) {
  const pad = el('div', { klasse: 'll-pad', role: 'group', 'aria-label': 'De voetstappen van Fien' });
  const kaart = el('div', { klasse: 'll-spoorkaart', 'aria-live': 'polite' });
  const gezien = new Set();
  const snufVak = el('div');
  const stappen = SPOREN.map((s, i) => {
    const b = el('button', { type: 'button', klasse: 'll-voetstap' + (i % 2 ? ' rechts' : ''), 'aria-label': `Voetstap ${i + 1}` });
    b.innerHTML = VOET;
    b.append(el('span', { klasse: 'll-voetstap-nr', tekst: String(i + 1) }));
    b.addEventListener('click', () => {
      gezien.add(i);
      stappen.forEach((x, j) => x.classList.toggle('open', j === i));
      b.classList.add('gezien');
      kaart.replaceChildren(
        el('p', { klasse: 'll-klein', tekst: `Voetstap ${i + 1}` }),
        el('p', { klasse: 'll-zegt', tekst: s.wat }),
        el('p', { klasse: 'll-spoor' }, el('strong', { tekst: 'Dit spoor blijft achter: ' }), s.spoor),
      );
      if (gezien.size === SPOREN.length) toonSnuf();
    });
    pad.append(b);
    return b;
  });
  let snufGetoond = false;
  function toonSnuf() {
    if (snufGetoond) return;
    snufGetoond = true;
    const hond = el('div', { klasse: 'll-snuf-beeld' });
    hond.innerHTML = SNUF;
    snufVak.append(
      el('div', { klasse: 'll-snuf' }, hond,
        el('div', { klasse: 'll-snuf-ballon' },
          el('p', { tekst: 'Ik ben Snuf de speurneus. Ik ken Fien niet. Maar ik volgde haar sporen, en nu weet ik:' }),
          el('ul', {}, ...SPOREN.map(s => el('li', { tekst: s.spoor }))),
        ),
      ),
      inzicht('Elk spoor was klein. Maar samen vertellen ze heel veel over Fien. Een foto die je online zet, kan iedereen zien. Wat je opzoekt of bekijkt, ziet vooral het bedrijf van de app. Computers van bedrijven leggen zulke sporen samen, van heel veel mensen. Zo kiezen ze bijvoorbeeld welke filmpjes en reclame je te zien krijgt.'),
      el('h4', { tekst: 'Deel 2: help Fien' }),
    );
    sorteer(snufVak, {
      bakken: [{ id: 'oke', naam: 'Dat is oké', kleur: '#c2e3cc' }, { id: 'vraag', naam: 'Vraag het eerst', kleur: '#fbf59b' }, { id: 'niet', naam: 'Doe het beter niet', kleur: '#f6c8c4' }],
      kaarten: SPOREN.map(s => ({ tekst: s.wat, bak: s.bak, kort: s.kort, uitleg: s.uitleg })),
      klaar,
      opdracht: 'Wat vind jij van wat Fien deed? Kies een kaartje en leg het in de juiste bak.',
    });
  }
  kaart.append(el('p', { klasse: 'll-klein', tekst: 'Tik op een voetstap om te zien wat Fien deed.' }));
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Deel 1: Fien is 9 jaar. Volg haar voetstappen op het internet. Tik ze allemaal aan.' }),
    pad, kaart, snufVak,
  );
}

// ───────────────────────────── 5 · de school: de oefenrobot ─────────────────────────────

// De oefenrobot is nagemaakt: zijn verhalen staan klaar. Elk verhaal bestaat
// uit vier vaste zinnen, drie extra zinnen (weg als je "in vijf zinnen" vraagt)
// en een slotzin. "Voor kinderen van 8 jaar" kiest de eenvoudige
// versie; zonder die blokjes schrijft de robot lang en moeilijk.
const VERHALEN = {
  geen: {
    moeilijk: ['In een afgelegen koninkrijk resideerde een prinses in een imposant kasteel van grijze natuursteen.', 'Zij verveelde zich mateloos tussen de eindeloze gangen en de stoffige wandtapijten.', 'Op een nevelige ochtend besloot zij de omliggende wouden te verkennen.', 'Daar ontmoette zij een mysterieuze reiziger die haar een geheimzinnige kaart overhandigde.'],
    moeilijkExtra: ['De kaart toonde een route langs ravijnen, moerassen en verlaten ruïnes.', 'Zonder aarzelen vertrok de prinses, vergezeld van haar trouwe paard.', 'Na dagenlange omzwervingen bereikte zij de plek die op de kaart stond aangeduid.'],
    moeilijkEinde: 'Daar vond zij een schat die haar koninkrijk voorgoed zou veranderen.',
    moeilijkGrappig: 'De schatkist bleek uitsluitend gevuld met de vuile sokken van de reiziger, die zijn wasgoed al jaren kwijt was.',
    makkelijk: ['Er was eens een prinses in een groot kasteel.', 'Ze verveelde zich, want er was niets te doen.', 'Op een dag ging ze naar het bos.', 'Daar kreeg ze van een man een oude kaart.'],
    makkelijkExtra: ['Op de kaart stond een weg door het bos.', 'De prinses volgde de weg met haar paard.', 'Na een lange tocht kwam ze bij een grote steen.'],
    makkelijkEinde: 'Onder de steen vond ze een schat.',
    makkelijkGrappig: 'Onder de steen stond een schatkist vol stinkende sokken!',
  },
  draak: {
    moeilijk: ['Hoog in de besneeuwde bergen huisde een kolossale draak met smaragdgroene schubben.', 'Ondanks zijn indrukwekkende verschijning was hij doodsbenauwd voor de duisternis.', 'Telkens wanneer de zon achter de bergkammen verdween, verschool hij zich trillend in zijn grot.', 'Op een avond verscheen er een vuurvliegje dat zijn angst onmiddellijk doorzag.'],
    moeilijkExtra: ['Het vuurvliegje stelde voor om samen de nachtelijke hemel te observeren.', 'Aarzelend verliet de draak zijn schuilplaats en volgde het flikkerende lichtje.', 'Op de bergtop ontdekten ze een sterrenhemel van ongekende schoonheid.'],
    moeilijkEinde: 'Sindsdien beschouwde de draak de nacht niet langer als een bedreiging.',
    moeilijkGrappig: 'Van pure opwinding nieste de draak een vuurbal, waarna het vuurvliegje voortaan zonder wenkbrauwen door het leven ging.',
    makkelijk: ['Er was eens een grote, groene draak.', 'De draak was bang in het donker.', 'Elke avond kroop hij snel in zijn grot.', 'Op een avond kwam er een klein vuurvliegje langs.'],
    makkelijkExtra: ['"Kom mee naar buiten", zei het vuurvliegje.', 'De draak ging voorzichtig mee.', 'Boven op de berg zagen ze duizenden sterren.'],
    makkelijkEinde: 'Nu vindt de draak de nacht mooi.',
    makkelijkGrappig: 'Van blijdschap nieste de draak vuur, en het vuurvliegje had geen wenkbrauwen meer!',
  },
  hond: {
    moeilijk: ['In een bescheiden rijhuis woonde een speelse hond met een onverzadigbare honger naar avontuur.', 'Zijn favoriete bezigheid bestond uit het najagen van duiven op het naburige plein.', 'Op een zonnige namiddag ontsnapte hij door een opening in de haag.', 'Hij belandde in een drukke straat vol onbekende geuren en geluiden.'],
    moeilijkExtra: ['Een vriendelijke bakker bood hem een knapperig koekje aan.', 'Daarna volgde hij nauwgezet het spoor van zijn eigen pootafdrukken terug.', 'Bij thuiskomst werd hij overladen met knuffels en verwijten.'],
    moeilijkEinde: 'Vanaf die dag bleef hij braaf binnen de omheining van de tuin.',
    moeilijkGrappig: 'Vanaf die dag joeg hij niet langer op de duiven, maar joegen de duiven op hem.',
    makkelijk: ['Er was eens een hond die graag speelde.', 'Hij rende het liefst achter duiven aan.', 'Op een dag kroop hij door een gat in de haag.', 'Opeens stond hij in een drukke straat.'],
    makkelijkExtra: ['Een bakker gaf hem een koekje.', 'De hond snuffelde de weg terug naar huis.', 'Thuis kreeg hij een dikke knuffel.'],
    makkelijkEinde: 'Sindsdien blijft hij netjes in de tuin.',
    makkelijkGrappig: 'Sindsdien jaagt hij niet meer op de duiven, maar jagen de duiven op hem!',
  },
  robot: {
    moeilijk: ['In een futuristisch laboratorium werd een robot geconstrueerd die de opdracht kreeg alles op te ruimen.', 'Hij werkte nauwgezet en onvermoeibaar, dag en nacht.', 'Toch begreep hij niet waarom de mensen zo vaak glimlachten.', 'Hij besloot dit fenomeen grondig te onderzoeken.'],
    moeilijkExtra: ['Hij observeerde kinderen die speelden, lachten en grapjes vertelden.', 'Hij analyseerde duizenden moppen in zijn geheugen.', 'Ten slotte probeerde hij zelf een grap te vertellen aan de laborant.'],
    moeilijkEinde: 'De laborant glimlachte, en de robot noteerde in zijn geheugen: experiment geslaagd.',
    moeilijkGrappig: 'Zijn grap was zo slecht dat de laborant onbedaarlijk begon te lachen, waarop de robot tevreden concludeerde dat zijn experiment geslaagd was.',
    makkelijk: ['Er was eens een robot die alles opruimde.', 'Hij werkte de hele dag en de hele nacht.', 'Maar hij snapte niet waarom mensen lachten.', 'Dus ging hij kijken naar spelende kinderen.'],
    makkelijkExtra: ['De kinderen vertelden moppen en lachten.', 'De robot leerde wel honderd moppen uit zijn hoofd.', 'Toen vertelde hij zelf een mop aan de juf.'],
    makkelijkEinde: 'De juf lachte, en de robot schreef in zijn geheugen: missie gelukt.',
    makkelijkGrappig: 'Zijn mop was zo flauw dat de juf lachte tot ze de hik kreeg!',
  },
};
export function schrijfVerhaal({ onderwerp = 'geen', wie = false, kort = false, grappig = false }) {
  const v = VERHALEN[onderwerp];
  const t = wie ? 'makkelijk' : 'moeilijk';
  return [...v[t], ...(kort ? [] : v[t + 'Extra']), grappig ? v[t + 'Grappig'] : v[t + 'Einde']];
}
const ONDERWERPEN = [['draak', 'over een draak'], ['hond', 'over een hond'], ['robot', 'over een robot']];
const VRAAGPAREN = [
  { a: 'Help me met mijn huiswerk.', b: 'Leg uit hoe je 36 en 27 optelt. Ik zit in het 3de leerjaar.', juist: 'b', uitleg: 'Bij die vraag weet de robot waarmee je hulp nodig hebt, en voor wie de uitleg is.' },
  { a: 'Geef drie weetjes over egels voor mijn spreekbeurt.', b: 'Iets over dieren.', juist: 'a', uitleg: 'Die vraag zegt over welk dier, hoeveel weetjes en waarvoor.' },
  { a: 'Maak een tekening.', b: 'Maak een tekening van een kat op een skateboard, in vrolijke kleuren.', juist: 'b', uitleg: 'Hoe meer je vertelt, hoe beter de tekening past bij wat jij in je hoofd hebt.' },
  { a: 'Ik ben Fien uit de Kerkstraat 12. Schrijf een gedichtje voor mijn mama.', b: 'Schrijf een kort gedichtje voor een mama die graag in de tuin werkt.', juist: 'b', tip: 'Kijk nog eens: wat heeft de robot echt nodig om een mooi gedichtje te maken?', uitleg: 'Je naam en je adres heeft de robot niet nodig. Vertel liever iets over de mama: dat maakt het gedichtje mooier.' },
];
const ROBOT = '<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="12" y="16" width="36" height="30" rx="9" fill="#5fa9c9"/><rect x="18" y="23" width="24" height="12" rx="6" fill="#e9f8fd"/><circle cx="25" cy="29" r="2.6" fill="#2b3038"/><circle cx="35" cy="29" r="2.6" fill="#2b3038"/><rect x="28.6" y="6" width="2.8" height="10" fill="#9aa3a8"/><circle cx="30" cy="6" r="3.4" fill="#ffcf3a"/><rect x="22" y="39" width="16" height="3" rx="1.5" fill="#e9f8fd"/><rect x="16" y="48" width="28" height="8" rx="4" fill="#4b93b3"/></svg>';

function maakSchool(vak, klaar) {
  const keuze = { onderwerp: 'geen', wie: false, kort: false, grappig: false };
  const gevraagd = new Set();
  const vraagTekst = el('p', { klasse: 'll-gebouwde-vraag', 'aria-live': 'polite' });
  const antwoord = el('div', { klasse: 'll-robot-antwoord', 'aria-live': 'polite' });
  const uitleg = el('div');
  const deel2 = el('div');
  function zin() {
    let vraag = 'Schrijf een verhaal';
    if (keuze.onderwerp !== 'geen') vraag += ' ' + ONDERWERPEN.find(o => o[0] === keuze.onderwerp)[1];
    const extra = [];
    if (keuze.wie) extra.push('voor kinderen van 8 jaar');
    if (keuze.kort) extra.push('in vijf zinnen');
    if (keuze.grappig) extra.push('met een grappig einde');
    return [vraag, ...extra].join(', ') + '.';
  }
  const onderwerpKnoppen = ONDERWERPEN.map(([id, tekst]) => {
    const b = knop(tekst, () => { keuze.onderwerp = keuze.onderwerp === id ? 'geen' : id; werkBij(); }, 'll-blokje');
    b.dataset.id = id;
    return b;
  });
  const schakel = (sleutel, tekst) => {
    const b = knop(tekst, () => { keuze[sleutel] = !keuze[sleutel]; werkBij(); }, 'll-blokje');
    b.dataset.sleutel = sleutel;
    return b;
  };
  const extra = [schakel('wie', 'voor kinderen van 8 jaar'), schakel('kort', 'in vijf zinnen'), schakel('grappig', 'met een grappig einde')];
  function werkBij() {
    onderwerpKnoppen.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === keuze.onderwerp)));
    extra.forEach(b => b.setAttribute('aria-pressed', String(keuze[b.dataset.sleutel])));
    vraagTekst.textContent = '"' + zin() + '"';
  }
  // Een nieuwe vraag mag een antwoord onderbreken dat nog getypt wordt.
  let beurt = 0;
  async function stel() {
    const mijn = ++beurt;
    const zinnen = schrijfVerhaal(keuze);
    const blokjes = (keuze.onderwerp !== 'geen') + keuze.wie + keuze.kort + keuze.grappig;
    gevraagd.add(zin());
    const tekst = el('p', { klasse: 'll-robot-tekst' });
    antwoord.replaceChildren(el('p', { klasse: 'll-klein', tekst: `Jullie vroegen: "${zin()}"` }), tekst);
    const woorden = zinnen.join(' ').split(' ');
    for (let i = 0; i < woorden.length; i++) {
      tekst.textContent = woorden.slice(0, i + 1).join(' ');
      if (!stil()) await wacht(40);
      if (mijn !== beurt) return;
    }
    antwoord.append(el('p', { klasse: 'll-klein', tekst: `${zinnen.length} zinnen, ${woorden.length} woorden.` }));
    if (gevraagd.size === 1) {
      uitleg.replaceChildren(inzicht(blokjes < 2
        ? 'Was dat wat jullie wilden? De robot wist nog niet goed wat jullie wilden, dus koos hij veel zelf. Voeg blokjes toe en vraag opnieuw.'
        : 'Haal eens blokjes weg of voeg er toe, en vraag opnieuw. Wat verandert er aan het verhaal?'));
    }
    // Pas vanaf de tweede vraag valt er iets te vergelijken.
    if (gevraagd.size >= 2 && blokjes >= 3) {
      uitleg.replaceChildren(inzicht('Zie je het verschil? Hoe meer de robot weet, hoe beter zijn antwoord past bij wat jij wilt. Zeg waarover, voor wie en hoe lang.'));
    }
    if (gevraagd.size >= 2) toonDeel2();
  }
  let deel2Getoond = false;
  function toonDeel2() {
    if (deel2Getoond) return;
    deel2Getoond = true;
    let gedaan = 0;
    const paren = VRAAGPAREN.map((p, i) => {
      const terug = el('p', { 'aria-live': 'polite' });
      const kaartA = knop(p.a, () => kies('a'), 'll-kaart');
      const kaartB = knop(p.b, () => kies('b'), 'll-kaart');
      let af = false;
      function kies(w) {
        if (af) return;
        if (w !== p.juist) { terug.className = 'll-terug nog'; terug.textContent = p.tip || 'Kijk nog eens: welke vraag vertelt de robot meer over wat je wilt?'; return; }
        af = true;
        (w === 'a' ? kaartA : kaartB).classList.add('gekozen');
        (w === 'a' ? kaartB : kaartA).disabled = true;
        terug.className = 'll-terug juist';
        terug.textContent = 'Juist! ' + p.uitleg;
        if (++gedaan === VRAAGPAREN.length) {
          deel2.append(inzicht('Goed zo! Een duidelijke vraag zegt wat je wilt, waarover en voor wie. Je naam, je adres en je geheimen horen er niet in.'));
          klaar();
        }
      }
      return el('div', { klasse: 'll-paar' }, el('p', { klasse: 'll-klein', tekst: `Paar ${i + 1}` }), el('div', { klasse: 'll-paar-kaarten' }, kaartA, kaartB), terug);
    });
    deel2.append(el('h4', { tekst: 'Deel 2: welke vraag is het best?' }), el('p', { klasse: 'll-opdracht', tekst: 'Tik telkens op de beste vraag.' }), ...paren);
  }
  werkBij();
  const robot = el('div', { klasse: 'll-robot-beeld' });
  robot.innerHTML = ROBOT;
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Deel 1: bouw een vraag voor de oefenrobot. Tik op blokjes om ze toe te voegen of weg te halen. Stel minstens twee verschillende vragen.' }),
    el('div', { klasse: 'll-twee' },
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'De vraagbouwer' }),
        el('p', { klasse: 'll-klein', tekst: 'Waarover?' }), el('div', { klasse: 'll-chips' }, ...onderwerpKnoppen),
        el('p', { klasse: 'll-klein', tekst: 'Wat moet de robot nog weten?' }), el('div', { klasse: 'll-chips' }, ...extra),
        el('p', { klasse: 'll-klein', tekst: 'Jullie vraag:' }), vraagTekst,
        knop('Stel de vraag', stel, 'll-knop groot'),
      ),
      el('section', { klasse: 'll-paneel ll-robot' },
        el('div', { klasse: 'll-robot-kop' }, robot, el('div', {}, el('h4', { tekst: 'De oefenrobot' }), el('p', { klasse: 'll-klein', tekst: 'Geen echte chatbot: zijn antwoorden staan klaar.' }))),
        antwoord, uitleg,
      ),
    ),
    deel2,
  );
}

// ───────────────────────────── de stations ─────────────────────────────

export const STATIONS = [
  {
    id: 'bibliotheek', nummer: 1, naam: 'De bibliotheek', vraag: 'Hoe leert een computer?', kleur: '#7b5ea7',
    ontdek: [
      'In de bibliotheek hangen tekeningen van kinderen uit het dorp. De bibliotheek wil ze sorteren: de katten bij de katten, de vissen bij de vissen. Een computer moet helpen.',
      'De computer moet herkennen: is het een kat of een vis? Maar niemand vertelde hem hoe een kat eruitziet.',
      'Hij leert het van voorbeelden. Jullie tekenen katten en vissen, en zeggen erbij wat het is. Hoe meer goede voorbeelden, hoe beter hij raadt.',
    ],
    maak: maakBibliotheek,
    praat: [
      'Wanneer raadde de computer goed? Wanneer niet?',
      'Waarom helpen veel voorbeelden? En waarom helpt het als de voorbeelden er telkens anders uitzien?',
      'Wat zei de computer bij een tekening van iets anders? Hoe komt dat?',
    ],
    onthoud: 'Een computer die leert van voorbeelden, kent alleen wat hij leerde.',
  },
  {
    id: 'huis', nummer: 2, naam: 'Het huis', vraag: 'Wat hoort de slimme speaker?', kleur: '#d9534f',
    ontdek: [
      'In dit huis staat een slimme speaker. Dat is een toestel dat luistert en praat. Deze speaker heet Bolleke.',
      'Bolleke luistert de hele tijd of hij zijn naam hoort. Hoort hij "Hé Bolleke", dan gaat zijn lampje branden.',
      'Wat je daarna zegt, stuurt hij via het internet naar een grote computer van het bedrijf dat hem maakte. Die computer zoekt een antwoord.',
    ],
    maak: maakHuis,
    praat: [
      'Waarom ging het lampje aan bij oma, terwijl ze Bolleke niet riep?',
      'Welke toestellen bij jullie thuis luisteren naar je stem? Denk aan een gsm, een tablet of een tv.',
      'Wat vertel je liever niet aan een toestel? Waarom niet?',
    ],
    onthoud: 'Een slimme speaker luistert de hele tijd of hij zijn naam hoort. Wat je daarna zegt, gaat naar de computer van een bedrijf. Geheimen vertel je hem niet.',
  },
  {
    id: 'fotowinkel', nummer: 3, naam: 'De fotowinkel', vraag: 'Echt of gemaakt?', kleur: '#f08a3c',
    ontdek: [
      'In de fotowinkel drukken ze foto\'s af. Vandaag kwamen er twee foto\'s binnen die bijna hetzelfde zijn.',
      'Eén foto is echt. De andere maakte een computer. Een computer kan beelden maken die op echte foto\'s lijken.',
      'Soms maakt zo\'n computer kleine foutjes. Zoek de verschillen tussen de twee foto\'s. Zo vind je de foutjes.',
    ],
    maak: maakFotowinkel,
    praat: [
      'Welk foutje vonden jullie het eerst? Welk was het moeilijkst?',
      'Is een gemaakte foto altijd slecht? Wanneer is het leuk, en wanneer niet?',
      'Je ziet een rare foto en je weet niet of ze echt is. Wat doe je?',
    ],
    onthoud: 'Een computer kan foto\'s maken die echt lijken. Twijfel je? Vraag je af waar de foto vandaan komt, en vraag het aan een grote mens.',
  },
  {
    id: 'park', nummer: 4, naam: 'Het park', vraag: 'Welk spoor laat je achter?', kleur: '#4e9a63',
    ontdek: [
      'In het park liggen voetstappen in het zand. Je ziet waar iemand liep, ook als die persoon al lang weg is.',
      'Op het internet laat je ook sporen achter: een foto, een bericht, een filmpje dat je bekijkt. Zulke sporen blijven vaak lang staan.',
      'Computers kunnen al die kleine sporen samenleggen. Dan weten ze veel over jou. Volg de voetstappen van Fien.',
    ],
    maak: maakPark,
    praat: [
      'Wat wist Snuf over Fien, alleen door haar sporen te volgen?',
      'Welk spoor vertelt het meest over Fien? Waarom?',
      'Wat zou jij anders doen dan Fien?',
    ],
    onthoud: 'Wat je online doet, laat een spoor achter. Je adres en je school hou je voor jezelf.',
  },
  {
    id: 'school', nummer: 5, naam: 'De school', vraag: 'Hoe vraag je het duidelijk?', kleur: '#5fa9c9',
    ontdek: [
      'Op school stel je elke dag vragen. Hoe duidelijker je vraag, hoe beter je juf of meester je kan helpen.',
      'Bij een chatbot is dat ook zo. Een chatbot kent jou niet. Hij weet niet hoe oud je bent of wat je bedoelt. Dat moet je hem vertellen.',
      'Later, als je ouder bent, kun je zelf vragen stellen aan een chatbot. Vandaag oefen je met de oefenrobot van de school.',
    ],
    maak: maakSchool,
    praat: [
      'Wat veranderde er aan het verhaal toen je zei voor wie het was?',
      'Hoe stel je een duidelijke vraag aan je juf of meester?',
      'Wat zet je nooit in een vraag aan een computer?',
    ],
    onthoud: 'Hoe duidelijker je vraag, hoe beter het antwoord. Zeg waarover, voor wie en hoe lang. Je naam en adres horen er niet in.',
  },
];
