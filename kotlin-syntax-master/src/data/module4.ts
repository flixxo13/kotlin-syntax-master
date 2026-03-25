import type { Topic } from '../types'

export const module4: Topic = {
  id: 'module-4',
  title: 'Control Statements',
  description: 'Wie dein Programm Entscheidungen trifft und Aufgaben wiederholt.',
  icon: 'GitBranch',
  order: 4,
  concepts: [

    // ── 4.1: if-Expression ───────────────────────────────────
    {
      id: 'c4-if-expression',
      topicId: 'module-4',
      title: 'if-Expression',
      syntaxRule: 'if (bedingung) { ... } else { ... }  |  val x = if (...) a else b',
      explanation: 'In Kotlin ist "if" ein Ausdruck (Expression), nicht nur eine Anweisung. Das bedeutet, du kannst das Ergebnis direkt einer Variable zuweisen. else-if-Ketten sind möglich.',
      example: 'val age = 20\nif (age >= 18) {\n    println("Volljährig")\n} else {\n    println("Minderjährig")\n}\n\nval max = if (a > b) a else b',
      exercises: [
        {
          id: 'e4-1-1',
          conceptId: 'c4-if-expression',
          mode: 'builder',
          task: 'Schreibe ein if-else: Wenn score >= 50 dann "Bestanden" sonst "Durchgefallen"',
          initialCode: 'val score = 75\n',
          solution: 'val score = 75\nif (score >= 50) {\n    println("Bestanden")\n} else {\n    println("Durchgefallen")\n}',
          gaps: ['if', 'else', '>='],
          distractors: ['when', 'unless', '>', 'then'],
          hints: {
            level1: 'val score = 75\nif (...) {\n    ...\n} else {\n    ...\n}',
            level2: 'if (score ... 50) {\n    println("Bestanden")\n} else { ... }',
            level3: 'if (score >= 50) {\n    println("___")\n} else {\n    println("Durchgefallen")\n}',
          }
        },
        {
          id: 'e4-1-2',
          conceptId: 'c4-if-expression',
          mode: 'builder',
          task: 'Nutze if als Ausdruck: Weise "Ja" oder "Nein" zu je nachdem ob isActive true ist',
          initialCode: 'val isActive = true\nval status = ',
          solution: 'val isActive = true\nval status = if (isActive) "Ja" else "Nein"',
          gaps: ['if', 'else'],
          distractors: ['when', 'ternary', '?', ':'],
          hints: {
            level1: 'val status = ... (...) ... else ...',
            level2: 'val status = if (isActive) ... else ...',
            level3: 'val status = if (isActive) "Ja" ___ "Nein"',
          }
        },
        {
          id: 'e4-1-3',
          conceptId: 'c4-if-expression',
          mode: 'assignment',
          task: 'Wähle das richtige Schlüsselwort für eine Bedingung in Kotlin',
          initialCode: '___ (x > 0) { println("positiv") }',
          solution: 'if (x > 0) { println("positiv") }',
          gaps: ['if'],
          distractors: ['when', 'unless', 'check', 'cond'],
          hints: {
            level1: 'Zwei Buchstaben',
            level2: 'Beginnt mit i',
            level3: 'i_',
          }
        },
        {
          id: 'e4-1-4',
          conceptId: 'c4-if-expression',
          mode: 'builder',
          task: 'Schreibe if-else if-else: <0 = "negativ", ==0 = "null", >0 = "positiv"',
          initialCode: 'val num = -3\n',
          solution: 'val num = -3\nif (num < 0) {\n    println("negativ")\n} else if (num == 0) {\n    println("null")\n} else {\n    println("positiv")\n}',
          gaps: ['if', 'else if', 'else', '=='],
          distractors: ['when', 'elif', 'else when', '='],
          hints: {
            level1: 'if (...) { ... } else if (...) { ... } else { ... }',
            level2: 'if (num < 0) { ... } else if (num ... 0) { ... } else { ... }',
            level3: 'if (num < 0) { ... } else ___ (num == 0) { ... } else { ... }',
          }
        }
      ]
    },

    // ── 4.2: when ────────────────────────────────────────────
    {
      id: 'c4-when',
      topicId: 'module-4',
      title: 'when-Ausdruck',
      syntaxRule: 'when (wert) { fall -> ... ; else -> ... }',
      explanation: '"when" ist Kotlins mächtiger Switch-Ersatz. Es ist ebenfalls ein Ausdruck. Jeder Zweig hat "->". Mit "else" wird der Default-Fall abgedeckt. Mehrere Werte können mit Komma kombiniert werden.',
      example: 'val day = 3\nwhen (day) {\n    1 -> println("Montag")\n    2 -> println("Dienstag")\n    3, 4, 5 -> println("Mitte der Woche")\n    else -> println("Wochenende")\n}\n\nval result = when (score) {\n    in 90..100 -> "A"\n    in 70..89 -> "B"\n    else -> "C"\n}',
      exercises: [
        {
          id: 'e4-2-1',
          conceptId: 'c4-when',
          mode: 'builder',
          task: 'Schreibe ein when für "color": "red" -> "Rot", "blue" -> "Blau", else -> "Unbekannt"',
          initialCode: 'val color = "red"\n',
          solution: 'val color = "red"\nwhen (color) {\n    "red" -> println("Rot")\n    "blue" -> println("Blau")\n    else -> println("Unbekannt")\n}',
          gaps: ['when', '->'],
          distractors: ['switch', 'case', '=>', ':'],
          hints: {
            level1: 'when (color) {\n    ... -> ...\n    ... -> ...\n    else -> ...\n}',
            level2: 'when (color) {\n    "red" -> ...\n    "blue" -> ...\n    else -> ...\n}',
            level3: 'when (color) {\n    "red" ___ println("Rot")\n    "blue" -> ...\n    else -> ...\n}',
          }
        },
        {
          id: 'e4-2-2',
          conceptId: 'c4-when',
          mode: 'builder',
          task: 'Nutze when als Ausdruck: score in 90..100 -> "A", in 70..89 -> "B", else -> "C"',
          initialCode: 'val score = 85\nval grade = ',
          solution: 'val score = 85\nval grade = when (score) {\n    in 90..100 -> "A"\n    in 70..89 -> "B"\n    else -> "C"\n}',
          gaps: ['when', 'in', '->'],
          distractors: ['if', 'between', '=>', 'contains'],
          hints: {
            level1: 'val grade = when (score) {\n    in ... -> "A"\n    in ... -> "B"\n    else -> "C"\n}',
            level2: 'val grade = when (score) {\n    in 90..100 -> "A"\n    in 70..89 ... "B"\n    else -> "C"\n}',
            level3: 'val grade = when (score) {\n    in 90..100 -> "A"\n    ___ 70..89 -> "B"\n    else -> "C"\n}',
          }
        },
        {
          id: 'e4-2-3',
          conceptId: 'c4-when',
          mode: 'assignment',
          task: 'Welches Schlüsselwort ersetzt switch/case in Kotlin?',
          initialCode: '___ (value) { 1 -> "Eins" }',
          solution: 'when (value) { 1 -> "Eins" }',
          gaps: ['when'],
          distractors: ['switch', 'match', 'case', 'select'],
          hints: {
            level1: 'Vier Buchstaben',
            level2: 'Beginnt mit w',
            level3: 'wh__',
          }
        },
        {
          id: 'e4-2-4',
          conceptId: 'c4-when',
          mode: 'builder',
          task: 'when: Wenn x gleich 1 oder 2 -> "Klein", 3 -> "Drei", else -> "Groß"',
          initialCode: 'val x = 1\n',
          solution: 'val x = 1\nwhen (x) {\n    1, 2 -> println("Klein")\n    3 -> println("Drei")\n    else -> println("Groß")\n}',
          gaps: ['when', '->', ',', 'else'],
          distractors: ['switch', 'if', '=>', 'or'],
          hints: {
            level1: 'when (x) {\n    1, 2 -> ...\n    3 -> ...\n    else -> ...\n}',
            level2: 'when (x) {\n    1, 2 -> println("Klein")\n    3 ___ println("Drei")\n    else -> ...\n}',
            level3: 'when (x) {\n    1, 2 -> println("Klein")\n    3 -> println("Drei")\n    ___ -> println("Groß")\n}',
          }
        }
      ]
    },

    // ── 4.3: Schleifen ───────────────────────────────────────
    {
      id: 'c4-loops',
      topicId: 'module-4',
      title: 'Schleifen: for, while, repeat',
      syntaxRule: 'for (i in 1..5) | while (bed.) { } | repeat(n) { }',
      explanation: 'for iteriert über Ranges oder Collections. while läuft solange eine Bedingung wahr ist. repeat(n) wiederholt einen Block n-mal. do-while führt den Block mindestens einmal aus.',
      example: 'for (i in 1..5) { println(i) }\n\nvar i = 0\nwhile (i < 5) { println(i); i++ }\n\nrepeat(3) { println("Hallo!") }',
      exercises: [
        {
          id: 'e4-3-1',
          conceptId: 'c4-loops',
          mode: 'builder',
          task: 'Schreibe eine for-Schleife die von 1 bis 5 zählt und jeden Wert ausgibt',
          initialCode: '',
          solution: 'for (i in 1..5) {\n    println(i)\n}',
          gaps: ['for', 'in', '..'],
          distractors: ['forEach', 'loop', 'to', '->'],
          hints: {
            level1: 'for (... in ...) {\n    println(...)\n}',
            level2: 'for (i in 1...) {\n    println(i)\n}',
            level3: 'for (i in 1___5) {\n    println(i)\n}',
          }
        },
        {
          id: 'e4-3-2',
          conceptId: 'c4-loops',
          mode: 'builder',
          task: 'Schreibe eine while-Schleife: solange count < 3, gib count aus und erhöhe um 1',
          initialCode: 'var count = 0\n',
          solution: 'var count = 0\nwhile (count < 3) {\n    println(count)\n    count++\n}',
          gaps: ['while', '<', '++'],
          distractors: ['for', 'loop', '<=', '--'],
          hints: {
            level1: 'while (count ... 3) {\n    println(count)\n    count...\n}',
            level2: 'while (count < 3) {\n    println(count)\n    count...\n}',
            level3: 'while (count < 3) {\n    println(count)\n    count___\n}',
          }
        },
        {
          id: 'e4-3-3',
          conceptId: 'c4-loops',
          mode: 'builder',
          task: 'Nutze repeat() um "Kotlin!" genau 3 Mal auszugeben',
          initialCode: '',
          solution: 'repeat(3) {\n    println("Kotlin!")\n}',
          gaps: ['repeat'],
          distractors: ['for', 'loop', 'times', 'forEach'],
          hints: {
            level1: '...(3) {\n    println("Kotlin!")\n}',
            level2: 'Eine Funktion die eine Zahl und einen Block nimmt',
            level3: '___(3) {\n    println("Kotlin!")\n}',
          }
        },
        {
          id: 'e4-3-4',
          conceptId: 'c4-loops',
          mode: 'builder',
          task: 'for-Schleife von 10 bis 1 rückwärts mit "downTo"',
          initialCode: '',
          solution: 'for (i in 10 downTo 1) {\n    println(i)\n}',
          gaps: ['downTo', 'in'],
          distractors: ['to', 'until', 'reverse', 'down'],
          hints: {
            level1: 'for (i in 10 ... 1) { ... }',
            level2: 'for (i in 10 down... 1) { ... }',
            level3: 'for (i in 10 _____ 1) { ... }',
          }
        },
        {
          id: 'e4-3-5',
          conceptId: 'c4-loops',
          mode: 'builder',
          task: 'for-Schleife von 0 bis (ausschließlich) 5 mit "until"',
          initialCode: '',
          solution: 'for (i in 0 until 5) {\n    println(i)\n}',
          gaps: ['until', 'in'],
          distractors: ['..', 'to', 'upTo', 'before'],
          hints: {
            level1: 'for (i in 0 ... 5) { ... }',
            level2: 'Das Schlüsselwort für "bis ausschließlich"',
            level3: 'for (i in 0 _____ 5) { ... }',
          }
        }
      ]
    },

    // ── 4.4: Ranges ─────────────────────────────────────────
    {
      id: 'c4-ranges',
      topicId: 'module-4',
      title: 'Ranges',
      syntaxRule: '1..10  |  1 until 10  |  10 downTo 1  |  1..10 step 2',
      explanation: 'Ranges definieren Zahlenbereiche. 1..10 ist inklusiv (1 bis 10). 1 until 10 ist exklusiv (1 bis 9). downTo geht rückwärts. step bestimmt die Schrittweite.',
      example: 'val range = 1..10\nprintln(5 in range)     // true\nfor (i in 1..10 step 2) println(i)  // 1,3,5,7,9\nfor (i in 10 downTo 1 step 3) println(i)  // 10,7,4,1',
      exercises: [
        {
          id: 'e4-4-1',
          conceptId: 'c4-ranges',
          mode: 'builder',
          task: 'Erstelle eine Range von 1 bis 10 (inklusiv) und speichere sie in "r"',
          initialCode: 'val r = ',
          solution: 'val r = 1..10',
          gaps: ['..'],
          distractors: ['...', 'to', 'until', '-'],
          hints: {
            level1: 'val r = 1...10',
            level2: 'Zwei Punkte zwischen den Zahlen',
            level3: 'val r = 1___10',
          }
        },
        {
          id: 'e4-4-2',
          conceptId: 'c4-ranges',
          mode: 'builder',
          task: 'Prüfe ob 7 in der Range 1..10 enthalten ist',
          initialCode: 'val inRange = ',
          solution: 'val inRange = 7 in 1..10',
          gaps: ['in', '..'],
          distractors: ['contains', 'within', 'to', '...'],
          hints: {
            level1: 'val inRange = 7 ... 1..10',
            level2: 'Das Schlüsselwort "in" für Enthaltensein',
            level3: 'val inRange = 7 ___ 1..10',
          }
        },
        {
          id: 'e4-4-3',
          conceptId: 'c4-ranges',
          mode: 'builder',
          task: 'for-Schleife von 0 bis 10 in 2er-Schritten',
          initialCode: '',
          solution: 'for (i in 0..10 step 2) {\n    println(i)\n}',
          gaps: ['step', '..'],
          distractors: ['by', 'skip', 'every', 'until'],
          hints: {
            level1: 'for (i in 0..10 ... 2) { ... }',
            level2: 'Das Schlüsselwort nach der Range für Schrittweite',
            level3: 'for (i in 0..10 ____ 2) { ... }',
          }
        }
      ]
    }
  ]
}
