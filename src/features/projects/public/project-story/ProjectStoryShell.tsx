'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from 'react-responsive';
import { X } from 'lucide-react';
import { EditorJsRenderer } from '@/features/projects/public/project-story/editor';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { OverlayBottomFabStack } from '@/features/projects/public/OverlayBottomFabStack';
import { cn } from '@/lib/utils';
import {
  STORY_CONTENT_SHELL_CLASS,
  OVERLAY_FAB_SAFE_PADDING_CLASS,
} from '@/constants/story-layout';
import { BREAKPOINTS } from '@/constants/breakpoints';
import { useScrollRevealFab } from '@/hooks/useScrollRevealFab';
import { useStoryFabStore } from '@/stores/story-fab-store';
import type { EditorOutput, I18nLocale } from '@/entities/project-detail-page';

type ProjectStoryShellProps = {
  locale: I18nLocale;
  projectId: number;
  projectTitle: string;
  content: EditorOutput | null;
  emptyMessage: string;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onClose: () => void;
};

const panelTransition = {
  open: {
    type: 'spring' as const,
    damping: 30,
    stiffness: 210,
    mass: 0.9,
  },
  close: {
    type: 'spring' as const,
    damping: 34,
    stiffness: 260,
    mass: 0.8,
  },
};

const contentTransition = {
  open: { duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
  close: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
};

export function ProjectStoryShell({
  locale,
  projectTitle,
  content,
  emptyMessage,
  isLoading = false,
  isRefreshing = false,
  onClose,
}: ProjectStoryShellProps) {
  const t = useTranslations('projectStory');
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const isPcViewport = useMediaQuery({
    query: `(min-width: ${BREAKPOINTS.layoutShellTabletMin}px)`,
  });
  const isMobileFabBehavior = !isPcViewport;
  const fabVisible = useScrollRevealFab(scrollRoot, isMobileFabBehavior);
  const setOverlayFabSyncEnabled = useStoryFabStore(
    (state) => state.setOverlayFabSyncEnabled,
  );
  const setStoryFabVisible = useStoryFabStore((state) => state.setFabVisible);
  const resetFabVisible = useStoryFabStore((state) => state.resetFabVisible);
  const resetOverlayFabSync = useStoryFabStore(
    (state) => state.resetOverlayFabSync,
  );

  const setScrollContainerRef = useCallback((node: HTMLElement | null) => {
    setScrollRoot(node);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMobileFabBehavior) {
      setOverlayFabSyncEnabled(false);
      resetFabVisible();
      return;
    }
    setOverlayFabSyncEnabled(true);
    setStoryFabVisible(fabVisible);
  }, [
    fabVisible,
    isMobileFabBehavior,
    resetFabVisible,
    setOverlayFabSyncEnabled,
    setStoryFabVisible,
  ]);

  useEffect(
    () => () => {
      resetOverlayFabSync();
    },
    [resetOverlayFabSync],
  );

  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing((prev) => (prev ? prev : true));
  }, []);

  const finishClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isPcViewport) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, [contenteditable="true"]')
      ) {
        return;
      }

      event.preventDefault();
      handleClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, isPcViewport]);

  const showFloatingActions = isPcViewport || fabVisible;

  const floatingActionStack =
    isMounted && !isClosing ? (
      <OverlayBottomFabStack
        mounted={isMounted}
        visible={showFloatingActions}
        scrollRoot={scrollRoot}
        scrollToTopLabel={t('scrollToTop')}
        showScrollToTop
        showClose
        closeLabel={t('backToProject')}
        onClose={handleClose}
        closeDisabled={isClosing}
        closeBusy={isClosing}
      />
    ) : null;

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: isClosing ? '-100%' : 0 }}
      transition={isClosing ? panelTransition.close : panelTransition.open}
      onAnimationComplete={() => {
        if (isClosing) finishClose();
      }}
      className='fixed inset-0 z-100 flex flex-col bg-zinc-50 dark:bg-slate-950'
      role='dialog'
      aria-modal='true'
      aria-labelledby='project-story-title'
    >
      <header className='flex shrink-0 items-center gap-4 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-slate-950/90 sm:px-6'>
        <button
          type='button'
          onClick={handleClose}
          disabled={isClosing}
          aria-busy={isClosing}
          className='inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-wait disabled:opacity-70 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
        >
          <X size={18} aria-hidden />
          {t('backToProject')}
        </button>
        <p className='min-w-0 flex-1 truncate text-center text-xs font-black uppercase tracking-widest text-primary'>
          {isRefreshing ? t('loading') : t('storyLabel')}
        </p>
        <div className='shrink-0'>
          <ThemeToggle />
        </div>
      </header>

      <motion.main
        ref={setScrollContainerRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          y: isClosing ? 6 : 0,
        }}
        transition={
          isClosing ? contentTransition.close : contentTransition.open
        }
        className='flex-1 overflow-y-auto'
      >
        <div
          className={cn(
            STORY_CONTENT_SHELL_CLASS,
            'py-10',
            isMobileFabBehavior && OVERLAY_FAB_SAFE_PADDING_CLASS,
          )}
        >
        <header className='mb-10 space-y-2'>
          <h1
            id='project-story-title'
            className='text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100 sm:text-4xl'
          >
            {projectTitle}
          </h1>
        </header>
        {isLoading ? (
          <p className='animate-pulse px-2 py-16 text-center text-zinc-500'>
            {emptyMessage}
          </p>
        ) : content && content.blocks.length > 0 ? (
          <EditorJsRenderer content={content} locale={locale} />
        ) : (
          <p className='rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center text-zinc-500 dark:border-zinc-700'>
            {emptyMessage}
          </p>
        )}
        </div>
      </motion.main>
      {floatingActionStack}
    </motion.div>
  );
}
