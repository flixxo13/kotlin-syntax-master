import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useState = __vite__cjsImport1_react["useState"];
import { AnimatePresence, motion } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { HomeScreen } from "/src/screens/HomeScreen.tsx";
import { ExerciseScreen } from "/src/screens/ExerciseScreen.tsx";
import { ImportScreen } from "/src/screens/ImportScreen.tsx";
import { BottomNav } from "/src/components/navigation/BottomNav.tsx";
import { TOPICS } from "/src/data/topics.ts";
import { useLearningStore } from "/src/store/useLearningStore.ts";
const ProgressScreen = () => /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex flex-col gap-6", children: [
  /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold tracking-tight", children: "Dein Fortschritt" }, void 0, false, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-surface p-4 rounded-xl border border-surface-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-mono text-text-secondary", children: "Mastery" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 15,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold", children: "12%" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 16,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 14,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-surface p-4 rounded-xl border border-surface-2", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-mono text-text-secondary", children: "Übungen" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 19,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold", children: "42" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 20,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 18,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/app/applet/src/App.tsx",
  lineNumber: 11,
  columnNumber: 3
}, this);
const ProfileScreen = () => /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex flex-col gap-6", children: [
  /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold tracking-tight", children: "Profil" }, void 0, false, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 bg-surface p-4 rounded-xl border border-surface-2", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold", children: "F" }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "Felix" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-text-secondary", children: "Kotlin Syntax Master" }, void 0, false, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 33,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/app/applet/src/App.tsx",
  lineNumber: 27,
  columnNumber: 3
}, this);
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeExercise, setActiveExercise] = useState(null);
  const { customTasks } = useLearningStore();
  const renderScreen = () => {
    if (activeExercise) {
      return /* @__PURE__ */ jsxDEV(
        ExerciseScreen,
        {
          topicId: activeExercise.topicId,
          conceptId: activeExercise.conceptId,
          exerciseId: activeExercise.exerciseId,
          onBack: () => setActiveExercise(null)
        },
        `${activeExercise.topicId}-${activeExercise.conceptId}-${activeExercise.exerciseId || "default"}`,
        false,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 47,
          columnNumber: 9
        },
        this
      );
    }
    switch (activeTab) {
      case "home":
        return /* @__PURE__ */ jsxDEV(
          HomeScreen,
          {
            onStartTopic: (topicId) => {
              const topic = TOPICS.find((t) => t.id === topicId);
              if (topic) {
                setActiveExercise({ topicId, conceptId: topic.concepts[0].id });
              }
            },
            onStartCustomTask: (taskId) => {
              const task = customTasks.find((t) => t.id === taskId);
              if (task) {
                setActiveExercise({ topicId: "custom", conceptId: task.conceptId, exerciseId: task.id });
              }
            }
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 60,
            columnNumber: 11
          },
          this
        );
      case "import":
        return /* @__PURE__ */ jsxDEV(ImportScreen, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 76,
          columnNumber: 16
        }, this);
      case "progress":
        return /* @__PURE__ */ jsxDEV(ProgressScreen, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 78,
          columnNumber: 16
        }, this);
      case "profile":
        return /* @__PURE__ */ jsxDEV(ProfileScreen, {}, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 80,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ jsxDEV(HomeScreen, { onStartTopic: () => {
        }, onStartCustomTask: () => {
        } }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 82,
          columnNumber: 16
        }, this);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30", children: [
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.2 },
        className: "pb-20",
        children: renderScreen()
      },
      activeExercise ? "exercise" : activeTab,
      false,
      {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 89,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 88,
      columnNumber: 7
    }, this),
    !activeExercise && /* @__PURE__ */ jsxDEV(BottomNav, { activeTab, onTabChange: setActiveTab }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 102,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 87,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQW5pbWF0ZVByZXNlbmNlLCBtb3Rpb24gfSBmcm9tICdtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgSG9tZVNjcmVlbiB9IGZyb20gJy4vc2NyZWVucy9Ib21lU2NyZWVuJztcbmltcG9ydCB7IEV4ZXJjaXNlU2NyZWVuIH0gZnJvbSAnLi9zY3JlZW5zL0V4ZXJjaXNlU2NyZWVuJztcbmltcG9ydCB7IEltcG9ydFNjcmVlbiB9IGZyb20gJy4vc2NyZWVucy9JbXBvcnRTY3JlZW4nO1xuaW1wb3J0IHsgQm90dG9tTmF2IH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vQm90dG9tTmF2JztcbmltcG9ydCB7IFRPUElDUyB9IGZyb20gJy4vZGF0YS90b3BpY3MnO1xuaW1wb3J0IHsgdXNlTGVhcm5pbmdTdG9yZSB9IGZyb20gJy4vc3RvcmUvdXNlTGVhcm5pbmdTdG9yZSc7XG5cbmNvbnN0IFByb2dyZXNzU2NyZWVuID0gKCkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBmbGV4IGZsZXgtY29sIGdhcC02XCI+XG4gICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0cmFja2luZy10aWdodFwiPkRlaW4gRm9ydHNjaHJpdHQ8L2gxPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zdXJmYWNlIHAtNCByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItc3VyZmFjZS0yXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSBmb250LW1vbm8gdGV4dC10ZXh0LXNlY29uZGFyeVwiPk1hc3Rlcnk8L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkXCI+MTIlPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc3VyZmFjZSBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXN1cmZhY2UtMlwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgZm9udC1tb25vIHRleHQtdGV4dC1zZWNvbmRhcnlcIj7DnGJ1bmdlbjwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGRcIj40MjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgUHJvZmlsZVNjcmVlbiA9ICgpID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJwLTYgZmxleCBmbGV4LWNvbCBnYXAtNlwiPlxuICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdHJhY2tpbmctdGlnaHRcIj5Qcm9maWw8L2gxPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgYmctc3VyZmFjZSBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXN1cmZhY2UtMlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTE2IGgtMTYgYmctcHJpbWFyeSByb3VuZGVkLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC0yeGwgZm9udC1ib2xkXCI+RjwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtYm9sZFwiPkZlbGl4PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5Lb3RsaW4gU3ludGF4IE1hc3Rlcjwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IHVzZVN0YXRlKCdob21lJyk7XG4gIGNvbnN0IFthY3RpdmVFeGVyY2lzZSwgc2V0QWN0aXZlRXhlcmNpc2VdID0gdXNlU3RhdGU8eyB0b3BpY0lkOiBzdHJpbmc7IGNvbmNlcHRJZDogc3RyaW5nOyBleGVyY2lzZUlkPzogc3RyaW5nIH0gfCBudWxsPihudWxsKTtcbiAgY29uc3QgeyBjdXN0b21UYXNrcyB9ID0gdXNlTGVhcm5pbmdTdG9yZSgpO1xuXG4gIGNvbnN0IHJlbmRlclNjcmVlbiA9ICgpID0+IHtcbiAgICBpZiAoYWN0aXZlRXhlcmNpc2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxFeGVyY2lzZVNjcmVlbiBcbiAgICAgICAgICBrZXk9e2Ake2FjdGl2ZUV4ZXJjaXNlLnRvcGljSWR9LSR7YWN0aXZlRXhlcmNpc2UuY29uY2VwdElkfS0ke2FjdGl2ZUV4ZXJjaXNlLmV4ZXJjaXNlSWQgfHwgJ2RlZmF1bHQnfWB9XG4gICAgICAgICAgdG9waWNJZD17YWN0aXZlRXhlcmNpc2UudG9waWNJZH0gXG4gICAgICAgICAgY29uY2VwdElkPXthY3RpdmVFeGVyY2lzZS5jb25jZXB0SWR9IFxuICAgICAgICAgIGV4ZXJjaXNlSWQ9e2FjdGl2ZUV4ZXJjaXNlLmV4ZXJjaXNlSWR9XG4gICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRBY3RpdmVFeGVyY2lzZShudWxsKX0gXG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIHN3aXRjaCAoYWN0aXZlVGFiKSB7XG4gICAgICBjYXNlICdob21lJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8SG9tZVNjcmVlbiBcbiAgICAgICAgICAgIG9uU3RhcnRUb3BpYz17KHRvcGljSWQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSBUT1BJQ1MuZmluZCh0ID0+IHQuaWQgPT09IHRvcGljSWQpO1xuICAgICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmVFeGVyY2lzZSh7IHRvcGljSWQsIGNvbmNlcHRJZDogdG9waWMuY29uY2VwdHNbMF0uaWQgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19IFxuICAgICAgICAgICAgb25TdGFydEN1c3RvbVRhc2s9eyh0YXNrSWQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9IGN1c3RvbVRhc2tzLmZpbmQodCA9PiB0LmlkID09PSB0YXNrSWQpO1xuICAgICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIHNldEFjdGl2ZUV4ZXJjaXNlKHsgdG9waWNJZDogJ2N1c3RvbScsIGNvbmNlcHRJZDogdGFzay5jb25jZXB0SWQsIGV4ZXJjaXNlSWQ6IHRhc2suaWQgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICAgIHJldHVybiA8SW1wb3J0U2NyZWVuIC8+O1xuICAgICAgY2FzZSAncHJvZ3Jlc3MnOlxuICAgICAgICByZXR1cm4gPFByb2dyZXNzU2NyZWVuIC8+O1xuICAgICAgY2FzZSAncHJvZmlsZSc6XG4gICAgICAgIHJldHVybiA8UHJvZmlsZVNjcmVlbiAvPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiA8SG9tZVNjcmVlbiBvblN0YXJ0VG9waWM9eygpID0+IHt9fSBvblN0YXJ0Q3VzdG9tVGFzaz17KCkgPT4ge319IC8+O1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWJhY2tncm91bmQgdGV4dC10ZXh0LXByaW1hcnkgZm9udC1zYW5zIHNlbGVjdGlvbjpiZy1wcmltYXJ5LzMwXCI+XG4gICAgICA8QW5pbWF0ZVByZXNlbmNlIG1vZGU9XCJ3YWl0XCI+XG4gICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAga2V5PXthY3RpdmVFeGVyY2lzZSA/ICdleGVyY2lzZScgOiBhY3RpdmVUYWJ9XG4gICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB4OiAyMCB9fVxuICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCwgeDogLTIwIH19XG4gICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4yIH19XG4gICAgICAgICAgY2xhc3NOYW1lPVwicGItMjBcIlxuICAgICAgICA+XG4gICAgICAgICAge3JlbmRlclNjcmVlbigpfVxuICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cblxuICAgICAgeyFhY3RpdmVFeGVyY2lzZSAmJiAoXG4gICAgICAgIDxCb3R0b21OYXYgYWN0aXZlVGFiPXthY3RpdmVUYWJ9IG9uVGFiQ2hhbmdlPXtzZXRBY3RpdmVUYWJ9IC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFXSTtBQVhKLFNBQWdCLGdCQUFnQjtBQUNoQyxTQUFTLGlCQUFpQixjQUFjO0FBQ3hDLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMsY0FBYztBQUN2QixTQUFTLHdCQUF3QjtBQUVqQyxNQUFNLGlCQUFpQixNQUNyQix1QkFBQyxTQUFJLFdBQVUsMkJBQ2I7QUFBQSx5QkFBQyxRQUFHLFdBQVUscUNBQW9DLGdDQUFsRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQWtFO0FBQUEsRUFDbEUsdUJBQUMsU0FBSSxXQUFVLDBCQUNiO0FBQUEsMkJBQUMsU0FBSSxXQUFVLHFEQUNiO0FBQUEsNkJBQUMsVUFBSyxXQUFVLHVEQUFzRCx1QkFBdEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUE2RTtBQUFBLE1B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