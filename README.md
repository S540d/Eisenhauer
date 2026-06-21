# Eisenhauer Matrix

A task management Progressive Web App based on the Eisenhower Matrix method.

## Live

[https://s540d.github.io/Eisenhauer/](https://s540d.github.io/Eisenhauer/)

## Tech Stack

| Technology                                    | Role                       |
| --------------------------------------------- | -------------------------- |
| HTML5, CSS3 (Flexbox, Grid, CSS Variables)    | Frontend                   |
| Vanilla JavaScript ES6+                       | Application logic          |
| IndexedDB via localForage                     | Guest mode storage (~50MB) |
| Firebase Authentication                       | Google/Apple Sign-In       |
| Cloud Firestore                               | Real-time database         |
| Service Worker                                | Offline functionality      |
| Web App Manifest                              | PWA installability         |

## Features

### 5 Matrix Segments
- **Do!** — Urgent & Important
- **Schedule!** — Not urgent & Important
- **Delegate!** — Urgent & Not important
- **Ignore!** — Not urgent & Not important
- **Done!** — Completed tasks

### Task Management
- Create tasks with max. 140 characters
- **Recurring tasks** — daily, weekly, monthly, or custom intervals; appear only when due
- Drag & drop between segments (mouse, touch tap-and-hold, keyboard)
- Swipe-to-delete on mobile
- Due dates with optional smart urgency (auto-mark urgent ≤ 3 days before)
- Web Push reminders for tasks with due dates
- **Export** — CSV and Markdown export
- **Matrix Stats** — overview of task distribution across segments
- **Smart Suggest** — suggestions based on existing task patterns
- **Focus Mode** — hide Q3/Q4 for concentrated work
- **Category filter** — Private / Work separation (opt-in)
- Search tasks

### Cloud & Sync
- Cloud synchronization via Firebase (with login)
- Guest mode — test without login using local IndexedDB storage
- Cross-device sync (with login)
- Offline-first architecture with OfflineQueue
- Explicit data import and data loss protection

### Accessibility
- WCAG 2.1 Level AA compliant
- Full keyboard control
- Screen reader support (VoiceOver, NVDA, JAWS, TalkBack)

### Design
- Dark mode (automatic based on system setting)
- Mobile-first, responsive layout
- PWA — installable as standalone app

### Language
- German and English

## License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
Personal and private use allowed. Commercial use not permitted. Attribution required.

See [LICENSE](LICENSE) for details.
