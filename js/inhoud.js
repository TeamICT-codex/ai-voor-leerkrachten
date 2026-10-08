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
              '<strong>ChatGPT</strong> en <strong>Claude</strong> zijn AI-assistenten die met taal werken. Je typt iets in gewone mensentaal — een vraag, een opdracht, een tekst om na te kijken — en je krijgt een geschreven antwoord terug. Alles wat jij daar intypt, heet een <strong>prompt</strong>. Dat woord kom je in deze hele cursus tegen, en de volgende module gaat helemaal over het scherper maken ervan. Geen menu\'s, geen knoppen om te leren: je <em>praat</em> gewoon.',
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
              'Voor zowat alles in dit spoor: <strong>nee</strong>. Beide zijn chatvensters waar je in gewone taal opdrachten geeft, en alles wat je hier leert werkt in allebei. Gebruik dus wat je school of scholengroep aanbiedt — daar horen doorgaans ook afspraken over je gegevens bij, en dat is een betere reden om te kiezen dan welke functie er deze maand bij zit. Wie beide heeft, merkt vooral verschil in toon en lengte van de antwoorden, en in de extra\'s die eromheen zitten; wát die extra\'s precies zijn, verandert voortdurend, dus baseer je keuze er niet op. Leg dezelfde prompt eens naast elkaar op een taak die je vaak doet en kies wat jou het beste ligt — dat is meteen een sterke oefening.',
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
            vraag: 'Je wil een tijdlijn van de gebeurtenissen rond de Guldensporenslag: de Brugse Metten, de slag zelf, en wat er nadien volgde. Wat doe je?',
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
            type: "tekst",
            inhoud: "Voor je iets kan uitproberen heb je twee dingen nodig: een toestel met internet en een <strong>account</strong> bij een AI-assistent. Soms kan je zonder account al eens iets typen, maar aangemeld werk je pas echt — je gesprekken blijven staan en je bouwt er later op verder. Voorziet je school of scholengroep er een, gebruik dan die. Is er niets, dan volstaat een eigen account voor je eigen lesmateriaal, zonder iets van een leerling erin. Weet je het niet: start vandaag gewoon, en leg de vraag nadien bij je ICT-coördinator.",
          },
          {
            type: "lijst",
            geordend: true,
            items: [
              "<strong>Ga naar de assistent.</strong> Zit er al een in jullie Microsoft- of Google-omgeving, open die; anders zoek je de officiële site van ChatGPT of van Claude. Let erop dat je bij de maker zelf uitkomt en niet bij een naam die erop lijkt.",
              "<strong>Zoek waar je je kan aanmelden.</strong> Heb je al een account, dan meld je je aan; anders maak je er een. Hoe die plek precies heet, verandert geregeld — je zoekt dus geen bepaald knopje.",
              "<strong>Meld je aan.</strong> Kan dat met het school-account waarmee je werkt, doe dat. Let op: een account dat je zelf aanmaakt blijft een gewoon account, ook met je schooladres — de afspraken van de school hangen er niet vanzelf aan.",
              "<strong>Doorloop de eerste schermen.</strong> Voorwaarden aanvaarden, een bevestiging, soms een controle via een code op je gsm. Hou je telefoon dus bij de hand.",
              "<strong>En dan sta je er.</strong> Een grotendeels leeg scherm met onderaan een tekstvak dat je uitnodigt om te typen. Daar gaat de rest van deze les over.",
            ],
          },
          {
            type: "kader",
            variant: "letop",
            titel: "Als je er niet in raakt",
            inhoud: "<strong>Opent de site niet</strong> of krijg je een blokkeerpagina, dan is dat een filter: vraag je ICT-coördinator om ze vrij te geven voor personeel, met de reden erbij. <strong>Opent ze wel maar raak je niet aangemeld</strong>, dan ligt het aan je beheerde laptop of aan de instellingen van je schoolaccount — zelfde persoon, andere vraag, en vrijgeven lost dit niet op. Raak je er vandaag niet in, of maak je liever geen eigen account aan: zeg het in plaats van er stil mee te blijven zitten. Met twee aan één scherm volg je alles perfect.",
          },
          {
            type: 'tekst',
            inhoud:
              'Een gesprek met een AI-assistent heet een <strong>chat</strong>. Je typt onderaan, het antwoord verschijnt erboven. Belangrijk: binnen één chat <em>onthoudt</em> de assistent wat er eerder gezegd is. Je hoeft jezelf dus niet te herhalen — je kan gewoon verder bouwen. Dat onthouden kan trouwens ook <em>tussen</em> gesprekken door gaan: bij veel assistenten is dat een instelling. Reken er dus niet op dat een gesprek verdwijnt zodra je het sluit — wat je wel en niet in een gesprek typt, komt terug in de module over veilig en ethisch werken.',
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
              'Ga naar de AI-assistent die jullie school voorziet. Weet je niet of er iets voorzien is, vraag het aan je ICT-coördinator of directie; is er niets, gebruik dan ChatGPT of Claude.',
              'Meld je aan en start een nieuw gesprek. Lukt het aanmelden nu niet, kijk dan even mee op het scherm van een collega — deze oefening werkt prima met twee aan een scherm.',
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
              '<strong>Rol</strong> — voor wie is het en wie ben jij? <em>"Ik geef Nederlands in het derde middelbaar, dubbele finaliteit, studiedomein STEM."</em>',
              '<strong>Context</strong> — wat moet de assistent weten over jouw situatie? <em>"De klas heeft moeite met lange teksten; 4 leerlingen hebben dyslexie en 6 spreken thuis geen Nederlands."</em> Zet er meteen bij wat dat voor de tekst betekent — <em>"korte zinnen, moeilijke woorden meteen uitgelegd"</em> — anders gokt de assistent ernaar.',
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
              'Ik geef wereldoriëntatie in het vierde leerjaar. Maak een lesopbouw van 50 minuten over de waterkringloop: 5 min instap, 15 min uitleg, 20 min groepswerk, 10 min afronding. Taal voor 9- tot 10-jarigen. Geef bij het groepswerk exact wat de leerlingen moeten doen en welk materiaal ik nodig heb.',
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
            vraag: 'Deze prompt heeft al een rol, context en een voorbeeld. Welke knop ontbreekt nog? "Ik geef Frans in het eerste middelbaar. Mijn klas struikelt vooral over de vervoeging van avoir en être. Maak oefeningen op de werkwoorden, in de stijl van het invulblad dat ik hieronder plak."',
            opties: [
              {
                tekst: 'Rol',
                juist: false,
                feedback: 'Die zit erin: "leerkracht Frans, eerste middelbaar". De context over avoir en être staat er ook al bij.',
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
            type: 'prompt',
            titel: 'Het sjabloon om te bewaren',
            tekst: 'ROL: Ik geef [VAK] in het [LEERJAAR — bv. het vierde leerjaar of het derde middelbaar].\n\nCONTEXT: [wat moet de assistent weten over deze klas of dit moment? bv. 24 leerlingen, groot niveauverschil, laatste lesuur van de dag, vorige les ging over ...]\n\nOPDRACHT: Maak [wat je precies wil: een uitleg / 8 oefeningen / een instapactiviteit / een werkblad] over [ONDERWERP].\n\nVORM: [hoe het eruit moet zien: maximaal 200 woorden / een tabel met 3 kolommen / een genummerde lijst met de antwoorden apart onderaan].\n\nVOORBEELD (laat dit blok weg als je niets bij de hand hebt): hieronder een stuk materiaal van mezelf. Volg deze toon, opmaak en moeilijkheidsgraad:\n[PLAK EEN STUK VAN JE EIGEN MATERIAAL]',
            uitleg: 'Rond je eigenlijke opdracht staan de vier knoppen — rol, context, vorm en voorbeeld — er letterlijk bij, zodat je in één oogopslag ziet welke je nog niet hebt ingedrukt. Bewaar dit sjabloon één keer in je notities: voor een volgende les vervang je enkel de blokhaken, en het werkt voor eender welk vak.',
          },
        ],
      },
    ],
  },

  {
    id: 'lesvoorbereiding',
    icoon: '📚',
    titel: 'Lesvoorbereiding en differentiatie',
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
              'Plak het leerplandoel of de eindterm letterlijk in het gesprek en zeg: "Deze les moet naar dit doel toewerken." Je krijgt meteen iets dat je kan verantwoorden op de vakwerkgroep of het teamoverleg, of bij de pedagogisch begeleider.',
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
              'Differentiatie is waar AI de meest concrete tijdswinst oplevert: je maakt één versie, en laat de andere twee afleiden. Belangrijk is dat je <strong>zelf zegt waarin de niveaus verschillen</strong> — anders krijg je gewoon "korter" en "langer".',
          },
          {
            type: 'prompt',
            titel: 'Drie niveaus uit één oefening',
            tekst:
              'Hier is een oefening die ik gebruik:\n\n[PLAK JE OEFENING]\n\nMaak hiervan drie versies:\n1. BASIS — kortere zinnen, meer sturing, eventueel een voorbeeld vooraf.\n2. STANDAARD — zoals hierboven.\n3. UITDAGING — zelfde onderwerp, maar de leerling moet meer zelf uitzoeken of toepassen.\n\nGeef bij elke versie ook een kort lijstje van woorden waarover een leerling die thuis geen Nederlands spreekt kan struikelen, met telkens een eenvoudiger alternatief erbij. Zet dat lijstje apart onder de oefening; de oefening zelf laat je ongewijzigd. Vaktermen die bij het leerplandoel horen, vervang je niet — die leg je uit in één zin.\n\nHou de opmaak en de vraagvorm gelijk, zodat het in de klas niet opvalt wie welke versie heeft.',
            uitleg:
              'Die laatste zin is er eentje die leerkrachten zelf zelden bedenken, maar die in de praktijk enorm veel uitmaakt. Het woordenlijstje kost je niets extra: je houdt dezelfde oefening, maar je weet op voorhand welke woorden je bij de start best even uitlegt. Loop het wel zelf na — het is een <em>gok</em> van de assistent, en jij weet wie in jouw klas over welk woord valt.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Blijf zelf de didacticus',
            inhoud:
              'De assistent weet niet dat Fien altijd afhaakt bij lange teksten of dat Yassine net extra uitdaging nodig heeft. Het levert bruikbare bouwstenen; de match met je échte leerlingen maak jij.',
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
            type: 'opdracht',
            titel: 'Jouw eigen les, drie niveaus',
            inhoud: 'Neem de les of oefening die je meebracht en maak er in twintig minuten iets van dat maandag effectief de deur uit kan. Werk met echt materiaal, niet met een verzonnen voorbeeld.',
            stappen: [
              'Plak je oefening of werkblad in een nieuw gesprek, met erbij het leerjaar, het vak en het leerplandoel waar ze op mikt.',
              'Vraag de drie versies en zeg zélf waarin BASIS en UITDAGING verschillen — meer sturing, minder stappen, zelf laten opzoeken — en niet enkel korter of langer.',
              'Lees de BASIS-versie na met één echte leerling uit je klas in gedachten: krijgt die er houvast bij, of staat er gewoon minder? Stuur één keer bij op wat wringt.',
              'Vraag hoe je die drie versies binnen één lesuur naast elkaar laat lopen: wie start waarmee, en wat doet wie vroeg klaar is.',
              'Zet de drie versies onder elkaar in één document en noteer erbij wie welke krijgt. Dat document neem je mee naar de klas.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'toetsen-feedback',
    icoon: '✍️',
    titel: 'Toetsen, oefeningen en feedback',
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
              'Jij beoordeelt, de assistent verwoordt. Merk op dat er géén naam of persoonsgegeven in de prompt staat — daarover meer in de module <em>Veilig, ethisch en met leerlingen</em>.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Nooit punten laten geven',
            inhoud:
              'Laat AI geen punten of eindbeoordelingen bepalen. Het kent je beoordelingskader niet, is niet consistent over 25 leerlingen heen, en jij bent degene die dat punt moet verdedigen — aan een ouder of op de klassenraad.',
          },
          {
            type: 'quiz',
            vraag: 'Welke taak geef je bij het verbeteren van werk beter níét uit handen?',
            opties: [
              {
                tekst: 'Het herformuleren van jouw notities tot vlotte feedbackzinnen.',
                juist: false,
                feedback:
                  'Dat is net een ideale taak: jij bepaalt de inhoud, de assistent doet het typewerk.',
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
            type: 'opdracht',
            titel: 'Kraak je eigen toets',
            inhoud: 'Iedereen heeft wel een toets liggen die "goed genoeg" is. Haal die boven — digitaal, zodat je ze kan plakken — en laat ze doorlichten vóór je ze een volgende keer opnieuw gebruikt.',
            stappen: [
              'Plak een toets die je al eens afgenomen hebt in een nieuw gesprek. Zet erbij welk vak, welk leerjaar en hoeveel punten de toets in totaal telt.',
              'Vraag een overzicht per vraag: meet ze weten, begrijpen of toepassen, en hoeveel punten staan er nu op? Laat geen nieuwe punten toekennen — het gaat enkel om de verdeling die er al is. Tel daarna zelf hoeveel vragen op weetniveau blijven steken.',
              'Vraag vervolgens letterlijk: "Welke vragen zijn dubbelzinnig, te sturend of te makkelijk te gokken?" Laat enkel de twee zwakste vragen herschrijven.',
              'Vraag een verbetersleutel bij die twee nieuwe vragen en lees hem na: schrap alles wat niet klopt met hoe jij verbetert.',
              'Bewaar de bijgewerkte toets meteen bij je lesmateriaal — dit is de versie die je volgende keer bovenhaalt.',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'administratie',
    icoon: '📮',
    titel: 'Administratie en communicatie',
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
            titel: 'Een gevoelige mail, vier versies',
            tekst:
              'Ik moet ouders melden dat hun kind de laatste weken structureel het huiswerk niet maakt en daardoor achterop raakt.\n\nSchrijf een mail van maximaal 200 woorden. Ik wil samenwerken, niet beschuldigen, en ik wil een gesprek voorstellen.\n\nGeef me vier versies: (1) zakelijk, (2) warm, (3) kort en direct, (4) in eenvoudig Nederlands — korte zinnen, geen schooljargon, voor ouders die het Nederlands niet vlot lezen.\n\nGebruik geen namen — zet [LEERLING] waar de naam moet komen.',
            uitleg:
              'Die laatste regel is belangrijk: zo hou je persoonsgegevens uit het gesprek en vul je ze pas in bij het versturen in Smartschool. En die vierde versie is vaak net de versie die wél gelezen wordt. Wil je ze ook in de thuistaal van het gezin, hou dan een regel in gedachten: in een taal die jij zelf niet leest, kan jij niet nakijken wat er staat. Laat ze dan nalezen door een collega, de brugfiguur of een tolk voor ze vertrekt.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Namen en gegevens: laat ze eruit',
            inhoud:
              'Gebruik <code>[LEERLING]</code>, <code>[OUDER]</code> of "een leerling van 13". Je krijgt exact dezelfde kwaliteit terug, en je hebt geen enkel privacyprobleem. Maak hier meteen een gewoonte van — de module <em>Veilig, ethisch en met leerlingen</em> gaat er dieper op in.',
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
              'Notities van een vergadering, een zorgoverleg, een klassenraad of een oudercontact zijn meestal een reeks losse flarden. Precies het soort input waar AI sterk in is: structuur aanbrengen zonder inhoud te verzinnen — zolang je de namen en de zorggegevens eruit laat.',
          },
          {
            type: 'prompt',
            titel: 'Van kladnotities naar verslag',
            tekst:
              'Hieronder mijn ruwe notities van een vergadering. Maak er een helder verslag van met kopjes, en zet de afspraken apart in een lijstje met "wie doet wat tegen wanneer".\n\nVerzin niets bij: staat iets niet in mijn notities, laat het weg of zet er [ONDUIDELIJK] bij.\n\nDe namen in mijn notities heb ik vervangen door [LEERLING 1], [LEERLING 2] en [COLLEGA]. Neem die aanduidingen letterlijk zo over in je verslag.\n\nNotities:\n[PLAK JE NOTITIES]',
            uitleg:
              '"Verzin niets bij" is een van de nuttigste zinnen uit deze hele cursus. Gebruik ze overal waar accuraatheid telt. Gaat het om een klassenraad, een zorgoverleg (MDO) of een oudercontact, haal er dan eerst de namen uit: zoeken en vervangen door [LEERLING 1] en [LEERLING 2] is zo gebeurd, en de echte namen zet je pas achteraf terug in je eigen verslag. Wat over zorg, gezondheid of de thuissituatie van een gezin gaat, laat je sowieso uit het gesprek.',
          },
          {
            type: 'opdracht',
            titel: 'Ruim één taak op',
            inhoud: 'Neem één administratieve klus die al te lang blijft liggen.',
            stappen: [
              'Typ je notities of losse gedachten in — slordig mag, maar haal er eerst de namen uit.',
              'Vraag om structuur, met "verzin niets bij".',
              'Lees na en corrigeer wat niet klopt.',
              'Klaar. Merk hoeveel korter dat duurde dan anders.',
            ],
          },
          {
            type: 'quiz',
            vraag: 'Je laat een verslag maken van je ruwe vergaderingsnotities en zet erbij: "Verzin niets bij." Waarom is die ene zin zo nuttig?',
            opties: [
              {
                tekst: 'Zonder die zin vult de assistent de gaten in je notities op met tekst die aannemelijk klinkt maar nooit gezegd is.',
                juist: true,
                feedback: 'Juist. Een assistent maakt van losse flarden graag een vloeiend geheel, en dan sluipt er inhoud binnen die niemand op die vergadering uitgesproken heeft. In een verslag dat collega\'s later als afspraak lezen, is dat een echt probleem.',
              },
              {
                tekst: 'Zonder die zin wordt het verslag veel te lang.',
                juist: false,
                feedback: 'Lengte stuur je met een andere instructie — "maximaal één bladzijde" of "hou het bij de afspraken". "Verzin niets bij" gaat niet over hoeveel er staat, maar over of het klopt.',
              },
              {
                tekst: 'Zonder die zin mag je geen persoonsgegevens in het gesprek zetten.',
                juist: false,
                feedback: 'Dat zijn twee losse regels. Namen en gegevens laat je sowieso weg, met of zonder deze zin. "Verzin niets bij" beschermt de juistheid van je verslag, niet de privacy van je collega\'s.',
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
    titel: 'Veilig, ethisch en met leerlingen',
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
              '<strong>Ging het toch mis?</strong> Plakte je per ongeluk een naam, een klaslijst of een verslag in een gesprek: noteer kort wat er precies in stond en wanneer, meld het diezelfde dag bij je directie en de DPO van de scholengroep, en verwijder daarna het gesprek. Zij beoordelen of dit officieel gemeld moet worden — daar heeft de school maar 72 uur voor, en die inschatting maak jij niet alleen. Melden is precies wat er van je verwacht wordt; stilhouden maakt het alleen erger.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Namen wegknippen is de eerste stap, niet de laatste',
            inhoud:
              'Vervang namen door <code>[LEERLING]</code> voor je iets plakt — de kwaliteit van het antwoord blijft identiek. Maar kijk daarna één keer naar wat er overblijft. "Een leerling van het derde leerjaar met ernstige leesproblemen en een broer in het zesde" wijst binnen jouw school nog altijd naar één kind, ook zonder naam. De vraag is dus niet "staat er een naam in?" maar "kan een collega raden over wie dit gaat?". Is het antwoord ja, haal er dan nog iets uit of hou het bij een algemene omschrijving. En bij zorg- of CLB-gegevens is wegknippen geen oplossing: die horen er sowieso niet in, ook niet zonder naam.',
          },
          {
            type: 'kader',
            variant: 'tool',
            titel: 'Check de instellingen van jullie accounts',
            inhoud:
              'Zowel ChatGPT als Claude hebben instellingen en abonnementsvormen die bepalen wat er met je gesprekken gebeurt. Bij school- en zakelijke accounts gelden doorgaans strengere afspraken dan bij een gratis privéaccount. Waar dat verschil vandaan komt: bij een schoolaccount hoort een <strong>verwerkersovereenkomst</strong> — een contract tussen je school of scholengroep en de leverancier over wat er met de gegevens mag gebeuren, hoelang ze bewaard blijven en waar ze staan. Die komt er niet vanzelf: de school moet ze afsluiten. Vraag dus gerust aan je ICT-coördinator of aan de DPO of ze er is — daar zijn ze net voor. <strong>Ga na wat jullie school gebruikt</strong> en welke afspraken de scholengroep maakte — en gebruik het schoolaccount voor alles waar leerlingen in voorkomen. Voor lesmateriaal zonder leerlinggegevens is je privéaccount doorgaans geen probleem, tenzij het AI-beleid of het ICT-reglement van jullie school iets anders afspreekt.',
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
              'AI-assistenten kunnen dingen <strong>verzinnen</strong> — een jaartal, een bron, een citaat, een boek dat niet bestaat — en dat gebeurt in dezelfde vlotte, zelfverzekerde toon als de rest. Er verschijnt geen waarschuwing. Dat maakt het net riskant, en het geldt voor ChatGPT en Claude allebei. Veel assistenten zoeken ook mee op het web en zetten er links bij. Dat helpt, maar het verplaatst je controle in plaats van ze over te nemen: klik de bron open en kijk of ze bestaat én of ze echt zegt wat de assistent beweert. Een link die er geloofwaardig uitziet, is nog geen gelezen bron.',
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
              'Geen garantie, en let op één ding: <strong>wat er níét gemarkeerd staat, is daarom nog niet juist.</strong> Zo\'n label toont je waar je zeker moet nakijken — het zegt nooit wat je mag overslaan.',
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
                  'Vraag je enkel "klopt dat?", dan kan dezelfde bron haar verzinsel gewoon bevestigen. Laat je de bron erbij zoeken, dan helpt dat wel — maar pas als jij die link opent en het citaat er echt ziet staan.',
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
              'Je leerlingen gebruiken AI al — of ze het zeggen of niet. Eén bezwaar blijft daarbij overeind, en het klopt: bij een opstel of een denkopdracht is het zelf zoeken, vastlopen en herbeginnen <strong>precies het leerdoel</strong>, en een leerling die dat laat schrijven, leert niet schrijven. Daar bestaat geen slimme prompt voor. Alleen lost een algemeen verbod dat evenmin op — het verplaatst het gewoon naar buiten je zicht. Wat wél werkt: per opdracht zeggen wat mag en wat niet. En bij de opdrachten waar het schrijven of het denken zelf het doel is, zeg je gerust dat AI er <em>niet</em> in hoort.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Wees expliciet per opdracht.</strong> "AI mag hier voor het zoeken naar ideeën, niet voor het schrijven" is duidelijker dan een algemeen verbod.',
              '<strong>Spreek af vóór je sanctioneert.</strong> Merk je achteraf AI-gebruik terwijl je vooraf niets afsprak, voer dan een gesprek: vraag hoe de leerling het aanpakte en welke stukken van hem zijn. Wat als onregelmatigheid geldt en wie erover beslist, staat in het school- en evaluatiereglement — lees dat na vóór je punten aftrekt of een taak ongeldig verklaart, en leg een zwaar geval altijd eerst bij je directie. Staat er nog niets over AI in, breng het dan aan bij je directie of op de vakwerkgroep: dat is een schoolafspraak, geen beslissing van één leerkracht.',
              '<strong>Laat het proces zien.</strong> Vraag naar tussenstappen, een kladversie of een korte mondelinge toelichting. Dat maakt overschrijven vanzelf zinloos.',
              '<strong>Leer ze nakijken.</strong> Geef bewust een antwoord met een fout erin en laat ze die zoeken. Dat blijft veel beter hangen dan een waarschuwing.',
              '<strong>Laat ze bronvermelden.</strong> "Ik gebruikte AI voor X" hoort er gewoon bij, net als elke andere bron.',
              '<strong>Let op de leeftijdsgrenzen.</strong> Die verschillen per dienst: bij de ene mag je pas een eigen account als je volwassen bent, bij de andere vanaf dertien mits de ouders akkoord gaan. Kijk het na vóór je iets voorstelt — voor schoolaccounts gelden soms andere afspraken. In het lager onderwijs werk je dus klassikaal via jouw account, niet met leerlingaccounts. En ook in het secundair, waar de leeftijd vaak wél klopt, beslist niet de leerkracht alleen dat een klas met eigen accounts werkt: dat gaat langs de directie en de ICT-coördinator.',
              '<strong>Reken niet op wat er thuis staat.</strong> De ene leerling heeft thuis een eigen toestel, een vlotte verbinding en iemand die meekijkt; de andere deelt één gsm met broers en zussen. Geef dus geen opdracht die eigenlijk een AI-assistent thuis veronderstelt — dan meet je de thuissituatie mee. Hou dat werk in de les: in het lager klassikaal op jouw scherm, in het secundair op de schooltoestellen als je school daar accounts voor voorziet.',
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
