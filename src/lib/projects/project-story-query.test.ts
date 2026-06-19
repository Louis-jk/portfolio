import { describe, expect, it } from 'vitest';
import { projectStoryQueryKey } from './project-story-query';

describe('projectStoryQueryKey', () => {
  it('includes project id', () => {
    expect(projectStoryQueryKey(42)).toEqual(['project-story', 42]);
  });
});
