# Voegt de verdiepingslessen uit de workflow in js/inhoud-vibe.js.
# Gebruik: python voeg-lessen-toe.py <lessen.json> <repo-root>
import json, sys, os, re

VELDVOLGORDE = ["type", "variant", "titel", "vraag", "inhoud", "tekst", "zwak", "sterk",
                "items", "geordend", "stappen", "opties", "uitleg"]


def js_string(s, indent):
    """Enkelvoudig gequote JS-string; lange tekst blijft op één regel (zoals de rest van het bestand)."""
    s = s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "")
    return "'" + s + "'"


def js_waarde(v, indent):
    sp = " " * indent
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, str):
        return js_string(v, indent)
    if isinstance(v, list):
        if not v:
            return "[]"
        regels = [sp + "  " + js_waarde(x, indent + 2) + "," for x in v]
        return "[\n" + "\n".join(regels) + "\n" + sp + "]"
    if isinstance(v, dict):
        sleutels = [k for k in VELDVOLGORDE if k in v] + [k for k in v if k not in VELDVOLGORDE]
        regels = []
        for k in sleutels:
            regels.append(sp + "  " + k + ": " + js_waarde(v[k], indent + 2) + ",")
        return "{\n" + "\n".join(regels) + "\n" + sp + "}"
    raise TypeError(str(type(v)))


def les_js(les, indent=6):
    sp = " " * indent
    d = {"id": les["lesId"], "titel": les["titel"], "verdieping": True, "blokken": les["blokken"]}
    regels = [sp + "{"]
    regels.append(sp + "  id: " + js_string(d["id"], indent) + ",")
    regels.append(sp + "  titel: " + js_string(d["titel"], indent) + ",")
    regels.append(sp + "  verdieping: true,")
    regels.append(sp + "  blokken: " + js_waarde(d["blokken"], indent + 2) + ",")
    regels.append(sp + "},")
    return "\n".join(regels)


def module_einde(regels, module_id):
    """Regelindex van de '    ],' die de lessen-array van deze module sluit."""
    start = next(i for i, r in enumerate(regels) if r.strip() == "id: '" + module_id + "',")
    for i in range(start, len(regels)):
        if regels[i] == "    ]," and i + 1 < len(regels) and regels[i + 1] == "  },":
            return i
    raise SystemExit("einde van module " + module_id + " niet gevonden")


def main():
    lessen_pad, root = sys.argv[1], sys.argv[2]
    data = json.load(open(lessen_pad, encoding="utf-8"))
    onderwerpen = data["onderwerpen"] if isinstance(data, dict) else data

    pad = os.path.join(root, "js", "inhoud-vibe.js")
    tekst = open(pad, encoding="utf-8", newline="").read()
    eol = "\r\n" if "\r\n" in tekst else "\n"
    regels = tekst.replace("\r\n", "\n").split("\n")

    nieuw_module = []
    per_module = {}
    for o in onderwerpen:
        if o["module"].startswith("NIEUWE MODULE"):
            nieuw_module.append(o)
        else:
            per_module.setdefault(o["module"], []).extend(o["lessen"])

    # Bestaande modules: van achter naar voor invoegen, zodat regelnummers kloppen.
    volgorde = sorted(per_module, key=lambda m: module_einde(regels, m), reverse=True)
    toegevoegd = 0
    for m in volgorde:
        i = module_einde(regels, m)
        blok = []
        for les in per_module[m]:
            blok.extend(les_js(les).split("\n"))
            toegevoegd += 1
        regels[i:i] = blok
        print("module", m, "+", len(per_module[m]), "lessen")

    # Nieuwe module achteraan, vóór de afsluitende '];'
    if nieuw_module:
        o = nieuw_module[0]
        eind = len(regels) - 1
        while regels[eind].strip() != "];":
            eind -= 1
        # het laatste '  },' staat er vlak boven
        mod = ["  {",
               "    id: 'vibe-voorbeeld',",
               "    icoon: '🧪',",
               "    titel: 'Een volledig voorbeeld',",
               "    ondertitel: 'Eén project van het eerste idee tot in de klas, met alle tussenstappen.',",
               "    duur: '30 min',",
               "    niveau: 'Verdieping',",
               "    doelen: [",
               "      'Je ziet de hele weg één keer in samenhang, van lesprobleem tot werkende app.',",
               "      'Je herkent waar het misloopt en hoe je bijstuurt zonder opnieuw te beginnen.',",
               "      'Je haalt je eigen idee door dezelfde stappen.',",
               "    ],",
               "    lessen: ["]
        for les in o["lessen"]:
            mod.extend(les_js(les).split("\n"))
            toegevoegd += 1
        mod.extend(["    ],", "  },"])
        regels[eind:eind] = mod
        print("nieuwe module vibe-voorbeeld +", len(o["lessen"]), "lessen")

    open(pad, "w", encoding="utf-8", newline="").write(eol.join(regels))
    print("totaal toegevoegd:", toegevoegd, "lessen ->", pad)


main()
