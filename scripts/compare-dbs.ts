import { config } from 'dotenv';
import path from 'path';
import pg from 'pg';

async function inspect(label: string, envPath: string) {
  config({ path: envPath, override: true });
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.log(`${label}: no DATABASE_URL`);
    return;
  }

  const host = url.match(/@([^:/]+)/)?.[1] ?? 'unknown';
  const client = new pg.Client({ connectionString: url });

  try {
    await client.connect();
    const projects = await client.query(
      'select count(*)::int as c from projects',
    );
    const pages = await client.query(
      'select count(*)::int as c from project_detail_pages',
    );
    const publicStories = await client.query(
      'select count(*)::int as c from project_detail_pages where is_public = true',
    );
    const latest = await client.query(
      "select id, updated_at, title->>'ko' as title_ko from projects order by updated_at desc limit 1",
    );

    console.log(
      JSON.stringify(
        {
          label,
          host,
          projects: projects.rows[0]?.c ?? 0,
          detailPages: pages.rows[0]?.c ?? 0,
          publicStories: publicStories.rows[0]?.c ?? 0,
          latest: latest.rows[0] ?? null,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.log(
      `${label} (${host}):`,
      error instanceof Error ? error.message : error,
    );
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function main() {
  const root = process.cwd();
  await inspect('portfolio', path.join(root, '.env.local'));
  await inspect('nest', path.join(root, '../portfolio-backend-nestjs/.env'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
