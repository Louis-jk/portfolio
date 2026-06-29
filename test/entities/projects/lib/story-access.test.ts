import { describe, expect, it } from 'vitest';
import { canShowPublicStoryLink } from '@/entities/projects/lib/story-access';

describe('canShowPublicStoryLink', () => {
  it('returns true only when storyIsPublic is true', () => {
    expect(canShowPublicStoryLink({ storyIsPublic: true })).toBe(true);
    expect(canShowPublicStoryLink({ storyIsPublic: false })).toBe(false);
    expect(canShowPublicStoryLink(null)).toBe(false);
    expect(canShowPublicStoryLink(undefined)).toBe(false);
  });
});
