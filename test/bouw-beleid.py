# Schrijft js/inhoud-beleid.js uit de modules die de workflow opleverde.
# Gebruik: python bouw-beleid.py <modules.json> <repo-root>
import json, sys, os

KOP = """// Spoor C — Het kader: wet, privacy en schoolbeleid.
//
// Dit spoor staat vóór de twee andere: het geeft het algemene kader waarop
// "AI in de klas" en "Vibe coden" verder bouwen. Het is geschreven voor twee
// publieken tegelijk — de leerkracht die wil weten wat ze morgen mag doen, en
// de directie die afspraken maakt voor de hele school, met leerlingdata van
// minderjarigen én met gevoelige personeelsgegevens.
//
// Toon: informeren, niet belerend. De meeste dingen die een leerkracht met AI
// wil doen, mogen gewoon; de regels bijten op een klein maar belangrijk stuk.
// Elke waarschuwing zegt wat je dan wél doet en bij wie je terechtkan.
//
// Dit is geen juridisch advies. Bij echte twijfel gaat het naar de DPO van de
// scholengroep.
//
// VERIFICATIE: geschreven op 26 oktober 2026 op basis van een onderzoeksronde
// met bronvermelding. Twee dingen om in de gaten te houden bij een volgende
// nakijkronde: de invoeringsdata van de AI-verordening zijn in 2026 verschoven
// door de digitale omnibus, en de bevoegde toezichthouder voor Vlaamse scholen
// is juridisch betwist. Schrijf hier nooit een artikelnummer, bedrag of termijn
// bij zonder het in een primaire bron na te lezen.

export const MODULES_BELEID = [
"""

VELDVOLGORDE = ["type", "variant", "titel", "vraag", "situatie", "oordeel", "inhoud", "tekst",
                "zwak", "sterk", "items", "geordend", "stappen", "opties", "toelichting",
                "discussie", "uitleg"]


def js_string(s):
    s = s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "")
    return "'" + s + "'"


def js_waarde(v, indent):
    sp = " " * indent
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, str):
        return js_string(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        return "[\n" + "\n".join(sp + "  " + js_waarde(x, indent + 2) + "," for x in v) + "\n" + sp + "]"
    if isinstance(v, dict):
        sleutels = [k for k in VELDVOLGORDE if k in v] + [k for k in v if k not in VELDVOLGORDE]
        return "{\n" + "\n".join(sp + "  " + k + ": " + js_waarde(v[k], indent + 2) + "," for k in sleutels) + "\n" + sp + "}"
    raise TypeError(str(type(v)))


def main():
    pad_json, root = sys.argv[1], sys.argv[2]
    data = json.load(open(pad_json, encoding="utf-8"))
    modules = [x["module"] if "module" in x else x for x in (data["modules"] if isinstance(data, dict) else data)]

    uit = [KOP]
    for m in modules:
        uit.append("  {")
        uit.append("    id: " + js_string(m["moduleId"]) + ",")
        uit.append("    icoon: " + js_string(m["icoon"]) + ",")
        uit.append("    titel: " + js_string(m["titel"]) + ",")
        uit.append("    ondertitel: " + js_string(m["ondertitel"]) + ",")
        uit.append("    duur: " + js_string(m["duur"]) + ",")
        uit.append("    niveau: " + js_string(m["niveau"]) + ",")
        uit.append("    doelen: " + js_waarde(m["doelen"], 4) + ",")
        uit.append("    lessen: [")
        for les in m["lessen"]:
            uit.append("      {")
            uit.append("        id: " + js_string(les["lesId"]) + ",")
            uit.append("        titel: " + js_string(les["titel"]) + ",")
            uit.append("        blokken: " + js_waarde(les["blokken"], 8) + ",")
            uit.append("      },")
        uit.append("    ],")
        uit.append("  },")
    uit.append("];")
    uit.append("")

    pad = os.path.join(root, "js", "inhoud-beleid.js")
    open(pad, "w", encoding="utf-8", newline="\n").write("\n".join(uit))
    n_les = sum(len(m["lessen"]) for m in modules)
    n_blok = sum(len(l["blokken"]) for m in modules for l in m["lessen"])
    print("geschreven:", pad)
    print("modules:", len(modules), "| lessen:", n_les, "| blokken:", n_blok)
    for m in modules:
        print("  ", m["id"], "—", m["titel"], "(" + m["duur"] + ")",
              "lessen:", ", ".join(l["titel"] for l in m["lessen"]))


main()
