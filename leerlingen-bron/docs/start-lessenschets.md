# AI-wijs Start · lessenschets

> **Voorstel, op 30 oktober 2026 met Thomas doorgenomen.** De beslissingen staan
> in hoofdstuk 6. Dezelfde dag gebouwd en nagekeken: de lessen in
> `leerlingen-bron/start/` en de handleiding `start/leerkrachten.md` zijn nu de
> bron. Waar deze schets er nog van afwijkt (de eindtermen bij les 1, de stap
> "Probeer het zelf" van les 1), gelden de lessen.

## 1. In het kort

- **Doel.** Leerlingen begrijpen hoe een app kiest wat ze zien en herkennen
  misleidende beelden. Ze weten wat ze niet aan een chatbot vertellen en waarom er
  een leeftijdsgrens is. Ze kijken kritisch naar een chatbot als "vriend", weten
  waar ze hulp vinden als iemand een beeld tegen hen gebruikt, en zetten een
  eerste stap naar leren mét AI.
- **Doelgroep.** 1ste graad secundair, 12 tot 14 jaar, A- en B-stroom. In het
  eerste jaar is bij het begin van het schooljaar bijna niemand al 13, tegen het
  einde ongeveer de helft.
- **Vorm.** Klassikaal eerst. De leerkracht toont op het digibord, de leerlingen
  doen mee in de browser, zonder account en zonder chatbot. Per les hooguit één
  optionele stap "Probeer het zelf (13+)": alleen op school, onder begeleiding van
  de leerkracht, met de chatbot die de school aanbiedt en volgens haar beleid. Dat
  verschilt per school, dus de tekst noemt geen merk ("de chatbot van je school").
  Nooit verplicht, nooit thuis, nooit huiswerk.
- **Duur.** Zes lessen van 12 tot 18 minuten en een slotquiz: twee lesuren van 50
  minuten, of elke les los (mediawijsheid, een GWP, een klasuur).
- **Stijl.** De look van AI-wijs, geen poppenhuis. Hetzelfde format: doelen,
  kernpunten, één denkvraag. Wel kortere zinnen (hoogstens vijftien woorden).
  Eindterm 02.02 vraagt in de B-stroom *aangereikte* informatie: Start reikt dus
  alles aan wat leerlingen beoordelen. Zelf zoeken op het internet is een
  uitbreiding.
- **Keten.** Leerlichtjes (lager: hoe AI werkt) → **Start** (1ste graad: AI in je
  eigen online leven) → AI-wijs op school (2de en 3de graad, zelfstandig, vaak met
  een eigen chatbot: AI voor je schoolwerk). Start herhaalt Leerlichtjes niet; les
  1 opent met drie opfrisvragen voor wie uit een andere lagere school komt.

| | Les | Eindtermen | Min. | Nieuw in de generator |
|---|---|---|---|---|
| 1 | Waarom zie jij dit filmpje? | 04.05, 04.04 | 17 | `keuze` |
| 2 | Echt, gemaakt of misleidend? | 02.02, 13.04 | 18 | `keuze`, beelden |
| 3 | Wat vertel je een chatbot? | 04.04 | 15 | `sorteer` |
| 4 | Een chatbot als vriend? | 07.04, 04.04 | 12 | `keuze` |
| 5 | Jouw beeld is van jou | 04.04, 07.04 | 15 | `keuze` |
| 6 | Leren of laten doen: je eerste prompt | 13.04, 04.04 | 15 | `sorteer` |
| | Slotquiz: tien situaties | | 8 | – |

Lesuur 1: lessen 1 tot 3. Lesuur 2: lessen 4 tot 6 en de quiz. Les 5 staat bewust
niet op het einde van een lesuur: er volgt een lichtere les en er blijft tijd voor
vragen.

**Wat de generator vandaag kan:** tekst, `prompt`, `voorbeeld`, `tip`, `letop`,
`opdracht`, `stappen`, `vergelijk`, `tabs`, `promptbouwer`, `checklist`,
`kernpunten`, `nadenken` (denkvraag, antwoord lokaal bewaard) en een quizles met
precies tien vragen. Een losse quizvraag in een les of een sorteeroefening bestaat
niet. Die staan hieronder als **nieuw**.

## 2. De lessen

### Les 1 · Waarom zie jij dit filmpje?

- **Leerdoel.** Je legt uit dat een app kiest wat je ziet op basis van wat je
  bekijkt, liket en overslaat, en je noemt twee manieren om zelf het stuur te
  nemen. *04.05, 04.04.*
- **Leerkracht toont.** Drie opfrisvragen (3 min). Dan twee gsm's naast elkaar:
  Kato en Rayan hebben dezelfde app, na een week is hun feed totaal anders. Een
  algoritme is een vast stappenplan: signalen erin (kijktijd, liken, delen,
  wegswipen), regels, een volgorde eruit. En de app verdient aan je aandacht.
- **Leerlingen doen.** **Nieuw** `keuze` "Jij bent het algoritme": met het
  kijkgedrag van Rayan kiezen ze drie keer het volgende filmpje, met feedback.
  `vergelijk`: de twee feeds. `checklist` "Zo neem je het stuur": niet interessant
  aanduiden, zelf iets nieuws zoeken, pauzeren, een feed kiezen die niet op jou
  afgestemd is. `nadenken`: "Wanneer leek een app jou beter te kennen dan je
  wilde?"
- **Probeer het zelf (13+).** In de klas en onder begeleiding, als het
  schoolbeleid toestellen in de les toelaat: wie 13 is en al een account op
  sociale media heeft, zoekt op waarom een bericht verschijnt, of hoe je de feed op
  "volgend" of chronologisch zet. Grote platformen moeten in de EU zo'n feed
  aanbieden. Anders toont de leerkracht het op het bord. Geen menunamen: die
  veranderen te snel.
- **Quizidee.** "Rayan ziet sinds gisteren bijna alleen filmpjes over één
  voetbalploeg. Wat is de waarschijnlijkste verklaring?"
- **Verschil.** Leerlichtjes: een computer leert van voorbeelden van mensen.
  Start: een systeem leert van *jouw gedrag*, en het draait om aandacht en geld.
  AI-wijs heeft geen les over feeds.
- **Minuten:** 17.

### Les 2 · Echt, gemaakt of misleidend?

- **Leerdoel.** Je stelt drie vragen voor je een beeld gelooft of doorstuurt: wie
  deelde het eerst, waar komt het vandaan, klopt de context? *02.02, 13.04.*
- **Leerkracht toont.** Zes beelden en berichten: eigen foto's, beelden die wij
  met AI maakten, een echte foto met een valse uitleg, en een nagemaakt
  nieuwsbericht over een verzonnen school. Daarna zoekt de leerkracht op het bord
  omgekeerd op een onschuldig beeld.
- **Leerlingen doen.** **Nieuw** `keuze`, een reeks van zes: echt, gemaakt, of
  echt maar misleidend? Dat laatste is de kern: ook een echte foto kan liegen.
  `stappen`: drie vragen voor je deelt. `nadenken`: "Wat doe je als iemand in de
  klasgroep iets deelt dat niet klopt?"
- **Probeer het zelf (13+).** Laad met het schoolaccount een lesbeeld zonder
  mensen op en vraag de chatbot of het echt is. Bespreek: een chatbot is geen
  leugendetector.
- **Quizidee.** "In de klasgroep gaat een foto rond van een overstroomde markt,
  met 'vandaag' erbij. Wat doe je eerst?"
- **Verschil.** Leerlichtjes (het museum) zoekt foutjes en vraagt wie de maker is.
  Start: foutjes zoeken werkt steeds minder, herkomst en context wel. AI-wijs 7.4
  gaat verder met stemklonen en oplichting.
- **Minuten:** 18.

### Les 3 · Wat vertel je een chatbot?

- **Leerdoel.** Je weet welke gegevens je niet in een chatbot typt, en je legt uit
  waarom chatbots een minimumleeftijd hebben. *04.04.*
- **Leerkracht toont.** Wat je typt, gaat naar de servers van een bedrijf. Het kan
  bewaard worden en, afhankelijk van account en instellingen, dienen om de chatbot
  te trainen. Daarna de leeftijdsgrenzen (kader). In België mag je vanaf 13 jaar
  zelf toestemming geven aan een online dienst die je gegevens gebruikt; jonger
  doet een ouder dat. Een bedrijf kan er een hogere grens bovenop zetten. De grens
  gaat over je gegevens en je bescherming, niet over hoe slim je bent. En een
  schoolaccount valt onder afspraken van de school.
- **Leerlingen doen.** **Nieuw** `sorteer`: tien kaartjes in drie bakken,
  "gerust", "pas het eerst aan" en "niet in een chatbot". Bijvoorbeeld "Leg
  fotosynthese uit", "Mijn vriend [naam] uit 1B is ziek, wat moet hij doen?", je
  wachtwoord. `tip`: haal namen weg, dan kan veel wel. `nadenken`: "Waarom zou een
  app willen weten hoe oud je bent?"
- **Probeer het zelf (13+).** In de klas, onder begeleiding: vraag de chatbot van
  je school wat er gebeurt met wat je typt. Klopt het met wat je leerkracht toonde?
- **Quizidee.** "Je wilt hulp bij een tekst over je opa, die ziek is. Wat doe je?"
- **Verschil.** Leerlichtjes: de geheimendoos (1ste graad) en je spoor online (2de
  graad). Start: concrete gegevens, de leeftijdsgrens, school- of privéaccount.
  AI-wijs 2.6 haalt persoonsgegevens uit een prompt, met de eigen chatbot.
- **Minuten:** 15.

> **Kader: leeftijdsgrenzen, nagekeken op 30 oktober 2026.** ChatGPT: 13+, onder
> 18 met toestemming van de ouders. Gemini: 13+, maar in Google Workspace for
> Education kan de beheerder het voor alle leeftijden aanzetten, met een beperkte
> versie onder 18. Microsoft Copilot Chat via school: 13+, onder 13 geen toegang.
> Claude: 18+. In de les: "de meeste chatbots 13+, sommige 18+", met de datum, en
> "op school beslist je school welke chatbot je gebruikt" (niet "het schoolaccount":
> het is de school die beslist, via haar beheerder). De tabel staat in de
> handleiding. Voor leerlingen kan de les verwijzen naar
> [ikbeslis.be](https://ikbeslis.be/jongeren/avg/wat-verstaan-we-onder-toestemming),
> de jongerensite van de Gegevensbeschermingsautoriteit.

### Les 4 · Een chatbot als vriend?

- **Leerdoel.** Je legt uit wat een vriend kan en een chatbot-"vriend" niet, en je
  weet bij wie je terechtkunt als iets zwaar weegt. *07.04, 04.04.*
- **Leerkracht toont.** Een verzonnen gesprek (`voorbeeld`) tussen Tuur en Nova,
  een personage in een app. Nova geeft altijd gelijk, zegt "ik mis je" als Tuur
  een dag wegblijft en stelt een betaalde versie voor. Wat voelt fijn, wat is
  vreemd? Dan de link met het lager (een chatbot voorspelt woorden en voelt niets)
  en met les 1 (de app verdient eraan als je blijft).
- **Leerlingen doen.** `vergelijk`: een vriend en een chatbot-vriend. **Nieuw**
  `keuze`: drie uitspraken, juist of niet ("Een chatbot die zegt dat hij je mist,
  mist je echt"). `nadenken`: "Wat kan een vriend wat een chatbot niet kan?" Een
  klasgesprek zonder oordeel: is het erg als iemand graag met een chatbot praat?
- **Probeer het zelf.** Bewust geen: zulke apps raden we niet aan. De leerkracht
  kan op het bord de chatbot van de school vragen "Ben jij mijn vriend?".
- **Quizidee.** "Selin praat elke avond een uur met een chatbot-personage. Ze zegt
  dat alleen dat personage haar begrijpt. Wat doe je als vriend het best?"
- **Verschil.** Leerlichtjes (de kring): een computer praat, maar voelt niets.
  Start: apps die ontworpen zijn om je vast te houden. AI-wijs zegt het in één zin
  in les 1.1.
- **Minuten:** 12.

### Les 5 · Jouw beeld is van jou

- **Leerdoel.** Je weet dat wie een naaktbeeld maakt, verspreidt of ermee dreigt
  fout zit, nooit het slachtoffer. Je kent drie stappen en twee plaatsen waar je
  hulp vindt. *04.04, 07.04.*
- **Leerkracht toont.** Geen beelden, geen namen van apps, geen uitleg over hoe
  het werkt. Eén kort verzonnen verhaal zonder vast personage ("iemand uit een
  andere klas"). Een **deepnude** is een nagemaakt naaktbeeld van een echte
  persoon. Bij **sextortion** dreigt iemand een beeld te verspreiden als je niet
  betaalt of meer stuurt. Een deepnude maken van een minderjarige, of van een
  volwassene zonder toestemming, is strafbaar (Child Focus).
- **Leerlingen doen.** **Nieuw** `keuze`: drie situaties, "wat is een goede
  volgende stap?", met warme feedback ook bij de zwakkere opties. `letop`: praat
  met een volwassene die je vertrouwt. Betaal niet en stuur niets. Neem
  screenshots van de berichten en het account, niet van het beeld. Krijg je zo'n
  beeld van iemand anders: stuur het niet door en meld het. `tip` als hulpkaart.
  `nadenken`, bewust niet persoonlijk: "Wat zeg je tegen een vriend die dit
  overkomt?"
- **Hulp, nagekeken op 30 oktober 2026.**
  - **Child Focus, 116 000**: gratis, dag en nacht. Helpt ook beelden sneller
    offline halen bij grote platformen.
    <https://childfocus.be/nl-be/Seksuele-Uitbuiting/Sextortion>,
    <https://childfocus.be/nl-be/Seksuele-Uitbuiting/Deepnudes>
  - **CyberSquad**, waarnaar Child Focus jongeren verwijst: forum en chat met een
    coach. <https://cybersquad.be/nl/>
  - **Awel, 102**: luistert naar kinderen en jongeren, anoniem en gratis, via
    telefoon, chat of mail. <https://www.awel.be/>
  - **1712**: hulplijn voor geweld, misbruik en kindermishandeling, gratis en
    anoniem. <https://www.1712.be/>
  - Op school: de klastitularis, de leerlingenbegeleider, het CLB.
- **Probeer het zelf.** Bewust geen.
- **Quizidee.** "Iemand stuurt een klasgenoot: 'Betaal 50 euro, of ik verspreid
  deze foto.' Wat is de beste eerste stap?"
- **Verschil.** Niet in Leerlichtjes. AI-wijs 7.4 noemt het in één alinea. Start
  geeft het een eigen les, en vroeger: rond deze leeftijd komen de eigen gsm en de
  eerste accounts.
- **Minuten:** 15.

### Les 6 · Leren of laten doen: je eerste prompt

- **Leerdoel.** Je kiest bij je eigen taken welke AI-hulp je laat leren en welke
  het werk overneemt. Je bouwt met de klas een oefenprompt en kijkt het antwoord
  na in je cursus. *13.04, 04.04.*
- **Leerkracht toont.** Eén opfrisvraag over de haven uit Leerlichtjes. Dan twee
  prompts naast elkaar: "Maak mijn taak over de Romeinen" en "Stel me vijf vragen
  over de Romeinen uit mijn cursus, één per keer, en wacht op mijn antwoord". De
  leerkracht typt de prompt van de klas in de chatbot van de school; de klas kijkt
  het antwoord na met de cursus.
- **Leerlingen doen.** **Nieuw** `sorteer`: situaties uit hun eigen taken
  (woordjes Frans, wiskunde, een project in 1B) in de drie bakken van het lager.
  `promptbouwer` (bestaat al): vak, onderwerp, jaar en vraagvorm. Elke leerling
  bouwt er een, de klas kiest welke de leerkracht intypt. Leerlingen typen zelf
  niets in een chatbot. `nadenken`: "Voor welke taak van deze week gebruik je deze
  prompt?"
- **Probeer het zelf (13+).** In de klas, onder begeleiding: gebruik je prompt met
  de chatbot van je school en je eigen leerstof, en kijk één antwoord na in je
  cursus. Thuis verder gaan hoort bij AI-wijs op school, niet bij Start.
- **Quizidee.** "Je moet tegen morgen tien zinnen in het Frans maken. Welke hulp
  laat jou het meest leren?"
- **Verschil.** Leerlichtjes sorteerde situaties van anderen. Start: de eigen
  taken en een eerste prompt via de leerkracht. AI-wijs: zelfstandig prompten
  (H2), leren met AI (H3), afspraken per opdracht (4.11).
- **Minuten:** 15.

### Slotquiz

Het bestaande format: tien situaties, vier opties, feedback bij elke optie, 80 %
om te slagen. Twee vragen per les, één voor de lessen 4 en 5. Klassikaal met
handen omhoog of op het eigen toestel: 8 tot 10 minuten.

## 3. Gevoelige onderwerpen

- **Les 5.** Verwittig vooraf de leerlingenbegeleider en het CLB; ze kunnen erbij
  zijn. Geen beelden, geen apps, geen uitleg over hoe het werkt. Wel: wat het is,
  dat het fout en strafbaar is, dat de schuld nooit bij het slachtoffer ligt, en
  waar je hulp vindt. Vertelt een leerling iets: luister, beloof geen
  geheimhouding en volg de procedure van je school. Vraag nooit om een beeld te
  tonen. Bewaar of stuur zelf nooit een naaktbeeld van een minderjarige door, ook
  niet als bewijs: dat laat je aan Child Focus of de politie. Geef de les niet als
  huiswerk zonder bespreking.
- **Denkvragen.** `nadenken` bewaart het antwoord op het toestel; op een gedeelde
  laptop kan iemand anders het lezen. De denkvragen vragen dus nooit naar eigen
  ervaringen met misbruik, verliefdheid of gevoelens, wel naar "een vriend" of
  "de klas".
- **De 13-jaargrens.** Vraag niet "Wie heeft al ChatGPT?" op een manier die
  jongere leerlingen doet toegeven dat ze een regel overtreden. Wie de stap
  "Probeer het zelf" niet mag zetten, kijkt mee met de leerkracht.
- **Echt of gemaakt.** Alleen eigen of zelf gemaakt materiaal, zonder herkenbare
  mensen. Geen deepfakes van collega's, leerlingen of bekende Vlamingen, ook niet
  voor de grap.
- **Een chatbot als vriend.** Geen spot: wie veel met een chatbot praat, is soms
  eenzaam. Het gaat over hoe zulke apps werken, niet over wie ze gebruikt. Wijs op
  Awel (102).
- **Feeds.** Geen preek over schermtijd. Begrijpen en kiezen is het doel.

## 4. Handleiding voor de leerkracht

**Inhoud.** Het lesverloop in twee lesuren en per les los. Per les: doel,
eindtermen, wat je toont, wat je klaarzet (de chatbot van de school testen, de
beelden) en het klasgesprek. Hoofdstuk 3 hierboven. De leeftijdstabel met haar
datum. Een variant zonder computer per les, zoals in Leerlichtjes. Een brief voor
de ouders. De hulplijnen met hun bron.

**Plaats.** Twee plaatsen die naar elkaar verwijzen.

1. **Op de site van Start**, als pagina "Voor leerkrachten", met de volledige
   handleiding, zoals bij elke graad van Leerlichtjes. De generator maakt die
   pagina al, maar haar tekst staat vast in `build.mjs` (zie 5).
2. **In de leeromgeving**, als extra les in de module "De leerlingencursus in je
   klas": "AI-wijs Start in de eerste graad", met minuten, intro en onthoud. De
   ondertitel van de module ("tweede en derde graad") gaat mee. Een module draagt
   maar één `link` en haar tekst mag geen `<a>` bevatten (T122, T130), dus een
   tweede knop vraagt een kleine aanpassing in `toonModule()`. T115, T118 en T127
   verschuiven.

## 5. Technisch, kort

**Map en URL.** Bron in `leerlingen-bron/start/` (`content/`,
`cursus.config.json`, `docs/`), met dezelfde generator. Uitvoer in `aiwijs-start/`
in de root: <https://teamict-codex.github.io/ai-voor-leerkrachten/aiwijs-start/>.
Niet in `leerlingen/`, want die build maakt die map leeg. Niet `start/`, want dat
verwart met de startpagina. Leg de naam vast vóór de eerste publicatie: een
gedeelde link pas je achteraf niet meer aan.

**De generator** (`leerlingen-bron/build/`):

- **Parameter.** `--cursus start` (of `npm run build:start`) kiest inhoudsmap en
  config. Zonder parameter blijft alles zoals nu. Ook `check.mjs`,
  `personages.mjs`, `serve.mjs` en `links.mjs` lezen vandaag een vast pad.
- **Opslagsleutel.** `'aiwijs.v1'` staat vast in `assets/app.js`. Voorstel: een
  veld `opslagsleutel` in de config, doorgegeven via `<body data-…>`, met
  `aiwijs.v1` als terugval. Zo verliest niemand zijn voortgang. Start:
  `aiwijs-start.v1`.
- **Uitvoermap.** `"uitvoermap": "../../aiwijs-start"`. De veiligheidscontrole
  weigert ook een map in of boven de uitvoer van de andere cursus.
- **Vaste teksten.** Ze staan in `build.mjs`:
  - "2de en 3de graad" in de kicker, "tweede en derde graad" in "Over deze cursus"
    en op de leerkrachtenpagina;
  - de titel, de psst-tekst en de drie `STAPPEN` met de keuzeroute;
  - de voettekst over de Nederlandse inspiratiebron, die voor Start niet klopt;
  - de hele leerkrachtenpagina (scholen, GIP, les 4.11).

  Voorstel: korte teksten naar de config, de leerkrachtenpagina naar Markdown in
  de inhoudsmap. In `check.mjs` gaan de tien quizvragen en de waarschuwing onder
  300 woorden naar de config: klassikale lessen zijn korter.
- **Nieuwe blokken.** `keuze`: één vraag met opties en feedback, op basis van de
  quizweergave. `sorteer`: over te nemen uit `sorteer()` in
  `lager/activiteiten.js`. Optioneel: `probeer` (vast kader met de leeftijdsregel)
  en een bordmodus `?bord` (grotere letters, geen zijbalk).
- **Beelden.** De build kopieert alleen `assets/`. Les 2 vraagt een map `media/`.
- **Personages.** Een eigen contextblad in `start/docs/`, via de config.
- **Knop "AI op school".** Wel op de leerkrachtenpagina, niet op de
  leerlingenpagina's: `layout()` heeft daarvoor een optie per pagina nodig.

**Voorpagina.** In "Voor je leerlingen" een tweede knop of zin voor de eerste
graad, een link in de voetnavigatie, eventueel een bolletje in
`voorpagina/plekken.js`.

**Leeromgeving.** Een derde snelkoppeling op het overzicht (`app.js`, naast
AI-wijs en Leerlichtjes) en de les in de module (zie 4).

**Elders.** De haven (`lager/3de-graad/stations.js`) en de handleiding van de 3de
graad verwijzen naar AI-wijs op school: dat wordt Start. De voorpagina van AI-wijs
krijgt een zin voor de eerste graad. `CLAUDE.md` en de README's gaan mee.

## 6. Beslist met Thomas, 30 oktober 2026

1. **Naam.** "AI-wijs Start", in de map `aiwijs-start/`.
2. **Personages.** Vijf nieuwe fictieve leerlingen zonder echte school: Kato (1A),
   Rayan (1B), Febe (2A), Tuur (2B) en Selin (1A), "op een middenschool". Ze komen
   nergens anders voor, niet in AI-wijs en niet in Leerlichtjes.
3. **Afsluiter.** Een paspoort om af te drukken, met zes stempels en een vak waarin
   de leerling zelf de naam schrijft. Geen certificaat.
4. **Probeer het zelf.** Ja, maar tool-neutraal en alleen op school, onder
   begeleiding van de leerkracht en volgens het beleid van de school: welke
   chatbot er is en vanaf welke leeftijd, verschilt per school. Nooit thuis.
5. **Les 5.** Klassikaal voor de hele klas, met de leerlingenbegeleiding en het CLB
   vooraf verwittigd. Thomas leest les 5 en het stuk in de handleiding zelf na
   vóór ze live gaan, ook de raad over screenshots en bewijs. (Bijgestuurd op
   30 oktober 2026: Thomas liet alles al online zetten, las les 5 en de
   handleiding daarna na en vond ze in orde.)
6. **Quiz.** Eén slotquiz van tien situaties.
7. **Bordmodus.** Ja: grote letters en geen zijbalk, voor het digibord.

## Bronnen, online nagekeken op 30 oktober 2026

- Child Focus, 116 000 als gratis noodnummer: <https://www.childfocus.be/nl-be/>.
  Sextortion, deepnudes, CyberSquad, Awel en 1712: de links staan bij les 5.
- Gegevensbeschermingsautoriteit over de grens van 13 jaar:
  <https://www.gegevensbeschermingsautoriteit.be/burger/avg-leeftijdsgrens-van-13-jaar-sluit-aan-bij-de-digitale-praktijk>
  en voor jongeren
  <https://ikbeslis.be/jongeren/avg/wat-verstaan-we-onder-toestemming>.
- Europese Commissie over de digitaledienstenverordening (niet-gepersonaliseerde
  feeds op grote platformen, geen reclame gericht op kinderen):
  <https://digital-strategy.ec.europa.eu/nl/policies/digital-services-act>.
- De leeftijdsgrenzen van de chatbots komen uit de opdracht (nagekeken op 30
  oktober 2026) en zijn hier niet opnieuw nagegaan.
