'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';
import { isMermaidSource, normalizeMermaidSource } from '@/entities/project-detail-page/lib';
import { getMermaidRenderConfig } from '@/entities/project-detail-page/lib/mermaid-theme';
import { normalizeFixedWidthAscii } from '@/entities/project-detail-page/lib/ascii-art-utils';
import { STORY_CODE_BLOCK_CLASS, STORY_CODE_SURFACE_CLASS } from '@/constants/story-typography';

type CodeBlockProps = {
  code: string;
};

export function CodeBlock({ code }: CodeBlockProps) {
  const id = useId().replace(/:/g, '');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMermaid = isMermaidSource(code);
  const mermaidSource = isMermaid ? normalizeMermaidSource(code) : code;
  const displayCode = isMermaid ? code : normalizeFixedWidthAscii(code);

  useEffect(() => {
    if (!isMermaid || !mermaidSource) return;

    let cancelled = false;

    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize(getMermaidRenderConfig(isDark));
        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}`,
          mermaidSource,
        );
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
  }, [id, isDark, isMermaid, mermaidSource]);

  if (!isMermaid) {
    return (
      <pre className={STORY_CODE_BLOCK_CLASS}>
        {displayCode}
      </pre>
    );
  }

  if (error) {
    return (
      <pre
        className={`${STORY_CODE_BLOCK_CLASS} border-red-300/60 bg-red-50/90 text-red-900 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-100`}
      >
        {displayCode}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className={`${STORY_CODE_SURFACE_CLASS} p-6 text-base text-slate-600 dark:text-slate-400`}>
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className={`story-mermaid ${STORY_CODE_SURFACE_CLASS} overflow-x-auto p-4 [&_svg]:mx-auto`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
