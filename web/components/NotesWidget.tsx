'use client';

// NotesWidget.tsx
// ---------------
// Floating per-chapter notes popup. A small icon sits at the lower-right of
// every chapter page; clicking it opens a writable panel right-aligned inside
// the notebook rail's width band, fixed height, own scroll, with a close (✕)
// button top-right. It never shifts surrounding content (fixed-position
// overlay). Notes persist per chapter via useNotes(sessionId) — see
// NotesStore.tsx.

import { useState } from 'react';
import { useNotes } from '@/components/NotesStore';

export default function NotesWidget({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useNotes(sessionId);

  return (
    <>
      {!open && (
        <button
          className="notes-fab"
          onClick={() => setOpen(true)}
          aria-label="Open notes"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
            <path d="M14 3v6h6" />
            <line x1="8.5" y1="13" x2="15.5" y2="13" />
            <line x1="8.5" y1="17" x2="13" y2="17" />
          </svg>
        </button>
      )}

      {open && (
        <div className="notes-panel">
          <div className="notes-panel-head">
            <span className="notes-panel-title">Notes</span>
            <button
              className="notes-close"
              onClick={() => setOpen(false)}
              aria-label="Close notes"
            >
              ✕
            </button>
          </div>
          <textarea
            className="notes-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your notes for this chapter…"
          />
        </div>
      )}
    </>
  );
}
