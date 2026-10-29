// De volledige app: router, weergave en de kleine beetjes interactie.
// Geen build-stap, geen afhankelijkheden — gewoon een ES-module.

import {
  MODULES,
  WORKSHOPS,
  SPOREN,
  GENERIEKE_BLOKKEN,
  SJABLONEN,
  TOTAAL_LESSEN,
  vindModule,
  vindWorkshop,
  vindSpoor,
  modulesVanSpoor,
  workshopsVanSpoor,
  workshopsVoorModule,
  modulesVanWorkshop,
  blokkenVanType,
  metKloktijden,
  naarKlok,
  moduleMinuten,
  alleDraaiboekblokken,
  totaalMinuten,
  heeftPauze,
  lessenPerModule,
  deelUitCode,
  deelNaarCode,
  sessieUitCode,
  sessieNaarCode,
  sessieNaarHash,
  sessieMinuten,
  bouwSessieWorkshop,
} from './cursus.js';
import { GIDS_SECTIES, FAQ_GROEPEN } from './gids.js';

// ───────────────────────────── opslag ─────────────────────────────
// Alles in een try/catch: in een privévenster of met geblokkeerde cookies
// gooit localStorage, en dan mag de app niet stukvallen.

const SLEUTEL = 'ai-voor-leerkrachten';

// Hoeveel tekens een bewaarde sessiecode mag innemen. Zestig onderdelen passen
// er ruim in; meer is geknoei en gooien we weg in plaats van terug te tonen.
const MAX_SESSIECODE = 900;

function laadOpslag() {
  const leeg = {
    begeleider: false,
    startuur: '09:00',
    afgewerkt: [],
    sessieStart: null,
    sessie: '',
  };
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    if (!ruw) return leeg;
    const data = JSON.parse(ruw);
    const samen = {
      ...leeg,
      ...data,
      // De laatst samengestelde sessie, als querystring. Eén string, zodat een
      // oudere of geknoeide waarde hoogstens een lege bouwer oplevert.
      sessie: typeof data.sessie === 'string' ? data.sessie.slice(0, MAX_SESSIECODE) : '',
      // Enkel een echt uur "HH:MM" mag erin: een oude of geknoeide waarde zou
      // de kloktijdberekening laten stuklopen en de draaiboekpagina leeg laten.
      startuur: /^([01]\d|2[0-3]):[0-5]\d$/.test(data.startuur) ? data.startuur : leeg.startuur,
      afgewerkt: Array.isArray(data.afgewerkt) ? data.afgewerkt : [],
    };
    // Een sessie van gisteren is geen sessie meer: enkel een geldig tijdstip
    // van hoogstens zes uur oud telt nog mee (workshop van 3 uur, ruim genomen).
    const ouderdom = Date.now() - samen.sessieStart;
    if (typeof samen.sessieStart !== 'number' || ouderdom < 0 || ouderdom > 6 * 3600000)
      samen.sessieStart = null;
    return samen;
  } catch {
    return leeg;
  }
}

function bewaarOpslag() {
  try {
    localStorage.setItem(
      SLEUTEL,
      JSON.stringify({
        begeleider: staat.begeleider,
        startuur: staat.startuur,
        afgewerkt: [...staat.afgewerkt],
        sessieStart: staat.sessieStart,
        sessie: staat.sessie,
      })
    );
  } catch {
    /* niets aan te doen; de app werkt gewoon zonder onthouden */
  }
}

const opgeslagen = laadOpslag();
const staat = {
  begeleider: opgeslagen.begeleider,
  startuur: opgeslagen.startuur,
  afgewerkt: new Set(opgeslagen.afgewerkt),
  sessieStart: opgeslagen.sessieStart, // tijdstip waarop de begeleider op "Start sessie" klikte
  sessie: opgeslagen.sessie, // de laatst samengestelde sessie, als querystring
  tikker: null,
};

// De sessie die op dit moment in de bouwer staat. Leeft hier en niet in de
// hash: de adresbalk bijwerken met location.hash vuurt een hashchange en
// hertekent de hele pagina bij élke klik. We schrijven hem met replaceState.
let bouwerSessie = null;

// ───────────────────────────── hulpjes ─────────────────────────────

function esc(tekst) {
  return String(tekst).replace(/[&<>"']/g, (t) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[t])
  );
}

// Alles wat uit de URL komt, is door iemand anders getypt en gaat ALTIJD door
// esc() — anders dan de inhoudsvelden, die wij zelf schrijven en die bewust
// HTML mogen bevatten. Dit is het enige veld in deze app dat niet van onszelf
// komt: een leerkracht die een geknutselde link uit een mail opent, hoort er
// niets aan over te houden. Laat deze regel staan.
function uitUrl(tekst) {
  return esc(String(tekst == null ? '' : tekst));
}

function lesSleutel(moduleId, lesId) {
  return `${moduleId}/${lesId}`;
}

// Minuten leesbaar maken: 180 wordt "3 uur", 95 wordt "1 uur 35", 50 blijft
// "50 minuten". Zo blijft het etiket van de zes workshops staan zoals het
// stond, en klopt het ook voor een sessie van vijfenveertig minuten.
function duurTekst(minuten) {
  const m = Math.max(0, Math.round(minuten || 0));
  if (m < 60) return `${m} ${m === 1 ? 'minuut' : 'minuten'}`;
  const uren = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${uren} uur ${rest}` : `${uren} uur`;
}

// De duur van een module in twee getallen: de kern (wat in een sessie past) en
// de verdieping (leeswerk voor achteraf). Allebei tonen is eerlijker dan één
// som waarin stof zit die nooit aan bod komt.
function moduleDuur(m) {
  const totaal = moduleMinuten(m);
  const kern = moduleMinuten(m, { zonderVerdieping: true });
  return { totaal, kern, verdieping: totaal - kern };
}

function moduleDuurTekst(m) {
  const { totaal, kern, verdieping } = moduleDuur(m);
  if (!verdieping) return `${totaal} min`;
  if (!kern) return `${verdieping} min verdieping`;
  return `${kern} + ${verdieping} min verdieping`;
}

// Hoeveel tijd kost het om de hele leeromgeving zelfstandig door te nemen?
// Verdieping telt hier wél mee: wie alleen leest, leest ook dat.
function zelfstudieMinuten() {
  return MODULES.reduce((som, m) => som + moduleMinuten(m), 0);
}

// De draaiboekblokken gegroepeerd per workshop, met de sleutel waarmee een
// sessielink ernaar verwijst. Eén keer opbouwen bij het laden: de voorraad van
// de sessiebouwer loopt er bij elke hertekening over.
const BLOKKEN_PER_WORKSHOP = (() => {
  const kaart = new Map();
  for (const regel of alleDraaiboekblokken()) {
    if (!kaart.has(regel.workshop.id)) kaart.set(regel.workshop.id, []);
    kaart.get(regel.workshop.id).push(regel);
  }
  return kaart;
})();

// Alleen sleutels van lessen die vandaag nog bestaan tellen mee. De inhoud
// wordt voortdurend bijgeschreven; wie ooit een les afvinkte die intussen
// hernoemd of geschrapt is, zou anders voorgoed "29/28 lessen" zien staan.
const GELDIGE_SLEUTELS = new Set(
  MODULES.flatMap((m) => m.lessen.map((l) => lesSleutel(m.id, l.id)))
);

function moduleVoortgang(module) {
  const klaar = module.lessen.filter((l) => staat.afgewerkt.has(lesSleutel(module.id, l.id))).length;
  return { klaar, totaal: module.lessen.length };
}

function totaleVoortgang() {
  let klaar = 0;
  for (const sleutel of staat.afgewerkt) if (GELDIGE_SLEUTELS.has(sleutel)) klaar++;
  return { klaar, totaal: TOTAAL_LESSEN };
}

// ───────────────── adres van de leeromgeving ─────────────────
// Op papier verdwijnt alle navigatie: de bundel moet zelf zeggen waar de
// leeromgeving staat. We verzinnen geen adres maar lezen af waar de pagina
// echt draait — dan klopt het ook nadat de site verhuist. Leeg bij file://
// en bij een lokale testserver: dan drukken we liever niets af dan onzin.
function leeromgevingAdres() {
  try {
    const host = location.host;
    if (!host || /^(localhost|127\.|\[::1\])/.test(host)) return '';
    return (host + location.pathname).replace(/index\.html$/, '').replace(/\/+$/, '');
  } catch {
    return '';
  }
}

const SOORT_LABEL = {
  instap: 'Instap',
  uitleg: 'Uitleg',
  doen: 'Zelf doen',
  gesprek: 'Gesprek',
  pauze: 'Pauze',
  afronding: 'Afronding',
};

// ───────────────────────────── router ─────────────────────────────

// Een hash mag sinds de sessiebouwer een query achter zich hebben:
// #/sessie/bundel?d=... — die moet er eerst af, anders komt het pad als
// "bundel?d=..." uit de split en herkent de router de pagina niet meer.
function route() {
  const ruw = location.hash.replace(/^#\/?/, '');
  const knip = ruw.indexOf('?');
  const pad = knip < 0 ? ruw : ruw.slice(0, knip);
  const vraag = new URLSearchParams(knip < 0 ? '' : ruw.slice(knip + 1));
  const delen = pad.split('/').filter(Boolean);
  if (delen[0] === 'workshop') return { naam: 'workshop', id: delen[1] || '', vraag };
  if (delen[0] === 'module') return { naam: 'module', id: delen[1] || '', vraag };
  if (delen[0] === 'bundel') return { naam: 'bundel', id: delen[1] || '', vraag };
  // #/sessie is de bouwer, #/sessie/draaiboek en #/sessie/bundel zijn de twee
  // bladen die eruit rollen.
  if (delen[0] === 'sessie') return { naam: 'sessie', id: delen[1] || 'bouwer', vraag };
  if (delen[0] === 'gids') return { naam: 'gids', vraag };
  if (delen[0] === 'prompts') return { naam: 'prompts', vraag };
  if (delen.length) return { naam: 'onbekend', vraag };
  return { naam: 'home', vraag };
}

function navigeer() {
  stopTikker();
  const r = route();
  const hoofd = document.getElementById('hoofd');

  // Welke pagina er open staat, is ook voor de stylesheet van belang: het
  // afdrukblok toont bij een bundel een andere begeleidersbanner, en het
  // bouwscherm hoort helemaal niet op papier.
  document.body.dataset.pagina =
    r.naam === 'sessie' ? (r.id === 'bundel' ? 'bundel' : `sessie-${r.id}`) : r.naam;

  if (r.naam === 'sessie') {
    hoofd.innerHTML = toonSessiePagina(r);
    if (r.id === 'draaiboek') startTikkerIndienNodig();
  } else if (r.naam === 'workshop') {
    const w = vindWorkshop(r.id);
    hoofd.innerHTML = w ? toonWorkshop(w) : toonNietGevonden();
    if (w) startTikkerIndienNodig();
  } else if (r.naam === 'module') {
    const m = vindModule(r.id);
    hoofd.innerHTML = m ? toonModule(m) : toonNietGevonden();
  } else if (r.naam === 'bundel') {
    const w = vindWorkshop(r.id);
    hoofd.innerHTML = w ? toonBundel(w) : toonNietGevonden();
  } else if (r.naam === 'gids') {
    hoofd.innerHTML = toonGids();
  } else if (r.naam === 'prompts') {
    hoofd.innerHTML = toonPromptkaart();
  } else if (r.naam === 'onbekend') {
    hoofd.innerHTML = toonNietGevonden();
  } else {
    hoofd.innerHTML = toonHome();
  }

  tekenKop();
  // Bij een nieuwe pagina springen we meteen naar boven. De vloeiende scroll uit
  // style.css is bedoeld voor sprongen binnen één pagina; hier zou hij een lange
  // module seconden lang laten omhoogschuiven.
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function toonNietGevonden() {
  return `<div class="kaart leeg">
    <h1>Niet gevonden</h1>
    <p>Dit onderdeel bestaat niet (meer), of de link is niet volledig meegekomen bij het
    kopiëren of doorsturen. Vraag de begeleider gerust de volledige link, of ga verder vanaf
    <a href="#/">het overzicht</a> — daar staan alle workshops en modules.</p>
  </div>`;
}

// ───────────────────────────── kop ─────────────────────────────

function tekenKop() {
  const { klaar, totaal } = totaleVoortgang();
  const pct = totaal ? Math.round((klaar / totaal) * 100) : 0;
  // Het afdrukblok in style.css hangt hieraan vast: enkel in begeleidersmodus
  // gaan de oordelen bij de casussen mee op papier.
  document.body.classList.toggle('begeleidersmodus', staat.begeleider);
  document.getElementById('kop').innerHTML = `
    <div class="kop-binnen">
      <a class="merk" href="#/">
        <span class="merk-teken">AI</span>
        <span class="merk-tekst">
          <strong>AI voor leerkrachten</strong>
          <small>Workshops voor lager &amp; secundair onderwijs</small>
        </span>
      </a>
      <div class="kop-rechts">
        <div class="voortgang-mini" title="${klaar} van ${totaal} lessen afgewerkt">
          <div class="balk"><div class="balk-vul" style="width:${pct}%"></div></div>
          <span>${klaar}/${totaal}</span>
        </div>
        <button class="schakelaar ${staat.begeleider ? 'aan' : ''}" data-actie="begeleider"
                aria-pressed="${staat.begeleider}" aria-label="Begeleidersmodus">
          <span class="bolletje"></span>
          <span class="lang">Begeleidersmodus</span>
          <span class="kort">Begeleider</span>
        </button>
      </div>
    </div>`;
}

// ───────────────────────────── home ─────────────────────────────

function toonHome() {
  // Het kader is het beginpunt van het traject. Staat dat spoor er (nog) niet,
  // dan begint een deelnemer zoals vroeger bij het eerste gesprek.
  const kader = modulesVanSpoor('beleid')[0];
  const start = kader
    ? { id: kader.id, icoon: kader.icoon, tagline: 'Wat mag wel, wat mag niet, en wie beslist wat.' }
    : { id: 'kennismaking', icoon: '🚀', tagline: 'Nog nooit met AI gewerkt? Start met je eerste gesprek.' };

  return `
    <section class="onthaal">
      <p class="etiket">Digitale leeromgeving</p>
      <h1>Leren werken met AI, als leerkracht</h1>
      <p class="inleiding">
        Een opleidingstraject voor leerkrachten lager en secundair onderwijs die nog nooit
        met AI werkten. Zes workshops van drie uur.${
          staat.begeleider
            ? ' Met draaiboeken met timing, oefeningen en de inhoud om achteraf zelfstandig door te nemen.'
            : ' Je hoeft er geen van gevolgd te hebben: alle inhoud staat hieronder klaar om in je eigen tempo door te nemen, les per les, met je voortgang bijgehouden.'
        }
      </p>
      <div class="onthaal-cijfers">
        <div><strong>6</strong><span>workshops</span></div>
        ${
          staat.begeleider
            ? '<div><strong>3u</strong><span>per sessie, incl. pauze</span></div>'
            : `<div><strong>${Math.round(zelfstudieMinuten() / 60)}u</strong><span>om alles zelf door te nemen</span></div>`
        }
        <div><strong>${MODULES.length}</strong><span>modules</span></div>
        <div><strong>${TOTAAL_LESSEN}</strong><span>lessen</span></div>
      </div>
      ${
        staat.begeleider
          ? `<div class="melding">
               <strong>Begeleidersmodus staat aan.</strong> Je ziet de draaiboeken met kloktijden,
               begeleiderstips en valkuilen. Zet ze uit om te zien wat de deelnemers zien.
             </div>`
          : `<div class="melding zacht">
               Geef je deze workshops zelf? Zet <strong>begeleidersmodus</strong> aan (rechtsboven)
               voor draaiboeken met timing, tips en valkuilen.
             </div>`
      }
      <div class="snelkoppelingen">
        ${
          staat.begeleider
            ? ''
            : `<a class="snel" href="#/module/${esc(start.id)}">
                 <span class="snel-icoon" aria-hidden="true">${start.icoon}</span>
                 <span><strong>Begin hier</strong><small>${esc(start.tagline)}</small></span>
               </a>`
        }
        <a class="snel" href="#/prompts">
          <span class="snel-icoon" aria-hidden="true">📇</span>
          <span><strong>Promptkaart</strong><small>Alle prompts op één plek</small></span>
        </a>
        <a class="snel" href="#/sessie">
          <span class="snel-icoon" aria-hidden="true">🧩</span>
          <span><strong>Stel je eigen sessie samen</strong><small>Een uur, een halve dag of één module</small></span>
        </a>
        <a class="snel" href="leerlingen/index.html">
          <span class="snel-icoon" aria-hidden="true">🎒</span>
          <span><strong>Voor je leerlingen: AI-wijs op school</strong><small>Gratis cursus voor de 2de en 3de graad, met een module voor jou</small></span>
        </a>
        ${
          staat.begeleider
            ? `<a class="snel" href="#/gids">
                 <span class="snel-icoon" aria-hidden="true">🧭</span>
                 <span><strong>Begeleidersgids</strong><small>Voorbereiding, zaal lezen, lastige vragen</small></span>
               </a>`
            : ''
        }
      </div>
    </section>

    ${SPOREN.map(toonSpoor).join('')}
  `;
}

function toonSpoor(spoor) {
  const workshops = workshopsVanSpoor(spoor.id);
  const modules = modulesVanSpoor(spoor.id);
  if (!workshops.length && !modules.length) return '';
  return `
    <section class="spoor ${spoor.kleur}">
      <div class="spoor-kop">
        <div>
          <h2>${esc(spoor.naam)}</h2>
          <p>${spoor.omschrijving}</p>
        </div>
        <span class="tool-vlag">${esc(spoor.tools)}</span>
      </div>

      ${
        workshops.length
          ? `<div class="rooster">${workshops.map(toonWorkshopKaart).join('')}</div>

      <details class="modulelijst"${staat.begeleider ? '' : ' open'}>
        <summary>De ${modules.length} inhoudsmodules van dit spoor</summary>
        <div class="rooster smal">
          ${modules.map(toonModuleKaart).join('')}
        </div>
      </details>`
          : // Een spoor zonder draaiboek is leesstof: dan zijn de modules het spoor
            // zelf, en hoeven ze niet weggestopt in een uitklapper.
            `<div class="rooster">${modules.map(toonModuleKaart).join('')}</div>`
      }
    </section>`;
}

function toonWorkshopKaart(w) {
  const blokken = w.draaiboek.filter((b) => b.soort !== 'pauze').length;
  return `
    <a class="kaart workshop" href="#/workshop/${w.id}">
      <div class="kaart-kop">
        <span class="code">${esc(w.code)}</span>
        <span class="duur">${esc(duurTekst(totaalMinuten(w.draaiboek)))}</span>
      </div>
      <h3>${esc(w.titel)}</h3>
      <p>${esc(w.ondertitel)}</p>
      <div class="kaart-voet">
        <span>${blokken} blokken</span>
        <span>${esc(groepsgrootteKort(w))}</span>
      </div>
    </a>`;
}

function toonModuleKaart(m) {
  const { klaar, totaal } = moduleVoortgang(m);
  const af = klaar === totaal;
  return `
    <a class="kaart module ${af ? 'af' : ''}" href="#/module/${m.id}">
      <div class="kaart-kop">
        <span class="icoon" aria-hidden="true">${m.icoon}</span>
        <span class="niveau">${esc(m.niveau)}</span>
      </div>
      <h3>${esc(m.titel)}</h3>
      <p>${esc(m.ondertitel)}</p>
      <div class="kaart-voet">
        <span>${esc(moduleDuurTekst(m))}</span>
        <span class="${af ? 'klaar' : ''}">${klaar}/${totaal} lessen${af ? ' <span aria-hidden="true">✓</span>' : ''}</span>
      </div>
    </a>`;
}

// ───────────────────────────── workshop ─────────────────────────────

// Terugval als het spoor-id van een workshop of module niet in SPOREN staat
// (tikfout in workshops.js). Zo blijft de pagina staan in plaats van stuk te
// lopen op spoor.naam, en zie je meteen dat er iets mis is met het spoor.
const SPOOR_ONBEKEND = { id: '', naam: 'Onbekend spoor', kleur: '', tools: '' };

// "8 tot 16 deelnemers. Meer dan 20 wordt moeilijk…" wordt "8 tot 16
// deelnemers". Een samengestelde sessie heeft geen groepsgrootte, en dan hoort
// er geen leeg etiket te staan.
function groepsgrootteKort(w) {
  return String((w && w.groepsgrootte) || '').split('.')[0];
}

// De sleutels van alle blokken van een workshop, in volgorde: het vertrekpunt
// van "Neem hier delen uit".
function sleutelsVanWorkshop(w) {
  return (BLOKKEN_PER_WORKSHOP.get(w.id) || []).map((r) => r.sleutel);
}

// toonWorkshop draait zowel op de zes vaste workshops als op een zelf
// samengestelde sessie: bouwSessieWorkshop() geeft een object met exact
// dezelfde velden terug. Vandaar dat hier niets meer hardgecodeerd staat over
// drie uur, over een groepsgrootte of over een draaiboek dat nooit leeg is.
//
// opties: kruimels (HTML voor het kruimelpad), melding (HTML dat net onder het
// kruimelpad komt), bundelHref (waar de knop Deelnemersbundel heen gaat) en
// bouwer ({ href, label }, of null om de doorsteek naar de bouwer weg te laten).
function toonWorkshop(w, opties = {}) {
  const spoor = vindSpoor(w.spoor) || SPOOR_ONBEKEND;
  const blokken = metKloktijden(w.draaiboek, staat.startuur);
  const eind = blokken.length ? blokken[blokken.length - 1].tot : staat.startuur;
  const groep = groepsgrootteKort(w);
  const doelen = w.doelen || [];
  const benodigdheden = w.benodigdheden || [];
  const valkuilen = w.valkuilen || [];

  const kruimels =
    opties.kruimels || `<a href="#/">Overzicht</a> <span>›</span> ${esc(spoor.naam)}`;
  const bundelHref = opties.bundelHref || `#/bundel/${w.id}`;
  const bouwer =
    opties.bouwer === null
      ? null
      : opties.bouwer || {
          href: `#/sessie?d=${sleutelsVanWorkshop(w).join(',')}`,
          label: 'Neem hier delen uit',
        };

  // Een half ingevuld object mag geen lege kaders geven: elke kaart valt weg
  // zodra er niets in staat.
  const infokaarten = [
    w.doelgroep || w.voorkennis
      ? `<div class="kaart info">
           ${w.doelgroep ? `<h2>Voor wie</h2><p>${esc(w.doelgroep)}</p>` : ''}
           ${w.voorkennis ? `<h2>Voorkennis</h2><p>${esc(w.voorkennis)}</p>` : ''}
         </div>`
      : '',
    doelen.length
      ? `<div class="kaart info">
           <h2>Wat je meeneemt</h2>
           <ul class="vinkjes">${doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
         </div>`
      : '',
  ].filter(Boolean);

  return `
    <nav class="kruimels" aria-label="Kruimelpad">${kruimels}</nav>
    ${opties.melding || ''}

    <header class="titelblok ${spoor.kleur}">
      <span class="code groot">${esc(w.code)}</span>
      <div>
        <h1>${esc(w.titel)}</h1>
        <p>${esc(w.ondertitel)}</p>
        <div class="etiketten">
          <span class="etiket-klein">${esc(duurTekst(totaalMinuten(w.draaiboek)))}${
            heeftPauze(w.draaiboek) ? ' incl. pauze' : ''
          }</span>
          <span class="etiket-klein">${esc(spoor.tools)}</span>
          ${groep ? `<span class="etiket-klein">${esc(groep)}</span>` : ''}
        </div>
      </div>
    </header>

    ${
      infokaarten.length
        ? `<div class="tweeluik${infokaarten.length === 1 ? ' enkel' : ''}">${infokaarten.join('')}</div>`
        : ''
    }

    ${
      staat.begeleider && benodigdheden.length
        ? `
      <div class="kaart benodigd">
        <h2>Vooraf klaarzetten</h2>
        <ul>${benodigdheden.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`
        : ''
    }

    <section class="draaiboek">
      <div class="draaiboek-kop">
        <h2>Draaiboek</h2>
        <div class="besturing">
          <label>Startuur
            <input type="time" id="startuur" value="${staat.startuur}" step="300">
          </label>
          <span class="eindtijd">tot ${eind}</span>
          ${
            staat.begeleider
              ? `<button class="knop ${staat.sessieStart ? 'stop' : 'primair'}" data-actie="sessie">
                   ${staat.sessieStart ? 'Sessie stoppen' : 'Start sessie'}
                 </button>
                 <button class="knop stil" data-actie="print">Draaiboek afdrukken</button>`
              : ''
          }
          <a class="knop stil" href="${esc(bundelHref)}">Deelnemersbundel</a>
          ${bouwer ? `<a class="knop stil" href="${esc(bouwer.href)}">${esc(bouwer.label)}</a>` : ''}
        </div>
      </div>

      ${
        blokken.length
          ? `<ol class="blokken">${blokken.map((b, i) => toonBlok(b, i)).join('')}</ol>`
          : `<p class="melding zacht">Dit draaiboek is nog leeg.
               <a href="#/sessie">Stel eerst een sessie samen</a> — kies links de blokken
               en modules die je wil doen.</p>`
      }
    </section>

    ${
      staat.begeleider && valkuilen.length
        ? `
      <section class="kaart valkuilen">
        <h2>Valkuilen</h2>
        <ul>${valkuilen.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
      </section>`
        : ''
    }
  `;
}

function toonBlok(b, i) {
  const blokModule = b.module ? vindModule(b.module) : null;
  return `
    <li class="blok soort-${b.soort}" data-blok="${i}">
      <div class="blok-tijd">
        <strong>${b.van}</strong>
        <span>${b.minuten}′</span>
      </div>
      <div class="blok-lijf">
        <div class="blok-kop">
          <span class="soort">${SOORT_LABEL[b.soort] || b.soort}</span>
          <h3>${esc(b.titel)}</h3>
        </div>
        <p>${esc(b.wat)}</p>
        ${
          blokModule
            ? `<a class="module-link" href="#/module/${blokModule.id}">
                 <span aria-hidden="true">${blokModule.icoon}</span> Inhoud: ${esc(blokModule.titel)}
                 <span aria-hidden="true">→</span>
               </a>`
            : ''
        }
        ${
          staat.begeleider && b.tips
            ? `<div class="tips">
                 <span class="tips-kop">Voor de begeleider</span>
                 <ul>${b.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
               </div>`
            : ''
        }
      </div>
    </li>`;
}

// ───────────────────────── sessietimer ─────────────────────────
// Markeert tijdens een echte sessie welk blok nu bezig is, op basis van de
// verstreken tijd sinds "Start sessie".

function startTikkerIndienNodig() {
  if (!staat.sessieStart || !staat.begeleider) return;
  werkTikkerBij();
  staat.tikker = setInterval(werkTikkerBij, 5000);
}

function stopTikker() {
  if (staat.tikker) clearInterval(staat.tikker);
  staat.tikker = null;
}

// Welke workshop staat er op dit moment op het scherm? Een samengestelde
// sessie telt mee: die heeft dezelfde vorm en verdient dus dezelfde timer en
// dezelfde kloktijden — juist daar heb je ze het hardst nodig, want de
// begeleider kent zijn eigen samenraapsel van vandaag nog niet.
//
// bouwSessieWorkshop() is puur: dezelfde URL geeft altijd hetzelfde draaiboek,
// in dezelfde volgorde als wat er op het scherm staat. De tikker rekent daarop.
function huidigeWorkshop() {
  const r = route();
  if (r.naam === 'workshop') return vindWorkshop(r.id);
  if (r.naam === 'sessie' && r.id === 'draaiboek')
    return bouwSessieWorkshop(sessieUitCode(r.vraag));
  return null;
}

function werkTikkerBij() {
  if (!staat.sessieStart) return;
  const w = huidigeWorkshop();
  if (!w) return;

  const verstreken = (Date.now() - staat.sessieStart) / 60000;
  let loper = 0;
  let actief = -1;
  let resterend = 0;

  w.draaiboek.forEach((b, i) => {
    if (verstreken >= loper && verstreken < loper + b.minuten) {
      actief = i;
      resterend = Math.ceil(loper + b.minuten - verstreken);
    }
    loper += b.minuten;
  });

  // Loopt de sessie langer dan het draaiboek, dan is élk blok voorbij — anders
  // ziet het draaiboek er halverwege de namiddag uit alsof er nog niets gebeurd is.
  const naSessie = actief === -1 && verstreken >= loper;

  document.querySelectorAll('.blok').forEach((el, i) => {
    el.classList.toggle('nu', i === actief);
    el.classList.toggle('voorbij', naSessie || (actief >= 0 && i < actief));
    const oud = el.querySelector('.nu-vlag');
    if (oud) oud.remove();
    if (i === actief) {
      const vlag = document.createElement('span');
      vlag.className = 'nu-vlag';
      vlag.textContent = `nu — nog ${resterend} min`;
      el.querySelector('.blok-kop').appendChild(vlag);
    }
  });

  if (naSessie) {
    const kop = document.querySelector('.blok:last-child .blok-kop');
    if (kop) {
      const over = Math.floor(verstreken - loper);
      const vlag = document.createElement('span');
      vlag.className = 'nu-vlag';
      vlag.textContent = over >= 1 ? `einde draaiboek — ${over} min over tijd` : 'einde draaiboek';
      kop.appendChild(vlag);
    }
  }
}

// Het startuur verschuift enkel de kloktijden. De hele pagina hertekenen
// vernielt het tijdveld waar de begeleider net in typt — Chrome vuurt een
// change bij elke segmentwijziging en bij elke pijltjestoets. Dus werken
// we alleen de tijden bij.
function werkKloktijdenBij() {
  const w = huidigeWorkshop();
  if (!w) return;

  const blokken = metKloktijden(w.draaiboek, staat.startuur);
  document.querySelectorAll('.blokken .blok').forEach((el, i) => {
    const tijd = el.querySelector('.blok-tijd strong');
    if (tijd && blokken[i]) tijd.textContent = blokken[i].van;
  });
  const eind = document.querySelector('.eindtijd');
  if (eind && blokken.length) eind.textContent = `tot ${blokken[blokken.length - 1].tot}`;
}

// ───────────────────────────── module ─────────────────────────────

function toonModule(m) {
  const spoor = vindSpoor(m.spoor) || SPOOR_ONBEKEND;
  const bij = workshopsVoorModule(m.id);
  const { klaar, totaal } = moduleVoortgang(m);
  const duur = moduleDuur(m);

  // Een module is zelden het eindpunt: wie ze uitleest, wil door naar de
  // volgende in hetzelfde spoor zonder eerst terug naar het overzicht te moeten.
  const reeks = modulesVanSpoor(m.spoor);
  const i = reeks.findIndex((x) => x.id === m.id);
  const vorige = i > 0 ? reeks[i - 1] : null;
  const volgende = i >= 0 && i < reeks.length - 1 ? reeks[i + 1] : null;

  return `
    <nav class="kruimels" aria-label="Kruimelpad"><a href="#/">Overzicht</a> <span>›</span> ${esc(spoor.naam)}</nav>

    <header class="titelblok ${spoor.kleur}">
      <span class="code groot icoongroot" aria-hidden="true">${m.icoon}</span>
      <div>
        <h1>${esc(m.titel)}</h1>
        <p>${esc(m.ondertitel)}</p>
        <div class="etiketten">
          ${
            duur.kern
              ? `<span class="etiket-klein">${duur.kern} min</span>
                 ${duur.verdieping ? `<span class="etiket-klein">+ ${duur.verdieping} min verdieping</span>` : ''}`
              : `<span class="etiket-klein">${duur.verdieping} min verdieping</span>`
          }
          <span class="etiket-klein">${esc(m.niveau)}</span>
          <span class="etiket-klein" id="module-teller">${klaar}/${totaal} afgewerkt</span>
          ${bij
            .map((w) => `<a class="etiket-klein link" href="#/workshop/${w.id}">${esc(w.code)}</a>`)
            .join('')}
          ${
            // Een module kan naar iets buiten de app wijzen (de leerlingencursus
            // in leerlingen/). De inhoudsvelden zelf mogen geen <a> bevatten.
            m.link ? `<a class="etiket-klein link" href="${esc(m.link.href)}">${esc(m.link.tekst)} <span aria-hidden="true">↗</span></a>` : ''
          }
        </div>
      </div>
    </header>

    <div class="kaart doelen">
      <h2>Na deze module</h2>
      <ul class="vinkjes">${m.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>

    ${m.lessen.map((les, i) => toonLes(m, les, i)).join('')}

    <nav class="verder" aria-label="Verder in dit spoor">
      ${
        vorige
          ? `<a class="knop stil" href="#/module/${vorige.id}"><span aria-hidden="true">←</span> Vorige: ${esc(vorige.titel)}</a>`
          : `<a class="knop stil" href="#/"><span aria-hidden="true">←</span> Terug naar het overzicht</a>`
      }
      ${
        volgende
          ? `<a class="knop primair" href="#/module/${volgende.id}">Volgende: ${esc(volgende.titel)} <span aria-hidden="true">→</span></a>`
          : vorige
            ? `<a class="knop stil" href="#/">Terug naar het overzicht</a>`
            : ''
      }
    </nav>
  `;
}

// Het vinkje is versiering: een schermlezer hoort "Afgewerkt", niet "vinkje".
// De knop wordt ook bij een klik opnieuw gevuld, vandaar deze twee constanten.
const VINK_AF = '<span aria-hidden="true">✓</span> Afgewerkt';
const VINK_OPEN = 'Markeer als afgewerkt';

function toonLes(module, les, index) {
  const sleutel = lesSleutel(module.id, les.id);
  const af = staat.afgewerkt.has(sleutel);
  return `
    <article class="les ${af ? 'af' : ''}" id="les-${les.id}">
      <div class="les-kop">
        <h2><span class="lesnr">${index + 1}</span> ${esc(les.titel)}
          ${les.verdieping ? '<span class="verdieping-vlag">Verdieping</span>' : ''}</h2>
        <button class="vink ${af ? 'aan' : ''}" data-actie="vink" data-sleutel="${sleutel}"
                aria-pressed="${af}">
          ${af ? VINK_AF : VINK_OPEN}
        </button>
      </div>
      ${les.blokken.map(toonInhoudsblok).join('')}
    </article>`;
}

// De oordelen van een casus, ook gebruikt in de deelnemersbundel. Daar gaan ze
// enkel mee in begeleidersmodus: de bundel wordt bij de start uitgedeeld, en het
// groepswerk in A3 valt weg als het oordeel al op papier staat.
const CASUS_LABEL = { mag: 'Mag', 'mag-niet': 'Mag niet', 'hangt-ervan-af': 'Hangt ervan af' };

// Nummert de quizvragen zodat elke vraag een eigen id heeft om de knoppen
// eronder aan vast te hangen (aria-labelledby).
let quizTeller = 0;

// De inhoudsvelden bevatten bewust opmaak (<strong>, <em>, <code>) en zijn
// door onszelf geschreven, dus die gaan als HTML naar het scherm. Alles wat
// letterlijk moet blijven — promptteksten, quizantwoorden — wordt geëscaped.
function toonInhoudsblok(blok) {
  switch (blok.type) {
    case 'tekst':
      return `<p class="tekst">${blok.inhoud}</p>`;

    case 'lijst': {
      const tag = blok.geordend ? 'ol' : 'ul';
      return `<${tag} class="opsomming">${blok.items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`;
    }

    case 'kader':
      return `
        <aside class="kader ${esc(blok.variant)}">
          <h3>${esc(blok.titel)}</h3>
          <p>${blok.inhoud}</p>
        </aside>`;

    case 'prompt':
      return `
        <figure class="promptblok">
          <figcaption>
            <span>${esc(blok.titel)}</span>
            <button class="knop mini" data-actie="kopieer">Kopieer</button>
          </figcaption>
          <pre><code>${esc(blok.tekst)}</code></pre>
          ${blok.uitleg ? `<p class="promptuitleg">${blok.uitleg}</p>` : ''}
        </figure>`;

    case 'vergelijk':
      return `
        <div class="vergelijk">
          <div class="zijde zwak">
            <span class="zijde-kop">Te vaag</span>
            <p>${esc(blok.zwak)}</p>
          </div>
          <div class="zijde sterk">
            <span class="zijde-kop">Zo wel</span>
            <p>${esc(blok.sterk)}</p>
          </div>
          ${blok.uitleg ? `<p class="vergelijkuitleg">${blok.uitleg}</p>` : ''}
        </div>`;

    case 'opdracht':
      return `
        <section class="opdracht">
          <h3>${esc(blok.titel)}</h3>
          <p>${blok.inhoud}</p>
          <ol>${blok.stappen.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        </section>`;

    case 'casus': {
      // Het oordeel blijft verborgen tot de groep zelf beslist heeft — anders
      // leest iedereen gewoon het antwoord en valt het gesprek weg. De knop
      // blijft staan zodat een groep die te vroeg klikte het oordeel weer kan
      // wegleggen, en zodat je met het toetsenbord je plaats niet kwijtraakt.
      return `
        <section class="casus" data-casus>
          <h3>${esc(blok.titel)}</h3>
          <p class="casus-situatie">${esc(blok.situatie)}</p>
          <button class="knop mini casus-knop" data-actie="casus" aria-expanded="false">Toon het oordeel</button>
          <div class="casus-antwoord">
            <span class="oordeel oordeel-${esc(blok.oordeel)}">${CASUS_LABEL[blok.oordeel] || esc(blok.oordeel)}</span>
            <p>${esc(blok.toelichting)}</p>
            ${
              staat.begeleider && blok.discussie
                ? `<p class="casus-discussie"><span>Gooi dit in de groep</span> ${esc(blok.discussie)}</p>`
                : ''
            }
          </div>
        </section>`;
    }

    case 'quiz': {
      const qid = `quizvraag-${++quizTeller}`;
      return `
        <section class="quiz" data-quiz>
          <h3 id="${qid}">${esc(blok.vraag)}</h3>
          <div class="opties" role="group" aria-labelledby="${qid}">
            ${blok.opties
              .map(
                (o, i) => `
              <button class="optie" data-actie="quiz" data-juist="${o.juist}" data-i="${i}">
                <span class="optie-tekst">${esc(o.tekst)}</span>
                <span class="optie-feedback">${esc(o.feedback)}</span>
              </button>`
              )
              .join('')}
          </div>
          <p class="quiz-uitslag" role="status"></p>
        </section>`;
    }

    default:
      // Stil laten verdwijnen is de duurste fout: waarschuw altijd in de
      // console, en laat de begeleider zien dat er iets ontbreekt.
      console.warn(`Onbekend blok-type "${blok.type}" — voeg een case toe in toonInhoudsblok().`);
      return staat.begeleider
        ? `<p class="tekst"><em>Hier hoort een blok van het type "${esc(blok.type)}", maar de app kan dat type nog niet tonen.</em></p>`
        : '';
  }
}

// ─────────────────────── deelnemersbundel ───────────────────────
// Afdrukbaar hand-out per workshop: wat je meeneemt, alle prompts en
// opdrachten van de behandelde modules, en ruimte om te noteren.

// De vuistregel die op elke bundel hoort, per spoor. Dit is inhoud en zou
// eigenlijk in een inhoudsbestand staan; ze staat hier omdat ze hier altijd
// gestaan heeft. De tekst mag opmaak bevatten en gaat dus ongeëscaped naar het
// scherm, net als de andere inhoudsvelden.
//
// Spoor C leent voorlopig de tekst van spoor A: die past er toevallig bij.
// Een eigen vuistregel voor het kader is inhoudswerk en wacht op een go.
const VUISTREGELS = {
  ai: [
    `Zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen.
     Geen namen van leerlingen, geen zorg- of CLB-gegevens, geen thuissituaties.
     Vervang namen door <code>[LEERLING]</code> — het antwoord wordt er niet minder van.`,
    `Het eerste antwoord is een <strong>ontwerp</strong>, geen eindproduct.
     Stuur drie keer bij voor je oordeelt.
     Feiten, cijfers, jaartallen en citaten check je altijd zelf na.`,
  ],
  vibe: [
    `Online is publiek. Wie de link heeft, ziet alles op je pagina — ook de tekst die
     enkel in de code zit, zoals de juiste antwoorden. Geen leerlingnamen, geen
     antwoordsleutels, geen toets die je nog moet afnemen. Dezelfde regel geldt voor
     wat je in het gesprek typt. Bouw anoniem, tenzij het écht niet anders kan: een
     klasnummer of een zelfgekozen bijnaam volstaat bijna altijd.`,
    `De eerste versie is een <strong>ontwerp</strong>, geen eindproduct. Klik ze zelf
     kapot — lege velden, rare invoer, en op het toestel waarop je leerlingen werken.
     Loopt er iets mis, beschrijf dan wat je deed, wat er gebeurde en wat er had moeten
     gebeuren; de code lezen hoeft niet. En bewaar een werkende versie vóór je een grote
     wijziging vraagt, dan kan je altijd terug.`,
  ],
};
VUISTREGELS.beleid = VUISTREGELS.ai;

// opties: terugHref (waar "Terug naar het draaiboek" heen gaat), kruimels en
// melding (HTML dat net onder het kruimelpad komt).
function toonBundel(w, opties = {}) {
  const modules = modulesVanWorkshop(w);
  // Alleen bij een zelf samengestelde sessie knijpen we de bundel dicht tot de
  // lessen die echt aan bod kwamen. De zes workshops behandelen hun modules
  // volledig; hun bundels horen te blijven zoals ze zijn.
  const lessenKaart = w.samengesteld ? lessenPerModule(w.draaiboek) : null;
  const bundelOpties = { zonderVerdieping: true, lessenPerModule: lessenKaart };
  const prompts = blokkenVanType(modules, 'prompt', bundelOpties);
  const opdrachten = blokkenVanType(modules, 'opdracht', bundelOpties);
  const casussen = blokkenVanType(modules, 'casus', bundelOpties);
  const adres = leeromgevingAdres();
  const doelen = w.doelen || [];
  // Doelen staan op de module, niet op de les. Neemt een sessie maar een deel
  // van een module mee, dan belooft die lijst meer dan de sessie waarmaakt.
  // De hand-out zegt er dan bij waar die doelen vandaan komen.
  const doelenUitDeelModule = !!(lessenKaart && lessenKaart.size);
  const terugHref = opties.terugHref || `#/workshop/${w.id}`;
  const kruimels =
    opties.kruimels ||
    `<a href="#/">Overzicht</a> <span>›</span>
     <a href="#/workshop/${w.id}">${esc(w.code)}</a> <span>›</span> Deelnemersbundel`;

  // Een samengestelde sessie kan sporen mengen; dan krijgt elke vuistregel de
  // spoornamen erboven. Sporen die dezelfde tekst delen — vandaag A en C —
  // komen onder één kopje, anders staat hetzelfde twee keer op het blad. Bij
  // één spoor, en dus bij de zes vaste bundels, verandert er niets.
  let sporen = w.samengesteld ? [...new Set(modules.map((m) => m.spoor))] : [w.spoor];
  if (!sporen.length) sporen = [w.spoor];
  const vuistregels = [];
  for (const spoorId of sporen) {
    const regels = VUISTREGELS[spoorId] || VUISTREGELS.ai;
    const naam = (vindSpoor(spoorId) || SPOOR_ONBEKEND).naam;
    const bestaand = vuistregels.find((v) => v.regels === regels);
    if (bestaand) bestaand.namen.push(naam);
    else vuistregels.push({ regels, namen: [naam] });
  }

  return `
    <nav class="kruimels schermonly" aria-label="Kruimelpad">${kruimels}</nav>
    ${opties.melding || ''}

    <div class="bundel">
      <header class="bundel-kop">
        <div>
          <span class="code ${esc(w.spoor)}">${esc(w.code)}</span>
          <h1>${esc(w.titel)}</h1>
          <p>${esc(w.ondertitel)}</p>
        </div>
        <div class="bundel-invul">
          <span>Naam <i></i></span>
          <span>Datum <i></i></span>
        </div>
      </header>

      <div class="besturing schermonly">
        <button class="knop primair" data-actie="print">Bundel afdrukken</button>
        <a class="knop stil" href="${esc(terugHref)}">Terug naar het draaiboek</a>
      </div>

      ${
        doelen.length
          ? `
      <section class="bundel-blok">
        <h2>Wat je vandaag meeneemt</h2>
        ${
          doelenUitDeelModule
            ? `<p class="bundel-hint">De doelen van de modules waaruit deze sessie is
                 samengesteld. Je nam er vandaag een deel van door — wat precies,
                 staat in het draaiboek.</p>`
            : ''
        }
        <ul class="vinkjes">${doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      </section>`
          : ''
      }

      <section class="bundel-blok">
        <h2>De vuistregel</h2>
        ${vuistregels
          .map(
            ({ regels, namen }) =>
              `${vuistregels.length > 1 ? `<h3>${esc(namen.join(' en '))}</h3>` : ''}
               ${regels.map((tekst) => `<p class="vuistregel">${tekst}</p>`).join('')}`
          )
          .join('')}
      </section>

      ${
        prompts.length
          ? `
      <section class="bundel-blok">
        <h2>Prompts uit deze sessie</h2>
        <p class="bundel-hint">Deze prompts staan ook online, met een kopieerknop${
          adres ? `: <strong>${esc(adres)}</strong>` : ''
        }.</p>
        ${prompts
          .map(
            ({ blok, module }) => `
          <figure class="promptblok bundel-prompt">
            <figcaption>
              <span>${esc(blok.titel)}</span>
              <span class="herkomst"><span aria-hidden="true">${module.icoon}</span> ${esc(module.titel)}</span>
            </figcaption>
            <pre><code>${esc(blok.tekst)}</code></pre>
            ${blok.uitleg ? `<p class="promptuitleg">${blok.uitleg}</p>` : ''}
          </figure>`
          )
          .join('')}
      </section>`
          : ''
      }

      ${
        opdrachten.length
          ? `
      <section class="bundel-blok">
        <h2>Opdrachten</h2>
        ${opdrachten
          .map(
            ({ blok }) => `
          <section class="opdracht">
            <h3>${esc(blok.titel)}</h3>
            <p>${blok.inhoud}</p>
            <ol>${blok.stappen.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
          </section>`
          )
          .join('')}
      </section>`
          : ''
      }

      ${
        casussen.length
          ? `
      <section class="bundel-blok bundel-casussen">
        <h2>${staat.begeleider ? 'De casussen, met het oordeel' : 'De casussen'}</h2>
        <p class="bundel-hint">${
          staat.begeleider
            ? 'Met oordeel en toelichting: dit is de versie voor de begeleider, of om ná de sessie uit te delen.'
            : 'Beslis eerst zelf, in je groepje: mag dit, mag dit niet, of hangt het ervan af? De oordelen bespreken jullie samen; achteraf vind je ze terug in de module <em>Casussen: mag dit?</em>.'
        }</p>
        ${casussen
          .map(
            ({ blok }) => `
          <section class="casus${staat.begeleider ? ' open' : ''}">
            <h3>${esc(blok.titel)}</h3>
            <p class="casus-situatie">${esc(blok.situatie)}</p>
            ${
              staat.begeleider
                ? `<div class="casus-antwoord">
              <span class="oordeel oordeel-${esc(blok.oordeel)}">${CASUS_LABEL[blok.oordeel] || esc(blok.oordeel)}</span>
              <p>${esc(blok.toelichting)}</p>
            </div>`
                : ''
            }
          </section>`
          )
          .join('')}
      </section>`
          : ''
      }

      ${
        modules.length
          ? `
      <section class="bundel-blok">
        <h2>Verder lezen</h2>
        <ul class="bundel-modules">
          ${modules
            .map(
              (m) => `<li><a href="#/module/${m.id}"><span aria-hidden="true">${m.icoon}</span> ${esc(m.titel)}</a>
                       — ${esc(m.ondertitel)}</li>`
            )
            .join('')}
        </ul>
        ${
          adres
            ? `<p class="bundel-hint">Alles staat op <strong>${esc(adres)}</strong> — kies daar de module uit de lijst.</p>`
            : ''
        }
      </section>`
          : ''
      }

      <section class="bundel-blok notities">
        <h2>Eén ding dat ik volgende week doe</h2>
        <div class="lijnen">${'<i></i>'.repeat(3)}</div>
        <h2>Notities</h2>
        <div class="lijnen">${'<i></i>'.repeat(10)}</div>
      </section>
    </div>`;
}

// ─────────────────── zelf samengestelde sessie ───────────────────
// Drie schermen op één route: de bouwer (#/sessie), het draaiboek met
// kloktijden (#/sessie/draaiboek) en de deelnemersbundel (#/sessie/bundel).
//
// De sessie zelf woont volledig in de adresbalk. Zonder server is de link de
// enige plek waar ze kan staan die je kan bookmarken, mailen of in Smartschool
// zetten. Het draaiboek en de bundel draaien op toonWorkshop() en toonBundel():
// bouwSessieWorkshop() in cursus.js geeft een object met exact de vorm van een
// workshop terug, dus kloktijden, sessietimer, tips en afdrukblad komen gratis
// mee.
//
// Alles wat van buiten komt — de naam van de sessie, de eigen titel van een
// generiek blok, een sleutel die nergens meer op slaat — gaat door uitUrl().

function uurInMinuten(uur) {
  const [u, m] = String(uur || '0:0').split(':').map(Number);
  return (u || 0) * 60 + (m || 0);
}

function bouwerActief() {
  return !!bouwerSessie && !!document.querySelector('.sessiebouwer');
}

// history.replaceState vuurt géén hashchange, dus de pagina blijft staan
// terwijl de link in de adresbalk altijd klopt. In een sandbox of via file://
// mag het niet; dan werkt de bouwer gewoon verder zonder adres.
function vervangAdres(hash) {
  try {
    history.replaceState(null, '', hash);
  } catch {
    /* geen adres bijgewerkt; de knoppen en de kopieerknop blijven werken */
  }
}

function toonSessiePagina(r) {
  if (r.id === 'draaiboek' || r.id === 'bundel') {
    const sessie = sessieUitCode(r.vraag);
    // Het startuur reist mee in de link: anders opent de collega aan wie je
    // hem doorstuurt op een ander uur dan jij bedoelde.
    if (sessie.startuur && sessie.startuur !== staat.startuur) {
      staat.startuur = sessie.startuur;
      bewaarOpslag();
    }
    if (!sessie.delen.length) return toonLegeSessie(sessie);

    const w = bouwSessieWorkshop(sessie);
    const terug = esc(sessieNaarHash(sessie));
    const melding = meldingOnbekend(sessie);

    if (r.id === 'bundel')
      return toonBundel(w, {
        melding,
        terugHref: sessieNaarHash(sessie, 'draaiboek'),
        kruimels: `<a href="#/">Overzicht</a> <span>›</span>
          <a href="${terug}">Je eigen sessie</a> <span>›</span> Deelnemersbundel`,
      });

    return toonWorkshop(w, {
      melding,
      bundelHref: sessieNaarHash(sessie, 'bundel'),
      kruimels: `<a href="#/">Overzicht</a> <span>›</span> <a href="${terug}">Je eigen sessie</a>`,
      bouwer: { href: sessieNaarHash(sessie), label: 'Deze sessie aanpassen' },
    });
  }

  bouwerSessie = beginSessie(r.vraag);
  return toonSessieBouwer();
}

// #/sessie zonder iets in de link komt terug met wat je de vorige keer maakte.
// Een sessie die je wél uit een link opent, wordt meteen de laatste: wie hem
// doorgestuurd kreeg en later terugkomt op #/sessie, vindt hem terug.
function beginSessie(vraag) {
  const heeftLink = ['d', 'n', 't', 's'].some((sleutel) => vraag.get(sleutel));
  const sessie = sessieUitCode(heeftLink ? vraag : staat.sessie);
  if (sessie.startuur && sessie.startuur !== staat.startuur) {
    staat.startuur = sessie.startuur;
  }
  sessie.startuur = staat.startuur;
  staat.sessie = sessieNaarCode(sessieVoorLink(sessie)).slice(0, MAX_SESSIECODE);
  bewaarOpslag();
  return sessie;
}

function toonLegeSessie(sessie) {
  return `<div class="kaart leeg">
    <h1>Deze sessie is nog leeg</h1>
    <p>In deze link staat nog geen enkel onderdeel${
      sessie.onbekend.length ? ', of wat erin stond bestaat niet meer' : ''
    }. Kies eerst wat je wil doen — dat is een kwestie van een paar klikken.</p>
    <p><a class="knop primair" href="#/sessie">Stel je sessie samen</a></p>
  </div>`;
}

// Nooit de hele sessie weggooien om één sleutel die niet meer bestaat: toon
// wat wél klopt en zeg eerlijk wat eruit viel.
function meldingOnbekend(sessie) {
  const aantal = sessie.onbekend.length;
  if (!aantal) return '';
  const lijst = sessie.onbekend.map(uitUrl).join(', ');
  return `<p class="melding zacht schermonly">${
    aantal === 1
      ? `Eén onderdeel uit deze link bestaat niet meer (${lijst}) en staat er niet bij.`
      : `${aantal} onderdelen uit deze link bestaan niet meer (${lijst}) en staan er niet bij.`
  } De rest klopt en staat gewoon klaar.</p>`;
}

function toonSessieBouwer() {
  return `
    <nav class="kruimels" aria-label="Kruimelpad"><a href="#/">Overzicht</a> <span>›</span> Je eigen sessie</nav>

    <header class="titelblok">
      <span class="code groot icoongroot" aria-hidden="true">🧩</span>
      <div>
        <h1>Stel je eigen sessie samen</h1>
        <p>Een uur op een personeelsvergadering, veertig minuten op een vakwerkgroep, een halve
           studiedag: kies de onderdelen die passen. Je krijgt er een draaiboek met kloktijden en
           een deelnemersbundel van. De link onthoudt alles — bookmark hem of stuur hem door.</p>
        <div class="etiketten">
          <span class="etiket-klein">Niets staat vast: alles kan korter, langer of weg</span>
        </div>
      </div>
    </header>

    <p class="alleen-afdruk">Dit is het bouwscherm. Druk het draaiboek of de deelnemersbundel af,
       niet deze pagina.</p>

    <div class="sessiebouwer">
      <div class="sessie-kolom">${toonSessieKolom(bouwerSessie)}</div>
      <div class="voorraad">${toonVoorraad(bouwerSessie)}</div>
    </div>`;
}

// ── de rechterkolom: jouw sessie ──

// De ene zin die voortdurend meeloopt met wat je kiest. Apart, want het
// startuur mag enkel déze zin hertekenen: de hele kolom opnieuw opbouwen zou
// het tijdveld vernielen waar de begeleider net in typt.
function minutenbalkInhoud(sessie) {
  const minuten = sessieMinuten(sessie);
  const aantal = sessie.delen.length;
  const start = staat.startuur;
  const doel = sessie.doelduur;
  if (!aantal)
    return `<strong>Je sessie is nog leeg</strong><span>Nog geen onderdelen gekozen.</span>`;
  return `<strong>Je sessie: ${duurTekst(minuten)}</strong>
    <span>${aantal} ${aantal === 1 ? 'onderdeel' : 'onderdelen'} · van ${start} tot ${naarKlok(
      uurInMinuten(start) + minuten
    )}</span>
    ${doel ? `<span class="doelmeter ${minuten > doel ? 'over' : ''}">je hebt er ${doel}</span>` : ''}`;
}

// Het standaarduur hoeft niet in een link te staan; dat houdt een gedeelde
// sessie kort. De bouwknoppen en de adresbalk gebruiken allebei deze vorm.
function sessieVoorLink(sessie) {
  return { ...sessie, startuur: staat.startuur === '09:00' ? '' : staat.startuur };
}

function werkBalkBij() {
  const balk = document.querySelector('.sessiebouwer .minutenbalk');
  if (balk) balk.innerHTML = minutenbalkInhoud(bouwerSessie);
}

function toonSessieKolom(sessie) {
  const aantal = sessie.delen.length;
  const start = staat.startuur;
  const doel = sessie.doelduur;
  const link = sessieVoorLink(sessie);

  return `
    <div class="minutenbalk" role="status">${minutenbalkInhoud(sessie)}</div>

    <div class="sessie-velden">
      <label>Naam van de sessie
        <input type="text" id="sessie-naam" maxlength="60" value="${uitUrl(sessie.naam)}"
               placeholder="Personeelsvergadering 12 maart">
      </label>
      <label>Startuur
        <input type="time" id="startuur" value="${start}" step="300">
      </label>
      <label>Ik heb
        <span class="veld-met-eenheid">
          <input type="number" id="sessie-doelduur" min="5" max="480" step="5"
                 value="${doel || ''}" placeholder="—">
          <span class="eenheid">minuten</span>
        </span>
      </label>
    </div>

    <div class="sessie-knoppen">
      ${sessieKnop('Toon draaiboek', sessieNaarHash(link, 'draaiboek'), aantal, 'primair')}
      ${sessieKnop('Deelnemersbundel', sessieNaarHash(link, 'bundel'), aantal, 'stil')}
      <button class="knop stil" data-actie="sessie-link">Kopieer de link</button>
      ${aantal ? '<button class="knop stil" data-actie="sessie-leeg">Begin opnieuw</button>' : ''}
    </div>

    ${meldingOnbekend(sessie)}
    ${sessieMeldingen(sessie)}

    ${
      aantal
        ? `<ol class="gekozen-lijst">${sessie.delen
            .map((deel, i) => toonGekozenDeel(deel, i, sessie))
            .join('')}</ol>`
        : toonSjablonen()
    }`;
}

// Zolang er niets gekozen is, leidt een knop naar een leeg draaiboek. Hij
// blijft staan — zo zie je wel dat hij bestaat — maar doet nog niets.
function sessieKnop(label, href, actief, soort) {
  return actief
    ? `<a class="knop ${soort}" href="${esc(href)}">${label}</a>`
    : `<span class="knop ${soort} uit" aria-disabled="true">${label}</span>`;
}

// Nergens rood, nergens een knop die weigert: een collega die dit voor het
// eerst probeert, mag niet het gevoel krijgen dat hij iets fout doet.
function sessieMeldingen(sessie) {
  const delen = sessie.delen;
  if (!delen.length)
    return `<p class="melding zacht">Neem hieronder een sjabloon als vertrekpunt, of kies zelf
      onderdelen uit de lijst <em>Waaruit je kan kiezen</em> — je kan alles daarna nog wisselen,
      korter zetten of weglaten.</p>`;

  const uit = [];
  const minuten = sessieMinuten(sessie);
  const doel = sessie.doelduur;

  if (doel && minuten > doel) {
    const langste = delen.reduce((a, b) => (b.minuten > a.minuten ? b : a), delen[0]);
    uit.push(`<p class="melding">Je hebt ${minuten} minuten gekozen voor een sessie van ${doel}.
      Dat is ${minuten - doel} minuten te veel. Het langste onderdeel is
      “${uitUrl(langste.titel)}” (${langste.minuten} min) — korter zetten kan met het
      minutenveld ernaast.</p>`);
  } else if (doel && doel - minuten >= 5) {
    uit.push(`<p class="melding zacht">Je hebt ${minuten} van de ${doel} minuten gevuld.
      Er blijft ${doel - minuten} minuten over — ruimte voor een pauze of voor vragen.
      <span class="melding-knoppen">
        <button class="knop mini" data-actie="deel-toevoegen" data-sleutel="pauze">Pauze erbij</button>
        <button class="knop mini" data-actie="deel-toevoegen" data-sleutel="vragen">Vragenronde erbij</button>
      </span></p>`);
  }

  if (minuten >= 90 && !delen.some((deel) => deel.blokSoort === 'pauze')) {
    uit.push(`<p class="melding zacht">Je sessie duurt ${minuten} minuten en er zit geen pauze in.
      Zet er een na ongeveer een uur.
      <span class="melding-knoppen">
        <button class="knop mini" data-actie="pauze-invoegen">Pauze invoegen</button>
      </span></p>`);
  }

  return uit.join('');
}

function toonGekozenDeel(deel, i, sessie) {
  const module = deel.module ? vindModule(deel.module) : null;
  const workshop = deel.workshop ? vindWorkshop(deel.workshop) : null;
  // Bij een module-onderdeel zou de modulenaam de titel herhalen; daar zegt
  // het aantal lessen meer.
  const herkomst =
    deel.soort === 'module' && module
      ? `Hele module · ${module.lessen.filter((les) => !les.verdieping).length} lessen`
      : [workshop ? workshop.code : '', module ? module.titel : ''].filter(Boolean).join(' · ');
  const titel = uitUrl(deel.titel);
  const laatste = i === sessie.delen.length - 1;

  return `
    <li class="gekozen-deel soort-${esc(deel.blokSoort)}">
      <div class="gekozen-kop">
        <span class="soort">${SOORT_LABEL[deel.blokSoort] || esc(deel.blokSoort)}</span>
        <strong>${titel}</strong>
      </div>
      ${herkomst ? `<p class="gekozen-herkomst">${esc(herkomst)}</p>` : ''}
      ${deelOpmerkingen(deel, i, sessie)}
      <div class="gekozen-regelaars">
        <span class="veld-met-eenheid">
          <input type="number" class="minutenveld" min="5" max="240" step="5"
                 value="${deel.minuten}" data-actie="deel-minuten" data-i="${i}"
                 aria-label="Minuten voor ${titel}">
          <span class="eenheid">min</span>
        </span>
        ${
          deel.soort === 'generiek'
            ? `<input type="text" class="titelveld" maxlength="60"
                      value="${uitUrl(deel.eigenTitel || '')}" placeholder="Eigen titel"
                      data-actie="deel-titel" data-i="${i}"
                      aria-label="Eigen titel voor ${titel}">`
            : ''
        }
        <span class="gekozen-pijlen">
          <button class="pijl" data-actie="deel-omhoog" data-i="${i}" ${i === 0 ? 'disabled' : ''}
                  aria-label="Zet ${titel} een plaats hoger"><span aria-hidden="true">↑</span></button>
          <button class="pijl" data-actie="deel-omlaag" data-i="${i}" ${laatste ? 'disabled' : ''}
                  aria-label="Zet ${titel} een plaats lager"><span aria-hidden="true">↓</span></button>
          <button class="pijl weg" data-actie="deel-weg" data-i="${i}"
                  aria-label="Haal ${titel} uit je sessie"><span aria-hidden="true">✕</span></button>
        </span>
      </div>
    </li>`;
}

// Twee dingen die je pas in de zaal zou merken: verdieping die niet aan bod
// komt, en een blok uit spoor B bij een groep die nog nooit iets bouwde.
function deelOpmerkingen(deel, i, sessie) {
  const uit = [];
  const module = deel.module ? vindModule(deel.module) : null;

  if (deel.soort === 'module' && module) {
    const verdieping = module.lessen.filter((les) => les.verdieping).length;
    if (verdieping)
      uit.push(`Deze module heeft ${
        verdieping === 1 ? 'één verdiepingsles' : `${verdieping} verdiepingslessen`
      }. Die tellen niet mee in de minuten en komen niet in de bundel — ze zijn er om
      achteraf zelf na te lezen.`);
  }

  if (module && module.spoor === 'vibe') {
    const eerder = sessie.delen.slice(0, i).some((ander) => {
      const m = ander.module ? vindModule(ander.module) : null;
      return m && m.spoor === 'vibe';
    });
    if (!eerder)
      uit.push(`Dit onderdeel hoort bij Vibe coden. Dat spoor gaat ervan uit dat de groep
        al eens met een AI-assistent werkte.`);
  }

  return uit.map((tekst) => `<p class="gekozen-opmerking">${tekst}</p>`).join('');
}

function toonSjablonen() {
  if (!SJABLONEN.length) return '';
  return `
    <section class="sjablonen">
      <h2>Of begin met een sjabloon</h2>
      <p class="sjablonen-inleiding">Vijf sessies die al eens gegeven zijn. Neem er een over en
         wissel daarna wat je wil.</p>
      ${SJABLONEN.map((sjabloon) => {
        const sessie = sessieUitCode(sjabloon.d);
        return `
        <article class="sjabloon">
          <div class="sjabloon-kop">
            <h3>${esc(sjabloon.naam)}</h3>
            <span class="etiket-klein">${esc(duurTekst(sessieMinuten(sessie)))}</span>
          </div>
          <p>${esc(sjabloon.voorwie || '')}</p>
          ${
            sjabloon.waarschuwing
              ? `<p class="sjabloon-letop">${esc(sjabloon.waarschuwing)}</p>`
              : ''
          }
          <button class="knop stil" data-actie="sjabloon" data-id="${esc(sjabloon.id)}">Neem over</button>
        </article>`;
      }).join('')}
    </section>`;
}

// ── de linkerkolom: de voorraad ──

function toonVoorraad(sessie) {
  const gekozen = new Set(sessie.delen.map((deel) => deel.sleutel));
  return `
    <h2 class="voorraad-kop">Waaruit je kan kiezen</h2>

    <section class="voorraad-groep">
      <h3>Algemene blokken</h3>
      <p class="voorraad-uitleg">Passen in elke sessie. Je mag ze meer dan eens toevoegen, hun duur
         wijzigen en ze een eigen titel geven.</p>
      <ul class="voorraad-lijst">
        ${GENERIEKE_BLOKKEN.map((blok) =>
          voorraadItem({
            sleutel: blok.id,
            soort: blok.soort,
            minuten: blok.minuten,
            titel: blok.titel,
            herhaalbaar: true,
            gekozen,
          })
        ).join('')}
      </ul>
    </section>

    ${SPOREN.map((spoor) => toonVoorraadSpoor(spoor, gekozen)).join('')}`;
}

function toonVoorraadSpoor(spoor, gekozen) {
  const workshops = workshopsVanSpoor(spoor.id);
  // Een module die volledig uit verdieping bestaat, duurt nul minuten in een
  // sessie: die hoort hier niet tussen.
  const modules = modulesVanSpoor(spoor.id).filter(
    (m) => moduleMinuten(m, { zonderVerdieping: true }) > 0
  );
  if (!workshops.length && !modules.length) return '';

  return `
    <section class="voorraad-groep ${spoor.kleur}">
      <h3>${esc(spoor.naam)}</h3>
      ${workshops
        .map((w) => {
          const regels = BLOKKEN_PER_WORKSHOP.get(w.id) || [];
          return `
          <details class="voorraad-workshop">
            <summary>
              <span class="code">${esc(w.code)}</span>
              <span class="voorraad-workshoptitel">${esc(w.titel)}</span>
              <span class="voorraad-telling">${regels.length} blokken</span>
            </summary>
            <ul class="voorraad-lijst">
              ${regels
                .map(({ blok, sleutel }) =>
                  voorraadItem({
                    sleutel,
                    soort: blok.soort,
                    minuten: blok.minuten,
                    titel: blok.titel,
                    meta: moduleNaam(blok.module),
                    gekozen,
                  })
                )
                .join('')}
            </ul>
          </details>`;
        })
        .join('')}
      ${
        modules.length
          ? `<p class="voorraad-uitleg">Of neem een hele module. De verdiepingslessen tellen
               niet mee — die zijn voor achteraf.</p>
             <ul class="voorraad-lijst">
               ${modules
                 .map((m) =>
                   voorraadItem({
                     sleutel: `m.${m.id}`,
                     soort: 'uitleg',
                     minuten: moduleMinuten(m, { zonderVerdieping: true }),
                     titel: m.titel,
                     meta: `${m.lessen.filter((les) => !les.verdieping).length} lessen`,
                     gekozen,
                   })
                 )
                 .join('')}
             </ul>`
          : ''
      }
    </section>`;
}

function moduleNaam(moduleId) {
  const m = moduleId ? vindModule(moduleId) : null;
  return m ? m.titel : '';
}

function voorraadItem({ sleutel, soort, minuten, titel, meta = '', herhaalbaar = false, gekozen }) {
  const erin = !herhaalbaar && gekozen.has(sleutel);
  return `
    <li class="voorraad-item soort-${esc(soort)}${erin ? ' al-gekozen' : ''}">
      <button class="voorraad-knop" data-actie="deel-toevoegen" data-sleutel="${esc(sleutel)}"
              ${herhaalbaar ? 'data-herhaalbaar="ja"' : ''}${erin ? ' disabled' : ''}>
        <span class="soort">${SOORT_LABEL[soort] || esc(soort)}</span>
        <span class="voorraad-titel">${esc(titel)}</span>
        <span class="voorraad-meta">${minuten} min${meta ? ` · ${esc(meta)}` : ''}</span>
        <span class="enkel-vo">${erin ? 'staat al in je sessie' : ''}</span>
        <span class="voorraad-plus" aria-hidden="true"></span>
      </button>
    </li>`;
}

// ── wijzigen ──

// De voorraad blijft staan bij een wijziging: die hertekenen zou elke
// opengeklapte workshop weer dichtklappen en je plaats in de lijst kosten.
// Enkel het vinkje "staat al in je sessie" wordt bijgewerkt.
function werkVoorraadBij() {
  const gekozen = new Set(bouwerSessie.delen.map((deel) => deel.sleutel));
  document.querySelectorAll('.voorraad .voorraad-knop').forEach((knop) => {
    const erin = knop.dataset.herhaalbaar !== 'ja' && gekozen.has(knop.dataset.sleutel);
    knop.disabled = erin;
    // Het plusje en het vinkje komen uit style.css, aan .al-gekozen vast: zo
    // staat het teken op één plek en niet half hier, half in de sjabloon.
    knop.closest('.voorraad-item')?.classList.toggle('al-gekozen', erin);
    const vo = knop.querySelector('.enkel-vo');
    if (vo) vo.textContent = erin ? 'staat al in je sessie' : '';
  });
}

// Na het hertekenen van de kolom is de knop waar je net op stond verdwenen.
// Zonder dit springt een toetsenbordgebruiker bij elke klik terug naar het
// begin van de pagina.
function onthoudFocus() {
  const el = document.activeElement;
  if (!el || !el.dataset || !el.dataset.actie) return () => {};
  const { actie, i, sleutel } = el.dataset;
  const inVoorraad = !!el.closest('.voorraad');

  return () => {
    if (inVoorraad) {
      const knop = document.querySelector(`.voorraad [data-sleutel="${sleutel}"]`);
      if (knop && !knop.disabled) return knop.focus();
      const volgende = knop
        ? knop.closest('.voorraad-lijst')?.querySelector('.voorraad-knop:not([disabled])')
        : null;
      if (volgende) volgende.focus();
      return;
    }
    const kolom = document.querySelector('.sessie-kolom');
    if (!kolom) return;
    const zelfde =
      i === undefined
        ? kolom.querySelector(`[data-actie="${actie}"]`)
        : kolom.querySelector(`[data-actie="${actie}"][data-i="${i}"]`);
    const doel =
      zelfde && !zelfde.disabled
        ? zelfde
        : kolom.querySelector(`[data-actie="${actie}"]:not([disabled])`) ||
          kolom.querySelector('[data-actie="sessie-link"]');
    if (doel) doel.focus();
  };
}

function bewaarBouwer() {
  const voorLink = sessieVoorLink(bouwerSessie);
  staat.sessie = sessieNaarCode(voorLink).slice(0, MAX_SESSIECODE);
  bewaarOpslag();
  vervangAdres(sessieNaarHash(voorLink));
}

// Een generiek blok blijft na een klik gewoon klikbaar, want het mag meer dan
// eens in je sessie. Zonder een teken op de plek zelf lijkt de klik dan niets
// te doen — zeker op een gsm, waar je sessie ver boven de lijst staat.
// Op een gsm staat je sessie bóven de lijst. Elk onderdeel dat erbij komt,
// duwt de lijst dus een blok naar beneden, en je volgende tik belandt op het
// verkeerde onderdeel. Dit zet de knop waarop je tikte terug op dezelfde
// hoogte op je scherm. Een knop die zelf hertekend werd, laten we met rust.
function behoudPlek(el, wijzig) {
  const voor = el.getBoundingClientRect().top;
  wijzig();
  if (!el.isConnected) return;
  const verschil = el.getBoundingClientRect().top - voor;
  if (Math.abs(verschil) > 1) window.scrollBy({ top: verschil, behavior: 'instant' });
}

const toevoegTimers = new WeakMap();
function bevestigToevoeging(knop) {
  const item = knop.closest('.voorraad-item');
  if (!item) return;
  clearTimeout(toevoegTimers.get(item));
  item.classList.add('net-toegevoegd');
  toevoegTimers.set(item, setTimeout(() => item.classList.remove('net-toegevoegd'), 1400));
}

function bouwerGewijzigd() {
  const herstelFocus = onthoudFocus();
  bewaarBouwer();
  const kolom = document.querySelector('.sessie-kolom');
  if (kolom) kolom.innerHTML = toonSessieKolom(bouwerSessie);
  werkVoorraadBij();
  herstelFocus();
}

// Eén onderdeel wijzigen loopt via de code en terug: zo blijft cursus.js de
// enige plek die weet wat een geldige duur of titel is.
function pasDeelAan(i, wijziging) {
  const huidig = bouwerSessie.delen[i];
  if (!huidig) return;
  const nieuw = deelUitCode(deelNaarCode({ ...huidig, ...wijziging }));
  if (nieuw) bouwerSessie.delen[i] = nieuw;
}

// De pauze komt op de eerstvolgende blokgrens na een uur: niet midden in een
// blok, en niet als allerlaatste.
function voegPauzeIn(sessie) {
  const pauze = deelUitCode('pauze');
  if (!pauze) return;
  let loper = 0;
  let plaats = sessie.delen.length;
  for (let i = 0; i < sessie.delen.length; i++) {
    loper += sessie.delen[i].minuten || 0;
    if (loper >= 60) {
      plaats = i + 1;
      break;
    }
  }
  if (plaats >= sessie.delen.length) plaats = Math.max(1, sessie.delen.length - 1);
  sessie.delen.splice(plaats, 0, pauze);
}

function kopieerSessielink(knop) {
  const melding = (tekst) => {
    knop.textContent = tekst;
    setTimeout(() => {
      knop.textContent = 'Kopieer de link';
    }, 2600);
  };
  let link = sessieNaarHash(sessieVoorLink(bouwerSessie));
  try {
    link = new URL(link, location.href).href;
  } catch {
    /* via file:// lukt dat niet; de hash alleen is dan nog altijd bruikbaar */
  }
  // Zonder https bestaat navigator.clipboard niet — op een schoolserver via
  // http://192.168.x.x staat de link gelukkig gewoon in de adresbalk.
  if (!navigator.clipboard) return melding('Neem hem uit de adresbalk');
  navigator.clipboard.writeText(link).then(
    () => melding('Gekopieerd'),
    () => melding('Neem hem uit de adresbalk')
  );
}

// ─────────────────────── begeleidersgids ───────────────────────

function toonGids() {
  if (!staat.begeleider) {
    return `<div class="kaart leeg">
      <h1>Begeleidersgids</h1>
      <p>Deze gids is bedoeld voor wie de workshops geeft. Zet
         <strong>begeleidersmodus</strong> aan rechtsboven om ze te bekijken.</p>
      <p><a href="#/">Terug naar het overzicht</a></p>
    </div>`;
  }

  const totaalVragen = FAQ_GROEPEN.reduce((s, g) => s + g.vragen.length, 0);

  return `
    <nav class="kruimels schermonly" aria-label="Kruimelpad"><a href="#/">Overzicht</a> <span>›</span> Begeleidersgids</nav>

    <header class="titelblok gids-kop">
      <span class="code groot icoongroot" aria-hidden="true">🧭</span>
      <div>
        <h1>Begeleidersgids</h1>
        <p>Alles wat je nodig hebt om deze workshops te geven, los van één draaiboek.</p>
        <div class="etiketten">
          <span class="etiket-klein">${GIDS_SECTIES.length} onderdelen</span>
          <span class="etiket-klein">${totaalVragen} lastige vragen</span>
        </div>
      </div>
    </header>

    <div class="besturing schermonly">
      <button class="knop stil" data-actie="print">Gids afdrukken</button>
    </div>

    ${GIDS_SECTIES.map(
      (s) => `
      <section class="kaart gids-sectie">
        <h2><span aria-hidden="true">${s.icoon}</span> ${esc(s.titel)}</h2>
        <p class="gids-inleiding">${esc(s.inleiding)}</p>
        <dl>
          ${s.punten
            .map((p) => `<dt>${esc(p.kop)}</dt><dd>${esc(p.tekst)}</dd>`)
            .join('')}
        </dl>
      </section>`
    ).join('')}

    ${
      totaalVragen
        ? `
      <section class="gids-faq">
        <h2>Lastige vragen, en wat je erop antwoordt</h2>
        <p class="gids-inleiding">
          Deze vragen komen. Wuif ze niet weg — sommige bezwaren zijn terecht, en de
          zaal kijkt hoe je ermee omgaat.
        </p>
        ${FAQ_GROEPEN.map(
          (g) => `
          <h3 class="faq-groep">${esc(g.titel)}</h3>
          ${g.vragen
            .map(
              (v) => `
            <details class="faq">
              <summary>${esc(v.vraag)}</summary>
              <div class="faq-lijf">
                <p>${esc(v.antwoord)}</p>
                <p class="faq-tip"><span>Regie</span> ${esc(v.tip)}</p>
              </div>
            </details>`
            )
            .join('')}`
        ).join('')}
      </section>`
        : ''
    }

    <nav class="verder schermonly" aria-label="Verder"><a class="knop stil" href="#/"><span aria-hidden="true">←</span> Terug naar het overzicht</a></nav>`;
}

// ─────────────────────── promptkaart ───────────────────────

function toonPromptkaart() {
  const perSpoor = SPOREN.map((spoor) => {
    const modules = modulesVanSpoor(spoor.id);
    return { spoor, prompts: blokkenVanType(modules, 'prompt') };
  }).filter((g) => g.prompts.length);

  const totaal = perSpoor.reduce((s, g) => s + g.prompts.length, 0);

  return `
    <nav class="kruimels schermonly" aria-label="Kruimelpad"><a href="#/">Overzicht</a> <span>›</span> Promptkaart</nav>

    <header class="titelblok">
      <span class="code groot icoongroot" aria-hidden="true">📇</span>
      <div>
        <h1>Promptkaart</h1>
        <p>Alle promptvoorbeelden uit de cursus op één plek, om te kopiëren of af te drukken.</p>
        <div class="etiketten"><span class="etiket-klein">${totaal} prompts</span></div>
      </div>
    </header>

    <div class="besturing schermonly">
      <button class="knop stil" data-actie="print">Promptkaart afdrukken</button>
    </div>

    ${perSpoor
      .map(
        (g) => `
      <section class="spoor ${g.spoor.kleur}">
        <div class="spoor-kop">
          <div><h2>${esc(g.spoor.naam)}</h2></div>
          <span class="tool-vlag">${esc(g.spoor.tools)}</span>
        </div>
        ${g.prompts
          .map(({ blok, module }) => {
            // De herkomst drukt mee af: op papier moet je kunnen zien bij welke
            // module en welke sessie een prompt hoort. Enkel de link is schermwerk.
            const codes = workshopsVoorModule(module.id).map((w) => w.code);
            const bij = codes.length
              ? ` — ${codes.length > 1 ? 'workshops' : 'workshop'} ${codes.join(' en ')}`
              : '';
            return `
          <figure class="promptblok">
            <figcaption>
              <span>${esc(blok.titel)}</span>
              <span class="kaart-acties">
                <span class="herkomst"><span aria-hidden="true">${module.icoon}</span> ${esc(module.titel)}${esc(bij)}</span>
                <a class="herkomst-link schermonly" href="#/module/${module.id}">openen</a>
                <button class="knop mini schermonly" data-actie="kopieer">Kopieer</button>
              </span>
            </figcaption>
            <pre><code>${esc(blok.tekst)}</code></pre>
            ${blok.uitleg ? `<p class="promptuitleg">${blok.uitleg}</p>` : ''}
          </figure>`;
          })
          .join('')}
      </section>`
      )
      .join('')}

    <nav class="verder schermonly" aria-label="Verder"><a class="knop stil" href="#/"><span aria-hidden="true">←</span> Terug naar het overzicht</a></nav>`;
}

// ───────────────────────────── interactie ─────────────────────────────

document.addEventListener('click', (e) => {
  const knop = e.target.closest('[data-actie]');
  if (!knop) return;
  const actie = knop.dataset.actie;

  if (actie === 'begeleider') {
    staat.begeleider = !staat.begeleider;
    bewaarOpslag();
    navigeer();
    return;
  }

  if (actie === 'vink') {
    // Niet de hele pagina hertekenen: dat wist beantwoorde quizvragen en
    // opengeklapte casussen, en gooit je terug naar de bovenkant van de module.
    const s = knop.dataset.sleutel;
    const wordtAf = !staat.afgewerkt.has(s);
    if (wordtAf) staat.afgewerkt.add(s);
    else staat.afgewerkt.delete(s);
    bewaarOpslag();

    knop.classList.toggle('aan', wordtAf);
    knop.setAttribute('aria-pressed', String(wordtAf));
    knop.innerHTML = wordtAf ? VINK_AF : VINK_OPEN;
    knop.closest('.les')?.classList.toggle('af', wordtAf);

    // De teller in de modulekop telt gewoon opnieuw wat er op het scherm staat.
    const teller = document.getElementById('module-teller');
    if (teller) {
      const totaal = document.querySelectorAll('.les').length;
      const klaar = document.querySelectorAll('.les.af').length;
      teller.textContent = `${klaar}/${totaal} afgewerkt`;
    }

    tekenKop(); // de voortgangsbalk bovenaan
    return;
  }

  if (actie === 'sessie') {
    staat.sessieStart = staat.sessieStart ? null : Date.now();
    bewaarOpslag();
    navigeer();
    return;
  }

  if (actie === 'print') {
    openDetailsVoorAfdruk();
    window.print();
    return;
  }

  // ── de sessiebouwer ──
  // Allemaal hetzelfde patroon: de sessie in bouwerSessie wijzigen en daarna
  // bouwerGewijzigd() de kolom, de voorraad en het adres laten bijwerken.

  if (actie === 'deel-toevoegen') {
    if (!bouwerActief()) return;
    const deel = deelUitCode(knop.dataset.sleutel);
    behoudPlek(knop, () => {
      if (deel) bouwerSessie.delen.push(deel);
      bouwerGewijzigd();
    });
    if (deel) bevestigToevoeging(knop);
    return;
  }

  if (actie === 'deel-weg' || actie === 'deel-omhoog' || actie === 'deel-omlaag') {
    if (!bouwerActief()) return;
    const delen = bouwerSessie.delen;
    const i = Number(knop.dataset.i);
    if (!Number.isInteger(i) || i < 0 || i >= delen.length) return;
    if (actie === 'deel-weg') {
      delen.splice(i, 1);
    } else {
      const naar = actie === 'deel-omhoog' ? i - 1 : i + 1;
      if (naar < 0 || naar >= delen.length) return;
      [delen[i], delen[naar]] = [delen[naar], delen[i]];
      // De focus verhuist mee met het blok dat je verplaatst.
      knop.dataset.i = String(naar);
    }
    bouwerGewijzigd();
    return;
  }

  if (actie === 'pauze-invoegen') {
    if (!bouwerActief()) return;
    voegPauzeIn(bouwerSessie);
    bouwerGewijzigd();
    return;
  }

  if (actie === 'sjabloon') {
    if (!bouwerActief()) return;
    const sjabloon = SJABLONEN.find((s) => s.id === knop.dataset.id);
    if (!sjabloon) return;
    const uitSjabloon = sessieUitCode(sjabloon.d);
    bouwerSessie.delen = uitSjabloon.delen;
    bouwerSessie.onbekend = uitSjabloon.onbekend;
    if (!bouwerSessie.naam) bouwerSessie.naam = sjabloon.naam;
    if (!bouwerSessie.doelduur) bouwerSessie.doelduur = sessieMinuten(uitSjabloon);
    bouwerGewijzigd();
    return;
  }

  if (actie === 'sessie-leeg') {
    if (!bouwerActief()) return;
    bouwerSessie.delen = [];
    bouwerSessie.onbekend = [];
    bouwerGewijzigd();
    return;
  }

  if (actie === 'sessie-link') {
    if (!bouwerActief()) return;
    kopieerSessielink(knop);
    return;
  }

  if (actie === 'kopieer') {
    const code = knop.closest('.promptblok')?.querySelector('code');
    if (!code) return;
    const melding = (tekst) => {
      knop.textContent = tekst;
      setTimeout(() => (knop.textContent = 'Kopieer'), 2200);
    };
    const mislukt = () => {
      // Zonder https bestaat navigator.clipboard niet — bijvoorbeeld op een
      // schoolserver via http://192.168.x.x. Selecteer de prompt dan zelf,
      // zodat kopiëren met het toetsenbord of via lang indrukken nog werkt.
      try {
        const bereik = document.createRange();
        bereik.selectNodeContents(code);
        const selectie = window.getSelection();
        if (!selectie) return melding('Kopieer de prompt zelf');
        selectie.removeAllRanges();
        selectie.addRange(bereik);
        melding('Staat geselecteerd — kopieer zelf');
      } catch {
        melding('Kopieer de prompt zelf');
      }
    };
    if (!navigator.clipboard) return mislukt();
    navigator.clipboard.writeText(code.textContent).then(() => melding('Gekopieerd'), mislukt);
    return;
  }

  if (actie === 'casus') {
    const casus = knop.closest('[data-casus]');
    const open = casus.classList.toggle('open');
    knop.setAttribute('aria-expanded', String(open));
    knop.textContent = open ? 'Verberg het oordeel' : 'Toon het oordeel';
    return;
  }

  if (actie === 'quiz') {
    const quiz = knop.closest('[data-quiz]');
    if (quiz.classList.contains('beantwoord')) return;
    quiz.classList.add('beantwoord');
    quiz.querySelectorAll('.optie').forEach((o) => {
      o.classList.add(o.dataset.juist === 'true' ? 'is-juist' : 'is-fout');
      o.setAttribute('aria-disabled', 'true');
    });
    knop.classList.add('gekozen');
    quiz.querySelector('.quiz-uitslag').textContent =
      knop.dataset.juist === 'true'
        ? 'Juist gekozen.'
        : 'Niet juist. Het juiste antwoord staat nu aangeduid.';
  }
});

document.addEventListener('change', (e) => {
  const veld = e.target;

  if (veld.id === 'startuur') {
    if (!veld.value) return; // half ingevuld tijdveld geeft een lege waarde
    staat.startuur = veld.value;
    bewaarOpslag();
    if (bouwerActief()) {
      // Enkel de balk en de link bijwerken: de kolom hertekenen zou het
      // tijdveld vervangen waar je net in typt.
      bouwerSessie.startuur = staat.startuur;
      bewaarBouwer();
      werkBalkBij();
    } else {
      werkKloktijdenBij();
      werkSessieAdresBij();
    }
    return;
  }

  if (!bouwerActief()) return;

  if (veld.id === 'sessie-doelduur') {
    // Door sessieUitCode heen, zodat cursus.js de enige plek blijft die
    // beslist welke duur geldig is.
    bouwerSessie.doelduur = sessieUitCode({ t: veld.value }).doelduur;
    bouwerGewijzigd();
    return;
  }

  if (veld.dataset.actie === 'deel-minuten') {
    const leeg = String(veld.value).trim() === '';
    pasDeelAan(Number(veld.dataset.i), { eigenMinuten: leeg ? null : veld.value });
    bouwerGewijzigd();
    return;
  }

  if (veld.dataset.actie === 'deel-titel') {
    pasDeelAan(Number(veld.dataset.i), { eigenTitel: veld.value.trim() });
    bouwerGewijzigd();
  }
});

// De naam werkt op 'input' en hertekent niets: anders ben je bij elke
// toetsaanslag het veld kwijt waar je net in typt.
document.addEventListener('input', (e) => {
  if (e.target.id !== 'sessie-naam' || !bouwerActief()) return;
  bouwerSessie.naam = sessieUitCode({ n: e.target.value }).naam;
  bewaarBouwer();
});

// Op een sessieroute hoort het startuur in de link te staan, anders opent de
// collega aan wie je hem doorstuurt op een ander uur dan jij bedoelde.
function werkSessieAdresBij() {
  const r = route();
  if (r.naam !== 'sessie') return;
  const sessie = sessieUitCode(r.vraag);
  sessie.startuur = staat.startuur === '09:00' ? '' : staat.startuur;
  vervangAdres(sessieNaarHash(sessie, r.id === 'bouwer' ? '' : r.id));
}

// Een gesloten <details> drukt zijn inhoud niet af: de browser verbergt die via
// ::details-content, en daar komt CSS op het kind (.faq-lijf) niet tegenop.
// Daarom de antwoorden en regietips openzetten vlak voor het afdrukken.
// Ze blijven daarna openstaan, dat is na een afdruk het gewenste gedrag.
function openDetailsVoorAfdruk() {
  document.querySelectorAll('details:not([open])').forEach((d) => {
    d.open = true;
  });
}

window.addEventListener('beforeprint', openDetailsVoorAfdruk);

window.addEventListener('hashchange', navigeer);
navigeer();
