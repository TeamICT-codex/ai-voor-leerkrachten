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
index.html          de voorpagina van de site: het 3D-poppenhuis (voorpagina/)
leeromgeving/       de leeromgeving zelf: index.html is de omhulling van de app
voorpagina/         stijl en scripts van de voorpagina (zie LEESMIJ daar)
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
js/beelden.js       de tekeningen in de kop van een module (één per module, anders die van het spoor)
css/style.css       alle styling, mobiel-eerst, afdrukblok onderaan
leerlingen/         de leerlingencursus AI-wijs op school: GEGENEREERD, niet met de hand bewerken
aiwijs-start/       AI-wijs Start, de klassikale cursus voor de 1ste graad: GEGENEREERD
leerlingen-bron/    bron van beide cursussen: Markdown-lessen, generator, docs (zie README daar);
                    AI-wijs Start staat in leerlingen-bron/start/
gedeeld/            wat alles deelt: Poppins (fonts/), het logo, en de 3D-motor
                    (diorama-kern.js bovenop een uitgedunde bundel van three.js)
lager/              Leerlichtjes, het aanbod voor het lager: één 3D-wereld per graad
                    (zie lager/LEESMIJ.md en lager/TESTLIJST.md)
lager/stem/         de voorleesstemmen van Leerlichtjes: elke tekst vooraf ingelezen
                    door een juf en een meester (Gemini), met het script om opnieuw
                    in te lezen en na te kijken (zie lager/stem/LEESMIJ.md)
teaser/             de promofilm van een halve minuut: opname.py neemt de filmmodus
                    van de voorpagina beeld per beeld op, muziek.py rekent het
                    deuntje uit (zie teaser/LEESMIJ.md)
```

**De sfeer op de voorpagina.** Dag en nacht volgen het uur in Dendermonde en
de seizoenen de datum (`voorpagina/sfeer.js`). Dat rekent de pagina zelf uit.
Alleen de zaalmodus haalt het weer op bij Open-Meteo, met enkel de coördinaten
van Dendermonde. Zo stuurt een gewone bezoeker niets naar een andere server.
Hou dat zo, en zet nooit een weerverzoek buiten de zaalmodus.

**Het voorlezen in Leerlichtjes** speelt vooraf ingelezen mp3's af
(`lager/stem.js`). Tijdens de les gaat er dus niets naar een AI-dienst. Verander
je een tekst die voorgelezen wordt, lees dan opnieuw in: `node
lager/stem/verzamel.mjs`, daarna `python lager/stem/gemini.py alles` (de
sleutel staat in `GEMINI_API_KEY`; toon of bewaar hem nooit). `naloop.mjs` gaat
na dat elk pad een opname heeft. Vergeet je het inlezen, dan leest de
browserstem die ene zin voor. De motor in
`gedeeld/diorama-kern.js` draagt ook de werelden van Leerlichtjes. Elke
uitbreiding daar staat standaard uit, en na een wijziging test je de drie
werelden mee.

De app draait in `leeromgeving/index.html`, maar haar code staat nog altijd in
`js/` en `css/` in de root. Een link in de inhoud naar iets buiten de app
(`leerlingen/`, `lager/`) schrijf je vanaf de root van de site: `naarSite()` in
`app.js` zet er `../` voor. Oude links naar `…/ai-voor-leerkrachten/#/…`, ook
gedeelde sessielinks, komen op de voorpagina binnen; een script bovenaan
`index.html` stuurt ze door naar `leeromgeving/#/…`. Haal dat script dus niet
weg.

**Navigatie tussen de delen.** De voorpagina heet "AI op school" en bundelt
alles: vier ingangen (directie, leerkracht, leerling, lager) en onderaan een rij
naar de leeromgeving, AI-wijs op school en Leerlichtjes. Elke pagina die voor
leerkrachten bedoeld is, heeft rechtsboven dezelfde weg terug: een knop met een
huisje en "AI op school" (de kop van de leeromgeving, de startpagina en de
handleiding van Leerlichtjes, en de pagina "Voor leerkrachten" van AI-wijs
Start). Pagina's voor leerlingen hebben die knop bewust niet: de lessen van
AI-wijs Start en AI-wijs op school en de drie werelden op het digibord blijven op
zich. De keten voor leerlingen is Leerlichtjes (lager), AI-wijs Start (1ste
graad) en AI-wijs op school (2de en 3de graad), en elk deel verwijst naar het
volgende. Het overzicht van de leeromgeving verwijst met snelkoppelingen naar
alle drie. Komt er een deel bij, geef het dan
dezelfde knop en een plaats op de voorpagina.

### Huisstijl

Alles volgt de huisstijl van Het leercollectief: Poppins, donkergroen #126425
met mint, perzik, geel en lichtblauw, ruime afgeronde hoeken en zachte
schaduwen. De leeromgeving (`css/style.css`), de leerlingencursus, de
startpagina en Leerlichtjes delen die lijn. Het lettertype en het logo komen uit
`gedeeld/`, dus die map moet mee online. De drie sporen hebben elk een tint uit
het palet: lichtblauw voor A, perzik voor B, groen voor C. Begeleidersmodus
blijft paars, zodat je altijd ziet dat je in die modus zit.

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

### AI-wijs Start (aiwijs-start/)

De klassikale instap voor de 1ste graad secundair, gebouwd met dezelfde
generator: `npm run check:start && npm run build:start` in `leerlingen-bron`.
De bron staat in `leerlingen-bron/start/` (eigen config, lessen,
`leerkrachten.md` voor de handleiding, en `docs/personages.md`), de uitvoer in
`aiwijs-start/`. Zes lessen in twee lesuren, een slotquiz en een paspoort om af
te drukken; een bordmodus met grote letters voor het digibord (knop bij elke les,
of `?bord` in het adres). Vaste afspraken, met Thomas beslist op 30 oktober 2026
en uitgeschreven in `leerlingen-bron/docs/start-lessenschets.md`: leerlingen
hebben geen account nodig en typen zelf niets in een chatbot; de stap "Probeer
het zelf" is voor wie 13 is, gebeurt alleen op school onder begeleiding, en noemt
geen merk ("de chatbot van je school"); de personages zijn fictief en zitten op
geen echte school. Een verandering aan de generator mag AI-wijs op school niet
veranderen: bouw die na afloop opnieuw en kijk na dat `leerlingen/` gelijk blijft.

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
// Zonder intro staat de les er zonder aanloop; zonder onthoud mist ze haar
// afsluiter en ontbreekt ze in de deelnemersbundel, bij Wat je onthoudt.
for (const m of modules)
  for (const l of m.lessen)
    for (const veld of ['intro', 'onthoud'])
      if (!l[veld]) { console.log('FOUT', m.id, l.id, 'geen', veld); fout++; }
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
python test/server.py
```

Gebruik die en niet `python -m http.server`: die laatste stuurt geen
Cache-Control mee, en dan toont de browser na een wijziging nog minutenlang de
oude inhoudsbestanden. `test/server.py` zegt bij elk bestand `no-store`.

Daarna: <http://localhost:8000/> voor de voorpagina en
<http://localhost:8000/leeromgeving/> voor de leeromgeving.

## Git & deploy

- Direct committen en pushen naar `main`; geen branches of PR's.
- Git-author: `Thomas Aelbrecht <ict@hetleercollectief.be>`.
- De site staat live op <https://teamict-codex.github.io/ai-voor-leerkrachten/>
  via GitHub Pages, rechtstreeks vanaf de repo-root van `main`. Daar staat de
  voorpagina; de leeromgeving staat op `…/ai-voor-leerkrachten/leeromgeving/`. Elke push is
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
- 18 modules, 54 lessen, 332 inhoudsblokken (tekst 97, kader 89, lijst 48,
  prompt 32, opdracht 26, casus 17, quiz 19, vergelijk 4).
- **Elke les draagt haar eigen `minuten`**; modules hebben geen `duur` meer.
  `moduleMinuten()` in cursus.js telt ze op, en de sessiebouwer rekent ermee.
  Voeg je een les toe, zet er dan minuten op — zonder dat telt ze voor nul.
- Spoor C telt vier modules. De vierde, **Zelf bouwen met schoolgegevens**
  (`beleid-zelfbouw`, oktober 2026), is voor directies die zelf tools bouwen met
  AI. Ze deelt wat je bouwt in drie zones in: dit kan, dit doe je samen met je
  scholengroep, dit hoort in de schoolsystemen. De toon is bewust die van de
  uitgestoken hand: het gebeurt al, en de scholengroep helpt het veiliger te
  maken en wat goed werkt naar meer scholen te brengen. Schrijf er in die toon
  verder, en algemeen over "je scholengroep", zonder naam of verzonnen
  procedure. Op de voorpagina hoort er het bolletje "zelfbouw" bij: een kastje
  met een scherm in de directiekamer.
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
- **Elke les heeft een `intro` en een `onthoud`** (velden, geen blokken: de
  bloktellingen hierboven veranderen er niet door). De intro staat bovenaan de
  les, de onthoud in haar voet en in de deelnemersbundel onder "Wat je
  onthoudt". Die onthoud wordt dus op papier gelezen zonder de les ernaast:
  een voorwaarde die de les stelt ("zonder naam", "als je de pagina liet
  aanpassen") moet er dan ook in staan. `test/zet-lesregels.py` zet ze vanuit
  JSON; de controle hierboven slaat alarm als er een ontbreekt.
- De modulepagina kreeg in oktober 2026 een make-over: een kop met een eigen
  tekening per module (`js/beelden.js`, getekende SVG, geen emoji meer) en een
  voortgangsring, een lesnavigatie die meeloopt, en per les een voet met de
  onthoud, het afvinken en een knop naar de volgende les. Het overzicht toont
  per spoor de voortgang en, voor een deelnemer, een kaart "Verder waar je was".
- 17 casussen: 15 voor het groepswerk in A3 — die module is tegelijk de
  zelfstudieroute — en twee in spoor C: één in de directiemodule en één in
  "Zelf bouwen met schoolgegevens". Gespreid over mag / mag niet / hangt ervan
  af.
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
- **Ook nagekeken, op 29 oktober 2026:** de intro en onthoud van alle vijftig
  lessen. Vier lezers, één per spoor (B in twee), legden elke regel naast haar
  eigen les; tien van de honderd regels zijn aangepast, telkens omdat een
  voorwaarde of nuance van de les wegviel zodra de zin los op papier stond.
  Dezelfde ronde ving drie dingen in de bestaande tekst: het voorbeeld "Lotte
  uit 4A" stond tegenover "een leerling van het tweede jaar" (nu: vierde), de
  vuistregel en de doelen van spoor B noemden een klasnummer of bijnaam
  "anoniem" terwijl de les zegt dat het dan nog leerlinggegevens zijn (nu:
  "zonder echte namen"), en het tipkader over de sessiebouwer in spoor C
  herhaalde de twee fouten die de gids al kwijt was.
- **Ook nagekeken, op 30 oktober 2026:** de module *Zelf bouwen met
  schoolgegevens* en de zinnen in spoor B en C die ze bijstuurde. Een juridische
  lezer en een lezer voor toon en samenhang; hun 17 bevindingen zijn verwerkt.
  Twee lessen voor wie verder schrijft: een onthoud verloor op papier opnieuw
  een voorwaarde (afsluiten en dezelfde dag melden), en "de rechten op software
  gaan automatisch naar de werkgever" is te sterk als de zin uit zijn context
  van een opdracht valt — het geldt voor software die je in je functie schrijft,
  tenzij anders afgesproken, en code die de AI zelf schreef heeft waarschijnlijk
  geen auteur.
- **Nagekeken, op 30 oktober 2026:** AI-wijs Start, de zes lessen, de slotquiz
  en de handleiding. Een lezer voor feiten, wet en veiligheid en een lezer voor
  doelgroep en didactiek; hun 27 bevindingen zijn verwerkt. Drie zaken om te
  onthouden: in de 1ste graad geldt sinds 1 september 2025 een smartphoneverbod
  de hele schooldag (dus geen eigen gsm in een les, tenzij de school een
  uitzondering maakt); bij het begin van het schooljaar is bijna niemand in het
  eerste jaar al 13, tegen het einde ongeveer de helft; en alleen Child Focus
  (116 000) is dag en nacht bereikbaar, Awel en 1712 op vaste uren.
- **Nagelezen door Thomas, op 30 oktober 2026:** les 5 van AI-wijs Start
  (deepnudes en sextortion) en het stuk erover in de handleiding. In orde
  bevonden, niets aan veranderd.
- **Open, voor Thomas:** de begeleidersgids laat bij één leerlingnaam in een
  workshopgesprek het gesprek verwijderen; spoor C zegt bij elk gesprek met
  leerlinggegevens in een tool zonder afspraken: dezelfde dag melden en niet
  wissen. Welke lijn geldt in de zaal, is een keuze, geen tikfout.
- **Open, voor Thomas:** een lezer vond in secundaire bronnen (advocatenkantoren,
  vakpers) dat de AI-omnibus vanaf 2 december 2026 ook nieuwe verboden invoert.
  De les over de AI-verordening noemt die niet. Niet nagegaan in het
  Publicatieblad, en dus niets aan veranderd.
- **Nog niet nagekeken:** wat je hierna zelf toevoegt. De app zelf (`app.js`,
  `style.css`) is nagelopen op toegankelijkheid, afdrukken en de drie
  schermcontexten; nieuw blok-type of nieuwe kadervariant vraagt die pas opnieuw.
  De make-over van de modulepagina en het overzicht (oktober 2026) is getest
  met de volledige suite in de vier schermmaten en met het oog bekeken, maar
  nog niet door een aparte toegankelijkheidsronde gehaald.

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

**AI-wijs Start, voor de 1ste graad secundair,** is gebouwd op 30 oktober 2026
(zie hierboven) en staat sinds die dag online. Les 5, over deepnudes en
sextortion, en het stuk erover in de handleiding heeft Thomas zelf nagelezen en
goedgekeurd.

**Geparkeerd tot na woensdag 28 oktober 2026.** Wat nog openstaat is de
nakijklijst van de leerlingencursus (`leerlingen-bron/docs/nakijklijst.md`):
de fictieve details bij echte scholen, de studierichtingen per school,
Smartschool als platform, de juiste logoversie en de definitieve cursusnaam.
Dat zijn stuk voor stuk beslissingen van Thomas of van de scholengroep, niet
iets om zelf in te vullen. Begin er pas aan vanaf donderdag 29 oktober 2026, en
dan nog alleen op zijn vraag.

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
