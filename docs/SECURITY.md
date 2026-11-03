# 🔒 Security Documentation

## Firebase Configuration Security

### Understanding Firebase Web API Keys

**Important:** Firebase web API keys are **designed to be public**. They are client-side identifiers, not secret tokens.

#### Why Firebase Keys Can Be Public

Firebase web API keys serve to:
- Identify your Firebase project
- Route requests to the correct project
- Enable client-side Firebase SDK initialization

These keys are **NOT authentication credentials**. Your app's actual security comes from:

1. **✅ Firebase Security Rules** (Most Important)
   - Control who can read/write data in Firestore, Storage, etc.
   - Must be properly configured for production
   - Example: Only allow authenticated users to access their own data

2. **✅ Authorized Domains**
   - Set in Firebase Console > Project Settings > Authorized domains
   - Only your whitelisted domains can use your Firebase project
   - Prevents unauthorized websites from using your config

3. **✅ Firebase App Check** (Optional, but recommended)
   - Additional layer of protection against abuse
   - Verifies requests come from your legitimate app
   - Protects against bots and abuse

#### Official Documentation

Firebase explicitly states that web API keys are safe to include in code:
- [Firebase API Keys Documentation](https://firebase.google.com/docs/projects/api-keys)
- [Security Rules Documentation](https://firebase.google.com/docs/rules)

---

## Our Security Implementation

### 1. Environment Variable System

We use environment variables for **best practices** and **flexibility**, not because the keys are secret:

**Benefits:**
- ✅ Easy environment management (dev/staging/prod)
- ✅ Prevents accidental key rotation issues
- ✅ Better separation of configuration from code
- ✅ Industry standard practice

**Setup:**
```bash
# 1. Copy the example file
cp .env.example .env

# 2. Fill in your Firebase values (from Firebase Console)
nano .env

# 3. Build the configuration
npm run build

# 4. Start your app
npm start
```

### 2. Build Process

The `build-config.js` script:
1. Reads values from `.env`
2. Generates `firebase-config.js` with proper comments
3. Includes security documentation in the generated file

**Important:** Run `npm run build` before deploying!

### 3. What's Committed to Git

**✅ Safe to commit:**
- `firebase-config.js` - Contains public API keys (with security notes)
- `.env.example` - Template without real values
- `build-config.js` - Build script

**❌ Never commit (but optional):**
- `.env` - Can be committed if needed (keys are public anyway)
- However, keeping `.env` out of git is still best practice

---

## Security Checklist

Before deploying to production:

### Firebase Console Settings

- [ ] **Firestore Security Rules** configured
  - [ ] Test rules in Firebase Console simulator
  - [ ] Ensure users can only access their own data

- [ ] **Authorized Domains** configured
  - [ ] Add your production domain (e.g., `your-site.github.io`)
  - [ ] Remove unused development domains

- [ ] **Authentication Methods** configured
  - [ ] Enable only needed providers (Google, Apple, etc.)
  - [ ] Configure OAuth consent screen properly

- [ ] **Firebase App Check** (Optional but recommended)
  - [ ] Enable reCAPTCHA or other providers
  - [ ] Test with your deployed app

### Example Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Tasks collection - only authenticated users can access their tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null &&
                            resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## FAQ

### Q: Should I keep my Firebase keys secret?

**A:** For web apps, no. Firebase web API keys are designed to be public. Your security comes from Firebase Security Rules, not hidden keys.

### Q: What if someone finds my API key on GitHub?

**A:** That's okay! As long as you have proper Security Rules and Authorized Domains configured, your data is safe. The keys alone cannot access your data.

### Q: Why use environment variables then?

**A:** Best practice for configuration management, easier to maintain multiple environments, and follows industry standards. It's about organization, not secrecy.

### Q: What should I actually keep secret?

**A:**
- ❌ **Server-side keys** (Firebase Admin SDK, service account keys)
- ❌ **Private API keys** for third-party services
- ❌ **Database passwords** and connection strings
- ❌ **OAuth client secrets** (different from client IDs)
- ❌ **Signing keys** for APKs/IPAs

Firebase **web** API keys ≠ Server-side secrets

---

## Additional Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

## Bekannte `npm audit`-Befunde (Stand 2026-11-03)

Nach dem Override (`serialize-javascript` in `package.json`) bleiben 25 Meldungen (2 low, 19 moderate, 4 high).

**Kein `minimatch`-Override!** `minimatch ^11` (Fix für GHSA-g3hv-75wg-m249) bricht `workbox-build`: das Glob-Matching findet keine Dateien, der Service Worker bekommt 3 statt 19 Precache-Einträge (0 statt ~907 KiB, nur Warnung "glob patterns doesn't match any files" im Build, kein Fehler). Nach Änderungen an Dependencies/Overrides immer im Build-Log `precache  19 entries (~907 KiB)` prüfen.

- **4 High: `@grpc/grpc-js` <= 1.13.5** (Kette `firebase` -> `@firebase/firestore` -> `@grpc/grpc-js@1.9.16`, Advisories GHSA-m9gg-hp2v-232j, GHSA-f596-whhp-79r4). Betrifft den gRPC-**Server** bzw. Node-Transport. Die PWA läuft im Browser, das Firestore-Web-SDK nutzt dort kein gRPC. Firestore pinnt `~1.9.0`, per Override nicht sinnvoll hebbar. Der von `npm audit` vorgeschlagene Fix (`firebase@9.14.0`) ist ein Downgrade und wird **nicht** eingespielt. Risiko akzeptiert, bis Firebase die Abhängigkeit anhebt. Beim Firebase-Update prüfen, ob `@grpc/grpc-js` >= 1.14 gezogen wird.
- **Moderate/Low:** nur Dev-/Build-Tooling (`npm audit --omit=dev` zeigt nur die 4 High). Nicht behebbar ohne die blockierten Majors (Vitest 5, siehe CLAUDE.md "Blockierte Major-Dependency-Bumps") oder ohne Upstream-Fix: `@vitest/mocker`, `deepmerge`, `glob`, `workbox-build`-Kette.
- **`npm audit fix` stürzt mit npm 10.9.x ab** (`edgesOut`). Overrides wurden mit npm 11 erzeugt (`npx npm@11 install`), das Lockfile bleibt `lockfileVersion` 3 und ist mit `npm ci` unter npm 10 installierbar.

---

## Reporting Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

**Do not** open public GitHub issues for security vulnerabilities.
