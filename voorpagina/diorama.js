// Het tafereel op de startpagina: een school als poppenhuis op een sokkel.
// Elke verdieping hoort bij één doelgroep: de directie boven, de klas in het
// midden, de leerling beneden. Ernaast staat een kleine basisschool voor
// Leerlichtjes, het aanbod voor het lager. Een klein lichtje, de AI-assistent,
// vliegt van verdieping naar verdieping. Daar typt zich een prompt en bouwt het
// antwoord zich op. Voorwerpen met een bolletje openen een kaartje met uitleg
// (de teksten staan in plekken.js). De motor zit in gedeeld/diorama-kern.js.
import {
  T, K, HUID, HAAR, klem, uitTerug, toeval, blok, cilinder, bol, kruin, puntdak, groepje, levend,
  figuur, stoel, lessenaar, plant, laptop, boom, maakPodium, F, rond, breek, getypteRegels, vinkje,
  denkpuntjes, cursor, paneel, mat, zet,
} from '../gedeeld/diorama-kern.js';

// Maten van het gebouw. Het gebouw is aan de voorkant open, zoals een poppenhuis.
const BREED = 6.4, DIEP = 3.2, ACHTER = -2.6, MIDZ = -1.0, VH = 2.0, PLAAT = 0.12, MUUR = 0.14;
const BINNEN_ACHTER = ACHTER + MUUR, LINKS_BINNEN = -BREED / 2 + MUUR, VOOR = 0.6;
// De kleine basisschool links van de grote school.
const LAGER = { x: -4.65, z: -1.05, b: 1.9, d: 1.5, h: 1.15 };

// Het ritme van één verhaaltje: typen, even nadenken, het antwoord opbouwen.
const TYP = 0.045, DENK = 1.1, STAP = 0.6, RUST = 3.4, OPRUIM = 0.45;

// ───────────────────────────── teksten op borden en schermen ─────────────────────────────

function tekenKlasbord(p, v) {
  const { ctx, c } = p, W = c.width, H = c.height;
  ctx.fillStyle = '#fdfdfb'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.beginPath(); ctx.arc(48, 46, 11, 0, Math.PI * 2); ctx.fill();
  ctx.font = F(600, 28); ctx.fillStyle = '#4d4d4d'; ctx.fillText('Je AI-assistent', 70, 56);
  ctx.font = F(600, 40);
  const regels = breek(ctx, v.prompt, W - 150);
  const bh = regels.length * 54 + 34;
  rond(ctx, 36, 84, W - 72, bh, 26); ctx.fillStyle = '#ccefd5'; ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  const zicht = getypteRegels(regels, v.getypt);
  zicht.forEach((r, i) => ctx.fillText(r, 70, 84 + 58 + i * 54));
  if (v.fase === 'typen') cursor(ctx, zicht, 70, 84 + 58, 54, 40);
  const y0 = 84 + bh + 26;
  if (v.fase === 'denken') denkpuntjes(ctx, 74, y0 + 40, v.puntjes);
  const stappen = ['verdampen', 'wolken vormen', 'regen', 'terug naar zee'];
  const kleuren = ['#bfe3ed', '#fbf59b', '#c2e3cc', '#fcc89b'];
  const cb = (W - 72 - 3 * 18) / 4;
  for (let i = 0; i < v.zichtbaar; i++) {
    const x = 36 + i * (cb + 18);
    rond(ctx, x, y0, cb, H - y0 - 30, 22); ctx.fillStyle = kleuren[i]; ctx.fill();
    ctx.fillStyle = '#126425'; ctx.beginPath(); ctx.arc(x + 36, y0 + 38, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = F(700, 24); ctx.textAlign = 'center'; ctx.fillText(String(i + 1), x + 36, y0 + 47); ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 28); ctx.fillText(stappen[i], x + 22, y0 + 104);
  }
}
function tekenBeleidsbord(p, v) {
  const { ctx, c } = p, W = c.width;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, c.height);
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, 80);
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(36, 58, 64, 12);
  ctx.fillStyle = '#ffffff'; ctx.font = F(700, 38); ctx.fillText('Ons AI-beleid', 36, 52);
  ctx.font = F(600, 32);
  const regels = breek(ctx, v.prompt, W - 120);
  const bh = regels.length * 44 + 30;
  rond(ctx, 30, 102, W - 60, bh, 22); ctx.fillStyle = '#ccefd5'; ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  const zicht = getypteRegels(regels, v.getypt);
  zicht.forEach((r, i) => ctx.fillText(r, 56, 102 + 48 + i * 44));
  if (v.fase === 'typen') cursor(ctx, zicht, 56, 102 + 48, 44, 32);
  const y0 = 102 + bh + 30;
  if (v.fase === 'denken') denkpuntjes(ctx, 60, y0 + 26, v.puntjes);
  const punten = ['Wat mag', 'Wat mag niet', 'Wie beslist wat', 'Privacy van leerlingen'];
  for (let i = 0; i < v.zichtbaar; i++) {
    const y = y0 + 22 + i * 62;
    vinkje(ctx, 58, y, 20);
    ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 30); ctx.fillText(punten[i], 96, y + 11);
  }
}
function tekenLeerlingscherm(p, v) {
  const { ctx, c } = p, W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ccefd5'; ctx.fillRect(0, 0, W, 44);
  ['#fcc89b', '#fbf59b', '#c2e3cc'].forEach((k, i) => { ctx.fillStyle = k; ctx.beginPath(); ctx.arc(26 + i * 24, 22, 8, 0, Math.PI * 2); ctx.fill(); });
  ctx.font = F(600, 24);
  const regels = breek(ctx, v.prompt, 420);
  const bb = Math.max(...regels.map(r => ctx.measureText(r).width)) + 40;
  const bh = regels.length * 32 + 22;
  rond(ctx, W - 20 - bb, 60, bb, bh, 18); ctx.fillStyle = '#fcc89b'; ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  const zicht = getypteRegels(regels, v.getypt);
  zicht.forEach((r, i) => ctx.fillText(r, W - bb, 60 + 34 + i * 32));
  if (v.fase === 'typen') cursor(ctx, zicht, W - bb, 60 + 34, 32, 24);
  const y0 = 60 + bh + 26;
  if (v.fase === 'denken') denkpuntjes(ctx, 34, y0 + 20, v.puntjes);
  const rijen = [['Onderwerp kiezen', 1, 2, '#c2e3cc'], ['Bronnen zoeken', 3, 5, '#bfe3ed'], ['Zelf schrijven', 6, 8, '#fcc89b'], ['Oefenen voor de jury', 9, 9, '#fbf59b']];
  const bx = 262, bw = W - 24 - bx;
  if (v.zichtbaar > 0) {
    ctx.fillStyle = '#4d4d4d'; ctx.font = F(400, 15);
    ctx.fillText('week 1', bx, y0 - 4); ctx.textAlign = 'right'; ctx.fillText('week 9', bx + bw, y0 - 4); ctx.textAlign = 'left';
  }
  for (let i = 0; i < v.zichtbaar; i++) {
    const [label, van, tot, kleur] = rijen[i];
    const y = y0 + 8 + i * 46;
    ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 20); ctx.fillText(label, 24, y + 24);
    rond(ctx, bx + (van - 1) / 9 * bw, y + 4, (tot - van + 1) / 9 * bw, 28, 14); ctx.fillStyle = kleur; ctx.fill();
  }
}
function tekenVoortgang({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 34); ctx.fillText('Mijn voortgang', 28, 56);
  [1, 1, 0.7, 0.3, 0].forEach((w, i) => {
    const y = 90 + i * 46;
    ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 20); ctx.fillText('H' + (i + 1), 28, y + 22);
    rond(ctx, 80, y + 6, W - 120, 22, 11); ctx.fillStyle = '#eeeeee'; ctx.fill();
    if (w > 0) { rond(ctx, 80, y + 6, (W - 120) * w, 22, 11); ctx.fillStyle = w === 1 ? '#126425' : '#c2e3cc'; ctx.fill(); }
  });
}
function tekenCertificaat({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffdf6'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#126425'; ctx.lineWidth = 10; ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#126425'; ctx.font = F(700, 52); ctx.fillText('Certificaat', W / 2, 118);
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(W / 2 - 90, 140, 180, 10);
  vinkje(ctx, W / 2, 222, 40);
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(600, 30); ctx.fillText('AI-cursus afgerond', W / 2, 318);
  ctx.textAlign = 'left';
}
function tekenBord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(70, H * 0.56, 300, H * 0.3);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 108); ctx.textAlign = 'center'; ctx.fillText('samen is beter', W / 2, H * 0.72); ctx.textAlign = 'left';
}
function tekenNaambord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c2e3cc'; ctx.fillRect(W / 2 - 250, H * 0.58, 220, H * 0.26);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 96); ctx.textAlign = 'center'; ctx.fillText('AI op school', W / 2, H * 0.72); ctx.textAlign = 'left';
}
function tekenLagerBord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,207,58,.35)'; ctx.beginPath(); ctx.arc(H * 0.55, H / 2, H * 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffcf3a'; ctx.beginPath(); ctx.arc(H * 0.55, H / 2, H * 0.26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = F(700, Math.round(H * 0.5)); ctx.fillText('Leerlichtjes', H * 1.05, H * 0.68);
}
function tekenA4({ ctx, c }) {
  const W = c.width;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, c.height);
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, 40);
  ctx.fillStyle = '#ffffff'; ctx.font = F(600, 20); ctx.fillText('AI-beleid', 18, 27);
  for (let i = 0; i < 4; i++) {
    const y = 78 + i * 66;
    vinkje(ctx, 32, y, 13);
    ctx.fillStyle = '#d5d5d5'; ctx.fillRect(56, y - 10, W - 80, 9); ctx.fillRect(56, y + 6, (W - 80) * 0.6, 9);
  }
}
function tekenKalender({ ctx, c }) {
  const W = c.width;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, c.height);
  ctx.fillStyle = '#126425'; ctx.fillRect(0, 0, W, 58);
  ctx.fillStyle = '#ffffff'; ctx.font = F(700, 28); ctx.fillText('Teamsessie', 20, 40);
  const cel = (W - 40) / 7;
  for (let r = 0; r < 5; r++) {
    for (let k = 0; k < 7; k++) {
      const x = 20 + k * cel, y = 76 + r * cel * 0.86;
      const groot = r === 2 && k === 3;
      rond(ctx, x + 3, y + 3, cel - 6, cel * 0.86 - 6, 6);
      ctx.fillStyle = groot ? '#126425' : k > 4 ? '#f1f1f1' : '#e7f4eb';
      ctx.fill();
    }
  }
  vinkje(ctx, 20 + 3.5 * cel, 76 + 2.5 * cel * 0.86, cel * 0.3, '#0d4a1b');
}
function tekenPrikbord({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#d9aa72'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { ctx.fillStyle = i % 2 ? 'rgba(120,70,20,.12)' : 'rgba(255,255,255,.1)'; ctx.fillRect((i * 97) % W, (i * 53) % H, 4, 4); }
  // drie kaartjes van de casussen: mag, mag niet, hangt ervan af
  const kaarten = [['#c2e3cc', '✓', '#126425'], ['#f6c8c4', '✗', '#a3242b'], ['#fbf59b', '?', '#5b4f00']];
  kaarten.forEach(([bg, teken, kleur], i) => {
    const x = 24 + i * 118, y = 30 + (i % 2) * 22;
    ctx.save(); ctx.translate(x + 50, y + 60); ctx.rotate((i - 1) * 0.06);
    ctx.fillStyle = bg; ctx.fillRect(-50, -60, 100, 120);
    ctx.fillStyle = kleur; ctx.font = F(700, 64); ctx.textAlign = 'center'; ctx.fillText(teken, 0, 22); ctx.textAlign = 'left';
    ctx.restore();
    ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.arc(x + 50, y + 4, 7, 0, Math.PI * 2); ctx.fill();
  });
  // en een tekening van een leerling
  ctx.fillStyle = '#ffffff'; ctx.fillRect(70, 186, 130, 96);
  ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.arc(102, 214, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fcc89b'; ctx.fillRect(128, 230, 50, 40);
  ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.moveTo(122, 232); ctx.lineTo(153, 206); ctx.lineTo(184, 232); ctx.fill();
  ctx.fillStyle = '#4e9a63'; ctx.fillRect(70, 270, 130, 12);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(232, 196, 118, 84);
  ctx.fillStyle = '#126425'; ctx.font = F(700, 22); ctx.fillText('Mag dit?', 244, 232);
  ctx.fillStyle = '#bdbdbd'; ctx.fillRect(244, 246, 92, 7); ctx.fillRect(244, 260, 70, 7);
  ctx.fillStyle = '#5fa9c9'; ctx.beginPath(); ctx.arc(135, 190, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(291, 200, 6, 0, Math.PI * 2); ctx.fill();
}
function tekenQuiz({ ctx, c }) {
  const W = c.width;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, c.height);
  ctx.fillStyle = '#bfe3ed'; ctx.fillRect(0, 0, W, 54);
  ctx.fillStyle = '#124a5e'; ctx.font = F(700, 26); ctx.fillText('Rekenquiz', 18, 37);
  ctx.textAlign = 'right'; ctx.font = F(600, 20); ctx.fillText('★ 3', W - 18, 36); ctx.textAlign = 'left';
  ctx.fillStyle = '#1a1a1a'; ctx.font = F(700, 44); ctx.textAlign = 'center'; ctx.fillText('3 × 4 = ?', W / 2, 120);
  [['7', '#fbf59b'], ['12', '#126425'], ['34', '#fcc89b']].forEach(([t, kleur], i) => {
    const b = (W - 60) / 3, x = 18 + i * (b + 12);
    rond(ctx, x, 150, b, 70, 18); ctx.fillStyle = kleur; ctx.fill();
    ctx.fillStyle = i === 1 ? '#ffffff' : '#1a1a1a'; ctx.font = F(700, 34); ctx.fillText(t, x + b / 2, 198);
  });
  ctx.textAlign = 'left';
}

// De planner die een directie zelf bouwde, op testgegevens: er staat geen naam
// op, en het label zegt waarom. Het hoort bij het bolletje "zelfbouw".
function tekenPlanner({ ctx, c }) {
  const W = c.width, H = c.height;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ccefd5'; ctx.fillRect(0, 0, W, 44);
  ctx.fillStyle = '#0d4a1b'; ctx.font = F(700, 19); ctx.fillText('Mijn vervangingsplanner', 16, 29);
  ctx.font = F(600, 14);
  const label = 'testgegevens', lb = ctx.measureText(label).width + 20;
  rond(ctx, W - 14 - lb, 11, lb, 23, 11); ctx.fillStyle = '#fbf59b'; ctx.fill();
  ctx.fillStyle = '#5b4f00'; ctx.fillText(label, W - 4 - lb, 27);
  const dagen = ['ma', 'di', 'wo', 'do', 'vr'], hoog = [3, 5, 2, 4, 1];
  const x0 = 24, basis = H - 30, kolom = 34;
  dagen.forEach((d, i) => {
    const h = hoog[i] * 26, x = x0 + i * (kolom + 10);
    rond(ctx, x, basis - h, kolom, h, 8); ctx.fillStyle = i === 1 ? '#126425' : '#86c494'; ctx.fill();
    ctx.fillStyle = '#4d4d4d'; ctx.font = F(600, 14); ctx.textAlign = 'center'; ctx.fillText(d, x + kolom / 2, basis + 20); ctx.textAlign = 'left';
  });
  const lx = 268;
  [['#fcc89b', 72], ['#bfe3ed', 56], ['#fbf59b', 64], ['#c2e3cc', 48]].forEach(([k, b], i) => {
    const y = 66 + i * 34;
    ctx.fillStyle = k; ctx.beginPath(); ctx.arc(lx, y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d6d6d6'; ctx.fillRect(lx + 16, y - 5, b, 10);
  });
}

// ───────────────────────────── het tafereel ─────────────────────────────

export function maakDiorama(canvas, opties = {}) {
  return maakPodium(canvas, opties, g => bouwSchool(g));
}

function bouwSchool(g) {
  const { wereld, kamerLamp, glasBuiten, gloed, hanglamp, raamBinnen, raamBuiten, maakLichtje, plek, speel, statischeTekening } = g;
  const tijd = g.tijd;
  for (let i = 0; i < 3; i++) kamerLamp(0, i * VH + 1.55, -0.8);
  kamerLamp(LAGER.x, LAGER.h * 0.7, LAGER.z + 0.3, 2.5);

  // ── sokkel met naambordje en haag ──
  const sokkel = groepje(wereld);
  blok(sokkel, 12, 0.5, 8, K.mint, 0, -0.5, -0.6, { r: 0.22, schaduw: false });
  blok(sokkel, 12.2, 0.3, 8.2, K.groen, 0, -0.78, -0.6, { r: 0.14, schaduw: false });
  blok(sokkel, 2.9, 0.36, 0.04, K.groenDonker, 0, -0.43, 3.4, { r: 0.015, schaduw: false });
  statischeTekening(paneel(sokkel, 2.8, 0.28, 1024, 0, -0.25, 3.425), tekenNaambord);
  {
    // Een zachte schaduw onder het gebouw. De muren werpen zelf geen schaduw:
    // anders zou de vloer erboven de kamers donker maken.
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gr = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gr.addColorStop(0, 'rgba(13,74,27,0.34)'); gr.addColorStop(1, 'rgba(13,74,27,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    const vlek = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }));
    vlek.rotation.x = -Math.PI / 2;
    vlek.scale.set(9.2, 5.6, 1);
    vlek.position.set(-0.3, 0.004, -1.3);
    sokkel.add(vlek);
  }
  const r = toeval(7);
  for (let i = 0; i < 9; i++) {
    blok(sokkel, 1.3, 0.3 + r() * 0.12, 0.36, i % 2 ? K.blad2 : 0x5aa56d, -5.25 + i * 1.3, 0, -4.32, { r: 0.12 });
  }
  for (let i = 0; i < 5; i++) {
    blok(sokkel, 0.36, 0.28 + r() * 0.1, 1.25, i % 2 ? K.blad2 : 0x5aa56d, -5.78, 0, -3.6 + i * 1.25, { r: 0.12 });
  }

  // ── het gebouw: drie verdiepingen die elk apart binnenvallen ──
  const kamers = {};
  function verdieping(naam, i, tint, tintZij, vloer, { deur = false } = {}) {
    const v = new T.Group();
    v.position.y = i * VH;
    blok(v, BREED, PLAAT, DIEP, K.wit, 0, 0, MIDZ, { r: 0.025, schaduw: false });
    blok(v, BREED + 0.01, 0.035, 0.012, K.groen, 0, 0.045, VOOR + 0.004, { r: 0, schaduw: false });
    blok(v, BREED - 0.3, 0.012, DIEP - 0.25, vloer, 0, PLAAT, MIDZ - 0.06, { r: 0, schaduw: false });
    blok(v, BREED, VH - PLAAT, MUUR, K.muur, 0, PLAAT, ACHTER + MUUR / 2, { r: 0.01, schaduw: false });
    for (const kant of [-1, 1]) {
      blok(v, MUUR, VH - PLAAT, DIEP - MUUR, K.muur, kant * (BREED / 2 - MUUR / 2), PLAAT, MIDZ + MUUR / 2, { r: 0.01, schaduw: false });
    }
    // Elke kamer krijgt een eigen materiaal voor de achterwand: dat licht op
    // als je er met de muis over gaat, en gloeit 's avonds een beetje.
    const wandMat = new T.MeshLambertMaterial({ color: tint, emissive: 0xfff1d6, emissiveIntensity: 0 });
    wandMat.userData.apart = true;
    blok(v, BREED - 2 * MUUR, VH - PLAAT, 0.01, 0, 0, PLAAT, BINNEN_ACHTER + 0.006, { r: 0, schaduw: false, materiaal: wandMat });
    blok(v, 0.01, VH - PLAAT, DIEP - MUUR - 0.02, tintZij, LINKS_BINNEN + 0.006, PLAAT, MIDZ + MUUR / 2, { r: 0, schaduw: false });
    // plinten
    blok(v, BREED - 2 * MUUR, 0.06, 0.02, K.houtDonker, 0, PLAAT, BINNEN_ACHTER + 0.02, { r: 0, schaduw: false });
    blok(v, 0.02, 0.06, DIEP - MUUR, K.houtDonker, LINKS_BINNEN + 0.02, PLAAT, MIDZ + MUUR / 2, { r: 0, schaduw: false });
    // ramen aan de buitenkant rechts, met bloembakken; beneden een deur
    for (const [j, z] of [[0, ACHTER + 0.9], [1, VOOR - 0.85]]) {
      if (deur && j === 1) {
        blok(v, 0.05, 1.22, 0.76, K.wit, BREED / 2 + 0.01, PLAAT, z, { r: 0.015, schaduw: false });
        blok(v, 0.05, 1.12, 0.62, K.groen, BREED / 2 + 0.02, PLAAT, z, { r: 0.015, schaduw: false });
        bol(v, 0.025, K.geel, BREED / 2 + 0.05, PLAAT + 0.56, z + 0.2, { seg: 8, schaduw: false });
        blok(v, 0.34, 0.05, 0.92, K.groen, BREED / 2 + 0.16, PLAAT + 1.27, z, { r: 0.015 });
        blok(v, 0.36, 0.08, 0.9, K.steen, BREED / 2 + 0.18, -0.08, z, { r: 0.02, schaduw: false });
        continue;
      }
      blok(v, 0.04, 0.74, 0.86, K.groen, BREED / 2 + 0.01, PLAAT + 0.42, z, { r: 0.015, schaduw: false });
      blok(v, 0.03, 0.62, 0.74, 0, BREED / 2 + 0.008, PLAAT + 0.48, z, { r: 0.01, schaduw: false, materiaal: glasBuiten });
      blok(v, 0.035, 0.62, 0.03, K.wit, BREED / 2 + 0.026, PLAAT + 0.48, z, { r: 0, schaduw: false });
      if (i > 0) {
        blok(v, 0.13, 0.11, 0.72, K.perzik, BREED / 2 + 0.07, PLAAT + 0.3, z, { r: 0.02 });
        for (let k = 0; k < 5; k++) bol(v, 0.045, [K.roos, K.geel, K.roosDiep, K.blad1, K.roos][k], BREED / 2 + 0.08, PLAAT + 0.43, z - 0.28 + k * 0.14, { seg: 8 });
      }
    }
    const raak = new T.Mesh(new T.BoxGeometry(BREED, VH, DIEP), new T.MeshBasicMaterial({ visible: false }));
    raak.position.set(0, VH / 2, MIDZ);
    raak.userData.kamer = naam;
    v.add(levend(raak));
    wereld.add(v);
    kamers[naam] = { groep: v, wandMat, raak };
    return v;
  }

  // ── gelijkvloers: de leerling ──
  const gv = verdieping('leerling', 0, K.perzik, 0xf5b989, 0xe8d3b4, { deur: true });
  blok(gv, 3.7, 0.05, 0.7, K.hout, -0.8, PLAAT + 0.45, -2.05, { r: 0.015 });
  blok(gv, 3.6, 0.45, 0.62, K.wit, -0.8, PLAAT, -2.05, { r: 0.02 });
  const deskTop = PLAAT + 0.5;
  raamBinnen(gv, -2.62, PLAAT + 1.05, BINNEN_ACHTER + 0.012, 0.6, 0.55);
  const schermA = plek('studiemaatje', 'leerling', groepje(gv));
  blok(schermA, 0.08, 0.12, 0.06, K.inkt, -1.6, deskTop, -2.22, { r: 0.01 });
  blok(schermA, 0.98, 0.62, 0.05, K.inkt, -1.6, deskTop + 0.1, -2.22, { r: 0.02 });
  const scherm = paneel(schermA, 0.9, 0.54, 640, -1.6, deskTop + 0.41, -2.193, { scherm: true });
  const schermB = plek('voortgang', 'leerling', groepje(gv));
  blok(schermB, 0.08, 0.1, 0.06, K.inkt, 0.35, deskTop, -2.22, { r: 0.01 });
  blok(schermB, 0.7, 0.46, 0.05, K.inkt, 0.35, deskTop + 0.08, -2.22, { r: 0.02 });
  statischeTekening(paneel(schermB, 0.63, 0.39, 512, 0.35, deskTop + 0.31, -2.193, { scherm: true }), tekenVoortgang);
  blok(gv, 0.22, 0.03, 0.14, K.grijs, -1.0, deskTop, -1.95, { r: 0.01 });
  blok(gv, 0.2, 0.03, 0.12, K.grijs, 0.75, deskTop, -1.95, { r: 0.01 });
  stoel(gv, -1.12, PLAAT, -1.3, Math.PI + 0.5, K.groen);
  const leerling1 = figuur(gv, { x: -1.12, y: PLAAT, z: -1.3, draai: Math.PI + 0.5, shirt: K.perzik, huid: HUID[2], haar: HAAR[0], zit: true });
  stoel(gv, 0.35, PLAAT, -1.3, Math.PI, K.groen);
  const leerling2 = figuur(gv, { x: 0.35, y: PLAAT, z: -1.3, draai: Math.PI, shirt: K.blauw, huid: HUID[4], haar: HAAR[4], zit: true });
  blok(gv, 0.24, 0.3, 0.15, K.perzik, -1.78, PLAAT, -1.05, { r: 0.06 });
  blok(gv, 0.16, 0.12, 0.02, 0xf2a76b, -1.78, PLAAT + 0.06, -0.97, { r: 0.008 });
  const certificaat = plek('certificaat', 'leerling', groepje(gv));
  blok(certificaat, 0.66, 0.5, 0.04, K.hout, 1.95, PLAAT + 0.9, BINNEN_ACHTER + 0.02, { r: 0.015 });
  statischeTekening(paneel(certificaat, 0.58, 0.42, 512, 1.95, PLAAT + 1.15, BINNEN_ACHTER + 0.045), tekenCertificaat);
  const kastje = plek('handleiding', 'leerling', groepje(gv));
  blok(kastje, 1.15, 0.5, 0.4, K.wit, 2.3, PLAAT, -2.22, { r: 0.03 });
  blok(kastje, 1.0, 0.02, 0.36, K.houtDonker, 2.3, PLAAT + 0.24, -2.2, { r: 0, schaduw: false });
  plant(kastje, 2.68, PLAAT + 0.5, -2.2, 0.8);
  for (let i = 0; i < 5; i++) blok(kastje, 0.06, 0.22 + (i % 2) * 0.04, 0.17, [K.groen, K.geel, K.blauw, K.perzik, K.mint][i], 1.88 + i * 0.075, PLAAT + 0.5, -2.2, { r: 0.008 });
  blok(kastje, 0.2, 0.05, 0.14, K.groenDonker, 2.25, PLAAT + 0.5, -2.2, { r: 0.01 });
  const leeshoek = plek('kansen', 'leerling', groepje(gv));
  cilinder(leeshoek, 0.55, 0.55, 0.01, 0xf7dcc0, 2.15, PLAAT, -0.7, { seg: 28, schaduw: false });
  const zitzak = bol(leeshoek, 0.32, K.groen, 2.15, PLAAT + 0.14, -0.7, { seg: 20 });
  zitzak.scale.set(1, 0.58, 1);
  const lezer = figuur(leeshoek, { x: 2.15, y: PLAAT + 0.02, z: -0.72, draai: -0.55, shirt: K.geel, huid: HUID[3], haar: HAAR[3], zit: true });
  blok(lezer, 0.2, 0.15, 0.03, K.blauw, 0, 0.5, 0.2, { r: 0.008 }).rotation.x = -0.5;
  // post-its: verschijnen terwijl de planning opbouwt
  const postitMuur = plek('gip', 'leerling', groepje(gv));
  const postits = [K.geel, K.mint, K.perzik, K.blauw].map((k, i) => {
    const p = blok(postitMuur, 0.17, 0.17, 0.012, k, -0.88 + (i % 2) * 0.24, PLAAT + 0.95 + Math.floor(i / 2) * 0.22, BINNEN_ACHTER + 0.03, { r: 0.004, schaduw: false });
    p.rotation.z = (r() - 0.5) * 0.25;
    return { obj: p, stap: i };
  });
  hanglamp(gv, -2.55, -0.6, VH);
  hanglamp(gv, 1.45, -0.55, VH);

  // ── eerste verdieping: de klas ──
  const kl = verdieping('klas', 1, K.blauw, 0xaed6e2, 0xe4c397);
  const bord = plek('prompt', 'klas', groepje(kl));
  blok(bord, 2.5, 1.12, 0.04, K.grijs, -0.7, PLAAT + 0.34, BINNEN_ACHTER + 0.02, { r: 0.02 });
  const klasbord = paneel(bord, 2.4, 1.02, 1024, -0.7, PLAAT + 0.9, BINNEN_ACHTER + 0.045);
  blok(bord, 2.3, 0.04, 0.08, K.grijs, -0.7, PLAAT + 0.32, BINNEN_ACHTER + 0.06, { r: 0.01 });
  for (const [x, k] of [[-1.5, K.groen], [-1.4, K.rood], [-1.3, K.zee]]) blok(bord, 0.07, 0.02, 0.02, k, x, PLAAT + 0.36, BINNEN_ACHTER + 0.07, { r: 0.008, schaduw: false });
  const klok = plek('ouders', 'klas', groepje(kl));
  {
    const schijf = cilinder(klok, 0.12, 0.12, 0.03, K.wit, 1.05, 0, BINNEN_ACHTER + 0.02, { seg: 24 });
    schijf.rotation.x = Math.PI / 2;
    schijf.position.y = PLAAT + 1.3;
    const rand = new T.Mesh(new T.TorusGeometry(0.12, 0.014, 6, 24), mat(K.groen));
    rand.position.set(1.05, PLAAT + 1.3, BINNEN_ACHTER + 0.035);
    klok.add(rand);
    blok(klok, 0.012, 0.09, 0.01, K.inkt, 1.05, PLAAT + 1.29, BINNEN_ACHTER + 0.04, { r: 0, schaduw: false });
    blok(klok, 0.065, 0.012, 0.01, K.inkt, 1.08, PLAAT + 1.295, BINNEN_ACHTER + 0.04, { r: 0, schaduw: false });
  }
  const prikbord = plek('casussen', 'klas', groepje(kl));
  blok(prikbord, 0.03, 0.78, 1.04, K.houtDonker, LINKS_BINNEN + 0.02, PLAAT + 0.5, -1.15, { r: 0.012 });
  statischeTekening(paneel(prikbord, 0.96, 0.7, 384, LINKS_BINNEN + 0.04, PLAAT + 0.89, -1.15, { draai: Math.PI / 2 }), tekenPrikbord);
  blok(kl, 1.08, 0.05, 0.62, K.hout, -2.25, PLAAT + 0.45, -0.72, { r: 0.015 });
  blok(kl, 1.0, 0.45, 0.55, K.wit, -2.25, PLAAT, -0.72, { r: 0.02 });
  plek('eerste', 'klas', laptop(kl, -2.45, PLAAT + 0.5, -0.74));
  const schriften = plek('feedback', 'klas', groepje(kl, -1.92, PLAAT + 0.5, -0.66));
  [K.blauw, K.perzik, K.geel, K.mint, K.blauw].forEach((k, i) => {
    const s = blok(schriften, 0.2, 0.022, 0.27, k, 0, i * 0.024, 0, { r: 0.006 });
    s.rotation.y = (r() - 0.5) * 0.3;
  });
  blok(schriften, 0.14, 0.012, 0.012, K.rood, 0.02, 0.125, 0.02, { r: 0.004 }).rotation.y = 0.6;
  const leerkracht = figuur(kl, { x: -2.5, y: PLAAT, z: -1.55, draai: 0.55, shirt: K.groen, huid: HUID[1], haar: HAAR[1] });
  const klasgroep = plek('veilig', 'klas', groepje(kl));
  const klasLeerlingen = [[-1.15, K.perzik, 0, 0, K.blauw], [-0.25, K.geel, 5, 2, K.perzik], [0.65, K.mint, 3, 3, K.geel]].map(([x, shirt, h, ha, tas]) => {
    lessenaar(klasgroep, x, PLAAT, -0.24);
    blok(klasgroep, 0.16, 0.02, 0.22, [K.mint, K.geel, K.blauw][Math.round(x + 2) % 3], x + 0.08, PLAAT + 0.46, -0.26, { r: 0.006 });
    stoel(klasgroep, x, PLAAT, 0.1, Math.PI, K.perzik);
    blok(klasgroep, 0.2, 0.22, 0.09, tas, x, PLAAT + 0.22, 0.27, { r: 0.04 });
    return figuur(klasgroep, { x, y: PLAAT, z: 0.1, draai: Math.PI, shirt, huid: HUID[h], haar: HAAR[ha], zit: true });
  });
  // de tafel waarop het lesidee als minitafereel verschijnt
  const lestafel = plek('les', 'klas', groepje(kl));
  blok(lestafel, 1.3, 0.42, 1.0, K.hout, 1.95, PLAAT, -1.55, { r: 0.03 });
  const schotel = cilinder(lestafel, 0.52, 0.52, 0.04, K.mintLicht, 1.95, PLAAT + 0.42, -1.55, { seg: 32 });
  schotel.scale.z = 0.86;
  const mini = levend(groepje(lestafel, 1.95, PLAAT + 0.46, -1.55));
  const zee = blok(mini, 0.48, 0.035, 0.66, K.zee, -0.24, 0, 0, { r: 0.015, schaduw: false });
  const berg = groepje(mini, 0.2, 0, -0.08);
  cilinder(berg, 0, 0.27, 0.44, K.berg, 0, 0, 0, { seg: 7, plat: true });
  cilinder(berg, 0, 0.09, 0.13, K.wit, 0, 0.31, 0, { seg: 7, plat: true });
  const zonnetje = bol(mini, 0.07, 0, -0.38, 0.74, -0.22, { materiaal: new T.MeshBasicMaterial({ color: 0xffe873 }), schaduw: false });
  const damp = groepje(mini, -0.24, 0, 0);
  const dampBollen = [0, 1, 2].map(i => bol(damp, 0.035, 0, (i - 1) * 0.12, 0.1, (i % 2) * 0.1 - 0.05, { materiaal: new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }), schaduw: false }));
  const wolk = groepje(mini, 0.1, 0.66, -0.05);
  for (const [x, y, z, s] of [[0, 0, 0, 0.11], [-0.12, -0.03, 0.02, 0.085], [0.12, -0.03, 0, 0.09], [0.03, 0.05, 0.06, 0.08]]) bol(wolk, s, 0xffffff, x, y, z, { seg: 14 });
  const regen = groepje(mini);
  const druppelGeo = new T.CapsuleGeometry(0.012, 0.045, 2, 6);
  const druppels = [0, 1, 2, 3, 4, 5].map(i => {
    const d = new T.Mesh(druppelGeo, mat(K.zee));
    d.position.set((i % 3) * 0.11, 0.5, -0.12 + Math.floor(i / 3) * 0.12);
    d.userData.verschuiving = i * 0.37 % 1;
    regen.add(d);
    return d;
  });
  const rivier = groepje(mini);
  const rivierPunten = [new T.Vector3(0.17, 0.014, 0.18), new T.Vector3(0.06, 0.014, 0.27), new T.Vector3(-0.02, 0.014, 0.2)];
  for (let i = 0; i < 2; i++) {
    const a = rivierPunten[i], b = rivierPunten[i + 1];
    const s = blok(rivier, a.distanceTo(b) + 0.04, 0.012, 0.05, K.zee, (a.x + b.x) / 2, 0.008, (a.z + b.z) / 2, { r: 0.005, schaduw: false });
    s.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
  }
  const stroom = [0, 1].map(() => bol(rivier, 0.014, 0xffffff, 0, 0.03, 0, { schaduw: false, seg: 8 }));
  const klasItems = [
    { obj: zee, stap: 0 }, { obj: berg, stap: 0 }, { obj: zonnetje, stap: 0 }, { obj: damp, stap: 0 },
    { obj: wolk, stap: 1 }, { obj: regen, stap: 2 }, { obj: rivier, stap: 3 },
  ];
  // de maakhoek: een zelfgebouwde app op een laptop
  const maakhoek = plek('bouwen', 'klas', groepje(kl));
  blok(maakhoek, 0.85, 0.04, 0.5, K.hout, 2.3, PLAAT + 0.42, -0.2, { r: 0.015 });
  for (const x of [1.92, 2.68]) blok(maakhoek, 0.04, 0.42, 0.46, K.groen, x, PLAAT, -0.2, { r: 0.01 });
  blok(maakhoek, 0.5, 0.02, 0.32, K.grijs, 2.3, PLAAT + 0.46, -0.16, { r: 0.008 });
  const quizScherm = groepje(maakhoek, 2.3, PLAAT + 0.47, -0.33);
  quizScherm.rotation.x = -0.18;
  blok(quizScherm, 0.5, 0.34, 0.015, K.inkt, 0, 0, 0, { r: 0.006 });
  statischeTekening(paneel(quizScherm, 0.46, 0.3, 384, 0, 0.17, 0.009, { scherm: true }), tekenQuiz);
  hanglamp(kl, -2.75, -0.35, VH);
  hanglamp(kl, 1.35, -0.45, VH);

  // ── tweede verdieping: de directie ──
  const dr = verdieping('directie', 2, K.geel, 0xf1e97e, 0xead2aa);
  cilinder(dr, 1.05, 1.05, 0.01, 0xf7dcc0, 0.7, PLAAT, -1.15, { seg: 32, schaduw: false });
  blok(dr, 1.5, 0.05, 0.7, K.hout, 0.7, PLAAT + 0.48, -1.2, { r: 0.015 });
  blok(dr, 1.4, 0.48, 0.62, K.wit, 0.7, PLAAT, -1.2, { r: 0.02 });
  const bureau = PLAAT + 0.53;
  stoel(dr, 0.7, PLAAT, -1.92, 0, K.groenDonker);
  for (const x of [0.32, 1.08]) stoel(dr, x, PLAAT, -0.42, Math.PI, K.perzik);
  const directeur = figuur(dr, { x: 0.7, y: PLAAT, z: -1.92, shirt: K.blauw, huid: HUID[0], haar: HAAR[2], zit: true });
  const collega = plek('wie', 'directie', figuur(dr, { x: -1.08, y: PLAAT, z: -0.95, draai: 1.6, shirt: K.perzik, huid: HUID[5], haar: HAAR[3] }));
  plek('gegevens', 'directie', laptop(dr, 0.62, bureau, -1.32, Math.PI));
  cilinder(dr, 0.055, 0.05, 0.11, K.wit, 1.22, bureau, -1.0);
  cilinder(dr, 0.057, 0.057, 0.03, K.perzik, 1.22, bureau + 0.05, -1.0);
  const stoom = [0, 1, 2].map(() => levend(bol(dr, 0.022, 0, 1.22, bureau + 0.16, -1.0, { materiaal: new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }), schaduw: false, seg: 8 })));
  stoom.forEach((s, i) => { s.userData.verschuiving = i / 3; });
  // boekenkast met mappen
  const kast = plek('wet', 'directie', groepje(dr));
  blok(kast, 1.1, 1.22, 0.32, K.wit, -2.4, PLAAT, -2.28, { r: 0.02 });
  const mapKleuren = [K.groen, K.mint, K.perzik, K.geel, K.blauw];
  for (let rij = 0; rij < 3; rij++) {
    for (let i = 0; i < 7; i++) {
      blok(kast, 0.12, 0.3, 0.05, mapKleuren[(i + rij * 2) % 5], -2.82 + i * 0.14, PLAAT + 0.08 + rij * 0.38, -2.1, { r: 0.012, schaduw: false });
    }
  }
  const beleid = plek('beleid', 'directie', groepje(dr));
  blok(beleid, 1.78, 1.08, 0.04, K.groen, -0.72, PLAAT + 0.36, BINNEN_ACHTER + 0.02, { r: 0.02 });
  const beleidsbord = paneel(beleid, 1.68, 0.98, 768, -0.72, PLAAT + 0.9, BINNEN_ACHTER + 0.045);
  const kalender = plek('sessie', 'directie', groepje(dr));
  blok(kalender, 0.025, 0.62, 0.56, K.groen, LINKS_BINNEN + 0.015, PLAAT + 0.55, -0.85, { r: 0.01 });
  statischeTekening(paneel(kalender, 0.5, 0.56, 256, LINKS_BINNEN + 0.03, PLAAT + 0.86, -0.85, { draai: Math.PI / 2 }), tekenKalender);
  raamBinnen(dr, 2.15, PLAAT + 0.95, BINNEN_ACHTER + 0.012, 0.8, 0.62);
  plant(dr, 2.7, PLAAT, -0.45, 1.1);
  // een kastje met een scherm: de planner die de directie zelf bouwde
  const zelfbouw = plek('zelfbouw', 'directie', groepje(dr, 2.15, PLAAT, -1.55));
  zelfbouw.rotation.y = -0.35;
  blok(zelfbouw, 0.72, 0.5, 0.4, K.wit, 0, 0, 0, { r: 0.02 });
  blok(zelfbouw, 0.24, 0.02, 0.14, K.grijs, 0, 0.5, 0, { r: 0.006 });
  blok(zelfbouw, 0.05, 0.14, 0.05, K.grijs, 0, 0.5, 0);
  blok(zelfbouw, 0.66, 0.42, 0.035, K.inkt, 0, 0.62, 0, { r: 0.012 });
  statischeTekening(paneel(zelfbouw, 0.6, 0.36, 384, 0, 0.83, 0.021, { scherm: true }), tekenPlanner);
  const a4 = statischeTekening(paneel(dr, 0.3, 0.42, 256, 0, 0, 0), tekenA4);
  a4.mesh.rotation.set(-Math.PI / 2, 0, 0.25);
  a4.mesh.castShadow = false;
  const a4Item = groepje(dr, 0.15, bureau + 0.004, -1.0);
  dr.remove(a4.mesh);
  a4Item.add(a4.mesh);
  hanglamp(dr, -1.75, -0.6, VH);
  hanglamp(dr, 1.6, -0.6, VH);

  // ── dak ──
  const dak = groepje(wereld, 0, 3 * VH, 0);
  blok(dak, BREED + 0.2, 0.16, DIEP + 0.2, K.wit, 0, 0, MIDZ, { r: 0.04, schaduw: false });
  for (const [b, d, x, z] of [[BREED + 0.2, 0.08, 0, ACHTER - 0.06], [0.08, DIEP + 0.2, -BREED / 2 - 0.06, MIDZ], [0.08, DIEP + 0.2, BREED / 2 + 0.06, MIDZ], [BREED + 0.2, 0.08, 0, 0.66]]) {
    blok(dak, b, 0.14, d, K.groen, x, 0.16, z, { r: 0.02, schaduw: false });
  }
  const bordDak = plek('samen', 'buiten', groepje(dak));
  for (const x of [-1.15, 1.15]) blok(bordDak, 0.05, 0.42, 0.05, K.groenDonker, x, 0.16, 0.2, { r: 0.01 });
  statischeTekening(paneel(bordDak, 2.7, 0.48, 1024, 0, 0.16 + 0.5, 0.235), tekenBord);
  blok(bordDak, 2.76, 0.54, 0.04, K.groen, 0, 0.16 + 0.23, 0.2, { r: 0.02 });
  for (const x of [1.0, 2.1]) {
    const pv = blok(dak, 0.95, 0.04, 0.6, K.paneel, x, 0.36, -2.0, { r: 0.01 });
    pv.rotation.x = 0.4;
    blok(dak, 0.05, 0.2, 0.05, K.grijs, x, 0.16, -1.95, { r: 0 });
  }
  for (const [x, z] of [[-1.6, -1.6], [-0.9, -2.0]]) plant(dak, x, 0.16, z, 0.9);
  cilinder(dak, 0.025, 0.025, 1.15, K.grijs, -2.95, 0.16, -2.3, { seg: 10 });
  const vlagGeo = new T.PlaneGeometry(0.58, 0.36, 10, 1);
  vlagGeo.translate(0.29, 0, 0);
  const vlagBasis = vlagGeo.attributes.position.array.slice();
  const vlag = levend(new T.Mesh(vlagGeo, new T.MeshLambertMaterial({ color: K.groen, side: 2 })));
  vlag.position.set(-2.93, 0.16 + 0.95, -2.3);
  vlag.castShadow = true;
  dak.add(vlag);

  // ── de kleine basisschool van Leerlichtjes ──
  const lager = groepje(wereld, LAGER.x, 0, LAGER.z);
  {
    const { b, d, h } = LAGER;
    blok(lager, b, h, d, 0xfff6e0, 0, 0, 0, { r: 0.03 });
    blok(lager, b + 0.02, 0.06, d + 0.02, K.geel, 0, h * 0.45, 0, { r: 0.01, schaduw: false });
    puntdak(lager, b + 0.24, 0.62, d + 0.24, K.perzik, 0, h, 0);
    blok(lager, 0.14, 0.4, 0.14, K.baksteen, 0.5, h + 0.18, -0.25, { r: 0.02 });
    for (const x of [-0.6, 0.6]) raamBuiten(lager, x, 0.5, d / 2, 0.42, 0.36, K.groen);
    blok(lager, 0.42, 0.72, 0.04, K.groen, 0, 0, d / 2 + 0.01, { r: 0.015 });
    bol(lager, 0.022, K.geel, 0.13, 0.36, d / 2 + 0.04, { seg: 8, schaduw: false });
    blok(lager, 0.6, 0.05, 0.34, K.groen, 0, 0.8, d / 2 + 0.16, { r: 0.015 });
    // het lichtje boven de deur: het herkenningsteken van Leerlichtjes
    bol(lager, 0.07, 0, 0, h + 0.8, 0.05, { materiaal: new T.MeshBasicMaterial({ color: 0xffcf3a }), schaduw: false, seg: 14 });
    cilinder(lager, 0.012, 0.012, 0.22, K.grijs, 0, h + 0.5, 0.05, { seg: 6 });
  }
  const lagerBord = plek('leerlichtjes', 'lager', groepje(lager));
  blok(lagerBord, 1.28, 0.3, 0.035, K.groenDonker, 0, LAGER.h - 0.35, LAGER.d / 2 + 0.03, { r: 0.012 });
  statischeTekening(paneel(lagerBord, 1.22, 0.25, 512, 0, LAGER.h - 0.2, LAGER.d / 2 + 0.05), tekenLagerBord);
  gloed(lager, 0, LAGER.h + 0.8, 0.05, 0.6);
  {
    const raak = new T.Mesh(new T.BoxGeometry(LAGER.b + 0.3, LAGER.h + 0.9, LAGER.d + 0.3), new T.MeshBasicMaterial({ visible: false }));
    raak.position.set(0, (LAGER.h + 0.9) / 2, 0);
    raak.userData.kamer = 'lager';
    lager.add(levend(raak));
    kamers.lager = { groep: lager, raak };
  }

  // ── buiten ──
  const buiten = groepje(wereld);
  const pad = groepje(buiten);
  for (let i = 0; i < 6; i++) blok(pad, 0.42, 0.04, 0.3, K.steen, 0.3 + (i % 2 ? 0.1 : -0.1), 0, 0.95 + i * 0.42, { r: 0.02, schaduw: false });
  for (let i = 0; i < 4; i++) blok(pad, 0.3, 0.035, 0.26, K.steen, LAGER.x + (i % 2 ? 0.06 : -0.06), 0, LAGER.z + LAGER.d / 2 + 0.28 + i * 0.36, { r: 0.02, schaduw: false });
  // speelplaats met een hinkelpad en een basketbalpaal
  const speelplaats = levend(groepje(buiten));
  blok(speelplaats, 3.3, 0.025, 1.9, K.speelplaats, -3.35, 0, 2.3, { r: 0.012, schaduw: false });
  [[-4.35, 2.3], [-4.05, 2.3], [-3.75, 2.15], [-3.75, 2.45], [-3.45, 2.3], [-3.15, 2.15], [-3.15, 2.45], [-2.85, 2.3]].forEach(([x, z], i) => {
    blok(speelplaats, 0.26, 0.012, 0.26, [K.geel, K.blauw, K.perzik, K.mint][i % 4], x, 0.025, z, { r: 0.004, schaduw: false });
  });
  cilinder(speelplaats, 0.035, 0.035, 1.55, K.grijs, -4.95, 0, 1.6, { seg: 10 });
  blok(speelplaats, 0.03, 0.36, 0.52, K.wit, -4.9, 1.24, 1.6, { r: 0.01 });
  {
    const ring = new T.Mesh(new T.TorusGeometry(0.09, 0.012, 6, 18), mat(K.oranje));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-4.78, 1.3, 1.6);
    zet(speelplaats, ring);
  }
  const bal = levend(bol(buiten, 0.07, K.oranje, -3.0, 0.07, 1.75, { seg: 12 }));
  const bomen = [
    boom(buiten, -4.9, -3.0, 1.1, [K.blad2, K.blad1, K.blad3]),
    boom(buiten, -5.5, 0.85, 0.7, [K.blad1, K.blad2]),
    boom(buiten, 4.9, -2.4, 1.1, [K.blad3, K.blad2, K.blad1]),
    boom(buiten, 5.15, 2.45, 0.8, [K.blad2, K.blad1]),
  ].map(b => speel(b, s => { s.t = tijd(); }));
  function rozenstruik(x, z) {
    const s = levend(groepje(buiten, x, 0, z));
    kruin(s, 0.24, K.blad2, 0, 0.16, 0);
    for (let i = 0; i < 7; i++) {
      const hoek = i * 2.4, hoog = 0.12 + (i % 3) * 0.08;
      bol(s, 0.045, i % 2 ? K.roos : K.roosDiep, Math.cos(hoek) * 0.2, hoog + 0.06, Math.sin(hoek) * 0.2, { seg: 8, schaduw: false });
    }
    return s;
  }
  const struiken = [rozenstruik(-3.65, 0.95), rozenstruik(3.75, -0.5)];
  // bank
  const bank = plek('workshops', 'buiten', groepje(buiten, 2.4, 0, 2.75));
  bank.rotation.y = -0.25;
  blok(bank, 0.95, 0.05, 0.3, K.hout, 0, 0.28, 0);
  blok(bank, 0.95, 0.24, 0.05, K.hout, 0, 0.36, -0.13);
  for (const x of [-0.4, 0.4]) blok(bank, 0.05, 0.28, 0.26, K.inkt, x, 0, 0, { r: 0.01 });
  blok(bank, 0.2, 0.02, 0.27, K.perzik, -0.15, 0.33, 0.02, { r: 0.006 });
  // fietsen
  const fietsen = levend(groepje(buiten, 4.25, 0, 1.25));
  fietsen.rotation.y = -0.5;
  const wielGeo = new T.TorusGeometry(0.15, 0.022, 8, 20);
  [[0, K.perzik], [0.38, K.groen]].forEach(([z, kleur]) => {
    for (const x of [-0.24, 0.24]) zet(fietsen, new T.Mesh(wielGeo, mat(K.inkt))).position.set(x, 0.17, z);
    blok(fietsen, 0.5, 0.035, 0.035, kleur, 0, 0.3, z, { r: 0.01 });
    blok(fietsen, 0.035, 0.18, 0.035, kleur, -0.05, 0.17, z, { r: 0.01 });
    blok(fietsen, 0.14, 0.03, 0.06, K.inkt, -0.08, 0.36, z, { r: 0.01 });
    blok(fietsen, 0.03, 0.03, 0.2, K.inkt, 0.22, 0.4, z, { r: 0.01 });
  });
  blok(fietsen, 0.04, 0.3, 0.75, K.grijs, -0.42, 0, 0.19, { r: 0.015 });
  // lantaarns
  for (const [x, z] of [[-1.25, 3.0], [1.35, 3.05]]) {
    const l = groepje(buiten, x, 0, z);
    cilinder(l, 0.028, 0.035, 1.2, K.groenDonker, 0, 0, 0, { seg: 10 });
    blok(l, 0.16, 0.07, 0.16, K.groenDonker, 0, 1.3, 0, { r: 0.02 });
    bol(l, 0.055, 0, 0, 1.25, 0, { materiaal: g.lampMat, schaduw: false, seg: 10 });
    gloed(l, 0, 1.24, 0, 0.9);
  }
  // grassprietjes in één tekenbeurt
  let gras;
  {
    const spriet = new T.ConeGeometry(0.035, 0.13, 5);
    spriet.translate(0, 0.065, 0);
    const n = 80;
    // Wit materiaal: de kleur per sprietje komt erbovenop en zou anders vermengen.
    gras = levend(new T.InstancedMesh(spriet, new T.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), n));
    const m = new T.Matrix4();
    const kleur = new T.Color();
    let i = 0;
    while (i < n) {
      const x = (r() - 0.5) * 11.2, z = -4.0 + r() * 7.1;
      const opGebouw = Math.abs(x) < 3.5 && z > -2.9 && z < 0.9;
      const opLager = Math.abs(x - LAGER.x) < LAGER.b / 2 + 0.3 && Math.abs(z - LAGER.z) < LAGER.d / 2 + 0.3;
      const opPad = Math.abs(x - 0.3) < 0.4 && z > 0.7;
      const opSpeelplaats = x > -5.1 && x < -1.6 && z > 1.3 && z < 3.3;
      if (opGebouw || opLager || opPad || opSpeelplaats) continue;
      const s = 0.7 + r() * 0.8;
      m.makeScale(s, s, s).setPosition(x, 0, z);
      gras.setMatrixAt(i, m);
      gras.setColorAt(i, kleur.setHex([K.blad1, K.blad2, 0xa6d3b0][i % 3]));
      i++;
    }
    gras.receiveShadow = true;
    buiten.add(gras);
  }
  const wandelaar = speel(figuur(buiten, { x: 0, y: 0, z: 1.75, draai: Math.PI / 2, shirt: K.groen, huid: HUID[3], haar: HAAR[0] }), s => { s.t = tijd(); });
  blok(wandelaar, 0.24, 0.28, 0.12, K.perzik, 0, 0.42, -0.16, { r: 0.05 });
  // wolken en vogels. De wolken hebben een eigen materiaal: bij regen worden ze grijs.
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
  const wolken = [[7.0, -4.6, 0.9, 0], [6.4, -5.2, 0.7, 0.45], [7.6, -4.2, 0.6, 0.75]].map(a => maakWolk(...a));
  // Extra wolken die er pas bij komen als het bewolkt is.
  const extraWolken = [[6.7, -3.6, 1.0, 0.2], [7.9, -5.0, 0.8, 0.6], [6.0, -4.0, 0.75, 0.88], [7.3, -3.2, 0.65, 0.35]].map(a => {
    const w = maakWolk(...a);
    w.scale.setScalar(0.001);
    w.visible = false;
    return w;
  });
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

  // ── seizoenen en weer ──
  // Het seizoen loopt van 0 tot 4: 0,5 is volle lente, 1,5 zomer, 2,5 herfst en
  // 3,5 winter; ertussen kleurt alles geleidelijk over. Het weer bestaat uit
  // regen, sneeuw, mist, wind en onweer, elk van 0 tot 1. Alles schuift zacht naar
  // zijn doel. Wie minder beweging vraagt, krijgt de kleuren wel, de neerslag niet.
  const weerDoel = { regen: 0, sneeuw: 0, mist: 0, wind: 0.15, onweer: 0 };
  const weer = { ...weerDoel, sneeuwlaag: 0 };
  let seizoen = 1.5, doelSeizoen = 1.5, seizoenGetekend = -1;
  let tempo = 1, vlagFase = 0, wolkFase = 0, volgendeFlits = 4, laagVast = null;
  const rw = toeval(31);
  const SEIZOENEN = ['lente', 'zomer', 'herfst', 'winter'];
  // Per seizoen drie tinten, van licht naar donker; de zomer houdt de eigen kleuren.
  const PALET = {
    lente: [0xb8e290, 0x8fd07c, 0x6cbb6a],
    herfst: [0xf4c64f, 0xf08a3c, 0xc9563f],
    winter: [0xeef3f0, 0xd8e3df, 0xbfcec9],
  };
  // Hoeveel van elk seizoen er nu in zit: vier gewichten die samen 1 zijn.
  function seizoenGewichten(s) {
    const w = [0, 0, 0, 0];
    const p = ((s - 0.5) % 4 + 4) % 4, i = Math.floor(p), f = p - i;
    // Rond het midden van een seizoen blijft het even stil staan; de overgang
    // valt in het midden tussen twee seizoenen.
    const t = klem((f - 0.2) / 0.6, 0, 1), m = t * t * (3 - 2 * t);
    w[i] = 1 - m; w[(i + 1) % 4] += m;
    return w;
  }
  // Licht, midden of donker: zo kiezen we de tint uit het palet. De kleuren in
  // de vormen zijn lineair, vandaar de lage grenzen.
  const tintVan = (r, gr, b) => { const l = 0.2126 * r + 0.7152 * gr + 0.0722 * b; return l > 0.4 ? 0 : l > 0.2 ? 1 : 2; };
  const kleurHulp = new T.Color();
  // Een kleurlaag die van seizoen kan wisselen: een gewone vorm (kleur per hoek)
  // of de grassprietjes (kleur per sprietje).
  const kleurLagen = [];
  function kleurLaag(attr) {
    const orig = attr.array.slice();
    const doel = { zomer: orig };
    for (const naam of ['lente', 'herfst', 'winter']) {
      const uit = new Float32Array(orig.length);
      for (let i = 0; i < orig.length; i += 3) {
        kleurHulp.setHex(PALET[naam][tintVan(orig[i], orig[i + 1], orig[i + 2])]);
        uit[i] = kleurHulp.r; uit[i + 1] = kleurHulp.g; uit[i + 2] = kleurHulp.b;
      }
      doel[naam] = uit;
    }
    kleurLagen.push({ attr, doel });
  }
  let kleurLagenKlaar = false;
  function zoekKleurLagen() {
    // Pas na het samenvoegen bestaan de vormen van de kruinen: elke boom en
    // struik heeft er één met platte schaduw, naast die van de stam of de rozen.
    kleurLagenKlaar = true;
    for (const groep of [...bomen, ...struiken]) {
      groep.traverse(o => {
        if (o.isMesh && !o.isInstancedMesh && o.material.vertexColors && o.material.flatShading) kleurLaag(o.geometry.attributes.color);
        if (o.isMesh && !o.isInstancedMesh && o.material.vertexColors && !o.material.flatShading && struiken.includes(groep)) groep.userData.rozen = o;
      });
    }
    if (gras.instanceColor) kleurLaag(gras.instanceColor);
  }
  // bloesem in de lente: roze en witte bolletjes op de kruinen
  const bloesemGeo = new T.IcosahedronGeometry(0.034, 0);
  const bloesems = bomen.map((b, bi) => {
    const s = [1.1, 0.7, 1.1, 0.8][bi];
    const kruinen = [[0, 0.95, 0, 0.5], [0.22, 1.25, 0.1, 0.36], [-0.2, 1.18, -0.12, 0.3]];
    const n = 22;
    const m = levend(new T.InstancedMesh(bloesemGeo, new T.MeshLambertMaterial({ color: 0xffffff }), n));
    m.userData.plekken = [];
    for (let i = 0; i < n; i++) {
      const [cx, cy, cz, cr] = kruinen[i % 3];
      // Vooral aan de kant die naar de camera kijkt.
      const hoek = -0.6 + rw() * 2.6, hoogte = -0.2 + rw() * 1.0;
      const d = new T.Vector3(Math.sin(hoek), hoogte, Math.cos(hoek)).normalize();
      m.userData.plekken.push(new T.Vector3(cx * s, cy * s, cz * s).addScaledVector(d, cr * s * 0.98));
      m.setColorAt(i, kleurHulp.setHex([0xf7b6c8, 0xffffff, 0xf2a0b6][i % 3]));
    }
    m.castShadow = false;
    m.visible = false;
    b.add(m);
    return m;
  });
  const hulpM = new T.Matrix4(), hulpQ = new T.Quaternion(), hulpE = new T.Euler(), hulpS = new T.Vector3(), hulpP = new T.Vector3();
  function zetBloesem(hoeveel) {
    for (const m of bloesems) {
      m.visible = hoeveel > 0.02;
      if (!m.visible) continue;
      m.userData.plekken.forEach((p, i) => {
        // Elk bolletje groeit op zijn eigen moment: zo loopt de boom vol.
        const s = uitTerug(klem(hoeveel * 1.6 - (i % 7) * 0.09, 0, 1));
        m.setMatrixAt(i, hulpM.compose(p, hulpQ.identity(), hulpS.setScalar(Math.max(s, 0.001))));
      });
      m.instanceMatrix.needsUpdate = true;
    }
  }
  // Neerslag en vallende blaadjes: telkens één vorm met veel kopieën.
  const BAK = { x0: -7, x1: 7, y0: -0.2, y1: 10, z0: -5, z1: 4.5 };
  function deeltjes(geo, materiaal, n) {
    const m = levend(new T.InstancedMesh(geo, materiaal, n));
    m.frustumCulled = false;
    m.castShadow = false;
    m.visible = false;
    const st = [];
    for (let i = 0; i < n; i++) {
      st.push({ x: BAK.x0 + rw() * (BAK.x1 - BAK.x0), y: BAK.y0 + rw() * (BAK.y1 - BAK.y0), z: BAK.z0 + rw() * (BAK.z1 - BAK.z0), f: rw() * 10, v: 0.8 + rw() * 0.4 });
      m.setMatrixAt(i, hulpM.makeScale(0, 0, 0));
    }
    m.userData.st = st;
    wereld.add(m);
    return m;
  }
  const regenDruppels = deeltjes(new T.BoxGeometry(0.04, 0.46, 0.04),
    new T.MeshBasicMaterial({ color: 0x8fb2c9, transparent: true, opacity: 0.8, depthWrite: false }), g.zwak ? 160 : 380);
  const sneeuwVlokken = deeltjes(new T.IcosahedronGeometry(0.042, 0),
    new T.MeshLambertMaterial({ color: 0xffffff, emissive: 0x8090a8, emissiveIntensity: 0.35 }), g.zwak ? 140 : 320);
  const BLAD_N = 70;
  const blaadjes = deeltjes(new T.PlaneGeometry(0.1, 0.065), new T.MeshLambertMaterial({ color: 0xffffff, side: 2 }), BLAD_N);
  // Een blaadje begint in een van de kruinen en dwarrelt naar de grond.
  const boomPlekken = [[-4.9, -3.0, 1.1], [-5.5, 0.85, 0.7], [4.9, -2.4, 1.1], [5.15, 2.45, 0.8]];
  function nieuwBlaadje(st, i, lente) {
    const [bx, bz, s] = boomPlekken[Math.floor(rw() * 4)];
    st.x = bx + (rw() - 0.5) * s; st.z = bz + (rw() - 0.5) * s * 0.8; st.y = 0.9 * s + rw() * 0.6 * s;
    st.lig = 0; st.v = 0.8 + rw() * 0.5;
    blaadjes.setColorAt(i, kleurHulp.setHex(lente ? [0xf7b6c8, 0xffffff, 0xf2a0b6][i % 3] : [0xf4c64f, 0xf08a3c, 0xc9563f, 0xe0a33a][i % 4]));
    blaadjes.instanceColor.needsUpdate = true;
  }
  blaadjes.userData.st.forEach((st, i) => { nieuwBlaadje(st, i, false); st.y = -1; st.lig = 99; });
  // Sneeuw op de daken en op de sokkel, die aangroeit zolang het sneeuwt.
  const sneeuwMat = new T.MeshLambertMaterial({ color: 0xfbfdff, transparent: true, opacity: 0, depthWrite: false });
  const sneeuwDekens = [];
  {
    const dek = levend(new T.Mesh(new T.PlaneGeometry(BREED + 0.12, DIEP + 0.12), sneeuwMat));
    dek.rotation.x = -Math.PI / 2;
    dek.position.set(0, 0.168, MIDZ);
    dek.receiveShadow = true;
    dak.add(dek);
    sneeuwDekens.push(dek);
    // de grond: een vlak met afgeronde hoeken, net als de sokkel
    const c = document.createElement('canvas'); c.width = 512; c.height = 344;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; rond(ctx, 0, 0, 512, 344, 12); ctx.fill();
    const grondMat = sneeuwMat.clone();
    grondMat.alphaMap = new T.CanvasTexture(c);
    const grond = levend(new T.Mesh(new T.PlaneGeometry(11.9, 7.9), grondMat));
    grond.rotation.x = -Math.PI / 2;
    grond.position.set(0, 0.009, -0.6);
    grond.receiveShadow = true;
    sokkel.add(grond);
    sneeuwDekens.push(grond);
    // het puntdak van de kleine school, een tikje groter
    const kap = groepje(lager, 0, LAGER.h + 0.01, 0);
    kap.rotation.y = Math.PI / 2;
    const k = levend(new T.Mesh(new T.CylinderGeometry(1, 1, LAGER.b + 0.3, 3, 1), sneeuwMat));
    k.rotation.x = -Math.PI / 2;
    k.scale.set((LAGER.d + 0.3) / Math.sqrt(3), 1, 0.66 / 1.5);
    k.position.y = 0.66 / 3;
    kap.add(k);
    sneeuwDekens.push(k);
  }
  // Mist: in de verte vervaagt het tafereel. De mist staat altijd aan, maar
  // ver genoeg weg zolang het helder is: aan- en uitzetten laat het beeld haperen.
  g.scene.fog = new T.Fog(0xdfe4e3, 100, 200);
  const mistDag = new T.Color(0xdfe4e3), mistNacht = new T.Color(0x3b4566);
  const wolkWit = new T.Color(0xffffff), wolkGrijs = new T.Color(0x8e98a3);

  function tekenSeizoen(s) {
    if (!kleurLagenKlaar) zoekKleurLagen();
    seizoenGetekend = s;
    const w = seizoenGewichten(s);
    for (const { attr, doel } of kleurLagen) {
      const a = attr.array;
      const bronnen = SEIZOENEN.map(n => doel[n]);
      for (let i = 0; i < a.length; i++) a[i] = bronnen[0][i] * w[0] + bronnen[1][i] * w[1] + bronnen[2][i] * w[2] + bronnen[3][i] * w[3];
      attr.needsUpdate = true;
    }
    zetBloesem(w[0]);
    // De rozen bloeien van de late lente tot de vroege herfst.
    for (const st of struiken) if (st.userData.rozen) st.userData.rozen.visible = w[3] < 0.5 && w[0] + w[1] + w[2] * 0.6 > 0.5;
  }

  // Waar geen neerslag mag verschijnen: in de school en de kleine school, en
  // bij een verdieping in beeld ook niet tussen de camera en de open voorkant.
  let deeltjesSchaal = 1, voorkantVrij = false;
  function verborgen(x, y, z) {
    if (Math.abs(x) < BREED / 2 + 0.12 && z > ACHTER - 0.12 && z < VOOR + 0.12 && y < 3 * VH + 0.35) return true;
    if (Math.abs(x - LAGER.x) < LAGER.b / 2 + 0.2 && Math.abs(z - LAGER.z) < LAGER.d / 2 + 0.2 && y < LAGER.h + 0.75) return true;
    return voorkantVrij && Math.abs(x) < BREED / 2 + 0.7 && z > ACHTER;
  }
  function werkWeerBij(dt, nu, nacht, bewolking, open = null) {
    // Ingezoomd lijken druppels anders dikke strepen: dan worden ze fijner.
    voorkantVrij = !!open || VERDIEPINGEN.includes(focus);
    deeltjesSchaal += ((focus === 'overzicht' && !open ? 1 : 0.42) - deeltjesSchaal) * (1 - Math.exp(-dt * 3));
    const z = 1 - Math.exp(-dt * 1.5);
    for (const k of Object.keys(weerDoel)) weer[k] += (weerDoel[k] - weer[k]) * z;
    // Sneeuw blijft liggen: ze groeit traag aan en smelt nog trager. Een film
    // of tijdreis kan de laag ook zelf vastzetten.
    if (laagVast != null) weer.sneeuwlaag = laagVast;
    else weer.sneeuwlaag = klem(weer.sneeuwlaag + (weer.sneeuw > 0.25 ? dt / 12 : -dt / 25), 0, 1);
    if (Math.abs(seizoen - doelSeizoen) > 0.0005) {
      const verschil = ((doelSeizoen - seizoen + 6) % 4) - 2;
      seizoen = ((seizoen + verschil * (1 - Math.exp(-dt * 0.8))) % 4 + 4) % 4;
    }
    if (Math.abs(seizoen - seizoenGetekend) > 0.002) tekenSeizoen(seizoen);

    sneeuwMat.opacity = weer.sneeuwlaag * 0.92;
    for (const d of sneeuwDekens) { d.material.opacity = sneeuwMat.opacity; d.visible = sneeuwMat.opacity > 0.01; }
    const fog = g.scene.fog;
    // De camera staat 40 ver: bij dichte mist begint ze net voor het tafereel.
    fog.near = 100 - weer.mist * 76;
    fog.far = 200 - weer.mist * 160;
    fog.color.lerpColors(mistDag, mistNacht, nacht);
    // wolken: meer en grijzer naarmate het bewolkter of natter is
    wolkMat.color.lerpColors(wolkWit, wolkGrijs, klem(weer.regen * 0.7 + weer.onweer + weer.sneeuw * 0.3 + bewolking * 0.25, 0, 1));
    const extra = klem(bewolking * 1.3 + weer.regen * 0.5, 0, 1);
    wolkFase += dt * (1 + weer.wind * 3);
    extraWolken.forEach((w, i) => {
      const s = klem(extra * 4 - i, 0, 1);
      w.visible = s > 0.01;
      w.scale.setScalar(Math.max(uitTerug(s), 0.001));
    });
    for (const w of [...wolken, ...extraWolken]) w.position.x = -9 + ((wolkFase / 70 + w.userData.start) % 1) * 18;
    if (g.stil) return;
    // onweer: af en toe een bliksem
    if (weer.onweer > 0.3 && nu > volgendeFlits) { g.bliksem(); volgendeFlits = nu + 5 + rw() * 9; }

    const windX = weer.wind * 2.6;
    // regen
    {
      const st = regenDruppels.userData.st, actief = Math.round(st.length * weer.regen);
      regenDruppels.visible = actief > 0;
      if (actief > 0) {
        hulpQ.setFromEuler(hulpE.set(0, 0, Math.atan2(windX, 9)));
        for (let i = 0; i < st.length; i++) {
          const d = st[i];
          d.y -= dt * 9 * d.v; d.x += dt * windX * d.v;
          if (d.y < BAK.y0) { d.y += BAK.y1 - BAK.y0; d.x = BAK.x0 + rw() * (BAK.x1 - BAK.x0); }
          if (d.x > BAK.x1) d.x -= BAK.x1 - BAK.x0;
          const zicht = i < actief && !verborgen(d.x, d.y, d.z);
          regenDruppels.setMatrixAt(i, zicht ? hulpM.compose(hulpP.set(d.x, d.y, d.z), hulpQ, hulpS.set(deeltjesSchaal, 0.5 + deeltjesSchaal * 0.5, deeltjesSchaal)) : hulpM.makeScale(0, 0, 0));
        }
        regenDruppels.instanceMatrix.needsUpdate = true;
      }
    }
    // sneeuw
    {
      const st = sneeuwVlokken.userData.st, actief = Math.round(st.length * weer.sneeuw);
      sneeuwVlokken.visible = actief > 0;
      if (actief > 0) {
        for (let i = 0; i < st.length; i++) {
          const d = st[i];
          d.y -= dt * 0.75 * d.v; d.x += dt * (windX * 0.5 + Math.sin(nu * 1.3 + d.f) * 0.25);
          if (d.y < BAK.y0) { d.y += BAK.y1 - BAK.y0; d.x = BAK.x0 + rw() * (BAK.x1 - BAK.x0); }
          if (d.x > BAK.x1) d.x -= BAK.x1 - BAK.x0;
          if (d.x < BAK.x0) d.x += BAK.x1 - BAK.x0;
          const zicht = i < actief && !verborgen(d.x, d.y, d.z);
          sneeuwVlokken.setMatrixAt(i, zicht ? hulpM.compose(hulpP.set(d.x, d.y, d.z), hulpQ.identity(), hulpS.setScalar((0.7 + (i % 5) * 0.12) * (0.4 + deeltjesSchaal * 0.6))) : hulpM.makeScale(0, 0, 0));
        }
        sneeuwVlokken.instanceMatrix.needsUpdate = true;
      }
    }
    // blaadjes in de herfst, bloesemblaadjes in de lente
    {
      const w = seizoenGewichten(seizoen);
      const lente = w[0] > w[2];
      const actief = Math.round(BLAD_N * klem(w[2] * (0.55 + weer.wind * 0.6) + w[0] * 0.3, 0, 1));
      const st = blaadjes.userData.st;
      blaadjes.visible = actief > 0 || st.some(d => d.lig < 6);
      if (blaadjes.visible) {
        for (let i = 0; i < st.length; i++) {
          const d = st[i];
          if (d.y > 0.02) {
            d.y -= dt * 0.45 * d.v;
            d.x += dt * (windX * 0.6 + Math.sin(nu * 1.7 + d.f) * 0.35);
            hulpQ.setFromEuler(hulpE.set(nu * 2 + d.f, nu * 1.3 + d.f, Math.sin(nu * 3 + d.f) * 0.6));
          } else {
            d.lig += dt;
            hulpQ.setFromEuler(hulpE.set(-Math.PI / 2, d.f, 0));
            // Na een tijdje op de grond begint het opnieuw in een kruin, zolang
            // het seizoen duurt; niet allemaal tegelijk, anders valt er een hoop ineens.
            if (d.lig > 6 && i < actief && rw() < dt * 1.5) nieuwBlaadje(d, i, lente);
          }
          const zicht = d.y > 0.02 || d.lig < 6;
          blaadjes.setMatrixAt(i, zicht ? hulpM.compose(hulpP.set(d.x, Math.max(d.y, 0.012), d.z), hulpQ, hulpS.setScalar(1)) : hulpM.makeScale(0, 0, 0));
        }
        blaadjes.instanceMatrix.needsUpdate = true;
      }
    }
  }

  // ── de AI-assistent ──
  const lichtje = maakLichtje();
  plek('lichtje', 'buiten', lichtje.obj);
  const lichtAnker = new T.Vector3();

  // ── de drie verhaaltjes ──
  function toonSchaal(obj, s) {
    obj.visible = s > 0.001;
    obj.scale.copy(obj.userData.basis).multiplyScalar(Math.max(s, 0.001));
  }
  function maakVerhaal(naam, prompt, stappen, bord, teken, items, plekLichtje) {
    return { naam, prompt, stappen, bord, teken, items, plek: plekLichtje, fase: 'leeg', t: 0, getypt: 0, zichtbaar: 0, puntjes: 0, klaar: false, resultaat: false, handtekening: '' };
  }
  const verhalen = {
    directie: maakVerhaal('directie', 'Zet ons AI-beleid op één A4.', 4, beleidsbord, tekenBeleidsbord,
      [{ obj: a4Item, stap: 3 }], new T.Vector3(1.32, 2 * VH + PLAAT + 0.98, -1.25)),
    klas: maakVerhaal('klas', 'Maak een les over de waterkringloop voor het 4de leerjaar.', 4, klasbord, tekenKlasbord,
      klasItems, new T.Vector3(-1.62, VH + PLAAT + 1.2, -0.8)),
    leerling: maakVerhaal('leerling', 'Help me mijn GIP plannen, maar schrijf het niet voor mij.', 4, scherm, tekenLeerlingscherm,
      postits, new T.Vector3(-0.72, PLAAT + 1.12, -1.45)),
  };
  function tekenVerhaal(v, dwing = false) {
    const h = `${v.fase}|${v.getypt}|${v.zichtbaar}|${v.puntjes}`;
    if (!dwing && h === v.handtekening) return;
    v.handtekening = h;
    v.teken(v.bord, v);
    v.bord.tex.needsUpdate = true;
  }
  function naarFase(v, fase) { v.fase = fase; v.t = 0; }
  function startVerhaal(v) {
    v.klaar = false;
    naarFase(v, v.resultaat ? 'opruimen' : 'typen');
  }
  function zetKlaar(v) {
    v.fase = 'klaar'; v.t = RUST; v.getypt = v.prompt.length; v.zichtbaar = v.stappen; v.resultaat = true; v.klaar = true;
    for (const it of v.items) toonSchaal(it.obj, 1);
    tekenVerhaal(v);
  }
  function werkVerhaalBij(v, dt) {
    v.t += dt;
    switch (v.fase) {
      case 'opruimen': {
        const p = klem(v.t / OPRUIM, 0, 1);
        for (const it of v.items) if (it.obj.visible) toonSchaal(it.obj, 1 - p * p);
        if (p >= 1) { v.getypt = 0; v.zichtbaar = 0; v.resultaat = false; naarFase(v, 'typen'); }
        break;
      }
      case 'typen':
        v.getypt = Math.min(v.prompt.length, Math.floor(v.t / TYP));
        if (v.t > v.prompt.length * TYP + 0.35) naarFase(v, 'denken');
        break;
      case 'denken':
        v.puntjes = 1 + Math.floor(v.t / 0.28) % 3;
        if (v.t > DENK) { v.puntjes = 0; naarFase(v, 'bouwen'); }
        break;
      case 'bouwen':
        v.zichtbaar = Math.min(v.stappen, 1 + Math.floor(v.t / STAP));
        for (const it of v.items) toonSchaal(it.obj, uitTerug(klem((v.t - it.stap * STAP) / 0.5, 0, 1)));
        if (v.t > v.stappen * STAP + 0.5) { v.resultaat = true; naarFase(v, 'klaar'); }
        break;
      case 'klaar':
        if (v.t > RUST) v.klaar = true;
        break;
    }
    tekenVerhaal(v);
  }

  // ── regie: wie is er aan de beurt, en waar vliegt het lichtje heen ──
  const VOLGORDE = ['klas', 'leerling', 'directie'];
  let focus = 'overzicht';
  let actief = null;
  // Waar het lichtje begint als het overzicht in beeld is; een film kiest dat zelf.
  let eersteVerhaal = 'klas';
  function gaNaar(naam) {
    actief = naam;
    const v = verhalen[naam];
    v.fase = 'wachten'; v.klaar = false;
    lichtje.vlieg(v.plek, () => startVerhaal(v));
  }
  function volgende() {
    if (verhalen[focus]) return focus;
    return VOLGORDE[(VOLGORDE.indexOf(actief) + 1) % VOLGORDE.length];
  }

  const VERDIEPINGEN = ['directie', 'klas', 'leerling'];
  return {
    kamers,
    kaders: {
      overzicht: { min: [-6.1, -0.9, -4.7], max: [6.1, 3 * VH + 1.9, 3.6], marge: 1.02, hoek: 0.36 },
      directie: { min: [-3.3, 2 * VH, ACHTER], max: [3.3, 3 * VH + 0.2, 0.7], marge: 1.06, hoek: 0.15 },
      klas: { min: [-3.3, VH, ACHTER], max: [3.3, 2 * VH + 0.1, 0.7], marge: 1.06, hoek: 0.15 },
      leerling: { min: [-3.3, 0, ACHTER], max: [3.3, VH + 0.1, 0.7], marge: 1.06, hoek: 0.15 },
      lager: { min: [LAGER.x - 1.3, 0, LAGER.z - 1.0], max: [LAGER.x + 1.3, LAGER.h + 1.0, LAGER.z + 2.0], marge: 1.1, hoek: 0.3, opzij: 0.25 },
    },
    zaalVolgorde: ['overzicht', 'klas', 'directie', 'leerling', 'lager'],
    ankers: {
      directie: new T.Vector3(BREED / 2 + 0.2, 2 * VH + 1.0, 0.3),
      klas: new T.Vector3(BREED / 2 + 0.2, VH + 1.0, 0.3),
      leerling: new T.Vector3(BREED / 2 + 0.2, 1.0, 0.3),
      lager: new T.Vector3(LAGER.x - 0.4, LAGER.h + 1.0, LAGER.z),
    },
    binnen: kamer => VERDIEPINGEN.includes(kamer),
    linkerMuur: LINKS_BINNEN,
    pinGroep: f => (f === 'overzicht' ? 'buiten' : f),
    plekAnker: id => (id === 'lichtje' ? (lichtje.aan ? lichtAnker.copy(lichtje.pos).add({ x: 0, y: 0.3, z: 0 }) : false) : undefined),
    naPlekken() {
      // Pas na het bepalen van de spelden: dan staan de antwoorden nog volledig
      // uitgebouwd en vallen de spelden op de juiste hoogte.
      for (const v of Object.values(verhalen)) for (const it of v.items) { levend(it.obj); it.obj.userData.basis = it.obj.scale.clone(); toonSchaal(it.obj, 0); }
    },
    samenvoegen: [sokkel, ...VERDIEPINGEN.map(n => kamers[n].groep), lager, dak, pad, speelplaats, fietsen, ...bomen, ...struiken, buiten],
    intro: [
      { obj: kamers.leerling.groep, start: 0.25, soort: 'val' },
      { obj: kamers.klas.groep, start: 0.5, soort: 'val' },
      { obj: kamers.directie.groep, start: 0.75, soort: 'val' },
      { obj: dak, start: 1.0, soort: 'val' },
      { obj: lager, start: 1.1, soort: 'val' },
      ...bomen.map((b, i) => ({ obj: b, start: 1.15 + i * 0.08, soort: 'pop' })),
      ...struiken.map((b, i) => ({ obj: b, start: 1.4 + i * 0.08, soort: 'pop' })),
      { obj: speelplaats, start: 1.3, soort: 'pop' }, { obj: bank, start: 1.5, soort: 'pop' }, { obj: fietsen, start: 1.55, soort: 'pop' },
      { obj: wandelaar, start: 1.6, soort: 'pop' }, { obj: bal, start: 1.7, soort: 'pop' },
      ...wolken.map((w, i) => ({ obj: w, start: 1.2 + i * 0.15, soort: 'pop' })),
    ],
    tekenAlles() { for (const v of Object.values(verhalen)) tekenVerhaal(v, true); },
    bijFocus(f) {
      focus = f;
      // Een verdieping in beeld: het lichtje komt daar meteen naartoe.
      if (verhalen[f] && actief !== f && lichtje.aan) {
        const v = verhalen[actief];
        if (v && v.fase !== 'klaar') zetKlaar(v);
        gaNaar(f);
      }
    },
    bijPlek(id) { if (id === 'lichtje') lichtje.sprong = tijd(); },
    api: {
      // Het seizoen van 0 tot 4 (zie bij seizoenen en weer). direct: zonder overgang.
      seizoen(s, { direct = false } = {}) {
        doelSeizoen = ((s % 4) + 4) % 4;
        if (direct || g.stil) { seizoen = doelSeizoen; tekenSeizoen(seizoen); }
      },
      // { regen, sneeuw, mist, wind, onweer }, elk van 0 tot 1; wat je weglaat, blijft.
      // sneeuwlaag: een getal zet de laag vast, null laat ze weer vanzelf groeien.
      weer(w = {}, { direct = false } = {}) {
        for (const k of Object.keys(weerDoel)) if (w[k] != null) weerDoel[k] = klem(w[k], 0, 1);
        if (w.sneeuwlaag !== undefined) laagVast = w.sneeuwlaag == null ? null : klem(w.sneeuwlaag, 0, 1);
        if (direct || g.stil) {
          Object.assign(weer, weerDoel);
          weer.sneeuwlaag = laagVast ?? (weer.sneeuw > 0.25 ? 1 : 0);
          werkWeerBij(0, tijd(), 0, 0);
        }
      },
      tempo(x) { tempo = x; },
      eersteVerhaal(naam) { if (verhalen[naam]) eersteVerhaal = naam; },
      weerNu: () => ({ ...weer }),
    },
    stil() {
      for (const v of Object.values(verhalen)) zetKlaar(v);
      lichtje.stilZetten(verhalen.klas.plek);
    },
    werkBij(dt, nu, { nacht, speels, bewolking, open }) {
      werkWeerBij(dt, nu, nacht, bewolking, open);
      // De verhaaltjes kunnen sneller lopen, zodat een film in een paar seconden een heel antwoord toont.
      const vdt = dt * tempo;
      if (nu > 1.75 && !lichtje.aan) {
        // Begint de bezoeker halverwege de pagina, dan verschijnt het lichtje
        // meteen op de verdieping die in beeld is. De andere verdiepingen tonen
        // al een afgewerkt antwoord: zo is het overzicht meteen vol.
        const eerste = verhalen[focus] ? focus : eersteVerhaal;
        lichtje.zetAan(verhalen[eerste].plek, nu);
        for (const v of Object.values(verhalen)) if (v.naam !== eerste) zetKlaar(v);
        gaNaar(eerste);
      }
      const v = verhalen[actief];
      lichtje.werkBij(vdt, nu, { denkt: v?.fase === 'denken', typt: v?.fase === 'typen', nacht });
      for (const w of Object.values(verhalen)) if (w.fase !== 'leeg' && w.fase !== 'wachten') werkVerhaalBij(w, vdt);
      if (actief && verhalen[actief].klaar && !lichtje.vliegt()) gaNaar(volgende());

      // kleine dingen die leven
      dampBollen.forEach((b, i) => {
        const p = (nu * 0.6 + i / 3) % 1;
        b.position.y = 0.06 + p * 0.42;
        b.material.opacity = 0.85 * Math.sin(p * Math.PI);
      });
      druppels.forEach(d => { const p = (nu * 1.1 + d.userData.verschuiving) % 1; d.position.y = 0.6 - p * 0.32; });
      stroom.forEach((s, i) => {
        const p = (nu * 0.35 + i * 0.5) % 1;
        const seg = p < 0.5 ? 0 : 1, q = (p % 0.5) * 2;
        s.position.lerpVectors(rivierPunten[seg], rivierPunten[seg + 1], q);
        s.position.y = 0.024;
      });
      stoom.forEach(s => {
        const p = (nu * 0.45 + s.userData.verschuiving) % 1;
        s.position.y = bureau + 0.14 + p * 0.3;
        s.position.x = 1.22 + Math.sin(p * 6 + nu) * 0.02;
        s.material.opacity = 0.7 * Math.sin(p * Math.PI);
      });
      {
        // Hoe harder het waait, hoe sneller en wilder de vlag wappert.
        vlagFase += dt * 4 * (0.7 + weer.wind * 1.2);
        const uitslag = 0.05 * (0.6 + weer.wind * 1.4);
        const pos = vlag.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = vlagBasis[i * 3];
          pos.array[i * 3 + 2] = Math.sin(x * 9 - vlagFase) * uitslag * (x / 0.58);
        }
        pos.needsUpdate = true;
        vlag.geometry.computeVertexNormals();
      }
      {
        // de wandelaar loopt heen en weer voor de school, en springt en zwaait
        // als je erop klikt
        const periode = 16, p = (nu % periode) / periode;
        const heen = p < 0.5, q = heen ? p * 2 : (p - 0.5) * 2;
        wandelaar.position.x = heen ? -2.6 + q * 5.4 : 2.8 - q * 5.4;
        wandelaar.rotation.y = heen ? Math.PI / 2 : -Math.PI / 2;
        const sinds = nu - speels[wandelaar.userData.speel].t;
        const springt = sinds < 1.6;
        wandelaar.position.y = springt ? Math.abs(Math.sin(sinds * Math.PI * 2.5)) * 0.22 * (1 - sinds / 1.6) : Math.abs(Math.sin(nu * 7)) * 0.025;
        const [l, rr] = wandelaar.userData.benen;
        l.rotation.x = springt ? 0 : Math.sin(nu * 7) * 0.35; rr.rotation.x = -l.rotation.x;
        wandelaar.userData.armen[1].rotation.z = springt ? 2.6 + Math.sin(sinds * 14) * 0.35 : 0.12;
      }
      bomen.forEach((b, i) => {
        const sinds = nu - speels[b.userData.speel].t;
        const wiebel = sinds < 2 ? Math.sin(sinds * 16) * 0.1 * Math.exp(-sinds * 2.5) : 0;
        b.rotation.z = wiebel + Math.sin(nu * (1.1 + weer.wind) + i * 1.7) * 0.035 * weer.wind;
      });
      vogels.forEach((v, i) => {
        const hoek = nu * 0.45 + v.userData.fase;
        const straalV = 2.8 + i * 0.35;
        v.position.set(0.8 + Math.cos(hoek) * straalV, 7.0 + Math.sin(nu * 1.3 + i) * 0.15, -1.6 + Math.sin(hoek) * straalV * 0.55);
        v.rotation.y = -hoek;
        const flap = Math.sin(nu * 11 + i) * 0.55;
        v.userData.vleugels[0].rotation.z = flap; v.userData.vleugels[1].rotation.z = -flap;
      });
      klasLeerlingen.forEach((f, i) => { f.userData.hoofd.rotation.z = Math.sin(nu * 0.9 + i * 1.7) * 0.08; });
      // één leerling steekt af en toe de hand op
      klasLeerlingen[1].userData.armen[1].rotation.set(-0.7 + (Math.sin(nu * 0.4) > 0.75 ? -2.0 : 0), 0, 0.12);
      leerkracht.userData.hoofd.rotation.y = Math.sin(nu * 0.6) * 0.35;
      directeur.userData.hoofd.rotation.x = actief === 'directie' && verhalen.directie.fase === 'bouwen' ? Math.sin(nu * 6) * 0.08 : 0;
      collega.userData.hoofd.rotation.y = Math.sin(nu * 0.5 + 1) * 0.25;
      leerling1.userData.hoofd.rotation.x = Math.sin(nu * 0.8) * 0.05;
      leerling2.userData.hoofd.rotation.z = Math.sin(nu * 0.7 + 2) * 0.06;
      lezer.userData.hoofd.rotation.x = 0.25 + Math.sin(nu * 0.5) * 0.04;
    },
  };
}
