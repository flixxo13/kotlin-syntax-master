import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript'; // Using JS as base for Kotlin-like highlighting
import { oneDark } from '@codemirror/theme-one-dark';

interface KotlinEditorProps {
  code: string;
  onChange: (value: string) => void;
  height: number;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const KotlinEditor: React.FC<KotlinEditorProps> = ({ code, onChange, height, onFocus, onBlur }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        javascript(), // Placeholder for Kotlin
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
          if (update.focusChanged) {
            if (viewRef.current?.hasFocus) {
              onFocus?.();
            } else {
              onBlur?.();
            }
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" }
        })
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // Sync external code changes (e.g. from shortcuts)
  useEffect(() => {
    if (viewRef.current && code !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: code }
      });
    }
  }, [code]);

  return (
    <div 
      ref={editorRef} 
      className="border-y border-surface-2 overflow-hidden" 
      style={{ height: `${height}px` }}
    />
  );
};
