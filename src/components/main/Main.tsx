'use client';

import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';
import TimelineDetail from '@/components/timeline/TimelineDetail';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { type TimelineItem } from '@/types/timeline.type';
import { timelineData } from '@/data/timeline.data';

function MainContent() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = timelineData.find((item) => item.id === itemId);
      if (item) setSelectedItem(item);
    }
  }, [searchParams]);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) return;

    if (
      pathname === '/' ||
      pathname === '/en' ||
      pathname === '/ko' ||
      pathname === '/ja'
    ) {
      setSelectedItem(null);
    }
  }, [pathname, searchParams]);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className='h-full overflow-hidden'>
      <main className='h-full w-full flex flex-col pt-16'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='w-full px-6 lg:px-10 h-full'
        >
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full'>
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className='lg:col-span-3'
            >
              <Intro />
            </motion.div>

            {/* Timeline with scroll */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className='lg:col-span-4 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2'
            >
              <Timeline
                items={timelineData}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
              />
            </motion.div>

            {/* Timeline Detail with scroll */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className='hidden lg:block lg:col-span-5 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2'
            >
              <div className='rounded-xl p-6 min-h-[600px]'>
                <TimelineDetail
                  item={selectedItem}
                  isVisible={!!selectedItem}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Main() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}

export default Main;
