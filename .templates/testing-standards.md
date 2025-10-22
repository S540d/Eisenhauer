---
# Testing Standards & Guidelines

Umfassende Richtlinien für Unit Tests, Integration Tests, E2E Tests und Coverage.

---

## Testing Pyramid

```
        /\
       /  \   E2E Tests
      /    \  - User Journeys
     /______\
    /        \
   /          \ Integration Tests
  /            \ - Feature Combinations
 /______________\
/                \
\  Unit Tests   /
 \  (70%)      /
  \           /
   \_________/
```

**Ideale Verteilung:**
- Unit Tests: 70% (schnell, viele, spezifisch)
- Integration Tests: 20% (mittel, Feature-Kombinationen)
- E2E Tests: 10% (langsam, User-Journeys)

---

## 1. Unit Tests

Testen einzelner Funktionen und Module isoliert.

### Framework

- **Vitest** (empfohlen) - schnell, TypeScript-ready, ähnlich Jest
- **Jest** - etabliert, gute Ökosystem-Integration

### Setup (Vitest)

```bash
npm install -D vitest @vitest/ui jsdom
```

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Vitest Konfiguration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60
    }
  }
})
```

### Test Structure

```typescript
// ✅ KORREKT: Klarer Test mit AAA Pattern
describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    // Arrange
    const email = 'user@example.com'

    // Act
    const result = validateEmail(email)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false for invalid email addresses', () => {
    // Arrange
    const email = 'invalid-email'

    // Act
    const result = validateEmail(email)

    // Assert
    expect(result).toBe(false)
  })

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })
})
```

### Best Practices

```typescript
// ✅ KORREKT: Beschreibende Test-Namen
it('should reject emails without domain extension', () => {
  expect(validateEmail('user@example')).toBe(false)
})

// ❌ FALSCH: Generischer Test-Name
it('should work correctly', () => {
  // Unklar, was getestet wird
})

// ✅ KORREKT: Eine Assertion pro Concept (mehrere OK)
it('should parse date correctly', () => {
  const date = parseDate('2024-01-15')
  expect(date.year).toBe(2024)
  expect(date.month).toBe(1)
  expect(date.day).toBe(15)
})

// ❌ FALSCH: Zu viel in einem Test
it('should do everything', () => {
  const user = createUser('John')
  const token = authenticate(user)
  const data = fetchData(token)
  // Schwer zu debuggen wenn etwas fehlschlägt
})
```

### Mocking

```typescript
// ✅ Mock externe Dependencies
describe('fetchUserData', () => {
  it('should fetch user data from API', async () => {
    // Arrange
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ id: 1, name: 'John' })
    })
    global.fetch = mockFetch

    // Act
    const result = await fetchUserData(1)

    // Assert
    expect(result).toEqual({ id: 1, name: 'John' })
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1')
  })
})

// ✅ Mock localStorage
describe('preferences', () => {
  it('should save and retrieve preferences', () => {
    const store = {}
    const mockLocalStorage = {
      getItem: (key) => store[key],
      setItem: (key, value) => { store[key] = value },
      clear: () => Object.keys(store).forEach(key => delete store[key])
    }
    global.localStorage = mockLocalStorage

    savePreference('theme', 'dark')
    expect(getPreference('theme')).toBe('dark')
  })
})
```

### Coverage Goals

```typescript
/**
 * Coverage Targets pro Modul-Typ:
 *
 * Critical (Utils, Validation, Business Logic): 85%+
 * Important (Components, Services): 70-80%
 * Secondary (UI, Helpers): 50-70%
 * Overall: 60%+ minimum
 */
```

---

## 2. Integration Tests

Testen von mehreren Modulen zusammen.

### Struktur

```typescript
describe('User Authentication Flow', () => {
  it('should complete login workflow', async () => {
    // Setup
    const user = { email: 'user@example.com', password: 'password123' }

    // Schritt 1: Input validieren
    expect(validateEmail(user.email)).toBe(true)

    // Schritt 2: API aufrufen (gemockt)
    const response = await loginUser(user.email, user.password)
    expect(response.status).toBe(200)

    // Schritt 3: Token speichern
    saveToken(response.token)
    expect(localStorage.getItem('authToken')).toBe(response.token)

    // Schritt 4: Benutzer-State aktualisieren
    const currentUser = getCurrentUser()
    expect(currentUser).toEqual(expect.objectContaining({ email: user.email }))
  })
})
```

### Fixtures für Daten

```typescript
// fixtures/user.ts
export const mockUser = {
  id: 1,
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user'
}

export const mockAdmin = {
  ...mockUser,
  id: 2,
  role: 'admin'
}

// In Tests verwenden
describe('User Permissions', () => {
  it('should allow admin to delete users', () => {
    expect(canDelete(mockAdmin)).toBe(true)
  })

  it('should deny regular user from deleting', () => {
    expect(canDelete(mockUser)).toBe(false)
  })
})
```

---

## 3. End-to-End (E2E) Tests

Testen von ganzen User Journeys in echter Browser-Umgebung.

### Framework: Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### Konfiguration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

### Test-Struktur

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete login flow', async ({ page }) => {
    // Navigate zu Login
    await page.click('a:has-text("Login")')

    // Fill Form
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit
    await page.click('button:has-text("Sign In")')

    // Verify Success
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Welcome, User')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('a:has-text("Login")')
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrong')
    await page.click('button:has-text("Sign In")')

    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials')
  })
})
```

### Best Practices

```typescript
// ✅ KORREKT: Nutze Accessibility Locators
await page.click('button:has-text("Save")')
await page.fill('input[aria-label="Email"]', 'email@example.com')

// ❌ FALSCH: Zu fragile XPath/CSS
await page.click('[class="btn btn-primary btn-md"]')
await page.fill('[type="email"][placeholder="Enter email"]', 'email@example.com')

// ✅ KORREKT: Page Objects Pattern
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async fillEmail(email: string) {
    await this.page.fill('input[name="email"]', email)
  }

  async fillPassword(password: string) {
    await this.page.fill('input[name="password"]', password)
  }

  async clickSubmit() {
    await this.page.click('button[type="submit"]')
  }

  async waitForDashboard() {
    await this.page.waitForURL('/dashboard')
  }
}

// In Tests
const loginPage = new LoginPage(page)
await loginPage.goto()
await loginPage.fillEmail('user@example.com')
await loginPage.fillPassword('password123')
await loginPage.clickSubmit()
await loginPage.waitForDashboard()
```

### Coverage mit E2E

```typescript
// Kritische User Journeys (müssen getestet sein):
// 1. Signup/Login
// 2. Hauptfeatures
// 3. Datenerfassung
// 4. Export/Download
// 5. Error Scenarios
// 6. Edge Cases (offline, slow network)
```

---

## 4. Performance Tests

Sicherstellen, dass Performance-Standards erfüllt werden.

### Lighthouse Audit (Automatisiert)

```bash
npm install -D @lighthouse/cli
```

```typescript
// performance.test.ts
import { test, expect } from '@playwright/test'

test('should meet Lighthouse performance targets', async ({ page }) => {
  await page.goto('/')

  // Simpler Lighthouse Check mit Playright
  const metrics = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    lcp: performance.getEntriesByType('largest-contentful-paint').pop()?.startTime || 0
  }))

  // Performance Targets
  expect(metrics.fcp).toBeLessThan(2500) // First Contentful Paint
  expect(metrics.lcp).toBeLessThan(4000) // Largest Contentful Paint
})
```

### Bundle Size Test

```bash
npm install -D bundle-size-monitor
```

```json
{
  "bundleSize": {
    "app.js": "50KB",
    "app.css": "15KB",
    "total": "65KB"
  }
}
```

---

## 5. Accessibility Tests

Automatisierte Accessibility Tests.

```bash
npm install -D axe-core axe-playwright
```

```typescript
// accessibility.test.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  })
})
```

---

## 6. Test Naming Conventions

```typescript
// ✅ KORREKT: Should [verb] [what] [when]
it('should display error message when email is invalid', () => {})
it('should disable submit button while loading', () => {})
it('should save form data to localStorage on success', () => {})

// ❌ FALSCH: Vague names
it('should work', () => {})
it('tests the function', () => {})
it('handles cases', () => {})
```

---

## 7. Pre-Commit Testing

Teste automatisch vor jedem Commit.

```bash
npm install -D husky lint-staged
npx husky install
```

```json
// .husky/pre-commit
{
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "vitest --run"],
    "*.{css,md}": ["prettier --write"]
  }
}
```

---

## 8. CI/CD Integration

Teste automatisch in GitHub Actions.

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 9. Coverage Reports

Überwache Test Coverage.

```bash
npm run test:coverage

# Generiert HTML Report unter coverage/index.html
```

### Coverage Ziele

```
Statement Coverage: 60%+ (overall), 85%+ (critical)
Branch Coverage: 50%+ (overall), 75%+ (critical)
Function Coverage: 60%+ (overall), 85%+ (critical)
Line Coverage: 60%+ (overall), 85%+ (critical)
```

---

## 10. Testing Checklist

- [ ] Unit Tests schreiben für kritische Module
- [ ] Integration Tests für Feature-Kombinationen
- [ ] E2E Tests für kritische User Journeys
- [ ] Accessibility Tests ausführen
- [ ] Performance Tests dokumentieren
- [ ] 60%+ Coverage erreichen
- [ ] 85%+ Coverage für kritische Module
- [ ] Alle Tests grün lokal
- [ ] Tests im CI/CD automatisiert
- [ ] Coverage Reports archiviert
- [ ] Flaky Tests behoben
- [ ] Test-Dokumentation aktuell

---

## Ressourcen

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---
