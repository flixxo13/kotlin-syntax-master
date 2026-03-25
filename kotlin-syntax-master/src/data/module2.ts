import type { Topic } from '../types'

export const module2: Topic = {
  id: 'module-2',
  title: 'Variablen & Syntax-Regeln',
  description: 'Sauberer Code beginnt mit der richtigen Benennung und Struktur.',
  icon: 'Variable',
  order: 2,
  concepts: [
    // ── Konzept 2.1: val vs var ──────────────────────────────
    {
      id: 'c2-val-var',
      topicId: 'module-2',
      title: 'val vs. var',
      syntaxRule: 'val name: Typ = wert  |  var name: Typ = wert',
      explanation: '"val" deklariert eine read-only Variable (kann nicht neu zugewiesen werden). "var" deklariert eine veränderbare Variable. Verwende immer val, wenn sich der Wert nicht ändern soll.',
      example: 'val name: String = "Felix"   // read-only\nvar score: Int = 0           // veränderbar\nscore = 10                   // ✅ OK\nname = "Max"                 // ❌ Fehler!',
      exercises: [
        {
          id: 'e2-1-1',
          conceptId: 'c2-val-var',
          mode: 'builder',
          task: 'Deklariere eine read-only Variable "name" vom Typ String mit dem Wert "Kotlin"',
          initialCode: '',
          solution: 'val name: String = "Kotlin"',
          gaps: ['val', 'String'],
          distractors: ['var', 'let', 'const', 'Int'],
          hints: {
            level1: '... ...: ... = "Kotlin"',
            level2: 'val ...: String = "Kotlin"',
            level3: 'val name: ___ = "Kotlin"',
          }
        },
        {
          id: 'e2-1-2',
          conceptId: 'c2-val-var',
          mode: 'builder',
          task: 'Deklariere eine veränderbare Variable "score" vom Typ Int mit dem Wert 0',
          initialCode: '',
          solution: 'var score: Int = 0',
          gaps: ['var', 'Int'],
          distractors: ['val', 'let', 'String', 'Number'],
          hints: {
            level1: '... ...: ... = 0',
            level2: 'var ...: Int = 0',
            level3: 'var score: ___ = 0',
          }
        },
        {
          id: 'e2-1-3',
          conceptId: 'c2-val-var',
          mode: 'assignment',
          task: 'Welches Schlüsselwort verwendest du für eine read-only Variable?',
          initialCode: '___ age: Int = 25',
          solution: 'val age: Int = 25',
          gaps: ['val'],
          distractors: ['var', 'let', 'const', 'final'],
          hints: {
            level1: 'Drei Buchstaben, beginnt mit "v"',
            level2: 'va...',
            level3: 'val',
          }
        },
        {
          id: 'e2-1-4',
          conceptId: 'c2-val-var',
          mode: 'builder',
          task: 'Deklariere "isKotlinFun" als read-only Boolean mit dem Wert true',
          initialCode: '',
          solution: 'val isKotlinFun: Boolean = true',
          gaps: ['val', 'Boolean', 'true'],
          distractors: ['var', 'Bool', 'false', 'String'],
          hints: {
            level1: '... ...: ... = ...',
            level2: 'val ...: Boolean = ...',
            level3: 'val isKotlinFun: Boolean = ___',
          }
        },
        {
          id: 'e2-1-5',
          conceptId: 'c2-val-var',
          mode: 'builder',
          task: 'Deklariere "counter" als veränderbare Int-Variable mit Wert 1, dann weise ihr den Wert 2 zu',
          initialCode: '',
          solution: 'var counter: Int = 1
counter = 2',
          gaps: ['var', 'Int'],
          distractors: ['val', 'let', 'String'],
          hints: {
            level1: '... counter: ... = 1\ncounter = 2',
            level2: 'var counter: Int = 1\n...',
            level3: 'var counter: Int = 1\ncounter = ___',
          }
        }
      ]
    },

    // ── Konzept 2.2: Type Inference ──────────────────────────
    {
      id: 'c2-type-inference',
      topicId: 'module-2',
      title: 'Type Inference',
      syntaxRule: 'val name = "Kotlin"  // Typ wird automatisch erkannt',
      explanation: 'Kotlin kann den Typ einer Variable aus dem zugewiesenen Wert ableiten (Type Inference). Du musst den Typ nicht immer explizit angeben. Kotlin erkennt automatisch: "Kotlin" → String, 42 → Int, true → Boolean.',
      example: 'val city = "Berlin"      // Typ: String (inferiert)\nvar count = 0            // Typ: Int (inferiert)\nval active = true        // Typ: Boolean (inferiert)',
      exercises: [
        {
          id: 'e2-2-1',
          conceptId: 'c2-type-inference',
          mode: 'builder',
          task: 'Deklariere "language" mit Type Inference und dem Wert "Kotlin" (ohne expliziten Typ)',
          initialCode: '',
          solution: 'val language = "Kotlin"',
          gaps: ['val', '='],
          distractors: ['var', 'String', ':'],
          hints: {
            level1: '... ... = ...',
            level2: 'val language = ...',
            level3: 'val language = "___"',
          }
        },
        {
          id: 'e2-2-2',
          conceptId: 'c2-type-inference',
          mode: 'assignment',
          task: 'Welche Deklaration nutzt Type Inference korrekt?',
          initialCode: 'val points ___ 100',
          solution: 'val points = 100',
          gaps: ['='],
          distractors: [':', ':Int =', '==', '->'],
          hints: {
            level1: 'Ein einzelnes Zeichen zwischen Variablenname und Wert',
            level2: 'Das Zuweisungsoperator-Symbol',
            level3: 'val points ___ 100',
          }
        }
      ]
    },

    // ── Konzept 2.3: const val ───────────────────────────────
    {
      id: 'c2-const',
      topicId: 'module-2',
      title: 'Konstanten mit const val',
      syntaxRule: 'const val NAME = wert  // Compile-Time Konstante',
      explanation: '"const val" definiert eine Compile-Time-Konstante. Sie muss auf Top-Level oder in einem Object/Companion Object deklariert werden. Konvention: SCREAMING_SNAKE_CASE für den Namen.',
      example: 'const val MAX_SCORE = 100\nconst val APP_NAME = "KotlinMaster"\nconst val PI = 3.14159',
      exercises: [
        {
          id: 'e2-3-1',
          conceptId: 'c2-const',
          mode: 'builder',
          task: 'Deklariere eine Compile-Time-Konstante "MAX_LEVEL" mit dem Wert 10',
          initialCode: '',
          solution: 'const val MAX_LEVEL = 10',
          gaps: ['const', 'val'],
          distractors: ['var', 'final', 'CONST', 'let'],
          hints: {
            level1: '... ... MAX_LEVEL = 10',
            level2: 'const ... MAX_LEVEL = 10',
            level3: 'const val MAX_LEVEL = ___',
          }
        },
        {
          id: 'e2-3-2',
          conceptId: 'c2-const',
          mode: 'assignment',
          task: 'Wähle die korrekte Konstanten-Deklaration für APP_VERSION = "1.0"',
          initialCode: '___ ___ APP_VERSION = "1.0"',
          solution: 'const val APP_VERSION = "1.0"',
          gaps: ['const', 'val'],
          distractors: ['const var', 'final val', 'static val', 'constant val'],
          hints: {
            level1: 'Zwei Schlüsselwörter: ___ ___',
            level2: '"const" gefolgt von...',
            level3: 'const ___ APP_VERSION = "1.0"',
          }
        },
        {
          id: 'e2-3-3',
          conceptId: 'c2-const',
          mode: 'builder',
          task: 'Deklariere die Konstante "GRAVITY" mit dem Wert 9.81',
          initialCode: '',
          solution: 'const val GRAVITY = 9.81',
          gaps: ['const', 'val', 'GRAVITY'],
          distractors: ['var', 'let', 'gravity'],
          hints: {
            level1: '... ... ... = 9.81',
            level2: 'const val ... = 9.81',
            level3: 'const val GRAVITY = ___',
          }
        }
      ]
    },

    // ── Konzept 2.4: Naming Conventions ─────────────────────
    {
      id: 'c2-conventions',
      topicId: 'module-2',
      title: 'Style Guide & Naming Conventions',
      syntaxRule: 'camelCase für val/var  |  PascalCase für Klassen  |  SCREAMING_SNAKE_CASE für const',
      explanation: 'Idiomatisches Kotlin folgt klaren Konventionen: Variablen und Funktionen in camelCase (meinName), Klassen in PascalCase (MeineKlasse), Konstanten in SCREAMING_SNAKE_CASE (MAX_WERT).',
      example: 'val userName = "Felix"           // camelCase ✅\nvar totalScore = 0               // camelCase ✅\nconst val MAX_SIZE = 100         // SCREAMING_SNAKE_CASE ✅\nclass UserProfile { }            // PascalCase ✅',
      exercises: [
        {
          id: 'e2-4-1',
          conceptId: 'c2-conventions',
          mode: 'assignment',
          task: 'Wähle den korrekten Variablennamen nach Kotlin-Konventionen für "Benutzer Name"',
          initialCode: 'val ___ = "Felix"',
          solution: 'val userName = "Felix"',
          gaps: ['userName'],
          distractors: ['user_name', 'UserName', 'USERNAME', 'user-name'],
          hints: {
            level1: 'Zwei Wörter zusammen ohne Trennung',
            level2: 'Das zweite Wort beginnt mit Großbuchstaben',
            level3: 'user___',
          }
        },
        {
          id: 'e2-4-2',
          conceptId: 'c2-conventions',
          mode: 'builder',
          task: 'Schreibe eine korrekte val-Deklaration für "maximale Punkte" als Int-Konstante (Top-Level)',
          initialCode: '',
          solution: 'const val MAX_POINTS = 1000',
          gaps: ['const', 'val', 'MAX_POINTS'],
          distractors: ['var', 'maxPoints', 'max_points'],
          hints: {
            level1: 'Compile-Time Konstante, zwei Schlüsselwörter',
            level2: 'const val ...',
            level3: 'const val MAX_POINTS = ___',
          }
        }
      ]
    }
  ]
}
