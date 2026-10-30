// De gedeelde motor achter elk tafereel: de school op de startpagina en de
// werelden van Leerlichtjes. Hier staat alles wat niet over één tafereel gaat:
// de bouwstenen (blokjes, figuurtjes, plantjes), het samenvoegen voor snelheid,
// licht met dag en avond, de camera met haar kaders, de spelden en de
// aanklikbare plekken, slepen en kantelen, pauzeren en de kwaliteit bijsturen.
//
// Een tafereel roept maakPodium(canvas, opties, bouw) aan. De functie bouw krijgt
// het gereedschap en geeft terug wat eigen is aan dat tafereel: de kaders voor
// de camera, wat er bij de intro binnenvalt, en wat er per beeld beweegt.
import * as T from './three-diorama.min.js';

export { T };

// Kleuren van Het leercollectief, aangevuld met wat een tafereel nodig heeft.
export const K = {
  groen: 0x126425, groenDonker: 0x0d4a1b, mint: 0xc2e3cc, mintLicht: 0xddf0e2,
  perzik: 0xfcc89b, geel: 0xfbf59b, blauw: 0xbfe3ed, zee: 0x5fa9c9,
  wit: 0xfffaf3, muur: 0xf7f2ea, hout: 0xe4c397, houtDonker: 0x9c6f45,
  inkt: 0x2b3038, grijs: 0xcfd2cf, steen: 0xe9e4da, berg: 0x8fa79c, speelplaats: 0xdad6cd,
  blad1: 0x86c494, blad2: 0x4e9a63, blad3: 0x2f7d45, roos: 0xee7c8f, roosDiep: 0xd94f63,
  paneel: 0x34507a, broek: 0x3d4656, kurk: 0xc9965f, oranje: 0xf08a3c, rood: 0xd9534f,
  baksteen: 0xd98a6a, weg: 0x9aa3a8, water: 0x7cc3dc,
};
export const HUID = [0xf3d2b3, 0xe0ac7e, 0xc68642, 0x8d5524, 0xf6c9a0, 0x6b4428];
export const HAAR = [0x2b1d14, 0x5a3a22, 0xa0522d, 0x1a1a1a, 0xd8b26e];

export const klem = (x, a, b) => Math.min(b, Math.max(a, x));
export const uitTerug = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
export const inUit = x => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
export const stuiter = x => {
  const n = 7.5625, d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
};
// Vaste toevalsreeks, zodat een tafereel er bij elk bezoek hetzelfde uitziet.
export function toeval(zaad) { return () => { zaad |= 0; zaad = zaad + 0x6D2B79F5 | 0; let t = Math.imul(zaad ^ zaad >>> 15, 1 | zaad); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ───────────────────────────── bouwstenen ─────────────────────────────

const geoVoorraad = new Map();
function rondBlokGeo(b, h, d, r) {
  const rr = Math.max(0, Math.min(r, Math.min(b, h, d) / 2 - 0.002));
  const sleutel = [b, h, d, rr].join('|');
  if (!geoVoorraad.has(sleutel)) {
    geoVoorraad.set(sleutel, rr > 0.004 ? new T.RoundedBoxGeometry(b, h, d, 2, rr) : new T.BoxGeometry(b, h, d));
  }
  return geoVoorraad.get(sleutel);
}
const matVoorraad = new Map();
export function mat(kleur, plat = false) {
  const sleutel = kleur + (plat ? 'p' : '');
  if (!matVoorraad.has(sleutel)) matVoorraad.set(sleutel, new T.MeshLambertMaterial({ color: kleur, flatShading: plat }));
  return matVoorraad.get(sleutel);
}
export function zet(ouder, m, schaduw = true) {
  m.castShadow = schaduw;
  m.receiveShadow = true;
  ouder.add(m);
  return m;
}
// y is telkens de onderkant: zo zet je iets gewoon "op" een vloer of tafel.
export function blok(ouder, b, h, d, kleur, x, y, z, o = {}) {
  const m = new T.Mesh(rondBlokGeo(b, h, d, o.r ?? 0.03), o.materiaal || mat(kleur));
  m.position.set(x, y + h / 2, z);
  return zet(ouder, m, o.schaduw ?? true);
}
export function cilinder(ouder, rBoven, rOnder, h, kleur, x, y, z, o = {}) {
  const m = new T.Mesh(new T.CylinderGeometry(rBoven, rOnder, h, o.seg ?? 18), o.materiaal || mat(kleur, o.plat));
  m.position.set(x, y + h / 2, z);
  return zet(ouder, m, o.schaduw ?? true);
}
export function bol(ouder, r, kleur, x, y, z, o = {}) {
  const seg = o.seg ?? 16;
  const m = new T.Mesh(new T.SphereGeometry(r, seg, Math.max(6, Math.round(seg * 0.7))), o.materiaal || mat(kleur, o.plat));
  m.position.set(x, y, z);
  return zet(ouder, m, o.schaduw ?? true);
}
export function kruin(ouder, r, kleur, x, y, z) {
  const m = new T.Mesh(new T.IcosahedronGeometry(r, 1), mat(kleur, true));
  m.position.set(x, y, z);
  return zet(ouder, m);
}
// Een puntdak: een cilinder met drie zijden, op zijn kant gelegd. De nok loopt
// langs de x-as; b is de lengte, d de diepte en h de hoogte van het dak.
export function puntdak(ouder, b, h, d, kleur, x, y, z) {
  const g = groepje(ouder, x, y, z);
  g.rotation.y = Math.PI / 2;
  const m = zet(g, new T.Mesh(new T.CylinderGeometry(1, 1, b, 3, 1), mat(kleur, true)));
  m.rotation.x = -Math.PI / 2;
  m.scale.set(d / Math.sqrt(3), 1, h / 1.5);
  m.position.y = h / 3;
  return g;
}
export function groepje(ouder, x = 0, y = 0, z = 0) {
  const g = new T.Group();
  g.position.set(x, y, z);
  ouder.add(g);
  return g;
}
// Wat beweegt of oplicht, wordt niet samengevoegd met de rest (zie voegSamen).
export function levend(obj) { obj.userData.levend = true; return obj; }

const lijfGeo = new T.CapsuleGeometry(0.11, 0.16, 6, 14);
const armGeo = new T.CapsuleGeometry(0.034, 0.15, 4, 8);
const hoofdGeo = new T.SphereGeometry(0.1, 20, 14);
const haarGeo = new T.SphereGeometry(0.107, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);

// Figuurtjes zonder gezicht, een beetje speelgoed: zo herkent niemand zichzelf
// en kan iedereen zichzelf erin zien. schaal < 1 maakt er een kind van.
export function figuur(ouder, { x = 0, y = 0, z = 0, draai = 0, shirt, broek = K.broek, huid, haar, zit = false, schaal = 1 }) {
  const g = levend(new T.Group());
  g.position.set(x, y, z);
  g.rotation.y = draai;
  g.scale.setScalar(schaal);
  const romp = zit ? 0.3 : 0.32;
  if (zit) {
    blok(g, 0.21, 0.09, 0.3, broek, 0, 0.25, 0.1, { r: 0.04 });
    blok(g, 0.085, 0.26, 0.09, broek, -0.055, 0, 0.21, { r: 0.035 });
    blok(g, 0.085, 0.26, 0.09, broek, 0.055, 0, 0.21, { r: 0.035 });
  } else {
    g.userData.benen = [
      levend(blok(g, 0.092, 0.33, 0.1, broek, -0.055, 0, 0, { r: 0.04 })),
      levend(blok(g, 0.092, 0.33, 0.1, broek, 0.055, 0, 0, { r: 0.04 })),
    ];
  }
  const lijf = zet(g, new T.Mesh(lijfGeo, mat(shirt)));
  lijf.position.y = romp + 0.19;
  g.userData.armen = [-1, 1].map(kant => {
    // Een arm draait rond de schouder: daarom zit hij in een eigen groepje.
    const schouder = levend(groepje(g, kant * 0.135, romp + 0.3, zit ? 0.05 : 0));
    const arm = zet(schouder, new T.Mesh(armGeo, mat(shirt)));
    arm.position.y = -0.1;
    schouder.rotation.z = kant * 0.12;
    if (zit) schouder.rotation.x = -0.7;
    return schouder;
  });
  const hoofd = levend(groepje(g, 0, romp + 0.47, 0));
  zet(hoofd, new T.Mesh(hoofdGeo, mat(huid)));
  if (haar != null) {
    const h = zet(hoofd, new T.Mesh(haarGeo, mat(haar)));
    h.position.y = 0.012;
    h.rotation.x = -0.3;
  }
  g.userData.hoofd = hoofd;
  ouder.add(g);
  return g;
}
export function stoel(ouder, x, y, z, draai, kleur) {
  const g = groepje(ouder, x, y, z);
  g.rotation.y = draai;
  blok(g, 0.28, 0.04, 0.28, kleur, 0, 0.21, 0.06, { r: 0.015 });
  blok(g, 0.28, 0.3, 0.04, kleur, 0, 0.25, -0.1, { r: 0.015 });
  for (const [lx, lz] of [[-0.11, -0.05], [0.11, -0.05], [-0.11, 0.17], [0.11, 0.17]]) {
    blok(g, 0.03, 0.21, 0.03, K.grijs, lx, 0, lz, { r: 0, schaduw: false });
  }
  return g;
}
export function lessenaar(ouder, x, y, z) {
  blok(ouder, 0.62, 0.04, 0.4, K.hout, x, y + 0.42, z, { r: 0.015 });
  blok(ouder, 0.04, 0.42, 0.36, K.wit, x - 0.27, y, z, { r: 0.01 });
  blok(ouder, 0.04, 0.42, 0.36, K.wit, x + 0.27, y, z, { r: 0.01 });
}
export function plant(ouder, x, y, z, s = 1) {
  cilinder(ouder, 0.13 * s, 0.1 * s, 0.22 * s, K.perzik, x, y, z);
  kruin(ouder, 0.16 * s, K.blad2, x, y + 0.36 * s, z);
  kruin(ouder, 0.12 * s, K.blad1, x + 0.08 * s, y + 0.5 * s, z + 0.03);
}
export function laptop(ouder, x, y, z, draai = 0, scherm = K.inkt) {
  const g = groepje(ouder, x, y, z);
  g.rotation.y = draai;
  blok(g, 0.4, 0.02, 0.28, K.grijs, 0, 0, 0, { r: 0.008 });
  blok(g, 0.4, 0.27, 0.015, scherm, 0, 0.01, -0.15, { r: 0.006 }).rotation.x = -0.22;
  return g;
}
export function boom(ouder, x, z, s, kleuren) {
  const g = groepje(ouder, x, 0, z);
  cilinder(g, 0.06 * s, 0.09 * s, 0.7 * s, K.houtDonker, 0, 0, 0, { seg: 8 });
  kruin(g, 0.5 * s, kleuren[0], 0, 0.95 * s, 0);
  kruin(g, 0.36 * s, kleuren[1], 0.22 * s, 1.25 * s, 0.1 * s);
  kruin(g, 0.3 * s, kleuren[2] ?? kleuren[0], -0.2 * s, 1.18 * s, -0.12 * s);
  return g;
}

// Samenvoegen: alles wat stilstaat, wordt één vorm, met de kleur in de vorm
// zelf. Zo tekent de grafische kaart een tafereel in een paar beurten in plaats
// van in honderden, en dat merk je op een trage Chromebook. Materialen die apart
// moeten blijven (die 's avonds of onder de muis veranderen), krijgen een eigen
// vorm per materiaal: zet daarvoor materiaal.userData.apart op true.
const kleurMat = { glad: new T.MeshLambertMaterial({ vertexColors: true }), plat: new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }) };
export function voegSamen(groep) {
  groep.updateMatrixWorld(true);
  const terug = new T.Matrix4().copy(groep.matrixWorld).invert();
  const bakken = new Map();
  const weg = [];
  (function loop(o) {
    for (const c of o.children) {
      if (c.userData.levend) continue;
      const geschikt = c.isMesh && !c.isInstancedMesh && c.children.length === 0 && c.visible
        && c.material.visible !== false && !c.material.map && !c.material.transparent;
      if (geschikt) {
        const g = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone();
        g.applyMatrix4(new T.Matrix4().multiplyMatrices(terug, c.matrixWorld));
        // Een vorm die al eerder werd samengevoegd, houdt haar kleuren.
        for (const naam of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(naam)) g.deleteAttribute(naam);
        const metKleur = c.material.isMeshLambertMaterial && !c.material.userData.apart && !c.material.vertexColors;
        if (metKleur) {
          const n = g.attributes.position.count, kleuren = new Float32Array(n * 3), { r, g: gr, b } = c.material.color;
          for (let i = 0; i < n; i++) { kleuren[i * 3] = r; kleuren[i * 3 + 1] = gr; kleuren[i * 3 + 2] = b; }
          g.setAttribute('color', new T.BufferAttribute(kleuren, 3));
        }
        const materiaal = metKleur ? (c.material.flatShading ? kleurMat.plat : kleurMat.glad) : c.material;
        const sleutel = materiaal.uuid + (c.castShadow ? '+' : '-');
        if (!bakken.has(sleutel)) bakken.set(sleutel, { materiaal, schaduw: c.castShadow, vormen: [] });
        bakken.get(sleutel).vormen.push(g);
        weg.push(c);
      } else if (c.children.length) {
        loop(c);
      }
    }
  })(groep);
  for (const c of weg) c.parent.remove(c);
  for (const { materiaal, schaduw, vormen } of bakken.values()) {
    const m = new T.Mesh(T.mergeGeometries(vormen), materiaal);
    m.castShadow = schaduw;
    m.receiveShadow = true;
    groep.add(m);
    for (const v of vormen) v.dispose();
  }
}

// ───────────────────────────── tekenen op borden en schermen ─────────────────────────────

export const LETTER = 'Poppins, "Segoe UI", Roboto, Arial, sans-serif';
export const F = (gewicht, px) => `${gewicht} ${px}px ${LETTER}`;
export function rond(ctx, x, y, b, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, b, h, r);
  else ctx.rect(x, y, b, h);
}
export function breek(ctx, tekst, maxB) {
  const regels = [];
  let regel = '';
  for (const woord of tekst.split(' ')) {
    const proef = regel ? regel + ' ' + woord : woord;
    if (regel && ctx.measureText(proef).width > maxB) { regels.push(regel); regel = woord; } else regel = proef;
  }
  if (regel) regels.push(regel);
  return regels;
}
// De getypte tekst volgt de regels van de volledige zin, zodat het
// tekstballonnetje niet verspringt terwijl de zin verschijnt.
export function getypteRegels(regels, n) {
  const uit = [];
  let rest = n;
  for (const r of regels) {
    if (rest <= 0) break;
    uit.push(r.slice(0, rest));
    rest -= r.length + 1;
  }
  return uit;
}
export function vinkje(ctx, x, y, r, kleur = '#126425') {
  ctx.fillStyle = kleur;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.28; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.02); ctx.lineTo(x - r * 0.1, y + r * 0.38); ctx.lineTo(x + r * 0.48, y - r * 0.35); ctx.stroke();
}
export function denkpuntjes(ctx, x, y, fase, kleur = '#126425') {
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = i < fase ? 1 : 0.25;
    ctx.fillStyle = kleur;
    ctx.beginPath(); ctx.arc(x + i * 34, y, 10, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
export function cursor(ctx, regels, x, y0, regelH, px) {
  const laatste = regels[regels.length - 1] || '';
  const i = Math.max(0, regels.length - 1);
  ctx.fillStyle = '#126425';
  ctx.fillRect(x + ctx.measureText(laatste).width + 4, y0 + i * regelH - px * 0.8, Math.max(3, px * 0.09), px * 0.95);
}
// Een bord of scherm met een tekening op een canvas. scherm: true geeft een
// scherm dat zelf licht geeft; anders wordt het belicht zoals een poster.
export function paneel(ouder, b, h, pxB, x, y, z, { scherm = false, draai = 0 } = {}) {
  const c = document.createElement('canvas');
  c.width = pxB;
  c.height = Math.round(pxB * h / b);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  const materiaal = scherm ? new T.MeshBasicMaterial({ map: tex }) : new T.MeshLambertMaterial({ map: tex });
  const m = new T.Mesh(new T.PlaneGeometry(b, h), materiaal);
  m.position.set(x, y, z);
  m.rotation.y = draai;
  m.receiveShadow = !scherm;
  ouder.add(m);
  return { mesh: m, c, ctx: c.getContext('2d'), tex };
}

// ───────────────────────────── het podium ─────────────────────────────

const VLUCHT = 1.4;

export async function maakPodium(canvas, opties, bouw) {
  const {
    stil = false, zwak = false, labels = {}, pinnen = {},
    onKamer = () => {}, onHover = () => {}, onPlek = () => {}, onPlekHover = () => {}, onFout = () => {},
    // opname: { breedte, hoogte } — een vaste beeldmaat zonder eigen lus. Wie
    // opneemt, zet zelf elk beeld met stap() en teken(), zodat geen beeld hapert.
    opname = null,
  } = opties;

  const renderer = new T.WebGLRenderer({ canvas, antialias: !zwak, alpha: true, powerPreference: 'default', preserveDrawingBuffer: !!opname });
  let pixelRatio = opname ? 1 : Math.min(window.devicePixelRatio || 1, zwak ? 1.25 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); onFout(); });

  const scene = new T.Scene();
  const wereld = new T.Group();
  scene.add(wereld);

  // Licht: een hemel die zacht bijvult, een koel vullicht van links en een zon
  // die bij het laden opkomt. 's Avonds wordt de zon de maan.
  const hemel = new T.HemisphereLight(0xfffaf0, 0xb9dcc4, 1.1);
  scene.add(hemel);
  const vul = new T.DirectionalLight(0xdfe9ff, 0.45);
  vul.position.set(-8, 5, 4);
  scene.add(vul);
  const zon = new T.DirectionalLight(0xfff1dc, 2.6);
  zon.position.set(6, 10, 9);
  zon.target.position.set(0, 2, -1);
  scene.add(zon, zon.target);
  zon.castShadow = true;
  zon.shadow.mapSize.set(zwak ? 1024 : 2048, zwak ? 1024 : 2048);
  Object.assign(zon.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 0.5, far: 40 });
  zon.shadow.bias = -0.0004;
  zon.shadow.normalBias = 0.03;
  zon.shadow.radius = 3;
  // Lampen die pas 's avonds aangaan. Op een traag toestel laten we ze weg: dan
  // gloeien alleen de ramen en de muren.
  const kamerLampen = [];
  function kamerLamp(x, y, z, sterkte = 5) {
    if (zwak) return null;
    const l = new T.PointLight(0xffd59a, 0, 6.5, 1.3);
    l.position.set(x, y, z);
    scene.add(l);
    kamerLampen.push({ l, sterkte });
    return l;
  }

  // Gedeelde materialen die 's avonds veranderen.
  const lampMat = new T.MeshBasicMaterial({ color: 0xf2efe6 });
  const glasBuiten = new T.MeshLambertMaterial({ color: K.blauw, emissive: 0xffc965, emissiveIntensity: 0 });
  const glasBinnen = new T.MeshLambertMaterial({ color: 0xcfe9f2 });
  glasBuiten.userData.apart = glasBinnen.userData.apart = true;
  const gloedTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gr = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,220,130,0.95)'); gr.addColorStop(0.3, 'rgba(255,214,110,0.4)'); gr.addColorStop(1, 'rgba(255,214,110,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
    const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    return tex;
  })();
  const gloedGeo = new T.PlaneGeometry(1, 1);
  const gloedjes = [];
  const naarCamera = [];
  function gloed(ouder, x, y, z, s) {
    const m = levend(new T.Mesh(gloedGeo, new T.MeshBasicMaterial({ map: gloedTex, transparent: true, depthWrite: false, opacity: 0 })));
    m.position.set(x, y, z);
    m.scale.setScalar(s);
    m.visible = false;
    ouder.add(m);
    gloedjes.push(m);
    return m;
  }
  function hanglamp(ouder, x, z, plafond) {
    const g = groepje(ouder, x, 0, z);
    cilinder(g, 0.007, 0.007, 0.3, K.inkt, 0, plafond - 0.3, 0, { seg: 6, schaduw: false });
    cilinder(g, 0.05, 0.17, 0.13, K.groen, 0, plafond - 0.43, 0, { seg: 18 });
    bol(g, 0.05, 0, 0, plafond - 0.44, 0, { materiaal: lampMat, schaduw: false, seg: 10 });
    gloed(g, 0, plafond - 0.5, 0, 0.75);
    return g;
  }
  function raamBinnen(ouder, x, y, z, b, h) {
    blok(ouder, b + 0.1, h + 0.1, 0.03, K.wit, x, y - 0.05, z, { r: 0.012, schaduw: false });
    blok(ouder, b, h, 0.01, 0, x, y, z + 0.02, { r: 0, schaduw: false, materiaal: glasBinnen });
    blok(ouder, 0.03, h, 0.012, K.wit, x, y, z + 0.026, { r: 0, schaduw: false });
    blok(ouder, b, 0.03, 0.012, K.wit, x, y + h / 2, z + 0.026, { r: 0, schaduw: false });
    blok(ouder, b + 0.16, 0.035, 0.08, K.wit, x, y - 0.07, z + 0.04, { r: 0.01, schaduw: false });
  }
  // Een raam aan de buitenkant van een gevel die naar +z kijkt; 's avonds gloeit het.
  function raamBuiten(ouder, x, y, z, b, h, kader = K.wit) {
    blok(ouder, b + 0.08, h + 0.08, 0.03, kader, x, y - 0.04, z, { r: 0.012, schaduw: false });
    blok(ouder, b, h, 0.02, 0, x, y, z + 0.012, { r: 0.006, schaduw: false, materiaal: glasBuiten });
    blok(ouder, 0.025, h, 0.012, kader, x, y, z + 0.022, { r: 0, schaduw: false });
  }

  // De AI-assistent: een warm lichtje dat ergens heen vliegt, met een gloed en
  // drie bolletjes die ronddraaien terwijl het nadenkt.
  function maakLichtje() {
    const g = levend(groepje(wereld));
    // Een warm geel, geen bleek: op perzikkleurige en gele muren moet het opvallen.
    bol(g, 0.085, 0, 0, 0, 0, { materiaal: new T.MeshBasicMaterial({ color: 0xffcf3a }), schaduw: false, seg: 20 });
    bol(g, 0.035, 0, -0.025, 0.03, 0.06, { materiaal: new T.MeshBasicMaterial({ color: 0xfffbe6 }), schaduw: false, seg: 10 });
    const halo = levend(new T.Mesh(gloedGeo, new T.MeshBasicMaterial({ map: gloedTex, transparent: true, depthWrite: false })));
    halo.scale.setScalar(0.62);
    g.add(halo);
    naarCamera.push(halo);
    const lamp = new T.PointLight(0xffe7a0, 0, 2.6, 2);
    g.add(lamp);
    const bolletjes = [0, 1, 2].map(() => levend(bol(g, 0.022, 0, 0, 0, 0, { materiaal: new T.MeshBasicMaterial({ color: 0x126425 }), schaduw: false, seg: 8 })));
    // Het lichtje blijft altijd in de scène, alleen piepklein en uit: verschijnt
    // er halverwege een lamp, dan moet elk materiaal opnieuw vertaald worden.
    g.scale.setScalar(0.001);
    const l = {
      obj: g, pos: new T.Vector3(), aan: false, sinds: 0, sprong: -10,
      vlucht: { van: new T.Vector3(), naar: new T.Vector3(), t: 1, klaar: null, wacht: 0 },
      zetAan(pos, nu) { l.aan = true; l.sinds = nu; l.pos.copy(pos); },
      // Vlieg naar een plek; klaar() wordt opgeroepen bij aankomst.
      vlieg(naar, klaar) {
        if (l.pos.distanceTo(naar) < 0.01) { l.vlucht.wacht = 0.7; l.vlucht.klaar = klaar; return; }
        l.vlucht.van.copy(l.pos); l.vlucht.naar.copy(naar); l.vlucht.t = 0; l.vlucht.klaar = klaar;
      },
      vliegt() { return l.vlucht.t < 1 || !!l.vlucht.klaar; },
      werkBij(dt, nu, { denkt = false, typt = false, nacht = 0 } = {}) {
        if (!l.aan) return;
        const v = l.vlucht;
        if (v.t < 1) {
          v.t = Math.min(1, v.t + dt / VLUCHT);
          const e = inUit(v.t);
          // Het lichtje vliegt een boogje naar voren, zodat het niet dwars door
          // een vloer of een gebouw gaat.
          hulp.addVectors(v.van, v.naar).multiplyScalar(0.5).add({ x: 0, y: 0.6, z: 2.4 });
          const a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e;
          l.pos.set(a * v.van.x + b * hulp.x + c * v.naar.x, a * v.van.y + b * hulp.y + c * v.naar.y, a * v.van.z + b * hulp.z + c * v.naar.z);
          if (v.t >= 1 && v.klaar) { const k = v.klaar; v.klaar = null; k(); }
        } else if (v.klaar) {
          v.wacht -= dt;
          if (v.wacht <= 0) { const k = v.klaar; v.klaar = null; k(); }
        }
        const groei = uitTerug(klem((nu - l.sinds) / 0.5, 0, 1));
        const sp = Math.max(0, 1 - (nu - l.sprong) / 1.2);
        g.scale.setScalar(Math.max(groei, 0.001) * (1 + sp * 0.4 * Math.abs(Math.sin(sp * 12))));
        g.position.copy(l.pos).add({ x: 0, y: Math.sin(nu * 2.2) * 0.035, z: 0 });
        halo.scale.setScalar(0.62 * (1 + Math.sin(nu * (typt ? 9 : 3)) * 0.12) * (1 + nacht * 0.5));
        bolletjes.forEach((b, i) => {
          b.visible = denkt;
          const hoek = nu * 5 + i * 2.094;
          b.position.set(Math.cos(hoek) * 0.2, Math.sin(hoek * 0.5) * 0.04, Math.sin(hoek) * 0.2);
        });
        lamp.intensity = 1.2 + (denkt ? 0.5 + Math.sin(nu * 10) * 0.3 : 0);
      },
      stilZetten(pos) { l.aan = true; l.pos.copy(pos); g.position.copy(pos); g.scale.setScalar(1); lamp.intensity = 1.2; bolletjes.forEach(b => { b.visible = false; }); },
    };
    return l;
  }

  // ── aanklikbare plekken en speelse dingen ──
  const plekken = {};
  function plek(id, kamer, obj) {
    levend(obj);
    obj.userData.plekId = id;
    plekken[id] = { id, kamer, obj, licht: 0, materialen: [] };
    return obj;
  }
  const speels = [];
  function speel(obj, actie) { levend(obj); obj.userData.speel = speels.length; speels.push({ obj, actie, t: -10 }); return obj; }
  // Borden en schermen die niet veranderen: één keer tekenen, en nog eens zodra
  // het lettertype binnen is.
  const statisch = [];
  function statischeTekening(p, f) { statisch.push([p, f]); return p; }

  let tijd = 0;
  const hulp = new T.Vector3();
  const gereedschap = {
    T, scene, wereld, zwak, stil, kamerLamp, lampMat, glasBuiten, glasBinnen,
    gloed, hanglamp, raamBinnen, raamBuiten, maakLichtje, plek, speel, statischeTekening,
    tijd: () => tijd,
    bliksem: () => bliksem(),
  };
  function bliksem() {
    if (stil) return;
    flitsT = tijd;
    opties.onBliksem?.();
  }
  const s = bouw(gereedschap);
  const kamers = s.kamers || {};
  const KADERS = s.kaders;
  const OPZIJ = s.opzij ?? 0.31;

  // ── de plekken: waar hun speld staat en wat de camera toont ──
  wereld.updateMatrixWorld(true);
  const doos = new T.Box3();
  for (const p of Object.values(plekken)) {
    if (s.plekAnker?.(p.id)) continue;
    doos.setFromObject(p.obj);
    const c = doos.getCenter(new T.Vector3());
    p.min = doos.min.clone();
    p.max = doos.max.clone();
    // Hangt het aan een linkermuur, dan kijkt de camera er schuiner op.
    p.linkerMuur = s.linkerMuur != null && p.max.x - p.min.x < 0.12 && p.min.x < s.linkerMuur + 0.2;
    // Buiten staat de speld op het voorwerp, als een kaartspeld. Binnen staat ze
    // ervoor, in het bovenste deel: zo blijft er geen plafond tussen.
    p.boven = s.binnen ? !s.binnen(p.kamer) : true;
    p.anker = p.boven
      ? new T.Vector3(c.x, doos.max.y + 0.05, c.z)
      : new T.Vector3(c.x, doos.min.y + (doos.max.y - doos.min.y) * 0.7, doos.max.z);
  }
  s.naPlekken?.();

  // Alles wat stilstaat samenvoegen: eerst de figuren en de plekken (met hun
  // eigen materialen), daarna de groepen die het tafereel opgeeft.
  const figuren = [];
  wereld.traverse(o => { if (o.userData.hoofd) figuren.push(o); });
  for (const f of figuren) voegSamen(f);
  for (const p of Object.values(plekken)) if (p.obj.isGroup) voegSamen(p.obj);
  for (const g of s.samenvoegen || []) voegSamen(g);
  // Eigen materialen per plek, zodat alleen dat voorwerp oplicht.
  for (const p of Object.values(plekken)) {
    const gezien = new Map();
    p.obj.traverse(o => {
      if (!o.isMesh || !o.material?.isMeshLambertMaterial) return;
      if (!gezien.has(o.material)) {
        const kopie = o.material.clone();
        // Een warme gloed, geen wit: wit maakt de kleuren grauw.
        kopie.emissive.setHex(0xfff0b8);
        kopie.emissiveIntensity = 0;
        gezien.set(o.material, kopie);
      }
      o.material = gezien.get(o.material);
    });
    p.materialen = [...gezien.values()];
  }

  // ── binnenkomst ──
  const intro = s.intro || [];
  for (const it of intro) { it.y = it.obj.position.y; it.s = it.obj.scale.clone(); }
  function werkIntroBij(t) {
    for (const it of intro) {
      const p = klem((t - it.start) / (it.soort === 'val' ? 0.7 : 0.5), 0, 1);
      if (it.soort === 'val') { it.obj.position.y = it.y + (1 - stuiter(p)) * 4.5; it.obj.visible = p > 0; }
      else { const sc = uitTerug(p); it.obj.scale.copy(it.s).multiplyScalar(Math.max(sc, 0.001)); it.obj.visible = p > 0; }
    }
  }

  // ── camera: per onderdeel een eigen kader ──
  const camera = new T.OrthographicCamera(-1, 1, 1, -1, 1, 100);
  function richting(hoek, opzij = OPZIJ, doel = new T.Vector3()) {
    return doel.set(Math.sin(opzij) * Math.cos(hoek), Math.sin(hoek), Math.cos(opzij) * Math.cos(hoek));
  }
  const OMHOOG = new T.Vector3(0, 1, 0);
  function camAssen(hoek, opzij) {
    const vooruit = richting(hoek, opzij).negate();
    const rechts = new T.Vector3().crossVectors(vooruit, OMHOOG).normalize();
    return { rechts, op: new T.Vector3().crossVectors(rechts, vooruit) };
  }
  let kaartOpzij = false;
  // Bij een open kaartje zoomt de camera in op het voorwerp, met wat ruimte
  // errond zodat je nog ziet waar het staat. Ze kijkt dan ook meer recht in het
  // lokaal: van opzij staat de zijmuur anders half in beeld.
  function plekKader(p) {
    const dyn = s.plekAnker?.(p.id);
    const min = dyn ? dyn.clone().sub({ x: 0.5, y: 0.7, z: 0.5 }) : p.min.clone();
    const max = dyn ? dyn.clone().add({ x: 0.5, y: 0.1, z: 0.5 }) : p.max.clone();
    const c = min.clone().add(max).multiplyScalar(0.5);
    const half = max.clone().sub(min).multiplyScalar(0.5);
    const z = s.plekZoom ?? 1;
    half.set(Math.max(half.x, 1.0 * z), Math.max(half.y, 0.6 * z), Math.max(half.z, 0.5 * z)).multiplyScalar(1.3);
    const binnen = s.binnen ? s.binnen(p.kamer) : false;
    return {
      min: [c.x - half.x, c.y - half.y, c.z - half.z], max: [c.x + half.x, c.y + half.y, c.z + half.z],
      marge: 1.05, hoek: binnen ? 0.2 : (s.plekHoek ?? 0.3), opzij: p.linkerMuur ? 0.8 : binnen ? 0.12 : OPZIJ,
      omhoog: kaartOpzij ? 0 : 0.17,
    };
  }
  let breedte = 1, hoogte = 1, aspect = 1;
  function pas(kader) {
    const midden = new T.Vector3((kader.min[0] + kader.max[0]) / 2, (kader.min[1] + kader.max[1]) / 2, (kader.min[2] + kader.max[2]) / 2);
    let er = 0, eu = 0;
    const opzij = kader.opzij ?? OPZIJ;
    const { rechts: camRechts, op: camOp } = camAssen(kader.hoek, opzij);
    for (let i = 0; i < 8; i++) {
      hulp.set(i & 1 ? kader.max[0] : kader.min[0], i & 2 ? kader.max[1] : kader.min[1], i & 4 ? kader.max[2] : kader.min[2]).sub(midden);
      er = Math.max(er, Math.abs(hulp.dot(camRechts)));
      eu = Math.max(eu, Math.abs(hulp.dot(camOp)));
    }
    const h = Math.max(2 * eu, 2 * er / aspect) * kader.marge;
    // Ligt het kaartje onderaan over het beeld, dan schuift het voorwerp wat omhoog.
    if (kader.omhoog) midden.addScaledVector(camOp, -h * kader.omhoog);
    return { midden, hoogte: h, hoek: kader.hoek, opzij };
  }
  const o0 = KADERS.overzicht;
  const cam = { midden: new T.Vector3(), hoogte: 14, hoek: o0.hoek, opzij: OPZIJ, doelMidden: new T.Vector3(), doelHoogte: 14, doelHoek: o0.hoek, doelOpzij: OPZIJ };
  const kijkRichting = new T.Vector3();
  let focus = 'overzicht', open = null;
  function zetDoel(direct = false) {
    const k = pas(open ? plekKader(plekken[open]) : KADERS[focus] || KADERS.overzicht);
    cam.doelMidden.copy(k.midden);
    cam.doelHoogte = k.hoogte;
    cam.doelHoek = k.hoek;
    cam.doelOpzij = k.opzij;
    if (direct) { cam.midden.copy(k.midden); cam.hoogte = k.hoogte; cam.hoek = k.hoek; cam.opzij = k.opzij; }
  }
  const wereldMidden = new T.Vector3();
  function plaatsCamera() {
    wereldMidden.copy(cam.midden).applyAxisAngle({ x: 0, y: 1, z: 0 }, wereld.rotation.y);
    camera.position.copy(richting(cam.hoek, cam.opzij, kijkRichting)).multiplyScalar(40).add(wereldMidden);
    camera.lookAt(wereldMidden);
    const h = cam.hoogte / 2;
    camera.left = -h * aspect; camera.right = h * aspect; camera.top = h; camera.bottom = -h;
    camera.updateProjectionMatrix();
  }
  let gestart = false;
  function maatBij() {
    const vak = opname ? { width: opname.breedte, height: opname.hoogte } : canvas.parentElement.getBoundingClientRect();
    breedte = Math.max(1, Math.round(vak.width));
    hoogte = Math.max(1, Math.round(vak.height));
    aspect = breedte / hoogte;
    renderer.setSize(breedte, hoogte, false);
    zetDoel(stil || !gestart);
  }

  // ── labels en spelden ──
  const ankers = s.ankers || {};
  const vorige = new Map();
  // soort: 'label' (naast een onderdeel), 'midden' of 'boven' (een speld op of boven haar anker)
  function plaatsEen(el, anker, soort) {
    const opMidden = soort !== 'label';
    hulp.copy(anker).applyMatrix4(wereld.matrixWorld).project(camera);
    const bl = el.offsetWidth, hl = el.offsetHeight;
    let x = (hulp.x + 1) / 2 * breedte, y = (1 - hulp.y) / 2 * hoogte;
    const binnen = y > hl * 0.6 && y < hoogte - hl * 0.6 && x > (opMidden ? hl * 0.6 : -bl * 0.5) && x < breedte - (opMidden ? hl * 0.6 : 0);
    x = opMidden ? x - hl / 2 : klem(x, 10, breedte - bl - 10);
    const sleutel = `${Math.round(x)}|${Math.round(y)}|${binnen}`;
    if (vorige.get(el) === sleutel) return;
    vorige.set(el, sleutel);
    el.style.transform = `translate(${x.toFixed(1)}px, ${(y - (soort === 'boven' ? hl : hl / 2)).toFixed(1)}px)`;
    el.classList.toggle('weg', !binnen);
    el.tabIndex = binnen ? 0 : -1;
  }
  let pinGroep = null;
  const pinGroepVan = f => (s.pinGroep ? s.pinGroep(f) : f === 'overzicht' ? 'buiten' : f);
  function plaatsLabels() {
    for (const [naam, el] of Object.entries(labels)) if (el && ankers[naam]) plaatsEen(el, ankers[naam], 'label');
    const groep = open ? plekken[open].kamer : pinGroepVan(focus);
    if (groep !== pinGroep) {
      pinGroep = groep;
      for (const [id, el] of Object.entries(pinnen)) el.hidden = plekken[id]?.kamer !== groep;
      vorige.clear();
    }
    for (const [id, el] of Object.entries(pinnen)) {
      const p = plekken[id];
      if (!p || p.kamer !== groep) continue;
      const dyn = s.plekAnker?.(id);
      if (dyn === false) { el.classList.add('weg'); continue; }
      plaatsEen(el, dyn || p.anker, dyn || p.boven ? 'boven' : 'midden');
    }
  }

  // ── muis, vinger, slepen en kantelen ──
  const kijk = { yaw: 0, pitch: 0, doelYaw: 0, doelPitch: 0, laatst: -10, sleepYaw: 0, gesleept: -10 };
  function bijWijzer(e) {
    if (e.pointerType === 'touch' || opname) return;
    kijk.doelYaw = (e.clientX / innerWidth - 0.5) * 0.24;
    kijk.doelPitch = (e.clientY / innerHeight - 0.5) * 0.06;
    kijk.laatst = tijd;
  }
  let nulKanteling = null;
  function bijKantelen(e) {
    if (e.gamma == null || opname) return;
    if (nulKanteling == null) nulKanteling = e.beta ?? 0;
    kijk.doelYaw = klem(e.gamma / 35, -1, 1) * 0.16;
    kijk.doelPitch = klem(((e.beta ?? 0) - nulKanteling) / 40, -1, 1) * 0.05;
    kijk.laatst = tijd;
  }
  if (!stil) {
    addEventListener('pointermove', bijWijzer, { passive: true });
    addEventListener('deviceorientation', bijKantelen, { passive: true });
  }
  // Horizontaal slepen draait het tafereel; verticaal blijft gewoon scrollen.
  let sleep = null, netGesleept = false;
  canvas.addEventListener('pointerdown', e => {
    if (stil) return;
    sleep = { x: e.clientX, y: e.clientY, start: kijk.sleepYaw, bezig: false, id: e.pointerId };
  });
  canvas.addEventListener('pointermove', e => {
    if (!sleep || e.pointerId !== sleep.id) return;
    const dx = e.clientX - sleep.x, dy = e.clientY - sleep.y;
    if (!sleep.bezig && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      sleep.bezig = true;
      try { canvas.setPointerCapture(e.pointerId); } catch { /* geen vangst: slepen werkt dan binnen het canvas */ }
      canvas.classList.add('sleept');
    }
    if (sleep.bezig) { kijk.sleepYaw = klem(sleep.start + dx * 0.006, -0.75, 0.75); kijk.gesleept = tijd; }
  });
  function sleepGedaan() {
    if (sleep?.bezig) netGesleept = true;
    sleep = null;
    canvas.classList.remove('sleept');
  }
  canvas.addEventListener('pointerup', sleepGedaan);
  canvas.addEventListener('pointercancel', sleepGedaan);

  const straal = new T.Raycaster();
  const wijzer = new T.Vector2(9, 9);
  let hover = null, hoverPlek = null, wijzerNieuw = false, extraMarkering = null;
  function zetWijzer(e) {
    const d = canvas.getBoundingClientRect();
    wijzer.set((e.clientX - d.left) / d.width * 2 - 1, -((e.clientY - d.top) / d.height) * 2 + 1);
  }
  canvas.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    zetWijzer(e);
    wijzerNieuw = true;
    if (stil) { zoekHover(); teken1(); }
  });
  canvas.addEventListener('pointerleave', () => { wijzer.set(9, 9); wijzerNieuw = true; if (stil) { zoekHover(); teken1(); } });
  canvas.addEventListener('click', e => {
    if (netGesleept) { netGesleept = false; return; }
    zetWijzer(e);
    const raak = raakIets();
    if (raak?.plek) onPlek(raak.plek);
    else if (raak?.speel) raak.speel.actie(raak.speel);
    else if (raak?.kamer) onKamer(raak.kamer);
  });
  const raakvlakken = Object.values(kamers).map(k => k.raak).filter(Boolean);
  function zoekOmhoog(o, sleutel) {
    for (let x = o; x; x = x.parent) if (x.userData[sleutel] != null) return x.userData[sleutel];
    return null;
  }
  function raakIets() {
    if (Math.abs(wijzer.x) > 1) return null;
    straal.setFromCamera(wijzer, camera);
    const zichtbaar = Object.values(plekken).filter(p => p.kamer === pinGroep && s.plekAnker?.(p.id) !== false).map(p => p.obj);
    const treffer = straal.intersectObjects(zichtbaar, true)[0];
    if (treffer) return { plek: zoekOmhoog(treffer.object, 'plekId') };
    const speelTreffer = straal.intersectObjects(speels.map(sp => sp.obj), true)[0];
    if (speelTreffer) return { speel: speels[zoekOmhoog(speelTreffer.object, 'speel')] };
    if (focus !== 'overzicht' || open) return null;
    const k = straal.intersectObjects(raakvlakken, false)[0]?.object.userData.kamer;
    return k ? { kamer: k } : null;
  }
  function zoekHover() {
    const raak = raakIets();
    const nieuweKamer = raak?.kamer ?? null, nieuwePlek = raak?.plek ?? null;
    canvas.style.cursor = raak ? 'pointer' : '';
    if (nieuweKamer !== hover) { hover = nieuweKamer; onHover(hover); }
    if (nieuwePlek !== hoverPlek) { hoverPlek = nieuwePlek; onPlekHover(hoverPlek); }
    if (stil) zetOplichten(true);
  }
  function zetOplichten(direct, dt = 0) {
    const z = direct ? 1 : 1 - Math.exp(-dt * 8);
    for (const [naam, k] of Object.entries(kamers)) {
      if (!k.wandMat) continue;
      const doel = (naam === hover ? 0.12 : 0) + nacht * (zwak ? 0.32 : 0.1);
      k.wandMat.emissiveIntensity += (doel - k.wandMat.emissiveIntensity) * z;
    }
    for (const p of Object.values(plekken)) {
      const doel = p.id === open ? 1 : (p.id === hoverPlek || p.id === extraMarkering) ? 0.75 : 0;
      p.licht += (doel - p.licht) * z;
      const puls = p.id === open && !stil ? 0.05 * Math.sin(tijd * 4) : 0;
      for (const m of p.materialen) m.emissiveIntensity = p.licht * 0.2 + (p.licht > 0.01 ? puls : 0);
    }
  }

  // ── dag en avond, schemer en bewolking ──
  // Elke waarde loopt van 0 tot 1 en schuift zacht naar haar doel. nacht: hoe ver
  // de avond gevorderd is; schemer: de zon staat laag en kleurt oranje;
  // bewolking: minder zon, een grijzere hemel en vagere schaduwen.
  let nacht = 0, doelNacht = 0, schemer = 0, doelSchemer = 0, bewolking = 0, doelBewolking = 0;
  let flitsT = -10, flits = 0;
  const DAG = { lucht: new T.Color(0xfffaf0), grond: new T.Color(0xb9dcc4), vul: 0.45 };
  const AVOND = { lucht: new T.Color(0x8394d0), grond: new T.Color(0x27304a), hemel: 0.45, vul: 0.12, zonPos: new T.Vector3(-6, 9, 7), zonKleur: new T.Color(0xb3c3ff), zon: 0.55 };
  const ZON_VAN = { pos: new T.Vector3(11, 1.6, 5), kleur: new T.Color(0xffad6b), sterkte: 0.8, hemel: 0.45 };
  const ZON_NAAR = { pos: new T.Vector3(6, 10, 9), kleur: new T.Color(0xfff1dc), sterkte: 2.6, hemel: 1.1 };
  const SCHEMER = { pos: new T.Vector3(10, 2.6, 6), kleur: new T.Color(0xff9a5c), lucht: new T.Color(0xffd6b8) };
  const GRIJS = new T.Color(0xe2e6e8);
  const kleurDag = new T.Color(0xf2efe6), kleurAvond = new T.Color(0xffe29a);
  const glasDag = new T.Color(0xcfe9f2), glasAvond = new T.Color(0x2d3b66);
  function werkLichtBij(zp) {
    // zp: hoe ver de zon al opgekomen is bij het laden.
    const n = nacht, dag = 1 - n, sch = schemer * dag, bw = bewolking;
    zon.position.lerpVectors(ZON_VAN.pos, ZON_NAAR.pos, zp).lerp(SCHEMER.pos, sch).lerp(AVOND.zonPos, n);
    zon.color.lerpColors(ZON_VAN.kleur, ZON_NAAR.kleur, zp).lerp(SCHEMER.kleur, sch).lerp(AVOND.zonKleur, n);
    zon.intensity = (ZON_VAN.sterkte + (ZON_NAAR.sterkte - ZON_VAN.sterkte) * zp) * dag * (1 - 0.4 * sch) * (1 - 0.6 * bw) + AVOND.zon * n * (1 - 0.5 * bw);
    if ('intensity' in zon.shadow) zon.shadow.intensity = 1 - 0.65 * bw;
    hemel.intensity = (ZON_VAN.hemel + (ZON_NAAR.hemel - ZON_VAN.hemel) * zp) * dag * (1 + 0.15 * bw) + AVOND.hemel * n + flits * 1.6;
    hemel.color.copy(DAG.lucht).lerp(SCHEMER.lucht, sch).lerp(GRIJS, bw * 0.8).lerp(AVOND.lucht, n);
    hemel.groundColor.lerpColors(DAG.grond, AVOND.grond, n);
    vul.intensity = DAG.vul * (1 - n) + AVOND.vul * n;
    for (const { l, sterkte } of kamerLampen) l.intensity = n * sterkte;
    lampMat.color.lerpColors(kleurDag, kleurAvond, n);
    glasBuiten.emissiveIntensity = n * 0.9;
    glasBinnen.color.lerpColors(glasDag, glasAvond, n);
    for (const g of gloedjes) { g.material.opacity = n * 0.9; g.visible = n > 0.01; }
    s.avond?.(n);
  }

  // ── per beeld ──
  let zaal = false, zaalT = 0, zaalIndex = 0;
  const zaalVolgorde = s.zaalVolgorde || Object.keys(KADERS);
  // Een eigen drift van de kijkhoek, voor wie filmt; null volgt de gewone stand.
  let drift = null;
  function werkBij(dt) {
    tijd += dt;
    werkIntroBij(tijd);
    const zs = 1 - Math.exp(-dt * 2.2);
    nacht += (doelNacht - nacht) * zs;
    schemer += (doelSchemer - schemer) * zs;
    bewolking += (doelBewolking - bewolking) * zs;
    // Bliksem: een korte, zachte opheldering in twee tikken, geen stroboscoop.
    const ft = tijd - flitsT;
    flits = ft < 0 ? 0 : ft < 0.12 ? 0.9 : ft < 0.22 ? 0.25 : ft < 0.32 ? 0.7 : Math.max(0, 0.7 * Math.exp(-(ft - 0.32) * 7));
    werkLichtBij(inUit(klem(tijd / 3, 0, 1)));

    if (zaal && !open) {
      zaalT += dt;
      if (zaalT > 10) { zaalT = 0; zaalIndex = (zaalIndex + 1) % zaalVolgorde.length; zetFocus(zaalVolgorde[zaalIndex]); }
    }
    // kijkhoek: volgt de muis of het kantelen, en drijft zachtjes als niemand
    // iets doet. Wie gesleept heeft, ziet het tafereel even zo blijven staan.
    const rust = tijd - kijk.laatst > 2.5;
    const drijf = drift ? drift.amplitude : zaal ? 0.32 : 0.07;
    const yawDoel = rust ? Math.sin(tijd * (drift ? drift.snelheid : zaal ? 0.12 : 0.35)) * drijf : kijk.doelYaw;
    const pitchDoel = rust ? 0 : kijk.doelPitch;
    if (!sleep?.bezig && tijd - kijk.gesleept > 5) kijk.sleepYaw *= Math.exp(-dt * 1.2);
    const z = 1 - Math.exp(-dt * 2.5);
    kijk.yaw += (yawDoel + kijk.sleepYaw - kijk.yaw) * (sleep?.bezig ? 1 - Math.exp(-dt * 12) : z);
    kijk.pitch += (pitchDoel - kijk.pitch) * z;
    wereld.rotation.set(kijk.pitch, kijk.yaw, 0);

    if (open && s.plekAnker?.(open)) zetDoel();
    const zc = 1 - Math.exp(-dt * 2.8);
    cam.midden.lerp(cam.doelMidden, zc);
    cam.hoogte += (cam.doelHoogte - cam.hoogte) * zc;
    cam.hoek += (cam.doelHoek - cam.hoek) * zc;
    cam.opzij += (cam.doelOpzij - cam.opzij) * zc;

    s.werkBij?.(dt, tijd, { focus, open, nacht, speels, schemer, bewolking });

    if (wijzerNieuw || (tijd * 10 | 0) % 3 === 0) { zoekHover(); wijzerNieuw = false; }
    zetOplichten(false, dt);
  }

  // ── tekenen, pauzeren en de kwaliteit bijsturen ──
  let loopt = false, rafId = 0, vorig = 0, zichtbaar = true;
  let somDt = 0, telDt = 0;
  function teken1() {
    plaatsCamera();
    wereld.updateMatrixWorld();
    // Gloed en halo kijken altijd recht naar de camera.
    const q = camera.quaternion.clone().premultiply(wereld.quaternion.clone().invert());
    for (const m of naarCamera) m.quaternion.copy(q);
    for (const g of gloedjes) if (g.visible) g.quaternion.copy(q);
    renderer.render(scene, camera);
    plaatsLabels();
  }
  function beeld(nu) {
    if (!loopt) return;
    // Het eerste beeld kan een tijdstip krijgen van net vóór start(): dan zou de
    // tijd even negatief zijn, en dat breekt elk tafereel dat ermee rekent.
    const dt = Math.min(0.05, Math.max(0, (nu - vorig) / 1000) || 0.016);
    vorig = nu;
    werkBij(dt);
    teken1();
    if (tijd > 4) {
      somDt += dt; telDt++;
      if (telDt >= 90) {
        const gemiddeld = somDt / telDt;
        somDt = 0; telDt = 0;
        if (gemiddeld > 0.03) verlaag();
      }
    }
    rafId = requestAnimationFrame(beeld);
  }
  function verlaag() {
    // Eerst minder pixels, pas daarna de schaduwen weg: dat ziet niemand zo snel.
    if (pixelRatio > 0.8) { pixelRatio = Math.max(0.75, pixelRatio * 0.8); renderer.setPixelRatio(pixelRatio); maatBij(); }
    else if (zon.castShadow) zon.castShadow = false;
  }
  function start() {
    if (loopt || stil || opname || !zichtbaar || document.hidden) return;
    loopt = true;
    vorig = performance.now();
    rafId = requestAnimationFrame(beeld);
  }
  function stop() { loopt = false; cancelAnimationFrame(rafId); }
  new IntersectionObserver(([e]) => { zichtbaar = e.isIntersecting; zichtbaar ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  // Na een nieuwe maat meteen tekenen: het canvas is dan leeg tot het volgende beeld.
  new ResizeObserver(() => { maatBij(); if (gestart) teken1(); }).observe(canvas.parentElement);

  function zetFocus(naam) {
    focus = KADERS[naam] ? naam : 'overzicht';
    zetDoel(stil);
    if (stil) { teken1(); return; }
    s.bijFocus?.(focus);
  }

  // Lettertype eerst, anders tekenen de borden met een noodletter.
  await Promise.race([document.fonts?.load(F(700, 40)), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
  function tekenAlles() {
    for (const [p, f] of statisch) { f(p); p.tex.needsUpdate = true; }
    s.tekenAlles?.();
  }
  tekenAlles();
  document.fonts?.ready.then(() => { tekenAlles(); if (!loopt && gestart) teken1(); });

  maatBij();
  // Alles één keer vertalen voor de grafische kaart, ook wat nog verborgen is:
  // anders hapert het beeld op het moment dat het verschijnt.
  const verborgen = [];
  wereld.traverse(o => { if (!o.visible && !(o.material && o.material.visible === false)) { verborgen.push(o); o.visible = true; } });
  if (renderer.compileAsync) await renderer.compileAsync(scene, camera).catch(() => {});
  for (const o of verborgen) o.visible = false;
  if (stil) {
    // Wie minder beweging vraagt, krijgt het tafereel af en stil.
    tijd = 10;
    werkIntroBij(10);
    s.stil?.();
    werkLichtBij(1);
  } else {
    werkIntroBij(0);
  }
  teken1();
  gestart = true;
  start();

  return {
    focus: zetFocus,
    zaal(aan) { zaal = aan; zaalT = 0; zaalIndex = 0; zetFocus('overzicht'); },
    // Open het kaartje van een plek: de camera zoomt in en het voorwerp licht op.
    // opzij: het kaartje staat naast het tafereel (gsm) in plaats van erover.
    toonPlek(id, { opzij = false } = {}) {
      open = id && plekken[id] ? id : null;
      kaartOpzij = opzij;
      s.bijPlek?.(open);
      zetDoel(stil);
      if (stil) { zetOplichten(true); teken1(); }
    },
    // Licht een voorwerp op terwijl je met de muis over zijn speld gaat.
    markeer(id) {
      extraMarkering = id;
      if (stil) { zetOplichten(true); teken1(); }
    },
    avond(aan) {
      doelNacht = aan ? 1 : 0;
      if (stil) { nacht = doelNacht; werkLichtBij(1); zetOplichten(true); teken1(); }
    },
    // Het licht traploos zetten: { nacht, schemer, bewolking }, elk van 0 tot 1.
    // Wat je weglaat, blijft staan. direct: meteen, zonder overgang.
    sfeer(w = {}, { direct = false } = {}) {
      if (w.nacht != null) doelNacht = klem(w.nacht, 0, 1);
      if (w.schemer != null) doelSchemer = klem(w.schemer, 0, 1);
      if (w.bewolking != null) doelBewolking = klem(w.bewolking, 0, 1);
      if (direct || stil) {
        nacht = doelNacht; schemer = doelSchemer; bewolking = doelBewolking;
        werkLichtBij(tijd > 3 || stil ? 1 : inUit(klem(tijd / 3, 0, 1)));
        zetOplichten(true);
        if (!loopt && gestart) teken1();
      }
    },
    bliksem,
    // Het licht zoals het nu is, met de bliksem erbij: voor een hemel buiten de 3D.
    licht: () => ({ nacht, schemer, bewolking, flits }),
    // De kijkhoek zelf laten drijven: amplitude in radialen, snelheid per seconde.
    drift(amplitude, snelheid = 0.3) { drift = amplitude == null ? null : { amplitude, snelheid }; },
    // Voor een opname: één stap vooruit in de tijd, en dan het beeld tekenen.
    stap(dt) { werkBij(dt); },
    teken() { teken1(); return canvas; },
    tijd: () => tijd,
    // Na een wijziging buiten de lus (bv. een stempel) in de stille stand opnieuw tekenen.
    herteken() { if (!loopt) teken1(); },
    plekken: Object.values(plekken).map(p => ({ id: p.id, kamer: p.kamer })),
    stop,
    ...(s.api || {}),
    // Alleen om te testen: de tijd vooruitspoelen en meten hoe zwaar één beeld is.
    _test: {
      scene, plekken, cam, wereld,
      spoel(seconden) { for (let t = 0; t < seconden; t += 1 / 30) werkBij(1 / 30); teken1(); },
      meet(n = 30) {
        const gl = renderer.getContext(), px = new Uint8Array(4);
        teken1(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        const t0 = performance.now();
        for (let i = 0; i < n; i++) teken1();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        return { msPerBeeld: +((performance.now() - t0) / n).toFixed(2), tekenbeurten: renderer.info.render.calls, driehoeken: renderer.info.render.triangles, pixelRatio };
      },
    },
  };
}
