// De twee oefenblokken keuze en sorteer lezen. build.mjs maakt er HTML van,
// check.mjs controleert er de schrijfwijze mee; zo lezen beide ze op dezelfde manier.
//
//   ::: keuze Titel van de oefening
//   vraag: De vraag of situatie.
//   * Het juiste antwoord | feedback na een klik
//   - Een ander antwoord | feedback na een klik
//   vraag: Een tweede vraag in dezelfde reeks (mag, hoeft niet).
//   - ... | ...
//   :::
//
//   ::: sorteer Titel van de oefening
//   bakken: Gerust | Pas het eerst aan | Niet in een chatbot
//   - Tekst van het kaartje | 1 | feedback voor dit kaartje
//   :::
//
// Elke functie geeft ook een lijst problemen terug, in gewone taal: de build zet
// ze bij de waarschuwingen, de controle bij de fouten.

// "tekst | rest | nog meer" → ['tekst', 'rest', 'nog meer'], maar maximaal n delen:
// een | in de feedback zelf blijft dan staan.
function splits(regel, n) {
  const delen = regel.split('|');
  const kop = delen.slice(0, n - 1).map(x => x.trim());
  const rest = delen.slice(n - 1).join('|').trim();
  return delen.length >= n ? [...kop, rest] : delen.map(x => x.trim());
}

export function leesKeuze(inner) {
  const intro = []; const vragen = []; const problemen = [];
  for (const line of inner.split(/\r?\n/)) {
    const v = line.match(/^\s*vraag:\s*(.*)$/i);
    const o = line.match(/^\s*([*-])\s+(.*)$/);
    if (v) { vragen.push({ vraag: v[1].trim(), opties: [] }); continue; }
    if (o && vragen.length) {
      const [tekst, feedback = ''] = splits(o[2], 2);
      vragen[vragen.length - 1].opties.push({ juist: o[1] === '*', tekst, feedback });
      continue;
    }
    if (!line.trim()) continue;
    // Voor de eerste vraag: een korte inleiding. Daarna: de vraag loopt door op
    // een volgende regel, zolang er nog geen antwoord onder staat.
    if (!vragen.length) intro.push(line);
    else if (!vragen[vragen.length - 1].opties.length) vragen[vragen.length - 1].vraag += ' ' + line.trim();
    else problemen.push(`regel niet herkend (begin met "vraag:", "*" of "-"): "${line.trim()}"`);
  }
  if (!vragen.length) problemen.push('geen regel "vraag:"');
  vragen.forEach((v, i) => {
    const n = vragen.length > 1 ? ` (vraag ${i + 1})` : '';
    if (!v.vraag) problemen.push(`lege vraag${n}`);
    if (v.opties.length < 2) problemen.push(`minder dan twee antwoorden${n}`);
    v.opties.forEach(o => { if (!o.feedback) problemen.push(`antwoord "${o.tekst}" zonder feedback na de |${n}`); });
  });
  return { intro, vragen, problemen };
}

export function leesSorteer(inner) {
  const intro = []; let bakken = []; const kaarten = []; const problemen = [];
  for (const line of inner.split(/\r?\n/)) {
    const b = line.match(/^\s*bakken:\s*(.*)$/i);
    const k = line.match(/^\s*[-*]\s+(.*)$/);
    if (b) { bakken = b[1].split('|').map(x => x.trim()).filter(Boolean); continue; }
    if (k && k[1].includes('|')) {
      if (!bakken.length) { problemen.push(`kaartje voor de regel "bakken:": "${k[1].trim()}"`); continue; }
      const [tekst, nr = '', feedback = ''] = splits(k[1], 3);
      const bak = /^\d+$/.test(nr) ? parseInt(nr, 10) : NaN;
      if (!(bak >= 1 && bak <= bakken.length)) { problemen.push(`kaartje "${tekst}" heeft geen geldige bak ("${nr}", kies 1 tot ${bakken.length})`); continue; }
      if (!feedback) problemen.push(`kaartje "${tekst}" zonder feedback`);
      kaarten.push({ tekst, bak, feedback });
      continue;
    }
    if (line.trim()) intro.push(line);
  }
  if (bakken.length < 2) problemen.push('de regel "bakken:" ontbreekt of heeft minder dan twee bakken');
  if (bakken.length > 4) problemen.push(`${bakken.length} bakken: meer dan vier past niet goed op een scherm`);
  if (kaarten.length < 2) problemen.push('minder dan twee kaartjes');
  return { intro, bakken, kaarten, problemen };
}
