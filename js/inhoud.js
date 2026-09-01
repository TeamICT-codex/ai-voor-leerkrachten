// Spoor A — AI-assistenten in de klas (ChatGPT én Claude).
//
// Onze scholen gebruiken beide assistenten, dus dit spoor is bewust
// tool-neutraal geschreven: de vaardigheden zijn identiek, enkel het
// venster ziet er anders uit. Waar het écht verschilt, staat een
// kader met variant 'tool'.
//
// Blok-types die de renderer kent:
//   { type: 'tekst',     inhoud }                       — paragraaf (<strong>/<em>/<code> mag)
//   { type: 'lijst',     items: [], geordend: false }   — opsomming
//   { type: 'kader',     variant, titel, inhoud }       — tip | letop | privacy | weetje | tool
//   { type: 'prompt',    titel, tekst, uitleg }         — kopieerbaar promptvoorbeeld
//   { type: 'vergelijk', zwak, sterk, uitleg }          — zwakke vs. sterke prompt
//   { type: 'opdracht',  titel, inhoud, stappen: [] }   — doe-opdracht
//   { type: 'quiz',      vraag, opties: [{tekst, juist, feedback}] }

export const MODULES_AI = [
  {
    id: 'kennismaking',
    icoon: '👋',
    titel: 'Kennismaken met AI-assistenten',
    ondertitel: 'Wat zijn ChatGPT en Claude, wat kunnen ze, en hoe voer je je eerste gesprek?',
    duur: '30 min',
    niveau: 'Starter',
    doelen: [
      'Je kan in eigen woorden uitleggen wat een AI-assistent is en wat het níét is.',
      'Je vindt je weg in het chatvenster en start zelf een gesprek.',
      'Je weet welk soort schoolwerk zich leent voor AI.',
    ],
    lessen: [
      {
        id: 'wat-is-ai-assistent',
        titel: 'Wat is een AI-assistent?',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              '<strong>ChatGPT</strong> en <strong>Claude</strong> zijn AI-assistenten die met taal werken. Je typt iets in gewone mensentaal — een vraag, een opdracht, een tekst om na te kijken — en je krijgt een geschreven antwoord terug. Geen menu\'s, geen knoppen om te leren: je <em>praat</em> gewoon.',
          },
          {
            type: 'tekst',
            inhoud:
              'Vergelijk het met een <strong>heel belezen stagiair</strong> die razendsnel werkt, nooit moe wordt, maar jouw klas niet kent en soms met veel overtuiging iets fout zegt. Die vergelijking houdt de hele cursus stand: je delegeert werk, maar jij blijft de leerkracht die nakijkt.',
          },
          {
            type: 'kader',
            variant: 'tool',
            titel: 'ChatGPT of Claude — maakt het uit?',
            inhoud:
              'Voor zowat alles in dit spoor: <strong>nee</strong>. Beide zijn chatvensters waar je in gewone taal opdrachten geeft, en alles wat je hier leert werkt in allebei. Gebruik dus wat je school of scholengroep aanbiedt. Wie beide heeft: Claude staat bekend om vlot en genuanceerd schrijfwerk, ChatGPT om zijn brede waaier extra\'s zoals beeldgeneratie en spraak. Merk je verschil op een bepaalde taak, leg dezelfde prompt dan eens naast elkaar — dat is meteen een sterke oefening.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Wél goed in:</strong> teksten schrijven en herschrijven, samenvatten, uitleg op maat van een leeftijd, ideeën genereren, structuren maken, vertalen, feedback formuleren.',
              '<strong>Opletten bij:</strong> harde feiten, cijfers, jaartallen, citaten en bronnen — die moet je altijd zelf controleren.',
              '<strong>Niet voor:</strong> beslissingen over leerlingen, persoonsgegevens ingeven, of iets doorsturen dat je niet zelf gelezen hebt.',
            ],
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Waarom "het weet dingen niet"',
            inhoud:
              'Zo\'n assistent heeft heel veel tekst gelezen, maar zit niet in jouw schoolnetwerk en kent jouw leerplan, klasgroep of schoolafspraken niet. Alles wat het daarover moet weten, moet jij in het gesprek zetten. Dat is geen tekortkoming — dat is precies de knop waar jij aan draait.',
          },
          {
            type: 'quiz',
            vraag: 'Je wil de exacte data van de Guldensporenslag in een tijdlijn. Wat doe je?',
            opties: [
              {
                tekst: 'De AI de tijdlijn laten maken en die meteen kopiëren naar je werkblad.',
                juist: false,
                feedback:
                  'Riskant. Jaartallen zijn precies het soort detail waar een AI-assistent overtuigd naast kan zitten.',
              },
              {
                tekst: 'De tijdlijn laten opstellen, daarna de data zelf nachecken in je handboek.',
                juist: true,
                feedback:
                  'Juist. Je gebruikt AI voor de vorm en de structuur, en jij blijft eindverantwoordelijke voor de feiten.',
              },
              {
                tekst: 'Geen AI gebruiken voor geschiedenis.',
                juist: false,
                feedback:
                  'Te streng. Voor uitleg, werkvormen en oefeningen is het uitstekend — enkel de harde feiten check je na.',
              },
            ],
          },
        ],
      },
      {
        id: 'eerste-gesprek',
        titel: 'Je eerste gesprek',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Een gesprek met een AI-assistent heet een <strong>chat</strong>. Je typt onderaan, het antwoord verschijnt erboven. Belangrijk: binnen één chat <em>onthoudt</em> de assistent wat er eerder gezegd is. Je hoeft jezelf dus niet te herhalen — je kan gewoon verder bouwen.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              'Open een <strong>nieuw gesprek</strong> voor elk nieuw onderwerp. Zo blijft alles overzichtelijk.',
              'Stel je vraag of geef je opdracht in gewone taal. Volzinnen mogen, telegramstijl mag ook.',
              'Lees het antwoord kritisch. Klopt de toon? Het niveau? De inhoud?',
              'Stuur bij: "korter", "voor 10-jarigen", "maak er een tabel van". Dát is waar de winst zit.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De belangrijkste gewoonte',
            inhoud:
              'Het eerste antwoord is een <em>ontwerp</em>, geen eindproduct. Wie één keer vraagt en teleurgesteld afhaakt, mist 90% van de waarde. Wie drie keer bijstuurt, houdt bruikbaar materiaal over.',
          },
          {
            type: 'prompt',
            titel: 'Een veilige eerste prompt om uit te proberen',
            tekst:
              'Ik ben leerkracht in het vijfde leerjaar. Leg in maximaal 5 zinnen uit wat breuken zijn, in taal die een 10-jarige begrijpt, met één voorbeeld uit het dagelijks leven.',
            uitleg:
              'Merk op wat hier al in zit: wie je bent, voor wie het is, hoe lang het mag zijn, en wat er zeker in moet. Dat zijn de vier knoppen uit de volgende module.',
          },
          {
            type: 'opdracht',
            titel: 'Doe dit nu even',
            inhoud:
              'Neem één ding dat volgende week op je planning staat en probeer het uit. Vijf minuten, meer niet.',
            stappen: [
              'Open een nieuw gesprek in ChatGPT of Claude.',
              'Kopieer de prompt hierboven, maar vervang het vak en de leeftijd door die van jou.',
              'Vraag daarna: "Maak het een niveau makkelijker."',
              'Vraag ten slotte: "Geef me nu 3 oefeningen bij die uitleg."',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'prompten',
    icoon: '🎯',
    titel: 'Goede opdrachten geven',
    ondertitel: 'De vier knoppen waarmee je bruikbaar materiaal krijgt in plaats van algemene praat.',
    duur: '40 min',
    niveau: 'Starter',
    doelen: [
      'Je kan een vage vraag omzetten in een scherpe opdracht.',
      'Je gebruikt rol, context, vorm en voorbeeld bewust.',
      'Je stuurt bij in plaats van opnieuw te beginnen.',
    ],
    lessen: [
      {
        id: 'vier-knoppen',
        titel: 'De vier knoppen',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Bijna elke teleurstellende uitkomst komt door één oorzaak: de opdracht was te vaag. Onthoud vier knoppen — je hoeft ze niet alle vier te gebruiken, maar hoe meer je er indrukt, hoe scherper het resultaat. Dit werkt identiek in ChatGPT en Claude.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Rol</strong> — voor wie is het en wie ben jij? <em>"Ik geef Nederlands in het derde middelbaar, richting techniek."</em>',
              '<strong>Context</strong> — wat moet de assistent weten over jouw situatie? <em>"De klas heeft moeite met lange teksten; 4 leerlingen hebben dyslexie."</em>',
              '<strong>Vorm</strong> — wat wil je precies terugkrijgen? <em>"Een tabel met 3 kolommen"</em>, <em>"maximaal 150 woorden"</em>, <em>"5 meerkeuzevragen met antwoordsleutel"</em>.',
              '<strong>Voorbeeld</strong> — toon hoe het eruit moet zien. Plak een oefening die je vorig jaar maakte en zeg: <em>"maak er nog 5 in deze stijl."</em>',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De sterkste knop is "voorbeeld"',
            inhoud:
              'Eén voorbeeld van jouw eigen materiaal doet meer dan drie alinea\'s uitleg. Het vangt in één klap je toon, je opmaak, je moeilijkheidsgraad en je gewoontes.',
          },
          {
            type: 'vergelijk',
            zwak: 'Maak een les over de waterkringloop.',
            sterk:
              'Ik geef wetenschappen in het vierde leerjaar. Maak een lesopbouw van 50 minuten over de waterkringloop: 5 min instap, 15 min uitleg, 20 min groepswerk, 10 min afronding. Taal voor 9-10-jarigen. Geef bij het groepswerk exact wat de leerlingen moeten doen en welk materiaal ik nodig heb.',
            uitleg:
              'De tweede versie levert iets op dat je maandag kan gebruiken. De eerste levert een encyclopedie-artikel op.',
          },
          {
            type: 'kader',
            variant: 'tool',
            titel: 'Zelfde prompt, twee assistenten',
            inhoud:
              'Een leerzame oefening voor deelnemers die toegang hebben tot beide: plak exact dezelfde prompt in ChatGPT en in Claude en vergelijk. Meestal zie je verschil in toon en lengte, zelden in bruikbaarheid. Conclusie voor de groep: <em>de kwaliteit van je prompt weegt zwaarder door dan de keuze van je tool.</em>',
          },
          {
            type: 'quiz',
            vraag: 'Welke knop ontbreekt in deze prompt: "Ik geef Frans in het eerste middelbaar. Maak oefeningen op de werkwoorden."',
            opties: [
              {
                tekst: 'Rol',
                juist: false,
                feedback: 'Die zit erin: "leerkracht Frans, eerste middelbaar".',
              },
              {
                tekst: 'Vorm',
                juist: true,
                feedback:
                  'Klopt. Hoeveel oefeningen? Welk type — invuloefening, vertaling, meerkeuze? Met of zonder antwoordsleutel? Zonder vorm gokt de assistent.',
              },
              {
                tekst: 'Er ontbreekt niets, dit is prima.',
                juist: false,
                feedback:
                  'Je krijgt wel iets terug, maar waarschijnlijk niet wat je in gedachten had. Dat kost je een extra ronde.',
              },
            ],
          },
        ],
      },
      {
        id: 'bijsturen',
        titel: 'Bijsturen in plaats van opnieuw beginnen',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Veel starters wissen het gesprek en typen een nieuwe prompt zodra het antwoord niet klopt. Zonde: binnen hetzelfde gesprek weet de assistent al waar je mee bezig bent. Eén korte zin volstaat vaak.',
          },
          {
            type: 'lijst',
            items: [
              '<code>Te moeilijk. Doe het voor 8-jarigen.</code>',
              '<code>Korter — de helft.</code>',
              '<code>Te schools. Schrijf het zoals ik het aan de klas zou vertellen.</code>',
              '<code>Hou nummer 2 en 4, gooi de rest weg en maak 3 nieuwe in die lijn.</code>',
              '<code>Zet het in een tabel met kolommen: vraag / antwoord / puntenverdeling.</code>',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wanneer wél opnieuw beginnen',
            inhoud:
              'Is het gesprek helemaal de verkeerde kant op gegaan, of is het zó lang geworden dat het antwoorden van tien schermen geleden blijft herhalen? Start dan een vers gesprek en plak enkel het stuk mee dat wél goed was.',
          },
          {
            type: 'opdracht',
            titel: 'De drie-rondes-oefening',
            inhoud:
              'Kies een tekst of oefening die je écht volgende week nodig hebt en dwing jezelf tot drie rondes bijsturen.',
            stappen: [
              'Ronde 1: vraag het met rol + context + vorm.',
              'Ronde 2: stuur bij op niveau of lengte.',
              'Ronde 3: stuur bij op toon of opmaak.',
              'Vergelijk het eindresultaat met wat je na ronde 1 had. Dat verschil is de hele cursus in één oefening.',
            ],
          },
                  {
            type: "prompt",
            titel: "Het sjabloon om te bewaren",
            tekst: "ROL: Ik geef [VAK] in het [LEERJAAR — bv. het vierde leerjaar of het derde middelbaar].\n\nCONTEXT: [wat moet de assistent weten over deze klas of dit moment? bv. 24 leerlingen, groot niveauverschil, laatste lesuur van de dag, vorige les ging over ...]\n\nOPDRACHT: Maak [wat je precies wil: een uitleg / 8 oefeningen / een instapactiviteit / een werkblad] over [ONDERWERP].\n\nVORM: [hoe het eruit moet zien: maximaal 200 woorden / een tabel met 3 kolommen / een genummerde lijst met de antwoorden apart onderaan].\n\nVOORBEELD (laat dit blok weg als je niets bij de hand hebt): hieronder een stuk materiaal van mezelf. Volg deze toon, opmaak en moeilijkheidsgraad:\n[PLAK EEN STUK VAN JE EIGEN MATERIAAL]",
            uitleg: "Rond je eigenlijke opdracht staan de vier knoppen — rol, context, vorm en voorbeeld — er letterlijk bij, zodat je in één oogopslag ziet welke je nog niet hebt ingedrukt. Bewaar dit sjabloon één keer in je notities: voor een volgende les vervang je enkel de blokhaken, en het werkt voor eender welk vak.",
          },
        ],
      },
    ],
  },

  {
    id: 'lesvoorbereiding',
    icoon: '📚',
    titel: 'Lesvoorbereiding & differentiatie',
    ondertitel: 'Van leerplandoel naar een lesopbouw en drie niveaus, in de tijd van een koffiepauze.',
    duur: '45 min',
    niveau: 'Verdieping',
    doelen: [
      'Je laat een lesopbouw maken die past bij jouw tijdsindeling.',
      'Je maakt van één oefening drie niveaus.',
      'Je gebruikt je eigen materiaal als vertrekpunt.',
    ],
    lessen: [
      {
        id: 'lesopbouw',
        titel: 'Een lesopbouw laten maken',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Het grootste tijdverlies bij lesvoorbereiding is niet het denken — het is het <em>uittypen</em> en het zoeken naar een werkvorm die past. Precies daar zit de winst.',
          },
          {
            type: 'prompt',
            titel: 'Lesopbouw op maat',
            tekst:
              'Ik geef [VAK] in het [LEERJAAR]. Maak een lesopbouw van [X] minuten over [ONDERWERP].\n\nVerdeel als volgt: instap, kern, verwerking, afronding — met een tijdsindicatie per onderdeel.\n\nGeef per onderdeel: wat ik doe, wat de leerlingen doen, en welk materiaal ik nodig heb.\n\nDe klas telt [X] leerlingen. Hou rekening met: [bv. rumoerige laatste lesuur / beperkte ICT / grote niveauverschillen].',
            uitleg:
              'Vervang de blokhaken. Die laatste regel over jouw klasrealiteit is wat een generiek lesplan tot jóuw lesplan maakt.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Begin bij je leerplandoel',
            inhoud:
              'Plak het leerplandoel of de eindterm letterlijk in het gesprek en zeg: "Deze les moet naar dit doel toewerken." Je krijgt meteen iets dat je kan verantwoorden in je vakwerkgroep of bij de pedagogisch begeleider.',
          },
        ],
      },
      {
        id: 'differentiatie',
        titel: 'Differentiëren zonder drie keer werk',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Differentiatie is waar AI het meest concrete tijdswinst oplevert: je maakt één versie, en laat de andere twee afleiden. Belangrijk is dat je <strong>zelf zegt waarin de niveaus verschillen</strong> — anders krijg je gewoon "korter" en "langer".',
          },
          {
            type: 'prompt',
            titel: 'Drie niveaus uit één oefening',
            tekst:
              'Hier is een oefening die ik gebruik:\n\n[PLAK JE OEFENING]\n\nMaak hiervan drie versies:\n1. BASIS — kortere zinnen, meer sturing, eventueel een voorbeeld vooraf.\n2. STANDAARD — zoals hierboven.\n3. UITDAGING — zelfde onderwerp, maar de leerling moet meer zelf uitzoeken of toepassen.\n\nHou de opmaak en de vraagvorm gelijk, zodat het in de klas niet opvalt wie welke versie heeft.',
            uitleg:
              'Die laatste zin is er eentje die leerkrachten zelf zelden bedenken, maar die in de praktijk enorm veel uitmaakt.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Blijf zelf de didacticus',
            inhoud:
              'De assistent weet niet dat Yassine altijd afhaakt bij lange teksten of dat Fien net extra uitdaging nodig heeft. Het levert bruikbare bouwstenen; de match met je échte leerlingen maak jij.',
          },
          {
            type: 'quiz',
            vraag: 'Wat is de meest waardevolle input die je aan een differentiatie-prompt kan toevoegen?',
            opties: [
              {
                tekst: 'Je eigen bestaande oefening.',
                juist: true,
                feedback:
                  'Precies. Dat legt je toon, je opmaak en je moeilijkheidsgraad in één keer vast — en het resultaat past bij de rest van je bundel.',
              },
              {
                tekst: 'Een zo lang mogelijke beschrijving van de leerstof.',
                juist: false,
                feedback:
                  'Lengte helpt niet vanzelf. Eén concreet voorbeeld doet meer dan een halve pagina beschrijving.',
              },
              {
                tekst: 'Het aantal leerlingen in de klas.',
                juist: false,
                feedback:
                  'Nuttig voor groepswerk, maar het verandert de moeilijkheidsgraad van een oefening niet.',
              },
            ],
          },
                  {
            type: "opdracht",
            titel: "Jouw eigen les, drie niveaus",
            inhoud: "Neem de les of oefening die je meebracht en maak er in twintig minuten iets van dat maandag effectief de deur uit kan. Werk met echt materiaal, niet met een verzonnen voorbeeld.",
            stappen: [
              "Plak je oefening of werkblad in een nieuw gesprek, met erbij het leerjaar, het vak en het leerplandoel waar ze op mikt.",
              "Vraag de drie versies en zeg zélf waarin BASIS en UITDAGING verschillen — meer sturing, minder stappen, zelf laten opzoeken — en niet enkel korter of langer.",
              "Lees de BASIS-versie na met één echte leerling uit je klas in gedachten: krijgt die er houvast bij, of staat er gewoon minder? Stuur één keer bij op wat wringt.",
              "Vraag hoe je die drie versies binnen één lesuur naast elkaar laat lopen: wie start waarmee, en wat doet wie vroeg klaar is.",
              "Zet de drie versies onder elkaar in één document en noteer erbij wie welke krijgt. Dat document neem je mee naar de klas.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'toetsen-feedback',
    icoon: '✍️',
    titel: 'Toetsen, oefeningen & feedback',
    ondertitel: 'Vragen maken, verbetersleutels opstellen en feedback formuleren die leerlingen echt lezen.',
    duur: '45 min',
    niveau: 'Verdieping',
    doelen: [
      'Je laat toetsvragen maken op het juiste denkniveau.',
      'Je maakt een verbetersleutel en een puntenverdeling.',
      'Je gebruikt AI om feedback te formuleren zonder je oordeel uit handen te geven.',
    ],
    lessen: [
      {
        id: 'toetsvragen',
        titel: 'Toetsvragen op het juiste niveau',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Vraag je gewoon "maak 10 vragen", dan krijg je tien weetvragen. Zeg je erbij welk <strong>denkniveau</strong> je wil, dan krijg je een toets die effectief iets meet.',
          },
          {
            type: 'prompt',
            titel: 'Een gespreide toets',
            tekst:
              'Maak 10 toetsvragen over [ONDERWERP] voor [LEERJAAR].\n\nVerdeling:\n- 3 kennisvragen (weten, benoemen)\n- 4 begripsvragen (uitleggen in eigen woorden)\n- 3 toepassingsvragen (gebruiken in een nieuwe situatie)\n\nGeef per vraag: het denkniveau, het aantal punten, en het modelantwoord.\nTotaal: 20 punten.',
            uitleg:
              'Vraag het modelantwoord altijd meteen mee — dat scheelt je later een half uur, en je merkt onmiddellijk of een vraag dubbelzinnig is.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Laat je eigen toets nakijken',
            inhoud:
              'Plak een toets die je al gemaakt hebt en vraag: <em>"Welke vragen zijn dubbelzinnig, te sturend of te makkelijk te gokken?"</em> Dit is een van de nuttigste dingen die je met AI kan doen, en bijna niemand denkt eraan.',
          },
        ],
      },
      {
        id: 'feedback',
        titel: 'Feedback formuleren',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Feedback schrijven kost tijd omdat je hetzelfde vijfentwintig keer anders moet verwoorden. Dat herformuleren mag je delegeren — <strong>het oordeel niet</strong>.',
          },
          {
            type: 'prompt',
            titel: 'Van kladnotities naar bruikbare feedback',
            tekst:
              'Ik heb het werk van een leerling nagekeken. Mijn ruwe notities:\n\n- structuur ontbreekt, alles is één blok\n- goede woordenschat\n- besluit ontbreekt\n- veel dt-fouten\n\nSchrijf hier feedback van maximaal 6 zinnen van. Toon: bemoedigend maar duidelijk, gericht aan een leerling van het [LEERJAAR]. Begin met wat goed is, geef daarna maximaal 2 concrete werkpunten met een tip om ze aan te pakken.',
            uitleg:
              'Jij beoordeelt, de assistent verwoordt. Merk op dat er géén naam of persoonsgegeven in de prompt staat — daarover meer in de laatste module.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Nooit punten laten geven',
            inhoud:
              'Laat AI geen cijfers of eindbeoordelingen bepalen. Het kent je beoordelingskader niet, is niet consistent over 25 leerlingen heen, en jij bent degene die het moet verdedigen op de klassenraad.',
          },
          {
            type: 'quiz',
            vraag: 'Welke taak geef je bij het verbeteren van werk beter níét uit handen?',
            opties: [
              {
                tekst: 'Het herformuleren van jouw notities tot vlotte feedbackzinnen.',
                juist: false,
                feedback:
                  'Dat is net een ideale taak: jij bepaalt de inhoud, de assistent doet het typwerk.',
              },
              {
                tekst: 'Beslissen welk punt de leerling krijgt.',
                juist: true,
                feedback:
                  'Juist. Beoordelen blijft bij jou — inhoudelijk, wettelijk en tegenover ouders.',
              },
              {
                tekst: 'Een modelantwoord opstellen bij je eigen toetsvraag.',
                juist: false,
                feedback:
                  'Prima taak om te delegeren, zolang jij het modelantwoord nog eens naleest.',
              },
            ],
          },
                  {
            type: "opdracht",
            titel: "Kraak je eigen toets",
            inhoud: "Iedereen heeft wel een toets liggen die \"goed genoeg\" is. Haal die boven — digitaal, zodat je ze kan plakken — en laat ze doorlichten vóór je ze een volgende keer opnieuw gebruikt.",
            stappen: [
              "Plak een toets die je al eens afgenomen hebt in een nieuw gesprek. Zet erbij welk vak, welk leerjaar en hoeveel punten de toets in totaal telt.",
              "Vraag een overzicht per vraag: meet ze weten, begrijpen of toepassen, en hoeveel punten staan er nu op? Laat geen nieuwe punten toekennen — het gaat enkel om de verdeling die er al is. Tel daarna zelf hoeveel vragen op weetniveau blijven steken.",
              "Vraag vervolgens letterlijk: \"Welke vragen zijn dubbelzinnig, te sturend of te makkelijk te gokken?\" Laat enkel de twee zwakste vragen herschrijven.",
              "Vraag een verbetersleutel bij die twee nieuwe vragen en lees hem na: schrap alles wat niet klopt met hoe jij verbetert.",
              "Bewaar de bijgewerkte toets meteen bij je lesmateriaal — dit is de versie die je volgende keer bovenhaalt.",
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'administratie',
    icoon: '📮',
    titel: 'Administratie & communicatie',
    ondertitel: 'Oudermails, verslagen en planningen — het werk dat je avonden opeet.',
    duur: '35 min',
    niveau: 'Verdieping',
    doelen: [
      'Je schrijft lastige oudercommunicatie sneller en rustiger.',
      'Je zet losse notities om in een leesbaar verslag.',
      'Je weet welke administratie je beter niet deelt.',
    ],
    lessen: [
      {
        id: 'oudercommunicatie',
        titel: 'Communicatie met ouders',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Een moeilijke mail aan ouders kost vooral tijd omdat je hem drie keer herschrijft om de toon juist te krijgen. Laat die rondes door de assistent doen — jij kiest de versie die je durft te versturen.',
          },
          {
            type: 'prompt',
            titel: 'Een gevoelige mail, drie tonen',
            tekst:
              'Ik moet ouders melden dat hun kind de laatste weken structureel het huiswerk niet maakt en daardoor achterop raakt.\n\nSchrijf een mail van maximaal 200 woorden. Ik wil samenwerken, niet beschuldigen, en ik wil een gesprek voorstellen.\n\nGeef me drie versies: (1) zakelijk, (2) warm, (3) kort en direct.\n\nGebruik geen namen — zet [LEERLING] waar de naam moet komen.',
            uitleg:
              'Die laatste regel is belangrijk: zo hou je persoonsgegevens uit het gesprek en vul je ze pas in bij het versturen in Smartschool.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Namen en gegevens: laat ze eruit',
            inhoud:
              'Gebruik <code>[LEERLING]</code>, <code>[OUDER]</code> of "een leerling van 13". Je krijgt exact dezelfde kwaliteit terug, en je hebt geen enkel privacyprobleem. Maak hier meteen een gewoonte van — de laatste module gaat er dieper op in.',
          },
        ],
      },
      {
        id: 'verslagen',
        titel: 'Verslagen en planningen',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Notities van een vergadering, een klassenraad of een oudercontact zijn meestal een reeks losse flarden. Precies het soort input waar AI sterk in is: structuur aanbrengen zonder inhoud te verzinnen.',
          },
          {
            type: 'prompt',
            titel: 'Van kladnotities naar verslag',
            tekst:
              'Hieronder mijn ruwe notities van een vergadering. Maak er een helder verslag van met kopjes, en zet de afspraken apart in een lijstje met "wie doet wat tegen wanneer".\n\nVerzin niets bij: staat iets niet in mijn notities, laat het weg of zet er [ONDUIDELIJK] bij.\n\nNotities:\n[PLAK JE NOTITIES]',
            uitleg:
              '"Verzin niets bij" is een van de nuttigste zinnen uit deze hele cursus. Gebruik ze overal waar accuraatheid telt.',
          },
          {
            type: 'opdracht',
            titel: 'Ruim één taak op',
            inhoud: 'Neem één administratieve klus die al te lang blijft liggen.',
            stappen: [
              'Typ je notities of losse gedachten in — slordig mag.',
              'Vraag om structuur, met "verzin niets bij".',
              'Lees na en corrigeer wat niet klopt.',
              'Klaar. Merk hoeveel korter dat duurde dan anders.',
            ],
          },
                  {
            type: "quiz",
            vraag: "Je laat een verslag maken van je ruwe vergaderingsnotities en zet erbij: \"Verzin niets bij.\" Waarom is die ene zin zo nuttig?",
            opties: [
              {
                tekst: "Zonder die zin vult de assistent de gaten in je notities op met tekst die aannemelijk klinkt maar nooit gezegd is.",
                juist: true,
                feedback: "Juist. Een assistent maakt van losse flarden graag een vloeiend geheel, en dan sluipt er inhoud binnen die niemand op die vergadering uitgesproken heeft. In een verslag dat collega's later als afspraak lezen, is dat een echt probleem.",
              },
              {
                tekst: "Zonder die zin wordt het verslag veel te lang.",
                juist: false,
                feedback: "Lengte stuur je met een andere instructie — \"maximaal één bladzijde\" of \"hou het bij de afspraken\". \"Verzin niets bij\" gaat niet over hoeveel er staat, maar over of het klopt.",
              },
              {
                tekst: "Zonder die zin mag je geen persoonsgegevens in het gesprek zetten.",
                juist: false,
                feedback: "Dat zijn twee losse regels. Namen en gegevens laat je sowieso weg, met of zonder deze zin. \"Verzin niets bij\" beschermt de juistheid van je verslag, niet de privacy van je collega's.",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'veilig-en-ethisch',
    icoon: '🛡️',
    titel: 'Veilig, ethisch & met leerlingen',
    ondertitel: 'Privacy, betrouwbaarheid, en wat je doet als leerlingen zelf met AI werken.',
    duur: '50 min',
    niveau: 'Essentieel',
    doelen: [
      'Je weet welke informatie je nooit in een AI-gesprek zet.',
      'Je herkent en ondervangt foute antwoorden.',
      'Je kan uitleggen hoe leerlingen AI eerlijk gebruiken.',
    ],
    lessen: [
      {
        id: 'privacy',
        titel: 'Privacy: de korte versie',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Eén vuistregel dekt bijna alles af: <strong>zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen.</strong>',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Nooit:</strong> namen van leerlingen, geboortedata, adressen, rijksregisternummers, medische of zorggegevens, verslagen van het CLB, foto\'s van leerlingen.',
              '<strong>Nooit:</strong> gevoelige informatie over collega\'s of over de thuissituatie van een gezin.',
              '<strong>Wél veilig:</strong> geanonimiseerde omschrijvingen ("een leerling van 13 met concentratieproblemen"), je eigen lesmateriaal, algemene vragen.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Anonimiseren kost je vijf seconden',
            inhoud:
              'Vervang namen door <code>[LEERLING]</code> voor je iets plakt. De kwaliteit van het antwoord blijft identiek, en je hoeft nooit meer na te denken over wat wel en niet mag.',
          },
          {
            type: 'kader',
            variant: 'tool',
            titel: 'Check de instellingen van jullie accounts',
            inhoud:
              'Zowel ChatGPT als Claude hebben instellingen en abonnementsvormen die bepalen wat er met je gesprekken gebeurt. Bij school- en zakelijke accounts gelden doorgaans strengere afspraken dan bij een gratis privéaccount. <strong>Ga na wat jullie school gebruikt</strong> en welke afspraken de scholengroep maakte — en gebruik voor schoolwerk het schoolaccount, niet je privéaccount. Bij twijfel: de DPO van je scholengroep weet dit.',
          },
        ],
      },
      {
        id: 'betrouwbaarheid',
        titel: 'Als het overtuigd fout is',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'AI-assistenten kunnen dingen <strong>verzinnen</strong> — een jaartal, een bron, een citaat, een boek dat niet bestaat — en dat gebeurt in dezelfde vlotte, zelfverzekerde toon als de rest. Er verschijnt geen waarschuwing. Dat maakt het net riskant, en het geldt voor ChatGPT en Claude allebei.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Extra alert bij:</strong> jaartallen, cijfers, wetgeving, citaten, verwijzingen naar boeken of artikels, en alles rond recente gebeurtenissen.',
              '<strong>Ontspannen bij:</strong> een werkvorm, een lesopbouw, een herschreven alinea, een brainstorm. Daar zie je meteen zelf of het deugt.',
              '<strong>Vaste reflex:</strong> alles wat een leerling of ouder als feit te zien krijgt, check je in een bron die je vertrouwt.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Onzekerheid laten aangeven',
            tekst:
              'Beantwoord de vraag hieronder, en zet expliciet bij elk onderdeel waar je niet zeker van bent: [ONZEKER — NACHECKEN]. Verzin geen bronnen: ken je de exacte bron niet, zeg dat dan.\n\nVraag: [JOUW VRAAG]',
            uitleg:
              'Geen garantie, maar het maakt de twijfelachtige stukken wel zichtbaar — en dat scheelt in je nakijkwerk.',
          },
          {
            type: 'quiz',
            vraag: 'Je krijgt een prachtig citaat van een pedagoog voor je oudercontact. Wat doe je?',
            opties: [
              {
                tekst: 'Gebruiken — het klinkt precies zoals die persoon zou schrijven.',
                juist: false,
                feedback:
                  'Net dát is het gevaar: verzonnen citaten klinken altijd overtuigend. Voor je het weet citeer je iets onbestaands voor een zaal ouders.',
              },
              {
                tekst: 'Eerst opzoeken of het citaat echt bestaat.',
                juist: true,
                feedback:
                  'Juist. Citaten en bronnen zijn de klassieke valkuil. Vind je het nergens terug, gebruik het niet.',
              },
              {
                tekst: 'Aan de assistent vragen of het citaat echt is.',
                juist: false,
                feedback:
                  'Onbetrouwbaar: dezelfde bron kan de verzinning gewoon bevestigen. Check buiten het gesprek.',
              },
            ],
          },
        ],
      },
      {
        id: 'leerlingen',
        titel: 'Leerlingen die zelf AI gebruiken',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Je leerlingen gebruiken AI al — of ze het zeggen of niet. De vraag is niet <em>of</em> je het toelaat, maar of ze leren het <strong>goed</strong> te gebruiken. Verbieden zonder uitleg verplaatst het gewoon naar buiten je zicht.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Wees expliciet per opdracht.</strong> "AI mag hier voor het zoeken naar ideeën, niet voor het schrijven" is duidelijker dan een algemeen verbod.',
              '<strong>Laat het proces zien.</strong> Vraag naar tussenstappen, een kladversie of een korte mondelinge toelichting. Dat maakt overschrijven vanzelf zinloos.',
              '<strong>Leer ze nakijken.</strong> Geef bewust een antwoord met een fout erin en laat ze die zoeken. Dat blijft veel beter hangen dan een waarschuwing.',
              '<strong>Laat ze bronvermelden.</strong> "Ik gebruikte AI voor X" hoort er gewoon bij, net als elke andere bron.',
              '<strong>Let op de leeftijdsgrenzen.</strong> De meeste AI-diensten hanteren een minimumleeftijd. In het lager onderwijs werk je dus klassikaal via jouw account, niet met individuele leerlingaccounts.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'De sterkste klasoefening',
            inhoud:
              'Laat leerlingen een AI-antwoord <em>beoordelen</em> in plaats van produceren. Wat klopt er niet? Wat is te algemeen? Wat mist er? Je traint kritisch lezen én AI-geletterdheid in één werkvorm.',
          },
          {
            type: 'opdracht',
            titel: 'Maak je eigen klasafspraak',
            inhoud: 'Sluit het spoor af met iets dat je maandag kan gebruiken.',
            stappen: [
              'Kies één opdracht die je binnenkort geeft.',
              'Schrijf in twee zinnen wat er met AI mag en wat niet.',
              'Laat die twee zinnen herschrijven op het taalniveau van je leerlingen.',
              'Zet ze bovenaan de opdracht. Klaar.',
            ],
          },
        ],
      },
    ],
  },
];
