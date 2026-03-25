# 🚀 Kotlin Syntax Master

> Interaktiver Syntax-Trainer für Kotlin — Mobile-first PWA

![Version](https://img.shields.io/badge/version-1.0.0-7F52FF)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4)

---

## ✨ Features

- 📚 **6 Module** mit 25 Konzepten und 88+ Übungen
- ⌨️ **Kotlin Editor** mit Syntax Highlighting (CodeMirror 6)
- 💡 **Scaffolding** — 3-stufiges Hint-System
- 🧩 **Zwei Modi** — Syntax-Builder & Zuordnungsmodus
- 🔁 **SRS** — Spaced Repetition basierend auf Hint-Tiefe
- 📱 **Mobile-first** — Optimiert für Samsung Galaxy S23
- 🔌 **PWA** — Offline-fähig, installierbar
- 🔥 **Streak-System** mit Freeze-Schutz
- ⭐ **XP-System** — Quiet XP, erweiterbar

---

## 🛠️ Lokale Entwicklung

```bash
# 1. Repository klonen
git clone https://github.com/dein-name/kotlin-syntax-master.git
cd kotlin-syntax-master

# 2. Dependencies installieren
npm install

# 3. Dev-Server starten
npm run dev
# → http://localhost:5173
```

---

## 🌐 Deployment auf Vercel

### Option A — Vercel CLI (empfohlen)
```bash
npm install -g vercel
vercel login
vercel
# Dann: vercel --prod für Production
```

### Option B — GitHub Integration
1. Code auf GitHub pushen
2. vercel.com → "New Project" → GitHub Repo verbinden
3. Framework: **Vite** (wird automatisch erkannt)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy klicken ✅

### Umgebungsvariablen (optional, für V2)
```
VITE_SUPABASE_URL        → Supabase Projekt-URL
VITE_SUPABASE_ANON_KEY   → Supabase Anon Key
VITE_GEMINI_API_KEY      → Gemini API Key
```

---

## 📁 Projektstruktur

```
src/
├── App.tsx                    # App Shell & Routing
├── types.ts                   # TypeScript Interfaces
├── main.tsx                   # Entry Point
├── store/
│   └── useLearningStore.ts    # Zustand Store
├── data/
│   ├── topics.ts              # Modul-Index
│   ├── module1.ts             # Einführung & Setup
│   ├── module2.ts             # Variablen & Syntax
│   ├── module3.ts             # Datentypen
│   ├── module4.ts             # Control Statements
│   ├── module5.ts             # Funktionen
│   ├── module6.ts             # Exception Handling
│   └── module7.ts             # (V2) Null Safety & Collections
├── screens/                   # App-Screens
├── components/                # UI-Komponenten
│   ├── editor/                # KotlinEditor, ShortcutBar, ResizeHandle
│   ├── exercise/              # TaskCard, HintPanel, ChipBar, SolutionView
│   ├── navigation/            # BottomNav
│   └── ui/                    # ProgressBar, StatCard, ModuleCard
├── hooks/                     # Custom Hooks
├── utils/                     # srs.ts, xp.ts, streak.ts
└── styles/                    # index.css
```

---

## 🗺️ Roadmap

### v1.0 (aktuell) ✅
- [x] 6 Module mit 88+ Übungen
- [x] Syntax-Builder & Zuordnungsmodus
- [x] 3-stufiges Hint-System + SRS
- [x] Kotlin Editor mit Live-Feedback
- [x] PWA (Offline + installierbar)
- [x] Streak + XP System
- [x] Vercel Deployment

### v2.0 (geplant)
- [ ] Modul 7: Null Safety, Collections, Lambdas
- [ ] Supabase Backend (Cloud-Sync)
- [ ] Onboarding Assessment
- [ ] Badge/Achievement System
- [ ] Level-System (1-20)
- [ ] Gemini AI Feedback
- [ ] Push Notifications

---

## 🏗️ Tech Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 18+ | UI Framework |
| TypeScript | 5+ | Typsicherheit |
| Vite | 5+ | Build Tool |
| Tailwind CSS | 3+ | Styling |
| CodeMirror 6 | Latest | Kotlin Editor |
| Zustand | 4+ | State Management |
| Framer Motion | 11+ | Animationen |
| vite-plugin-pwa | Latest | PWA/Service Worker |

---

## 📄 Lizenz

MIT © 2026 — flixxo13
