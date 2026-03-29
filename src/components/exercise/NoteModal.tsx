import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { X, Save, MessageSquare } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
export const NoteModal = ({ isOpen, onClose, onSave, initialNote, exerciseId }) => {
  const [note, setNote] = useState(initialNote);
  useEffect(() => {
    if (isOpen) {
      setNote(initialNote);
    }
  }, [isOpen, initialNote]);
  const handleSave = () => {
    onSave(note);
    onClose();
  };
  return /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose,
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
        lineNumber: 31,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.9, opacity: 0, y: 20 },
        className: "relative w-full max-w-md bg-surface border border-surface-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-b border-surface-2 flex items-center justify-between bg-surface-2/30", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-primary", children: [
              /* @__PURE__ */ jsxDEV(MessageSquare, { className: "w-5 h-5" }, void 0, false, {
                fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                lineNumber: 46,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "font-bold", children: "Aufgaben-Feedback" }, void 0, false, {
                fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                lineNumber: 47,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
              lineNumber: 45,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-surface-2 rounded-full transition-colors", children: /* @__PURE__ */ jsxDEV(X, { className: "w-5 h-5" }, void 0, false, {
              fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
              lineNumber: 50,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
              lineNumber: 49,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
            lineNumber: 44,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] uppercase font-mono tracking-widest text-text-secondary", children: [
                "Notizen & Optimierungsvorschläge (ID: ",
                exerciseId,
                ")"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                lineNumber: 56,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  placeholder: "Hinterlasse hier Infos zum Format, zur Schwierigkeit oder Optimierungsideen...",
                  className: "w-full h-48 bg-background border border-surface-2 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none",
                  autoFocus: true
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                  lineNumber: 59,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
              lineNumber: 55,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-text-secondary leading-relaxed italic", children: "Diese Informationen werden lokal gespeichert und können im Import-Bereich gesammelt ausgelesen werden." }, void 0, false, {
              fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
              lineNumber: 68,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
            lineNumber: 54,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-surface-2/30 border-t border-surface-2 flex gap-3", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onClose,
                className: "flex-1 py-3 rounded-xl font-bold text-text-secondary hover:bg-surface-2 transition-colors",
                children: "Abbrechen"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                lineNumber: 74,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleSave,
                className: "flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all",
                children: [
                  /* @__PURE__ */ jsxDEV(Save, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                    lineNumber: 84,
                    columnNumber: 17
                  }, this),
                  "Speichern"
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
                lineNumber: 80,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
        lineNumber: 38,
        columnNumber: 11
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
    lineNumber: 30,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/exercise/NoteModal.tsx",
    lineNumber: 28,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5vdGVNb2RhbC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBtb3Rpb24sIEFuaW1hdGVQcmVzZW5jZSB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBYLCBTYXZlLCBNZXNzYWdlU3F1YXJlIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIE5vdGVNb2RhbFByb3BzIHtcbiAgaXNPcGVuOiBib29sZWFuO1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuICBvblNhdmU6IChub3RlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIGluaXRpYWxOb3RlOiBzdHJpbmc7XG4gIGV4ZXJjaXNlSWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IE5vdGVNb2RhbDogUmVhY3QuRkM8Tm90ZU1vZGFsUHJvcHM+ID0gKHsgaXNPcGVuLCBvbkNsb3NlLCBvblNhdmUsIGluaXRpYWxOb3RlLCBleGVyY2lzZUlkIH0pID0+IHtcbiAgY29uc3QgW25vdGUsIHNldE5vdGVdID0gdXNlU3RhdGUoaW5pdGlhbE5vdGUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgc2V0Tm90ZShpbml0aWFsTm90ZSk7XG4gICAgfVxuICB9LCBbaXNPcGVuLCBpbml0aWFsTm90ZV0pO1xuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoKSA9PiB7XG4gICAgb25TYXZlKG5vdGUpO1xuICAgIG9uQ2xvc2UoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxBbmltYXRlUHJlc2VuY2U+XG4gICAgICB7aXNPcGVuICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotWzEwMF0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC02XCI+XG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxIH19XG4gICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWJsYWNrLzYwIGJhY2tkcm9wLWJsdXItc21cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGluaXRpYWw9e3sgc2NhbGU6IDAuOSwgb3BhY2l0eTogMCwgeTogMjAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgc2NhbGU6IDEsIG9wYWNpdHk6IDEsIHk6IDAgfX1cbiAgICAgICAgICAgIGV4aXQ9e3sgc2NhbGU6IDAuOSwgb3BhY2l0eTogMCwgeTogMjAgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIHctZnVsbCBtYXgtdy1tZCBiZy1zdXJmYWNlIGJvcmRlciBib3JkZXItc3VyZmFjZS0yIHJvdW5kZWQtMnhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIGZsZXggZmxleC1jb2xcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IGJvcmRlci1iIGJvcmRlci1zdXJmYWNlLTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGJnLXN1cmZhY2UtMi8zMFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgIDxNZXNzYWdlU3F1YXJlIGNsYXNzTmFtZT1cInctNSBoLTVcIiAvPlxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGRcIj5BdWZnYWJlbi1GZWVkYmFjazwvaDM+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInAtMiBob3ZlcjpiZy1zdXJmYWNlLTIgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tY29sb3JzXCI+XG4gICAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02IHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgZm9udC1tb25vIHRyYWNraW5nLXdpZGVzdCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICBOb3RpemVuICYgT3B0aW1pZXJ1bmdzdm9yc2NobMOkZ2UgKElEOiB7ZXhlcmNpc2VJZH0pXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtub3RlfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXROb3RlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSGludGVybGFzc2UgaGllciBJbmZvcyB6dW0gRm9ybWF0LCB6dXIgU2Nod2llcmlna2VpdCBvZGVyIE9wdGltaWVydW5nc2lkZWVuLi4uXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBoLTQ4IGJnLWJhY2tncm91bmQgYm9yZGVyIGJvcmRlci1zdXJmYWNlLTIgcm91bmRlZC14bCBwLTQgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1wcmltYXJ5IG91dGxpbmUtbm9uZSByZXNpemUtbm9uZVwiXG4gICAgICAgICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtdGV4dC1zZWNvbmRhcnkgbGVhZGluZy1yZWxheGVkIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgIERpZXNlIEluZm9ybWF0aW9uZW4gd2VyZGVuIGxva2FsIGdlc3BlaWNoZXJ0IHVuZCBrw7ZubmVuIGltIEltcG9ydC1CZXJlaWNoIGdlc2FtbWVsdCBhdXNnZWxlc2VuIHdlcmRlbi5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IGJnLXN1cmZhY2UtMi8zMCBib3JkZXItdCBib3JkZXItc3VyZmFjZS0yIGZsZXggZ2FwLTNcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIHB5LTMgcm91bmRlZC14bCBmb250LWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeSBob3ZlcjpiZy1zdXJmYWNlLTIgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgQWJicmVjaGVuXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU2F2ZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgcHktMyBiZy1wcmltYXJ5IHRleHQtd2hpdGUgcm91bmRlZC14bCBmb250LWJvbGQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgc2hhZG93LWxnIHNoYWRvdy1wcmltYXJ5LzIwIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U2F2ZSBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgICBTcGVpY2hlcm5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQThCVTtBQTlCVixTQUFnQixVQUFVLGlCQUFpQjtBQUMzQyxTQUFTLFFBQVEsdUJBQXVCO0FBQ3hDLFNBQVMsR0FBRyxNQUFNLHFCQUFxQjtBQVVoQyxhQUFNLFlBQXNDLENBQUMsRUFBRSxRQUFRLFNBQVMsUUFBUSxhQUFhLFdBQVcsTUFBTTtBQUMzRyxRQUFNLENBQUMsTUFBTSxPQUFPLElBQUksU0FBUyxXQUFXO0FBRTVDLFlBQVUsTUFBTTtBQUNkLFFBQUksUUFBUTtBQUNWLGNBQVEsV0FBVztBQUFBLElBQ3JCO0FBQUEsRUFDRixHQUFHLENBQUMsUUFBUSxXQUFXLENBQUM7QUFFeEIsUUFBTSxhQUFhLE1BQU07QUFDdkIsV0FBTyxJQUFJO0FBQ1gsWUFBUTtBQUFBLEVBQ1Y7QUFFQSxTQUNFLHVCQUFDLG1CQUNFLG9CQUNDLHVCQUFDLFNBQUksV0FBVSw4REFDYjtBQUFBO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUFBLFFBQ3RCLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFBQSxRQUN0QixNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQUEsUUFDbkIsU0FBUztBQUFBLFFBQ1QsV0FBVTtBQUFBO0FBQUEsTUFMWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQTtBQUFBLElBQ0E7QUFBQSxNQUFDLE9BQU87QUFBQSxNQUFQO0FBQUEsUUFDQyxTQUFTLEVBQUUsT0FBTyxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUc7QUFBQSxRQUN6QyxTQUFTLEVBQUUsT0FBTyxHQUFHLFNBQVMsR0FBRyxHQUFHLEVBQUU7QUFBQSxRQUN0QyxNQUFNLEVBQUUsT0FBTyxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUc7QUFBQSxRQUN0QyxXQUFVO0FBQUEsUUFFVjtBQUFBLGlDQUFDLFNBQUksV0FBVSxtRkFDYjtBQUFBLG1DQUFDLFNBQUksV0FBVSx3Q0FDYjtBQUFBLHFDQUFDLGlCQUFjLFdBQVUsYUFBekI7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBbUM7QUFBQSxjQUNuQyx1QkFBQyxRQUFHLFdBQVUsYUFBWSxpQ0FBMUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBMkM7QUFBQSxpQkFGN0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFHQTtBQUFBLFlBQ0EsdUJBQUMsWUFBTyxTQUFTLFNBQVMsV0FBVSx5REFDbEMsaUNBQUMsS0FBRSxXQUFVLGFBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBdUIsS0FEekI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFFQTtBQUFBLGVBUEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFRQTtBQUFBLFVBRUEsdUJBQUMsU0FBSSxXQUFVLGlCQUNiO0FBQUEsbUNBQUMsU0FBSSxXQUFVLGFBQ2I7QUFBQSxxQ0FBQyxXQUFNLFdBQVUsdUVBQXNFO0FBQUE7QUFBQSxnQkFDOUM7QUFBQSxnQkFBVztBQUFBLG1CQURwRDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsY0FDQTtBQUFBLGdCQUFDO0FBQUE7QUFBQSxrQkFDQyxPQUFPO0FBQUEsa0JBQ1AsVUFBVSxDQUFDLE1BQU0sUUFBUSxFQUFFLE9BQU8sS0FBSztBQUFBLGtCQUN2QyxhQUFZO0FBQUEsa0JBQ1osV0FBVTtBQUFBLGtCQUNWLFdBQVM7QUFBQTtBQUFBLGdCQUxYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQU1BO0FBQUEsaUJBVkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFXQTtBQUFBLFlBRUEsdUJBQUMsT0FBRSxXQUFVLDBEQUF5RCxzSEFBdEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFFQTtBQUFBLGVBaEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBaUJBO0FBQUEsVUFFQSx1QkFBQyxTQUFJLFdBQVUsNERBQ2I7QUFBQTtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLFNBQVM7QUFBQSxnQkFDVCxXQUFVO0FBQUEsZ0JBQ1g7QUFBQTtBQUFBLGNBSEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBS0E7QUFBQSxZQUNBO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsU0FBUztBQUFBLGdCQUNULFdBQVU7QUFBQSxnQkFFVjtBQUFBLHlDQUFDLFFBQUssV0FBVSxhQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUEwQjtBQUFBLGtCQUFFO0FBQUE7QUFBQTtBQUFBLGNBSjlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU1BO0FBQUEsZUFiRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQWNBO0FBQUE7QUFBQTtBQUFBLE1BakRGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWtEQTtBQUFBLE9BMURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0EyREEsS0E3REo7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQStEQTtBQUVKOyIsIm5hbWVzIjpbXX0=