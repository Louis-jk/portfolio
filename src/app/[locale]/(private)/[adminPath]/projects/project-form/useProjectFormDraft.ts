'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormGetValues, UseFormReset } from 'react-hook-form';
import {
  clearProjectFormDraft,
  loadProjectFormDraft,
  saveProjectFormDraft,
} from '@/lib/project-form-draft';
import type { ProjectFormValues } from '@/types/project-form.type';

type UseProjectFormDraftArgs = {
  projectId?: number;
  initialData?: ProjectFormValues;
  getValues: UseFormGetValues<ProjectFormValues>;
  reset: UseFormReset<ProjectFormValues>;
  watch: (
    callback?: (data: ProjectFormValues) => void,
  ) => { unsubscribe: () => void };
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  setSelectedFile: (file: File | null) => void;
  setImageRemoved: (removed: boolean) => void;
};

export function useProjectFormDraft({
  projectId,
  initialData,
  getValues,
  reset,
  watch,
  previewUrl,
  setPreviewUrl,
  setSelectedFile,
  setImageRemoved,
}: UseProjectFormDraftArgs) {
  const [draftRestored, setDraftRestored] = useState(false);
  const saveDraftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleDraftSave = useCallback(() => {
    if (saveDraftTimerRef.current) {
      clearTimeout(saveDraftTimerRef.current);
    }
    saveDraftTimerRef.current = setTimeout(() => {
      saveProjectFormDraft(projectId, getValues(), previewUrl);
    }, 600);
  }, [projectId, getValues, previewUrl]);

  useEffect(() => {
    const draft = loadProjectFormDraft(projectId);
    if (!draft) return;

    reset(draft.formValues);
    if (draft.previewUrl) {
      setPreviewUrl(draft.previewUrl);
    }
    setDraftRestored(true);
  }, [projectId, reset, setPreviewUrl]);

  useEffect(() => {
    scheduleDraftSave();
    const subscription = watch(() => scheduleDraftSave());
    return () => {
      if (saveDraftTimerRef.current) {
        clearTimeout(saveDraftTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [watch, scheduleDraftSave]);

  const discardDraft = useCallback(
    (emptyValues: ProjectFormValues) => {
      clearProjectFormDraft(projectId);
      setDraftRestored(false);
      setSelectedFile(null);
      setImageRemoved(false);
      if (initialData) {
        reset(initialData);
        setPreviewUrl(initialData.imageUrl ?? '');
      } else {
        reset(emptyValues);
        setPreviewUrl('');
      }
    },
    [
      projectId,
      initialData,
      reset,
      setPreviewUrl,
      setSelectedFile,
      setImageRemoved,
    ],
  );

  const clearDraftAfterSave = useCallback(() => {
    clearProjectFormDraft(projectId);
    setDraftRestored(false);
  }, [projectId]);

  return {
    draftRestored,
    scheduleDraftSave,
    discardDraft,
    clearDraftAfterSave,
    setDraftRestored,
  };
}
