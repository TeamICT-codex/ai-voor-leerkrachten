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
      'Bijna alles wat een sessie doet mislukken, is vooraf op te lossen. Reken op een halfuur voorbereiding, plus één mail naar de deelnemers.',
    punten: [
      {
        kop: 'Regel de accounts, en test er zelf één',
        tekst:
          'Dit is de nummer één tijdvreter. Laat accounts vooraf aanmaken en test er zelf eentje op het schoolnetwerk. Doe je dat niet, dan gaat je eerste halfuur op aan wachtwoorden.',
      },
      {
        kop: 'Test het netwerk op de locatie zelf',
        tekst:
          'Schoolnetwerken blokkeren soms wat thuis vlot werkt. Ga langs, open de tools, en probeer meteen ook de diensten die je in spoor B nodig hebt.',
      },
      {
        kop: 'Vraag eigen materiaal op',
        tekst:
          'Stuur de dag ervoor een herinnering: breng één les of oefening mee die je binnenkort echt geeft. Deelnemers die met eigen materiaal werken, leren dubbel zoveel. Hou zelf een paar generieke lesonderdelen achter de hand voor wie niets meebrengt.',
      },
      {
        kop: 'Vraag naar wat er stroef loopt',
        tekst:
          'Eén vraag in je uitnodiging — "welke taak slorpt te veel tijd op?" — geeft je meteen demo-onderwerpen die de zaal herkent.',
      },
      {
        kop: 'Ken het beleid van de school',
        tekst:
          'Weet vooraf of er een AI-beleid bestaat, wie de DPO is en wie de ICT-coördinator. Je krijgt gegarandeerd vragen waarop "vraag het aan X" het juiste antwoord is.',
      },
    ],
  },
  {
    id: 'zaal',
    icoon: '👥',
    titel: 'De zaal lezen',
    inleiding:
      'In elke groep leerkrachten zitten dezelfde vier types. Je hoeft ze niet gelijk te behandelen — je moet ze wel alle vier zien.',
    punten: [
      {
        kop: 'De onzekere',
        tekst:
          'Bang om iets stuk te doen, durft niet te klikken. Zeg expliciet dat er niets kan mislopen en dat een gesprek gewoon weggegooid kan worden. Ga er als eerste bij staan tijdens het eerste doe-blok.',
      },
      {
        kop: 'De scepticus',
        tekst:
          'Heeft vaak een terecht punt. Erken het, parkeer het zichtbaar, en kom er later op terug — zie de FAQ hieronder. Wuif nooit weg: de rest van de zaal kijkt hoe je hiermee omgaat.',
      },
      {
        kop: 'De voorloper',
        tekst:
          'Gebruikt het al maanden en loopt vooruit. Geef die een rol: laat hem of haar iets tonen, of koppel hem aan iemand die vastloopt. Anders wordt het een tweegesprek tussen jou en die persoon.',
      },
      {
        kop: 'De stille',
        tekst:
          'Zegt niets en dat zegt niets. Loop langs en kijk mee op het scherm in plaats van plenair te vragen of het lukt.',
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
          'De verleiding is groot om uitleg te laten uitlopen. Doe dat niet: de doe-blokken zijn waar het geleerd wordt. Loopt je uitleg uit, kort dan de uitleg in, niet het doen.',
      },
      {
        kop: 'Schrijf de parkeerlijst zichtbaar op',
        tekst:
          'Vragen die je nu niet kan of wil behandelen komen op een zichtbare lijst. Zo voelt niemand zich weggewuifd en hou je je timing.',
      },
    ],
  },
  {
    id: 'misgaan',
    icoon: '🔧',
    titel: 'Als het misloopt',
    inleiding: 'Vier scenario\'s die echt gebeuren, met een uitweg per stuk.',
    punten: [
      {
        kop: 'Het netwerk ligt plat',
        tekst:
          'Schakel over op één toestel met mobiele data en werk klassikaal verder: jij bedient, de zaal dicteert de prompts. Didactisch minder sterk, maar je verliest de sessie niet.',
      },
      {
        kop: 'De accounts werken niet',
        tekst:
          'Laat in duo\'s werken op de accounts die wél werken. Duo\'s zijn sowieso geen slechte werkvorm — ze dwingen deelnemers hardop te verwoorden wat ze willen.',
      },
      {
        kop: 'Je loopt een halfuur achter',
        tekst:
          'Schrap uitleg, nooit een doe-blok. Concreet: kort blok 2 en 4 in en behoud de tijd voor eigen materiaal. Zeg eerlijk tegen de groep wat je schrapt en waarom.',
      },
      {
        kop: 'Eén iemand loopt volledig vast',
        tekst:
          'Zet die persoon naast een buur en ga verder met de groep. Eén deelnemer redden ten koste van vijftien anderen is een slechte ruil. Bied achteraf tien minuten aan.',
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
          'De link naar deze leeromgeving, plus wat er in de sessie gemaakt is. Hoe langer je wacht, hoe minder er nog opengaat.',
      },
      {
        kop: 'Verzamel wat er gemaakt is',
        tekst:
          'Klasafspraken, gebouwde tools, geslaagde prompts. Eén gedeeld document per school wordt vanzelf een naslagwerk, en het toont collega\'s die er niet bij waren wat het oplevert.',
      },
      {
        kop: 'Spreek een terugkommoment af',
        tekst:
          'Een halfuur op een personeelsvergadering, drie tot zes weken later. Wat heeft iemand echt gebruikt, en wat niet? Dat gesprek is meer waard dan een extra workshop.',
      },
    ],
  },
];

// Wordt gevuld met de nagekeken FAQ uit de inhoudsronde.
export const FAQ_GROEPEN = [];
