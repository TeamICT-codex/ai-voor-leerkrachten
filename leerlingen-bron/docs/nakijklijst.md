# Nakijklijst voor de maker

Alle 72 lessen en 8 quizzen zijn geschreven, door een tweede lezer nagekeken op Vlaams taalgebruik, feiten, plagiaat en samenhang, en technisch gevalideerd. Onderstaande punten zijn beweringen die een mens best nog even nakijkt vóór publicatie, omdat ze over snel veranderende tools gaan of een redactionele keuze vragen. Ze zijn gesorteerd op belang.

## Het leercollectief: te bevestigen door iemand van de scholengroep

- **Campus Nieuw Kwartier.** GO! atheneum Dendermonde en GO! MAD staan op Nieuw Kwartier 2; GO! talent heeft als adres Begijnhoflaan 1, maar de scholengroepsite noemt ze één campus. In de cursus staat "campus Nieuw Kwartier" alleen bij Noor (atheneum). Klopt dat beeld?
- **Fictieve details bij echte scholen.** Het doorlopende H4-voorbeeld van Noor speelt op de speelplaats van de campus Nieuw Kwartier, met een voetbalkooi, een telling om 12.45 uur en enquêteresultaten. Dat is verzonnen. Als het niet past bij de echte campus, kan de school een anonieme "campus" worden.
- **Studierichtingen per school** komen van de schoolwebsites (27 oktober 2026): elektromechanische technieken en lassen-constructie duaal op GO! technisch atheneum Lokeren, basiszorg en ondersteuning op GO! Campus Kompas, elektrotechnieken en zorg en welzijn op GO! talent, natuurwetenschappen op GO! middenschool De Moerbei, bedrijfswetenschappen en wetenschappen-wiskunde op GO! atheneum MiRA. Het aanbod van GO! atheneum Lokeren kon niet gelezen worden; Mila zit daar in "de doorstroomfinaliteit" zonder richting.
- **GO! CLB Prisma** staat als het CLB van onze scholen (uit de scholengroepsite). **Leersteuncentrum Plus²** staat alleen op de leerkrachtenpagina.
- **Het voorbereidend jaar hoger onderwijs** op GO! technisch atheneum Lokeren en **7 Plus** op GO! Campus Kompas staan in les 8.2 als voorbeeld van "na het zesde" (bron: de schoolwebsites).
- **Smartschool** wordt als platform van onze scholen verondersteld. Werkt een school met iets anders, dan zijn 2.3 en 4.11 de lessen om aan te passen.
- **Het logo** van Het leercollectief staat in de header en de footer (`assets/logo-leercollectief.svg`, overgenomen van de website). Controleer of dat de juiste versie van het logopakket is.
- **Les 2.6** gebruikt bewust geen vast personage in het fout-voorbeeld vol persoonsgegevens (Robbe, Ella, "mevrouw Peeters" zijn verzonnen namen). Zo komt geen vast personage negatief in beeld.

## Tools en menu's (veranderen snel; overal staat al "op het moment van schrijven")

- **1.6** Aanmeldadres voor Copilot met een schoolaccount: de les zegt copilot.microsoft.com; een Microsoft 365-schoolaccount komt vaak uit bij m365copilot.com of copilot.cloud.microsoft. Kies het adres dat jouw doelscholen gebruiken, of schrijf "via het Copilot-icoon in je Microsoft 365-omgeving".
- **1.6** Nagekeken op 27 oktober 2026: Mistral hernoemde Le Chat naar **Vibe** (chat.mistral.ai blijft werken) en hanteert 13 jaar, met ouderlijke toestemming onder de 18. De les, les 7.5 en de leerkrachtenpagina in `build/build.mjs` zijn aangepast.
- **2.9** Namen van instellingen: ChatGPT (Personalisatie, Aangepaste instructies, Gegevensbeheer, "Het model verbeteren voor iedereen"), Gemini (Gems, activiteit), Copilot (privacy, modeltraining). Controleer de Nederlandstalige labels.
- **3.9 t/m 3.11** Gemini Notebook (de nieuwe naam van NotebookLM sinds 16 juli 2026): de drie delen (Bronnen, Chat, Studio), de leervormen (mindmap, audio-overzicht, video-overzicht, flashcards, quiz), de knop "Aanpassen", en de minimumleeftijd voor privé- en schoolaccounts.
- **3.6** Spraakmodus: "icoontje met geluidsgolfjes", bij Gemini "Gemini Live".
- **4.3** "Projecten" in ChatGPT en Gems met bestanden in Gemini: werkt dat ook met een gratis account?
- **5.3** Lesdoel zegt "als audiobestand" en noemt Clipchamp; Clipchamp exporteert vooral video. Eventueel "audio of video".
- **6.1 en 6.4** De Engelse termen "canvas" en "artifact" voor het voorbeeldvenster van chatbots: houden of vernederlandsen.
- **6.4** GitHub vraagt minstens 13 jaar; de les zegt alleen "kijk de leeftijdsvoorwaarden na".
- **1.7** "Vaak rond de twintig euro per maand" voor een betaald account: klopt op het moment van schrijven.

## Feiten en bronnen

- **Alle 26 externe links** in de cursus zijn op 27 oktober 2026 nagelopen en geven alle een 200. Dat zegt niets over de inhoud erachter: of de omschrijving in de les nog bij de pagina past, blijft mensenwerk. `npm run links` controleert enkel de interne links.
- **1.4** Link naar de Europese IP Helpdesk (FAQ-pagina): bereikbaar op 27 oktober 2026, bestaan van de pagina af en toe nakijken.
- **4.11** "Zelfs de bedrijven achter detectietools raden af om een beslissing alleen op die score te baseren": juist, maar zonder bron in de tekst. Eventueel een bron toevoegen.
- **7.6** Kestin e.a. (Harvard, 2025): "194 studenten". Klopt volgens de reviewer, even nakijken in het artikel.
- **7.7** IEA-link: bereikbaar op 27 oktober 2026, en de passage over de afweging tussen water en elektriciteit staat er letterlijk in. De link wijst naar "Powering Artificial Intelligence" (oktober 2026), niet naar het oudere "Energy and AI" — de omschrijving in de les is daarop aangepast.
- **7.8** Lange link naar de voorjaarsprognose 2026 van de Europese Commissie: bereikbaar op 27 oktober 2026.
- **7.4** Nederlands onderzoek over gekloonde stemmen (Rijksoverheid, 2024) is bewust behouden, met de vermelding dat het Nederlands is en dat stemklonen in elke taal werkt. Vervangen door een Vlaamse bron als je er een vindt.

## Redactionele keuzes

- **Vaste personages.** De cursus werkt nu met elf vaste fictieve leerlingen, elk met één school, jaar en richting (tabel in `docs/leercollectief.md`). `build/personages.mjs` legt elke alinea naast die tabel en draait mee in `npm run check`. Wil je een personage veranderen, pas dan eerst de tabel aan en daarna de lessen; de controle wijst aan wat je nog vergeten bent.
- **"Stageverslag" en "stagemap"** zijn beide gebruikt; "verslag" als gewone schooltaak is overal vervangen door taak, paper of tekst.
- **7.4** De zin "Er bestaan apps die van een gewone foto een naaktbeeld maken" staat er bewust, zonder namen of instructies, met Child Focus en 1712 erbij. Beslis zelf of je het zo expliciet wilt.
- **Naam van de cursus.** "AI-wijs op school" is een werktitel; wijzig ze in `cursus.config.json`.
- **Video's.** Er zijn geen video's. Elke les heeft een leeg `video:`-veld in de frontmatter voor een eigen YouTube-id.

## Technisch, vóór publicatie

- Zet `basisUrl` in `cursus.config.json` als je de site op een subpad host (nu niet nodig: alle links zijn relatief).
- Het lettertype Poppins wordt van Google Fonts geladen; zonder internet valt de site terug op het systeemlettertype. Wil je geen externe aanroepen, haal de twee `<link>`-regels voor fonts uit `build/build.mjs`.
- Het certificaat is getest op 27 oktober 2026: de drempels kloppen (zonder naam blijft de knop uit), en bij het afdrukken blijft alleen het certificaat staan — kop, zijbalk, formulier en knop vallen weg, en het blad past op één pagina. Doe die test opnieuw na een wijziging aan `assets/style.css` of aan de certificaatvereisten.
