---
title: Maak je eigen oefenwebsite
intro: Laat AI van je eigen leerstof een kleine website maken met flashcards en een quiz. Programmeren hoeft niet, nakijken wel.
duur: 15
doelen:
  - Je kunt een chatbot een oefenwebsite met flashcards en een quiz laten bouwen op basis van je eigen leerstof.
  - Je kunt zo'n website testen op inhoud en werking voor je ermee studeert.
---

Flashcards maken op papier kost tijd. Een oefenapp vinden die precies jouw woordenlijst of jouw begrippen bevat, lukt bijna nooit. Een chatbot kan het voor je bouwen. Je krijgt een kleine website met jouw leerstof erin, die je in je browser opent wanneer je wilt. Jij levert de leerstof en zegt wat de site moet kunnen. AI schrijft de code.

## Twee manieren om te oefenen

Een goede oefenwebsite heeft twee delen die elkaar aanvullen.

::: vergelijk
Flashcards
Je ziet een woord of begrip en denkt eerst zelf na. Dan draai je de kaart om. Je duidt aan of je het kende of nog moet oefenen. Kaarten die je nog niet kent, komen terug.
---
Quiz
Je typt zelf het antwoord of kiest uit opties. De site zegt meteen of het juist is en waarom. Op het einde krijg je een nieuwe ronde met alleen je fouten.
:::

Met flashcards leer je de leerstof. Met de quiz test je of ze blijft hangen. Wissel ze af.

## Waarvoor werkt het?

- **Woordenlijsten** voor Frans, Engels of Duits: Nederlands op de ene kant, de vertaling op de andere.
- **Begrippen** voor biologie, economie of aardrijkskunde: het begrip op de ene kant, de definitie en een voorbeeld op de andere.
- **Jaartallen en gebeurtenissen** voor geschiedenis.
- **Vakkennis uit een praktijkvak**: onderdelen van een elektrische installatie, de stappen van een verzorgingshandeling, de namen van keukentechnieken. Yasmine, vierde jaar zorg en welzijn op GO! talent in Zele, oefent zo de stappen van een verzorgingshandeling voor haar stage.

## Zo vraag je het

Je geeft je leerstof mee als foto, bestand of geplakte tekst. Een goede prompt vraagt eerst om de leerstof te tonen, zodat jij kunt nakijken of AI alles juist gelezen heeft. Pas daarna bouwt AI de website.

::: prompt Bouw mijn oefenwebsite
Maak een oefenwebsite waarmee ik mijn leerstof voor [vak] kan oefenen. Ik zit in [jaar en finaliteit]. Ik voeg mijn leerstof toe als [foto, bestand of tekst].

Stap 1: lees mijn leerstof en toon alle items als lijst. Neem woorden, lidwoorden, accenten en definities exact over. Is iets onleesbaar, vraag het dan. Wacht op mijn akkoord.

Stap 2: bouw na mijn akkoord één volledig werkend HTML-bestand, met alle code en leerstof erin, zonder externe bibliotheken. Maak twee tabbladen:
- Flashcards: kaart omdraaien, knoppen "Ken ik" en "Nog oefenen". Kaarten die ik nog moet oefenen, komen terug in een herhaalronde.
- Quiz: één vraag per keer, ik typ het antwoord zelf. Geef meteen feedback met uitleg. Wees specifiek als alleen een lidwoord of accent fout is. Op het einde volgt een ronde met mijn fouten.

Voeg een voortgangsbalk toe. Maak de site rustig en goed leesbaar, ook op een gsm. Lukt een download niet, zet dan alle code in één blok en leg uit hoe ik ze als oefenen.html bewaar.

[voeg hier je leerstof toe]
:::

## Waar zie je het resultaat?

Dat hangt af van je chatbot. Sommige chatbots tonen de website meteen in een apart venster naast de chat, zodat je ze kunt uitproberen. Bij ChatGPT en Gemini heet dat op het moment van schrijven *Canvas*, bij Claude een *artefact*. Andere chatbots geven je een bestand of alleen de code.

Krijg je alleen code? Kopieer ze in een leeg tekstbestand, bewaar dat als `oefenen.html` en open het met een dubbelklik. Je browser toont dan de website. Op een laptop van school kan het zijn dat je geen bestanden mag bewaren of openen. Vraag het dan na bij je ICT-coördinator.

## Test voor je studeert

Een website die er goed uitziet, werkt niet altijd goed. Neem vijf minuten om ze te testen.

::: checklist Mijn oefenwebsite getest
- Alle woorden of begrippen uit mijn lijst staan erin, en er staat niets extra in.
- De vertalingen en definities komen overeen met mijn cursus.
- De flashcards draaien om en "Nog oefenen" laat een kaart terugkomen.
- Ik heb bewust een fout antwoord gegeven en de feedback klopt.
- Een fout antwoord komt terug in de ronde met mijn fouten.
:::

Werkt iets niet, zeg dan precies wat er misloopt. Bijvoorbeeld: "Als ik 'réfectoire' typ zonder 'le', rekent de quiz het juist. Dat moet fout zijn. Pas het aan en geef het volledige bestand opnieuw."

::: tip Punten zijn geen bewijs
Een voortgangsbalk en punten maken oefenen leuker. Maar veel punten betekent niet dat je de leerstof kent. Misschien waren de vragen te makkelijk, of herken je ze gewoon van de vorige ronde. Test jezelf ook eens zonder de site: schrijf vijf woorden uit je hoofd op.
:::

::: letop Wat stop je erin?
Gebruik alleen je eigen leerstof of materiaal dat je mag gebruiken. Zet er geen namen, punten of andere gegevens van jezelf of klasgenoten in. Wil je de site met je klas delen, vraag dan eerst aan je leerkracht of dat mag.
:::

::: kernpunten
- AI kan van je eigen leerstof een oefenwebsite maken met flashcards en een quiz.
- Laat AI eerst je leerstof tonen, kijk ze na en geef pas dan het akkoord om te bouwen.
- Test de inhoud én de werking, ook met een fout antwoord.
- Punten op de site zeggen niet alles: test jezelf ook zonder.
:::

::: nadenken
Voor welke leerstof die je nu van buiten moet kennen, zou een eigen oefenwebsite je het meest tijd besparen?
:::
