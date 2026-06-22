import Link from 'next/link';
import Search from './Search';
import { getSearchIndex } from '@/lib/content';

const COURSES = [
  { id: 'foundations-for-llm', name: 'Foundations' },
  { id: 'bengali-llm', name: 'Bengali LLM' },
  { id: 'tabular-kaggle', name: 'Tabular Kaggle' },
] as const;

interface NavBarProps {
  activeCourse?: string;
}

/**
 * Top navigation bar — server component so it can fetch the search index.
 * Renders the logo, course tabs, and client-side search box.
 */
export default async function NavBar({ activeCourse }: NavBarProps) {
  const searchIndex = await getSearchIndex();

  return (
    <header className="top-nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          learning-deep
        </Link>

        <nav className="nav-tabs" aria-label="Courses">
          {COURSES.map(c => (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className={`nav-tab${activeCourse === c.id ? ' active' : ''}`}
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/glossary"
            className={`nav-tab${activeCourse === 'glossary' ? ' active' : ''}`}
          >
            Glossary
          </Link>
        </nav>

        <Search searchIndex={searchIndex} />
      </div>
    </header>
  );
}
