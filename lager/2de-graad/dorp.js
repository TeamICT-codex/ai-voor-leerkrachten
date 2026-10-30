// Het dorp: de wereld van Leerlichtjes voor de 2de graad. Vijf plekken zijn
// vijf stations: de bibliotheek, het huis met de slimme speaker, de
// fotowinkel, het park en de school. In het midden ligt het dorpsplein met
// een muziekkiosk; daar wacht het lichtje tot de klas een station kiest. Haalt
// de klas een stempel, dan wappert er een vlag. De motor zit in
// gedeeld/diorama-kern.js, net als bij De stad van morgen.
import {
  T, K, HUID, HAAR, toeval, blok, cilinder, bol, puntdak, groepje, levend, figuur,
  boom, maakPodium, F, paneel,
} from '../../gedeeld/diorama-kern.js';

const PLEIN = new T.Vector3(0.3, 0, 0.9);
const LICHT_PLEIN = new T.Vector3(0.3, 1.35, 1.75);
const DAKPAN = 0xb5523b, LEI = 0x55606b, ZAND = 0xf1e2c0, KASSEI = 0xc9c0b0;
const HERFST = [[K.blad2, K.blad1, K.blad3], [0xf0a24a, 0xe07b39, 0xf2c94c], [K.blad1, K.blad2], [0xe07b39, 0xf2c94c, 0xf0a24a]];

function tekenBord(tekst, nummer, kleur) {
  return ({ ctx, c }) => {
    const W = c.width, H = c.height;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = kleur; ctx.fillRect(0, 0, H, H);
    ctx.fillStyle = '#ffffff'; ctx.font = F(700, H * 0.62); ctx.textAlign = 'center'; ctx.fillText(String(nummer), H / 2, H * 0.74);
    ctx.fillStyle = '#126425'; ctx.font = F(700, H * 0.5); ctx.textAlign = 'left'; ctx.fillText(tekst, H * 1.25, H * 0.68);
  };
}
// De etalage van de fotowinkel: drie ingelijste foto's.
function tekenEtalage({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#dff1f7'; ctx.fillRect(0, 0, W, H);
  const lijst = (x, y, b, h, f) => {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, b, h);
    ctx.save(); ctx.beginPath(); ctx.rect(x + 8, y + 8, b - 16, h - 16); ctx.clip(); f(x + 8, y + 8, b - 16, h - 16); ctx.restore();
  };
  lijst(24, 40, 150, 120, (x, y, b, h) => {
    ctx.fillStyle = '#bfe3ed'; ctx.fillRect(x, y, b, h);
    ctx.fillStyle = '#9fd39b'; ctx.fillRect(x, y + h * 0.65, b, h);
    ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.arc(x + b * 0.78, y + h * 0.28, 14, 0, 7); ctx.fill();
  });
  lijst(196, 24, 120, 150, (x, y, b, h) => {
    ctx.fillStyle = '#fcc89b'; ctx.fillRect(x, y, b, h);
    ctx.fillStyle = '#c68642'; ctx.beginPath(); ctx.arc(x + b / 2, y + h * 0.42, 24, 0, 7); ctx.fill();
    ctx.fillStyle = '#4e9a63'; ctx.fillRect(x + b / 2 - 34, y + h * 0.62, 68, h);
  });
  lijst(338, 48, 150, 110, (x, y, b, h) => {
    ctx.fillStyle = '#7cc3dc'; ctx.fillRect(x, y, b, h);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x + 30, y + h * 0.75); ctx.lineTo(x + 75, y + 18); ctx.lineTo(x + 75, y + h * 0.75); ctx.fill();
    ctx.fillStyle = '#d9534f'; ctx.fillRect(x + 20, y + h * 0.75, 100, 12);
  });
}

export function maakDorp(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwDorp(g));
}

function bouwDorp(g) {
  const { wereld, raamBuiten, maakLichtje, statischeTekening, gloed, kamerLamp, lampMat } = g;
  const r = toeval(23);
  const kamers = {};
  const vlaggen = {};
  const ankers = {};
  const kaders = {};
  const samen = [];
  const intro = [];

  // ── sokkel, straat en plein ──
  const sokkel = groepje(wereld);
  blok(sokkel, 12.4, 0.5, 8.8, K.mint, 0, -0.5, -0.4, { r: 0.24, schaduw: false });
  blok(sokkel, 12.6, 0.3, 9.0, K.groen, 0, -0.78, -0.4, { r: 0.15, schaduw: false });
  const straat = groepje(wereld);
  blok(straat, 12.0, 0.02, 0.8, KASSEI, 0, 0, -1.05, { r: 0.01, schaduw: false });
  // kasseien: een handvol donkere stenen, samengevoegd tot één vorm
  for (let i = 0; i < 46; i++) blok(straat, 0.12, 0.012, 0.09, i % 2 ? 0xb3a998 : 0xd8d0c2, -5.8 + r() * 11.6, 0.012, -1.4 + r() * 0.7, { r: 0.01, schaduw: false });
  blok(straat, 0.6, 0.02, 0.7, KASSEI, PLEIN.x, 0, -0.35, { r: 0.01, schaduw: false });
  cilinder(straat, 1.25, 1.25, 0.03, K.steen, PLEIN.x, 0, PLEIN.z, { seg: 40, schaduw: false });
  cilinder(straat, 1.05, 1.05, 0.032, 0xe0d9cc, PLEIN.x, 0, PLEIN.z, { seg: 40, schaduw: false });
  // de stoep langs de huizen
  blok(straat, 12.0, 0.04, 0.36, 0xe6e0d4, 0, 0, -1.65, { r: 0.01, schaduw: false });
  samen.push(sokkel, straat);

  // de muziekkiosk op het plein
  const kiosk = groepje(wereld, PLEIN.x, 0, PLEIN.z);
  cilinder(kiosk, 0.62, 0.66, 0.14, K.steen, 0, 0.03, 0, { seg: 6 });
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3 + Math.PI / 6;
    cilinder(kiosk, 0.025, 0.025, 0.62, K.groenDonker, Math.cos(a) * 0.52, 0.17, Math.sin(a) * 0.52, { seg: 8 });
  }
  cilinder(kiosk, 0.6, 0.6, 0.05, K.wit, 0, 0.17, 0, { seg: 6, schaduw: false });
  cilinder(kiosk, 0.5, 0.5, 0.06, K.groenDonker, 0, 0.78, 0, { seg: 6 });
  cilinder(kiosk, 0, 0.72, 0.42, K.groen, 0, 0.84, 0, { seg: 6 });
  bol(kiosk, 0.05, K.geel, 0, 1.28, 0, { seg: 10 });
  samen.push(kiosk);
  for (const [x, z, d] of [[-1.0, 0.25, 0.5], [1.55, 0.25, -0.5]]) {
    const bank = groepje(wereld, PLEIN.x + x, 0, PLEIN.z + z);
    bank.rotation.y = d;
    blok(bank, 0.8, 0.05, 0.26, K.hout, 0, 0.26, 0);
    blok(bank, 0.8, 0.2, 0.05, K.hout, 0, 0.33, -0.11);
    for (const bx of [-0.33, 0.33]) blok(bank, 0.05, 0.26, 0.22, K.inkt, bx, 0, 0, { r: 0.01 });
    samen.push(bank);
  }

  // ── een plek = een station ──
  function station(id, nummer, naam, kleur, x, z, b, h, d, bouwVorm, opties = {}) {
    const groep = groepje(wereld, x, 0, z);
    bouwVorm(groep, b, h, d);
    const bordB = opties.bordB ?? Math.min(b * 0.8, 1.7);
    const bordY = opties.bordY ?? h * 0.62;
    const bordZ = opties.bordZ ?? d / 2 + 0.02;
    const bord = groepje(groep);
    blok(bord, bordB, 0.32, 0.04, K.groenDonker, opties.bordX ?? 0, bordY, bordZ, { r: 0.012 });
    statischeTekening(paneel(bord, bordB - 0.06, 0.26, 512, opties.bordX ?? 0, bordY + 0.16, bordZ + 0.025), tekenBord(naam, nummer, kleur));
    const vlag = levend(groepje(groep, opties.vlagX ?? b / 2 - 0.25, opties.dakY ?? h, opties.vlagZ ?? -d / 2 + 0.3));
    cilinder(vlag, 0.02, 0.02, 0.8, K.grijs, 0, 0, 0, { seg: 8 });
    const doek = groepje(vlag, 0, 0.62, 0);
    blok(doek, 0.42, 0.26, 0.015, K.groen, 0.22, -0.13, 0, { r: 0.01 });
    bol(doek, 0.06, K.geel, 0.22, 0, 0.012, { seg: 10, schaduw: false });
    vlag.visible = false;
    vlag.userData.doek = doek;
    vlaggen[id] = vlag;
    const raak = levend(new T.Mesh(new T.BoxGeometry(b + 0.4, h + 0.8, d + 0.4), new T.MeshBasicMaterial({ visible: false })));
    raak.position.set(0, (h + 0.8) / 2, 0);
    raak.userData.kamer = id;
    groep.add(raak);
    kamers[id] = { groep, raak };
    ankers[id] = new T.Vector3(opties.labelX != null ? x + opties.labelX : x - b / 2 + 0.1, opties.labelY ?? h + 0.9, z + d / 2);
    kaders[id] = { min: [x - b / 2 - 0.9, 0, z - d / 2 - 0.4], max: [x + b / 2 + 0.9, opties.kaderY ?? h + 0.9, z + d / 2 + (opties.voor ?? 1.1)], marge: 1.08, hoek: 0.42 };
    samen.push(groep);
    intro.push({ obj: groep, start: 0.3 + nummer * 0.18, soort: 'val' });
    return groep;
  }

  // 1 · de bibliotheek: baksteen met een trapgevel, en een boekenruilkastje
  const bib = station('bibliotheek', 1, 'De bibliotheek', '#7b5ea7', -3.95, -2.6, 2.0, 1.3, 1.4, (gr, b, h, d) => {
    blok(gr, b, h, d, K.baksteen, 0, 0, 0, { r: 0.03 });
    // het dak loopt van voor naar achter, de trapgevel staat aan de straatkant
    const nok = groepje(gr, 0, h, 0);
    nok.rotation.y = Math.PI / 2;
    puntdak(nok, d - 0.1, 0.72, b - 0.12, LEI, 0, 0, 0);
    [b, b * 0.8, b * 0.6, b * 0.4, b * 0.2].forEach((bb, i) => blok(gr, bb, 0.17, 0.14, K.baksteen, 0, h + i * 0.15, d / 2 - 0.07, { r: 0.015 }));
    [b * 0.8, b * 0.6, b * 0.4, b * 0.2].forEach((bb, i) => blok(gr, bb + 0.06, 0.03, 0.17, K.steen, 0, h + (i + 1) * 0.15 - 0.01, d / 2 - 0.07, { r: 0.01, schaduw: false }));
    for (const xx of [-0.6, 0.6]) {
      raamBuiten(gr, xx, 0.3, d / 2, 0.34, 0.52);
      cilinder(gr, 0.21, 0.21, 0.03, K.wit, xx, 0.82, d / 2 + 0.005, { seg: 16, schaduw: false }).rotation.x = Math.PI / 2;
    }
    blok(gr, 0.46, 0.66, 0.04, 0x6d4c8f, 0, 0, d / 2 + 0.01, { r: 0.012 });
    blok(gr, 0.56, 0.05, 0.08, K.steen, 0, 0.66, d / 2 + 0.02, { r: 0.01 });
  }, { bordY: 0.86, dakY: 1.95, vlagX: -0.6, vlagZ: -0.2, kaderY: 2.5, labelY: 2.7 });
  {
    // boekenruilkastje op een paal, met gekleurde ruggen
    const kast = groepje(bib, 1.3, 0, 1.0);
    cilinder(kast, 0.03, 0.03, 0.55, K.houtDonker, 0, 0, 0, { seg: 8 });
    blok(kast, 0.36, 0.32, 0.22, K.groen, 0, 0.55, 0, { r: 0.03 });
    puntdak(kast, 0.42, 0.12, 0.28, DAKPAN, 0, 0.87, 0);
    [K.rood, K.geel, K.zee, K.perzik, K.mint].forEach((k, i) => blok(kast, 0.045, 0.18, 0.04, k, -0.11 + i * 0.055, 0.6, 0.1, { r: 0.006, schaduw: false }));
  }

  // 2 · het huis: wit, met een rood pannendak, een schoorsteen en een groot
  // venster waardoor je de woonkamer met de slimme speaker ziet
  let ring;
  const huis = station('huis', 2, 'Het huis', '#d9534f', 0.2, -2.7, 2.0, 1.0, 1.4, (gr, b, h, d) => {
    const muur = 0.08, vz = d / 2 - muur / 2;
    blok(gr, b, h, muur, K.wit, 0, 0, -d / 2 + muur / 2, { r: 0.02 });
    blok(gr, muur, h, d, K.wit, -b / 2 + muur / 2, 0, 0, { r: 0.02 });
    blok(gr, muur, h, d, K.wit, b / 2 - muur / 2, 0, 0, { r: 0.02 });
    // de voorgevel rond het grote venster (van x -0.2 tot 0.75, y 0.22 tot 0.78)
    blok(gr, b / 2 - 0.2, h, muur, K.wit, (-b / 2 - 0.2) / 2, 0, vz, { r: 0.02 });
    blok(gr, b / 2 - 0.75, h, muur, K.wit, (b / 2 + 0.75) / 2, 0, vz, { r: 0.02 });
    blok(gr, 0.95, 0.22, muur, K.wit, 0.275, 0, vz, { r: 0.01 });
    blok(gr, 0.95, h - 0.78, muur, K.wit, 0.275, 0.78, vz, { r: 0.01 });
    blok(gr, 1.03, 0.04, 0.14, K.houtDonker, 0.275, 0.2, vz + 0.03, { r: 0.01 });
    blok(gr, b - 0.1, 0.04, d - 0.1, K.wit, 0, h - 0.04, 0, { r: 0.01, schaduw: false });
    puntdak(gr, b + 0.18, 0.75, d + 0.2, DAKPAN, 0, h, 0);
    cilinder(gr, 0.09, 0.09, 0.5, K.baksteen, -0.55, h + 0.25, -0.25, { seg: 4 });
    // de voordeur met een raampje erin, en een luik naast het kleine raam
    blok(gr, 0.36, 0.62, 0.04, K.groen, -0.62, 0, d / 2 + 0.005, { r: 0.012 });
    bol(gr, 0.025, K.geel, -0.5, 0.32, d / 2 + 0.03, { seg: 8 });
    raamBuiten(gr, b / 2 - 0.2, 0.36, d / 2, 0.2, 0.3);
    // binnen: een tapijt, een zetel, een lamp en het tafeltje met de speaker
    blok(gr, 1.2, 0.012, 0.7, 0xf6d7b0, 0.1, 0, -0.05, { r: 0.01, schaduw: false });
    blok(gr, 0.9, 0.2, 0.3, K.zee, 0.15, 0, -0.42, { r: 0.05 });
    blok(gr, 0.9, 0.3, 0.1, 0x4b93b3, 0.15, 0, -0.55, { r: 0.04 });
    for (const xx of [-0.33, 0.63]) blok(gr, 0.12, 0.28, 0.32, 0x4b93b3, xx, 0, -0.42, { r: 0.04 });
    blok(gr, 0.36, 0.26, 0.03, K.perzik, 0.15, 0.52, -d / 2 + 0.09, { r: 0.01, schaduw: false });
    cilinder(gr, 0.015, 0.02, 0.6, K.inkt, -0.55, 0, -0.35, { seg: 8 });
    cilinder(gr, 0.07, 0.12, 0.12, K.geel, -0.55, 0.6, -0.35, { seg: 14 });
    blok(gr, 0.32, 0.03, 0.22, K.hout, 0.25, 0.25, 0.25, { r: 0.01 });
    for (const [lx, lz] of [[0.12, 0.17], [0.38, 0.17], [0.12, 0.33], [0.38, 0.33]]) blok(gr, 0.025, 0.25, 0.025, K.houtDonker, lx, 0, lz, { r: 0, schaduw: false });
    cilinder(gr, 0.05, 0.055, 0.12, K.inkt, 0.25, 0.28, 0.25, { seg: 16 });
    ring = levend(cilinder(gr, 0.046, 0.046, 0.012, 0, 0.25, 0.4, 0.25, { seg: 16, schaduw: false, materiaal: new T.MeshBasicMaterial({ color: 0x5b6573 }) }));
  }, { bordY: 0.645, bordB: 0.8, bordX: -0.6, bordZ: 0.73, dakY: 1.55, vlagX: 0.65, vlagZ: -0.1, kaderY: 2.2, voor: 1.2 });
  const rook = [0, 1, 2].map(i => levend(bol(huis, 0.09, 0, -0.55, 1.8, -0.25, { materiaal: new T.MeshLambertMaterial({ color: 0xf2f2f2, transparent: true, opacity: 0.7 }), seg: 10, schaduw: false })));
  rook.forEach((b, i) => { b.userData.verschuiving = i / 3; });
  {
    // de voortuin: een hekje, bloemen, een brievenbus en een fiets tegen de gevel
    for (let i = 0; i < 9; i++) blok(huis, 0.05, 0.24, 0.04, K.wit, -1.0 + i * 0.25, 0, 1.08, { r: 0.01 });
    blok(huis, 2.05, 0.04, 0.03, K.wit, 0, 0.16, 1.08, { r: 0.01 });
    for (let i = 0; i < 7; i++) bol(huis, 0.05, [K.roos, K.geel, K.roosDiep, K.wit][i % 4], -0.95 + i * 0.13 + (i > 3 ? 1.05 : 0), 0.07, 0.92, { seg: 8 });
    cilinder(huis, 0.02, 0.02, 0.36, K.inkt, 0.95, 0, 1.0, { seg: 6 });
    blok(huis, 0.12, 0.12, 0.18, K.rood, 0.95, 0.36, 1.0, { r: 0.03 });
    const fiets = groepje(huis, -1.18, 0, 0.45);
    fiets.rotation.y = Math.PI / 2;
    for (const xx of [-0.17, 0.17]) {
      const wiel = cilinder(fiets, 0.11, 0.11, 0.02, K.inkt, xx, 0, 0, { seg: 16 });
      wiel.rotation.x = Math.PI / 2; wiel.position.y = 0.11;
    }
    blok(fiets, 0.36, 0.03, 0.03, K.rood, 0, 0.18, 0, { r: 0.01 });
    blok(fiets, 0.03, 0.12, 0.03, K.rood, -0.06, 0.18, 0, { r: 0.01 });
    blok(fiets, 0.1, 0.03, 0.05, K.inkt, -0.06, 0.3, 0, { r: 0.01 });
  }

  // 3 · de fotowinkel: geel, met een gestreepte luifel, een etalage en een
  // groot fototoestel op het dak dat af en toe flitst
  let flits, flitsGloed;
  const winkel = station('fotowinkel', 3, 'De fotowinkel', '#f08a3c', 4.05, -2.55, 1.8, 1.25, 1.4, (gr, b, h, d) => {
    blok(gr, b, h, d, 0xfbf3c4, 0, 0, 0, { r: 0.04 });
    blok(gr, b + 0.08, 0.12, d + 0.08, K.oranje, 0, h, 0, { r: 0.03 });
    blok(gr, 1.2, 0.58, 0.04, K.inkt, -0.15, 0.16, d / 2 + 0.01, { r: 0.012 });
    statischeTekening(paneel(gr, 1.12, 0.5, 512, -0.15, 0.45, d / 2 + 0.035), tekenEtalage);
    blok(gr, 0.32, 0.64, 0.04, K.oranje, 0.68, 0, d / 2 + 0.01, { r: 0.012 });
    // de luifel: strepen die schuin naar voren lopen
    const luifel = groepje(gr, -0.15, 0.86, d / 2 + 0.02);
    luifel.rotation.x = 0.5;
    for (let i = 0; i < 7; i++) blok(luifel, 0.19, 0.02, 0.42, i % 2 ? K.wit : K.rood, -0.57 + i * 0.19, 0, 0.21, { r: 0.004 });
    // het fototoestel op het dak
    const toestel = groepje(gr, 0.1, h + 0.12, 0.2);
    blok(toestel, 0.62, 0.36, 0.26, K.inkt, 0, 0, 0, { r: 0.05 });
    blok(toestel, 0.18, 0.08, 0.2, K.inkt, -0.16, 0.36, 0, { r: 0.02 });
    const lens = cilinder(toestel, 0.12, 0.13, 0.12, K.grijs, 0.04, 0, 0.13, { seg: 20 });
    lens.rotation.x = Math.PI / 2; lens.position.set(0.04, 0.18, 0.18);
    const glas = cilinder(toestel, 0.08, 0.08, 0.02, K.zee, 0.04, 0, 0.25, { seg: 18, schaduw: false });
    glas.rotation.x = Math.PI / 2; glas.position.set(0.04, 0.18, 0.245);
    flits = levend(bol(toestel, 0.05, 0, 0.22, 0.3, 0.14, { materiaal: new T.MeshBasicMaterial({ color: 0xffffff }), schaduw: false, seg: 10 }));
    flitsGloed = gloed(toestel, 0.22, 0.3, 0.2, 1.2);
  }, { bordY: 0.95, bordB: 1.5, dakY: 1.37, vlagX: -0.6, vlagZ: -0.3, kaderY: 2.6, labelY: 2.7 });

  // 4 · het park: een poort, een vijver met eendjes, een schommel en een
  // zandpad met voetstappen
  let eendjes = [], zitje;
  const PAD = [[0, 0.95], [0.12, 0.55], [0.05, 0.15], [-0.25, -0.15], [-0.6, -0.2]];
  const park = station('park', 4, 'Het park', '#4e9a63', -3.7, 1.9, 3.4, 1.0, 2.4, (gr, b, h, d) => {
    blok(gr, b, 0.03, d, 0x9fd39b, 0, 0, 0, { r: 0.08, schaduw: false });
    // de poort aan de voorkant
    for (const xx of [-0.62, 0.62]) {
      blok(gr, 0.18, 0.95, 0.18, K.baksteen, xx, 0, d / 2 - 0.1, { r: 0.02 });
      bol(gr, 0.08, K.steen, xx, 1.02, d / 2 - 0.1, { seg: 10 });
    }
    blok(gr, 1.42, 0.08, 0.08, K.groenDonker, 0, 0.92, d / 2 - 0.1, { r: 0.02 });
    // een haag rond het park, met een opening voor de poort
    for (const [hx, hz, hb, hd] of [[-1.15, d / 2 - 0.1, 1.0, 0.18], [1.15, d / 2 - 0.1, 1.0, 0.18], [0, -d / 2 + 0.1, b - 0.1, 0.18], [-b / 2 + 0.1, 0, 0.18, d - 0.1], [b / 2 - 0.1, 0, 0.18, d - 0.1]]) {
      blok(gr, hb, 0.26, hd, K.blad2, hx, 0.02, hz, { r: 0.07 });
    }
    // het zandpad van de poort naar de vijver, met voetstappen
    const pad = PAD;
    for (const [px, pz] of pad) cilinder(gr, 0.3, 0.3, 0.035, ZAND, px, 0.01, pz, { seg: 20, schaduw: false });
    for (let i = 0; i < 8; i++) {
      const t = i / 7, p = Math.floor(t * (pad.length - 1)), q = Math.min(pad.length - 1, p + 1), f = t * (pad.length - 1) - p;
      const px = pad[p][0] + (pad[q][0] - pad[p][0]) * f + (i % 2 ? 0.06 : -0.06), pz = pad[p][1] + (pad[q][1] - pad[p][1]) * f;
      const stap = cilinder(gr, 0.035, 0.035, 0.012, 0xc9ad7f, px, 0.045, pz, { seg: 10, schaduw: false });
      stap.scale.set(1, 1, 1.6);
    }
    // de vijver
    const vijver = groepje(gr, -0.75, 0, -0.45);
    vijver.scale.set(1, 1, 0.62);
    cilinder(vijver, 0.72, 0.72, 0.05, K.steen, 0, 0.01, 0, { seg: 28, schaduw: false });
    cilinder(vijver, 0.64, 0.64, 0.06, K.water, 0, 0.01, 0, { seg: 28, schaduw: false });
    eendjes = [0, 1].map(i => {
      const eend = levend(groepje(gr, -0.75, 0.06, -0.45));
      bol(eend, 0.07, i ? K.wit : 0xf2c94c, 0, 0.04, 0, { seg: 10 });
      bol(eend, 0.045, i ? K.wit : 0xf2c94c, 0.06, 0.12, 0, { seg: 10 });
      blok(eend, 0.05, 0.018, 0.03, K.oranje, 0.11, 0.105, 0, { r: 0.006, schaduw: false });
      eend.userData.fase = i * Math.PI;
      return eend;
    });
    // een schommel
    const schommel = groepje(gr, 0.95, 0, -0.45);
    for (const xx of [-0.3, 0.3]) for (const zz of [-0.14, 0.14]) {
      const poot = blok(schommel, 0.035, 0.75, 0.035, K.zee, xx, 0, zz, { r: 0.01 });
      poot.rotation.x = zz > 0 ? 0.18 : -0.18;
    }
    blok(schommel, 0.7, 0.04, 0.04, K.zee, 0, 0.72, 0, { r: 0.01 });
    zitje = levend(groepje(schommel, 0, 0.73, 0));
    for (const xx of [-0.1, 0.1]) blok(zitje, 0.01, 0.5, 0.01, K.inkt, xx, -0.5, 0, { r: 0, schaduw: false });
    blok(zitje, 0.26, 0.03, 0.1, K.rood, 0, -0.52, 0, { r: 0.01 });
    // een bank en bloemen
    const bank = groepje(gr, 0.95, 0, 0.55);
    blok(bank, 0.6, 0.05, 0.22, K.hout, 0, 0.24, 0);
    blok(bank, 0.6, 0.18, 0.04, K.hout, 0, 0.3, -0.09);
    for (const bx of [-0.25, 0.25]) blok(bank, 0.04, 0.24, 0.18, K.inkt, bx, 0, 0, { r: 0.01 });
    for (let i = 0; i < 10; i++) bol(gr, 0.045, [K.roos, K.geel, K.wit, K.roosDiep][i % 4], -1.45 + (i % 5) * 0.12, 0.06, 0.65 + Math.floor(i / 5) * 0.14, { seg: 8 });
    for (const [tx, tz, s, k] of [[-1.3, -0.7, 0.7, 0], [1.35, -0.85, 0.62, 1], [-0.1, -0.85, 0.55, 3]]) boom(gr, tx, tz, s, HERFST[k]);
  }, { bordY: 0.98, bordB: 1.3, bordZ: 1.15, dakY: 0.98, vlagX: 0.62, vlagZ: 1.1, kaderY: 1.5, labelX: -0.6, labelY: 1.75, voor: 0.9 });

  // Snuf, de speurneus van station 4, snuffelt de voetstappen af.
  const snuf = levend(groepje(park, 0, 0, 0.9));
  {
    blok(snuf, 0.2, 0.09, 0.09, K.hout, 0, 0.07, 0, { r: 0.035 });
    for (const [lx, lz] of [[-0.07, -0.03], [-0.07, 0.03], [0.07, -0.03], [0.07, 0.03]]) blok(snuf, 0.025, 0.07, 0.025, K.houtDonker, lx, 0, lz, { r: 0.008 });
    const kop = groepje(snuf, 0.12, 0.12, 0);
    blok(kop, 0.09, 0.08, 0.08, K.hout, 0.02, -0.02, 0, { r: 0.03 });
    blok(kop, 0.04, 0.03, 0.04, K.inkt, 0.075, -0.015, 0, { r: 0.01 });
    for (const zz of [-0.045, 0.045]) blok(kop, 0.03, 0.06, 0.015, K.houtDonker, -0.005, -0.03, zz, { r: 0.008 });
    snuf.userData.kop = kop;
    const staart = groepje(snuf, -0.1, 0.13, 0);
    blok(staart, 0.015, 0.07, 0.015, K.houtDonker, 0, 0, 0, { r: 0.006 }).rotation.z = 0.5;
    snuf.userData.staart = staart;
  }

  // 5 · de school: één verdieping, een klokkentorentje en een speelplaats
  let bel;
  const kinderen = [];
  station('school', 5, 'De school', '#5fa9c9', 3.8, 1.55, 2.6, 0.95, 1.2, (gr, b, h, d) => {
    blok(gr, b, h, d, K.perzik, 0, 0, 0, { r: 0.04 });
    puntdak(gr, b + 0.18, 0.55, d + 0.2, DAKPAN, 0, h, 0);
    for (const xx of [-1.1, -0.74, 0.74, 1.1]) raamBuiten(gr, xx, 0.3, d / 2, 0.28, 0.36);
    blok(gr, 0.42, 0.62, 0.04, K.zee, 0, 0, d / 2 + 0.01, { r: 0.012 });
    const toren = groepje(gr, 0, h + 0.3, 0);
    blok(toren, 0.3, 0.32, 0.3, K.wit, 0, 0, 0, { r: 0.02 });
    puntdak(toren, 0.38, 0.22, 0.38, DAKPAN, 0, 0.32, 0);
    bel = levend(groepje(toren, 0, 0.27, 0.16));
    cilinder(bel, 0.02, 0.07, 0.1, 0xe0b23c, 0, -0.1, 0, { seg: 12 });
    // de speelplaats met een hinkelpad en een doeltje
    blok(gr, b + 0.3, 0.02, 1.25, K.speelplaats, 0, 0, d / 2 + 0.68, { r: 0.04, schaduw: false });
    for (const [hx, hz] of [[-0.9, 1.05], [-0.9, 1.25], [-1.0, 1.45], [-0.8, 1.45], [-0.9, 1.65]]) blok(gr, 0.17, 0.008, 0.17, K.wit, hx, 0.02, hz, { r: 0, schaduw: false });
    const doel = groepje(gr, 0.95, 0, 1.55);
    for (const xx of [-0.25, 0.25]) blok(doel, 0.03, 0.3, 0.03, K.wit, xx, 0, 0, { r: 0.008 });
    blok(doel, 0.53, 0.03, 0.03, K.wit, 0, 0.3, 0, { r: 0.008 });
    blok(doel, 0.5, 0.28, 0.01, 0xdfe6e8, 0, 0.01, -0.14, { r: 0, schaduw: false });
  }, { bordY: 0.63, bordB: 1.1, dakY: 1.2, vlagX: 1.0, vlagZ: -0.2, kaderY: 2.2, voor: 1.8 });
  {
    const schoolPos = kamers.school.groep.position;
    for (const [i, kleur] of [K.geel, K.rood, K.mint].entries()) {
      kinderen.push({
        f: figuur(wereld, { x: schoolPos.x, y: 0, z: schoolPos.z + 1.35, shirt: kleur, huid: HUID[(i * 2 + 1) % HUID.length], haar: HAAR[i % HAAR.length], schaal: 0.66 }),
        fase: i * 2.1, straal: 0.42 + i * 0.08,
      });
    }
  }
  // een bal die over de speelplaats rolt
  const bal = levend(bol(wereld, 0.05, K.wit, 4.3, 0.05, 3.0, { seg: 12 }));

  // ── de molen, de wei met koeien, bomen en lantaarns ──
  const molen = groepje(wereld, -5.55, 0, -3.85);
  cilinder(molen, 0.3, 0.44, 1.5, 0xe9e2d4, 0, 0, 0, { seg: 16 });
  cilinder(molen, 0.46, 0.46, 0.06, K.houtDonker, 0, 0.55, 0, { seg: 16 });
  cilinder(molen, 0.02, 0.36, 0.38, LEI, 0, 1.5, 0, { seg: 16 });
  blok(molen, 0.16, 0.26, 0.04, K.houtDonker, 0, 0, 0.42, { r: 0.01 });
  const wieken = levend(groepje(molen, 0, 1.55, 0.34));
  for (let i = 0; i < 4; i++) {
    const wiek = groepje(wieken);
    wiek.rotation.z = i * Math.PI / 2;
    blok(wiek, 0.04, 1.0, 0.03, K.houtDonker, 0, 0, 0, { r: 0.008 });
    blok(wiek, 0.16, 0.7, 0.01, K.wit, 0.1, 0.28, 0.01, { r: 0.004 });
  }
  bol(wieken, 0.06, K.inkt, 0, 0, 0.03, { seg: 10 });
  samen.push(molen);
  intro.push({ obj: molen, start: 1.35, soort: 'pop' });

  const wei = groepje(wereld, 5.55, 0, 0.15);
  blok(wei, 1.1, 0.025, 1.2, 0xa8d8a0, 0, 0, 0, { r: 0.05, schaduw: false });
  for (const [hx, hz, hb, hd] of [[0, -0.58, 1.1, 0.03], [0, 0.58, 1.1, 0.03], [-0.54, 0, 0.03, 1.2]]) {
    blok(wei, hb, 0.03, hd, K.wit, hx, 0.18, hz, { r: 0.005 });
    blok(wei, hb, 0.03, hd, K.wit, hx, 0.08, hz, { r: 0.005 });
  }
  for (let i = 0; i < 5; i++) blok(wei, 0.04, 0.24, 0.04, K.houtDonker, -0.54, 0, -0.55 + i * 0.275, { r: 0.008 });
  const koeKop = [];
  for (const [kx, kz, kd] of [[0.05, -0.2, 0.4], [0.15, 0.3, -2.6]]) {
    const koe = groepje(wei, kx, 0, kz);
    koe.rotation.y = kd;
    blok(koe, 0.42, 0.2, 0.22, K.wit, 0, 0.16, 0, { r: 0.06 });
    blok(koe, 0.16, 0.16, 0.225, K.inkt, -0.08, 0.2, 0, { r: 0.05 });
    blok(koe, 0.1, 0.1, 0.225, K.inkt, 0.12, 0.24, 0, { r: 0.04 });
    for (const [lx, lz] of [[-0.15, -0.07], [-0.15, 0.07], [0.15, -0.07], [0.15, 0.07]]) blok(koe, 0.05, 0.16, 0.05, K.wit, lx, 0, lz, { r: 0.015 });
    const kop = levend(groepje(koe, 0.24, 0.26, 0));
    blok(kop, 0.14, 0.14, 0.14, K.wit, 0.05, -0.05, 0, { r: 0.04 });
    blok(kop, 0.06, 0.07, 0.11, K.roos, 0.12, -0.06, 0, { r: 0.025 });
    for (const zz of [-0.06, 0.06]) blok(kop, 0.02, 0.06, 0.02, K.steen, 0.02, 0.07, zz, { r: 0.006 });
    kop.userData.fase = kx * 7;
    koeKop.push(kop);
  }
  samen.push(wei);
  intro.push({ obj: wei, start: 1.3, soort: 'pop' });

  [[-1.75, -3.65, 0.85], [2.2, -3.75, 0.8], [5.6, -3.7, 0.72], [-5.6, -0.15, 0.7], [-2.35, -0.15, 0.5], [2.35, 0.05, 0.55], [-0.95, 2.95, 0.62], [1.65, 3.25, 0.55], [-5.75, 3.35, 0.6]].forEach(([x, z, s], i) => {
    const b = boom(wereld, x, z, s, HERFST[i % HERFST.length]);
    samen.push(b);
    intro.push({ obj: b, start: 1.2 + i * 0.05, soort: 'pop' });
  });
  {
    // een haag achteraan en grassprietjes in één tekenbeurt
    for (let i = 0; i < 9; i++) blok(sokkel, 1.3, 0.3 + r() * 0.1, 0.36, i % 2 ? K.blad2 : 0x5aa56d, -5.3 + i * 1.33, 0, -4.55, { r: 0.12 });
    const spriet = new T.ConeGeometry(0.035, 0.13, 5);
    spriet.translate(0, 0.065, 0);
    const n = 80;
    const gras = levend(new T.InstancedMesh(spriet, new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), n));
    const m4 = new T.Matrix4(), kleur = new T.Color();
    const bezet = [[-3.95, -2.6, 1.3, 1.1], [0.2, -2.7, 1.3, 1.2], [4.05, -2.55, 1.2, 1.2], [-3.7, 1.9, 1.9, 1.4], [3.8, 1.9, 1.6, 1.7], [PLEIN.x, PLEIN.z, 1.4, 1.4], [0, -1.15, 6.2, 0.75], [5.55, 0.15, 0.7, 0.75], [-5.55, -3.85, 0.6, 0.6]];
    let i = 0;
    while (i < n) {
      const x = (r() - 0.5) * 11.6, z = -4.3 + r() * 7.9;
      if (!bezet.every(([cx, cz, hx, hz]) => Math.abs(x - cx) > hx || Math.abs(z - cz) > hz)) continue;
      const sc = 0.7 + r() * 0.8;
      m4.makeScale(sc, sc, sc).setPosition(x, 0, z);
      gras.setMatrixAt(i, m4);
      gras.setColorAt(i, kleur.setHex([K.blad1, K.blad2, 0xa6d3b0][i % 3]));
      i++;
    }
    gras.receiveShadow = true;
    wereld.add(gras);
  }
  // ouderwetse lantaarns langs de straat
  for (const x of [-4.7, -1.6, 2.1, 5.2]) {
    const l = groepje(wereld, x, 0, -0.55);
    cilinder(l, 0.025, 0.035, 0.95, K.groenDonker, 0, 0, 0, { seg: 8 });
    blok(l, 0.12, 0.14, 0.12, K.groenDonker, 0, 0.95, 0, { r: 0.02 });
    bol(l, 0.045, 0, 0, 1.02, 0, { materiaal: lampMat, schaduw: false, seg: 10 });
    cilinder(l, 0, 0.1, 0.07, K.groenDonker, 0, 1.09, 0, { seg: 4 });
    gloed(l, 0, 1.02, 0, 0.8);
    samen.push(l);
  }
  // een tractor rijdt door de straat
  const tractor = levend(groepje(wereld, 0, 0.02, -1.25));
  blok(tractor, 0.5, 0.2, 0.3, K.groen, 0.1, 0.12, 0, { r: 0.04 });
  blok(tractor, 0.26, 0.28, 0.3, K.groen, -0.14, 0.2, 0, { r: 0.03 });
  blok(tractor, 0.22, 0.2, 0.31, K.blauw, -0.14, 0.24, 0, { r: 0.02 });
  blok(tractor, 0.3, 0.04, 0.34, K.groenDonker, -0.14, 0.48, 0, { r: 0.015 });
  cilinder(tractor, 0.02, 0.02, 0.18, K.inkt, 0.26, 0.3, -0.08, { seg: 6 });
  for (const zz of [-0.18, 0.18]) {
    const groot = cilinder(tractor, 0.15, 0.15, 0.08, K.inkt, -0.16, 0, zz, { seg: 16 });
    groot.rotation.x = Math.PI / 2; groot.position.y = 0.15;
    const klein = cilinder(tractor, 0.08, 0.08, 0.06, K.inkt, 0.28, 0, zz, { seg: 12 });
    klein.rotation.x = Math.PI / 2; klein.position.y = 0.08;
  }
  // mensen op het plein, rond de kiosk
  const wandelaars = [
    { shirt: K.perzik, huid: HUID[2], haar: HAAR[0], schaal: 0.72, straal: 1.0, snel: 0.32, fase: 0 },
    { shirt: K.zee, huid: HUID[4], haar: HAAR[4], schaal: 0.7, straal: 1.0, snel: 0.32, fase: 0.55 },
    { shirt: K.roos, huid: HUID[3], haar: HAAR[3], schaal: 1, straal: 1.4, snel: -0.2, fase: 2 },
    { shirt: K.geel, huid: HUID[1], haar: HAAR[2], schaal: 0.95, straal: 1.4, snel: -0.2, fase: 2.4 },
  ].map(w => ({ ...w, f: figuur(wereld, { x: PLEIN.x, y: 0, z: PLEIN.z, shirt: w.shirt, huid: w.huid, haar: w.haar, schaal: w.schaal }) }));

  // ── het lichtje ──
  const lichtje = maakLichtje();
  const STATIONS = ['bibliotheek', 'huis', 'fotowinkel', 'park', 'school'];
  const lichtPlek = id => {
    const k = kamers[id].groep.position;
    return new T.Vector3(k.x, 1.0, k.z + 1.25);
  };

  kamerLamp(-3.95, 0.8, -1.7, 2);
  kamerLamp(0.45, 0.6, -2.6, 2.4);
  kamerLamp(3.8, 0.6, 2.4, 2);

  return {
    kamers,
    ankers,
    kaders: {
      overzicht: { min: [-6.2, -0.9, -5.0], max: [6.2, 3.2, 4.0], marge: 1.02, hoek: 0.62 },
      ...kaders,
    },
    zaalVolgorde: ['overzicht', ...STATIONS],
    pinGroep: () => 'geen',
    samenvoegen: samen,
    intro: [
      ...intro,
      ...wandelaars.map((w, i) => ({ obj: w.f, start: 1.5 + i * 0.1, soort: 'pop' })),
      ...kinderen.map((k, i) => ({ obj: k.f, start: 1.55 + i * 0.1, soort: 'pop' })),
      { obj: tractor, start: 1.6, soort: 'pop' },
      { obj: kiosk, start: 0.2, soort: 'pop' },
    ],
    bijFocus(f) {
      if (!lichtje.aan) return;
      lichtje.vlieg(kamers[f] ? lichtPlek(f) : LICHT_PLEIN, () => {});
    },
    stil() {
      lichtje.stilZetten(LICHT_PLEIN);
    },
    werkBij(dt, nu, { nacht }) {
      if (nu > 1.7 && !lichtje.aan) lichtje.zetAan(LICHT_PLEIN, nu);
      lichtje.werkBij(dt, nu, { denkt: false, nacht });
      for (const b of rook) {
        const p = (nu * 0.22 + b.userData.verschuiving) % 1;
        b.position.set(-0.55 + p * 0.25, 1.78 + p * 0.8, -0.25);
        b.scale.setScalar(0.7 + p * 1.1);
        b.material.opacity = 0.6 * (1 - p);
      }
      // De speaker roept zichzelf niet: om de acht seconden zegt iemand "Hé Bolleke".
      {
        const p = nu % 8;
        const aan = p > 5.5 && p < 7.5;
        ring.material.color.setHex(aan ? 0x39b4ff : 0x5b6573);
        ring.scale.setScalar(aan ? 1 + Math.sin(nu * 9) * 0.06 : 1);
      }
      {
        const p = nu % 7;
        const aan = p < 0.12;
        flits.visible = aan;
        flitsGloed.visible = aan;
        flitsGloed.material.opacity = aan ? 1 : 0;
      }
      // De eendjes staan in de groep van het park: hun plaats is ten opzichte van het park.
      for (const e of eendjes) {
        const a = nu * 0.35 + e.userData.fase;
        e.position.set(-0.75 + Math.cos(a) * 0.4, 0.06 + Math.sin(nu * 3 + e.userData.fase) * 0.008, -0.45 + Math.sin(a) * 0.22);
        e.rotation.y = -a - Math.PI / 2;
      }
      zitje.rotation.x = Math.sin(nu * 1.9) * 0.45;
      {
        // heen en weer over het zandpad, met de neus naar de grond
        const p = (nu * 0.06) % 2, t = p < 1 ? p : 2 - p;
        const f = t * (PAD.length - 1), i = Math.min(PAD.length - 2, Math.floor(f)), q = f - i;
        const [x0, z0] = PAD[i], [x1, z1] = PAD[i + 1];
        snuf.position.set(x0 + (x1 - x0) * q, 0.035, z0 + (z1 - z0) * q);
        const richting = Math.atan2(z1 - z0, x1 - x0);
        snuf.rotation.y = -(p < 1 ? richting : richting + Math.PI);
        snuf.userData.kop.rotation.z = -0.35 + Math.sin(nu * 6) * 0.12;
        snuf.userData.staart.rotation.x = Math.sin(nu * 14) * 0.5;
      }
      wieken.rotation.z = -nu * 0.6;
      bel.rotation.z = Math.sin(nu * 2.4) * (nu % 12 < 2 ? 0.4 : 0.04);
      for (const kop of koeKop) kop.rotation.z = -0.25 + Math.sin(nu * 0.6 + kop.userData.fase) * 0.25;
      {
        const p = (nu % 30) / 30, heen = p < 0.5, q = heen ? p * 2 : (p - 0.5) * 2;
        tractor.position.x = heen ? -5.3 + q * 10.6 : 5.3 - q * 10.6;
        tractor.position.z = heen ? -0.85 : -1.25;
        tractor.rotation.y = heen ? Math.PI : 0;
        tractor.position.y = 0.02 + Math.abs(Math.sin(nu * 9)) * 0.008;
      }
      for (const w of wandelaars) {
        const hoek = nu * w.snel + w.fase;
        w.f.position.set(PLEIN.x + Math.cos(hoek) * w.straal, Math.abs(Math.sin(nu * 7 + w.fase)) * 0.02, PLEIN.z + Math.sin(hoek) * w.straal * 0.7);
        w.f.rotation.y = -hoek + (w.snel > 0 ? Math.PI : 0);
        const [l, rr] = w.f.userData.benen;
        l.rotation.x = Math.sin(nu * 7 + w.fase) * 0.35; rr.rotation.x = -l.rotation.x;
      }
      {
        const s = kamers.school.groep.position;
        kinderen.forEach((k, i) => {
          const hoek = nu * (1.1 + i * 0.15) + k.fase;
          k.f.position.set(s.x - 0.1 + Math.cos(hoek) * k.straal, Math.abs(Math.sin(nu * 11 + k.fase)) * 0.05, s.z + 1.4 + Math.sin(hoek) * k.straal * 0.45);
          k.f.rotation.y = -hoek + Math.PI;
          const [l, rr] = k.f.userData.benen;
          l.rotation.x = Math.sin(nu * 11 + k.fase) * 0.6; rr.rotation.x = -l.rotation.x;
        });
        bal.position.set(s.x + 0.45 + Math.sin(nu * 1.3) * 0.35, 0.05, s.z + 1.55 + Math.cos(nu * 0.9) * 0.12);
      }
      for (const v of Object.values(vlaggen)) if (v.visible) v.userData.doek.rotation.y = Math.sin(nu * 3 + v.position.x) * 0.25;
    },
    api: {
      // Zet de vlag op het dak als de klas het station afrondde.
      stempel(id, aan) { if (vlaggen[id]) vlaggen[id].visible = !!aan; },
    },
  };
}
