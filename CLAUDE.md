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
js/inhoud-beleid.js spoor C — het kader: wet, privacy en schoolbeleid
js/inhoud.js        spoor A — inhoud
js/casussen.js      spoor A — casussenmodule (groepswerk A3)
                    (inhoud.js bevat ook de module "De leerlingencursus in je klas")
js/inhoud-vibe.js   spoor B — inhoud (incl. de verdiepingslessen)
js/gids.js          begeleidersgids + de 23 lastige vragen
js/workshops.js     draaiboeken + sporen
js/sessies.js       bouwstenen voor een zelf samengestelde sessie + sjablonen
js/cursus.js        voegt sporen samen, kloktijden, sessies lezen en schrijven
js/app.js           router, weergave, sessietimer, voortgang
css/style.css       alle styling, mobiel-eerst, afdrukblok onderaan
leerlingen/         de leerlingencursus AI-wijs op school: GEGENEREERD, niet met de hand bewerken
leerlingen-bron/    bron van die cursus: Markdown-lessen, generator, docs (zie README daar)
```

### De leerlingencursus (leerlingen/)

"AI-wijs op school" is een aparte, statische cursus voor leerlingen van de 2de
en 3de graad, in de huisstijl van Het leercollectief. Ze leeft in de repo als
subsite en staat live op `.../ai-voor-leerkrachten/leerlingen/`. De bron staat
in `leerlingen-bron/` (Markdown met `:::`-blokken, een eigen generator en een
eigen testscript). Werkwijze bij een inhoudelijke wijziging:

```bash
cd leerlingen-bron && npm install && npm run check && npm run build
```

De build maakt `leerlingen/` leeg en schrijft ze opnieuw; commit bron én
uitvoer samen. De schrijfregels voor die cursus staan in
`leerlingen-bron/docs/schrijfwijzer.md`; de scholen, personages en regionale
voorbeelden in `leerlingen-bron/docs/leercollectief.md`. De module
"De leerlingencursus in je klas" in `js/inhoud.js` is de handleiding voor de
leerkracht en verwijst naar lesnummers (bv. les 4.11): hernummer je lessen in de
leerlingencursus, kijk die verwijzingen dan na.

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

## Testsuite

`test/` bevat 161 testgevallen (49 zonder browser, 112 in de pagina) plus de
scripts die ze draaien, en de twee hulpscripts die inhoud uit JSON naar de
inhoudsbestanden schrijven. Zie `test/LEESMIJ.md` — daar staat ook waarom het
harnas met een MessageChannel plant en waarom een lange reeks tests elkaar kan
besmetten. Draai minstens de nodetests vóór een commit:

```bash
python test/draai-nodetests.py test/tests.json .
```

Raak je de inhoud aan, dan verschuiven de tellingen: T115, T118 en T127 dragen
de aantallen hard in zich en moeten dan mee. Raak je een blok-id in
`workshops.js` aan, dan breekt elke gedeelde sessielink die ernaar wijst; T155
en T156 vangen af wat er binnen de repo stukgaat, maar een link in iemands
mailbox repareren ze niet.

## Controles vóór een commit

Draaiboektiming, moduleverwijzingen, lesminuten, kadervarianten en de
sjablonen van de sessiebouwer nakijken:

```bash
node --input-type=module -e "
import { WORKSHOPS, MODULES, SJABLONEN, sessieUitCode, sessieMinuten } from './js/cursus.js';
const modules = MODULES;
const ids = new Set(modules.map(m => m.id));
let fout = 0;
for (const w of WORKSHOPS) {
  const som = w.draaiboek.reduce((s,b) => s + b.minuten, 0);
  if (som !== 180) { console.log('FOUT', w.code, som, 'min'); fout++; }
  const blokIds = new Set();
  for (const b of w.draaiboek) {
    // De blok-id is de sleutel waarmee een sessielink naar dit blok wijst.
    if (!b.id || blokIds.has(b.id)) { console.log('FOUT', w.code, 'blok zonder of met dubbele id', b.titel); fout++; }
    blokIds.add(b.id);
    if (b.module && !ids.has(b.module)) { console.log('FOUT', w.code, 'onbekende module', b.module); fout++; }
    for (const lesId of b.lessen || [])
      if (!modules.find(m => m.id === b.module)?.lessen.some(l => l.id === lesId)) {
        console.log('FOUT', w.code, b.id, 'onbekende les', lesId); fout++;
      }
  }
}
// Een les zonder minuten telt voor nul in moduleMinuten() en in de sessiebouwer.
for (const m of modules)
  for (const l of m.lessen)
    if (!(l.minuten > 0)) { console.log('FOUT', m.id, l.id, 'geen minuten'); fout++; }
// Een sjabloon is enkel tekst met sleutels erin: hernoem je een blok-id, dan
// valt het stil zonder dat het scherm iets meldt.
for (const s of SJABLONEN) {
  const sessie = sessieUitCode({ d: s.d, t: String(s.minuten) });
  if (sessie.onbekend.length) { console.log('FOUT sjabloon', s.id, 'kent niet:', sessie.onbekend.join(', ')); fout++; }
  if (sessieMinuten(sessie) !== s.minuten) {
    console.log('FOUT sjabloon', s.id, sessieMinuten(sessie), 'min in plaats van', s.minuten); fout++;
  }
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

### In een ander account verder werken

De repo is publiek, dus lezen en klonen vraagt van niemand toegang.

- **Ander Claude-account, zelfde GitHub-account.** Koppel GitHub in dat account
  via <https://claude.ai/connect-github> en installeer daar de Claude GitHub App
  op `TeamICT-codex`. Start daarna een **nieuwe sessie met deze repo al
  geselecteerd**: een sessie kiest haar repositories bij het starten, je hangt ze
  er achteraf niet zomaar aan.
- **Ander GitHub-account dat moet kunnen pushen.** Kies er één: de persoon als
  collaborator toevoegen (één repo, gedeelde geschiedenis — het beste als jullie
  samen verder werken), de repo forken (eigen kopie, terugkoppelen via pull
  requests), of de repo overdragen.

**De regel die daarachter zit: alles wat een volgende sessie nodig heeft, hoort
in de repo.** De container en de scratchpad worden gewist, en een conversatie of
wat een account onthield reist niet mee. In september ging zo de tooling verloren
die `casussen.js` en de FAQ genereerde uit een nagekeken JSON — het resultaat
staat veilig in de inhoudsbestanden, maar het proces was niet meer te herhalen.
Schrijf je opnieuw zulke hulpscripts, commit ze dan meteen.

## Stand van zaken

- Zes workshops (A1-A3, B1-B3) van 3 uur, alle draaiboeken volledig.
- Drie sporen: **C Het kader** (wet en schoolbeleid, staat vooraan en is het
  beginpunt), **A AI in de klas** en **B Vibe coden**.
- 17 modules, 50 lessen, 312 inhoudsblokken (tekst 90, kader 84, lijst 44,
  prompt 31, opdracht 25, casus 16, quiz 18, vergelijk 4).
- **Elke les draagt haar eigen `minuten`**; modules hebben geen `duur` meer.
  `moduleMinuten()` in cursus.js telt ze op, en de sessiebouwer rekent ermee.
  Voeg je een les toe, zet er dan minuten op — zonder dat telt ze voor nul.
- Spoor C hangt aan geen enkel draaiboek: het is
  leesstof voor leerkrachten én directies. De minuten van die lessen zijn dus
  leestijd, niet workshoptijd — reken ongeveer honderd woorden per minuut.
- Een spoor zonder draaiboek toont zijn modules rechtstreeks in plaats van in
  een uitklapper; `toonSpoor()` in app.js regelt dat.
- Tien daarvan zijn **verdiepingslessen** (`verdieping: true` op de les): stof
  die niet in de drie uur past en die je na de sessie zelfstandig doorneemt.
  Ze staan wél op de promptkaart en in de leeromgeving, maar niet in de
  deelnemersbundel — die is de hand-out van één sessie. `blokkenVanType` neemt
  daarvoor de optie `{ zonderVerdieping: true }`. Module `vibe-voorbeeld` bestaat
  volledig uit verdieping en hangt daarom aan geen enkel draaiboek.
- Pagina's: overzicht, module, draaiboek, deelnemersbundel, promptkaart,
  begeleidersgids en de sessiebouwer. Zie README voor de routes.
- 16 casussen: 15 voor het groepswerk in A3 — die module is tegelijk de
  zelfstudieroute — en één in de directiemodule van spoor C. Gespreid over
  mag / mag niet / hangt ervan af.
- Begeleidersgids met 23 lastige vragen en zes secties, principieel en
  praktisch. De sectie "Een kortere sessie geven" hoort bij de sessiebouwer.
- Elke module heeft nu minstens één prompt, één opdracht en één quizvraag,
  behalve waar dat didactisch niet past. Controleer dat bij het toevoegen van
  een module — de deelnemersbundel trekt precies die blokken op. De
  casussenmodule is de uitzondering: geen prompt, wel één slotopdracht.

### De sessiebouwer

Wie geen drie uur heeft, stelt op `#/sessie` zelf een sessie samen uit losse
onderdelen. Alles wat je daar nodig hebt staat in twee bestanden:

- `js/sessies.js` — `GENERIEKE_BLOKKEN` (onthaal, pauze, eigen inbreng, vragen,
  afronding) en `SJABLONEN`: vijf kant-en-klare sessies van 50 tot 120 minuten.
  Een sjabloon is enkel een naam, een doelduur en een `d`-parameter.
- `js/cursus.js` — het rekenwerk: `sessieUitCode` / `sessieNaarCode` lezen en
  schrijven de link, `bouwSessieWorkshop` maakt er een object van dat eruitziet
  als een workshop, zodat `toonWorkshop()` en `toonBundel()` ongewijzigd werken.

**De sessie leeft volledig in de URL**, er is geen opslag:
`#/sessie?n=<naam>&s=<startuur>&t=<doelduur>&d=<onderdelen>`. In `d` staan de
onderdelen in de volgorde van de sessie: `a1.vier-knoppen` (een draaiboekblok),
`m.beleid-kader` (een hele module), `pauze` (een generiek blok), met `*20` voor
een eigen duur en `~titel` voor een eigen titel. Wat niet meer bestaat, komt
als `onbekend` terug en wordt netjes gemeld in plaats van de pagina te breken.

Twee dingen om niet te breken: elk draaiboekblok heeft een `id` (dat is de
sleutel in de link — hernoem er geen zonder reden) en de blokken die maar een
deel van hun module behandelen hebben een `lessen`-lijst. Daarop knijpt de
bundel zich dicht via `lessenPerModule`; zonder die lijst krijgt een sessie van
een uur de volledige modulebundel mee.

### Verificatiestatus van de inhoud

Hou dit bij als je verder schrijft.

- **Nagekeken en gecorrigeerd:** alle inhoudsbestanden zijn intussen één keer
  volledig doorgelicht op juridische houdbaarheid, didactiek, Vlaamse
  terminologie en tool-neutraliteit — inclusief de eerste veertien casussen, de
  begeleiders-FAQ (toen 22 vragen) en de quizvraag van de module administratie.
  Verwijs naar een casus met haar **titel**, nooit met haar nummer: de volgorde
  is bij die ronde gewijzigd zodat elke reeks vroeg een "mag" toont.
- **Ook nagekeken, op 27 oktober 2026:** alles wat sinds die eerste ronde is
  bijgeschreven — spoor C, de verdiepingslessen van spoor B, de vijftiende casus
  met haar slotopdracht, de FAQ-vraag over AI-detectie, de gidssectie "Een
  kortere sessie geven", de zelfstudieblokken en de module over de
  leerlingencursus. Twaalf lezers met elk een eigen bril, elke bevinding door
  twee tegensprekers die haar probeerden te weerleggen; 31 van de 60 bevindingen
  hielden stand en zijn verwerkt.
- **Nog niet nagekeken:** wat je hierna zelf toevoegt. De app zelf (`app.js`,
  `style.css`) is nagelopen op toegankelijkheid, afdrukken en de drie
  schermcontexten; nieuw blok-type of nieuwe kadervariant vraagt die pas opnieuw.

Wat de eerste nakijkronde opleverde is leerzaam voor wie hier verder schrijft:
de terugkerende fouten waren Nederlands-Nederlandse termen (docent, werkstuk,
cijfer voor punt), verouderde studierichtingen, secundair-terminologie in een
lager-onderwijscasus (klassenraad in plaats van MDO/zorgoverleg), en adviezen
die het sterkste tegenargument wegwuiven in plaats van beantwoorden.

De tweede ronde legde een ander patroon bloot: **de tekst beweerde dingen over
de app en over de wet die net niet klopten.** De gids schreef dat je
begeleidersmodus nodig hebt voor de sessiebouwer (niet waar), dat een sessie weg
is als je het tabblad sluit (de app onthoudt de laatste), dat spoor C de
auteursrechten van lesmateriaal bij de school legt (de maker is de auteur tenzij
het uitdrukkelijk is overgedragen — behalve voor software, die gaat wél
automatisch naar de werkgever), en dat ouders tot achttien beslissen over
gezondheidsgegevens van een leerling (vanaf twaalf wordt een leerling bij het
CLB in principe bekwaam geacht). Schrijf je iets over wat de app doet of over
wat de wet zegt: ga het na in `app.js` of bij de bron, ook — vooral — als je het
zelf een hoofdstuk eerder hebt geschreven.

**Gedeployed** sinds 4 september 2026 op GitHub Pages (zie "Git & deploy").
De deelnemersbundel drukt dat adres nu ook af, want `leeromgevingAdres()` in
`app.js` leest het af van de pagina zelf.

De zes voorstellen uit de nakijkronde van 3 september 2026 zijn intussen
allemaal gebouwd: de startblokken over aanmelden, de kostenopdracht in B3, het
kader "AI als hulpmiddel, niet als voorsprong", de vijftiende casus (de brief
naar huis in de thuistaal), de FAQ-vraag over AI-detectie, en het stuk over de
Europese AI-verordening — dat laatste niet als kader in veilig-en-ethisch maar
als volwaardige les in spoor C, omdat het daar bij de rest van de wetgeving
hoort. Er staat dus niets meer in de wacht.
