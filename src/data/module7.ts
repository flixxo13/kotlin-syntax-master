import type { Topic } from '../types'

export const module7: Topic = {
  id: 'module-7',
  title: 'Fortgeschrittene Ausblicke',
  description: 'Null Safety, Collections, Lambdas & Scope Functions.',
  icon: 'Layers',
  order: 7,
  concepts: [

    // ── 7.1: Null Safety ────────────────────────────────────
    {
      id: 'c7-null-safety',
      topicId: 'module-7',
      title: 'Null Safety',
      syntaxRule: 'Type?  |  ?.  |  ?:  |  !!  |  let { }',
      explanation: 'Kotlin unterscheidet zwischen nullable (String?) und non-nullable (String) Typen. ?. (Safe Call) ruft nur auf wenn nicht null. ?: (Elvis) gibt einen Default-Wert zurück. !! erzwingt Non-Null (kann crashen!)',
      example: 'var name: String? = null\nprintln(name?.length)       // null (kein Crash)\nprintln(name?.length ?: 0)  // 0 (Elvis)\nval len = name!!.length     // NullPointerException wenn null!\nname?.let { println(it) }   // nur wenn nicht null',
      exercises: [
        {
          id: 'e7-1-1',
          conceptId: 'c7-null-safety',
          mode: 'builder',
          task: 'Deklariere eine nullable String-Variable "nickname" mit dem Wert null',
          initialCode: '',
          solution: 'var nickname: String? = null',
          gaps: ['String?', '?'],
          distractors: ['String', 'String!', 'Nullable<String>', 'Optional<String>'],
          hints: {
            level1: '... nickname: ___ = null',
            level2: 'var nickname: String... = null',
            level3: 'var nickname: String___ = null',
          }
        },
        {
          id: 'e7-1-2',
          conceptId: 'c7-null-safety',
          mode: 'builder',
          task: 'Nutze den Safe-Call-Operator um die Länge von "name" zu lesen (kann null sein)',
          initialCode: 'var name: String? = "Felix"\nval len = ',
          solution: 'var name: String? = "Felix"\nval len = name?.length',
          gaps: ['?.'],
          distractors: ['.', '?.length', '!!.', '?.?'],
          hints: {
            level1: 'val len = name...length',
            level2: 'Fragezeichen + Punkt vor dem Property',
            level3: 'val len = name___length',
          }
        },
        {
          id: 'e7-1-3',
          conceptId: 'c7-null-safety',
          mode: 'builder',
          task: 'Nutze den Elvis-Operator: Gib name?.length zurück, oder 0 wenn null',
          initialCode: 'var name: String? = null\nval len = ',
          solution: 'var name: String? = null\nval len = name?.length ?: 0',
          gaps: ['?.', '?:'],
          distractors: ['??', '||', '?', '!!'],
          hints: {
            level1: 'val len = name?.length ... 0',
            level2: 'Fragezeichen + Doppelpunkt als "oder"-Operator',
            level3: 'val len = name?.length ___ 0',
          }
        },
        {
          id: 'e7-1-4',
          conceptId: 'c7-null-safety',
          mode: 'assignment',
          task: 'Welcher Operator erzwingt Non-Null und wirft NullPointerException?',
          initialCode: 'val len = name___.length',
          solution: 'val len = name!!.length',
          gaps: ['!!'],
          distractors: ['?.', '?:', '!', '??'],
          hints: {
            level1: 'Zwei Ausrufezeichen',
            level2: 'Doppeltes Ausrufezeichen vor dem Punkt',
            level3: '__.',
          }
        },
        {
          id: 'e7-1-5',
          conceptId: 'c7-null-safety',
          mode: 'builder',
          task: 'Nutze let: Führe println(it.length) nur aus wenn "text" nicht null ist',
          initialCode: 'var text: String? = "Kotlin"\n',
          solution: 'var text: String? = "Kotlin"\ntext?.let { println(it.length) }',
          gaps: ['?.let', 'it'],
          distractors: ['.let', '?.run', 'this', 'self'],
          hints: {
            level1: 'text...{ println(it.length) }',
            level2: 'text?.let { println(...length) }',
            level3: 'text?.let { println(___.length) }',
          }
        }
      ]
    },

    // ── 7.2: Data Classes ────────────────────────────────────
    {
      id: 'c7-data-classes',
      topicId: 'module-7',
      title: 'Data Classes',
      syntaxRule: 'data class Name(val prop: Typ, ...)',
      explanation: '"data class" generiert automatisch equals(), hashCode(), toString(), copy() und componentN()-Funktionen. Ideal für reine Daten-Container. copy() erlaubt es, eine Kopie mit geänderten Werten zu erstellen.',
      example: 'data class User(val name: String, val age: Int)\n\nval u1 = User("Felix", 25)\nval u2 = User("Felix", 25)\nprintln(u1 == u2)        // true\nprintln(u1)              // User(name=Felix, age=25)\nval u3 = u1.copy(age = 26)  // Felix, 26',
      exercises: [
        {
          id: 'e7-2-1',
          conceptId: 'c7-data-classes',
          mode: 'builder',
          task: 'Deklariere eine data class "Point" mit val-Eigenschaften x und y vom Typ Int',
          initialCode: '',
          solution: 'data class Point(val x: Int, val y: Int)',
          gaps: ['data', 'class', 'val'],
          distractors: ['struct', 'record', 'var', 'object'],
          hints: {
            level1: '... ... Point(... x: Int, ... y: Int)',
            level2: 'data class Point(val x: ..., val y: ...)',
            level3: 'data class Point(___ x: Int, val y: Int)',
          }
        },
        {
          id: 'e7-2-2',
          conceptId: 'c7-data-classes',
          mode: 'builder',
          task: 'Erstelle eine Kopie von "user" mit geändertem age = 30 via copy()',
          initialCode: 'data class User(val name: String, val age: Int)\nval user = User("Felix", 25)\nval older = ',
          solution: 'data class User(val name: String, val age: Int)\nval user = User("Felix", 25)\nval older = user.copy(age = 30)',
          gaps: ['copy', 'age ='],
          distractors: ['clone()', 'duplicate', 'new User', 'age:'],
          hints: {
            level1: 'val older = user...(age = 30)',
            level2: 'val older = user.copy(... = 30)',
            level3: 'val older = user.____(___ = 30)',
          }
        },
        {
          id: 'e7-2-3',
          conceptId: 'c7-data-classes',
          mode: 'assignment',
          task: 'Welches Schlüsselwort steht VOR "class" für automatisch generierte Methoden?',
          initialCode: '___ class Product(val name: String)',
          solution: 'data class Product(val name: String)',
          gaps: ['data'],
          distractors: ['record', 'struct', 'model', 'value'],
          hints: {
            level1: 'Vier Buchstaben',
            level2: 'Beginnt mit d',
            level3: 'dat_',
          }
        }
      ]
    },

    // ── 7.3: Collections ─────────────────────────────────────
    {
      id: 'c7-collections',
      topicId: 'module-7',
      title: 'Collections: List, Set, Map',
      syntaxRule: 'listOf() | mutableListOf() | setOf() | mapOf() | mutableMapOf()',
      explanation: 'Kotlin unterscheidet zwischen immutable (listOf, setOf, mapOf) und mutable (mutableListOf etc.) Collections. List: geordnet, Duplikate erlaubt. Set: ungeordnet, keine Duplikate. Map: Schlüssel-Wert-Paare.',
      example: 'val nums = listOf(1, 2, 3)\nval mut = mutableListOf(1, 2)\nmut.add(3)\n\nval unique = setOf(1, 1, 2)   // {1, 2}\nval map = mapOf("a" to 1, "b" to 2)\nprintln(map["a"])               // 1',
      exercises: [
        {
          id: 'e7-3-1',
          conceptId: 'c7-collections',
          mode: 'builder',
          task: 'Erstelle eine immutable Liste "fruits" mit "Apple", "Banana", "Cherry"',
          initialCode: '',
          solution: 'val fruits = listOf("Apple", "Banana", "Cherry")',
          gaps: ['listOf', 'val'],
          distractors: ['arrayOf', 'mutableListOf', 'ArrayList', 'var'],
          hints: {
            level1: '... fruits = ...(\"Apple\", \"Banana\", \"Cherry\")',
            level2: 'val fruits = list...()',
            level3: 'val fruits = ______("Apple", "Banana", "Cherry")',
          }
        },
        {
          id: 'e7-3-2',
          conceptId: 'c7-collections',
          mode: 'builder',
          task: 'Erstelle eine mutable Liste und füge die Zahl 42 hinzu',
          initialCode: 'val numbers = mutableListOf(1, 2, 3)\n',
          solution: 'val numbers = mutableListOf(1, 2, 3)\nnumbers.add(42)',
          gaps: ['add'],
          distractors: ['append', 'push', 'insert', 'plus'],
          hints: {
            level1: 'numbers...(42)',
            level2: 'numbers.a___(42)',
            level3: 'numbers.___(42)',
          }
        },
        {
          id: 'e7-3-3',
          conceptId: 'c7-collections',
          mode: 'builder',
          task: 'Erstelle eine Map "scores" mit "Felix" -> 100 und "Max" -> 85',
          initialCode: 'val scores = ',
          solution: 'val scores = mapOf("Felix" to 100, "Max" to 85)',
          gaps: ['mapOf', 'to'],
          distractors: ['hashMapOf', '->', ':', '=>'],
          hints: {
            level1: 'val scores = ...(\"Felix\" ... 100, \"Max\" ... 85)',
            level2: 'val scores = mapOf("Felix" ... 100, ...)',
            level3: 'val scores = mapOf("Felix" ___ 100, "Max" to 85)',
          }
        },
        {
          id: 'e7-3-4',
          conceptId: 'c7-collections',
          mode: 'builder',
          task: 'Lies den Wert für Schlüssel "Felix" aus der Map "scores"',
          initialCode: 'val scores = mapOf("Felix" to 100)\nval felixScore = ',
          solution: 'val scores = mapOf("Felix" to 100)\nval felixScore = scores["Felix"]',
          gaps: ['scores["Felix"]', '["Felix"]'],
          distractors: ['scores.get("Felix")', 'scores.Felix', 'scores("Felix")'],
          hints: {
            level1: 'val felixScore = scores...',
            level2: 'Mit eckigen Klammern auf Map-Einträge zugreifen',
            level3: 'val felixScore = scores___"Felix"___',
          }
        },
        {
          id: 'e7-3-5',
          conceptId: 'c7-collections',
          mode: 'builder',
          task: 'Erstelle ein Set "uniqueNums" aus 1, 2, 2, 3 — Duplikate werden entfernt',
          initialCode: 'val uniqueNums = ',
          solution: 'val uniqueNums = setOf(1, 2, 2, 3)',
          gaps: ['setOf'],
          distractors: ['listOf', 'uniqueListOf', 'hashSetOf', 'arrayOf'],
          hints: {
            level1: 'val uniqueNums = ...(1, 2, 2, 3)',
            level2: 'val uniqueNums = set...(1, 2, 2, 3)',
            level3: 'val uniqueNums = _____(1, 2, 2, 3)',
          }
        }
      ]
    },

    // ── 7.4: Lambdas & Higher-Order Functions ────────────────
    {
      id: 'c7-lambdas',
      topicId: 'module-7',
      title: 'Lambdas & Higher-Order Functions',
      syntaxRule: '{ param -> ausdruck }  |  list.filter { }  .map { }  .forEach { }',
      explanation: 'Lambdas sind anonyme Funktionen in geschweiften Klammern. Higher-Order Functions nehmen Lambdas als Parameter. filter, map, forEach sind die häufigsten Collection-Operationen. "it" ist der implizite Parametername.',
      example: 'val nums = listOf(1, 2, 3, 4, 5)\nval evens = nums.filter { it % 2 == 0 }  // [2, 4]\nval doubled = nums.map { it * 2 }         // [2,4,6,8,10]\nnums.forEach { println(it) }',
      exercises: [
        {
          id: 'e7-4-1',
          conceptId: 'c7-lambdas',
          mode: 'builder',
          task: 'Filtere alle geraden Zahlen aus der Liste [1,2,3,4,5,6]',
          initialCode: 'val nums = listOf(1, 2, 3, 4, 5, 6)\nval evens = ',
          solution: 'val nums = listOf(1, 2, 3, 4, 5, 6)\nval evens = nums.filter { it % 2 == 0 }',
          gaps: ['filter', 'it'],
          distractors: ['map', 'find', 'select', 'this'],
          hints: {
            level1: 'val evens = nums...{ ... % 2 == 0 }',
            level2: 'val evens = nums.filter { ... % 2 == 0 }',
            level3: 'val evens = nums.filter { ___ % 2 == 0 }',
          }
        },
        {
          id: 'e7-4-2',
          conceptId: 'c7-lambdas',
          mode: 'builder',
          task: 'Verdopple alle Werte in [1,2,3] mit map',
          initialCode: 'val nums = listOf(1, 2, 3)\nval doubled = ',
          solution: 'val nums = listOf(1, 2, 3)\nval doubled = nums.map { it * 2 }',
          gaps: ['map', 'it'],
          distractors: ['filter', 'transform', 'apply', 'this'],
          hints: {
            level1: 'val doubled = nums...{ ... * 2 }',
            level2: 'val doubled = nums.map { ... * 2 }',
            level3: 'val doubled = nums.map { ___ * 2 }',
          }
        },
        {
          id: 'e7-4-3',
          conceptId: 'c7-lambdas',
          mode: 'builder',
          task: 'Gib jedes Element von "names" mit forEach aus',
          initialCode: 'val names = listOf("Felix", "Max", "Anna")\n',
          solution: 'val names = listOf("Felix", "Max", "Anna")\nnames.forEach { println(it) }',
          gaps: ['forEach', 'it'],
          distractors: ['for', 'each', 'map', 'this'],
          hints: {
            level1: 'names...{ println(it) }',
            level2: 'names.forEach { println(...) }',
            level3: 'names.forEach { println(___) }',
          }
        },
        {
          id: 'e7-4-4',
          conceptId: 'c7-lambdas',
          mode: 'builder',
          task: 'Lambda mit explizitem Parameter: Mappe Namen zu ihrer Länge',
          initialCode: 'val names = listOf("Hi", "Kotlin", "World")\nval lengths = ',
          solution: 'val names = listOf("Hi", "Kotlin", "World")\nval lengths = names.map { name -> name.length }',
          gaps: ['map', '->'],
          distractors: ['filter', '=>', ':', 'forEach'],
          hints: {
            level1: 'val lengths = names...{ name ... name.length }',
            level2: 'val lengths = names.map { name ... name.length }',
            level3: 'val lengths = names.map { name ___ name.length }',
          }
        },
        {
          id: 'e7-4-5',
          conceptId: 'c7-lambdas',
          mode: 'builder',
          task: 'Verkette filter und map: Filtere Zahlen > 3, dann verdopple sie',
          initialCode: 'val nums = listOf(1, 2, 3, 4, 5)\nval result = ',
          solution: 'val nums = listOf(1, 2, 3, 4, 5)\nval result = nums.filter { it > 3 }.map { it * 2 }',
          gaps: ['filter', 'map', 'it'],
          distractors: ['select', 'transform', 'where', 'this'],
          hints: {
            level1: 'val result = nums...{ it > 3 }...{ it * 2 }',
            level2: 'val result = nums.filter { it > 3 }...{ it * 2 }',
            level3: 'val result = nums.filter { it > 3 }.___{ it * 2 }',
          }
        }
      ]
    },

    // ── 7.5: Scope Functions ─────────────────────────────────
    {
      id: 'c7-scope-functions',
      topicId: 'module-7',
      title: 'Scope Functions: let, apply, also, run, with',
      syntaxRule: 'obj.let { it -> }  |  obj.apply { }  |  obj.also { it -> }',
      explanation: 'Scope Functions führen einen Block im Kontext eines Objekts aus. let: it-Referenz, gibt Lambda-Ergebnis zurück. apply: this-Referenz, gibt Objekt zurück (gut für Builder-Pattern). also: it-Referenz, gibt Objekt zurück (gut für Debugging).',
      example: 'val name: String? = "Felix"\nname?.let { println(it.uppercase()) }  // nur wenn nicht null\n\nval list = mutableListOf<Int>().apply {\n    add(1)\n    add(2)\n    add(3)\n}\n// list = [1, 2, 3]\n\nval result = "Kotlin".also { println("Wert: $it") }',
      exercises: [
        {
          id: 'e7-5-1',
          conceptId: 'c7-scope-functions',
          mode: 'builder',
          task: 'Nutze let um "name?.uppercase()" nur auszuführen wenn name nicht null ist',
          initialCode: 'val name: String? = "felix"\n',
          solution: 'val name: String? = "felix"\nname?.let { println(it.uppercase()) }',
          gaps: ['let', 'it'],
          distractors: ['run', 'apply', 'also', 'this'],
          hints: {
            level1: 'name?...{ println(it.uppercase()) }',
            level2: 'name?.let { println(...uppercase()) }',
            level3: 'name?.let { println(___.uppercase()) }',
          }
        },
        {
          id: 'e7-5-2',
          conceptId: 'c7-scope-functions',
          mode: 'builder',
          task: 'Nutze apply um eine mutableList zu bauen und 1, 2, 3 hinzuzufügen',
          initialCode: 'val list = mutableListOf<Int>().apply {\n    \n    \n    \n}',
          solution: 'val list = mutableListOf<Int>().apply {\n    add(1)\n    add(2)\n    add(3)\n}',
          gaps: ['apply', 'add'],
          distractors: ['let', 'also', 'run', 'append'],
          hints: {
            level1: 'mutableListOf<Int>().apply {\n    ...(1)\n    ...(2)\n    ...(3)\n}',
            level2: 'Innerhalb von apply: "this" ist die Liste — add() direkt aufrufen',
            level3: 'mutableListOf<Int>().apply {\n    ___(1)\n    add(2)\n    add(3)\n}',
          }
        },
        {
          id: 'e7-5-3',
          conceptId: 'c7-scope-functions',
          mode: 'assignment',
          task: 'Welche Scope Function gibt das Lambda-Ergebnis zurück und nutzt "it"?',
          initialCode: 'val upper = name?.___ { it.uppercase() }',
          solution: 'val upper = name?.let { it.uppercase() }',
          gaps: ['let'],
          distractors: ['apply', 'also', 'run', 'with'],
          hints: {
            level1: 'Drei Buchstaben',
            level2: 'Beginnt mit l',
            level3: 'le_',
          }
        }
      ]
    }
  ]
}
