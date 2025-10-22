---
# Accessibility Guidelines - WCAG 2.1 AA Compliance

Richtlinien und Checklisten für die Implementierung von barrierefreien Webinhalten nach WCAG 2.1 Level AA Standard.

---

## Übersicht

Diese Richtlinien basieren auf Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Alle Projekte sollten mindestens AA-Konformität erreichen.

**WCAG 2.1 Struktur:**
- **Level A:** Grundlegende Anforderungen
- **Level AA:** Verbesserte Anforderungen (Standard für die meisten Projekte)
- **Level AAA:** Erweiterte Anforderungen (optional)

---

## 1. Keyboard Navigation (WCAG 2.1.1)

Alle Funktionalität muss über Tastatur bedienbar sein.

### Anforderungen

- ✅ Alle Funktionen müssen mit Tastatur zugreifbar sein
- ✅ Focus Order muss logisch sein (von oben nach unten, links nach rechts)
- ✅ Keine Fokus-Falle (Benutzer kann nicht aus Element entkommen)
- ✅ Skip Links für Schnellnavigation (z.B. "Skip to main content")
- ✅ Tab-Taste navigiert durch interaktive Elemente
- ✅ Enter/Space aktiviert Buttons und Checkboxes
- ✅ Arrow Keys navigieren in Menüs und Tab-Gruppen
- ✅ Escape schließt Dialoge und Menüs

### Implementation Checklist

```html
<!-- ✅ KORREKT: Semantische Buttons -->
<button onclick="handleClick()">Click me</button>

<!-- ❌ FALSCH: DIV als Button (ohne Keyboard Support) -->
<div onclick="handleClick()" role="button">Click me</div>

<!-- ✅ KORREKT: Links sind Links -->
<a href="/page">Go to page</a>

<!-- ❌ FALSCH: Div mit Click Handler -->
<div onclick="navigate('/page')">Go to page</div>
```

### Tab Order Management

```html
<!-- Nutze tabindex="0" um fokussierbar zu machen -->
<div tabindex="0" role="button">Custom Button</div>

<!-- NICHT: tabindex > 0 (wirkt sich auf natürliche Reihenfolge aus) -->
<!-- ❌ <div tabindex="5">Skip ahead</div> -->

<!-- Entferne aus Tab Order mit tabindex="-1" wenn nötig -->
<div tabindex="-1">Not in tab order</div>
```

### Skip Links (Best Practice)

```html
<body>
  <!-- Skip Link am Anfang -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <nav><!-- Navigation --></nav>

  <main id="main-content">
    <!-- Main content -->
  </main>
</body>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

---

## 2. Focus Indicators (WCAG 2.4.7)

Focus Styles müssen deutlich sichtbar sein.

### Anforderungen

- ✅ Focus Ring muss immer sichtbar sein
- ✅ Kontrast von Focus Ring: mindestens 3:1
- ✅ Größe: mindestens 2px oder besser 3-4px
- ✅ Offset: mindestens 2px außerhalb des Elements
- ✅ Nicht-Link-Navigation muss auch fokussierbar sein

### CSS Implementation

```css
/* BESSER: Nutze :focus-visible für Keyboard-only Focus */
button:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* ALT: :focus für alle Eingaben (besser als outline: none!) */
input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* ❌ FALSCH: Outline entfernen! */
button:focus {
  outline: none; /* NIEMALS! */
}
```

### Focus Visible für alle Elemente

```css
/* Globale Focus Styles */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 3px solid var(--color-focus, #0066cc);
  outline-offset: 2px;
}

/* Custom fokussierbare Elemente */
[role="button"]:focus-visible,
[role="menuitem"]:focus-visible,
[role="tab"]:focus-visible {
  outline: 3px solid var(--color-focus, #0066cc);
  outline-offset: 2px;
}
```

---

## 3. Color Contrast (WCAG 1.4.3, 1.4.11)

Ausreichender Kontrast für alle Text- und UI-Elemente.

### Kontrastanforderungen

```
Text Kontraste:
- Normal Text (< 18pt): mindestens 4.5:1
- Large Text (>= 18pt): mindestens 3:1
- Bold Text (>= 14pt, bold): mindestens 3:1

UI Components:
- Focus Indicator: mindestens 3:1
- Grafische Objekte: mindestens 3:1
- Icons: mindestens 3:1
```

### Beispiele

```css
/* ✅ KORREKT: 7:1 Kontrast (schwarzer Text auf Weiß) */
body {
  background-color: #ffffff;
  color: #000000;
}

/* ⚠️ GRENZWERTIG: 4.5:1 Kontrast (minimum für normal text) */
.secondary-text {
  color: #595959;
}

/* ❌ FALSCH: 2.1:1 Kontrast (unter Minimum) */
.disabled-text {
  color: #b3b3b3; /* Nicht ausreichend */
}
```

### Tools zur Überprüfung

- [Contrast Ratio](https://contrast-ratio.com/)
- [Accessible Colors](https://accessible-colors.com/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools: Lighthouse Audit

### Dark Mode Kontrast

```css
/* Light Mode */
:root {
  --color-bg: #ffffff;
  --color-text: #111827; /* 17:1 Kontrast */
}

/* Dark Mode */
[data-theme="dark"] {
  --color-bg: #1f2937;
  --color-text: #f3f4f6; /* 15:1 Kontrast */
}
```

---

## 4. Semantic HTML (WCAG 1.3.1)

Nutze semantisches HTML für korrekte Struktur und Screen Reader Support.

### Semantic Elements

```html
<!-- ✅ Semantic HTML -->
<header>Header Content</header>
<nav>Navigation Links</nav>
<main>Main Content</main>
<article>Article Content</article>
<section>Section</section>
<aside>Sidebar</aside>
<footer>Footer</footer>

<!-- ❌ FALSCH: Alle DIVs (kein Kontext) -->
<div id="header">Header Content</div>
<div id="nav">Navigation Links</div>
<div id="main">Main Content</div>
```

### Links & Buttons

```html
<!-- ✅ KORREKT: Links sind links, Buttons sind buttons -->
<a href="/page">Go to page</a>
<button onclick="action()">Do something</button>

<!-- ❌ FALSCH: DIV als Button -->
<div onclick="action()" role="button">Do something</div>
<!-- Problem: Keine Tastaturunterstützung, Screen Reader Verwirrung -->
```

### Headings (H1-H6)

```html
<!-- ✅ KORREKT: Ein H1 pro Seite, logische Hierarchie -->
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h2>Section 2</h2>

<!-- ❌ FALSCH: Mehrere H1, unlogische Hierarchie -->
<h1>Page Title</h1>
<h3>Subsection (skipped H2!)</h3>

<!-- ❌ FALSCH: Styling mit H-Tags -->
<h1 style="font-size: 12px;">Large Text</h1> <!-- Nutze strong statt h1! -->
```

### Listen

```html
<!-- ✅ KORREKT: Echte Listen für Listenelemente -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- ❌ FALSCH: DIVs für Listen -->
<div>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 5. ARIA Labels & Descriptions

Nutze ARIA für zusätzliche Informationen wo nötig.

### ARIA Best Practices

```html
<!-- Icon Button: Nutze aria-label -->
<button aria-label="Settings">
  <svg><!-- settings icon --></svg>
</button>

<!-- Input Label: aria-label oder <label> -->
<label for="email">Email</label>
<input id="email" type="email">

<!-- Beschreibung: aria-describedby -->
<input
  type="password"
  aria-describedby="pwd-hint"
>
<span id="pwd-hint">Min. 8 characters</span>

<!-- Live Region: aria-live für dynamische Updates -->
<div aria-live="polite" aria-atomic="true">
  3 items added
</div>
```

### Beispiele

```html
<!-- Bildschirm-Leser-freundliche Navigation -->
<nav aria-label="Main Navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- Button mit Icon -->
<button
  class="menu-toggle"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="navigation"
>
  <svg><!-- hamburger icon --></svg>
</button>
<nav id="navigation" hidden>
  <!-- Navigation -->
</nav>

<!-- Error Handling -->
<div role="alert" aria-live="assertive">
  Please enter a valid email address
</div>
```

---

## 6. Images & Alt Text (WCAG 1.1.1)

Alle Bilder müssen `alt` Attribute haben.

### Alt Text Richtlinien

```html
<!-- ✅ KORREKT: Beschreibender Alt Text -->
<img
  src="puppy.jpg"
  alt="Golden retriever puppy running in grass"
>

<!-- ✅ DEKORATIV: Leer alt="" und aria-hidden -->
<img
  src="decorative-line.png"
  alt=""
  aria-hidden="true"
>

<!-- ✅ ICON: aria-label auf Button statt alt -->
<button aria-label="Delete item">
  <img src="trash-icon.svg" alt="">
</button>

<!-- ❌ FALSCH: Kein alt -->
<img src="important-chart.png">

<!-- ❌ FALSCH: Redundanter Alt Text -->
<img
  src="logo.png"
  alt="image of logo" <!-- Sagen Sie "image" nicht! -->
>
```

### Alt Text Checkliste

- ✅ Kurz (max 125 Zeichen)
- ✅ Beschreibt Inhalt, nicht "Bild von..."
- ✅ Verwende Keywords aber kein Keyword Stuffing
- ✅ Für Icons: Nutze `aria-label` auf Element, nicht `alt`
- ✅ Für dekorative Bilder: `alt=""` mit `aria-hidden="true"`

### Komplexe Bilder

```html
<!-- Tabelle/Chart: Nutze aria-label oder aria-describedby -->
<img
  src="sales-chart.svg"
  alt="Sales chart showing quarterly results"
  aria-describedby="chart-description"
>
<p id="chart-description">
  Q1: $100k, Q2: $150k, Q3: $120k, Q4: $180k
</p>
```

---

## 7. Forms & Labels (WCAG 1.3.1, 3.3.1)

Alle Form-Elemente müssen klar gekennzeichnet sein.

### Anforderungen

- ✅ Jedes Input braucht Label
- ✅ Label mit `for` Attribut verknüpft
- ✅ Error Messages deutlich angezeigt
- ✅ Required Fields gekennzeichnet
- ✅ Inline Validation

### Implementation

```html
<!-- ✅ KORREKT: Label verknüpft mit Input -->
<label for="email">Email Address *</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
>

<!-- ✅ Mit Error Message -->
<label for="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  class="is-error"
>
<span id="email-error" role="alert">
  Please enter a valid email
</span>

<!-- ✅ Fieldset für Gruppen -->
<fieldset>
  <legend>Choose your subscription:</legend>
  <label>
    <input type="radio" name="plan" value="basic">
    Basic
  </label>
  <label>
    <input type="radio" name="plan" value="pro">
    Pro
  </label>
</fieldset>

<!-- ❌ FALSCH: Kein Label -->
<input type="email"> <!-- Screen Reader sieht nicht, was der Input ist -->

<!-- ❌ FALSCH: Placeholder statt Label -->
<input
  type="email"
  placeholder="your@email.com" <!-- Kein echtes Label! -->
>
```

---

## 8. Color Not Only (WCAG 1.4.1)

Informationen sollten nicht nur durch Farbe vermittelt werden.

### Anforderungen

```html
<!-- ❌ FALSCH: Nur Farbe unterscheidet Status -->
<span style="color: red;">Error</span>
<span style="color: green;">Success</span>

<!-- ✅ KORREKT: Icon + Farbe + Text -->
<span aria-label="Error" style="color: red;">
  ✕ Error occurred
</span>
<span aria-label="Success" style="color: green;">
  ✓ Success!
</span>

<!-- ✅ KORREKT: Pattern + Farbe -->
<div style="
  background-color: red;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px);
">
  Error Area
</div>
```

### Link-Unterscheidung

```html
<!-- ❌ FALSCH: Nur Farbe unterscheidet Links -->
<a href="/page" style="color: blue;">Link</a>

<!-- ✅ KORREKT: Underline + Farbe oder Icon -->
<a href="/page" style="color: blue; text-decoration: underline;">
  Link
</a>

<!-- ✅ AUCH GUT: Icon indiziert Link -->
<a href="/page">
  External Link <svg><!-- external icon --></svg>
</a>
```

---

## 9. Text Resizing (WCAG 1.4.4)

Text sollte skalierbar sein bis zu 200%.

### Anforderungen

- ✅ Keine feste Größe in Pixeln für Text (nutze rem/em)
- ✅ Layouts sollten bis 200% Text-Zoom funktionieren
- ✅ Kein `overflow: hidden` auf Text-Container

### CSS Best Practice

```css
/* ✅ KORREKT: Relative Einheiten -->
body {
  font-size: 16px; /* Base for rem calculation */
}

h1 {
  font-size: 2rem; /* 32px */
}

p {
  font-size: 1rem; /* 16px */
}

/* ❌ FALSCH: Feste Größen -->
.text {
  font-size: 14px; /* Fixed! */
}

/* ❌ FALSCH: Overflow hidden auf Text -->
.truncated {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* Nutzer kann vergrößerten Text nicht sehen! */
}
```

---

## 10. Motion & Animation (WCAG 2.3.3, 2.3.3)

Animationen sollten nicht störend wirken oder zu schnell blinken.

### Anforderungen

- ✅ Nichts blinkt schneller als 3x pro Sekunde
- ✅ Autoplay Videos/Animationen haben Pause-Button
- ✅ Respektiere `prefers-reduced-motion`

### Implementation

```css
/* Respektiere Benutzer-Präferenz für reduzierte Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Normal Animation (wenn Motion erlaubt) */
@media (prefers-reduced-motion: no-preference) {
  button {
    transition: all 200ms ease-out;
  }
}
```

---

## 11. Links & Button Text (WCAG 2.4.4)

Link- und Button-Text sollten aussagekräftig sein.

### Anforderungen

```html
<!-- ❌ FALSCH: Generischer Link-Text -->
<a href="/document.pdf">Click here</a>
<a href="/page">Read more</a>

<!-- ✅ KORREKT: Aussagekräftiger Link-Text -->
<a href="/document.pdf">Download Sales Report PDF</a>
<a href="/page">Read full case study</a>

<!-- ✅ MIT ARIA (wenn generischer Text nötig) -->
<a href="/article">
  Read more <span aria-label="about product updates"></span>
</a>
```

---

## 12. Testing & Audit

### Automated Testing Tools

```bash
# axe DevTools (Browser Extension)
# Wave Browser Extension
# Lighthouse (Chrome DevTools)
# NVDA Screen Reader (kostenlos)
# JAWS Screen Reader (kommerziell)
```

### Manual Testing Checklist

- [ ] Keyboard-only Navigation (ohne Maus)
- [ ] Screen Reader Test (NVDA/JAWS)
- [ ] Color Contrast Check
- [ ] Focus Order logisch?
- [ ] Tab Order getestet?
- [ ] Forms ausfüllbar mit Tastatur?
- [ ] Modals schließbar mit Escape?
- [ ] Alt Text ausreichend?
- [ ] 200% Zoom funktioniert?
- [ ] Dark Mode gelesen?

### Lighthouse Audit

```bash
# Chrome DevTools > Lighthouse > Accessibility

Ziele:
- Accessibility Score: 90+
- Best Practices: 90+
```

---

## Quick Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Focus visible auf allen interaktiven Elementen
- [ ] Mindestens 4.5:1 Kontrast für Text
- [ ] Alt Text auf allen Bildern
- [ ] Labels auf allen Form-Elementen
- [ ] Keyboard Navigation möglich
- [ ] ARIA Labels wo semantic HTML nicht reicht
- [ ] Keine nur-Farbe Informationen
- [ ] Text skalierbar bis 200%
- [ ] Respektiere `prefers-reduced-motion`
- [ ] Lighthouse Accessibility Score 90+
- [ ] Screen Reader getestet

---

## Ressourcen

- [WCAG 2.1 Official Spec](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

---
