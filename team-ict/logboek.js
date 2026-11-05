// Het logboek ("Wat is er nieuw?"): alle berichten van Team ICT, met labels voor
// wie, welke school en waarover. Bovenaan kies je je rol en je school (dat blijft
// alleen op dit toestel bewaard); "Op de agenda" toont wat nog moet gebeuren; een
// zoekveld en de onderwerpen vinden ook oude berichten terug. De berichten staan
// per schooljaar: het nieuwste open, de oudere ingeklapt. Elk bericht heeft een
// vaste link, #bericht-<id>, die het altijd toont, wat je ook gekozen hebt.
// De gegevens staan in nieuws.js en labels.js.
import { NIEUWS } from './nieuws.js';
import { ROLLEN, NIVEAUS, SCHOLEN, SCHOOLGROEPEN, THEMAS, SOORTEN } from './labels.js';
import { HANGIJZERS, BIJGEWERKT } from './informatie.js';
import { esc, datumTekst, woordenVan, zoekwoorden } from './tekst.js';

const per = lijst => Object.fromEntries(lijst.map(x => [x.id, x]));
const ROL = per(ROLLEN), NIVEAU = per(NIVEAUS), SCHOOL = per(SCHOLEN), THEMA = per(THEMAS), SOORT = per(SOORTEN), DOSSIER = per(HANGIJZERS);

// Het nieuwste eerst; berichten van dezelfde dag houden hun volgorde uit nieuws.js.
export const BERICHTEN = [...NIEUWS].sort((a, b) => b.datum.localeCompare(a.datum));
// Welk (nieuwer) bericht maakt een bericht achterhaald?
const VERVANGEN_DOOR = {};
for (const n of BERICHTEN) for (const oud of n.vervangt || []) VERVANGEN_DOOR[oud] ??= n;

// Wat het zoekveld van een bericht kent: de tekst en de namen van al zijn labels.
const ZOEK = new Map(BERICHTEN.map(n => [n, woordenVan([
  n.titel, n.tekst, n.taak,
  ...(n.thema || []).map(t => `${THEMA[t]?.naam ?? ''} ${THEMA[t]?.zoek ?? ''}`),
  ...(n.voor || []).map(r => ROL[r]?.naam),
  ...(n.niveaus || []).map(x => NIVEAU[x]?.naam),
  ...(n.scholen || []).map(s => `${SCHOOL[s]?.naam ?? ''} ${SCHOOL[s]?.waar ?? ''}`),
  DOSSIER[n.dossier]?.label, DOSSIER[n.dossier]?.titel, SOORT[n.soort || 'info']?.naam,
].filter(Boolean).join(' '))]));

// ── datums ──
const isoVan = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const VANDAAG = isoVan(new Date());
const MORGEN = isoVan(new Date(Date.now() + 864e5));
const dagenTot = iso => Math.round((Date.parse(iso) - Date.parse(VANDAAG)) / 864e5);
// Het schooljaar loopt van september tot en met augustus.
function schooljaar(iso) {
  const [j, m] = iso.split('-').map(Number);
  return m >= 9 ? `${j}-${j + 1}` : `${j - 1}-${j}`;
}
const maandVan = iso => iso.slice(0, 7);
// In de agenda: "vandaag", "morgen", of de datum zonder jaar als het dit jaar is.
function dag(iso) {
  if (iso === VANDAAG) return 'vandaag';
  if (iso === MORGEN) return 'morgen';
  return datumTekst(iso, { zonderJaar: iso.slice(0, 4) === VANDAAG.slice(0, 4) });
}
const hoofdletter = s => s.charAt(0).toUpperCase() + s.slice(1);
function periode(n, kort) {
  const d = kort ? dag : datumTekst;
  if (!n.tot || n.tot === n.op) return kort ? hoofdletter(d(n.op)) : `Op ${d(n.op)}`;
  if (kort && n.op < VANDAAG) return `Nog tot ${d(n.tot)}`;
  return `Van ${d(n.op)} tot ${d(n.tot)}`;
}

// ── wat je kiest: je rol en je school, alleen op dit toestel ──
const SLEUTEL_PROFIEL = 'teamict-profiel', SLEUTEL_BEZOEK = 'teamict-vorig-bezoek', SLEUTEL_GEZIEN = 'teamict-gezien';
function leesProfiel() {
  try {
    const p = JSON.parse(localStorage.getItem(SLEUTEL_PROFIEL) || '{}');
    // Een rol of school die niet meer bestaat, valt weg.
    return { rol: ROL[p.rol] ? p.rol : '', school: SCHOOL[p.school] ? p.school : '', alleen: p.alleen !== false };
  } catch { return { rol: '', school: '', alleen: true }; }
}
function bewaarProfiel(p) {
  try { localStorage.setItem(SLEUTEL_PROFIEL, JSON.stringify(p)); } catch { /* privévenster: dan onthouden we niets */ }
}
// Wat is nieuw sinds je vorige bezoek? De pagina onthoudt welke berichten er toen
// al stonden (hun id), niet alleen de datum: een bericht dat later op de dag van
// je vorige bezoek verscheen, is dan toch nieuw. Wat je vorige keer zag, blijft
// gelden zolang dit tabblad open is, zodat herladen de labels niet wegveegt. Bij
// een eerste bezoek is niets "nieuw": anders zou alles het zijn.
let vorigBezoek = '', gezien = null;
try {
  let vorige = sessionStorage.getItem(SLEUTEL_GEZIEN);
  if (vorige === null) {
    vorige = JSON.stringify({ datum: localStorage.getItem(SLEUTEL_BEZOEK) || '', ids: JSON.parse(localStorage.getItem(SLEUTEL_GEZIEN) || 'null') });
    sessionStorage.setItem(SLEUTEL_GEZIEN, vorige);
  }
  ({ datum: vorigBezoek, ids: gezien } = JSON.parse(vorige));
  gezien = Array.isArray(gezien) ? new Set(gezien) : null;
  localStorage.setItem(SLEUTEL_BEZOEK, VANDAAG);
  localStorage.setItem(SLEUTEL_GEZIEN, JSON.stringify(NIEUWS.map(n => n.id)));
} catch { vorigBezoek = ''; gezien = null; }
const isNieuw = n => !!gezien && !gezien.has(n.id);

const heeftProfiel = p => !!(p.rol || p.school);
// Past een bericht bij je rol en je school? Wat geen rol, niveau of school
// noemt, is voor iedereen.
export function past(n, p) {
  if (p.rol && n.voor?.length && !n.voor.includes(p.rol)) return false;
  if (p.school) {
    if (n.scholen?.length && !n.scholen.includes(p.school)) return false;
    if (n.niveaus?.length && !n.niveaus.some(x => SCHOOL[p.school].niveaus.includes(x))) return false;
  }
  return true;
}

// "A", "A en B", "A, B en C"
const opsomming = l => l.length > 1 ? `${l.slice(0, -1).join(', ')} en ${l.at(-1)}` : l.join('');

// ── een bericht ──
function voorWie(n, { kort = false } = {}) {
  const delen = [];
  if (n.voor?.length) delen.push(n.voor.map(r => esc(ROL[r].naam)).join(', '));
  if (n.niveaus?.length) delen.push(n.niveaus.map(x => esc(kort ? NIVEAU[x].kort : NIVEAU[x].naam)).join(', '));
  if (n.scholen?.length) {
    delen.push(kort && n.scholen.length > 2 ? `${n.scholen.length} scholen`
      : n.scholen.map(s => `<span title="${esc(SCHOOL[s].naam)}">${esc(SCHOOL[s].kort)}</span>`).join(', '));
  }
  return delen.join(' · ');
}

function postHtml(n, { toonKnop, uitzondering }) {
  const soort = n.soort && n.soort !== 'info' ? SOORT[n.soort] : null;
  const door = VERVANGEN_DOOR[n.id];
  const wie = voorWie(n);
  const vervangt = (n.vervangt || []).map(id => BERICHTEN.find(b => b.id === id)).filter(Boolean);
  const dossier = DOSSIER[n.dossier];
  const wanneer = [
    // Met een uiterste datum én een dag (inschrijven tot, en de workshop zelf) hoort
    // de taak bij de uiterste datum.
    n.tegen ? `<p class="taak"><strong>Uiterlijk ${esc(datumTekst(n.tegen))}</strong>${n.taak ? ': ' + esc(n.taak) : ''}</p>` : '',
    n.op ? `<p class="taak"><strong>${esc(periode(n, false))}</strong>${n.taak && !n.tegen ? ': ' + esc(n.taak) : ''}</p>` : '',
  ].join('');
  return `<li class="post${door ? ' achterhaald' : ''}${n.id === uitzondering ? ' via-link' : ''}" id="bericht-${esc(n.id)}">
    <div class="post-kop">
      <a class="post-datum" href="#bericht-${esc(n.id)}"><time datetime="${esc(n.datum)}">${esc(datumTekst(n.datum))}</time><span class="verborgen-tekst">: vaste link naar dit bericht</span></a>
      ${isNieuw(n) ? '<span class="nieuw-label">Nieuw</span>' : ''}
      ${door ? '<span class="soort achterhaald">Achterhaald</span>' : soort ? `<span class="soort ${esc(n.soort)}">${esc(soort.naam)}</span>` : ''}
    </div>
    <h3>${esc(n.titel)}</h3>
    ${wie ? `<p class="voor-wie"><span class="voor-label">Voor</span> ${wie}</p>` : ''}
    <p class="post-tekst">${esc(n.tekst)}</p>
    ${wanneer}
    ${door ? `<p class="achterhaald-melding">Dit klopt niet meer. Lees het nieuwere bericht: <a href="#bericht-${esc(door.id)}">${esc(door.titel)}</a> (${esc(datumTekst(door.datum))}).</p>` : ''}
    ${vervangt.length ? `<p class="vervangt">Dit vervangt ${opsomming(vervangt.map(v => `<a href="#bericht-${esc(v.id)}">${esc(v.titel)}</a> (${esc(datumTekst(v.datum))})`))}.</p>` : ''}
    ${n.bijgewerkt ? `<p class="bijgewerkt-op">Bijgewerkt op ${esc(datumTekst(n.bijgewerkt))}.</p>` : ''}
    <div class="tags">
      ${(n.thema || []).map(t => `<button type="button" class="tag" data-thema="${esc(t)}"><span class="verborgen-tekst">Alle berichten over </span>${esc(THEMA[t].naam)}</button>`).join('')}
      ${dossier ? (dossier.afgerond ? `<span class="tag dossier">Dossier: ${esc(dossier.label)}</span>`
        : `<a class="tag dossier" href="#hangijzer-${esc(dossier.id)}">Dossier: ${esc(dossier.label)}</a>`) : ''}
    </div>
    <div class="knoppen">
      ${n.link ? `<a class="knop klein" href="${esc(n.link.url)}">${esc(n.link.tekst)}</a>` : ''}
      ${n.toon ? toonKnop(n.toon, { tekst: n.toon.startsWith('#') ? 'Lees meer' : 'Toon in de raket' }) : ''}
      <button type="button" class="kopieer" data-bericht="${esc(n.id)}">Kopieer de link<span class="verborgen-tekst"> naar het bericht ${esc(n.titel)}</span></button>
    </div>
  </li>`;
}

// Berichten per maand, met de maand erboven.
function perMaand(lijst, opties) {
  const groepen = [];
  for (const n of lijst) {
    const m = maandVan(n.datum);
    if (groepen.at(-1)?.m !== m) groepen.push({ m, lijst: [] });
    groepen.at(-1).lijst.push(n);
  }
  return groepen.map(g => `<div class="maand"><p class="maand-kop">${esc(hoofdletter(datumTekst(g.m)))}</p>
    <ol class="logboek">${g.lijst.map(n => postHtml(n, opties)).join('')}</ol></div>`).join('');
}

// Wat nog moet komen: een uiterste datum (tegen) of een dag (op, tot) die nog niet
// voorbij is. sleutel: de datum waarop het in de agenda gesorteerd staat; wat: de
// zin erbij. De taak hoort bij de uiterste datum; de dag zelf krijgt de titel.
function agendaVan(berichten) {
  return berichten.filter(n => !VERVANGEN_DOOR[n.id]).flatMap(n => [
    n.tegen && n.tegen >= VANDAAG ? { n, sleutel: n.tegen, wanneer: `Uiterlijk ${dag(n.tegen)}`, wat: n.taak || n.titel } : null,
    n.op && (n.tot || n.op) >= VANDAAG ? { n, sleutel: n.op < VANDAAG ? VANDAAG : n.op, wanneer: periode(n, true), wat: n.taak && !n.tegen ? n.taak : n.titel } : null,
  ].filter(Boolean)).sort((a, b) => a.sleutel.localeCompare(b.sleutel));
}

// ── het logboek op de pagina ──
const EERSTE = 6; // zoveel berichten van het nieuwste schooljaar staan er meteen
const AGENDA_EERST = 5;
const aantal = (k, een, meer) => `${k} ${k === 1 ? een : meer}`;

export function bouwLogboek({ toonKnop }) {
  const vak = document.querySelector('.nieuwsoverzicht');
  if (!vak) return null;
  const $ = s => vak.querySelector(s);
  const rolKeuze = $('#mijn-rol'), schoolKeuze = $('#mijn-school'), alleenKeuze = $('#alleen-voor-mij');
  const zoek = $('#zoek-nieuws'), themaVak = $('.thema-filter'), telling = $('.nieuws-telling');
  const andereKnop = $('.toon-andere'), lijst = $('.logboek-lijst');
  const agenda = $('.agenda'), agendaLijst = $('.agenda-lijst'), agendaMeer = $('.agenda-meer');
  const melding = $('.nieuws-melding');
  // Een korte melding voor een schermlezer, zoals "de link staat op je klembord".
  let meldWekker;
  function aankondig(tekst) {
    clearTimeout(meldWekker);
    melding.textContent = '';
    meldWekker = setTimeout(() => {
      melding.textContent = tekst;
      meldWekker = setTimeout(() => { melding.textContent = ''; }, 8e3);
    }, 150);
  }

  let profiel = leesProfiel();
  let thema = '';
  let uitgeklapt = false, agendaHeel = false;
  let uitzondering = null;
  const openJaren = new Set();
  const stil = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // De keuzelijsten
  rolKeuze.innerHTML = '<option value="">Alle rollen</option>' + ROLLEN.map(r => `<option value="${esc(r.id)}">${esc(r.ik)}</option>`).join('');
  const groepVan = s => SCHOOLGROEPEN.findIndex(g => g.niveaus.some(x => s.niveaus.includes(x)));
  schoolKeuze.innerHTML = '<option value="">Alle scholen</option>' + SCHOOLGROEPEN.map((g, i) => {
    const scholen = SCHOLEN.filter(s => groepVan(s) === i).sort((a, b) => a.kort.localeCompare(b.kort, 'nl'));
    return scholen.length ? `<optgroup label="${esc(g.naam)}">${scholen.map(s => `<option value="${esc(s.id)}">${esc(s.kort)} (${esc(s.waar)})</option>`).join('')}</optgroup>` : '';
  }).join('');
  // Alleen onderwerpen waarover al iets geschreven is: een lege filter zegt niets.
  const gebruikt = new Set(BERICHTEN.flatMap(n => n.thema || []));
  const themas = THEMAS.filter(t => gebruikt.has(t.id));
  themaVak.innerHTML = [['', 'Alle onderwerpen'], ...themas.map(t => [t.id, t.naam])]
    .map(([id, naam]) => `<button class="filter" type="button" data-kies-thema="${esc(id)}" aria-pressed="false">${esc(naam)}</button>`).join('');

  function zetKeuzes() {
    rolKeuze.value = profiel.rol;
    schoolKeuze.value = profiel.school;
    alleenKeuze.checked = profiel.alleen;
    alleenKeuze.closest('.vinkje').hidden = !heeftProfiel(profiel);
  }
  zetKeuzes();

  const filtert = () => heeftProfiel(profiel) && profiel.alleen;
  const voorMij = n => !filtert() || past(n, profiel) || n.id === uitzondering;

  function toonAgenda(berichten) {
    const items = agendaVan(berichten);
    agenda.hidden = !items.length;
    const getoond = agendaHeel ? items : items.slice(0, AGENDA_EERST);
    agendaLijst.innerHTML = getoond.map(({ n, sleutel, wanneer, wat }) => {
      const wie = voorWie(n, { kort: true });
      return `<li${dagenTot(sleutel) <= 7 ? ' class="dringend"' : ''}>
        <a href="#bericht-${esc(n.id)}"><span class="wanneer">${esc(wanneer)}</span> <span class="wat">${esc(wat)}</span></a>
        ${wie ? `<span class="voor-wie">${wie}</span>` : ''}
      </li>`;
    }).join('');
    agendaMeer.hidden = getoond.length === items.length;
    agendaMeer.textContent = `Toon de hele agenda (${items.length})`;
    return items;
  }

  function teken() {
    const woorden = zoekwoorden(zoek.value);
    const zoekt = woorden.length > 0 && zoek.value.trim().length >= 2;
    const pastZoek = n => !zoekt || woorden.every(w => ZOEK.get(n).some(z => z.startsWith(w)));
    const pastThema = n => !thema || (n.thema || []).includes(thema);
    const zichtbaar = BERICHTEN.filter(n => voorMij(n) && pastThema(n) && pastZoek(n));
    const verborgen = filtert() ? BERICHTEN.filter(n => !voorMij(n) && pastThema(n) && pastZoek(n)).length : 0;
    const opties = { toonKnop, uitzondering };

    for (const b of themaVak.querySelectorAll('[data-kies-thema]')) b.setAttribute('aria-pressed', String(b.dataset.kiesThema === thema));
    toonAgenda(BERICHTEN.filter(voorMij));

    if (zoekt || thema) {
      // Zoeken en filteren gaan over alle schooljaren heen, het nieuwste eerst.
      lijst.innerHTML = zichtbaar.length ? `<ol class="logboek">${zichtbaar.map(n => postHtml(n, opties)).join('')}</ol>` : '';
    } else {
      const jaren = [];
      for (const n of zichtbaar) {
        const j = schooljaar(n.datum);
        if (jaren.at(-1)?.j !== j) jaren.push({ j, lijst: [] });
        jaren.at(-1).lijst.push(n);
      }
      lijst.innerHTML = jaren.map(({ j, lijst: l }, i) => {
        if (i === 0) {
          const getoond = uitgeklapt ? l : l.slice(0, EERSTE);
          return `<section class="schooljaar nieuwste" aria-label="Schooljaar ${j}">
            <p class="schooljaar-kop">Schooljaar ${j}</p>
            ${perMaand(getoond, opties)}
            ${getoond.length < l.length ? `<button type="button" class="knop zacht meer-nieuws">Toon de rest van dit schooljaar (${l.length - getoond.length})</button>` : ''}
          </section>`;
        }
        return `<details class="schooljaar" data-jaar="${j}"${openJaren.has(j) ? ' open' : ''}>
          <summary><span class="schooljaar-kop">Schooljaar ${j}</span> <span class="aantal">${aantal(l.length, 'bericht', 'berichten')}</span></summary>
          ${perMaand(l, opties)}
        </details>`;
      }).join('');
    }

    // De telling zegt wat je ziet, en wat je keuze verbergt: verbergen gebeurt nooit stil.
    let zin;
    const r = ROL[profiel.rol], s = SCHOOL[profiel.school];
    if (zoekt || thema) {
      const waarop = [zoekt ? `voor “${zoek.value.trim()}”` : '', thema ? `over “${THEMA[thema].naam}”` : ''].filter(Boolean).join(' ');
      const jouw = r && s ? 'jouw rol en je school' : r ? 'jouw rol' : 'jouw school';
      zin = zichtbaar.length ? `${aantal(zichtbaar.length, 'bericht', 'berichten')} ${waarop}.`
        // Bestaat het wel, maar voor een andere rol of school, dan zegt de zin dat.
        : verborgen ? `Geen bericht ${waarop} voor ${jouw}.`
        : `Geen bericht ${waarop}. Probeer een ander woord. Zoek je hulp bij een probleem? Dan helpt de wegwijzer hierboven.`;
    } else if (filtert()) {
      zin = r && s ? `Je ziet wat voor ${r.wie} in ${s.kort} geldt, en wat voor iedereen is.`
        : r ? `Je ziet wat voor ${r.wie} geldt, en wat voor iedereen is.`
        : `Je ziet wat voor ${s.kort} geldt, en wat voor alle scholen is.`;
    } else {
      zin = `${aantal(zichtbaar.length, 'bericht', 'berichten')}, het nieuwste bovenaan.`;
    }
    const nieuw = zichtbaar.filter(isNieuw).length;
    if (nieuw && !zoekt && !thema) zin += ` ${aantal(nieuw, 'bericht is', 'berichten zijn')} nieuw sinds je vorige bezoek${vorigBezoek ? ` op ${datumTekst(vorigBezoek)}` : ''}.`;
    if (verborgen) zin += ` ${aantal(verborgen, 'bericht', 'berichten')} voor andere rollen of scholen ${verborgen === 1 ? 'is' : 'zijn'} verborgen.`;
    telling.textContent = zin;
    andereKnop.hidden = !verborgen;
    andereKnop.textContent = verborgen === 1 ? 'Toon dat bericht ook' : `Toon die ${verborgen} berichten ook`;
    tekenLaatste();
  }

  // Bovenaan de pagina: het nieuwste bericht voor jou, en wat binnen twee weken op
  // de agenda staat. Dat laatste alleen als het voor iedereen is of bij je rol en
  // school past: een taak voor de opvoeders hoort niet bovenaan bij iedereen.
  function tekenLaatste() {
    const el = document.querySelector('.laatste-nieuws');
    if (!el) return;
    const mijn = BERICHTEN.filter(n => voorMij(n) && n.id !== uitzondering);
    const n = mijn[0];
    const voorIedereen = b => !b.voor && !b.niveaus && !b.scholen;
    const dringend = agendaVan(mijn.filter(b => heeftProfiel(profiel) ? past(b, profiel) : voorIedereen(b)))
      .find(x => dagenTot(x.sleutel) <= 14);
    el.innerHTML = [
      n ? `<a href="#bericht-${esc(n.id)}"><span class="nieuw-label">${isNieuw(n) || (!gezien && dagenTot(n.datum) >= -30) ? 'Nieuw' : 'Laatste nieuws'}</span> ${esc(n.titel)} <span class="datum">· ${esc(datumTekst(n.datum))}</span></a>` : '',
      dringend ? `<a class="agenda-pil" href="#bericht-${esc(dringend.n.id)}"><span class="nieuw-label">Op de agenda</span> ${esc(dringend.wanneer)}: ${esc(dringend.wat)}</a>` : '',
    ].join('');
  }

  function profielVeranderd() {
    profiel = { rol: rolKeuze.value, school: schoolKeuze.value, alleen: alleenKeuze.checked };
    uitzondering = null;
    bewaarProfiel(profiel);
    zetKeuzes();
    teken();
  }
  rolKeuze.addEventListener('change', profielVeranderd);
  schoolKeuze.addEventListener('change', profielVeranderd);
  alleenKeuze.addEventListener('change', profielVeranderd);
  // "Toon die berichten ook" geldt alleen voor dit bezoek: je bewaarde keuze blijft.
  andereKnop.addEventListener('click', () => {
    profiel = { ...profiel, alleen: false };
    zetKeuzes();
    teken();
    alleenKeuze.focus();
  });
  zoek.addEventListener('input', () => { uitzondering = null; teken(); });
  themaVak.addEventListener('click', e => {
    const b = e.target.closest('[data-kies-thema]');
    if (!b) return;
    thema = b.dataset.kiesThema;
    teken();
  });
  agendaMeer.addEventListener('click', () => {
    agendaHeel = true;
    teken();
    agendaLijst.querySelectorAll('a')[AGENDA_EERST]?.focus();
  });

  vak.addEventListener('click', e => {
    // Een onderwerp bij een bericht: toon alle berichten daarover.
    const tag = e.target.closest('[data-thema]');
    if (tag) {
      thema = tag.dataset.thema;
      zoek.value = '';
      teken();
      // Op de gsm is de rij om opzij te vegen: de knop zelf moet ook opzij in beeld.
      const knop = themaVak.querySelector('[aria-pressed="true"]');
      (knop || themaVak).scrollIntoView({ behavior: stil() ? 'auto' : 'smooth', block: 'center', inline: 'center' });
      knop?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('.meer-nieuws')) {
      uitgeklapt = true;
      teken();
      const kop = lijst.querySelectorAll('.schooljaar.nieuwste .post h3')[EERSTE];
      kop?.setAttribute('tabindex', '-1');
      kop?.focus();
      return;
    }
    const kopieer = e.target.closest('.kopieer');
    if (kopieer) kopieerLink(kopieer);
  });
  // Welke oudere schooljaren open staan, blijft zo als je filtert of zoekt.
  lijst.addEventListener('toggle', e => {
    const d = e.target;
    if (!d.matches?.('details.schooljaar')) return;
    if (d.open) openJaren.add(d.dataset.jaar); else openJaren.delete(d.dataset.jaar);
  }, true);

  async function kopieerLink(knop) {
    const adres = new URL(location.href);
    adres.search = '';
    adres.hash = 'bericht-' + knop.dataset.bericht;
    const label = knop.firstChild;
    try {
      await navigator.clipboard.writeText(adres.href);
      label.textContent = 'Link gekopieerd';
      aankondig('De link naar dit bericht staat op je klembord.');
    } catch {
      // Zonder klembord zetten we de link in de adresbalk: daar kan je hem kopiëren.
      history.replaceState(null, '', '#bericht-' + knop.dataset.bericht);
      label.textContent = 'Kopieer de link uit de adresbalk';
      aankondig('De link naar dit bericht staat nu in de adresbalk.');
    }
    clearTimeout(knop._terug);
    knop._terug = setTimeout(() => { label.textContent = 'Kopieer de link'; }, 3000);
  }

  // Een vaste link toont het bericht altijd: zoeken en onderwerp vallen weg, en
  // valt het buiten je rol of school, dan staat het er toch, als uitzondering.
  function toonBericht(id) {
    const n = BERICHTEN.find(b => b.id === id);
    if (!n) return false;
    zoek.value = '';
    thema = '';
    uitzondering = filtert() && !past(n, profiel) ? id : null;
    uitgeklapt = true;
    openJaren.add(schooljaar(n.datum));
    teken();
    const li = document.getElementById('bericht-' + id);
    if (!li) return false;
    li.classList.add('gemarkeerd');
    setTimeout(() => li.classList.remove('gemarkeerd'), 2600);
    li.scrollIntoView({ behavior: stil() ? 'auto' : 'smooth', block: 'start' });
    const kop = li.querySelector('h3');
    kop.setAttribute('tabindex', '-1');
    kop.focus({ preventScroll: true });
    return true;
  }

  teken();
  const bijgewerkt = document.querySelector('.bijgewerkt');
  // De laatste wijziging: de datum in informatie.js, of een nieuwer bericht.
  const laatst = [BIJGEWERKT, ...NIEUWS.map(n => n.bijgewerkt || n.datum)].filter(d => d.length === 10).sort().at(-1);
  if (bijgewerkt) bijgewerkt.textContent = `Bijgewerkt op ${datumTekst(laatst)}.`;
  return { toonBericht };
}

// De berichten bij een dossier (een hangijzer), het nieuwste eerst.
export const berichtenOver = dossier => BERICHTEN.filter(n => n.dossier === dossier);
