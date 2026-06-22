import NavBar from '@/components/NavBar';
import Sidebar from './sidebar';
import { getCourseChapters } from '@/lib/content';

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ course: string }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { course } = await params;

  // Fetch chapters server-side so Sidebar can render immediately.
  const chapters = await getCourseChapters(course);
  const chapterList = chapters.map(ch => ({
    chapter: ch.chapter,
    title: ch.title,
    order: ch.order,
  }));

  return (
    <>
      <NavBar activeCourse={course} />

      <div className="course-layout">
        <Sidebar course={course} chapters={chapterList} />

        <main className="main-col" id="main-content">
          {children}
        </main>
      </div>
    </>
  );
}
