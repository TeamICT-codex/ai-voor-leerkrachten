"""Zet de velden intro en onthoud bij de lessen in de inhoudsbestanden.

Gebruik (vanuit de repo-root):

    python test/zet-lesregels.py regels.json [meer.json ...]

Elk JSON-bestand heeft de vorm {"moduleId/lesId": {"intro": "...", "onthoud": "..."}}.
Het script zoekt de les op in js/inhoud-beleid.js, js/inhoud.js, js/casussen.js
en js/inhoud-vibe.js, en zet de twee velden net na de regel met minuten. Heeft
een les de velden al, dan worden ze vervangen. Gemaakt in oktober 2026 voor de
make-over van de cursus; het staat hier zodat de stap te herhalen is (zie
"alles wat een volgende sessie nodig heeft, hoort in de repo" in CLAUDE.md).
"""
import json
import re
import sys

BESTANDEN = ['js/inhoud-beleid.js', 'js/inhoud.js', 'js/casussen.js', 'js/inhoud-vibe.js']


def js_tekst(t, teken):
    # Een JavaScript-string in de stijl van het bestand: casussen.js schrijft met
    # dubbele aanhalingstekens, de andere inhoudsbestanden met enkele.
    if teken == '"':
        return json.dumps(t, ensure_ascii=False)
    return "'" + t.replace('\\', '\\\\').replace("'", "\\'") + "'"


def aanhalingsteken(bron):
    return '"' if bron.count('titel: "') > bron.count("titel: '") else "'"


def zet(bron, module_id, les_id, velden):
    m = re.search(r"""\bid:\s*['"]%s['"]""" % re.escape(module_id), bron)
    if not m:
        return None
    # Elke module heeft net onder haar id een "icoon:"; de volgende module begint
    # dus bij de tweede "icoon:" na deze id. Zo blijft het zoeken naar de les
    # binnen de juiste module.
    iconen = list(re.finditer(r"""\bicoon:""", bron[m.end():]))
    einde = m.end() + iconen[1].start() if len(iconen) > 1 else len(bron)
    l = re.search(r"""\bid:\s*['"]%s['"]""" % re.escape(les_id), bron[m.end():einde])
    if not l:
        return None
    start = m.end() + l.end()
    mi = re.search(r"""\n(\s*)minuten:\s*\d+,\n""", bron[start:])
    if not mi:
        raise SystemExit(f'geen minuten gevonden bij {module_id}/{les_id}')
    inspring = mi.group(1)
    na = start + mi.end()
    # Bestaande velden weghalen, zodat het script twee keer mag draaien. Een veld
    # dat niet in het JSON-bestand staat, blijft zoals het was: zo kan een
    # correctie enkel de onthoud vervangen.
    rest = bron[na:]
    teken = aanhalingsteken(bron)
    regel = re.compile(r"""%s(intro|onthoud):\s*(".*?(?<!\\)"|'.*?(?<!\\)'),\n""" % re.escape(inspring))
    bestaand = {}
    while (r := regel.match(rest)):
        bestaand[r.group(1)] = r.group(0)
        rest = rest[r.end():]
    nieuw = ''.join(
        f"{inspring}{k}: {js_tekst(velden[k], teken)},\n" if velden.get(k) else bestaand.get(k, '')
        for k in ('intro', 'onthoud'))
    return bron[:na] + nieuw + rest


def main(paden):
    regels = {}
    for p in paden:
        regels.update(json.load(open(p, encoding='utf-8')))
    bronnen = {b: open(b, encoding='utf-8').read() for b in BESTANDEN}
    gezet = 0
    for sleutel, velden in regels.items():
        module_id, les_id = sleutel.split('/')
        for b in BESTANDEN:
            uit = zet(bronnen[b], module_id, les_id, velden)
            if uit is not None:
                bronnen[b] = uit
                gezet += 1
                break
        else:
            raise SystemExit(f'les niet gevonden: {sleutel}')
    for b, s in bronnen.items():
        open(b, 'w', encoding='utf-8').write(s)
    print(f'{gezet} lessen bijgewerkt')


if __name__ == '__main__':
    main(sys.argv[1:])
