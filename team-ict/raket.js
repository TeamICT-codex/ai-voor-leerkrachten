// Het tafereel van Team ICT: een raket in doorsnede op een lanceerplatform.
// Onderaan zit de motor: de technische basis die je anders nooit ziet. Daarboven
// liggen de verdiepingen voor de kleuters, het lager, het secundair en het
// beleid, en in de neus zit de lading waarvoor de raket bestaat: kwaliteitsvol
// onderwijs. Door de ruggengraat stroomt energie van de motor naar elke
// verdieping. Naast de raket staat de toren (vorming en ondersteuning) met de
// helpdesk aan de voet, en verderop de vluchtleiding van Team ICT. Op elke
// verdieping en op het platform werkt de grondploeg mee: de lokale ICT-mensen,
// in het oranje. Voorwerpen met een bolletje openen een kaartje (teksten in
// plekken.js). De motor van het tafereel zit in gedeeld/diorama-kern.js.
import {
  T, K, HUID, HAAR, klem, uitTerug, toeval, blok, cilinder, bol, kruin, groepje, levend,
  figuur, stoel, plant, laptop, boom, maakPodium, F, rond, vinkje, paneel, mat, zet,
} from '../gedeeld/diorama-kern.js';

// Maten van de raket. De raket staat met haar opening naar de camera: zo kijk
// je in elke verdieping, zoals in een poppenhuis.
const R = 2.0, VH = 1.9, PLAAT = 0.1, MUUR = 0.1, BASIS = 1.3, RZ = -0.9;
const RW = R - MUUR;           // de binnenkant van de wand
const OPEN = 1.05;             // de halve breedte van de opening, in radialen
// De opening kijkt naar de camera zoals die in een kamer kijkt (0,12 in de
// motor); in het overzicht kijkt ze er schuin op (0,31), zoals naar de school.
const DRAAI = 0.12, BINNEN_OPZIJ = 0.12;
const NIVEAUS = ['motor', 'kleuter', 'lager', 'secundair', 'beleid'];
const TOP = BASIS + NIVEAUS.length * VH;
const NEUS = 2.75;
// Hoe hoog een bord tegen de achterwand mag reiken. De kamers zijn rond en diep:
// wat hoger hangt, verdwijnt achter de voorrand van het plafond zodra de camera
// een beetje van boven in de kamer kijkt.
const BORD_TOP = 1.18;
const TOREN = { x: -3.55, z: RZ };
const LEIDING = { x: 4.6, z: 0.6, b: 2.5, d: 1.6, h: 1.2, draai: -0.25 };
const HELPDESK = { x: -3.2, z: 0.75 };
const OPLICHT = 0xfff1d6;
// 's Avonds: hoe sterk de lamp in een kamer brandt, en de kleur van dat licht.
const LAMP = 5.5, LAMPKLEUR = 0xffd29a;
// De grondploeg draagt oranje; Team ICT de kleur van elk teamlid.
const ORANJE = K.oranje;
const TEAM = [K.zee, K.perzik, K.geel, K.groen];

// De zes diensten in de motor, met hun code en een eigen kleur.
const DIENSTEN = [
  { id: 'net', code: 'NET-01', naam: 'Netwerk', kleur: '#5fa9c9' },
  { id: 'id', code: 'ID-02', naam: 'Aanmelding', kleur: '#fbf59b' },
  { id: 'tst', code: 'TST-03', naam: 'Toestellen', kleur: '#fcc89b' },
  { id: 'plat', code: 'PLT-04', naam: 'Platformen', kleur: '#c2e3cc' },
  { id: 'veilig', code: 'SEC-05', naam: 'Veiligheid', kleur: '#ee7c8f' },
  { id: 'srv', code: 'SRV-06', naam: 'Servers', kleur: '#bfe3ed' },
];

// ───────────────────────────── borden en schermen ─────────────────────────────

function kopbalk(ctx, W, tekst, kleur = '#126425', inkt = '#ffffff', h = 86) {
  ctx.fillStyle = kleur; ctx.fillRect(0, 0, W, h);
  ctx.fillStyle = inkt; ctx.font = F(700, h * 0.44); ctx.fillText(tekst, 34, h * 0.64);
}
function luidspreker(ctx, x, y, s, kleur = '#126425') {
  ctx.fillStyle = kleur;
  ctx.beginPath(); ctx.moveTo(x, y - s * 0.3); ctx.lineTo(x + s * 0.35, y - s * 0.3); ctx.lineTo(x + s * 0.8, y - s * 0.7);
  ctx.lineTo(x + s * 0.8, y + s * 0.7); ctx.lineTo(x + s * 0.35, y + s * 0.3); ctx.lineTo(x, y + s * 0.3); ctx.fill();
  ctx.strokeStyle = kleur; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round';
  for (const r of [0.55, 0.95]) { ctx.beginPath(); ctx.arc(x + s * 0.9, y, s * r, -0.8, 0.8); ctx.stroke(); }
}
function tekenNaambord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, W, H);
  ctx.font = F(700, 92); ctx.textAlign = 'center';
  const tekst = 'Team ICT · Het leercollectief', b = ctx.measureText(tekst).width, links = W / 2 - b / 2;
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(links - 6, H * 0.58, ctx.measureText('Team ICT').width + 12, H * 0.26);
  ctx.fillStyle = '#126425'; ctx.fillText(tekst, W / 2, H * 0.72); ctx.textAlign = 'left';
}
function tekenMachine(d) {
  return ({ ctx, c }) => {
    const W = c.width, H = c.height;
    ctx.fillStyle = '#1d2530'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = d.kleur; ctx.fillRect(0, 0, 12, H);
    ctx.font = F(700, 54); ctx.fillText(d.code, 30, 70);
    ctx.fillStyle = '#e8eef2'; ctx.font = F(600, 34); ctx.fillText(d.naam, 30, 124);
  };
}
function tekenTaalappke({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  kopbalk(ctx, W, 'Taalappke', '#f2a76b', '#1a1a1a', 78);
  // een appel, het woord en een luidsprekertje
  ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.arc(150, 205, 74, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4e9a63'; ctx.beginPath(); ctx.ellipse(170, 122, 30, 13, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9c6f45'; ctx.fillRect(146, 116, 9, 28);
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 84); ctx.fillText('appel', 262, 232);
  rond(ctx, 262, 262, 210, 48, 24); ctx.fillStyle = '#ccefd5'; ctx.fill();
  luidspreker(ctx, 282, 286, 26);
  ctx.fillStyle = '#126425'; ctx.font = F(600, 26); ctx.fillText('luister', 340, 295);
}
function tekenDoelen(titel, sub) {
  return ({ ctx, c }) => {
    const W = c.width, H = c.height;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#126425'; ctx.font = F(700, 40); ctx.fillText(titel, 30, 66);
    ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 26); ctx.fillText(sub, 30, 104);
    const vakken = [['Nederlands', 'abc', '#fbf59b'], ['Wiskunde', '1 2 3', '#bfe3ed'], ['Wetenschap', 'W&T', '#c2e3cc']];
    vakken.forEach(([naam, teken, kleur], i) => {
      const y = 132 + i * 104;
      rond(ctx, 30, y, W - 60, 88, 22); ctx.fillStyle = kleur; ctx.fill();
      ctx.fillStyle = '#126425'; ctx.font = F(700, 38); ctx.fillText(teken, 54, y + 58);
      ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 32); ctx.fillText(naam, 160, y + 56);
    });
  };
}
function tekenReken({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  kopbalk(ctx, W, 'Rekencollectief', '#126425', '#ffffff', 84);
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 132); ctx.textAlign = 'center'; ctx.fillText('7 × 8 = ?', W / 2, 262);
  [54, 56, 58].forEach((n, i) => {
    const x = W / 2 - 250 + i * 180;
    rond(ctx, x, 304, 140, 84, 42); ctx.fillStyle = i === 1 ? '#c2e3cc' : '#f4f4f4'; ctx.fill();
    ctx.fillStyle = '#126425'; ctx.font = F(700, 52); ctx.fillText(String(n), x + 70, 364);
  });
  ctx.textAlign = 'left';
  rond(ctx, W - 300, 108, 268, 54, 27); ctx.fillStyle = '#fbf59b'; ctx.fill();
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 28); ctx.fillText('code 482 913', W - 280, 145);
}
function tekenTalent({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  kopbalk(ctx, W, 'TALent voor Taal', '#5fa9c9', '#ffffff', 84);
  rond(ctx, 40, 116, W - 80, 236, 30); ctx.fillStyle = '#eef7fa'; ctx.fill();
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 86); ctx.fillText('de hypotenusa', 78, 232);
  luidspreker(ctx, 84, 300, 30, '#126425');
  ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 32); ctx.fillText('wiskunde · 2de graad', 150, 312);
  [1, 1, 1, 0, 0].forEach((v, i) => { ctx.fillStyle = v ? '#126425' : '#d8e3e8'; ctx.beginPath(); ctx.arc(70 + i * 44, 390, 14, 0, Math.PI * 2); ctx.fill(); });
}
function tekenAiwijs({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 46); ctx.fillText('AI-wijs', 32, 72);
  ctx.fillText('op school', 32, 124);
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(32, 140, 150, 10);
  for (let i = 0; i < 9; i++) {
    const x = 60 + (i % 3) * 92, y = 210 + Math.floor(i / 3) * 84;
    ctx.fillStyle = i < 5 ? '#126425' : '#e2e2e2'; ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = i < 5 ? '#ffffff' : '#4d4d4d'; ctx.font = F(700, 28); ctx.textAlign = 'center'; ctx.fillText(String(i + 1), x, y + 10); ctx.textAlign = 'left';
  }
}
function tekenIctcheck({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  kopbalk(ctx, W, 'ICTCheck · ons ICT-beleidsplan', '#126425', '#ffffff', 80);
  const stappen = ['Beginsituatie', 'Visie', 'Prioriteiten', 'SWOT', 'Actieplan', 'Digitale thema\'s', 'Digiplan-check', 'Professionalisering'];
  stappen.forEach((s, i) => {
    const kol = i < 4 ? 0 : 1, rij = i % 4, x = 40 + kol * (W / 2), y = 132 + rij * 72;
    if (i < 3) vinkje(ctx, x + 20, y, 20);
    else { ctx.strokeStyle = '#c2e3cc'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + 20, y, 17, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = i < 3 ? '#1a1a1a' : '#4d4d4d'; ctx.font = F(600, 32); ctx.fillText(s, x + 56, y + 11);
  });
}
function tekenLeerlijn({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 36); ctx.fillText('Leerlijn digitale', 30, 58); ctx.fillText('competenties', 30, 100);
  const kleuren = ['#fcc89b', '#fbf59b', '#fbf59b', '#bfe3ed', '#bfe3ed', '#bfe3ed'];
  kleuren.forEach((k, i) => {
    const b = (W - 60) / 6, x = 30 + i * b, h = 60 + i * 34;
    rond(ctx, x + 4, H - 30 - h, b - 8, h, 12); ctx.fillStyle = k; ctx.fill();
  });
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 22);
  ctx.fillText('kleuter', 34, H - 8); ctx.fillText('lager', 140, H - 8); ctx.fillText('secundair', 300, H - 8);
}
function tekenHelpdesk({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.font = F(700, 88); ctx.textAlign = 'center'; ctx.fillText('Helpdesk', W / 2 + 40, H * 0.7); ctx.textAlign = 'left';
  ctx.fillStyle = '#c2e3cc'; rond(ctx, 44, 34, 96, 70, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(70, 100); ctx.lineTo(62, 128); ctx.lineTo(96, 102); ctx.fill();
  ctx.fillStyle = '#126425'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(70 + i * 22, 69, 7, 0, Math.PI * 2); ctx.fill(); }
}
// Het grote scherm in de vluchtleiding. Buiten de ronde: alle systemen in orde.
// Tijdens de ronde: per dienst wacht, bezig, go of no-go, en het aftellen.
const SCHERM_KLEUR = { go: '#5bd48a', nogo: '#ff5a4f', bezig: '#ffcf3a', wacht: '#5c6878' };
function tekenLeidingScherm({ ctx, c }, stand = { fase: 'rust', toestand: {} }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#16202b'; ctx.fillRect(0, 0, W, H);
  const titel = { rust: 'Alle systemen', ronde: 'Go/no-go-ronde', hold: 'No-go', go: 'Go voor lancering', aftellen: 'Aftellen', vlucht: 'In vlucht' }[stand.fase] || 'Alle systemen';
  ctx.fillStyle = stand.fase === 'hold' ? '#ff8a80' : '#c2e3cc'; ctx.font = F(700, 40); ctx.fillText(titel, 40, 66);
  DIENSTEN.forEach((d, i) => {
    const kol = i % 3, rij = Math.floor(i / 3), x = 40 + kol * 220, y = 118 + rij * 92;
    const t = stand.fase === 'rust' ? 'go' : stand.toestand[d.id] || 'wacht';
    rond(ctx, x, y, 200, 72, 18); ctx.fillStyle = t === 'nogo' ? '#4a2226' : '#223140'; ctx.fill();
    ctx.fillStyle = d.kleur; ctx.font = F(700, 30); ctx.fillText(d.code, x + 18, y + 46);
    ctx.fillStyle = SCHERM_KLEUR[t]; ctx.beginPath(); ctx.arc(x + 176, y + 36, 11, 0, Math.PI * 2); ctx.fill();
  });
  const rx = W - 130;
  if (stand.tel != null) {
    // het aftelcijfer in het groot
    ctx.fillStyle = '#ffcf3a'; ctx.font = F(700, 150); ctx.textAlign = 'center'; ctx.fillText(String(stand.tel), rx, 220); ctx.textAlign = 'left';
    return;
  }
  // de raket in het klein, met haar vijf verdiepingen
  ['#c2e3cc', '#bfe3ed', '#fbf59b', '#fcc89b', '#5c6878'].forEach((k, i) => { ctx.fillStyle = k; ctx.fillRect(rx - 34, 96 + i * 34, 68, 30); });
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(rx - 34, 92); ctx.lineTo(rx, 30); ctx.lineTo(rx + 34, 92); ctx.fill();
}
function tekenLeidingBord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 70); ctx.textAlign = 'center'; ctx.fillText('Vluchtleiding', W / 2, H * 0.72); ctx.textAlign = 'left';
}
function tekenKompas({ ctx, c }) {
  const W = c.width, m = W / 2;
  const gr = ctx.createRadialGradient(m, m, 10, m, m, m);
  gr.addColorStop(0, '#fffdf2'); gr.addColorStop(1, '#ccefd5');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, W);
  ctx.save(); ctx.translate(m, m * 0.86);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = i % 2 ? '#126425' : '#4e9a63';
    ctx.beginPath(); ctx.moveTo(0, -W * 0.3); ctx.lineTo(W * 0.06, 0); ctx.lineTo(-W * 0.06, 0); ctx.fill();
  }
  ctx.fillStyle = '#fbf59b'; ctx.beginPath(); ctx.arc(0, 0, W * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#126425'; ctx.font = F(700, W * 0.075); ctx.textAlign = 'center';
  ctx.fillText('samen leren', m, W * 0.8); ctx.fillText('samenleven', m, W * 0.89); ctx.textAlign = 'left';
}

// ───────────────────────────── het tafereel ─────────────────────────────

export function maakRaket(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwRaket(g, canvas));
}

// Wie aan een tafel of een bank zit, zit in de ruimte vastgegespt: anders zweven
// de benen door het tafelblad (zie zetPassagiers).
const aanTafel = f => { f.userData.aanTafel = true; return f; };
// Een figuurtje dat niet beweegt, wordt één vorm: dat scheelt zes tekenbeurten.
// Met hoofd: true blijft het hoofd los, zodat het kan rondkijken.
function stilFiguur(f, { hoofd = false } = {}) {
  for (const deel of [...f.userData.armen, ...(f.userData.benen || [])]) deel.userData.levend = false;
  if (!hoofd) f.userData.hoofd.userData.levend = false;
  return f;
}
const zacht = x => { x = klem(x, 0, 1); return x * x * (3 - 2 * x); };
// Een kleur per hoekpunt, voor een vorm met een eigen materiaal (vertexColors).
function kleurVorm(vorm, kleur) {
  const k = new T.Color(kleur), n = vorm.attributes.position.count, a = new Float32Array(n * 3);
  for (let j = 0; j < n; j++) k.toArray(a, j * 3);
  vorm.setAttribute('color', new T.BufferAttribute(a, 3));
  return vorm;
}
// Waar je op een cirkel staat: hoek 0 is vooraan, in de opening.
const boog = (hoek, r) => [r * Math.sin(hoek), r * Math.cos(hoek)];
// Naar een punt kijken: figuurtjes kijken langs hun +z.
const kijkNaar = (x, z, nx, nz) => Math.atan2(nx - x, nz - z);
// De zes kasten in de motor, als hoek op de cirkel (0 is vooraan). De buitenste
// staan niet verder dan 1,12 van de achterwand: anders verdwijnen ze achter de
// rand van de opening zodra de kijkhoek wat draait.
const KAST_HOEKEN = [-1.12, -0.78, -0.4, 0.4, 0.78, 1.12];
// Waar de patrijspoorten op de buitenkant zitten: net naast de rand van de opening.
const PATRIJS = [1.3, -1.27];

function bouwRaket(g, canvas) {
  const { wereld, kamerLamp, gloed, plek, speel, statischeTekening, glasBuiten } = g;
  const tijd = g.tijd;
  const r = toeval(11);
  // De lampen in de kamers vliegen mee met de raket (op een zwak toestel zijn er geen).
  const raketLampen = [];
  for (let i = 1; i < NIVEAUS.length; i++) {
    // net onder de hanglamp (zie pendel), en met een korter bereik: zo lekt er
    // minder licht door de vloer naar de kamer erboven
    const l = kamerLamp(0, BASIS + i * VH + VH - 0.5, RZ + 0.45, LAMP);
    if (l) { l.distance = 4.2; l.decay = 1; raketLampen.push({ l, y: l.position.y, i }); }
  }
  kamerLamp(LEIDING.x, 0.95, LEIDING.z + 0.3, 3);
  // Eén lamp voor twee dingen: 's avonds een zachte gloed van de waakvlam op het
  // platform, en bij de lancering het vuur dat het platform oranje kleurt (ook
  // overdag). De sterkte zet avond() (zie daar). Op een zwak toestel: geen lamp.
  const motorLamp = kamerLamp(0, 0.32, RZ, 0);
  if (motorLamp) { motorLamp.distance = 7; motorLamp.decay = 1; }
  let vuurNu = 0;

  // ── sokkel met naambordje ──
  const sokkel = groepje(wereld);
  blok(sokkel, 13.2, 0.5, 9, K.mint, 0, -0.5, -0.9, { r: 0.22, schaduw: false });
  blok(sokkel, 13.4, 0.3, 9.2, K.groen, 0, -0.78, -0.9, { r: 0.14, schaduw: false });
  blok(sokkel, 3.3, 0.36, 0.04, K.groenDonker, 0, -0.43, 3.6, { r: 0.015, schaduw: false });
  statischeTekening(paneel(sokkel, 3.2, 0.28, 1280, 0, -0.25, 3.625), tekenNaambord);

  // ── het lanceerplatform ──
  const platform = groepje(wereld);
  cilinder(platform, 2.9, 3.0, 0.12, K.steen, 0, 0, RZ, { seg: 48, schaduw: false });
  cilinder(platform, 1.25, 1.25, 0.012, 0x6b7480, 0, 0.12, RZ, { seg: 32, schaduw: false });
  for (let i = 0; i < 20; i++) {
    const [x, z] = boog(i / 20 * Math.PI * 2, 2.62);
    const streep = blok(platform, 0.3, 0.012, 0.1, i % 2 ? K.geel : K.inkt, x, 0.12, RZ + z, { r: 0.004, schaduw: false });
    streep.rotation.y = i / 20 * Math.PI * 2 + Math.PI / 2;
  }
  {
    // Een zachte schaduw onder de raket. De wanden werpen zelf geen schaduw:
    // anders zou de verdieping erboven de kamers donker maken.
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gr = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gr.addColorStop(0, 'rgba(13,74,27,0.34)'); gr.addColorStop(1, 'rgba(13,74,27,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    const vlek = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }));
    vlek.rotation.x = -Math.PI / 2;
    vlek.scale.set(6.2, 5.0, 1);
    vlek.position.set(-0.8, 0.135, RZ - 0.6);
    platform.add(vlek);
  }
  // paden naar de helpdesk en naar de vluchtleiding
  const pad = groepje(wereld);
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    blok(pad, 0.4, 0.04, 0.3, K.steen, 0.2 - t * 2.75 + (i % 2 ? 0.08 : -0.08), 0, 3.2 - t * 1.95, { r: 0.02, schaduw: false }).rotation.y = 0.9;
  }
  for (let i = 0; i < 2; i++) blok(pad, 0.32, 0.035, 0.28, K.steen, 2.75 + i * 0.32, 0, 0.0 + i * 0.12, { r: 0.02, schaduw: false }).rotation.y = -0.6;

  // ── de raket ──
  const raket = groepje(wereld, 0, 0, RZ);
  raket.rotation.y = DRAAI;
  const kamers = {};
  // Een stuk wand rond de raket, met de opening vooraan.
  function schil(ouder, straal, h, y, materiaal) {
    const m = new T.Mesh(new T.CylinderGeometry(straal, straal, h, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), materiaal);
    m.position.y = y + h / 2;
    return zet(ouder, m, false);
  }
  // Een groepje tegen de binnenwand, met zijn +z naar het midden van de kamer.
  function aanWand(ouder, hoek, straal = RW - 0.1) {
    const [x, z] = boog(hoek, straal);
    const w = groepje(ouder, x, 0, z);
    w.rotation.y = hoek + Math.PI;
    return w;
  }
  // n punten langs een boog van de wand, van hoek a tot b: fn(x, z, hoek).
  function langsBoog(a, b, n, straal, fn) {
    for (let k = 0; k < n; k++) {
      const hoek = a + (b - a) * (k + 0.5) / n;
      const [x, z] = boog(hoek, straal);
      fn(x, z, hoek);
    }
  }
  // Een groepje op de buitenkant van de romp, met zijn +z naar buiten.
  function opRomp(ouder, hoek, y, straal = R) {
    const [x, z] = boog(hoek, straal);
    const w = groepje(ouder, x, y, z);
    w.rotation.y = hoek;
    return w;
  }
  // Een patrijspoort: groene ring met klinknagels, glas dat 's avonds en in de
  // ruimte warm oplicht (glasBuiten), en een glimlichtje.
  const poortRing = new T.TorusGeometry(0.2, 0.04, 6, 24), poortGlas = new T.CircleGeometry(0.19, 28), poortGlans = new T.CircleGeometry(0.05, 12);
  function patrijspoort(ouder, hoek, y) {
    const p = opRomp(ouder, hoek, y);
    zet(p, new T.Mesh(poortGlas, glasBuiten), false).position.z = 0.014;
    zet(p, new T.Mesh(poortRing, mat(K.groen)), false).position.z = 0.022;
    zet(p, new T.Mesh(poortGlans, mat(0xffffff)), false).position.set(-0.075, 0.075, 0.018);
    for (let k = 0; k < 8; k++) {
      const a = (k + 0.5) / 8 * Math.PI * 2;
      nagel(p, Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.062, K.mint, 0.014);
    }
    return p;
  }
  // Een rooster in de wand van de motor: lamellen voor de koeling.
  function rooster(ouder, hoek, y) {
    const p = opRomp(ouder, hoek, y);
    blok(p, 0.4, 0.34, 0.02, 0x4f5b6b, 0, -0.17, 0.008, { r: 0, schaduw: false });
    for (let k = 0; k < 5; k++) blok(p, 0.34, 0.026, 0.04, 0xb8bec7, 0, -0.142 + k * 0.064, 0.016, { r: 0, schaduw: false });
    return p;
  }
  const NAAD = 0xe6ddcc;
  // Een klinknagel: een icosaëder van 20 driehoeken (een bol van seg 6 telt er 60).
  const nagelGeo = new T.IcosahedronGeometry(1, 0);
  function nagel(ouder, x, y, z, kleur = NAAD, r = 0.016) {
    const m = zet(ouder, new T.Mesh(nagelGeo, mat(kleur)), false);
    m.position.set(x, y, z);
    m.scale.setScalar(r);
    return m;
  }
  const pulsMat = new T.MeshBasicMaterial({ color: 0xb6f2c9 });
  // Kleine schermen die zelf licht geven: één materiaal, de kleur zit in de vorm.
  const schermMat = new T.MeshBasicMaterial({ vertexColors: true });
  function schermVlak(ouder, b, h, kleur, x, y, z) {
    const m = new T.Mesh(kleurVorm(new T.PlaneGeometry(b, h), kleur), schermMat);
    m.position.set(x, y, z);
    ouder.add(m);
    return m;
  }
  const pulsen = [], lampjes = [], lampjeVan = {};
  // Een hanglamp met een kap in de kleur van de verdieping, wat naar voren: zo
  // blijft ze onder de rand van het plafond in beeld. Het lampje is van glas
  // (glasBuiten): overdag lichtblauw, 's avonds gloeit het, en het wordt één
  // vorm met de patrijspoorten van die verdieping.
  const lampGloed = [];
  function pendel(v, band, i) {
    const p = groepje(v, 0, 0, 0.45);
    cilinder(p, 0.006, 0.006, 0.32, K.inkt, 0, VH - 0.32, 0, { seg: 6, schaduw: false });
    cilinder(p, 0.045, 0.17, 0.12, band, 0, VH - 0.44, 0, { seg: 20 });
    bol(p, 0.055, 0, 0, VH - 0.45, 0, { materiaal: glasBuiten, seg: 12, schaduw: false });
    lampGloed.push({ m: gloed(p, 0, VH - 0.5, 0, 0.8), i });
  }
  function verdieping(naam, i, { wand, vloer, band }) {
    const v = groepje(raket, 0, BASIS + i * VH, 0);
    cilinder(v, R, R, PLAAT, K.wit, 0, 0, 0, { seg: 40, schaduw: false });
    cilinder(v, RW - 0.04, RW - 0.04, 0.012, vloer, 0, PLAAT, 0, { seg: 40, schaduw: false });
    const lip = new T.Mesh(new T.CylinderGeometry(R + 0.006, R + 0.006, 0.04, 24, 1, true, -OPEN, 2 * OPEN), mat(K.groen));
    lip.position.y = 0.06;
    zet(v, lip, false);
    schil(v, R, VH - PLAAT, PLAAT, mat(K.wit));
    schil(v, R + 0.008, 0.14, VH - 0.28, mat(band));
    // Buitenkant: rechts (in beeld in het overzicht en tijdens de vlucht) en links
    // een patrijspoort, in de motor een rooster.
    for (const hoek of PATRIJS) (i === 0 ? rooster : patrijspoort)(v, hoek, PLAAT + 0.86);
    for (const kant of [-1, 1]) {
      // verticale naden tussen de panelen
      for (const hoek of [1.68, 2.3]) blok(opRomp(v, kant * hoek, 0), 0.022, VH - PLAAT - 0.36, 0.012, NAAD, 0, PLAAT + 0.03, 0.002, { r: 0, schaduw: false });
      // klinknagels boven de vloer en onder de band
      for (let k = 0; k < 12; k++) for (const y of [PLAAT + 0.05, VH - 0.34]) {
        const [x, z] = boog(kant * (OPEN + 0.07 + k * 0.08), R + 0.004);
        nagel(v, x, y, z);
      }
    }
    // Elke kamer krijgt een eigen materiaal voor de binnenwand: dat licht op
    // als je er met de muis over gaat, en gloeit 's avonds een beetje. side 1
    // is de binnenkant van de cilinder.
    // vertexColors: de wand krijgt een kleur per hoekpunt (zie hieronder). Dat werkt
    // alleen omdat wandMat 'apart' is: anders overschrijft voegSamen die kleuren.
    const wandMat = new T.MeshLambertMaterial({ color: wand, emissive: OPLICHT, emissiveIntensity: 0, side: 1, vertexColors: true });
    wandMat.userData.apart = true;
    {
      // Een zachte schaduw onder het plafond en tegen de vloer, zoals in een echte
      // kamer: een kleur per hoekpunt, dus geen extra tekenbeurt.
      const hw = (VH - PLAAT) / 2;
      const vorm = new T.CylinderGeometry(RW, RW, 2 * hw, 40, 6, true, OPEN, Math.PI * 2 - 2 * OPEN);
      const pos = vorm.attributes.position, k = new Float32Array(pos.count * 3);
      for (let j = 0; j < pos.count; j++) {
        const t = (pos.getY(j) + hw) / (2 * hw);  // 0 aan de vloer, 1 aan het plafond
        k.fill(1 - 0.24 * zacht((t - 0.6) / 0.4) - 0.1 * (1 - zacht(t / 0.14)), j * 3, j * 3 + 3);
      }
      vorm.setAttribute('color', new T.BufferAttribute(k, 3));
      const m = new T.Mesh(vorm, wandMat);
      m.position.y = PLAAT + hw;
      zet(v, m, false);
    }
    // een plint in de kleur van de band, langs de hele wand (blokjes langs de boog:
    // die zijn van binnenuit te zien, een cilinder niet na het samenvoegen)
    langsBoog(OPEN + 0.06, Math.PI * 2 - OPEN - 0.06, 30, RW - 0.02, (x, z, hoek) => {
      blok(v, 0.3, 0.07, 0.035, band, x, PLAAT, z, { r: 0.008, schaduw: false }).rotation.y = hoek;
    });
    // de randen van de doorsnede
    for (const kant of [-1, 1]) {
      const a = kant * OPEN;
      const rib = blok(v, 0.05, VH - PLAAT, MUUR + 0.03, K.groen, 0, PLAAT, 0, { r: 0.012, schaduw: false });
      rib.position.x = Math.sin(a) * (R - MUUR / 2);
      rib.position.z = Math.cos(a) * (R - MUUR / 2);
      rib.rotation.y = a;
      // klinknagels op de snijrand, op de kant die naar de opening kijkt
      // (in een eigen groepje: een vorm met kinderen wordt niet samengevoegd)
      const nagels = groepje(v, rib.position.x, 0, rib.position.z);
      nagels.rotation.y = a;
      for (let k = 0; k < 7; k++) nagel(nagels, -kant * 0.027, PLAAT + 0.16 + k * 0.26, 0, K.mint, 0.014);
    }
    // de ruggengraat: hier stroomt de energie van de motor naar boven
    const rug = aanWand(v, Math.PI, RW - 0.16);
    cilinder(rug, 0.1, 0.1, VH - PLAAT, K.mint, 0, PLAAT, 0, { seg: 16, schaduw: false });
    for (const y of [0.35, VH - 0.3]) cilinder(rug, 0.13, 0.13, 0.05, K.groen, 0, y, 0, { seg: 16, schaduw: false });
    const puls = levend(new T.Mesh(new T.TorusGeometry(0.12, 0.028, 6, 20), pulsMat));
    puls.rotation.x = Math.PI / 2;
    rug.add(puls);
    pulsen.push(puls);
    const raak = new T.Mesh(new T.CylinderGeometry(R, R, VH, 16), new T.MeshBasicMaterial({ visible: false }));
    raak.position.y = VH / 2;
    raak.userData.kamer = naam;
    v.add(levend(raak));
    // 's Avonds kleurt de wand naar haar eigen kleur in warm lamplicht, in plaats
    // van naar wit (zie avond). Op een zwak toestel brandt geen lamp: daar geeft
    // de wand zelf meer licht (de motor zet de sterkte op 0,32 in plaats van 0,1).
    const warm = new T.Color(naam === 'motor' ? 0x3fbf8f : wand).multiply(new T.Color(naam === 'motor' ? 0xffffff : LAMPKLEUR))
      .multiplyScalar(naam === 'motor' ? (g.zwak ? 0.9 : 2.2) : (g.zwak ? 1.7 : 2.6));
    if (naam !== 'motor') pendel(v, band, i);
    kamers[naam] = { groep: v, wandMat, raak, warm, i };
    return v;
  }
  // 's Avonds gloeit een scherm wat uit op de wand erachter: een vlak met een
  // zachte, koele rand, optellend licht.
  const HALO = 0.17;  // hoe ver de gloed buiten de lijst reikt
  function haloMat(b, h) {
    const s = 128 / (b + 0.08 + 2 * HALO), c = document.createElement('canvas');
    c.width = 128; c.height = Math.round((h + 0.08 + 2 * HALO) * s);
    const ctx = c.getContext('2d'), r = HALO * s;
    // alleen de schaduw valt op het doek: een zachte rand, ook in Safari (ctx.filter werkt daar niet)
    ctx.shadowColor = 'rgba(196,232,255,1)'; ctx.shadowBlur = r * 0.9; ctx.shadowOffsetX = 1000;
    ctx.fillStyle = '#000'; ctx.fillRect(r * 0.75 - 1000, r * 0.75, c.width - 1.5 * r, c.height - 1.5 * r);
    // het scherm zelf blijft vrij
    ctx.shadowColor = 'transparent'; ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(r, r, c.width - 2 * r, c.height - 2 * r);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    return new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: 2, opacity: 0 });
  }
  const halos = [];
  function schermHalo(ouder, b, h, y, z) {
    const m = levend(new T.Mesh(new T.PlaneGeometry(b + 0.08 + 2 * HALO, h + 0.08 + 2 * HALO), haloMat(b, h)));
    m.position.set(0, y, z);
    m.visible = false; m.raycast = () => {};
    ouder.add(m);
    halos.push(m);
  }
  // Een bord of scherm tegen de wand, met een lijst errond. De bovenrand ligt vast (BORD_TOP).
  function wandBord(ouder, hoek, b, h, px, teken, { lijst = K.wit, scherm = false } = {}) {
    const y = BORD_TOP - h;
    // De gloed hangt in de verdieping zelf, niet in de plek: anders groeit het kader van de plek mee.
    if (scherm) schermHalo(aanWand(ouder, hoek), b, h, y + h / 2, 0.05);
    const w = aanWand(ouder, hoek);
    blok(w, b + 0.08, h + 0.08, 0.04, lijst, 0, y - 0.04, 0, { r: 0.015 });
    statischeTekening(paneel(w, b, h, px, 0, y + h / 2, 0.045, { scherm }), teken);
    return w;
  }
  function medewerker(ouder, x, z, naarX, naarZ, { shirt = ORANJE, huid = 2, haar = 1, zit = false, schaal = 1, hoofd = true } = {}) {
    return stilFiguur(figuur(ouder, { x, y: PLAAT, z, draai: kijkNaar(x, z, naarX, naarZ), shirt, huid: HUID[huid], haar: HAAR[haar], zit, schaal }), { hoofd });
  }
  const koppen = [];

  // ── de motor: de technische basis ──
  const motor = verdieping('motor', 0, { wand: 0x4f5b6b, vloer: 0x3a434f, band: K.inkt });
  {
    // de reactor onderaan de ruggengraat
    const voet = aanWand(motor, Math.PI, RW - 0.16);
    cilinder(voet, 0.34, 0.38, 0.42, K.groen, 0, PLAAT, 0, { seg: 24 });
    cilinder(voet, 0.36, 0.36, 0.05, 0, 0, PLAAT + 0.42, 0, { seg: 24, materiaal: pulsMat, schaduw: false });
    DIENSTEN.forEach((d, k) => {
      const hoek = Math.PI + KAST_HOEKEN[k];
      const kast = plek(d.id, 'motor', aanWand(motor, hoek, RW - 0.22));
      blok(kast, 0.44, 0.98, 0.34, 0xdde2e6, 0, PLAAT, 0, { r: 0.03 });
      blok(kast, 0.46, 0.06, 0.36, parseInt(d.kleur.slice(1), 16), 0, PLAAT + 0.98, 0, { r: 0.02 });
      for (let j = 0; j < 3; j++) blok(kast, 0.34, 0.03, 0.01, 0x9aa3a8, 0, PLAAT + 0.18 + j * 0.08, 0.172, { r: 0, schaduw: false });
      statischeTekening(paneel(kast, 0.34, 0.22, 256, 0, PLAAT + 0.7, 0.175, { scherm: true }), tekenMachine(d));
      cilinder(kast, 0.03, 0.03, VH - 1.08 - PLAAT, K.inkt, 0, PLAAT + 1.04, -0.05, { seg: 8, schaduw: false });
      const lampje = levend(bol(kast, 0.026, 0, 0.14, PLAAT + 0.48, 0.175, { materiaal: new T.MeshBasicMaterial({ color: 0x5bd48a }), seg: 8, schaduw: false }));
      lampje.userData.fase = k * 1.3;
      lampje.userData.toestand = 'rust';
      lampjes.push(lampje);
      lampjeVan[d.id] = lampje;
      // een rijtje vaste ledjes naast het knipperende lampje
      [0x5bd48a, 0xffb347, 0x5bd48a, 0x7cc3dc].forEach((kleur, j) => blok(kast, 0.016, 0.016, 0.008, kleur, -0.14 + j * 0.05, PLAAT + 0.47, 0.172, { r: 0, schaduw: false }));
    });
    // een kabelgoot langs de wand, boven de kasten
    langsBoog(Math.PI - 1.38, Math.PI + 1.38, 14, RW - 0.1, (x, z, hoek) => {
      blok(motor, 0.38, 0.08, 0.14, 0x3a434f, x, PLAAT + 1.5, z, { r: 0.01, schaduw: false }).rotation.y = hoek;
    });
    const technicus = medewerker(motor, 0.25, 0.1, 0.75, -1.4, { shirt: K.groen, huid: 0, haar: 3 });
    blok(technicus, 0.2, 0.14, 0.02, K.inkt, 0, 0.5, 0.17, { r: 0.01 }).rotation.x = -0.5;
    for (const arm of technicus.userData.armen) arm.rotation.x = -0.9;
    koppen.push(technicus);
  }
  // de onderkant: een rok, zes motoren en drie vinnen
  const motorblok = levend(groepje(motor, 0, 0, 0));
  cilinder(motor, R, R * 0.8, 0.46, K.wit, 0, -0.46, 0, { seg: 40, schaduw: false });
  cilinder(motor, R * 0.8 + 0.01, R * 0.8 + 0.01, 0.06, K.groen, 0, -0.46, 0, { seg: 40, schaduw: false });
  {
    // TEAM ICT op de rok, als een gebogen sticker die de vorm van de rok volgt.
    const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
    const ryAt = y => R * 0.8 + (y + 0.46) / 0.46 * (R - R * 0.8) + 0.006;
    const BOOG = 1.5, MIDDEN = 0.08;
    const vorm = new T.CylinderGeometry(ryAt(-0.08), ryAt(-0.38), 0.3, 32, 1, true, MIDDEN - BOOG / 2, BOOG);
    const sticker = new T.Mesh(vorm, new T.MeshLambertMaterial({ map: tex, transparent: true, depthWrite: false }));
    sticker.position.y = -0.23;
    sticker.renderOrder = 1;
    motor.add(sticker);
    statischeTekening({ c, ctx: c.getContext('2d'), tex }, ({ ctx }) => {
      ctx.clearRect(0, 0, 1024, 128);
      ctx.fillStyle = '#126425'; ctx.font = F(700, 96); ctx.textAlign = 'center';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '14px';
      ctx.fillText('TEAM ICT', 512, 98);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.textAlign = 'left';
      for (const kant of [-1, 1]) for (let k = 0; k < 3; k++) {
        ctx.fillStyle = ['#126425', '#4e9a63', '#c2e3cc'][k];
        ctx.beginPath(); ctx.arc(512 + kant * (300 + k * 44), 64, 13 - k * 2, 0, Math.PI * 2); ctx.fill();
      }
    });
  }
  const vlamMat = new T.MeshBasicMaterial({ color: 0xa8dcff, transparent: true, opacity: 0.8, depthWrite: false });
  const WAAKVLAM = new T.Color(0xa8dcff), VUUR = new T.Color(0xffb347);
  // Waar de vlammen aan de motoren hangen, in de wereld, als de raket op het platform staat.
  const VLAM_TOP = BASIS - 1.06;
  let vlamLengte = 0;
  const vlammen = [];
  for (let k = 0; k < 6; k++) {
    const [x, z] = boog(k / 6 * Math.PI * 2 + Math.PI / 6, 0.95);
    // De straalpijp: een kop tegen de bodem, een smalle keel, en een klok die
    // naar onder uitwaaiert, met twee koelringen.
    cilinder(motorblok, 0.2, 0.2, 0.12, 0x6b7480, x, -0.58, z, { seg: 18 });
    cilinder(motorblok, 0.1, 0.15, 0.1, 0x4f5b6b, x, -0.68, z, { seg: 18 });
    cilinder(motorblok, 0.15, 0.22, 0.14, 0xb8bec7, x, -0.82, z, { seg: 24 });
    cilinder(motorblok, 0.22, 0.28, 0.14, 0xaab2b9, x, -0.96, z, { seg: 24 });
    cilinder(motorblok, 0.28, 0.32, 0.07, 0x9aa3a8, x, -1.03, z, { seg: 24 });
    for (const [y, rr] of [[-0.82, 0.152], [-0.96, 0.222]]) {
      const koel = new T.Mesh(new T.TorusGeometry(rr, 0.016, 6, 24), mat(0x6b7480));
      koel.rotation.x = Math.PI / 2; koel.position.set(x, y, z);
      zet(motorblok, koel, false);
    }
    cilinder(motorblok, 0.33, 0.33, 0.05, parseInt(DIENSTEN[k].kleur.slice(1), 16), x, -1.06, z, { seg: 24, schaduw: false });
    // De vlam hangt met haar brede kant aan de motor en wijst naar beneden.
    const vorm = new T.ConeGeometry(0.24, 0.9, 14, 1, true);
    vorm.rotateX(Math.PI);
    vorm.translate(0, -0.45, 0);
    const vlam = levend(new T.Mesh(vorm, vlamMat));
    vlam.position.set(x, -1.06, z);
    vlam.scale.setScalar(0.001);
    motorblok.add(vlam);
    vlammen.push(vlam);
  }
  speel(motorblok, s => { s.t = tijd(); });
  // De vinnen zijn ook de poten: ze staan schuin naar buiten op het platform.
  const vinBodem = 0.12 - BASIS;
  for (const hoek of [Math.PI / 2 + 0.35, -Math.PI / 2 - 0.35, Math.PI]) {
    const [x, z] = boog(hoek, 1.55);
    const vin = groepje(motor, x, 0, z);
    vin.rotation.y = hoek;
    // Een doos waarvan we de hoekpunten verleggen: boven tegen de raket, onder ver naar buiten.
    const geo = new T.BoxGeometry(0.09, 1, 1);
    const pos = geo.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const boven = pos.getY(j) > 0, buiten = pos.getZ(j) > 0;
      pos.setY(j, boven ? 0.6 : vinBodem);
      pos.setZ(j, boven ? (buiten ? 0.62 : 0) : (buiten ? 1.35 : 0.55));
    }
    geo.computeVertexNormals();
    zet(vin, new T.Mesh(geo, mat(K.groen, true)));
    blok(vin, 0.17, 0.06, 0.9, K.groenDonker, 0, vinBodem, 0.95, { r: 0.02 });
    // een mintgroene voorrand, klinknagels langs de wortel en een voetschijf
    const rand = Math.hypot(1.35 - 0.62, 0.6 - vinBodem), helling = Math.atan2(1.35 - 0.62, 0.6 - vinBodem);
    const lijst = blok(vin, 0.12, rand, 0.07, K.mint, 0, 0, 0, { r: 0.03, schaduw: false });
    lijst.position.set(0, (0.6 + vinBodem) / 2, (0.62 + 1.35) / 2 + 0.01);
    lijst.rotation.x = -helling;
    for (const kant of [-1, 1]) for (let k = 0; k < 6; k++) {
      const t = (k + 0.5) / 6;
      nagel(vin, kant * 0.05, 0.6 + (vinBodem - 0.6) * t, 0.62 + (1.35 - 0.62) * t - 0.2, K.mint, 0.018);
    }
    cilinder(vin, 0.17, 0.21, 0.05, 0x9aa3a8, 0, vinBodem, 1.25, { seg: 20 });
  }

  // ── de kleuters ──
  const kleuter = verdieping('kleuter', 1, { wand: K.perzik, vloer: 0xf2dfc4, band: 0xf2a76b });
  plek('taalkleuter', 'kleuter', wandBord(kleuter, Math.PI + 0.62, 0.92, 0.66, 512, tekenTaalappke));
  plek('minimumdoelen', 'kleuter', wandBord(kleuter, Math.PI - 0.62, 0.66, 0.76, 384, tekenDoelen('Nieuwe doelen', 'kleuters · 2026-2027')));
  {
    const mx = -0.2, mz = -0.35;
    cilinder(kleuter, 0.82, 0.82, 0.012, K.mint, mx, PLAAT + 0.012, mz, { seg: 36, schaduw: false });
    cilinder(kleuter, 0.06, 0.09, 0.26, K.wit, mx, PLAAT, mz, { seg: 12 });
    cilinder(kleuter, 0.36, 0.36, 0.03, K.hout, mx, PLAAT + 0.26, mz, { seg: 28 });
    blok(kleuter, 0.24, 0.016, 0.17, K.inkt, mx + 0.05, PLAAT + 0.29, mz + 0.06, { r: 0.008 });
    blok(kleuter, 0.2, 0.004, 0.13, 0xf2a76b, mx + 0.05, PLAAT + 0.306, mz + 0.06, { r: 0, schaduw: false });
    for (const [x, z, k, h] of [[mx - 0.55, mz + 0.12, K.geel, 1], [mx + 0.5, mz + 0.22, K.blauw, 4]]) {
      blok(kleuter, 0.16, 0.14, 0.16, K.groen, x, PLAAT, z, { r: 0.03 });
      koppen.push(stilFiguur(figuur(kleuter, { x, y: PLAAT + 0.14 - 0.25 * 0.6, z, draai: kijkNaar(x, z, mx, mz), shirt: k, huid: HUID[h], haar: HAAR[h % 5], zit: true, schaal: 0.6 }), { hoofd: true }));
    }
    koppen.push(medewerker(kleuter, mx + 0.95, mz - 0.45, mx, mz, { huid: 5, haar: 0 }));
    [[0.95, 0.35, K.geel], [1.08, 0.2, K.roos], [1.02, 0.28, K.zee]].forEach(([x, z, k], i) => blok(kleuter, 0.12, 0.12, 0.12, k, x, PLAAT + (i === 2 ? 0.12 : 0), z, { r: 0.02 }).rotation.y = i * 0.5);
    plant(kleuter, -1.2, PLAAT, 0.35, 0.9);
    // een kapstok met jasjes, en een boekentas op de grond
    const kapstok = aanWand(kleuter, Math.PI + 1.05, RW - 0.06);
    blok(kapstok, 0.72, 0.05, 0.04, K.hout, 0, PLAAT + 0.74, 0, { r: 0.01 });
    [K.roos, K.zee, K.geel, K.blad1].forEach((k, j) => {
      const x = -0.24 + j * 0.16;
      blok(kapstok, 0.02, 0.05, 0.03, K.inkt, x, PLAAT + 0.69, 0.02, { r: 0.005, schaduw: false });
      blok(kapstok, 0.15, 0.27, 0.05, k, x, PLAAT + 0.44, 0.045, { r: 0.03 });
    });
    blok(kapstok, 0.17, 0.2, 0.1, K.oranje, 0.32, PLAAT, 0.12, { r: 0.035 });
  }

  // ── het lager ──
  const lager = verdieping('lager', 2, { wand: K.geel, vloer: 0xe9d3a6, band: 0xffcf3a });
  const digibord = plek('reken', 'lager', wandBord(lager, Math.PI + 0.55, 1.2, 0.72, 768, tekenReken, { lijst: K.grijs, scherm: true }));
  plek('doelen-lager', 'lager', wandBord(lager, Math.PI - 0.64, 0.66, 0.76, 384, tekenDoelen('Nieuwe doelen', '1ste tot 3de leerjaar')));
  {
    const [bx, bz] = boog(Math.PI + 0.55, RW);
    for (const [x, z, k, h] of [[-0.55, -0.1, K.perzik, 0], [0.35, -0.2, K.mint, 3]]) {
      const draai = kijkNaar(x, z, bx, bz);
      const bank = groepje(lager, x, PLAAT, z);
      bank.rotation.y = draai;
      blok(bank, 0.52, 0.03, 0.32, K.hout, 0, 0.32, 0.36, { r: 0.01 });
      for (const lx of [-0.22, 0.22]) blok(bank, 0.03, 0.32, 0.28, K.wit, lx, 0, 0.36, { r: 0.008 });
      laptop(bank, 0, 0.35, 0.36, Math.PI, K.inkt);
      blok(bank, 0.24, 0.2, 0.24, K.groen, 0, 0, 0.0, { r: 0.03 });
      koppen.push(aanTafel(stilFiguur(figuur(bank, { x: 0, y: 0.2 - 0.25 * 0.74, z: 0, draai: 0, shirt: k, huid: HUID[h], haar: HAAR[(h + 2) % 5], zit: true, schaal: 0.74 }), { hoofd: true })));
    }
    koppen.push(medewerker(lager, -1.45, 0.1, -0.2, -0.2, { shirt: K.blauw, huid: 1, haar: 4 }));
    koppen.push(medewerker(lager, 0.95, -0.45, 0.35, -0.0, { huid: 3, haar: 0 }));
    plant(lager, 1.3, PLAAT, 0.25, 0.9);
    // een tapijt onder de banken, en een boekenrek met de klasbib
    blok(lager, 1.9, 0.01, 1.3, 0xffcf3a, -0.1, PLAAT, 0.05, { r: 0.04, schaduw: false });
    blok(lager, 1.74, 0.006, 1.14, 0xfff3c4, -0.1, PLAAT + 0.01, 0.05, { r: 0.03, schaduw: false });
    const rek = aanWand(lager, Math.PI - 1.05, RW - 0.2);
    blok(rek, 0.64, 0.95, 0.3, K.wit, 0, PLAAT, 0, { r: 0.02 });
    const BOEKEN = [K.roos, K.zee, K.geel, K.blad2, K.oranje, K.paneel, K.perzik];
    for (const y of [PLAAT + 0.3, PLAAT + 0.62]) {
      blok(rek, 0.6, 0.03, 0.28, K.hout, 0, y, 0.01, { r: 0.005, schaduw: false });
      BOEKEN.forEach((k, j) => blok(rek, 0.055, 0.2 + (j % 3) * 0.03, 0.2, k, -0.24 + j * 0.08, y + 0.03, 0.03, { r: 0.004, schaduw: false }));
    }
    plant(rek, 0.18, PLAAT + 0.95, 0, 0.5);
  }

  // ── het secundair ──
  const secundair = verdieping('secundair', 3, { wand: K.blauw, vloer: 0xdbe7ea, band: K.zee });
  plek('talent', 'secundair', wandBord(secundair, Math.PI + 0.55, 1.15, 0.72, 768, tekenTalent, { lijst: K.inkt, scherm: true }));
  plek('aiwijs', 'secundair', wandBord(secundair, Math.PI - 0.62, 0.62, 0.8, 384, tekenAiwijs));
  {
    blok(secundair, 1.5, 0.04, 0.5, K.hout, -0.05, PLAAT + 0.42, -0.55, { r: 0.015 });
    for (const x of [-0.7, 0.6]) blok(secundair, 0.04, 0.42, 0.44, K.wit, x, PLAAT, -0.55, { r: 0.01 });
    for (const [x, k, h] of [[-0.45, K.geel, 2], [0.35, K.perzik, 5]]) {
      laptop(secundair, x, PLAAT + 0.46, -0.6, 0, K.inkt);
      stoel(secundair, x, PLAAT, -0.1, Math.PI, K.groen);
      koppen.push(aanTafel(stilFiguur(figuur(secundair, { x, y: PLAAT, z: -0.1, draai: Math.PI, shirt: k, huid: HUID[h], haar: HAAR[h % 5], zit: true }), { hoofd: true })));
    }
    koppen.push(medewerker(secundair, -1.45, 0.2, 0, -0.6, { shirt: K.mint, huid: 4, haar: 2 }));
    koppen.push(medewerker(secundair, 1.1, -0.35, 0.35, -0.6, { huid: 1, haar: 3 }));
    // drie lockers tegen de wand
    const lockers = aanWand(secundair, Math.PI + 1.05, RW - 0.17);
    for (let k = -1; k <= 1; k++) {
      blok(lockers, 0.27, 1.0, 0.3, K.zee, k * 0.285, PLAAT, 0, { r: 0.015 });
      blok(lockers, 0.22, 0.9, 0.02, 0x8fc6dd, k * 0.285, PLAAT + 0.05, 0.15, { r: 0.008, schaduw: false });
      blok(lockers, 0.025, 0.07, 0.025, K.inkt, k * 0.285 + 0.075, PLAAT + 0.48, 0.165, { r: 0.006, schaduw: false });
      for (const y of [PLAAT + 0.8, PLAAT + 0.85]) blok(lockers, 0.14, 0.012, 0.01, 0x4f8fb0, k * 0.285, y, 0.162, { r: 0, schaduw: false });
    }
  }

  // ── beleid en directie ──
  const beleid = verdieping('beleid', 4, { wand: K.mint, vloer: 0xe8e4da, band: K.groen });
  plek('ictcheck', 'beleid', wandBord(beleid, Math.PI + 0.55, 1.2, 0.72, 768, tekenIctcheck, { lijst: K.inkt, scherm: true }));
  plek('leerlijn', 'beleid', wandBord(beleid, Math.PI - 0.55, 0.78, 0.7, 448, tekenLeerlijn));
  {
    const tx = -0.15, tz = -0.45;
    cilinder(beleid, 0.06, 0.1, 0.42, K.wit, tx, PLAAT, tz, { seg: 12 });
    cilinder(beleid, 0.5, 0.5, 0.035, K.hout, tx, PLAAT + 0.42, tz, { seg: 32 });
    const ai = plek('ai', 'beleid', groepje(beleid, tx + 0.05, PLAAT + 0.455, tz + 0.12));
    laptop(ai, 0, 0, 0, 0, K.zee);
    {
      // het scherm van de laptop geeft zelf licht
      const deksel = groepje(ai, 0, 0.145, -0.15);
      deksel.rotation.x = -0.22;
      schermVlak(deksel, 0.36, 0.23, 0xcdeaf3, 0, 0, 0.0085);
    }
    blok(ai, 0.2, 0.1, 0.02, K.geel, 0.16, 0.3, -0.12, { r: 0.04 });
    for (const [x, z, k, h, haar] of [[tx - 0.7, tz + 0.1, K.zee, 0, 1], [tx, tz - 0.72, K.perzik, 3, 3]]) {
      stoel(beleid, x, PLAAT, z, kijkNaar(x, z, tx, tz), K.groen);
      koppen.push(aanTafel(stilFiguur(figuur(beleid, { x, y: PLAAT, z, draai: kijkNaar(x, z, tx, tz), shirt: k, huid: HUID[h], haar: HAAR[haar], zit: true }), { hoofd: true })));
    }
    stoel(beleid, tx + 0.7, PLAAT, tz + 0.05, kijkNaar(tx + 0.7, tz + 0.05, tx, tz), K.groen);
    koppen.push(aanTafel(stilFiguur(figuur(beleid, { x: tx + 0.7, y: PLAAT, z: tz + 0.05, draai: kijkNaar(tx + 0.7, tz + 0.05, tx, tz), shirt: ORANJE, huid: HUID[2], haar: HAAR[0], zit: true }), { hoofd: true })));
    // planlast: een stapel papier die één formulier wordt
    const [px, pz] = boog(Math.PI - 1.18, 1.5);
    const kast = plek('planlast', 'beleid', groepje(beleid, px, PLAAT, pz));
    kast.rotation.y = Math.PI - 1.18 + Math.PI;
    blok(kast, 0.5, 0.46, 0.34, K.wit, 0, 0, 0, { r: 0.02 });
    for (let i = 0; i < 6; i++) blok(kast, 0.3, 0.028, 0.22, i === 5 ? K.mint : 0xfdfdf8, -0.06 + (r() - 0.5) * 0.04, 0.46 + i * 0.03, 0, { r: 0.005 }).rotation.y = (r() - 0.5) * 0.3;
    blok(kast, 0.2, 0.012, 0.27, K.geel, 0.16, 0.46, 0.02, { r: 0.004 });
    // een rond tapijt onder de vergadertafel, en een kast met mappen
    cilinder(beleid, 1.0, 1.0, 0.01, 0xd3e6d9, tx, PLAAT, tz, { seg: 40, schaduw: false });
    const mappen = aanWand(beleid, Math.PI + 1.1, RW - 0.2);
    blok(mappen, 0.58, 0.9, 0.3, K.wit, 0, PLAAT, 0, { r: 0.02 });
    const MAPPEN = [K.groen, K.mint, K.geel, K.blauw, K.perzik, K.zee];
    for (const y of [PLAAT + 0.28, PLAAT + 0.58]) {
      blok(mappen, 0.54, 0.03, 0.28, K.hout, 0, y, 0.01, { r: 0.005, schaduw: false });
      MAPPEN.forEach((k, j) => blok(mappen, 0.06, 0.25, 0.2, k, -0.2 + j * 0.08, y + 0.03, 0.03, { r: 0.005, schaduw: false }));
    }
    blok(mappen, 0.26, 0.14, 0.2, K.mint, -0.1, PLAAT + 0.9, 0, { r: 0.02 });
  }

  // ── de neus: de lading ──
  const neus = groepje(raket, 0, TOP, 0);
  cilinder(neus, R, R, 0.1, K.wit, 0, 0, 0, { seg: 40, schaduw: false });
  cilinder(neus, R + 0.012, R + 0.012, 0.16, K.groen, 0, 0, 0, { seg: 40, schaduw: false });
  cilinder(neus, R * 0.66, R, 1.25, K.wit, 0, 0.16, 0, { seg: 40, schaduw: false });
  cilinder(neus, 0.08, R * 0.66, 1.36, K.wit, 0, 1.41, 0, { seg: 40, schaduw: false });
  cilinder(neus, 0.035, 0.08, 0.2, K.groen, 0, 2.77, 0, { seg: 12, schaduw: false });
  cilinder(neus, 0.012, 0.012, 0.42, K.inkt, 0, 2.95, 0, { seg: 6, schaduw: false });
  const neusLicht = levend(bol(neus, 0.045, 0, 0, 3.4, 0, { materiaal: new T.MeshBasicMaterial({ color: 0xff5a4f }), seg: 10, schaduw: false }));
  {
    // Panelen, naden en klinknagels op de neus, en een luik voor de lading.
    // Beide delen zijn kegels: opNeus legt een groepje plat op de helling.
    const H1 = Math.atan((R - R * 0.66) / 1.25), L1 = Math.hypot(R - R * 0.66, 1.25);
    const H2 = Math.atan((R * 0.66 - 0.08) / 1.36), L2 = Math.hypot(R * 0.66 - 0.08, 1.36);
    const straalOp = y => (y < 1.41 ? R - (y - 0.16) * (R - R * 0.66) / 1.25 : R * 0.66 - (y - 1.41) * (R * 0.66 - 0.08) / 1.36);
    function opNeus(hoek, y, helling, uit = 0) {
      const [x, z] = boog(hoek, straalOp(y) + uit);
      const w = groepje(neus, x, y, z);
      w.rotation.y = hoek;
      const s = groepje(w);
      s.rotation.x = -helling;
      return s;
    }
    for (let k = 0; k < 8; k++) {
      // onderaan tussen de naden blijft het kompas vrij; bovenaan lopen ze door tot bij de punt
      blok(opNeus(Math.PI / 8 + k * Math.PI / 4, 0.785, H1, 0.004), 0.024, L1 - 0.16, 0.012, NAAD, 0, -(L1 - 0.16) / 2, 0, { r: 0, schaduw: false });
      blok(opNeus(k * Math.PI / 4, 1.94, H2, 0.004), 0.022, L2 * 0.62, 0.012, NAAD, 0, -L2 * 0.31, 0, { r: 0, schaduw: false });
    }
    // de naad tussen de twee kegels, met een rij klinknagels erboven en eronder
    const ring = new T.Mesh(new T.TorusGeometry(R * 0.66 + 0.006, 0.026, 6, 64), mat(NAAD));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.41;
    zet(neus, ring, false);
    for (const [y, n] of [[0.26, 56], [1.33, 40], [1.49, 36]]) for (let k = 0; k < n; k++) {
      const [x, z] = boog((k + 0.5) / n * Math.PI * 2, straalOp(y) + 0.006);
      nagel(neus, x, y, z, NAAD, 0.018);
    }
    // de stuurraketjes: een blokje met twee mondjes, voor en achter (zie stootjes)
    for (const kant of [-1, 1]) {
      const rcs = opNeus(kant * Math.PI / 2, 0.5, H1, 0.004);
      blok(rcs, 0.16, 0.2, 0.08, K.grijs, 0, -0.1, 0.03, { r: 0.025, schaduw: false });
      for (const z of [-1, 1]) {
        const mond = cilinder(rcs, 0.022, 0.04, 0.07, 0x6b7480, 0, 0, 0, { seg: 10, schaduw: false });
        mond.rotation.z = z * Math.PI / 2;
        mond.position.set(z * 0.11, 0, 0.06);
      }
    }
    // het luik van de laadruimte, rechts van het kompas
    const luik = opNeus(0.9, 0.7, H1, 0.006);
    blok(luik, 0.5, 0.6, 0.014, NAAD, 0, -0.3, 0, { r: 0.06, schaduw: false });
    blok(luik, 0.44, 0.54, 0.02, K.wit, 0, -0.27, 0.002, { r: 0.05, schaduw: false });
    blok(luik, 0.05, 0.2, 0.04, K.groen, 0.14, -0.1, 0.012, { r: 0.02, schaduw: false });
    for (const [x, y] of [[-0.18, -0.23], [0.18, -0.23], [-0.18, 0.23], [0.18, 0.23]]) nagel(luik, x, y, 0.014);
  }
  {
    const helling = Math.atan((R - R * 0.66) / 1.25);
    const venster = plek('kompas', 'neus', groepje(neus, 0, 0.78, 1.66));
    venster.rotation.x = -helling;
    const ring = new T.Mesh(new T.TorusGeometry(0.44, 0.07, 10, 36), mat(K.groen));
    zet(venster, ring, false);
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
    const schijf = new T.Mesh(new T.CircleGeometry(0.42, 40), new T.MeshBasicMaterial({ map: tex }));
    schijf.position.z = 0.01;
    venster.add(schijf);
    statischeTekening({ mesh: schijf, c, ctx: c.getContext('2d'), tex }, tekenKompas);
  }
  {
    const raak = new T.Mesh(new T.CylinderGeometry(0.4, R, NEUS, 16), new T.MeshBasicMaterial({ visible: false }));
    raak.position.y = NEUS / 2;
    raak.userData.kamer = 'neus';
    neus.add(levend(raak));
    kamers.neus = { groep: neus, raak };
  }

  // ── de toren: vorming en ondersteuning ──
  const toren = groepje(wereld, TOREN.x, 0, TOREN.z);
  const TH = TOP + 0.2, HB = 0.55;
  const niveaus = [0, ...NIVEAUS.map((_, i) => BASIS + i * VH), TOP];
  for (const [x, z] of [[-HB, -HB], [HB, -HB], [-HB, HB], [HB, HB]]) blok(toren, 0.09, TH, 0.09, K.groen, x, 0, z, { r: 0.02 });
  for (const y of niveaus.slice(1)) {
    for (const z of [-HB, HB]) blok(toren, 2 * HB + 0.09, 0.07, 0.07, K.groen, 0, y - 0.035, z, { r: 0.015 });
    for (const x of [-HB, HB]) blok(toren, 0.07, 0.07, 2 * HB + 0.09, K.groen, x, y - 0.035, 0, { r: 0.015 });
    blok(toren, 2 * HB, 0.04, 0.44, K.grijs, 0, y - 0.04, HB - 0.24, { r: 0.01, schaduw: false });
  }
  // Een betonnen voet, kruisverbanden op de kant naar de raket, en drie
  // leidingen in de kleuren van de huisstijl langs de achterste staander.
  blok(toren, 2 * HB + 0.5, 0.1, 2 * HB + 0.5, 0xd9d4c8, 0, 0, 0, { r: 0.03, schaduw: false });
  for (let i = 0; i < niveaus.length - 1; i++) {
    const ya = niveaus[i], yb = niveaus[i + 1], dy = yb - ya;
    for (const t of [-1, 1]) {
      const kruis = blok(toren, 0.035, 0.035, Math.hypot(2 * HB, dy), K.groenDonker, 0, 0, 0, { r: 0, schaduw: false });
      kruis.position.set(HB + 0.005, (ya + yb) / 2 - 0.0175, 0);
      kruis.rotation.x = t * Math.atan2(dy, 2 * HB);
    }
  }
  const LEIDINGEN = [[K.mint], [K.geel], [K.zee]];
  const topArm = BASIS + (NIVEAUS.length - 1) * VH + 0.95;
  LEIDINGEN.forEach(([kleur], j) => cilinder(toren, 0.032, 0.032, topArm - 0.1, kleur, HB + 0.075, 0.1, -HB + 0.1 + j * 0.085, { seg: 10, schaduw: false }));
  for (let y = 0.6; y < topArm; y += 0.95) blok(toren, 0.08, 0.05, 0.3, 0x6b7480, HB + 0.075, y, -HB + 0.185, { r: 0, schaduw: false });
  // De onderste trappen zijn de plek: zo staat haar speld ook in het beeld van het platform.
  const vorming = plek('vorming', 'platform', groepje(toren));
  for (let i = 0; i < niveaus.length - 1; i++) {
    const ya = niveaus[i], yb = niveaus[i + 1], dy = yb - ya, lengte = Math.hypot(2 * HB - 0.2, dy);
    const kant = i % 2 ? -1 : 1;
    // een trap per verdieping, beurtelings naar links en naar rechts
    const trappen = i < 2 ? vorming : toren;
    const trap = blok(trappen, lengte, 0.05, 0.34, K.mint, 0, 0, HB - 0.24, { r: 0.012 });
    trap.position.y = (ya + yb) / 2;
    trap.rotation.z = kant * Math.atan2(dy, 2 * HB - 0.2);
    const leuning = blok(trappen, lengte, 0.025, 0.025, K.groenDonker, 0, 0, HB - 0.06, { r: 0.008, schaduw: false });
    leuning.position.y = (ya + yb) / 2 + 0.3;
    leuning.rotation.z = trap.rotation.z;
    // kruisverbanden aan de zijkant
    for (const t of [-1, 1]) {
      const kruis = blok(toren, 0.035, 0.035, Math.hypot(2 * HB, dy), K.groenDonker, -HB - 0.005, 0, 0, { r: 0.008, schaduw: false });
      kruis.position.y = (ya + yb) / 2;
      kruis.rotation.x = t * Math.atan2(dy, 2 * HB);
    }
  }
  // de armen naar de raket, met de leidingen die de diensten aanvoeren. Ze
  // draaien samen weg rond de rand van de toren vlak voor de lancering.
  const tot = Math.hypot(TOREN.x, TOREN.z - RZ) - R;
  const armen = levend(groepje(toren, HB, 0, 0));
  const slang = (ouder, punten, dik, kleur) => {
    // een slang uit korte buisjes langs een reeks punten
    for (let j = 0; j < punten.length - 1; j++) {
      const a = punten[j], b = punten[j + 1], d = new T.Vector3().subVectors(b, a);
      const m = new T.Mesh(new T.CylinderGeometry(dik, dik, d.length() + dik * 0.6, 8), mat(kleur));
      m.position.addVectors(a, b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
      zet(ouder, m, false);
    }
  };
  NIVEAUS.forEach((_, i) => {
    const y = BASIS + i * VH + 0.95, lengte = tot - HB;
    // een vakwerkarm: twee liggers met schuine stijlen ertussen
    blok(armen, lengte + 0.05, 0.07, 0.16, K.groen, lengte / 2, y, 0, { r: 0.02 });
    blok(armen, lengte - 0.1, 0.05, 0.12, K.groen, lengte / 2 - 0.05, y - 0.26, 0, { r: 0.015, schaduw: false });
    for (let k = 0; k < 4; k++) {
      const st = blok(armen, 0.035, 0.3, 0.035, K.groenDonker, 0, 0, 0, { r: 0, schaduw: false });
      st.position.set(0.12 + k * 0.22, y - 0.105, 0.05);
      st.rotation.z = k % 2 ? 0.6 : -0.6;
    }
    blok(armen, lengte, 0.07, 0.07, K.mint, lengte / 2, y - 0.1, 0.1, { r: 0.03, schaduw: false });
    blok(armen, 0.1, 0.24, 0.26, K.grijs, lengte - 0.02, y - 0.12, 0, { r: 0.02 });
    // de navelstreng: een slang die doorhangt van de arm naar de romp, met een stekker
    const P = (x, yy, z) => new T.Vector3(x, yy, z);
    const punten = [];
    for (let k = 0; k <= 7; k++) {
      const t = k / 7, x = (lengte - 0.55) + t * 0.6, zak = Math.sin(t * Math.PI) * 0.32;
      punten.push(P(x, y - 0.13 - t * 0.25 - zak, 0.1 + t * 0.02));
    }
    slang(armen, punten, 0.032, K.geel);
    blok(armen, 0.06, 0.12, 0.12, K.groen, lengte + 0.02, y - 0.44, 0.06, { r: 0.02, schaduw: false });
  });
  // bovenop: een rooster en een mast met het rode licht in de top
  blok(toren, 2 * HB + 0.14, 0.05, 2 * HB + 0.14, K.groenDonker, 0, TH, 0, { r: 0.015, schaduw: false });
  cilinder(toren, 0.016, 0.03, 0.8, K.groenDonker, HB - 0.05, TH + 0.05, -HB + 0.05, { seg: 8, schaduw: false });
  const torenLicht = levend(bol(toren, 0.05, 0, HB - 0.05, TH + 0.9, -HB + 0.05, { materiaal: new T.MeshBasicMaterial({ color: 0xff5a4f }), seg: 10, schaduw: false }));
  gloed(toren, HB - 0.05, TH + 0.9, -HB + 0.05, 0.8);
  // de lift: wie wil, gaat een verdieping hoger
  const lift = levend(groepje(toren, -HB - 0.3, 0.02, 0));
  blok(lift, 0.48, 0.05, 0.48, K.geel, 0, 0, 0, { r: 0.015 });
  blok(lift, 0.5, 0.04, 0.5, K.geel, 0, 1.02, 0, { r: 0.015 });
  for (const [x, z] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) blok(lift, 0.03, 1.0, 0.03, K.inkt, x, 0.04, z, { r: 0, schaduw: false });
  stilFiguur(figuur(lift, { x: 0, y: 0.05, z: 0.02, draai: 0.6, shirt: K.blauw, huid: HUID[1], haar: HAAR[2], schaal: 0.85 }));

  // ── de helpdesk aan de voet van de toren ──
  const helpdesk = plek('helpdesk', 'platform', groepje(wereld, HELPDESK.x, 0, HELPDESK.z));
  helpdesk.rotation.y = 0.35;
  blok(helpdesk, 1.25, 0.06, 0.9, K.steen, 0, 0, 0, { r: 0.02 });
  blok(helpdesk, 1.25, 0.96, 0.08, K.wit, 0, 0.06, -0.41, { r: 0.015 });
  for (const x of [-0.585, 0.585]) blok(helpdesk, 0.08, 0.96, 0.9, K.wit, x, 0.06, 0, { r: 0.015 });
  blok(helpdesk, 1.08, 0.42, 0.16, K.groen, 0, 0.06, 0.3, { r: 0.02 });
  blok(helpdesk, 1.12, 0.04, 0.24, K.hout, 0, 0.48, 0.3, { r: 0.01 });
  blok(helpdesk, 1.4, 0.08, 1.05, K.groen, 0, 1.02, 0, { r: 0.02 });
  blok(helpdesk, 1.2, 0.3, 0.04, K.groenDonker, 0, 1.1, 0.5, { r: 0.012 });
  statischeTekening(paneel(helpdesk, 1.16, 0.27, 512, 0, 1.25, 0.525), tekenHelpdesk);
  stilFiguur(figuur(helpdesk, { x: 0, y: 0.06, z: -0.05, draai: 0, shirt: K.groen, huid: HUID[4], haar: HAAR[1] }), { hoofd: true });
  laptop(helpdesk, -0.3, 0.52, 0.28, Math.PI + 0.2);

  // ── de vluchtleiding van Team ICT ──
  let leidingScherm = null;
  const leiding = plek('vluchtleiding', 'platform', groepje(wereld, LEIDING.x, 0, LEIDING.z));
  leiding.rotation.y = LEIDING.draai;
  {
    const { b, d, h } = LEIDING;
    blok(leiding, b, 0.1, d, K.wit, 0, 0, 0, { r: 0.02, schaduw: false });
    blok(leiding, b - 0.2, 0.01, d - 0.2, 0xe6e9ec, 0, 0.1, -0.02, { r: 0, schaduw: false });
    blok(leiding, b, h, 0.1, K.muur, 0, 0.1, -d / 2 + 0.05, { r: 0.01, schaduw: false });
    blok(leiding, b - 0.2, h - 0.05, 0.01, K.mintLicht, 0, 0.1, -d / 2 + 0.105, { r: 0, schaduw: false });
    for (const x of [-b / 2 + 0.05, b / 2 - 0.05]) blok(leiding, 0.1, h, d, K.muur, x, 0.1, 0, { r: 0.01, schaduw: false });
    blok(leiding, b + 0.12, 0.1, d + 0.12, K.groen, 0, h + 0.1, 0, { r: 0.02 });
    blok(leiding, 1.5, 0.3, 0.04, K.wit, 0, h + 0.2, d / 2 + 0.06, { r: 0.012 });
    statischeTekening(paneel(leiding, 1.44, 0.26, 640, 0, h + 0.35, d / 2 + 0.085), tekenLeidingBord);
    blok(leiding, 1.86, 0.74, 0.04, K.inkt, 0, 0.42, -d / 2 + 0.12, { r: 0.015 });
    schermHalo(leiding, 1.78, 0.66, 0.79, -d / 2 + 0.15);
    leidingScherm = statischeTekening(paneel(leiding, 1.78, 0.66, 768, 0, 0.79, -d / 2 + 0.145, { scherm: true }), p => tekenLeidingScherm(p, regie));
    // een gebogen tafel met vier schermen en Team ICT erachter
    for (let k = 0; k < 4; k++) {
      const x = -0.84 + k * 0.56, z = 0.05 + Math.abs(x) * 0.18;
      const tafel = groepje(leiding, x, 0.1, z);
      tafel.rotation.y = -x * 0.25;
      blok(tafel, 0.54, 0.04, 0.32, K.hout, 0, 0.4, 0, { r: 0.012 });
      blok(tafel, 0.5, 0.4, 0.04, K.wit, 0, 0, -0.12, { r: 0.01 });
      blok(tafel, 0.3, 0.2, 0.02, K.inkt, 0, 0.46, -0.08, { r: 0.008 });
      schermVlak(tafel, 0.27, 0.17, [K.blauw, K.mint, K.geel, K.perzik][k], 0, 0.56, -0.0685);
      stoel(tafel, 0, 0, 0.36, Math.PI, K.inkt);
      koppen.push(stilFiguur(figuur(tafel, { x: 0, y: 0, z: 0.36, draai: Math.PI, shirt: TEAM[k], huid: HUID[[0, 1, 4, 2][k]], haar: HAAR[[3, 1, 0, 2][k]], zit: true }), { hoofd: true }));
    }
  }
  // De schotel staat op het dak, maar hoort niet bij de plek: anders zweeft de speld te hoog.
  const leidingDak = groepje(wereld, LEIDING.x, 0, LEIDING.z);
  leidingDak.rotation.y = LEIDING.draai;
  const schotel = levend(groepje(leidingDak, 0.75, LEIDING.h + 0.2, -0.3));
  cilinder(schotel, 0.04, 0.06, 0.3, K.grijs, 0, 0, 0, { seg: 8 });
  const kom = groepje(schotel, 0, 0.36, 0);
  kom.rotation.x = -0.6;
  cilinder(kom, 0.3, 0.06, 0.1, K.wit, 0, 0, 0, { seg: 20 });
  cilinder(kom, 0.012, 0.012, 0.28, K.inkt, 0, 0.08, 0, { seg: 6, schaduw: false });

  // ── buiten: de grondploeg, een wandelaar, bomen, wolken en vogels ──
  const buiten = groepje(wereld);
  const grondploeg = plek('grondploeg', 'platform', groepje(buiten));
  const ploeg = [
    figuur(grondploeg, { x: 2.0, y: 0, z: 1.55, draai: kijkNaar(2.0, 1.55, 0, RZ), shirt: ORANJE, huid: HUID[3], haar: HAAR[0] }),
    figuur(grondploeg, { x: 2.5, y: 0, z: 1.2, draai: kijkNaar(2.5, 1.2, 0, RZ), shirt: ORANJE, huid: HUID[0], haar: HAAR[4] }),
  ];
  stilFiguur(ploeg[0], { hoofd: true });
  blok(ploeg[0], 0.2, 0.14, 0.02, K.inkt, 0, 0.5, 0.17, { r: 0.01 }).rotation.x = -0.5;
  ploeg[0].userData.armen[0].rotation.x = -0.9;
  ploeg[0].userData.armen[1].rotation.x = -0.9;
  for (const b of ploeg[1].userData.benen) b.userData.levend = false;
  // een collega op weg naar de helpdesk; klik erop en ze zwaait
  const wandelaar = speel(figuur(buiten, { x: 0, y: 0, z: 2.6, draai: 0, shirt: K.blauw, huid: HUID[1], haar: HAAR[2] }), s => { s.t = tijd(); });
  blok(wandelaar, 0.3, 0.02, 0.22, K.grijs, 0.14, 0.42, 0.06, { r: 0.008 }).rotation.z = -1.2;
  const bomen = [
    boom(buiten, -5.85, -4.4, 1.15, [K.blad2, K.blad1, K.blad3]),
    boom(buiten, 5.95, -4.45, 1.0, [K.blad3, K.blad2, K.blad1]),
    boom(buiten, -5.95, 2.6, 0.85, [K.blad2, K.blad1]),
    boom(buiten, 6.0, 2.95, 0.8, [K.blad1, K.blad2]),
    boom(buiten, 2.4, -4.8, 0.75, [K.blad2, K.blad3]),
  ].map(b => speel(b, s => { s.t = tijd(); }));
  for (const [x, z] of [[-1.35, 3.15], [1.45, 3.15]]) {
    const l = groepje(buiten, x, 0, z);
    cilinder(l, 0.028, 0.035, 1.15, K.groenDonker, 0, 0, 0, { seg: 10 });
    blok(l, 0.16, 0.07, 0.16, K.groenDonker, 0, 1.25, 0, { r: 0.02 });
    bol(l, 0.055, 0, 0, 1.2, 0, { materiaal: g.lampMat, schaduw: false, seg: 10 });
    gloed(l, 0, 1.19, 0, 0.9);
  }
  for (const [x, z, s] of [[-4.6, 2.9, 1], [5.1, -0.1, 0.9], [-5.4, -1.2, 1.1]]) kruin(buiten, 0.26 * s, K.blad2, x, 0.18 * s, z);
  // Een veiligheidshek rond het platform. Vooraan blijft het open (de paden en de
  // grondploeg), en bij de drie vinnen staat geen paaltje.
  {
    const vinHoeken = [Math.PI / 2 + 0.35, Math.PI * 1.5 - 0.35, Math.PI];
    const vrij = a => a < 1.5 || a > Math.PI * 2 - 0.5 || vinHoeken.some(v => Math.abs(a - v) < 0.24);
    const N = 26;
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2, b = (i + 1) / N * Math.PI * 2;
      if (vrij(a)) continue;
      const [x, z] = boog(a, 2.95);
      blok(platform, 0.05, 0.36, 0.05, K.groenDonker, x, 0.12, RZ + z, { r: 0.01, schaduw: false });
      if (vrij(b % (Math.PI * 2))) continue;
      const m = (a + b) / 2, [mx, mz] = boog(m, 2.95);
      blok(platform, 0.74, 0.035, 0.035, K.geel, mx, 0.42, RZ + mz, { r: 0.01, schaduw: false }).rotation.y = m;
      blok(platform, 0.74, 0.025, 0.025, K.groenDonker, mx, 0.26, RZ + mz, { r: 0.008, schaduw: false }).rotation.y = m;
    }
  }
  // bloemen: een pol groen met drie bloemetjes erop
  const bloemGeo = new T.IcosahedronGeometry(0.038, 0);
  for (const [x, z, s] of [[-1.72, 3.32, 1], [1.78, 3.3, 0.9], [-2.75, 2.05, 0.8], [3.25, 2.1, 1], [-5.6, -3.55, 0.9], [4.9, 1.0, 0.7], [-4.2, 3.25, 0.8]]) {
    kruin(buiten, 0.14 * s, K.blad1, x, 0.1 * s, z);
    [[K.roos, -0.07, 0.02], [K.geel, 0.05, -0.05], [K.wit, 0.02, 0.07]].forEach(([k, dx, dz]) => {
      const b = new T.Mesh(bloemGeo, mat(k));
      b.position.set(x + dx * s, 0.22 * s, z + dz * s);
      b.scale.setScalar(s);
      zet(buiten, b, false);
    });
  }
  // het busje van Team ICT, geparkeerd bij de vluchtleiding
  {
    const bus = groepje(buiten, 4.0, 0, 3.0);
    bus.rotation.y = 0.28;
    blok(bus, 1.2, 0.46, 0.62, K.wit, 0, 0.16, 0, { r: 0.06 });
    blok(bus, 1.22, 0.1, 0.64, K.groen, 0, 0.3, 0, { r: 0.03 });
    blok(bus, 0.92, 0.3, 0.6, K.wit, -0.12, 0.62, 0, { r: 0.06 });
    blok(bus, 0.26, 0.24, 0.5, K.blauw, 0.5, 0.42, 0, { r: 0.04, schaduw: false });
    for (const kz of [-1, 1]) blok(bus, 0.5, 0.18, 0.02, K.blauw, -0.1, 0.68, kz * 0.3, { r: 0.03, schaduw: false });
    for (const kz of [-1, 1]) blok(bus, 0.06, 0.06, 0.03, K.geel, 0.6, 0.3, kz * 0.22, { r: 0.015, schaduw: false });
    for (const kx of [-0.38, 0.36]) for (const kz of [-1, 1]) {
      const wiel = cilinder(bus, 0.1, 0.1, 0.08, K.inkt, kx, 0.06, kz * 0.3, { seg: 14 });
      wiel.rotation.x = Math.PI / 2;
    }
    blok(bus, 0.32, 0.08, 0.5, K.mint, -0.12, 0.92, 0, { r: 0.02, schaduw: false });
  }
  // een windzak op een mast, die wappert
  const windzak = (() => {
    const paal = groepje(buiten, 5.6, 0, -2.4);
    cilinder(paal, 0.022, 0.03, 1.75, K.grijs, 0, 0, 0, { seg: 8 });
    blok(paal, 0.3, 0.03, 0.3, K.steen, 0, 0, 0, { r: 0.01, schaduw: false });
    const zak = levend(groepje(paal, 0, 1.68, 0));
    const kegel = new T.Mesh(new T.ConeGeometry(0.085, 0.6, 10, 1, true), mat(K.oranje));
    kegel.rotation.z = -Math.PI / 2;
    kegel.position.x = 0.3;
    zet(zak, kegel, false);
    return zak;
  })();
  // grassprietjes in één tekenbeurt
  {
    const spriet = new T.ConeGeometry(0.035, 0.13, 5);
    spriet.translate(0, 0.065, 0);
    const n = 70;
    const gras = levend(new T.InstancedMesh(spriet, new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), n));
    const m = new T.Matrix4(), kleur = new T.Color();
    let i = 0;
    while (i < n) {
      const x = (r() - 0.5) * 12.4, z = -5.0 + r() * 8.2;
      const opPlatform = Math.hypot(x, z - RZ) < 3.2;
      const opToren = Math.abs(x - TOREN.x) < 0.9 && Math.abs(z - TOREN.z) < 0.9;
      const opHelpdesk = Math.hypot(x - HELPDESK.x, z - HELPDESK.z) < 1.0;
      const opLeiding = Math.hypot(x - LEIDING.x, z - LEIDING.z) < 1.7;
      const opPad = x > -2.8 && x < 0.6 && z > 1.0 && z < 3.5 && Math.abs((z - 3.2) / 1.95 * 2.75 + 0.2 - x) < 0.45;
      if (opPlatform || opToren || opHelpdesk || opLeiding || opPad) continue;
      const s = 0.7 + r() * 0.8;
      m.makeScale(s, s, s).setPosition(x, 0, z);
      gras.setMatrixAt(i, m);
      gras.setColorAt(i, kleur.setHex([K.blad1, K.blad2, 0xa6d3b0][i % 3]));
      i++;
    }
    gras.receiveShadow = true;
    buiten.add(gras);
  }
  // Lichtplassen op de grond, 's avonds: onder de lantaarns, voor de helpdesk en
  // voor de open vluchtleiding. Eén vorm met één zachte textuur: één tekenbeurt.
  const lichtTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    return tex;
  })();
  const plassen = (() => {
    const vormen = [[-1.35, 3.0, 1.4, 1.1], [1.45, 3.0, 1.4, 1.1], [-2.96, 1.45, 1.7, 1.1], [4.3, 1.8, 2.6, 1.3]].map(([x, z, b, d]) => {
      const v = new T.PlaneGeometry(b, d); v.rotateX(-Math.PI / 2); v.translate(x, 0.045, z); return v;
    });
    const m = levend(new T.Mesh(T.mergeGeometries(vormen), new T.MeshBasicMaterial({ map: lichtTex, color: 0xffd496, transparent: true, depthWrite: false, blending: 2, opacity: 0 })));
    m.visible = false; m.raycast = () => {};
    wereld.add(m);
    return m;
  })();
  // Een plas lamplicht op elke vloer, warm in de kamers en mint in de motor: één
  // vorm voor de hele raket (een kleur per hoekpunt), dus één tekenbeurt. Ze hangt
  // aan de raket en vliegt mee.
  const vloerLicht = (() => {
    const vormen = NIVEAUS.map((naam, i) => {
      const v = new T.CircleGeometry(1.45, 32);
      v.rotateX(-Math.PI / 2);
      v.translate(0, BASIS + i * VH + PLAAT + 0.03, 0.3);  // 0,03: ook boven het matje van de kleuters
      return kleurVorm(v, i === 0 ? 0x6fe0b0 : 0xffbf73);
    });
    const m = levend(new T.Mesh(T.mergeGeometries(vormen), new T.MeshBasicMaterial({ map: lichtTex, vertexColors: true, transparent: true, depthWrite: false, blending: 2, opacity: 0 })));
    m.visible = false; m.raycast = () => {};
    raket.add(m);
    return m;
  })();
  // wolken en vogels
  const wolkMat = new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  function maakWolk(y, z, s, start) {
    const w = levend(groepje(wereld, 0, y, z));
    for (const [x, yy, zz, rr] of [[0, 0, 0, 0.42], [-0.45, -0.1, 0.05, 0.3], [0.45, -0.08, 0, 0.33], [0.15, 0.2, 0.1, 0.28]]) {
      const b = new T.Mesh(new T.IcosahedronGeometry(rr * s, 1), wolkMat);
      b.position.set(x * s, yy * s, zz * s);
      w.add(b);
    }
    w.userData.start = start;
    return w;
  }
  const wolken = [[8.2, -5.0, 1.0, 0], [6.4, -5.6, 0.75, 0.4], [10.6, -4.8, 0.7, 0.72]].map(a => maakWolk(...a));
  const vogels = [0, 1, 2].map(i => {
    const v = levend(groepje(wereld));
    blok(v, 0.05, 0.04, 0.12, K.inkt, 0, 0, 0, { r: 0.015, schaduw: false });
    v.userData.vleugels = [-1, 1].map(kant => {
      const vl = groepje(v, kant * 0.02, 0.01, 0);
      blok(vl, 0.16, 0.012, 0.07, K.inkt, kant * 0.08, 0, 0, { r: 0.005, schaduw: false });
      return vl;
    });
    v.userData.fase = i * 2.1;
    return v;
  });
  // vonken bij de ontsteking: kleine gloeiende bolletjes die over het platform spatten
  const vonkMat = new T.MeshBasicMaterial({ color: 0xffe08a });
  const vonken = Array.from({ length: 14 }, (_, i) => {
    const b = levend(bol(wereld, 0.055, 0, 0, 0, 0, { materiaal: vonkMat, seg: 6, schaduw: false }));
    b.visible = false;
    b.raycast = () => {};
    b.userData.fase = (i * 0.618) % 1;
    b.userData.hoek = i * 2.1;
    return b;
  });
  // damp aan de voet van de raket
  const damp = Array.from({ length: 6 }, (_, i) => {
    const b = levend(bol(wereld, 0.22, 0, 0, 0, 0, { materiaal: new T.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }), seg: 10, schaduw: false }));
    b.userData.fase = i / 6;
    b.userData.hoek = i * 2.4;
    return b;
  });

  // ── de go/no-go-ronde en de lancering ──
  // De pagina start de ronde met lancering(); de tijdlijn loopt hier, op de tijd
  // van het tafereel, zodat ze mee pauzeert als het canvas uit beeld is. Bij elke
  // stap roept de scène melding(soort, gegevens) op; de pagina stuurt daarop de
  // camera en het paneel. Zo blijft de motor in gedeeld/ onaangeroerd.
  const regie = {
    fase: 'rust', t: 0, stations: [], index: -1, stap: 'vraag', volgende: 0,
    storing: null, melding: null, toestand: {}, tel: null, gemeld: new Set(),
    hoogte: 0, snelheid: 0, armen: 0, vuur: 0, rook: 0,
    // in de ruimte: hoe gewichtloos (0-1), hoe ver de raket bijgedraaid is, hoe
    // ver de zon op is (0-1) en hoe ver het signaal naar de scholen is (0-1)
    zweef: 0, rol: 0, zon: 0, signaal: 0,
  };
  const meld = (soort, gegevens = {}) => regie.melding?.(soort, gegevens);
  const tekenScherm = () => { if (!leidingScherm) return; tekenLeidingScherm(leidingScherm, regie); leidingScherm.tex.needsUpdate = true; };

  // Bordjes met GO of NO-GO bij elk station. Twee gedeelde texturen.
  function bordjeTex(tekst, kleur, { bovenop = false } = {}) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 112;
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    statischeTekening({ c, ctx: c.getContext('2d'), tex }, ({ ctx }) => {
      ctx.clearRect(0, 0, 256, 112);
      rond(ctx, 8, 8, 240, 96, 48); ctx.fillStyle = kleur; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = F(700, 60); ctx.textAlign = 'center'; ctx.fillText(tekst, 128, 77); ctx.textAlign = 'left';
    });
    return new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: !bovenop });
  }
  // NO-GO tekent bovenop alles: het verschijnt alleen bij de kast waar de camera
  // op inzoomt, en mag niet half achter een wand of een buurkast vallen.
  const goMat = bordjeTex('GO', '#126425'), nogoMat = bordjeTex('NO-GO', '#b3261e', { bovenop: true });
  const bordGeo = new T.PlaneGeometry(0.5, 0.22);
  const bordjes = {};
  function bordje(id, ouder, x, y, z, draai, schaal = 1) {
    const m = levend(new T.Mesh(bordGeo, goMat));
    m.position.set(x, y, z);
    m.rotation.y = draai;
    m.visible = false;
    m.renderOrder = 2;
    ouder.add(m);
    bordjes[id] = { m, schaal, aan: false, sinds: -10, k: 0 };
  }
  // De raket staat op DRAAI; het overzicht kijkt op 0,31. Bordjes in de raket
  // kijken naar de camera van de kamer, bordjes buiten naar die van het overzicht.
  // In de motor hangt elk bordje op de voorkant van zijn eigen kast, net voor de
  // hoek die het dichtst bij de camera staat. Bij de vier middelste bovenaan, bij
  // de twee buitenste onderaan: die staan maar 0,3 opzij van hun buur, en zo
  // overlappen hun bordjes niet. Het scherm met de naam blijft vrij.
  DIENSTEN.forEach((d, k) => {
    const hoek = Math.PI + KAST_HOEKEN[k];
    const [x, z] = boog(hoek, RW - 0.39);
    const buiten = k === 0 || k === 5;
    bordje(d.id, motor, x, PLAAT + (buiten ? 0.36 : 0.93), z + Math.abs(Math.sin(hoek)) * 0.22 + 0.06, 0, 0.9);
  });
  [kleuter, lager, secundair, beleid].forEach((v, i) => bordje(NIVEAUS[i + 1], v, 0, VH - 0.5, 1.0, 0, 1.5));
  bordje('lading', neus, 0, 1.5, 1.42, 0.31 - DRAAI, 1.4);
  // Het platform staat in zijn geheel in beeld: daar zijn de bordjes groter.
  bordje('grondploeg', buiten, 2.25, 1.4, 1.4, 0.31, 1.7);
  bordje('helpdesk', buiten, HELPDESK.x + 0.1, 1.85, HELPDESK.z + 0.45, 0.31, 1.7);
  bordje('vorming', toren, 0.1, 2.7, HB + 0.2, 0.31, 1.7);

  function zetBordje(id, toestand) {
    const b = bordjes[id];
    if (!b) return;
    b.m.material = toestand === 'nogo' ? nogoMat : goMat;
    b.m.renderOrder = toestand === 'nogo' ? 3 : 2;
    b.aan = true;
    b.sinds = tijd();
    if (g.stil) { b.m.visible = true; b.m.scale.setScalar(b.schaal * bordjeMaat()); }
  }
  // Op een smal scherm een maat groter, anders lees je GO niet meer.
  const bordjeMaat = () => (canvas.clientWidth < 600 ? 1.3 : 1);
  function zetLampje(id, toestand) {
    const l = lampjeVan[id];
    if (!l) return;
    l.userData.toestand = toestand;
    if (g.stil) { l.visible = true; l.material.color.setHex({ wacht: 0xffb347, go: 0x5bd48a, nogo: 0xff5a4f, rust: 0x5bd48a }[toestand]); }
  }

  // Vuur, rook en hoge wolken: alleen tijdens de lancering zichtbaar.
  const vuurGloed = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gr = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.35, 'rgba(255,170,80,0.7)'); gr.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    // blending 2 is optellend licht (AdditiveBlending): de gloed kleurt wat erachter ligt op.
    const m = levend(new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: 2, opacity: 0 })));
    m.position.set(0, -1.55, 0.5);
    m.scale.set(3.4, 2.6, 1);
    m.visible = false;
    // Onzichtbaar of niet: de straal van de muis ziet het vlak anders, en het hangt in een speels groepje.
    m.raycast = () => {};
    motorblok.add(m);
    return m;
  })();
  // Zolang de raket laag hangt, schuift de gloed mee omhoog en wordt ze
  // platter: onder de sokkel (die stopt op -0,78) komt geen licht uit.
  const GLOED_LAAGST = 0.55, GLOED_BODEM = -0.7;
  const rook = Array.from({ length: 10 }, (_, i) => {
    const b = levend(bol(wereld, 0.4, 0, 0, 0, 0, { materiaal: new T.MeshLambertMaterial({ color: 0xf4f1ec, emissive: 0xff8a3d, emissiveIntensity: 0, transparent: true, opacity: 0, depthWrite: false }), seg: 10, schaduw: false }));
    b.visible = false;
    b.userData.hoek = i / 10 * Math.PI * 2 + (i % 2) * 0.3;
    b.userData.fase = (i * 0.37) % 1;
    return b;
  });
  const hogeWolken = [[17, -2.6, 1.2, -3.2], [23, 0.4, 0.9, 3.4], [30, -1.6, 1.3, 2.6], [37, 0.2, 1.0, -3.6], [44, -2.2, 1.2, 1.2]].map(([y, z, sch, x]) => {
    const w = maakWolk(y, z, sch, 0);
    w.position.x = x;
    w.visible = false;
    return w;
  });
  // De camera volgt de raket via een plek zonder voorwerp: zie plekAnker.
  plek('vlucht', 'vlucht', groepje(wereld));
  const vluchtAnker = new T.Vector3();
  // De top van de raket is het lichtje boven op de neus (zie neusLicht).
  const RAKET_TOP = TOP + 3.5;
  let vrij = [];

  // De hoogte en de snelheid van de raket, t seconden na de lancering: negen
  // seconden stuwen, dan uitbollen tot de top op 121,5, en zacht terug naar het
  // platform. Lees de hoogte als kilometers: boven 100 begint de ruimte.
  const STUW = 9, TOP_T = 15, VLUCHT_DUUR = 24, RUIMTE = 100;
  function baan(t) {
    if (t < STUW) return [0.9 * t * t, 1.8 * t];
    if (t < TOP_T) { const u = t - STUW; return [72.9 + 16.2 * u - 1.35 * u * u, 16.2 - 2.7 * u]; }
    if (t < VLUCHT_DUUR) { const d = VLUCHT_DUUR - TOP_T, s = (t - TOP_T) / d; return [121.5 * (1 - s * s * (3 - 2 * s)), -121.5 * 6 * s * (1 - s) / d]; }
    return [0, 0];
  }

  // Het spoor: een witte pluim van het platform tot onder de vlam. Ze blijft
  // hangen, waaiert uit, en verdwijnt na de top.
  function verloopTex(stops) {
    const c = document.createElement('canvas'); c.width = 4; c.height = 64;
    const ctx = c.getContext('2d');
    // onderaan het voorwerp (v = 0) is de onderkant van het doek
    const gr = ctx.createLinearGradient(0, 64, 0, 0);
    for (const [p, a] of stops) gr.addColorStop(p, `rgba(255,255,255,${a})`);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 4, 64);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }
  const spoor = (() => {
    // Een zachte pluim: dicht in het midden en vervagend naar de randen, en
    // bovenaan, net onder de raket, het dichtst.
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const ctx = c.getContext('2d'), beeld = ctx.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const zij = Math.max(0, 1 - Math.abs(x - 31.5) / 32) ** 1.7, hoog = 0.12 + 0.55 * (1 - y / 63);
      const i = (y * 64 + x) * 4;
      beeld.data[i] = beeld.data[i + 1] = beeld.data[i + 2] = 255;
      beeld.data[i + 3] = Math.round(255 * zij * hoog);
    }
    ctx.putImageData(beeld, 0, 0);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    const geo = new T.PlaneGeometry(1, 1);
    geo.translate(0, 0.5, 0);
    // side 2 is beide kanten (DoubleSide). Het vlak kijkt naar de camera van de
    // vlucht, die van opzij 0,31 kijkt (de standaard van de motor).
    const m = levend(new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: 2, opacity: 0 })));
    m.rotation.y = 0.31;
    m.position.set(0, 0.12, RZ);
    m.visible = false;
    m.raycast = () => {};
    wereld.add(m);
    return m;
  })();
  let spoorTop = 0;
  // De dampkegel: rond de snelheid van het geluid vormt zich even een witte
  // kegel rond de schouder van de raket.
  const dampkegel = (() => {
    const m = levend(new T.Mesh(new T.ConeGeometry(3.3, 3.4, 40, 1, true), new T.MeshBasicMaterial({ map: verloopTex([[0, 0.75], [0.35, 0.35], [1, 0]]), transparent: true, depthWrite: false, side: 2, opacity: 0 })));
    m.position.set(0, TOP + 0.3, 0);
    m.visible = false;
    m.raycast = () => {};
    raket.add(m);
    return m;
  })();
  const glad = x => { x = klem(x, 0, 1); return x * x * (3 - 2 * x); };
  function eenmaal(sleutel, soort) { if (regie.gemeld.has(sleutel)) return; regie.gemeld.add(sleutel); meld(soort); }

  // ── de ruimte: van motor uit tot de landingsbrand ──
  // Zolang de motor uit staat, is iedereen aan boord gewichtloos: de figuurtjes
  // zweven op van hun stoel en tollen traag rond, en zakken terug als de
  // landingsbrand begint. Stuurraketjes in de neus draaien de raket wat bij (en
  // weer terug), zodat je anders in de verdiepingen kijkt. Op het hoogste punt
  // zendt ze een signaal uit; de lichtjes die op de aarde aangaan, en de zon die
  // boven de rand van de aarde opkomt, tekent de pagina op de hemel. Achter de
  // raket drijft een satelliet voorbij.
  const ZWEEF_IN = STUW + 0.6, LANDINGSBRAND = VLUCHT_DUUR - 3;
  const ROL = 0.42;
  // wanneer de stuurraketjes vuren, en naar welke kant (een koppel: links en rechts samen)
  const STOOTJES = [[10.2, 1], [13.2, -1], [16.9, -1], [19.9, 1]];
  const STOOT_DUUR = 0.8;
  // het signaal: elke 0,45 s een golf, van 13,8 tot 16,6 s
  const GOLF_VAN = 13.8, GOLF_TOT = 16.6, GOLF_OM = 0.45, GOLF_DUUR = 1.5;
  const stootjes = [-1, 1].map(kant => {
    const b = levend(bol(neus, 0.16, 0, kant * 1.72, 0.5, 0, { materiaal: new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }), seg: 10, schaduw: false }));
    b.userData.kant = kant;
    b.visible = false;
    b.raycast = () => {};
    return b;
  });
  // een boog van 2,1 radialen, met het midden recht boven de antenne (de bundel
  // van three.js heeft geen RingGeometry; een torus met een boog doet hetzelfde)
  const golfGeo = new T.TorusGeometry(1, 0.035, 6, 40, 2.1);
  golfGeo.rotateZ(Math.PI / 2 - 1.05);
  const zender = levend(groepje(wereld));
  zender.rotation.y = 0.31;  // naar de camera van de vlucht, zoals het spoor
  const golven = Array.from({ length: Math.ceil(GOLF_DUUR / GOLF_OM) + 1 }, () => {
    const m = levend(new T.Mesh(golfGeo, new T.MeshBasicMaterial({ color: 0xb6f2c9, transparent: true, opacity: 0, depthWrite: false, side: 2, blending: 2 })));
    m.visible = false;
    m.raycast = () => {};
    zender.add(m);
    return m;
  });
  const satelliet = (() => {
    const s = levend(groepje(wereld));
    blok(s, 0.42, 0.34, 0.34, 0xe3b54a, 0, -0.17, 0, { r: 0.03, schaduw: false });
    for (const kant of [-1, 1]) {
      blok(s, 0.18, 0.03, 0.03, 0xb8bec7, kant * 0.29, -0.015, 0, { r: 0.01, schaduw: false });
      blok(s, 0.9, 0.025, 0.42, 0x2b4f8c, kant * 0.83, -0.012, 0, { r: 0.01, schaduw: false });
      blok(s, 0.9, 0.028, 0.02, 0x9fb8dc, kant * 0.83, -0.014, 0, { r: 0.005, schaduw: false });
    }
    cilinder(s, 0.15, 0.03, 0.09, 0xf2f2f2, 0, 0.17, 0, { seg: 16, schaduw: false });
    const lichtje = bol(s, 0.04, 0, 0, 0.3, 0, { materiaal: new T.MeshBasicMaterial({ color: 0xff5a4f }), seg: 8, schaduw: false });
    s.scale.setScalar(1.7);
    s.visible = false;
    s.traverse(o => { o.raycast = () => {}; });
    return { s, lichtje };
  })();
  // De figuurtjes aan boord, met hun plaats op aarde (zie onderaan bouwRaket).
  const passagiers = [];
  function zetPassagiers(z, t) {
    for (const p of passagiers) {
      const { o } = p;
      if (z <= 0) { o.position.y = p.y; o.rotation.set(p.rx, p.ry, p.rz); continue; }
      const k = p.kantel;
      o.position.y = p.y + z * p.schaal * (p.hoog + 0.06 * k * Math.sin(t * 1.1 + p.fase));
      o.rotation.set(p.rx + z * 0.3 * k * Math.sin(t * 0.6 + p.fase), p.ry + z * 0.55 * k * Math.sin(t * 0.33 + p.fase * 0.7), p.rz + z * 0.34 * k * Math.sin(t * 0.5 + p.fase * 1.3));
    }
  }
  function ruimteWeg() {
    zetPassagiers(0, 0);
    raket.rotation.y = DRAAI;
    for (const b of stootjes) b.visible = false;
    for (const m of golven) m.visible = false;
    satelliet.s.visible = false;
  }
  // Wat de ruimte per beeld doet, t seconden na de lancering.
  function werkRuimteBij(r) {
    const t = r.t;
    zetPassagiers(r.zweef, t);
    raket.rotation.y = DRAAI + r.rol;
    for (const b of stootjes) {
      const stoot = STOOTJES.find(([van]) => t >= van && t < van + STOOT_DUUR);
      b.visible = !!stoot;
      if (!stoot) continue;
      const p = (t - stoot[0]) / STOOT_DUUR;
      // een koppel: de linkse en de rechtse blazen in tegengestelde richting, en
      // de terugstoot duwt de raket de kant op van de draai (of remt ze af)
      b.position.z = -stoot[1] * b.userData.kant * (0.15 + p * 0.85);
      b.position.x = b.userData.kant * (1.72 + p * 0.25);
      b.scale.setScalar(0.6 + p * 2.4);
      b.material.opacity = 0.85 * (1 - p) ** 1.6;
    }
    zender.position.set(0, r.hoogte + RAKET_TOP - 0.05, RZ);
    // Golf k vertrekt op GOLF_VAN + k * GOLF_OM; vorm i draagt de golven k = i, i + n, i + 2n, ...
    const n = golven.length, laatste = Math.floor((GOLF_TOT - GOLF_VAN) / GOLF_OM);
    golven.forEach((m, i) => {
      let k = i + n * Math.floor((t - GOLF_VAN - i * GOLF_OM) / (n * GOLF_OM));
      if (k > laatste) k -= n * Math.ceil((k - laatste) / n);
      const p = k >= 0 ? (t - GOLF_VAN - k * GOLF_OM) / GOLF_DUUR : -1;
      m.visible = p >= 0 && p < 1;
      if (!m.visible) return;
      m.scale.setScalar(0.35 + p * 3.4);
      m.material.opacity = 0.9 * Math.min(1, p * 6) * (1 - p) ** 1.3;
    });
    const s = satelliet.s;
    s.visible = t > 12.5 && t < 19.5;
    if (s.visible) {
      s.position.set(8.5 - (t - 12.5) * 2.3, r.hoogte + 10.3 + 0.35 * Math.sin(t * 0.7), RZ - 4.2);
      s.rotation.set(0.35, 0.6 + t * 0.32, 0.22);
      satelliet.lichtje.visible = t % 1.1 < 0.18;
    }
  }

  function zetTerug() {
    Object.assign(regie, { fase: 'rust', t: 0, index: -1, stap: 'vraag', volgende: 0, toestand: {}, tel: null, hoogte: 0, snelheid: 0, armen: 0, vuur: 0, rook: 0, zweef: 0, rol: 0, zon: 0, signaal: 0 });
    regie.gemeld.clear();
    for (const b of Object.values(bordjes)) { b.aan = false; b.k = 0; b.m.visible = false; }
    for (const l of lampjes) { l.userData.toestand = 'rust'; l.material.color.setHex(0x5bd48a); }
    pulsMat.color.setHex(0xb6f2c9);
    raket.position.set(0, 0, RZ);
    for (const { l, y } of raketLampen) l.position.y = y;
    armen.rotation.y = 0;
    vuurGloed.visible = false;
    spoor.visible = dampkegel.visible = false;
    spoorTop = 0;
    for (const b of rook) b.visible = false;
    for (const w of hogeWolken) w.visible = false;
    ruimteWeg();
    wereld.position.set(0, 0, 0);
    tekenScherm();
  }
  // Eén stap van de ronde: eerst de vraag (de camera gaat kijken), daarna het
  // antwoord van het station. Dat blijft even staan, zodat je de zin kunt lezen.
  // Zo duurt de hele ronde een kleine twintig seconden.
  function rondeStap() {
    const r = regie;
    if (r.stap === 'vraag') {
      r.index++;
      const st = r.stations[r.index];
      if (!st) { r.fase = 'go'; r.t = 0; tekenScherm(); meld('allesGo'); return; }
      const vorige = r.stations[r.index - 1];
      r.toestand[st.id] = 'bezig';
      zetLampje(st.id, 'wacht');
      r.stap = 'antwoord';
      r.volgende = r.t + (!vorige || vorige.kamer !== st.kamer ? 0.9 : 0.5);
      tekenScherm();
      meld('vraag', { id: st.id });
    } else {
      const st = r.stations[r.index];
      const toestand = st.id === r.storing ? 'nogo' : 'go';
      r.toestand[st.id] = toestand;
      zetLampje(st.id, toestand);
      zetBordje(st.id, toestand);
      r.stap = 'vraag';
      r.volgende = r.t + 0.55;
      if (toestand === 'nogo') {
        r.fase = 'hold';
        pulsMat.color.setHex(0x8a949c);
        tekenScherm();
        meld('station', { id: st.id, toestand });
        meld('hold', { id: st.id });
        return;
      }
      tekenScherm();
      meld('station', { id: st.id, toestand });
    }
  }
  function werkRegieBij(dt, nu) {
    const r = regie;
    if (r.fase === 'rust' || r.fase === 'hold') return;
    r.t += dt;
    if (r.fase === 'ronde') {
      while (r.fase === 'ronde' && r.t >= r.volgende) rondeStap();
    } else if (r.fase === 'go') {
      if (r.t >= 1.4) { r.fase = 'aftellen'; r.t = 0; r.tel = 5; tekenScherm(); meld('tel', { n: 5 }); }
    } else if (r.fase === 'aftellen') {
      const n = 5 - Math.floor(r.t);
      if (n !== r.tel && n >= 1) { r.tel = n; tekenScherm(); meld('tel', { n }); }
      r.armen = glad((r.t - 1.8) / 1.4);
      r.vuur = klem((r.t - 3) / 2, 0, 1) * 0.7;
      r.rook = glad((r.t - 2.8) / 1.2);
      if (r.t >= 5) {
        r.fase = 'vlucht'; r.t = 0; r.tel = null;
        for (const b of Object.values(bordjes)) b.aan = false;
        tekenScherm();
        meld('lift');
      }
    } else if (r.fase === 'vlucht') {
      const t = r.t;
      [r.hoogte, r.snelheid] = baan(t);
      // Het vuur loopt telkens zacht aan en uit: na het stuwen, en bij de
      // landingsbrand in de laatste drie seconden.
      const rem = VLUCHT_DUUR - 3;
      r.vuur = t < STUW ? 1 : t < STUW + 1 ? 1 - 0.8 * (t - STUW) : t < STUW + 1.6 ? 0.2 * (1 - glad((t - STUW - 1) / 0.6))
        : t < rem ? 0 : t < VLUCHT_DUUR ? 0.75 * glad((t - rem) / 0.6) : Math.max(0, 0.75 - (t - VLUCHT_DUUR) * 1.5);
      r.rook = t < 2.5 ? 1 : t < 6 ? 1 - (t - 2.5) / 3.5 : t < VLUCHT_DUUR - 1.5 ? 0
        : t < VLUCHT_DUUR + 0.5 ? (t - VLUCHT_DUUR + 1.5) / 2 * 0.7 : Math.max(0, 0.7 - (t - VLUCHT_DUUR - 0.5) * 0.45);
      r.armen = t < VLUCHT_DUUR + 0.8 ? 1 : 1 - glad((t - VLUCHT_DUUR - 0.8) / 1.4);
      // de ruimte: gewichtloos tot de landingsbrand, bijdraaien en terug, de zon
      // die opkomt, en het signaal rond het hoogste punt
      r.zweef = glad((t - ZWEEF_IN) / 1.4) * (1 - glad((t - LANDINGSBRAND) / 0.7));
      r.rol = -ROL * glad((t - 10.3) / 2.9) + ROL * glad((t - 17) / 2.9);
      r.zon = glad((t - 11.8) / 3.6);
      r.signaal = klem((t - GOLF_VAN - 0.6) / 2.4, 0, 1);  // zie ook golf in vluchtRuimte
      if (t >= ZWEEF_IN + 0.3) eenmaal('zweven', 'zweven');
      if (t >= GOLF_VAN) eenmaal('signaal', 'signaal');
      if (t < TOP_T && r.hoogte > 45) eenmaal('wolken', 'wolken');
      if (t < TOP_T && r.hoogte >= RUIMTE) eenmaal('ruimte', 'ruimte');
      if (t >= TOP_T + 1) eenmaal('terug', 'terug');
      if (t >= VLUCHT_DUUR + 0.3) eenmaal('geland', 'geland');
      if (t >= VLUCHT_DUUR + 2.4) {
        zetTerug();
        meld('klaar');
        return;
      }
    }
    // de trilling: het hele tafereel beeft als de motoren aanslaan, en het ebt
    // weg zodra de raket loskomt (de camera staat stil, dus de wereld schudt)
    const schud = r.fase === 'vlucht' ? Math.max(0, 1 - r.t / 2.4) * 0.035 : r.fase === 'aftellen' ? klem((r.t - 3.2) / 1.8, 0, 1) * 0.014 : 0;
    wereld.position.set(schud * Math.sin(nu * 53), schud * 0.6 * Math.sin(nu * 71), 0);
    // wat de tijdlijn met de raket en het platform doet
    raket.position.y = r.hoogte;
    raket.position.x = r.vuur > 0.3 && r.hoogte < 4 ? Math.sin(nu * 57) * 0.014 * r.vuur : 0;
    for (const { l, y } of raketLampen) l.position.y = y + r.hoogte;
    armen.rotation.y = r.armen * 1.15;
    vuurGloed.visible = r.vuur > 0.02;
    vuurGloed.material.opacity = Math.min(1, r.vuur * 1.1);
    const gloedY = Math.max(-1.55, GLOED_LAAGST - BASIS - r.hoogte);
    vuurGloed.position.y = gloedY;
    vuurGloed.scale.set(3.4 + r.vuur * 1.5, Math.min(2.6 + r.vuur * 2.5, 2 * (gloedY + BASIS + r.hoogte - GLOED_BODEM)), 1);
    for (const w of hogeWolken) w.visible = r.fase === 'vlucht';
    // het spoor groeit mee tot onder de vlam, en verdwijnt na de top
    const vliegt = r.fase === 'vlucht';
    if (vliegt && r.t < TOP_T) spoorTop = Math.max(spoorTop, r.hoogte + VLAM_TOP - vlamLengte * 0.5 - 0.12);
    spoor.visible = vliegt && spoorTop > 0.3;
    if (spoor.visible) {
      spoor.scale.set(2.6 + r.t * 0.18, spoorTop, 1);
      spoor.material.opacity = r.t < TOP_T ? glad(spoorTop / 6) : 1 - glad((r.t - TOP_T) / 3);
    }
    if (vliegt) werkRuimteBij(r);
    // de dampkegel, rond de snelheid van het geluid
    const k = vliegt ? klem((r.t - 4.6) / 2.8, 0, 1) : 0;
    dampkegel.visible = k > 0 && k < 1;
    if (dampkegel.visible) {
      dampkegel.material.opacity = Math.sin(k * Math.PI) * (0.5 + Math.sin(nu * 31) * 0.06);
      dampkegel.scale.setScalar(1 + k * 0.25);
    }
  }

  // Een hoofd dat rondkijkt, blijft los van het lijf, maar wordt zelf wel één vorm.
  const hoofden = [];
  wereld.traverse(o => { if (o.userData.hoofd?.userData.levend) hoofden.push(o.userData.hoofd); });
  // Wie aan boord is, zweeft in de ruimte (zie zetPassagiers). Elk figuurtje
  // krijgt een eigen hoogte en een eigen ritme, anders zweven ze in de pas.
  raket.traverse(o => {
    if (!o.userData.hoofd) return;
    const i = passagiers.length;
    // Vastgegespt aan een tafel: een centimeter los van de stoel en verder stil.
    // Het tafelblad ligt hoogstens 0,05 boven de dijen; wie kantelt of draait,
    // stoot er met de knieën tegen.
    const vast = o.userData.aanTafel;
    passagiers.push({ o, y: o.position.y, rx: o.rotation.x, ry: o.rotation.y, rz: o.rotation.z, schaal: o.scale.x,
      hoog: vast ? 0.015 : 0.2 + (i * 7 % 5) * 0.045, kantel: vast ? 0 : 1, fase: i * 1.7 });
  });

  const OPLICHT_KLEUR = new T.Color(OPLICHT);
  // De zon van de motor: in de ruimte schuift ze naar rechts, waar de pagina de
  // zon boven de aarde tekent (zie avond).
  const zonLicht = g.scene.children.find(o => o.isDirectionalLight && o.castShadow);
  const ZON_RUIMTE = new T.Vector3(30, 4, -6), ZON_KLEUR = new T.Color(0xffd9a8);
  // ── kaders, labels en wat er per beeld beweegt ──
  const y0 = i => BASIS + i * VH;
  const vloerKader = i => ({ min: [-R - 0.1, y0(i), RZ - R], max: [R + 0.1, y0(i) + VH + 0.05, RZ + R + 0.1], marge: 1.04, hoek: 0.14, opzij: BINNEN_OPZIJ });
  return {
    kamers,
    kaders: {
      overzicht: { min: [-6.6, -0.8, -5.4], max: [6.6, TOP + NEUS + 0.6, 3.7], marge: 1.02, hoek: 0.3 },
      neus: { min: [-R, TOP - 0.1, RZ - R], max: [R, TOP + NEUS + 0.75, RZ + R], marge: 1.08, hoek: 0.22 },
      beleid: vloerKader(4),
      secundair: vloerKader(3),
      lager: vloerKader(2),
      kleuter: vloerKader(1),
      motor: { min: [-R - 0.2, -0.05, RZ - R], max: [R + 0.2, y0(0) + VH + 0.05, RZ + R + 0.2], marge: 1.04, hoek: 0.16, opzij: BINNEN_OPZIJ },
      platform: { min: [-4.5, -0.2, -2.6], max: [6.5, 2.6, 3.4], marge: 1.03, hoek: 0.42 },
    },
    zaalVolgorde: ['overzicht', 'neus', 'beleid', 'secundair', 'lager', 'kleuter', 'motor', 'platform'],
    ankers: {
      neus: new T.Vector3(1.35, TOP + 1.25, RZ + 0.6),
      ...Object.fromEntries(NIVEAUS.map((n, i) => [n, new T.Vector3(R + 0.2, y0(i) + VH * 0.55, RZ + 0.3)])),
      platform: new T.Vector3(HELPDESK.x - 0.75, 0.05, HELPDESK.z + 1.35),
    },
    binnen: kamer => NIVEAUS.includes(kamer),
    // Bij een open kaartje iets meer ruimte errond: de kamers zijn rond en klein.
    // Tijdens de vlucht kadert de camera de hele raket met haar vuur, en kijkt ze wat lager.
    // De motor leest beide waarden telkens opnieuw, dus een getter volstaat. Het
    // kader van een plek is breder dan hoog: op een breed scherm (de beamer) moet
    // de zoom dus kleiner, anders vallen de neus en het vuur uit beeld.
    // Bij no-go zoomt de camera dichter in op de kast. Ligt er tijdens de vlucht
    // een paneel naast de raket (één keuze in vrijeRuimte), dan rekent de zoom
    // met wat vrij blijft.
    get plekZoom() {
      if (regie.fase === 'hold') return 0.8;
      if (regie.fase !== 'vlucht') return 1.2;
      const v = vrij.length === 1 ? vrij[0] : { links: 0, rechts: 0, boven: 0, onder: 0 };
      const verhouding = canvas.clientWidth * (1 - v.links - v.rechts) / Math.max(1, canvas.clientHeight * (1 - v.boven - v.onder));
      // In de ruimte zoomt de camera eerst in op wie aan boord zweeft, en trekt
      // ze daarna ver terug: de raket klein tegen de aarde, de zon en het signaal.
      const t = regie.t;
      const dichtbij = glad((t - ZWEEF_IN) / 1.6) * (1 - glad((t - 13) / 1.6));
      const wijd = glad((t - 13) / 1.6) * (1 - glad((t - 17.2) / 2.4));
      return Math.min(9.8, 6.3 * verhouding) * (1 - 0.45 * dichtbij) * (1 + 0.6 * wijd);
    },
    bijVrijeRuimte(keuzes) { vrij = keuzes; },
    get plekHoek() { return regie.fase === 'vlucht' ? 0.16 : undefined; },
    // De plek 'vlucht' volgt het midden tussen het lichtje op de neus en de punt
    // van de vlam, met een voorsprong: de camera ijlt na (zie de demping in de
    // motor), en zo blijft de raket in beeld. De motor legt het kader van een
    // plek 0,3 onder haar anker; dat tellen we erbij.
    plekAnker: id => (id === 'vlucht' ? vluchtAnker.set(0, (RAKET_TOP + Math.min(0.05, VLAM_TOP - vlamLengte)) / 2 + 0.3 + regie.hoogte + regie.snelheid / 2.8, RZ) : undefined),
    pinGroep: f => (f === 'overzicht' ? 'platform' : f),
    samenvoegen: [sokkel, platform, pad, ...NIVEAUS.map(n => kamers[n].groep), motorblok, neus, toren, armen, lift, schotel, ...bomen, buiten, ...wolken, ...hogeWolken, ...hoofden],
    intro: [
      ...NIVEAUS.map((n, i) => ({ obj: kamers[n].groep, start: 0.2 + i * 0.2, soort: 'val' })),
      { obj: neus, start: 1.2, soort: 'val' },
      { obj: toren, start: 1.35, soort: 'pop' },
      { obj: helpdesk, start: 1.5, soort: 'pop' },
      { obj: leiding, start: 1.55, soort: 'pop' },
      { obj: leidingDak, start: 1.55, soort: 'pop' },
      { obj: grondploeg, start: 1.7, soort: 'pop' },
      { obj: wandelaar, start: 1.75, soort: 'pop' },
      ...bomen.map((b, i) => ({ obj: b, start: 1.6 + i * 0.07, soort: 'pop' })),
      ...wolken.map((w, i) => ({ obj: w, start: 1.3 + i * 0.15, soort: 'pop' })),
    ],
    // De motor roept avond(n) elk beeld op, als laatste stap van het licht: ná de
    // lampen, het glas, de gloed en de zon (diorama-kern, werkLichtBij). Daarom
    // stapelt de += op de zon niet op. n: 0 overdag, 1 's avonds.
    avond(n) {
      // de lampen gaan een voor een aan, van onder naar boven
      const aan = i => glad((n - 0.2 - i * 0.14) / 0.25);
      for (const k of Object.values(kamers)) if (k.wandMat) k.wandMat.emissive.copy(OPLICHT_KLEUR).lerp(k.warm, k.i ? aan(k.i) : n);
      for (const { l, i } of raketLampen) l.intensity = LAMP * aan(i);
      for (const { m, i } of lampGloed) m.material.opacity = 0.9 * aan(i);
      plassen.visible = n > 0.01;
      plassen.material.opacity = n * 0.7;
      // pas als de verdiepingen geland zijn (de intro)
      vloerLicht.visible = n > 0.01 && tijd() > 2.2;
      vloerLicht.material.opacity = n * (g.zwak ? 0.62 : 0.3);
      for (const m of halos) { m.visible = n > 0.01; m.material.opacity = n * 0.7; }
      if (motorLamp) {
        // de kleur van de vlam (zie werkBij); hoog in de lucht bereikt ze het platform niet meer
        motorLamp.color.copy(vlamMat.color);
        motorLamp.position.y = 0.32 + Math.min(regie.hoogte, 6);
        motorLamp.intensity = (n * 1.8 + vuurNu * 16) * (1 - zacht(regie.hoogte / 6));
      }
      // In de ruimte komt de zon op, rechts van de raket (de pagina tekent haar op de
      // hemel): de rechterkant van de romp vangt dat licht.
      const ruimteZon = regie.fase === 'vlucht' ? regie.zon * glad((regie.hoogte - 60) / 30) : 0;
      if (zonLicht && ruimteZon > 0) {
        zonLicht.position.lerp(ZON_RUIMTE, ruimteZon);
        zonLicht.color.lerp(ZON_KLEUR, ruimteZon);
        zonLicht.intensity += 2.4 * ruimteZon;
      }
    },
    werkBij(dt, nu, { speels, nacht }) {
      werkRegieBij(dt, nu);
      // energie die door de ruggengraat naar boven stroomt; bij een hold staat ze stil
      if (regie.fase !== 'hold') {
        const p = (nu * 0.55) % 1;
        for (const puls of pulsen) puls.position.y = PLAAT + p * (VH - PLAAT);
      }
      // de motoren: een waakvlammetje, vol vuur als je erop klikt, en lang vuur bij de lancering
      const sinds = nu - speels[motorblok.userData.speel].t, vuur = sinds < 1.6 ? Math.sin(Math.min(1, sinds / 1.6) * Math.PI) : 0;
      const breed = Math.max(vuur, regie.vuur), lang = Math.max(vuur * 1.1, regie.vuur * 2.9);
      vuurNu = breed;
      vlamMat.color.lerpColors(WAAKVLAM, VUUR, klem(breed * 5, 0, 1));
      // Het vuur reikt hoogstens tot op het platform: wat er niet onder past,
      // spat opzij. Pas als de raket loskomt, wordt de vlam lang.
      const plafond = (VLAM_TOP + regie.hoogte) / 0.9;
      vlammen.forEach((v, i) => {
        const flakker = 1 + Math.sin(nu * 23 + i * 1.7) * 0.08 + Math.sin(nu * 37 + i) * 0.05;
        const wil = (0.22 + lang) * flakker, mag = Math.min(wil, plafond), spat = Math.min(0.5, (wil - mag) * 0.25);
        v.scale.set(0.45 + breed * 0.55 + spat, mag, 0.45 + breed * 0.55 + spat);
      });
      vlamLengte = 0.9 * Math.min((0.22 + lang) * 1.13, plafond);
      motorblok.position.x = vuur * Math.sin(nu * 60) * 0.012;
      // rook die bij de start en de landing over het platform rolt
      rook.forEach(b => {
        b.visible = regie.rook > 0.01;
        if (!b.visible) return;
        const q = (nu * 0.32 + b.userData.fase) % 1, afstand = 1.6 + q * 3.2;
        b.position.set(Math.sin(b.userData.hoek) * afstand, 0.35 + q * 0.7, RZ + Math.cos(b.userData.hoek) * afstand * 0.75);
        b.scale.setScalar((0.8 + q * 2.0) * (0.5 + regie.rook * 0.5));
        b.material.opacity = Math.sin(q * Math.PI) * 0.75 * regie.rook;
        // jonge rook, vlak bij het vuur, gloeit oranje
        b.material.emissiveIntensity = regie.vuur * 0.75 * (1 - q) ** 2;
      });
      // de bordjes poppen open als een station antwoordt
      const groot = bordjeMaat();
      for (const b of Object.values(bordjes)) {
        b.k = b.aan ? uitTerug(klem((nu - b.sinds) / 0.35, 0, 1)) : Math.max(0, b.k - dt * 5);
        b.m.visible = b.k > 0.01;
        b.m.scale.setScalar(Math.max(b.k, 0.001) * b.schaal * groot);
      }
      damp.forEach(b => {
        const q = (nu * 0.18 + b.userData.fase) % 1, hoek = b.userData.hoek + q * 0.6;
        b.position.set(Math.sin(hoek) * (1.9 + q * 1.4), 0.2 + q * 0.9, RZ + Math.cos(hoek) * (1.9 + q * 1.4) * 0.8);
        b.scale.setScalar(0.6 + q * 1.4 + vuur);
        b.material.opacity = Math.sin(q * Math.PI) * (0.38 + vuur * 0.4);
      });
      // de vonken, van net voor de ontsteking tot de raket loskomt
      const ontsteking = regie.fase === 'aftellen' ? regie.t - 3.1 : regie.fase === 'vlucht' ? regie.t + 1.9 : -1;
      vonken.forEach(v => {
        const q = (nu * 1.1 + v.userData.fase) % 1;
        v.visible = ontsteking > 0 && ontsteking < 3.6 && q < 0.82;
        if (!v.visible) return;
        const hoek = v.userData.hoek + Math.floor(nu * 1.1 + v.userData.fase) * 1.3, afstand = 1.3 + q * 2.4;
        v.position.set(Math.sin(hoek) * afstand, 0.3 + q * 1.6 - q * q * 1.95, RZ + Math.cos(hoek) * afstand * 0.8);
        v.scale.set(1.6 - q * 0.8, 1 - q * 0.5, 1.6 - q * 0.8);
      });
      // de windzak: een lichte bries, met af en toe een vlaag
      const bries = 0.55 + 0.45 * Math.sin(nu * 0.37) * Math.sin(nu * 0.11 + 1);
      windzak.rotation.y = 0.4 + Math.sin(nu * 0.9) * 0.18 * bries;
      windzak.rotation.z = -0.55 + bries * 0.5 + Math.sin(nu * 2.3) * 0.05 * bries;
      for (const l of lampjes) {
        // rust: knippert groen; wacht: amber; go: vast groen; no-go: knippert rood
        const t = l.userData.toestand;
        l.material.color.setHex(t === 'wacht' ? 0xffb347 : t === 'nogo' ? 0xff5a4f : 0x5bd48a);
        l.visible = t === 'rust' ? Math.sin(nu * 2.1 + l.userData.fase) > -0.6 : t === 'nogo' ? Math.sin(nu * 9) > 0 : true;
      }
      neusLicht.visible = torenLicht.visible = nu % 1.6 < 0.25 || nacht > 0.5 && nu % 1.6 < 0.9;
      // de lift: rustig op en neer
      const liftP = (Math.sin(nu * 0.22) + 1) / 2;
      lift.position.y = 0.02 + (liftP * liftP * (3 - 2 * liftP)) * (TOP - 1.1);
      schotel.rotation.y = nu * 0.35;
      koppen.forEach((f, i) => { f.userData.hoofd.rotation.y = Math.sin(nu * 0.5 + i * 1.9) * 0.35; });
      ploeg[1].userData.armen[1].rotation.set(-0.3, 0, Math.sin(nu * 0.7) > 0.4 ? 2.5 : 0.12);
      {
        // de wandelaar loopt heen en weer tussen het pad en de helpdesk, en
        // springt en zwaait als je erop klikt
        const periode = 18, q = (nu % periode) / periode, heen = q < 0.5, t = heen ? q * 2 : (q - 0.5) * 2;
        const van = [1.4, 3.0], naar = [-2.25, 1.45];
        const a = heen ? van : naar, b = heen ? naar : van;
        wandelaar.position.x = a[0] + (b[0] - a[0]) * t;
        wandelaar.position.z = a[1] + (b[1] - a[1]) * t;
        wandelaar.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
        const sindsW = nu - speels[wandelaar.userData.speel].t, springt = sindsW < 1.6;
        wandelaar.position.y = springt ? Math.abs(Math.sin(sindsW * Math.PI * 2.5)) * 0.22 * (1 - sindsW / 1.6) : Math.abs(Math.sin(nu * 7)) * 0.025;
        const [l, rr] = wandelaar.userData.benen;
        l.rotation.x = springt ? 0 : Math.sin(nu * 7) * 0.35; rr.rotation.x = -l.rotation.x;
        wandelaar.userData.armen[1].rotation.z = springt ? 2.6 + Math.sin(sindsW * 14) * 0.35 : 0.12;
      }
      bomen.forEach((b, i) => {
        const s = nu - speels[b.userData.speel].t;
        b.rotation.z = (s < 2 ? Math.sin(s * 16) * 0.1 * Math.exp(-s * 2.5) : 0) + Math.sin(nu * 1.2 + i * 1.7) * 0.01;
      });
      for (const w of wolken) w.position.x = -10 + ((nu / 80 + w.userData.start) % 1) * 20;
      vogels.forEach((v, i) => {
        const hoek = nu * 0.4 + v.userData.fase, straal = 3.4 + i * 0.4;
        v.position.set(Math.cos(hoek) * straal, TOP + 1.6 + Math.sin(nu * 1.3 + i) * 0.15, RZ + Math.sin(hoek) * straal * 0.6);
        v.rotation.y = -hoek;
        const flap = Math.sin(nu * 11 + i) * 0.55;
        v.userData.vleugels[0].rotation.z = flap; v.userData.vleugels[1].rotation.z = -flap;
      });
    },
    stil() {
      for (const p of pulsen) p.position.y = VH * 0.5;
      for (const v of vlammen) v.scale.set(0.45, 0.22, 0.45);
    },
    api: {
      // Start de go/no-go-ronde. stations: [{ id, kamer }] in de volgorde van de
      // ronde; storing: de id van een station dat no-go zegt, of null. melding
      // wordt opgeroepen bij elke stap (zie regie). Wie minder beweging vraagt,
      // krijgt de ronde meteen afgelopen, zonder vlucht.
      lancering({ stations, storing = null, melding }) {
        zetTerug();
        // Wie meteen na het laden start, wacht tot de verdiepingen geland zijn.
        Object.assign(regie, { stations, storing, melding, fase: 'ronde', volgende: Math.max(0.8, 2.4 - tijd()) });
        if (!g.stil) return;
        while (regie.fase === 'ronde') rondeStap();
        if (regie.fase === 'go') { regie.fase = 'rust'; meld('stilKlaar'); }
      },
      // Breek af en zet alles terug, ook een raket die al in de lucht hangt.
      stopLancering() { regie.melding = null; zetTerug(); },
      vluchtHoogte: () => regie.hoogte,
      // Voor de telemetrie in het paneel: seconden sinds de lancering, en de snelheid.
      vluchtTijd: () => (regie.fase === 'vlucht' ? regie.t : 0),
      vluchtSnelheid: () => regie.snelheid,
      // Voor de hemel: hoe ver de zon boven de aarde staat en hoe ver het signaal
      // naar de scholen is (allebei van 0 tot 1). Buiten de vlucht: null.
      // golf: hetzelfde als signaal, maar niet afgekapt op 1 (voor de kringetjes rond de lichtjes).
      vluchtRuimte: () => (regie.fase === 'vlucht' ? { zon: regie.zon, signaal: regie.signaal, golf: (regie.t - GOLF_VAN - 0.6) / 2.4, t: regie.t } : null),
      regieFase: () => regie.fase,
    },
  };
}
