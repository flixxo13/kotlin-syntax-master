import { useRef, useCallback, useEffect } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { ShortcutBar } from './ShortcutBar'
import { ResizeHandle } from './ResizeHandle'
import { useLearningStore } from '../../store/useLearningStore'

interface KotlinEditorProps {
  value: string
  onChange: (value: string) => void
  feedbackState?: 'none' | 'correct' | 'wrong'
  gaps?: string[]          // Keywords die live erkannt werden sollen
  readOnly?: boolean
  showShortcuts?: boolean
  showResize?: boolean
}

// Kotlin-spezifische Keywords für Live-Erkennung
const KOTLIN_KEYWORDS = [
  'fun', 'val', 'var', 'if', 'else', 'when', 'for', 'while', 'do',
  'return', 'class', 'object', 'interface', 'data', 'sealed', 'enum',
  'override', 'open', 'abstract', 'private', 'public', 'internal', 'protected',
  'import', 'package', 'null', 'true', 'false', 'in', 'is', 'as',
  'try', 'catch', 'finally', 'throw', 'this', 'super', 'companion',
  'const', 'suspend', 'inline', 'lateinit', 'by', 'typealias', 'init',
  'constructor', 'get', 'set', 'field', 'it', 'println', 'print', 'readln'
]

// Erkennt welche Keywords im Code vorhanden sind
export function detectFoundKeywords(code: string, gaps: string[]): string[] {
  return gaps.filter(gap => code.includes(gap))
}

export function KotlinEditor({
  value,
  onChange,
  feedbackState = 'none',
  gaps = [],
  readOnly = false,
  showShortcuts = true,
  showResize = true,
}: KotlinEditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const { editorHeight, setEditorHeight } = useLearningStore()

  // Shortcut einfügen
  const handleInsert = useCallback((text: string) => {
    const view = editorRef.current?.view
    if (!view) {
      onChange(value + text)
      return
    }
    const { from, to } = view.state.selection.main
    const newDoc = view.state.doc.toString()
    const before = newDoc.slice(0, from)
    const after = newDoc.slice(to)
    const newCode = before + text + after
    onChange(newCode)
    // Cursor nach dem eingefügten Text setzen
    setTimeout(() => {
      view.dispatch({
        selection: { anchor: from + text.length }
      })
      view.focus()
    }, 10)
  }, [value, onChange])

  // Feedback Border-Farbe
  const borderClass = feedbackState === 'correct'
    ? 'border-success animate-pulse-green'
    : feedbackState === 'wrong'
    ? 'border-error animate-shake'
    : 'border-surface-3 focus-within:border-kotlin'

  // Gefundene Keywords
  const foundKeywords = detectFoundKeywords(value, gaps)

  return (
    <div className="flex flex-col" style={{ height: editorHeight + 'px' }}>
      {/* Editor */}
      <div className={`kotlin-editor flex-1 rounded-xl border-2 overflow-hidden transition-colors ${borderClass}`}>
        <CodeMirror
          ref={editorRef}
          value={value}
          onChange={onChange}
          extensions={[
            java(),
            EditorView.lineWrapping,
            EditorView.theme({
              '&': { backgroundColor: '#0D0D0D', height: '100%' },
              '.cm-scroller': { overflow: 'auto' },
            })
          ]}
          theme={oneDark}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            highlightSelectionMatches: false,
            searchKeymap: false,
          }}
          style={{ height: '100%', fontSize: '14px' }}
        />
      </div>

      {/* Live Keyword-Erkennung */}
      {gaps.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 px-1">
          {gaps.map(gap => (
            <span
              key={gap}
              className={`text-xs font-mono px-2 py-0.5 rounded-md border transition-all duration-300
                ${foundKeywords.includes(gap)
                  ? 'bg-success/20 border-success text-success'
                  : 'bg-surface-2 border-surface-3 text-[#555]'
                }`}
            >
              {foundKeywords.includes(gap) ? '✓ ' : ''}{gap}
            </span>
          ))}
        </div>
      )}

      {/* Shortcut-Leiste */}
      {showShortcuts && !readOnly && (
        <ShortcutBar onInsert={handleInsert} />
      )}

      {/* Resize Handle */}
      {showResize && (
        <ResizeHandle
          currentHeight={editorHeight}
          onResize={setEditorHeight}
        />
      )}
    </div>
  )
}
