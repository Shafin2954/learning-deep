'use client';

import { useProgress } from './ProgressProvider';

export default function MarkCompleteButton({
  courseChapter,
}: {
  courseChapter: string;
}) {
  const { isComplete, toggle } = useProgress();
  const done = isComplete(courseChapter);

  return (
    <button
      className={`mark-complete-btn${done ? ' done' : ''}`}
      onClick={() => toggle(courseChapter)}
      aria-pressed={done}
    >
      {done ? '✓ Complete' : 'Mark complete'}
    </button>
  );
}
