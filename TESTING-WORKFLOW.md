# Testing Workflow - Anleitung für Tester

Dieses Dokument beschreibt den Ablauf für die Testing-Phase von Eisenhauer v1.6.1.

---

## Vorbereitung

### 1. Umgebung einrichten
```bash
# Repository klonen (falls noch nicht geschehen)
git clone https://github.com/S540d/Eisenhauer.git
cd Eisenhauer

# Dependencies installieren
npm install

# Build durchführen
npm run build

# Validierung durchführen (sollte alle Checks bestehen)
npm run validate
```

### 2. App starten
```bash
# Für manuelle Tests (Browser öffnen)
npm start
# → App läuft auf http://localhost:8000

# Für E2E Tests automatisiert
npm run test:e2e

# Für E2E Tests im UI (visuell mit Browser)
npm run test:e2e:ui

# Für Unit Tests
npm test
```

---

## Testing Kategorien

### A. Quick Smoke Test (10 Minuten)
**Ziel:** Überprüfen, dass die App grundsätzlich funktioniert

1. App im Browser öffnen → http://localhost:8000
2. Eine Aufgabe erstellen: "Test Task"
3. In Quadrant 2 verschieben
4. Abhaken → sollte zu "Done" wandern
5. Neue Aufgabe erstellen und mit ↓ Button verschieben
6. Aufgabe löschen
7. Einstellungen öffnen
8. App schließen

**Erwartung:** Alles funktioniert ohne Fehler

---

### B. Feature Tests (30 Minuten)

#### B1: Wiederkehrende Aufgaben
- [ ] Neue Aufgabe erstellen
- [ ] "🔁 Als wiederkehrende Aufgabe" aktivieren
- [ ] **Täglich:** Erstellen, abhaken, übermorgen schauen ob neue da ist
- [ ] **Wöchentlich:** Erstellen mit Montag, abhaken, nächste Woche überprüfen
- [ ] **Monatlich:** Erstellen mit Tag 15, abhaken, nächsten Monat überprüfen
- [ ] **Benutzerdefiniert:** Mit 3 Tagen erstellen, abhaken, nach 3 Tagen überprüfen

#### B2: Drag & Drop
- [ ] **Desktop (Maus):** Task von Q1 zu Q3 ziehen
- [ ] **Mobile (Touch):** Task halten und ziehen
- [ ] **Keyboard:**
  1. Tab bis Task fokussiert
  2. Space drücken (selektiert Task)
  3. Pfeiltasten zur Navigation
  4. Enter zum Verschieben

#### B3: Offline Funktionalität
- [ ] Task erstellen
- [ ] Dev Tools öffnen (F12)
- [ ] Network → Offline schalten
- [ ] Neue Task erstellen (sollte funktionieren)
- [ ] Task verschieben (sollte funktionieren)
- [ ] Online schalten → Tasks sollten synchronisieren
- [ ] Offline-Indikator sollte den Status zeigen

#### B4: Datenmanagement
- [ ] Mehrere Tasks erstellen (mind. 5)
- [ ] Einstellungen → Export → JSON downloaden
- [ ] Alle Tasks löschen
- [ ] Einstellungen → Import → JSON laden (Merge)
- [ ] Tasks sollten wieder da sein

---

### C. Cloud & Auth Tests (falls Firebase configured)

#### C1: Google Sign-In
- [ ] Login Button klicken
- [ ] Google Account auswählen
- [ ] Nach Login → Benutzer-Email angezeigt?
- [ ] Neue Tasks erstellen
- [ ] Seite neu laden → Tasks noch da?
- [ ] Logout → Sollte zum Gast-Modus zurückfallen

#### C2: Daten-Synchronisation
- [ ] Zwei Browser-Fenster öffnen (gleicher Account)
- [ ] In Fenster 1: Task erstellen
- [ ] In Fenster 2: Sollte Aufgabe nach kurzer Verzögerung erscheinen
- [ ] In Fenster 2: Task verschieben
- [ ] In Fenster 1: Sollte Task bewegt sein

---

### D. Accessibility Tests (♿)

#### D1: Tastatursteuerung
```
1. Tab-Key mehrmals drücken
   → Focus sollte auf jedem interaktiven Element sichtbar sein

2. Zu einer Task navigieren, Space drücken
   → Task sollte selektiert werden (visueller Hinweis)

3. Pfeiltasten nutzen
   → Navigation zu anderem Quadranten

4. Enter drücken
   → Task sollte versetzt werden

5. Escape drücken
   → Aktion sollte abgebrochen werden
```

#### D2: Screen Reader (optional, für Spezialisten)
```
Windows: NVDA nutzen
Mac: VoiceOver (Cmd+F5)

Zu überprüfen:
- Task-Text wird vorgelesen
- Button-Labels sind aussagekräftig
- Erfolgs-Meldungen werden angesagt
- Fehler werden angesagt
```

---

### E. Browser Compatibility Tests

#### Desktop Browser
- [ ] Chrome/Edge (aktuell)
- [ ] Firefox (aktuell)
- [ ] Safari (aktuell, macOS)

#### Mobile Browser
- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Samsung Internet (optional)

#### PWA Installation
- [ ] **Chrome/Edge (Desktop):**
  1. App öffnen
  2. Adressleiste → "App installieren"
  3. Installieren
  4. Task erstellen
  5. Überprüfen, dass Daten persistiert werden

- [ ] **iOS:**
  1. Safari öffnen → App URL laden
  2. Share Button → "Zum Home-Bildschirm"
  3. "Zum Home-Bildschirm hinzufügen"
  4. App öffnen
  5. Funktionalität überprüfen

---

### F. Performance & Load Tests

#### F1: App Startup
```
1. DevTools öffnen (F12)
2. Performance Tab
3. App neu laden
4. Reload Button drücken (rot)
5. App sollte in < 2 Sekunden geladen sein
6. Performance Trace überprüfen
```

#### F2: Drag & Drop Smoothness
- Mehrere Tasks (20+) erstellen
- Drag & Drop durchführen
- Sollte flüssig sein (60 FPS)
- Keine Ruckler oder Verzögerungen

#### F3: Memory Usage
- DevTools öffnen (Memory Tab)
- App starten
- Baseline Memory überprüfen (~20-30 MB)
- 50 Tasks erstellen
- Erneut Speicher überprüfen (sollte nicht explodieren)
- Wert sollte < 100 MB sein

---

## Bug Reporting

### Format
```
Title: [COMPONENT] Kurze Beschreibung

**Steps to Reproduce:**
1. Schritt 1
2. Schritt 2
3. ...

**Expected Behavior:**
Was sollte passieren?

**Actual Behavior:**
Was passiert tatsächlich?

**Environment:**
- Browser: Chrome 120 / Safari / Firefox
- OS: Windows 10 / macOS 14 / iOS 17 / Android 14
- Device: Desktop / Mobile (iPhone 14 / Pixel 8)
- App Version: 1.6.1
```

### Beispiel Bug Report
```
Title: [DRAG-DROP] Task wird in falschem Quadrant angezeigt

**Steps to Reproduce:**
1. Task in Quadrant 1 erstellen
2. Task per Drag & Drop zu Quadrant 3 verschieben
3. Seite neu laden (F5)

**Expected Behavior:**
Task sollte immer noch in Quadrant 3 sein

**Actual Behavior:**
Task ist zurück in Quadrant 1

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- App Version: 1.6.1
```

---

## Test-Berichte erstellen

### Zusammenfassung nach Test-Session
```
## Testing Session vom [DATUM]

### Getestete Komponenten
- [ ] Core Functionality
- [ ] Wiederkehrende Aufgaben
- [ ] Cloud & Auth
- [ ] Offline
- [ ] Accessibility
- [ ] Performance

### Gefundene Bugs
1. [BUG-001] Beschreibung
   - Severity: Critical / Major / Minor
   - Browser: Chrome 120
   - Reproducible: Always / Sometimes / Never

### Bestandene Tests
✅ Alle Core Features funktionieren
✅ Offline-Mode funktioniert
✅ Drag & Drop flüssig

### Empfehlungen
- ...
```

---

## Checkliste für Tester-Abnahme

### Vor Start
- [ ] Repository geklont
- [ ] npm install durchgeführt
- [ ] npm run validate bestanden
- [ ] npm start erfolgreich

### Während Test-Session
- [ ] Mindestens 2 Browser getestet
- [ ] Mind. 3 der Test-Kategorien (A-F) durchgeführt
- [ ] Alle gefundenen Bugs dokumentiert
- [ ] DevTools Console auf Fehler überprüft

### Nach Test-Session
- [ ] Bug Reports auf GitHub erstellt (falls vorhanden)
- [ ] Test-Bericht zur Verfügung gestellt
- [ ] Feedback an Team gegeben

---

## Support

**Fragen?** Erstelle ein Issue auf GitHub: [S540d/Eisenhauer/issues](https://github.com/S540d/Eisenhauer/issues)

**Tester Slack Channel:** #eisenhauer-testing (falls vorhanden)

---

**Testing Phase Start:** 2025-12-22
**Version:** 1.6.1
**Zielversion für Release:** 1.6.1 (production ready)
