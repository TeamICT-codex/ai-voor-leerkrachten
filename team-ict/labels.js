// De labels van het logboek: voor wie een bericht is, over welke scholen of welk
// onderwijsniveau het gaat, waarover het gaat en wat voor bericht het is.
//
// Het gewone geval is een bericht voor iedereen, in alle scholen: dan laat je
// `voor`, `niveaus` en `scholen` gewoon weg. Geef ze alleen op als een bericht
// echt maar een deel van de mensen aanbelangt. Een lezer die "Mijn rol" of
// "Mijn school" kiest, ziet dan wat voor hem geldt, plus alles wat voor iedereen is.
//
// Een id verander je niet meer zodra een bericht hem gebruikt: `node
// team-ict/controle.mjs` slaat alarm bij een id die niet (meer) bestaat.

// Voor wie. naam: op het label bij een bericht; ik: in de keuzelijst "Mijn rol";
// wie: in een zin ("Je ziet wat voor leerkrachten geldt").
export const ROLLEN = [
  { id: 'directie', naam: 'Directie', ik: 'directie', wie: 'de directie' },
  { id: 'leerkracht', naam: 'Leerkrachten', ik: 'leerkracht', wie: 'leerkrachten' },
  { id: 'ict', naam: 'ICT-coördinatoren', ik: 'ICT-coördinator of ICT-aanspreekpunt', wie: 'ICT-coördinatoren' },
  { id: 'secretariaat', naam: 'Secretariaat', ik: 'secretariaat of administratie', wie: 'het secretariaat' },
  { id: 'zorg', naam: 'Zorg en leerlingenbegeleiding', ik: 'zorg of leerlingenbegeleiding', wie: 'zorg en leerlingenbegeleiding' },
  { id: 'opvoeder', naam: 'Opvoeders', ik: 'opvoeder (ook in het internaat)', wie: 'opvoeders' },
  { id: 'centraal', naam: 'Centrale diensten', ik: 'centrale diensten van de scholengroep', wie: 'de centrale diensten' },
];

// Het onderwijsniveau. Een bericht met `niveaus` past bij elke school die minstens
// één van die niveaus heeft.
export const NIVEAUS = [
  { id: 'kleuter', naam: 'Kleuteronderwijs', kort: 'Kleuter' },
  { id: 'lager', naam: 'Lager onderwijs', kort: 'Lager' },
  { id: 'bubao', naam: 'Buitengewoon basisonderwijs', kort: 'BuBaO' },
  { id: 'secundair', naam: 'Secundair onderwijs', kort: 'Secundair' },
  { id: 'buso', naam: 'Buitengewoon secundair onderwijs', kort: 'BuSO' },
  { id: 'volwassenen', naam: 'Volwassenenonderwijs', kort: 'Volwassenen' },
  { id: 'internaat', naam: 'Internaat', kort: 'Internaat' },
];

// De 33 scholen van GO! scholengroep Het leercollectief, zoals hetleercollectief.be
// ze op 5 november 2026 opsomde (soort school van daar; de niveaus van een gewone
// basisschool zijn kleuter en lager). naam: de officiële naam; kort: op het label
// en in de keuzelijst; waar: de gemeente of deelgemeente.
export const SCHOLEN = [
  // basisonderwijs
  { id: 'bs-atheneum', naam: 'GO! basisschool atheneum', kort: 'Basisschool atheneum', waar: 'Dendermonde', niveaus: ['kleuter', 'lager'] },
  { id: 'bunderbos', naam: 'GO! basisschool Bunderbos', kort: 'Bunderbos', waar: 'Zele', niveaus: ['kleuter', 'lager'] },
  { id: 'bs-kompas', naam: 'GO! basisschool Campus Kompas', kort: 'Basisschool Campus Kompas', waar: 'Wetteren', niveaus: ['kleuter', 'lager'] },
  { id: 'bijenkorf', naam: 'GO! basisschool De Bijenkorf', kort: 'De Bijenkorf', waar: 'Sint-Gillis-bij-Dendermonde', niveaus: ['kleuter', 'lager'] },
  { id: 'de-leefschool', naam: 'GO! basisschool De Leefschool', kort: 'De Leefschool', waar: 'Oosterzele', niveaus: ['kleuter', 'lager'] },
  { id: 'madelief', naam: 'GO! basisschool De Madelief', kort: 'De Madelief', waar: 'Lokeren', niveaus: ['kleuter', 'lager'] },
  { id: 'ontdekkers', naam: 'GO! basisschool De Ontdekkers', kort: 'De Ontdekkers', waar: 'Hamme', niveaus: ['kleuter', 'lager'] },
  { id: 'rozen', naam: 'GO! basisschool De Rozen', kort: 'De Rozen', waar: 'Lokeren', niveaus: ['kleuter', 'lager'] },
  { id: 'springplank', naam: 'GO! basisschool De Springplank', kort: 'De Springplank', waar: 'Lokeren', niveaus: ['kleuter', 'lager'] },
  { id: 'tovertuin', naam: 'GO! basisschool De Tovertuin', kort: 'De Tovertuin', waar: 'Lokeren', niveaus: ['kleuter', 'lager'] },
  { id: 'zonnebloem', naam: 'GO! basisschool De Zonnebloem', kort: 'De Zonnebloem', waar: 'Kalken', niveaus: ['kleuter', 'lager'] },
  { id: 'konkelgoed', naam: 'GO! basisschool ’t Konkelgoed', kort: '’t Konkelgoed', waar: 'Lebbeke', niveaus: ['kleuter', 'lager'] },
  { id: 'vlasbloempje', naam: 'GO! basisschool ’t Vlasbloempje', kort: '’t Vlasbloempje', waar: 'Grembergen', niveaus: ['kleuter', 'lager'] },
  { id: 'vierhuizen-meir', naam: 'GO! basisschool Vierhuizen en Meir', kort: 'Vierhuizen en Meir', waar: 'Buggenhout', niveaus: ['kleuter', 'lager'] },
  { id: 'klim-op', naam: 'GO! beleefschool Klim Op', kort: 'Beleefschool Klim Op', waar: 'Lokeren', niveaus: ['kleuter', 'lager'] },
  { id: 'kleuterboompje', naam: 'GO! kleuterschool ’t Kleuterboompje', kort: '’t Kleuterboompje', waar: 'Wetteren', niveaus: ['kleuter'] },
  { id: 'leefschool-dendermonde', naam: 'GO! leefschool Dendermonde', kort: 'Leefschool Dendermonde', waar: 'Dendermonde', niveaus: ['kleuter', 'lager'] },
  { id: 'eureka', naam: 'GO! leefschool Eureka', kort: 'Leefschool Eureka', waar: 'Wetteren', niveaus: ['kleuter', 'lager'] },
  { id: 'veertje', naam: 'GO! leefschool ’t Veertje', kort: '’t Veertje', waar: 'Hamme', niveaus: ['kleuter', 'lager'] },
  { id: 'sterrenbos', naam: 'GO! unescoschool Sterrenbos', kort: 'Sterrenbos', waar: 'Hamme', niveaus: ['kleuter', 'lager'] },
  // buitengewoon basisonderwijs
  { id: 'bubao-klim-op', naam: 'GO! BuBaO Klim Op', kort: 'BuBaO Klim Op', waar: 'Lokeren', niveaus: ['bubao'] },
  { id: 'kiempunt', naam: 'GO! BuBaO Kiempunt campus Buggenhout', kort: 'Kiempunt', waar: 'Buggenhout', niveaus: ['bubao'] },
  // secundair onderwijs
  { id: 'atheneum-dendermonde', naam: 'GO! atheneum Dendermonde', kort: 'Atheneum Dendermonde', waar: 'Dendermonde', niveaus: ['secundair'] },
  { id: 'atheneum-lokeren', naam: 'GO! atheneum Lokeren', kort: 'Atheneum Lokeren', waar: 'Lokeren', niveaus: ['secundair'] },
  { id: 'mira', naam: 'GO! atheneum MIRA', kort: 'Atheneum MIRA', waar: 'Hamme', niveaus: ['secundair'] },
  { id: 'kompas', naam: 'GO! Campus Kompas', kort: 'Campus Kompas', waar: 'Wetteren', niveaus: ['secundair'] },
  { id: 'mad', naam: 'GO! MAD', kort: 'MAD', waar: 'Dendermonde', niveaus: ['secundair'] },
  { id: 'moerbei', naam: 'GO! middenschool De Moerbei', kort: 'De Moerbei', waar: 'Moerbeke-Waas', niveaus: ['secundair'] },
  { id: 'talent', naam: 'GO! talent', kort: 'Talent', waar: 'Dendermonde en Zele', niveaus: ['secundair'] },
  { id: 'ta-lokeren', naam: 'GO! technisch atheneum Lokeren', kort: 'Technisch atheneum Lokeren', waar: 'Lokeren', niveaus: ['secundair'] },
  // buitengewoon secundair onderwijs
  { id: 'richtpunt', naam: 'GO! SBSO Richtpunt campus Buggenhout', kort: 'Richtpunt', waar: 'Buggenhout', niveaus: ['buso'] },
  // volwassenenonderwijs en internaat
  { id: 'focus', naam: 'CVO Focus', kort: 'CVO Focus', waar: 'Lokeren', niveaus: ['volwassenen'] },
  { id: 'internaat', naam: 'GO! internaat Dendermonde', kort: 'Internaat Dendermonde', waar: 'Dendermonde', niveaus: ['internaat'] },
];

// In de keuzelijst "Mijn school" staan de scholen in deze groepen.
export const SCHOOLGROEPEN = [
  { naam: 'Basisonderwijs', niveaus: ['kleuter', 'lager'] },
  { naam: 'Buitengewoon basisonderwijs', niveaus: ['bubao'] },
  { naam: 'Secundair onderwijs', niveaus: ['secundair'] },
  { naam: 'Buitengewoon secundair onderwijs', niveaus: ['buso'] },
  { naam: 'Volwassenenonderwijs en internaat', niveaus: ['volwassenen', 'internaat'] },
];

// Waarover het gaat. Elk bericht heeft er minstens één. zoek: extra woorden
// waarop het zoekveld een bericht met dit onderwerp ook vindt.
export const THEMAS = [
  { id: 'accounts', naam: 'Accounts en aanmelden', zoek: 'account wachtwoord paswoord login inloggen aanmelden rechten' },
  { id: 'netwerk', naam: 'Netwerk en wifi', zoek: 'wifi internet netwerk verbinding' },
  { id: 'toestellen', naam: 'Toestellen en printers', zoek: 'laptop chromebook ipad tablet digibord scherm beamer printer printen scanner telefoon telefonie' },
  { id: 'platformen', naam: 'Smartschool, Google en Microsoft', zoek: 'smartschool google classroom drive gmail workspace microsoft outlook teams onedrive sharepoint portaal' },
  { id: 'veiligheid', naam: 'Veiligheid en privacy', zoek: 'veiligheid privacy phishing gdpr datalek grip dpo back-up' },
  { id: 'ai', naam: 'AI', zoek: 'ai artificiële intelligentie chatgpt claude gemini copilot chatbot' },
  { id: 'klas', naam: 'ICT in de klas', zoek: 'klas les leerlingen leerlijn minimumdoelen rekencollectief' },
  { id: 'vorming', naam: 'Vorming', zoek: 'vorming nascholing workshop opleiding studiedag' },
  { id: 'beleid', naam: 'Beleid en planning', zoek: 'beleid beleidsplan ictcheck digiplan digisprong plan' },
  { id: 'aankoop', naam: 'Aankoop en licenties', zoek: 'aankoop bestellen budget offerte licentie licenties' },
  { id: 'werking', naam: 'Team ICT en de helpdesk', zoek: 'team ict helpdesk melding ticket' },
];

// Wat voor bericht. Laat je `soort` weg, dan is het 'info'.
// - actie: iemand moet iets doen. Vraagt `tegen` (de uiterste datum) en `taak`
//   (wat er moet gebeuren, kort, als opdracht: "Start je plan in ICTCheck").
// - onderbreking: gepland onderhoud of een storing. Vraagt `op` (en `tot` als het
//   langer dan een dag duurt).
// - aanbod: vorming of een nieuw hulpmiddel. `op` (de dag zelf) of `tegen`
//   (inschrijven tot) mag, met een `taak`. Met `op` én `tegen` hoort de taak bij
//   `tegen`: "Schrijf je in" verdwijnt na de inschrijfdatum, de dag zelf blijft.
// Alles met een `tegen` of `op` die nog moet komen, staat in "Op de agenda".
export const SOORTEN = [
  { id: 'info', naam: 'Ter info' },
  { id: 'actie', naam: 'Actie nodig' },
  { id: 'verandering', naam: 'Verandering' },
  { id: 'onderbreking', naam: 'Onderbreking' },
  { id: 'aanbod', naam: 'Aanbod' },
];
