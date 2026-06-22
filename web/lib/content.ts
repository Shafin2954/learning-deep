import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { courseIdToName } from './courseNames';
export { courseIdToName } from './courseNames';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Extract the first fenced code block's body from a markdown string. */
export function extractCodeFromMarkdown(markdown: string): string {
  const m = /```(?:\w+)?\n([\s\S]*?)\n```/.exec(markdown);
  return m ? m[1] : '';
}

/** Strip all fenced code blocks (used to get prose-only from a section). */
export function extractProse(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, '').trim();
}

/** Kept for compat. */
export function extractExerciseParts(markdown: string): { prose: string; solution: string } {
  return { prose: extractProse(markdown), solution: '' };
}

/** Convert a heading title to a URL-safe id for anchor links. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── types ──────────────────────────────────────────────────────────────────

/** One ## section of a chapter, in document order. */
export interface ChapterBlock {
  /** Slugified heading title — used as the HTML id for anchor links. */
  id: string;
  /** The heading text, e.g. "Numerical stability: the log-sum-exp trick". */
  title: string;
  /** Markdown body of this section (everything until the next ## heading). */
  body: string;
  /** True when the heading matches /^try it/i — section gets the live widget. */
  isTiy: boolean;
}

export interface Chapter {
  course: string;
  chapter: string; // URL slug — matches the `chapter` frontmatter field
  title: string;
  order: number;
  /** Ordered list of ## sections. Replaces the old named-section map. */
  blocks: ChapterBlock[];
  content: string;
}

export interface CourseMetadata {
  id: string;
  name: string;
}

export interface SearchEntry {
  course: string;
  chapter: string;
  title: string;
  snippet: string;
}

// ─── filesystem path ─────────────────────────────────────────────────────────

function getCoursesDir(): string {
  // `web/` is the Next.js app root; courses live one level up at repo root.
  const repoRoot = path.join(process.cwd(), '..', 'courses');
  if (fs.existsSync(repoRoot)) return repoRoot;
  // Fallback: if cwd happens to already be the repo root
  const local = path.join(process.cwd(), 'courses');
  return local;
}

// ─── section parsing ─────────────────────────────────────────────────────────

/**
 * Split content on `## ` headings, returning blocks in document order.
 * `### ` sub-headings stay inside their block's body so react-markdown
 * renders them as <h3> without any special handling.
 */
function parseOrderedSections(content: string): ChapterBlock[] {
  const sectionRegex = /^##\s+(.+)$/gm;
  const found: { title: string; headingStart: number; bodyStart: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = sectionRegex.exec(content)) !== null) {
    const title = m[1].trim();
    const nlPos = content.indexOf('\n', m.index);
    const bodyStart = nlPos >= 0 ? nlPos + 1 : m.index + m[0].length;
    found.push({ title, headingStart: m.index, bodyStart });
  }

  return found.map((f, i) => {
    const bodyEnd = i + 1 < found.length ? found[i + 1].headingStart : content.length;
    const body = content.slice(f.bodyStart, bodyEnd).trim();
    return {
      id: slugify(f.title),
      title: f.title,
      body,
      isTiy: /^try it/i.test(f.title),
    };
  });
}

// ─── data fetchers (React-cached per request) ────────────────────────────────

export const getCourseDirectories = cache(async (): Promise<string[]> => {
  try {
    const dir = getCoursesDir();
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch {
    return [];
  }
});

export const getCourseMetadata = cache(
  async (courseId: string): Promise<CourseMetadata> => ({
    id: courseId,
    name: courseIdToName(courseId),
  })
);

export const getChapterBySlug = cache(
  async (courseId: string, slug: string): Promise<Chapter | null> => {
    if (!courseId || !slug) return null;
    const filePath = path.join(getCoursesDir(), courseId, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const { course, chapter, title, order } = data as {
      course: string;
      chapter: string;
      title: string;
      order: number;
    };

    return {
      course: course ?? courseId,
      chapter: chapter ?? slug,
      title: title ?? slug,
      order: order ?? 0,
      blocks: parseOrderedSections(content),
      content: raw,
    };
  }
);

export const getCourseChapters = cache(
  async (courseId: string): Promise<Chapter[]> => {
    if (!courseId) return [];
    const courseDir = path.join(getCoursesDir(), courseId);
    if (!fs.existsSync(courseDir)) return [];

    const slugs = fs
      .readdirSync(courseDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => path.basename(f, '.mdx'));

    const chapters: Chapter[] = [];
    for (const slug of slugs) {
      const ch = await getChapterBySlug(courseId, slug);
      if (ch) chapters.push(ch);
    }

    return chapters.sort((a, b) => a.order - b.order);
  }
);

export const getGlossary = cache(async (): Promise<string | null> => {
  try {
    const p = path.join(getCoursesDir(), 'tabular-kaggle', 'GLOSSARY.md');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
  } catch {
    return null;
  }
});

export const getSearchIndex = cache(async (): Promise<SearchEntry[]> => {
  const courses = await getCourseDirectories();
  const entries: SearchEntry[] = [];
  for (const course of courses) {
    const chapters = await getCourseChapters(course);
    for (const ch of chapters) {
      // Use the first non-TIY, non-Exercise block as the search snippet
      const firstBody =
        ch.blocks.find(b => !b.isTiy && !/^exercise/i.test(b.title))?.body ?? '';
      entries.push({
        course: ch.course,
        chapter: ch.chapter,
        title: ch.title,
        snippet: firstBody
          .slice(0, 250)
          .replace(/[#*`_$]/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      });
    }
  }
  return entries;
});
