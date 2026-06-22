import Link from 'next/link';
import {
  getChapterBySlug,
  getCourseChapters,
  extractCodeFromMarkdown,
  extractProse,
} from '@/lib/content';
import TryItYourself from '@/components/TryItYourself';
import Markdown from '@/components/Markdown';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import NotebookPanel from '@/components/NotebookPanel';
import ChapterClient from '@/components/ChapterClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ course: string; chapter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, chapter } = await params;
  const ch = await getChapterBySlug(course, chapter);
  return {
    title: ch ? `${ch.title} | learning-deep` : 'Chapter | learning-deep',
    description: ch
      ? `${ch.title} — interactive lesson with runnable Python examples.`
      : undefined,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { course, chapter } = await params;

  const [chapterData, allChapters] = await Promise.all([
    getChapterBySlug(course, chapter),
    getCourseChapters(course),
  ]);

  if (!chapterData) {
    return (
      <div className="chapter-body">
        <h1>Chapter not found</h1>
        <p>Could not find <code>{course}/{chapter}</code>.</p>
        <Link href={`/${course}`}>← Back to course</Link>
      </div>
    );
  }

  const { title, blocks, order } = chapterData;

  // Prev / next
  const idx = allChapters.findIndex(c => c.chapter === chapter);
  const prev = idx > 0 ? allChapters[idx - 1] : null;
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;

  return (
    <div className="chapter-with-rail">
      {/* ── Main column ─────────────────────────────────────────────────── */}
      <article className="chapter-body">
        <header className="chapter-header">
          <p className="chapter-breadcrumb">Chapter {order}</p>
          <h1 className="chapter-title">{title}</h1>
        </header>

        {/* Render every ## block in document order */}
        {blocks.map(block => {
          const isUnderTheTrench = /under the trench/i.test(block.title);

          if (block.isTiy) {
            const tiyCode = extractCodeFromMarkdown(block.body);
            const tiyProse = extractProse(block.body);
            return (
              <section
                key={block.id}
                id={block.id}
                className="chapter-section"
              >
                <h2 className="section-heading">{block.title}</h2>
                {tiyProse && <Markdown content={tiyProse} />}
                <TryItYourself
                  sessionId={`${course}/${chapter}`}
                  initialCode={tiyCode}
                />
              </section>
            );
          }

          return (
            <section
              key={block.id}
              id={block.id}
              className={`chapter-section${isUnderTheTrench ? ' under-the-trench' : ''}`}
            >
              <h2 className="section-heading">{block.title}</h2>
              {isUnderTheTrench && (
                <p className="trench-label">Advanced / rare topics</p>
              )}
              <Markdown content={block.body} />
            </section>
          );
        })}

        {/* Mark complete — sits at the bottom of the main column, just above
            the prev/next nav. */}
        <div className="chapter-mark-complete">
          <MarkCompleteButton courseChapter={`${course}/${chapter}`} />
        </div>

        {/* Prev / Next */}
        <nav className="prev-next-nav" aria-label="Chapter navigation">
          <div className="prev-next-inner">
            {prev ? (
              <Link href={`/${course}/${prev.chapter}`} className="prev-link">
                <span className="nav-dir">◂ Previous</span>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/${course}/${next.chapter}`} className="next-link">
                <span className="nav-dir">Next ▸</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      </article>

      {/* ── Right rail — notebook only, fills the full rail ─────────────── */}
      <ChapterClient>
        <NotebookPanel sessionId={`${course}/${chapter}`} />
      </ChapterClient>
    </div>
  );
}
