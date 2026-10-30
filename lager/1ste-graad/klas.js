// De klas van de juf: de wereld van Leerlichtjes voor de 1ste graad. Een
// klaslokaal als een poppenhuis: een achterwand met het digibord, een zijwand
// met de kapstok, en vijf hoeken die vijf stations zijn: de ontdekhoek, de
// bouwhoek, de kring, de laatjeskast en het bureau van de juf. In de kring
// wacht het lichtje. Haalt de klas een stempel, dan draait er een gouden ster
// boven de hoek. De motor zit in gedeeld/diorama-kern.js.
import {
  T, K, HUID, HAAR, blok, cilinder, bol, groepje, levend, figuur,
  stoel, plant, laptop, maakPodium, F, paneel, mat,
} from '../../gedeeld/diorama-kern.js';

const ACHTER = -4.3, LINKS = -5.75, WAND = 2.6;
const MUUR = 0xf7f2ea, LAMBRISERING = 0xddf0e2, VLOER = 0xe9d4b0;
const KRING = new T.Vector3(0.3, 0, 0.2);
const LICHT_KRING = new T.Vector3(0.3, 0.95, 0.2);
const VROLIJK = [K.rood, K.oranje, 0xf2c230, K.blad2, K.zee, 0x7b5ea7, K.roos];

function tekenBord(tekst, nummer, kleur) {
  return ({ ctx, c }) => {
    const W = c.width, H = c.height;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = kleur; ctx.fillRect(0, 0, H, H);
    ctx.fillStyle = '#ffffff'; ctx.font = F(700, H * 0.62); ctx.textAlign = 'center'; ctx.fillText(String(nummer), H / 2, H * 0.74);
    ctx.fillStyle = '#126425'; ctx.font = F(700, H * (tekst.length > 16 ? 0.4 : 0.5)); ctx.textAlign = 'left'; ctx.fillText(tekst, H * 1.25, H * 0.66);
  };
}
function tekenDigibord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, H * 0.17); ctx.textAlign = 'left'; ctx.fillText('Goeiemorgen!', W * 0.06, H * 0.24);
  ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, H * 0.09); ctx.fillText('Vandaag ontdekken we hoe een computer werkt.', W * 0.06, H * 0.4);
  // het lichtje
  const g = ctx.createRadialGradient(W * 0.8, H * 0.66, 4, W * 0.8, H * 0.66, H * 0.26);
  g.addColorStop(0, 'rgba(255,207,58,1)'); g.addColorStop(0.55, 'rgba(255,207,58,.9)'); g.addColorStop(1, 'rgba(255,207,58,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.66, H * 0.26, 0, 7); ctx.fill();
  ctx.fillStyle = '#fffbe6'; ctx.beginPath(); ctx.arc(W * 0.78, H * 0.62, H * 0.05, 0, 7); ctx.fill();
  const kleuren = ['#d9534f', '#f08a3c', '#f2c230', '#4e9a63', '#5fa9c9'];
  ['a', 'b', 'c', '1', '2', '3'].forEach((t, i) => {
    ctx.fillStyle = kleuren[i % kleuren.length]; ctx.font = F(700, H * 0.16);
    ctx.fillText(t, W * (0.07 + i * 0.09), H * 0.78);
  });
}
function tekenFries({ ctx, c }) {
  const W = c.width, H = c.height, kleuren = ['#d9534f', '#f08a3c', '#f2c230', '#4e9a63', '#5fa9c9', '#7b5ea7'];
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const b = W / letters.length;
  [...letters].forEach((l, i) => {
    ctx.fillStyle = kleuren[i % kleuren.length]; ctx.fillRect(i * b + 3, 2, b - 6, H - 4);
    ctx.fillStyle = '#ffffff'; ctx.font = F(700, H * 0.7); ctx.textAlign = 'center'; ctx.fillText(l, i * b + b / 2, H * 0.76);
  });
}

export function maakKlas(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwKlas(g));
}

function bouwKlas(g) {
  const { wereld, raamBinnen, maakLichtje, statischeTekening, kamerLamp, gloed } = g;
  const kamers = {};
  const sterren = {};
  const ankers = {};
  const kaders = {};
  const samen = [];
  const intro = [];

  // ── sokkel, vloer en wanden ──
  // De sokkel ligt iets lager dan in het dorp en de stad: de houten vloer ligt
  // er bovenop. Lagen ze even hoog, dan vechten ze om wie zichtbaar is en
  // flitst de vloer tussen hout en mint.
  const sokkel = groepje(wereld);
  blok(sokkel, 12.4, 0.5, 8.8, K.mint, 0, -0.54, -0.4, { r: 0.24, schaduw: false });
  blok(sokkel, 12.6, 0.3, 9.0, K.groen, 0, -0.82, -0.4, { r: 0.15, schaduw: false });
  // De vloer ligt net onder nul: zo kan alles wat op de vloer ligt gewoon op y = 0.
  blok(sokkel, 11.9, 0.04, 8.1, VLOER, -0.05, -0.04, -0.45, { r: 0.04, schaduw: false });
  for (let i = 0; i < 14; i++) blok(sokkel, 0.012, 0.043, 8.0, 0xdcc49c, -5.6 + i * 0.85, -0.04, -0.45, { r: 0, schaduw: false });
  samen.push(sokkel);

  const muren = groepje(wereld);
  blok(muren, 11.75, WAND, 0.16, MUUR, -0.02, 0, ACHTER - 0.08, { r: 0.02 });
  blok(muren, 11.75, 0.9, 0.02, LAMBRISERING, -0.02, 0, ACHTER + 0.01, { r: 0, schaduw: false });
  blok(muren, 11.75, 0.08, 0.05, K.groen, -0.02, 0, ACHTER + 0.025, { r: 0.01, schaduw: false });
  blok(muren, 0.16, WAND, 7.95, MUUR, LINKS - 0.08, 0, -0.42, { r: 0.02 });
  blok(muren, 0.02, 0.9, 7.95, LAMBRISERING, LINKS + 0.01, 0, -0.42, { r: 0, schaduw: false });
  blok(muren, 0.05, 0.08, 7.95, K.groen, LINKS + 0.025, 0, -0.42, { r: 0.01, schaduw: false });
  // ramen, het digibord en de letterfries op de achterwand
  raamBinnen(muren, -1.75, 0.95, ACHTER, 1.1, 1.05);
  raamBinnen(muren, 2.35, 0.95, ACHTER, 1.0, 1.05);
  blok(muren, 2.36, 1.28, 0.05, K.inkt, 0.3, 0.82, ACHTER + 0.025, { r: 0.02 });
  statischeTekening(paneel(muren, 2.24, 1.16, 1024, 0.3, 0.82 + 0.64, ACHTER + 0.056, { scherm: true }), tekenDigibord);
  blok(muren, 2.0, 0.04, 0.1, K.grijs, 0.3, 0.78, ACHTER + 0.06, { r: 0.01 });
  statischeTekening(paneel(muren, 11.2, 0.2, 2048, -0.05, 2.43, ACHTER + 0.012), tekenFries);
  samen.push(muren);

  // de zijwand: een groepje dat naar +x kijkt. Daarin is x = -z van de wereld.
  const zij = groepje(wereld, LINKS, 0, 0);
  zij.rotation.y = Math.PI / 2;
  blok(zij, 0.95, 1.95, 0.05, K.zee, -2.65, 0, 0.025, { r: 0.02 });
  blok(zij, 0.42, 0.5, 0.02, 0xcfe9f2, -2.65, 1.2, 0.055, { r: 0.01, schaduw: false });
  bol(zij, 0.04, K.geel, -2.95, 0.95, 0.07, { seg: 8 });
  blok(zij, 2.1, 0.07, 0.06, K.houtDonker, -0.55, 1.28, 0.03, { r: 0.015 });
  for (let i = 0; i < 6; i++) {
    const x = -1.45 + i * 0.36;
    blok(zij, 0.03, 0.08, 0.08, K.inkt, x, 1.2, 0.07, { r: 0.01, schaduw: false });
    if (i % 2 === 0) blok(zij, 0.24, 0.46, 0.07, VROLIJK[i % VROLIJK.length], x, 0.78, 0.07, { r: 0.04 });
    else blok(zij, 0.24, 0.26, 0.13, VROLIJK[(i + 2) % VROLIJK.length], x, 0.92, 0.09, { r: 0.04 });
  }
  // tekeningen van de kinderen
  for (let i = 0; i < 5; i++) {
    const x = 3.7 - i * 0.6;
    blok(zij, 0.44, 0.34, 0.015, K.wit, x, 1.55 + (i % 2) * 0.12, 0.01, { r: 0.005, schaduw: false });
    blok(zij, 0.36, 0.26, 0.012, VROLIJK[(i * 3) % VROLIJK.length], x, 1.59 + (i % 2) * 0.12, 0.02, { r: 0.005, schaduw: false });
    bol(zij, 0.05, K.geel, x + 0.08, 1.75 + (i % 2) * 0.12, 0.03, { seg: 8, schaduw: false });
  }
  samen.push(zij);
  // de klok op de zijwand: de wijzers tonen het echte uur
  const klok = groepje(zij, 0.75, 2.0, 0.03);
  const wijzerplaat = cilinder(klok, 0.26, 0.26, 0.04, 0xffffff, 0, 0, 0, { seg: 28 });
  wijzerplaat.rotation.x = Math.PI / 2; wijzerplaat.position.set(0, 0, 0.02);
  const rand = new T.Mesh(new T.TorusGeometry(0.26, 0.03, 8, 28), mat(K.groen));
  rand.position.z = 0.04; klok.add(rand);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    blok(klok, i % 3 ? 0.02 : 0.035, i % 3 ? 0.03 : 0.05, 0.01, K.inkt, Math.sin(a) * 0.2, Math.cos(a) * 0.2 - 0.02, 0.042, { r: 0, schaduw: false });
  }
  const uurwijzer = levend(groepje(klok, 0, 0, 0.05));
  blok(uurwijzer, 0.035, 0.13, 0.012, K.inkt, 0, 0, 0, { r: 0, schaduw: false });
  const minuutwijzer = levend(groepje(klok, 0, 0, 0.06));
  blok(minuutwijzer, 0.024, 0.19, 0.012, K.rood, 0, 0, 0, { r: 0, schaduw: false });

  // ── een hoek = een station ──
  function hoek(id, nummer, naam, kleur, x, z, b, h, d, bouwVorm, opties = {}) {
    const groep = groepje(wereld, x, 0, z);
    bouwVorm(groep, b, h, d);
    const bordB = opties.bordB ?? 1.6;
    const bordY = opties.bordY ?? 1.0;
    const bordZ = opties.bordZ ?? -d / 2;
    const bord = groepje(groep);
    blok(bord, bordB, 0.32, 0.04, K.groenDonker, opties.bordX ?? 0, bordY, bordZ, { r: 0.012 });
    statischeTekening(paneel(bord, bordB - 0.06, 0.26, 512, opties.bordX ?? 0, bordY + 0.16, bordZ + 0.025), tekenBord(naam, nummer, kleur));
    if (opties.paaltjes) for (const px of [-bordB / 2 + 0.12, bordB / 2 - 0.12]) blok(bord, 0.04, bordY, 0.04, K.groenDonker, (opties.bordX ?? 0) + px, 0, bordZ - 0.01, { r: 0.01 });
    // de gouden ster van de stempel
    const ster = levend(groepje(groep, opties.sterX ?? 0, opties.sterY ?? h + 0.75, opties.sterZ ?? 0));
    const goud = new T.MeshBasicMaterial({ color: 0xffcf3a });
    bol(ster, 0.09, 0, 0, 0, 0, { materiaal: goud, seg: 12, schaduw: false });
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      const punt = new T.Mesh(new T.ConeGeometry(0.075, 0.2, 4), goud);
      punt.position.set(Math.sin(a) * 0.15, Math.cos(a) * 0.15, 0);
      punt.rotation.z = -a;
      ster.add(punt);
    }
    gloed(ster, 0, 0, 0, 0.9);
    ster.visible = false;
    sterren[id] = ster;
    const raak = levend(new T.Mesh(new T.BoxGeometry(b + 0.2, h + 0.8, d + 0.2), new T.MeshBasicMaterial({ visible: false })));
    raak.position.set(0, (h + 0.8) / 2, 0);
    raak.userData.kamer = id;
    groep.add(raak);
    kamers[id] = { groep, raak };
    ankers[id] = new T.Vector3(x + (opties.labelX ?? -b / 2 + 0.1), opties.labelY ?? h + 0.9, z + d / 2);
    kaders[id] = { min: [x - b / 2 - 0.8, 0, z - d / 2 - 0.4], max: [x + b / 2 + 0.8, opties.kaderY ?? 2.1, z + d / 2 + 0.9], marge: 1.08, hoek: 0.45 };
    samen.push(groep);
    intro.push({ obj: groep, start: 0.4 + nummer * 0.16, soort: 'pop' });
    return groep;
  }

  // 1 · de ontdekhoek: een tafel met een vergrootglas, een wereldbol, een
  // tablet en een robotje, en een rek met doosjes tegen de muur
  hoek('ontdekhoek', 1, 'De ontdekhoek', '#5fa9c9', -3.85, -3.25, 2.6, 0.85, 1.6, (gr, b, h, d) => {
    blok(gr, 2.3, 0.012, 1.4, 0xcfe9f2, 0, 0, 0.05, { r: 0.04, schaduw: false });
    blok(gr, 2.3, 0.62, 0.36, K.hout, 0, 0, -d / 2 + 0.25, { r: 0.02 });
    VROLIJK.slice(0, 6).forEach((k, i) => blok(gr, 0.3, 0.2, 0.26, k, -0.9 + i * 0.36, 0.62, -d / 2 + 0.25, { r: 0.03 }));
    blok(gr, 1.5, 0.05, 0.75, K.wit, 0, 0.5, 0.25, { r: 0.02 });
    for (const [lx, lz] of [[-0.68, -0.08], [0.68, -0.08], [-0.68, 0.58], [0.68, 0.58]]) blok(gr, 0.05, 0.5, 0.05, K.grijs, lx, 0, lz, { r: 0.01 });
    // op de tafel
    blok(gr, 0.34, 0.02, 0.24, K.inkt, -0.45, 0.55, 0.3, { r: 0.02 });
    blok(gr, 0.3, 0.004, 0.2, 0x7cc3dc, -0.45, 0.572, 0.3, { r: 0.01, schaduw: false });
    const loep = groepje(gr, 0.05, 0.56, 0.4);
    const ring = new T.Mesh(new T.TorusGeometry(0.09, 0.018, 8, 20), mat(K.inkt));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; loep.add(ring);
    blok(loep, 0.04, 0.025, 0.18, K.oranje, 0, 0.005, 0.17, { r: 0.01 });
    cilinder(gr, 0.03, 0.06, 0.06, K.houtDonker, 0.5, 0.55, 0.15, { seg: 10 });
    cilinder(gr, 0.012, 0.012, 0.12, K.houtDonker, 0.5, 0.6, 0.15, { seg: 6 });
    bol(gr, 0.13, K.zee, 0.5, 0.82, 0.15, { seg: 16 });
    bol(gr, 0.06, K.blad2, 0.55, 0.86, 0.25, { seg: 8 });
    const robot = groepje(gr, 0.15, 0.55, 0.1);
    const romp = bol(robot, 0.1, 0xffcf3a, 0, 0.02, 0, { seg: 14 });
    romp.scale.set(1, 0.7, 1.2);
    bol(robot, 0.018, K.inkt, -0.04, 0.07, 0.1, { seg: 6 });
    bol(robot, 0.018, K.inkt, 0.04, 0.07, 0.1, { seg: 6 });
    plant(gr, 1.0, 0.62, -d / 2 + 0.25, 0.7);
  }, { bordY: 1.38, bordZ: ACHTER - -3.25 + 0.03, kaderY: 2.2, sterY: 2.0, sterZ: -0.4, labelY: 2.15 });

  // 2 · de bouwhoek: een mat met een blokkentoren, losse blokken en ballen,
  // een rode en een blauwe bak, en een speelgoedauto
  hoek('bouwhoek', 2, 'De bouwhoek', '#f08a3c', -3.85, 1.45, 2.4, 0.8, 1.8, (gr, b, h, d) => {
    blok(gr, 2.2, 0.015, 1.6, 0xbfe3ed, 0, 0, 0, { r: 0.06, schaduw: false });
    for (let i = 0; i < 4; i++) blok(gr, 2.0 - i * 0.4, 0.016, 0.04, K.wit, 0, 0.002, -0.6 + i * 0.4, { r: 0, schaduw: false });
    // de toren
    [K.rood, 0xf2c230, K.zee, K.blad2, K.oranje].forEach((k, i) => {
      const steen = blok(gr, 0.2, 0.2, 0.2, k, -0.55 + (i % 2) * 0.02, i * 0.2, -0.25, { r: 0.02 });
      steen.rotation.y = i * 0.25;
    });
    // losse blokken en ballen
    [[0.1, 0.25, K.rood], [0.35, 0.45, 0xf2c230], [-0.2, 0.5, K.blad2]].forEach(([bx, bz, k]) => blok(gr, 0.18, 0.18, 0.18, k, bx, 0, bz, { r: 0.02 }).rotation.y = bx * 3);
    [[0.6, 0.1, K.zee], [-0.05, -0.05, K.oranje], [0.75, 0.55, K.rood]].forEach(([bx, bz, k]) => bol(gr, 0.1, k, bx, 0.1, bz, { seg: 14 }));
    // de twee bakken
    for (const [bx, k] of [[0.55, K.rood], [0.98, K.zee]]) {
      blok(gr, 0.36, 0.26, 0.3, k, bx, 0, -0.5, { r: 0.04 });
      blok(gr, 0.3, 0.01, 0.24, 0x2b3038, bx, 0.26, -0.5, { r: 0, schaduw: false });
    }
    // een speelgoedauto
    const auto = groepje(gr, -0.6, 0, 0.45);
    auto.rotation.y = 0.6;
    blok(auto, 0.32, 0.1, 0.16, K.groen, 0, 0.05, 0, { r: 0.03 });
    blok(auto, 0.16, 0.08, 0.14, K.blauw, -0.02, 0.15, 0, { r: 0.02 });
    for (const ax of [-0.1, 0.1]) for (const az of [-0.08, 0.08]) {
      const wiel = cilinder(auto, 0.045, 0.045, 0.03, K.inkt, ax, 0, az, { seg: 10 });
      wiel.rotation.x = Math.PI / 2; wiel.position.y = 0.045;
    }
  }, { bordY: 1.0, bordZ: -0.85, paaltjes: true, sterY: 1.85, sterZ: -0.6 });

  // 3 · de kring: een rond tapijt met kussens, waar de kinderen zitten
  const kinderenInDeKring = [];
  hoek('kring', 3, 'De kring', '#4e9a63', KRING.x, KRING.z, 2.8, 0.6, 2.8, (gr) => {
    cilinder(gr, 1.32, 1.32, 0.014, 0xf6d7b0, 0, 0, 0, { seg: 40, schaduw: false });
    cilinder(gr, 1.0, 1.0, 0.016, 0xfbf59b, 0, 0, 0, { seg: 40, schaduw: false });
    cilinder(gr, 0.55, 0.55, 0.018, 0xccefd5, 0, 0, 0, { seg: 40, schaduw: false });
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + Math.PI / 8;
      cilinder(gr, 0.17, 0.18, 0.09, VROLIJK[i % VROLIJK.length], Math.cos(a) * 1.05, 0.015, Math.sin(a) * 1.05, { seg: 16 });
    }
  }, { bordY: 1.0, bordZ: -1.5, paaltjes: true, sterY: 1.7, sterZ: 0, labelX: -0.6, kaderY: 1.9 });
  [0, 2, 3, 5, 6].forEach((plek, i) => {
    const a = plek * Math.PI / 4 + Math.PI / 8;
    const x = KRING.x + Math.cos(a) * 1.05, z = KRING.z + Math.sin(a) * 1.05;
    const kind = figuur(wereld, {
      x, y: -0.04, z, draai: Math.atan2(-Math.cos(a), -Math.sin(a)), zit: true, schaal: 0.6,
      shirt: VROLIJK[(i * 2 + 1) % VROLIJK.length], huid: HUID[(i * 2) % HUID.length], haar: HAAR[(i + 1) % HAAR.length],
    });
    kind.userData.fase = i * 1.3;
    kinderenInDeKring.push(kind);
  });

  // 4 · de laatjeskast: een kast met gekleurde laatjes, en bovenop de
  // geheimendoos met een gouden slotje
  hoek('laatjeskast', 4, 'De laatjeskast', '#7b5ea7', 4.05, -3.72, 2.4, 1.1, 0.6, (gr, b, h, d) => {
    blok(gr, b, h, d, K.wit, 0, 0, 0, { r: 0.03 });
    for (let rij = 0; rij < 3; rij++) for (let kol = 0; kol < 6; kol++) {
      const lx = -b / 2 + 0.22 + kol * 0.392, ly = 0.08 + rij * 0.33;
      blok(gr, 0.36, 0.29, 0.03, VROLIJK[(rij * 6 + kol) % VROLIJK.length], lx, ly, d / 2 + 0.005, { r: 0.02 });
      blok(gr, 0.1, 0.025, 0.02, K.wit, lx, ly + 0.2, d / 2 + 0.025, { r: 0.008, schaduw: false });
    }
    const doos = groepje(gr, 0.25, h, 0.02);
    blok(doos, 0.5, 0.26, 0.36, 0x7b5ea7, 0, 0, 0, { r: 0.03 });
    blok(doos, 0.54, 0.07, 0.4, 0x9a7cc4, 0, 0.26, 0, { r: 0.025 });
    blok(doos, 0.1, 0.1, 0.03, 0xe0b23c, 0, 0.1, 0.19, { r: 0.015 });
    const beugel = new T.Mesh(new T.TorusGeometry(0.035, 0.012, 6, 14, Math.PI), mat(0xe0b23c));
    beugel.position.set(0, 0.2, 0.2);
    doos.add(beugel);
    plant(gr, -0.85, h, 0, 0.75);
    blok(gr, 0.4, 0.06, 0.28, K.zee, -0.3, h, 0, { r: 0.015 });
    blok(gr, 0.38, 0.06, 0.26, K.geel, -0.3, h + 0.06, 0, { r: 0.015 });
  }, { bordY: 1.62, bordZ: ACHTER - -3.72 + 0.03, kaderY: 2.4, sterY: 2.15, sterX: 0.25, labelY: 2.25 });

  // 5 · het bureau van de juf: een bureau met een laptop, een tas, een appel
  // en een lamp; de juf staat ernaast
  let juf;
  hoek('bureau', 5, 'Het bureau van de juf', '#d9534f', 3.9, 1.45, 2.4, 0.75, 1.6, (gr) => {
    blok(gr, 1.55, 0.05, 0.75, K.hout, -0.15, 0.68, 0, { r: 0.02 });
    blok(gr, 0.45, 0.68, 0.7, K.houtDonker, 0.43, 0, 0, { r: 0.02 });
    blok(gr, 0.05, 0.68, 0.7, K.houtDonker, -0.88, 0, 0, { r: 0.01 });
    blok(gr, 0.08, 0.02, 0.15, K.geel, 0.43, 0.42, 0.36, { r: 0.008, schaduw: false });
    laptop(gr, -0.35, 0.73, 0.02, 0.25, K.zee);
    cilinder(gr, 0.045, 0.04, 0.1, K.rood, 0.15, 0.73, 0.18, { seg: 12 });
    bol(gr, 0.06, K.rood, 0.35, 0.79, 0.22, { seg: 12 });
    blok(gr, 0.02, 0.04, 0.04, K.blad2, 0.36, 0.84, 0.22, { r: 0.008 });
    [K.zee, K.geel, K.blad2].forEach((k, i) => blok(gr, 0.3, 0.05, 0.22, k, 0.35, 0.73 + i * 0.05, -0.15, { r: 0.01 }));
    cilinder(gr, 0.06, 0.07, 0.03, K.inkt, -0.75, 0.73, -0.22, { seg: 12 });
    cilinder(gr, 0.012, 0.012, 0.32, K.inkt, -0.75, 0.76, -0.22, { seg: 6 });
    cilinder(gr, 0.04, 0.1, 0.1, K.groen, -0.7, 1.04, -0.18, { seg: 14 });
    stoel(gr, -0.2, 0, -0.62, 0, K.zee);
    plant(gr, 0.95, 0, -0.45, 0.9);
  }, { bordY: 1.38, bordB: 2.0, bordZ: -0.95, paaltjes: true, sterY: 1.95, sterZ: -0.5, labelY: 2.0, kaderY: 2.2 });
  {
    const p = kamers.bureau.groep.position;
    juf = figuur(wereld, { x: p.x - 0.3, y: 0, z: p.z + 0.62, draai: -0.5, shirt: K.roos, huid: HUID[1], haar: HAAR[2] });
  }

  // ── tafels, de leeshoek, het aquarium en wat er nog in een klas staat ──
  const tafels = groepje(wereld, 1.45, 0, -2.3);
  blok(tafels, 2.0, 0.04, 0.7, K.wit, 0, 0.42, 0, { r: 0.02 });
  for (const [lx, lz] of [[-0.95, -0.3], [0.95, -0.3], [-0.95, 0.3], [0.95, 0.3]]) blok(tafels, 0.04, 0.42, 0.04, K.grijs, lx, 0, lz, { r: 0.01 });
  for (const [sx, sz, d] of [[-0.55, -0.55, 0], [0.45, -0.55, 0], [-0.55, 0.55, Math.PI], [0.45, 0.55, Math.PI]]) stoel(tafels, sx, 0, sz, d, VROLIJK[(Math.abs(sx * 10) | 0) % VROLIJK.length]);
  for (const [px, pz] of [[-0.55, -0.12], [0.45, -0.12], [-0.5, 0.15]]) blok(tafels, 0.28, 0.006, 0.2, K.wit, px, 0.46, pz, { r: 0, schaduw: false });
  cilinder(tafels, 0.05, 0.05, 0.1, K.zee, 0, 0.46, 0, { seg: 10 });
  for (let i = 0; i < 4; i++) cilinder(tafels, 0.008, 0.008, 0.14, VROLIJK[i], -0.02 + (i % 2) * 0.04, 0.5, -0.02 + (i > 1 ? 0.04 : 0), { seg: 5, schaduw: false });
  samen.push(tafels);
  const tekenaars = [[-0.55, -0.55, 0, 0], [0.45, 0.55, Math.PI, 3]].map(([x, z, d, i]) => {
    const k = figuur(wereld, { x: 1.45 + x, y: 0.06, z: -2.3 + z + (d ? -0.04 : 0.04), draai: d, zit: true, schaal: 0.62, shirt: VROLIJK[i + 1], huid: HUID[i + 1], haar: HAAR[i % HAAR.length] });
    k.userData.fase = i;
    return k;
  });

  const leeshoek = groepje(wereld, -1.25, 0, 2.75);
  blok(leeshoek, 1.2, 0.52, 0.3, K.hout, 0, 0, -0.25, { r: 0.02 });
  for (let i = 0; i < 9; i++) blok(leeshoek, 0.07, 0.2 + (i % 3) * 0.03, 0.18, VROLIJK[i % VROLIJK.length], -0.48 + i * 0.12, 0.52, -0.25, { r: 0.01 });
  for (const [zx, zz, k] of [[-0.35, 0.25, K.oranje], [0.4, 0.3, 0x7b5ea7]]) {
    const zak = bol(leeshoek, 0.26, k, zx, 0.14, zz, { seg: 16 });
    zak.scale.set(1, 0.55, 1);
  }
  samen.push(leeshoek);

  const aquarium = groepje(wereld, 5.3, 0, -1.3);
  blok(aquarium, 0.75, 0.55, 0.45, K.houtDonker, 0, 0, 0, { r: 0.02 });
  blok(aquarium, 0.68, 0.34, 0.38, K.water, 0, 0.56, 0, { r: 0.01, schaduw: false });
  blok(aquarium, 0.72, 0.03, 0.42, K.inkt, 0, 0.92, 0, { r: 0.01 });
  blok(aquarium, 0.66, 0.04, 0.36, 0xe8d8a8, 0, 0.56, 0, { r: 0.01, schaduw: false });
  samen.push(aquarium);
  const visjes = [0, 1].map(i => {
    const v = levend(groepje(wereld, 5.3, 0.74 + i * 0.07, -1.3));
    bol(v, 0.035, i ? K.geel : K.oranje, 0, 0, 0, { seg: 8, schaduw: false }).scale.set(1.4, 1, 0.7);
    const staart = new T.Mesh(new T.ConeGeometry(0.03, 0.05, 4), mat(i ? K.geel : K.oranje));
    staart.rotation.z = -Math.PI / 2; staart.position.x = -0.06; v.add(staart);
    v.userData.fase = i * 2.4;
    return v;
  });
  // een plant op de vensterbank en een vuilbak
  plant(wereld, 2.7, 0.92, ACHTER + 0.09, 0.45);
  plant(wereld, -2.1, 0.92, ACHTER + 0.09, 0.45);
  cilinder(wereld, 0.14, 0.12, 0.32, K.groen, 5.3, 0, 0.0, { seg: 14 });

  // een kind loopt van de bouwhoek naar de leeshoek en terug
  const loper = figuur(wereld, { x: -2.6, y: 0, z: 2.05, shirt: 0xf2c230, huid: HUID[3], haar: HAAR[0], schaal: 0.62 });

  // ── het lichtje ──
  const lichtje = maakLichtje();
  const STATIONS = ['ontdekhoek', 'bouwhoek', 'kring', 'laatjeskast', 'bureau'];
  const lichtPlek = id => {
    if (id === 'kring') return LICHT_KRING;
    const k = kamers[id].groep.position;
    return new T.Vector3(k.x, 1.15, k.z + (id === 'laatjeskast' ? 0.8 : 0.9));
  };

  // 's avonds branden de lampen van de klas: binnen mag het lichter zijn dan in het dorp
  kamerLamp(-3.6, 1.9, -2.2, 3.2);
  kamerLamp(0.3, 2.1, 0.2, 3.6);
  kamerLamp(3.7, 1.9, 0.6, 3.2);

  return {
    kamers,
    ankers,
    kaders: {
      overzicht: { min: [-6.0, -0.9, -4.6], max: [6.1, 2.8, 3.9], marge: 1.02, hoek: 0.6 },
      ...kaders,
    },
    zaalVolgorde: ['overzicht', ...STATIONS],
    pinGroep: () => 'geen',
    samenvoegen: samen,
    intro: [
      ...intro,
      ...kinderenInDeKring.map((k, i) => ({ obj: k, start: 1.3 + i * 0.08, soort: 'pop' })),
      ...tekenaars.map((k, i) => ({ obj: k, start: 1.5 + i * 0.1, soort: 'pop' })),
      { obj: juf, start: 1.45, soort: 'pop' },
      { obj: loper, start: 1.7, soort: 'pop' },
      { obj: tafels, start: 1.1, soort: 'pop' },
      { obj: leeshoek, start: 1.15, soort: 'pop' },
      { obj: aquarium, start: 1.2, soort: 'pop' },
    ],
    bijFocus(f) {
      if (!lichtje.aan) return;
      lichtje.vlieg(kamers[f] ? lichtPlek(f) : LICHT_KRING, () => {});
    },
    stil() {
      lichtje.stilZetten(LICHT_KRING);
    },
    werkBij(dt, nu, { nacht }) {
      if (nu > 1.6 && !lichtje.aan) lichtje.zetAan(LICHT_KRING, nu);
      lichtje.werkBij(dt, nu, { denkt: false, nacht });
      {
        const t = new Date(), uur = (t.getHours() % 12) + t.getMinutes() / 60, minuut = t.getMinutes() + t.getSeconds() / 60;
        uurwijzer.rotation.z = -uur / 12 * Math.PI * 2;
        minuutwijzer.rotation.z = -minuut / 60 * Math.PI * 2;
      }
      // de kinderen in de kring kijken naar het lichtje en weer naar elkaar
      for (const k of kinderenInDeKring) {
        k.userData.hoofd.rotation.y = Math.sin(nu * 0.7 + k.userData.fase) * 0.45;
        k.userData.hoofd.rotation.x = Math.sin(nu * 1.1 + k.userData.fase) * 0.08;
      }
      for (const k of tekenaars) {
        k.userData.hoofd.rotation.x = 0.35 + Math.sin(nu * 0.9 + k.userData.fase) * 0.08;
        k.userData.armen[1].rotation.x = -0.9 + Math.sin(nu * 6 + k.userData.fase) * 0.12;
      }
      // de juf zwaait af en toe
      {
        const p = nu % 9, zwaai = p < 1.6;
        juf.userData.armen[1].rotation.z = zwaai ? 2.5 + Math.sin(nu * 12) * 0.25 : 0.12;
        juf.userData.hoofd.rotation.y = Math.sin(nu * 0.5) * 0.3;
      }
      {
        const p = (nu * 0.08) % 2, t = p < 1 ? p : 2 - p;
        const x = -2.6 + t * 1.1, z = 2.02 + Math.sin(t * Math.PI) * 0.1;
        loper.position.set(x, Math.abs(Math.sin(nu * 8)) * 0.02, z);
        loper.rotation.y = p < 1 ? Math.PI / 2 : -Math.PI / 2;
        const [l, rr] = loper.userData.benen;
        l.rotation.x = Math.sin(nu * 8) * 0.4; rr.rotation.x = -l.rotation.x;
      }
      for (const v of visjes) {
        const a = nu * 0.6 + v.userData.fase;
        v.position.x = 5.3 + Math.sin(a) * 0.24;
        v.position.z = -1.3 + Math.sin(a * 2) * 0.07;
        v.rotation.y = Math.cos(a) > 0 ? 0 : Math.PI;
      }
      for (const s of Object.values(sterren)) if (s.visible) s.rotation.y = nu * 1.4;
    },
    api: {
      // Zet de gouden ster boven de hoek als de klas het station afrondde.
      stempel(id, aan) { if (sterren[id]) sterren[id].visible = !!aan; },
    },
  };
}
