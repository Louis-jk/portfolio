import { describe, expect, it } from 'vitest';
import { applyStoryVisibilityUpdate } from '@/entities/projects/lib/apply-story-visibility-update';
import { toProjectView } from '@/entities/projects/lib/projects.mapper';
import type { NestProjectDto } from '@/entities/projects/model/projects.types';

const dto: NestProjectDto = {
  id: 1,
  sortOrder: 0,
  imageUrl: 'https://example.com/image.png',
  startDate: '2023-01-15T00:00:00.000Z',
  endDate: null,
  isPublic: true,
  technologies: [],
  platformCategories: [],
  domainTags: [],
  title: { ko: '제목' },
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

function makeProject(id: number, storyIsPublic: boolean) {
  return { ...toProjectView({ ...dto, id }, 'ko'), storyIsPublic };
}

describe('applyStoryVisibilityUpdate', () => {
  it('updates storyIsPublic for the matching project', () => {
    const projects = [makeProject(1, true), makeProject(2, false)];
    const next = applyStoryVisibilityUpdate(projects, {
      projectId: 1,
      isPublic: false,
    });

    expect(next[0]?.storyIsPublic).toBe(false);
    expect(next[1]?.storyIsPublic).toBe(false);
    expect(next).not.toBe(projects);
  });

  it('returns the same array reference when nothing changes', () => {
    const projects = [makeProject(1, true)];
    const next = applyStoryVisibilityUpdate(projects, {
      projectId: 1,
      isPublic: true,
    });

    expect(next).toBe(projects);
  });

  it('leaves other projects unchanged', () => {
    const projects = [makeProject(1, false), makeProject(2, true)];
    const next = applyStoryVisibilityUpdate(projects, {
      projectId: 2,
      isPublic: false,
    });

    expect(next[0]?.storyIsPublic).toBe(false);
    expect(next[1]?.storyIsPublic).toBe(false);
  });
});
