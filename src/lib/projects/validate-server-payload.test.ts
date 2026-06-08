import { describe, expect, it } from 'vitest';
import { validateProjectServerPayload } from '@/lib/projects/validate-server-payload';

const validPayload = {
  imageUrl: 'https://example.com/image.png',
  startDate: '2024-01-01',
  technologies: ['react'],
  platforms: { webLink: '' },
  translations: {
    ko: { title: '제목' },
  },
};

describe('validateProjectServerPayload', () => {
  it('accepts a valid payload', () => {
    const result = validateProjectServerPayload(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects missing imageUrl', () => {
    const result = validateProjectServerPayload({
      ...validPayload,
      imageUrl: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
