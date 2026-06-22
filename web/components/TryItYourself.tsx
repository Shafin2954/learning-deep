"use client";

// TryItYourself.tsx
// -----------------
// Drop this into any course page. It renders an editable code box + Run button
// and shows the kernel's output: text, pandas DataFrames (as HTML tables),
// matplotlib plots (as images), and errors (clean, ANSI stripped).
//
// State persists across all blocks that share the same `sessionId`, so a later
// example on a page can use variables defined in an earlier one — like a
// notebook. Give every block on a page the same sessionId (e.g. the page slug).
//
// Requires: npm i @monaco-editor/react
//
// Usage:
//   <TryItYourself
//     sessionId="ml/boosting"
//     initialCode={`import xgboost as xgb\nprint(xgb.__version__)`}
//   />

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  runCode,
  resetSession,
  type RunResult,
} from "../lib/runner";
import OutputBlock from "./OutputBlock";

const LINE_HEIGHT = 19; // px per line at fontSize 14 — used for initial estimate
const MIN_HEIGHT = 80;

interface Props {
  sessionId: string;
  initialCode: string;
  timeout?: number;
}

export default function TryItYourself({
  sessionId,
  initialCode,
  timeout = 30,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  // Start with a rough estimate so there's no layout jump on mount
  const [editorHeight, setEditorHeight] = useState(
    () => Math.max(MIN_HEIGHT, initialCode.split("\n").length * LINE_HEIGHT + 10)
  );

  const run = useCallback(async () => {
    setRunning(true);
    try {
      setResult(await runCode(code, sessionId, timeout));
    } finally {
      setRunning(false);
    }
  }, [code, sessionId, timeout]);

  const reset = useCallback(async () => {
    await resetSession(sessionId);
    setResult(null);
  }, [sessionId]);

  // Ctrl/Cmd + Enter to run; auto-size height to content.
  const onMount = (editor: any, monaco: any) => {
    const updateHeight = () => {
      const h = Math.max(MIN_HEIGHT, editor.getContentHeight());
      setEditorHeight(h);
      editor.layout({ width: editor.getLayoutInfo().width, height: h });
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight(); // correct the initial estimate once the editor knows its line height
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run);
  };

  return (
    <div className="tiy">
      <div className="tiy-bar">
        <button className="tiy-run" onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run"}
        </button>
        <button className="tiy-reset" onClick={reset} disabled={running}>
          Reset kernel
        </button>
        <span className="tiy-hint">Ctrl/⌘ + Enter</span>
      </div>

      <Editor
        height={editorHeight}
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(v) => setCode(v ?? "")}
        onMount={onMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          tabSize: 4,
          scrollbar: { vertical: "hidden", alwaysConsumeMouseWheel: false },
          overviewRulerLanes: 0,
        }}
      />

      {result && (
        <div className={`tiy-out ${result.status !== "ok" ? "tiy-out-err" : ""}`}>
          {result.outputs.length === 0 ? (
            <div className="tiy-empty">No output.</div>
          ) : (
            result.outputs.map((o, i) => <OutputBlock key={i} o={o} />)
          )}
        </div>
      )}
    </div>
  );
}

/*  Minimal styles — paste into globals.css (or convert to your design system).
    Kept neutral; restyle per the site's look later.

.tiy { border: 1px solid #e2e2e2; border-radius: 8px; overflow: hidden; margin: 1rem 0; }
.tiy-bar { display: flex; align-items: center; gap: .5rem; padding: .5rem; background: #f7f7f7; border-bottom: 1px solid #e2e2e2; }
.tiy-run { background: #04AA6D; color: #fff; border: 0; padding: .4rem .9rem; border-radius: 5px; font-weight: 600; cursor: pointer; }
.tiy-run:disabled { opacity: .6; cursor: default; }
.tiy-reset { background: transparent; border: 1px solid #ccc; padding: .4rem .8rem; border-radius: 5px; cursor: pointer; }
.tiy-hint { margin-left: auto; font-size: .75rem; color: #888; }
.tiy-out { padding: .75rem; background: #fff; border-top: 1px solid #eee; max-height: 480px; overflow: auto; }
.tiy-out-err { background: #fff7f7; }
.tiy-text { margin: 0; white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 13px; }
.tiy-stderr { color: #b00020; }
.tiy-error { margin: 0; color: #b00020; white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 13px; }
.tiy-img { max-width: 100%; height: auto; }
.tiy-html { overflow-x: auto; font-size: 13px; }
.tiy-empty, .tiy-html table { font-size: 13px; }
*/
