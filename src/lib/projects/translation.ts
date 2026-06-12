import { format } from 'date-fns';
import type { ProjectTranslation } from '@/generated/prisma/client';

const FALLBACK_LOCALE = 'ko';

type TranslatableProject = {
  translations: ProjectTranslation[];
};

type DatedProject = {
  startDate: Date;
  endDate?: Date | null;
};

function emptyProjectTranslation(locale: string): ProjectTranslation {
  return {
    id: 0,
    projectId: 0,
    locale,
    title: 'Untitled',
    company: '',
    region: '',
    role: '',
    overview: '',
    description: [],
    challenges: [],
    achievements: [],
    detailImage: null,
  };
}

export function getProjectTranslation(
  project: TranslatableProject,
  locale: string,
): ProjectTranslation {
  return (
    project.translations.find((translation) => translation.locale === locale) ??
    project.translations.find(
      (translation) => translation.locale === FALLBACK_LOCALE,
    ) ??
    project.translations[0] ??
    emptyProjectTranslation(locale)
  );
}

export function getProjectTitle(
  project: TranslatableProject,
  locale: string,
): string {
  return getProjectTranslation(project, locale).title;
}

export function formatProjectDateRange(
  project: DatedProject,
  locale: string,
): string {
  const dateFormat = locale === 'en' ? 'MMM yyyy' : 'yyyy.MM';
  const end = project.endDate
    ? format(project.endDate, dateFormat)
    : 'PRESENT';
  return `${format(project.startDate, dateFormat)} ~ ${end}`;
}
