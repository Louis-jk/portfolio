import { describe, expect, it } from 'vitest';

import {
  buildProjectServerPayload,
  projectSchema,
} from '@/schemas/projectSchema';

const minimalValid = {
  imageUrl: 'https://example.com/image.png',
  startDate: '2024-01-01',
  technologies: ['react'],
  platforms: {
    webLink: '',
    iosLink: '',
    androidLink: '',
    desktopLink: '',
  },
  translations: {
    ko: { title: '제목', role: '역할', overview: '개요' },
    ja: { title: 'タイトル', role: '役割', overview: '概要' },
    en: { title: 'Title', role: 'Role', overview: 'Overview' },
  },
};

describe('projectSchema', () => {
  it('parses a minimal valid payload', () => {
    const result = projectSchema.safeParse(minimalValid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublic).toBe(false);
    }
  });

  it('rejects empty imageUrl', () => {
    const result = projectSchema.safeParse({
      ...minimalValid,
      imageUrl: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty Korean title', () => {
    const result = projectSchema.safeParse({
      ...minimalValid,
      translations: {
        ...minimalValid.translations,
        ko: { title: '', role: 'r', overview: 'o' },
      },
    });
    expect(result.success).toBe(false);
  });

  it('builds server payload from form values', () => {
    const payload = buildProjectServerPayload(
      {
        imageUrl: '',
        startDate: '2024-02-01',
        endDate: '',
        isPublic: true,
        technologies: 'React, TypeScript',
        tools: {
          development: 'VS Code',
          communication: '',
          design: '',
          debugging: '',
        },
        platformCategories: ['web'],
        domainTags: ['ai'],
        platforms: {
          webLink: 'https://example.com',
          iosLink: '',
          androidLink: '',
          desktopLink: '',
        },
        translations: {
          ko: {
            title: 'KO',
            role: '',
            overview: '',
            region: '',
            company: '',
            description: [{ value: 'desc' }],
            challenges: [{ value: '' }],
            achievements: [{ value: '' }],
            detailImage: '',
          },
          ja: {
            title: 'JA',
            role: '',
            overview: '',
            region: '',
            company: '',
            description: [{ value: '' }],
            challenges: [{ value: '' }],
            achievements: [{ value: '' }],
            detailImage: '',
          },
          en: {
            title: 'EN',
            role: '',
            overview: '',
            region: '',
            company: '',
            description: [{ value: '' }],
            challenges: [{ value: '' }],
            achievements: [{ value: '' }],
            detailImage: '',
          },
        },
      },
      'https://cdn.example.com/cover.png',
    );

    expect(payload.imageUrl).toBe('https://cdn.example.com/cover.png');
    expect(payload.technologies).toEqual(['React', 'TypeScript']);
    expect(payload.translations?.ko?.description).toEqual(['desc']);
  });
});
