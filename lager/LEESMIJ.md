# Leerlichtjes: AI ontdekken in het lager

Het aanbod voor het lager. Per graad één wereld die de leerkracht samen met de
klas op het digibord verkent. De kinderen werken niet zelf met een chatbot: de
meeste zijn pas vanaf 13 jaar (nagekeken voor de leerlingencursus, 27 oktober
2026). De stations bootsen na hoe AI werkt, volledig in de browser.

De naam Leerlichtjes is een voorstel en kan nog veranderen.

## Bestanden

```
lager/
  index.html              onthaal: de drie graden
  voor-leerkrachten.html  wat elke wereld gemeen heeft: waarom geen chatbot, hoe een wereld
                          werkt, vragen van kinderen, privacy; met een link per graad
  lager.css               één stylesheet voor alle pagina's van Leerlichtjes
  wereld.js               de pagina rond elke wereld: venster per station, stempels, voorlezen
  activiteiten.js         bouwstenen voor de opdrachten (el, knop, inzicht, sorteer, spreek, beeld)
  paspoort.js             vult het paspoort van een graad
  TESTLIJST.md            wat je nakijkt op een digibord, een tablet en een Chromebook
  1ste-graad/
    index.html            De klas van de juf
    klas.js               het 3D-klaslokaal, als een poppenhuis
    stations.js           de vijf hoeken: teksten, tekeningen en activiteiten
    wereld.js, handleiding.html, paspoort.html   zoals bij de 2de graad
  2de-graad/
    index.html            Het dorp
    dorp.js               het 3D-dorp (bovenop gedeeld/diorama-kern.js)
    stations.js           de vijf stations: teksten en activiteiten
    tekenherkenner.js     de kleine herkenner van de bibliotheek (zonder DOM, te testen in node)
    wereld.js             start de wereld met de stations en de sleutel van deze graad
    handleiding.html      lesverloop, doelen, varianten zonder computer, brief voor de ouders
    paspoort.html         het paspoort om af te drukken
  3de-graad/
    index.html            De stad van morgen
    stad.js, stations.js, wereld.js, handleiding.html, paspoort.html   zoals hierboven
gedeeld/
  diorama-kern.js         de motor achter elk tafereel, ook dat van de startpagina
  three-diorama.min.js    een uitgedunde bundel van three.js r186 (+ three-ingang.js, licentie)
  fonts/                  Poppins, lokaal (OFL)
```

## De klas van de juf (1ste graad)

| Hoek | Wat de kinderen doen | Doel (voorzet) |
|---|---|---|
| 1 · De ontdekhoek | Acht dingen sorteren: met of zonder computer erin | In veel toestellen zit een kleine computer |
| 2 · De bouwhoek | Het lichtje leren opruimen, een foutje doen en het verbeteren | Een computer leert van onze voorbeelden, ook van onze foutjes |
| 3 · De kring | Wie kan dit: alleen een mens, of een mens én een computer? | Een computer kan praten, maar voelt niets |
| 4 · De laatjeskast | Een spel stelt vragen: vertellen of in de geheimendoos? | Wat je niet aan een spel of toestel vertelt |
| 5 · Het bureau van de juf | Zeven tabletschermen: verder doen of een grote mens vragen? | Bij twijfel stoppen en hulp vragen; vragen is nooit fout |

De kinderen lezen nog niet vlot. Daarom staat `leesMee` aan in `startWereld`:
elk kaartje en elke feedback wordt voorgelezen (`spreek()` in
`activiteiten.js`), met een knop "Lees mee" in de kop om het uit te zetten. In
deze wereld heten de stations hoeken (de optie `woord`).

## Het dorp (2de graad)

| Station | Wat de kinderen doen | Doel (voorzet) |
|---|---|---|
| 1 · De bibliotheek | Katten en vissen tekenen als voorbeeld voor een tekenherkenner, en hem testen | Een computer leert van voorbeelden en kent alleen wat hij leerde |
| 2 · Het huis | Voorspellen wanneer het lampje van de slimme speaker Bolleke brandt, en sorteren wat je hem vraagt | Een speaker luistert of hij zijn naam hoort; wat je daarna zegt, gaat naar een bedrijf |
| 3 · De fotowinkel | Zoek de verschillen tussen een echte en een gemaakte foto | Aanwijzingen herkennen, en bij twijfel nagaan waar een foto vandaan komt |
| 4 · Het park | De voetstappen van Fien volgen; Snuf de speurneus legt ze samen | Wat je online doet, laat een spoor na |
| 5 · De school | Een vraag bouwen voor een oefenrobot met nagemaakte antwoorden | Een duidelijke vraag zegt waarover, voor wie en hoe lang |

De tekenherkenner zet elke tekening om in een rooster van 24 bij 24 hokjes en
zoekt het voorbeeld dat het meest lijkt. Met synthetische tekeningen in drie
stijlen per soort raadde hij 89% goed met voorbeelden in één stijl, en 98% tot
100% met gemengde voorbeelden. Bij iets anders (een huis, een auto) zegt hij
toch "kat" of "vis", vaak "zeker": dat is precies wat de kinderen moeten zien.

## De stad van morgen (3de graad)

| Station | Wat de kinderen doen | Doel (voorzet) |
|---|---|---|
| 1 · Het lab | Een woordvoorspeller telt welk woord na welk komt en maakt zinnen | Een chatbot voorspelt woorden en weet niet of iets waar is |
| 2 · De fabriek | Een sorteermachine die alleen rode appels zag, bijleren | Een computer leert van voorbeelden; ontbreken ze, dan maakt hij fouten |
| 3 · De krant | Vier fouten zoeken in een "chatbottekst" over het zonnestelsel | Nakijken in een andere bron |
| 4 · Het museum | Foutjes zoeken in een gemaakt beeld, en sorteren: mag ik dit gebruiken? | Elk werk heeft een maker; eerlijk zeggen wie het maakte |
| 5 · De haven | Situaties sorteren: helpt je leren, doet het werk, of vraag het eerst | Het verschil tussen leren met AI en het werk laten doen |

## Gemeenschappelijk

Elk station heeft drie stappen: Ontdek, Doe en Praat samen. Na de opdracht
verdient de klas een stempel; in de wereld verschijnt dan een vlag. De stempels
staan in `localStorage` onder `leerlichtjes.<graad>.stempels`, met een knop
"Nieuwe klas" om ze te wissen. Elke graad heeft zijn eigen sleutel.

De werelden volgen elkaar op. In de klas leert het lichtje van voorbeelden en
neemt het een foutje over; in het dorp leert een tekenherkenner; in de stad
mist een sorteermachine voorbeelden. De geheimendoos van de klas wordt in het
dorp het spoor dat je online achterlaat. Verder: de bibliotheek (leren van voorbeelden) groeit
uit tot de fabriek (ontbrekende voorbeelden), de fotowinkel (zoek de
verschillen, met een echte foto ernaast) tot het museum (zelf foutjes zoeken,
en wie maakte het), de school (een duidelijke vraag) tot de haven (wanneer AI
je helpt leren).

Om te testen: `?stil`, `?schets`, `?zwak` en `?debug`, zoals bij de startpagina.
Met `?debug` hangt `window.dio` aan de pagina, met `dio.focus('park')` en
`dio._test.spoel(3)` om de tijd vooruit te spoelen.

## Een nieuwe wereld maken

Maak een map zoals `2de-graad`. Een wereld bestaat uit een tafereel (zoals
`dorp.js`, dat `maakPodium` uit de kern gebruikt), een lijst stations met
`maak(vak, klaar)` per activiteit, een `wereld.js` die `startWereld` uit
`../wereld.js` oproept met een eigen sleutel, en een `index.html` met dezelfde
opbouw als de andere werelden.

## Nog te doen

- De teksten laten nalezen, en de doelen naast de leerplandoelen leggen.
- Testen op een echt digibord, een tablet en een Chromebook: zie `TESTLIJST.md`.
- Een module in de leeromgeving voor leerkrachten, zoals bij de leerlingencursus.
