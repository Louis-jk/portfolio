const PLACEHOLDER_MARK = '___NT';

function createPlaceholderPrefix(): string {
  return `${PLACEHOLDER_MARK}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}_`;
}

function buildPlaceholderRegex(prefix: string): RegExp {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}(\\d+)___`, 'g');
}

/** Shield code fences and pre/code markup from machine translation. */
export function protectNonTranslatableHtml(html: string): {
  html: string;
  segments: string[];
  placeholderPrefix: string;
} {
  const segments: string[] = [];
  const placeholderPrefix = createPlaceholderPrefix();
  let protectedHtml = html;

  const stash = (match: string) => {
    const index = segments.push(match) - 1;
    return `${placeholderPrefix}${index}___`;
  };

  protectedHtml = protectedHtml.replace(/<pre[\s\S]*?<\/pre>/gi, stash);
  protectedHtml = protectedHtml.replace(/<code[\s\S]*?<\/code>/gi, stash);
  protectedHtml = protectedHtml.replace(/```[\s\S]*?```/g, stash);

  return { html: protectedHtml, segments, placeholderPrefix };
}

export function restoreNonTranslatableHtml(
  html: string,
  segments: string[],
  placeholderPrefix: string,
): string {
  return html.replace(
    buildPlaceholderRegex(placeholderPrefix),
    (_, index) => segments[Number(index)] ?? '',
  );
}
