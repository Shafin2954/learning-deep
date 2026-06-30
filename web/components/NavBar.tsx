import Link from 'next/link';
import Search from './Search';
import { getSearchIndex } from '@/lib/content';

/**
 * Grouped course manifest — matches PLAN.md §2 navigation groups.
 * Add a course here (and to courseNames.ts + app/page.tsx) when its content is published.
 * Groups with zero courses are hidden automatically.
 */
export const COURSE_GROUPS = [
  {
    group: 'Foundations',
    courses: [
      { id: 'python-for-data-work',     name: 'Python for Data Work' },
      { id: 'math-optimization',        name: 'Math & Optimization' },
      { id: 'probability-statistics',   name: 'Probability & Statistics' },
    ],
  },
  {
    group: 'Data',
    courses: [
      { id: 'data-wrangling-eda', name: 'Data Wrangling & EDA' },
    ],
  },
  {
    group: 'Core ML',
    courses: [
      { id: 'classical-ml',           name: 'Classical ML' },
      { id: 'time-series-forecasting', name: 'Time Series' },
      { id: 'tabular-kaggle',          name: 'Tabular Kaggle ✦' },
    ],
  },
  {
    group: 'Deep Learning',
    courses: [
      { id: 'deep-learning-foundations', name: 'DL Foundations' },
      { id: 'cnns-computer-vision',      name: 'CNNs & Vision' },
      { id: 'sequence-transformers',     name: 'Sequences & Transformers' },
      { id: 'generative-models',         name: 'Generative Models' },
      { id: 'modern-architectures',      name: 'Modern Architectures' },
      { id: 'nlp-llms',                  name: 'NLP & LLMs' },
      { id: 'foundations-for-llm', name: 'Foundations for LLM ✦' },
      { id: 'bengali-llm',         name: 'Bengali LLM ✦' },
    ],
  },
  {
    group: 'Specialized',
    courses: [
      { id: 'reinforcement-learning', name: 'Reinforcement Learning' },
      { id: 'graph-ml',               name: 'Graph ML' },
      // { id: 'recommender-systems',    name: 'Recommender Systems' }, // coming soon
      // { id: 'bayesian-ml',            name: 'Bayesian ML' },          // coming soon
    ],
  },
  {
    group: 'Applied / Prod',
    courses: [
      // { id: 'eval-tuning',    name: 'Eval & Tuning' },    // coming soon
      // { id: 'competition-ml', name: 'Competition ML' },   // coming soon
      // { id: 'system-design',  name: 'System Design' },    // coming soon
      // { id: 'mlops',          name: 'MLOps' },            // coming soon
    ],
  },
];

interface NavBarProps {
  activeCourse?: string;
}

/**
 * Top navigation bar — server component so it can fetch the search index.
 * Renders the logo, grouped course dropdowns, Glossary link, and search box.
 * ✦ = existing fast-track course; plain entries = full PLAN.md courses.
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
          {COURSE_GROUPS.filter(g => g.courses.length > 0).map(g => {
            const groupActive = g.courses.some(c => c.id === activeCourse);
            return (
              <div key={g.group} className="nav-group">
                <button className={`nav-group-trigger${groupActive ? ' active' : ''}`} aria-haspopup="true">
                  {g.group}
                </button>
                <div className="nav-group-dropdown">
                  {g.courses.map(c => (
                    <Link
                      key={c.id}
                      href={`/${c.id}`}
                      className={`nav-group-item${activeCourse === c.id ? ' active' : ''}`}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

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
