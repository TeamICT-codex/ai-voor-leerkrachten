// De pagina rond De stad van morgen. Alles wat elke wereld gemeen heeft, staat
// in ../wereld.js; hier staan alleen de stations, de sleutel voor de stempels
// en het tafereel van de stad.
import { startWereld } from '../wereld.js';
import { STATIONS } from './stations.js';

startWereld({
  stations: STATIONS,
  sleutel: 'leerlichtjes.3de-graad.stempels',
  plaats: 'de stad',
  laad: async () => (await import('./stad.js')).maakStad,
});
