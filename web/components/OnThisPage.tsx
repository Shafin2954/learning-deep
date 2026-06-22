'use client';

import { useEffect, useState } from 'react';

export interface PageSection {
  id: string;
  title: string;
}

interface Props {
  sections: PageSection[];
}

export default function OnThisPage({ sections }: Props) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (sections.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav className="on-this-page" aria-label="On this page">
      <p className="otp-heading">On this page</p>
      <ul className="otp-list">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`otp-link${activeId === id ? ' active' : ''}`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
