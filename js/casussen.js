// Casussen voor het groepswerk "Mag dit?" in workshop A3.
//
// Bewust gespreid over mag / mag niet / hangt ervan af. De gevallen met
// "hangt ervan af" zijn de belangrijkste: daar ontstaat het gesprek. Elk
// oordeel blijft in de app verborgen tot de lezer klikt.
//
// De gespreksvraag bij elke casus verschijnt enkel in begeleidersmodus.

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
          situatie: "Meester Wim geeft les in het zesde leerjaar. Voor de klassenraad van volgende week moet hij een CLB-verslag van acht bladzijden terugbrengen tot een halve pagina. Hij kopieert het volledige verslag in zijn AI-assistent en vraagt om een korte samenvatting met de belangrijkste aandachtspunten.",
          oordeel: "mag-niet",
          toelichting: "Een CLB-verslag staat vol zorg- en gezondheidsgegevens van één kind, en die horen niet buiten de school terecht te komen. De naam wegknippen helpt hier weinig: een verslag met die inhoud is binnen een schoolteam meteen herleidbaar. Wat wél kan: laat je assistent eerst een leeg sjabloon maken voor een klassenraadfiche — welke rubrieken, hoeveel zinnen per rubriek, welke toon — en vul dat zelf in met het verslag ernaast. Je wint tijd op de vorm, en de inhoud blijft binnen de school.",
          discussie: "Wat als Wim maar één zin overneemt, zonder naam: 'nood aan verlengde instructie bij rekenen'? Waar ligt voor jullie de grens tussen een zorggegeven en een gewone pedagogische vraag?",
        },
        {
          type: "casus",
          titel: "Enkel de voornaam, toch?",
          situatie: "Mevrouw Lien geeft Nederlands in het derde jaar. Ze wil de ouders mailen van een leerling die de laatste weken vaak te laat komt, en typt: 'Schrijf een bezorgde maar vriendelijke mail over Yassine uit 3STW, die sinds de scheiding van zijn ouders drie keer per week te laat komt.' Ze vindt dat veilig — er staat geen familienaam in.",
          oordeel: "mag-niet",
          toelichting: "Een voornaam plus een klas plus een school maakt één leerling perfect herkenbaar, en de reden die erbij staat is precies het soort gevoelige informatie over een thuissituatie dat nergens buiten de school hoort. Wat wél kan: vraag een mail over 'een leerling van veertien die de laatste weken regelmatig te laat komt'. De naam, de klas en de achtergrond vul je pas in je eigen mailprogramma in — dat kost je tien seconden en de mail die je terugkrijgt is even goed.",
          discussie: "Lien zegt: 'Yassine is een veelvoorkomende naam, dat kan van eender welke school zijn.' Houdt dat argument stand? En verandert er iets als ze dit op haar schoolaccount doet in plaats van thuis?",
        },
        {
          type: "casus",
          titel: "Snel iets thuis op de bank",
          situatie: "Meneer Bart geeft Frans in het secundair. De school regelde accounts voor alle leerkrachten, maar 's avonds werkt hij gewoon verder op de assistent die hij al een jaar privé gebruikt en goed kent. Vanavond laat hij er een reeks oefeningen op de onvoltooid verleden tijd mee maken; morgenavond wil hij er vijf ingescande leerlingentaken doorjagen voor feedback.",
          oordeel: "hangt-ervan-af",
          toelichting: "Voor die oefeningenreeks zit er niets persoonlijks in: dat is lesmateriaal, en daar is een privéaccount doorgaans geen probleem voor. Bij ingescande taken ligt het anders — dan gaan gegevens van leerlingen naar een account waarover de school geen enkele afspraak heeft en waar niemand zicht op heeft. Wat wél kan: alles waar leerlingen in voorkomen doe je op het schoolaccount, je privéaccount hou je voor materiaal zonder leerlinggegevens. Wil je het jezelf makkelijk maken: gebruik overal het schoolaccount, dan moet je die afweging nooit meer maken.",
          discussie: "Wat spreken jullie af als de school wél accounts heeft maar bijna niemand ze gebruikt omdat het privéaccount vlotter aanvoelt? Wie kan daar iets aan doen — de directie, de ICT-coördinator, of de DPO van de scholengroep?",
        },
        {
          type: "casus",
          titel: "Foto's van posters laten nakijken",
          situatie: "Juf Sofie laat haar vierde leerjaar posters maken over de zeeklassen. Ze fotografeert de twaalf posters en uploadt ze naar haar AI-assistent met de vraag om per poster twee tips te geven, op kindermaat geformuleerd. Op de meeste posters staat de voornaam van de maker in de hoek, en op één poster kleefde een groepje een echte klasfoto.",
          oordeel: "hangt-ervan-af",
          toelichting: "Het verschil zit volledig in wat er op de foto staat. Een poster zonder namen of gezichten is gewoon lesmateriaal, en daar feedback op laten formuleren is prima. Een herkenbare foto van kinderen is dat niet: beeldmateriaal van leerlingen hoort niet in een AI-gesprek, en de toestemming die ouders gaven voor de schoolwebsite of de schoolapp dekt dit niet. Wat wél kan: fotografeer net buiten de naamhoek of plak die even af, en laat de poster met de klasfoto gewoon uit de reeks.",
          discussie: "Sofie zegt: 'die naampjes zijn op de foto toch amper leesbaar.' Is slecht leesbaar hetzelfde als niet aanwezig? En hoe zit dat met werk waar leerlingen iets persoonlijks in schrijven, zoals een dagboekfragment of een 'wie ben ik'-blad?",
        },
        {
          type: "casus",
          titel: "Een puntenlijst laten analyseren",
          situatie: "Meneer Koen geeft wiskunde in het vijfde jaar. Na een toets plakt hij zijn resultatentabel in de assistent: geen namen, enkel de volgnummers 1 tot 22 en per rij de score op elke vraag. Hij vraagt welke vragen opvallend slecht gemaakt zijn en wat dat zegt over zijn lesopbouw.",
          oordeel: "hangt-ervan-af",
          toelichting: "Losse cijfers zonder namen zijn meestal onschuldig, en dit is trouwens een van de nuttigste dingen die je met een assistent kan doen. Twee details bepalen of het ook echt veilig is: of die volgnummers overeenkomen met de vaste volgorde van je klaslijst — dan is de tabel met één blik naast die lijst weer herleidbaar — en of je dit op het schoolaccount doet. Wat wél kan: hussel de rijen door elkaar voor je ze kopieert, en laat klasnaam, vak en datum eruit. Aan je analyse verandert dat niets.",
          discussie: "Verandert jullie oordeel als Koen dezelfde tabel gebruikt om te vragen 'welke leerlingen moet ik opvolgen'? En als het om een groep van zes leerlingen gaat in plaats van tweeëntwintig?",
        },
        {
          type: "casus",
          titel: "Hulp bij een lastige mail",
          situatie: "Mevrouw An trekt de vakwerkgroep aardrijkskunde. Een collega bezorgt al drie keer op rij zijn punten te laat en An wil daar eindelijk over mailen. Ze plakt de volledige mailwisseling van de voorbije weken in haar assistent — met naam, handtekening en de zin waarin de collega uitlegt dat het door zijn ziekteperiode kwam — en vraagt om een correcte maar duidelijke mail.",
          oordeel: "mag-niet",
          toelichting: "Ook collega's hebben persoonsgegevens, en 'hij was ziek' is er meteen een van het gevoelige soort. Zij hebben er bovendien nooit voor gekozen om in dat gesprek te belanden. Wat wél kan: beschrijf de situatie in algemene termen — 'een collega levert herhaaldelijk te laat aan en heeft daar een geldige reden voor; ik wil vriendelijk maar duidelijk zijn' — en pas de mail die je terugkrijgt zelf aan. Voor dit soort hulp is het resultaat even bruikbaar, want het is de toon die je zoekt, niet de feiten.",
          discussie: "An zegt: 'dan mag ik dus nooit iets over een collega vragen.' Waar ligt de grens tussen een algemene situatie en een herkenbare persoon? En zou An het anders bekijken als de mail over haarzelf ging?",
        },
        {
          type: "casus",
          titel: "Een gesprek met een verdrietig kind",
          situatie: "Juf Els merkt dat een kind uit haar tweede leerjaar sinds enkele weken opvallend stiller is; ze weet dat de ouders uit elkaar zijn. Ze wil het kind aanspreken maar weet niet goed hoe ze begint. Ze vraagt: 'Geef me vijf manieren om als leerkracht lager onderwijs een gesprek te openen met een kind van zeven dat het thuis moeilijk heeft, en zeg erbij wat ik beter niet vraag.'",
          oordeel: "mag",
          toelichting: "Hier verlaat geen enkel gegeven van dat kind de school: geen naam, geen klas, geen detail dat naar één gezin leidt. Dit is een algemene pedagogische vraag, en daar is een AI-assistent gewoon goed in — het is precies waarvoor je hem zonder aarzelen mag gebruiken. Wat je erbij hoort te weten: de tips die je terugkrijgt zijn algemeen, dus toets ze aan wat je zelf ziet, en betrek je zorgcoördinator of het CLB voor de opvolging zelf.",
          discussie: "Waar kantelt deze vraag wél? Zoek als groepje één zin die je kan toevoegen om er een 'hangt ervan af' van te maken, en één die er een 'mag niet' van maakt.",
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
          titel: "Zestig opstellen, één avond",
          situatie: "Een leerkracht Nederlands in de derde graad heeft zestig opstellen liggen tegen de deliberatie. Ze plakt ze één voor één in een AI-assistent, met de vraag om telkens een punt op twintig te geven en een korte motivering. Die punten neemt ze integraal over in Smartschool.",
          oordeel: "mag-niet",
          toelichting: "Twee dingen lopen hier fout. De opstellen bevatten namen en persoonlijke inhoud van leerlingen, en het punt komt niet meer van haar: een assistent kent haar beoordelingskader niet, is niet consistent over zestig werken heen, en zij is degene die dat cijfer moet verdedigen op de klassenraad en op het oudercontact. Wat wél kan: haar eigen verbetersleutel laten aanscherpen vóór ze begint, en haar ruwe notities per leerling (\"structuur ontbreekt, sterke woordenschat, geen besluit\") laten omzetten in leesbare feedbackzinnen. Zij beoordeelt, de assistent verwoordt.",
          discussie: "Verandert jullie oordeel als ze het AI-punt alleen als tweede mening naast haar eigen punt legt, om er de uitschieters mee te vergelijken? En maakt het verschil of het om een oefentoets gaat of om een cijfer dat meetelt voor de deliberatie?",
        },
        {
          type: "casus",
          titel: "De detector zegt 98 procent",
          situatie: "Een leerkracht geschiedenis vindt de taak van een leerling uit het vijfde jaar verdacht vlot geschreven. Hij haalt de tekst door een gratis online AI-detector, die \"98% door AI geschreven\" meldt. Hij zet een nul, mailt de ouders en verwijst naar dat percentage als bewijs.",
          oordeel: "mag-niet",
          toelichting: "Zo'n percentage is geen bewijs. AI-detectors geven geregeld vals alarm, zeker bij leerlingen die heel verzorgd of formeel schrijven en bij leerlingen die het Nederlands niet als thuistaal hebben, en ze kunnen sowieso niet aantonen wie welke zin schreef. Een nul plus een mail naar de ouders op basis van dat cijfer is een beschuldiging die je niet hard kan maken, en die een leerling jaren bijblijft. Wat wél kan: ga in gesprek zonder het percentage te vermelden, vraag de kladversies of de bronnen op, laat de leerling zijn tekst mondeling toelichten, en spreek vooraf per opdracht af wat met AI mag, zodat je achteraf niets meer hoeft te bewijzen.",
          discussie: "Stel dat de leerling na het gesprek toegeeft dat hij de tekst liet schrijven. Maakt dat de manier waarop hij betrapt werd achteraf toch aanvaardbaar? En als hij blijft volhouden dat hij het zelf schreef: bij wie ligt dan de bewijslast?",
        },
        {
          type: "casus",
          titel: "Eigen account in leerjaar vijf",
          situatie: "In leerjaar 5 werken de leerlingen aan een werkstuk over dieren. Drie leerlingen hebben thuis een eigen account bij een AI-assistent en vragen of ze dat op de klaslaptops mogen gebruiken. De juf vindt het wel handig en laat het toe.",
          oordeel: "mag-niet",
          toelichting: "De meeste AI-diensten hanteren een minimumleeftijd waar tien- en elfjarigen niet aan komen, en bij een privéaccount weet de school niet wat er met die gesprekken gebeurt. Dat de leerling dat account thuis al heeft, maakt het op school nog niet in orde. Wat wél kan: werk klassikaal via het smartboard en jouw schoolaccount. De leerlingen dicteren de vraag, jij typt, en samen kijken jullie of het antwoord klopt. Dat is trouwens de sterkere les: ze leren een antwoord beoordelen in plaats van het over te schrijven.",
          discussie: "Wat doe je met de leerling die het thuis elke avond gebruikt voor zijn huiswerk? Is dat jouw zaak, of die van de ouders? En zou jullie antwoord veranderen als de scholengroep leerlingaccounts onder toezicht zou voorzien?",
        },
        {
          type: "casus",
          titel: "Onderaan de spreekbeurt",
          situatie: "Een leerling van leerjaar 6 geeft zijn spreekbeurt over vulkanen af. Onderaan heeft hij er zelf bij geschreven: \"Ik heb met de AI-assistent van mama ideeën gezocht en moeilijke woorden laten uitleggen.\" De meester had vooraf niets over AI gezegd en twijfelt nu of hij punten moet aftrekken.",
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
          situatie: "Een zorgleerkracht in het lager onderwijs bereidt een overleg met het CLB voor over een leerling met ernstige leesproblemen. Ze heeft twee bladzijden losse observatienotities en amper tijd. Ze overweegt die notities in een AI-assistent te plakken en er een net verslag van te laten maken.",
          oordeel: "hangt-ervan-af",
          toelichting: "Het hangt volledig af van wat er in die notities staat. Naam, geboortedatum, thuissituatie, medische of zorggegevens: die gaan er niet in, dat is precies waarvoor de vuistregel bestaat. Wat wél kan: haal de identificerende gegevens eruit, werk met [LEERLING] en algemene omschrijvingen, en laat enkel de vorm verzorgen. En hou de conclusies bij jezelf: het CLB en de klassenraad rekenen op jouw inschatting, niet op een vlotte samenvatting. Bij twijfel over wat mag: de DPO van de scholengroep is daarvoor het aanspreekpunt.",
          discussie: "Is een tekst waar alleen de naam uit weg is nog echt anoniem? In een school met tweehonderd leerlingen wijst \"een leerling van leerjaar 3 met ernstige leesproblemen en een broer in leerjaar 6\" maar naar één kind. En wie beslist bij jullie of dit mag: de leerkracht zelf, de directie of de DPO?",
        },
        {
          type: "casus",
          titel: "Spelling nalezen bij dyslexie",
          situatie: "Een leerling van het vierde jaar met dyslexie mag volgens zijn afsprakenblad hulpmiddelen gebruiken bij schrijfopdrachten. Voor een taak geschiedenis schrijft hij zijn tekst volledig zelf en laat hij die daarna door een AI-assistent nalezen op spelling en zinsbouw. Een collega vindt dat oneerlijk tegenover de rest van de klas.",
          oordeel: "mag",
          toelichting: "Deze leerling schreef zelf; de assistent deed hier wat een spellingcorrector of voorleessoftware ook doet, en dat staat in zijn afspraken. De vraag die telt, is wat je met deze taak wil meten. Meet je kennis van geschiedenis, dan is spelling geen onderdeel van het punt en is die hulp gewoon een redelijke aanpassing. Wat wél nodig is: leg het vooraf vast samen met de zorgcoördinator, schrijf het bij de opdracht, en zeg het ook tegen de klas, zodat het een afspraak lijkt en geen gunst.",
          discussie: "En bij een taak Nederlands waar spelling wél beoordeeld wordt: mag het dan nog, of vervalt de aanpassing net daar? En zou je dezelfde hulp toestaan aan een leerling zonder afsprakenblad die er gewoon om vraagt?",
        },
      ],
    },
  ],
};
