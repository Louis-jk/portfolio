import { describe, expect, it } from 'vitest';
import {
  supabaseRefFromDatabaseUrl,
  supabaseRefFromPublicUrl,
  describeSupabaseEnvMismatch,
} from './env-alignment';

describe('supabase env alignment', () => {
  it('parses project refs from urls', () => {
    expect(
      supabaseRefFromDatabaseUrl(
        'postgresql://postgres.bobnchsbicwahsciexyq:pw@host:5432/postgres',
      ),
    ).toBe('bobnchsbicwahsciexyq');
    expect(
      supabaseRefFromPublicUrl('https://uijrvmruzgoabzutboeo.supabase.co'),
    ).toBe('uijrvmruzgoabzutboeo');
  });

  it('reports mismatch between database and public supabase url', () => {
    const prevDb = process.env.DATABASE_URL;
    const prevPublic = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.DATABASE_URL =
      'postgresql://postgres.bobnchsbicwahsciexyq:pw@host:5432/postgres';
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      'https://uijrvmruzgoabzutboeo.supabase.co';

    expect(describeSupabaseEnvMismatch()).toContain('bobnchsbicwahsciexyq');
    expect(describeSupabaseEnvMismatch()).toContain('uijrvmruzgoabzutboeo');

    process.env.DATABASE_URL = prevDb;
    process.env.NEXT_PUBLIC_SUPABASE_URL = prevPublic;
  });
});
