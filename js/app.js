// De volledige app: router, weergave en de kleine beetjes interactie.
// Geen build-stap, geen afhankelijkheden — gewoon een ES-module.

import {
  MODULES,
  WORKSHOPS,
  SPOREN,
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
} from './cursus.js';
import { GIDS_SECTIES, FAQ_GROEPEN } from './gids.js';

// ───────────────────────────── opslag ─────────────────────────────
// Alles in een try/catch: in een privévenster of met geblokkeerde cookies
// gooit localStorage, en dan mag de app niet stukvallen.

const SLEUTEL = 'ai-voor-leerkrachten';

function laadOpslag() {
  const leeg = { begeleider: false, startuur: '09:00', afgewerkt: [], sessieStart: null };
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    if (!ruw) return leeg;
    const data = JSON.parse(ruw);
    const samen = {
      ...leeg,
      ...data,
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
  tikker: null,
};

// ───────────────────────────── hulpjes ─────────────────────────────

function esc(tekst) {
  return String(tekst).replace(/[&<>"']/g, (t) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[t])
  );
}

function lesSleutel(moduleId, lesId) {
  return `${moduleId}/${lesId}`;
}

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

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const delen = hash.split('/').filter(Boolean);
  if (delen[0] === 'workshop') return { naam: 'workshop', id: delen[1] || '' };
  if (delen[0] === 'module') return { naam: 'module', id: delen[1] || '' };
  if (delen[0] === 'bundel') return { naam: 'bundel', id: delen[1] || '' };
  if (delen[0] === 'gids') return { naam: 'gids' };
  if (delen[0] === 'prompts') return { naam: 'prompts' };
  if (delen.length) return { naam: 'onbekend' };
  return { naam: 'home' };
}

function navigeer() {
  stopTikker();
  const r = route();
  const hoofd = document.getElementById('hoofd');

  // Welke pagina er open staat, is ook voor de stylesheet van belang: het
  // afdrukblok toont bij een bundel geen begeleidersbanner.
  document.body.dataset.pagina = r.naam;

  if (r.naam === 'workshop') {
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
  window.scrollTo(0, 0);
}

function toonNietGevonden() {
  return `<div class="kaart leeg">
    <h2>Niet gevonden</h2>
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
  return `
    <section class="onthaal">
      <p class="etiket">Digitale leeromgeving</p>
      <h1>Leren werken met AI, als leerkracht</h1>
      <p class="inleiding">
        Een opleidingstraject voor leerkrachten lager en secundair onderwijs die nog nooit
        met AI werkten. Zes workshops van drie uur.${
          staat.begeleider
            ? ' Met draaiboeken met timing, oefeningen en de inhoud om achteraf zelfstandig door te nemen.'
            : ' Volgde je een sessie, of wil je op eigen houtje starten? Alle inhoud staat hieronder klaar om in je eigen tempo door te nemen.'
        }
      </p>
      <div class="onthaal-cijfers">
        <div><strong>6</strong><span>workshops</span></div>
        <div><strong>3u</strong><span>per sessie, incl. pauze</span></div>
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
            : `<a class="snel" href="#/module/kennismaking">
                 <span class="snel-icoon" aria-hidden="true">🚀</span>
                 <span><strong>Begin hier</strong><small>Nog nooit met AI gewerkt? Start met je eerste gesprek.</small></span>
               </a>`
        }
        <a class="snel" href="#/prompts">
          <span class="snel-icoon" aria-hidden="true">📇</span>
          <span><strong>Promptkaart</strong><small>Alle prompts op één plek</small></span>
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
  return `
    <section class="spoor ${spoor.kleur}">
      <div class="spoor-kop">
        <div>
          <h2>${esc(spoor.naam)}</h2>
          <p>${spoor.omschrijving}</p>
        </div>
        <span class="tool-vlag">${esc(spoor.tools)}</span>
      </div>

      <div class="rooster">
        ${workshops.map(toonWorkshopKaart).join('')}
      </div>

      <details class="modulelijst"${staat.begeleider ? '' : ' open'}>
        <summary>De ${modules.length} inhoudsmodules van dit spoor</summary>
        <div class="rooster smal">
          ${modules.map(toonModuleKaart).join('')}
        </div>
      </details>
    </section>`;
}

function toonWorkshopKaart(w) {
  const blokken = w.draaiboek.filter((b) => b.soort !== 'pauze').length;
  return `
    <a class="kaart workshop" href="#/workshop/${w.id}">
      <div class="kaart-kop">
        <span class="code">${esc(w.code)}</span>
        <span class="duur">3 uur</span>
      </div>
      <h3>${esc(w.titel)}</h3>
      <p>${esc(w.ondertitel)}</p>
      <div class="kaart-voet">
        <span>${blokken} blokken</span>
        <span>${esc(w.groepsgrootte.split('.')[0])}</span>
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
        <span>${esc(m.duur)}</span>
        <span class="${af ? 'klaar' : ''}">${klaar}/${totaal} lessen${af ? ' <span aria-hidden="true">✓</span>' : ''}</span>
      </div>
    </a>`;
}

// ───────────────────────────── workshop ─────────────────────────────

// Terugval als het spoor-id van een workshop of module niet in SPOREN staat
// (tikfout in workshops.js). Zo blijft de pagina staan in plaats van stuk te
// lopen op spoor.naam, en zie je meteen dat er iets mis is met het spoor.
const SPOOR_ONBEKEND = { id: '', naam: 'Onbekend spoor', kleur: '', tools: '' };

function toonWorkshop(w) {
  const spoor = vindSpoor(w.spoor) || SPOOR_ONBEKEND;
  const blokken = metKloktijden(w.draaiboek, staat.startuur);
  const eind = blokken[blokken.length - 1].tot;

  return `
    <nav class="kruimels"><a href="#/">Overzicht</a> <span>›</span> ${esc(spoor.naam)}</nav>

    <header class="titelblok ${spoor.kleur}">
      <span class="code groot">${esc(w.code)}</span>
      <div>
        <h1>${esc(w.titel)}</h1>
        <p>${esc(w.ondertitel)}</p>
        <div class="etiketten">
          <span class="etiket-klein">3 uur incl. pauze</span>
          <span class="etiket-klein">${esc(spoor.tools)}</span>
          <span class="etiket-klein">${esc(w.groepsgrootte.split('.')[0])}</span>
        </div>
      </div>
    </header>

    <div class="tweeluik">
      <div class="kaart info">
        <h2>Voor wie</h2>
        <p>${esc(w.doelgroep)}</p>
        <h2>Voorkennis</h2>
        <p>${esc(w.voorkennis)}</p>
      </div>
      <div class="kaart info">
        <h2>Wat je meeneemt</h2>
        <ul class="vinkjes">${w.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      </div>
    </div>

    ${
      staat.begeleider
        ? `
      <div class="kaart benodigd">
        <h2>Vooraf klaarzetten</h2>
        <ul>${w.benodigdheden.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
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
          <a class="knop stil" href="#/bundel/${w.id}">Deelnemersbundel</a>
        </div>
      </div>

      <ol class="blokken">
        ${blokken.map((b, i) => toonBlok(b, i)).join('')}
      </ol>
    </section>

    ${
      staat.begeleider
        ? `
      <section class="kaart valkuilen">
        <h2>Valkuilen</h2>
        <ul>${w.valkuilen.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
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

function werkTikkerBij() {
  const r = route();
  if (r.naam !== 'workshop' || !staat.sessieStart) return;
  const w = vindWorkshop(r.id);
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
  const r = route();
  if (r.naam !== 'workshop') return;
  const w = vindWorkshop(r.id);
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

  // Een module is zelden het eindpunt: wie ze uitleest, wil door naar de
  // volgende in hetzelfde spoor zonder eerst terug naar het overzicht te moeten.
  const reeks = modulesVanSpoor(m.spoor);
  const i = reeks.findIndex((x) => x.id === m.id);
  const vorige = i > 0 ? reeks[i - 1] : null;
  const volgende = i >= 0 && i < reeks.length - 1 ? reeks[i + 1] : null;

  return `
    <nav class="kruimels"><a href="#/">Overzicht</a> <span>›</span> ${esc(spoor.naam)}</nav>

    <header class="titelblok ${spoor.kleur}">
      <span class="code groot icoongroot" aria-hidden="true">${m.icoon}</span>
      <div>
        <h1>${esc(m.titel)}</h1>
        <p>${esc(m.ondertitel)}</p>
        <div class="etiketten">
          <span class="etiket-klein">${esc(m.duur)}</span>
          <span class="etiket-klein">${esc(m.niveau)}</span>
          <span class="etiket-klein" id="module-teller">${klaar}/${totaal} afgewerkt</span>
          ${bij
            .map((w) => `<a class="etiket-klein link" href="#/workshop/${w.id}">${esc(w.code)}</a>`)
            .join('')}
        </div>
      </div>
    </header>

    <div class="kaart doelen">
      <h2>Na deze module</h2>
      <ul class="vinkjes">${m.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>

    ${m.lessen.map((les, i) => toonLes(m, les, i)).join('')}

    <nav class="verder">
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
        <h2><span class="lesnr">${index + 1}</span> ${esc(les.titel)}</h2>
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

function toonBundel(w) {
  const modules = modulesVanWorkshop(w);
  const prompts = blokkenVanType(modules, 'prompt');
  const opdrachten = blokkenVanType(modules, 'opdracht');
  const casussen = blokkenVanType(modules, 'casus');
  const adres = leeromgevingAdres();

  return `
    <nav class="kruimels schermonly">
      <a href="#/">Overzicht</a> <span>›</span>
      <a href="#/workshop/${w.id}">${esc(w.code)}</a> <span>›</span> Deelnemersbundel
    </nav>

    <div class="bundel">
      <header class="bundel-kop">
        <div>
          <span class="code ${w.spoor === 'vibe' ? 'vibe' : ''}">${esc(w.code)}</span>
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
        <a class="knop stil" href="#/workshop/${w.id}">Terug naar het draaiboek</a>
      </div>

      <section class="bundel-blok">
        <h2>Wat je vandaag meeneemt</h2>
        <ul class="vinkjes">${w.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      </section>

      <section class="bundel-blok">
        <h2>De vuistregel</h2>
        ${
          w.spoor === 'vibe'
            ? `<p class="vuistregel">
                 Online is publiek. Wie de link heeft, ziet alles op je pagina — ook de tekst die
                 enkel in de code zit, zoals de juiste antwoorden. Geen leerlingnamen, geen
                 antwoordsleutels, geen toets die je nog moet afnemen. Dezelfde regel geldt voor
                 wat je in het gesprek typt. Bouw anoniem, tenzij het écht niet anders kan: een
                 klasnummer of een zelfgekozen bijnaam volstaat bijna altijd.
               </p>
               <p class="vuistregel">
                 De eerste versie is een <strong>ontwerp</strong>, geen eindproduct. Klik ze zelf
                 kapot — lege velden, rare invoer, en op het toestel waarop je leerlingen werken.
                 Loopt er iets mis, beschrijf dan wat je deed, wat er gebeurde en wat er had moeten
                 gebeuren; de code lezen hoeft niet. En bewaar een werkende versie vóór je een grote
                 wijziging vraagt, dan kan je altijd terug.
               </p>`
            : `<p class="vuistregel">
                 Zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen.
                 Geen namen van leerlingen, geen zorg- of CLB-gegevens, geen thuissituaties.
                 Vervang namen door <code>[LEERLING]</code> — het antwoord wordt er niet minder van.
               </p>
               <p class="vuistregel">
                 Het eerste antwoord is een <strong>ontwerp</strong>, geen eindproduct.
                 Stuur drie keer bij voor je oordeelt.
                 Feiten, cijfers, jaartallen en citaten check je altijd zelf na.
               </p>`
        }
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
      </section>

      <section class="bundel-blok notities">
        <h2>Eén ding dat ik volgende week doe</h2>
        <div class="lijnen">${'<i></i>'.repeat(3)}</div>
        <h2>Notities</h2>
        <div class="lijnen">${'<i></i>'.repeat(10)}</div>
      </section>
    </div>`;
}

// ─────────────────────── begeleidersgids ───────────────────────

function toonGids() {
  if (!staat.begeleider) {
    return `<div class="kaart leeg">
      <h2>Begeleidersgids</h2>
      <p>Deze gids is bedoeld voor wie de workshops geeft. Zet
         <strong>begeleidersmodus</strong> aan rechtsboven om ze te bekijken.</p>
      <p><a href="#/">Terug naar het overzicht</a></p>
    </div>`;
  }

  const totaalVragen = FAQ_GROEPEN.reduce((s, g) => s + g.vragen.length, 0);

  return `
    <nav class="kruimels schermonly"><a href="#/">Overzicht</a> <span>›</span> Begeleidersgids</nav>

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

    <nav class="verder schermonly"><a class="knop stil" href="#/"><span aria-hidden="true">←</span> Terug naar het overzicht</a></nav>`;
}

// ─────────────────────── promptkaart ───────────────────────

function toonPromptkaart() {
  const perSpoor = SPOREN.map((spoor) => {
    const modules = modulesVanSpoor(spoor.id);
    return { spoor, prompts: blokkenVanType(modules, 'prompt') };
  }).filter((g) => g.prompts.length);

  const totaal = perSpoor.reduce((s, g) => s + g.prompts.length, 0);

  return `
    <nav class="kruimels schermonly"><a href="#/">Overzicht</a> <span>›</span> Promptkaart</nav>

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

    <nav class="verder schermonly"><a class="knop stil" href="#/"><span aria-hidden="true">←</span> Terug naar het overzicht</a></nav>`;
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
    navigator.clipboard.writeText(code.textContent).then(() => melding('Gekopieerd ✓'), mislukt);
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
  if (e.target.id !== 'startuur') return;
  if (!e.target.value) return; // half ingevuld tijdveld geeft een lege waarde
  staat.startuur = e.target.value;
  bewaarOpslag();
  werkKloktijdenBij();
});

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
