// Voegt de drie inhoudssporen samen en levert de opzoekfuncties waar de app
// mee werkt. De inhoudsbestanden blijven zo pure data.

import { MODULES_BELEID } from './inhoud-beleid.js';
import { MODULES_AI } from './inhoud.js';
import { MODULE_CASUSSEN } from './casussen.js';
import { MODULES_VIBE } from './inhoud-vibe.js';
import { WORKSHOPS, SPOREN } from './workshops.js';
import { GENERIEKE_BLOKKEN, MODULE_ONDERDEEL, SJABLONEN } from './sessies.js';

// Elke module krijgt zijn spoor mee, zodat de app niet hoeft te weten uit
// welk bestand ze komt.
export const MODULES = [
  ...MODULES_BELEID.map((m) => ({ ...m, spoor: 'beleid' })),
  ...[...MODULES_AI, MODULE_CASUSSEN].map((m) => ({ ...m, spoor: 'ai' })),
  ...MODULES_VIBE.map((m) => ({ ...m, spoor: 'vibe' })),
];

export { WORKSHOPS, SPOREN, GENERIEKE_BLOKKEN, SJABLONEN };

export const TOTAAL_LESSEN = MODULES.reduce((som, m) => som + m.lessen.length, 0);

// Hoofdletterongevoelig opzoeken: op het scherm staat "A1", in de URL "a1".
// Wie #/workshop/A1 intikt of dicteert, mag niet op "Niet gevonden" botsen.
export function vindModule(id) {
  const sleutel = String(id).toLowerCase();
  return MODULES.find((m) => m.id.toLowerCase() === sleutel) || null;
}

export function vindWorkshop(id) {
  const sleutel = String(id).toLowerCase();
  return WORKSHOPS.find((w) => w.id.toLowerCase() === sleutel) || null;
}

export function vindSpoor(id) {
  return SPOREN.find((s) => s.id === id) || null;
}

export function modulesVanSpoor(spoorId) {
  return MODULES.filter((m) => m.spoor === spoorId);
}

export function workshopsVanSpoor(spoorId) {
  return WORKSHOPS.filter((w) => w.spoor === spoorId);
}

// In welke workshop komt deze module aan bod? Handig om vanuit een module
// terug te verwijzen naar de sessie waar ze thuishoort.
export function workshopsVoorModule(moduleId) {
  return WORKSHOPS.filter((w) => w.draaiboek.some((b) => b.module === moduleId));
}

// Hoe lang duurt een module? De lessen dragen de minuten, de module telt enkel
// op — zo kunnen de twee niet uit elkaar lopen.
//
// zonderVerdieping geeft de duur van wat er in een sessie of in een bundel
// terechtkomt: verdieping is stof voor achteraf en telt dan niet mee. Let op:
// een module die volledig uit verdieping bestaat (vibe-voorbeeld) geeft zo
// terecht 0 terug.
export function moduleMinuten(module, { zonderVerdieping = false } = {}) {
  if (!module || !module.lessen) return 0;
  return module.lessen.reduce(
    (som, les) => (zonderVerdieping && les.verdieping ? som : som + (les.minuten || 0)),
    0
  );
}

// Kloktijden berekenen vanaf een startuur ("09:00") — het draaiboek zelf
// bevat enkel duurtijden, zodat het voor elk startuur bruikbaar blijft.
export function metKloktijden(draaiboek, startuur) {
  const [uur, min] = startuur.split(':').map(Number);
  let loper = uur * 60 + min;
  return draaiboek.map((blok) => {
    const van = loper;
    loper += blok.minuten;
    return { ...blok, vanMin: van, totMin: loper, van: naarKlok(van), tot: naarKlok(loper) };
  });
}

export function naarKlok(minutenSindsMiddernacht) {
  const m = ((minutenSindsMiddernacht % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

// Welke inhoudsmodules komen in deze workshop aan bod, in volgorde van het
// draaiboek en zonder dubbels.
export function modulesVanWorkshop(workshop) {
  const gezien = new Set();
  const uit = [];
  for (const blok of workshop.draaiboek) {
    if (!blok.module || gezien.has(blok.module)) continue;
    const m = vindModule(blok.module);
    if (!m) continue;
    gezien.add(blok.module);
    uit.push(m);
  }
  return uit;
}

// Elk draaiboekblok van elke workshop, met de sleutel waarmee een sessielink
// ernaar verwijst: "a1.vier-knoppen". Blok-ids zijn enkel uniek binnen hun
// eigen workshop — 'pauze' bestaat zes keer — dus de workshop hoort er altijd
// bij. Gebruikt door de voorraadkolom van de sessiebouwer.
export function alleDraaiboekblokken() {
  const uit = [];
  for (const workshop of WORKSHOPS)
    for (const blok of workshop.draaiboek)
      uit.push({ blok, workshop, sleutel: `${workshop.id}.${blok.id}` });
  return uit;
}

// Hoofdletterongevoelig, net als vindModule en vindWorkshop: wie "A1.PAUZE"
// uit een mail plakt, mag niet op niets botsen. Geeft null bij een sleutel die
// niet (meer) bestaat; de beller meldt dat dan eerlijk.
export function vindDraaiboekblok(sleutel) {
  const gezocht = String(sleutel || '').toLowerCase();
  const punt = gezocht.indexOf('.');
  if (punt < 1) return null;
  const workshop = vindWorkshop(gezocht.slice(0, punt));
  if (!workshop) return null;
  const blokId = gezocht.slice(punt + 1);
  const blok = workshop.draaiboek.find((b) => String(b.id).toLowerCase() === blokId);
  return blok ? { blok, workshop, sleutel: `${workshop.id}.${blok.id}` } : null;
}

export function totaalMinuten(draaiboek) {
  return (draaiboek || []).reduce((som, blok) => som + (blok.minuten || 0), 0);
}

export function heeftPauze(draaiboek) {
  return (draaiboek || []).some((blok) => blok.soort === 'pauze');
}

// Welke lessen van welke module komen in deze reeks onderdelen aan bod?
// Werkt zowel op een draaiboek als op de delen van een sessie: allebei dragen
// ze 'module' en optioneel 'lessen'.
//
// Een module staat enkel in de kaart als ze gedeeltelijk aan bod komt. Komt ze
// érgens volledig aan bod (een onderdeel zonder 'lessen'), dan valt de
// beperking weg en staat ze er niet in. Het resultaat past rechtstreeks in de
// optie lessenPerModule van blokkenVanType.
export function lessenPerModule(onderdelen) {
  const kaart = new Map();
  const volledig = new Set();
  for (const onderdeel of onderdelen || []) {
    const moduleId = onderdeel.module;
    if (!moduleId) continue;
    if (!onderdeel.lessen || !onderdeel.lessen.length) {
      volledig.add(moduleId);
      kaart.delete(moduleId);
      continue;
    }
    if (volledig.has(moduleId)) continue;
    const lessen = kaart.get(moduleId) || new Set();
    for (const lesId of onderdeel.lessen) lessen.add(lesId);
    kaart.set(moduleId, lessen);
  }
  return kaart;
}

// Alle blokken van een bepaald type uit een reeks modules, met vermelding van
// waar ze vandaan komen. Gebruikt voor de promptkaart en de deelnemersbundel.
//
// zonderVerdieping laat de verdiepingslessen weg. De deelnemersbundel is de
// hand-out van één sessie van drie uur: daar hoort niet in wat die sessie niet
// behandelde. De promptkaart toont ze wél — dat is het overzicht van alles.
//
// lessenPerModule knijpt het nog verder dicht: een Map van module-id naar een
// Set van les-ids, zoals lessenPerModule() die maakt. Een module die er niet
// in staat, komt volledig aan bod. Dit is voor de bundel van een zelf
// samengestelde sessie, die maar een deel van een module doet — geef hem niet
// mee voor een van de zes workshops, want die behandelen hun modules volledig
// en hun bundels horen te blijven zoals ze zijn.
export function blokkenVanType(
  modules,
  type,
  { zonderVerdieping = false, lessenPerModule: lessenKaart = null } = {}
) {
  const uit = [];
  for (const m of modules) {
    const toegelaten = lessenKaart ? lessenKaart.get(m.id) : null;
    for (const les of m.lessen) {
      if (zonderVerdieping && les.verdieping) continue;
      if (toegelaten && !toegelaten.has(les.id)) continue;
      for (const blok of les.blokken) {
        if (blok.type === type) uit.push({ blok, module: m, les });
      }
    }
  }
  return uit;
}

// ───────────────────── zelf samengestelde sessie ─────────────────────
// Een sessie is een rij onderdelen in de volgorde waarin je ze geeft. Ze leeft
// volledig in de adresbalk, want zonder server is de link de enige plek waar
// ze kan wonen die je kan bookmarken, mailen of in Smartschool zetten.
//
//   #/sessie?n=<naam>&s=<startuur>&t=<doelduur>&d=<onderdelen>
//
// 'd' is een kommalijst en de volgorde daarin ís de volgorde van de sessie:
//   a1.vier-knoppen   een draaiboekblok, <workshop-id>.<blok-id>
//   m.beleid-kader    een hele module, m.<module-id> (zonder verdieping)
//   pauze             een generiek blok uit sessies.js, met zijn id
//   ...*20            overschrijft de duur van dat onderdeel
//   ...~Eigen titel   geeft een generiek blok een eigen titel
//
// Lezen gebeurt streng: wat niet bestaat, verdwijnt niet stil maar komt in
// 'onbekend' terecht, zodat het scherm kan zeggen wat er wegviel in plaats van
// de hele link af te keuren.

const MIN_MINUTEN = 5;
const MAX_MINUTEN = 240;
const MAX_DOELDUUR = 480;
const MAX_DELEN = 60;
const MAX_TEKST = 60;

// Alles wat uit de URL komt, is door iemand anders getypt en hoort niet thuis
// in de categorie "inhoudsvelden die bewust HTML mogen bevatten". Lengte
// begrenzen, stuurtekens en hoekhaken eruit — en in de weergave gaat het
// daarna nog altijd door esc(), net als elk ander tekstveld.
function tekstVanBuiten(tekst, maxLengte = MAX_TEKST) {
  return String(tekst == null ? '' : tekst)
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .trim()
    .slice(0, maxLengte)
    .trim();
}

// Minuten uit een sessiecode: altijd een veelvoud van vijf tussen 5 en 240.
// Zonder die grens geeft "*5e9" een draaiboek dat in het jaar drieduizend
// eindigt. null betekent: geen geldige overschrijving, hou de standaardduur.
function minutenVanBuiten(tekst) {
  const getal = Number(tekst);
  if (!Number.isFinite(getal) || getal <= 0) return null;
  return Math.min(MAX_MINUTEN, Math.max(MIN_MINUTEN, Math.round(getal / 5) * 5));
}

function doelduurVanBuiten(tekst) {
  const getal = Number(tekst);
  if (!Number.isFinite(getal) || getal <= 0) return 0;
  return Math.min(MAX_DOELDUUR, Math.max(MIN_MINUTEN, Math.round(getal / 5) * 5));
}

function startuurVanBuiten(tekst) {
  const uur = String(tekst || '').trim();
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(uur) ? uur : '';
}

// encodeURIComponent laat * en ~ ongemoeid, en net die twee scheiden in een
// sessiecode de minuten en de titel af. Codeer ze er zelf bij.
function codeerTekst(tekst) {
  return encodeURIComponent(tekst).replace(/\*/g, '%2A').replace(/~/g, '%7E');
}

function decodeerTekst(tekst) {
  try {
    return decodeURIComponent(tekst);
  } catch (e) {
    return tekst; // een halve %-reeks uit een link die ergens is afgekapt
  }
}

// De query van een sessielink, uit welke vorm ze ook komt: een
// URLSearchParams (zo geeft de router ze door), een object { d, s, n, t },
// een volledige hash of querystring, of enkel de kommalijst zelf.
function naarVraag(params) {
  if (!params) return {};
  if (typeof params === 'string') {
    let tekst = params.trim();
    const vraagteken = tekst.indexOf('?');
    if (vraagteken >= 0) tekst = tekst.slice(vraagteken + 1);
    else if (/^[#/]/.test(tekst)) return {}; // '#/sessie' zonder query: lege sessie
    if (!tekst.includes('=')) return { d: tekst };
    return uitParams(new URLSearchParams(tekst));
  }
  if (typeof params.get === 'function') return uitParams(params);
  return { d: params.d, s: params.s, n: params.n, t: params.t };
}

function uitParams(params) {
  return {
    d: params.get('d') || '',
    s: params.get('s') || '',
    n: params.get('n') || '',
    t: params.get('t') || '',
  };
}

function maakDeel(deel) {
  const eigenMinuten = deel.eigenMinuten == null ? null : deel.eigenMinuten;
  return {
    ...deel,
    eigenMinuten,
    eigenTitel: deel.eigenTitel || null,
    minuten: eigenMinuten == null ? deel.standaardMinuten : eigenMinuten,
  };
}

// Eén onderdeel uit een sessiecode lezen: 'a1.vier-knoppen', 'm.beleid-kader',
// 'pauze*10' of 'eigen*20~Woordje van de directeur'. Geeft null bij iets dat
// niet bestaat.
//
// Een deel heeft: soort ('blok' | 'module' | 'generiek'), sleutel, titel,
// minuten (de duur die telt), standaardMinuten, eigenMinuten, eigenTitel,
// blokSoort (instap/uitleg/doen/gesprek/pauze/afronding), module (een
// module-id of null), lessen (les-ids of null = de hele module), workshop
// (een workshop-id of null) en bron (het oorspronkelijke blok, of null).
export function deelUitCode(code) {
  const ruw = String(code || '').trim();
  if (!ruw) return null;

  const slang = ruw.indexOf('~');
  const kop = slang < 0 ? ruw : ruw.slice(0, slang);
  const titelDeel = slang < 0 ? '' : ruw.slice(slang + 1);

  const ster = kop.indexOf('*');
  const sleutel = (ster < 0 ? kop : kop.slice(0, ster)).trim().toLowerCase();
  const eigenMinuten = ster < 0 ? null : minutenVanBuiten(kop.slice(ster + 1));
  if (!sleutel) return null;

  if (sleutel.startsWith('m.')) {
    const module = vindModule(sleutel.slice(2));
    if (!module) return null;
    return maakDeel({
      soort: 'module',
      sleutel: `m.${module.id}`,
      titel: module.titel,
      standaardMinuten: moduleMinuten(module, { zonderVerdieping: true }),
      eigenMinuten,
      blokSoort: 'uitleg',
      module: module.id,
      lessen: null,
      workshop: null,
      bron: null,
    });
  }

  if (sleutel.includes('.')) {
    const gevonden = vindDraaiboekblok(sleutel);
    if (!gevonden) return null;
    return maakDeel({
      soort: 'blok',
      sleutel: gevonden.sleutel,
      titel: gevonden.blok.titel,
      standaardMinuten: gevonden.blok.minuten,
      eigenMinuten,
      blokSoort: gevonden.blok.soort,
      module: gevonden.blok.module || null,
      lessen: gevonden.blok.lessen ? [...gevonden.blok.lessen] : null,
      workshop: gevonden.workshop.id,
      bron: gevonden.blok,
    });
  }

  const generiek = GENERIEKE_BLOKKEN.find((g) => g.id === sleutel);
  if (!generiek) return null;
  const eigenTitel = titelDeel ? tekstVanBuiten(decodeerTekst(titelDeel)) : '';
  return maakDeel({
    soort: 'generiek',
    sleutel: generiek.id,
    titel: eigenTitel || generiek.titel,
    standaardMinuten: generiek.minuten,
    eigenMinuten,
    eigenTitel: eigenTitel || null,
    blokSoort: generiek.soort,
    module: null,
    lessen: null,
    workshop: null,
    bron: generiek,
  });
}

export function deelNaarCode(deel) {
  let code = deel.sleutel;
  if (deel.eigenMinuten != null) code += `*${deel.eigenMinuten}`;
  if (deel.eigenTitel) code += `~${codeerTekst(deel.eigenTitel)}`;
  return code;
}

export function delenNaarCode(delen) {
  return (delen || []).map(deelNaarCode).join(',');
}

// Een sessie lezen. Geeft { naam, startuur, doelduur, delen, onbekend }, waarbij
// onbekend de stukken uit de link bevat die nergens meer op slaan — een blok
// dat hernoemd werd, een module die niet meer bestaat. Het scherm meldt die
// apart en toont de rest gewoon; een halve sessie is altijd beter dan een
// foutmelding.
export function sessieUitCode(params) {
  const vraag = naarVraag(params);
  const delen = [];
  const onbekend = [];
  for (const ruw of String(vraag.d || '').split(',')) {
    const stuk = ruw.trim();
    if (!stuk) continue;
    const deel = delen.length < MAX_DELEN ? deelUitCode(stuk) : null;
    if (deel) delen.push(deel);
    else onbekend.push(tekstVanBuiten(stuk));
  }
  return {
    naam: tekstVanBuiten(vraag.n),
    startuur: startuurVanBuiten(vraag.s),
    doelduur: doelduurVanBuiten(vraag.t),
    delen,
    onbekend,
  };
}

// De sessie terug naar de query van een sessielink, zonder vraagteken.
// Met de hand samengesteld: URLSearchParams.toString() codeert elke komma in d
// naar %2C en maakt de link dubbel zo lang en onleesbaar. Lezen mag wél met
// URLSearchParams, dat geeft de komma's gewoon terug.
export function sessieNaarCode(sessie) {
  const stukken = [];
  if (sessie && sessie.naam) stukken.push(`n=${codeerTekst(sessie.naam)}`);
  if (sessie && sessie.startuur) stukken.push(`s=${sessie.startuur}`);
  if (sessie && sessie.doelduur) stukken.push(`t=${sessie.doelduur}`);
  const d = delenNaarCode(sessie && sessie.delen);
  if (d) stukken.push(`d=${d}`);
  return stukken.join('&');
}

// De volledige hash voor een sessielink; pagina is '', 'draaiboek' of
// 'bundel'. Altijd relatief, nooit met een / ervoor: op GitHub Pages hangt de
// site onder /ai-voor-leerkrachten/.
export function sessieNaarHash(sessie, pagina = '') {
  const pad = pagina ? `#/sessie/${pagina}` : '#/sessie';
  const code = sessieNaarCode(sessie);
  return code ? `${pad}?${code}` : pad;
}

export function sessieMinuten(sessie) {
  return ((sessie && sessie.delen) || []).reduce((som, deel) => som + (deel.minuten || 0), 0);
}

// De modules die deze sessie aanraakt, in volgorde en zonder dubbels.
export function modulesVanSessie(sessie) {
  const gezien = new Set();
  const uit = [];
  for (const deel of (sessie && sessie.delen) || []) {
    if (!deel.module || gezien.has(deel.module)) continue;
    const module = vindModule(deel.module);
    if (!module) continue;
    gezien.add(deel.module);
    uit.push(module);
  }
  return uit;
}

// De workshops waar de gekozen blokken uit komen, in volgorde en zonder
// dubbels. Een sessie van enkel modules of generieke blokken geeft een lege
// lijst — spoor C hangt immers aan geen enkel draaiboek.
export function workshopsVanSessie(sessie) {
  const gezien = new Set();
  const uit = [];
  for (const deel of (sessie && sessie.delen) || []) {
    if (!deel.workshop || gezien.has(deel.workshop)) continue;
    const workshop = vindWorkshop(deel.workshop);
    if (!workshop) continue;
    gezien.add(deel.workshop);
    uit.push(workshop);
  }
  return uit;
}

// Welk spoor kleurt de sessie? Dat met de meeste minuten; bij gelijkspel het
// spoor dat als eerste aan bod komt.
function dominantSpoor(sessie) {
  const perSpoor = new Map();
  for (const deel of (sessie && sessie.delen) || []) {
    const module = deel.module ? vindModule(deel.module) : null;
    if (!module) continue;
    perSpoor.set(module.spoor, (perSpoor.get(module.spoor) || 0) + (deel.minuten || 0));
  }
  let beste = '';
  let hoogste = -1;
  for (const [spoor, minuten] of perSpoor)
    if (minuten > hoogste) {
      beste = spoor;
      hoogste = minuten;
    }
  // Een sessie van enkel generieke blokken hoort bij geen enkel spoor; 'ai'
  // houdt het kruimelpad en het titelblok dan toch leesbaar.
  return beste || 'ai';
}

// Een onderdeel wordt een draaiboekblok met exact dezelfde velden als in
// workshops.js, zodat toonBlok() er niets van merkt.
function naarDraaiboekblok(deel) {
  if (deel.soort === 'blok' && deel.bron) {
    return { ...deel.bron, id: deel.sleutel, minuten: deel.minuten };
  }

  if (deel.soort === 'module') {
    const module = vindModule(deel.module);
    const lessen = module ? module.lessen.filter((les) => !les.verdieping) : [];
    const verdieping = module ? module.lessen.length - lessen.length : 0;
    const tips = [...MODULE_ONDERDEEL.tips];
    if (verdieping === 1) tips.push(MODULE_ONDERDEEL.verdiepingEen);
    else if (verdieping > 1)
      tips.push(MODULE_ONDERDEEL.verdiepingMeer.replace('$N', String(verdieping)));
    const lestitels = lessen.map((les) => les.titel).join(', ');
    return {
      id: deel.sleutel,
      soort: deel.blokSoort,
      minuten: deel.minuten,
      titel: deel.titel,
      wat: !module
        ? ''
        : lestitels
          ? `${module.ondertitel} ${MODULE_ONDERDEEL.lesseninleiding} ${lestitels}.`
          : module.ondertitel,
      tips,
      module: deel.module,
    };
  }

  return {
    id: deel.sleutel,
    soort: deel.blokSoort,
    minuten: deel.minuten,
    titel: deel.titel,
    wat: deel.bron ? deel.bron.wat : '',
    tips: deel.bron ? deel.bron.tips : [],
  };
}

// Een samengestelde sessie krijgt exact de vorm van een workshop, zodat de
// bestaande draaiboek- en bundelweergave er ongewijzigd op draaien — inclusief
// kloktijden, sessietimer, begeleiderstips en afdrukblad.
//
// De functie is puur: dezelfde sessie geeft altijd hetzelfde object. De
// sessietimer rekent daarop.
//
// Wat waar vandaan komt:
//   doelen          uit de modules die je écht doet, niet uit de bronworkshop
//   benodigdheden   het 'klaarzetten' van die modules, ontdubbeld — spoor B
//                   herhaalt die grondregel bewust per module
//   valkuilen       uit de bronworkshops; een sessie van losse modules heeft er
//                   dus geen
//   doelgroep en voorkennis alleen bij precies één bronworkshop; anders zouden
//                   ze over iets anders gaan dan wat de sessie doet
export function bouwSessieWorkshop(sessie) {
  const delen = (sessie && sessie.delen) || [];
  const draaiboek = delen.map(naarDraaiboekblok);
  const modules = modulesVanSessie(sessie);
  const bronnen = workshopsVanSessie(sessie);
  const minuten = totaalMinuten(draaiboek);
  const enkeleBron = bronnen.length === 1 ? bronnen[0] : null;

  let ondertitel;
  if (!draaiboek.length) ondertitel = 'Nog niets gekozen.';
  else if (bronnen.length)
    ondertitel = `${minuten} minuten, samengesteld uit ${bronnen.map((w) => w.code).join(', ')}.`;
  else if (modules.length) ondertitel = `${minuten} minuten, samengesteld uit losse modules.`;
  else ondertitel = `${minuten} minuten.`;

  return {
    id: 'sessie',
    code: 'SESSIE',
    // Het merkteken waaraan de weergave een samengestelde sessie herkent: enkel
    // hier mag de bundel op lessen filteren. De zes workshops behandelen hun
    // modules volledig en hun bundels horen te blijven zoals ze zijn.
    samengesteld: true,
    spoor: dominantSpoor(sessie),
    titel: (sessie && sessie.naam) || 'Eigen sessie',
    ondertitel,
    doelgroep: enkeleBron ? enkeleBron.doelgroep : '',
    voorkennis: enkeleBron ? enkeleBron.voorkennis : '',
    groepsgrootte: '',
    doelen: [...new Set(modules.flatMap((m) => m.doelen || []))],
    benodigdheden: [...new Set(modules.flatMap((m) => m.klaarzetten || []))],
    valkuilen: [...new Set(bronnen.flatMap((w) => w.valkuilen || []))],
    draaiboek,
  };
}
