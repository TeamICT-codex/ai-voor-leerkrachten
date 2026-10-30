// De sfeer rond de school op de voorpagina: het uur, het seizoen en het weer in
// Dendermonde, en de hemel die erbij hoort. Het uur en het seizoen rekenen we
// zelf uit, daar is geen verbinding voor nodig. Het weer komt van Open-Meteo,
// en alleen in de zaalmodus (zie startpagina.js): een gewone bezoeker stuurt
// zo niets naar een andere server.

export const DENDERMONDE = { lat: 51.0286, lon: 4.1013, tijdzone: 'Europe/Brussels' };

const glad = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const tussen = (a, b, t) => a + (b - a) * t;

// Hoe hoog de zon staat boven Dendermonde, in graden (de benadering van NOAA).
// Negatief: de zon staat onder de horizon.
export function zonnehoogte(datum = new Date(), { lat, lon } = DENDERMONDE) {
  const rad = Math.PI / 180;
  const j = datum.getUTCFullYear();
  const dag = (Date.UTC(j, datum.getUTCMonth(), datum.getUTCDate()) - Date.UTC(j, 0, 0)) / 864e5;
  const uur = datum.getUTCHours() + datum.getUTCMinutes() / 60 + datum.getUTCSeconds() / 3600;
  const g = 2 * Math.PI / 365 * (dag - 1 + (uur - 12) / 24);
  const tijdsvereffening = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const declinatie = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g)
    + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const zonnetijd = uur * 60 + tijdsvereffening + 4 * lon;
  const uurhoek = (zonnetijd / 4 - 180) * rad;
  const cos = Math.sin(lat * rad) * Math.sin(declinatie) + Math.cos(lat * rad) * Math.cos(declinatie) * Math.cos(uurhoek);
  return 90 - Math.acos(Math.min(1, Math.max(-1, cos))) / rad;
}

// Van zonnehoogte naar licht: boven 14° volle dag, daaronder het gouden uur,
// rond de horizon schemering, onder -10° nacht.
export function lichtVanZon(hoogte) {
  return {
    nacht: glad(1, -10, hoogte),
    schemer: glad(14, 1, hoogte) * (1 - glad(-1, -9, hoogte)),
  };
}

function delenInBrussel(datum) {
  const delen = new Intl.DateTimeFormat('en-GB', { timeZone: DENDERMONDE.tijdzone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(datum);
  const waarde = type => Number(delen.find(d => d.type === type)?.value);
  return { jaar: waarde('year'), maand: waarde('month'), dag: waarde('day') };
}

// Het seizoen als getal van 0 tot 4, met de seizoenen van het KMI: de lente
// begint op 1 maart (0), de zomer op 1 juni (1), de herfst op 1 september (2)
// en de winter op 1 december (3). Half april is dus 0,5: volle lente.
export function seizoenOp(datum = new Date()) {
  const { jaar, maand, dag } = delenInBrussel(datum);
  const dagenInMaand = new Date(Date.UTC(jaar, maand, 0)).getUTCDate();
  return (((maand - 3 + 12) % 12) + (dag - 1) / dagenInMaand) / 3;
}

export function klokInDendermonde(datum = new Date()) {
  return new Intl.DateTimeFormat('nl-BE', { timeZone: DENDERMONDE.tijdzone, hour: '2-digit', minute: '2-digit' }).format(datum);
}

// ── het weer ──
// De weercodes van de Wereld Meteorologische Organisatie, in gewone woorden,
// met wat het tafereel ermee doet.
const WEERCODES = {
  0: ['helder', {}],
  1: ['overwegend helder', { bewolking: 0.2 }],
  2: ['half bewolkt', { bewolking: 0.5 }],
  3: ['bewolkt', { bewolking: 0.9 }],
  45: ['mist', { mist: 0.9, bewolking: 0.7 }],
  48: ['mist met rijp', { mist: 0.9, bewolking: 0.7 }],
  51: ['lichte motregen', { regen: 0.25, bewolking: 0.85 }],
  53: ['motregen', { regen: 0.35, bewolking: 0.85 }],
  55: ['dichte motregen', { regen: 0.45, bewolking: 0.9 }],
  56: ['lichte ijzel', { regen: 0.3, bewolking: 0.9 }],
  57: ['ijzel', { regen: 0.45, bewolking: 0.9 }],
  61: ['lichte regen', { regen: 0.4, bewolking: 0.9 }],
  63: ['regen', { regen: 0.65, bewolking: 0.95 }],
  65: ['zware regen', { regen: 1, bewolking: 1 }],
  66: ['lichte ijzel', { regen: 0.4, bewolking: 0.95 }],
  67: ['ijzel', { regen: 0.65, bewolking: 1 }],
  71: ['lichte sneeuw', { sneeuw: 0.4, bewolking: 0.9 }],
  73: ['sneeuw', { sneeuw: 0.7, bewolking: 0.95 }],
  75: ['zware sneeuw', { sneeuw: 1, bewolking: 1 }],
  77: ['sneeuwkorrels', { sneeuw: 0.35, bewolking: 0.9 }],
  80: ['lichte regenbuien', { regen: 0.45, bewolking: 0.75 }],
  81: ['regenbuien', { regen: 0.7, bewolking: 0.85 }],
  82: ['zware regenbuien', { regen: 1, bewolking: 0.95 }],
  85: ['lichte sneeuwbuien', { sneeuw: 0.5, bewolking: 0.8 }],
  86: ['sneeuwbuien', { sneeuw: 0.85, bewolking: 0.9 }],
  95: ['onweer', { regen: 0.8, onweer: 1, bewolking: 1 }],
  96: ['onweer met hagel', { regen: 0.85, onweer: 1, bewolking: 1 }],
  99: ['zwaar onweer met hagel', { regen: 1, onweer: 1, bewolking: 1 }],
};

// Alleen de coördinaten van Dendermonde gaan mee, niets over wie kijkt.
const WEER_ADRES = 'https://api.open-meteo.com/v1/forecast?latitude=51.03&longitude=4.10'
  + '&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m&timezone=Europe%2FBrussels';

export function weerUitMeting(m) {
  if (!m || m.weather_code == null) return null;
  const [beschrijving, effect] = WEERCODES[m.weather_code] || ['', {}];
  const windKmh = Math.round(m.wind_speed_10m ?? 0);
  const bewolking = Math.max(effect.bewolking ?? 0, m.cloud_cover != null ? m.cloud_cover / 100 : 0);
  return {
    temperatuur: Math.round(m.temperature_2m),
    beschrijving,
    windKmh,
    bewolking,
    weer: {
      regen: effect.regen ?? 0, sneeuw: effect.sneeuw ?? 0, mist: effect.mist ?? 0, onweer: effect.onweer ?? 0,
      wind: Math.min(1, windKmh / 50),
    },
  };
}

// Haalt het weer van nu op. Lukt dat niet (geen internet, de dienst ligt plat),
// dan komt er null terug en blijft het tafereel bij het uur en het seizoen.
export async function haalWeer() {
  const stop = new AbortController();
  const wekker = setTimeout(() => stop.abort(), 6000);
  try {
    const antwoord = await fetch(WEER_ADRES, { signal: stop.signal, cache: 'no-store', referrerPolicy: 'no-referrer', credentials: 'omit' });
    if (!antwoord.ok) return null;
    return weerUitMeting((await antwoord.json()).current);
  } catch {
    return null;
  } finally {
    clearTimeout(wekker);
  }
}

// "9 °C · lichte regen · wind 35 km/u", met graden Celsius en een smalle,
// vaste spatie voor het gradenteken.
export function weerZin(w) {
  if (!w) return '';
  const delen = [`${w.temperatuur} °C`];
  if (w.beschrijving) delen.push(w.beschrijving);
  if (w.windKmh >= 25) delen.push(`wind ${w.windKmh} km/u`);
  return delen.join(' · ');
}

// ── een tijdreis ──
// Een jaar in een halve minuut: van een zomerdag via de avond en de nacht naar
// een herfststorm, sneeuw en de lente. Elke sleutel zet waarden op een moment
// (zie sleutelwaarden). Het seizoen telt door: 4,5 is weer lente.
export const TIJDREIS = [
  { t: 0, nacht: 0, schemer: 0, bewolking: 0.1, seizoen: 1.5, regen: 0, sneeuw: 0, sneeuwlaag: 0, mist: 0, wind: 0.15, onweer: 0 },
  { t: 3.5, nacht: 0, schemer: 0 },
  { t: 6, schemer: 1, nacht: 0.15 },
  { t: 8.5, schemer: 0.2, nacht: 1, seizoen: 1.8 },
  { t: 11.5, nacht: 1, schemer: 0, seizoen: 2.4 },
  { t: 13.5, nacht: 0, schemer: 0.5, bewolking: 0.3 },
  { t: 15, schemer: 0, bewolking: 0.8, wind: 0.85, seizoen: 2.5 },
  { t: 17, regen: 0.7, wind: 0.9 },
  { t: 19.5, regen: 0.7, seizoen: 2.9, sneeuwlaag: 0 },
  { t: 21, regen: 0, sneeuw: 0.85, wind: 0.3, bewolking: 0.75, seizoen: 3.5 },
  { t: 23, sneeuwlaag: 1 },
  { t: 25, sneeuw: 0.85, seizoen: 3.6, sneeuwlaag: 1 },
  { t: 26.5, sneeuw: 0, bewolking: 0.15, wind: 0.2, seizoen: 4.4 },
  { t: 28.5, sneeuwlaag: 0 },
  { t: 31, seizoen: 4.5 },
];
export const TIJDREIS_DUUR = 32;

// De waarden op moment t. Een waarde blijft staan tot een sleutel ze verandert,
// en loopt dan zacht over tussen die sleutel en de vorige.
const gevuld = new WeakMap();
function vulAan(sleutels) {
  if (!gevuld.has(sleutels)) {
    let vorige = {};
    gevuld.set(sleutels, sleutels.map(s => (vorige = { ...vorige, ...s })));
  }
  return gevuld.get(sleutels);
}
export function sleutelwaarden(sleutels, t) {
  const vol = vulAan(sleutels);
  const i = vol.findIndex(s => s.t > t);
  if (i === -1) return { ...vol[vol.length - 1] };
  if (i === 0) return { ...vol[0] };
  const a = vol[i - 1], b = vol[i], f = glad(a.t, b.t, t), uit = {};
  for (const naam of Object.keys(b)) uit[naam] = naam === 't' ? t : tussen(a[naam] ?? b[naam], b[naam], f);
  return uit;
}

// ── de hemel ──
// Getekend op een canvas achter het tafereel. Zonder basis tekenen we enkel
// wat er bovenop de gewone daghemel komt (die staat in de stijl); met basis
// ook die daghemel zelf, voor een opname.
const STERREN = [[0.1, 0.12, 1.6], [0.22, 0.28, 1.2], [0.35, 0.09, 1.8], [0.48, 0.22, 1.2], [0.61, 0.06, 1.5], [0.7, 0.3, 1.2],
  [0.92, 0.34, 1.6], [0.06, 0.4, 1.2], [0.28, 0.46, 1.4], [0.77, 0.48, 1.2], [0.15, 0.05, 1.1], [0.42, 0.36, 1.0],
  [0.55, 0.42, 1.3], [0.86, 0.08, 1.2], [0.97, 0.2, 1.0], [0.03, 0.22, 1.3], [0.66, 0.16, 1.0], [0.31, 0.2, 0.9]];

function lijn(ctx, h, stops) {
  const gr = ctx.createLinearGradient(0, 0, 0, h);
  for (const [p, kleur] of stops) gr.addColorStop(p, kleur);
  return gr;
}

export function tekenLucht(ctx, w, h, { nacht = 0, schemer = 0, bewolking = 0, mist = 0, flits = 0 } = {}, { basis = false } = {}) {
  ctx.clearRect(0, 0, w, h);
  const dag = 1 - nacht;
  if (basis) {
    // dezelfde daghemel als .lucht.dag in startpagina.css
    ctx.save();
    ctx.translate(w * 0.7, 0);
    ctx.scale(1, (0.95 * h) / (1.2 * w));
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.2 * w);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#eef7f1'); gr.addColorStop(0.75, '#e3f1e8'); gr.addColorStop(1, '#d8ecdf');
    ctx.fillStyle = gr;
    ctx.fillRect(-w, -h * 3, w * 3, h * 7);
    ctx.restore();
  }
  const laag = (alfa, stijl) => {
    if (alfa <= 0.003) return;
    ctx.globalAlpha = Math.min(1, alfa);
    ctx.fillStyle = stijl;
    ctx.fillRect(0, 0, w, h);
  };
  // het gouden uur: warm, met een gloed aan de kant van de zon
  laag(schemer * dag * 0.9, lijn(ctx, h, [[0, '#f3b48f'], [0.55, '#fbd2b0'], [1, '#fde6d2']]));
  if (schemer * dag > 0.01) {
    ctx.globalAlpha = Math.min(1, schemer * dag * 0.8);
    const gloed = ctx.createRadialGradient(w * 0.95, h * 0.85, 0, w * 0.95, h * 0.85, w * 0.6);
    gloed.addColorStop(0, 'rgba(255,170,110,0.9)'); gloed.addColorStop(1, 'rgba(255,170,110,0)');
    ctx.fillStyle = gloed;
    ctx.fillRect(0, 0, w, h);
  }
  // grijze lucht overdag
  laag(bewolking * dag * 0.78, lijn(ctx, h, [[0, '#c3cbd0'], [1, '#e0e5e7']]));
  // de nacht, met sterren en een maan als het niet te bewolkt is
  laag(nacht, lijn(ctx, h, [[0, '#1c2645'], [0.55, '#303c66'], [1, '#4a5784']]));
  const helder = nacht * (1 - bewolking * 0.9);
  if (helder > 0.01) {
    const s = h / 450;
    ctx.globalAlpha = helder;
    ctx.fillStyle = '#ffffff';
    for (const [x, y, r] of STERREN) { ctx.beginPath(); ctx.arc(x * w, y * h, r * s, 0, Math.PI * 2); ctx.fill(); }
    const mx = w * 0.84, my = h * 0.15, mr = Math.min(w, h) * 0.035;
    const halo = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 2.4);
    halo.addColorStop(0, 'rgba(255,248,216,0.3)'); halo.addColorStop(1, 'rgba(255,248,216,0)');
    ctx.fillStyle = halo; ctx.fillRect(mx - mr * 3, my - mr * 3, mr * 6, mr * 6);
    ctx.fillStyle = '#fff8d8';
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  }
  laag(nacht * bewolking * 0.72, lijn(ctx, h, [[0, '#262d42'], [1, '#3c4460']]));
  // mist: naar onder toe dichter
  if (mist > 0.01) {
    laag(mist * 0.85, lijn(ctx, h, nacht > 0.5
      ? [[0, 'rgba(59,69,102,0.55)'], [1, 'rgba(59,69,102,1)']]
      : [[0, 'rgba(223,228,227,0.55)'], [1, 'rgba(223,228,227,1)']]));
  }
  laag(flits * 0.35, '#ffffff');
  ctx.globalAlpha = 1;
}
