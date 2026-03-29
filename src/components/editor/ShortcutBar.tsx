import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
const SHORTCUTS = [
  "fun",
  "val",
  "var",
  "{ }",
  "( )",
  "->",
  "?:",
  "?.",
  "!!",
  "..",
  "===",
  "==",
  ":",
  ",",
  "[ ]",
  "$"
];
export const ShortcutBar = ({ onInsert }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "flex overflow-x-auto bg-surface-2 p-2 gap-2 no-scrollbar border-b border-surface", children: SHORTCUTS.map((s) => /* @__PURE__ */ jsxDEV(
    "button",
    {
      onClick: () => onInsert(s),
      className: "px-4 py-2 bg-surface rounded text-sm font-mono whitespace-nowrap active:bg-primary active:text-white transition-colors",
      children: s
    },
    s,
    false,
    {
      fileName: "/app/applet/src/components/editor/ShortcutBar.tsx",
      lineNumber: 15,
      columnNumber: 9
    },
    this
  )) }, void 0, false, {
    fileName: "/app/applet/src/components/editor/ShortcutBar.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNob3J0Y3V0QmFyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbnRlcmZhY2UgU2hvcnRjdXRCYXJQcm9wcyB7XG4gIG9uSW5zZXJ0OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xufVxuXG5jb25zdCBTSE9SVENVVFMgPSBbXG4gICdmdW4nLCAndmFsJywgJ3ZhcicsICd7IH0nLCAnKCApJywgJy0+JywgJz86JywgJz8uJywgJyEhJywgJy4uJywgJz09PScsICc9PScsICc6JywgJywnLCAnWyBdJywgJyQnXG5dO1xuXG5leHBvcnQgY29uc3QgU2hvcnRjdXRCYXI6IFJlYWN0LkZDPFNob3J0Y3V0QmFyUHJvcHM+ID0gKHsgb25JbnNlcnQgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBvdmVyZmxvdy14LWF1dG8gYmctc3VyZmFjZS0yIHAtMiBnYXAtMiBuby1zY3JvbGxiYXIgYm9yZGVyLWIgYm9yZGVyLXN1cmZhY2VcIj5cbiAgICAgIHtTSE9SVENVVFMubWFwKChzKSA9PiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBrZXk9e3N9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25JbnNlcnQocyl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIGJnLXN1cmZhY2Ugcm91bmRlZCB0ZXh0LXNtIGZvbnQtbW9ubyB3aGl0ZXNwYWNlLW5vd3JhcCBhY3RpdmU6YmctcHJpbWFyeSBhY3RpdmU6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgID5cbiAgICAgICAgICB7c31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQWNRO0FBUlIsTUFBTSxZQUFZO0FBQUEsRUFDaEI7QUFBQSxFQUFPO0FBQUEsRUFBTztBQUFBLEVBQU87QUFBQSxFQUFPO0FBQUEsRUFBTztBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTztBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQU87QUFDakc7QUFFTyxhQUFNLGNBQTBDLENBQUMsRUFBRSxTQUFTLE1BQU07QUFDdkUsU0FDRSx1QkFBQyxTQUFJLFdBQVUsb0ZBQ1osb0JBQVUsSUFBSSxDQUFDLE1BQ2Q7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUVDLFNBQVMsTUFBTSxTQUFTLENBQUM7QUFBQSxNQUN6QixXQUFVO0FBQUEsTUFFVDtBQUFBO0FBQUEsSUFKSTtBQUFBLElBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLENBQ0QsS0FUSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBVUE7QUFFSjsiLCJuYW1lcyI6W119