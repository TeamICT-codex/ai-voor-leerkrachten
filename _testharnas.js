// Tijdelijke testharnas — hoort NIET in een commit.
const SLEUTEL = 'ai-voor-leerkrachten';
const AF = Object.getPrototypeOf(async function () {}).constructor;
let printStijl = null;

function el(x) { return typeof x === 'string' ? document.querySelector(x) : x; }

const H = {
  q: (s) => document.querySelector(s),
  qa: (s) => [...document.querySelectorAll(s)],
  // In een verborgen tabblad knijpt de browser setTimeout af tot ongeveer één keer
  // per seconde, en dan duurt elke navigatie seconden. Een bericht via een
  // MessageChannel is óók een taak in de wachtrij, maar wordt niet afgeknepen.
  taak: () => new Promise((r) => {
    const k = new MessageChannel();
    k.port1.onmessage = () => { k.port1.close(); r(); };
    k.port2.postMessage(0);
  }),
  wacht: (ms) => new Promise((r) => setTimeout(r, Math.min(ms, 1500))),
  async tik() {
    // Drie beurten: genoeg om een hashchange en de hertekening erna te laten lopen.
    await H.taak();
    await H.taak();
    await H.taak();
  },
  async ga(hash) {
    const doel = hash || '#/';
    if (location.hash === doel || (doel === '#/' && !location.hash)) {
      location.hash = '#/__herteken';
      await H.tik();
    }
    location.hash = doel;
    await H.tik();
  },
  async begeleider(aan) {
    const nu = document.body.classList.contains('begeleidersmodus');
    if (nu !== !!aan) {
      const knop = document.querySelector('[data-actie="begeleider"]');
      if (!knop) throw new Error('begeleidersschakelaar niet gevonden');
      knop.click();
      await H.tik();
    }
    return document.body.classList.contains('begeleidersmodus');
  },
  async klik(x) {
    const e = el(x);
    if (!e) throw new Error('klik: element niet gevonden');
    e.click();
    await H.tik();
    return e;
  },
  stijl(x, prop) {
    const e = el(x);
    return e ? getComputedStyle(e)[prop] : null;
  },
  zichtbaar(x) {
    const e = el(x);
    if (!e) return false;
    const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  },
  opslagZet(o) { localStorage.setItem(SLEUTEL, JSON.stringify(o)); },
  opslagLees() { try { return JSON.parse(localStorage.getItem(SLEUTEL)); } catch (e) { return null; } },
  opslagWis() { localStorage.removeItem(SLEUTEL); },
  printAan() {
    H.printUit();
    let css = '';
    for (const sheet of document.styleSheets) {
      let regels;
      try { regels = sheet.cssRules; } catch (e) { continue; }
      for (const r of regels) {
        const mt = (r.conditionText || (r.media && r.media.mediaText) || '');
        if (r.type === CSSRule.MEDIA_RULE && /print/.test(mt)) {
          for (const sub of r.cssRules) css += sub.cssText + '\n';
        }
      }
    }
    printStijl = document.createElement('style');
    printStijl.id = '__printtest';
    printStijl.textContent = css;
    document.head.appendChild(printStijl);
    return H.printUit;
  },
  printUit() { if (printStijl) { printStijl.remove(); printStijl = null; } },
};

// Een test die in zijn tijdslimiet loopt, blijft anders op de achtergrond
// doornavigeren en verstoort alles wat erna komt. Elke test krijgt daarom zijn
// eigen H die stopt zodra de beurt aan de volgende test is.
let huidigeBeurt = 0;

function maakH(mijn) {
  const bewaak = () => { if (mijn !== huidigeBeurt) throw new Error('test afgebroken'); };
  const B = Object.create(H);
  for (const naam of ['wacht', 'tik', 'taak', 'ga', 'begeleider', 'klik']) {
    B[naam] = async (...a) => { bewaak(); const r = await H[naam](...a); bewaak(); return r; };
  }
  return B;
}

const TESTS = [
 {
  "id": "T001",
  "gebied": "routing",
  "naam": "alle twaalf modules renderen hun eigen pagina",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const ids = ['kennismaking','prompten','lesvoorbereiding','toetsen-feedback','administratie','veilig-en-ethisch','casussen','vibe-start','vibe-bouwen','vibe-delen','vibe-data','vibe-ai'];\nconst fout = [];\nfor (const id of ids) {\n  await H.ga('#/module/' + id);\n  const h1 = H.q('#hoofd .titelblok h1');\n  const lessen = H.qa('#hoofd .les').length;\n  const teller = H.q('#hoofd #module-teller');\n  const titel = h1 ? h1.textContent.trim() : '';\n  if (!titel || !lessen || !teller) fout.push(id + ' (titel=\"' + titel + '\", lessen=' + lessen + ', teller=' + (teller ? 'ja' : 'nee') + ')');\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? 'stuk: ' + fout.join(' | ') : ids.length + ' modules renderen elk een titel, minstens een les en de teller' };"
 },
 {
  "id": "T002",
  "gebied": "routing",
  "naam": "alle zes draaiboeken renderen met de juiste code",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const ids = ['a1','a2','a3','b1','b2','b3'];\nconst fout = [];\nfor (const id of ids) {\n  await H.ga('#/workshop/' + id);\n  const code = H.q('#hoofd .titelblok .code.groot');\n  const blokken = H.qa('#hoofd .blokken .blok').length;\n  const bundel = H.q('#hoofd a[href=\"#/bundel/' + id + '\"]');\n  const tekst = code ? code.textContent.trim() : 'geen';\n  if (tekst.toLowerCase() !== id || blokken < 9 || !bundel)\n    fout.push(id + ' (code=\"' + tekst + '\", blokken=' + blokken + ', bundellink=' + (bundel ? 'ja' : 'nee') + ')');\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? 'stuk: ' + fout.join(' | ') : '6 draaiboeken met de juiste code, 9 of meer blokken en een bundellink' };"
 },
 {
  "id": "T003",
  "gebied": "routing",
  "naam": "hash zonder id en onzinhash geven Niet gevonden",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = ['#/module','#/workshop','#/bundel','#/module/bestaat-niet','#/workshop/a9','#/bundel/xyz','#/onzin','#/module/a1','#/workshop/prompten'];\nconst fout = [];\nfor (const h of gevallen) {\n  await H.ga(h);\n  const kop = H.q('#hoofd .kaart.leeg h1');\n  const gezien = kop ? kop.textContent.trim() : (H.q('#hoofd .onthaal') ? 'de startpagina' : 'iets anders');\n  if (gezien !== 'Niet gevonden') fout.push(h + ' toont ' + gezien);\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : gevallen.length + ' ongeldige hashes tonen allemaal \"Niet gevonden\"' };"
 },
 {
  "id": "T004",
  "gebied": "routing",
  "naam": "hoofdletters in de URL komen op de juiste pagina uit",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = [\n  ['#/workshop/A1', '#hoofd a[href=\"#/bundel/a1\"]'],\n  ['#/workshop/B3', '#hoofd a[href=\"#/bundel/b3\"]'],\n  ['#/module/Prompten', '#hoofd .verder a[href=\"#/module/lesvoorbereiding\"]'],\n  ['#/module/VIBE-START', '#hoofd .verder a[href=\"#/module/vibe-bouwen\"]'],\n  ['#/bundel/A3', '#hoofd .bundel a[href=\"#/workshop/a3\"]'],\n];\nconst fout = [];\nfor (const paar of gevallen) {\n  await H.ga(paar[0]);\n  const kop = H.q('#hoofd .kaart.leeg h2');\n  if (!H.q(paar[1])) fout.push(paar[0] + ' geeft ' + (kop ? '\"' + kop.textContent.trim() + '\"' : 'een pagina zonder ' + paar[1]));\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : '5 hashes met hoofdletters komen op de juiste pagina uit' };"
 },
 {
  "id": "T005",
  "gebied": "routing",
  "naam": "kruimels tonen het spoor van de pagina",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = [\n  ['#/workshop/a1', 'AI in de klas', 'Vibe coden'],\n  ['#/workshop/b2', 'Vibe coden', 'AI in de klas'],\n  ['#/module/casussen', 'AI in de klas', 'Vibe coden'],\n  ['#/module/vibe-delen', 'Vibe coden', 'AI in de klas'],\n];\nconst fout = [];\nfor (const g of gevallen) {\n  await H.ga(g[0]);\n  const kr = H.q('#hoofd .kruimels');\n  const t = kr ? kr.textContent.replace(/\\s+/g, ' ').trim() : 'geen kruimels';\n  if (!t.includes('Overzicht') || !t.includes(g[1]) || t.includes(g[2])) fout.push(g[0] + ' -> \"' + t + '\"');\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : 'vier kruimelpaden noemen het juiste spoor en niet het andere' };"
 },
 {
  "id": "T006",
  "gebied": "routing",
  "naam": "elke geldige route rendert haar inhoud en zet data-pagina",
  "soort": "browser",
  "route": "#/",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = [\n  ['#/', 'home', '.onthaal'],\n  ['#/module/prompten', 'module', '.les'],\n  ['#/workshop/a1', 'workshop', '.blokken .blok'],\n  ['#/bundel/a1', 'bundel', '.bundel .bundel-kop'],\n  ['#/prompts', 'prompts', '.promptblok'],\n  ['#/gids', 'gids', '.gids-faq'],\n  ['#/onzin', 'onbekend', '.kaart.leeg'],\n];\nconst fout = [];\nfor (const g of gevallen) {\n  if (location.hash !== g[0]) await H.ga(g[0]);\n  const p = document.body.dataset.pagina;\n  const el = H.q('#hoofd ' + g[2]);\n  if (p !== g[1] || !el) fout.push(g[0] + ' -> data-pagina=\"' + p + '\" (verwacht \"' + g[1] + '\"), ' + g[2] + (el ? ' gevonden' : ' ONTBREEKT'));\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : 'zeven routes renderen hun eigen inhoud en zetten body.dataset.pagina juist' };"
 },
 {
  "id": "T007",
  "gebied": "routing",
  "naam": "vorige en volgende module staan in de juiste orde",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = [\n  ['#/module/prompten', '#/module/kennismaking', '#/module/lesvoorbereiding'],\n  ['#/module/vibe-bouwen', '#/module/vibe-start', '#/module/vibe-delen'],\n  ['#/module/administratie', '#/module/toetsen-feedback', '#/module/veilig-en-ethisch'],\n];\nconst fout = [];\nfor (const g of gevallen) {\n  await H.ga(g[0]);\n  const links = H.qa('#hoofd .verder a').map((a) => ({ h: a.getAttribute('href'), t: a.textContent.replace(/\\s+/g, ' ').trim() }));\n  const v = links.find((l) => l.t.includes('Vorige:'));\n  const n = links.find((l) => l.t.includes('Volgende:'));\n  if (links.length !== 2 || !v || !n || v.h !== g[1] || n.h !== g[2] || links[0] !== v || links[1] !== n)\n    fout.push(g[0] + ' -> ' + (links.map((l) => l.h + ' \"' + l.t + '\"').join(' + ') || 'geen enkele link'));\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : 'drie modules tonen vorige en volgende uit hun eigen spoor, in die volgorde' };"
 },
 {
  "id": "T008",
  "gebied": "routing",
  "naam": "eerste module zonder vorige, laatste zonder volgende",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const fout = [];\nconst lees = () => H.qa('#hoofd .verder a').map((a) => ({ h: a.getAttribute('href'), t: a.textContent.replace(/\\s+/g, ' ').trim() }));\n\nawait H.ga('#/module/kennismaking');\nlet l = lees();\nif (l.some((x) => x.t.includes('Vorige:'))) fout.push('kennismaking heeft toch een vorige');\nif (!l.length || l[0].h !== '#/') fout.push('kennismaking begint niet met een link naar het overzicht (' + l.map((x) => x.h).join(',') + ')');\nif (!l.some((x) => x.h === '#/module/prompten')) fout.push('kennismaking mist de volgende module');\n\nawait H.ga('#/module/casussen');\nl = lees();\nif (l.some((x) => x.t.includes('Volgende:'))) fout.push('casussen (laatste van spoor ai) heeft toch een volgende');\nif (l.some((x) => x.h && x.h.indexOf('#/module/vibe') === 0)) fout.push('casussen springt door naar het vibe-spoor');\nif (!l.some((x) => x.h === '#/module/veilig-en-ethisch')) fout.push('casussen mist de vorige module');\n\nawait H.ga('#/module/vibe-start');\nl = lees();\nif (l.some((x) => x.t.includes('Vorige:'))) fout.push('vibe-start heeft toch een vorige');\nif (l.some((x) => x.h === '#/module/casussen')) fout.push('vibe-start springt terug naar het ai-spoor');\nif (!l.some((x) => x.h === '#/module/vibe-bouwen')) fout.push('vibe-start mist de volgende module');\n\nawait H.ga('#/module/vibe-ai');\nl = lees();\nif (l.some((x) => x.t.includes('Volgende:'))) fout.push('vibe-ai (laatste van spoor vibe) heeft toch een volgende');\nif (!l.some((x) => x.h === '#/module/vibe-data')) fout.push('vibe-ai mist de vorige module');\n\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : 'eerste module van elk spoor zonder vorige, laatste zonder volgende, geen sprong tussen de sporen' };"
 },
 {
  "id": "T009",
  "gebied": "routing",
  "naam": "heen en weer navigeren laat geen dubbels achter",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const meet = () => ({\n  blok: H.qa('#hoofd .blokken .blok').length,\n  draaiboek: H.qa('#hoofd .draaiboek').length,\n  modulelink: H.qa('#hoofd .module-link').length,\n  actie: H.qa('#hoofd [data-actie]').length,\n});\nawait H.ga('#/workshop/a3');\nconst eerst = meet();\nawait H.ga('#/');\nawait H.ga('#/module/casussen');\nawait H.ga('#/workshop/a3');\nconst nu = meet();\nconst idsW = H.qa('#hoofd [id]').map((e) => e.id);\nconst dubbelW = idsW.filter((x, i) => idsW.indexOf(x) !== i);\nawait H.ga('#/module/prompten');\nconst idsM = H.qa('#hoofd [id]').map((e) => e.id);\nconst dubbelM = idsM.filter((x, i) => idsM.indexOf(x) !== i);\nawait H.ga('#/');\nconst gelijk = JSON.stringify(eerst) === JSON.stringify(nu);\nreturn {\n  ok: gelijk && eerst.draaiboek === 1 && eerst.blok > 0 && dubbelW.length === 0 && dubbelM.length === 0,\n  detail: 'A3 eerst ' + JSON.stringify(eerst) + ', na heen en weer ' + JSON.stringify(nu) + '; dubbele ids op het draaiboek: ' + (dubbelW.join(',') || 'geen') + ', op de module: ' + (dubbelM.join(',') || 'geen'),\n};"
 },
 {
  "id": "T010",
  "gebied": "routing",
  "naam": "de pagina springt naar boven na een routewissel",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/module/prompten');\nwindow.scrollTo({ top: 1500, behavior: 'instant' });\nawait H.wacht(150);\nconst voor = Math.round(window.scrollY);\nawait H.ga('#/module/lesvoorbereiding');\nconst na = Math.round(window.scrollY);\nawait H.wacht(150);\nconst later = Math.round(window.scrollY);\nawait H.ga('#/');\nreturn {\n  ok: voor > 200 && na === 0 && later === 0,\n  detail: 'de module stond op ' + voor + 'px gescrold, meteen na de routewissel ' + na + 'px en even later ' + later + 'px',\n};"
 },
 {
  "id": "T011",
  "gebied": "routing",
  "naam": "elke link op de startpagina leidt ergens heen",
  "soort": "browser",
  "route": "#/",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "if (location.hash !== '#/') await H.ga('#/');\nconst hrefs = [...new Set(H.qa('#hoofd a[href^=\"#/\"]').map((a) => a.getAttribute('href')))];\nconst fout = [];\nfor (const h of hrefs) {\n  if (location.hash !== h) await H.ga(h);\n  const kop = H.q('#hoofd .kaart.leeg h2');\n  if (kop && kop.textContent.trim() === 'Niet gevonden') fout.push(h);\n}\nawait H.ga('#/');\nreturn {\n  ok: hrefs.length >= 20 && fout.length === 0,\n  detail: hrefs.length + ' unieke links op de startpagina gevolgd, kapot: ' + (fout.join(', ') || 'geen'),\n};"
 },
 {
  "id": "T012",
  "gebied": "routing",
  "naam": "links op promptkaart, draaiboek en bundel leiden ergens heen",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const bronnen = ['#/prompts', '#/workshop/a3', '#/bundel/a3'];\nconst hrefs = new Set();\nfor (const b of bronnen) {\n  await H.ga(b);\n  H.qa('#hoofd a[href^=\"#/\"]').forEach((a) => hrefs.add(a.getAttribute('href')));\n}\nconst lijst = [...hrefs];\nconst fout = [];\nfor (const h of lijst) {\n  if (location.hash !== h) await H.ga(h);\n  const kop = H.q('#hoofd .kaart.leeg h2');\n  if (kop && kop.textContent.trim() === 'Niet gevonden') fout.push(h);\n}\nawait H.ga('#/');\nreturn {\n  ok: lijst.length >= 10 && fout.length === 0,\n  detail: lijst.length + ' unieke links vanuit de promptkaart, draaiboek A3 en bundel A3 gevolgd, kapot: ' + (fout.join(', ') || 'geen'),\n};"
 },
 {
  "id": "T013",
  "gebied": "routing",
  "naam": "module- en workshop-ids zijn URL-veilig en hoofdletterongevoelig",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"import { MODULES, WORKSHOPS, vindModule, vindWorkshop } from './js/cursus.js'; const f=[]; const veilig=(s)=>s===s.toLowerCase()&&!/[^a-z0-9-]/.test(s); const zm=new Set(), zw=new Set(); for (const m of MODULES){ if(!veilig(m.id)) f.push('module-id niet URL-veilig: '+m.id); if(zm.has(m.id.toLowerCase())) f.push('dubbel module-id: '+m.id); zm.add(m.id.toLowerCase()); if(vindModule(m.id.toUpperCase())!==m) f.push('hoofdletters falen voor module '+m.id); } for (const w of WORKSHOPS){ if(!veilig(w.id)) f.push('workshop-id niet URL-veilig: '+w.id); if(zw.has(w.id.toLowerCase())) f.push('dubbel workshop-id: '+w.id); zw.add(w.id.toLowerCase()); if(vindWorkshop(w.id.toUpperCase())!==w) f.push('hoofdletters falen voor workshop '+w.id); if(w.code.toLowerCase()!==w.id) f.push('code en id lopen uiteen: '+w.code+' vs '+w.id); } for (const leeg of ['', null, undefined, 'bestaat-niet']) { if(vindModule(leeg)) f.push('vindModule geeft iets terug voor '+JSON.stringify(leeg)); if(vindWorkshop(leeg)) f.push('vindWorkshop geeft iets terug voor '+JSON.stringify(leeg)); } for (const m of MODULES) if (vindWorkshop(m.id)) f.push('module-id botst met workshop-id: '+m.id); console.log(MODULES.length+' modules en '+WORKSHOPS.length+' workshops nagekeken'); f.forEach(x=>console.log(' - '+x)); console.log(f.length? 'FOUT: '+f.length+' probleem(en)' : 'OK');\""
 },
 {
  "id": "T014",
  "gebied": "routing",
  "naam": "elke module hangt aan een bestaand spoor, in een vaste orde",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"import { MODULES, SPOREN, modulesVanSpoor } from './js/cursus.js'; const f=[]; const sids=new Set(SPOREN.map(s=>s.id)); let som=0; for (const s of SPOREN){ const r=modulesVanSpoor(s.id); som+=r.length; if(r.length<2) f.push('spoor '+s.id+' heeft te weinig modules voor vorige/volgende: '+r.length); console.log(s.id+' ('+r.length+'): '+r.map(m=>m.id).join(' > ')); } for (const m of MODULES){ if(!sids.has(m.spoor)) f.push('module '+m.id+' hangt aan onbekend spoor '+m.spoor); const r=modulesVanSpoor(m.spoor); if(r.findIndex(x=>x.id===m.id)<0) f.push('module '+m.id+' staat niet in haar eigen spoorreeks'); } if(som!==MODULES.length) f.push('de sporen dekken '+som+' van de '+MODULES.length+' modules'); f.forEach(x=>console.log(' - '+x)); console.log(f.length? 'FOUT: '+f.length+' probleem(en)' : 'OK');\""
 },
 {
  "id": "T015",
  "gebied": "opslag",
  "naam": "startuur-regex laat alleen echte klokuren door",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync } from 'node:fs';\nconst bron = readFileSync('./js/app.js', 'utf8');\nconst m = bron.match(/startuur: (\\/.+?\\/)\\.test\\(data\\.startuur\\)/);\nif (!m) { console.log('FOUT: geen startuur-validatie gevonden in laadOpslag()'); process.exit(0); }\nconst re = new RegExp(m[1].slice(1, -1));\nconst proeven = [['09:00',true],['00:00',true],['13:30',true],['23:59',true],['25:99',false],['24:00',false],['geen uur',false],['9:00',false],['0900',false],['09:60',false],['09:00 ',false],[12,false],[null,false],[undefined,false],['',false]];\nlet fout = 0;\nfor (const [waarde, verwacht] of proeven) {\n  const uit = re.test(waarde);\n  if (uit !== verwacht) { console.log('FOUT bij', JSON.stringify(waarde), '->', uit, 'verwacht', verwacht); fout++; }\n}\nconsole.log('regex:', m[1], '|', proeven.length, 'waarden getest');\nconsole.log(fout ? 'FOUT: ' + fout + ' startuurwaarden worden verkeerd beoordeeld' : 'OK');\n\""
 },
 {
  "id": "T016",
  "gebied": "opslag",
  "naam": "elke lessleutel is uniek, dus 28/28 is haalbaar",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, TOTAAL_LESSEN } from './js/cursus.js';\nconst sleutels = MODULES.flatMap(m => m.lessen.map(l => m.id + '/' + l.id));\nconst uniek = new Set(sleutels);\nconst moduleIds = MODULES.map(m => m.id);\nlet fout = 0;\nif (uniek.size !== TOTAAL_LESSEN) { console.log('FOUT dubbele lessleutel:', sleutels.filter((s,i) => sleutels.indexOf(s) !== i)); fout++; }\nif (new Set(moduleIds).size !== moduleIds.length) { console.log('FOUT dubbel module-id'); fout++; }\nfor (const s of sleutels) if (s !== s.toLowerCase() || s.split('/').length !== 2) { console.log('FOUT rare lessleutel', s); fout++; }\nconsole.log('lessleutels', sleutels.length, '| uniek', uniek.size, '| TOTAAL_LESSEN', TOTAAL_LESSEN, '| modules', moduleIds.length);\nconsole.log(fout ? 'FOUT: de teller bovenaan kan nooit ' + TOTAAL_LESSEN + '/' + TOTAAL_LESSEN + ' bereiken' : 'OK');\n\""
 },
 {
  "id": "T017",
  "gebied": "opslag",
  "naam": "geknoeide opslag: 25:99 valt terug op 09:00, afgewerkt geen array, sessie van 7 uur oud genegeerd",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": true,
  "script": "const opstart = H.q('.kaart.leeg.opstart');\nconst veld = H.q('#startuur');\nconst eerste = H.q('.blokken .blok .blok-tijd strong');\nconst teller = H.q('.voortgang-mini > span');\nconst sessie = H.q('[data-actie=\"sessie\"]');\nconst gemarkeerd = H.qa('.blok.nu, .blok.voorbij').length;\nconst uur = veld ? veld.value : 'geen veld';\nconst start = eerste ? eerste.textContent.trim() : 'geen blok';\nconst t = teller ? teller.textContent.trim() : 'geen teller';\nconst knoptekst = sessie ? sessie.textContent.trim() : 'geen knop';\nconst ok = !opstart && uur === '09:00' && start === '09:00' && t === '0/28'\n  && knoptekst === 'Start sessie' && gemarkeerd === 0;\nH.opslagWis();\nreturn { ok, detail: 'startuurveld ' + uur + ', eerste blok ' + start + ', teller ' + t\n  + ', sessieknop \"' + knoptekst + '\", ' + gemarkeerd + ' blokken met nu/voorbij' };"
 },
 {
  "id": "T018",
  "gebied": "opslag",
  "naam": "geldige opslag blijft: 13:30, twee lessen uit twee modules, verse sessie loopt",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": true,
  "script": "const veld = H.q('#startuur');\nconst eerste = H.q('.blokken .blok .blok-tijd strong');\nconst teller = H.q('.voortgang-mini > span');\nconst sessie = H.q('[data-actie=\"sessie\"]');\nconst eind = H.q('.eindtijd');\nconst uur = veld ? veld.value : 'geen veld';\nconst start = eerste ? eerste.textContent.trim() : 'geen blok';\nconst t = teller ? teller.textContent.trim() : 'geen teller';\nconst knoptekst = sessie ? sessie.textContent.trim() : 'geen knop';\nconst eindtekst = eind ? eind.textContent.trim() : 'geen eindtijd';\nconst nu = H.qa('.blok.nu').length;\nconst voorbij = H.qa('.blok.voorbij').length;\nconst vlag = H.q('.blok.nu .nu-vlag');\nconst vlagtekst = vlag ? vlag.textContent.trim() : 'geen vlag';\nconst ok = uur === '13:30' && start === '13:30' && eindtekst === 'tot 16:30' && t === '2/28'\n  && knoptekst === 'Sessie stoppen' && nu === 1 && voorbij >= 1 && /^nu — nog \\d+ min$/.test(vlagtekst);\nif (sessie && knoptekst === 'Sessie stoppen') await H.klik(sessie);\nconst veld2 = H.q('#startuur');\nif (veld2) { veld2.value = '09:00'; veld2.dispatchEvent(new Event('change', { bubbles: true })); await H.wacht(50); }\nfor (const paar of [['kennismaking', 'eerste-gesprek'], ['vibe-delen', 'publiceren']]) {\n  await H.ga('#/module/' + paar[0]);\n  const k = H.q('.vink[data-sleutel=\"' + paar[0] + '/' + paar[1] + '\"]');\n  if (k && k.classList.contains('aan')) await H.klik(k);\n}\nH.opslagWis();\nreturn { ok, detail: 'startuur ' + uur + ', eerste blok ' + start + ', ' + eindtekst\n  + ', teller ' + t + ', sessieknop \"' + knoptekst + '\", nu=' + nu + ' voorbij=' + voorbij\n  + ', vlag \"' + vlagtekst + '\"' };"
 },
 {
  "id": "T019",
  "gebied": "opslag",
  "naam": "sessieStart in de toekomst wordt genegeerd, geldige sleutel telt wel mee",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": true,
  "script": "const sessie = H.q('[data-actie=\"sessie\"]');\nconst teller = H.q('.voortgang-mini > span');\nconst knoptekst = sessie ? sessie.textContent.trim() : 'geen knop';\nconst t = teller ? teller.textContent.trim() : 'geen teller';\nconst gemarkeerd = H.qa('.blok.nu, .blok.voorbij').length;\nconst ok = knoptekst === 'Start sessie' && gemarkeerd === 0 && t === '1/28';\nawait H.ga('#/module/kennismaking');\nconst k = H.q('.vink[data-sleutel=\"kennismaking/wat-is-ai-assistent\"]');\nif (k && k.classList.contains('aan')) await H.klik(k);\nH.opslagWis();\nreturn { ok, detail: 'sessieknop \"' + knoptekst + '\", ' + gemarkeerd\n  + ' blokken met nu/voorbij, teller ' + t + ' (geldige sleutel telt wel mee)' };"
 },
 {
  "id": "T020",
  "gebied": "opslag",
  "naam": "drie verzonnen lessleutels tellen niet mee: 0/28 blijft staan",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": true,
  "script": "const teller = H.q('.voortgang-mini > span');\nconst vul = H.q('.balk-vul');\nconst mini = H.q('.voortgang-mini');\nconst kaart = H.q('a.kaart.module[href=\"#/module/kennismaking\"] .kaart-voet span:last-child');\nconst t = teller ? teller.textContent.trim() : 'geen teller';\nconst breedte = vul ? vul.style.width : 'geen balk';\nconst titel = mini ? mini.getAttribute('title') : 'geen titel';\nconst kaarttekst = kaart ? kaart.textContent.trim() : 'geen kaart';\nconst ok = t === '0/28' && breedte === '0%' && titel === '0 van 28 lessen afgewerkt'\n  && kaarttekst === '0/2 lessen';\nH.opslagWis();\nreturn { ok, detail: 'teller ' + t + ', balk ' + breedte + ', titel \"' + titel\n  + '\", modulekaart kennismaking \"' + kaarttekst + '\"' };"
 },
 {
  "id": "T021",
  "gebied": "opslag",
  "naam": "les afvinken werkt knop, les, modulekop en balk bij zonder de quiz te wissen",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const lees = () => Number((H.q('.voortgang-mini > span').textContent.trim().split('/')[0]));\nconst optie = H.q('[data-quiz] .optie');\nawait H.klik(optie);\nconst quiz = H.q('[data-quiz]');\nquiz.dataset.merk = 'sentinel';\nconst quizBeantwoord = quiz.classList.contains('beantwoord');\nconst uitslagVoor = H.q('[data-quiz] .quiz-uitslag').textContent.trim();\nconst voor = lees();\nconst knop = H.q('.vink[data-sleutel=\"kennismaking/wat-is-ai-assistent\"]');\nawait H.klik(knop);\nconst na = {\n  aan: knop.classList.contains('aan'),\n  aria: knop.getAttribute('aria-pressed'),\n  tekst: knop.textContent.trim(),\n  les: knop.closest('.les').classList.contains('af'),\n  mod: H.q('#module-teller').textContent.trim(),\n  top: lees(),\n  merk: H.q('[data-quiz]').dataset.merk,\n  quiz: H.q('[data-quiz]').classList.contains('beantwoord'),\n  uitslag: H.q('[data-quiz] .quiz-uitslag').textContent.trim(),\n};\nconst ok = quizBeantwoord && uitslagVoor.length > 0 && na.aan === true && na.aria === 'true'\n  && na.tekst === '✓ Afgewerkt' && na.les === true && na.mod === '1/2 afgewerkt'\n  && na.top === voor + 1 && na.merk === 'sentinel' && na.quiz === true\n  && na.uitslag === uitslagVoor;\nif (knop.classList.contains('aan')) await H.klik(knop);\nH.opslagWis();\nreturn { ok, detail: 'knop \"' + na.tekst + '\" aria-pressed=' + na.aria + ', les.af=' + na.les\n  + ', #module-teller \"' + na.mod + '\", kopteller ' + voor + ' -> ' + na.top\n  + ', quiz bleef beantwoord=' + na.quiz + ' (uitslag \"' + na.uitslag + '\"), sentinel=' + na.merk };"
 },
 {
  "id": "T022",
  "gebied": "opslag",
  "naam": "een opengeklapte casus overleeft het afvinken van dezelfde les",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const casus = H.q('[data-casus]');\nconst knopC = casus.querySelector('[data-actie=\"casus\"]');\nawait H.klik(knopC);\nconst open1 = casus.classList.contains('open');\nconst aria1 = knopC.getAttribute('aria-expanded');\nconst tekst1 = knopC.textContent.trim();\nconst zichtbaar1 = H.zichtbaar(casus.querySelector('.casus-antwoord'));\ncasus.dataset.merk = 'sentinel';\nconst lees = () => Number((H.q('.voortgang-mini > span').textContent.trim().split('/')[0]));\nconst voor = lees();\nconst knop = H.q('.vink[data-sleutel=\"casussen/casus-privacy\"]');\nawait H.klik(knop);\nconst casus2 = H.q('[data-casus]');\nconst na = {\n  open: casus2.classList.contains('open'),\n  merk: casus2.dataset.merk,\n  zelfdeKnop: casus2.querySelector('[data-actie=\"casus\"]') === knopC,\n  aria: casus2.querySelector('[data-actie=\"casus\"]').getAttribute('aria-expanded'),\n  mod: H.q('#module-teller').textContent.trim(),\n  top: lees(),\n  lesAf: knop.closest('.les').classList.contains('af'),\n};\nconst ok = open1 && aria1 === 'true' && tekst1 === 'Verberg het oordeel' && zichtbaar1\n  && na.open === true && na.merk === 'sentinel' && na.zelfdeKnop === true && na.aria === 'true'\n  && na.mod === '1/2 afgewerkt' && na.top === voor + 1 && na.lesAf === true;\nif (knop.classList.contains('aan')) await H.klik(knop);\nif (casus2.classList.contains('open')) await H.klik(casus2.querySelector('[data-actie=\"casus\"]'));\nH.opslagWis();\nreturn { ok, detail: 'casus opengeklapt (aria-expanded=' + aria1 + ', knop \"' + tekst1\n  + '\", antwoord zichtbaar=' + zichtbaar1 + '); na het vinken nog open=' + na.open\n  + ', zelfde knop-node=' + na.zelfdeKnop + ', sentinel=' + na.merk\n  + ', #module-teller \"' + na.mod + '\", kopteller ' + voor + ' -> ' + na.top };"
 },
 {
  "id": "T023",
  "gebied": "opslag",
  "naam": "afvinken en opnieuw afvinken zet de teller terug op nul",
  "soort": "browser",
  "route": "#/module/lesvoorbereiding",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const lees = () => Number((H.q('.voortgang-mini > span').textContent.trim().split('/')[0]));\nconst start = lees();\nconst knoppen = H.qa('.vink');\nfor (const k of knoppen) if (!k.classList.contains('aan')) await H.klik(k);\nconst naAan = { top: lees(), mod: H.q('#module-teller').textContent.trim(),\n  af: H.qa('.les.af').length, aria: H.qa('.vink[aria-pressed=\"true\"]').length };\nfor (const k of H.qa('.vink')) if (k.classList.contains('aan')) await H.klik(k);\nconst naUit = { top: lees(), mod: H.q('#module-teller').textContent.trim(),\n  af: H.qa('.les.af').length, aria: H.qa('.vink[aria-pressed=\"true\"]').length,\n  tekst: H.q('.vink').textContent.trim() };\nconst bewaard = H.opslagLees();\nconst restjes = bewaard && Array.isArray(bewaard.afgewerkt)\n  ? bewaard.afgewerkt.filter((s) => s.indexOf('lesvoorbereiding/') === 0).length : -1;\nconst ok = knoppen.length === 2 && naAan.top === start + 2 && naAan.mod === '2/2 afgewerkt'\n  && naAan.af === 2 && naAan.aria === 2 && naUit.top === start && naUit.mod === '0/2 afgewerkt'\n  && naUit.af === 0 && naUit.aria === 0 && naUit.tekst === 'Markeer als afgewerkt'\n  && restjes === 0;\nH.opslagWis();\nreturn { ok, detail: 'kopteller ' + start + ' -> ' + naAan.top + ' -> ' + naUit.top\n  + ', #module-teller \"' + naAan.mod + '\" -> \"' + naUit.mod + '\", lessen met .af '\n  + naAan.af + ' -> ' + naUit.af + ', aria-pressed=true ' + naAan.aria + ' -> ' + naUit.aria\n  + ', knoptekst \"' + naUit.tekst + '\", resterende lesvoorbereiding-sleutels in opslag ' + restjes };"
 },
 {
  "id": "T024",
  "gebied": "opslag",
  "naam": "wat in localStorage belandt is geldige JSON met precies vier velden",
  "soort": "browser",
  "route": "#/module/toetsen-feedback",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "H.opslagWis();\nconst knop = H.q('.vink[data-sleutel=\"toetsen-feedback/toetsvragen\"]');\nconst wasAan = knop.classList.contains('aan');\nif (wasAan) await H.klik(knop);\nawait H.klik(knop);\nconst ruw = localStorage.getItem('ai-voor-leerkrachten');\nlet data = null, parseFout = '';\ntry { data = JSON.parse(ruw); } catch (e) { parseFout = String(e.message); }\nconst sleutels = data && typeof data === 'object' ? Object.keys(data).sort().join(',') : 'geen object';\nconst uurGeldig = data && typeof data.startuur === 'string'\n  && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(data.startuur);\nconst lijstGeldig = data && Array.isArray(data.afgewerkt)\n  && data.afgewerkt.every((s) => typeof s === 'string')\n  && data.afgewerkt.indexOf('toetsen-feedback/toetsvragen') !== -1;\nconst sessieGeldig = data && (data.sessieStart === null || typeof data.sessieStart === 'number');\nconst ok = !parseFout && sleutels === 'afgewerkt,begeleider,sessieStart,startuur'\n  && typeof data.begeleider === 'boolean' && uurGeldig && lijstGeldig && sessieGeldig;\nif (knop.classList.contains('aan')) await H.klik(knop);\nH.opslagWis();\nreturn { ok, detail: (parseFout ? 'JSON.parse faalde: ' + parseFout + '; ' : 'geldige JSON; ')\n  + 'velden [' + sleutels + '], begeleider=' + (data ? typeof data.begeleider : '?')\n  + ', startuur \"' + (data ? data.startuur : '?') + '\" geldig=' + uurGeldig\n  + ', afgewerkt bevat de sleutel=' + lijstGeldig + ', sessieStart='\n  + (data ? JSON.stringify(data.sessieStart) : '?') + ' (' + (data ? typeof data.sessieStart : '?') + ')' };"
 },
 {
  "id": "T025",
  "gebied": "opslag",
  "naam": "app blijft werken als localStorage.setItem gooit",
  "soort": "browser",
  "route": "#/module/administratie",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const lees = () => Number((H.q('.voortgang-mini > span').textContent.trim().split('/')[0]));\nconst orig = Storage.prototype.setItem;\nlet gegooid = 0;\nconst na = {};\nlet voor = -1;\nlet knop = null;\ntry {\n  H.opslagWis();\n  voor = lees();\n  Storage.prototype.setItem = function () { gegooid++; throw new Error('opslag vol'); };\n  knop = H.q('.vink[data-sleutel=\"administratie/oudercommunicatie\"]');\n  await H.klik(knop);\n  na.aan = knop.classList.contains('aan');\n  na.aria = knop.getAttribute('aria-pressed');\n  na.tekst = knop.textContent.trim();\n  na.mod = H.q('#module-teller').textContent.trim();\n  na.top = lees();\n  na.opslag = localStorage.getItem('ai-voor-leerkrachten');\n  na.kop = !!H.q('.voortgang-mini > span');\n} finally {\n  Storage.prototype.setItem = orig;\n}\nconst ok = gegooid > 0 && na.aan === true && na.aria === 'true' && na.tekst === '✓ Afgewerkt'\n  && na.mod === '1/2 afgewerkt' && na.top === voor + 1 && na.opslag === null && na.kop === true;\nif (knop && knop.classList.contains('aan')) await H.klik(knop);\nH.opslagWis();\nreturn { ok, detail: 'setItem gooide ' + gegooid + 'x; knop aan=' + na.aan + ' aria=' + na.aria\n  + ' tekst \"' + na.tekst + '\", #module-teller \"' + na.mod + '\", kopteller ' + voor + ' -> '\n  + na.top + ', localStorage ' + (na.opslag === null ? 'leeg zoals verwacht' : 'toch beschreven') };"
 },
 {
  "id": "T026",
  "gebied": "opslag",
  "naam": "startuur wijzigen bewaart de waarde en een leeg tijdveld wordt genegeerd",
  "soort": "browser",
  "route": "#/workshop/b1",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "H.opslagWis();\nconst veld = H.q('#startuur');\nconst oud = veld.value;\nveld.dataset.merk = 'sentinel';\nveld.value = '14:15';\nveld.dispatchEvent(new Event('change', { bubbles: true }));\nawait H.wacht(60);\nconst bewaard = H.opslagLees();\nconst eerste = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\nconst eind = H.q('.eindtijd').textContent.trim();\nconst zelfdeVeld = H.q('#startuur') === veld && H.q('#startuur').dataset.merk === 'sentinel';\nconst veld2 = H.q('#startuur');\nveld2.value = '';\nveld2.dispatchEvent(new Event('change', { bubbles: true }));\nawait H.wacht(60);\nconst naLeeg = H.opslagLees();\nconst eersteNaLeeg = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\nconst veld3 = H.q('#startuur');\nveld3.value = oud && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(oud) ? oud : '09:00';\nveld3.dispatchEvent(new Event('change', { bubbles: true }));\nawait H.wacht(60);\nH.opslagWis();\nconst ok = !!bewaard && bewaard.startuur === '14:15' && eerste === '14:15' && eind === 'tot 17:15'\n  && zelfdeVeld === true && !!naLeeg && naLeeg.startuur === '14:15' && eersteNaLeeg === '14:15';\nreturn { ok, detail: 'opslag.startuur na wijziging \"' + (bewaard ? bewaard.startuur : 'niets bewaard')\n  + '\", eerste blok ' + eerste + ', ' + eind + ', tijdveld niet hertekend=' + zelfdeVeld\n  + '; na een leeg tijdveld blijft opslag.startuur \"' + (naLeeg ? naLeeg.startuur : 'niets')\n  + '\" en het eerste blok ' + eersteNaLeeg };"
 },
 {
  "id": "T027",
  "gebied": "opslag",
  "naam": "sessie starten bewaart een tijdstip, stoppen zet het op null",
  "soort": "browser",
  "route": "#/workshop/a2",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "H.opslagWis();\nlet knop = H.q('[data-actie=\"sessie\"]');\nif (knop.textContent.trim() !== 'Start sessie') { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\nconst t0 = Date.now();\nawait H.klik(knop);\nconst na1 = H.opslagLees();\nconst knop2 = H.q('[data-actie=\"sessie\"]');\nconst tekst2 = knop2.textContent.trim();\nconst stopKlasse = knop2.classList.contains('stop');\nconst nu = H.qa('.blok.nu').length;\nconst vlag = H.q('.blok.nu .nu-vlag');\nconst vlagtekst = vlag ? vlag.textContent.trim() : 'geen vlag';\nawait H.klik(knop2);\nconst na2 = H.opslagLees();\nconst knop3 = H.q('[data-actie=\"sessie\"]');\nconst tekst3 = knop3.textContent.trim();\nconst gemarkeerd = H.qa('.blok.nu, .blok.voorbij').length;\nH.opslagWis();\nconst getal = !!na1 && typeof na1.sessieStart === 'number';\nconst vers = getal && Math.abs(na1.sessieStart - t0) < 10000;\nconst ok = getal && vers && tekst2 === 'Sessie stoppen' && stopKlasse && nu === 1\n  && /^nu — nog \\d+ min$/.test(vlagtekst) && !!na2 && na2.sessieStart === null\n  && tekst3 === 'Start sessie' && gemarkeerd === 0;\nreturn { ok, detail: 'opslag.sessieStart na start: ' + (na1 ? typeof na1.sessieStart : '?')\n  + ' (' + (getal ? (na1.sessieStart - t0) + ' ms van nu' : JSON.stringify(na1 && na1.sessieStart))\n  + '), knop \"' + tekst2 + '\", ' + nu + ' blok met .nu en vlag \"' + vlagtekst\n  + '\"; na stoppen sessieStart=' + JSON.stringify(na2 && na2.sessieStart) + ', knop \"' + tekst3\n  + '\", ' + gemarkeerd + ' blokken met nu/voorbij' };"
 },
 {
  "id": "T028",
  "gebied": "sessietimer",
  "naam": "metKloktijden: aaneensluitende blokken vanaf 09:00 en 13:30",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS } from './js/workshops.js';\nimport { metKloktijden } from './js/cursus.js';\nconst eind = { '09:00': '12:00', '13:30': '16:30' };\nlet fout = 0;\nfor (const w of WORKSHOPS) {\n  for (const start of Object.keys(eind)) {\n    const b = metKloktijden(w.draaiboek, start);\n    if (b[0].van !== start) { console.log('FOUT', w.code, start, 'eerste blok', b[0].van); fout++; }\n    for (let i = 0; i < b.length; i++) {\n      if (!(b[i].minuten > 0)) { console.log('FOUT', w.code, 'blok', i, 'duurt', b[i].minuten, 'min'); fout++; }\n      if (b[i].totMin - b[i].vanMin !== b[i].minuten) { console.log('FOUT', w.code, start, 'blok', i, 'lengte klopt niet'); fout++; }\n      if (i && b[i].van !== b[i-1].tot) { console.log('FOUT', w.code, start, 'gat tussen blok', i-1, b[i-1].tot, 'en', i, b[i].van); fout++; }\n    }\n    const laatste = b[b.length-1].tot;\n    if (laatste !== eind[start]) { console.log('FOUT', w.code, start, 'eindigt op', laatste, 'ipv', eind[start]); fout++; }\n    console.log(w.code, start, '->', b[0].van, '..', laatste, '(' + b.length + ' blokken aaneensluitend)');\n  }\n}\nconsole.log(fout ? 'FOUT: ' + fout + ' afwijking(en)' : 'OK');\n\""
 },
 {
  "id": "T029",
  "gebied": "sessietimer",
  "naam": "metKloktijden over middernacht (start 23:00 eindigt 02:00)",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS } from './js/workshops.js';\nimport { metKloktijden, naarKlok } from './js/cursus.js';\nlet fout = 0;\nconst geldig = (t) => typeof t === 'string' && t.length === 5 && /^[0-2]\\d:[0-5]\\d/.test(t) && Number(t.slice(0,2)) < 24;\nfor (const w of WORKSHOPS) {\n  const b = metKloktijden(w.draaiboek, '23:00');\n  for (let i = 0; i < b.length; i++) {\n    if (!geldig(b[i].van) || !geldig(b[i].tot)) { console.log('FOUT', w.code, 'blok', i, 'geeft', b[i].van, b[i].tot); fout++; }\n    if (i && b[i].van !== b[i-1].tot) { console.log('FOUT', w.code, 'gat bij blok', i); fout++; }\n    if (i && b[i].vanMin <= b[i-1].vanMin) { console.log('FOUT', w.code, 'vanMin loopt niet door bij blok', i); fout++; }\n  }\n  const laatste = b[b.length-1].tot;\n  if (laatste !== '02:00') { console.log('FOUT', w.code, '23:00 eindigt op', laatste, 'ipv 02:00'); fout++; }\n  console.log(w.code, '23:00 tot', laatste, '- eerste blok', b[0].van);\n}\nconst rand = [[1440,'00:00'],[1439,'23:59'],[-30,'23:30'],[0,'00:00'],[1500,'01:00']];\nfor (const p of rand) if (naarKlok(p[0]) !== p[1]) { console.log('FOUT naarKlok(' + p[0] + ') =', naarKlok(p[0]), 'ipv', p[1]); fout++; }\nconsole.log('naarKlok randgevallen:', rand.map((p) => p[0] + '=' + naarKlok(p[0])).join(' '));\nconsole.log(fout ? 'FOUT: ' + fout + ' afwijking(en)' : 'OK');\n\""
 },
 {
  "id": "T030",
  "gebied": "sessietimer",
  "naam": "startuur 13u30 geeft eindtijd 16u30 (en 23u00 geeft 02u00)",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const inv = H.q('#startuur');\nif (!inv) return { ok: false, detail: 'geen tijdveld #startuur op de draaiboekpagina' };\nconst oudOpslag = H.opslagLees();\nconst oudUur = inv.value;\nconst duur = H.qa('.blokken .blok').map((el) =>\n  Number(el.querySelector('.blok-tijd span').textContent.replace(/\\D/g, ''))\n);\nconst totaal = duur.reduce((s, m) => s + m, 0);\nconst klok = (n) => {\n  const x = ((n % 1440) + 1440) % 1440;\n  return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');\n};\nconst zet = async (v) => {\n  inv.value = v;\n  inv.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n};\nconst meet = async (start) => {\n  await zet(start);\n  const u = Number(start.slice(0, 2)), m = Number(start.slice(3, 5));\n  let loper = u * 60 + m;\n  const verwacht = duur.map((d) => { const v = klok(loper); loper += d; return v; });\n  const gezien = H.qa('.blokken .blok .blok-tijd strong').map((e) => e.textContent.trim());\n  const eind = ((H.q('.eindtijd') || {}).textContent || '').trim();\n  return {\n    blokkenOk: gezien.join(',') === verwacht.join(','),\n    eind: eind,\n    eindOk: eind === 'tot ' + klok(u * 60 + m + totaal),\n    eerste: gezien[0],\n    mis: gezien.findIndex((g, i) => g !== verwacht[i]),\n  };\n};\nconst a = await meet('13:30');\nconst b = await meet('23:00');\nawait zet(oudUur || '09:00');\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok = a.blokkenOk && a.eindOk && b.blokkenOk && b.eindOk && totaal === 180;\nreturn {\n  ok,\n  detail:\n    totaal + ' min draaiboek. 13:30: eerste blok ' + a.eerste + ', eindtijd \"' + a.eind +\n    '\", alle blokken kloppen: ' + a.blokkenOk + (a.mis >= 0 ? ' (eerste afwijking bij blok ' + a.mis + ')' : '') +\n    '. 23:00: eerste blok ' + b.eerste + ', eindtijd \"' + b.eind + '\", blokken kloppen: ' + b.blokkenOk,\n};"
 },
 {
  "id": "T031",
  "gebied": "sessietimer",
  "naam": "startuur wijzigen hertekent de pagina niet",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const inv = H.q('#startuur');\nconst ol = H.q('.blokken');\nconst eerste = H.q('.blokken .blok');\nif (!inv || !ol || !eerste) return { ok: false, detail: 'draaiboek niet gevonden op deze pagina' };\nconst oudOpslag = H.opslagLees();\nconst oudUur = inv.value;\nol.dataset.merk = 'blijf';\nwindow.scrollTo(0, 300);\nawait H.wacht(60);\nconst scrollVoor = window.scrollY;\ninv.focus();\nconst focusVoor = document.activeElement === inv;\ninv.value = '10:45';\ninv.dispatchEvent(new Event('change', { bubbles: true }));\nawait H.wacht(80);\nconst zelfdeLijst = H.q('.blokken') === ol && ol.dataset.merk === 'blijf';\nconst zelfdeBlok = H.q('.blokken .blok') === eerste && document.contains(eerste);\nconst focusNa = document.activeElement === inv;\nconst scrollNa = window.scrollY;\nconst tijd = eerste.querySelector('.blok-tijd strong').textContent.trim();\nconst scrollOk = scrollVoor === 0 ? true : scrollNa === scrollVoor;\ndelete ol.dataset.merk;\ninv.value = oudUur || '09:00';\ninv.dispatchEvent(new Event('change', { bubbles: true }));\nawait H.wacht(60);\ninv.blur();\nwindow.scrollTo(0, 0);\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok = focusVoor && zelfdeLijst && zelfdeBlok && focusNa && scrollOk && tijd === '10:45';\nreturn {\n  ok,\n  detail:\n    'na de wijziging naar 10:45: tijdveld houdt focus ' + focusNa + ', zelfde blokkenlijst ' +\n    zelfdeLijst + ', zelfde eerste blok ' + zelfdeBlok + ', scroll ' + scrollVoor + ' naar ' + scrollNa +\n    ', eerste blok toont ' + tijd,\n};"
 },
 {
  "id": "T032",
  "gebied": "sessietimer",
  "naam": "leeg tijdveld verandert de tijden niet",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const inv = H.q('#startuur');\nif (!inv) return { ok: false, detail: 'geen tijdveld #startuur' };\nconst oudOpslag = H.opslagLees();\nconst oudUur = inv.value;\nconst zet = async (v) => {\n  inv.value = v;\n  inv.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n};\nawait zet('10:15');\nconst tijdNa = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\nconst eindNa = H.q('.eindtijd').textContent.trim();\nconst opslagNa = (H.opslagLees() || {}).startuur;\nawait zet('');\nconst tijdLeeg = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\nconst eindLeeg = H.q('.eindtijd').textContent.trim();\nconst opslagLeeg = (H.opslagLees() || {}).startuur;\nawait zet(oudUur || '09:00');\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok =\n  tijdNa === '10:15' && opslagNa === '10:15' && eindNa === 'tot 13:15' &&\n  tijdLeeg === '10:15' && eindLeeg === 'tot 13:15' && opslagLeeg === '10:15';\nreturn {\n  ok,\n  detail:\n    'na 10:15: eerste blok ' + tijdNa + ', ' + eindNa + ', opslag ' + opslagNa +\n    '; na leegmaken: eerste blok ' + tijdLeeg + ', ' + eindLeeg + ', opslag ' + opslagLeeg,\n};"
 },
 {
  "id": "T033",
  "gebied": "sessietimer",
  "naam": "sessie starten markeert precies één blok als 'nu'",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const oudOpslag = H.opslagLees();\nlet knop = H.q('[data-actie=\"sessie\"]');\nif (!knop) return { ok: false, detail: 'geen sessieknop, staat begeleidersmodus aan?' };\nif (/stoppen/i.test(knop.textContent)) { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\nconst eersteMin = Number(H.q('.blokken .blok .blok-tijd span').textContent.replace(/\\D/g, ''));\nawait H.klik(knop);\nawait H.wacht(80);\nconst blokken = H.qa('.blokken .blok');\nconst nu = blokken.filter((el) => el.classList.contains('nu'));\nconst voorbij = blokken.filter((el) => el.classList.contains('voorbij'));\nconst vlaggen = H.qa('.nu-vlag');\nconst tekst = vlaggen.length ? vlaggen.map((v) => v.textContent.trim()).join(' / ') : '(geen vlag)';\nconst juisteVlag = new RegExp('^nu .{1,3} nog ' + eersteMin + ' min$').test(tekst);\nconst stop = H.q('[data-actie=\"sessie\"]');\nif (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok = nu.length === 1 && nu[0] === blokken[0] && voorbij.length === 0 && vlaggen.length === 1 && juisteVlag;\nreturn {\n  ok,\n  detail:\n    nu.length + ' blok(ken) met .nu, is dat het eerste: ' + (nu[0] === blokken[0]) + ', ' +\n    voorbij.length + ' met .voorbij, ' + vlaggen.length + ' vlag: \"' + tekst +\n    '\" bij een eerste blok van ' + eersteMin + ' min',\n};"
 },
 {
  "id": "T034",
  "gebied": "sessietimer",
  "naam": "sessie stoppen haalt alle markering weg",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const oudOpslag = H.opslagLees();\nlet knop = H.q('[data-actie=\"sessie\"]');\nif (!knop) return { ok: false, detail: 'geen sessieknop, staat begeleidersmodus aan?' };\nif (/stoppen/i.test(knop.textContent)) { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\nawait H.klik(knop);\nawait H.wacht(80);\nconst voorNu = H.qa('.blok.nu').length;\nconst voorVlag = H.qa('.nu-vlag').length;\nawait H.klik(H.q('[data-actie=\"sessie\"]'));\nawait H.wacht(80);\nconst naNu = H.qa('.blok.nu').length;\nconst naVoorbij = H.qa('.blok.voorbij').length;\nconst naVlag = H.qa('.nu-vlag').length;\nconst label = H.q('[data-actie=\"sessie\"]').textContent.trim();\nconst bewaard = (H.opslagLees() || {}).sessieStart;\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok = voorNu === 1 && voorVlag === 1 && naNu === 0 && naVoorbij === 0 && naVlag === 0 &&\n  label === 'Start sessie' && (bewaard === null || bewaard === undefined);\nreturn {\n  ok,\n  detail:\n    'tijdens de sessie ' + voorNu + ' .nu en ' + voorVlag + ' vlag; na stoppen ' + naNu + ' .nu, ' +\n    naVoorbij + ' .voorbij, ' + naVlag + ' vlag, knop leest \"' + label + '\", sessieStart in opslag: ' + bewaard,\n};"
 },
 {
  "id": "T035",
  "gebied": "sessietimer",
  "naam": "tikker stapelt geen tweede 'nu'-vlag op na een doorloop",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const oudOpslag = H.opslagLees();\nlet knop = H.q('[data-actie=\"sessie\"]');\nif (!knop) return { ok: false, detail: 'geen sessieknop, staat begeleidersmodus aan?' };\nif (/stoppen/i.test(knop.textContent)) { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\nawait H.klik(knop);\nawait H.wacht(80);\nconst naEerste = H.qa('.nu-vlag').length;\nawait new Promise((r) => setTimeout(r, 5400));\nconst naTweede = H.qa('.nu-vlag').length;\nconst perBlok = H.qa('.blokken .blok').map((el) => el.querySelectorAll('.nu-vlag').length);\nconst meest = Math.max.apply(null, perBlok);\nconst nuAantal = H.qa('.blok.nu').length;\nconst stop = H.q('[data-actie=\"sessie\"]');\nif (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\nif (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\nconst ok = naEerste === 1 && naTweede === 1 && meest === 1 && nuAantal === 1;\nreturn {\n  ok,\n  detail:\n    'vlaggen na de eerste doorloop: ' + naEerste + ', na ruim 5 s: ' + naTweede +\n    ', hoogste aantal vlaggen in een blok: ' + meest + ', blokken met .nu: ' + nuAantal,\n};"
 },
 {
  "id": "T036",
  "gebied": "sessietimer",
  "naam": "navigeren laat geen tikkend interval achter",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const oudOpslag = H.opslagLees();\nconst origSet = window.setInterval;\nconst origClear = window.clearInterval;\nconst levend = new Set();\nwindow.setInterval = function (fn, ms) {\n  const id = origSet.call(window, fn, ms);\n  if (ms === 5000) levend.add(id);\n  return id;\n};\nwindow.clearInterval = function (id) {\n  levend.delete(id);\n  return origClear.call(window, id);\n};\ntry {\n  let knop = H.q('[data-actie=\"sessie\"]');\n  if (!knop) return { ok: false, detail: 'geen sessieknop, staat begeleidersmodus aan?' };\n  if (/stoppen/i.test(knop.textContent)) { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\n  await H.klik(knop);\n  await H.wacht(60);\n  const naStart = levend.size;\n  await H.ga('#/');\n  await H.wacht(60);\n  const naWeg = levend.size;\n  await H.ga('#/workshop/a1');\n  await H.wacht(60);\n  const terug = levend.size;\n  const stop = H.q('[data-actie=\"sessie\"]');\n  if (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\n  await H.wacht(60);\n  const naStop = levend.size;\n  const ok = naStart === 1 && naWeg === 0 && terug === 1 && naStop === 0;\n  return {\n    ok,\n    detail:\n      'levende tikkers van 5000 ms: na start ' + naStart + ', na naar het overzicht ' + naWeg +\n      ', terug op het draaiboek ' + terug + ', na sessie stoppen ' + naStop,\n  };\n} finally {\n  window.setInterval = origSet;\n  window.clearInterval = origClear;\n  if (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\n}"
 },
 {
  "id": "T037",
  "gebied": "sessietimer",
  "naam": "begeleidersmodus uitzetten stopt markering en tikker",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const oudOpslag = H.opslagLees();\nconst origSet = window.setInterval;\nconst origClear = window.clearInterval;\nconst levend = new Set();\nwindow.setInterval = function (fn, ms) {\n  const id = origSet.call(window, fn, ms);\n  if (ms === 5000) levend.add(id);\n  return id;\n};\nwindow.clearInterval = function (id) {\n  levend.delete(id);\n  return origClear.call(window, id);\n};\ntry {\n  let knop = H.q('[data-actie=\"sessie\"]');\n  if (!knop) return { ok: false, detail: 'geen sessieknop, staat begeleidersmodus aan?' };\n  if (/stoppen/i.test(knop.textContent)) { await H.klik(knop); knop = H.q('[data-actie=\"sessie\"]'); }\n  await H.klik(knop);\n  await H.wacht(60);\n  const aanNu = H.qa('.blok.nu').length;\n  const aanTikker = levend.size;\n  await H.begeleider(false);\n  await H.wacht(80);\n  const uitNu = H.qa('.blok.nu').length;\n  const uitVlag = H.qa('.nu-vlag').length;\n  const uitTikker = levend.size;\n  await H.begeleider(true);\n  await H.wacht(80);\n  const stop = H.q('[data-actie=\"sessie\"]');\n  if (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\n  const ok = aanNu === 1 && aanTikker === 1 && uitNu === 0 && uitVlag === 0 && uitTikker === 0;\n  return {\n    ok,\n    detail:\n      'met begeleidersmodus aan: ' + aanNu + ' .nu en ' + aanTikker + ' tikker; met begeleidersmodus uit: ' +\n      uitNu + ' .nu, ' + uitVlag + ' vlag, ' + uitTikker + ' tikker',\n  };\n} finally {\n  window.setInterval = origSet;\n  window.clearInterval = origClear;\n  if (oudOpslag) H.opslagZet(oudOpslag); else H.opslagWis();\n}"
 },
 {
  "id": "T038",
  "gebied": "sessietimer",
  "naam": "sessie van 40 minuten geleden zet het derde blok op 'nu'",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": true,
  "script": "const blokken = H.qa('.blokken .blok');\nif (!blokken.length) return { ok: false, detail: 'geen draaiboek op het scherm' };\nconst duur = blokken.map((el) => Number(el.querySelector('.blok-tijd span').textContent.replace(/\\D/g, '')));\nlet loper = 0;\nlet verwachtIndex = -1;\nlet verwachtRest = 0;\nduur.forEach((d, i) => {\n  if (40 >= loper && 40 < loper + d) { verwachtIndex = i; verwachtRest = loper + d - 40; }\n  loper += d;\n});\nconst nu = blokken.map((el, i) => (el.classList.contains('nu') ? i : -1)).filter((i) => i >= 0);\nconst voorbij = blokken.map((el, i) => (el.classList.contains('voorbij') ? i : -1)).filter((i) => i >= 0);\nconst vlaggen = H.qa('.nu-vlag');\nconst tekst = vlaggen.length ? vlaggen.map((v) => v.textContent.trim()).join(' / ') : '(geen vlag)';\nconst m = /nog (\\d+) min/.exec(tekst);\nconst rest = m ? Number(m[1]) : null;\nconst verwachtVoorbij = [];\nfor (let i = 0; i < verwachtIndex; i++) verwachtVoorbij.push(i);\nconst ok =\n  nu.length === 1 && nu[0] === verwachtIndex &&\n  voorbij.join(',') === verwachtVoorbij.join(',') &&\n  vlaggen.length === 1 && blokken[verwachtIndex].querySelector('.nu-vlag') !== null &&\n  rest !== null && Math.abs(rest - verwachtRest) <= 1;\nconst stop = H.q('[data-actie=\"sessie\"]');\nif (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\nH.opslagWis();\nreturn {\n  ok,\n  detail:\n    'blok met .nu: [' + nu.join(',') + '], verwacht ' + verwachtIndex + '; .voorbij: [' + voorbij.join(',') +\n    '], verwacht [' + verwachtVoorbij.join(',') + ']; ' + vlaggen.length + ' vlag: \"' + tekst +\n    '\", verwacht nog ' + verwachtRest + ' min',\n};"
 },
 {
  "id": "T039",
  "gebied": "sessietimer",
  "naam": "sessie van vier uur geleden zet alles op 'voorbij' met 'einde draaiboek'",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": true,
  "script": "const blokken = H.qa('.blokken .blok');\nif (!blokken.length) return { ok: false, detail: 'geen draaiboek op het scherm' };\nconst totaal = blokken.reduce(\n  (s, el) => s + Number(el.querySelector('.blok-tijd span').textContent.replace(/\\D/g, '')), 0\n);\nconst nietVoorbij = blokken.map((el, i) => (el.classList.contains('voorbij') ? -1 : i)).filter((i) => i >= 0);\nconst nuAantal = H.qa('.blok.nu').length;\nconst vlaggen = H.qa('.nu-vlag');\nconst laatste = blokken[blokken.length - 1];\nconst vlag = laatste.querySelector('.nu-vlag');\nconst tekst = vlag ? vlag.textContent.trim() : '(geen vlag op het laatste blok)';\nconst m = /(\\d+) min over tijd/.exec(tekst);\nconst over = m ? Number(m[1]) : null;\nconst verwachtOver = 240 - totaal;\nconst ok =\n  nietVoorbij.length === 0 && nuAantal === 0 && vlaggen.length === 1 && vlag !== null &&\n  /einde draaiboek/.test(tekst) && over !== null && Math.abs(over - verwachtOver) <= 1;\nconst stop = H.q('[data-actie=\"sessie\"]');\nif (stop && /stoppen/i.test(stop.textContent)) await H.klik(stop);\nH.opslagWis();\nreturn {\n  ok,\n  detail:\n    blokken.length + ' blokken, waarvan ' + nietVoorbij.length + ' niet .voorbij, ' +\n    nuAantal + ' met .nu, ' + vlaggen.length + ' vlag: \"' + tekst + '\", verwacht ' +\n    verwachtOver + ' min over tijd',\n};"
 },
 {
  "id": "T040",
  "gebied": "sessietimer",
  "naam": "sessie van acht uur oud en geknoeid startuur worden genegeerd",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": true,
  "script": "const inv = H.q('#startuur');\nconst eerste = H.q('.blokken .blok .blok-tijd strong');\nconst eind = H.q('.eindtijd');\nconst knop = H.q('[data-actie=\"sessie\"]');\nif (!inv || !eerste || !eind) return { ok: false, detail: 'draaiboekpagina niet volledig opgebouwd' };\nconst nu = H.qa('.blok.nu').length;\nconst voorbij = H.qa('.blok.voorbij').length;\nconst vlaggen = H.qa('.nu-vlag').length;\nconst label = knop ? knop.textContent.trim() : '(geen sessieknop)';\nconst ok =\n  inv.value === '09:00' && eerste.textContent.trim() === '09:00' && eind.textContent.trim() === 'tot 12:00' &&\n  nu === 0 && voorbij === 0 && vlaggen === 0 && label === 'Start sessie';\nH.opslagWis();\nreturn {\n  ok,\n  detail:\n    'tijdveld ' + inv.value + ', eerste blok ' + eerste.textContent.trim() + ', ' + eind.textContent.trim() +\n    '; markering: ' + nu + ' .nu, ' + voorbij + ' .voorbij, ' + vlaggen + ' vlag; knop leest \"' + label + '\"',\n};"
 },
 {
  "id": "T041",
  "gebied": "blokken",
  "naam": "elk blok heeft een type dat de renderer kent en alle velden die die case gebruikt",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst NODIG = { tekst:['inhoud'], lijst:['items'], kader:['variant','titel','inhoud'], prompt:['titel','tekst'], vergelijk:['zwak','sterk'], opdracht:['titel','inhoud','stappen'], casus:['titel','situatie','oordeel','toelichting'], quiz:['vraag','opties'] };\nconst RIJ = { lijst:'items', opdracht:'stappen', quiz:'opties' };\nlet fout = 0, totaal = 0; const per = {};\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  totaal++; per[b.type] = (per[b.type] || 0) + 1;\n  const plek = m.id + '/' + l.id + '/' + b.type;\n  const nodig = NODIG[b.type];\n  if (!nodig) { console.log('FOUT: blok-type ' + b.type + ' kent de renderer niet (' + plek + ')'); fout++; continue; }\n  for (const veld of nodig) {\n    const w = b[veld];\n    const leeg = w === undefined || w === null || (typeof w === 'string' && !w.trim()) || (Array.isArray(w) && !w.length);\n    if (leeg) { console.log('FOUT: veld ' + veld + ' leeg of afwezig bij ' + plek); fout++; }\n  }\n  const rij = RIJ[b.type];\n  if (rij && !Array.isArray(b[rij])) { console.log('FOUT: ' + rij + ' is geen lijst bij ' + plek); fout++; }\n  if (b.type === 'quiz') for (const o of b.opties || []) {\n    if (typeof o.tekst !== 'string' || typeof o.feedback !== 'string' || typeof o.juist !== 'boolean') { console.log('FOUT: onvolledige quizoptie bij ' + plek); fout++; }\n  }\n}\nconsole.log(totaal + ' blokken: ' + Object.entries(per).map(([k,v]) => k + ' ' + v).join(', '));\nconsole.log(fout ? 'FOUT: ' + fout + ' blokken zijn onvolledig of van een onbekend type' : 'OK');\n\""
 },
 {
  "id": "T042",
  "gebied": "blokken",
  "naam": "elke quizvraag heeft precies één juist antwoord en elke casus een geldig oordeel",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst LABELS = ['mag', 'mag-niet', 'hangt-ervan-af'];\nlet quiz = 0, casus = 0, fout = 0; const telling = { mag:0, 'mag-niet':0, 'hangt-ervan-af':0 };\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  const plek = m.id + '/' + l.id;\n  if (b.type === 'quiz') {\n    quiz++;\n    const juist = b.opties.filter((o) => o.juist === true).length;\n    if (juist !== 1) { console.log('FOUT: ' + juist + ' juiste antwoorden bij ' + plek + ' — de uitslag belooft er precies een'); fout++; }\n    if (b.opties.length < 2) { console.log('FOUT: quiz met ' + b.opties.length + ' optie(s) bij ' + plek); fout++; }\n  }\n  if (b.type === 'casus') {\n    casus++;\n    if (!LABELS.includes(b.oordeel)) { console.log('FOUT: oordeel ' + JSON.stringify(b.oordeel) + ' bij ' + plek + '/' + b.titel + ' — geen label en geen kleur'); fout++; }\n    else telling[b.oordeel]++;\n    if (!b.discussie) { console.log('FOUT: geen gespreksvraag bij casus ' + b.titel); fout++; }\n  }\n}\nconsole.log(quiz + ' quizvragen, ' + casus + ' casussen (mag ' + telling.mag + ', mag-niet ' + telling['mag-niet'] + ', hangt-ervan-af ' + telling['hangt-ervan-af'] + ')');\nconsole.log(fout ? 'FOUT: ' + fout + ' probleem(en)' : 'OK');\n\""
 },
 {
  "id": "T043",
  "gebied": "blokken",
  "naam": "geen tags of entiteiten in velden die door esc() gaan, gebalanceerde opmaak in de rest",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst TOEGELATEN = new Set(['strong', 'em', 'code', 'br', 'a']);\nconst letterlijk = [], opmaak = [];\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  const p = m.id + '/' + l.id + '/' + b.type;\n  if (b.type === 'tekst') opmaak.push([p + '.inhoud', b.inhoud]);\n  if (b.type === 'lijst') b.items.forEach((i, n) => opmaak.push([p + '.items[' + n + ']', i]));\n  if (b.type === 'kader') { letterlijk.push([p + '.titel', b.titel]); opmaak.push([p + '.inhoud', b.inhoud]); }\n  if (b.type === 'prompt') { letterlijk.push([p + '.titel', b.titel]); letterlijk.push([p + '.tekst', b.tekst]); if (b.uitleg) opmaak.push([p + '.uitleg', b.uitleg]); }\n  if (b.type === 'vergelijk') { letterlijk.push([p + '.zwak', b.zwak]); letterlijk.push([p + '.sterk', b.sterk]); if (b.uitleg) opmaak.push([p + '.uitleg', b.uitleg]); }\n  if (b.type === 'opdracht') { letterlijk.push([p + '.titel', b.titel]); opmaak.push([p + '.inhoud', b.inhoud]); b.stappen.forEach((s, n) => letterlijk.push([p + '.stappen[' + n + ']', s])); }\n  if (b.type === 'casus') { letterlijk.push([p + '.titel', b.titel]); letterlijk.push([p + '.situatie', b.situatie]); letterlijk.push([p + '.toelichting', b.toelichting]); if (b.discussie) letterlijk.push([p + '.discussie', b.discussie]); }\n  if (b.type === 'quiz') { letterlijk.push([p + '.vraag', b.vraag]); b.opties.forEach((o, n) => { letterlijk.push([p + '.optie' + n + '.tekst', o.tekst]); letterlijk.push([p + '.optie' + n + '.feedback', o.feedback]); }); }\n}\nlet fout = 0;\nfor (const [w, v] of letterlijk) {\n  if (/[<>]/.test(v)) { console.log('FOUT: ' + w + ' gaat door esc() en bevat een tag — die komt letterlijk op het scherm'); fout++; }\n  if (/&[a-zA-Z]+;|&#[0-9]+;/.test(v)) { console.log('FOUT: ' + w + ' bevat de HTML-entiteit ' + v.match(/&[a-zA-Z#0-9]+;/)[0] + ' — die wordt dubbel geescaped'); fout++; }\n}\nfor (const [w, v] of opmaak) {\n  if (/&[a-zA-Z]+;|&#[0-9]+;/.test(v)) { console.log('LET OP: ' + w + ' bevat ' + v.match(/&[a-zA-Z#0-9]+;/)[0]); }\n  const stapel = [];\n  for (const t of v.matchAll(/<(\\/?)([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g)) {\n    const naam = t[2].toLowerCase();\n    if (!TOEGELATEN.has(naam)) { console.log('FOUT: ' + w + ' gebruikt de tag <' + naam + '> die hier niet hoort'); fout++; continue; }\n    if (naam === 'br') continue;\n    if (t[1]) { if (stapel.pop() !== naam) { console.log('FOUT: ' + w + ' sluit </' + naam + '> zonder te openen'); fout++; } }\n    else stapel.push(naam);\n  }\n  if (stapel.length) { console.log('FOUT: ' + w + ' laat <' + stapel.join('>, <') + '> openstaan'); fout++; }\n}\nconsole.log(letterlijk.length + ' letterlijke velden en ' + opmaak.length + ' opmaakvelden nagekeken');\nconsole.log(fout ? 'FOUT: ' + fout + ' veld(en)' : 'OK');\n\""
 },
 {
  "id": "T044",
  "gebied": "blokken",
  "naam": "alle 133 blokken renderen, per module en per type geteld",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nconst SEL = {\n  tekst: '.les p.tekst',\n  lijst: '.les .opsomming',\n  kader: '.les aside.kader',\n  prompt: '.les figure.promptblok',\n  vergelijk: '.les .vergelijk',\n  opdracht: '.les section.opdracht',\n  casus: '.les section.casus',\n  quiz: '.les section.quiz',\n};\nconst fouten = [];\nlet verwachtTotaal = 0, gezienTotaal = 0, lijsten = 0;\nfor (const m of MODULES) {\n  await H.ga('#/module/' + m.id);\n  const verwacht = {};\n  const vormenVerwacht = [];\n  for (const l of m.lessen) for (const b of l.blokken) {\n    verwacht[b.type] = (verwacht[b.type] || 0) + 1;\n    if (b.type === 'lijst') vormenVerwacht.push(b.geordend ? 'OL' : 'UL');\n  }\n  for (const type of Object.keys(SEL)) {\n    const gezien = H.qa(SEL[type]).length;\n    const wil = verwacht[type] || 0;\n    verwachtTotaal += wil;\n    gezienTotaal += gezien;\n    if (gezien !== wil) fouten.push(m.id + ': ' + wil + ' ' + type + '-blokken in de data, ' + gezien + ' op het scherm');\n  }\n  const vormen = H.qa('.les .opsomming').map((e) => e.tagName);\n  lijsten += vormen.length;\n  if (vormen.join(',') !== vormenVerwacht.join(',')) {\n    fouten.push(m.id + ': lijstvormen ' + vormen.join(',') + ' in plaats van ' + vormenVerwacht.join(','));\n  }\n}\nawait H.ga('#/');\nreturn {\n  ok: fouten.length === 0,\n  detail: gezienTotaal + ' van de ' + verwachtTotaal + ' blokken gerenderd over ' + MODULES.length + ' modules, ' + lijsten + ' opsommingen in de juiste ol/ul-vorm' + (fouten.length ? ' — ' + fouten.join('; ') : ''),\n};"
 },
 {
  "id": "T045",
  "gebied": "blokken",
  "naam": "promptteksten, quizopties en casusteksten staan letterlijk op het scherm",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nconst fouten = [];\nlet vergeleken = 0;\nconst knip = (s) => JSON.stringify(String(s).slice(0, 60));\nfor (const m of MODULES) {\n  const soorten = [];\n  for (const l of m.lessen) for (const b of l.blokken) soorten.push(b);\n  const prompts = soorten.filter((b) => b.type === 'prompt');\n  const quizzen = soorten.filter((b) => b.type === 'quiz');\n  const casussen = soorten.filter((b) => b.type === 'casus');\n  if (!prompts.length && !quizzen.length && !casussen.length) continue;\n  await H.ga('#/module/' + m.id);\n  H.qa('.les figure.promptblok pre code').forEach((el, i) => {\n    vergeleken++;\n    if (!prompts[i] || el.textContent !== prompts[i].tekst) fouten.push(m.id + ' prompttekst ' + i + ': ' + knip(el.textContent));\n  });\n  H.qa('.les section.quiz').forEach((q, i) => {\n    const b = quizzen[i];\n    if (!b) return;\n    vergeleken++;\n    const kop = q.querySelector('h3');\n    if (!kop || kop.textContent !== b.vraag) fouten.push(m.id + ' quizvraag: ' + knip(kop && kop.textContent));\n    [...q.querySelectorAll('.optie')].forEach((o, j) => {\n      vergeleken += 2;\n      const t = o.querySelector('.optie-tekst');\n      const f = o.querySelector('.optie-feedback');\n      if (!b.opties[j]) { fouten.push(m.id + ' optie ' + j + ' bestaat niet in de data'); return; }\n      if (!t || t.textContent !== b.opties[j].tekst) fouten.push(m.id + ' optietekst ' + j + ': ' + knip(t && t.textContent));\n      if (!f || f.textContent !== b.opties[j].feedback) fouten.push(m.id + ' optiefeedback ' + j + ': ' + knip(f && f.textContent));\n    });\n  });\n  H.qa('.les section.casus').forEach((c, i) => {\n    const b = casussen[i];\n    if (!b) return;\n    vergeleken += 2;\n    const s = c.querySelector('.casus-situatie');\n    const t = c.querySelector('.casus-antwoord p:not(.casus-discussie)');\n    if (!s || s.textContent !== b.situatie) fouten.push(m.id + ' casussituatie ' + i + ': ' + knip(s && s.textContent));\n    if (!t || t.textContent !== b.toelichting) fouten.push(m.id + ' casustoelichting ' + i + ': ' + knip(t && t.textContent));\n  });\n}\nawait H.ga('#/');\nreturn {\n  ok: fouten.length === 0,\n  detail: vergeleken + ' teksten letterlijk vergeleken met de data' + (fouten.length ? ' — ' + fouten.length + ' verschillen, eerste: ' + fouten[0] : ', geen enkel verschil'),\n};"
 },
 {
  "id": "T046",
  "gebied": "blokken",
  "naam": "een juist quizantwoord markeert alle opties, meldt \"Juist gekozen.\" en zet aria-disabled",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/');\nawait H.ga('#/module/kennismaking');\nconst quiz = H.q('.les section.quiz');\nif (!quiz) return { ok: false, detail: 'geen quizblok gevonden op de modulepagina kennismaking' };\nconst uitslag = quiz.querySelector('.quiz-uitslag');\nconst opties = quiz.querySelector('.opties');\nconst kop = quiz.querySelector('h3');\nconst vooraf = uitslag ? uitslag.textContent : '(geen .quiz-uitslag)';\nconst juisteKnop = quiz.querySelector('.optie[data-juist=\"true\"]');\nif (!juisteKnop) return { ok: false, detail: 'geen enkele optie draagt data-juist=true' };\nawait H.klik(juisteKnop);\nconst knoppen = [...quiz.querySelectorAll('.optie')];\nconst p = [];\nif (vooraf !== '') p.push('de uitslag stond niet leeg voor het antwoorden: ' + JSON.stringify(vooraf));\nif (!uitslag || uitslag.getAttribute('role') !== 'status') p.push('quiz-uitslag heeft role=' + (uitslag && uitslag.getAttribute('role')));\nif (!opties || opties.getAttribute('role') !== 'group') p.push('de optiegroep heeft role=' + (opties && opties.getAttribute('role')));\nif (!kop || !kop.id || !opties || opties.getAttribute('aria-labelledby') !== kop.id) p.push('aria-labelledby=' + (opties && opties.getAttribute('aria-labelledby')) + ' wijst niet naar de vraag');\nconst misMarkering = knoppen.filter((o) => !o.classList.contains(o.dataset.juist === 'true' ? 'is-juist' : 'is-fout'));\nif (misMarkering.length) p.push(misMarkering.length + ' van de ' + knoppen.length + ' opties kregen geen is-juist/is-fout');\nconst misAria = knoppen.filter((o) => o.getAttribute('aria-disabled') !== 'true');\nif (misAria.length) p.push(misAria.length + ' van de ' + knoppen.length + ' opties missen aria-disabled');\nif (!juisteKnop.classList.contains('gekozen')) p.push('de aangeklikte optie kreeg de klasse gekozen niet');\nif (!quiz.classList.contains('beantwoord')) p.push('de quiz kreeg de klasse beantwoord niet');\nif (!uitslag || uitslag.textContent !== 'Juist gekozen.') p.push('de uitslag luidt ' + JSON.stringify(uitslag && uitslag.textContent));\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'uitslag \"Juist gekozen.\", alle ' + knoppen.length + ' opties gemarkeerd met aria-disabled, role=group met aria-labelledby naar ' + kop.id,\n};"
 },
 {
  "id": "T047",
  "gebied": "blokken",
  "naam": "een fout quizantwoord duidt het juiste aan en een tweede klik verandert niets",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/');\nawait H.ga('#/module/kennismaking');\nconst quiz = H.q('.les section.quiz');\nif (!quiz) return { ok: false, detail: 'geen quizblok gevonden op de modulepagina kennismaking' };\nconst fouteKnop = quiz.querySelector('.optie[data-juist=\"false\"]');\nconst juisteKnop = quiz.querySelector('.optie[data-juist=\"true\"]');\nif (!fouteKnop || !juisteKnop) return { ok: false, detail: 'de quiz heeft geen fout en juist antwoord naast elkaar' };\nawait H.klik(fouteKnop);\nconst uitslag = quiz.querySelector('.quiz-uitslag');\nconst naFout = uitslag ? uitslag.textContent : '(geen .quiz-uitslag)';\nconst juistAangeduid = juisteKnop.classList.contains('is-juist');\nconst foutGekozen = fouteKnop.classList.contains('gekozen') && fouteKnop.classList.contains('is-fout');\nawait H.klik(juisteKnop);\nconst naTweede = uitslag ? uitslag.textContent : '(geen .quiz-uitslag)';\nconst gekozen = quiz.querySelectorAll('.optie.gekozen').length;\nconst p = [];\nif (naFout !== 'Niet juist. Het juiste antwoord staat nu aangeduid.') p.push('uitslag na een fout antwoord: ' + JSON.stringify(naFout));\nif (!juistAangeduid) p.push('het juiste antwoord kreeg geen is-juist');\nif (!foutGekozen) p.push('de foute keuze kreeg geen gekozen en is-fout');\nif (naTweede !== naFout) p.push('de tweede klik veranderde de uitslag in ' + JSON.stringify(naTweede));\nif (gekozen !== 1) p.push('na twee kliks dragen ' + gekozen + ' opties de klasse gekozen');\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'fout antwoord meldt \"' + naFout + '\", het juiste staat aangeduid en een tweede klik verandert niets (1 gekozen optie)',\n};"
 },
 {
  "id": "T048",
  "gebied": "blokken",
  "naam": "de casusknop toggelt heen en terug en blijft staan",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/');\nawait H.ga('#/module/casussen');\nconst casus = H.q('.les section.casus');\nif (!casus) return { ok: false, detail: 'geen casusblok gevonden op de modulepagina casussen' };\nconst knop = casus.querySelector('.casus-knop');\nconst antwoord = casus.querySelector('.casus-antwoord');\nif (!knop || !antwoord) return { ok: false, detail: 'de casus heeft geen knop of geen antwoordblok' };\nconst lees = () => ({\n  tekst: knop.textContent.trim(),\n  aria: knop.getAttribute('aria-expanded'),\n  zicht: H.zichtbaar(antwoord),\n  open: casus.classList.contains('open'),\n  staatEr: document.contains(knop),\n});\nconst start = lees();\nawait H.klik(knop);\nconst uit = lees();\nawait H.klik(knop);\nconst dicht = lees();\nconst p = [];\nif (start.tekst !== 'Toon het oordeel' || start.aria !== 'false' || start.zicht) {\n  p.push('startstand: \"' + start.tekst + '\", aria-expanded=' + start.aria + ', antwoord zichtbaar=' + start.zicht);\n}\nif (uit.tekst !== 'Verberg het oordeel' || uit.aria !== 'true' || !uit.zicht || !uit.open || !uit.staatEr) {\n  p.push('na openen: \"' + uit.tekst + '\", aria-expanded=' + uit.aria + ', zichtbaar=' + uit.zicht + ', knop nog aanwezig=' + uit.staatEr);\n}\nif (dicht.tekst !== 'Toon het oordeel' || dicht.aria !== 'false' || dicht.zicht || dicht.open) {\n  p.push('na sluiten: \"' + dicht.tekst + '\", aria-expanded=' + dicht.aria + ', zichtbaar=' + dicht.zicht);\n}\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'knop gaat van \"Toon het oordeel\" naar \"Verberg het oordeel\" en terug, aria-expanded volgt en de knop blijft staan',\n};"
 },
 {
  "id": "T049",
  "gebied": "blokken",
  "naam": "de gespreksvraag bij een casus staat er enkel in begeleidersmodus",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nconst data = [];\nfor (const l of MODULES.find((m) => m.id === 'casussen').lessen) for (const b of l.blokken) if (b.type === 'casus') data.push(b);\nawait H.ga('#/');\nawait H.ga('#/module/casussen');\nconst zonder = H.qa('.casus-discussie').length;\nconst casussen = H.qa('.les section.casus').length;\nawait H.begeleider(true);\nconst met = H.qa('.casus-discussie').length;\nconst eerste = H.q('.casus-discussie');\nconst tekstKlopt = !!eerste && eerste.textContent.indexOf(data[0].discussie) >= 0;\nawait H.begeleider(false);\nconst terug = H.qa('.casus-discussie').length;\nconst p = [];\nif (casussen !== data.length) p.push(casussen + ' casussen op het scherm in plaats van ' + data.length);\nif (zonder !== 0) p.push(zonder + ' gespreksvragen in de pagina zonder begeleidersmodus');\nif (met !== data.length) p.push(met + ' gespreksvragen in begeleidersmodus, ' + data.length + ' verwacht');\nif (!tekstKlopt) p.push('de gespreksvraag van de eerste casus komt niet letterlijk overeen met de data');\nif (terug !== 0) p.push('na het uitzetten staan er nog ' + terug + ' gespreksvragen');\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'geen enkele gespreksvraag zonder begeleidersmodus, ' + met + ' met (bij ' + casussen + ' casussen)',\n};"
 },
 {
  "id": "T050",
  "gebied": "blokken",
  "naam": "de kopieerknop legt de prompttekst letterlijk op het klembord, met regeleindes",
  "soort": "browser",
  "route": "#/module/prompten",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nlet verwacht = null;\nfor (const l of MODULES.find((m) => m.id === 'prompten').lessen) for (const b of l.blokken) if (b.type === 'prompt') verwacht = b.tekst;\nawait H.ga('#/');\nawait H.ga('#/module/prompten');\nconst blok = H.q('.les figure.promptblok');\nif (!blok || verwacht === null) return { ok: false, detail: 'geen promptblok gevonden op de modulepagina prompten' };\nconst knop = blok.querySelector('[data-actie=\"kopieer\"]');\nconst code = blok.querySelector('pre code');\nconst echt = Object.getOwnPropertyDescriptor(navigator, 'clipboard');\nlet gevangen = null;\nlet melding = '';\nObject.defineProperty(navigator, 'clipboard', {\n  configurable: true,\n  value: { writeText: (t) => { gevangen = t; return Promise.resolve(); } },\n});\ntry {\n  await H.klik(knop);\n  await H.wacht(80);\n  melding = knop.textContent.trim();\n} finally {\n  if (echt) Object.defineProperty(navigator, 'clipboard', echt);\n  else delete navigator.clipboard;\n}\nconst p = [];\nif (gevangen === null) p.push('er werd niets naar het klembord geschreven');\nelse if (gevangen !== verwacht) p.push('de gekopieerde tekst wijkt af van de data: ' + gevangen.length + ' tekens over ' + gevangen.split('\\n').length + ' regels in plaats van ' + verwacht.length + ' over ' + verwacht.split('\\n').length);\nif (melding !== 'Gekopieerd') p.push('de knop meldt ' + JSON.stringify(melding));\nif (!code || code.textContent !== verwacht) p.push('de prompttekst op het scherm wijkt af van de data');\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'prompt van ' + verwacht.length + ' tekens over ' + verwacht.split('\\n').length + ' regels letterlijk gekopieerd, knop meldt \"Gekopieerd\"',\n};"
 },
 {
  "id": "T051",
  "gebied": "blokken",
  "naam": "zonder navigator.clipboard selecteert de knop de prompt en vraagt hij het zelf te kopieren",
  "soort": "browser",
  "route": "#/module/prompten",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/');\nawait H.ga('#/module/prompten');\nconst blok = H.q('.les figure.promptblok');\nif (!blok) return { ok: false, detail: 'geen promptblok gevonden op de modulepagina prompten' };\nconst knop = blok.querySelector('[data-actie=\"kopieer\"]');\nconst code = blok.querySelector('pre code');\nconst echt = Object.getOwnPropertyDescriptor(navigator, 'clipboard');\nlet melding = '';\nlet selectie = '';\nObject.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });\ntry {\n  await H.klik(knop);\n  melding = knop.textContent.trim();\n  const s = window.getSelection();\n  selectie = s ? String(s) : '';\n} finally {\n  if (echt) Object.defineProperty(navigator, 'clipboard', echt);\n  else delete navigator.clipboard;\n  const s = window.getSelection();\n  if (s) s.removeAllRanges();\n}\nconst p = [];\nif (melding !== 'Staat geselecteerd — kopieer zelf') p.push('de knop meldt ' + JSON.stringify(melding));\nif (selectie.trim() !== code.textContent.trim()) p.push('de selectie telt ' + selectie.trim().length + ' tekens in plaats van de ' + code.textContent.trim().length + ' van de prompt');\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'zonder navigator.clipboard staat de prompt van ' + code.textContent.trim().length + ' tekens geselecteerd en meldt de knop dat je zelf moet kopieren',\n};"
 },
 {
  "id": "T052",
  "gebied": "blokken",
  "naam": "een onbekend blok-type waarschuwt in de console en toont enkel de begeleider een melding",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nconst les = MODULES.find((m) => m.id === 'kennismaking').lessen[0];\nconst proef = { type: 'zzz-proefblok' };\nconst echteWarn = console.warn;\nconst gemeld = [];\nconst p = [];\nconsole.warn = function () { gemeld.push([...arguments].map(String).join(' ')); };\ntry {\n  les.blokken.push(proef);\n  await H.ga('#/');\n  await H.ga('#/module/kennismaking');\n  const zichtbaarZonder = H.qa('.les p.tekst').filter((e) => e.textContent.indexOf('zzz-proefblok') >= 0).length;\n  const warnZonder = gemeld.filter((t) => t.indexOf('zzz-proefblok') >= 0).length;\n  const tekstenZonder = H.qa('.les p.tekst').length;\n  await H.begeleider(true);\n  const zichtbaarMet = H.qa('.les p.tekst em').filter((e) => e.textContent.indexOf('zzz-proefblok') >= 0).length;\n  const warnMet = gemeld.filter((t) => t.indexOf('zzz-proefblok') >= 0).length;\n  if (warnZonder < 1) p.push('een onbekend blok-type geeft geen console.warn');\n  if (zichtbaarZonder !== 0) p.push('de deelnemer ziet ' + zichtbaarZonder + ' melding(en) over het onbekende blok');\n  if (tekstenZonder !== 3) p.push('er staan ' + tekstenZonder + ' tekstblokken op de pagina in plaats van de 3 uit de data');\n  if (zichtbaarMet !== 1) p.push('in begeleidersmodus staan er ' + zichtbaarMet + ' meldingen in plaats van 1');\n  if (warnMet <= warnZonder) p.push('bij het opnieuw tekenen kwam er geen nieuwe waarschuwing (' + warnMet + ')');\n} finally {\n  console.warn = echteWarn;\n  const i = les.blokken.indexOf(proef);\n  if (i >= 0) les.blokken.splice(i, 1);\n  await H.begeleider(false);\n  await H.ga('#/');\n}\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : 'onbekend blok-type geeft een console.warn, blijft onzichtbaar voor de deelnemer en toont in begeleidersmodus precies een melding',\n};"
 },
 {
  "id": "T053",
  "gebied": "blokken",
  "naam": "kaders, opdrachten, casussen en quizzen dragen een h3, nergens nog een h4",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const paginas = ['veilig-en-ethisch', 'prompten', 'casussen'];\nconst p = [];\nlet koppen = 0;\nlet h4 = 0;\nfor (const id of paginas) {\n  await H.ga('#/module/' + id);\n  h4 += H.qa('#hoofd .les h4').length;\n  for (const sel of ['aside.kader', 'section.opdracht', 'section.casus', 'section.quiz']) {\n    for (const el of H.qa('.les ' + sel)) {\n      if (el.querySelector(':scope > h3')) koppen++;\n      else p.push(id + ': een blok ' + sel + ' zonder eigen h3');\n    }\n  }\n  const lessen = H.qa('.les').length;\n  const h2 = H.qa('.les .les-kop h2').length;\n  if (lessen !== h2) p.push(id + ': ' + lessen + ' lessen maar ' + h2 + ' h2-koppen');\n}\nif (h4) p.push(h4 + ' h4-koppen in de inhoud gevonden');\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : koppen + ' kaders, opdrachten, casussen en quizzen met een h3-kop, geen enkele h4 op de drie nagekeken modules',\n};"
 },
 {
  "id": "T054",
  "gebied": "blokken",
  "naam": "elke casus toont het juiste oordeel-label en houdt het verborgen tot je klikt",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const { MODULES } = await import('/js/cursus.js');\nconst LABEL = { mag: 'Mag', 'mag-niet': 'Mag niet', 'hangt-ervan-af': 'Hangt ervan af' };\nconst data = [];\nfor (const l of MODULES.find((m) => m.id === 'casussen').lessen) for (const b of l.blokken) if (b.type === 'casus') data.push(b);\nawait H.ga('#/');\nawait H.ga('#/module/casussen');\nconst casussen = H.qa('.les section.casus');\nconst p = [];\nif (casussen.length !== data.length) p.push(casussen.length + ' casussen op het scherm in plaats van ' + data.length);\ncasussen.forEach((c, i) => {\n  const b = data[i];\n  if (!b) return;\n  const badge = c.querySelector('.oordeel');\n  if (!badge) { p.push('casus \"' + b.titel + '\" heeft geen oordeel-badge'); return; }\n  if (badge.textContent.trim() !== LABEL[b.oordeel]) p.push('casus \"' + b.titel + '\" toont ' + JSON.stringify(badge.textContent.trim()) + ' in plaats van ' + JSON.stringify(LABEL[b.oordeel]));\n  if (!badge.classList.contains('oordeel-' + b.oordeel)) p.push('casus \"' + b.titel + '\" mist de klasse oordeel-' + b.oordeel);\n  if (!c.hasAttribute('data-casus')) p.push('casus \"' + b.titel + '\" mist data-casus, de knop kan zijn kader niet vinden');\n  if (H.zichtbaar(c.querySelector('.casus-antwoord'))) p.push('het oordeel van \"' + b.titel + '\" staat meteen open');\n});\nawait H.ga('#/');\nreturn {\n  ok: p.length === 0,\n  detail: p.length ? p.join('; ') : casussen.length + ' casussen met het juiste label en de juiste kleurklasse, alle oordelen verborgen tot je klikt',\n};"
 },
 {
  "id": "T055",
  "gebied": "bundel",
  "naam": "elke bundel heeft doelen, twee vuistregels, alle prompts, alle opdrachten en notitieruimte",
  "soort": "browser",
  "route": "#/bundel/a1",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const verw = { a1: { p: 3, o: 3 }, a2: { p: 4, o: 2 }, a3: { p: 3, o: 2 }, b1: { p: 4, o: 3 }, b2: { p: 2, o: 2 }, b3: { p: 1, o: 1 } };\nconst D = await import('/js/cursus.js').catch(() => null);\nconst fouten = [];\nconst rij = [];\nfor (const id of ['a1', 'a2', 'a3', 'b1', 'b2', 'b3']) {\n  await H.ga('#/bundel/' + id);\n  let p = verw[id].p, o = verw[id].o, d = null;\n  if (D) {\n    const w = D.vindWorkshop(id);\n    const mods = D.modulesVanWorkshop(w);\n    p = D.blokkenVanType(mods, 'prompt').length;\n    o = D.blokkenVanType(mods, 'opdracht').length;\n    d = w.doelen.length;\n  }\n  const gP = H.qa('.bundel .promptblok.bundel-prompt').length;\n  const gO = H.qa('.bundel .opdracht').length;\n  const gD = H.qa('.bundel .vinkjes li').length;\n  const gV = H.qa('.bundel .vuistregel').length;\n  const lijnen = H.qa('.bundel .notities .lijnen').map((el) => el.querySelectorAll('i').length).join('+');\n  rij.push(id + ' ' + gP + 'p/' + gO + 'o/' + gD + 'd/' + gV + 'v/' + lijnen);\n  if (gP !== p) fouten.push(id + ' prompts ' + gP + ' ipv ' + p);\n  if (gO !== o) fouten.push(id + ' opdrachten ' + gO + ' ipv ' + o);\n  if (d !== null && gD !== d) fouten.push(id + ' doelen ' + gD + ' ipv ' + d);\n  if (gV !== 2) fouten.push(id + ' heeft ' + gV + ' vuistregels');\n  if (lijnen !== '3+10') fouten.push(id + ' notitielijnen ' + lijnen);\n}\nreturn { ok: fouten.length === 0, detail: (D ? 'vergeleken met blokkenVanType — ' : 'vergeleken met vaste aantallen — ') + rij.join(' | ') + (fouten.length ? ' — FOUT: ' + fouten.join('; ') : '') };"
 },
 {
  "id": "T056",
  "gebied": "bundel",
  "naam": "B1/B2/B3 krijgen de vibe-vuistregel, A1/A2/A3 de andere",
  "soort": "browser",
  "route": "#/bundel/a1",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const fouten = [];\nconst rij = [];\nfor (const id of ['a1', 'a2', 'a3', 'b1', 'b2', 'b3']) {\n  await H.ga('#/bundel/' + id);\n  const regels = H.qa('.bundel .vuistregel').map((e) => e.textContent.replace(/\\s+/g, ' ').trim());\n  const tekst = regels.join(' ');\n  const isVibe = /Online is publiek/.test(tekst) && /Klik ze zelf kapot/.test(tekst);\n  const isAi = /prikbord in de leraarskamer/.test(tekst) && /\\[LEERLING\\]/.test(tekst);\n  const hoortVibe = id.charAt(0) === 'b';\n  const codeVibe = H.q('.bundel-kop .code').classList.contains('vibe');\n  if (regels.length !== 2) fouten.push(id + ' heeft ' + regels.length + ' vuistregels');\n  if (hoortVibe && !(isVibe && !isAi)) fouten.push(id + ' krijgt de vibe-vuistregel niet');\n  if (!hoortVibe && !(isAi && !isVibe)) fouten.push(id + ' krijgt de AI-vuistregel niet');\n  if (codeVibe !== hoortVibe) fouten.push(id + ' code-klasse vibe=' + codeVibe);\n  rij.push(id + '=' + (isVibe ? 'online-is-publiek' : '') + (isAi ? 'prikbord' : '') + (isVibe || isAi ? '' : 'GEEN'));\n}\nreturn { ok: fouten.length === 0, detail: rij.join(' ') + (fouten.length ? ' — FOUT: ' + fouten.join('; ') : '') };"
 },
 {
  "id": "T057",
  "gebied": "bundel",
  "naam": "casussen staan enkel in de bundel van A3, en dan alle 14",
  "soort": "browser",
  "route": "#/bundel/a1",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const fouten = [];\nconst rij = [];\nfor (const id of ['a1', 'a2', 'a3', 'b1', 'b2', 'b3']) {\n  await H.ga('#/bundel/' + id);\n  const secties = H.qa('.bundel .bundel-casussen').length;\n  const n = H.qa('.bundel .casus').length;\n  rij.push(id + '=' + n);\n  if (id === 'a3') {\n    if (n !== 14 || secties !== 1) fouten.push('a3 toont ' + n + ' casussen in ' + secties + ' sectie(s)');\n  } else if (n !== 0 || secties !== 0) {\n    fouten.push(id + ' toont ' + n + ' casussen in ' + secties + ' sectie(s)');\n  }\n}\nreturn { ok: fouten.length === 0, detail: 'casussen per bundel: ' + rij.join(' ') + (fouten.length ? ' — FOUT: ' + fouten.join('; ') : '') };"
 },
 {
  "id": "T058",
  "gebied": "bundel",
  "naam": "bundel A3 zonder begeleidersmodus: enkel de situatie, geen oordeel en geen knop",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const casussen = H.qa('.bundel-casussen .casus');\nconst antwoorden = H.qa('.bundel-casussen .casus-antwoord').length;\nconst oordelen = H.qa('.bundel-casussen .oordeel').length;\nconst knoppen = H.qa('.bundel-casussen .casus-knop, .bundel-casussen [data-actie=\"casus\"]').length;\nconst open = casussen.filter((c) => c.classList.contains('open')).length;\nconst kop = H.q('.bundel-casussen h2').textContent.trim();\nconst hint = H.q('.bundel-casussen .bundel-hint').textContent.replace(/\\s+/g, ' ').trim();\nconst situaties = H.qa('.bundel-casussen .casus-situatie').filter((p) => p.textContent.trim().length > 40).length;\nconst hintOk = /Beslis eerst zelf/.test(hint);\nconst ok = casussen.length === 14 && antwoorden === 0 && oordelen === 0 && knoppen === 0 && open === 0 && situaties === 14 && kop === 'De casussen' && hintOk;\nreturn {\n  ok: ok,\n  detail: casussen.length + ' casussen met ' + situaties + ' situaties, ' + antwoorden + ' antwoordblokken, ' + oordelen + ' oordelen, ' + knoppen + ' knoppen, ' + open + ' met klasse open; kop \"' + kop + '\"; hint ' + (hintOk ? 'nodigt uit om zelf te beslissen' : 'FOUT: ' + hint.slice(0, 50)),\n};"
 },
 {
  "id": "T059",
  "gebied": "bundel",
  "naam": "bundel A3 met begeleidersmodus: 14 open casussen met oordeel en toelichting",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const D = await import('/js/cursus.js').catch(() => null);\nconst casussen = H.qa('.bundel-casussen .casus');\nconst open = casussen.filter((c) => c.classList.contains('open')).length;\nconst antwoorden = H.qa('.bundel-casussen .casus-antwoord').length;\nconst knoppen = H.qa('.bundel-casussen .casus-knop, .bundel-casussen [data-actie=\"casus\"]').length;\nconst discussies = H.qa('.bundel-casussen .casus-discussie').length;\nconst kop = H.q('.bundel-casussen h2').textContent.trim();\nconst labels = H.qa('.bundel-casussen .oordeel').map((e) => e.textContent.trim());\nconst geldig = labels.filter((l) => ['Mag', 'Mag niet', 'Hangt ervan af'].indexOf(l) >= 0).length;\nconst toelichting = H.qa('.bundel-casussen .casus-antwoord p').filter((p) => p.textContent.trim().length > 40).length;\nlet volgorde = 'data niet geladen';\nlet volgordeOk = true;\nif (D) {\n  const uitData = D.blokkenVanType([D.vindModule('casussen')], 'casus').map((x) => x.blok.oordeel);\n  const uitDom = H.qa('.bundel-casussen .oordeel').map((e) => (e.className.match(/oordeel-([a-z-]+)/) || [])[1]);\n  volgordeOk = uitData.join(',') === uitDom.join(',');\n  volgorde = volgordeOk ? 'oordelen in dezelfde volgorde als de data' : 'AFWIJKING data=' + uitData.join(',') + ' dom=' + uitDom.join(',');\n}\nconst ok = casussen.length === 14 && open === 14 && antwoorden === 14 && knoppen === 0 && discussies === 0 && geldig === 14 && toelichting === 14 && kop === 'De casussen, met het oordeel' && volgordeOk;\nreturn {\n  ok: ok,\n  detail: casussen.length + ' casussen, ' + open + ' met klasse open, ' + antwoorden + ' antwoordblokken, ' + geldig + ' geldige oordelen, ' + toelichting + ' toelichtingen, ' + knoppen + ' knoppen, ' + discussies + ' discussietips; kop \"' + kop + '\"; ' + volgorde,\n};"
 },
 {
  "id": "T060",
  "gebied": "bundel",
  "naam": "op papier krijgt elke casus in de bundel een keuzevakje, behalve in begeleidersmodus",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\nlet zonder = null;\nlet met = null;\ntry {\n  const vakje = (c) => /mag niet/.test(getComputedStyle(c, '::after').content);\n  const zichtbaar = (el) => getComputedStyle(el).display !== 'none';\n  zonder = {\n    casussen: H.qa('.bundel-casussen .casus').length,\n    vakjes: H.qa('.bundel-casussen .casus').filter(vakje).length,\n    antwoorden: H.qa('.bundel-casussen .casus-antwoord').filter(zichtbaar).length,\n  };\n  await H.begeleider(true);\n  met = {\n    casussen: H.qa('.bundel-casussen .casus').length,\n    vakjes: H.qa('.bundel-casussen .casus').filter(vakje).length,\n    antwoorden: H.qa('.bundel-casussen .casus-antwoord').filter(zichtbaar).length,\n  };\n} finally {\n  await H.begeleider(false);\n  uit();\n}\nconst ok = zonder.casussen === 14 && zonder.vakjes === 14 && zonder.antwoorden === 0 && met.casussen === 14 && met.vakjes === 0 && met.antwoorden === 14;\nreturn {\n  ok: ok,\n  detail: 'op papier zonder begeleidersmodus: ' + zonder.vakjes + '/' + zonder.casussen + ' keuzevakjes en ' + zonder.antwoorden + ' zichtbare oordelen; met begeleidersmodus: ' + met.vakjes + ' keuzevakjes en ' + met.antwoorden + '/' + met.casussen + ' zichtbare oordelen',\n};"
 },
 {
  "id": "T061",
  "gebied": "bundel",
  "naam": "de begeleidersbanner verschijnt op het draaiboek én op de bundel, met eigen tekst",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\nlet paginaBundel = null, paginaWorkshop = null, banner = '', bannerWorkshop = '';\ntry {\n  paginaBundel = document.body.dataset.pagina;\n  banner = getComputedStyle(document.getElementById('hoofd'), '::before').content;\n  await H.ga('#/workshop/a3');\n  paginaWorkshop = document.body.dataset.pagina;\n  bannerWorkshop = getComputedStyle(document.getElementById('hoofd'), '::before').content;\n} finally {\n  uit();\n}\nconst opBundel = /begeleidersmodus/.test(banner);\nconst opWorkshop = /begeleidersmodus/.test(bannerWorkshop);\nconst bundelEigen = /Begeleidersversie/.test(banner);\nconst ok = paginaBundel === 'bundel' && paginaWorkshop === 'workshop' && bundelEigen && opWorkshop;\nreturn {\n  ok: ok,\n  detail: 'data-pagina bundel/workshop = ' + paginaBundel + '/' + paginaWorkshop + '; afdrukbanner op de bundel: ' + (bundelEigen ? 'eigen begeleidersversie-tekst' : 'ONTBREEKT of verkeerde tekst (' + banner.slice(0, 60) + ')') + ', op het draaiboek: ' + (opWorkshop ? 'wel' : 'NIET (fout)'),\n};"
 },
 {
  "id": "T062",
  "gebied": "bundel",
  "naam": "op localhost komt er geen adres van de leeromgeving in de bundel",
  "soort": "browser",
  "route": "#/bundel/a1",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const fouten = [];\nconst rij = [];\nfor (const id of ['a1', 'a3', 'b1']) {\n  await H.ga('#/bundel/' + id);\n  const tekst = H.q('.bundel').textContent;\n  const hints = H.qa('.bundel .bundel-hint').map((e) => e.textContent.replace(/\\s+/g, ' ').trim());\n  const verder = H.qa('.bundel .bundel-blok').filter((s) => s.querySelector('h2') && s.querySelector('h2').textContent.trim() === 'Verder lezen')[0];\n  const adresHints = verder ? verder.querySelectorAll('.bundel-hint').length : -1;\n  const promptHint = hints.filter((h) => h.indexOf('kopieerknop') >= 0)[0] || '';\n  if (/localhost|127\\.0\\.0\\.1|:8000/.test(tekst)) fouten.push(id + ' noemt het testadres in de bundel');\n  if (adresHints !== 0) fouten.push(id + ' heeft ' + adresHints + ' adreshint bij Verder lezen');\n  if (!/kopieerknop\\.$/.test(promptHint)) fouten.push(id + ' prompt-hint eindigt op \"' + promptHint.slice(-25) + '\"');\n  rij.push(id + ' ' + hints.length + ' hints');\n}\nreturn { ok: fouten.length === 0, detail: 'geen adres van de leeromgeving op localhost — ' + rij.join(', ') + (fouten.length ? ' — FOUT: ' + fouten.join('; ') : '') };"
 },
 {
  "id": "T063",
  "gebied": "bundel",
  "naam": "promptkaart toont 15 prompts met de juiste module en workshopcodes",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const D = await import('/js/cursus.js').catch(() => null);\nconst kaarten = H.qa('.promptblok');\nconst etiketEl = H.q('.titelblok .etiket-klein');\nconst etiket = etiketEl ? etiketEl.textContent.trim() : '(geen)';\nconst fouten = [];\nif (kaarten.length !== 15) fouten.push(kaarten.length + ' promptblokken ipv 15');\nif (etiket !== '15 prompts') fouten.push('etiket zegt \"' + etiket + '\"');\nif (H.qa('.spoor').length !== 2) fouten.push(H.qa('.spoor').length + ' spoorsecties ipv 2');\nlet voorbeeld = '';\nif (D) {\n  const verwacht = [];\n  for (const s of D.SPOREN) {\n    for (const x of D.blokkenVanType(D.modulesVanSpoor(s.id), 'prompt')) {\n      const codes = D.workshopsVoorModule(x.module.id).map((w) => w.code);\n      const bij = codes.length ? ' — ' + (codes.length > 1 ? 'workshops ' : 'workshop ') + codes.join(' en ') : '';\n      verwacht.push({ mod: x.module.id, tekst: x.module.titel + bij });\n    }\n  }\n  if (verwacht.length !== kaarten.length) fouten.push('data heeft ' + verwacht.length + ' prompts, pagina ' + kaarten.length);\n  kaarten.forEach((f, i) => {\n    const v = verwacht[i];\n    if (!v) return;\n    const herkomstEl = f.querySelector('.herkomst');\n    const herkomst = herkomstEl ? herkomstEl.textContent.replace(/\\s+/g, ' ').trim() : '(geen herkomst)';\n    const link = f.querySelector('.herkomst-link');\n    if (i === 0) voorbeeld = herkomst;\n    if (herkomst.indexOf(v.tekst) < 0) fouten.push('prompt ' + (i + 1) + ': \"' + herkomst + '\" mist \"' + v.tekst + '\"');\n    if (!link || link.getAttribute('href') !== '#/module/' + v.mod) fouten.push('prompt ' + (i + 1) + ': link ' + (link ? link.getAttribute('href') : 'ontbreekt'));\n    if (link && link.textContent.trim() !== 'openen') fouten.push('prompt ' + (i + 1) + ': linktekst \"' + link.textContent.trim() + '\"');\n  });\n}\nconst meervoud = H.qa('.promptblok .herkomst').filter((e) => / en /.test(e.textContent)).length;\nreturn {\n  ok: fouten.length === 0,\n  detail: kaarten.length + ' prompts, etiket \"' + etiket + '\", ' + meervoud + ' met twee workshopcodes; eerste herkomst: ' + voorbeeld + (fouten.length ? ' — FOUT: ' + fouten.slice(0, 3).join('; ') : ''),\n};"
 },
 {
  "id": "T064",
  "gebied": "bundel",
  "naam": "kopieerknop op de promptkaart: clipboard én terugval zonder clipboard",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const knoppen = H.qa('.promptblok [data-actie=\"kopieer\"]');\nconst knop = knoppen[0];\nconst code = knop.closest('.promptblok').querySelector('code').textContent;\nconst eigen = Object.getOwnPropertyDescriptor(navigator, 'clipboard');\nlet geschreven = null;\nObject.defineProperty(navigator, 'clipboard', {\n  configurable: true,\n  value: { writeText: (t) => { geschreven = t; return Promise.resolve(); } },\n});\nawait H.klik(knop);\nawait H.wacht(120);\nconst tekst1 = knop.textContent.trim();\nObject.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });\nconst knop2 = knoppen[1];\nconst code2 = knop2.closest('.promptblok').querySelector('code').textContent;\nawait H.klik(knop2);\nawait H.wacht(120);\nconst tekst2 = knop2.textContent.trim();\nconst selectie = String(window.getSelection());\nif (eigen) Object.defineProperty(navigator, 'clipboard', eigen);\nelse delete navigator.clipboard;\nwindow.getSelection().removeAllRanges();\nconst norm = (s) => String(s).replace(/\\s+/g, ' ').trim();\nconst schrijfOk = geschreven === code && code.length > 20;\nconst selectieOk = norm(selectie) === norm(code2) && code2.length > 20;\nconst ok = knoppen.length === 15 && schrijfOk && tekst1 === 'Gekopieerd' && tekst2 === 'Staat geselecteerd — kopieer zelf' && selectieOk;\nreturn {\n  ok: ok,\n  detail: knoppen.length + ' kopieerknoppen; met clipboard: ' + (schrijfOk ? 'exact de prompt van ' + code.length + ' tekens geschreven' : 'FOUT, geschreven=' + String(geschreven).slice(0, 30)) + ', knop zegt \"' + tekst1 + '\"; zonder clipboard: knop zegt \"' + tekst2 + '\", selectie ' + (selectieOk ? 'is de prompt' : 'wijkt af (' + norm(selectie).length + ' vs ' + norm(code2).length + ' tekens)'),\n};"
 },
 {
  "id": "T065",
  "gebied": "bundel",
  "naam": "de casussenmodule zonder prompts laat geen lege sectie na in de bundel van A3",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const secties = H.qa('.bundel .bundel-blok');\nconst koppen = secties.map((s) => (s.querySelector('h2') ? s.querySelector('h2').textContent.trim() : '(geen h2)'));\nconst leeg = koppen.filter((k, i) => !secties[i].querySelector('h2') || secties[i].children.length < 2);\nconst legeLijsten = H.qa('.bundel ol, .bundel ul').filter((l) => l.children.length === 0).length;\nconst modules = H.qa('.bundel .bundel-modules li a').map((a) => a.getAttribute('href'));\nconst heeftCasussen = modules.indexOf('#/module/casussen') >= 0;\nconst prompts = H.qa('.bundel .promptblok.bundel-prompt').length;\nconst opdrachten = H.qa('.bundel .opdracht').length;\nconst ok = secties.length === 7 && leeg.length === 0 && legeLijsten === 0 && modules.length === 3 && heeftCasussen && prompts === 3 && opdrachten === 2;\nreturn {\n  ok: ok,\n  detail: secties.length + ' secties (' + koppen.join(' / ') + '), ' + leeg.length + ' leeg, ' + legeLijsten + ' lege lijsten; Verder lezen telt ' + modules.length + ' modules' + (heeftCasussen ? ' incl. casussen' : ' ZONDER casussen') + '; de casussenmodule voegt niets toe aan de ' + prompts + ' prompts en ' + opdrachten + ' opdrachten',\n};"
 },
 {
  "id": "T066",
  "gebied": "bundel",
  "naam": "bundel A3 op een gsm: geen horizontale schuifbalk en geen overlopend promptblok",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const doc = document.documentElement;\nconst overloop = doc.scrollWidth - doc.clientWidth;\nconst breed = H.qa('.bundel *').filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1).map((el) => (typeof el.className === 'string' ? el.className : el.tagName)).slice(0, 3);\nconst pre = H.q('.bundel-prompt pre');\nconst preOverloop = pre ? pre.scrollWidth - pre.clientWidth : -1;\nconst kop = getComputedStyle(H.q('.bundel-kop')).flexDirection;\nconst invul = getComputedStyle(H.q('.bundel-invul')).minWidth;\nconst ok = overloop <= 1 && breed.length === 0 && preOverloop <= 1 && kop === 'column' && parseFloat(invul) === 0;\nreturn {\n  ok: ok,\n  detail: 'venster ' + window.innerWidth + 'px: pagina-overloop ' + overloop + 'px, promptblok-overloop ' + preOverloop + 'px, bundel-kop ' + kop + ', invulblok min-width ' + invul + (breed.length ? ', buiten beeld: ' + breed.join(', ') : ''),\n};"
 },
 {
  "id": "T067",
  "gebied": "bundel",
  "naam": "data-controle: 15 prompts, 14 casussen enkel in A3, elke workshop met prompt én opdracht",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS, MODULES, vindModule, modulesVanWorkshop, blokkenVanType } from './js/cursus.js';\nlet fout = [];\nconst totPrompt = MODULES.reduce((s,m)=>s+blokkenVanType([m],'prompt').length,0);\nif (totPrompt !== 15) fout.push('totaal prompts ' + totPrompt);\nconst cas = MODULES.filter(m => blokkenVanType([m],'casus').length);\nif (cas.length !== 1 || cas[0].id !== 'casussen') fout.push('casussen zitten in ' + cas.map(m=>m.id));\nconst nCas = blokkenVanType([vindModule('casussen')],'casus').length;\nif (nCas !== 14) fout.push('casussenmodule heeft ' + nCas + ' casussen');\nconst metCasus = WORKSHOPS.filter(w => blokkenVanType(modulesVanWorkshop(w),'casus').length);\nif (metCasus.length !== 1 || metCasus[0].code !== 'A3') fout.push('casussen in bundels ' + metCasus.map(w=>w.code));\nconst rij = [];\nfor (const w of WORKSHOPS) {\n  const m = modulesVanWorkshop(w);\n  const p = blokkenVanType(m,'prompt').length, o = blokkenVanType(m,'opdracht').length, c = blokkenVanType(m,'casus').length;\n  rij.push(w.code + ' ' + p + 'p/' + o + 'o/' + c + 'c/' + w.doelen.length + 'd');\n  if (!p || !o) fout.push(w.code + ' zonder prompt of opdracht');\n  if (!w.doelen.length) fout.push(w.code + ' zonder doelen');\n  if ((w.spoor === 'vibe') !== /^B/.test(w.code)) fout.push(w.code + ' spoor ' + w.spoor);\n}\nconst casMod = vindModule('casussen');\nif (blokkenVanType([casMod],'prompt').length || blokkenVanType([casMod],'opdracht').length) fout.push('casussenmodule heeft toch prompts of opdrachten');\nconsole.log(rij.join(' | '));\nconsole.log(fout.length ? 'FOUT: ' + fout.join('; ') : 'OK');\n\""
 },
 {
  "id": "T068",
  "gebied": "bundel",
  "naam": "HTML-balans in de velden die ongeëscapeerd in de bundel belanden",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst TOEGELATEN = new Set(['strong','em','code','br']);\nconst fout = [];\nlet rauw = 0, geescaped = 0;\nfunction checkRauw(waar, tekst) {\n  rauw++;\n  const stapel = [];\n  for (const m of String(tekst).matchAll(/<(\\/?)([a-zA-Z]+)[^>]*?(\\/?)>/g)) {\n    const naam = m[2].toLowerCase();\n    if (!TOEGELATEN.has(naam)) { fout.push(waar + ': tag <' + naam + '> is niet toegelaten'); continue; }\n    if (naam === 'br') continue;\n    if (m[1]) { if (stapel.pop() !== naam) fout.push(waar + ': </' + naam + '> sluit niets'); }\n    else stapel.push(naam);\n  }\n  if (stapel.length) fout.push(waar + ': ongesloten <' + stapel.join('>, <') + '>');\n  const los = String(tekst).replace(/<[^>]*>/g, '');\n  if (/[<>]/.test(los)) fout.push(waar + ': los < of > buiten een tag');\n}\nfunction checkLetterlijk(waar, tekst) {\n  geescaped++;\n  if (/<(strong|em|code|br|p|ul|li)\\b/i.test(String(tekst))) fout.push(waar + ': HTML in een veld dat letterlijk wordt afgedrukt');\n}\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  const waar = m.id + '/' + l.id + '/' + b.type;\n  if (b.type === 'prompt') { if (b.uitleg) checkRauw(waar + ' uitleg', b.uitleg); checkLetterlijk(waar + ' tekst', b.tekst); }\n  if (b.type === 'opdracht') { checkRauw(waar + ' inhoud', b.inhoud); b.stappen.forEach((s,i) => checkLetterlijk(waar + ' stap ' + (i+1), s)); }\n  if (b.type === 'casus') { checkLetterlijk(waar + ' situatie', b.situatie); checkLetterlijk(waar + ' toelichting', b.toelichting); }\n}\nconsole.log(rauw + ' rauwe HTML-velden en ' + geescaped + ' letterlijke velden nagekeken');\nconsole.log(fout.length ? 'FOUT: ' + fout.join('; ') : 'OK');\n\""
 },
 {
  "id": "T069",
  "gebied": "afdrukken",
  "naam": "draaiboek op papier: kop, voet, besturing en kruimels weg, tips blijven",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const weg = ['#kop', '#voet', '.besturing', '.kruimels'];\n  const nog = weg.filter((s) => { const el = H.q(s); return !el || getComputedStyle(el).display !== 'none'; });\n  const tips = H.qa('.tips');\n  const blijft = tips.filter((el) => getComputedStyle(el).display !== 'none' && el.offsetHeight > 0).length;\n  const blokken = H.qa('.blokken .blok').length;\n  return {\n    ok: nog.length === 0 && tips.length > 0 && blijft === tips.length && blokken > 0,\n    detail: (weg.length - nog.length) + '/' + weg.length + ' schermelementen verdwijnen op papier' +\n      (nog.length ? ' (blijft staan of ontbreekt: ' + nog.join(', ') + ')' : '') +\n      '; ' + blijft + '/' + tips.length + ' tipsblokken blijven staan bij ' + blokken + ' draaiboekblokken',\n  };\n} finally { uit(); }"
 },
 {
  "id": "T070",
  "gebied": "afdrukken",
  "naam": "modulepagina met begeleidersmodus aan: 14 oordelen op papier, geen keuzevakje",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const casussen = H.qa('.casus');\n  const zichtbaar = casussen.filter((c) => { const a = c.querySelector('.casus-antwoord'); return a && getComputedStyle(a).display === 'block'; }).length;\n  const vakjes = casussen.filter((c) => getComputedStyle(c, '::after').content !== 'none').length;\n  const knoppen = H.qa('.casus-knop');\n  const knoppenWeg = knoppen.length > 0 && knoppen.every((k) => getComputedStyle(k).display === 'none');\n  return {\n    ok: casussen.length === 14 && zichtbaar === 14 && vakjes === 0 && knoppenWeg,\n    detail: casussen.length + ' casussen: ' + zichtbaar + ' oordelen zichtbaar op papier, ' + vakjes + ' keuzevakjes, ' + knoppen.length + ' knoppen verborgen: ' + knoppenWeg,\n  };\n} finally { uit(); }"
 },
 {
  "id": "T071",
  "gebied": "afdrukken",
  "naam": "modulepagina zonder begeleidersmodus: oordelen verborgen, 14 keuzevakjes met drie hokjes",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const hok = String.fromCharCode(0x25a1);\n  const casussen = H.qa('.casus');\n  const verborgen = casussen.filter((c) => getComputedStyle(c.querySelector('.casus-antwoord')).display === 'none').length;\n  const inhoud = casussen.map((c) => getComputedStyle(c, '::after').content);\n  const vakjes = inhoud.filter((s) => s.indexOf('Ons oordeel') >= 0).length;\n  const drie = inhoud.filter((s) => s.split(hok).length - 1 === 3).length;\n  return {\n    ok: casussen.length === 14 && verborgen === 14 && vakjes === 14 && drie === 14,\n    detail: verborgen + '/' + casussen.length + ' oordelen blijven verborgen, ' + vakjes + ' keuzevakjes waarvan ' + drie + ' met drie hokjes; eerste: ' + inhoud[0],\n  };\n} finally { uit(); }"
 },
 {
  "id": "T072",
  "gebied": "afdrukken",
  "naam": "een opengeklikte casus verliest zijn keuzevakje en toont het oordeel",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const eerste = H.q('.casus');\nconst knop = eerste.querySelector('.casus-knop');\nawait H.klik(knop);\nconst uit = H.printAan();\nlet meting;\ntry {\n  const buur = H.qa('.casus')[1];\n  meting = {\n    open: eerste.classList.contains('open'),\n    vakje: getComputedStyle(eerste, '::after').content,\n    oordeel: getComputedStyle(eerste.querySelector('.casus-antwoord')).display,\n    buur: getComputedStyle(buur, '::after').content.indexOf('Ons oordeel') >= 0,\n  };\n} finally { uit(); }\nawait H.klik(knop);\nreturn {\n  ok: meting.open && meting.vakje === 'none' && meting.oordeel === 'block' && meting.buur && !eerste.classList.contains('open'),\n  detail: 'getoonde casus: keuzevakje ' + meting.vakje + ', oordeel display ' + meting.oordeel + '; de gesloten buur houdt zijn vakje: ' + meting.buur,\n};"
 },
 {
  "id": "T073",
  "gebied": "afdrukken",
  "naam": "begeleidersbanner op het draaiboek, en op de bundel de begeleidersversie-waarschuwing",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\nlet a, b, pa, pb;\ntry {\n  pa = document.body.dataset.pagina;\n  a = getComputedStyle(document.getElementById('hoofd'), '::before').content;\n  await H.ga('#/bundel/a3');\n  pb = document.body.dataset.pagina;\n  b = getComputedStyle(document.getElementById('hoofd'), '::before').content;\n} finally { uit(); await H.ga('#/workshop/a3'); }\nreturn {\n  ok: pa === 'workshop' && pb === 'bundel' && a.indexOf('Afgedrukt in begeleidersmodus') >= 0 && b.indexOf('Begeleidersversie') >= 0,\n  detail: 'draaiboek (data-pagina=' + pa + '): banner ' + (a.indexOf('Afgedrukt') >= 0 ? 'staat er' : 'ontbreekt') + '; bundel (data-pagina=' + pb + '): ::before = ' + b,\n};"
 },
 {
  "id": "T074",
  "gebied": "afdrukken",
  "naam": "bundel A3 met begeleidersmodus aan: oordelen open, geen keuzevakje eronder",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const casussen = H.qa('.bundel-casussen .casus');\n  const open = casussen.filter((c) => c.classList.contains('open')).length;\n  const zichtbaar = casussen.filter((c) => { const a = c.querySelector('.casus-antwoord'); return a && getComputedStyle(a).display === 'block'; }).length;\n  const vakjes = casussen.filter((c) => getComputedStyle(c, '::after').content !== 'none').length;\n  const knoppen = H.qa('.bundel-casussen .casus-knop').length;\n  const kop = ((H.q('.bundel-casussen h2') || {}).textContent || '').trim();\n  return {\n    ok: casussen.length === 14 && open === 14 && zichtbaar === 14 && vakjes === 0 && knoppen === 0,\n    detail: casussen.length + ' casussen in de bundel, ' + open + ' open, ' + zichtbaar + ' oordelen op papier, ' + vakjes + ' keuzevakjes, ' + knoppen + ' knoppen; kop: ' + kop,\n  };\n} finally { uit(); }"
 },
 {
  "id": "T075",
  "gebied": "afdrukken",
  "naam": "bundel A3 zonder begeleidersmodus: geen oordeel in de DOM, wel 14 keuzevakjes",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const casussen = H.qa('.bundel-casussen .casus');\n  const antwoorden = H.qa('.bundel-casussen .casus-antwoord').length;\n  const open = H.qa('.bundel-casussen .casus.open').length;\n  const knoppen = H.qa('.bundel-casussen .casus-knop').length;\n  const vakjes = casussen.filter((c) => getComputedStyle(c, '::after').content.indexOf('Ons oordeel') >= 0).length;\n  const kop = ((H.q('.bundel-casussen h2') || {}).textContent || '').trim();\n  return {\n    ok: casussen.length === 14 && antwoorden === 0 && open === 0 && knoppen === 0 && vakjes === 14 && !/oordeel/i.test(kop),\n    detail: casussen.length + ' casussen zonder oordeel op papier (' + antwoorden + ' antwoordblokken, ' + open + ' open, ' + knoppen + ' knoppen), ' + vakjes + ' keuzevakjes; kop: ' + kop,\n  };\n} finally { uit(); }"
 },
 {
  "id": "T076",
  "gebied": "afdrukken",
  "naam": "beforeprint opent alle 22 FAQ-details en de antwoorden staan op papier",
  "soort": "browser",
  "route": "#/gids",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const details = H.qa('details');\ndetails.forEach((d) => { d.open = false; });\nconst dicht = H.qa('details[open]').length;\nwindow.dispatchEvent(new Event('beforeprint'));\nconst na = H.qa('details[open]').length;\nconst uit = H.printAan();\nlet zichtbaar = 0, lijven = [];\ntry {\n  lijven = H.qa('.faq-lijf');\n  zichtbaar = lijven.filter((el) => getComputedStyle(el).display === 'block' && el.offsetHeight > 0).length;\n} finally { uit(); details.forEach((d) => { d.open = false; }); }\nreturn {\n  ok: details.length === 22 && dicht === 0 && na === 22 && zichtbaar === 22,\n  detail: 'na beforeprint staan ' + na + ' van de ' + details.length + ' faq-details open; ' + zichtbaar + '/' + lijven.length + ' antwoorden zichtbaar op papier',\n};"
 },
 {
  "id": "T077",
  "gebied": "afdrukken",
  "naam": "afdrukregels zetten :root font-size terug op 100%, ook op een breed scherm",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "beamer",
  "herladen": false,
  "script": "const voor = getComputedStyle(document.documentElement).fontSize;\nconst uit = H.printAan();\nlet na;\ntry { na = getComputedStyle(document.documentElement).fontSize; } finally { uit(); }\nreturn {\n  ok: na === '16px' && parseFloat(voor) > 16 && window.innerWidth >= 1500,\n  detail: 'venster ' + window.innerWidth + 'px: op het scherm ' + voor + ', onder de afdrukregels ' + na,\n};"
 },
 {
  "id": "T078",
  "gebied": "afdrukken",
  "naam": "schrijflijnen in de bundel krijgen een zichtbare rand op papier",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const eersteLijn = H.q('.notities .lijnen i');\nconst voor = eersteLijn ? getComputedStyle(eersteLijn).borderBottomColor : 'geen lijn gevonden';\nconst uit = H.printAan();\ntry {\n  const goed = (el) => getComputedStyle(el).borderBottomColor === 'rgb(102, 102, 102)' && parseFloat(getComputedStyle(el).borderBottomWidth) >= 1;\n  const lijnen = H.qa('.notities .lijnen i');\n  const invul = H.qa('.bundel-invul i');\n  const lg = lijnen.filter(goed).length;\n  const ig = invul.filter(goed).length;\n  const tussen = getComputedStyle(H.q('.notities .lijnen')).rowGap;\n  return {\n    ok: lijnen.length === 13 && lg === 13 && invul.length === 2 && ig === 2 && tussen === '32px',\n    detail: lg + '/' + lijnen.length + ' schrijflijnen en ' + ig + '/' + invul.length + ' invulvelden krijgen rand rgb(102, 102, 102) (op het scherm ' + voor + '), regelafstand ' + tussen,\n  };\n} finally { uit(); }"
 },
 {
  "id": "T079",
  "gebied": "afdrukken",
  "naam": "gids is dicht zonder begeleidersmodus en telt 5 secties en 22 vragen mét",
  "soort": "browser",
  "route": "#/gids",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const kaart = H.q('.kaart.leeg');\nconst zonder = { secties: H.qa('.gids-sectie').length, faq: H.qa('.faq').length, tekst: (kaart || {}).textContent || '' };\nawait H.begeleider(true);\nconst met = {\n  secties: H.qa('.gids-sectie').length,\n  faq: H.qa('.faq').length,\n  groepen: H.qa('.faq-groep').length,\n  etiketten: H.qa('.gids-kop .etiket-klein').map((e) => e.textContent.trim()).join(' / '),\n};\nawait H.begeleider(false);\nreturn {\n  ok: zonder.secties === 0 && zonder.faq === 0 && !!kaart && /begeleidersmodus/i.test(zonder.tekst) &&\n      met.secties === 5 && met.faq === 22 && met.groepen === 2 && met.etiketten === '5 onderdelen / 22 lastige vragen',\n  detail: 'zonder begeleidersmodus: ' + zonder.secties + ' secties en ' + zonder.faq + ' vragen, afsluitkaart aanwezig: ' + !!kaart +\n    '; met begeleidersmodus: ' + met.secties + ' secties, ' + met.faq + ' vragen in ' + met.groepen + ' groepen, etiketten ' + met.etiketten,\n};"
 },
 {
  "id": "T080",
  "gebied": "afdrukken",
  "naam": "gids op papier: schermnavigatie weg, secties blijven en breken niet",
  "soort": "browser",
  "route": "#/gids",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const uit = H.printAan();\ntry {\n  const weg = ['#kop', '#voet', '.kruimels', '.besturing', '.verder'];\n  const nog = weg.filter((s) => { const el = H.q(s); return !el || getComputedStyle(el).display !== 'none'; });\n  const secties = H.qa('.gids-sectie');\n  const zichtbaar = secties.filter((el) => el.offsetHeight > 0).length;\n  const breek = secties.filter((el) => getComputedStyle(el).breakInside === 'avoid').length;\n  const faq = H.qa('.faq');\n  const faqBreek = faq.filter((el) => getComputedStyle(el).breakInside === 'avoid').length;\n  const vet = getComputedStyle(H.q('.faq summary')).fontWeight;\n  return {\n    ok: nog.length === 0 && zichtbaar === 5 && breek === 5 && faqBreek === faq.length && faq.length === 22 && vet === '700',\n    detail: (weg.length - nog.length) + '/' + weg.length + ' schermelementen weg' + (nog.length ? ' (' + nog.join(', ') + ')' : '') +\n      '; ' + zichtbaar + ' secties zichtbaar, break-inside avoid op ' + breek + ' secties en ' + faqBreek + '/' + faq.length + ' faq-items, summary font-weight ' + vet,\n  };\n} finally { uit(); }"
 },
 {
  "id": "T081",
  "gebied": "afdrukken",
  "naam": "elke klasse uit het afdrukblok bestaat ook echt in de app",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync, readdirSync } from 'node:fs';\nconst css = readFileSync('css/style.css', 'utf8');\nconst i = css.indexOf('@media print');\nlet d = 0, start = css.indexOf('{', i), eind = start;\nfor (let p = start; p < css.length; p++) { if (css[p] === '{') d++; else if (css[p] === '}') { d--; if (!d) { eind = p; break; } } }\nconst blok = css.slice(start + 1, eind);\nconst zonderInhoud = blok.replace(/content:[^;]*;/g, '');\nconst klassen = [...new Set(zonderInhoud.match(/\\.[a-zA-Z][A-Za-z0-9_-]*/g) || [])].map(s => s.slice(1));\nconst bron = readdirSync('js').filter(f => f.endsWith('.js')).map(f => readFileSync('js/' + f, 'utf8')).join('') + readFileSync('index.html', 'utf8');\nconst weg = klassen.filter(k => !bron.includes(k));\nconst pagina = (blok.match(/\\[data-pagina=.([a-z]+).\\]/) || [])[1];\nconst app = readFileSync('js/app.js', 'utf8');\nif (pagina && !app.includes('naam: ' + String.fromCharCode(39) + pagina)) weg.push('data-pagina=' + pagina + ' is geen routenaam');\nconsole.log('klassen in het afdrukblok:', klassen.length, '| data-pagina:', pagina);\nconsole.log(weg.length ? 'FOUT: ' + weg.join(', ') : 'OK');\n\""
 },
 {
  "id": "T082",
  "gebied": "afdrukken",
  "naam": "gids volledig: 5 secties, 22 vragen met vraag, antwoord en tip, telling klopt met CLAUDE.md",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { GIDS_SECTIES, FAQ_GROEPEN } from './js/gids.js';\nimport { readFileSync } from 'node:fs';\nconst fout = [];\nconst leeg = (v) => typeof v !== 'string' || !v.trim();\nfor (const s of GIDS_SECTIES) {\n  if (leeg(s.titel) || leeg(s.inleiding) || leeg(s.icoon) || !Array.isArray(s.punten) || !s.punten.length) fout.push('sectie ' + s.id);\n  for (const p of s.punten || []) if (leeg(p.kop) || leeg(p.tekst)) fout.push('punt zonder kop of tekst in ' + s.id);\n}\nlet vragen = 0;\nfor (const g of FAQ_GROEPEN) {\n  if (leeg(g.titel)) fout.push('faq-groep zonder titel');\n  for (const v of g.vragen) { vragen++; if (leeg(v.vraag) || leeg(v.antwoord) || leeg(v.tip)) fout.push('faq zonder vraag, antwoord of tip: ' + String(v.vraag).slice(0, 40)); }\n}\nconst claim = (readFileSync('CLAUDE.md', 'utf8').match(/(\\d+) lastige vragen/) || [])[1];\nconsole.log('secties', GIDS_SECTIES.length, '| groepen', FAQ_GROEPEN.length, '| vragen', vragen, '| CLAUDE.md zegt', claim);\nif (GIDS_SECTIES.length !== 5) fout.push('aantal secties is ' + GIDS_SECTIES.length + ', niet 5');\nif (String(vragen) !== claim) fout.push('CLAUDE.md zegt ' + claim + ', gids.js heeft ' + vragen);\nconsole.log(fout.length ? 'FOUT: ' + fout.join('; ') : 'OK');\n\""
 },
 {
  "id": "T083",
  "gebied": "responsief",
  "naam": "gsm — geen horizontale scroll op de zes pagina's, begeleidersmodus aan",
  "soort": "browser",
  "route": "#/",
  "begeleider": "aan",
  "viewport": "gsm",
  "herladen": false,
  "script": "const routes = ['#/', '#/workshop/a3', '#/module/casussen', '#/bundel/a3', '#/prompts', '#/gids'];\nconst stuk = [];\nfor (const r of routes) {\n  await H.ga(r);\n  const d = document.documentElement;\n  if (d.scrollWidth > d.clientWidth + 1) stuk.push(r + ' (' + d.scrollWidth + ' > ' + d.clientWidth + ')');\n}\nawait H.ga('#/');\nreturn { ok: stuk.length === 0, detail: stuk.length ? 'horizontale scroll op ' + stuk.join(', ') : 'alle zes routes blijven op ' + document.documentElement.clientWidth + 'px, geen horizontale scroll' };"
 },
 {
  "id": "T084",
  "gebied": "responsief",
  "naam": "gsm — geen horizontale scroll op de zes pagina's, begeleidersmodus uit",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const routes = ['#/', '#/workshop/a3', '#/module/casussen', '#/bundel/a3', '#/prompts', '#/gids'];\nconst stuk = [];\nfor (const r of routes) {\n  await H.ga(r);\n  const d = document.documentElement;\n  if (d.scrollWidth > d.clientWidth + 1) stuk.push(r + ' (' + d.scrollWidth + ' > ' + d.clientWidth + ')');\n}\nawait H.ga('#/');\nreturn { ok: stuk.length === 0, detail: stuk.length ? 'horizontale scroll op ' + stuk.join(', ') : 'alle zes routes blijven op ' + document.documentElement.clientWidth + 'px, geen horizontale scroll' };"
 },
 {
  "id": "T085",
  "gebied": "responsief",
  "naam": "gsm — geen enkel element loopt buiten het scherm (volledige DOM-wandeling)",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const routes = ['#/prompts', '#/bundel/a3', '#/module/casussen', '#/workshop/a3'];\nconst buiten = [];\nfor (const r of routes) {\n  await H.ga(r);\n  for (const el of document.querySelectorAll('#kop *, #hoofd *, #voet *')) {\n    const b = el.getBoundingClientRect();\n    if (b.width === 0 && b.height === 0) continue;\n    if (b.right > window.innerWidth + 1 || b.left < -1)\n      buiten.push(r + ' ' + el.tagName.toLowerCase() + '.' + (el.className || '?') + ' [' + Math.round(b.left) + '-' + Math.round(b.right) + ']');\n  }\n}\nawait H.ga('#/');\nreturn { ok: buiten.length === 0, detail: buiten.length ? buiten.length + ' elementen buiten beeld: ' + buiten.slice(0, 4).join(' | ') : 'geen enkel element buiten 0-' + window.innerWidth + 'px op vier routes' };"
 },
 {
  "id": "T086",
  "gebied": "responsief",
  "naam": "gsm — alle raakvlakken halen 44px (knoppen, vink, schakelaar, tijdveld, linkpil, quizoptie, casusknop)",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "gsm",
  "herladen": false,
  "script": "const klein = [];\nconst meet = (sel) => H.qa(sel).forEach((e) => { const h = e.getBoundingClientRect().height; if (h < 43.5) klein.push(sel + ' = ' + h.toFixed(1) + 'px'); });\nawait H.ga('#/workshop/a3');\nmeet('.knop'); meet('#startuur'); meet('.schakelaar');\nconst tijd = H.q('#startuur').getBoundingClientRect().height.toFixed(0);\nawait H.ga('#/module/prompten');\nmeet('.vink'); meet('a.etiket-klein.link'); meet('.optie');\nawait H.ga('#/module/casussen');\nmeet('.casus-knop');\nawait H.ga('#/');\nreturn { ok: klein.length === 0, detail: klein.length ? 'te klein: ' + klein.join(', ') : 'knoppen, vinkknoppen, schakelaar, tijdveld (' + tijd + 'px), linkpillen, quizopties en casusknoppen halen alle 44px' };"
 },
 {
  "id": "T087",
  "gebied": "responsief",
  "naam": "gsm — gewone etiketten zijn niet meegerekt tot 44px en staan gecentreerd naast de linkpil",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const plat = H.qa('.etiketten .etiket-klein:not(.link)');\nconst link = H.q('.etiketten a.etiket-klein.link');\nif (!plat.length || !link) return { ok: false, detail: 'geen etiketten in de modulekop gevonden (' + plat.length + ' gewone, ' + (link ? 1 : 0) + ' link)' };\nconst lr = link.getBoundingClientRect();\nconst hoogten = plat.map((e) => +e.getBoundingClientRect().height.toFixed(1));\nconst zelfdeRij = plat.filter((e) => { const r = e.getBoundingClientRect(); return r.top < lr.bottom && r.bottom > lr.top; });\nconst scheef = zelfdeRij.map((e) => { const r = e.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - (lr.top + lr.height / 2)); });\nconst ergst = scheef.length ? Math.max.apply(null, scheef) : 0;\nconst ok = hoogten.every((h) => h < 40) && lr.height >= 43.5 && ergst <= 2;\nreturn { ok, detail: 'gewone etiketten ' + hoogten.join('/') + 'px (niet gerekt), linkpil ' + lr.height.toFixed(0) + 'px, grootste verschil in middenlijn ' + ergst.toFixed(1) + 'px' };"
 },
 {
  "id": "T088",
  "gebied": "responsief",
  "naam": "gsm — leesbare lettergroottes: lopende tekst 13,5px of meer, kleinste labels 10,5px of meer",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "gsm",
  "herladen": false,
  "script": "const px = (sel) => { const e = H.q(sel); return e ? parseFloat(H.stijl(e, 'font-size')) : null; };\nconst lopend = { 'blok p': px('.blok p'), 'tips li': px('.tips li') };\nconst labels = { soort: px('.soort'), 'tips-kop': px('.tips-kop') };\nawait H.ga('#/module/casussen');\nlopend['casus-situatie'] = px('.casus-situatie');\nlopend['p.tekst'] = px('p.tekst');\nawait H.ga('#/prompts');\nlabels.herkomst = px('.herkomst');\nawait H.ga('#/workshop/a3');\nconst alles = Object.assign({}, lopend, labels);\nconst ontbreekt = Object.keys(alles).filter((k) => alles[k] === null);\nconst teKlein = Object.keys(lopend).filter((k) => !(lopend[k] >= 13.5));\nconst teKleinLabel = Object.keys(labels).filter((k) => !(labels[k] >= 10.5));\nconst toon = Object.keys(alles).map((k) => k + ' ' + (alles[k] === null ? '?' : alles[k].toFixed(2)) + 'px').join(', ');\nreturn { ok: !ontbreekt.length && !teKlein.length && !teKleinLabel.length, detail: (ontbreekt.length ? 'niet gevonden: ' + ontbreekt.join(', ') + ' - ' : '') + toon };"
 },
 {
  "id": "T089",
  "gebied": "responsief",
  "naam": "gsm — .verder met twee knoppen: allebei binnen het scherm, 44px hoog en netjes gewikkeld",
  "soort": "browser",
  "route": "#/module/prompten",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const knoppen = H.qa('.verder .knop');\nif (knoppen.length !== 2) return { ok: false, detail: 'verwacht vorige en volgende, gevonden ' + knoppen.length + ' knoppen in .verder' };\nconst r = knoppen.map((k) => k.getBoundingClientRect());\nconst buiten = r.filter((x) => x.right > window.innerWidth + 1 || x.left < -1);\nconst laag = r.filter((x) => x.height < 43.5);\nconst overlapt = r[0].bottom > r[1].top + 1 && r[0].right > r[1].left + 1;\nreturn { ok: !buiten.length && !laag.length && !overlapt, detail: 'twee knoppen ' + r.map((x) => Math.round(x.width) + 'x' + Math.round(x.height)).join(' en ') + 'px, rechterrand ' + r.map((x) => Math.round(x.right)).join(' en ') + ' binnen ' + window.innerWidth + 'px, ' + (Math.abs(r[0].top - r[1].top) < 2 ? 'naast elkaar' : 'onder elkaar gewikkeld') };"
 },
 {
  "id": "T090",
  "gebied": "responsief",
  "naam": "gsm — de lange herkomstrij op de promptkaart blijft binnen het figcaption",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "uit",
  "viewport": "gsm",
  "herladen": false,
  "script": "const stuk = [];\nconst caps = H.qa('.promptblok figcaption');\ncaps.forEach((f, i) => {\n  const fr = f.getBoundingClientRect();\n  const st = getComputedStyle(f);\n  const links = fr.left + parseFloat(st.paddingLeft);\n  const rechts = fr.right - parseFloat(st.paddingRight);\n  Array.prototype.forEach.call(f.children, (c) => {\n    const cr = c.getBoundingClientRect();\n    if (cr.right > rechts + 1 || cr.left < links - 1)\n      stuk.push('prompt ' + (i + 1) + ' ' + (c.className || c.tagName) + ' [' + Math.round(cr.left) + '-' + Math.round(cr.right) + '] buiten [' + Math.round(links) + '-' + Math.round(rechts) + ']');\n  });\n});\nconst breedtes = H.qa('.kaart-acties').map((a) => a.getBoundingClientRect().width);\nconst breedste = breedtes.length ? Math.round(Math.max.apply(null, breedtes)) : 0;\nreturn { ok: caps.length > 0 && stuk.length === 0, detail: stuk.length ? stuk.slice(0, 3).join(' | ') : caps.length + ' promptkoppen, breedste herkomstrij ' + breedste + 'px past binnen het kader' };"
 },
 {
  "id": "T091",
  "gebied": "responsief",
  "naam": "beamer — root staat op 115% (18,4px) en de kleine labels groeien mee",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "beamer",
  "herladen": false,
  "script": "const root = parseFloat(H.stijl('html', 'font-size'));\nconst breedte = getComputedStyle(document.documentElement).getPropertyValue('--breedte').trim();\nconst hoofdMax = parseFloat(H.stijl('#hoofd', 'max-width'));\nconst soort = parseFloat(H.stijl('.soort', 'font-size'));\nconst tipsKop = parseFloat(H.stijl('.tips-kop', 'font-size'));\nawait H.ga('#/');\nconst nEl = H.q('.niveau');\nconst niveau = nEl ? parseFloat(H.stijl(nEl, 'font-size')) : null;\nawait H.ga('#/workshop/a3');\nconst ok = Math.abs(root - 18.4) < 0.2 && breedte === '1080px' && Math.abs(hoofdMax - 1080) < 1 &&\n  Math.abs(soort - 0.66 * root) < 0.3 && Math.abs(tipsKop - 0.68 * root) < 0.3 &&\n  niveau !== null && Math.abs(niveau - 0.7 * root) < 0.3;\nreturn { ok, detail: 'op ' + window.innerWidth + 'px: root ' + root + 'px, --breedte ' + breedte + ', #hoofd ' + hoofdMax + 'px, .soort ' + soort.toFixed(2) + 'px, .tips-kop ' + tipsKop.toFixed(2) + 'px, .niveau ' + (niveau === null ? 'niet gevonden' : niveau.toFixed(2) + 'px') };"
 },
 {
  "id": "T092",
  "gebied": "responsief",
  "naam": "laptop — onder 1200px blijft de root op 16px staan",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "smal",
  "herladen": false,
  "script": "const w = window.innerWidth;\nconst root = parseFloat(H.stijl('html', 'font-size'));\nconst breedte = getComputedStyle(document.documentElement).getPropertyValue('--breedte').trim();\nconst nEl = H.q('.niveau');\nconst niveau = nEl ? parseFloat(H.stijl(nEl, 'font-size')) : null;\nconst ok = w >= 1000 && w < 1200 && Math.abs(root - 16) < 0.1 && breedte === '940px' && niveau !== null && Math.abs(niveau - 11.2) < 0.2;\nreturn { ok, detail: 'venster ' + w + 'px: root ' + root + 'px, --breedte ' + breedte + ', .niveau ' + (niveau === null ? 'niet gevonden' : niveau.toFixed(2) + 'px') + ' - de vergroting begint pas op 1200px' };"
 },
 {
  "id": "T093",
  "gebied": "responsief",
  "naam": "beamer + afdrukken — het afdrukblok zet de root terug op 100%",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "beamer",
  "herladen": false,
  "script": "const voor = parseFloat(H.stijl('html', 'font-size'));\nconst uit = H.printAan();\nlet tijdens = null, kopZichtbaar = null, fout = null;\ntry {\n  tijdens = parseFloat(H.stijl('html', 'font-size'));\n  kopZichtbaar = H.zichtbaar('#kop');\n} catch (e) { fout = String(e); } finally { uit(); }\nconst na = parseFloat(H.stijl('html', 'font-size'));\nconst ok = !fout && Math.abs(voor - 18.4) < 0.2 && Math.abs(tijdens - 16) < 0.1 && kopZichtbaar === false && Math.abs(na - 18.4) < 0.2;\nreturn { ok, detail: (fout ? fout + ' - ' : '') + 'op ' + window.innerWidth + 'px: scherm ' + voor + 'px, met het afdrukblok ' + tijdens + 'px, na herstel ' + na + 'px; #kop op papier ' + (kopZichtbaar ? 'nog zichtbaar' : 'verborgen') };"
 },
 {
  "id": "T094",
  "gebied": "responsief",
  "naam": "prefers-reduced-motion — de regels zetten de beweging stil maar laten het schakelaarbolletje staan",
  "soort": "browser",
  "route": "#/",
  "begeleider": "aan",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const aan = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\nconst kaart = H.q('a.kaart');\nif (!kaart) return { ok: false, detail: 'geen a.kaart op het overzicht gevonden' };\nconst voor = H.stijl(kaart, 'transition-duration');\nlet regels = '';\nfor (const sheet of document.styleSheets) {\n  let lijst;\n  try { lijst = sheet.cssRules; } catch (e) { continue; }\n  for (const r of lijst) if (r.type === 4 && /prefers-reduced-motion/.test(r.conditionText || '')) regels += Array.prototype.map.call(r.cssRules, (x) => x.cssText).join(' ');\n}\nif (!regels) return { ok: false, detail: 'geen blok @media (prefers-reduced-motion: reduce) in de stylesheet gevonden' };\nconst st = document.createElement('style');\nst.textContent = regels;\ndocument.head.appendChild(st);\nawait H.wacht(80);\nconst tijdens = H.stijl(kaart, 'transition-duration');\nconst scroll = H.stijl('html', 'scroll-behavior');\nconst bol = H.q('.schakelaar .bolletje');\nconst bolletje = bol ? getComputedStyle(bol, '::after').transform : 'geen bolletje';\nst.remove();\nawait H.wacht(80);\nconst herstel = H.stijl(kaart, 'transition-duration');\nconst ok = parseFloat(tijdens) <= 0.001 && scroll === 'auto' && bolletje !== 'none' && bolletje !== 'geen bolletje' && herstel === voor;\nreturn { ok, detail: 'prefers-reduced-motion stond ' + (aan ? 'AAN' : 'UIT') + ' in deze browser; met de regels actief: .kaart transition ' + tijdens + ' (normaal ' + voor + '), scroll-behavior ' + scroll + ', bolletje-transform ' + bolletje + '; na opruimen weer ' + herstel };"
 },
 {
  "id": "T095",
  "gebied": "responsief",
  "naam": "terugvalkaart — na het opstarten weg, en een verse kaart start op opacity 0 met 1s vertraging",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "const echt = H.qa('.kaart.leeg.opstart').length;\nconst hoofd = document.getElementById('hoofd');\nconst kinderen = hoofd.children.length;\nconst proef = document.createElement('div');\nproef.className = 'kaart leeg opstart';\nproef.innerHTML = '<h2>proef</h2>';\nhoofd.appendChild(proef);\nawait H.wacht(50);\nconst opacity = H.stijl(proef, 'opacity');\nconst delay = H.stijl(proef, 'animation-delay');\nconst naam = H.stijl(proef, 'animation-name');\nproef.remove();\nconst ok = echt === 0 && kinderen > 0 && opacity === '0' && parseFloat(delay) >= 0.9 && naam === 'opstart-tonen';\nreturn { ok, detail: 'terugvalkaart in de draaiende app: ' + echt + ' (0 verwacht), #hoofd heeft ' + kinderen + ' kinderen; een verse opstartkaart begint op opacity ' + opacity + ' met animatie ' + naam + ' na ' + delay };"
 },
 {
  "id": "T096",
  "gebied": "responsief",
  "naam": "style.css — de breekpunten 1200/1500 en de volgorde van het afdrukblok",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync } from 'node:fs';\nconst css = readFileSync('./css/style.css','utf8');\nconst i = (s) => css.indexOf(s);\nconst blok = (start) => { let d=0,j=css.indexOf('{',start); for(let k=j;k<css.length;k++){ if(css[k]==='{')d++; else if(css[k]==='}'){d--; if(!d) return css.slice(j+1,k);} } return ''; };\nlet fout = [];\nconst p1200 = i('@media (min-width: 1200px)'), p1500 = i('@media (min-width: 1500px)'), pPrint = i('@media print'), pRM = i('@media (prefers-reduced-motion: reduce)'), p720 = i('@media (max-width: 720px)');\nfor (const [n,p] of [['1200',p1200],['1500',p1500],['print',pPrint],['reduced-motion',pRM],['720',p720]]) if (p<0) fout.push('mediaquery ' + n + ' ontbreekt');\nif (fout.length) { console.log('FOUT: ' + fout.join('; ')); process.exit(0); }\nconst b1200 = blok(p1200), b1500 = blok(p1500), bPrint = blok(pPrint);\nif (!/:root\\\\s*{[^}]*font-size:\\\\s*106\\\\.25%/.test(b1200)) fout.push('1200px zet de root niet op 106.25%');\nif (!/:root\\\\s*{[^}]*font-size:\\\\s*115%/.test(b1500)) fout.push('1500px zet de root niet op 115%');\nif (!/--breedte:\\\\s*1080px/.test(b1500)) fout.push('1500px zet --breedte niet op 1080px');\nif (!/:root\\\\s*{[^}]*font-size:\\\\s*100%/.test(bPrint)) fout.push('het afdrukblok zet de root niet terug op 100%');\nif (!(pPrint > p1500 && pPrint > p1200)) fout.push('het afdrukblok staat VOOR de breedtequeries en verliest dus van 115%');\nconst pHover = i('a.kaart:hover');\nif (!(pRM > pHover)) fout.push('prefers-reduced-motion staat voor a.kaart:hover en overschrijft de transform niet');\nif (!(p720 > i('.knop {'))) fout.push('het 720px-blok staat voor de .knop-basisregel');\nconsole.log('1200:',p1200,'1500:',p1500,'print:',pPrint,'reduced-motion:',pRM,'720:',p720,'a.kaart:hover:',pHover);\nconsole.log(fout.length ? 'FOUT: ' + fout.join('; ') : 'OK');\n\""
 },
 {
  "id": "T097",
  "gebied": "toegankelijkheid",
  "naam": "precies één h1 en geen overgeslagen kopniveau op alle zes de pagina's",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const routes = ['#/', '#/workshop/a3', '#/module/kennismaking', '#/module/prompten', '#/module/casussen', '#/bundel/a3', '#/gids', '#/prompts'];\nconst fouten = [];\nlet toestanden = 0;\nfor (const modus of [true, false]) {\n  await H.begeleider(modus);\n  const naam = modus ? 'begeleider' : 'deelnemer';\n  for (const r of routes) {\n    if (r === '#/gids' && !modus) continue; // zonder begeleidersmodus toont de gids enkel een doorverwijskaart\n    await H.ga(r);\n    toestanden++;\n    const koppen = H.qa('h1, h2, h3, h4, h5, h6');\n    const niveaus = koppen.map((k) => Number(k.tagName[1]));\n    const aantalH1 = niveaus.filter((n) => n === 1).length;\n    if (aantalH1 !== 1) fouten.push(r + ' (' + naam + '): ' + aantalH1 + ' h1');\n    for (let i = 1; i < niveaus.length; i++)\n      if (niveaus[i] > niveaus[i - 1] + 1)\n        fouten.push(r + ' (' + naam + '): sprong h' + niveaus[i - 1] + ' naar h' + niveaus[i] + ' bij \"' + koppen[i].textContent.trim().slice(0, 40) + '\"');\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nreturn { ok: fouten.length === 0, detail: toestanden + ' paginatoestanden nagekeken; ' + (fouten.length ? fouten.join(' | ') : 'overal precies een h1 en geen overgeslagen kopniveau') };"
 },
 {
  "id": "T098",
  "gebied": "toegankelijkheid",
  "naam": "terugvalpagina's (Niet gevonden, gids zonder begeleidersmodus, opstartkaart) hebben een h1",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const gevallen = [];\nawait H.ga('#/bestaat-niet');\ngevallen.push(['onbekende hash', H.qa('#hoofd h1').length, (H.q('#hoofd h2') || {}).textContent]);\nawait H.ga('#/gids');\ngevallen.push(['gids zonder begeleidersmodus', H.qa('#hoofd h1').length, (H.q('#hoofd h2') || {}).textContent]);\nconst html = await (await fetch('index.html')).text();\nconst doc = new DOMParser().parseFromString(html, 'text/html');\ngevallen.push(['opstartkaart in index.html', doc.querySelectorAll('main h1').length, (doc.querySelector('main h2') || {}).textContent]);\nawait H.ga('#/');\nconst zonder = gevallen.filter((g) => g[1] !== 1);\nreturn {\n  ok: zonder.length === 0,\n  detail: zonder.length\n    ? zonder.map((g) => g[0] + ': ' + g[1] + ' h1, hoogste kop is h2 \"' + String(g[2]).trim() + '\"').join(' | ')\n    : 'alle drie de terugvalpaginas hebben precies een h1',\n};"
 },
 {
  "id": "T099",
  "gebied": "toegankelijkheid",
  "naam": "elk pictogram in de tekst staat in iets met aria-hidden",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const EMOJI = /[←-⇿☀-➿⬀-⯿\\u{1F000}-\\u{1FAFF}]/gu;\nconst routes = ['#/', '#/workshop/a1', '#/workshop/b2', '#/module/kennismaking', '#/module/casussen', '#/module/vibe-ai', '#/bundel/a3', '#/bundel/b1', '#/gids', '#/prompts'];\nconst fouten = [];\nlet gevonden = 0;\nfor (const modus of [true, false]) {\n  await H.begeleider(modus);\n  for (const r of routes) {\n    if (r === '#/gids' && !modus) continue;\n    await H.ga(r);\n    const loper = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);\n    let n;\n    while ((n = loper.nextNode())) {\n      const treffers = n.nodeValue.match(EMOJI);\n      if (!treffers) continue;\n      gevonden += treffers.length;\n      let el = n.parentElement;\n      let verborgen = false;\n      while (el) { if (el.getAttribute('aria-hidden') === 'true') { verborgen = true; break; } el = el.parentElement; }\n      if (!verborgen) fouten.push(r + (modus ? ' (begeleider)' : '') + ': \"' + treffers.join('') + '\" in <' + n.parentElement.tagName.toLowerCase() + ' class=\"' + n.parentElement.className + '\">');\n    }\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nconst uniek = [...new Set(fouten)];\nreturn { ok: uniek.length === 0, detail: gevonden + ' pictogrammen in de tekst gevonden; ' + (uniek.length ? uniek.length + ' zonder aria-hidden: ' + uniek.slice(0, 5).join(' | ') : 'alle in een element met aria-hidden=\"true\"') };"
 },
 {
  "id": "T100",
  "gebied": "toegankelijkheid",
  "naam": "begeleidersschakelaar: aria-pressed volgt de stand en het aria-label dekt de zichtbare tekst",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const voor = H.opslagLees();\nconst lees = () => {\n  const k = H.q('[data-actie=\"begeleider\"]');\n  const zichtbaar = [...k.querySelectorAll('span')].filter((s) => H.zichtbaar(s) && s.textContent.trim()).map((s) => s.textContent.trim());\n  return { pressed: k.getAttribute('aria-pressed'), label: k.getAttribute('aria-label'), zichtbaar: zichtbaar.join(' '), klasse: document.body.classList.contains('begeleidersmodus') };\n};\nawait H.ga('#/');\nconst a = lees();\nawait H.klik('[data-actie=\"begeleider\"]');\nconst b = lees();\nawait H.klik('[data-actie=\"begeleider\"]');\nconst c = lees();\nif (voor) H.opslagZet(voor); else H.opslagWis();\nconst fouten = [];\nif (a.pressed !== 'false' || a.klasse) fouten.push('uit-stand: aria-pressed=' + a.pressed + ', body-klasse=' + a.klasse);\nif (b.pressed !== 'true' || !b.klasse) fouten.push('na klik: aria-pressed=' + b.pressed + ', body-klasse=' + b.klasse);\nif (c.pressed !== 'false' || c.klasse) fouten.push('na tweede klik: aria-pressed=' + c.pressed + ', body-klasse=' + c.klasse);\nif (!a.label) fouten.push('geen aria-label op de schakelaar');\nelse if (!a.label.toLowerCase().includes(a.zichtbaar.toLowerCase())) fouten.push('aria-label \"' + a.label + '\" bevat de zichtbare tekst \"' + a.zichtbaar + '\" niet');\nreturn { ok: fouten.length === 0, detail: fouten.length ? fouten.join(' | ') : 'aria-pressed false naar true naar false, aria-label \"' + a.label + '\" bevat de zichtbare tekst \"' + a.zichtbaar + '\"' };"
 },
 {
  "id": "T101",
  "gebied": "toegankelijkheid",
  "naam": "vinkknop: aria-pressed volgt en het vinkje zit niet in de toegankelijke naam",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const voor = H.opslagLees();\nawait H.ga('#/module/kennismaking');\nconst naam = (el) => { const k = el.cloneNode(true); k.querySelectorAll('[aria-hidden=\"true\"]').forEach((x) => x.remove()); return k.textContent.replace(/\\s+/g, ' ').trim(); };\nconst knop = H.q('.vink');\nconst a = { p: knop.getAttribute('aria-pressed'), n: naam(knop) };\nawait H.klik(knop);\nconst b = { p: knop.getAttribute('aria-pressed'), n: naam(knop), af: knop.closest('.les').classList.contains('af'), teller: H.q('#module-teller').textContent.trim() };\nawait H.klik(knop);\nconst c = { p: knop.getAttribute('aria-pressed'), n: naam(knop), af: knop.closest('.les').classList.contains('af') };\nif (voor) H.opslagZet(voor); else H.opslagWis();\nconst fouten = [];\nif (a.p !== 'false' || a.n !== 'Markeer als afgewerkt') fouten.push('start: aria-pressed=' + a.p + ', naam \"' + a.n + '\"');\nif (b.p !== 'true' || b.n !== 'Afgewerkt' || !b.af) fouten.push('na aanvinken: aria-pressed=' + b.p + ', naam \"' + b.n + '\", les.af=' + b.af);\nif (c.p !== 'false' || c.n !== 'Markeer als afgewerkt' || c.af) fouten.push('na afvinken: aria-pressed=' + c.p + ', naam \"' + c.n + '\", les.af=' + c.af);\nreturn { ok: fouten.length === 0, detail: fouten.length ? fouten.join(' | ') : 'aria-pressed false naar true naar false, toegankelijke naam \"' + a.n + '\" naar \"' + b.n + '\" (het vinkje zelf zit in aria-hidden), teller werd \"' + b.teller + '\"' };"
 },
 {
  "id": "T102",
  "gebied": "toegankelijkheid",
  "naam": "casusknop: aria-expanded volgt en het oordeel schuift mee open en dicht",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/module/casussen');\nconst knoppen = H.qa('.casus-knop');\nif (!knoppen.length) return { ok: false, detail: 'geen enkele casusknop gevonden op #/module/casussen' };\nconst fout = [];\nconst misstart = knoppen.filter((k) => k.getAttribute('aria-expanded') !== 'false').length;\nif (misstart) fout.push(misstart + ' van de ' + knoppen.length + ' casusknoppen starten niet op aria-expanded=\"false\"');\nconst knop = knoppen[0];\nconst antwoord = knop.closest('.casus').querySelector('.casus-antwoord');\nconst lees = () => ({ e: knop.getAttribute('aria-expanded'), t: knop.textContent.trim(), z: H.zichtbaar(antwoord) });\nconst a = lees();\nawait H.klik(knop);\nconst b = lees();\nawait H.klik(knop);\nconst c = lees();\nif (a.e !== 'false' || a.z) fout.push('dicht: aria-expanded=' + a.e + ', antwoord zichtbaar=' + a.z);\nif (b.e !== 'true' || !b.z || b.t !== 'Verberg het oordeel') fout.push('open: aria-expanded=' + b.e + ', zichtbaar=' + b.z + ', tekst \"' + b.t + '\"');\nif (c.e !== 'false' || c.z || c.t !== 'Toon het oordeel') fout.push('opnieuw dicht: aria-expanded=' + c.e + ', zichtbaar=' + c.z + ', tekst \"' + c.t + '\"');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : knoppen.length + ' casusknoppen; aria-expanded false naar true naar false, het oordeel volgt mee en de tekst wisselt \"' + a.t + '\" / \"' + b.t + '\"' };"
 },
 {
  "id": "T103",
  "gebied": "toegankelijkheid",
  "naam": "quiz: role=group met aria-labelledby naar de eigen vraag, en een role=status-uitslag",
  "soort": "browser",
  "route": "#/module/kennismaking",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const modules = ['kennismaking','prompten','lesvoorbereiding','toetsen-feedback','administratie','veilig-en-ethisch','casussen','vibe-start','vibe-bouwen','vibe-delen','vibe-data','vibe-ai'];\nconst fout = [];\nlet aantal = 0;\nfor (const id of modules) {\n  await H.ga('#/module/' + id);\n  for (const q of H.qa('.quiz')) {\n    aantal++;\n    const groep = q.querySelector('.opties');\n    const vraag = q.querySelector('h3');\n    if (!groep || groep.getAttribute('role') !== 'group') { fout.push(id + ': opties zonder role=\"group\"'); continue; }\n    const ref = groep.getAttribute('aria-labelledby');\n    const doelen = ref ? H.qa('#' + CSS.escape(ref)) : [];\n    if (doelen.length !== 1 || doelen[0] !== vraag) fout.push(id + ': aria-labelledby=\"' + ref + '\" wijst naar ' + doelen.length + ' element(en)' + (doelen[0] && doelen[0] !== vraag ? ' en niet naar de eigen vraag' : ''));\n    const uit = q.querySelector('.quiz-uitslag');\n    if (!uit || uit.getAttribute('role') !== 'status') fout.push(id + ': uitslag zonder role=\"status\"');\n    else if (uit.textContent.trim() !== '') fout.push(id + ': uitslag staat al ingevuld voor het antwoorden');\n    else if (H.stijl(uit, 'display') === 'none') fout.push(id + ': uitslag staat op display:none en wordt dan niet voorgelezen');\n  }\n}\nawait H.ga('#/module/prompten');\nconst q = H.q('.quiz');\nconst fouteOptie = H.qa('.quiz .optie').find((o) => o.dataset.juist === 'false');\nawait H.klik(fouteOptie);\nconst tekst = q.querySelector('.quiz-uitslag').textContent.trim();\nif (!tekst) fout.push('na een antwoord blijft de uitslag leeg');\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.slice(0, 4).join(' | ') : aantal + ' quizvragen: overal role=\"group\" met aria-labelledby naar precies een eigen h3, en een lege role=\"status\" die na het antwoorden \"' + tekst + '\" toont' };"
 },
 {
  "id": "T104",
  "gebied": "toegankelijkheid",
  "naam": "focus-visible geeft een zichtbare ring, wit in de donkere promptbalk",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "// :focus-visible is niet programmatisch af te dwingen (dat vraagt een echte toetsaanslag),\n// dus kopieren we elke :focus-visible-regel naar een tijdelijke klasse. De browser rekent\n// var() en de cascade dan gewoon zelf uit. transition:none, anders meet je de tussenstand\n// van de overgang van .15s op .knop.\nlet css = '.tst-fv { transition: none !important; }\\n';\nlet regels = 0;\nfor (const blad of document.styleSheets) {\n  let rr;\n  try { rr = blad.cssRules; } catch (e) { continue; }\n  for (const r of rr) if (r.selectorText && r.selectorText.includes(':focus-visible')) { css += r.cssText.replace(/:focus-visible/g, '.tst-fv') + '\\n'; regels++; }\n}\nconst stijlblad = document.createElement('style');\nstijlblad.textContent = css;\ndocument.head.appendChild(stijlblad);\nconst schaal = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;\nconst meet = (el) => { el.classList.add('tst-fv'); const s = getComputedStyle(el); const u = { kleur: s.outlineColor, breedte: parseFloat(s.outlineWidth) / schaal, soort: s.outlineStyle, offset: s.outlineOffset }; el.classList.remove('tst-fv'); return u; };\nawait H.ga('#/prompts');\nconst gewoon = meet(H.q('.besturing .knop'));\nconst donker = meet(H.q('.promptblok figcaption .knop.mini'));\nawait H.ga('#/');\nconst schakelaar = meet(H.q('[data-actie=\"begeleider\"]'));\nstijlblad.remove();\nconst fout = [];\nif (!regels) fout.push('geen enkele :focus-visible-regel in de stylesheet');\nconst keur = (naam, m, kleur) => {\n  if (m.soort !== 'solid' || m.breedte < 2) fout.push(naam + ': outline ' + m.breedte.toFixed(1) + 'px ' + m.soort);\n  if (m.kleur !== kleur) fout.push(naam + ': outline-color ' + m.kleur + ' in plaats van ' + kleur);\n};\nkeur('afdrukknop', gewoon, 'rgb(44, 90, 160)');\nkeur('begeleidersschakelaar', schakelaar, 'rgb(44, 90, 160)');\nkeur('kopieerknop in de donkere promptbalk', donker, 'rgb(255, 255, 255)');\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : regels + ' :focus-visible-regels; gewone knop ' + gewoon.breedte.toFixed(0) + 'px solid ' + gewoon.kleur + ' offset ' + gewoon.offset + ', knop in de promptbalk ' + donker.breedte.toFixed(0) + 'px solid ' + donker.kleur };"
 },
 {
  "id": "T105",
  "gebied": "toegankelijkheid",
  "naam": "alle links hebben een href, alle knoppen zijn echte buttons met een naam, html lang=nl",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const routes = ['#/', '#/workshop/a3', '#/module/kennismaking', '#/module/casussen', '#/bundel/a3', '#/gids', '#/prompts'];\nconst fout = [];\nlet links = 0;\nlet knoppen = 0;\nconst naam = (el) => { const k = el.cloneNode(true); k.querySelectorAll('[aria-hidden=\"true\"]').forEach((x) => x.remove()); return (el.getAttribute('aria-label') || k.textContent).replace(/\\s+/g, ' ').trim(); };\nif (document.documentElement.lang !== 'nl') fout.push('html lang=\"' + document.documentElement.lang + '\" in plaats van nl');\nfor (const modus of [true, false]) {\n  await H.begeleider(modus);\n  for (const r of routes) {\n    if (r === '#/gids' && !modus) continue;\n    await H.ga(r);\n    for (const a of H.qa('a')) {\n      links++;\n      const h = a.getAttribute('href');\n      if (!h || h === '#' || !h.trim()) fout.push(r + ': anker zonder bruikbare href (\"' + h + '\") bij \"' + naam(a).slice(0, 30) + '\"');\n    }\n    for (const b of H.qa('button')) {\n      knoppen++;\n      if (!naam(b)) fout.push(r + ': knop zonder toegankelijke naam, class=\"' + b.className + '\"');\n    }\n    for (const k of H.qa('[data-actie]')) if (k.tagName !== 'BUTTON') fout.push(r + ': klikbare <' + k.tagName.toLowerCase() + '> met data-actie=\"' + k.dataset.actie + '\" in plaats van een knop');\n    for (const k of H.qa('[role=\"button\"], [onclick]')) if (k.tagName !== 'BUTTON') fout.push(r + ': nagemaakte knop <' + k.tagName.toLowerCase() + '>');\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nconst uniek = [...new Set(fout)];\nreturn { ok: uniek.length === 0, detail: uniek.length ? uniek.slice(0, 4).join(' | ') : links + ' links (alle met href), ' + knoppen + ' knoppen (alle echte button met een toegankelijke naam), html lang=\"nl\"' };"
 },
 {
  "id": "T106",
  "gebied": "toegankelijkheid",
  "naam": "contrast van --inkt-flauw haalt WCAG AA op elke achtergrond",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const rgb = (s) => (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number);\nconst lum = (c) => { const k = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2]; };\nconst ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };\nconst dekkend = (kleur) => { const d = kleur.match(/[\\d.]+/g) || []; return d.length === 3 || Number(d[3]) > 0; };\nconst achtergrond = (el) => { let p = el; while (p) { const b = getComputedStyle(p).backgroundColor; if (dekkend(b)) return rgb(b); p = p.parentElement; } return [255, 255, 255]; };\nconst flauw = getComputedStyle(document.documentElement).getPropertyValue('--inkt-flauw').trim().toLowerCase();\nconst routes = ['#/', '#/workshop/a3', '#/module/kennismaking', '#/bundel/a3', '#/gids', '#/prompts'];\nawait H.begeleider(true);\nconst gemeten = [];\nfor (const r of routes) {\n  await H.ga(r);\n  for (const el of H.qa('#hoofd *, #voet *, #kop *')) {\n    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) continue;\n    const s = getComputedStyle(el);\n    const kl = rgb(s.color);\n    if (kl.length !== 3) continue;\n    const hex = '#' + kl.map((v) => v.toString(16).padStart(2, '0')).join('');\n    if (hex !== flauw) continue;\n    const bg = achtergrond(el);\n    gemeten.push({ r: ratio(kl, bg), waar: r + ' ' + el.tagName.toLowerCase() + '.' + (el.className || '-'), px: s.fontSize, bg: 'rgb(' + bg.join(', ') + ')' });\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nif (!gemeten.length) return { ok: false, detail: 'geen enkel tekstelement met de kleur ' + flauw + ' gevonden - bestaat --inkt-flauw nog?' };\ngemeten.sort((a, b) => a.r - b.r);\nconst laag = gemeten[0];\nconst hoog = gemeten[gemeten.length - 1];\nconst zakkers = gemeten.filter((g) => g.r < 4.5);\nreturn { ok: zakkers.length === 0, detail: '--inkt-flauw = ' + flauw + '; ' + gemeten.length + ' tekstelementen gemeten; laagste contrast ' + laag.r.toFixed(2) + ':1 op ' + laag.bg + ' (' + laag.waar + ', ' + laag.px + '), hoogste ' + hoog.r.toFixed(2) + ':1; AA voor gewone tekst vraagt 4.5:1' + (zakkers.length ? ' - ' + zakkers.length + ' zakken' : '') };"
 },
 {
  "id": "T107",
  "gebied": "toegankelijkheid",
  "naam": "geen enkel dubbel id op alle 27 routes",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const modules = ['kennismaking','prompten','lesvoorbereiding','toetsen-feedback','administratie','veilig-en-ethisch','casussen','vibe-start','vibe-bouwen','vibe-delen','vibe-data','vibe-ai'];\nconst ws = ['a1','a2','a3','b1','b2','b3'];\nconst routes = ['#/', '#/gids', '#/prompts', ...ws.map((w) => '#/workshop/' + w), ...ws.map((w) => '#/bundel/' + w), ...modules.map((m) => '#/module/' + m)];\nconst fout = [];\nlet totaal = 0;\nfor (const r of routes) {\n  await H.ga(r);\n  const gezien = new Map();\n  for (const el of H.qa('[id]')) { totaal++; gezien.set(el.id, (gezien.get(el.id) || 0) + 1); }\n  for (const [id, n] of gezien) if (n > 1) fout.push(r + ': id \"' + id + '\" komt ' + n + ' keer voor');\n}\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: routes.length + ' routes, ' + totaal + ' elementen met een id; ' + (fout.length ? fout.slice(0, 5).join(' | ') : 'geen enkel dubbel id') };"
 },
 {
  "id": "T108",
  "gebied": "toegankelijkheid",
  "naam": "raakvlakken op gsm zijn minstens 44px hoog",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "gsm",
  "herladen": false,
  "script": "if (innerWidth > 720) return { ok: false, detail: 'deze test hoort op een gsm-viewport te draaien, de breedte is nu ' + innerWidth + 'px' };\nconst schaal = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;\nconst eis = 44 * schaal - 0.5;\nconst routes = ['#/', '#/workshop/a3', '#/module/casussen', '#/prompts'];\nconst sel = '.knop, .vink, .schakelaar, a.etiket-klein.link, .besturing input[type=time]';\nconst klein = [];\nlet n = 0;\nlet laagste = { h: 1e9, waar: '-' };\nawait H.begeleider(true);\nfor (const r of routes) {\n  await H.ga(r);\n  for (const el of H.qa(sel)) {\n    if (!H.zichtbaar(el)) continue;\n    n++;\n    const h = el.getBoundingClientRect().height;\n    if (h < laagste.h) laagste = { h: h, waar: r + ' <' + el.tagName.toLowerCase() + ' class=\"' + el.className + '\">' };\n    if (h < eis) klein.push(r + ': ' + (el.className || el.tagName) + ' is ' + h.toFixed(1) + 'px hoog');\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nreturn { ok: klein.length === 0 && n > 20, detail: n + ' raakvlakken gemeten bij ' + innerWidth + 'px (schaal ' + schaal.toFixed(3) + ', drempel ' + eis.toFixed(1) + 'px); kleinste ' + laagste.h.toFixed(1) + 'px op ' + laagste.waar + (klein.length ? ' - ' + klein.length + ' te klein: ' + klein.slice(0, 3).join(' | ') : '') };"
 },
 {
  "id": "T109",
  "gebied": "toegankelijkheid",
  "naam": "oriëntatiepunten: één main, één header, één footer en elke nav apart benoemd",
  "soort": "browser",
  "route": "#/",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "const routes = ['#/', '#/workshop/a3', '#/module/kennismaking', '#/bundel/a3', '#/gids', '#/prompts'];\nconst fout = [];\nconst tel = [];\nawait H.begeleider(true);\nfor (const r of routes) {\n  await H.ga(r);\n  const mains = H.qa('main');\n  const headers = H.qa('body > header');\n  const footers = H.qa('body > footer');\n  if (mains.length !== 1) fout.push(r + ': ' + mains.length + ' <main>');\n  if (headers.length !== 1 || footers.length !== 1) fout.push(r + ': ' + headers.length + ' header / ' + footers.length + ' footer');\n  const navs = H.qa('nav');\n  tel.push(r + '=' + navs.length);\n  if (navs.length > 1) {\n    const namen = navs.map((n) => (n.getAttribute('aria-label') || (n.getAttribute('aria-labelledby') ? 'labelledby' : '')).trim());\n    const zonder = namen.filter((x) => !x).length;\n    if (zonder) fout.push(r + ': ' + navs.length + ' <nav> waarvan ' + zonder + ' zonder aria-label (' + navs.map((n) => '.' + (n.className.split(' ')[0] || '?')).join(', ') + ')');\n    else if (new Set(namen).size !== namen.length) fout.push(r + ': twee <nav> met dezelfde naam');\n  }\n}\nawait H.begeleider(false);\nawait H.ga('#/');\nreturn { ok: fout.length === 0, detail: 'aantal nav per route (' + tel.join(', ') + '); ' + (fout.length ? fout.join(' | ') : 'overal een main, een header en een footer, en elke nav apart benoemd') };"
 },
 {
  "id": "T110",
  "gebied": "toegankelijkheid",
  "naam": "geen pictogram in tekst die een schermlezer voorleest (sjablonen én inhoud)",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync } from 'node:fs';\nimport { MODULES, WORKSHOPS, SPOREN } from './js/cursus.js';\nimport { GIDS_SECTIES, FAQ_GROEPEN } from './js/gids.js';\nconst EMOJI = /[←-⇿☀-➿⬀-⯿\\u{1F000}-\\u{1FAFF}]/gu;\nconst fout = [];\nreadFileSync('js/app.js', 'utf8').split(/\\r?\\n/).forEach((r, i) => {\n  const t = r.match(EMOJI);\n  if (t && !r.includes('aria-hidden')) fout.push('app.js regel ' + (i + 1) + ': ' + t.join('') + ' in  ' + r.trim());\n});\nlet velden = 0;\nconst loop = (w, pad) => {\n  if (typeof w === 'string') { velden++; const t = w.match(EMOJI); if (t) fout.push('inhoud ' + pad + ': ' + t.join('')); return; }\n  if (Array.isArray(w)) return w.forEach((v, i) => loop(v, pad + '[' + i + ']'));\n  if (w && typeof w === 'object') for (const [k, v] of Object.entries(w)) { if (k === 'icoon') continue; loop(v, pad + '.' + k); }\n};\nloop(MODULES, 'MODULES'); loop(WORKSHOPS, 'WORKSHOPS'); loop(SPOREN, 'SPOREN');\nloop(GIDS_SECTIES, 'GIDS'); loop(FAQ_GROEPEN, 'FAQ');\nconsole.log(velden + ' inhoudsvelden en alle regels van app.js nagekeken (het icoon-veld overgeslagen: dat gaat altijd in een span met aria-hidden)');\nfout.forEach((f) => console.log('  ' + f));\nconsole.log(fout.length ? 'FOUT: ' + fout.length + ' pictogram(men) die een schermlezer voorleest' : 'OK');\n\""
 },
 {
  "id": "T111",
  "gebied": "data",
  "naam": "elke workshop is exact 180 minuten met precies één pauze van 15 minuten",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS } from './js/workshops.js';\nlet fout = [];\nfor (const w of WORKSHOPS) {\n  const som = w.draaiboek.reduce((s,b) => s + b.minuten, 0);\n  const pauzes = w.draaiboek.filter(b => b.soort === 'pauze');\n  const pauzeMin = pauzes.reduce((s,b) => s + b.minuten, 0);\n  const nietGeheel = w.draaiboek.filter(b => !Number.isInteger(b.minuten) || b.minuten <= 0);\n  console.log(w.code, som + ' min', pauzes.length + ' pauze(s)', pauzeMin + ' min pauze', w.draaiboek.length + ' blokken');\n  if (som !== 180) fout.push(w.code + ': ' + som + ' min in plaats van 180');\n  if (pauzes.length !== 1) fout.push(w.code + ': ' + pauzes.length + ' pauzeblokken in plaats van 1');\n  if (pauzeMin !== 15) fout.push(w.code + ': pauze duurt ' + pauzeMin + ' min in plaats van 15');\n  if (nietGeheel.length) fout.push(w.code + ': blok met een ongeldige duur');\n}\nif (WORKSHOPS.length !== 6) fout.push('aantal workshops is ' + WORKSHOPS.length + ' in plaats van 6');\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T112",
  "gebied": "data",
  "naam": "elk niet-pauzeblok heeft soort, titel, wat en minstens één tip",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS } from './js/workshops.js';\nconst SOORTEN = ['instap','uitleg','doen','gesprek','pauze','afronding'];\nlet fout = [], gecontroleerd = 0;\nfor (const w of WORKSHOPS) for (const b of w.draaiboek) {\n  const naam = w.code + ' / ' + (b.titel || '(zonder titel)');\n  if (!SOORTEN.includes(b.soort)) fout.push(naam + ': onbekende soort ' + b.soort);\n  if (!b.titel || !String(b.titel).trim()) fout.push(naam + ': geen titel');\n  if (!b.wat || !String(b.wat).trim()) fout.push(naam + ': geen wat');\n  if (b.soort === 'pauze') continue;\n  gecontroleerd++;\n  if (!Array.isArray(b.tips) || b.tips.length === 0) fout.push(naam + ': geen tips, dus onafgewerkt');\n  else if (b.tips.some(t => !t || !String(t).trim())) fout.push(naam + ': lege tip');\n}\nconst perSoort = {};\nfor (const w of WORKSHOPS) for (const b of w.draaiboek) perSoort[b.soort] = (perSoort[b.soort]||0)+1;\nconsole.log('blokken per soort:', JSON.stringify(perSoort));\nconsole.log('niet-pauzeblokken gecontroleerd:', gecontroleerd);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T113",
  "gebied": "data",
  "naam": "elk blok verwijst naar een bestaande module en elke module wordt gebruikt",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, WORKSHOPS, SPOREN } from './js/cursus.js';\nlet fout = [];\nconst ids = new Set(MODULES.map(m => m.id));\nconst gebruikt = new Set();\nfor (const w of WORKSHOPS) for (const b of w.draaiboek) if (b.module) {\n  gebruikt.add(b.module);\n  if (!ids.has(b.module)) fout.push(w.code + ' verwijst naar de onbestaande module ' + b.module);\n}\nconst ongebruikt = [...ids].filter(id => !gebruikt.has(id));\nif (ongebruikt.length) fout.push('module(s) die in geen enkel draaiboek voorkomen: ' + ongebruikt.join(', '));\nconst spoorIds = new Set(SPOREN.map(s => s.id));\nfor (const w of WORKSHOPS) if (!spoorIds.has(w.spoor)) fout.push(w.code + ' hoort bij het onbestaande spoor ' + w.spoor);\nfor (const m of MODULES) if (!spoorIds.has(m.spoor)) fout.push('module ' + m.id + ' hoort bij het onbestaande spoor ' + m.spoor);\nfor (const s of SPOREN) {\n  const n = WORKSHOPS.filter(w => w.spoor === s.id).length;\n  const k = MODULES.filter(m => m.spoor === s.id).length;\n  console.log('spoor', s.id + ':', n, 'workshops,', k, 'modules');\n  if (n === 0) fout.push('spoor ' + s.id + ' heeft geen enkele workshop');\n}\nconsole.log('modules gebruikt in een draaiboek:', gebruikt.size, 'van', ids.size);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T114",
  "gebied": "data",
  "naam": "alle module-, workshop- en les-ids zijn uniek en URL-veilig",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, WORKSHOPS } from './js/cursus.js';\nlet fout = [];\nfunction dubbels(lijst) { const g = new Set(), d = new Set(); for (const x of lijst) { if (g.has(x)) d.add(x); g.add(x); } return [...d]; }\nconst mIds = MODULES.map(m => m.id);\nconst wIds = WORKSHOPS.map(w => w.id);\nconst lIds = MODULES.flatMap(m => m.lessen.map(l => l.id));\nconst dm = dubbels(mIds), dw = dubbels(wIds), dl = dubbels(lIds);\nif (dm.length) fout.push('dubbele module-ids: ' + dm.join(', '));\nif (dw.length) fout.push('dubbele workshop-ids: ' + dw.join(', '));\nif (dl.length) fout.push('dubbele les-ids: ' + dl.join(', '));\nconst vorm = new RegExp('^[a-z0-9-]+$');\nfor (const id of [...mIds, ...wIds, ...lIds]) if (!vorm.test(id)) fout.push('id niet in kleine letters of niet URL-veilig: ' + id);\nconsole.log('module-ids', mIds.length, '| workshop-ids', wIds.length, '| les-ids', lIds.length);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T115",
  "gebied": "data",
  "naam": "12 modules, 28 lessen, 133 blokken met de verwachte typeverdeling",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst VERWACHT = { tekst: 31, kader: 31, lijst: 18, prompt: 15, casus: 14, quiz: 11, opdracht: 11, vergelijk: 2 };\nconst telling = {};\nlet lessen = 0, blokken = 0;\nfor (const m of MODULES) for (const l of m.lessen) { lessen++; for (const b of l.blokken) { blokken++; telling[b.type] = (telling[b.type]||0)+1; } }\nlet fout = [];\nif (MODULES.length !== 12) fout.push('modules: ' + MODULES.length + ' in plaats van 12');\nif (lessen !== 28) fout.push('lessen: ' + lessen + ' in plaats van 28');\nif (blokken !== 133) fout.push('blokken: ' + blokken + ' in plaats van 133');\nfor (const t of Object.keys(VERWACHT)) if ((telling[t]||0) !== VERWACHT[t]) fout.push(t + ': ' + (telling[t]||0) + ' in plaats van ' + VERWACHT[t]);\nfor (const t of Object.keys(telling)) if (!(t in VERWACHT)) fout.push('blok-type dat de renderer niet kent: ' + t);\nconsole.log('modules', MODULES.length, '| lessen', lessen, '| blokken', blokken);\nconsole.log('typeverdeling', JSON.stringify(telling));\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T116",
  "gebied": "data",
  "naam": "elke module heeft minstens één prompt, één opdracht en één quizvraag",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nlet fout = [];\nconst rij = [];\nfor (const m of MODULES) {\n  const t = {};\n  for (const l of m.lessen) for (const b of l.blokken) t[b.type] = (t[b.type]||0)+1;\n  rij.push(m.id + ': prompt ' + (t.prompt||0) + ', opdracht ' + (t.opdracht||0) + ', quiz ' + (t.quiz||0) + ', casus ' + (t.casus||0));\n  if (m.id === 'casussen') { if (!(t.casus > 0)) fout.push('casussen: geen enkele casus'); continue; }\n  for (const type of ['prompt','opdracht','quiz']) if (!(t[type] > 0)) fout.push(m.id + ': geen enkel blok van het type ' + type);\n  if (!Array.isArray(m.doelen) || m.doelen.length < 2) fout.push(m.id + ': minder dan 2 doelen');\n  if (!m.icoon || !m.titel || !m.ondertitel || !m.duur || !m.niveau) fout.push(m.id + ': ontbrekend kopveld');\n}\nconsole.log(rij.join('|'));\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T117",
  "gebied": "data",
  "naam": "elke quiz heeft precies één juist antwoord, minstens drie opties en feedback bij elk antwoord",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nlet fout = [], aantal = 0;\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  if (b.type !== 'quiz') continue;\n  aantal++;\n  const p = m.id + '/' + l.id;\n  if (!b.vraag || !String(b.vraag).trim()) fout.push(p + ': lege vraag');\n  const opties = Array.isArray(b.opties) ? b.opties : [];\n  if (opties.length < 3) fout.push(p + ': ' + opties.length + ' opties, minstens 3 nodig');\n  const juist = opties.filter(o => o.juist === true).length;\n  if (juist !== 1) fout.push(p + ': ' + juist + ' juiste antwoorden in plaats van precies 1');\n  for (const o of opties) {\n    if (typeof o.juist !== 'boolean') fout.push(p + ': optie zonder true/false bij juist');\n    if (!o.tekst || !String(o.tekst).trim()) fout.push(p + ': optie zonder tekst');\n    if (!o.feedback || !String(o.feedback).trim()) fout.push(p + ': geen feedback bij de optie ' + String(o.tekst).slice(0, 40));\n  }\n  const t = opties.map(o => o.tekst);\n  if (new Set(t).size !== t.length) fout.push(p + ': twee identieke opties');\n}\nconsole.log('quizvragen gecontroleerd:', aantal);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T118",
  "gebied": "data",
  "naam": "elke casus heeft een geldig oordeel, een toelichting en een discussievraag",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst TOEGELATEN = ['mag','mag-niet','hangt-ervan-af'];\nlet fout = [], aantal = 0;\nconst verdeling = { mag: 0, 'mag-niet': 0, 'hangt-ervan-af': 0 };\nconst titels = [];\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  if (b.type !== 'casus') continue;\n  aantal++;\n  titels.push(b.titel);\n  const p = m.id + '/' + l.id + '/' + b.titel;\n  if (!TOEGELATEN.includes(b.oordeel)) fout.push(p + ': onbekend oordeel ' + b.oordeel);\n  else verdeling[b.oordeel]++;\n  for (const veld of ['titel','situatie','toelichting','discussie'])\n    if (!b[veld] || !String(b[veld]).trim()) fout.push(p + ': het veld ' + veld + ' ontbreekt of is leeg');\n  if (String(b.toelichting||'').length < 100) fout.push(p + ': de toelichting is verdacht kort');\n}\nif (aantal !== 14) fout.push('aantal casussen is ' + aantal + ' in plaats van 14');\nif (new Set(titels).size !== titels.length) fout.push('twee casussen met dezelfde titel');\nfor (const k of TOEGELATEN) if (verdeling[k] === 0) fout.push('geen enkele casus met het oordeel ' + k);\nconsole.log('casussen:', aantal, '- verdeling:', JSON.stringify(verdeling));\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T119",
  "gebied": "data",
  "naam": "CLAUDE.md en de A3-tip vertellen dezelfde aantallen als de data",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync } from 'node:fs';\nimport { MODULES, WORKSHOPS } from './js/cursus.js';\nimport { FAQ_GROEPEN } from './js/gids.js';\nconst WOORD = { twee: 2, drie: 3, vier: 4, vijf: 5, zes: 6, zeven: 7, acht: 8, negen: 9, tien: 10, elf: 11, twaalf: 12, dertien: 13, veertien: 14, vijftien: 15 };\nlet fout = [];\nconst alle = MODULES.flatMap(m => m.lessen).flatMap(l => l.blokken);\nconst telling = {};\nfor (const b of alle) telling[b.type] = (telling[b.type]||0)+1;\nconst werk = { modules: MODULES.length, lessen: MODULES.reduce((s,m) => s + m.lessen.length, 0), blokken: alle.length, casussen: telling.casus||0, faq: FAQ_GROEPEN.reduce((s,g) => s + g.vragen.length, 0) };\nconst spr = { mag: 0, mn: 0, hea: 0 };\nfor (const b of alle) if (b.type === 'casus') { if (b.oordeel === 'mag') spr.mag++; else if (b.oordeel === 'mag-niet') spr.mn++; else spr.hea++; }\nconsole.log('werkelijk:', JSON.stringify(werk), '| mag/mag-niet/hangt:', spr.mag, spr.mn, spr.hea);\nconst md = readFileSync('CLAUDE.md', 'utf8');\nconst m1 = md.match(new RegExp('([0-9]+) modules, ([0-9]+) lessen, ([0-9]+) inhoudsblokken'));\nif (!m1) fout.push('CLAUDE.md: de regel met modules/lessen/inhoudsblokken is niet gevonden');\nelse {\n  console.log('CLAUDE.md:', m1[0]);\n  if (+m1[1] !== werk.modules) fout.push('CLAUDE.md noemt ' + m1[1] + ' modules, het zijn er ' + werk.modules);\n  if (+m1[2] !== werk.lessen) fout.push('CLAUDE.md noemt ' + m1[2] + ' lessen, het zijn er ' + werk.lessen);\n  if (+m1[3] !== werk.blokken) fout.push('CLAUDE.md noemt ' + m1[3] + ' inhoudsblokken, het zijn er ' + werk.blokken);\n}\nfor (const [type, n] of Object.entries(telling)) {\n  const t = md.match(new RegExp(type + ' ([0-9]+)'));\n  if (!t) fout.push('CLAUDE.md vermeldt het aantal blokken van het type ' + type + ' niet');\n  else if (+t[1] !== n) fout.push('CLAUDE.md noemt ' + t[1] + ' blokken ' + type + ', het zijn er ' + n);\n}\nconst m2 = md.match(new RegExp('([0-9]+) casussen')); if (m2 && +m2[1] !== werk.casussen) fout.push('CLAUDE.md noemt ' + m2[1] + ' casussen, het zijn er ' + werk.casussen);\nconst m3 = md.match(new RegExp('([0-9]+) lastige vragen')); if (m3 && +m3[1] !== werk.faq) fout.push('CLAUDE.md noemt ' + m3[1] + ' lastige vragen, het zijn er ' + werk.faq);\nconst a3 = WORKSHOPS.find(w => w.code === 'A3');\nconst tip = a3.draaiboek.flatMap(b => b.tips || []).find(t => t.includes('Verdeel de'));\nif (!tip) fout.push('A3: de tip die de casussen verdeelt is niet gevonden');\nelse {\n  const t1 = tip.match(new RegExp('Verdeel de ([a-z]+) casussen'));\n  const t2 = tip.match(new RegExp('er zijn er ([a-z]+), naast ([a-z]+) keer .mag niet. en ([a-z]+) keer .mag.'));\n  console.log('A3-tip:', t1 ? t1[1] : '?', '|', t2 ? t2.slice(1,4).join(' / ') : 'spreidingszin niet herkend');\n  if (!t1 || WOORD[t1[1]] !== werk.casussen) fout.push('de A3-tip noemt een ander aantal casussen dan de ' + werk.casussen + ' die er zijn');\n  if (!t2) fout.push('A3-tip: de zin over de spreiding is niet meer herkenbaar');\n  else {\n    if (WOORD[t2[1]] !== spr.hea) fout.push('de A3-tip noemt ' + t2[1] + ' keer hangt-ervan-af, het zijn er ' + spr.hea);\n    if (WOORD[t2[2]] !== spr.mn) fout.push('de A3-tip noemt ' + t2[2] + ' keer mag-niet, het zijn er ' + spr.mn);\n    if (WOORD[t2[3]] !== spr.mag) fout.push('de A3-tip noemt ' + t2[3] + ' keer mag, het zijn er ' + spr.mag);\n  }\n}\nconst cm = MODULES.find(m => m.id === 'casussen');\nconst o = cm.ondertitel.match(new RegExp('^([A-Za-z]+) situaties'));\nconsole.log('ondertitel casussenmodule:', cm.ondertitel);\nif (!o || WOORD[o[1].toLowerCase()] !== werk.casussen) fout.push('de ondertitel van de casussenmodule klopt niet met ' + werk.casussen + ' casussen');\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T120",
  "gebied": "data",
  "naam": "elke kader-variant heeft echt styling in css/style.css",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { readFileSync } from 'node:fs';\nimport { MODULES } from './js/cursus.js';\nconst css = readFileSync('css/style.css', 'utf8');\nlet fout = [];\nconst gebruikt = new Map();\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  if (b.type !== 'kader') continue;\n  const p = m.id + '/' + l.id;\n  if (!b.variant || !String(b.variant).trim()) { fout.push(p + ': kader zonder variant'); continue; }\n  gebruikt.set(b.variant, (gebruikt.get(b.variant)||0)+1);\n  if (!b.titel || !String(b.titel).trim()) fout.push(p + ': kader zonder titel');\n  if (!b.inhoud || !String(b.inhoud).trim()) fout.push(p + ': kader zonder inhoud');\n}\nfor (const v of gebruikt.keys()) {\n  const heeft = css.includes('.kader.' + v + ' ') || css.includes('.kader.' + v + '{');\n  console.log('variant', v, '-', gebruikt.get(v) + 'x gebruikt - eigen regel in style.css:', heeft);\n  if (!heeft) fout.push('de kader-variant ' + v + ' heeft geen enkele regel .kader.' + v + ' in css/style.css');\n}\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T121",
  "gebied": "data",
  "naam": "elke opdracht heeft minstens twee stappen, elke prompt tekst en uitleg",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nlet fout = [], opdrachten = 0, prompts = 0, lijsten = 0, vergelijk = 0;\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  const p = m.id + '/' + l.id + ' (' + b.type + ')';\n  if (b.type === 'opdracht') {\n    opdrachten++;\n    if (!Array.isArray(b.stappen) || b.stappen.length < 2) fout.push(p + ' ' + b.titel + ': ' + (b.stappen ? b.stappen.length : 0) + ' stappen, minstens 2 nodig');\n    else if (b.stappen.some(s => !s || !String(s).trim())) fout.push(p + ': lege stap');\n    if (!b.titel || !b.inhoud) fout.push(p + ': titel of inhoud ontbreekt');\n  }\n  if (b.type === 'prompt') {\n    prompts++;\n    if (!b.titel || !String(b.titel).trim()) fout.push(p + ': prompt zonder titel');\n    if (!b.tekst || String(b.tekst).trim().length < 20) fout.push(p + ' ' + b.titel + ': prompttekst ontbreekt of is te kort');\n    if (!b.uitleg || !String(b.uitleg).trim()) fout.push(p + ' ' + b.titel + ': prompt zonder uitleg');\n  }\n  if (b.type === 'lijst') {\n    lijsten++;\n    if (!Array.isArray(b.items) || b.items.length < 2) fout.push(p + ': lijst met minder dan 2 items');\n    else if (b.items.some(i => !i || !String(i).trim())) fout.push(p + ': leeg lijstitem');\n  }\n  if (b.type === 'vergelijk') {\n    vergelijk++;\n    if (!b.zwak || !b.sterk) fout.push(p + ': zwak of sterk ontbreekt');\n    else if (String(b.sterk).length <= String(b.zwak).length) fout.push(p + ': de sterke prompt is niet uitgebreider dan de zwakke');\n  }\n}\nconst stappen = MODULES.flatMap(m => m.lessen).flatMap(l => l.blokken).filter(b => b.type === 'opdracht').map(b => b.stappen.length);\nconsole.log('gecontroleerd: opdrachten', opdrachten, '| prompts', prompts, '| lijsten', lijsten, '| vergelijk', vergelijk);\nconsole.log('kortste opdracht telt', Math.min(...stappen), 'stappen');\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T122",
  "gebied": "data",
  "naam": "de HTML in de velden die ongeëscapeerd naar het scherm gaan, is gebalanceerd",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES } from './js/cursus.js';\nconst TOEGELATEN = new Set(['strong','em','code','br']);\nconst velden = [];\nfor (const m of MODULES) for (const l of m.lessen) for (const b of l.blokken) {\n  const p = m.id + '/' + l.id + '/' + b.type;\n  if (b.type === 'tekst') velden.push([p + '.inhoud', b.inhoud]);\n  if (b.type === 'kader') velden.push([p + '.inhoud', b.inhoud]);\n  if (b.type === 'opdracht') velden.push([p + '.inhoud', b.inhoud]);\n  if (b.type === 'prompt' && b.uitleg) velden.push([p + '.uitleg', b.uitleg]);\n  if (b.type === 'vergelijk' && b.uitleg) velden.push([p + '.uitleg', b.uitleg]);\n  if (b.type === 'lijst') b.items.forEach((i, n) => velden.push([p + '.items[' + n + ']', i]));\n}\nlet fout = [], tags = 0;\nconst re = new RegExp('<[^>]*>', 'g');\nfor (const [naam, tekst] of velden) {\n  const stapel = [];\n  let mm; re.lastIndex = 0;\n  while ((mm = re.exec(tekst)) !== null) {\n    tags++;\n    const rauw = mm[0];\n    const dicht = rauw[1] === '/';\n    const nm = rauw.match(new RegExp('^</?([a-zA-Z]+)'));\n    if (!nm) { fout.push(naam + ': onleesbare tag ' + rauw); continue; }\n    const tag = nm[1].toLowerCase();\n    if (!TOEGELATEN.has(tag)) { fout.push(naam + ': de tag <' + tag + '> is hier niet toegelaten (enkel strong, em, code, br)'); continue; }\n    if (tag === 'br') continue;\n    if (dicht) { if (stapel.pop() !== tag) fout.push(naam + ': </' + tag + '> sluit niets of sluit de verkeerde tag'); }\n    else stapel.push(tag);\n  }\n  if (stapel.length) fout.push(naam + ': niet-gesloten tag(s) <' + stapel.join('>, <') + '>');\n  const los = tekst.split('<').length - 1 - (tekst.match(re)||[]).length;\n  if (los !== 0) fout.push(naam + ': er staat een < zonder bijhorende >');\n}\nconsole.log('velden met HTML gecontroleerd:', velden.length, '- tags geteld:', tags);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T123",
  "gebied": "data",
  "naam": "in de velden die door esc() gaan staat geen enkele HTML-tag",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, WORKSHOPS, SPOREN } from './js/cursus.js';\nimport { GIDS_SECTIES, FAQ_GROEPEN } from './js/gids.js';\nconst velden = [];\nconst zet = (naam, w) => { if (typeof w === 'string') velden.push([naam, w]); else if (Array.isArray(w)) w.forEach((x, i) => zet(naam + '[' + i + ']', x)); };\nfor (const m of MODULES) {\n  zet('module ' + m.id + '.titel', m.titel); zet('module ' + m.id + '.ondertitel', m.ondertitel);\n  zet('module ' + m.id + '.duur', m.duur); zet('module ' + m.id + '.niveau', m.niveau); zet('module ' + m.id + '.doelen', m.doelen);\n  for (const l of m.lessen) {\n    zet('les ' + l.id + '.titel', l.titel);\n    for (const b of l.blokken) {\n      const p = m.id + '/' + l.id + '/' + b.type;\n      if (b.type === 'kader') zet(p + '.titel', b.titel);\n      if (b.type === 'prompt') { zet(p + '.titel', b.titel); zet(p + '.tekst', b.tekst); }\n      if (b.type === 'vergelijk') { zet(p + '.zwak', b.zwak); zet(p + '.sterk', b.sterk); }\n      if (b.type === 'opdracht') { zet(p + '.titel', b.titel); zet(p + '.stappen', b.stappen); }\n      if (b.type === 'casus') { zet(p + '.titel', b.titel); zet(p + '.situatie', b.situatie); zet(p + '.toelichting', b.toelichting); zet(p + '.discussie', b.discussie); }\n      if (b.type === 'quiz') { zet(p + '.vraag', b.vraag); b.opties.forEach((o, i) => { zet(p + '.optie' + i + '.tekst', o.tekst); zet(p + '.optie' + i + '.feedback', o.feedback); }); }\n    }\n  }\n}\nfor (const w of WORKSHOPS) {\n  for (const k of ['titel','ondertitel','doelgroep','voorkennis','groepsgrootte']) zet('workshop ' + w.code + '.' + k, w[k]);\n  zet('workshop ' + w.code + '.benodigdheden', w.benodigdheden); zet('workshop ' + w.code + '.doelen', w.doelen); zet('workshop ' + w.code + '.valkuilen', w.valkuilen);\n  for (const b of w.draaiboek) { zet(w.code + ' blok.titel', b.titel); zet(w.code + ' blok.wat', b.wat); zet(w.code + ' ' + b.titel + '.tips', b.tips || []); }\n}\nfor (const s of SPOREN) { zet('spoor ' + s.id + '.naam', s.naam); zet('spoor ' + s.id + '.tools', s.tools); zet('spoor ' + s.id + '.omschrijving', s.omschrijving); }\nfor (const s of GIDS_SECTIES) { zet('gids ' + s.id + '.titel', s.titel); zet('gids ' + s.id + '.inleiding', s.inleiding); for (const p of s.punten) { zet('gids ' + s.id + '.kop', p.kop); zet('gids ' + s.id + '.tekst', p.tekst); } }\nfor (const g of FAQ_GROEPEN) { zet('faq.titel', g.titel); for (const v of g.vragen) { zet('faq.vraag', v.vraag); zet('faq.antwoord', v.antwoord); zet('faq.tip', v.tip); } }\nlet fout = [];\nconst tagRe = new RegExp('</?[a-zA-Z][^>]*>');\nconst entRe = new RegExp('&[a-zA-Z]+;|&#[0-9]+;');\nfor (const [naam, tekst] of velden) {\n  const t = tekst.match(tagRe);\n  if (t) fout.push(naam + ': bevat de HTML-tag ' + t[0] + ' die letterlijk op het scherm komt');\n  const e = tekst.match(entRe);\n  if (e) fout.push(naam + ': bevat de HTML-entiteit ' + e[0] + ' die letterlijk op het scherm komt');\n}\nconsole.log('geescapeerde velden gecontroleerd:', velden.length);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T124",
  "gebied": "data",
  "naam": "geen leeg veld, geen dubbele spatie, geen spatie vóór een leesteken",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, WORKSHOPS, SPOREN } from './js/cursus.js';\nimport { GIDS_SECTIES, FAQ_GROEPEN } from './js/gids.js';\nlet fout = [], strings = 0;\nfunction loop(waarde, pad) {\n  if (typeof waarde === 'string') {\n    strings++;\n    if (!waarde.trim()) { fout.push(pad + ': leeg veld'); return; }\n    if (waarde !== waarde.trim()) fout.push(pad + ': witruimte aan het begin of het einde -> ' + JSON.stringify(waarde.slice(0, 40)));\n    const d = waarde.indexOf('  ');\n    if (d !== -1) fout.push(pad + ': dubbele spatie -> ' + JSON.stringify(waarde.slice(Math.max(0, d - 25), d + 25)));\n    for (let i = 0; i < waarde.length - 1; i++) {\n      if (waarde[i] !== ' ') continue;\n      const t = waarde[i + 1];\n      if (!'.,!?;:'.includes(t)) continue;\n      if (t === '.' && waarde.slice(i + 1, i + 4) === '...') continue;\n      fout.push(pad + ': spatie voor een ' + t + ' -> ' + JSON.stringify(waarde.slice(Math.max(0, i - 25), i + 25)));\n      break;\n    }\n    return;\n  }\n  if (Array.isArray(waarde)) { waarde.forEach((v, i) => loop(v, pad + '[' + i + ']')); return; }\n  if (waarde && typeof waarde === 'object') for (const [k, v] of Object.entries(waarde)) if (k !== 'spoor') loop(v, pad + '.' + k);\n}\nMODULES.forEach(m => loop(m, 'module ' + m.id));\nWORKSHOPS.forEach(w => loop(w, 'workshop ' + w.code));\nSPOREN.forEach(s => loop(s, 'spoor ' + s.id));\nGIDS_SECTIES.forEach(s => loop(s, 'gids ' + s.id));\nFAQ_GROEPEN.forEach((g, i) => loop(g, 'faq[' + i + ']'));\nconsole.log('tekstvelden gecontroleerd:', strings);\nconsole.log(fout.length ? 'FOUT: ' + fout.join(' | ') : 'OK');\n\""
 },
 {
  "id": "T125",
  "gebied": "consistentie",
  "naam": "geen Nederlands-Nederlandse termen in de zichtbare tekst",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nconst BESTANDEN = [\"js/inhoud.js\",\"js/casussen.js\",\"js/inhoud-vibe.js\",\"js/gids.js\",\"js/workshops.js\",\"js/app.js\",\"index.html\",\"README.md\"];\nconst PATRONEN = [\n  [/\\bdocent(en|e)?\\b/i, \"docent -> leerkracht\"],\n  [/\\bwerkstuk(ken)?\\b/i, \"werkstuk -> taak of opdracht\"],\n  [/\\bgroep\\s*[1-8]\\b/i, \"groep 3-8 -> het derde leerjaar\"],\n  [/\\bbasisschool|\\bbasisonderwijs\\b/i, \"basisschool -> lager onderwijs\"],\n  [/\\bbrugklas\\b/i, \"brugklas -> eerste jaar secundair\"],\n  [/\\bmentor(en)?\\b/i, \"mentor -> titularis of klasleraar\"],\n  [/\\b(havo|vwo|vmbo|mavo)\\b/i, \"Nederlandse studierichting\"],\n  [/\\bschoolleiding\\b/i, \"schoolleiding -> directie\"],\n  [/\\btoetsweek|\\bproefwerk/i, \"toetsweek of proefwerk -> examens\"],\n  [/\\bouderavond(en)?\\b/i, \"ouderavond -> oudercontact\"],\n  [/\\bAVG\\b/, \"AVG -> GDPR\"],\n  [/\\bvakgroep(en)?\\b/i, \"vakgroep -> vakwerkgroep\"],\n  [/\\bleermethode(n)?\\b/i, \"leermethode -> handboek of methode\"],\n  [/\\b(eerste|tweede|derde)jaars\\b/i, \"tweedejaars -> leerling van het tweede jaar\"],\n  [/\\b(boven|onder)bouw\\b/i, \"bovenbouw of onderbouw -> graad\"],\n  [/\\bleerjaar\\s*[0-9]/i, \"leerjaar 6 -> het zesde leerjaar\"],\n  [/\\bcijfers?\\s+(geven|zetten|toekennen|invoeren|krijgen)\\b/i, \"cijfer geven -> punten geven\"],\n  [/\\brapportcijfer|\\bcijferlijst/i, \"cijfer -> punt\"],\n  [/\\bcito\\b|\\beindexamen|\\bintern begeleider|\\bmedezeggenschapsraad|\\bmagister\\b|\\bsomtoday\\b|\\brapportvergadering/i, \"Nederlandse onderwijsterm\"],\n];\nlet fout = 0;\nfor (const b of BESTANDEN) {\n  fs.readFileSync(b, \"utf8\").split(/\\r?\\n/).forEach((regel, i) => {\n    if (/^\\s*(\\/\\/|\\*|<!--)/.test(regel)) return;\n    if (/vibecodenvoordocenten/.test(regel)) return;\n    for (const [re, uitleg] of PATRONEN) {\n      const m = regel.match(re);\n      if (m) { console.log(\"FOUT \" + b + \":\" + (i + 1) + \"  \" + m[0] + \"   (\" + uitleg + \")\"); fout++; }\n    }\n  });\n}\nconsole.log(fout ? \"FOUT: \" + fout + \" Nederlands-Nederlandse term(en) in de zichtbare tekst\" : \"OK\");\n'"
 },
 {
  "id": "T126",
  "gebied": "consistentie",
  "naam": "spoor A blijft tool-neutraal: nooit één assistent alleen buiten een tool-kader",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport { MODULES_AI } from \"./js/inhoud.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nimport { GIDS_SECTIES, FAQ_GROEPEN } from \"./js/gids.js\";\nimport { WORKSHOPS } from \"./js/workshops.js\";\nconst treffers = [];\nfunction kijk(pad, tekst, toolKader) {\n  if (typeof tekst !== \"string\") return;\n  const gpt = /ChatGPT/.test(tekst), cl = /Claude/.test(tekst);\n  if (!gpt && !cl) return;\n  const pos = gpt ? tekst.indexOf(\"ChatGPT\") : tekst.indexOf(\"Claude\");\n  treffers.push({ pad, beide: gpt && cl, toolKader, uitsnede: tekst.slice(Math.max(0, pos - 60), pos + 90).replace(/\\s+/g, \" \") });\n}\nfor (const m of [...MODULES_AI, MODULE_CASUSSEN])\n  for (const l of m.lessen)\n    for (const [bi, b] of l.blokken.entries()) {\n      const toolKader = b.type === \"kader\" && b.variant === \"tool\";\n      for (const [veld, waarde] of Object.entries(b)) {\n        if (Array.isArray(waarde)) waarde.forEach((v, i) => {\n          if (typeof v === \"string\") kijk(m.id + \"/\" + l.id + \" blok\" + bi + \".\" + veld + \"[\" + i + \"]\", v, toolKader);\n          else if (v && typeof v === \"object\") for (const [k2, v2] of Object.entries(v)) kijk(m.id + \"/\" + l.id + \" blok\" + bi + \".\" + veld + \"[\" + i + \"].\" + k2, v2, toolKader);\n        });\n        else kijk(m.id + \"/\" + l.id + \" blok\" + bi + \".\" + veld, waarde, toolKader);\n      }\n    }\nfor (const s of GIDS_SECTIES) { kijk(\"gids/\" + s.id + \".inleiding\", s.inleiding, false); s.punten.forEach((p, i) => { kijk(\"gids/\" + s.id + \".punt\" + i + \".kop\", p.kop, false); kijk(\"gids/\" + s.id + \".punt\" + i + \".tekst\", p.tekst, false); }); }\nfor (const g of FAQ_GROEPEN) g.vragen.forEach((v, i) => { kijk(\"faq/\" + g.titel + \"[\" + i + \"].vraag\", v.vraag, false); kijk(\"faq/\" + g.titel + \"[\" + i + \"].antwoord\", v.antwoord, false); kijk(\"faq/\" + g.titel + \"[\" + i + \"].tip\", v.tip, false); });\nfor (const w of WORKSHOPS.filter(w => w.spoor === \"ai\")) {\n  for (const veld of [\"titel\", \"ondertitel\", \"doelgroep\", \"voorkennis\", \"groepsgrootte\"]) kijk(w.code + \".\" + veld, w[veld], false);\n  w.benodigdheden.forEach((b, i) => kijk(w.code + \".benodigd[\" + i + \"]\", b, false));\n  w.doelen.forEach((d, i) => kijk(w.code + \".doel[\" + i + \"]\", d, false));\n  w.valkuilen.forEach((v, i) => kijk(w.code + \".valkuil[\" + i + \"]\", v, false));\n  w.draaiboek.forEach((b, i) => { kijk(w.code + \".blok\" + i + \".titel\", b.titel, false); kijk(w.code + \".blok\" + i + \".wat\", b.wat, false); (b.tips || []).forEach((t, j) => kijk(w.code + \".blok\" + i + \".tip\" + j, t, false)); });\n}\nconst eenzijdig = treffers.filter(t => !t.beide && !t.toolKader);\nconsole.log(\"vermeldingen in spoor A: \" + treffers.length + \" (beide genoemd: \" + treffers.filter(t => t.beide).length + \", in een kader met variant tool: \" + treffers.filter(t => t.toolKader).length + \")\");\nfor (const t of eenzijdig) console.log(\"  EENZIJDIG \" + t.pad + \" :: ...\" + t.uitsnede + \"...\");\nconsole.log(eenzijdig.length ? \"FOUT: \" + eenzijdig.length + \" plaats(en) noemen maar een van beide tools buiten een tool-kader\" : \"OK\");\n'"
 },
 {
  "id": "T127",
  "gebied": "consistentie",
  "naam": "tellingen in CLAUDE.md en README kloppen met de data",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nimport { MODULES_AI } from \"./js/inhoud.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nimport { MODULES_VIBE } from \"./js/inhoud-vibe.js\";\nimport { WORKSHOPS } from \"./js/workshops.js\";\nimport { FAQ_GROEPEN } from \"./js/gids.js\";\nconst modules = [...MODULES_AI, MODULE_CASUSSEN, ...MODULES_VIBE];\nconst lessen = modules.flatMap(m => m.lessen);\nconst blokken = lessen.flatMap(l => l.blokken);\nconst perType = {};\nfor (const b of blokken) perType[b.type] = (perType[b.type] || 0) + 1;\nconst faq = FAQ_GROEPEN.reduce((s, g) => s + g.vragen.length, 0);\nconsole.log(\"data: \" + modules.length + \" modules, \" + lessen.length + \" lessen, \" + blokken.length + \" blokken, \" + WORKSHOPS.length + \" workshops, \" + faq + \" FAQ-vragen; per type \" + JSON.stringify(perType));\nconst claude = fs.readFileSync(\"CLAUDE.md\", \"utf8\");\nconst readme = fs.readFileSync(\"README.md\", \"utf8\");\nlet fout = 0;\nconst eis = (bron, tekst, re, verwacht, wat) => { const m = tekst.match(re); if (!m) { console.log(\"FOUT \" + bron + \": geen getal gevonden voor \" + wat); fout++; return; } if (Number(m[1]) !== verwacht) { console.log(\"FOUT \" + bron + \": \" + wat + \" staat als \" + m[1] + \", de data zegt \" + verwacht); fout++; } else console.log(\"ok   \" + bron + \": \" + wat + \" = \" + m[1]); };\neis(\"CLAUDE.md\", claude, /([0-9]+) modules,/, modules.length, \"modules\");\neis(\"CLAUDE.md\", claude, /([0-9]+) lessen,/, lessen.length, \"lessen\");\neis(\"CLAUDE.md\", claude, /([0-9]+) inhoudsblokken/, blokken.length, \"inhoudsblokken\");\neis(\"CLAUDE.md\", claude, /([0-9]+) casussen voor het groepswerk/, perType.casus, \"casussen\");\neis(\"CLAUDE.md\", claude, /Begeleidersgids met ([0-9]+) lastige vragen/, faq, \"FAQ-vragen\");\neis(\"CLAUDE.md\", claude, /de ([0-9]+) lastige vragen/, faq, \"FAQ in de bestandenlijst\");\nconst opsomming = claude.match(/inhoudsblokken \\(([^)]*)\\)/);\nif (!opsomming) { console.log(\"FOUT CLAUDE.md: geen opsomming per blok-type achter het totaal\"); fout++; }\nelse {\n  const paren = [...opsomming[1].matchAll(/([a-z]+)\\s+([0-9]+)/g)].map(m => [m[1], Number(m[2])]);\n  const gezien = new Set();\n  for (const [type, n] of paren) { gezien.add(type);\n    if (!(type in perType)) { console.log(\"FOUT CLAUDE.md: telt blok-type \" + type + \" dat niet in de data bestaat\"); fout++; }\n    else if (perType[type] !== n) { console.log(\"FOUT CLAUDE.md: \" + type + \" staat als \" + n + \", de data telt \" + perType[type]); fout++; }\n    else console.log(\"ok   CLAUDE.md: \" + type + \" = \" + n); }\n  for (const type of Object.keys(perType)) if (!gezien.has(type)) { console.log(\"FOUT CLAUDE.md: blok-type \" + type + \" ontbreekt in de opsomming\"); fout++; }\n  const som = paren.reduce((s, p) => s + p[1], 0);\n  if (som !== blokken.length) { console.log(\"FOUT CLAUDE.md: de types tellen op tot \" + som + \" in plaats van \" + blokken.length); fout++; }\n}\nfor (const [bron, tekst] of [[\"CLAUDE.md\", claude], [\"README.md\", readme]]) { if (!/[Zz]es workshops/.test(tekst) || WORKSHOPS.length !== 6) { console.log(\"FOUT \" + bron + \": zegt zes workshops, de data telt \" + WORKSHOPS.length); fout++; } else console.log(\"ok   \" + bron + \": zes workshops = \" + WORKSHOPS.length); }\nif (!/[Vv]eertien/.test(MODULE_CASUSSEN.ondertitel) || perType.casus !== 14) { console.log(\"FOUT: de ondertitel van de casussenmodule klopt niet met \" + perType.casus + \" casussen: \" + MODULE_CASUSSEN.ondertitel); fout++; } else console.log(\"ok   casussenmodule: ondertitel zegt veertien, data telt \" + perType.casus);\nconsole.log(fout ? \"FOUT: \" + fout + \" telling(en) in de documentatie kloppen niet met de data\" : \"OK\");\n'"
 },
 {
  "id": "T128",
  "gebied": "consistentie",
  "naam": "blok-types en kadervarianten: README, app.js, style.css en de inhoud zeggen hetzelfde",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nimport { MODULES_AI } from \"./js/inhoud.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nimport { MODULES_VIBE } from \"./js/inhoud-vibe.js\";\nconst blokken = [...MODULES_AI, MODULE_CASUSSEN, ...MODULES_VIBE].flatMap(m => m.lessen.flatMap(l => l.blokken));\nconst readme = fs.readFileSync(\"README.md\", \"utf8\").replace(/\\r/g, \"\");\nconst app = fs.readFileSync(\"js/app.js\", \"utf8\");\nconst css = fs.readFileSync(\"css/style.css\", \"utf8\");\nconst tabel = readme.match(/\\| Type \\| Waarvoor \\|[\\s\\S]*?\\n\\n/);\nconst readmeTypes = tabel ? [...tabel[0].matchAll(/^\\| \\x60([a-z]+)\\x60 \\|/gm)].map(m => m[1]) : [];\nconst appTypes = [...new Set([...app.matchAll(/case .([a-z]+).:/g)].map(m => m[1]))];\nconst dataTypes = [...new Set(blokken.map(b => b.type))];\nconsole.log(\"README-tabel  : \" + readmeTypes.join(\", \"));\nconsole.log(\"cases app.js  : \" + appTypes.join(\", \"));\nconsole.log(\"in de inhoud  : \" + dataTypes.join(\", \"));\nlet fout = 0;\nfor (const t of readmeTypes) if (!appTypes.includes(t)) { console.log(\"FOUT: README noemt blok-type \" + t + \", app.js heeft er geen case voor\"); fout++; }\nfor (const t of appTypes) if (!readmeTypes.includes(t)) { console.log(\"FOUT: app.js kent blok-type \" + t + \", README noemt het niet\"); fout++; }\nfor (const t of dataTypes) if (!appTypes.includes(t)) { console.log(\"FOUT: de inhoud gebruikt blok-type \" + t + \", app.js kent het niet\"); fout++; }\nconst varRegel = readme.match(/Varianten: ([^|]+)\\|/);\nconst readmeVar = varRegel ? [...varRegel[1].matchAll(/\\x60([a-z]+)\\x60/g)].map(m => m[1]) : [];\nconst cssVar = [...new Set([...css.matchAll(/\\.kader\\.([a-z]+)/g)].map(m => m[1]))];\nconst dataVar = [...new Set(blokken.filter(b => b.type === \"kader\").map(b => b.variant))];\nconsole.log(\"README varianten : \" + readmeVar.join(\", \"));\nconsole.log(\"style.css        : \" + cssVar.join(\", \"));\nconsole.log(\"in de inhoud     : \" + dataVar.join(\", \"));\nfor (const v of readmeVar) if (!cssVar.includes(v)) { console.log(\"FOUT: README noemt kadervariant \" + v + \", style.css stijlt hem niet\"); fout++; }\nfor (const v of cssVar) if (!readmeVar.includes(v)) { console.log(\"FOUT: style.css stijlt kadervariant \" + v + \", README noemt hem niet\"); fout++; }\nfor (const v of dataVar) if (!readmeVar.includes(v)) { console.log(\"FOUT: de inhoud gebruikt kadervariant \" + v + \", README noemt hem niet\"); fout++; }\nfor (const v of dataVar) if (!cssVar.includes(v)) { console.log(\"FOUT: de inhoud gebruikt kadervariant \" + v + \" zonder styling\"); fout++; }\nconsole.log(fout ? \"FOUT: \" + fout + \" verschil(len) tussen README, app.js, style.css en de inhoud\" : \"OK\");\n'"
 },
 {
  "id": "T129",
  "gebied": "consistentie",
  "naam": "de bestandenlijst in README en CLAUDE.md klopt met de repo",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nconst echt = new Set([\n  ...fs.readdirSync(\"js\").map(f => \"js/\" + f),\n  ...fs.readdirSync(\"css\").map(f => \"css/\" + f),\n  ...fs.readdirSync(\"assets\").map(f => \"assets/\" + f),\n  \"index.html\",\n]);\nlet fout = 0;\nfor (const bron of [\"README.md\", \"CLAUDE.md\"]) {\n  const regels = fs.readFileSync(bron, \"utf8\").split(/\\r?\\n/);\n  const genoemd = new Map();\n  regels.forEach((regel, i) => {\n    for (const m of regel.matchAll(/(?:js|css|assets)\\/[A-Za-z0-9_-]+\\.[a-z]+|\\bindex\\.html\\b/g))\n      if (!genoemd.has(m[0])) genoemd.set(m[0], i + 1);\n  });\n  console.log(bron + \" noemt \" + genoemd.size + \" bestanden: \" + [...genoemd.keys()].join(\", \"));\n  for (const [p, regel] of genoemd) if (!echt.has(p)) { console.log(\"FOUT \" + bron + \":\" + regel + \" noemt \" + p + \", dat bestaat niet in de repo\"); fout++; }\n  for (const p of echt) { if (!/\\.(js|css)$/.test(p)) continue; if (!genoemd.has(p)) { console.log(\"FOUT \" + bron + \": \" + p + \" bestaat maar wordt nergens genoemd\"); fout++; } }\n}\nconsole.log(\"echte bestanden: \" + [...echt].join(\", \"));\nconsole.log(fout ? \"FOUT: \" + fout + \" verschil(len) tussen documentatie en repo\" : \"OK\");\n'"
 },
 {
  "id": "T130",
  "gebied": "consistentie",
  "naam": "typografie: rechte aanhalingstekens, geen dubbele leestekens, gepaarde HTML",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport { MODULES_AI } from \"./js/inhoud.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nimport { MODULES_VIBE } from \"./js/inhoud-vibe.js\";\nimport { WORKSHOPS, SPOREN } from \"./js/workshops.js\";\nimport { GIDS_SECTIES, FAQ_GROEPEN } from \"./js/gids.js\";\nconst teksten = [];\nfunction loop(pad, x) {\n  if (typeof x === \"string\") { teksten.push([pad, x]); return; }\n  if (Array.isArray(x)) { x.forEach((v, i) => loop(pad + \"[\" + i + \"]\", v)); return; }\n  if (x && typeof x === \"object\") for (const [k, v] of Object.entries(x)) loop(pad + \".\" + k, v);\n}\nloop(\"inhoud\", MODULES_AI); loop(\"casussen\", MODULE_CASUSSEN); loop(\"vibe\", MODULES_VIBE);\nloop(\"workshops\", WORKSHOPS); loop(\"sporen\", SPOREN); loop(\"gids\", GIDS_SECTIES); loop(\"faq\", FAQ_GROEPEN);\nconst controles = [\n  [\"kromme aanhalingstekens\", /[“”‘’]/],\n  [\"dubbele spatie\", /[^\\n] {2,}[^\\n]/],\n  [\"spatie voor een leesteken\", / [,.;:!?](\\s|$)/],\n  [\"dubbel leesteken\", /[,;:]{2}|(?<!\\.)\\.\\.(?!\\.)|!!|\\?\\?|,\\.|\\.,/],\n  [\"dubbele koppelstreep in plaats van een gedachtestreepje\", /--/],\n  [\"eindigt op een komma of puntkomma\", /[,;]\\s*$/],\n  [\"eindigt op een voegwoord (halve zin)\", /\\b(en|of|maar|want|omdat|dat|de|het|een|met|voor|van)\\s*$/i],\n];\nlet fout = 0;\nfor (const [pad, t] of teksten) {\n  const kaal = t.replace(/<[^>]*>/g, \"\");\n  for (const [naam, re] of controles) if (re.test(kaal)) { console.log(\"FOUT \" + naam + \" @ \" + pad + \" :: \" + kaal.slice(0, 110)); fout++; }\n  if ((kaal.match(/\"/g) || []).length % 2) { console.log(\"FOUT ongepaard aanhalingsteken @ \" + pad + \" :: \" + kaal.slice(0, 140)); fout++; }\n  if ((kaal.match(/\\[/g) || []).length !== (kaal.match(/\\]/g) || []).length) { console.log(\"FOUT ongepaarde blokhaak @ \" + pad); fout++; }\n  if ((kaal.match(/\\(/g) || []).length !== (kaal.match(/\\)/g) || []).length) { console.log(\"FOUT ongepaard haakje @ \" + pad); fout++; }\n  const open = {};\n  for (const [, sluit, naam] of t.matchAll(/<(\\/?)([a-z]+)[^>]*>/g)) {\n    if (![\"strong\", \"em\", \"code\", \"br\"].includes(naam)) { console.log(\"FOUT onverwachte HTML-tag <\" + naam + \"> @ \" + pad); fout++; }\n    if (naam === \"br\") continue;\n    open[naam] = (open[naam] || 0) + (sluit ? -1 : 1);\n  }\n  for (const [naam, saldo] of Object.entries(open)) if (saldo !== 0) { console.log(\"FOUT ongepaarde <\" + naam + \"> (saldo \" + saldo + \") @ \" + pad + \" :: \" + kaal.slice(0, 110)); fout++; }\n}\nconsole.log(\"nagekeken teksten: \" + teksten.length);\nconsole.log(fout ? \"FOUT: \" + fout + \" typografische onregelmatigheid(heden)\" : \"OK\");\n'"
 },
 {
  "id": "T131",
  "gebied": "consistentie",
  "naam": "kruisverwijzingen tussen casussen wijzen de goede kant op",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nconst lijst = [];\nMODULE_CASUSSEN.lessen.forEach((les, li) => les.blokken.filter(b => b.type === \"casus\").forEach(b => lijst.push({ nr: lijst.length + 1, reeks: li + 1, titel: b.titel, b })));\nfor (const c of lijst) {\n  c.namen = new Set();\n  for (const m of c.b.situatie.matchAll(/(?:[Jj]uf|[Mm]eester|[Mm]eneer|[Mm]evrouw) ([A-Z][a-z]{1,11})/g)) c.namen.add(m[1]);\n}\nconst bevatWoord = (hooiberg, woord) => new RegExp(\"(^|[^A-Za-z])\" + woord + \"([^A-Za-z]|$)\").test(hooiberg);\nlet fout = 0, gezien = 0;\nconst VOORUIT = /\\b(hierna|verderop|hieronder|volgende reeks)\\b/i;\nconst ACHTERUIT = /\\b(hiervoor|hierboven|eerder besproken|vorige reeks)\\b/i;\nfor (const c of lijst) {\n  const tekst = ((c.b.toelichting || \"\") + \" \" + (c.b.discussie || \"\")).replace(/\\s+/g, \" \");\n  for (const zin of tekst.split(/(?<=[.?!]) /)) {\n    for (const d of lijst) {\n      if (d === c) continue;\n      if (![...d.namen].some(n => bevatWoord(zin, n)) && !zin.includes(d.titel)) continue;\n      gezien++;\n      let ok = true; const waarom = [];\n      if (VOORUIT.test(zin) && d.nr < c.nr) { ok = false; waarom.push(\"zegt hierna/verderop, maar die casus staat ervoor\"); }\n      if (ACHTERUIT.test(zin) && d.nr > c.nr) { ok = false; waarom.push(\"zegt hiervoor/hierboven, maar die casus staat erna\"); }\n      if (/eerste reeks/i.test(zin) && d.reeks !== 1) { ok = false; waarom.push(\"zegt eerste reeks, maar die casus staat in reeks \" + d.reeks); }\n      if (/tweede reeks/i.test(zin) && d.reeks !== 2) { ok = false; waarom.push(\"zegt tweede reeks, maar die casus staat in reeks \" + d.reeks); }\n      console.log((ok ? \"ok   \" : \"FOUT \") + \"casus \" + c.nr + \" -> casus \" + d.nr + \" (\" + d.titel + \", reeks \" + d.reeks + \")\" + (ok ? \"\" : \" :: \" + waarom.join(\"; \")));\n      console.log(\"       \" + zin.slice(0, 150));\n      if (!ok) fout++;\n    }\n  }\n  for (const m of tekst.matchAll(/\\bcasus (?:nummer )?([0-9]+|eerste|tweede|derde|vierde|vijfde|zesde|zevende|achtste|negende|tiende|elfde|twaalfde|dertiende|veertiende)\\b/gi)) { console.log(\"FOUT casus \" + c.nr + \" verwijst met een nummer in plaats van met een titel: \" + m[0]); fout++; }\n}\nconsole.log(\"kruisverwijzingen: \" + gezien);\nconsole.log(fout ? \"FOUT: \" + fout + \" verwijzing(en) kloppen niet\" : \"OK\");\n'"
 },
 {
  "id": "T132",
  "gebied": "consistentie",
  "naam": "geen naam die voor twee verschillende personen staat",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport { MODULES_AI } from \"./js/inhoud.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nimport { MODULES_VIBE } from \"./js/inhoud-vibe.js\";\nimport { WORKSHOPS } from \"./js/workshops.js\";\nimport { GIDS_SECTIES, FAQ_GROEPEN } from \"./js/gids.js\";\nconst eenheden = [];\nfunction verzamel(bron, obj) { const uit = []; (function loop(x) { if (typeof x === \"string\") { uit.push(x); return; } if (Array.isArray(x)) { x.forEach(loop); return; } if (x && typeof x === \"object\") Object.values(x).forEach(loop); })(obj); eenheden.push({ bron, tekst: uit.join(\" ¶ \").replace(/<[^>]*>/g, \" \").replace(/[ \\t]*[\\r\\n]+[ \\t]*/g, \" ¶ \").replace(/[ \\t]{2,}/g, \" \") }); }\nfor (const m of MODULES_AI) for (const l of m.lessen) verzamel(\"module \" + m.id + \"/\" + l.id, l);\nfor (const l of MODULE_CASUSSEN.lessen) for (const b of l.blokken) if (b.type === \"casus\") verzamel(\"casus: \" + b.titel, b);\nfor (const m of MODULES_VIBE) for (const l of m.lessen) verzamel(\"module \" + m.id + \"/\" + l.id, l);\nfor (const w of WORKSHOPS) verzamel(\"workshop \" + w.code, w);\nfor (const s of GIDS_SECTIES) verzamel(\"gids \" + s.id, s);\nfor (const g of FAQ_GROEPEN) g.vragen.forEach((v, i) => verzamel(\"faq \" + g.titel + \" #\" + (i + 1), v));\nconst alles = eenheden.map(e => e.tekst).join(\" \");\nconst STOP = new Set([\"Nederlands\",\"Nederlandse\",\"Frans\",\"Engels\",\"Duits\",\"Vlaams\",\"Vlaamse\",\"Vlaanderen\",\"Europa\",\"Europese\",\"Smartschool\",\"KlasCement\",\"GitHub\",\"Netlify\",\"Vercel\",\"Supabase\",\"OpenRouter\",\"Microsoft\",\"Google\",\"Chrome\",\"Claude\",\"ChatGPT\",\"Word\",\"Drive\",\"Pages\",\"Brugse\",\"Metten\",\"Wereldoorlog\",\"Guldensporenslag\"]);\nfor (const m of [...MODULES_AI, MODULE_CASUSSEN, ...MODULES_VIBE]) { for (const w of (m.titel + \" \" + m.ondertitel).match(/[A-Z][a-z]+/g) || []) STOP.add(w); for (const l of m.lessen) for (const w of l.titel.match(/[A-Z][a-z]+/g) || []) STOP.add(w); }\nfor (const w of WORKSHOPS) for (const x of (w.titel + \" \" + w.ondertitel).match(/[A-Z][a-z]+/g) || []) STOP.add(x);\nconst VERWIJS = /\\b(hierna|hiervoor|hierboven|verderop|eerste reeks|tweede reeks|deze casus|die casus|zoals bij|net als bij|variant van bij)\\b/i;\nconst perNaam = new Map();\nfor (const e of eenheden) {\n  const namen = new Set();\n  for (const m of e.tekst.matchAll(/(?:[Jj]uf|[Mm]eester|[Mm]eneer|[Mm]evrouw) ([A-Z][a-z]{1,11})(?![A-Za-z])/g)) namen.add(m[1]);\n  for (const m of e.tekst.matchAll(/[a-zà-ÿ],? ([A-Z][a-z]{2,11})(?![A-Za-z])/g)) namen.add(m[1]);\n  for (const n of namen) {\n    if (STOP.has(n)) continue;\n    if (new RegExp(\"(^|[^A-Za-z])\" + n.toLowerCase() + \"([^A-Za-z]|$)\").test(alles)) continue;\n    const zinnen = e.tekst.split(/(?<=[.?!¶]) /).filter(z => new RegExp(\"(^|[^A-Za-z])\" + n + \"([^A-Za-z]|$)\").test(z));\n    if (!perNaam.has(n)) perNaam.set(n, []);\n    perNaam.get(n).push({ bron: e.bron, verwijzing: zinnen.some(z => VERWIJS.test(z)), voorbeeld: (zinnen[0] || \"\").slice(0, 130) });\n  }\n}\nlet fout = 0;\nfor (const [naam, plekken] of [...perNaam].sort()) {\n  const eigen = plekken.filter(p => !p.verwijzing);\n  const slecht = eigen.length > 1;\n  console.log((slecht ? \"FOUT \" : \"ok   \") + naam.padEnd(10) + \" \" + plekken.map(p => p.bron + (p.verwijzing ? \" (kruisverwijzing)\" : \"\")).join(\"  |  \"));\n  if (slecht) { fout++; for (const p of eigen) console.log(\"        \" + p.bron + \" :: \" + p.voorbeeld); }\n}\nconsole.log(fout ? \"FOUT: \" + fout + \" naam/namen staan voor twee verschillende personen\" : \"OK\");\n'"
 },
 {
  "id": "T133",
  "gebied": "consistentie",
  "naam": "de begeleidersgids klopt met de draaiboeken en met de app",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nimport { GIDS_SECTIES } from \"./js/gids.js\";\nimport { WORKSHOPS } from \"./js/workshops.js\";\nimport { MODULE_CASUSSEN } from \"./js/casussen.js\";\nconst app = fs.readFileSync(\"js/app.js\", \"utf8\");\nconst gids = GIDS_SECTIES.map(s => s.inleiding + \" \" + s.punten.map(p => p.kop + \" \" + p.tekst).join(\" \")).join(\" \");\nconst vindW = c => WORKSHOPS.find(w => w.code === c);\nlet fout = 0, gecheckt = 0;\nconst meld = (ok, wat) => { console.log((ok ? \"ok   \" : \"FOUT \") + wat); if (!ok) fout++; };\nfor (const m of gids.matchAll(/((?:[AB][123])(?: en [AB][123])*) op ([0-9]+) tot ([0-9]+)/g)) for (const code of m[1].split(\" en \")) { gecheckt++; const w = vindW(code); meld(!!w && w.groepsgrootte.startsWith(m[2] + \" tot \" + m[3]), \"gids zegt \" + code + \": \" + m[2] + \" tot \" + m[3] + \"  |  draaiboek: \" + (w ? w.groepsgrootte.split(\".\")[0] : \"onbekende code\")); }\nfor (const m of gids.matchAll(/spoor A, dat ([0-9]+) tot ([0-9]+) deelnemers/g)) for (const code of [\"A1\", \"A2\"]) { gecheckt++; meld(vindW(code).groepsgrootte.startsWith(m[1] + \" tot \" + m[2]), \"gids zegt spoor A: \" + m[1] + \" tot \" + m[2] + \"  |  \" + code + \": \" + vindW(code).groepsgrootte.split(\".\")[0]); }\nfor (const m of gids.matchAll(/bij ([AB][123]) zelfs ([0-9]+)/g)) { gecheckt++; meld(vindW(m[1]).groepsgrootte.includes(\"tot \" + m[2]), \"gids zegt \" + m[1] + \" zelfs \" + m[2] + \"  |  draaiboek: \" + vindW(m[1]).groepsgrootte.split(\".\")[0]); }\nmeld(gecheckt >= 6, \"de gids noemt \" + gecheckt + \" groepsgroottes (minstens 6 verwacht)\");\nconst blokTitels = c => vindW(c).draaiboek.map(b => b.titel);\nmeld(blokTitels(\"A2\").includes(\"Feedback: waar ligt de grens?\"), \"het A2-blok dat de gids bij naam noemt bestaat\");\nmeld(/leerlinggegevens/i.test(blokTitels(\"B2\").join(\" \")), \"B2 heeft een blok over leerlinggegevens: \" + blokTitels(\"B2\").filter(t => /gegevens/i.test(t)).join(\", \"));\nmeld(/sleutel/i.test(blokTitels(\"B3\").join(\" \")), \"B3 heeft een blok over sleutels: \" + blokTitels(\"B3\").filter(t => /sleutel/i.test(t)).join(\", \"));\nfor (const etiket of [\"Uitleg\", \"Zelf doen\", \"Gesprek\"]) meld(app.includes(\": \\x27\" + etiket + \"\\x27\"), \"etiket \\x27\" + etiket + \"\\x27 dat de gids citeert staat in SOORT_LABEL van app.js\");\nfor (const knop of [\"Draaiboek afdrukken\", \"Start sessie\"]) meld(app.includes(knop), \"knop \\x27\" + knop + \"\\x27 die de gids citeert staat in app.js\");\nconst casussen = MODULE_CASUSSEN.lessen.flatMap(l => l.blokken.filter(b => b.type === \"casus\"));\nconst telling = { mag: 0, \"mag-niet\": 0, \"hangt-ervan-af\": 0 };\nfor (const c of casussen) telling[c.oordeel]++;\nconst woord = { 1: \"een\", 2: \"twee\", 3: \"drie\", 4: \"vier\", 5: \"vijf\", 6: \"zes\", 7: \"zeven\", 8: \"acht\", 9: \"negen\", 10: \"tien\", 12: \"twaalf\", 14: \"veertien\", 15: \"vijftien\" };\nconst tips = vindW(\"A3\").draaiboek.flatMap(b => b.tips || []).join(\" \");\nmeld(new RegExp(\"de \" + (woord[casussen.length] || casussen.length) + \" casussen\").test(tips), \"A3-tip zegt \\x27de \" + (woord[casussen.length] || casussen.length) + \" casussen\\x27  |  data: \" + casussen.length);\nconst verdeling = tips.match(/er zijn er ([a-z]+), naast ([a-z]+) keer \"mag niet\" en ([a-z]+) keer \"mag\"/);\nif (!verdeling) meld(false, \"de A3-tip beschrijft de verdeling mag / mag niet / hangt ervan af niet meer in de verwachte vorm\");\nelse { meld(verdeling[1] === woord[telling[\"hangt-ervan-af\"]], \"A3-tip: hangt ervan af = \" + verdeling[1] + \"  |  data: \" + telling[\"hangt-ervan-af\"]); meld(verdeling[2] === woord[telling[\"mag-niet\"]], \"A3-tip: mag niet = \" + verdeling[2] + \"  |  data: \" + telling[\"mag-niet\"]); meld(verdeling[3] === woord[telling[\"mag\"]], \"A3-tip: mag = \" + verdeling[3] + \"  |  data: \" + telling[\"mag\"]); }\nconsole.log(fout ? \"FOUT: \" + fout + \" claim(s) in de begeleidersgids of de A3-tips kloppen niet met de data\" : \"OK\");\n'"
 },
 {
  "id": "T134",
  "gebied": "consistentie",
  "naam": "de gedocumenteerde routes en de router in app.js komen overeen",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nconst app = fs.readFileSync(\"js/app.js\", \"utf8\").replace(/\\r/g, \"\");\nconst readme = fs.readFileSync(\"README.md\", \"utf8\").replace(/\\r/g, \"\");\nconst routeBlok = app.match(/function route\\(\\)[\\s\\S]*?\\n\\}/)[0];\nconst appRoutes = new Set([...routeBlok.matchAll(/delen\\[0\\] === .([a-z]+)./g)].map(m => m[1]));\nappRoutes.add(\"\");\nconst tabel = readme.match(/\\| Route \\| Wat \\| Voor wie \\|[\\s\\S]*?\\n\\n/);\nconst readmeRoutes = tabel ? [...tabel[0].matchAll(/^\\| \\x60#\\/([a-z]*)/gm)].map(m => m[1]) : [];\nconsole.log(\"README documenteert : \" + readmeRoutes.map(r => \"#/\" + r).join(\", \"));\nconsole.log(\"router in app.js    : \" + [...appRoutes].map(r => \"#/\" + r).join(\", \"));\nlet fout = 0;\nif (!readmeRoutes.length) { console.log(\"FOUT: de routetabel in README is niet gevonden\"); fout++; }\nfor (const r of readmeRoutes) if (!appRoutes.has(r)) { console.log(\"FOUT: README documenteert #/\" + r + \", de router kent die niet -> Niet gevonden\"); fout++; }\nfor (const r of appRoutes) if (!readmeRoutes.includes(r)) { console.log(\"FOUT: de router kent #/\" + r + \", README documenteert die niet\"); fout++; }\nconst hrefs = [...new Set([...app.matchAll(/href=\"#\\/([a-z]*)/g)].map(m => m[1]))];\nconsole.log(\"links in app.js     : \" + hrefs.map(r => \"#/\" + r).join(\", \"));\nfor (const h of hrefs) if (!appRoutes.has(h)) { console.log(\"FOUT: app.js linkt naar #/\" + h + \", de router kent dat pad niet\"); fout++; }\nconst metId = [...readme.matchAll(/^\\| \\x60#\\/([a-z]+)\\/<id>\\x60/gm)].map(m => m[1]);\nconsole.log(\"routes met <id>     : \" + metId.join(\", \"));\nfor (const r of [\"workshop\", \"module\", \"bundel\"]) {\n  if (!new RegExp(\"naam: .{1}\" + r + \".{1}, id:\").test(routeBlok)) { console.log(\"FOUT: route \" + r + \" geeft geen id door in route()\"); fout++; }\n  if (!metId.includes(r)) { console.log(\"FOUT: README beschrijft #/\" + r + \" niet als route met <id>\"); fout++; }\n}\nconsole.log(fout ? \"FOUT: \" + fout + \" verschil(len) tussen de gedocumenteerde routes en de router\" : \"OK\");\n'"
 },
 {
  "id": "T135",
  "gebied": "consistentie",
  "naam": "de beschrijving van de deelnemersbundel noemt alles wat er intussen in zit",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e '\nimport fs from \"node:fs\";\nimport { GIDS_SECTIES } from \"./js/gids.js\";\nconst app = fs.readFileSync(\"js/app.js\", \"utf8\").replace(/\\r/g, \"\");\nconst bundel = app.match(/function toonBundel\\(w\\)[\\s\\S]*?\\n\\}/)[0];\nconst types = [...new Set([...bundel.matchAll(/blokkenVanType\\(modules, .([a-z]+)./g)].map(m => m[1]))];\nconsole.log(\"de bundel haalt deze blok-types op: \" + types.join(\", \"));\nconst stam = { prompt: /prompt/i, opdracht: /opdracht/i, casus: /casus/i, kader: /kader/i, quiz: /quiz/i, vergelijk: /vergelijk/i, lijst: /lijst/i, tekst: /tekst/i };\nconst passages = [];\nconst readme = fs.readFileSync(\"README.md\", \"utf8\").replace(/[\\r\\n]/g, \" \");\nfor (const zin of readme.split(/(?<=[.!?]) /)) if (/bundel/i.test(zin) && /doelen/i.test(zin)) passages.push([\"README.md\", zin.replace(/\\s+/g, \" \").trim()]);\nfor (const s of GIDS_SECTIES) for (const p of s.punten) for (const zin of p.tekst.split(/(?<=[.!?]) /)) if (/bundel/i.test(zin) && /doelen/i.test(zin)) passages.push([\"gids \" + s.id + \" / \" + p.kop, zin.replace(/\\s+/g, \" \").trim()]);\nlet fout = 0;\nconsole.log(\"beschrijvingen van de inhoud van de bundel: \" + passages.length);\nfor (const [bron, zin] of passages) {\n  const mist = types.filter(t => !stam[t].test(zin));\n  console.log((mist.length ? \"FOUT \" : \"ok   \") + bron + (mist.length ? \"  mist: \" + mist.join(\", \") : \"\"));\n  console.log(\"       \" + zin.slice(0, 190));\n  if (mist.length) fout++;\n}\nif (!passages.length) { console.log(\"FOUT: geen enkele beschrijving van de bundel gevonden\"); fout++; }\nconsole.log(fout ? \"FOUT: \" + fout + \" beschrijving(en) van de deelnemersbundel zijn niet meer volledig\" : \"OK\");\n'"
 },
 {
  "id": "T136",
  "gebied": "consistentie",
  "naam": "de cijfers op de startpagina kloppen met de modulekaarten en met de documentatie",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/');\nconst cijfers = {};\nfor (const d of H.qa('.onthaal-cijfers div')) cijfers[d.querySelector('span').textContent.trim()] = Number(d.querySelector('strong').textContent.trim());\nconst kaarten = H.qa('.modulelijst .kaart.module').length;\nconst koppen = H.qa('.modulelijst summary').map(s => Number(s.textContent.match(/De ([0-9]+) inhoudsmodules/)[1]));\nconst somKoppen = koppen.reduce((a, b) => a + b, 0);\nconst lessenUitKaarten = H.qa('.kaart.module .kaart-voet span:last-child').map(s => Number(s.textContent.match(/[/]([0-9]+) lessen/)[1])).reduce((a, b) => a + b, 0);\nconst teller = H.q('.voortgang-mini span').textContent.trim();\nconst ok = cijfers.modules === 12 && cijfers.lessen === 28 && kaarten === cijfers.modules && somKoppen === cijfers.modules && lessenUitKaarten === cijfers.lessen && Number(teller.split('/')[1]) === cijfers.lessen;\nreturn { ok, detail: 'kop: ' + cijfers.modules + ' modules en ' + cijfers.lessen + ' lessen; ' + kaarten + ' modulekaarten, sporenkoppen samen ' + somKoppen + ', lessen opgeteld uit de kaarten ' + lessenUitKaarten + ', voortgangsteller ' + teller };"
 },
 {
  "id": "T137",
  "gebied": "consistentie",
  "naam": "elke prompt op de promptkaart toont module en workshopcode, met de link \"openen\"",
  "soort": "browser",
  "route": "#/prompts",
  "begeleider": "onbelangrijk",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/prompts');\nconst belooft = Number(H.q('.etiketten .etiket-klein').textContent.match(/([0-9]+) prompts/)[1]);\nconst blokken = H.qa('.promptblok').length;\nconst herkomsten = H.qa('.promptblok .herkomst').map(h => h.textContent.replace(/[ ]+/g, ' ').trim());\nconst zonderCode = herkomsten.filter(h => !/workshops? /.test(h) || !/(A1|A2|A3|B1|B2|B3)/.test(h));\nconst links = H.qa('.promptblok .herkomst-link');\nconst kapot = links.filter(a => !/^#[/]module[/][a-z-]+$/.test(a.getAttribute('href')) || a.textContent.trim() !== 'openen');\nconst kopieer = H.qa('.promptblok [data-actie=\"kopieer\"]').length;\nconst ok = belooft === blokken && herkomsten.length === blokken && zonderCode.length === 0 && links.length === blokken && kapot.length === 0 && kopieer === blokken;\nreturn { ok, detail: 'etiket belooft ' + belooft + ' prompts, ' + blokken + ' promptblokken, ' + herkomsten.length + ' met herkomst, ' + zonderCode.length + ' zonder workshopcode, ' + links.length + ' links openen (' + kapot.length + ' kapot), ' + kopieer + ' kopieerknoppen; eerste herkomst: ' + herkomsten[0] };"
 },
 {
  "id": "T138",
  "gebied": "consistentie",
  "naam": "de bundel van A3 toont veertien casussen zonder oordeel, en mét oordeel in begeleidersmodus",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.ga('#/bundel/a3');\nconst casussen = H.qa('.bundel-casussen .casus').length;\nconst oordelenUit = H.qa('.bundel-casussen .casus-antwoord').length;\nconst openUit = H.qa('.bundel-casussen .casus.open').length;\nconst knoppen = H.qa('.bundel-casussen button').length;\nconst kopUit = H.q('.bundel-casussen h2').textContent.trim();\nconst vuistregels = H.qa('.vuistregel').map(p => p.textContent);\nconst spoorA = vuistregels.some(t => /prikbord in de leraarskamer/.test(t)) && !vuistregels.some(t => /Online is publiek/.test(t));\nawait H.begeleider(true);\nconst casussenAan = H.qa('.bundel-casussen .casus').length;\nconst oordelenAan = H.qa('.bundel-casussen .casus-antwoord').length;\nconst openAan = H.qa('.bundel-casussen .casus.open').length;\nconst kopAan = H.q('.bundel-casussen h2').textContent.trim();\nawait H.begeleider(false);\nconst ok = casussen === 14 && oordelenUit === 0 && openUit === 0 && knoppen === 0 && spoorA && !/met het oordeel/.test(kopUit) && casussenAan === 14 && oordelenAan === 14 && openAan === 14 && /met het oordeel/.test(kopAan);\nreturn { ok, detail: 'zonder begeleidersmodus: ' + casussen + ' casussen, ' + oordelenUit + ' oordelen, ' + openUit + ' open, ' + knoppen + ' knoppen, kop \"' + kopUit + '\", spoor-A-vuistregel ' + spoorA + '; met begeleidersmodus: ' + casussenAan + ' casussen, ' + oordelenAan + ' oordelen, ' + openAan + ' open, kop \"' + kopAan + '\"' };"
 },
 {
  "id": "T139",
  "gebied": "extra:samenspel",
  "naam": "sessie loopt, begeleidersmodus uit en weer aan",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const echteSet = window.setInterval, echteClear = window.clearInterval;\nlet laatsteId = null;\nconst gewist = new Set();\nwindow.setInterval = function (fn, ms) { const id = echteSet.apply(window, arguments); if (ms === 5000) laatsteId = id; return id; };\nwindow.clearInterval = function (id) { gewist.add(id); return echteClear.apply(window, arguments); };\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  const idVoor = laatsteId;\n  const idxVoor = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const vlagVoor = H.qa('.nu-vlag').length;\n  const knopVoor = (H.q('[data-actie=\"sessie\"]') || {}).textContent;\n\n  await H.klik('[data-actie=\"begeleider\"]');\n  const uitNu = H.qa('.blok.nu').length;\n  const uitVlag = H.qa('.nu-vlag').length;\n  const uitKnop = H.qa('[data-actie=\"sessie\"]').length;\n  const uitBody = document.body.classList.contains('begeleidersmodus');\n  const uitGewist = gewist.has(idVoor);\n\n  await H.klik('[data-actie=\"begeleider\"]');\n  const idxNa = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const naNu = H.qa('.blok.nu').length;\n  const naVlag = H.qa('.nu-vlag').length;\n  const knopNa = (H.q('[data-actie=\"sessie\"]') || {}).textContent;\n  const nieuwId = laatsteId !== idVoor;\n\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n\n  const ok = idxVoor >= 0 && vlagVoor === 1 && /Sessie stoppen/.test(knopVoor || '')\n    && uitNu === 0 && uitVlag === 0 && uitKnop === 0 && uitBody === false && uitGewist\n    && idxNa === idxVoor && naNu === 1 && naVlag === 1 && /Sessie stoppen/.test(knopNa || '') && nieuwId;\n  return { ok, detail: 'uit: ' + uitNu + ' blok.nu, ' + uitVlag + ' vlag, ' + uitKnop + ' sessieknop, body-klasse ' + uitBody + ', tikker gewist ' + uitGewist + '; weer aan: blok ' + idxNa + ' (was ' + idxVoor + '), ' + naNu + ' blok.nu, ' + naVlag + ' vlag, knop \"' + String(knopNa).trim() + '\", nieuwe tikker ' + nieuwId };\n} finally {\n  window.setInterval = echteSet;\n  window.clearInterval = echteClear;\n}"
 },
 {
  "id": "T140",
  "gebied": "extra:samenspel",
  "naam": "startuur wijzigen terwijl de tikker draait",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const echteSet = window.setInterval;\nlet tik = null;\nwindow.setInterval = function (fn, ms) { if (ms === 5000) tik = fn; return echteSet.apply(window, arguments); };\nconst oudUur = (H.q('#startuur') || {}).value;\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  if (typeof tik !== 'function') return { ok: false, detail: 'geen tikkerdoorloop van 5000 ms opgevangen na Start sessie' };\n\n  const veld = H.q('#startuur');\n  veld.value = '13:30';\n  veld.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n  const tijdVoor = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\n  const eindVoor = H.q('.eindtijd').textContent.trim();\n  const idxVoor = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const vlagVoor = H.qa('.nu-vlag').length;\n  veld.focus();\n\n  tik();\n  await H.wacht(60);\n  const tijdNa = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\n  const eindNa = H.q('.eindtijd').textContent.trim();\n  const idxNa = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const vlagNa = H.qa('.nu-vlag').length;\n  const zelfdeVeld = H.q('#startuur') === veld && veld.value === '13:30';\n  const focusBlijft = document.activeElement === veld;\n\n  const ok = tijdVoor === '13:30' && eindVoor === 'tot 16:30' && idxVoor >= 0 && vlagVoor === 1\n    && tijdNa === '13:30' && eindNa === 'tot 16:30' && idxNa === idxVoor && vlagNa === 1\n    && zelfdeVeld && focusBlijft;\n  return { ok, detail: 'na de tikkerdoorloop: blok 0 leest ' + tijdNa + ' (was ' + tijdVoor + '), eindtijd \"' + eindNa + '\", blok.nu op index ' + idxNa + ' (was ' + idxVoor + ') met ' + vlagNa + ' nu-vlag; tijdveld hetzelfde element met waarde ' + veld.value + ', focus behouden ' + focusBlijft };\n} finally {\n  window.setInterval = echteSet;\n  const v = H.q('#startuur');\n  if (v && oudUur) { v.value = oudUur; v.dispatchEvent(new Event('change', { bubbles: true })); }\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T141",
  "gebied": "extra:samenspel",
  "naam": "kloktijd en markering spreken elkaar tegen",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const pad = (n) => String(n).padStart(2, '0');\nconst klok = (m) => pad(Math.floor((((m % 1440) + 1440) % 1440) / 60)) + ':' + pad((((m % 1440) + 1440) % 1440) % 60);\nconst nu = new Date();\nconst nuMin = nu.getHours() * 60 + nu.getMinutes();\nconst eersteMin = Math.floor((((nuMin - 300) % 1440) + 1440) % 1440 / 5) * 5;\nconst tweedeMin = (eersteMin + 120) % 1440;\nconst eersteUur = klok(eersteMin), tweedeUur = klok(tweedeMin), nuKlok = klok(nuMin);\nconst oudUur = (H.q('#startuur') || {}).value;\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  let veld = H.q('#startuur');\n  veld.value = eersteUur;\n  veld.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.klik('[data-actie=\"sessie\"]');\n  const idx1 = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const tijd1 = H.qa('.blokken .blok')[Math.max(idx1, 0)].querySelector('.blok-tijd strong').textContent.trim();\n\n  veld = H.q('#startuur');\n  veld.value = tweedeUur;\n  veld.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n  const idx2 = H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\n  const tijd2 = H.qa('.blokken .blok')[Math.max(idx2, 0)].querySelector('.blok-tijd strong').textContent.trim();\n\n  const ok = idx1 === 0 && tijd1 === eersteUur && idx2 === 0 && tijd2 === tweedeUur && eersteUur !== nuKlok;\n  return { ok, detail: 'sessie zonet gestart, dus blok ' + idx1 + ' staat op \"nu\" — maar het draagt kloktijd ' + tijd1 + ' terwijl het ' + nuKlok + ' is; startuur naar ' + tweedeUur + ' schuift de kloktijd mee (blok leest ' + tijd2 + ') en laat de markering op index ' + idx2 + ' staan. De markering rekent dus vanaf de klik, niet vanaf het startuur — zoals gids.js en README beschrijven, maar niets waarschuwt de begeleider als de twee niet overeenkomen.' };\n} finally {\n  const v = H.q('#startuur');\n  if (v && oudUur) { v.value = oudUur; v.dispatchEvent(new Event('change', { bubbles: true })); }\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T142",
  "gebied": "extra:samenspel",
  "naam": "twintig routewissels en tien schakelaarklikken lekken geen tikker",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const echteSet = window.setInterval, echteClear = window.clearInterval;\nconst levend = new Set();\nlet gemaakt = 0;\nwindow.setInterval = function (fn, ms) { const id = echteSet.apply(window, arguments); if (ms === 5000) { levend.add(id); gemaakt++; } return id; };\nwindow.clearInterval = function (id) { levend.delete(id); return echteClear.apply(window, arguments); };\nlet piek = 0;\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  piek = Math.max(piek, levend.size);\n  const routes = ['#/bundel/a3', '#/gids', '#/workshop/a3'];\n  for (let i = 0; i < 20; i++) {\n    await H.ga(routes[i % 3]);\n    piek = Math.max(piek, levend.size);\n    if (i % 2 === 0) { await H.klik('[data-actie=\"begeleider\"]'); piek = Math.max(piek, levend.size); }\n  }\n  await H.ga('#/workshop/a3');\n  piek = Math.max(piek, levend.size);\n  const slotNu = H.qa('.blok.nu').length;\n  const slotVlag = H.qa('.nu-vlag').length;\n  const slotLevend = levend.size;\n  const begeleiderAan = document.body.classList.contains('begeleidersmodus');\n  const ok = piek <= 1 && slotLevend === 1 && slotNu === 1 && slotVlag === 1 && begeleiderAan && gemaakt >= 2;\n  return { ok, detail: '20 routewissels en 10 klikken op de schakelaar: ' + gemaakt + ' tikkers aangemaakt, hoogste aantal tegelijk levend ' + piek + ', na de laatste terugkeer ' + slotLevend + ' levend, ' + slotNu + ' blok.nu en ' + slotVlag + ' nu-vlag, begeleidersmodus staat ' + (begeleiderAan ? 'aan' : 'uit') };\n} finally {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  for (const id of levend) echteClear(id);\n  window.setInterval = echteSet;\n  window.clearInterval = echteClear;\n}"
 },
 {
  "id": "T143",
  "gebied": "extra:samenspel",
  "naam": "afvinken naast een open casus, een beantwoorde quiz en de kop",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const beginStand = new Map();\nconst noteer = () => { for (const b of H.qa('.vink')) if (!beginStand.has(b.dataset.sleutel)) beginStand.set(b.dataset.sleutel, b.getAttribute('aria-pressed') === 'true'); };\nconst zetUit = async () => { for (const b of H.qa('.vink')) if (b.getAttribute('aria-pressed') === 'true') await H.klik(b); };\nconst herstel = async () => { for (const b of H.qa('.vink')) { const wil = beginStand.get(b.dataset.sleutel); if (wil !== undefined && (b.getAttribute('aria-pressed') === 'true') !== wil) await H.klik(b); } };\nconst kopGetal = () => Number(H.q('.voortgang-mini span').textContent.split('/')[0]);\nconst meet = () => ({\n  open: H.qa('.casus.open').length,\n  uitgeklapt: H.qa('.casus-knop[aria-expanded=\"true\"]').length,\n  discussie: H.qa('.casus-discussie').length,\n  teller: H.q('#module-teller').textContent.trim(),\n  kop: kopGetal(),\n  body: document.body.classList.contains('begeleidersmodus'),\n  schakelaar: H.q('.schakelaar').getAttribute('aria-pressed'),\n});\ntry {\n  noteer();\n  await zetUit();\n  const lessen = H.qa('.les');\n  const vinken = H.qa('.vink');\n  await H.klik(lessen[0].querySelector('.casus-knop'));\n  await H.klik(lessen[1].querySelector('.casus-knop'));\n  const voor = meet();\n\n  await H.klik(vinken[0]);\n  const na = meet();\n  const knopAan = vinken[0].getAttribute('aria-pressed') === 'true' && lessen[0].classList.contains('af');\n\n  await H.klik(vinken[0]);\n  const terug = meet();\n  const knopUit = vinken[0].getAttribute('aria-pressed') === 'false' && !lessen[0].classList.contains('af');\n\n  await H.ga('#/module/kennismaking');\n  noteer();\n  await zetUit();\n  const quizVinken = H.qa('.vink');\n  await H.klik('.quiz .optie');\n  const uitslag = H.q('.quiz-uitslag').textContent.trim();\n  const kopVoorQuiz = kopGetal();\n  await H.klik(quizVinken[0]);\n  const quizBlijft = H.qa('.quiz.beantwoord').length === 1\n    && H.q('.quiz-uitslag').textContent.trim() === uitslag && uitslag.length > 0\n    && H.qa('.quiz .optie[aria-disabled=\"true\"]').length === H.qa('.quiz .optie').length;\n  const quizTeller = H.q('#module-teller').textContent.trim();\n  const kopNaQuiz = kopGetal();\n\n  const ok = voor.open === 2 && voor.uitgeklapt === 2 && voor.discussie === 14\n    && na.open === 2 && na.uitgeklapt === 2 && na.discussie === 14 && na.body === true && na.schakelaar === 'true'\n    && na.teller === '1/2 afgewerkt' && na.kop === voor.kop + 1 && knopAan\n    && terug.open === 2 && terug.uitgeklapt === 2 && terug.teller === '0/2 afgewerkt' && terug.kop === voor.kop && knopUit\n    && quizBlijft && quizTeller === '1/2 afgewerkt' && kopNaQuiz === kopVoorQuiz + 1;\n  return { ok, detail: 'casussen open/uitgeklapt/discussie/teller/kop — voor: ' + [voor.open, voor.uitgeklapt, voor.discussie, voor.teller, voor.kop].join('|')\n    + ' na afvinken: ' + [na.open, na.uitgeklapt, na.discussie, na.teller, na.kop].join('|')\n    + ' na uitvinken: ' + [terug.open, terug.uitgeklapt, terug.discussie, terug.teller, terug.kop].join('|')\n    + '; body-klasse ' + na.body + ', schakelaar aria-pressed ' + na.schakelaar\n    + '; quiz blijft beantwoord ' + quizBlijft + ' met uitslag \"' + uitslag + '\", modulekop ' + quizTeller + ', kopteller ' + kopVoorQuiz + '->' + kopNaQuiz };\n} finally {\n  await H.ga('#/module/kennismaking');\n  await herstel();\n  await H.ga('#/module/casussen');\n  await herstel();\n}"
 },
 {
  "id": "T144",
  "gebied": "extra:samenspel",
  "naam": "sessie van 12 minuten: a1 en a3 kiezen elk hun eigen blok",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": true,
  "script": "const opslag = H.opslagLees() || {};\nconst start = opslag.sessieStart;\nif (typeof start !== 'number') return { ok: false, detail: 'geen numerieke sessieStart in de opslag — de voorbereiding is niet uitgevoerd' };\nlet bron = 'WORKSHOPS';\nlet boek = null;\ntry { boek = (await import('/js/workshops.js')).WORKSHOPS; } catch (e) { bron = 'de duurtijden in het draaiboek op het scherm'; }\nconst duren = (id) => {\n  const w = boek && boek.find((x) => x.id === id);\n  if (w) return w.draaiboek.map((b) => b.minuten);\n  return H.qa('.blokken .blok').map((el) => parseInt(el.querySelector('.blok-tijd span').textContent, 10));\n};\nconst verwacht = (id) => {\n  const m = duren(id);\n  const verstreken = (Date.now() - start) / 60000;\n  let loper = 0, actief = -1;\n  m.forEach((mm, i) => { if (verstreken >= loper && verstreken < loper + mm) actief = i; loper += mm; });\n  return { actief, som: m.reduce((s, x) => s + x, 0) };\n};\nconst gemeten = () => H.qa('.blokken .blok').findIndex((el) => el.classList.contains('nu'));\ntry {\n  const v1 = verwacht('a1');\n  const a1 = gemeten();\n  await H.ga('#/workshop/a3');\n  const v3 = verwacht('a3');\n  const a3 = gemeten();\n  const a3Vlag = H.qa('.nu-vlag').length;\n  await H.ga('#/workshop/a1');\n  const a1Terug = gemeten();\n  const ok = v1.som === 180 && v3.som === 180 && a1 === v1.actief && a3 === v3.actief\n    && a1Terug === v1.actief && v1.actief !== v3.actief && a3Vlag === 1;\n  return { ok, detail: 'sessie ' + Math.round((Date.now() - start) / 60000) + ' min oud, herrekend uit ' + bron\n    + ': a1 markeert blok ' + a1 + ' (herrekend ' + v1.actief + '), a3 blok ' + a3 + ' (herrekend ' + v3.actief + ', ' + a3Vlag + ' nu-vlag), terug op a1 blok ' + a1Terug\n    + '; de twee draaiboeken kiezen dus ' + (v1.actief === v3.actief ? 'HETZELFDE blok — deze test toont niets' : 'elk hun eigen blok') };\n} finally {\n  await H.ga('#/workshop/a1');\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T145",
  "gebied": "extra:samenspel",
  "naam": "deelnemersstand verklapt niets, ook met een lopende sessie",
  "soort": "browser",
  "route": "#/workshop/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "try {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  const nuAan = H.qa('.blok.nu').length;\n  const tipsAan = H.qa('.tips').length;\n  await H.klik('[data-actie=\"begeleider\"]');\n  const meting = {\n    tips: H.qa('.tips').length,\n    valkuilen: H.qa('.kaart.valkuilen').length,\n    benodigd: H.qa('.kaart.benodigd').length,\n    sessieknop: H.qa('[data-actie=\"sessie\"]').length,\n    printknop: H.qa('[data-actie=\"print\"]').length,\n    nu: H.qa('.blok.nu').length,\n    vlag: H.qa('.nu-vlag').length,\n    voorbij: H.qa('.blok.voorbij').length,\n    bodyklasse: document.body.classList.contains('begeleidersmodus'),\n    schakelaar: H.q('.schakelaar') ? H.q('.schakelaar').getAttribute('aria-pressed') : null,\n    bundellink: H.qa('a[href=\"#/bundel/a3\"]').length,\n    blokken: H.qa('.blokken .blok').length,\n  };\n  const ok = tipsAan > 0 && nuAan === 1 && meting.tips === 0 && meting.valkuilen === 0 && meting.benodigd === 0\n    && meting.sessieknop === 0 && meting.printknop === 0 && meting.nu === 0 && meting.vlag === 0 && meting.voorbij === 0\n    && meting.bodyklasse === false && meting.schakelaar === 'false' && meting.bundellink === 1 && meting.blokken > 0;\n  return { ok, detail: 'met begeleidersmodus aan: ' + tipsAan + ' tipsblokken en ' + nuAan + ' blok.nu; na het uitzetten met de sessie nog aan: ' + JSON.stringify(meting) };\n} finally {\n  if (!document.body.classList.contains('begeleidersmodus')) await H.klik('[data-actie=\"begeleider\"]');\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T146",
  "gebied": "extra:samenspel",
  "naam": "schakelaar omzetten sluit de opengeklapte oordelen",
  "soort": "browser",
  "route": "#/module/casussen",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const knoppen = H.qa('.casus-knop').slice(0, 3);\nfor (const k of knoppen) await H.klik(k);\nconst openVoor = H.qa('.casus.open').length;\nconst uitgeklaptVoor = H.qa('.casus-knop[aria-expanded=\"true\"]').length;\nawait H.klik('[data-actie=\"begeleider\"]');\nconst openTussen = H.qa('.casus.open').length;\nawait H.klik('[data-actie=\"begeleider\"]');\nconst openNa = H.qa('.casus.open').length;\nconst uitgeklaptNa = H.qa('.casus-knop[aria-expanded=\"true\"]').length;\nconst discussieNa = H.qa('.casus-discussie').length;\nconst aanNa = document.body.classList.contains('begeleidersmodus');\nconst ok = openVoor === 3 && uitgeklaptVoor === 3 && openTussen === 0 && openNa === 0 && uitgeklaptNa === 0\n  && discussieNa === 14 && aanNa === true;\nreturn { ok, detail: openVoor + ' opengeklapte oordelen voor de schakelaar; na uit ' + openTussen + ', na weer aan ' + openNa\n  + ' (aria-expanded ' + uitgeklaptNa + '). De schakelaar hertekent via navigeer(), dus het groepswerk in A3 klapt dicht — de sessietimer overleeft wel, dat is wat gids.js belooft. ' + discussieNa + ' discussievragen terug op het scherm, begeleidersmodus staat ' + (aanNa ? 'aan' : 'uit') };"
 },
 {
  "id": "T147",
  "gebied": "extra:samenspel",
  "naam": "startuur draagt over naar een ander draaiboek zonder hertekenen",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "const oudUur = (H.q('#startuur') || {}).value;\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  const s0 = (H.opslagLees() || {}).sessieStart;\n  const veld = H.q('#startuur');\n  veld.value = '13:30';\n  veld.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n  const opslagNa = H.opslagLees() || {};\n  const a1Blok = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\n  const a1Eind = H.q('.eindtijd').textContent.trim();\n\n  await H.ga('#/workshop/b2');\n  const b2Veld = (H.q('#startuur') || {}).value;\n  const b2Blok = H.q('.blokken .blok .blok-tijd strong').textContent.trim();\n  const b2Eind = H.q('.eindtijd').textContent.trim();\n  const b2Knop = (H.q('[data-actie=\"sessie\"]') || {}).textContent || '';\n  const b2Nu = H.qa('.blok.nu').length;\n\n  const ok = typeof s0 === 'number' && opslagNa.startuur === '13:30' && opslagNa.sessieStart === s0\n    && a1Blok === '13:30' && a1Eind === 'tot 16:30'\n    && b2Veld === '13:30' && b2Blok === '13:30' && b2Eind === 'tot 16:30'\n    && /Sessie stoppen/.test(b2Knop) && b2Nu === 1;\n  return { ok, detail: 'na het wijzigen op a1: opslag startuur ' + opslagNa.startuur + ', sessieStart ' + (opslagNa.sessieStart === s0 ? 'ongewijzigd' : 'GEWIJZIGD naar ' + opslagNa.sessieStart) + ', a1 blok 0 ' + a1Blok + ' / ' + a1Eind + '; op b2 zonder hertekenen van a1: tijdveld ' + b2Veld + ', blok 0 ' + b2Blok + ' / ' + b2Eind + ', knop \"' + b2Knop.trim() + '\", ' + b2Nu + ' blok.nu' };\n} finally {\n  await H.ga('#/workshop/a1');\n  const v = H.q('#startuur');\n  if (v && oudUur) { v.value = oudUur; v.dispatchEvent(new Event('change', { bubbles: true })); }\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T148",
  "gebied": "extra:samenspel",
  "naam": "afvinken tijdens een sessie mag sessieStart niet wissen",
  "soort": "browser",
  "route": "#/workshop/a1",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "let knop = null, begonAf = false;\ntry {\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n  await H.klik('[data-actie=\"sessie\"]');\n  const voor = H.opslagLees() || {};\n  const s0 = voor.sessieStart, uur0 = voor.startuur;\n\n  await H.ga('#/module/casussen');\n  knop = H.qa('.vink').find((b) => b.getAttribute('aria-pressed') === 'false') || H.q('.vink');\n  begonAf = knop.getAttribute('aria-pressed') === 'true';\n  await H.klik(knop);\n  const naVink = H.opslagLees() || {};\n\n  await H.klik(knop);\n  const naUitvink = H.opslagLees() || {};\n\n  await H.ga('#/workshop/a1');\n  const knopTekst = (H.q('[data-actie=\"sessie\"]') || {}).textContent || '';\n  const nu = H.qa('.blok.nu').length;\n  const vlag = H.qa('.nu-vlag').length;\n\n  const ok = typeof s0 === 'number' && naVink.sessieStart === s0 && naUitvink.sessieStart === s0\n    && naVink.startuur === uur0 && Array.isArray(naVink.afgewerkt) && naVink.afgewerkt.includes(knop.dataset.sleutel)\n    && !naUitvink.afgewerkt.includes(knop.dataset.sleutel)\n    && /Sessie stoppen/.test(knopTekst) && nu === 1 && vlag === 1;\n  return { ok, detail: 'les ' + knop.dataset.sleutel + ' afvinken tijdens een lopende sessie: sessieStart ' + (naVink.sessieStart === s0 ? 'blijft ' + s0 : 'werd ' + naVink.sessieStart) + ', startuur ' + naVink.startuur + ', afgewerkt ' + JSON.stringify(naVink.afgewerkt) + '; terug op a1: knop \"' + knopTekst.trim() + '\", ' + nu + ' blok.nu en ' + vlag + ' nu-vlag' };\n} finally {\n  await H.ga('#/module/casussen');\n  const b = H.qa('.vink').find((x) => x.dataset.sleutel === (knop && knop.dataset.sleutel));\n  if (b && (b.getAttribute('aria-pressed') === 'true') !== begonAf) await H.klik(b);\n  await H.ga('#/workshop/a1');\n  if ((H.opslagLees() || {}).sessieStart) await H.klik('[data-actie=\"sessie\"]');\n}"
 },
 {
  "id": "T149",
  "gebied": "extra:samenspel",
  "naam": "elk draaiboek heeft op elke minuut precies één blok nu",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { WORKSHOPS } from './js/workshops.js';\n// Herbouwt de keuzelus van werkTikkerBij() uit js/app.js en toetst ze op elk\n// draaiboek: precies een blok 'nu' zolang de sessie loopt, geen enkel blok\n// erna, en de vlag 'nog N min' nooit 0 of negatief.\nlet fout = 0;\nfor (const w of WORKSHOPS) {\n  const totaal = w.draaiboek.reduce((s,b)=>s+b.minuten,0);\n  for (const b of w.draaiboek)\n    if (!(b.minuten > 0)) { console.log('FOUT', w.code, 'blok met', b.minuten, 'minuten is nooit het actieve blok'); fout++; }\n  for (let t = 0; t <= totaal * 4 + 40; t++) {\n    const verstreken = t / 4;\n    let loper = 0, actief = -1, resterend = 0;\n    w.draaiboek.forEach((b,i) => {\n      if (verstreken >= loper && verstreken < loper + b.minuten) { actief = i; resterend = Math.ceil(loper + b.minuten - verstreken); }\n      loper += b.minuten;\n    });\n    const naSessie = actief === -1 && verstreken >= loper;\n    if (verstreken < totaal && actief === -1) { console.log('FOUT', w.code, 'geen actief blok op', verstreken, 'min'); fout++; break; }\n    if (verstreken < totaal && resterend < 1) { console.log('FOUT', w.code, 'resterend', resterend, 'op', verstreken); fout++; break; }\n    if (verstreken >= totaal && !(actief === -1 && naSessie)) { console.log('FOUT', w.code, 'na het einde nog blok', actief, 'op', verstreken); fout++; break; }\n  }\n}\nconsole.log('gecontroleerd:', WORKSHOPS.length, 'draaiboeken, per kwartminuut tot 10 min over tijd');\nconsole.log(fout ? 'FOUT: ' + fout + ' probleem(en) in de tikkerdekking' : 'OK');\n\""
 },
 {
  "id": "T150",
  "gebied": "extra:samenspel",
  "naam": "geen module zonder lessen, geen draaiboek dat op een pauze eindigt",
  "soort": "node",
  "route": "",
  "begeleider": "onbelangrijk",
  "viewport": "onbelangrijk",
  "herladen": false,
  "script": "node --input-type=module -e \"\nimport { MODULES, WORKSHOPS, modulesVanWorkshop } from './js/cursus.js';\nlet fout = 0;\nfor (const m of MODULES) {\n  // moduleVoortgang() geeft bij 0 lessen 0/0, en toonModuleKaart() leest dat\n  // als 'af': groene kaart met vinkje zonder dat iemand iets afvinkte.\n  if (m.lessen.length === 0) { console.log('FOUT', m.id, 'heeft geen lessen: 0/0 telt als afgewerkt'); fout++; }\n  for (const l of m.lessen)\n    if (!l.blokken || l.blokken.length === 0) { console.log('FOUT', m.id, l.id, 'les zonder blokken'); fout++; }\n}\nfor (const w of WORKSHOPS) {\n  const mods = modulesVanWorkshop(w);\n  if (mods.length === 0) { console.log('FOUT', w.code, 'geen enkele module: lege deelnemersbundel'); fout++; }\n  const eerste = w.draaiboek[0], laatste = w.draaiboek[w.draaiboek.length - 1];\n  // werkTikkerBij() hangt de vlag 'einde draaiboek' aan .blok:last-child, en\n  // markeert bij de start blok 0 als 'nu'. Een pauze op die twee plaatsen\n  // zet de begeleider op het verkeerde been.\n  if (eerste.soort === 'pauze') { console.log('FOUT', w.code, 'begint met een pauze'); fout++; }\n  if (laatste.soort === 'pauze') { console.log('FOUT', w.code, 'eindigt op een pauze'); fout++; }\n}\nconsole.log('gecontroleerd:', MODULES.length, 'modules,', MODULES.reduce((s,m)=>s+m.lessen.length,0), 'lessen,', WORKSHOPS.length, 'draaiboeken');\nconsole.log(fout ? 'FOUT: ' + fout + ' probleem(en)' : 'OK');\n\""
 },
 {
  "id": "T151",
  "gebied": "extra:reis",
  "naam": "deelnemersreis: van 'Begin hier' door beide sporen, elke les afgevinkt",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": true,
  "script": "const AI = ['kennismaking','prompten','lesvoorbereiding','toetsen-feedback','administratie','veilig-en-ethisch','casussen'];\nconst VIBE = ['vibe-start','vibe-bouwen','vibe-delen','vibe-data','vibe-ai'];\nconst fout = [];\nconst modId = () => (location.hash.match(/^#\\/module\\/([^/]+)/) || [])[1] || location.hash;\n\nasync function loop(bezocht) {\n  for (let n = 0; n < 12; n++) {\n    if (H.q('.kaart.leeg')) { fout.push('\"Niet gevonden\" op ' + location.hash); return; }\n    if (!H.q('h1')) fout.push('geen h1 op ' + location.hash);\n    bezocht.push(modId());\n    const vinken = H.qa('.les button.vink');\n    if (!vinken.length) fout.push('geen lesknop op ' + location.hash);\n    for (const v of vinken) {\n      if (v.getAttribute('aria-pressed') === 'true') fout.push('les stond al afgevinkt op ' + location.hash);\n      await H.klik(v);\n      if (v.getAttribute('aria-pressed') !== 'true') fout.push('vink pakte niet op ' + location.hash);\n    }\n    const volgende = H.q('.verder a.knop.primair');\n    if (!volgende) return;\n    await H.klik(volgende);\n    await H.wacht(60);\n  }\n  fout.push('meer dan 12 stappen in een spoor');\n}\n\nawait H.ga('#/');\nif (H.opslagLees()) fout.push('localStorage was niet leeg bij de start');\nconst begin = H.qa('.snelkoppelingen .snel').find((a) => /Begin hier/.test(a.textContent));\nif (!begin) return { ok: false, detail: 'de snelkoppeling \"Begin hier\" staat niet op de startpagina' };\nawait H.klik(begin);\nawait H.wacht(60);\n\nconst reisAi = [];\nawait loop(reisAi);\nif (reisAi.join(',') !== AI.join(',')) fout.push('spoor ai liep ' + reisAi.join(' > '));\nconst eindLinks = H.qa('.verder a').map((a) => a.getAttribute('href'));\nif (!eindLinks.includes('#/')) fout.push('geen \"Terug naar het overzicht\" op de laatste ai-module');\nif (eindLinks.some((h) => /vibe/.test(h))) fout.push('de laatste ai-module linkt door naar spoor B: ' + eindLinks.join(' '));\n\nawait H.ga('#/');\nconst eersteVibe = H.q('.spoor-vibe .rooster.smal a.kaart.module');\nif (!eersteVibe) return { ok: false, detail: 'geen modulekaart in het vibe-spoor op de startpagina' };\nawait H.klik(eersteVibe);\nawait H.wacht(60);\nconst reisVibe = [];\nawait loop(reisVibe);\nif (reisVibe.join(',') !== VIBE.join(',')) fout.push('spoor vibe liep ' + reisVibe.join(' > '));\n\nawait H.ga('#/');\nconst teller = H.q('.voortgang-mini span')?.textContent;\nif (teller !== '28/28') fout.push('de teller bovenaan staat op ' + teller);\nconst kaarten = H.qa('.kaart.module');\nconst nietAf = kaarten.filter((k) => !k.classList.contains('af')).length;\nconst zonderVink = kaarten.filter((k) => !k.querySelector('.kaart-voet .klaar')).length;\nif (kaarten.length !== 12) fout.push(kaarten.length + ' modulekaarten in plaats van 12');\nif (nietAf) fout.push(nietAf + ' modulekaarten zonder klasse \"af\"');\nif (zonderVink) fout.push(zonderVink + ' modulekaarten zonder afgewerkt-vinkje');\nconst bewaard = H.opslagLees();\nif (!bewaard || bewaard.afgewerkt.length !== 28) fout.push('localStorage bevat ' + (bewaard ? bewaard.afgewerkt.length : 'geen') + ' sleutels');\n\nreturn {\n  ok: fout.length === 0,\n  detail: fout.length\n    ? fout.join(' | ')\n    : 'reis ai ' + reisAi.join(' > ') + '; reis vibe ' + reisVibe.join(' > ') + '; teller ' + teller + ', 12 kaarten af, ' + bewaard.afgewerkt.length + ' sleutels bewaard',\n};"
 },
 {
  "id": "T152",
  "gebied": "extra:reis",
  "naam": "na herladen blijft 28/28 staan met precies 28 bestaande lessleutels",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": true,
  "script": "const GELDIG = [\"kennismaking/wat-is-ai-assistent\",\"kennismaking/eerste-gesprek\",\"prompten/vier-knoppen\",\"prompten/bijsturen\",\"lesvoorbereiding/lesopbouw\",\"lesvoorbereiding/differentiatie\",\"toetsen-feedback/toetsvragen\",\"toetsen-feedback/feedback\",\"administratie/oudercommunicatie\",\"administratie/verslagen\",\"veilig-en-ethisch/privacy\",\"veilig-en-ethisch/betrouwbaarheid\",\"veilig-en-ethisch/leerlingen\",\"casussen/casus-privacy\",\"casussen/casus-leerlingen\",\"vibe-start/wat-is-vibe-coden\",\"vibe-start/onderwijsprobleem-eerst\",\"vibe-bouwen/eerste-versie\",\"vibe-bouwen/testen-bijsturen\",\"vibe-bouwen/stijl-en-bruikbaarheid\",\"vibe-delen/publiceren\",\"vibe-delen/in-de-klas\",\"vibe-data/wanneer-data\",\"vibe-data/leerlingdata-veilig\",\"vibe-data/versiebeheer\",\"vibe-ai/wanneer-ai-inbouwen\",\"vibe-ai/modellen-en-kosten\",\"vibe-ai/sleutels-en-veiligheid\"];\nconst fout = [];\nconst bewaard = H.opslagLees();\nif (!bewaard) return { ok: false, detail: 'na het herladen staat er niets in localStorage' };\nconst sleutels = bewaard.afgewerkt || [];\nconst teller = H.q('.voortgang-mini span')?.textContent;\nif (teller !== '28/28') fout.push('teller na herladen: ' + teller);\nif (sleutels.length !== 28) fout.push(sleutels.length + ' sleutels in plaats van 28');\nif (new Set(sleutels).size !== sleutels.length) fout.push('dubbele sleutels in de opslag');\nconst onbekend = sleutels.filter((s) => !GELDIG.includes(s));\nif (onbekend.length) fout.push('sleutels die geen les zijn: ' + onbekend.join(', '));\nconst ontbreekt = GELDIG.filter((g) => !sleutels.includes(g));\nif (ontbreekt.length) fout.push('ontbrekende lessen: ' + ontbreekt.join(', '));\nconst kaarten = H.qa('.kaart.module');\nconst nietAf = kaarten.filter((k) => !k.classList.contains('af')).length;\nif (nietAf) fout.push(nietAf + ' modulekaarten staan na het herladen niet op af');\nif (bewaard.sessieStart !== null) fout.push('sessieStart is ' + bewaard.sessieStart + ' in plaats van null');\nif (!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(bewaard.startuur)) fout.push('startuur ' + bewaard.startuur);\nif (Object.keys(bewaard).sort().join(',') !== 'afgewerkt,begeleider,sessieStart,startuur') fout.push('velden: ' + Object.keys(bewaard).join(','));\nH.opslagWis();\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : 'teller ' + teller + ' na herladen, ' + sleutels.length + ' sleutels, alle 28 bestaande lessen, ' + kaarten.length + ' kaarten af, sessieStart null' };"
 },
 {
  "id": "T153",
  "gebied": "extra:reis",
  "naam": "begeleidersreis: gids afdrukken, A3 op 13u30, sessie, bundel in twee standen en terug",
  "soort": "browser",
  "route": "#/",
  "begeleider": "uit",
  "viewport": "laptop",
  "herladen": false,
  "script": "const fout = [];\nconst stap = [];\nconst zeg = (v, boodschap) => { if (!v) fout.push(boodschap); };\n\ntry {\n  // 1. begeleidersmodus aan via de schakelaar\n  await H.ga('#/');\n  await H.klik('.schakelaar');\n  zeg(H.q('.schakelaar').getAttribute('aria-pressed') === 'true', 'schakelaar meldt aria-pressed=false na aanzetten');\n  zeg(document.body.classList.contains('begeleidersmodus'), 'body kreeg geen klasse begeleidersmodus');\n  stap.push('modus aan');\n\n  // 2. via de snelkoppeling naar de gids\n  const naarGids = H.qa('.snelkoppelingen .snel').find((a) => /Begeleidersgids/.test(a.textContent));\n  if (!naarGids) return { ok: false, detail: 'geen snelkoppeling naar de begeleidersgids in begeleidersmodus' };\n  await H.klik(naarGids);\n  const secties = H.qa('.gids-sectie').length;\n  const vragen = H.qa('details.faq').length;\n  zeg(secties === 5, secties + ' gidssecties in plaats van 5');\n  zeg(vragen === 22, vragen + ' faq-vragen in plaats van 22');\n  const etiketten = H.qa('.gids-kop .etiket-klein').map((e) => e.textContent.trim()).join(' / ');\n  zeg(/5 onderdelen/.test(etiketten) && /22 lastige vragen/.test(etiketten), 'etiketten in de gidskop: ' + etiketten);\n  stap.push(secties + ' secties, ' + vragen + ' vragen');\n\n  // 3. twee vragen openklappen, dan afdrukken: alles moet openstaan\n  await H.klik(H.qa('details.faq summary')[0]);\n  await H.klik(H.qa('details.faq summary')[3]);\n  const handmatig = H.qa('details.faq[open]').length;\n  zeg(handmatig === 2, handmatig + ' vragen open na twee kliks in plaats van 2');\n  const echtePrint = window.print;\n  window.print = () => {};\n  try {\n    const printknop = H.qa('.besturing [data-actie=\"print\"]').find((b) => /Gids afdrukken/.test(b.textContent));\n    if (!printknop) fout.push('geen knop \"Gids afdrukken\"');\n    else await H.klik(printknop);\n  } finally {\n    window.print = echtePrint;\n  }\n  const naPrint = H.qa('details.faq[open]').length;\n  zeg(naPrint === 22, naPrint + ' van de 22 vragen staan open na \"Gids afdrukken\"');\n  stap.push('afdrukken opent ' + naPrint + ' vragen');\n\n  // 4. via het overzicht naar het draaiboek van A3\n  await H.klik(H.q('.verder a'));\n  const kaartA3 = H.qa('.kaart.workshop').find((k) => k.querySelector('.code')?.textContent.trim() === 'A3');\n  if (!kaartA3) return { ok: false, detail: 'geen workshopkaart A3 op de startpagina' };\n  await H.klik(kaartA3);\n  zeg(location.hash === '#/workshop/a3', 'de kaart A3 leidt naar ' + location.hash);\n  zeg(/Vooraf klaarzetten/.test(H.q('.kaart.benodigd')?.textContent || ''), 'geen kaart \"Vooraf klaarzetten\" op het draaiboek');\n  zeg(H.qa('.tips').length > 0, 'geen begeleiderstips bij de blokken');\n  zeg(!!H.q('.kaart.valkuilen'), 'geen valkuilenkaart');\n  stap.push('A3 met ' + H.qa('.tips').length + ' tipblokken');\n\n  // 5. startuur op 13:30\n  const veld = H.q('#startuur');\n  veld.value = '13:30';\n  veld.dispatchEvent(new Event('change', { bubbles: true }));\n  await H.wacht(60);\n  const eerste = H.q('.blokken .blok .blok-tijd strong')?.textContent;\n  const eind = H.q('.eindtijd')?.textContent.trim();\n  zeg(eerste === '13:30', 'blok 0 start op ' + eerste);\n  zeg(eind === 'tot 16:30', 'de eindtijd staat op \"' + eind + '\"');\n  zeg(H.q('#startuur') === veld, 'het tijdveld werd vervangen: de pagina hertekende');\n  stap.push('13:30 geeft ' + eind);\n\n  // 6. sessie starten\n  await H.klik('[data-actie=\"sessie\"]');\n  const sessieknop = H.q('[data-actie=\"sessie\"]');\n  zeg(sessieknop?.textContent.trim() === 'Sessie stoppen', 'sessieknop leest \"' + sessieknop?.textContent.trim() + '\"');\n  zeg(typeof H.opslagLees()?.sessieStart === 'number', 'sessieStart in localStorage is ' + JSON.stringify(H.opslagLees()?.sessieStart));\n  const nu = H.qa('.blok.nu');\n  zeg(nu.length === 1, nu.length + ' blokken met de klasse nu in plaats van 1');\n  zeg(nu[0]?.dataset.blok === '0', 'het actieve blok is nummer ' + nu[0]?.dataset.blok);\n  zeg(/^nu . nog \\d+ min$/.test(H.q('.nu-vlag')?.textContent || ''), 'de nu-vlag leest \"' + H.q('.nu-vlag')?.textContent + '\"');\n  stap.push('sessie loopt op blok ' + nu[0]?.dataset.blok);\n\n  // 7. door naar de deelnemersbundel, met begeleidersmodus nog aan\n  await H.klik(H.qa('.besturing a').find((a) => /Deelnemersbundel/.test(a.textContent)));\n  zeg(location.hash === '#/bundel/a3', 'de bundelknop leidt naar ' + location.hash);\n  zeg(document.body.dataset.pagina === 'bundel', 'data-pagina is \"' + document.body.dataset.pagina + '\"');\n  const openCasussen = H.qa('.bundel-casussen .casus.open').length;\n  const oordelen = H.qa('.bundel-casussen .casus-antwoord').length;\n  zeg(openCasussen === 14, openCasussen + ' open casussen in de begeleidersbundel in plaats van 14');\n  zeg(oordelen === 14, oordelen + ' oordelen in de begeleidersbundel in plaats van 14');\n  zeg(H.qa('.bundel-casussen .casus-knop').length === 0, 'er staan knoppen bij de casussen in de bundel');\n  zeg(H.qa('.bundel-casussen .casus-discussie').length === 0, 'de gespreksvragen uit de module staan mee in de bundel');\n  let banner;\n  const stopPrint = H.printAan();\n  try {\n    banner = getComputedStyle(H.q('#hoofd'), '::before').content;\n    const vakjes = H.qa('.bundel-casussen .casus').filter((c) => /Ons oordeel/.test(getComputedStyle(c, '::after').content || '')).length;\n    zeg(vakjes === 0, vakjes + ' keuzevakjes onder een oordeel dat al op het blad staat');\n    zeg(H.stijl(H.q('.bundel-casussen .casus-antwoord'), 'display') === 'block', 'het oordeel staat niet op papier');\n  } finally { stopPrint(); }\n  stap.push('begeleidersbundel: ' + oordelen + ' oordelen op papier, banner ' + banner);\n\n  // 8. begeleidersmodus uit, nog steeds op de bundel\n  await H.klik('.schakelaar');\n  zeg(H.qa('.bundel-casussen .casus-antwoord').length === 0, 'het oordeel staat nog in de DOM van de uitgedeelde bundel');\n  zeg(H.qa('.bundel-casussen .casus.open').length === 0, 'er staan nog open casussen in de uitgedeelde bundel');\n  zeg(H.qa('.bundel-casussen .casus-knop').length === 0, 'er staan knoppen bij de casussen in de uitgedeelde bundel');\n  zeg(H.qa('.bundel-casussen .casus').length === 14, H.qa('.bundel-casussen .casus').length + ' casussen in de uitgedeelde bundel');\n  const hint = H.q('.bundel-casussen .bundel-hint')?.textContent.trim() || '';\n  zeg(/Beslis eerst zelf/.test(hint), 'de hint leest \"' + hint.slice(0, 60) + '\"');\n  zeg(H.q('.bundel-casussen h2')?.textContent.trim() === 'De casussen', 'de kop leest \"' + H.q('.bundel-casussen h2')?.textContent.trim() + '\"');\n  const stopPrint2 = H.printAan();\n  let vakjes2 = 0;\n  try {\n    vakjes2 = H.qa('.bundel-casussen .casus').filter((c) => /Ons oordeel/.test(getComputedStyle(c, '::after').content || '')).length;\n  } finally { stopPrint2(); }\n  zeg(vakjes2 === 14, vakjes2 + ' keuzevakjes op het uitgedeelde blad in plaats van 14');\n  stap.push('deelnemersbundel: 0 oordelen, ' + vakjes2 + ' keuzevakjes');\n\n  // 9. terug naar het draaiboek zonder begeleidersmodus\n  await H.klik(H.qa('.besturing a').find((a) => /Terug naar het draaiboek/.test(a.textContent)));\n  zeg(location.hash === '#/workshop/a3', 'terugknop leidt naar ' + location.hash);\n  zeg(!H.q('[data-actie=\"sessie\"]'), 'de sessieknop staat er nog zonder begeleidersmodus');\n  zeg(typeof H.opslagLees()?.sessieStart === 'number', 'sessieStart verdween uit localStorage bij het uitzetten van begeleidersmodus');\n  stap.push('sessie blijft bewaard zonder begeleidersmodus');\n\n  // 10. weer aan, en de sessie stoppen\n  await H.klik('.schakelaar');\n  const stopknop = H.q('[data-actie=\"sessie\"]');\n  zeg(stopknop?.textContent.trim() === 'Sessie stoppen', 'na het heraanzetten leest de knop \"' + stopknop?.textContent.trim() + '\"');\n  await H.klik(stopknop);\n  zeg(H.opslagLees()?.sessieStart === null, 'sessieStart is na stoppen ' + JSON.stringify(H.opslagLees()?.sessieStart));\n  zeg(H.qa('.blok.nu').length === 0, H.qa('.blok.nu').length + ' blokken staan nog op nu');\n  zeg(H.qa('.blok.voorbij').length === 0, H.qa('.blok.voorbij').length + ' blokken staan nog op voorbij');\n  zeg(H.qa('.nu-vlag').length === 0, 'er hangt nog een nu-vlag in het draaiboek');\n  stap.push('sessie gestopt, markering weg');\n} finally {\n  // opruimen: startuur terug op 09:00, modus uit, opslag leeg\n  const veld2 = H.q('#startuur');\n  if (veld2) { veld2.value = '09:00'; veld2.dispatchEvent(new Event('change', { bubbles: true })); }\n  await H.begeleider(false);\n  H.opslagWis();\n}\n\nreturn { ok: fout.length === 0, detail: fout.length ? fout.join(' | ') : stap.join(' > ') };"
 },
 {
  "id": "T154",
  "gebied": "extra:reis",
  "naam": "bevinding: de begeleidersbundel draagt veertien oordelen op papier zonder enige waarschuwing",
  "soort": "browser",
  "route": "#/bundel/a3",
  "begeleider": "aan",
  "viewport": "laptop",
  "herladen": false,
  "script": "await H.begeleider(true);\nconst leesBanner = () => {\n  const stop = H.printAan();\n  try { return getComputedStyle(H.q('#hoofd'), '::before').content || 'none'; } finally { stop(); }\n};\nawait H.ga('#/workshop/a3');\nconst opDraaiboek = leesBanner();\nawait H.ga('#/bundel/a3');\nconst oordelen = H.qa('.bundel-casussen .casus-antwoord').length;\nconst opBundel = leesBanner();\nconst heeft = (t) => t !== 'none' && t !== 'normal' && t !== '';\nconst ok = heeft(opDraaiboek) && (heeft(opBundel) || oordelen === 0);\nawait H.begeleider(false);\nH.opslagWis();\nreturn {\n  ok,\n  detail: 'draaiboek: banner ' + (heeft(opDraaiboek) ? 'staat er' : 'ontbreekt') +\n    '; bundel in begeleidersmodus: ' + oordelen + ' oordelen op het blad en banner ' + (heeft(opBundel) ? 'staat er' : 'ontbreekt') +\n    ' (::before = ' + opBundel + ')',\n};"
 }
];

function verstreken(p) {
  return Promise.race([
    p,
    new Promise((_, af) => setTimeout(() => af(new Error('tijd op (12s)')), 12000)),
  ]);
}

// Sommige tests wijzigen de gedeelde inhoud om iets uit te lokken. Zet zo'n test
// dat niet terug, dan zakt alles wat erna komt om de verkeerde reden. Deze
// controle wijst meteen de schuldige aan in plaats van de slachtoffers.
async function dataGaaf() {
  const { MODULES, WORKSHOPS } = await import('/js/cursus.js');
  if (MODULES.length !== 12) return 'MODULES telt ' + MODULES.length + ' modules';
  for (const m of MODULES) {
    if (!Array.isArray(m.lessen) || !m.lessen.length) return 'module ' + m.id + ' heeft geen lessen';
    if (!Array.isArray(m.doelen) || !m.doelen.length) return 'module ' + m.id + ' heeft geen doelen';
    for (const l of m.lessen)
      if (!Array.isArray(l.blokken) || !l.blokken.length) return 'les ' + m.id + '/' + l.id + ' heeft geen blokken';
  }
  if (WORKSHOPS.length !== 6) return 'WORKSHOPS telt ' + WORKSHOPS.length + ' workshops';
  for (const w of WORKSHOPS) {
    if (!Array.isArray(w.draaiboek) || !w.draaiboek.length) return 'workshop ' + w.code + ' heeft geen draaiboek';
    if (w.draaiboek.reduce((n, b) => n + b.minuten, 0) !== 180) return 'workshop ' + w.code + ' telt geen 180 minuten meer';
  }
  return null;
}

export async function run(opts) {
  const viewport = (opts && opts.viewport) || 'laptop';
  const alleen = (opts && opts.alleen) || null; // lijst met ids
  const bewaard = localStorage.getItem(SLEUTEL);
  const uit = [];
  const gepland = TESTS.filter((t) => t.soort === 'browser' && !t.herladen &&
    (alleen ? alleen.includes(t.id) : (t.viewport === 'onbelangrijk' || t.viewport === viewport))).length;
  for (const t of TESTS) {
    if (t.soort !== 'browser') continue;
    if (t.herladen) continue;
    if (alleen ? !alleen.includes(t.id) : !(t.viewport === 'onbelangrijk' || t.viewport === viewport)) continue;
    let r;
    try {
      const mijn = ++huidigeBeurt;
      const Hb = maakH(mijn);
      const fn = new AF('H', t.script);
      const w = await verstreken((async () => {
        // Altijd eerst een verse hertekening: anders erft deze test de opengeklapte
        // casussen, beantwoorde quizzen en losse knoppen van de vorige.
        location.hash = '#/__reset';
        await Hb.tik();
        if (t.begeleider !== 'onbelangrijk') await Hb.begeleider(t.begeleider === 'aan');
        if (t.route) await Hb.ga(t.route);
        return fn(Hb);
      })());
      r = { id: t.id, gebied: t.gebied, naam: t.naam, ok: !!(w && w.ok), detail: String((w && w.detail) || 'geen detail') };
    } catch (e) {
      r = { id: t.id, gebied: t.gebied, naam: t.naam, ok: false, detail: 'UITZONDERING: ' + ((e && e.message) || e) };
    } finally {
      H.printUit();
    }
    uit.push(r);
    const stuk = await dataGaaf();
    if (stuk) {
      uit.push({ id: 'DATA', gebied: 'harnas', naam: 'de inhoud is beschadigd door ' + r.id,
        ok: false, detail: stuk + ' — ' + r.id + ' (' + r.naam + ') zette de data niet terug; de reeks is hier gestopt' });
      break;
    }
    try { window.__voortgang = uit.length + '/' + gepland + ' — laatste: ' + r.id + ' ' + (r.ok ? 'ok' : 'ZAKT'); } catch (e) {}
  }
  if (bewaard === null) localStorage.removeItem(SLEUTEL);
  else localStorage.setItem(SLEUTEL, bewaard);
  const gezakt = uit.filter((x) => !x.ok);
  return { viewport, gedraaid: uit.length, geslaagd: uit.length - gezakt.length, gezakt: gezakt.length, mislukt: gezakt, alles: uit };
}

export { H, TESTS };
