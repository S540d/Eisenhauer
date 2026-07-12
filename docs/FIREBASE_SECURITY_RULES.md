# Firebase Security Rules Documentation

## Overview

This document describes the Firebase Security Rules for Firestore and Storage used across all three environments (Production, Staging, Testing).

**⚠️ Important:** Security Rules are stored server-side in Firebase Console, not in this repository. This document serves as the canonical reference for rules that should be applied.

---

## Firestore Security Rules

### Production Environment (`eisenhauer-matrix`)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function: Check if user owns the resource
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // User data - each user can only access their own data
    match /users/{userId} {
      // Allow read if authenticated and user is owner
      allow read: if isAuthenticated() && isOwner(userId);

      // Allow write if authenticated and user is owner
      allow write: if isAuthenticated() && isOwner(userId);

      // Tasks subcollection
      match /tasks/{taskId} {
        // Allow read if authenticated and user owns parent document
        allow read: if isAuthenticated() && isOwner(userId);

        // Allow write if authenticated and user owns parent document
        allow write: if isAuthenticated() && isOwner(userId);

        // Validate task data structure
        allow create: if isAuthenticated()
                      && isOwner(userId)
                      && request.resource.data.keys().hasAll(['text', 'segment', 'checked', 'createdAt'])
                      && request.resource.data.text is string
                      && request.resource.data.text.size() > 0
                      && request.resource.data.text.size() <= 500
                      && request.resource.data.segment in ['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent']
                      && request.resource.data.checked is bool
                      && request.resource.data.createdAt is timestamp;

        // Validate update doesn't change userId
        allow update: if isAuthenticated()
                       && isOwner(userId)
                       && request.resource.data.keys().hasAll(['text', 'segment', 'checked', 'createdAt']);
      }

      // User settings subcollection
      match /settings/{settingId} {
        allow read, write: if isAuthenticated() && isOwner(userId);
      }
    }

    // Backup files (if using Firestore for metadata)
    match /backups/{userId}/{backupId} {
      allow read, write: if isAuthenticated() && isOwner(userId);

      // Limit backup file size (metadata only)
      allow create: if isAuthenticated()
                    && isOwner(userId)
                    && request.resource.size() < 1024 * 1024; // 1MB limit
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Staging Environment (`eisenhauer-staging`)

**Same as Production** with the following addition:

```javascript
// Additional debug logging allowed in staging
match /debug_logs/{logId} {
  allow write: if isAuthenticated(); // Anyone can write debug logs
  allow read: if false; // No one can read (admin only via console)
}
```

### Testing Environment (`eisenhauer-testing`)

**More permissive rules for CI/CD testing:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Same auth checks as production
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // User data - same as production
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);

      match /tasks/{taskId} {
        allow read, write: if isAuthenticated() && isOwner(userId);

        // Testing: Relaxed validation (allow test data)
        allow create: if isAuthenticated() && isOwner(userId);
      }

      match /settings/{settingId} {
        allow read, write: if isAuthenticated() && isOwner(userId);
      }
    }

    // Testing: Allow test fixtures
    match /test_fixtures/{fixtureId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // Testing: Allow debug logs
    match /debug_logs/{logId} {
      allow read, write: if isAuthenticated();
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Cloud Storage Security Rules

### Production Environment

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // User backup files
    // NOTE: Path must match js/modules/backup.js exactly (`users/{userId}/backups/{filename}`).
    // A mismatch here (e.g. `backups/{userId}/...`) means the rule never
    // actually applies to the app's real upload path, and every write falls
    // through to the deny-all rule below — backups then fail with
    // "permission-denied" no matter how the rule body looks (Issue #355).
    match /users/{userId}/backups/{backupFile} {
      // Allow read if authenticated and owner
      allow read: if isAuthenticated() && isOwner(userId);

      // Allow write if authenticated, owner, and file is not too large
      allow write: if isAuthenticated()
                    && isOwner(userId)
                    && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                    && request.resource.contentType == 'application/json';

      // Allow delete if authenticated and owner
      allow delete: if isAuthenticated() && isOwner(userId);
    }

    // Future: User attachments (images, etc.)
    match /attachments/{userId}/{attachmentId} {
      allow read: if isAuthenticated() && isOwner(userId);

      allow write: if isAuthenticated()
                    && isOwner(userId)
                    && request.resource.size < 10 * 1024 * 1024 // 10MB limit
                    && request.resource.contentType.matches('image/.*');

      allow delete: if isAuthenticated() && isOwner(userId);
    }

    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Staging & Testing Environments

**Same as Production** with increased limits for testing:

```javascript
// Testing/Staging: Increased file size limits
match /users/{userId}/backups/{backupFile} {
  allow write: if isAuthenticated()
                && isOwner(userId)
                && request.resource.size < 10 * 1024 * 1024; // 10MB for testing
}
```

---

## How to Deploy Rules

### Option 1: Firebase Console (Recommended)

1. **Go to Firebase Console:**
   - Production: https://console.firebase.google.com/project/eisenhauer-matrix
   - Staging: https://console.firebase.google.com/project/eisenhauer-staging
   - Testing: https://console.firebase.google.com/project/eisenhauer-testing

2. **Navigate to Firestore Rules:**
   - Firestore Database → Rules tab
   - Cloud Storage → Rules tab

3. **Copy rules from this document**

4. **Publish rules**

### Option 2: Firebase CLI (Advanced)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy Firestore rules to production
firebase deploy --only firestore:rules --project eisenhauer-matrix

# Deploy Storage rules to production
firebase deploy --only storage:rules --project eisenhauer-matrix

# Deploy to staging
firebase deploy --only firestore:rules,storage:rules --project eisenhauer-staging

# Deploy to testing
firebase deploy --only firestore:rules,storage:rules --project eisenhauer-testing
```

**Note:** This requires `firebase.json` configuration file (not currently in repo).

---

## Security Considerations

### Enforced by Rules

✅ **User Data Isolation**
- Users can only access their own `/users/{userId}` documents
- Anonymous users are treated as unique users (Firebase UID)

✅ **Input Validation**
- Task text: 1-500 characters
- Task segment: Must be one of four valid values
- Timestamps: Must be proper `timestamp` type

✅ **File Size Limits**
- Backups: Max 5MB (Production), 10MB (Testing)
- Attachments: Max 10MB
- Prevents DoS attacks via large uploads

✅ **Rate Limiting (Firebase-managed)**
- Firebase automatically rate-limits requests
- No additional configuration needed

✅ **Content-Type Validation**
- Backups must be `application/json`
- Attachments must be `image/*`

### NOT Enforced by Rules (Application Logic)

❌ **Field-level encryption**
- Tasks stored in plain text
- Consider implementing client-side encryption for sensitive data

❌ **User quotas**
- No limit on number of tasks per user
- Could be added if abuse becomes an issue

❌ **Audit logging**
- No automatic logging of all reads/writes
- Could enable Firebase Audit Logs (paid feature)

---

## Testing Rules

### Using Firebase Rules Simulator

1. **Open Firebase Console → Firestore → Rules**
2. **Click "Rules Playground" tab**
3. **Test scenarios:**

```
✅ Authenticated user reading own tasks:
   Location: /users/user123/tasks/task456
   Auth: user123
   Operation: Read
   Result: ALLOW

❌ Authenticated user reading another user's tasks:
   Location: /users/user456/tasks/task789
   Auth: user123
   Operation: Read
   Result: DENY

✅ Authenticated user creating valid task:
   Location: /users/user123/tasks/newTask
   Auth: user123
   Operation: Create
   Data: {
     text: "Buy groceries",
     segment: "not-important-not-urgent",
     checked: false,
     createdAt: timestamp
   }
   Result: ALLOW

❌ Authenticated user creating invalid task (too long):
   Location: /users/user123/tasks/newTask
   Auth: user123
   Operation: Create
   Data: { text: "[501 characters]", ... }
   Result: DENY
```

### Automated Testing (Optional)

```bash
# Install Firebase Emulator Suite
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# Run tests against emulator
npm run test:firebase-rules
```

---

## Security Audit Checklist

### Before deploying new rules:

- [ ] Test in Firebase Rules Simulator
- [ ] Verify user isolation (no cross-user access)
- [ ] Check file size limits are enforced
- [ ] Validate content-type restrictions
- [ ] Test with both authenticated and unauthenticated users
- [ ] Deploy to Testing environment first
- [ ] QA test for 24-48 hours
- [ ] Deploy to Staging
- [ ] Final QA
- [ ] Deploy to Production

### Regular Audits (Quarterly):

- [ ] Review Firebase Console → Usage tab for anomalies
- [ ] Check for unusual access patterns
- [ ] Update rules if new fields added to data model
- [ ] Verify all environments have matching rules (except test-specific additions)

---

## Troubleshooting

### "Permission Denied" Errors

**Symptom:** Users getting "Missing or insufficient permissions" error

**Causes:**
1. User not authenticated → Check `request.auth != null`
2. User trying to access another user's data → Check `isOwner(userId)`
3. Data validation failed → Check task structure matches schema
4. Storage rule path doesn't match the app's actual upload path → For backups,
   the deployed Storage rule must match `users/{userId}/backups/{backupFile}`
   exactly (see `uploadBackup()` in `js/modules/backup.js`); any other path
   pattern silently falls through to the deny-all rule (Issue #355)

**Debug:**
```javascript
// Temporarily add debug logging to rules
allow read: if debug(isAuthenticated()) && debug(isOwner(userId));
```

### Rules Not Updating

**Issue:** Changes to rules not taking effect

**Fix:**
1. Clear browser cache
2. Wait 1-2 minutes for propagation
3. Check "Published" status in Firebase Console
4. Try incognito window

---

## Future Enhancements

### Planned Improvements

1. **Firebase App Check**
   - Add device attestation
   - Prevent bots and abuse

2. **Rate Limiting (Custom)**
   ```javascript
   // Limit to 100 writes per user per hour
   function withinRateLimit() {
     return request.time > resource.data.lastWrite + duration.value(36, 's');
   }
   ```

3. **Field-level Security**
   ```javascript
   // Prevent modification of createdAt timestamp
   allow update: if request.resource.data.createdAt == resource.data.createdAt;
   ```

4. **Admin Access (separate service account)**
   - Allow admin to read all data for support
   - Requires Cloud Functions + custom claims

---

## Related Documentation

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Language Reference](https://firebase.google.com/docs/rules/rules-language)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

---

**Version:** 1.0.1
**Last Updated:** 2026-07-12
**Maintainer:** S540d

**⚠️ CRITICAL:** After any rule changes, always deploy to Testing → Staging → Production in that order. Never deploy untested rules to Production.
