// AL UITGEVOERD op 27 oktober 2026 — niet opnieuw draaien.
//
// Dit script verhuisde de duurtijd van de module naar de les: het zette
// `minuten` op elke les, schrapte `duur` op elke module en voegde
// `klaarzetten` toe waar dat ontbrak. Sindsdien telt moduleMinuten() in
// cursus.js de moduleduur op uit de lessen, en de sessiebouwer rekent ermee.
//
// Het staat hier omdat de repo de enige plek is waar een volgende sessie het
// nog kan terugvinden, niet omdat het nog iets te doen heeft. Draai je het
// toch opnieuw, dan krijgt elke les een tweede `minuten`-veld en elke module
// een tweede `klaarzetten`. De tabel hieronder blijft wel bruikbaar als
// naslag: ze toont welke duurtijd elke les kreeg.

import { readFileSync, writeFileSync } from 'node:fs';

const MINUTEN = {
  // spoor C
  'waar-het-over-gaat': 10,
  'wie-beslist-wat': 25,
  'gdpr-mensentaal': 15,
  'ai-verordening': 10,
  'auteursrecht-en-delen': 10,
  'leerlingdata-minderjarigen': 15,
  'personeelsdata': 10,
  'afsprakenkader': 25,
  // spoor A
  'wat-is-ai-assistent': 15,
  'eerste-gesprek': 25,
  'vier-knoppen': 30,
  'bijsturen': 40,
  'lesopbouw': 30,
  'differentiatie': 35,
  'toetsvragen': 15,
  'feedback': 35,
  'oudercommunicatie': 15,
  'verslagen': 20,
  'privacy': 20,
  'betrouwbaarheid': 15,
  'leerlingen': 25,
  // casussen
  'casus-privacy': 30,
  'casus-leerlingen': 30,
  // spoor B
  'wat-is-vibe-coden': 15,
  'onderwijsprobleem-eerst': 25,
  'eerste-versie': 30,
  'testen-bijsturen': 30,
  'stijl-en-bruikbaarheid': 15,
  'afbeeldingen-bestanden': 40,
  'grotere-projecten': 15,
  'ai-als-tester': 35,
  'publiceren': 15,
  'in-de-klas': 20,
  'app-op-telefoon': 40,
  'wanneer-data': 10,
  'leerlingdata-veilig': 15,
  'versiebeheer': 40,
  'echte-database': 30,
  'projectgeheugen': 30,
  'wanneer-ai-inbouwen': 10,
  'modellen-en-kosten': 20,
  'sleutels-en-veiligheid': 40,
  'meer-dan-tekst': 30,
  'voorbeeld': 25,
  'voorbeeld-in-de-klas': 40,
};

const KLAARZETTEN = {
  'beleid-kader': [
    'Niets vooraf. Wil je de prompt in deze module uitproberen, hou dan een AI-assistent bij de hand.',
  ],
  'beleid-wet': [
    'Niets vooraf. Wil je de prompt in deze module uitproberen, hou dan een AI-assistent bij de hand.',
  ],
  'beleid-school': [
    'Het AI-beleid of het ICT-reglement van je school of scholengroep, als dat al bestaat.',
    'Voor de opdracht achteraan: een uur vergadertijd met het directieteam, de ICT-coördinator, de zorgcoördinator en twee of drie leerkrachten uit verschillende vakwerkgroepen of leerjaren.',
  ],
  'kennismaking': [
    'Een laptop of computer met internet.',
    'Een account bij een AI-assistent — of de tijd om er in deze module zelf een aan te maken. Voorziet je school of scholengroep er een, gebruik dan die.',
  ],
  'prompten': [
    'Een laptop en een werkend account bij een AI-assistent.',
    'Eén eigen lesonderdeel dat je binnenkort geeft, digitaal — zodat je er een stuk van kan kopiëren en plakken.',
  ],
  'lesvoorbereiding': [
    'Een laptop en een werkend account bij een AI-assistent.',
    'Eén bestaande oefening of werkblad van jezelf, digitaal.',
    'Het leerplandoel of de eindterm waar de les naartoe werkt, bij de hand.',
  ],
  'toetsen-feedback': [
    'Een laptop en een werkend account bij een AI-assistent.',
    'Eén toets die je zelf maakte en al eens afnam, digitaal. Enkel op papier werkt niet: dan gaat je tijd naar overtypen.',
  ],
  'administratie': [
    'Een laptop en een werkend account bij een AI-assistent.',
    'Eén administratieve klus die blijft liggen: ruwe notities van een vergadering, of een mail die je nog moet schrijven.',
  ],
  'veilig-en-ethisch': [
    'Een laptop en een werkend account bij een AI-assistent.',
    'Het AI-beleid of het ICT-reglement van je school of scholengroep, als dat al bestaat.',
    'Eén opdracht die je binnenkort geeft, voor de klasafspraak achteraan.',
  ],
  'casussen': [
    'Niets, als je de casussen alleen doorneemt.',
    'Doe je ze in groep: druk de module één keer af met de begeleidersmodus uit — dan krijgen de groepjes enkel de situatie. Jouw eigen exemplaar druk je af met de begeleidersmodus aan, want daar staan het oordeel en de gespreksvraag bij.',
  ],
  'vibe-start': [
    'Een laptop — geen tablet: je moet bestanden kunnen bewaren.',
    'Een werkend Claude-account.',
    'Eén lesmoment dat structureel stroef loopt. Daar bouw je de rest van dit spoor omheen.',
  ],
  'vibe-bouwen': [
    'Een laptop — geen tablet: je moet bestanden kunnen bewaren.',
    'Een werkend Claude-account.',
    'Het projectidee uit de module Vibe coden: wat en waarom.',
  ],
  'vibe-delen': [
    'Een laptop — geen tablet.',
    'Een werkend Claude-account en je eigen app uit de module Je eerste webapp bouwen.',
    'Een account bij de dienst waarop je publiceert (Netlify of Vercel), vooraf aangemaakt en bevestigd. Regel dat niet op het moment zelf: je verliest er een kwartier mee aan registreren en wachten op een bevestigingsmail.',
    'Een gsm om je link op te testen.',
  ],
  'vibe-data': [
    'Een laptop — geen tablet.',
    'Een werkend Claude-account en je eigen app uit de module Je eerste webapp bouwen.',
    'Een GitHub-account, vooraf aangemaakt en één keer uitgeprobeerd.',
    'Publiceer je via Netlify of Vercel, hou dat account dan bij de hand om GitHub eraan te koppelen. Gaat het via GitHub Pages, dan volstaat je GitHub-account.',
  ],
  'vibe-ai': [
    'Een laptop — geen tablet.',
    'Een werkend Claude-account en een werkend project uit de module Gegevens, privacy en versiebeheer.',
    'Een account bij een AI-dienst met een API-sleutel die al vóór je begint is aangemaakt, met tegoed of een betaalmethode erop. Zonder dat loopt je allereerste poging vast op een foutmelding. Probeer die sleutel één keer uit bij de dienst zelf.',
    'Duidelijkheid over wie de kosten draagt. Wil of mag je zelf geen betaalgegevens ingeven, werk dan op een account van de school en spreek af wie het aanmaakt en beheert.',
  ],
  'vibe-voorbeeld': [
    'Een laptop — geen tablet.',
    'Een werkend Claude-account.',
    'Voor de opdracht achteraan: je eigen idee, en de app die je in de module Je eerste webapp bouwen al bouwde, als je die hebt.',
  ],
};

const BESTANDEN = [
  ['js/inhoud.js', "'"],
  ['js/casussen.js', '"'],
  ['js/inhoud-beleid.js', "'"],
  ['js/inhoud-vibe.js', "'"],
];

const idRe = /^(\s*)id:\s*['"]([a-z0-9-]+)['"],\s*$/;
const titelRe = /^(\s*)titel:/;
const duurRe = /^\s*duur:\s*['"][^'"]*['"],\s*$/;
const lessenRe = /^(\s*)lessen:\s*\[\s*$/;

let gezetteLessen = 0;
let gezetteModules = 0;
let geschrapteDuur = 0;

for (const [pad, q] of BESTANDEN) {
  const bron = readFileSync(pad, 'utf8');
  const eol = bron.includes('\r\n') ? '\r\n' : '\n';
  const regels = bron.split(/\r?\n/);
  const uit = [];
  let laatsteId = null;
  let moduleId = null;

  for (let i = 0; i < regels.length; i++) {
    const r = regels[i];

    if (duurRe.test(r)) {
      geschrapteDuur++;
      continue;
    }

    const lessenM = r.match(lessenRe);
    if (lessenM && moduleId && KLAARZETTEN[moduleId]) {
      const inspring = lessenM[1];
      uit.push(`${inspring}klaarzetten: [`);
      for (const s of KLAARZETTEN[moduleId]) {
        const tekst = s.split(q).join('\\' + q);
        uit.push(`${inspring}  ${q}${tekst}${q},`);
      }
      uit.push(`${inspring}],`);
      gezetteModules++;
      moduleId = null;
    }

    uit.push(r);

    const idM = r.match(idRe);
    if (idM) {
      laatsteId = idM[2];
      if (KLAARZETTEN[laatsteId]) moduleId = laatsteId;
      continue;
    }

    if (titelRe.test(r) && laatsteId && MINUTEN[laatsteId] !== undefined) {
      const inspring = r.match(/^(\s*)/)[1];
      uit.push(`${inspring}minuten: ${MINUTEN[laatsteId]},`);
      gezetteLessen++;
      laatsteId = null;
    }
  }

  writeFileSync(pad, uit.join(eol), 'utf8');
}

console.log('lessen met minuten:', gezetteLessen);
console.log('modules met klaarzetten:', gezetteModules);
console.log('geschrapte duur-velden:', geschrapteDuur);
