# Team ICT: de raket

Een pagina voor iedereen in de scholen van Het leercollectief: wat Team ICT doet,
voor wie, wat eronder zit, en waar je terechtkunt als iets niet werkt. Ze moet op
termijn de losse mails en nieuwsbrieven vervangen.

Het beeld is een raket in doorsnede op een lanceerplatform, gebouwd met dezelfde
motor als de school op de voorpagina (`gedeeld/diorama-kern.js`). Je leest van
boven naar beneden, en de camera volgt:

| Hoofdstuk | Kamer | Wat je ziet |
| --- | --- | --- |
| De lading | `neus` | Kwaliteit overal: het pedagogisch project als kompas |
| Beleid | `beleid` | ICTCheck, de leerlijn digitale competenties, AI, tools tegen planlast |
| Secundair | `secundair` | TALent voor Taal, AI-wijs op school |
| Lager | `lager` | Het Rekencollectief, de nieuwe doelen in het 1ste tot 3de leerjaar |
| Kleuter | `kleuter` | Het Taalappke, de nieuwe minimumdoelen |
| De motor | `motor` | De zes diensten (NET, ID, TST, PLT, SEC, SRV) en de ruggengraat |
| Het platform | `platform` | De helpdesk, de toren (vorming), de vluchtleiding en de grondploeg |

Wie in het oranje loopt, is de grondploeg: de lokale ICT-mensen op de scholen.
Team ICT zit in de vluchtleiding, elk in de kleur van zijn teamkaart. Namen staan
alleen in de tekst, nooit op een figuurtje.

## De go/no-go-ronde en de lancering

Onderaan de pagina (en met de knop "Lanceer" op het podium) start je de ronde.
De vluchtleiding vraagt veertien stations om de beurt: go of no-go? De camera
volgt het pad van laag naar hoog: het platform (grondploeg, helpdesk, vorming),
de zes onderdelen van de motor, de vier verdiepingen en de lading. Elk station
krijgt een bordje GO, in de motor op de voorkant van zijn eigen kast. De ronde
duurt een kleine twintig seconden: lang genoeg om elke zin te lezen, want het
paneel houdt ook de vorige zin nog even vast. Zegt iedereen go, dan schuift het
paneel klein naar boven, telt de vluchtleiding af, draaien de armen van de toren
weg, en vertrekt de raket. De camera volgt haar boven de wolken, waar de hemel
donker wordt. Daarna keert ze terug en landt ze weer: morgen vertrekt ze opnieuw.

Wie vooraf een storing kiest ("Wat als er iets stuk is?"), ziet de ronde stoppen
bij dat onderdeel van de motor: NO-GO op de kast, de camera zoomt erop in, de
energie in de ruggengraat valt stil, en het paneel zegt wat er dan niet meer werkt
en dat je het meldt via de helpdesk. Bij SEC-05 zegt het ook wat je zelf doet bij
een verdachte mail (het veld `actie` in `STATIONS`).

Met minder beweging (`?stil`, of de instelling van het toestel) loopt de ronde
meteen af, zonder vlucht: het paneel toont dan alle stations en de titel "alles
go". Een schermlezer krijgt niet elke zin van de ronde, alleen de grote momenten
(het begin, no-go, alles go, het aftellen, het vertrek, de top en de landing):
die staan in een apart, onzichtbaar statusvak.

Hoe het gebouwd is, zonder de motor in `gedeeld/` te veranderen:

- De tijdlijn loopt in de scène (`regie` in `raket.js`), op de tijd van het
  tafereel. Ze pauzeert dus mee als het canvas uit beeld is of het tabblad op de
  achtergrond staat. Bij elke stap roept ze `melding(soort, gegevens)` op:
  `vraag`, `station`, `hold`, `allesGo`, `tel`, `lift`, `top`, `terug`, `geland`,
  `klaar`, en met `?stil` meteen `stilKlaar` (de ronde zonder vlucht).
- `pagina.js` stuurt daarop de camera (`dio.focus`, `dio.markeer`) en het
  paneel. Zolang de ronde loopt, verzet scrollen de camera niet, opent er geen
  kaartje, en zijn de labels en spelden weg. In de zaalmodus staat de
  verdiepingencyclus even stil en drijft de kijkhoek nauwelijks (anders draaien
  de buitenste kasten achter de wand); om de vier minuten vertrekt de raket vanzelf.
- Het paneel ligt over het podium. `zetVrijeRuimte()` meet waar, en geeft de
  motor twee keuzes: de ruimte ernaast, en die erboven (laptop) of eronder
  (zaal). `dio.vrijeRuimte()` kadert per verdieping in de keuze waarin ze het
  grootst staat. Dat is een uitbreiding van `gedeeld/diorama-kern.js` die
  standaard uit staat: zonder keuze rekent de camera precies zoals voordien. Het
  kleine paneel na "alle stations go" staat bovenaan naast de smalle neus, en op
  de gsm schuift het paneel onder het podium: dan blijft alles vrij.
- Tijdens de vlucht volgt de camera een plek zonder voorwerp, `vlucht`: haar
  `plekAnker` geeft het midden van de raket en haar vlam, met een voorsprong
  tegen het naijlen van de camera. `plekZoom` en `plekHoek` zijn getters die
  tijdens de vlucht de hele raket kaderen. De hemel wordt donker via `dio.sfeer`,
  op basis van `dio.vluchtHoogte()`. De avondknop volgt daarbij de keuze
  (`aria-pressed`), niet de donkere hemel.
- Het vuur reikt hoogstens tot op het platform; wat er niet onder past, spat
  opzij. Pas als de raket loskomt, wordt de vlam lang. Vuur en gloed lopen
  telkens zacht aan en uit, ook op de top en bij de landingsbrand.
- Het aftelcijfer heeft een donkere rand (leesbaar tegen de lichte raket) en
  blijft staan tot het volgende komt: de animatie loopt op de klok, het aftellen
  op de tijd van het tafereel, en op een traag toestel duurt een tel langer.
- De stations en hun zinnen staan in `plekken.js` (`STATIONS`). De zinnen bij
  een storing komen uit het overzicht van Team ICT.

## Bestanden

- `index.html`: de tekst, het podium en de vlakke schets (die staat er ook zonder 3D).
- `raket.css`: een kopie van `voorpagina/startpagina.css` zonder film en weer, met
  onderaan wat eigen is aan de raket.
- `pagina.js`: de paginalijm, afgeleid van `voorpagina/startpagina.js`. Haalt
  niets op bij een andere server, ook niet in de zaalmodus (geen weer).
- `raket.js`: het tafereel. Alles wordt in code gemaakt; er zijn geen 3D-bestanden.
- `plekken.js`: de teksten van de aanklikbare plekken. De volgorde is die van
  "Volgende" in het kaartje.

In `gedeeld/` kwam alleen `vrijeRuimte()` bij (zie hierboven); de voorpagina en
de drie werelden van Leerlichtjes roepen het niet aan, en hun 158 kaders gaven
na de wijziging exact dezelfde camera. De dag en de nacht komen uit
`voorpagina/sfeer.js`.

## Inhoud

De teksten komen uit het overzicht "Rollen en verantwoordelijkheden Team ICT".
De interne aandachtspunten voor het beleid staan hier bewust niet in, en ook
geen details die de beveiliging zouden verzwakken.

## Een plek toevoegen

1. In `raket.js`: zet het voorwerp in een eigen groepje en geef het door aan
   `plek('id', 'kamer', groepje)`. Een bord tegen de wand maak je met `wandBord()`.
2. In `plekken.js`: een object met dezelfde id, een titel, een tekst en, als het
   kan, een link. Zonder link verdwijnt de knop uit het kaartje.
3. Klopt een id niet, dan meldt de console het bij het laden.

## Valkuilen

- De kamers zijn rond en diep. Een bord dat hoger reikt dan `BORD_TOP`,
  verdwijnt achter de voorrand van het plafond zodra je in een kamer inzoomt.
- De kasten in de motor staan niet verder dan 1,12 van de achterwand
  (`KAST_HOEKEN`): verder opzij verdwijnen ze achter de rand van de opening.
  Hun GO-bordjes hangen recht voor de kast; leg je er een dieper of hoger, dan
  lijkt het vanuit de camera bij de buurkast te horen.
- De opening van de raket kijkt naar de camera zoals die in een kamer kijkt
  (`DRAAI` en `BINNEN_OPZIJ`). Draai je de raket, draai die twee dan mee.
- De wanden werpen geen schaduw, anders worden de kamers donker. De schaduw
  onder de raket is een getekende vlek.
- Een figuurtje dat niet beweegt, gaat door `stilFiguur()`: dan wordt het één
  vorm in plaats van zeven. Een hoofd dat rondkijkt, blijft los.

## Testen

```bash
python test/server.py
```

Open daarna <http://localhost:8000/team-ict/>, ook met `?stil`, `?schets`, `?zwak`,
`?zaal` en `?debug` (dan geeft `dio._test.meet()` de tekenbeurten). Gemeten in een
browser zonder grafische kaart: 277 tekenbeurten, evenveel als de school op de
voorpagina (285). De download is samen zo'n 180 kB gezipt, waarvan 140 kB de
bundel van three.js die de voorpagina ook gebruikt.

De lancering kreeg in oktober 2026 een testronde met vier testers (toestand,
toegang en gsm, beeld, tekst), elke bevinding nagespeeld door een tweede. Wat
ze vonden en wat eraan veranderde, staat hierboven verwerkt: bordjes bij de
verkeerde kast, een paneel over de motor en het vuur, vlammen onder de sokkel,
zinnen die te kort in beeld stonden, en een paar beloftes die het overzicht van
Team ICT niet maakt.

## Nog te doen

- De informatielaag uit de eerste versie: het projectbord, de hete hangijzers,
  de wegwijzer en de cijfers van de helpdesk (als voorbeeld gemarkeerd).
- Een plaats op de voorpagina, zoals de werkafspraken vragen voor een nieuw deel.
- Testen op een echte iPhone, een school-Chromebook en een beamer.
