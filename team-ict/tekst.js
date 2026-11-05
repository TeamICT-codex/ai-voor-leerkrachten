// Kleine hulpjes voor tekst die de informatielaag en het logboek allebei nodig
// hebben: escapen, datums in woorden en zoeken zonder hoofdletters of accenten.

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// 2026-09-11 wordt "11 september 2026", 2025-05 wordt "mei 2025".
// zonderJaar: laat het jaar weg (voor een datum in het lopende jaar).
export function datumTekst(iso, { zonderJaar = false } = {}) {
  const [j, m, d] = iso.split('-').map(Number);
  return `${d ? d + ' ' : ''}${MAANDEN[m - 1]}${zonderJaar ? '' : ' ' + j}`;
}

// Zonder hoofdletters en accenten: "Coördinator" en "coordinator" zijn hetzelfde.
export const plat = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const STOPWOORDEN = new Set('de het een is ik mijn niet werkt op van en of in met voor naar wat hoe er ze je we wij dat die dit kan moet wil heb heeft geen meer bij aan om te zijn'.split(' '));
export const woordenVan = s => plat(s).split(/[^a-z0-9²]+/).filter(Boolean);
// De woorden waarop gezocht wordt: zonder stopwoorden en losse letters.
export const zoekwoorden = s => woordenVan(s).filter(w => w.length > 1 && !STOPWOORDEN.has(w));
