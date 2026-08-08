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

### CI-Gate: PRs gegen `testing` laufen praktisch ohne CI (#381)

Seit PR #381 triggern `ci-cd.yml` und `standards-audit.yml` nur noch bei `pull_request` gegen **`main`**. Auf einem PR Feature→`testing` läuft daher nur `mergeability` (plus CodeQL/Security-Scans) – **keine Unit-Tests, kein Lint, kein Build, kein E2E**. Der `push`-Trigger auf `testing` greift erst *nach* dem Merge.

Praktische Konsequenzen:

- **`npm test` und `npm run lint` lokal ausführen ist nicht optional**, sondern der einzige Gate vor `testing`. Grünes CI auf einem Feature-PR sagt nichts über die Tests aus.
- Das erste echte CI-Gate ist der Release-PR `testing` → `main`. Regressionen fallen dort gebündelt auf, nicht mehr am einzelnen Feature-PR.
- Beim Bewerten eines gemergten PRs nie aus „CI war grün" auf „Tests liefen" schließen – erst prüfen, *welche* Checks überhaupt getriggert wurden.

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

### Edge-to-Edge / Android 15 API-Deprecations (Issue #368, PR #374, gemerged)

Play Console meldete die Verwendung nicht mehr unterstützter Edge-to-Edge-APIs (`setStatusBarColor`/`setNavigationBarColor`/`LAYOUT_IN_DISPLAY_CUTOUT_MODE_*`, seit Android 15 deprecated). Die gemeldeten Stacktraces zeigen ausschließlich auf `com.google.androidbrowserhelper`-Klassen (`EdgeToEdgeUtils`, `LauncherActivity`) – die App selbst ruft keine dieser APIs direkt auf (Konfiguration läuft rein über `STATUS_BAR_COLOR`/`NAVIGATION_BAR_COLOR`-Metadaten in `AndroidManifest.xml`, siehe oben).

- `com.google.androidbrowserhelper:androidbrowserhelper` **2.5.0 → 2.7.2** angehoben (`Android/app/build.gradle`) – Version 2.7.1 behebt laut Changelog explizit „Deprecations in launcher activity“, 2.7.0 bringt zusätzlich Edge-to-Edge-Support für den Splash-Screen.
- Kein eigener App-Code betroffen, daher keine weiteren Änderungen nötig.
- Nach dem nächsten Play-Store-Upload prüfen, ob die Play-Console-Warnung verschwindet.

### R8/ProGuard-Optimierung (Issue #367, PR #375, gemerged – Verifikation offen)

Play Console meldete für Release 25 (1.12.1), dass die R8-Optimierung nicht greift. Ursache: `Android/app/proguard-rules.pro` enthielt `-keep class androidx.** { *; }`, was **jede** AndroidX-Klasse pauschal vor Shrinking/Optimierung/Obfuskation schützte – da AndroidX den Großteil des TWA-Codes ausmacht, blieb R8 praktisch nichts zu tun übrig.

- Die Regel wurde entfernt. Bewusst **unverändert** blieben `-keep class com.google.androidbrowserhelper.** { *; }` (Reflection) und `-keep class androidx.browser.** { *; }` (prozessübergreifende Bindung, TWA-kritisch) sowie das breite `-dontwarn androidx.**` (als `TODO(#367)` im File markiert, bis ein sauberer Release-Build zeigt, welche Warnungen real sind).
- **⚠️ Nicht auf einem echten Gerät getestet.** Kein CI-Check baut einen Android-Release (die Workflows bauen die PWA + Playwright-E2E gegen den Browser) – grünes CI im gemergten PR #375 sagt zu diesem Fix nichts aus. Zu aggressiv entfernte Keep-Regeln brechen erst zur Laufzeit (TWA startet nicht, Splash hängt, Deep Links tot), nicht beim Build.
- **Vor dem nächsten Play-Store-Upload zwingend:** `cd Android && ./gradlew bundleRelease` bauen und auf einem echten Gerät testen (App-Start, Splash, Deep Links, Status-/Navigationsleisten-Farbe). Ein Debug-Build genügt nicht – `minifyEnabled` gilt nur für `release`.
- **Bei einem Laufzeit-Crash:** keine pauschale `-keep class androidx.** { *; }`-Regel wiedereinsetzen (macht den Fix wirkungslos), sondern eine gezielte Regel für die konkret betroffene Klasse ergänzen.
- Issue #367 bleibt bis zum erfolgreichen Gerätetest offen.

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

### Cloud-Backup: blockiert durch Firebase-Tarif (Issue #355, #359)

Cloud-Backup (`js/modules/backup.js`, Firebase **Storage**) schlägt aktuell fehl. Root-Cause-Analyse zu #355 fand einen Pfad-Mismatch zwischen dem tatsächlichen Upload-Pfad (`users/{userId}/backups/{filename}`) und dem in `docs/FIREBASE_SECURITY_RULES.md` dokumentierten Storage-Rule-Pfad (`backups/{userId}/{backupFile}`) – **das ist aber nicht der eigentliche Blocker**: Seit Oktober 2024 verlangt Firebase für Cloud Storage grundsätzlich den kostenpflichtigen **Blaze-Tarif** (Projekt läuft auf Spark, siehe #254). Ein reiner Pfad-Fix lässt sich ohne Blaze-Upgrade nicht mal in der Firebase Console deployen/testen.

- **Nicht erneut versuchen:** einen reinen Storage-Rules-Pfad-Fix zu implementieren (siehe PR #358, verworfen) – löst das Problem nicht.
- **Architekturentscheidung offen in #359:** Firestore-Migration (empfohlen, bleibt im kostenlosen Spark-Tarif) vs. Feature entfernen vs. So lassen. Details, Trade-offs und TODO-Checkliste stehen in #359.
- Bis zur Entscheidung: `reportBackupError()`-Ansatz (Fehler an Sentry statt nur `console.error`) wurde in PR #358 skizziert, aber ebenfalls verworfen – bei Umsetzung von #359 erneut aufgreifen.

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

### Performance: `saveAllTasks()` per Firestore-Batch (Issue #337)

`saveAllTasks()` in `script.js` (genutzt bei Reorder und Import) schrieb für angemeldete Nutzer bisher jede Aufgabe einzeln sequentiell mit `await saveTaskToFirestore(...)` – bei vielen Aufgaben spürbar blockierend.

- Neue Funktion `saveAllTasksToFirestore(tasksBySegment, userId, db)` in `js/modules/storage.js` – schreibt alle Tasks über `writeBatch`, in Chunks à max. 500 Operationen (Firestore-Batch-Limit), analog zum bestehenden Muster in `importGuestTasksToFirestore`.
- `saveAllTasks()` ruft jetzt `saveAllTasksToFirestore()` statt der Einzel-Write-Schleife auf.
- **Bestehende Exports bleiben unverändert importierbar:** `saveTaskToFirestore`, `updateTaskInFirestore`, `deleteTaskFromFirestore` und alle anderen Storage-Exports wurden nicht entfernt oder umbenannt – einzelne Task-Operationen (Add/Update/Delete) laufen weiterhin über diese Funktionen inkl. Offline-Queue/Retry-Logik. `saveAllTasksToFirestore` ist ein rein additiver neuer Export.
- Gast-Modus (`saveGuestTasks`) unverändert.

### Bestehende Aufgaben bearbeiten (PR #378)

Klick auf den Task-Text öffnet das bestehende Quick-Add-Modal (`openQuickAddModal()` in `js/modules/ui.js`) wieder – vorausgefüllt statt leer – und speichert Änderungen per `updateTask()` (`js/modules/tasks.js`) statt eine neue Aufgabe anzulegen. Kein separates Edit-Modal.

- `openQuickAddModal(segmentId, onAddTask, translations, currentLanguage, existingTask = null)` – neuer optionaler 5. Parameter `existingTask`. Ist er gesetzt: Text/Fälligkeit/Wiederholung/Kategorie/Notiz werden vorausgefüllt, Titel wird zu `lang.quickAddModal.editTitle` ("Aufgabe bearbeiten"/"Edit Task"), der Submit-Button zu `lang.buttons.save` ("Speichern"/"Save") statt `lang.buttons.ok`.
- **Callback-Signatur erweitert:** `onAddTask(text, segmentId, recurring, dueDate, category, notes, taskId)` – `taskId` ist der neue, angehängte 7. Parameter (`existingTask?.id ?? null`), analog zu `notes` (Issue #371/PR #372, gemergt kurz vor #378 – deshalb Merge-Konflikt in `ui.js` beim Zusammenführen der beiden Feature-Branches, siehe unten). Bestehende Aufrufer, die `onAddTask` mit der alten (kürzeren) Signatur implementieren, funktionieren unverändert weiter – der zusätzliche Parameter wird einfach ignoriert, wenn nicht referenziert.
- `createTaskElement()` in `ui.js`: Klick auf `.task-content` (nicht auf Checkbox/Wiederholungs-Icon/Notiz-Icon/Löschen-Button – die stoppen weiterhin `event.propagation`) ruft `callbacks.onEditTask(task)`. Neue CSS-Klasse `.task-content-editable` (`cursor: pointer`) als visueller Hinweis.
- `script.js`: `handleEditTask(taskText, segment, recurringConfig, dueDate, category, notes, taskId)` ruft `updateTask()` auf und speichert je nach Modus (Firestore/`saveGuestTasks`); `handleOpenEditTask(task)` öffnet das Modal im Edit-Modus; beide über `onEditTask: handleOpenEditTask` in `renderTasksWithCallbacks()` verdrahtet.
- **Kein Segment-Wechsel im Edit-Modus** – das Modal hat keinen Segment-Picker, Editieren ändert nur Text/Fälligkeit/Wiederholung/Kategorie/Notiz im selben Quadranten.
- i18n: neue Keys `buttons.save` und `quickAddModal.editTitle` in `translations.js` (de/en).

### Optionale Task-Felder löschen: `deleteField()` statt Feld weglassen

`updateTaskInFirestore()` in `js/modules/storage.js` schreibt mit `setDoc(..., { merge: true })`. Ein **weggelassenes** Feld bedeutet dort „alten Wert behalten" – nicht „Feld löschen". Optionale Felder, die der Nutzer leeren kann, dürfen deshalb nie über ein `if (task.x) { updateData.x = task.x; }` geschrieben werden, sondern müssen den leeren Fall explizit als `deleteField()` senden:

```js
updateData.dueDate = task.dueDate ? task.dueDate : deleteField();
```

Betroffen sind `completedAt`, `recurring`, `dueDate`, `category` und `notes`. Vorher war nur `notes` so umgesetzt (PR #373); die übrigen vier hatten den Bug, was durch den Edit-Dialog aus PR #378 sichtbar wurde: Fälligkeit/Kategorie im Dialog leeren → lokal korrekt weg → nach dem Reload wieder da. `completedAt` traf es beim Abwählen einer erledigten Aufgabe (`task.completedAt = null` in `tasks.js`), was die Metriken verfälscht.

- **Nur der Firebase-Modus war betroffen** – `saveGuestTasks()` serialisiert das Task-Objekt komplett und kennt das Problem nicht.
- Regression-Tests in `tests/unit/storage.test.js` (`describe('updateTaskInFirestore clearable fields')`) mit gemocktem `firebase/firestore`. **Achtung:** Diese Suite ist in der CI per `--exclude` ausgeschlossen, die Tests laufen also nur lokal über `npm test`.
- Beim Ergänzen weiterer optionaler Task-Felder: immer dem `deleteField()`-Muster folgen.

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

## Offene Issues (Backlog-Stand 2026-07-29, nach Konsolidierung)

Der Backlog wurde am 2026-07-29 von 19 auf 7 offene Issues konsolidiert (erledigte geschlossen, Duplikate zusammengeführt, Alt-Issues aus 2025 abgeräumt).

| # | Titel | Prio |
|---|-------|------|
| #359 | **Cloud-Backup: Blaze-Tarif nötig** – Architekturentscheidung offen (Firestore-Migration empfohlen). Bündelt auch die allgemeine Spark-/Blaze-Tarif-Frage (vormals #254) | Medium |
| #352 | **Strategie/Epic: App aufwerten** – Dachplanung (Reflect/Focus/Capture), löst das alte Brainstorm #179 ab. B1–B3 erledigt, A1–A5/B4/B5/C offen | Medium |
| #367 | Android: R8-Fix gemerged (PR #375), **Gerätetest steht aus** – siehe Abschnitt „R8/ProGuard-Optimierung" oben, nicht vor dem nächsten Play-Store-Upload ohne diesen Test | Medium |
| #385 | Robustheits-Lücken aus dem Review von PR #382: Bulk-Save ohne Offline-Queue/Retry, Notizen ohne Gast→Login-Migration + fehlend im Backup, kein Click-Suppress nach Long-Press | Medium |
| #348 | Meta: Rest-Punkte aus Cleanup 2026-07-08 – nur noch lokaler Stash + Dependency-Update-PR | Low |
| #324 | Sentry-Projekt anlegen + Secrets in GitHub Actions hinterlegen (reiner Ops-Task, Code ist fertig) | Medium |
| #296 | Cross-App Task Integration (MCP-Server, Firebase REST + Bot-User) | Low |
| #351 | Import von Apple Reminders (.ics) – gehört unter #352 „Capture" | Low |
| #266 | JSDoc-Kommentare für alle public functions | Low |

> **Wichtig für künftige Backlog-Updates:** Diese Tabelle listete zuvor mehrere längst geschlossene Issues (#263, #265, #256, #245). Vor dem Ergänzen bitte gegen die tatsächlich offenen Issues auf GitHub abgleichen, nicht blind fortschreiben.

### Backlog-Konsolidierung 2026-07-29

Geschlossen und warum – damit nicht später erneut aufgemacht:

| # | Grund |
|---|-------|
| #369, #371 | bereits umgesetzt (PR #372 bzw. #373, beide auf `testing`), Issues nur nie geschlossen |
| #330 | bereits seit PR #360 auf `testing` umgesetzt |
| #337, #368 | umgesetzt in PR #374 |
| #179 | abgelöst durch #352 (sagt das im eigenen Body) |
| #355 | Duplikat von #359 (Symptom vs. Root Cause) |
| #254 | mit #359 zusammengeführt – gleiche Tarif-Entscheidung |
| #126 | wontfix, entsprechend der Empfehlung im Issue selbst („Do Nothing") |
| #55 | wontfix – GitHub-Pages-Pfade sind inhärent case-sensitive, ohne eigene Domain nicht lösbar |
| #36 | Gamification kollidiert mit der Anti-Bloat-Regel aus #352 |
| #19 | eigene Domain aktuell nicht geplant |

### Kürzlich erledigt

- **PR #383** – `updateTaskInFirestore()` löscht geleerte optionale Felder jetzt explizit per `deleteField()` (`completedAt`, `recurring`, `dueDate`, `category`; `notes` war seit PR #373 schon korrekt). Vorher blieb ein im Edit-Dialog geleertes Feld wegen `merge: true` in Firestore stehen und tauchte nach dem Reload wieder auf; `completedAt` verfälschte zusätzlich die Metriken. Nur der Firebase-Modus war betroffen. Gefunden beim Review von PR #382, siehe Abschnitt „Optionale Task-Felder löschen" oben
- **PR #378** – Bestehende Aufgaben lassen sich per Klick auf den Task-Text im wiederverwendeten Quick-Add-Modal bearbeiten (Prefill + `updateTask()` statt neuer Aufgabe); siehe Abschnitt „Bestehende Aufgaben bearbeiten" oben
- **#368** – `androidbrowserhelper` 2.5.0 → 2.7.2 angehoben, behebt Play-Console-Meldung zu deprecated Edge-to-Edge-APIs (`setStatusBarColor`/`setNavigationBarColor`) in der TWA-Library; kein eigener App-Code betroffen; siehe Abschnitt „Edge-to-Edge / Android 15 API-Deprecations" oben (PR #374, gemerged)
- **#337** – `saveAllTasks()` nutzt jetzt `saveAllTasksToFirestore()` (Firestore `writeBatch`, gechunkt à 500 Ops) statt sequentieller Einzel-Writes; bestehende Storage-Exports unverändert importierbar, siehe Abschnitt „Performance: saveAllTasks() per Firestore-Batch" oben (PR #374, gemerged)
- **#367 (Code-Teil)** – blanket `-keep class androidx.** { *; }` aus `proguard-rules.pro` entfernt (PR #375, gemerged); Issue bleibt offen bis zum Gerätetest, siehe Abschnitt „R8/ProGuard-Optimierung" oben
- **#330** – `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }` in `ci-cd.yml`, `pr-review.yml`, `standards-audit.yml`, `mergeability.yml`, `build-android.yml`, `cache-cleanup.yml` ergänzt (Vorlage: `deploy-unified.yml`), verhindert redundante Parallel-Läufe bei schnell aufeinanderfolgenden Pushes (PR #360). Umsetzung bereits auf `testing`; das GitHub-Issue war nur nicht geschlossen worden.
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
