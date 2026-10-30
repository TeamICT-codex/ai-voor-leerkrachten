# Contextblad · AI-wijs Start

Dit blad bevat de vaste personages van AI-wijs Start, de cursus voor de eerste
graad. `npm run check:start` legt de lessen naast de tabel hieronder
(`build/personages.mjs --cursus start`): staat een personage ergens in een ander
jaar of een andere klas, dan is dat een fout. Verander je iets aan een personage,
pas dan eerst deze tabel aan.

## Afspraken

- Vijf fictieve leerlingen **op een middenschool**, zonder echte school. Noem dus
  geen school van Het leercollectief bij een personage: de les moet in elke
  middenschool kloppen.
- Ze komen nergens anders voor: niet in AI-wijs op school, niet in Leerlichtjes.
  Omgekeerd gebruik je hier geen personages uit die cursussen.
- Elk personage hoort bij één jaar en één klas. Geen familienamen.
- Leerkrachten krijgen geen naam: "je leerkracht", "de leerkracht Frans".
- **Geen personage gebruikt op eigen houtje een chatbot**, niet thuis en niet op
  school. AI-wijs Start werkt in de klas, met de leerkracht en de chatbot van de
  school. In het eerste jaar is bij het begin van het schooljaar bijna niemand al
  dertien, tegen het einde ongeveer de helft.
- Ook de quizvraag over iemand die elke avond met een chatbot-personage praat
  (les 4) krijgt geen vast personage, maar "een vriendin". Zo wordt geen van de vijf
  "de eenzame leerling die alleen door een chatbot begrepen wordt". Het gesprek
  tussen Tuur en Nova blijft uitdrukkelijk een "stel dat".
- Gevoelige lessen (les 5 over naaktbeelden en afpersing) krijgen bewust geen
  vast personage, maar "iemand uit een andere klas". Zo wordt geen van de vijf
  het slachtoffer van wat in de les gebeurt.
- Nova is geen leerling maar een verzonnen personage in een app (les 4). Ze staat
  daarom niet in de tabel.

## Vaste personages

| Naam | School | Jaar en klas | Gebruik vooral voor |
|---|---|---|---|
| **Kato** | een middenschool | 1ste jaar, A-stroom (1A) | les 1: dezelfde app als Rayan, een heel andere feed; slotquiz: de paardenfeed, en de leeftijdsgrens zonder haar leeftijd te noemen |
| **Rayan** | een middenschool | 1ste jaar, B-stroom (1B) | les 1: zijn kijkgedrag in "Jij bent het algoritme"; les 3: de zieke vriend op een sorteerkaartje; slotquiz: de feed vol voetbal |
| **Febe** | een middenschool | 2de jaar, A-stroom (2A) | les 2: de foto van de file; slotquiz: de oefenprompt voor aardrijkskunde |
| **Tuur** | een middenschool | 2de jaar, B-stroom (2B) | les 4: het gesprek met Nova, als "stel dat" |
| **Selin** | een middenschool | 1ste jaar, A-stroom (1A) | les 2: de foto van de lege rekken; slotquiz: het vreemde dier |

De controle leest per alinea het jaar ("eerste jaar", "1ste jaar") en de klas
(1A, 1B, 2A, 2B). Staat er in één alinea meer dan één personage, dan slaat ze die
alinea over in plaats van te raden.
