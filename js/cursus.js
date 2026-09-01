// Voegt de twee inhoudssporen samen en levert de opzoekfuncties waar de app
// mee werkt. De inhoudsbestanden blijven zo pure data.

import { MODULES_AI } from './inhoud.js';
import { MODULES_VIBE } from './inhoud-vibe.js';
import { WORKSHOPS, SPOREN } from './workshops.js';

// Elke module krijgt zijn spoor mee, zodat de app niet hoeft te weten uit
// welk bestand ze komt.
export const MODULES = [
  ...MODULES_AI.map((m) => ({ ...m, spoor: 'ai' })),
  ...MODULES_VIBE.map((m) => ({ ...m, spoor: 'vibe' })),
];

export { WORKSHOPS, SPOREN };

export const TOTAAL_LESSEN = MODULES.reduce((som, m) => som + m.lessen.length, 0);

export function vindModule(id) {
  return MODULES.find((m) => m.id === id) || null;
}

export function vindWorkshop(id) {
  return WORKSHOPS.find((w) => w.id === id) || null;
}

export function vindSpoor(id) {
  return SPOREN.find((s) => s.id === id) || null;
}

export function modulesVanSpoor(spoorId) {
  return MODULES.filter((m) => m.spoor === spoorId);
}

export function workshopsVanSpoor(spoorId) {
  return WORKSHOPS.filter((w) => w.spoor === spoorId);
}

// In welke workshop komt deze module aan bod? Handig om vanuit een module
// terug te verwijzen naar de sessie waar ze thuishoort.
export function workshopsVoorModule(moduleId) {
  return WORKSHOPS.filter((w) => w.draaiboek.some((b) => b.module === moduleId));
}

// Kloktijden berekenen vanaf een startuur ("09:00") — het draaiboek zelf
// bevat enkel duurtijden, zodat het voor elk startuur bruikbaar blijft.
export function metKloktijden(draaiboek, startuur) {
  const [uur, min] = startuur.split(':').map(Number);
  let loper = uur * 60 + min;
  return draaiboek.map((blok) => {
    const van = loper;
    loper += blok.minuten;
    return { ...blok, vanMin: van, totMin: loper, van: naarKlok(van), tot: naarKlok(loper) };
  });
}

export function naarKlok(totaalMinuten) {
  const m = ((totaalMinuten % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
