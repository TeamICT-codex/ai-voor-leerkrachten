// Draaiboeken voor de workshops. Elke workshop duurt 180 minuten (3 uur)
// inclusief één pauze van 15 minuten.
//
// De blokken bevatten enkel een duur in minuten; de app rekent de kloktijden
// zelf uit vanaf het gekozen startuur. Zo werkt hetzelfde draaiboek voor een
// sessie van 9u, van 13u30 of van 16u (pedagogische studiedag versus
// namiddag na de lesuren).
//
// soort: instap | uitleg | doen | gesprek | pauze | afronding
//   - uitleg  = begeleider aan het woord, plenair
//   - doen    = deelnemers werken zelf, begeleider loopt rond
//   - gesprek = plenaire uitwisseling of groepsgesprek
//
// 'module' verwijst naar een module-id uit inhoud.js of inhoud-vibe.js,
// zodat de deelnemer vanuit het draaiboek naar de inhoud kan doorklikken.

export const WORKSHOPS = [
  // ─────────────────────────── SPOOR A ───────────────────────────
  {
    id: 'a1',
    code: 'A1',
    spoor: 'ai',
    titel: 'AI leren kennen',
    ondertitel: 'Eerste kennismaking met ChatGPT en Claude, en meteen bruikbaar leren prompten.',
    doelgroep: 'Leerkrachten lager en secundair zonder enige ervaring met AI.',
    voorkennis: 'Geen. Wie een e-mail kan typen, kan mee.',
    groepsgrootte: '8 tot 16 deelnemers. Meer dan 20 wordt moeilijk om rond te lopen.',
    benodigdheden: [
      'Eén laptop per deelnemer (of per duo bij een grote groep).',
      'Werkende accounts vóór aanvang — laat dit vooraf regelen, niet ter plaatse.',
      'Beamer of smartboard voor de demo.',
      'Vraag deelnemers om één eigen lesonderdeel mee te brengen dat ze binnenkort geven.',
    ],
    doelen: [
      'Elke deelnemer heeft zelf een gesprek gevoerd en iets bruikbaars overgehouden.',
      'Elke deelnemer kent de vier knoppen en past ze toe.',
      'Elke deelnemer vertrekt met één concreet ding dat maandag inzetbaar is.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 15,
        titel: 'Onthaal en verwachtingen',
        wat: 'Kort voorstelrondje. Elke deelnemer noemt één taak die te veel tijd opslorpt.',
        tips: [
          'Schrijf die taken zichtbaar op een bord. Je verwijst er de hele sessie naar terug — dat maakt het meteen persoonlijk.',
          'Peil naar de sfeer in de groep: is er scepsis of vooral onzekerheid? Dat bepaalt je toon.',
          'Zeg meteen dat er geen domme vragen zijn en dat niemand iets moet kunnen.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Wat is een AI-assistent?',
        wat: 'Plenaire uitleg met live demo op het grote scherm. Toon ChatGPT én Claude naast elkaar.',
        module: 'kennismaking',
        tips: [
          'Doe de demo live, niet met screenshots. Dat het soms hapert, is net geruststellend.',
          'Neem een taak van het bord uit de instap als demo-onderwerp.',
          'Toon bewust ook één zwak antwoord op een vage vraag — dat zet de rest van de sessie op.',
        ],
      },
      {
        soort: 'doen',
        minuten: 15,
        titel: 'Je eerste gesprek',
        wat: 'Deelnemers openen zelf een gesprek en proberen de startprompt uit.',
        module: 'kennismaking',
        tips: [
          'Loop rond. De eerste vijf minuten gaan meestal over inloggen — plan dat in.',
          'Wie vastloopt op een account: laat meekijken bij een buur, niet wachten.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 25,
        titel: 'De vier knoppen',
        wat: 'Rol, context, vorm en voorbeeld. Toon de zwakke versus sterke prompt op het scherm.',
        module: 'prompten',
        tips: [
          'Laat de groep de zwakke prompt zelf verbeteren voor je de sterke toont.',
          'Draai de sterke prompt live — het verschil zien landt harder dan het horen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Prompten in duo\'s',
        wat: 'Duo\'s schrijven samen een prompt met alle vier de knoppen, voor het lesonderdeel dat ze meebrachten.',
        module: 'prompten',
        tips: [
          'Duo\'s werken beter dan solo: ze verwoorden hardop wat ze willen, en dat is exact de vaardigheid.',
          'Meng ervaren en onervaren deelnemers indien mogelijk.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Werken aan eigen materiaal',
        wat: 'Iedereen werkt aan zijn eigen meegebrachte lesonderdeel.',
        tips: [
          'Dit is het hart van de workshop. Bewaak de tijd van de blokken ervoor zodat dit niet krimpt.',
          'Loop rond en stel telkens dezelfde vraag: "Wat zou je nu bijsturen?"',
          'Zie je iets sterks? Vraag of die persoon het straks mag tonen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Drie rondes bijsturen',
        wat: 'Deelnemers sturen hun resultaat drie keer bij: niveau, lengte, toon.',
        module: 'prompten',
        tips: [
          'Dit is de belangrijkste gewoonte van de dag. Laat niemand na één ronde stoppen.',
          'Laat twee deelnemers hun voor-en-na tonen. Dat overtuigt sterker dan jouw uitleg.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 10,
        titel: 'Kort: wat je er niet in zet',
        wat: 'Snelle waarschuwing rond persoonsgegevens en verzonnen feiten. Vooruitblik naar workshop A3.',
        module: 'veilig-en-ethisch',
        tips: [
          'Hou het kort en concreet: geen leerlingnamen, feiten altijd nachecken.',
          'Ga hier niet in detail — dat is een volledige workshop. Beloof het en ga door.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Eén ding voor maandag',
        wat: 'Rondje: elke deelnemer zegt één concreet ding dat hij volgende week gaat doen.',
        tips: [
          'Hardop uitspreken verhoogt de kans dat het effectief gebeurt.',
          'Noteer de antwoorden — dat is je terugblik bij het begin van A2.',
        ],
      },
    ],
    valkuilen: [
      'Accounts die niet werken. Regel dit vooraf, anders verlies je een half uur.',
      'Te lang plenair praten. Na 20 minuten uitleg haakt een groep leerkrachten af — net zoals hun leerlingen.',
      'Deelnemers die niets meebrachten. Hou een paar generieke lesonderdelen achter de hand.',
      'De scepticus die het gesprek kaapt. Erken de bedenking, parkeer ze zichtbaar, kom erop terug in A3.',
    ],
  },

  {
    id: 'a2',
    code: 'A2',
    spoor: 'ai',
    titel: 'Lesmateriaal maken',
    ondertitel: 'Lesopbouw, differentiatie, toetsen en feedback — met eigen materiaal aan de slag.',
    doelgroep: 'Leerkrachten die workshop A1 volgden of al vlot een gesprek voeren.',
    voorkennis: 'Workshop A1, of zelfstandig de modules "Kennismaken" en "Goede opdrachten geven".',
    groepsgrootte: '8 tot 16 deelnemers.',
    benodigdheden: [
      'Laptop per deelnemer.',
      'Deelnemers brengen mee: één bestaande oefening én één toets die ze zelf maakten.',
      'Beamer of smartboard.',
      'Het leerplan of de eindtermen bij de hand, digitaal of op papier.',
    ],
    doelen: [
      'Elke deelnemer heeft een volledige lesopbouw gemaakt.',
      'Elke deelnemer heeft één oefening in drie niveaus.',
      'Elke deelnemer heeft zijn eigen toets kritisch laten nakijken.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 10,
        titel: 'Terugblik',
        wat: 'Wie heeft er sinds vorige keer iets gebruikt? Wat lukte, wat niet?',
        tips: [
          'Gebruik je notities uit A1: vraag gericht naar wat mensen toen beloofden.',
          'Wat níét lukte is waardevoller dan wat wel lukte — daar leert de hele groep van.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 15,
        titel: 'Van leerplandoel naar lesopbouw',
        wat: 'Demo: leerplandoel erin plakken en een lesopbouw laten maken met tijdsindeling.',
        module: 'lesvoorbereiding',
        tips: [
          'Vraag een leerplandoel uit de zaal en gebruik dat. Live werkt beter dan voorbereid.',
          'Toon expliciet wat er gebeurt als je de klasrealiteit weglaat versus toevoegt.',
        ],
      },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Je eigen lesopbouw',
        wat: 'Deelnemers maken een lesopbouw voor een les die ze binnenkort geven.',
        module: 'lesvoorbereiding',
        tips: [
          'Dring aan op een échte les van volgende week. Fictieve lessen leveren fictieve motivatie op.',
          'Loop rond met één vraag: "Zou je dit zo geven? Wat niet?"',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Differentiëren',
        wat: 'Uitleg plus demo: één oefening naar drie niveaus, met behoud van opmaak.',
        module: 'lesvoorbereiding',
        tips: [
          'Benadruk de zin over gelijke opmaak — die verrast en overtuigt bijna elke groep.',
          'Laat de groep eerst zelf zeggen waarin de niveaus zouden moeten verschillen.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Differentiatie op eigen materiaal',
        wat: 'Deelnemers maken drie niveaus van de oefening die ze meebrachten.',
        module: 'lesvoorbereiding',
        tips: [
          'Hier valt het kwartje bij de meeste deelnemers. Geef het de tijd.',
          'Laat iemand met een geslaagd resultaat het kort tonen.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Toetsvragen en denkniveaus',
        wat: 'Waarom "maak 10 vragen" tien weetvragen oplevert, en hoe je dat stuurt.',
        module: 'toetsen-feedback',
        tips: [
          'Toon eerst de luie prompt en het magere resultaat. Dan pas de gespreide versie.',
          'Vraag altijd het modelantwoord mee in de demo — deelnemers vergeten dit anders.',
        ],
      },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Je eigen toets onder de loep',
        wat: 'Deelnemers laten hun meegebrachte toets nakijken op dubbelzinnige of gokbare vragen.',
        module: 'toetsen-feedback',
        tips: [
          'Dit is vaak het meest verrassende moment van de dag — mensen vinden echte zwaktes in hun eigen toets.',
          'Waarschuw vooraf dat kritiek op je eigen toets confronterend kan zijn. Hou het luchtig.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 10,
        titel: 'Feedback: waar ligt de grens?',
        wat: 'Herformuleren mag je delegeren, beoordelen niet.',
        module: 'toetsen-feedback',
        tips: [
          'Wees hier expliciet en stellig. Dit is een grens die deelnemers moeten meenemen.',
          'Verwijs naar de klassenraad: jij moet het verdedigen, dus jij beslist.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Oogst',
        wat: 'Wat neem je concreet mee? Kort rondje.',
        tips: ['Laat deelnemers hun bestanden opslaan of doorsturen vóór ze vertrekken.'],
      },
    ],
    valkuilen: [
      'Deelnemers zonder eigen materiaal. Stuur een herinnering de dag ervoor.',
      'Te veel willen behandelen. Liever twee onderdelen goed dan vier oppervlakkig.',
      'De doe-blokken laten uitlopen ten koste van het feedbackstuk. Bewaak dat laatste blok — de grens rond beoordelen is niet optioneel.',
    ],
  },

  {
    id: 'a3',
    code: 'A3',
    spoor: 'ai',
    titel: 'Veilig, ethisch en met leerlingen',
    ondertitel: 'Privacy, betrouwbaarheid, schoolbeleid en AI-geletterdheid bij leerlingen.',
    doelgroep: 'Leerkrachten die A1 volgden. Ook geschikt als losse sessie op een pedagogische studiedag.',
    voorkennis: 'Basiservaring met een AI-assistent.',
    groepsgrootte: '8 tot 20 deelnemers. Deze sessie verdraagt een grotere groep.',
    benodigdheden: [
      'Laptop per deelnemer of per duo.',
      'Het AI-beleid van de school of scholengroep, indien dat bestaat.',
      'Uitgeprinte casussen voor het groepswerk.',
      'Bij voorkeur: iemand van het directieteam of de ICT-coördinator die even aansluit.',
    ],
    doelen: [
      'Elke deelnemer kent de vuistregel rond persoonsgegevens en past ze toe.',
      'Elke deelnemer kan een verzonnen feit herkennen en ondervangen.',
      'Elke deelnemer vertrekt met een klasafspraak op papier.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 10,
        titel: 'Wat houdt jullie tegen?',
        wat: 'Rondje: welke twijfel of bezorgdheid leeft er rond AI op school?',
        tips: [
          'Verzamel dit zichtbaar. Deze sessie moet die bezorgdheden effectief beantwoorden.',
          'Er zit bijna altijd iemand met een sterke principiële bedenking. Geef die ruimte — het is een terechte vraag.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 25,
        titel: 'Privacy: de vuistregel',
        wat: 'De prikbordregel, wat nooit mag, en hoe anonimiseren werkt.',
        module: 'veilig-en-ethisch',
        tips: [
          'Hou het praktisch, niet juridisch. Eén vuistregel onthouden ze; een GDPR-college niet.',
          'Toon live hoe je een naam vervangt door [LEERLING] en dat het antwoord even goed is.',
          'Verwijs naar de DPO van de scholengroep als aanspreekpunt bij twijfel.',
        ],
      },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Casussen: mag dit?',
        wat: 'In groepjes van drie: tien situaties beoordelen op mag / mag niet / hangt ervan af.',
        tips: [
          'De "hangt ervan af"-gevallen leveren het beste gesprek op. Zet er bewust enkele in.',
          'Neem casussen op die op jullie scholen echt gebeuren.',
          'Laat elk groepje één casus plenair verdedigen.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Als het overtuigd fout is',
        wat: 'Verzonnen feiten, bronnen en citaten — met een live demo.',
        module: 'veilig-en-ethisch',
        tips: [
          'Probeer vooraf een prompt uit die betrouwbaar een twijfelachtig antwoord geeft. Zoek iets lokaals of erg specifieks.',
          'Lukt de demo niet? Zeg dat eerlijk — "het klopt vaak wél" is een even belangrijke boodschap.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Administratie zonder gegevens',
        wat: 'Deelnemers schrijven een gevoelige oudermail of zetten notities om in een verslag — geanonimiseerd.',
        module: 'administratie',
        tips: [
          'Controleer bij het rondlopen actief of er geen echte namen in de gesprekken staan. Dit is het moment om die gewoonte te betonneren.',
          'De drie-tonen-prompt maakt indruk. Laat iemand de drie versies voorlezen.',
        ],
      },
      {
        soort: 'gesprek',
        minuten: 25,
        titel: 'Leerlingen en AI',
        wat: 'Plenair gesprek: wat doen we als school? Wat spreken we af per vak?',
        module: 'veilig-en-ethisch',
        tips: [
          'Hier is de aanwezigheid van directie of ICT-coördinator goud waard.',
          'Stuur weg van "verbieden of toelaten" naar "wat leren we hen".',
          'Vermeld de leeftijdsgrenzen: in het lager onderwijs werkt de leerkracht klassikaal, niet met leerlingaccounts.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Je eigen klasafspraak',
        wat: 'Elke deelnemer schrijft in twee zinnen wat met AI mag bij één concrete opdracht.',
        module: 'veilig-en-ethisch',
        tips: [
          'Dring aan op één concrete opdracht, geen algemeen schoolreglement.',
          'Laat de zinnen herschrijven op het taalniveau van de leerlingen — dat maakt ze bruikbaar.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 15,
        titel: 'Delen en afspreken',
        wat: 'Klasafspraken plenair delen. Afsluiten met wat de school verder oppakt.',
        tips: [
          'Verzamel de afspraken digitaal en stuur ze rond. Zo ontstaat er vanzelf een gedeelde basis.',
          'Eindig met een concrete vervolgstap: wie neemt wat op, tegen wanneer?',
        ],
      },
    ],
    valkuilen: [
      'Verzanden in juridische discussies. Parkeer die bij de DPO en ga door.',
      'Angst als eindgevoel. Sluit af met wat wél kan, niet met een waarschuwingenlijst.',
      'Het gesprek over leerlingen laten uitlopen. Het is boeiend, maar de klasafspraak is de opbrengst.',
    ],
  },

  // ─────────────────────────── SPOOR B ───────────────────────────
  {
    id: 'b1',
    code: 'B1',
    spoor: 'vibe',
    titel: 'Vibe coden — basis',
    ondertitel: 'Van een onderwijsprobleem naar een werkende webapp die online staat.',
    doelgroep: 'Leerkrachten die vlot een AI-gesprek voeren en zelf digitaal lesmateriaal willen bouwen.',
    voorkennis: 'Spoor A of gelijkwaardige ervaring. Programmeerkennis is niet nodig.',
    groepsgrootte: '6 tot 12 deelnemers. Kleiner dan spoor A: er gaat meer mis en dat kost begeleiding.',
    benodigdheden: [
      'Laptop per deelnemer — geen tablet, je moet bestanden kunnen bewaren.',
      'Werkende Claude-accounts, vooraf geregeld en getest.',
      'Vraag deelnemers vooraf: welk moment in je lessen loopt structureel stroef?',
      'Beamer, en bij voorkeur een tweede begeleider om rond te lopen.',
    ],
    doelen: [
      'Elke deelnemer heeft een werkende webapp rond een eigen onderwijsprobleem.',
      'Elke deelnemer heeft die app online staan met een deelbare link.',
      'Elke deelnemer kan zelfstandig een probleem beschrijven en laten oplossen.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 15,
        titel: 'Wat is vibe coden?',
        wat: 'Uitleg plus voorbeelden van bestaande lesapps. Toon dat het echt kan zonder code te kennen.',
        module: 'vibe-start',
        tips: [
          'Begin met een gebouwd voorbeeld dat je live gebruikt. Zien werkt beter dan uitleggen.',
          'Zeg meteen dat er dingen zullen stukgaan en dat dat bij het werk hoort. Dat voorkomt paniek later.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Begin bij het onderwijsprobleem',
        wat: 'De rode draad: eerst het probleem, dan pas de tool.',
        module: 'vibe-start',
        tips: [
          'Dit is de belangrijkste les van de dag. Wie hier vertrekt van "iets bouwen met AI", bouwt iets nutteloos.',
          'Verzamel de meegebrachte problemen op het bord en kies er samen één als demo.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Kies je project',
        wat: 'Deelnemers laten drie bouwideeën genereren bij hun probleem en kiezen er één.',
        module: 'vibe-start',
        tips: [
          'Stuur consequent naar het kleinste idee. Ambitie is hier de vijand van een geslaagde sessie.',
          'Keur elk gekozen project even goed voor je verder laat gaan. Eén te groot project kost die persoon de hele namiddag.',
        ],
      },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'De eerste versie bouwen',
        wat: 'Met de bouwprompt: één HTML-bestand, werkende eerste versie.',
        module: 'vibe-bouwen',
        tips: [
          'Laat iedereen exact dezelfde bouwprompt gebruiken en enkel het bovenste blok aanpassen. Uniformiteit maakt begeleiden haalbaar.',
          'Dit is het magische moment van de dag — iedereen ziet iets werken dat hij zelf bedacht. Geef er ruimte aan.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Testen en bijsturen',
        wat: 'Systematisch testen, fouten precies beschrijven, laten oplossen.',
        module: 'vibe-bouwen',
        tips: [
          'Leer ze het foutrapport: wat deed ik, wat gebeurde er, wat had er moeten gebeuren.',
          'Laat duo\'s elkaars app testen. Je eigen app kapotklikken lukt niemand.',
          'Herinner aan het bewaren van een werkende versie vóór een grote wijziging.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Stijl en bruikbaarheid',
        wat: 'Opfrissen voor klasgebruik: leesbaar op smartboard, werkt op gsm, toegankelijk.',
        module: 'vibe-bouwen',
        tips: [
          'Wijs op de zin "verander niets aan hoe het werkt" — zonder die zin verliezen deelnemers hun geteste versie.',
          'Toegankelijkheid is hier een korte, concrete boodschap: niet enkel op kleur steunen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Online zetten',
        wat: 'Publiceren via een gratis dienst, link testen op de gsm, QR-code maken.',
        module: 'vibe-delen',
        tips: [
          'Kies vooraf één dienst en laat iedereen die gebruiken. Keuzevrijheid kost je hier twintig minuten.',
          'Waarschuw expliciet: online betekent publiek. Geen antwoordsleutels, geen leerlingnamen.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Showcase',
        wat: 'Iedereen toont zijn app in dertig seconden. Links verzamelen en delen.',
        tips: [
          'Dertig seconden per persoon, strikt. Anders loopt dit uit en mist de helft het.',
          'Verzamel alle links in één document en stuur het rond — dat is meteen een gedeelde toolbox.',
        ],
      },
    ],
    valkuilen: [
      'Te grote projecten. Grijp in bij de projectkeuze, niet halverwege het bouwen.',
      'Deelnemers die de code willen begrijpen. Leg uit dat dat niet nodig is en stuur terug naar testen.',
      'Schoolnetwerken die diensten blokkeren. Test dit vooraf op locatie.',
      'Eén iemand die volledig vastloopt en al je aandacht opslorpt. Daarom een tweede begeleider.',
    ],
  },

  {
    id: 'b2',
    code: 'B2',
    spoor: 'vibe',
    titel: 'Vibe coden — verdieping',
    ondertitel: 'Gegevens bijhouden, leerlingdata correct aanpakken, versiebeheer en automatisch publiceren.',
    doelgroep: 'Deelnemers van B1 die iets willen bouwen dat meer moet kunnen.',
    voorkennis: 'Workshop B1, met een afgewerkte app die online staat.',
    groepsgrootte: '6 tot 12 deelnemers.',
    benodigdheden: [
      'Laptop per deelnemer, met de app uit B1 bij de hand.',
      'Claude-account plus een GitHub-account (laat dat vooraf aanmaken).',
      'Bij voorkeur: de DPO of ICT-coördinator die aansluit bij het privacyblok.',
    ],
    doelen: [
      'Elke deelnemer kan beslissen of zijn app opslag nodig heeft.',
      'Elke deelnemer kent de spelregels rond leerlinggegevens en past de anonieme standaard toe.',
      'Elke deelnemer heeft zijn project op GitHub staan met automatische publicatie.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 10,
        titel: 'Showcase sinds vorige keer',
        wat: 'Wie heeft zijn app in de klas gebruikt? Wat gebeurde er?',
        tips: [
          'Praktijkverhalen uit de klas zijn de beste motivatie voor deze sessie.',
          'Ook mislukkingen tonen: wat werkte niet bij echte leerlingen?',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Heb je opslag echt nodig?',
        wat: 'De drie niveaus: geen opslag, opslag in de browser, echte database.',
        module: 'vibe-data',
        tips: [
          'Stuur hard naar het middelste niveau. Voor negen op de tien klastools volstaat dat.',
          'Laat deelnemers hardop zeggen wat hun app moet onthouden. Vaak blijkt: niets.',
        ],
      },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Voortgang in de browser',
        wat: 'Deelnemers laten hun app de voortgang lokaal bewaren.',
        module: 'vibe-data',
        tips: [
          'Laat ze testen door het tabblad te sluiten en opnieuw te openen.',
          'Wijs erop dat dit per toestel is: op de computer van de klas ziet de volgende leerling de vorige score.',
        ],
      },
      {
        soort: 'gesprek',
        minuten: 25,
        titel: 'Leerlinggegevens: de spelregels',
        wat: 'GDPR in de praktijk, de rol van de DPO, en de anonieme standaard.',
        module: 'vibe-data',
        tips: [
          'Als de DPO aansluit: laat die vooral vertellen wat wél kan en hoe je iets aanmeldt.',
          'De kern in één zin: bouw anoniem, tenzij het echt niet anders kan.',
          'Wees stellig over wat niet in een zelfbouwtool hoort: punten die meetellen, zorggegevens, CLB-verslagen.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Versiebeheer met GitHub',
        wat: 'Begeleid: project op GitHub zetten, wijzigingen bijhouden, terugkeren naar een vorige versie.',
        module: 'vibe-data',
        tips: [
          'Dit is het technisch lastigste blok van het hele traject. Doe het stap voor stap, samen, in hetzelfde tempo.',
          'Laat niemand vooruitlopen — wie vastloopt in stap 3 terwijl jij bij stap 7 bent, is de rest van de sessie kwijt.',
          'Laat ze expliciet één keer terugkeren naar een vorige versie. Dát is waarom ze het doen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Automatisch publiceren',
        wat: 'GitHub koppelen aan een hostingdienst zodat elke wijziging vanzelf online komt.',
        module: 'vibe-delen',
        tips: [
          'Laat ze na de koppeling één kleine tekstwijziging doen en online zien verschijnen. Dat maakt het concreet.',
          'Reken op wachttijd bij het eerste publiceren. Vul die met vragen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 15,
        titel: 'Klaar voor de klas',
        wat: 'Checklist: testen op schooltoestellen, plan B, QR-code, korte handleiding voor collega\'s.',
        module: 'vibe-delen',
        tips: [
          'Laat ze de app openen op hun eigen gsm, op het schoolnetwerk. Daar sneuvelt het vaakst.',
          'Moedig aan om het op KlasCement of in de vakwerkgroep te delen.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Afronding',
        wat: 'Wat is er af, wat is de volgende stap?',
        tips: ['Peil naar interesse in B3 — dat spoor is niet voor iedereen nodig.'],
      },
    ],
    valkuilen: [
      'GitHub is de grote struikelsteen. Plan er ruim tijd voor en werk in hetzelfde tempo.',
      'Deelnemers die per se een database willen. Vraag drie keer wat hun app echt moet onthouden.',
      'Het privacyblok laten verwateren. Dit is precies de sessie waar die grens getrokken moet worden.',
    ],
  },

  {
    id: 'b3',
    code: 'B3',
    spoor: 'vibe',
    titel: 'Vibe coden — AI in je eigen tool',
    ondertitel: 'Je app zelf laten uitleggen of beoordelen, veilig en zonder verrassende rekening.',
    doelgroep: 'Deelnemers van B2 met een concreet idee voor een AI-functie.',
    voorkennis: 'Workshops B1 en B2. Een werkend project dat op GitHub staat.',
    groepsgrootte: '6 tot 10 deelnemers. Dit is de meest technische sessie.',
    benodigdheden: [
      'Laptop per deelnemer, met een werkend project uit B2.',
      'Een account bij een AI-dienst met betaalmogelijkheid — bespreek vooraf wie dat betaalt.',
      'Duidelijkheid van de school over wie de kosten draagt. Regel dit vóór de sessie.',
      'Twee begeleiders is hier bijna een voorwaarde.',
    ],
    doelen: [
      'Elke deelnemer kan beoordelen of een AI-functie zinvol is.',
      'Elke deelnemer heeft een werkende AI-functie met de sleutel veilig weggezet.',
      'Elke deelnemer heeft een uitgavenlimiet ingesteld.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 10,
        titel: 'Wat wil je bouwen?',
        wat: 'Elke deelnemer schetst in één zin de AI-functie die hij voor ogen heeft.',
        tips: ['Noteer ze. Je gebruikt deze lijst in het volgende blok om te toetsen wat zinvol is.'],
      },
      {
        soort: 'uitleg',
        minuten: 25,
        titel: 'Wanneer is het de moeite?',
        wat: 'De vuistregel: voorspelbaar antwoord = gewone code. Alleen open invoer verdient AI.',
        module: 'vibe-ai',
        tips: [
          'Loop de lijst uit het instapblok af en beoordeel ze samen. Een aantal ideeën sneuvelt hier terecht.',
          'Wees eerlijk: een AI-functie maakt een app trager, duurder en onvoorspelbaarder.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Ontwerp je functie op papier',
        wat: 'Wat gaat erin, wat komt eruit, en wat gebeurt er als het antwoord fout is?',
        module: 'vibe-ai',
        tips: [
          'Op papier, niet op het scherm. Wie meteen begint te bouwen, bouwt het verkeerde.',
          'De vraag "wat als het fout is" is didactisch de belangrijkste. Laat niemand die overslaan.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 25,
        titel: 'Modellen, kosten en limieten',
        wat: 'Betalen per gebruik, een klein model kiezen, en waarom je vooraf een plafond zet.',
        module: 'vibe-ai',
        tips: [
          'Reken het samen uit met echte aantallen: 120 leerlingen die twintig keer klikken. Dat maakt het tastbaar.',
          'Benadruk dat een klein model voor "leg dit in twee zinnen uit" ruim volstaat.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Sleutels: de duurste fout',
        wat: 'Waarom een sleutel nooit in de webpagina hoort, en wat je in de plaats doet.',
        module: 'vibe-ai',
        tips: [
          'Toon live hoe je in een browser de inhoud van een pagina bekijkt. Dat het zó zichtbaar is, schrikt terecht.',
          'Laat het veiligheidsblok uit de prompt letterlijk overnemen. Dit is geen moment voor eigen formuleringen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 40,
        titel: 'Bouwen met een serverfunctie',
        wat: 'Begeleid de AI-functie inbouwen, met de sleutel als omgevingsvariabele.',
        module: 'vibe-ai',
        tips: [
          'Het langste en lastigste blok. Werk in hetzelfde tempo en laat niemand achter.',
          'Verwacht problemen bij het instellen van de omgevingsvariabelen. Dat is normaal — plan de tijd.',
          'Loop expliciet langs bij iedereen om te checken dat de sleutel nergens in de pagina staat.',
        ],
      },
      {
        soort: 'doen',
        minuten: 15,
        titel: 'Veiligheidscheck',
        wat: 'Sleutel nergens zichtbaar, uitgavenlimiet ingesteld, antwoordlengte beperkt.',
        module: 'vibe-ai',
        tips: [
          'Doe dit als afvinklijst, deelnemer per deelnemer. Niemand vertrekt zonder limiet.',
          'Laat ze de pagina-inhoud zelf bekijken en bevestigen dat de sleutel er niet in staat.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Afronding en afspraken',
        wat: 'Wie betaalt wat, wanneer testen met leerlingen, en wie volgt de kosten op?',
        tips: [
          'Maak de kostenafspraak concreet vóór iedereen vertrekt. Dit is de grootste bron van gedoe achteraf.',
          'Spreek af dat ze na de eerste klastest de uitgaven bekijken en terugkoppelen.',
        ],
      },
    ],
    valkuilen: [
      'Onduidelijkheid over wie de kosten draagt. Regel dit vóór de sessie, niet erna.',
      'Sleutels die toch in de pagina belanden. Check dit deelnemer per deelnemer, niet plenair.',
      'Technische problemen die één iemand vastzetten. Twee begeleiders, of je verliest de groep.',
      'AI inbouwen waar het niet hoeft. Durf ideeën afraden in het tweede blok.',
    ],
  },
];

export const SPOREN = [
  {
    id: 'ai',
    naam: 'AI in de klas',
    kleur: 'spoor-ai',
    tools: 'ChatGPT of Claude',
    omschrijving:
      'Leren werken met een AI-assistent: van je eerste gesprek tot lesmateriaal, feedback en een veilig kader. Werkt met ChatGPT én Claude — gebruik wat je school aanbiedt.',
  },
  {
    id: 'vibe',
    naam: 'Vibe coden',
    kleur: 'spoor-vibe',
    tools: 'Claude',
    omschrijving:
      'Zelf digitaal lesmateriaal bouwen zonder te kunnen programmeren. Je beschrijft wat je wil, de AI schrijft de code. Dit spoor werkt met Claude.',
  },
];
