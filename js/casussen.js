// Casussen voor het groepswerk "Mag dit?" in workshop A3.
//
// Bewust gespreid over mag / mag niet / hangt ervan af. De gevallen met
// "hangt ervan af" zijn de belangrijkste: daar ontstaat het gesprek. Elk
// oordeel blijft in de app verborgen tot de lezer klikt.
//
// De gespreksvraag bij elke casus verschijnt enkel in begeleidersmodus.
//
// VERIFICATIE: alle veertien casussen zijn op 3 september 2026 nagekeken op
// juridische juistheid, didactische werking en Vlaamse herkenbaarheid, en
// daarna gecorrigeerd. Wat je hierna toevoegt, is nog niet nagekeken.
//
// De volgorde binnen elke les is bewust: elke reeks toont vroeg een geval waar
// het antwoord "mag" is, zodat een groepje dat de reeks niet uitkrijgt niet
// enkel verboden heeft gezien.

export const MODULE_CASUSSEN = {
  id: "casussen",
  icoon: "⚖️",
  titel: "Casussen: mag dit?",
  ondertitel: "Veertien situaties uit de praktijk om in groep te beoordelen.",
  duur: "25 min",
  niveau: "Essentieel",
  doelen: [
    "Je kan een concrete situatie beoordelen in plaats van een regel opdreunen.",
    "Je herkent de gevallen waar het antwoord \"hangt ervan af\" is, en waarom.",
    "Je weet bij wie je terechtkan als je er zelf niet uit raakt.",
  ],
  lessen: [
    {
      id: "casus-privacy",
      titel: "Persoonsgegevens en privacy",
      blokken: [
        {
          type: "tekst",
          inhoud: "Lees de situatie, beslis eerst zelf of in je groepje — <strong>mag dit, mag dit niet, of hangt het ervan af?</strong> — en klik dan pas op het oordeel. De helft van de waarde zit in het gesprek dat je ervoor voert.",
        },
        {
          type: "casus",
          titel: "Het CLB-verslag samenvatten",
          situatie: "Meester Wim geeft les in het zesde leerjaar. Voor het zorgoverleg (MDO) van volgende week wil hij samen met de zorgcoördinator een CLB-verslag van acht pagina's terugbrengen tot een halve pagina. Hij plakt het volledige verslag in een gesprek met zijn AI-assistent en vraagt om een korte samenvatting met de belangrijkste aandachtspunten.",
          oordeel: "mag-niet",
          toelichting: "Een CLB-verslag bevat gegevens over de gezondheid en het zorgtraject van één kind. Dat zijn geen gewone gegevens: de privacywetgeving is daar extra streng in, en of zoiets in een AI-tool mag, beslist een leerkracht niet alleen. De naam wegknippen helpt hier trouwens weinig — een verslag met die inhoud is binnen een schoolteam meteen herleidbaar. Ook je schoolaccount lost dit niet op. Er speelt hier namelijk nog iets naast de privacywetgeving: het CLB werkt onder beroepsgeheim. Wat jij uit zo'n verslag te weten komt, kreeg je in vertrouwen om dit kind te begeleiden — niet om het elders in te plakken. Jij hebt zelf geen beroepsgeheim, maar wel de plicht om discreet om te springen met wat je zo verneemt, en dat verandert niet omdat je school een contract met een leverancier heeft. Wat sowieso veilig is: laat je assistent eerst een leeg sjabloon maken voor je overlegfiche — welke rubrieken, hoeveel zinnen per rubriek, welke toon — en vul dat zelf in met het verslag ernaast. Je wint tijd op de vorm, en de inhoud blijft waar ze hoort. Is het toch al gebeurd? Meld het bij je zorgcoördinator, je directie of de DPO van de scholengroep in plaats van het stil te houden.",
          discussie: "Wat als Wim maar één zin overneemt, zonder naam: \"nood aan verlengde instructie bij rekenen\"? Waar ligt voor jullie de grens tussen een zorggegeven en een gewone pedagogische vraag — en wie op school beslist waar die grens ligt?",
        },
        {
          type: "casus",
          titel: "Enkel de voornaam, toch?",
          situatie: "Mevrouw Lien geeft Nederlands in het derde jaar. Ze wil de ouders mailen van een leerling die de laatste weken vaak te laat komt, en typt: \"Schrijf een bezorgde maar vriendelijke mail over Yassine uit 3A, die sinds de scheiding van zijn ouders drie keer per week te laat komt.\" Ze vindt dat veilig — er staat geen familienaam in.",
          oordeel: "mag-niet",
          toelichting: "Een voornaam plus een klasaanduiding wijst binnen één school naar één leerling. En de reden die erbij staat gaat over de thuissituatie van een gezin: precies het soort informatie die je zo weinig mogelijk rondstuurt. Let op wat hier wél kan, want dat is het echte lesmoment: laat de identificatie vallen, maar hou de situatie. \"Ik moet de ouders mailen van een leerling van veertien die de laatste weken drie keer per week te laat komt. Er speelt thuis iets moeilijks. Ik wil bezorgd klinken, niet beschuldigend, en een gesprek voorstellen.\" Daar staat geen naam en geen klas in, en je krijgt net wél de mail die je zocht — je vraagt hulp met de toon, en die kan je enkel krijgen als de context erin blijft. De naam en de aanspreking typ je er pas in Smartschool zelf bij. En het schoolaccount? Dat is beter geregeld dan je privéaccount, maar het maakt deze prompt niet in orde: zo weinig mogelijk gegevens delen blijft ook daar gelden.",
          discussie: "Lien zegt: \"Yassine is een veelvoorkomende naam, dat kan van eender welke school zijn.\" Houdt dat stand als het gesprek onder haar eigen account loopt? En de lastigere vraag: hoeveel van die thuissituatie mag er in de prompt blijven staan? Leg deze casus naast die van juf Amina hierna — ook een kind na een scheiding, en die krijgt wél \"mag\". Waar zit voor jullie het verschil?",
        },
        {
          type: "casus",
          titel: "Een gesprek met een verdrietig kind",
          situatie: "Juf Amina merkt dat een kind uit haar tweede leerjaar sinds enkele weken opvallend stiller is; ze weet dat de ouders uit elkaar zijn. Ze wil het kind aanspreken maar weet niet goed hoe ze begint. Ze vraagt: \"Geef me vijf manieren om als leerkracht lager onderwijs een gesprek te openen met een kind van zeven dat het thuis moeilijk heeft, en zeg erbij wat ik beter niet vraag.\"",
          oordeel: "mag",
          toelichting: "Hier verlaat er niets identificeerbaars de school: geen naam, geen klas, geen detail dat naar één gezin leidt. Dit is een algemene pedagogische vraag, en zo geformuleerd mag ze gewoon. De vraag is trouwens goed gebouwd: door er \"en zeg erbij wat ik beter niet vraag\" aan toe te voegen, krijgt Amina meteen ook de grenzen mee in plaats van enkel een lijstje tips. Wat wél hoort: meld wat je ziet aan je zorgcoördinator vóór je het gesprek voert. Een kind dat weken stiller is, hoort thuis in het zorgoverleg — dan sta je er niet alleen voor en beslis je samen wie het gesprek best voert. En lees de tips kritisch: advies over praten met een kind klinkt altijd vlot, maar kan aanvoelen alsof het uit een therapieboek komt. Neem enkel de zinnen over die je zelf ook zou zeggen, en laat het inschatten van wat er thuis speelt aan het CLB.",
          discussie: "Waar kantelt deze vraag wél? Zoek als groepje één zin die je kan toevoegen om er een \"hangt ervan af\" van te maken, en één die er een \"mag niet\" van maakt. Tip: de \"mag niet\"-zin vinden jullie snel via herkenbaarheid. Voor de \"hangt ervan af\"-zin: kijk naar wat je de assistent laat dóén in plaats van naar wat je erin typt.",
        },
        {
          type: "casus",
          titel: "Snel iets thuis op de bank",
          situatie: "Meneer Ilias geeft Frans in het secundair. De school regelde accounts voor alle leerkrachten, maar 's avonds werkt hij gewoon verder op de assistent die hij al een jaar privé gebruikt en goed kent. Vanavond laat hij er een reeks oefeningen op de passé composé mee maken; morgenavond wil hij er vijf ingescande leerlingentaken doorjagen voor feedback.",
          oordeel: "hangt-ervan-af",
          toelichting: "Voor die oefeningenreeks zit er niets persoonlijks in: dat is lesmateriaal, en daar is een privéaccount doorgaans geen probleem voor — tenzij het AI-beleid of het ICT-reglement van jullie school iets anders afspreekt. Bij die ingescande taken ligt het anders. Daar staan namen, handschrift en persoonlijke inhoud van leerlingen op, en de school blijft verantwoordelijk voor die gegevens, ook als jij ze 's avonds van thuis doorstuurt. Op een privéaccount heeft niemand van de school daar zicht op. Wat wél kan: hou je privéaccount voor materiaal zonder leerlinggegevens, en doe alles waar leerlingen in voorkomen op het schoolaccount. Maar dat schoolaccount is geen vrijgeleide — ook daar geldt de vuistregel. Haal de namen eraf voor je scant, of typ zelf over wat je precies wil laten nakijken; voor vijf taken kost dat je een paar minuten. Weet je niet of jullie school afsprak dat werk van leerlingen geüpload mag worden, dan is de DPO van de scholengroep het aanspreekpunt.",
          discussie: "Wat spreken jullie af als de school wél accounts heeft maar bijna niemand ze gebruikt omdat het privéaccount vlotter aanvoelt? En: als de school accounts regelde, mag je er dan zomaar van uitgaan dat ingescande leerlingentaken erop mogen? Wie weet bij jullie of dat afgesproken is?",
        },
        {
          type: "casus",
          titel: "Foto's van posters laten nakijken",
          situatie: "Juf Sofie laat haar vierde leerjaar per twee posters maken over de zeeklassen. Ze fotografeert de twaalf posters en wil ze uploaden naar haar AI-assistent, met de vraag om per poster twee tips te geven, op kindermaat geformuleerd. Op de meeste posters staan de voornamen van de makers in de hoek, en op één poster kleefde een duo een afgedrukte foto van de hele groep op het strand.",
          oordeel: "hangt-ervan-af",
          toelichting: "Het verschil zit volledig in wat er op de foto staat. Op een poster zonder namen en zonder gezichten valt niets meer te herleiden naar één kind, en dan is tips laten formuleren prima. Dat is geen vrijgeleide voor álle leerlingenwerk: een opstel of een \"wie ben ik\"-blad blijft persoonlijk, ook zonder naam erboven. De voornamen in de hoek zijn het lichtste geval, maar ze horen er evenmin in — samen met de klas en de school wijzen ze naar één kind, en voor de tips die je vraagt dienen ze nergens toe. Een herkenbare foto van kinderen hoort sowieso niet in een AI-gesprek: de toestemming die ouders gaven voor de schoolwebsite of Smartschool is voor dát doel gegeven en dekt dit niet. Wat wél kan: fotografeer net buiten de naamhoek of plak die even af, laat de poster met de groepsfoto uit de reeks en geef dat duo zelf je twee tips. Lees na wat je terugkrijgt vóór je het doorgeeft — jij kent die kinderen, de assistent helpt je alleen verwoorden. Twijfel je over beeldmateriaal, kijk dan wat het beeldbeleid van de school zegt.",
          discussie: "Sofie zegt: \"die naampjes zijn op de foto toch amper leesbaar.\" Is slecht leesbaar hetzelfde als niet aanwezig — en wie beslist dat, jij op je scherm of de assistent die inzoomt? En hoe zit dat met werk waar leerlingen iets persoonlijks in schrijven, zoals een dagboekfragment of een \"wie ben ik\"-blad?",
        },
        {
          type: "casus",
          titel: "Een puntenlijst laten analyseren",
          situatie: "Mevrouw Hanne geeft wiskunde in het vijfde jaar. Na een toets kopieert ze haar resultatentabel uit Smartschool in de assistent: geen namen, enkel de volgnummers 1 tot 22 en per rij de score op elke vraag. De rijen staan nog in de volgorde van haar klaslijst, en in de laatste kolom staan haar eigen notities — bij twee rijen \"verlengde tijd\", bij één \"ingehaald na ziekte\". Ze vraagt welke vragen opvallend slecht gemaakt zijn en wat dat zegt over haar lesopbouw.",
          oordeel: "hangt-ervan-af",
          toelichting: "De vraag zelf is uitstekend, en je hebt er geen enkele naam voor nodig: kijken welke vraag de klas als geheel niet maakte, is een van de nuttigste dingen die je met een assistent doet. Twee dingen maken deze tabel toch geen simpel ja. De notitiekolom is het echte probleem — \"verlengde tijd\" en \"ingehaald na ziekte\" zijn zorggegevens en horen er sowieso niet in. En zolang de rijen in de volgorde van je klaslijst staan, zijn die volgnummers geen anonimisering maar een codering: met de klaslijst ernaast is alles weer leesbaar, en enkel de rijen husselen helpt niet, want het nummer verhuist mee. Wat wél kan: plak enkel de scorekolommen, laat de notities en de klasnaam weg, en laat de nummerkolom vallen of vervang ze door willekeurige labels. Je plakt een kopie — je eigen tabel hou je, dus je verliest niets. Het vak en het leerjaar mag je gerust vermelden: die zeggen niets over een leerling en maken de analyse net beter. Lees ten slotte de conclusie kritisch na: een assistent rekent en telt niet altijd juist op zo'n tabel, en dat vraag 7 slecht ging kan even goed aan je vraagstelling liggen als aan je uitleg.",
          discussie: "Verandert jullie oordeel als Hanne dezelfde tabel gebruikt om te vragen \"welke leerlingen moet ik opvolgen\"? En als het om een groep van zes leerlingen gaat in plaats van tweeëntwintig?",
        },
        {
          type: "casus",
          titel: "Hulp bij een lastige mail",
          situatie: "Mevrouw An is graadcoördinator in de tweede graad. Een collega is al drie keer op rij te laat met zijn punten in Smartschool, telkens vlak voor de klassenraad, en An wil daar eindelijk over mailen. Ze plakt de volledige mailwisseling van de voorbije weken in haar assistent — met naam, handtekening en de zin waarin de collega uitlegt dat het door zijn ziekteperiode kwam — en vraagt om een correcte maar duidelijke mail.",
          oordeel: "mag-niet",
          toelichting: "Ook collega's hebben persoonsgegevens, en de reden die hij geeft — een ziekteperiode — is een gezondheidsgegeven, precies het soort waar de wet extra streng in is. Hij heeft er bovendien nooit voor gekozen om in dat gesprek te belanden, en in zo'n doorgestuurde mailwisseling zitten vaak nog anderen: collega's in cc, soms leerlingen die bij naam genoemd worden. Wat wél kan: beschrijf de situatie zonder de wisseling te plakken — \"een collega levert herhaaldelijk te laat aan en heeft daar een persoonlijke reden voor; ik wil vriendelijk maar duidelijk zijn, en ik wil dat het niet nog eens gebeurt\" — en pas de mail die je terugkrijgt zelf aan. Je zoekt de toon, en die krijg je ook zo.",
          discussie: "An zegt: \"dan mag ik dus nooit iets over een collega vragen.\" Waar ligt de grens tussen een algemene situatie en een herkenbare persoon? En zou An het anders bekijken als de mail over haarzelf ging?",
        },
      ],
    },
    {
      id: "casus-leerlingen",
      titel: "Leerlingen, grenzen en beoordelen",
      blokken: [
        {
          type: "tekst",
          inhoud: "Deze reeks gaat over wat je als leerkracht wel en niet uit handen geeft, en over leerlingen die zelf met AI werken. Ook hier: eerst beslissen, dan klikken.",
        },
        {
          type: "casus",
          titel: "Spelling nalezen bij dyslexie",
          situatie: "Een leerling van het vierde jaar met dyslexie mag volgens zijn STICORDI-maatregelen — de redelijke aanpassingen die in zijn zorgfiche staan — hulpmiddelen gebruiken bij schrijfopdrachten. Voor een taak geschiedenis schrijft hij zijn tekst volledig zelf en laat hij die daarna door een AI-assistent nalezen op spelling en zinsbouw. Een collega vindt dat oneerlijk tegenover de rest van de klas.",
          oordeel: "mag",
          toelichting: "Deze leerling schreef zelf, en zijn STICORDI-afspraken laten hulpmiddelen toe bij schrijfopdrachten — ook al stond deze vorm van hulp er nog niet met naam in. Toch heeft je collega een punt dat je niet moet wegwuiven: spelling laten verbeteren is iets anders dan zinsbouw laten herschrijven. Bij het eerste blijft de tekst van de leerling, bij het tweede niet altijd. De bruikbare afspraak: laat de assistent aanduiden wát er misloopt en waarom, en laat de leerling het zelf aanpassen. Dan compenseer je het schrijfprobleem zonder het schrijfwerk over te nemen, en valt het verwijt van oneerlijkheid weg. De vraag die daarna telt, is wat je met deze taak wil meten. Meet je kennis van geschiedenis, dan is de taalverzorging geen onderdeel van het punt en is die hulp gewoon een redelijke aanpassing. Wat wél nodig is: leg het vooraf vast via de cel leerlingenbegeleiding en de klassenraad, en schrijf de regel bij de opdracht zelf — bijvoorbeeld \"wie volgens zijn vastgelegde aanpassingen hulpmiddelen mag gebruiken, mag deze taak laten nalezen op spelling\". Zo staat de regel er voor iedereen en lijkt ze geen gunst, zonder dat je voor de klas moet zeggen wie dyslexie heeft. Wil de leerling er zelf open over zijn, dan mag dat gerust — maar dat is zijn keuze, niet de jouwe.",
          discussie: "En bij een taak Nederlands waar spelling wél beoordeeld wordt: mag het dan nog, of vervalt de aanpassing net daar? En zou je dezelfde hulp toestaan aan een leerling zonder vastgelegde aanpassingen die er gewoon om vraagt?",
        },
        {
          type: "casus",
          titel: "Zestig opstellen, één avond",
          situatie: "Een leerkracht Nederlands in de derde graad heeft zestig opstellen liggen tegen de deliberatie. Ze plakt ze één voor één in een AI-assistent, met de vraag om telkens een punt op twintig te geven en een korte motivering. Die punten neemt ze integraal over in Smartschool.",
          oordeel: "mag-niet",
          toelichting: "Eerst het eerlijke stuk: zestig opstellen tegen de deliberatie is een reëel probleem, en \"doe het dan maar met de hand\" is geen antwoord. Maar dit loopt op twee punten fout. Een opstel is geen oefenblad: leerlingen schrijven er eigen ervaringen en meningen in, en de naam eraf knippen maakt die inhoud niet ineens neutraal. En het punt komt niet meer van haar — een assistent kent haar beoordelingskader niet, is niet consistent over zestig werken heen, en zij is degene die dat punt moet verdedigen op de klassenraad en op het oudercontact. Ook met alle namen weggeknipt blijft het antwoord dus nee: het privacyprobleem los je daarmee op, het beoordelingsprobleem niet. Wat wél kan, en wat echt tijd wint: laat vooraf je verbetersleutel aanscherpen tot heldere criteria met een puntenverdeling, verbeter dan zelf met korte steekwoorden per leerling, en laat op het einde in één keer al die steekwoorden (\"structuur ontbreekt, sterke woordenschat, geen besluit\") omzetten in leesbare feedbackzinnen, zonder namen. Zij beoordeelt, de assistent verwoordt. En omdat deze punten meetellen voor de deliberatie: hoe ver je hierin gaat, is geen individuele keuze meer — dat hoort op de vakwerkgroep en bij het evaluatiebeleid van de school.",
          discussie: "Stel dat ze de opstellen anonimiseert en het AI-punt alleen naast haar eigen punt legt om de uitschieters op te sporen — dus niet om het over te nemen. Is het privacybezwaar daarmee van tafel, en blijft het beoordelingsbezwaar dan nog overeind? En maakt het verschil of het om een oefentoets gaat of om punten die meetellen voor de deliberatie?",
        },
        {
          type: "casus",
          titel: "De detector zegt 98 procent",
          situatie: "Een leerkracht geschiedenis vindt de taak van een leerling uit het vijfde jaar verdacht vlot geschreven. Hij haalt de tekst door een gratis online AI-detector, die \"98% door AI geschreven\" meldt. Hij zet een nul, mailt de ouders en verwijst naar dat percentage als bewijs.",
          oordeel: "mag-niet",
          toelichting: "Hier lopen drie dingen fout. Eén: zo'n percentage bewijst niets. AI-detectors geven geregeld vals alarm, zeker bij leerlingen die heel verzorgd of formeel schrijven en bij leerlingen die het Nederlands niet als thuistaal hebben — en omgekeerd glipt een lichtjes herwerkte AI-tekst er gewoon door. Ze kunnen sowieso niet aantonen wie welke zin schreef. Twee: de tekst van één herkenbare leerling belandt in een gratis dienst waarmee de school geen enkele afspraak heeft; dezelfde regel als bij alle andere leerlinggegevens geldt ook hier. Drie: een nul zetten en de ouders mailen doe je niet in je eentje. Hoe je met een vermoeden van onregelmatigheid omgaat, staat in het school- en evaluatiereglement, en dat loopt via de directie en de klassenraad — niet via één leerkracht en één percentage. Wat wél kan: leg het percentage opzij en steun je gesprek er niet op, maar wees wel eerlijk tegen de leerling dat de tekst je opviel; hij hoort te weten waarover het gaat. Vraag de kladversies of de bronnen op, laat hem zijn tekst mondeling toelichten, en spreek vooraf per opdracht af wat met AI mag, zodat je achteraf niets meer hoeft te bewijzen.",
          discussie: "Stel dat de leerling na het gesprek toegeeft dat hij de tekst liet schrijven. Maakt dat de manier waarop hij betrapt werd achteraf toch aanvaardbaar? En als hij blijft volhouden dat hij het zelf schreef: bij wie ligt dan de bewijslast?",
        },
        {
          type: "casus",
          titel: "Eigen account in het vijfde leerjaar",
          situatie: "Juf Nathalie laat haar vijfde leerjaar een opzoekopdracht over dieren maken voor wereldoriëntatie. Drie leerlingen hebben thuis een eigen account bij een AI-assistent en vragen of ze dat op de klaslaptops mogen gebruiken. Op school is daar niets over afgesproken. De juf vindt het wel handig en laat het toe.",
          oordeel: "mag-niet",
          toelichting: "De meeste AI-diensten hanteren een minimumleeftijd waar tien- en elfjarigen niet aan komen. En het verschil met thuis is niet flauw: thuis beslissen de ouders, hier beslis jij — in de lestijd, op materiaal van de school. Zodra jij het toelaat, doet de school mee, ook al staat dat account op naam van het kind. Daar komt bij dat je op drie schermen tegelijk niet ziet wat er gevraagd wordt en wat er terugkomt, en dat drie leerlingen iets mogen wat de andere negentien niet hebben, gewoon omdat het thuis geregeld is. Wat wél kan: hou de opzoekopdracht zelf AI-vrij, en plan de AI klassikaal in op het smartboard met jouw schoolaccount. De leerlingen dicteren de vraag, jij typt, en samen kijken jullie of het antwoord klopt — dat is trouwens de sterkere les: ze leren een antwoord beoordelen in plaats van het over te schrijven. Meld het daarna aan je ICT-coördinator of directie: deze vraag komt volgend schooljaar terug, en dan liefst met een afspraak voor de hele school in plaats van per klas.",
          discussie: "Wat doe je met de leerling die het thuis elke avond voor zijn huiswerk gebruikt? Is dat jouw zaak, of die van de ouders? En verandert jullie antwoord bij dertienjarigen in het eerste jaar secundair? Kijk dan eerst na wat de dienst zelf vraagt: de ene laat enkel volwassenen toe, de andere vanaf dertien op voorwaarde dat de ouders akkoord gaan. En ook als de leeftijd klopt, blijft het een privéaccount waar de school geen zicht op heeft — wie beslist er bij jullie dan of het in de les mag?",
        },
        {
          type: "casus",
          titel: "Onderaan de spreekbeurt",
          situatie: "Een leerling van het zesde leerjaar geeft zijn spreekbeurt over vulkanen af. Onderaan heeft hij er zelf bij geschreven: \"Ik heb met de AI-assistent van mama ideeën gezocht en moeilijke woorden laten uitleggen.\" De meester had vooraf niets over AI gezegd en twijfelt nu of hij punten moet aftrekken.",
          oordeel: "hangt-ervan-af",
          toelichting: "Zonder afspraak vooraf kan je moeilijk achteraf sanctioneren, en deze leerling deed net wat je wil zien: hij was open. Waar het van afhangt, is wat de assistent precies deed. Ideeën zoeken en woorden laten uitleggen is iets anders dan de spreekbeurt laten schrijven, en dat verschil hoor je meteen als je het vraagt. Wat wél kan: vraag hem hoe hij het aanpakte en welke stukken van hem zijn, benoem hardop dat je die vermelding apprecieert, en zet vanaf de volgende opdracht in twee zinnen bovenaan het blad wat wel en niet mag.",
          discussie: "Als je hier punten aftrekt, wat leert de rest van de klas daar dan uit over eerlijk zijn? En hoe zit het met de leerling die exact hetzelfde deed maar niets vermeldde: die krijgt zijn punten gewoon.",
        },
        {
          type: "casus",
          titel: "Vervangles met geleende uitleg",
          situatie: "Een leerkracht moet onverwacht een vervangles aardrijkskunde geven over platentektoniek, een onderwerp dat hij zelf niet geeft. Hij vraagt een AI-assistent om een heldere uitleg voor het derde jaar, plakt die op enkele dia's en projecteert ze zoals ze zijn. Er zit een mooie vergelijking met een gebarsten eierschaal in, maar ook jaartallen, cijfers over aardbevingen en de naam van een breuklijn.",
          oordeel: "hangt-ervan-af",
          toelichting: "Het hangt af van wát hij overneemt. De opbouw, de volgorde en die eierschaal: geen probleem, daar ziet hij zelf wel of het deugt. De feiten wél: jaartallen, cijfers en eigennamen zijn precies wat een assistent overtuigd fout invult, en de klas krijgt ze als waarheid mee. Wat wél kan: gebruik de uitleg als eerste versie, leg de cijfers naast het handboek van de vakcollega, laat weg wat je niet kan checken, of draai het om en zet er bewust één fout in die de klas mag zoeken.",
          discussie: "Waar ligt voor jullie de grens tussen \"vorm\" en \"feit\"? En de lastigste: als je het vak zelf niet geeft, hoe weet je dan wat je moet nachecken?",
        },
        {
          type: "casus",
          titel: "Het verslag voor het CLB",
          situatie: "Een zorgleerkracht in het lager onderwijs bereidt een overleg met het CLB voor over een leerling met ernstige leesproblemen. Hij heeft twee bladzijden losse observatienotities en amper tijd. Hij overweegt die notities in een AI-assistent te plakken en er een net verslag van te laten maken.",
          oordeel: "hangt-ervan-af",
          toelichting: "Het hangt volledig af van wat er in die notities staat. Naam, geboortedatum, thuissituatie, medische of zorggegevens: die gaan er niet in, dat is precies waarvoor de vuistregel bestaat. Wat wél kan: haal de identificerende gegevens eruit, werk met [LEERLING] en algemene omschrijvingen, en laat enkel de vorm verzorgen. Let daarbij op dezelfde valkuil als bij het CLB-verslag van meester Wim in de eerste reeks: [LEERLING] boven je tekst zetten is nog geen anonimiseren. Als wat overblijft — het leerjaar, de aard van het probleem, de hulp die het kind al krijgt — binnen jouw school nog naar één kind wijst, dan heb je enkel de naam weggelaten en hoort het er niet in. Blijf je bij algemene omschrijvingen (\"een leerling van negen die traag en radend leest\"), dan kan het meestal wel, maar jij bent degene die kan inschatten of het bij jullie nog herkenbaar is. Twijfel je, dan neem je de veilige variant van bij Wim: laat een leeg sjabloon voor je observatieverslag maken — welke rubrieken, hoeveel zinnen per rubriek — en vul dat zelf in met je notities ernaast. En hou de conclusies bij jezelf: op het zorgoverleg (MDO) rekenen het CLB en je collega's op jouw inschatting, niet op een vlotte samenvatting. Bij twijfel over wat mag: de DPO van de scholengroep is daarvoor het aanspreekpunt.",
          discussie: "Is een tekst waar alleen de naam uit weg is nog echt anoniem? In een school met tweehonderd leerlingen wijst \"een leerling van het derde leerjaar met ernstige leesproblemen en een broer in het zesde\" maar naar één kind. En wie beslist bij jullie of dit mag: de leerkracht zelf, de directie of de DPO?",
        },
      ],
    },
  ],
};
