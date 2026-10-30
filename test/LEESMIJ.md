# Testgereedschap

Geen testframework, geen afhankelijkheden: een hoop testgevallen in JSON plus
twee loperts die ze uitvoeren. Gemaakt in september 2026, bijgewerkt bij elke
inhoudsronde sindsdien.

`tests.json` bevat **161 testgevallen** over dertien gebieden: routing, opslag en
voortgang, sessietimer, de inhoudsblokken, deelnemersbundel, afdrukken,
responsief gedrag, toegankelijkheid, data-integriteit, consistentie tussen code
en documentatie, de sessiebouwer, en twee reeksen over het samenspel en over de
weg die een deelnemer en een begeleider afleggen.

Elk testgeval heeft een `soort`:

- **node** (49) — draait zonder browser: datastructuren, tellingen, HTML-balans,
  terminologie, documentatie tegenover de werkelijkheid, en de zeven tests over
  de sessiebouwer (T155-T161): sleutels, sjablonen, de rondrit van een link, de
  generieke blokken, kapotte en kwaadaardige links, en de bundel die zich
  dichtknijpt tot de behandelde lessen.
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
python test/server.py
```

Open daarna <http://localhost:8000/leeromgeving/> (de leeromgeving, niet de
voorpagina) en tik in de console van die pagina:

```js
const m = await import('/_testharnas.js');
const r = await m.run({ viewport: 'laptop' });   // of 'gsm', 'beamer', 'smal'
console.log(r.geslaagd, 'van', r.gedraaid, '| gezakt:', r.mislukt);
```

`run()` neemt ook `{ alleen: ['T003', 'T010'] }` om een handvol tests apart te
draaien. **`_testharnas.js` hoort niet in een commit** — het staat in
`.gitignore` noch in de repo; verwijder het als je klaar bent.

## Drie dingen om te weten

**Het harnas plant met een MessageChannel, niet met `setTimeout`.** In een
verborgen tabblad knijpt de browser timers af tot ongeveer één per seconde, en
dan duurt één navigatie seconden in plaats van milliseconden. Dat kostte een
halve testronde voor het gevonden was.

**Sommige tests besmetten elkaar.** Een test die `navigator.clipboard` of
`console.warn` vervangt en dat niet terugzet, laat de tests erna om de verkeerde
reden zakken. T064 was zo'n test — die zette het klembord enkel terug als hij
helemaal uitliep — en staat sinds 27 oktober 2026 in een `try/finally`. Vervang
je zelf iets globaals, doe dat dan ook; T050, T051, T052 en T153 tonen hoe.

Een derde, kleiner: **de pagina scrolt vloeiend** (`scroll-behavior: smooth` op
`html`). Een test die `window.scrollTo(0, 300)` doet en daarna meet, meet een
animatie die nog loopt. T031 zakte daar af en toe op en scrolt sinds 30 oktober
2026 met `{ top: 300, behavior: 'instant' }`; doe dat ook in een nieuwe test.

Wat daarna overblijft, is een traagheid die zich opstapelt: draai je meerdere
reeksen na elkaar in dezelfde pagina, dan beginnen de laatste tests te zakken op
navigaties die niet meer op tijd klaar zijn. **Herlaad de pagina tussen twee
reeksen** en draai lange reeksen in stukken van een twintigtal. Zo gemeten op
27 oktober 2026: 88 laptoptests, 19 op gsm, 12 op beamer en 10 op smal, alle
groen. Zakt er iets: draai het eerst opnieuw met `{ alleen: [...] }` na een
herlaad, vóór je in de app gaat zoeken.

Het harnas breekt een test af zodra zijn tijd om is en controleert na elke test
of de inhoud nog gaaf is, zodat een test die de data sloopt zichzelf aanwijst in
plaats van zijn slachtoffers. Die controle ijkt zich op wat ze bij de eerste
meting ziet, dus ze blijft kloppen als er een module bij komt.

## De andere scripts

`zet-minuten.mjs` is **al uitgevoerd** en staat hier enkel als geschiedenis: het
verhuisde in oktober 2026 de duurtijd van de module naar de les. Opnieuw draaien
zet er een tweede keer velden bij; de tabel erin is wel bruikbaar als naslag.

`bouw-beleid.py` en `voeg-lessen-toe.py` schrijven inhoud uit JSON naar de
inhoudsbestanden — handig wanneer een schrijfronde haar resultaat als data
oplevert in plaats van als tekst. `bouw-beleid.py` schrijft een volledig
`js/inhoud-beleid.js`, `voeg-lessen-toe.py` voegt losse lessen in bestaande
modules in. Beide nemen het JSON-bestand en de repo-root als argument.

`zet-lesregels.py` zet de velden `intro` en `onthoud` bij bestaande lessen,
vanuit één of meer JSON-bestanden van de vorm
`{"moduleId/lesId": {"intro": "...", "onthoud": "..."}}`. Het draait vanuit de
repo-root (`python test/zet-lesregels.py regels.json`), zoekt de les zelf op in
de vier inhoudsbestanden, en volgt de aanhalingstekens van elk bestand. Het mag
gerust twee keer draaien: bestaande velden worden vervangen, niet verdubbeld.
Zo kwamen in oktober 2026 de afsluiters van alle vijftig lessen erin.
