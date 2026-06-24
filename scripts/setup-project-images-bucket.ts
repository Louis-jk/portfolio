import { config } from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'project-images';

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local'), override: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Failed to list buckets:', listError.message);
    process.exit(1);
  }

  const existing = buckets?.find((bucket) => bucket.name === BUCKET);
  if (existing) {
    if (!existing.public) {
      const { error: updateError } = await supabase.storage.updateBucket(
        BUCKET,
        { public: true },
      );
      if (updateError) {
        console.error(
          `Failed to make bucket "${BUCKET}" public:`,
          updateError.message,
        );
        process.exit(1);
      }
      console.log(`✅ Updated storage bucket "${BUCKET}" to public.`);
      return;
    }

    console.log(`✅ Storage bucket "${BUCKET}" already exists (public).`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });

  if (createError) {
    console.error(`Failed to create bucket "${BUCKET}":`, createError.message);
    process.exit(1);
  }

  console.log(`✅ Created public storage bucket "${BUCKET}".`);
}

main().catch((error) => {
  console.error('Unexpected setup failure:', error);
  process.exit(1);
});
