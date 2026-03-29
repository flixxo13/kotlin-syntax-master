import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
export const EditorFeedback = ({ elements }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1.5 px-4 py-2 min-h-[44px] bg-surface-2/20 border-b border-surface-2 items-center", children: [
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "popLayout", children: elements.map((el) => /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.8, y: 5 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          backgroundColor: el.type === "correct-pos" ? "rgb(34, 197, 94)" : (
            // green-500
            el.type === "in-solution" ? "rgb(59, 130, 246)" : (
              // blue-500
              "rgb(75, 85, 99)"
            )
          )
          // gray-600
        },
        exit: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } },
        className: "px-2 py-1 rounded-md text-[10px] font-mono font-bold text-white flex items-center shadow-sm relative overflow-hidden",
        children: [
          (el.type === "in-solution" || el.type === "correct-pos") && /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: [0, 1, 0, 1, 0] },
              transition: { duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] },
              className: "absolute inset-0 bg-white/40 pointer-events-none"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
              lineNumber: 37,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "relative z-10", children: el.text }, void 0, false, {
            fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
            lineNumber: 44,
            columnNumber: 13
          }, this)
        ]
      },
      el.id,
      true,
      {
        fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
        lineNumber: 21,
        columnNumber: 11
      },
      this
    )) }, void 0, false, {
      fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
      lineNumber: 19,
      columnNumber: 7
    }, this),
    elements.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-[10px] text-text-secondary font-mono italic opacity-40", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-1 h-1 bg-text-secondary rounded-full animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this),
      "Warte auf Syntax-Elemente..."
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
      lineNumber: 49,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/editor/EditorFeedback.tsx",
    lineNumber: 18,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVkaXRvckZlZWRiYWNrLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tUeXBlID0gJ2RldGVjdGVkJyB8ICdpbi1zb2x1dGlvbicgfCAnY29ycmVjdC1wb3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRiYWNrRWxlbWVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgdHlwZTogRmVlZGJhY2tUeXBlO1xufVxuXG5pbnRlcmZhY2UgRWRpdG9yRmVlZGJhY2tQcm9wcyB7XG4gIGVsZW1lbnRzOiBGZWVkYmFja0VsZW1lbnRbXTtcbn1cblxuZXhwb3J0IGNvbnN0IEVkaXRvckZlZWRiYWNrOiBSZWFjdC5GQzxFZGl0b3JGZWVkYmFja1Byb3BzPiA9ICh7IGVsZW1lbnRzIH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0xLjUgcHgtNCBweS0yIG1pbi1oLVs0NHB4XSBiZy1zdXJmYWNlLTIvMjAgYm9yZGVyLWIgYm9yZGVyLXN1cmZhY2UtMiBpdGVtcy1jZW50ZXJcIj5cbiAgICAgIDxBbmltYXRlUHJlc2VuY2UgbW9kZT1cInBvcExheW91dFwiPlxuICAgICAgICB7ZWxlbWVudHMubWFwKChlbCkgPT4gKFxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBrZXk9e2VsLmlkfVxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC44LCB5OiA1IH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IFxuICAgICAgICAgICAgICBvcGFjaXR5OiAxLCBcbiAgICAgICAgICAgICAgc2NhbGU6IDEsIFxuICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGVsLnR5cGUgPT09ICdjb3JyZWN0LXBvcycgPyAncmdiKDM0LCAxOTcsIDk0KScgOiAvLyBncmVlbi01MDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC50eXBlID09PSAnaW4tc29sdXRpb24nID8gJ3JnYig1OSwgMTMwLCAyNDYpJyA6IC8vIGJsdWUtNTAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JnYig3NSwgODUsIDk5KScsIC8vIGdyYXktNjAwXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC41LCB0cmFuc2l0aW9uOiB7IGR1cmF0aW9uOiAwLjEgfSB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMiBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIGZsZXggaXRlbXMtY2VudGVyIHNoYWRvdy1zbSByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW5cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBCbGlua2luZyBPdmVybGF5ICovfVxuICAgICAgICAgICAgeyhlbC50eXBlID09PSAnaW4tc29sdXRpb24nIHx8IGVsLnR5cGUgPT09ICdjb3JyZWN0LXBvcycpICYmIChcbiAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IFswLCAxLCAwLCAxLCAwXSB9fVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNSwgdGltZXM6IFswLCAwLjI1LCAwLjUsIDAuNzUsIDFdIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy13aGl0ZS80MCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwXCI+e2VsLnRleHR9PC9zcGFuPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgICAgIHtlbGVtZW50cy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHRleHQtdGV4dC1zZWNvbmRhcnkgZm9udC1tb25vIGl0YWxpYyBvcGFjaXR5LTQwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEgaC0xIGJnLXRleHQtc2Vjb25kYXJ5IHJvdW5kZWQtZnVsbCBhbmltYXRlLXB1bHNlXCIgLz5cbiAgICAgICAgICBXYXJ0ZSBhdWYgU3ludGF4LUVsZW1lbnRlLi4uXG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQW9DYztBQW5DZCxTQUFTLFFBQVEsdUJBQXVCO0FBY2pDLGFBQU0saUJBQWdELENBQUMsRUFBRSxTQUFTLE1BQU07QUFDN0UsU0FDRSx1QkFBQyxTQUFJLFdBQVUsd0dBQ2I7QUFBQSwyQkFBQyxtQkFBZ0IsTUFBSyxhQUNuQixtQkFBUyxJQUFJLENBQUMsT0FDYjtBQUFBLE1BQUMsT0FBTztBQUFBLE1BQVA7QUFBQSxRQUVDLFNBQVMsRUFBRSxTQUFTLEdBQUcsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUFBLFFBQ3hDLFNBQVM7QUFBQSxVQUNQLFNBQVM7QUFBQSxVQUNULE9BQU87QUFBQSxVQUNQLEdBQUc7QUFBQSxVQUNILGlCQUFpQixHQUFHLFNBQVMsZ0JBQWdCO0FBQUE7QUFBQSxZQUM1QixHQUFHLFNBQVMsZ0JBQWdCO0FBQUE7QUFBQSxjQUM1QjtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBQ25CO0FBQUEsUUFDQSxNQUFNLEVBQUUsU0FBUyxHQUFHLE9BQU8sS0FBSyxZQUFZLEVBQUUsVUFBVSxJQUFJLEVBQUU7QUFBQSxRQUM5RCxXQUFVO0FBQUEsUUFHUjtBQUFBLGNBQUcsU0FBUyxpQkFBaUIsR0FBRyxTQUFTLGtCQUN6QztBQUFBLFlBQUMsT0FBTztBQUFBLFlBQVA7QUFBQSxjQUNDLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFBQSxjQUN0QixTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQUEsY0FDcEMsWUFBWSxFQUFFLFVBQVUsS0FBSyxPQUFPLENBQUMsR0FBRyxNQUFNLEtBQUssTUFBTSxDQUFDLEVBQUU7QUFBQSxjQUM1RCxXQUFVO0FBQUE7QUFBQSxZQUpaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUtBO0FBQUEsVUFFRix1QkFBQyxVQUFLLFdBQVUsaUJBQWlCLGFBQUcsUUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBeUM7QUFBQTtBQUFBO0FBQUEsTUF0QnBDLEdBQUc7QUFBQSxNQURWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUF3QkEsQ0FDRCxLQTNCSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBNEJBO0FBQUEsSUFDQyxTQUFTLFdBQVcsS0FDbkIsdUJBQUMsU0FBSSxXQUFVLHVGQUNiO0FBQUEsNkJBQUMsU0FBSSxXQUFVLDBEQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBc0U7QUFBQSxNQUFFO0FBQUEsU0FEMUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUdBO0FBQUEsT0FsQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQW9DQTtBQUVKOyIsIm5hbWVzIjpbXX0=