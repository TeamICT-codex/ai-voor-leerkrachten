// Bouwstenen voor een zelf samengestelde sessie — een uur op een
// personeelsvergadering, veertig minuten op een vakwerkgroep, een halve
// studiedag. Dit bestand bevat de blokken die in eender welke sessie passen,
// en vijf sjablonen als vertrekpunt voor wie voor een leeg scherm staat.
//
// Dit is data, net als de inhoudsbestanden. De motor staat in cursus.js
// (sessieUitCode, bouwSessieWorkshop), het scherm in app.js.
//
// Alles hier is platte tekst zonder HTML: het gaat op het scherm door esc(),
// net als de velden van een draaiboekblok in workshops.js.
//
// De 'd' van een sjabloon is letterlijk de waarde van de d-parameter uit een
// sessielink, en de volgorde in die lijst ís de volgorde van de sessie:
//   a1.vier-knoppen   een draaiboekblok, <workshop-id>.<blok-id>
//   m.beleid-kader    een hele module, m.<module-id>
//   pauze             een generiek blok hieronder, met zijn id
//   ...*10            overschrijft de duur van dat onderdeel
// Hernoem dus geen blok-id in workshops.js zonder de sjablonen hier mee na te
// kijken; het controlescript in CLAUDE.md vangt een verbroken sjabloon af.

// De generieke blokken. Dezelfde vorm als een draaiboekblok in workshops.js
// (id, soort, minuten, titel, wat, tips), zodat de draaiboekweergave er
// ongewijzigd op draait. Hun minuten zijn een standaard: in de bouwer zet je
// er een ander getal voor in de plaats.
export const GENERIEKE_BLOKKEN = [
  {
    id: 'onthaal',
    soort: 'instap',
    minuten: 10,
    titel: 'Onthaal en verwachtingen',
    wat: 'Kort rondje: wat verwacht je van dit uur, en welke taak slorpt vandaag te veel van je tijd op?',
    tips: [
      'Schrijf de antwoorden zichtbaar op het bord. Je verwijst er de rest van de sessie naar terug, en dat maakt het meteen persoonlijk.',
      'Zeg er meteen bij dat niemand iets moet kunnen en dat er geen domme vragen zijn. Dat scheelt een halfuur stilte.',
    ],
  },
  {
    id: 'pauze',
    soort: 'pauze',
    minuten: 15,
    titel: 'Pauze',
    wat: 'Koffie, en even weg van het scherm.',
    tips: [
      'Zet het uur waarop je weer begint zichtbaar op het bord. Zonder dat uur duurt een pauze van vijftien minuten er vijfentwintig.',
      'Blijf zelf in de zaal. De vragen die niemand plenair durft te stellen, komen net nu.',
    ],
  },
  {
    id: 'eigen',
    soort: 'doen',
    minuten: 15,
    titel: 'Eigen inbreng',
    wat: 'Ruimte voor iets van de school zelf: een eigen afspraak, een voorbeeld uit een eigen klas, een vraag die in het team leeft.',
    tips: [
      'Geef dit blok een eigen titel in de bouwer, anders weet niemand in de zaal wat er komt.',
      'Hou het concreet: één voorbeeld uit jullie eigen school doet meer dan drie algemene.',
    ],
  },
  {
    id: 'vragen',
    soort: 'gesprek',
    minuten: 10,
    titel: 'Vragen',
    wat: 'Open vragenronde over alles wat voorbijkwam.',
    tips: [
      'Laat eerst twee minuten stilte vallen. De eerste vraag komt altijd traag.',
      'Weet je iets niet, zeg dat dan en noteer de vraag. Doorverwijzen naar de directie of naar de DPO van de scholengroep is een normaal antwoord, geen gezichtsverlies.',
    ],
  },
  {
    id: 'afronding',
    soort: 'afronding',
    minuten: 10,
    titel: 'Eén ding voor volgende week',
    wat: 'Elke deelnemer zegt één concreet ding dat hij deze week gaat proberen.',
    tips: [
      'Hardop uitspreken verhoogt de kans dat het ook gebeurt. Hou het kort: één zin per persoon.',
      'Spreek af wanneer jullie erop terugkomen — op de volgende vakwerkgroep of personeelsvergadering.',
    ],
  },
];

// Wat er in het draaiboek komt te staan als iemand een hele module als
// onderdeel kiest. Een module heeft zelf geen begeleiderstips; deze gelden
// voor elke module. De verdiepingszin komt er enkel bij als die module
// verdiepingslessen heeft — $N wordt dan vervangen door het aantal.
export const MODULE_ONDERDEEL = {
  lesseninleiding: 'Je neemt deze lessen door:',
  tips: [
    'Laat iedereen de les op zijn eigen scherm lezen en doe daarna samen de opdracht. Voorlezen van de beamer haalt het tempo eruit.',
    'De prompts en de opdrachten van deze module staan in de deelnemersbundel. Verwijs ernaar in plaats van ze te dicteren.',
  ],
  verdiepingEen:
    'Deze module heeft één verdiepingsles. Die telt niet mee in de tijd en staat niet in de bundel: noem ze als leeswerk voor achteraf.',
  verdiepingMeer:
    'Deze module heeft $N verdiepingslessen. Die tellen niet mee in de tijd en staan niet in de bundel: noem ze als leeswerk voor achteraf.',
};

// Vijf vertrekpunten, van vijftig minuten tot twee uur. De som van elk
// sjabloon is nagerekend tegen de echte minuten van de blokken en de modules;
// het controlescript in CLAUDE.md rekent ze bij elke wijziging opnieuw na.
// Een sjabloon is een vertrekpunt, geen keurslijf: wie het overneemt, kan
// daarna alles wisselen, korter zetten of weglaten.
export const SJABLONEN = [
  {
    id: 'eerste-kennismaking',
    naam: 'Eerste kennismaking',
    minuten: 50,
    voorwie:
      'Een personeelsvergadering of vakwerkgroep waar nog bijna niemand ooit met een AI-assistent werkte.',
    waarschuwing:
      'Zorg dat de accounts vooraf werken. Ze ter plaatse aanmaken kost je de helft van deze vijftig minuten.',
    d: 'onthaal*5,a1.wat-is-ai,a1.eerste-gesprek,afronding*5',
  },
  {
    id: 'mag-dit',
    naam: 'Mag dit? Privacy in één uur',
    minuten: 60,
    voorwie:
      'Een team dat de vraag “mag dit eigenlijk wel?” blijft stellen. Werkt in het lager en in het secundair.',
    waarschuwing:
      'Dit uur roept vragen op over jullie eigen school. Spreek vooraf met de directie af wat je kan toezeggen en wat je doorverwijst.',
    d: 'a3.wat-houdt-tegen,a3.privacy,a3.casussen',
  },
  {
    id: 'kader-directie',
    naam: 'Het kader voor het directieteam',
    minuten: 90,
    voorwie:
      'Directie, beleidsmedewerkers en iedereen die in de school mee over de afspraken beslist.',
    waarschuwing:
      'Dit is leesstof, geen workshop. Reken op doornemen en bespreken, niet op oefenen — laptops zijn niet nodig.',
    d: 'm.beleid-kader,m.beleid-school,afronding*5',
  },
  {
    id: 'halve-studiedag',
    naam: 'Halve studiedag: AI leren kennen',
    minuten: 120,
    voorwie: 'Een halve pedagogische studiedag met leerkrachten die nog niets met AI deden.',
    waarschuwing:
      'Dit is workshop A1, ingekort tot twee uur. Wat sneuvelt is het oefenen in duo’s en het bijsturen in drie rondes. Zeg dat erbij, anders denkt de groep dat ze alles gehad heeft.',
    d: 'onthaal*10,a1.wat-is-ai,a1.eerste-gesprek,a1.vier-knoppen,pauze*10,a1.eigen-materiaal,afronding*10',
  },
  {
    id: 'vibe-proeven',
    naam: 'Vibe coden proeven',
    minuten: 90,
    voorwie:
      'Collega’s die al met een AI-assistent werken en willen zien wat zelf iets bouwen inhoudt.',
    waarschuwing:
      'Reken op accounts die vooraf getest zijn. Ter plaatse aanmaken kost je twintig van deze negentig minuten. Publiceren zit er niet in: dat blijft voor een volgende keer.',
    d: 'b1.onthaal,b1.onderwijsprobleem,b1.kies-project,b1.eerste-versie,afronding*5',
  },
];
