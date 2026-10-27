/* AI-wijs op school · client-side gedrag: voortgang, quiz, prompts, certificaat.
   Alles blijft lokaal (localStorage). Geen server, geen tracking. */
(function () {
  'use strict';
  const KEY = 'aiwijs.v1';
  const base = document.body.dataset.base || './';

  // ---------- opslag ----------
  function load() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privémodus of opslag geblokkeerd */ }
  }
  const state = Object.assign({ done: {}, quiz: {}, route: {}, notes: {}, checks: {}, naam: '', school: '' }, load());
  const persist = () => save(state);

  let structuur = null;
  function loadStructuur() {
    return fetch(base + 'assets/structuur.json').then(r => r.ok ? r.json() : null).catch(() => null);
  }

  // ---------- helpers ----------
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('is-visible'), 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); res(); } catch (e) { rej(e); } finally { ta.remove(); }
    });
  }
  function isLesDone(id) { return !!state.done[id]; }
  function hoofdstukStatus(h) {
    const total = h.lessen.length;
    const done = h.lessen.filter(l => isLesDone(l.id)).length;
    return { total, done, complete: total > 0 && done === total };
  }

  // ---------- kopieerknoppen ----------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-copy');
    if (!btn) return;
    const box = btn.closest('.blk, .pb-result');
    const pre = box && box.querySelector('pre');
    if (!pre) return;
    copyText(pre.textContent).then(() => { toast('Prompt gekopieerd. Plak ze in je chatbot.'); btn.textContent = 'Gekopieerd ✓'; setTimeout(() => (btn.textContent = 'Kopieer de prompt'), 1800); })
      .catch(() => toast('Kopiëren lukte niet. Selecteer de tekst en kopieer ze zelf.'));
  });

  // ---------- citaten in tabs: dat zijn meestal prompts, geef ze een kopieerknop ----------
  document.querySelectorAll('.tab-panel blockquote, .blk-voorbeeld blockquote').forEach(bq => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-small bq-copy'; b.textContent = 'Kopieer';
    b.addEventListener('click', () => copyText(bq.innerText.replace(/\n?Kopieer$/, '').trim()).then(() => { toast('Gekopieerd.'); b.textContent = 'Gekopieerd ✓'; setTimeout(() => (b.textContent = 'Kopieer'), 1800); }));
    bq.appendChild(b);
  });

  // ---------- tabs ----------
  document.querySelectorAll('.js-tabs').forEach(tabs => {
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('.tab-btn'); if (!b) return;
      const i = b.dataset.tab;
      tabs.querySelectorAll('.tab-btn').forEach(x => { const on = x.dataset.tab === i; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); });
      tabs.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.tab === i));
    });
  });

  // ---------- promptbouwer ----------
  document.querySelectorAll('.js-promptbouwer').forEach(pb => {
    const sjabloon = pb.dataset.sjabloon || '';
    const out = pb.querySelector('.js-pb-output');
    const inputs = pb.querySelectorAll('input[data-veld]');
    const render = () => {
      let t = sjabloon;
      inputs.forEach(inp => { const v = inp.value.trim(); t = t.split('{' + inp.dataset.veld + '}').join(v || '[' + (inp.placeholder.replace(/^bv\.\s*/i, '') || inp.dataset.veld) + ']'); });
      out.textContent = t;
    };
    inputs.forEach(inp => inp.addEventListener('input', render));
    render();
  });

  // ---------- notities en checklists ----------
  document.querySelectorAll('.js-note').forEach(ta => {
    const box = ta.closest('[data-note-id]'); const id = box && box.dataset.noteId; if (!id) return;
    const status = box.querySelector('.js-note-status');
    if (state.notes[id]) ta.value = state.notes[id];
    let tm;
    ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { state.notes[id] = ta.value; persist(); if (status) status.textContent = 'Bewaard op dit toestel.'; }, 400); });
  });
  document.querySelectorAll('.js-check').forEach(cb => {
    const id = cb.dataset.checkId; cb.checked = !!state.checks[id];
    cb.addEventListener('change', () => { if (cb.checked) state.checks[id] = true; else delete state.checks[id]; persist(); });
  });

  // ---------- voltooid-markering ----------
  function refreshDoneMarks() {
    document.querySelectorAll('[data-les-id]').forEach(el => {
      if (el.tagName === 'A') el.classList.toggle('is-done', isLesDone(el.dataset.lesId));
    });
    document.querySelectorAll('.js-done').forEach(btn => btn.classList.toggle('is-done', isLesDone(btn.dataset.lesId)));
  }
  document.querySelectorAll('.js-done').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.lesId;
      if (isLesDone(id)) { delete state.done[id]; toast('Les opnieuw open gezet.'); }
      else { state.done[id] = Date.now(); toast('Mooi. Les afgerond.'); }
      persist(); refreshDoneMarks(); refreshOverview();
    });
  });

  // ---------- overzicht (index) ----------
  function refreshOverview() {
    if (!structuur) return;
    const allLessen = structuur.flatMap(h => h.lessen);
    const done = allLessen.filter(l => isLesDone(l.id)).length;
    const pct = allLessen.length ? Math.round(100 * done / allLessen.length) : 0;
    const tb = document.querySelector('.js-total-bar'); if (tb) tb.style.width = pct + '%';
    const tt = document.querySelector('.js-total-text');
    if (tt) tt.textContent = done === 0 ? 'Je bent nog niet gestart.' : `${done} van ${allLessen.length} lessen afgerond (${pct} %).`;
    structuur.forEach(h => {
      const card = document.querySelector(`.hcard[data-hoofdstuk="${h.map}"]`); if (!card) return;
      const s = hoofdstukStatus(h);
      const bar = card.querySelector('.js-h-bar'); if (bar) bar.style.width = Math.round(100 * s.done / s.total) + '%';
      const cnt = card.querySelector('.js-h-count'); if (cnt) cnt.textContent = `${s.done}/${s.total}${s.complete ? ' ✓' : ''}`;
      card.classList.toggle('in-route', !!state.route[h.map]);
      const rt = card.querySelector('.js-route'); if (rt) rt.checked = !!state.route[h.map];
    });
  }
  document.querySelectorAll('.js-route').forEach(cb => {
    cb.addEventListener('change', () => { if (cb.checked) state.route[cb.dataset.hoofdstuk] = true; else delete state.route[cb.dataset.hoofdstuk]; persist(); refreshOverview(); });
  });

  // ---------- export / import van voortgang ----------
  const dlg = document.querySelector('.js-dlg-progress');
  function openDlg(mode) {
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const title = dlg.querySelector('.js-dlg-title'), text = dlg.querySelector('.js-dlg-text'), code = dlg.querySelector('.js-dlg-code'), apply = dlg.querySelector('.js-dlg-apply'), copy = dlg.querySelector('.js-dlg-copy'), status = dlg.querySelector('.js-dlg-status');
    status.textContent = '';
    if (mode === 'export') {
      title.textContent = 'Jouw voortgangscode';
      text.textContent = 'Kopieer deze code en plak ze op je andere toestel via "Importeren". Bewaar ze bv. in je notities.';
      code.value = btoa(unescape(encodeURIComponent(JSON.stringify(state)))); code.readOnly = true; apply.hidden = true; copy.hidden = false;
    } else {
      title.textContent = 'Voortgangscode importeren';
      text.textContent = 'Plak hier de code van je andere toestel. Je huidige voortgang op dit toestel wordt samengevoegd met die code.';
      code.value = ''; code.readOnly = false; apply.hidden = false; copy.hidden = true;
    }
    dlg.showModal();
  }
  document.querySelectorAll('.js-export').forEach(b => b.addEventListener('click', () => openDlg('export')));
  document.querySelectorAll('.js-import').forEach(b => b.addEventListener('click', () => openDlg('import')));
  if (dlg) {
    dlg.querySelector('.js-dlg-copy').addEventListener('click', () => copyText(dlg.querySelector('.js-dlg-code').value).then(() => toast('Code gekopieerd.')));
    dlg.querySelector('.js-dlg-apply').addEventListener('click', () => {
      const status = dlg.querySelector('.js-dlg-status');
      try {
        const obj = JSON.parse(decodeURIComponent(escape(atob(dlg.querySelector('.js-dlg-code').value.trim()))));
        ['done', 'quiz', 'route', 'notes', 'checks'].forEach(k => { if (obj[k] && typeof obj[k] === 'object') Object.assign(state[k], obj[k]); });
        if (obj.naam) state.naam = obj.naam; if (obj.school) state.school = obj.school;
        persist(); refreshDoneMarks(); refreshOverview(); status.textContent = 'Gelukt. Je voortgang is samengevoegd.'; toast('Voortgang geïmporteerd.');
      } catch (e) { status.textContent = 'Die code klopt niet. Controleer of je ze volledig gekopieerd hebt.'; }
    });
  }

  // ---------- quiz ----------
  document.querySelectorAll('.js-quiz').forEach(root => {
    const dataEl = root.parentElement.querySelector('.js-quiz-data') || document.querySelector('.js-quiz-data');
    let data; try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
    const vragen = data.vragen || []; const pass = parseInt(root.dataset.pass, 10) || 80; const lesId = root.dataset.lesId;
    const start = root.querySelector('.quiz-start'), stage = root.querySelector('.quiz-stage'), bestEl = root.querySelector('.js-quiz-best');
    const showBest = () => { const q = state.quiz[lesId]; if (bestEl) bestEl.textContent = q ? `Je beste score: ${q.best} % (${q.passed ? 'behaald' : 'nog niet behaald'}).` : ''; };
    showBest();
    let i = 0, score = 0, answers = [];
    function renderQ() {
      const q = vragen[i]; if (!q) return renderResult();
      stage.innerHTML = `<div class="quiz-progress"><span>Vraag ${i + 1} van ${vragen.length}</span><span>${score} juist</span></div>${q.onderwerp ? `<p class="quiz-topic">${esc(q.onderwerp)}</p>` : ''}<p class="quiz-q">${esc(q.vraag)}</p><ul class="quiz-opts">${q.opties.map(o => `<li><button type="button" class="quiz-opt" data-id="${esc(o.id)}"><span class="opt-id">${esc(o.id)}</span><span>${esc(o.tekst)}</span></button></li>`).join('')}</ul><div class="quiz-feedback" hidden></div><div class="quiz-actions"><button type="button" class="btn btn-primary js-confirm" disabled>Bevestig je keuze</button><button type="button" class="btn js-next" hidden>Volgende vraag</button></div>`;
      let sel = null;
      const opts = stage.querySelectorAll('.quiz-opt'), confirm = stage.querySelector('.js-confirm'), next = stage.querySelector('.js-next'), fb = stage.querySelector('.quiz-feedback');
      opts.forEach(b => b.addEventListener('click', () => { if (confirm.disabled && sel !== null) return; sel = b.dataset.id; opts.forEach(x => x.classList.toggle('is-selected', x === b)); confirm.disabled = false; }));
      confirm.addEventListener('click', () => {
        if (sel === null) return;
        const juist = sel === q.juist; if (juist) score++;
        answers.push({ q, sel, juist });
        opts.forEach(x => { x.disabled = true; if (x.dataset.id === q.juist) x.classList.add('is-correct'); else if (x.dataset.id === sel) x.classList.add('is-wrong'); });
        const opt = q.opties.find(o => o.id === sel) || {};
        const goed = q.opties.find(o => o.id === q.juist) || {};
        fb.hidden = false; fb.className = 'quiz-feedback ' + (juist ? 'is-correct' : 'is-wrong');
        fb.innerHTML = `<strong>${juist ? 'Juist.' : 'Niet de beste keuze.'}</strong><p>${esc(opt.feedback || '')}</p>${juist ? '' : `<p><strong>Het beste antwoord was ${esc(q.juist)}.</strong> ${esc(goed.feedback || '')}</p>`}`;
        confirm.hidden = true; next.hidden = false; next.textContent = i + 1 < vragen.length ? 'Volgende vraag' : 'Bekijk je resultaat'; next.focus();
      });
      next.addEventListener('click', () => { i++; renderQ(); window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); });
    }
    function renderResult() {
      const pct = Math.round(100 * score / vragen.length); const passed = pct >= pass;
      const prev = state.quiz[lesId] || { best: 0, passed: false };
      state.quiz[lesId] = { best: Math.max(prev.best, pct), passed: prev.passed || passed, laatst: Date.now() };
      if (passed && !state.done[lesId]) state.done[lesId] = Date.now();
      persist(); refreshDoneMarks(); showBest();
      const review = answers.filter(a => !a.juist).map(a => `<li><strong>${esc(a.q.vraag)}</strong><br>Jouw keuze: ${esc(a.sel)} · beste antwoord: ${esc(a.q.juist)}${a.q.les ? ` · <a href="${esc(a.q.les)}.html">bekijk de les</a>` : ''}</li>`).join('');
      stage.innerHTML = `<div class="quiz-result ${passed ? 'is-passed' : 'is-failed'}"><p class="kicker">Jouw resultaat</p><p class="quiz-score">${score}/${vragen.length}</p><p><strong>${pct} %</strong> · ${passed ? 'Behaald. Dit hoofdstuk is afgevinkt.' : `Nog niet behaald. Je hebt ${pass} % nodig. Probeer gerust opnieuw.`}</p><div class="quiz-actions" style="justify-content:center"><button type="button" class="btn btn-primary js-again">Opnieuw proberen</button></div>${review ? `<div class="quiz-review"><h3>Bekijk deze lessen nog eens</h3><ul>${review}</ul></div>` : ''}</div>`;
      stage.querySelector('.js-again').addEventListener('click', () => { i = 0; score = 0; answers = []; renderQ(); });
    }
    root.querySelector('.js-quiz-start').addEventListener('click', () => { start.hidden = true; stage.hidden = false; i = 0; score = 0; answers = []; renderQ(); });
  });
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // ---------- certificaat ----------
  const cert = document.querySelector('.js-cert');
  function refreshCert() {
    if (!cert || !structuur) return;
    const verplicht = (cert.dataset.verplicht || '').split(',').filter(Boolean).map(Number);
    const routeNums = (cert.dataset.routeHoofdstukken || '').split(',').filter(Boolean).map(Number);
    const minRoute = parseInt(cert.dataset.minRoute, 10) || 1;
    const afgerond = [];
    structuur.forEach(h => {
      const row = cert.querySelector(`.cert-row[data-hoofdstuk="${h.map}"]`);
      const s = hoofdstukStatus(h);
      // hoofdstuk 9 telt als afgerond zodra les 9.1 voltooid is (9.2 is deze pagina)
      const isCert = h.lessen.some(l => l.type === 'certificaat');
      const complete = isCert ? h.lessen.filter(l => l.type !== 'certificaat').every(l => isLesDone(l.id)) : s.complete;
      if (complete) afgerond.push(h);
      if (row) { row.classList.toggle('is-complete', complete); row.querySelector('.js-cert-status').textContent = complete ? 'Afgerond ✓' : `${s.done}/${isCert ? s.total - 1 : s.total} lessen`; }
    });
    const nums = afgerond.map(h => h.nummer);
    const missingVerplicht = verplicht.filter(n => !nums.includes(n));
    const routeDone = routeNums.filter(n => nums.includes(n)).length;
    const laatste = structuur.find(h => h.lessen.some(l => l.type === 'certificaat'));
    const laatsteOk = !laatste || nums.includes(laatste.nummer);
    const naamEl = cert.querySelector('.js-cert-naam'), schoolEl = cert.querySelector('.js-cert-school'), msg = cert.querySelector('.js-cert-msg'), btn = cert.querySelector('.js-cert-print');
    const naam = naamEl.value.trim();
    const problemen = [];
    if (missingVerplicht.length) problemen.push(`rond eerst hoofdstuk ${missingVerplicht.join(' en ')} af`);
    if (routeDone < minRoute) problemen.push(`rond minstens ${minRoute} hoofdstuk uit je route (3 tot 8) af`);
    if (!laatsteOk) problemen.push('markeer les 9.1 als voltooid');
    if (!naam) problemen.push('vul je naam in');
    const ok = problemen.length === 0;
    msg.textContent = ok ? `Goed bezig. Je certificaat vermeldt ${afgerond.length} afgeronde ${afgerond.length === 1 ? 'hoofdstuk' : 'hoofdstukken'}.` : 'Nog te doen: ' + problemen.join('; ') + '.';
    btn.disabled = !ok;
    cert.querySelector('.js-cp-naam').textContent = naam || '…';
    cert.querySelector('.js-cp-school').textContent = schoolEl.value.trim();
    cert.querySelector('.js-cp-list').innerHTML = afgerond.map(h => `<li>Hoofdstuk ${h.nummer} · ${esc(h.titel)}</li>`).join('');
    cert.querySelector('.js-cp-date').textContent = new Date().toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (cert) {
    const naamEl = cert.querySelector('.js-cert-naam'), schoolEl = cert.querySelector('.js-cert-school');
    naamEl.value = state.naam || ''; schoolEl.value = state.school || '';
    [naamEl, schoolEl].forEach(el => el.addEventListener('input', () => { state.naam = naamEl.value; state.school = schoolEl.value; persist(); refreshCert(); }));
    cert.querySelector('.js-cert-print').addEventListener('click', () => { cert.querySelector('.js-cert-paper').classList.add('is-visible'); cert.querySelector('.js-cert-paper').setAttribute('aria-hidden', 'false'); setTimeout(() => window.print(), 200); });
  }

  // ---------- zijbalk op kleine schermen dichtklappen ----------
  if (window.matchMedia('(max-width: 900px)').matches) {
    document.querySelectorAll('.side-details[open]').forEach(d => d.removeAttribute('open'));
  }

  // ---------- start ----------
  refreshDoneMarks();
  loadStructuur().then(s => { structuur = s; refreshOverview(); refreshCert(); });
})();
