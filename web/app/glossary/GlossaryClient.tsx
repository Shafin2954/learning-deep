'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Markdown from '@/components/Markdown';

// ── types ────────────────────────────────────────────────────────────────────

interface TermRow {
  term: string;
  body: string;
  sub: boolean;
}

interface GlossarySection {
  id: string;
  title: string;
  intro: string;
  terms: TermRow[];
}

interface Props {
  content: string;
}

// ── parser ───────────────────────────────────────────────────────────────────

/**
 * Parse a section body into individual term rows.
 *
 * Each term starts at a `**Term** —` or `**Term** –` marker.
 * Bullet-indented markers (`- **Term** —`) are marked `sub: true`
 * so they can be rendered with an indent cue.
 */
function parseTerms(body: string): { terms: TermRow[]; intro: string } {
  // Match **Term** — (em-dash or en-dash), allowing a newline between ** and —
  const TERM_RE = /\*\*(.+?)\*\*\s*[—–]\s*/g;

  const matches: Array<{
    matchStart: number;
    contentStart: number;
    term: string;
    sub: boolean;
  }> = [];

  let m: RegExpExecArray | null;
  while ((m = TERM_RE.exec(body)) !== null) {
    // Look backward from the match to find the start of this line
    const before = body.slice(0, m.index);
    const lastNl = before.lastIndexOf('\n');
    const lineStart = before.slice(lastNl + 1);
    // Sub-term: the line starts with optional spaces then a `-`
    const sub = /^\s*-\s+/.test(lineStart);

    matches.push({
      matchStart: m.index,
      contentStart: m.index + m[0].length,
      term: m[1],
      sub,
    });
  }

  // Text before the first term marker becomes the section intro caption
  const intro =
    matches.length > 0 ? body.slice(0, matches[0].matchStart).trim() : body.trim();

  const terms = matches.map((match, i) => {
    const nextStart =
      i + 1 < matches.length ? matches[i + 1].matchStart : body.length;
    const rawBody = body.slice(match.contentStart, nextStart);
    // Strip trailing section-divider `---` (appears at the end of every section body)
    const cleanBody = rawBody.replace(/[\n\r]+---\s*$/, '').trim();
    return { term: match.term, body: cleanBody, sub: match.sub };
  });

  return { terms, intro };
}

/**
 * Parse the raw markdown string into 10 numbered glossary sections.
 * Skips any leading prose before the first `## ` heading.
 */
function parseGlossary(content: string): GlossarySection[] {
  const rawSections = content
    .split(/(?=^## )/m)
    .filter(raw => /^## /.test(raw)); // only numbered sections

  return rawSections.map((raw, i) => {
    const lines = raw.split('\n');
    const heading = lines[0] ?? '';
    // `## 1. Title text` → capture the title part
    const titleMatch = heading.match(/^##\s+\d+\.\s+(.+)$/);
    const title = titleMatch
      ? titleMatch[1].trim()
      : heading.replace(/^#+\s+/, '').trim();
    const id = `cat-${i + 1}`;
    const body = lines.slice(1).join('\n');

    const { terms, intro } = parseTerms(body);
    return { id, title, terms, intro };
  });
}

// ── highlight helper ─────────────────────────────────────────────────────────

/**
 * Render `text` with every occurrence of `query` wrapped in a `<mark>`.
 * Falls back to plain text when there's no query.
 */
function HighlightedTerm({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let idx = lower.indexOf(q, cursor);
  while (idx !== -1) {
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(<mark key={idx}>{text.slice(idx, idx + q.length)}</mark>);
    cursor = idx + q.length;
    idx = lower.indexOf(q, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

// ── main component ───────────────────────────────────────────────────────────

export default function GlossaryClient({ content }: Props) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const mainColRef = useRef<HTMLDivElement>(null);

  const allSections = useMemo(() => parseGlossary(content), [content]);

  // Filter to individual matching term rows (not whole sections)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSections;

    return allSections
      .map(section => ({
        ...section,
        terms: section.terms.filter(
          t =>
            t.term.toLowerCase().includes(q) ||
            t.body.toLowerCase().includes(q),
        ),
      }))
      .filter(
        s =>
          s.terms.length > 0 || s.intro.toLowerCase().includes(q),
      );
  }, [query, allSections]);

  const totalTerms = useMemo(
    () => filtered.reduce((n, s) => n + s.terms.length, 0),
    [filtered],
  );

  // ── scroll spy ────────────────────────────────────────────────────────────

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Pick the first entry that is intersecting (topmost visible section)
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    allSections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allSections]);

  // ── render ────────────────────────────────────────────────────────────────

  const trimmedQuery = query.trim();

  return (
    <div className="glossary-shell">
      {/* ── sticky side nav ── */}
      <nav className="glossary-sidenav" aria-label="Glossary categories">
        <p className="sidenav-label">Categories</p>
        {allSections.map(s => {
          const inFiltered = filtered.find(f => f.id === s.id);
          const displayCount = trimmedQuery
            ? (inFiltered?.terms.length ?? 0)
            : s.terms.length;
          const isDimmed = !!trimmedQuery && !inFiltered;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                'sidenav-link',
                activeId === s.id ? 'active' : '',
                isDimmed ? 'dimmed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="sidenav-title">{s.title}</span>
              <span className="sidenav-count">{displayCount}</span>
            </a>
          );
        })}
      </nav>

      {/* ── main column ── */}
      <div className="glossary-main-col" ref={mainColRef}>
        {/* search bar */}
        <div className="glossary-search-bar">
          <input
            className="glossary-search-input"
            type="search"
            placeholder="Filter terms…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Filter glossary"
          />
          {trimmedQuery && (
            <span className="glossary-count">
              {totalTerms} term{totalTerms !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="glossary-empty">No terms matched &ldquo;{query}&rdquo;.</p>
        ) : (
          filtered.map(section => (
            <section
              key={section.id}
              id={section.id}
              className="glossary-section"
            >
              <h2 className="glossary-cat-heading">{section.title}</h2>

              {section.intro && (
                <p className="glossary-intro">{section.intro}</p>
              )}

              {section.terms.length > 0 && (
                <table className="glossary-table">
                  <thead>
                    <tr>
                      <th className="gloss-th-term">Term</th>
                      <th className="gloss-th-def">Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.terms.map((row, i) => (
                      <tr key={i}>
                        <td
                          className={`gloss-term${row.sub ? ' is-sub' : ''}`}
                        >
                          <HighlightedTerm
                            text={row.term}
                            query={trimmedQuery}
                          />
                        </td>
                        <td className="gloss-def">
                          <Markdown content={row.body} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
