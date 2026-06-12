import { describe, expect, it } from 'vitest';
import { formatProjectDateRange } from './format-date';
import { readI18n, toProjectView } from './projects.mapper';
import type { NestProjectDto } from './projects.types';

const dto: NestProjectDto = {
  id: 1,
  sortOrder: 0,
  imageUrl: 'https://example.com/image.png',
  startDate: '2023-01-15T00:00:00.000Z',
  endDate: '2024-06-01T00:00:00.000Z',
  isPublic: true,
  technologies: ['TypeScript'],
  platformCategories: [],
  domainTags: [],
  title: { ko: '한국어 제목', en: 'English Title' },
  company: { ko: '회사' },
  region: { ko: '서울' },
  role: { ko: '개발' },
  overview: { ko: '개요' },
  description: { ko: ['설명'] },
  challenges: { ko: ['과제'] },
  achievements: { ko: ['성과'] },
  platforms: {},
  tools: {},
  createdAt: '2023-01-15T00:00:00.000Z',
  updatedAt: '2023-01-15T00:00:00.000Z',
};

describe('projects.mapper', () => {
  it('reads i18n with ko fallback', () => {
    expect(readI18n(dto.title, 'ja')).toBe('한국어 제목');
    expect(readI18n(dto.title, 'en')).toBe('English Title');
  });

  it('maps dto to locale-resolved project view', () => {
    const project = toProjectView(dto, 'en');

    expect(project.title).toBe('English Title');
    expect(project.locale).toBe('en');
    expect(project.description).toEqual(['설명']);
  });

  it('formats date range by locale', () => {
    const project = toProjectView(dto, 'ko');

    expect(formatProjectDateRange(project, 'en')).toContain('2023');
    expect(formatProjectDateRange(project, 'ko')).toContain('2023.01');
  });
});
