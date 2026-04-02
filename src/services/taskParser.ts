import { Exercise } from '../types';

export const parseTasks = (text: string): Exercise[] => {
  const blocks = text.split('---').map(b => b.trim()).filter(b => b.length > 0);
  const exercises: Exercise[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n');
    const data: Record<string, string> = {};
    let currentKey = '';
    let currentContent: string[] = [];
    let inCodeBlock = false;

    const KNOWN_KEYS = [
      'ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE', 
      'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT', 'LOESUNG',
      'ZIELCODE', 'BAUSTEINE_RICHTIG', 'BAUSTEINE_DISTRAKTOR', 'BAUSTEIN_MAP'
    ];

    lines.forEach(line => {
      const keyMatch = line.match(/^([A-Z0-9_]+):/);
      const isKnownKey = keyMatch && KNOWN_KEYS.includes(keyMatch[1]);

      // We switch keys if we find a known key at the start of a line, 
      // even if we think we are in a code block (handles unclosed blocks)
      if (keyMatch && (isKnownKey || !inCodeBlock)) {
        if (currentKey) {
          data[currentKey] = currentContent.join('\n').trim();
        }
        currentKey = keyMatch[1];
        const firstLineContent = line.replace(keyMatch[0], '').trim();
        currentContent = firstLineContent ? [firstLineContent] : [];
        
        // If we switch keys, we reset the code block state for the new field
        inCodeBlock = false;
      } else {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
        }
        currentContent.push(line);
      }
    });

    if (currentKey) {
      data[currentKey] = currentContent.join('\n').trim();
    }

    // Validation
    const required = ['ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE', 'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT'];
    const missing = required.filter(k => !data[k]);
    const taskId = data['ID'] || `Block ${index + 1}`;

    if (missing.length > 0) {
      throw new Error(`Aufgabe '${taskId}' fehlen Felder: ${missing.join(', ')}`);
    }

    const cleanCode = (code: string) => {
      if (!code) return '';
      // Remove opening and closing code fences more robustly
      return code
        .replace(/^```kotlin\s*/i, '')
        .replace(/```$/, '')
        .trim();
    };

    const exercise: Exercise = {
      id: data['ID'],
      conceptId: data['THEMA'],
      mode: data['MODUS'] === 'ZUORDNUNG' ? 'assignment' : 'builder',
      task: data['BESCHREIBUNG'],
      initialCode: cleanCode(data['STARTCODE']),
      solution: data['MODUS'] === 'ZUORDNUNG' ? '' : cleanCode(data['LOESUNG'] || ''),
      hints: {
        level1: data['HINT1_STRUKTUR'],
        level2: data['HINT2_ANKER'],
        level3: cleanCode(data['HINT3_KONTEXT'])
      }
    };

    if (data['MODUS'] === 'ZUORDNUNG') {
      if (!data['ZIELCODE'] || !data['BAUSTEINE_RICHTIG'] || !data['BAUSTEIN_MAP']) {
        throw new Error(`Aufgabe '${taskId}' (ZUORDNUNG) fehlen Pflichtfelder (ZIELCODE, BAUSTEINE_RICHTIG oder BAUSTEIN_MAP).`);
      }

      const mapLines = data['BAUSTEIN_MAP'].split('\n');
      const map: Record<string, string> = {};
      mapLines.forEach(l => {
        const [slot, val] = l.split('->').map(s => s.trim());
        if (slot && val) map[slot] = val;
      });

      exercise.assignmentData = {
        zielCode: cleanCode(data['ZIELCODE']),
        bausteineRichtig: data['BAUSTEINE_RICHTIG'].split(',').map(s => s.trim()),
        bausteineDistraktor: (data['BAUSTEINE_DISTRAKTOR'] || '').split(',').map(s => s.trim()).filter(s => s.length > 0),
        map
      };
    } else if (!data['LOESUNG']) {
      throw new Error(`Aufgabe '${taskId}' (SYNTAX_BUILDER) fehlt das Feld LOESUNG.`);
    }

    exercises.push(exercise);
  });

  return exercises;
};

export const exerciseToText = (exercise: Exercise): string => {
  const lines: string[] = [];
  lines.push(`ID: ${exercise.id}`);
  lines.push(`MODUS: ${exercise.mode === 'assignment' ? 'ZUORDNUNG' : 'SYNTAX_BUILDER'}`);
  lines.push(`THEMA: ${exercise.conceptId}`);
  lines.push(`BESCHREIBUNG: ${exercise.task}`);
  lines.push(`STARTCODE:\n\`\`\`kotlin\n${exercise.initialCode}\n\`\`\``);
  lines.push(`HINT1_STRUKTUR: ${exercise.hints.level1}`);
  lines.push(`HINT2_ANKER: ${exercise.hints.level2}`);
  lines.push(`HINT3_KONTEXT: \n\`\`\`kotlin\n${exercise.hints.level3}\n\`\`\``);

  if (exercise.mode === 'assignment' && exercise.assignmentData) {
    lines.push(`ZIELCODE:\n\`\`\`kotlin\n${exercise.assignmentData.zielCode}\n\`\`\``);
    lines.push(`BAUSTEINE_RICHTIG: ${exercise.assignmentData.bausteineRichtig.join(',')}`);
    lines.push(`BAUSTEINE_DISTRAKTOR: ${exercise.assignmentData.bausteineDistraktor.join(',')}`);
    lines.push(`BAUSTEIN_MAP:`);
    Object.entries(exercise.assignmentData.map).forEach(([slot, val]) => {
      lines.push(`${slot} -> ${val}`);
    });
  } else {
    lines.push(`LOESUNG:\n\`\`\`kotlin\n${exercise.solution}\n\`\`\``);
  }

  return lines.join('\n');
};
