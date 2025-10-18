# Lastenheft: Drag & Drop Neuimplementierung
**Projekt:** Eisenhauer Matrix Task Manager
**Version:** 2.0
**Datum:** 16. Oktober 2025
**Branch:** testing
**Status:** Anforderungsspezifikation

---

## 1. Ausgangslage & Problemstellung

### 1.1 Aktueller Zustand
Die bestehende Drag & Drop Implementierung ([drag-drop.js:1-254](js/modules/drag-drop.js)) weist seit Wochen anhaltende Probleme auf:

- **Unzuverlässiges Verhalten** auf mobilen Geräten
- **Konflikte zwischen verschiedenen Touch-Events** (Drag vs. Text-Markierung vs. Pull-to-Refresh)
- **Inkonsistente Datenpersistierung** (kürzlich teilweise behoben)
- **Komplexe Callback-Ketten** erschweren Wartung und Debugging
- **Fehlende Fehlerbehandlung** bei fehlgeschlagenen Drag-Operationen
- **Problematisches State-Management** mit globalen Variablen

### 1.2 Bisherige Architektur
```javascript
// Aktuelle Implementierung
- Desktop: HTML5 Drag & Drop API (dragstart, dragover, drop)
- Mobile: Custom Touch Events (touchstart, touchmove, touchend)
- State: Globale Variable draggedElement
- Persistence: Callback-basiert → Firebase/IndexedDB
- Feedback: CSS-Klassen + opacity changes
```

**Kernprobleme:**
1. Zwei separate Code-Paths (Desktop/Mobile) → doppelte Komplexität
2. Keine einheitliche Event-Behandlung
3. Fehlende Offline-Queue für Firestore-Sync
4. Kein Error-Recovery bei fehlgeschlagenen Moves

### 1.3 Ziel der Neuimplementierung
Vollständiger Neuaufbau des Drag & Drop Systems mit Fokus auf:
- **Zuverlässigkeit** auf allen Geräten
- **Einheitliche Architektur** für Desktop und Mobile
- **Robuste Offline-Unterstützung** mit automatischer Synchronisation
- **Klare Fehlerbehandlung** und Nutzer-Feedback
- **Wartbare Code-Struktur** ohne Callback-Hell

---

## 2. Funktionale Anforderungen

### 2.1 Mobile Drag & Drop (Priorität: KRITISCH)

#### 2.1.1 Touch-basiertes Dragging
**Anforderung:** Einfaches, intuitives Drag & Drop auf Smartphones/Tablets

**Spezifikation:**
- **Long Press (300ms)** aktiviert Drag-Modus
  - Verhindert Konflikt mit Tap-to-Toggle und Scrollen
  - Haptisches Feedback via `navigator.vibrate(50)` (falls verfügbar)
  - Visuelles Feedback: Element hebt sich vom Hintergrund ab

- **Während des Drags:**
  - Touch-Move verfolgt Fingerposition
  - Visueller Clone folgt dem Finger (absolut positioniert)
  - Original-Element wird transparent (opacity: 0.3)
  - Drop-Zonen werden hervorgehoben (Border + Background-Color)

- **Drop-Erkennung:**
  - `document.elementsFromPoint(x, y)` identifiziert Drop-Target
  - Nur gültige Segment-Zonen erlaubt (keine anderen Elemente)
  - Invalid Drop → Element kehrt visuell zurück (Animation)

**Technische Umsetzung:**
```javascript
// Neue Event-Strategie
touchstart → Starte Timer (300ms)
  ↓
touchmove → Cancel Timer wenn Scroll erkannt
  ↓
300ms Timer abgelaufen → Aktiviere Drag-Modus
  ↓
touchmove → Update Clone-Position + Highlight Drop-Zone
  ↓
touchend → Execute Drop oder Revert
```

#### 2.1.2 Deaktivierung störender Browser-Features
**Anforderung:** Keine Interferenz mit nativen Browser-Funktionen

**Spezifikation:**
- **Text-Markierung deaktivieren:**
  ```css
  .task-item {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  ```

- **Pull-to-Refresh verhindern:**
  ```css
  body {
    overscroll-behavior-y: contain;
  }
  ```
  ```javascript
  // Zusätzlich im Drag-Modus
  document.body.style.overflow = 'hidden';
  ```

- **Context-Menu unterdrücken (iOS):**
  ```javascript
  element.addEventListener('contextmenu', e => e.preventDefault());
  ```

#### 2.1.3 Swipe-to-Delete Integration
**Anforderung:** Horizontal-Swipe zum Löschen bleibt erhalten

**Spezifikation:**
- **Swipe Left (> 100px)** → Lösch-Aktion
- **Vertical Drag** → Move-Aktion
- **Intelligente Richtungserkennung:**
  ```javascript
  if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 20) {
    // Vertical → Drag Mode
  } else if (diffX < -50) {
    // Horizontal Left → Delete Mode
  }
  ```

**Wichtig:** Beide Modi dürfen sich nicht gegenseitig blockieren!

---

### 2.2 Desktop Drag & Drop (Priorität: HOCH)

#### 2.2.1 HTML5 Drag & Drop API
**Anforderung:** Native Desktop-Experience mit Maus/Trackpad

**Spezifikation:**
- Standard HTML5 `draggable="true"` Attribute
- Event-Handler:
  - `dragstart` → Setze `dataTransfer` und visuelles Feedback
  - `dragover` → Erlaube Drop (`e.preventDefault()`)
  - `dragenter` / `dragleave` → Highlight Drop-Zone
  - `drop` → Execute Move
  - `dragend` → Cleanup

**Verbesserungen gegenüber aktueller Implementation:**
- **Custom Drag Image:**
  ```javascript
  e.dataTransfer.setDragImage(customDragPreview, offsetX, offsetY);
  ```

- **Drop-Effekt Visualisierung:**
  ```javascript
  e.dataTransfer.dropEffect = 'move';
  ```

- **Drag-Data sauber strukturieren:**
  ```javascript
  e.dataTransfer.setData('application/json', JSON.stringify({
    taskId: task.id,
    fromSegment: task.segment,
    timestamp: Date.now()
  }));
  ```

#### 2.2.2 Keyboard-Unterstützung
**Anforderung:** Barrierefreiheit für Tastatur-Navigation

**Spezifikation:**
- **Tab** navigiert durch Tasks
- **Space** wählt Task aus (fokussiert)
- **Pfeiltasten** bewegen fokussierten Task zwischen Segmenten
- **Enter** bestätigt Move
- **Escape** bricht ab

---

### 2.3 Visuelles Feedback (Priorität: KRITISCH)

#### 2.3.1 Während des Drags
**Anforderung:** Klare visuelle Rückmeldung über Drag-Status

**Spezifikation:**

1. **Drag-Element (Original):**
   - Opacity: 0.3 (ausgegraut)
   - Position bleibt im Layout erhalten
   - Optional: Gestrichelte Border

2. **Drag-Clone (folgt Cursor/Finger):**
   - Position: `fixed`
   - Z-Index: 9999 (über allem)
   - Transform: `scale(1.05)` (leicht vergrößert)
   - Box-Shadow: `0 8px 16px rgba(0,0,0,0.3)` (schwebt)
   - Opacity: 0.9
   - Rotation: `rotate(2deg)` (subtil)

3. **Drop-Zonen (Task-Listen):**
   - **Valide Zone (Hover):**
     ```css
     .task-list.drag-over {
       border: 2px dashed var(--segment-color);
       background: rgba(var(--segment-color-rgb), 0.1);
       transform: scale(1.02);
       transition: all 0.2s ease;
     }
     ```

   - **Invalide Zone:**
     ```css
     .task-list.drag-invalid {
       border: 2px dashed #e74c3c;
       background: rgba(231, 76, 60, 0.05);
     }
     ```

4. **Cursor-Änderungen (Desktop):**
   - Drag-Start: `cursor: grabbing`
   - Über Drop-Zone: `cursor: move`
   - Über invalider Zone: `cursor: not-allowed`

#### 2.3.2 Nach dem Drop
**Anforderung:** Feedback über Erfolg/Fehler der Operation

**Spezifikation:**

1. **Erfolgreiche Move:**
   - Task fliegt animiert zur neuen Position
   - Neue Position blinkt kurz auf (highlight)
   ```css
   @keyframes task-moved {
     0% { background: var(--segment-color); }
     100% { background: transparent; }
   }
   ```

2. **Fehlgeschlagener Move:**
   - Task kehrt animiert zurück (spring animation)
   - Toast-Notification: "Move fehlgeschlagen. Erneut versuchen?"
   - Retry-Button in Notification

3. **Offline-Move:**
   - Task bewegt sich visuell
   - Badge zeigt "Offline" Status
   - Icon: Cloud mit Slash
   - Tooltip: "Wird synchronisiert sobald online"

---

### 2.4 Datenpersistierung (Priorität: KRITISCH)

#### 2.4.1 Firebase Firestore (Authenticated Users)
**Anforderung:** Zuverlässige Cloud-Synchronisation

**Spezifikation:**

**Aktuelles Problem (gelöst, aber Architektur-Review nötig):**
```javascript
// ALT (buggy):
updateTaskInFirestore(task, userId, db, firebase) {
  db.collection('users').doc(userId).collection('tasks')
    .doc(task.id).update(updateData); // ❌ Fails wenn Dokument nicht existiert
}

// NEU (temporary fix):
updateTaskInFirestore(task, userId, db, firebase) {
  db.collection('users').doc(userId).collection('tasks')
    .doc(task.id).set(updateData, { merge: true }); // ✅ Upsert
}
```

**Neue Anforderung - Optimistic UI Updates:**
```javascript
async function moveTask(taskId, fromSegment, toSegment) {
  // 1. Optimistic Update (UI sofort ändern)
  const task = tasks[fromSegment].find(t => t.id === taskId);
  tasks[fromSegment] = tasks[fromSegment].filter(t => t.id !== taskId);
  task.segment = toSegment;
  tasks[toSegment].push(task);
  renderTasks(); // Sofortiges UI-Update

  // 2. Persistence (async)
  try {
    await updateTaskInFirestore(task, userId, db, window.firebase);
  } catch (error) {
    // 3. Rollback bei Fehler
    revertMove(task, toSegment, fromSegment);
    showError('Move fehlgeschlagen', error);
  }
}
```

**Firestore Offline Persistence aktivieren:**
```javascript
firebase.firestore().enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open');
    } else if (err.code == 'unimplemented') {
      console.warn('Browser not supported');
    }
  });
```

#### 2.4.2 IndexedDB (Guest Mode)
**Anforderung:** Lokale Speicherung für Gäste

**Spezifikation:**
- Beibehaltung der aktuellen LocalForage-Implementation
- Zusätzlich: Versioning für Daten-Migration
  ```javascript
  const SCHEMA_VERSION = 2;
  await localforage.setItem('schema_version', SCHEMA_VERSION);
  ```

#### 2.4.3 Offline-Queue System
**Anforderung:** Änderungen offline speichern und später synchronisieren

**Neue Implementation nötig:**

**Datenstruktur:**
```javascript
// IndexedDB Store: 'pendingActions'
{
  id: uuid(),
  action: 'MOVE_TASK',
  payload: {
    taskId: '123',
    fromSegment: 1,
    toSegment: 2,
    timestamp: 1697461234567
  },
  status: 'pending', // pending, syncing, failed
  retryCount: 0,
  createdAt: Date,
  lastAttempt: Date
}
```

**Sync-Logik:**
```javascript
// Bei Online-Wiederkehr
window.addEventListener('online', async () => {
  const queue = await getOfflineQueue();
  for (const action of queue) {
    try {
      await executeAction(action);
      await removeFromQueue(action.id);
    } catch (error) {
      action.retryCount++;
      if (action.retryCount > 3) {
        action.status = 'failed';
        await updateQueueItem(action);
        notifyUser('Synchronisation fehlgeschlagen', action);
      }
    }
  }
});
```

**UI-Indikator:**
```javascript
// Badge auf Task anzeigen
<div class="task-item" data-sync-status="pending">
  <span class="sync-badge">⏳</span>
  Task text...
</div>
```

---

### 2.5 Offline-Nutzung (Priorität: HOCH)

#### 2.5.1 Service Worker Enhancement
**Anforderung:** Vollständige App-Funktionalität offline

**Aktuelle Implementation:** [service-worker.js:1-3300](service-worker.js) (Basic caching)

**Erweiterungen:**
```javascript
// Strategie für API-Calls
self.addEventListener('fetch', event => {
  if (event.request.url.includes('firestore.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Queue action for later
        return new Response(JSON.stringify({ offline: true }));
      })
    );
  }
});
```

#### 2.5.2 Network Status Detection
**Anforderung:** App erkennt Offline/Online Status

**Spezifikation:**
```javascript
// Persistentes Status-Display
<div class="network-status" data-status="online">
  <span class="status-icon">🌐</span>
  <span class="status-text">Online</span>
</div>

window.addEventListener('offline', () => {
  document.querySelector('.network-status').dataset.status = 'offline';
  showNotification('Offline-Modus aktiviert');
});
```

#### 2.5.3 Konfliktauflösung
**Anforderung:** Umgang mit Merge-Konflikten bei Offline-Änderungen

**Spezifikation:**
- **Last Write Wins (Standard):** Neueste Änderung gewinnt
- **Timestamp-basiert:** Firestore `serverTimestamp()` als Quelle
- **User Notification bei Konflikt:**
  ```
  "Achtung: Diese Task wurde auf einem anderen Gerät geändert.
   Welche Version möchten Sie behalten?"
   [Lokale Version] [Server Version] [Abbrechen]
  ```

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Performance
- **Drag-Start Latenz:** < 100ms (vom Touch bis visuelles Feedback)
- **Frame-Rate während Drag:** 60 FPS (kein Ruckeln)
- **Drop-Verarbeitung:** < 200ms (vom Drop bis UI-Update)
- **Firestore Write:** < 500ms (Optimistic UI macht dies transparent)

### 3.2 Kompatibilität
- **Mobile:** iOS Safari 14+, Chrome Android 90+
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Touch Devices:** iPad, Android Tablets, Touch-Laptops

### 3.3 Barrierefreiheit (WCAG 2.1 Level AA)
- Keyboard-Navigation (siehe 2.2.2)
- Screen-Reader Announcements:
  ```html
  <div role="status" aria-live="polite" aria-atomic="true">
    Task "Einkaufen" wurde von "Wichtig & Dringend" nach "Wichtig & Nicht-dringend" verschoben
  </div>
  ```
- Focus-Indikatoren (sichtbar)
- Farbkontrast mindestens 4.5:1

### 3.4 Sicherheit
- **XSS Prevention:** Alle Task-Texte via `textContent` rendern (bereits implementiert)
- **Input Sanitization:** Auch in Drag-Data
- **Firestore Security Rules:** Prüfen auf User-Ownership
  ```javascript
  match /users/{userId}/tasks/{taskId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

---

## 4. Code-Refactoring Maßnahmen

### 4.1 Architektur-Überarbeitung

#### 4.1.1 Einheitliche Drag-Abstraktion
**Problem:** Aktuell zwei getrennte Code-Paths (Desktop/Mobile)

**Lösung:** Abstraction Layer

**Neue Datei:** `js/modules/drag-manager.js`
```javascript
export class DragManager {
  constructor(options) {
    this.onDragStart = options.onDragStart;
    this.onDragMove = options.onDragMove;
    this.onDragEnd = options.onDragEnd;
    this.element = options.element;

    this.#setupEventListeners();
  }

  #setupEventListeners() {
    if (this.#isTouchDevice()) {
      this.#setupTouchEvents();
    } else {
      this.#setupMouseEvents();
    }
  }

  #setupTouchEvents() {
    // Touch-basiertes Dragging
    this.element.addEventListener('touchstart', this.#handleTouchStart.bind(this));
    this.element.addEventListener('touchmove', this.#handleTouchMove.bind(this));
    this.element.addEventListener('touchend', this.#handleTouchEnd.bind(this));
  }

  #setupMouseEvents() {
    // HTML5 Drag & Drop
    this.element.draggable = true;
    this.element.addEventListener('dragstart', this.#handleDragStart.bind(this));
    this.element.addEventListener('drag', this.#handleDrag.bind(this));
    this.element.addEventListener('dragend', this.#handleDragEnd.bind(this));
  }

  // Einheitliche interne API
  #notifyDragStart(data) {
    this.onDragStart?.(data);
  }

  // ... weitere Methoden
}
```

**Verwendung:**
```javascript
// In ui.js beim Erstellen von Task-Elementen
new DragManager({
  element: taskElement,
  onDragStart: (data) => handleDragStart(data),
  onDragMove: (data) => handleDragMove(data),
  onDragEnd: (data) => handleDragEnd(data)
});
```

#### 4.1.2 State Management vereinheitlichen
**Problem:** State verteilt über mehrere Module (script.js, tasks.js)

**Lösung:** Zentraler State Store

**Neue Datei:** `js/modules/store.js`
```javascript
class Store {
  constructor() {
    this.state = {
      currentUser: null,
      db: null,
      isGuestMode: true,
      tasks: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      language: 'de',
      theme: 'system',
      networkStatus: 'online',
      syncQueue: []
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.#notifyListeners(prevState, this.state);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  #notifyListeners(prevState, newState) {
    this.listeners.forEach(listener => listener(newState, prevState));
  }
}

export const store = new Store();
```

**Migration von bestehenden globalen Variablen:**
```javascript
// ALT (script.js):
let currentUser = null;
let db = null;
let isGuestMode = false;

// NEU:
import { store } from './modules/store.js';

// Lesen:
const { currentUser, db, isGuestMode } = store.getState();

// Schreiben:
store.setState({ currentUser: user, isGuestMode: false });

// Auf Änderungen reagieren:
store.subscribe((newState, prevState) => {
  if (newState.tasks !== prevState.tasks) {
    renderTasks();
  }
});
```

#### 4.1.3 Offline-Queue als separates Modul
**Problem:** Keine strukturierte Offline-Unterstützung

**Neue Datei:** `js/modules/offline-queue.js`
```javascript
import localforage from 'localforage';

const queueStore = localforage.createInstance({
  name: 'eisenhauer',
  storeName: 'sync_queue'
});

export class OfflineQueue {
  static async enqueue(action) {
    const id = crypto.randomUUID();
    const queueItem = {
      id,
      action: action.type,
      payload: action.payload,
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      lastAttempt: null
    };

    await queueStore.setItem(id, queueItem);
    return id;
  }

  static async dequeue(id) {
    await queueStore.removeItem(id);
  }

  static async getAll() {
    const items = [];
    await queueStore.iterate((value) => {
      items.push(value);
    });
    return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  static async processQueue(executor) {
    const queue = await this.getAll();

    for (const item of queue) {
      try {
        await executor(item);
        await this.dequeue(item.id);
      } catch (error) {
        item.retryCount++;
        item.lastAttempt = new Date().toISOString();

        if (item.retryCount > 3) {
          item.status = 'failed';
        }

        await queueStore.setItem(item.id, item);
      }
    }
  }
}
```

**Integration:**
```javascript
// In storage.js
export async function moveTaskWithOfflineSupport(taskId, fromSegment, toSegment, userId, db) {
  // Optimistic UI update
  const task = moveTask(taskId, fromSegment, toSegment);

  if (navigator.onLine) {
    try {
      await updateTaskInFirestore(task, userId, db, window.firebase);
    } catch (error) {
      // Enqueue for later
      await OfflineQueue.enqueue({
        type: 'MOVE_TASK',
        payload: { taskId, fromSegment, toSegment, userId }
      });
    }
  } else {
    // Offline: Sofort in Queue
    await OfflineQueue.enqueue({
      type: 'MOVE_TASK',
      payload: { taskId, fromSegment, toSegment, userId }
    });
  }
}
```

### 4.2 Error Handling
**Problem:** Keine strukturierte Fehlerbehandlung

**Lösung:** Error Boundary Pattern

**Neue Datei:** `js/modules/error-handler.js`
```javascript
export class DragDropError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'DragDropError';
    this.code = code;
    this.details = details;
  }
}

export function handleDragError(error, context) {
  console.error('[Drag&Drop Error]', error, context);

  // Rollback UI changes
  if (context.rollback) {
    context.rollback();
  }

  // User notification
  showToast({
    type: 'error',
    message: error.message,
    actions: [
      { label: 'Erneut versuchen', onClick: context.retry },
      { label: 'Schließen', onClick: null }
    ]
  });

  // Optional: Send to error tracking (Sentry, etc.)
  if (window.errorTracker) {
    window.errorTracker.captureException(error, { context });
  }
}
```

### 4.3 Testing-Infrastruktur
**Problem:** Keine automatisierten Tests

**Lösung:** Test-Setup einrichten

**Neue Dateien:**
```
tests/
├── unit/
│   ├── drag-manager.test.js
│   ├── offline-queue.test.js
│   └── store.test.js
├── integration/
│   ├── drag-drop-flow.test.js
│   └── offline-sync.test.js
└── e2e/
    └── full-user-journey.test.js
```

**package.json Dependencies:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/dom": "^9.3.0",
    "happy-dom": "^12.0.0",
    "playwright": "^1.40.0"
  },
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

**Beispiel Unit Test:**
```javascript
// tests/unit/drag-manager.test.js
import { describe, it, expect, vi } from 'vitest';
import { DragManager } from '../../js/modules/drag-manager.js';

describe('DragManager', () => {
  it('should trigger onDragStart callback on touch start after 300ms', async () => {
    const onDragStart = vi.fn();
    const element = document.createElement('div');

    const manager = new DragManager({
      element,
      onDragStart
    });

    // Simulate touch start
    element.dispatchEvent(new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    }));

    // Wait for long press timer
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(onDragStart).toHaveBeenCalled();
  });
});
```

### 4.4 Code-Organisation
**Aktuell:** 7 Module + script.js (Orchestrator)

**Neue Struktur:**
```
js/
├── modules/
│   ├── config.js              (✅ Beibehalten)
│   ├── version.js             (✅ Beibehalten)
│   ├── translations.js        (✅ Beibehalten)
│   ├── store.js               (🆕 Zentrales State Management)
│   ├── tasks.js               (✏️ Refactored - nur Daten-Logik)
│   ├── storage.js             (✏️ Refactored - mit Offline-Queue)
│   ├── ui.js                  (✏️ Refactored - weniger Callbacks)
│   ├── drag-manager.js        (🆕 Einheitliche Drag-Abstraktion)
│   ├── offline-queue.js       (🆕 Sync-Queue Management)
│   ├── error-handler.js       (🆕 Error Handling)
│   └── notifications.js       (🆕 Toast/Snackbar System)
├── utils/
│   ├── dom.js                 (🆕 DOM Helper Functions)
│   ├── animation.js           (🆕 Animation Utilities)
│   └── device.js              (🆕 Device Detection)
└── script.js                  (✏️ Stark reduziert - nur Bootstrap)
```

**Vorher/Nachher LOC (Lines of Code):**
| Modul | Vorher | Nachher (geschätzt) |
|-------|--------|---------------------|
| drag-drop.js | 254 | ❌ Gelöscht |
| drag-manager.js | - | 300 (neu) |
| offline-queue.js | - | 150 (neu) |
| store.js | - | 120 (neu) |
| script.js | 391 | ~200 (reduziert) |
| storage.js | 395 | ~450 (erweitert) |
| ui.js | 525 | ~480 (vereinfacht) |
| **Gesamt** | **2231** | **~2400** |

**Begründung:** Leichter Anstieg der Gesamt-LOC, aber:
- Bessere Separation of Concerns
- Einfacheres Testing
- Weniger Callback-Hell
- Wartbarer und erweiterbarer

---

## 5. Implementierungsplan

### Phase 1: Grundlagen (Woche 1)
**Ziel:** Neue Architektur aufsetzen

**Tasks:**
- [ ] Store-Modul erstellen (`store.js`)
- [ ] Offline-Queue implementieren (`offline-queue.js`)
- [ ] Error-Handler einrichten (`error-handler.js`)
- [ ] Notification-System bauen (`notifications.js`)
- [ ] Test-Setup konfigurieren (Vitest + Playwright)

**Deliverable:** Neue Module funktionieren isoliert (Unit-Tests grün)

---

### Phase 2: Drag-Manager (Woche 2)
**Ziel:** Einheitliche Drag&Drop-Abstraktion

**Tasks:**
- [ ] DragManager-Klasse implementieren
  - [ ] Touch-Event-Handler
  - [ ] Mouse-Event-Handler
  - [ ] Einheitliche Callback-API
- [ ] Visuelle Feedback-Logik
  - [ ] Clone-Element-Erstellung
  - [ ] Drop-Zone-Highlighting
  - [ ] Cursor-Styles
- [ ] Richtungserkennung (Vertical Drag vs. Horizontal Swipe)
- [ ] Long-Press-Detection (300ms Timer)

**Deliverable:** DragManager funktioniert standalone (Demo-Page)

---

### Phase 3: Integration (Woche 3)
**Ziel:** Drag-Manager in bestehende App einbinden

**Tasks:**
- [ ] `script.js` refactoren (Store verwenden)
- [ ] `tasks.js` refactoren (nur Daten-Logik)
- [ ] `ui.js` refactoren (DragManager verwenden)
- [ ] `storage.js` erweitern (Offline-Queue)
- [ ] Alte `drag-drop.js` entfernen
- [ ] Callback-Hell auflösen

**Deliverable:** App funktioniert mit neuem System (manuelles Testing)

---

### Phase 4: Offline-Support (Woche 4)
**Ziel:** Robuste Offline-Nutzung

**Tasks:**
- [ ] Service Worker erweitern
- [ ] Network-Status-Detektion
- [ ] Sync-Queue UI-Indikatoren
- [ ] Firestore Offline Persistence aktivieren
- [ ] Konfliktauflösung implementieren

**Deliverable:** App funktioniert vollständig offline

---

### Phase 5: Testing & Polish (Woche 5)
**Ziel:** Qualitätssicherung

**Tasks:**
- [ ] Unit-Tests für alle neuen Module
- [ ] Integration-Tests für Drag-Flow
- [ ] E2E-Tests (Playwright)
  - [ ] Mobile Drag & Drop
  - [ ] Desktop Drag & Drop
  - [ ] Offline-Sync-Workflow
- [ ] Performance-Optimierung (60 FPS)
- [ ] Accessibility-Audit (WCAG 2.1 AA)
- [ ] Cross-Browser-Testing

**Deliverable:** Alle Tests grün, Performance-Ziele erreicht

---

### Phase 6: Deployment (Woche 6)
**Ziel:** Rollout auf Testing-Branch

**Tasks:**
- [ ] Dokumentation aktualisieren
- [ ] CHANGELOG.md erstellen
- [ ] Migration-Guide schreiben
- [ ] Feature-Flags einbauen (schrittweises Rollout)
- [ ] Deployment auf `testing` Branch
- [ ] Beta-Testing mit Nutzern
- [ ] Bugfixes aus Feedback
- [ ] Merge in `main` Branch

**Deliverable:** Produktionsreifes Release

---

## 6. Risiken & Mitigation

### Risiko 1: Breaking Changes
**Beschreibung:** Neue Architektur könnte bestehende Features brechen

**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch

**Mitigation:**
- Feature-Flags für schrittweises Rollout
- Umfangreiche Tests (Unit, Integration, E2E)
- Parallel-Betrieb von alter und neuer Implementation (Toggle)
- Beta-Testing auf `testing` Branch vor Merge

### Risiko 2: Performance-Regression
**Beschreibung:** Neue Abstraktion könnte Performance verschlechtern

**Wahrscheinlichkeit:** Niedrig
**Impact:** Mittel

**Mitigation:**
- Performance-Budgets definieren (< 100ms Drag-Start)
- Benchmarking vor/nach Refactoring
- Profiling mit Chrome DevTools
- Event-Debouncing/Throttling wo nötig

### Risiko 3: Mobile Browser Kompatibilität
**Beschreibung:** Touch-Events unterscheiden sich zwischen Browsern

**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch

**Mitigation:**
- Umfangreiches Testing auf realen Geräten (iOS Safari, Chrome Android)
- Fallback auf Pointer Events API (wo unterstützt)
- Polyfills für ältere Browser
- BrowserStack für automatisiertes Cross-Browser-Testing

### Risiko 4: Offline-Sync-Konflikte
**Beschreibung:** Mehrere Geräte offline → Merge-Konflikte

**Wahrscheinlichkeit:** Mittel
**Impact:** Mittel

**Mitigation:**
- Last-Write-Wins als Standard
- User-Notification bei erkannten Konflikten
- Firestore Server Timestamps als Single Source of Truth
- Konfliktauflösungs-UI (User wählt Version)

---

## 7. Erfolgsmetriken

### Technische Metriken
- **Drag-Start-Latenz:** < 100ms ✅
- **Frame-Rate:** 60 FPS während Drag ✅
- **Test-Coverage:** > 80% ✅
- **Bundle-Size:** Keine Erhöhung > 10% ✅

### Nutzerzentrierte Metriken
- **Fehlerrate Drag&Drop:** < 1% aller Drag-Operationen ✅
- **Offline-Sync-Erfolgsrate:** > 99% ✅
- **User-Reported Bugs:** < 5 im ersten Monat ✅
- **Subjektive Zufriedenheit:** User-Feedback-Score > 4/5 ✅

### Business-Metriken
- **Task-Anzahl pro User:** Keine Reduktion (stabiles Engagement) ✅
- **Session-Dauer:** Keine Reduktion ✅
- **Bounce-Rate:** Keine Erhöhung ✅

---

## 8. Anhang

### 8.1 Referenzen
- **Aktueller Code:** [drag-drop.js](js/modules/drag-drop.js)
- **Storage-Logik:** [storage.js](js/modules/storage.js)
- **Hauptorchestrierung:** [script.js](script.js)
- **Refactoring-Status:** [REFACTORING-STATUS.md](REFACTORING-STATUS.md)
- **Bekannte Issues:** [ISSUES.md](ISSUES.md)

### 8.2 Technologie-Stack
- **Frontend:** Vanilla JavaScript ES6+ (kein Framework)
- **Storage:** Firebase Firestore + IndexedDB (LocalForage)
- **Testing:** Vitest (Unit), Playwright (E2E)
- **Offline:** Service Worker + Offline-Queue
- **Build:** Kein Build-Step (native ES6 Modules)

### 8.3 Browser-Support-Matrix
| Browser | Version | Drag & Drop | Touch | Offline | Status |
|---------|---------|-------------|-------|---------|--------|
| Chrome Desktop | 90+ | ✅ | ➖ | ✅ | Unterstützt |
| Chrome Android | 90+ | ➖ | ✅ | ✅ | Unterstützt |
| Safari Desktop | 14+ | ✅ | ➖ | ✅ | Unterstützt |
| Safari iOS | 14+ | ➖ | ✅ | ⚠️ | Teilweise* |
| Firefox | 88+ | ✅ | ✅ | ✅ | Unterstützt |
| Edge | 90+ | ✅ | ✅ | ✅ | Unterstützt |

\*iOS Safari Service Worker hat Einschränkungen bei Offline-Persistence

### 8.4 Glossar
- **Optimistic UI:** UI-Update vor Server-Bestätigung (bessere UX)
- **Long Press:** Touch-Geste: 300ms halten aktiviert Drag-Modus
- **Drop Zone:** Valider Bereich zum Ablegen von Drag-Elementen
- **Offline Queue:** Lokale Warteschlange für nicht-synchronisierte Änderungen
- **Service Worker:** Background-Script für Offline-Funktionalität
- **LocalForage:** Wrapper um IndexedDB mit localStorage-Fallback

---

## 9. Freigabe & Nächste Schritte

### Freigabe
**Erstellt von:** Claude (AI Assistant)
**Review durch:** [Name des Entwicklers/Product Owners]
**Status:** ⏳ Zur Freigabe vorgelegt
**Datum:** 2025-10-16

### Nächste Schritte
1. **Review des Lastenhefts** durch Team
2. **Priorisierung anpassen** (falls nötig)
3. **Timeboxing überprüfen** (6 Wochen realistisch?)
4. **Ressourcen allokieren** (Solo-Dev oder Team?)
5. **Kick-Off Meeting** für Phase 1

---

## 10. PWA & Android-App Support

### 10.1 Aktueller Status
Die Eisenhauer-App ist bereits eine **voll funktionsfähige Progressive Web App (PWA)**:
- ✅ Web App Manifest ([manifest.json](manifest.json))
- ✅ Service Worker mit Offline-Support
- ✅ Installierbar auf Android/iOS/Desktop
- ✅ Standalone Display Mode (keine Browser-UI)

### 10.2 Android-App via Trusted Web Activity (TWA)

**Strategie:** Native Android-App ohne Code-Änderungen

**Vorteile für neue Drag & Drop Implementation:**
- Touch-Events funktionieren identisch wie in Chrome
- Keine separate Codebase für Android nötig
- Automatische Updates (PWA-Update = App-Update)
- Google Play Store Distribution möglich
- Alle Web-APIs verfügbar (IndexedDB, Firestore, Service Worker)

**Implementation:**

**Tool:** Bubblewrap CLI (by Google)
```bash
# Installation
npm install -g @bubblewrap/cli

# Projekt initialisieren
bubblewrap init --manifest https://your-domain.com/manifest.json

# Android APK bauen
bubblewrap build

# Lokales Testen
bubblewrap install
```

**Manifest-Erweiterungen für bessere App-Integration:**

```json
// manifest.json erweitern (nach Phase 6)
{
  "name": "Eisenhauer Matrix",
  "short_name": "Eisenhauer",
  "description": "Task Management nach der Eisenhauer-Matrix-Methode",
  "categories": ["productivity", "utilities"],

  // App Shortcuts (Android Home Screen)
  "shortcuts": [
    {
      "name": "Neue Aufgabe",
      "short_name": "Neu",
      "description": "Schnell eine neue Aufgabe hinzufügen",
      "url": "/?action=new-task",
      "icons": [{ "src": "icons/icon-192x192.png", "sizes": "192x192" }]
    },
    {
      "name": "Erledigte Aufgaben",
      "short_name": "Erledigt",
      "url": "/?view=done",
      "icons": [{ "src": "icons/icon-192x192.png", "sizes": "192x192" }]
    }
  ],

  // Share Target (Andere Apps können Tasks teilen)
  "share_target": {
    "action": "/",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text"
    }
  },

  // Screenshot für Play Store
  "screenshots": [
    {
      "src": "screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "platform": "wide"
    },
    {
      "src": "screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "platform": "narrow"
    }
  ]
}
```

**URL-Parameter-Handling:**
```javascript
// In script.js - Deep Link Support
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('action') === 'new-task') {
    // Öffne Add-Task-Dialog
    document.getElementById('taskInput').focus();
  } else if (params.get('view') === 'done') {
    // Scrolle zu "Erledigt"-Segment
    document.getElementById('segment-5').scrollIntoView();
  } else if (params.has('text')) {
    // Share Target - Text von anderer App
    const sharedText = params.get('text');
    document.getElementById('taskInput').value = sharedText;
  }
});
```

### 10.3 Android-spezifische Optimierungen

**Performance:**
```css
/* Touch-Delay reduzieren (Android Chrome) */
html {
  touch-action: manipulation;
}

/* Hardware-Beschleunigung für Drag-Clone */
.drag-clone {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

**Haptisches Feedback (Android-spezifisch):**
```javascript
// In drag-manager.js
#triggerHapticFeedback(intensity = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(intensity);
  }
}

// Bei Drag-Start
#handleTouchStart(e) {
  this.longPressTimer = setTimeout(() => {
    this.#triggerHapticFeedback(50); // Kurzer Vibrate
    this.#activateDragMode();
  }, 300);
}

// Bei erfolgreichem Drop
#handleDrop(e) {
  this.#triggerHapticFeedback([30, 10, 30]); // Doppel-Vibrate
}
```

**Status Bar Farbe (Android):**
```html
<!-- In index.html <head> -->
<meta name="theme-color" content="#667eea" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#4a5568" media="(prefers-color-scheme: dark)">
```

### 10.4 Play Store Deployment

**Anforderungen:**
1. Domain verifizieren (Google Search Console)
2. Digital Asset Links einrichten
3. App signieren (Keystore erstellen)
4. Store Listing vorbereiten
   - Screenshots (Telefon, Tablet)
   - Feature Graphic (1024x500)
   - App-Beschreibung
   - Privacy Policy

**Bubblewrap Play Store Config:**
```javascript
// twa-manifest.json (generiert von Bubblewrap)
{
  "packageId": "com.eisenhauer.matrix",
  "host": "your-domain.com",
  "name": "Eisenhauer Matrix",
  "launcherName": "Eisenhauer",
  "themeColor": "#667eea",
  "navigationColor": "#667eea",
  "backgroundColor": "#ffffff",
  "enableNotifications": true,
  "startUrl": "/",
  "iconUrl": "https://your-domain.com/icons/icon-512x512.png",
  "maskableIconUrl": "https://your-domain.com/icons/icon-maskable-512x512.png",
  "splashScreenFadeOutDuration": 300,
  "signingKey": {
    "path": "./android.keystore",
    "alias": "eisenhauer"
  },
  "appVersionName": "1.5.0",
  "appVersionCode": 15
}
```

**Keystore erstellen (einmalig):**
```bash
keytool -genkey -v -keystore android.keystore \
  -alias eisenhauer -keyalg RSA -keysize 2048 -validity 10000
```

**Digital Asset Links:**
```json
// In /.well-known/assetlinks.json (auf deinem Server)
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.eisenhauer.matrix",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

### 10.5 Testing-Strategie für Android

**Phase 1: Chrome DevTools Device Emulation**
- Test von Touch-Events in Chrome Desktop
- Verschiedene Screen-Größen
- Network Throttling für Offline-Test

**Phase 2: Chrome Remote Debugging**
```bash
# Android-Gerät via USB verbinden
# Chrome → chrome://inspect → Gerät auswählen
```

**Phase 3: TWA lokales Testing**
```bash
# APK installieren und testen
bubblewrap install
adb logcat | grep chromium
```

**Phase 4: Beta-Test (Google Play Internal Testing)**
- Interne Test-Gruppe erstellen
- APK hochladen
- Feedback sammeln

**Phase 5: Production Release**
- Staged Rollout (10% → 50% → 100%)
- Crash-Reporting via Play Console

### 10.6 Kompatibilität mit Drag & Drop Implementation

**Garantiert funktionierende Features:**
| Feature | PWA (Browser) | TWA (Android App) | Status |
|---------|---------------|-------------------|--------|
| Touch Drag | ✅ | ✅ | Identisch |
| Long Press (300ms) | ✅ | ✅ | Identisch |
| Haptic Feedback | ✅ | ✅ | `navigator.vibrate()` |
| IndexedDB | ✅ | ✅ | Volle Unterstützung |
| Firestore | ✅ | ✅ | Volle Unterstützung |
| Service Worker | ✅ | ✅ | Volle Unterstützung |
| Offline Queue | ✅ | ✅ | Identisch |
| Push Notifications | ✅ | ✅ | Via Firebase Cloud Messaging |

**Potenzielle Probleme (und Lösungen):**

1. **Pull-to-Refresh in TWA:**
   - **Problem:** Android hat system-weites Pull-to-Refresh
   - **Lösung:** Bereits im Lastenheft mit `overscroll-behavior-y: contain` ✅

2. **Status Bar Overlap:**
   - **Problem:** Android Status Bar kann UI überlagern
   - **Lösung:**
     ```css
     body {
       padding-top: env(safe-area-inset-top);
     }
     ```

3. **Keyboard-Verhalten:**
   - **Problem:** Android Keyboard kann Layout verschieben
   - **Lösung:**
     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1.0,
           viewport-fit=cover, interactive-widget=resizes-content">
     ```

### 10.7 Timeline-Integration mit Implementierungsplan

**Phase 6 erweitern (Deployment-Woche):**
- [ ] Manifest.json für TWA erweitern (Shortcuts, Share Target)
- [ ] Deep-Link-Handling implementieren (URL-Parameter)
- [ ] Android-spezifische Optimierungen (Haptic Feedback, Status Bar)
- [ ] Screenshots für Play Store erstellen
- [ ] Bubblewrap-Projekt initialisieren
- [ ] Keystore generieren und sichern
- [ ] TWA lokal testen (eigenes Android-Gerät)
- [ ] Digital Asset Links konfigurieren
- [ ] Play Store Listing vorbereiten
- [ ] Beta-Release über Google Play Internal Testing
- [ ] Feedback sammeln und Bugfixes
- [ ] Production Release (Staged Rollout)

**Zusätzliche Zeit:** +1 Woche für Android-App-Deployment = **7 Wochen total**

### 10.8 Langfristige Roadmap

**Nach erfolgreichem Android-Launch:**

1. **iOS App (Capacitor)** - Falls native Features gewünscht
   - Aktuell: iOS-User können PWA installieren (Home Screen)
   - Zukünftig: App Store Präsenz via Capacitor

2. **Desktop-App (Electron/Tauri)** - Falls gewünscht
   - macOS App Store
   - Windows Store
   - Linux AppImage

3. **Native Features erweitern:**
   - Kalender-Integration (Tasks als Kalender-Events)
   - Widget für Home Screen (Heute-Tasks)
   - Quick Actions (3D Touch / Long Press auf App-Icon)
   - Wear OS Integration (Smartwatch)

---

**Ende des Lastenhefts**
