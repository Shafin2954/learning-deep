'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '@/lib/content';

export default function Search({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 1
      ? searchIndex
          .filter(
            e =>
              e.title.toLowerCase().includes(query.toLowerCase()) ||
              e.snippet.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8)
      : [];

  // Close on click outside
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <input
        className="search-input"
        type="search"
        placeholder="Search chapters…"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search chapters"
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
      />
      {open && results.length > 0 && (
        <div className="search-results" role="listbox">
          {results.map(r => (
            <Link
              key={`${r.course}/${r.chapter}`}
              href={`/${r.course}/${r.chapter}`}
              className="search-result-item"
              role="option"
              aria-selected={false}
              onClick={() => {
                setOpen(false);
                setQuery('');
              }}
            >
              <span className="search-result-title">{r.title}</span>
              <span className="search-result-course">
                {r.course.replace(/-/g, ' ')}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
