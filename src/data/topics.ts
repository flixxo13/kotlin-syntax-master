import { Topic, LessonCategory, Exercise } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'mod1',
    title: 'Einführung & Setup',
    description: 'Kotlin Grundlagen, Literale und dein erstes Programm.',
    icon: 'BookOpen',
    order: 1,
    concepts: [
      {
        id: 'intro',
        topicId: 'mod1',
        title: 'Was ist Kotlin?',
        syntaxRule: 'fun main() { ... }',
        explanation: 'Kotlin ist eine moderne, statisch typisierte Sprache.',
        example: 'fun main() {\n  println("Hello Kotlin")\n}',
        exercises: [
          {
            id: 'ex1',
            conceptId: 'intro',
            mode: 'builder',
            task: 'Schreibe die main-Funktion, die "Hello" ausgibt.',
            initialCode: '',
            solution: 'fun main() {\n  println("Hello")\n}',
            hints: {
              level1: '... ...() {\n  ...("...")\n}',
              level2: 'fun main() {\n  println("...")\n}',
              level3: 'fun main() {\n  println("Hello")\n}'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod2',
    title: 'Variablen & Syntax',
    description: 'Lerne den Unterschied zwischen val und var.',
    icon: 'Variable',
    order: 2,
    concepts: [
      {
        id: 'valvar',
        topicId: 'mod2',
        title: 'val vs. var',
        syntaxRule: 'val x = 10; var y = 20',
        explanation: 'val ist read-only, var ist veränderbar.',
        example: 'val name = "Kotlin"\nvar age = 5',
        exercises: [
          {
            id: 'ex2',
            conceptId: 'valvar',
            mode: 'builder',
            task: 'Deklariere eine read-only Variable "version" mit dem Wert 2.0.',
            initialCode: '',
            solution: 'val version = 2.0',
            hints: {
              level1: '... version = 2.0',
              level2: 'val version = ...',
              level3: 'val version = 2.0'
            }
          }
        ]
      }
    ]
  }
];
