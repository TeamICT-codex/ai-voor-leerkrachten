// De pagina rond een wereld van Leerlichtjes, gedeeld door alle graden: laadt
// het 3D-tafereel, opent een station in een venster met drie stappen (ontdek,
// doe, praat samen), deelt stempels uit en leest voor. Zonder 3D werkt alles
// ook: dan kies je een station onderaan.
//
// Elke graad roept startWereld op met haar eigen stations, haar eigen sleutel
// voor de stempels en een functie die haar tafereel laadt.
import { stem } from './activiteiten.js';

const GETAL = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht'];

// leesMee: de kaartjes en de antwoorden worden voorgelezen zodra je erop tikt,
// met een knop bovenaan om dat uit te zetten. Voor de 1ste graad.
// woord: hoe een station in deze wereld heet (in de klas is dat een hoek).
export function startWereld({ stations: STATIONS, sleutel: SLEUTEL, plaats, laad, leesMee = false, woord = { een: 'station', meer: 'stations' } }) {
  const Woord = woord.een[0].toUpperCase() + woord.een.slice(1);
  const podium = document.querySelector('.podium');
  const canvas = podium.querySelector('.tafereel');
  const vraag = new URLSearchParams(location.search);
  const stilGevraagd = matchMedia('(prefers-reduced-motion: reduce)').matches || vraag.has('stil');
  const zwak = vraag.has('zwak') || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  let dio = null;

  // ── stempels: alleen op dit toestel, en een privévenster mag de pagina niet breken ──
  function leesStempels() {
    try { return new Set(JSON.parse(localStorage.getItem(SLEUTEL) || '[]')); } catch { return new Set(); }
  }
  function bewaarStempels(s) {
    try { localStorage.setItem(SLEUTEL, JSON.stringify([...s])); } catch { /* geen opslag: de stempels gelden dan voor deze keer */ }
  }
  let stempels = leesStempels();

  // ── labels in het tafereel en het plan onderaan ──
  const labels = {};
  const labelVak = podium.querySelector('.labels');
  const dok = document.querySelector('.ll-dok-stations');
  for (const s of STATIONS) {
    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'label';
    label.style.setProperty('--stip', s.kleur);
    label.innerHTML = `<span class="label-nr" aria-hidden="true"></span><span class="label-naam"></span>`;
    label.querySelector('.label-nr').textContent = s.nummer;
    label.querySelector('.label-naam').textContent = s.naam;
    label.addEventListener('click', () => openStation(s.id, label));
    labelVak.append(label);
    labels[s.id] = label;

    const knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'll-dok-knop';
    knop.dataset.station = s.id;
    knop.style.setProperty('--stip', s.kleur);
    knop.innerHTML = `<span class="ll-dok-nr" aria-hidden="true"></span><span class="ll-dok-tekst"><strong></strong><small></small></span><span class="ll-dok-stempel" aria-hidden="true"></span>`;
    knop.querySelector('.ll-dok-nr').textContent = s.nummer;
    knop.querySelector('strong').textContent = s.naam;
    knop.querySelector('small').textContent = s.vraag;
    knop.addEventListener('click', () => openStation(s.id, knop));
    dok.append(knop);
  }
  function toonStempels() {
    for (const s of STATIONS) {
      const knop = dok.querySelector(`[data-station="${s.id}"]`);
      const heeft = stempels.has(s.id);
      knop.classList.toggle('gestempeld', heeft);
      knop.setAttribute('aria-label', `${Woord} ${s.nummer}: ${s.naam}${heeft ? ', stempel behaald' : ''}`);
      labels[s.id].classList.toggle('gestempeld', heeft);
      dio?.stempel(s.id, heeft);
    }
    const n = stempels.size;
    document.querySelector('.ll-teller').textContent = `${n} van ${STATIONS.length} stempels`;
    document.querySelector('.ll-paspoort-link').classList.toggle('vol', n === STATIONS.length);
    dio?.herteken();
  }

  // ── voorlezen ──
  const spraak = 'speechSynthesis' in window ? window.speechSynthesis : null;
  spraak?.addEventListener?.('voiceschanged', () => document.body.classList.toggle('kan-voorlezen', !!stem()));
  document.body.classList.toggle('kan-voorlezen', !!stem());
  if (leesMee && spraak) {
    document.body.classList.add('lees-mee');
    const knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'll-kopknop ll-leesmee';
    knop.setAttribute('aria-pressed', 'true');
    knop.textContent = 'Lees mee: aan';
    knop.addEventListener('click', () => {
      const aan = !document.body.classList.contains('lees-mee');
      document.body.classList.toggle('lees-mee', aan);
      knop.setAttribute('aria-pressed', String(aan));
      knop.textContent = aan ? 'Lees mee: aan' : 'Lees mee: uit';
      if (!aan) spraak.cancel();
    });
    document.querySelector('.ll-kopknoppen').prepend(knop);
  }
  function leesKnop(teksten) {
    const knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'll-lees';
    knop.textContent = '▶ Lees voor';
    knop.addEventListener('click', () => {
      if (spraak.speaking) { spraak.cancel(); knop.textContent = '▶ Lees voor'; return; }
      const u = new SpeechSynthesisUtterance(teksten.join(' '));
      const v = stem();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = 0.95;
      u.onend = u.onerror = () => { knop.textContent = '▶ Lees voor'; };
      spraak.speak(u);
      knop.textContent = '■ Stop met lezen';
    });
    return knop;
  }

  // ── het venster van een station ──
  const venster = document.querySelector('.ll-venster');
  const delen = {
    nr: venster.querySelector('.ll-nr'),
    vraag: venster.querySelector('.ll-vraag'),
    titel: venster.querySelector('#ll-titel'),
    inhoud: venster.querySelector('.ll-inhoud'),
    stappen: [...venster.querySelectorAll('.ll-stap')],
    terug: venster.querySelector('.ll-terugknop'),
    verder: venster.querySelector('.ll-verder'),
  };
  const STAPPEN = ['Ontdek', 'Doe', 'Praat samen'];
  let open = null, stap = 0, terugNaar = null, doeVak = null, doeKlaar = false;

  function openStation(id, vanaf) {
    const s = STATIONS.find(x => x.id === id);
    if (!s) return;
    if (!open) terugNaar = vanaf || document.activeElement;
    open = s;
    doeVak = null;
    doeKlaar = false;
    venster.style.setProperty('--stip', s.kleur);
    delen.nr.textContent = s.nummer;
    delen.vraag.textContent = `${Woord} ${s.nummer} · ${s.vraag}`;
    delen.titel.textContent = s.naam;
    venster.hidden = false;
    document.body.classList.add('venster-open');
    dio?.focus(id);
    toonStap(0);
    delen.titel.focus({ preventScroll: true });
  }
  function sluitStation() {
    if (!open) return;
    spraak?.cancel();
    open = null;
    venster.hidden = true;
    document.body.classList.remove('venster-open');
    dio?.focus('overzicht');
    terugNaar?.focus?.({ preventScroll: true });
  }
  function toonStap(n) {
    spraak?.cancel();
    stap = n;
    delen.stappen.forEach((b, i) => {
      b.setAttribute('aria-current', i === n ? 'step' : 'false');
      b.classList.toggle('gedaan', i < n);
    });
    const s = open;
    const vak = document.createElement('div');
    vak.className = 'll-stap-inhoud';
    if (n === 0) {
      vak.append(...s.ontdek.map(t => Object.assign(document.createElement('p'), { textContent: t, className: 'll-groot' })));
      if (spraak) vak.append(leesKnop(s.ontdek));
    } else if (n === 1) {
      // De activiteit blijft staan als je even terug- en vooruitbladert.
      if (!doeVak) {
        doeVak = document.createElement('div');
        s.maak(doeVak, () => { doeKlaar = true; werkKnoppenBij(); });
      }
      vak.append(doeVak);
    } else {
      const lijst = document.createElement('ol');
      lijst.className = 'll-praat';
      lijst.append(...s.praat.map(t => Object.assign(document.createElement('li'), { textContent: t })));
      const onthoud = document.createElement('div');
      onthoud.className = 'll-onthoud';
      onthoud.innerHTML = '<p class="ll-onthoud-kop">Onthoud</p><p class="ll-onthoud-tekst"></p>';
      onthoud.querySelector('.ll-onthoud-tekst').textContent = s.onthoud;
      vak.append(Object.assign(document.createElement('p'), { textContent: 'Praat samen in de kring. Er zijn geen foute antwoorden.', className: 'll-klein' }), lijst);
      if (spraak) vak.append(leesKnop(s.praat));
      vak.append(onthoud, stempelVak(s));
    }
    delen.inhoud.replaceChildren(vak);
    delen.inhoud.scrollTop = 0;
    werkKnoppenBij();
  }
  function stempelVak(s) {
    const vak = document.createElement('div');
    vak.className = 'll-stempelvak';
    if (stempels.has(s.id)) {
      vak.innerHTML = '<span class="ll-stempel-groot" aria-hidden="true">✓</span><p>Deze stempel staat al in jullie paspoort.</p>';
      return vak;
    }
    const knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'll-knop groot';
    knop.textContent = 'Verdien de stempel';
    const uitleg = document.createElement('p');
    uitleg.className = 'll-klein';
    if (!doeKlaar) {
      knop.disabled = true;
      uitleg.textContent = 'Doe eerst de opdracht in stap 2.';
    }
    knop.addEventListener('click', () => {
      stempels.add(s.id);
      bewaarStempels(stempels);
      toonStempels();
      vak.innerHTML = '<span class="ll-stempel-groot nieuw" aria-hidden="true">✓</span><p></p>';
      vak.querySelector('p').textContent = stempels.size === STATIONS.length
        ? `Het paspoort is vol! Jullie bezochten alle ${GETAL[STATIONS.length] || STATIONS.length} de ${woord.meer} van ${plaats}.`
        : `Stempel verdiend! Nog ${STATIONS.length - stempels.size} te gaan.`;
      werkKnoppenBij();
    });
    vak.append(knop, uitleg);
    return vak;
  }
  function werkKnoppenBij() {
    delen.terug.disabled = stap === 0;
    delen.verder.textContent = stap < 2 ? `Verder: ${STAPPEN[stap + 1]} →` : `Terug naar ${plaats}`;
    delen.verder.classList.toggle('wacht', stap === 1 && !doeKlaar);
    const knop = venster.querySelector('.ll-stempelvak .ll-knop');
    if (knop && doeKlaar) { knop.disabled = false; knop.nextElementSibling.textContent = ''; }
  }
  delen.stappen.forEach((b, i) => b.addEventListener('click', () => toonStap(i)));
  delen.terug.addEventListener('click', () => toonStap(Math.max(0, stap - 1)));
  delen.verder.addEventListener('click', () => (stap < 2 ? toonStap(stap + 1) : sluitStation()));
  venster.querySelector('.ll-sluit').addEventListener('click', sluitStation);
  addEventListener('keydown', e => { if (e.key === 'Escape' && open) sluitStation(); });

  // ── knoppen bovenaan ──
  const avondKnop = document.querySelector('.ll-avond');
  avondKnop.addEventListener('click', () => {
    const aan = avondKnop.getAttribute('aria-pressed') !== 'true';
    avondKnop.setAttribute('aria-pressed', String(aan));
    avondKnop.querySelector('.ll-avond-tekst').textContent = aan ? 'Dag' : 'Avond';
    podium.classList.toggle('nacht', aan);
    dio?.avond(aan);
  });
  document.querySelector('.ll-scherm').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* geen volledig scherm: de wereld werkt ook zo */ }
  });
  document.querySelector('.ll-wis').addEventListener('click', () => {
    if (!confirm('Alle stempels wissen? Doe dit pas als een nieuwe klas begint.')) return;
    stempels = new Set();
    bewaarStempels(stempels);
    toonStempels();
  });

  // ── starten ──
  function kanWebGL2() {
    try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
  }
  async function laadTafereel() {
    try {
      const maak = await laad();
      dio = await maak(canvas, {
        stil: stilGevraagd,
        zwak,
        labels,
        onKamer: id => openStation(id, labels[id]),
        onHover: id => { for (const [k, el] of Object.entries(labels)) el.classList.toggle('actief', k === id); },
        onFout: () => podium.classList.remove('klaar'),
      });
      if (vraag.has('debug')) window.dio = dio;
      podium.classList.add('klaar');
      if (!stilGevraagd && !zwak) podium.classList.add('rijk');
      toonStempels();
      if (open) dio.focus(open.id);
    } catch (fout) {
      console.warn(`${plaats[0].toUpperCase() + plaats.slice(1)} kon niet laden; de ${woord.meer} blijven bereikbaar via het plan onderaan.`, fout);
      podium.classList.add('zonder-3d');
    }
  }
  toonStempels();
  requestAnimationFrame(() => podium.classList.add('dag'));
  if (vraag.has('schets') || !kanWebGL2()) podium.classList.add('zonder-3d');
  else if (document.readyState === 'complete') laadTafereel();
  else addEventListener('load', laadTafereel, { once: true });
}
