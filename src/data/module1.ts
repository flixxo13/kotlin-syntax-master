import type { Topic } from '../types'

export const module1: Topic = {
  id: 'module-1',
  title: 'Einführung & Setup',
  description: 'Bevor der eigentliche Code fließt — Werkzeuge und grundlegende Syntax.',
  icon: 'Rocket',
  order: 1,
  concepts: [
    // ── Konzept 1.1: Was ist Kotlin ─────────────────────────
    {
      id: 'c1-kotlin-intro',
      topicId: 'module-1',
      title: 'Was ist Kotlin?',
      syntaxRule: 'Kotlin ist statisch typisiert, kompiliert zu JVM-Bytecode und 100% Java-kompatibel.',
      explanation: 'Kotlin wurde von JetBrains entwickelt und 2016 veröffentlicht. Es ist Googles bevorzugte Sprache für Android-Entwicklung und zeichnet sich durch Null Safety, Ausdrucksstärke und Interoperabilität mit Java aus.',
      example: '// Kotlin ist prägnanter als Java\nfun greet(name: String): String {\n    return "Hello, $name!"\n}',
      exercises: [
        {
          id: 'e1-1-1',
          conceptId: 'c1-kotlin-intro',
          mode: 'builder',
          task: 'Schreibe einen einzeiligen Kommentar mit dem Text "Mein erstes Kotlin-Programm"',
          initialCode: '',
          solution: '// Mein erstes Kotlin-Programm',
          gaps: ['//'],
          distractors: ['#', '/*', '--'],
          hints: {
            level1: '// ...',
            level2: '// Mein ...',
            level3: '// Mein erstes Kotlin-___',
          }
        },
        {
          id: 'e1-1-2',
          conceptId: 'c1-kotlin-intro',
          mode: 'assignment',
          task: 'Wähle das richtige Einzeilen-Kommentar-Symbol in Kotlin',
          initialCode: '___ Kotlin-Kommentar',
          solution: '// Kotlin-Kommentar',
          gaps: ['//'],
          distractors: ['#', '--', '**', '%%'],
          hints: {
            level1: 'Zwei Zeichen am Anfang der Zeile',
            level2: 'Beginnt mit zwei Schrägstrichen',
            level3: '// ___',
          }
        },
        {
          id: 'e1-1-3',
          conceptId: 'c1-kotlin-intro',
          mode: 'builder',
          task: 'Schreibe einen mehrzeiligen Kommentar der "Kotlin lernen" enthält',
          initialCode: '',
          solution: '/* Kotlin lernen */',
          gaps: ['/*', '*/'],
          distractors: ['//', '#', '<!--'],
          hints: {
            level1: '/* ... */',
            level2: '/* Kotlin ... */',
            level3: '/* Kotlin ___ */',
          }
        }
      ]
    },

    // ── Konzept 1.2: fun main() ──────────────────────────────
    {
      id: 'c1-main-function',
      topicId: 'module-1',
      title: 'fun main() — Einstiegspunkt',
      syntaxRule: 'fun main() { ... }',
      explanation: 'Jedes ausführbare Kotlin-Programm braucht eine main()-Funktion als Einstiegspunkt. Das Schlüsselwort "fun" deklariert eine Funktion.',
      example: 'fun main() {\n    println("Hello, World!")\n}',
      exercises: [
        {
          id: 'e1-2-1',
          conceptId: 'c1-main-function',
          mode: 'builder',
          task: 'Schreibe eine leere main()-Funktion (nur Deklaration und leerer Body)',
          initialCode: '',
          solution: 'fun main() {
}',
          gaps: ['fun', 'main', '()', '{}'],
          distractors: ['function', 'void', 'def', 'func'],
          hints: {
            level1: '... ...() {\n}',
            level2: 'fun ...() {\n}',
            level3: 'fun main___ {\n}',
          }
        },
        {
          id: 'e1-2-2',
          conceptId: 'c1-main-function',
          mode: 'builder',
          task: 'Gib "Hello, Kotlin!" mit println() in der main()-Funktion aus',
          initialCode: 'fun main() {
    
}',
          solution: 'fun main() {
    println("Hello, Kotlin!")
}',
          gaps: ['println'],
          distractors: ['print', 'console.log', 'System.out.println', 'echo'],
          hints: {
            level1: 'fun main() {\n    ...(...)\n}',
            level2: 'fun main() {\n    println(...)\n}',
            level3: 'fun main() {\n    println("Hello, ___!")\n}',
          }
        },
        {
          id: 'e1-2-3',
          conceptId: 'c1-main-function',
          mode: 'assignment',
          task: 'Wähle das richtige Schlüsselwort für eine Funktionsdeklaration in Kotlin',
          initialCode: '___ main() {}',
          solution: 'fun main() {}',
          gaps: ['fun'],
          distractors: ['function', 'func', 'def', 'void'],
          hints: {
            level1: 'Ein kurzes 3-Buchstaben-Wort',
            level2: 'Beginnt mit "f"',
            level3: 'f_n main() {}',
          }
        }
      ]
    },

    // ── Konzept 1.3: println und Literale ────────────────────
    {
      id: 'c1-literals',
      topicId: 'module-1',
      title: 'Literale & println()',
      syntaxRule: 'println(wert) — gibt einen Wert mit Zeilenumbruch aus',
      explanation: 'Literale sind direkte Werte im Code: Zahlen (42), Texte ("Hallo"), Zeichen ('A') und Wahrheitswerte (true/false). println() gibt sie in der Konsole aus.',
      example: 'fun main() {\n    println(42)\n    println("Kotlin")\n    println(true)\n    println('K')\n}',
      exercises: [
        {
          id: 'e1-3-1',
          conceptId: 'c1-literals',
          mode: 'builder',
          task: 'Gib die Zahl 42 aus',
          initialCode: 'fun main() {
    
}',
          solution: 'fun main() {
    println(42)
}',
          gaps: ['println', '42'],
          distractors: ['print', 'log', 'output'],
          hints: {
            level1: 'fun main() {\n    ...(...)\n}',
            level2: 'fun main() {\n    println(...)\n}',
            level3: 'fun main() {\n    println(___)\n}',
          }
        },
        {
          id: 'e1-3-2',
          conceptId: 'c1-literals',
          mode: 'builder',
          task: 'Gib den Text "Kotlin rocks" aus',
          initialCode: 'fun main() {
    
}',
          solution: 'fun main() {
    println("Kotlin rocks")
}',
          gaps: ['println', '"Kotlin rocks"'],
          distractors: ['print', 'Kotlin rocks'],
          hints: {
            level1: 'fun main() {\n    ...(...)\n}',
            level2: 'fun main() {\n    println(...)\n}',
            level3: 'fun main() {\n    println("Kotlin ___")\n}',
          }
        },
        {
          id: 'e1-3-3',
          conceptId: 'c1-literals',
          mode: 'assignment',
          task: 'Welche Funktion gibt Text MIT Zeilenumbruch aus?',
          initialCode: '___("Hallo Welt")',
          solution: 'println("Hallo Welt")',
          gaps: ['println'],
          distractors: ['print', 'log', 'write', 'output'],
          hints: {
            level1: 'Eine Funktion mit 7 Buchstaben',
            level2: 'Beginnt mit "print"',
            level3: 'print___ ("Hallo Welt")',
          }
        }
      ]
    },

    // ── Konzept 1.4: Kommentare ──────────────────────────────
    {
      id: 'c1-comments',
      topicId: 'module-1',
      title: 'Kommentare',
      syntaxRule: '// Einzeilig  |  /* Mehrzeilig */  |  /** KDoc */',
      explanation: 'Kotlin kennt drei Kommentartypen: Einzeilige (//) für schnelle Notizen, Mehrzeilige (/* */) für Blöcke, und KDoc (/** */) für API-Dokumentation.',
      example: '// Einzeiliger Kommentar\n\n/* Mehrzeiliger\n   Kommentar */\n\n/** KDoc: Dokumentiert eine Funktion\n * @param name Der Name\n */',
      exercises: [
        {
          id: 'e1-4-1',
          conceptId: 'c1-comments',
          mode: 'builder',
          task: 'Schreibe einen KDoc-Kommentar mit dem Text "Hauptfunktion"',
          initialCode: '',
          solution: '/** Hauptfunktion */',
          gaps: ['/**', '*/'],
          distractors: ['//', '/*', '#'],
          hints: {
            level1: '/___ Hauptfunktion ___/',
            level2: '/** Hauptfunktion ...',
            level3: '/** Hauptfunktion _/',
          }
        },
        {
          id: 'e1-4-2',
          conceptId: 'c1-comments',
          mode: 'assignment',
          task: 'Wähle das richtige Symbol für einen KDoc-Kommentar',
          initialCode: '___ Dokumentations-Kommentar */',
          solution: '/** Dokumentations-Kommentar */',
          gaps: ['/**'],
          distractors: ['//', '/*', '###', '//!'],
          hints: {
            level1: 'Beginnt mit Schrägstrich und zwei Sternchen',
            level2: '/...',
            level3: '/**',
          }
        }
      ]
    }
  ]
}
