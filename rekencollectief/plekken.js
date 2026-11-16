// De teksten van de rekentoren. Elke plek hoort bij een voorwerp in toren.js;
// de volgorde hier is ook de volgorde van "Volgende" in het kaartje. De teksten
// komen letterlijk uit ONTWERP.md: ze zijn nagekeken tegen wat de app vandaag
// doet. Verzin er geen functies, cijfers of beloften bij.

// Het adres van de app, op één plek. De app verhuist later naar een eigen
// server: dan verander je alleen deze regel.
export const ADRES = 'https://rekencollectief.vercel.app';

// Per kamer: de naam van het hoofdstuk (bovenaan in het kaartje) en het korte
// woord op het label naast de toren en in het verhaal.
export const KAMERS = {
  hal: { naam: 'Binnen met een code', kort: 'Code' },
  oefen: { naam: 'Oefenen zonder druk', kort: 'Oefenen' },
  meet: { naam: 'De periodetoetsen', kort: 'Toetsen' },
  kleur: { naam: 'Zien waar iedereen staat', kort: 'Overzicht' },
  ster: { naam: 'Van meten naar doen', kort: 'Klasbeeld' },
};

export const PLEKKEN = [
  {
    id: 'code', kamer: 'hal', titel: 'Een code van zes cijfers',
    tekst: 'Elke opdracht of toets krijgt een eigen code. Die zet je op het bord. Een kind tikt ze in bij "Ik ben een leerling" en start precies wat jij klaarzette: de bewerkingen, het aantal en de tijd.',
  },
  {
    id: 'naam', kamer: 'hal', titel: 'Naam aantikken',
    tekst: 'Staat je klaslijst in de app, dan tikt een kind gewoon zijn naam aan, met een eigen icoontje erbij. Niemand hoeft te typen, en geen enkel kind heeft een account nodig.',
  },

  {
    id: 'tovenaar', kamer: 'oefen', titel: 'De rekentovenaar',
    tekst: 'Na een reeks krijgt elk kind feedback van de tovenaar: wat goed ging, welke bewerking nog lastig is, en een tip om ze te onthouden. Kort en warm, in kindertaal. De tovenaar werkt met AI. Jij krijgt bij dezelfde reeks een analyse met didactische tips.',
  },
  {
    id: 'zelf', kamer: 'oefen', titel: 'Ik oefen zelf',
    tekst: 'Kinderen kiezen zelf wat ze oefenen. Ze verdienen XP en levels en spelen avatars vrij. Een bewerking die fout ging, komt later vanzelf terug bij "Jouw uitdagingen".',
  },
  {
    id: 'reis', kamer: 'oefen', titel: 'De Getallenreis',
    tekst: 'Voor het getalbegrip in de eerste leerjaren: splitsen in de Splits-Fabriek en stippen flitsen in de Flits-Grot.',
  },

  {
    id: 'fiche', kamer: 'meet', titel: 'De kwaliteitsfiche als kompas',
    tekst: 'Van periode A* tot E, met per leerjaar de juiste onderdelen: tafels, splitsingen, plus en min tot 20, tot 100 en tot 1000. Jij kiest je klas en de periode, de app zet de reeksen klaar.',
  },
  {
    id: 'klok', kamer: 'meet', titel: 'Een klok die niet opjaagt',
    tekst: 'Een toets meet ook het tempo, maar niet elk kind is gebaat bij een klok die aftelt. Jij kiest een harde of een zachte klok. En vóór de start beslist het kind zelf of het de klok wil zien.',
  },
  {
    id: 'wen', kamer: 'meet', titel: 'Eerst wennen',
    tekst: 'Met een wenronde leren kinderen het ritueel kennen: dezelfde soort bewerkingen, maar korter, en ze telt niet mee.',
  },

  {
    id: 'overzicht', kamer: 'kleur', titel: 'Het periode-overzicht',
    tekst: 'Leerlingen in de rijen, onderdelen in de kolommen. Groen: juist én vlot. Oranje: bijna, nog niet vlot, of te weinig gemaakt. Rood: te veel fouten. Ook wat je op papier afnam, zet je erbij.',
  },
  {
    id: 'schildpad', kamer: 'kleur', titel: 'Kennen is nog niet vlot ophalen',
    tekst: 'Wat uit het hoofd moet, haal je op in gemiddeld hoogstens 5 seconden per bewerking. Wie juist rekent maar trager is, krijgt een schildpadje en staat oranje, nooit rood. Zo zie je wie moet automatiseren en wie nog uitleg nodig heeft.',
  },
  {
    id: 'volgkaart', kamer: 'kleur', titel: 'Elk kind doorheen het jaar',
    tekst: 'Klik op een naam en je ziet de volgkaart: hoe een leerling evolueert van periode tot periode. Afdrukken of exporteren kan, bijvoorbeeld voor het zorgoverleg.',
  },

  {
    id: 'klasbeeld', kamer: 'ster', titel: 'Het klasbeeld',
    tekst: 'Eén klik op "Analyseer periode" en je krijgt een beeld van je hele klas: per onderdeel wat sterk staat en wat opnieuw uitleg vraagt, met concrete stappen voor de komende weken. De analyse werkt met AI. Jij beslist wat je ermee doet.',
  },
  {
    id: 'groepjes', kamer: 'ster', titel: 'Drie groepen, drie aanpakken',
    tekst: 'De analyse stelt werkgroepen voor: wie zelfstandig verder kan, wie baat heeft bij extra oefening, en wie opnieuw instructie nodig heeft.',
  },
  {
    id: 'samen', kamer: 'ster', titel: 'Gemaakt met en voor leerkrachten',
    tekst: 'Het Rekencollectief is een project van de werkgroep automatiseren van Het leercollectief, met begeleiding van de pedagogische begeleidingsdienst. Wat scholen melden, komt in de app terecht: wat er verandert, lees je in "Kort op de bal".',
  },
];

// "Speel het verhaal af": één regel per stap. De tijdlijn zelf (wanneer de
// camera waar is) staat in toren.js (VERHAAL); deze regels staan er in dezelfde
// volgorde bij. Met minder beweging of zonder 3D staan ze er als gewone lijst.
// Ze zeggen niets wat de hoofdstukken niet al zeggen.
export const VERHAAL_REGELS = {
  poort: 'Van de poort naar de sterrenwacht: zo verloopt een periode met Het Rekencollectief.',
  hal: 'Jij zet een opdracht klaar. Je leerlingen tikken de code in, kiezen hun naam en beginnen.',
  oefen: 'Ze oefenen zonder druk, en na een reeks geeft de rekentovenaar hun feedback.',
  meet: 'Een paar keer per jaar meet je met de periodetoetsen waar elke leerling staat.',
  kleur: 'Eén tabel toont alle leerlingen en alle onderdelen: groen, oranje of rood.',
  ster: 'De tovenaar maakt een klasbeeld en stelt drie werkgroepen voor. Jij beslist wat je ermee doet.',
};
