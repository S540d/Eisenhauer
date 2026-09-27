# Incident-Archiv

Ausführliche Vorfalls-Dokumentation (Root Cause, Diagnose-Verlauf, Fix, Verifikation). `CLAUDE.md` verweist von der jeweiligen Kernregel hierher – Details bitte hier pflegen, nicht dort duplizieren (project-templates#160).

## App-Start-Crash: ManageDataLauncherActivity fehlte im Manifest (Issue #434, PR #435/#436, gemerged, Release v1.12.5/vc30)

Nach dem androidbrowserhelper-Upgrade 2.5.0 → 2.7.2 (#368/PR #374) stürzte die App auf **allen** Geräten beim Start ab (nicht API-Level-spezifisch – ursprünglicher Verdacht auf den zeitgleich angehobenen `minSdk` 21→23 traf nicht zu, ebenso wenig der R8-Verdacht aus #367). Logcat zeigte:

```
IllegalArgumentException: Component class
com.google.androidbrowserhelper.trusted.ManageDataLauncherActivity
does not exist in com.sven4321.eisenhauer
```

- **Root Cause:** `androidbrowserhelper` referenziert `ManageDataLauncherActivity` zur Laufzeit per `PackageManager.setComponentEnabledSetting()` (in `LauncherActivity.launchTwa` → `addSiteSettingsShortcut`). Die Komponente ist **nicht** Teil der AAR selbst (verifiziert per AAR-Extraktion) – sie muss von der konsumierenden App explizit im eigenen `AndroidManifest.xml` deklariert werden. Das wurde beim 2.5.0→2.7.2-Upgrade übersehen.
- **Fix:** `android:manageSpaceActivity`-Attribut am `<application>`-Element + `<activity>`-Deklaration mit `MANAGE_SPACE_URL`-Meta-Data (nutzt den bestehenden `${defaultUrl}`-Platzhalter pro Product-Flavor). Kein ProGuard/R8-Bezug – `-keep class com.google.androidbrowserhelper.** { *; }` deckte die Klasse bereits ab, das Problem lag rein im fehlenden Manifest-Eintrag.
- **Verifiziert:** Debug-Build lokal auf dem ursprünglich betroffenen Gerät installiert (`adb install`), Logcat bestätigt sauberen Start (`TwaLauncher: Launching Trusted Web Activity`, keine FATAL EXCEPTION mehr). Signierter Release-Build (v1.12.5/vc30) danach separat gebaut, Signatur + Manifest-Inhalt im AAB verifiziert (`unzip` + `jarsigner -verify`), am 2026-09-05 in Play Store hochgeladen.
- **Lehre:** Ein Dependency-Upgrade einer TWA-Helper-Library kann neue **Manifest-Anforderungen** einführen, die weder Compile- noch CI-Fehler erzeugen (Manifest-Merge läuft durch, R8 warnt nicht) – bricht ausschließlich zur Laufzeit. Nach jedem `androidbrowserhelper`-Versionssprung die Release-Notes auf neue Pflicht-Manifest-Einträge prüfen, nicht nur auf API-Level-Anforderungen.
- **Noch offen:** Gerätetest des tatsächlich hochgeladenen, signierten Release-Builds (v1.12.5/vc30) auf dem Nexus/Android-Go-Gerät nach dem Play-Store-Rollout steht noch aus (nur der Debug-Build wurde lokal verifiziert). Der offene R8-Gerätetest aus #367 bleibt davon unberührt und weiterhin separat offen.

## R8/ProGuard-Optimierung greift nicht (Issue #367, PR #375, gemerged – Verifikation offen)

Play Console meldete für Release 25 (1.12.1), dass die R8-Optimierung nicht greift. Ursache: `Android/app/proguard-rules.pro` enthielt `-keep class androidx.** { *; }`, was **jede** AndroidX-Klasse pauschal vor Shrinking/Optimierung/Obfuskation schützte – da AndroidX den Großteil des TWA-Codes ausmacht, blieb R8 praktisch nichts zu tun übrig.

- Die Regel wurde entfernt. Bewusst **unverändert** blieben `-keep class com.google.androidbrowserhelper.** { *; }` (Reflection) und `-keep class androidx.browser.** { *; }` (prozessübergreifende Bindung, TWA-kritisch) sowie das breite `-dontwarn androidx.**` (als `TODO(#367)` im File markiert, bis ein sauberer Release-Build zeigt, welche Warnungen real sind).
- **⚠️ Nicht auf einem echten Gerät getestet.** Kein CI-Check baut einen Android-Release (die Workflows bauen die PWA + Playwright-E2E gegen den Browser) – grünes CI im gemergten PR #375 sagt zu diesem Fix nichts aus. Zu aggressiv entfernte Keep-Regeln brechen erst zur Laufzeit (TWA startet nicht, Splash hängt, Deep Links tot), nicht beim Build.
- **Vor dem nächsten Play-Store-Upload zwingend:** `cd Android && ./gradlew bundleRelease` bauen und auf einem echten Gerät testen (App-Start, Splash, Deep Links, Status-/Navigationsleisten-Farbe). Ein Debug-Build genügt nicht – `minifyEnabled` gilt nur für `release`.
- **Bei einem Laufzeit-Crash:** keine pauschale `-keep class androidx.** { *; }`-Regel wiedereinsetzen (macht den Fix wirkungslos), sondern eine gezielte Regel für die konkret betroffene Klasse ergänzen.
- Issue #367 bleibt bis zum erfolgreichen Gerätetest offen.

## Edge-to-Edge / Android 15 API-Deprecations (Issue #368, PR #374, gemerged)

Play Console meldete die Verwendung nicht mehr unterstützter Edge-to-Edge-APIs (`setStatusBarColor`/`setNavigationBarColor`/`LAYOUT_IN_DISPLAY_CUTOUT_MODE_*`, seit Android 15 deprecated). Die gemeldeten Stacktraces zeigen ausschließlich auf `com.google.androidbrowserhelper`-Klassen (`EdgeToEdgeUtils`, `LauncherActivity`) – die App selbst ruft keine dieser APIs direkt auf (Konfiguration läuft rein über `STATUS_BAR_COLOR`/`NAVIGATION_BAR_COLOR`-Metadaten in `AndroidManifest.xml`).

- `com.google.androidbrowserhelper:androidbrowserhelper` **2.5.0 → 2.7.2** angehoben (`Android/app/build.gradle`) – Version 2.7.1 behebt laut Changelog explizit „Deprecations in launcher activity“, 2.7.0 bringt zusätzlich Edge-to-Edge-Support für den Splash-Screen.
- Kein eigener App-Code betroffen, daher keine weiteren Änderungen nötig.
- Nach dem nächsten Play-Store-Upload prüfen, ob die Play-Console-Warnung verschwindet.

## Firestore-Regeln-Deploy #404 war eine Verschärfung, keine harmlose Erweiterung (Issue #396, #406/#408/#409)

`firestore.rules` war bis #396 **reine Dokumentation** – es gab kein `firebase.json`, also keinen Deploy-Weg. Die Datei war ausserdem stark gedriftet: `hasOnlyAllowedFields()` erlaubte nur `text`/`segment`/`checked`/`createdAt`, die App schreibt aber längst `notes`, `dueDate`, `category`, `recurring`, `completedAt`; die Create-Regel forderte `createdAt == request.time`, während die App eine Zahl schreibt.

- **Der vorherige deployte Stand war nicht zu streng, sondern zu locker:** `allow read, write: if request.auth.uid == userId` ohne jede Feldvalidierung, und **ohne** `match`-Block für `backups`. Da Firestore-Regeln sich nicht auf Subcollections vererben, fiel jeder Backup-Write auf das abschliessende Deny durch – das war die Ursache des kaputten Cloud-Backups. Der Deploy am 2026-08-27 war damit eine **Verschärfung**, nicht die im damaligen Dokument beschriebene harmlose Obermengen-Erweiterung.
- Aus dem Rollout entstanden drei Folge-Befunde: #406 (Testing-Umgebung nicht isoliert), #408 (uneindeutige Daten-Button-Labels), #409 (fehlgeschlagene Backup-Versuche wurden als Erfolg angezeigt) – #408/#409 per PR #411 gefixt.
- **Lehre / Vorgehen bei künftigen Regelverschärfungen:** JSON-Export der echten Daten gegen die neuen Bedingungen laufen lassen (deckt alle Aufgaben ab, nicht nur eine Stichprobe – `loadUserTasks()` liest per `docSnap.data()` das rohe Dokument), dann die Playground-Fälle aus `docs/DATENSICHERUNG.md`, Abschnitt 5.1.

## Optionale Task-Felder blieben nach dem Leeren in Firestore stehen (PR #383, gefunden beim Review von PR #382)

`updateTaskInFirestore()` in `js/modules/storage.js` schreibt mit `setDoc(..., { merge: true })`. Ein **weggelassenes** Feld bedeutet dort „alten Wert behalten" – nicht „Feld löschen". Ein im Edit-Dialog (PR #378) geleertes Feld blieb deshalb wegen `merge: true` in Firestore stehen und tauchte nach dem Reload wieder auf; `completedAt` verfälschte zusätzlich die Metriken beim Abwählen einer erledigten Aufgabe.

- **Fix:** Betroffene Felder (`completedAt`, `recurring`, `dueDate`, `category`; `notes` war seit PR #373 schon korrekt) senden den leeren Fall jetzt explizit als `deleteField()` statt das Feld wegzulassen:
  ```js
  updateData.dueDate = task.dueDate ? task.dueDate : deleteField();
  ```
- **Nur der Firebase-Modus war betroffen** – `saveGuestTasks()` serialisiert das Task-Objekt komplett und kennt das Problem nicht.
- Regression-Tests in `tests/unit/storage.test.js` (`describe('updateTaskInFirestore clearable fields')`). Diese Suite ist in der CI per `--exclude` ausgeschlossen, läuft also nur lokal über `npm test`.
- **Lehre:** Beim Ergänzen weiterer optionaler Task-Felder immer dem `deleteField()`-Muster folgen – siehe Kernregel in `CLAUDE.md`.
