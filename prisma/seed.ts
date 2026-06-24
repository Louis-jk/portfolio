import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import { projectsData } from './seed-data/projects.data';
import type { ProjectSeedItem } from './seed-data/projects.type';
import type { ProjectLocale } from '../src/modules/projects/projects.types';

const LOCALES: ProjectLocale[] = ['ko', 'ja', 'en'];

const emptyTools: NonNullable<NonNullable<ProjectSeedItem['details']>['tools']> = {
  development: [],
  communication: [],
  design: [],
  debugging: [],
};

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local') });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

type MessageProject = {
  title: string;
  date: string;
  company: string;
  region: string;
  role: string;
  description: string[];
  details?: {
    overview?: string;
    challenges?: string[];
    achievements?: string[];
  };
};

function parseDate(dateStr: string): { startDate: Date; endDate: Date | null } {
  const normalized = dateStr.toLowerCase().trim();
  const rangeMatch = normalized.match(
    /(\d{4})\.(\d{1,2})\s*-\s*(\d{4})\.(\d{1,2})/,
  );
  if (rangeMatch) {
    const [, sy, sm, ey, em] = rangeMatch;
    return {
      startDate: new Date(parseInt(sy!, 10), parseInt(sm!, 10) - 1, 1),
      endDate: new Date(parseInt(ey!, 10), parseInt(em!, 10) - 1, 28),
    };
  }
  const monthNames: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const monthMatch = normalized.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})\s*-\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})/,
  );
  if (monthMatch) {
    const [, sm, sy, em, ey] = monthMatch;
    const startDate = new Date(parseInt(sy!, 10), monthNames[sm!]!, 1);
    const endDate = new Date(parseInt(ey!, 10), monthNames[em!]!, 28);
    return { startDate, endDate };
  }
  const singleMatch = normalized.match(/(\d{4})\.(\d{1,2})/);
  if (singleMatch) {
    const [, y, m] = singleMatch;
    const d = new Date(parseInt(y!, 10), parseInt(m!, 10) - 1, 1);
    return { startDate: d, endDate: d };
  }
  return {
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2025, 11, 31),
  };
}

function getByPath(obj: unknown, pathStr: string): unknown {
  const parts = pathStr.split('.');
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[p];
  }
  return current;
}

function toI18nString(
  values: Partial<Record<ProjectLocale, string>>,
): Record<ProjectLocale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, values[locale] ?? '']),
  ) as Record<ProjectLocale, string>;
}

function toI18nStringArray(
  values: Partial<Record<ProjectLocale, string[]>>,
): Record<ProjectLocale, string[]> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, values[locale] ?? []]),
  ) as Record<ProjectLocale, string[]>;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env or .env.local and ensure the database is running.',
    );
  }

  if (process.env.SEED_CONFIRM !== 'yes') {
    throw new Error(
      'Refusing to seed: this deletes all projects. Re-run with SEED_CONFIRM=yes if intentional.',
    );
  }

  const messagesDir = path.join(process.cwd(), 'messages');
  const ko = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf-8'),
  );
  const en = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8'),
  );
  const ja = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'ja.json'), 'utf-8'),
  );

  await prisma.project.deleteMany({});
  console.log('Cleared existing projects.\n');

  for (let i = 0; i < projectsData.length; i++) {
    const item = projectsData[i];
    const projectKey = item.id.replace(/^projects\./, '');
    const msgPath = `projects.items.${projectKey}`;

    const koProj = getByPath(ko, msgPath) as MessageProject | undefined;
    const enProj = getByPath(en, msgPath) as MessageProject | undefined;
    const jaProj = getByPath(ja, msgPath) as MessageProject | undefined;

    if (!koProj) {
      console.warn(`⚠ Skipped ${projectKey}: no messages found`);
      continue;
    }

    const { startDate, endDate } = parseDate(koProj.date);
    const technologies = item.details?.technologies ?? ['React', 'TypeScript'];
    const toolsData = item.details?.tools ?? emptyTools;
    const links = item.commercialLinks ?? {};

    const translations = {
      ko: koProj,
      en: enProj ?? koProj,
      ja: jaProj ?? koProj,
    };

    await prisma.project.create({
      data: {
        sortOrder: i,
        imageUrl: item.thumbnail || '/images/placeholder-project.png',
        startDate,
        endDate,
        isPublic: true,
        technologies,
        platformCategories: [],
        domainTags: [],
        title: toI18nString(
          Object.fromEntries(
            LOCALES.map((locale) => [locale, translations[locale].title]),
          ) as Partial<Record<ProjectLocale, string>>,
        ),
        company: toI18nString(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].company || '',
            ]),
          ) as Partial<Record<ProjectLocale, string>>,
        ),
        region: toI18nString(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].region || '',
            ]),
          ) as Partial<Record<ProjectLocale, string>>,
        ),
        role: toI18nString(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].role?.replace(/\\n/g, '\n') || '',
            ]),
          ) as Partial<Record<ProjectLocale, string>>,
        ),
        overview: toI18nString(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].details?.overview ||
                translations[locale].description?.join('\n') ||
                '',
            ]),
          ) as Partial<Record<ProjectLocale, string>>,
        ),
        description: toI18nStringArray(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].description ?? [],
            ]),
          ) as Partial<Record<ProjectLocale, string[]>>,
        ),
        challenges: toI18nStringArray(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].details?.challenges ?? [],
            ]),
          ) as Partial<Record<ProjectLocale, string[]>>,
        ),
        achievements: toI18nStringArray(
          Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              translations[locale].details?.achievements ?? [],
            ]),
          ) as Partial<Record<ProjectLocale, string[]>>,
        ),
        platforms: {
          webLink: links.web || null,
          iosLink: links.ios || null,
          androidLink: links.android || null,
          desktopLink: links.desktop || null,
        },
        tools: {
          development: toolsData.development ?? [],
          communication: toolsData.communication ?? [],
          design: toolsData.design ?? [],
          debugging: toolsData.debugging ?? [],
        },
      },
    });

    console.log(`✓ Created: ${koProj.title}`);
  }

  console.log(`\n✅ Seeded ${projectsData.length} projects successfully.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
