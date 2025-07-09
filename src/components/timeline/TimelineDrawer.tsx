'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { type TimelineItem } from '@/types/timeline.type';
import { useTheme } from 'next-themes';
import { X } from 'lucide-react';

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
  const { resolvedTheme } = useTheme();

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
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed right-0 top-0 h-full w-full max-w-sm z-50 lg:hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold'>Work Details</h3>
              <button
                onClick={onClose}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className='h-full overflow-y-auto'>
              {item && item.details ? (
                <div className='p-4 space-y-6'>
                  {/* Header */}
                  <div>
                    <h3 className='text-xl font-bold mb-2'>{item.title}</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {item.date}
                    </p>
                  </div>

                  {/* Image */}
                  {item.details.image && (
                    <div className='relative h-40 rounded-lg overflow-hidden'>
                      <img
                        src={item.details.image}
                        alt={item.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  )}

                  {/* Full Description */}
                  <div>
                    <h4 className='text-lg font-semibold mb-3'>Overview</h4>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                      {item.details.fullDescription}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className='text-lg font-semibold mb-3'>Technologies</h4>
                    <div className='flex flex-wrap gap-2'>
                      {item.details.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            resolvedTheme === 'dark'
                              ? 'bg-gray-700 text-gray-200'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div>
                    <h4 className='text-lg font-semibold mb-3'>Challenges</h4>
                    <ul className='space-y-2'>
                      {item.details.challenges.map((challenge, index) => (
                        <li key={index} className='flex items-start'>
                          <span className='text-red-500 mr-2 mt-1'>•</span>
                          <span className='text-gray-700 dark:text-gray-300'>
                            {challenge}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className='text-lg font-semibold mb-3'>Achievements</h4>
                    <ul className='space-y-2'>
                      {item.details.achievements.map((achievement, index) => (
                        <li key={index} className='flex items-start'>
                          <span className='text-green-500 mr-2 mt-1'>✓</span>
                          <span className='text-gray-700 dark:text-gray-300'>
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center h-full p-4'>
                  <p className='text-gray-500 dark:text-gray-400 text-center'>
                    Select an item to view details
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
