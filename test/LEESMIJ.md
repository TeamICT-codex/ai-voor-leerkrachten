# Testgereedschap

Geen testframework, geen afhankelijkheden: een hoop testgevallen in JSON plus
twee loperts die ze uitvoeren. Gemaakt in september 2026, bijgewerkt bij elke
inhoudsronde sindsdien.

`tests.json` bevat **154 testgevallen** over twaalf gebieden: routing, opslag en
voortgang, sessietimer, de inhoudsblokken, deelnemersbundel, afdrukken,
responsief gedrag, toegankelijkheid, data-integriteit, consistentie tussen code
en documentatie, en twee reeksen over het samenspel en over de weg die een
deelnemer en een begeleider afleggen.

Elk testgeval heeft een `soort`:

- **node** (42) — draait zonder browser: datastructuren, tellingen, HTML-balans,
  terminologie, documentatie tegenover de werkelijkheid.
- **browser** (112) — draait in de pagina, met route en begeleidersmodus vooraf
  goed gezet. Tien daarvan vragen een herlaad en draai je met de hand.

## Draaien

De nodetests, vanuit de repo-root:

```bash
python test/draai-nodetests.py test/tests.json .
```

De browsertests gaan via een harnas dat je eerst bouwt. Start de server, bouw
het harnas, en laad het in de pagina:

```bash
python test/bouw-harnas.py test/tests.json .
python3 -m http.server 8000
```

Daarna in de console van de pagina:

```js
const m = await import('/_testharnas.js');
const r = await m.run({ viewport: 'laptop' });   // of 'gsm', 'beamer', 'smal'
console.log(r.geslaagd, 'van', r.gedraaid, '| gezakt:', r.mislukt);
```

`run()` neemt ook `{ alleen: ['T003', 'T010'] }` om een handvol tests apart te
draaien. **`_testharnas.js` hoort niet in een commit** — het staat in
`.gitignore` noch in de repo; verwijder het als je klaar bent.

## Twee dingen om te weten

**Het harnas plant met een MessageChannel, niet met `setTimeout`.** In een
verborgen tabblad knijpt de browser timers af tot ongeveer één per seconde, en
dan duurt één navigatie seconden in plaats van milliseconden. Dat kostte een
halve testronde voor het gevonden was.

**Sommige tests besmetten elkaar.** Een test die `navigator.clipboard` of
`console.warn` vervangt en dat niet terugzet, laat de tests erna om de verkeerde
reden zakken. Een veertiental tests zakt daardoor in één lange reeks, maar
slaagt wanneer je ze apart of als groep draait. Zakt er iets: draai het eerst
opnieuw met `{ alleen: [...] }` vóór je in de app gaat zoeken. Het harnas breekt
een test af zodra zijn tijd om is en controleert na elke test of de inhoud nog
gaaf is, zodat een test die de data sloopt zichzelf aanwijst in plaats van zijn
slachtoffers.

## De andere scripts

`bouw-beleid.py` en `voeg-lessen-toe.py` schrijven inhoud uit JSON naar de
inhoudsbestanden — handig wanneer een schrijfronde haar resultaat als data
oplevert in plaats van als tekst. `bouw-beleid.py` schrijft een volledig
`js/inhoud-beleid.js`, `voeg-lessen-toe.py` voegt losse lessen in bestaande
modules in. Beide nemen het JSON-bestand en de repo-root als argument.
