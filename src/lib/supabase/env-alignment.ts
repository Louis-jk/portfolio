/** Extract Supabase project ref from a Postgres connection string (postgres.REF:...). */
export function supabaseRefFromDatabaseUrl(databaseUrl: string): string | null {
  const match = databaseUrl.match(/postgres\.([a-z0-9]+):/i);
  return match?.[1] ?? null;
}

/** Extract Supabase project ref from https://REF.supabase.co */
export function supabaseRefFromPublicUrl(publicUrl: string): string | null {
  const match = publicUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match?.[1] ?? null;
}

export function describeSupabaseEnvMismatch(): string | null {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!databaseUrl || !publicUrl) return null;

  const dbRef = supabaseRefFromDatabaseUrl(databaseUrl);
  const apiRef = supabaseRefFromPublicUrl(publicUrl);
  if (!dbRef || !apiRef || dbRef === apiRef) return null;

  return (
    `Supabase project mismatch: DATABASE_URL uses "${dbRef}" but ` +
    `NEXT_PUBLIC_SUPABASE_URL uses "${apiRef}". Realtime and Storage will not ` +
    `see Prisma writes until both point at the same Supabase project (Settings → API).`
  );
}
