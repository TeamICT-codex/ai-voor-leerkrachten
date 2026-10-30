"""Leest teksten van Leerlichtjes in met een stem van Gemini (Google).

Dit gebeurt één keer vooraf, op de computer van wie de site onderhoudt. De
werelden spelen daarna gewone geluidsbestanden af: tijdens de les gaat er
niets naar een AI-dienst. De sleutel komt uit de omgevingsvariabele
GEMINI_API_KEY; op Windows lezen we hem anders uit de instellingen van de
gebruiker, zodat je na het instellen de computer niet hoeft te herstarten. De
sleutel wordt nooit getoond of bewaard.

    python lager/stem/gemini.py alles [aantal]     lees in wat nog ontbreekt (zie LEESMIJ.md)
    python lager/stem/gemini.py modellen           welke voorleesmodellen er zijn
    python lager/stem/gemini.py proef <map>        proefstemmen om uit te kiezen

Met een aantal leest `alles` alleen de eerste teksten van de lijst in: om eerst
te proberen met een handvol, voor je het geheel laat inlezen.
"""
import base64
import hashlib
import json
import os
import shutil
import subprocess
import sys
import threading
import time
import unicodedata
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

API = 'https://generativelanguage.googleapis.com/v1beta'
# Het voorleesmodel; `modellen` toont welke er nu zijn. Op 30 oktober 2026
# getest: de nieuwere modellen lazen de regieaanwijzing mee voor, dit niet, en
# met deze aanwijzing klonk het Vlaams (zie LEESMIJ.md).
MODEL = 'gemini-2.5-pro-preview-tts'
# Het model dat elk ingelezen bestand weer uitschrijft, ter controle.
CONTROLEMODEL = 'gemini-3.8-flash'

# Een korte regieaanwijzing vóór een dubbelpunt: zo stuur je de toon zonder dat
# ze voorgelezen wordt. In het Engels werkte dat beter dan in het Nederlands.
STIJL = ('Say in a warm, calm Flemish accent (Belgian Dutch from Flanders), like a kind primary school teacher, '
         'and pronounce "AI" as the Dutch letters "aa ie": ')

# De twee stemmen van Leerlichtjes: de map op de site en de stem bij Gemini.
STEMMEN = {'juf': 'Sulafat', 'meester': 'Achird'}
MAP = Path(__file__).resolve().parent
POGINGEN = 3   # zoveel keer lezen we een tekst hoogstens in
TEGELIJK = 3   # zoveel verzoeken lopen er hoogstens tegelijk


class GeminiFout(Exception):
    """Gemini weigert het verzoek. Bij `alles` stopt het inlezen dan."""

    def __init__(self, code, melding):
        super().__init__(f'Gemini antwoordde {code}: {melding}')
        self.code = code


def sleutel():
    waarde = os.environ.get('GEMINI_API_KEY')
    if not waarde and sys.platform == 'win32':
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as k:
                waarde = winreg.QueryValueEx(k, 'GEMINI_API_KEY')[0]
        except OSError:
            waarde = None
    if not waarde:
        sys.exit('Geen sleutel gevonden: zet GEMINI_API_KEY (zie lager/stem/LEESMIJ.md).')
    return waarde


def wachttijd(melding, poging):
    """Hoe lang we wachten voor we opnieuw proberen. Bij te veel verzoeken zegt
    Google soms zelf hoe lang (retryDelay); we wachten nooit langer dan 90 s."""
    tijd = 5 * 2 ** (poging - 1)
    try:
        for detail in json.loads(melding)['error'].get('details', []):
            if str(detail.get('retryDelay', '')).endswith('s'):
                tijd = max(tijd, float(detail['retryDelay'][:-1]) + 1)
    except (ValueError, KeyError, TypeError, AttributeError):
        pass
    return min(tijd, 90)


def vraag(pad, gegevens=None, pogingen=5):
    verzoek = urllib.request.Request(
        f'{API}/{pad}',
        data=json.dumps(gegevens).encode('utf-8') if gegevens is not None else None,
        headers={'x-goog-api-key': sleutel(), 'Content-Type': 'application/json'},
        method='POST' if gegevens is not None else 'GET',
    )
    for poging in range(1, pogingen + 1):
        try:
            with urllib.request.urlopen(verzoek, timeout=180) as antwoord:
                return json.loads(antwoord.read())
        except urllib.error.HTTPError as fout:
            melding = fout.read().decode('utf-8', 'replace')
            # Te veel verzoeken of een drukke dienst: even wachten en opnieuw.
            if fout.code in (429, 500, 502, 503, 504) and poging < pogingen:
                time.sleep(wachttijd(melding, poging))
                continue
            # De foutmelding van Google, zonder de sleutel (die zit in een kop, niet in het adres).
            raise GeminiFout(fout.code, melding[:500])
        except (urllib.error.URLError, TimeoutError):
            if poging == pogingen:
                raise
            time.sleep(5 * 2 ** (poging - 1))


def modellen():
    uit, pagina = [], ''
    while True:
        antwoord = vraag('models?pageSize=200' + (f'&pageToken={pagina}' if pagina else ''))
        uit += [m['name'].split('/', 1)[1] for m in antwoord.get('models', []) if 'tts' in m['name'].lower()]
        pagina = antwoord.get('nextPageToken')
        if not pagina:
            return uit


def zoek_ffmpeg():
    pad = shutil.which('ffmpeg')
    if pad:
        return pad
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit('Geen ffmpeg gevonden: installeer ffmpeg of pip install imageio-ffmpeg.')


def lees_in(tekst, stem, doel, model):
    """Leest één tekst in en bewaart hem als mp3: mono, 24 kHz, 40 kbit/s. Dat
    volstaat voor een stem en houdt de site licht."""
    antwoord = vraag(f'models/{model}:generateContent', {
        'contents': [{'parts': [{'text': STIJL + tekst}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': stem}}, 'languageCode': 'nl-BE'},
        },
    })
    deel = antwoord['candidates'][0]['content']['parts'][0]['inlineData']
    # Gemini geeft ruwe 16-bits PCM terug; de bemonstering staat in het mimetype.
    tempo = 24000
    for stuk in deel.get('mimeType', '').split(';'):
        if stuk.strip().startswith('rate='):
            tempo = int(stuk.split('=')[1])
    doel = Path(doel)
    doel.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        zoek_ffmpeg(), '-y', '-loglevel', 'error',
        '-f', 's16le', '-ar', str(tempo), '-ac', '1', '-i', 'pipe:0',
        # stilte aan begin en einde weg, en even luid als de rest
        '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-1.5',
        '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '40k', str(doel),
    ], input=base64.b64decode(deel['data']), check=True)


def schrijf_uit(pad):
    """Laat een ingelezen bestand weer uitschrijven: zo hoor je zonder luisteren
    of er iets ontbreekt, of er iets bij kwam, en hoe de tongval klinkt."""
    data = base64.b64encode(Path(pad).read_bytes()).decode()
    antwoord = vraag(f'models/{CONTROLEMODEL}:generateContent', {'contents': [{'parts': [
        {'inlineData': {'mimeType': 'audio/mp3', 'data': data}},
        {'text': 'Schrijf letterlijk uit wat er gezegd wordt, op één regel, zonder aanhalingstekens of opmaak. '
                 'Zet op de tweede regel enkel VLAAMS, NEDERLANDS of ONZEKER: hoe klinkt de spreker?'}]}]})
    regels = antwoord['candidates'][0]['content']['parts'][0]['text'].strip().splitlines()
    return regels[0].strip(), (regels[-1].strip() if len(regels) > 1 else 'ONZEKER')


def woorden(tekst):
    # Accenten tellen niet mee: "én" en "en" klinken bijna hetzelfde, en het
    # uitschrift kan het verschil niet horen. Getallen blijven wel staan.
    zonder = ''.join(c for c in unicodedata.normalize('NFKD', tekst) if not unicodedata.combining(c))
    return [w for w in ''.join(c.lower() if c.isalnum() else ' ' for c in zonder).split()]


def klopt(tekst, uitschrift):
    """Hoeveel van de woorden overeenkomen, en of er woorden bij kwamen (zoals
    een voorgelezen regieaanwijzing)."""
    a, b = woorden(tekst), woorden(uitschrift)
    gemeen = sum(min(a.count(w), b.count(w)) for w in set(a))
    return gemeen / max(1, len(a)), len(b) - len(a)


# ───────────────────────────── alles inlezen ─────────────────────────────

def sleutel_van(tekst):
    """De naam van het bestand: de eerste 12 tekens van de SHA-1 van de tekst.
    Verandert er één letter, dan is het een nieuwe opname."""
    return hashlib.sha1(tekst.encode('utf-8')).hexdigest()[:12]


def lees_json(pad, anders):
    try:
        return json.loads(Path(pad).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return anders


def schrijf_json(pad, gegevens):
    Path(pad).write_text(json.dumps(gegevens, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


druk_slot = threading.Lock()


def meld(regel):
    with druk_slot:
        print(regel, flush=True)


def neem_op(naam, tekst, sleutel_):
    """Leest één tekst in met één stem, en kijkt hem na. Klopt het uitschrift
    niet woord voor woord, of kwam er iets bij, dan lezen we opnieuw in, tot
    POGINGEN keer. We houden de beste poging."""
    doel = MAP / naam / f'{sleutel_}.mp3'
    pogingen = []
    for poging in range(1, POGINGEN + 1):
        pad = doel.with_name(f'{sleutel_}.poging{poging}.mp3')
        try:
            lees_in(tekst, STEMMEN[naam], pad, MODEL)
            uitschrift, tongval = schrijf_uit(pad)
        except GeminiFout:
            raise
        except Exception as fout:  # geen geluid gekregen, of een antwoord dat we niet kunnen lezen
            meld(f'  {naam} {sleutel_}: poging {poging} mislukt ({type(fout).__name__})')
            pad.unlink(missing_ok=True)
            continue
        deel, extra = klopt(tekst, uitschrift)
        pogingen.append({'pad': pad, 'uitschrift': uitschrift, 'tongval': tongval, 'score': round(deel, 3), 'extra': extra})
        if deel == 1 and extra == 0:
            break
    if not pogingen:
        return None
    beste = max(pogingen, key=lambda p: (p['score'], -abs(p['extra'])))
    beste['pad'].replace(doel)
    for p in pogingen:
        if p is not beste:
            p['pad'].unlink(missing_ok=True)
    return {'tekst': tekst, 'uitschrift': beste['uitschrift'], 'score': beste['score'], 'extra': beste['extra'],
            'tongval': beste['tongval'], 'pogingen': len(pogingen)}


def alles(aantal=None):
    teksten = lees_json(MAP / 'teksten.json', None)
    if not teksten:
        sys.exit('Geen lager/stem/teksten.json: draai eerst node lager/stem/verzamel.mjs.')
    sleutels = {t: sleutel_van(t) for t in teksten}
    if len(set(sleutels.values())) != len(sleutels):
        sys.exit('Twee teksten krijgen dezelfde bestandsnaam. Maak de sleutel in gemini.py en stem.js langer.')

    # Wat we eerder nakeken, blijft staan zolang het bestand er nog is.
    controle = lees_json(MAP / 'controle.json', {})
    alle = {k: v for k, v in controle.get('alle', {}).items()
            if (MAP / k).exists() and v.get('tekst') in sleutels and k.endswith(f'/{sleutels[v["tekst"]]}.mp3')}

    kies = teksten[:aantal] if aantal else teksten
    taken = [(naam, t, sleutels[t]) for naam in STEMMEN for t in kies if not (MAP / naam / f'{sleutels[t]}.mp3').exists()]
    tekens = sum(len(t) for _, t, _ in taken)
    print(f'{len(teksten)} teksten in de lijst; {len(taken)} opnames te maken ({tekens} tekens), '
          f'met hoogstens {TEGELIJK} verzoeken tegelijk.', flush=True)

    stoppen = threading.Event()
    fouten = []
    gedaan = [0]

    def taak(t):
        naam, tekst, sleutel_ = t
        if stoppen.is_set():
            return
        try:
            uitslag = neem_op(naam, tekst, sleutel_)
        except GeminiFout as fout:
            fouten.append(fout)
            stoppen.set()
            return
        with druk_slot:
            gedaan[0] += 1
            if uitslag:
                alle[f'{naam}/{sleutel_}.mp3'] = uitslag
                teken = 'ok' if uitslag['score'] == 1 and uitslag['extra'] == 0 else 'NAKIJKEN'
                print(f'[{gedaan[0]}/{len(taken)}] {naam:7} {sleutel_}  woorden {uitslag["score"]:.0%}, '
                      f'{uitslag["extra"]:+d} extra, {uitslag["tongval"].lower()}, {uitslag["pogingen"]}x  {teken}', flush=True)
            else:
                print(f'[{gedaan[0]}/{len(taken)}] {naam:7} {sleutel_}  MISLUKT, ook na {POGINGEN} pogingen', flush=True)

    try:
        with ThreadPoolExecutor(TEGELIJK) as pool:
            list(pool.map(taak, taken))
    finally:
        # Opruimen: halve pogingen, en opnames van teksten die niet meer bestaan.
        geldig = set(sleutels.values())
        weg = 0
        for naam in STEMMEN:
            for mp3 in (MAP / naam).glob('*.mp3'):
                if mp3.stem not in geldig:
                    mp3.unlink()
                    weg += 1
        # De lijst voor de werelden: elke tekst die met beide stemmen ingelezen is.
        lijst = {t: sleutels[t] for t in teksten if all((MAP / naam / f'{sleutels[t]}.mp3').exists() for naam in STEMMEN)}
        schrijf_json(MAP / 'lijst.json', {'stemmen': STEMMEN, 'teksten': lijst})
        # Het controlerapport.
        alle = {k: alle[k] for k in sorted(alle) if (MAP / k).exists()}
        nakijken = sorted(({'bestand': b, **v} for b, v in alle.items() if v['score'] < 1 or v['extra'] != 0),
                          key=lambda v: (v['score'], v['bestand']))
        # Hoe het tweede model de tongval inschat. Bij korte zinnen gokt het vaak:
        # daarom lezen we daarvoor niet opnieuw in, maar tellen we alleen.
        tongval = {naam: {} for naam in STEMMEN}
        for bestand, v in alle.items():
            telling = tongval[bestand.split('/')[0]]
            telling[v['tongval'].upper()] = telling.get(v['tongval'].upper(), 0) + 1
        schrijf_json(MAP / 'controle.json', {
            'uitleg': 'Elke opname werd door een tweede model uitgeschreven en woord voor woord vergeleken met de tekst. '
                      f'Onder "nakijken" staan de opnames die ook na {POGINGEN} pogingen nog afweken: beluister die '
                      'even. Vaak schrijft het uitschrift alleen een getal of een woord anders dan de tekst. Wil je '
                      'er een opnieuw laten inlezen? Wis het bestand en draai alles opnieuw. Onder "alle" staat het '
                      'uitschrift van elke opname.',
            'nakijken': nakijken,
            'tongval': tongval,
            'alle': alle,
        })
        print(f'lijst.json: {len(lijst)} van de {len(teksten)} teksten met beide stemmen. '
              f'Opgeruimd: {weg} bestanden. Na te kijken: {len(nakijken)} (zie controle.json).', flush=True)
    if fouten:
        sys.exit(f'Gestopt: {fouten[0]}\nWat al ingelezen was, blijft staan. Draai alles later opnieuw om verder te gaan.')


PROEFTEKSTEN = {
    '1ste-graad': 'Een slimme speaker. Met een computer erin, of: Zonder computer? '
                  'Juist! In een slimme speaker zit een computer. Hij luistert en hij praat.',
    '2de-graad': 'In dit huis staat een slimme speaker. Dat is een toestel dat luistert en praat. Deze speaker heet Bolleke. '
                 'Bolleke luistert de hele tijd of hij zijn naam hoort. Hoort hij "Hé Bolleke", dan gaat zijn lampje branden.',
    '3de-graad': 'Daar kom je AI vaker tegen, ook bij taken en huiswerk. Soms helpt AI je om beter te leren. '
                 'De meeste chatbots mag je pas gebruiken vanaf 13 jaar, en tot je 18 bent met toestemming van je ouders.',
}
# Stemmen die warm en rustig klinken; Google geeft ze namen van sterren.
PROEFSTEMMEN = ['Sulafat', 'Achird', 'Vindemiatrix', 'Puck']


if __name__ == '__main__':
    opdracht = sys.argv[1] if len(sys.argv) > 1 else ''
    try:
        if opdracht == 'alles':
            alles(int(sys.argv[2]) if len(sys.argv) > 2 else None)
        elif opdracht == 'modellen':
            print('\n'.join(modellen()) or 'geen voorleesmodellen gevonden')
        elif opdracht == 'proef':
            map_ = Path(sys.argv[2] if len(sys.argv) > 2 else 'proefstemmen')
            model = sys.argv[3] if len(sys.argv) > 3 else MODEL
            for stem in PROEFSTEMMEN:
                for graad, tekst in PROEFTEKSTEN.items():
                    pad = map_ / f'{stem.lower()}-{graad}.mp3'
                    if not pad.exists():
                        lees_in(tekst, stem, pad, model)
                    uitschrift, tongval = schrijf_uit(pad)
                    deel, extra = klopt(tekst, uitschrift)
                    print(f'{stem:13} {graad:10} woorden {deel:.0%}, {extra:+d} extra, klinkt {tongval}')
        else:
            print(__doc__)
    except GeminiFout as fout:
        sys.exit(str(fout))
