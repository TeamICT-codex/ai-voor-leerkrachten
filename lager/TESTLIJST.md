# Leerlichtjes testen

## Waar test je?

**Op je eigen laptop.** Start in de projectmap een kleine webserver en open
<http://localhost:8000/lager/> in Chrome of Edge. Via `file://` werkt het niet:
de modules laden dan niet.

```bash
python -m http.server 8000
```

**Op een tablet, Chromebook of digibord in hetzelfde netwerk.** Dezelfde server
is ook bereikbaar voor andere toestellen. Zoek het adres van je laptop
(`ipconfig`, bij "Wi-Fi" staat het IPv4-adres, bijvoorbeeld 192.168.1.37) en
open op het andere toestel `http://<dat-adres>:8000/lager/`.

- Vraagt Windows of Python toegang mag krijgen tot het netwerk: sta het toe voor
  privénetwerken.
- Op het schoolnetwerk lukt dit vaak niet, omdat toestellen elkaar daar niet
  mogen zien. Zet dan een hotspot op met je gsm en verbind beide toestellen
  daarmee.

**Online.** Na een push naar `main` staat alles binnen de minuut op
<https://teamict-codex.github.io/ai-voor-leerkrachten/lager/>. Dat adres is
openbaar, ook al linkt de leeromgeving er nog niet naar.

## Handige toevoegingen aan het adres

| Toevoeging | Wat het doet |
|---|---|
| `?schets` | Doet alsof het toestel geen 3D kan: je ziet een vlakke tekening, de stations werken via het plan onderaan |
| `?stil` | Zonder beweging, zoals bij "minder beweging" in de instellingen van het toestel |
| `?zwak` | Zoals op een traag toestel: minder scherp, eenvoudiger schaduwen en geen lampen 's avonds |
| `?debug` | Voor wie ontwikkelt: `window.dio` in de console |

## Wat kijk je na per toestel?

Noteer per toestel het merk, de browser en wat niet goed ging.

**De wereld**
- [ ] De klas, het dorp en de stad laden binnen een paar seconden, en bewegen vlot.
- [ ] Een gebouw aantikken opent het station. Het label en het plan onderaan ook.
- [ ] Slepen draait het tafereel een beetje, zonder dat de pagina mee scrolt.
- [ ] Avond en Dag wisselen, Volledig scherm werkt (niet op een iPhone: dat kan daar niet).
- [ ] Achteraan de klas: zijn de labels en de knoppen leesbaar?

**De stations**
- [ ] De voorleesknop verschijnt en leest voor met de ingelezen stem. Is ze verstaanbaar achteraan de klas? Klinkt ze Vlaams?
- [ ] De knop "Stem" bovenaan (te zien zolang er geen station open is) wisselt tussen juf en meester. Wat er klinkt, stopt meteen. Na herladen staat dezelfde stem nog.
- [ ] 1ste graad: met "Lees mee" aan klinkt een kaartje meteen zodra je erop tikt, ook het eerste. Een klik op "Lees voor" terwijl er nog een kaartje klinkt, begint te lezen (en stopt niet alleen).
- [ ] Chromebook zonder Nederlandse stem in de browser: de voorleesknop en "Lees mee" verschijnen toch, en lezen voor met de juf of de meester.
- [ ] Vangnet, op je eigen laptop: hernoem `lager/stem/lijst.json` even en herlaad. Met een Nederlandse browserstem lezen de knoppen dan zo voor, en de knop "Stem" verdwijnt. Zonder Nederlandse stem verdwijnen ook de voorleesknoppen. Zet het bestand daarna terug.
- [ ] Bibliotheek: tekenen met de vinger of de pen op het digibord gaat vlot, en het venster scrolt niet mee terwijl je tekent.
- [ ] Fotowinkel en museum: de verschillen en foutjes zijn aan te tikken, ook met een dikke vinger.
- [ ] Bouwhoek: kan een kind van 6 zelf een stuk speelgoed en dan een bak aantikken?
- [ ] School: het verhaal van de oefenrobot verschijnt woord per woord.
- [ ] Na de opdracht kan de stempel, er komt een vlag in de wereld, en het paspoort toont hem.
- [ ] "Nieuwe klas" wist de stempels van die graad, en alleen die.

**Afdrukken**
- [ ] Het paspoort past op één blad, zonder knoppen of kop.
- [ ] De handleiding is leesbaar op papier.

**In de klas**
- [ ] Hoe lang duurt elk station echt? Klopt het lesverloop van 2 keer 50 minuten?
- [ ] Welke opdracht snappen de kinderen niet meteen? Welke vonden ze het leukst?
