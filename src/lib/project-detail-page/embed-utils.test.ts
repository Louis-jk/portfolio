import { describe, expect, it } from 'vitest';
import {
  isMermaidSource,
  normalizeMermaidSource,
} from './embed-utils';

describe('normalizeMermaidSource', () => {
  it('returns plain diagram source unchanged', () => {
    const source = 'flowchart LR\n  A --> B';
    expect(normalizeMermaidSource(source)).toBe(source);
  });

  it('unwraps fenced mermaid blocks', () => {
    expect(
      normalizeMermaidSource('```mermaid\nflowchart LR\n  A --> B\n```'),
    ).toBe('flowchart LR\n  A --> B');
  });

  it('strips a leading mermaid language line', () => {
    expect(
      normalizeMermaidSource('mermaid\nflowchart LR\n  A --> B'),
    ).toBe('flowchart LR\n  A --> B');
  });

  it('handles opening fence without closing fence', () => {
    expect(
      normalizeMermaidSource('```mermaid\nflowchart LR\n  A --> B'),
    ).toBe('flowchart LR\n  A --> B');
  });
});

describe('isMermaidSource', () => {
  it('detects plain mermaid diagrams', () => {
    expect(isMermaidSource('flowchart TD\n  A --> B')).toBe(true);
    expect(isMermaidSource('console.log("hi")')).toBe(false);
  });

  it('detects fenced and tagged mermaid blocks', () => {
    expect(isMermaidSource('```mermaid\nflowchart LR\n  A --> B\n```')).toBe(
      true,
    );
    expect(isMermaidSource('mermaid\nsequenceDiagram\n  A->>B: hi')).toBe(
      true,
    );
  });
});
