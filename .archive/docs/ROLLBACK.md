# Emergency Rollback Procedure

## Quick Reference

**Situation:** Firebase v9 migration broke production
**Time to Rollback:** 5 minutes
**Downtime:** Minimal (during deployment)

## Immediate Assessment

### Step 1: Confirm Issue (1 minute)
```bash
# Check what's broken
# - Is login screen showing? (should be)
# - Are buttons clickable? (should be)
# - Any JavaScript errors in browser console? (check)

# Open production URL
# Try to click "Gast" button
# Does it work or show error?
```

### Decision Point
- **If Guest Mode works:** Continue monitoring, don't rollback yet
- **If Guest Mode broken:** Proceed with emergency rollback
- **If blank white screen:** Immediate rollback needed

## Emergency Rollback Steps

### Step 2: Identify Rollback Target (1 minute)
```bash
# Last known good commit
ROLLBACK_COMMIT="b6fb7f2"  # emergency: Clear service worker cache...
# This was the stable recovery commit after V1 failure

# Verify it's stable
git log --oneline --all | grep b6fb7f2
# Output: b6fb7f2 emergency: Clear service worker cache to fix authentication issues
```

### Step 3: Create Emergency Rollback Commit (2 minutes)
```bash
git checkout main
git status  # Verify clean working tree

# Reset to last good state (soft reset keeps changes visible)
git reset --soft b6fb7f2

# Unstage everything
git reset

# Stage all current files (reverts to b6fb7f2 state)
git add -A

# Commit with clear message
git commit -m "emergency: Rollback Firebase v9 migration

EMERGENCY ROLLBACK COMMIT

Rollback Reason: [DESCRIBE ISSUE]
- [Issue detail 1]
- [Issue detail 2]

Rolling back from: feature/firebase-v9-v2 (d9f8147)
Rolling back to: b6fb7f2 (emergency: Clear service worker cache...)

This restores the stable state before Firebase v9 V2 migration.

Action Items After Rollback:
1. [ ] Verify production working again
2. [ ] Monitor error logs for 1 hour
3. [ ] Document what went wrong
4. [ ] Plan Firebase v9 V3 with fixes
5. [ ] Update testing strategy

See docs/FIREBASE_V9_DEPLOYMENT.md for next steps."
```

### Step 4: Push Rollback to Production (1 minute)
```bash
# Push to main (GitHub branch protection may warn, that's OK)
git push origin main

# Verify push succeeded
git log --oneline -1 origin/main
# Should show your emergency commit message
```

### Step 5: Monitor Deployment (2 minutes)
```bash
# Check GitHub Actions
# https://github.com/S540d/Eisenhauer/actions

# Wait for deployment to complete
# Verify: ✅ Deployment successful

# Check production
# 1. Open production URL
# 2. Should see login screen (not blank)
# 3. Click "Gast" button
# 4. Should see app screen with tasks
```

### Step 6: Post-Rollback Verification (2 minutes)
```bash
# In browser Dev Tools Console:
typeof window.signInWithGoogle === 'function'  // true
typeof window.continueAsGuest === 'function'   // true

# Verify service worker updated
# Application → Service Workers → Should see cache v2.2.0 being used
```

## Full Rollback Checklist

```
□ Step 1: Confirmed issue in production
□ Step 2: Identified rollback target (b6fb7f2)
□ Step 3: Created emergency rollback commit
□ Step 4: Pushed rollback to main
□ Step 5: GitHub Actions deployment completed
□ Step 6: Verified production working
□ Step 7: Tested Guest Mode login
□ Step 8: Checked no console errors
□ Step 9: Verified service worker status
□ Step 10: Alerted team of rollback
```

## Post-Rollback Actions

### Immediate (Next 30 minutes)
1. **Monitor Production**
   - Check error logs for spikes
   - Verify users can login
   - Monitor performance

2. **Notify Team**
   - Slack: Rolled back Firebase v9 migration due to [ISSUE]
   - Create GitHub issue: "Firebase v9 V2 Rollback - [Root Cause]"

3. **Collect Diagnostics**
   - Screenshot of error
   - Browser console errors
   - Network waterfall in DevTools
   - Error log timestamps

### Same Day (Next 4 hours)
1. **Root Cause Analysis**
   - What specifically failed?
   - Was it an auth issue?
   - Was it a caching issue?
   - Was it a module loading issue?

2. **Update Testing**
   - Did we miss a test case?
   - Should we add more E2E tests?
   - What would have caught this?

### Next Week
1. **Plan Firebase v9 V3**
   - Address the root cause
   - Add new test cases
   - Implement safeguards

2. **Improve Deployment Process**
   - Add smoke tests to CI/CD
   - Require longer staging validation
   - Add monitoring/alerting
   - Improve rollback automation

## If Rollback Itself Fails

### Scenario: Rollback Commit Won't Push
**Reason:** GitHub branch protection prevents force push

**Solution:**
```bash
# Create a new feature branch
git checkout -b emergency/restore-stable-state

# Commit your rollback on this branch
git commit -m "emergency: Restore stable state (b6fb7f2)"

# Push feature branch
git push origin emergency/restore-stable-state

# Create quick PR
gh pr create \
  --title "EMERGENCY: Restore stable Firebase v9 rollback" \
  --body "Immediate rollback needed due to [ISSUE]"

# Request immediate review + merge
```

### Scenario: Rollback Commit Works But Issue Persists
**Reason:** Service worker caching

**Solution:**
```bash
# Update service worker cache version
# In service-worker.js line 1:
const CACHE_VERSION = '2.4.0';  // Bump from 2.2.0

# Commit and push
git add service-worker.js
git commit -m "emergency: Force service worker cache clear"
git push origin main

# Users must hard refresh (Cmd+Shift+R)
```

## Communication Template

### Slack Notification
```
🚨 EMERGENCY ROLLBACK

Firebase v9 migration rolled back due to [ISSUE].

Rolled back from: feature/firebase-v9-v2
Rolled back to: b6fb7f2 (stable state)

Status: ✅ Production restored
Time to Rollback: X minutes

Details: [Brief description]

Next Steps:
1. Root cause analysis (today)
2. Plan Firebase v9 V3 (next week)
3. Additional testing (before next attempt)

See: docs/ROLLBACK.md for details
```

### GitHub Issue Template
```markdown
Title: ROLLBACK: Firebase v9 V2 Migration

## What Happened
Firebase v9 V2 migration (d9f8147) was rolled back due to [ISSUE].

## Rollback Details
- Rolled back to: b6fb7f2
- Time to rollback: X minutes
- Status: ✅ Production restored

## Root Cause
[Describe what went wrong]

## Why Tests Didn't Catch It
[Explain which test would have caught this]

## Action Items
- [ ] Root cause analysis
- [ ] Update testing strategy
- [ ] Plan Firebase v9 V3 with fixes
- [ ] Improve CI/CD monitoring
- [ ] Document lessons learned

## Lessons Learned
[Key takeaways for future migrations]
```

## Prevention for Next Time

### What We Should Have Done
1. ✅ More comprehensive E2E tests (we did this in V2)
2. ✅ Longer staging validation period (24+ hours)
3. ✅ Smoke tests in CI/CD (still TODO)
4. ✅ Gradual rollout (users on feature flags)
5. ✅ Better monitoring/alerting (still TODO)

### Improvements After This Rollback
1. Add E2E smoke tests to GitHub Actions
2. Require 48-hour staging validation for migrations
3. Implement feature flags for migrations
4. Add production monitoring/alerting
5. Automate rollback process

## Quick Commands Reference

```bash
# View rollback target
git show b6fb7f2

# Create rollback commit
git reset --soft b6fb7f2 && git reset && git add -A

# Check what would change
git diff --cached --stat

# Push rollback
git push origin main

# Check deployment status
gh run list --branch main -L 3

# View latest commit
git log --oneline -1 origin/main
```

## Support

**Questions?**
- See: docs/FIREBASE_V9_DEPLOYMENT.md
- See: docs/ROOT_CAUSE_ANALYSIS.md
- Check: GitHub issues labeled "firebase-v9"

**Emergency Contact?**
- Slack: #engineering-emergency
- On-call engineer: [Person name]
