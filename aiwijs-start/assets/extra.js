/* AI-wijs · uitbreidingen bovenop app.js: de oefenblokken keuze en sorteer, de
   bordmodus en het paspoort.
   De build kopieert en laadt dit bestand alleen in een cursus die er iets van
   gebruikt (vandaag AI-wijs Start). Zo blijft de uitvoer van AI-wijs op school
   ongewijzigd zolang die er niets van nodig heeft. Alles blijft lokaal. */
(function () {
  'use strict';
  // Dezelfde sleutel als app.js: de build zet hem op <body data-opslag> voor een
  // cursus met een eigen sleutel (Start: aiwijs-start.v1).
  const KEY = document.body.dataset.opslag || 'aiwijs.v1';
  const BORD = KEY + '.bord';

  // ---------- opslag, altijd in een try/catch (privévenster, geblokkeerde opslag) ----------
  function lees(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function schrijf(k, v) {
    try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* niets aan te doen */ }
  }
  function afgevinkt() {
    try { const s = JSON.parse(lees(KEY) || '{}'); return (s && s.done) || {}; } catch (e) { return {}; }
  }

  // ---------- keuze: één vraag of een reeks, feedback na een klik ----------
  // Een ander antwoord kiezen mag altijd: de feedback volgt de laatste keuze.
  document.querySelectorAll('.js-keuze .keuze-vraag').forEach(vraag => {
    const opts = vraag.querySelectorAll('.keuze-opt');
    const fb = vraag.querySelector('.keuze-fb');
    const open = vraag.dataset.soort === 'open';
    opts.forEach(knop => knop.addEventListener('click', () => {
      opts.forEach(x => { x.classList.remove('is-selected', 'is-correct', 'is-wrong'); x.setAttribute('aria-pressed', 'false'); });
      knop.setAttribute('aria-pressed', 'true');
      const juist = knop.dataset.juist === 'ja';
      knop.classList.add(open ? 'is-selected' : (juist ? 'is-correct' : 'is-wrong'));
      const tpl = knop.parentElement.querySelector('.keuze-uitleg');
      const uitleg = tpl ? tpl.innerHTML.trim() : '';
      fb.className = 'keuze-fb quiz-feedback ' + (open ? 'is-neutraal' : (juist ? 'is-correct' : 'is-wrong'));
      // Het label "Juist." of "Niet de beste keuze." zegt ook zonder kleur wat er
      // gebeurde. Begint de feedback zelf al met "Juist", dan geen tweede keer.
      const label = open || (juist && /^(<[^>]+>\s*)*juist\b/i.test(uitleg)) ? '' : `<strong>${juist ? 'Juist.' : 'Niet de beste keuze.'}</strong>`;
      fb.innerHTML = label + (uitleg ? `<p>${uitleg}</p>` : '');
      vraag.classList.add('is-beantwoord');
    }));
  });

  // ---------- sorteer: elk kaartje in een bak, met een knop per bak ----------
  document.querySelectorAll('.js-sorteer').forEach(blok => {
    const kaarten = [...blok.querySelectorAll('.sorteer-kaart')];
    const bakken = [...blok.querySelectorAll('.sorteer-bak')];
    const slot = blok.querySelector('.sorteer-slot');
    const naamVan = nr => { const k = blok.querySelector(`.sorteer-knop[data-bak="${nr}"]`); return k ? k.textContent.trim() : ''; };

    function telBakken() {
      bakken.forEach(b => { const n = b.querySelectorAll('.sorteer-bak-inhoud li').length; b.querySelector('.sorteer-bak-tel').textContent = n ? `(${n})` : ''; });
    }
    function leg(kaart, knop) {
      if (kaart.classList.contains('is-gedaan')) return;
      const juist = knop.dataset.bak === kaart.dataset.bak;
      kaart.classList.add('is-gedaan', juist ? 'is-juist' : 'is-fout');
      kaart.querySelectorAll('.sorteer-knop').forEach(k => {
        k.setAttribute('aria-disabled', 'true');
        if (k === knop) { k.classList.add('is-gekozen'); k.setAttribute('aria-pressed', 'true'); }
        if (k.dataset.bak === kaart.dataset.bak) k.classList.add('is-correct');
      });
      const tpl = kaart.querySelector('.sorteer-uitleg');
      const uitleg = tpl ? tpl.innerHTML.trim() : '';
      const goed = naamVan(kaart.dataset.bak);
      kaart.querySelector('.sorteer-fb').innerHTML = (juist
        ? `<strong>Juist: ${esc(goed)}.</strong>`
        : `<strong>Niet helemaal. Dit kaartje hoort bij "${esc(goed)}".</strong>`) + (uitleg ? ` ${uitleg}` : '');
      // Het kaartje krijgt ook een plaatsje in de juiste bak bovenaan.
      const li = document.createElement('li');
      li.className = juist ? 'is-juist' : 'is-fout';
      li.innerHTML = kaart.querySelector('.sorteer-tekst').innerHTML;
      const bak = blok.querySelector(`.sorteer-bak-${kaart.dataset.bak} .sorteer-bak-inhoud`);
      if (bak) bak.appendChild(li);
      telBakken();
      if (kaarten.every(k => k.classList.contains('is-gedaan'))) toonSlot();
    }
    function toonSlot() {
      const juist = kaarten.filter(k => k.classList.contains('is-juist')).length;
      slot.innerHTML = `<p><strong>Klaar.</strong> ${juist} van de ${kaarten.length} kaartjes lagen in de juiste bak.${juist === kaarten.length ? ' Alles juist!' : ' Bekijk de uitleg bij de andere nog eens.'}</p><button type="button" class="btn btn-primary js-sorteer-opnieuw">Opnieuw</button>`;
      slot.querySelector('.js-sorteer-opnieuw').addEventListener('click', opnieuw);
    }
    function opnieuw() {
      kaarten.forEach(k => {
        k.classList.remove('is-gedaan', 'is-juist', 'is-fout');
        k.querySelectorAll('.sorteer-knop').forEach(x => { x.classList.remove('is-gekozen', 'is-correct'); x.removeAttribute('aria-disabled'); x.setAttribute('aria-pressed', 'false'); });
        k.querySelector('.sorteer-fb').innerHTML = '';
      });
      bakken.forEach(b => { b.querySelector('.sorteer-bak-inhoud').innerHTML = ''; });
      telBakken();
      slot.innerHTML = '';
      const eerste = blok.querySelector('.sorteer-knop');
      if (eerste) eerste.focus();
    }
    kaarten.forEach(kaart => kaart.querySelectorAll('.sorteer-knop').forEach(knop => knop.addEventListener('click', () => leg(kaart, knop))));
  });

  // ---------- bordmodus: grote letters, geen zijbalk, voor het digibord ----------
  // Het scriptje in de kop zette de klasse al (uit ?bord of uit de opslag); de knop
  // bij elke les zet ze aan of uit en onthoudt dat voor deze cursus.
  const html = document.documentElement;
  document.querySelectorAll('.js-bord').forEach(knop => {
    const toon = () => knop.setAttribute('aria-pressed', html.classList.contains('bordmodus') ? 'true' : 'false');
    knop.hidden = false;
    toon();
    knop.addEventListener('click', () => {
      const aan = !html.classList.contains('bordmodus');
      html.classList.toggle('bordmodus', aan);
      schrijf(BORD, aan ? '1' : null);
      // Staat ?bord nog in het adres, haal het weg: anders zet herladen hem terug aan.
      if (!aan && /[?&]bord\b/.test(location.search) && window.history && history.replaceState) {
        const url = new URL(location.href); url.searchParams.delete('bord');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
      document.querySelectorAll('.js-bord').forEach(k => k.setAttribute('aria-pressed', aan ? 'true' : 'false'));
    });
  });

  // ---------- paspoort: een stempel per afgevinkte les ----------
  const paspoort = document.querySelector('.js-paspoort');
  function vernieuwPaspoort() {
    if (!paspoort) return;
    const done = afgevinkt();
    const stempels = [...paspoort.querySelectorAll('.pp-stempel')];
    let n = 0;
    stempels.forEach(s => {
      const aan = !!done[s.dataset.stempel];
      if (aan) n++;
      s.classList.toggle('is-gestempeld', aan);
      const st = s.querySelector('.js-pp-status');
      if (st) st.textContent = aan ? 'Afgevinkt op dit toestel.' : 'Nog niet afgevinkt.';
    });
    const tel = paspoort.querySelector('.js-pp-telling');
    if (tel && stempels.length) tel.textContent = `${n} van de ${stempels.length} stempels staan al gekleurd. Een lege cirkel stempelt je leerkracht af.`;
  }
  if (paspoort) {
    paspoort.querySelector('.js-pp-print').addEventListener('click', () => window.print());
    vernieuwPaspoort();
    // Terug naar deze pagina met de knop "vorige": de browser toont soms een oude kopie.
    window.addEventListener('pageshow', vernieuwPaspoort);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
})();
