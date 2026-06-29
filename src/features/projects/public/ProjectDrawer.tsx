'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectView } from '@/entities/projects';
import { canShowPublicStoryLink } from '@/entities/projects/lib/story-access';
import { IoClose } from 'react-icons/io5';
import ProjectDetail from './ProjectDetail';
import { ProjectStoryViewLink } from './project-story/ProjectStoryViewLink';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { OverlayBottomFabStack } from '@/features/projects/public/OverlayBottomFabStack';
import { cn } from '@/lib/utils';
import { BREAKPOINTS } from '@/constants/breakpoints';
import { OVERLAY_FAB_SAFE_PADDING_CLASS } from '@/constants/story-layout';
import { useScrollRevealFab } from '@/hooks/useScrollRevealFab';
import { useStoryFabStore } from '@/stores/story-fab-store';

interface ProjectDrawerProps {
  item: ProjectView | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDrawer({
  item,
  isOpen,
  onClose,
}: ProjectDrawerProps) {
  const t = useTranslations('projects');
  const searchParams = useSearchParams();
  const isStoryOpen = searchParams.get('story') === '1';
  const isPcViewport = useMediaQuery({
    query: `(min-width: ${BREAKPOINTS.layoutShellTabletMin}px)`,
  });
  const isMobileFabBehavior = !isPcViewport;
  const [isMounted, setIsMounted] = useState(false);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const fabVisible = useScrollRevealFab(
    scrollRoot,
    isOpen && isMobileFabBehavior && !isStoryOpen,
  );
  const setOverlayFabSyncEnabled = useStoryFabStore(
    (state) => state.setOverlayFabSyncEnabled,
  );
  const setFabVisible = useStoryFabStore((state) => state.setFabVisible);
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
    if (!isOpen || !isMobileFabBehavior || isStoryOpen) {
      return;
    }

    setOverlayFabSyncEnabled(true);
    setFabVisible(fabVisible);
  }, [
    fabVisible,
    isMobileFabBehavior,
    isOpen,
    isStoryOpen,
    setFabVisible,
    setOverlayFabSyncEnabled,
  ]);

  useEffect(() => {
    if (!isOpen) {
      resetOverlayFabSync();
    }
  }, [isOpen, resetOverlayFabSync]);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const showFloatingActions =
    isOpen && isMobileFabBehavior && fabVisible && !isStoryOpen;

  const floatingActionStack =
    isMounted && isOpen && isMobileFabBehavior ? (
      <OverlayBottomFabStack
        mounted={isMounted}
        visible={showFloatingActions}
        scrollRoot={scrollRoot}
        scrollToTopLabel={t('details.scrollToTop')}
        showScrollToTop
        showClose
        closeLabel='Close project details'
        onClose={onClose}
      />
    ) : null;

  return (
    <>
      <AnimatePresence>
        {isOpen && item && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className='fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden'
            />

            <motion.div
              role='dialog'
              aria-modal='true'
              aria-labelledby='project-drawer-title'
              initial={{ y: '100%' }}
              animate={{ y: 55 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed right-0 bottom-0 flex h-full w-full flex-col z-50 xl:hidden'
            >
              <div className='flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-black'>
                <h3
                  id='project-drawer-title'
                  className='text-xl font-bold text-gray-900 dark:text-gray-100'
                >
                  {t('details.title')}
                </h3>
                <button
                  type='button'
                  onClick={onClose}
                  aria-label='Close project details'
                  className='rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <IoClose
                    size={22}
                    className='text-gray-600 dark:text-gray-300'
                  />
                </button>
              </div>

              <div
                ref={setScrollContainerRef}
                className='min-h-0 flex-1 overflow-y-auto bg-white dark:bg-black'
              >
                <div
                  className={cn(
                    'px-4',
                    isMobileFabBehavior && OVERLAY_FAB_SAFE_PADDING_CLASS,
                  )}
                >
                  {canShowPublicStoryLink(item) ? (
                    <div className='py-4'>
                      <ProjectStoryViewLink
                        projectId={item.id}
                        className='w-full justify-center'
                      />
                    </div>
                  ) : null}
                  <ProjectDetail
                    item={item}
                    isVisible={!!item}
                    showStoryLink={false}
                    embeddedInDrawer
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {floatingActionStack}
    </>
  );
}
