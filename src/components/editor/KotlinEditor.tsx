import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"];
import { EditorState } from "/node_modules/.vite/deps/@codemirror_state.js?v=1594cfd4";
import { EditorView, keymap, highlightActiveLine, lineNumbers } from "/node_modules/.vite/deps/@codemirror_view.js?v=3ad9a3d3";
import { defaultKeymap, history, historyKeymap } from "/node_modules/.vite/deps/@codemirror_commands.js?v=e9940b4a";
import { javascript } from "/node_modules/.vite/deps/@codemirror_lang-javascript.js?v=26e05e9c";
import { oneDark } from "/node_modules/.vite/deps/@codemirror_theme-one-dark.js?v=4d02b6b3";
export const KotlinEditor = ({ code, onChange, height, onFocus, onBlur }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) return;
    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        javascript(),
        // Placeholder for Kotlin
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
          if (update.focusChanged) {
            if (viewRef.current?.hasFocus) {
              onFocus?.();
            } else {
              onBlur?.();
            }
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" }
        })
      ]
    });
    const view = new EditorView({
      state,
      parent: editorRef.current
    });
    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);
  useEffect(() => {
    if (viewRef.current && code !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: code }
      });
    }
  }, [code]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: editorRef,
      className: "border-y border-surface-2 overflow-hidden",
      style: { height: `${height}px` }
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/editor/KotlinEditor.tsx",
      lineNumber: 73,
      columnNumber: 5
    },
    this
  );
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktvdGxpbkVkaXRvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tICdAY29kZW1pcnJvci9zdGF0ZSc7XG5pbXBvcnQgeyBFZGl0b3JWaWV3LCBrZXltYXAsIGhpZ2hsaWdodEFjdGl2ZUxpbmUsIGxpbmVOdW1iZXJzIH0gZnJvbSAnQGNvZGVtaXJyb3Ivdmlldyc7XG5pbXBvcnQgeyBkZWZhdWx0S2V5bWFwLCBoaXN0b3J5LCBoaXN0b3J5S2V5bWFwIH0gZnJvbSAnQGNvZGVtaXJyb3IvY29tbWFuZHMnO1xuaW1wb3J0IHsgamF2YXNjcmlwdCB9IGZyb20gJ0Bjb2RlbWlycm9yL2xhbmctamF2YXNjcmlwdCc7IC8vIFVzaW5nIEpTIGFzIGJhc2UgZm9yIEtvdGxpbi1saWtlIGhpZ2hsaWdodGluZ1xuaW1wb3J0IHsgb25lRGFyayB9IGZyb20gJ0Bjb2RlbWlycm9yL3RoZW1lLW9uZS1kYXJrJztcblxuaW50ZXJmYWNlIEtvdGxpbkVkaXRvclByb3BzIHtcbiAgY29kZTogc3RyaW5nO1xuICBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIGhlaWdodDogbnVtYmVyO1xuICBvbkZvY3VzPzogKCkgPT4gdm9pZDtcbiAgb25CbHVyPzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEtvdGxpbkVkaXRvcjogUmVhY3QuRkM8S290bGluRWRpdG9yUHJvcHM+ID0gKHsgY29kZSwgb25DaGFuZ2UsIGhlaWdodCwgb25Gb2N1cywgb25CbHVyIH0pID0+IHtcbiAgY29uc3QgZWRpdG9yUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3Qgdmlld1JlZiA9IHVzZVJlZjxFZGl0b3JWaWV3IHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWVkaXRvclJlZi5jdXJyZW50KSByZXR1cm47XG5cbiAgICBjb25zdCBzdGF0ZSA9IEVkaXRvclN0YXRlLmNyZWF0ZSh7XG4gICAgICBkb2M6IGNvZGUsXG4gICAgICBleHRlbnNpb25zOiBbXG4gICAgICAgIGxpbmVOdW1iZXJzKCksXG4gICAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmUoKSxcbiAgICAgICAgaGlzdG9yeSgpLFxuICAgICAgICBrZXltYXAub2YoWy4uLmRlZmF1bHRLZXltYXAsIC4uLmhpc3RvcnlLZXltYXBdKSxcbiAgICAgICAgamF2YXNjcmlwdCgpLCAvLyBQbGFjZWhvbGRlciBmb3IgS290bGluXG4gICAgICAgIG9uZURhcmssXG4gICAgICAgIEVkaXRvclZpZXcudXBkYXRlTGlzdGVuZXIub2YoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGlmICh1cGRhdGUuZG9jQ2hhbmdlZCkge1xuICAgICAgICAgICAgb25DaGFuZ2UodXBkYXRlLnN0YXRlLmRvYy50b1N0cmluZygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZS5mb2N1c0NoYW5nZWQpIHtcbiAgICAgICAgICAgIGlmICh2aWV3UmVmLmN1cnJlbnQ/Lmhhc0ZvY3VzKSB7XG4gICAgICAgICAgICAgIG9uRm9jdXM/LigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb25CbHVyPy4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBFZGl0b3JWaWV3LnRoZW1lKHtcbiAgICAgICAgICBcIiZcIjogeyBoZWlnaHQ6IFwiMTAwJVwiIH0sXG4gICAgICAgICAgXCIuY20tc2Nyb2xsZXJcIjogeyBvdmVyZmxvdzogXCJhdXRvXCIgfVxuICAgICAgICB9KVxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZpZXcgPSBuZXcgRWRpdG9yVmlldyh7XG4gICAgICBzdGF0ZSxcbiAgICAgIHBhcmVudDogZWRpdG9yUmVmLmN1cnJlbnQsXG4gICAgfSk7XG5cbiAgICB2aWV3UmVmLmN1cnJlbnQgPSB2aWV3O1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHZpZXcuZGVzdHJveSgpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICAvLyBTeW5jIGV4dGVybmFsIGNvZGUgY2hhbmdlcyAoZS5nLiBmcm9tIHNob3J0Y3V0cylcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodmlld1JlZi5jdXJyZW50ICYmIGNvZGUgIT09IHZpZXdSZWYuY3VycmVudC5zdGF0ZS5kb2MudG9TdHJpbmcoKSkge1xuICAgICAgdmlld1JlZi5jdXJyZW50LmRpc3BhdGNoKHtcbiAgICAgICAgY2hhbmdlczogeyBmcm9tOiAwLCB0bzogdmlld1JlZi5jdXJyZW50LnN0YXRlLmRvYy5sZW5ndGgsIGluc2VydDogY29kZSB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtjb2RlXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IFxuICAgICAgcmVmPXtlZGl0b3JSZWZ9IFxuICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyLXkgYm9yZGVyLXN1cmZhY2UtMiBvdmVyZmxvdy1oaWRkZW5cIiBcbiAgICAgIHN0eWxlPXt7IGhlaWdodDogYCR7aGVpZ2h0fXB4YCB9fVxuICAgIC8+XG4gICk7XG59O1xuIl0sIm1hcHBpbmdzIjoiQUF3RUk7QUF4RUosU0FBZ0IsV0FBVyxjQUFjO0FBQ3pDLFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsWUFBWSxRQUFRLHFCQUFxQixtQkFBbUI7QUFDckUsU0FBUyxlQUFlLFNBQVMscUJBQXFCO0FBQ3RELFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsZUFBZTtBQVVqQixhQUFNLGVBQTRDLENBQUMsRUFBRSxNQUFNLFVBQVUsUUFBUSxTQUFTLE9BQU8sTUFBTTtBQUN4RyxRQUFNLFlBQVksT0FBdUIsSUFBSTtBQUM3QyxRQUFNLFVBQVUsT0FBMEIsSUFBSTtBQUU5QyxZQUFVLE1BQU07QUFDZCxRQUFJLENBQUMsVUFBVSxRQUFTO0FBRXhCLFVBQU0sUUFBUSxZQUFZLE9BQU87QUFBQSxNQUMvQixLQUFLO0FBQUEsTUFDTCxZQUFZO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixvQkFBb0I7QUFBQSxRQUNwQixRQUFRO0FBQUEsUUFDUixPQUFPLEdBQUcsQ0FBQyxHQUFHLGVBQWUsR0FBRyxhQUFhLENBQUM7QUFBQSxRQUM5QyxXQUFXO0FBQUE7QUFBQSxRQUNYO0FBQUEsUUFDQSxXQUFXLGVBQWUsR0FBRyxDQUFDLFdBQVc7QUFDdkMsY0FBSSxPQUFPLFlBQVk7QUFDckIscUJBQVMsT0FBTyxNQUFNLElBQUksU0FBUyxDQUFDO0FBQUEsVUFDdEM7QUFDQSxjQUFJLE9BQU8sY0FBYztBQUN2QixnQkFBSSxRQUFRLFNBQVMsVUFBVTtBQUM3Qix3QkFBVTtBQUFBLFlBQ1osT0FBTztBQUNMLHVCQUFTO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxRQUNELFdBQVcsTUFBTTtBQUFBLFVBQ2YsS0FBSyxFQUFFLFFBQVEsT0FBTztBQUFBLFVBQ3RCLGdCQUFnQixFQUFFLFVBQVUsT0FBTztBQUFBLFFBQ3JDLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBRUQsVUFBTSxPQUFPLElBQUksV0FBVztBQUFBLE1BQzFCO0FBQUEsTUFDQSxRQUFRLFVBQVU7QUFBQSxJQUNwQixDQUFDO0FBRUQsWUFBUSxVQUFVO0FBRWxCLFdBQU8sTUFBTTtBQUNYLFdBQUssUUFBUTtBQUFBLElBQ2Y7QUFBQSxFQUNGLEdBQUcsQ0FBQyxDQUFDO0FBR0wsWUFBVSxNQUFNO0FBQ2QsUUFBSSxRQUFRLFdBQVcsU0FBUyxRQUFRLFFBQVEsTUFBTSxJQUFJLFNBQVMsR0FBRztBQUNwRSxjQUFRLFFBQVEsU0FBUztBQUFBLFFBQ3ZCLFNBQVMsRUFBRSxNQUFNLEdBQUcsSUFBSSxRQUFRLFFBQVEsTUFBTSxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQUEsTUFDekUsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFFVCxTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxLQUFLO0FBQUEsTUFDTCxXQUFVO0FBQUEsTUFDVixPQUFPLEVBQUUsUUFBUSxHQUFHLE1BQU0sS0FBSztBQUFBO0FBQUEsSUFIakM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUE7QUFFSjsiLCJuYW1lcyI6W119