import { Exercise } from '../types';

export const parseTasks = (text: string): Exercise[] => {
  let markedText = text.replace(/^(?:\*\*)?ID(?:\*\*)?\s*:/gim, '___SPLIT___$&');
  markedText = markedText.replace(/^---/gim, '___SPLIT___');
  markedText = markedText.replace(/^___/gim, '___SPLIT___');
  markedText = markedText.replace(/^\*\*\*/gim, '___SPLIT___');

  const blocks = markedText.split('___SPLIT___').map(b => b.trim()).filter(b => b.length > 0);
  const exercises: Exercise[] = [];

  const KNOWN_KEYS = [
    'ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE', 
    'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT', 'LOESUNG',
    'ZIELCODE', 'BAUSTEINE_RICHTIG', 'BAUSTEINE_DISTRAKTOR', 'BAUSTEIN_MAP'
  ];

  blocks.forEach((block, index) => {
    const lines = block.split('\n');
    const data: Record<string, string> = {};
    let currentKey = '';
    let currentContent: string[] = [];
    let inCode = false;

    lines.forEach(line => {
      // Robust Regex: Erlaubt optionales Markdown ** vor und nach dem Key (z.B. **ID:** oder **ID**: )
      const keyMatch = line.trim().match(/^(?:\*\*)?([A-Z0-9_]+)(?:\*\*)?\s*:/);
      const isKnown = keyMatch && KNOWN_KEYS.includes(keyMatch[1]);
      
      if (keyMatch && (isKnown || !inCode)) {
        if (currentKey) data[currentKey] = currentContent.join('\n').trim();
        currentKey = keyMatch[1];
        const first = line.trim().substring(keyMatch[0].length).trim();
        currentContent = first ? [first] : [];
        inCode = false;
      } else {
        if (line.trim().startsWith('```')) inCode = !inCode;
        currentContent.push(line);
      }
    });
    if (currentKey) data[currentKey] = currentContent.join('\n').trim();

    // Ignore conversational garbage blocks with no recognized keys
    if (Object.keys(data).length === 0) return;

    const taskId = data['ID'] || `Unbekannte ID (Block ${index + 1})`;
    
    // Very strict code cleaning
    const cleanCode = (c: string) => {
      if (!c) return '';
      return c.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
    };

    const exercise: Exercise = {
      id: data['ID'] || '',
      conceptId: data['THEMA'] || '',
      mode: data['MODUS'] === 'ZUORDNUNG' ? 'assignment' : 'builder',
      task: data['BESCHREIBUNG'] || '',
      initialCode: cleanCode(data['STARTCODE']),
      solution: data['MODUS'] === 'ZUORDNUNG' ? '' : cleanCode(data['LOESUNG'] || ''),
      hints: {
        level1: data['HINT1_STRUKTUR'] || '',
        level2: data['HINT2_ANKER'] || '',
        level3: cleanCode(data['HINT3_KONTEXT'])
      }
    };

    const required = ['ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE', 'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT'];
    const missing = required.filter(k => !data[k]);

    if (missing.length > 0 && data['MODUS'] !== 'ZUORDNUNG') {
      throw new Error(`Aufgabe '${taskId}' fehlen Felder: ${missing.join(', ')}`);
    } else if (data['MODUS'] === 'ZUORDNUNG') {
      if (!data['ZIELCODE'] || !data['BAUSTEINE_RICHTIG'] || !data['BAUSTEIN_MAP']) {
        throw new Error(`Aufgabe '${taskId}' (ZUORDNUNG) fehlen Pflichtfelder (ZIELCODE, BAUSTEINE_RICHTIG oder BAUSTEIN_MAP).`);
      }

      const mapLines = data['BAUSTEIN_MAP'].split('\n');
      const map: Record<string, string> = {};
      mapLines.forEach(l => {
        const parts = l.split('->');
        if (parts.length === 2) {
           map[parts[0].trim()] = parts[1].trim();
        }
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
