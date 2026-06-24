import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

function parseEnv(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    map.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  return map;
}

function serializeEnv(
  original: string,
  updates: Record<string, string | null>,
): string {
  const lines = original.split('\n');
  const touched = new Set<string>();
  const next = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return line;
    const key = trimmed.slice(0, eq);
    if (!(key in updates)) return line;
    touched.add(key);
    const value = updates[key];
    if (value === null) return null;
    return `${key}=${value}`;
  }).filter((line): line is string => line !== null);

  for (const [key, value] of Object.entries(updates)) {
    if (touched.has(key) || value === null) continue;
    next.push(`${key}=${value}`);
  }

  return `${next.join('\n').replace(/\n*$/, '')}\n`;
}

const root = process.cwd();
const localPath = path.join(root, '.env.local');
const nestPath = path.join(root, '../portfolio-backend-nestjs/.env');

const local = readFileSync(localPath, 'utf-8');
const nest = parseEnv(readFileSync(nestPath, 'utf-8'));

const databaseUrl = nest.get('DATABASE_URL');
const directUrl = nest.get('DIRECT_URL');

if (!databaseUrl || !directUrl) {
  throw new Error('Nest .env is missing DATABASE_URL or DIRECT_URL');
}

const updated = serializeEnv(local, {
  DATABASE_URL: databaseUrl.replace(':5432/', ':6543/') + (databaseUrl.includes('pgbouncer') ? '' : '?pgbouncer=true'),
  DIRECT_URL: directUrl,
  API_URL: null,
});

writeFileSync(localPath, updated, 'utf-8');
console.log('Updated .env.local DATABASE_URL/DIRECT_URL to Nest JSONB database (ap-northeast-2).');
console.log('Removed API_URL (no longer used).');
