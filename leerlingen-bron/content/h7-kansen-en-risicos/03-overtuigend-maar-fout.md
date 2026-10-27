---
title: Een overtuigend antwoord kan fout zijn
intro: Een uitleg die zeker klinkt, kan toch een fout bevatten. Zo zoek je in de bron zelf na of het klopt.
duur: 10
doelen:
  - Je kunt uitleggen waarom een fout AI-antwoord toch zeker en logisch kan klinken.
  - Je kunt een bewering van AI controleren door ze naast de oorspronkelijke bron te leggen.
---

Een chatbot schrijft vlot, beleefd en in mooie zinnen. Er staat soms zelfs een bron bij. Dat geeft vertrouwen. Maar vlot geschreven is iets anders dan gecontroleerd. Een sterke prompt of een duur abonnement voorkomt geen vergissingen.

## Zeker klinken is niet hetzelfde als gelijk hebben

Neem een fictief voorbeeld. Senne zit in het zesde jaar elektromechanische technieken op GO! technisch atheneum Lokeren en werkt aan zijn GIP. Hij vraagt aan een chatbot wanneer hij zijn GIP-dossier moet indienen. Hij heeft het GIP-reglement van zijn school geüpload.

::: vergelijk
Wat de chatbot antwoordt
"Je dient je GIP-dossier uiterlijk **twee weken** voor je juryverdediging in. De jury heeft die tijd nodig om je dossier grondig te lezen. Bron: GIP-reglement, artikel 4."
---
Wat het GIP-reglement zegt
"Artikel 4. De leerling dient het volledige GIP-dossier uiterlijk **drie weken** voor de juryverdediging in via Smartschool."
:::

Het antwoord klinkt helemaal in orde. Toch zitten er drie problemen in.

1. **Het getal klopt niet.** Twee weken is geen drie weken. Wie de chatbot volgt, is een week te laat.
2. **De uitleg is erbij verzonnen.** Dat de jury tijd nodig heeft, klinkt aannemelijk. Alleen vind je die uitleg nergens in artikel 4. Ze bewijst de termijn dus niet.
3. **De verwijzing klopt half.** Artikel 4 gaat inderdaad over het indienen van het dossier. Maar de termijn die de chatbot noemt, staat er niet in. Een bron is pas bruikbaar als ze precies jouw bewering ondersteunt.

## Waarom klinkt een fout antwoord zo zeker?

Een taalmodel voorspelt welke woorden het best op elkaar volgen. Het maakt zinnen die passen bij hoe zulke antwoorden er meestal uitzien. Daardoor klinkt een fout antwoord even vlot als een juist antwoord. Het model heeft geen ingebouwd alarm dat afgaat bij een vergissing.

Het Amerikaanse instituut NIST beschrijft dit in een rapport over de risico's van generatieve AI. Het noemt het *confabulation*: AI brengt onjuiste informatie overtuigend. Een redenering die logisch klinkt of een bronvermelding maakt zo'n fout antwoord dan nog geloofwaardiger. Wil je dat zelf lezen, open dan [het rapport van NIST](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf#page=10) (Engels, paragraaf 2.2 op pagina 10).

::: letop Opnieuw vragen is geen controle
Vraag je dezelfde chatbot "Weet je dat zeker?", dan krijg je soms hetzelfde foute antwoord, nog stelliger. Of je krijgt een ander antwoord dat ook niet klopt. Dezelfde chatbot is geen onafhankelijke controle. De oorspronkelijke bron wel.
:::

## Leg de bewering naast de bron

Controleren hoeft niet lang te duren. Wel moet je weten waar je kijkt. Bij een schoolafspraak is dat het reglement, de opdracht van je leerkracht of het bericht op Smartschool. Bij een feit voor je taak is dat het artikel, het boek of de website waaruit het komt.

::: checklist Controleer een AI-antwoord
- Ik heb de oorspronkelijke bron zelf geopend, niet alleen de samenvatting van AI.
- Ik heb de precieze zin gevonden waarop de bewering steunt.
- Getallen, data en namen in het antwoord komen overeen met de bron.
- De uitleg of reden die AI geeft, staat ook echt in de bron. Zo niet, dan behandel ik die als een gok.
- Bij een belangrijke afspraak vraag ik het bij twijfel na aan mijn leerkracht.
:::

Je kunt AI ook vragen om het controleren makkelijker te maken. Laat de chatbot letterlijk citeren uit je bron. Dan zoek je die zin daarna zelf op.

::: prompt Laat AI citeren uit je bron
Ik heb hieronder een tekst geplakt. Beantwoord mijn vraag alleen op basis van die tekst. Citeer letterlijk de zin of zinnen waarop je antwoord steunt, met het nummer van het artikel of de paragraaf. Staat het antwoord niet in de tekst, zeg dat dan duidelijk en vul niets aan.

Mijn vraag: [jouw vraag]

[plak hier de tekst]
:::

Ook met deze prompt kan AI een citaat verkeerd overnemen. Het verschil is dat je nu precies weet welke zin je moet opzoeken.

::: opdracht Probeer het zelf
1. Neem een document met afspraken: het schoolreglement, de opdrachtfiche van een taak of de handleiding van je GIP. Haal namen en persoonsgegevens eruit voor je het deelt.
2. Stel een chatbot drie vragen over dat document, bijvoorbeeld over termijnen, punten of wat je moet indienen.
3. Controleer elk antwoord met de checklist hierboven. Hoeveel antwoorden kloppen volledig?
:::

::: kernpunten
- Een vlot, logisch antwoord met een bronvermelding kan toch fout zijn.
- AI voorspelt plausibele tekst. Daardoor klinkt een fout even zeker als een juist antwoord.
- Een bron telt pas als ze precies jouw bewering ondersteunt.
- Dezelfde chatbot opnieuw vragen is geen controle. Kijk in de oorspronkelijke bron.
:::

::: nadenken
Bij welke informatie voor school zou een fout van AI voor jou de grootste gevolgen hebben?
:::
