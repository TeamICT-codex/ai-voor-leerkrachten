# De voorleesstem van Leerlichtjes

Alles wat een wereld voorleest, is vooraf ingelezen met twee AI-stemmen van
Gemini (Google): een **juf** en een **meester**. De werelden spelen gewone
mp3's af uit deze map. Tijdens de les gaat er dus niets naar een AI-dienst. Met
de knop "Stem" bovenaan een wereld kies je wie voorleest.

Staat een tekst niet in `lijst.json`, of lukt het afspelen niet, dan leest de
stem van de browser voor (een Nederlandse stem, liefst een Vlaamse). Dat is
alleen een vangnet: op een Chromebook is die stem vaak robotachtig, of er is er
geen.

## Wat hier staat

```
stem/
  verzamel.mjs   zoekt alle teksten die voorgelezen kunnen worden → teksten.json
  gemini.py      leest in wat ontbreekt, kijkt elke opname na → juf/, meester/, lijst.json, controle.json
  naloop.mjs     speelt elke opdracht na zonder browser: heeft elk pad een opname?
  teksten.json   elke tekst, letterlijk zoals hij voorgelezen wordt
  lijst.json     voor de werelden: welke tekst bij welk bestand hoort
  controle.json  het controlerapport (zie onder)
  juf/           de opnames van de juf (Gemini-stem Sulafat)
  meester/       de opnames van de meester (Gemini-stem Achird)
```

Elk bestand heet naar zijn tekst: de eerste 12 tekens van de SHA-1 van de
tekst. Verandert er één letter of één leesteken, dan is het een andere tekst en
dus een nieuwe opname.

## Na een tekstwijziging opnieuw inlezen

Verander je een tekst die voorgelezen wordt (een zin bij Ontdek of Praat samen,
een kaartje, een antwoord, een zin van het lichtje), doe dan in de projectmap:

```bash
node lager/stem/verzamel.mjs
python lager/stem/gemini.py alles
```

Het eerste maakt `teksten.json` opnieuw. Het tweede leest per stem alleen in wat
ontbreekt, ruimt opnames op van teksten die niet meer bestaan, en schrijft
`lijst.json` en `controle.json`. Commit daarna alles in `lager/stem/` samen met
je tekstwijziging. Vergeet je het, dan werkt alles nog, maar leest de
browserstem die ene zin voor.

Wil je eerst proberen? `python lager/stem/gemini.py alles 3` leest alleen de
eerste drie teksten van de lijst in. Een volgende keer `alles` gaat verder waar
het stopte: wat al bestaat, slaat het over. Dat geldt ook als het onderweg
stopt, bijvoorbeeld omdat Gemini te veel verzoeken kreeg.

Elke opname kost een beetje geld op de rekening van de sleutel. Daarom leest
het script niets dubbel in, en hoogstens drie keer per tekst.

Nodig: Node, Python 3, en ffmpeg (op het pad, of `pip install imageio-ffmpeg`).

Ga daarna na dat elke opdracht alleen opnames afspeelt:

```bash
node lager/stem/naloop.mjs . naloop-uit.json lager/stem/lijst.json
```

De laatste regel moet eindigen op "0 naar de browserstem". Gooi
`naloop-uit.json` daarna weg; het is enkel het verslag van die naloop.

## De sleutel

Het script zoekt een sleutel voor de Gemini-API in de omgevingsvariabele
`GEMINI_API_KEY`. Op Windows leest het hem ook rechtstreeks uit je
gebruikersinstellingen, zodat je na het instellen niet hoeft te herstarten.

Zo stel je hem in op Windows: zoek in het startmenu "omgevingsvariabelen voor
je account bewerken", kies Nieuw, naam `GEMINI_API_KEY`, en plak de sleutel als
waarde. Zet de sleutel nooit in een bestand in de repo, in een commit of in een
commando: wat je typt, blijft in de geschiedenis van je terminal staan. Het
script toont of bewaart de sleutel nooit, ook niet in een foutmelding.

## Waarom deze stemmen en dit model

- **Model `gemini-2.5-pro-preview-tts`.** Op 30 oktober 2026 getest: de nieuwere
  voorleesmodellen lazen de regieaanwijzing mee voor, dit niet. Welke modellen er
  nu zijn, toont `python lager/stem/gemini.py modellen`.
- **Een regieaanwijzing voor de tekst** (`STIJL` in `gemini.py`): een warme,
  rustige Vlaamse tongval, zoals een vriendelijke juf in het lager, en "AI" als
  de Nederlandse letters "aa ie". In het Engels werkte die aanwijzing beter dan
  in het Nederlands.
- **Sulafat als juf en Achird als meester**, gekozen na een proef met vier
  warme, rustige stemmen (`python lager/stem/gemini.py proef <map>` maakt die
  proefopnames opnieuw). Google geeft zijn stemmen namen van sterren.
- **mp3, mono, 24 kHz, 40 kbit/s.** Genoeg voor een stem, en licht genoeg voor
  een schoolnetwerk en voor de repo. De stilte vooraan en achteraan gaat eraf,
  en elke opname is even luid.

Verander je het model, de aanwijzing of een stem, wis dan `juf/` of `meester/`
en lees opnieuw in: anders klinken oude en nieuwe opnames door elkaar.

## Het controlerapport

Na het inlezen laat het script elke opname uitschrijven door een tweede model
(`gemini-3.8-flash`) en vergelijkt het die tekst woord voor woord met wat er
had moeten klinken. Ontbreekt er een woord, of kwam er iets bij (zoals een
voorgelezen regieaanwijzing), dan leest het opnieuw in, tot drie keer. Het
houdt de beste poging.

In `controle.json` staan:

- **nakijken**: de opnames die ook na drie pogingen afwijken. Beluister die even.
  Vaak is er niets mis: het uitschrift schrijft een getal anders ("één" voor
  "1") of hoort een woord net anders. Hoor je toch een fout, wis dan dat
  bestand en draai `alles` opnieuw.
- **tongval**: hoe vaak het tweede model een opname Vlaams, Nederlands of
  onzeker vond. Bij korte zinnen gokt het vaak, daarom lezen we daarvoor niet
  opnieuw in.
- **alle**: het uitschrift en de score van elke opname.

## Voor wie verder bouwt

- De werelden spelen af via `lager/stem.js` (`zeg`, `stop`, `laadVooraf`,
  `kiesStem`). Die zoekt elke tekst op in `lijst.json`.
- `verzamel.mjs` leest de stations van elke graad in node, en maakt de teksten
  met dezelfde functies als de werelden: `voorleesTekst()` voor de knop "Lees
  voor", en de lijst `zinnen` van een station voor "Lees mee". Een nieuwe
  opdracht die voorleest, geeft haar station zo'n lijst. Daarom mogen
  `stations.js`, `activiteiten.js` en `stem.js` bij het laden de pagina niet
  aanraken (`document`, `window`).
- Zie je in de console "deze tekst is nog niet ingelezen", dan ontbreekt die
  tekst in `lijst.json`: verzamel en lees opnieuw in.
