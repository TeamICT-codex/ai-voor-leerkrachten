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
    duur: '35 min',
    niveau: 'Basis',
    doelen: [
      'Je kan uitleggen wat vibe coden is en wat het niet is.',
      'Je vertrekt van een onderwijsprobleem in plaats van van een tool.',
      'Je herkent welke ideeën haalbaar zijn voor een eerste bouwsel.',
    ],
    lessen: [
      {
        id: 'wat-is-vibe-coden',
        titel: 'Wat is vibe coden?',
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
              'In spoor A kon je vrij kiezen tussen ChatGPT en Claude. <strong>Hier werken we met Claude</strong>, om een praktische reden: Claude toont wat het bouwt meteen als werkende pagina in het gesprek, zodat je onmiddellijk kan klikken en testen zonder iets te installeren. Dat maakt de cyclus bouwen-testen-bijsturen veel vlotter voor wie niet kan programmeren. Andere assistenten kunnen ook code schrijven, en wat ze daarbij tonen verandert snel — kijk gerust eens wat jouw assistent ondertussen kan. Voor deze workshop houden we het bij één tool: in een zaal vol beginners scheelt dat verwarring, en de vaardigheid die je hier leert — <strong>beschrijven, testen, bijsturen</strong> — verhuist gewoon mee.',
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
              '<strong>Doe dit niet:</strong> punten of zorggegevens opslaan in een zelfgebouwde tool. Daar bestaan schoolsystemen voor, met de nodige afspraken errond.',
            ],
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
    duur: '50 min',
    niveau: 'Basis',
    doelen: [
      'Je bouwt een werkende webpagina uit één beschrijving.',
      'Je test systematisch en stuurt gericht bij.',
      'Je maakt het bruikbaar op het scherm waar het écht gebruikt wordt.',
    ],
    lessen: [
      {
        id: 'eerste-versie',
        titel: 'De eerste versie',
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
              'Bewaar een kopie zodra iets goed werkt, vóór je een grote wijziging vraagt. Noem het <code>oefenapp-v1.html</code>, <code>-v2</code>, enzovoort. Gaat een nieuwe versie de mist in, dan val je gewoon terug. In module "Gegevens, privacy en versiebeheer" doen we dit netter.',
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
              'Ruil met je buur: jij test de app van je buur, je buur test de jouwe. Werk je alleen, test dan je eigen app, maar wees streng.',
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
    ],
  },

  {
    id: 'vibe-delen',
    icoon: '🌐',
    titel: 'Delen met collega\'s en leerlingen',
    ondertitel: 'Van een bestand op jouw laptop naar een link die iedereen kan openen.',
    duur: '35 min',
    niveau: 'Basis',
    doelen: [
      'Je weet welke manier van delen bij welke situatie past.',
      'Je zet je bouwsel online via een gratis dienst.',
      'Je introduceert het vlot in je klas.',
    ],
    lessen: [
      {
        id: 'publiceren',
        titel: 'Online zetten',
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
              'Wat jij bouwt, kan een collega meestal meteen gebruiken. Deel het in je vakwerkgroep, of zet het op KlasCement zodat andere Vlaamse leerkrachten er iets aan hebben. Vraag Claude gerust om er een korte beschrijving en gebruiksaanwijzing bij te schrijven.',
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
    ],
  },

  {
    id: 'vibe-data',
    icoon: '🗄️',
    titel: 'Gegevens, privacy en versiebeheer',
    ondertitel: 'Wanneer je app iets moet onthouden — en hoe je dat in orde houdt met de regels.',
    duur: '55 min',
    niveau: 'Verdieping',
    doelen: [
      'Je beslist bewust of je app gegevens moet bewaren.',
      'Je kent de Vlaamse spelregels rond leerlinggegevens.',
      'Je houdt versies bij zonder je werk kwijt te raken.',
    ],
    lessen: [
      {
        id: 'wanneer-data',
        titel: 'Heb je opslag echt nodig?',
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
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Zodra je gegevens van leerlingen bijhoudt in iets dat je zelf bouwde, is dat een verwerking van persoonsgegevens onder de <strong>GDPR</strong>, de Europese privacywetgeving die ook voor scholen geldt. Dat is geen reden om niets te doen, maar wel om het juist aan te pakken — en niet in je eentje.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Praat met de DPO van je scholengroep</strong> vóór je iets met leerlinggegevens in gebruik neemt. Dat is precies waarvoor die functie bestaat, en het is een gesprek van tien minuten.',
              '<strong>Kies een server in Europa.</strong> Vraag in je prompt expliciet om een regio binnen de EU, en controleer het achteraf bij de dienst zelf. Buiten Europa kán wettelijk, maar er hangen dan afspraken aan vast die de school maakt en niet jij — nog een reden om het eerst met je DPO te bespreken.',
              '<strong>Check je schoolbeleid.</strong> Veel scholen hebben afspraken over welke tools mogen — die gelden ook voor wat je zelf bouwt.',
              '<strong>Verzamel zo weinig mogelijk.</strong> Heb je een naam nodig, of volstaat een klasnummer of zelfverzonnen bijnaam? Meestal het laatste.',
              '<strong>Zorg dat je kan wissen.</strong> Je moet gegevens kunnen verwijderen als iemand daarom vraagt.',
              '<strong>Nooit in een zelfbouwtool:</strong> punten die meetellen, zorg- of medische gegevens, verslagen van het CLB, thuissituaties.',
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
                  'Juist, dit is de werkbare middenweg. Eén nuance: zolang jij weet wie nummer 12 is, blijven het persoonsgegevens — goed afgeschermd, maar niet anoniem. Wat je wint, is dat er geen naam meer in je tool staat en dat wie toevallig meekijkt er niets aan heeft. Dat gesprek van tien minuten met de DPO van je scholengroep blijft dus staan.',
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
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Vroeg of laat overkomt het je: een nieuwe versie is slechter dan de vorige, en die vorige ben je kwijt. <strong>Versiebeheer</strong> lost dat op — je kan altijd terug naar hoe het was.',
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
              "Duid bij wat overblijft aan waar het thuishoort: nergens, in de browser van de leerling, of in een echte database. Kom je bij een echte database uit, hou dat dan voor na de workshop: dat is een sessie werk apart.",
              "Blijft er iets over? Vervang elke verwijzing naar een leerling door een klasnummer of een zelfgekozen bijnaam. Blijft er niets over? Vraag Claude te bevestigen dat je pagina echt nergens iets wegschrijft, en waar je dat in je bestand ziet.",
              "Bewaar je iets, vraag Claude dan om je app zo aan te passen, met een knop waarmee de leerling zijn eigen gegevens wist — en klik die knop meteen zelf aan. Bewaar in beide gevallen het resultaat onder een nieuw versienummer, zodat je terug kan als er iets stukgaat.",
              "Vat in vijf regels samen wat je bewaart, waar het staat en hoe het verdwijnt. Staat er iets in dat naar een leerling verwijst, dan is dat blaadje je vertrekpunt voor een gesprek van tien minuten met de DPO van je scholengroep.",
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
    duur: '55 min',
    niveau: 'Expert',
    doelen: [
      'Je beoordeelt wanneer een AI-functie zinvol is.',
      'Je begrijpt modelkeuze en kosten op hoofdlijnen.',
      'Je weet waarom een sleutel nooit in je webpagina hoort.',
      'Je weet wat er met de invoer van je leerlingen gebeurt.',
    ],
    lessen: [
      {
        id: 'wanneer-ai-inbouwen',
        titel: 'Wanneer is het de moeite?',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Tot nu bouwde je apps met vaste inhoud: jij bepaalt de vragen, de app controleert het antwoord. Je kan ook AI <em>in</em> je app steken, zodat die zelf uitleg geeft of open antwoorden beoordeelt. Dat is krachtig, maar het brengt kosten, wachttijd en onvoorspelbaarheid mee.',
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
              "Noteer vier getallen van je eigen school: hoeveel leerlingen je app zullen gebruiken, hoe vaak één leerling per les een antwoord vraagt, hoeveel lessen je dat per maand doet, en hoe lang een vraag met antwoord ongeveer is. Schat dat tweede getal ruim — leerlingen klikken meer dan je denkt.",
              "Zoek bij je AI-dienst zelf de tarieven van vandaag op. Je vindt er twee: wat je stuurt en wat je terugkrijgt tellen apart. Neem ze over met de datum erbij, want die bedragen schuiven geregeld.",
              "Reken zelf uit hoeveel antwoorden dat per maand worden, en geef dat aantal met je tarieven aan Claude met de vraag wat het per maand en per schooljaar kost. Laat elke aanname die hij zelf invulde bovenaan zetten, en vraag door als er iets staat dat je niet herkent.",
              "Laat dezelfde som nog eens maken met alle aantallen verdrievoudigd: je app slaat aan en twee collega's doen mee. Dát bedrag zet je als uitgavenlimiet bij je dienst, niet het eerste.",
              "Noteer op één blad je twee bedragen met de datum van de tarieven, de limiet die nu staat, en wie dit goedkeurt — directie of schoolbestuur, met je ICT-coördinator erbij. Zonder naam en datum is het geen afspraak maar een voornemen.",
            ],
          },
        ],
      },
      {
        id: 'sleutels-en-veiligheid',
        titel: 'Sleutels en veiligheid',
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
    ],
  },
];
