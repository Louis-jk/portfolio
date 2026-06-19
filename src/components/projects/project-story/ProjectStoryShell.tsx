'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { EditorJsRenderer } from '@/components/projects/project-story/editor';
import { STORY_CONTENT_SHELL_CLASS } from '@/constants/story-layout';
import type { EditorOutput, I18nLocale } from '@/modules/project-detail-page';

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

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
  };

  const finishClose = () => {
    onClose();
  };

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
      <header className='flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-slate-950/90 sm:px-6'>
        <button
          type='button'
          onClick={handleClose}
          disabled={isClosing}
          aria-busy={isClosing}
          className='inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-wait disabled:opacity-70 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
        >
          <X size={18} aria-hidden />
          {t('backToProject')}
        </button>
        <p className='truncate text-xs font-black uppercase tracking-widest text-primary'>
          {isRefreshing ? t('loading') : t('storyLabel')}
        </p>
      </header>

      <motion.main
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
        <div className={`${STORY_CONTENT_SHELL_CLASS} py-10`}>
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
    </motion.div>
  );
}
