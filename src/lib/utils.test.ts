import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges tailwind classes and resolves conflicts', () => {
    const merged = cn('px-2 py-1', 'px-4');
    expect(merged).toContain('px-4');
    expect(merged).not.toContain('px-2');
  });

  it('drops falsy conditional classes', () => {
    expect(cn('base', false && 'hidden', 'block')).toBe('base block');
  });
});
