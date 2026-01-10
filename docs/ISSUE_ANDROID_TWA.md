# Issue: Android TWA Build Flavors & Environments

**Priority:** Critical / Dringend
**Type:** Feature / Configuration

## Description
Current Android App points statically to the Production URL (`.../Eisenhauer/`).
We need to support the new isolated environments (Testing, Staging) in the Android App (TWA).

## Requirements
1. **Gradle Build Flavors**:
   - `prod` -> `https://s540d.github.io/Eisenhauer/`
   - `staging` -> `https://s540d.github.io/Eisenhauer/staging/`
   - `testing` -> `https://s540d.github.io/Eisenhauer/testing/`

2. **App Identity**:
   - Different `applicationId` (Package Name) for side-by-side installation:
     - Prod: `com.sven4321.eisenhauer`
     - Staging: `com.sven4321.eisenhauer.staging`
     - Testing: `com.sven4321.eisenhauer.testing`
   - Distinct App Names/Icons (e.g., "Eisenhauer (Test)").

3. **Digital Asset Links**:
   - Update `assetlinks.json` on the website to trust all three package names.

## Acceptance Criteria
- [ ] Can install Prod, Staging, and Testing apps on one device simultaneously.
- [ ] Each app opens its correct environment URL without browser address bar.
