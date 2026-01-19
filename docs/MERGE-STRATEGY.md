# Merge Strategy - Eisenhauer Project

## Branch Flow

```
feature/* → testing → staging → main
```

## Environment Purpose

| Branch | Environment | Purpose | URL |
|--------|-------------|---------|-----|
| `feature/*` | Local | Development & feature work | - |
| `testing` | Testing | Integration testing, early bug detection | [/testing/](https://s540d.github.io/Eisenhauer/testing/) |
| `staging` | Staging | Pre-production validation, user acceptance | [/staging/](https://s540d.github.io/Eisenhauer/staging/) |
| `main` | Production | Stable release for end users | [/](https://s540d.github.io/Eisenhauer/) |

## Merge Checklist

### When to merge `testing → staging`

**Prerequisites:**
- ✅ All features have been tested in testing environment
- ✅ No critical bugs present
- ✅ At least 24 hours in testing environment (soak time)
- ✅ All GitHub Actions CI/CD checks passing
- ✅ Code review completed (if applicable)

**Process:**
```bash
git checkout staging
git pull origin staging
git merge testing --no-ff
git push origin staging
```

**Verification:**
1. Check [Staging deployment](https://s540d.github.io/Eisenhauer/staging/)
2. Verify Firebase points to `eisenhauer-staging`
3. Smoke test: Login, create task, verify sync

---

### When to merge `staging → main`

**Prerequisites:**
- ✅ All smoke tests passed in staging
- ✅ User acceptance testing completed
- ✅ Version bumped in `package.json` (if release)
- ✅ `CHANGELOG.md` updated with changes
- ✅ All documentation updated
- ✅ At least 48 hours in staging (for releases)
- ✅ No unresolved bugs in staging
- ✅ All GitHub Actions checks passing

**Process:**
```bash
# Update version (if release)
npm run version:update

# Update changelog
# Edit CHANGELOG.md manually

# Merge to main
git checkout main
git pull origin main
git merge staging --no-ff -m "Release v1.X.X"
git push origin main

# Tag release (if applicable)
git tag -a v1.X.X -m "Release v1.X.X"
git push origin v1.X.X
```

**Verification:**
1. Check [Production deployment](https://s540d.github.io/Eisenhauer/)
2. Verify Firebase points to `eisenhauer-matrix`
3. Full smoke test: Login, CRUD operations, offline sync
4. Check PWA installation works
5. Verify version number in app

**Post-Release:**
- Close milestone (if applicable)
- Announce release in discussions/issues
- Update README if needed

---

### When to merge `feature/* → testing`

**Prerequisites:**
- ✅ Feature is complete and self-tested
- ✅ Local tests pass (`npm run test`)
- ✅ Code is formatted (`npm run format`)
- ✅ Linting passes (`npm run lint`)
- ✅ No console.log statements (pre-commit hook checks)

**Process:**
```bash
# Create PR
gh pr create --base testing --title "Feature: XYZ" --body "Description..."

# After approval, merge via GitHub UI or:
git checkout testing
git pull origin testing
git merge feature/xyz --no-ff
git push origin testing
```

**Verification:**
1. Wait for deployment to testing environment
2. Basic functionality test on [Testing URL](https://s540d.github.io/Eisenhauer/testing/)

---

## Hotfix Process

For critical bugs in production:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the bug
# ... make changes ...

# Test locally
npm test

# Merge to main (skip testing/staging for critical issues)
git checkout main
git merge hotfix/critical-bug --no-ff
git push origin main

# Backport to staging and testing
git checkout staging
git merge main
git push origin staging

git checkout testing
git merge staging
git push origin testing
```

**Use hotfix ONLY for:**
- Security vulnerabilities
- Data loss bugs
- App crashes
- Critical user-facing bugs

---

## Release Schedule

**Recommended Cadence:**
- **Testing → Staging:** As soon as testing is stable (weekly)
- **Staging → Main:** Bi-weekly or monthly releases
- **Hotfixes:** As needed (emergency only)

**Version Numbering:**
- Major (2.0.0): Breaking changes, major features
- Minor (1.X.0): New features, backward compatible
- Patch (1.8.X): Bug fixes only

---

## Firebase Environment Mapping

**IMPORTANT:** Each environment uses a different Firebase project!

| Branch | Firebase Project | Auth Domain |
|--------|-----------------|-------------|
| `testing` | `eisenhauer-testing` | eisenhauer-testing.firebaseapp.com |
| `staging` | `eisenhauer-staging` | eisenhauer-staging.firebaseapp.com |
| `main` | `eisenhauer-matrix` | eisenhauer-matrix.firebaseapp.com |

**Never mix environments!** Always verify the correct Firebase config is being used.

---

## Troubleshooting

### "Branch has diverged"
```bash
# Sync testing with staging
git checkout testing
git pull origin testing
git merge staging --no-ff
git push origin testing
```

### "Merge conflict in package-lock.json"
```bash
# Regenerate lockfile
git checkout --theirs package-lock.json
npm install
git add package-lock.json
git commit
```

### "Deployment failed"
1. Check GitHub Actions logs
2. Verify `.env.*` files are correct
3. Check if gh-pages branch is not locked
4. Retry deployment workflow manually

---

## References

- [Infrastructure Audit](./INFRASTRUCTURE-AUDIT-2026-01-19.md)
- [Issue #125 Fix](./ISSUE-125-FIX.md)
- [CLAUDE.md](../.claude/CLAUDE.md)

---

**Last Updated:** 2026-01-19
**Version:** 1.0
