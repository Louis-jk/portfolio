export const STORY_VISIBILITY_BROADCAST_CHANNEL = 'portfolio:story-visibility';
export const STORY_VISIBILITY_BROADCAST_EVENT = 'visibility_changed';

export type StoryVisibilityBroadcastPayload = {
  projectId: number;
  isPublic: boolean;
};
