// Begeleidersgids — alles wat je nodig hebt om deze workshops zelf te geven,
// los van één specifiek draaiboek. Enkel zichtbaar in begeleidersmodus.
//
// De FAQ hieronder vult het gat dat de draaiboeken openlaten: die waarschuwen
// wel voor "de scepticus die het gesprek kaapt", maar geven geen antwoorden.

export const GIDS_SECTIES = [
  {
    id: 'vooraf',
    icoon: '📋',
    titel: 'Vóór de workshop',
    inleiding:
      'Bijna alles wat een sessie doet mislukken, is vooraf op te lossen. Voor A1 volstaat een halfuur plus één mail naar de deelnemers. Voor A3 (casussen afdrukken, het schoolbeleid opzoeken, iemand van de directie of de ICT-coördinator uitnodigen) en zeker voor B2 en B3 (accounts vooraf laten aanmaken, publiceren testen, de kostenafspraak rondkrijgen) trek je er beter een halve dag voor uit.',
    punten: [
      {
        kop: 'Beslis of je dit alleen doet',
        tekst:
          'B1 zet een tweede begeleider bij de benodigdheden, B3 noemt twee begeleiders bijna een voorwaarde — en dat is geen luxe: één deelnemer die technisch vastloopt, slorpt anders je hele aandacht op. Vind je niemand, verklein dan de groep in plaats van door te zetten. Spoor B rekent sowieso op kleinere groepen (B1 en B2 op 6 tot 12, B3 op 6 tot 10) dan spoor A, dat 8 tot 16 deelnemers vlot aankan en bij A3 zelfs 20. Werk je met twee: spreek vooraf af wie plenair praat en wie rondloopt, en wissel niet halverwege.',
      },
      {
        kop: 'Regel de accounts, en doorloop de hele route zelf',
        tekst:
          'Dit is de nummer één tijdvreter. Laat accounts vooraf aanmaken en test ze zelf op het schoolnetwerk. Voor spoor A is dat één account bij de assistent die jullie school gebruikt. In spoor B zijn het er meer: bij B1 komt de dienst waarop je publiceert erbij, bij B2 een GitHub-account plus de koppeling met die dienst, bij B3 een account bij een AI-dienst met betaalmogelijkheid. Doorloop die route één keer volledig zelf, tot je de gepubliceerde pagina op je eigen gsm opent — halverwege een blok van dertig minuten vastlopen kost je de sessie. Geef je B3, spreek dan vóór de sessie met de directie af wie de kosten draagt; dat staat ook bij de valkuilen van dat draaiboek.',
      },
      {
        kop: 'Test het netwerk op de locatie zelf',
        tekst:
          'Schoolnetwerken blokkeren soms wat thuis vlot werkt. Ga langs, open de tools, en probeer meteen ook de diensten die je in spoor B nodig hebt.',
      },
      {
        kop: 'Vraag het juiste materiaal op',
        tekst:
          'Stuur de dag ervoor een herinnering, en vraag exact wat dit draaiboek nodig heeft. A1: één lesonderdeel dat je binnenkort echt geeft. A2: één bestaande oefening én één toets die je zelf maakte, plus je leerplan of de eindtermen bij de hand. A3: welke bezorgdheid er rond AI bij je leeft — het AI-beleid van de school regel je zelf via de directie of de ICT-coördinator. B1: het moment in je lessen dat structureel stroef loopt. B2: je app uit B1, werkend en online. B3: je project uit B2, op GitHub. Wie met eigen materiaal werkt, haalt er veel meer uit. Hou zelf een paar generieke lesonderdelen en één voorbeeldtoets achter de hand voor wie niets meebrengt.',
      },
      {
        kop: 'Vraag naar wat er stroef loopt',
        tekst:
          'Eén vraag in je uitnodiging — "welke taak slorpt te veel tijd op?" — geeft je meteen demo-onderwerpen die de zaal herkent.',
      },
      {
        kop: 'Ken het beleid, en nodig de juiste persoon uit',
        tekst:
          'Weet vooraf of er een AI-beleid bestaat, wie de DPO is en wie de ICT-coördinator. Je krijgt gegarandeerd vragen waarop "vraag het aan X" het juiste antwoord is. Voor A3 en B2 vraagt het draaiboek meer dan weten: nodig een week vooraf iemand van het directieteam, de ICT-coördinator of de DPO uit om een halfuur aan te sluiten — in A3 bij het privacyblok en het gesprek over leerlingen en AI, in B2 bij het blok over leerlinggegevens. Spreek vooraf één rol af: vertellen wat er bij jullie wél kan en hoe je iets aanmeldt, niet de sessie overnemen. Lukt het niet, vraag dan minstens één antwoord op papier: bij wie komt een vraag over leerlinggegevens terecht?',
      },
      {
        kop: 'Zet de zaal en het scherm klaar',
        tekst:
          'Wees ruim op tijd ter plaatse. Test de beamer of het smartboard met de leeromgeving echt open — verschillende draaiboeken zetten er een bij de benodigdheden — want de tekstgrootte die op je laptop volstaat, is achteraan de zaal soms onleesbaar. Zet de tafels in eilandjes van drie tot vier: in A3 beoordeel je de casussen in groepjes van drie, in B1 laat je duo\'s elkaars app testen. Rijen tegenover een scherm maken van je workshop vanzelf een lezing.',
      },
      {
        kop: 'Druk af wat op papier moet',
        tekst:
          'Voor jezelf: het draaiboek, via de knop "Draaiboek afdrukken" — die staat er zodra begeleidersmodus aan is, en je tips gaan mee op papier. Voor de zaal: open de deelnemersbundel via de knop bij hetzelfde draaiboek en druk ze daar af. Die bundel bevat de doelen, de vuistregels, alle prompts en opdrachten van de sessie en ruimte om te noteren. Geef je A3, druk dan ook de casussen af zoals dat draaiboek vraagt — maar doe dat met begeleidersmodus uit: dan krijgt elke casus een leeg vakje om zelf te kiezen. Staat begeleidersmodus aan, dan gaan de oordelen en je tips mee op papier, en dat blad hou je voor jezelf.',
      },
    ],
  },
  {
    id: 'zaal',
    icoon: '👥',
    titel: 'De zaal lezen',
    inleiding:
      'In elke groep leerkrachten zitten dezelfde vier types. Je hoeft ze niet gelijk te behandelen — je moet ze wel alle vier zien. En in A3 en B2 zit er soms nog iemand bij die er niet als leerkracht zit: zie het laatste punt.',
    punten: [
      {
        kop: 'De onzekere',
        tekst:
          'Bang om iets stuk te doen, durft niet te klikken. Zeg expliciet dat je hier niets kan breken: loopt een gesprek nergens heen, dan sluit je het en begin je opnieuw. Zeg er in één adem bij wat er wél toe doet — wat je intypt, blijft in je account staan, dus geen leerlingnamen — anders klinkt je geruststelling als een vrijgeleide. Ga er als eerste bij staan tijdens het eerste doe-blok.',
      },
      {
        kop: 'De scepticus',
        tekst:
          'Heeft vaak een terecht punt. Erken het, parkeer het zichtbaar, en kom er later op terug — zie de FAQ hieronder. Wuif nooit weg: de rest van de zaal kijkt hoe je hiermee omgaat.',
      },
      {
        kop: 'De voorloper',
        tekst:
          'Gebruikt het al maanden en loopt vooruit. Geef die een rol: laat hem of haar iets tonen, of samenzitten met iemand die vastloopt. Anders wordt het een tweegesprek tussen jou en die persoon. Let op bij de begeleide blokken in spoor B: daar werkt iedereen bewust in hetzelfde tempo, dus vraag de voorloper daar om te wachten en ondertussen zijn buur te helpen.',
      },
      {
        kop: 'De stille',
        tekst:
          'Zegt niets en dat zegt niets. Loop langs en kijk mee op het scherm in plaats van plenair te vragen of het lukt.',
      },
      {
        kop: 'De directie, de ICT-coördinator of de DPO',
        tekst:
          'A3 en B2 vragen die aanwezigheid bij voorkeur, en terecht: op "mag dit bij ons?" komt er dan meteen een antwoord in plaats van een lijn op de parkeerlijst. Maar het effect op de zaal verschilt sterk per rol. Een ICT-coördinator is meestal gewoon een collega met ICT-uren, en de DPO van de scholengroep komt adviseren — die twee remmen zelden. Zit de directie erbij, dan zit de persoon die straks je functioneringsgesprek voert mee in de zaal, en dan blijft de eerlijke twijfel ("doe ik dit eigenlijk al te veel?") binnen. Zeg in dat geval bij het begin luidop wie er meezit en in welke rol, laat de bezorgdheden bij de instap op briefjes schrijven in plaats van plenair rond te gaan, en start het gesprek over leerlingen in duo\'s voor je plenair verzamelt.',
      },
    ],
  },
  {
    id: 'tijdens',
    icoon: '🎤',
    titel: 'Tijdens de sessie',
    inleiding: 'Een paar gewoontes die het verschil maken tussen een demo en een workshop.',
    punten: [
      {
        kop: 'Demo altijd live, nooit met screenshots',
        tekst:
          'Dat het soms hapert of een raar antwoord geeft, is geen probleem — het is de les. Een gepolijste screenshot leert niemand iets over bijsturen.',
      },
      {
        kop: 'Toon bewust ook een slecht antwoord',
        tekst:
          'Begin een demo met een vage prompt en laat het magere resultaat zien. Pas daarna de scherpe versie. Het verschil zien overtuigt sterker dan elke uitleg.',
      },
      {
        kop: 'Als het antwoord niet fout maar ongepast is',
        tekst:
          'Soms is het antwoord niet raar maar ongepast: een oefenreeks voor een richting uit de arbeidsmarktfinaliteit die neerbuigend uitvalt, een rapportcommentaar dat een leerling met dyslexie wegzet als lui, een voorbeeldzin die net iemand in de zaal raakt. Klik het niet weg en maak er geen grap van — de zaal heeft het gezien. Lees hardop voor wat er staat, zeg in één zin waarom dat zo niet naar een leerling of een ouder kan, en stuur het daarna bij waar de groep bij kijkt. Je hoeft er geen betoog van te maken: dit is precies waarom jij alles naleest vóór het de klas in gaat, en je hebt dat zonet zelf gedemonstreerd. Draai je demoprompt vooraf één keer. Je krijgt niet exact hetzelfde antwoord terug, maar je weet wel ongeveer waar je uitkomt.',
      },
      {
        kop: 'Loop rond met één vraag',
        tekst:
          '"Wat zou je nu bijsturen?" Die ene vraag doet meer dan over de schouder meekijken en zelf de oplossing geven.',
      },
      {
        kop: 'Laat deelnemers tonen, niet jou',
        tekst:
          'Zie je iets sterks, vraag of die persoon het straks mag laten zien. Een collega die het toont, landt beter dan de begeleider die het toont.',
      },
      {
        kop: 'Bewaak de doe-blokken',
        tekst:
          'De verleiding is groot om uitleg te laten uitlopen. Doe dat niet: de doe-blokken zijn waar het geleerd wordt. Loopt je uitleg uit, kort dan de uitleg in, niet het doen. Op één soort blok geldt dat niet: het blok waar een grens getrokken wordt, schrap of verkort je nooit. In A2 is dat "Feedback: waar ligt de grens?", in B2 het gesprek over leerlinggegevens, in B3 het blok over sleutels. Die drie staan niet toevallig ook in de valkuilen van hun draaiboek. Loop je daar achter, haal die minuten dan uit twee doe-blokken en hou die grens overeind.',
      },
      {
        kop: 'Schrijf de parkeerlijst zichtbaar op',
        tekst:
          'Vragen die je nu niet kan of wil behandelen komen op een zichtbare lijst. Zo voelt niemand zich weggewuifd en hou je je timing. Loop die lijst ook expliciet af in je afronding: wat is intussen beantwoord, wat komt terug in een volgende workshop, wat gaat naar de directie, de ICT-coördinator of de DPO, en wat neem je mee in je opvolgmail. Een lijst die blijft hangen en dan verdwijnt, kost je meer krediet dan ze opleverde.',
      },
      {
        kop: 'Zet begeleidersmodus uit vóór je iets projecteert',
        tekst:
          'Zolang de schakelaar rechtsboven aanstaat, staan je tips en de valkuilenlijst mee op het draaiboek — inclusief zinnen als "De scepticus die het gesprek kaapt". Projecteer je het draaiboek, zet hem dan even uit: dan zie je exact wat de deelnemers zien. Een lopende sessietimer loopt intussen gewoon door: zet je de schakelaar daarna weer aan, dan staat hij er weer. Werk je met twee begeleiders, hou het draaiboek dan open op het toestel dat níét aan de beamer hangt — dat is sowieso de rustigste oplossing.',
      },
      {
        kop: 'Zet de sessietimer aan',
        tekst:
          'Vul bovenaan het draaiboek het juiste startuur in; daarmee rekent de app de kloktijden per blok uit. Klik op "Start sessie" op het moment dat je echt begint — vanaf die klik markeert de app welk blok nu bezig is en hoeveel minuten er nog resten. Dat scheelt je het hele uur op je horloge kijken, en je ziet meteen of je uitleg aan het uitlopen is. Ververs je de pagina, dan loopt de timer gewoon door.',
      },
    ],
  },
  {
    id: 'misgaan',
    icoon: '🔧',
    titel: 'Als het misloopt',
    inleiding: 'Vijf scenario\'s die echt gebeuren, met een uitweg per stuk.',
    punten: [
      {
        kop: 'Het netwerk ligt plat',
        tekst:
          'Schakel over op één toestel met mobiele data en werk klassikaal verder: jij bedient, de zaal dicteert de prompts. Didactisch minder sterk, maar je verliest de sessie niet.',
      },
      {
        kop: 'Een account of een toestel doet het niet',
        tekst:
          'Laat in duo\'s werken op wat wél werkt. In spoor A kost dat niets: duo\'s verwoorden hardop wat ze willen, en dat is precies de vaardigheid. In spoor B ligt dat anders — daar vertrekt iedereen met een eigen app online, en B2 vraagt die app als voorkennis. Laat het duo dan aan één project werken en om de tien minuten van toetsenbord wisselen, en spreek met de tweede persoon een inhaalmoment van een uur af vóór de volgende sessie. Kom je met spoor B, breng dan zelf een reservelaptop mee — een tablet volstaat niet, je moet bestanden kunnen bewaren.',
      },
      {
        kop: 'Je loopt een halfuur achter',
        tekst:
          'Schrap uitleg, nooit een doe-blok. Concreet: kort de blokken met het etiket "Uitleg" in en laat alles met het etiket "Zelf doen" volledig staan — dat is de tijd waarin deelnemers aan hun eigen lesmateriaal of hun eigen project werken. Eén uitzondering: het blok waar een grens getrokken wordt — privacy, leerlinggegevens, sleutels — blijft overeind, ook al staat er "Uitleg" of "Gesprek" boven. Kijk vooraf de valkuilen van je draaiboek na, daar staat welk blok in die sessie niet mag sneuvelen. Zeg eerlijk tegen de groep wat je schrapt en waarom.',
      },
      {
        kop: 'Eén iemand loopt volledig vast',
        tekst:
          'Zet die persoon naast een buur en ga verder met de groep. Eén deelnemer redden ten koste van de tien of vijftien anderen is een slechte ruil. Bied achteraf tien minuten aan. In spoor B volstaat dat niet: wie B1 verlaat zonder app die online staat, kan B2 niet volgen, en wie B2 verlaat zonder project op GitHub, kan B3 niet volgen. Zorg daar dus dat er vóór het einde iets werkends staat — desnoods jouw versie op de laptop van die deelnemer — of plan een halfuur apart vóór de volgende sessie. Werk je met twee begeleiders, dan is dit precies waarvoor de tweede er is.',
      },
      {
        kop: 'Er staat een echte leerlingnaam in een gesprek',
        tekst:
          'Dit gebeurt, en meestal bij iemand die het goed bedoelt. Reageer ter plekke en zeker niet plenair: ga erbij staan, laat de deelnemer het gesprek verwijderen en de vraag opnieuw stellen met [LEERLING]. Maak er geen voorbeeld van voor de zaal — die persoon probeert daarna niets meer. Zeg er wel bij dat verwijderen het uit je scherm haalt, niet uit de servers van de aanbieder: daarom ligt de regel vooraf en niet achteraf. Ging het over meer dan een naam — een zorgdossier, een CLB-verslag, een klaslijst met punten — dan volstaat verwijderen niet: de deelnemer meldt het diezelfde dag aan de directie en aan de DPO van de scholengroep, en zij beoordelen wat er verder moet gebeuren. Twijfel je of het ernstig genoeg is, dan is melden het juiste antwoord — die afweging is niet aan jou. Zet die twee zinnen vooraf klaar; op het moment zelf wil je niet moeten bedenken wat je zegt.',
      },
    ],
  },
  {
    id: 'nadien',
    icoon: '📨',
    titel: 'Na de workshop',
    inleiding:
      'De opbrengst van een workshop verdampt binnen twee weken als er niets gebeurt. Drie dingen houden het levend.',
    punten: [
      {
        kop: 'Stuur binnen 48 uur iets door',
        tekst:
          'Eén mail met de link naar deze leeromgeving, de deelnemersbundel van jouw sessie (die knop staat bij het draaiboek: de doelen, de vuistregels, alle prompts en alle opdrachten van die sessie, plus notitieruimte) en de promptkaart, waar alle prompts van de hele cursus samenstaan. Daarbij wat er in de sessie zelf gemaakt is: de klasafspraken uit A3, de links naar de gebouwde apps uit B1. Hoe langer je wacht, hoe minder er nog opengaat.',
      },
      {
        kop: 'Verzamel wat er gemaakt is',
        tekst:
          'Klasafspraken, gebouwde tools, geslaagde prompts. Eén gedeeld document per school wordt vanzelf een naslagwerk, en het toont collega\'s die er niet bij waren wat het oplevert.',
      },
      {
        kop: 'Spreek een terugkommoment af',
        tekst:
          'Een halfuur op een personeelsvergadering, drie tot zes weken later. Wat heeft iemand echt gebruikt, en wat niet? Wat níét lukte is daarbij het waardevolst — daar leert de hele groep van. Geef je A1 en daarna A2, of B1 en daarna B2, dan zit dat gesprek al in het draaiboek: die sessies openen met een terugblik op wat er sinds vorige keer gebeurde. Voorwaarde is wel dat je de afronding van de vorige sessie bijhoudt — wat elke deelnemer beloofde te doen — en dat blad meeneemt; zonder die notities sta je dat openingsblok te improviseren. A3 en B3 openen niet met een terugblik, dus plan daar wél een apart moment.',
      },
    ],
  },
];

// De lastige vragen die deelnemers echt stellen. Bewust eerlijk: waar een
// bezwaar deels klopt, staat dat er ook. Een begeleider die alles wegwuift
// verliest de zaal.
export const FAQ_GROEPEN = [
  {
    titel: "Principiële bezwaren",
    vragen: [
      {
        vraag: "Als die dingen dat allemaal kunnen, wat blijft er dan nog over van ons? Straks hebben ze geen leerkrachten meer nodig.",
        antwoord: "Die vraag is terecht en ik ga ze niet afdoen met \"AI vervangt geen leerkrachten\". Wat wel klopt: het deel van je job dat neerkomt op tekst produceren — oefeningen, verslagen, mails, feedback — verandert nu al, en dat is precies het deel waar deze workshop over gaat. Wat daar niet mee verandert: een klas van 24 aan het werk houden, merken dat er iets scheelt met een leerling, een moeilijk oudercontact voeren. Waar ik wél bezorgd over ben, en dat is het eerlijkere gesprek: dat de gewonnen tijd gebruikt wordt om méér op dezelfde schouders te leggen. Dat is geen technologievraag maar een vraag voor de directie, het schoolbestuur en de vakbond — en dat gesprek kan je nu al voeren, niet pas over vijf jaar.",
        tip: "Zeg hardop dat je niet weet hoe dit er over vijf jaar uitziet; voorspellingen maken je hier ongeloofwaardig. Schrijf de bezorgdheid zichtbaar op het parkeerbord en noem ze bij naam — wie zich gehoord voelt, kaapt het gesprek niet.",
      },
      {
        vraag: "Is dit eigenlijk niet gewoon vals spelen? Ik verwacht van mijn leerlingen dat ze hun werk zelf maken, en dan zou ik mijn lesvoorbereiding laten schrijven?",
        antwoord: "Die vraag naar consequentie snijdt hout en ze verdient een echt antwoord, geen woordspel. Het verschil zit in wat er beoordeeld wordt: bij een leerling is het schrijfproces zélf het leerdoel, bij jouw lesvoorbereiding is de les het doel en de voorbereiding het middel — niemand vindt het vals spelen als je een handboek, KlasCement of de bundel van een collega gebruikt. Maar er is wel degelijk een grens: het wordt problematisch op het moment dat je iets uitdeelt of verstuurt dat je zelf niet gelezen hebt en niet kan verdedigen. En bij feedback of een rapportcommentaar over één specifieke leerling geldt: als het over eender wie zou kunnen gaan, is het waardeloos — met of zonder AI. Voel je bij een bepaalde taak dat wringende gevoel, dan is dat meestal een signaal dat klopt, geen bezwaar dat je moet wegredeneren.",
        tip: "Dit is de vraag waar je zelf eerlijk op moet antwoorden. Vertel concreet wat jij ermee doet én wat jij bewust niet uit handen geeft — één persoonlijk voorbeeld overtuigt hier tien keer meer dan een argument.",
      },
      {
        vraag: "Leerlingen leren dan toch niets meer zelf? Als de computer hun opstel schrijft, leren ze nooit schrijven.",
        antwoord: "Dit is de sterkste bedenking van de hele lijst en ze klopt gewoon. Leren zit net in het lastige stuk: zelf zoeken naar de juiste zin, vastlopen, opnieuw beginnen. Een leerling die zijn opstel laat schrijven, leert niet schrijven — daar valt niets aan goed te praten. Alleen werkt \"dan verbieden we het\" niet: het verhuist naar buiten je zicht en dan kan je er niets meer aan doen. Daarom draait deze sessie niet om toelaten of verbieden, maar om per opdracht zeggen wat wel en niet mag, het proces zichtbaar maken (kladversie, tussenstap, korte mondelinge toelichting) en hen leren een AI-antwoord af te breken in plaats van te bestellen. Hou er ook rekening mee dat de toegang thuis sterk verschilt: wie een opdracht geeft die eigenlijk een goede assistent thuis veronderstelt, vergroot het verschil tussen leerlingen.",
        tip: "Geef deze vraag ruimte, ze verdient het. Laat de groep eerst zelf een grens trekken op één concrete opdracht vóór je zelf iets zegt — dat is meteen de opdracht van straks.",
      },
      {
        vraag: "Ik heb het geprobeerd en het verwees naar een boek dat niet bestaat. Waarom zou ik iets gebruiken dat gewoon dingen verzint?",
        antwoord: "Volkomen terecht, en het is nog vervelender dan \"soms fout\": het zegt die fout in exact dezelfde vlotte, zelfzekere toon als de rest, zonder enige waarschuwing. De conclusie die daaruit volgt is niet \"dus onbruikbaar\", maar \"dus geen naslagwerk\". Gebruik het waar jij de expert bent en de fout dus meteen ziet: een lesopbouw, een herschreven alinea, tien oefenzinnen, drie werkvormen — daar kijk je in vijf seconden of het deugt. Gebruik het niet waar je het antwoord zelf niet kan beoordelen: jaartallen, cijfers, wetgeving, citaten en bronnen. Die ene regel is simpel genoeg om te onthouden en dekt bijna alles af.",
        tip: "Vraag wie er nog zo'n voorbeeld heeft en verzamel er drie op het bord. Fouten tonen maakt je geloofwaardig; ze minimaliseren kost je de zaal.",
      },
      {
        vraag: "Ik heb hier eerlijk gezegd de tijd niet voor. Er komt elk jaar iets bij en er gaat nooit iets af.",
        antwoord: "Dat is het meest terechte bezwaar dat vandaag valt, en \"het bespaart je tijd\" is er een te makkelijk antwoord op. Leren kost éérst tijd, en de winst is niet automatisch: veel mensen gebruiken de gewonnen tijd om beter of méér materiaal te maken in plaats van om vroeger naar huis te gaan. Is de werkdruk structureel — te veel uren, te veel planlast, te veel op één paar schouders — dan lost geen enkele tool dat op en hoort die vraag op de personeelsvergadering, niet in deze workshop. Wat ik hier wél aanbied is klein: één taak van jouw eigen lijst, tien minuten, vandaag. Levert dat niets op, dan heb je tien minuten verloren en weet je dat het niets voor jou is.",
        tip: "Niet tegenspreken, en zeker geen tijdswinst beloven. Pak één taak van deze persoon van het bord uit de instap en laat het resultaat het werk doen — wie na tien minuten iets bruikbaars in handen heeft, hoeft geen betoog meer.",
      },
      {
        vraag: "Onze school heeft hier geen enkel beleid over. Dan doe ik het liever niet, want straks ben ik degene die iets fout doet.",
        antwoord: "Voorzichtig zijn is hier verstandig, en \"ik wacht af\" is een geldige keuze — ik ga je niet overtuigen. Twee dingen kloppen tegelijk: geen beleid is geen verbod, maar het is evenmin toestemming voor alles. Wat er sowieso geldt, met of zonder schoolbeleid, is de privacywetgeving. Die verbiedt leerlingnamen niet met zoveel woorden, maar ze legt de verantwoordelijkheid bij de school en niet bij jou alleen — en zolang jouw school over geen enkele tool iets op papier heeft staan, komt dat op hetzelfde neer: geen leerlingnamen in een AI-gesprek. Zorggegevens, wat van het CLB komt en medische informatie houd je er hoe dan ook buiten, ook als er later wel afspraken op papier staan: daarvoor gelden strengere regels, en bij het CLB ook hun beroepsgeheim. Wat je zonder beleid gerust kan doen: werken met je eigen lesmateriaal en met geanonimiseerde omschrijvingen, en voor schoolwerk het schoolaccount gebruiken in plaats van je privéaccount. Wat je niet alleen beslist: leerlingen met eigen accounts laten werken of gegevens van leerlingen door een tool laten lopen — dat gaat langs de directie, de ICT-coördinator en de DPO van de scholengroep. Zet de vraag op de agenda van de vakwerkgroep: een beleid ontstaat meestal pas omdat iemand die vraag stelt.",
        tip: "Zit er directie of een ICT-coördinator in de zaal, geef die hier meteen het woord. Anders: noteer dit als concrete vervolgstap met een naam en een datum erbij — dat is exact de opbrengst waarop deze sessie eindigt.",
      },
      {
        vraag: "Ik vind dit onpersoonlijk. Ouders verdienen een mail van mij, niet van een machine.",
        antwoord: "Daar zit een echt punt in en het is niet met een trucje op te lossen. Er is een wezenlijk verschil tussen een assistent die je helpt formuleren wat jij zelf bedacht hebt, en een mail over een leerling die je eigenlijk niet in beeld hebt. Een bruikbare test: staat er iets in dat alleen jij kan weten, en zou je dit zo ook aan de telefoon zeggen? Is het antwoord nee, dan is die mail te dun — met of zonder AI. Draai het ook eens om: voor collega's die moeizaam schrijven of voor wie het Nederlands niet de thuistaal is, maakt hulp bij de toon het contact soms net persoonlijker, omdat de boodschap aankomt zoals ze bedoeld was. En bij slecht nieuws of een conflict blijft de regel hard: nooit iets versturen dat je niet zelf herschreven en hardop herlezen hebt.",
        tip: "Weersta de neiging om dit te weerleggen. Vraag door naar wat die persoon precies wil beschermen — meestal is dat de band met het gezin, en daar ben je het volledig mee eens.",
      },
      {
        vraag: "Wat kost dat allemaal aan energie? We leren onze leerlingen zuinig zijn en dan gaan wij dat massaal gebruiken?",
        antwoord: "Terecht, en ik ga hier geen cijfer op plakken dat ik niet hard kan maken: de schattingen lopen sterk uiteen en veranderen snel. Wat wel vaststaat: datacenters verbruiken veel stroom en ook water voor koeling, en dat verbruik groeit fors nu iedereen dit tegelijk gebruikt. Wat er even goed vaststaat: één tekstvraag is klein vergeleken met wat je op een dag verder doet, en beelden laten genereren kost een pak meer dan tekst. Handelbaar gemaakt: gebruik het waar het echt iets oplevert in plaats van als speelgoed, formuleer je opdracht scherp zodat je niet tien keer opnieuw moet vragen, en genereer geen reeksen beelden voor de sier. En is je bezwaar principieel en wil je het daarom niet gebruiken: dat is een verdedigbaar standpunt, ik ga dat niet wegpraten.",
        tip: "Geef toe dat je het exacte cijfer niet kent — dat is geloofwaardiger dan een getal dat iemand met één opzoeking onderuithaalt. Koppel het terug aan de rode draad: waar is dit de moeite waard, en waar niet?",
      },
      {
        vraag: "Van wie is dat materiaal eigenlijk? Als ik daarmee een bundel maak, mag ik die dan op KlasCement zetten of verkopen?",
        antwoord: "Goede vraag, en het eerlijke antwoord is dat dit juridisch nog niet uitgeklaard is — ik ben ook geen jurist. Wat de gebruiksvoorwaarden van de grote assistenten vandaag zeggen, komt erop neer dat jij mag gebruiken wat eruit komt, ook voor je werk; check dat wel na voor het account dat jullie school gebruikt. Waar het wringt: auteursrecht veronderstelt normaal een menselijke creatieve inbreng, dus op een tekst die de machine helemaal alleen maakte kan je waarschijnlijk zelf geen auteursrecht claimen — en iemand anders kan met een gelijkaardige vraag iets erg gelijkaardigs krijgen. Praktisch: hoe meer jij geselecteerd, herschreven en aangevuld hebt, hoe meer het jouw werk is, dus deel je bewerkte versie en nooit een rauwe uitvoer. Let ook op de andere richting: plak geen volledige hoofdstukken uit een handboek of werkboek van een uitgeverij in een gesprek en verspreid dat resultaat niet als eigen materiaal. Nog iets dat in je vraag verstopt zit: van wie is jouw bundel eigenlijk? Wat jij zelf schrijft, blijft in principe van jou, ook al maakte je het voor je job — daar is een uitdrukkelijke afspraak voor nodig om dat anders te maken. Gratis delen op KlasCement is dus zelden een probleem; wil je er geld voor vragen, ga dan eerst bij je directie na of daar in het arbeidsreglement of bij je aanstelling iets over is afgesproken. Gaat het over echt commercialiseren of over iets ondertekenen namens de school, leg het dan voor aan de scholengroep.",
        tip: "Zeg expliciet dat je geen jurist bent en parkeer de fijne kneepjes bij de scholengroep — verzand hier niet, dat kost je twintig minuten. Eén boodschap moet blijven hangen: rauwe uitvoer deel je niet, jouw bewerkte versie wel.",
      },
      {
        vraag: "Die dingen zijn gebouwd op het werk van schrijvers en illustratoren die daar nooit iets voor gevraagd of gekregen hebben. Moet ik daar dan aan meedoen?",
        antwoord: "Dat bezwaar staat overeind en ik ga het niet gladstrijken. Deze systemen zijn getraind op enorme hoeveelheden tekst en beeld van het internet, lang niet altijd met toestemming van de makers; daar lopen rechtszaken over en de regels zijn volop in beweging. Wie daar principieel niet aan wil meedoen, heeft een verdedigbare positie — dat is dezelfde soort afweging die je ook maakt bij kleding of bij een goedkope vlucht, en niemand hier gaat je die afweging afnemen. Wat je in de tussentijd wel zelf in de hand hebt: laat geen beelden maken \"in de stijl van\" een levende illustrator, en gebruik het voor werk dat je anders zelf zou doen. En besluit je het niet te gebruiken: blijf dan toch weten wat het is, want je leerlingen gebruiken het sowieso.",
        tip: "Ga niet in discussie over of het diefstal is; die vraag ligt bij de rechtbank en niet bij jou. Erken het, geef wie niet wil gebruiken uitdrukkelijk toestemming om niet te gebruiken, en ga door.",
      },
      {
        vraag: "Moet ik hier eigenlijk aan meedoen? Ik doe dit al twintig jaar zonder, en ik zie het als de zoveelste hype die wel weer overwaait.",
        antwoord: "Nee, je moet dit niet gebruiken, en die scepsis is gezond — er is de laatste jaren al meer langsgekomen dat \"alles ging veranderen\". Ik ga je vandaag ook niets laten beloven. Eén stuk vind ik wel moeilijker om weg te wuiven: je leerlingen gebruiken dit al, en meestal slecht. \"Ik gebruik het zelf niet\" is perfect verdedigbaar; \"ik weet niet wat het is\" wordt lastiger op het moment dat er een leerling met een verzonnen bronnenlijst voor je staat. Doe vandaag dus gerust mee als criticus in plaats van als gebruiker — die rol is hier eerlijk gezegd nuttiger dan nog een enthousiasteling.",
        tip: "Geef deze persoon een rol in plaats van een weerwoord: vraag hem of haar om bij elke oefening te zeggen wat er misloopt, en kom daar ook echt op terug. Dat haalt de kaping uit het gesprek en maakt meteen de hele groep kritischer.",
      },
    ],
  },
  {
    titel: "Praktische vragen",
    vragen: [
      {
        vraag: "Welke moet ik nu nemen, ChatGPT of Claude?",
        antwoord: "Die vraag komt altijd eerst, en het eerlijke antwoord ontgoochelt een beetje: voor zowat alles in deze workshop maakt het niet uit. ChatGPT en Claude zijn allebei een chatvenster waar je in gewone taal een opdracht geeft, en elke vaardigheid die je hier leert, werkt in allebei. De echte keuze ligt meestal niet bij jou: gebruik wat je school of scholengroep aanbiedt, want daar hangen de afspraken over je gegevens aan vast. En steeds vaker is het geen keuze tussen twee merken: bij heel wat scholen zit er al een assistent ingebouwd in de Microsoft- of Google-omgeving waar jullie sowieso mee werken. Zit die er bij jullie in, begin daar dan gerust mee — het is hetzelfde soort chatvenster en alles wat je hier leert, werkt er ook. Meld je wel aan met je schoolaccount en niet met je privéaccount, want daaraan hangen die afspraken vast; of hij ook echt vrijgegeven is voor personeel, weet je ICT-coördinator. Heb je toegang tot allebei, leg dan dezelfde prompt eens naast elkaar op een taak die je vaak doet, en kies welke toon jou het beste ligt. Weet je niet wat er in huis is, vraag het dan aan je ICT-coördinator voor je zelf iets opstart.",
        tip: "Laat dit geen merkendiscussie worden. Beantwoord het in dertig seconden en toon in je demo bewust twee verschillende vensters naast elkaar — dan ziet de groep zelf dat het dezelfde vaardigheid is en is de vraag weg.",
      },
      {
        vraag: "Moet ik daarvoor betalen? Wat kan ik met de gratis versie?",
        antwoord: "Terechte vraag, zeker als je al drie abonnementen uit eigen zak betaalt. Alles wat vandaag aan bod komt — schrijven, herschrijven, samenvatten, differentiëren, feedback formuleren — is gewoon tekst in en tekst uit, en daar hangt geen bepaald abonnement aan vast. Waar de grenzen precies liggen en wat een betalende versie extra biedt, verschilt per aanbieder en verandert om de paar maanden; concrete prijzen en limieten noem ik daarom bewust niet, want wat ik vandaag zeg klopt volgend schooljaar niet meer. Loop je ergens tegen een grens aan, dan zie je dat vanzelf op je scherm staan — dát is het moment om je af te vragen of je er echt voor wil betalen, niet nu. Belangrijker dan betalen is trouwens wélk account je gebruikt: vraag eerst aan je ICT-coördinator of directie of de school iets voorziet, voor je zelf een abonnement neemt.",
        tip: "Noem nooit bedragen, ook niet als iemand aandringt. \"Dat verandert te snel, vraag het na bij je ICT-coördinator\" is een volwaardig antwoord en houdt je geloofwaardig als de prijzen morgen wijzigen.",
      },
      {
        vraag: "Mag ik mijn privéaccount gebruiken voor schoolwerk?",
        antwoord: "Begrijpelijk dat je het vraagt: veel mensen hebben er al een en het werkt gewoon. Er is geen knop die het tegenhoudt, maar \"het werkt\" is niet hetzelfde als \"het is geregeld\". Bij een school- of scholengroepaccount horen er afspraken vast te liggen met de leverancier over wat er met je gesprekken gebeurt; bij een gratis privéaccount bestaan die afspraken niet, terwijl de school wél verantwoordelijk blijft voor de leerlingengegevens die jij erin zet — ook als je 's avonds van thuis werkt. Voor je eigen lesmateriaal, zonder iets van een leerling erin, is een privéaccount doorgaans geen probleem, tenzij het ICT-reglement of het AI-beleid van jullie school iets anders afspreekt. Zolang je uitsluitend geanonimiseerd werkt — geen namen, ook geen voornaam met de klas erbij, geen zorggegevens, geen CLB-verslagen — blijft het risico klein, en die regel geldt sowieso, ook op een schoolaccount. Ga na of jullie school iets voorziet; is dat er niet, leg de vraag dan bij je ICT-coördinator en bij de DPO van de scholengroep.",
        tip: "Vraag hier ter plaatse wie al een account heeft en waar. Vaak blijkt dat de school iets heeft dat de helft van de zaal niet kende — laat de ICT-coördinator dat dan meteen bevestigen als die aanwezig is.",
      },
      {
        vraag: "Het schoolnetwerk blokkeert dat hier, wat nu?",
        antwoord: "Dat gebeurt vaker dan je denkt, en meestal is het geen principiële blokkade maar een filter die een hele categorie sites tegenhoudt. Ga wel eerst na wat er precies blokkeert, want daar hangt de oplossing aan vast. Raak je de site helemaal niet binnen of krijg je een blokkeerpagina van de school te zien, dan is het de filter. Opent de site wel, maar raak je niet ingelogd met je schoolaccount, dan ligt het niet aan het netwerk maar aan het account of aan de beheerde laptop: daar staan toepassingen van buiten de school vaak standaard uit. Dat is een andere vraag voor je ICT-coördinator, en een site vrijgeven lost ze niet op. Voor de workshop zelf regel je dit een week vooraf samen met de accounts bij de ICT-coördinator: een sessie die begint met vijftien mensen op een foutmelding, krijg je niet meer recht. Voor deelnemers achteraf: laat hen vriendelijk aan diezelfde ICT-coördinator vragen om de site vrij te geven voor personeel, met de reden erbij. Dat is vaak in een dag geregeld. Blijft het dicht, dan is het een bewuste beleidskeuze: leg de vraag bij de directie in plaats van te zoeken naar een omweg rond het schoolnetwerk.",
        tip: "Test het ter plaatse op het echte netwerk, niet op je eigen hotspot — dat is precies de fout die je één keer maakt. Hou een plan B klaar: één laptop van jou op mobiele data volstaat om de sessie plenair te redden.",
      },
      {
        vraag: "Onthoudt het wat ik intyp? Kunnen anderen dat zien?",
        antwoord: "Hier zit de meeste onrust, en de vraag bestaat eigenlijk uit twee vragen. Binnen één gesprek onthoudt de assistent wel degelijk wat je eerder typte — daarom hoef je jezelf niet te herhalen, en dat is puur handig. Daarnaast blijven je gesprekken bewaard in je account, en of ze verder gebruikt worden om het systeem te verbeteren, hangt af van het soort account en van de instellingen. Wat in de praktijk niet gebeurt: ouders of een collega die zomaar in jouw gesprekken meeleest. Eén nuance die je wel moet kennen: een schoolaccount is van de school, niet van jou. Wie dat account beheert — de ICT-coördinator of de scholengroep — kan er in principe bij, doorgaans enkel in uitzonderlijke gevallen zoals een audit of een onderzoek, net zoals bij je schoolmailbox. Bewaard is bewaard, dus de vuistregel blijft overeind: zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen. Wat er voor jullie accounts precies is afgesproken, weet de DPO van de scholengroep.",
        tip: "Splits de vraag zichtbaar op het bord: \"onthouden binnen het gesprek\" (handig) tegenover \"bewaard in je account\" (privacy). Deelnemers halen die twee door elkaar, en dat veroorzaakt het grootste deel van de onnodige angst in de zaal.",
      },
      {
        vraag: "Hoe weet ik of iets klopt?",
        antwoord: "Terecht, want er komt geen waarschuwing bij een fout antwoord: het staat er in exact dezelfde vlotte, zelfverzekerde toon als de rest. Sorteer daarom op risico. Een werkvorm, een lesopbouw, een herschreven alinea of een brainstorm beoordeel je meteen zelf — je ziet vanzelf of het deugt. Jaartallen, cijfers, wetgeving, citaten, bronnen en alles wat recent is, check je in een bron die je vertrouwt: je handboek, een officiële site. De vaste reflex: alles wat een leerling of een ouder als feit te zien krijgt, controleer jij. En een kale \"klopt dat?\" aan dezelfde assistent helpt je niet vooruit: die bevestigt vrolijk haar eigen verzinsel. Vraag er wél de bron bij — maar geloof het pas als jij die link zelf opent en het er echt ziet staan.",
        tip: "Demonstreer dit op iets heel lokaals: een detail over jullie gemeente, school of streek. Lukt de demo niet en klopt het antwoord gewoon? Zeg dat dan eerlijk — \"het klopt vaak wél\" is een even belangrijke boodschap als de waarschuwing.",
      },
      {
        vraag: "Kan ik het ook in een andere taal gebruiken dan het Nederlands?",
        antwoord: "Ja, en het is meteen een van de sterkste toepassingen. Je kan je opdracht in het Nederlands geven en het resultaat in het Frans, Engels of Duits laten zetten, of net omgekeerd: teksten op niveau, oefenzinnen, verbetersuggesties. Voor anderstalige nieuwkomers is het bruikbaar om een instructie of een korte boodschap aan ouders in de thuistaal te zetten, of om een Nederlandse tekst te vereenvoudigen tot taal die het kind wél aankan. Twee kanttekeningen: de kwaliteit is merkbaar sterker in grote talen dan in kleinere, en in een taal die jij zelf niet leest, kan jij niet controleren wat er staat. Laat zoiets dus nalezen door iemand die de taal kent — een collega, de brugfiguur, een tolk — vóór het naar een gezin vertrekt.",
        tip: "Doe de demo in een taal die niemand in de zaal spreekt en vraag daarna: wie kan mij nu zeggen of dit klopt? Die stilte maakt de grens tastbaarder dan welke waarschuwing ook, en je hebt meteen de brug naar controle en nalezen.",
      },
      {
        vraag: "Mag ik het lesmateriaal dat ik zo maak delen met collega's of op KlasCement?",
        antwoord: "Ja — je deelt je lesmateriaal zoals je dat altijd al deed: jij hebt het gemaakt, jij hebt het nagelezen, jij staat ermee voor de klas. Twee bedenkingen wel. Eén: lees het extra grondig na vóór je het deelt, want een collega die het downloadt, checkt de feiten geen tweede keer. Twee: wat je er van een uitgever in plakte, blijft van die uitgever — een herschreven hoofdstuk uit een handboek zet je dus niet zomaar publiek online. Vermeld gerust dat je AI gebruikte bij het maken; dat is geen bekentenis maar bronvermelding, en vul de velden over herkomst en licentie eerlijk in. Twijfel je over auteursrecht op materiaal dat niet helemaal van jou is, leg het dan voor aan je pedagogisch begeleider of aan de directie.",
        tip: "Draai de vraag om naar iets positiefs: wie deelt vandaag al iets op KlasCement? Deze vraag verraadt meestal iemand die klaar is om verder te gaan dan de workshop — verwijs die door naar de vakwerkgroep in plaats van de vraag alleen af te handelen.",
      },
      {
        vraag: "Mag ik het gebruiken om taken te verbeteren en punten te geven?",
        antwoord: "Deze vraag komt meestal van iemand met een stapel taken op zijn bureau die tegen het rapport verbeterd moet zijn, dus neem die tijdsdruk eerst serieus. Feedback formuleren kan de assistent goed: geef je criteria mee, laat er een eerste tekst van maken en herschrijf die daarna in je eigen woorden. Een punt zetten is iets anders — dat is een pedagogische beslissing en die blijft van jou. Wat je niet doet: een taak met naam en al ingeven, of een score overnemen die je niet zelf kan verantwoorden op een klassenraad, op een zorgoverleg of aan een ouder. Wil je hier verder in gaan, dan is het geen individuele keuze meer: dat hoort thuis bij de vakwerkgroep of het graadoverleg, en bij het evaluatiebeleid van de school.",
        tip: "Erken de werkdruk vóór je over grenzen begint, anders klinkt je antwoord als een verbod en haakt de vrager af. Laat iemand die het al probeerde vertellen wat er gebeurde — dat overtuigt beter dan jouw kader.",
      },
      {
        vraag: "Wat als een collega of de directie het niet wil?",
        antwoord: "Dat gebeurt, en het is niet per se onterecht. Maak eerst het onderscheid tussen een schoolafspraak en een persoonlijke mening: bestaat er beleid, dan volg je dat, punt. Is het een mening, ga dan niet in discussie over \"AI\" in het algemeen, maar toon één concreet ding dat je ermee maakte en dat je een avond werk scheelde. Vraag ook door naar de bezorgdheid: privacy, kwaliteit, leerlingen die overschrijven, of het gevoel dat het vak wordt uitgehold zijn vier verschillende gesprekken met vier verschillende antwoorden. Is er nog helemaal geen beleid, dan is dát de echte vraag — agendeer ze op de vakwerkgroep of vraag je pedagogisch begeleider erbij.",
        tip: "Er zit bijna altijd één principiële scepticus in de zaal. Geef die persoon ruimte en neem de bedenking ernstig: overtuigen lukt toch niet, gehoord laten voelen wel — en de rest van de groep kijkt vooral naar hoe jij dat doet.",
      },
      {
        vraag: "Hoe leg ik dit uit aan ouders?",
        antwoord: "Hou het klein en concreet, want ouders schrikken van \"de school gebruikt AI\" en niet van wat je er echt mee doet. Zeg waarvoor je het inzet — je voorbereiding, oefeningen op drie niveaus, feedback vlotter geformuleerd — en zeg er meteen bij wat je er niet mee doet: geen beslissingen over hun kind, geen punten, en geen namen of gegevens in het systeem. Sluit af met de zin die alles draagt: jij leest alles na voor het de klas in gaat. Op een oudercontact volstaat meestal één zin, je hoeft geen uiteenzetting te houden. Wil de school breder communiceren via de website of Smartschool, dan is dat geen individuele opdracht — stem af met de directie zodat iedereen hetzelfde verhaal vertelt.",
        tip: "Laat elke deelnemer die ene zin ter plaatse opschrijven en luidop zeggen aan zijn buur. Wie het één keer hardop heeft uitgesproken, blokkeert niet als de vraag op het oudercontact echt komt.",
      },
    ],
  },
];
