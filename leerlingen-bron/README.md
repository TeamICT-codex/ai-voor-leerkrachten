# AI-wijs op school

Een gratis, standalone AI-cursus voor de leerlingen van de 2de en 3de graad van de secundaire scholen van **GO! scholengroep Het leercollectief** (Dendermonde, Hamme, Lokeren, Moerbeke, Wetteren, Zele), in alle finaliteiten, en bruikbaar voor elke Vlaamse school. Negen hoofdstukken, 72 lessen, acht hoofdstukquizzen, een certificaat. Geen account, geen server, geen tracking: de site is statische HTML en bewaart de voortgang in de browser van de leerling.

De vormgeving volgt de huisstijl van Het leercollectief (Poppins, donkergroen, mintmarkering, ronde hoeken); de voorbeelden spelen in de eigen scholen met elf vaste fictieve leerlingen uit alle finaliteiten. Zie `docs/leercollectief.md`.

De opbouw is geïnspireerd op het concept van de Nederlandse cursus *AI voor leerlingen*; alle teksten, voorbeelden, prompts en quizvragen zijn opnieuw geschreven voor de Vlaamse context (finaliteiten, GIP, Smartschool, examens, Vlaamse onderwijsdoelen, het Europese kader voor AI-geletterdheid).

## Snel starten

```bash
npm install
npm run build        # bouwt de site in dist/
npm run serve        # lokale server op http://localhost:4321/
npm run check        # controleert de inhoud (format, quizzen, woordgebruik)
```

De map `dist/` kun je op elke statische host zetten: GitHub Pages, Netlify, Cloudflare Pages, een schoolserver of een map in SharePoint. De site werkt ook rechtstreeks vanaf een USB-stick (open `dist/index.html`), alleen de voortgang per toestel kan dan door de browser beperkt worden.

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
| `build/check.mjs` | Controle van de inhoud. |
| `build/serve.mjs` | Lokale server voor `dist/`. |
| `assets/` | Stylesheet, script, favicon. Worden naar `dist/assets/` gekopieerd. |
| `cursus.config.json` | Naam, ondertitel, organisatie en certificaatvereisten. |

## Een les aanpassen of toevoegen

1. Open het bestand in `content/<hoofdstuk>/`. Elke les is Markdown met frontmatter (titel, intro, duur, doelen) en blokken zoals `::: prompt`, `::: opdracht`, `::: kernpunten`. Zie `docs/contentformat.md`.
2. Wil je een eigen video bij een les, zet dan `video: <YouTube-id>` in de frontmatter.
3. Draai `npm run check` en daarna `npm run build`.

Een hoofdstuk weglaten: verwijder de map (of hernoem `hoofdstuk.json`). De nummering en navigatie volgen de mappen.

## Voortgang en certificaat

- Elke les heeft een knop *Markeer als voltooid*. Een quiz wordt afgevinkt vanaf het slaagpercentage (standaard 80 %).
- De voortgang staat in `localStorage` van de browser. Op het overzicht kan de leerling een voortgangscode exporteren en op een ander toestel importeren.
- Het certificaat (les 9.2) vraagt: hoofdstuk 1 en 2, minstens één routehoofdstuk (3 tot 8) en hoofdstuk 9. Dat staat in `cursus.config.json` onder `certificaatVereisten`. De leerling vult een naam in en drukt af (of bewaart als pdf).

## Naam en organisatie wijzigen

Pas `cursus.config.json` aan (naam, ondertitel, organisatie, URL) en bouw opnieuw.

## Licentie en herkomst

De teksten zijn eigen werk, geschreven voor het Vlaamse secundair onderwijs. Vermeld bij hergebruik de organisatie uit `cursus.config.json`. Controleer vóór publicatie de feiten die per les gemarkeerd staan in de schrijversrapporten (toolnamen, menu's en beschikbaarheid veranderen snel).
