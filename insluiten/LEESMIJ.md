# De strook voor de startpagina van een school

Een smalle, levende strook die "AI op school" laat opvallen op de startpagina
waar leerkrachten elke dag binnenkomen. Ze toont een getekende school die
meekleurt met het uur en het seizoen in Dendermonde, en elke dag een andere
tip. De kop en de knop openen de voorpagina, waar iedereen zijn eigen ingang
kiest (directie, leerkracht, leerling, lager). De tip opent rechtstreeks één
stuk. Alles opent in een nieuw tabblad.

## Insluiten

Voeg op de startpagina één ingesloten blok toe met het adres
`https://ai.hetleercollectief.be/insluiten/strook.html`, over de volle breedte
en 190 pixels hoog. In Google
Sites: Invoegen, Insluiten, het adres plakken, en het blok even hoog slepen.
Nog niet geprobeerd in een echte Google Sites-pagina.

Zet `?voor=lager` of `?voor=secundair` achter het adres: dan kiest de strook
ook tips over het aanbod voor de leerlingen van dat niveau (Leerlichtjes, of
AI-wijs Start en AI-wijs op school). De rol van wie kijkt, kent de strook niet,
en dat blijft zo: ze weet alleen wat de startpagina haar meegeeft.

Verandert het adres van de site nog, dan verandert dit adres mee: pas het dan
op elke startpagina één keer aan.

## Bestanden

```
strook.html     de strook zelf: de tekening en de stijl
strook.js       het uur, het seizoen, wat er valt, en de tip van vandaag
voorbeeld.html  een nagemaakte startpagina om de strook in te tonen
```

## Aanpassen

- **De tips** staan in `ALGEMEEN` en `TIPS` in `strook.js`: een zin van
  hoogstens twaalf woorden, en een bestaande module of pagina. Elke dag schuift
  de strook één tip op.
- **De kop en het etiket** staan in `strook.html`.
- **Proberen:** `?uur=21`, `?seizoen=3.5` (0 tot 4, zie `voorpagina/sfeer.js`)
  en `?tip=2` achter het adres.

## Waarom zo

- **Licht.** Een startpagina opent elke ochtend op elk toestel. Daarom één
  getekende school en een klein script, geen 3D.
- **Geen externe verbindingen.** Het uur en het seizoen rekent
  `voorpagina/sfeer.js` zelf uit. De strook haalt het weer niet op: dat doet
  alleen de zaalmodus van de voorpagina.
- **Elke dag anders.** Wat altijd hetzelfde toont, valt na een week niet meer op.
- **Minder beweging gevraagd:** dan staat de strook stil en valt er niets.
