// Verzamelt elke tekst die Leerlichtjes kan voorlezen, in lager/stem/teksten.json.
// Daarna leest gemini.py in wat nog ontbreekt (zie LEESMIJ.md).
//
//   node lager/stem/verzamel.mjs
//
// We lezen de stations van elke graad zoals de wereld ze leest, en maken de
// teksten met dezelfde functies: voorleesTekst() voor de knop "Lees voor", en de
// zinnen van elk station voor "Lees mee". Zo kan de lijst niet uit de pas lopen
// met wat er echt voorgelezen wordt.
import fs from 'node:fs';
import { voorleesTekst } from '../stem.js';

const GRADEN = ['1ste-graad', '2de-graad', '3de-graad'];
const DOEL = new URL('teksten.json', import.meta.url);

const teksten = [];
const perGraad = {};
for (const graad of GRADEN) {
  let STATIONS;
  try {
    ({ STATIONS } = await import(`../${graad}/stations.js`));
  } catch (fout) {
    console.error(`${graad}/stations.js laadt niet in node. Raakt het bestand bij het laden de pagina aan (document, window)? Dat mag niet.`);
    throw fout;
  }
  const voor = teksten.length;
  for (const s of STATIONS)
    teksten.push(voorleesTekst(s.ontdek), ...(s.zinnen ?? []), voorleesTekst(s.praat));
  perGraad[graad] = teksten.length - voor;
}

const leeg = teksten.filter(t => typeof t !== 'string' || !t.trim());
if (leeg.length) throw new Error(`Er staan ${leeg.length} lege teksten in de lijst.`);
const uniek = [...new Set(teksten)];
fs.writeFileSync(DOEL, JSON.stringify(uniek, null, 2) + '\n');

const tekens = uniek.reduce((n, t) => n + t.length, 0);
console.log(`${uniek.length} verschillende teksten (${tekens} tekens) in lager/stem/teksten.json`);
for (const [graad, n] of Object.entries(perGraad)) console.log(`  ${graad}: ${n} teksten`);
