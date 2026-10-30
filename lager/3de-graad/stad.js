// De stad van morgen: de wereld van Leerlichtjes voor de 3de graad. Vijf
// gebouwen zijn vijf stations: het lab, de fabriek, de krantenredactie, het
// museum en de haven. In het midden ligt een plein met een fontein; daar
// wacht het lichtje tot de klas een station kiest. Haalt de klas een stempel,
// dan wappert er een vlag op het dak. De motor zit in gedeeld/diorama-kern.js.
import {
  T, K, HUID, HAAR, toeval, blok, cilinder, bol, kruin, puntdak, groepje, levend, figuur,
  boom, maakPodium, F, paneel, mat, zet,
} from '../../gedeeld/diorama-kern.js';

const PLEIN = new T.Vector3(0.2, 0.9, 0.9);

function tekenBord(tekst, nummer, kleur) {
  return ({ ctx, c }) => {
    const W = c.width, H = c.height;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = kleur; ctx.fillRect(0, 0, H, H);
    ctx.fillStyle = '#ffffff'; ctx.font = F(700, H * 0.62); ctx.textAlign = 'center'; ctx.fillText(String(nummer), H / 2, H * 0.74);
    ctx.fillStyle = '#126425'; ctx.font = F(700, H * 0.5); ctx.textAlign = 'left'; ctx.fillText(tekst, H * 1.25, H * 0.68);
  };
}
function tekenKrant({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fbfaf5'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 46); ctx.textAlign = 'center'; ctx.fillText('DE STADSKRANT', W / 2, 58);
  ctx.fillRect(24, 76, W - 48, 4);
  ctx.textAlign = 'left'; ctx.font = F(700, 30); ctx.fillText('Zon blijkt een ster!', 24, 122);
  ctx.fillStyle = '#c9c9c9';
  for (let i = 0; i < 6; i++) ctx.fillRect(24, 142 + i * 22, (W - 48) * (i % 3 === 2 ? 0.6 : 1), 10);
  ctx.fillStyle = '#bfe3ed'; ctx.fillRect(W - 170, 140, 146, 110);
  ctx.fillStyle = '#ffcf3a'; ctx.beginPath(); ctx.arc(W - 97, 195, 32, 0, Math.PI * 2); ctx.fill();
}

export function maakStad(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwStad(g));
}

function bouwStad(g) {
  const { wereld, raamBuiten, maakLichtje, statischeTekening, gloed, kamerLamp, lampMat } = g;
  const r = toeval(11);
  const kamers = {};
  const vlaggen = {};
  const ankers = {};
  const kaders = {};
  const samen = [];
  const intro = [];

  // ── sokkel, wegen en plein ──
  const sokkel = groepje(wereld);
  blok(sokkel, 12.4, 0.5, 8.8, K.mint, 0, -0.5, -0.4, { r: 0.24, schaduw: false });
  blok(sokkel, 12.6, 0.3, 9.0, K.groen, 0, -0.78, -0.4, { r: 0.15, schaduw: false });
  const weg = groepje(wereld);
  blok(weg, 12.0, 0.02, 0.8, K.weg, 0, 0, -1.05, { r: 0.01, schaduw: false });
  for (let i = 0; i < 12; i++) blok(weg, 0.4, 0.008, 0.06, K.wit, -5.5 + i * 1.0, 0.02, -1.05, { r: 0, schaduw: false });
  blok(weg, 0.8, 0.02, 2.2, K.weg, -1.9, 0, 0.55, { r: 0.01, schaduw: false });
  blok(weg, 3.4, 0.03, 2.2, K.steen, 0.6, 0, 0.75, { r: 0.04, schaduw: false });
  for (let i = 0; i < 6; i++) blok(weg, 0.16, 0.035, 0.5, K.wit, -1.9 - 0.2 + (i % 2) * 0.4, 0, -0.55 + Math.floor(i / 2) * 0.2 - 0.3, { r: 0, schaduw: false });
  samen.push(sokkel, weg);

  // fontein op het plein, waar het lichtje wacht
  const fontein = groepje(wereld, PLEIN.x, 0, PLEIN.z);
  cilinder(fontein, 0.62, 0.66, 0.16, K.steen, 0, 0, 0, { seg: 28 });
  cilinder(fontein, 0.54, 0.54, 0.02, K.water, 0, 0.14, 0, { seg: 28, schaduw: false });
  cilinder(fontein, 0.08, 0.1, 0.45, K.steen, 0, 0.12, 0, { seg: 12 });
  const straal = levend(groepje(fontein));
  const druppels = [0, 1, 2, 3, 4, 5].map(i => {
    const d = bol(straal, 0.03, 0, 0, 0.6, 0, { materiaal: new T.MeshBasicMaterial({ color: 0xdff3fa, transparent: true, opacity: 0.85 }), schaduw: false, seg: 8 });
    d.userData.hoek = i * Math.PI / 3;
    return d;
  });
  for (const [x, z, d] of [[-0.9, 0.2, 0.4], [1.3, 0.2, -0.4]]) {
    const bank = groepje(wereld, PLEIN.x + x, 0, PLEIN.z + z);
    bank.rotation.y = d;
    blok(bank, 0.8, 0.05, 0.26, K.hout, 0, 0.26, 0);
    blok(bank, 0.8, 0.2, 0.05, K.hout, 0, 0.33, -0.11);
    for (const bx of [-0.33, 0.33]) blok(bank, 0.05, 0.26, 0.22, K.inkt, bx, 0, 0, { r: 0.01 });
    samen.push(bank);
  }

  // ── een gebouw = een station ──
  function station(id, nummer, naam, kleur, x, z, b, h, d, bouwVorm, opties = {}) {
    const groep = groepje(wereld, x, 0, z);
    bouwVorm(groep, b, h, d);
    // het bord boven de deur
    const bord = groepje(groep);
    blok(bord, Math.min(b * 0.8, 1.7), 0.32, 0.04, K.groenDonker, 0, opties.bordY ?? h * 0.62, d / 2 + 0.02, { r: 0.012 });
    statischeTekening(paneel(bord, Math.min(b * 0.8, 1.7) - 0.06, 0.26, 512, 0, (opties.bordY ?? h * 0.62) + 0.16, d / 2 + 0.045), tekenBord(naam, nummer, kleur));
    // de vlag met de stempel: verschijnt als de klas het station afrondt
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
    ankers[id] = new T.Vector3(x - b / 2 + 0.1, (opties.labelY ?? h + 0.9), z + d / 2);
    kaders[id] = { min: [x - b / 2 - 0.9, 0, z - d / 2 - 0.4], max: [x + b / 2 + 0.9, (opties.kaderY ?? h + 0.9), z + d / 2 + 1.1], marge: 1.08, hoek: 0.42 };
    samen.push(groep);
    intro.push({ obj: groep, start: 0.3 + nummer * 0.18, soort: 'val' });
    return groep;
  }

  // 1 · het lab: wit, met een glazen koepel
  station('lab', 1, 'Het lab', '#5fa9c9', -3.95, -2.55, 2.0, 1.3, 1.6, (gr, b, h, d) => {
    blok(gr, b, h, d, K.wit, 0, 0, 0, { r: 0.04 });
    blok(gr, b + 0.08, 0.1, d + 0.08, K.blauw, 0, h, 0, { r: 0.03 });
    const koepel = new T.Mesh(new T.SphereGeometry(0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: 0xbfe7f2 }));
    koepel.position.set(-0.3, h + 0.1, -0.1);
    zet(gr, koepel);
    cilinder(gr, 0.015, 0.015, 0.5, K.grijs, 0.55, h + 0.1, -0.4, { seg: 6 });
    bol(gr, 0.05, K.rood, 0.55, h + 0.62, -0.4, { seg: 8 });
    for (const xx of [-0.6, 0.6]) raamBuiten(gr, xx, 0.35, d / 2, 0.38, 0.34);
    blok(gr, 0.4, 0.62, 0.04, K.zee, 0, 0, d / 2 + 0.01, { r: 0.012 });
  }, { kaderY: 2.4 });

  // 2 · de fabriek: baksteen, met een zaagtanddak, een schoorsteen en zonnepanelen
  const fabriek = station('fabriek', 2, 'De fabriek', '#f08a3c', 0.25, -2.75, 2.7, 1.2, 1.6, (gr, b, h, d) => {
    blok(gr, b, h, d, K.baksteen, 0, 0, 0, { r: 0.03 });
    for (let i = 0; i < 3; i++) {
      const tand = groepje(gr, -b / 2 + 0.45 + i * 0.9, h, 0);
      tand.rotation.y = Math.PI / 2;
      blok(tand, d, 0.4, 0.06, K.blauw, 0, 0, 0.2, { r: 0.01 });
      puntdak(tand, d, 0.4, 0.86, K.perzik, 0, 0, -0.1);
    }
    cilinder(gr, 0.13, 0.16, 1.1, K.baksteen, b / 2 - 0.3, h, -0.4, { seg: 14 });
    blok(gr, 0.9, 0.04, 0.4, K.paneel, -0.6, h + 0.02, d / 2 - 0.15, { r: 0.008 }).rotation.x = -0.25;
    for (const xx of [-0.85, 0.85]) raamBuiten(gr, xx, 0.38, d / 2, 0.5, 0.36);
    blok(gr, 0.7, 0.7, 0.04, K.grijs, 0, 0, d / 2 + 0.01, { r: 0.012 });
    // een lopende band met kistjes fruit voor de deur
    blok(gr, 1.8, 0.08, 0.32, K.inkt, 0, 0.22, d / 2 + 0.45, { r: 0.02 });
    for (const xx of [-0.75, 0.75]) blok(gr, 0.06, 0.22, 0.28, K.grijs, xx, 0, d / 2 + 0.45, { r: 0 });
  }, { kaderY: 2.6, vlagX: 0.6 });
  const band = levend(groepje(fabriek, 0, 0.3, 1.25));
  const kistjes = [K.rood, 0x8cc63f, K.geel, K.rood].map((k, i) => {
    const kist = groepje(band, -0.8 + i * 0.5, 0, 0);
    blok(kist, 0.22, 0.1, 0.2, K.hout, 0, 0, 0, { r: 0.01 });
    for (let j = 0; j < 3; j++) bol(kist, 0.045, k, -0.06 + j * 0.06, 0.13, 0, { seg: 8 });
    return kist;
  });
  const rook = [0, 1, 2].map(i => levend(bol(fabriek, 0.12, 0, 1.05, 2.4, -0.4, { materiaal: new T.MeshLambertMaterial({ color: 0xf2f2f2, transparent: true, opacity: 0.7 }), seg: 10, schaduw: false })));
  rook.forEach((b, i) => { b.userData.verschuiving = i / 3; });

  // 3 · de krantenredactie: hoog en smal, met een krant aan de gevel
  station('krant', 3, 'De krant', '#d9534f', 4.05, -2.5, 1.7, 2.2, 1.5, (gr, b, h, d) => {
    blok(gr, b, h, d, 0xfff3e3, 0, 0, 0, { r: 0.04 });
    blok(gr, b + 0.1, 0.12, d + 0.1, K.rood, 0, h, 0, { r: 0.03 });
    for (const yy of [0.45, 1.05]) for (const xx of [-0.45, 0.45]) raamBuiten(gr, xx, yy + 0.3, d / 2, 0.42, 0.36);
    blok(gr, 0.42, 0.62, 0.04, K.rood, 0, 0, d / 2 + 0.01, { r: 0.012 });
    blok(gr, 1.25, 0.72, 0.04, K.inkt, 0, 1.58, d / 2 + 0.01, { r: 0.012 });
    statischeTekening(paneel(gr, 1.18, 0.64, 512, 0, 1.94, d / 2 + 0.035), tekenKrant);
  }, { bordY: 0.82, kaderY: 3.2, labelY: 3.0 });

  // 4 · het museum: zuilen, trappen en een driehoekig fronton
  station('museum', 4, 'Het museum', '#126425', -3.95, 1.75, 2.3, 1.25, 1.4, (gr, b, h, d) => {
    blok(gr, b + 0.3, 0.1, d + 0.5, K.steen, 0, 0, 0.1, { r: 0.02 });
    blok(gr, b + 0.1, 0.08, d + 0.3, K.steen, 0, 0.1, 0.05, { r: 0.02 });
    blok(gr, b - 0.3, h - 0.25, d - 0.4, 0xf6efe2, 0, 0.18, -0.2, { r: 0.02 });
    for (let i = 0; i < 5; i++) cilinder(gr, 0.07, 0.08, h - 0.3, K.wit, -b / 2 + 0.25 + i * (b - 0.5) / 4, 0.18, d / 2 - 0.12, { seg: 12 });
    blok(gr, b + 0.1, 0.12, d + 0.05, K.wit, 0, h - 0.12, 0, { r: 0.02 });
    puntdak(gr, b + 0.1, 0.45, d + 0.05, K.wit, 0, h, 0);
    blok(gr, 0.4, 0.62, 0.03, K.houtDonker, 0, 0.18, d / 2 - 0.4 - 0.2 + 0.02, { r: 0.01 });
  }, { bordY: 1.0, dakY: 1.6, vlagX: 0.7, vlagZ: -0.2, kaderY: 2.4 });

  // 5 · de haven: water, een steiger, een bootje en een vuurtoren
  const haven = station('haven', 5, 'De haven', '#124a5e', 3.75, 1.85, 2.0, 0.9, 1.3, (gr, b, h, d) => {
    blok(gr, b, h, d, 0xe9f4f7, 0, 0, -0.35, { r: 0.03 });
    puntdak(gr, b + 0.15, 0.4, d + 0.15, K.zee, 0, h, -0.35);
    raamBuiten(gr, -0.55, 0.32, d / 2 - 0.35, 0.42, 0.3);
    blok(gr, 0.4, 0.55, 0.04, K.zee, 0.35, 0, d / 2 - 0.35 + 0.01, { r: 0.012 });
  }, { bordY: 0.55, dakY: 1.25, vlagX: -0.7, vlagZ: -0.35, kaderY: 2.8, labelY: 2.6 });
  const water = levend(groepje(wereld, 4.0, 0, 2.95));
  blok(water, 3.6, 0.04, 1.3, K.water, 0, -0.02, 0, { r: 0.04, schaduw: false });
  for (let i = 0; i < 4; i++) blok(water, 0.35, 0.06, 0.25, K.hout, -1.1 + i * 0.36, 0.0, -0.3, { r: 0.01 });
  const boot = levend(groepje(water, 0.6, 0.02, 0.2));
  blok(boot, 0.9, 0.18, 0.36, K.rood, 0, 0, 0, { r: 0.06 });
  blok(boot, 0.36, 0.22, 0.26, K.wit, -0.1, 0.18, 0, { r: 0.03 });
  cilinder(boot, 0.03, 0.03, 0.18, K.inkt, 0.15, 0.36, 0, { seg: 8 });
  const vuurtoren = groepje(wereld, 5.35, 0, 1.3);
  for (let i = 0; i < 4; i++) cilinder(vuurtoren, 0.2 - i * 0.02, 0.22 - i * 0.02, 0.45, i % 2 ? K.wit : K.rood, 0, i * 0.45, 0, { seg: 16 });
  cilinder(vuurtoren, 0.17, 0.17, 0.24, 0xfff2c0, 0, 1.8, 0, { seg: 16 });
  cilinder(vuurtoren, 0, 0.22, 0.24, K.rood, 0, 2.04, 0, { seg: 16 });
  const toplamp = bol(vuurtoren, 0.09, 0, 0, 1.92, 0, { materiaal: lampMat, schaduw: false, seg: 10 });
  gloed(vuurtoren, 0, 1.92, 0, 1.1);
  samen.push(vuurtoren);
  intro.push({ obj: vuurtoren, start: 1.3, soort: 'pop' }, { obj: water, start: 1.25, soort: 'pop' });

  // ── windmolens, bomen en mensen ──
  const wieken = [[-5.4, -3.9, 1.0], [5.35, -3.9, 0.9]].map(([x, z, s]) => {
    const m = groepje(wereld, x, 0, z);
    cilinder(m, 0.05 * s, 0.09 * s, 2.6 * s, K.wit, 0, 0, 0, { seg: 10 });
    blok(m, 0.14 * s, 0.14 * s, 0.26 * s, K.wit, 0, 2.6 * s, 0.05, { r: 0.03 });
    const rotor = levend(groepje(m, 0, 2.67 * s, 0.2 * s));
    for (let i = 0; i < 3; i++) {
      const wiek = groepje(rotor);
      wiek.rotation.z = i * Math.PI * 2 / 3;
      blok(wiek, 0.08 * s, 1.0 * s, 0.02, K.wit, 0, 0.04, 0, { r: 0.015 });
    }
    bol(rotor, 0.06 * s, K.grijs, 0, 0, 0.02, { seg: 10 });
    samen.push(m);
    intro.push({ obj: m, start: 1.4, soort: 'pop' });
    return rotor;
  });
  const bomen = [[-1.9, -3.9, 0.9], [-5.3, -0.2, 0.75], [-5.4, 3.1, 0.7], [1.9, 2.9, 0.8], [-0.9, 2.9, 0.7], [2.4, -0.25, 0.6], [-2.9, -0.1, 0.55], [5.4, -1.4, 0.7]].map(([x, z, s], i) => {
    const b = boom(wereld, x, z, s, [[K.blad2, K.blad1, K.blad3], [K.blad1, K.blad2], [K.blad3, K.blad1]][i % 3]);
    samen.push(b);
    intro.push({ obj: b, start: 1.2 + i * 0.05, soort: 'pop' });
    return b;
  });
  {
    // haag achteraan
    for (let i = 0; i < 9; i++) blok(sokkel, 1.3, 0.3 + r() * 0.1, 0.36, i % 2 ? K.blad2 : 0x5aa56d, -5.3 + i * 1.33, 0, -4.55, { r: 0.12 });
    // grassprietjes in één tekenbeurt
    const spriet = new T.ConeGeometry(0.035, 0.13, 5);
    spriet.translate(0, 0.065, 0);
    const n = 70;
    const gras = levend(new T.InstancedMesh(spriet, new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), n));
    const m4 = new T.Matrix4(), kleur = new T.Color();
    let i = 0;
    while (i < n) {
      const x = (r() - 0.5) * 11.6, z = -4.3 + r() * 7.9;
      const vrij = [[-3.95, -2.55, 1.4, 1.1], [0.25, -2.75, 1.7, 1.3], [4.05, -2.5, 1.2, 1.1], [-3.95, 1.75, 1.5, 1.2], [3.9, 2.2, 2.2, 1.6], [0.6, 0.75, 1.9, 1.3], [0, -1.05, 6.2, 0.5], [-1.9, 0.55, 0.5, 1.2]]
        .every(([cx, cz, hx, hz]) => Math.abs(x - cx) > hx || Math.abs(z - cz) > hz);
      if (!vrij) continue;
      const sc = 0.7 + r() * 0.8;
      m4.makeScale(sc, sc, sc).setPosition(x, 0, z);
      gras.setMatrixAt(i, m4);
      gras.setColorAt(i, kleur.setHex([K.blad1, K.blad2, 0xa6d3b0][i % 3]));
      i++;
    }
    gras.receiveShadow = true;
    wereld.add(gras);
  }
  // lantaarns rond het plein
  for (const [x, z] of [[-1.15, 1.75], [2.2, 1.75], [-1.15, -0.35], [2.2, -0.35]]) {
    const l = groepje(wereld, x, 0, z);
    cilinder(l, 0.025, 0.03, 1.0, K.groenDonker, 0, 0, 0, { seg: 8 });
    bol(l, 0.05, 0, 0, 1.05, 0, { materiaal: lampMat, schaduw: false, seg: 10 });
    gloed(l, 0, 1.05, 0, 0.8);
    samen.push(l);
  }
  // een elektrische bus rijdt heen en weer
  const bus = levend(groepje(wereld, 0, 0.02, -1.25));
  blok(bus, 1.1, 0.42, 0.42, K.groen, 0, 0.1, 0, { r: 0.08 });
  blok(bus, 1.0, 0.16, 0.44, K.blauw, 0, 0.3, 0, { r: 0.04 });
  for (const xx of [-0.35, 0.35]) for (const zz of [-0.2, 0.2]) {
    const wiel = cilinder(bus, 0.08, 0.08, 0.06, K.inkt, xx, 0, zz, { seg: 12 });
    wiel.rotation.x = Math.PI / 2; wiel.position.y = 0.08;
  }
  // mensen en kinderen op het plein
  const wandelaars = [
    { shirt: K.perzik, huid: HUID[2], haar: HAAR[0], schaal: 0.8, straal: 1.0, snel: 0.35, fase: 0 },
    { shirt: K.geel, huid: HUID[4], haar: HAAR[4], schaal: 0.78, straal: 1.0, snel: 0.35, fase: 0.5 },
    { shirt: K.blauw, huid: HUID[3], haar: HAAR[3], schaal: 1, straal: 1.35, snel: -0.22, fase: 2 },
    { shirt: K.mint, huid: HUID[1], haar: HAAR[1], schaal: 0.82, straal: 1.6, snel: 0.18, fase: 4 },
  ].map(w => ({ ...w, f: figuur(wereld, { x: PLEIN.x, y: 0, z: PLEIN.z, shirt: w.shirt, huid: w.huid, haar: w.haar, schaal: w.schaal }) }));

  // ── het lichtje ──
  const lichtje = maakLichtje();
  const STATIONS = ['lab', 'fabriek', 'krant', 'museum', 'haven'];
  const lichtPlek = id => {
    const k = kamers[id].groep.position;
    return new T.Vector3(k.x, 1.0, k.z + 1.25);
  };
  let actief = null;

  kamerLamp(-3.95, 0.8, -1.6, 2);
  kamerLamp(4.05, 1.2, -1.6, 2);

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
    intro: [...intro, ...wandelaars.map((w, i) => ({ obj: w.f, start: 1.5 + i * 0.1, soort: 'pop' })), { obj: bus, start: 1.6, soort: 'pop' }, { obj: fontein, start: 0.2, soort: 'pop' }],
    bijFocus(f) {
      if (!lichtje.aan) return;
      const naar = kamers[f] ? lichtPlek(f) : PLEIN;
      actief = kamers[f] ? f : null;
      lichtje.vlieg(naar, () => {});
    },
    stil() {
      lichtje.stilZetten(PLEIN);
    },
    werkBij(dt, nu, { nacht }) {
      if (nu > 1.7 && !lichtje.aan) lichtje.zetAan(PLEIN, nu);
      lichtje.werkBij(dt, nu, { denkt: false, nacht });
      // de fontein
      druppels.forEach(d => {
        const p = (nu * 0.8 + d.userData.hoek / 6.28) % 1;
        d.position.set(Math.cos(d.userData.hoek) * p * 0.4, 0.6 + Math.sin(p * Math.PI) * 0.25 - p * 0.35, Math.sin(d.userData.hoek) * p * 0.4);
        d.material.opacity = 0.85 * (1 - p * 0.6);
      });
      // de lopende band en de rook
      kistjes.forEach((k, i) => { k.position.x = -0.85 + ((nu * 0.25 + i * 0.25) % 1) * 1.7; });
      rook.forEach(b => {
        const p = (nu * 0.25 + b.userData.verschuiving) % 1;
        b.position.set(1.05 + p * 0.3, 2.35 + p * 0.9, -0.4);
        b.scale.setScalar(0.7 + p * 1.2);
        b.material.opacity = 0.65 * (1 - p);
      });
      for (const rotor of wieken) rotor.rotation.z = -nu * 0.9;
      boot.position.y = 0.02 + Math.sin(nu * 1.6) * 0.02;
      boot.rotation.z = Math.sin(nu * 1.2) * 0.04;
      {
        const p = (nu % 24) / 24, heen = p < 0.5, q = heen ? p * 2 : (p - 0.5) * 2;
        bus.position.x = heen ? -5.2 + q * 10.4 : 5.2 - q * 10.4;
        bus.position.z = heen ? -0.85 : -1.25;
        bus.rotation.y = heen ? 0 : Math.PI;
      }
      for (const w of wandelaars) {
        const hoek = nu * w.snel + w.fase;
        w.f.position.set(PLEIN.x + Math.cos(hoek) * w.straal, Math.abs(Math.sin(nu * 7 + w.fase)) * 0.02, PLEIN.z + Math.sin(hoek) * w.straal * 0.7);
        w.f.rotation.y = -hoek + (w.snel > 0 ? Math.PI : 0);
        const [l, rr] = w.f.userData.benen;
        l.rotation.x = Math.sin(nu * 7 + w.fase) * 0.35; rr.rotation.x = -l.rotation.x;
      }
      for (const v of Object.values(vlaggen)) if (v.visible) v.userData.doek.rotation.y = Math.sin(nu * 3 + v.position.x) * 0.25;
      toplamp.scale.setScalar(1 + Math.sin(nu * 2) * 0.08);
    },
    api: {
      // Zet de vlag op het dak als de klas het station afrondde.
      stempel(id, aan) { if (vlaggen[id]) vlaggen[id].visible = !!aan; },
    },
  };
}
