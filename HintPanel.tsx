// ─── KOTLIN SYNTAX ANALYZER ───────────────────────────────────────────────────
// Supports: correct position (green), in-solution wrong pos (blue), kotlin-syntax only (gray)

export type FeedbackType = 'correct-pos' | 'in-solution' | 'detected' | 'unknown';

export interface FeedbackElement {
  id:    string;
  text:  string;
  type:  FeedbackType;
  index: number;
}

// ─── KOTLIN KEYWORDS ──────────────────────────────────────────────────────────
const KOTLIN_KEYWORDS = new Set([
  'val', 'var', 'fun', 'if', 'else', 'when', 'for', 'while', 'do',
  'return', 'class', 'object', 'interface', 'package', 'import',
  'in', 'is', 'as', 'by', 'private', 'public', 'protected', 'internal',
  'null', 'true', 'false', 'this', 'super', 'override', 'data', 'sealed',
  'companion', 'typealias', 'lateinit', 'lazy', 'abstract', 'open',
  // Kotlin-specific stdlib keywords used in exercises
  'listOf', 'mutableListOf', 'arrayOf', 'mapOf', 'setOf', 'println', 'print',
  'downTo', 'until', 'step', 'forEach', 'filter', 'map', 'let', 'also',
  'run', 'apply', 'with', 'takeIf', 'takeUnless',
  // Types
  'Int', 'Long', 'Double', 'Float', 'Boolean', 'String', 'Char', 'Unit',
  'Any', 'Nothing', 'List', 'MutableList', 'Array', 'Map', 'Set',
]);

// ─── STRUCTURAL / OPERATOR TOKENS ─────────────────────────────────────────────
const KOTLIN_STRUCTURAL = new Set([
  '(', ')', '{', '}', '[', ']',
  '=', ':', '.', ',', '->',
  '?:', '?.', '!!',            // compound operators — must be matched first
  '?',
  '+', '-', '*', '/', '%',
  '<', '>', '<=', '>=', '==', '!=',
  '&&', '||', '!',
  '$', '@', '#',
]);

// ─── TOKENIZER ────────────────────────────────────────────────────────────────
// Order matters: compound operators before single chars, strings as single token
export const tokenize = (code: string): string[] => {
  if (!code.trim()) return [];

  const regex = new RegExp(
    [
      // Compound operators first (longest match wins)
      '\\?:',       // Elvis
      '\\.\\?',     // Safe call... wait, it's ?.
      '\\?\\.',     // Safe call
      '!!',         // Not-null assertion
      '->',         // Lambda arrow
      '<=', '>=', '==', '!=', '&&', '\\|\\|',
      // String literals (keep as single token)
      '"[^"]*"',
      "'[^']*'",
      // Template string start
      '\\$\\{',
      // Numbers (int and float)
      '\\d+\\.\\d+',
      '\\d+[Ll]?',
      // Identifiers and keywords
      '\\b[a-zA-Z_]\\w*\\b',
      // Single char operators and structural
      '[+\\-*/%<>!?=:.,(){}\\[\\]@#$]',
    ].join('|'),
    'g'
  );

  const tokens: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
};

// ─── MAIN ANALYZER ────────────────────────────────────────────────────────────
// Returns feedback for each token in currentCode:
//   correct-pos  → token matches solution at same index  (GREEN)
//   in-solution  → token in solution but wrong position  (BLUE)
//   detected     → kotlin keyword/structural, not in solution (GRAY)
//   unknown      → user input not matching any category  (DIM)
export const analyzeKotlinSyntax = (
  currentCode: string,
  solutionCode: string
): FeedbackElement[] => {
  // Strip startCode prefix if solution doesn't contain it
  // (so startCode lines don't pollute feedback)
  const currentTokens  = tokenize(currentCode);
  const solutionTokens = tokenize(solutionCode);

  return currentTokens.map((token, index): FeedbackElement => {
    const inSolution      = solutionTokens.includes(token);
    const correctPosition = solutionTokens[index] === token;
    const isKeyword       = KOTLIN_KEYWORDS.has(token);
    const isStructural    = KOTLIN_STRUCTURAL.has(token);
    const isNumber        = /^\d+(\.\d+)?[Ll]?$/.test(token);
    const isString        = /^["'].*["']$/.test(token);

    let type: FeedbackType;

    if (correctPosition) {
      type = 'correct-pos';   // GREEN
    } else if (inSolution) {
      type = 'in-solution';   // BLUE
    } else if (isKeyword || isStructural || isNumber || isString) {
      type = 'detected';      // GRAY
    } else {
      type = 'unknown';       // DIM
    }

    return { id: `${token}-${index}`, text: token, type, index };
  });
};

// ─── SMART TOKENS ─────────────────────────────────────────────────────────────
// Context-aware token suggestions based on what user has typed
export const getSmartTokens = (code: string): string[] => {
  const trimmed = code.trimEnd();

  if (!trimmed)
    return ['val', 'var', 'fun', 'if', 'when', 'for', 'return', 'class'];

  if (/=\s*$/.test(trimmed))
    return ['2.0', '0', 'true', 'false', '"text"', 'null', 'input', 'n', '1', 'listOf('];

  if (/\b(val|var)\s+$/.test(trimmed))
    return ['version', 'result', 'count', 'name', 'x', 'data', 'i', 'items'];

  if (/\bfun\s+$/.test(trimmed))
    return ['main()', 'inc(', 'greet(', 'add(', 'toString('];

  if (/\?:\s*$/.test(trimmed))
    return ['0', 'false', '"default"', 'null', 'emptyList()'];

  if (/\?\./.test(trimmed.slice(-3)))
    return ['length', 'isEmpty()', 'toString()', 'let {', 'run {'];

  if (/:\s*$/.test(trimmed))
    return ['Int', 'String', 'Boolean', 'Double', 'Long', 'List<', 'Unit'];

  if (/\w\s*$/.test(trimmed))
    return ['=', ':', '.', '(', '[', '?:', '?.', '!!', '+', '-', '->'];

  return ['val', 'var', 'fun', '=', ':', '->', '?:', '?.', '( )', '{ }', '[ ]', '+', '-', ','];
};
