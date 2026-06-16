const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;

export function getYouTubeEmbedUrl(source: string): string | null {
  const match = source.match(YOUTUBE_ID_PATTERN);
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

export function isMermaidSource(code: string): boolean {
  const trimmed = code.trim();
  return /^(graph\s|flowchart\s|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie\s|gitGraph|mindmap|timeline|quadrantChart|xychart|block-beta)/.test(
    trimmed,
  );
}
