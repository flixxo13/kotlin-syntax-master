import type { Topic } from '../types'

export const module6: Topic = {
  id: 'module-6',
  title: 'Exception Handling',
  description: 'Damit die App bei Fehlern nicht einfach abstürzt.',
  icon: 'Shield',
  order: 6,
  concepts: [

    // ── 6.1: try-catch-finally ───────────────────────────────
    {
      id: 'c6-try-catch',
      topicId: 'module-6',
      title: 'try-catch-finally',
      syntaxRule: 'try { ... } catch (e: ExceptionTyp) { ... } finally { ... }',
      explanation: 'try umschließt Code der scheitern kann. catch fängt den Fehler ab und gibt Zugriff auf das Exception-Objekt "e". finally wird IMMER ausgeführt — egal ob Fehler oder nicht.',
      example: 'try {\n    val num = "abc".toInt()\n} catch (e: NumberFormatException) {\n    println("Fehler: ${e.message}")\n} finally {\n    println("Immer ausgeführt")\n}',
      exercises: [
        {
          id: 'e6-1-1',
          conceptId: 'c6-try-catch',
          mode: 'builder',
          task: 'Schreibe ein try-catch das "abc".toInt() abfängt und den Fehler ausgibt',
          initialCode: '',
          solution: 'try {\n    val num = "abc".toInt()\n} catch (e: NumberFormatException) {\n    println(e.message)\n}',
          gaps: ['try', 'catch', 'NumberFormatException'],
          distractors: ['attempt', 'handle', 'Exception', 'error', 'rescue'],
          hints: {
            level1: '... {\n    val num = "abc".toInt()\n} ... (e: ...) {\n    println(e.message)\n}',
            level2: 'try {\n    ...\n} catch (e: ...) {\n    println(e.message)\n}',
            level3: 'try {\n    val num = "abc".toInt()\n} catch (e: ___) {\n    println(e.message)\n}',
          }
        },
        {
          id: 'e6-1-2',
          conceptId: 'c6-try-catch',
          mode: 'builder',
          task: 'Füge einen finally-Block hinzu der immer "Fertig!" ausgibt',
          initialCode: 'try {\n    println("Versuche...")\n} catch (e: Exception) {\n    println("Fehler!")\n}\n',
          solution: 'try {\n    println("Versuche...")\n} catch (e: Exception) {\n    println("Fehler!")\n} finally {\n    println("Fertig!")\n}',
          gaps: ['finally'],
          distractors: ['always', 'after', 'done', 'cleanup'],
          hints: {
            level1: '... {\n    println("Versuche...")\n} catch (...) {\n    println("Fehler!")\n} ... {\n    println("Fertig!")\n}',
            level2: 'try { ... } catch { ... } ... { ... }',
            level3: 'try { ... } catch { ... } _______ { println("Fertig!") }',
          }
        },
        {
          id: 'e6-1-3',
          conceptId: 'c6-try-catch',
          mode: 'assignment',
          task: 'Welches Schlüsselwort leitet den Fehlerbehandlungsblock ein?',
          initialCode: 'try { ... } ___ (e: Exception) { ... }',
          solution: 'try { ... } catch (e: Exception) { ... }',
          gaps: ['catch'],
          distractors: ['handle', 'except', 'rescue', 'error'],
          hints: {
            level1: 'Fünf Buchstaben, beginnt mit c',
            level2: 'cat...',
            level3: 'cat___',
          }
        },
        {
          id: 'e6-1-4',
          conceptId: 'c6-try-catch',
          mode: 'builder',
          task: 'try-catch als Ausdruck: Weise num den Int-Wert oder 0 bei Fehler zu',
          initialCode: 'val input = "123"\nval num = ',
          solution: 'val input = "123"\nval num = try {\n    input.toInt()\n} catch (e: NumberFormatException) {\n    0\n}',
          gaps: ['try', 'catch', 'NumberFormatException'],
          distractors: ['attempt', 'handle', 'Exception', 'orElse'],
          hints: {
            level1: 'val num = ... {\n    input.toInt()\n} ... (e: ...) {\n    0\n}',
            level2: 'val num = try {\n    input.toInt()\n} catch (e: ...) {\n    0\n}',
            level3: 'val num = try {\n    input.toInt()\n} ___ (e: NumberFormatException) {\n    0\n}',
          }
        }
      ]
    },

    // ── 6.2: throw & Exception-Typen ────────────────────────
    {
      id: 'c6-throw',
      topicId: 'module-6',
      title: 'throw & Exception-Hierarchie',
      syntaxRule: 'throw ExceptionTyp("Nachricht")  |  throw IllegalArgumentException(...)',
      explanation: 'Mit "throw" wirfst du eine Exception manuell. Häufige Typen: IllegalArgumentException (ungültiges Argument), IllegalStateException (falscher Zustand), ArithmeticException (Rechenoperation), IndexOutOfBoundsException.',
      example: 'fun divide(a: Int, b: Int): Int {\n    if (b == 0) throw ArithmeticException("Division durch 0!")\n    return a / b\n}\n\nfun setAge(age: Int) {\n    if (age < 0) throw IllegalArgumentException("Alter kann nicht negativ sein")\n}',
      exercises: [
        {
          id: 'e6-2-1',
          conceptId: 'c6-throw',
          mode: 'builder',
          task: 'Wirf eine IllegalArgumentException wenn "value" negativ ist',
          initialCode: 'fun check(value: Int) {\n    if (value < 0) ',
          solution: 'fun check(value: Int) {\n    if (value < 0) throw IllegalArgumentException("Negativ nicht erlaubt")\n}',
          gaps: ['throw', 'IllegalArgumentException'],
          distractors: ['raise', 'error', 'Exception', 'RuntimeException'],
          hints: {
            level1: '... ... ("Negativ nicht erlaubt")',
            level2: 'throw ...(\"Negativ nicht erlaubt\")',
            level3: 'throw _______________________("Negativ nicht erlaubt")',
          }
        },
        {
          id: 'e6-2-2',
          conceptId: 'c6-throw',
          mode: 'assignment',
          task: 'Welches Schlüsselwort wirft eine Exception?',
          initialCode: '___ IllegalStateException("Fehler!")',
          solution: 'throw IllegalStateException("Fehler!")',
          gaps: ['throw'],
          distractors: ['raise', 'error', 'emit', 'trigger'],
          hints: {
            level1: 'Fünf Buchstaben, beginnt mit t',
            level2: 'thr...',
            level3: 'thr__',
          }
        },
        {
          id: 'e6-2-3',
          conceptId: 'c6-throw',
          mode: 'builder',
          task: 'Schreibe "divide": wirft ArithmeticException wenn b == 0, sonst a / b',
          initialCode: 'fun divide(a: Int, b: Int): Int {\n    \n}',
          solution: 'fun divide(a: Int, b: Int): Int {\n    if (b == 0) throw ArithmeticException("Division durch 0")\n    return a / b\n}',
          gaps: ['throw', 'ArithmeticException', 'return', '=='],
          distractors: ['raise', 'Exception', 'yield', '='],
          hints: {
            level1: 'fun divide(a: Int, b: Int): Int {\n    if (b == 0) ... ...("...")\n    ... a / b\n}',
            level2: 'fun divide(a: Int, b: Int): Int {\n    if (b == 0) throw ...("...")\n    return a / b\n}',
            level3: 'fun divide(a: Int, b: Int): Int {\n    if (b == 0) throw _________________("Division durch 0")\n    return a / b\n}',
          }
        }
      ]
    },

    // ── 6.3: require & check ────────────────────────────────
    {
      id: 'c6-require-check',
      topicId: 'module-6',
      title: 'require() und check()',
      syntaxRule: 'require(bedingung) { "Nachricht" }  |  check(bedingung) { "Nachricht" }',
      explanation: 'require() wirft IllegalArgumentException wenn die Bedingung false ist — ideal für Parameter-Validierung. check() wirft IllegalStateException — ideal für Zustandsprüfung. Eleganter als manuelles throw.',
      example: 'fun setAge(age: Int) {\n    require(age >= 0) { "Alter muss >= 0 sein, war: $age" }\n}\n\nfun connect() {\n    check(!isConnected) { "Bereits verbunden!" }\n}',
      exercises: [
        {
          id: 'e6-3-1',
          conceptId: 'c6-require-check',
          mode: 'builder',
          task: 'Nutze require() um sicherzustellen dass "name" nicht leer ist',
          initialCode: 'fun setName(name: String) {\n    \n}',
          solution: 'fun setName(name: String) {\n    require(name.isNotEmpty()) { "Name darf nicht leer sein" }\n}',
          gaps: ['require', 'isNotEmpty'],
          distractors: ['check', 'assert', 'isEmpty', 'validate'],
          hints: {
            level1: '...(name...()) { "Name darf nicht leer sein" }',
            level2: 'require(name...()) { "Name darf nicht leer sein" }',
            level3: 'require(name.________()) { "Name darf nicht leer sein" }',
          }
        },
        {
          id: 'e6-3-2',
          conceptId: 'c6-require-check',
          mode: 'assignment',
          task: 'Welche Funktion wirft IllegalArgumentException bei Fehler?',
          initialCode: '___(x > 0) { "x muss positiv sein" }',
          solution: 'require(x > 0) { "x muss positiv sein" }',
          gaps: ['require'],
          distractors: ['check', 'assert', 'validate', 'ensure'],
          hints: {
            level1: 'Sieben Buchstaben, beginnt mit r',
            level2: 'req...',
            level3: 'req_____',
          }
        },
        {
          id: 'e6-3-3',
          conceptId: 'c6-require-check',
          mode: 'builder',
          task: 'Nutze check() um sicherzustellen dass "isInitialized" true ist',
          initialCode: 'var isInitialized = false\nfun process() {\n    \n}',
          solution: 'var isInitialized = false\nfun process() {\n    check(isInitialized) { "Noch nicht initialisiert!" }\n}',
          gaps: ['check'],
          distractors: ['require', 'assert', 'verify', 'ensure'],
          hints: {
            level1: '...(isInitialized) { "Noch nicht initialisiert!" }',
            level2: 'Fünf Buchstaben — für Zustandsprüfung',
            level3: '_____(isInitialized) { "Noch nicht initialisiert!" }',
          }
        },
        {
          id: 'e6-3-4',
          conceptId: 'c6-require-check',
          mode: 'builder',
          task: 'Vollständige Funktion: require age >= 0 und age <= 150, dann setze age',
          initialCode: 'var age = 0\nfun setAge(newAge: Int) {\n    \n    \n    age = newAge\n}',
          solution: 'var age = 0\nfun setAge(newAge: Int) {\n    require(newAge >= 0) { "Alter muss >= 0 sein" }\n    require(newAge <= 150) { "Alter muss <= 150 sein" }\n    age = newAge\n}',
          gaps: ['require', '>=', '<='],
          distractors: ['check', 'assert', '>', '<'],
          hints: {
            level1: '...(newAge ... 0) { "..." }\n...(newAge ... 150) { "..." }',
            level2: 'require(newAge >= 0) { "..." }\nrequire(newAge ... 150) { "..." }',
            level3: 'require(newAge >= 0) { "..." }\nrequire(newAge ___ 150) { "..." }',
          }
        }
      ]
    }
  ]
}
