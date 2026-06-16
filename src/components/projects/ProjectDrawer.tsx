'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectView } from '@/modules/projects';
import { IoClose } from 'react-icons/io5';
import ProjectDetail from './ProjectDetail';
import { ProjectStoryViewLink } from './project-story/ProjectStoryViewLink';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  return (
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
            className='fixed right-0 bottom-0 h-full w-full z-50 xl:hidden'
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black'>
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
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <IoClose
                  size={22}
                  className='text-gray-600 dark:text-gray-300'
                />
              </button>
            </div>

            <div className='overflow-y-auto bg-white dark:bg-black h-full'>
              <div className='px-4 py-0 h-full flex flex-col'>
                <div className='shrink-0 py-4'>
                  <ProjectStoryViewLink projectId={item.id} className='w-full justify-center' />
                </div>
                <div className='flex-1 min-h-0'>
                  <ProjectDetail
                    item={item}
                    isVisible={!!item}
                    showStoryLink={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
