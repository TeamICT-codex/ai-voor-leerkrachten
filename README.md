# AI voor leerkrachten

Digitale leeromgeving én workshopmateriaal om leerkrachten lager en secundair
onderwijs te leren werken met AI. Gemaakt voor deelnemers die nog nooit met
ChatGPT of Claude werkten.

**De leeromgeving staat online: <https://teamict-codex.github.io/ai-voor-leerkrachten/>**

De omgeving dient twee doelen tegelijk:

- **Voor de deelnemer** — de inhoud om tijdens en na de workshop door te nemen,
  met kopieerbare prompts, doe-opdrachten en quizvragen.
- **Voor de begeleider** — draaiboeken met timing, begeleiderstips, valkuilen
  en een sessietimer. Zet **begeleidersmodus** aan (rechtsboven).

## Opzet

Drie sporen. **Het kader** komt eerst: het legt uit wat mag en wat niet, en wie
wat beslist. Daarna de twee praktijksporen.

Zes workshops van elk **drie uur inclusief pauze**, verdeeld over twee sporen.

| Spoor | Workshop | Inhoud | Tool |
|---|---|---|---|
| C — Het kader | *geen workshop* | Privacywetgeving, de Europese AI-verordening, auteursrecht, leerlingdata van minderjarigen en personeelsgegevens | leerkracht en directie |
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
| `#/sessie` | Stel zelf een sessie samen uit losse onderdelen | begeleider |
| `leerlingen/` | AI-wijs op school: de aparte cursus voor leerlingen (geen hash-route, eigen site) | leerling |

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
vuistregels, alle prompts en opdrachten van de sessie, in A3 ook de casussen,
een lijstje om verder te lezen en notitieruimte. Verdiepingslessen blijven
eruit: die kwamen in die drie uur niet aan bod.

## Zelf een sessie samenstellen

Je hebt zelden drie uur. Voor een uur op een personeelsvergadering, veertig
minuten op een vakwerkgroep of een halve studiedag staat er een **sessiebouwer**
op `#/sessie` (begeleidersmodus aan). Je kiest onderdelen in de volgorde waarin
je ze geeft — een blok uit een bestaand draaiboek, een hele module, of een
generiek blok zoals een onthaal, een pauze, eigen inbreng, een vragenronde of
een afronding — en je zet elk onderdeel korter of langer. De app telt mee
terwijl je kiest, rekent daarna de kloktijden uit vanaf je startuur en maakt
een deelnemersbundel met enkel de prompts, opdrachten en casussen van wat je
echt deed. Vijf sjablonen (50 tot 120 minuten) geven je een startpunt.

**Je sessie zit volledig in de link**, er is geen server die ze bijhoudt. Dat is
handig — mail hem naar je co-begeleider, hang hem aan de agenda-afspraak — maar
sluit je het tabblad zonder de link te bewaren, dan ben je je sessie kwijt.
Verwijst een oude link naar een onderdeel dat niet meer bestaat, dan meldt de
pagina dat en toont ze de rest gewoon.

Hoe je zo'n korte sessie opbouwt zonder dat ze een brokstuk wordt, staat in de
begeleidersgids onder *Een kortere sessie geven*.

## Zelfstudie

Alles is ook te doen zonder begeleider. Elke les draagt haar eigen duurtijd, dus
je ziet vooraf hoeveel tijd een module kost. Begin bij spoor **C — Het kader**,
doe daarna de modules van spoor A of B in volgorde, en vink af wat je gehad
hebt. De casussenmodule werkt solo even goed als in groep: beslis eerst zelf,
klik dan pas het oordeel open.

## Voor leerlingen: AI-wijs op school

Naast dit materiaal voor leerkrachten bevat de repo een aparte cursus voor
**leerlingen van de tweede en derde graad**: *AI-wijs op school*, negen
hoofdstukken en 72 lessen met prompts, opdrachten, hoofdstukquizzen en een
certificaat, in de huisstijl van GO! scholengroep Het leercollectief en met
voorbeelden uit de eigen scholen. Ze staat live op
<https://teamict-codex.github.io/ai-voor-leerkrachten/leerlingen/> en werkt
zonder account.

De module **De leerlingencursus in je klas** (spoor A) is de handleiding voor
de leerkracht: wat erin zit, vier manieren om ze in te zetten, en hoe je
afspraken en opvolging erop afstemt.

- `leerlingen/` is gegenereerd; bewerk het niet met de hand.
- `leerlingen-bron/` bevat de Markdown-lessen, de generator en de docs. Bouwen:
  `cd leerlingen-bron && npm install && npm run build` (en `npm run check`
  voor de inhoudscontrole). Zie `leerlingen-bron/README.md`.

## Lokaal draaien

Geen build-stap en geen afhankelijkheden, maar de app gebruikt ES-modules —
die laden niet via `file://`. Start dus een kleine server:

```bash
python3 -m http.server 8000
```

Daarna surf je naar <http://localhost:8000>.

Je hebt dat enkel nodig om aan de inhoud te werken. Wie de omgeving gewoon wil
gebruiken, surft naar de link hierboven — die volgt automatisch elke wijziging
die naar `main` gaat.

## Structuur

```
index.html            de volledige pagina-omhulling
css/style.css         alle styling, mobiel-eerst, met afdrukblok onderaan
js/inhoud-beleid.js   spoor C — het kader: wet, privacy en schoolbeleid
js/inhoud.js          spoor A — inhoud (ChatGPT én Claude)
js/casussen.js        spoor A — de casussenmodule (groepswerk in A3)
js/inhoud-vibe.js     spoor B — inhoud (vibe coden, Claude)
js/workshops.js       de zes draaiboeken + de sporen
js/sessies.js         bouwstenen en sjablonen voor een zelf samengestelde sessie
js/gids.js            begeleidersgids: begeleidingsadvies en de lastige vragen
js/cursus.js          voegt de sporen samen, kloktijden, blokken verzamelen
js/app.js             router, weergave, sessietimer, voortgang
assets/favicon.svg
leerlingen/           AI-wijs op school, de cursus voor leerlingen (gegenereerd)
leerlingen-bron/      bron van die cursus: Markdown-lessen, generator, docs
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
| `casus` | Situatie om te beoordelen, alleen of in groep; deze blokken staan in `js/casussen.js`. Het oordeel blijft verborgen tot de lezer klikt, en de gespreksvraag komt pas mee met dat oordeel. |

Een blok toevoegen vraagt dus geen code — enkel een object in de juiste les.
Wil je een nieuw blok-*type*, dan voeg je een `case` toe in
`toonInhoudsblok()` in `js/app.js` plus de bijbehorende styling.

Een workshopblok verwijst via `module: '<module-id>'` naar de inhoud, zodat de
deelnemer vanuit het draaiboek kan doorklikken.

Let op bij het bijwerken van een draaiboek: de som van de blokken moet 180
minuten blijven.

## Het kader

Spoor C staat los van de workshops: het is leesstof voor wie wil weten wat er
mag, en voor wie afspraken maakt voor de hele school. Drie modules — het kader
in het kort, de wet in mensentaal, en een module voor directies over leerlingdata
van minderjarigen, personeelsgegevens en het opbouwen van een afsprakenkader.
Het is geen juridisch advies: bij echte twijfel gaat het naar de DPO van de
scholengroep.

## Verdiepingslessen

Een workshop duurt drie uur, en dat is een harde grens. Wat daar niet in past
maar wel de moeite is, staat als **verdiepingsles** in de leeromgeving: herkenbaar
aan het etiket bij de lestitel. Er zijn er tien. Negen in spoor B — beeld en
downloads, grotere projecten, AI als tester, een echte database, een
projectgeheugen, je app op de telefoon, beeld en spraak, en een volledig
uitgewerkt voorbeeldproject — en één in spoor C, voor wie dat kader zelf aan
collega's wil geven.

Ze staan op de promptkaart en je kan ze gewoon doornemen, maar ze komen **niet**
in de deelnemersbundel: die hand-out hoort te kloppen met wat er die dag gebeurde.
In de data zet je daarvoor `verdieping: true` op de les.

## Voortgang

Afgevinkte lessen en je instellingen blijven in de browser van de gebruiker
bewaard (`localStorage`). Er wordt niets verstuurd en er is geen server nodig.
In een privévenster of met geblokkeerde cookies werkt de app gewoon door,
alleen wordt er dan niets onthouden.
