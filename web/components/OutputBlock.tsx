'use client';

import { type Output } from '@/lib/runner';
import { stripAnsi } from '@/lib/runner';

/**
 * Renders one entry of a kernel `Output[]` array (stdout, stderr, text,
 * DataFrame HTML, plot image, or traceback).
 *
 * Used by both `<TryItYourself>` and the right-rail `<NotebookPanel>` so they
 * present identical output rendering. CSS classes are `.tiy-*` (see
 * `globals.css`).
 */
export default function OutputBlock({ o }: { o: Output }) {
  switch (o.type) {
    case 'stdout':
    case 'text':
      return <pre className="tiy-text">{o.text}</pre>;
    case 'stderr':
      return <pre className="tiy-text tiy-stderr">{o.text}</pre>;
    case 'html':
      // DataFrame / rich HTML from the kernel. The runner is single-user,
      // local-only (see README.md security note), so this HTML is from the
      // user's own code. If the runner ever becomes multi-user, route `o.html`
      // through DOMPurify first.
      return (
        <div
          className="tiy-html"
          dangerouslySetInnerHTML={{ __html: o.html }}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="tiy-img"
          alt="plot output"
          src={`data:${o.mime};base64,${o.b64}`}
        />
      );
    case 'error':
      return (
        <pre className="tiy-error">
          {o.ename}: {o.evalue}
          {o.traceback.length > 0 &&
            '\n\n' + o.traceback.map(stripAnsi).join('\n')}
        </pre>
      );
    default:
      return null;
  }
}