import type { ProjectFormValues } from '@/types/project-form.type';

const MAX_PREVIEW_DATA_URL_LENGTH = 700_000;

export type StoredProjectDraft = {
  formValues: ProjectFormValues;
  previewUrl?: string;
  savedAt: number;
};

function getStorageKey(projectId?: number) {
  return projectId
    ? `portfolio-project-draft-${projectId}`
    : 'portfolio-project-draft-new';
}

function hasNonEmptyLines(items: { value: string }[]) {
  return items.some((item) => item.value?.trim());
}

function hasMeaningfulContent(values: ProjectFormValues): boolean {
  if (values.startDate?.trim() || values.endDate?.trim()) return true;
  if (values.technologies?.trim()) return true;
  if (values.platformCategories?.length || values.domainTags?.length) return true;

  const toolFields = Object.values(values.tools ?? {});
  if (toolFields.some((field) => field?.trim())) return true;

  const platformLinks = Object.values(values.platforms ?? {});
  if (platformLinks.some((link) => link?.trim())) return true;

  for (const locale of ['ko', 'ja', 'en'] as const) {
    const t = values.translations[locale];
    if (
      t.title?.trim() ||
      t.overview?.trim() ||
      t.role?.trim() ||
      t.company?.trim() ||
      t.region?.trim() ||
      t.detailImage?.trim() ||
      hasNonEmptyLines(t.description) ||
      hasNonEmptyLines(t.challenges) ||
      hasNonEmptyLines(t.achievements)
    ) {
      return true;
    }
  }

  return false;
}

export function saveProjectFormDraft(
  projectId: number | undefined,
  formValues: ProjectFormValues,
  previewUrl: string,
) {
  if (typeof window === 'undefined') return;
  if (!hasMeaningfulContent(formValues) && !previewUrl) return;

  let storedPreview: string | undefined;
  if (
    previewUrl.startsWith('data:') &&
    previewUrl.length <= MAX_PREVIEW_DATA_URL_LENGTH
  ) {
    storedPreview = previewUrl;
  } else if (previewUrl && !previewUrl.startsWith('data:')) {
    storedPreview = previewUrl;
  }

  const draft: StoredProjectDraft = {
    formValues,
    previewUrl: storedPreview,
    savedAt: Date.now(),
  };

  try {
    localStorage.setItem(getStorageKey(projectId), JSON.stringify(draft));
  } catch (error) {
    console.warn('Project draft save failed (storage full?):', error);
    try {
      localStorage.setItem(
        getStorageKey(projectId),
        JSON.stringify({
          formValues: draft.formValues,
          savedAt: draft.savedAt,
        }),
      );
    } catch {
      // ignore
    }
  }
}

export function loadProjectFormDraft(
  projectId?: number,
): StoredProjectDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getStorageKey(projectId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProjectDraft;
    if (!parsed?.formValues) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearProjectFormDraft(projectId?: number) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(projectId));
}
