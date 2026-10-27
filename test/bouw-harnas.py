# Bouwt _testharnas.js in de repo-root uit de testgevallen van de workflow.
# Gebruik: python bouw-harnas.py <tests.json> <repo-root>
import json, sys, os

RUNTIME = r"""// Tijdelijke testharnas — hoort NIET in een commit.
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

const TESTS = __TESTS__;

function verstreken(p) {
  return Promise.race([
    p,
    new Promise((_, af) => setTimeout(() => af(new Error('tijd op (12s)')), 12000)),
  ]);
}

// Sommige tests wijzigen de gedeelde inhoud om iets uit te lokken. Zet zo'n test
// dat niet terug, dan zakt alles wat erna komt om de verkeerde reden. Deze
// controle wijst meteen de schuldige aan in plaats van de slachtoffers.
let ijkpunt = null;

async function dataGaaf() {
  const { MODULES, WORKSHOPS } = await import('/js/cursus.js');
  // Niet tegen een vast getal vergelijken: dat veroudert bij elke module die
  // erbij komt, en dan breekt het harnas in plaats van de app. We leggen bij de
  // eerste controle vast wat we zien, en bewaken dat het dat blijft — want dat
  // is wat deze controle moet vangen: een test die de gedeelde data sloopt.
  if (!ijkpunt) ijkpunt = { modules: MODULES.length, workshops: WORKSHOPS.length };
  if (MODULES.length !== ijkpunt.modules)
    return 'MODULES telt ' + MODULES.length + ' modules in plaats van ' + ijkpunt.modules;
  for (const m of MODULES) {
    if (!Array.isArray(m.lessen) || !m.lessen.length) return 'module ' + m.id + ' heeft geen lessen';
    if (!Array.isArray(m.doelen) || !m.doelen.length) return 'module ' + m.id + ' heeft geen doelen';
    for (const l of m.lessen)
      if (!Array.isArray(l.blokken) || !l.blokken.length) return 'les ' + m.id + '/' + l.id + ' heeft geen blokken';
  }
  if (WORKSHOPS.length !== ijkpunt.workshops)
    return 'WORKSHOPS telt ' + WORKSHOPS.length + ' workshops in plaats van ' + ijkpunt.workshops;
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
"""


def main():
    tests_pad, root = sys.argv[1], sys.argv[2]
    tests = json.load(open(tests_pad, encoding="utf-8"))
    if isinstance(tests, dict):
        tests = tests["tests"]
    slank = [
        {
            "id": t["id"],
            "gebied": t.get("gebied", ""),
            "naam": t["naam"],
            "soort": t["soort"],
            "route": t.get("route", ""),
            "begeleider": t.get("begeleider", "onbelangrijk"),
            "viewport": t.get("viewport", "onbelangrijk"),
            "herladen": bool(t.get("herladen")),
            "script": t["script"],
        }
        for t in tests
    ]
    js = RUNTIME.replace("__TESTS__", json.dumps(slank, ensure_ascii=False, indent=1))
    pad = os.path.join(root, "_testharnas.js")
    open(pad, "w", encoding="utf-8", newline="\n").write(js)
    b = [t for t in slank if t["soort"] == "browser" and not t["herladen"]]
    print("geschreven:", pad)
    print("browsertests:", len(b), "| per viewport:",
          {v: len([t for t in b if t["viewport"] == v]) for v in sorted({t["viewport"] for t in b})})
    print("herlaadtests:", len([t for t in slank if t["herladen"]]),
          "| nodetests:", len([t for t in slank if t["soort"] == "node"]))


main()
