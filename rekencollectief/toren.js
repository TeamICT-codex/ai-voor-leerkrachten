// Het tafereel van Het Rekencollectief: een tovenaarstoren in doorsnede op een
// groene heuvel. Je klimt van de poort naar de sterrenwacht, en elke verdieping
// is één stap van de app, van meten naar doen: binnen met een code (hal), oefenen
// (oefen), de periodetoetsen (meet), het overzicht in kleur (kleur) en onder het
// dak het klasbeeld (ster). Elke kamer heeft één moment dat afspeelt als de
// camera er aankomt of als je een bolletje opent, en de knop "Speel het verhaal
// af" loopt ze allemaal af op een tijdlijn (regie). Voorwerpen met een bolletje
// openen een kaartje (teksten in plekken.js). De motor zit in gedeeld/diorama-kern.js.
import {
  T, K, HUID, HAAR, klem, inUit, uitTerug, toeval, blok, cilinder, bol, kruin, groepje, levend,
  figuur, stoel, boom, maakPodium, F, rond, vinkje, paneel, mat, zet,
} from '../gedeeld/diorama-kern.js';

// Maten van de toren. Hij staat met zijn opening naar de camera: zo kijk je in
// elke kamer, zoals in een poppenhuis.
const R = 2.0, VH = 1.8, PLAAT = 0.1, MUUR = 0.12;
const RW = R - MUUR;            // de binnenkant van de muur
const OPEN = 1.05;              // de halve breedte van de opening, in radialen
const HEUVEL = 0.5, TZ = -0.5;  // de top van de heuvel en het midden van de toren
// De opening kijkt naar de camera zoals die in een kamer kijkt (opzij 0,12).
const DRAAI = 0.12;
const KAMERS = ['hal', 'oefen', 'meet', 'kleur', 'ster'];
const TOP = HEUVEL + KAMERS.length * VH;
const DAK = 2.7;
// Hoe hoog een bord tegen de achterwand mag reiken: wat hoger hangt, verdwijnt
// achter de voorrand van het plafond zodra de camera wat van boven in de kamer kijkt.
const BORD_TOP = 1.14;
const STEEN = 0xefe5d1, STEEN_DONKER = 0xdbcdb0;
const WAND = { hal: 0xfbdcc0, oefen: 0xd3ecd9, meet: 0xf8f1b6, kleur: 0xcde7ef, ster: 0x34477a };
const OPLICHT = 0xfff1d6, LAMPKLEUR = 0xffd29a;
const NAMEN = ['Aya', 'Bram', 'Camille', 'Daan', 'Elena', 'Finn', 'Gilles', 'Hanne'];
const CODE = '482913';

const glad = x => { x = klem(x, 0, 1); return x * x * (3 - 2 * x); };
// Waar je op een cirkel staat: hoek 0 is vooraan, in de opening.
const boog = (hoek, r) => [r * Math.sin(hoek), r * Math.cos(hoek)];
// Naar een punt kijken: figuurtjes kijken langs hun +z.
const kijkNaar = (x, z, nx, nz) => Math.atan2(nx - x, nz - z);
// Een figuurtje dat niet beweegt, wordt één vorm in plaats van zeven.
function stilFiguur(f) {
  for (const deel of [...f.userData.armen, ...(f.userData.benen || []), f.userData.hoofd]) deel.userData.levend = false;
  return f;
}

// ───────────────────────────── borden en schermen ─────────────────────────────

function tekenCode({ ctx, c }, n) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#1e4f34'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c2e3cc'; ctx.font = F(600, H * 0.14); ctx.fillText('Code', W * 0.06, H * 0.22);
  ctx.textAlign = 'center';
  for (let i = 0; i < 6; i++) {
    const x = W * (0.17 + i * 0.12 + (i > 2 ? 0.06 : 0));
    if (i < n) { ctx.fillStyle = '#fffaf0'; ctx.font = F(700, H * 0.46); ctx.fillText(CODE[i], x, H * 0.74); }
    ctx.fillStyle = i < n ? '#fbf59b' : 'rgba(255,255,255,0.4)';
    ctx.fillRect(x - W * 0.045, H * 0.82, W * 0.09, H * 0.035);
  }
  ctx.textAlign = 'left';
}
// Een icoontje per kind, zoals in de app: een vorm in een kleur.
function icoon(ctx, soort, x, y, s, kleur) {
  ctx.fillStyle = kleur; ctx.beginPath();
  if (soort === 'ster') {
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.42 : s; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  } else if (soort === 'hart') {
    ctx.moveTo(x, y + s * 0.85); ctx.bezierCurveTo(x - s * 1.3, y - s * 0.1, x - s * 0.55, y - s * 1.05, x, y - s * 0.4);
    ctx.bezierCurveTo(x + s * 0.55, y - s * 1.05, x + s * 1.3, y - s * 0.1, x, y + s * 0.85);
  } else if (soort === 'maan') {
    ctx.arc(x, y, s, 0.6, Math.PI * 2 - 0.6); ctx.arc(x + s * 0.55, y, s * 0.72, Math.PI * 2 - 1.1, 1.1, true);
  } else if (soort === 'driehoek') {
    ctx.moveTo(x, y - s); ctx.lineTo(x + s, y + s * 0.8); ctx.lineTo(x - s, y + s * 0.8);
  } else if (soort === 'ruit') {
    ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.8, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.8, y);
  } else if (soort === 'wolk') {
    ctx.arc(x - s * 0.45, y + s * 0.2, s * 0.5, 0, Math.PI * 2); ctx.arc(x + s * 0.1, y - s * 0.15, s * 0.62, 0, Math.PI * 2); ctx.arc(x + s * 0.6, y + s * 0.25, s * 0.45, 0, Math.PI * 2);
  } else if (soort === 'blad') {
    ctx.ellipse(x, y, s * 0.55, s, 0.6, 0, Math.PI * 2);
  } else {
    ctx.arc(x, y, s * 0.85, 0, Math.PI * 2);
  }
  ctx.fill();
}
const KAARTJES = [
  ['#fcc89b', 'ster'], ['#bfe3ed', 'hart'], ['#fbf59b', 'maan'], ['#c2e3cc', 'bol'],
  ['#f7b8c4', 'driehoek'], ['#d9c8f0', 'ruit'], ['#ffd9a0', 'wolk'], ['#b9e4d6', 'blad'],
];
function tekenNaamkaartjes({ ctx, c }) {
  const W = c.width, H = c.height, m = 14, b = (W - 5 * m) / 4, h = (H - 3 * m) / 2;
  ctx.fillStyle = '#f3e3c8'; ctx.fillRect(0, 0, W, H);
  NAMEN.forEach((naam, i) => {
    const x = m + (i % 4) * (b + m), y = m + Math.floor(i / 4) * (h + m), [kleur, soort] = KAARTJES[i];
    rond(ctx, x, y, b, h, 16); ctx.fillStyle = kleur; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + b / 2, y + h * 0.36, h * 0.24, 0, Math.PI * 2); ctx.fill();
    icoon(ctx, soort, x + b / 2, y + h * 0.36, h * 0.13, '#126425');
    ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 25); ctx.textAlign = 'center'; ctx.fillText(naam, x + b / 2, y + h * 0.84); ctx.textAlign = 'left';
  });
}
// stap: 0 leeg, 1 de bewerking, 2 en 3 het antwoord typt zich, 4 met een vinkje
function tekenScherm({ ctx, c }, stap) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, H * 0.16);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i < 5 || (i === 5 && stap === 4) ? '#c2e3cc' : 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(W * 0.06 + i * W * 0.05, H * 0.08, H * 0.03, 0, Math.PI * 2); ctx.fill();
  }
  if (!stap) return;
  const som = '7 × 8 = ', antwoord = stap >= 3 ? '56' : stap === 2 ? '5' : '';
  ctx.font = F(700, H * 0.3);
  const bs = ctx.measureText(som).width, ba = ctx.measureText('56').width, vink = H * 0.26;
  const x0 = W / 2 - (bs + ba + vink) / 2, y = H * 0.66;
  ctx.fillStyle = '#1a1a1a'; ctx.fillText(som, x0, y);
  ctx.fillStyle = '#126425'; ctx.fillText(antwoord, x0 + bs, y);
  if (stap < 4) ctx.fillRect(x0 + bs + ctx.measureText(antwoord).width + 6, y - H * 0.22, 6, H * 0.26);
  else vinkje(ctx, x0 + bs + ba + vink * 0.62, y - H * 0.1, H * 0.11);
}
const PERIODES = ['A*', 'A', 'B', 'C', 'D', 'E'];
function tekenPeriodes({ ctx, c }, n) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffaf3'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(600, H * 0.15); ctx.fillText('Periodes', W * 0.04, H * 0.22);
  const gat = W * 0.02, b = (W * 0.92 - 5 * gat) / 6, y = H * 0.32, h = H * 0.58;
  PERIODES.forEach((p, i) => {
    const x = W * 0.04 + i * (b + gat), aan = i < n;
    rond(ctx, x, y, b, h, 18); ctx.fillStyle = aan ? '#126425' : '#ecebe6'; ctx.fill();
    if (aan && i === n - 1) { ctx.strokeStyle = '#ffcf3a'; ctx.lineWidth = 9; ctx.stroke(); }
    ctx.fillStyle = aan ? '#ffffff' : '#9aa3a8'; ctx.font = F(700, h * 0.5); ctx.textAlign = 'center';
    ctx.fillText(p, x + b / 2, y + h * 0.68); ctx.textAlign = 'left';
  });
}
// Het periode-overzicht: per leerling en per onderdeel een kleur. g groen, o
// oranje, r rood. Bij Daan staat een schildpadje: juist, maar nog niet vlot.
const ONDERDELEN = ['tafels', 'splitsen', 'tot 20', 'tot 100', 'tot 1000'];
const PATROON = ['ggggo', 'goggg', 'gggog', 'ogggr', 'ggogg', 'rggog', 'ggggg', 'goggo'];
const SCHILDPAD_VAK = 3 * 5;
const VAKKLEUR = { g: '#4e9a63', o: '#f08a3c', r: '#d9534f' };
function schildpadje(ctx, x, y, s, kleur = '#0d4a1b') {
  ctx.fillStyle = kleur;
  for (const [dx, dy] of [[-0.5, -0.42], [0.5, -0.42], [-0.5, 0.42], [0.5, 0.42]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, s * 0.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.arc(x + s * 0.82, y, s * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y, s * 0.62, s * 0.46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c2e3cc'; ctx.lineWidth = s * 0.09;
  ctx.beginPath(); ctx.ellipse(x, y, s * 0.3, s * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
}
function tekenTabel({ ctx, c }, n) {
  const W = c.width, H = c.height, pad = 14, kop = H * 0.12, nb = W * 0.18;
  const rh = (H - kop - pad) / 8, kb = (W - nb - pad) / 5;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, kop * 0.42); ctx.textAlign = 'center';
  ONDERDELEN.forEach((o, k) => ctx.fillText(o, nb + k * kb + kb / 2, kop * 0.7));
  ctx.textAlign = 'left';
  NAMEN.forEach((naam, rij) => {
    const y = kop + rij * rh;
    ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, rh * 0.48); ctx.fillText(naam, pad, y + rh * 0.66);
    for (let k = 0; k < 5; k++) {
      const i = rij * 5 + k, x = nb + k * kb;
      rond(ctx, x + 4, y + 4, kb - 8, rh - 8, 10);
      ctx.fillStyle = i < n ? VAKKLEUR[PATROON[rij][k]] : '#e6e6e6'; ctx.fill();
      if (i === SCHILDPAD_VAK && i < n) schildpadje(ctx, x + kb / 2, y + rh / 2, rh * 0.34, '#ffffff');
    }
  });
}
function tekenVolgkaart({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 42); ctx.fillText('Volgkaart', 26, 56);
  ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 30); ctx.fillText('Aya', 26, 94);
  const x0 = 50, x1 = W - 30, y0 = H - 60, y1 = 120, w = [0.22, 0.38, 0.45, 0.62, 0.7, 0.86];
  ctx.strokeStyle = '#d6d6d6'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
  const punt = i => [x0 + 20 + i * (x1 - x0 - 40) / 5, y0 - w[i] * (y0 - y1)];
  ctx.strokeStyle = '#126425'; ctx.lineWidth = 7; ctx.beginPath();
  w.forEach((_, i) => ctx.lineTo(...punt(i))); ctx.stroke();
  w.forEach((_, i) => {
    const [x, y] = punt(i);
    ctx.fillStyle = i === 2 ? '#f08a3c' : '#4e9a63'; ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 24); ctx.textAlign = 'center'; ctx.fillText(PERIODES[i], x, y0 + 34); ctx.textAlign = 'left';
  });
}
function tekenWegwijzer({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffaf3'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, H * 0.36); ctx.textAlign = 'center'; ctx.fillText('Het Rekencollectief', W / 2, H * 0.64); ctx.textAlign = 'left';
}
function tekenVlag({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, H * 0.25); ctx.textAlign = 'center'; ctx.fillText('samen is beter', W / 2, H * 0.6); ctx.textAlign = 'left';
}

// ───────────────────────────── het tafereel ─────────────────────────────

export function maakToren(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwToren(g));
}

function bouwToren(g) {
  const { wereld, kamerLamp, statischeTekening, glasBuiten, lampMat, maakLichtje } = g;
  const tijd = g.tijd;
  const r = toeval(7);
  const plekKamer = {};
  const plek = (id, kamer, obj) => { plekKamer[id] = kamer; return g.plek(id, kamer, obj); };
  // Een zachte gloed: een bol die optellend licht geeft (blending 2).
  const gloedMat = kleur => new T.MeshBasicMaterial({ color: kleur, transparent: true, opacity: 0, blending: 2, depthWrite: false });

  // ── de heuvel, het pad, de bomen en de wegwijzer ──
  const heuvel = groepje(wereld);
  cilinder(heuvel, 4.85, 5.0, 0.3, K.groen, 0, -0.6, TZ, { seg: 40, schaduw: false });
  cilinder(heuvel, 3.4, 4.85, HEUVEL + 0.3, 0x9fd3a6, 0, -0.3, TZ, { seg: 36, plat: true, schaduw: false });
  for (let i = 0; i < 5; i++) {
    const steen = blok(heuvel, 0.42, 0.04, 0.3, K.steen, 0.15 * Math.sin(i * 1.7), HEUVEL, TZ + 2.25 + i * 0.32, { r: 0.04, schaduw: false });
    steen.rotation.y = (r() - 0.5) * 0.5;
  }
  const buiten = groepje(wereld, 0, HEUVEL, 0);
  const bomen = [[-2.85, TZ + 1.25, 0.95], [2.75, TZ - 1.5, 1.1], [-2.3, TZ - 2.1, 0.8]]
    .map(([x, z, s], i) => boom(buiten, x, z, s, i % 2 ? [K.blad2, K.blad1, K.blad3] : [K.blad1, K.blad2, K.blad3]));
  const wegwijzer = groepje(buiten, 2.75, 0, TZ + 1.85);
  wegwijzer.rotation.y = -0.35;
  blok(wegwijzer, 0.07, 0.9, 0.07, K.houtDonker, 0, 0, 0);
  blok(wegwijzer, 1.22, 0.34, 0.05, K.hout, 0, 0.62, 0, { r: 0.03 });
  statischeTekening(paneel(wegwijzer, 1.16, 0.28, 512, 0, 0.79, 0.027), tekenWegwijzer);

  // ── de toren ──
  const toren = groepje(wereld, 0, 0, TZ);
  toren.rotation.y = DRAAI;
  const kamers = {};
  // Een stuk muur rond de toren, met de opening vooraan.
  function schil(ouder, straal, h, y, materiaal) {
    const m = new T.Mesh(new T.CylinderGeometry(straal, straal, h, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), materiaal);
    m.position.y = y + h / 2;
    return zet(ouder, m, false);
  }
  // Een groepje tegen de binnenmuur, met zijn +z naar het midden van de kamer.
  function aanWand(ouder, hoek, straal = RW - 0.1) {
    const [x, z] = boog(hoek, straal);
    const w = groepje(ouder, x, 0, z);
    w.rotation.y = hoek + Math.PI;
    return w;
  }
  // Een groepje op de buitenkant van de muur, met zijn +z naar buiten.
  function opMuur(ouder, hoek, y, straal = R) {
    const [x, z] = boog(hoek, straal);
    const w = groepje(ouder, x, y, z);
    w.rotation.y = hoek;
    return w;
  }
  const RAMEN = [1.55, 2.35, -1.6];
  function verdieping(naam, i) {
    const v = groepje(toren, 0, HEUVEL + i * VH, 0);
    cilinder(v, R, R, PLAAT, STEEN_DONKER, 0, 0, 0, { seg: 40, schaduw: false });
    cilinder(v, RW - 0.02, RW - 0.02, 0.012, naam === 'ster' ? 0x8c6a4a : K.hout, 0, PLAAT, 0, { seg: 40, schaduw: false });
    schil(v, R, VH - PLAAT, PLAAT, mat(STEEN));
    schil(v, R + 0.05, 0.12, 0, mat(STEEN_DONKER));
    // Buiten: ramen die 's avonds gloeien, en losse stenen in de muur.
    for (const hoek of RAMEN) {
      const w = opMuur(v, hoek, VH * 0.5 + 0.28);
      blok(w, 0.4, 0.58, 0.05, STEEN_DONKER, 0, -0.3, 0, { r: 0.04, schaduw: false });
      blok(w, 0.28, 0.44, 0.03, 0, 0, -0.23, 0.03, { r: 0.01, materiaal: glasBuiten, schaduw: false });
      blok(w, 0.025, 0.44, 0.04, K.groen, 0, -0.23, 0.035, { r: 0, schaduw: false });
    }
    for (let k = 0; k < 9; k++) {
      const hoek = OPEN + 0.12 + r() * (Math.PI * 2 - 2 * OPEN - 0.24);
      if (RAMEN.some(h => Math.abs(((hoek - h + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.3)) continue;
      blok(opMuur(v, hoek, 0.25 + r() * (VH - 0.55)), 0.3, 0.13, 0.04, STEEN_DONKER, 0, 0, 0, { r: 0.02, schaduw: false });
    }
    // Binnen: elke kamer een eigen materiaal voor de muur. Dat licht op als je
    // er met de muis over gaat, en kleurt 's avonds warm (zie avond). side 1 is
    // de binnenkant van de cilinder; apart, anders voegt voegSamen het samen.
    const wandMat = new T.MeshLambertMaterial({ color: WAND[naam], emissive: OPLICHT, emissiveIntensity: 0, side: 1 });
    wandMat.userData.apart = true;
    schil(v, RW, VH - PLAAT, PLAAT, wandMat);
    // de snijranden van de doorsnede, in het groen
    for (const kant of [-1, 1]) {
      const a = kant * OPEN, rib = blok(v, 0.05, VH - PLAAT, MUUR + 0.04, K.groen, 0, PLAAT, 0, { r: 0.012, schaduw: false });
      rib.position.x = Math.sin(a) * (R - MUUR / 2);
      rib.position.z = Math.cos(a) * (R - MUUR / 2);
      rib.rotation.y = a;
    }
    // twee wandlampjes die 's avonds aangaan (lampMat van de motor)
    for (const hoek of [Math.PI - 1.0, Math.PI + 1.0]) {
      const w = aanWand(v, hoek, RW - 0.02);
      blok(w, 0.06, 0.14, 0.05, K.groen, 0, 1.24, 0.01, { r: 0.02, schaduw: false });
      bol(w, 0.045, 0, 0, 1.4, 0.07, { materiaal: lampMat, seg: 10, schaduw: false });
      cilinder(w, 0.035, 0.085, 0.09, K.groen, 0, 1.4, 0.07, { seg: 14, schaduw: false });
    }
    const raak = levend(new T.Mesh(new T.CylinderGeometry(R, R, VH, 16), new T.MeshBasicMaterial({ visible: false })));
    raak.position.y = VH / 2;
    raak.userData.kamer = naam;
    v.add(raak);
    kamerLamp(0, HEUVEL + i * VH + VH - 0.45, TZ + 0.3, naam === 'ster' ? 3 : 4.5);
    const warm = new T.Color(WAND[naam]).multiply(new T.Color(LAMPKLEUR)).multiplyScalar(naam === 'ster' ? 1.2 : g.zwak ? 1.7 : 2.4);
    kamers[naam] = { groep: v, wandMat, raak, warm };
    return v;
  }
  // Een bord of scherm tegen de achterwand, met een lijst errond. De bovenrand ligt
  // vast. De muur is rond: hoe breder het bord, hoe verder het van de muur hangt,
  // anders steekt de muur voor zijn randen.
  function wandBord(ouder, hoek, b, h, px, { lijst = K.hout, scherm = false } = {}) {
    const y = BORD_TOP - h;
    const w = aanWand(ouder, hoek, Math.min(RW - 0.1, Math.sqrt(RW * RW - (b / 2 + 0.06) ** 2) - 0.06));
    blok(w, b + 0.08, h + 0.08, 0.04, lijst, 0, y - 0.04, 0, { r: 0.015 });
    return { w, p: paneel(w, b, h, px, 0, y + h / 2, 0.045, { scherm }), midden: y + h / 2 };
  }
  function tafel(ouder, x, z, b, d) {
    const t = groepje(ouder, x, PLAAT, z);
    blok(t, b, 0.04, d, K.hout, 0, 0.4, 0, { r: 0.015 });
    for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) blok(t, 0.04, 0.4, 0.04, K.houtDonker, lx * (b / 2 - 0.05), 0, lz * (d / 2 - 0.05), { r: 0, schaduw: false });
    return t;
  }
  // De motor zet een speld binnen op 70 % van de hoogte van het voorwerp. Op een
  // bord valt ze zo midden op de tekst: een onzichtbaar merkteken rekt het voorwerp
  // op, zodat de speld op de bovenrand staat (op hoogte y, in het groepje).
  const merkGeo = new T.BoxGeometry(0.01, 0.01, 0.01), merkMat = new T.MeshBasicMaterial({ visible: false });
  function speldOp(groep, y, onder = 0) {
    const m = levend(new T.Mesh(merkGeo, merkMat));
    m.position.y = onder + (y - onder) / 0.7;
    m.raycast = () => {};
    groep.add(m);
    return groep;
  }
  const persoon = (ouder, x, z, nx, nz, o) => stilFiguur(figuur(ouder, { x, y: PLAAT, z, draai: kijkNaar(x, z, nx, nz), ...o }));

  // De tovenaar: een gewoon figuurtje met een groene puntmuts (met een gele band)
  // en een staf. Thomas tekent later zelf een tovenaar: hij zit volledig in deze
  // ene functie. top: het punt boven de staf, waar het gele lichtje hangt.
  function maakTovenaar(ouder, x, z, draai) {
    const groep = groepje(ouder, x, PLAAT, z);
    groep.rotation.y = draai;
    const f = stilFiguur(figuur(groep, { shirt: 0x2f7d45, broek: 0x2f7d45, huid: HUID[1], haar: HAAR[4] }));
    f.userData.armen[0].userData.levend = true;          // de vrije arm wijst naar het scherm
    f.userData.armen[1].rotation.set(-0.35, 0, 0.32);    // deze houdt de staf vast
    cilinder(f, 0.13, 0.21, 0.4, 0x2f7d45, 0, 0, 0, { seg: 16 });
    cilinder(f, 0.132, 0.132, 0.045, K.geel, 0, 0.82, 0, { seg: 18 });
    cilinder(f, 0.004, 0.14, 0.38, K.groenDonker, 0, 0.86, 0, { seg: 18 });
    cilinder(groep, 0.018, 0.018, 1.1, K.houtDonker, 0.22, 0, 0.07, { seg: 8 });
    const top = new T.Object3D();
    top.position.set(0.22, 1.24, 0.07);
    groep.add(top);
    return { groep, f, top };
  }

  // ── hal: binnen met een code ──
  const hal = verdieping('hal', 0);
  const codeBord = wandBord(hal, Math.PI, 1.25, 0.6, 768, { lijst: K.houtDonker });
  plek('code', 'hal', speldOp(codeBord.w, BORD_TOP + 0.04, BORD_TOP - 0.64));
  const rek = plek('naam', 'hal', speldOp(groepje(hal, 1.05, PLAAT, -0.7), 0.97));
  rek.rotation.y = -0.6;
  for (const x of [-0.36, 0.36]) blok(rek, 0.05, 0.98, 0.05, K.houtDonker, x, 0, 0);
  blok(rek, 0.8, 0.62, 0.04, K.hout, 0, 0.33, 0, { r: 0.02 });
  statischeTekening(paneel(rek, 0.74, 0.56, 512, 0, 0.64, 0.022), tekenNaamkaartjes);
  // De deur in de muur. Gaat ze open, dan zie je daglicht: een vlak achter de deur.
  const DEUR = Math.PI + 0.85;
  const deurVak = aanWand(hal, DEUR, RW - 0.02);
  blok(deurVak, 0.72, 1.14, 0.05, STEEN_DONKER, 0, PLAAT - 0.02, -0.01, { r: 0.04 });
  const daglicht = new T.MeshBasicMaterial({ color: 0xfff4cf });
  blok(deurVak, 0.52, 0.98, 0.01, 0, 0, PLAAT, 0.02, { r: 0, materiaal: daglicht, schaduw: false });
  // Het scharnier zit aan de achterkant: zo draait de deur weg van de camera en
  // blijft de deuropening in beeld.
  const scharnier = levend(groepje(deurVak, 0.26, PLAAT, 0.035));
  blok(scharnier, 0.52, 0.98, 0.04, K.houtDonker, -0.26, 0, 0, { r: 0.02 });
  for (const y of [0.22, 0.72]) blok(scharnier, 0.46, 0.04, 0.012, K.hout, -0.26, y, 0.022, { r: 0, schaduw: false });
  bol(scharnier, 0.028, K.geel, -0.45, 0.5, 0.03, { seg: 8 });
  const [dx, dz] = boog(DEUR, RW + 0.08), KIND_EIND = [0.4, -0.35];
  const kind = levend(figuur(hal, { x: dx, y: PLAAT, z: dz, shirt: K.zee, huid: HUID[2], haar: HAAR[0], schaal: 0.7 }));
  kind.userData.hoofd.userData.levend = false;
  kind.visible = false;

  // ── oefen: oefenen zonder druk ──
  const oefen = verdieping('oefen', 1);
  const scherm = wandBord(oefen, Math.PI, 1.3, 0.68, 768, { lijst: K.inkt, scherm: true });
  const schermDoel = new T.Object3D();
  // het lichtje landt in de bovenhoek van het scherm, niet op de bewerking
  schermDoel.position.set(0.5, scherm.midden + 0.22, 0.3);
  scherm.w.add(schermDoel);
  const zelf = plek('zelf', 'oefen', groepje(oefen, 0.05, 0, 0.45));
  {
    const t = tafel(zelf, 0, 0, 0.8, 0.5);
    const lap = groepje(t, -0.12, 0.44, 0);
    lap.rotation.y = -Math.PI / 2;
    blok(lap, 0.36, 0.02, 0.25, K.grijs, 0, 0, 0, { r: 0.008 });
    blok(lap, 0.36, 0.24, 0.015, K.inkt, 0, 0.01, -0.135, { r: 0.006 }).rotation.x = -0.22;
    stoel(zelf, -0.62, PLAAT, 0, Math.PI / 2, K.perzik);
    persoon(zelf, -0.6, 0, 0.4, 0, { shirt: K.perzik, huid: HUID[0], haar: HAAR[2], zit: true, schaal: 0.74 });
  }
  stoel(oefen, 0.67, PLAAT, 0.45, -Math.PI / 2, K.mint);
  persoon(oefen, 0.65, 0.45, -0.6, 0.45, { shirt: K.geel, huid: HUID[3], haar: HAAR[3], zit: true, schaal: 0.72 });
  const tovenaar = maakTovenaar(oefen, 1.25, -0.5, kijkNaar(1.25, -0.5, 0.0, 0.4));
  plek('tovenaar', 'oefen', tovenaar.groep);
  const reis = plek('reis', 'oefen', groepje(oefen, 0, PLAAT, 0));
  {
    // de Splits-Fabriek: een machientje met een schoorsteen en blokjes die eruit komen
    const fabriek = groepje(reis, -1.42, 0, -0.32);
    fabriek.rotation.y = 1.25;
    blok(fabriek, 0.42, 0.36, 0.32, K.perzik, 0, 0, 0, { r: 0.04 });
    blok(fabriek, 0.46, 0.05, 0.36, K.groen, 0, 0.36, 0, { r: 0.02 });
    cilinder(fabriek, 0.045, 0.05, 0.22, K.inkt, 0.12, 0.41, -0.05, { seg: 10 });
    cilinder(fabriek, 0.09, 0.09, 0.03, K.geel, -0.06, 0.16, 0.16, { seg: 8 }).rotation.x = Math.PI / 2;
    for (const [x, kleur] of [[-0.06, K.zee], [0.08, K.roos]]) blok(fabriek, 0.08, 0.08, 0.08, kleur, x, 0, 0.26, { r: 0.015 });
    // de Flits-Grot: rotsen met een donkere opening en drie stippen erin
    const grot = groepje(reis, -1.08, 0, -1.12);
    grot.rotation.y = 0.75;
    for (const [x, y, z, s] of [[-0.14, 0.12, 0, 0.2], [0.14, 0.12, -0.02, 0.19], [0, 0.3, -0.04, 0.2], [0.2, 0.05, 0.06, 0.1]]) kruin(grot, s, K.berg, x, y, z);
    blok(grot, 0.2, 0.22, 0.04, 0x26302c, 0, 0.02, 0.17, { r: 0.08, schaduw: false });
    for (const [x, y] of [[-0.04, 0.14], [0.04, 0.1], [0, 0.06]]) bol(grot, 0.017, K.geel, x, y, 0.2, { seg: 6, schaduw: false });
  }
  // het gele lichtje van de motor: de AI van de tovenaar, aan zijn staf
  const lichtje = maakLichtje();
  const sterretjeGeo = new T.IcosahedronGeometry(0.045, 0);
  const sterretjes = Array.from({ length: 7 }, (_, i) => {
    const s = levend(new T.Mesh(sterretjeGeo, new T.MeshBasicMaterial({ color: i % 2 ? 0xffcf3a : 0xfff3b0 })));
    s.visible = false; s.raycast = () => {};
    wereld.add(s);
    return s;
  });
  let sterretjesT = -10;

  // ── meet: de periodetoetsen ──
  const meet = verdieping('meet', 2);
  const periodeBord = wandBord(meet, Math.PI, 1.45, 0.46, 1024);
  plek('fiche', 'meet', speldOp(periodeBord.w, BORD_TOP + 0.04, BORD_TOP - 0.5));
  const klok = plek('klok', 'meet', groepje(meet, -1.0, PLAAT, -0.6));
  const loper = levend(groepje(klok, 0, 0.42, 0));
  for (const y of [0.36, -0.41]) cilinder(loper, 0.2, 0.2, 0.05, K.houtDonker, 0, y, 0, { seg: 20 });
  const zand = [1, -1].map(kant => {
    // een kegel met het brede eind tegen het uiteinde van de loper
    const glas = new T.Mesh(new T.CylinderGeometry(0.02, 0.16, 0.34, 18), new T.MeshLambertMaterial({ color: 0xdff2f7, transparent: true, opacity: 0.45, depthWrite: false }));
    glas.position.y = kant * 0.18;
    glas.rotation.x = kant > 0 ? Math.PI : 0;
    loper.add(glas);
    const hoop = groepje(loper, 0, kant * 0.22, 0);
    const m = new T.Mesh(new T.CylinderGeometry(0.02, 0.13, 0.2, 16), mat(0xf2c879));
    m.rotation.x = kant > 0 ? Math.PI : 0;
    hoop.add(m);
    return hoop;
  });
  for (const a of [0, 2.1, 4.2]) cilinder(loper, 0.014, 0.014, 0.74, K.houtDonker, Math.cos(a) * 0.18, -0.37, Math.sin(a) * 0.18, { seg: 6 });
  const wen = plek('wen', 'meet', groepje(meet, 1.05, PLAAT, -0.65));
  cilinder(wen, 0.2, 0.2, 0.36, K.hout, 0, 0, 0, { seg: 18 });
  cilinder(wen, 0.15, 0.11, 0.24, K.perzik, 0, 0.36, 0, { seg: 16 });
  kruin(wen, 0.19, K.blad2, 0, 0.75, 0);
  kruin(wen, 0.13, K.blad1, 0.1, 0.9, 0.04);
  kruin(wen, 0.1, K.blad1, -0.1, 0.86, -0.03);
  const juf = persoon(meet, 0.35, 0.1, -0.1, -1.5, { shirt: K.roos, huid: HUID[4], haar: HAAR[1] });
  juf.userData.armen[1].rotation.set(-2.2, 0, 0.1);

  // ── kleur: zien waar iedereen staat ──
  const kleur = verdieping('kleur', 3);
  const tabelBord = wandBord(kleur, Math.PI, 1.6, 0.86, 1024);
  plek('overzicht', 'kleur', speldOp(tabelBord.w, BORD_TOP + 0.04, BORD_TOP - 0.9));
  // De speld zweeft boven het schildpadje: anders staat ze er pal op en zie je het niet.
  const schildTafel = plek('schildpad', 'kleur', speldOp(tafel(kleur, 0.45, 0.35, 1.0, 0.5), 0.78));
  // het schildpadje: in blokjes, het wandelt traag over de tafel
  const schildpad = levend(groepje(schildTafel, 0, 0.44, 0));
  blok(schildpad, 0.17, 0.07, 0.22, K.blad3, 0, 0.03, 0, { r: 0.03 });
  blok(schildpad, 0.11, 0.04, 0.15, K.blad2, 0, 0.09, 0, { r: 0.015 });
  blok(schildpad, 0.07, 0.06, 0.07, K.blad1, 0, 0.03, 0.14, { r: 0.02 });
  const poten = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([px, pz]) => levend(blok(schildpad, 0.04, 0.04, 0.05, K.blad1, px * 0.075, 0, pz * 0.08, { r: 0.012 })));
  const volgkaart = plek('volgkaart', 'kleur', speldOp(groepje(kleur, -1.3, PLAAT, -0.7), 0.97));
  volgkaart.rotation.y = 0.75;
  for (const [x, z, a] of [[-0.24, 0.05, 0.12], [0.24, 0.05, -0.12]]) blok(volgkaart, 0.04, 1.02, 0.04, K.houtDonker, x, 0, z, { r: 0 }).rotation.z = a;
  blok(volgkaart, 0.04, 0.95, 0.04, K.houtDonker, 0, 0, -0.22, { r: 0 }).rotation.x = -0.25;
  blok(volgkaart, 0.6, 0.04, 0.06, K.houtDonker, 0, 0.42, 0.05, { r: 0 });
  blok(volgkaart, 0.62, 0.5, 0.025, K.wit, 0, 0.45, 0.04, { r: 0.01 });
  statischeTekening(paneel(volgkaart, 0.58, 0.46, 512, 0, 0.7, 0.056), tekenVolgkaart);
  const meester = persoon(kleur, -0.95, -0.1, -0.3, -1.6, { shirt: K.zee, huid: HUID[3], haar: HAAR[0] });
  for (const arm of meester.userData.armen) arm.rotation.x = -0.95;
  blok(meester, 0.26, 0.016, 0.18, K.grijs, 0, 0.5, 0.22, { r: 0.006 });
  blok(meester, 0.26, 0.17, 0.012, K.inkt, 0, 0.51, 0.13, { r: 0.006 }).rotation.x = 0.35;

  // ── ster: van meten naar doen, onder het dak ──
  const ster = verdieping('ster', 4);
  // Ook hier de speld boven de pionnen, niet erop.
  const groepjes = plek('groepjes', 'ster', speldOp(groepje(ster, 0.0, PLAAT, 0.25), 0.8));
  cilinder(groepjes, 0.5, 0.5, 0.04, K.hout, 0, 0.38, 0, { seg: 32 });
  cilinder(groepjes, 0.05, 0.05, 0.38, K.houtDonker, 0, 0, 0, { seg: 10 });
  cilinder(groepjes, 0.22, 0.24, 0.03, K.houtDonker, 0, 0, 0, { seg: 18 });
  const PIONKLEUR = [0x4e9a63, 0xffcf3a, 0x5fa9c9];
  const pionnen = Array.from({ length: 9 }, (_, i) => {
    const p = levend(groepje(groepjes, 0, 0.42, 0));
    cilinder(p, 0.03, 0.045, 0.08, PIONKLEUR[i % 3], 0, 0, 0, { seg: 12 });
    bol(p, 0.034, PIONKLEUR[i % 3], 0, 0.105, 0, { seg: 12 });
    // eerst door elkaar in het midden, daarna in drie groepjes per kleur
    const a0 = i * 2.4 + 0.3, r0 = 0.07 + (i % 4) * 0.045;
    const a1 = [-2.6, -0.5, 1.57][i % 3], plek3 = Math.floor(i / 3);
    p.userData.van = [Math.cos(a0) * r0, Math.sin(a0) * r0];
    p.userData.naar = [Math.cos(a1) * 0.27 + Math.cos(plek3 * 2.1) * 0.07, Math.sin(a1) * 0.27 + Math.sin(plek3 * 2.1) * 0.07];
    return p;
  });
  const klasbeeld = plek('klasbeeld', 'ster', speldOp(groepje(ster, -1.0, PLAAT, -0.6), 1.12));
  cilinder(klasbeeld, 0.12, 0.17, 0.6, STEEN_DONKER, 0, 0, 0, { seg: 16 });
  cilinder(klasbeeld, 0.16, 0.16, 0.05, K.groen, 0, 0.6, 0, { seg: 16 });
  const bolKern = levend(bol(klasbeeld, 0.12, 0, 0, 0.84, 0, { materiaal: new T.MeshBasicMaterial({ color: 0x9fb8c8 }), schaduw: false }));
  bol(klasbeeld, 0.2, 0, 0, 0.84, 0, { materiaal: new T.MeshLambertMaterial({ color: 0xd8f0f7, transparent: true, opacity: 0.5, depthWrite: false }), seg: 24 });
  const bolGloed = levend(bol(klasbeeld, 0.26, 0, 0, 0.84, 0, { materiaal: gloedMat(0xffe7a0), schaduw: false, seg: 20 }));
  bolGloed.raycast = () => {};
  const KERN_UIT = new T.Color(0x9fb8c8), KERN_AAN = new T.Color(0xfff6c8);
  // de telescoop, door het dak
  const samen = plek('samen', 'ster', groepje(ster, 0.9, PLAAT, -0.75));
  for (const a of [0, 2.1, 4.2]) blok(samen, 0.035, 0.85, 0.035, K.houtDonker, Math.cos(a) * 0.14, 0, Math.sin(a) * 0.14, { r: 0 }).rotation.set(Math.sin(a) * 0.2, 0, -Math.cos(a) * 0.2);
  const buis = groepje(samen, 0, 0.85, 0);
  buis.rotation.set(-0.45, 0, -0.35);
  cilinder(buis, 0.075, 0.06, 2.5, K.groen, 0, -0.4, 0, { seg: 16 });
  for (const y of [-0.3, 0.6, 1.95]) cilinder(buis, 0.085, 0.085, 0.06, K.geel, 0, y, 0, { seg: 16 });

  // ── het dak: een donkergroene punt, met binnenin de sterrenhemel ──
  const dak = groepje(toren, 0, TOP, 0);
  {
    // Bovenop de muur: een platte ring (een kegel zonder hoogte), anders kijk je
    // tussen de binnen- en de buitenmuur door naar de lucht.
    const kroon = new T.Mesh(new T.CylinderGeometry(RW, R + 0.3, 0.001, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), mat(STEEN_DONKER));
    zet(dak, kroon, false);
    const rand = new T.Mesh(new T.CylinderGeometry(R + 0.3, R + 0.3, 0.14, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), mat(K.groenDonker));
    rand.position.y = 0.07;
    zet(dak, rand, false);
    const kap = new T.Mesh(new T.CylinderGeometry(0.03, R + 0.3, DAK, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), mat(K.groen, true));
    kap.position.y = DAK / 2;
    zet(dak, kap, false);
    const hemelMat = new T.MeshLambertMaterial({ color: 0x2b3c6e, side: 1 });
    hemelMat.userData.apart = true;
    const hemel = new T.Mesh(new T.CylinderGeometry(0.02, R + 0.22, DAK - 0.06, 40, 1, true, OPEN, Math.PI * 2 - 2 * OPEN), hemelMat);
    hemel.position.y = (DAK - 0.06) / 2;
    zet(dak, hemel, false);
    // de snijranden van het dak
    const omhoog = new T.Vector3(0, 1, 0);
    for (const kant of [-1, 1]) {
      const [x, z] = boog(kant * OPEN, R + 0.3);
      const richting = new T.Vector3(-x, DAK, -z), lengte = richting.length();
      const rib = zet(dak, new T.Mesh(new T.BoxGeometry(0.06, lengte, 0.06), mat(K.groenDonker)), false);
      rib.position.set(x / 2, DAK / 2, z / 2);
      rib.quaternion.setFromUnitVectors(omhoog, richting.normalize());
    }
  }
  // de sterren die bij het klasbeeld verschijnen, binnen in het dak
  const sterGeo = new T.IcosahedronGeometry(0.04, 0), sterMat = new T.MeshBasicMaterial({ color: 0xfff3b0 });
  const dakSterren = Array.from({ length: 16 }, (_, i) => {
    const h = 0.2 + r() * 1.05, hoek = Math.PI + (r() - 0.5) * 3.2;
    const [x, z] = boog(hoek, (R + 0.22) * (1 - h / (DAK - 0.06)) - 0.05);
    const s = levend(new T.Mesh(sterGeo, sterMat));
    s.position.set(x, h, z);
    s.userData.k = 0.6 + r() * 0.7;
    s.scale.setScalar(0.001);
    s.raycast = () => {};
    dak.add(s);
    return s;
  });
  // op de dakpunt: een kristal dat 's avonds gloeit, en een vlag
  const spits = groepje(dak, 0, DAK - 0.05, 0);
  cilinder(spits, 0.022, 0.022, 0.75, K.houtDonker, 0, 0, 0, { seg: 8 });
  const kristal = levend(groepje(spits, 0, 0.86, 0));
  const kristalMat = new T.MeshLambertMaterial({ color: 0xbfe8f2, emissive: 0x8fe3ff, emissiveIntensity: 0.15, flatShading: true });
  zet(kristal, new T.Mesh(new T.CylinderGeometry(0.0, 0.15, 0.22, 6), kristalMat)).position.y = 0.11;
  zet(kristal, new T.Mesh(new T.CylinderGeometry(0.15, 0.0, 0.3, 6), kristalMat)).position.y = -0.15;
  const kristalGloed = levend(bol(kristal, 0.42, 0, 0, 0, 0, { materiaal: gloedMat(0x9fe8ff), schaduw: false, seg: 20 }));
  kristalGloed.raycast = () => {};
  const vlag = levend(groepje(spits, 0.02, 0.66, 0));
  const doek = statischeTekening(paneel(vlag, 0.72, 0.36, 256, 0.37, -0.19, 0), tekenVlag);
  doek.mesh.material.side = 2;

  // wolken
  const wolkMat = new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  const wolken = [[7.2, -5.5, 1.0, 0], [10.2, -5.2, 0.75, 0.4], [4.6, -6, 0.7, 0.7]].map(([y, z, s, start]) => {
    const w = levend(groepje(wereld, 0, y, z));
    for (const [x, yy, zz, rr] of [[0, 0, 0, 0.42], [-0.45, -0.1, 0.05, 0.3], [0.45, -0.08, 0, 0.33], [0.15, 0.2, 0.1, 0.28]]) {
      const b = new T.Mesh(new T.IcosahedronGeometry(rr * s, 1), wolkMat);
      b.position.set(x * s, yy * s, zz * s);
      w.add(b);
    }
    w.userData.start = start;
    return w;
  });
  // het boeket sterren op het einde van het verhaal, uit de dakpunt
  const boeketKleur = [0xffcf3a, 0xfff3b0, 0xc2e3cc, 0xfcc89b, 0xbfe3ed];
  const boeket = Array.from({ length: 40 }, (_, i) => {
    const s = levend(new T.Mesh(sterretjeGeo, new T.MeshBasicMaterial({ color: boeketKleur[i % 5] })));
    s.visible = false; s.raycast = () => {};
    const hoek = i * 2.39996, omhoog = 0.55 + (i % 7) / 7 * 0.45;
    s.userData.v = new T.Vector3(Math.cos(hoek) * (1 - omhoog * 0.6) * 1.9, 1.9 + omhoog * 1.6, Math.sin(hoek) * (1 - omhoog * 0.6) * 1.2 + 0.5);
    s.userData.later = (i % 2) * 0.55;
    wereld.add(s);
    return s;
  });
  let boeketT = -10;

  // ───────────────────────────── de momenten ─────────────────────────────
  // Elke kamer heeft één moment. zet(p) zet de kamer in de stand van p seconden
  // na de start: p < 0 is de beginstand, p = duur de eindstand. Een moment speelt
  // als de camera aankomt (bijFocus) of je een bolletje opent (bijPlek), en niet
  // opnieuw zolang het nog loopt. run telt hoe vaak het al speelde.
  const wereldPunt = (obj, doel = new T.Vector3()) => wereld.worldToLocal(obj.getWorldPosition(doel));
  const eenmaal = (m, sleutel, als, f) => { if (als && !m.gedaan.has(sleutel)) { m.gedaan.add(sleutel); f(); } };
  const stand = { code: -1, scherm: -1, periodes: -1, tabel: -1 };
  function herteken(sleutel, p, teken, waarde) {
    if (stand[sleutel] === waarde) return;
    stand[sleutel] = waarde;
    teken(p, waarde);
    p.tex.needsUpdate = true;
  }
  const momenten = {
    hal: { duur: 5.6, zet(p) {
      herteken('code', codeBord.p, tekenCode, p < 0 ? 0 : klem(Math.floor((p - 0.3) / 0.35) + 1, 0, 6));
      scharnier.rotation.y = 1.35 * (p < 0 ? 0 : glad((p - 2.5) / 0.5) * (1 - glad((p - 4.8) / 0.6)));
      // het kind stapt binnen zodra de deur open is, en gaat bij de naamkaartjes staan
      const t = klem((p - 3.0) / 1.8, 0, 1), e = glad(t);
      kind.visible = p >= 3.0;
      kind.position.set(dx + (KIND_EIND[0] - dx) * e, PLAAT, dz + (KIND_EIND[1] - dz) * e);
      kind.rotation.y = t < 1 ? kijkNaar(dx, dz, ...KIND_EIND) : kijkNaar(...KIND_EIND, 1.05, -0.7);
      const stap = t > 0 && t < 1 ? Math.sin(tijd() * 10) * 0.45 : 0;
      kind.userData.benen[0].rotation.x = stap; kind.userData.benen[1].rotation.x = -stap;
      kind.userData.armen[0].rotation.x = -stap * 0.7; kind.userData.armen[1].rotation.x = stap * 0.7;
    } },
    oefen: { duur: 6.6, zet(p, m) {
      herteken('scherm', scherm.p, tekenScherm, p < 0.2 ? 0 : p < 1.0 ? 1 : p < 1.35 ? 2 : p < 1.8 ? 3 : 4);
      // de vrije arm van de tovenaar wijst naar het scherm terwijl het lichtje vertrekt
      tovenaar.f.userData.armen[0].rotation.x = -1.5 * (p < 0 ? 0 : glad((p - 1.7) / 0.4) * (1 - glad((p - 3.4) / 0.5)));
      if (g.stil || !lichtje.aan) return;
      eenmaal(m, 'terug', p < 0 && lichtje.pos.distanceTo(wereldPunt(tovenaar.top)) > 0.05 && !lichtje.vliegt(), () => lichtje.vlieg(wereldPunt(tovenaar.top)));
      eenmaal(m, 'heen', p >= 2.0, () => lichtje.vlieg(wereldPunt(schermDoel), () => { sterretjesT = tijd(); }));
      eenmaal(m, 'naStaf', p >= 4.8, () => lichtje.vlieg(wereldPunt(tovenaar.top)));
    } },
    meet: { duur: 4.6, zet(p, m) {
      // De zandloper kantelt: het volle glas komt boven en loopt leeg in het andere.
      const k = Math.max(1, m.run), vol = k % 2 ? 1 : 0;
      const kantel = p < 0 ? 0 : inUit(klem((p - 0.2) / 1.0, 0, 1));
      loper.rotation.z = Math.PI * (k - 1 + kantel) * (m.run ? 1 : 0);
      const f = p < 0 ? 0 : klem((p - 1.2) / 3.2, 0, 1);
      zand[vol].scale.setScalar(Math.max(0.001, Math.cbrt(1 - f)));
      zand[1 - vol].scale.setScalar(Math.max(0.001, Math.cbrt(f)));
      herteken('periodes', periodeBord.p, tekenPeriodes, p < 0 ? 0 : klem(Math.floor((p - 1.3) / 0.4) + 1, 0, 6));
    } },
    kleur: { duur: 3.6, zet(p) {
      herteken('tabel', tabelBord.p, tekenTabel, p < 0 ? 0 : klem(Math.floor((p - 0.3) / 0.075), 0, 40));
    } },
    ster: { duur: 4.6, zet(p) {
      const e = p < 0 ? 0 : inUit(klem((p - 0.3) / 1.5, 0, 1));
      for (const pion of pionnen) {
        const [vx, vz] = pion.userData.van, [nx, nz] = pion.userData.naar;
        pion.position.set(vx + (nx - vx) * e, 0.42 + Math.sin(e * Math.PI) * 0.05, vz + (nz - vz) * e);
      }
      const licht = p < 0 ? 0 : glad((p - 1.4) / 0.8);
      bolKern.material.color.lerpColors(KERN_UIT, KERN_AAN, licht);
      bolGloed.material.opacity = 0.28 * licht;
      bolGloed.visible = licht > 0.01;
      dakSterren.forEach((s, i) => s.scale.setScalar(Math.max(0.001, p < 0 ? 0 : uitTerug(klem((p - 2.2 - i * 0.1) / 0.4, 0, 1)))));
    } },
  };
  for (const m of Object.values(momenten)) Object.assign(m, { start: null, run: 0, af: true, gedaan: new Set() });
  // vertraging: de camera is er nog niet meteen.
  function startMoment(kamer, { vertraging = 0.6, opnieuw = false } = {}) {
    const m = momenten[kamer];
    if (!m || g.stil) return;
    const p = m.start == null ? Infinity : tijd() - m.start;
    if (!opnieuw && p < m.duur) return;
    m.start = tijd() + vertraging;
    m.run++;
    m.af = false;
    m.gedaan.clear();
  }
  function werkMomentenBij(nu) {
    for (const m of Object.values(momenten)) {
      if (m.af) continue;
      const p = nu - m.start;
      m.zet(Math.min(p, m.duur), m);
      m.af = p > m.duur + 0.5;
    }
  }
  for (const m of Object.values(momenten)) m.zet(-1, m);

  // ───────────────────────────── het verhaal ─────────────────────────────
  // "Speel het verhaal af": de camera klimt in een halve minuut van de poort naar
  // de sterrenwacht. De tijdlijn loopt hier, op de tijd van het tafereel, zodat ze
  // mee pauzeert als het canvas uit beeld is. Bij elke stap roept ze
  // melding(soort, gegevens) op: 'stap' met { stap, kamer }, en op het einde
  // 'klaar'. De pagina stuurt daarop de camera en het paneel; de scène speelt
  // het moment van de kamer en op het einde het boeket.
  const VERHAAL = [
    { t: 0, stap: 'poort' }, { t: 2.8, stap: 'hal' }, { t: 8.4, stap: 'oefen' }, { t: 14.6, stap: 'meet' },
    { t: 19.6, stap: 'kleur' }, { t: 24.4, stap: 'ster' }, { t: 29.8, stap: 'slot' },
  ];
  const VERHAAL_EINDE = 34;
  const regie = { loopt: false, t: 0, index: -1, melding: null, moment: null, boeket: null };
  const meld = (soort, gegevens = {}) => regie.melding?.(soort, gegevens);
  function werkRegieBij(dt) {
    const rg = regie;
    if (!rg.loopt) return;
    rg.t += dt;
    while (VERHAAL[rg.index + 1] && VERHAAL[rg.index + 1].t <= rg.t) {
      const { stap } = VERHAAL[++rg.index];
      // Op het einde kijkt de camera naar het dak, waar het boeket uit springt.
      const kamer = KAMERS.includes(stap) ? stap : stap === 'slot' ? 'dak' : 'overzicht';
      if (KAMERS.includes(stap)) startMoment(stap, { vertraging: 0.7, opnieuw: true });
      if (stap === 'slot') rg.boeket = rg.t + 1.0;
      meld('stap', { stap, kamer });
    }
    if (rg.boeket != null && rg.t >= rg.boeket) { rg.boeket = null; boeketT = tijd(); }
    if (rg.t >= VERHAAL_EINDE) { rg.loopt = false; meld('klaar'); }
  }

  // ───────────────────────────── kaders en wat er per beeld beweegt ─────────────────────────────
  const y0 = i => HEUVEL + i * VH;
  const vloerKader = i => ({ min: [-R - 0.1, y0(i), TZ - R], max: [R + 0.1, y0(i) + VH + 0.05, TZ + R + 0.1], marge: 1.04, hoek: 0.14, opzij: DRAAI });
  const OPLICHT_KLEUR = new T.Color(OPLICHT), DAG_LICHT = new T.Color(0xfff4cf), NACHT_LICHT = new T.Color(0x2b3a68);
  let dakSterAvond = 0;
  return {
    kamers,
    kaders: {
      overzicht: { min: [-4.9, -0.6, TZ - 3.2], max: [4.9, TOP + DAK + 1.25, TZ + 4.9], marge: 1.02, hoek: 0.2 },
      hal: vloerKader(0),
      oefen: vloerKader(1),
      meet: vloerKader(2),
      kleur: vloerKader(3),
      ster: { min: [-R - 0.1, y0(4), TZ - R], max: [R + 0.1, TOP + 1.25, TZ + R + 0.1], marge: 1.04, hoek: 0.16, opzij: DRAAI },
      // alleen voor het slot van het verhaal: de sterrenwacht, het dak en het boeket erboven
      dak: { min: [-3.0, y0(4) + 0.6, TZ - 2.4], max: [3.0, TOP + DAK + 3.4, TZ + 2.4], marge: 1.02, hoek: 0.18 },
    },
    ankers: Object.fromEntries(KAMERS.map((k, i) => [k, new T.Vector3(R + 0.25, y0(i) + VH * 0.55, TZ + 0.3)])),
    binnen: kamer => KAMERS.includes(kamer),
    plekZoom: 1.0,
    samenvoegen: [heuvel, buiten, ...KAMERS.map(k => kamers[k].groep), dak, ...wolken],
    intro: [
      ...KAMERS.map((k, i) => ({ obj: kamers[k].groep, start: 0.2 + i * 0.18, soort: 'val' })),
      { obj: dak, start: 1.15, soort: 'val' },
      { obj: wegwijzer, start: 1.3, soort: 'pop' },
      ...bomen.map((b, i) => ({ obj: b, start: 1.2 + i * 0.1, soort: 'pop' })),
      ...wolken.map((w, i) => ({ obj: w, start: 1.0 + i * 0.15, soort: 'pop' })),
    ],
    // De motor roept avond(n) elk beeld op, als laatste stap van het licht.
    avond(n) {
      for (const k of Object.values(kamers)) k.wandMat.emissive.copy(OPLICHT_KLEUR).lerp(k.warm, n);
      daglicht.color.lerpColors(DAG_LICHT, NACHT_LICHT, n);
      kristalMat.emissiveIntensity = 0.15 + n * 1.1;
      kristalGloed.material.opacity = n * 0.55;
      kristalGloed.visible = n > 0.01;
      dakSterAvond = n;
    },
    werkBij(dt, nu, { nacht }) {
      werkRegieBij(dt);
      werkMomentenBij(nu);
      // het lichtje verschijnt aan de staf zodra de verdieping geland is
      if (!lichtje.aan && nu > 1.6) lichtje.zetAan(wereldPunt(tovenaar.top), nu);
      lichtje.werkBij(dt, nu, { nacht });
      const doel = wereldPunt(schermDoel);
      sterretjes.forEach((s, i) => {
        const q = nu - sterretjesT - i * 0.12;
        s.visible = q > 0 && q < 1.5;
        if (!s.visible) return;
        s.position.set(doel.x + (i - 3) * 0.1 * q, doel.y + 0.1 + q * 0.5, doel.z + 0.05);
        s.scale.setScalar(Math.sin(q / 1.5 * Math.PI) * 1.3 + 0.001);
        s.rotation.set(q * 3, q * 4, 0);
      });
      // het schildpadje wandelt heen en weer over de tafel, en draait zich om aan de rand
      const L = 0.62, s = (nu * 0.05) % (2 * L), heen = s < L;
      schildpad.position.x = heen ? -L / 2 + s : L / 2 - (s - L);
      schildpad.rotation.y += ((heen ? Math.PI / 2 : -Math.PI / 2) - schildpad.rotation.y) * (1 - Math.exp(-dt * 2.5));
      poten.forEach((poot, i) => { poot.position.y = Math.max(0, Math.sin(nu * 6 + i * 1.6)) * 0.015; });
      bolGloed.scale.setScalar(1 + Math.sin(nu * 2.5) * 0.06);
      for (const st of dakSterren) if (st.scale.x > 0.9) st.scale.setScalar(1 + Math.sin(nu * st.userData.k * 3) * 0.2 + dakSterAvond * 0.25);
      vlag.rotation.y = Math.sin(nu * 1.4) * 0.22;
      kristal.rotation.y = nu * 0.6;
      for (const w of wolken) w.position.x = -11 + ((nu / 90 + w.userData.start) % 1) * 22;
      // het boeket: sterren schieten uit de dakpunt en vallen traag terug
      const bron = wereldPunt(kristal);
      for (const b of boeket) {
        const q = nu - boeketT - b.userData.later;
        b.visible = q > 0 && q < 2.6;
        if (!b.visible) continue;
        const v = b.userData.v;
        b.position.set(bron.x + v.x * q, bron.y + v.y * q - 1.6 * q * q, bron.z + v.z * q);
        b.scale.setScalar(2.4 * (1 - glad((q - 1.8) / 0.8)) + 0.001);
        b.rotation.set(q * 5, q * 3, 0);
      }
    },
    bijFocus(focus) { if (!regie.loopt) startMoment(focus); },
    bijPlek(id) { if (id && !regie.loopt) startMoment(plekKamer[id], { vertraging: 0.3 }); },
    // na het laden van het lettertype: de borden met hun huidige stand opnieuw tekenen
    tekenAlles() {
      for (const [sleutel, p, teken] of [['code', codeBord.p, tekenCode], ['scherm', scherm.p, tekenScherm], ['periodes', periodeBord.p, tekenPeriodes], ['tabel', tabelBord.p, tekenTabel]]) {
        const w = stand[sleutel];
        stand[sleutel] = null;
        herteken(sleutel, p, teken, Math.max(0, w));
      }
    },
    // Wie minder beweging vraagt, krijgt elke kamer meteen in haar eindstand.
    stil() {
      for (const m of Object.values(momenten)) { m.run = 1; m.zet(m.duur, m); }
      lichtje.stilZetten(wereldPunt(tovenaar.top));
    },
    api: {
      // Start het verhaal. melding wordt opgeroepen bij elke stap (zie regie).
      verhaal({ melding }) {
        if (g.stil) return;
        Object.assign(regie, { loopt: true, t: 0, index: -1, melding, boeket: null });
      },
      stopVerhaal() { regie.loopt = false; regie.melding = null; regie.boeket = null; },
      verhaalLoopt: () => regie.loopt,
    },
  };
}
