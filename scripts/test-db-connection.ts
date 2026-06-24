import { config } from 'dotenv';
import path from 'path';
import pg from 'pg';

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local'), override: true });

async function main() {
  const url = process.env.DATABASE_URL ?? '';
  try {
    const parsed = new URL(url);
    console.log(
      JSON.stringify({
        ok: true,
        host: parsed.hostname,
        port: parsed.port,
        search: parsed.search,
      }),
    );
  } catch (error) {
    console.log('URL invalid:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  const result = await client.query('select count(*)::int as c from projects');
  console.log(JSON.stringify({ projects: result.rows[0]?.c }));
  await client.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
