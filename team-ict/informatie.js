// De informatielaag van de pagina Team ICT: wat er speelt, de wegwijzer, de
// helpdesk in cijfers en het projectbord. Dit bestand is de bron: pas het hier
// aan, informatielaag.js zet het op de pagina. Het nieuws staat in nieuws.js.
//
// toon: waar "Toon in de raket" naartoe gaat. Een id uit PLEKKEN (plekken.js)
// opent dat kaartje in de raket; een #anker scrolt naar dat hoofdstuk.
//
// Wat hier staat, komt uit het overzicht "Rollen en verantwoordelijkheden Team
// ICT". Bewust niet: de interne aandachtspunten voor het beleid, en details
// over beveiliging die een aanvaller zouden helpen (trajecten rond back-ups,
// herstel na uitval en camera's staan op het bord alleen samen vermeld).

export const BIJGEWERKT = '2026-11-01';

// De hangijzers zijn ook de dossiers van het logboek: een bericht met
// dossier: 'grip' staat ook bij het hangijzer over GRIP. label: de korte naam
// op dat bericht. Een hangijzer dat van de pagina gaat terwijl er berichten aan
// hangen, zet je op `afgerond: true`: dan blijft het dossier bestaan, maar valt
// het uit de lijst van hangijzers.
// temp: hoeveel het dit schooljaar vraagt, van 1 tot 5.
export const HANGIJZERS = [
  { id: 'workspace', label: 'Eén Google-omgeving', titel: 'Zes scholen verhuizen naar één Google-omgeving', temp: 5, kort: 'De centralisatie van Google Workspace is vandaag het zwaarste lopende werk van het team.', wat: 'Scholen die nog met een eigen, losstaand Google-domein werken, verhuizen naar de centrale Workspace van Het leercollectief. Zes migraties lopen. Elke migratie raakt alle gebruikers, bestanden en klassen van een school.', waarom: 'Losse domeinen zijn moeilijk te beheren en te beveiligen, en elk domein is een uitzondering voor een team van vier. Eén centrale omgeving maakt samenwerken over scholen heen eenvoudiger.', wij: 'Het volledige team draagt dit: voorbereiding, uitvoering en nazorg, school per school.', jij: 'Is jouw school aan de beurt, dan verhuizen je account, je bestanden en je klassen mee. Merk je achteraf iets vreemds? Meld het via de helpdesk.', toon: ['plat'] },
  { id: 'beleidsplan', label: 'ICT-beleidsplan', titel: 'Elke school een ICT-beleidsplan', temp: 5, kort: 'Sinds 1 september 2026 heeft elke school een ICT-beleidsplan nodig.', wat: 'Het plan bevat ook het professionaliseringsbeleid en de aanpak rond digitale inclusie. Elke school moest op 1 september 2026 gestart zijn; de onderdelen hoeven dan nog niet volledig uitgewerkt te zijn.', waarom: 'Een goed plan zorgt dat ICT-keuzes vertrekken van wat je school pedagogisch wil, en niet omgekeerd. Het is ook de basis voor de verantwoording van de Digisprong-middelen in het Digiplan-dossier.', wij: 'We bouwden ICTCheck, dat je stap voor stap door het plan leidt, en volgen de opmaak en actualisering per school op.', jij: 'Directies en ICT-werkgroepen werken in ICTCheck. Krijg je als leerkracht een bevragingslink? Dan telt jouw stem mee.', toon: ['ictcheck'] },
  { id: 'minimumdoelen', label: 'Minimumdoelen', titel: 'Nieuwe minimumdoelen in het basisonderwijs', temp: 4, kort: 'Dit schooljaar start de invoering bij de kleuters en in het 1ste tot en met 3de leerjaar.', wat: 'Voorlopig gaat het om Nederlands, wiskunde en wetenschap en techniek. Daarna schuift de invoering schooljaar per schooljaar op naar de hogere leerjaren. ICT komt als leergebied aan bod vanaf 2027-2028.', waarom: 'Nieuwe doelen vragen nieuwe keuzes in de klas. De digitale hulpmiddelen en de leerlijn digitale competenties moeten mee, zodat leerkrachten er niet alleen voor staan.', wij: 'We volgen de invoering op vanuit pedagogische ICT en bereiden de leerlijn digitale competenties voor op ICT als leergebied.', jij: 'Sta je in de kleuterklas of in het 1ste tot en met 3de leerjaar? Dan werk je dit schooljaar al met de nieuwe doelen.', toon: ['minimumdoelen', 'doelen-lager', 'leerlijn'] },
  { id: 'grip', label: 'GRIP', titel: 'Informatieveiligheid en privacy: het GRIP-groeipad', temp: 4, kort: 'Zes stappen, van mei 2025 tot omstreeks 2028.', wat: 'GRIP is het groeipad informatieveiligheid en privacy van het Kenniscentrum Digisprong. Elk halfjaar komt er een stap vrij, telkens met organisatorische en technische maatregelen. De registratie gebeurt per school in de GRIPA-toepassing.', waarom: 'Scholen bewaren gevoelige gegevens over kinderen, ouders en personeel. Eén gehackt account of één datalek raakt meteen echte mensen.', wij: 'We bouwen de maatregelen stap voor stap op, zoals sterkere beveiligingsinstellingen en betere back-ups.', jij: 'Krijg je een verdachte mail? Klik niets aan en meld het meteen via de helpdesk. Twijfel je of je gegevens mag delen? Vraag het aan Gino, onze functionaris voor gegevensbescherming (DPO).', toon: ['veilig'] },
  { id: 'ai', label: 'AI in de klas', titel: 'AI in de klas, met duidelijke afspraken', temp: 4, kort: 'Welke AI-toepassingen, met welke licenties, en hoe gebruik je ze verantwoord?', wat: 'AI wordt in onze scholen al gebruikt, door leerkrachten en door leerlingen. De scholengroep kiest welke toepassingen ze aanbiedt, met de licenties, gebruiksvoorwaarden en afspraken die daarbij horen.', waarom: 'Liever een doordachte keuze met duidelijke afspraken over privacy en gebruik, dan dat elke leerkracht alleen moet uitzoeken wat mag.', wij: 'We selecteren toepassingen, regelen licenties samen met Team Financiën en de directies, en bieden vorming: de workshops AI voor leerkrachten en de leerlingencursus AI-wijs op school.', jij: 'Wil je AI gebruiken in je les? Begin bij de workshops of de leerlingencursus, en vraag het aan Thomas als je twijfelt over een toepassing.', toon: ['ai', 'aiwijs', 'vorming'] },
  { id: 'aanmelden', label: 'Eén account', titel: 'Eén account voor alles', temp: 3, kort: 'Minder wachtwoorden en minder gedoe bij het aanmelden.', wat: 'Met Edu Sync loopt een proefproject rond centrale aanmelding, met \'t Vlasbloempje als testschool. Op de lijst staan ook netwerkaanmelding met je eigen account en het automatisch aanmaken en afsluiten van accounts.', waarom: 'Eén identiteit voor alle platformen is gebruiksvriendelijker en veiliger: wie vertrekt, verliest overal tegelijk de toegang.', wij: 'We testen eerst grondig in één school. Slaagt de proef, dan volgt de uitrol naar de andere scholen.', jij: 'Voorlopig verandert er niets voor jou. Geraak je nergens meer aangemeld, ook niet na een reset? Meld het via de helpdesk.', toon: ['id'] },
  { id: 'nieuwescholen', label: 'Nieuwe scholen', titel: 'Nieuwe scholen stappen in', temp: 3, kort: 'Richtpunt, Kiempunt en Kleuterboompje komen op de standaard van de scholengroep.', wat: 'Elke school die instapt, krijgt netwerk, accounts, toestellen en platformen volgens de standaard van Het leercollectief. Grotere werken aan bekabeling, wifi en telefonie volgen later, als apart project per school.', waarom: 'Eén standaard voor elke school betekent dat ondersteuning overal even snel en even goed kan.', wij: 'Het volledige team begeleidt de overstap, per instapdatum.', jij: 'Werk je in een van deze scholen? Dan verandert er de komende tijd een en ander aan je account en je platformen. Vragen meld je via de helpdesk.', toon: ['plat', 'net'] },
];

// De wegwijzer. v: de vraag; wie: wie ze opvolgt; zoek: extra zoekwoorden.
export const VRAGEN = [
  { v: 'De wifi of het internet valt uit op de campus', wie: 'Dries', sub: 'netwerk en connectiviteit', zoek: 'wifi internet netwerk verbinding traag offline valt uit', toon: 'net' },
  { v: 'Een nieuwe collega heeft een account en de juiste rechten nodig', wie: 'Gino', sub: 'back-up Dries', zoek: 'account nieuw personeel collega rechten indiensttreding starter', toon: 'id' },
  { v: 'Ik geraak nergens meer aangemeld, ook niet na een reset', wie: 'Dries', sub: 'centraal aanmeldbeheer', zoek: 'wachtwoord paswoord aanmelden inloggen login reset geblokkeerd account', toon: 'id' },
  { v: 'Een toestel is stuk, of er moeten toestellen besteld worden', wie: 'Team ICT', sub: 'aankoop bij Gino', zoek: 'laptop chromebook stuk kapot defect bestellen tablet ipad toestel herstel digibord digiborden scherm schermen beamer projector touchscreen', toon: 'tst' },
  { v: 'Een printer of telefoontoestel werkt niet', wie: 'Gino', sub: 'back-up Dries', zoek: 'printer printen scannen scanner kopiëren kopieerapparaat telefoon toner', toon: 'tst' },
  { v: 'Instellingen of beheer van een personeelslaptop', wie: 'Dries', sub: 'Intune', zoek: 'laptop instellingen software installeren intune windows update', toon: 'tst' },
  { v: 'Een vraag over Outlook, Teams of gebruikersrechten', wie: 'Gino', sub: 'back-up Dries', zoek: 'outlook mail teams microsoft 365 onedrive sharepoint rechten', toon: 'plat' },
  { v: 'Een vraag over Smartschool', wie: 'De school zelf', sub: 'basisconfiguratie: Team ICT', tip: 'Het schoolspecifieke beheer van Smartschool hoort bij je school. Team ICT zorgt voor de basisconfiguratie en de opstart.', zoek: 'smartschool berichten puntenboek agenda skore', toon: 'plat' },
  { v: 'Een vraag over Google Workspace of Classroom', wie: 'Het volledige team', sub: 'gedeeld domein', zoek: 'google classroom drive gmail workspace docs', toon: 'plat' },
  { v: 'Een vraag over Het leercollectief Portaal', wie: 'Gino', sub: 'back-up volledig team', zoek: 'portaal scholengroepportaal documenten attest inschrijven', toon: 'plat' },
  { v: 'Hoe zetten we AI zinvol in, of hebben we licenties nodig?', wie: 'Thomas', sub: 'back-up Gino', zoek: 'ai chatgpt claude gemini copilot licentie artificiële intelligentie', toon: 'ai' },
  { v: 'Een voorstel of vraag over nieuwe technische systemen', wie: 'Dries en Gino', sub: 'technische innovatie', zoek: 'voorstel nieuw systeem server beveiliging aanmelding innovatie', toon: 'srv' },
  { v: 'Vorming of nascholing voor een schoolteam of vakgroep', wie: 'Thomas', sub: 'back-up Stef', zoek: 'vorming nascholing workshop opleiding professionalisering studiedag', toon: 'vorming' },
  { v: 'De leerlijn digitale competenties', wie: 'Thomas', sub: 'back-up Stef', zoek: 'leerlijn digitale competenties mediawijsheid ict leergebied', toon: 'leerlijn' },
  { v: 'Het ICT-beleidsplan, ICTCheck of het Digiplan-dossier', wie: 'Thomas', sub: 'back-up Stef', zoek: 'beleidsplan ictcheck digiplan digisprong plan', toon: 'ictcheck' },
  { v: 'Het Rekencollectief gebruiken in mijn klas', wie: 'Thomas', sub: 'back-up Stef', zoek: 'rekenen tafels maaltafels deeltafels rekencollectief automatiseren getallenreis', toon: 'reken' },
  { v: 'TALent voor Taal starten in mijn school', wie: 'Thomas', sub: 'pedagogische ICT', zoek: 'taal schooltaal okan woorden talent woordenschat', toon: 'talent' },
  { v: 'Een AI-cursus voor mijn leerlingen', wie: 'Thomas', sub: 'pedagogische ICT', zoek: 'ai cursus leerlingen ai-wijs chatbot gip', toon: 'aiwijs' },
  { v: 'Een vraag over persoonsgegevens, privacy of een mogelijk datalek', wie: 'Gino', sub: 'als DPO · techniek bij Dries', zoek: 'privacy privé gdpr datalek persoonsgegevens foto toestemming dpo', toon: 'veilig' },
  { v: 'Ik vermoed een beveiligingsincident of kreeg een verdachte mail', wie: 'Dries en Gino', sub: 'techniek en communicatie', tip: 'Klik niets aan, geef geen wachtwoord in en meld het meteen. Heb je al geklikt? Meld het dan zeker, liefst onmiddellijk.', dringend: true, zoek: 'phishing verdachte mail hack gehackt virus incident vreemde link', toon: 'veilig' },
  { v: 'De schoolwebsite, of e-mails die niet aankomen', wie: 'Dries met Eef van communicatie', sub: 'techniek en ontwerp', zoek: 'website mail komt niet aan spam e-mail' },
  { v: 'Een investering of aankoop die budgettair afgetoetst moet worden', wie: 'Team ICT met Team Financiën', sub: 'voorstel en aftoetsing', zoek: 'budget aankoop offerte investering financiën', toon: '#wie' },
  { v: 'Een probleem dat niet op afstand op te lossen is', wie: 'Het volledige team', sub: 'interventie op locatie', zoek: 'ter plaatse langskomen interventie', toon: 'helpdesk' },
];
// Wat je ziet zolang je niets zoekt.
export const TOPVRAGEN = [
  'Ik vermoed een beveiligingsincident of kreeg een verdachte mail',
  'Ik geraak nergens meer aangemeld, ook niet na een reset',
  'De wifi of het internet valt uit op de campus',
  'Een toestel is stuk, of er moeten toestellen besteld worden',
  'Het Rekencollectief gebruiken in mijn klas',
  'Het ICT-beleidsplan, ICTCheck of het Digiplan-dossier',
];

// Voorbeeldcijfers: de echte komen uit de rapportage van het ticketsysteem.
export const HELPDESK_CIJFERS = {
  voorbeeld: true,
  periode: 'Schooljaar 2025-2026',
  kern: [['3.482', 'meldingen in het hele schooljaar'], ['1u50', 'tot de eerste reactie (mediaan, werkuren)'], ['72%', 'opgelost binnen één werkdag'], ['4,6/5', 'tevredenheid na afsluiting']],
  maanden: [['sep', 612], ['okt', 401], ['nov', 318], ['dec', 214], ['jan', 356], ['feb', 287], ['mrt', 301], ['apr', 238], ['mei', 297], ['jun', 458]],
  pieken: ['sep', 'jun'],
  categorieen: [['Accounts en aanmelden', 31], ['Toestellen', 22], ['Netwerk en wifi', 14], ['Platformen en software', 12], ['Printen en scannen', 9], ['Digiborden en schermen', 7], ['Andere', 5]],
  inzichten: [
    { tekst: 'Bijna een derde van de meldingen gaat over accounts en aanmelden. Daarom werken we aan één account voor alles.', toon: 'id', knop: 'Bekijk Identiteit en aanmelding' },
    { tekst: 'In september en juni pieken de meldingen: nieuwe leerlingen, nieuwe toestellen en het einde van het schooljaar.' },
  ],
};

// status: gebruik (in gebruik), loopt (loopt nu) of lijst (op de lijst, nog
// zonder volgorde). soort: pedagogisch of technisch.
export const BORD = [
  { naam: 'ICTCheck', status: 'gebruik', waar: 'Beleid & directie', soort: 'pedagogisch', wanneer: 'ICT-beleidsplan verplicht sinds 1 september 2026', trekker: 'Thomas', toon: 'ictcheck' },
  { naam: 'Leerlijn digitale competenties', status: 'loopt', waar: 'Beleid & directie', soort: 'pedagogisch', wanneer: 'groeit mee met de minimumdoelen', trekker: 'Thomas', toon: 'leerlijn' },
  { naam: 'AI in onze scholen', status: 'loopt', waar: 'Beleid & directie', soort: 'pedagogisch', trekker: 'Thomas', toon: 'ai' },
  { naam: 'Tools tegen planlast', status: 'lijst', waar: 'Beleid & directie', soort: 'pedagogisch', trekker: 'Thomas', toon: 'planlast' },
  { naam: 'TALent voor Taal', status: 'gebruik', waar: 'Secundair', soort: 'pedagogisch', wanneer: 'uitrol loopt', trekker: 'Thomas', toon: 'talent' },
  { naam: 'AI-wijs op school', status: 'gebruik', waar: 'Secundair', soort: 'pedagogisch', wanneer: '9 hoofdstukken, 72 lessen', trekker: 'Thomas', toon: 'aiwijs' },
  { naam: 'Rekencollectief', status: 'gebruik', waar: 'Lager', soort: 'pedagogisch', trekker: 'Thomas', toon: 'reken' },
  { naam: 'Nieuwe minimumdoelen', status: 'loopt', waar: 'Lager en Kleuter', soort: 'pedagogisch', wanneer: '2026-2027: kleuters en 1ste tot en met 3de leerjaar · daarna jaar per jaar verder', trekker: 'Thomas', toon: 'minimumdoelen' },
  { naam: 'Taalappke', status: 'loopt', waar: 'Kleuter', soort: 'pedagogisch', wanneer: 'In ontwikkeling', trekker: 'Thomas', toon: 'taalkleuter' },
  { naam: 'Vorming & ondersteuning', status: 'gebruik', waar: 'De toren', soort: 'pedagogisch', wanneer: 'Doorlopend', trekker: 'Thomas', toon: 'vorming' },
  { naam: 'GRIP: groeipad informatieveiligheid en privacy', status: 'loopt', waar: 'De motor · SEC-05 · Veiligheid & privacy', soort: 'technisch', wanneer: 'Mei 2025 tot omstreeks 2028', toon: 'veilig' },
  { naam: 'Centralisatie van Google Workspace', status: 'loopt', waar: 'De motor · PLT-04 · Platformen', soort: 'technisch', wanneer: 'zes migraties bezig', trekker: 'Volledig team', toon: 'plat' },
  { naam: 'Datacenterserver voor de scholengroep', status: 'loopt', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Dries', toon: 'srv' },
  { naam: 'Edu Sync: centrale aanmelding', status: 'loopt', waar: 'De motor · ID-02 · Identiteit & aanmelding', soort: 'technisch', wanneer: 'Proefproject', trekker: 'Dries', toon: 'id' },
  { naam: 'Eigen toepassingen voor de klaspraktijk', status: 'loopt', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'pedagogisch', trekker: 'Thomas', toon: 'srv' },
  { naam: 'Netwerkproject Campus Kompas en MIRA', status: 'loopt', waar: 'De motor · NET-01 · Netwerk & telefonie', soort: 'technisch', trekker: 'Dries', toon: 'net' },
  { naam: 'Nieuwe scholen in de scholengroep', status: 'loopt', waar: 'De motor · PLT-04 · Platformen', soort: 'technisch', wanneer: 'Per instapdatum', trekker: 'Volledig team', toon: 'plat' },
  { naam: 'Plus²: website, aanmeldingstool en kilometervergoeding', status: 'loopt', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Dries en Thomas', toon: 'srv' },
  { naam: 'Automatisering van accountbeheer', status: 'lijst', waar: 'De motor · ID-02 · Identiteit & aanmelding', soort: 'technisch', trekker: 'Dries', toon: 'id' },
  { naam: 'Datamigratie van bestaande scholen', status: 'lijst', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Dries', toon: 'srv' },
  { naam: 'Documentatie van beheer en procedures', status: 'lijst', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Volledig team', toon: 'srv' },
  { naam: 'Netwerkaanmelding met je eigen account', status: 'lijst', waar: 'De motor · NET-01 · Netwerk & telefonie', soort: 'technisch', trekker: 'Dries', toon: 'net' },
  { naam: 'Netwerk en telefonie bij nieuwe scholen', status: 'lijst', waar: 'De motor · NET-01 · Netwerk & telefonie', soort: 'technisch', trekker: 'Dries en Gino', toon: 'net' },
  { naam: 'Optimalisatie en standaardisatie', status: 'lijst', waar: 'De motor · TST-03 · Toestellen & printers', soort: 'technisch', trekker: 'Dries', toon: 'tst' },
  { naam: 'Software op maat', status: 'lijst', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Dries en Thomas', toon: 'srv' },
  { naam: 'Websites en digitale communicatie', status: 'lijst', waar: 'De motor · SRV-06 · Servers & eigen toepassingen', soort: 'technisch', trekker: 'Eef (communicatie) en Thomas', toon: 'srv' },
];
// Wat er bewust niet op het bord staat, in één zin.
export const BORD_NOOT = 'Daarnaast zijn er trajecten rond back-ups, herstel na grote uitval en camerabewaking. Die zetten we bewust niet in detail op een openbare pagina.';
