# Draait de node-testgevallen vanuit de repo-root en vat het resultaat samen.
# Gebruik: python draai-nodetests.py <tests.json> <repo-root> [id ...]
import json, subprocess, sys, os

tests_pad, root = sys.argv[1], sys.argv[2]
alleen = set(sys.argv[3:]) or None
tests = json.load(open(tests_pad, encoding="utf-8"))
if isinstance(tests, dict):
    tests = tests["tests"]

uit = []
for t in tests:
    if t["soort"] != "node":
        continue
    if alleen and t["id"] not in alleen:
        continue
    try:
        p = subprocess.run(
            ["bash", "-lc", t["script"]],
            cwd=root, capture_output=True, text=True, timeout=180,
            encoding="utf-8", errors="replace",
        )
        tekst = (p.stdout or "") + (p.stderr or "")
    except subprocess.TimeoutExpired:
        tekst, p = "FOUT: tijd op (180s)", None
    regels = [r.strip() for r in tekst.splitlines() if r.strip()]
    staart = regels[-1] if regels else "(geen uitvoer)"
    fout_in_uitvoer = any(r.startswith("FOUT") or "FOUT:" in r for r in regels)
    ok = ("OK" in staart.upper().split() or staart.strip().upper() == "OK") and not fout_in_uitvoer
    if not ok and not fout_in_uitvoer and staart.upper().endswith("OK"):
        ok = True
    uit.append({
        "id": t["id"], "gebied": t.get("gebied", ""), "naam": t["naam"], "ok": bool(ok),
        "staart": staart[:300],
        "uitvoer": tekst[-4000:] if not ok else "",
        "exit": (p.returncode if p else -1),
    })

gezakt = [u for u in uit if not u["ok"]]
print(f"nodetests: {len(uit)} gedraaid, {len(uit)-len(gezakt)} geslaagd, {len(gezakt)} gezakt\n")
for u in uit:
    print(("OK   " if u["ok"] else "ZAKT ") + u["id"] + " [" + u["gebied"] + "] " + u["naam"])
    print("      " + u["staart"].replace("\n", " ")[:220])
print("\n" + "=" * 70)
for u in gezakt:
    print(f"\n### {u['id']} {u['naam']} (exit {u['exit']})\n{u['uitvoer']}")
json.dump(uit, open(os.path.join(os.path.dirname(tests_pad), "uitslag-node.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
