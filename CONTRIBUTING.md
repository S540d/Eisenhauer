# Contributing to Eisenhauer Matrix

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Development Setup

**Prerequisites:** Node.js 18+, npm 9+

```bash
git clone https://github.com/S540d/Eisenhauer.git
cd Eisenhauer
npm install
npm run dev          # Dev server at http://localhost:5173
```

## Branch Strategy

```
feature/issue-XXX  →  testing  →  main
```

- Always branch off `testing`
- Target `testing` in your PR (never `main` directly)
- Branch naming: `feature/issue-XXX`, `fix/issue-XXX`, `chore/XXX`

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add recurring task support
fix: correct date parsing in Berlin timezone
chore: update firebase to 12.14
docs: add setup guide for Firebase
refactor: extract auth logic into module
test: add E2E test for drag-drop on mobile
```

## Pull Request Guidelines

1. **Target branch:** Always `testing`
2. **Title:** Include issue reference: `fix #123: short description`
3. **Description:** What changed and why
4. **Checklist before opening:**
   - [ ] Tests pass locally (`npm test`)
   - [ ] No new lint errors (`npm run lint`)
   - [ ] Translations updated (DE + EN) if user-facing text changed
   - [ ] `CHANGELOG.md` updated under `[Unreleased]`

The automated CI pipeline runs on every PR:
- Code Quality & Linting
- Unit Tests & Coverage
- Security Audit
- Build (Web)
- Review Gate (Claude automated review)

## Code Style

ESLint and Prettier are configured and enforced automatically:

```bash
npm run lint         # Check for lint errors
npm run lint:fix     # Auto-fix lint errors
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
```

Pre-commit hooks run Prettier and ESLint automatically — no manual formatting needed.

## Testing Requirements

- **Unit tests** for new or changed logic in `tests/unit/`
- **E2E tests** for new user flows in `tests/e2e/`
- Run the full suite before pushing: `npm test`
- Coverage report: `npm run test:coverage`

```bash
npm test                # Run all unit tests (Vitest)
npm run test:e2e        # Run E2E tests (Playwright)
npm run test:coverage   # Coverage report
```

## Pre-commit Hooks (Husky)

The following checks run automatically on `git commit`:

1. **Prettier** — formats all files
2. **ESLint** — checks for code issues
3. **No `console.log`** — debug logs must be removed before committing

On `git push`:
- Prettier format check (no writes, just verify)

These are already configured via `npm install` (Husky sets up the hooks).

## Firebase Setup (for local dev with auth)

See [docs/FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md) for instructions on setting up a local Firebase project. A `.env.local` with your own Firebase config is required for authentication features.

## Questions?

Open an issue or check the existing [docs/](docs/) folder for architecture and technical details.
