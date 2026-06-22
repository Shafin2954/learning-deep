import Link from 'next/link';
import NavBar from '@/components/NavBar';

const COURSES = [
  {
    id: 'foundations-for-llm',
    name: 'Foundations for LLM',
    tagline: '15 chapters covering the math, code, and intuition behind modern LLMs.',
    chapters: 15,
    badge: 'F1 – F15',
  },
  {
    id: 'bengali-llm',
    name: 'Bengali LLM',
    tagline: '18 chapters building a Bengali language model from scratch for Kaggle.',
    chapters: 18,
    badge: 'Ch 1 – 18',
  },
  {
    id: 'tabular-kaggle',
    name: 'Tabular Kaggle',
    tagline: '19 chapters on classical ML, boosting, and competition strategies.',
    chapters: 19,
    badge: 'Ch 1 – 19',
  },
];

export default function Home() {
  return (
    <>
      <NavBar />

      <main className="home-main">
        <section className="home-hero">
          <h1 className="hero-title">
            Learn ML by running real Python
          </h1>
          <p className="hero-sub">
            Concepts, worked examples, live kernel. <br/>
            Every code block executes on a real kernel — numpy, pandas, torch, transformers, all available.
          </p>
          <br/>
          <p>Set up locally to run code in your browser. See the <Link href="https://github.com/Shafin2954/learning-deep.git" target="_blank">github repository</Link>. <br/>More courses in proper order will be added soon!</p>
        </section>

        <section className="home-courses">
          <h2 className="home-section-heading">Courses</h2>
          <div className="courses-grid">
            {COURSES.map(c => (
              <Link key={c.id} href={`/${c.id}`} className="course-card">
                <div className="course-card-badge">{c.badge}</div>
                <h3 className="course-card-title">{c.name}</h3>
                <p className="course-card-tagline">{c.tagline}</p>
                <span className="course-card-cta">Start learning →</span>
              </Link>
            ))}

            <Link href="/glossary" className="course-card glossary-card">
              <div className="course-card-badge">Reference</div>
              <h3 className="course-card-title">Kaggle Glossary</h3>
              <p className="course-card-tagline">
                Every term you'll meet on Kaggle, defined in depth. Searchable.
              </p>
              <span className="course-card-cta">Browse glossary →</span>
            </Link>
          </div>
        </section>

        <section className="home-features">
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">▶</span>
              <h3>Real kernel</h3>
              <p>Code runs on a local Jupyter kernel — not a sandbox. Import anything.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📓</span>
              <h3>Stateful per page</h3>
              <p>Variables from an earlier example stay alive for the next one, like a notebook.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔡</span>
              <h3>Bengali support</h3>
              <p>Bengali script renders correctly throughout — tokenization examples included.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
