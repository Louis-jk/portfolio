'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getAdminStoryPreviewUrl } from '@/lib/projects/admin-story-preview-url';
import {
  type EditorOutput,
  type I18nLocale,
  type StoryContentDocument,
} from '@/modules/project-detail-page';
import {
  flattenDetailsBlocks,
  findEmptyDetailsSections,
  nestDetailsBlocks,
} from '@/lib/project-detail-page/details-blocks';
import {
  buildStoryContentDocument,
  parseStoryContent,
} from '@/lib/project-detail-page/story-content-document';
import { normalizeStoryParagraphBlocks } from '@/lib/project-detail-page/paragraph-html';
import { uploadProjectImage } from '@/app/[locale]/(private)/[adminPath]/projects/upload-image';
import { uploadProjectVideo } from '@/app/[locale]/(private)/[adminPath]/projects/upload-video';
import { prepareVideoForUpload } from '@/lib/media/compress-video.client';
import { saveProjectDetailPageAction } from '@/app/[locale]/(private)/[adminPath]/projects/[id]/detail/action';
import { translateStoryContentAction } from '@/app/[locale]/(private)/[adminPath]/projects/[id]/detail/translate-action';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  setActiveLocale,
  syncAllI18nToolsToActiveLocale,
} from '@/features/admin/projects/editor/locale-context';
import {
  captureI18nTextBlocksFromDom,
  captureTableCellsFromHolder,
  normalizeEditorOutputForSave,
  prepareEditorOutputForLoad,
} from '@/features/admin/projects/editor/editor-html-persistence';
import { attachEditorImagePaste } from '@/features/admin/projects/editor/editor-image-paste';
import { attachEditorCodePaste } from '@/features/admin/projects/editor/editor-code-paste';
import { attachEditorI18nEnterSplit } from '@/features/admin/projects/editor/editor-i18n-enter-split';
import { attachEditorMarkdownShortcuts } from '@/features/admin/projects/editor/editor-markdown-shortcuts';
import { attachEditorInlineCode } from '@/features/admin/projects/editor/editor-inline-code';
import { attachEditorUndo } from '@/features/admin/projects/editor/editor-undo';
import { STORY_CONTENT_SHELL_CLASS } from '@/constants/story-layout';
import { LocaleTabSwitcher } from './LocaleTabSwitcher';
import { StoryEditorVisibilityToggle } from '@/features/admin/projects/components/project-detail/StoryEditorVisibilityToggle';

const LOCALE_ORDER: I18nLocale[] = ['ko', 'ja', 'en'];

type EditorJsAdminProps = {
  projectId: number;
  locale: string;
  projectTitle: string;
  initialContent: EditorOutput | StoryContentDocument;
  initialIsPublic: boolean;
};

function flattenLocaleDocs(
  document: StoryContentDocument,
): Record<I18nLocale, EditorOutput> {
  const locales = {
    ko: flattenDetailsBlocks(document.locales.ko),
    ja: flattenDetailsBlocks(document.locales.ja),
    en: flattenDetailsBlocks(document.locales.en),
  };

  return {
    ko: prepareEditorOutputForLoad(locales.ko),
    ja: prepareEditorOutputForLoad(locales.ja),
    en: prepareEditorOutputForLoad(locales.en),
  };
}

export function EditorJsAdmin({
  projectId,
  locale,
  projectTitle,
  initialContent,
  initialIsPublic,
}: EditorJsAdminProps) {
  const normalizeLocale = (value: string): I18nLocale =>
    value === 'ko' || value === 'ja' || value === 'en' ? value : 'ko';

  const initialLocale = normalizeLocale(locale);
  const t = useTranslations('admin.projects');
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const localeDocsRef = useRef<Record<I18nLocale, EditorOutput>>(
    flattenLocaleDocs(parseStoryContent(initialContent)),
  );
  const initialContentRef = useRef(localeDocsRef.current[initialLocale]);
  const [activeLocale, setActiveLocaleState] =
    useState<I18nLocale>(initialLocale);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSwitchingLocale, setIsSwitchingLocale] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingEditor, setIsLoadingEditor] = useState(true);

  const persistActiveLocaleDoc = useCallback(async () => {
    if (!editorRef.current || !holderRef.current) return;
    await editorRef.current.isReady;
    syncAllI18nToolsToActiveLocale();
    let flatOutput = (await editorRef.current.save()) as EditorOutput;
    flatOutput = captureI18nTextBlocksFromDom(editorRef.current, flatOutput);
    flatOutput = captureTableCellsFromHolder(holderRef.current, flatOutput);
    flatOutput = normalizeEditorOutputForSave(flatOutput);
    flatOutput = normalizeStoryParagraphBlocks(flatOutput);
    localeDocsRef.current[activeLocale] = flatOutput;
    initialContentRef.current = flatOutput;
  }, [activeLocale]);

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

  const uploadVideoByFile = useCallback(
    async (file: File, onProgress?: (message: string) => void) => {
      try {
        const prepared = await prepareVideoForUpload(file, onProgress);
        const formData = new FormData();
        formData.append('file', prepared);
        const result = await uploadProjectVideo(formData);
        if (!result.success) {
          toast.error(result.error);
          return { success: false, error: result.error };
        }
        return { success: true, file: { url: result.url } };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '영상 업로드에 실패했습니다.';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [],
  );

  useEffect(() => {
    setActiveLocale(activeLocale);
  }, [activeLocale]);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    let cancelled = false;
    let detachImagePaste: (() => void) | null = null;
    let detachCodePaste: (() => void) | null = null;
    let detachMarkdownShortcuts: (() => void) | null = null;
    let detachInlineCode: (() => void) | null = null;
    let detachI18nEnterSplit: (() => void) | null = null;

    void (async () => {
      try {
        const [{ default: EditorJs }, { createEditorTools }] =
          await Promise.all([
            import('@editorjs/editorjs'),
            import('@/features/admin/projects/editor/editor-config'),
          ]);

        if (cancelled || !holderRef.current) return;

        const editor = new EditorJs({
          holder: holderRef.current,
          data: initialContentRef.current,
          tools: createEditorTools(uploadByFile, uploadVideoByFile),
          onReady: () => {
            if (cancelled || !holderRef.current) return;
            detachImagePaste = attachEditorImagePaste(
              holderRef.current,
              editor,
              uploadByFile,
            );
            detachCodePaste = attachEditorCodePaste(holderRef.current, editor);
            detachMarkdownShortcuts = attachEditorMarkdownShortcuts(
              holderRef.current,
              editor,
            );
            detachInlineCode = attachEditorInlineCode(holderRef.current, editor);
            detachI18nEnterSplit = attachEditorI18nEnterSplit(
              holderRef.current,
              editor,
            );
            void attachEditorUndo(editor, initialContentRef.current);
            setIsReady(true);
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
      detachImagePaste?.();
      detachImagePaste = null;
      detachCodePaste?.();
      detachCodePaste = null;
      detachMarkdownShortcuts?.();
      detachMarkdownShortcuts = null;
      detachInlineCode?.();
      detachInlineCode = null;
      detachI18nEnterSplit?.();
      detachI18nEnterSplit = null;
      const editor = editorRef.current;
      editorRef.current = null;
      if (editor) {
        void editor.isReady.then(() => {
          editor.destroy();
        });
      }
    };
    // `t` is intentionally omitted: an unstable reference would destroy and
    // re-create the editor after save, resetting visible content.
  }, [uploadByFile, uploadVideoByFile]);

  const handleLocaleChange = (nextLocale: I18nLocale) => {
    if (nextLocale === activeLocale || !editorRef.current) return;

    void (async () => {
      setIsSwitchingLocale(true);
      try {
        await persistActiveLocaleDoc();
        const nextContent = prepareEditorOutputForLoad(
          localeDocsRef.current[nextLocale],
        );
        await editorRef.current!.render(nextContent);
        initialContentRef.current = nextContent;
        setActiveLocaleState(nextLocale);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t('detailSaveFailed'),
        );
      } finally {
        setIsSwitchingLocale(false);
      }
    })();
  };

  const handleAutoTranslate = async () => {
    if (!editorRef.current || activeLocale === 'ko') return;

    setIsTranslating(true);
    try {
      await persistActiveLocaleDoc();

      const koreanDoc = nestDetailsBlocks(localeDocsRef.current.ko);
      const result = await translateStoryContentAction({
        content: koreanDoc,
        targetLocale: activeLocale,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const translatedFlat = flattenDetailsBlocks(result.content);
      localeDocsRef.current[activeLocale] = translatedFlat;
      await editorRef.current.render(translatedFlat);
      initialContentRef.current = translatedFlat;
      toast.success(t('detailAutoTranslateDone'));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('detailAutoTranslateFailed'),
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      await persistActiveLocaleDoc();

      const nestedByLocale = LOCALE_ORDER.reduce(
        (acc, loc) => {
          acc[loc] = nestDetailsBlocks(
            normalizeStoryParagraphBlocks(localeDocsRef.current[loc]),
          );
          return acc;
        },
        {} as Record<I18nLocale, EditorOutput>,
      );

      const document = buildStoryContentDocument(nestedByLocale);
      const emptyDetails = findEmptyDetailsSections(nestedByLocale[activeLocale]);

      const result = await saveProjectDetailPageAction({
        projectId,
        locale,
        content: document,
        isPublic,
      });
      if (!result.success) {
        toast.error(result.error ?? t('detailSaveFailed'));
        return;
      }
      if (emptyDetails.length > 0) {
        toast.warning(t('detailEmptyToggleSections'));
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
  const editorBusy = !isReady || isSaving || isTranslating || isSwitchingLocale;

  return (
    <div className={`${STORY_CONTENT_SHELL_CLASS} space-y-6 py-4`}>
      <header className='space-y-4 border-b border-zinc-200 pb-6 dark:border-zinc-800'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2 text-sm text-zinc-500'>
              <Link
                href={projectsBase}
                className='hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                {t('backToList')}
              </Link>
              <span className='text-zinc-300 dark:text-zinc-600'>|</span>
              <Link
                href={`${projectsBase}/${projectId}`}
                className='hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                {t('preview')}
              </Link>
              <span className='text-zinc-300 dark:text-zinc-600'>|</span>
              <Link
                href={`${projectsBase}/${projectId}/edit`}
                className='hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                {t('edit')}
              </Link>
            </div>
            <h1 className='text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100'>
              {t('detailEditorTitle')}: {projectTitle}
            </h1>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <LocaleTabSwitcher
              activeLocale={activeLocale}
              onChange={handleLocaleChange}
            />
            {activeLocale !== 'ko' ? (
              <button
                type='button'
                onClick={() => {
                  void handleAutoTranslate();
                }}
                disabled={editorBusy}
                className='rounded-full border border-purple-200 px-4 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/40'
              >
                {isTranslating
                  ? t('detailAutoTranslating')
                  : t('detailAutoTranslate')}
              </button>
            ) : null}
            <StoryEditorVisibilityToggle
              isPublic={isPublic}
              onChange={setIsPublic}
              disabled={editorBusy}
              label={t('detailStoryVisibilityLabel')}
              publicDesc={t('detailStoryPublicDesc')}
              privateDesc={t('detailStoryPrivateDesc')}
              publicAria={t('publicProject')}
              privateAria={t('confidentialProject')}
            />
            <button
              type='button'
              onClick={handleSave}
              disabled={editorBusy}
              className='rounded-full bg-purple-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50'
            >
              {isSaving ? t('saving') : t('detailSave')}
            </button>
          </div>
        </div>
        <p className='text-sm text-zinc-500'>{t('detailEditorHint')}</p>
        <p className='text-sm text-zinc-400'>{t('detailEditorI18nHint')}</p>
        <p className='text-sm text-zinc-400'>
          {t('detailEditorImagePasteHint')}
        </p>
        <p className='text-sm text-zinc-400'>{t('detailEditorMarkdownHint')}</p>
        <p className='text-sm text-zinc-400'>{t('detailEditorUndoHint')}</p>
        <p className='text-sm text-zinc-400'>{t('detailEditorVideoHint')}</p>
        <Link
          href={getAdminStoryPreviewUrl(locale, projectId)}
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
        className='admin-editor-js min-h-[480px] w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:p-8'
      />
    </div>
  );
}
