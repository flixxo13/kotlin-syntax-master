import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { motion } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { ClipboardList, ChevronDown } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
export const TaskCard = ({ task, isCollapsed, onToggle }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-surface border-b border-surface-2 p-4 flex flex-col gap-2 transition-all", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-text-secondary", children: [
        /* @__PURE__ */ jsxDEV(ClipboardList, { className: "w-4 h-4" }, void 0, false, {
          fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
          lineNumber: 16,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-mono tracking-widest", children: "Aufgabe" }, void 0, false, {
          fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
          lineNumber: 17,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
        lineNumber: 15,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: onToggle, className: "p-1 hover:bg-surface-2 rounded transition-colors", children: /* @__PURE__ */ jsxDEV(ChevronDown, { className: isCollapsed ? "w-4 h-4 rotate-180 transition-transform" : "w-4 h-4 transition-transform" }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
        lineNumber: 20,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
        lineNumber: 19,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
      lineNumber: 14,
      columnNumber: 7
    }, this),
    !isCollapsed && /* @__PURE__ */ jsxDEV(
      motion.p,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "text-sm leading-relaxed",
        children: task
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
        lineNumber: 24,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/exercise/TaskCard.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhc2tDYXJkLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW90aW9uIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IENsaXBib2FyZExpc3QsIENoZXZyb25Eb3duIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIFRhc2tDYXJkUHJvcHMge1xuICB0YXNrOiBzdHJpbmc7XG4gIGlzQ29sbGFwc2VkOiBib29sZWFuO1xuICBvblRvZ2dsZTogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IFRhc2tDYXJkOiBSZWFjdC5GQzxUYXNrQ2FyZFByb3BzPiA9ICh7IHRhc2ssIGlzQ29sbGFwc2VkLCBvblRvZ2dsZSB9KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zdXJmYWNlIGJvcmRlci1iIGJvcmRlci1zdXJmYWNlLTIgcC00IGZsZXggZmxleC1jb2wgZ2FwLTIgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIDxDbGlwYm9hcmRMaXN0IGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSBmb250LW1vbm8gdHJhY2tpbmctd2lkZXN0XCI+QXVmZ2FiZTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25Ub2dnbGV9IGNsYXNzTmFtZT1cInAtMSBob3ZlcjpiZy1zdXJmYWNlLTIgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9yc1wiPlxuICAgICAgICAgIDxDaGV2cm9uRG93biBjbGFzc05hbWU9e2lzQ29sbGFwc2VkID8gXCJ3LTQgaC00IHJvdGF0ZS0xODAgdHJhbnNpdGlvbi10cmFuc2Zvcm1cIiA6IFwidy00IGgtNCB0cmFuc2l0aW9uLXRyYW5zZm9ybVwifSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgeyFpc0NvbGxhcHNlZCAmJiAoXG4gICAgICAgIDxtb3Rpb24ucCBcbiAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHk6IC0xMCB9fVxuICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc20gbGVhZGluZy1yZWxheGVkXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0YXNrfVxuICAgICAgICA8L21vdGlvbi5wPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQWVVO0FBZFYsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsZUFBZSxtQkFBbUI7QUFRcEMsYUFBTSxXQUFvQyxDQUFDLEVBQUUsTUFBTSxhQUFhLFNBQVMsTUFBTTtBQUNwRixTQUNFLHVCQUFDLFNBQUksV0FBVSwrRUFDYjtBQUFBLDJCQUFDLFNBQUksV0FBVSxxQ0FDYjtBQUFBLDZCQUFDLFNBQUksV0FBVSwrQ0FDYjtBQUFBLCtCQUFDLGlCQUFjLFdBQVUsYUFBekI7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFtQztBQUFBLFFBQ25DLHVCQUFDLFVBQUssV0FBVSxtREFBa0QsdUJBQWxFO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBeUU7QUFBQSxXQUYzRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBR0E7QUFBQSxNQUNBLHVCQUFDLFlBQU8sU0FBUyxVQUFVLFdBQVUsb0RBQ25DLGlDQUFDLGVBQVksV0FBVyxjQUFjLDRDQUE0QyxrQ0FBbEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFrSCxLQURwSDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBRUE7QUFBQSxTQVBGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FRQTtBQUFBLElBQ0MsQ0FBQyxlQUNBO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsU0FBUyxFQUFFLFNBQVMsR0FBRyxHQUFHLElBQUk7QUFBQSxRQUM5QixTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRTtBQUFBLFFBQzVCLFdBQVU7QUFBQSxRQUVUO0FBQUE7QUFBQSxNQUxIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BO0FBQUEsT0FqQko7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQW1CQTtBQUVKOyIsIm5hbWVzIjpbXX0=