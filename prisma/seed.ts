import { config } from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import { projectsData } from './seed-data/projects.data';
import type { ProjectSeedItem } from './seed-data/projects.type';

const emptyTools: NonNullable<NonNullable<ProjectSeedItem['details']>['tools']> = {
  development: [],
  communication: [],
  design: [],
  debugging: [],
};

// Load .env then .env.local (Next.js convention, .env.local overrides)
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
    /(\d{4})\.(\d{1,2})\s*-\s*(\d{4})\.(\d{1,2})/
  );
  if (rangeMatch) {
    const [, sy, sm, ey, em] = rangeMatch;
    return {
      startDate: new Date(parseInt(sy!), parseInt(sm!) - 1, 1),
      endDate: new Date(parseInt(ey!), parseInt(em!) - 1, 28),
    };
  }
  const monthNames: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const monthMatch = normalized.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})\s*-\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})/
  );
  if (monthMatch) {
    const [, sm, sy, em, ey] = monthMatch;
    const startDate = new Date(parseInt(sy!), monthNames[sm!], 1);
    const endDate = new Date(parseInt(ey!), monthNames[em!], 28);
    return { startDate, endDate };
  }
  const singleMatch = normalized.match(/(\d{4})\.(\d{1,2})/);
  if (singleMatch) {
    const [, y, m] = singleMatch;
    const d = new Date(parseInt(y!), parseInt(m) - 1, 1);
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

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env or .env.local and ensure the database is running.'
    );
  }

  const messagesDir = path.join(process.cwd(), 'messages');
  const ko = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'ko.json'), 'utf-8')
  );
  const en = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8')
  );
  const ja = JSON.parse(
    fs.readFileSync(path.join(messagesDir, 'ja.json'), 'utf-8')
  );

  // Clear existing projects (cascade will remove translations, platforms, tools)
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

    // Technologies: from projects.data only (not mixed with tools)
    const technologies = item.details?.technologies ?? ['React', 'TypeScript'];

    // Tools: Development, Communication, Design, Debugging - from projects.data
    const toolsData = item.details?.tools ?? emptyTools;
    const hasTools =
      (toolsData.development?.length ?? 0) > 0 ||
      (toolsData.communication?.length ?? 0) > 0 ||
      (toolsData.design?.length ?? 0) > 0 ||
      (toolsData.debugging?.length ?? 0) > 0;

    // Platforms: web, ios, android, desktop links from commercialLinks
    const links = item.commercialLinks ?? {};
    const hasPlatforms =
      !!links.web || !!links.ios || !!links.android || !!links.desktop;

    const translations = [
      { locale: 'ko' as const, project: koProj },
      { locale: 'en' as const, project: enProj || koProj },
      { locale: 'ja' as const, project: jaProj || koProj },
    ];

    await prisma.project.create({
      data: {
        sortOrder: i,
        imageUrl: item.thumbnail || '/images/placeholder-project.png',
        startDate,
        endDate,
        isPublic: true,
        technologies,
        platforms: hasPlatforms
          ? {
              create: {
                webLink: links.web || null,
                iosLink: links.ios || null,
                androidLink: links.android || null,
                desktopLink: links.desktop || null,
              },
            }
          : undefined,
        tools: hasTools
          ? {
              create: {
                development: toolsData.development ?? [],
                communication: toolsData.communication ?? [],
                design: toolsData.design ?? [],
                debugging: toolsData.debugging ?? [],
              },
            }
          : undefined,
        translations: {
          create: translations.map(({ locale, project }) => ({
            locale,
            title: project.title,
            company: project.company || '',
            region: project.region || '',
            role: project.role?.replace(/\\n/g, '\n') || '',
            overview:
              project.details?.overview || project.description?.join('\n') || '',
            description: project.description ?? [],
            challenges: project.details?.challenges ?? [],
            achievements: project.details?.achievements ?? [],
          })),
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
