# AI voor leerkrachten — werkafspraken

Digitale leeromgeving én workshopmateriaal om leerkrachten lager en secundair
onderwijs te leren werken met AI. Vanilla JS/HTML/CSS, geen build-stap.
Eén ontwikkelaar (Thomas), alles in het Nederlands.

## Taal & communicatie

- Alle output, commitboodschappen, code-comments en cursusinhoud in het
  Nederlands (Vlaams mag). Korte imperatieven van Thomas ("check eens even",
  "ga verder", "do your thing") zijn go-signalen, geen vragen.
- Bij een grotere inhoudelijke koerswijziging: eerst een kort plan voorleggen,
  pas bouwen na een expliciete "go". Kleine bijsturingen gewoon doen.
- Wees grondig zonder dat erom gevraagd wordt: doe zelf extra controle-passes.

## Doelgroep — hier draait alles om

Leerkrachten lager en secundair **zonder enige AI-ervaring**. Dat stuurt elke
schrijfkeuze:

- Geen vakjargon. Komt een technische term er toch in, leg hem meteen uit.
- Altijd een concreet klasvoorbeeld, nooit een abstracte uitleg.
- Vlaamse context: leerplandoelen en eindtermen, Smartschool, KlasCement, CLB,
  vakwerkgroep, pedagogische begeleiding, DPO van de scholengroep.
- Nooit belerend of alarmerend. Waarschuwingen zijn concreet en handelbaar.

## Tools: welk spoor gebruikt wat

- **Spoor A (AI in de klas)** is tool-neutraal: onze scholen gebruiken zowel
  **ChatGPT als Claude**. Schrijf "je AI-assistent" of noem beide. Waar het
  echt verschilt: een `kader` met `variant: 'tool'`.
- **Spoor B (vibe coden)** werkt met **Claude** — dat toont wat het bouwt
  meteen als werkende pagina. Dat staat ook zo uitgelegd in de inhoud.
- Vermijd claims die snel verouderen (prijzen, modelnamen, exacte
  menu-items). Schrijf op het niveau van vaardigheden, niet van knopjes.

## Workshopformat — hard vereiste

- Elke workshop duurt **exact 180 minuten**, inclusief één pauze van 15 min.
- Draaiboeken in `js/workshops.js` bevatten enkel duurtijden; de app rekent de
  kloktijden uit vanaf het ingestelde startuur.
- **Na elke wijziging aan een draaiboek: de som opnieuw controleren.** Zie
  "Controles" hieronder.
- Elk blok heeft een `soort` (instap/uitleg/doen/gesprek/pauze/afronding) en in
  begeleidersmodus `tips`. Een blok zonder tips is onafgewerkt.

## Structuur

```
js/inhoud.js        spoor A — inhoud
js/casussen.js      spoor A — casussenmodule (groepswerk A3)
js/inhoud-vibe.js   spoor B — inhoud
js/gids.js          begeleidersgids + de 22 lastige vragen
js/workshops.js     draaiboeken + sporen
js/cursus.js        voegt sporen samen, kloktijden
js/app.js           router, weergave, sessietimer, voortgang
css/style.css       alle styling, mobiel-eerst, afdrukblok onderaan
```

Inhoud is **data, geen code**. Een les toevoegen = een object toevoegen. Een
nieuw blok-type vraagt wel een `case` in `toonInhoudsblok()` plus styling.

## Code-conventies & bekende valkuilen

- Nederlandse namen voor variabelen en functies, in lijn met wat er staat.
- `localStorage` altijd in een try/catch: in een privévenster gooit het, en
  dan mag de app niet stukvallen.
- De inhoudsvelden bevatten bewust HTML (`<strong>`, `<em>`, `<code>`) en gaan
  ongeëscaped naar het scherm. Alles wat letterlijk moet blijven —
  promptteksten, quizantwoorden — gaat door `esc()`. Hou dat onderscheid
  scherp bij een nieuw blok-type.
- Bij een nieuwe `kader`-variant: styling toevoegen in `style.css`, anders
  valt het kader terug op geen enkele rand.
- Drie contexten bij CSS-werk: laptop van de deelnemer, gsm, en een beamer
  achteraan de zaal. Het afdrukblok onderaan `style.css` maakt het draaiboek
  op papier bruikbaar — vergeet dat niet mee te testen.

## Controles vóór een commit

Draaiboektiming, moduleverwijzingen en kadervarianten nakijken:

```bash
node --input-type=module -e "
import { WORKSHOPS } from './js/workshops.js';
import { MODULES_AI } from './js/inhoud.js';
import { MODULES_VIBE } from './js/inhoud-vibe.js';
import { MODULE_CASUSSEN } from './js/casussen.js';
const modules = [...MODULES_AI, MODULE_CASUSSEN, ...MODULES_VIBE];
const ids = new Set(modules.map(m => m.id));
let fout = 0;
for (const w of WORKSHOPS) {
  const som = w.draaiboek.reduce((s,b) => s + b.minuten, 0);
  if (som !== 180) { console.log('FOUT', w.code, som, 'min'); fout++; }
  for (const b of w.draaiboek)
    if (b.module && !ids.has(b.module)) { console.log('FOUT', w.code, 'onbekende module', b.module); fout++; }
}
// Een kader met een variant zonder styling valt terug op een neutraal kader.
// Dat ziet er niet kapot uit, dus een tikfout blijft anders onopgemerkt.
const VARIANTEN = new Set(['tip', 'letop', 'privacy', 'weetje', 'tool']);
for (const m of modules)
  for (const l of m.lessen)
    for (const b of l.blokken)
      if (b.type === 'kader' && !VARIANTEN.has(b.variant)) {
        console.log('FOUT', m.id, l.id, 'onbekende kadervariant', b.variant); fout++;
      }
console.log(fout ? 'NIET OK' : 'alles OK');
"
```

Lokaal draaien (ES-modules laden niet via `file://`):

```bash
python3 -m http.server 8000
```

## Git & deploy

- Direct committen en pushen naar `main`; geen branches of PR's.
- Git-author: `Thomas Aelbrecht <ict@hetleercollectief.be>`.
- De site staat live op <https://teamict-codex.github.io/ai-voor-leerkrachten/>
  via GitHub Pages, rechtstreeks vanaf de repo-root van `main`. Elke push is
  binnen de minuut online; er is geen build-stap. `.nojekyll` moet blijven
  staan, anders laat Jekyll bestanden met een underscore weg.

## Stand van zaken

- Zes workshops (A1-A3, B1-B3) van 3 uur, alle draaiboeken volledig.
- 12 modules, 28 lessen, 133 inhoudsblokken (tekst 31, kader 31, lijst 18,
  prompt 15, casus 14, quiz 11, opdracht 11, vergelijk 2).
- Pagina's: overzicht, module, draaiboek, deelnemersbundel, promptkaart,
  begeleidersgids. Zie README voor de routes.
- 14 casussen voor het groepswerk in A3, gespreid over mag / mag niet /
  hangt ervan af.
- Begeleidersgids met 22 lastige vragen, principieel en praktisch.
- Elke module heeft nu minstens één prompt, één opdracht en één quizvraag,
  behalve waar dat didactisch niet past. Controleer dat bij het toevoegen van
  een module — de deelnemersbundel trekt precies die blokken op.

### Verificatiestatus van de inhoud

Hou dit bij als je verder schrijft.

- **Nagekeken en gecorrigeerd:** alle inhoudsbestanden zijn intussen één keer
  volledig doorgelicht op juridische houdbaarheid, didactiek, Vlaamse
  terminologie en tool-neutraliteit — inclusief de veertien casussen, de
  begeleiders-FAQ (22 vragen) en de quizvraag van de module administratie.
  Verwijs naar een casus met haar **titel**, nooit met haar nummer: de volgorde
  is bij die ronde gewijzigd zodat elke reeks vroeg een "mag" toont.
- **Nog niet nagekeken:** wat je hierna zelf toevoegt. De app zelf (`app.js`,
  `style.css`) is nagelopen op toegankelijkheid, afdrukken en de drie
  schermcontexten; nieuw blok-type of nieuwe kadervariant vraagt die pas opnieuw.

Wat die nakijkronde opleverde is leerzaam voor wie hier verder schrijft: de
terugkerende fouten waren Nederlands-Nederlandse termen (docent, werkstuk,
cijfer voor punt), verouderde studierichtingen, secundair-terminologie in een
lager-onderwijscasus (klassenraad in plaats van MDO/zorgoverleg), en adviezen
die het sterkste tegenargument wegwuiven in plaats van beantwoorden.

**Gedeployed** sinds 4 september 2026 op GitHub Pages (zie "Git & deploy").
De deelnemersbundel drukt dat adres nu ook af, want `leeromgevingAdres()` in
`app.js` leest het af van de pagina zelf.

**Voorstellen die eerst een go vragen** (uit de nakijkronde van 3 september
2026; ze voegen inhoud toe en zijn daarom niet automatisch gebouwd):

- Een kader over de Europese AI-verordening in de module veilig-en-ethisch.
- Een FAQ-vraag "Hoe weet ik of een leerling zijn taak door AI liet
  schrijven?" bij de praktische vragen.
- Een kader "AI als hulpmiddel, niet als voorsprong" in de les over
  leerlingen die zelf AI gebruiken (dyslexie, anderstalige nieuwkomers).
- Een vijftiende casus: een brief aan ouders in de thuistaal (oordeel: mag).
- Drie startblokken in de les eerste-gesprek over account aanmaken en
  inloggen, voor wie nog nooit een assistent opende.
- Een opdracht "Reken je kosten uit en leg de afspraak vast" in de les
  modellen-en-kosten, zodat B3 meer dan één opdracht in de bundel heeft.
