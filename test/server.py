"""Een lokale server voor de hele site, die de browser vraagt niets te bewaren.

Gebruik (vanuit de repo-root of waar ook):

    python test/server.py          # http://localhost:8000/
    python test/server.py 8080     # een andere poort

Waarom niet gewoon `python -m http.server`? Die stuurt geen Cache-Control mee,
en dan beslist de browser zelf hoelang hij een bestand bijhoudt. Na een wijziging
aan een inhoudsbestand toonde hij zo nog minutenlang de oude versie: een nieuwe
module die er "niet is", een knop die "niet werkt". Deze server stuurt bij elk
bestand `no-store`, zodat herladen altijd de versie op schijf toont. Online, op
GitHub Pages, speelt dit niet: daar regelt GitHub de caching.
"""
import functools
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class ZonderCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


def main():
    poort = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(ZonderCache, directory=ROOT)
    with http.server.ThreadingHTTPServer(('', poort), handler) as server:
        print(f'De site draait op http://localhost:{poort}/ (leeromgeving: /leeromgeving/), zonder cache.')
        server.serve_forever()


if __name__ == '__main__':
    main()
