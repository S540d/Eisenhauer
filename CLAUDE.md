# Eisenhauer — Projekt-Instruktionen für Claude

## Projekt-Übersicht
PWA (Progressive Web App) + Android TWA für Aufgabenverwaltung nach der Eisenhauer-Matrix.
Vanilla JS ES6+, Vite 5.4, Firebase v10, IndexedDB (localforage), Vitest.

## Branch-Strategie
```
main (production) ← staging ← testing
```
- Arbeit IMMER auf `testing`
- PR gegen `staging` (`gh pr create --base staging --head testing`)
- Sync main→staging/testing über separate PRs
- `gh pr merge <nr> --merge` — kein `--no-edit` Flag

## Häufige Fallstricken
- **Edit-Tool:** Datei MUSS im selben Kontext mit Read gelesen werden
- **git checkout:** Bei dirty files → `git stash` vorher
- **gh issue list:** Kein `--since` Flag, nutze `-S` oder `-L`
- **ESLint no-empty:** Leere catch-Blöcke brauchen einen Kommentar, nicht nur `_`-Prefix
- **store.js:** `setState` und `setNestedState` haben kein `source`-Parameter mehr

## Versions-Management
- `package.json` → PWA-Version (manuelle Änderung)
- `Android/app/build.gradle` → versionCode + versionName
- `version.json` + `manifest.json` → werden automatisch beim `npm run build` gesetzt
- Play Store: versionCode muss bei jedem Upload höher sein

## Aktuelle Version
- PWA: 1.10.1 | Android: versionCode 19
- ESLint: 0 Probleme
- Tests: 150 passing, 7/8 Suites grün
- `storage.test.js`: pre-existing Failure (Firebase nicht gemockt) — nicht angehen

## Neue Features (auf testing)
- **Due Dates:** Optionale Fälligkeitsdaten für Aufgaben
- **Smart Urgency Rules:** Automatische Dringend-Markierung bei Fälligkeit in 3 Tagen
- **Verbesserte Spracherkennung:** Robustere Auto-Detection mit English-Fallback

## Offene Arbeit
- **Issue #155:** Major Dep Updates (Firebase 12, Vite 7) — breaking changes, separat behandeln

## Splash Screen
- Inline SVG in `index.html` (`id="splashScreen"`) — Kreuz + 4 Checkmarks
- Animationen per stroke-dasharray in `style.css`
- `manifest.json` background_color + `index.html` theme-color: `#000000`
- JS-Logik in `script.js` ~Zeile 982: min 500ms, max 2s, dann `.hidden`

## npm audit
- 15 Vulnerabilities in Firebase-Abhängigkeiten (14 moderate, 1 high)
- Zugehörig zu Issue #155
