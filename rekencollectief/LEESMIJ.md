# Het Rekencollectief: de rekentoren

Een kleine pagina die Het Rekencollectief voorstelt aan leerkrachten en directies
die de app nog niet kennen: een interactieve trailer. Het beeld is een
tovenaarstoren in doorsnede op een groene heuvel, gebouwd met dezelfde motor als
de school op de voorpagina en de raket van Team ICT (`gedeeld/diorama-kern.js`).
Scrol je door de tekst, dan klimt de camera mee, van de poort naar de
sterrenwacht. Het ontwerp, met alle teksten, staat in `ONTWERP.md`: dat is de
bron van waarheid.

| Hoofdstuk | Kamer | Wat je ziet | Het moment |
| --- | --- | --- | --- |
| Binnen met een code | `hal` | het bord met de code, het rek met naamkaartjes, de deur | de zes cijfers verschijnen één voor één, de deur gaat open, een kind stapt binnen en gaat bij de naamkaartjes staan |
| Oefenen zonder druk | `oefen` | twee kinderen aan een tafel met een laptop, het scherm, de tovenaar, de Splits-Fabriek en de Flits-Grot | `7 × 8 =` verschijnt, `56` typt zich met een vinkje, het gele lichtje vliegt van de staf naar het scherm en er stijgen sterretjes op |
| De periodetoetsen | `meet` | de zandloper, het bord met de periodes, het plantje, een juf | de zandloper kantelt en loopt leeg, de periodes A* tot E lichten één voor één op |
| Zien waar iedereen staat | `kleur` | de tabel, de tafel met het schildpadje, de volgkaart, een meester met een laptop | de tabel vult zich vakje per vakje; bij Daan staat een schildpadje in een oranje vak. Het schildpadje op tafel wandelt altijd |
| Van meten naar doen | `ster` | de glazen bol, de ronde tafel met pionnen, de telescoop door het dak | de pionnen schuiven uit elkaar in drie groepjes, de bol licht op, in het dak verschijnen sterren |

Een moment speelt als de camera in de kamer aankomt of als je een bolletje opent,
en niet opnieuw zolang het nog loopt. Daarna blijft de kamer in haar eindstand.

**Speel het verhaal af** (op het podium, onder de kop en onderaan de pagina): de
camera klimt in een halve minuut van de poort naar de sterrenwacht, elke kamer
speelt haar moment met één regel tekst in het bord, en op het einde springt er
een boeket sterren uit de dakpunt. Daarna staan in het bord "Zin om het te
proberen?" en de knoppen naar de app en de handleiding. Terwijl het verhaal
speelt, verzet scrollen de camera niet en zijn de labels en spelden weg. Escape of
het kruisje stopt het, en de focus gaat terug naar de knop die het startte.

Verder: slepen draait de toren, de avondknop zet de lampen aan (wandlampjes,
gloeiende ramen, een kristal op de dakpunt dat gloeit), en het licht volgt het
uur in Dendermonde zoals op de voorpagina (`voorpagina/sfeer.js`).

## Bekijken

Vanuit de root: `python test/server.py`, daarna
<http://localhost:8000/rekencollectief/>. (In de werkmap van deze branch serveert
de preview `rekentoren` op poort 8020.)

| Parameter | Wat het doet |
|---|---|
| `?stil` | doet alsof je toestel om minder beweging vraagt: elke kamer staat meteen in haar eindstand, er speelt niets, en "Speel het verhaal af" toont de zes regels als gewone lijst |
| `?schets` | doet alsof je toestel geen 3D kan: je ziet de vlakke schets (een SVG van dezelfde toren), en de verhaalknop toont de samenvatting |
| `?zwak` | gedraagt zich zoals op een traag toestel: minder pixels, kleinere schaduwen, geen lampen ('s avonds kleuren de muren zelf) |
| `?debug` | zet `window.dio` klaar, met `dio._test.spoel(sec)` en `dio._test.meet()` |

## Bestanden

- `index.html`: de tekst, het podium, de schets en het verhaalbord. De tekst staat
  er ook zonder 3D. De knoppen naar de app krijgen hun adres van `pagina.js`
  (`data-app`).
- `toren.css`: een ingekorte kopie van `voorpagina/startpagina.css` (zonder
  zaalmodus, film of weer), met onderaan wat eigen is aan de toren.
- `pagina.js`: de paginalijm, afgeleid van `team-ict/pagina.js`: scrollen, de
  spelden, het kaartje, de vrije ruimte naast een paneel, de avondknop en het
  verhaal. Zet ook de bolletjes van elke kamer als lijst in het hoofdstuk.
- `toren.js`: het tafereel, de momenten (`momenten`) en de tijdlijn van het
  verhaal (`VERHAAL`, `regie`). Alles wordt in code gemaakt.
- `plekken.js`: `ADRES` (het adres van de app, op één plek), de namen van de
  kamers, de teksten van de bolletjes en de regels van het verhaal. De volgorde
  van de plekken is die van "Volgende" in het kaartje.
- `controle.mjs`: kijkt na zonder browser (zie hieronder).
- `ONTWERP.md`: het ontwerp.

Uit de zusterpagina's laadt de pagina alleen `../gedeeld/` (motor, three.js,
Poppins, logo) en `../voorpagina/sfeer.js` (het uur en de hemel). Ze haalt niets
op bij een andere server; de enige links naar buiten zijn de knoppen naar de app.

## Een plek of een tekst aanpassen

- **Een tekst**: in `plekken.js`. Hou je aan de regel uit `ONTWERP.md`: zeg niets
  over de app wat er niet al staat, en schrijf "bewerkingen", niet "sommen".
- **Het adres van de app**: alleen `ADRES` bovenaan `plekken.js`. De controle
  slaat alarm als een ander bestand het adres zelf noemt.
- **Een plek toevoegen**: in `toren.js` zet je het voorwerp in een eigen groepje en
  geef je het door aan `plek('id', 'kamer', groepje)`, met de id en de kamer
  letterlijk tussen aanhalingstekens (de controle leest ze zo). In `plekken.js`
  een object met dezelfde id, kamer, titel en tekst. Hangt het voorwerp een
  bord of draagt het tekst, laat de speld dan op de bovenrand staan met
  `speldOp(groepje, hoogte)`: de motor zet ze anders op 70 % van de hoogte, midden
  op de tekst.
- **Een bord tegen de achterwand**: `wandBord()`. Het rekent zelf uit hoe ver het
  van de ronde muur moet hangen: hoe breder, hoe verder naar voren.
- **De tovenaar**: alles zit in `maakTovenaar()` in `toren.js`. Thomas tekent later
  zelf een tovenaar; vervang dan die ene functie, en hou het punt `top` (waar het
  gele lichtje hangt) en de vrije arm (`armen[0]`, die naar het scherm wijst).
- **Een moment**: in `momenten` in `toren.js`. `zet(p)` zet de kamer in de stand
  van p seconden na de start; p < 0 is de beginstand, p = `duur` de eindstand.
  Zo werkt de stille stand vanzelf: die roept elk moment op met zijn duur.
- **Het verhaal**: de tijdstippen in `VERHAAL` (`toren.js`), de regels in
  `VERHAAL_REGELS` (`plekken.js`).

Draai daarna:

```bash
node rekencollectief/controle.mjs
```

Die kijkt na dat elke plek uit `plekken.js` een voorwerp in `toren.js` heeft in
dezelfde kamer (en omgekeerd), dat elk hoofdstuk en elk label een kader voor de
camera heeft, dat elke kamer een lijst met bolletjes, een label en een regel in
het verhaal heeft, en dat het adres van de app alleen in `plekken.js` staat. Ze
hangt bewust niet in `test/tests.json`: de aantallen daar staan op meerdere
plekken vast. Een plek zonder voorwerp meldt ook de console van de pagina bij het
laden.

## Waarom het zo gebouwd is

- **Dezelfde motor, niets eraan veranderd.** `gedeeld/` draagt ook de school, de
  raket en de werelden van Leerlichtjes. Wat de toren extra nodig had, zit in
  `toren.js`: de momenten, de tijdlijn, het boeket en `speldOp`.
- **De tijdlijn loopt in de scène**, op de tijd van het tafereel, zoals de
  go/no-go-ronde van de raket: ze pauzeert mee als het canvas uit beeld is. Bij
  elke stap roept ze `melding('stap', { stap, kamer })` op en op het einde
  `melding('klaar')`. `pagina.js` stuurt daarop de camera en het bord. Later
  wordt dit de basis van het filmpje.
- **Het slot kijkt naar het dak** (kader `dak`), niet naar de hele toren: anders
  is het boeket te klein naast het bord. Tijdens het boeket blijft het bord klein;
  de knoppen komen als het verhaal klaar is.
- **Het kaartje bedekt het voorwerp niet.** Ligt het kaartje of het verhaalbord
  over het podium (laptop), dan geeft `zetVrijeRuimte()` de motor de ruimte
  ernaast en erboven (`dio.vrijeRuimte`), en kadert de camera het voorwerp
  daarin. Op de gsm (smaller dan 900 px) staan beide onder het podium.
- **Op de gsm verdwijnen de labels in een kamer.** Daar vult de toren de hele
  breedte en stonden ze over het tafereel; in het overzicht staan ze er wel.
- **De ronde muur.** Een bord hangt plat, de muur is rond: zonder `wandBord()`
  steekt de muur voor de randen van een breed bord. Bovenop de laatste muur ligt
  een platte ring tot onder de dakrand, anders kijk je tussen binnen- en
  buitenmuur door naar de lucht.
- **Het dak is open aan de voorkant**, met binnenin een sterrenhemel: zo kijk je
  in de sterrenwacht en zie je de sterren verschijnen. De telescoop steekt er
  rechtsachter door.
- **De deur draait weg van de camera** (scharnier aan de achterkant), anders
  bedekt ze de deuropening net als het kind binnenkomt. Het daglicht is een vlak
  achter de deur, de muur heeft geen gat.
- **Klein gehouden**: geen informatielaag, logboek, zaalmodus, weer, seizoenen of
  opslag in de browser.

## Gemeten

Op 16 november 2026, op een laptop met een grafische kaart, pixelRatio 1,25,
1366 × 768, met `dio._test.meet(60)`:

| Beeld | Tekenbeurten | Driehoeken | ms per beeld |
| --- | --- | --- | --- |
| Overzicht, overdag | 188 | 84.600 | 1,7 |
| Overzicht, 's avonds | 188 | 84.800 | 1,5 |
| Oefenkamer, overdag en 's avonds | 121-122 | 68.300 | 4,2 |
| Andere kamers | 112-142 | 52.000-79.000 | 1,8-3,0 |
| Het boeket op het einde van het verhaal | 182 | 67.400 | 1,0 |
| Overzicht met `?zwak` (dag / avond) | 188 / 189 | 85.000 | 2,2 / 2,0 |

Ter vergelijking: de raket telt er ongeveer 286, de school 285. De milliseconden
zijn grof: de pagina draaide in een achtergrondvenster van de preview, waar de
browser het tekenen afremt (zie "Nog te doen"). De download van de pagina zelf is
zo'n 32 kB gezipt (`toren.js` 15 kB, `pagina.js` 6 kB, `toren.css` 6 kB,
`index.html` 4 kB, `plekken.js` 2 kB), bovenop de motor (17 kB) en three.js
(140 kB) die de voorpagina ook gebruikt.

Nagekeken op 1366 × 768, 1024 × 768, 768 × 1024 en 360 × 800: nergens horizontaal
scrollen, geen tekst die uit een knop of kaartje loopt, en het voorwerp van een
open kaartje staat telkens vrij (op de laptop boven het kaartje, op de gsm in het
podium boven het kaartje). Ook `?stil`, `?schets`, `?zwak`, de avondstand en een
ronde met alleen het toetsenbord (Tab, Enter, pijltjes, Escape).

## Nog te doen

- Bekijken in een gewoon, zichtbaar browservenster: de vloeiendheid van de
  momenten en van de camera is hier alleen beeld per beeld nagekeken (met
  `dio._test.spoel`), niet in echte tijd.
- Testen op een echte iPhone, een school-Chromebook en een beamer.
- 's Avonds op een zwak toestel (zonder lampen) is de kleurkamer vrij grauw.
- Het filmpje (`?film`), een plaats op de voorpagina en een eigen getekende
  tovenaar: bewust niet in deze stap (zie `ONTWERP.md`).
