# Datensicherung – Konzept und Sicherheitsaudit

Antwort auf Issue #396 („Datensicherheit"). Dieses Dokument beschreibt, wo Nutzerdaten liegen,
wie sie gegen Verlust abgesichert sind, wie eine Wiederherstellung abläuft – und was das Audit
an Lücken gefunden hat.

**Stand:** 2026-08-25 · **Bezug:** #396, #359, #385

---

## 1. Wo liegen die Daten?

Die App kennt zwei Betriebsmodi mit unterschiedlicher Datenhaltung:

| Modus | Primärspeicher | Ort | Überlebt Geräteverlust? |
|---|---|---|---|
| **Gastmodus** | IndexedDB via `localforage` (Key `eisenhauerTasks`) | nur lokal im Browser | ❌ Nein |
| **Angemeldet** | Firestore `users/{userId}/tasks/{taskId}` | Firebase-Cloud | ✅ Ja |

Ergänzend, in beiden Modi:

- **Offline-Queue** (`js/modules/offline-queue.js`): puffert Schreibvorgänge bei fehlender
  Verbindung und spielt sie beim `online`-Event nach. Schützt gegen Verlust durch Verbindungsabbruch,
  **nicht** gegen Geräteverlust.
- **Lokaler Export** (`js/modules/export.js`): JSON, CSV und Markdown. Manuell, aber vollständig
  unter Kontrolle des Nutzers und unabhängig von Firebase.
- **Cloud-Backup** (`js/modules/backup.js`): Snapshots in Firestore, siehe Abschnitt 2.

### Verteidigungslinien gegen Datenverlust

1. **Lokale Persistenz** – IndexedDB, überlebt Reload und App-Neustart.
2. **Cloud-Sync** – Firestore, überlebt Geräteverlust (nur angemeldet).
3. **Snapshots** – Cloud-Backup, überlebt versehentliches Löschen (nur angemeldet).
4. **Export** – JSON/CSV/Markdown, überlebt auch einen Ausfall des Firebase-Projekts.

Die Linien 2 und 3 stehen Gastnutzern **nicht** zur Verfügung. Für sie ist der manuelle Export
die einzige Absicherung – das ist eine bewusste Eigenschaft des Gastmodus (keine Accountpflicht),
kein Bug.

---

## 2. Cloud-Backup: Konzept

### Warum Firestore und nicht Cloud Storage

Backups lagen ursprünglich als JSON-Blobs in **Firebase Cloud Storage**. Seit Oktober 2024
verlangt Firebase für Cloud Storage grundsätzlich den kostenpflichtigen **Blaze-Tarif**; das
Projekt läuft auf dem kostenlosen **Spark-Tarif** (Downgrade Januar 2026, vormals #254).
Damit schlug **jeder** Upload mit einem Berechtigungsfehler fehl – das Feature war strukturell
defekt, nicht bloss fehlerhaft. Das war die eigentliche Ursache hinter „die automatische
Datensicherung funktioniert nicht".

Firestore bleibt im Spark-Tarif kostenlos (1 GB Speicher, 50k Reads / 20k Writes pro Tag) und
wird von der App ohnehin für Tasks genutzt. Deshalb: **Option 1 aus #359** umgesetzt.

### Datenmodell

`users/{userId}/backups/{backupId}` – `backupId` ist `backup-<epochMillis>`.

| Feld | Typ | Bedeutung |
|---|---|---|
| `version` | string | Format-Version. `'2.0'` = Firestore, `'1.0'` war das alte Storage-Blob-Format |
| `timestamp` | number | Erstellzeitpunkt in Epoch-Millisekunden (Sortierschlüssel) |
| `createdAt` | timestamp | Server-Zeitstempel |
| `taskCount` | number | Anzahl Aufgaben, für die Anzeige in der Restore-Liste |
| `byteSize` | number | Grösse von `payload` in Bytes |
| `payload` | string | Der serialisierte Task-Baum (JSON-String) |

**Warum `payload` ein String und keine verschachtelte Map ist:** Das Dokument bleibt dadurch flach
und formstabil. Die Security Rules können es validieren, ohne das Task-Schema zu kennen, und eine
spätere Änderung am Task-Modell kann alte Backups nicht nachträglich ungültig machen.

### Grössenlimit

Firestore lehnt Dokumente ab **1 MiB** ab. `uploadBackup()` bricht bereits bei **800 KiB**
serialisiertem Payload mit einer verständlichen Meldung ab und verweist auf den lokalen Export.
Der Puffer ist Absicht: Die JSON-Grösse ist nur eine Schätzung der tatsächlich gespeicherten
Grösse (Firestore addiert Feldnamen- und Index-Overhead), ein knapp unter 1 MiB gemessenes Backup
würde also serverseitig mit einem undurchsichtigen Fehler abgelehnt.

Grössenordnung: ~800 KiB entsprechen grob 5.000–10.000 Aufgaben. Für die aktuelle Nutzerzahl
unkritisch.

### Rotation

`MAX_BACKUPS = 4`. Nach jedem Upload löscht `cleanupOldBackups()` alles darüber hinaus per
Batch-Write. Ein Fehler beim Aufräumen lässt das Backup selbst bewusst gültig.

### Automatik

`shouldAutoBackup()` löst **wöchentlich** aus, beim Auth-State-Wechsel. Nach **drei** aufeinander
folgenden Fehlschlägen stoppt die Automatik (`autoBackupFailureCount`) und der Nutzer wird einmal
informiert, statt bei jedem Start eine Fehlermeldung zu sehen. Ein manuelles Backup setzt den
Zähler zurück.

### Zeitstempel-Normalisierung

`createdAt` ist in der App normalerweise eine **Zahl** (`Date.now()`, siehe `createTaskObject`),
wird aber bei fehlendem Wert als Firestore-`serverTimestamp()` geschrieben. Ein zurückgelesener
`Timestamp` würde von `JSON.stringify` zu `{seconds, nanoseconds}` verflacht – und der numerische
Vergleich in `getVisibleTasks` (`task.createdAt <= now`) wäre nach einem Restore dauerhaft kaputt.
`normalizeTask()` in `backup.js` vereinheitlicht `createdAt` und `completedAt` deshalb beim
Backup auf Epoch-Millisekunden.

---

## 3. Wiederherstellung

**Einstiegspunkt:** Einstellungen → Cloud Backup → „Wiederherstellen".

Ablauf:

1. `listBackups()` lädt die Metadaten (ohne Payload) und zeigt Datum + Aufgabenzahl.
2. Nutzer wählt ein Backup und **bestätigt** einen expliziten Warnhinweis.
3. **Sicherungs-Backup**: Der *aktuelle* Stand wird vor dem Überschreiben als Backup abgelegt.
   Schlägt das fehl, wird der Restore **abgebrochen** – ohne Rückweg wird nicht überschrieben.
4. `downloadBackup()` lädt das Dokument, `replaceAllTasksInFirestore()` ersetzt die Collection.

**Warum „replace" und nicht „save":** `saveAllTasksToFirestore()` schreibt nur die übergebenen
Aufgaben. Eine Aufgabe, die es im Backup nicht mehr gibt, würde als verwaistes Dokument
überleben – der Restore würde den Backup-Stand also gar nicht reproduzieren.
`replaceAllTasksInFirestore()` löscht deshalb zuerst alle vorhandenen Task-Dokumente.

**Warum ohne Offline-Queue:** Ein halb angewendeter Restore (Löschungen werden nachgespielt, die
zugehörigen Schreibvorgänge nicht) würde Daten vernichten. Der Restore schlägt deshalb laut fehl,
statt in eine Warteschlange zu wandern – das Sicherungs-Backup aus Schritt 3 bleibt der Rückweg.

---

## 4. Sicherheitsaudit

### 4.1 Behobene Befunde

| # | Befund | Schwere | Status |
|---|---|---|---|
| A1 | **Cloud-Backup grundsätzlich funktionsunfähig** – Storage erfordert Blaze, Projekt auf Spark. Jeder Upload schlug fehl. | Hoch | ✅ Firestore-Migration |
| A2 | **Kein Wiederherstellungsweg.** `restoreBackup()` und `downloadBackup()` waren exportiert, wurden aber **nirgends aufgerufen** – es gab keine Restore-UI. Ein Backup, das man nicht zurückspielen kann, ist kein Backup. | Hoch | ✅ Restore-UI ergänzt |
| A3 | **Security-Rules-Drift.** `firestore.rules` erlaubte via `hasOnlyAllowedFields()` nur `text`, `segment`, `checked`, `createdAt`; die App schreibt längst `notes`, `dueDate`, `category`, `recurring`, `completedAt`. Zusätzlich forderte die Create-Regel `createdAt == request.time`, während die App eine Zahl schreibt. Wären diese Regeln so deployt, würde **jeder** Task-Schreibvorgang abgelehnt. | Hoch | ✅ Regeln an das reale Modell angeglichen |
| A4 | **Rules waren nicht deploybar.** Kein `firebase.json` – `firestore.rules` war reine Dokumentation ohne Bezug zum tatsächlich deployten Stand. | Mittel | ✅ `firebase.json` + `npm run rules:deploy` |
| A5 | **Dokumentations-Drift.** `docs/FIREBASE_SECURITY_RULES.md` beschrieb `segment` als String-Enum (`'important-urgent'`, …) und ein Textlimit von 500 – real sind es Integers 1–5 und 140 Zeichen. | Mittel | ✅ Als überholt markiert, verweist hierher |
| A6 | **Geräteübergreifend widersprüchlicher Backup-Status** („Heute" vs. „Nie"). Status kam nur aus dem geräte-lokalen `localStorage`. | Niedrig | ✅ Behoben in PR #402 (liest Firestore als Quelle) |
| A7 | **Restore hätte Zeitstempel beschädigt** – Firestore-`Timestamp` überlebt `JSON.stringify` nicht. | Mittel | ✅ `normalizeTask()` |
| A8 | **Restore hätte gelöschte Aufgaben wiederauferstehen lassen** – kein Delete vor dem Schreiben. | Mittel | ✅ `replaceAllTasksInFirestore()` |
| A9 | **CSP erlaubte ungenutzte Storage-Origins** (`*.firebasestorage.app`, `firebasestorage.googleapis.com`) im `connect-src`. Nach dem Wegfall von Cloud Storage unnötige Angriffsfläche. | Niedrig | ✅ Aus der CSP entfernt |
| A10 | **Firebase-Storage-SDK wurde initialisiert, obwohl unbrauchbar.** `getStorage()` lief bei jedem App-Start und zog die Storage-SDK ins Bundle. | Niedrig | ✅ Initialisierung und Import entfernt |

### 4.2 Offene Befunde

| # | Befund | Schwere | Empfehlung |
|---|---|---|---|
| B1 | **Deployter Regelstand geklärt** (2026-08-27, #404) – und zwar anders als vermutet: live läuft kein *zu strenger*, sondern ein deutlich *lockerer* Stand ohne jede Feldvalidierung. Der Deploy ist deshalb eine Verschärfung, keine Lockerung. Details in Abschnitt 5.2. | Hoch → offen bis zum Deploy | Regeln gegen echte Daten prüfen, nicht nur in der Playground; Ausgangsstand liegt in [`docs/rules-backup/firestore.rules.pre-404`](rules-backup/firestore.rules.pre-404) |
| B2 | **Gastmodus ohne Cloud-Absicherung.** Browserdaten-Löschung vernichtet alles unwiderruflich. | Mittel | Erinnerung an regelmässigen Export; bewusst akzeptiert |
| B3 | **Keine Verschlüsselung der Inhalte.** Aufgabentexte und Notizen liegen im Klartext in Firestore. | Mittel | Clientseitige Verschlüsselung wäre möglich, macht aber serverseitige Validierung unmöglich. Bewusst offen. |
| B4 | **Kein Firebase App Check.** Keine Geräte-Attestierung; ein gültiges Auth-Token genügt. | Niedrig | Optional, für zwei Nutzer unverhältnismässig |
| B5 | **Notizen fehlen in der Gast→Login-Migration** (aus #385). | Mittel | Bleibt in #385 |
| B6 | **Bulk-Save ohne Offline-Queue-Retry** (aus #385) – inzwischen teilweise adressiert. | Niedrig | Bleibt in #385 |

### 4.3 Bewusst nicht geändert

- **Rotationstiefe 4.** Genügt für wöchentliche Backups (≈ ein Monat Historie).
- **Wöchentlicher Rhythmus.** Häufiger wäre bei Firestore-Limits unproblematisch, aber der lokale
  Export bleibt die Absicherung für kurzfristige Fehler.
- **Kein automatischer Restore.** Wiederherstellung ist immer eine bewusste Nutzeraktion.

---

## 5. Migration und Parallelbetrieb

Die App wird als PWA über einen Service Worker ausgeliefert. Nutzer können deshalb nach einem
Deploy noch **eine Weile eine ältere App-Version ausführen**. Jede Änderung an den Security Rules
muss das aushalten.

### Regeln: rückwärtskompatibel per Feld-Obermenge

`hasOnlyAllowedFields()` listet **jedes Feld, das die App je geschrieben hat** – nicht nur die
aktuellen. Eine ältere Client-Version schreibt eine Teilmenge und bleibt damit gültig; die
Pflichtfelder (`text`, `segment`, `checked`, `createdAt`) sind über alle Versionen identisch.
Alt und neu laufen so gefahrlos parallel, ohne dass ein Nutzer zum Update gezwungen wird.

> **Regel für künftige Felder:** Ein neues optionales Task-Feld muss **zuerst** in
> `hasOnlyAllowedFields()` deployt werden und **erst danach** darf der Client ausgeliefert werden,
> der es schreibt. Andernfalls lehnen die Rules die Writes der neuen Version ab.

### Reihenfolge des Rollouts

1. Regeln in der **Rules Playground** gegen die Fälle in Abschnitt 5.1 testen.
2. Regeln nach `eisenhauer-testing` deployen (`npm run rules:deploy:testing`).
3. Mit einer **alten** (gecachten) und einer neuen App-Version gegen Testing prüfen.
4. Erst dann nach Produktion (`npm run rules:deploy`).
5. App-Deploy.

### Alte Storage-Backups

Backups aus der Zeit vor dem Spark-Downgrade (Januar 2026) liegen ggf. noch in Cloud Storage.
Sie sind **im Spark-Tarif nicht lesbar** und lassen sich daher nicht automatisch migrieren.
Ein Migrationsskript wäre nicht testbar und würde beim Nutzer nur fehlschlagen.

- Sollen sie gerettet werden, ist dafür ein **temporäres Blaze-Upgrade** nötig; danach lassen sie
  sich einmalig herunterladen und über „Import" wieder einspielen.
- Andernfalls verfallen sie. Praktisch dürfte das folgenlos sein: seit dem Downgrade konnte kein
  einziges Backup mehr geschrieben werden, die vorhandenen wären also in jedem Fall veraltet.

Neue Backups landen ausschliesslich in Firestore. Ein Parallelbetrieb beider Backends wurde
**bewusst nicht** gebaut: Der Storage-Pfad kann auf Spark grundsätzlich nicht funktionieren,
zwei Codepfade hätten also nur den nicht funktionierenden Pfad konserviert.

### 5.1 Testfälle für die Rules Playground

```
✅ Task anlegen mit allen optionalen Feldern
   /users/u1/tasks/t1 · auth u1 · create
   { text: "Test", segment: 2, checked: false, createdAt: 1750000000000,
     notes: "n", dueDate: "2026-09-01", category: "private" }        → ALLOW

✅ Task anlegen wie eine ALTE App-Version (nur Pflichtfelder)
   { text: "Test", segment: 2, checked: false, createdAt: 1750000000000 } → ALLOW

❌ Unbekanntes Feld
   { ...gültig, foo: "bar" }                                        → DENY

❌ Fremder Nutzer
   /users/u2/tasks/t1 · auth u1 · read                              → DENY

❌ Text zu lang (>140)                                              → DENY
❌ Segment ausserhalb 1–5                                           → DENY

✅ Backup anlegen
   /users/u1/backups/backup-1750000000000 · auth u1 · create
   { version: "2.0", timestamp: 1750000000000, payload: "{}" }      → ALLOW

❌ Backup mit zu grossem Payload (>900000 Zeichen)                  → DENY
```

---

### 5.2 Ausgangsstand vor dem Rollout (#404)

Am 2026-08-27 wurde der tatsächlich deployte Regelstand aus der Firebase Console gesichert:
[`docs/rules-backup/firestore.rules.pre-404`](rules-backup/firestore.rules.pre-404). Er war in
**beiden** Projekten wortgleich (`eisenhauer-matrix`, Stand Oktober 2025; `eisenhauer-testing`,
Stand Januar 2026) und lautet im Kern:

```
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  match /tasks/{taskId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

Daraus folgen zwei Dinge, die den Rollout anders einordnen, als Abschnitt 5 zunächst nahelegt:

1. **Backups sind bestätigt blockiert.** Es gibt keinen `match`-Block für die `backups`-Subcollection.
   Firestore-Regeln vererben sich **nicht** auf Subcollections, der Pfad fällt also auf
   `match /{document=**} { allow read, write: if false; }` durch – jeder Backup-Write wird abgelehnt.
   Das ist die Ursache, unabhängig vom Spark/Blaze-Thema aus #254/#359.

2. **Der Deploy ist eine Verschärfung.** Das Obermengen-Argument weiter oben gilt gegenüber dem
   *alten Repo-Stand*, nicht gegenüber dem *deployten* Stand. Live findet gar keine Feldvalidierung
   statt; `firestore.rules` führt gegenüber diesem Stand fünf neue Verbote ein:

   | Neue Einschränkung | Bewertung |
   |---|---|
   | Feld-Whitelist (9 Felder) | Unkritisch: die App hat laut History von `js/modules/storage.js` nie andere Felder geschrieben (`taskId` ist reine Offline-Queue-Metadatenspalte und landet nicht in Firestore). |
   | `allow write: if false` auf `/users/{userId}` | Unkritisch: kein Codepfad schreibt das User-Dokument; der Backup-Status stammt aus `listBackups()`. |
   | `text.size() <= 140` | Client erzwingt das (`index.html`, `validateTask` in `tasks.js`) – für Altdaten aus früheren Versionen aber nicht garantiert. |
   | `segment is int` (1–5), `checked is bool` | `segment` unkritisch: `loadUserTasks()` normalisiert per `Number(task.segment)`, alle Schreibpfade senden also einen int, selbst wenn in Firestore ein String steht. `checked` an echten Daten zu prüfen. |
   | `createdAt` beim Update unveränderlich | Fallstrick, aber ein engerer als zunächst angenommen: ein gespeicherter `Timestamp` ist unkritisch (der Client liest ihn roh aus und schickt denselben Wert zurück, `validCreatedAt` erlaubt beide Typen). Gefährlich ist ein Dokument **ohne** `createdAt`: `updateTaskInFirestore()` fällt dann auf `serverTimestamp()` zurück, der Vergleich mit `resource.data.createdAt` schlägt fehl und jedes Update wird abgelehnt. |

   Der Rest lässt sich **nur an echten Daten** klären, und zwar vollständig statt stichprobenartig:
   `loadUserTasks()` übernimmt mit `docSnap.data()` das rohe Firestore-Dokument, ein JSON-Export
   (Einstellungen → Daten → Export) enthält also jedes gespeicherte Feld. Zu prüfen sind darin
   unerlaubte Feldnamen, fehlende `createdAt`, Texte über 140 Zeichen und nicht-boolesche `checked`.

**Ergebnis der Prüfung (2026-08-27, Produktion):** ein JSON-Export mit **16 Aufgaben** wurde gegen
alle fünf Bedingungen geprüft – keine Verstösse. Kein unerlaubtes Feld, kein fehlendes oder
falsch typisiertes `createdAt`, kein Text über 140 Zeichen, kein ungültiges `segment`, kein
nicht-boolesches `checked`. Der Deploy von `firestore.rules` ist am realen Bestand damit
verträglich; die Verschärfung trifft keine vorhandene Aufgabe.

---

### 5.3 Durchführung des Rollouts (#404)

**Playground (2026-08-27).** Alle sieben Fälle aus Abschnitt 5.1 wurden gegen `firestore.rules`
simuliert und verhielten sich wie spezifiziert – insbesondere:

- *Task anlegen wie eine alte App-Version* (nur die vier Pflichtfelder) → **ALLOW**. Das ist der
  Nachweis für den Parallelbetrieb: eine per Service Worker gecachte ältere Version bleibt gültig.
- *Backup anlegen* → **ALLOW**, gegen den vorherigen Stand wäre derselbe Aufruf abgelehnt worden.
  Damit ist die Ursache aus #396 nicht nur vermutet, sondern gezeigt.

Zwei Ablehnungen während der Simulation gingen auf Eingabefehler zurück, nicht auf die Regeln
(Feldname `Version` statt `version`; `createdAt` als String statt als Zahl). Beide belegen
nebenbei, dass `hasAll()` bzw. `validCreatedAt()` greifen.

**Die Testumgebung ist nicht isoliert.** Beim Verifizieren fiel auf, dass die unter
`https://s540d.github.io/Eisenhauer/testing/` ausgelieferte App auf das **Produktions**-Firebase-Projekt
`eisenhauer-matrix` zeigt, nicht auf `eisenhauer-testing`. Konsequenzen:

- `npm run rules:deploy:testing` deployt in ein Projekt, mit dem kein Client spricht – der
  Testing-Deploy kann nichts verifizieren.
- Jeder Test auf der Testing-URL läuft auf Live-Daten.

Der in Abschnitt 5 beschriebene Ablauf „erst Testing, dort mit alter und neuer App-Version prüfen,
dann Produktion" ist damit aktuell **nicht durchführbar**. Für den Rollout aus #404 wurde stattdessen
auf die Vorabprüfungen gesetzt (vollständiger Datencheck, siehe 5.2, plus die Playground-Fälle oben)
und direkt gegen Produktion verifiziert. Bei einem einzelnen Nutzer mit vorliegendem lokalem Export
und 30-Sekunden-Rollback vertretbar; als Dauerzustand ist es das nicht. Erfasst als **#406**.

**Deploy nach Produktion (2026-08-27).** `npm run rules:deploy` ausgeführt, `eisenhauer-matrix`
führt die Regeln aus `firestore.rules` inklusive `match /backups/{backupId}`. Anschliessend gegen
die laufende Produktions-App verifiziert – Aufgaben anlegen, mit Notiz/Fälligkeit/Kategorie ändern,
eine bestehende Aufgabe bearbeiten, abhaken und wieder abwählen: alles ohne Berechtigungsfehler.

Das ist zugleich der Rückwärtskompatibilitäts-Nachweis: Produktion liefert zu diesem Zeitpunkt noch
den App-Stand von `main` aus, also einen Client, der **älter** ist als die Regeln. Genau der Fall,
den Abschnitt 5 absichern will.

Backup und Restore sind in diesem Schritt noch **nicht** prüfbar – die Restore-UI aus #403 wird erst
mit dem Release `testing` → `main` ausgeliefert. Verifikation dafür siehe #404, Phase 3.

---

## 6. Wiederherstellung im Ernstfall (Runbook)

**Fall 1 – Aufgaben versehentlich gelöscht, Nutzer angemeldet**
→ Einstellungen → Cloud Backup → Wiederherstellen → Backup wählen → bestätigen.
Der Stand vor der Wiederherstellung wird automatisch als zusätzliches Backup gesichert.

**Fall 2 – Gastmodus, Browserdaten gelöscht**
→ Nur über eine zuvor exportierte JSON-Datei: Einstellungen → Import.
Ohne Export sind die Daten verloren.

**Fall 3 – Firebase-Projekt nicht erreichbar**
→ Die App arbeitet lokal weiter (IndexedDB + Offline-Queue). Änderungen synchronisieren
automatisch, sobald die Verbindung zurück ist.

**Fall 4 – Restore hat den falschen Stand eingespielt**
→ Das Sicherungs-Backup aus Schritt 3 des Restore-Ablaufs auswählen; es ist das jüngste
in der Liste.

---

## 7. Verwandte Dokumente

- [`FIREBASE_SECURITY_RULES.md`](./FIREBASE_SECURITY_RULES.md) – ältere Rules-Referenz (teilweise überholt, siehe A5)
- [`../firestore.rules`](../firestore.rules) – die versionierten, deploybaren Regeln
- Issues: #396 (dieses Dokument), #359 (Architekturentscheidung), #385 (Robustheitslücken)
