const PLACEHOLDER_RE = /___NT_(\d+)___/g;

/** Shield code fences and pre/code markup from machine translation. */
export function protectNonTranslatableHtml(html: string): {
  html: string;
  segments: string[];
} {
  const segments: string[] = [];
  let protectedHtml = html;

  const stash = (match: string) => {
    const index = segments.push(match) - 1;
    return `___NT_${index}___`;
  };

  protectedHtml = protectedHtml.replace(/<pre[\s\S]*?<\/pre>/gi, stash);
  protectedHtml = protectedHtml.replace(/<code[\s\S]*?<\/code>/gi, stash);
  protectedHtml = protectedHtml.replace(/```[\s\S]*?```/g, stash);

  return { html: protectedHtml, segments };
}

export function restoreNonTranslatableHtml(
  html: string,
  segments: string[],
): string {
  return html.replace(
    PLACEHOLDER_RE,
    (_, index) => segments[Number(index)] ?? '',
  );
}
