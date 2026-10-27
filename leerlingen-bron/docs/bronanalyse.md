# Bronanalyse · aivoorleerlingen.nl/cursus

Wat we leerden uit de analyse van de oorspronkelijke cursus, met REA (Reverse Engineer Anything, github.com/morluto/rea) en een gewone browser. Deze analyse diende alleen om de opbouw en het didactische concept te begrijpen. Er is geen tekst, beeld of code overgenomen.

## Werkwijze

1. **Pagina's opgehaald.** Het cursusoverzicht en alle 72 lespagina's zijn server-side gerenderd (Next.js). De tekst van elke les kon dus rechtstreeks uit de HTML gehaald worden, zonder account.
2. **REA tegen een headless Chrome.** Met `rea inspect-web-page` en `rea analyze-web-bundle` (via de Chrome DevTools Protocol-poort van een headless Chrome) kregen we de DOM-structuur, de scriptbundels en een route-inventaris. REA zelf heeft Node 22.23 of hoger als vereiste; op Node 22.19 werkt het met een waarschuwing.
3. **Clientgegevens.** De quizvragen staan niet in de HTML maar in een gedeelde JavaScript-chunk als ingebedde JSON (`JSON.parse('...')`). Daar vonden we ook de hoofdstukstructuur en de alt-teksten van de infographics (korte samenvattingen per les).

## Wat de oorspronkelijke cursus is

- **Techniek:** Next.js met Turbopack, Tailwind-achtige CSS, lettertype Poppins, primaire kleur paars (#5f3792) met accenten in groenblauw. Routes voor accounts, docenten-klassen (`/docent/klassen`) en beheer; progressie via `/api/ai-course/account/progress` en een certificaat via `/api/ai-course/certificate`.
- **Structuur:** 9 hoofdstukken, 72 lessen, 8 hoofdstukquizzen van tien vragen (80 % om te slagen). Drie stappen: basis (H1–H2), keuzeroute (H3–H8), afronding (H9).
- **Lesopbouw:** titel, intro, YouTube-video van de maker, genummerde secties met uitleg, interactieve elementen (kies-een-voorbeeld, promptkaarten met kopieerknop, invulformulieren die een prompt samenstellen, "speel opnieuw"-animaties), een infographic met "Kernpunten in tekst", een vraag-en-ervaring-sectie (alleen voor ingelogde leerlingen), en "Markeer als voltooid" met vorige/volgende les.
- **Quiz:** één vraag per keer, keuze bevestigen, feedback per optie, meteen weten waarom, opnieuw proberen mag, beste score blijft staan.
- **Doelgroep en taal:** vmbo, havo en vwo; Nederlands-Nederlandse schoolcontext (docent, werkstuk, profielwerkstuk, mondeling, brugklas).

## Wat we overnamen als concept

- De drie stappen en de keuzeroute.
- Eén les = één concrete handeling met eigen leerstof.
- Promptkaarten met kopieerknop en een promptbouwer.
- Quizzen als situaties uit het schoolleven met feedback per optie.
- Voortgang lokaal bewaren en een certificaat.

## Wat we bewust anders deden

- **Geen account, geen server.** Alles lokaal in de browser, met een exporteerbare voortgangscode.
- **Geen video's.** De lessen zijn tekst met blokken; een `video:`-veld in de frontmatter laat toe later eigen video's toe te voegen.
- **Geen reacties/community.** In de plaats: een denkvraag met een lokaal bewaard antwoord.
- **Vlaamse context overal:** finaliteiten, GIP, examens in december en juni, Smartschool, schoolaccounts (Microsoft 365 en Google Workspace), Vlaamse onderwijsdoelen (sleutelcompetentie 4), het Europese kader voor AI-geletterdheid, Child Focus en 1712, Onderwijskiezer en CLB.
- **Eigen vormgeving:** blauw met geel accent, lettertype Nunito, eigen pictogrammen en blokstijlen.

## Bronnen voor de Vlaamse context

- Kenniscentrum Digisprong, "AI-geletterdheid: duidelijke competenties ..." (vier domeinen: Omgaan met AI, Creëren met AI, AI beheren, AI ontwerpen; AI-geletterdheid in PISA 2029).
- Kenniscentrum Digisprong, "AI in het onderwijs: waarom zijn ethische richtlijnen nodig" en "7 sleutelvoorwaarden voor betrouwbare AI" (EU).
- VRT NWS, juni 2026: Vlaamse universiteiten werken een AI-strategie voor het onderwijs uit; bijna de helft van de leerkrachten secundair gebruikt al AI.
- Digitaal Vlaanderen: verplichte AI-geletterdheid onder de AI-verordening; verboden toepassingen sinds februari 2025.
