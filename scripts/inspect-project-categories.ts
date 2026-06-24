import { config } from 'dotenv';
import path from 'path';
import pg from 'pg';

async function inspect(label: string, url: string | undefined) {
  if (!url) {
    console.log(`${label}: no url`);
    return;
  }

  const host = url.match(/@([^:/]+)/)?.[1] ?? 'unknown';
  const client = new pg.Client({ connectionString: url });

  try {
    await client.connect();

    const tables = await client.query(`
      select table_name from information_schema.tables
      where table_schema = 'public'
        and table_name in ('Project', 'ProjectTranslation', 'projects', 'project_detail_pages')
      order by table_name
    `);

    let projectStats: Record<string, unknown> | null = null;
    let samples: unknown[] = [];

    if (tables.rows.some((r) => r.table_name === 'projects')) {
      const summary = await client.query(`
        select
          count(*)::int as total,
          count(*) filter (where cardinality(platform_categories) > 0)::int as with_platform,
          count(*) filter (where cardinality(domain_tags) > 0)::int as with_domain
        from projects
      `);
      const rows = await client.query(`
        select id, title->>'ko' as title_ko, platform_categories, domain_tags, sort_order, updated_at
        from projects order by sort_order asc limit 5
      `);
      projectStats = summary.rows[0];
      samples = rows.rows;
    }

    if (tables.rows.some((r) => r.table_name === 'Project')) {
      const legacyCount = await client.query('select count(*)::int as c from "Project"');
      projectStats = { legacyProjectCount: legacyCount.rows[0]?.c };
    }

    console.log(
      JSON.stringify(
        { label, host, tables: tables.rows.map((r) => r.table_name), projectStats, samples },
        null,
        2,
      ),
    );
  } catch (error) {
    console.log(`${label} (${host}):`, error instanceof Error ? error.message : error);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function main() {
  const root = process.cwd();

  config({ path: path.join(root, '.env') });
  config({ path: path.join(root, '.env.local'), override: true });
  await inspect('portfolio-env', process.env.DIRECT_URL ?? process.env.DATABASE_URL);

  config({ path: path.join(root, '../portfolio-backend-nestjs/.env'), override: true });
  await inspect('nest-env', process.env.DIRECT_URL ?? process.env.DATABASE_URL);
  await inspect('legacy-southeast', process.env.LEGACY_DIRECT_URL ?? process.env.LEGACY_DATABASE_URL);
}

main().catch(console.error);
