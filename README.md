# Eisenhauer Matrix - Task Management App

Eine moderne, mobile-first Progressive Web App zur Aufgabenverwaltung nach der Eisenhauer-Matrix-Methode.

🌐 **Live Demo:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/) - v1.11.2 ✅

📝 **[Changelog](docs/CHANGELOG.md)** | ♿ **[Accessibility Audit](tests/accessibility/ACCESSIBILITY_AUDIT.md)** | 📐 **[Architecture](docs/ARCHITECTURE.md)**

## Environments

- **Production:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/)
- **Staging:** [https://s540d.github.io/Eisenhauer/staging/](https://s540d.github.io/Eisenhauer/staging/) (Isolierte DB)
- **Testing:** [https://s540d.github.io/Eisenhauer/testing/](https://s540d.github.io/Eisenhauer/testing/) (Isolierte DB)

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
- ✅ **Auth Persistence** - Dauerhaft angemeldet bleiben (⭐ NEU: IndexedDB Persistence für Android TWA)
- ✅ **Gastmodus** - Ohne Anmeldung testen mit lokalem Speicher
- ✅ **Expliziter Daten-Import** (⭐ NEU v1.7.0)
  - Benutzer entscheidet bewusst, wann Gast-Daten zu Account importiert werden
  - Bestätigungsdialog zeigt Import-Anzahl vor Durchführung
  - Gast-Daten werden nach erfolgreichem Import gelöscht
  - **Kein automatisches Mergen** - volle Benutzer-Kontrolle
- ✅ **Datenverlust-Schutz** (⭐ NEU v1.7.0)
  - Keine automatische Überschreibung bestehender Account-Daten
  - Sichere Migration zwischen Geräten/Sessions
  - Explizite Bestätigung vor Datenoperationen
- ✅ **Cache-Busting-System** (⭐ NEU v1.7.0)
  - Automatische Erkennung neuer App-Versionen
  - Force-Fresh-Updates auch bei Browser-Caching
  - Verhindert veraltete Versionen nach Updates
  - Transparent für Benutzer
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
- ✅ **Settings Menu Styling** - Durchdachte UI mit konsistenter Button-Gestaltung (⭐ NEU: v1.6.2-RC)
  - Primäre Aktionen in Blau (#667eea)
  - Einheitliche Abstände und Größen
  - Verbessertes Dark Mode Contrast für Links
- ✅ **Quick Add Modal** - Kompaktes Aufgaben-Dialog mit verbessertem Design (⭐ NEU: v1.6.2-RC)
  - Optimierte Layout-Abstraktion
  - Dynamische Sprach-Unterstützung (Deutsch/Englisch)
  - Konsistent mit Settings-Menu Styling

### 🌍 Sprachunterstützung
- ✅ **Deutsch** - Vollständige Lokalisierung
- ✅ **Englisch** - Complete English translation
- ✅ **Dynamische Sprach-Synchronisation** (⭐ NEU: v1.6.2-RC)
  - Settings-Menü-Sprache wird auf alle UI-Elemente angewendet
  - "Neue Aufgabe" Modal wird in richtiger Sprache angezeigt
  - Wochentags-Abkürzungen (Mo/Di/Mi... oder Mon/Tue/Wed...)
- ✅ **Language Toggle** in Einstellungen (Deutsch/English)

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
- ✅ **Due Dates** - Optionale Fälligkeitsdaten für Aufgaben im Quick Add Modal
- ✅ **Web Push Reminders** - Push-Benachrichtigungen für Aufgaben mit Fälligkeitsdatum
- ✅ **Smart Urgency Rules** - Auto-Markierung als dringend bei Fälligkeit ≤3 Tage (opt-in)
- ✅ **Focus Mode** - Blendet Q3/Q4 aus für konzentrierteres Arbeiten
- ✅ **Category Filter** - Privat/Beruflich-Kategorisierung (opt-in)

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

1. Folge der detaillierten Anleitung in [FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md)
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

## Entwickler Setup

### Branches & Workflow

Dieses Projekt folgt einem **Staging → Production Workflow**:

| Branch | URL | Zweck |
|--------|-----|-------|
| `main` | https://s540d.github.io/Eisenhauer/ | Production (stabil) |
| `staging` | https://s540d.github.io/Eisenhauer/?env=staging | Testing (vor Release) |
| `rework/*` | lokal | Feature-Entwicklung |

### Lokale Entwicklung

#### Setup

```bash
# Repository clonen
git clone https://github.com/S540d/Eisenhauer.git
cd Eisenhauer

# Dependencies installieren
npm install

# Development Server starten
npm start
# oder mit Python (port 8000)
python3 -m http.server 8000
```

#### npm Scripts

```bash
# Formatierung & Linting
npm run format          # Code mit Prettier formatieren
npm run format:check    # Prüfe Code-Formatierung (ohne Änderungen)
npm run lint            # ESLint Linting
npm run lint:fix        # ESLint Fehler automatisch beheben

# Build
npm run build           # Bau für Production (standard)
npm run build:staging   # Bau für Staging-Testing
npm run build:production  # Bau für Production (explicit)

# Testing
npm run test            # Unit Tests mit Vitest
npm run test:ui         # Unit Tests mit UI
npm run test:coverage   # Tests mit Coverage-Report
npm run test:watch      # Tests im Watch-Mode
npm run test:e2e        # End-to-End Tests (Playwright)
npm run test:e2e:ui     # E2E Tests mit UI
npm run test:e2e:headed # E2E Tests sichtbar (nicht headless)
npm run test:e2e:debug  # E2E Tests im Debug-Mode

# Deployment
npm run deploy          # Deploy zu GitHub Pages
npm run validate        # Release Validation Checklist
```

### Staging/Production Workflow

#### 1️⃣ Feature entwickeln

```bash
# Feature Branch erstellen (optional)
git checkout -b feature/my-feature

# Code schreiben, testen, committen
npm run format:check
npm run lint
npm run test
git add .
git commit -m "feat: My new feature"
```

**Pre-Commit Hooks** (automatisch):
- ✅ Prettier formatiert Code
- ✅ ESLint prüft Compliance
- ✅ Konsistenz-Checks

#### 2️⃣ Zu Staging pushen (Testing)

```bash
# Zu staging Branch wechseln
git checkout staging
git merge main (oder feature/my-feature)
git push origin staging

# GitHub Actions läuft automatisch:
# - Tests
# - Build
# - Deploy zu Staging-URL
```

**Staging URL:** `https://s540d.github.io/Eisenhauer/?env=staging`
- ⚠️ Zeigt gelben "STAGING" Banner
- Daten sind Test-Daten
- Verwendet Staging Firebase Project

#### 3️⃣ Nach Test zu Production

```bash
git checkout main
git merge staging
git push origin main

# GitHub Actions läuft automatisch:
# - Tests
# - Build
# - Deploy zu Production-URL
```

**Production URL:** `https://s540d.github.io/Eisenhauer/`
- ✅ Stabile Version für Benutzer
- Keine Test-Banner
- Production Firebase Project

### Environment Detection

Die App erkennt das Environment automatisch via URL Query-Parameter:

```javascript
// Production (default)
https://s540d.github.io/Eisenhauer/

// Staging (für Testing)
https://s540d.github.io/Eisenhauer/?env=staging
```

**Code-Beispiel:**
```javascript
import { isStaging } from './config.js';

if (isStaging()) {
  console.log('Running in STAGING mode');
  // Staging-spezifische Logik
}
```

### Code Quality Standards

Dieses Projekt folgt technischen Vorgaben aus `technische_vorgaben.md`:

✅ **Formatierung:** Prettier (automatisch bei Pre-Commit)
✅ **Linting:** ESLint mit strengen Regeln
✅ **Testing:** Mindestens 60% Coverage für Gesamt-Projekt
✅ **TypeScript:** Schrittweise Migration (aktuell: Vanilla JS)
✅ **Git Hooks:** Husky (format + lint automatisch)

### Troubleshooting

**Problem:** Pre-Commit Hooks schlagen fehl
```bash
# Prettier manuell ausführen
npm run format

# ESLint manuell reparieren
npm run lint:fix

# Husky neu installieren
npx husky install
```

**Problem:** Tests schlagen fehl
```bash
# Aktualisiere Dependencies
npm ci

# Starte Tests mit Debug
npm run test:watch
```

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

### 🧪 Testing Workflow (Issue #74)

Dieses Projekt nutzt einen automatisierten Testing-Workflow für sicheres Deployment:

**Environments:**
- 🧪 **Testing:** [https://s540d.github.io/Eisenhauer-testing/](https://s540d.github.io/Eisenhauer-testing/)
- 🚀 **Production:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/)

**Workflow:**
1. Feature Branch erstellen und PR gegen `main` öffnen
2. In `testing` Branch mergen → Automatischer Deploy auf Testing URL
3. Partner testet und approved den PR
4. Nach Approval: Merge in `main` → Automatischer Production Deploy

**Einmalige Einrichtung:**
```bash
./.github/scripts/quick-setup.sh
```

**Detaillierte Dokumentation:** Siehe [TESTING-WORKFLOW.md](TESTING-WORKFLOW.md)

**Features:**
- ✅ Branch Protection (Require PR approval)
- ✅ Separate Testing Environment
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

