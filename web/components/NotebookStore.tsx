'use client';

// NotebookStore.tsx
// -----------------
// Root-level provider that keeps each chapter's notebook cells in memory across
// client-side navigation, and backs them with sessionStorage so they survive a
// hard refresh. State clears when the browser tab is closed (sessionStorage).
//
// Why sessionStorage and not React state only?
// The chapter page unmounts on navigation, so component-local useState is lost.
// The root layout (where this provider lives) never unmounts during <Link>
// navigation, so the in-memory map survives navigation. sessionStorage then
// carries it across a page refresh. Base64 plot images can be large, so saves
// are wrapped in try/catch to silently handle any quota errors.
//
// Usage in a component:
//   const [cells, setCells] = useNotebookSession(sessionId);
// setCells accepts both a Cell[] directly or a functional updater (Cell[] => Cell[]).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// ── Shared types & helpers ──────────────────────────────────────────────────
// (Previously defined in NotebookPanel.tsx; centralised here so the panel
// and any future consumer share the same Cell shape.)

export type CellStatus = 'idle' | 'running' | 'done' | 'error';

export interface Cell {
  id: string;
  code: string;
  status: CellStatus;
  result?: import('@/lib/runner').RunResult;
}

let _cellCounter = 0;
export function newCellId(): string {
  _cellCounter += 1;
  return `c${Date.now().toString(36)}-${_cellCounter}`;
}

export function makeEmptyCell(): Cell {
  return { id: newCellId(), code: '', status: 'idle' };
}

// ── Storage helpers ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'notebook:v1';

function loadFromStorage(): Record<string, Cell[]> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, Cell[]>;
  } catch {
    // Corrupt data or storage unavailable — start fresh.
  }
  return {};
}

function saveToStorage(bySession: Record<string, Cell[]>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bySession));
  } catch {
    // Quota exceeded (large base64 plots) — silently ignore.
  }
}

// ── Context ─────────────────────────────────────────────────────────────────
type Updater<T> = T | ((prev: T) => T);

interface NotebookStoreContextType {
  getCells: (sessionId: string) => Cell[];
  setCells: (sessionId: string, updater: Updater<Cell[]>) => void;
}

const NotebookStoreContext = createContext<NotebookStoreContextType>({
  getCells: () => [],
  setCells: () => {},
});

// ── Provider ─────────────────────────────────────────────────────────────────
export default function NotebookStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialise empty; hydrate from sessionStorage in a client-only effect so
  // the SSR render and the first client render match (avoids hydration warnings).
  const [bySession, setBySession] = useState<Record<string, Cell[]>>({});
  const hydratedRef = useRef(false);

  // Hydrate once on mount (client only).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = loadFromStorage();
    if (Object.keys(stored).length > 0) setBySession(stored);
  }, []);

  // Persist whenever the map changes.
  useEffect(() => {
    saveToStorage(bySession);
  }, [bySession]);

  const getCells = useCallback(
    (sessionId: string) => bySession[sessionId] ?? [],
    [bySession],
  );

  const setCells = useCallback(
    (sessionId: string, updater: Updater<Cell[]>) => {
      setBySession((prev) => {
        const current = prev[sessionId] ?? [];
        const next =
          typeof updater === 'function'
            ? (updater as (p: Cell[]) => Cell[])(current)
            : updater;
        return { ...prev, [sessionId]: next };
      });
    },
    [],
  );

  return (
    <NotebookStoreContext.Provider value={{ getCells, setCells }}>
      {children}
    </NotebookStoreContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Returns [cells, setCells] for the given sessionId (e.g. "course/chapter").
 * An absent session gets seeded with one empty cell on first render.
 * setCells accepts a Cell[] or a functional updater exactly like useState.
 */
export function useNotebookSession(
  sessionId: string,
): [Cell[], (updater: Updater<Cell[]>) => void] {
  const { getCells, setCells } = useContext(NotebookStoreContext);

  const cells = getCells(sessionId);

  // Seed an empty cell the first time a session is accessed.
  useEffect(() => {
    if (getCells(sessionId).length === 0) {
      setCells(sessionId, [makeEmptyCell()]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const set = useCallback(
    (updater: Updater<Cell[]>) => setCells(sessionId, updater),
    [sessionId, setCells],
  );

  return [cells, set];
}
