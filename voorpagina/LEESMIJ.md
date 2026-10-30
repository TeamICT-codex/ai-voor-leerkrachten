# De voorpagina met het poppenhuis

De voorpagina van de site: `index.html` in de repo-root, met haar stijl en
scripts in deze map. De leeromgeving zelf staat in `leeromgeving/`. Oude links
naar `…/#/module/…` of naar een gedeelde sessie komen nog altijd hier binnen;
een klein script bovenaan `index.html` stuurt ze door naar dezelfde plek in de
leeromgeving. Het tafereel is een
school als poppenhuis: de directie boven, een klas in het midden, de leerling
beneden. Een geel lichtje, de AI-assistent, vliegt van verdieping naar
verdieping. Daar typt zich een prompt en bouwt het antwoord zich op: een
beleid op één A4, een les over de waterkringloop die als minitafereel op tafel
verschijnt, een GIP-planning met post-its aan de muur. Scrol je naar een
doelgroep, dan zakt de camera naar die verdieping.

Wat je ermee kunt doen:

- **Bolletjes aanklikken.** 24 voorwerpen hebben een bolletje: het beleidsbord,
  de boekenkast, de laptop van de leerkracht, het prikbord met de casussen, de
  zitzak in de leeshoek, het lichtje zelf... Een klik opent een kaartje met
  uitleg en een link naar de module of les. Met Vorige en Volgende loop je de
  verdieping rond; op het einde ga je door naar de volgende. Je kunt ook
  rechtstreeks op het voorwerp klikken. De camera zoomt in en het voorwerp
  licht op.
- **Slepen** (of op de gsm opzij vegen) draait de school. Ze veert na een paar
  seconden terug.
- **De avondknop** doet het licht in de lokalen aan, met sterren en een maan.
- **Kleine verrassingen:** de leerling op de speelplaats springt en zwaait als
  je erop klikt, een boom wiebelt, het lichtje maakt een sprongetje.
- **Zaalmodus:** met de pijltjestoetsen ga je door de kaartjes, groot genoeg
  voor een beamer. Escape sluit eerst het kaartje en daarna de zaalmodus.

## Bekijken

Vanuit de repo-root: `python test/server.py`, daarna
<http://localhost:8000/>.

Om te testen kun je achter het adres zetten:

| Parameter | Wat het doet |
|---|---|
| `?zaal` | zaalmodus voor de beamer (kan ook via de knop onderaan) |
| `?stil` | doet alsof je toestel om minder beweging vraagt: het tafereel staat af en stil |
| `?schets` | doet alsof je toestel geen 3D kan: je ziet de vlakke schets |
| `?zwak` | gedraagt zich zoals op een traag toestel: minder pixels, kleinere schaduwen |
| `?debug` | zet `window.dio` klaar, met `dio._test.spoel(sec)` en `dio._test.meet()` |

## Bestanden

```
index.html           de pagina; de tekst en de knoppen staan er meteen, zonder 3D
startpagina.css      de huisstijl van Het leercollectief: Poppins, groen en mint
startpagina.js       laadt het tafereel pas na de pagina, koppelt de camera aan het scrollen
diorama.js           het tafereel zelf: de school en het basisschooltje van Leerlichtjes
plekken.js           de teksten van de kaartjes, met hun link
logo-leercollectief.svg

De motor, three.js en Poppins staan in ../gedeeld/: die delen de voorpagina
en de werelden van Leerlichtjes (zie ../../lager/LEESMIJ.md).
```

## Waarom het zo gebouwd is

- **Geen externe verbindingen.** three.js en Poppins staan in de map zelf. De
  belofte dat de site niets naar een andere server stuurt, blijft zo kloppen.
- **Licht om te laden.** De 3D-bundel weegt gezipt 140 kB, de eigen code 37 kB.
  Alles in het tafereel wordt in code gemaakt; er zijn geen 3D-bestanden. De pagina toont
  eerst de tekst en een vlakke schets, en haalt de 3D-code pas op als de rest
  er staat.
- **Valt netjes terug.** Geen WebGL2: de schets blijft. Databesparing aan: de
  schets, met een knop om het tafereel toch te laden. Minder beweging gevraagd:
  het tafereel staat af en stil.
- **Spaart de batterij.** Het tafereel pauzeert buiten beeld en in een tabblad op
  de achtergrond. Hapert het beeld, dan gaat eerst de resolutie omlaag en pas
  daarna gaan de schaduwen uit.
- **Bereikbaar zonder muis.** Het canvas is decoratief. De drie labels bij de
  verdiepingen zijn gewone knoppen, en alles wat het tafereel vertelt, staat ook
  in de tekst.

## De bundel van three.js opnieuw maken

`gedeeld/three-ingang.js` somt op wat de tafereels van three.js gebruiken. Gebruik
je in `diorama.js` iets nieuws uit three.js, zet het daar dan bij en bouw opnieuw
(in een lege map, buiten de repo):

```bash
npm init -y && npm i three@0.186.1 esbuild@0.25.10
cp <repo>/gedeeld/three-ingang.js ingang.js
npx esbuild ingang.js --bundle --minify --format=esm --legal-comments=eof --outfile=<repo>/gedeeld/three-diorama.min.js
```

## Gemeten

Op de laptop van de ontwikkelaar: ongeveer 3 ms per beeld, met zo'n 270
tekenbeurten. Alles wat stilstaat, wordt bij het opbouwen samengevoegd tot één
vorm per verdieping, met de kleur in de vorm zelf (`voegSamen` in gedeeld/diorama-kern.js).
Wat beweegt of oplicht, blijft apart: markeer zoiets met `levend()`. Zonder dat
samenvoegen waren het er bijna het dubbele.

## Een plek toevoegen

1. In `diorama.js`: zet het voorwerp in een eigen groepje en geef het door aan
   `plek('id', 'kamer', groepje)`. De kamer is `buiten`, `directie`, `klas` of
   `leerling`.
2. In `plekken.js`: een object met dezelfde id, een titel, een tekst en een link.
3. Klopt een id niet, dan meldt de console het bij het laden.

## Nog te doen

- Testen op een echte iPhone, een school-Chromebook en een beamer.
- De tekst nakijken, ook die van de 24 kaartjes. De beweringen over de
  leeromgeving zijn nagegaan in `js/cursus.js` en `leerlingen-bron/`, maar nog
  niet door een tweede lezer.
- De naam "AI-wijs op school" en het logo staan nog op de nakijklijst van de
  leerlingencursus.
