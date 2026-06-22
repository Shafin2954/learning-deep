'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { runCode, resetSession } from '@/lib/runner';
import OutputBlock from './OutputBlock';
import {
  useNotebookSession,
  makeEmptyCell,
  type Cell,
  type CellStatus,
} from './NotebookStore';

// Lazy-load Monaco so the chapter page stays fast. The CSS panel renders
// immediately; the editor streams in.
const Monaco = dynamic(() => import('./NotebookMonaco'), {
  ssr: false,
  loading: () => (
    <div className="notebook-cell-loading">Loading editor…</div>
  ),
});

interface Props {
  /** Kernel session id; matches TryItYourself on the same chapter. */
  sessionId: string;
}

export default function NotebookPanel({ sessionId }: Props) {
  // Cells are stored under a fixed global key so the notebook is one
  // persistent scratchpad across all chapters and pages. The sessionId prop
  // is still used for the kernel API calls (runCode / resetSession).
  const [cells, setCells] = useNotebookSession("__notebook__");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Per-cell DOM refs so we can scroll a cell into view after adding it
  // or running it (so the user always sees the new content appear).
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const setCellRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cellRefs.current.set(id, el);
      else cellRefs.current.delete(id);
    },
    [],
  );

  const updateCell = useCallback(
    (id: string, patch: Partial<Cell>) =>
      setCells((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      ),
    [],
  );

  const runCell = useCallback(
    async (id: string) => {
      const cell = cells.find((c) => c.id === id);
      if (!cell) return;
      updateCell(id, { status: 'running', result: undefined });
      try {
        const result = await runCode(cell.code, sessionId);
        updateCell(id, {
          status: result.status === 'ok' ? 'done' : 'error',
          result,
        });
      } catch {
        updateCell(id, { status: 'error' });
      }
      // After the run completes, scroll the cell into view so the output
      // is visible (the cell grew taller and may now be below the viewport).
      requestAnimationFrame(() => {
        cellRefs.current.get(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    },
    [cells, sessionId, updateCell],
  );

  const addCell = useCallback(() => {
    const cell = makeEmptyCell();
    setCells((prev) => [...prev, cell]);
    // Scroll the new cell into view once it's in the DOM.
    requestAnimationFrame(() => {
      cellRefs.current.get(cell.id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  }, []);

  const deleteCell = useCallback((id: string) => {
    setCells((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));
  }, []);

  const resetAll = useCallback(async () => {
    await resetSession(sessionId);
    setCells((prev) =>
      prev.map((c) => ({ ...c, status: 'idle' as CellStatus, result: undefined })),
    );
  }, [sessionId]);

  // The same JSX is used in the desktop right-rail and the mobile sheet.
  const notebookBody = (
    <div className="notebook">
      <div className="notebook-header">
        <span className="notebook-title">Notebook</span>
        <button
          className="notebook-reset"
          onClick={resetAll}
          title="Reset the shared kernel"
        >
          Reset kernel
        </button>
        <button
          className="notebook-add"
          onClick={addCell}
          title="Add a new cell"
        >
          + Cell
        </button>
        {mobileOpen && (
          <button
            className="notebook-sheet-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close notebook"
          >
            ✕
          </button>
        )}
      </div>

      <div className="notebook-cells">
        {cells.map((cell, idx) => (
          <div
            className="notebook-cell"
            key={cell.id}
            ref={setCellRef(cell.id)}
          >
            <div className="notebook-cell-head">
              <span className="notebook-cell-num">[{idx + 1}]</span>
              <button
                className={`notebook-cell-run${cell.status === 'running' ? ' running' : ''}`}
                onClick={() => runCell(cell.id)}
                disabled={cell.status === 'running'}
              >
                {cell.status === 'running' ? '…' : '▶ Run'}
              </button>
              {cells.length > 1 && (
                <button
                  className="notebook-cell-del"
                  onClick={() => deleteCell(cell.id)}
                  aria-label={`Delete cell ${idx + 1}`}
                  title="Delete cell"
                >
                  ×
                </button>
              )}
            </div>

            <Monaco
              value={cell.code}
              onChange={(v) => updateCell(cell.id, { code: v })}
              onRun={() => runCell(cell.id)}
            />

            {cell.result && (
              <div
                className={`notebook-cell-out${cell.result.status !== 'ok' ? ' tiy-out-err' : ''}`}
              >
                {cell.result.outputs.length === 0 ? (
                  <div className="tiy-empty">No output.</div>
                ) : (
                  cell.result.outputs.map((o, i) => (
                    <OutputBlock key={i} o={o} />
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet: the notebook lives inside the right rail (CSS shows
          it there on >=1024px). On smaller screens `.right-rail` is hidden and
          we render the FAB + sheet instead. */}
      <div className="notebook-desktop">{notebookBody}</div>

      {/* Mobile FAB + sheet */}
      {!mobileOpen && (
        <button
          className="notebook-fab"
          onClick={() => setMobileOpen(true)}
          aria-label="Open notebook"
        >
          ▶ Notebook
        </button>
      )}
      {mobileOpen && (
        <div className="notebook-sheet">
          <div className="notebook-sheet-head">
            <span className="notebook-sheet-title">Notebook</span>
          </div>
          <div className="notebook-sheet-body">{notebookBody}</div>
        </div>
      )}
    </>
  );
}