"""Neemt de teaser op.

Serveert de site zoals test/server.py, en ontvangt daarnaast de beelden die de
filmmodus van de voorpagina (?film&opname) één voor één doorstuurt. Na het
laatste beeld maakt het er met ffmpeg een MP4 van, met de muziek van muziek.py
eronder. Zie LEESMIJ.md in deze map.

    python teaser/opname.py [poort]      (standaard 8010)
    python teaser/opname.py maak         alleen de film opnieuw uit de bewaarde beelden

Luistert alleen op deze computer (127.0.0.1).
"""
import http.server
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

HIER = Path(__file__).resolve().parent
ROOT = HIER.parent
UIT = HIER / 'uit'
BEELDEN = UIT / 'beelden'


def zoek_ffmpeg():
    pad = shutil.which('ffmpeg')
    if pad:
        return pad
    try:
        import imageio_ffmpeg  # pip install imageio-ffmpeg brengt een eigen ffmpeg mee
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return None


def maak_film(info):
    ffmpeg = zoek_ffmpeg()
    if not ffmpeg:
        return {'fout': 'Geen ffmpeg gevonden: installeer ffmpeg of pip install imageio-ffmpeg.'}
    fps = int(info.get('fps', 30))
    formaat = re.sub(r'[^a-z]', '', str(info.get('formaat', 'breed'))) or 'breed'
    aantal = len(list(BEELDEN.glob('*.jpg')))
    duur = aantal / fps
    muziek = UIT / 'muziek.wav'
    subprocess.run([sys.executable, str(HIER / 'muziek.py'), str(muziek), str(duur)], check=True)
    naam = 'ai-op-school-teaser' + ('' if formaat == 'breed' else f'-{formaat}') + '.mp4'
    doel = UIT / naam
    opdracht = [
        ffmpeg, '-y', '-loglevel', 'error',
        '-framerate', str(fps), '-i', str(BEELDEN / '%05d.jpg'),
        '-i', str(muziek),
        # JPEG gebruikt het volle kleurbereik; video het beperkte (bt709). Zonder
        # die omzetting tonen sommige spelers en sociale media de film flets.
        '-vf', 'scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
        '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        # Vlakke kleuren en strakke randen: daar is de stand voor animatie op gemaakt.
        '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '21',
        '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart',
        str(doel),
    ]
    subprocess.run(opdracht, check=True)
    print(f'Klaar: {doel.relative_to(ROOT)} ({aantal} beelden, {duur:.1f} s)')
    return {'bestand': str(doel.relative_to(ROOT)).replace('\\', '/')}


class Opname(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def antwoord(self, gegevens):
        body = json.dumps(gegevens).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        lengte = int(self.headers.get('Content-Length') or 0)
        data = self.rfile.read(lengte)
        pad, _, vraag = self.path.partition('?')
        if pad == '/opname/begin':
            shutil.rmtree(BEELDEN, ignore_errors=True)
            BEELDEN.mkdir(parents=True)
            return self.antwoord({'ok': True})
        if pad == '/opname/beeld':
            n = re.fullmatch(r'n=(\d{1,5})', vraag)
            if not n:
                return self.send_error(400)
            (BEELDEN / f'{int(n.group(1)):05d}.jpg').write_bytes(data)
            return self.antwoord({'ok': True})
        if pad == '/opname/klaar':
            try:
                return self.antwoord(maak_film(json.loads(data or b'{}')))
            except subprocess.CalledProcessError as fout:
                return self.antwoord({'fout': str(fout)})
        self.send_error(404)

    def log_message(self, formaat, *args):
        # Negenhonderd regels voor negenhonderd beelden helpen niemand.
        if args and '/opname/beeld' in str(args[0]):
            return
        super().log_message(formaat, *args)


if __name__ == '__main__':
    # python teaser/opname.py maak [formaat]: alleen de film opnieuw maken uit de
    # beelden van de vorige opname, bv. na een andere muziek of andere instellingen.
    if len(sys.argv) > 1 and sys.argv[1] == 'maak':
        print(maak_film({'fps': 30, 'formaat': sys.argv[2] if len(sys.argv) > 2 else 'breed'}))
        sys.exit()
    poort = int(sys.argv[1]) if len(sys.argv) > 1 else 8010
    # Gebruik 127.0.0.1 en niet localhost: dat laatste probeert de browser eerst
    # via IPv6, waar deze server niet luistert, en dan hapert af en toe een beeld.
    print(f'Opname klaar op http://127.0.0.1:{poort}/?film&opname')
    http.server.ThreadingHTTPServer(('127.0.0.1', poort), Opname).serve_forever()
