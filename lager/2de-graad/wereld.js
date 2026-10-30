// De pagina rond Het dorp. Alles wat elke wereld gemeen heeft, staat in
// ../wereld.js; hier staan alleen de stations, de sleutel voor de stempels en
// het tafereel van het dorp.
import { startWereld } from '../wereld.js';
import { STATIONS } from './stations.js';

startWereld({
  stations: STATIONS,
  sleutel: 'leerlichtjes.2de-graad.stempels',
  plaats: 'het dorp',
  laad: async () => (await import('./dorp.js')).maakDorp,
});
