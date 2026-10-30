// De filmmodus: een rondleiding van een halve minuut langs de school, voor de
// teaser. Ze speelt af met ?film achter het adres van de voorpagina. Met
// ?film&opname neemt ze beeld per beeld op en stuurt elk beeld naar
// teaser/opname.py, dat er met de muziek een MP4 van maakt (zie teaser/LEESMIJ.md).
// ?film=vierkant en ?film=staand geven een vierkant en een staand formaat.
//
// Elk beeld wordt op een vast moment berekend, nooit op de klok: zo hapert de
// film niet, ook niet op een trage computer.
import { maakDiorama } from './diorama.js';
import { tekenLucht, sleutelwaarden } from './sfeer.js';
import { F, rond } from '../gedeeld/diorama-kern.js';

// Het adres op de eindkaart. Verandert het adres bij de lancering, pas het dan
// hier aan en neem opnieuw op.
const ADRES = 'teamict-codex.github.io/ai-voor-leerkrachten';
const FORMATEN = { breed: [1920, 1080], vierkant: [1080, 1080], staand: [1080, 1920] };
const FPS = 30, DUUR = 30;
// Eén maat van de muziek duurt 2,25 seconden; elk shot duurt twee maten.
const MAAT = 2.25;

// Wat de camera toont.
const SHOTS = [
  { van: 0, focus: 'overzicht', drift: 0.08 },
  { van: 2 * MAAT, focus: 'klas', drift: 0.05 },
  { van: 4 * MAAT, focus: 'directie', drift: 0.05 },
  { van: 6 * MAAT, focus: 'leerling', drift: 0.05 },
  { van: 8 * MAAT, focus: 'lager', drift: 0.06 },
  { van: 10 * MAAT, focus: 'overzicht', drift: 0.22 },
];

// De titels. kleur is die van het stipje bij elke doelgroep op de voorpagina.
const TITELS = [
  { van: 1.2, tot: 2 * MAAT - 0.3, label: 'Het leercollectief', kleur: '#126425', titel: 'AI op school', sub: 'Samen zetten we de eerste stap.' },
  { van: 2 * MAAT + 0.5, tot: 4 * MAAT - 0.3, label: 'Leerkrachten', kleur: '#5fa9c9', titel: 'AI in je klas', sub: 'Zes workshops en een leeromgeving' },
  { van: 4 * MAAT + 0.5, tot: 6 * MAAT - 0.3, label: 'Directies', kleur: '#e9dc3a', titel: 'Het kader', sub: 'Wet, privacy en schoolbeleid, helder op een rij' },
  { van: 6 * MAAT + 0.5, tot: 8 * MAAT - 0.3, label: 'Leerlingen', kleur: '#f2a76b', titel: 'AI-wijs', sub: 'Van de 1ste tot de 3de graad secundair' },
  { van: 8 * MAAT + 0.5, tot: 10 * MAAT - 0.3, label: 'Lager', kleur: '#ffcf3a', titel: 'Leerlichtjes', sub: 'Drie werelden voor het digibord' },
  { van: 10 * MAAT + 0.5, tot: 12 * MAAT - 0.4, label: 'Voor iedereen in de school', kleur: '#126425', titel: 'Begin vandaag', sub: 'Je hoeft nog niets van AI te kennen.' },
];
const SLOT = 12 * MAAT; // vanaf hier de eindkaart

// Een jaar in een halve minuut. Het weer zie je alleen buiten, dus de seizoenen
// vallen in de buitenshots: lente bij de opening, een herfststorm bij de kleine
// school, en sneeuw met de lichten aan op het einde. Binnen is het zomer, met
// laag avondlicht bij de directie. (Zie sleutelwaarden in sfeer.js.)
const SFEER = [
  { t: 0, nacht: 0, schemer: 0, bewolking: 0.05, seizoen: 0.5, regen: 0, sneeuw: 0, sneeuwlaag: 0, mist: 0, wind: 0.15, onweer: 0 },
  { t: 2 * MAAT, seizoen: 0.6 },
  { t: 2 * MAAT + 0.8, seizoen: 1.5 },
  { t: 4 * MAAT + 0.6, schemer: 0 },
  { t: 6 * MAAT - 0.4, schemer: 0.55 },
  { t: 6 * MAAT + 0.6, schemer: 0, seizoen: 2.5, bewolking: 0.4 },
  { t: 8 * MAAT, wind: 0.3 },
  { t: 8 * MAAT + 0.6, wind: 0.9, regen: 0.6, bewolking: 0.8 },
  { t: 10 * MAAT - 0.3, seizoen: 2.6 },
  { t: 10 * MAAT + 0.5, regen: 0, sneeuw: 0.8, wind: 0.3, bewolking: 0.65, seizoen: 3.5, sneeuwlaag: 0.85 },
  { t: 11 * MAAT, schemer: 1, nacht: 0.1 },
  { t: 12 * MAAT, schemer: 0.1, nacht: 1, sneeuw: 0.5, bewolking: 0.3 },
  { t: DUUR, schemer: 0, sneeuw: 0.4, seizoen: 3.6, sneeuwlaag: 0.9 },
];

const zacht = x => x * x * (3 - 2 * x);
const klem = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

function laadBeeld(src) {
  return new Promise((ok, fout) => { const b = new Image(); b.onload = () => ok(b); b.onerror = fout; b.src = src; });
}

export async function draaiFilm({ opname = false, formaat = 'breed' } = {}) {
  const [B, H] = FORMATEN[formaat] || FORMATEN.breed;
  const s = Math.min(B, H) / 1080;
  document.body.classList.add('film');
  const vak = document.createElement('div');
  vak.className = 'filmvak';
  const doek = document.createElement('canvas');
  doek.className = 'filmdoek';
  doek.width = B; doek.height = H;
  const status = document.createElement('p');
  status.className = 'filmstatus';
  // Het 3D-canvas staat buiten beeld: elk beeld wordt op het filmdoek samengesteld.
  const verstopt = document.createElement('div');
  verstopt.className = 'film-3d';
  const doek3d = document.createElement('canvas');
  verstopt.append(doek3d);
  vak.append(doek, status, verstopt);
  document.body.append(vak);
  const ctx = doek.getContext('2d');

  status.textContent = 'De school wordt opgebouwd…';
  await Promise.all([document.fonts?.load(F(700, 80)), document.fonts?.load(F(600, 40)), document.fonts?.load(F(500, 40))].map(p => p?.catch(() => {})));
  const logo = await laadBeeld(new URL('../gedeeld/logo-leercollectief.svg', import.meta.url).href).catch(() => null);
  const dio = await maakDiorama(doek3d, { opname: { breedte: B, hoogte: H } });
  // Het lichtje begint bij de directie, zodat het op de klas aankomt samen met de
  // camera; op dit tempo staat elk antwoord af voor het shot wisselt.
  dio.tempo(2);
  dio.eersteVerhaal('directie');

  let shot = -1;
  function zetMoment(t) {
    const i = SHOTS.findLastIndex(sh => sh.van <= t);
    if (i !== shot) { shot = i; dio.focus(SHOTS[i].focus); dio.drift(SHOTS[i].drift, i === SHOTS.length - 1 ? 0.28 : 0.35); }
    const v = sleutelwaarden(SFEER, t);
    dio.sfeer({ nacht: v.nacht, schemer: v.schemer, bewolking: v.bewolking }, { direct: true });
    dio.weer({ regen: v.regen, sneeuw: v.sneeuw, mist: v.mist, wind: v.wind, onweer: v.onweer, sneeuwlaag: v.sneeuwlaag });
    dio.seizoen(v.seizoen % 4, { direct: true });
  }

  function kaartje(k, t) {
    const inn = zacht(klem((t - k.van) / 0.4)), uit = zacht(klem((k.tot - t) / 0.35));
    const a = Math.min(inn, uit);
    if (a <= 0) return;
    // Een tikje kleiner dan de eindkaart: het lokaal erachter moet zichtbaar blijven.
    const s = Math.min(B, H) / 1080 * 0.82;
    const pad = 46 * s, marge = (formaat === 'staand' ? 80 : 84) * s;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = F(600, 34 * s); const bLabel = ctx.measureText(k.label).width + 38 * s;
    ctx.font = F(700, 92 * s); const bTitel = ctx.measureText(k.titel).width;
    ctx.font = F(500, 40 * s); const bSub = ctx.measureText(k.sub).width;
    const bk = Math.max(bLabel, bTitel, bSub) + pad * 2, hk = 238 * s;
    const x = marge, y = H - marge - hk - (formaat === 'staand' ? 220 * s : 0) + (1 - inn) * 34 * s;
    ctx.shadowColor = 'rgba(13, 40, 20, 0.18)'; ctx.shadowBlur = 44 * s; ctx.shadowOffsetY = 10 * s;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    rond(ctx, x, y, bk, hk, 34 * s); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = k.kleur;
    ctx.beginPath(); ctx.arc(x + pad + 11 * s, y + pad + 12 * s, 11 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5a6168'; ctx.font = F(600, 34 * s);
    ctx.fillText(k.label, x + pad + 34 * s, y + pad + 24 * s);
    ctx.fillStyle = '#1f2328'; ctx.font = F(700, 92 * s);
    ctx.fillText(k.titel, x + pad - 4 * s, y + pad + 118 * s);
    ctx.fillStyle = '#126425'; ctx.font = F(500, 40 * s);
    ctx.fillText(k.sub, x + pad, y + pad + 172 * s);
    ctx.restore();
  }

  function eindkaart(t) {
    const a = zacht(klem((t - SLOT) / 0.7));
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a * 0.35;
    ctx.fillStyle = '#101a33'; ctx.fillRect(0, 0, B, H);
    ctx.globalAlpha = a;
    const bk = Math.min(B - 120 * s, 1000 * s), hk = 560 * s;
    const x = (B - bk) / 2, y = (H - hk) / 2 + (1 - a) * 30 * s;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; ctx.shadowBlur = 60 * s; ctx.shadowOffsetY = 14 * s;
    ctx.fillStyle = '#ffffff';
    rond(ctx, x, y, bk, hk, 44 * s); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.textAlign = 'center';
    const mx = B / 2;
    if (logo) { const lb = 380 * s, lh = lb * 167.12 / 657.1; ctx.drawImage(logo, mx - lb / 2, y + 64 * s, lb, lh); }
    ctx.fillStyle = '#1f2328'; ctx.font = F(700, 104 * s);
    ctx.fillText('AI op school', mx, y + 300 * s);
    ctx.fillStyle = '#4d5459'; ctx.font = F(500, 40 * s);
    ctx.fillText('Voor directies, leerkrachten en leerlingen', mx, y + 368 * s);
    ctx.fillStyle = '#126425'; ctx.font = F(600, 38 * s);
    ctx.fillText(ADRES, mx, y + 470 * s);
    ctx.restore();
  }

  function stelSamen(t) {
    const licht = { ...dio.licht(), mist: dio.weerNu().mist };
    tekenLucht(ctx, B, H, licht, { basis: true });
    ctx.drawImage(dio.teken(), 0, 0, B, H);
    for (const k of TITELS) kaartje(k, t);
    eindkaart(t);
  }

  const totaal = Math.round(DUUR * FPS);
  // Een verzoek dat mislukt, gaat nog eens: één verloren beeld mag de opname niet stilleggen.
  async function stuur(adres, body) {
    for (let poging = 1; ; poging++) {
      try {
        const antwoord = await fetch(adres, { method: 'POST', body });
        if (antwoord.ok) return antwoord;
        throw new Error(`status ${antwoord.status}`);
      } catch (fout) {
        if (poging >= 6) throw fout;
        await new Promise(ok => setTimeout(ok, 300 * poging));
      }
    }
  }
  if (opname) {
    // Elk beeld als JPEG naar de opnameserver, één voor één.
    await stuur('/opname/begin');
    for (let i = 0; i < totaal; i++) {
      const t = i / FPS;
      zetMoment(t);
      dio.stap(1 / FPS);
      stelSamen(t);
      const blob = await new Promise(ok => doek.toBlob(ok, 'image/jpeg', 0.94));
      await stuur(`/opname/beeld?n=${i}`, blob);
      if (i % 15 === 0) status.textContent = `Opnemen: beeld ${i + 1} van ${totaal}`;
    }
    status.textContent = 'Alle beelden zijn binnen. De film wordt gemaakt…';
    const antwoord = await stuur('/opname/klaar', JSON.stringify({ fps: FPS, formaat })).then(r => r.json()).catch(() => null);
    status.textContent = antwoord?.bestand ? `Klaar: ${antwoord.bestand}` : 'De film kon niet gemaakt worden: kijk in het venster van opname.py.';
    document.body.dataset.opname = antwoord?.bestand ? 'klaar' : 'fout';
    return;
  }

  // Afspelen: dertig beelden per seconde, en na de laatste opnieuw van voren.
  // Met &t=12 begint ze op seconde 12: alles ervoor wordt snel doorgerekend.
  status.textContent = 'Filmmodus · ?film&opname neemt op';
  let i = 0, vorige = 0;
  const vanaf = Math.min(totaal - 1, Math.round((Number(new URLSearchParams(location.search).get('t')) || 0) * FPS));
  for (; i < vanaf; i++) { zetMoment(i / FPS); dio.stap(1 / FPS); }
  if (vanaf) dio.teken();
  // &stil-beeld: alleen het beeld op moment t, om rustig te bekijken.
  if (new URLSearchParams(location.search).has('stil-beeld')) {
    zetMoment(i / FPS); dio.stap(1 / FPS); stelSamen(i / FPS);
    status.textContent = `Beeld op ${(i / FPS).toFixed(2)} s`;
    return;
  }
  function speel(nu) {
    if (nu - vorige >= 1000 / FPS - 2) {
      vorige = nu;
      const t = i / FPS;
      zetMoment(t);
      dio.stap(1 / FPS);
      stelSamen(t);
      i++;
      if (i >= totaal) location.reload();
    }
    requestAnimationFrame(speel);
  }
  requestAnimationFrame(speel);
}
