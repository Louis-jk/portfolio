'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { type TimelineItem } from '@/types/timeline.type';
import { X } from 'lucide-react';
import TimelineDetail from './TimelineDetail';

interface TimelineDrawerProps {
  item: TimelineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TimelineDrawer({
  item,
  isOpen,
  onClose,
}: TimelineDrawerProps) {
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
            initial={{ y: '100%' }}
            animate={{ y: 55 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed right-0 top-0 h-full w-full z-50 xl:hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                Work Details
              </h3>
              <button
                onClick={onClose}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <X size={20} className='text-gray-600 dark:text-gray-400' />
              </button>
            </div>

            {/* Content */}
            <div className='h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-black'>
              <div className='p-4 pb-8'>
                <TimelineDetail item={item} isVisible={!!item} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
