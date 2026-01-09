# Eisenhauer Matrix - Task Management App

Eine moderne, mobile-first Progressive Web App zur Aufgabenverwaltung nach der Eisenhauer-Matrix-Methode.

🌐 **Live Demo:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/) - v1.6.0

📝 **[Changelog](CHANGELOG.md)** | ♿ **[Accessibility Audit](tests/accessibility/ACCESSIBILITY_AUDIT.md)** | 🔧 **[Installation](INSTALL.md)**

## Features

### 5 Segmente
- **Do!** - Dringend & Wichtig (Sofort erledigen)
- **Schedule!** - Nicht dringend & Wichtig (Planen)
- **Delegate!** - Dringend & Nicht wichtig (Delegieren)
- **Ignore!** - Nicht dringend & Nicht wichtig (Eliminieren)
- **Done!** - Erledigte Aufgaben

### Kernfunktionen
- ✅ Aufgaben mit max. 140 Zeichen erstellen
- ✅ **Wiederkehrende Aufgaben** - Zeitbasierte automatische Neuerstellung (⭐ NEU: v1.6.0)
  - Täglich, Wöchentlich, Monatlich oder Benutzerdefiniert
  - Erscheinen erst, wenn sie fällig sind (z.B. täglich morgen um 00:00)
  - Serie komplett löschen via Edit-Modal
  - Flexible Intervall-Konfiguration
- ✅ Automatisches Weiterschieben in nächste Kategorie (↓ Button)
- ✅ Checkboxen zum Abhaken (verschiebt automatisch zu "Done!")
- ✅ **Drag & Drop zwischen Segmenten** - 3 Modi:
  - **Maus:** Klicken & Ziehen
  - **Touch:** Tap & Hold, dann ziehen (Mobile)
  - **Keyboard:** Space → Arrow Keys → Enter (⭐ NEU: Accessibility)
- ✅ **Swipe-to-Delete** - Tasks durch Wischgeste löschen (Mobile)
- ✅ **Delete Button** - Desktop-freundliche Lösch-Option (nur Done-Aufgaben)

### Cloud & Sync
- ✅ **Cloud-Synchronisation** mit Firebase
- ✅ **Benutzer-Accounts** (Google/Apple Sign-In)
- ✅ **Auth Persistence** - Dauerhaft angemeldet bleiben (⭐ NEU: kein wiederholtes Login mehr!)
- ✅ **Gastmodus** - Ohne Anmeldung testen mit lokalem Speicher
- ✅ **Geräte-übergreifende Sync** (bei Cloud-Login)
- ✅ **Offline-First Architecture** mit OfflineQueue
  - Änderungen werden lokal gespeichert wenn offline
  - Automatische Synchronisation wenn wieder online
  - Keine Datenverluste mehr (⭐ FIXED)
- ✅ **Persistente Speicherung** mit IndexedDB (größer & sicherer als localStorage)
- ✅ **Persistent Storage API** verhindert automatisches Löschen durch Browser
- ✅ **Offline-Indikator** zeigt Verbindungsstatus
- ✅ **Pull-to-Refresh** für Datenaktualisierung (Mobile)

### Design & UX
- ✅ **Dark Mode** - Automatisch basierend auf System-Einstellung
- ✅ **Mobile-First Design** - Optimiert für Smartphones
- ✅ **Responsive Layout** - Funktioniert auf Desktop & Tablet
- ✅ **Kompaktes Layout** mit scrollbaren Task-Listen
- ✅ **Progressive Web App (PWA)** - Als App installierbar
- ✅ **iOS-optimiert** mit speziellen Meta-Tags

### ♿ Accessibility (Barrierefreiheit)
- ✅ **WCAG 2.1 Level AA Fully Compliant** (⭐ NEU: 100% konform!)
- ✅ **Vollständige Tastatursteuerung:**
  - Space: Task auswählen
  - Pfeiltasten: Zwischen Quadranten navigieren
  - Enter: Verschieben bestätigen
  - Escape: Abbrechen
- ✅ **Screen Reader Support:**
  - ARIA live region announcements
  - Task-Bewegungen werden angesagt
  - Kompatibel mit VoiceOver, NVDA, JAWS, TalkBack
- ✅ **Visuelle Indikatoren:**
  - Enhanced focus indicators
  - Keyboard selection feedback
  - Dark mode support
- 📊 **Audit:** [Accessibility Audit](tests/accessibility/ACCESSIBILITY_AUDIT.md)

### Datenmanagement
- ✅ **Export/Import** - Daten als JSON exportieren und importieren
  - Download-Button in Einstellungen
  - Import mit Merge/Replace Optionen
  - Backup-Dateien mit Versionsinformation und Datum
- ✅ **Suche** - Aufgaben durchsuchen über Einstellungsmenü

## Verwendung

### Desktop/Browser
1. Neue Aufgabe eingeben und auf "+" klicken
2. Segment auswählen
3. **Optional:** Wiederkehrende Aufgabe konfigurieren
   - Checkbox "🔁 Als wiederkehrende Aufgabe" aktivieren
   - Intervall auswählen (Täglich, Wöchentlich, Monatlich, Benutzerdefiniert)
   - Bei Wöchentlich: Wochentage auswählen
   - Bei Monatlich: Tag des Monats festlegen (1-31)
   - Bei Benutzerdefiniert: Anzahl Tage angeben
4. Aufgaben verwalten:
   - **Checkbox anklicken** → Aufgabe wandert zu "Done!" (bei wiederkehrenden Aufgaben wird automatisch eine neue erstellt)
   - **Drag & Drop** → Aufgabe in anderes Segment ziehen
   - **↓ Button** → Aufgabe in nächste Kategorie verschieben
   - **✕ Button** → Aufgabe löschen (mit Bestätigung)
   - **🔁 Symbol** → Zeigt an, dass es sich um eine wiederkehrende Aufgabe handelt

### Mobile (Touch)
- **Swipe links** auf Task → Löschen mit Animations-Feedback
- Alle anderen Features wie Desktop verfügbar
- **Pull down** auf Task-Liste → Aktualisieren
- **Tap & Hold** → Drag & Drop

### Export/Import
1. **Einstellungen öffnen** (⋮ Icon oben rechts)
2. **Export JSON** → Lädt Backup-Datei herunter (`eisenhauer-backup-YYYY-MM-DD.json`)
   - Enthält alle Aufgaben, Versionsnummer und Exportdatum
3. **Import JSON** → Datei auswählen
   - **Merge-Option:** Importierte Aufgaben zu bestehenden hinzufügen
   - **Replace-Option:** Bestehende Aufgaben komplett ersetzen
   - Automatische Validierung des Datenformats

## Technologien

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, CSS Variables)
- **JavaScript:** Vanilla ES6+ (kein Framework)
- **Storage:**
  - **IndexedDB** via localForage (Gastmodus - ~50MB+ Speicher)
  - **Persistent Storage API** (verhindert Datenverlust bei Cache-Löschung)
  - Cloud Firestore (für angemeldete User)
- **Backend:** Firebase
  - Firebase Authentication (Google Sign-In)
  - Cloud Firestore (Echtzeit-Datenbank mit Security Rules)
  - Offline-Persistenz
- **PWA Features:**
  - Service Worker für Offline-Funktionalität
  - Web App Manifest
  - iOS Web App Capable

## Installation

### 1. Firebase Setup (erforderlich für Login)

**Wichtig:** Die App benötigt Firebase für User-Authentifizierung und Cloud-Sync.

1. Folge der detaillierten Anleitung in [FIREBASE-SETUP.md](FIREBASE-SETUP.md)
2. Erstelle ein kostenloses Firebase-Projekt
3. Aktiviere Google & Apple Sign-In
4. Richte Firestore Database ein
5. Kopiere `firebase-config.example.js` zu `firebase-config.js`
6. Trage deine Firebase-Credentials in `firebase-config.js` ein

⏱️ **Dauer:** ~10 Minuten | 💰 **Kosten:** Kostenlos (Firebase Spark Plan)

**Hinweis:** `firebase-config.js` ist in `.gitignore` und wird nicht committed - deine Credentials bleiben privat!

### 2. Lokale Entwicklung

```bash
git clone https://github.com/S540d/kleines-langweiliges-Testprojekt.git
cd kleines-langweiliges-Testprojekt
```

Dann `index.html` im Browser öffnen oder lokalen Server starten:
```bash
python3 -m http.server 8000
# Oder
npx http-server
```

### 3. Als iOS App installieren

Die App kann als Progressive Web App auf iOS installiert werden!

1. Icons generieren: Öffne `icons/generate-icons.html` und lade alle Icons herunter
2. App auf GitHub Pages hosten (siehe [INSTALL.md](INSTALL.md))
3. Im Safari öffnen → "Teilen" → "Zum Home-Bildschirm"
4. Fertig! Die App läuft wie eine native iOS App

📱 **Detaillierte Anleitung:** Siehe [INSTALL.md](INSTALL.md)

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## Datenspeicherung

### Gastmodus (ohne Anmeldung)
- **Speicherort:** IndexedDB (über localForage)
- **Kapazität:** ~50MB+ (viel größer als localStorage)
- **Persistenz:** Persistent Storage API verhindert automatisches Löschen
- **Synchronisation:** Nur auf diesem Gerät verfügbar
- **Sicherheit:** Lokal gespeichert, Same-Origin-Policy geschützt

### Cloud-Modus (mit Anmeldung)
- **Speicherort:** Firebase Cloud Firestore
- **Synchronisation:** Automatisch auf allen Geräten
- **Sicherheit:**
  - Firebase Security Rules mit strikter Validierung
  - XSS-Schutz durch konsequente Verwendung von `textContent`
  - Authentifizierung erforderlich
  - User können nur eigene Daten lesen/schreiben
  - Input-Validierung (max. 140 Zeichen, nur erlaubte Segmente)

## Roadmap

Geplante Features (siehe [Issues](https://github.com/S540d/Eisenhauer/issues)):

- [ ] Archiv für gelöschte Tasks
- [ ] Weitere Authentifizierungs-Anbieter
- [ ] CSV Export (für Excel/Sheets)
- [ ] PDF Export (für Druck)
- [ ] Kategorien/Tags
- [ ] Fälligkeitsdaten
- [ ] Erinnerungen/Benachrichtigungen

## Lizenz

Dieses Projekt steht unter der Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

**Das bedeutet:**
- ✅ Du darfst das Projekt nutzen, kopieren und modifizieren
- ✅ Du darfst es für private/persönliche Zwecke verwenden
- ❌ Kommerzielle Nutzung ist **nicht** erlaubt
- ℹ️ Bei Verwendung muss der Urheber genannt werden

Siehe [LICENSE](LICENSE) für Details.

## Mitwirken

Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue öffnen.

### 🧪 Testing & Environment Workflow (Issue #74, #111)

Dieses Projekt nutzt **3 separate Environments** für sicheres Deployment:

**Environments:**
- 🧪 **Testing:** [https://s540d.github.io/Eisenhauer/testing/](https://s540d.github.io/Eisenhauer/testing/)
- 🔧 **Staging:** [https://s540d.github.io/Eisenhauer/staging/](https://s540d.github.io/Eisenhauer/staging/)
- 🚀 **Production:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/)

**Jedes Environment nutzt eine separate Firebase-Instanz** (Issue #110):

- Production: `eisenhauer-matrix`
- Staging: `eisenhauer-staging` (separates Projekt)
- Testing: `eisenhauer-testing` (separates Projekt)

**Workflow:**

1. Feature Branch erstellen und PR gegen `testing` öffnen
2. Merge in `testing` → Automatischer Deploy auf Testing URL
3. Tests validieren → Merge in `staging` → Deploy auf Staging URL
4. Final approval → Merge in `main` → Production Deploy

**Firebase Setup:**
```bash
# Siehe detaillierte Anleitung
cat FIREBASE_SETUP.md
```

**Detaillierte Dokumentation:**

- [TESTING-WORKFLOW.md](TESTING-WORKFLOW.md) - Deployment Workflow
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase Environment Setup

**Features:**

- ✅ Branch Protection (Require PR approval)
- ✅ Separate Testing/Staging Environments
- ✅ Isolierte Firebase-Projekte (keine Daten-Vermischung)
- ✅ Automatisierte Deployments
- ✅ PR Template mit Checkliste
- ❌ Kein versehentlicher Production Deploy möglich

## Kontakt

Bei Fragen oder Feedback: [GitHub Issues](https://github.com/S540d/Eisenhauer/issues)

---

Made with ❤️ and [Claude Code](https://claude.com/claude-code)

Last updated: 2025-10-09
<!-- workflow test -->
# Deployment works!

