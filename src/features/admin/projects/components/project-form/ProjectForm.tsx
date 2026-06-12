'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormValuesSchema } from '@/schemas/projectSchema';
import {
  emptyTranslation,
  PROJECT_FORM_DEFAULT_VALUES,
} from '@/features/admin/projects/lib/empty-translation';
import { useProjectFormDraft } from '@/features/admin/projects/hooks/useProjectFormDraft';
import { useProjectFormSubmit } from '@/features/admin/projects/hooks/useProjectFormSubmit';
import { useProjectImageUpload } from '@/features/admin/projects/hooks/useProjectImageUpload';
import type { ProjectFormValues } from '@/types/project-form.type';
import { ProjectFormDraftBanner } from './ProjectFormDraftBanner';
import { ProjectFormHeader } from './ProjectFormHeader';
import { ProjectFormSidebar } from './ProjectFormSidebar';
import { ProjectFormTranslations } from './ProjectFormTranslations';

export interface ProjectFormProps {
  initialData?: ProjectFormValues;
  projectId?: number;
  defaultLocale?: 'ko' | 'ja' | 'en';
}

export default function ProjectForm({
  initialData,
  projectId,
  defaultLocale = 'ko',
}: ProjectFormProps = {}) {
  const t = useTranslations('admin.projects');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormValuesSchema),
    defaultValues: initialData ?? PROJECT_FORM_DEFAULT_VALUES,
  });

  const imageUpload = useProjectImageUpload({
    projectId,
    initialImageUrl: initialData?.imageUrl,
    getValues,
  });

  const { draftRestored, discardDraft, clearDraftAfterSave } =
    useProjectFormDraft({
      projectId,
      initialData,
      getValues,
      reset,
      watch,
      previewUrl: imageUpload.previewUrl,
      setPreviewUrl: imageUpload.setPreviewUrl,
      setSelectedFile: imageUpload.setSelectedFile,
      setImageRemoved: imageUpload.setImageRemoved,
    });

  const { onSubmit, submitPhase, isProcessing } = useProjectFormSubmit({
    projectId,
    initialData,
    selectedFile: imageUpload.selectedFile,
    previewUrl: imageUpload.previewUrl,
    imageRemoved: imageUpload.imageRemoved,
    reset,
    setSelectedFile: imageUpload.setSelectedFile,
    setPreviewUrl: imageUpload.setPreviewUrl,
    clearDraftAfterSave,
  });

  const handleDiscardDraft = () =>
    discardDraft({
      ...PROJECT_FORM_DEFAULT_VALUES,
      translations: {
        ko: emptyTranslation(),
        ja: emptyTranslation(),
        en: emptyTranslation(),
      },
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-7xl mx-auto p-8 space-y-10'
    >
      {draftRestored && (
        <ProjectFormDraftBanner onDiscard={handleDiscardDraft} />
      )}

      <ProjectFormHeader
        projectId={projectId}
        isSubmitting={isSubmitting}
        isProcessing={isProcessing}
        submitPhase={submitPhase}
      />

      <div className='grid grid-cols-12 gap-10'>
        <ProjectFormSidebar
          register={register}
          control={control}
          watch={watch}
          t={t}
          previewUrl={imageUpload.previewUrl}
          isDragging={imageUpload.isDragging}
          onDragOver={imageUpload.handleDragOver}
          onDragLeave={imageUpload.handleDragLeave}
          onDrop={imageUpload.handleDrop}
          onFileChange={imageUpload.handleFileChange}
          onRemoveImage={imageUpload.removeImage}
        />
        <ProjectFormTranslations
          defaultLocale={defaultLocale}
          register={register}
          control={control}
          setValue={setValue}
          getValues={getValues}
        />
      </div>
    </form>
  );
}
