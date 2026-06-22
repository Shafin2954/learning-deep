'use client';

import { useState } from 'react';

export default function ChapterClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="right-rail">
        <div className="notebook-desktop">{children}</div>
      </aside>

      {!mobileOpen && (
        <button
          className="notebook-fab"
          onClick={() => setMobileOpen(true)}
          aria-label="Open notebook"
        >
          ⛶ Notebook
        </button>
      )}
      {mobileOpen && (
        <div className="notebook-sheet">
          <div className="notebook-sheet-body">{children}</div>
          <button
            className="notebook-fab"
            onClick={() => setMobileOpen(false)}
            aria-label="Close notebook"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
