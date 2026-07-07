import NavBar from '@/components/NavBar';
import SetupClient from './SetupClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set up locally | learning-deep',
  description:
    'Generate a one-click script to run the local code-runner — pick your device and environment, download, and go. No git clone.',
};

export default function SetupPage() {
  return (
    <>
      <NavBar activeCourse="setup" />
      <main className="setup-main">
        <h1 className="page-title">Set up the local runner</h1>
        <p className="page-sub">
          The lessons run real Python on a small backend (the code-runner) on your own machine.
          Pick your device and environment below, download one script, and run it — no{' '}
          <code>git clone</code>, no repo checkout. Once it&apos;s running on{' '}
          <code>localhost:8000</code>, the site talks to it automatically.
        </p>
        <SetupClient />
      </main>
    </>
  );
}
