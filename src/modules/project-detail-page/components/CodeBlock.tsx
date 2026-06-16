'use client';

import { useEffect, useId, useState } from 'react';
import { isMermaidSource } from '../lib/embed-utils';

type CodeBlockProps = {
  code: string;
};

export function CodeBlock({ code }: CodeBlockProps) {
  const id = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMermaid = isMermaidSource(code);

  useEffect(() => {
    if (!isMermaid) return;

    let cancelled = false;

    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled) {
          setError(null);
          setSvg(rendered);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Mermaid render failed');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, id, isMermaid]);

  if (!isMermaid) {
    return (
      <pre className='overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100'>
        <code>{code}</code>
      </pre>
    );
  }

  if (error) {
    return (
      <pre className='overflow-x-auto rounded-xl bg-red-950/40 p-4 text-sm text-red-200'>
        <code>{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className='rounded-xl bg-zinc-100 p-6 text-sm text-zinc-500 dark:bg-zinc-900'>
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className='overflow-x-auto rounded-xl bg-white p-4 dark:bg-zinc-900 [&_svg]:mx-auto'
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
