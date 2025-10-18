# Firestore Persistence Fix - Dokumentation

**Datum:** 2025-10-13
**Branch:** `testing`
**Commit:** a36e178

---

## 🎯 Problem

### Symptome
- ✅ **Funktioniert:** Tasks erstellen und speichern
- ✅ **Funktioniert:** Tasks als erledigt markieren (Haken setzen)
- ✅ **Funktioniert:** Erledigte Tasks wieder aktivieren
- ❌ **Funktioniert NICHT:** Bestehende Tasks zwischen Segmenten verschieben (Drag & Drop)

### Ursache
Nach Analyse wurden **zwei Hauptprobleme** identifiziert:

#### 1. Firebase-Objekt nicht im ES6-Modul-Scope verfügbar
**Problem in [script.js](script.js):**
```javascript
// ❌ FALSCH: firebase ist nicht im Modul-Scope
saveTaskToFirestore(task, currentUser.uid, db, firebase);
```

Das `firebase`-Objekt ist global in der HTML-Seite definiert (via firebase-config.js), aber **nicht im ES6-Modul-Scope** von script.js verfügbar.

**Betroffene Funktionen:**
- `saveAllTasks()` (Zeile 79)
- `handleAddTask()` (Zeile 111)
- `handleMoveTask()` (Zeile 147)
- `handleToggleTask()` (Zeile 165, 169)

#### 2. updateTaskInFirestore() nutzt .update() statt .set()
**Problem in [js/modules/storage.js](js/modules/storage.js:154-184):**
```javascript
// ❌ FALSCH: .update() schlägt fehl, wenn Dokument nicht existiert
await db.collection('users')
    .doc(userId)
    .collection('tasks')
    .doc(task.id.toString())
    .update(updateData);
```

Die `.update()`-Methode funktioniert nur bei **existierenden Dokumenten**. Alte Tasks (die vor dem Fix erstellt wurden) existierten möglicherweise nicht in Firestore oder hatten andere IDs.

---

## ✅ Lösung

### 1. Firebase-Referenz korrigiert
**In [script.js](script.js):**
```javascript
// ✅ RICHTIG: window.firebase verwenden
saveTaskToFirestore(task, currentUser.uid, db, window.firebase);
updateTaskInFirestore(movedTask, currentUser.uid, db, window.firebase);
```

Alle Referenzen zu `firebase` wurden durch `window.firebase` ersetzt:
- Zeile 79: `saveAllTasks()`
- Zeile 111: `handleAddTask()`
- Zeile 147: `handleMoveTask()`
- Zeile 165, 169: `handleToggleTask()`

### 2. updateTaskInFirestore() auf .set() mit merge umgestellt
**In [js/modules/storage.js](js/modules/storage.js:154-185):**
```javascript
// ✅ RICHTIG: .set() mit merge:true
await db.collection('users')
    .doc(userId)
    .collection('tasks')
    .doc(task.id.toString())
    .set(updateData, { merge: true });
```

**Vorteile von `.set(data, { merge: true })`:**
- ✅ Erstellt das Dokument, falls es nicht existiert
- ✅ Aktualisiert das Dokument, falls es existiert
- ✅ Funktioniert für neue UND bestehende Tasks
- ✅ Bewahrt `createdAt` Timestamp

**Zusätzliche Änderungen:**
- `createdAt` wird jetzt im Update-Prozess bewahrt (Zeile 163)
- `completedAt` wird nur bei Bedarf hinzugefügt (nicht gelöscht bei normalen Updates)

---

## 📋 Geänderte Dateien

### 1. script.js
**Änderungen:** 4 Stellen
- Zeile 79: `window.firebase` in `saveAllTasks()`
- Zeile 111: `window.firebase` in `handleAddTask()`
- Zeile 147: `window.firebase` in `handleMoveTask()`
- Zeile 165, 169: `window.firebase` in `handleToggleTask()`

### 2. js/modules/storage.js
**Änderungen:** `updateTaskInFirestore()` Funktion (Zeile 154-185)
- `.update()` → `.set(data, { merge: true })`
- `createdAt` Feld hinzugefügt
- `completedAt` Handling verbessert

---

## 🧪 Testing

### Testing-URL
**Live-Version:** https://eisenhauer-matrix.web.app/testing/

### Test-Schritte
1. **Anmeldung:**
   - Mit Google anmelden
   - Firestore-Connection prüfen (keine CORS-Fehler in Console)

2. **Task erstellen:**
   - Neue Task in Segment 1 erstellen
   - ✅ Sollte in Firestore gespeichert werden
   - Console: `Task saved to Firestore: [taskId]`

3. **Task verschieben (Drag & Drop):**
   - Task von Segment 1 nach Segment 2 ziehen
   - ✅ Sollte verschoben werden UND in Firestore gespeichert
   - Console: `Task updated in Firestore: [taskId]`

4. **Browser neu laden:**
   - Seite neu laden (F5)
   - ✅ Alle Änderungen sollten erhalten bleiben
   - Task sollte in Segment 2 sein

5. **Task als erledigt markieren:**
   - Haken bei Task setzen
   - ✅ Task sollte in "Done" (Segment 5) verschoben werden
   - Console: `Task updated in Firestore: [taskId]`

6. **Erledigt rückgängig machen:**
   - Haken bei erledigter Task entfernen
   - ✅ Task sollte zurück in Segment 1 verschoben werden
   - Console: `Task updated in Firestore: [taskId]`

### Bekanntes Problem: Localhost CORS
**⚠️ Localhost Testing eingeschränkt:**
```
Fetch API cannot load https://firestore.googleapis.com/...
due to access control checks
```

**Grund:** Firebase authorized domains enthält `localhost` nicht.

**Workaround:** Direkt auf Firebase Testing-Branch testen (siehe Testing-URL oben).

**Optional:** `localhost` zu Firebase authorized domains hinzufügen:
1. Firebase Console: https://console.firebase.google.com/project/eisenhauer-matrix/authentication/settings
2. "Authorized domains" → "Add domain"
3. `localhost` hinzufügen

---

## 🚀 Deployment

### Status
✅ **Deployed auf testing branch**

### Details
- **Branch:** `testing`
- **Commit:** a36e178
- **GitHub Actions:** Run #18457585627 (erfolgreich)
- **URL:** https://eisenhauer-matrix.web.app/testing/

### Deployment-Befehl
```bash
git add script.js js/modules/storage.js
git commit -m "fix: Fix Firestore persistence for task operations"
git push origin testing
```

### Nächste Schritte für Production
Nach erfolgreichem Testing auf `testing` Branch:

1. **Merge in main:**
   ```bash
   git checkout main
   git merge testing
   git push origin main
   ```

2. **Automatisches Production-Deployment:**
   - GitHub Actions deployt automatisch auf: https://eisenhauer-matrix.web.app/

---

## 📝 Commit-Nachricht

```
fix: Fix Firestore persistence for task operations

Problem:
- Tasks could be created and marked as done, but moving existing tasks
  between segments did not persist to Firestore
- Root cause: firebase object not accessible in ES6 module scope
- updateTaskInFirestore() used .update() which fails for non-existent docs

Solution:
1. Changed all firebase references to window.firebase in script.js
   - saveAllTasks() now uses window.firebase
   - handleAddTask() now uses window.firebase
   - handleMoveTask() now uses window.firebase
   - handleToggleTask() now uses window.firebase

2. Updated updateTaskInFirestore() in storage.js
   - Changed from .update() to .set(data, { merge: true })
   - This creates the document if it doesn't exist
   - Handles both new and existing tasks correctly
   - Added createdAt field preservation

Files changed:
- script.js: Use window.firebase instead of firebase
- js/modules/storage.js: Use .set() with merge instead of .update()
```

---

## 🔍 Technische Details

### ES6 Module Scope Problem
**Warum `firebase` nicht verfügbar war:**
```html
<!-- index.html -->
<script src="firebase-config.js"></script>  <!-- Definiert: const firebase = ... -->
<script type="module" src="script.js"></script>  <!-- ES6 Module = eigener Scope -->
```

ES6-Module haben einen **eigenen isolierten Scope** und greifen nicht auf globale Variablen zu (außer über `window`).

**Lösung:** `window.firebase` verwendet explizit das globale Objekt.

### Firestore .update() vs .set()
**`.update()` Verhalten:**
- ✅ Aktualisiert existierende Dokumente
- ❌ **Fehler bei nicht-existierenden Dokumenten**
- Verwendung: Nur wenn sicher ist, dass Dokument existiert

**`.set(data, { merge: true })` Verhalten:**
- ✅ Erstellt Dokument, falls nicht vorhanden
- ✅ Aktualisiert Dokument, falls vorhanden
- ✅ Merged mit existierenden Daten
- Verwendung: **Universal einsetzbar** (empfohlen)

---

## 📊 Zusammenfassung

### Was wurde behoben
✅ Tasks zwischen Segmenten verschieben (Drag & Drop)
✅ Bestehende Tasks werden jetzt korrekt in Firestore gespeichert
✅ Neue UND alte Tasks funktionieren gleichermaßen
✅ `createdAt` Timestamp wird bewahrt

### Was bereits funktionierte
✅ Tasks erstellen
✅ Tasks als erledigt markieren
✅ Erledigte Tasks wiederherstellen
✅ Guest Mode (LocalForage)

### Nächste Schritte
1. ⏳ **Testing durchführen** auf https://eisenhauer-matrix.web.app/testing/
2. ⏳ **Feedback einholen** (alle Szenarien testen)
3. ⏳ **Production Deployment** (nach erfolgreichem Testing)

---

**Erstellt von:** Claude Code
**Für morgen bereit:** ✅ Ja
