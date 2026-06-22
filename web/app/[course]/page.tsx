import Link from 'next/link';
import { getCourseChapters, getCourseMetadata } from '@/lib/content';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ course: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course } = await params;
  const meta = await getCourseMetadata(course);
  return {
    title: `${meta.name} | learning-deep`,
    description: `Interactive ${meta.name} course — learn with runnable Python examples.`,
  };
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params;
  const [meta, chapters] = await Promise.all([
    getCourseMetadata(course),
    getCourseChapters(course),
  ]);

  return (
    <div className="course-landing">
      <h1 className="page-title">{meta.name}</h1>
      <p className="page-sub">
        {chapters.length} chapters · run every example in your browser
      </p>

      <div className="chapter-cards-grid">
        {chapters.map(ch => (
          <Link
            key={ch.chapter}
            href={`/${course}/${ch.chapter}`}
            className="chapter-card"
          >
            <span className="chapter-card-order">{ch.order}</span>
            <span className="chapter-card-title">{ch.title}</span>
            <span className="chapter-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
