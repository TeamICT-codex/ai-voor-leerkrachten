// Het logboek: de berichten die vroeger in de ICT-nieuwsbrief en in losse mails
// stonden. Een nieuw bericht zet je bovenaan. De labels (rollen, niveaus, scholen,
// onderwerpen en soorten) staan in labels.js, de dossiers zijn de hangijzers in
// informatie.js. Kijk na met `node team-ict/controle.mjs`.
//
// Een bericht:
//   id        vaste sleutel: kleine letters, cijfers en streepjes. Het bericht staat
//             op …/team-ict/#bericht-<id>; die link mag je in een mail of in
//             Smartschool zetten. Verander hem nooit meer na publicatie.
//   datum     'JJJJ-MM-DD' (of 'JJJJ-MM' als de dag niet vaststaat)
//   titel     zegt wat er verandert, niet "Nieuws over ..."
//   tekst     de eerste zin zegt voor wie het is en wat die moet doen
//   thema     een of meer onderwerpen uit THEMAS
//   soort     'actie', 'verandering', 'onderbreking' of 'aanbod'; weglaten = ter info
//   voor      rollen uit ROLLEN; weglaten = iedereen
//   niveaus   niveaus uit NIVEAUS; weglaten = alle niveaus
//   scholen   scholen uit SCHOLEN; weglaten = alle scholen (het gewone geval)
//   tegen     uiterste datum van een actie of van het inschrijven, met `taak`
//   taak      wat er moet gebeuren, kort: "Start je plan in ICTCheck"
//   op, tot   de dag (of de dagen) van een onderbreking of van een aanbod; met op
//             én tegen hoort de taak bij tegen (inschrijven tot)
//   dossier   id van een hangijzer: het bericht staat dan ook bij dat hangijzer
//   toon      id van een plek in de raket, of '#wie'
//   link      { tekst, url }: een formulier of een handleiding, altijd https
//   vervangt  ids van oudere berichten die hierdoor niet meer kloppen; die blijven
//             staan, met het label "Achterhaald" en een verwijzing naar dit bericht
//   bijgewerkt de datum waarop je dit bericht achteraf nog aanpaste
//
// Voorbeeld van een bericht voor een deel van de scholen, met een actie:
//   { id: 'workspace-rozen', datum: '2027-01-08', titel: 'De Rozen verhuist naar de centrale Google-omgeving',
//     tekst: '...', thema: ['platformen'], soort: 'actie', scholen: ['rozen'], voor: ['leerkracht'],
//     tegen: '2027-01-29', taak: 'Zet je bestanden in je gedeelde drive', dossier: 'workspace' },
export const NIEUWS = [
  { id: 'team-ict-in-een-raket', datum: '2026-11-01', titel: 'Team ICT in een raket', tekst: 'Deze pagina vervangt de ICT-nieuwsbrief. Wat we doen, waarom, en bij wie je terechtkunt, staat voortaan op één plek. Zet ze bij je favorieten.', thema: ['werking'], soort: 'verandering' },
  { id: 'rollen-vastgelegd', datum: '2026-09-11', titel: 'Rollen en verantwoordelijkheden vastgelegd', tekst: 'Per ICT-domein staat nu vast wie het overzicht bewaakt en wie meewerkt. Zo weet iedereen bij wie een dossier hoort.', thema: ['werking'], toon: '#wie' },
  { id: 'ictcheck-start', datum: '2026-09-01', titel: 'ICT-beleidsplan verplicht, ICTCheck staat klaar', tekst: 'Vanaf dit schooljaar heeft elke school een ICT-beleidsplan nodig. ICTCheck leidt je er stap voor stap door.', thema: ['beleid'], soort: 'verandering', voor: ['directie', 'ict'], dossier: 'beleidsplan', toon: 'ictcheck' },
  { id: 'minimumdoelen-start', datum: '2026-09-01', titel: 'Start van de nieuwe minimumdoelen', tekst: 'De invoering begint bij de kleuters en in het 1ste tot en met 3de leerjaar, voor Nederlands, wiskunde en wetenschap en techniek.', thema: ['klas'], soort: 'verandering', niveaus: ['kleuter', 'lager'], dossier: 'minimumdoelen', toon: 'minimumdoelen' },
  { id: 'grip-start', datum: '2025-05', titel: 'Start van het GRIP-groeipad', tekst: 'De scholengroep startte met het groeipad informatieveiligheid en privacy. Tot omstreeks 2028 volgen zes stappen.', thema: ['veiligheid'], dossier: 'grip', toon: 'veilig' },
];
