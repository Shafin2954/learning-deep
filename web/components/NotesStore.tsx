'use client';

// NotesStore.tsx
// --------------
// Root-level provider that keeps a personal note per chapter. Unlike the
// notebook (sessionStorage — cleared when the tab closes), notes are meant to
// survive across browser sessions, so this store backs them with
// localStorage. Everything else mirrors NotebookStore.tsx's shape:
// hydrate once from storage in a client-only effect (so SSR and first client
// render match), then persist on change. Writes are debounced so we don't hit
// localStorage on every keystroke.
//
// Usage in a component:
//   const [note, setNote] = useNotes(sessionId);

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// ── Storage helpers ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'notes:v1';
const SAVE_DEBOUNCE_MS = 500;

function loadFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    // Corrupt data or storage unavailable (e.g. private browsing) — start fresh.
  }
  return {};
}

function saveToStorage(bySession: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bySession));
  } catch {
    // Quota exceeded or storage unavailable — silently ignore.
  }
}

// ── Context ─────────────────────────────────────────────────────────────────
interface NotesStoreContextType {
  getNote: (sessionId: string) => string;
  setNote: (sessionId: string, text: string) => void;
}

const NotesStoreContext = createContext<NotesStoreContextType>({
  getNote: () => '',
  setNote: () => {},
});

// ── Provider ─────────────────────────────────────────────────────────────────
export default function NotesStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialise empty; hydrate from localStorage in a client-only effect so the
  // SSR render and the first client render match (avoids hydration warnings).
  const [bySession, setBySession] = useState<Record<string, string>>({});
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate once on mount (client only).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = loadFromStorage();
    if (Object.keys(stored).length > 0) setBySession(stored);
  }, []);

  // Persist whenever the map changes, debounced so rapid typing doesn't write
  // to localStorage on every keystroke. Flush on unmount.
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveToStorage(bySession);
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [bySession]);

  // Flush any pending save immediately when the tab is being closed/hidden.
  useEffect(() => {
    const flush = () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveToStorage(bySession);
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [bySession]);

  const getNote = useCallback(
    (sessionId: string) => bySession[sessionId] ?? '',
    [bySession],
  );

  const setNote = useCallback((sessionId: string, text: string) => {
    setBySession((prev) => ({ ...prev, [sessionId]: text }));
  }, []);

  return (
    <NotesStoreContext.Provider value={{ getNote, setNote }}>
      {children}
    </NotesStoreContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Returns [note, setNote] for the given sessionId (e.g. "course/chapter").
 * An absent session simply reads as an empty string — no seeding needed.
 */
export function useNotes(sessionId: string): [string, (text: string) => void] {
  const { getNote, setNote } = useContext(NotesStoreContext);

  const note = getNote(sessionId);

  const set = useCallback(
    (text: string) => setNote(sessionId, text),
    [sessionId, setNote],
  );

  return [note, set];
}
