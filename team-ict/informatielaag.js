// Zet de informatielaag op de pagina: het laatste nieuws bovenaan, de helpdesk in
// cijfers, de wegwijzer, de hangijzers, het projectbord en het logboek. De
// gegevens staan in informatie.js. Wat in de raket te zien is, krijgt een knop
// "Toon in de raket": toonInRaket(toon) opent dat kaartje of scrolt naar het
// hoofdstuk (zie pagina.js).
import { BIJGEWERKT, NIEUWS, HANGIJZERS, VRAGEN, TOPVRAGEN, HELPDESK_CIJFERS, BORD, BORD_NOOT } from './informatie.js';
import { HELPDESK } from './plekken.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
// 2026-09-11 wordt "11 september 2026", 2025-05 wordt "mei 2025".
function datumTekst(iso) {
  const [j, m, d] = iso.split('-').map(Number);
  return `${d ? d + ' ' : ''}${MAANDEN[m - 1]} ${j}`;
}
let naamVan = toon => toon;
// Een plek krijgt een knop die haar kaartje in de raket opent, een hoofdstuk (#…)
// een gewone link. Op de knop staat de naam van de plek erbij: zichtbaar
// (naamZichtbaar), of onzichtbaar voor een schermlezer, zodat die de vele knoppen
// "Toon in de raket" uit elkaar houdt.
function toonKnop(toon, { tekst = 'Toon in de raket', naamZichtbaar = false } = {}) {
  if (toon.startsWith('#')) return `<a class="knop klein zacht" href="${esc(toon)}">${esc(tekst)}</a>`;
  const naam = naamZichtbaar ? `: ${esc(naamVan(toon))}` : `<span class="verborgen-tekst">: ${esc(naamVan(toon))}</span>`;
  return `<button class="knop klein zacht" type="button" data-toon="${esc(toon)}">${esc(tekst)}${naam}</button>`;
}
const helpdeskLink = (tekst = 'Meld via de helpdesk') => `<a class="knop klein" href="${esc(HELPDESK)}">${esc(tekst)}</a>`;

export function bouwInformatielaag({ toonInRaket, naamVan: naam }) {
  naamVan = naam;
  // Eén luisteraar voor alle knoppen "Toon in de raket", ook die later verschijnen.
  document.addEventListener('click', e => {
    const knop = e.target.closest('[data-toon]');
    if (knop) toonInRaket(knop.dataset.toon, knop);
  });
  bouwLaatsteNieuws();
  bouwCijfers();
  bouwWegwijzer();
  bouwHangijzers();
  bouwBord();
  bouwLogboek();
}

// ── bovenaan: het laatste nieuws in één regel ──
function bouwLaatsteNieuws() {
  const el = document.querySelector('.laatste-nieuws');
  if (!el) return;
  const n = NIEUWS[0];
  el.innerHTML = `<a href="#nieuws"><span class="nieuw-label">Nieuw</span> ${esc(n.titel)} <span class="datum">· ${esc(datumTekst(n.datum))}</span></a>`;
}

// ── de helpdesk in cijfers (voorbeeldcijfers) ──
function bouwCijfers() {
  const el = document.querySelector('.helpdesk-cijfers');
  if (!el) return;
  const c = HELPDESK_CIJFERS;
  const top = Math.max(...c.categorieen.map(x => x[1]));
  // Voorbeeldcijfers staan als voorbeeld aangeduid bovenaan, bij elke tussenkop en
  // in de grafiek. De inzichten komen er pas bij met echte cijfers: een besluit
  // uit een verzonnen cijfer zou een lezer als feit kunnen overnemen.
  const vb = c.voorbeeld;
  el.innerHTML = `
    <div class="cijfers-kop"><h3>De helpdesk in cijfers</h3></div>
    ${vb ? '<p class="voorbeeld-melding"><strong>Voorbeeldcijfers.</strong> Ze tonen hoe dit blok eruit zal zien. De echte cijfers komen uit de rapportage van het ticketsysteem.</p>' : ''}
    <dl class="kpis">${c.kern.map(([a, b]) => `<div><dt>${esc(b)}</dt><dd>${esc(a)}</dd></div>`).join('')}</dl>
    <h4>Meldingen per maand · ${vb ? 'voorbeeld' : esc(c.periode)}</h4>
    ${grafiek(c)}
    <h4>Waarover gaan de meldingen?${vb ? ' · voorbeeld' : ''}</h4>
    <ul class="categorieen">${c.categorieen.map(([n, v]) =>
      `<li${v === top ? ' class="top"' : ''}><span>${esc(n)}</span><span class="balk" aria-hidden="true"><i style="width:${(v / top * 100).toFixed(1)}%"></i></span><b>${v}%</b></li>`).join('')}</ul>
    ${vb ? '' : `<ul class="inzichten">${c.inzichten.map(i => `<li>${esc(i.tekst)}${i.toon ? ' ' + toonKnop(i.toon) : ''}</li>`).join('')}</ul>`}`;
}
// Een staafdiagram in SVG met een vaste tekening: het schaalt mee met de breedte.
function grafiek(c) {
  const W = 300, H = 160, L = 30, R = 4, T = 16, B = 22, max = 700;
  const bw = (W - L - R) / c.maanden.length;
  const y = v => T + (H - T - B) * (1 - v / max);
  const r = x => Math.round(x * 10) / 10;
  let svg = '';
  for (const t of [0, 200, 400, 600]) svg += `<line class="as" x1="${L}" x2="${W - R}" y1="${r(y(t))}" y2="${r(y(t))}"/><text x="${L - 5}" y="${r(y(t) + 3.5)}" text-anchor="end">${t}</text>`;
  c.maanden.forEach(([m, v], i) => {
    const x = L + i * bw + bw * 0.18, w = bw * 0.64, piek = c.pieken.includes(m);
    svg += `<rect class="staaf${piek ? ' piek' : ''}" x="${r(x)}" y="${r(y(v))}" width="${r(w)}" height="${r(y(0) - y(v))}" rx="2.5"/>`;
    svg += `<text x="${r(x + w / 2)}" y="${H - 7}" text-anchor="middle">${m}</text>`;
    if (piek) svg += `<text class="waarde" x="${r(x + w / 2)}" y="${r(y(v) - 4)}" text-anchor="middle">${v}</text>`;
  });
  const lijst = c.maanden.map(([m, v]) => `${m} ${v}`).join(', ');
  return `<svg class="grafiek" viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.voorbeeld ? 'Voorbeeldcijfers. ' : ''}Staafdiagram van het aantal meldingen per maand: ${esc(lijst)}">${svg}</svg>`;
}

// ── de wegwijzer: zoeken in de vragen ──
const STOPWOORDEN = new Set('de het een is ik mijn niet werkt op van en of in met voor naar wat hoe er ze je we wij dat die dit kan moet wil heb heeft geen meer bij aan om te zijn'.split(' '));
const plat = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function bouwWegwijzer() {
  const zoek = document.querySelector('#zoek');
  if (!zoek) return;
  const telling = document.querySelector('.zoek-telling');
  const lijst = document.querySelector('.antwoorden');
  const alle = document.querySelector('.toon-alle-vragen');
  let alleTonen = false;
  const antwoord = q => `<li class="antwoord${q.dringend ? ' dringend' : ''}">
      <p class="vraag">${esc(q.v)}</p>
      <p class="wie"><span>Volgt op</span> <strong>${esc(q.wie)}</strong>${q.sub ? ' · ' + esc(q.sub) : ''}</p>
      ${q.tip ? `<p class="tip">${esc(q.tip)}</p>` : ''}
      <div class="knoppen">${helpdeskLink()}${q.toon ? toonKnop(q.toon, { tekst: q.toon.startsWith('#') ? 'Bekijk het team' : 'Toon in de raket' }) : ''}</div>
    </li>`;
  function toon() {
    const q = plat(zoek.value.trim());
    const woorden = q.split(/[^a-z0-9²]+/).filter(w => w.length > 1 && !STOPWOORDEN.has(w));
    let gevonden;
    if (q.length >= 2 && woorden.length) {
      // Een zoekwoord telt zwaarder dan een woord uit de vraag zelf.
      const gescoord = VRAGEN.map(v => {
        const woordenVraag = plat(`${v.v} ${v.wie}`).split(/[^a-z0-9²]+/), sleutels = plat(v.zoek || '').split(/\s+/);
        const score = woorden.reduce((s, w) => s + (sleutels.some(z => z.startsWith(w)) ? 3 : woordenVraag.some(z => z.startsWith(w)) ? 2 : 0), 0);
        return { v, score };
      }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
      const beste = gescoord.length ? gescoord[0].score : 0;
      gevonden = gescoord.filter(x => x.score >= Math.max(2, beste / 2)).map(x => x.v);
      telling.textContent = gevonden.length
        ? `${gevonden.length} ${gevonden.length === 1 ? 'vraag past' : 'vragen passen'} bij je zoekterm.`
        : 'Geen vraag gevonden. Meld het gewoon via de helpdesk: wij zoeken uit bij wie je vraag hoort.';
      alle.hidden = true;
    } else {
      gevonden = alleTonen ? VRAGEN : TOPVRAGEN.map(t => VRAGEN.find(v => v.v === t)).filter(Boolean);
      telling.textContent = alleTonen ? `Alle ${VRAGEN.length} vragen uit de wegwijzer.` : 'Vaak gestelde vragen.';
      alle.hidden = alleTonen;
      alle.textContent = `Toon alle ${VRAGEN.length} vragen`;
    }
    lijst.innerHTML = gevonden.length ? gevonden.map(antwoord).join('')
      : `<li class="antwoord"><p class="vraag">Niet gevonden wat je zocht?</p><p class="wie">Elke vraag mag via de helpdesk, ook als je niet weet bij wie ze hoort.</p><div class="knoppen">${helpdeskLink()}</div></li>`;
  }
  zoek.addEventListener('input', toon);
  // Na "Toon alle vragen" verdwijnt de knop: de focus gaat naar de eerste vraag.
  alle.addEventListener('click', () => {
    alleTonen = true;
    toon();
    const eerste = lijst.querySelector('.vraag');
    eerste?.setAttribute('tabindex', '-1');
    eerste?.focus();
  });
  toon();
}

// ── de hangijzers ──
function bouwHangijzers() {
  const el = document.querySelector('.hangijzers');
  if (!el) return;
  el.innerHTML = HANGIJZERS.map(h => {
    const woord = h.temp >= 5 ? 'Heet' : h.temp >= 4 ? 'Warm' : 'Lauw';
    return `<details class="hangijzer">
      <summary>
        <h3 class="titel">${esc(h.titel)}</h3>
        <span class="temp"><span class="streepjes" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<i${i <= h.temp ? ' class="aan"' : ''}></i>`).join('')}</span>${woord}<span class="verborgen-tekst">, ${h.temp} op 5</span></span>
        <span class="kort">${esc(h.kort)}</span>
      </summary>
      <div class="inhoud">
        <h4>Wat speelt er?</h4><p>${esc(h.wat)}</p>
        <h4>Waarom is het belangrijk?</h4><p>${esc(h.waarom)}</p>
        <h4>Wat doet Team ICT?</h4><p>${esc(h.wij)}</p>
        <div class="voor-jou"><h4>Wat betekent het voor jou?</h4><p>${esc(h.jij)}</p></div>
        <div class="knoppen">${(h.toon || []).map(t => toonKnop(t, { naamZichtbaar: true })).join('')}</div>
      </div>
    </details>`;
  }).join('');
}

// ── het projectbord ──
const KOLOMMEN = [
  ['gebruik', 'In gebruik', 'Toepassingen en diensten die je vandaag kan gebruiken.'],
  ['loopt', 'Loopt nu', 'Trajecten die naast de dagelijkse werking lopen.'],
  ['lijst', 'Op de lijst', 'Toekomstige projecten, nog zonder volgorde.'],
];
function bouwBord() {
  const filter = document.querySelector('.bord-filter'), bord = document.querySelector('.bord');
  if (!bord) return;
  let keuze = 'alles';
  filter.innerHTML = [['alles', 'Alles'], ['pedagogisch', 'In de klas'], ['technisch', 'Technisch']]
    .map(([id, l]) => `<button class="filter" type="button" data-filter="${id}" aria-pressed="${id === keuze}">${l}</button>`).join('');
  function toon() {
    for (const b of filter.querySelectorAll('[data-filter]')) b.setAttribute('aria-pressed', String(b.dataset.filter === keuze));
    bord.innerHTML = KOLOMMEN.map(([s, titel, uitleg]) => {
      const kaarten = BORD.filter(k => k.status === s && (keuze === 'alles' || k.soort === keuze));
      // Een lege kolom zou zeggen dat er niets is, terwijl de filter het verbergt.
      if (!kaarten.length) return '';
      return `<section class="kolom ${s}" aria-label="${titel}">
        <h3>${titel} <span class="teller">${kaarten.length}</span></h3>
        <p class="kolom-uitleg">${uitleg}</p>
        <ul>${kaarten.map(k => `<li><button class="bordkaart" type="button" data-toon="${esc(k.toon)}">
          <span class="naam">${esc(k.naam)}</span>
          <span class="waar">${esc(k.waar)}</span>
          <span class="wanneer">${esc([k.wanneer, k.trekker ? 'Trekker: ' + k.trekker : ''].filter(Boolean).join(' · '))}</span>
        </button></li>`).join('')}</ul>
      </section>`;
    }).join('');
  }
  filter.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    keuze = b.dataset.filter;
    toon();
  });
  toon();
  const noot = document.querySelector('.bord-noot');
  if (noot) noot.textContent = BORD_NOOT;
}

// ── het logboek: de drie nieuwste, de rest op vraag ──
function bouwLogboek() {
  const el = document.querySelector('.logboek'), meer = document.querySelector('.logboek-meer');
  if (!el) return;
  const post = (n, i) => `<li class="post"${i >= 3 ? ' hidden' : ''}>
      <time datetime="${esc(n.datum)}">${esc(datumTekst(n.datum))}</time>
      <div>
        <h3>${esc(n.titel)}</h3>
        <p>${esc(n.tekst)}</p>
        <div class="tags">${n.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}${n.toon ? toonKnop(n.toon, { tekst: n.toon.startsWith('#') ? 'Lees meer' : 'Toon in de raket' }) : ''}</div>
      </div>
    </li>`;
  el.innerHTML = NIEUWS.map(post).join('');
  meer.hidden = NIEUWS.length <= 3;
  // Na "Toon ouder nieuws" verdwijnt de knop: de focus gaat naar het eerste oudere bericht.
  meer.addEventListener('click', () => {
    for (const li of el.querySelectorAll('li[hidden]')) li.hidden = false;
    meer.hidden = true;
    const kop = el.querySelectorAll('li')[3]?.querySelector('h3');
    kop?.setAttribute('tabindex', '-1');
    kop?.focus();
  });
  const bijgewerkt = document.querySelector('.bijgewerkt');
  if (bijgewerkt) bijgewerkt.textContent = `Bijgewerkt op ${datumTekst(BIJGEWERKT)}.`;
}
