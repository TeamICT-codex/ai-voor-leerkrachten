// Spoor B — Vibe coden voor leerkrachten.
//
// Inhoudelijk geïnspireerd op vibecodenvoordocenten.vercel.app, hertaald naar
// het Vlaamse onderwijs (leerplandoelen, GDPR-afspraken via de scholengroep,
// Smartschool/KlasCement, terminologie lager & secundair onderwijs).
//
// Rode draad van dat materiaal, die we overnemen:
//   "Begin bij een onderwijsprobleem en bouw daarna pas de tool."
//   "Jij bent de onderwijsexpert; de AI helpt bouwen."

export const MODULES_VIBE = [
  {
    id: 'vibe-start',
    icoon: '🧩',
    titel: 'Vibe coden: wat en waarom',
    ondertitel: 'Zelf digitaal lesmateriaal bouwen zonder één regel code te kunnen schrijven.',
    niveau: 'Basis',
    doelen: [
      'Je kan uitleggen wat vibe coden is en wat het niet is.',
      'Je vertrekt van een onderwijsprobleem in plaats van van een tool.',
      'Je herkent welke ideeën haalbaar zijn voor een eerste bouwsel.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet: je moet bestanden kunnen bewaren.',
      'Een werkend Claude-account.',
      'Eén lesmoment dat structureel stroef loopt. Daar bouw je de rest van dit spoor omheen.',
    ],
    lessen: [
      {
        id: 'klaarzetten',
        titel: 'Wat je klaarzet vóór je begint',
        minuten: 10,
        intro: 'Je zet klaar wat je nodig hebt: een laptop, een Claude-account, één projectmap en één zin over een stroef lesmoment.',
        onthoud: 'Voorziet je school of scholengroep een Claude-account, werk dan daarmee en niet met je privéaccount. Zet alles in één projectmap; andere accounts maak je pas aan wanneer een module erom vraagt.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Dit spoor is doe-werk: je bouwt doorheen alle modules aan één eigen project. Een kwartier voorbereiding scheelt je straks een halve avond. Hieronder staat wat je nu nodig hebt, en wat pas later. Wat een afzonderlijke module daarbovenop vraagt, staat telkens bij die module zelf.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Een laptop, geen tablet.</strong> Je moet bestanden kunnen bewaren en terugvinden, en dat gaat op een tablet moeizaam. Een chromebook van de school kan, zolang je er bestanden op kwijt kan.',
              '<strong>Een werkend account bij Claude.</strong> Voorziet je school of scholengroep een schoolaccount, gebruik dan dat en niet je privéaccount: het bepaalt mee wat er met je gesprekken gebeurt. Probeer het één keer uit op het schoolnetwerk — wat thuis vlot werkt, wordt op school soms geblokkeerd.',
              '<strong>Eén map op je laptop voor dit project.</strong> Daar komt alles in: je bestand, je versies, later je projectblad. Noem ze naar je project.',
              '<strong>Eén zin over wat er in jouw lessen stroef loopt.</strong> Daar vertrekt alles van. Je hoeft nog niets te bedenken over techniek.',
              '<strong>Pas later nodig:</strong> een account bij een gratis dienst om je pagina online te zetten (module <em>Delen met collega\'s en leerlingen</em>), een GitHub-account (module <em>Gegevens, privacy en versiebeheer</em>), en een account bij een AI-dienst met tegoed of een betaalmethode (module <em>AI inbouwen in je eigen tool</em>). Maak die aan wanneer je er bent, niet nu.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Reken op een uur of twee per module',
            inhoud:
              'Je kan dit spoor in stukken doen — één module per week werkt prima. Maar zet de module waarin je bouwt niet in een halfuurtje tussen twee lessen: de eerste versie maken en ze daarna echt testen loopt in één beweging door.',
          },
        ],
      },
      {
        id: 'wat-is-vibe-coden',
        titel: 'Wat is vibe coden?',
        minuten: 15,
        intro: 'Je leert wat vibe coden is, welke kleine dingen je ermee bouwt en waar de grens ligt.',
        onthoud: 'Jij beschrijft en test, Claude schrijft de code. Een goed eerste project is klein: een oefenapp op één leerstofonderdeel die geen leerlinggegevens bijhoudt.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              '<strong>Vibe coden</strong> is: in gewone taal beschrijven wat je wil, en de AI de code laten schrijven. Jij zegt <em>"maak een oefening waarbij leerlingen de gebeurtenissen van de Eerste Wereldoorlog op een tijdlijn slepen"</em>, en je krijgt een werkende webpagina terug. Je leest die code niet, je <em>test</em> hem — werkt het niet zoals je wil, dan zeg je gewoon wat er anders moet.',
          },
          {
            type: 'tekst',
            inhoud:
              'Dat klinkt te mooi, en dus meteen de eerlijke kant: je bouwt hiermee <strong>kleine, afgebakende dingen</strong>. Een oefenapp, een quiz, een keuzehulp, een timer, een visualisatie. Geen leerlingvolgsysteem, geen vervanger voor Smartschool.',
          },
          {
            type: 'kader',
            variant: 'tool',
            titel: 'Waarom dit spoor met Claude werkt',
            inhoud:
              'In spoor A kon je vrij kiezen tussen ChatGPT en Claude. <strong>Hier werken we met Claude</strong>, om een praktische reden: Claude toont wat het bouwt meteen als werkende pagina in het gesprek, zodat je onmiddellijk kan klikken en testen zonder iets te installeren. Dat maakt de cyclus bouwen-testen-bijsturen veel vlotter voor wie niet kan programmeren. Andere assistenten kunnen ook code schrijven, en wat ze daarbij tonen verandert snel — kijk gerust eens wat jouw assistent ondertussen kan. Voor dit spoor houden we het bij één tool: dat scheelt verwarring als je hier nieuw in bent, en in een zaal vol beginners al helemaal. De vaardigheid die je hier leert — <strong>beschrijven, testen, bijsturen</strong> — verhuist gewoon mee.',
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Jij bent de onderwijsexpert',
            inhoud:
              'De AI kan code schrijven, maar weet niet wat werkt bij 24 leerlingen van het tweede jaar op een vrijdagnamiddag. Die kennis heb jij — en die is het schaarse deel. Het bouwen was vroeger de drempel; nu is het didactisch ontwerp weer waar het over gaat.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Goed haalbaar:</strong> oefengenerator, quiz met directe feedback, woordenschattrainer, tijdlijn, rekenhulp, beurtroulette, groepsverdeler, visuele timer.',
              '<strong>Kan, maar later:</strong> iets dat resultaten bijhoudt over meerdere lessen, of dat leerlingen laat inloggen.',
              '<strong>Niet op eigen houtje:</strong> punten die meetellen bijhouden in een zelfgebouwde tool. Daar bestaan schoolsystemen voor, met de nodige afspraken errond; zoiets doe je enkel samen met je scholengroep. Zorggegevens, CLB-verslagen en thuissituaties blijven sowieso in de schoolsystemen. Mis je daar iets, breng die nood dan naar je scholengroep.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Lessen met het etiket Verdieping',
            inhoud:
              'Negen lessen in dit spoor dragen het etiket <strong>Verdieping</strong>. Dat betekent niet moeilijker, wel: niet nodig om je eerste pagina in de klas te krijgen. Ze staan telkens achteraan in hun module, en ze beantwoorden een vraag die pas opkomt als je iets gebouwd hebt — beeld erin krijgen, je project op de telefoon, een testlijst laten maken, een gesprek dat te lang wordt. <strong>De route die we aanraden:</strong> doorloop eerst de basislessen van alle modules tot je pagina online staat en één keer in je klas gebruikt is. Kom daarna terug voor de verdieping, en lees dan enkel wat je herkent. Hou daar rekening mee als je plant: de verdiepingslessen van een module kunnen samen even lang duren als de basislessen ervoor. Wie een sessie van drie uur volgde, mist niets van die sessie door ze over te slaan: ze pasten daar niet in.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Wil je eerst zien hoe het in zijn geheel gaat?',
            inhoud:
              'De module <em>Een volledig voorbeeld</em>, onderaan dit spoor, volgt één project van het eerste idee tot na de eerste les waarin het gebruikt werd: de prompts zoals ze echt ingetypt zijn, de vier dingen die bij het testen boven kwamen, en wat het uiteindelijk kostte. Je hoeft er niets voor gebouwd te hebben. Lees ze gerust nu al als je liever eerst de hele weg ziet; bouw je liever meteen mee, lees ze dan nadat je je eerste pagina getest hebt.',
          },
          {
            type: 'quiz',
            vraag: 'Wat is het beste eerste project voor een leerkracht die nog nooit iets bouwde?',
            opties: [
              {
                tekst: 'Een oefenapp op één leerstofonderdeel, zonder opslag van gegevens.',
                juist: true,
                feedback:
                  'Precies. Klein, afgebakend, meteen bruikbaar, en je hebt in één sessie iets werkends.',
              },
              {
                tekst: 'Een digitaal puntenboek voor je klas.',
                juist: false,
                feedback:
                  'Twee problemen: het is technisch een pak complexer, én je zit meteen met leerlinggegevens. Slechte combinatie om mee te starten.',
              },
              {
                tekst: 'Een compleet platform voor de hele vakwerkgroep.',
                juist: false,
                feedback:
                  'Te groot. Grote projecten stranden; kleine projecten leren je hoe het werkt.',
              },
            ],
          },
        ],
      },
      {
        id: 'onderwijsprobleem-eerst',
        titel: 'Begin bij het probleem, niet bij de tool',
        minuten: 25,
        intro: 'Je vertrekt van een lesmoment dat telkens stroef loopt, laat drie bouwideeën voorstellen en kiest je project.',
        onthoud: 'Begin niet bij wat je wil bouwen, maar bij wat in je les knelt. Twijfel je tussen ideeën, kies dan het kleinste.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'De meest gemaakte fout: beginnen met <em>"ik wil eens iets bouwen met AI"</em>. Dan krijg je een technisch geslaagd ding dat niemand gebruikt. Begin dus omgekeerd — bij iets dat in jouw lessen structureel knelt.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>Welk moment loopt telkens stroef?</strong> Bv. "bij het herhalen van de maaltafels verlies ik de helft van de klas."',
              '<strong>Wat zou het moeten oplossen?</strong> Bv. "iedereen oefent tegelijk op zijn eigen niveau, en ik zie wie vastloopt."',
              '<strong>Wat is de kleinste versie die al helpt?</strong> Bv. "een oefenpagina die willekeurige maaltafels geeft en meteen zegt of het juist is."',
              '<strong>Pas nu:</strong> beschrijf dat aan de AI.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Van probleem naar bouwidee',
            tekst:
              'Ik ben leerkracht [VAK] in het [LEERJAAR] in Vlaanderen.\n\nDit loopt stroef in mijn lessen: [BESCHRIJF HET PROBLEEM IN 2-3 ZINNEN].\n\nStel 3 kleine digitale hulpmiddelen voor die hierbij zouden helpen. Voor elk: wat het doet, wat de leerling ziet, en hoe lang het ongeveer duurt om te bouwen.\n\nHou het klein en haalbaar: één webpagina, geen inloggen, geen opslag van leerlinggegevens. Zeg er ook bij welk idee je zelf zou kiezen en waarom.',
            uitleg:
              'Die laatste alinea houdt je weg van luchtkastelen. Vraag ook altijd het advies — dat scheelt je een half uur twijfelen.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Koppel het aan je leerplandoel',
            inhoud:
              'Plak het leerplandoel of de eindterm er letterlijk bij. Je bouwsel wordt er scherper van, en je kan het meteen verantwoorden op de vakwerkgroep of het teamoverleg, of bij de pedagogisch begeleider.',
          },
          {
            type: 'opdracht',
            titel: 'Kies je project',
            inhoud:
              'Alles wat je in dit spoor bouwt, bouw je rond één eigen idee. Kies het nu — niet later.',
            stappen: [
              'Schrijf in één zin op welk moment in jouw lessen structureel stroef loopt.',
              'Gebruik de prompt hierboven en laat 3 ideeën genereren.',
              'Kies er één. Bij twijfel: het kleinste.',
              'Schrijf in één zin op wat de leerling straks op het scherm ziet.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'vibe-bouwen',
    icoon: '🔨',
    titel: 'Je eerste webapp bouwen',
    ondertitel: 'Van beschrijving naar iets dat werkt — en daarna naar iets dat je durft tonen.',
    niveau: 'Basis',
    doelen: [
      'Je bouwt een werkende webpagina uit één beschrijving.',
      'Je test systematisch en stuurt gericht bij.',
      'Je maakt het bruikbaar op het scherm waar het écht gebruikt wordt.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet: je moet bestanden kunnen bewaren.',
      'Een werkend Claude-account.',
      'Het projectidee uit de module Vibe coden: wat en waarom.',
    ],
    lessen: [
      {
        id: 'eerste-versie',
        titel: 'De eerste versie',
        minuten: 30,
        intro: 'Je laat Claude met een herbruikbare bouwprompt een eerste oefenpagina maken: één HTML-bestand dat je meteen kan uitproberen.',
        onthoud: 'Eén bestand houdt alles simpel: vraag er altijd om. Loopt de eerste versie stuk, beschrijf dan wat je ziet en laat het oplossen.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Je vraagt de AI om <strong>één bestand</strong>: een HTML-pagina waar alles in zit. Geen installatie, geen mappen, geen technische opzet. Je krijgt iets terug dat je meteen ziet werken, en dat je later gewoon als bestand kan bewaren en delen. Even de drie woorden die je straks in de prompt ziet staan: <strong>HTML</strong> is de taal waarin webpagina\'s geschreven zijn, <strong>CSS</strong> bepaalt hoe ze eruitzien en <strong>JavaScript</strong> zorgt voor wat er gebeurt als de leerling op een knop klikt. Je hoeft daar niets van te kennen — je vraagt enkel dat die drie samen in dat ene bestand zitten.',
          },
          {
            type: 'prompt',
            titel: 'De bouwprompt — hergebruik deze telkens',
            tekst:
              'Bouw een oefenpagina voor mijn leerlingen.\n\nWAT HET DOET:\n[BESCHRIJF IN 3-5 ZINNEN WAT DE LEERLING DOET EN ZIET]\n\nVOOR WIE:\nLeerlingen van [LEEFTIJD], [LEERJAAR], Vlaams onderwijs.\n\nEISEN:\n- Alles in één enkel HTML-bestand (HTML, CSS en JavaScript samen, geen externe bestanden).\n- Werkt zonder internetverbinding.\n- Werkt op een smartboard én op een gsm.\n- Grote, duidelijke knoppen en tekst.\n- Voldoende contrast en een leesbaar lettertype, ook van achteraan de klas op het smartboard.\n- Directe feedback: de leerling ziet meteen of het juist is.\n- Die feedback nooit enkel met kleur: zet er ook een woord of symbool bij.\n- Geen inloggen, geen opslag van persoonsgegevens.\n- Alle tekst in het Nederlands, met korte en duidelijke instructies. Vaktermen mag je gewoon gebruiken.\n\nGeef het volledige bestand terug.',
            uitleg:
              'Bewaar deze prompt. Je vervangt enkel het bovenste blok en je hebt telkens een degelijk vertrekpunt. De eis "één bestand" is de belangrijkste — die houdt alles simpel.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Laat het meteen zien',
            inhoud:
              'Claude kan zo\'n pagina direct in het gesprek tonen en laten uitproberen. Je hoeft dus niets te installeren om te zien of je idee werkt. Werkt het? Bewaar het als bestand met de extensie <code>.html</code> — dubbelklikken opent het in je browser.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Werkt het niet? Dat is normaal',
            inhoud:
              'Een eerste versie die stukloopt hoort erbij en is geen teken dat je iets fout deed. Kopieer gewoon de foutmelding of beschrijf wat je ziet gebeuren, en vraag om het op te lossen. Dit is precies hoe programmeurs ook werken.',
          },
        ],
      },
      {
        id: 'testen-bijsturen',
        titel: 'Testen en bijsturen',
        minuten: 30,
        intro: 'Je test je pagina als drie verschillende leerlingen en op het echte toestel, en verzamelt alle fouten vóór je bijstuurt.',
        onthoud: 'Zeg altijd wat je deed, wat je zag en wat er had moeten gebeuren. Bewaar een kopie zodra iets werkt, vóór je een grote wijziging vraagt.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Hier zit het echte werk, en meteen de reden waarom dit lukt zonder programmeerkennis: je hoeft niet te weten <em>waarom</em> iets misgaat, enkel <strong>wat</strong> er misgaat. Beschrijf dat precies genoeg en je krijgt een oplossing.',
          },
          {
            type: 'vergelijk',
            zwak: 'Het werkt niet.',
            sterk:
              'Als ik op "Controleer" klik terwijl het antwoordveld leeg is, verschijnt "Juist!" in het groen. Dat zou "Vul eerst iets in" moeten zijn. De rest werkt wel.',
            uitleg:
              'Zelfde regel als bij gewone prompts: hoe concreter je beschrijft, hoe minder rondes je nodig hebt. Zeg altijd wat je deed, wat er gebeurde, en wat er had moeten gebeuren.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Test als de vlotte leerling:</strong> vul alles correct in — doet de app dan wat je verwacht?',
              '<strong>Test als de leerling die het niet meteen snapt:</strong> lees enkel wat op het scherm staat. Raak je verder zonder jouw uitleg erbij?',
              '<strong>Test als de leerling die alles uitprobeert:</strong> klik alles kapot. Lege velden, dubbelklikken, rare invoer, drie keer na elkaar op verzenden.',
              '<strong>Test op het échte toestel:</strong> smartboard, chromebook of gsm — niet enkel op je eigen laptop.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Bewaar wat werkt',
            inhoud:
              'Zet alles van dit project in die ene map die je aanmaakte bij <em>Wat je klaarzet vóór je begint</em>, de eerste les van dit spoor: je bestand, je versies, later je projectblad. Zo heb je over drie weken nog één plek waar je moet kijken, en niet drie versies tussen je downloads. Bewaar daarin een kopie zodra iets goed werkt, vóór je een grote wijziging vraagt. Noem het <code>oefenapp-v1.html</code>, <code>-v2</code>, enzovoort. Gaat een nieuwe versie de mist in, dan val je gewoon terug. In de module <em>Gegevens, privacy en versiebeheer</em> doen we dit netter.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Als je er na drie keer niet uit raakt',
            inhoud:
              'Dat overkomt iedereen, ook mensen die dit elke dag doen. Loop deze vier stappen af, in deze volgorde. <strong>Eén:</strong> ga terug naar je laatst bewaarde versie die wél werkte en vraag dezelfde wijziging opnieuw, maar in kleinere stukken — één ding per bericht, telkens met de zin <em>"Los enkel dit op en verander verder niets aan de pagina."</em> <strong>Twee:</strong> vraag Claude om in gewone taal te beschrijven wat je pagina volgens hem doet, zonder iets aan te passen. Staat daar iets anders dan wat jij dacht, dan heb je je probleem gevonden. <strong>Drie:</strong> begin een nieuw gesprek, sleep je laatst werkende bestand erin en beschrijf wat er moet gebeuren alsof het de eerste keer is. Een gesprek dat vastgelopen is, raakt daar zelden nog uit; een leeg gesprek met hetzelfde bestand meestal meteen. In de verdiepingsles <em>Als het chatvenster te klein wordt</em> staat een prompt die daar een net overdrachtsbriefje van maakt. <strong>Vier:</strong> leg het voor aan een mens — je ICT-coördinator, of een collega uit je vakwerkgroep die hier al eens aan begon. Vastzitten is geen teken dat je het niet kan; het hoort bij het werk, en het stopt meestal bij stap één of drie.',
          },
          {
            type: 'quiz',
            vraag: 'Je app doet iets raars en je snapt niet waarom. Wat is de beste zet?',
            opties: [
              {
                tekst: 'De code zelf proberen te lezen en aan te passen.',
                juist: false,
                feedback:
                  'Kan, maar hoeft niet. Zonder programmeerkennis kost het je veel tijd en riskeer je meer stuk te maken.',
              },
              {
                tekst: 'Precies beschrijven wat je deed, wat er gebeurde en wat er had moeten gebeuren.',
                juist: true,
                feedback:
                  'Juist. Dat is de kernvaardigheid van vibe coden — een goed foutrapport is meer waard dan technische kennis.',
              },
              {
                tekst: 'Opnieuw beginnen met een nieuwe prompt.',
                juist: false,
                feedback:
                  'Zonde van je werk. Binnen hetzelfde gesprek kent de AI je app al; bijsturen is bijna altijd sneller.',
              },
            ],
          },
          {
            type: 'opdracht',
            titel: 'Test als drie leerlingen',
            inhoud:
              'Rondklikken tot het lijkt te werken is geen test. Je doorloopt een app vier keer — drie keer in het hoofd van een andere leerling, één keer op het toestel waarop de app écht gebruikt wordt — en je verzamelt alles wat misloopt vóór je iets laat aanpassen.',
            stappen: [
              'Werk je samen met iemand, ruil dan: jij test zijn app, hij de jouwe. Werk je alleen, zoek dan toch één paar verse ogen — een collega van je vakwerkgroep, iemand thuis, of één leerling vóór de les — en zeg niets terwijl die klikt. Lukt ook dat niet vandaag, doe de vier rondes hieronder dan zelf en lees daarna de verdiepingsles "Laat de AI je app testen" in deze module: daar laat je een testlijst maken die vindt wat jij over het hoofd ziet, precies omdat jij weet hoe het bedoeld is.',
              'Ronde 1 — de vlotte leerling: vul alles correct in en kijk of de app doet wat je verwacht. Ronde 2 — de leerling die het niet meteen snapt: lees enkel wat op het scherm staat en kijk of je zonder uitleg verder raakt.',
              'Ronde 3 — de leerling die alles uitprobeert: lege velden, dubbelklikken, rare invoer, drie keer na elkaar op verzenden. Ronde 4: open dezelfde pagina op een gsm of op het smartboard en kijk wat daar anders loopt.',
              'Noteer elke fout als één zin: wat je deed, wat je zag, en wat er had moeten gebeuren. Nog niets bijsturen — eerst alles verzamelen.',
              'Zet die zinnen onder elkaar in één bericht aan Claude met de vraag ze allemaal op te lossen zonder de rest te veranderen, bewaar de nieuwe versie onder een volgend nummer en hertest enkel wat op je lijstje stond.',
            ],
          },
        ],
      },
      {
        id: 'stijl-en-bruikbaarheid',
        titel: 'Stijl en bruikbaarheid',
        minuten: 15,
        intro: 'Je maakt je eerste versie klaar voor de klas: leesbaar op het smartboard, met grote knoppen, zonder de werking te veranderen.',
        onthoud: 'Eindig een vraag over het uitzicht altijd met "Verander niets aan hoe de oefening werkt". Juist of fout toon je nooit enkel met kleur.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Een eerste versie ziet er meestal kaal uit. Dat is prima om te testen, maar in de klas telt uitstraling wél: leerlingen nemen iets dat er verzorgd uitziet serieuzer, en duidelijke knoppen schelen je tien vragen tijdens de les.',
          },
          {
            type: 'prompt',
            titel: 'Opfrissen voor klasgebruik',
            tekst:
              'Maak het visueel aantrekkelijker en beter bruikbaar in de klas:\n\n- Vriendelijke, rustige kleuren, goed leesbaar op een smartboard van achteraan de klas.\n- Grote knoppen, ruime tekst, veel witruimte.\n- Duidelijk verschil tussen juist (groen) en fout (rood), maar niet enkel op kleur — zet er ook een woord of symbool bij, voor leerlingen met kleurenblindheid.\n- Werkt goed op gsm én op groot scherm.\n- Een duidelijke titel bovenaan.\n\nVerander niets aan hoe de oefening werkt.',
            uitleg:
              'Die laatste zin is cruciaal: zonder die regel herschrijft de AI soms ook de werking, en ben je je geteste versie kwijt.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Toegankelijkheid is geen extraatje',
            inhoud:
              'Voldoende contrast, een leesbaar lettertype en feedback die niet enkel op kleur steunt: dat staat daarom al in je bouwprompt. Hou het erin, ook als je de prompt inkort — het maakt je materiaal bruikbaar voor élke leerling in je klas.',
          },
        ],
      },
      {
        id: 'afbeeldingen-bestanden',
        titel: 'Afbeeldingen, bestanden en downloads',
        minuten: 40,
        intro: 'Je krijgt beeld in je pagina zonder dat het losvalt, en je bouwt een knop waarmee de leerling zijn werk meeneemt.',
        onthoud: 'Een schema of tekening die in je pagina zelf getekend is, gaat overal mee. Laat leerlingen hun werk downloaden of afdrukken; inleveren gaat via de weg van je school.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'In de basislessen hiervoor bouwde je een oefenpagina die het redt met tekst en knoppen. Dat brengt je verder dan je zou denken — tot je een oefening wil maken over de dwarsdoorsnede van een bloem in het eerste jaar secundair, en je merkt dat de halve oefening in de tekening zit. Zodra er beeld bij komt, verandert er iets aan je bestand: je pagina bevát die tekening meestal niet, ze <em>verwijst</em> ernaar. Stuur je enkel het HTML-bestand door, dan ziet de leerling een leeg kader waar de bloem had moeten staan. Deze les gaat over die twee kanten: hoe je beeld erin krijgt zonder dat het losvalt, en hoe je de leerling op het einde iets laat meenemen.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De assistent tekent het zelf, in je bestand.</strong> Voor een schema, een grafiek, een tijdlijn of een eenvoudige illustratie is dit veruit de stevigste weg: er komt geen apart beeldbestand aan te pas, de tekening zit gewoon in je pagina en gaat dus overal mee. Ze blijft bovendien scherp op een smartboard, hoe groot je ze ook maakt. Kijk wel na of ze klopt vóór je ze toont — een bloem met de meeldraden op de verkeerde plaats is erger dan geen beeld.',
              '<strong>Je eigen foto naast je bestand.</strong> Je bewaart de foto in dezelfde map als je HTML-bestand. Dit werkt altijd, op elke laptop, maar voortaan moet je die map in haar geheel delen. Eén bestand doorsturen kan niet meer, en dat is net wat je in de praktijk het vaakst doet.',
              '<strong>Je eigen foto ín je bestand.</strong> Een foto kan ook mee in het bestand geschreven worden, als een lange reeks tekens in plaats van als apart beeldbestand. Dan hou je één bestand over dat overal werkt, ook zonder internet. Of dat met jouw foto lukt, hangt af van wat je assistent met jouw bestanden kan doen: vraag het gewoon, en controleer daarna zelf of het echt gelukt is — hoe, staat onder de prompt hieronder. Hou het bij enkele kleine afbeeldingen en niet bij twintig foto\'s op volle grootte, want je bestand wordt er zwaar van.',
              '<strong>Een adres van beeld dat al ergens online staat.</strong> De kortste weg, maar je pagina hangt dan af van internet én van een website waar jij niets over te zeggen hebt: verdwijnt de foto daar of verandert de site haar adressen, dan is ze ook bij jou weg. In een lokaal met een wisselvallig netwerk is dit de eerste die je laat vallen.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Gratis gevonden is niet vrij te gebruiken',
            inhoud: 'Een foto die je via een zoekmachine vindt, is bijna altijd van iemand. Dat je hem in twee klikken kan bewaren, zegt niets over of je hem mag gebruiken — en dat verandert niet naargelang je hem in je bestand zet of er enkel naar verwijst. Drie bronnen waar je wél gerust in bent: <strong>je eigen foto\'s</strong> — vaak ook de herkenbaarste voor je klas, want het is jullie eigen omgeving; <strong>beeldbanken die uitdrukkelijk zeggen dat hun beeld vrij te gebruiken is</strong>; en <strong>materiaal van KlasCement</strong>, waar de maker zelf bij zijn materiaal zet wat je ermee mag. Lees die voorwaarden wel: sommige vragen dat je de maker vermeldt, andere laten niet toe dat je iets aanpast. Voor gebruik in je eigen les bestaat er een uitzondering voor onderwijs, maar die is smaller dan ze klinkt: ze vraagt dat je de bron en de maker vermeldt, en ze rekent erop dat het materiaal binnen de school blijft. Wil je een pagina met beeld van iemand anders delen, hou ze dan achter de afgeschermde omgeving van je school in plaats van op een publieke link. Twijfel je over een concrete afbeelding, leg ze voor aan je ICT-coördinator of aan de pedagogische begeleidingsdienst.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Een foto van je leerlingen? Eerst het beeldbeleid van de school',
            inhoud: 'Voor beeld van leerlingen gelden de afspraken van je school, ook in iets dat je zelf bouwde. De toestemming die ouders bij de start van het schooljaar tekenen, gaat meestal over de schoolwebsite, de schoolkrant of het jaarboek — over een pagina die jij online zet, staat daar niets in. En zo\'n pagina is bereikbaar voor iedereen die de link heeft. De eenvoudige weg is dus: gebruik geen beeld waarop leerlingen herkenbaar staan. Heb je toch een foto van een activiteit nodig, kies dan het werk in plaats van de gezichten — de proefopstelling, de maquette, handen aan het werk. Kan het echt niet anders, leg het dan één keer voor aan je directie of aan de DPO van je scholengroep, in plaats van er zelf over te beslissen.',
          },
          {
            type: 'prompt',
            titel: 'Beeld dat overal werkt, ook voor wie niet ziet',
            tekst: 'Voeg afbeeldingen toe aan mijn oefenpagina.\n\nWELKE:\n[BESCHRIJF PER AFBEELDING WAT EROP STAAT EN WAAR ZE MOET KOMEN]\n\nEISEN:\n- Volstaat een schema, een grafiek of een eenvoudige tekening? Teken die dan zelf rechtstreeks in de pagina in plaats van met een foto te werken.\n- Zet elke andere afbeelding rechtstreeks in het HTML-bestand zelf, zodat het bestand op zichzelf blijft werken: ook zonder internet en als ik het los doorstuur.\n- Krijg je een afbeelding niet in het bestand, zeg dat dan uitdrukkelijk en leg uit wat ik zelf moet doen. Verwijs in dat geval niet stilzwijgend naar een adres op het internet.\n- Hou het bestand licht genoeg om vlot te openen op een chromebook aan een traag schoolnetwerk.\n- Elke afbeelding schaalt mee met het scherm: nooit breder dan het venster, en op een gsm even bruikbaar als op het smartboard.\n- Zet bij elke afbeelding een tekstalternatief dat beschrijft wat er te zien is, voor leerlingen die met voorleessoftware of een schermlezer werken. Beschrijf de inhoud, niet het bestand.\n- De oefening moet ook te maken zijn als de afbeelding niet laadt: zet de informatie die de leerling nodig heeft nooit alleen in het beeld.\n\nVerander niets aan hoe de oefening werkt.',
            uitleg: 'Een <strong>tekstalternatief</strong> is de zin die voorleessoftware of een schermlezer voorleest in plaats van de afbeelding. Voor een leerling die slecht of niet ziet, is dat álles wat er van je beeld overblijft — en diezelfde zin verschijnt gewoon op het scherm wanneer een afbeelding niet laadt, wat op een haperend schoolnetwerk vaker gebeurt dan je zou willen. Vraag dus om een beschrijving van wat er te zien is ("een dwarsdoorsnede van een bloem met stamper en meeldraden aangeduid") en niet om "afbeelding 3". <strong>Controleer daarna zelf of het beeld er écht in zit</strong>, want aan de pagina zie je dat niet: verplaats het bewaarde bestand naar een andere map, verbreek je verbinding met het internet en open het opnieuw in een privévenster — in Chrome heet dat een incognitovenster. Sleep het bestand daarin, want dubbelklikken opent het weer in je gewone venster. Dat privévenster is er niet voor niets: in een gewoon venster toont je browser een afbeelding die hij daarnet al ophaalde meestal gewoon uit zijn eigen geheugen, en dan lijkt alles in orde terwijl ze er niet in zit. Staat de afbeelding er dan nog, dan zit ze in je bestand. Zie je een leeg kader, dan verwees je pagina toch nog naar iets buiten zichzelf — meld dat en laat het bijsturen. Kijk bij die gelegenheid ook even hoe groot je bestand geworden is: met foto\'s erin loopt dat sneller op dan je denkt, en dat merk je pas wanneer twintig leerlingen de pagina tegelijk openen.',
          },
          {
            type: 'tekst',
            inhoud: 'De tweede helft van deze les is de omgekeerde beweging: iets uít je app krijgen. Een leerling van het vijfde leerjaar werkt twintig minuten in je woordenschattrainer Frans, klikt het tabblad weg en houdt niets over. De reflex is dan <em>"ik moet die antwoorden opslaan"</em> — maar opslaan vraagt een plek om te bewaren, en dus een account, een database en een gesprek over leerlinggegevens (zie de module <em>Gegevens, privacy en versiebeheer</em>). Meestal wil je dat helemaal niet. Wat je wél wil, is dat de leerling zijn werk kan <strong>meenemen</strong>: een knop die van zijn antwoorden een blad maakt dat hij downloadt of afdrukt. Dat blad gaat in zijn map of mee naar huis; bij jou blijft er niets achter. Geen account, geen opslag, en dus ook niets dat jij moet bewaren, beveiligen of later kunnen wissen — en je hebt iets in handen dat je de les nadien kan bespreken.',
          },
          {
            type: 'opdracht',
            titel: 'Bouw een knop om het werk mee te nemen',
            inhoud: 'Neem je eigen project erbij en zet er één knop onder die van het werk van de leerling een blad maakt om mee te nemen: als download of als afdruk. Je eindigt met een geteste versie én met dat blad op papier voor je neus. Wat je hier bewust <em>niet</em> doet, is iets binnenhalen: moet het werk bij jou terechtkomen om nagekeken te worden, gebruik dan de weg die je school daarvoor heeft.',
            stappen: [
              'Schrijf in twee zinnen op wat er op dat blad moet staan: de titel van de oefening, de datum, de vragen met de antwoorden van de leerling, en eventueel wat er fout ging. Zet er geen naam op, tenzij de leerling die zelf intikt.',
              'Vraag Claude om onderaan je oefening een knop toe te voegen die precies dat blad maakt, en die pas verschijnt als de oefening af is. Zeg er uitdrukkelijk bij dat er niets verstuurd of bewaard mag worden: het blad wordt gemaakt op het toestel van de leerling zelf.',
              'Test drie keer: alles juist ingevuld, de helft fout, en niets ingevuld. Doe die test in het bewaarde bestand zelf en niet enkel in het voorbeeldvenster van je gesprek, want een download gedraagt zich daar soms anders.',
              'Open dezelfde pagina op een gsm en probeer het blad ook daar te bewaren of af te drukken. Loopt het anders, beschrijf dan wat je ziet gebeuren en laat het bijsturen.',
              'Druk er één af, of bewaar het als PDF als er geen printer in de buurt staat, en leg het naast je oefening. Is dit een blad dat je een leerling in zijn map laat steken? Zo niet: noteer wat eraan moet veranderen, laat dat aanpassen en bewaar het resultaat onder een volgend versienummer.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wat je niet doet: leerlingen bestanden laten opladen',
            inhoud: 'Downloaden gaat één richting uit; opladen gaat de andere kant op, en dat is een heel ander verhaal. Een knop waarmee leerlingen een foto of een document in jouw app zetten, klinkt onschuldig — een taak inleveren, een tekening insturen — maar vanaf dat moment komt er materiaal binnen dat ergens terechtkomt. Formeel is het je school die verantwoordelijk is voor wat er met leerlingmateriaal gebeurt; met een eigen bouwsel zet je daar iets naast waarover geen enkele afspraak bestaat, en dan sta je er alleen mee. Wat erin zit, weet je vooraf trouwens niet: een foto met gezichten, een blad met de naam van een broer of zus, een schermafbeelding van een gesprek. Voor het inleveren van werk heeft je school al een weg die daarvoor gemaakt is — voor de meeste scholen is dat Smartschool — met de afspraken errond. Gebruik die, en hou je eigen bouwsel bij waar het sterk in is: oefenen, tonen en meegeven.',
          },
        ],
      },
      {
        id: 'grotere-projecten',
        titel: 'Als het chatvenster te klein wordt',
        minuten: 25,
        intro: 'Je herkent wanneer een gesprek te lang wordt en verhuist je project met een overdrachtsbriefje naar een nieuw gesprek.',
        onthoud: 'Wacht niet tot je vastzit: vraag een overdrachtsbriefje bij het eerste signaal. Een bouwomgeving loont pas als je gesprek beheren meer tijd kost dan je pagina verbeteren.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Tot hier bouwde je één pagina in één gesprek: beschrijven, testen, bijsturen, klaar. Voor bijna elke klastool is dat het hele verhaal. Maar af en toe groeit zo\'n ding. Een leerkracht Frans in het derde jaar secundair begint met een woordenschattrainer voor één hoofdstuk, voegt er een tweede oefenvorm bij, daarna een startscherm waar de leerling kiest welk hoofdstuk hij oefent — en drie weken later is dat gesprek zo lang geworden dat ze haar eigen afspraken niet meer terugvindt en het begint te knarsen. Deze les gaat over dat moment. Het is een verdiepingsles: lees ze pas als je dit herkent.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De assistent vergeet wat je eerder afsprak.</strong> Een gesprek heeft een geheugen met een bovengrens: wordt het te lang, dan schuift het begin eruit. Je afspraak van weken geleden dat de knoppen groot moeten zijn omdat je met een smartboard werkt, staat helemaal bovenaan — en verdwijnt er stilletjes weer uit.',
              '<strong>Eén wijziging breekt iets anders.</strong> Je vraagt om de teller anders te laten aftellen, en plots werkt de knop om naar de volgende vraag te gaan niet meer. Hoe meer je pagina doet, hoe vaker dat gebeurt.',
              '<strong>Je bestand komt niet meer in één keer terug.</strong> Het antwoord stopt halverwege, of je krijgt enkel het stuk dat veranderde in plaats van het volledige bestand. Dan begint het gepuzzel met kopiëren en plakken, en verlies je het overzicht over welke versie nu de echte is.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Het overdrachtsbriefje',
            tekst: 'Ik werk in dit gesprek al een tijd aan een webpagina voor mijn lessen, en het gesprek wordt te lang. Ik wil in een nieuw gesprek verder.\n\nSchrijf een overdrachtsbriefje dat ik daar als eerste bericht kan plakken. Zet erin:\n- Wat de pagina doet en voor wie: [LEERJAAR EN VAK].\n- Alle afspraken die we onderweg maakten over uitzicht, taal en werking, ook de kleine.\n- Wat al af is en getest is.\n- Wat er nog moet gebeuren.\n- Waar we onderweg op vastliepen, zodat ik dat niet opnieuw meemaak.\n\nGewone taal, geen code. Baseer je op dit gesprek en niet op wat gebruikelijk is.',
            uitleg: 'Doe dit zodra je het eerste signaal ziet, niet als je al vastzit. Je plakt het briefje als eerste bericht in een nieuw gesprek en voegt je laatst werkende bestand erbij — het bestand zelf, niet de code die je eruit kopieert. Zo ben je weer vertrokken met een assistent die alles van je project weet en niets meer van de omwegen. Bewaar het briefje ook als tekstbestand naast je pagina: het is meteen de uitleg die je jezelf over drie maanden wil geven. Voor veel projecten is dit de hele oplossing en heb je de rest van deze les niet nodig.',
          },
          {
            type: 'tekst',
            inhoud: 'Blijft het knarsen, dan bots je op iets anders: een chatvenster is gemaakt om in te praten, niet om een project in te bewaren. Voor dat soort bouwen bestaat er apart gereedschap, waarbij de assistent <em>in</em> je project zit in plaats van ernaast. Je kopieert niets meer heen en weer: je zegt wat er moet gebeuren en de assistent past je bestanden zelf aan. Zulke <strong>bouwomgevingen</strong> — één venster waarin je project, je gesprek en je pagina samen zitten — bestaan in verschillende smaken: sommige draaien gewoon in je browser, andere installeer je op je laptop. De makers van de assistenten hebben er een, andere partijen ook. Welke dat vandaag precies zijn en wat ze aankunnen, verandert te snel om hier op te schrijven; vraag dat gerust aan je assistent zelf. Let daarbij op wat ze toevoegen, niet op de naam.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Op een schoollaptop mag je vaak niets installeren',
            inhoud: 'Dat is geen doodlopende straat. Kies dan een bouwomgeving die gewoon in je browser draait — dan hoeft er niets op je toestel — of vraag aan je ICT-coördinator om het voor je klaar te zetten. Vraag dat wel een week op voorhand: een installatie op een schooltoestel loopt meestal via een aanvraag, en dat ontdek je liever niet op de avond dat je verder wil werken.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Meerdere bestanden naast elkaar.</strong> Je project hoeft niet langer in één bestand te passen. De oefenvragen kunnen apart staan van de rest, zodat een collega van je vakwerkgroep er vragen kan bijzetten zonder aan de werking te raken. De assistent ziet die bestanden allemaal tegelijk, zonder dat jij het geheel telkens moet doorsturen.',
              '<strong>Je hele project meteen zien draaien.</strong> In een gewoon gesprek toont Claude je pagina al meteen — dat blijft zo. Het verschil is dat je hier je <em>volledige</em> project ziet draaien, met al zijn bestanden samen, en dat het zichzelf ververst zodra er iets is aangepast. Testen en bijsturen blijft dus één beweging, ook als je project uit meer dan één bestand bestaat.',
              '<strong>Terug kunnen naar een vorige versie.</strong> Elke stap wordt bijgehouden, dus je raakt terug naar hoe het gisteren was zonder zelf kopieën met een nummer te bewaren. Dat is precies het versiebeheer uit de module <em>Gegevens, privacy en versiebeheer</em>, alleen zit het hier meestal al ingebouwd.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'De vaardigheid verhuist gewoon mee',
            inhoud: 'Het werk zelf verandert niet: beschrijven, testen, bijsturen. Een goed foutrapport — wat je deed, wat je zag, wat er had moeten gebeuren — is in zo\'n omgeving exact even veel waard als in een gewoon gesprek. En het omgekeerde geldt ook: gereedschap dat meer aankan, maakt een vaag idee niet scherper. Hoe groter je project, hoe zwaarder het weegt dat jij precies kan zeggen wat je wil. Dat is wat je in dit spoor oefende, en dat neem je mee.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Wat zo\'n omgeving allemaal te zien krijgt',
            inhoud: 'Meer dan één los gesprek: al je projectbestanden, en bij een omgeving die op je eigen laptop draait soms ook wat er verder in dezelfde map staat — de map op je computer waar je project in zit. Hou die map dus schoon: geen klaslijsten, geen verbeterde toetsen, geen verslagen ernaast. Kijk daarnaast bij de dienst zelf na wat er met je gegevens gebeurt en waar ze bewaard worden. Voorziet je school of scholengroep een schoolaccount, gebruik dan dat en niet je privéaccount. Kom je er niet uit, dan is dat geen reden om af te haken: het is een vraag aan je ICT-coördinator, en zodra er leerlinggegevens in het spel zijn aan de DPO van je scholengroep.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Zoek uit wat het kost vóór je er lesmateriaal mee maakt',
            inhoud: 'Een gewoon gesprek zit binnen je gewone account en daar denk je verder niet over na. Een assistent die zelfstandig door een hele projectmap werkt, verbruikt merkbaar meer, en bij dit soort gereedschap reken je vaak per gebruik af in plaats van per maand. Zoek dus uit hoe dat bij jouw keuze zit en zet meteen een limiet — dezelfde reflex als in de module <em>AI inbouwen in je eigen tool</em>. Vind je die limiet niet, vraag dan aan je assistent zelf waar ze staat. En gebruik je dit voor school, spreek dan vooraf af wie het betaalt — dezelfde afspraak die daar voor de betaalde AI-dienst geldt.',
          },
          {
            type: 'tekst',
            inhoud: 'En dan het eerlijke slot: de meeste leerkrachten komen hier nooit terecht, en dat is geen gebrek aan ambitie. Eén oefenpagina die in jouw klas doet wat ze moet doen, is een volwaardig eindpunt — meer waard dan een half project dat groter wilde worden. Het moment om over te stappen is bovendien goed herkenbaar: wanneer je meer tijd kwijt bent aan het beheren van je gesprek dan aan het verbeteren van je pagina. Tot dan is een nieuw gesprek met een overdrachtsbriefje bijna altijd het snelste antwoord.',
          },
        ],
      },
      {
        id: 'ai-als-tester',
        titel: 'Laat de AI je app testen',
        minuten: 35,
        intro: 'Je laat Claude een testlijst maken door de ogen van een leerling en werkt de vijf bovenste punten zelf af.',
        onthoud: 'Vraag niet of je pagina goed is, maar waar ze stukloopt. Wat Claude vindt, is een tip die je zelf natrekt, geen conclusie.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Je test je eigen app zoals je je eigen tekst nakijkt: je leest wat er <em>zou moeten</em> staan. Je weet dat het antwoordveld een getal verwacht, dus typ je een getal. Je weet dat je bovenaan eerst een oefening kiest, dus klik je die eerst aan. Je klikt vanzelf de juiste weg, en na tien minuten besluit je dat het werkt. In de basislessen hiervoor testte je daarom als drie verschillende leerlingen — dat helpt, maar ook dan blijf jij degene die weet hoe het bedoeld is. Een klas van vierentwintig weet dat niet, en vindt in twee minuten wat jij in een half uur niet vond.',
          },
          {
            type: 'tekst',
            inhoud: 'Die twee minuten kan je vooraf laten gebeuren. Vraag Claude niet <em>of</em> je pagina werkt, maar vraag om een <strong>testlijst</strong>: een lijstje met dingen die een leerling kan doen waar jouw pagina waarschijnlijk niet op gerekend is. Op zo\'n lijst duiken telkens dezelfde verdachten op — stuk voor stuk dingen die jij niet doet, en die een leerling binnen de minuut wél doet.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Niets invullen.</strong> Op verzenden klikken met een leeg veld — verschijnt er dan "Juist!" op het scherm?',
              '<strong>Twee keer na elkaar op dezelfde knop klikken.</strong> Telt je app dan twee antwoorden, of slaat ze een vraag over?',
              '<strong>Een hoofdletter of een spatie te veel.</strong> "Parijs" typen waar de pagina "parijs" verwacht, of "24 " met een spatie erachter in je maaltafeloefening voor het vierde leerjaar.',
              '<strong>Een veel te lang antwoord.</strong> Driehonderd tekens plakken in een veld waar één woord verwacht wordt.',
              '<strong>Halverwege opnieuw beginnen, of de pagina herladen.</strong> Springt de teller dan op nul, of telt hij vrolijk verder?',
              '<strong>Teruggaan in de browser</strong> en van daaruit verder klikken.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Laat een testlijst maken door de ogen van een leerling',
            tekst: 'Je bouwde deze pagina voor mij. Ik wil ze stukkrijgen vóór mijn klas dat doet.\n\nWAT DE LEERLING MOET DOEN:\n[BESCHRIJF HET IN 2 OF 3 ZINNEN]\n\nVOOR WIE:\nLeerlingen van [LEEFTIJD], [LEERJAAR].\n\nMaak een testlijst van 15 dingen die een leerling kan doen waar deze pagina waarschijnlijk niet op gerekend is. Denk zeker aan: niets invullen, twee keer na elkaar op dezelfde knop klikken, hoofdletters of een spatie te veel, een heel lang antwoord, een antwoord in een andere vorm dan verwacht, midden in de oefening opnieuw beginnen, de pagina herladen, teruggaan in de browser.\n\nGeef per punt twee dingen: wat ik precies doe, en wat er zou moeten gebeuren. Nummer ze, en zet bovenaan wat de meeste kans maakt om echt mis te lopen.\n\nLos nog niets op en zeg niets over of de pagina goed is. Ik wil enkel de lijst, zodat ik zelf kan testen.',
            uitleg: 'Drie zinnen doen hier het werk. <strong>"Wat er zou moeten gebeuren"</strong> maakt van elk punt een test die je kan afvinken, in plaats van een vage bedenking. <strong>"Zet bovenaan wat de meeste kans maakt"</strong> zorgt dat de eerste vijf punten meteen de nuttigste zijn — je werkt zo\'n lijst zelden helemaal af. En <strong>"los nog niets op"</strong> houdt je pagina intact: zonder die zin krijg je een nieuwe versie terug die je opnieuw mag testen, terwijl je nog niet eens weet wat er mis was. Plak deze prompt in hetzelfde gesprek waarin je je pagina liet bouwen — daar staat ze al. Begin je een nieuw gesprek, voeg dan eerst je bestand toe, anders weet Claude niet over welke pagina je het hebt. Test daarna zelf: een punt op die lijst is een vermoeden, geen vaststelling.',
          },
          {
            type: 'tekst',
            inhoud: 'Er is nog een tweede manier, en die vindt andere dingen. Claude schreef de code van je pagina zelf en kan ze ook opnieuw doorlezen om aan te wijzen waar ze kan stuklopen. Zo komen problemen boven die je met klikken niet snel vindt: een invulveld dat letterlijk alles aanvaardt wat een leerling erin typt, een knop die nog altijd werkt nadat de oefening afgelopen is, een teller die na de laatste vraag gewoon doortelt. Om die te zien moet je toevallig net de verkeerde volgorde uitproberen; in de code springen ze er sneller uit. Alleen: <strong>hoe je het vraagt, bepaalt bijna volledig wat je terugkrijgt.</strong>',
          },
          {
            type: 'vergelijk',
            zwak: 'Is deze pagina goed zo? Kan ik hem gebruiken in de klas?',
            sterk: 'Lees de code die je net schreef opnieuw en zoek de vijf zwakste plekken: waar loopt deze pagina stuk als een leerling iets doet dat jij niet voorzag? Beschrijf elke plek apart, zeg wat de leerling dan op het scherm ziet, en los nog niets op.',
            uitleg: 'Vraag je of iets goed is, dan zit in de vraag zelf al een duwtje richting "ja". Vraag je om vijf zwakke plekken, dan moet er gezocht worden — en dan komt er meestal ook iets boven. <strong>Het tegenargument dat je nu denkt, klopt half:</strong> een assistent die zijn eigen werk nakijkt, is inderdaad geen onafhankelijke controle. Alleen zit er geen trots in de weg zoals bij een mens die zijn werk moet verdedigen; wat je terugkrijgt volgt vooral de vorm van je vraag. Daarom levert "zoek de zwakke plekken" hier meer op dan "beoordeel dit" — en daarom blijf je zelf klikken: wat eruit komt is een tip die jij natrekt, geen conclusie.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wat een testlijst niet kan zeggen',
            inhoud: 'Een testlijst zegt of je pagina overeind blijft, niet of je oefening deugt. Of ze past bij je leerplandoel, of het niveau klopt voor jouw klas, of je feedback iets bijbrengt dan wel enkel "fout" op het scherm zet: dat blijft jouw oordeel. Je kán het vragen, en je krijgt een redelijk klinkend antwoord — maar Claude heeft jouw klas nooit gezien. Een tijdlijnoefening kan technisch vlekkeloos zijn en didactisch niets waard, omdat de leerling gewoon kan blijven slepen tot alles groen wordt. Dat merk je niet in een testlijst; dat merk je door twee leerlingen ermee te laten werken terwijl jij ernaast staat, of door je pagina één keer voor te leggen op het teamoverleg of in je vakwerkgroep.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Eén probleem per keer',
            inhoud: 'Heb je een lijstje met gevonden problemen, los ze dan één voor één op, telkens met de zin: <em>"Los enkel dit op en verander verder niets aan de pagina."</em> Zonder die zin krijg je soms een netjes herschreven versie terug waarin ook dingen veranderd zijn die wél werkten — en dan mag je alles opnieuw testen. Hertest na elke oplossing meteen het punt dat je meldde, en klik ook het vorige nog eens na. Bij de opdracht <em>Test als drie leerlingen</em> stuurde je je foutenlijstje in één bericht door: prima voor kleine, losse dingen zoals een tekst die niet klopt. Gaat het over de werking zelf, dan is één voor één trager maar betrouwbaarder.',
          },
          {
            type: 'opdracht',
            titel: 'Krijg je eigen app stuk',
            inhoud: 'Je bouwde hiervoor een pagina en testte die zelf. Nu laat je er een testlijst op los en werk je de bovenste vijf punten écht af — niet lezen, klikken. Reken op een twintigtal minuten. Je eindigt met een afgevinkte lijst, één opgelost probleem en een lijstje dat je bij je volgende pagina meteen hergebruikt.',
            stappen: [
              'Open je pagina en bewaar er eerst een kopie van onder een volgend versienummer, zodat je altijd terug kan naar wat je nu hebt.',
              'Vraag met de prompt hierboven een testlijst, in hetzelfde gesprek waarin je je pagina bouwde. Neem enkel de vijf bovenste punten en zet ze onder elkaar op papier, met plaats om achter elk punt iets te schrijven. De rest bewaar je voor later.',
              'Loop die vijf punten zelf af op je scherm, één voor één. Schrijf achter elk punt: werkt, of in één zin wat je deed, wat je zag en wat er had moeten gebeuren.',
              'Kies het punt dat je leerlingen het meest zou hinderen en vraag Claude om enkel dat op te lossen, met de zin dat de rest van de pagina niet mag veranderen. Test daarna meteen opnieuw wat je meldde, en klik ook de vier andere punten nog eens na.',
              'Vraag Claude tot slot om de code van je pagina na te lezen en de vijf zwakste plekken aan te wijzen, zonder iets op te lossen. Probeer er één zelf na te bootsen: lukt dat, dan heb je een echt probleem beet en zet je het bij je lijstje; lukt het niet, laat het dan staan met een vraagteken.',
              'Bewaar het resultaat onder een nieuw versienummer en hou je lijst bij: bij je volgende pagina staat de helft van je tests er al.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'vibe-delen',
    icoon: '🌐',
    titel: 'Delen met collega\'s en leerlingen',
    ondertitel: 'Van een bestand op jouw laptop naar een link die iedereen kan openen.',
    niveau: 'Basis',
    doelen: [
      'Je weet welke manier van delen bij welke situatie past.',
      'Je zet je bouwsel online via een gratis dienst.',
      'Je introduceert het vlot in je klas.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet.',
      'Een werkend Claude-account en je eigen app uit de module Je eerste webapp bouwen.',
      'Een account bij de dienst waarop je publiceert (Netlify of Vercel), vooraf aangemaakt en bevestigd. Regel dat niet op het moment zelf: je verliest er een kwartier mee aan registreren en wachten op een bevestigingsmail.',
      'Een gsm om je link op te testen.',
    ],
    lessen: [
      {
        id: 'publiceren',
        titel: 'Online zetten',
        minuten: 15,
        intro: 'Je leert drie manieren om je app te delen, en wat er wel en niet op een publieke link mag.',
        onthoud: 'Kies de eenvoudigste manier van delen die volstaat. Een link via een gratis dienst kan iedereen openen die hem heeft: geen leerlingnamen, geen toets die je nog moet afnemen.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Zolang je app een bestand op je laptop is, kan enkel jij hem gebruiken. Er zijn drie niveaus van delen — kies het laagste dat volstaat.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>Bestand doorsturen of op Smartschool zetten.</strong> Simpelst. Leerlingen downloaden het en openen het. Prima voor eenmalig gebruik.',
              '<strong>Online zetten met een gratis dienst</strong> (Netlify of Vercel). Je uploadt je bestand en krijgt een echte link die je in Smartschool of via een QR-code deelt. Dit is meestal wat je wil.',
              '<strong>Met eigen domeinnaam en gegevensopslag.</strong> Enkel als je app gegevens moet bijhouden — zie de volgende module.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De snelste weg online',
            inhoud:
              'Bij een dienst als Netlify sleep je je HTML-bestand letterlijk naar het venster en heb je binnen enkele minuten een werkende link, zonder technische opzet. Reken wel op een account dat je eerst aanmaakt; hoe dat precies gaat, verschilt per dienst en verandert geregeld. Probeer je dienst daarom zelf één keer uit met een testbestandje, ruim vóór je die link voor je klas nodig hebt. Vraag gerust aan Claude om je stap voor stap door de dienst van je keuze te loodsen.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Online = publiek',
            inhoud:
              'Zo\'n link is voor iedereen bereikbaar die hem heeft. Zet er dus nooit iets in wat niet openbaar mag zijn: geen leerlingnamen, geen toetsen die je nog moet afnemen, geen antwoordsleutels die verborgen moeten blijven. Wat wél gewoon mag: een oefenpagina die meteen zegt of het juist is. Daar hóren de antwoorden in — dat is net het punt van de oefening, en wie bij een oefening afkijkt, bedriegt enkel zichzelf. Moet iets echt geheim blijven tot na de toets, dan hoort het niet op zo\'n publieke link: hou dat bestand bij je en deel het pas achteraf.',
          },
        ],
      },
      {
        id: 'in-de-klas',
        titel: 'Gebruiken in de klas',
        minuten: 20,
        intro: 'Je zet je app online, maakt hem klaar voor de klas en laat een collega hem uitproberen zonder jouw uitleg.',
        onthoud: 'Een link die thuis werkt, werkt niet altijd op school: test hem op de toestellen van je leerlingen en hou een plan B op papier klaar.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Een tool die technisch werkt, kan didactisch alsnog mislukken. Meestal door hetzelfde: leerlingen weten niet wat ze moeten doen, of je hebt geen plan B als het netwerk hapert.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Test op school</strong>, op de toestellen van de leerlingen. Het schoolnetwerk blokkeert soms wat thuis vlot werkt.',
              '<strong>Deel via een QR-code</strong> op het bord. Sneller dan een lange link laten overtypen, zeker in het lager onderwijs.',
              '<strong>Doe het eerst klassikaal voor</strong>, één keer, op het smartboard. Scheelt je twintig identieke vragen.',
              '<strong>Hou een plan B klaar.</strong> Een papieren versie of een klassikale variant — voor als het netwerk uitvalt, én voor wie thuis geen toestel of geen internet heeft. Geef je de link mee naar huis, zorg dan dat dezelfde oefening ook op papier te maken is, zodat het niet afhangt van wat er bij een leerling thuis staat.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Deel het met je vakwerkgroep',
            inhoud:
              'Wat jij bouwt, kan een collega meestal meteen gebruiken. Deel het in je vakwerkgroep, of zet het op KlasCement zodat andere Vlaamse leerkrachten er iets aan hebben. Vraag Claude gerust om er een korte beschrijving en gebruiksaanwijzing bij te schrijven. Eén uitzondering: een tool die gegevens bijhoudt in een database, deel je niet via KlasCement. Vraag je ICT-coördinator hoe je hem via je scholengroep kan delen: daar kan hij een veilige plek krijgen, ook voor collega\'s in andere scholen.',
          },
          {
            type: 'opdracht',
            titel: 'Zet je project online',
            inhoud: 'Sluit het basisspoor af met een echte link.',
            stappen: [
              'Zet je bestand online via een gratis dienst naar keuze.',
              'Open de link op je gsm. Werkt alles?',
              'Maak een QR-code van de link.',
              'Stuur de link naar één collega en vraag om het één keer uit te proberen zonder jouw uitleg erbij.',
            ],
          },
                  {
            type: "quiz",
            vraag: "Je oefenpagina staat online via een gratis dienst. De link is lang en cryptisch, en je deelde hem enkel in Smartschool. Wat mag er op die pagina staan?",
            opties: [
              {
                tekst: "Gerust ook gevoelige dingen: op zo'n link botst niemand toevallig.",
                juist: false,
                feedback: "Toevallig niet, dat klopt. Maar één keer doorgestuurd of even op een scherm getoond, en de link leeft verder — onvindbaar is niet hetzelfde als afgeschermd.",
              },
              {
                tekst: "Enkel wat openbaar mag zijn. Een link is geen slot.",
                juist: true,
                feedback: "Juist. Wie de link heeft, ziet alles op die pagina — ook de tekst die enkel in de code zit, zoals de juiste antwoorden. Moet iets afgeschermd blijven, dan hoort het niet op zo'n pagina.",
              },
              {
                tekst: "Alles, zolang je er geen eigen domeinnaam aan koppelt.",
                juist: false,
                feedback: "Begrijpelijk gedacht, maar een domeinnaam is enkel een kortere naam voor dezelfde pagina. Of ze publiek staat, verandert er niet door.",
              },
            ],
          },
                  {
            type: "prompt",
            titel: "Handleiding voor je collega's",
            tekst: "Ik wil deze pagina delen met collega's, onder andere op KlasCement.\n\nSchrijf er een korte gebruiksaanwijzing bij voor een leerkracht die mij niet kan vragen hoe het werkt.\n\nGeef me:\n- Een titel en twee zinnen die zeggen wat het is.\n- Voor wie het bedoeld is: [LEERJAAR EN VAK], en bij welk leerplandoel het past: [LEERPLANDOEL].\n- Wat de leerling doet, in 3 stappen.\n- Hoeveel lestijd het ongeveer kost: [AANTAL MINUTEN].\n- Wat je nodig hebt: toestellen, internet, of niets van dat alles.\n- Eén zin over wat een collega zelf makkelijk kan aanpassen.\n\nBaseer je op het bestand zelf, niet op mijn beschrijving. Gewone taal, geen technische termen, maximaal een half A4.",
            uitleg: "De truc zit in \"baseer je op het bestand zelf\": zo krijg je een beschrijving van wat je pagina écht doet, en merk je meteen als er iets anders in zit dan je dacht. \"Voor een leerkracht die mij niet kan vragen hoe het werkt\" haalt er alle vanzelfsprekendheden uit die enkel voor jou vanzelfsprekend zijn.",
          },
        ],
      },
      {
        id: 'app-op-telefoon',
        titel: 'Als app op de telefoon',
        minuten: 40,
        intro: 'Je zet je oefenpagina als pictogram op het startscherm, zodat ze met één tik opent, en test wat er zonder netwerk werkt.',
        onthoud: 'Zonder netwerk werkt je pictogram alleen als je de pagina daarvoor liet aanpassen, en dan enkel wat al geladen was. Geef ze pas mee naar huis als dezelfde oefening ook op papier bestaat.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'In de basislessen hiervoor bouwde je een oefenpagina en zette je die online. In de klas begint het dan telkens met hetzelfde kwartiertje: de link op het bord, 24 leerlingen die hem overtypen, drie die een letter missen, en twee die intussen op iets helemaal anders zijn beland. De volgende les mag je dat overdoen. Dat kan anders: je pagina kan als pictogram op het startscherm van een toestel staan, naast de andere apps, en dan is het <strong>één tik</strong>. Je hoeft daarvoor niets uit een app-winkel te halen — het zijn vier handelingen die op de meeste toestellen op ongeveer dezelfde manier verlopen.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Open je pagina in de browser van het toestel zelf.</strong> Met de link van je pagina online, dus — die uit de les <em>Online zetten</em>. Een bestand dat je doorstuurde, werkt hiervoor niet.',
              '<strong>Open het menu van de browser.</strong> Dat is hetzelfde menu waar ook afdrukken en delen in zitten.',
              '<strong>Kies de optie die de pagina aan het startscherm toevoegt.</strong> Hoe die precies heet, verschilt per toestel en per browser en verandert geregeld, maar er staat bijna altijd het woord <em>startscherm</em> of <em>installeren</em> in. Vind je niets, probeer het dan in de browser die standaard op het toestel staat — daar lukt het meestal wel. Lukt het ook daar niet, dan staat het op dat toestel waarschijnlijk uitgeschakeld; dat regelt je ICT-coördinator, niet jij.',
              '<strong>Geef ze een korte naam en sluit de browser.</strong> Die naam komt onder het pictogram te staan, dus een lange wordt afgekapt. Open ze daarna vanaf het startscherm. Liet je je pagina al aanpassen met de prompt hieronder, dan opent ze schermvullend, zonder adresbalk erboven. Deed je dat nog niet, dan opent ze gewoon als webpagina mét adresbalk — het pictogram werkt dan al wel, en dat is dus geen fout van jou.',
            ],
            geordend: true,
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Geen app-winkel, geen goedkeuring',
            inhoud: 'Wat er op het startscherm komt, is in de kern <strong>dezelfde webpagina, met een eigen naam en een eigen pictogram</strong>. Dat is goed nieuws: er passeert geen app-winkel, er is geen versie die iemand moet goedkeuren, en het neemt zo goed als geen plaats in op het toestel. Op gsm, tablet en chromebook lukt dit zo goed als altijd. Op een gewone laptop kan het meestal ook, maar dan komt je pagina bij de andere programma\'s te staan in plaats van op een startscherm, en daar doet niet elke browser mee. Toestellen die de school centraal beheert, kunnen het afgezet hebben — daarvoor bestaat je ICT-coördinator. En wie het niet doet, mist niets: dezelfde link blijft gewoon werken in de browser.',
          },
          {
            type: 'tekst',
            inhoud: 'Waar dit bij jullie speelt, hangt af van wat er in de klas ligt. In het lager onderwijs zijn dat meestal de tablets uit de klaskast: zet je maaltafeltrainer één keer op het startscherm van elk toestel en het vierde leerjaar hoeft die link niet meer over te typen. In het secundair is het vaker de chromebook of de gsm van de leerling zelf, en dan doe je het één keer klassikaal voor. Bij de eerste les Frans zet je het samen op het smartboard, zetten de leerlingen die dat willen de woordenschattrainer op hun startscherm, en de rest opent gewoon de link. Twee dingen test je op voorhand op één toestel, vóór je het aan een hele klas vraagt. Blijft de snelkoppeling staan na een herstart? Toestellen die door meerdere klassen gedeeld worden, worden soms automatisch teruggezet. En houdt je pagina iets bij op dat toestel — een score, waar de leerling gebleven was — dan vindt de volgende leerling dat terug. Bij een oefenscore is dat onschuldig, maar hou er rekening mee: een gedeeld toestel vergeet niets uit zichzelf.',
          },
          {
            type: 'prompt',
            titel: 'Laat het eruitzien als een app',
            tekst: 'Ik heb een oefenpagina online staan en ik wil dat leerlingen ze op het startscherm van hun toestel kunnen zetten, zodat ze opent als een gewone app.\n\nPas mijn pagina daarvoor aan:\n- Naam onder het pictogram: [KORTE NAAM, HOOGSTENS 12 TEKENS].\n- Een eenvoudig pictogram: [KLEUR] met daarop [EEN LETTER, EEN CIJFER OF EEN EENVOUDIG SYMBOOL]. Het moet herkenbaar zijn op een klein scherm.\n- Ze opent schermvullend, zonder adresbalk.\n- Ze blijft werken zonder netwerk, zolang de leerling ze al een keer met verbinding geopend heeft.\n- Pas ik de pagina later aan, dan ziet de leerling dat de eerstvolgende keer dat hij ze met verbinding opent: toon kort "Er is een nieuwe versie" met een knop om te vernieuwen, in plaats van stil de oude te blijven tonen.\n- Verander niets aan hoe de oefening zelf werkt.\n\nHeb je daarvoor extra bestanden nodig naast mijn HTML-bestand, maak ze dan aan en zeg me welke bestanden samen online moeten staan.\n\nIk ben leerkracht en geen programmeur. Leg me achteraf in gewone taal uit wat ik op mijn eigen gsm doe om ze op het startscherm te krijgen, en wat er gebeurt als ik de pagina later aanpas.',
            uitleg: 'Drie regels doen hier het meeste werk. <strong>Verander niets aan hoe de oefening zelf werkt</strong> ken je al uit het basisspoor: zonder die zin herschrijft de AI soms ook je geteste oefening. <strong>Zolang de leerling ze al een keer met verbinding geopend heeft</strong> is geen slag om de arm, maar de eerlijke werkelijkheid — zie het kader hieronder. En de regel over een nieuwe versie vraag je omdat je pagina anders de oude versie op het toestel blijft tonen: verbeter jij een foute oefening, dan ziet een deel van je klas die fout gewoon nog staan en denken ze dat jij je vergist. Merk ook waarom er een pictogram van één kleur met een letter of symbool gevraagd wordt: dat maak je zelf en er hangt niemands auteursrecht aan. Het logo van je school vraag je even, en een afbeelding die je ergens vond, zet je er niet zomaar op. Let ten slotte op de vraag naar extra bestanden: tot nu hield je alles in één bestand, en hiervoor kan dat meestal niet meer. Geen probleem, zolang jij wéét welke bestanden samen online moeten staan. Vraag dat dus expliciet, want vergeet je er later één, dan valt je pictogram of het offline openen weg — je pagina zelf blijft gelukkig gewoon werken, maar je zoekt je een halve avond blind naar wat er scheelt.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Zonder netwerk werkt enkel wat er al geladen was',
            inhoud: 'Het blijft dezelfde webpagina, en dat merk je zodra het netwerk hapert. De eerste keer heeft de leerling altijd verbinding nodig. Daarna werkt wat er al binnengehaald was — de oefening zelf, de tekst, de afbeeldingen — ook zonder netwerk, tenminste als je je pagina daar met de prompt hierboven voor liet aanpassen. Wat níét meer werkt: alles wat je pagina onderweg nog moet ophalen, en dus ook een ingebouwde AI-functie zoals in de module <em>AI inbouwen in je eigen tool</em>. Er hangt één ding aan vast dat je beter vooraf weet: precies omdat de oude versie op het toestel bewaard blijft, zien leerlingen die soms nog even nadat jij de pagina online aanpaste — óók mét verbinding. Vroeg je in de prompt hierboven om een melding bij een nieuwe versie, dan krijgen ze die te zien zodra ze de app met verbinding openen. Blijft het toch bij de oude versie, dan helpt de app helemaal sluiten en opnieuw openen. Pas je iets aan, zeg dat er dus bij in de klas. En test het geheel één keer zelf: zet je gsm in vliegtuigmodus en open je pictogram. Wat jij daar ziet, is precies wat je leerlingen zien in dat ene lokaal waar het netwerk het nooit doet — en dan weet je vooraf of je plan B nodig hebt.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Naar huis meegeven? Dan ook op papier',
            inhoud: 'Een pictogram op het startscherm maakt het verleidelijk om te zeggen: <em>zet ze thuis ook maar op je gsm</em>. Hou daar dezelfde afspraak bij als voor elke link die je meegeeft: <strong>je geeft ze pas mee als dezelfde oefening ook op papier bestaat</strong>. Niet elke leerling heeft thuis een toestel of genoeg data, en dat zie je niet aan een klas. Laat punten of een verplichte taak dus nooit van zo\'n link afhangen, en verplicht niemand om iets op een privétoestel te zetten. Wie het wil, doet het; wie de papieren versie neemt, maakt exact dezelfde oefening. Zo blijft het een hulpmiddel en geen voorsprong voor wie thuis toevallig meer heeft staan.',
          },
          {
            type: 'opdracht',
            titel: 'Zet je eigen app op je eigen gsm',
            inhoud: 'Twintig minuten, en je eigen bouwsel staat als pictogram op je gsm — plus drie regels uitleg die je zo aan je klas kan meegeven. Onderweg test je meteen het eerlijke deel: wat er nog werkt als het netwerk wegvalt.',
            stappen: [
              'Neem de link van je pagina online erbij, die uit de les Online zetten. Staat je project nog enkel als bestand op je laptop, zet het dan eerst online: zonder link lukt de rest niet.',
              'Vraag Claude met de prompt hierboven om een naam en een pictogram, en om je pagina te laten werken als het netwerk wegvalt. Zet de nieuwe versie online — alle bestanden die erbij horen — en open de link op je eigen gsm.',
              'Voeg de pagina via het menu van je browser toe aan je startscherm, sluit de browser helemaal en open ze vanaf het pictogram. Opent ze schermvullend? Is de naam onder het pictogram nog volledig leesbaar? Is ze afgekapt, vraag dan een kortere naam.',
              'Zet je gsm in vliegtuigmodus en open ze opnieuw vanaf het startscherm. Noteer wat nog werkt en wat niet: dat is precies wat je leerlingen zien in een lokaal zonder netwerk.',
              'Zet het netwerk weer aan en schrijf drie regels voor je leerlingen: hoe ze de pagina op hun startscherm zetten, wat er zonder netwerk nog werkt, en wat ze doen als jij de oefening later aanpast — op de melding over een nieuwe versie klikken, en anders de app helemaal sluiten en opnieuw openen. Zet er één zin bij over de papieren variant, zodat wie thuis geen toestel heeft dezelfde oefening kan maken.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'vibe-data',
    icoon: '🗄️',
    titel: 'Gegevens, privacy en versiebeheer',
    ondertitel: 'Wanneer je app iets moet onthouden — en hoe je dat in orde houdt met de regels.',
    niveau: 'Gevorderd',
    doelen: [
      'Je beslist bewust of je app gegevens moet bewaren.',
      'Je kent de Vlaamse spelregels rond leerlinggegevens.',
      'Je houdt versies bij zonder je werk kwijt te raken.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet.',
      'Een werkend Claude-account en je eigen app uit de module Je eerste webapp bouwen.',
      'Een GitHub-account, vooraf aangemaakt en één keer uitgeprobeerd.',
      'Publiceer je via Netlify of Vercel, hou dat account dan bij de hand om GitHub eraan te koppelen. Gaat het via GitHub Pages, dan volstaat je GitHub-account.',
    ],
    lessen: [
      {
        id: 'wanneer-data',
        titel: 'Heb je opslag echt nodig?',
        minuten: 10,
        intro: 'Je beslist of je app iets moet onthouden, en zo ja, waar: in de browser of in een echte database.',
        onthoud: 'Vraag je eerst af of het echt moet, en voor wie. Is dat enkel de leerling op hetzelfde toestel, dan volstaat opslag in zijn browser.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Zodra je app iets moet <em>onthouden</em> nadat het tabblad dicht is, wordt het complexer. Hoe complex het wordt, hangt af van wie het achteraf moet kunnen zien: enkel diezelfde leerling op datzelfde toestel, of jij, thuis, voor je hele klas. Pas bij dat tweede komen een database en privacyregels kijken. Stel jezelf dus eerst de vraag of het echt moet, en zo ja: voor wie.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Geen opslag nodig:</strong> oefenen, quizzen, visualiseren, berekenen, groepen verdelen. Verreweg de meeste klastools.',
              '<strong>Opslag in de browser</strong> (blijft op het toestel van de leerling, gaat nergens heen): een score onthouden tussen twee sessies, waar de leerling gebleven was. Vaak de gulden middenweg.',
              '<strong>Echte database nodig:</strong> jij wil als leerkracht resultaten van je hele klas zien, of leerlingen moeten samenwerken aan hetzelfde. Pas hier begint het echte werk.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De tussenstap die niemand kent',
            inhoud:
              'Vraag: <em>"Bewaar de voortgang in de browser van de leerling zelf, niet op een server."</em> De leerling vindt zijn score terug, er vertrekt geen enkel gegeven naar buiten, en je hebt geen privacyprobleem. Voor veruit de meeste klastools volstaat dit.',
          },
          {
            type: 'tekst',
            inhoud:
              'Heb je tóch een echte database nodig, dan is <strong>Supabase</strong> een gangbare keuze: gratis voor kleine projecten, en de AI kan je er stap voor stap doorheen loodsen. Reken op een extra sessie werk — dit is geen namiddagklusje meer. Eén ding zet je bij het aanmaken meteen goed: kies een regio in Europa. Bij zo\'n dienst ligt die keuze doorgaans vast zodra je project bestaat — later verhuizen betekent opnieuw beginnen met een nieuw project en al je gegevens overzetten.',
          },
        ],
      },
      {
        id: 'leerlingdata-veilig',
        titel: 'Leerlinggegevens: de Vlaamse spelregels',
        minuten: 15,
        intro: 'Je leert welke spelregels gelden zodra je zelfgebouwde app gegevens van leerlingen bijhoudt, en wat er nooit in hoort.',
        onthoud: 'Bouw zonder echte namen: een klasnummer of bijnaam volstaat meestal. Kan iemand, ook jij, die nog aan een leerling koppelen, leg het dan eerst voor aan de DPO van je scholengroep.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Zodra je gegevens van leerlingen bijhoudt in iets dat je zelf bouwde, is dat een verwerking van persoonsgegevens onder de <strong>GDPR</strong>, de Europese privacywetgeving die ook voor scholen geldt. Dat is geen reden om niets te doen, maar wel om het juist aan te pakken — en niet in je eentje. Ben je directeur of beleidsmedewerker en bouw je iets met gegevens van leerlingen of personeel voor de hele school, lees dan ook de module <em>Zelf bouwen met schoolgegevens</em> in het spoor <em>Het kader</em>.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Praat met de DPO van je scholengroep</strong> vóór er echte leerlinggegevens in je tool gaan, niet pas als hij al draait. Dat is precies waarvoor die functie bestaat: meedenken over hoe het wél kan. Kort mag, als het maar vooraf is.',
              '<strong>Kies een server in Europa.</strong> Vraag in je prompt expliciet om een regio binnen de EU, en controleer het achteraf bij de dienst zelf. Buiten de EU kán het wettelijk, maar dan moet de school nagaan of die doorgifte gedekt is, en soms komen er afspraken bij die de school maakt en niet jij — nog een reden om het eerst met je DPO te bespreken.',
              '<strong>Check je schoolbeleid.</strong> Veel scholen hebben afspraken over welke tools mogen — die gelden ook voor wat je zelf bouwt.',
              '<strong>Verzamel zo weinig mogelijk.</strong> Heb je een naam nodig, of volstaat een klasnummer of zelfverzonnen bijnaam? Meestal het laatste.',
              '<strong>Zorg dat je kan wissen.</strong> Je moet gegevens kunnen verwijderen als iemand daarom vraagt.',
              '<strong>Blijft in de schoolsystemen:</strong> zorg- of medische gegevens, verslagen van het CLB, thuissituaties. <strong>Niet op eigen houtje:</strong> punten die meetellen; die hou je enkel samen met je scholengroep bij in een zelfbouwtool. Lost het schoolsysteem jouw nood niet op, breng die dan naar je scholengroep in plaats van er alleen iets naast te bouwen.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'De veilige standaard',
            inhoud:
              'Bouw zonder echte namen, tenzij het écht niet anders kan. Leerlingen kiezen zelf een bijnaam, of werken met hun klasnummer. Didactisch heb je dan alles wat je nodig hebt, en er staat geen naam meer in je tool — dat scheelt enorm. <strong>Echt anoniem</strong> is het pas als niemand, jij ook niet, de link naar een leerling nog kan leggen. Kan jij dat wel, dan blijven het leerlinggegevens: geen reden om het niet te doen, wel om het één keer voor te leggen aan je DPO in plaats van er zelf over te beslissen.',
          },
          {
            type: 'quiz',
            vraag: 'Je wil zien welke leerlingen vastlopen op je oefenapp. Wat is de verstandigste aanpak?',
            opties: [
              {
                tekst: 'Leerlingen laten inloggen met hun schoolaccount.',
                juist: false,
                feedback:
                  'Zwaarste optie, en meteen volop persoonsgegevens. Zelden nodig voor wat je eigenlijk wil weten.',
              },
              {
                tekst: 'Leerlingen een klasnummer of bijnaam laten kiezen.',
                juist: true,
                feedback:
                  'Juist, dit is de werkbare middenweg. Eén nuance: zolang jij weet wie nummer 12 is, blijven het persoonsgegevens — goed afgeschermd, maar niet anoniem. Wat je wint, is dat er geen naam meer in je tool staat en dat wie toevallig meekijkt er niets aan heeft. Dat gesprek vooraf met de DPO van je scholengroep blijft dus staan.',
              },
              {
                tekst: 'Niets bijhouden en rondlopen in de klas.',
                juist: false,
                feedback:
                  'Perfect verdedigbaar — maar je verliest het overzicht dat je net zocht. De middenweg hierboven combineert de twee: je loopt rond in de klas én je ziet achteraf wie vastliep.',
              },
            ],
          },
        ],
      },
      {
        id: 'versiebeheer',
        titel: 'Versiebeheer zonder gedoe',
        minuten: 40,
        intro: 'Je leert versies bijhouden, met genummerde bestanden of met GitHub, en beslist bewust wat je app onthoudt.',
        onthoud: 'Bewaar elke versie met een nummer erin. Op GitHub hoort niets wat niet openbaar mag: ook wat je later weghaalt, blijft in een vorige versie staan.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Vroeg of laat overkomt het je: een nieuwe versie is slechter dan de vorige, en die vorige ben je kwijt. <strong>Versiebeheer</strong> lost dat op — je kan altijd terug naar hoe het was.',
          },
          {
            type: 'tekst',
            inhoud:
              '<strong>GitHub</strong> is in gewone taal een website waar je je bestanden bewaart en waar bij elke wijziging een kopie van de vorige versie blijft staan, met de datum erbij. Je kan dus altijd terug naar hoe het vorige week was, zonder dat je zelf kopieën met een nummer bijhoudt. Je maakt er een gratis account aan en je zet je project erop; daarna werk je gewoon verder zoals je gewend bent. Eén keuze maak je daarbij bewust: bij het aanmaken vraagt GitHub of je project <strong>publiek</strong> of <strong>privé</strong> komt te staan, en publiek staat er meestal al aangeduid. Publiek betekent dat iedereen op het internet je bestanden kan lezen — en doordat elke vorige versie bewaard blijft, ook alles wat je er ooit in zette en daarna weghaalde, zoals een klaslijst of een geheime code. Zet er dus nooit iets in dat niet openbaar mag zijn. Publiceer je via Netlify of Vercel, dan mag je project gerust privé staan; doe je het met GitHub Pages, dan moet het op een gratis account publiek staan — en telt die regel dubbel. Eerlijk vooraf: dit is het technisch lastigste stuk van dit spoor en het kost je de eerste keer makkelijk een uur. Doe het op een moment dat je niet gehaast bent, en sla het gerust over tot je merkt dat je versies met nummers je te veel worden — voor één oefenpagina is dat misschien nooit. Loop je vast, dan is stap drie van <em>Als je er na drie keer niet uit raakt</em> ook hier het snelste antwoord: een nieuw gesprek, en zeg wat je wél op je scherm ziet staan.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Minimale versie:</strong> bewaar bestanden met een nummer erin en gooi niets weg. Werkt verrassend goed voor kleine projecten.',
              '<strong>Nette versie:</strong> <strong>GitHub</strong>. Elke wijziging wordt bijgehouden, je kan altijd terug, en je kan het combineren met automatisch online zetten.',
              '<strong>Bonus:</strong> zet je project op GitHub, koppel het aan Netlify of Vercel, en elke aanpassing staat vanzelf online. Eén keer instellen, daarna nooit meer omkijken.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Laat je begeleiden bij GitHub',
            tekst:
              'Ik ben leerkracht, geen programmeur, en ik heb nog nooit met GitHub gewerkt. Ik heb één HTML-bestand dat ik online wil zetten en waarvan ik de versies wil bijhouden.\n\nLeg me stap voor stap uit hoe ik dat doe, in gewone taal, zonder vakjargon. Zeg bij elke stap wat ik precies zie op het scherm en waar ik moet klikken.\n\nGa uit van nul: ik heb nog geen account.',
            uitleg:
              '"Zeg bij elke stap wat ik zie op het scherm" is de zin die technische uitleg bruikbaar maakt voor niet-technische mensen. Gebruik hem overal. Eén ding hoort erbij: diensten als GitHub wijzigen hun schermen geregeld, dus het kan best dat een knop anders heet dan wat je te horen krijgt. Dat is geen fout van jou. Antwoord dan gewoon met wat je wél ziet — "die knop vind ik niet, ik zie wel dit en dit staan" — of stuur een schermafbeelding mee. Meestal ben je er dan in één ronde uit.',
          },
                  {
            type: "opdracht",
            titel: "Beslis wat je app onthoudt",
            inhoud: "Neem je eigen project erbij en maak die keuze bewust in plaats van per ongeluk — ook als de uitkomst is dat je niets bewaart. Je eindigt met een app die niet meer bijhoudt dan nodig, en met vijf regels op papier die zeggen wat er wél bewaard wordt.",
            stappen: [
              "Schrijf op wat jouw app zou moeten onthouden nadat de leerling het tabblad sluit. Schrap daarna alles waar je les even goed zonder kan — vaak blijft er niets over, en dat is een prima uitkomst.",
              "Duid bij wat overblijft aan waar het thuishoort: nergens, in de browser van de leerling, of in een echte database. Kom je bij een echte database uit, hou dat dan voor een aparte werksessie — dat is een halve dag werk op zich. Lees eerst de verdiepingsles \"Een echte database koppelen\" verderop in deze module: die zegt je of je er echt een nodig hebt.",
              "Blijft er iets over? Vervang elke verwijzing naar een leerling door een klasnummer of een zelfgekozen bijnaam. Blijft er niets over? Vraag Claude te bevestigen dat je pagina echt nergens iets wegschrijft, en waar je dat in je bestand ziet.",
              "Bewaar je iets, vraag Claude dan om je app zo aan te passen, met een knop waarmee de leerling zijn eigen gegevens wist — en klik die knop meteen zelf aan. Bewaar in beide gevallen het resultaat onder een nieuw versienummer, zodat je terug kan als er iets stukgaat.",
              "Vat in vijf regels samen wat je bewaart, waar het staat en hoe het verdwijnt. Staat er iets in dat naar een leerling verwijst, dan is dat blaadje je vertrekpunt voor een gesprek met de DPO van je scholengroep: vooraf, om mee te denken, en vóór je app in de klas iets bijhoudt.",
            ],
          },
        ],
      },
      {
        id: 'echte-database',
        titel: 'Een echte database koppelen',
        minuten: 30,
        intro: 'Je zoekt uit of je echt een database nodig hebt, en wat je vooraf regelt rond regio, codes en toegangsregels.',
        onthoud: 'Probeer eerst zonder database. Blijft er toch een nodig, praat dan met de DPO van je scholengroep en je ICT-coördinator vóór er één leerlinggegeven in gaat.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'In de basislessen hiervoor bouwde je een pagina die niets bijhoudt, en misschien eentje die de voortgang <em>in de browser van de leerling</em> bewaart — op dat ene toestel, en nergens anders. Voor de meeste klastools is dat genoeg. Tot je op zoiets botst: je geeft Frans in het derde jaar en wil na de woordenschatoefening op je <strong>eigen</strong> scherm zien welke woorden je klas structureel mist, maar die gegevens zitten verspreid over vierentwintig laptops en je geraakt er niet bij. Of een leerling van het vijfde leerjaar oefende op de klascomputer en wil thuis verder waar hij gebleven was, en op de tablet thuis staat uiteraard niets. Dan volstaat opslag in de browser niet meer. Dan kom je uit bij een echte database — en dat is precies de stap die deze les eerlijk wil kaderen, want hij is groter dan hij lijkt.',
          },
          {
            type: 'tekst',
            inhoud: 'Een <strong>database</strong> is in gewone taal niets anders dan <strong>een tabel die ergens anders bewaard blijft dan op het toestel van de leerling</strong>: bij een dienst op het internet. Denk aan een blad in Excel — één rij per poging, met kolommen voor welk klasnummer, welke oefening, hoeveel juist, en wanneer. Elk toestel schrijft in diezelfde ene tabel, en elk toestel kan ze weer opvragen. Dat is het hele idee. Wat het <em>niet</em> is: een knop die je even aanzet. Reken op een aparte werksessie om het één keer goed te zetten — een namiddag is daarvoor een optimistische schatting, en die tijd gaat niet naar je les. De meeste ideeën uit dit spoor hebben het ook niet nodig — dat is geen zwaktebod, dat is de normale uitkomst.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Moet iemand anders dan de leerling zelf dit kunnen zien?</strong> Is het antwoord nee, dan volstaat opslag in de browser. De leerling vindt zijn score terug, er vertrekt geen enkel gegeven naar buiten, en jij hebt niets te regelen.',
              '<strong>Moet het terug te vinden zijn op een <em>ander</em> toestel?</strong> Opslag in de browser blijft op het toestel waar ze gemaakt is. Begint een leerling op de klascomputer en werkt hij thuis verder, dan lukt dat niet. Hetzelfde geldt voor een klas met gedeelde chromebooks, waar niemand twee keer na elkaar hetzelfde exemplaar meekrijgt.',
              '<strong>Werken leerlingen samen aan hetzelfde?</strong> Een bord waar de hele klas woorden op zet, een stemming, een gezamenlijke tijdlijn: dan moet alles wel op één plek samenkomen.',
              '<strong>Drie keer nee?</strong> Dan heb je geen database nodig, ook al voelt het alsof je iets mist. Bouw verder zonder. Je kan er later altijd nog een aan koppelen, en tegen dan weet je veel preciezer wat je er eigenlijk in wil.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Het lichtere alternatief dat vaak volstaat',
            inhoud: 'Je wil zien hoe het bij je klas liep, en dat is een terechte wens — dat ís goed lesgeven. Alleen kan overzicht ook zonder database. Laat je pagina op het einde een kort resultaat tonen, bijvoorbeeld <em>8 op 10, fout op vier woorden</em>, en laat de leerling dat overnemen in de opdracht op Smartschool of er een schermafbeelding van indienen. Je hebt dan hetzelfde overzicht voor de prijs van één handeling bij de leerling, en je hoeft niets van deze les te regelen. Eerlijk is eerlijk: bij vier klassen van dertig wordt dat handmatig verzamelen vervelend, en dan verdient een database zijn plaats. Maar probeer eerst dit — het kost je tien minuten in plaats van een werksessie.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Een dienst kiezen.</strong> <strong>Supabase</strong> is bijvoorbeeld een gangbare keuze voor kleine schoolprojecten; er bestaan vergelijkbare diensten, en de aanpak is bij elk grotendeels dezelfde. Claude kent zulke diensten goed genoeg om je stap voor stap door de opzet te loodsen, met één kanttekening: schermen en benamingen wijzigen er geregeld, dus loopt de uitleg niet gelijk met wat je ziet, antwoord dan met wat er wél op je scherm staat. Wat je er gratis mag en waar het betalend wordt, verschuift ook geregeld — kijk dat na op het moment zelf, niet op wat een collega vorig jaar vertelde.',
              '<strong>Bij het aanmaken kies je een regio.</strong> Neem er een in Europa. Dat is geen voorkeur die je later bijstelt: bij zo\'n dienst ligt die keuze doorgaans vast zodra je project bestaat. Verhuizen betekent dan een nieuw project aanmaken en al je gegevens overzetten. Eén bewuste klik nu, of een halve dag later. Eén nuance die je erbij moet weten: een Europese regio is nodig, maar op zich niet genoeg. Wie er achter de dienst zit en welke afspraken je school met die dienst heeft, tellen even hard — en dat is precies waarover het kader hieronder gaat.',
              '<strong>Je krijgt twee soorten codes, en maar één ervan mag in je pagina.</strong> Zo\'n dienst geeft je een code die <em>bedoeld</em> is om openbaar te staan: die mag gerust in je pagina, maar hij is enkel veilig zolang de toegangsregels van het volgende punt goed staan. Daarnaast krijg je er een die <em>alles</em> mag — die hoort thuis op een server en nooit in de pagina zelf, net als de sleutel van een AI-functie, en om dezelfde reden: alles in een webpagina is leesbaar voor wie erop staat. Vraag Claude bij elke stap welke van de twee hij gebruikt en waarom. Dat is de vraag waar het bij deze diensten het vaakst misloopt.',
              '<strong>Vraag expliciet om toegangsregels.</strong> Zonder die regels kan wie de openbare code heeft — en die staat dus in je pagina — niet alleen de hele tabel uitlezen, maar er ook rommel in schrijven, bestaande rijen overschrijven en de tabel leegmaken. Dat laatste is het vervelendste: je merkt het pas als er tijdens een les plots niets meer klopt, en een reservekopie heb je bij een gratis project meestal niet. Zet in je prompt wat er wél mag: wegschrijven ja, bestaande rijen wijzigen of wissen nee, de volledige tabel teruglezen nee, en het overzicht van de klas enkel voor jou. Eerlijk erbij: een echte grendel per leerling, zodat iemand enkel bij zijn eigen rij kan, werkt pas als de dienst weet wélke leerling er typt — en dat vraagt een vorm van aanmelden, een stap groter dan deze les. Zolang je die niet hebt, beperkt <strong>zo weinig mogelijk bewaren</strong> wat iemand te zien krijgt; tegen leegmaken helpt enkel dat je niets bewaart wat je niet opnieuw kan maken.',
              '<strong>Wie kan er allemaal aan?</strong> Jij, iedereen met wie je een wachtwoord of een code deelt, en de dienst zelf. Bedenk er meteen bij wat er gebeurt als jij langdurig ziek wordt of van school verandert. Laat de dienst toe om iemand mee als beheerder te zetten, doe dat dan samen met de ICT-coördinator of een collega. Kan dat niet, schrijf dan minstens op waar het project staat en onder welk account, en zorg dat de ICT-coördinator dat blad heeft.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Vanaf hier bouw je dit niet meer alleen',
            inhoud: 'Zolang je pagina niets doorstuurt en niets bewaart, bouw je zelf — binnen het ICT-beleid van je school. Van zodra er gegevens van leerlingen in een database buiten de school terechtkomen, haal je er mensen bij: de <strong>DPO van je scholengroep</strong> én de <strong>ICT-coördinator</strong>, vóór er één leerlinggegeven in gaat. Niet om je idee af te remmen, wel omdat zij dingen kunnen regelen die jij alleen niet kan. Voor zo\'n dienst horen er schriftelijke afspraken te zijn over wat die met de gegevens mag doen — een <strong>verwerkersovereenkomst</strong>, een contract tussen de school en de leverancier. Dat sluit de school af, niet jij persoonlijk, en de DPO weet welke er al zijn en welke niet. De ICT-coördinator weet dan weer of het schoolnetwerk zo\'n dienst doorlaat, en wie er nog bij kan als jij er niet bent. En werkt je tool goed, dan kan je scholengroep helpen om hem ook voor andere klassen of scholen beschikbaar te maken. Hou daarnaast de vuistregel van deze module overeind: <strong>bouw zonder namen, tenzij het echt niet anders kan.</strong> Een klasnummer of een zelfgekozen bijnaam volstaat didactisch bijna altijd. Kan jij die bijnaam nog aan een leerling koppelen, dan blijven het leerlinggegevens — dat mag, maar het is net dát wat je één keer voorlegt in plaats van er zelf over te oordelen.',
          },
          {
            type: 'prompt',
            titel: 'Eerst de afweging, dan pas bouwen',
            tekst: 'Ik ben leerkracht [VAK] in [LEERJAAR] in Vlaanderen en ik ben geen programmeur.\n\nIk heb een oefenpagina gebouwd. Ik overweeg om de resultaten in een echte database te bewaren, omdat: [WAAROM JE HET WIL ZIEN].\n\nDoe drie dingen, in deze volgorde:\n1. Zeg me eerlijk of het ook zonder database kan, en hoe. Kan het zonder, leg dan uit wat ik daarbij inlever.\n2. Kan het niet zonder: geef een stappenplan in gewone taal, met per stap hoeveel tijd het ongeveer kost en wat ik op het scherm zie.\n3. Zeg welke keuzes ik bij het aanmaken meteen goed moet zetten omdat ik er later niet meer op kan terugkomen.\n\nRandvoorwaarden: de gegevens blijven in Europa, geen namen van leerlingen (enkel een klasnummer of een zelfgekozen bijnaam), en ik moet alles kunnen wissen.\n\nZeg me daarbij uitdrukkelijk: welke codes krijg ik van die dienst, welke daarvan mag in mijn pagina staan en welke absoluut niet, en welke toegangsregels zet je zo dat niemand via mijn pagina de hele tabel kan uitlezen, wijzigen of wissen.\n\nKan je iets van wat ik vraag niet echt afdwingen met deze opzet, zeg dat dan met zoveel woorden in plaats van het te laten uitschijnen.\n\nStel me eerst de vragen die je nodig hebt voor je begint.',
            uitleg: 'Punt 1 is het belangrijkste, en meteen het punt dat mensen weglaten. Vraag je het niet, dan bouwt Claude gewoon wat je vroeg — ook als het niet nodig was. De randvoorwaarden laat je in élke prompt hierrond staan: ze kosten je niets en ze houden de fouten tegen die achteraf het duurst zijn. De zin over wat níét afdwingbaar is, staat er om een specifieke reden: vraag je om iets af te schermen, dan krijg je makkelijk een geruststellend antwoord terwijl er enkel een regel bij staat die dat niet waarmaakt. Beter dat je dat nú hoort dan wanneer je klas er al mee werkt. En <em>stel me eerst de vragen die je nodig hebt</em> voorkomt dat je een stappenplan krijgt dat op verkeerde aannames over jouw klas gebouwd is.',
          },
          {
            type: 'opdracht',
            titel: 'Schrijf je gegevensfiche vóór je bouwt',
            inhoud: 'Deze les bouw je niets — je beslist. Je eindigt met één blad waarop staat wat je zou bewaren, waar het staat en hoe het verdwijnt. Dat blad is precies wat de DPO en de ICT-coördinator nodig hebben, en het is ook prima als de uitkomst is: <em>toch geen database</em>.',
            stappen: [
              'Schrijf bovenaan één zin: wat wil je zien dat je vandaag niet ziet, en wat zou je daar in je les concreet mee doen?',
              'Teken eronder je tabel op papier: één kolom per gegeven dat je zou bewaren. Schrap daarna elke kolom waar je les even goed zonder kan, en vervang elke naam door een klasnummer of een zelfgekozen bijnaam.',
              'Zet onder de tabel vier regels: bij welke dienst en in welke regio de gegevens staan, hoe lang ze blijven staan, hoe je ze wist, en wie er buiten jou nog aan kan. Weet je iets nog niet, schrijf dan een vraagteken — dat is een vraag voor je gesprek, geen fout.',
              'Gebruik de prompt hierboven en noteer enkel het antwoord op punt 1: kan het ook zonder database? Volstaat dat alternatief voor wat je in stap 1 opschreef, stop dan hier. Dat is een geslaagde uitkomst en je bent een werksessie rijker.',
              'Blijft de database nodig: mail je blad naar de ICT-coördinator en vraag een kwartier bij de DPO van je scholengroep. Zet in je agenda wanneer je bouwt — na dat gesprek, niet ervoor.',
            ],
          },
        ],
      },
      {
        id: 'projectgeheugen',
        titel: 'Geef je project een geheugen',
        minuten: 30,
        intro: 'Je maakt een projectblad van een half A4, zodat je in een nieuw gesprek niet alles opnieuw hoeft uit te leggen.',
        onthoud: 'Plak je projectblad bovenaan elk nieuw gesprek, en werk het bij op het einde van elke werksessie. Een verouderd blad is lastiger dan geen blad.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'In de basislessen hiervoor bouwde je een oefenpagina — zeg: werkwoordspelling voor je vijfde leerjaar. Drie weken later, op een woensdagnamiddag, wil je er een tweede reeks zinnen bij. Je opent een nieuw gesprek, vraagt die reeks, en krijgt iets terug waarin de feedback enkel met kleur werkt, de knoppen op een gsm half wegvallen en er plots naar de naam van de leerling gevraagd wordt. Er is niets stuk: het is gewoon een <em>nieuw</em> gesprek, en alles wat je de vorige keer afsprak is weg. Dus leg je het opnieuw uit. En de keer daarna nog eens.',
          },
          {
            type: 'tekst',
            inhoud: 'De oplossing is verrassend weinig technisch: <strong>één blad</strong>. Een gewoon tekstbestand naast je app, hooguit een half A4, waarin staat wat je app doet, voor wie, welke afspraken altijd gelden, wat er al werkt en wat er nog moet komen. Begin je een nieuw gesprek, dan plak je dat blad bovenaan vóór je je vraag stelt. Meer is het niet. We noemen het hier je <strong>projectblad</strong>; hoe jij het zelf noemt, maakt niet uit. Hield je bij de opdracht over opslag al vijf regels bij over wat je app bewaart en hoe het verdwijnt, dan hoeft dat geen apart blaadje te blijven: zet het bij de afspraken. Eén blad per project volstaat, en dat is meteen de bedoeling — wat over drie blaadjes verspreid staat, raak je kwijt.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Wat de app doet, en voor wie.</strong> Twee zinnen volstaan: "Oefenpagina werkwoordspelling voor het vijfde leerjaar. De leerling krijgt een zin, vult het werkwoord in en ziet meteen of het juist is." Zet er het leerplandoel bij waar het aan vasthangt.',
              '<strong>De afspraken die altijd gelden.</strong> Het belangrijkste stuk. Geen namen of andere persoonsgegevens, werkt op een gsm én op het smartboard, feedback nooit enkel met kleur, alles in één bestand. Precies de dingen die je anders elk gesprek opnieuw moet zeggen.',
              '<strong>Wat er al werkt en getest is.</strong> Kort opgesomd. Zo begint de assistent niet opnieuw te bouwen wat er al staat, en gaat er niet stilletjes iets kapot dat je net goed had.',
              '<strong>Wat er nog moet komen.</strong> Jouw lijstje, in volgorde van belangrijkheid. Ook voor jezelf handig: je weet meteen weer waar je gebleven was.',
              '<strong>Welk bestand de laatste versie is, en waar het staat.</strong> Eén regel. Nummer je je versies, dan is die regel zo geschreven.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Laat je projectblad opstellen',
            tekst: 'Ik ben leerkracht en ik bouw samen met jou aan een kleine webapp voor mijn klas. Ik wil één blad waarmee ik een volgend gesprek kan beginnen, zodat ik niet alles opnieuw moet uitleggen.\n\nBaseer je op het bestand zelf en op wat we in dit gesprek afspraken. Is dit een nieuw gesprek waarin ik enkel mijn bestand toevoegde, baseer je dan alleen op het bestand en verzin er geen afspraken bij.\n\nSchrijf maximaal een half A4, in gewone taal, met deze vijf stukken:\n1. Wat de app doet, in twee zinnen, en voor wie: [LEERJAAR EN VAK], bij dit leerplandoel: [LEERPLANDOEL].\n2. De afspraken die altijd gelden. Neem zeker mee: geen namen of andere persoonsgegevens, werkt op een gsm en op het smartboard, feedback nooit enkel met kleur. Vul aan met de afspraken die we verder maakten.\n3. Wat er al werkt en getest is.\n4. Wat er nog moet komen, in volgorde van belangrijkheid.\n5. Welk bestand de laatste versie is.\n\nGebruik geen technische termen die ik niet nodig heb. Geef het als tekst die ik kan kopiëren en bewaren.',
            uitleg: '"Baseer je op het bestand zelf" is dezelfde truc als bij een gebruiksaanwijzing voor een collega: je krijgt een beschrijving van wat je pagina <em>écht</em> doet, niet van wat jij denkt dat erin zit. Lees je bij het nakijken iets dat je niet verwachtte — een veld dat om een naam vraagt, een stuk dat niemand gebruikt — dan heb je er meteen twee dingen bij: een projectblad én een opkuis.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Laat het bijwerken vóór je afsluit',
            inhoud: 'Doe dat op het einde van een werksessie, terwijl het gesprek nog alles weet: <em>"Werk mijn projectblad bij met wat we vandaag veranderd hebben en geef het volledig terug."</em> Je plakt het resultaat over je oude blad. Twintig seconden werk, en het is net het moment waarop het vanzelf gaat — volgende week moet je het weer zelf uitzoeken.',
          },
          {
            type: 'tekst',
            inhoud: 'Dit blad is ook nuttig als er geen AI bij komt kijken. Bouwde je een grafiekenoefening voor het derde jaar en geef je die door aan je vakwerkgroep wiskunde — of je werkwoordoefening aan het teamoverleg — dan leest een collega in dertig seconden waarvoor het dient, bij welk leerplandoel het past en wat er bewust <em>niet</em> in zit. Zonder dat blad krijgt die collega een bestand plus jouw mondelinge uitleg — en die uitleg ben je over twee maanden zelf ook kwijt. Zo bekeken is het geen administratie erbij: het is de uitleg die je anders drie keer geeft, één keer opgeschreven. In de module <em>Delen met collega\'s en leerlingen</em> staat een prompt die daar een volwaardige gebruiksaanwijzing van maakt; je projectblad is net het materiaal dat die prompt nodig heeft.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Een blad dat niet meer klopt, is lastiger dan geen blad',
            inhoud: 'De valkuil is voorspelbaar: je maakt het één keer, je werkt drie versies verder, en je blad beschrijft de app van vorige maand. Plak je dat bovenaan, dan bouwt de assistent keurig verder op iets dat niet meer bestaat. Twee dingen houden dat tegen. <strong>Hou het kort</strong> — wat er niet in staat, kan ook niet verouderen; dat ene blad is geen streefdoel maar een grens. En <strong>werk het bij op het einde van een werksessie</strong>, niet tussendoor. Is het toch achterhaald geraakt, dan is dat geen ramp: laat het opnieuw opstellen op basis van het bestand zoals het er nu uitziet, met de prompt hierboven. Dat kost je twee minuten.',
          },
          {
            type: 'opdracht',
            titel: 'Maak het projectblad van je eigen project',
            inhoud: 'Een kwartier werk, en een volgende keer hoef je niet meer uit te leggen wat je vorige maand al uitlegde. Je eindigt met één tekstbestand in dezelfde map als je app — en met de zekerheid dat het werkt, want je test het meteen in een leeg gesprek.',
            stappen: [
              'Open het bestand van je app. Staat het gesprek waarin je eraan werkte nog open, gebruik dat; anders begin je een nieuw gesprek en sleep je je HTML-bestand erin.',
              'Laat met de prompt hierboven een projectblad opstellen.',
              'Lees het na en verbeter het: jij bent de enige die weet wat de bedoeling was. Schrap wat niet klopt en vul aan wat ontbreekt, zeker de afspraak die je in gesprekken het vaakst moet herhalen.',
              'Bewaar het als gewoon tekstbestand in dezelfde map als je HTML-bestand, met een naam die erbij hoort: heet je app oefenapp-v3.html, dan wordt dit oefenapp-projectblad.txt. Zet de datum van vandaag bovenaan. Weet je niet hoe je zo\'n tekstbestand maakt, vraag dat dan gewoon in hetzelfde gesprek.',
              'Test het meteen: begin een nieuw, leeg gesprek, plak je projectblad bovenaan en vraag één kleine aanpassing. Krijg je iets dat aan je afspraken voldoet zonder dat je die opnieuw uitlegde, dan werkt je blad. Zo niet, dan weet je precies welke zin er ontbreekt — voeg die toe en bewaar opnieuw.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'vibe-ai',
    icoon: '🤖',
    titel: 'AI inbouwen in je eigen tool',
    ondertitel: 'Je app zelf laten nakijken, uitleggen of genereren — en wat dat kost.',
    niveau: 'Expert',
    doelen: [
      'Je beoordeelt wanneer een AI-functie zinvol is.',
      'Je begrijpt modelkeuze en kosten op hoofdlijnen.',
      'Je weet waarom een sleutel nooit in je webpagina hoort.',
      'Je weet wat er met de invoer van je leerlingen gebeurt.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet.',
      'Een werkend Claude-account en een werkend project uit de module Gegevens, privacy en versiebeheer.',
      'Een account bij een AI-dienst met een API-sleutel die al vóór je begint is aangemaakt, met tegoed of een betaalmethode erop. Zonder dat loopt je allereerste poging vast op een foutmelding. Probeer die sleutel één keer uit bij de dienst zelf.',
      'Duidelijkheid over wie de kosten draagt. Wil of mag je zelf geen betaalgegevens ingeven, werk dan op een account van de school en spreek af wie het aanmaakt en beheert.',
    ],
    lessen: [
      {
        id: 'wanneer-ai-inbouwen',
        titel: 'Wanneer is het de moeite?',
        minuten: 10,
        intro: 'Je leert wanneer een AI-functie in je app de moeite loont, en wat je regelt voor je eraan begint.',
        onthoud: 'Gebruik AI enkel waar het antwoord niet voorspelbaar is. Regel vooraf wie betaalt en een uitgavenlimiet, en leg de app voor aan je ICT-coördinator en DPO: wat leerlingen typen, gaat naar de AI-dienst.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Tot nu bouwde je apps met vaste inhoud: jij bepaalt de vragen, de app controleert het antwoord. Je kan ook AI <em>in</em> je app steken, zodat die zelf uitleg geeft of open antwoorden beoordeelt. Dat is krachtig, maar het brengt kosten, wachttijd en onvoorspelbaarheid mee.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wat je hiervoor nodig hebt, en wie het betaalt',
            inhoud:
              'Anders dan de rest van dit spoor kost deze module geld. Je hebt een account nodig bij een AI-dienst met een <strong>API-sleutel</strong> — de geheime code uit de les <em>Sleutels en veiligheid</em> — en daar moet tegoed of een betaalmethode op staan, anders strandt je allereerste poging op een foutmelding. Regel drie dingen vóór je begint. <strong>Eén:</strong> maak dat account aan en probeer de sleutel één keer uit bij de dienst zelf. <strong>Twee:</strong> spreek met je directie of schoolbestuur af wie dit betaalt, met je ICT-coördinator erbij. Wil of mag je zelf geen betaalgegevens ingeven, vraag dan een account van de school en spreek af wie het beheert. <strong>Drie:</strong> zet meteen een uitgavenlimiet — hoe je die berekent, staat in de volgende les. Zonder die drie begin je hier beter niet aan: de rest van dit spoor kan je gerust zelf beslissen, deze module niet.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Zinvol:</strong> uitleg op maat bij een fout antwoord, een open antwoord inhoudelijk beoordelen, oneindig nieuwe oefeningen genereren, een gesprekspartner om een taal mee te oefenen.',
              '<strong>Niet zinvol:</strong> alles wat je met een vaste lijst kan oplossen. Een AI om te controleren of 7 × 8 = 56 is verspilling — trager, duurder en minder betrouwbaar.',
              '<strong>Vuistregel:</strong> is het antwoord voorspelbaar, gebruik dan gewone code. Enkel bij open, onvoorspelbare invoer verdient AI zijn plaats.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Een AI in je app kan ook fout zijn',
            inhoud:
              'Bouw je een uitlegfunctie in, dan kan die soms iets fout uitleggen — zonder dat jij erbij bent om het recht te zetten. Presenteer het aan leerlingen dus als hulp, niet als waarheid, en zet er expliciet bij dat het om AI-uitleg gaat.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Wat je leerlingen typen, vertrekt naar buiten',
            inhoud:
              'Een AI-functie werkt maar op één manier: alles wat een leerling in jouw app typt, gaat naar de AI-dienst achter jouw sleutel — ook als je app zelf niets bewaart. In een open invulveld typt vroeg of laat iemand een naam of iets persoonlijks. Hou het veld dus zo klein mogelijk, zeg bij de opdracht uitdrukkelijk dat er geen namen of persoonlijke dingen in mogen, en leg zo\'n app één keer voor aan je ICT-coördinator en de DPO van je scholengroep vóór een klas ermee werkt. Een app die niets doorstuurt en niets bewaart, beslis je gerust zelf.',
          },
        ],
      },
      {
        id: 'modellen-en-kosten',
        titel: 'Modellen en kosten',
        minuten: 20,
        intro: 'Je leert wat een model is en hoe je per gebruik betaalt, en rekent uit wat jouw klassen op een maand kosten.',
        onthoud: 'Kies voor eenvoudig werk een klein, snel model (het model is de motor achter de AI). Zet een uitgavenlimiet vóór de eerste leerling de link krijgt, en kijk na of ze je echt stopt.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Eerst even dit: het <strong>model</strong> is de motor achter een AI-assistent. De meeste diensten hebben er meerdere — zwaardere die trager en duurder zijn maar beter in moeilijk werk, lichtere die sneller en goedkoper zijn en ruim volstaan voor eenvoudig werk. In een gewoon gesprek staat er al eentje klaar en denk je daar niet over na; bouw je AI in je eigen app, dan duid jij zelf aan welk model je gebruikt. En daar betaal je per gebruik: niet per maand, maar per verwerkt stukje tekst. De bedragen zijn klein, maar met 120 leerlingen die elk twintig keer klikken, tikt dat aan.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Kies een klein, snel model</strong> voor eenvoudige taken. Voor "leg dit foute antwoord uit in twee zinnen" heb je het zwaarste model niet nodig.',
              '<strong>Zet een uitgavenlimiet of laad vooraf een beperkt tegoed op</strong> vóór je iets uitdeelt aan leerlingen. De meeste diensten voorzien een van de twee, maar niet op dezelfde manier — kijk ook na of de limiet je écht stopt of enkel een mailtje stuurt. Zoek dat uit vóór de eerste leerling de link krijgt, niet erna.',
              '<strong>Beperk de lengte</strong> van wat er heen en weer gaat. Kortere antwoorden zijn goedkoper én didactisch vaak beter.',
              '<strong>Test met een handvol leerlingen</strong> voor je het aan alle klassen geeft, en kijk wat het gekost heeft.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Eén toegangspunt voor meerdere modellen',
            inhoud:
              'Diensten zoals <strong>OpenRouter</strong> laten je met één account verschillende AI-modellen aanspreken en je uitgaven op één plek beperken. Handig als je wil vergelijken welk model je taak goed én goedkoop aankan.',
          },
                  {
            type: "opdracht",
            titel: "Reken je kosten uit",
            inhoud: "Een tarief per stukje tekst zegt je niets; wat jouw klassen op een maand kosten wel. Die som maak je één keer, met je eigen aantallen.",
            stappen: [
              "Noteer vier getallen van je eigen school: hoeveel leerlingen je app zullen gebruiken, hoe vaak één leerling per les een antwoord vraagt, hoeveel lessen je dat per maand doet, en hoeveel woorden een vraag met antwoord ongeveer telt. Schat dat tweede getal ruim — leerlingen klikken meer dan je denkt.",
              "Zoek bij je AI-dienst zelf de tarieven van vandaag op. Je vindt er twee: wat je stuurt en wat je terugkrijgt tellen apart. Neem ze over met de datum erbij, want die bedragen schuiven geregeld.",
              "Reken zelf uit hoeveel antwoorden dat per maand worden, en geef Claude dat aantal, je tarieven én hoeveel woorden een vraag met antwoord ongeveer telt. Laat je die lengte weg, dan vult hij er zelf een in of vraagt hij ernaar — en in het eerste geval klopt het bedrag niet voor jouw app. Vraag hem wat het per maand en per schooljaar kost. Laat elke aanname die hij zelf invulde bovenaan zetten, en vraag door als er iets staat dat je niet herkent.",
              "Laat dezelfde som nog eens maken met alle aantallen verdrievoudigd: je app slaat aan en twee collega's doen mee. Het maandbedrag van die tweede som zet je als uitgavenlimiet bij je dienst, niet het eerste. Zet er het jaarbedrag, dan staat je limiet zo hoog dat ze in de praktijk nooit ingrijpt.",
              "Noteer op één blad je twee bedragen met de datum van de tarieven, de limiet die nu staat, en wie dit goedkeurt — directie of schoolbestuur, met je ICT-coördinator erbij. Zonder naam en datum is het geen afspraak maar een voornemen.",
            ],
          },
        ],
      },
      {
        id: 'sleutels-en-veiligheid',
        titel: 'Sleutels en veiligheid',
        minuten: 40,
        intro: 'Je leert waarom je API-sleutel op een server hoort en nooit in je webpagina, en controleert dat vóór je deelt.',
        onthoud: 'Je sleutel hoort op een server, nooit in je pagina: zeg dat elke keer in je prompt. Lekt hij toch, trek hem meteen in en maak een nieuwe aan.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Dit is de belangrijkste les van het hele spoor, en meteen de meest gemaakte fout. Om AI aan te spreken heb je een <strong>API-sleutel</strong> nodig: een lange geheime code gekoppeld aan jouw rekening. Wie hem heeft, kan uitgeven op jouw kosten.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Nooit een sleutel in je webpagina',
            inhoud:
              'Alles in een webpagina is zichtbaar voor wie erop staat — ook je sleutel, ook al zie jij hem niet op het scherm. Zet je hem er toch in, dan kan elke leerling hem uitlezen en op jouw rekening laten lopen. Dit gaat regelmatig mis.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>De sleutel hoort op een server</strong>, niet in de pagina. Diensten als Vercel en Netlify hebben daar een gratis voorziening voor.',
              '<strong>Zeg dit expliciet in je prompt.</strong> Zonder die instructie zet de AI je sleutel soms gewoon in de pagina.',
              '<strong>Zet een uitgavenlimiet</strong> als tweede vangnet.',
              '<strong>Lekt je sleutel toch?</strong> Trek hem meteen in bij de dienst en maak een nieuwe aan. Dat kost twee minuten.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Serverfunctie en omgevingsvariabele, in gewone taal',
            inhoud:
              'Een <strong>serverfunctie</strong> is een klein hulpje dat niet op het toestel van de leerling draait, maar bij de dienst waar je pagina staat. De leerling typt zijn vraag in, die gaat naar dat hulpje, het hulpje praat met de AI en stuurt enkel het antwoord terug. Je sleutel blijft daar achter, in een <strong>omgevingsvariabele</strong>: een apart geheim veld bij die dienst dat nooit mee in de pagina terechtkomt. Je bouwt dat niet zelf — dat is precies wat je in de prompt hieronder aan Claude vraagt.',
          },
          {
            type: 'prompt',
            titel: 'Veilig een AI-functie inbouwen',
            tekst:
              'Ik wil een AI-functie toevoegen aan mijn webapp: [BESCHRIJF WAT DIE MOET DOEN].\n\nBELANGRIJK — veiligheid:\n- Mijn API-sleutel mag NOOIT in de webpagina staan of zichtbaar zijn voor gebruikers.\n- Zet de sleutel in een serverfunctie met omgevingsvariabelen.\n- Beperk de lengte van het antwoord.\n\nIk ben leerkracht en geen programmeur. Leg elke stap uit in gewone taal en zeg wat ik op het scherm zie. Waarschuw me expliciet op elk punt waar ik iets geheim moet houden.',
            uitleg:
              'Het veiligheidsblok laat je gewoon staan in elke prompt hierrond. Het kost je niets en het voorkomt de duurste fout van dit spoor.',
          },
          {
            type: 'quiz',
            vraag: 'Je hebt een app gebouwd met een AI-uitlegfunctie en zet hem online voor je klas. Waar kijk je eerst naar?',
            opties: [
              {
                tekst: 'Of het er mooi uitziet op het smartboard.',
                juist: false,
                feedback: 'Belangrijk, maar niet het eerste. Er staat hier geld op het spel.',
              },
              {
                tekst: 'Of je API-sleutel nergens in de pagina zichtbaar is, en of er een uitgavenlimiet staat.',
                juist: true,
                feedback:
                  'Juist. Dat zijn de twee dingen die je écht geld kunnen kosten. Controleer ze vóór de eerste leerling de link krijgt.',
              },
              {
                tekst: 'Of de uitleg pedagogisch sterk genoeg is.',
                juist: false,
                feedback:
                  'Zeker nakijken, maar een gelekte sleutel is dringender — die loopt door terwijl jij lesgeeft.',
              },
            ],
          },
                  {
            type: "opdracht",
            titel: "Veiligheidscheck vóór je deelt",
            inhoud: "Vóór je link bij leerlingen belandt, loop je de drie punten na die je écht geld kunnen kosten: je sleutel, je uitgavenlimiet en de lengte van de antwoorden. Heb je zelf nog geen AI-functie draaien, doe de check dan mee op het project van een collega die er wel een heeft — de checklist die je overhoudt, gebruik je bij elke volgende versie.",
            stappen: [
              "Vraag Claude om je hele project na te kijken, ook de bestanden die apart worden ingeladen: staat je sleutel ergens in wat de leerling binnenkrijgt? Laat hem antwoorden met ja of nee, en met de plaats waar hij hem vond.",
              "Kijk zelf mee: open de broncode van je pagina — de tekst achter de pagina, in de meeste browsers via een rechtermuisklik of via het menu van je browser — en zoek daarin de eerste vier tekens van je sleutel. Vind je hem hier, of vond Claude hem in stap 1: trek de sleutel meteen in bij je AI-dienst en maak een nieuwe aan. Vind je hem hier niet, dan ben je er nog niet zeker van: een sleutel kan even goed in een apart ingeladen bestand zitten, en net daarvoor diende stap 1.",
              "Zet bij je AI-dienst een uitgavenlimiet op een bedrag dat je zonder pijn kan missen.",
              "Typ als leerling een veel te lang, warrig antwoord in en kijk of het AI-antwoord kort blijft. Blijft het lang, vraag Claude dan om een harde maximumlengte in te bouwen.",
              "Noteer je drie punten — sleutel, uitgavenlimiet, antwoordlengte — met de datum op een blad dat je bij je project bewaart. Stond je sleutel in de pagina, dan is je volgende werksessie duidelijk: hem met Claude naar een serverfunctie verhuizen, met de prompt hierboven.",
            ],
          },
        ],
      },
      {
        id: 'meer-dan-tekst',
        titel: 'Meer dan tekst: beeld, spraak en geluid',
        minuten: 30,
        intro: 'Je beslist wanneer inspreken, voorlezen of een afbeelding laten beschrijven je leerlingen helpt, en wanneer het je leerdoel omzeilt.',
        onthoud: 'Zet spraak of beeld in om een drempel weg te nemen, nooit om het leerdoel te omzeilen. Een stem of foto naar een AI-dienst sturen beslis je niet alleen.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'In de basislessen hiervoor bouwde je een app waarin de leerling typt: iets invullen, op een knop klikken, feedback lezen. Voor de meeste leerlingen werkt dat prima. Maar je kent er ook bij wie het net daar strandt: de leerling met dyslexie voor wie één zin op het scherm krijgen meer moeite kost dan die zin bedenken, of de leerling in het derde jaar die pas sinds vorig jaar in het Nederlands schoolloopt, in de klas al vlot meepraat en toch nog nauwelijks iets neergeschreven krijgt. Allebei weten ze het antwoord vaak wél; ze raken er alleen niet mee in jouw app. Veel AI-diensten kunnen intussen meer dan tekst alleen: ze zetten gesproken taal om in tekst, ze lezen voor, en ze kunnen zeggen wat er op een afbeelding staat. Wat jouw dienst precies aankan, verschilt en verandert — en let op één ding dat vaak wordt overgeslagen: wat je in een chatvenster ziet werken, is niet automatisch iets wat je in je eigen app kan inbouwen. Kijk dat dus na op het moment dat je het nodig hebt. Deze les gaat over beeld en geluid die jouw app <em>binnenkomen</em>: wanneer je dat inzet en, minstens even belangrijk, wanneer niet. Beeld of stemmen laten <em>génereren</em> laten we hier links liggen — dat kost meer, en de vragen rond auteursrecht en rond wiens stem je namaakt zijn vandaag nog niet uitgeklaard.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Inspreken in plaats van typen.</strong> De leerling zegt zijn antwoord hardop en het verschijnt als tekst. Een leerling van het zesde leerjaar vertelt in drie zinnen waarom de ijsbeer het moeilijk krijgt bij een warmer klimaat; uitgetypt was hij daar het halve lesuur mee bezig geweest.',
              '<strong>Laten voorlezen.</strong> De opdracht of de tekst wordt hardop voorgelezen. Waardevol voor wie traag leest — de leestekst van deze week nog eens kunnen beluisteren — en voor oefeningen waarin je net wil dat de leerling <em>hoort</em> hoe iets klinkt, zoals een Franse zin die hij daarna nazegt. Weet wel dat een computerstem geen moedertaalspreker is: klemtoon en intonatie kloppen niet altijd, dus gebruik hem om mee te oefenen en niet als norm.',
              '<strong>Een afbeelding laten beschrijven.</strong> Je stuurt een foto of een tekening mee en je krijgt in tekst terug wat erop staat. In de les biologie fotografeert de leerling zijn schets van een bloem en leest hij welke onderdelen hij vergat te benoemen.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wat de computer verstaat, is niet altijd wat de leerling zei',
            inhoud: 'Spraakherkenning is grotendeels getraind op volwassen stemmen die vlot standaardtaal spreken. Bij kinderstemmen, bij stevig dialect en bij wie het Nederlands nog aan het leren is, gaat er merkbaar meer mis — precies bij de leerlingen voor wie je het wou inzetten. Hetzelfde geldt voor beeld: handgeschreven labels op een schets worden geregeld verkeerd gelezen. Dat is geen reden om het te laten, wel om het zo te bouwen dat een fout <strong>zichtbaar</strong> is: de leerling ziet de omgezette tekst staan en verbetert ze zelf vóór hij verder gaat. En test het één keer met de stem van een leerling uit de groep waarvoor je het bedoelde, niet enkel met de jouwe. Eén ding ligt sowieso vast: een app die uit een stem of een gezicht wil afleiden hoe een leerling zich <em>voelt</em> — gestrest, ongeconcentreerd, gemotiveerd — mag niet in het onderwijs. Dat is Europese wetgeving en geen schoolafspraak, en de reden is dezelfde als hierboven: die inschatting klopt te vaak niet.',
          },
          {
            type: 'tekst',
            inhoud: 'Voor je hier iets van inbouwt komt een vraag die niets met techniek te maken heeft: <strong>wat meet je eigenlijk?</strong> Wil je weten of een leerling verzorgd en correct kan schrijven, dan is inspreken geen hulpmiddel maar een omweg rond precies datgene wat je wou oefenen. Wil je weten of hij een historische bron kan beoordelen of een proefopstelling kan uitleggen, dan is het typen enkel ruis: je meet handigheid met een toetsenbord in plaats van wat je wou weten. Het sterkste tegenargument hoor je meteen: <em>als hij alles mag inspreken, leert hij nooit schrijven.</em> Dat is terecht, en het antwoord is niet dat het wel meevalt — het antwoord is dat je het per opdracht beslist en dat ook hardop zegt. Op de momenten waarop je schrijven oefent, wordt er geschreven; op de momenten waarop je iets anders meet, mag de weg naar het antwoord verschillen. Wie dat onderscheid maakt, kan het ook uitleggen aan de klas, aan de ouders en op het zorgoverleg of de klassenraad.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Zelden iets voor je eerste versie',
            inhoud: 'Een vraag met geluid of beeld erbij kost meestal meer dan dezelfde vraag in tekst, en het duurt doorgaans langer voor er een antwoord terugkomt. Als je alleen aan je keukentafel zit te testen, valt dat niet op; bij vier klassen die er elk een lesuur mee bezig zijn, zie je het op je rekening bij de AI-dienst én in de stilte voor het scherm terwijl de klas staat te wachten. Bouw je eerste versie dus altijd in tekst en zorg dat die goed werkt. Voeg spraak of beeld pas toe als de rest zit én je kan benoemen welke leerling er beter van wordt. En zet je uitgavenlimiet of je vooraf opgeladen tegoed goed vóór je iets uitdeelt — kijk daarbij na of die limiet je écht stopt of enkel een bericht stuurt. Zie de les <em>Modellen en kosten</em> in deze module.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Een stem en een foto zijn persoonsgegevens',
            inhoud: 'Bij tekst kan je nog afspreken dat er geen namen ingetypt worden. Bij spraak en beeld gaat dat niet: de stem van een kind is zélf een persoonsgegeven, en op een foto uit je klas staat vaak iemand herkenbaar — en ook zonder gezicht in beeld volstaat een blad met een naam erop al. Dat naar een AI-dienst sturen is dus een zwaardere beslissing dan een stukje tekst doorsturen, en je neemt ze niet alleen. Wat wél kan: laat de leerling <strong>inspreken met de dicteerfunctie die al in het toestel of de browser zit</strong>, zodat jouw app zelf geen geluid opneemt of doorstuurt en enkel de omgezette tekst verdergaat. Eén nuance die je moet kennen vóór je ze aan iemand uitlegt: zo\'n dicteerfunctie zet het geluid soms om op het toestel zelf en soms bij de maker van het toestel of de browser. Naar de AI-dienst achter jouw sleutel vertrekt er dan niets, maar <em>nergens naartoe</em> is het daarom niet. Vraag één keer na bij je ICT-coördinator hoe dat zit op de toestellen van jouw school, dan weet je het ineens voor al je klassen. Wil je die vraag omzeilen, doe het dan <strong>klassikaal op jouw scherm met jouw schoolaccount</strong>, zodat jij ziet wat er precies vertrekt. Wil je tóch dat leerlingen zelf beeld of geluid doorsturen, leg dat dan eerst voor aan de DPO van je scholengroep.',
          },
          {
            type: 'prompt',
            titel: 'Inspreken zonder de stem door te sturen',
            tekst: 'Ik wil dat leerlingen hun antwoord in mijn webapp kunnen inspreken in plaats van typen.\n\nMijn app doet dit: [BESCHRIJF IN 2-3 ZINNEN WAT DE LEERLING NU DOET].\n\nEISEN:\n- Gebruik de dicteerfunctie die al in het toestel of de browser van de leerling zit.\n- Mijn app neemt zelf geen geluid op, verstuurt zelf geen geluid en bewaart niets; enkel de omgezette tekst wordt gebruikt.\n- De leerling ziet die tekst eerst in een veld staan en kan ze aanpassen voor hij verstuurt.\n- Typen blijft gewoon mogelijk naast inspreken.\n- Werkt het inspreken niet op een toestel, dan blijft de app volledig bruikbaar met het toetsenbord alleen.\n\nIk ben leerkracht en geen programmeur. Leg in gewone taal uit waar de spraak in tekst wordt omgezet — op het toestel zelf of bij een dienst van buitenaf — en op welke toestellen en browsers dit werkt en op welke niet.',
            uitleg: 'De derde eis is didactisch de belangrijkste: de leerling ziet zijn eigen zin staan en verbetert ze zelf. Zo zit er nog altijd lezen en schrijven in de opdracht, wordt inspreken een hulpmiddel in plaats van een omweg, én vang je meteen op wat de computer verkeerd verstond. De laatste eis is er voor de dag waarop het gewoon niet werkt op de toestellen van de school — dan gaat je les nog altijd door. De slotvraag over <em>waar</em> de omzetting gebeurt, is precies de vraag die je ICT-coördinator of je DPO je zal stellen; je kan er maar beter zelf het antwoord op hebben. Vraag Claude achteraf ook uitdrukkelijk na of er ergens in je pagina toch een opname vertrekt: <em>antwoord met ja of nee, en met de plaats waar je het ziet.</em>',
          },
          {
            type: 'opdracht',
            titel: 'Beslis of spraak jouw leerdoel dient',
            inhoud: 'Je beslist voor één concrete opdracht uit je eigen lessen of inspreken of voorlezen daar thuishoort, en je legt die beslissing vast in twee zinnen die je zo aan een collega of een ouder kan voorlezen. Je hebt hier nog geen app met AI voor nodig — enkel je eigen opdracht en een blad papier.',
            stappen: [
              'Neem een opdracht die je de komende weken geeft en schrijf in één zin op wat je ermee wil meten: niet wat de leerlingen doen, wel wat je achteraf over hun kennen en kunnen wil kunnen zeggen.',
              'Zet daaronder wat het typen of schrijven zelf met dat leerdoel te maken heeft. Is het een deel van wat je meet, of enkel de weg naar het antwoord?',
              'Denk aan één leerling voor wie die weg nu de moeilijkste stap is. Schrijf op wat er voor hem verandert als hij mag inspreken of laten voorlezen, wat er voor de rest van de klas verandert, en wat je doet op de dag dat de computer zijn woorden verkeerd verstaat.',
              'Kies de eenvoudigste weg die dat oplost: de dicteerfunctie van het toestel zelf, klassikaal werken op jouw scherm, of pas als laatste een AI-functie in je eigen app. Twijfel je, plak dan je drie antwoorden van hierboven in een gesprek met Claude en vraag naar de eenvoudigste oplossing, met de reden erbij.',
              'Vat je beslissing samen in twee zinnen: wat mag er bij deze opdracht ingesproken worden, en wat blijft geschreven. Lees ze voor aan een collega — struikelt die erover, dan is je onderscheid nog niet scherp genoeg.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De vuistregel',
            inhoud: 'Zet spraak of beeld in om een drempel weg te nemen, nooit om het leerdoel zelf te omzeilen. Loop daarvoor drie vragen af, in deze volgorde: <strong>helpt het mijn leerdoel, of omzeilt het net dat?</strong> Dan: <strong>kan het zonder dat de stem of de foto van een leerling bij een dienst van buitenaf terechtkomt?</strong> En pas daarna: <strong>is het de extra kosten en wachttijd waard?</strong> Drie keer ja en je bouwt het. Eén keer nee en je hebt jezelf een hoop werk bespaard — ook dat is een resultaat.',
          },
        ],
      },
    ],
  },
  {
    id: 'vibe-voorbeeld',
    icoon: '🧪',
    titel: 'Een volledig voorbeeld',
    ondertitel: 'Eén project van het eerste idee tot in de klas, met alle tussenstappen.',
    niveau: 'Doorkijk',
    doelen: [
      'Je ziet de hele weg één keer in samenhang, van lesprobleem tot werkende app.',
      'Je herkent waar het misloopt en hoe je bijstuurt zonder opnieuw te beginnen.',
      'Je haalt je eigen idee door dezelfde stappen.',
    ],
    klaarzetten: [
      'Een laptop — geen tablet.',
      'Een werkend Claude-account.',
      'Voor de opdracht achteraan: je eigen idee, en de app die je in de module Je eerste webapp bouwen al bouwde, als je die hebt.',
    ],
    lessen: [
      {
        id: 'voorbeeld',
        titel: 'Van idee tot werkende versie',
        minuten: 25,
        intro: 'Je volgt één volledig project, een oefenpagina Franse woordenschat, van het idee via de bouwprompt tot twee bijsturingen.',
        onthoud: 'Hou je idee klein en maak de oefening eerst zelf zoals een leerling. Stuur dan bij met concrete voorbeelden en zeg erbij dat verder niets mag veranderen.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Deze les legt één volledig project voor je neer, van a tot z: het idee, de prompts zoals ze echt ingetypt zijn, en wat er onderweg misliep. Bouwde je al een eerste versie van je eigen idee, dan leg je die er het best naast. Begin je hier, dan kan dat ook — je ziet dan eerst de hele weg en haalt er daarna je eigen idee door. Het voorbeeld komt uit het secundair, maar de weg is exact dezelfde voor een oefening rond breuken in het vierde leerjaar of rond de topografie van België in het vijfde.',
          },
          {
            type: 'tekst',
            inhoud: '<strong>Stel: je geeft Frans in het tweede jaar.</strong> Bij elk hoofdstuk hoort een woordenlijst, en elke keer loopt het hetzelfde: de leerlingen leren die lijst de avond voor de toets, kennen ze op woensdag, en zijn ze in november kwijt. De woordjes klassikaal afvragen werkt, maar dan is er één leerling aan het woord en zitten er drieëntwintig te wachten. Op papier laten oefenen kan ook, alleen horen ze pas twee dagen later wat er fout was, en dan is het moment voorbij.',
          },
          {
            type: 'tekst',
            inhoud: 'Dit is om drie redenen een goed eerste bouwidee. Het <strong>komt terug</strong>: elk hoofdstuk heeft een nieuwe lijst, dus wat je één keer bouwt gebruik je vijf keer per jaar in drie klassen. Het <strong>past op één scherm</strong>: één woord, één invulveld, één knop — daar kan weinig aan mislopen. En het is <strong>meteen te controleren</strong>: de leerling weet binnen een seconde of het juist was, en dat is net wat op papier niet lukt. Het idee klein houden is trouwens geen bescheidenheid maar techniek: hoe minder je vraagt, hoe groter de kans dat de eerste versie al bruikbaar is. Woordenschat verwerven en inoefenen staat bovendien gewoon in je leerplan, dus je kan op de vakwerkgroep in één zin zeggen bij welk doel het hoort.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Waar je het klein hield',
            inhoud: 'Vijf dingen gingen er bewust <em>niet</em> in. <strong>Eén hoofdstuk</strong>, niet de woordenlijsten van het hele jaar: één lijst vervangen kost je later tien minuten. <strong>Eén richting</strong>, van het Nederlands naar het Frans: de omgekeerde richting is een andere oefening en dus een ander bestand. <strong>Geen geluid en geen uitspraak</strong>: dat is een project op zich. <strong>Geen inloggen en geen scores die jij achteraf kan bekijken</strong>: daarvoor moeten er gegevens van het toestel van de leerling weg, en dat is een sessie werk apart — zie de module <em>Gegevens, privacy en versiebeheer</em>. Voor deze oefening win je er didactisch bovendien niets mee: de leerling ziet meteen zelf hoe hij ervoor staat. En <strong>geen schermpje om zelf woorden toe te voegen</strong>: de lijst staat gewoon in het bestand, en die vervang je later in één beweging. Dat lijstje van vijf is geen verlies — het is je verlanglijst voor een volgende versie.',
          },
          {
            type: 'prompt',
            titel: 'De bouwprompt, zoals hij ingetypt is',
            tekst: 'Bouw een oefenpagina voor mijn leerlingen.\n\nWAT HET DOET:\nDe pagina toont één Nederlands woord. De leerling typt het Franse woord in een invulveld en klikt op Controleer. De pagina zegt meteen of het juist is en toont daarna het volgende woord. Onderaan staat hoeveel woorden er al geweest zijn van het totaal.\n\nVOOR WIE:\nLeerlingen van 13-14 jaar, tweede jaar secundair, Vlaams onderwijs. Woordenschat van het hoofdstuk over de stad en het restaurant.\n\nDE WOORDENLIJST (Nederlands = Frans):\nde rekening = l\'addition\nhet voorgerecht = l\'entrée\nbestellen = commander\nde kelner = le serveur\nhet nagerecht = le dessert\nde menukaart = la carte\nbetalen = payer\nde fooi = le pourboire\n\nEISEN:\n- Alles in één enkel HTML-bestand (HTML, CSS en JavaScript samen, geen externe bestanden).\n- Werkt zonder internetverbinding.\n- Werkt op een smartboard én op een gsm.\n- Grote, duidelijke knoppen en tekst.\n- Voldoende contrast en een leesbaar lettertype, ook van achteraan de klas.\n- Directe feedback: de leerling ziet meteen of het juist is.\n- Die feedback nooit enkel met kleur: zet er ook een woord of symbool bij.\n- Geen inloggen, geen opslag van persoonsgegevens.\n- Alle instructies in het Nederlands, kort en duidelijk.\n- Zet de woordenlijst helemaal bovenaan in het bestand, op één duidelijke plek, zodat ik ze later makkelijk kan vervangen.\n\nGeef het volledige bestand terug.',
            uitleg: 'Dit is de bouwprompt uit de module <em>Je eerste webapp bouwen</em>, met enkel het bovenste blok ingevuld — de eisen eronder blijven elke keer hetzelfde. Wat HTML, CSS en JavaScript zijn, staat daar ook uitgelegd; je hoeft er niets van te kennen om deze prompt te gebruiken. Twee dingen zijn hier bewust toegevoegd. <strong>De woordenlijst staat in de prompt zelf</strong>, niet in een bijlage: dan kan er niets misgelezen worden. En de <strong>laatste eis</strong> — zet die lijst op één duidelijke plek bovenaan — is de reden dat het volgende hoofdstuk je nog tien minuten kost in plaats van een nieuwe bouwronde. In het echt stonden er 24 woorden in die lijst; hier staan er acht, anders lees je alleen nog woordenschat.',
          },
          {
            type: 'tekst',
            inhoud: 'Een paar minuten later staat er een werkende pagina in het gesprek: een woord, een invulveld, een knop, een tellertje onderaan. Je kan er meteen op klikken, en dat is precies wat je doet — vóór je iets laat aanpassen, maak je de oefening één keer helemaal, zoals een leerling ze zou maken. Dan vallen er vier dingen op. Geen ervan gaat over code; alle vier gaan ze over hoe een leerling de oefening echt maakt.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De woorden komen altijd in dezelfde volgorde.</strong> Na drie beurten kent de leerling de volgorde in plaats van de woorden. Je had het niet gevraagd, en wat je niet vraagt is een gok: soms krijg je het er vanzelf bij, hier niet.',
              '<strong>Het nakijken is te streng.</strong> <code>addition</code> zonder <code>l\'</code> wordt fout gerekend, <code>commander</code> met een spatie erachter ook, en <code>entree</code> zonder accenten evengoed. Didactisch is dat onzin: die leerling kent zijn woord.',
              '<strong>Bij een fout antwoord staat het juiste antwoord er niet bij.</strong> Er verschijnt enkel een kruisje. De leerling weet dus wat hij niet moet typen, maar niet wat het wel is — en oefenen zonder te weten wat juist is, is verloren tijd.',
              '<strong>Enter doet niets.</strong> Wie typt, drukt op Enter; dat is een reflex. Nu moet je bij elk woord met de muis naar de knop. Klein, maar je voelt het bij elk woord opnieuw.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Bijsturing 1 — het nakijken menselijker maken',
            tekst: 'Het nakijken is te streng. Drie voorbeelden van wat er nu misloopt:\n\n- Ik typ "addition" in plaats van "l\'addition" en dat wordt fout gerekend.\n- Ik typ "commander " met een spatie erachter en dat wordt fout gerekend.\n- Ik typ "entree" zonder accenten en dat wordt fout gerekend.\n\nPas het vergelijken van de antwoorden zo aan:\n- Negeer hoofdletters, en negeer spaties vooraan en achteraan.\n- Een antwoord zonder lidwoord reken je juist, maar toon er dan onder: "Juist. Het lidwoord hoort erbij: le serveur."\n- Een antwoord zonder accenten reken je juist, maar toon er dan onder: "Juist. Let op het accent: l\'entrée."\n\nDie twee boodschappen zijn voorbeelden: vul telkens het woord in dat aan de beurt is.\n\nVerander verder niets aan de oefening.',
            uitleg: '<strong>Drie voorbeelden in plaats van "het is te streng"</strong> — daar zit het hele verschil. Je zegt telkens wat je typte en wat er gebeurde, zodat er niets te raden valt. De zin over die twee boodschappen staat er om dezelfde reden: zonder die zin bestaat de kans dat de pagina straks bij élk woord <em>le serveur</em> toont. Let ook op wat je hier <em>niet</em> vraagt: het lidwoord zomaar negeren. Le of la hoort bij het woord, dus je rekent het niet mee maar je toont het wel elke keer. Dat is een didactische beslissing, geen technische — vraag je het omgekeerd, dan bouwt de AI het omgekeerd, en zij weet niet welke van de twee bij jouw leerplan past. De slotzin <em>verander verder niets aan de oefening</em> staat er evenmin voor niets: zonder die zin krijg je soms een pagina terug waarin ook de opbouw herschreven is, en ben je je geteste versie kwijt.',
          },
          {
            type: 'prompt',
            titel: 'Bijsturing 2 — drie dingen in één bericht',
            tekst: 'Drie aanpassingen, en verder verandert er niets aan de pagina.\n\n1. Geef de woorden in willekeurige volgorde. Een woord dat fout was, komt later in dezelfde ronde nog een keer terug.\n2. Bij een fout antwoord: toon meteen het juiste antwoord, met het lidwoord erbij, en laat de leerling het één keer overtypen voor hij naar het volgende woord kan.\n3. Als ik in het invulveld op Enter druk, moet dat hetzelfde doen als klikken op Controleer.\n\nGeef het volledige bestand terug, en zeg er in twee zinnen bij wat je veranderd hebt.',
            uitleg: 'Drie dingen tegelijk mag hier, want het zijn drie <em>losse</em> dingen die elkaar niet in de weg zitten. Zit je met één probleem dat je niet begrijpt, doe dat dan wél apart — anders weet je achteraf niet wat het opgelost heeft. Punt 2 is trouwens geen technische keuze maar een didactische: wie zijn fout één keer uitschrijft, onthoudt ze beter dan wie meteen op verder klikt. Dat soort beslissingen neemt de AI niet voor jou. En dat laatste zinnetje, <em>zeg er in twee zinnen bij wat je veranderd hebt</em>, geeft je een lijstje om gericht te hertesten in plaats van alles opnieuw te doorlopen. Je staat nu op ongeveer drie kwartier werk en hebt iets dat op jouw scherm doet wat het moet doen. Of het ook een klas overleeft, weet je nog niet — dat is de volgende les.',
          },
        ],
      },
      {
        id: 'voorbeeld-in-de-klas',
        titel: 'Van werkende versie tot in de klas',
        minuten: 40,
        intro: 'Je volgt het voorbeeld van de testronde tot in de klas, en haalt daarna je eigen idee door dezelfde weg.',
        onthoud: 'Test als drie verschillende leerlingen en op het echte toestel, niet enkel op je laptop. Kijk ook wat er in je pagina zit dat je nooit vroeg.',
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Je pagina doet wat ze moet doen — op jouw laptop, met jou aan het toetsenbord. Dat is iets anders dan een pagina die het uithoudt in een klas van vierentwintig, op het zesde lesuur. Dus test je eerst, en dat doe je niet door wat rond te klikken. Je maakt de oefening drie keer helemaal, telkens in het hoofd van een andere leerling: <strong>de vlotte</strong>, die alles juist heeft; <strong>de leerling die het niet meteen snapt</strong> en enkel leest wat er op het scherm staat; en <strong>de leerling die alles uitprobeert</strong> — lege velden, dubbelklikken, drie keer na elkaar op Enter. En dan nog één keer op het toestel waarop het écht gebruikt wordt. Dat kost je twintig minuten en levert dit op:',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De vlotte leerling is na vier minuten klaar — en dan?</strong> Het laatste woord is beantwoord, er verschijnt niets, de pagina blijft gewoon staan. Geen overzicht, geen score, geen "wil je de foute woorden opnieuw?".',
              '<strong>De leerling die het niet snapt, weet niet welke richting uit.</strong> Er staat alleen <em>de rekening</em> en een invulveld. Moet daar nu het Franse of het Nederlandse woord in? Jij weet dat, want jij bouwde het. Op het scherm staat het nergens.',
              '<strong>Op Controleer klikken met een leeg veld telt als een fout antwoord.</strong> Wie per ongeluk twee keer klikt, verliest zo woorden zonder ze gezien te hebben — en denkt dat hij het slechter doet dan het is.',
              '<strong>Op de gsm valt het toetsenbord over de knop.</strong> Je typt je antwoord, en Controleer zit onder het toetsenbord. Op je laptop zie je dat nooit; dit is exact waarom je op het echte toestel test.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Alles in één bericht, na de testronde',
            tekst: 'Ik heb de pagina getest en vier dingen lopen mis. Los ze alle vier op en verander verder niets aan de oefening.\n\n1. Als het laatste woord beantwoord is, gebeurt er niets. Toon dan een overzicht: hoeveel juist, hoeveel fout, welke woorden fout waren, en een knop "Oefen enkel de foute woorden opnieuw".\n2. Nergens staat wat de leerling moet doen. Zet boven het invulveld: "Typ het Franse woord."\n3. Als ik op Controleer klik terwijl het veld leeg is, wordt dat als een fout antwoord geteld. Er zou moeten staan "Vul eerst iets in", en hetzelfde woord blijft dan staan.\n4. Op een gsm valt het toetsenbord over de knop Controleer, zodat ik die niet meer zie. Zorg dat het invulveld en de knop zichtbaar blijven als het toetsenbord openstaat.\n\nGeef het volledige bestand terug.',
            uitleg: 'Vier fouten in één bericht, genummerd, en bij elke fout staat wat je deed, wat er gebeurde en wat er had moeten gebeuren. Dat is niet toevallig dezelfde vorm als de opdracht <em>Test als drie leerlingen</em> uit de module <em>Je eerste webapp bouwen</em>: eerst alles verzamelen, dan pas laten oplossen. Wie na elke fout apart bijstuurt, is een halfuur verder en weet niet meer welke versie de goede was. Bewaar trouwens de versie die je net getest hebt vóór je dit bericht verstuurt — dan kan je altijd terug.',
          },
          {
            type: 'tekst',
            inhoud: 'Online zetten is het kortste stuk van het hele project. Je bewaart het bestand met de extensie <code>.html</code>, sleept het naar een gratis dienst om webpagina\'s online te zetten, en krijgt een link terug. De eerste keer ben je daar een halfuur mee bezig omdat je nog een account moet aanmaken; daarna is het vijf minuten. Die link zet je in Smartschool bij het hoofdstuk, en je maakt er een QR-code van voor op het bord — een lange link laten overtypen kost je anders vijf minuten lestijd. Eén ding doe je vóór de les en niet tijdens: open die link één keer op school, op een toestel van de leerlingen en op het schoolnetwerk. Wat thuis vlot werkt, wordt op school soms geblokkeerd. Blijkt dat zo, dan heb je nu nog tijd om je ICT-coördinator te vragen die dienst vrij te geven, en om je plan B klaar te leggen: dezelfde oefening op papier. Daarna geef je hem de laatste tien minuten van je les. En dan zie je vier dingen die je niet had zien aankomen — en die je alle vier iets deden aanpassen.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Ze gingen racen.</strong> De pagina toonde hoe lang ze erover deden — dat had je nooit gevraagd, dat was er vanzelf bij bedacht. Gevolg: gokken in plaats van nadenken, want fout gaat sneller dan denken. Je liet die tijdsmeting weghalen en het racen stopte. Kijk dus ook naar wat er in je pagina zit dat je <em>niet</em> gevraagd hebt: net dat stuurt gedrag.',
              '<strong>Voor twee leerlingen werd het een spellingtoets.</strong> Ze kenden de woorden, maar typten <code>l\'additon</code> en <code>serveure</code> en kregen vier keer na elkaar "fout". Mondeling hadden ze die woorden gewoon gehad. Accenten had je al opgevangen; gewone tikfouten niet. Je liet inbouwen dat één letter verschil "Bijna juist" geeft, met het juiste woord ernaast.',
              '<strong>Per twee werkte beter dan alleen.</strong> Drie leerlingen hadden geen toestel bij, dus zette je die samen. Net die duo\'s zeiden de woorden hardop tegen elkaar — en voor Frans is dat meer waard dan stil typen. Sindsdien doe je het altijd per twee, met één toestel.',
              '<strong>Iemand deed het thuis nog eens.</strong> Niet omdat het moest. <em>"Omdat het niet erg is als het fout is."</em> Dat is het echte verschil met klassikaal afvragen, en het stond in geen enkele prompt.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Wat het kostte, en wat het opleverde',
            inhoud: 'Eerlijk geteld: <strong>ruim twee uur</strong>, verspreid over twee avonden en een middagpauze. Drie kwartier voor de bouwprompt en de twee bijsturingen, twintig minuten testen, een halfuur online zetten met het aanmaken van een account erbij, een kwartier voor de link in Smartschool, de QR-code en een test op school, en na die eerste les nog een halfuur aanpassen. Het tegenargument ligt voor de hand: <em>voor die tijd had je ook gewoon een oefenblad kunnen maken.</em> Voor één hoofdstuk klopt dat waarschijnlijk. Het verschil zit in twee dingen. Het <strong>hergebruik</strong>: de woordenlijst van het volgende hoofdstuk erin zetten kostte tien minuten, en dat bij elk volgend hoofdstuk, in elk van je klassen. En de <strong>directe feedback</strong>: vierentwintig leerlingen die tegelijk oefenen en binnen een seconde weten of het juist is — dat krijg je op papier niet, hoeveel bladen je ook maakt. Levert jouw idee dat hergebruik niet op, dan is een blad maken gewoon sneller. Dat is geen nederlaag, dat is de rekening kloppend maken.',
          },
          {
            type: 'quiz',
            vraag: 'Een collega van het vijfde leerjaar bouwde een oefenpagina rond breuken en wil ze morgen aan haar klas geven. Ze heeft alles zelf uitgeprobeerd en bij haar werkt alles. Wat raad je haar aan om eerst te doen?',
            opties: [
              {
                tekst: 'Iemand die het project niet kent, de oefening één keer laten doen op een toestel van de leerlingen, zonder dat zij erbij uitlegt.',
                juist: true,
                feedback: 'Ja, en dat zijn twee dingen tegelijk. Een ander stel ogen ziet wat er op het scherm ontbreekt, en een ander toestel toont wat haar laptop verbergt: een toetsenbord dat over de knop valt, of een schoolnetwerk dat de link blokkeert. Kost vijf minuten, bespaart een lesuur.',
              },
              {
                tekst: 'De oefening zelf nog een keer doorlopen, maar trager en aandachtiger.',
                juist: false,
                feedback: 'Dat verandert weinig. Zij weet hoe het bedoeld is, en daar zit net het probleem: wie iets gebouwd heeft, leest de uitleg die in zijn hoofd zit en niet die op het scherm staat. Daarvoor heb je iemand anders nodig.',
              },
              {
                tekst: 'De pagina eerst mooier laten maken, zodat de leerlingen ze serieus nemen.',
                juist: false,
                feedback: 'Uitstraling telt echt mee in de klas, maar het is niet het eerste. Kijk eerst of het bij haar leerlingen opent en of ze zonder haar uitleg verder raken; mooi maken kan daarna in één bijsturing.',
              },
            ],
          },
          {
            type: 'opdracht',
            titel: 'Haal je eigen idee door dezelfde weg',
            inhoud: 'Je hebt nu één project van a tot z gezien. Leg die weg naast je eigen idee — niet in je hoofd, maar echt, met je vingers op het toetsenbord. Bouwde je in de module <em>Je eerste webapp bouwen</em> al iets? Neem dat er dan bij en begin gerust bij stap 4. Aan het eind heb je een werkende pagina en een blaadje met wat er bewust nog niet in zit.',
            stappen: [
              'Schrijf in twee zinnen op wat er in jouw lessen stroef loopt, en in één zin wat de leerling straks op het scherm ziet. Lukt die ene zin niet, dan is je idee nog te groot.',
              'Schrap drie dingen, met de reden erbij: geen inloggen, geen scores die jij achteraf bekijkt, één hoofdstuk in plaats van het hele jaar. Dat blaadje is je verlanglijst voor later, geen verlies.',
              'Typ de bouwprompt uit de module Je eerste webapp bouwen, met jouw beschrijving in het bovenste blok en hoogstens tien woorden, vragen of gegevens erbij — meer heb je vandaag niet nodig. Vraag er uitdrukkelijk bij om dat lijstje op één duidelijke plek bovenaan het bestand te zetten, zodat je het later vervangt zonder opnieuw te bouwen.',
              'Maak de oefening één keer helemaal zoals een leerling ze zou maken, en noteer elk mankement als één zin: wat je deed, wat je zag, wat er had moeten gebeuren. Nog niets bijsturen.',
              'Stuur die zinnen in één genummerd bericht, met de zin dat er verder niets mag veranderen, en bewaar het resultaat onder een nieuw versienummer.',
              'Kijk tot slot wat er in je pagina zit dat je nooit gevraagd hebt — een tijdsmeting, een geluidje, een kleurtje. Beslis per stuk of het blijft; wat je niet kan verantwoorden, laat je weghalen.',
            ],
          },
        ],
      },
    ],
  },
];
