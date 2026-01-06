# 🎯 Feature Implementation Patterns

Code-Beispiele und Implementation Patterns für häufig verwendete Features in allen Projekten.

## 📊 Metrik-Ansicht (Metrics/Statistics View)

### Übersicht

Die Metrik-Ansicht zeigt projekt-spezifische Statistiken und Nutzungsdaten an. Sie ist optional, aber empfohlen für Apps mit Daten-Management.

### UI-Platzierung

- **Toggle in Settings:** Zwischen Theme-Toggle und Export-Section
- **Anzeige:** Als separater Screen oder Modal
- **Navigation:** Über Toggle-Button in Settings

### React Native Implementation

#### Settings Menu Toggle

```typescript
import { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

const [showMetrics, setShowMetrics] = useState(false);

// Settings Menu
<View style={styles.settingsSection}>
  <View style={styles.settingRow}>
    <Text style={[styles.settingLabel, { color: colors.text }]}>
      Show Metrics
    </Text>
    <Switch
      value={showMetrics}
      onValueChange={setShowMetrics}
      trackColor={{ false: '#d1d5db', true: '#6200EE' }}
      thumbColor={showMetrics ? '#ffffff' : '#f4f3f4'}
    />
  </View>
</View>
```

#### Metrics Display Component

```typescript
interface MetricsData {
  totalItems: number;
  completedItems: number;
  averageValue: number;
  lastUpdated: string;
}

const MetricsView = ({ data }: { data: MetricsData }) => {
  return (
    <View style={styles.metricsContainer}>
      <Text style={[styles.metricsTitle, { color: colors.text }]}>
        📊 Statistiken
      </Text>

      <View style={styles.metricsCard}>
        <MetricItem
          label="Gesamt"
          value={data.totalItems.toString()}
          icon="📝"
        />
        <MetricItem
          label="Abgeschlossen"
          value={data.completedItems.toString()}
          icon="✓"
        />
        <MetricItem
          label="Durchschnitt"
          value={data.averageValue.toFixed(2)}
          icon="📈"
        />
      </View>

      <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
        Zuletzt aktualisiert: {new Date(data.lastUpdated).toLocaleDateString()}
      </Text>
    </View>
  );
};

const MetricItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <View style={styles.metricItem}>
    <Text style={styles.metricIcon}>{icon}</Text>
    <View>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  metricsContainer: {
    padding: 16,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  metricsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIcon: {
    fontSize: 32,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  settingsSection: {
    padding: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

### Vanilla JavaScript Implementation

```html
<!-- HTML Structure -->
<div class="settings-section">
  <label class="setting-row">
    <span class="setting-label">Show Metrics</span>
    <input type="checkbox" id="metricsToggle" class="toggle-switch">
  </label>
</div>

<div id="metricsView" class="metrics-view hidden">
  <h2 class="metrics-title">📊 Statistiken</h2>

  <div class="metrics-card">
    <div class="metric-item">
      <span class="metric-icon">📝</span>
      <div>
        <div class="metric-value" id="totalItems">0</div>
        <div class="metric-label">Gesamt</div>
      </div>
    </div>

    <div class="metric-item">
      <span class="metric-icon">✓</span>
      <div>
        <div class="metric-value" id="completedItems">0</div>
        <div class="metric-label">Abgeschlossen</div>
      </div>
    </div>

    <div class="metric-item">
      <span class="metric-icon">📈</span>
      <div>
        <div class="metric-value" id="averageValue">0.00</div>
        <div class="metric-label">Durchschnitt</div>
      </div>
    </div>
  </div>

  <p class="last-updated" id="lastUpdated">
    Zuletzt aktualisiert: -
  </p>
</div>
```

```javascript
// JavaScript Logic
const metricsToggle = document.getElementById('metricsToggle');
const metricsView = document.getElementById('metricsView');

metricsToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    metricsView.classList.remove('hidden');
    updateMetrics();
  } else {
    metricsView.classList.add('hidden');
  }
});

function updateMetrics() {
  const data = calculateMetrics(); // Your metrics calculation logic

  document.getElementById('totalItems').textContent = data.totalItems;
  document.getElementById('completedItems').textContent = data.completedItems;
  document.getElementById('averageValue').textContent = data.averageValue.toFixed(2);
  document.getElementById('lastUpdated').textContent =
    `Zuletzt aktualisiert: ${new Date().toLocaleDateString()}`;
}

function calculateMetrics() {
  // Example: Calculate from your app data
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  return {
    totalItems: tasks.length,
    completedItems: tasks.filter(t => t.completed).length,
    averageValue: tasks.reduce((sum, t) => sum + (t.value || 0), 0) / tasks.length || 0
  };
}
```

```css
/* CSS Styling */
.metrics-view {
  padding: 16px;
  animation: fadeIn 200ms ease-out;
}

.metrics-view.hidden {
  display: none;
}

.metrics-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

.metrics-card {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-icon {
  font-size: 32px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.metric-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.last-updated {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 12px;
  text-align: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Projekt-spezifische Metriken - Beispiele

#### 1x1 Trainer
```typescript
interface TrainerMetrics {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTime: number;
  accuracyRate: number;
}

const calculateTrainerMetrics = (history: GameHistory[]): TrainerMetrics => {
  const total = history.length;
  const correct = history.filter(h => h.correct).length;
  const wrong = total - correct;
  const avgTime = history.reduce((sum, h) => sum + h.time, 0) / total || 0;

  return {
    totalQuestions: total,
    correctAnswers: correct,
    wrongAnswers: wrong,
    averageTime: avgTime,
    accuracyRate: (correct / total * 100) || 0
  };
};
```

#### Pflanzkalender
```typescript
interface PlantMetrics {
  totalPlants: number;
  activitiesThisWeek: number;
  activitiesThisMonth: number;
  mostActivePlant: string;
  upcomingActivities: number;
}

const calculatePlantMetrics = (plants: Plant[]): PlantMetrics => {
  // Your calculation logic
  return {
    totalPlants: plants.length,
    activitiesThisWeek: getActivitiesInRange(plants, 7),
    activitiesThisMonth: getActivitiesInRange(plants, 30),
    mostActivePlant: getMostActivePlant(plants),
    upcomingActivities: getUpcomingActivities(plants)
  };
};
```

#### Energy Price Germany
```typescript
interface EnergyMetrics {
  currentPrice: number;
  averagePrice24h: number;
  lowestPrice24h: number;
  highestPrice24h: number;
  renewableShare: number;
}

const calculateEnergyMetrics = (data: EnergyData[]): EnergyMetrics => {
  const last24h = data.slice(-96); // Last 24h (96 x 15min)

  return {
    currentPrice: data[data.length - 1]?.marketprice || 0,
    averagePrice24h: average(last24h.map(d => d.marketprice)),
    lowestPrice24h: Math.min(...last24h.map(d => d.marketprice)),
    highestPrice24h: Math.max(...last24h.map(d => d.marketprice)),
    renewableShare: average(last24h.map(d => d.renewable_share || 0))
  };
};
```

---

## 💾 JSON-Export Funktionalität

### Übersicht

Ermöglicht Benutzern, ihre Daten als JSON-Datei zu exportieren. Wichtig für Datensicherung und Portabilität.

### React Native Implementation

```typescript
import { Share, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface ExportData {
  version: string;
  exportDate: string;
  data: any;
}

const handleExportData = async () => {
  try {
    // Prepare export data
    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        // Your app data
        tasks: tasks,
        settings: settings,
        // ...
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    if (Platform.OS === 'web') {
      // Web: Download as file
      downloadJSON(jsonString, `app-export-${Date.now()}.json`);
    } else {
      // Mobile: Use Share API
      await Share.share({
        message: jsonString,
        title: 'App Daten Export'
      });
    }

    Alert.alert('Export erfolgreich', 'Daten wurden exportiert');
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert('Export fehlgeschlagen', 'Fehler beim Exportieren der Daten');
  }
};

// Web-specific download function
const downloadJSON = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// UI Component
<TouchableOpacity
  style={[styles.exportButton, { backgroundColor: colors.primary }]}
  onPress={handleExportData}
>
  <Text style={styles.exportButtonText}>
    Export Data (JSON)
  </Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  exportButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### Vanilla JavaScript Implementation

```html
<!-- HTML Structure -->
<div class="settings-section">
  <button id="exportBtn" class="settings-link">
    Export Data (JSON)
  </button>
</div>
```

```javascript
// JavaScript Logic
const exportBtn = document.getElementById('exportBtn');

exportBtn.addEventListener('click', () => {
  // Gather data
  const exportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    data: {
      tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
      settings: JSON.parse(localStorage.getItem('settings') || '{}'),
      // ... other data
    }
  };

  // Convert to JSON
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `app-export-${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);

  // Show success message
  showToast('Export erfolgreich', 'success');
});

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

```css
/* CSS Styling */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--color-success);
  color: white;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 300ms ease;
  z-index: 10000;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success {
  background: #10b981;
}

.toast-error {
  background: #ef4444;
}
```

### Export Data Structure - Best Practices

#### Minimal Export (nur Daten)

```json
{
  "version": "1.0.0",
  "exportDate": "2025-01-15T12:34:56.789Z",
  "data": {
    "tasks": [...],
    "settings": {...}
  }
}
```

#### Comprehensive Export (mit Metadaten)

```json
{
  "version": "1.0.0",
  "exportDate": "2025-01-15T12:34:56.789Z",
  "appInfo": {
    "name": "1x1 Trainer",
    "platform": "android",
    "appVersion": "1.0.2"
  },
  "metadata": {
    "totalRecords": 150,
    "dataTypes": ["tasks", "settings", "history"],
    "exportFormat": "json"
  },
  "data": {
    "tasks": [...],
    "settings": {...},
    "history": [...]
  }
}
```

### Import Functionality (Optional)

```typescript
// React Native
import * as DocumentPicker from 'expo-document-picker';

const handleImportData = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      const fileContent = await FileSystem.readAsStringAsync(result.uri);
      const importData = JSON.parse(fileContent);

      // Validate data structure
      if (!importData.version || !importData.data) {
        throw new Error('Invalid data format');
      }

      // Import data
      await AsyncStorage.setItem('tasks', JSON.stringify(importData.data.tasks));
      await AsyncStorage.setItem('settings', JSON.stringify(importData.data.settings));

      Alert.alert('Import erfolgreich', 'Daten wurden importiert');
    }
  } catch (error) {
    console.error('Import failed:', error);
    Alert.alert('Import fehlgeschlagen', 'Fehler beim Importieren der Daten');
  }
};
```

```javascript
// Vanilla JavaScript
const importBtn = document.getElementById('importBtn');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'application/json';

importBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importData = JSON.parse(event.target.result);

      // Validate
      if (!importData.version || !importData.data) {
        throw new Error('Invalid data format');
      }

      // Import
      localStorage.setItem('tasks', JSON.stringify(importData.data.tasks));
      localStorage.setItem('settings', JSON.stringify(importData.data.settings));

      showToast('Import erfolgreich', 'success');

      // Reload page to reflect changes
      setTimeout(() => location.reload(), 1000);
    } catch (error) {
      console.error('Import failed:', error);
      showToast('Import fehlgeschlagen', 'error');
    }
  };

  reader.readAsText(file);
});
```

---

## ☕ Support Link / Ko-fi Button

### Übersicht

Ein dezenter Support-Link im Settings-Menü, der Benutzern ermöglicht, den Entwickler zu unterstützen.

**WICHTIG:** Nicht mehr als Sticky Footer, sondern nur im Settings-Menü (siehe ux-vorgaben.md).

### Platzierung

- **Nur im Settings-Menü:** Am Ende des Menüs
- **Nicht im Footer:** Alte Implementierung mit Footer ist veraltet
- **Store-konform:** Settings-Links gelten NICHT als "In-App-Werbung"

### React Native Implementation

```typescript
import { Linking, TouchableOpacity, Text } from 'react-native';

const handleSupportPress = () => {
  Linking.openURL('https://ko-fi.com/devsven');
};

// Settings Menu - letzte Section
<View style={styles.settingsSection}>
  <TouchableOpacity
    onPress={handleSupportPress}
    style={[styles.settingsLink, { borderTopWidth: 1, borderTopColor: colors.border }]}
  >
    <Text style={[styles.settingsLinkText, { color: colors.primary }]}>
      support me
    </Text>
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  settingsSection: {
    padding: 12,
  },
  settingsLink: {
    paddingVertical: 12,
    minHeight: 44, // Touch target
  },
  settingsLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

### Vanilla JavaScript Implementation

```html
<!-- Settings Menu -->
<div class="settings-menu">
  <!-- ... other sections ... -->

  <hr class="settings-separator">

  <div class="settings-section">
    <a href="https://ko-fi.com/devsven" target="_blank" class="settings-link">
      support me
    </a>
  </div>
</div>
```

```css
.settings-link {
  display: block;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--settings-primary);
  text-decoration: none;
  cursor: pointer;
  transition: opacity 200ms ease;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.settings-link:hover {
  opacity: 0.8;
}
```

### Alternative Platforms

Falls Ko-fi nicht verwendet wird:

```typescript
// GitHub Sponsors
Linking.openURL('https://github.com/sponsors/USERNAME');

// Buy Me a Coffee
Linking.openURL('https://www.buymeacoffee.com/USERNAME');

// PayPal
Linking.openURL('https://www.paypal.me/USERNAME');

// Patreon
Linking.openURL('https://www.patreon.com/USERNAME');
```

---

## ✅ Checkliste - Feature Implementations

### Metrik-Ansicht
- [ ] Toggle in Settings implementiert
- [ ] Metrik-Berechnung implementiert (projekt-spezifisch)
- [ ] UI-Komponente erstellt (Cards, Items)
- [ ] Dark Mode Support (Farben angepasst)
- [ ] Responsive Layout (Mobile & Desktop)
- [ ] "Zuletzt aktualisiert" Timestamp
- [ ] Accessibility (Screen Reader Labels)

### JSON-Export
- [ ] Export-Button in Settings
- [ ] Export-Datenstruktur definiert (version, date, data)
- [ ] Platform-spezifische Implementation (Web vs Mobile)
- [ ] Success/Error Feedback
- [ ] Dateiname mit Timestamp
- [ ] Import-Funktionalität (optional)
- [ ] Daten-Validierung beim Import

### Support Link
- [ ] Link in Settings-Menü (letzte Section)
- [ ] Separator vor Link
- [ ] Korrekte URL (Ko-fi, GitHub Sponsors, etc.)
- [ ] Plain Text (kein Emoji)
- [ ] 44px Touch Target
- [ ] Hover/Focus States
- [ ] Opens in external browser

---

## 📚 Referenzen

**Erfolgreich implementierte Projekte:**

- ✅ **Pflanzkalender** - Metrik-Ansicht, JSON-Export, Support-Link
  - Metriken: Pflanzen, Aktivitäten, Durchschnitte
  - Export: Vollständige Pflanzendaten mit Historien

- ✅ **Eisenhauer** - JSON-Export, Support-Link
  - Export: Tasks mit Kategorien und Zeitstempeln

- ✅ **Energy Price Germany** - Keine Metrik-Ansicht (Daten sind historisch)
  - Support-Link in Settings

- ✅ **1x1 Trainer** - Keine Export-Funktion (keine persistenten Benutzerdaten)
  - Support-Link in Settings

**Dokumentation:**
- [React Native Share API](https://reactnative.dev/docs/share)
- [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Web APIs - Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [Web APIs - URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

---

**Hinweis:** Diese Implementierungen sind getestet und können direkt übernommen werden. Passe die Datenstrukturen und Metriken an dein spezifisches Projekt an.
