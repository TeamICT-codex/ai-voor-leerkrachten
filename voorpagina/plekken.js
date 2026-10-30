// De aanklikbare plekken in het tafereel. Elke id hoort bij een voorwerp in
// diorama.js; de volgorde hier is ook de volgorde van "Volgende" in het kaartje.
// Wat er over de inhoud staat, is nagekeken tegen js/cursus.js (modules en
// lessen) en leerlingen-bron/ (hoofdstukken, voortgang en certificaat).
// "buiten" zijn de plekken die je in het overzicht ziet.

const APP = 'leeromgeving/#/';
const LL = 'leerlingen/';

export const KAMERS = {
  buiten: 'Rond de school',
  directie: 'Bij de directie',
  klas: 'In de klas',
  leerling: 'Bij de leerlingen',
  lager: 'In het lager',
};

export const PLEKKEN = [
  {
    id: 'lichtje', kamer: 'buiten', titel: 'Je AI-assistent',
    tekst: 'Dit gele lichtje staat voor je AI-assistent: ChatGPT, Claude of een andere. Het vliegt van verdieping naar verdieping en helpt iedereen een handje. Wat het maakt, lees je altijd zelf na. Jij beslist.',
    link: { href: APP + 'module/kennismaking', tekst: 'Wat is een AI-assistent?' },
  },
  {
    id: 'samen', kamer: 'buiten', titel: 'Samen is beter',
    tekst: 'Deze leeromgeving komt van GO! scholengroep Het leercollectief. Ze is gratis, je hebt geen account nodig en je voortgang blijft op je eigen toestel.',
    link: { href: APP, tekst: 'Naar de leeromgeving' },
  },
  {
    id: 'workshops', kamer: 'buiten', titel: 'Samen leren in een workshop',
    tekst: 'Liever samen met collega\'s? Er zijn zes workshops van drie uur, met een pauze. Geef je ze zelf, dan vind je er draaiboeken met timing en tips bij.',
    link: { href: APP, tekst: 'Bekijk de workshops' },
  },

  {
    id: 'beleid', kamer: 'directie', titel: 'Afspraken die mensen ook volgen',
    tekst: 'Een AI-beleid hoeft geen dik document te zijn. In de module voor directies ga je van losse regels naar een afsprakenkader, en lees je hoe je het aan je team geeft.',
    link: { href: APP + 'module/beleid-school', tekst: 'Voor directies en schoolbeleid' },
  },
  {
    id: 'wet', kamer: 'directie', titel: 'De wet in mensentaal',
    tekst: 'Drie wetten die er echt toe doen: de GDPR, de Europese AI-verordening en het auteursrecht. Vertaald naar wat je morgen doet, en naar wat de school moet afspreken.',
    link: { href: APP + 'module/beleid-wet', tekst: 'Lees de wet in mensentaal' },
  },
  {
    id: 'gegevens', kamer: 'directie', titel: 'Gegevens van leerlingen en personeel',
    tekst: 'Leerlingen zijn minderjarig, en ook gegevens van personeel zijn gevoelig. Welke gegevens horen niet in een chatvenster, en welke afspraken maak je met een leverancier?',
    link: { href: APP + 'module/beleid-school', tekst: 'Leerlingdata en personeelsdata' },
  },
  {
    id: 'zelfbouw', kamer: 'directie', titel: 'Zelf een tool bouwen',
    tekst: 'Een planner, een overzicht, een dashboard: steeds meer directies bouwen zelf iets met AI, en dat zegt veel over hun inzet. Komen er echte gegevens van leerlingen of personeel bij, dan zet je de volgende stap samen met je scholengroep. Zo groeit een handige proef uit tot een stevige tool, misschien wel voor meer scholen.',
    link: { href: APP + 'module/beleid-zelfbouw', tekst: 'Zelf bouwen met schoolgegevens' },
  },
  {
    id: 'wie', kamer: 'directie', titel: 'Wie beslist wat?',
    tekst: 'Het schoolbestuur, de directie, het aanspreekpunt informatieveiligheid en de DPO van de scholengroep hebben elk een eigen rol. De DPO geeft advies, maar beslist niet in jullie plaats.',
    link: { href: APP + 'module/beleid-kader', tekst: 'Het kader in het kort' },
  },
  {
    id: 'sessie', kamer: 'directie', titel: 'Een sessie voor je team',
    tekst: 'Geen drie uur vrij? Stel zelf een sessie samen uit losse onderdelen, of kies een van de vijf kant-en-klare sessies van 50 tot 120 minuten.',
    link: { href: APP + 'sessie', tekst: 'Stel een sessie samen' },
  },

  {
    id: 'eerste', kamer: 'klas', titel: 'Je eerste gesprek',
    tekst: 'Nog nooit met AI gewerkt? Hier lees je wat ChatGPT en Claude zijn en wat ze kunnen, en voer je stap voor stap je eerste gesprek.',
    link: { href: APP + 'module/kennismaking', tekst: 'Begin bij de eerste les' },
  },
  {
    id: 'prompt', kamer: 'klas', titel: 'Een goede opdracht geven',
    tekst: 'Met vier knoppen krijg je bruikbaar lesmateriaal in plaats van algemene praat. Is het antwoord net niet goed, dan stuur je bij in plaats van opnieuw te beginnen.',
    link: { href: APP + 'module/prompten', tekst: 'De vier knoppen' },
  },
  {
    id: 'les', kamer: 'klas', titel: 'Van leerplandoel naar les',
    tekst: 'Laat een lesopbouw maken vanuit je leerplandoel, en meteen drie niveaus voor wie meer uitdaging of meer steun nodig heeft. In de tijd van een koffiepauze.',
    link: { href: APP + 'module/lesvoorbereiding', tekst: 'Lesvoorbereiding en differentiatie' },
  },
  {
    id: 'feedback', kamer: 'klas', titel: 'Toetsen en feedback',
    tekst: 'Toetsvragen op het juiste niveau, een verbetersleutel en feedback die leerlingen echt lezen. Wat de assistent voorstelt, beoordeel je zelf.',
    link: { href: APP + 'module/toetsen-feedback', tekst: 'Toetsen, oefeningen en feedback' },
  },
  {
    id: 'ouders', kamer: 'klas', titel: 'Mails, verslagen en planningen',
    tekst: 'Oudermails, verslagen en planningen: het werk dat je avonden opeet. Laat je AI-assistent een eerste versie maken, zonder namen van leerlingen erin, en werk die zelf af.',
    link: { href: APP + 'module/administratie', tekst: 'Administratie en communicatie' },
  },
  {
    id: 'veilig', kamer: 'klas', titel: 'Veilig, ook met leerlingen',
    tekst: 'Wat je nooit in een chatvenster zet, wat je doet als een antwoord overtuigend fout is, en hoe je omgaat met leerlingen die zelf AI gebruiken.',
    link: { href: APP + 'module/veilig-en-ethisch', tekst: 'Veilig, ethisch en met leerlingen' },
  },
  {
    id: 'casussen', kamer: 'klas', titel: 'Mag dit?',
    tekst: 'Vijftien situaties uit de praktijk om te beoordelen, alleen of in groep. Mag het, mag het niet, of hangt het ervan af?',
    link: { href: APP + 'module/casussen', tekst: 'Naar de casussen' },
  },
  {
    id: 'bouwen', kamer: 'klas', titel: 'Zelf een kleine app bouwen',
    tekst: 'Een woordenquiz of een timer voor groepswerk: je beschrijft wat je wilt en Claude bouwt het als werkende pagina. Je hoeft er geen regel code voor te kunnen schrijven.',
    link: { href: APP + 'module/vibe-start', tekst: 'Vibe coden: wat en waarom' },
  },

  {
    id: 'studiemaatje', kamer: 'leerling', titel: 'Een studiemaatje, geen spiekbrief',
    tekst: 'In AI-wijs op school leren leerlingen van de 2de en 3de graad AI gebruiken om beter te leren: zich laten overhoren, uitleg op hun niveau vragen, plannen. Het werk zelf laten ze niet over.',
    link: { href: LL + 'h3-leren-met-ai/laat-je-overhoren.html', tekst: 'Bekijk een les' },
  },
  {
    id: 'gip', kamer: 'leerling', titel: 'Taak, paper of GIP',
    tekst: 'Van onderwerp naar onderzoeksvraag, bronnen gebruiken en het mondeling oefenen. En wat je doet als AI voor een taak niet of maar een beetje mag.',
    link: { href: LL + 'h4-taken-en-gip-met-ai/je-taak-of-paper-met-ai.html', tekst: 'Naar het hoofdstuk' },
  },
  {
    id: 'kansen', kamer: 'leerling', titel: 'Kansen én risico\'s',
    tekst: 'Echt of gemaakt? Wie heeft de macht over AI, en wat kost het aan energie en water? Leerlingen leren beide kanten zien, zonder dat iemand hen de les spelt.',
    link: { href: LL + 'h7-kansen-en-risicos/kansen-en-risicos-tegelijk-zien.html', tekst: 'Naar het hoofdstuk' },
  },
  {
    id: 'voortgang', kamer: 'leerling', titel: 'Geen account nodig',
    tekst: 'De cursus onthoudt de voortgang in de browser van de leerling zelf. Wie van toestel wisselt, neemt ze mee met een voortgangscode.',
    link: { href: LL + 'h1-slim-starten-met-ai/jouw-voortgang.html', tekst: 'Zo werkt de voortgang' },
  },
  {
    id: 'certificaat', kamer: 'leerling', titel: 'Een certificaat op het einde',
    tekst: 'Wie hoofdstuk 1 en 2 afrondt en daarnaast minstens één hoofdstuk naar keuze, drukt op het einde zelf een certificaat af.',
    link: { href: LL + 'h9-afronding/eindcheck-en-certificaat.html', tekst: 'Bekijk de eindcheck' },
  },
  {
    id: 'handleiding', kamer: 'leerling', titel: 'Een handleiding voor jou',
    tekst: 'Vier manieren om de cursus in je klas in te zetten, en hoe je afspraken maakt en opvolgt. Je hoeft er zelf geen expert voor te zijn.',
    link: { href: APP + 'module/leerlingencursus', tekst: 'De leerlingencursus in je klas' },
  },

  {
    id: 'leerlichtjes', kamer: 'lager', titel: 'Leerlichtjes',
    tekst: 'Een aanbod voor het lager: per graad een wereld die je samen met je klas op het digibord verkent. Kinderen werken niet zelf met een chatbot, want de meeste chatbots zijn pas vanaf 13 jaar. Ze ontdekken hoe AI werkt, waar het fout gaat en wat eerlijk is.',
    link: { href: 'lager/index.html', tekst: 'Naar Leerlichtjes' },
  },
];
