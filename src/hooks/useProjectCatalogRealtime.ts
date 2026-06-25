'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { ProjectCatalogChangeEvent } from '@/lib/supabase/project-catalog-realtime';
import {
  PROJECT_CATALOG_BROADCAST_CHANNEL,
  PROJECT_CATALOG_BROADCAST_EVENT,
  type ProjectCatalogBroadcastPayload,
} from '@/lib/supabase/project-catalog-realtime';

const PROJECT_CATALOG_SIGNALS_TABLE = 'project_catalog_signals';

export type ProjectCatalogChange = {
  projectId: number;
  event: ProjectCatalogChangeEvent;
};

function parseProjectId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function parseEvent(value: unknown): ProjectCatalogChangeEvent | null {
  if (value === 'upsert' || value === 'delete' || value === 'reorder') {
    return value;
  }
  return null;
}

function changeFromDbRecord(
  record: Record<string, unknown>,
  event: ProjectCatalogChangeEvent,
): ProjectCatalogChange | null {
  const projectId = parseProjectId(record.project_id);
  if (projectId == null) return null;
  return { projectId, event };
}

function changeFromBroadcastPayload(
  payload: unknown,
): ProjectCatalogChange | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as ProjectCatalogBroadcastPayload;
  const projectId = parseProjectId(data.projectId);
  const event = parseEvent(data.event);
  if (projectId == null || event == null) return null;
  return { projectId, event };
}

/**
 * Subscribes to `project_catalog_signals` postgres changes (no project JSONB exposed).
 */
export function useProjectCatalogRealtime(
  onCatalogChange: (change: ProjectCatalogChange) => void,
) {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!url || !key) return;

    const supabase = createClient();

    const channel = supabase
      .channel(PROJECT_CATALOG_BROADCAST_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: PROJECT_CATALOG_SIGNALS_TABLE,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const change = changeFromDbRecord(payload.old, 'delete');
            if (change) onCatalogChange(change);
            return;
          }

          const change = changeFromDbRecord(payload.new, 'upsert');
          if (change) onCatalogChange(change);
        },
      )
      .on(
        'broadcast',
        { event: PROJECT_CATALOG_BROADCAST_EVENT },
        ({ payload }) => {
          const change = changeFromBroadcastPayload(payload);
          if (change) onCatalogChange(change);
        },
      )
      .subscribe((status) => {
        if (process.env.NODE_ENV !== 'development') return;
        if (status === 'SUBSCRIBED') {
          console.info('[project-catalog] Realtime subscribed');
          return;
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn(
            `[project-catalog] Realtime ${status}. Check NEXT_PUBLIC_SUPABASE_URL matches DATABASE_URL project.`,
          );
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onCatalogChange]);
}
