# Eisenhauer Matrix – Claude Memory

## Projekt-Überblick

Progressive Web App (PWA) zur Aufgabenverwaltung nach der Eisenhauer-Matrix. Zusätzlich eine Android-App als Trusted Web Activity (TWA), die die PWA einbettet.

- **PWA:** https://s540d.github.io/Eisenhauer/
- **Android-App:** `Android/` – TWA via `com.google.androidbrowserhelper`

## Branch-Strategie

```
feature/issue-XXX → testing → main (production)
```

`staging` wurde entfernt (2026-06-03, Issue #7).

- PRs für Fixes/Features immer gegen **`testing`** anlegen
- `gh pr merge <nr> --squash --delete-branch` für Feature→testing
- `gh pr merge <nr> --squash` für testing→main (kein `--delete-branch`!)
- **Vor Push:** lokale Tests (`npm test`); kein Merge bei CI-Fail
- `main` ist protected

## Android-App (TWA)

- Package: `com.sven4321.eisenhauer`
- `MainActivity` extends `LauncherActivity` (androidbrowserhelper)
- Konfiguration hauptsächlich über Metadaten in `AndroidManifest.xml`

### Farben (`colors.xml` auf `testing`/aktuellem Stand)

Alle Farben sind `#000000` um das PWA-`manifest.json`-Theme zu spiegeln:
- `statusBarColor`
- `navigationBarColor`

### Splash-Screen (Issue #241, PR #258, gemerged)

Der alte TWA-Splash-Screen (Gradient-Drawable `splash_background.xml` mit Icon in einer Box) wurde entfernt. Es werden keine TWA-seitigen Splash-Screen-Metadaten mehr gesetzt:
- `SPLASH_IMAGE_DRAWABLE` → entfernt
- `SPLASH_SCREEN_BACKGROUND_COLOR` → entfernt
- `SPLASH_SCREEN_FADE_OUT_DURATION` → entfernt

Beim App-Start wird jetzt ausschließlich der moderne PWA-Splash-Screen angezeigt.

## Features

### Sentry Error Monitoring (Issue #263)

`initSentry()` in `js/modules/sentry.js`, aufgerufen als erstes in `initApp()` (script.js).

- Nur in **production** aktiv (`CURRENT_ENV === 'production'` + `VITE_SENTRY_DSN` gesetzt)
- Setzt `window.errorTracker` → klinkt sich in `ErrorHandler._trackError()` ein
- **Benötigte Secrets (GitHub Actions, production environment):**
  - `VITE_SENTRY_DSN` — DSN aus Sentry-Projekt-Settings
  - `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` — für Source-Map-Upload (optional)

### Firebase Analytics (Issue #318)

`logAppOpen()` wird in `initApp()` (script.js) aufgerufen und ist in `js/modules/firebase-init.js` implementiert.

- Nur in **production** aktiv (`CURRENT_ENV === 'production'` + `measurementId` gesetzt)
- Erkennt PWA vs. Browser via `window.matchMedia('(display-mode: standalone)')`
- Loggt Event `app_open` mit Parameter `app_mode: 'standalone' | 'browser'`
- Metriken einsehbar im **Firebase Console → Analytics → Events** (DAU/WAU/MAU unter „Active users")
- Voraussetzung: `VITE_FIREBASE_MEASUREMENT_ID` muss als GitHub Actions Secret gesetzt sein (production environment)

### Export CSV & Markdown (Issue #179, PR #332)

Export-Buttons in den Einstellungen unter „Daten" (kein Feature-Flag):

- `js/modules/export.js` – `exportCsv(tasks, lang)` und `exportMarkdown(tasks, lang)`
- CSV: alle Felder (ID, Text, Quadrant, Kategorie, erstellt, fällig, abgeschlossen)
- Markdown: nach Quadrant gruppiert, mit Checkboxen
- Labels und Datumsformat folgen der aktuellen App-Sprache (de/en)
- i18n: `settings.exportCsvBtn` / `settings.exportMarkdownBtn` in `translations.js`

### Smart Suggest – Quadrant-Vorschlag (Issue #179, PR #332)

Echtzeit-Keyword-Analyse im Quick-Add-Dialog, hinter **Smart Features**-Flag:

- `js/modules/smart-suggest.js` – `suggestSegment(text)` gibt Segment-ID 1–4 oder `null` zurück
- Listener auf `#quickAddInput` in `setupEventListeners()` in `script.js`
- Hinweis-Element `#smartSuggestHint` / `#smartSuggestText` in `index.html`
- Flag-Check: `localStorage.getItem('smartFunctionsEnabled') === 'true'`
- i18n: `smartSuggest.prefix` in `translations.js`; Labels in `SEGMENT_SUGGEST_LABELS` im Modul

### Matrix-Verteilung in den Metriken (Issue #179, PR #332)

Balkendiagramm im Metriken-Dialog, hinter **Smart Features**-Flag:

- `renderMatrixStats(allTasks, lang)` in `script.js` – rendert CSS-Balken ohne externe Library
- Abschnitt `#matrixStatsSection` / `#matrixStatsBars` in `index.html`; nur sichtbar wenn Smart Features aktiv
- CSS-Klassen in `style.css`: `.matrix-stats-bars`, `.matrix-stats-row`, `.matrix-stats-bar-wrap`, `.matrix-stats-bar`
- i18n: `metrics.matrixStats` in `translations.js`

### Quick-Add-Modal: kompaktes Layout (PR #346)

Das „Neue Aufgabe"-Fenster (`#quickAddModal` in `index.html`, geöffnet via `openQuickAddModal()` in `js/modules/ui.js`) wurde verschlankt, weil selten genutzte Optionen zu viel Platz beanspruchten:

- **Wiederholung** (`#quickRecurringEnabled`) und **Fälligkeit** (`#quickDueDateEnabled`) sind jetzt Checkbox+Icon-Buttons (`.icon-toggle`, `#quickRecurringToggle` / `#quickDueDateToggle`) im selben cleanen SVG-Stil wie der Fokus-Modus-Toggle (`#focusModeToggle`, Feather-Icons mit `stroke="currentColor"`, Rahmen aus `--card-bg`/`--grid-color`). Aktiv-Zustand: Klasse `icon-toggle-checked`, Akzentfarbe `#667eea` + Glow (Listener in `script.js`, `setupEventListeners()`).
- Checkbox-Fälligkeit blendet `#quickAddDueDate` ein und ruft `showPicker()` auf, um den nativen Kalender direkt zu öffnen.
- **Abbrechen**-Button entfernt (Schließen weiterhin per Klick außerhalb des Modals).
- **Hinzufügen**-Button entfernt; stattdessen ein **OK**-Button (`#quickAddSubmitBtn`, Text aus `lang.buttons.ok`) direkt neben dem Eingabefeld (`.quick-add-input-row`).
- Neuer i18n-Key `buttons.ok` (de/en) in `translations.js`.

### Kategorien / Kalender-Umschalter (Issue #198 + #259, PR #260)

Aufgaben haben ein optionales Feld `task.category` mit den Werten `'private'` oder `'business'` (siehe `filterByCategory` in `js/modules/tasks.js`). Aufgaben ohne Kategorie werden beim Filtern wie `'private'` behandelt.

- **#198:** Kategorisierung eingeführt (Datenmodell, Filter, Quick-Add-Auswahl), aber hinter einem Settings-Schalter versteckt.
- **#259/#260:** Sichtbarer, segmentierter **Umschalter** im Header (`#categorySwitcher`, Buttons `Alle / Privat / Beruflich`). Persistiert in `localStorage` unter `categoryFilter` (`''` = Alle). Filtert beim Render und der Quick-Add-Dialog wählt die aktive Kategorie vor (pro Aufgabe überschreibbar, inkl. „Keine"). Es gibt **keinen** separaten Auto-Assign-Schalter mehr – die sichtbare Quick-Add-Vorauswahl ist die einzige Quelle der Wahrheit (alle Adds laufen über das Modal).
- i18n: `categoryFilter.{switcherLabel,all,private,business,...}` in `js/modules/translations.js`; `updateLanguageUI` aktualisiert Button-Texte **und** das barrierefreie `aria-label` des Switchers.

### Design-Tokens, Onboarding & Micro-Interactions (Issue #352 B1–B3)

**B1 – Design-Tokens konsolidieren:** Die zuvor toten CSS-Variablen `--primary-color`, `--primary`, `--primary-rgb` und `--hover-bg` sind jetzt in `:root` (und im `prefers-color-scheme: dark`-Block für `--hover-bg`) echt definiert (`#667eea` / `102, 126, 234`). Alle Literal-Hex-Vorkommen von `#667eea` in `style.css` (außer der Segment-Farbmap in `script.js`, die eine andere Bedeutung hat) wurden durch `var(--primary-color)` ersetzt.

**B2 – Onboarding & Empty States:** Neues Modul `js/modules/onboarding.js`. Solange eine Aufgaben-Matrix komplett leer ist (kein Task je hinzugefügt) und Onboarding nicht dismissed wurde, zeigt `renderSegment()` in `js/modules/ui.js` pro leerem Segment 1–4 einen dismissable Demo-Task samt kurzer Quadranten-Erklärung (`translations.js` → `onboarding.{demoTasks,explanations,demoBadge,dismissLabel}`). Nach dem ersten echten `handleAddTask()`-Aufruf (script.js) wird Onboarding dauerhaft über `dismissOnboarding()` beendet (localStorage `onboardingDismissed`), damit es nicht wiederkehrt, wenn die Matrix später erneut leer wird. Einzelne Demo-Tasks lassen sich per ✕ ausblenden (`dismissSegmentDemo()`, localStorage `onboardingDemoDismissed`); sind alle vier dismissed, gilt Onboarding ebenfalls als beendet. Danach (und für Segment 5 „Fertig!") zeigt jedes leere Segment eine freundliche Empty-State-Message (`translations.js` → `emptyState.{1-5}`).

**B3 – Micro-Interactions & Motion:** „Erledigt"-Häkchen lösen eine kurze Puls-/Glow-Animation aus (`createTaskElement()` in `ui.js` fügt `task-completing` hinzu, `callbacks.onToggle` wird erst nach ~220ms aufgerufen; bei `prefers-reduced-motion: reduce` sofort ohne Delay). Drag & Drop dimmt jetzt alle Nicht-Ziel-Quadranten (`body.is-dragging .segment:not(.drag-target-segment)`) sowohl im Touch-Pfad (`DragManager#activateDragMode`/`#detectDropTarget`) als auch im Desktop-HTML5-DnD-Pfad (`#handleDragStart`/`#handleDragEnd`/`setupDropZone()` in `drag-manager.js`). Alle neuen Animationen sind im bestehenden `@media (prefers-reduced-motion: reduce)`-Block am Ende von `style.css` deaktiviert.

## Test-Coverage (Stand 2026-06-19)

Gemessen über 9 Unit-Test-Suites (ohne `storage.test.js`, die Firebase-Credentials benötigt):

| Metrik | Wert |
|---|---|
| Statements | 91.0% |
| Branches | 80.8% |
| Functions | 97.7% |
| Lines | 90.9% |

- Schwellenwerte in `vitest.config.js`: alle auf **80%** gesetzt (schlägt fehl wenn darunter)
- CI führt Tests mit `--exclude="tests/unit/storage.test.js"` aus
- Coverage-Badge in `README.md` verlinkt auf `ci-cd.yml`

## Offene Issues (Backlog-Stand 2026-06-19)

| # | Titel | Prio |
|---|-------|------|
| #263 | Sentry-Integration (Error Monitoring) | Medium |
| #265 | CONTRIBUTING.md erstellen | Low |
| #266 | JSDoc-Kommentare für alle public functions | Low |
| #256 | Dependency Updates (firebase, vite, vitest, playwright, eslint) | Low |
| #245 | Security-Header (CSP) – Phase 2 & 3 ausstehend | Medium |
| #254 | Firebase Spark-Tarif prüfen | – |

### Kürzlich erledigt

- **#352 B1–B3** – Design-Tokens konsolidiert (`--primary-color`/`--primary`/`--primary-rgb`/`--hover-bg` echt definiert), Onboarding mit dismissable Demo-Tasks + Quadranten-Erklärung + freundlichen Empty States (`js/modules/onboarding.js`), „Erledigt"-Micro-Interaction + klareres Drag-Feedback (Segment-Dimming), siehe Abschnitt „Design-Tokens, Onboarding & Micro-Interactions" oben
- **PR #346** – Quick-Add-Modal verschlankt: Icon-Toggles für Wiederholung/Fälligkeit (Stil des Fokus-Modus-Toggles), Cancel-Button entfernt, Add-Button durch OK neben dem Eingabefeld ersetzt
- **#179** – Export CSV/Markdown, Smart Suggest (Quadrant-Vorschlag), Matrix-Verteilung in Metriken (PR #332, gemerged 2026-06-19)
- **#257** – `docs/last-backup.txt` mit letztem manuellen Export-Datum erstellt
- **#264** – Test-Coverage auf 80%+ angehoben; vitest-Schwellenwerte auf 80%; Badge in README
- **#286** – Falscher Testname in `render-resilience.test.js` korrigiert; echter Skip-Test ergänzt
- **#232** – War bereits als geschlossener PR erledigt (docs-Konsolidierung, 2026-02-20)

Epic #95 (Production-Grade Dev Setup) wurde am 2026-05-30 als `completed` geschlossen. Die vier offenen Punkte daraus sind in #263–#266 erfasst.

## Bekannte Eigenheiten

- Beim Rebase von `main`-basierten Branches auf `testing` gibt es Konflikte in `AndroidManifest.xml` und `colors.xml`, weil `testing` die Farb-Struktur grundlegend überarbeitet hat (alles `#000000`, keine `colorPrimary` mehr).

<!-- GLOBAL POLICY:START -->
## [GLOBAL POLICY]

> Automatisch synchronisiert aus project-templates (Issue #7). Nicht manuell editieren –
> Änderungen hier werden beim nächsten Sync überschrieben. Quelle anpassen statt lokal.

- PRs immer gegen `testing`, nie direkt gegen `staging` oder `main`
- Merge auf `main` nur mit expliziter schriftlicher Freigabe
- `--delete-branch` nur für Feature-Branches (nie staging/testing)
- **Lokales Branch-Cleanup:** `main` und `testing` NIE löschen — auch nicht beim Bulk-Delete verwaister `[gone]`-Branches. Ein fehlender `origin/main`/`origin/testing` ist ein **wiederherzustellender Defekt** (lokal behalten, nach origin zurückpushen), kein Aufräum-Signal.
- `--no-verify` nur auf explizite Bitte
- **Vor jedem Push: lokale Tests ausführen** (`npm test` bzw. projektspezifischer Test-Befehl) – kein Push ohne grüne lokale Tests
- **Kein Merge bei CI-Fail** – Branch Protection erzwingt das technisch; nie mit `--admin` umgehen außer auf explizite Bitte

## [ANDROID BUILD – PFLICHTREGELN]

- **Git-Tag** nach jedem Play-Store-Upload setzen: `git tag vX.Y.Z && git push origin vX.Y.Z` – der Tag markiert den tatsächlich veröffentlichten Stand und dient als Changelog-Baseline für den nächsten Build
- **EAS Local Build (DrawFromMemory):** Workingdir vor jedem Build leeren: `rm -rf ~/tmp/eas-build && mkdir -p ~/tmp/eas-build` – ein nicht-leeres Verzeichnis bricht den Build sofort ab
- **Disk-Check vor EAS Build:** Skia-Libraries benötigen ~5–8 GB. Bei < 5 GB frei: `npm cache clean --force && rm -rf ~/.npm/_npx` (~13 GB, sicher löschbar)
- **JAVA_HOME** für EAS/Expo-Builds explizit auf Android Studio JBR setzen: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- **Gradle-Lock nach Absturz:** Bei "Cannot lock file hash cache"-Fehler Daemons stoppen: `pkill -f GradleDaemon`, dann Workingdir leeren und neu starten
- **AAB-Archiv:** Gebaute Release-AABs in einem **gitignored** `aab-archive/`-Verzeichnis im Repo-Root ablegen (in `.gitignore` aufnehmen – AABs sind 3–110 MB und gehören nie in die Git-History). Benennung: `<Projekt>-vX.Y.Z-vc<versionCode>-YYYY-MM-DD.aab`. **Retention: max. 2 Dateien** (aktuelles Release + ein Vorgänger für schnelles Rollback); ältere AABs löschen. Der Git-Tag `vX.Y.Z` ist die eigentliche Release-Baseline – ältere AABs lassen sich daraus jederzeit neu bauen.

## [CI – CACHE-CLEANUP]

- **Cache-Cleanup-Workflow** (`.github/workflows/cache-cleanup.yml`) in jedem Repo mit GitHub-Actions-Caches: löscht wöchentlich (So 03:00 UTC) bzw. on-demand alle Action-Caches älter als der jeweils letzte Lauf. GitHub-Limit ist 10 GB pro Repo – ohne Cleanup laufen Build-Caches (node_modules, Gradle, Expo) voll und verdrängen frische Einträge. Vorlage: `cache-cleanup.yml` in project-templates.
<!-- GLOBAL POLICY:END -->
