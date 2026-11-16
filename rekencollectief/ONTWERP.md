# De rekentoren: ontwerp

Een kleine, aparte pagina die Het Rekencollectief voorstelt aan **leerkrachten en
directies die de app nog niet kennen**. Ze werkt zoals de school op de voorpagina
en de raket van Team ICT: een tafereel in 3D naast de tekst, een camera die
meereist als je scrolt, en bolletjes die een kaartje openen. Thomas wil er ook
mee tonen wat er kan: het mag dus een schouwspel zijn, zolang het klein blijft.

Beslist door Thomas op 16 november 2026: een **tovenaarstoren** in doorsnede, voor
leerkrachten en directies, eerst de pagina en later pas een filmpje.

De pagina staat apart, zoals Team ICT: geen plaats op de voorpagina van "AI op
school" en geen knop "AI op school". Of dat zo blijft, beslist Thomas.

## Het verhaal

Je klimt van de poort naar de sterrenwacht. Scrol je naar beneden in de tekst,
dan stijgt de camera in de toren. Elke verdieping is één stap van de app, van
meten naar doen.

| Hoofdstuk | Kamer (id) | Verdieping | Wat de app daar doet |
| --- | --- | --- | --- |
| Binnen met een code | `hal` | 0 | opdracht klaarzetten, code van zes cijfers, naam aantikken |
| Oefenen zonder druk | `oefen` | 1 | oefenen, de tovenaar, Ik oefen zelf, de Getallenreis |
| De periodetoetsen | `meet` | 2 | de kwaliteitsfiche, de klok, de wenronde |
| Zien waar iedereen staat | `kleur` | 3 | het periode-overzicht, de tempo-norm, de volgkaart |
| Van meten naar doen | `ster` | 4, onder het dak | het klasbeeld, de groepen, de werkgroep |

## Het tafereel

Een stenen toren op een groene heuvel, open naar de camera zoals het poppenhuis.
Huisstijl van Het leercollectief: crèmekleurige steen, een donkergroen puntdak,
accenten in mint, perzik, geel en lichtblauw. Geen sprookjeskitsch: het blijft
dezelfde wereld als de school en de raket, met dezelfde figuurtjes zonder gezicht.

- **Buiten**: een heuvel, een pad van stapstenen naar de deur, een paar bomen,
  een wegwijzer "Het Rekencollectief", wolken. Op de dakpunt een kristal dat
  's avonds gloeit, en een vlag met "samen is beter".
- **De tovenaar**: een gewoon figuurtje uit de motor met een groene puntmuts (met
  een gele band) en een staf. Thomas tekent later zelf een tovenaar: bouw hem
  dus eenvoudig en op één plek, zodat hij makkelijk te vervangen is. Aan de staf
  hangt **het gele lichtje** van de motor (`maakLichtje`): op de voorpagina is
  dat lichtje de AI-assistent, hier is het de AI van de tovenaar. Geeft de
  tovenaar feedback, dan vliegt het lichtje van de staf naar het scherm.
- **Kamer `hal`**: een bord met de code `482 913`, een rek met naamkaartjes (een
  kleurtje en een icoontje per kind), de deur, een kind dat binnenkomt.
- **Kamer `oefen`**: twee of drie kinderen aan een tafel met een laptop, een groot
  scherm met een bewerking, de tovenaar, en in de hoek een kleine machine en een
  grotje (de Splits-Fabriek en de Flits-Grot).
- **Kamer `meet`**: een grote zandloper, een wandbord met de periodes
  `A*  A  B  C  D  E`, een plantje in een pot (de wenronde), een leerkracht.
- **Kamer `kleur`**: een wandbord met de tabel in groen, oranje en rood, de
  leerkracht met een laptop, en op tafel een **schildpadje** in blokjes dat traag
  over de tafel wandelt.
- **Kamer `ster`**: een telescoop door het dak, een glazen bol op een voetstuk,
  en een ronde tafel met pionnen in drie kleuren.

Hou elke kamer eenvoudig: één herkenbaar voorwerp per bolletje, en weinig meubels
errond. Alles wat stilstaat, voeg je samen (`voegSamen`); wat beweegt, markeer je
met `levend()`.

## Het schouwspel

Dit is het stuk waarmee de pagina toont wat er kan. Elke kamer heeft één
moment, dat afspeelt als de camera er aankomt of als je het bolletje opent.

| Kamer | Het moment |
| --- | --- |
| `hal` | de zes cijfers van de code verschijnen één voor één op het bord, de deur zwaait open en een kind stapt binnen |
| `oefen` | op het scherm komt `7 × 8 =`, het antwoord `56` typt zich met een vinkje; het lichtje vliegt van de staf naar het scherm en er stijgen sterretjes op |
| `meet` | de zandloper kantelt, en op het wandbord lichten de periodes één voor één op |
| `kleur` | de tabel vult zich vakje per vakje, van grijs naar groen, oranje of rood; bij één oranje vakje staat een schildpadje |
| `ster` | de pionnen schuiven op de tafel uit elkaar in drie groepjes, de glazen bol licht op, en in het dak verschijnen sterren |

**"Speel het verhaal af"**: een knop op het podium en onderaan de pagina. De
camera klimt in een halve minuut van de poort naar de sterrenwacht, elke kamer
speelt haar moment met één regel tekst erbij, en op het einde springt er een
boeket sterren uit het dak en staat de knop naar de app er. Bouw dit zoals de
ronde van de raket: een tijdlijn in de scène op de tijd van het tafereel, die
meldingen stuurt naar `pagina.js`. Later wordt dit de basis van het filmpje.
Met minder beweging (`?stil`, of de instelling van het toestel) speelt er niets:
dan staat de samenvatting er als gewone lijst.

Wat de motor al kan, gebruik je gewoon: slepen om de toren te draaien, de
avondknop (lampen en gloeiende ramen), de bolletjes met Vorige en Volgende, en
de labels naast de toren als echte knoppen.

## De zaalmodus

Gevraagd door Thomas op 16 november 2026: een zaalmodus "zoals die andere", voor
een beamer of een digibord. Bouw ze zoals die van de raket (`zetZaal` in
`team-ict/pagina.js`), met wat de motor al kan (`dio.zaal`).

- **Starten**: de knop "Zaalmodus voor de beamer" onderaan de pagina, of `?zaal`
  in het adres. De knop vraagt ook het volledige scherm; lukt dat niet, dan
  werkt de zaalmodus evengoed.
- **Wat je ziet**: de toren vult het hele scherm, de tekst van de pagina is weg.
  De camera wisselt vanzelf van kamer, van de hal naar de sterrenwacht, en elke
  kamer speelt haar moment als de camera er aankomt.
- **Het onderschrift**: wie in de zaal zit, heeft de tekst van de pagina niet. In
  de zaalmodus staat daarom groot onderaan de naam van de kamer met de regel uit
  `VERHAAL_REGELS` erbij, en wisselt het mee met de camera.
- **Het zaalbord**: "Het Rekencollectief" met eronder het adres van de app, uit
  `ADRES` zonder `https://`, groot genoeg om achteraan de zaal over te typen.
- **Presenteren**: met de pijltjes naar rechts en links loop je door alle 14
  kaartjes, van de hal tot de sterrenwacht, groot genoeg voor een beamer. Zolang
  een kaartje openstaat, wisselt de camera niet vanzelf.
- **Het verhaal speelt vanzelf**: na een minuut, en daarna om de vier minuten,
  zoals de raket vanzelf vertrekt. Niet zolang er een kaartje openstaat, en niet
  met minder beweging.
- **Stoppen**: Escape sluit eerst het kaartje, dan het verhaal, en pas daarna de
  zaalmodus. Wie het volledige scherm verlaat, verlaat ook de zaalmodus.
- **Met minder beweging** (`?stil`): geen wissel en geen verhaal. De toren staat
  stil in het overzicht en de kaartjes werken met de pijltjes.
- **Geen weer, geen klok, niets van een andere server**, ook niet in de zaalmodus.

## De teksten

Schrijf voor een leerkracht die de app nooit zag. Zeg **bewerkingen**, niet
sommen. Neem de teksten hieronder letterlijk over: ze zijn nagekeken tegen wat de
app vandaag doet. Verzin er geen functies, cijfers of beloften bij.

**Kop**: "Juist én vlot rekenen. Klim mee de toren in."
**Inleiding**: "Het Rekencollectief is de oefen- en toetsapp voor parate
rekenkennis van Het leercollectief. Klim van de poort naar de sterrenwacht en
zie wat je leerlingen doen, wat jij ziet en wat je ermee doet."
**Bovenaan rechts**: een knop "Handleiding" en een knop "Open de app".
**Onder de kop**: "scrol verder en klim mee" en de knop "Speel het verhaal af".

### 1. Binnen met een code (`hal`)

Geen accounts en geen wachtwoorden voor kinderen. Jij zet een opdracht klaar en
krijgt een code van zes cijfers. Je leerlingen tikken die in, kiezen hun naam en
beginnen.

- `code` (het bord) — **Een code van zes cijfers**: Elke opdracht of toets krijgt
  een eigen code. Die zet je op het bord. Een kind tikt ze in bij "Ik ben een
  leerling" en start precies wat jij klaarzette: de bewerkingen, het aantal en de
  tijd.
- `naam` (het rek met naamkaartjes) — **Naam aantikken**: Staat je klaslijst in
  de app, dan tikt een kind gewoon zijn naam aan, met een eigen icoontje erbij.
  Niemand hoeft te typen, en geen enkel kind heeft een account nodig.

### 2. Oefenen zonder druk (`oefen`)

Hier wordt geoefend: met jouw opdracht, of op eigen houtje bij "Ik oefen zelf".
Tafels, plus en min, en de Getallenreis voor wie nog leert splitsen.

- `tovenaar` — **De rekentovenaar**: Na een reeks krijgt elk kind feedback van de
  tovenaar: wat goed ging, welke bewerking nog lastig is, en een tip om ze te
  onthouden. Kort en warm, in kindertaal. De tovenaar werkt met AI. Jij krijgt bij
  dezelfde reeks een analyse met didactische tips.
- `zelf` (het kind met de laptop) — **Ik oefen zelf**: Kinderen kiezen zelf wat
  ze oefenen. Ze verdienen XP en levels en spelen avatars vrij. Een bewerking die
  fout ging, komt later vanzelf terug bij "Jouw uitdagingen".
- `reis` (de machine en het grotje) — **De Getallenreis**: Voor het getalbegrip
  in de eerste leerjaren: splitsen in de Splits-Fabriek en stippen flitsen in de
  Flits-Grot.

### 3. De periodetoetsen (`meet`)

Een paar keer per jaar meet je waar elke leerling staat, met de periodetoetsen
van de kwaliteitsfiche parate kennis. Een wizard zet ze in een paar klikken klaar
voor je klas.

- `fiche` (het wandbord met de periodes) — **De kwaliteitsfiche als kompas**: Van
  periode A* tot E, met per leerjaar de juiste onderdelen: tafels, splitsingen,
  plus en min tot 20, tot 100 en tot 1000. Jij kiest je klas en de periode, de
  app zet de reeksen klaar.
- `klok` (de zandloper) — **Een klok die niet opjaagt**: Een toets meet ook het
  tempo, maar niet elk kind is gebaat bij een klok die aftelt. Jij kiest een
  harde of een zachte klok. En vóór de start beslist het kind zelf of het de klok
  wil zien.
- `wen` (het plantje) — **Eerst wennen**: Met een wenronde leren kinderen het
  ritueel kennen: dezelfde soort bewerkingen, maar korter, en ze telt niet mee.

### 4. Zien waar iedereen staat (`kleur`)

Alle leerlingen en alle onderdelen in één tabel. De kleur zegt wat je ermee doet.

- `overzicht` (het wandbord met de tabel) — **Het periode-overzicht**: Leerlingen
  in de rijen, onderdelen in de kolommen. Groen: juist én vlot. Oranje: bijna,
  nog niet vlot, of te weinig gemaakt. Rood: te veel fouten. Ook wat je op papier
  afnam, zet je erbij.
- `schildpad` — **Kennen is nog niet vlot ophalen**: Wat uit het hoofd moet, haal
  je op in gemiddeld hoogstens 5 seconden per bewerking. Wie juist rekent maar
  trager is, krijgt een schildpadje en staat oranje, nooit rood. Zo zie je wie
  moet automatiseren en wie nog uitleg nodig heeft.
- `volgkaart` (een map of grafiek bij de leerkracht) — **Elk kind doorheen het
  jaar**: Klik op een naam en je ziet de volgkaart: hoe een leerling evolueert
  van periode tot periode. Afdrukken of exporteren kan, bijvoorbeeld voor het
  zorgoverleg.

### 5. Van meten naar doen (`ster`)

Cijfers zijn pas iets waard als je er morgen iets mee doet. Op jouw vraag maakt
de tovenaar een klasbeeld: wat zit goed, wat vraagt aandacht, en wie werkt samen
aan wat.

- `klasbeeld` (de glazen bol) — **Het klasbeeld**: Eén klik op "Analyseer periode"
  en je krijgt een beeld van je hele klas: per onderdeel wat sterk staat en wat
  opnieuw uitleg vraagt, met concrete stappen voor de komende weken. De analyse
  werkt met AI. Jij beslist wat je ermee doet.
- `groepjes` (de tafel met pionnen) — **Drie groepen, drie aanpakken**: De analyse
  stelt werkgroepen voor: wie zelfstandig verder kan, wie baat heeft bij extra
  oefening, en wie opnieuw instructie nodig heeft.
- `samen` (de vlag of de telescoop) — **Gemaakt met en voor leerkrachten**: Het
  Rekencollectief is een project van de werkgroep automatiseren van Het
  leercollectief, met begeleiding van de pedagogische begeleidingsdienst. Wat
  scholen melden, komt in de app terecht: wat er verandert, lees je in "Kort op
  de bal".

### Het slot

**Kop**: "Zin om het te proberen?"
**Tekst**: "Open de app, of lees eerst in de handleiding hoe je in drie stappen
start."
**Knoppen**: "Open het Rekencollectief" (naar `ADRES`) en "Lees de handleiding"
(naar `ADRES + '/handleiding'`).
**Kleine regel**: "De namen en cijfers in de toren zijn verzonnen."

Verzonnen namen voor de tabel en de naamkaartjes: Aya, Bram, Camille, Daan,
Elena, Finn, Gilles, Hanne.

## Harde afspraken

- **Raak buiten `rekencollectief/` niets aan**, op één uitzondering na: een paar
  regels in het blok "Structuur" van `CLAUDE.md`. De motor in `gedeeld/` draagt
  ook de school, de raket en de drie werelden van Leerlichtjes: wijzig hem niet.
  Mis je iets in de motor, los het op in `toren.js`.
- **Geen verbindingen naar buiten.** Geen weer, geen lettertypes of scripts van
  een andere server, geen tellers. three.js, Poppins en het logo komen uit
  `gedeeld/`. De enige links naar buiten zijn de knoppen naar de app.
- **Het adres van de app staat op één plek**: `ADRES` bovenaan `plekken.js`
  (`https://rekencollectief.vercel.app`). De app verhuist later naar een eigen
  server.
- **Zeg niets over privacy of waar gegevens staan**, behalve dat kinderen geen
  account nodig hebben. Wat de app daarover zegt, staat in de app zelf en hoort
  niet in een voorstelling.
- **Valt netjes terug**, zoals de zusterpagina's: de volledige tekst staat er
  zonder 3D; zonder WebGL2 blijft er een vlakke schets (een eenvoudige SVG van de
  toren); met minder beweging staat het tafereel af en stil; het canvas is
  decoratief en de labels zijn echte knoppen; alles is met het toetsenbord te
  bereiken.
- **Dezelfde parameters als de zusterpagina's**: `?stil`, `?schets`, `?zwak`,
  `?debug` en `?zaal`.
- **Nederlandse namen** voor variabelen en functies, en commentaar in het
  Nederlands, in de stijl van `team-ict/raket.js`.
- **Klein blijven.** Geen informatielaag, geen logboek, geen weer of seizoenen,
  geen opslag in de browser.

## Niet in deze stap

Het filmpje (`?film`, de opname en de muziek), een plaats op de voorpagina, en
een eigen getekende tovenaar.
