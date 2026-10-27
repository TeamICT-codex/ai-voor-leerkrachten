---
title: "Aan de slag: maak je eigen website"
intro: Pak je eigen leerstof, taak of idee. Laat AI een eerste website bouwen, test hem zelf en verbeter hem gericht.
duur: 15
doelen:
  - Je bouwt met AI een eerste werkende website rond je eigen materiaal of idee.
  - Je test je website met een vaste controlelijst.
  - Je vraagt één gerichte verbetering en controleert of de rest goed bleef.
---

In deze les bouw je zelf. Je gebruikt alles uit de vorige lessen: een duidelijke opdracht, één HTML-bestand, zelf testen en gericht verbeteren. Zet je chatbot en deze les naast elkaar op je scherm. Zo houd je de stappen in het oog terwijl je bouwt. Reken op een kwartier voor een eerste versie.

## Stap 1: kies wat je wilt maken

Denk niet meteen aan een grote website. Iets kleins waar je echt iets aan hebt, werkt beter. Kies een van deze drie vertrekpunten.

::: tabs
--- Ik wil ermee leren
Je maakt een website om leerstof te oefenen of beter te begrijpen. Pak een samenvatting, een hoofdstuk uit je cursus of je notities. Kies één klein onderwerp, bijvoorbeeld de celdeling in biologie of de vervoeging van de passé composé. Denk na over wat je op de toets moet kunnen. Mitose en meiose uit elkaar houden? De fasen in de juiste volgorde zetten? Een vervoeging juist invullen?
--- Ik wil iets presenteren
Je maakt van een taak of project een overzichtelijke website, zoals in les 6.3. Pak je taak en kies één deel dat je wilt tonen. Bijvoorbeeld je aanpak, je resultaten of de planning van een activiteit van de leerlingenraad.
--- Mijn eigen idee
Je bouwt iets dat jij zelf wilt gebruiken. Een rekenhulp voor wat je verdient met je studentenjob op de Lokerse Feesten. Een lijst met oefeningen voor je sport. Een overzicht van je uurrooster met je springuren. Beschrijf in één zin wat de website moet doen.
:::

::: letop Wat geef je mee?
Gebruik je eigen materiaal of cursusteksten die je mag delen. Laat namen van klasgenoten, leerkrachten en andere persoonsgegevens weg. Vraag bij twijfel aan je leerkracht wat je mag uploaden.
:::

## Stap 2: laat de eerste versie maken

Upload je bestand of beschrijf je idee, en stuur dan de prompt hieronder. Pas de woorden tussen haken aan. Beantwoord de vragen die AI eventueel stelt.

::: prompt Een website van je eigen materiaal
Maak een kleine, interactieve website over de inhoud van mijn bijlage. Ik zit in [jaar en finaliteit, bv. vierde jaar, doorstroomfinaliteit]. Ik wil met de website [bv. de fasen van de celdeling oefenen].

Begin klein: één onderwerp en één belangrijke functie. Stem de vorm af op wat ik met deze leerstof moet doen. Een quiz of flitskaarten zijn niet altijd de beste keuze.

Gebruik mijn bijlage als enige bron. Zeg het duidelijk als je zelf een voorbeeld toevoegt. Kun je de bijlage niet lezen, vraag er dan eerst om.

Maak alles in één HTML-bestand, zonder account, database of externe diensten. Zorg dat tekst en knoppen ook op een gsm leesbaar zijn. Ontbreekt er belangrijke informatie, stel dan eerst maximaal twee vragen.

Laat de website zien in een voorbeeldvenster als dat kan. Geef me ook het bestand index.html om te downloaden. Lukt downloaden niet, geef dan de volledige code en leg uit hoe ik ze als index.html bewaar. Zet niets online.
:::

Bouwt je chatbot websites liever op een eigen manier, bijvoorbeeld in een apart venster? Ook goed. Zolang je het resultaat zelf kunt openen en erop klikken.

## Stap 3: test je website zelf

Dat een website er goed uitziet, betekent niet dat ze ook werkt. Open je website, in het voorbeeld van je chatbot of als bestand in je browser. Doe dan deze vier dingen.

::: checklist
- Ik heb op elke knop en elk menu-onderdeel geklikt. Alles opent wat moet openen.
- Ik heb de belangrijkste functie uitgeprobeerd: precies wat ik gevraagd heb.
- Ik heb een stukje inhoud vergeleken met mijn eigen materiaal. Uitleg, gegevens en voorbeelden kloppen.
- Ik heb mijn browservenster smaller gemaakt. Tekst en knoppen blijven bruikbaar.
:::

Noteer wat niet werkt of wat beter kan. Kies daarna het belangrijkste punt. Je verbetert één ding tegelijk.

## Stap 4: vraag één verbetering en zeg wat moet blijven

Je schrijft verder in dezelfde chat. Vertel bij een fout waar je op klikt, wat er dan gebeurt en wat je had verwacht. Met een screenshot kun je het probleem aanwijzen. Zeg ook wat goed is en moet blijven. Vul de velden in en kopieer je bericht.

::: promptbouwer Je vervolgbericht
veld: anders | Wat moet anders? Beschrijf waarop je klikt en wat er gebeurt. | bv. als ik op Volgende fase klik, springt de website terug naar het begin
veld: verwacht | Wat had je verwacht? | bv. dat de volgende fase van de celdeling verschijnt
veld: blijven | Wat is goed en moet blijven? | bv. de uitleg per fase en de kleuren
sjabloon: Er werkt iets niet zoals ik wil. {anders}. Ik verwacht {verwacht}. Pas alleen dat aan. Laat {blijven} zoals het is. Geef me daarna het volledige, aangepaste bestand.
:::

## Stap 5: controleer de nieuwe versie

Open de nieuwe versie. Let op dat je niet per ongeluk de oude versie nog open hebt staan. Doe dan dezelfde handeling opnieuw. Werkt de verbetering nu? En staat alles wat goed was er nog? Pas dan bewaar je deze versie. Geef ze een duidelijke naam, bijvoorbeeld een map *versie-2*.

Wil je nog iets verbeteren? Herhaal stap 3 tot 5. Gaat het gesprek heel lang worden en vergeet AI dingen? Begin dan een nieuwe chat met je laatste werkende bestand als bijlage.

## Stap 6: kies hoe je deelt

Je kiest bewust hoe anderen je website zien.

- **Het bestand doorgeven.** Je stuurt `index.html` door, bijvoorbeeld via Smartschool of een gedeelde map. De ander opent het op het eigen toestel.
- **Een link maken.** Je zet de website online met Netlify Drop, zoals in les 6.1. Iedereen met de link kan hem openen. Controleer eerst of er niets op staat dat niet openbaar mag zijn.

::: kernpunten
- Begin klein: één onderwerp, één doel, één belangrijke functie.
- Geef je eigen materiaal mee en zeg hoe de website het moet gebruiken.
- Test elke website met dezelfde vier controles.
- Vraag één verbetering tegelijk en zeg wat moet blijven.
- Kies bewust tussen een bestand doorgeven en een openbare link.
:::

::: nadenken
Wat werkte bij je eerste versie meteen, en wat moest je het vaakst bijsturen? Wat zou je de volgende keer al in je eerste prompt zetten?
:::
