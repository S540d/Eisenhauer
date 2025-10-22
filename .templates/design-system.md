---
# Design System - Komponenten Katalog

Wiederverwendbare UI-Komponenten mit Standards für Design, Markup und Verhalten.

---

## Komponenten-Übersicht

Diese Seite dokumentiert reusable UI-Komponenten und deren Spezifikationen. Jede Komponente sollte konsistent implementiert werden.

---

## Button

### Typen

#### Primary Button
- **Verwendung:** Hauptaktionen (Save, Submit, Create)
- **Farbe:** Brand Color (z.B. Blau)
- **Hover:** Dunklere Variante oder Schatten
- **Disabled:** 50% Opacity

#### Secondary Button
- **Verwendung:** Sekundäraktionen (Cancel, More Options)
- **Farbe:** Grau Border mit transparentem Hintergrund
- **Hover:** Leichter Grau-Hintergrund
- **Disabled:** 50% Opacity

#### Danger Button
- **Verwendung:** Destruktive Aktionen (Delete, Remove)
- **Farbe:** Rot (#ef4444)
- **Hover:** Dunkelrot
- **Confirmation:** Dialog vorher zeigen

### Größen

```html
<!-- Small Button: 32px height -->
<button class="btn btn-sm">Small</button>

<!-- Medium Button (Default): 40px height -->
<button class="btn btn-md">Medium</button>

<!-- Large Button: 48px height -->
<button class="btn btn-lg">Large</button>
```

### Mit Icons

```html
<!-- Icon nur (muss aria-label haben) -->
<button class="btn btn-icon" aria-label="Settings">
  <svg><!-- icon --></svg>
</button>

<!-- Icon + Text -->
<button class="btn">
  <svg class="btn-icon"><!-- icon --></svg>
  <span>Save</span>
</button>
```

### States

```html
<!-- Default -->
<button class="btn">Click me</button>

<!-- Loading -->
<button class="btn is-loading" disabled>
  <span class="spinner"></span>
  <span>Loading...</span>
</button>

<!-- Disabled -->
<button class="btn" disabled>Disabled</button>
```

### CSS

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 40px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary */
.btn.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

/* Secondary */
.btn.btn-secondary {
  border-color: var(--color-border);
  color: var(--color-text);
}

/* Danger */
.btn.btn-danger {
  background-color: var(--color-danger);
  color: white;
}
```

---

## Input / Form Elements

### Text Input

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="user@example.com"
    required
  >
  <span class="error-message" id="email-error">
    Please enter a valid email
  </span>
</div>
```

### Textarea

```html
<div class="form-group">
  <label for="message">Message</label>
  <textarea
    id="message"
    name="message"
    rows="4"
    placeholder="Enter your message..."
  ></textarea>
</div>
```

### Select

```html
<div class="form-group">
  <label for="country">Country</label>
  <select id="country" name="country">
    <option>-- Select --</option>
    <option value="de">Germany</option>
    <option value="at">Austria</option>
  </select>
</div>
```

### Checkbox / Radio

```html
<!-- Checkbox -->
<div class="form-group">
  <label class="checkbox">
    <input type="checkbox" name="agree" required>
    <span>I agree to the terms</span>
  </label>
</div>

<!-- Radio Group -->
<fieldset class="form-group">
  <legend>Choose one:</legend>
  <label class="radio">
    <input type="radio" name="option" value="1">
    <span>Option 1</span>
  </label>
  <label class="radio">
    <input type="radio" name="option" value="2">
    <span>Option 2</span>
  </label>
</fieldset>
```

### CSS

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

label {
  font-weight: 500;
  font-size: 0.875rem;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
textarea,
select {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 200ms ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input:disabled,
textarea:disabled,
select:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
}

/* Error State */
input.is-error,
textarea.is-error {
  border-color: var(--color-danger);
}

.error-message {
  color: var(--color-danger);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Checkbox / Radio */
.checkbox,
.radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox input[type="checkbox"],
.radio input[type="radio"] {
  cursor: pointer;
}
```

---

## Card

### Basic Card

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### Card with Image

```html
<div class="card">
  <img src="image.jpg" alt="Card image">
  <div class="card-body">
    <h3>Title</h3>
    <p>Content</p>
  </div>
</div>
```

### Card with Footer

```html
<div class="card">
  <div class="card-header">
    <h3>Title</h3>
  </div>
  <div class="card-body">
    <p>Content</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

### CSS

```css
.card {
  background-color: var(--color-bg-primary);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.card img {
  width: 100%;
  height: auto;
  display: block;
}
```

---

## Modal / Dialog

### Basic Modal

```html
<div class="modal-backdrop" id="modal">
  <dialog class="modal" open>
    <div class="modal-header">
      <h2>Modal Title</h2>
      <button class="modal-close" aria-label="Close">
        ✕
      </button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </dialog>
</div>
```

### CSS

```css
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background-color: var(--color-bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: none;
  animation: slideUp 300ms ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
```

---

## Tabs

### HTML

```html
<div class="tabs">
  <div class="tabs-header" role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">
      Tab 1
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel-2">
      Tab 2
    </button>
  </div>

  <div class="tabs-content">
    <div role="tabpanel" id="panel-1">
      Content 1
    </div>
    <div role="tabpanel" id="panel-2" hidden>
      Content 2
    </div>
  </div>
</div>
```

### CSS

```css
.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  gap: 0;
}

.tabs-header button {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 1rem;
  cursor: pointer;
  transition: all 200ms ease;
  font-weight: 500;
}

.tabs-header button:hover {
  color: var(--color-primary);
}

.tabs-header button[aria-selected="true"] {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tabs-content {
  padding: 1.5rem;
}
```

---

## Alert / Toast

### Toast Notification

```html
<div class="toast toast-success" role="alert">
  <span class="toast-icon">✓</span>
  <span>Successfully saved!</span>
  <button class="toast-close" aria-label="Close">✕</button>
</div>
```

### Types

```html
<!-- Success -->
<div class="toast toast-success">✓ Success message</div>

<!-- Error -->
<div class="toast toast-error">✕ Error message</div>

<!-- Warning -->
<div class="toast toast-warning">⚠ Warning message</div>

<!-- Info -->
<div class="toast toast-info">ℹ Info message</div>
```

### CSS

```css
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: 400px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 300ms ease-out;
  z-index: 2000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-success {
  border-left: 4px solid var(--color-success);
  color: var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-danger);
  color: var(--color-danger);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
  color: var(--color-warning);
}

.toast-info {
  border-left: 4px solid var(--color-info);
  color: var(--color-info);
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}
```

---

## Spinner / Loading

### Spinner

```html
<div class="spinner"></div>
```

### Button mit Loading State

```html
<button class="btn is-loading">
  <span class="spinner"></span>
  <span>Loading...</span>
</button>
```

### CSS

```css
.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn.is-loading {
  pointer-events: none;
}

.btn.is-loading span:last-child {
  opacity: 0.7;
}
```

---

## Badge

### Badge Types

```html
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### CSS

```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}
```

---

## Checkliste für Komponenten

- [ ] Semantisches HTML (button, form, etc.)
- [ ] Keyboard Navigation (Tab, Enter, Escape)
- [ ] Focus Styles sichtbar
- [ ] ARIA Labels wo nötig
- [ ] Loading States
- [ ] Disabled States
- [ ] Error States
- [ ] Touch-freundliche Größen (min. 44px)
- [ ] Mobile & Desktop responsive
- [ ] Dark Mode kompatibel
- [ ] Dokumentiert mit Beispielen

---
