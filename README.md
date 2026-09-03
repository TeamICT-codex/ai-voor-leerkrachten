# AI voor leerkrachten

Digitale leeromgeving én workshopmateriaal om leerkrachten lager en secundair
onderwijs te leren werken met AI. Gemaakt voor deelnemers die nog nooit met
ChatGPT of Claude werkten.

De omgeving dient twee doelen tegelijk:

- **Voor de deelnemer** — de inhoud om tijdens en na de workshop door te nemen,
  met kopieerbare prompts, doe-opdrachten en quizvragen.
- **Voor de begeleider** — draaiboeken met timing, begeleiderstips, valkuilen
  en een sessietimer. Zet **begeleidersmodus** aan (rechtsboven).

## Opzet

Zes workshops van elk **drie uur inclusief pauze**, verdeeld over twee sporen.

| Spoor | Workshop | Inhoud | Tool |
|---|---|---|---|
| A — AI in de klas | **A1** AI leren kennen | Eerste gesprek + goede opdrachten geven | ChatGPT of Claude |
| | **A2** Lesmateriaal maken | Lesopbouw, differentiatie, toetsen, feedback | ChatGPT of Claude |
| | **A3** Veilig, ethisch en met leerlingen | Privacy, betrouwbaarheid, AI-geletterdheid | ChatGPT of Claude |
| B — Vibe coden | **B1** Basis | Van onderwijsprobleem naar werkende webapp | Claude |
| | **B2** Verdieping | Gegevens, leerlingdata, versiebeheer, publiceren | Claude |
| | **B3** AI in je eigen tool | AI-functies, modelkeuze, kosten, veiligheid | Claude |

Spoor A is bewust **tool-neutraal**: onze scholen gebruiken zowel ChatGPT als
Claude, en de vaardigheden zijn identiek. Waar het echt verschilt, staat een
blauw *tool*-kader. Spoor B werkt wél met Claude, omdat dat wat het bouwt
meteen als werkende pagina toont — dat scheelt in een zaal vol beginners.

De belangrijkste praktische voorwaarde: elke deelnemer heeft vóór de sessie een
werkend account bij de assistent uit de tabel hierboven, getest op het
schoolnetwerk. Regel dat samen met de ICT-coördinator — ter plaatse kost het je
makkelijk een half uur van je sessie. Voorziet de school of scholengroep een
schoolaccount, gebruik dan dat en niet je privéaccount: het bepaalt mee wat er
met je gesprekken gebeurt. Voor B2 komt daar een GitHub-account bij, voor B3 een
account met betaalmogelijkheid — spreek vooraf af wie dat betaalt.

Spoor B is inhoudelijk geïnspireerd op
[vibecodenvoordocenten.vercel.app](https://vibecodenvoordocenten.vercel.app/),
hertaald naar Vlaamse context (leerplandoelen en eindtermen, GDPR via de DPO
van de scholengroep, Smartschool, KlasCement, terminologie lager/secundair).

## Pagina's

| Route | Wat | Voor wie |
|---|---|---|
| `#/` | Overzicht van beide sporen en alle workshops | iedereen |
| `#/module/<id>` | De inhoud: uitleg, prompts, opdrachten, quizvragen, casussen | deelnemer |
| `#/workshop/<id>` | Het draaiboek met kloktijden | begeleider |
| `#/bundel/<id>` | Afdrukbare deelnemersbundel per workshop | deelnemer |
| `#/prompts` | Promptkaart — alle promptvoorbeelden op één plek | iedereen |
| `#/gids` | Begeleidersgids: voorbereiding, de zaal lezen, lastige vragen | begeleider |

De begeleidersgids is enkel toegankelijk met begeleidersmodus aan. De casussen
in module *Casussen: mag dit?* houden hun oordeel verborgen tot je erop klikt —
anders leest de groep gewoon het antwoord en valt het gesprek weg.

## Draaiboeken

Elk draaiboek bevat enkel duurtijden; de app rekent de kloktijden zelf uit
vanaf het startuur dat je bovenaan instelt. Hetzelfde draaiboek werkt dus voor
een pedagogische studiedag om 9u en voor een namiddagsessie om 13u30.

In begeleidersmodus krijg je bovendien:

- **Start sessie** — markeert live welk blok bezig is en hoeveel minuten er nog
  resten.
- **Draaiboek afdrukken** — een papieren versie, begeleiderstips inbegrepen.
- **Vooraf klaarzetten** — wat je vóór de sessie geregeld moet hebben.
- **Valkuilen** — wat er in de praktijk misloopt bij deze sessie.

De **deelnemersbundel** staat los van de begeleidersmodus: iedereen kan hem
vanaf het draaiboek openen en afdrukken — een hand-out met de doelen, de
vuistregels, alle prompts en opdrachten van de sessie, een lijstje om verder te
lezen en notitieruimte.

## Lokaal draaien

Geen build-stap en geen afhankelijkheden, maar de app gebruikt ES-modules —
die laden niet via `file://`. Start dus een kleine server:

```bash
python3 -m http.server 8000
```

Daarna surf je naar <http://localhost:8000>.

## Structuur

```
index.html            de volledige pagina-omhulling
css/style.css         alle styling, mobiel-eerst, met afdrukblok onderaan
js/inhoud.js          spoor A — inhoud (ChatGPT én Claude)
js/casussen.js        spoor A — de casussenmodule (groepswerk in A3)
js/inhoud-vibe.js     spoor B — inhoud (vibe coden, Claude)
js/workshops.js       de zes draaiboeken + de sporen
js/gids.js            begeleidersgids: begeleidingsadvies en de lastige vragen
js/cursus.js          voegt de sporen samen, kloktijden, blokken verzamelen
js/app.js             router, weergave, sessietimer, voortgang
assets/favicon.svg
```

## Inhoud aanpassen of uitbreiden

Alle tekst zit in `js/inhoud.js`, `js/casussen.js` en `js/inhoud-vibe.js` als
gewone data; de begeleidersgids en de lastige vragen zitten in `js/gids.js`. Een
les bestaat uit blokken; de renderer kent deze types:

| Type | Waarvoor |
|---|---|
| `tekst` | Een paragraaf. Mag `<strong>`, `<em>` en `<code>` bevatten. |
| `lijst` | Opsomming; `geordend: true` maakt er een genummerde lijst van. |
| `kader` | Uitgelicht kadertje. Varianten: `tip`, `letop`, `privacy`, `weetje`, `tool`. |
| `prompt` | Kopieerbaar promptvoorbeeld met uitleg eronder. |
| `vergelijk` | Zwakke versus sterke prompt naast elkaar. |
| `opdracht` | Doe-opdracht met genummerde stappen. |
| `quiz` | Meerkeuzevraag met feedback per antwoord. |
| `casus` | Situatie om in groep te beoordelen; deze blokken staan in `js/casussen.js`. Het oordeel blijft verborgen tot de lezer klikt; de gespreksvraag verschijnt enkel in begeleidersmodus. |

Een blok toevoegen vraagt dus geen code — enkel een object in de juiste les.
Wil je een nieuw blok-*type*, dan voeg je een `case` toe in
`toonInhoudsblok()` in `js/app.js` plus de bijbehorende styling.

Een workshopblok verwijst via `module: '<module-id>'` naar de inhoud, zodat de
deelnemer vanuit het draaiboek kan doorklikken.

Let op bij het bijwerken van een draaiboek: de som van de blokken moet 180
minuten blijven.

## Voortgang

Afgevinkte lessen en je instellingen blijven in de browser van de gebruiker
bewaard (`localStorage`). Er wordt niets verstuurd en er is geen server nodig.
In een privévenster of met geblokkeerde cookies werkt de app gewoon door,
alleen wordt er dan niets onthouden.
