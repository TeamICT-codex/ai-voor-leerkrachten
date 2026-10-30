// De pagina rond De klas van de juf. Alles wat elke wereld gemeen heeft, staat
// in ../wereld.js; hier staan alleen de hoeken, de sleutel voor de stempels en
// het tafereel van de klas. "Lees mee" staat aan: de kinderen leren nog lezen.
import { startWereld } from '../wereld.js';
import { STATIONS } from './stations.js';

startWereld({
  stations: STATIONS,
  sleutel: 'leerlichtjes.1ste-graad.stempels',
  plaats: 'de klas',
  laad: async () => (await import('./klas.js')).maakKlas,
  leesMee: true,
  woord: { een: 'hoek', meer: 'hoeken' },
});
