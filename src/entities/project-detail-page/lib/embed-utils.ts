const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;

const FENCED_CODE_RE = /^```([^\n`]*)\r?\n([\s\S]*?)\r?\n?```\s*$/;

const MERMAID_LANGUAGE_RE = /^mermaid$/i;

const MERMAID_DIAGRAM_RE =
  /^(graph[\s\t]|flowchart[\s\t]|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie[\s\t]|gitGraph|mindmap|timeline|quadrantChart|xychart|block-beta|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|sankey|requirementDiagram|architecture)/;

export function getYouTubeEmbedUrl(source: string): string | null {
  const match = source.match(YOUTUBE_ID_PATTERN);
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

/** Strip markdown fences and optional `mermaid` language lines from code block text. */
export function normalizeMermaidSource(code: string): string {
  let text = code.replace(/\r\n/g, '\n').trim();
  if (!text) return '';

  const fenced = FENCED_CODE_RE.exec(text);
  if (fenced) {
    text = fenced[2];
    if (text.endsWith('\n')) text = text.slice(0, -1);
  } else if (text.startsWith('```')) {
    const firstNewline = text.indexOf('\n');
    if (firstNewline !== -1) {
      text = text.slice(firstNewline + 1).replace(/\n?```\s*$/, '');
    }
  }

  const lines = text.split('\n');
  if (lines.length > 1 && MERMAID_LANGUAGE_RE.test(lines[0]?.trim() ?? '')) {
    text = lines.slice(1).join('\n');
  }

  return text.trim();
}

export function isMermaidSource(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;

  const fenceLanguage = /^```(\S*)/.exec(trimmed)?.[1]?.trim();
  if (fenceLanguage && MERMAID_LANGUAGE_RE.test(fenceLanguage)) {
    return true;
  }

  const normalized = normalizeMermaidSource(code);
  if (!normalized) return false;

  return MERMAID_DIAGRAM_RE.test(normalized);
}
