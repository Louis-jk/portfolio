import { config } from 'dotenv';
import path from 'path';
import { describeSupabaseEnvMismatch } from '../src/lib/supabase/env-alignment';

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local'), override: true });

const mismatch = describeSupabaseEnvMismatch();
if (mismatch) {
  console.error(`\n❌ ${mismatch}\n`);
  process.exit(1);
}

console.log('✅ DATABASE_URL and NEXT_PUBLIC_SUPABASE_URL reference the same Supabase project.');
