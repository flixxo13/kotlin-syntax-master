# Kotlin Master 🟣

> **Kotlin Syntax interaktiv lernen – offline, schnell, mobil.**

Eine Progressive Web App (PWA) zum Erlernen von Kotlin-Syntax. Kein Account, kein Backend, keine Ablenkung – nur fokussiertes Syntaxtraining direkt im Browser oder als Android-APK.

---

## Inhaltsverzeichnis

1. [Projektüberblick](#projektüberblick)
2. [Tech-Stack](#tech-stack)
3. [Architektur](#architektur)
4. [Ordnerstruktur](#ordnerstruktur)
5. [Kernfunktionen](#kernfunktionen)
6. [Datenmodell & Typen](#datenmodell--typen)
7. [State Management](#state-management)
8. [Übungs-Modi](#übungs-modi)
9. [Hint-System](#hint-system)
10. [Syntax Analyzer](#syntax-analyzer)
11. [Import-System](#import-system)
12. [PWA & Offline](#pwa--offline)
13. [XP & Gamification](#xp--gamification)
14. [Lokale Entwicklung](#lokale-entwicklung)
15. [Deployment (Vercel)](#deployment-vercel)
16. [Umgebungsvariablen](#umgebungsvariablen)
17. [Roadmap / Offene Features](#roadmap--offene-features)

---

## Projektüberblick

Kotlin Master richtet sich an Einsteiger und Entwickler aus anderen Sprachen, die Kotlin-Syntax **strukturiert und ohne Ablenkung** erlernen möchten. Die App ist bewusst schlank positioniert – kein Algorithmentraining, keine allgemeine Programmiertheorie, ausschließlich Kotlin-Syntax und -Struktur.

**Abgrenzung zu Mitbewerbern:**

| App | Fokus | KotlinMaster-Unterschied |
|---|---|---|
| Mimo | Allgemein, gamifiziert | Nur Kotlin, kein Noise |
| SoloLearn | Breites Curriculum | Syntax-first, offline |
| Grasshopper | JS, Einsteiger | Kotlin-spezifisch |
| JetBrains Academy | Vollkurs, kostenpflichtig | Kostenlos, mobil-first |

---

## Tech-Stack

| Bereich | Technologie | Version |
|---|---|---|
| Framework | React | 19 |
| Build Tool | Vite | 6 |
| Sprache | TypeScript | ~5.8 |
| Styling | Tailwind CSS | 4 (Vite-Plugin) |
| State | Zustand (mit `persist`) | 5 |
| Editor | CodeMirror | 6 |
| Animationen | Motion (Framer Motion) | 12 |
| Icons | Lucide React | 0.546 |
| AI (optional) | Google Gemini API (`@google/genai`) | 1.x |
| Import/Export | JSZip | 3 |
| PWA | Manueller Service Worker | – |

---

## Architektur

```
Browser / Android WebView
        │
        ▼
   React 19 (SPA)
        │
   ┌────┴────────────────────────────┐
   │  App.tsx  (Routing via State)   │
   │  • activeTab                    │
   │  • activeExercise               │
   └────┬────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────────┐
   │              Screens                          │
   │  HomeScreen   ExerciseScreen   ImportScreen   │
   │  ProgressScreen (stub)  ProfileScreen (stub)  │
   └────┬──────────────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────────┐
   │              Components                       │
   │  editor/     exercise/    navigation/   ui/   │
   └────┬──────────────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────────┐
   │         Services & Store                      │
   │  syntaxAnalyzer.ts   taskParser.ts            │
   │  useLearningStore.ts (Zustand + localStorage) │
   └───────────────────────────────────────────────┘
```

**Routing:** Es gibt keinen Router (kein React Router). Navigation erfolgt rein über `useState` in `App.tsx` (`activeTab` + `activeExercise`). Screen-Wechsel werden mit `motion/react AnimatePresence` animiert (Slide links/rechts, 200ms).

---

## Ordnerstruktur

```
kotlin-syntax-master/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── metadata.json
├── public/
│   ├── manifest.webmanifest       # PWA-Manifest
│   ├── sw.js                      # Service Worker (Offline-Cache)
│   └── icons/                     # PWA-Icons (72–512px)
├── scripts/
│   └── generate-icons.js          # Icon-Generator-Script
└── src/
    ├── main.tsx                   # Entry Point
    ├── App.tsx                    # Root + Routing
    ├── index.css                  # Globale Styles / Tailwind
    ├── types.ts                   # Gemeinsame TypeScript-Typen
    ├── data/
    │   └── topics.ts              # Statische Lerninhalt-Daten (TOPICS[])
    ├── store/
    │   └── useLearningStore.ts    # Zustand Store (persist in localStorage)
    ├── services/
    │   ├── syntaxAnalyzer.ts      # Tokenizer + Token-Feedback-Engine
    │   └── taskParser.ts          # Text-zu-Exercise Parser (Import-Format)
    ├── screens/
    │   ├── HomeScreen.tsx         # Topic-Übersicht + Custom Tasks
    │   ├── ExerciseScreen.tsx     # Übungs-Hauptansicht
    │   └── ImportScreen.tsx       # Aufgaben importieren (Text/JSON)
    └── components/
        ├── editor/
        │   ├── KotlinEditor.tsx   # CodeMirror 6 Editor-Wrapper
        │   ├── EditorFeedback.tsx # Token-Feedback-Anzeige
        │   ├── ShortcutBar.tsx    # Kotlin-Shortcut-Leiste (mobile)
        │   └── ResizeHandle.tsx   # Vertikaler Editor-Resize-Handle
        ├── exercise/
        │   ├── TaskCard.tsx       # Aufgabenbeschreibungs-Karte
        │   ├── HintPanel.tsx      # 3-Level Ghost-Text Hint
        │   ├── AssignmentView.tsx # Drag/Drop Token-Modus
        │   └── NoteModal.tsx      # Notiz zu Übung speichern
        ├── navigation/
        │   └── BottomNav.tsx      # Mobile Bottom-Navigation (4 Tabs)
        └── ui/
            └── ConfirmModal.tsx   # Bestätigungs-Dialog
```

---

## Kernfunktionen

### 1. Lernpfad (HomeScreen)
- Zeigt alle **Topics** mit Fortschrittsbalken (Concept-Mastery aus Store)
- Zeigt **Custom Tasks** (importierte Aufgaben) als separate Sektion
- Startet eine Session per Tap auf ein Topic oder eine Custom Task

### 2. Übungsscreen (ExerciseScreen)
- Zeigt `TaskCard` mit Aufgabentext
- Enthält `KotlinEditor` (CodeMirror 6) mit Syntax-Highlighting
- Zeigt `EditorFeedback` – Token-für-Token-Vergleich mit Musterlösung
- Vertikale `ResizeHandle` – Editor-Höhe per Drag anpassen
- `ShortcutBar` – Kotlin-spezifische Zeichen/Keywords per Tap einfügen
- `HintPanel` – 3-Level Hinweissystem
- Notizen pro Übung speicherbar (`NoteModal`)

### 3. Import (ImportScreen)
- Eigene Aufgaben im Textformat (`.txt`) oder JSON importieren
- `taskParser.ts` wandelt strukturierten Text in `Exercise[]` um
- JSZip-Support für `.zip`-Pakete mit mehreren Aufgaben

### 4. Fortschritt & Profil (Stubs)
- `ProgressScreen` und `ProfileScreen` sind noch Platzhalter
- Store trackt bereits: XP, Streak, Mastery, Attempts, HintLevel

---

## Datenmodell & Typen

Alle Typen sind in `src/types.ts` definiert.

### `Exercise` – eine einzelne Übung
```typescript
interface Exercise {
  id:          string;
  conceptId:   string;
  mode:        'builder' | 'assignment';
  task:        string;           // Aufgabentext (Deutsch)
  initialCode: string;           // Startcode im Editor
  solution:    string;           // Musterlösung
  hints: {
    level1: string;              // Stark verschleiert ("... ...() { ... }")
    level2: string;              // Anker sichtbar ("fun main() { ... }")
    level3: string;              // Fast vollständig
  };
  assignmentData?: {             // Nur für mode='assignment'
    zielCode:            string;
    bausteineRichtig:    string[];
    bausteineDistraktor: string[];
    map:                 Record<string, string>;
  };
}
```

### `Concept` → `Topic`
```typescript
Topic {
  id, title, description, icon, order
  concepts: Concept[] {
    id, topicId, title, syntaxRule, explanation, example
    exercises: Exercise[]
  }
}
```

### `HintLevel`
```typescript
enum HintLevel {
  NONE     = 0,   // Kein Hint
  ONE      = 1,   // Hint 1
  TWO      = 2,   // Hint 2
  THREE    = 3,   // Hint 3
  REVEALED = 'revealed'  // Lösung komplett sichtbar
}
```

---

## State Management

**`useLearningStore`** (Zustand + `persist` → `localStorage` Key: `kotlin-master-v2`)

### Persistierter State
| Feld | Typ | Beschreibung |
|---|---|---|
| `progress` | `Record<exerciseId, ExerciseProgress>` | Pro Übung: completed, bestHintLevel, attempts, xpEarned |
| `conceptMastery` | `Record<conceptId, number>` | 0–100 Mastery-Score pro Concept |
| `customTasks` | `Exercise[]` | Importierte Aufgaben |
| `totalXP` | number | Gesamt-XP |
| `totalExercises` | number | Anzahl abgeschlossener Übungen |
| `streak` | number | Tages-Streak |
| `streakFreezeAvailable` | boolean | Einmaliger Streak-Schutz |
| `exerciseNotes` | `Record<exerciseId, string>` | Notizen pro Übung |
| `editorHeight` | number | Editor-Höhe (px, default 250) |
| `sessionLength` | `'quick' \| 'standard' \| 'deep'` | Session-Länge |

### In-Memory (nicht persistiert)
| Feld | Beschreibung |
|---|---|
| `_sessionStart` | Timestamp Session-Start (ms) |
| `_sessionExercises` | Übungen der aktuellen Session |
| `currentHintLevel` | Aktuell aktiver Hint-Level |
| `activeTopicId / activeConceptId / activeExerciseId` | Aktive Navigation |

### XP-Tabelle
| HintLevel | XP |
|---|---|
| NONE (kein Hint) | 10 |
| Level 1 | 7 |
| Level 2 | 4 |
| Level 3 | 2 |
| REVEALED | 0 |

Bei Wiederholung einer Übung: 30% der normalen XP (kein Double-Dipping).

---

## Übungs-Modi

### `builder` – Freies Schreiben
Der Nutzer tippt Kotlin-Code direkt in den CodeMirror-Editor. `syntaxAnalyzer.ts` tokenisiert Eingabe und Lösung und gibt Token-für-Token-Feedback:

| Farbe | Bedeutung |
|---|---|
| 🟢 Grün | Richtiger Token an richtiger Position |
| 🔵 Blau | Token ist in Lösung, aber falsche Position |
| ⚫ Grau | Kotlin-Keyword erkannt, aber nicht in Lösung |
| ❌ Rot | Unbekannter Token |

### `assignment` – Drag & Drop (Token-Bar)
Vorgegebene Token-Bausteine (`bausteineRichtig` + `bausteineDistraktor`) müssen in die richtige Reihenfolge gebracht werden. `AssignmentView.tsx` rendert diese als tippbare Chips. Kein Freitext.

---

## Hint-System

3 Stufen + Reveal, gesteuert über `HintPanel.tsx` und Store:

```
Stufe 0 (NONE):     Kein Hint sichtbar
Stufe 1 (ONE):      hint.level1 – stark verschleiert
                    z.B. "... ...() {\n  ...(\"...\")\n}"
Stufe 2 (TWO):      hint.level2 – Ankerpunkte sichtbar
                    z.B. "fun main() {\n  println(\"...\")\n}"
Stufe 3 (THREE):    hint.level3 – fast vollständig
                    z.B. "fun main() {\n  println(\"Hello\")\n}"
REVEALED:           Lösung 1:1 angezeigt, XP = 0
```

Jeder Hint-Request inkrementiert `currentHintLevel` im Store (max 3). Reset erfolgt beim Starten der nächsten Übung.

---

## Syntax Analyzer

`src/services/syntaxAnalyzer.ts` – rein client-seitig, kein API-Call.

### Tokenizer
Regex-basierter Tokenizer mit Priorität:
1. Compound-Operatoren (`?:`, `?.`, `!!`, `->`, `<=`, `>=`, `==`, `!=`, `&&`, `||`)
2. String-Literals (`"..."`, `'...'`)
3. Zahlen (Int + Float)
4. Bezeichner / Keywords (`[a-zA-Z_][a-zA-Z0-9_]*`)
5. Einzelne Operatoren/Strukturzeichen

### Feedback-Typen
```typescript
type FeedbackType =
  | 'correct-pos'   // Richtiger Token, richtige Position → Grün
  | 'in-solution'   // Token in Lösung, falsche Position  → Blau
  | 'detected'      // Kotlin-Keyword, nicht in Lösung    → Grau
  | 'unknown'       // Unbekannter Token                  → Rot
```

---

## Import-System

### Textformat (`.txt`)

Aufgaben werden durch `---` getrennt. Jede Aufgabe verwendet `KEY: value` Felder:

```
ID: my-task-01
MODUS: builder
THEMA: Variablen
BESCHREIBUNG: Deklariere eine read-only Variable.
STARTCODE:
HINT1_STRUKTUR: ... version = ...
HINT2_ANKER: val version = ...
HINT3_KONTEXT: val version = 2.0
LOESUNG: val version = 2.0
---
ID: my-task-02
MODUS: assignment
...
ZIELCODE: val name = "Kotlin"
BAUSTEINE_RICHTIG: val | name | = | "Kotlin"
BAUSTEINE_DISTRAKTOR: var | let | :
BAUSTEIN_MAP: val->val | name->name | =->= | "Kotlin"->"Kotlin"
```

`taskParser.ts` verarbeitet dieses Format zu `Exercise[]` und fügt sie via `addCustomTasks()` dem Store hinzu.

### JSON-Format
Direkter Import als `Exercise[]`-Array (gleiche Struktur wie `src/types.ts`).

### ZIP-Import
JSZip entpackt `.zip`-Archive und verarbeitet enthaltene `.txt`- oder `.json`-Dateien sequenziell.

---

## PWA & Offline

**Manifest:** `public/manifest.webmanifest`
- Name: "Kotlin Master", Short: "KotlinMaster"
- Theme Color: `#7F52FF` (Kotlin-Lila)
- Display: `standalone` (kein Browser-Chrome)
- Orientation: `portrait`
- Sprache: `de`
- Shortcuts: "Lernen" (`/?tab=learn`) + "Importieren" (`/?tab=import`)

**Service Worker:** `public/sw.js`
- Precaching aller App-Shell-Ressourcen
- Offline-First Strategie (Cache-First für Assets)

**Android APK:** Geplant via Trusted Web Activity (TWA) auf Samsung Galaxy S23.

---

## XP & Gamification

| Feature | Status |
|---|---|
| XP pro Übung (hint-abhängig) | ✅ Implementiert |
| Concept-Mastery (0–100) | ✅ Implementiert |
| Tages-Streak | ✅ Implementiert |
| Streak Freeze (1x) | ✅ Implementiert |
| Achievements | 🔧 Typen definiert, Logik fehlt |
| ProgressScreen | 🔧 Stub (zeigt Mockdaten) |
| ProfileScreen | 🔧 Stub |

---

## Lokale Entwicklung

```bash
# 1. Dependencies installieren
npm install

# 2. .env anlegen (optional, für Gemini AI)
echo "GEMINI_API_KEY=dein_key_hier" > .env

# 3. Dev-Server starten (Port 3000)
npm run dev

# 4. TypeScript prüfen (kein Emit)
npm run lint

# 5. Production Build
npm run build

# 6. Build lokal vorschauen
npm run preview
```

**Node.js:** ≥ 18 empfohlen (Vite 6 Requirement)

---

## Deployment (Vercel)

Das Projekt deployed automatisch via GitHub → Vercel (Auto-Deploy auf `main`-Branch).

**Vercel-Konfiguration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: Vite

**Wichtig:** `GEMINI_API_KEY` als Environment Variable in Vercel hinterlegen (falls Gemini-Features aktiv).

**Repo:** `github.com/flixxo13/kotlin-syntax-master`

---

## Umgebungsvariablen

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Google Gemini API Key für KI-gestützte Features |

Die Variable wird in `vite.config.ts` via `loadEnv` geladen und als `process.env.GEMINI_API_KEY` im Build verfügbar gemacht.

---

## Roadmap / Offene Features

### Kurzfristig (nächste Sprints)
- [ ] `ProgressScreen` – echte Daten aus Store anzeigen (XP-Verlauf, Mastery-Übersicht)
- [ ] `ProfileScreen` – Name, Avatar, Achievements
- [ ] Mehr Topics & Exercises in `src/data/topics.ts`
- [ ] `assignment`-Modus vollständig (AssignmentView polish)

### Mittelfristig
- [ ] Session-Abschluss-Screen mit `SessionResult`-Anzeige
- [ ] Achievement-Unlock-Logik + Notifications
- [ ] Gemini AI: kontextuelle Hinweise / Erklärungen
- [ ] PWA-Icons generieren (`scripts/generate-icons.js`)
- [ ] Screenshots für Manifest (`public/screenshots/`)

### Langfristig
- [ ] Android APK via TWA (Samsung Galaxy S23)
- [ ] Eigener Aufgaben-Editor direkt in der App
- [ ] Multiplayer / Duell-Modus (Telegram Mini App)
- [ ] FSRS-basiertes Spaced Repetition System

---

*Erstellt mit React 19 + Vite 6 + TypeScript + Tailwind 4 · Deployed on Vercel · Made in DACH 🇩🇪🇦🇹🇨🇭*
