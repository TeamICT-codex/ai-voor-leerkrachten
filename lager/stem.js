// Voorlezen in Leerlichtjes. Elke tekst is vooraf ingelezen met twee stemmen
// van Gemini (Google): een juf en een meester. Hier spelen we alleen die
// geluidsbestanden af, uit de map stem/ naast dit bestand: tijdens de les gaat
// er niets naar een AI-dienst. Staat een tekst niet in de lijst, of lukt het
// afspelen niet, dan leest de stem van de browser voor (als het toestel een
// Nederlandse stem heeft).
//
// Opnieuw inlezen na een tekstwijziging: zie stem/LEESMIJ.md. Dit bestand raakt
// bij het laden de pagina niet aan, want stem/verzamel.mjs leest het in node.

const MAP = new URL('./stem/', import.meta.url);
const STEMMEN = ['juf', 'meester'];
const BEWAAR = 'leerlichtjes.stem';
// Het tempo van de browserstem: rustig, voor kinderen die nog leren lezen.
const TEMPO = 0.9;

// Hoe de alinea's van Ontdek of Praat samen één voorleestekst worden. De knop
// "Lees voor" en stem/verzamel.mjs gebruiken allebei deze functie.
export const voorleesTekst = teksten => teksten.join(' ');

// ── de lijst met ingelezen teksten: één keer laden ──
let lijst = null;
function laadLijst() {
  lijst ??= fetch(new URL('lijst.json', MAP))
    .then(r => (r.ok ? r.json() : null))
    .then(j => new Map(Object.entries(j?.teksten ?? {})))
    .catch(() => new Map());
  return lijst;
}

// ── de juf of de meester, bewaard op dit toestel ──
let gekozen = null;
export function stemNu() {
  if (!gekozen) {
    let bewaard = null;
    try { bewaard = localStorage.getItem(BEWAAR); } catch { /* privévenster: dan de juf */ }
    gekozen = STEMMEN.includes(bewaard) ? bewaard : 'juf';
  }
  return gekozen;
}
export function kiesStem(naam) {
  if (!STEMMEN.includes(naam)) return;
  stop();
  gekozen = naam;
  try { localStorage.setItem(BEWAAR, naam); } catch { /* geen opslag: de keuze geldt voor deze keer */ }
  if (vooraf.length) laadVooraf(vooraf);
}
const adres = (sleutel, stem = stemNu()) => new URL(`${stem}/${sleutel}.mp3`, MAP).href;

// ── vooraf laden: zo klinkt een tik op een kaartje meteen ──
const geladen = new Map();   // adres van de mp3 → adres van de kopie in het geheugen
const onderweg = new Set();
let vooraf = [];
export async function laadVooraf(teksten) {
  vooraf = teksten;
  const kaart = await laadLijst();
  const teLaden = [...new Set(teksten.map(t => kaart.get(t)).filter(Boolean).map(s => adres(s)))]
    .filter(a => !geladen.has(a) && !onderweg.has(a));
  teLaden.forEach(a => onderweg.add(a));
  // Hoogstens vier tegelijk: een schoolnetwerk is niet altijd snel.
  const werker = async () => {
    for (let a = teLaden.shift(); a; a = teLaden.shift()) {
      try {
        const r = await fetch(a);
        if (r.ok) geladen.set(a, URL.createObjectURL(await r.blob()));
      } catch { /* dan laadt de speler het bestand zelf, als het zover is */ }
      onderweg.delete(a);
    }
  };
  await Promise.all([werker(), werker(), werker(), werker()]);
}

// ── weten of er voorgelezen kan worden ──
// Roept terug, meteen en telkens het verandert, met { opnames, kan }: of de
// ingelezen stemmen er zijn, en of er voorgelezen kan worden (met die stemmen,
// of anders met een Nederlandse stem van de browser).
function browserStem() {
  const stemmen = globalThis.speechSynthesis?.getVoices() ?? [];
  return stemmen.find(v => v.lang === 'nl-BE') || stemmen.find(v => v.lang?.startsWith('nl')) || null;
}
export function volgVoorlezen(terug) {
  let opnames = false;
  const meld = () => terug({ opnames, kan: opnames || !!browserStem() });
  meld();
  laadLijst().then(kaart => { opnames = kaart.size > 0; meld(); });
  globalThis.speechSynthesis?.addEventListener?.('voiceschanged', meld);
}

// ── voorlezen ──
// Eén Audio-element voor alles: op een iPad mag een element dat al eens speelde
// na een tik, daarna ook zonder tik verder spelen.
let speler = null;
let afronden = null;  // beëindigt wat er nu klinkt
let rij = Promise.resolve();
let beurt = 0;        // stop() telt op: wat nog wacht, valt dan weg
let open = 0;         // hoeveel uitingen er nog klinken of wachten
const gemeld = new Set();

// Leest een tekst voor en geeft een belofte terug die afloopt als hij
// uitgesproken is (of meteen, als er niet voorgelezen kan worden).
// erachter: wacht tot wat er nu voorgelezen wordt, gedaan is. Zonder erachter
// stopt wat er nu klinkt.
export function zeg(tekst, { erachter = false } = {}) {
  if (!erachter) stop();
  const mijn = beurt;
  open++;
  const klaar = rij.then(() => (mijn === beurt ? speel(tekst, mijn) : undefined)).catch(() => {}).finally(() => { open--; });
  rij = klaar;
  return klaar;
}
export function stop() {
  beurt++;
  afronden?.();
  speler?.pause();
  globalThis.speechSynthesis?.cancel();
}
export const bezig = () => open > 0;

async function speel(tekst, mijn) {
  const sleutel = (await laadLijst()).get(tekst);
  if (mijn !== beurt) return;
  if (sleutel && typeof Audio === 'function') {
    const gelukt = await speelOpname(adres(sleutel), tekst);
    if (gelukt || mijn !== beurt) return;
  } else if (!sleutel && !gemeld.has(tekst)) {
    gemeld.add(tekst);
    console.info('Leerlichtjes: deze tekst is nog niet ingelezen (zie lager/stem/LEESMIJ.md):', tekst);
  }
  await spreekMetBrowser(tekst);
}

// Speelt een mp3 af. Geeft true terug als hij speelde (tot het einde, of tot
// stop()), en false als hij niet kon starten: dan neemt de browserstem over.
function speelOpname(bron, tekst) {
  speler ??= new Audio();
  const s = speler;
  return new Promise(klaar => {
    let actief = true, gestart = false, wekker = 0;
    const einde = gelukt => {
      if (!actief) return;
      actief = false;
      clearTimeout(wekker);
      if (afronden === stopDeze) afronden = null;
      klaar(gelukt);
    };
    const stopDeze = () => { s.pause(); einde(true); };
    afronden = stopDeze;
    s.onended = () => einde(true);
    s.onerror = () => einde(gestart);
    s.src = geladen.get(bron) || bron;
    s.play().then(() => {
      gestart = true;
      // Meldt de browser het einde niet, dan wachten we niet langer dan de opname duurt.
      const duur = Number.isFinite(s.duration) && s.duration > 0 ? s.duration * 1000 + 1500 : 1500 + tekst.length * 90;
      wekker = setTimeout(() => einde(true), duur);
    }, () => einde(false));
  });
}

// De stem van de browser, als vangnet. Sommige browsers melden het einde niet:
// daarom wachten we nooit langer dan de zin ongeveer duurt.
function spreekMetBrowser(tekst) {
  const v = browserStem();
  if (!v) return Promise.resolve();
  const u = new SpeechSynthesisUtterance(tekst);
  u.voice = v;
  u.lang = v.lang;
  u.rate = TEMPO;
  return new Promise(klaar => {
    let actief = true, wekker = 0;
    const einde = () => {
      if (!actief) return;
      actief = false;
      clearTimeout(wekker);
      if (afronden === stopDeze) afronden = null;
      klaar();
    };
    const stopDeze = () => { speechSynthesis.cancel(); einde(); };
    afronden = stopDeze;
    u.onend = u.onerror = einde;
    wekker = setTimeout(einde, 1500 + tekst.length * 90);
    speechSynthesis.speak(u);
  });
}
