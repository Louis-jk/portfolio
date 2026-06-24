'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { StoryVisibilityChange } from '@/lib/projects/apply-story-visibility-update';
import {
  STORY_VISIBILITY_BROADCAST_CHANNEL,
  STORY_VISIBILITY_BROADCAST_EVENT,
  type StoryVisibilityBroadcastPayload,
} from '@/lib/supabase/story-visibility-realtime';

const STORY_VISIBILITY_TABLE = 'story_visibility';

function toChange(
  projectId: number,
  isPublic: boolean,
): StoryVisibilityChange {
  return { projectId, isPublic };
}

function parseProjectId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function parseIsPublic(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function changeFromDbRecord(
  record: Record<string, unknown>,
  fallbackIsPublic: boolean,
): StoryVisibilityChange | null {
  const projectId = parseProjectId(record.project_id);
  const isPublic = parseIsPublic(record.is_public) ?? fallbackIsPublic;
  if (projectId == null) return null;
  return toChange(projectId, isPublic);
}

function changeFromBroadcastPayload(
  payload: unknown,
): StoryVisibilityChange | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as StoryVisibilityBroadcastPayload;
  const projectId = parseProjectId(data.projectId);
  const isPublic = parseIsPublic(data.isPublic);
  if (projectId == null || isPublic == null) return null;
  return toChange(projectId, isPublic);
}

/**
 * Subscribes to `story_visibility` postgres changes (no story JSONB exposed).
 * Requires NEXT_PUBLIC_SUPABASE_* to point at the same Supabase project as DATABASE_URL.
 */
export function useStoryVisibilityRealtime(
  onVisibilityChange: (change: StoryVisibilityChange) => void,
) {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!url || !key) return;

    const supabase = createClient();

    const channel = supabase
      .channel(STORY_VISIBILITY_BROADCAST_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: STORY_VISIBILITY_TABLE,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const change = changeFromDbRecord(payload.old, false);
            if (change) onVisibilityChange(change);
            return;
          }

          const change = changeFromDbRecord(payload.new, false);
          if (change) onVisibilityChange(change);
        },
      )
      .on(
        'broadcast',
        { event: STORY_VISIBILITY_BROADCAST_EVENT },
        ({ payload }) => {
          const change = changeFromBroadcastPayload(payload);
          if (change) onVisibilityChange(change);
        },
      )
      .subscribe((status) => {
        if (process.env.NODE_ENV !== 'development') return;
        if (status === 'SUBSCRIBED') {
          console.info('[story-visibility] Realtime subscribed');
          return;
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn(
            `[story-visibility] Realtime ${status}. Check NEXT_PUBLIC_SUPABASE_URL matches DATABASE_URL project.`,
          );
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onVisibilityChange]);
}
