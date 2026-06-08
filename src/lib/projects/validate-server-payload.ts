import {
  parseProjectServerPayload,
  type projectServerSchema,
} from '@/schemas/projectSchema';
import type { z } from 'zod';

export type ParsedProjectServerPayload = z.infer<typeof projectServerSchema>;

export function validateProjectServerPayload(
  data: unknown,
):
  | { success: true; data: ParsedProjectServerPayload }
  | { success: false; error: string } {
  const result = parseProjectServerPayload(data);
  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? 'Invalid project payload';
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
