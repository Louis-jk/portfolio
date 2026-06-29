import { format } from 'date-fns';

type DatedProject = {
  startDate: Date;
  endDate?: Date | null;
};

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
