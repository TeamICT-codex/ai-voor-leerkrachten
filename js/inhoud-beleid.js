// Spoor C — Het kader: wet, privacy en schoolbeleid.
//
// Dit spoor staat vóór de twee andere: het geeft het algemene kader waarop
// "AI in de klas" en "Vibe coden" verder bouwen. Het is geschreven voor twee
// publieken tegelijk — de leerkracht die wil weten wat ze morgen mag doen, en
// de directie die afspraken maakt voor de hele school, met leerlingdata van
// minderjarigen én met gevoelige personeelsgegevens.
//
// Toon: informeren, niet belerend. De meeste dingen die een leerkracht met AI
// wil doen, mogen gewoon; de regels bijten op een klein maar belangrijk stuk.
// Elke waarschuwing zegt wat je dan wél doet en bij wie je terechtkan.
//
// Dit is geen juridisch advies. Bij echte twijfel gaat het naar de DPO van de
// scholengroep.
//
// VERIFICATIE: geschreven op 26 oktober 2026 op basis van een onderzoeksronde
// met bronvermelding. Twee dingen om in de gaten te houden bij een volgende
// nakijkronde: de invoeringsdata van de AI-verordening zijn in 2026 verschoven
// door de digitale omnibus, en de bevoegde toezichthouder voor Vlaamse scholen
// is juridisch betwist. Schrijf hier nooit een artikelnummer, bedrag of termijn
// bij zonder het in een primaire bron na te lezen.

export const MODULES_BELEID = [

  {
    id: 'beleid-kader',
    icoon: '🧭',
    titel: 'Het kader in het kort',
    ondertitel: 'Waar de regels eigenlijk over gaan, wat gewoon mag, en wie wat beslist in jouw school.',
    niveau: 'Starter',
    doelen: [
      'Je weet waarover de regels rond AI eigenlijk gaan, en waarom het grootste deel van wat je wil doen gewoon mag.',
      'Je herkent in één vraag of iets gevoelig ligt: zit er iets van of over een herkenbare persoon in?',
      'Je weet wie wat beslist in je school, bij wie je met welke vraag terechtkan en bij wie je meldt als er iets misliep, en je kan elke nieuwe AI-vraag aftoetsen aan vier vragen.',
    ],
    klaarzetten: [
      'Geen laptops, geen accounts, geen schoolnetwerk. Deze module geef je in een gewone vergaderzaal.',
      'Drie namen, vooraf opgezocht: jullie aanspreekpunt informatieveiligheid, de ICT-coördinator en de DPO van de scholengroep. Zonder die namen valt de opdracht achteraan stil.',
      'Het AI-beleid of het ICT-reglement van de school, of de vaststelling dat er nog geen is. Allebei zijn een bruikbaar vertrekpunt.',
      'Wil je de prompt tonen of uitproberen, hou dan een AI-assistent bij de hand op jouw scherm.',
    ],
    lessen: [
      {
        id: 'waar-het-over-gaat',
        titel: 'Waar het eigenlijk over gaat',
        minuten: 10,
        blokken: [
          {
            type: 'tekst',
            inhoud: '"Mag dat eigenlijk wel?" Die vraag komt meestal pas nadat je iets al drie keer gedaan hebt. Rond AI hangen grote woorden — GDPR, AI-verordening, verwerkersovereenkomst (het contract tussen je school en een leverancier) — die klinken alsof je eerst rechten moet studeren. Zo zit het niet: het grootste deel van wat een leerkracht met een AI-assistent zoals ChatGPT of Claude wil doen, mag gewoon. En bijna alles wat in een leraarskamer "de AI-wet" heet — geen leerlingnamen in een chatvenster — komt eigenlijk uit de <strong>GDPR</strong>, de privacywetgeving over gegevens van mensen die al jaren geldt. De <strong>Europese AI-verordening</strong> is een andere wet, over AI-systemen zelf; dat antwoord verandert dus niet als iemand zegt dat zij is uitgesteld.',
          },
          {
            type: 'tekst',
            inhoud: 'De privacywetgeving is ouder dan AI en gaat over iets eenvoudigs: <strong>informatie over mensen hoort bij die mensen</strong>. Daar komt de schakelaar vandaan waar deze hele cursus op draait. Zit er in wat je intypt <strong>iets van of over een herkenbare persoon</strong> — een naam, een klas, een tekst van een leerling, een mail van een ouder, een nota over een collega? Dan sta je in het geregelde gebied. Zit er niets persoonlijks in — een oefenreeks, een lesidee, een brief die je zelf schreef — dan houdt de privacywetgeving je niet tegen. Eén vraag blijft dan nog over, en die gaat over teksten in plaats van over personen: is wat je erin plakt wel van jou?',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Geen persoon in het spel.</strong> Een oefenreeks breuken voor het vierde leerjaar, een werkvorm over de Romeinen voor het tweede jaar, een brief over de sportdag. Gewoon doen.',
              '<strong>Wel een persoon, maar die kan eruit.</strong> Feedback op een opstel uit het vijfde jaar zonder naam, een oudermail algemeen navertellen. Doen, met de persoon eruit.',
              '<strong>Wel een persoon, en die hoort erbij.</strong> Een rapportcommentaar met naam, een klaslijst met punten, een nota over een collega. Dat hoort in de omgeving waar je school afspraken mee heeft, niet in een account dat je zelf aanmaakte. Bestaat die omgeving nog niet, vraag dan aan je directie of ICT-coördinator wat wél kan.',
              '<strong>Zorg, gezondheid, thuissituatie, geloof, afkomst.</strong> Een verslag van het zorgoverleg, een stuk uit een CLB-dossier, de reden waarom een collega afwezig is. De strengste categorie, en daar beslis je niet alleen over: ga ermee naar je directie, en bij een leerling ook naar je zorgcoördinator.',
              '<strong>En los daarvan: van wie is de tekst?</strong> Je eigen lesmateriaal plak je gerust in een assistent, een hoofdstuk uit de methode van een uitgeverij hou je er beter uit. Beschrijf in je eigen woorden wat je nodig hebt.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'De prikbordregel — en waar ze stopt',
            inhoud: 'De vuistregel die je in deze cursus overal tegenkomt: <strong>zet er niets in dat je niet op het prikbord in de leraarskamer zou hangen</strong>. Dat is geen wettekst, maar ze werkt omdat ze de juiste vraag stelt: zou de persoon over wie dit gaat het erg vinden? Wat je intypt gaat immers naar een bedrijf buiten je school. Eén denkfout komt daarbij het vaakst voor: de naam weghalen maakt het nog niet anoniem. "De leerling van het tweede jaar met dyscalculie die een broer in het zesde heeft" is binnen één school even herkenbaar als een naam. De toets is dus niet "staat er een naam in?", maar "zou een collega meteen weten over wie dit gaat?".',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Voor de directie: begin met wat wél mag',
            inhoud: 'Een AI-beleid dat opent met een verbodenlijst leest het team als wantrouwen, en dan gebeurt het toch — alleen niet meer zichtbaar. Zeg dus eerst luidop wat gewoon mag, want dat is het grootste deel. Zet daarnaast twee heldere lijnen: gegevens van leerlingen en personeel blijven in de omgeving die de school koos, en zorg- of gezondheidsgegevens gaan ook daar niet zomaar in. Eén pagina waar mensen op kunnen terugvallen is meer waard dan een beleidsplan dat niemand leest.',
          },
        ],
      },
      {
        id: 'wie-beslist-wat',
        titel: 'Wie beslist wat',
        minuten: 25,
        blokken: [
          {
            type: 'tekst',
            inhoud: '"Mag ik dit?" is eigenlijk twee vragen in één: staat er iets over in de wet, en wat heeft mijn school erover afgesproken? Negen keer op tien ligt het antwoord in de school zelf. En hier verrast de wet de meeste mensen: gebruikt een leerkracht gegevens van leerlingen, dan is het juridisch <strong>de school</strong> die dat doet, niet die leerkracht persoonlijk. Het schoolbestuur — de scholengroep, de vzw of het gemeente- of provinciebestuur — draagt die verantwoordelijkheid en kan ze niet doorschuiven naar een leverancier. Je staat er dus niet alleen voor. Dat is niet hetzelfde als "er gebeurt niets": wie buiten de schoolafspraken werkt, moet dat kunnen uitleggen. En voor een directie: heeft niemand gekozen welke tool mag en waarvoor, dan is dat geen individuele overtreding maar een gat in het beleid.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De leerkracht beslist zelf.</strong> Hoe je je vraag formuleert, wat je overneemt en wat je herschrijft, en of het resultaat goed genoeg is voor je klas. Dat laatste blijft altijd van jou. Of je een assistent gebruikt bij je voorbereiding, beslis je in principe ook zelf — tenzij je school daarover iets heeft afgesproken, en dat mag ze.',
              '<strong>De school of de scholengroep beslist.</strong> Welke tools mogen en waarvoor, met welke leverancier er een contract is, of leerlingen zelf een account krijgen, en wat erover in het schoolreglement en de info aan ouders staat.',
              '<strong>Niemand in de school beslist.</strong> Een klein aantal dingen ligt vast in de wet. Europa verbiedt bijvoorbeeld sinds begin 2025 software die emoties afleidt uit gezicht, stem of houding — in onderwijsinstellingen én op de werkplek, dus voor je leerlingen én voor je collega\'s. Ook niet als proef, en daar helpt geen toestemming van ouders aan en geen afspraak op de personeelsvergadering. Wat wél kan: het hun gewoon vragen, met een schaal die ze zelf invullen. Er is één smalle uitzondering, om medische of veiligheidsredenen, en die beslist de school via het zorgoverleg — niet de klas.',
            ],
          },
          {
            type: 'tekst',
            inhoud: 'Blijft de vraag bij wie je ermee langsgaat. "Ik wist niet bij wie ik moest zijn" is de meest voorkomende reden waarom een klein probleem een groot probleem wordt. Deze mensen bestaan allemaal in jouw school of scholengroep, ook als je ze nog nooit nodig had. Zoek hun namen één keer op.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>De ICT-coördinator.</strong> "Mag ik deze tool gebruiken, en is er een schoolaccount?" Vaak is dit ook het aanspreekpunt informatieveiligheid van je school.',
              '<strong>Dezelfde collega, als er iets misliep.</strong> Een klaslijst in het verkeerde venster, een mail met punten naar de hele oudergroep: meld het nog diezelfde dag bij het aanspreekpunt of bij je directie. Jij hoeft niet in te schatten hoe erg het is — dat beoordelen zij, en de klok loopt vanaf het moment dat iemand het weet.',
              '<strong>De directie.</strong> Alles wat verder reikt dan je eigen lespraktijk: iets invoeren voor een hele graad, leerlingen zelf met een assistent laten werken.',
              '<strong>De DPO van de scholengroep of koepel.</strong> De functionaris voor gegevensbescherming, de privacyadviseur van je net. Die <em>adviseert</em>, beslist niet in jullie plaats en tekent geen contracten — dat blijft bij het schoolbestuur. In de praktijk loopt je vraag via je directie of het aanspreekpunt.',
              '<strong>Het lokaal comité en de preventieadviseur.</strong> Zodra iets het werk van je collega\'s raakt — een tool die taken verdeelt, iets opvolgt of meespeelt in een evaluatie — hoort dat op het overleg met het personeel vóór het start. Of dat formeel moet, verschilt per net; vraag het na bij je koepel.',
              '<strong>De zorgcoördinator en het CLB.</strong> Zodra het over een concrete leerling en zijn zorgtraject gaat. Dat gesprek hoort daar, niet in een chatvenster.',
            ],
          },
          {
            type: 'quiz',
            vraag: 'Een collega wil volgend trimester met het hele derde jaar aan de slag: elke leerling een eigen account bij een AI-assistent. Wat is de juiste eerste stap?',
            opties: [
              {
                tekst: 'Zelf beginnen op jouw account en kijken hoe het loopt; bij problemen stuur je bij.',
                juist: false,
                feedback: 'Uitproberen mag, en zonder persoonsgegevens is dat de beste manier om te leren. Maar een hele klas op jouw account is geen proef meer, en botst met de voorwaarden van de meeste tools.',
              },
              {
                tekst: 'Een toestemmingsbrief naar de ouders sturen; is die getekend, dan is het in orde.',
                juist: false,
                feedback: 'Een handtekening dekt minder dan je denkt, en is hier zelden de juiste grond. Eerst moet de school de tool en de afspraken rond hebben.',
              },
              {
                tekst: 'Het voorleggen aan de directie en de ICT-coördinator voor er iets start.',
                juist: true,
                feedback: 'Juist. Dit gaat van een lespraktijk naar een schooltoepassing, en dan beslist de school: er moet een contract met de leverancier zijn, ouders horen het te weten, en iemand kijkt de leeftijdsvoorwaarden van de tool na. Geen rem op een goed idee: zo wordt het een vaste werkwijze.',
              },
            ],
          },
          {
            type: 'opdracht',
            titel: 'Je eigen geval langs vier vragen',
            inhoud: 'Neem één ding dat jij met AI zou willen doen — of, in een directieteam, één toepassing die al gebruikt wordt. Schrijf het in één zin op: niet "AI gebruiken voor feedback", wel "de opstellen van mijn derde jaar laten nalezen op structuur". Loop dan de vragen hieronder af en stop zodra je bij een actie uitkomt. Tien minuten.',
            stappen: [
              'Zit er iets van of over een herkenbare persoon in? Nee: ga je gang, als de tekst die je erin plakt van jou is. Ja: verder.',
              'Kan die persoon eruit? Meestal wel: beschrijf de situatie zonder naam, klas of herkenbaar detail. Lukt dat niet zonder je vraag kapot te maken, stel de vraag dan algemener of werk in de omgeving waar je school afspraken mee heeft. Helpt ook dat niet: verder.',
              'Gaat het over zorg, gezondheid, geloof, afkomst of de thuissituatie? Dan stop je hier en ga je langs bij je directie, het aanspreekpunt of je zorgcoördinator; daar beslis je niet alleen over. Zo niet: verder.',
              'Beslist het systeem mee over een mens — een punt, een attest, een oriëntering, een inschrijving, de evaluatie van een collega? Dan blijft die beslissing bij jou of bij de klassenraad, en levert het systeem hoogstens een voorstel dat je kan tegenspreken.',
              'Zoek tot slot de twee namen op die je nog niet kende: het aanspreekpunt informatieveiligheid, en via wie de DPO loopt.',
            ],
          },
          {
            type: 'prompt',
            titel: 'Voor de directie: een eerste versie van jullie afspraken',
            tekst: 'Je bent een ervaren directeur van een Vlaamse school die een korte, leesbare nota schrijft over het gebruik van AI door het personeel.\n\nOnze school: [BASISONDERWIJS OF SECUNDAIR], ongeveer [AANTAL] leerlingen.\nWat vandaag al gebruikt wordt: [TOOLS DIE AL IN GEBRUIK ZIJN, OF: NOG NIETS AFGESPROKEN].\n\nSchrijf één pagina met drie delen:\n1. Wat gewoon mag, met vijf concrete voorbeelden uit de dagelijkse praktijk van een leerkracht.\n2. Wat niet in een AI-tool gaat, in hoogstens vier regels, telkens met wat je dan wel doet.\n3. Bij wie een collega met welke vraag terechtkan.\n\nToon: informerend en vertrouwend, niet belerend. Geen juridisch jargon. Korte zinnen. Vlaamse schooltermen.\n\nZet onderaan de drie vragen die ik zelf nog moet beantwoorden voor deze nota af is.',
            uitleg: 'Dit is een vertrekpunt, geen afgewerkte nota en geen juridisch advies: de assistent kent jullie contracten en leveranciers niet, dus alles over een concrete tool controleer je zelf. Let vooral op de <strong>drie vragen onderaan</strong> — dat is meestal precies waar jullie beleid nog niet beslist is. Werk de tekst af met je ICT-coördinator en het aanspreekpunt informatieveiligheid, en zet er een datum op waarop je ze opnieuw bekijkt. De module voor directies werkt dit verder uit.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Dit is geen juridisch advies — en dat hoeft ook niet',
            inhoud: 'Deze module geeft een kader, geen sluitend juridisch antwoord: de regels rond AI bewegen, en je hebt meer aan drie principes die blijven kloppen. <strong>Geen persoonsgegevens in een tool zonder afspraken</strong>, <strong>bij twijfel vragen in plaats van zelf beslissen</strong>, en <strong>altijd zelf nalezen wat een assistent schrijft</strong>. Gaat het over één concreet systeem in jouw school, dan is er maar één adres: de DPO, via je directie of het aanspreekpunt.',
          },
        ],
      },
    ],
  },
  {
    id: 'beleid-wet',
    icoon: '📜',
    titel: 'De wet in mensentaal',
    ondertitel: 'Drie wetten die er echt toe doen, vertaald naar wat jij morgen doet — en naar wat de school moet afspreken.',
    niveau: 'Essentieel',
    doelen: [
      'Je kan uitleggen wie verantwoordelijk is voor de gegevens van leerlingen en collega\'s, en waarom dat mee bepaalt wat je in een prompt (je vraag aan de assistent) zet.',
      'Je weet wat de Europese AI-verordening vandaag al van een school vraagt, en wat pas later komt.',
      'Je weet wat je met lesmateriaal van anderen mag doen — in je klas, op Smartschool en op KlasCement.',
    ],
    klaarzetten: [
      'Geen laptops nodig. Wil je een van de prompts tonen, dan volstaat jouw scherm met een AI-assistent erop.',
      'Zoek op waar jullie afgeschermde leeromgeving staat en wie de verwerkersovereenkomsten bijhoudt. Die twee vragen komen gegarandeerd.',
      'Spreek vooraf met je directie af wat je over jullie eigen contracten kan toezeggen en wat je doorverwijst naar de DPO.',
    ],
    lessen: [
      {
        id: 'gdpr-mensentaal',
        titel: 'GDPR: gegevens van mensen',
        minuten: 15,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'GDPR is de privacywetgeving: ze zegt hoe je omgaat met gegevens over mensen. In de leraarskamer klinkt ze als <em>"je mag niks meer"</em> of <em>"je moet altijd toestemming vragen"</em>. Allebei fout. Deze les zet er vier dingen tegenover die wél kloppen. Waar <em>voor de directie</em> staat, gaat het over afspraken voor de hele school.',
          },
          {
            type: 'tekst',
            inhoud: 'Eerste ding: <strong>de school is verantwoordelijk, niet jij persoonlijk.</strong> De wet legt dat bij het schoolbestuur: de scholengroep, de vzw, het gemeente- of provinciebestuur. Typ jij gegevens van een leerling in een AI-assistent, dan doet juridisch jouw school dat, en spreekt de toezichthouder je school aan, niet jou. Daarom is <em>"mag ik deze tool gebruiken?"</em> de juiste vraag: buiten de schoolafspraken blijft je school aanspreekbaar, maar zonder de afspraken die haar beschermen.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Voor de directie: dit kan je niet doorschuiven',
            inhoud: 'Het bestuur is de <strong>verwerkingsverantwoordelijke</strong> — degene die beslist waarvoor en hoe gegevens gebruikt worden. Die rol geef je niet door: niet aan een leverancier, niet aan de koepel, niet aan de DPO (de privacyadviseur van je scholengroep of koepel). De Gegevensbeschermingsautoriteit, de toezichthouder op de privacywetgeving, bevestigde dat in april 2025 in beslissing 70/2025 over een Vlaamse school: <em>"de leverancier doet het werk, dus die is verantwoordelijk"</em> en <em>"wij zien die antwoorden nooit, dus wij verwerken niets"</em> hielden geen stand; de school moest kunnen aantonen dat ze had nagedacht. Werken collega\'s met eigen accounts, dan is dat een gat in jullie beleid, geen individuele overtreding.',
          },
          {
            type: 'tekst',
            inhoud: 'Tweede ding: <strong>toestemming is meestal níét de juiste grond.</strong> Een school houdt punten bij en overlegt met het CLB omdat dat haar opdracht is; daar hoef je geen handtekening voor te vragen. Toestemming hoort bij wat daarbuiten valt: een klasfoto op de website, gegevens doorgeven aan een logopedist. Verwar het ook niet met informeren: <strong>ouders inlichten</strong> moet bijna altijd, <strong>ouders toestemming vragen</strong> zelden. En een handtekening maakt het niet vanzelf in orde: toestemming moet vrij zijn en even makkelijk in te trekken als te geven, dus zegt één ouder nee, dan moet je het zonder dat kind kunnen. Een ondertekend schoolreglement is dan ook geen toestemming — dat zei de minister van Onderwijs in juni 2025 over AI-gebruik, op gezag van de Vlaamse Toezichtcommissie, die toekijkt op hoe Vlaamse overheidsdiensten en scholen met gegevens omgaan. Bij personeel geldt hetzelfde: in een gezagsverhouding is "vrij" moeilijk hard te maken.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Dertien jaar is geen AI-leeftijd',
            inhoud: 'Mogen leerlingen zelf met een assistent werken, en vanaf wanneer? Er bestaat geen wettelijke minimumleeftijd voor AI; die dertien jaar komt uit een regel over online diensten die op toestemming werken. Wat telt, zijn de gebruiksvoorwaarden van de tool en de afspraken van je school. In het lager onderwijs werk je klassikaal op jouw scherm en met jouw account; in het secundair kan begeleid gebruik, maar dat beslist de school, niet de leerkracht alleen. Vraag het na bij je ICT-coördinator of directie.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Mag wel.</strong> Een oefenreeks breuken voor het vierde leerjaar laten maken, een lesidee uitwerken, een ouderbrief in eenvoudiger taal laten zetten: daar zit geen persoonsgegeven in.',
              '<strong>Mag wel.</strong> Een moeilijke mail van een ouder in algemene bewoordingen navertellen — <em>"een ouder is boos over een punt op een groepswerk"</em> — en zelf het antwoord schrijven.',
              '<strong>Mag niet.</strong> Een klaslijst met namen, punten of afwezigheden plakken in een assistent zonder schoolafspraken. Niet omdat een artikel dat verbiedt, maar omdat die gegevens buiten jullie controle komen.',
              '<strong>Mag niet.</strong> Een verslag van het zorgoverleg, een MDO-nota of een stuk uit een CLB-dossier laten samenvatten; namen wegknippen helpt niet. Ook in een goedgekeurde tool beslist de school daarover, samen met de DPO.',
              '<strong>Mag niet.</strong> Gegevens van collega\'s: een sollicitatiebrief of een personeelsdossier hoort, net als een klaslijst, enkel in een omgeving waar je school afspraken mee heeft. Een ziektebriefje is een gezondheidsgegeven en ligt even streng als een zorgverslag van een leerling: dat gaat er sowieso niet in.',
              '<strong>Hangt ervan af.</strong> Een tekst van een leerling zonder naam laten nalezen. Meestal prima, maar een tekst kan zichzelf verraden; lees eerst na of een collega zou kunnen raden over wie het gaat.',
              '<strong>Hangt ervan af.</strong> Je privéaccount gebruiken, of een AI-functie die wordt bijgezet in een pakket dat jullie al hebben. Zonder leerlinggegevens juridisch geen probleem, maar je school kan er afspraken over hebben, en een bestaand contract dekt een nieuwe functie niet automatisch — laat dat navragen bij de ICT-coördinator.',
            ],
          },
          {
            type: 'tekst',
            inhoud: 'Derde ding: achter elke goedgekeurde tool zit een <strong>verwerkersovereenkomst</strong> — een contract tussen je schoolbestuur en de leverancier over wat die met jullie gegevens mag doen, hoelang hij ze bewaart en wat er gebeurt als er iets lekt. Achter een gratis account dat je zelf aanmaakte zit dat niet. Vandaar het onderscheid: in een tool mét contract werk je zoals afgesproken, in een tool zonder contract hou je persoonsgegevens eruit. <strong>Voor de directie:</strong> de onderwijsverstrekkers maakten samen één model, via privacyinonderwijs.be. De clausule die het vaakst ontbreekt: wordt jullie invoer gebruikt om het model te trainen? Het bestuur tekent, niet de DPO.',
          },
          {
            type: 'tekst',
            inhoud: 'Vierde ding: gaat er iets mis, dan telt hoe snel je het meldt. Een datalek is ruimer dan een hack: een mail met de puntenlijst naar de hele oudergroep, een verloren usb-stick, een AI-gesprek met leerlinggegevens in een tool zonder afspraken. <strong>Jij hoeft niet te oordelen of het ernstig is.</strong> Je meldt het diezelfde dag bij je <strong>aanspreekpunt informatieveiligheid</strong> — bij jou op school, vaak de ICT-coördinator of iemand uit het directieteam — of bij je directie; zij beoordelen of het verder moet. De school heeft maar 72 uur, en die klok start bij wie het als eerste wist. De <strong>DPO</strong>, voluit de functionaris voor gegevensbescherming, zit een stap verder, bij je scholengroep of koepel: die adviseert, maar beslist niet in de plaats van het bestuur. En onthou: deze module vertaalt de regels, ze is <em>geen juridisch advies</em>.',
          },
          {
            type: 'opdracht',
            titel: 'Herschrijf je laatste prompt',
            inhoud: 'De beste bescherming is weglaten: negen van de tien keer is <em>"een leerling van het tweede jaar"</em> even bruikbaar als <em>"Lotte uit 4A"</em>. Vijf minuten, en je hebt er geen tool voor nodig.',
            stappen: [
              'Neem de laatste prompt waarin iets over een leerling, een ouder of een collega stond, of de prompt die je deze week wil typen.',
              'Streep alles weg wat naar één persoon wijst: naam, klas, een leerjaar in combinatie met een kenmerk, de thuissituatie, een diagnose.',
              'Lees wat overblijft: zou een collega kunnen raden over wie dit gaat? Is het antwoord ja, haal er nog iets uit.',
              'Mist de assistent nu iets, voeg dat toe als onderwijsbehoefte in plaats van als persoon: niet "Lotte", wel "een kind dat zijn huiswerk niet maakt". Bewaar die versie als sjabloon.',
            ],
          },
        ],
      },
      {
        id: 'ai-verordening',
        titel: 'De Europese AI-verordening',
        minuten: 10,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Over de Europese AI-verordening doen twee verhalen de ronde: <em>er is nu een AI-wet, dus ik mag niks meer</em>, en sinds de krantenkoppen over uitstel <em>Europa heeft het afgezwakt, dus het hoeft niet meer</em>. Allebei fout. Sinds februari 2025 gelden een handvol verboden praktijken en de plicht dat een school haar personeel helpt begrijpen waar het mee werkt; sinds augustus 2026 de transparantieregels: mensen moeten weten wanneer ze met AI te maken hebben. De zware regels voor AI die mee beslist over leerlingen zijn in de zomer van 2026 opgeschoven naar <strong>2 december 2027</strong>. Opgeschoven, niet geschrapt.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Voor de directie: uitstel is ademruimte, geen afstel',
            inhoud: 'Je hebt tot december 2027 om in kaart te brengen welke AI in je school mee beslist over leerlingen of hun traject stuurt. Dat kost makkelijk een schooljaar, dus begin daarmee en niet met het beleid: één kolom met wat er in huis is, één met wat het doet — een leerkracht ondersteunen, of mee beslissen over een leerling. Verandert zo\'n systeem het werk van je personeel merkbaar, leg het dan eerst voor aan het sociaal overleg; welke procedure bij jouw net geldt, vraag je na bij je koepel. Wees voorzichtig met een leverancier die zegt dat "de regels zijn teruggedraaid": enkel de kalender schoof op, niet de inhoud.',
          },
          {
            type: 'tekst',
            inhoud: 'Eén verbod gaat rechtstreeks over scholen, en het geldt al sinds februari 2025: <strong>AI die emoties afleidt uit beeld, stem of lichaamstaal mag niet op school en niet op de werkvloer.</strong> Geen camera-app dus die in het vierde leerjaar aan gezichten afleest wie "aandachtig" is, geen toetsprogramma dat nervositeit registreert, en ook geen welzijnstool die uit stemopnames afleidt of leerkrachten gestresseerd zijn — een school is onderwijsinstelling én werkplek tegelijk. De reden: zo\'n meting deugt wetenschappelijk niet en de verhouding is te ongelijk.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Mag wel.</strong> Een AI-assistent je lesvoorbereiding, oefeningen of een ouderbrief laten schrijven. De AI-verordening legt daar geen drempel voor.',
              '<strong>Mag wel.</strong> Online toezicht bij een toets in het zesde jaar dat vaststelt dat een leerling naar een tweede scherm kijkt, zolang het daar geen emoties uit afleidt — de Europese Commissie noemt dat zelf als toegelaten voorbeeld. Dat zegt wel alleen iets over dít verbod: zulke software staat op de lijst hoog risico — toegelaten, maar vanaf 2027 onder zware voorwaarden, zie verderop — en de privacywetgeving weegt er nu al zwaar op.',
              '<strong>Mag niet.</strong> Software die tijdens de les uit gezichten of stemmen afleidt wie geboeid, verveeld of gestrest is. Ook niet als demo: toestemming van ouders lost dit niet op, want dit is een verbod en geen privacyregel.',
              '<strong>Mag niet.</strong> Een systeem dat uit beelden van leerlingen hun herkomst, geloof of seksuele gerichtheid afleidt, of dat ongericht gezichten van het internet of uit camerabeelden harkt voor een herkenningsdatabank. Gezichtsherkenning hoort sowieso niet thuis in een school.',
              '<strong>Hangt ervan af.</strong> Het verbod op emotieherkenning kent één smalle uitzondering: medische of veiligheidsredenen. Ondersteuning van een leerling met een beperking kan daaronder vallen, maar dan beperkt en onderbouwd — een dossier voor het zorgoverleg samen met de DPO, geen beslissing die je in de klas neemt.',
              '<strong>Hangt ervan af.</strong> Een "slim dashboard" dat gedrag, afwezigheden en punten samenbrengt. Zet het enkel informatie naast elkaar waar mensen over oordelen, dan is er niets aan de hand. Weegt gedrag op de speelplaats mee in een oriënteringsbeslissing, dan is het tijd voor de DPO.',
            ],
          },
          {
            type: 'tekst',
            inhoud: 'Vier onderwijstoepassingen staan in de wet als <strong>hoog risico</strong>: AI die bepaalt wie toegelaten of ingedeeld wordt, AI die leerresultaten beoordeelt, AI die inschat welk niveau iemand aankan, en AI die tijdens een toets verboden gedrag opspoort. Die lijst bestaat vandaag al; op 2 december 2027 beginnen de verplichtingen. Je kan er nu al naar vragen, en het is aan de leverancier om te onderbouwen of zijn systeem eronder valt. De categorie volgt uit wat een systeem met een leerling <em>doet</em>: een assistent waarmee jij een les voorbereidt staat er niet bij, en een beurtrolgenerator die je zelf liet bouwen is gewoon software die jouw regels volgt — zolang er in het eindproduct zelf niets meedraait dat zélf bedenkt hoe het tot een antwoord komt. <strong>Bouw alles wat jóu helpt, bouw niets dat over een leerling beslist.</strong>',
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Hoog risico betekent niet verboden',
            inhoud: 'Het betekent: toegelaten, maar omkaderd. Dat een <em>mens</em> de beslissing neemt, is geen nieuwe eis — de privacywetgeving geeft leerlingen en personeelsleden nu al het recht dat een beslissing met echte gevolgen niet volledig automatisch valt. Wat in december 2027 bijkomt, is één aanwijsbare persoon met kennis, met opleiding én met de bevoegdheid om het advies naast zich neer te leggen. Die derde ontbreekt het vaakst: voel je dat je een voorstel eigenlijk niet <em>mag</em> tegenspreken, dan is dat toezicht niet in orde — een punt voor de vakwerkgroep of de directie.',
          },
          {
            type: 'tekst',
            inhoud: 'De enige plicht die vandaag al op élke school weegt, is meteen de vriendelijkste: je school moet haar personeel de kans geven te begrijpen waar het mee werkt. Geen examen, geen attest, geen voorgeschreven kennisniveau — de Europese Commissie bevestigde dat scholen de kennis van hun mensen niet hoeven te meten. Een personeelsvergadering, een pedagogische studiedag of een vorming zoals deze telt mee; enkel verwijzen naar de handleiding van een tool doorgaans niet. Blijft nog de transparantieregel: een chatfunctie op de schoolwebsite mag niet doorgaan voor een medewerker van het secretariaat, en een realistische AI-foto of -video hoort als zodanig benoemd. Een ouderbrief die jij zelf nalas en ondertekende valt daar niet onder.',
          },
          {
            type: 'quiz',
            vraag: 'Een collega zegt: wij gebruiken een AI-assistent om oefeningen te maken, dus wij werken met hoogrisico-AI en moeten een dossier aanleggen. Klopt dat?',
            opties: [
              {
                tekst: 'Nee. Hoog risico slaat op systemen die mee beslissen over een leerling: toelating, beoordeling van leerresultaten, niveau of toezicht tijdens een toets.',
                juist: true,
                feedback: 'Juist. Een assistent waarmee jij materiaal maakt en waarbij jij nadien oordeelt, valt daar niet onder. Een programma dat zelf punten zet wel.',
              },
              {
                tekst: 'Ja. Elke AI die in een school gebruikt wordt, valt in de categorie hoog risico.',
                juist: false,
                feedback: 'Nee. De categorie hangt af van wat een tool met een leerling doet, niet van hoe krachtig ze is.',
              },
              {
                tekst: 'Ja, maar pas vanaf december 2027, dus tot dan hoeven jullie niets te doen.',
                juist: false,
                feedback: 'Twee fouten in één. Oefeningen maken wordt ook in 2027 geen hoog risico, en wat vandaag al geldt, is niet uitgesteld.',
              },
            ],
          },
        ],
      },
      {
        id: 'auteursrecht-en-delen',
        titel: 'Auteursrecht en wat je deelt',
        minuten: 10,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Auteursrecht is het stuk waar leerkrachten het vaakst per ongeluk over een lijn gaan — niet in de klas, wel wanneer ze iets delen. De wet heeft namelijk een uitzondering voor onderwijs: je mag werk van anderen gebruiken <em>ter illustratie bij je les</em>, zonder iemand om toestemming te vragen. Een krantenartikel kopiëren, een filmfragment tonen, een foto in je werkblad plakken. De vraag is dus niet "mag dit?" maar <strong>"illustreer ik hiermee mijn les, of vervang ik iets wat de school of de leerling anders zou kopen?"</strong>. Dat tweede kan niet: het volledige werkboek Frans inscannen gaat te ver. Gratis is het overigens niet — je schoolbestuur betaalt een jaarlijkse vergoeding per leerling via Reprobel — maar jij hoeft niemand te bellen.',
          },
          {
            type: 'tekst',
            inhoud: 'En dan de grens. De uitzondering geldt binnen de school en in een <strong>afgeschermde leeromgeving</strong>: een plek waar je moet inloggen en waar alleen je eigen leerlingen en collega\'s bijkunnen. Smartschool is dus je klaslokaal; het open internet niet. Dezelfde pdf op de publieke schoolwebsite, in een gedeelde map met een open link, of op KlasCement: daar valt de uitzondering weg. Test: open die map eens in een privévenster, uitgelogd. Zie je hem, dan is hij publiek.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Mag wel.</strong> Een ingescand krantenartikel in de Smartschool-cursus van je klas zetten, met vermelding van krant, datum en auteur.',
              '<strong>Mag wel.</strong> Datzelfde via het leerplatform delen met leerlingen die thuis zitten: "in de gebouwen of elders" staat letterlijk in de wet.',
              '<strong>Mag wel.</strong> Een volledig zelfgemaakte bundel met eigen beeld of beeld uit een vrije beeldbank op KlasCement zetten, met bronvermelding.',
              '<strong>Mag niet.</strong> Diezelfde ingescande bladzijden als pdf op de publieke pagina van de school zetten, of op KlasCement. Let op: bij het uploaden bevestig jij dat er niets van iemand anders in zit, en daar ben je zelf op aanspreekbaar — dit is het ene stuk waar de school het niet van je overneemt.',
              '<strong>Mag niet.</strong> De bronvermelding weglaten omdat ze lelijk staat op je dia: zonder vermelding val je buiten de uitzondering.',
              '<strong>Mag niet.</strong> Een foto van je klas op KlasCement zetten. Daar komt naast het auteursrecht ook het portretrecht bij — het recht van iemand op zijn eigen beeld — en de privacywetgeving.',
              '<strong>Hangt ervan af.</strong> Hoeveel je mag overnemen. De wet zegt enkel dat het verantwoord moet zijn door het niet-winstgevende doel. In de praktijk hanteren de koepels en de organisaties die de auteursvergoedingen innen ongeveer tien procent van een afgerond geheel: een sectorafspraak, geen wettelijk maximum. Vraag na wat bij jouw net geldt.',
              '<strong>Hangt ervan af.</strong> Materiaal dat je in opdracht van de school maakte. Dat behoort volgens Onderwijs Vlaanderen toe aan de school; wat je op eigen initiatief maakte, aan jou. Spreek vooraf af wat ermee gebeurt bij een schoolverandering.',
            ],
          },
          {
            type: 'tekst',
            inhoud: 'Waar AI iets nieuws toevoegt: een AI-assistent is <strong>geen afgeschermde leeromgeving</strong>. Een hoofdstuk uit een handboek erin plakken, is dat werk doorsturen naar een bedrijf buiten je school; daar helpt de onderwijsuitzondering niet meer, en hoe dat juridisch precies zit, is nog niet uitgemaakt. Dit gaat wel over materiaal van een uitgeverij: <strong>je eigen toets, werkblad of oefening plak je gerust</strong>, net zoals de rest van deze cursus je aanraadt. Voor werk van anderen beschrijf je in je eigen woorden het leerdoel, de leerstof en het niveau. En van wat een assistent zelf maakt, is waarschijnlijk niemand de auteur: handig voor je werkblad, maar zit er een herkenbaar personage, logo of handtekening in, gebruik het dan niet.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Tien seconden die het verschil maken',
            inhoud: 'Zet onder elk beeld en elke overgenomen tekst: de auteur, de bron, en bij een website de datum waarop je ze ophaalde. Dat is letterlijk het verschil tussen "dit mag" en "dit mag niet", want zonder vermelding val je buiten de onderwijsuitzondering. Bij een AI-beeld hoort erbij dat het met AI gemaakt is; dat vraagt Onderwijs Vlaanderen. <strong>Voor de directie:</strong> kies vrije beeldbanken voor de hele school, voorzie sjablonen waarin de bronvermelding al een vaste plek heeft, laat nakijken dat "afgeschermd" ook echt afgeschermd is — een gedeelde link zonder login is een publicatie — en zet de aangiftes van Reprobel en van SEMU, de aparte licentie voor bladmuziek, in de jaarkalender.',
          },
          {
            type: 'prompt',
            titel: 'Je bundel klaarmaken om te delen',
            tekst: 'Ik ben leerkracht [LEERJAAR OF VAK] en wil het lesmateriaal hieronder delen op KlasCement. Er mag dus niets meer in staan dat van iemand anders is.\n\nGeef me een lijst met:\n1. elke passage die uit een handboek, een krant of een ander werk lijkt te komen\n2. elke plek waar een bronvermelding ontbreekt\n3. elk stuk waar een naam, een foto of een herkenbaar detail van een leerling in staat\n\nStel bij elk punt voor hoe ik het vervang of weglaat. Verzin geen bronnen: weet je niet waar iets vandaan komt, zeg dat dan.\n\nMateriaal:\n[PLAK HIER JE EIGEN TEKST]',
            uitleg: 'Dit is geen juridische goedkeuring: wat de assistent niet markeert, is daarom nog niet in orde. Gebruik hem als tweede paar ogen op <em>je eigen</em> werk.',
          },
          {
            type: 'tekst',
            inhoud: 'Tot slot: dit is <strong>geen juridisch advies</strong>, maar een vertaling van wat er staat naar wat je ermee doet, geschreven in oktober 2026. Bij twijfel over één systeem: de <strong>DPO van de scholengroep</strong>, via je aanspreekpunt informatieveiligheid. Voor een beleidsvraag: je pedagogische begeleidingsdienst of koepel. Voor alles rond zorg: je zorgcoördinator en het CLB.',
          },
        ],
      },
    ],
  },
  {
    id: 'beleid-school',
    icoon: '🏛️',
    titel: 'Voor directies en schoolbeleid',
    ondertitel: 'Leerlingdata van minderjarigen, gevoelige personeelsdata, en hoe je tot afspraken komt die mensen ook echt volgen.',
    niveau: 'Essentieel',
    doelen: [
      'Je weet waarom gegevens van minderjarigen zwaarder wegen, en wat je school daarover concreet vastlegt.',
      'Je ziet waarom personeelsdata een apart hoofdstuk zijn, en welk overleg bij een invoering hoort.',
      'Je brengt je team in één vergadering tot een eerste versie van een AI-afsprakenkader.',
    ],
    klaarzetten: [
      'Het AI-beleid of het ICT-reglement van je school of scholengroep, als dat al bestaat.',
      'Voor de opdracht achteraan: een uur vergadertijd met het directieteam, de ICT-coördinator, de zorgcoördinator en twee of drie leerkrachten uit verschillende vakwerkgroepen of leerjaren.',
      'Iemand die notuleert, en de namen van jullie aanspreekpunt informatieveiligheid en van de DPO. Die opdracht eindigt met namen en data, niet met functies.',
      'Vraag de DPO vooraf om advies in plaats van achteraf om goedkeuring. Dat scheelt je een ronde.',
    ],
    lessen: [
      {
        id: 'leerlingdata-minderjarigen',
        titel: 'Leerlingdata en minderjarigen',
        minuten: 15,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Ergens in je school zit vandaag iemand met een klaslijst in een AI-venster. Niet uit onwil, gewoon omdat het werkt en omdat niemand ooit zei dat het niet mocht. Dat is geen personeelsprobleem maar een gat in het beleid, en het kost het meest bij de gegevens van minderjarigen. Lees je mee als leerkracht: deze module legt uit waarom je school bepaalde dingen vraagt, en wat jij mag verwachten dat zij regelt. Kinderen krijgen in de wetgeving <strong>extra bescherming</strong>. Dat betekent niet dat je niets mag, wel dat de lat hoger ligt.',
          },
          {
            type: 'tekst',
            inhoud: 'De wet legt de verantwoordelijkheid voor persoonsgegevens bij het <strong>schoolbestuur</strong> — de inrichtende macht, de scholengroep, het gemeente- of provinciebestuur. Niet bij de individuele leerkracht. Typt een leerkracht op eigen houtje leerlinggegevens in een AI-assistent, dan is het juridisch jóuw school die dat doet. Doorschuiven naar de leverancier kan evenmin: werkt hij enkel in jullie opdracht, dan is hij <em>verwerker</em> en blijven jullie bepalen waarvoor en hoe; gebruikt hij jullie invoer ook voor zichzelf — om zijn model te trainen bijvoorbeeld — dan is hij dat niet eens, en precies dat moet een contract uitsluiten. "De leverancier regelt dat" hield dan ook geen stand in beslissing 70/2025 van de Gegevensbeschermingsautoriteit. Wat daar het zwaarst woog, was dat de school niet kon aantonen <em>dát</em> ze de afweging gemaakt had: één bijgehouden beslissing op papier is meer waard dan een beleidsplan dat niemand leest.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: '"Vanaf dertien mag het" — bijna altijd fout',
            inhoud: 'Je hoort die zin overal, en hij klopt zelden. Die dertien jaar komt uit één regel over online diensten die op toestemming steunen, en geldt daarbuiten niet: over gezondheidsgegevens van een leerling beslissen de ouders tot achttien. Er bestaat <strong>geen wettelijke minimumleeftijd voor AI</strong>. Wat in de praktijk wél bepaalt wat jullie leerlingen mogen, zijn de gebruiksvoorwaarden van de dienst en wat jullie school afspreekt. Hou die twee vragen apart: mag dit volgens de voorwaarden van de leverancier, gezien de leeftijd van onze leerlingen? En daarna pas: willen wij dit, en onder welke begeleiding?',
          },
          {
            type: 'tekst',
            inhoud: 'Het scherpste onderscheid is ook het makkelijkste: werkt de leerkracht alleen, of krijgt elke leerling een eigen venster? In het eerste geval verlaat er niets van een leerling de school — dat is lesvoorbereiding. Eigen leerlingaccounts zijn een <strong>project</strong>: er moet een reden in de wet staan die het toelaat (je DPO noemt dat een <em>rechtsgrond</em>), er is een <em>verwerkersovereenkomst</em> nodig — het contract dat vastlegt wat de leverancier met die gegevens mag doen — plus een risicobeoordeling vooraf (een <em>GEB</em> of <em>DPIA</em>) en informatie aan ouders. Informeren moet bijna altijd, toestemming vragen zelden, en "voor de zekerheid toch maar vragen" maakt je positie net zwakker. In de modelschoolreglementen van Katholiek Onderwijs Vlaanderen is het antwoord voor het basisonderwijs nee; in het secundair is het een beslissing met voorwaarden, en andere netten kunnen anders beslissen, dus kijk na wat jouw koepel afspreekt. Begin bij je ICT-coördinator en bij de <strong>DPO</strong>, de privacyadviseur van je scholengroep of koepel.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Dit mag.</strong> Klassikaal op het digibord een tekst laten herschrijven, een oefenreeks breuken maken voor het vierde leerjaar, of een algemene ouderbrief in eenvoudiger taal laten zetten. Daar zit geen gegeven van een leerling in, en dat is veruit het meeste van wat je team wil doen.',
              '<strong>Dit mag niet.</strong> Een klaslijst met punten, afwezigheden of zorgnoteringen plakken in een assistent zonder schoolafspraken. Of een klasfoto uploaden voor een poster: dat is een doorgifte aan een bedrijf, en de toestemming die ouders voor de schoolwebsite gaven, geldt niet voor dát doel. Wat dan wél: gegenereerd of rechtenvrij beeld.',
              '<strong>Dit hangt ervan af.</strong> Een leerkracht in het vijfde jaar secundair die ingescande taken laat nakijken. Zonder namen, in een omgeving waar de school een contract mee heeft: verdedigbaar. Op een privéaccount, met naam en handschrift op de scan: niet. Het verschil zit in wat er naar buiten gaat en met wie jullie iets afgesproken hebben.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'De ene lijn die echt hard is: zorggegevens',
            inhoud: 'Een vermoeden van dyslexie, een verslag van het zorgoverleg of MDO, een CLB-dossier: dat zijn geen gewone gegevens, en de wet is daar het strengst voor. Zet ze buiten het bereik van algemene AI-toepassingen, en schrijf er meteen bij wat wél kan: een onderwijsbehoefte beschrijven zonder de leerling. "Een leerling van het vierde leerjaar die moeite heeft met lange leesteksten" werkt even goed. Twijfel je over één geval, dan gaat dat eerst naar je zorgcoördinator, en als het over de tool zelf gaat naar de DPO.',
          },
          {
            type: 'casus',
            titel: 'Het dashboard dat zorgleerlingen voorspelt',
            situatie: 'Een leverancier toont een directieteam een module die automatisch aanduidt welke leerlingen volgend schooljaar extra zorg nodig zullen hebben: ze combineert punten, afwezigheden en notities uit het leerlingvolgsysteem. Hij stelt gerust: hij regelt de privacy, jullie zien enkel het resultaat.',
            oordeel: 'hangt-ervan-af',
            toelichting: 'Niet bij voorbaat verboden, maar wat de leverancier belooft, regelt hij niet. De school blijft degene die juridisch verantwoordelijk is voor die gegevens, ook als jullie enkel het resultaat zien — daarop ging een Vlaamse school in 2025 onderuit bij de Gegevensbeschermingsautoriteit. Dit gaat bovendien over minderjarigen en over zorg, dus hoort er in de regel een risicobeoordeling vooraf bij, samen met de DPO; en zodra er zorg- of gezondheidsgegevens in de berekening zitten, ligt de lat nog hoger. En de Europese AI-verordening rekent AI die inschat welk onderwijsniveau een leerling aankan bij de hoogrisicotoepassingen: niet verboden, wel toegelaten onder zware voorwaarden die pas vanaf eind 2027 gelden. Vandaag bijt dus vooral de privacywetgeving. Vraag de leverancier schriftelijk welke gegevens erin gaan, welke beslissing eruit komt, en of hij zijn product zelf bij die hoogrisicotoepassingen rekent, en zet dat antwoord in het aankoopdossier.',
            discussie: 'De vertegenwoordiger zegt: "alle scholen van jullie scholengroep gebruiken dit al." Verandert dat iets aan wat jullie zelf moeten nakijken? En wie legt het aan een ouder uit wanneer het systeem een kind verkeerd inschat?',
          },
        ],
      },
      {
        id: 'personeelsdata',
        titel: 'Personeelsdata, het vergeten stuk',
        minuten: 10,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Elke school die over AI nadenkt, denkt aan leerlingen. Bijna geen enkele denkt aan het personeel. Toch is dat het stuk waar een directie het snelst alleen komt te staan: een evaluatie, een sollicitatie, een ziekteperiode. Niet omdat er zoveel verboden is, wel omdat de reflexen die in een school heel normaal aanvoelen — even iets laten tekenen, snel iets laten samenvatten — hier precies de verkeerde zijn.',
          },
          {
            type: 'tekst',
            inhoud: 'Begin bij de meest voorkomende denkfout: een handtekening van het personeel. Toestemming telt alleen als ze <strong>vrij</strong> gegeven is, en tussen een bestuur en een personeelslid zit een gezagsverhouding. Valt die toestemming weg, dan valt alles wat je erop bouwde mee weg. Je hebt bijna altijd een stevigere basis: de uitvoering van de aanstelling, of iets wat de regelgeving je oplegt. Toestemming werkt wél voor wat écht vrijwillig is — een foto op de website, of een pilootproject waar wie niet meedoet gewoon verder werkt zoals voorheen. De test is simpel: wat gebeurt er met de collega die nee zegt? Een tweede reflex: een systeem dat "vanzelf" patronen opmerkt in het doen en laten van je personeel — wie traag reageert, wie laat inlogt, hoe iemands toon evolueert. Dat is <strong>toezicht houden op je personeel</strong>, ook als het zo niet bedoeld was. De toezichthouder kijkt dan naar twee dingen: bestond er een lichter middel, en was het personeel vooraf geïnformeerd? "We doen het voor hun eigen ontwikkeling" is een doel, geen afweging.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Dit mag.</strong> Een AI-assistent een vlottere vacaturetekst laten schrijven voor een opdracht in het tweede jaar secundair, of gespreksvragen laten voorstellen die aansluiten bij de functiebeschrijving. Daar gaat geen enkel gegeven van een kandidaat of een collega in.',
              '<strong>Dit mag niet.</strong> Twintig sollicitatiebrieven in een assistent plakken met de vraag de kandidaten te rangschikken: die brieven gingen naar jullie school, niet naar een AI-leverancier waar jullie niets mee afspraken, en een rangschikking is een oordeel over mensen — dat hoort iemand te doen die het dossier kent en zijn keuze kan uitleggen aan wie afgewezen wordt. "Ik gebruik die volgorde alleen als vertrekpunt" telt niet: wie een voorstel enkel wegklikt, beslist niet echt. Wat wél kan: laat de assistent een beoordelingsrooster opstellen op basis van de functiebeschrijving, zodat de commissie alle brieven met hetzelfde raster leest.',
              '<strong>Dit mag niet.</strong> De reden van een afwezigheid of een medisch attest van een collega in een assistent zetten: gezondheidsgegevens vallen onder de strengste categorie die er is, en je hoeft als directie niet te weten wát iemand heeft, enkel dat hij afwezig is en tot wanneer. Evenmin een personeelsdossier, dat hoort de school niet te verlaten.',
              '<strong>Dit mag niet.</strong> Software die emoties afleidt uit gezicht, stem of houding: die is in Europa verboden, bij personeel én bij leerlingen, ook als ze als welzijnszorg verkocht wordt. Enkel om medische of veiligheidsredenen bestaat er een smalle uitzondering.',
              '<strong>Dit hangt ervan af.</strong> Een evaluator die zijn eigen notities van een functioneringsgesprek laat herschrijven tot lopende zinnen. Zonder naam, zonder herkenbare details, in een omgeving waar de school afspraken mee heeft, en met vaststellingen die hij zelf deed: dat kan. Het volledige dossier uploaden met "maak hier een evaluatie van": dat niet.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'AI maakt een evaluatie niet objectiever',
            inhoud: 'Het is een verleidelijke gedachte: een assistent schrijft neutraler dan ik. In de praktijk gebeurt het omgekeerde: de tekst wordt vlotter én vager, en vaagheid is precies waar een evaluatie in beroep op sneuvelt. Het College van Beroep kijkt of de evaluatie aansluit bij de <strong>functiebeschrijving</strong> en of de aangehaalde feiten de conclusie dragen — twee dingen die een assistent niet kan leveren. Het heeft al een evaluatie vernietigd van een personeelslid dat geen functiebeschrijving had. Gebruik een assistent dus voor de vorm, nooit voor de vaststellingen. De Europese AI-verordening rekent AI bij werving, selectie, beoordeling en taakverdeling trouwens bij de <strong>hoogrisicotoepassingen</strong>: niet verboden, wel toegelaten onder strenge voorwaarden, met een mens die echt beslist. Die gelden pas vanaf eind 2027 — in 2026 uitgesteld, niet afgezwakt — dus wat vandaag al bijt, is de privacywetgeving.',
          },
          {
            type: 'tekst',
            inhoud: 'Blijft één vraag: wat beslis je als directie <em>niet</em> alleen? Nieuwe technologie die het werk merkbaar verandert, breng je op het personeelsoverleg vóór ze er is: het lokaal comité of het bevoegde onderhandelings- of overlegcomité, en het comité voor preventie en bescherming op het werk. Of dat voor een AI-toepassing ook formeel verplicht is, verschilt per net; vraag dat na bij je koepel of scholengroep, maar wacht het antwoord niet af. Eén agendapunt bespaart je het grootste risico van zo\'n invoering: het gevoel bij je team dat het achter hun rug gebeurde.',
          },
          {
            type: 'quiz',
            vraag: 'Een directeur wil AI-ondersteunde lesobservaties invoeren. Op de personeelsvergadering laat ze een blad rondgaan waarop elke leerkracht tekent dat ze akkoord gaat. Wat is er mis?',
            opties: [
              {
                tekst: 'Niets. Met de handtekening van alle betrokkenen is de school in orde.',
                juist: false,
                feedback: 'Dat is net de denkfout. Een handtekening maakt de positie van de school hier zelfs zwakker: valt de toestemming weg, dan valt alles wat je erop bouwde mee weg.',
              },
              {
                tekst: 'Toestemming van een personeelslid staat juridisch zwak: in een gezagsverhouding kan je moeilijk weigeren. De school heeft een andere grond nodig, en brengt de invoering het best eerst op het bevoegde overlegorgaan.',
                juist: true,
                feedback: 'Juist. Wie niet tekent, valt op. Leg vooraf vast op welke grond je werkt, en breng de invoering op het bevoegde overlegcomité, samen met het comité voor preventie en bescherming op het werk.',
              },
              {
                tekst: 'Lesobservaties mogen nooit, met of zonder toestemming.',
                juist: false,
                feedback: 'Te streng. Lesobservaties horen bij de gewone opvolging van personeel. Het gaat hier over wat je er met AI bij haalt, en over hoe je dat invoert.',
              },
            ],
          },
        ],
      },
      {
        id: 'afsprakenkader',
        titel: 'Van losse regels naar een afsprakenkader',
        minuten: 25,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Een AI-beleid dat niemand leest, verandert niets. Het risico is niet dat je te weinig opschrijft, maar dat je een tekst maakt die juridisch sluitend is en in de praktijk onvindbaar. Eén geruststelling vooraf: wachten op een Vlaams kader hoeft niet en helpt niet. Je team gebruikt AI ondertussen toch, en zonder afspraken is dat het slechtste van twee werelden.',
          },
          {
            type: 'tekst',
            inhoud: 'Van nul beginnen hoeft evenmin. De onderwijsverstrekkers maakten samen een modelverwerkersovereenkomst, een modelregister en gezamenlijke risicobeoordelingen voor veelgebruikte onderwijssoftware; dat staat op <strong>privacyinonderwijs.be</strong>. Het Kenniscentrum Digisprong heeft een vragenlijst om een AI-toepassing te beoordelen vóór je ze binnenhaalt. Voor generatieve AI-assistenten bestaat zo\'n gezamenlijke beoordeling vandaag nog niet; die maak je zelf, met je DPO. En downloaden is niet hetzelfde als toepassen: jullie blijven degenen die oordelen of de risico\'s in jullie situatie voldoende beperkt zijn. Zeven dingen horen hoe dan ook in jullie eigen tekst.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Welke toepassingen goedgekeurd zijn, en waarvoor.</strong> Met per toepassing het doel en de gegevens die erin mogen. Wat er niet op staat, gebruik je niet met persoonsgegevens.',
              '<strong>Wat er nooit in gaat.</strong> Zorg-, CLB- en gezondheidsgegevens, personeelsdossiers, beeld van leerlingen — bij elk verbod meteen de wél-variant.',
              '<strong>Wie beslist wat.</strong> Een leerkracht kiest haar werkwijze, de school kiest de toepassingen, het bestuur draagt de verantwoordelijkheid. Zet er namen bij.',
              '<strong>Hoe je een nieuwe tool binnenhaalt.</strong> Eén beoordelingsstap vóór ingebruikname: wie ze doet, en waar het antwoord landt.',
              '<strong>Wat leerlingen mogen.</strong> Per leerjaar of graad, of ze eigen accounts krijgen, en hoe je ouders informeert — zie de eerste les.',
              '<strong>Wat er met zelfgebouwde dingen gebeurt.</strong> Dit vergeet zowat elke school. Het kader hieronder geeft je de grens in één zin.',
              '<strong>Wat er gebeurt als het misloopt, en wanneer jullie het herbekijken.</strong> Eén meldpunt, één procedure, een plek voor incidenten, en een datum: zonder herzieningsmoment klopt jullie tekst over twee jaar niet meer en geldt ze toch nog.',
            ],
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Zelf bouwen voelt veiliger dan het is',
            inhoud: 'Een leerkracht die met AI een oefentool bouwt, kiest gevoelsmatig de veilige weg: geen leverancier, geen gegevens die het huis verlaten. Twee bedenkingen. Zo\'n tool draait zelden op één laptop: er zit bijna altijd een hostingdienst in de keten. En zit er in het eindproduct zélf nog AI die iets bedenkt, dan is jullie school niet enkel gebruiker maar ook maker, en komt het zware deel bij jullie; software die je mét AI liet bouwen maar die daarna gewoon rekent, valt daarbuiten. Zet dus geen verbod maar een grens: bouwen mag, testen met verzonnen gegevens, en niets dat over een leerling beslist — geen punten, geen toelating, geen oefenpad, geen toezicht tijdens een toets.',
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Regel de meldweg vóór je ze nodig hebt',
            inhoud: 'Een datalek is zelden een hack. Meestal is het een mail met de puntenlijst naar de verkeerde ouders, of een AI-gesprek met leerlinggegevens in een tool zonder afspraken. Twee dingen bepalen hoe zo\'n dag afloopt. Eén: wie het ziet, meldt meteen en hoeft zelf niet in te schatten hoe erg het is — dat doen jullie, met de DPO. Twee: de klok loopt vanaf het moment dat <em>iemand</em> in de school het weet, en voor een ernstig lek staat er 72 uur op om de toezichthouder te verwittigen. Leg dus één meldpunt en één procedure vast, en noteer intern ook wat je niet moet melden.',
          },
          {
            type: 'prompt',
            titel: 'Een eerste versie van je afsprakenkader laten opstellen',
            tekst: 'Je bent adviseur schoolbeleid. Schrijf een eerste versie van een AI-afsprakenkader voor onze school, op maximaal twee pagina\'s, in taal die een leerkracht op een maandagochtend begrijpt.\n\nOnze school: [BASIS- OF SECUNDAIR ONDERWIJS], [AANTAL] leerlingen, [AANTAL] personeelsleden.\nWat we vandaag al gebruiken: [LIJST TOEPASSINGEN].\nWat we zeker willen vastleggen: [JULLIE DRIE BELANGRIJKSTE PUNTEN].\n\nStructureer het zo: wat mag wel, wat mag niet, wat leg je voor en bij wie. Formuleer elk verbod samen met wat je dan wél doet. Gebruik geen juridisch jargon en geen artikelnummers. Zet onderaan een herzieningsdatum en een lege rubriek voor wat wij nog moeten aanvullen.',
            uitleg: 'Wat je terugkrijgt is een <strong>ontwerp, geen beleid</strong>: de assistent kent jullie school niet. De winst zit in de structuur en in de vragen waarop jullie nog geen antwoord hebben. Leg die voor aan je ICT-coördinator en aan de DPO vóór je iets rondstuurt, en zet er geen namen in.',
          },
          {
            type: 'kader',
            variant: 'weetje',
            titel: 'Wat er op dit moment nog niet geregeld is',
            inhoud: 'Er is <strong>geen afzonderlijke Vlaamse AI-wet voor het onderwijs</strong>: scholen werken binnen de <strong>GDPR</strong> — de Europese privacywetgeving — de Europese AI-verordening en de onderwijsregelgeving. Er lopen wel trajecten, maar dat is nog geen kader. Bij het schrijven van deze module was er in België ook nog geen AI-toezichthouder aangeduid; dat verandert niets aan wat geldt, enkel aan wie er vandaag op kijkt. Wat je school wél moet: haar personeel helpen begrijpen wat de AI doet die ze gebruikt. Daarvoor hoeft niemand een attest te halen en bestaat er geen apart AI-register; één overzicht van welke vorming jullie gaven en welke toepassing jullie goedkeurden, volstaat. Leg een concrete twijfel voor aan de DPO — dit is geen juridisch advies.',
          },
          {
            type: 'opdracht',
            titel: 'Eén vergadering, één eerste versie',
            inhoud: 'Een eerste versie waarin je team zich herkent, haal je in zestig minuten. Zet er niet alleen het directieteam rond: de <strong>ICT-coördinator</strong> weet wat er al draait, de <strong>zorgcoördinator</strong> bewaakt de lijn rond zorggegevens, en twee of drie leerkrachten uit verschillende vakwerkgroepen of leerjaren houden het herkenbaar. De <strong>DPO</strong> betrek je vooraf voor advies; tekenen doet het bestuur.',
            stappen: [
              'Tien minuten inventaris. Iedereen noemt wat hij met AI ziet gebeuren: welke toepassingen, door wie, waarvoor. Ook de gratis dingen, en wat een collega zelf in elkaar zette.',
              'Vijftien minuten sorteren. Zet elke toepassing in een van drie kolommen: er gaan persoonsgegevens in, er komt een beslissing over een leerling of personeelslid uit, of geen van beide. Die derde kolom is meestal de grootste en vraagt weinig werk.',
              'Vijftien minuten de harde lijnen. Spreek af wat er nooit in gaat, en schrijf bij elk verbod meteen op wat je dan wél doet, anders onthoudt niemand het.',
              'Twintig minuten de weg en de afspraak. Wie beoordeelt een nieuwe toepassing, bij wie meldt een leerkracht een twijfel of een fout, wie is jullie aanspreekpunt informatieveiligheid, wie schrijft de twee pagina\'s, wanneer gaat ze naar het overlegorgaan, het teamoverleg en de onthaalmap voor nieuwe collega\'s, stagiairs en vrijwilligers, en wanneer herbekijken jullie ze? Noem namen, en zet het in de notulen voor je de zaal verlaat.',
            ],
          },
        ],
      },
      // Voor wie dit spoor zelf geeft. Staat als verdieping gemarkeerd: het is
      // geen leerstof voor de zaal, dus het telt niet mee in de sessietijd en
      // het komt niet in de deelnemersbundel terecht.
      {
        id: 'dit-kader-geven',
        titel: 'Dit kader geven aan je team',
        minuten: 15,
        verdieping: true,
        blokken: [
          {
            type: 'tekst',
            inhoud: 'Van de drie sporen is dit het makkelijkst te geven: geen laptops, geen accounts, geen schoolnetwerk dat halverwege dichtvalt. Je hebt een zaal nodig, drie namen en een uur. Wat het lastig maakt, is iets anders. De vragen die terugkomen gaan over <em>jullie</em> school, en daar staat het antwoord niet in deze module. Bereid dus niet de leerstof voor maar de regie: wat zeg je toe, wat parkeer je, en bij wie komt het daarna terecht? Je hoeft geen jurist te zijn om dit te geven. "Dat weet ik niet, ik leg het voor aan de DPO en ik kom erop terug" is hier een volwaardig antwoord, en meteen het goede voorbeeld.',
          },
          {
            type: 'lijst',
            items: [
              '<strong>Een halfuur op een personeelsvergadering.</strong> De module <em>Het kader in het kort</em>: de ene vraag die alles stuurt — zit er iets van of over een herkenbare persoon in? — en wie in de school waarover beslist. De sessiebouwer rekent daar vijfendertig minuten voor; hou je het strikt op dertig, deel de vier vragen van de opdracht dan op papier uit in plaats van ze ter plekke te laten invullen. Opbrengst: iedereen weet wat gewoon mag, en iedereen kent de drie namen.',
              '<strong>Zestig minuten met het directieteam.</strong> De opdracht <em>Eén vergadering, één eerste versie</em>, in de les <em>Van losse regels naar een afsprakenkader</em> hierboven, is daar letterlijk het draaiboek van: tien minuten inventaris, vijftien sorteren, vijftien de harde lijnen, twintig de weg en de afspraak. Opbrengst: een eerste versie van jullie afsprakenkader, met namen en een datum erbij.',
              '<strong>Negentig minuten voor iedereen die mee beslist.</strong> <em>Het kader in het kort</em> en deze module samen, gelezen en besproken in plaats van voorgelezen. Opbrengst: één gedeeld beeld van wat de school moet regelen en van wat een leerkracht gerust mag doen. Reken dit als leestijd plus gesprek, niet als oefentijd: in dit spoor valt er niets aan een toestel te oefenen.',
            ],
          },
          {
            type: 'kader',
            variant: 'privacy',
            titel: 'Wat je ook in een halfuur niet overslaat',
            inhoud: 'Hoe kort je sessie ook is, twee dingen blijven staan. Eén: de <strong>meldweg</strong>. Wie iets ziet misgaan, meldt het diezelfde dag bij het aanspreekpunt informatieveiligheid of bij de directie, hoeft zelf niet in te schatten hoe erg het is, en wist het gesprek niet vóór zij zeggen dat het mag. Twee: <strong>zorg-, CLB- en gezondheidsgegevens blijven eruit</strong>, ook in een goedgekeurde tool. Die twee zinnen zijn de reden waarom een school dit kader geeft; de rest is context. Zeg ze dus vroeg, en niet in de laatste twee minuten wanneer de helft van de zaal al rechtstaat.',
          },
          {
            type: 'kader',
            variant: 'letop',
            titel: 'Waar een sessie over dit kader op vastloopt',
            inhoud: 'Drie dingen, en je ziet ze alle drie aankomen. <strong>Juridische uitzonderingen.</strong> Eén iemand begint over een geval dat nergens in past, en twintig minuten zijn weg; parkeer het zichtbaar bij de DPO en ga door. <strong>De vraag of het bij ons mag.</strong> Daar heb jij het antwoord vaak niet op, en dat is geen falen: noteer de vraag, spreek af wie ze uitzoekt en tegen wanneer, en kom erop terug. <strong>De zaal die zich betrapt voelt.</strong> Iemand plakte vorige week een klaslijst in een chatvenster en beseft dat nu. Open daarom met wat gewoon mag, want dat is het grootste deel, en behandel een fout als iets wat je meldt in plaats van als iets wat je bekent. Sluit nooit af met een waarschuwingenlijst.',
          },
          {
            type: 'kader',
            variant: 'tip',
            titel: 'Zet je sessie in elkaar met de sessiebouwer',
            inhoud: 'Zet begeleidersmodus aan en open de sessiebouwer op <code>#/sessie</code>. Je kiest daar hele modules van dit spoor of losse blokken uit een bestaand draaiboek, je zet er een onthaal, een pauze en een afronding bij, en je geeft elk onderdeel het aantal minuten dat jij echt hebt. De app rekent de kloktijden uit vanaf je startuur en maakt er een deelnemersbundel bij met de prompts en opdrachten van wat je koos. Je sessie zit in de link: mail hem naar jezelf en naar wie meekijkt, want zonder die link ben je hem kwijt. De begeleidersgids werkt dat uit onder <em>Een kortere sessie geven</em>.',
          },
          {
            type: 'tekst',
            inhoud: 'Stuur de link van deze leeromgeving diezelfde dag door, met één zin over wat je niet behandelde. Wie met een concrete twijfel blijft zitten, leest zelf verder in <em>De wet in mensentaal</em>. En noteer één datum voor je de zaal verlaat: wanneer komen jullie hierop terug? Zonder die datum blijft het bij een goed gesprek.',
          },
        ],
      },
    ],
  },
];
