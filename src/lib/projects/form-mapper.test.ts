import { describe, expect, it } from 'vitest';
import { mapAllFormTranslations, mapTranslation } from '@/lib/projects/form-mapper';

describe('form-mapper', () => {
  it('maps translation fields with defaults', () => {
    const mapped = mapTranslation('ko', {
      title: 'Title',
      description: ['line'],
    });

    expect(mapped).toMatchObject({
      locale: 'ko',
      title: 'Title',
      description: ['line'],
      challenges: [],
      detailImage: null,
    });
  });

  it('maps all locales from form translations', () => {
    const result = mapAllFormTranslations({
      ko: { title: 'KO' },
      ja: { title: 'JA' },
      en: { title: 'EN' },
    });

    expect(result).toHaveLength(3);
    expect(result.map((row) => row.title)).toEqual(['KO', 'JA', 'EN']);
  });
});
