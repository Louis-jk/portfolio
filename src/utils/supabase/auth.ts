import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server Action에서 인증 확인.
 * 세션이 있으면 Supabase 클라이언트 반환, 없으면 null.
 * getClaims()로 JWT 검증 (스푸핑 방지)
 */
export async function requireAuth(): Promise<{
  supabase: SupabaseClient;
  authorized: true;
} | { authorized: false }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return { authorized: false };
  }

  return { supabase, authorized: true };
}
