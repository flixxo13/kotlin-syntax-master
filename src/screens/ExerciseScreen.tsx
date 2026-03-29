import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { useLearningStore } from "/src/store/useLearningStore.ts";
import { TOPICS } from "/src/data/topics.ts";
import { KotlinEditor } from "/src/components/editor/KotlinEditor.tsx";
import { ShortcutBar } from "/src/components/editor/ShortcutBar.tsx";
import { ResizeHandle } from "/src/components/editor/ResizeHandle.tsx";
import { TaskCard } from "/src/components/exercise/TaskCard.tsx";
import { HintPanel } from "/src/components/exercise/HintPanel.tsx";
import { AssignmentView } from "/src/components/exercise/AssignmentView.tsx";
import { CheckCircle2, XCircle, ArrowLeft, Play, MessageSquare } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
import { EditorFeedback } from "/src/components/editor/EditorFeedback.tsx";
import { analyzeKotlinSyntax } from "/src/services/syntaxAnalyzer.ts";
import { NoteModal } from "/src/components/exercise/NoteModal.tsx";
export const ExerciseScreen = ({ topicId, conceptId, exerciseId, onBack }) => {
  const {
    editorHeight,
    setEditorHeight,
    currentHintLevel,
    requestHint,
    revealSolution,
    completeExercise,
    customTasks,
    resetHint,
    startSession,
    exerciseNotes,
    saveExerciseNote
  } = useLearningStore();
  const [code, setCode] = useState("");
  const [isTaskCollapsed, setIsTaskCollapsed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [syntaxFeedback, setSyntaxFeedback] = useState([]);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  let exercise = null;
  if (topicId === "custom" && exerciseId) {
    exercise = customTasks.find((t) => t.id === exerciseId);
  } else {
    const topic = TOPICS.find((t) => t.id === topicId);
    const concept = topic?.concepts.find((c) => c.id === conceptId);
    exercise = concept?.exercises.find((e) => e.id === exerciseId) || concept?.exercises[0];
  }
  useEffect(() => {
    resetHint();
    if (exercise) {
      setCode(exercise.initialCode || "");
      startSession(topicId, conceptId, exercise.mode);
    }
  }, [exercise, resetHint, startSession, topicId, conceptId]);
  useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize2 = () => {
      const currentHeight = window.innerHeight;
      setIsKeyboardVisible(currentHeight < initialHeight * 0.8);
    };
    window.addEventListener("resize", handleResize2);
    return () => window.removeEventListener("resize", handleResize2);
  }, []);
  useEffect(() => {
    if (exercise && exercise.mode === "builder") {
      const feedback2 = analyzeKotlinSyntax(code, exercise.solution);
      setSyntaxFeedback(feedback2);
    } else {
      setSyntaxFeedback([]);
    }
  }, [code, exercise]);
  if (!exercise) return /* @__PURE__ */ jsxDEV("div", { children: "Übung nicht gefunden" }, void 0, false, {
    fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
    lineNumber: 84,
    columnNumber: 25
  }, this);
  const handleCheck = (isCorrect) => {
    const normalize = (s) => s.replace(/\s+/g, " ").trim();
    const correct = typeof isCorrect === "boolean" ? isCorrect : normalize(code) === normalize(exercise.solution);
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) {
      setTimeout(() => {
        completeExercise(exercise.id, exercise.conceptId, currentHintLevel);
        onBack();
      }, 1500);
    } else {
      setTimeout(() => setFeedback(null), 1e3);
    }
  };
  useEffect(() => {
    if (currentHintLevel === "revealed" && exercise?.solution) {
      setCode(exercise.solution);
    }
  }, [currentHintLevel, exercise]);
  const handleInsert = (text) => {
    setCode((prev) => prev + text);
  };
  const handleResize = (e) => {
    e.preventDefault();
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const startHeight = editorHeight;
    const onMove = (moveEvent) => {
      const currentY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const delta = currentY - startY;
      const newHeight = Math.max(100, Math.min(window.innerHeight * 0.7, startHeight + delta));
      setEditorHeight(newHeight);
    };
    const onEnd = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    document.body.style.cursor = "ns-resize";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  };
  const showFooter = exercise.mode === "builder" && !isEditorFocused && !isKeyboardVisible;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-screen bg-background text-text-primary overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "h-14 bg-surface flex items-center px-4 justify-between border-b border-surface-2 shrink-0 z-20", children: [
      /* @__PURE__ */ jsxDEV("button", { onClick: onBack, className: "p-2 hover:bg-surface-2 rounded-full transition-colors", children: /* @__PURE__ */ jsxDEV(ArrowLeft, { className: "w-5 h-5" }, void 0, false, {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 146,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 145,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-mono tracking-widest text-text-secondary", children: "Übung" }, void 0, false, {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 149,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold", children: exercise.conceptId }, void 0, false, {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 150,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 148,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setIsNoteModalOpen(true),
          className: `p-2 rounded-full transition-all active:scale-95 ${exerciseNotes[exercise.id] ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-surface-2 text-text-secondary"}`,
          title: "Notiz hinzufügen",
          children: /* @__PURE__ */ jsxDEV(MessageSquare, { className: "w-5 h-5" }, void 0, false, {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 159,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 152,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
      lineNumber: 144,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 flex flex-col overflow-hidden relative", children: [
      /* @__PURE__ */ jsxDEV(AnimatePresence, { children: !isKeyboardVisible && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          className: "overflow-hidden shrink-0",
          children: /* @__PURE__ */ jsxDEV(
            TaskCard,
            {
              task: exercise.task,
              isCollapsed: isTaskCollapsed,
              onToggle: () => setIsTaskCollapsed(!isTaskCollapsed)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 172,
              columnNumber: 15
            },
            this
          )
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 167,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col overflow-hidden relative", children: [
        exercise.mode === "builder" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(ShortcutBar, { onInsert: handleInsert }, void 0, false, {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 184,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden flex flex-col shrink-0", children: [
            /* @__PURE__ */ jsxDEV(EditorFeedback, { elements: syntaxFeedback }, void 0, false, {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 187,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              KotlinEditor,
              {
                code,
                onChange: setCode,
                height: editorHeight,
                onFocus: () => setIsEditorFocused(true),
                onBlur: () => setIsEditorFocused(false)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
                lineNumber: 188,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 186,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            ResizeHandle,
            {
              onResize: handleResize,
              onReset: () => setEditorHeight(250)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 197,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto bg-background/50" }, void 0, false, {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 202,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 183,
          columnNumber: 13
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxDEV(
          AssignmentView,
          {
            zielCode: exercise.assignmentData?.zielCode || "",
            bausteineRichtig: exercise.assignmentData?.bausteineRichtig || [],
            bausteineDistraktor: exercise.assignmentData?.bausteineDistraktor || [],
            map: exercise.assignmentData?.map || {},
            onComplete: handleCheck,
            currentHintLevel
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 208,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        !isKeyboardVisible && /* @__PURE__ */ jsxDEV(
          HintPanel,
          {
            currentLevel: currentHintLevel,
            hints: exercise.hints,
            onRequestHint: requestHint,
            onRevealSolution: revealSolution
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 220,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 181,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
      lineNumber: 164,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: showFooter && /* @__PURE__ */ jsxDEV(
      motion.footer,
      {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
        className: "p-4 bg-surface border-t border-surface-2 shrink-0 z-20",
        children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleCheck(),
            disabled: feedback === "correct",
            className: `w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${feedback === "correct" ? "bg-success text-white" : feedback === "incorrect" ? "bg-error text-white animate-shake" : "bg-primary text-white shadow-lg shadow-primary/20"}`,
            children: feedback === "correct" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
                lineNumber: 249,
                columnNumber: 19
              }, this),
              " Richtig!"
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 249,
              columnNumber: 17
            }, this) : feedback === "incorrect" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(XCircle, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
                lineNumber: 251,
                columnNumber: 19
              }, this),
              " Falsch!"
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 251,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Play, { className: "w-5 h-5 fill-current" }, void 0, false, {
                fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
                lineNumber: 253,
                columnNumber: 19
              }, this),
              " Syntax prüfen"
            ] }, void 0, true, {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 253,
              columnNumber: 17
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 239,
            columnNumber: 13
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 233,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
      lineNumber: 231,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: feedback === "correct" && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-success/20 pointer-events-none z-50 flex items-center justify-center",
        children: /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "bg-success p-8 rounded-full shadow-2xl",
            children: /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "w-16 h-16 text-white" }, void 0, false, {
              fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
              lineNumber: 274,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
            lineNumber: 269,
            columnNumber: 13
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 263,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
      lineNumber: 261,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      NoteModal,
      {
        isOpen: isNoteModalOpen,
        onClose: () => setIsNoteModalOpen(false),
        onSave: (note) => saveExerciseNote(exercise.id, note),
        initialNote: exerciseNotes[exercise.id] || "",
        exerciseId: exercise.id
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
        lineNumber: 280,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/screens/ExerciseScreen.tsx",
    lineNumber: 142,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4ZXJjaXNlU2NyZWVuLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IHVzZUxlYXJuaW5nU3RvcmUgfSBmcm9tICcuLi9zdG9yZS91c2VMZWFybmluZ1N0b3JlJztcbmltcG9ydCB7IFRPUElDUyB9IGZyb20gJy4uL2RhdGEvdG9waWNzJztcbmltcG9ydCB7IEtvdGxpbkVkaXRvciB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yL0tvdGxpbkVkaXRvcic7XG5pbXBvcnQgeyBTaG9ydGN1dEJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yL1Nob3J0Y3V0QmFyJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yL1Jlc2l6ZUhhbmRsZSc7XG5pbXBvcnQgeyBUYXNrQ2FyZCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZXhlcmNpc2UvVGFza0NhcmQnO1xuaW1wb3J0IHsgSGludFBhbmVsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9leGVyY2lzZS9IaW50UGFuZWwnO1xuaW1wb3J0IHsgQXNzaWdubWVudFZpZXcgfSBmcm9tICcuLi9jb21wb25lbnRzL2V4ZXJjaXNlL0Fzc2lnbm1lbnRWaWV3JztcbmltcG9ydCB7IENoZWNrQ2lyY2xlMiwgWENpcmNsZSwgQXJyb3dMZWZ0LCBQbGF5LCBNZXNzYWdlU3F1YXJlIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IEVkaXRvckZlZWRiYWNrLCBGZWVkYmFja0VsZW1lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2VkaXRvci9FZGl0b3JGZWVkYmFjayc7XG5pbXBvcnQgeyBhbmFseXplS290bGluU3ludGF4IH0gZnJvbSAnLi4vc2VydmljZXMvc3ludGF4QW5hbHl6ZXInO1xuaW1wb3J0IHsgTm90ZU1vZGFsIH0gZnJvbSAnLi4vY29tcG9uZW50cy9leGVyY2lzZS9Ob3RlTW9kYWwnO1xuXG5pbnRlcmZhY2UgRXhlcmNpc2VTY3JlZW5Qcm9wcyB7XG4gIHRvcGljSWQ6IHN0cmluZztcbiAgY29uY2VwdElkOiBzdHJpbmc7XG4gIGV4ZXJjaXNlSWQ/OiBzdHJpbmc7XG4gIG9uQmFjazogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEV4ZXJjaXNlU2NyZWVuOiBSZWFjdC5GQzxFeGVyY2lzZVNjcmVlblByb3BzPiA9ICh7IHRvcGljSWQsIGNvbmNlcHRJZCwgZXhlcmNpc2VJZCwgb25CYWNrIH0pID0+IHtcbiAgY29uc3QgeyBcbiAgICBlZGl0b3JIZWlnaHQsIFxuICAgIHNldEVkaXRvckhlaWdodCwgXG4gICAgY3VycmVudEhpbnRMZXZlbCwgXG4gICAgcmVxdWVzdEhpbnQsIFxuICAgIHJldmVhbFNvbHV0aW9uLFxuICAgIGNvbXBsZXRlRXhlcmNpc2UsXG4gICAgY3VzdG9tVGFza3MsXG4gICAgcmVzZXRIaW50LFxuICAgIHN0YXJ0U2Vzc2lvbixcbiAgICBleGVyY2lzZU5vdGVzLFxuICAgIHNhdmVFeGVyY2lzZU5vdGVcbiAgfSA9IHVzZUxlYXJuaW5nU3RvcmUoKTtcblxuICBjb25zdCBbY29kZSwgc2V0Q29kZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtpc1Rhc2tDb2xsYXBzZWQsIHNldElzVGFza0NvbGxhcHNlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtmZWVkYmFjaywgc2V0RmVlZGJhY2tdID0gdXNlU3RhdGU8J2NvcnJlY3QnIHwgJ2luY29ycmVjdCcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3N5bnRheEZlZWRiYWNrLCBzZXRTeW50YXhGZWVkYmFja10gPSB1c2VTdGF0ZTxGZWVkYmFja0VsZW1lbnRbXT4oW10pO1xuICBjb25zdCBbaXNFZGl0b3JGb2N1c2VkLCBzZXRJc0VkaXRvckZvY3VzZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNLZXlib2FyZFZpc2libGUsIHNldElzS2V5Ym9hcmRWaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzTm90ZU1vZGFsT3Blbiwgc2V0SXNOb3RlTW9kYWxPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBGaW5kIGV4ZXJjaXNlXG4gIGxldCBleGVyY2lzZSA9IG51bGw7XG4gIGlmICh0b3BpY0lkID09PSAnY3VzdG9tJyAmJiBleGVyY2lzZUlkKSB7XG4gICAgZXhlcmNpc2UgPSBjdXN0b21UYXNrcy5maW5kKHQgPT4gdC5pZCA9PT0gZXhlcmNpc2VJZCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdG9waWMgPSBUT1BJQ1MuZmluZCh0ID0+IHQuaWQgPT09IHRvcGljSWQpO1xuICAgIGNvbnN0IGNvbmNlcHQgPSB0b3BpYz8uY29uY2VwdHMuZmluZChjID0+IGMuaWQgPT09IGNvbmNlcHRJZCk7XG4gICAgZXhlcmNpc2UgPSBjb25jZXB0Py5leGVyY2lzZXMuZmluZChlID0+IGUuaWQgPT09IGV4ZXJjaXNlSWQpIHx8IGNvbmNlcHQ/LmV4ZXJjaXNlc1swXTtcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmVzZXRIaW50KCk7XG4gICAgaWYgKGV4ZXJjaXNlKSB7XG4gICAgICBzZXRDb2RlKGV4ZXJjaXNlLmluaXRpYWxDb2RlIHx8ICcnKTtcbiAgICAgIHN0YXJ0U2Vzc2lvbih0b3BpY0lkLCBjb25jZXB0SWQsIGV4ZXJjaXNlLm1vZGUpO1xuICAgIH1cbiAgfSwgW2V4ZXJjaXNlLCByZXNldEhpbnQsIHN0YXJ0U2Vzc2lvbiwgdG9waWNJZCwgY29uY2VwdElkXSk7XG5cbiAgLy8gRGV0ZWN0IGtleWJvYXJkIHZpc2liaWxpdHkgdmlhIHdpbmRvdyBoZWlnaHQgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGluaXRpYWxIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIHNldElzS2V5Ym9hcmRWaXNpYmxlKGN1cnJlbnRIZWlnaHQgPCBpbml0aWFsSGVpZ2h0ICogMC44KTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGV4ZXJjaXNlICYmIGV4ZXJjaXNlLm1vZGUgPT09ICdidWlsZGVyJykge1xuICAgICAgY29uc3QgZmVlZGJhY2sgPSBhbmFseXplS290bGluU3ludGF4KGNvZGUsIGV4ZXJjaXNlLnNvbHV0aW9uKTtcbiAgICAgIHNldFN5bnRheEZlZWRiYWNrKGZlZWRiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U3ludGF4RmVlZGJhY2soW10pO1xuICAgIH1cbiAgfSwgW2NvZGUsIGV4ZXJjaXNlXSk7XG5cbiAgaWYgKCFleGVyY2lzZSkgcmV0dXJuIDxkaXY+w5xidW5nIG5pY2h0IGdlZnVuZGVuPC9kaXY+O1xuXG4gIGNvbnN0IGhhbmRsZUNoZWNrID0gKGlzQ29ycmVjdD86IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBub3JtYWxpemUgPSAoczogc3RyaW5nKSA9PiBzLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gICAgY29uc3QgY29ycmVjdCA9IHR5cGVvZiBpc0NvcnJlY3QgPT09ICdib29sZWFuJyA/IGlzQ29ycmVjdCA6IG5vcm1hbGl6ZShjb2RlKSA9PT0gbm9ybWFsaXplKGV4ZXJjaXNlLnNvbHV0aW9uKTtcbiAgICBzZXRGZWVkYmFjayhjb3JyZWN0ID8gJ2NvcnJlY3QnIDogJ2luY29ycmVjdCcpO1xuICAgIFxuICAgIGlmIChjb3JyZWN0KSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29tcGxldGVFeGVyY2lzZShleGVyY2lzZS5pZCwgZXhlcmNpc2UuY29uY2VwdElkLCBjdXJyZW50SGludExldmVsKTtcbiAgICAgICAgb25CYWNrKCk7XG4gICAgICB9LCAxNTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRGZWVkYmFjayhudWxsKSwgMTAwMCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFdoZW4gc29sdXRpb24gaXMgcmV2ZWFsZWQsIHVwZGF0ZSBjb2RlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGN1cnJlbnRIaW50TGV2ZWwgPT09ICdyZXZlYWxlZCcgJiYgZXhlcmNpc2U/LnNvbHV0aW9uKSB7XG4gICAgICBzZXRDb2RlKGV4ZXJjaXNlLnNvbHV0aW9uKTtcbiAgICB9XG4gIH0sIFtjdXJyZW50SGludExldmVsLCBleGVyY2lzZV0pO1xuXG4gIGNvbnN0IGhhbmRsZUluc2VydCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICBzZXRDb2RlKHByZXYgPT4gcHJldiArIHRleHQpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVJlc2l6ZSA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50IHwgUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzdGFydFkgPSAndG91Y2hlcycgaW4gZSA/IGUudG91Y2hlc1swXS5jbGllbnRZIDogZS5jbGllbnRZO1xuICAgIGNvbnN0IHN0YXJ0SGVpZ2h0ID0gZWRpdG9ySGVpZ2h0O1xuXG4gICAgY29uc3Qgb25Nb3ZlID0gKG1vdmVFdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRZID0gJ3RvdWNoZXMnIGluIG1vdmVFdmVudCA/IG1vdmVFdmVudC50b3VjaGVzWzBdLmNsaWVudFkgOiBtb3ZlRXZlbnQuY2xpZW50WTtcbiAgICAgIGNvbnN0IGRlbHRhID0gY3VycmVudFkgLSBzdGFydFk7XG4gICAgICBjb25zdCBuZXdIZWlnaHQgPSBNYXRoLm1heCgxMDAsIE1hdGgubWluKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNywgc3RhcnRIZWlnaHQgKyBkZWx0YSkpO1xuICAgICAgc2V0RWRpdG9ySGVpZ2h0KG5ld0hlaWdodCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25FbmQpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uTW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkVuZCk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ25zLXJlc2l6ZSc7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbkVuZCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uTW92ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkVuZCk7XG4gIH07XG5cbiAgY29uc3Qgc2hvd0Zvb3RlciA9IGV4ZXJjaXNlLm1vZGUgPT09ICdidWlsZGVyJyAmJiAhaXNFZGl0b3JGb2N1c2VkICYmICFpc0tleWJvYXJkVmlzaWJsZTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBoLXNjcmVlbiBiZy1iYWNrZ3JvdW5kIHRleHQtdGV4dC1wcmltYXJ5IG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiaC0xNCBiZy1zdXJmYWNlIGZsZXggaXRlbXMtY2VudGVyIHB4LTQganVzdGlmeS1iZXR3ZWVuIGJvcmRlci1iIGJvcmRlci1zdXJmYWNlLTIgc2hyaW5rLTAgei0yMFwiPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja30gY2xhc3NOYW1lPVwicC0yIGhvdmVyOmJnLXN1cmZhY2UtMiByb3VuZGVkLWZ1bGwgdHJhbnNpdGlvbi1jb2xvcnNcIj5cbiAgICAgICAgICA8QXJyb3dMZWZ0IGNsYXNzTmFtZT1cInctNSBoLTVcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSBmb250LW1vbm8gdHJhY2tpbmctd2lkZXN0IHRleHQtdGV4dC1zZWNvbmRhcnlcIj7DnGJ1bmc8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGRcIj57ZXhlcmNpc2UuY29uY2VwdElkfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNOb3RlTW9kYWxPcGVuKHRydWUpfVxuICAgICAgICAgIGNsYXNzTmFtZT17YHAtMiByb3VuZGVkLWZ1bGwgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1ICR7XG4gICAgICAgICAgICBleGVyY2lzZU5vdGVzW2V4ZXJjaXNlLmlkXSA/ICdiZy1wcmltYXJ5LzEwIHRleHQtcHJpbWFyeSBib3JkZXIgYm9yZGVyLXByaW1hcnkvMjAnIDogJ2hvdmVyOmJnLXN1cmZhY2UtMiB0ZXh0LXRleHQtc2Vjb25kYXJ5J1xuICAgICAgICAgIH1gfVxuICAgICAgICAgIHRpdGxlPVwiTm90aXogaGluenVmw7xnZW5cIlxuICAgICAgICA+XG4gICAgICAgICAgPE1lc3NhZ2VTcXVhcmUgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIHsvKiBNYWluIENvbnRlbnQgKi99XG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBvdmVyZmxvdy1oaWRkZW4gcmVsYXRpdmVcIj5cbiAgICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAgICB7IWlzS2V5Ym9hcmRWaXNpYmxlICYmIChcbiAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgIGluaXRpYWw9e3sgaGVpZ2h0OiAnYXV0bycsIG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICAgICAgZXhpdD17eyBoZWlnaHQ6IDAsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwib3ZlcmZsb3ctaGlkZGVuIHNocmluay0wXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRhc2tDYXJkIFxuICAgICAgICAgICAgICAgIHRhc2s9e2V4ZXJjaXNlLnRhc2t9IFxuICAgICAgICAgICAgICAgIGlzQ29sbGFwc2VkPXtpc1Rhc2tDb2xsYXBzZWR9IFxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRJc1Rhc2tDb2xsYXBzZWQoIWlzVGFza0NvbGxhcHNlZCl9IFxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGZsZXggZmxleC1jb2wgb3ZlcmZsb3ctaGlkZGVuIHJlbGF0aXZlXCI+XG4gICAgICAgICAge2V4ZXJjaXNlLm1vZGUgPT09ICdidWlsZGVyJyA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxTaG9ydGN1dEJhciBvbkluc2VydD17aGFuZGxlSW5zZXJ0fSAvPlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvdmVyZmxvdy1oaWRkZW4gZmxleCBmbGV4LWNvbCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgIDxFZGl0b3JGZWVkYmFjayBlbGVtZW50cz17c3ludGF4RmVlZGJhY2t9IC8+XG4gICAgICAgICAgICAgICAgPEtvdGxpbkVkaXRvciBcbiAgICAgICAgICAgICAgICAgIGNvZGU9e2NvZGV9IFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldENvZGV9IFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0PXtlZGl0b3JIZWlnaHR9XG4gICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZXRJc0VkaXRvckZvY3VzZWQodHJ1ZSl9XG4gICAgICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IHNldElzRWRpdG9yRm9jdXNlZChmYWxzZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPFJlc2l6ZUhhbmRsZSBcbiAgICAgICAgICAgICAgICBvblJlc2l6ZT17aGFuZGxlUmVzaXplfSBcbiAgICAgICAgICAgICAgICBvblJlc2V0PXsoKSA9PiBzZXRFZGl0b3JIZWlnaHQoMjUwKX0gXG4gICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIGJnLWJhY2tncm91bmQvNTBcIj5cbiAgICAgICAgICAgICAgICB7LyogVGhpcyBzcGFjZSBjYW4gYmUgdXNlZCBmb3IgY29uc29sZSBvdXRwdXQgb3IganVzdCBlbXB0eSBzcGFjZSAqL31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgIDxBc3NpZ25tZW50VmlldyBcbiAgICAgICAgICAgICAgICB6aWVsQ29kZT17ZXhlcmNpc2UuYXNzaWdubWVudERhdGE/LnppZWxDb2RlIHx8ICcnfVxuICAgICAgICAgICAgICAgIGJhdXN0ZWluZVJpY2h0aWc9e2V4ZXJjaXNlLmFzc2lnbm1lbnREYXRhPy5iYXVzdGVpbmVSaWNodGlnIHx8IFtdfVxuICAgICAgICAgICAgICAgIGJhdXN0ZWluZURpc3RyYWt0b3I9e2V4ZXJjaXNlLmFzc2lnbm1lbnREYXRhPy5iYXVzdGVpbmVEaXN0cmFrdG9yIHx8IFtdfVxuICAgICAgICAgICAgICAgIG1hcD17ZXhlcmNpc2UuYXNzaWdubWVudERhdGE/Lm1hcCB8fCB7fX1cbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlPXtoYW5kbGVDaGVja31cbiAgICAgICAgICAgICAgICBjdXJyZW50SGludExldmVsPXtjdXJyZW50SGludExldmVsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHshaXNLZXlib2FyZFZpc2libGUgJiYgKFxuICAgICAgICAgICAgPEhpbnRQYW5lbCBcbiAgICAgICAgICAgICAgY3VycmVudExldmVsPXtjdXJyZW50SGludExldmVsfVxuICAgICAgICAgICAgICBoaW50cz17ZXhlcmNpc2UuaGludHN9XG4gICAgICAgICAgICAgIG9uUmVxdWVzdEhpbnQ9e3JlcXVlc3RIaW50fVxuICAgICAgICAgICAgICBvblJldmVhbFNvbHV0aW9uPXtyZXZlYWxTb2x1dGlvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L21haW4+XG5cbiAgICAgIHsvKiBGb290ZXIgQWN0aW9uIChPbmx5IGZvciBCdWlsZGVyIG1vZGUpICovfVxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAge3Nob3dGb290ZXIgJiYgKFxuICAgICAgICAgIDxtb3Rpb24uZm9vdGVyIFxuICAgICAgICAgICAgaW5pdGlhbD17eyB5OiAxMDAsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgeTogMCwgb3BhY2l0eTogMSB9fVxuICAgICAgICAgICAgZXhpdD17eyB5OiAxMDAsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtNCBiZy1zdXJmYWNlIGJvcmRlci10IGJvcmRlci1zdXJmYWNlLTIgc2hyaW5rLTAgei0yMFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVDaGVjaygpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZmVlZGJhY2sgPT09ICdjb3JyZWN0J31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTQgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1ICR7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2sgPT09ICdjb3JyZWN0JyA/ICdiZy1zdWNjZXNzIHRleHQtd2hpdGUnIDpcbiAgICAgICAgICAgICAgICBmZWVkYmFjayA9PT0gJ2luY29ycmVjdCcgPyAnYmctZXJyb3IgdGV4dC13aGl0ZSBhbmltYXRlLXNoYWtlJyA6XG4gICAgICAgICAgICAgICAgJ2JnLXByaW1hcnkgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LXByaW1hcnkvMjAnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZmVlZGJhY2sgPT09ICdjb3JyZWN0JyA/IChcbiAgICAgICAgICAgICAgICA8PjxDaGVja0NpcmNsZTIgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+IFJpY2h0aWchPC8+XG4gICAgICAgICAgICAgICkgOiBmZWVkYmFjayA9PT0gJ2luY29ycmVjdCcgPyAoXG4gICAgICAgICAgICAgICAgPD48WENpcmNsZSBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz4gRmFsc2NoITwvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+PFBsYXkgY2xhc3NOYW1lPVwidy01IGgtNSBmaWxsLWN1cnJlbnRcIiAvPiBTeW50YXggcHLDvGZlbjwvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9tb3Rpb24uZm9vdGVyPlxuICAgICAgICApfVxuICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XG5cbiAgICAgIHsvKiBGZWVkYmFjayBPdmVybGF5ICovfVxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAge2ZlZWRiYWNrID09PSAnY29ycmVjdCcgJiYgKFxuICAgICAgICAgIDxtb3Rpb24uZGl2IFxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCBiZy1zdWNjZXNzLzIwIHBvaW50ZXItZXZlbnRzLW5vbmUgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgICAgaW5pdGlhbD17eyBzY2FsZTogMC41LCBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICAgIGFuaW1hdGU9e3sgc2NhbGU6IDEsIG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctc3VjY2VzcyBwLTggcm91bmRlZC1mdWxsIHNoYWRvdy0yeGxcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Q2hlY2tDaXJjbGUyIGNsYXNzTmFtZT1cInctMTYgaC0xNiB0ZXh0LXdoaXRlXCIgLz5cbiAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICl9XG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgICAgIHsvKiBOb3RlIE1vZGFsICovfVxuICAgICAgPE5vdGVNb2RhbFxuICAgICAgICBpc09wZW49e2lzTm90ZU1vZGFsT3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNOb3RlTW9kYWxPcGVuKGZhbHNlKX1cbiAgICAgICAgb25TYXZlPXsobm90ZSkgPT4gc2F2ZUV4ZXJjaXNlTm90ZShleGVyY2lzZS5pZCwgbm90ZSl9XG4gICAgICAgIGluaXRpYWxOb3RlPXtleGVyY2lzZU5vdGVzW2V4ZXJjaXNlLmlkXSB8fCAnJ31cbiAgICAgICAgZXhlcmNpc2VJZD17ZXhlcmNpc2UuaWR9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLCJtYXBwaW5ncyI6IkFBbUZ3QixTQW1HWixVQW5HWTtBQW5GeEIsU0FBZ0IsVUFBVSxpQkFBaUI7QUFDM0MsU0FBUyxRQUFRLHVCQUF1QjtBQUN4QyxTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLGNBQWM7QUFDdkIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxtQkFBbUI7QUFDNUIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxzQkFBc0I7QUFDL0IsU0FBUyxjQUFjLFNBQVMsV0FBVyxNQUFNLHFCQUFxQjtBQUN0RSxTQUFTLHNCQUF1QztBQUNoRCxTQUFTLDJCQUEyQjtBQUNwQyxTQUFTLGlCQUFpQjtBQVNuQixhQUFNLGlCQUFnRCxDQUFDLEVBQUUsU0FBUyxXQUFXLFlBQVksT0FBTyxNQUFNO0FBQzNHLFFBQU07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QUE7QUFBQTtBQUFBO0FBQUEscUJBQTZCO0FBQUEsY0FBRTtBQUFBLGlCQUFqQztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUF5QyxJQUV6QyxtQ0FBRTtBQUFBLHFDQUFDLFFBQUssV0FBVSwwQkFBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBdUM7QUFBQSxjQUFFO0FBQUEsaUJBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQXlEO0FBQUE7QUFBQSxVQWQ3RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFnQkE7QUFBQTtBQUFBLE1BdEJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQXVCQSxLQXpCSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBMkJBO0FBQUEsSUFHQSx1QkFBQyxtQkFDRSx1QkFBYSxhQUNaO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUFBLFFBQ3RCLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFBQSxRQUN0QixNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQUEsUUFDbkIsV0FBVTtBQUFBLFFBRVY7QUFBQSxVQUFDLE9BQU87QUFBQSxVQUFQO0FBQUEsWUFDQyxTQUFTLEVBQUUsT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUFBLFlBQ2xDLFNBQVMsRUFBRSxPQUFPLEdBQUcsU0FBUyxFQUFFO0FBQUEsWUFDaEMsV0FBVTtBQUFBLFlBRVYsaUNBQUMsZ0JBQWEsV0FBVSwwQkFBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBK0M7QUFBQTtBQUFBLFVBTGpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1BO0FBQUE7QUFBQSxNQVpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWFBLEtBZko7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWlCQTtBQUFBLElBRUE7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFFBQVE7QUFBQSxRQUNSLFNBQVMsTUFBTSxtQkFBbUIsS0FBSztBQUFBLFFBQ3ZDLFFBQVEsQ0FBQyxTQUFTLGlCQUFpQixTQUFTLElBQUksSUFBSTtBQUFBLFFBQ3BELGFBQWEsY0FBYyxTQUFTLEVBQUUsS0FBSztBQUFBLFFBQzNDLFlBQVksU0FBUztBQUFBO0FBQUEsTUFMdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUE7QUFBQSxPQWhKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBaUpBO0FBRUo7IiwibmFtZXMiOlsiaGFuZGxlUmVzaXplIiwiZmVlZGJhY2siXX0=