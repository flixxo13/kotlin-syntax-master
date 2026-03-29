import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bc8ae8be"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bc8ae8be"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"];
export const AssignmentView = ({
  zielCode,
  bausteineRichtig,
  bausteineDistraktor,
  onComplete,
  map,
  currentHintLevel
}) => {
  const [availableTokens, setAvailableTokens] = useState([]);
  const [placedTokens, setPlacedTokens] = useState({});
  const [slots, setSlots] = useState([]);
  useEffect(() => {
    const allTokens = [...bausteineRichtig, ...bausteineDistraktor].sort(() => Math.random() - 0.5);
    setAvailableTokens(allTokens);
    const slotMatches = zielCode.match(/__\d+__/g) || [];
    setSlots(slotMatches);
    setPlacedTokens({});
  }, [zielCode, bausteineRichtig, bausteineDistraktor]);
  useEffect(() => {
    if (currentHintLevel === "revealed") {
      setPlacedTokens(map);
      setAvailableTokens([]);
    }
  }, [map, currentHintLevel]);
  const handleTokenClick = (token) => {
    const firstEmptySlot = slots.find((slot) => !placedTokens[slot]);
    if (firstEmptySlot) {
      setPlacedTokens((prev) => ({ ...prev, [firstEmptySlot]: token }));
      setAvailableTokens((prev) => {
        const index = prev.indexOf(token);
        if (index > -1) {
          const next = [...prev];
          next.splice(index, 1);
          return next;
        }
        return prev;
      });
    }
  };
  const handleSlotClick = (slot) => {
    const token = placedTokens[slot];
    if (token) {
      setAvailableTokens((prev) => [...prev, token]);
      setPlacedTokens((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
    }
  };
  const checkSolution = () => {
    const allFilled = slots.length > 0 && slots.every((slot) => placedTokens[slot]);
    if (!allFilled) {
      onComplete(false);
      return;
    }
    const isCorrect = slots.every((slot) => placedTokens[slot] === map[slot]);
    onComplete(isCorrect);
  };
  const renderCode = () => {
    const parts = zielCode.split(/(__\d+__)/);
    return /* @__PURE__ */ jsxDEV("pre", { className: "font-mono text-sm leading-relaxed whitespace-pre-wrap", children: parts.map((part, i) => {
      if (part.match(/__\d+__/)) {
        const token = placedTokens[part];
        return /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => handleSlotClick(part),
            className: `inline-flex items-center justify-center min-w-[40px] h-6 px-2 mx-1 rounded border transition-all ${token ? "bg-primary text-white border-primary" : "bg-surface-2 border-surface-2 border-dashed text-transparent"}`,
            children: token || "____"
          },
          i,
          false,
          {
            fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
            lineNumber: 94,
            columnNumber: 15
          },
          this
        );
      }
      return /* @__PURE__ */ jsxDEV("span", { children: part }, i, false, {
        fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
        lineNumber: 107,
        columnNumber: 18
      }, this);
    }) }, void 0, false, {
      fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-6 p-4 h-full", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 bg-surface border border-surface-2 rounded-xl p-6 overflow-y-auto", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-text-secondary text-[10px] uppercase font-mono tracking-widest mb-4", children: "Ziel-Code" }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      renderCode()
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-text-secondary text-[10px] uppercase font-mono tracking-widest", children: "Verfügbare Bausteine" }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", children: availableTokens.map((token, i) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => handleTokenClick(token),
          className: "px-3 py-2 bg-surface-2 hover:bg-surface-2/80 rounded text-sm font-mono active:scale-95 transition-all",
          children: token
        },
        i,
        false,
        {
          fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
          lineNumber: 124,
          columnNumber: 13
        },
        this
      )) }, void 0, false, {
        fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: checkSolution,
        className: "w-full py-4 bg-primary text-white rounded-xl font-bold active:scale-95 transition-transform",
        children: "Prüfen"
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
        lineNumber: 135,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/exercise/AssignmentView.tsx",
    lineNumber: 114,
    columnNumber: 5
  }, this);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2lnbm1lbnRWaWV3LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgUmVvcmRlciB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyB1c2VMZWFybmluZ1N0b3JlIH0gZnJvbSAnLi4vLi4vc3RvcmUvdXNlTGVhcm5pbmdTdG9yZSc7XG5cbmludGVyZmFjZSBBc3NpZ25tZW50Vmlld1Byb3BzIHtcbiAgemllbENvZGU6IHN0cmluZztcbiAgYmF1c3RlaW5lUmljaHRpZzogc3RyaW5nW107XG4gIGJhdXN0ZWluZURpc3RyYWt0b3I6IHN0cmluZ1tdO1xuICBvbkNvbXBsZXRlOiAoaXNDb3JyZWN0OiBib29sZWFuKSA9PiB2b2lkO1xuICBtYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGN1cnJlbnRIaW50TGV2ZWw/OiBzdHJpbmcgfCBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBBc3NpZ25tZW50VmlldzogUmVhY3QuRkM8QXNzaWdubWVudFZpZXdQcm9wcz4gPSAoe1xuICB6aWVsQ29kZSxcbiAgYmF1c3RlaW5lUmljaHRpZyxcbiAgYmF1c3RlaW5lRGlzdHJha3RvcixcbiAgb25Db21wbGV0ZSxcbiAgbWFwLFxuICBjdXJyZW50SGludExldmVsXG59KSA9PiB7XG4gIGNvbnN0IFthdmFpbGFibGVUb2tlbnMsIHNldEF2YWlsYWJsZVRva2Vuc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oW10pO1xuICBjb25zdCBbcGxhY2VkVG9rZW5zLCBzZXRQbGFjZWRUb2tlbnNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xuICBjb25zdCBbc2xvdHMsIHNldFNsb3RzXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBJbml0aWFsaXplIHRva2Vuc1xuICAgIGNvbnN0IGFsbFRva2VucyA9IFsuLi5iYXVzdGVpbmVSaWNodGlnLCAuLi5iYXVzdGVpbmVEaXN0cmFrdG9yXS5zb3J0KCgpID0+IE1hdGgucmFuZG9tKCkgLSAwLjUpO1xuICAgIHNldEF2YWlsYWJsZVRva2VucyhhbGxUb2tlbnMpO1xuXG4gICAgLy8gRmluZCBzbG90cyBpbiB6aWVsQ29kZVxuICAgIGNvbnN0IHNsb3RNYXRjaGVzID0gemllbENvZGUubWF0Y2goL19fXFxkK19fL2cpIHx8IFtdO1xuICAgIHNldFNsb3RzKHNsb3RNYXRjaGVzKTtcbiAgICBzZXRQbGFjZWRUb2tlbnMoe30pO1xuICB9LCBbemllbENvZGUsIGJhdXN0ZWluZVJpY2h0aWcsIGJhdXN0ZWluZURpc3RyYWt0b3JdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjdXJyZW50SGludExldmVsID09PSAncmV2ZWFsZWQnKSB7XG4gICAgICBzZXRQbGFjZWRUb2tlbnMobWFwKTtcbiAgICAgIHNldEF2YWlsYWJsZVRva2VucyhbXSk7XG4gICAgfVxuICB9LCBbbWFwLCBjdXJyZW50SGludExldmVsXSk7XG5cbiAgY29uc3QgaGFuZGxlVG9rZW5DbGljayA9ICh0b2tlbjogc3RyaW5nKSA9PiB7XG4gICAgLy8gRmluZCBmaXJzdCBlbXB0eSBzbG90XG4gICAgY29uc3QgZmlyc3RFbXB0eVNsb3QgPSBzbG90cy5maW5kKHNsb3QgPT4gIXBsYWNlZFRva2Vuc1tzbG90XSk7XG4gICAgaWYgKGZpcnN0RW1wdHlTbG90KSB7XG4gICAgICBzZXRQbGFjZWRUb2tlbnMocHJldiA9PiAoeyAuLi5wcmV2LCBbZmlyc3RFbXB0eVNsb3RdOiB0b2tlbiB9KSk7XG4gICAgICBzZXRBdmFpbGFibGVUb2tlbnMocHJldiA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcHJldi5pbmRleE9mKHRva2VuKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gWy4uLnByZXZdO1xuICAgICAgICAgIG5leHQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVTbG90Q2xpY2sgPSAoc2xvdDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSBwbGFjZWRUb2tlbnNbc2xvdF07XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBzZXRBdmFpbGFibGVUb2tlbnMocHJldiA9PiBbLi4ucHJldiwgdG9rZW5dKTtcbiAgICAgIHNldFBsYWNlZFRva2VucyhwcmV2ID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4ucHJldiB9O1xuICAgICAgICBkZWxldGUgbmV4dFtzbG90XTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tTb2x1dGlvbiA9ICgpID0+IHtcbiAgICAvLyBDaGVjayBpZiBhbGwgc2xvdHMgYXJlIGZpbGxlZCBjb3JyZWN0bHkgYWNjb3JkaW5nIHRvIHRoZSBtYXBcbiAgICBjb25zdCBhbGxGaWxsZWQgPSBzbG90cy5sZW5ndGggPiAwICYmIHNsb3RzLmV2ZXJ5KHNsb3QgPT4gcGxhY2VkVG9rZW5zW3Nsb3RdKTtcbiAgICBpZiAoIWFsbEZpbGxlZCkge1xuICAgICAgb25Db21wbGV0ZShmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNDb3JyZWN0ID0gc2xvdHMuZXZlcnkoc2xvdCA9PiBwbGFjZWRUb2tlbnNbc2xvdF0gPT09IG1hcFtzbG90XSk7XG4gICAgb25Db21wbGV0ZShpc0NvcnJlY3QpO1xuICB9O1xuXG4gIC8vIFJlbmRlciB0aGUgY29kZSB3aXRoIGludGVyYWN0aXZlIHNsb3RzXG4gIGNvbnN0IHJlbmRlckNvZGUgPSAoKSA9PiB7XG4gICAgY29uc3QgcGFydHMgPSB6aWVsQ29kZS5zcGxpdCgvKF9fXFxkK19fKS8pO1xuICAgIHJldHVybiAoXG4gICAgICA8cHJlIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LXNtIGxlYWRpbmctcmVsYXhlZCB3aGl0ZXNwYWNlLXByZS13cmFwXCI+XG4gICAgICAgIHtwYXJ0cy5tYXAoKHBhcnQsIGkpID0+IHtcbiAgICAgICAgICBpZiAocGFydC5tYXRjaCgvX19cXGQrX18vKSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBwbGFjZWRUb2tlbnNbcGFydF07XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVNsb3RDbGljayhwYXJ0KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWluLXctWzQwcHhdIGgtNiBweC0yIG14LTEgcm91bmRlZCBib3JkZXIgdHJhbnNpdGlvbi1hbGwgJHtcbiAgICAgICAgICAgICAgICAgIHRva2VuIFxuICAgICAgICAgICAgICAgICAgICA/ICdiZy1wcmltYXJ5IHRleHQtd2hpdGUgYm9yZGVyLXByaW1hcnknIFxuICAgICAgICAgICAgICAgICAgICA6ICdiZy1zdXJmYWNlLTIgYm9yZGVyLXN1cmZhY2UtMiBib3JkZXItZGFzaGVkIHRleHQtdHJhbnNwYXJlbnQnXG4gICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dG9rZW4gfHwgJ19fX18nfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2l9PntwYXJ0fTwvc3Bhbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9wcmU+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtNiBwLTQgaC1mdWxsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBiZy1zdXJmYWNlIGJvcmRlciBib3JkZXItc3VyZmFjZS0yIHJvdW5kZWQteGwgcC02IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtdGV4dC1zZWNvbmRhcnkgdGV4dC1bMTBweF0gdXBwZXJjYXNlIGZvbnQtbW9ubyB0cmFja2luZy13aWRlc3QgbWItNFwiPlppZWwtQ29kZTwvZGl2PlxuICAgICAgICB7cmVuZGVyQ29kZSgpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtdGV4dC1zZWNvbmRhcnkgdGV4dC1bMTBweF0gdXBwZXJjYXNlIGZvbnQtbW9ubyB0cmFja2luZy13aWRlc3RcIj5WZXJmw7xnYmFyZSBCYXVzdGVpbmU8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMlwiPlxuICAgICAgICAgIHthdmFpbGFibGVUb2tlbnMubWFwKCh0b2tlbiwgaSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVRva2VuQ2xpY2sodG9rZW4pfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTIgYmctc3VyZmFjZS0yIGhvdmVyOmJnLXN1cmZhY2UtMi84MCByb3VuZGVkIHRleHQtc20gZm9udC1tb25vIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0b2tlbn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICA8YnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9e2NoZWNrU29sdXRpb259XG4gICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS00IGJnLXByaW1hcnkgdGV4dC13aGl0ZSByb3VuZGVkLXhsIGZvbnQtYm9sZCBhY3RpdmU6c2NhbGUtOTUgdHJhbnNpdGlvbi10cmFuc2Zvcm1cIlxuICAgICAgPlxuICAgICAgICBQcsO8ZmVuXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQTZGYztBQTdGZCxTQUFnQixVQUFVLGlCQUFpQjtBQWFwQyxhQUFNLGlCQUFnRCxDQUFDO0FBQUEsRUFDNUQ7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLE1BQU07QUFDSixRQUFNLENBQUMsaUJBQWlCLGtCQUFrQixJQUFJLFNBQW1CLENBQUMsQ0FBQztBQUNuRSxRQUFNLENBQUMsY0FBYyxlQUFlLElBQUksU0FBaUMsQ0FBQyxDQUFDO0FBQzNFLFFBQU0sQ0FBQyxPQUFPLFFBQVEsSUFBSSxTQUFtQixDQUFDLENBQUM7QUFFL0MsWUFBVSxNQUFNO0FBRWQsVUFBTSxZQUFZLENBQUMsR0FBRyxrQkFBa0IsR0FBRyxtQkFBbUIsRUFBRSxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBRztBQUM5Rix1QkFBbUIsU0FBUztBQUc1QixVQUFNLGNBQWMsU0FBUyxNQUFNLFVBQVUsS0FBSyxDQUFDO0FBQ25ELGFBQVMsV0FBVztBQUNwQixvQkFBZ0IsQ0FBQyxDQUFDO0FBQUEsRUFDcEIsR0FBRyxDQUFDLFVBQVUsa0JBQWtCLG1CQUFtQixDQUFDO0FBRXBELFlBQVUsTUFBTTtBQUNkLFFBQUkscUJBQXFCLFlBQVk7QUFDbkMsc0JBQWdCLEdBQUc7QUFDbkIseUJBQW1CLENBQUMsQ0FBQztBQUFBLElBQ3ZCO0FBQUEsRUFDRixHQUFHLENBQUMsS0FBSyxnQkFBZ0IsQ0FBQztB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