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
de zes onderdelen van de motor, de vier verdiepingen en de lading. Zegt iedereen
go, dan telt de vluchtleiding af, de armen van de toren draaien weg, en de raket
vertrekt. De camera volgt haar boven de wolken, waar de hemel donker wordt. Daarna
keert ze terug en landt ze weer: morgen vertrekt ze opnieuw.

Wie vooraf een storing kiest ("Wat als er iets stuk is?"), ziet de ronde stoppen
bij dat onderdeel van de motor: NO-GO, de energie in de ruggengraat valt stil, en
het paneel zegt wat er dan niet meer werkt en dat je het meldt via de helpdesk.

Hoe het gebouwd is, zonder de motor in `gedeeld/` te veranderen:

- De tijdlijn loopt in de scène (`regie` in `raket.js`), op de tijd van het
  tafereel. Ze pauzeert dus mee als het canvas uit beeld is of het tabblad op de
  achtergrond staat. Bij elke stap roept ze `melding(soort, gegevens)` op:
  `vraag`, `station`, `hold`, `allesGo`, `tel`, `lift`, `top`, `terug`, `geland`,
  `klaar`, en met `?stil` meteen `stilKlaar` (de ronde zonder vlucht).
- `pagina.js` stuurt daarop de camera (`dio.focus`, `dio.markeer`) en het
  paneel. Zolang de ronde loopt, verzet scrollen de camera niet, opent er geen
  kaartje, en zijn de labels en spelden weg. In de zaalmodus staat de
  verdiepingencyclus even stil, en om de vier minuten vertrekt de raket vanzelf.
- Tijdens de vlucht volgt de camera een plek zonder voorwerp, `vlucht`: haar
  `plekAnker` geeft het midden van de raket, met een voorsprong tegen het
  naijlen van de camera. `plekZoom` en `plekHoek` zijn getters die tijdens de
  vlucht de hele raket kaderen. De hemel wordt donker via `dio.sfeer`, op basis
  van `dio.vluchtHoogte()`.
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

`gedeeld/` is niet aangepast. De dag en de nacht komen uit `voorpagina/sfeer.js`.

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
browser zonder grafische kaart: 274 tekenbeurten, evenveel als de school op de
voorpagina (285). De download is samen zo'n 180 kB gezipt, waarvan 140 kB de
bundel van three.js die de voorpagina ook gebruikt.

## Nog te doen

- De informatielaag uit de eerste versie: het projectbord, de hete hangijzers,
  de wegwijzer en de cijfers van de helpdesk (als voorbeeld gemarkeerd).
- Een plaats op de voorpagina, zoals de werkafspraken vragen voor een nieuw deel.
- Testen op een echte iPhone, een school-Chromebook en een beamer.
