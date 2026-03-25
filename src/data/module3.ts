import type { Topic } from '../types'

export const module3: Topic = {
  id: 'module-3',
  title: 'Datentypen & Datenverarbeitung',
  description: 'Kotlin ist streng typisiert, bietet aber viel Komfort.',
  icon: 'Database',
  order: 3,
  concepts: [

    // ── 3.1: Basis-Datentypen ────────────────────────────────
    {
      id: 'c3-basic-types',
      topicId: 'module-3',
      title: 'Basis-Datentypen',
      syntaxRule: 'Int | Long | Double | Float | Boolean | Char',
      explanation: 'Kotlin hat eingebaute Typen: Int (32-bit), Long (64-bit, Suffix L), Double (64-bit Dezimal), Float (32-bit, Suffix f), Boolean (true/false), Char (einzelnes Zeichen in einfachen Anführungszeichen).',
      example: "val age: Int = 25\nval big: Long = 1_000_000L\nval pi: Double = 3.14159\nval temp: Float = 36.6f\nval active: Boolean = true\nval grade: Char = 'A'",
      exercises: [
        {
          id: 'e3-1-1',
          conceptId: 'c3-basic-types',
          mode: 'builder',
          task: 'Deklariere eine Int-Variable "age" mit dem Wert 25',
          initialCode: '',
          solution: 'val age: Int = 25',
          gaps: ['val', 'Int'],
          distractors: ['var', 'Integer', 'Long', 'Double'],
          hints: {
            level1: '... ...: ... = 25',
            level2: 'val ...: Int = 25',
            level3: 'val age: ___ = 25',
          }
        },
        {
          id: 'e3-1-2',
          conceptId: 'c3-basic-types',
          mode: 'builder',
          task: 'Deklariere eine Long-Variable "distance" mit Wert 1000000 (Long-Literal mit L-Suffix)',
          initialCode: '',
          solution: 'val distance: Long = 1000000L',
          gaps: ['Long', 'L'],
          distractors: ['Int', 'Double', 'l', 'long'],
          hints: {
            level1: '... ...: ... = 1000000...',
            level2: 'val distance: Long = 1000000...',
            level3: 'val distance: Long = 1000000___',
          }
        },
        {
          id: 'e3-1-3',
          conceptId: 'c3-basic-types',
          mode: 'builder',
          task: 'Deklariere einen Float "temp" mit Wert 36.6 (Float-Literal mit f-Suffix)',
          initialCode: '',
          solution: 'val temp: Float = 36.6f',
          gaps: ['Float', 'f'],
          distractors: ['Double', 'F', 'd', 'Int'],
          hints: {
            level1: '... ...: ... = 36.6...',
            level2: 'val temp: Float = 36.6...',
            level3: 'val temp: Float = 36.6___',
          }
        },
        {
          id: 'e3-1-4',
          conceptId: 'c3-basic-types',
          mode: 'assignment',
          task: "Welcher Typ wird für ein einzelnes Zeichen wie 'K' verwendet?",
          initialCode: "val letter: ___ = 'K'",
          solution: "val letter: Char = 'K'",
          gaps: ['Char'],
          distractors: ['String', 'Character', 'Letter', 'Int'],
          hints: {
            level1: 'Vier Buchstaben, beginnt mit C',
            level2: 'Ch...',
            level3: 'Cha___',
          }
        },
        {
          id: 'e3-1-5',
          conceptId: 'c3-basic-types',
          mode: 'builder',
          task: 'Deklariere "isOnline" als Boolean mit dem Wert false',
          initialCode: '',
          solution: 'val isOnline: Boolean = false',
          gaps: ['Boolean', 'false'],
          distractors: ['Bool', 'true', 'bool', 'String'],
          hints: {
            level1: '... ...: ... = ...',
            level2: 'val isOnline: Boolean = ...',
            level3: 'val isOnline: Boolean = ___',
          }
        }
      ]
    },

    // ── 3.2: Strings & String Templates ─────────────────────
    {
      id: 'c3-strings',
      topicId: 'module-3',
      title: 'Strings & String Templates',
      syntaxRule: '"Text $variable"  |  "${expression}"',
      explanation: 'Strings stehen in doppelten Anführungszeichen. String Templates betten Variablen ($name) oder Ausdrücke (${name.length}) direkt in den String ein.',
      example: 'val name = "Felix"\nval greeting = "Hallo, $name!"\nval info = "Länge: ${name.length}"',
      exercises: [
        {
          id: 'e3-2-1',
          conceptId: 'c3-strings',
          mode: 'builder',
          task: 'Erstelle "greeting" mit dem Wert "Hallo, Kotlin!"',
          initialCode: '',
          solution: 'val greeting = "Hallo, Kotlin!"',
          gaps: ['val', '"Hallo, Kotlin!"'],
          distractors: ['var', "val greeting = 'Hallo, Kotlin!'"],
          hints: {
            level1: '... ... = "..."',
            level2: 'val greeting = "..."',
            level3: 'val greeting = "Hallo, ___!"',
          }
        },
        {
          id: 'e3-2-2',
          conceptId: 'c3-strings',
          mode: 'builder',
          task: 'Nutze ein String Template: Variable "name" in "Ich heiße $name" einbetten',
          initialCode: 'val name = "Felix"\nval intro = ',
          solution: 'val name = "Felix"\nval intro = "Ich heiße $name"',
          gaps: ['$name', '$'],
          distractors: ['#{name}', '%name', '{name}'],
          hints: {
            level1: 'val intro = "Ich heiße ..."',
            level2: 'Dollar-Zeichen vor dem Variablennamen',
            level3: 'val intro = "Ich heiße $___"',
          }
        },
        {
          id: 'e3-2-3',
          conceptId: 'c3-strings',
          mode: 'builder',
          task: 'Nutze ${word.length} um die Länge von "word" auszugeben: "hat X Zeichen"',
          initialCode: 'val word = "kotlin"\nval info = "word hat ',
          solution: 'val word = "kotlin"\nval info = "word hat ${word.length} Zeichen"',
          gaps: ['${word.length}'],
          distractors: ['$word.length', '$(word.length)', '{word.length}', '$word'],
          hints: {
            level1: '"word hat ${...} Zeichen"',
            level2: '"word hat ${word...} Zeichen"',
            level3: '"word hat ${word.___} Zeichen"',
          }
        },
        {
          id: 'e3-2-4',
          conceptId: 'c3-strings',
          mode: 'assignment',
          task: 'Wähle das korrekte String-Template für "score"',
          initialCode: 'val result = "Punkte: ___ "',
          solution: 'val result = "Punkte: $score"',
          gaps: ['$score'],
          distractors: ['#score', '${score}', '%score', '&score'],
          hints: {
            level1: 'Sonderzeichen + Variablenname direkt',
            level2: 'Das $ Zeichen vor dem Namen',
            level3: '$___',
          }
        },
        {
          id: 'e3-2-5',
          conceptId: 'c3-strings',
          mode: 'builder',
          task: 'println mit Template: "Spieler $name hat $score Punkte"',
          initialCode: 'val name = "Felix"\nval score = 100\nprintln(',
          solution: 'val name = "Felix"\nval score = 100\nprintln("Spieler $name hat $score Punkte")',
          gaps: ['$name', '$score'],
          distractors: ['name', 'score', '#name'],
          hints: {
            level1: 'println("Spieler ... hat ... Punkte")',
            level2: 'println("Spieler $... hat $... Punkte")',
            level3: 'println("Spieler $name hat $___ Punkte")',
          }
        }
      ]
    },

    // ── 3.3: Operatoren & Arithmetik ─────────────────────────
    {
      id: 'c3-operators',
      topicId: 'module-3',
      title: 'Operatoren & Arithmetik',
      syntaxRule: '+ - * / %  |  ++ --  |  == != < > <= >=',
      explanation: 'Kotlin unterstützt arithmetische Operatoren (+,-,*,/,%), Inkrement/Dekrement (++/--) und Vergleichsoperatoren (==,!=,<,>,<=,>=). Int-Division schneidet Nachkommastellen ab!',
      example: 'val sum = 10 + 5       // 15\nval mod = 10 % 3       // 1\nvar x = 5\nx++                    // x = 6\nval equal = 5 == 5     // true',
      exercises: [
        {
          id: 'e3-3-1',
          conceptId: 'c3-operators',
          mode: 'builder',
          task: 'Berechne a + b und speichere in "result"',
          initialCode: 'val a = 10\nval b = 5\nval result = ',
          solution: 'val a = 10\nval b = 5\nval result = a + b',
          gaps: ['a + b', '+'],
          distractors: ['a - b', 'a * b', 'sum(a, b)'],
          hints: {
            level1: 'val result = ... ... ...',
            level2: 'val result = a ... b',
            level3: 'val result = a ___ b',
          }
        },
        {
          id: 'e3-3-2',
          conceptId: 'c3-operators',
          mode: 'builder',
          task: 'Berechne den Rest (Modulo) von 17 / 5',
          initialCode: 'val remainder = ',
          solution: 'val remainder = 17 % 5',
          gaps: ['%'],
          distractors: ['/', '*', 'mod', 'rem'],
          hints: {
            level1: 'val remainder = 17 ... 5',
            level2: 'Das Prozentzeichen als Operator',
            level3: 'val remainder = 17 ___ 5',
          }
        },
        {
          id: 'e3-3-3',
          conceptId: 'c3-operators',
          mode: 'builder',
          task: 'Erhöhe "counter" um 1 mit dem Inkrement-Operator',
          initialCode: 'var counter = 0\n',
          solution: 'var counter = 0\ncounter++',
          gaps: ['++'],
          distractors: ['counter + 1', '--', '+= 1'],
          hints: {
            level1: 'var counter = 0\ncounter...',
            level2: 'Zwei identische Zeichen direkt nach der Variable',
            level3: 'counter___',
          }
        },
        {
          id: 'e3-3-4',
          conceptId: 'c3-operators',
          mode: 'assignment',
          task: 'Welcher Operator prüft ob a KLEINER ODER GLEICH b ist?',
          initialCode: 'val check = a ___ b',
          solution: 'val check = a <= b',
          gaps: ['<='],
          distractors: ['<', '>=', '==', '!='],
          hints: {
            level1: 'Zwei Zeichen: kleiner + gleich',
            level2: 'Beginnt mit <',
            level3: '<___',
          }
        },
        {
          id: 'e3-3-5',
          conceptId: 'c3-operators',
          mode: 'builder',
          task: 'Prüfe ob 10 ungleich 5 ist, speichere in "isDifferent"',
          initialCode: 'val isDifferent = ',
          solution: 'val isDifferent = 10 != 5',
          gaps: ['!='],
          distractors: ['<>', '!==', '=/=', 'not =='],
          hints: {
            level1: 'val isDifferent = 10 ... 5',
            level2: 'Ausrufezeichen + Gleichheitszeichen',
            level3: 'val isDifferent = 10 ___ 5',
          }
        }
      ]
    },

    // ── 3.4: Typkonvertierung ────────────────────────────────
    {
      id: 'c3-type-conversion',
      topicId: 'module-3',
      title: 'Typkonvertierung',
      syntaxRule: 'value.toInt()  .toDouble()  .toString()  .toLong()  .toFloat()',
      explanation: 'Kotlin macht keine impliziten Typ-Konvertierungen. Du musst explizit konvertieren: .toInt(), .toDouble(), .toString() etc. Achtung: Double zu Int schneidet Nachkommastellen ab!',
      example: 'val x: Int = 42\nval d: Double = x.toDouble()  // 42.0\nval s: String = x.toString()  // "42"\nval pi = 3.14\nval piInt = pi.toInt()        // 3',
      exercises: [
        {
          id: 'e3-4-1',
          conceptId: 'c3-type-conversion',
          mode: 'builder',
          task: 'Konvertiere den Int "score" (42) zu Double',
          initialCode: 'val score: Int = 42\nval scoreDouble = ',
          solution: 'val score: Int = 42\nval scoreDouble = score.toDouble()',
          gaps: ['toDouble', '.toDouble()'],
          distractors: ['(Double)score', 'toFloat()', 'score as Double'],
          hints: {
            level1: 'val scoreDouble = score...()',
            level2: 'val scoreDouble = score.to...()',
            level3: 'val scoreDouble = score.to_______()',
          }
        },
        {
          id: 'e3-4-2',
          conceptId: 'c3-type-conversion',
          mode: 'builder',
          task: 'Konvertiere den Double "pi" (3.14) zu Int',
          initialCode: 'val pi: Double = 3.14\nval piInt = ',
          solution: 'val pi: Double = 3.14\nval piInt = pi.toInt()',
          gaps: ['toInt', '.toInt()'],
          distractors: ['(Int)pi', 'pi as Int', 'toDouble()'],
          hints: {
            level1: 'val piInt = pi...()',
            level2: 'val piInt = pi.to...()',
            level3: 'val piInt = pi.to___()',
          }
        },
        {
          id: 'e3-4-3',
          conceptId: 'c3-type-conversion',
          mode: 'builder',
          task: 'Konvertiere 100 direkt in einen String',
          initialCode: 'val numStr = ',
          solution: 'val numStr = 100.toString()',
          gaps: ['toString', '.toString()'],
          distractors: ['String(100)', '"100"', 'toStr()'],
          hints: {
            level1: 'val numStr = 100...()',
            level2: 'val numStr = 100.to...()',
            level3: 'val numStr = 100.to________()',
          }
        },
        {
          id: 'e3-4-4',
          conceptId: 'c3-type-conversion',
          mode: 'assignment',
          task: 'Wähle die Methode um einen Int in Long zu konvertieren',
          initialCode: 'val big = myInt.___',
          solution: 'val big = myInt.toLong()',
          gaps: ['toLong()'],
          distractors: ['toInt()', 'toDouble()', 'asLong()', 'long()'],
          hints: {
            level1: 'Beginnt mit "to"',
            level2: 'to + Typname + ()',
            level3: 'to___()',
          }
        }
      ]
    },

    // ── 3.5: Input & Output ──────────────────────────────────
    {
      id: 'c3-input-output',
      topicId: 'module-3',
      title: 'Input & Output',
      syntaxRule: 'println(wert)  |  print(wert)  |  val input = readln()',
      explanation: 'println() gibt Text MIT Zeilenumbruch aus, print() OHNE. readln() liest eine Zeile als String. Für Zahlen direkt mit .toInt() oder .toDouble() konvertieren.',
      example: 'print("Name: ")\nval name = readln()\nprintln("Hallo, $name!")\nval num = readln().toInt()',
      exercises: [
        {
          id: 'e3-5-1',
          conceptId: 'c3-input-output',
          mode: 'builder',
          task: 'Gib "Start!" OHNE Zeilenumbruch aus',
          initialCode: '',
          solution: 'print("Start!")',
          gaps: ['print'],
          distractors: ['println', 'console.log', 'output'],
          hints: {
            level1: '...("Start!")',
            level2: 'print ohne "ln" am Ende',
            level3: '___("Start!")',
          }
        },
        {
          id: 'e3-5-2',
          conceptId: 'c3-input-output',
          mode: 'builder',
          task: 'Lies eine Zeile von der Konsole in "userInput"',
          initialCode: '',
          solution: 'val userInput = readln()',
          gaps: ['readln'],
          distractors: ['read()', 'input()', 'readline()'],
          hints: {
            level1: 'val userInput = ...()',
            level2: 'val userInput = read...()',
            level3: 'val userInput = read___()',
          }
        },
        {
          id: 'e3-5-3',
          conceptId: 'c3-input-output',
          mode: 'builder',
          task: 'Lies eine Zahl und konvertiere sie sofort zu Int',
          initialCode: '',
          solution: 'val number = readln().toInt()',
          gaps: ['readln', 'toInt'],
          distractors: ['read()', 'parseInt()', 'toDouble()'],
          hints: {
            level1: 'val number = readln()...()',
            level2: 'val number = readln().to...()',
            level3: 'val number = readln().to___()',
          }
        },
        {
          id: 'e3-5-4',
          conceptId: 'c3-input-output',
          mode: 'builder',
          task: 'Frage nach dem Namen, lies ihn, und gib "Hallo, NAME!" aus',
          initialCode: 'fun main() {\n    \n}',
          solution: 'fun main() {\n    print("Wie heißt du? ")\n    val name = readln()\n    println("Hallo, $name!")\n}',
          gaps: ['print', 'readln', '$name'],
          distractors: ['println', 'read()', 'input()', 'name'],
          hints: {
            level1: 'fun main() {\n    print(...)\n    val name = readln()\n    println(...)\n}',
            level2: 'fun main() {\n    print("Wie heißt du? ")\n    val name = readln()\n    println("Hallo, ...")\n}',
            level3: 'fun main() {\n    print("Wie heißt du? ")\n    val name = readln()\n    println("Hallo, $___!")\n}',
          }
        }
      ]
    }
  ]
}
