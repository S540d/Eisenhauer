# Google Play Store Publishing Roadmap

**Zentrale Richtlinie für die Veröffentlichung aller Apps im Google Play Store**

---

## 📅 Veröffentlichungs-Timeline

| Projekt | Status | Zieldatum | Phase |
|---------|--------|-----------|-------|
| **1x1_Trainer** | Finale Tests bei Google | Sofort/Diese Woche | Release |
| **EnergyPriceGermany** | Technisch fertig | +2 Wochen | Pre-Registration |
| **Eisenhauer** | Production Ready | +6 Wochen | Development |
| **Pflanzkalender** | In Entwicklung | +8-10 Wochen | Development |
| **CD-to-Spotify-PWA** | Sehr früh | +12+ Wochen | Development |

---

## 🎯 Phase 1: 1x1_Trainer (Diese Woche - Release)

**Status:** Finale Tests bei Google, Release unmittelbar bevorstehend

### Sofortmaßnahmen
- [ ] **Monitor Google Play Console** - Warte auf Google-Feedback zu aktuellen Tests
- [ ] **Behebe alle Test-Findings** - Falls Google Probleme meldet
- [ ] **Veröffentliche Release-Version** - Sobald alle Tests bestanden sind
- [ ] **Kommuniziere Release** - Ankündigung auf GitHub/Website

### Nach Release
- [ ] User Reviews monitoren (tägliche Überprüfung erste Woche)
- [ ] Crash Reports überprüfen (Firebase)
- [ ] Performance Metriken überwachen
- [ ] Bug Fixes vorbereiten für v1.1

### Dokumentation
- [ ] Create release notes
- [ ] Update App Store Listing
- [ ] Add release information to GitHub

---

## 🎯 Phase 2: EnergyPriceGermany (2 Wochen Timeline)

**Status:** Technisch sehr weit, Anmeldung in 2 Wochen geplant

### Woche 1: Vorbereitung

#### Technische Finalisierung
- [ ] Build APK/AAB im Production Mode
- [ ] Test auf echtem Android Device (mindestens 2 Devices)
- [ ] Screen Readers testen (TalkBack)
- [ ] Offline-Funktionalität prüfen
- [ ] Alle Links testen (Coffee Link, etc.)
- [ ] Landscape Mode auf Tablets testen
- [ ] Dark Mode Verhalten prüfen

#### Store Listing Vorbereitung
- [ ] **App Name:** Energy Price Germany (kurz, < 50 Zeichen)
- [ ] **Short Description:** (80 Zeichen) - z.B. "Aktuelle Strompreise in Deutschland"
- [ ] **Full Description:** (4000 Zeichen)
  - Was macht die App
  - Hauptfeatures
  - Datenschutzerklärung Link
  - Support Link (Buy Me a Coffee)
- [ ] **Screenshots** (min. 2, max. 8)
  - Mindestgröße: 1080x1920px
  - Format: PNG oder JPEG
  - Content: App in Aktion zeigen
- [ ] **Feature Graphic** (1024x500px für Banner)
- [ ] **Icon** (512x512px, PNG, keine Transparenz-Säume)

#### Store Compliance
- [ ] **Privacy Policy** - Link zu vollständiger Policy
- [ ] **Data Safety** Formular in Play Console ausfüllen
  - Datensammlung: Minimal (lokal, offline)
  - Persönliche Daten: Keine
  - Ads: Nein
- [ ] **Age Rating** bestimmen (wahrscheinlich 3+)
- [ ] **Content Rating Questionnaire** ausfüllen

### Woche 2: Registrierung & Launch

#### Play Console Setup
- [x] Google Developer Account aktivieren (falls nicht vorhanden)
- [x] Developer Program Agreement akzeptieren
- [x] Zahlungsmethode hinterlegen ($25 einmalig)
- [x] Neues App-Projekt in Play Console erstellen

#### Store Listing Upload
- [x] App-Screenshots hochladen
- [x] Feature Graphic hochladen
- [x] Icon hochladen
- [x] Alle Text-Felder ausfüllen
- [x] Links konfigurieren (Privacy Policy, Support)

#### Technical Setup
- [ ] AAB (Android App Bundle) hochladen
- [ ] Testversionen durchlaufen (Google intern)
- [ ] Auf Release-Kanal hinzufügen

#### Veröffentlichung
- [ ] Pre-Launch Reports überprüfen
- [ ] Rollout starten (z.B. 50%, dann 100%)
- [ ] Google Play Listing Live schalten

### Nach Launch
- [ ] Wertung & Reviews monitoren
- [ ] Performance Metrics überwachen
- [ ] Bug Fixes als Minor Updates bereithalten

**Blockers zu prüfen:**
- Zertifikatskette für HTTPS gültig?
- App-Signatur korrekt?
- Alle Permissions notwendig und dokumentiert?
- Deep Links funktionieren?

---

## 🎯 Phase 3: Eisenhauer (6 Wochen Timeline)

**Status:** Technisch production ready, PWA → Android App

### Wochen 1-2: TWA/Android Setup

**Hinweis:** Eisenhauer ist eine PWA. Für Play Store müssen wir sie als TWA (Trusted Web Activity) oder Native Wrapper verpacken.

#### Options:
1. **Bubblewrap** (Google-offizielle TWA Lösung)
   - Automatisiert APK-Generierung aus PWA
   - Minimal Code, Update-Management über Website
   - Recommended für PWAs

2. **Android Studio TWA Project**
   - Mehr Control, aber komplexer
   - CustomTabs Integration

3. **Cordova/Capacitor**
   - Alte Alternative, nicht recommended

**Empfohlener Weg: Bubblewrap**

#### TWA Vorbereitung
- [ ] Node.js und Bubblewrap installieren
  ```bash
  npm install -g @bubblewrap/cli
  bubblewrap help
  ```
- [ ] Eisenhauer PWA validieren
  - [ ] Service Worker korrekt?
  - [ ] manifest.json vorhanden?
  - [ ] HTTPS überall?
  - [ ] Icons alle Größen?
- [ ] Google Play Billing vorbereiten (falls In-App-Käufe)

#### Signing Certificate Setup
- [ ] Android Signing Key generieren (oder existierenden verwenden)
  ```bash
  keytool -genkey -v -keystore eisenhauer-key.keystore \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias eisenhauer-release
  ```
- [ ] Fingerprint notieren (SHA-256)
- [ ] Sicher speichern (nicht in Git!)

#### assetlinks.json Setup
- [ ] Datei: `public/.well-known/assetlinks.json` erstellen
  ```json
  [
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.sven4321.eisenhauer",
        "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
      }
    }
  ]
  ```
- [ ] HTTPS unter `https://eisenhauer-domain.com/.well-known/assetlinks.json` erreichbar?

#### Bubblewrap PWA→APK
- [ ] APK mit Bubblewrap generieren
  ```bash
  bubblewrap init --manifest https://eisenhauer.de/manifest.json
  bubblewrap build
  ```
- [ ] APK lokal testen
- [ ] Auf mehreren Geräten verifizieren

### Wochen 3-4: Store Listing

- [ ] Screenshots (min. 2, max. 8)
  - Mindestens 1080x1920px
  - Android-natives Feeling
- [ ] Feature Graphic (1024x500px)
- [ ] Kurzbeschreibung (80 Zeichen)
- [ ] Vollständige Beschreibung (4000 Zeichen)
  - What makes Eisenhauer special
  - Offline-Funktionalität hervorheben
  - Features auflisten
- [ ] Privacy Policy Link
- [ ] Content Rating ausfüllen

### Wochen 5-6: Testing & Launch

- [ ] Pre-Launch Reports durchgehen
- [ ] Crash Reports prüfen
- [ ] Veröffentlichung starten (50% → 100%)

**Kritische Punkte:**
- [ ] TWA Deep Linking funktioniert?
- [ ] Service Worker Updates funktionieren?
- [ ] assetlinks.json korrekt verlinkt?
- [ ] Offline Mode funktioniert?

---

## 🎯 Phase 4: Pflanzkalender (8-10 Wochen Timeline)

**Status:** Recht weit, aber noch nicht production ready

### Schritte zur Production Readiness (Wochen 1-3)

#### Code Quality
- [ ] Alle Warnings beheben
- [ ] TypeScript strict mode?
- [ ] Eslint issues beheben
- [ ] Unused code aufräumen
- [ ] Error Boundaries hinzufügen

#### Features & Funktionalität
- [ ] Alle Features implementiert & getestet
- [ ] Edge cases abgedeckt
- [ ] Error Handling robust
- [ ] Loading States überall
- [ ] Empty States für leere Seiten
- [ ] Offline-Funktionalität (falls PWA)

#### Testen
- [ ] Unit Tests (60%+ Coverage mindestens für kritische Module)
- [ ] Integration Tests
- [ ] E2E Tests (mindestens Happy Path)
- [ ] Performance: Lighthouse 80+
- [ ] Accessibility: axe-core ohne Issues
- [ ] Testing auf echter Hardware

#### Design & UX
- [ ] Design Consistency (ux-vorgaben.md beachten)
- [ ] Dark Mode funktioniert?
- [ ] Responsive Design (Mobile, Tablet)
- [ ] Touch Targets >= 44x44px
- [ ] Focus Rings sichtbar
- [ ] Loading Spinners überall wo nötig

### Store Listing (Wochen 4-6)
- [ ] Alle Listing-Elemente wie oben (EnergyPriceGermany Template)
- [ ] Unique Selling Points hervorheben
- [ ] Plant Categories Features
- [ ] Offline/PWA Benefits

### Testing & Launch (Wochen 7-10)
- [ ] Beta Release auf einige User
- [ ] Feedback einholen
- [ ] Minor Fixes basierend auf Beta-Feedback
- [ ] Full Release starten

---

## 🎯 Phase 5: CD-to-Spotify-PWA (12+ Wochen Timeline)

**Status:** Noch in Entwicklung, sehr frühe Phase

### Development (Weeks 1-6)
- [ ] Alle Core Features implementiert
- [ ] Spotify API Integration stabil
- [ ] Authentication Flow sicher
- [ ] User Experience polished
- [ ] Error Handling robust

### Production Readiness (Weeks 7-10)
- [ ] Tests (60%+ Coverage)
- [ ] Performance Optimization
- [ ] Accessibility Audit
- [ ] Security Review
  - [ ] API Keys sicher gehändelt
  - [ ] OAuth Flow secure
  - [ ] Input Validation
  - [ ] HTTPS überall

### Launch Preparation (Weeks 11-12)
- [ ] Alle Checklisten
- [ ] Store Listing vorbereiten
- [ ] APK/AAB generieren

---

## 📋 Google Play Store Allgemeine Anforderungen

### Technische Anforderungen

#### Android SDK
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34 oder höher (aktuell: 36)
- Compiledln SDK: 34+

#### Build & Signing
- App muss mit Debug-Keystore UNsigniert sein (lokal)
- Upload-Keystore für Play Console (sicher speichern!)
- AAB (Android App Bundle) Format bevorzugt über APK

#### Permissions
- Nur notwendige Permissions anfordern
- INTERNET: Fast immer notwendig
- Andere: Dokumentieren warum

#### Herunterladen ab PlayStore:
```bash
# Android App Bundle erstellen
./gradlew bundleRelease

# APK aus Bundle erstellen
bundletool build-apks --bundle=app.aab --output=app.apks \
  --ks=signing.keystore --ks-pass=pass:PASSWORD \
  --ks-key-alias=ALIAS --key-pass=pass:PASSWORD
```

### Store Listing Requirements

#### Text Requirements
- **App Name:** 50 Zeichen max
- **Short Description:** 80 Zeichen max
- **Full Description:** 4000 Zeichen max
- **Alle Texte müssen:**
  - Grams korrekt sein
  - Keine Spam-Keywords
  - Keine Fake Reviews anfordern
  - Keine Versprechungen, die App nicht hält

#### Visual Assets
- **Icon:** 512×512px, PNG, kein transparenter Saum
- **Screenshots:** 1080×1920px oder größer (2:3 ratio)
  - Mindestens 2, maximal 8
  - Hochwertig, nicht einfach Screenshots
- **Feature Graphic:** 1024×500px
  - Optional aber recommended
- **Alle Assets:** PNG oder JPEG

#### Content Rating
- **Füllen Sie Content Rating Questionnaire aus**
- Bestimmt automatisch: ESRB, IARC Rating
- Meisten Apps: Everyone (3+) oder Everyone 10+

### Privacy & Security

#### Privacy Policy
- **REQUIRED für alle Apps**
- Muss HTTPS-verlinkt sein
- Muss folgende Punkte abdecken:
  - What data ist collected
  - How data is used
  - Sharing mit Dritten
  - User rights
- **Google Privacy Template verwenden:** https://support.google.com/googleplay/answer/9840674

#### Data Safety Section
- **Play Console Form ausfüllen:**
  - Data types (if any)
  - Security practices
  - Ads declarations
  - Ad Personalization
- **Honesty:** Falsche Angaben = Suspender Account

#### Security Requirements
- [ ] HTTPS überall (kein HTTP)
- [ ] Certificate valid
- [ ] No insecure permissions
- [ ] No malware/viruses
- [ ] Keine "sensitive" APIs ohne Rechtfertigung

### Policy Compliance

#### Prohibited Content
- ❌ No hate speech
- ❌ No violence/gore
- ❌ No sexual content
- ❌ No circumventing system restrictions
- ❌ No malware

#### Ads & Monetization
- **Deklaration erforderlich:** "Contains Ads" flag
- **Für Apps mit Support-Links:**
  - ✅ Links zu Support-Seite = OK
  - ✅ "Buy Me a Coffee" Link = OK (nicht als Ads gezählt)
  - ❌ In-App Banner = würde als Ads gezählt
  - ❌ In-App Popup Ads = würde als Ads gezählt

#### In-App Purchases
- Muss deklariert werden
- Muss transparent sein (Preise deutlich)

---

## 🛠️ Spezifische Setup-Anforderungen pro App

### 1x1_Trainer
**Technologie:** React Native + Expo
**TWA/APK:** Expo Build System
```bash
eas build --platform android --auto-submit
```
- [ ] Expo Account aktiv
- [ ] eas.json konfiguriert
- [ ] Signing Certificate (Expo verwaltet)

### EnergyPriceGermany
**Technologie:** React Native + Expo oder bare React Native
**TWA/APK:** [Check App-spezifisch]
- [ ] Build process definiert
- [ ] Signing Certificate bereit
- [ ] TestFlight/Beta Testing läuft?

### Eisenhauer
**Technologie:** PWA (HTML/CSS/JS)
**TWA/APK:** Bubblewrap empfohlen
- [ ] Bubblewrap installieren
- [ ] assetlinks.json Setup
- [ ] SHA-256 Fingerprint berechnen

### Pflanzkalender
**Technologie:** React Native + Expo
**TWA/APK:** Expo Build System
- [ ] Expo Build konfigurieren
- [ ] Testing auf mehreren Devices

### CD-to-Spotify-PWA
**Technologie:** PWA (React oder Vanilla JS)
**TWA/APK:** Bubblewrap + Spotify OAuth Integration
- [ ] Spotify API Keys sicher speichern
- [ ] OAuth Flow dokumentieren
- [ ] Privacy Policy für Spotify-Daten

---

## 📅 Pre-Launch Checkliste (alle Apps)

### 1 Woche vor Launch
- [ ] Play Console Listing vollständig (Screenshots, Beschreibung, etc.)
- [ ] Privacy Policy Link gültig
- [ ] Contact Email hinterlegt
- [ ] Price gesetzt (kostenlos vs kostenpflichtig)
- [ ] APK/AAB erfolgreich hochgeladen
- [ ] Test auf echtem Gerät durchgeführt
- [ ] Lighthouse Score 80+
- [ ] Accessibility: Keine kritischen Fehler (axe)
- [ ] Content Rating eingereicht
- [ ] Support Email vorbereitet

### Pre-Launch Report (von Google)
- [ ] Alle Fehler behoben
- [ ] Warnings überprüft
- [ ] Performance OK (unter 100MB APK wenn möglich)

### Nach Launch
- [ ] Monitor Crash Reports (erste 3 Tage täglich)
- [ ] Ratings & Reviews antworten
- [ ] Bug Fixes vorbereiten
- [ ] Update-Strategie definieren

---

## 📊 Monitoring nach Launch

### First 24 Hours
- [ ] Crash Reports überprüfen
- [ ] User Ratings beobachten
- [ ] Install Count anschauen
- [ ] Reviews lesen (Google antwortet oft automatisch auf negative)

### Erste Woche
- [ ] Analytics überprüfen
- [ ] Performance Metriken
- [ ] User Flow-Analyse
- [ ] Feedback sammeln

### Laufend
- [ ] Monatliche Updates mit Bugfixes
- [ ] Neue Features basierend auf Feedback
- [ ] Rating & Review Management
- [ ] Version Management

---

## 🔗 Hilfreiche Ressourcen

### Official Google Documentation
- [Google Play Console](https://play.google.com/console/)
- [Android App Publishing Guide](https://developer.android.com/studio/publish)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)
- [Privacy Policy Requirements](https://support.google.com/googleplay/answer/9840674)

### Tools & Services
- [Android Studio](https://developer.android.com/studio)
- [Gradle Build System](https://gradle.org/)
- [Bubblewrap (PWA → APK)](https://github.com/GoogleChromeLabs/bubblewrap)
- [bundletool (AAB Management)](https://developer.android.com/studio/command-line/bundletool)
- [Firebase Crashlytics (Error Reporting)](https://firebase.google.com/docs/crashlytics)

### Testing & Quality Tools
- [Android Device Lab](https://developer.android.com/training/multiple-screens/testing/devices)
- [App Quality Insights](https://play.google.com/console/about/app-quality/)
- [Pre-Launch Reports](https://support.google.com/googleplay/android-developer/answer/7158059)

---

## 📝 Version für project-templates speichern

Diese Roadmap sollte in `project-templates` als zentrale Referenz verfügbar sein.

Projekte können dieses Dokument nutzen als:
1. **Allgemeine Referenz** - Was sind die Google Play Store Anforderungen?
2. **Projekt-Spezifische Checklisten** - Welche Schritte für mein Projekt?
3. **Timeline Vorlage** - Wann sollten wir was tun?

