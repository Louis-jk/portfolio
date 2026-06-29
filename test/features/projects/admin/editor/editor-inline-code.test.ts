import { describe, expect, it } from 'vitest';
import { matchInlineCodeBeforeCursor } from '@/features/projects/admin/editor/editor-inline-code';

describe('matchInlineCodeBeforeCursor', () => {
  it('matches text wrapped by an opening backtick before cursor', () => {
    expect(matchInlineCodeBeforeCursor('`service')).toEqual({
      text: 'service',
      markerLength: 8,
    });
    expect(matchInlineCodeBeforeCursor('hello `fetch')).toEqual({
      text: 'fetch',
      markerLength: 6,
    });
  });

  it('ignores newlines and empty markers', () => {
    expect(matchInlineCodeBeforeCursor('`')).toBeNull();
    expect(matchInlineCodeBeforeCursor('``')).toBeNull();
    expect(matchInlineCodeBeforeCursor('`line\nbreak')).toBeNull();
  });
});
