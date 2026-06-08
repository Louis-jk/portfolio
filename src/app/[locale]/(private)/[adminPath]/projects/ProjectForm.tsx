'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { saveProjectFormDraft } from '@/lib/project-form-draft';
import { projectFormValuesSchema } from '@/schemas/projectSchema';
import {
  emptyTranslation,
  PROJECT_FORM_DEFAULT_VALUES,
} from './project-form/empty-translation';
import { ProjectFormSidebar } from './project-form/ProjectFormSidebar';
import { ProjectFormTranslations } from './project-form/ProjectFormTranslations';
import { useProjectFormDraft } from './project-form/useProjectFormDraft';
import { useProjectFormSubmit } from './project-form/useProjectFormSubmit';
import type {
  ProjectFormValues,
  TranslationFormValues,
} from '@/types/project-form.type';

export type { ProjectFormValues, TranslationFormValues };

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.imageUrl ?? '',
  );
  const [isDragging, setIsDragging] = useState(false);

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

  const { draftRestored, discardDraft, clearDraftAfterSave } =
    useProjectFormDraft({
      projectId,
      initialData,
      getValues,
      reset,
      watch,
      previewUrl,
      setPreviewUrl,
      setSelectedFile,
      setImageRemoved,
    });

  const { onSubmit, submitPhase, isProcessing } = useProjectFormSubmit({
    projectId,
    initialData,
    selectedFile,
    previewUrl,
    imageRemoved,
    reset,
    setSelectedFile,
    setPreviewUrl,
    clearDraftAfterSave,
  });

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setSelectedFile(file);
    setImageRemoved(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      saveProjectFormDraft(projectId, getValues(), result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-7xl mx-auto p-8 space-y-10'
    >
      {draftRestored && (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-900 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-100'>
          <p>
            작성 중이던 내용을 복구했습니다. 이미지 미리보기가 없으면 다시
            업로드해 주세요.
          </p>
          <button
            type='button'
            onClick={() =>
              discardDraft({
                ...PROJECT_FORM_DEFAULT_VALUES,
                translations: {
                  ko: emptyTranslation(),
                  ja: emptyTranslation(),
                  en: emptyTranslation(),
                },
              })
            }
            className='shrink-0 rounded-lg border border-purple-300 px-3 py-1.5 text-xs font-bold hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/60'
          >
            초안 삭제
          </button>
        </div>
      )}
      <header className='flex justify-between items-end border-b border-zinc-100 dark:border-slate-800 pb-8'>
        <div>
          <h1 className='text-5xl font-black tracking-tighter text-zinc-900 dark:text-slate-100 uppercase'>
            Project{' '}
            <span className='text-purple-600'>
              {projectId ? 'Edit' : 'Registration'}
            </span>
          </h1>
        </div>
        <button
          type='submit'
          disabled={isSubmitting || isProcessing}
          className='bg-purple-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-purple-600 disabled:bg-zinc-300 dark:disabled:bg-slate-600 transition-all shadow-2xl flex items-center gap-3 active:scale-95 cursor-pointer'
        >
          {isProcessing || isSubmitting ? (
            <Loader2 className='animate-spin' />
          ) : (
            <Send size={20} />
          )}
          {submitPhase === 'uploading'
            ? 'UPLOADING...'
            : submitPhase === 'saving' || isSubmitting
              ? 'SAVING...'
              : projectId
                ? 'UPDATE PROJECT'
                : 'DEPLOY PROJECT'}
        </button>
      </header>

      <div className='grid grid-cols-12 gap-10'>
        <ProjectFormSidebar
          register={register}
          control={control}
          watch={watch}
          t={t}
          previewUrl={previewUrl}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          onRemoveImage={() => {
            setSelectedFile(null);
            setPreviewUrl('');
            setImageRemoved(true);
          }}
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
