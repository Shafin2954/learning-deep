// Pure client-safe utilities — no fs/path imports.

export const COURSE_NAMES: Record<string, string> = {
  'foundations-for-llm': 'Foundations for LLM',
  'bengali-llm': 'Bengali LLM',
  'tabular-kaggle': 'Tabular Kaggle',
};

export function courseIdToName(id: string): string {
  return (
    COURSE_NAMES[id] ??
    id
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}
