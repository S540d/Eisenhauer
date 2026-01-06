---
# UX/Design-Vorgaben für Projekte

Allgemeine UX/UI Standards für konsistente, benutzerfreundliche Interfaces über alle Projekte hinweg.

> **Zuletzt aktualisiert:** 2025-12-26
> **Hinweis:** Technische Implementierungsdetails (Android Edge-to-Edge, OTA Updates, App Links, etc.) finden sich in [technische_vorgaben.md](technische_vorgaben.md)

---

## Design Fundamentals

### Design Philosophy
- **Mobile First:** Entwickle zunächst für Mobilgeräte (320px+), dann Tablet (768px+), dann Desktop (1024px+)
- **Progressive Enhancement:** Funktionalität sollte auch mit JavaScript-Errors noch funktionieren
- **Einfachheit:** Minimalist Design, entferne unnötige Elemente
- **Konsistenz:** Ein einheitliches Design-System über alle Screens hinweg
- **Feedback:** Jede Benutzeraktion sollte sichtbares Feedback bekommen

---

## 🎨 Moderne Design-Systeme (2024/2025)

> **Neu hinzugefügt:** Drei moderne Design-Ansätze für zeitgemäße Apps

### Option 1: "Soft & Modern" ⭐ **EMPFOHLEN**

**Philosophie**: Warme, sanfte Ästhetik mit subtiler Tiefe und Eleganz

#### Farbpalette
- **Backgrounds**:
  - Light: `#FAFAFA` (cremeweiß, nicht pures Weiß)
  - Dark: `#0A0A0A` (dunkelgrau, nicht pures Schwarz)
- **Surfaces**:
  - Light: `#F5F5F5` → `#EFEFEF` (weicherer Kontrast)
  - Dark: `#1A1A1A` → `#252525` (wärmere Töne)
- **Schatten**: Weiche, mehrschichtige Elevation
  - Small: `shadowOpacity: 0.08, shadowRadius: 8, elevation: 2`
  - Medium: `shadowOpacity: 0.12, shadowRadius: 16, elevation: 4`
  - Large: `shadowOpacity: 0.18, shadowRadius: 24, elevation: 8`

#### Border & Spacing
- **Border-Radius**:
  - Cards: `16-20px` (statt 12px)
  - Buttons: `12-16px`
  - Small Elements: `8-10px`
- **Margins**: 8px Grid-System beibehalten
- **Padding**: Großzügiger (min. 16px für Cards)

#### Visuelle Effekte
- **Glassmorphism-Tooltips**:
  ```tsx
  backgroundColor: Platform.select({
    web: 'rgba(255, 255, 255, 0.85)',
    default: colors.surface
  }),
  backdropFilter: 'blur(10px)', // nur Web
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 20,
  ```

- **Gradient-Accents** für wichtige Elemente:
  ```tsx
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  // oder React Native: react-native-linear-gradient
  ```

- **Grid-Lines**:
  - Gestrichelt statt solid: `strokeDasharray="4,8"`
  - Opacity: `0.15` (statt 0.3)
  - Weichere Farbe: `#D0D0D0` (Light), `#404040` (Dark)

#### Interaktive Elemente
- **Hover-States** (Web):
  - Smooth Transition: `transition: all 0.2s ease`
  - Subtle Scale: `transform: scale(1.02)`
  - Brightness Shift: `filter: brightness(1.05)`

- **Buttons**:
  - Primary: Gradient oder Solid mit Schatten
  - Secondary: Border mit Hover-Fill
  - Ghost: Transparent mit Hover-Background

#### Typography
- **Font-Weights**:
  - Headings: `600-700` (semibold-bold)
  - Body: `400-500` (regular-medium)
  - Labels: `500-600` (medium-semibold)
- **Größen**: Skalierbar, min. 14px für Body Text

---

### Option 2: "Minimal & Clean"

**Philosophie**: Reduktion auf das Wesentliche, maximale Klarheit

#### Farbpalette
- **Monochrome Base**: Grauskala mit einem Akzent
  - Background: `#FFFFFF` / `#0D0D0D`
  - Surface: Nur 2-3 Graustufen
  - Accent: Eine kräftige Farbe (z.B. `#0066FF`)

#### Layout-Prinzipien
- **Mehr Whitespace**: Mindestens 24px zwischen Sections
- **Dünne Linien**: `1px` statt `2px`, Opacity `0.1-0.2`
- **Flache Hierarchie**: Maximal 2-3 Ebenen
- **Card-Based**: Jeder Inhalt in separaten, leicht abgesetzten Cards

#### Besonderheiten
- **Floating Action Buttons**: Primäre Aktionen als FAB
- **Icon-First**: Icons für schnelle Erkennung
- **Minimale Schatten**: Nur `elevation: 1-2`

**⚠️ Einschränkung**: Weniger geeignet für komplexe Datenvisualisierungen mit vielen Kategorien/Farben

---

### Option 3: "Glassmorphism & Modern"

**Philosophie**: Transluzenz und Tiefe durch Blur-Effekte

#### Visuelle Charakteristik
- **Transluzente Cards**:
  ```tsx
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)'
  ```

- **Frosted Glass**: Hintergründe scheinen durch
- **Leuchtende Akzente**: Neon-ähnliche Highlights
- **Gradient-Overlays**: Farbverläufe überall

#### Animationen
- **Smooth Transitions**: `0.3-0.5s cubic-bezier`
- **Micro-Interactions**: Subtile Reaktionen auf Inputs
- **Parallax-Effekte**: Leichte Bewegung bei Scroll

**⚠️ Einschränkung**:
- Performance-intensiv auf älteren Geräten
- Nur teilweise auf React Native umsetzbar (Web bevorzugt)
- Kann von Inhalten ablenken

---

### 🎯 Empfehlungen nach Anwendungsfall

| Anwendungsfall | Empfohlene Option | Begründung |
|----------------|-------------------|------------|
| **Daten-Apps** (Charts, Analytics) | **Option 1** | Balanciert Ästhetik und Funktionalität |
| **Content-Apps** (News, Blogs) | Option 2 | Fokus auf Lesbarkeit |
| **Portfolio/Showcase** | Option 3 | Wow-Effekt, visuell beeindruckend |
| **Business/Professional** | Option 1 oder 2 | Seriös und modern |
| **Creative/Artistic** | Option 3 | Experimentell und einzigartig |

---

## Farbpalette (Color System)

### Grundprinzipien
- Definiere eine primäre Farbpalette mit max. 5 Hauptfarben
- Nutze nur HSL/RGB, keine willkürlichen Hex-Werte
- Dokumentiere alle Farben in `design-tokens.json` oder CSS Variables

### Semantische Farben
```css
/* Statusfarben */
--color-success: #10b981;  /* Grün: Erfolg, Bestätigung */
--color-warning: #f59e0b;  /* Gelb/Orange: Warnung, Achtung */
--color-danger: #ef4444;   /* Rot: Fehler, Löschung */
--color-info: #3b82f6;     /* Blau: Informationen, Links */

/* Neutral */
--color-bg-primary: #ffffff;     /* Light Mode Background */
--color-bg-secondary: #f9fafb;   /* Light Mode Secondary BG */
--color-text-primary: #111827;   /* Light Mode Text */
--color-text-secondary: #6b7280; /* Light Mode Secondary Text */
```

### Kontrast-Anforderungen (WCAG 2.1)
- **Normal Text:** Mindestens 4.5:1 Kontrast
- **Large Text:** Mindestens 3:1 Kontrast
- **UI Components:** Mindestens 3:1 für aktive Elemente
- **Tools zur Überprüfung:** [Accessible Colors](https://accessible-colors.com/), [Contrast Ratio](https://contrast-ratio.com/)

---

## Theme-Aware Colors Architecture ⭐

> **Pattern entdeckt und erfolgreich implementiert:** EnergyPriceGermany
> **Anwendbar auf:** React Native / Expo Apps mit Tooltip-/Modal-Overlays

### Problem (Anti-Pattern)

❌ **Nicht empfohlen:** Komponenten mit einzelnen Farb-Strings und hardcoded Dark/Light Mode Logik
- Tooltips/Overlays haben unzureichenden Kontrast in Licht/Dunkel-Modus-Kombinationen
- Keine Zugriff auf das vollständige Theme System
- Farben-Logik muss in jeder Komponente dupliziert werden

### Lösung: Theme-Aware Colors Pattern ✅

**Empfohlen:** Komponenten erhalten das komplette `ThemeColors` Objekt

#### 1. Theme Colors Typ definieren

```typescript
// utils/theme.ts
export interface ThemeColors {
  background: string;      // Main background color
  surface: string;         // Card/Surface background
  text: string;           // Primary text color
  textSecondary: string;  // Secondary/dimmed text
  primary: string;        // Primary accent color
  gridLine: string;       // Grid lines, borders
}
```

#### 2. Komponenten-Interface erweitern

```typescript
// components/MyChart.tsx
interface MyChartProps {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  colors: ThemeColors;  // ← ADD THIS
}
```

#### 3. Tooltips mit Theme-Aware Farben

```typescript
// Intelligente Tooltip-Hintergrund-Auswahl
const tooltipBgColor = backgroundColor === colors.surface
  ? colors.background
  : colors.surface;

return (
  <View style={{
    backgroundColor: tooltipBgColor,  // ← Uses theme
    borderColor: colors.gridLine,     // ← Uses theme
    // ...
  }}>
    <Text style={{ color: colors.text }}>
      Börsenpreis: 45,50 ¢
    </Text>
  </View>
);
```

#### 4. Parent-Komponente aktualisieren

```typescript
// App.tsx
<MyChart
  backgroundColor={colors.surface}
  textColor={colors.text}
  gridColor={colors.gridLine}
  colors={colors}  // ← Pass complete theme object
/>
```

### Vorteile

✅ **Single Source of Truth** - Alle Farben zentral
✅ **WCAG AA Compliance** - Automatische Light/Dark Mode Unterstützung
✅ **Wartbarkeit** - Nur eine Theme-Datei ändern
✅ **Skalierbar** - Neue Farben automatisch verfügbar

### Referenz-Implementierung

Siehe EnergyPriceGermany Project:
- **GitHub Commit:** [Apply theme-aware colors pattern](https://github.com/S540d/Energy_Price_Germany/commit/4f6e51c)
- **Dateien:** `utils/theme.ts`, `components/charts/`.

---

## Typography (Schrift)

### Font Selection
- **Maximal 2 Schriftarten:** Eine für Headings, eine für Body Text
- **Web Safe Fonts:** System Fonts oder Google Fonts mit Fallback
- **Font Size Scale:** Basierend auf 16px Base Size:
  ```css
  --font-xs: 0.75rem;   /* 12px - kleine Labels */
  --font-sm: 0.875rem;  /* 14px - small text */
  --font-base: 1rem;    /* 16px - body text */
  --font-lg: 1.125rem;  /* 18px - emphasis */
  --font-xl: 1.25rem;   /* 20px - subheadings */
  --font-2xl: 1.5rem;   /* 24px - section titles */
  --font-3xl: 1.875rem; /* 30px - page titles */
  ```

### Line Height & Spacing
- **Body Text:** 1.5 - 1.6 line-height (lesbar)
- **Headings:** 1.2 - 1.3 line-height
- **Letter Spacing:** Normal (0) für Body, 0.02em für Headings
- **Paragraph Spacing:** 1.5x Font Size (z.B. 24px bei 16px Font)

---

## Spacing System (Whitespace)

### 8px Base Grid
Basiere alle Abstände auf 8px Inkremente:

```css
--space-0: 0;      /* 0px */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */
--space-12: 3rem;   /* 48px */
--space-16: 4rem;   /* 64px */
```

### Anwendung
- **Button Padding:** 8px (vertical) × 16px (horizontal) mindestens
- **Card Padding:** 16px - 24px
- **Container Margin:** 16px (mobile), 32px (desktop)
- **Gap zwischen Items:** 8px - 16px
- **Section Spacing:** 32px - 64px

---

## Responsive Design Breakpoints

```css
/* Mobile-First Breakpoints */
--bp-sm: 320px;   /* Mobile */
--bp-md: 768px;   /* Tablet Portrait */
--bp-lg: 1024px;  /* Tablet Landscape / Small Desktop */
--bp-xl: 1280px;  /* Desktop */
--bp-2xl: 1536px; /* Large Desktop */
```

### Layout-Richtlinien
- **Mobile (< 768px):** Single Column, Full Width, 16px Margins
- **Tablet (768px - 1024px):** 2-3 Columns, Flexible Layout
- **Desktop (> 1024px):** Multi-Column, Max Width 1200px

---

## Komponenten Standards

### Buttons
- **Größe:** Minimum 44px × 44px (Apple HIG, WCAG Touch Target)
- **Padding:** 8px - 12px (vertical), 16px - 24px (horizontal)
- **Zustand:** Default, Hover, Active, Disabled, Loading
- **Label:** Kurz, actionsorientiert (z.B. "Save", "Delete", "Cancel")
- **Icon + Text:** Icon links, Text rechts mit 8px Gap

### Form Elements (Input, Textarea, Select)
- **Größe:** 40px - 44px Height (Touch-friendly)
- **Padding:** 8px - 12px
- **Border:** 1px solid, 4px border-radius
- **Focus State:** Visible Focus Ring (min. 2px, 2px offset)
- **Label:** Immer vorhanden, über Input, `for` Attribut
- **Error State:** Rote Border + Error Message unter Input

### Cards
- **Padding:** 16px - 24px
- **Border:** 1px solid (#e5e7eb) oder Box-Shadow
- **Border-Radius:** 8px - 12px
- **Spacing:** 16px - 24px zwischen Cards

### Modals / Dialogs
- **Width:** 90vw max 512px (mobile), 600px (desktop)
- **Padding:** 24px - 32px
- **Header:** Bold, 18px - 20px Font
- **Close Button:** X Icon, top-right, 40px × 40px
- **Backdrop:** Dunkelgrau mit 70% Opacity
- **Animation:** Fade-in (200ms)

### Navigation
- **Height:** 56px - 64px auf Mobile, 60px - 80px auf Desktop
- **Links:** Clear, Underline on Hover
- **Active State:** Farbe oder Underline
- **Mobile Menu:** Hamburger Icon, Slide-out oder Modal

---

## Dark Mode / Theme Support

### Implementation
- **CSS Variables:** Nutze CSS Custom Properties für Farbwechsel
- **Klasse-basiert:** `.dark` Klasse auf `<html>` oder `<body>`
- **localStorage:** Speichere Theme-Präferenz mit Key `theme`
- **OS Preference:** Nutze `prefers-color-scheme` Media Query als Fallback

### Dark Mode Farben
```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
}

[data-theme="dark"] {
  --color-bg: #1f2937;
  --color-text: #f3f4f6;
}
```

### Dark Mode Rules
- **Nicht einfach invertieren:** Nutze Farbgestaltung statt Inversion
- **Contrast:** Stelle sicher, dass Kontrast in beiden Modes 4.5:1+ ist
- **Icons:** Können gleich bleiben, aber Farbe anpassen

---

## Barrierefreiheit (Accessibility / WCAG 2.1 AA)

### Keyboard Navigation
- **Alle Features:** Müssen mit Tastatur bedienbar sein
- **Tab Order:** Logische Reihenfolge (von oben nach unten)
- **Focus Ring:** Sichtbar, mindestens 2px, Kontrast mindestens 3:1
- **Escape:** Schließt Modals, Dropdowns
- **Enter/Space:** Aktiviert Buttons, Checkboxes

### Screen Reader Support
- **Semantic HTML:** Nutze `<button>`, `<nav>`, `<main>`, `<article>` statt `<div>`
- **ARIA Labels:** `aria-label` für Icons, `aria-labelledby` für Gruppen
- **ARIA Live:** `aria-live="polite"` für dynamische Updates
- **Headings:** `<h1>` (1x pro Seite), dann `<h2>`, `<h3>`, keine Lücken
- **Lists:** Nutze `<ul>`, `<ol>` für Listen

### Color & Contrast
- **Kontrast:** Text 4.5:1 (normal), 3:1 (large, UI components)
- **Color Only:** Informationen nicht nur durch Farbe vermitteln (auch Icon)
- **Focus Ring:** Muss sichtbar sein
- **Disabled State:** Mindestens 3:1 Kontrast auch disabled

### Links & Buttons
- **Unterscheidbar:** Links sollten durch Farbe, Underline, oder Icon unterscheidbar sein
- **Aussagekräftig:** Link-Text sollte aussagekräftig sein ("Details lesen" statt "Mehr")
- **Touch Target:** Mindestens 44px × 44px

### Images & Multimedia
- **Alt Text:** Jedes `<img>` braucht `alt` Attribut
- **Meaningful Alt:** Beschreibe den Inhalt, nicht "image of..."
- **Videos:** Subtitles/Captions (CC)
- **Decorative Images:** `alt=""` oder `aria-hidden="true"`

### Forms
- **Labels:** Jedes Input braucht `<label>` mit `for` Attribut
- **Error Messages:** Mit `aria-describedby`, verknüpft mit Input
- **Required:** Nutze `required` Attribut, zeige visuell an (z.B. Asterisk)
- **Fieldset:** Nutze `<fieldset>` + `<legend>` für Gruppen

---

## Settings Menu (Standardized Struktur)

**Settings Menu:**
- Platzierung: Auf Höhe der Seitentitel (Überschrift), oben rechts
- Symbol: Drei vertikale Punkte (⋮) - Android-Standard
- Aria-Label: `aria-label="Settings"`

### Settings Menu Content - Reihenfolge

1. **Appearance Settings**
   - Theme Toggle: **Light, Dark, System** (3 Optionen)
   - Language Toggle: English, Deutsch
   - Plain Text Labels, kein Emoji

2. **App-spezifische Settings** (Optional)
   - z.B. Operation, Difficulty Mode
   - Separate Sections mit Separators

3. **User Account Management** (nur bei Auth vorhanden)
   - "Sign Out" / "Abmelden"-Button
   - Platzierung: Oberhalb von "Export" oder separate Section
   - Style: Primary color link oder destructive button

4. **Export / Data Management** (Optional)
   - Speichern in localStorage/AsyncStorage
   - Taste zum Export als Json-Daten

5. **Feedback, Support & About - Unified Row** ⭐
   - **KRITISCH:** Alle drei MÜSSEN in einer Zeile stehen
   - Gleich breite Buttons (flex: 1)
   - **Feedback Link:** `mailto:devsven@posteo.de?subject=AppName Feedback`
   - **Support Link:** `https://ko-fi.com/devsven`
   - **About Button:** Öffnet Modal-Popup
   - Plain Text, kein Emoji
   - Separator davor und danach

6. **About Modal Popup**
   - **Trigger:** "About" Button im Settings-Menü
   - **Header:** "About" Title mit Close Button (✕)
   - **Content:**
     - Version: "Version X.Y.Z"
     - wenn externe Daten: "Data Source: ..."
     - License: "App License: MIT", "Keine kommerzielle Nutzung ohne Genehmigung"
   - **Modal-Style:** Centered, Max 512px width, semi-transparent backdrop

### Design Token Spezifikation - Settings Menu

```css
/* Colors */
--settings-bg: #ffffff (light) / #1f2937 (dark)
--settings-text: #111827 (light) / #f3f4f6 (dark)
--settings-text-secondary: #6b7280 (light) / #9ca3af (dark)
--settings-border: #e5e7eb (light) / #374151 (dark)
--settings-primary: #667eea (primary color)
--settings-button-bg: #f5f5f5 (light) / #374151 (dark)
--settings-button-active: #667eea
--settings-button-active-text: #ffffff

/* Typography */
--settings-title-size: 18px
--settings-section-title-size: 12px
--settings-section-title-case: uppercase

/* Spacing */
--settings-modal-padding: 16px
--settings-button-height: 40px
--settings-button-border-radius: 6px
```

### Verifikationscheckliste

- [ ] Header: 18px, 600 weight
- [ ] Close button: 44x44px touch target
- [ ] Section titles: 12px, uppercase
- [ ] Theme buttons: 3x flex width, 40px height
- [ ] Separators: 1px, no margin
- [ ] All interactive elements >= 44px
- [ ] Dark mode tested
- [ ] Hover states: opacity 0.8 or color change
- [ ] Focus indicators: 2px outline, 2px offset

### Store Compliance - Support Links

Support-Links im Settings-Menü sind Standard-Praxis und gelten NICHT als "In-App-Werbung":
- "Contains Ads": ❌ NO
- "In-App Purchases": ❌ NO
- Settings Menu ist Teil der App-Funktion, nicht Werbung

---

## Interaktion & Feedback

### Loading States
- **Spinner:** Rotierendes Icon oder Skeleton-Screen
- **Duration:** Max. 3 Sekunden ohne Feedback (dann Nachrichten zeigen)
- **Text:** "Loading...", "Saving...", etc.
- **Disable:** Buttons/Inputs während Loading disablen

### Success/Error Messages
- **Toast Notifications:** Kurz, 3-5 Sekunden sichtbar
- **Types:** Success (grün), Error (rot), Warning (gelb), Info (blau)
- **Position:** Oben rechts (Desktop), Oben Mitte (Mobile)
- **Icon:** Visual Indicator (✓, ✕, ⚠, ℹ)

### Animations
- **Duration:** 200-300ms für Hover/Focus, 300-500ms für Page Transitions
- **Easing:** `ease-out` für Erscheinen, `ease-in` für Verschwinden
- **Reduzieren:** `prefers-reduced-motion: reduce` respektieren
- **Keine flashing:** Nichts sollte schneller als 3x pro Sekunde blinken

### Hover & Focus States
- **Hover:** Farb-Change, Schatten, oder Scale (max 1.05)
- **Focus:** Visible Focus Ring (nicht outline: none!)
- **Active:** Gedrückter Effekt oder Farb-Change
- **Feedback Time:** < 100ms (sollte sofort responsive wirken)

---

## Internationalisierung (i18n)

### Mehrsprachigkeit
- **Struktur:** Übersetze nur User-facing Text, nicht technische Labels
- **Format:** JSON oder YAML mit Namespace (z.B. `common.greeting`)
- **Default Language:** Dokumentiere Standardsprache
- **RTL Support:** Bedenke RTL Languages (z.B. Arabisch) für zukünftige Unterstützung

### Text Handling
- **Keying:** Nutze prägnante Keys, z.B. `button.save` statt `text1`
- **Variablen:** Nutze Placeholders für dynamische Werte: `Hello, {name}!`
- **Plural Forms:** Handle Singular/Plural (z.B. "1 message" vs "5 messages")
- **Dates/Numbers:** Nutze Locale-aware Formatierung

---

## Offline Indicators (für PWAs)

### Connection Status
- **Indicator:** Kleine Icon/Badge mit Status (online/offline)
- **Position:** Top-right oder Top-bar
- **Farben:** Grün (online), Grau (offline)
- **Message:** "You are offline - some features may be limited"
- **Auto-sync:** Zeige Status wenn Daten synched werden

---

## Empty States

- **Icon:** Relevantes Icon (z.B. leerer Ordner, keine Daten)
- **Title:** Kurz, z.B. "No tasks yet"
- **Description:** Eine Zeile, was der User tun kann
- **CTA:** Ein Primary Button für nächste Aktion (z.B. "Create first task")

---

## Performance Indicators

### Lighthouse Audit Targets
- **Performance:** 80+ (PWA), 90+ (andere Projekte)
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 90+

---

## Emoji-Richtlinien

**Wo emojis OK sind:**
- ✅ Settings Button selbst (⋮ für Menü-Icon)
- ✅ Dekoration/Branding in Dokumentation
- ✅ Fehlerberichte & Commit-Messages (für Entwickler)
- ✅ Loading/Success Messages (als Icon, nicht als Text)

**Wo emojis NICHT verwendet werden:**
- ❌ Navigations-Labels (statt 📅 "Calendar", statt 📋 "Agenda")
- ❌ Button-Labels (statt "🔁 Refresh" → "Refresh")
- ❌ Settings Menu Items (statt "📧 Feedback" → "Send Feedback")
- ❌ Menü-Einträge und Links
- ❌ Überschriften und Titel

**Rationale:**
- Emojis sind inkonsistent über Plattformen
- Schlechter Support auf älteren Geräten/Browsern
- Accessibility: Screen Reader lesen Emoji-Namen
- Professionelleres Erscheinungsbild

---

## Checkliste für neues Projekt

### Allgemein (Web & Mobile)
- [ ] Color Palette definiert (min. 5 Farben)
- [ ] Typography definiert (max. 2 Fonts)
- [ ] Spacing System definiert (8px Grid)
- [ ] Responsive Breakpoints definiert
- [ ] Dark Mode unterstützt (CSS Variables)
- [ ] Accessibility Checklist durchgegangen
- [ ] Keyboard Navigation getestet
- [ ] Screen Reader kompatibel
- [ ] Focus Rings sichtbar
- [ ] Touch Targets >= 44px × 44px
- [ ] Loading States implementiert
- [ ] Error States implementiert
- [ ] Empty States implementiert
- [ ] Lighthouse Audit >= 80 Points
- [ ] Settings Menu mit Feedback/Support/About Struktur
- [ ] Store Compliance überprüft

---

## Referenzen

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
