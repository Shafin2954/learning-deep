import NavBar from '@/components/NavBar';
import GlossaryClient from './GlossaryClient';
import { getGlossary } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kaggle Glossary | learning-deep',
  description:
    'Every term you will meet on Kaggle, defined in depth. Searchable.',
};

export default async function GlossaryPage() {
  const content = await getGlossary();

  if (!content) {
    return (
      <>
        <NavBar activeCourse="glossary" />
        <main className="home-main">
          <h1>Glossary not found</h1>
          <p>Could not read GLOSSARY.md.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar activeCourse="glossary" />
      <main className="glossary-main">
        <h1 className="page-title">Kaggle Glossary</h1>
        <p className="page-sub">
          Every term you'll meet on Kaggle, defined in depth.
          Cross-references point to chapters where a term gets full treatment.
        </p>
        <GlossaryClient content={content} />
      </main>
    </>
  );
}
