'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectWithTranslations } from '@/services/project-service';
import { IoClose } from 'react-icons/io5';
import TimelineDetail from './TimelineDetail';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface TimelineDrawerProps {
  item: ProjectWithTranslations | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TimelineDrawer({
  item,
  isOpen,
  onClose,
}: TimelineDrawerProps) {
  // Drawer가 열렸을 때 배경 스크롤 방지

  const t = useTranslations('timeline');

  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body에 overflow: hidden 적용
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Drawer가 닫힐 때 스크롤 복원
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // 저장된 스크롤 위치로 복원
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden'
          />

          {/* Drawer */}
          <motion.div
            role='dialog'
            aria-modal='true'
            aria-labelledby='timeline-drawer-title'
            initial={{ y: '100%' }}
            animate={{ y: 55 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed right-0 bottom-0 h-full w-full z-50 xl:hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black'>
              <h3
                id='timeline-drawer-title'
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

            {/* Content */}
            <div className='overflow-y-auto bg-white dark:bg-black h-full'>
              <div className='px-4 py-0 h-full'>
                <TimelineDetail item={item} isVisible={!!item} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
