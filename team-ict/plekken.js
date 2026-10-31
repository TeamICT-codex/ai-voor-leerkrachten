// De aanklikbare plekken in de raket. Elke id hoort bij een voorwerp in
// raket.js; de volgorde hier is ook de volgorde van "Volgende" in het kaartje.
// De inhoud komt uit het overzicht "Rollen en verantwoordelijkheden Team ICT".
// De interne aandachtspunten voor het beleid staan hier bewust niet in.
// "platform" zijn de plekken die je in het overzicht ziet.

export const HELPDESK = 'https://helpdesk.hetleercollectief.be';
const meld = { href: HELPDESK, tekst: 'Meld het via de helpdesk' };

export const KAMERS = {
  neus: 'In de neus',
  beleid: 'Bij beleid en directie',
  secundair: 'In het secundair',
  lager: 'In het lager',
  kleuter: 'Bij de kleuters',
  motor: 'In de motor',
  platform: 'Op het lanceerplatform',
};

export const PLEKKEN = [
  {
    id: 'kompas', kamer: 'neus', titel: 'Kwaliteit overal',
    tekst: 'Goed en kwaliteitsvol onderwijs, in elke school en elke klas: dat is de lading van deze raket. Het pedagogisch project van het GO!, samen leren samenleven, is ons kompas. ICT is een randvoorwaarde: noodzakelijk, maar nooit het doel op zich.',
    link: { href: '#neus', tekst: 'Lees waarom' },
  },

  {
    id: 'ictcheck', kamer: 'beleid', titel: 'ICTCheck',
    tekst: 'Sinds 1 september 2026 heeft elke school een ICT-beleidsplan nodig. In ICTCheck doorloop je het stap voor stap met je ICT-werkgroep: van beginsituatie en visie tot actieplan. Je leerkrachten werken mee via een bevragingslink, zonder account.',
    link: { href: 'https://ictcheck.hetleercollectief.be', tekst: 'Open ICTCheck' },
  },
  {
    id: 'leerlijn', kamer: 'beleid', titel: 'Leerlijn digitale competenties',
    tekst: 'Wat leerlingen digitaal moeten kunnen, over de graden heen, en wat ons personeel nodig heeft om dat te dragen. Zo weet elke leerkracht wat er vóór en na zijn klas gebeurt. De leerlijn groeit mee met de nieuwe minimumdoelen.',
  },
  {
    id: 'ai', kamer: 'beleid', titel: 'AI in onze scholen',
    tekst: 'Welke AI-toepassingen, met welke licenties en welke afspraken. Liever een doordachte keuze met duidelijke afspraken over privacy en gebruik, dan dat elke leerkracht alleen moet uitzoeken wat mag.',
    link: { href: '../', tekst: 'Naar AI op school' },
  },
  {
    id: 'planlast', kamer: 'beleid', titel: 'Tools tegen planlast',
    tekst: 'Gegevens hergebruiken in plaats van ze telkens opnieuw in te vullen, en actieplannen opvolgen zonder extra papier. Elk uur dat een directie niet aan formulieren besteedt, gaat naar het team en de leerlingen. Dit staat op de lijst.',
  },

  {
    id: 'talent', kamer: 'secundair', titel: 'TALent voor Taal',
    tekst: 'Leerlingen leren de schooltaal van hun vakken, met woordenlijsten per OKAN-fase en per vakdomein. Een AI-stem leest de woorden voor, en jij volgt op via een dashboard. De app ontstond in GO! technisch atheneum Lokeren.',
    link: { href: 'https://talentvoortaal.vercel.app', tekst: 'Open TALent voor Taal' },
  },
  {
    id: 'aiwijs', kamer: 'secundair', titel: 'AI-wijs op school',
    tekst: 'Een gratis cursus voor leerlingen van de 2de en 3de graad: slim leren en werken mét AI, zonder het denken uit handen te geven. Negen hoofdstukken, met voorbeelden uit onze eigen scholen en een handleiding voor jou.',
    link: { href: '../leerlingen/index.html', tekst: 'Open de cursus' },
  },

  {
    id: 'reken', kamer: 'lager', titel: 'Het Rekencollectief',
    tekst: 'Tafels en bewerkingen vlot en automatisch leren. Je leerlingen oefenen met een code van zes cijfers, en jij zet de periodetoetsen klaar. Een project van de werkgroep automatiseren, met begeleiding van de Pedagogische Begeleidingsdienst.',
    link: { href: 'https://rekencollectief.vercel.app', tekst: 'Open het Rekencollectief' },
  },
  {
    id: 'doelen-lager', kamer: 'lager', titel: 'Nieuwe doelen in het 1ste tot 3de leerjaar',
    tekst: 'Sta je in het 1ste tot en met 3de leerjaar? Dan werk je dit schooljaar al met de nieuwe minimumdoelen, voorlopig voor Nederlands, wiskunde en wetenschap en techniek. De hogere leerjaren volgen jaar per jaar.',
  },

  {
    id: 'taalkleuter', kamer: 'kleuter', titel: 'Het Taalappke',
    tekst: 'Onze eigen taalapp voor de kleuterklas, in ontwikkeling samen met de scholen. Taal is de basis van al het verdere leren: hoe vroeger een kind taalkansen krijgt, hoe beter.',
  },
  {
    id: 'minimumdoelen', kamer: 'kleuter', titel: 'Nieuwe minimumdoelen',
    tekst: 'Dit schooljaar starten de nieuwe minimumdoelen bij de kleuters. We zorgen dat de digitale hulpmiddelen en de leerlijn digitale competenties meegroeien, zodat je er niet alleen voor staat. Vragen over digitale ondersteuning? Spreek Thomas of Stef aan.',
  },

  {
    id: 'net', kamer: 'motor', titel: 'Netwerk en telefonie',
    tekst: 'Wifi, bekabeling en internet op elke campus, en de telefonie van de scholengroep. Dit is de basis waar alles van afhangt: zonder netwerk geen oefenapp, geen cursus en geen gedeelde documenten.',
    link: meld,
  },
  {
    id: 'id', kamer: 'motor', titel: 'Eén account voor alles',
    tekst: 'Je account staat centraal in Microsoft Entra ID, en de andere diensten herkennen je daarmee. Minder wachtwoorden en een veiligere omgeving: wie vertrekt, verliest overal tegelijk de toegang. Een proef met één aanmelding voor alles loopt.',
    link: meld,
  },
  {
    id: 'tst', kamer: 'motor', titel: 'Toestellen en printers',
    tekst: 'Chromebooks, laptops, digiborden en printers: aankoop, uitrol, herstel en vervanging. Een vaste vervangcyclus houdt de kosten voorspelbaar: zes jaar voor Chromebooks, vier jaar voor personeelslaptops.',
    link: meld,
  },
  {
    id: 'plat', kamer: 'motor', titel: 'Platformen',
    tekst: 'Google Workspace als leeromgeving in de meeste scholen, Microsoft 365 voor personeel, Smartschool voor communicatie en Het leercollectief Portaal. Alles centraal en gelijk ingericht, zodat een klein team veel scholen goed kan ondersteunen.',
    link: meld,
  },
  {
    id: 'veilig', kamer: 'motor', titel: 'Veiligheid en privacy',
    tekst: 'Beveiliging, back-ups en de correcte verwerking van persoonsgegevens. Scholen bewaren veel gevoelige gegevens over kinderen, ouders en personeel. Vermoed je een beveiligingsincident of kreeg je een verdachte mail? Meld het meteen.',
    link: meld,
  },
  {
    id: 'srv', kamer: 'motor', titel: 'Servers en eigen toepassingen',
    tekst: 'De centrale servers waarop onze eigen toepassingen draaien, zoals ICTCheck en het Rekencollectief. Een nieuwe datacenterserver wordt één centrale basis voor de hele scholengroep, in plaats van losse serverruimtes per school.',
    link: meld,
  },

  {
    id: 'helpdesk', kamer: 'platform', titel: 'Eén ingang: de helpdesk',
    tekst: 'Elke vraag of storing meld je via de helpdesk. Zo komt alles op één plek binnen en blijft het zichtbaar voor het hele team. Het ticket gaat naar wie het domein trekt, en waar het kan, lossen we het op afstand op.',
    link: { href: HELPDESK, tekst: 'Naar de helpdesk' },
  },
  {
    id: 'vorming', kamer: 'platform', titel: 'De toren: vorming en ondersteuning',
    tekst: 'Een tool zonder begeleiding blijft in de kast liggen. Daarom staat er een toren naast de raket: workshops en webinars, materiaal in je eigen tempo en begeleiding in je klas. Zo kan elke leerkracht een verdieping hoger.',
    link: { href: '../', tekst: 'Naar AI op school' },
  },
  {
    id: 'vluchtleiding', kamer: 'platform', titel: 'Team ICT in de vluchtleiding',
    tekst: 'Dries, Gino, Stef en Thomas volgen de raket op voor 27 scholen. Elk domein heeft een trekker die het overzicht bewaakt, maar het werk is van het hele team. Wie er niet is, wordt opgevangen door een collega.',
    link: { href: '#wie', tekst: 'Wie doet wat?' },
  },
  {
    id: 'grondploeg', kamer: 'platform', titel: 'De grondploeg op de scholen',
    tekst: 'Op de scholen werken collega\'s mee aan ICT: lokale ICT-mensen, soms maar een dag of een paar dagen per week. Zij kennen hun school en zien een probleem vaak als eerste. Samen met hen houden we de raket op koers.',
    link: { href: '#wie', tekst: 'Wie doet wat?' },
  },
];

// De go/no-go-ronde: de vluchtleiding vraagt elk station of het klaar is. De
// volgorde is het pad van de camera, van laag naar hoog: het platform, de motor,
// de verdiepingen en de lading. kamer: waar de camera kijkt; plek: wat er oplicht.
// De zes stations in de motor kunnen een storing krijgen; hun uitval-zin komt
// uit het overzicht van Team ICT. kort: de naam in de lijst van het paneel,
// code: zoals op de kast in de motor. actie: wat je zelf doet, als dat meer is
// dan melden via de helpdesk; naar: waar je melding terechtkomt, als dat meer is
// dan bij wie het domein trekt.
export const STATIONS = [
  { id: 'grondploeg', kort: 'Grondploeg', kamer: 'platform', plek: 'grondploeg', go: 'De lokale ICT-mensen op de scholen zijn mee.' },
  { id: 'helpdesk', kort: 'Helpdesk', kamer: 'platform', plek: 'helpdesk', go: 'Elke vraag komt op één plek binnen.' },
  { id: 'vorming', kort: 'Vorming', kamer: 'platform', plek: 'vorming', go: 'Er zijn workshops, materiaal in je eigen tempo en begeleiding in de klas.' },
  { id: 'net', kort: 'Netwerk', code: 'NET-01', naam: 'Netwerk en telefonie', kamer: 'motor', plek: 'net', go: 'Wifi en internet werken op elke campus.', uitval: 'Zonder netwerk geen online oefenapp, geen cursus en geen gedeelde documenten.' },
  { id: 'id', kort: 'Aanmelding', code: 'ID-02', naam: 'Identiteit en aanmelding', kamer: 'motor', plek: 'id', go: 'Iedereen kan zich aanmelden.', uitval: 'Zonder werkende aanmelding geraak je niet in je apps, ook al werken ze zelf perfect.' },
  { id: 'tst', kort: 'Toestellen', code: 'TST-03', naam: 'Toestellen en printers', kamer: 'motor', plek: 'tst', go: 'De toestellen zijn klaar voor gebruik.', uitval: 'Zonder werkend toestel geen digitale les, hoe goed de app ook is.' },
  { id: 'plat', kort: 'Platformen', code: 'PLT-04', naam: 'Platformen', kamer: 'motor', plek: 'plat', go: 'Classroom, Microsoft 365 en Smartschool zijn bereikbaar.', uitval: 'Zonder platform geen Classroom, geen gedeelde mappen en geen berichten naar ouders.' },
  { id: 'veilig', kort: 'Veiligheid', code: 'SEC-05', naam: 'Veiligheid en privacy', kamer: 'motor', plek: 'veilig', go: 'Er is geen aanval of datalek gemeld.', uitval: 'Een geslaagde aanval kan accounts, bestanden en apps tegelijk platleggen.', actie: 'Kreeg je een verdachte mail of vermoed je een datalek? Klik niets aan en meld het meteen via de helpdesk.', naar: 'wie dit domein trekt, en een mogelijk datalek ook naar de DPO van de scholengroep' },
  { id: 'srv', kort: 'Servers', code: 'SRV-06', naam: 'Servers en eigen toepassingen', kamer: 'motor', plek: 'srv', go: 'Onze eigen toepassingen draaien.', uitval: 'Zonder servers vallen onze eigen toepassingen stil.' },
  { id: 'kleuter', kort: 'Kleuter', kamer: 'kleuter', go: 'De kleuterklas is klaar.' },
  { id: 'lager', kort: 'Lager', kamer: 'lager', go: 'De klassen in het lager zijn klaar.' },
  { id: 'secundair', kort: 'Secundair', kamer: 'secundair', go: 'De klassen in het secundair zijn klaar.' },
  { id: 'beleid', kort: 'Beleid', kamer: 'beleid', go: 'Elke school werkt aan haar ICT-beleidsplan, met ICTCheck.' },
  { id: 'lading', kort: 'Lading', kamer: 'neus', plek: 'kompas', go: 'Kwaliteitsvol onderwijs aan boord.' },
];
