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
js/inhoud-vibe.js   spoor B — inhoud
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

Draaiboektiming en moduleverwijzingen nakijken:

```bash
node --input-type=module -e "
import { WORKSHOPS } from './js/workshops.js';
import { MODULES_AI } from './js/inhoud.js';
import { MODULES_VIBE } from './js/inhoud-vibe.js';
const ids = new Set([...MODULES_AI, ...MODULES_VIBE].map(m => m.id));
let fout = 0;
for (const w of WORKSHOPS) {
  const som = w.draaiboek.reduce((s,b) => s + b.minuten, 0);
  if (som !== 180) { console.log('FOUT', w.code, som, 'min'); fout++; }
  for (const b of w.draaiboek)
    if (b.module && !ids.has(b.module)) { console.log('FOUT', w.code, 'onbekende module', b.module); fout++; }
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
- Statische site zonder build-stap: deploybaar via Vercel, Netlify of GitHub
  Pages, rechtstreeks vanaf de repo-root.

## Stand van zaken

- Zes workshops (A1-A3, B1-B3) van 3 uur, alle draaiboeken volledig.
- 11 modules, 26 lessen. Deelnemersinhoud en begeleiderslaag werken.
- **Nog te doen:** de tien casussen voor A3 zijn nog niet uitgeschreven (staan
  nu enkel als opdracht in het draaiboek), en een afdrukbare deelnemersbundel
  ontbreekt.
