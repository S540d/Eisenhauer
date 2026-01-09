# Firebase Environment Setup

**Implementiert in Phase 3 von Issue #111**

## Warum separate Firebase-Projekte?

Mit **produktiven Nutzern** (TWA/PWA im App Store) ist es **kritisch**, dass Testing/Staging-Daten niemals Production-Daten beeinflussen können.

### Risiken ohne Trennung:
- Test-Tasks erscheinen in Production-App
- Nutzer-Daten werden durch Tests gelöscht/modifiziert
- Firebase-Quota wird durch Tests aufgebraucht
- Staging-Code könnte Production-DB crashen

### Lösung: 3 Firebase-Projekte

```
production → eisenhauer-matrix        (bestehend)
staging    → eisenhauer-staging       (neu erstellen)
testing    → eisenhauer-testing       (neu erstellen)
```

---

## Setup-Anleitung

### 1. Erstelle Staging Firebase-Projekt

1. Öffne [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Add project" → Name: `eisenhauer-staging`
3. Google Analytics: Optional (empfohlen: separate Property)
4. Erstelle eine neue Web-App:
   - Name: `Eisenhauer Matrix Staging`
   - Hosting: **Nicht** aktivieren (wir nutzen GitHub Pages)
5. Kopiere die Firebase-Config-Werte

### 2. Erstelle Testing Firebase-Projekt

1. Klicke auf "Add project" → Name: `eisenhauer-testing`
2. Google Analytics: Optional (empfohlen: separate Property)
3. Erstelle eine neue Web-App:
   - Name: `Eisenhauer Matrix Testing`
   - Hosting: **Nicht** aktivieren
4. Kopiere die Firebase-Config-Werte

### 3. Konfiguriere Firestore (für jedes Projekt)

1. Gehe zu **Firestore Database** → "Create database"
2. Wähle: **Start in test mode** (für Staging/Testing)
3. Location: `europe-west` (oder deine bevorzugte Region)
4. Erstelle die gleiche Datenstruktur wie in Production:
   - Collection: `tasks`
   - Collection: `settings` (optional)

### 4. Konfiguriere Authentication (für jedes Projekt)

1. Gehe zu **Authentication** → "Get started"
2. Aktiviere die gewünschten Sign-in methods:
   - **Email/Password** (empfohlen für Testing)
   - Google (optional)
   - Anonymous (optional für Testing)

### 5. Firebase Security Rules

Für **Staging/Testing** kannst du lockere Rules nutzen:

```javascript
// Firestore Rules (Staging/Testing)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users (für Testing)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Für **Production** sollten die Rules strenger sein:

```javascript
// Firestore Rules (Production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // User kann nur eigene Tasks erstellen, lesen, ändern, löschen
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Authorized Domains

Füge in **jedem** Firebase-Projekt die korrekten Domains hinzu:

**Authentication → Settings → Authorized domains**

Production:
- `s540d.github.io`
- `localhost` (für lokale Entwicklung)

Staging:
- `s540d.github.io`
- `localhost`

Testing:
- `s540d.github.io`
- `localhost`

---

## .env Files befüllen

### Schritt 1: Kopiere Config aus Firebase Console

Für jedes Projekt: **Project Settings** → "Your apps" → SDK setup → Config

### Schritt 2: Trage Werte in .env ein

`.env.staging`:
```bash
FIREBASE_API_KEY=<staging-api-key>
FIREBASE_AUTH_DOMAIN=eisenhauer-staging.firebaseapp.com
FIREBASE_PROJECT_ID=eisenhauer-staging
FIREBASE_STORAGE_BUCKET=eisenhauer-staging.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=<staging-sender-id>
FIREBASE_APP_ID=<staging-app-id>
FIREBASE_MEASUREMENT_ID=<staging-measurement-id>
```

`.env.testing`:
```bash
FIREBASE_API_KEY=<testing-api-key>
FIREBASE_AUTH_DOMAIN=eisenhauer-testing.firebaseapp.com
FIREBASE_PROJECT_ID=eisenhauer-testing
FIREBASE_STORAGE_BUCKET=eisenhauer-testing.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=<testing-sender-id>
FIREBASE_APP_ID=<testing-app-id>
FIREBASE_MEASUREMENT_ID=<testing-measurement-id>
```

### Schritt 3: Build testen

```bash
# Test Staging
npm run build:staging

# Test Testing
npm run build:testing

# Test Production
npm run build:production
```

---

## GitHub Secrets (Optional)

Wenn du die `.env.*` Files NICHT committen möchtest, kannst du GitHub Secrets nutzen:

### 1. Erstelle Secrets

**Settings → Secrets → Actions → New repository secret**

Für jedes Environment:
- `STAGING_FIREBASE_API_KEY`
- `STAGING_FIREBASE_PROJECT_ID`
- ... (alle Werte)
- `TESTING_FIREBASE_API_KEY`
- `TESTING_FIREBASE_PROJECT_ID`
- ...

### 2. Workflow anpassen

In `.github/workflows/deploy.yml`:

```yaml
- name: Build for ${{ steps.env.outputs.environment }}
  env:
    NODE_ENV: ${{ steps.env.outputs.environment }}
    # Note: Secret names use uppercase prefixes (STAGING_, TESTING_)
    FIREBASE_API_KEY: ${{ secrets[format('{0}_FIREBASE_API_KEY', steps.env.outputs.environment)] }}
    # ... weitere Secrets
  run: |
    # Transform environment to uppercase for secret lookup
    ENV_UPPER=$(echo "$NODE_ENV" | tr '[:lower:]' '[:upper:]')
    npm run build:$NODE_ENV
```

**Hinweis**: Für öffentliche Firebase Web-Apps sind Secrets **nicht zwingend notwendig**, da die API-Keys client-seitig sichtbar sind. Sicherheit wird über Firebase Rules geregelt.

---

## Verifizierung

### Lokaler Test

1. Build für Testing: `npm run build:testing`
2. Server starten: `npm start`
3. Öffne: http://localhost:8000
4. Öffne DevTools → Console → Suche nach "App Environment: testing"
5. Teste Firebase Auth: Login sollte im **testing** Projekt landen

### Nach Deployment

1. Testing: https://s540d.github.io/Eisenhauer/testing/
2. Staging: https://s540d.github.io/Eisenhauer/staging/
3. Production: https://s540d.github.io/Eisenhauer/

Prüfe in Firebase Console → Authentication, ob neue User im **korrekten** Projekt landen.

---

## Troubleshooting

### Build-Fehler: "Missing environment variables"

```
❌ Error: .env.staging not found!
```

**Lösung**: Erstelle die `.env.staging` und `.env.testing` Files mit echten Firebase-Werten.

### Firebase Init Error: "auth/invalid-api-key"

**Lösung**: API-Key in `.env.*` ist falsch oder gehört zum falschen Projekt.

### Tasks erscheinen über Environments hinweg

**Problem**: Du nutzt noch das gleiche Firebase-Projekt für alle Environments.

**Lösung**: Erstelle separate Projekte (siehe oben) und update die `.env.*` Files.

### GitHub Actions Build Failed

```
Error: Missing or incomplete environment variables
```

**Lösung**:
1. Option A: Committe die `.env.*` Files (safe für Firebase Web-Keys)
2. Option B: Nutze GitHub Secrets (siehe oben)

---

## Kosten

Firebase Free Tier pro Projekt:
- Firestore: 50k reads/day, 20k writes/day
- Auth: Unbegrenzte Authentifizierungen
- Storage: 1 GB, 10 GB/month Transfer

Mit 3 Projekten: **3x Free Tier** → Ausreichend für kleine bis mittlere Apps!

---

## Nächste Schritte

Nach Firebase-Setup:

1. Update `.env.staging` und `.env.testing` mit echten Werten
2. Teste alle 3 Builds lokal
3. Push zu GitHub → Deployment läuft automatisch
4. Verifiziere in Firebase Console, dass die Environments isoliert sind
5. Update die Test-Dokumentation mit neuen URLs
6. Schließe Issue #110 und Phase 3 von Issue #111

---

**Related Issues**: #110, #111 Phase 3
