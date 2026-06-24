'use client';

import ProjectForm from './ProjectForm';
import type { ProjectFormValues } from '@/types/project-form.type';

export default function ProjectEditForm({
  projectId,
  initialData,
  locale,
}: {
  projectId: number;
  initialData: ProjectFormValues;
  locale: string;
}) {
  const defaultLocale =
    locale === 'ko' || locale === 'ja' || locale === 'en' ? locale : 'ko';

  return (
    <ProjectForm
      projectId={projectId}
      initialData={initialData}
      defaultLocale={defaultLocale}
    />
  );
}
