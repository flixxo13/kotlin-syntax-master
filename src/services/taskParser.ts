import { Exercise } from '../types';

// ─── UNICODE NORMALIZATION ────────────────────────────────────────────────────
// Strips invisible/zero-width Unicode chars that appear in copy-pasted AI output.
// Must run BEFORE any parsing logic.
function normalizeText(text: string): string {
  return text
    // Zero-width space, non-joiner, joiner, BOM, soft hyphen
    .replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '')
    // Non-breaking spaces → regular space
    .replace(/\u00A0/g, ' ')
    // Normalize Windows line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

// ─── KNOWN KEYS ───────────────────────────────────────────────────────────────
const KNOWN_KEYS = [
  'ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE',
  'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT', 'LOESUNG',
  'ZIELCODE', 'BAUSTEINE_RICHTIG', 'BAUSTEINE_DISTRAKTOR', 'BAUSTEIN_MAP',
];

// Key regex: optional markdown bold (**KEY** or **KEY:**), case-insensitive key name
const KEY_RE = /^(?:\*\*)?([A-Z0-9_]+)(?:\*\*)?\s*:/;

// ─── CODE CLEANER ─────────────────────────────────────────────────────────────
const cleanCode = (c: string): string => {
  if (!c) return '';
  return c.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
};

// ─── BLOCK SPLITTER ───────────────────────────────────────────────────────────
// Splits raw (already normalized) text into raw key→value maps.
function splitIntoBlocks(text: string): Array<Record<string, string>> {
  // Mark split points: --- separators AND lines that start a new ID field
  let marked = text
    .replace(/^---+\s*$/gm, '___SPLIT___')
    .replace(/^\*{0,2}ID\*{0,2}\s*:/gm, '___SPLIT___ID:');

  const rawBlocks = marked.split('___SPLIT___').map(b => b.trim()).filter(Boolean);
  const result: Array<Record<string, string>> = [];

  for (const block of rawBlocks) {
    const lines = block.split('\n');
    const data: Record<string, string> = {};
    let currentKey = '';
    let currentContent: string[] = [];
    let inCode = false;

    for (const line of lines) {
      const keyMatch = line.trim().match(KEY_RE);
      const isKnown  = keyMatch && KNOWN_KEYS.includes(keyMatch[1]);

      if (keyMatch && (isKnown || !inCode)) {
        if (currentKey) data[currentKey] = currentContent.join('\n').trim();
        currentKey = keyMatch[1];
        const rest = line.trim().slice(keyMatch[0].length).trim();
        currentContent = rest ? [rest] : [];
        inCode = false;
      } else {
        if (line.trim().startsWith('```')) inCode = !inCode;
        currentContent.push(line);
      }
    }
    if (currentKey) data[currentKey] = currentContent.join('\n').trim();

    // Skip empty / conversational garbage blocks
    if (Object.keys(data).length > 0) result.push(data);
  }

  return result;
}

// ─── PARSE TASKS (public, used by ImportScreen for import) ────────────────────
export const parseTasks = (text: string): Exercise[] => {
  const normalized = normalizeText(text);
  const blocks     = splitIntoBlocks(normalized);
  const exercises: Exercise[] = [];

  for (const data of blocks) {
    const taskId       = data['ID'] || '(unbekannte ID)';
    const isZuordnung  = data['MODUS'] === 'ZUORDNUNG';

    const required = isZuordnung
      ? ['ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'ZIELCODE', 'BAUSTEINE_RICHTIG', 'BAUSTEIN_MAP']
      : ['ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT', 'LOESUNG'];

    const missing = required.filter(k => !data[k]);
    if (missing.length > 0) {
      throw new Error(`Aufgabe '${taskId}' fehlen Felder: ${missing.join(', ')}`);
    }

    const exercise: Exercise = {
      id:          data['ID'],
      conceptId:   data['THEMA'],
      mode:        isZuordnung ? 'assignment' : 'builder',
      task:        data['BESCHREIBUNG'],
      initialCode: cleanCode(data['STARTCODE'] || ''),
      solution:    isZuordnung ? '' : cleanCode(data['LOESUNG'] || ''),
      hints: {
        level1: data['HINT1_STRUKTUR'] || '',
        level2: data['HINT2_ANKER']    || '',
        level3: cleanCode(data['HINT3_KONTEXT'] || ''),
      },
    };

    if (isZuordnung) {
      const map: Record<string, string> = {};
      (data['BAUSTEIN_MAP'] || '').split('\n').forEach(l => {
        const parts = l.split('->');
        if (parts.length === 2) map[parts[0].trim()] = parts[1].trim();
      });
      exercise.assignmentData = {
        zielCode:            cleanCode(data['ZIELCODE']),
        bausteineRichtig:    data['BAUSTEINE_RICHTIG'].split(',').map(s => s.trim()),
        bausteineDistraktor: (data['BAUSTEINE_DISTRAKTOR'] || '').split(',').map(s => s.trim()).filter(Boolean),
        map,
      };
    }

    exercises.push(exercise);
  }

  return exercises;
};

// ─── VALIDATE BLOCKS (used by ImportScreen live validation) ───────────────────
export interface ValidationResult {
  id:      string;
  status:  'valid' | 'warning' | 'invalid';
  errors:  string[];
  warnings: string[];
  task:    Exercise | null;
  rawData: Record<string, string>;
}

export function validateBlocks(text: string): ValidationResult[] {
  const normalized = normalizeText(text);
  const blocks     = splitIntoBlocks(normalized);
  const seenIds    = new Map<string, boolean>();

  return blocks.map((data, index) => {
    const errors:   string[] = [];
    const warnings: string[] = [];
    const id          = data['ID'] || `Block ${index + 1}`;
    const isZuordnung = (data['MODUS'] || '') === 'ZUORDNUNG';

    if (!data['ID'])           errors.push('Kein ID');
    if (!data['MODUS'])        errors.push('Kein MODUS');
    if (!data['THEMA'])        errors.push('Kein THEMA');
    if (!data['BESCHREIBUNG']) errors.push('Keine BESCHREIBUNG');

    if (data['ID']) {
      if (seenIds.has(data['ID'])) errors.push(`Doppelte ID '${data['ID']}'`);
      seenIds.set(data['ID'], true);
    }

    if (!isZuordnung) {
      if (!data['HINT1_STRUKTUR']) errors.push('HINT1_STRUKTUR fehlt');
      if (!data['HINT2_ANKER'])    errors.push('HINT2_ANKER fehlt');
      if (!data['HINT3_KONTEXT'])  errors.push('HINT3_KONTEXT fehlt');
      if (!data['LOESUNG'])        errors.push('LOESUNG fehlt');

      // Dot-count heuristic
      if (data['HINT1_STRUKTUR'] && data['LOESUNG']) {
        const sol   = cleanCode(data['LOESUNG']);
        const words = sol.split(/\s+/).filter(Boolean).length;
        const dots  = (data['HINT1_STRUKTUR'].match(/\.\.\./g) || []).length;
        if (dots > 0 && Math.abs(dots - words) > 2)
          warnings.push(`Hint1 hat ${dots} Punkte, Lösung ~${words} Tokens`);
      }
      // Startcode = solution
      if (data['STARTCODE'] && data['LOESUNG']) {
        const cs = cleanCode(data['STARTCODE']);
        const cl = cleanCode(data['LOESUNG']);
        if (cs && cl && cs === cl) warnings.push('Startcode entspricht Lösung');
      }
    } else {
      if (!data['ZIELCODE'])          errors.push('ZIELCODE fehlt');
      if (!data['BAUSTEINE_RICHTIG']) errors.push('BAUSTEINE_RICHTIG fehlt');
      if (!data['BAUSTEIN_MAP'])      errors.push('BAUSTEIN_MAP fehlt');
    }

    const status: 'valid' | 'warning' | 'invalid' =
      errors.length > 0 ? 'invalid' : warnings.length > 0 ? 'warning' : 'valid';

    let task: Exercise | null = null;
    if (errors.length === 0) {
      task = {
        id:          data['ID'],
        conceptId:   data['THEMA'],
        mode:        isZuordnung ? 'assignment' : 'builder',
        task:        data['BESCHREIBUNG'],
        initialCode: cleanCode(data['STARTCODE'] || ''),
        solution:    isZuordnung ? '' : cleanCode(data['LOESUNG'] || ''),
        hints: {
          level1: data['HINT1_STRUKTUR'] || '',
          level2: data['HINT2_ANKER']    || '',
          level3: cleanCode(data['HINT3_KONTEXT'] || ''),
        },
      };
      if (isZuordnung) {
        const map: Record<string, string> = {};
        (data['BAUSTEIN_MAP'] || '').split('\n').forEach(l => {
          const parts = l.split('->');
          if (parts.length === 2) map[parts[0].trim()] = parts[1].trim();
        });
        task.assignmentData = {
          zielCode:            cleanCode(data['ZIELCODE']),
          bausteineRichtig:    data['BAUSTEINE_RICHTIG'].split(',').map(s => s.trim()),
          bausteineDistraktor: (data['BAUSTEINE_DISTRAKTOR'] || '').split(',').map(s => s.trim()).filter(Boolean),
          map,
        };
      }
    }

    return { id, status, errors, warnings, task, rawData: data };
  });
}

// ─── EXERCISE → TEXT (export / download) ─────────────────────────────────────
export const exerciseToText = (exercise: Exercise): string => {
  const lines: string[] = [
    `ID: ${exercise.id}`,
    `MODUS: ${exercise.mode === 'assignment' ? 'ZUORDNUNG' : 'SYNTAX_BUILDER'}`,
    `THEMA: ${exercise.conceptId}`,
    `BESCHREIBUNG: ${exercise.task}`,
    `STARTCODE:\n${exercise.initialCode}`,
    `HINT1_STRUKTUR: ${exercise.hints.level1}`,
    `HINT2_ANKER: ${exercise.hints.level2}`,
    `HINT3_KONTEXT:\n${exercise.hints.level3}`,
  ];

  if (exercise.mode === 'assignment' && exercise.assignmentData) {
    lines.push(`ZIELCODE:\n${exercise.assignmentData.zielCode}`);
    lines.push(`BAUSTEINE_RICHTIG: ${exercise.assignmentData.bausteineRichtig.join(',')}`);
    lines.push(`BAUSTEINE_DISTRAKTOR: ${exercise.assignmentData.bausteineDistraktor.join(',')}`);
    lines.push('BAUSTEIN_MAP:');
    Object.entries(exercise.assignmentData.map).forEach(([k, v]) => lines.push(`${k} -> ${v}`));
  } else {
    lines.push(`LOESUNG:\n${exercise.solution}`);
  }

  return lines.join('\n');
};
