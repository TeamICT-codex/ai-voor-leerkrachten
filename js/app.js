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
  metKloktijden,
  naarKlok,
} from './cursus.js';

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
                 <button class="knop stil" data-actie="print">Afdrukken</button>`
              : ''
          }
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
