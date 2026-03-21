---
### Titel
Sicherheitslücken in Build- und Tooling-Abhängigkeiten (7× hoch, 1× moderat)

### Befund
- `npm audit` nach `npm ci` meldet **8 Schwachstellen** in der Toolchain (ReDoS, Path Traversal, RCE-Risiken).
- Betroffene transitive Pakete: `minimatch` (mehrere ReDoS-Advisories), `rollup` (Arbitrary File Write via Path Traversal), `serialize-javascript` (RCE über RegExp.flags), `flatted` (DoS/Prototype Pollution) sowie `ajv` (ReDoS bei `$data`).
- Die Ketten sind in den Build-Schritten aktiv (Vite/rollup/workbox/vite-plugin-pwa) und beeinflussen sowohl lokale Dev-Server als auch Service-Worker-Bundles.

### Nachweis
- Ausgeführt: `npm audit` (21.03.2026) → 7× High, 1× Moderate.
- Relevante Advisories: GHSA-3ppc-4f35-3m26 / GHSA-7r86-cg39-jmmj (minimatch), GHSA-mw96-cpmx-2vgc (rollup), GHSA-5c6j-r48x-rmvq (serialize-javascript), GHSA-25h7-pfq9-p65f & GHSA-rf6f-7fwh-wjgh (flatted), GHSA-2g4f-4pwh-qvx6 (ajv).

### Risiko
- DoS durch Regex-Backtracking in Datei-Pattern-Matching.
- Manipulation oder Schadcodeeinschleusung über anfällige Build-Tooling-Komponenten (rollup/terser/workbox) bis hin zu ausgelieferten Bundles und Service-Workern.
- Potenziell Remote Code Execution im Build-Kontext über `serialize-javascript`.

### Empfehlung
- Abhängigkeiten auf die gepatchten Versionen anheben (mindestens: `rollup` ≥ 4.59.0, `minimatch` ≥ 10.0.3 bzw. gepatchte Version laut Advisory, `serialize-javascript` ≥ 7.0.5, `flatted` ≥ 3.4.2, `ajv` ≥ 8.18.0).
- `vite-plugin-pwa`/`workbox-build` aktualisieren, damit transitive `@rollup/plugin-terser` und `serialize-javascript` auf sichere Versionen ziehen.
- Nach den Updates: `npm test`/`npm run build` ausführen und Service-Worker neu generieren, anschließend erneut `npm audit`.

### Priorität / Schweregrad
Hoch – betrifft Build-Pipeline und ausgelieferte Artefakte.
