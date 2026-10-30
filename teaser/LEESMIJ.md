# De teaser

Een filmpje van een halve minuut om "AI op school" voor te stellen: een vlucht
langs de school op de voorpagina, met titels in de huisstijl en een eigen
muziekje. Het filmpje wordt niet gemonteerd. De voorpagina speelt de film zelf
af, en een klein script neemt die beeld per beeld op.

## Opnieuw maken

Nodig: Python 3 met numpy, en ffmpeg. Staat ffmpeg niet op de computer, dan
brengt `pip install imageio-ffmpeg` er een mee. `opname.py` vindt hem zelf.

1. Start de opnameserver vanuit de repo-root: `python teaser/opname.py`. In de
   desktop-app van Claude kan het ook via de configuratie `teaser-opname`.
2. Open <http://127.0.0.1:8010/?film&opname> in Chrome en laat het tabblad
   vooraan open staan. Op de achtergrond remt de browser het af. Linksonder
   telt het de beelden af: 900 voor dertig seconden. Gebruik 127.0.0.1 en
   niet localhost: de browser probeert localhost eerst via IPv6, en daar
   luistert de server niet.
3. Na het laatste beeld rekent de server de muziek uit en maakt hij
   `teaser/uit/ai-op-school-teaser.mp4`: 1920 × 1080, 30 beelden per seconde,
   H.264 met AAC-geluid. Dat formaat speelt overal en mag op sociale media.

Andere formaten: `?film=vierkant&opname` (1080 × 1080) en `?film=staand&opname`
(1080 × 1920, voor verhalen op een gsm). De camera past zich vanzelf aan.

## Eerst bekijken

- `http://localhost:8000/?film` speelt de film af in de gewone voorvertoning
  (`python test/server.py`).
- `&t=12` begint op seconde 12.
- `&stil-beeld&t=12` toont enkel het beeld op seconde 12, om rustig te bekijken.

## Wat waar staat

```
voorpagina/film.js   de film: shots, titels, het weer en de seizoenen, de eindkaart
voorpagina/sfeer.js  de hemel, de tijdreis en de sleutelwaarden (gedeeld met de zaalmodus)
teaser/opname.py     serveert de site, ontvangt de beelden en roept ffmpeg aan
teaser/muziek.py     het muziekje, met numpy berekend
teaser/uit/          het resultaat; de losse beelden en de wav staan niet in git
```

Het adres op de eindkaart staat in `ADRES`, bovenaan `film.js`. Verandert het
adres bij de lancering, pas het daar aan en neem opnieuw op. Een titel aanpassen
doe je in `TITELS` in `film.js`. Elk shot duurt twee maten
van de muziek (4,5 seconden). Verschuif je een shot, verschuif dan ook de
titel, want het belletje in de muziek valt op elke wissel.

## Waarom zo

- **Geen montage nodig.** Wie de film wil aanpassen, verandert een tekst of een
  tijdstip in `film.js` en neemt opnieuw op. Er is geen montageprogramma nodig.
- **Elk beeld op een vast moment.** De film rekent elk beeld uit op zijn eigen
  tijdstip, los van de klok. Op een trage computer duurt de opname langer, maar
  de film hapert niet.
- **Geen muziek van iemand anders.** Het deuntje wordt berekend uit sinussen
  en ruis, zonder sample of opname. Er zit dus geen auteursrecht van derden op.
- **Geen herkenbare mensen.** De figuurtjes in het tafereel hebben bewust geen
  gezicht, net als op de voorpagina.
