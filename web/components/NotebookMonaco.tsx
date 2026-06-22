'use client';

import { useEffect, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

const LINE_HEIGHT = 19;
const MIN_HEIGHT = 60;

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Called when the user presses Ctrl/⌘+Enter inside the editor. */
  onRun: () => void;
  /** Initial height in pixels; the editor will auto-grow to fit content. */
  minHeight?: number;
}

/**
 * Thin wrapper around @monaco-editor/react so callers can `next/dynamic` it
 * with `ssr: false`. Mirrors the editor options used by `<TryItYourself>`:
 * python, vs-dark, no minimap, Ctrl/⌘+Enter to run, auto-resize.
 *
 * Height strategy: Monaco absolutely-positions its content inside the
 * wrapper. If we only call `editor.layout({ height })`, the editor canvas
 * resizes but the React wrapper's CSS height stays at the original mount
 * value — so the editor overflows and gets clipped by the parent's
 * `overflow: hidden`. To make the cell actually grow as the user types, we
 * write the height directly to the wrapper's `style.height` on every
 * `onDidContentSizeChange`, bypassing React state to avoid a re-render on
 * every keystroke.
 *
 * Why the ref dance for `onRun`: Monaco's `addCommand` registers the handler
 * once at mount time. The ref always points at the latest `onRun` so
 * Ctrl+Enter behaves identically to clicking the Run button.
 */
export default function NotebookMonaco({
  value,
  onChange,
  onRun,
  minHeight = MIN_HEIGHT,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onRunRef = useRef(onRun);
  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const handleMount: OnMount = (editor, monaco) => {
    const updateHeight = () => {
      const h = Math.max(minHeight, editor.getContentHeight());
      // Resize Monaco's internal canvas…
      editor.layout({ width: editor.getLayoutInfo().width, height: h });
      // …and the wrapper div around it, so the surrounding cell grows.
      if (wrapperRef.current) {
        wrapperRef.current.style.height = `${h}px`;
      }
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight(); // correct the initial estimate once Monaco knows line height
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current();
    });
  };

  return (
    <div ref={wrapperRef} className="notebook-monaco-wrapper">
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          tabSize: 4,
          // The wrapper now owns the scrollbar; hide Monaco's redundant one.
          scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false },
          overviewRulerLanes: 0,
        }}
      />
    </div>
  );
}