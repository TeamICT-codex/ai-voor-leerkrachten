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
      'Vraag deelnemers om één eigen lesonderdeel mee te brengen dat ze binnenkort geven — liefst digitaal, zodat ze er een stuk van kunnen plakken.',
    ],
    doelen: [
      'Je hebt zelf een gesprek gevoerd en er iets bruikbaars aan overgehouden.',
      'Je kent de vier knoppen en past ze toe.',
      'Je vertrekt met één concreet ding dat maandag inzetbaar is.',
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
        minuten: 20,
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
        minuten: 20,
        titel: 'De vier knoppen',
        wat: 'Rol, context, vorm en voorbeeld. Toon de zwakke versus sterke prompt op het scherm.',
        module: 'prompten',
        tips: [
          'Laat de groep de zwakke prompt zelf verbeteren voor je de sterke toont.',
          'Draai de sterke prompt live — het verschil zien landt harder dan het horen.',
          'Twintig minuten is de bovengrens — daarna haakt de groep af. Hou het tempo erin: de vier knoppen kort na elkaar, en steek je tijd in het voorbeeld. Dat is de sterkste knop.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Prompten in duo\'s',
        wat: 'Duo\'s schrijven samen een prompt met alle vier de knoppen, voor het lesonderdeel dat ze meebrachten.',
        module: 'prompten',
        tips: [
          'Dit blok start vlak na de pauze. Zet de vier knoppen eerst opnieuw op het bord — één minuut volstaat — voor je de duo\'s laat vertrekken.',
          'Duo\'s werken beter dan solo: ze verwoorden hardop wat ze willen, en dat is exact de vaardigheid.',
          'Meng ervaren en onervaren deelnemers indien mogelijk.',
        ],
      },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'Werken aan eigen materiaal',
        wat: 'Iedereen werkt nu alleen verder op zijn eigen meegebrachte lesonderdeel: de prompt uit het duo-blok toepassen, het resultaat beoordelen en aanvullen tot er materiaal staat dat maandag bruikbaar is. Eindpunt: elke deelnemer heeft één bewaard document.',
        module: 'prompten',
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
        wat: 'Snelle waarschuwing rond persoonsgegevens en verzonnen feiten. De laatste drie minuten typt iedereen zelf de vraag die hij maandag over één leerling zou stellen, met [LEERLING] in plaats van de naam — anonimiseren doe je vóór je verstuurt. Vooruitblik naar workshop A3.',
        module: 'veilig-en-ethisch',
        tips: [
          'Hou het kort en concreet: geen leerlingnamen, feiten altijd nachecken.',
          'Laat het niet bij horen. Wie de vervanging één keer zelf getypt heeft, doet het maandag ook — wie het enkel gehoord heeft, niet.',
          'Laat ze een vraag typen die ze nog niet verstuurden. Vervangen achteraf helpt niet: wat verstuurd is, is verstuurd. Zeg dat rustig, zonder er een incident van te maken.',
          'Ga hier niet in detail — dat is een volledige workshop. Beloof het en ga door.',
        ],
      },
      {
        soort: 'afronding',
        minuten: 10,
        titel: 'Eén ding voor maandag',
        wat: 'Rondje: elke deelnemer zegt één concreet ding dat hij volgende week gaat doen.',
        tips: [
          'Geef eerst twee minuten om te bewaren: het resultaat in een document plakken, naar zichzelf mailen, of het gesprek een naam geven zodat ze het terugvinden. Wie niets bewaart, staat maandag met lege handen — en dan blijft het bij een goed voornemen.',
          'Hardop uitspreken verhoogt de kans dat het effectief gebeurt.',
          'Noteer de antwoorden — dat is je terugblik bij het begin van A2.',
        ],
      },
    ],
    valkuilen: [
      'Accounts die niet werken. Regel dit vooraf, anders verlies je een half uur.',
      'Te lang aan één stuk plenair praten. Ook binnen een blok van twintig minuten uitleg las je na een kwartier iets in waar de zaal zelf iets doet: een zwakke prompt laten verbeteren, twee minuten overleg met de buur. Anders haakt een groep leerkrachten af — net zoals hun leerlingen.',
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
    voorkennis: 'Workshop A1, of zelfstandig de modules "Kennismaken met AI-assistenten" en "Goede opdrachten geven".',
    groepsgrootte: '8 tot 16 deelnemers.',
    benodigdheden: [
      'Laptop per deelnemer.',
      'Deelnemers brengen mee: één bestaande oefening én één toets die ze zelf maakten — digitaal, zodat ze de tekst kunnen kopiëren en plakken (het Word-bestand, het document uit hun Drive, of wat in Smartschool staat). Enkel op papier werkt niet: dan gaat het halve tweede uur naar overtypen.',
      'Beamer of smartboard.',
      'Het leerplan of de eindtermen bij de hand, digitaal of op papier.',
    ],
    doelen: [
      'Je hebt een volledige lesopbouw gemaakt.',
      'Je hebt één oefening in drie niveaus.',
      'Je hebt je eigen toets kritisch laten nakijken en er een verbetersleutel bij gemaakt.',
      'Je hebt ruwe notities omgezet in feedback die een leerling kan lezen.',
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
        minuten: 15,
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
        wat: 'Deelnemers laten hun meegebrachte toets doorlichten op dubbelzinnige of gokbare vragen, laten de twee zwakste herschrijven en maken daar zelf de verbetersleutel en de puntenverdeling bij.',
        module: 'toetsen-feedback',
        tips: [
          'Dit is vaak het meest verrassende moment van de dag — mensen vinden echte zwaktes in hun eigen toets.',
          'Waarschuw vooraf dat kritiek op je eigen toets confronterend kan zijn. Hou het luchtig.',
          'Volg de opdracht "Kraak je eigen toets" uit de module, stap voor stap. Hou de laatste tien minuten vrij voor de verbetersleutel bij de twee herschreven vragen — dat stuk sneuvelt anders altijd, terwijl het net is wat ze thuis nodig hebben bij het verbeteren.',
          'De punten zet de deelnemer zelf, de assistent stelt enkel de sleutel voor. Zo loopt dit blok al vooruit op de grens die je erna trekt.',
        ],
      },
      {
        soort: 'doen',
        minuten: 15,
        titel: 'Feedback: waar ligt de grens?',
        wat: 'Kort kader: herformuleren mag je delegeren, beoordelen niet. Daarna zet iedereen vier ruwe steekwoorden over één taak of toets om in feedback — zonder naam of iets anders waarmee je de leerling herkent.',
        module: 'toetsen-feedback',
        tips: [
          'Hou het kader op vijf minuten en wees er stellig in. Dit is de grens die deelnemers moeten meenemen.',
          'Laat ze schrappen in de feedback die ze terugkrijgen — die schrapbeweging maakt de grens tastbaarder dan je uitleg.',
          'Verwijs naar het overleg waar jij je beoordeling moet verdedigen: de klassenraad in het secundair, het MDO of zorgoverleg in het lager onderwijs. Jij verdedigt ze, dus jij beslist.',
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
      'Deelnemers zonder eigen materiaal, of met een toets die enkel op papier meekomt. Stuur de dag ervoor een herinnering waarin je "digitaal" expliciet vraagt, en hou zelf één oefening en één toets klaar als reserve.',
      'Te veel willen behandelen. Liever twee onderdelen goed dan vier oppervlakkig.',
      'De eerste doe-blokken laten uitlopen ten koste van het feedbackstuk. Bewaak dat laatste blok — de grens rond beoordelen is niet optioneel.',
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
      'Uitgeprinte casussen voor het groepswerk — druk de module af mét begeleidersmodus uit, dan krijgen de groepjes enkel de situatie en een vakje om zelf te kiezen. Jouw eigen exemplaar druk je af in begeleidersmodus: daar staan het oordeel en de toelichting bij.',
      'Kaartjes of post-its en een bord of flip-over voor de instap.',
      'Bij voorkeur: iemand van het directieteam of de ICT-coördinator die even aansluit.',
    ],
    doelen: [
      'Je kent de vuistregel rond persoonsgegevens en past ze toe.',
      'Je kan een verzonnen feit herkennen en ondervangen.',
      'Je vertrekt met een klasafspraak op papier.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 10,
        titel: 'Wat houdt jullie tegen?',
        wat: 'Iedereen schrijft in één zin de grootste twijfel op een kaartje en geeft het af. Jij hangt ze op het bord en groepeert ze hardop terwijl je ze voorleest.',
        tips: [
          'Dat bord is je parkeerlijst voor de rest van de sessie: verwijs er expliciet naar bij elk blok dat een bezorgdheid beantwoordt, en loop het af bij de afronding.',
          'Licht er plenair drie uit, waaronder zeker de scherpste. Er zit bijna altijd iemand met een sterke principiële bedenking — geef die ruimte, het is een terechte vraag. Een rondje langs twintig mensen krijg je niet in tien minuten, en afgeraffeld is erger dan niet gevraagd.',
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
        wat: 'In groepjes van drie: elk groepje krijgt vier à vijf casussen uit de module en beoordeelt ze op mag / mag niet / hangt ervan af. Verdeel zo dat elke casus bij minstens één groepje ligt.',
        module: 'casussen',
        tips: [
          'Verdeel de veertien casussen — niemand haalt ze alle veertien in 25 minuten. Geef elk groepje minstens één "hangt ervan af"-geval: er zijn er zes, naast zes keer "mag niet" en twee keer "mag", en daar ontstaat het gesprek.',
          'Reken vijftien minuten groepswerk en tien minuten plenair: elk groepje verdedigt één casus, niet meer. Zeg erbij dat de overige casussen in de module blijven staan om later zelf na te lezen.',
          'De casussen staan klaar in de gekoppelde module; print ze vooraf. Vervang bij één groepje een casus door een geval dat op jullie eigen school speelde — dat landt het hardst.',
        ],
      },
      {
        soort: 'doen',
        minuten: 20,
        titel: 'Als het overtuigd fout is',
        wat: 'Korte demo van een verzonnen bron. Daarna zet elke deelnemer de prompt "Onzekerheid laten aangeven" in op een vraag uit het eigen vak, en checkt één gemarkeerd onderdeel buiten het gesprek na.',
        module: 'veilig-en-ethisch',
        tips: [
          'Probeer vooraf een prompt uit die betrouwbaar een twijfelachtig antwoord geeft. Zoek iets lokaals of erg specifieks.',
          'Acht minuten demo, twaalf minuten zelf. De prompt staat klaar in de gekoppelde module en zit ook in de deelnemersbundel, dus niemand hoeft hem over te typen.',
          'Lukt de demo niet, of blijkt bij iedereen alles te kloppen? Zeg dat eerlijk — "het klopt vaak wél" is een even belangrijke boodschap. De oefening werkt ook dan: de reflex is geoefend, en dat is doel 2.',
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
      'Ook een account bij de dienst waarop jullie publiceren (Netlify of Vercel) — het blok "Online zetten" strandt anders op twaalf keer registreren en een bevestigingsmail afwachten.',
      'Vraag deelnemers vooraf: welk moment in je lessen loopt structureel stroef?',
      'Beamer, en bij voorkeur een tweede begeleider om rond te lopen.',
    ],
    doelen: [
      'Je hebt een werkende webapp rond een eigen onderwijsprobleem.',
      'Je hebt die app online staan met een deelbare link.',
      'Je kan zelfstandig een probleem beschrijven en laten oplossen.',
    ],
    draaiboek: [
      {
        soort: 'instap',
        minuten: 15,
        titel: 'Onthaal en wat is vibe coden?',
        wat: 'Kort rondje: elke deelnemer noemt in één zin het lesmoment dat stroef loopt — de vraag die je vooraf stelde. Daarna uitleg met een gebouwd voorbeeld dat je live gebruikt.',
        module: 'vibe-start',
        tips: [
          'Kort rondje eerst: reken een drietal minuten bij twaalf deelnemers, één zin per persoon. Schrijf die stroeve momenten zichtbaar op het bord — je hebt ze in het volgende blok nodig om samen een demo te kiezen, en opnieuw bij de projectkeuze.',
          'Doe daarna meteen dat gebouwde voorbeeld. Zien werkt beter dan uitleggen.',
          'Laat de laptops meteen open gaan: terwijl jij het voorbeeld toont, logt iedereen in en stelt één testvraag. Wie er niet in raakt, help je nu — niet wanneer de rest begint te bouwen.',
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
          'Kies samen één probleem van het bord als demo — de lijst staat er al sinds de instap.',
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
          'Keur elk gekozen project goed voor je verder laat gaan. Eén te groot project kost die persoon de hele namiddag.',
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
        minuten: 15,
        titel: 'Stijl en bruikbaarheid',
        wat: 'Opfrissen voor klasgebruik: leesbaar op smartboard, werkt op gsm, toegankelijk.',
        module: 'vibe-bouwen',
        tips: [
          'Wijs op de zin "verander niets aan hoe het werkt" — zonder die zin verliezen deelnemers hun geteste versie.',
          'Toegankelijkheid zit al in de bouwprompt uit de vorige les. Je boodschap hier is dus kort: hou die eisen erin, ook als je de prompt inkort — zeker de regel dat feedback nooit enkel op kleur steunt.',
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
        minuten: 15,
        titel: 'Showcase',
        wat: 'Iedereen toont zijn app in dertig seconden. Links verzamelen en delen.',
        tips: [
          'Laat iedereen zijn link tijdens het vorige blok al in het gedeelde document zetten, en toon de apps daarna één na één vanaf jouw laptop via dat document. Zo verlies je geen tijd aan kabels wisselen of aan kopiëren en plakken.',
          'Dertig seconden per persoon, strikt. Anders loopt dit uit en mist de helft het.',
          'Verzamel alle links in één document en stuur het rond — dat is meteen een gedeelde toolbox.',
        ],
      },
    ],
    valkuilen: [
      'Te grote projecten. Grijp in bij de projectkeuze, niet halverwege het bouwen.',
      'Deelnemers die de code willen begrijpen. Leg uit dat dat niet nodig is en stuur terug naar testen.',
      'Schoolnetwerken die diensten blokkeren. Test dit vooraf op locatie.',
      'Accounts die pas bij het bouwen blijken te haperen, of iemand die halverwege even moet wachten voor hij verder kan. Check het inloggen al bij het eerste blok, en laat wie stilvalt intussen verder werken op de laptop van een buur.',
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
      'Claude-account en GitHub-account, vooraf aangemaakt en één keer samen getest.',
      'Een account bij de dienst waarmee jullie in B1 online gingen (Netlify of Vercel), zodat je er GitHub aan kan koppelen. Publiceren jullie via GitHub Pages, dan volstaat het GitHub-account.',
      'Bij voorkeur: de DPO of ICT-coördinator die aansluit bij het privacyblok.',
    ],
    doelen: [
      'Je kan beslissen of je app opslag nodig heeft.',
      'Je kent de spelregels rond leerlinggegevens en past de anonieme standaard toe.',
      'Je hebt je project op GitHub staan met automatische publicatie.',
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
        minuten: 20,
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
        minuten: 40,
        titel: 'Versiebeheer met GitHub',
        wat: 'Begeleid: project op GitHub zetten, wijzigingen bijhouden, terugkeren naar een vorige versie.',
        module: 'vibe-data',
        tips: [
          'Dit is het technisch lastigste blok van het hele traject. Doe het stap voor stap, samen, in hetzelfde tempo.',
          'Laat niemand vooruitlopen — wie vastloopt in stap 3 terwijl jij bij stap 7 bent, is de rest van de sessie kwijt.',
          'Zet halverwege een vast ijkpunt: iedereen heeft zijn project online staan vóór je aan het terugkeren naar een vorige versie begint. Wie daar nog niet is, help je eerst — pas dan gaat de groep verder.',
          'Laat ze expliciet één keer terugkeren naar een vorige versie. Dát is waarom ze het doen.',
        ],
      },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'Automatisch publiceren',
        wat: 'GitHub koppelen aan de dienst die je pagina online zet (zoals Netlify of Vercel), zodat elke wijziging vanzelf op je link verschijnt.',
        module: 'vibe-data',
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
      'GitHub is het grote struikelblok. Plan er ruim tijd voor en werk in hetzelfde tempo.',
      'Deelnemers zonder account bij de dienst die de pagina online zet. Dan begint je blok automatisch publiceren met twaalf keer registreren en een bevestigingsmail afwachten. Regel dat vooraf, of kies GitHub Pages en hou het bij één account.',
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
      'Een account bij een AI-dienst met een API-sleutel die al vóór de sessie is aangemaakt, en met tegoed of een betaalmethode erop — zonder dat loopt de allereerste poging vast op een foutmelding.',
      'Laat elke deelnemer die sleutel vooraf één keer uitproberen bij de dienst zelf. Wie zelf geen betaalgegevens wil of mag ingeven, werkt mee op een account van de school — spreek af wie dat aanmaakt en beheert.',
      'Duidelijkheid van de school over wie de kosten draagt. Regel dit vóór de sessie.',
      'Twee begeleiders is hier bijna een voorwaarde.',
    ],
    doelen: [
      'Je kan beoordelen of een AI-functie zinvol is.',
      'Je hebt een werkende AI-functie met de sleutel veilig weggezet.',
      'Je hebt een uitgavenlimiet ingesteld.',
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
        minuten: 15,
        titel: 'Wanneer is het de moeite?',
        wat: 'De vuistregel: voorspelbaar antwoord = gewone code. Alleen open invoer verdient AI.',
        module: 'vibe-ai',
        tips: [
          'Loop de lijst uit het instapblok af en beoordeel ze samen — reken op een goeie minuut per idee, dan raak je er zeker door. Een aantal ideeën sneuvelt hier terecht.',
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
        minuten: 20,
        titel: 'Modellen, kosten en limieten',
        wat: 'Betalen per gebruik, een klein model kiezen, en waarom je vooraf een plafond zet. De laatste vijf minuten zet iedereen de uitgavenlimiet effectief in bij zijn AI-dienst.',
        module: 'vibe-ai',
        tips: [
          'Reken het samen uit met echte aantallen: 120 leerlingen die twintig keer klikken. Dat maakt het tastbaar.',
          'Benadruk dat een klein model voor "leg dit in twee zinnen uit" ruim volstaat.',
          'Niemand verlaat dit blok zonder limiet. Loop het rijtje deelnemer per deelnemer af, zoals bij een aanwezigheidslijst — later op de dag kom je er niet meer aan toe.',
          'Werkt iemand op een gedeelde rekening van de school? Dan kijkt hij na of er al een limiet staat en noteert hij wie hem kan zetten. Die naam haal je in het slotblok terug boven.',
        ],
      },
      {
        soort: 'uitleg',
        minuten: 20,
        titel: 'Sleutels: de duurste fout',
        wat: 'Waarom een sleutel nooit in de webpagina hoort, en wat je in de plaats doet.',
        module: 'vibe-ai',
        tips: [
          'Toon live hoe je in een browser de inhoud van een pagina bekijkt. Dat het zó zichtbaar is, doet terecht schrikken.',
          'Laat het veiligheidsblok uit de prompt letterlijk overnemen. Dit is geen moment voor eigen formuleringen.',
          'Laat ze dat veiligheidsblok nog vóór de pauze overschrijven, dan starten ze er meteen mee na de koffie.',
        ],
      },
      { soort: 'pauze', minuten: 15, titel: 'Pauze', wat: 'Koffie.' },
      {
        soort: 'doen',
        minuten: 30,
        titel: 'De serverfunctie opzetten',
        wat: 'De serverfunctie aanmaken en de sleutel als omgevingsvariabele wegzetten.',
        module: 'vibe-ai',
        tips: [
          'Werk in hetzelfde tempo en spreek af dat niemand verder gaat voor iedereen zijn functie ziet draaien.',
          'Verwacht problemen bij het instellen van de omgevingsvariabelen. Dat is normaal, de tijd is ervoor voorzien.',
        ],
      },
      {
        soort: 'doen',
        minuten: 25,
        titel: 'De AI-functie inbouwen en testen',
        wat: 'De AI aanspreken vanuit je app, het antwoord tonen en de lengte beperken.',
        module: 'vibe-ai',
        tips: [
          'Plenaire tussenstop bij de start: iedereen staat op hetzelfde punt voor jullie verder gaan.',
          'Loop expliciet bij iedereen langs om te checken dat de sleutel nergens in de pagina staat.',
        ],
      },
      {
        soort: 'doen',
        minuten: 15,
        titel: 'Veiligheidscheck',
        wat: 'Sleutel nergens zichtbaar, uitgavenlimiet nog altijd ingesteld, antwoordlengte beperkt.',
        module: 'vibe-ai',
        tips: [
          'Dit is een controle, geen eerste poging — de limiet stond er al vóór de pauze. Wie hem toch nog mist, help je hier eerst; de rest vink je af.',
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
