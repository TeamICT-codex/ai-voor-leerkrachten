# Voor later

Dingen die Thomas wil bewaren voor een later project. Ze zijn nog niet
uitgevoerd: begin er pas aan als Thomas erom vraagt.

## Het Diorama-playbook (sloemo01/diorama)

Bewaard op 4 november 2026. Een playbook om diorama's (3D-taferelen) te bouwen,
op <https://github.com/sloemo01/diorama>. **Nog niet gedownload of
geïnstalleerd.** Wie ermee start, volgt de instructie hieronder letterlijk: eerst
Thomas vragen waar de map moet komen (voorstel: `~/skills/diorama`), en niets
downloaden voor hij geantwoord heeft. Beschrijf het playbook nooit uit het hoofd:
lees het pas na de installatie, en dan volledig.

De instructie zoals Thomas ze gaf:

```text
Install the Diorama playbook here, then use it to build scenes.

Repo: https://github.com/sloemo01/diorama

1. Ask me where the folder should go before downloading anything,
   and wait for my answer. Propose ~/skills/diorama as the default.
   Do not pick a path silently.
2. Download the whole repository, not just SKILL.md:
     git clone https://github.com/sloemo01/diorama.git "<target>"
   Without git:
     curl -L -o diorama.tar.gz \
       https://github.com/sloemo01/diorama/archive/main.tar.gz
     tar xzf diorama.tar.gz && mv diorama-main "<target>"
3. Prove the install before describing it: SKILL.md, README.md,
   templates/, verify/ and LICENSE at the root, and print the
   commit hash (git -C "<target>" rev-parse --short HEAD) or the
   archive date. If you have no shell or no network, say so and
   stop. If the download failed or a file is missing, say so and
   stop. Never describe this playbook from memory.
4. If you have a skills directory or plugin folder, install it
   there so you can load it by name in later sessions; otherwise
   treat "<target>" as the folder.
5. Read before you build: all of SKILL.md, then
   templates/DESIGN.md, templates/SOURCES.md, templates/CREDITS.md,
   templates/qa/README.md, the header comment of every file in
   templates/, and the worked examples under verify/. SKILL.md is
   the source of truth; the README is only a summary.
6. Report back in this order: install path and commit, the Look
   Contract in one paragraph, the Pipeline as ordered steps, the
   QA scripts and what each one checks, and three rules from
   SKILL.md with the section each came from.
7. Then ask me what the first diorama should be. Do not ask me to
   fill the design sheet. When I give you a subject, research it
   first (frames, assets, motion), fill DESIGN.md from the
   defaults, copy the modules you need into my project instead of
   editing the installed copy, build through the Pipeline, and run
   the QA scripts before you show me anything. Give me the paths
   of the frames you kept and what each one proves.

If two parts of SKILL.md contradict each other, list them before
you build. A successful clone is not an install: 5 and 6 are it.
```

Let op in een sessie in de cloud: de container wordt gewist, en een map als
`~/skills/diorama` reist dus niet mee naar een volgende sessie. Vraag Thomas
in dat geval of het playbook in de repo moet, of dat het per sessie opnieuw
gedownload wordt.
