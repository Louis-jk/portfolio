import { describe, expect, it } from 'vitest';
import {
  formatProjectDateRange,
  getProjectTitle,
  getProjectTranslation,
} from '@/lib/projects/translation';

const project = {
  startDate: new Date('2023-01-15'),
  endDate: new Date('2024-06-01'),
  translations: [
    {
      locale: 'ko',
      title: '한국어 제목',
      company: '',
      region: '',
      role: '',
      overview: '',
      description: [],
      challenges: [],
      achievements: [],
      detailImage: null,
      projectId: 1,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      locale: 'en',
      title: 'English Title',
      company: '',
      region: '',
      role: '',
      overview: '',
      description: [],
      challenges: [],
      achievements: [],
      detailImage: null,
      projectId: 1,
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

describe('project translation helpers', () => {
  it('returns locale-specific title with ko fallback', () => {
    expect(getProjectTitle(project, 'ja')).toBe('한국어 제목');
    expect(getProjectTitle(project, 'en')).toBe('English Title');
  });

  it('picks requested translation or falls back', () => {
    expect(getProjectTranslation(project, 'en').locale).toBe('en');
    expect(getProjectTranslation(project, 'ja').locale).toBe('ko');
  });

  it('formats date range by locale', () => {
    expect(formatProjectDateRange(project, 'en')).toContain('2023');
    expect(formatProjectDateRange(project, 'ko')).toContain('2023.01');
  });
});
