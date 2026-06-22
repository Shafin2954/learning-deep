import './globals.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Sans_Bengali } from 'next/font/google';
import ProgressProvider from '@/components/ProgressProvider';
import NotebookStoreProvider from '@/components/NotebookStore';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const noto = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'learning-deep — Interactive ML Learning',
  description:
    'W3Schools-style interactive learning for machine learning and data science. Read a concept, try real Python in the browser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${noto.variable}`}>
      <body>
        <ProgressProvider>
          <NotebookStoreProvider>{children}</NotebookStoreProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
