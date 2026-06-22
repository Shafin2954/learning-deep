'use client';

import { createContext, useContext, useState } from 'react';

interface ProgressContextType {
  isComplete: (key: string) => boolean;
  toggle: (key: string) => void;
}

export const ProgressContext = createContext<ProgressContextType>({
  isComplete: () => false,
  toggle: () => {},
});

export function useProgress() {
  return useContext(ProgressContext);
}

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <ProgressContext.Provider
      value={{ isComplete: key => completed.has(key), toggle }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
