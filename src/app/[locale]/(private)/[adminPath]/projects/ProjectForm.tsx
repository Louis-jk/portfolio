'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
} from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { uploadProjectImage } from './upload-image';
import {
  ImagePlus,
  Loader2,
  X,
  Send,
  Globe,
  Smartphone,
  Laptop,
  Monitor,
  Plus,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { saveProject } from './new/action';
import { updateProject } from './[id]/edit/action';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  PLATFORM_CATEGORIES,
  DOMAIN_TAGS,
} from '@/lib/project-categories';
import {
  clearProjectFormDraft,
  loadProjectFormDraft,
  saveProjectFormDraft,
} from '@/lib/project-form-draft';
import { withTimeout } from '@/lib/with-timeout';
import { toast } from 'sonner';
import type {
  ProjectFormValues,
  TranslationFormValues,
} from '@/types/project-form.type';

export type { ProjectFormValues, TranslationFormValues };

type ArrayFieldKey = 'description' | 'challenges' | 'achievements';

function SortableArrayItem({
  id,
  lang,
  fieldKey,
  index,
  control,
  onRemove,
}: {
  id: string;
  lang: 'ko' | 'ja' | 'en';
  fieldKey: ArrayFieldKey;
  index: number;
  control: Control<ProjectFormValues>;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-2 items-center p-1 -m-1 rounded-xl ${
        isDragging ? 'bg-blue-50 opacity-90 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className='p-2 rounded-lg cursor-grab active:cursor-grabbing text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 touch-none shrink-0'
      >
        <GripVertical size={18} />
      </div>
      <input
        {...control.register(`translations.${lang}.${fieldKey}.${index}.value`)}
        placeholder={`항목 ${index + 1}`}
        className='flex-1 p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100'
      />
      <button
        type='button'
        onClick={onRemove}
        className='p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer'
      >
        <X size={16} />
      </button>
    </div>
  );
}

function StaticTag({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700 shadow-sm'>
      <GripVertical size={14} className='text-zinc-400 shrink-0' />
      {tag}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='p-0.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors'
      >
        <X size={14} />
      </button>
    </span>
  );
}

function SortableTag({
  id,
  tag,
  onRemove,
}: {
  id: string;
  tag: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border shadow-sm cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? 'opacity-50 border-blue-400 z-50' : 'border-zinc-200 dark:border-slate-700'
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical size={14} className='text-zinc-400 shrink-0' />
      {tag}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='p-0.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors'
      >
        <X size={14} />
      </button>
    </span>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
  addMorePlaceholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  addMorePlaceholder?: string;
}) {
  const parseToTags = useCallback(
    (s: string) =>
      s
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    [],
  );

  const [tags, setTags] = useState<string[]>(() => parseToTags(value));
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const parsed = parseToTags(value);
    setTags((prev) =>
      JSON.stringify(parsed) !== JSON.stringify(prev) ? parsed : prev,
    );
  }, [value, parseToTags]);

  const syncToForm = useCallback(
    (newTags: string[]) => {
      setTags(newTags);
      onChange(newTags.join(', '));
    },
    [onChange],
  );

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (trimmed) {
      syncToForm([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (i: number) => {
    syncToForm(tags.filter((_, idx) => idx !== i));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addTag(inputValue);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex((_, i) => String(i) === active.id);
      const newIndex = tags.findIndex((_, i) => String(i) === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        syncToForm(arrayMove(tags, oldIndex, newIndex));
      }
    }
  };

  const tagsContent = (
    <div className='flex flex-wrap gap-2 mb-2'>
      {tags.map((tag, i) =>
        mounted ? (
          <SortableTag
            key={`${tag}-${i}`}
            id={String(i)}
            tag={tag}
            onRemove={() => removeTag(i)}
          />
        ) : (
          <StaticTag
            key={`${tag}-${i}`}
            tag={tag}
            onRemove={() => removeTag(i)}
          />
        ),
      )}
    </div>
  );

  return (
    <div className='min-h-[140px] p-4 bg-zinc-50 dark:bg-slate-800 rounded-xl border border-transparent focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 focus-within:border-blue-200 dark:focus-within:border-slate-600 transition-shadow'>
      {mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tags.map((_, i) => String(i))}
            strategy={rectSortingStrategy}
          >
            {tagsContent}
          </SortableContext>
        </DndContext>
      ) : (
        tagsContent
      )}
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={
          tags.length === 0 ? placeholder : (addMorePlaceholder ?? placeholder)
        }
        className='w-full min-h-[48px] p-2 bg-transparent border-none resize-none text-xs outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-slate-900 dark:text-slate-100'
        rows={3}
      />
    </div>
  );
}

function ArrayField({
  lang,
  fieldKey,
  label,
  control,
  setValue,
  getValues,
}: {
  lang: 'ko' | 'ja' | 'en';
  fieldKey: ArrayFieldKey;
  label: string;
  control: Control<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
  getValues: UseFormGetValues<ProjectFormValues>;
}) {
  const koName = `translations.ko.${fieldKey}` as const;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: koName,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dndContextId = `array-${fieldKey}-${lang}`;
  const sortableItems = fields.map((_, i) => `${dndContextId}-${i}`);

  const syncMove = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
    const jaArr = getValues(`translations.ja.${fieldKey}`);
    const enArr = getValues(`translations.en.${fieldKey}`);
    const jaMoved = arrayMove(jaArr, fromIndex, toIndex);
    const enMoved = arrayMove(enArr, fromIndex, toIndex);
    setValue(`translations.ja.${fieldKey}`, jaMoved);
    setValue(`translations.en.${fieldKey}`, enMoved);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortableItems.indexOf(String(active.id));
      const newIndex = sortableItems.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        syncMove(oldIndex, newIndex);
      }
    }
  };

  const syncAppend = () => {
    const empty = { value: '' };
    append(empty);
    setValue(`translations.ja.${fieldKey}`, [
      ...getValues(`translations.ja.${fieldKey}`),
      empty,
    ]);
    setValue(`translations.en.${fieldKey}`, [
      ...getValues(`translations.en.${fieldKey}`),
      empty,
    ]);
  };

  const syncRemove = (i: number) => {
    remove(i);
    const jaArr = getValues(`translations.ja.${fieldKey}`).filter(
      (_, idx) => idx !== i,
    );
    const enArr = getValues(`translations.en.${fieldKey}`).filter(
      (_, idx) => idx !== i,
    );
    setValue(`translations.ja.${fieldKey}`, jaArr);
    setValue(`translations.en.${fieldKey}`, enArr);
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1'>
          {label}
        </label>
        <button
          type='button'
          onClick={syncAppend}
          className='p-2 rounded-lg bg-purple-400 hover:bg-purple-500 text-white transition-colors cursor-pointer'
        >
          <Plus size={16} />
        </button>
      </div>
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableItems}>
          <div className='space-y-2 rounded-xl bg-zinc-50/30 dark:bg-slate-800/50 p-3 min-h-[80px]'>
            {fields.map((field, i) => (
              <SortableArrayItem
                key={field.id}
                id={sortableItems[i]}
                lang={lang}
                fieldKey={fieldKey}
                index={i}
                control={control}
                onRemove={() => syncRemove(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

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
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.imageUrl ?? '',
  );
  const [isDragging, setIsDragging] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<'idle' | 'uploading' | 'saving'>(
    'idle',
  );
  const [draftRestored, setDraftRestored] = useState(false);

  const isProcessing = submitPhase !== 'idle';
  const UPLOAD_TIMEOUT_MS = 45_000;
  const SAVE_TIMEOUT_MS = 20_000;
  const MAX_DATA_URL_LENGTH = 4_500_000;

  const emptyTranslation = (): TranslationFormValues => ({
    title: '',
    role: '',
    overview: '',
    region: '',
    company: '',
    description: [{ value: '' }],
    challenges: [{ value: '' }],
    achievements: [{ value: '' }],
    detailImage: '',
  });

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
    defaultValues: initialData ?? {
      imageUrl: '',
      startDate: '',
      isPublic: true,
      technologies: '',
      tools: {
        development: '',
        communication: '',
        design: '',
        debugging: '',
      },
      platformCategories: [],
      domainTags: [],
      platforms: {
        webLink: '',
        iosLink: '',
        androidLink: '',
        desktopLink: '',
      },
      translations: {
        ko: emptyTranslation(),
        ja: emptyTranslation(),
        en: emptyTranslation(),
      },
    },
  });

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
  }, [projectId, reset]);

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

  const dataUrlToFile = async (dataUrl: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const extension = blob.type.split('/')[1] || 'jpg';
    return new File([blob], `draft-${Date.now()}.${extension}`, {
      type: blob.type || 'image/jpeg',
    });
  };

  // 공통 파일 처리 로직 (미리보기 생성)
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
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      saveProjectFormDraft(projectId, getValues(), result);
    };
    reader.readAsDataURL(file);
  };

  // 클릭 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // 드래그 앤 드롭 핸들러
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

  const splitByComma = (s: string) =>
    s
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  const getSubmitValidationError = (data: ProjectFormValues): string | null => {
    if (!data.startDate?.trim()) {
      return '시작일(Start Date)을 선택해 주세요.';
    }
    const hasImage =
      Boolean(selectedFile) ||
      Boolean(previewUrl) ||
      Boolean(projectId && initialData?.imageUrl);
    if (!hasImage) {
      return '프로젝트 이미지를 업로드해 주세요.';
    }
    return null;
  };

  // 최종 제출 (실제 업로드 + DB 저장)
  const onSubmit = async (data: ProjectFormValues) => {
    const validationError = getSubmitValidationError(data);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      let finalImageUrl = '';
      let fileToUpload = selectedFile;

      if (previewUrl.startsWith('http://') || previewUrl.startsWith('https://')) {
        finalImageUrl = previewUrl;
      }

      if (!finalImageUrl) {
        if (!fileToUpload && previewUrl.startsWith('data:')) {
          if (previewUrl.length > MAX_DATA_URL_LENGTH) {
            toast.error(
              '복구된 이미지가 너무 큽니다. 5MB 이하 이미지를 다시 선택해 주세요.',
            );
            return;
          }
          setSubmitPhase('uploading');
          fileToUpload = await withTimeout(
            dataUrlToFile(previewUrl),
            15_000,
            '이미지 준비',
          );
        }

        if (fileToUpload) {
          setSubmitPhase('uploading');
          const formData = new FormData();
          formData.append('file', fileToUpload);

          const uploadResult = await withTimeout(
            uploadProjectImage(formData),
            UPLOAD_TIMEOUT_MS,
            '이미지 업로드',
          );
          if (!uploadResult.success) {
            toast.error(uploadResult.error ?? '이미지 업로드에 실패했습니다.');
            return;
          }

          finalImageUrl = uploadResult.url;
        } else if (projectId && initialData?.imageUrl) {
          finalImageUrl = initialData.imageUrl;
        }
      }

      if (!finalImageUrl) {
        toast.error('프로젝트 이미지를 업로드해 주세요.');
        return;
      }

      const payload = {
        ...data,
        imageUrl: finalImageUrl,
        technologies: splitByComma(data.technologies),
        platformCategories: data.platformCategories ?? [],
        domainTags: data.domainTags ?? [],
        tools: {
          development: splitByComma(data.tools.development),
          communication: splitByComma(data.tools.communication),
          design: splitByComma(data.tools.design),
          debugging: splitByComma(data.tools.debugging),
        },
        translations: {
          ko: {
            ...data.translations.ko,
            description: data.translations.ko.description
              .map((d) => d.value)
              .filter(Boolean),
            challenges: data.translations.ko.challenges
              .map((c) => c.value)
              .filter(Boolean),
            achievements: data.translations.ko.achievements
              .map((a) => a.value)
              .filter(Boolean),
          },
          ja: {
            ...data.translations.ja,
            description: data.translations.ja.description
              .map((d) => d.value)
              .filter(Boolean),
            challenges: data.translations.ja.challenges
              .map((c) => c.value)
              .filter(Boolean),
            achievements: data.translations.ja.achievements
              .map((a) => a.value)
              .filter(Boolean),
          },
          en: {
            ...data.translations.en,
            description: data.translations.en.description
              .map((d) => d.value)
              .filter(Boolean),
            challenges: data.translations.en.challenges
              .map((c) => c.value)
              .filter(Boolean),
            achievements: data.translations.en.achievements
              .map((a) => a.value)
              .filter(Boolean),
          },
        },
      };

      setSubmitPhase('saving');
      const res = await withTimeout(
        projectId
          ? updateProject(projectId, payload)
          : saveProject(payload),
        SAVE_TIMEOUT_MS,
        '프로젝트 저장',
      );

      if (res.success) {
        clearProjectFormDraft(projectId);
        if (projectId) {
          toast.success('프로젝트가 수정되었습니다.');
          router.back();
        } else {
          toast.success(
            '프로젝트가 저장되었습니다. AI 검색 인덱스는 백그라운드에서 반영됩니다.',
          );
          setSelectedFile(null);
          setPreviewUrl('');
          setDraftRestored(false);
          reset();
        }
      } else {
        toast.error(res.error ?? '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : '저장 중 오류가 발생했습니다.',
      );
    } finally {
      setSubmitPhase('idle');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => setSubmitPhase('idle'))}
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
            onClick={() => {
              clearProjectFormDraft(projectId);
              setDraftRestored(false);
              setSelectedFile(null);
              if (initialData) {
                reset(initialData);
                setPreviewUrl(initialData.imageUrl ?? '');
              } else {
                reset({
                  imageUrl: '',
                  startDate: '',
                  isPublic: true,
                  technologies: '',
                  tools: {
                    development: '',
                    communication: '',
                    design: '',
                    debugging: '',
                  },
                  platformCategories: [],
                  domainTags: [],
                  platforms: {
                    webLink: '',
                    iosLink: '',
                    androidLink: '',
                    desktopLink: '',
                  },
                  translations: {
                    ko: emptyTranslation(),
                    ja: emptyTranslation(),
                    en: emptyTranslation(),
                  },
                });
                setPreviewUrl('');
              }
            }}
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
        {/* SIDEBAR */}
        <div className='col-span-12 lg:col-span-4 space-y-8'>
          <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  Start Date
                </label>
                <input
                  type='date'
                  required
                  {...register('startDate', { required: true })}
                  className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
                />
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  End Date
                </label>
                <input
                  type='date'
                  {...register('endDate')}
                  className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
                />
              </div>
            </div>

            <label className='text-[10px] font-black text-purple-600 uppercase ml-1 mb-0'>
              Project Assets
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative group aspect-[6/3] rounded-md overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center
                ${isDragging ? 'border-purple-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02] shadow-inner' : 'border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-500'}
                ${previewUrl ? 'border-none' : ''}
              `}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt='Preview'
                    fill
                    className='object-cover'
                    unoptimized
                  />
                  <button
                    type='button'
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className='absolute top-2 right-2 bg-black/70 backdrop-blur-md p-2 rounded-full text-white shadow-xl hover:scale-110 transition-transform z-10 cursor-pointer'
                  >
                    <X size={20} />
                  </button>
                  <div className='absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-md text-[10px] text-white font-bold uppercase tracking-widest'>
                    Preview Mode
                  </div>
                </>
              ) : (
                <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-zinc-100/50 dark:group-hover:bg-slate-700/50 transition-colors'>
                  <ImagePlus
                    className={`w-14 h-14 mb-4 transition-all duration-500 ${isDragging ? 'text-blue-500 scale-125 rotate-12' : 'text-zinc-200 dark:text-zinc-600'}`}
                  />
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight transition-colors ${isDragging ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'}`}
                  >
                    {isDragging
                      ? 'Drop Image Now'
                      : 'Choose Image or Drag & Drop'}
                    <br />
                    <span className='text-zinc-300 dark:text-zinc-600 font-medium'>(Max 5MB)</span>
                  </p>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <label className='text-[12px] font-black text-black dark:text-white uppercase tracking-widest'>
                  {t('visibilityLabel')}
                </label>
                {watch('isPublic') ? (
                  <Badge className='bg-indigo-600 text-white border-none py-1 px-2'>
                    PUBLIC
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='bg-red-700 text-white border-none py-1 px-2'
                  >
                    PRIVATE
                  </Badge>
                )}
              </div>
              <Controller
                name='isPublic'
                control={control}
                render={({ field }) => (
                  <button
                    type='button'
                    role='switch'
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      field.value
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-zinc-200 dark:border-slate-600 bg-zinc-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                        field.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className='sr-only'>
                      {field.value
                        ? t('publicProject')
                        : t('confidentialProject')}
                    </span>
                  </button>
                )}
              />
            </div>
            <p className='text-[12px] text-black dark:text-zinc-300 -mt-8'>
              {watch('isPublic')
                ? t('publicProjectDesc')
                : t('confidentialProjectDesc')}
            </p>

            <div className='space-y-4'>
              <div>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1 block mb-2'>
                  플랫폼 (Web / Mobile / Desktop)
                </label>
                <Controller
                  name='platformCategories'
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-wrap gap-2'>
                      {PLATFORM_CATEGORIES.map((cat) => {
                        const selected = field.value.includes(cat);
                        return (
                          <button
                            key={cat}
                            type='button'
                            onClick={() => {
                              const next = selected
                                ? field.value.filter((v) => v !== cat)
                                : [...field.value, cat];
                              field.onChange(next);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              selected
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            {cat.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
              <div>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1 block mb-2'>
                  도메인/기술 태그 (Web3, Blockchain, AI)
                </label>
                <Controller
                  name='domainTags'
                  control={control}
                  render={({ field }) => (
                    <div className='flex flex-wrap gap-2'>
                      {DOMAIN_TAGS.map((tag) => {
                        const selected = field.value.includes(tag);
                        return (
                          <button
                            key={tag}
                            type='button'
                            onClick={() => {
                              const next = selected
                                ? field.value.filter((v) => v !== tag)
                                : [...field.value, tag];
                              field.onChange(next);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              selected
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                          >
                            {tag.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className='space-y-1'>
              <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                Technologies
              </label>
              <Controller
                name='technologies'
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('technologiesPlaceholder')}
                    addMorePlaceholder={t('addAfterCommaOrEnter')}
                  />
                )}
              />
            </div>
          </Card>

          <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
            <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
              Tools & Stack
            </h2>
            <div className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  Development
                </label>
                <Controller
                  name='tools.development'
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('toolsDevelopmentPlaceholder')}
                      addMorePlaceholder={t('addAfterCommaOrEnter')}
                    />
                  )}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  Communication
                </label>
                <Controller
                  name='tools.communication'
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('toolsCommunicationPlaceholder')}
                      addMorePlaceholder={t('addAfterCommaOrEnter')}
                    />
                  )}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  Design
                </label>
                <Controller
                  name='tools.design'
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('toolsDesignPlaceholder')}
                      addMorePlaceholder={t('addAfterCommaOrEnter')}
                    />
                  )}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                  Debugging
                </label>
                <Controller
                  name='tools.debugging'
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('toolsDebuggingPlaceholder')}
                      addMorePlaceholder={t('addAfterCommaOrEnter')}
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
            <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
              External Links
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 bg-zinc-50 dark:bg-slate-800 p-1.5 rounded-2xl'>
                <div className='bg-white p-2.5 rounded-xl shadow-sm'>
                  <Globe size={16} className='text-zinc-400 dark:text-zinc-500' />
                </div>
                <input
                  {...register('platforms.webLink')}
                  placeholder='Website URL'
                  className='flex-1 bg-transparent border-none text-xs outline-none'
                />
              </div>
              <div className='flex items-center gap-3 bg-zinc-50 dark:bg-slate-800 p-1.5 rounded-2xl'>
                <div className='bg-white p-2.5 rounded-xl shadow-sm'>
                  <Laptop size={16} className='text-zinc-400 dark:text-zinc-500' />
                </div>
                <input
                  {...register('platforms.iosLink')}
                  placeholder='App Store'
                  className='flex-1 bg-transparent border-none text-xs outline-none'
                />
              </div>
              <div className='flex items-center gap-3 bg-zinc-50 dark:bg-slate-800 p-1.5 rounded-2xl'>
                <div className='bg-white p-2.5 rounded-xl shadow-sm'>
                  <Smartphone size={16} className='text-zinc-400 dark:text-zinc-500' />
                </div>
                <input
                  {...register('platforms.androidLink')}
                  placeholder='Play Store'
                  className='flex-1 bg-transparent border-none text-xs outline-none'
                />
              </div>
              <div className='flex items-center gap-3 bg-zinc-50 dark:bg-slate-800 p-1.5 rounded-2xl'>
                <div className='bg-white p-2.5 rounded-xl shadow-sm'>
                  <Monitor size={16} className='text-zinc-400 dark:text-zinc-500' />
                </div>
                <input
                  {...register('platforms.desktopLink')}
                  placeholder='Desktop App URL'
                  className='flex-1 bg-transparent border-none text-xs outline-none'
                />
              </div>
            </div>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className='col-span-12 lg:col-span-8'>
          <Tabs defaultValue={defaultLocale} className='w-full gap-0'>
            <TabsList className='w-full grid grid-cols-3 bg-purple-600 rounded-xs backdrop-blur-md h-10!'>
              <TabsTrigger
                value='ko'
                className='rounded-xs font-black text-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg text-white hover:text-white data-[state=active]:hover:text-black dark:data-[state=active]:hover:text-white cursor-pointer'
              >
                한국어
              </TabsTrigger>
              <TabsTrigger
                value='ja'
                className='rounded-xs font-black text-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg text-white hover:text-white data-[state=active]:hover:text-black dark:data-[state=active]:hover:text-white cursor-pointer'
              >
                日本語
              </TabsTrigger>
              <TabsTrigger
                value='en'
                className='rounded-xs font-black text-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg text-white hover:text-white data-[state=active]:hover:text-black dark:data-[state=active]:hover:text-white cursor-pointer'
              >
                English
              </TabsTrigger>
            </TabsList>

            {(['ko', 'ja', 'en'] as const).map((lang) => (
              <TabsContent
                key={lang}
                value={lang}
                className='mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700'
              >
                <Card className='p-12 space-y-10 border-none shadow-2xl shadow-zinc-100/80 dark:shadow-slate-900/50 rounded-xs bg-white dark:bg-slate-900'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                      Project Title
                    </label>
                    <div className='mt-2'>
                      <textarea
                        {...register(`translations.${lang}.title`)}
                        placeholder='Amazing Project Name'
                        rows={2}
                        className='w-full text-2xl leading-4xl font-black border-none outline-none focus:ring-0 placeholder:text-zinc-100 dark:placeholder:text-zinc-500 tracking-tighter bg-transparent resize-none overflow-y-auto break-words text-slate-900 dark:text-slate-100'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-6 border-t border-zinc-300 dark:border-slate-700 pt-5'>
                    <div className='space-y-2'>
                      <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                        Client/Company
                      </label>
                      <input
                        {...register(`translations.${lang}.company`)}
                        placeholder='Client Name'
                        className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xs text-sm text-slate-900 dark:text-slate-100'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                        Your Role
                      </label>
                      <input
                        {...register(`translations.${lang}.role`)}
                        placeholder='Full-Stack Dev'
                        className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xs text-sm text-slate-900 dark:text-slate-100'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                        Region
                      </label>
                      <input
                        {...register(`translations.${lang}.region`)}
                        placeholder='Seoul, Korea'
                        className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xs text-sm text-slate-900 dark:text-slate-100'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                      Overview
                    </label>
                    <textarea
                      {...register(`translations.${lang}.overview`)}
                      className='w-full h-48 p-6 bg-zinc-50 dark:bg-slate-800 rounded-xs border-none resize-none focus:ring-2 ring-blue-50/50 dark:ring-blue-900/30 transition-all text-black dark:text-slate-100 leading-relaxed'
                      placeholder='프로젝트 개요를 작성해 주세요.'
                    />
                  </div>

                  <ArrayField
                    lang={lang}
                    fieldKey='description'
                    label='Description'
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                  />

                  <ArrayField
                    lang={lang}
                    fieldKey='challenges'
                    label='Challenges'
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                  />

                  <ArrayField
                    lang={lang}
                    fieldKey='achievements'
                    label='Achievements'
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                  />

                  <div className='space-y-2'>
                    <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1'>
                      Detail Image URL (선택)
                    </label>
                    <input
                      {...register(`translations.${lang}.detailImage`)}
                      placeholder='https://...'
                      className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100'
                    />
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </form>
  );
}
