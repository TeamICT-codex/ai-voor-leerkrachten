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
  const leeg = { begeleider: false, startuur: '09:00', afgewerkt: [] };
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    if (!ruw) return leeg;
    const data = JSON.parse(ruw);
    return { ...leeg, ...data, afgewerkt: Array.isArray(data.afgewerkt) ? data.afgewerkt : [] };
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
  sessieStart: null, // tijdstip waarop de begeleider op "Start sessie" klikte
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

function moduleVoortgang(module) {
  const klaar = module.lessen.filter((l) => staat.afgewerkt.has(lesSleutel(module.id, l.id))).length;
  return { klaar, totaal: module.lessen.length };
}

function totaleVoortgang() {
  return { klaar: staat.afgewerkt.size, totaal: TOTAAL_LESSEN };
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
  if (delen[0] === 'workshop' && delen[1]) return { naam: 'workshop', id: delen[1] };
  if (delen[0] === 'module' && delen[1]) return { naam: 'module', id: delen[1] };
  if (delen[0] === 'bundel' && delen[1]) return { naam: 'bundel', id: delen[1] };
  if (delen[0] === 'gids') return { naam: 'gids' };
  if (delen[0] === 'prompts') return { naam: 'prompts' };
  return { naam: 'home' };
}

function navigeer() {
  stopTikker();
  const r = route();
  const hoofd = document.getElementById('hoofd');

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
  } else {
    hoofd.innerHTML = toonHome();
  }

  tekenKop();
  window.scrollTo(0, 0);
}

function toonNietGevonden() {
  return `<div class="kaart leeg">
    <h2>Niet gevonden</h2>
    <p>Dit onderdeel bestaat niet (meer). <a href="#/">Terug naar het overzicht</a>.</p>
  </div>`;
}

// ───────────────────────────── kop ─────────────────────────────

function tekenKop() {
  const { klaar, totaal } = totaleVoortgang();
  const pct = totaal ? Math.round((klaar / totaal) * 100) : 0;
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
        met AI werkten. Zes workshops van drie uur, met alles erbij om ze zelf te geven:
        draaiboeken met timing, oefeningen, en de inhoud om achteraf zelfstandig door te nemen.
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
        <a class="snel" href="#/prompts">
          <span class="snel-icoon">📇</span>
          <span><strong>Promptkaart</strong><small>Alle prompts op één plek</small></span>
        </a>
        ${
          staat.begeleider
            ? `<a class="snel" href="#/gids">
                 <span class="snel-icoon">🧭</span>
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

      <details class="modulelijst">
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
        <span class="icoon">${m.icoon}</span>
        <span class="niveau">${esc(m.niveau)}</span>
      </div>
      <h3>${esc(m.titel)}</h3>
      <p>${esc(m.ondertitel)}</p>
      <div class="kaart-voet">
        <span>${esc(m.duur)}</span>
        <span class="${af ? 'klaar' : ''}">${klaar}/${totaal} lessen${af ? ' ✓' : ''}</span>
      </div>
    </a>`;
}

// ───────────────────────────── workshop ─────────────────────────────

function toonWorkshop(w) {
  const spoor = vindSpoor(w.spoor);
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
        <h3>Voor wie</h3>
        <p>${esc(w.doelgroep)}</p>
        <h3>Voorkennis</h3>
        <p>${esc(w.voorkennis)}</p>
      </div>
      <div class="kaart info">
        <h3>Wat de deelnemers meenemen</h3>
        <ul class="vinkjes">${w.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      </div>
    </div>

    ${
      staat.begeleider
        ? `
      <div class="kaart benodigd">
        <h3>Vooraf klaarzetten</h3>
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
  const heeftModule = b.module ? vindModule(b.module) : null;
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
          heeftModule
            ? `<a class="module-link" href="#/module/${heeftModule.id}">
                 ${heeftModule.icoon} Inhoud: ${esc(heeftModule.titel)} →
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

  document.querySelectorAll('.blok').forEach((el, i) => {
    el.classList.toggle('nu', i === actief);
    el.classList.toggle('voorbij', actief >= 0 && i < actief);
    const oud = el.querySelector('.nu-vlag');
    if (oud) oud.remove();
    if (i === actief) {
      const vlag = document.createElement('span');
      vlag.className = 'nu-vlag';
      vlag.textContent = `nu — nog ${resterend} min`;
      el.querySelector('.blok-kop').appendChild(vlag);
    }
  });

  if (actief === -1 && verstreken > loper) {
    const laatste = document.querySelector('.blok:last-child');
    if (laatste && !laatste.querySelector('.nu-vlag')) {
      laatste.classList.add('voorbij');
    }
  }
}

// ───────────────────────────── module ─────────────────────────────

function toonModule(m) {
  const spoor = vindSpoor(m.spoor);
  const bij = workshopsVoorModule(m.id);
  const { klaar, totaal } = moduleVoortgang(m);

  return `
    <nav class="kruimels"><a href="#/">Overzicht</a> <span>›</span> ${esc(spoor.naam)}</nav>

    <header class="titelblok ${spoor.kleur}">
      <span class="code groot icoongroot">${m.icoon}</span>
      <div>
        <h1>${esc(m.titel)}</h1>
        <p>${esc(m.ondertitel)}</p>
        <div class="etiketten">
          <span class="etiket-klein">${esc(m.duur)}</span>
          <span class="etiket-klein">${esc(m.niveau)}</span>
          <span class="etiket-klein">${klaar}/${totaal} afgewerkt</span>
          ${bij
            .map((w) => `<a class="etiket-klein link" href="#/workshop/${w.id}">${esc(w.code)}</a>`)
            .join('')}
        </div>
      </div>
    </header>

    <div class="kaart doelen">
      <h3>Na deze module</h3>
      <ul class="vinkjes">${m.doelen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>

    ${m.lessen.map((les, i) => toonLes(m, les, i)).join('')}

    <nav class="verder">
      <a class="knop stil" href="#/">← Terug naar het overzicht</a>
    </nav>
  `;
}

function toonLes(module, les, index) {
  const sleutel = lesSleutel(module.id, les.id);
  const af = staat.afgewerkt.has(sleutel);
  return `
    <article class="les ${af ? 'af' : ''}" id="les-${les.id}">
      <div class="les-kop">
        <h2><span class="lesnr">${index + 1}</span> ${esc(les.titel)}</h2>
        <button class="vink ${af ? 'aan' : ''}" data-actie="vink" data-sleutel="${sleutel}">
          ${af ? '✓ Afgewerkt' : 'Markeer als afgewerkt'}
        </button>
      </div>
      ${les.blokken.map(toonInhoudsblok).join('')}
    </article>`;
}

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
          <h4>${esc(blok.titel)}</h4>
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
          <h4>${esc(blok.titel)}</h4>
          <p>${blok.inhoud}</p>
          <ol>${blok.stappen.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        </section>`;

    case 'casus': {
      // Het oordeel blijft verborgen tot de groep zelf beslist heeft — anders
      // leest iedereen gewoon het antwoord en valt het gesprek weg.
      const label = { mag: 'Mag', 'mag-niet': 'Mag niet', 'hangt-ervan-af': 'Hangt ervan af' };
      return `
        <section class="casus" data-casus>
          <h4>${esc(blok.titel)}</h4>
          <p class="casus-situatie">${esc(blok.situatie)}</p>
          <button class="knop mini casus-knop" data-actie="casus">Toon het oordeel</button>
          <div class="casus-antwoord">
            <span class="oordeel oordeel-${esc(blok.oordeel)}">${label[blok.oordeel] || esc(blok.oordeel)}</span>
            <p>${esc(blok.toelichting)}</p>
            ${
              staat.begeleider && blok.discussie
                ? `<p class="casus-discussie"><span>Gooi dit in de groep</span> ${esc(blok.discussie)}</p>`
                : ''
            }
          </div>
        </section>`;
    }

    case 'quiz':
      return `
        <section class="quiz" data-quiz>
          <h4>${esc(blok.vraag)}</h4>
          <div class="opties">
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
        </section>`;

    default:
      return '';
  }
}

// ─────────────────────── deelnemersbundel ───────────────────────
// Afdrukbaar hand-out per workshop: wat je meeneemt, alle prompts en
// opdrachten van de behandelde modules, en ruimte om te noteren.

function toonBundel(w) {
  const spoor = vindSpoor(w.spoor);
  const modules = modulesVanWorkshop(w);
  const prompts = blokkenVanType(modules, 'prompt');
  const opdrachten = blokkenVanType(modules, 'opdracht');

  return `
    <nav class="kruimels schermonly">
      <a href="#/">Overzicht</a> <span>›</span>
      <a href="#/workshop/${w.id}">${esc(w.code)}</a> <span>›</span> Deelnemersbundel
    </nav>

    <div class="bundel">
      <header class="bundel-kop">
        <div>
          <span class="code ${spoor.kleur === 'spoor-vibe' ? 'vibe' : ''}">${esc(w.code)}</span>
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
        <p class="vuistregel">
          Zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen.
          Geen namen van leerlingen, geen zorg- of CLB-gegevens, geen thuissituaties.
          Vervang namen door <code>[LEERLING]</code> — het antwoord wordt er niet minder van.
        </p>
        <p class="vuistregel">
          Het eerste antwoord is een <strong>ontwerp</strong>, geen eindproduct.
          Stuur drie keer bij voor je oordeelt.
          Feiten, cijfers, jaartallen en citaten check je altijd zelf na.
        </p>
      </section>

      ${
        prompts.length
          ? `
      <section class="bundel-blok">
        <h2>Prompts uit deze sessie</h2>
        <p class="bundel-hint schermonly">Deze staan ook online, met een kopieerknop.</p>
        ${prompts
          .map(
            ({ blok, module }) => `
          <figure class="promptblok bundel-prompt">
            <figcaption>
              <span>${esc(blok.titel)}</span>
              <span class="herkomst">${module.icoon} ${esc(module.titel)}</span>
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
            <h4>${esc(blok.titel)}</h4>
            <p>${blok.inhoud}</p>
            <ol>${blok.stappen.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
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
              (m) => `<li><a href="#/module/${m.id}">${m.icoon} ${esc(m.titel)}</a>
                       — ${esc(m.ondertitel)}</li>`
            )
            .join('')}
        </ul>
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
      <span class="code groot icoongroot">🧭</span>
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
        <h2>${s.icoon} ${esc(s.titel)}</h2>
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

    <nav class="verder schermonly"><a class="knop stil" href="#/">← Terug naar het overzicht</a></nav>`;
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
      <span class="code groot icoongroot">📇</span>
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
          .map(
            ({ blok, module }) => `
          <figure class="promptblok">
            <figcaption>
              <span>${esc(blok.titel)}</span>
              <span class="kaart-acties">
                <a class="herkomst-link schermonly" href="#/module/${module.id}">${module.icoon} ${esc(module.titel)}</a>
                <button class="knop mini schermonly" data-actie="kopieer">Kopieer</button>
              </span>
            </figcaption>
            <pre><code>${esc(blok.tekst)}</code></pre>
            ${blok.uitleg ? `<p class="promptuitleg">${blok.uitleg}</p>` : ''}
          </figure>`
          )
          .join('')}
      </section>`
      )
      .join('')}

    <nav class="verder schermonly"><a class="knop stil" href="#/">← Terug naar het overzicht</a></nav>`;
}

// ───────────────────────────── interactie ─────────────────────────────

document.addEventListener('click', (e) => {
  const knop = e.target.closest('[data-actie]');
  if (!knop) return;
  const actie = knop.dataset.actie;

  if (actie === 'begeleider') {
    staat.begeleider = !staat.begeleider;
    staat.sessieStart = null;
    bewaarOpslag();
    navigeer();
    return;
  }

  if (actie === 'vink') {
    const s = knop.dataset.sleutel;
    if (staat.afgewerkt.has(s)) staat.afgewerkt.delete(s);
    else staat.afgewerkt.add(s);
    bewaarOpslag();
    navigeer();
    return;
  }

  if (actie === 'sessie') {
    staat.sessieStart = staat.sessieStart ? null : Date.now();
    navigeer();
    return;
  }

  if (actie === 'print') {
    window.print();
    return;
  }

  if (actie === 'kopieer') {
    const tekst = knop.closest('.promptblok').querySelector('code').textContent;
    navigator.clipboard?.writeText(tekst).then(
      () => {
        knop.textContent = 'Gekopieerd ✓';
        setTimeout(() => (knop.textContent = 'Kopieer'), 1800);
      },
      () => (knop.textContent = 'Lukt niet — selecteer zelf')
    );
    return;
  }

  if (actie === 'casus') {
    knop.closest('[data-casus]').classList.add('open');
    knop.remove();
    return;
  }

  if (actie === 'quiz') {
    const quiz = knop.closest('[data-quiz]');
    if (quiz.classList.contains('beantwoord')) return;
    quiz.classList.add('beantwoord');
    quiz.querySelectorAll('.optie').forEach((o) => {
      o.classList.add(o.dataset.juist === 'true' ? 'is-juist' : 'is-fout');
    });
    knop.classList.add('gekozen');
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'startuur') {
    staat.startuur = e.target.value || '09:00';
    bewaarOpslag();
    navigeer();
  }
});

window.addEventListener('hashchange', navigeer);
navigeer();
