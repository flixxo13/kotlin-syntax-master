import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { motion } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { Lightbulb } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
export const HintPanel = ({
  currentLevel,
  hints,
  onRequestHint,
  onRevealSolution
}) => {
  const level = typeof currentLevel === "number" ? currentLevel : 3;
  return /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-surface flex flex-col gap-4 border-t border-surface-2", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-hint", children: [
        /* @__PURE__ */ jsxDEV(Lightbulb, { className: "w-4 h-4" }, void 0, false, {
          fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
          lineNumber: 29,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-mono tracking-widest", children: "Hints" }, void 0, false, {
          fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
          lineNumber: 30,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
        lineNumber: 28,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [1, 2, 3].map((l) => /* @__PURE__ */ jsxDEV(
        "div",
        {
          className: `w-2 h-2 rounded-full ${level >= l ? "bg-hint" : "bg-surface-2"}`
        },
        l,
        false,
        {
          fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
          lineNumber: 34,
          columnNumber: 13
        },
        this
      )) }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-3", children: [
      level > 0 && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "p-3 bg-surface-2 rounded text-xs font-mono text-hint border border-hint/20",
          children: [
            level === 1 && hints.level1,
            level === 2 && hints.level2,
            level === 3 && hints.level3
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
          lineNumber: 44,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
        level < 3 && /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: onRequestHint,
            className: "flex-1 py-3 bg-surface-2 hover:bg-surface-2/80 rounded text-[10px] uppercase font-mono tracking-widest transition-colors",
            children: [
              "Hint ",
              level + 1,
              " anfordern"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
            lineNumber: 57,
            columnNumber: 13
          },
          this
        ),
        level >= 3 && currentLevel !== "revealed" && /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: onRevealSolution,
            className: "flex-1 py-3 bg-error/20 text-error border border-error/30 rounded text-[10px] uppercase font-mono tracking-widest transition-colors",
            children: "Lösung anzeigen"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
            lineNumber: 65,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/exercise/HintPanel.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhpbnRQYW5lbC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBMaWdodGJ1bGIgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgSGludExldmVsIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSGludFBhbmVsUHJvcHMge1xuICBjdXJyZW50TGV2ZWw6IEhpbnRMZXZlbDtcbiAgaGludHM6IHtcbiAgICBsZXZlbDE6IHN0cmluZztcbiAgICBsZXZlbDI6IHN0cmluZztcbiAgICBsZXZlbDM6IHN0cmluZztcbiAgfTtcbiAgb25SZXF1ZXN0SGludDogKCkgPT4gdm9pZDtcbiAgb25SZXZlYWxTb2x1dGlvbjogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEhpbnRQYW5lbDogUmVhY3QuRkM8SGludFBhbmVsUHJvcHM+ID0gKHsgXG4gIGN1cnJlbnRMZXZlbCwgXG4gIGhpbnRzLCBcbiAgb25SZXF1ZXN0SGludCwgXG4gIG9uUmV2ZWFsU29sdXRpb24gXG59KSA9PiB7XG4gIGNvbnN0IGxldmVsID0gdHlwZW9mIGN1cnJlbnRMZXZlbCA9PT0gJ251bWJlcicgPyBjdXJyZW50TGV2ZWwgOiAzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgYmctc3VyZmFjZSBmbGV4IGZsZXgtY29sIGdhcC00IGJvcmRlci10IGJvcmRlci1zdXJmYWNlLTJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1oaW50XCI+XG4gICAgICAgICAgPExpZ2h0YnVsYiBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgZm9udC1tb25vIHRyYWNraW5nLXdpZGVzdFwiPkhpbnRzPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAge1sxLCAyLCAzXS5tYXAoKGwpID0+IChcbiAgICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICAgIGtleT17bH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy0yIGgtMiByb3VuZGVkLWZ1bGwgJHtsZXZlbCA+PSBsID8gJ2JnLWhpbnQnIDogJ2JnLXN1cmZhY2UtMid9YH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtM1wiPlxuICAgICAgICB7bGV2ZWwgPiAwICYmIChcbiAgICAgICAgICA8bW90aW9uLmRpdiBcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeTogMTAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0zIGJnLXN1cmZhY2UtMiByb3VuZGVkIHRleHQteHMgZm9udC1tb25vIHRleHQtaGludCBib3JkZXIgYm9yZGVyLWhpbnQvMjBcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsZXZlbCA9PT0gMSAmJiBoaW50cy5sZXZlbDF9XG4gICAgICAgICAgICB7bGV2ZWwgPT09IDIgJiYgaGludHMubGV2ZWwyfVxuICAgICAgICAgICAge2xldmVsID09PSAzICYmIGhpbnRzLmxldmVsM31cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAge2xldmVsIDwgMyAmJiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uUmVxdWVzdEhpbnR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBweS0zIGJnLXN1cmZhY2UtMiBob3ZlcjpiZy1zdXJmYWNlLTIvODAgcm91bmRlZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgZm9udC1tb25vIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEhpbnQge2xldmVsICsgMX0gYW5mb3JkZXJuXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtsZXZlbCA+PSAzICYmIGN1cnJlbnRMZXZlbCAhPT0gJ3JldmVhbGVkJyAmJiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uUmV2ZWFsU29sdXRpb259XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBweS0zIGJnLWVycm9yLzIwIHRleHQtZXJyb3IgYm9yZGVyIGJvcmRlci1lcnJvci8zMCByb3VuZGVkIHRleHQtWzEwcHhdIHVwcGVyY2FzZSBmb250LW1vbm8gdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgTMO2c3VuZyBhbnplaWdlblxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQTRCVTtBQTNCVixTQUFTLGNBQWM7QUFDdkIsU0FBUyxpQkFBaUI7QUFjbkIsYUFBTSxZQUFzQyxDQUFDO0FBQUEsRUFDbEQ7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRixNQUFNO0FBQ0osUUFBTSxRQUFRLE9BQU8saUJBQWlCLFdBQVcsZUFBZTtBQUVoRSxTQUNFLHVCQUFDLFNBQUksV0FBVSxnRUFDYjtBQUFBLDJCQUFDLFNBQUksV0FBVSxxQ0FDYjtBQUFBLDZCQUFDLFNBQUksV0FBVSxxQ0FDYjtBQUFBLCtCQUFDLGFBQVUsV0FBVSxhQUFyQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQStCO0FBQUEsUUFDL0IsdUJBQUMsVUFBSyxXQUFVLG1EQUFrRCxxQkFBbEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUF1RTtBQUFBLFdBRnpFO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFHQTtBQUFBLE1BQ0EsdUJBQUMsU0FBSSxXQUFVLGNBQ1osV0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUNkO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFFQyxXQUFXLHdCQUF3QixTQUFTLElBQUksWUFBWSxjQUFjO0FBQUE7QUFBQSxRQURyRTtBQUFBLFFBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUdBLENBQ0QsS0FOSDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBT0E7QUFBQSxTQVpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FhQTtBQUFBLElBRUEsdUJBQUMsU0FBSSxXQUFVLHVCQUNaO0FBQUEsY0FBUSxLQUNQO0FBQUEsUUFBQyxPQUFPO0FBQUEsUUFBUDtBQUFBLFVBQ0MsU0FBUyxFQUFFLFNBQVMsR0FBRyxHQUFHLEdBQUc7QUFBQSxVQUM3QixTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRTtBQUFBLFVBQzVCLFdBQVU7QUFBQSxVQUVUO0FBQUEsc0JBQVUsS0FBSyxNQUFNO0FBQUEsWUFDckIsVUFBVSxLQUFLLE1BQU07QUFBQSxZQUNyQixVQUFVLEtBQUssTUFBTTtBQUFBO0FBQUE7QUFBQSxRQVB4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFRQTtBQUFBLE1BR0YsdUJBQUMsU0FBSSxXQUFVLGNBQ1o7QUFBQSxnQkFBUSxLQUNQO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxTQUFTO0FBQUEsWUFDVCxXQUFVO0FBQUEsWUFDWDtBQUFBO0FBQUEsY0FDTyxRQUFRO0FBQUEsY0FBRTtBQUFBO0FBQUE7QUFBQSxVQUpsQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQTtBQUFBLFFBRUQsU0FBUyxLQUFLLGlCQUFpQixjQUM5QjtBQUFBLFVBQUM7QUFBQTtBQUFBLFlBQ0MsU0FBUztBQUFBLFlBQ1QsV0FBVTtBQUFBLFlBQ1g7QUFBQTtBQUFBLFVBSEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS0E7QUFBQSxXQWZKO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFpQkE7QUFBQSxTQTlCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBK0JBO0FBQUEsT0EvQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWdEQTtBQUVKOyIsIm5hbWVzIjpbXX0=