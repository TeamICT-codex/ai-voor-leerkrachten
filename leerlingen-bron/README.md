# AI-wijs op school

Een gratis, standalone AI-cursus voor de leerlingen van de 2de en 3de graad van de secundaire scholen van **GO! scholengroep Het leercollectief** (Dendermonde, Hamme, Lokeren, Moerbeke, Wetteren, Zele), in alle finaliteiten, en bruikbaar voor elke Vlaamse school. Negen hoofdstukken, 72 lessen, acht hoofdstukquizzen, een certificaat. Geen account, geen server, geen tracking: de site is statische HTML en bewaart de voortgang in de browser van de leerling.

De vormgeving volgt de huisstijl van Het leercollectief (Poppins, donkergroen, mintmarkering, ronde hoeken); de voorbeelden spelen in de eigen scholen met elf vaste fictieve leerlingen uit alle finaliteiten. Zie `docs/leercollectief.md`.

De opbouw is geïnspireerd op het concept van de Nederlandse cursus *AI voor leerlingen*; alle teksten, voorbeelden, prompts en quizvragen zijn opnieuw geschreven voor de Vlaamse context (finaliteiten, GIP, Smartschool, examens, Vlaamse onderwijsdoelen, het Europese kader voor AI-geletterdheid).

Dezelfde generator bouwt ook **AI-wijs Start**, de cursus voor de eerste graad: zie [AI-wijs Start](#ai-wijs-start-eerste-graad) onderaan.

## Snel starten

```bash
npm install
npm run check        # inhoud (format, quizzen, woordgebruik) én de personages
npm run build        # bouwt de site in de uitvoermap
npm run serve        # lokale server op http://localhost:4321/
npm run links        # kapotte interne links, na een build
```

Zonder parameter gaat alles over AI-wijs op school. Voor AI-wijs Start bestaat elk commando ook met `:start` erachter (`npm run check:start`, `npm run build:start`, ...).

De uitvoermap staat in `cursus.config.json` onder `uitvoermap` en wijst in deze repo naar `../leerlingen`, zodat de cursus meteen als subsite van de leeromgeving mee online gaat. **De build maakt die map eerst leeg en schrijft ze opnieuw**: bewerk er dus niets met de hand, en commit bron én uitvoer samen.

Die map kun je ook op elke andere statische host zetten: GitHub Pages, Netlify, Cloudflare Pages, een schoolserver of een map in SharePoint. De site werkt zelfs rechtstreeks vanaf een USB-stick (open `index.html`), alleen de voortgang per toestel kan dan door de browser beperkt worden.

## Mappen

| Map of bestand | Inhoud |
|---|---|
| `content/` | De lessen in Markdown, één map per hoofdstuk, plus `hoofdstuk.json` en `quiz.json`. |
| `docs/cursusplan.md` | Alle hoofdstukken en lessen met titels, bestandsnamen en Vlaamse aanpassingen. |
| `docs/schrijfwijzer.md` | Toon, woordenlijst Nederlands → Vlaams, Vlaamse context, pedagogische lijn. |
| `docs/contentformat.md` | Hoe een les en een quiz eruitzien (frontmatter, blokken, JSON). |
| `docs/bronanalyse.md` | Wat we uit de analyse van de oorspronkelijke site haalden. |
| `docs/leercollectief.md` | Scholen, studierichtingen, vaste personages en regionale voorbeelden van Het leercollectief. |
| `docs/nakijklijst.md` | Punten die de maker best zelf nakijkt vóór publicatie. |
| `build/build.mjs` | De generator: Markdown → statische HTML. |
| `build/check.mjs` | Controle van de inhoud: frontmatter, blokken, quizzen, Nederlands-Nederlandse woorden. |
| `build/personages.mjs` | Controle van de elf vaste personages tegen de tabel in `docs/leercollectief.md`: staat elk personage overal in hetzelfde jaar en op dezelfde school? |
| `build/links.mjs` | Controle van de interne links in de gebouwde site. |
| `build/serve.mjs` | Lokale server voor de uitvoermap. |
| `build/cursus.mjs` | Welke cursus (`--cursus start`) en waar haar bron en uitvoer staan. Alle scripts hierboven lezen dat hier. |
| `build/blokken.mjs` | Leest de oefenblokken `keuze` en `sorteer`, voor de generator én de controle. |
| `assets/` | Stylesheet, script, favicon. Worden naar de uitvoermap (`assets/`) gekopieerd. |
| `assets/extra.js`, `assets/extra.css` | Oefenblokken, bordmodus, paspoort en de knop "AI op school". Gaan alleen mee met een cursus die er iets van gebruikt (vandaag Start), zodat de uitvoer van AI-wijs ongewijzigd blijft. |
| `cursus.config.json` | Naam, ondertitel, organisatie en certificaatvereisten. |
| `start/` | De bron van AI-wijs Start: `cursus.config.json`, `content/`, `leerkrachten.md` en `docs/personages.md`. |

## Een les aanpassen of toevoegen

1. Open het bestand in `content/<hoofdstuk>/`. Elke les is Markdown met frontmatter (titel, intro, duur, doelen) en blokken zoals `::: prompt`, `::: opdracht`, `::: kernpunten`. Zie `docs/contentformat.md`.
2. Wil je een eigen video bij een les, zet dan `video: <YouTube-id>` in de frontmatter.
3. Draai `npm run check` en daarna `npm run build`. Verander je iets aan een personage — ander jaar, andere school, andere richting — pas dan eerst de tabel in `docs/leercollectief.md` aan; `npm run check` legt de lessen daar naast.

Een hoofdstuk weglaten: verwijder de map (of hernoem `hoofdstuk.json`). De nummering en navigatie volgen de mappen.

## Voortgang en certificaat

- Elke les heeft een knop *Markeer als voltooid*. Een quiz wordt afgevinkt vanaf het slaagpercentage (standaard 80 %).
- De voortgang staat in `localStorage` van de browser. Op het overzicht kan de leerling een voortgangscode exporteren en op een ander toestel importeren.
- Het certificaat (les 9.2) vraagt: hoofdstuk 1 en 2, minstens één routehoofdstuk (3 tot 8) en hoofdstuk 9. Dat staat in `cursus.config.json` onder `certificaatVereisten`. De leerling vult een naam in en drukt af (of bewaart als pdf).

## Naam en organisatie wijzigen

Pas `cursus.config.json` aan (naam, ondertitel, organisatie, URL) en bouw opnieuw.

## AI-wijs Start (eerste graad)

AI-wijs Start is de cursus voor de 1ste graad (12 tot 14 jaar), vooral klassikaal op het digibord. Het voorstel en de beslissingen staan in `docs/start-lessenschets.md`. Zelfde generator, zelfde huisstijl; de bron staat in `start/`, de uitvoer in `aiwijs-start/` in de root van de repo (live op `.../ai-voor-leerkrachten/aiwijs-start/`).

```bash
npm run check:start  # inhoud van start/content, leerkrachten.md en de personages van Start
npm run build:start  # bouwt ../aiwijs-start (maakt die map eerst leeg)
npm run serve:start  # lokale server op http://localhost:4322/
npm run links:start  # kapotte interne links, na een build
```

Lokaal bekijken kan ook vanuit de root van de repo met `python3 -m http.server 8000`: dan staat Start op <http://localhost:8000/aiwijs-start/>, en werken ook de links naar de voorpagina en naar AI-wijs op school. Commit bron (`start/`) en uitvoer (`aiwijs-start/`) samen, zoals bij AI-wijs.

### Wat Start anders doet

Alles staat in `start/cursus.config.json`. Een veld dat daar staat en niet in de config van AI-wijs, valt in de generator terug op de tekst of het gedrag van AI-wijs.

| Veld | Wat het doet |
|---|---|
| `uitvoermap` | `../../aiwijs-start`, tegenover `start/`. De build weigert een uitvoermap in of boven de bron, of in of boven de uitvoer van de andere cursus. |
| `opslagsleutel` | `aiwijs-start.v1`: de voortgang van Start staat apart van die van AI-wijs (`aiwijs.v1`), ook in dezelfde browser. De build zet de sleutel in de kopie van `app.js`. |
| `stappen: false` | Geen drie stappen en geen keuzeroute: de delen staan na elkaar, opengeklapt. |
| `benaming` | Hoe een hoofdstuk heet: "Deel 1" in plaats van "Hoofdstuk 1". |
| `lesnummering: "doorlopend"` | Les 1 tot 6 over de delen heen; de quiz en het paspoort krijgen geen nummer. |
| `domeinen: false` | Geen blok over de vier domeinen op het overzicht. |
| `kicker`, `heroTitel`, `psst`, `studietijd`, `inhoudSub`, `over`, `startCta`, `indexTitel` | De vaste teksten van het overzicht. `heroTitel`, `psst` en `over` zijn inline Markdown. |
| `voetHerkomst: ""` | Laat de zin over de Nederlandse inspiratiebron onderaan weg. |
| `voorbeeldVoet` | De zin onder elk `voorbeeld`-blok. Start: "Verzonnen voorbeeld." (`""` laat hem weg). |
| `leerkrachtenpagina` | `leerkrachten.md`: de leerkrachtenpagina komt uit dat bestand (zie hieronder). |
| `voorpaginaUrl` | `../`: de knop "AI op school" met het huisje, alleen op de leerkrachtenpagina. |
| `bordmodus: true` | De knop "Bordmodus" bij elke les (zie hieronder). |
| `personages` | `docs/personages.md`: het eigen contextblad voor `personages.mjs`. |
| `check.minWoorden` | 150: een klassikale les is korter, dus de waarschuwing "kort" komt pas onder 150 woorden. Ook `maxWoorden` (standaard 1300) en `quizVragen` (standaard 10) kunnen hier. |

### De leerkrachtenpagina

`start/leerkrachten.md` is gewone Markdown met dezelfde `:::`-blokken als een les. Frontmatter mag, hoeft niet: `title` (standaard "Voor leerkrachten") en `intro` (de lead onder de titel). Geen `#`-kop in de tekst: de pagina heeft al een titel. Zolang het bestand ontbreekt, toont de pagina een placeholder en waarschuwen build en controle.

### Bordmodus

Bij elke les staat een knop **Bordmodus**: grotere letters (ongeveer 1,25 keer), geen zijbalk, een bredere inhoud en grotere knoppen om op het digibord aan te tikken. Een tweede klik zet hem uit. Ook `?bord` achter het adres zet hem aan, bv. `.../aiwijs-start/h1-lesuur-1/waarom-zie-jij-dit-filmpje.html?bord`; `?bord=uit` zet hem af. De keuze wordt in deze browser onthouden voor alle pagina's van Start, tot je hem uitzet.

### Het paspoort

Een les met `type: paspoort` toont een afdrukbaar A4-blad met een stempel per gewone les (in Start: zes). Een stempel is gekleurd als die les in deze browser afgevinkt is, anders een lege cirkel om met de hand af te stempelen. De zin bij een stempel komt uit het frontmatterveld `paspoortzin` van die les; `check:start` waarschuwt als het ontbreekt. Bovenaan staat een lege lijn voor de naam: er is geen naamveld en er wordt geen naam bewaard.

```markdown
---
title: Waarom zie jij dit filmpje?
intro: ...
duur: 17
paspoortzin: Een app kiest wat ik zie. Ik kan zelf mee sturen.
doelen:
  - ...
---
```

### De slotquiz

Zelfde formaat als een hoofdstukquiz in AI-wijs (tien vragen, vier opties, feedback bij elke optie). `les` mag naar een les in een ander deel wijzen: geef gewoon de slug (`"les": "wat-vertel-je-een-chatbot"`), de build zet het pad ervoor zodat "bekijk de les" klopt.

### Beelden

Een map `start/media/` (als ze er is) gaat mee naar `aiwijs-start/media/`. Vanuit een les: `![wat je ziet](../media/foto.jpg)`.

## Twee oefenblokken: keuze en sorteer

Beschikbaar in beide cursussen. De weergave staat in `assets/extra.js` en `extra.css`; die gaan pas mee met AI-wijs als een les van AI-wijs zo'n blok gebruikt.

```markdown
::: keuze Jij bent het algoritme
vraag: Rayan keek drie voetbalfilmpjes helemaal uit. Welk filmpje toon je nu?
* Nog een voetbalfilmpje. | Helemaal uitkijken is een sterk signaal.
- Een kookfilmpje. | Dat swipete hij meteen weg.
vraag: Een tweede vraag in dezelfde reeks (mag, hoeft niet).
- ... | ...
:::
```

- `vraag:` begint een nieuwe vraag. `*` is een juist antwoord, `-` een ander; na de `|` staat de feedback. Inline Markdown mag overal.
- Na een klik verschijnt de feedback met "Juist." of "Niet de beste keuze." ervoor (niet als de feedback zelf al met "Juist" begint). Een ander antwoord kiezen mag altijd.
- Geen enkele `*` in een vraag: dan is er geen goed of fout en krijgt de feedback een neutrale stijl.

```markdown
::: sorteer Wat typ je in een chatbot?
bakken: Gerust | Pas het eerst aan | Niet in een chatbot
- Leg fotosynthese uit in eenvoudige woorden. | 1 | Hier staan geen gegevens over jou in.
- Mijn wachtwoord. | 3 | Een wachtwoord deel je met niemand.
:::
```

- Twee tot vier bakken. Het getal is het nummer van de juiste bak, vanaf 1.
- Zonder slepen: elk kaartje krijgt een knop per bak. Na een keuze zie je of het klopt en waarom; daarna komt het kaartje in de juiste bak onderaan. Op het einde een korte samenvatting en een knop "Opnieuw".
- `npm run check` (of `check:start`) meldt een vraag zonder antwoorden, een antwoord of kaartje zonder feedback en een bak die niet bestaat.

## Een kopie van een cursus testen

Elk script neemt ook `--bron <map>`: een map met een eigen `cursus.config.json` en `content/`, bv. een testkopie in een tijdelijke map. De uitvoermap staat dan in die config. De veiligheidscontrole blijft gelden.

## Licentie en herkomst

De teksten zijn eigen werk, geschreven voor het Vlaamse secundair onderwijs. Vermeld bij hergebruik de organisatie uit `cursus.config.json`. Controleer vóór publicatie de feiten die per les gemarkeerd staan in de schrijversrapporten (toolnamen, menu's en beschikbaarheid veranderen snel).
