'use client';

import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';
import TimelineDetail from '@/components/timeline/TimelineDetail';
import TimelineDrawer from '@/components/timeline/TimelineDrawer';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { type TimelineItem } from '@/types/timeline.type';
import { timelineData } from '@/data/timeline.data';

function MainContent({
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = timelineData.find((item) => item.id === itemId);
      if (item) {
        setSelectedItem(item);
        // 모바일과 태블릿에서는 drawer 열기
        if (window.innerWidth < 1280) {
          setIsDrawerOpen(true);
        }
      }
    }
  }, [searchParams, setIsDrawerOpen]);

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
      setIsDrawerOpen(false);
    }
  }, [pathname, searchParams, setIsDrawerOpen]);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id);
    window.history.replaceState({}, '', url.toString());

    // 모바일과 태블릿에서는 drawer 열기
    if (window.innerWidth < 1280) {
      setIsDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('item');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className='h-full lg:overflow-hidden'>
      <main className='h-full w-full flex flex-col pt-16 lg:overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='w-full lg:px-10 h-full'
        >
          {/* Desktop Layout (1280px+) */}
          <div className='hidden xl:grid xl:grid-cols-12 gap-6 lg:gap-8 h-full'>
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className='xl:col-span-3'
            >
              <Intro />
            </motion.div>

            {/* Timeline with scroll */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className='xl:col-span-4 pr-2'
            >
              <Timeline
                items={timelineData}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
              />
            </motion.div>

            {/* Timeline Detail with scroll - Desktop only */}
            <motion.div
              data-timeline-detail-container
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className='xl:col-span-5 h-full pr-2'
            >
              <TimelineDetail
                key={selectedItem?.id || 'empty'}
                item={selectedItem}
                isVisible={!!selectedItem}
              />
            </motion.div>
          </div>

          {/* Tablet Layout (1024px - 1279px) */}
          <div className='hidden lg:block xl:hidden'>
            <div className='grid grid-cols-2 gap-6 h-full'>
              {/* Intro */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              >
                <Intro />
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className='flex flex-col h-full'
              >
                <Timeline
                  items={timelineData}
                  selectedItem={selectedItem}
                  onItemClick={handleItemClick}
                />
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout (768px 미만) */}
          <div className='lg:hidden space-y-8'>
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <Intro />
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className='relative'
            >
              <Timeline
                items={timelineData}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
              />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Mobile/Tablet Drawer */}
      <TimelineDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

function Main({
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </Suspense>
  );
}

export default Main;
