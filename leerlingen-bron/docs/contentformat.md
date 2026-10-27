# Contentformat · hoe een les en een quiz eruitzien

De site wordt gebouwd uit gewone tekstbestanden in `content/`. De generator (`build/build.mjs`) zet ze om in statische HTML. Je hoeft de generator niet te kennen om een les te schrijven; je houdt je aan dit format.

## Mappen

```
content/
  h1-slim-starten-met-ai/
    hoofdstuk.json
    01-welkom.md
    02-waarom-ai-leren.md
    ...
    09-quiz.md
    quiz.json
  h2-prompten-en-samenwerken/
    ...
```

- De volgorde van lessen volgt het nummer vooraan in de bestandsnaam.
- De slug in de URL is de bestandsnaam zonder nummer en zonder `.md`: `02-waarom-ai-leren.md` wordt `/h1-slim-starten-met-ai/waarom-ai-leren.html`.
- Bestandsnamen: kleine letters, cijfers, koppeltekens. Geen accenten.

## hoofdstuk.json

Dit bestand staat al klaar per hoofdstuk. Je past het niet aan, tenzij de brief dat vraagt.

```json
{
  "nummer": 1,
  "titel": "AI begrijpen en slim starten",
  "intro": "Begrijp wat AI is, leer goed samenwerken en houd zelf de regie.",
  "stap": 1,
  "domein": "omgaan",
  "route": false
}
```

`domein` is een van: `omgaan`, `creeren`, `beheren`, `ontwerpen`. `route: true` betekent dat de leerling dit hoofdstuk kan aan- of afvinken in de eigen route (stap 2).

## Een les (`NN-slug.md`)

Een les begint met YAML-frontmatter tussen `---`, gevolgd door de body in Markdown.

```markdown
---
title: Waarom zou je AI leren gebruiken?
intro: Leren voor een toets, je taak afkrijgen of iets maken voor school. Zo helpt AI je daar echt bij.
duur: 8
doelen:
  - Je kunt drie situaties noemen waarin AI je schoolwerk makkelijker maakt.
  - Je weet waarom AI-geletterdheid in Vlaanderen een basisvaardigheid wordt.
---

Eerste alinea van de body ...
```

Frontmatter-velden:

| Veld | Verplicht | Betekenis |
|---|---|---|
| `title` | ja | Titel van de les, zonder nummer. |
| `intro` | ja | Eén of twee zinnen onder de titel. |
| `duur` | ja | Minuten, geheel getal. |
| `doelen` | ja | Lijst van één tot drie zinnen: "Je kunt ...", "Je weet ...". |
| `type` | nee | Leeg voor een gewone les; `quiz` voor de quizles; `certificaat` voor les 9.2. |
| `video` | nee | YouTube-id van een eigen video. Leeg laten; de maker vult dit later in als er video's komen. |

### Markdown in de body

Gewone Markdown werkt: `##` en `###` voor tussentitels (geen `#`, dat is de lestitel), alinea's, `**vet**`, `*cursief*`, lijsten met `-`, genummerde lijsten met `1.`, links `[tekst](https://...)`, tabellen, `>` citaten en `` `code` ``.

Externe links altijd met volledige `https://`. Interne links naar andere lessen: `[les 2.3](../h2-prompten-en-samenwerken/geef-bronnen-mee.html)`.

### Blokken

Een blok begint met `:::` gevolgd door het bloktype en een optionele titel, en eindigt met een regel `:::`. Blokken kunnen niet in elkaar genest worden.

```markdown
::: tip Goed om te weten
Tekst van de tip. Gewone Markdown.
:::
```

| Bloktype | Gebruik | Weergave |
|---|---|---|
| `prompt` | Een prompt die de leerling kan kopiëren. Schrijf de prompt zoals je ze in de chatbot plakt. | Kaart met knop *Kopieer de prompt*. |
| `voorbeeld` | Wat AI kan teruggeven, of een uitgewerkt voorbeeld (fragment, ingekort). | Kaart met het label *Voorbeeld van een antwoord*. |
| `tip` | Korte praktische tip. | Groene kaart. |
| `letop` | Waarschuwing: privacy, afspraken, fouten. | Oranje kaart. |
| `opdracht` | *Aan de slag*: wat de leerling nu zelf doet, met eigen leerstof. Mag een genummerde lijst bevatten. | Blauwe kaart met pictogram. |
| `stappen` | Genummerd stappenplan (gebruik `1.`-lijst in het blok). | Verticale stappenlijn. |
| `kernpunten` | Drie tot vijf opsommingstekens aan het einde van de les. Verplicht in elke gewone les. | Samenvattingskaart *Kernpunten*. |
| `nadenken` | Eén denkvraag aan het einde van de les. Verplicht in elke gewone les. | Vraag met een tekstvak dat lokaal bewaard wordt. |
| `vergelijk` | Twee kolommen. Scheid de kolommen met een regel `---`. Eerste regel van elke kolom is de kolomtitel. | Twee kaarten naast elkaar. |
| `tabs` | Meerdere voorbeelden waar de leerling er één van kiest. Elke tab begint met een regel `--- Tabnaam`. | Tabbladen. |
| `promptbouwer` | Invulformulier dat een prompt samenstelt. Zie hieronder. | Formulier plus resultaat met kopieerknop. |
| `checklist` | Afvinklijst (gebruik `-`-lijst). Vinkjes worden lokaal bewaard. | Lijst met checkboxes. |

### Prompt-blok

```markdown
::: prompt Oefenvragen bij mijn samenvatting
Ik zit in het vierde jaar, doorstroomfinaliteit, en studeer voor een toets geschiedenis over de Franse Revolutie. Hieronder plak ik mijn samenvatting. Maak vijf open vragen op het niveau van die toets. Stel ze één voor één. Wacht op mijn antwoord en geef daarna pas feedback.

[plak hier je samenvatting]
:::
```

Zet plaatsvervangers tussen vierkante haken: `[plak hier je samenvatting]`, `[jouw vak]`.

### Promptbouwer-blok

```markdown
::: promptbouwer Maak je eigen oefenprompt
veld: vak | Welk vak? | bv. Frans
veld: onderwerp | Over welk hoofdstuk of onderwerp? | bv. de passé composé
veld: niveau | In welk jaar en welke finaliteit zit je? | bv. derde jaar, dubbele finaliteit
veld: vorm | Welke vraagvorm wil je? | bv. invuloefeningen
sjabloon: Ik zit in {niveau} en bereid een toets {vak} voor over {onderwerp}. Maak tien {vorm} op dat niveau. Geef ze één voor één en wacht op mijn antwoord voor je feedback geeft.
:::
```

Elke `veld:`-regel heeft drie delen gescheiden door `|`: de naam (gebruikt in `{...}`), de vraag aan de leerling en een voorbeeld. De regel `sjabloon:` bevat de prompt met de velden tussen accolades.

### Vergelijk-blok

```markdown
::: vergelijk
Vage vraag
"Maak oefenvragen over geschiedenis."
AI weet niet welk hoofdstuk, welk niveau en welke vraagvorm je wilt.
---
Concrete vraag
"Maak vijf meerkeuzevragen over de oorzaken van de Eerste Wereldoorlog, voor het vijfde jaar, met uitleg bij elk juist antwoord."
AI weet nu precies wat het moet maken.
:::
```

### Tabs-blok

```markdown
::: tabs
--- Economie
Tekst en eventueel een prompt-regel voor economie ...
--- Biologie
Tekst voor biologie ...
--- Schoolactiviteit
Tekst voor de fuif van de leerlingenraad ...
:::
```

Binnen een tab mag je gewone Markdown gebruiken, maar geen ander blok.

### Verplichte afsluiting van een gewone les

Elke gewone les eindigt met, in deze volgorde:

```markdown
::: kernpunten
- Punt één.
- Punt twee.
- Punt drie.
:::

::: nadenken
Welke taak of toets komt er bij jou aan waarbij je dit meteen kunt proberen?
:::
```

## De quizles (`NN-quiz.md`)

```markdown
---
title: Hoofdstukquiz · Slim starten met AI
intro: Tien situaties uit je schoolwerk. Wat laat je AI doen, welke chatbot past bij je en waar kijk je zelf nog naar?
duur: 10
type: quiz
doelen:
  - Je past wat je in dit hoofdstuk leerde toe op tien nieuwe situaties.
---

Korte inleiding van een of twee alinea's: wat je gaat doen en waarom.
```

De vragen staan in `quiz.json` in dezelfde map:

```json
{
  "slaagpercentage": 80,
  "vragen": [
    {
      "id": "h1-01",
      "les": "waarom-ai-leren",
      "onderwerp": "Leren voor je toets",
      "vraag": "Je herkent de begrippen uit je samenvatting, maar bij nieuwe voorbeelden twijfel je. Je wilt testen of je zelf het juiste begrip kunt kiezen, zoals straks op de toets. Welke aanpak past het best?",
      "juist": "b",
      "opties": [
        { "id": "a", "tekst": "...", "feedback": "..." },
        { "id": "b", "tekst": "...", "feedback": "..." },
        { "id": "c", "tekst": "...", "feedback": "..." },
        { "id": "d", "tekst": "...", "feedback": "..." }
      ]
    }
  ]
}
```

- `les` is de slug van de les (bestandsnaam zonder nummer en `.md`) waar het antwoord staat.
- `juist` is de `id` van de juiste optie.
- Precies tien vragen, precies vier opties per vraag.

## Controle voor je klaar bent

- Elke `.md` begint met frontmatter en bevat `title`, `intro`, `duur`, `doelen`.
- Elke gewone les eindigt met `::: kernpunten` en `::: nadenken`.
- Elk blok is netjes gesloten met `:::`.
- Geen `#`-kop in de body (alleen `##` en `###`).
- `quiz.json` is geldige JSON met tien vragen.
- Bestandsnamen komen exact overeen met `docs/cursusplan.md`.
