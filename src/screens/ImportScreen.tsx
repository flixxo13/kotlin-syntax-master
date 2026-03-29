import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useState = __vite__cjsImport1_react["useState"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { useLearningStore } from "/src/store/useLearningStore.ts";
import { parseTasks, exerciseToText } from "/src/services/taskParser.ts";
import { Download, Trash2, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, Copy, Edit2, Code, FileJson } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
import { ConfirmModal } from "/src/components/ui/ConfirmModal.tsx";
import __vite__cjsImport7_jszip from "/node_modules/.vite/deps/jszip.js?v=9e62f9bc"; const JSZip = __vite__cjsImport7_jszip.__esModule ? __vite__cjsImport7_jszip.default : __vite__cjsImport7_jszip;
import metadata from "/metadata.json?import";
export const ImportScreen = () => {
  const [inputText, setInputText] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addCustomTasks, clearCustomTasks, removeCustomTask, customTasks, exerciseNotes } = useLearningStore();
  const handleImport = () => {
    try {
      const tasks = parseTasks(inputText);
      if (tasks.length === 0) {
        throw new Error("Keine gültigen Aufgaben gefunden.");
      }
      addCustomTasks(tasks);
      setStatus({ type: "success", message: `${tasks.length} Aufgaben erfolgreich importiert!` });
      setInputText("");
      setTimeout(() => setStatus(null), 3e3);
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Fehler beim Importieren." });
      setTimeout(() => setStatus(null), 3e3);
    }
  };
  const loadTemplate = (type) => {
    const templates = {
      builder: `ID: b_04
MODUS: SYNTAX_BUILDER
THEMA: Funktionen
BESCHREIBUNG: Erstelle eine Funktion inc, die n (Int) nimmt und n + 1 zurückgibt (Expression Body).
STARTCODE:
\`\`\`kotlin
// Dein Code hier
\`\`\`
HINT1_STRUKTUR: ... ...(...: ...) = ... + ...
HINT2_ANKER: ... ...(n: Int) = n + 1
HINT3_KONTEXT: 
\`\`\`kotlin
___ inc(n: Int) = n + 1 // Name der Funktion steht in der Aufgabe
\`\`\`
LOESUNG:
\`\`\`kotlin
fun inc(n: Int) = n + 1
\`\`\``,
      assign: `ID: a_01
MODUS: ZUORDNUNG
THEMA: Variablen
BESCHREIBUNG: Setze val x = 5 zusammen
STARTCODE:
\`\`\`kotlin

\`\`\`
HINT1_STRUKTUR: val x = 5
HINT2_ANKER: Nutze val
HINT3_KONTEXT: Variable x
ZIELCODE:
\`\`\`kotlin
__0__ x = __1__
\`\`\`
BAUSTEINE_RICHTIG: val,5
BAUSTEINE_DISTRAKTOR: var,const
BAUSTEIN_MAP:
__0__ -> val
__1__ -> 5`
    };
    setInputText(templates[type]);
    setStatus({ type: "success", message: "Template geladen!" });
    setTimeout(() => setStatus(null), 2e3);
  };
  const copyTemplate = (type) => {
    const templates = {
      builder: `ID: b_01
MODUS: SYNTAX_BUILDER
THEMA: Variablen
BESCHREIBUNG: Deklariere val x = 5
STARTCODE:
\`\`\`kotlin

\`\`\`
HINT1_STRUKTUR: val ... = ...
HINT2_ANKER: val x = 5
HINT3_KONTEXT: Nutze val
LOESUNG:
\`\`\`kotlin
val x = 5
\`\`\``,
      assign: `ID: a_01
MODUS: ZUORDNUNG
THEMA: Variablen
BESCHREIBUNG: Setze val x = 5 zusammen
STARTCODE:
\`\`\`kotlin

\`\`\`
HINT1_STRUKTUR: val x = 5
HINT2_ANKER: Nutze val
HINT3_KONTEXT: Variable x
ZIELCODE:
\`\`\`kotlin
__0__ x = __1__
\`\`\`
BAUSTEINE_RICHTIG: val,5
BAUSTEINE_DISTRAKTOR: var,const
BAUSTEIN_MAP:
__0__ -> val
__1__ -> 5`
    };
    navigator.clipboard.writeText(templates[type]);
    setStatus({ type: "success", message: "Template kopiert!" });
    setTimeout(() => setStatus(null), 2e3);
  };
  const copyAllNotes = () => {
    const noteText = Object.entries(exerciseNotes).map(([id, note]) => `ID: ${id}
NOTE: ${note}
---`).join("\n\n");
    navigator.clipboard.writeText(noteText);
    setStatus({ type: "success", message: "Alle Notizen kopiert!" });
    setTimeout(() => setStatus(null), 2e3);
  };
  const downloadBlueprint = () => {
    const blueprint = {
      appMetadata: metadata,
      customTasks,
      exerciseNotes,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    };
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kotlin-master-blueprint-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "success", message: "Blueprint heruntergeladen!" });
    setTimeout(() => setStatus(null), 2e3);
  };
  const downloadCompleteCode = async () => {
    setStatus({ type: "success", message: "Code wird gebündelt..." });
    const zip = new JSZip();
    const files = [
      "package.json",
      "metadata.json",
      "vite.config.ts",
      "tsconfig.json",
      "index.html",
      "src/App.tsx",
      "src/main.tsx",
      "src/index.css",
      "src/store/useLearningStore.ts",
      "src/services/taskParser.ts",
      "src/services/syntaxAnalyzer.ts",
      "src/data/topics.ts",
      "src/screens/ExerciseScreen.tsx",
      "src/screens/ImportScreen.tsx",
      "src/components/editor/KotlinEditor.tsx",
      "src/components/editor/ShortcutBar.tsx",
      "src/components/editor/ResizeHandle.tsx",
      "src/components/editor/EditorFeedback.tsx",
      "src/components/exercise/TaskCard.tsx",
      "src/components/exercise/HintPanel.tsx",
      "src/components/exercise/AssignmentView.tsx",
      "src/components/exercise/NoteModal.tsx",
      "src/components/ui/ConfirmModal.tsx"
    ];
    try {
      for (const filePath of files) {
        try {
          const response = await fetch(`/${filePath}`);
          if (response.ok) {
            const content2 = await response.text();
            zip.file(filePath, content2);
          }
        } catch (e) {
          console.warn(`Could not fetch ${filePath}`, e);
        }
      }
      const tasksText = customTasks.map((t) => exerciseToText(t)).join("\n---\n");
      zip.file("custom_tasks_export.txt", tasksText);
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kotlin-master-source-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ type: "success", message: "Code erfolgreich heruntergeladen!" });
    } catch (err) {
      setStatus({ type: "error", message: "Fehler beim Bündeln des Codes." });
    }
    setTimeout(() => setStatus(null), 3e3);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-6 p-6 pb-24 h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold tracking-tight", children: "Aufgaben Import" }, void 0, false, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-text-secondary text-sm", children: "Füge Aufgaben im Textformat ein, um sie deiner App hinzuzufügen." }, void 0, false, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 190,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 188,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: downloadBlueprint,
            className: "p-2 bg-surface-2 hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all",
            title: "Blueprint herunterladen",
            children: /* @__PURE__ */ jsxDEV(FileJson, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 198,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 193,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: downloadCompleteCode,
            className: "p-2 bg-surface-2 hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all",
            title: "Code herunterladen",
            children: /* @__PURE__ */ jsxDEV(Code, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 205,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 200,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ImportScreen.tsx",
      lineNumber: 187,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-surface border border-surface-2 rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setShowGuide(!showGuide),
          className: "w-full p-4 flex items-center justify-between hover:bg-surface-2 transition-colors",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-primary", children: [
              /* @__PURE__ */ jsxDEV(Info, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 217,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Format-Anleitung" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 218,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 216,
              columnNumber: 11
            }, this),
            showGuide ? /* @__PURE__ */ jsxDEV(ChevronUp, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 220,
              columnNumber: 24
            }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 220,
              columnNumber: 60
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 212,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(AnimatePresence, { children: showGuide && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          className: "px-4 pb-4 overflow-hidden border-t border-surface-2",
          children: /* @__PURE__ */ jsxDEV("div", { className: "py-4 space-y-4 text-[11px] text-text-secondary leading-relaxed", children: [
            /* @__PURE__ */ jsxDEV("p", { children: [
              "Nutze das folgende Format für den Import. Trenne Aufgaben mit ",
              /* @__PURE__ */ jsxDEV("code", { className: "text-primary", children: "---" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 232,
                columnNumber: 82
              }, this),
              "."
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 232,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-text-primary", children: "A) SYNTAX_BUILDER" }, void 0, false, {
                  fileName: "/app/applet/src/screens/ImportScreen.tsx",
                  lineNumber: 236,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => loadTemplate("builder"), className: "p-1 hover:text-primary transition-colors flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxDEV(Download, { className: "w-3 h-3" }, void 0, false, {
                      fileName: "/app/applet/src/screens/ImportScreen.tsx",
                      lineNumber: 239,
                      columnNumber: 25
                    }, this),
                    " Laden"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/screens/ImportScreen.tsx",
                    lineNumber: 238,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => copyTemplate("builder"), className: "p-1 hover:text-primary transition-colors flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxDEV(Copy, { className: "w-3 h-3" }, void 0, false, {
                      fileName: "/app/applet/src/screens/ImportScreen.tsx",
                      lineNumber: 242,
                      columnNumber: 25
                    }, this),
                    " Kopieren"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/screens/ImportScreen.tsx",
                    lineNumber: 241,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/screens/ImportScreen.tsx",
                  lineNumber: 237,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 235,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("pre", { className: "p-2 bg-background rounded border border-surface-2 overflow-x-auto", children: [
                "ID: b_01",
                "\n",
                "MODUS: SYNTAX_BUILDER",
                "\n",
                "THEMA: ...",
                "\n",
                "BESCHREIBUNG: ...",
                "\n",
                "STARTCODE: ```kotlin ... ```",
                "\n",
                "HINT1_STRUKTUR: ...",
                "\n",
                "HINT2_ANKER: ...",
                "\n",
                "HINT3_KONTEXT: ```kotlin ... ```",
                "\n",
                "LOESUNG: ```kotlin ... ```"
              ] }, void 0, true, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 246,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 234,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-text-primary", children: "B) ZUORDNUNG" }, void 0, false, {
                  fileName: "/app/applet/src/screens/ImportScreen.tsx",
                  lineNumber: 261,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => loadTemplate("assign"), className: "p-1 hover:text-primary transition-colors flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxDEV(Download, { className: "w-3 h-3" }, void 0, false, {
                      fileName: "/app/applet/src/screens/ImportScreen.tsx",
                      lineNumber: 264,
                      columnNumber: 25
                    }, this),
                    " Laden"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/screens/ImportScreen.tsx",
                    lineNumber: 263,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => copyTemplate("assign"), className: "p-1 hover:text-primary transition-colors flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxDEV(Copy, { className: "w-3 h-3" }, void 0, false, {
                      fileName: "/app/applet/src/screens/ImportScreen.tsx",
                      lineNumber: 267,
                      columnNumber: 25
                    }, this),
                    " Kopieren"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/screens/ImportScreen.tsx",
                    lineNumber: 266,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/screens/ImportScreen.tsx",
                  lineNumber: 262,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 260,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("pre", { className: "p-2 bg-background rounded border border-surface-2 overflow-x-auto", children: [
                "ID: a_01",
                "\n",
                "MODUS: ZUORDNUNG",
                "\n",
                "ZIELCODE: ```kotlin __0__ ... ```",
                "\n",
                "BAUSTEINE_RICHTIG: val,5",
                "\n",
                "BAUSTEINE_DISTRAKTOR: var,const",
                "\n",
                "BAUSTEIN_MAP: __0__ -> val"
              ] }, void 0, true, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 271,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 259,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 231,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 225,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 223,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ImportScreen.tsx",
      lineNumber: 211,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          placeholder: "ID: var_01...",
          className: "w-full h-64 bg-surface border border-surface-2 rounded-xl p-4 font-mono text-xs focus:ring-2 focus:ring-primary outline-none resize-none"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 287,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleImport,
            className: "flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform",
            children: [
              /* @__PURE__ */ jsxDEV(Download, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 299,
                columnNumber: 13
              }, this),
              "Importieren"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 295,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setConfirmDeleteAll(true),
            className: "px-6 bg-surface-2 text-error py-4 rounded-xl font-bold flex items-center justify-center active:scale-95 transition-transform",
            children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 307,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 303,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 294,
        columnNumber: 9
      }, this),
      status && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: `p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-error/20 text-error border border-error/30"}`,
          children: [
            status.type === "success" ? /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 319,
              columnNumber: 42
            }, this) : /* @__PURE__ */ jsxDEV(AlertCircle, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 319,
              columnNumber: 81
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium", children: status.message }, void 0, false, {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 320,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 312,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ImportScreen.tsx",
      lineNumber: 286,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-[10px] uppercase font-mono tracking-widest text-text-secondary", children: [
        "Importierte Aufgaben (",
        customTasks.length,
        ")"
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 326,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: customTasks.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "p-8 text-center border border-dashed border-surface-2 rounded-xl text-text-secondary text-sm", children: "Noch keine Aufgaben importiert." }, void 0, false, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 329,
        columnNumber: 13
      }, this) : customTasks.map((task, idx) => /* @__PURE__ */ jsxDEV("div", { className: "bg-surface p-4 rounded-xl border border-surface-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono text-text-secondary uppercase", children: task.mode }, void 0, false, {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 336,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-sm", children: task.conceptId }, void 0, false, {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 337,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono text-text-secondary", children: task.id }, void 0, false, {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 338,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 335,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                setInputText(exerciseToText(task));
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
              className: "p-2 bg-surface-2 hover:bg-surface-2/80 rounded-lg text-text-secondary hover:text-primary transition-all",
              title: "Bearbeiten",
              children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 349,
                columnNumber: 21
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 341,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setConfirmDeleteId(task.id),
              className: "p-2 bg-surface-2 hover:bg-surface-2/80 rounded-lg text-text-secondary hover:text-error transition-all",
              title: "Löschen",
              children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 356,
                columnNumber: 21
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 351,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 340,
          columnNumber: 17
        }, this)
      ] }, task.id + idx, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 334,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 327,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ImportScreen.tsx",
      lineNumber: 325,
      columnNumber: 7
    }, this),
    Object.keys(exerciseNotes).length > 0 && /* @__PURE__ */ jsxDEV("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-[10px] uppercase font-mono tracking-widest text-text-secondary", children: [
          "Aufgaben-Notizen (",
          Object.keys(exerciseNotes).length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 369,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: copyAllNotes,
            className: "text-[10px] flex items-center gap-1 text-primary hover:underline font-bold",
            children: [
              /* @__PURE__ */ jsxDEV(Copy, { className: "w-3 h-3" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 374,
                columnNumber: 15
              }, this),
              " Alle kopieren"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 370,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 368,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: Object.entries(exerciseNotes).map(([id, note]) => /* @__PURE__ */ jsxDEV("div", { className: "bg-surface p-4 rounded-xl border border-surface-2 space-y-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono text-primary font-bold", children: id }, void 0, false, {
            fileName: "/app/applet/src/screens/ImportScreen.tsx",
            lineNumber: 381,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                navigator.clipboard.writeText(`ID: ${id}
NOTE: ${note}`);
                setStatus({ type: "success", message: "Notiz kopiert!" });
                setTimeout(() => setStatus(null), 2e3);
              },
              className: "p-1.5 hover:bg-surface-2 rounded-lg text-text-secondary transition-colors",
              children: /* @__PURE__ */ jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
                fileName: "/app/applet/src/screens/ImportScreen.tsx",
                lineNumber: 390,
                columnNumber: 21
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/screens/ImportScreen.tsx",
              lineNumber: 382,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 380,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-text-secondary whitespace-pre-wrap leading-relaxed", children: note }, void 0, false, {
          fileName: "/app/applet/src/screens/ImportScreen.tsx",
          lineNumber: 393,
          columnNumber: 17
        }, this)
      ] }, id, true, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 379,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 377,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ImportScreen.tsx",
      lineNumber: 367,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        isOpen: confirmDeleteAll,
        onClose: () => setConfirmDeleteAll(false),
        onConfirm: clearCustomTasks,
        title: "Alle Aufgaben löschen?",
        message: "Bist du sicher, dass du alle importierten Aufgaben unwiderruflich löschen möchtest?"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 403,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        isOpen: !!confirmDeleteId,
        onClose: () => setConfirmDeleteId(null),
        onConfirm: () => confirmDeleteId && removeCustomTask(confirmDeleteId),
        title: "Aufgabe löschen?",
        message: "Bist du sicher, dass du diese Aufgabe löschen möchtest?"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/screens/ImportScreen.tsx",
        lineNumber: 411,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/screens/ImportScreen.tsx",
    lineNumber: 186,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkltcG9ydFNjcmVlbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW90aW9uLCBBbmltYXRlUHJlc2VuY2UgfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgdXNlTGVhcm5pbmdTdG9yZSB9IGZyb20gJy4uL3N0b3JlL3VzZUxlYXJuaW5nU3RvcmUnO1xuaW1wb3J0IHsgcGFyc2VUYXNrcywgZXhlcmNpc2VUb1RleHQgfSBmcm9tICcuLi9zZXJ2aWNlcy90YXNrUGFyc2VyJztcbmltcG9ydCB7IERvd25sb2FkLCBUcmFzaDIsIENoZWNrQ2lyY2xlMiwgQWxlcnRDaXJjbGUsIEluZm8sIENoZXZyb25Eb3duLCBDaGV2cm9uVXAsIENvcHksIEVkaXQyLCBDb2RlLCBGaWxlSnNvbiB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgeyBDb25maXJtTW9kYWwgfSBmcm9tICcuLi9jb21wb25lbnRzL3VpL0NvbmZpcm1Nb2RhbCc7XG5pbXBvcnQgSlNaaXAgZnJvbSAnanN6aXAnO1xuaW1wb3J0IG1ldGFkYXRhIGZyb20gJy4uLy4uL21ldGFkYXRhLmpzb24nO1xuXG5leHBvcnQgY29uc3QgSW1wb3J0U2NyZWVuOiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgY29uc3QgW2lucHV0VGV4dCwgc2V0SW5wdXRUZXh0XSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3Nob3dHdWlkZSwgc2V0U2hvd0d1aWRlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlPHsgdHlwZTogJ3N1Y2Nlc3MnIHwgJ2Vycm9yJywgbWVzc2FnZTogc3RyaW5nIH0gfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2NvbmZpcm1EZWxldGVBbGwsIHNldENvbmZpcm1EZWxldGVBbGxdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY29uZmlybURlbGV0ZUlkLCBzZXRDb25maXJtRGVsZXRlSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IHsgYWRkQ3VzdG9tVGFza3MsIGNsZWFyQ3VzdG9tVGFza3MsIHJlbW92ZUN1c3RvbVRhc2ssIGN1c3RvbVRhc2tzLCBleGVyY2lzZU5vdGVzIH0gPSB1c2VMZWFybmluZ1N0b3JlKCk7XG5cbiAgY29uc3QgaGFuZGxlSW1wb3J0ID0gKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YXNrcyA9IHBhcnNlVGFza3MoaW5wdXRUZXh0KTtcbiAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZWluZSBnw7xsdGlnZW4gQXVmZ2FiZW4gZ2VmdW5kZW4uJyk7XG4gICAgICB9XG4gICAgICBhZGRDdXN0b21UYXNrcyh0YXNrcyk7XG4gICAgICBzZXRTdGF0dXMoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6IGAke3Rhc2tzLmxlbmd0aH0gQXVmZ2FiZW4gZXJmb2xncmVpY2ggaW1wb3J0aWVydCFgIH0pO1xuICAgICAgc2V0SW5wdXRUZXh0KCcnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0U3RhdHVzKG51bGwpLCAzMDAwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldFN0YXR1cyh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnRmVobGVyIGJlaW0gSW1wb3J0aWVyZW4uJyB9KTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0U3RhdHVzKG51bGwpLCAzMDAwKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgbG9hZFRlbXBsYXRlID0gKHR5cGU6ICdidWlsZGVyJyB8ICdhc3NpZ24nKSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGVzID0ge1xuICAgICAgYnVpbGRlcjogYElEOiBiXzA0XG5NT0RVUzogU1lOVEFYX0JVSUxERVJcblRIRU1BOiBGdW5rdGlvbmVuXG5CRVNDSFJFSUJVTkc6IEVyc3RlbGxlIGVpbmUgRnVua3Rpb24gaW5jLCBkaWUgbiAoSW50KSBuaW1tdCB1bmQgbiArIDEgenVyw7xja2dpYnQgKEV4cHJlc3Npb24gQm9keSkuXG5TVEFSVENPREU6XG5cXGBcXGBcXGBrb3RsaW5cbi8vIERlaW4gQ29kZSBoaWVyXG5cXGBcXGBcXGBcbkhJTlQxX1NUUlVLVFVSOiAuLi4gLi4uKC4uLjogLi4uKSA9IC4uLiArIC4uLlxuSElOVDJfQU5LRVI6IC4uLiAuLi4objogSW50KSA9IG4gKyAxXG5ISU5UM19LT05URVhUOiBcblxcYFxcYFxcYGtvdGxpblxuX19fIGluYyhuOiBJbnQpID0gbiArIDEgLy8gTmFtZSBkZXIgRnVua3Rpb24gc3RlaHQgaW4gZGVyIEF1ZmdhYmVcblxcYFxcYFxcYFxuTE9FU1VORzpcblxcYFxcYFxcYGtvdGxpblxuZnVuIGluYyhuOiBJbnQpID0gbiArIDFcblxcYFxcYFxcYGAsXG4gICAgICBhc3NpZ246IGBJRDogYV8wMVxuTU9EVVM6IFpVT1JETlVOR1xuVEhFTUE6IFZhcmlhYmxlblxuQkVTQ0hSRUlCVU5HOiBTZXR6ZSB2YWwgeCA9IDUgenVzYW1tZW5cblNUQVJUQ09ERTpcblxcYFxcYFxcYGtvdGxpblxuXG5cXGBcXGBcXGBcbkhJTlQxX1NUUlVLVFVSOiB2YWwgeCA9IDVcbkhJTlQyX0FOS0VSOiBOdXR6ZSB2YWxcbkhJTlQzX0tPTlRFWFQ6IFZhcmlhYmxlIHhcblpJRUxDT0RFOlxuXFxgXFxgXFxga290bGluXG5fXzBfXyB4ID0gX18xX19cblxcYFxcYFxcYFxuQkFVU1RFSU5FX1JJQ0hUSUc6IHZhbCw1XG5CQVVTVEVJTkVfRElTVFJBS1RPUjogdmFyLGNvbnN0XG5CQVVTVEVJTl9NQVA6XG5fXzBfXyAtPiB2YWxcbl9fMV9fIC0+IDVgXG4gICAgfTtcbiAgICBzZXRJbnB1dFRleHQodGVtcGxhdGVzW3R5cGVdKTtcbiAgICBzZXRTdGF0dXMoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdUZW1wbGF0ZSBnZWxhZGVuIScgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBzZXRTdGF0dXMobnVsbCksIDIwMDApO1xuICB9O1xuXG4gIGNvbnN0IGNvcHlUZW1wbGF0ZSA9ICh0eXBlOiAnYnVpbGRlcicgfCAnYXNzaWduJykgPT4ge1xuICAgIGNvbnN0IHRlbXBsYXRlcyA9IHtcbiAgICAgIGJ1aWxkZXI6IGBJRDogYl8wMVxcbk1PRFVTOiBTWU5UQVhfQlVJTERFUlxcblRIRU1BOiBWYXJpYWJsZW5cXG5CRVNDSFJFSUJVTkc6IERla2xhcmllcmUgdmFsIHggPSA1XFxuU1RBUlRDT0RFOlxcblxcYFxcYFxcYGtvdGxpblxcblxcblxcYFxcYFxcYFxcbkhJTlQxX1NUUlVLVFVSOiB2YWwgLi4uID0gLi4uXFxuSElOVDJfQU5LRVI6IHZhbCB4ID0gNVxcbkhJTlQzX0tPTlRFWFQ6IE51dHplIHZhbFxcbkxPRVNVTkc6XFxuXFxgXFxgXFxga290bGluXFxudmFsIHggPSA1XFxuXFxgXFxgXFxgYCxcbiAgICAgIGFzc2lnbjogYElEOiBhXzAxXFxuTU9EVVM6IFpVT1JETlVOR1xcblRIRU1BOiBWYXJpYWJsZW5cXG5CRVNDSFJFSUJVTkc6IFNldHplIHZhbCB4ID0gNSB6dXNhbW1lblxcblNUQVJUQ09ERTpcXG5cXGBcXGBcXGBrb3RsaW5cXG5cXG5cXGBcXGBcXGBcXG5ISU5UMV9TVFJVS1RVUjogdmFsIHggPSA1XFxuSElOVDJfQU5LRVI6IE51dHplIHZhbFxcbkhJTlQzX0tPTlRFWFQ6IFZhcmlhYmxlIHhcXG5aSUVMQ09ERTpcXG5cXGBcXGBcXGBrb3RsaW5cXG5fXzBfXyB4ID0gX18xX19cXG5cXGBcXGBcXGBcXG5CQVVTVEVJTkVfUklDSFRJRzogdmFsLDVcXG5CQVVTVEVJTkVfRElTVFJBS1RPUjogdmFyLGNvbnN0XFxuQkFVU1RFSU5fTUFQOlxcbl9fMF9fIC0+IHZhbFxcbl9fMV9fIC0+IDVgXG4gICAgfTtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZW1wbGF0ZXNbdHlwZV0pO1xuICAgIHNldFN0YXR1cyh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogJ1RlbXBsYXRlIGtvcGllcnQhJyB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNldFN0YXR1cyhudWxsKSwgMjAwMCk7XG4gIH07XG5cbiAgY29uc3QgY29weUFsbE5vdGVzID0gKCkgPT4ge1xuICAgIGNvbnN0IG5vdGVUZXh0ID0gT2JqZWN0LmVudHJpZXMoZXhlcmNpc2VOb3RlcylcbiAgICAgIC5tYXAoKFtpZCwgbm90ZV0pID0+IGBJRDogJHtpZH1cXG5OT1RFOiAke25vdGV9XFxuLS0tYClcbiAgICAgIC5qb2luKCdcXG5cXG4nKTtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChub3RlVGV4dCk7XG4gICAgc2V0U3RhdHVzKHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnQWxsZSBOb3RpemVuIGtvcGllcnQhJyB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNldFN0YXR1cyhudWxsKSwgMjAwMCk7XG4gIH07XG5cbiAgY29uc3QgZG93bmxvYWRCbHVlcHJpbnQgPSAoKSA9PiB7XG4gICAgY29uc3QgYmx1ZXByaW50ID0ge1xuICAgICAgYXBwTWV0YWRhdGE6IG1ldGFkYXRhLFxuICAgICAgY3VzdG9tVGFza3M6IGN1c3RvbVRhc2tzLFxuICAgICAgZXhlcmNpc2VOb3RlczogZXhlcmNpc2VOb3RlcyxcbiAgICAgIGV4cG9ydGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHZlcnNpb246IFwiMS4wLjBcIlxuICAgIH07XG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW0pTT04uc3RyaW5naWZ5KGJsdWVwcmludCwgbnVsbCwgMildLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIGEuZG93bmxvYWQgPSBga290bGluLW1hc3Rlci1ibHVlcHJpbnQtJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXX0uanNvbmA7XG4gICAgYS5jbGljaygpO1xuICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICBcbiAgICBzZXRTdGF0dXMoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdCbHVlcHJpbnQgaGVydW50ZXJnZWxhZGVuIScgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBzZXRTdGF0dXMobnVsbCksIDIwMDApO1xuICB9O1xuXG4gIGNvbnN0IGRvd25sb2FkQ29tcGxldGVDb2RlID0gYXN5bmMgKCkgPT4ge1xuICAgIHNldFN0YXR1cyh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogJ0NvZGUgd2lyZCBnZWLDvG5kZWx0Li4uJyB9KTtcbiAgICBcbiAgICBjb25zdCB6aXAgPSBuZXcgSlNaaXAoKTtcbiAgICBcbiAgICAvLyBMaXN0IG9mIGZpbGVzIHRvIGluY2x1ZGUgaW4gdGhlIGRvd25sb2FkXG4gICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAncGFja2FnZS5qc29uJyxcbiAgICAgICdtZXRhZGF0YS5qc29uJyxcbiAgICAgICd2aXRlLmNvbmZpZy50cycsXG4gICAgICAndHNjb25maWcuanNvbicsXG4gICAgICAnaW5kZXguaHRtbCcsXG4gICAgICAnc3JjL0FwcC50c3gnLFxuICAgICAgJ3NyYy9tYWluLnRzeCcsXG4gICAgICAnc3JjL2luZGV4LmNzcycsXG4gICAgICAnc3JjL3N0b3JlL3VzZUxlYXJuaW5nU3RvcmUudHMnLFxuICAgICAgJ3NyYy9zZXJ2aWNlcy90YXNrUGFyc2VyLnRzJyxcbiAgICAgICdzcmMvc2VydmljZXMvc3ludGF4QW5hbHl6ZXIudHMnLFxuICAgICAgJ3NyYy9kYXRhL3RvcGljcy50cycsXG4gICAgICAnc3JjL3NjcmVlbnMvRXhlcmNpc2VTY3JlZW4udHN4JyxcbiAgICAgICdzcmMvc2NyZWVucy9JbXBvcnRTY3JlZW4udHN4JyxcbiAgICAgICdzcmMvY29tcG9uZW50cy9lZGl0b3IvS290bGluRWRpdG9yLnRzeCcsXG4gICAgICAnc3JjL2NvbXBvbmVudHMvZWRpdG9yL1Nob3J0Y3V0QmFyLnRzeCcsXG4gICAgICAnc3JjL2NvbXBvbmVudHMvZWRpdG9yL1Jlc2l6ZUhhbmRsZS50c3gnLFxuICAgICAgJ3NyYy9jb21wb25lbnRzL2VkaXRvci9FZGl0b3JGZWVkYmFjay50c3gnLFxuICAgICAgJ3NyYy9jb21wb25lbnRzL2V4ZXJjaXNlL1Rhc2tDYXJkLnRzeCcsXG4gICAgICAnc3JjL2NvbXBvbmVudHMvZXhlcmNpc2UvSGludFBhbmVsLnRzeCcsXG4gICAgICAnc3JjL2NvbXBvbmVudHMvZXhlcmNpc2UvQXNzaWdubWVudFZpZXcudHN4JyxcbiAgICAgICdzcmMvY29tcG9uZW50cy9leGVyY2lzZS9Ob3RlTW9kYWwudHN4JyxcbiAgICAgICdzcmMvY29tcG9uZW50cy91aS9Db25maXJtTW9kYWwudHN4J1xuICAgIF07XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBmaWxlcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC8ke2ZpbGVQYXRofWApO1xuICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIHppcC5maWxlKGZpbGVQYXRoLCBjb250ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBmZXRjaCAke2ZpbGVQYXRofWAsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBjdXN0b20gdGFza3MgYXMgYSBzZXBhcmF0ZSB0ZXh0IGZpbGUgZm9yIGNvbnZlbmllbmNlXG4gICAgICBjb25zdCB0YXNrc1RleHQgPSBjdXN0b21UYXNrcy5tYXAodCA9PiBleGVyY2lzZVRvVGV4dCh0KSkuam9pbignXFxuLS0tXFxuJyk7XG4gICAgICB6aXAuZmlsZSgnY3VzdG9tX3Rhc2tzX2V4cG9ydC50eHQnLCB0YXNrc1RleHQpO1xuXG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgemlwLmdlbmVyYXRlQXN5bmMoeyB0eXBlOiAnYmxvYicgfSk7XG4gICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGNvbnRlbnQpO1xuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgIGEuZG93bmxvYWQgPSBga290bGluLW1hc3Rlci1zb3VyY2UtJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXX0uemlwYDtcbiAgICAgIGEuY2xpY2soKTtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgIFxuICAgICAgc2V0U3RhdHVzKHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnQ29kZSBlcmZvbGdyZWljaCBoZXJ1bnRlcmdlbGFkZW4hJyB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldFN0YXR1cyh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6ICdGZWhsZXIgYmVpbSBCw7xuZGVsbiBkZXMgQ29kZXMuJyB9KTtcbiAgICB9XG4gICAgXG4gICAgc2V0VGltZW91dCgoKSA9PiBzZXRTdGF0dXMobnVsbCksIDMwMDApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC02IHAtNiBwYi0yNCBoLWZ1bGwgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdHJhY2tpbmctdGlnaHRcIj5BdWZnYWJlbiBJbXBvcnQ8L2gxPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtdGV4dC1zZWNvbmRhcnkgdGV4dC1zbVwiPkbDvGdlIEF1ZmdhYmVuIGltIFRleHRmb3JtYXQgZWluLCB1bSBzaWUgZGVpbmVyIEFwcCBoaW56dXp1ZsO8Z2VuLjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICBvbkNsaWNrPXtkb3dubG9hZEJsdWVwcmludH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiBiZy1zdXJmYWNlLTIgaG92ZXI6YmctcHJpbWFyeS8xMCB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOnRleHQtcHJpbWFyeSByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsXCJcbiAgICAgICAgICAgIHRpdGxlPVwiQmx1ZXByaW50IGhlcnVudGVybGFkZW5cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxGaWxlSnNvbiBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgb25DbGljaz17ZG93bmxvYWRDb21wbGV0ZUNvZGV9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwLTIgYmctc3VyZmFjZS0yIGhvdmVyOmJnLXByaW1hcnkvMTAgdGV4dC10ZXh0LXNlY29uZGFyeSBob3Zlcjp0ZXh0LXByaW1hcnkgcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICB0aXRsZT1cIkNvZGUgaGVydW50ZXJsYWRlblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPENvZGUgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIHsvKiBGb3JtYXQgR3VpZGUgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXN1cmZhY2UgYm9yZGVyIGJvcmRlci1zdXJmYWNlLTIgcm91bmRlZC14bCBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93R3VpZGUoIXNob3dHdWlkZSl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHAtNCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gaG92ZXI6Ymctc3VyZmFjZS0yIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICA8SW5mbyBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHVwcGVyY2FzZSB0cmFja2luZy13aWRlclwiPkZvcm1hdC1BbmxlaXR1bmc8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3Nob3dHdWlkZSA/IDxDaGV2cm9uVXAgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+IDogPENoZXZyb25Eb3duIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIFxuICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxuICAgICAgICAgIHtzaG93R3VpZGUgJiYgKFxuICAgICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgICAgaW5pdGlhbD17eyBoZWlnaHQ6IDAsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgICAgYW5pbWF0ZT17eyBoZWlnaHQ6ICdhdXRvJywgb3BhY2l0eTogMSB9fVxuICAgICAgICAgICAgICBleGl0PXt7IGhlaWdodDogMCwgb3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHBiLTQgb3ZlcmZsb3ctaGlkZGVuIGJvcmRlci10IGJvcmRlci1zdXJmYWNlLTJcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB5LTQgc3BhY2UteS00IHRleHQtWzExcHhdIHRleHQtdGV4dC1zZWNvbmRhcnkgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgPHA+TnV0emUgZGFzIGZvbGdlbmRlIEZvcm1hdCBmw7xyIGRlbiBJbXBvcnQuIFRyZW5uZSBBdWZnYWJlbiBtaXQgPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+LS0tPC9jb2RlPi48L3A+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPkEpIFNZTlRBWF9CVUlMREVSPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGxvYWRUZW1wbGF0ZSgnYnVpbGRlcicpfSBjbGFzc05hbWU9XCJwLTEgaG92ZXI6dGV4dC1wcmltYXJ5IHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RG93bmxvYWQgY2xhc3NOYW1lPVwidy0zIGgtM1wiIC8+IExhZGVuXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBjb3B5VGVtcGxhdGUoJ2J1aWxkZXInKX0gY2xhc3NOYW1lPVwicC0xIGhvdmVyOnRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENvcHkgY2xhc3NOYW1lPVwidy0zIGgtM1wiIC8+IEtvcGllcmVuXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzTmFtZT1cInAtMiBiZy1iYWNrZ3JvdW5kIHJvdW5kZWQgYm9yZGVyIGJvcmRlci1zdXJmYWNlLTIgb3ZlcmZsb3cteC1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgIElEOiBiXzAxe1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIE1PRFVTOiBTWU5UQVhfQlVJTERFUntcIlxcblwifVxuICAgICAgICAgICAgICAgICAgICBUSEVNQTogLi4ue1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIEJFU0NIUkVJQlVORzogLi4ue1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIFNUQVJUQ09ERTogYGBga290bGluIC4uLiBgYGB7XCJcXG5cIn1cbiAgICAgICAgICAgICAgICAgICAgSElOVDFfU1RSVUtUVVI6IC4uLntcIlxcblwifVxuICAgICAgICAgICAgICAgICAgICBISU5UMl9BTktFUjogLi4ue1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIEhJTlQzX0tPTlRFWFQ6IGBgYGtvdGxpbiAuLi4gYGBge1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIExPRVNVTkc6IGBgYGtvdGxpbiAuLi4gYGBgXG4gICAgICAgICAgICAgICAgICA8L3ByZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC10ZXh0LXByaW1hcnlcIj5CKSBaVU9SRE5VTkc8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gbG9hZFRlbXBsYXRlKCdhc3NpZ24nKX0gY2xhc3NOYW1lPVwicC0xIGhvdmVyOnRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPERvd25sb2FkIGNsYXNzTmFtZT1cInctMyBoLTNcIiAvPiBMYWRlblxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gY29weVRlbXBsYXRlKCdhc3NpZ24nKX0gY2xhc3NOYW1lPVwicC0xIGhvdmVyOnRleHQtcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENvcHkgY2xhc3NOYW1lPVwidy0zIGgtM1wiIC8+IEtvcGllcmVuXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzTmFtZT1cInAtMiBiZy1iYWNrZ3JvdW5kIHJvdW5kZWQgYm9yZGVyIGJvcmRlci1zdXJmYWNlLTIgb3ZlcmZsb3cteC1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgIElEOiBhXzAxe1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIE1PRFVTOiBaVU9SRE5VTkd7XCJcXG5cIn1cbiAgICAgICAgICAgICAgICAgICAgWklFTENPREU6IGBgYGtvdGxpbiBfXzBfXyAuLi4gYGBge1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIEJBVVNURUlORV9SSUNIVElHOiB2YWwsNXtcIlxcblwifVxuICAgICAgICAgICAgICAgICAgICBCQVVTVEVJTkVfRElTVFJBS1RPUjogdmFyLGNvbnN0e1wiXFxuXCJ9XG4gICAgICAgICAgICAgICAgICAgIHtcIkJBVVNURUlOX01BUDogX18wX18gLT4gdmFsXCJ9XG4gICAgICAgICAgICAgICAgICA8L3ByZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC00XCI+XG4gICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgIHZhbHVlPXtpbnB1dFRleHR9XG4gICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRJbnB1dFRleHQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSUQ6IHZhcl8wMS4uLlwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtNjQgYmctc3VyZmFjZSBib3JkZXIgYm9yZGVyLXN1cmZhY2UtMiByb3VuZGVkLXhsIHAtNCBmb250LW1vbm8gdGV4dC14cyBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5IG91dGxpbmUtbm9uZSByZXNpemUtbm9uZVwiXG4gICAgICAgIC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlSW1wb3J0fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIGJnLXByaW1hcnkgdGV4dC13aGl0ZSBweS00IHJvdW5kZWQteGwgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLXRyYW5zZm9ybVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPERvd25sb2FkIGNsYXNzTmFtZT1cInctNSBoLTVcIiAvPlxuICAgICAgICAgICAgSW1wb3J0aWVyZW5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICBcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlQWxsKHRydWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNiBiZy1zdXJmYWNlLTIgdGV4dC1lcnJvciBweS00IHJvdW5kZWQteGwgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLXRyYW5zZm9ybVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRyYXNoMiBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3N0YXR1cyAmJiAoXG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeTogMTAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC00IHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgJHtcbiAgICAgICAgICAgICAgc3RhdHVzLnR5cGUgPT09ICdzdWNjZXNzJyA/ICdiZy1zdWNjZXNzLzIwIHRleHQtc3VjY2VzcyBib3JkZXIgYm9yZGVyLXN1Y2Nlc3MvMzAnIDogJ2JnLWVycm9yLzIwIHRleHQtZXJyb3IgYm9yZGVyIGJvcmRlci1lcnJvci8zMCdcbiAgICAgICAgICAgIH1gfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtzdGF0dXMudHlwZSA9PT0gJ3N1Y2Nlc3MnID8gPENoZWNrQ2lyY2xlMiBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz4gOiA8QWxlcnRDaXJjbGUgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+fVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bVwiPntzdGF0dXMubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIGZvbnQtbW9ubyB0cmFja2luZy13aWRlc3QgdGV4dC10ZXh0LXNlY29uZGFyeVwiPkltcG9ydGllcnRlIEF1ZmdhYmVuICh7Y3VzdG9tVGFza3MubGVuZ3RofSk8L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgIHtjdXN0b21UYXNrcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtOCB0ZXh0LWNlbnRlciBib3JkZXIgYm9yZGVyLWRhc2hlZCBib3JkZXItc3VyZmFjZS0yIHJvdW5kZWQteGwgdGV4dC10ZXh0LXNlY29uZGFyeSB0ZXh0LXNtXCI+XG4gICAgICAgICAgICAgIE5vY2gga2VpbmUgQXVmZ2FiZW4gaW1wb3J0aWVydC5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICBjdXN0b21UYXNrcy5tYXAoKHRhc2ssIGlkeCkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17dGFzay5pZCArIGlkeH0gY2xhc3NOYW1lPVwiYmctc3VyZmFjZSBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXN1cmZhY2UtMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXRleHQtc2Vjb25kYXJ5IHVwcGVyY2FzZVwiPnt0YXNrLm1vZGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc21cIj57dGFzay5jb25jZXB0SWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dGFzay5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldElucHV0VGV4dChleGVyY2lzZVRvVGV4dCh0YXNrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiBiZy1zdXJmYWNlLTIgaG92ZXI6Ymctc3VyZmFjZS0yLzgwIHJvdW5kZWQtbGcgdGV4dC10ZXh0LXNlY29uZGFyeSBob3Zlcjp0ZXh0LXByaW1hcnkgdHJhbnNpdGlvbi1hbGxcIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkJlYXJiZWl0ZW5cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8RWRpdDIgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENvbmZpcm1EZWxldGVJZCh0YXNrLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0yIGJnLXN1cmZhY2UtMiBob3ZlcjpiZy1zdXJmYWNlLTIvODAgcm91bmRlZC1sZyB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOnRleHQtZXJyb3IgdHJhbnNpdGlvbi1hbGxcIlxuICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkzDtnNjaGVuXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFRyYXNoMiBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpXG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHsvKiBFeGVyY2lzZSBOb3RlcyBTZWN0aW9uICovfVxuICAgICAge09iamVjdC5rZXlzKGV4ZXJjaXNlTm90ZXMpLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSBmb250LW1vbm8gdHJhY2tpbmctd2lkZXN0IHRleHQtdGV4dC1zZWNvbmRhcnlcIj5BdWZnYWJlbi1Ob3RpemVuICh7T2JqZWN0LmtleXMoZXhlcmNpc2VOb3RlcykubGVuZ3RofSk8L2gyPlxuICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgb25DbGljaz17Y29weUFsbE5vdGVzfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXByaW1hcnkgaG92ZXI6dW5kZXJsaW5lIGZvbnQtYm9sZFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxDb3B5IGNsYXNzTmFtZT1cInctMyBoLTNcIiAvPiBBbGxlIGtvcGllcmVuXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgICAge09iamVjdC5lbnRyaWVzKGV4ZXJjaXNlTm90ZXMpLm1hcCgoW2lkLCBub3RlXSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17aWR9IGNsYXNzTmFtZT1cImJnLXN1cmZhY2UgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zdXJmYWNlLTIgc3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXByaW1hcnkgZm9udC1ib2xkXCI+e2lkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChgSUQ6ICR7aWR9XFxuTk9URTogJHtub3RlfWApO1xuICAgICAgICAgICAgICAgICAgICAgIHNldFN0YXR1cyh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogJ05vdGl6IGtvcGllcnQhJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNldFN0YXR1cyhudWxsKSwgMjAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGhvdmVyOmJnLXN1cmZhY2UtMiByb3VuZGVkLWxnIHRleHQtdGV4dC1zZWNvbmRhcnkgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8Q29weSBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtdGV4dC1zZWNvbmRhcnkgd2hpdGVzcGFjZS1wcmUtd3JhcCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgIHtub3RlfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgKX1cblxuICAgICAgey8qIE1vZGFscyAqL31cbiAgICAgIDxDb25maXJtTW9kYWxcbiAgICAgICAgaXNPcGVuPXtjb25maXJtRGVsZXRlQWxsfVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlQWxsKGZhbHNlKX1cbiAgICAgICAgb25Db25maXJtPXtjbGVhckN1c3RvbVRhc2tzfVxuICAgICAgICB0aXRsZT1cIkFsbGUgQXVmZ2FiZW4gbMO2c2NoZW4/XCJcbiAgICAgICAgbWVzc2FnZT1cIkJpc3QgZHUgc2ljaGVyLCBkYXNzIGR1IGFsbGUgaW1wb3J0aWVydGVuIEF1ZmdhYmVuIHVud2lkZXJydWZsaWNoIGzDtnNjaGVuIG3DtmNodGVzdD9cIlxuICAgICAgLz5cblxuICAgICAgPENvbmZpcm1Nb2RhbFxuICAgICAgICBpc09wZW49eyEhY29uZmlybURlbGV0ZUlkfVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlSWQobnVsbCl9XG4gICAgICAgIG9uQ29uZmlybT17KCkgPT4gY29uZmlybURlbGV0ZUlkICYmIHJlbW92ZUN1c3RvbVRhc2soY29uZmlybURlbGV0ZUlkKX1cbiAgICAgICAgdGl0bGU9XCJBdWZnYWJlIGzDtnNjaGVuP1wiXG4gICAgICAgIG1lc3NhZ2U9XCJCaXN0IGR1IHNpY2hlciwgZGFzcyBkdSBkaWVzZSBBdWZnYWJlIGzDtnNjaGVuIG3DtmNodGVzdD9cIlxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQTRMVTtBQTVMVixTQUFnQixnQkFBZ0I7QUFDaEMsU0FBUyxRQUFRLHVCQUF1QjtBQUN4QyxTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLFlBQVksc0JBQXNCO0FBQzNDLFNBQVMsVUFBVSxRQUFRLGNBQWMsYUFBYSxNQUFNLGFBQWEsV0FBVyxNQUFNLE9BQU8sTUFBTSxnQkFBZ0I7QUFDdkgsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYztBQUVkLGFBQU0sZUFBeUIsTUFBTTtBQUMxQyxRQUFNLENBQUMsV0FBVyxZQUFZLElBQUksU0FBUyxFQUFFO0FBQzdDLFFBQU0sQ0FBQyxXQUFXLFlBQVksSUFBSSxTQUFTLEtBQUs7QUFDaEQsUUFBTSxDQUFDLFFBQVEsU0FBUyxJQUFJLFNBQWdFLElBQUk7QUFDaEcsUUFBTSxDQUFDLGtCQUFrQixtQkFBbUIsSUFBSSxTQUFTLEtBQUs7QUFDOUQsUUFBTSxDQUFDLGlCQUFp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