const KOTLIN_KEYWORDS = [
  "val",
  "var",
  "fun",
  "if",
  "else",
  "when",
  "for",
  "while",
  "return",
  "class",
  "object",
  "interface",
  "package",
  "import",
  "in",
  "is",
  "as",
  "by",
  "private",
  "public",
  "protected",
  "internal"
];
const KOTLIN_STRUCTURAL = [
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  "=",
  ":",
  ".",
  ",",
  "->",
  "?",
  "!!",
  "+",
  "-",
  "*",
  "/",
  "%",
  "<",
  ">",
  "<=",
  ">=",
  "==",
  "!=",
  "&&",
  "||"
];
export const tokenize = (code) => {
  const regex = /\b(val|var|fun|if|else|when|for|while|return|class|object|interface|package|import|in|is|as|by|private|public|protected|internal)\b|(\(|\)|\{|\}|\[|\]|=|\:|(\.)|,|->|\?|!!|\+|-|\*|\/|%|<=|>=|==|!=|&&|\|\||<|>)|(\w+)/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(code)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
};
export const analyzeKotlinSyntax = (currentCode, solutionCode) => {
  const currentTokens = tokenize(currentCode);
  const solutionTokens = tokenize(solutionCode);
  const feedback = [];
  currentTokens.forEach((token, index) => {
    const isKeyword = KOTLIN_KEYWORDS.includes(token);
    const isStructural = KOTLIN_STRUCTURAL.includes(token);
    if (isKeyword || isStructural) {
      let type = "detected";
      const inSolution = solutionTokens.includes(token);
      if (inSolution) {
        type = "in-solution";
      }
      if (solutionTokens[index] === token) {
        type = "correct-pos";
      }
      feedback.push({
        id: `${token}-${index}`,
        text: token,
        type,
        index
      });
    }
  });
  return feedback;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN5bnRheEFuYWx5emVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIEZlZWRiYWNrVHlwZSA9ICdkZXRlY3RlZCcgfCAnaW4tc29sdXRpb24nIHwgJ2NvcnJlY3QtcG9zJztcblxuZXhwb3J0IGludGVyZmFjZSBGZWVkYmFja0VsZW1lbnQge1xuICBpZDogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHR5cGU6IEZlZWRiYWNrVHlwZTtcbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuY29uc3QgS09UTElOX0tFWVdPUkRTID0gW1xuICAndmFsJywgJ3ZhcicsICdmdW4nLCAnaWYnLCAnZWxzZScsICd3aGVuJywgJ2ZvcicsICd3aGlsZScsICdyZXR1cm4nLCBcbiAgJ2NsYXNzJywgJ29iamVjdCcsICdpbnRlcmZhY2UnLCAncGFja2FnZScsICdpbXBvcnQnLCAnaW4nLCAnaXMnLCAnYXMnLCAnYnknLCAncHJpdmF0ZScsICdwdWJsaWMnLCAncHJvdGVjdGVkJywgJ2ludGVybmFsJ1xuXTtcblxuY29uc3QgS09UTElOX1NUUlVDVFVSQUwgPSBbXG4gICcoJywgJyknLCAneycsICd9JywgJ1snLCAnXScsICc9JywgJzonLCAnLicsICcsJywgJy0+JywgJz8nLCAnISEnLCAnKycsICctJywgJyonLCAnLycsICclJywgJzwnLCAnPicsICc8PScsICc+PScsICc9PScsICchPScsICcmJicsICd8fCdcbl07XG5cbmV4cG9ydCBjb25zdCB0b2tlbml6ZSA9IChjb2RlOiBzdHJpbmcpOiBzdHJpbmdbXSA9PiB7XG4gIC8vIFNpbXBsZSB0b2tlbml6ZXIgZm9yIEtvdGxpbiBrZXl3b3JkcyBhbmQgc3RydWN0dXJhbCBlbGVtZW50c1xuICAvLyBUaGlzIHJlZ2V4IG1hdGNoZXMga2V5d29yZHMsIHN0cnVjdHVyYWwgZWxlbWVudHMsIGFuZCBpZGVudGlmaWVyc1xuICBjb25zdCByZWdleCA9IC9cXGIodmFsfHZhcnxmdW58aWZ8ZWxzZXx3aGVufGZvcnx3aGlsZXxyZXR1cm58Y2xhc3N8b2JqZWN0fGludGVyZmFjZXxwYWNrYWdlfGltcG9ydHxpbnxpc3xhc3xieXxwcml2YXRlfHB1YmxpY3xwcm90ZWN0ZWR8aW50ZXJuYWwpXFxifChcXCh8XFwpfFxce3xcXH18XFxbfFxcXXw9fFxcOnwoXFwuKXwsfC0+fFxcP3whIXxcXCt8LXxcXCp8XFwvfCV8PD18Pj18PT18IT18JiZ8XFx8XFx8fDx8Pil8KFxcdyspL2c7XG4gIGNvbnN0IHRva2Vuczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gcmVnZXguZXhlYyhjb2RlKSkgIT09IG51bGwpIHtcbiAgICB0b2tlbnMucHVzaChtYXRjaFswXSk7XG4gIH1cbiAgcmV0dXJuIHRva2Vucztcbn07XG5cbmV4cG9ydCBjb25zdCBhbmFseXplS290bGluU3ludGF4ID0gKGN1cnJlbnRDb2RlOiBzdHJpbmcsIHNvbHV0aW9uQ29kZTogc3RyaW5nKTogRmVlZGJhY2tFbGVtZW50W10gPT4ge1xuICBjb25zdCBjdXJyZW50VG9rZW5zID0gdG9rZW5pemUoY3VycmVudENvZGUpO1xuICBjb25zdCBzb2x1dGlvblRva2VucyA9IHRva2VuaXplKHNvbHV0aW9uQ29kZSk7XG5cbiAgY29uc3QgZmVlZGJhY2s6IEZlZWRiYWNrRWxlbWVudFtdID0gW107XG5cbiAgY3VycmVudFRva2Vucy5mb3JFYWNoKCh0b2tlbiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0tleXdvcmQgPSBLT1RMSU5fS0VZV09SRFMuaW5jbHVkZXModG9rZW4pO1xuICAgIGNvbnN0IGlzU3RydWN0dXJhbCA9IEtPVExJTl9TVFJVQ1RVUkFMLmluY2x1ZGVzKHRva2VuKTtcblxuICAgIGlmIChpc0tleXdvcmQgfHwgaXNTdHJ1Y3R1cmFsKSB7XG4gICAgICBsZXQgdHlwZTogRmVlZGJhY2tUeXBlID0gJ2RldGVjdGVkJztcblxuICAgICAgLy8gQ2hlY2sgaWYgaXQncyBpbiB0aGUgc29sdXRpb24gYXQgYWxsXG4gICAgICBjb25zdCBpblNvbHV0aW9uID0gc29sdXRpb25Ub2tlbnMuaW5jbHVkZXModG9rZW4pO1xuICAgICAgaWYgKGluU29sdXRpb24pIHtcbiAgICAgICAgdHlwZSA9ICdpbi1zb2x1dGlvbic7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIGl0J3MgYXQgdGhlIGNvcnJlY3QgcG9zaXRpb24gKGluZGV4KVxuICAgICAgLy8gVGhpcyBpcyBhIHNpbXBsZSBjb21wYXJpc29uLCBtaWdodCBuZWVkIHJlZmluZW1lbnQgZm9yIG5lc3RlZCBzdHJ1Y3R1cmVzXG4gICAgICBpZiAoc29sdXRpb25Ub2tlbnNbaW5kZXhdID09PSB0b2tlbikge1xuICAgICAgICB0eXBlID0gJ2NvcnJlY3QtcG9zJztcbiAgICAgIH1cblxuICAgICAgZmVlZGJhY2sucHVzaCh7XG4gICAgICAgIGlkOiBgJHt0b2tlbn0tJHtpbmRleH1gLFxuICAgICAgICB0ZXh0OiB0b2tlbixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgaW5kZXhcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZlZWRiYWNrO1xufTtcbiJdLCJtYXBwaW5ncyI6IkFBU0EsTUFBTSxrQkFBa0I7QUFBQSxFQUN0QjtBQUFBLEVBQU87QUFBQSxFQUFPO0FBQUEsRUFBTztBQUFBLEVBQU07QUFBQSxFQUFRO0FBQUEsRUFBUTtBQUFBLEVBQU87QUFBQSxFQUFTO0FBQUEsRUFDM0Q7QUFBQSxFQUFTO0FBQUEsRUFBVTtBQUFBLEVBQWE7QUFBQSxFQUFXO0FBQUEsRUFBVTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFXO0FBQUEsRUFBVTtBQUFBLEVBQWE7QUFDakg7QUFFQSxNQUFNLG9CQUFvQjtBQUFBLEVBQ3hCO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUN0STtBQUVPLGFBQU0sV0FBVyxDQUFDLFNBQTJCO0FBR2xELFFBQU0sUUFBUTtBQUNkLFFBQU0sU0FBbUIsQ0FBQztBQUMxQixNQUFJO0FBQ0osVUFBUSxRQUFRLE1BQU0sS0FBSyxJQUFJLE9BQU8sTUFBTTtBQUMxQyxXQUFPLEtBQUssTUFBTSxDQUFDLENBQUM7QUFBQSxFQUN0QjtBQUNBLFNBQU87QUFDVDtBQUVPLGFBQU0sc0JBQXNCLENBQUMsYUFBcUIsaUJBQTRDO0FBQ25HLFFBQU0sZ0JBQWdCLFNBQVMsV0FBVztBQUMxQyxRQUFNLGlCQUFpQixTQUFTLFlBQVk7QUFFNUMsUUFBTSxXQUE4QixDQUFDO0FBRXJDLGdCQUFjLFFBQVEsQ0FBQyxPQUFPLFVBQVU7QUFDdEMsVUFBTSxZQUFZLGdCQUFnQixTQUFTLEtBQUs7QUFDaEQsVUFBTSxlQUFlLGtCQUFrQixTQUFTLEtBQUs7QUFFckQsUUFBSSxhQUFhLGNBQWM7QUFDN0IsVUFBSSxPQUFxQjtBQUd6QixZQUFNLGFBQWEsZUFBZSxTQUFTLEtBQUs7QUFDaEQsVUFBSSxZQUFZO0FBQ2QsZUFBTztBQUFBLE1BQ1Q7QUFJQSxVQUFJLGVBQWUsS0FBSyxNQUFNLE9BQU87QUFDbkMsZUFBTztBQUFBLE1BQ1Q7QUFFQSxlQUFTLEtBQUs7QUFBQSxRQUNaLElBQUksR0FBRyxLQUFLLElBQUksS0FBSztBQUFBLFFBQ3JCLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPO0FBQ1Q7IiwibmFtZXMiOltdfQ==