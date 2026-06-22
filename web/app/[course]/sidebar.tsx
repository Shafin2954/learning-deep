'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import { courseIdToName } from '@/lib/courseNames';

interface SidebarProps {
  course: string;
  chapters: Array<{ chapter: string; title: string; order: number }>;
}

export default function Sidebar({ course, chapters }: SidebarProps) {
  const pathname = usePathname();
  const { isComplete } = useProgress();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close sidebar on outside click (mobile) — but NOT when the click is on the
  // toggle button itself, otherwise pressing the X would close-then-reopen
  // (mousedown fires before click, so the outside handler would close, then
  // the button's onClick would re-open it).
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (sidebarRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close when navigating (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger — visible only on mobile, positioned inside the top navbar */}
      <button
        ref={toggleRef}
        className="sidebar-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`sidebar${open ? ' open' : ''}`}
        aria-label="Chapter navigation"
      >
        <div className="sidebar-header">
          <Link href={`/${course}`} className="sidebar-course-link">
            {courseIdToName(course)}
          </Link>
        </div>

        <nav className="sidebar-nav">
          {chapters.map(ch => {
            const href = `/${course}/${ch.chapter}`;
            const isActive = pathname === href;
            const done = isComplete(`${course}/${ch.chapter}`);

            return (
              <Link
                key={ch.chapter}
                href={href}
                className={`chapter-link${isActive ? ' active' : ''}`}
              >
                <span className="chapter-order">{ch.order}</span>
                <span className="chapter-title-text">{ch.title}</span>
                {done && (
                  <span className="chapter-check" aria-label="Complete">
                    ✓
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
