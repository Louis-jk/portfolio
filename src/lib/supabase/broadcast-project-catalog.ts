import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import {
  PROJECT_CATALOG_BROADCAST_CHANNEL,
  PROJECT_CATALOG_BROADCAST_EVENT,
  type ProjectCatalogBroadcastPayload,
} from '@/lib/supabase/project-catalog-realtime';

/** Push project catalog changes to open portfolio tabs (Supabase Realtime Broadcast). */
export async function broadcastProjectCatalogChange(
  payload: ProjectCatalogBroadcastPayload,
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const channel = supabase.channel(PROJECT_CATALOG_BROADCAST_CHANNEL);

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      void supabase.removeChannel(channel);
      reject(new Error('Project catalog broadcast timed out'));
    }, 10_000);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const result = await channel.send({
            type: 'broadcast',
            event: PROJECT_CATALOG_BROADCAST_EVENT,
            payload,
          });
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          if (result !== 'ok') {
            reject(new Error('Project catalog broadcast failed'));
            return;
          }
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          reject(error);
        }
        return;
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timeout);
        void supabase.removeChannel(channel);
        reject(new Error(`Project catalog broadcast channel: ${status}`));
      }
    });
  });
}
