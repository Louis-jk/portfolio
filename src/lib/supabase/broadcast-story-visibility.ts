import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  STORY_VISIBILITY_BROADCAST_CHANNEL,
  STORY_VISIBILITY_BROADCAST_EVENT,
  type StoryVisibilityBroadcastPayload,
} from '@/lib/supabase/story-visibility-realtime';

export type { StoryVisibilityBroadcastPayload };

/** Push story visibility to open portfolio tabs (Supabase Realtime Broadcast). */
export async function broadcastStoryVisibilityChange(
  payload: StoryVisibilityBroadcastPayload,
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const channel = supabase.channel(STORY_VISIBILITY_BROADCAST_CHANNEL);

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      void supabase.removeChannel(channel);
      reject(new Error('Story visibility broadcast timed out'));
    }, 10_000);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          const result = await channel.send({
            type: 'broadcast',
            event: STORY_VISIBILITY_BROADCAST_EVENT,
            payload,
          });
          clearTimeout(timeout);
          await supabase.removeChannel(channel);
          if (result !== 'ok') {
            reject(new Error('Story visibility broadcast failed'));
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
        reject(new Error(`Story visibility broadcast channel: ${status}`));
      }
    });
  });
}
