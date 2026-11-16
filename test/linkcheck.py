"""Linkcontrole over de hele site: elke href en src in de HTML en elke url() in
de CSS moet naar een bestaand bestand wijzen. Links die JavaScript pas maakt,
ziet dit script niet: die controleert de browserronde.

    python test/linkcheck.py .        (vanuit de repo-root)

De laatste regel telt de verwijzingen; elke kapotte staat erboven met KAPOT.
"""
import os
import re
import sys
from urllib.parse import unquote

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
SLA_OVER = ('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:', '#', '//')
fouten = []
gezien = 0


def bestaat(pad):
    if os.path.isdir(pad):
        return os.path.isfile(os.path.join(pad, 'index.html'))
    return os.path.isfile(pad)


def controleer(bron, doel):
    global gezien
    if not doel or doel.startswith(SLA_OVER) or '${' in doel:
        return
    schoon = unquote(doel.split('#')[0].split('?')[0])
    if not schoon:
        return
    gezien += 1
    if schoon.startswith('/'):
        pad = os.path.join(ROOT, schoon.lstrip('/'))
    else:
        pad = os.path.normpath(os.path.join(os.path.dirname(bron), schoon))
    if not bestaat(pad):
        fouten.append((os.path.relpath(bron, ROOT), doel))


for map_, _, bestanden in os.walk(ROOT):
    rel = os.path.relpath(map_, ROOT)
    if rel.split(os.sep)[0] in ('.git', 'node_modules', 'leerlingen-bron', 'test', '.claude'):
        continue
    for b in bestanden:
        p = os.path.join(map_, b)
        if b.endswith('.html'):
            s = open(p, encoding='utf-8').read()
            for m in re.finditer(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', s):
                controleer(p, m.group(1))
        elif b.endswith('.css'):
            s = open(p, encoding='utf-8').read()
            for m in re.finditer(r'''url\(\s*["']?([^"')]+)["']?\s*\)''', s):
                controleer(p, m.group(1))

for bron, doel in sorted(set(fouten)):
    print('KAPOT', bron, '->', doel)
print(f'{gezien} verwijzingen nagekeken, {len(set(fouten))} kapot')
sys.exit(1 if fouten else 0)
