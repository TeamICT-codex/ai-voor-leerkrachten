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
| Het platform | `platform` | De helpdesk (met de cijfers), de wegwijzer, de toren (vorming), de vluchtleiding en de grondploeg |
| Wat speelt er, het bord, het logboek | `overzicht` | De hangijzers, het projectbord en wat er nieuw is |

## De informatielaag

Na de reis door de raket volgt wat de nieuwsbrief en de losse mails moet
vervangen. Bovenaan de pagina staat het nieuwste bericht in één regel, met een
link naar het logboek.

- **De helpdesk in cijfers**, in het hoofdstuk over de helpdesk. Het zijn
  **voorbeeldcijfers**: dat staat bovenaan in een gele strook, bij elke tussenkop
  en in de beschrijving van de grafiek voor een schermlezer. De inzichten ("bijna
  een derde gaat over accounts, daarom ...") verschijnen pas met echte cijfers:
  een besluit uit een verzonnen cijfer zou een lezer als feit overnemen. Komen de
  echte cijfers uit het ticketsysteem, zet ze dan in `HELPDESK_CIJFERS` en zet
  `voorbeeld` op `false`.
- **De wegwijzer**: zoeken in 23 vragen, met wie ze opvolgt. Een zoekwoord in
  `zoek` telt zwaarder dan een woord uit de vraag. Zolang je niets typt, staan
  de vragen uit `TOPVRAGEN` er.
- **De hangijzers**: wat dit schooljaar het meest vraagt, met streepjes voor de
  "temperatuur".
- **Het projectbord**: wat in gebruik is, wat loopt en wat op de lijst staat, te
  filteren op "in de klas" en "technisch".
- **Het logboek** ("Wat is er nieuw?"): de drie nieuwste berichten, de rest op
  vraag.

Bij bijna alles staat een knop "Toon in de raket": die opent het kaartje van die
plek in de raket, en de camera zoomt erop in. Zonder 3D staat het kaartje over de
schets, met dezelfde tekst. Loopt de go/no-go-ronde, dan stopt die eerst: wie op
de knop drukt, wil dat zien. Sluit je het kaartje (ook met Tab voorbij het laatste
element), dan gaat de focus terug naar de laatste knop die het opende. Een
verwijzing naar een hoofdstuk (`#wie`) is een gewone link. Een kaartje uit de
informatielaag blijft staan tot je naar een ander hoofdstuk scrolt, ook als de
adresbalk van een gsm in- of uitklapt.

**Een bericht toevoegen** doe je in `informatie.js`: een object vooraan in
`NIEUWS`, met een datum, een titel, een tekst, een of meer tags en eventueel
`toon` (een id uit `PLEKKEN`, of `#wie`). Zet ook `BIJGEWERKT` op de datum van
vandaag. Hetzelfde geldt voor het bord, de hangijzers en de wegwijzer: het zijn
lijsten, geen code. Een `toon` die niet bestaat, valt stil weg: kijk het na met
het script onderaan dit bestand.

**Bewust niet op de pagina.** De interne aandachtspunten voor het beleid niet,
en ook geen details die een aanvaller zouden helpen. Vier trajecten uit het
overzicht (de back-up van SharePoint, de standaardisatie van de back-ups, het
herstelplan bij grote uitval en de camerabewaking) staan op het bord alleen in
één zin samen (`BORD_NOOT`), en het hangijzer over GRIP zegt "betere back-ups"
in plaats van wat er nog ontbreekt.

Wie in het oranje loopt, is de grondploeg: de lokale ICT-mensen op de scholen.
Team ICT zit in de vluchtleiding, elk in de kleur van zijn teamkaart. Namen staan
alleen in de tekst, nooit op een figuurtje.

## De go/no-go-ronde en de lancering

Onderaan de pagina (en met de knop "Lanceer" op het podium) start je de ronde.
De vluchtleiding vraagt veertien stations om de beurt: go of no-go? De camera
volgt het pad van laag naar hoog: het platform (grondploeg, helpdesk, vorming),
de zes onderdelen van de motor, de vier verdiepingen en de lading. Elk station
krijgt een bordje GO, in de motor op de voorkant van zijn eigen kast. De ronde
duurt een kleine twintig seconden. Het paneel houdt de vorige zin nog even vast,
maar wie elke zin wil lezen, doet dat in het verslag ("Lees wat elk station zei"):
dat verschijnt na de ronde, met de volledige naam van elk station. De ronde zelf
is een schouwspel, het verslag is om te lezen. Zegt iedereen go, dan schuift het
paneel klein naar boven, telt de vluchtleiding af, draaien de armen van de toren
weg, en vertrekt de raket. De camera volgt haar boven de wolken, waar de hemel
donker wordt. Daarna keert ze terug en landt ze weer: morgen vertrekt ze opnieuw.

Wie vooraf een storing kiest ("Wat als er iets stuk is?"), ziet de ronde stoppen
bij dat onderdeel van de motor: NO-GO op de kast, de camera zoomt erop in, de
energie in de ruggengraat valt stil, en het paneel zegt wat er dan niet meer werkt
en dat je het meldt via de helpdesk. Bij SEC-05 zegt het ook wat je zelf doet bij
een verdachte mail (het veld `actie` in `STATIONS`), en dat een mogelijk datalek
ook bij de DPO terechtkomt (het veld `naar`). In de lijst van het paneel staan de
diensten met een gewone naam (Netwerk, Aanmelding, ...); de code (NET-01) staat
op de kast, in de no-go-zin en in het verslag.

Met minder beweging (`?stil`, of de instelling van het toestel) loopt de ronde
meteen af, zonder vlucht: het paneel toont dan alle stations en de titel "alles
go", met het verslag eronder. Een schermlezer krijgt niet elke zin van de ronde,
alleen de grote momenten (het begin, no-go, alles go en het aftellen, het
vertrek, de top en de landing), in een apart, onzichtbaar statusvak dat na tien
seconden weer leeg is. De zinnen zelf leest hij in het verslag.

Hoe het gebouwd is:

- De tijdlijn loopt in de scène (`regie` in `raket.js`), op de tijd van het
  tafereel. Ze pauzeert dus mee als het canvas uit beeld is of het tabblad op de
  achtergrond staat. Bij elke stap roept ze `melding(soort, gegevens)` op:
  `vraag`, `station`, `hold`, `allesGo`, `tel`, `lift`, `top`, `terug`, `geland`,
  `klaar`, en met `?stil` meteen `stilKlaar` (de ronde zonder vlucht).
- `pagina.js` stuurt daarop de camera (`dio.focus`, `dio.markeer`) en het
  paneel. Zolang de ronde loopt, verzet scrollen de camera niet, opent er geen
  kaartje, en zijn de labels en spelden weg. In de zaalmodus staat de
  verdiepingencyclus even stil en drijft de kijkhoek nauwelijks (anders draaien
  de buitenste kasten achter de wand). De raket vertrekt er vanzelf, na een
  minuut en daarna om de vier minuten, maar niet met minder beweging.
- Het paneel ligt over het podium. `zetVrijeRuimte()` meet waar, en geeft de
  motor twee keuzes: de ruimte ernaast, en die erboven (laptop) of eronder
  (zaal). `dio.vrijeRuimte()` kadert per verdieping in de keuze waarin ze het
  grootst staat. Dat is een uitbreiding van `gedeeld/diorama-kern.js` die
  standaard uit staat: zonder keuze rekent de camera precies zoals voordien.
  Neemt het paneel bijna de hele breedte (de gsm, ook liggend), dan is er alleen
  boven of onder ruimte. Tijdens de vlucht is er één keuze, de ruimte naast het
  paneel, en `plekZoom` rekent daar zelf mee (via `bijVrijeRuimte`). Binnen
  dezelfde stand van het paneel groeit de ruimte alleen, zodat de camera niet
  meeademt met elke zin die een regel langer is. Op de gsm staat het paneel
  rechtop onder het podium: dan blijft alles vrij.
- Tijdens de vlucht volgt de camera een plek zonder voorwerp, `vlucht`: haar
  `plekAnker` geeft het midden van de raket en haar vlam, met een voorsprong
  tegen het naijlen van de camera. `plekZoom` en `plekHoek` zijn getters die
  tijdens de vlucht de hele raket kaderen. De hemel wordt donker via `dio.sfeer`,
  op basis van `dio.vluchtHoogte()`. De avondknop volgt daarbij de keuze, niet
  de donkere hemel. Zijn naam zegt wat hij doet ("Avond" of "Dag"), dus zonder
  `aria-pressed`.
- Het kader van de vlucht loopt van het lichtje op de neus tot de punt van de
  vlam (`RAKET_TOP` en `vlamLengte`).
- Bij no-go zoomt de camera dichter in op de kast (`plekZoom` 0,8), en tekent
  het NO-GO-bordje bovenop alles: het mag niet half achter een buurkast vallen.
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
- `informatie.js`: de informatielaag als gegevens: nieuws, hangijzers, de
  wegwijzer, de cijfers van de helpdesk en het projectbord. Dit is de bron.
- `informatielaag.js`: zet die gegevens op de pagina, met de zoekfunctie, de
  filter van het bord en de knoppen "Toon in de raket".

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
browser zonder grafische kaart: 276 tekenbeurten, evenveel als de school op de
voorpagina (285). De download is samen zo'n 180 kB gezipt, waarvan 140 kB de
bundel van three.js die de voorpagina ook gebruikt.

De lancering kreeg in oktober 2026 een testronde met vier testers (toestand,
toegang en gsm, beeld, tekst), elke bevinding nagespeeld door een tweede. Wat
ze vonden en wat eraan veranderde, staat hierboven verwerkt: bordjes bij de
verkeerde kast, een paneel over de motor en het vuur, vlammen onder de sokkel,
zinnen die te kort in beeld stonden, en een paar beloftes die het overzicht van
Team ICT niet maakt. Een herkeuring speelde die bevindingen opnieuw na en vond
nog wat bij een liggende gsm, smallere laptops en schermlezers: het paneel dat
de camera naar de rand duwde, de neus onder het kleine paneel, zinnen die je
niet kon terugvinden (nu het verslag), en een avondknop die "Dag, ingedrukt"
zei. Ook die zijn verwerkt.

De informatielaag ging in november 2026 door een eigen ronde (tekst, toegang en
gsm, werking). Het attribuut `hidden` werkte niet op knoppen en berichten (nu
staat er een algemene regel bovenaan `raket.css`), het zoekveld duwde een smalle
gsm opzij, de focus verdween onder het podium op de gsm, en de voorbeeldcijfers
stonden te klein aangeduid. Drie bevindingen over de tekst hielden geen stand bij
een tweede lezer, en bleven dus zoals ze waren: de trajecten op de lijst rond
accounts en netwerkaanmelding, een paar vaktermen in de wegwijzer (Intune,
basisconfiguratie), en de naam van de filter "In de klas".

## Nog te doen

- De echte cijfers van de helpdesk, in plaats van de voorbeeldcijfers.
- Testen op een echte iPhone, een school-Chromebook en een beamer.

Beslist door Thomas op 4 november 2026: Team ICT staat apart van "AI op school".
De pagina krijgt geen plaats op de voorpagina en staat op haar eigen adres
(`…/ai-voor-leerkrachten/team-ict/`). Het adres van de helpdesk,
<https://helpdesk.hetleercollectief.be>, klopt.

Nakijken of elke `toon` in `informatie.js` nog naar een bestaande plek wijst:

```bash
node --input-type=module -e "
import * as I from './team-ict/informatie.js'; import { PLEKKEN } from './team-ict/plekken.js';
const ids = new Set(PLEKKEN.map(p => p.id));
const alle = [...I.NIEUWS.map(n => n.toon), ...I.HANGIJZERS.flatMap(h => h.toon), ...I.VRAGEN.map(v => v.toon),
  ...I.BORD.map(b => b.toon), ...I.HELPDESK_CIJFERS.inzichten.map(i => i.toon)].filter(Boolean);
const fout = alle.filter(t => !t.startsWith('#') && !ids.has(t));
const top = I.TOPVRAGEN.filter(t => !I.VRAGEN.some(v => v.v === t));
console.log(fout.length || top.length ? 'FOUT ' + [...fout, ...top].join(', ') : 'alles OK');
"
```
