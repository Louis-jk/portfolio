import 'server-only';
import { broadcastProjectCatalogChange } from '@/lib/supabase/broadcast-project-catalog';
import type { ProjectCatalogBroadcastPayload } from '@/lib/supabase/project-catalog-realtime';
import { describeSupabaseEnvMismatch } from '@/lib/supabase/env-alignment';

/** Best-effort Realtime broadcast; DB trigger is the fallback. */
export async function notifyProjectCatalogChange(
  payload: ProjectCatalogBroadcastPayload,
): Promise<void> {
  const envMismatch = describeSupabaseEnvMismatch();
  if (envMismatch) {
    console.warn(`[project-catalog] ${envMismatch}`);
    return;
  }

  try {
    await broadcastProjectCatalogChange(payload);
  } catch (error) {
    console.warn('[project-catalog] Broadcast failed:', error);
  }
}
