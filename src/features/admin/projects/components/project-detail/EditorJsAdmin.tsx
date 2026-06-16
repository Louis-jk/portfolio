'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  type EditorOutput,
  type I18nLocale,
} from '@/modules/project-detail-page';
import { uploadProjectImage } from '@/app/[locale]/(private)/[adminPath]/projects/upload-image';
import { saveProjectDetailPageAction } from '@/app/[locale]/(private)/[adminPath]/projects/[id]/detail/action';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  refreshAllI18nTools,
  setActiveLocale,
} from '@/features/admin/projects/editor/locale-context';
import { LocaleTabSwitcher } from './LocaleTabSwitcher';
import { AdminVisibilityBadge } from '@/features/admin/projects/components/shared/AdminVisibilityBadge';

type EditorJsAdminProps = {
  projectId: number;
  locale: string;
  projectTitle: string;
  initialContent: EditorOutput;
  initialIsPublic: boolean;
};

export function EditorJsAdmin({
  projectId,
  locale,
  projectTitle,
  initialContent,
  initialIsPublic,
}: EditorJsAdminProps) {
  const t = useTranslations('admin.projects');
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const initialContentRef = useRef(initialContent);
  const [activeLocale, setActiveLocaleState] = useState<I18nLocale>('ko');
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingEditor, setIsLoadingEditor] = useState(true);

  const uploadByFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadProjectImage(formData);
    if (!result.success) {
      toast.error(result.error);
      return { success: false };
    }
    return { success: true, file: { url: result.url } };
  }, []);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    let cancelled = false;

    void (async () => {
      try {
        const [{ default: EditorJs }, { createEditorTools }] = await Promise.all([
          import('@editorjs/editorjs'),
          import('@/features/admin/projects/editor/editor-config'),
        ]);

        if (cancelled || !holderRef.current) return;

        const editor = new EditorJs({
          holder: holderRef.current,
          data: initialContentRef.current,
          tools: createEditorTools(uploadByFile),
          onReady: () => {
            if (!cancelled) setIsReady(true);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t('detailSaveFailed'),
        );
      } finally {
        if (!cancelled) setIsLoadingEditor(false);
      }
    })();

    return () => {
      cancelled = true;
      const editor = editorRef.current;
      editorRef.current = null;
      if (editor) {
        void editor.isReady.then(() => {
          editor.destroy();
        });
      }
    };
  }, [t, uploadByFile]);

  const handleLocaleChange = (nextLocale: I18nLocale) => {
    setActiveLocale(nextLocale);
    setActiveLocaleState(nextLocale);
    refreshAllI18nTools();
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      const output = (await editorRef.current.save()) as EditorOutput;
      const result = await saveProjectDetailPageAction({
        projectId,
        locale,
        content: output,
        isPublic,
      });
      if (!result.success) {
        toast.error(result.error ?? t('detailSaveFailed'));
        return;
      }
      toast.success(t('detailSaved'));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('detailSaveFailed'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const projectsBase = `/${locale}${ADMIN_ROUTES.PROJECTS}`;

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <header className='space-y-4 border-b border-zinc-200 pb-6 dark:border-zinc-800'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='space-y-1'>
            <Link
              href={`${projectsBase}/${projectId}/edit`}
              className='text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            >
              {t('backToList')}
            </Link>
            <h1 className='text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100'>
              {t('detailEditorTitle')}: {projectTitle}
            </h1>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <LocaleTabSwitcher
              activeLocale={activeLocale}
              onChange={handleLocaleChange}
            />
            <button
              type='button'
              onClick={() => setIsPublic((prev) => !prev)}
              className='rounded-full border border-zinc-200 px-3 py-1.5 dark:border-zinc-700'
            >
              <AdminVisibilityBadge isPublic={isPublic} />
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={!isReady || isSaving}
              className='rounded-full bg-purple-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50'
            >
              {isSaving ? t('saving') : t('detailSave')}
            </button>
          </div>
        </div>
        <p className='text-sm text-zinc-500'>{t('detailEditorHint')}</p>
        <Link
          href={`/${locale}/projects/${projectId}/story`}
          className='text-sm font-medium text-purple-600 hover:text-purple-700'
          target='_blank'
        >
          {t('detailPreviewStory')}
        </Link>
      </header>

      {isLoadingEditor ? (
        <p className='text-sm text-zinc-500'>{t('detailEditorLoading')}</p>
      ) : null}
      <div
        ref={holderRef}
        className='min-h-[480px] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
      />
    </div>
  );
}
