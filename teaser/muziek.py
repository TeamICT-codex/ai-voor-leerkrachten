"""Maakt de muziek onder de teaser: een vrolijk, licht deuntje in F majeur.

Alles wordt hier met numpy berekend, er zit geen opname of sample in: zo is er
geen auteursrecht van iemand anders mee gemoeid. Het tempo is 106,67 slagen per
minuut, zodat één maat 2,25 seconden duurt: precies zo lang als een half shot
in film.js. Op elke wissel van shot klinkt een belletje.

    python teaser/muziek.py uit.wav [duur in seconden]
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
SLAG = 0.5625            # seconden per tel
MAAT = 4 * SLAG          # 2,25 seconden
rng = np.random.default_rng(7)


def freq(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# Akkoorden per maat: F, C, Dm, Bb. Pad (midden), arpeggio (hoog) en bas.
PAD = [[57, 60, 65], [55, 60, 64], [57, 62, 65], [58, 62, 65]]
ARP = [[65, 69, 72, 77], [64, 67, 72, 76], [62, 65, 69, 74], [62, 65, 70, 74]]
BAS = [41, 36, 38, 34]
PATROON = [0, 1, 2, 3, 1, 2, 3, 2]


def omhulling(n, aanzet, los, totaal=None):
    """Een eenvoudige omhullende: lineair aanzetten, vlak, en zacht uitsterven."""
    env = np.ones(n)
    a = max(1, int(aanzet * SR))
    env[:a] = np.linspace(0, 1, a)
    r = max(1, int(los * SR))
    if r < n:
        env[-r:] *= np.linspace(1, 0, r) ** 2
    return env


def leg(spoor, klank, start, pan=0.0):
    """Legt een klank (mono) op een stereospoor, met panning van -1 tot 1."""
    i = int(start * SR)
    if i >= spoor.shape[1]:
        return
    klank = klank[: spoor.shape[1] - i]
    links, rechts = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    spoor[0, i:i + len(klank)] += klank * links
    spoor[1, i:i + len(klank)] += klank * rechts


def pad_noot(midi, duur):
    n = int(duur * SR)
    t = np.arange(n) / SR
    f = freq(midi)
    klank = np.zeros(n)
    for ontstem in (0.9985, 1.0015):
        for k in range(1, 7):
            klank += np.sin(2 * np.pi * f * ontstem * k * t + rng.uniform(0, 6.28)) / k * np.exp(-0.35 * k)
    return klank * omhulling(n, 0.35, 0.7)


def tokkel(midi, duur, demping=0.995):
    """Karplus-Strong: een snaar van ruis die zichzelf uitdempt, blok per blok."""
    n = int(duur * SR)
    periode = max(2, int(round(SR / freq(midi))))
    vorig = rng.uniform(-1, 1, periode)
    vorig = np.convolve(vorig, [0.5, 0.5], mode='same')
    blokken, laatste = [vorig], vorig[-1]
    totaal = periode
    while totaal < n:
        verschoven = np.concatenate(([laatste], vorig[:-1]))
        nieuw = demping * 0.5 * (vorig + verschoven)
        laatste = vorig[-1]
        blokken.append(nieuw)
        vorig = nieuw
        totaal += periode
    klank = np.concatenate(blokken)[:n]
    return klank * omhulling(n, 0.002, 0.15)


def bas_noot(midi, duur):
    n = int(duur * SR)
    t = np.arange(n) / SR
    f = freq(midi)
    klank = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    return klank * omhulling(n, 0.008, 0.08) * (0.75 + 0.25 * np.exp(-t * 6))


def trom():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    toon = 45 + 75 * np.exp(-t * 28)
    fase = 2 * np.pi * np.cumsum(toon) / SR
    return np.sin(fase) * np.exp(-t * 9) + rng.uniform(-1, 1, n) * np.exp(-t * 250) * 0.15


def handklap():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    ruis = rng.uniform(-1, 1, n)
    ruis = ruis - np.convolve(ruis, np.ones(6) / 6, mode='same')
    env = np.zeros(n)
    for d in (0.0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 60), 0)
    return ruis * env * 0.6 + ruis * np.exp(-t * 18) * 0.25


def schudder(sterk):
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    ruis = rng.uniform(-1, 1, n)
    ruis = ruis - np.convolve(ruis, np.ones(3) / 3, mode='same')
    return ruis * np.exp(-t * 70) * (1.0 if sterk else 0.55)


def belletje(midi):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    f = freq(midi)
    klank = np.zeros(n)
    for deel, sterkte, verval in ((1, 1, 3.2), (2.0, 0.45, 5), (3.01, 0.25, 7), (4.17, 0.18, 9), (5.43, 0.1, 12)):
        klank += sterkte * np.sin(2 * np.pi * f * deel * t) * np.exp(-t * verval)
    return klank * omhulling(n, 0.003, 0.3)


def zucht(duur):
    """Een opwaaiend ruisje dat naar het volgende deel toe zwelt."""
    n = int(duur * SR)
    ruis = rng.uniform(-1, 1, n)
    ruis = np.convolve(ruis, np.ones(4) / 4, mode='same')
    return ruis * np.linspace(0, 1, n) ** 2.2 * omhulling(n, 0.01, 0.05)


def galm(spoor, lengte=1.8, nat=0.22):
    """Een eenvoudige galm: het spoor gevouwen met uitstervende ruis."""
    n = int(lengte * SR)
    t = np.arange(n) / SR
    uit = np.zeros_like(spoor)
    for kanaal in range(2):
        ir = rng.uniform(-1, 1, n) * np.exp(-t * 3.6)
        ir[0] = 0
        lengte_fft = 1 << int(np.ceil(np.log2(spoor.shape[1] + n)))
        gevouwen = np.fft.irfft(np.fft.rfft(spoor[kanaal], lengte_fft) * np.fft.rfft(ir, lengte_fft), lengte_fft)
        uit[kanaal] = gevouwen[: spoor.shape[1]]
    uit *= nat / (np.max(np.abs(uit)) + 1e-9) * np.max(np.abs(spoor))
    return spoor + uit


def maak(duur):
    n = int(duur * SR)
    zacht = np.zeros((2, n))    # pad, tokkel en belletjes: met galm
    droog = np.zeros((2, n))    # bas en slagwerk: zonder
    maten = int(np.ceil(duur / MAAT))
    slot = 12                    # vanaf maat 12 (27 s): het slotakkoord
    for m in range(maten):
        start = m * MAAT
        a = m % 4
        if m >= slot:
            # het slotakkoord: F, lang uitklinkend
            for noot in PAD[0] + [53]:
                leg(zacht, pad_noot(noot, duur - start) * 0.16, start, pan=0)
            leg(zacht, belletje(89) * 0.14, start, pan=0.2)
            leg(zacht, belletje(84) * 0.1, start + 0.02, pan=-0.2)
            leg(droog, bas_noot(41, min(3.0, duur - start)) * 0.32, start)
            break
        for noot in PAD[a]:
            leg(zacht, pad_noot(noot, MAAT + 0.6) * (0.08 if m < 2 else 0.11), start, pan=rng.uniform(-0.5, 0.5))
        for i, idx in enumerate(PATROON):
            sterkte = (0.15 if m < 2 else 0.2) * (1.0 if i % 2 == 0 else 0.8)
            leg(zacht, tokkel(ARP[a][idx], 0.9) * sterkte, start + i * SLAG / 2, pan=0.35 if i % 2 else -0.35)
        volle_band = 2 <= m < 10
        if volle_band:
            for tel, lengte in ((0, 0.9), (1.5, 0.4), (2, 0.9), (3.5, 0.4)):
                leg(droog, bas_noot(BAS[a], lengte * SLAG) * 0.34, start + tel * SLAG)
            for tel in (0, 2):
                leg(droog, trom() * 0.55, start + tel * SLAG)
            if m >= 4:
                for tel in (1, 3):
                    leg(droog, handklap() * 0.17, start + tel * SLAG, pan=0.1)
        if m >= 2:
            for achtste in range(8):
                leg(droog, schudder(achtste % 2 == 1) * (0.05 if volle_band else 0.035), start + achtste * SLAG / 2, pan=0.4)
        if m in (1, 11):
            # naar het volgende deel toe: een opwaaiend ruisje in de tweede helft
            leg(zacht, zucht(MAAT / 2) * 0.05, start + MAAT / 2)
        if m in (2, 4, 6, 8, 10):
            leg(zacht, belletje(84 if m % 4 == 2 else 89) * 0.11, start, pan=0.25)
    spoor = galm(zacht) + droog
    # zacht begrenzen, normaliseren tot -1 dB en uitfaden
    spoor = np.tanh(spoor * 1.4)
    spoor *= 0.89 / (np.max(np.abs(spoor)) + 1e-9)
    spoor[:, : int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    uitfade = int(min(2.2, duur * 0.1) * SR)
    spoor[:, -uitfade:] *= np.linspace(1, 0, uitfade) ** 1.5
    return spoor


def schrijf(pad, spoor):
    data = (np.clip(spoor.T, -1, 1) * 32767).astype('<i2').tobytes()
    with wave.open(str(pad), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


if __name__ == '__main__':
    doel = Path(sys.argv[1] if len(sys.argv) > 1 else 'muziek.wav')
    duur = float(sys.argv[2]) if len(sys.argv) > 2 else 30.0
    doel.parent.mkdir(parents=True, exist_ok=True)
    schrijf(doel, maak(duur))
    print(f'Muziek: {doel} ({duur:.1f} s)')
