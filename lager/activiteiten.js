// Kleine bouwstenen voor de activiteiten van Leerlichtjes, gedeeld door alle
// graden. Elke activiteit draait volledig in de browser, zonder AI-dienst en
// zonder dat er iets van de kinderen bewaard wordt.
//
// Een activiteit is een functie maak(vak, klaar): ze bouwt zichzelf op in het
// element vak en roept klaar() op zodra de klas genoeg gedaan heeft om de
// stempel te verdienen.

export function el(tag, eigenschappen = {}, ...kinderen) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(eigenschappen)) {
    if (k === 'tekst') e.textContent = v;
    else if (k === 'klasse') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const kind of kinderen) if (kind != null) e.append(kind);
  return e;
}
export function knop(tekst, actie, klasse = 'll-knop') {
  return el('button', { type: 'button', klasse, tekst, onclick: actie });
}
export function inzicht(tekst) {
  return el('p', { klasse: 'll-inzicht', tekst });
}
export const wacht = ms => new Promise(r => setTimeout(r, ms));
export const stil = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Voorlezen: een Nederlandse stem als het toestel er een heeft, liefst een
// Vlaamse. spreek() leest alleen voor als "Lees mee" aanstaat (zie wereld.js):
// voor de 1ste graad, waar de kinderen nog maar net leren lezen.
export function stem() {
  const stemmen = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
  return stemmen.find(v => v.lang === 'nl-BE') || stemmen.find(v => v.lang?.startsWith('nl')) || null;
}
// erachter: wacht tot wat er nu voorgelezen wordt, gedaan is. Geeft een
// belofte terug die afloopt als de zin uitgesproken is (of meteen, als er niet
// voorgelezen wordt). Sommige browsers melden het einde niet: daarom wachten we
// nooit langer dan de zin ongeveer duurt.
export function spreek(tekst, { erachter = false } = {}) {
  if (!document.body.classList.contains('lees-mee')) return Promise.resolve();
  const v = stem();
  if (!v) return Promise.resolve();
  if (!erachter) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(tekst);
  u.voice = v;
  u.lang = v.lang;
  u.rate = 0.9;
  const klaar = new Promise(r => { u.onend = u.onerror = r; });
  speechSynthesis.speak(u);
  return Promise.race([klaar, wacht(1500 + tekst.length * 90)]);
}
// Een tekening voor op een kaartje of een bak: een stukje SVG.
export function beeld(svg, klasse = 'll-beeld') {
  const b = el('span', { klasse, 'aria-hidden': 'true' });
  b.innerHTML = svg;
  return b;
}

// Sorteerspel met bakken. Werkt met klikken en met het toetsenbord: kies een
// kaartje, kies dan een bak.
export function sorteer(vak, { bakken, kaarten, klaar, slot, opdracht = 'Kies een kaartje en leg het in de juiste bak.' }) {
  const stapel = el('div', { klasse: 'll-stapel' + (kaarten.some(k => k.beeld) ? ' met-beelden' : '') });
  const rij = el('div', { klasse: 'll-bakken' });
  const terug = el('p', { klasse: 'll-terug', 'aria-live': 'polite' });
  let gekozen = null, gedaan = 0;
  const bakEls = bakken.map(b => {
    const bak = el('button', { type: 'button', klasse: 'll-bak' + (b.beeld ? ' met-beeld' : ''), 'data-bak': b.id, disabled: '' },
      b.beeld ? beeld(b.beeld) : null, el('strong', { tekst: b.naam }), el('span', { klasse: 'll-bak-inhoud' }));
    bak.style.setProperty('--bak', b.kleur);
    bak.addEventListener('click', () => leg(b.id));
    rij.append(bak);
    return bak;
  });
  const kaartEls = kaarten.map((k, i) => {
    const kaart = k.beeld
      ? el('button', { type: 'button', klasse: 'll-kaart met-beeld' }, beeld(k.beeld), el('span', { tekst: k.tekst }))
      : el('button', { type: 'button', klasse: 'll-kaart', tekst: k.tekst });
    kaart.addEventListener('click', () => kies(i));
    stapel.append(kaart);
    return kaart;
  });
  function kies(i) {
    gekozen = i;
    kaartEls.forEach((k, j) => k.classList.toggle('gekozen', j === i));
    bakEls.forEach(b => b.removeAttribute('disabled'));
    terug.className = 'll-terug';
    terug.textContent = 'In welke bak hoort dit kaartje?';
    // Wie nog niet leest, hoort ook welke bakken er zijn.
    spreek(kaarten[i].tekst + '. ' + bakken.map(b => b.naam).join(', of: ') + '?');
  }
  function leg(bakId) {
    if (gekozen == null) return;
    const k = kaarten[gekozen], kaart = kaartEls[gekozen];
    const juist = k.bak === bakId;
    terug.className = 'll-terug ' + (juist ? 'juist' : 'nog');
    terug.textContent = (juist ? 'Juist! ' : 'Nog eens bekijken: ') + k.uitleg;
    spreek(terug.textContent);
    if (!juist) return;
    kaart.classList.remove('gekozen');
    kaart.disabled = true;
    kaart.classList.add('gelegd');
    bakEls.find(b => b.dataset.bak === bakId).querySelector('.ll-bak-inhoud').append(k.beeld && !k.kort ? beeld(k.beeld, 'll-mini-beeld') : el('span', { klasse: 'll-mini', tekst: k.kort || '✓' }));
    gekozen = null;
    bakEls.forEach(b => b.setAttribute('disabled', ''));
    if (++gedaan === kaarten.length) {
      if (slot) { vak.append(inzicht(slot)); spreek(slot, { erachter: true }); }
      klaar();
    }
  }
  vak.append(el('p', { klasse: 'll-opdracht', tekst: opdracht }), stapel, rij, terug);
}
