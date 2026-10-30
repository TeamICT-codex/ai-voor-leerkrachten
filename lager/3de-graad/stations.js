// De vijf stations van De stad van morgen: wat de kinderen ontdekken, wat ze
// doen en waarover de klas samen praat. De bouwstenen (el, knop, sorteer...)
// staan in ../activiteiten.js.

import { el, knop, inzicht, wacht, stil, sorteer } from '../activiteiten.js';

// ───────────────────────────── 1 · het lab: de woordvoorspeller ─────────────────────────────

const LAB_ZINNEN = [
  'De kat slaapt op de bank.',
  'De hond slaapt in de mand.',
  'De juf leest een boek.',
  'De meester leest de krant.',
  'Mijn broer speelt op de speelplaats.',
  'De kat speelt met een bal.',
  'Wij spelen voetbal op de speelplaats.',
  'De zon schijnt op de speelplaats.',
  'De hond eet een koek.',
  'Mijn zus eet een appel.',
  'De juf drinkt koffie.',
  'Wij lezen een boek in de klas.',
];
const EINDE = '.';
function woorden(zin) {
  return zin.toLowerCase().replace(/[^a-zà-ÿ\s'-]/g, ' ').split(/\s+/).filter(Boolean);
}
function telParen(zinnen) {
  const tel = new Map(), starts = new Map();
  for (const zin of zinnen) {
    const w = woorden(zin);
    if (!w.length) continue;
    starts.set(w[0], (starts.get(w[0]) || 0) + 1);
    for (let i = 0; i < w.length; i++) {
      const volgend = w[i + 1] ?? EINDE;
      if (!tel.has(w[i])) tel.set(w[i], new Map());
      const m = tel.get(w[i]);
      m.set(volgend, (m.get(volgend) || 0) + 1);
    }
  }
  return { tel, starts };
}
function kiesGewogen(m) {
  let som = 0;
  for (const n of m.values()) som += n;
  let x = Math.random() * som;
  for (const [w, n] of m) { x -= n; if (x <= 0) return w; }
  return [...m.keys()][0];
}

function maakLab(vak, klaar) {
  const zinnen = [...LAB_ZINNEN];
  let gemaakt = 0;
  const lijst = el('ol', { klasse: 'll-zinnen' });
  const invoer = el('input', { type: 'text', maxlength: '70', 'aria-label': 'Schrijf zelf een zin', placeholder: 'Bijvoorbeeld: De juf drinkt thee.', autocomplete: 'off', spellcheck: 'false' });
  const melding = el('p', { klasse: 'll-terug', 'aria-live': 'polite' });
  function toonZinnen() {
    lijst.replaceChildren(...zinnen.map(z => el('li', { tekst: z })));
  }
  function voegToe() {
    const zin = invoer.value.trim();
    if (woorden(zin).length < 3) { melding.className = 'll-terug nog'; melding.textContent = 'Schrijf een zin van minstens drie woorden.'; return; }
    // Een hoofdletter midden in de zin is vaak een naam. Namen horen hier niet.
    if (zin.split(/\s+/).slice(1).some(w => /^[A-ZÀ-Ý]/.test(w))) {
      melding.className = 'll-terug nog';
      melding.textContent = 'Staat er een naam in? Laat namen weg: schrijf liever "mijn vriend" of "de buurman".';
      return;
    }
    zinnen.push(/[.!?]$/.test(zin) ? zin : zin + '.');
    invoer.value = '';
    melding.className = 'll-terug juist';
    melding.textContent = 'Je zin staat erbij. De voorspeller telt hem nu mee.';
    toonZinnen();
    toonStarts();
  }
  invoer.addEventListener('keydown', e => { if (e.key === 'Enter') voegToe(); });

  const startRij = el('div', { klasse: 'll-chips', role: 'group', 'aria-label': 'Kies een eerste woord' });
  const uitkomst = el('p', { klasse: 'll-voorspelling', 'aria-live': 'polite' });
  const keuzes = el('div', { klasse: 'll-keuzes' });
  const uitleg = el('div');
  let bezig = false;
  function toonStarts() {
    const { starts } = telParen(zinnen);
    startRij.replaceChildren(...[...starts.keys()].map(w => knop(w[0].toUpperCase() + w.slice(1), () => voorspel(w), 'll-chip')));
  }
  async function voorspel(start) {
    if (bezig) return;
    bezig = true;
    const { tel } = telParen(zinnen);
    const zin = [start];
    uitkomst.textContent = start[0].toUpperCase() + start.slice(1);
    let huidig = start;
    for (let i = 0; i < 12; i++) {
      const m = tel.get(huidig);
      if (!m) break;
      // Toon welke woorden er na dit woord kwamen, en hoe vaak.
      const meest = Math.max(...m.values());
      const volgend = kiesGewogen(m);
      keuzes.replaceChildren(
        el('p', { klasse: 'll-klein', tekst: `Na "${huidig}" kwam in onze zinnen:` }),
        ...[...m.entries()].sort((a, b) => b[1] - a[1]).map(([w, n]) => {
          const balk = el('div', { klasse: 'll-balk' + (w === volgend ? ' gekozen' : '') },
            el('span', { klasse: 'll-balk-woord', tekst: w === EINDE ? 'einde van de zin' : w }),
            el('span', { klasse: 'll-balk-vulling' }),
            el('span', { klasse: 'll-balk-getal', tekst: `${n}×` }));
          balk.style.setProperty('--deel', (n / meest).toFixed(3));
          return balk;
        }),
      );
      await wacht(stil() ? 0 : 900);
      if (volgend === EINDE) break;
      zin.push(volgend);
      huidig = volgend;
      uitkomst.textContent = zin.join(' ').replace(/^./, c => c.toUpperCase());
    }
    uitkomst.textContent = zin.join(' ').replace(/^./, c => c.toUpperCase()) + '.';
    bezig = false;
    gemaakt++;
    if (gemaakt === 1) {
      uitleg.replaceChildren(inzicht('De voorspeller koos telkens een woord dat in onze zinnen na het vorige woord kwam. Of de zin waar is, weet hij niet. Een chatbot werkt ook zo, maar met miljoenen teksten.'));
    }
    if (gemaakt === 2) klaar();
  }

  toonZinnen();
  toonStarts();
  vak.append(
    el('div', { klasse: 'll-twee' },
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'Onze zinnen' }),
        el('p', { klasse: 'll-klein', tekst: 'De voorspeller leert alleen van deze zinnen.' }),
        lijst,
        el('div', { klasse: 'll-invoer' }, invoer, knop('Voeg toe', voegToe)),
        el('p', { klasse: 'll-klein', tekst: 'Schrijf geen namen of iets over jezelf. Er wordt niets bewaard.' }),
        melding,
      ),
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'De voorspeller' }),
        el('p', { klasse: 'll-klein', tekst: 'Kies een eerste woord. De voorspeller maakt de zin af, woord per woord. Doe het minstens twee keer.' }),
        startRij, uitkomst, keuzes, uitleg,
      ),
    ),
  );
}

// ───────────────────────────── 2 · de fabriek: de sorteermachine ─────────────────────────────

const KLEUREN = { rood: '#d9483b', groen: '#7cbf3a', geel: '#f2c230' };
function fruitSvg(f) {
  const k = KLEUREN[f.kleur];
  const vorm = {
    rond: `<circle cx="32" cy="36" r="20" fill="${k}"/><path d="M32 17c0-5 2-8 6-9" stroke="#6b4428" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 15c5-6 12-5 13-2-4 4-9 4-13 2z" fill="#4e9a63"/><circle cx="25" cy="30" r="4" fill="#fff" opacity=".35"/>`,
    peer: `<circle cx="32" cy="42" r="16" fill="${k}"/><circle cx="32" cy="24" r="10" fill="${k}"/><path d="M32 14c0-4 1-6 4-7" stroke="#6b4428" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    lang: `<path d="M12 22c8 22 32 30 42 16 2-3-1-5-3-3-10 9-26 3-33-14-1-3-7-3-6 1z" fill="${k}"/><path d="M12 22l-3-4" stroke="#6b4428" stroke-width="3" stroke-linecap="round"/>`,
    ovaal: `<ellipse cx="32" cy="34" rx="22" ry="15" fill="${k}"/><circle cx="54" cy="34" r="3" fill="${k}"/><circle cx="10" cy="34" r="3" fill="${k}"/>`,
  }[f.vorm];
  return `<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">${vorm}</svg>`;
}
const FRUIT = {
  rodeAppel: { naam: 'rode appel', kleur: 'rood', vorm: 'rond', appel: true },
  groeneAppel: { naam: 'groene appel', kleur: 'groen', vorm: 'rond', appel: true },
  geleAppel: { naam: 'gele appel', kleur: 'geel', vorm: 'rond', appel: true },
  banaan: { naam: 'banaan', kleur: 'geel', vorm: 'lang', appel: false },
  peer: { naam: 'groene peer', kleur: 'groen', vorm: 'peer', appel: false },
  citroen: { naam: 'citroen', kleur: 'geel', vorm: 'ovaal', appel: false },
};
// De machine kijkt naar kleur en vorm, en zoekt het voorbeeld dat er het meest
// op lijkt. Ze let net iets meer op kleur dan op vorm: daardoor gaat het mis
// zolang ze alleen rode appels zag.
function afstand(a, b) {
  return (a.kleur === b.kleur ? 0 : 1.2) + (a.vorm === b.vorm ? 0 : 1);
}
function machineZegt(voorbeelden, f) {
  let beste = null, d = Infinity;
  for (const v of voorbeelden) { const x = afstand(v, f); if (x < d) { d = x; beste = v; } }
  return beste.appel;
}

function maakFabriek(vak, klaar) {
  const voorbeelden = [FRUIT.rodeAppel, FRUIT.rodeAppel, FRUIT.rodeAppel, FRUIT.banaan, FRUIT.peer, FRUIT.citroen];
  const band = [FRUIT.rodeAppel, FRUIT.groeneAppel, FRUIT.banaan, FRUIT.geleAppel, FRUIT.peer];
  let index = 0;
  const appels = el('div', { klasse: 'll-fruitrij' });
  const geen = el('div', { klasse: 'll-fruitrij' });
  function toonVoorbeelden() {
    appels.replaceChildren(...voorbeelden.filter(v => v.appel).map(v => fruitTegel(v)));
    geen.replaceChildren(...voorbeelden.filter(v => !v.appel).map(v => fruitTegel(v)));
  }
  function fruitTegel(f) {
    const t = el('span', { klasse: 'll-fruit', title: f.naam });
    t.innerHTML = fruitSvg(f);
    t.append(el('span', { klasse: 'll-weg', tekst: f.naam }));
    return t;
  }
  const testVak = el('div', { klasse: 'll-test' });
  const terug = el('div', { 'aria-live': 'polite' });
  function toonTest() {
    terug.replaceChildren();
    if (index >= band.length) {
      testVak.replaceChildren(inzicht('Alles goed gesorteerd! De machine leerde alleen van rode appels. Groene en gele appels had ze nog nooit gezien, dus ze zette ze bij het verkeerde fruit. Pas toen jullie haar betere voorbeelden gaven, werkte ze goed.'));
      klaar();
      return;
    }
    const f = band[index];
    const tegel = fruitTegel(f);
    tegel.classList.add('groot');
    testVak.replaceChildren(
      el('p', { klasse: 'll-klein', tekst: `Fruit ${index + 1} van ${band.length} op de lopende band:` }),
      tegel,
      el('p', { klasse: 'll-fruitnaam', tekst: 'Dit is een ' + f.naam + '.' }),
      knop('Wat zegt de machine?', () => vraag(f)),
    );
  }
  function vraag(f) {
    const zegt = machineZegt(voorbeelden, f);
    const juist = zegt === f.appel;
    terug.replaceChildren(
      el('p', { klasse: 'll-machine', tekst: 'De machine zegt: ' + (zegt ? '"Dit is een appel."' : '"Dit is geen appel."') }),
      el('p', { klasse: 'll-opdracht', tekst: 'Klopt dat?' }),
      el('div', { klasse: 'll-chips' },
        knop('Ja, dat klopt', () => oordeel(f, juist, true), 'll-chip'),
        knop('Nee, dat is fout', () => oordeel(f, juist, false), 'll-chip'),
      ),
    );
  }
  function oordeel(f, juist, klasZegtJuist) {
    if (klasZegtJuist !== juist) {
      terug.append(el('p', { klasse: 'll-terug nog', tekst: 'Kijk nog eens goed naar het fruit en naar wat de machine zei.' }));
      return;
    }
    if (juist) {
      terug.replaceChildren(el('p', { klasse: 'll-terug juist', tekst: 'Juist, de machine had het goed.' }), knop('Volgend fruit', () => { index++; toonTest(); }));
      return;
    }
    terug.replaceChildren(
      el('p', { klasse: 'll-terug nog', tekst: 'De machine vergiste zich. Ze zag nog nooit een ' + f.naam + '.' }),
      knop('Leer de machine bij: dit is een appel', () => {
        voorbeelden.push(f);
        toonVoorbeelden();
        terug.replaceChildren(el('p', { klasse: 'll-terug juist', tekst: 'De ' + f.naam + ' staat nu bij de voorbeelden van appels. Test de machine opnieuw.' }), knop('Test opnieuw', () => vraag(f)));
      }),
    );
  }
  toonVoorbeelden();
  toonTest();
  vak.append(
    el('div', { klasse: 'll-twee' },
      el('section', { klasse: 'll-paneel' },
        el('h4', { tekst: 'Wat de machine leerde' }),
        el('p', { klasse: 'll-klein', tekst: 'Dit zijn appels:' }), appels,
        el('p', { klasse: 'll-klein', tekst: 'Dit zijn geen appels:' }), geen,
      ),
      el('section', { klasse: 'll-paneel' }, el('h4', { tekst: 'Test de machine' }), testVak, terug),
    ),
  );
}

// ───────────────────────────── 3 · de krant: overtuigend maar fout ─────────────────────────────

// De vier fouten zijn bewust. De rest klopt, en de bronkaart ook: nagekeken
// tegen wat in het lager over het zonnestelsel geleerd wordt.
const ARTIKEL = [
  { zin: 'De zon is een ster: een enorme bol van heet gas.', fout: false },
  { zin: 'Venus staat het dichtst bij de zon.', fout: true, juist: 'Mercurius staat het dichtst bij de zon.' },
  { zin: 'De aarde draait in ongeveer een jaar één keer rond de zon.', fout: false },
  { zin: 'Rond de zon draaien negen planeten.', fout: true, juist: 'Er zijn acht planeten. Pluto heet sinds 2006 een dwergplaneet.' },
  { zin: 'Mars wordt de rode planeet genoemd.', fout: false },
  { zin: 'Mars is de grootste planeet van ons zonnestelsel.', fout: true, juist: 'Jupiter is de grootste planeet.' },
  { zin: 'Saturnus is bekend om zijn mooie ringen.', fout: false },
  { zin: 'De maan geeft \'s nachts haar eigen licht.', fout: true, juist: 'De maan geeft zelf geen licht. Ze weerkaatst het licht van de zon.' },
];
const BRON = [
  'De acht planeten, van dicht bij de zon naar ver weg: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus en Neptunus.',
  'De grootste planeet is Jupiter.',
  'Pluto heet sinds 2006 een dwergplaneet.',
  'De maan geeft zelf geen licht: ze weerkaatst het licht van de zon.',
  'De aarde draait in ongeveer 365 dagen rond de zon.',
];

function maakKrant(vak, klaar) {
  const gekozen = new Set();
  const tekst = el('div', { klasse: 'll-artikel' });
  const zinnen = ARTIKEL.map((z, i) => {
    const b = el('button', { type: 'button', klasse: 'll-zin', 'aria-pressed': 'false', tekst: z.zin });
    b.addEventListener('click', () => {
      if (tekst.classList.contains('nagekeken')) return;
      gekozen.has(i) ? gekozen.delete(i) : gekozen.add(i);
      b.setAttribute('aria-pressed', String(gekozen.has(i)));
    });
    return b;
  });
  tekst.append(el('p', { klasse: 'll-artikel-kop', tekst: 'Ons zonnestelsel' }), el('p', { klasse: 'll-klein', tekst: 'Geschreven door een chatbot' }), ...zinnen);
  const bronVak = el('div');
  const terug = el('div', { 'aria-live': 'polite' });
  const kijkNa = knop('Kijk het na met de bron', () => {
    tekst.classList.add('nagekeken');
    kijkNa.disabled = true;
    bronVak.replaceChildren(
      el('section', { klasse: 'll-paneel ll-bron' }, el('h4', { tekst: 'De bron: onze planetenkaart' }), el('ul', {}, ...BRON.map(b => el('li', { tekst: b })))),
    );
    let gevonden = 0;
    ARTIKEL.forEach((z, i) => {
      const b = zinnen[i];
      b.disabled = true;
      if (z.fout) {
        if (gekozen.has(i)) gevonden++;
        b.classList.add('is-fout');
        b.append(el('span', { klasse: 'll-verbeter', tekst: z.juist }));
      } else if (gekozen.has(i)) {
        b.classList.add('was-juist');
        b.append(el('span', { klasse: 'll-verbeter', tekst: 'Deze zin klopt wel.' }));
      }
    });
    terug.replaceChildren(
      el('p', { klasse: 'll-terug ' + (gevonden === 4 ? 'juist' : 'nog'), tekst: `Jullie vonden ${gevonden} van de 4 fouten.` }),
      inzicht('Het stukje klonk overal even zeker, ook waar het fout was. Daarom kijk je na in een andere bron: een boek, een goede website, of je vraagt het aan je juf of meester.'),
    );
    klaar();
  });
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Tik op de zinnen die volgens jullie fout zijn. Kijk daarna na met de bron.' }),
    el('div', { klasse: 'll-twee' }, el('section', { klasse: 'll-paneel' }, tekst, kijkNa), el('div', {}, bronVak, terug)),
  );
}

// ───────────────────────────── 4 · het museum: wie maakte dit? ─────────────────────────────

// De speurneusplaat tekenen we zelf: zo zijn er geen rechten van anderen mee
// gemoeid. Vijf foutjes, zoals je die vroeger vaak zag in gemaakte beelden.
const FOUTJES = [
  { id: 'vingers', x: 71, y: 43, r: 6, tekst: 'De hand heeft zes vingers.' },
  { id: 'bord', x: 21, y: 29, r: 9, tekst: 'De letters op het bord vormen geen echt woord.' },
  { id: 'schaduw', x: 71, y: 66, r: 8, tekst: 'De schaduw van de boom valt naar de zon toe. De schaduw van het kind valt wel goed: weg van de zon.' },
  { id: 'poten', x: 36, y: 76, r: 8, tekst: 'De hond heeft vijf poten.' },
  { id: 'paal', x: 21, y: 55, r: 6, tekst: 'De paal van het bord hangt in de lucht: hij raakt de grond niet.' },
];
function parkSvg() {
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Een tekening van een park met een kind, een hond, een boom en een bord">
  <rect width="100" height="62" fill="#bfe3ed"/><rect y="60" width="100" height="40" fill="#9fd39b"/>
  <circle cx="14" cy="12" r="7" fill="#ffd84d"/>
  <g fill="#fff"><ellipse cx="60" cy="11" rx="10" ry="4"/><ellipse cx="55" cy="9" rx="5" ry="4"/></g>
  <rect x="12" y="24" width="18" height="10" rx="1.5" fill="#fff" stroke="#126425" stroke-width="1"/>
  <text x="21" y="31.2" font-size="5.2" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#126425">PRAK</text>
  <rect x="20.4" y="34" width="1.4" height="17" fill="#9c6f45"/>
  <rect x="78" y="40" width="4" height="24" fill="#9c6f45"/><circle cx="80" cy="36" r="12" fill="#4e9a63"/><circle cx="86" cy="42" r="7" fill="#86c494"/>
  <ellipse cx="71" cy="65" rx="9" ry="2.4" fill="#000" opacity=".18"/>
  <ellipse cx="65" cy="81" rx="7" ry="1.6" fill="#000" opacity=".16"/>
  <rect x="53" y="50" width="10" height="16" rx="4" fill="#fcc89b"/><circle cx="58" cy="45" r="5" fill="#c68642"/>
  <rect x="55" y="66" width="2.5" height="14" rx="1" fill="#3d4656"/><rect x="59" y="66" width="2.5" height="14" rx="1" fill="#3d4656"/>
  <rect x="62" y="48" width="6" height="2.2" rx="1" fill="#c68642" transform="rotate(-30 62 48)"/>
  <g fill="#c68642"><rect x="67.3" y="40.5" width="1" height="4" rx=".5"/><rect x="68.6" y="40" width="1" height="4.4" rx=".5"/><rect x="69.9" y="40.2" width="1" height="4.2" rx=".5"/><rect x="71.2" y="40.6" width="1" height="3.8" rx=".5"/><rect x="72.4" y="41.2" width="1" height="3.4" rx=".5"/><rect x="73.4" y="42.4" width="1" height="2.8" rx=".5"/></g>
  <g fill="#9c6f45"><ellipse cx="36" cy="70" rx="9" ry="4.5"/><circle cx="45" cy="66" r="3.6"/>
  <rect x="29" y="72" width="1.6" height="7" rx=".8"/><rect x="32.5" y="72" width="1.6" height="7" rx=".8"/><rect x="36" y="72.5" width="1.6" height="7" rx=".8"/><rect x="39.5" y="72" width="1.6" height="7" rx=".8"/><rect x="42.6" y="71.5" width="1.6" height="7" rx=".8"/></g>
  <path d="M27 68c-3-2-4-5-3-6" stroke="#9c6f45" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`;
}
const MAKERKAARTEN = [
  { tekst: 'Je zet een tekening die je zelf maakte in je spreekbeurt.', bak: 'mag', kort: 'eigen tekening', uitleg: 'Wat je zelf maakte, mag je gebruiken.' },
  { tekst: 'Je zet een foto van een klasgenoot in je spreekbeurt, zonder het te vragen.', bak: 'vraag', kort: 'foto klasgenoot', uitleg: 'Vraag het eerst aan je klasgenoot. Op een foto staat iemand anders.' },
  { tekst: 'Je laat een computer een tekening maken en zegt dat jij ze tekende.', bak: 'niet', kort: 'zeggen dat jij het maakte', uitleg: 'Dat is niet eerlijk. Zeg altijd wie of wat iets maakte.' },
  { tekst: 'Je gebruikt een afbeelding die een computer maakte, en je zet erbij dat een computer ze maakte.', bak: 'vraag', kort: 'afbeelding van een computer', uitleg: 'Dat is eerlijk. Maar spreek eerst met je juf of meester af of het mag voor deze opdracht.' },
  { tekst: 'Je neemt een foto van het internet en je zegt niet waar je ze vond.', bak: 'niet', kort: 'foto zonder bron', uitleg: 'Zet er altijd bij waar je ze vond. Zo weet iedereen wie de maker is.' },
];

function maakMuseum(vak, klaar) {
  const gevonden = new Set();
  const plaat = el('div', { klasse: 'll-plaat' });
  plaat.innerHTML = parkSvg();
  const lijst = el('ul', { klasse: 'll-gevonden', 'aria-live': 'polite' });
  const teller = el('p', { klasse: 'll-klein', tekst: 'Gevonden: 0 van 5' });
  for (const f of FOUTJES) {
    const zone = el('button', { type: 'button', klasse: 'll-zone', 'aria-label': 'Hier zit misschien een foutje' });
    Object.assign(zone.style, { left: `${f.x - f.r}%`, top: `${f.y - f.r}%`, width: `${f.r * 2}%`, height: `${f.r * 2}%` });
    zone.addEventListener('click', () => {
      if (gevonden.has(f.id)) return;
      gevonden.add(f.id);
      zone.classList.add('gevonden');
      lijst.append(el('li', { tekst: f.tekst }));
      teller.textContent = `Gevonden: ${gevonden.size} van 5`;
      if (gevonden.size === 3) toonDeel2();
    });
    plaat.append(zone);
  }
  const deel2 = el('div');
  let deel2Getoond = false;
  function toonDeel2() {
    if (deel2Getoond) return;
    deel2Getoond = true;
    deel2.append(
      inzicht('Goed gespeurd! Let op: zulke foutjes zie je steeds minder vaak. Veel gemaakte beelden zien er vandaag helemaal echt uit. Vraag je daarom altijd af wie het beeld maakte en waar het vandaan komt.'),
      el('h4', { tekst: 'Deel 2: mag ik dit gebruiken?' }),
    );
    sorteer(deel2, {
      bakken: [{ id: 'mag', naam: 'Mag', kleur: '#c2e3cc' }, { id: 'vraag', naam: 'Vraag het eerst', kleur: '#fbf59b' }, { id: 'niet', naam: 'Mag niet', kleur: '#f6c8c4' }],
      kaarten: MAKERKAARTEN,
      klaar,
    });
  }
  const toonAlles = knop('Toon alle foutjes', () => {
    plaat.querySelectorAll('.ll-zone').forEach(z => z.click());
  }, 'll-knop zacht');
  vak.append(
    el('p', { klasse: 'll-opdracht', tekst: 'Deel 1: dit beeld maakte een computer. Zoek de vijf foutjes en tik erop.' }),
    el('div', { klasse: 'll-twee' }, plaat, el('section', { klasse: 'll-paneel' }, teller, lijst, toonAlles)),
    deel2,
  );
}

// ───────────────────────────── 5 · de haven: mag dit voor mijn taak? ─────────────────────────────

const TAAKKAARTEN = [
  { tekst: 'Noah laat een chatbot zijn hele opstel schrijven en geeft het af als zijn eigen werk.', bak: 'werk', kort: 'opstel laten schrijven', uitleg: 'Zo leert Noah zelf niets bij, en het is niet eerlijk tegenover de klas.' },
  { tekst: 'Lina snapt breuken niet. Thuis vraagt ze samen met haar mama aan een chatbot om het nog eens anders uit te leggen.', bak: 'leren', kort: 'uitleg over breuken', uitleg: 'Een andere uitleg kan helpen. Lina oefent daarna zelf.' },
  { tekst: 'Sem laat een computer zijn tekst nakijken op spelling. Daarna verbetert hij zelf de fouten.', bak: 'leren', kort: 'spelling nakijken', uitleg: 'Sem ziet zijn fouten en verbetert ze zelf. Zo leert hij bij.' },
  { tekst: 'Mila vraagt een chatbot om de antwoorden van haar huiswerk wiskunde en schrijft ze over.', bak: 'werk', kort: 'antwoorden overschrijven', uitleg: 'Mila oefent zo niet zelf. Op de toets weet ze het dan niet.' },
  { tekst: 'Daan wil voor zijn spreekbeurt een afbeelding gebruiken die een computer maakte.', bak: 'vraag', kort: 'afbeelding voor spreekbeurt', uitleg: 'Spreek het eerst af met je juf of meester, en zet erbij dat een computer ze maakte.' },
  { tekst: 'Yara is 11 jaar en wil zelf een account maken bij een chatbot.', bak: 'vraag', kort: 'eigen account', uitleg: 'De meeste chatbots zijn pas vanaf 13 jaar, en tot 18 jaar met toestemming van je ouders. Sommige pas vanaf 18. Bespreek het eerst met je ouders.' },
  { tekst: 'Bram oefent de hoofdsteden van Europa met een oefenquiz op de computer, die zijn juf klaarzette.', bak: 'leren', kort: 'oefenquiz', uitleg: 'Oefenen helpt je onthouden. Bram doet het denkwerk zelf.' },
];

function maakHaven(vak, klaar) {
  sorteer(vak, {
    bakken: [{ id: 'leren', naam: 'Helpt je leren', kleur: '#c2e3cc' }, { id: 'werk', naam: 'Doet het werk in jouw plaats', kleur: '#f6c8c4' }, { id: 'vraag', naam: 'Vraag het eerst aan je juf, meester of ouders', kleur: '#fbf59b' }],
    kaarten: TAAKKAARTEN,
    klaar,
    slot: 'Mooi gesorteerd! In het secundair kom je AI nog vaker tegen. In het eerste jaar leer je er meer over, bijvoorbeeld met AI-wijs Start.',
  });
}

// ───────────────────────────── de stations ─────────────────────────────

export const STATIONS = [
  {
    id: 'lab', nummer: 1, naam: 'Het lab', vraag: 'Hoe maakt een chatbot zinnen?', kleur: '#5fa9c9',
    ontdek: [
      'Een chatbot is een computerprogramma waarmee je kunt praten. Je typt een vraag, en je krijgt een antwoord dat klinkt alsof een mens het schreef.',
      'Maar een chatbot denkt niet na zoals jij. Hij las heel veel teksten en onthield welke woorden vaak na elkaar komen.',
      'Bij elk nieuw woord kiest hij een woord dat goed past. Zo maakt hij zin na zin. In het lab probeer je dat zelf, met een heel kleine voorspeller.',
    ],
    maak: maakLab,
    praat: [
      'Klonk een zin van de voorspeller echt, terwijl hij niet klopte? Hoe kan dat?',
      'Wat zou er gebeuren als de voorspeller alleen zinnen over voetbal kreeg?',
      'Wat is het verschil tussen iets weten en iets voorspellen?',
    ],
    onthoud: 'Een chatbot voorspelt woorden. Hij weet niet zelf of iets waar is.',
  },
  {
    id: 'fabriek', nummer: 2, naam: 'De fabriek', vraag: 'Is het eerlijk?', kleur: '#f08a3c',
    ontdek: [
      'In deze fabriek staat een sorteermachine. Ze moet appels herkennen tussen ander fruit.',
      'Niemand vertelde de machine hoe een appel eruitziet. Ze leerde het uit voorbeelden: fruit waarvan iemand zei "dit is een appel" of "dit is geen appel".',
      'Zo leren veel computers: uit voorbeelden. Maar wat als die voorbeelden niet goed gekozen zijn? Test de machine en zoek het uit.',
    ],
    maak: maakFabriek,
    praat: [
      'Waarom herkende de machine de groene appel eerst niet?',
      'Stel: een computer moet gezichten herkennen, maar kreeg bijna alleen foto\'s van volwassenen. Wat kan er misgaan bij kinderen?',
      'Wie kiest de voorbeelden voor een computer? Waarom is dat belangrijk?',
    ],
    onthoud: 'Een computer leert van voorbeelden. Ontbreken er voorbeelden, dan maakt hij fouten.',
  },
  {
    id: 'krant', nummer: 3, naam: 'De krant', vraag: 'Overtuigend maar fout', kleur: '#d9534f',
    ontdek: [
      'Op de redactie schrijven ze stukjes voor de krant. Vandaag hielp een chatbot mee: hij schreef een stukje over het zonnestelsel.',
      'Het stukje klinkt zeker en goed. Maar een chatbot kan dingen verzinnen of door elkaar halen, en hij zegt dat er niet bij.',
      'Jullie zijn de eindredactie. Zoek de fouten, en kijk ze na met de bron.',
    ],
    maak: maakKrant,
    praat: [
      'Waarom geloof je iets sneller als het heel zeker klinkt?',
      'Welke bronnen vertrouw jij? Waarom die?',
      'Wat doe je als twee bronnen iets anders zeggen?',
    ],
    onthoud: 'Een chatbot kan heel zeker klinken en toch fout zijn. Kijk na in een andere bron.',
  },
  {
    id: 'museum', nummer: 4, naam: 'Het museum', vraag: 'Wie maakte dit?', kleur: '#126425',
    ontdek: [
      'In het museum hangen tekeningen, schilderijen en foto\'s. Bij elk werk staat wie het maakte.',
      'Vandaag hangt er ook een beeld dat een computer maakte. Zo\'n beeld lijkt soms heel echt. Soms zie je kleine foutjes, maar steeds vaker zie je niets.',
      'Speur eerst naar de foutjes. Daarna zoek je uit: mag je zomaar het werk van iemand anders gebruiken?',
    ],
    maak: maakMuseum,
    praat: [
      'Welk foutje vonden jullie het eerst? Welk het laatst?',
      'Als je geen foutjes ziet, hoe kun je dan toch nagaan waar een beeld vandaan komt?',
      'Waarom is het belangrijk om te zeggen wie iets maakte?',
    ],
    onthoud: 'Bij elk beeld hoort een maker. Zeg eerlijk wie het maakte, ook als het een computer was.',
  },
  {
    id: 'haven', nummer: 5, naam: 'De haven', vraag: 'Mag dit voor mijn taak?', kleur: '#124a5e',
    ontdek: [
      'In de haven vertrekken de schepen naar verre plaatsen. Ook jij vertrekt straks: naar het secundair.',
      'Daar kom je AI vaker tegen, ook bij taken en huiswerk. Soms helpt AI je om beter te leren. Soms doet AI het werk in jouw plaats, en dan leer je zelf niets.',
      'De meeste chatbots mag je pas gebruiken vanaf 13 jaar, en tot je 18 bent met toestemming van je ouders. Sommige pas vanaf 18. Daarom oefen je nu samen met je juf of meester.',
    ],
    maak: maakHaven,
    praat: [
      'Wanneer helpt AI je echt om iets te leren?',
      'Waarom is het niet eerlijk om een opstel van een chatbot af te geven als je eigen werk?',
      'Welke afspraak over AI wil jij maken met je klas?',
    ],
    onthoud: 'AI mag je helpen leren. Het werk zelf doe je zelf. Twijfel je? Vraag het eerst.',
  },
];
