// De tekenherkenner van de bibliotheek: een heel kleine computer die leert van
// voorbeelden. Hij maakt van elke tekening een raster van 24 bij 24 hokjes,
// legt dat naast elk voorbeeld en kiest het voorbeeld dat er het meest op
// lijkt. Zo werkt een echte beeldherkenner niet tot in de details, maar het
// idee is hetzelfde: hij kent alleen wat hij uit voorbeelden leerde.
//
// Zonder DOM, zodat je hem ook buiten de browser kunt testen.

const N = 24;

// Een tekening is een lijst lijnen; een lijn is een lijst punten [x, y].
export function kenmerken(lijnen) {
  const punten = lijnen.flat();
  if (punten.length < 2) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of punten) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const b = maxX - minX, h = maxY - minY, s = Math.max(b, h);
  if (s < 8) return null;
  // De tekening in het midden, zonder ze uit te rekken: een langwerpige vis
  // blijft langwerpig.
  const ruimte = N - 4;
  const dx = 2 + (ruimte - (b / s) * ruimte) / 2, dy = 2 + (ruimte - (h / s) * ruimte) / 2;
  const naar = ([x, y]) => [dx + ((x - minX) / s) * ruimte, dy + ((y - minY) / s) * ruimte];
  const raster = new Float32Array(N * N);
  const stip = (x, y) => {
    for (let j = Math.floor(y - 1); j <= Math.ceil(y + 1); j++) {
      for (let i = Math.floor(x - 1); i <= Math.ceil(x + 1); i++) {
        if (i < 0 || j < 0 || i >= N || j >= N) continue;
        const d = Math.hypot(i + 0.5 - x, j + 0.5 - y);
        if (d < 1.1) raster[j * N + i] = 1;
      }
    }
  };
  for (const lijn of lijnen) {
    if (lijn.length === 1) { stip(...naar(lijn[0])); continue; }
    for (let k = 1; k < lijn.length; k++) {
      const [x0, y0] = naar(lijn[k - 1]), [x1, y1] = naar(lijn[k]);
      const stappen = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
      for (let t = 0; t <= stappen; t++) stip(x0 + (x1 - x0) * t / stappen, y0 + (y1 - y0) * t / stappen);
    }
  }
  // Twee keer vervagen: zo telt een lijn die net een hokje opzij ligt nog mee.
  let v = raster;
  for (let keer = 0; keer < 2; keer++) {
    const w = new Float32Array(N * N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let som = 0;
      for (let jj = -1; jj <= 1; jj++) for (let ii = -1; ii <= 1; ii++) {
        const a = i + ii, c = j + jj;
        if (a >= 0 && c >= 0 && a < N && c < N) som += v[c * N + a];
      }
      w[j * N + i] = som / 9;
    }
    v = w;
  }
  let lengte = 0;
  for (const x of v) lengte += x * x;
  lengte = Math.sqrt(lengte) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= lengte;
  return v;
}

export function gelijkenis(a, b) {
  let som = 0;
  for (let i = 0; i < a.length; i++) som += a[i] * b[i];
  return som;
}

// voorbeelden: [{ soort, kenmerk }]. Geeft de soort van het voorbeeld dat het
// meest lijkt, welk voorbeeld dat was, en hoe zeker de herkenner is.
export function raad(voorbeelden, kenmerk) {
  let beste = -1, besteGelijk = -Infinity;
  const perSoort = new Map();
  voorbeelden.forEach((v, i) => {
    const g = gelijkenis(v.kenmerk, kenmerk);
    if (g > besteGelijk) { besteGelijk = g; beste = i; }
    if (!perSoort.has(v.soort) || g > perSoort.get(v.soort)) perSoort.set(v.soort, g);
  });
  if (beste < 0) return null;
  const soort = voorbeelden[beste].soort;
  let ander = -Infinity;
  for (const [s, g] of perSoort) if (s !== soort && g > ander) ander = g;
  // Zeker als het voorbeeld goed lijkt én duidelijk beter dan de andere soort.
  const verschil = ander === -Infinity ? 1 : besteGelijk - ander;
  const zeker = besteGelijk > 0.62 && verschil > 0.06 ? 'zeker' : besteGelijk > 0.5 && verschil > 0.025 ? 'beetje' : 'twijfel';
  return { soort, beste, gelijk: besteGelijk, verschil, zeker };
}

// Voorbeeldtekeningen voor de knop "Gebruik onze voorbeelden", met een beetje
// toeval zodat geen twee dezelfde zijn. zaad bepaalt het toeval.
export function voorbeeldTekening(soort, zaad = 1) {
  let z = zaad * 9301 + 49297;
  const r = () => { z = (z * 9301 + 49297) % 233280; return z / 233280; };
  const wieg = (a) => (r() - 0.5) * a;
  const cx = 160 + wieg(30), cy = 120 + wieg(20), s = 0.85 + r() * 0.35;
  const p = (x, y) => [cx + (x + wieg(5)) * s, cy + (y + wieg(5)) * s];
  const cirkel = (mx, my, rx, ry, van = 0, tot = Math.PI * 2, n = 22) =>
    Array.from({ length: n + 1 }, (_, i) => { const a = van + (tot - van) * i / n; return p(mx + Math.cos(a) * rx, my + Math.sin(a) * ry); });
  if (soort === 'kat') {
    const lijnen = [
      cirkel(0, 0, 42 + wieg(8), 38 + wieg(8)),
      [p(-34, -20), p(-28, -66), p(-8, -38)],
      [p(34, -20), p(28, -66), p(8, -38)],
      [p(-15, -8), p(-13, -6)], [p(15, -8), p(13, -6)],
      [p(-5, 8), p(5, 8), p(0, 14), p(-5, 8)],
    ];
    for (const kant of [-1, 1]) for (const dy of [-4, 6, 16]) lijnen.push([p(kant * 12, 12), p(kant * 56, 10 + dy)]);
    return lijnen;
  }
  // een vis, de ene keer naar links, de andere keer naar rechts
  const kant = r() < 0.5 ? 1 : -1;
  const lijnen = [
    cirkel(0, 0, 52 + wieg(10), 26 + wieg(8)),
    [p(kant * 48, 0), p(kant * 82, -26), p(kant * 82, 26), p(kant * 48, 0)],
    [p(-kant * 30, -6), p(-kant * 28, -4)],
    [p(-kant * 4, -24), p(kant * 14, -40), p(kant * 22, -22)],
  ];
  return lijnen;
}
