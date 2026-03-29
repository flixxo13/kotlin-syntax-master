import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=b202f2b4";
import { AlertTriangle, X } from "/node_modules/.vite/deps/lucide-react.js?v=b8a89076";
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Löschen",
  cancelText = "Abbrechen",
  type = "danger"
}) => {
  return /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose,
        className: "absolute inset-0 bg-background/80 backdrop-blur-sm"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
        lineNumber: 30,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        className: "relative w-full max-w-sm bg-surface border border-surface-2 rounded-2xl p-6 shadow-2xl",
        children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: onClose,
              className: "absolute top-4 right-4 p-2 hover:bg-surface-2 rounded-full transition-colors",
              children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
                lineNumber: 48,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
              lineNumber: 44,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center text-center gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: `p-3 rounded-full ${type === "danger" ? "bg-error/20 text-error" : "bg-warning/20 text-warning"}`, children: /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "w-6 h-6" }, void 0, false, {
              fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
              lineNumber: 53,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
              lineNumber: 52,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold", children: title }, void 0, false, {
                fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
                lineNumber: 57,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-text-secondary", children: message }, void 0, false, {
                fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
                lineNumber: 58,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
              lineNumber: 56,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 w-full mt-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: onClose,
                  className: "flex-1 py-3 px-4 rounded-xl bg-surface-2 font-bold text-sm hover:bg-surface-2/80 transition-colors",
                  children: cancelText
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
                  lineNumber: 62,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    onConfirm();
                    onClose();
                  },
                  className: `flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all active:scale-95 ${type === "danger" ? "bg-error shadow-lg shadow-error/20" : "bg-warning shadow-lg shadow-warning/20"}`,
                  children: confirmText
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
                  lineNumber: 68,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
              lineNumber: 61,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
            lineNumber: 51,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
        lineNumber: 38,
        columnNumber: 11
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
    lineNumber: 29,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/components/ui/ConfirmModal.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpcm1Nb2RhbC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IEFsZXJ0VHJpYW5nbGUsIFggfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5pbnRlcmZhY2UgQ29uZmlybU1vZGFsUHJvcHMge1xuICBpc09wZW46IGJvb2xlYW47XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG4gIG9uQ29uZmlybTogKCkgPT4gdm9pZDtcbiAgdGl0bGU6IHN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBjb25maXJtVGV4dD86IHN0cmluZztcbiAgY2FuY2VsVGV4dD86IHN0cmluZztcbiAgdHlwZT86ICdkYW5nZXInIHwgJ3dhcm5pbmcnO1xufVxuXG5leHBvcnQgY29uc3QgQ29uZmlybU1vZGFsOiBSZWFjdC5GQzxDb25maXJtTW9kYWxQcm9wcz4gPSAoe1xuICBpc09wZW4sXG4gIG9uQ2xvc2UsXG4gIG9uQ29uZmlybSxcbiAgdGl0bGUsXG4gIG1lc3NhZ2UsXG4gIGNvbmZpcm1UZXh0ID0gJ0zDtnNjaGVuJyxcbiAgY2FuY2VsVGV4dCA9ICdBYmJyZWNoZW4nLFxuICB0eXBlID0gJ2Rhbmdlcidcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8QW5pbWF0ZVByZXNlbmNlPlxuICAgICAge2lzT3BlbiAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LVsxMDBdIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtNFwiPlxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSB9fVxuICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1iYWNrZ3JvdW5kLzgwIGJhY2tkcm9wLWJsdXItc21cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgXG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgc2NhbGU6IDAuOSwgeTogMjAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEsIHk6IDAgfX1cbiAgICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCwgc2NhbGU6IDAuOSwgeTogMjAgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIHctZnVsbCBtYXgtdy1zbSBiZy1zdXJmYWNlIGJvcmRlciBib3JkZXItc3VyZmFjZS0yIHJvdW5kZWQtMnhsIHAtNiBzaGFkb3ctMnhsXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtNCByaWdodC00IHAtMiBob3ZlcjpiZy1zdXJmYWNlLTIgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciB0ZXh0LWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHAtMyByb3VuZGVkLWZ1bGwgJHt0eXBlID09PSAnZGFuZ2VyJyA/ICdiZy1lcnJvci8yMCB0ZXh0LWVycm9yJyA6ICdiZy13YXJuaW5nLzIwIHRleHQtd2FybmluZyd9YH0+XG4gICAgICAgICAgICAgICAgPEFsZXJ0VHJpYW5nbGUgY2xhc3NOYW1lPVwidy02IGgtNlwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGRcIj57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMyB3LWZ1bGwgbXQtMlwiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgcHktMyBweC00IHJvdW5kZWQteGwgYmctc3VyZmFjZS0yIGZvbnQtYm9sZCB0ZXh0LXNtIGhvdmVyOmJnLXN1cmZhY2UtMi84MCB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2NhbmNlbFRleHR9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXgtMSBweS0zIHB4LTQgcm91bmRlZC14bCBmb250LWJvbGQgdGV4dC1zbSB0ZXh0LXdoaXRlIHRyYW5zaXRpb24tYWxsIGFjdGl2ZTpzY2FsZS05NSAke1xuICAgICAgICAgICAgICAgICAgICB0eXBlID09PSAnZGFuZ2VyJyA/ICdiZy1lcnJvciBzaGFkb3ctbGcgc2hhZG93LWVycm9yLzIwJyA6ICdiZy13YXJuaW5nIHNoYWRvdy1sZyBzaGFkb3ctd2FybmluZy8yMCdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjb25maXJtVGV4dH1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQTZCVTtBQTVCVixTQUFTLFFBQVEsdUJBQXVCO0FBQ3hDLFNBQVMsZUFBZSxTQUFTO0FBYTFCLGFBQU0sZUFBNEMsQ0FBQztBQUFBLEVBQ3hEO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0EsY0FBYztBQUFBLEVBQ2QsYUFBYTtBQUFBLEVBQ2IsT0FBTztBQUNULE1BQU07QUFDSixTQUNFLHVCQUFDLG1CQUNFLG9CQUNDLHVCQUFDLFNBQUksV0FBVSw4REFDYjtBQUFBO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUFBLFFBQ3RCLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFBQSxRQUN0QixNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQUEsUUFDbkIsU0FBUztBQUFBLFFBQ1QsV0FBVTtBQUFBO0FBQUEsTUFMWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQTtBQUFBLElBRUE7QUFBQSxNQUFDLE9BQU87QUFBQSxNQUFQO0FBQUEsUUFDQyxTQUFTLEVBQUUsU0FBUyxHQUFHLE9BQU8sS0FBSyxHQUFHLEdBQUc7QUFBQSxRQUN6QyxTQUFTLEVBQUUsU0FBUyxHQUFHLE9BQU8sR0FBRyxHQUFHLEVBQUU7QUFBQSxRQUN0QyxNQUFNLEVBQUUsU0FBUyxHQUFHLE9BQU8sS0FBSyxHQUFHLEdBQUc7QUFBQSxRQUN0QyxXQUFVO0FBQUEsUUFFVjtBQUFBO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FDQyxTQUFTO0FBQUEsY0FDVCxXQUFVO0FBQUEsY0FFVixpQ0FBQyxLQUFFLFdBQVUsYUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUF1QjtBQUFBO0FBQUEsWUFKekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBS0E7QUFBQSxVQUVBLHVCQUFDLFNBQUksV0FBVSxnREFDYjtBQUFBLG1DQUFDLFNBQUksV0FBVyxvQkFBb0IsU0FBUyxXQUFXLDJCQUEyQiw0QkFBNEIsSUFDN0csaUNBQUMsaUJBQWMsV0FBVSxhQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUFtQyxLQURyQztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUVBO0FBQUEsWUFFQSx1QkFBQyxTQUFJLFdBQVUsYUFDYjtBQUFBLHFDQUFDLFFBQUcsV0FBVSxxQkFBcUIsbUJBQW5DO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQXlDO0FBQUEsY0FDekMsdUJBQUMsT0FBRSxXQUFVLCtCQUErQixxQkFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBb0Q7QUFBQSxpQkFGdEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFHQTtBQUFBLFlBRUEsdUJBQUMsU0FBSSxXQUFVLDBCQUNiO0FBQUE7QUFBQSxnQkFBQztBQUFBO0FBQUEsa0JBQ0MsU0FBUztBQUFBLGtCQUNULFdBQVU7QUFBQSxrQkFFVDtBQUFBO0FBQUEsZ0JBSkg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBS0E7QUFBQSxjQUNBO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUNDLFNBQVMsTUFBTTtBQUNiLDhCQUFVO0FBQ1YsNEJBQVE7QUFBQSxrQkFDVjtBQUFBLGtCQUNBLFdBQVcsMkZBQ1QsU0FBUyxXQUFXLHVDQUF1Qyx3Q0FDN0Q7QUFBQSxrQkFFQztBQUFBO0FBQUEsZ0JBVEg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBVUE7QUFBQSxpQkFqQkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFrQkE7QUFBQSxlQTVCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQTZCQTtBQUFBO0FBQUE7QUFBQSxNQTFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUEyQ0E7QUFBQSxPQXBERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBcURBLEtBdkRKO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F5REE7QUFFSjsiLCJuYW1lcyI6W119