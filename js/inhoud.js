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
//
// Een les heeft daarnaast twee korte zinnen: intro ("In deze les", bovenaan)
// en onthoud (de afsluiter onderaan). Allebei mogen ze opmaak bevatten.

export const MODULES_AI = [
  {
    id: 'kennismaking',
    icoon: '👋',
    titel: 'Kennismaken met AI-assistenten',
    ondertitel: 'Wat zijn ChatGPT en Claude, wat kunnen ze, en hoe voer je je eerste gesprek?',
    niveau: 'Starter',
    doelen: [
      'Je kan in eigen woorden uitleggen wat een AI-assistent is en wat het níét is.',
      'Je vindt je weg in het chatvenster en start zelf een gesprek.',
      'Je weet welk soort schoolwerk zich leent voor AI.',
    ],
    klaarzetten: [
      'Een laptop of computer met internet.',
      'Een account bij een AI-assistent — of de tijd om er in deze module zelf een aan te maken. Voorziet je school of scholengroep er een, gebruik dan die.',
    ],
    lessen: [
      {
        id: 'wat-is-ai-assistent',
        titel: 'Wat is een AI-assistent?',
        minuten: 15,
        intro: 'Je leert wat ChatGPT en Claude zijn, waar ze goed in zijn en waar je moet opletten.',
        onthoud: 'Een AI-assistent is een belezen stagiair: snel en handig, maar hij kent jouw klas niet en kan overtuigd iets fout zeggen. Jij blijft de leerkracht die nakijkt.',
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
        minuten: 25,
        intro: 'Je meldt je aan bij een AI-assistent, start een gesprek en stuurt het antwoord bij tot je er iets mee kunt.',
        onthoud: 'Het eerste antwoord is een ontwerp. Stuur bij met korte opdrachten, zoals "korter" of "voor 10-jarigen": daar zit de winst.',
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
            inhoud: "<strong>Opent de site niet</strong> of krijg je een blokkeerpagina, dan is dat een filter: vraag je ICT-coördinator om ze vrij te geven voor personeel, met de reden erbij. <strong>Opent ze wel maar raak je niet aangemeld</strong>, dan ligt het aan je beheerde laptop of aan de instellingen van je schoolaccount — zelfde persoon, andere vraag, en vrijgeven lost dit niet op. Raak je er niet in? Probeer het dan eerst op je eigen toestel en je eigen verbinding in plaats van op de beheerde schoollaptop — dan weet je meteen of het aan de school ligt. Lukt het daar wel, dan is het een vraag voor je ICT-coördinator en geen fout van jou; stuur die twee zinnen hierboven door en werk ondertussen gewoon thuis verder. Wil je liever helemaal geen eigen account, dan kan je deze cursus blijven lezen: de uitleg, de prompts en de voorbeelden blijven bruikbaar, alleen de doe-opdrachten moet je uitstellen.",
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
              'Meld je aan en start een nieuw gesprek. Lukt dat vandaag niet, sla deze opdracht dan over en lees eerst verder — kom terug zodra je account werkt.',
              'Kopieer de prompt hierboven, maar vervang het vak en de leeftijd door die van jou.',
              'Vraag daarna: "Maak het een niveau makkelijker."',
              'Vraag ten slotte: "Geef me nu 3 oefeningen bij die uitleg."',
            ],
            klaar:
              'je drie antwoorden op je scherm staan en je dat derde antwoord — de drie oefeningen — effectief zou kunnen afdrukken.',
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
    niveau: 'Starter',
    doelen: [
      'Je kan een vage vraag omzetten in een scherpe opdracht.',
      'Je gebruikt rol, context, vorm en voorbeeld bewust.',
      'Je stuurt bij in plaats van opnieuw te beginnen.',
    ],
    klaarzetten: [
      'Een laptop en een werkend account bij een AI-assistent.',
      'Eén eigen lesonderdeel dat je binnenkort geeft, digitaal — zodat je er een stuk van kan kopiëren en plakken.',
    ],
    lessen: [
      {
        id: 'vier-knoppen',
        titel: 'De vier knoppen',
        minuten: 30,
        intro: 'Je leert de vier knoppen waarmee een vage vraag een scherpe opdracht wordt: rol, context, vorm en voorbeeld.',
        onthoud: 'Hoe meer knoppen je indrukt, hoe scherper het resultaat. De sterkste is een voorbeeld: plak een stuk van je eigen materiaal en vraag om meer "in deze stijl".',
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
              'Heb je toegang tot allebei, dan is dit een leerzame oefening: plak exact dezelfde prompt in ChatGPT en in Claude en vergelijk. Meestal zie je verschil in toon en lengte, zelden in bruikbaarheid. Wat je daaruit meeneemt: <em>de kwaliteit van je prompt weegt zwaarder door dan de keuze van je tool.</em>',
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
        minuten: 40,
        intro: 'Je oefent in drie rondes hoe je een antwoord bijstuurt binnen hetzelfde gesprek, en je bewaart een sjabloon voor later.',
        onthoud: 'Stuur bij in hetzelfde gesprek, want de assistent weet al waar je mee bezig bent. Begin pas opnieuw als het helemaal ontspoort, en plak dan het goede stuk mee.',
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
            klaar:
              'je het eindresultaat naast je antwoord van ronde 1 legde en in één zin kan zeggen wat er beter aan is.',
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
    niveau: 'Verdieping',
    doelen: [
      'Je laat een lesopbouw maken die past bij jouw tijdsindeling.',
      'Je maakt van één oefening drie niveaus.',
      'Je gebruikt je eigen materiaal als vertrekpunt.',
    ],
    klaarzetten: [
      'Een laptop en een werkend account bij een AI-assistent.',
      'Eén bestaande oefening of werkblad van jezelf, digitaal.',
      'Het leerplandoel of de eindterm waar de les naartoe werkt, bij de hand.',
    ],
    lessen: [
      {
        id: 'lesopbouw',
        titel: 'Een lesopbouw laten maken',
        minuten: 30,
        intro: 'Je laat je AI-assistent een lesopbouw maken die past bij jouw tijdsindeling, jouw klas en het leerplandoel waar je naartoe werkt.',
        onthoud: 'Eén zin over jouw klas maakt van een algemeen lesplan jouw lesplan. Plak ook het leerplandoel letterlijk mee, dan kan je de les verantwoorden.',
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
        minuten: 35,
        intro: 'Je maakt van één eigen oefening drie niveaus en beslist zelf welke leerling met welke versie aan de slag gaat.',
        onthoud: 'Zeg zelf waarin de niveaus verschillen, anders krijg je gewoon "korter" en "langer". Hou de opmaak gelijk, zodat het in de klas niet opvalt wie welke versie heeft.',
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
              'De assistent weet niet dat Fien altijd afhaakt bij lange teksten of dat Bilal net extra uitdaging nodig heeft. Het levert bruikbare bouwstenen; de match met je échte leerlingen maak jij.',
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
            inhoud: 'Neem een les of oefening die je binnenkort echt geeft — liefst digitaal, zodat je er een stuk van kan plakken — en maak er in twintig minuten iets van dat maandag effectief de deur uit kan. Werk met echt materiaal, niet met een verzonnen voorbeeld.',
            stappen: [
              'Plak je oefening of werkblad in een nieuw gesprek, met erbij het leerjaar, het vak en het leerplandoel waar ze op mikt.',
              'Vraag de drie versies en zeg zélf waarin BASIS en UITDAGING verschillen — meer sturing, minder stappen, zelf laten opzoeken — en niet enkel korter of langer.',
              'Lees de BASIS-versie na met één echte leerling uit je klas in gedachten: krijgt die er houvast bij, of staat er gewoon minder? Stuur één keer bij op wat wringt.',
              'Vraag hoe je die drie versies binnen één lesuur naast elkaar laat lopen: wie start waarmee, en wat doet wie vroeg klaar is.',
              'Zet de drie versies onder elkaar in één document en noteer erbij wie welke krijgt. Dat document neem je mee naar de klas.',
            ],
            klaar:
              'je drie versies onder elkaar in één document staan, met erbij genoteerd wie welke krijgt.',
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
    niveau: 'Verdieping',
    doelen: [
      'Je laat toetsvragen maken op het juiste denkniveau.',
      'Je maakt een verbetersleutel en een puntenverdeling.',
      'Je gebruikt AI om feedback te formuleren zonder je oordeel uit handen te geven.',
    ],
    klaarzetten: [
      'Een laptop en een werkend account bij een AI-assistent.',
      'Eén toets die je zelf maakte en al eens afnam, digitaal. Enkel op papier werkt niet: dan gaat je tijd naar overtypen.',
    ],
    lessen: [
      {
        id: 'toetsvragen',
        titel: 'Toetsvragen op het juiste niveau',
        minuten: 15,
        intro: 'Je laat toetsvragen maken op het juiste denkniveau, met punten en modelantwoord, en laat je eigen toets kritisch nakijken.',
        onthoud: 'Wie enkel "maak tien vragen" typt, krijgt tien weetvragen. Zeg welk denkniveau je wil en vraag het modelantwoord meteen mee.',
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
        minuten: 35,
        intro: 'Je zet kladnotities met je AI-assistent om in vlotte feedback en licht een eigen toets door, terwijl het oordeel bij jou blijft.',
        onthoud: 'Jij beoordeelt, de assistent verwoordt. Het herformuleren mag je uitbesteden, het punt bepaal je altijd zelf.',
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
            klaar:
              'de twee herschreven vragen met hun verbetersleutel in je toets staan, en die bijgewerkte versie bewaard is op de plek waar je ze volgende keer zoekt.',
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
    niveau: 'Verdieping',
    doelen: [
      'Je schrijft lastige oudercommunicatie sneller en rustiger.',
      'Je zet losse notities om in een leesbaar verslag.',
      'Je weet welke administratie je beter niet deelt.',
    ],
    klaarzetten: [
      'Een laptop en een werkend account bij een AI-assistent.',
      'Eén administratieve klus die blijft liggen: ruwe notities van een vergadering, of een mail die je nog moet schrijven.',
    ],
    lessen: [
      {
        id: 'oudercommunicatie',
        titel: 'Communicatie met ouders',
        minuten: 15,
        intro: 'Je schrijft met hulp van je AI-assistent een gevoelige mail aan ouders, in vier versies en zonder namen in het gesprek.',
        onthoud: 'Typ [LEERLING] waar de naam hoort en vul die pas in bij het versturen in Smartschool. Een versie in eenvoudig Nederlands wordt vaak net wél gelezen.',
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
        minuten: 20,
        intro: 'Je verwerkt losse vergaderingsnotities tot een helder verslag met afspraken, zonder namen en met de zin "verzin niets bij".',
        onthoud: '"Verzin niets bij" hoort in elke vraag waar juistheid telt. Namen vervang je eerst door [LEERLING 1]; wat over zorg, gezondheid of de thuissituatie gaat, laat je eruit.',
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
              'Heb je namen weggelaten? Kopieer het resultaat naar je eigen verslag of mail en zet ze daar pas terug — in het gesprek blijven ze weg.',
              'Klaar. Merk hoeveel korter dat duurde dan anders.',
            ],
            klaar:
              'die klus weg is: verstuurd, opgeslagen of doorgegeven — niet enkel netter op je scherm.',
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
    niveau: 'Essentieel',
    doelen: [
      'Je weet welke informatie je nooit in een AI-gesprek zet.',
      'Je herkent en ondervangt foute antwoorden.',
      'Je kan uitleggen hoe leerlingen AI eerlijk gebruiken.',
    ],
    klaarzetten: [
      'Een laptop en een werkend account bij een AI-assistent.',
      'Het AI-beleid of het ICT-reglement van je school of scholengroep, als dat al bestaat.',
      'Eén opdracht die je binnenkort geeft, voor de klasafspraak achteraan.',
    ],
    lessen: [
      {
        id: 'privacy',
        titel: 'Privacy: de korte versie',
        minuten: 20,
        intro: 'Je leert welke gegevens nooit in een AI-gesprek horen, hoe je een leerling onherkenbaar beschrijft en wat je doet als het misgaat.',
        onthoud: 'Zet in een AI-gesprek niets dat je niet op het prikbord in de leraarskamer zou hangen. En vraag je af: kan een collega raden over wie dit gaat?',
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
              '<strong>Ging het toch mis?</strong> Plakte je per ongeluk een naam, een klaslijst of een verslag in een gesprek: noteer kort wat er precies in stond en wanneer, en meld het diezelfde dag bij het <strong>aanspreekpunt informatieveiligheid</strong> van je school — vaak de ICT-coördinator of iemand uit het directieteam — of bij je directie. Zij beoordelen of dit officieel gemeld moet worden en betrekken daarvoor de DPO van de scholengroep; daar heeft de school maar 72 uur voor, en die klok start bij wie het als eerste wist. Wis het gesprek niet vóór zij gezegd hebben dat het mag: zij moeten kunnen nagaan wat erin stond. Melden is precies wat er van je verwacht wordt; stilhouden maakt het alleen erger.',
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
              'Zowel ChatGPT als Claude hebben instellingen en abonnementsvormen die bepalen wat er met je gesprekken gebeurt. Bij school- en zakelijke accounts gelden doorgaans strengere afspraken dan bij een gratis privéaccount. Waar dat verschil vandaan komt: bij een schoolaccount hoort een <strong>verwerkersovereenkomst</strong> — een contract tussen je school of scholengroep en de leverancier over wat er met de gegevens mag gebeuren, hoelang ze bewaard blijven en waar ze staan. Die komt er niet vanzelf: de school moet ze afsluiten. Vraag dus gerust aan je ICT-coördinator of aan het aanspreekpunt informatieveiligheid of ze er is; die legt de vraag zo nodig voor aan de DPO van de scholengroep — daar zijn ze net voor. <strong>Ga na wat jullie school gebruikt</strong> en welke afspraken de scholengroep maakte — en gebruik het schoolaccount voor alles waar leerlingen in voorkomen. Voor lesmateriaal zonder leerlinggegevens is je privéaccount doorgaans geen probleem, tenzij het AI-beleid of het ICT-reglement van jullie school iets anders afspreekt.',
          },
        ],
      },
      {
        id: 'betrouwbaarheid',
        titel: 'Als het overtuigd fout is',
        minuten: 15,
        intro: 'Je ziet waar een AI-assistent overtuigd iets kan verzinnen en hoe je jaartallen, citaten en bronnen zelf nacheckt.',
        onthoud: 'Wat een leerling of ouder als feit te zien krijgt, check je in een bron die je vertrouwt. Een link is nog geen gelezen bron: open hem en lees na.',
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
        minuten: 25,
        intro: 'Je bepaalt per opdracht wat leerlingen met AI mogen en schrijft daarover een klasafspraak die je maandag kan uitdelen.',
        onthoud: 'Geen algemeen verbod, maar per opdracht twee zinnen over wat met AI mag. Is het schrijven of denken zelf het leerdoel, dan zeg je gerust: hier geen AI.',
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
              '<strong>Let op de leeftijdsgrenzen.</strong> Die verschillen per dienst: bij de ene mag je pas een eigen account als je volwassen bent, bij de andere vanaf dertien mits de ouders akkoord gaan. Dat zijn voorwaarden van de dienst zelf, geen wettelijke AI-leeftijd — die bestaat niet. Kijk het na vóór je iets voorstelt — voor schoolaccounts gelden soms andere afspraken. In het lager onderwijs werk je dus klassikaal via jouw account, niet met leerlingaccounts. En ook in het secundair, waar de leeftijd vaak wél klopt, beslist niet de leerkracht alleen dat een klas met eigen accounts werkt: dat gaat langs de directie en de ICT-coördinator.',
              '<strong>Reken niet op wat er thuis staat.</strong> De ene leerling heeft thuis een eigen toestel, een vlotte verbinding en iemand die meekijkt; de andere deelt één gsm met broers en zussen. Geef dus geen opdracht die eigenlijk een AI-assistent thuis veronderstelt — dan meet je de thuissituatie mee. Hou dat werk in de les: in het lager klassikaal op jouw scherm, in het secundair op de schooltoestellen als je school daar accounts voor voorziet.',
            ],
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'AI als hulpmiddel, niet als voorsprong',
            inhoud:
              'Dezelfde hulp is voor de ene leerling een opstapje en voor de andere een omweg rond het leerdoel, en het verschil zit in wat je met die taak wil <strong>meten</strong>. Een leerling met dyslexie die zijn tekst zelf schrijft en hem daarna laat nalezen op spelling, compenseert iets — dat sluit aan bij de redelijke aanpassingen die in zijn zorgfiche staan. Een anderstalige nieuwkomer die de opdracht in zijn thuistaal laat zetten om te snappen wát er gevraagd wordt, ontloopt de opdracht niet maar begrijpt ze. Meet je in die taak kennis van geschiedenis, dan haalt die hulp een drempel weg; meet je spelling, dan valt ze net binnen wat je beoordeelt. Zet de regel daarom bij de opdracht zelf in plaats van ze per leerling af te spreken: <em>wie volgens zijn vastgelegde aanpassingen hulpmiddelen mag gebruiken, mag deze taak laten nalezen op spelling</em>. Dan staat ze er voor iedereen, lijkt ze geen gunst, en hoef je voor de klas niet te zeggen wie dyslexie heeft. De casus <em>Spelling nalezen bij dyslexie</em> in de module <em>Casussen: mag dit?</em> werkt dit verder uit, inclusief het tegenargument van de collega die het oneerlijk vindt.',
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
            inhoud: 'Rond deze module af met iets dat je maandag kan gebruiken. Daarna wachten nog de casussen — die zijn de test of het blijft hangen.',
            stappen: [
              'Kies één opdracht die je binnenkort geeft.',
              'Schrijf in twee zinnen wat er met AI mag en wat niet.',
              'Laat die twee zinnen herschrijven op het taalniveau van je leerlingen.',
              'Zet ze bovenaan de opdracht. Klaar.',
            ],
            klaar:
              'die twee zinnen bovenaan de opdracht staan, in de taal van je leerlingen, klaar om uit te delen.',
          },
        ],
      },
    ],
  },

  // De leerlingencursus "AI-wijs op school" staat als aparte site in leerlingen/
  // (bron in leerlingen-bron/). Deze module is de handleiding voor de
  // leerkracht: wat zit erin, hoe zet je ze in, hoe volg je op.
  {
    id: 'leerlingencursus',
    icoon: '🎒',
    titel: 'De leerlingencursus in je klas',
    ondertitel:
      'AI-wijs op school is een gratis cursus voor je leerlingen van de tweede en derde graad, AI-wijs Start de klassikale instap voor de eerste graad. Zo zet je ze in, zonder er zelf een expert voor te moeten zijn.',
    niveau: 'Verdieping',
    // Een module mag geen <a> in haar tekst (zie T122/T130); de ingang naar de
    // subsite hangt daarom als link aan de module zelf. toonModule() toont hem.
    link: { href: 'leerlingen/index.html', tekst: 'Open AI-wijs op school' },
    doelen: [
      'Je weet wat er in AI-wijs op school zit en welke hoofdstukken voor jouw vak en je klas interessant zijn.',
      'Je kiest een manier om de cursus in te zetten: als huiswerk, in één lesuur, in een GWP of als begeleiding bij een taak of GIP.',
      'Je maakt klasafspraken die kloppen met wat de cursus de leerlingen zelf aanleert, en je weet hoe je opvolgt zonder controletools.',
      'Je weet hoe AI-wijs Start de eerste graad klassikaal en zonder account op weg helpt, en wat je vooraf regelt.',
    ],
    klaarzetten: [
      'Open de leerlingencursus zelf eens via de knop bovenaan deze module (of via de voorpagina). Een half uur bladeren volstaat om te zien wat je leerlingen te zien krijgen.',
      'De afspraken over AI in het schoolreglement van je school en, als die er zijn, de afspraken van je vakwerkgroep.',
    ],
    lessen: [
      {
        id: 'wat-zit-erin',
        titel: 'Wat zit er in AI-wijs op school?',
        minuten: 10,
        intro: 'Je ontdekt hoe AI-wijs op school is opgebouwd, wat je leerlingen er doen en wat de cursus wel en niet bewaart.',
        onthoud: 'Voortgang en antwoorden blijven in de browser van de leerling: jij krijgt geen overzicht. Wat ze eruit haalde, hoor je in een klasgesprek.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              '<strong>AI-wijs op school</strong> is een cursus die leerlingen van de tweede en derde graad <em>zelfstandig</em> doorlopen, op hun laptop of gsm, thuis of op school. Ze is geschreven voor de leerlingen van onze scholen, met voorbeelden uit Dendermonde, Hamme, Lokeren, Moerbeke, Wetteren en Zele, maar elke school mag ze gebruiken. Voor de cursus zelf maakt een leerling geen account aan en betaalt ze niets. Voor een chatbot is er wél een account nodig; vaak volstaat het schoolaccount, want veel scholen hebben via Microsoft 365 of Google Workspace al Copilot of Gemini staan. Welke chatbot jouw leerlingen mogen gebruiken, hangt af van hun leeftijd en van jullie schoolafspraken: les 1.6 zet die leeftijdsregels op een rij, en de cursus zegt er telkens bij "vraag na wat je school toelaat". Je opent ze met de knop <em>Open AI-wijs op school</em> bovenaan deze module; het adres eindigt op <code>/leerlingen/</code>.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>De basis</strong> (hoofdstuk 1 en 2): wat generatieve AI is, welke chatbot je kiest, en hoe je een goede opdracht geeft. Dit doen alle leerlingen eerst.',
              '<strong>Jouw route</strong> (hoofdstuk 3 tot 8): leren voor toetsen en examens, taken en de GIP, presentaties en affiches maken, een website bouwen, de risico\'s van AI, en AI in studie en werk. De leerling kiest zelf welke hoofdstukken.',
              '<strong>Afronding</strong> (hoofdstuk 9): terugblik en een certificaat dat de leerling zelf afdrukt.',
            ],
          },
          {
            type: 'tekst',
            inhoud:
              'Elke les is tekst met een concrete handeling: een prompt om te kopiëren, een stappenplan of een opdracht met de eigen leerstof. De lessen eindigen met kernpunten en één <strong>denkvraag</strong> waar de leerling een antwoord bij typt; op haar scherm heet dat blok <em>Denk even na</em>. De hoofdstukken 1 tot en met 8 sluiten elk af met een <strong>quiz</strong> van tien situaties uit het schoolleven, met uitleg bij elk antwoord; hoofdstuk 9 eindigt met het certificaat. De rode draad door alles heen is dezelfde als in deze leeromgeving: <em>jij geeft richting, AI helpt, jij controleert</em>.',
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Elf vaste leerlingen uit onze scholen',
            inhoud:
              'De voorbeelden volgen elf fictieve leerlingen, elk met één school, jaar en richting: Noor uit het vijfde jaar humane wetenschappen in Dendermonde werkt aan een onderzoeksopdracht, Senne uit het zesde jaar elektromechanische technieken in Lokeren bereidt zijn GIP voor, Imani loopt stage in een woonzorgcentrum, Elias combineert school en werkvloer in duaal leren. Zo herkent een leerling uit elke finaliteit zich, en dat is bewust: in de cursus is een lasser evenveel waard als een latinist.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Wat de cursus bewaart, en wat niet',
            inhoud:
              'De voortgang, de quizscores en de antwoorden op de denkvragen blijven in de browser van de leerling, op dat toestel. Er gaat niets naar een server en er is geen leerkrachtoverzicht. Een leerling kan een <em>voortgangscode</em> exporteren om op een ander toestel verder te werken. Wil je zien hoe ver een leerling staat, dan vraag je het, of je laat het certificaat tonen. Dat is een keuze: geen controle, wel vertrouwen en gesprek.',
          },
          {
            type: 'tekst',
            inhoud:
              'De hoofdstukken zijn gekoppeld aan de vier domeinen van het Europese kader voor AI-geletterdheid: <em>omgaan met AI</em>, <em>creëren met AI</em>, <em>AI beheren</em> en <em>AI ontwerpen</em>. Dat kader komt vanaf 2029 ook in het PISA-onderzoek. Voor je eigen planning sluit de cursus aan bij sleutelcompetentie 4, digitale competentie en mediawijsheid, en bij de leercompetenties en burgerschap. Op de pagina <em>Voor leerkrachten</em> van de cursus (in het menu bovenaan) staat een tabel met de hoofdstukken, de domeinen en de tijd per hoofdstuk.',
          },
          {
            type: 'quiz',
            vraag: 'Een leerling zegt dat ze hoofdstuk 3 afgerond heeft en toont het vinkje in haar overzicht. Wat weet je dan zeker?',
            opties: [
              {
                tekst: 'Dat ze alle lessen van hoofdstuk 3 als voltooid markeerde en de quiz minstens één keer met 80 % haalde.',
                juist: true,
                feedback:
                  'Juist. Meer zegt het vinkje niet: een leerling vinkt lessen zelf af, alleen de quiz wordt automatisch afgevinkt. Wil je weten wat ze eruit haalde, vraag dan naar haar antwoord op een denkvraag of laat ze een prompt uit de les tonen.',
              },
              {
                tekst: 'Dat de school kan nakijken welke antwoorden ze op de denkvragen gaf.',
                juist: false,
                feedback:
                  'Nee. Alles blijft in haar browser. Er is geen leerkrachtoverzicht, en dat is een bewuste keuze.',
              },
              {
                tekst: 'Dat ze de leerstof van hoofdstuk 3 beheerst.',
                juist: false,
                feedback:
                  'Te veel geconcludeerd. De quiz test tien situaties, geen beheersing. Het gesprek in de klas doet dat beter.',
              },
            ],
          },
        ],
      },
      {
        id: 'zo-zet-je-ze-in',
        titel: 'Vier manieren om de cursus in te zetten',
        minuten: 15,
        intro: 'Je kiest uit vier manieren om de leerlingencursus in te zetten en maakt een concreet plan voor één klas.',
        onthoud: 'Geef een afgebakende opdracht, zoals één les of één hoofdstuk, met een vast moment in de klas om erover te praten. "Doe de cursus" verzandt, net als elk zelfstudiepakket.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'De cursus duurt ongeveer dertien uur als een leerling alles doet, maar niemand hoeft alles te doen. Hoofdstuk 1 en 2 samen zijn een kleine drie uur en leggen de basis. Daarna kies je, of laat je kiezen. Vier manieren die in de praktijk werken, van weinig naar veel lestijd.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>Als huiswerk of zelfstudie.</strong> Je geeft hoofdstuk 1 en 2 op, met een week of twee tijd, en je bespreekt in de klas één denkvraag per les. Kost je tien minuten per week en levert verrassend eerlijke gesprekken op over hoe leerlingen AI nu al gebruiken.',
              '<strong>In één lesuur.</strong> Kies één les en doe ze samen: les 1.4 (wat is generatieve AI) met de drie voorbeelden, of les 1.8 (jij houdt de regie) gevolgd door de klasafspraak. Een hoofdstukquiz van tien situaties werkt ook goed als klasgesprek: stem per vraag met de hand, lees daarna de uitleg.',
              '<strong>In een GWP of projectdag.</strong> Hoofdstuk 5 (presentaties, affiches, gesproken uitleg, data) en hoofdstuk 6 (een website bouwen) zijn doe-hoofdstukken van een halve dag. Leerlingen maken iets voor een echt doel: de opendeurdag, de leerlingenraad, de sportdag.',
              '<strong>Als begeleiding bij een taak, paper of GIP.</strong> Hoofdstuk 4 volgt één onderzoeksopdracht van onderzoeksvraag tot mondeling, met de afspraken over AI erbij. Geef het mee bij de opdracht, samen met jouw regels voor wat mag.',
            ],
          },
          {
            type: 'vergelijk',
            zwak: 'Doe de leerlingencursus tegen volgende maand.',
            sterk:
              'Doe deze week les 1.6 en 1.8. Noteer je antwoord op de denkvraag van 1.8; vrijdag bespreken we die en maken we onze klasafspraak over AI bij de taak Frans.',
            uitleg:
              'Een afgebakende opdracht met een moment in de klas werkt. "Doe de cursus" verzandt, net zoals bij elk ander zelfstudiepakket.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Kies de route bij de finaliteit en het vak',
            inhoud:
              'Een klas elektrische installaties haalt meer uit hoofdstuk 3 (leren met AI, met een schema uit de werkplaats) en hoofdstuk 8 (AI op de werkvloer, duaal leren) dan uit hoofdstuk 4. Een klas humane wetenschappen in het vijfde jaar zit met hoofdstuk 4 midden in haar onderzoeksopdracht. Taalvakken: les 3.5 (laat je overhoren) en 3.6 (oefen hardop) zijn meteen bruikbaar voor Frans en Engels. Kijk naar de personages in de lessen: wie lijkt op jouw leerlingen, daar zit je ingang.',
          },
          {
            type: 'prompt',
            titel: 'Laat je assistent een lesuur uitwerken rond één les',
            tekst:
              'Ik geef [vak] in het [jaar] [finaliteit] en wil één lesuur van 50 minuten bouwen rond een les uit een AI-cursus voor leerlingen. De les gaat over [onderwerp van de les, bv. "jij geeft richting, AI helpt, jij controleert"] en eindigt met deze denkvraag: [plak de denkvraag]. Maak een lesverloop met een instap van 5 minuten, 20 minuten zelfstandig lezen en proberen met een gratis chatbot, 15 minuten klasgesprek over de denkvraag en 10 minuten om samen een klasafspraak over AI te formuleren. Geef bij het klasgesprek vijf doorvragen. Gebruik geen namen van leerlingen.',
            uitleg:
              'Vul de haakjes in met je eigen vak en klas. Je assistent kent de cursus niet, dus geef het onderwerp en de denkvraag letterlijk mee.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Accounts en leeftijd',
            inhoud:
              'De cursus zegt het de leerlingen zelf: de meeste chatbots vragen minstens dertien jaar, voor een privéaccount hoort er onder achttien toestemming van de ouders bij, en sommige chatbots zijn alleen voor volwassenen. Dat zijn voorwaarden van de dienst, geen wettelijke AI-leeftijd, en ze veranderen. Een schoolaccount valt onder de afspraken van de school. Plan je een lesuur waarin leerlingen echt een chatbot gebruiken, kijk dan vooraf na wat er op de schoollaptops werkt en welke tool je school toelaat. Dezelfde vraag als voor jezelf in de module over je eerste gesprek: regel het met de ICT-coördinator, niet ter plaatse.',
          },
          {
            type: 'opdracht',
            titel: 'Kies je klas en je manier',
            inhoud:
              'Rond deze les af met een concreet plan voor één klas. Klein houden mag: één les, één moment in de klas.',
            stappen: [
              'Kies één klas en bekijk welk personage uit de cursus op die leerlingen lijkt (school, jaar, finaliteit).',
              'Kies één van de vier manieren hierboven en één hoofdstuk of les.',
              'Leg een datum vast voor het moment in de klas: de bespreking van een denkvraag, een quiz als klasgesprek of de klasafspraak.',
              'Zet de opdracht op Smartschool met de link naar de les en de datum.',
            ],
            klaar:
              'er een opdracht op Smartschool staat met één les uit de cursus, een datum en wat je in de klas gaat doen.',
          },
          {
            type: 'quiz',
            vraag: 'Je hebt één lesuur met een klas van het vierde jaar en wil dat ze iets concreets meenemen. Wat kies je?',
            opties: [
              {
                tekst: 'De hele cursus kort voorstellen en vragen om ze thuis te doorlopen.',
                juist: false,
                feedback:
                  'Dan gebeurt er thuis meestal weinig. Een open opdracht zonder moment in de klas verzandt.',
              },
              {
                tekst: 'Eén les samen doen, de denkvraag bespreken en eindigen met een klasafspraak over AI.',
                juist: true,
                feedback:
                  'Juist. Eén les, één gesprek, één afspraak: dat past in vijftig minuten en levert iets op dat je morgen gebruikt.',
              },
              {
                tekst: 'Een hoofdstukquiz laten maken als toets voor punten.',
                juist: false,
                feedback:
                  'De quizzen zijn gemaakt om van te leren, met uitleg bij elk antwoord. Als toets voor punten verlies je dat, en de leerling kan ze thuis gewoon opnieuw doen.',
              },
            ],
          },
        ],
      },
      {
        id: 'afspraken-en-opvolging',
        titel: 'Afspraken, opvolging en het certificaat',
        minuten: 10,
        intro: 'Je stemt je klasafspraken af op wat de cursus je leerlingen leert, en je volgt op zonder dashboard of detector.',
        onthoud: 'Zeg per opdracht welke AI-hulp mag, met de vier soorten hulp uit de leerlingencursus. Twijfel je over een tekst, vraag dan naar het proces, niet naar de score van een AI-detector.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'De cursus leert leerlingen in les 4.11 drie dingen die jou het leven makkelijker maken: per stap navragen welke AI-hulp mag, een <strong>logboek</strong> bijhouden van wat ze AI vroegen en wat ze ermee deden, en hun AI-hulp eerlijk vermelden. Dat werkt alleen als jouw afspraken daarbij aansluiten. Zeg dus niet "geen AI", maar zeg per opdracht wat mag: ideeën en richting, opbouw, feedback en taal (op tekst die de leerling zelf schreef), of ook tekst schrijven. De module <em>Veilig, ethisch en met leerlingen</em> eindigt met precies die klasafspraak; de leerlingencursus is er de spiegel van.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Wat de cursus zegt over AI-detectoren',
            inhoud:
              'De leerlingen lezen dat een detector een schatting geeft en geen bewijs, dat hij in twee richtingen kan missen, en dat hun logboek, notities en tussenversies hun beste bewijs van eigen werk zijn. Zeg jij in de klas iets anders, dan verlies je de geloofwaardigheid van allebei. Vraag bij twijfel over een tekst naar het proces, niet naar een score.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Dezelfde regel voor hen als voor jou',
            inhoud:
              'De cursus hamert erop: geen volledige namen, geen adressen, geen namen van klasgenoten of leerkrachten, geen toetsen die nog moeten komen, en bij stage geen gegevens van zorgvragers of klanten. Dat is dezelfde regel die je in deze leeromgeving voor jezelf leerde. Het helpt om ze ook zo te benoemen: wat jij niet in een chatbot zet over een leerling, zet een leerling niet over jou.',
          },
          {
            type: 'tekst',
            inhoud:
              'Opvolgen doe je zonder dashboard, en dat kan prima. Drie dingen die werken: laat leerlingen hun antwoord op een denkvraag voorlezen of inleveren, laat ze één prompt uit de les tonen die ze echt gebruikten (met het antwoord van de chatbot erbij), en bespreek een hoofdstukquiz klassikaal. Het <strong>certificaat</strong> vraagt hoofdstuk 1, 2, minstens één routehoofdstuk en hoofdstuk 9; de leerling vult zelf een naam in en drukt af. Het is een bewijs van inzet, geen attest. Wil je het meetellen voor een portfolio of een vakoverschrijdend project, spreek dat af in je vakwerkgroep.',
          },
          {
            type: 'prompt',
            titel: 'Je klasafspraak in de taal van de cursus',
            tekst:
              'Hieronder staat mijn afspraak over AI bij een opdracht voor het [jaar] [finaliteit]. Herschrijf ze in vier korte zinnen voor leerlingen van 14 tot 18 jaar, in de je-vorm, met deze vier soorten hulp als structuur: ideeën en richting, opbouw, feedback en taal, tekst schrijven. Zeg per soort of het mag, en hoe de leerling het vermeldt. Voeg één zin toe over het logboek. Gebruik geen namen.\n\nMijn afspraak: [plak je afspraak]',
            uitleg:
              'De vier soorten hulp komen letterlijk uit les 4.11 van de leerlingencursus. Zo herkennen je leerlingen de structuur en hoef je niets uit te leggen.',
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Samen leren samenleven',
            inhoud:
              'De cursus noemt het GO! nergens als regel, maar de zes kernwaarden van het PPGO! zitten erin: eerlijk vermelden wat je deed (oprechtheid), bronnen en vooroordelen controleren (respect en gelijkwaardigheid), delen wat werkt met klasgenoten (betrokkenheid) en nadenken over de gevolgen voor anderen (engagement). Wie in een klasgesprek naar die waarden wil, vindt in hoofdstuk 7 (kansen en risico\'s) negen lessen die ernaar vragen zonder te preken.',
          },
          {
            type: 'opdracht',
            titel: 'Breng je afspraak en de cursus op één lijn',
            inhoud:
              'Neem de klasafspraak die je in de module over veilig en ethisch werken maakte, of maak ze nu, en leg ze naast les 4.11 van de leerlingencursus.',
            stappen: [
              'Lees les 4.11 van de cursus in de rol van een leerling: welke vragen zou je aan jezelf stellen?',
              'Herschrijf je afspraak met de prompt hierboven en lees het resultaat kritisch na.',
              'Zet de afspraak bovenaan je volgende opdracht, met de link naar les 4.11 erbij.',
              'Spreek met je vakwerkgroep af of het certificaat van de cursus ergens voor meetelt.',
            ],
            klaar:
              'je afspraak bovenaan een echte opdracht staat, in dezelfde vier soorten hulp als de cursus, met een link naar les 4.11.',
          },
          {
            type: 'quiz',
            vraag: 'Een leerling levert een taak in die opvallend vlot geschreven is. Je twijfelt. Wat doe je, in lijn met wat de cursus de leerling leerde?',
            opties: [
              {
                tekst: 'De tekst door een AI-detector halen en de score als bewijs gebruiken.',
                juist: false,
                feedback:
                  'De leerling heeft net geleerd dat zo\'n score geen bewijs is, en dat klopt. Je verliest het gesprek voor het begint.',
              },
              {
                tekst: 'Vragen naar het proces: het logboek, de notities, de tussenversies, en hoe de leerling tot zijn keuzes kwam.',
                juist: true,
                feedback:
                  'Juist. Dat is precies wat de cursus de leerling leert bij te houden. Wie het werk echt zelf deed, vertelt het zo.',
              },
              {
                tekst: 'De taak zonder uitleg laten herschrijven in de klas.',
                juist: false,
                feedback:
                  'Dat straft ook wie eerlijk werkte, en je weet nog altijd niet wat er gebeurd is. Eerst het gesprek.',
              },
            ],
          },
        ],
      },
      {
        id: 'start-in-de-eerste-graad',
        titel: 'AI-wijs Start in de eerste graad',
        minuten: 8,
        intro: 'Je leert hoe AI-wijs Start de eerste graad klassikaal op weg helpt, zonder account, en wat je vooraf regelt.',
        onthoud: 'Start geef je klassikaal en leerlingen hebben geen account nodig. Een stap met een chatbot gebeurt alleen op school, onder jouw begeleiding; verwittig voor les 5 de leerlingenbegeleiding.',
        blokken: [
          {
            type: 'tekst',
            inhoud:
              'Een deel van je leerlingen in het eerste jaar is nog geen dertien, en de meeste chatbots laten pas vanaf die leeftijd een eigen account toe. Daarom is er voor de eerste graad <strong>AI-wijs Start</strong>: zes korte lessen die je <em>klassikaal</em> geeft. Jij toont op het digibord, je leerlingen doen mee in de browser, zonder account en zonder chatbot. Start bouwt verder op wat leerlingen in het lager met Leerlichtjes deden, en maakt de brug naar AI-wijs op school in de tweede graad. Je geeft de zes lessen in twee lesuren, of elke les los. Er is een bordmodus met grote letters, een slotquiz van tien situaties en een paspoort om af te drukken.',
          },
          {
            type: 'lijst',
            geordend: true,
            items: [
              '<strong>Waarom zie jij dit filmpje?</strong> Hoe een app kiest wat je ziet, en hoe je zelf het stuur neemt.',
              '<strong>Echt, gemaakt of misleidend?</strong> Drie vragen voor je een beeld gelooft of doorstuurt.',
              '<strong>Wat vertel je een chatbot?</strong> Welke gegevens je niet intypt, en waarom er een leeftijdsgrens is.',
              '<strong>Een chatbot als vriend?</strong> Wat een vriend kan en een chatbot niet.',
              '<strong>Jouw beeld is van jou.</strong> Over nagemaakte naaktbeelden en afpersing: wat je doet en waar je hulp vindt.',
              '<strong>Leren of laten doen.</strong> Welke hulp je laat leren, met een eerste prompt die jij intypt.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Twee dingen die je vooraf regelt',
            inhoud:
              'Les 5 gaat over <strong>deepnudes</strong>, nagemaakte naaktbeelden van echte mensen, en <strong>sextortion</strong>, afpersing met zo\'n beeld. Verwittig vooraf de leerlingenbegeleiding en het CLB; ze kunnen erbij zijn. En de stap <em>Probeer het zelf</em> bij sommige lessen is voor wie dertien is. Ze gebeurt alleen op school, onder jouw begeleiding, met de chatbot die je school aanbiedt en volgens haar afspraken: nooit thuis, nooit als huiswerk. De volledige handleiding, met een variant zonder computer per les en een brief voor de ouders, staat op de pagina <em>Voor leerkrachten</em> van AI-wijs Start. Je vindt Start via het overzicht van deze leeromgeving en op de voorpagina.',
          },
        ],
      },
    ],
  },
];
