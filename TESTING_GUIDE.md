# Testing Guide - Eisenhauer Matrix App

**Testing URL:** https://s540d.github.io/Eisenhauer/testing/

**Branch:** `testing`

**Last Updated:** 2025-10-17

---

## 🚨 WICHTIG: Hard Refresh vor jedem Test!

**Mac:** `Cmd + Shift + R`
**Windows:** `Ctrl + Shift + R`

Dies lädt die neueste Version und umgeht den Browser-Cache.

---

## 📋 Neue Features & Fixes zu testen

### ✅ Fix #1: OfflineQueue Bug - Data Loss behoben
**Commit:** `400ac6f`

**Problem (vorher):**
- JavaScript Error: `offlineQueue.on is not a function`
- Änderungen gingen beim Logout verloren
- Offline-Queue wurde nie verarbeitet

**Fix:**
- Complete rewrite: Static → Instance-based class
- Event Emitter Pattern implementiert
- Queue wird korrekt persistiert in IndexedDB

**Test-Schritte:**
1. [ ] **Console Check:** Keine `offlineQueue.on is not a function` Fehler
2. [ ] **Speichern Test:**
   - Task erstellen oder ändern
   - Abmelden
   - Wieder anmelden
   - **Erwartung:** Änderung ist noch da ✅
3. [ ] **Offline-Sync Test:**
   - Developer Tools → Network → Offline aktivieren
   - Task erstellen/ändern
   - Online gehen
   - **Erwartung:** Sync startet, Notification erscheint ✅

---

### ✅ Fix #2: Recurring Tasks Dialog öffnet sich nicht
**Commit:** `6bf39d9`

**Problem (vorher):**
- Checkbox "Wiederkehrend" hatte keine Funktion
- Dialog mit Turnus-Optionen öffnete sich nicht
- Feature war komplett broken

**Fix:**
- 3 fehlende Event Listener hinzugefügt (script.js)
- Recurring options werden jetzt korrekt angezeigt

**Test-Schritte:**
1. [ ] **Task erstellen:**
   - "+" Button klicken
   - Checkbox "Wiederkehrend" aktivieren
   - **Erwartung:** Turnus-Optionen erscheinen ✅
2. [ ] **Intervall wählen:**
   - "Täglich" → Keine extra Optionen
   - "Wöchentlich" → Wochentage-Auswahl erscheint ✅
   - "Monatlich" → Monats-Optionen erscheinen ✅
   - "Benutzerdefiniert" → Custom-Optionen erscheinen ✅
3. [ ] **Quick-Add Modal:**
   - Gleicher Test mit Quick-Add Modal (Button unten rechts)
   - **Erwartung:** Funktioniert identisch ✅

---

### ✅ Fix #3: Accessibility - Keyboard Navigation
**Commit:** `021b2e0` + `4248f85`

**Problem (vorher):**
- Keine Tastatursteuerung für Drag & Drop
- Nicht WCAG 2.1 Level AA konform
- Screen Reader Support fehlte

**Fix:**
- KeyboardDragManager implementiert (404 Zeilen)
- ARIA live regions für Screen Reader
- Enhanced focus indicators
- Dark mode support

**Test-Schritte:**

#### A) Keyboard Navigation
1. [ ] **Task auswählen:**
   - Tab zu einem Task
   - **Leertaste** drücken
   - **Erwartung:** Task hat blauen Rahmen + "✓ Selected" Label ✅
2. [ ] **Quadrant navigieren:**
   - **Pfeiltasten** drücken (↑ ↓ ← →)
   - **Erwartung:** Grüner gestrichelter Rahmen + "→ Target" Label ✅
3. [ ] **Task verschieben:**
   - **Enter** drücken
   - **Erwartung:** Task wird in Ziel-Quadrant verschoben ✅
4. [ ] **Abbrechen:**
   - **Escape** drücken
   - **Erwartung:** Auswahl wird abgebrochen, keine Rahmen mehr ✅

#### B) Screen Reader (optional)
1. [ ] **VoiceOver/NVDA aktivieren**
2. [ ] Task auswählen → Ankündigung hören
3. [ ] Pfeiltasten → Ziel-Quadrant wird angesagt
4. [ ] Enter → "Task moved from... to..." wird angesagt

#### C) Visual Feedback
1. [ ] Ausgewählter Task: Blauer Rahmen deutlich sichtbar
2. [ ] Ziel-Quadrant: Grüner Rahmen deutlich sichtbar
3. [ ] Dark Mode: Alle Indikatoren gut erkennbar
4. [ ] Focus-Ring bei Tab-Navigation klar sichtbar

#### D) Regression: Maus/Touch
1. [ ] **Maus Drag & Drop:** Funktioniert weiterhin ✅
2. [ ] **Touch Drag (Mobile):** Funktioniert weiterhin ✅
3. [ ] **Swipe-to-Delete:** Funktioniert weiterhin ✅

**WCAG 2.1 AA Compliance:**
- ✅ Level A: 30/30 (100%)
- ✅ Level AA: 14/14 (100%)
- ✅ Fully Compliant

**Audit:** [tests/accessibility/ACCESSIBILITY_AUDIT.md](tests/accessibility/ACCESSIBILITY_AUDIT.md)

---

### ✅ Fix #4: Auth Persistence - Nicht mehr neu anmelden
**Commit:** `de426d9`

**Problem (vorher):**
- User mussten sich jedesmal neu anmelden
- Auth-Token wurde nicht persistiert
- Sehr nervig! 😤

**Fix:**
- `auth.setPersistence(LOCAL)` explizit gesetzt
- Auth-Token bleibt in localStorage
- Funktioniert über Browser-Neustarts hinweg

**Test-Schritte:**
1. [ ] **Anmelden:**
   - Öffne https://s540d.github.io/Eisenhauer/testing/
   - Melde dich mit Google/Apple an
2. [ ] **Tab schließen & neu öffnen:**
   - Tab schließen
   - Neuen Tab öffnen → zur URL gehen
   - **Erwartung:** Automatisch angemeldet ✅
3. [ ] **Browser komplett schließen:**
   - **ALLE Browser-Fenster schließen**
   - Browser neu starten
   - Zur URL gehen
   - **Erwartung:** Automatisch angemeldet ✅
4. [ ] **Console Check:**
   - F12 → Console
   - **Erwartung:** `✅ Auth Persistence: LOCAL (user stays signed in)` ✅

---

## 🐛 Bekannte Issues (noch nicht gefixt)

### 🟡 Offline-Sync Display-Status
**Priorität:** Low (kosmetisch)

**Problem:**
- Zeigt "synchronisiert wird" nach Logout, obwohl Queue leer
- Nur Display-Issue, funktional korrekt

**Status:** Nicht-kritisch, kann später gefixt werden

---

### 🟡 Metrics Feature
**Priorität:** Low (nicht-essentiell)

**Problem:**
- Metrics Feature funktioniert nicht
- Wurde als "nicht-essentiell" markiert

**Status:** Kann später gefixt werden

---

## 📊 Test-Checklist Zusammenfassung

Bitte alle Tests durchführen und abhaken:

### Core Functionality
- [ ] Tasks erstellen/löschen funktioniert
- [ ] Tasks zwischen Quadranten verschieben (Maus)
- [ ] Tasks zwischen Quadranten verschieben (Keyboard)
- [ ] Tasks als erledigt markieren
- [ ] Recurring Tasks erstellen

### Bug Fixes
- [ ] Keine JavaScript Errors in Console
- [ ] Speichern funktioniert nach Logout/Login
- [ ] Recurring Tasks Dialog öffnet sich
- [ ] Keyboard Navigation funktioniert
- [ ] Auth Persistence funktioniert

### Offline Features
- [ ] Offline-Modus funktioniert
- [ ] Sync nach Online-Gehen
- [ ] PWA Installation funktioniert

### UI/UX
- [ ] Dark Mode funktioniert
- [ ] Responsive Design (Mobile)
- [ ] Drag & Drop smooth (60 FPS)
- [ ] Notifications erscheinen

---

## 🔧 Developer Tools

### Console Messages zum Checken

**Erfolgreich:**
```
✅ Auth Persistence: LOCAL (user stays signed in)
[OfflineQueue] Initialized: eisenhauer-sync-queue
[DragManager] Initialized
[KeyboardDragManager] Initialized
```

**Fehler (sollten NICHT erscheinen):**
```
❌ offlineQueue.on is not a function
❌ TypeError: Cannot read property...
```

### LocalStorage Check
```javascript
// In Console ausführen:
localStorage.getItem('firebase:authUser:AIzaSyDVZh7wLZeFXpoxIqwKFtC8KsYj9zF6lBM:[DEFAULT]')
// Sollte User-Daten zurückgeben (langer JSON String)
```

### IndexedDB Check
1. F12 → Application → IndexedDB
2. `eisenhauer` → `queue_eisenhauer-sync-queue`
3. Sollte Queue-Items sehen

---

## 📝 Feedback geben

**Bei Problemen:**
1. Screenshot machen
2. Console Errors kopieren
3. Beschreiben was du gemacht hast
4. Posten in Issue #76

**GitHub Issue:**
https://github.com/S540d/Eisenhauer/issues/76

---

## 🚀 Nach erfolgreichem Testing

Wenn alles funktioniert:
1. Feedback geben in Issue #76
2. Entscheidung: Merge to `main` und Production Deploy?
3. Oder: Weitere Fixes auf `testing` Branch?

---

**Viel Erfolg beim Testen! 🎉**
