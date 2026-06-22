'use client';

import React, { useRef, useCallback, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

// ─── copy button ─────────────────────────────────────────────────────────────

function CopyButton({ onCopy }: { onCopy: () => Promise<void> | void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="copy-btn" onClick={handleCopy} aria-label="Copy code">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

// ─── code block with syntax highlighting ────────────────────────────────────

function CodeBlock({ children, lang }: { children: React.ReactNode; lang: string }) {
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback((): Promise<void> => {
    const text = preRef.current?.textContent ?? '';
    return navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="code-block">
      <div className="code-block-header">
        {lang && <span className="code-lang">{lang}</span>}
        <CopyButton onCopy={handleCopy} />
      </div>
      <pre ref={preRef} className="code-block-pre">
        {children}
      </pre>
    </div>
  );
}

// ─── output panel ────────────────────────────────────────────────────────────

function OutputPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="output-panel">
      <span className="output-label">Output</span>
      <pre className="output-pre">{children}</pre>
    </div>
  );
}

// ─── remark / rehype plugin lists (stable references, outside component) ────

const remarkPlugins = [remarkGfm, remarkMath] as const;
// rehype-raw first so <details>/<summary> raw HTML survives; katex next;
// highlight last so it doesn't touch math spans.
const rehypePlugins = [
  rehypeRaw,
  rehypeKatex,
  [rehypeHighlight, { ignoreMissing: true }],
] as const;

// ─── component overrides ─────────────────────────────────────────────────────

const components: Components = {
  // Override <pre> to detect language and render the correct panel.
  // rehype-highlight has already added hljs spans inside <code> by this point.
  pre({ children }) {
    // Find the <code> child to read its language className.
    const codeEl = React.Children.toArray(children).find(
      (c): c is React.ReactElement<{ className?: string; children?: React.ReactNode }> =>
        React.isValidElement(c)
    );
    const className = codeEl?.props?.className ?? '';
    const lang = /language-(\w+)/.exec(className)?.[1] ?? '';

    if (lang === 'output') {
      // Render as a labeled Output panel, not a code block.
      return <OutputPanel>{children}</OutputPanel>;
    }

    return <CodeBlock lang={lang}>{children}</CodeBlock>;
  },

  // For block code: pass through so the <pre> override above receives the
  // highlighted children intact. For inline code: apply inline-code styling.
  code({ className, children }) {
    if (/language-/.test(className ?? '')) {
      // Block code inside a <pre> — return as-is, pre handles the wrapper.
      return <code className={className}>{children}</code>;
    }
    return <code className="inline-code">{children}</code>;
  },
};

// ─── main component ──────────────────────────────────────────────────────────

/**
 * Render markdown / MDX body content with:
 *   - KaTeX math  ($…$ and $$…$$)
 *   - Syntax-highlighted fenced code (highlight.js github-dark theme)
 *   - Output panels  (```output blocks become a labeled "Output" panel)
 *   - GFM (tables, strikethrough) and raw HTML (<details>, <summary>)
 *   - Bengali text renders via Noto Sans Bengali loaded at layout level
 */
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={remarkPlugins as any}
        rehypePlugins={rehypePlugins as any}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
