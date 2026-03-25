import type { Topic } from '../types'

export const module5: Topic = {
  id: 'module-5',
  title: 'Funktionen & Objekt-Basics',
  description: 'Code in wiederverwendbare Blöcke strukturieren.',
  icon: 'Wrench',
  order: 5,
  concepts: [

    // ── 5.1: Funktionen deklarieren ──────────────────────────
    {
      id: 'c5-functions-basic',
      topicId: 'module-5',
      title: 'Funktionen deklarieren & aufrufen',
      syntaxRule: 'fun name(param: Typ): ReturnTyp { return wert }',
      explanation: 'Funktionen werden mit "fun" deklariert. Parameter haben immer einen Typ. Der Rückgabetyp steht nach den Klammern. Unit bedeutet: kein Rückgabewert (wie void).',
      example: 'fun greet(name: String): String {\n    return "Hallo, $name!"\n}\n\nfun add(a: Int, b: Int): Int {\n    return a + b\n}\n\nfun sayHello(): Unit {\n    println("Hallo!")\n}',
      exercises: [
        {
          id: 'e5-1-1',
          conceptId: 'c5-functions-basic',
          mode: 'builder',
          task: 'Deklariere eine Funktion "greet" die einen String "name" nimmt und void zurückgibt (Unit)',
          initialCode: '',
          solution: 'fun greet(name: String): Unit {\n    println("Hallo, $name!")\n}',
          gaps: ['fun', 'String', 'Unit'],
          distractors: ['function', 'func', 'void', 'Int'],
          hints: {
            level1: '... greet(name: ...): ... {\n    println("Hallo, $name!")\n}',
            level2: 'fun greet(name: String): ... {\n    println("Hallo, $name!")\n}',
            level3: 'fun greet(name: String): ___ {\n    println("Hallo, $name!")\n}',
          }
        },
        {
          id: 'e5-1-2',
          conceptId: 'c5-functions-basic',
          mode: 'builder',
          task: 'Deklariere "add" die zwei Int-Parameter nimmt und deren Summe als Int zurückgibt',
          initialCode: '',
          solution: 'fun add(a: Int, b: Int): Int {\n    return a + b\n}',
          gaps: ['fun', 'Int', 'return'],
          distractors: ['function', 'Double', 'yield', 'result'],
          hints: {
            level1: '... add(a: ..., b: ...): ... {\n    ... a + b\n}',
            level2: 'fun add(a: Int, b: Int): Int {\n    ... a + b\n}',
            level3: 'fun add(a: Int, b: Int): Int {\n    ___ a + b\n}',
          }
        },
        {
          id: 'e5-1-3',
          conceptId: 'c5-functions-basic',
          mode: 'assignment',
          task: 'Welches Schlüsselwort deklariert eine Funktion in Kotlin?',
          initialCode: '___ sayHi() { println("Hi!") }',
          solution: 'fun sayHi() { println("Hi!") }',
          gaps: ['fun'],
          distractors: ['function', 'func', 'def', 'fn'],
          hints: {
            level1: 'Drei Buchstaben',
            level2: 'Beginnt mit f',
            level3: 'f__',
          }
        },
        {
          id: 'e5-1-4',
          conceptId: 'c5-functions-basic',
          mode: 'builder',
          task: 'Rufe die Funktion "greet" mit dem Argument "Kotlin" auf',
          initialCode: 'fun greet(name: String) {\n    println("Hallo, $name!")\n}\n',
          solution: 'fun greet(name: String) {\n    println("Hallo, $name!")\n}\ngreet("Kotlin")',
          gaps: ['greet', '"Kotlin"'],
          distractors: ['call greet', 'invoke greet', 'greet.call'],
          hints: {
            level1: 'Funktionsname + (...)',
            level2: 'greet(...)',
            level3: 'greet("___")',
          }
        }
      ]
    },

    // ── 5.2: Single-Expression Functions ────────────────────
    {
      id: 'c5-single-expression',
      topicId: 'module-5',
      title: 'Single-Expression Functions',
      syntaxRule: 'fun name(param: Typ) = ausdruck',
      explanation: 'Wenn eine Funktion nur einen Ausdruck zurückgibt, kann man { return ... } durch = ersetzen. Der Typ kann oft inferiert werden. Das ist sehr idiomatisches Kotlin!',
      example: 'fun double(x: Int) = x * 2\nfun max(a: Int, b: Int) = if (a > b) a else b\nfun greet(name: String) = "Hallo, $name!"',
      exercises: [
        {
          id: 'e5-2-1',
          conceptId: 'c5-single-expression',
          mode: 'builder',
          task: 'Schreibe "square" als Single-Expression Function: gibt x * x zurück',
          initialCode: '',
          solution: 'fun square(x: Int) = x * x',
          gaps: ['fun', '='],
          distractors: ['function', '->', '{', 'return'],
          hints: {
            level1: '... square(x: Int) ... x * x',
            level2: 'fun square(x: Int) ... x * x',
            level3: 'fun square(x: Int) ___ x * x',
          }
        },
        {
          id: 'e5-2-2',
          conceptId: 'c5-single-expression',
          mode: 'builder',
          task: 'Schreibe "isEven" als Single-Expression: true wenn n % 2 == 0',
          initialCode: '',
          solution: 'fun isEven(n: Int) = n % 2 == 0',
          gaps: ['fun', '=', '%', '=='],
          distractors: ['function', '->', '!=', '/',],
          hints: {
            level1: '... isEven(n: Int) ... n ... 2 ... 0',
            level2: 'fun isEven(n: Int) = n % 2 ... 0',
            level3: 'fun isEven(n: Int) = n % 2 ___ 0',
          }
        },
        {
          id: 'e5-2-3',
          conceptId: 'c5-single-expression',
          mode: 'assignment',
          task: 'Welches Zeichen ersetzt { return ... } bei Single-Expression Functions?',
          initialCode: 'fun double(x: Int) ___ x * 2',
          solution: 'fun double(x: Int) = x * 2',
          gaps: ['='],
          distractors: ['->', '=>', ':', '{'],
          hints: {
            level1: 'Ein einzelnes Zeichen',
            level2: 'Das Zuweisungszeichen',
            level3: '___',
          }
        }
      ]
    },

    // ── 5.3: Default & Named Arguments ──────────────────────
    {
      id: 'c5-default-named-args',
      topicId: 'module-5',
      title: 'Default- & Named-Arguments',
      syntaxRule: 'fun name(p: Typ = default)  |  name(p = wert)',
      explanation: 'Parameter können Standardwerte haben — dann müssen sie beim Aufruf nicht angegeben werden. Named Arguments erlauben es, Argumente in beliebiger Reihenfolge nach Name zu übergeben.',
      example: 'fun greet(name: String = "Welt"): String {\n    return "Hallo, $name!"\n}\ngreet()              // "Hallo, Welt!"\ngreet("Felix")       // "Hallo, Felix!"\ngreet(name = "Max")  // Named Argument',
      exercises: [
        {
          id: 'e5-3-1',
          conceptId: 'c5-default-named-args',
          mode: 'builder',
          task: 'Deklariere "greet" mit Default-Wert "Welt" für den Parameter name',
          initialCode: '',
          solution: 'fun greet(name: String = "Welt") {\n    println("Hallo, $name!")\n}',
          gaps: ['=', '"Welt"'],
          distractors: ['->', ':', '?=', 'default'],
          hints: {
            level1: 'fun greet(name: String ... "Welt") { ... }',
            level2: 'Parameter: name: String ... "Welt"',
            level3: 'fun greet(name: String ___ "Welt") { ... }',
          }
        },
        {
          id: 'e5-3-2',
          conceptId: 'c5-default-named-args',
          mode: 'builder',
          task: 'Rufe "createUser" mit Named Arguments auf: name = "Felix", age = 25',
          initialCode: 'fun createUser(name: String, age: Int) {\n    println("$name ist $age Jahre alt")\n}\n',
          solution: 'fun createUser(name: String, age: Int) {\n    println("$name ist $age Jahre alt")\n}\ncreateUser(name = "Felix", age = 25)',
          gaps: ['name =', 'age ='],
          distractors: ['name:', 'age:', '"Felix" as name', '25 as age'],
          hints: {
            level1: 'createUser(... = "Felix", ... = 25)',
            level2: 'createUser(name = ..., age = ...)',
            level3: 'createUser(name = "Felix", ___ = 25)',
          }
        },
        {
          id: 'e5-3-3',
          conceptId: 'c5-default-named-args',
          mode: 'builder',
          task: 'Deklariere "power" mit base: Int und exponent: Int = 2 als Default',
          initialCode: '',
          solution: 'fun power(base: Int, exponent: Int = 2): Int {\n    return Math.pow(base.toDouble(), exponent.toDouble()).toInt()\n}',
          gaps: ['fun', 'Int', '= 2'],
          distractors: ['function', 'Double', '= 0', '?= 2'],
          hints: {
            level1: '... power(base: ..., exponent: ... ... 2): ... { ... }',
            level2: 'fun power(base: Int, exponent: Int ... 2): Int { ... }',
            level3: 'fun power(base: Int, exponent: Int ___ 2): Int { ... }',
          }
        }
      ]
    },

    // ── 5.4: vararg ──────────────────────────────────────────
    {
      id: 'c5-vararg',
      topicId: 'module-5',
      title: 'vararg — Variable Argumentanzahl',
      syntaxRule: 'fun name(vararg items: Typ) { items.forEach { ... } }',
      explanation: '"vararg" erlaubt es, beliebig viele Argumente desselben Typs zu übergeben. Innerhalb der Funktion ist "items" ein Array.',
      example: 'fun sum(vararg numbers: Int): Int {\n    return numbers.sum()\n}\nsum(1, 2, 3)      // 6\nsum(10, 20)       // 30\nsum()             // 0',
      exercises: [
        {
          id: 'e5-4-1',
          conceptId: 'c5-vararg',
          mode: 'builder',
          task: 'Deklariere "printAll" mit vararg String-Parameter "items" der alle ausgibt',
          initialCode: '',
          solution: 'fun printAll(vararg items: String) {\n    items.forEach { println(it) }\n}',
          gaps: ['vararg', 'forEach'],
          distractors: ['params', 'args', 'multiple', 'array'],
          hints: {
            level1: 'fun printAll(... items: String) {\n    items...{ println(it) }\n}',
            level2: 'fun printAll(vararg items: String) {\n    items...{ println(it) }\n}',
            level3: 'fun printAll(vararg items: String) {\n    items._______{ println(it) }\n}',
          }
        },
        {
          id: 'e5-4-2',
          conceptId: 'c5-vararg',
          mode: 'assignment',
          task: 'Welches Schlüsselwort ermöglicht variable Argumentanzahl?',
          initialCode: 'fun log(___ messages: String) { }',
          solution: 'fun log(vararg messages: String) { }',
          gaps: ['vararg'],
          distractors: ['args', 'params', 'multiple', 'spread'],
          hints: {
            level1: 'Sechs Buchstaben, beginnt mit v',
            level2: 'var...',
            level3: 'var___',
          }
        }
      ]
    },

    // ── 5.5: == vs === ───────────────────────────────────────
    {
      id: 'c5-equality',
      topicId: 'module-5',
      title: 'Strukturelle vs. Referenzielle Gleichheit',
      syntaxRule: 'a == b (strukturell)  |  a === b (referenziell)',
      explanation: '== prüft strukturelle Gleichheit (gleiche Werte, ruft equals() auf). === prüft referenzielle Gleichheit (dasselbe Objekt im Speicher). Für einfache Typen und Strings meist ==.',
      example: 'val a = "Kotlin"\nval b = "Kotlin"\nprintln(a == b)   // true  (gleiche Werte)\nprintln(a === b)  // true  (String-Interning in Kotlin)\n\ndata class Point(val x: Int, val y: Int)\nval p1 = Point(1, 2)\nval p2 = Point(1, 2)\nprintln(p1 == p2)   // true  (gleiche Werte)\nprintln(p1 === p2)  // false (verschiedene Objekte!)',
      exercises: [
        {
          id: 'e5-5-1',
          conceptId: 'c5-equality',
          mode: 'assignment',
          task: 'Welcher Operator prüft ob zwei Werte STRUKTURELL gleich sind?',
          initialCode: 'val result = a ___ b',
          solution: 'val result = a == b',
          gaps: ['=='],
          distractors: ['===', '=', '.equals()', '!='],
          hints: {
            level1: 'Zwei gleiche Zeichen',
            level2: 'Doppeltes Gleichheitszeichen',
            level3: '_ _',
          }
        },
        {
          id: 'e5-5-2',
          conceptId: 'c5-equality',
          mode: 'assignment',
          task: 'Welcher Operator prüft ob a und b DASSELBE OBJEKT (Referenz) sind?',
          initialCode: 'val isSame = a ___ b',
          solution: 'val isSame = a === b',
          gaps: ['==='],
          distractors: ['==', '=', '!==', 'is'],
          hints: {
            level1: 'Drei gleiche Zeichen',
            level2: 'Dreifaches Gleichheitszeichen',
            level3: '___ ',
          }
        },
        {
          id: 'e5-5-3',
          conceptId: 'c5-equality',
          mode: 'builder',
          task: 'Prüfe strukturelle Gleichheit: Gib true aus wenn "hello" == "hello"',
          initialCode: '',
          solution: 'println("hello" == "hello")',
          gaps: ['=='],
          distractors: ['===', '=', 'equals'],
          hints: {
            level1: 'println("hello" ... "hello")',
            level2: 'Struktureller Vergleich mit ==',
            level3: 'println("hello" ___ "hello")',
          }
        }
      ]
    }
  ]
}
