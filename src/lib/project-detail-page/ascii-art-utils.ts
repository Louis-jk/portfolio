/** Normalize fullwidth punctuation/spaces so ASCII diagrams keep column alignment. */
export function normalizeFixedWidthAscii(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u3000/g, ' ')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/[\u2502\u2503\u254e\u2551]/g, '|')
    .replace(/[\u2500-\u2501\u250a-\u250b\u2550]/g, '-')
    .replace(/[\u25B6\u25BA\u25C0\u25C4]/g, (char) =>
      char === '\u25B6' || char === '\u25BA' ? '>' : '<',
    )
    .replace(/[\uFF01-\uFF5E]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xff00 + 0x20),
    );
}
