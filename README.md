# Eisenhauer Matrix - Task Management App

A modern, mobile-first Progressive Web App for task management using the Eisenhower Matrix method.

## Live

- **Web App:** [https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/) - v1.11.2 ✅
- Available as Android TWA via Google Play Store

📝 **[Changelog](docs/CHANGELOG.md)** | ♿ **[Accessibility Audit](tests/accessibility/ACCESSIBILITY_AUDIT.md)** | 📐 **[Architecture](docs/ARCHITECTURE.md)**

## Tech Stack

| Technology | Role |
|---|---|
| HTML5, CSS3 (Flexbox, Grid, CSS Variables) | Frontend |
| Vanilla JavaScript ES6+ | Application logic (no framework) |
| IndexedDB via localForage | Guest mode storage (~50 MB+) |
| Firebase Authentication | Google Sign-In |
| Cloud Firestore | Real-time database with security rules |
| Service Worker | Offline functionality |
| Web App Manifest | PWA installability |

## Setup

### 1. Firebase Setup (required for login)

The app requires Firebase for user authentication and cloud sync.

1. Follow the detailed guide in [FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md)
2. Create a free Firebase project
3. Enable Google Sign-In
4. Set up Firestore Database
5. Copy `firebase-config.example.js` to `firebase-config.js`
6. Enter your Firebase credentials in `firebase-config.js`

Note: `firebase-config.js` is in `.gitignore` and will not be committed — your credentials stay private.

### 2. Local Development

```bash
git clone https://github.com/S540d/Eisenhauer.git
cd Eisenhauer
npm install
```

Then open `index.html` in a browser or start a local server:
```bash
python3 -m http.server 8000
# or
npx http-server
```

### 3. npm Scripts

```bash
# Formatting & linting
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting (no changes)
npm run lint            # ESLint linting
npm run lint:fix        # Auto-fix ESLint errors

# Testing
npm run test            # Unit tests with Vitest
npm run test:coverage   # Tests with coverage report
npm run test:e2e        # End-to-end tests (Playwright)

# Deployment
npm run deploy          # Deploy to GitHub Pages
npm run validate        # Release validation checklist
```

### 4. Install as iOS App

The app can be installed as a Progressive Web App on iOS:

1. Generate icons: Open `icons/generate-icons.html` and download all icons
2. Host the app on GitHub Pages (see [INSTALL.md](INSTALL.md))
3. Open in Safari → "Share" → "Add to Home Screen"

📱 **Detailed guide:** See [INSTALL.md](INSTALL.md)

## Features

### 5 Segments
- **Do!** - Urgent & Important (handle immediately)
- **Schedule!** - Not urgent & Important (plan)
- **Delegate!** - Urgent & Not important (delegate)
- **Ignore!** - Not urgent & Not important (eliminate)
- **Done!** - Completed tasks

### Core Functions
- ✅ Create tasks with max. 140 characters
- ✅ **Recurring Tasks** - Time-based automatic recreation (⭐ NEW: v1.6.0)
  - Daily, Weekly, Monthly, or Custom
  - Appear only when due (e.g., daily tomorrow at 00:00)
  - Delete entire series via Edit Modal
  - Flexible interval configuration
- ✅ Automatic forwarding to next category (↓ button)
- ✅ Checkboxes to mark done (automatically moves to "Done!")
- ✅ **Drag & Drop between segments** - 3 modes:
  - **Mouse:** Click & Drag
  - **Touch:** Tap & Hold, then drag (Mobile)
  - **Keyboard:** Space → Arrow Keys → Enter (⭐ NEW: Accessibility)
- ✅ **Swipe-to-Delete** - Delete tasks with swipe gesture (Mobile)
- ✅ **Delete Button** - Desktop-friendly delete option (Done tasks only)

### Cloud & Sync
- ✅ **Cloud synchronization** with Firebase
- ✅ **User accounts** (Google/Apple Sign-In)
- ✅ **Auth persistence** - Stay permanently signed in (⭐ NEW: IndexedDB Persistence for Android TWA)
- ✅ **Guest mode** - Test without login using local storage
- ✅ **Explicit data import** (⭐ NEW v1.7.0)
- ✅ **Data loss protection** (⭐ NEW v1.7.0)
- ✅ **Cache-busting system** (⭐ NEW v1.7.0)
- ✅ **Cross-device sync** (with cloud login)
- ✅ **Offline-First Architecture** with OfflineQueue
- ✅ **Persistent storage** with IndexedDB
- ✅ **Offline indicator** shows connection status

### Design & UX
- ✅ **Dark Mode** - Automatic based on system setting
- ✅ **Mobile-First Design** - Optimized for smartphones
- ✅ **Responsive Layout** - Works on desktop & tablet
- ✅ **Progressive Web App (PWA)** - Installable as app
- ✅ **iOS-optimized** with special meta tags

### 🌍 Language Support
- ✅ **German** - Full localization
- ✅ **English** - Complete English translation
- ✅ **Dynamic language sync** (⭐ NEW: v1.6.2-RC)

### ♿ Accessibility
- ✅ **WCAG 2.1 Level AA Fully Compliant**
- ✅ **Full keyboard control**
- ✅ **Screen reader support** (VoiceOver, NVDA, JAWS, TalkBack)
- 📊 **Audit:** [Accessibility Audit](tests/accessibility/ACCESSIBILITY_AUDIT.md)

### Data Management
- ✅ **Export/Import** - Export and import data as JSON
- ✅ **Search** - Search tasks via settings menu
- ✅ **Due Dates** - Optional due dates for tasks
- ✅ **Web Push Reminders** - Push notifications for tasks with due dates
- ✅ **Smart Urgency Rules** - Auto-mark as urgent when due ≤3 days (opt-in)
- ✅ **Focus Mode** - Hide Q3/Q4 for more focused work
- ✅ **Category Filter** - Private/Work categorization (opt-in)

## Usage

### Desktop/Browser
1. Enter a new task and click "+"
2. Select segment
3. **Optional:** Configure recurring task
4. Manage tasks:
   - **Click checkbox** → Task moves to "Done!"
   - **Drag & Drop** → Move task to another segment
   - **↓ Button** → Move task to next category
   - **✕ Button** → Delete task (with confirmation)

### Mobile (Touch)
- **Swipe left** on task → Delete with animation feedback
- All other features available as on desktop
- **Pull down** on task list → Refresh
- **Tap & Hold** → Drag & Drop

## Data Storage

### Guest Mode (without login)
- **Location:** IndexedDB (via localForage)
- **Capacity:** ~50 MB+ (much larger than localStorage)
- **Persistence:** Persistent Storage API prevents automatic deletion

### Cloud Mode (with login)
- **Location:** Firebase Cloud Firestore
- **Sync:** Automatic on all devices
- **Security:** Firebase Security Rules, XSS protection, user-isolated data

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Roadmap

Planned features (see [Issues](https://github.com/S540d/Eisenhauer/issues)):

- [ ] Archive for deleted tasks
- [ ] More authentication providers
- [ ] CSV Export (for Excel/Sheets)
- [ ] PDF Export (for printing)
- [ ] Categories/Tags

## License

This project is licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

- ✅ You may use, copy, and modify the project
- ✅ You may use it for private/personal purposes
- ❌ Commercial use is **not** permitted
- ℹ️ Attribution required when using

See [LICENSE](LICENSE) for details.

## Contributing

Pull Requests are welcome! For larger changes, please open an issue first.

## Contact

For questions or feedback: [GitHub Issues](https://github.com/S540d/Eisenhauer/issues)

---

Made with ❤️ and [Claude Code](https://claude.com/claude-code)
