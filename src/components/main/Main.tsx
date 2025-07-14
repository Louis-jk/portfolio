'use client';

import Intro from '@/components/intro/Intro';
import Timeline from '@/components/timeline/Timeline';
import TimelineDetail from '@/components/timeline/TimelineDetail';
import TimelineDrawer from '@/components/timeline/TimelineDrawer';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { type TimelineItem } from '@/types/timeline.type';
import { timelineData } from '@/data/timeline.data';
import Lenis from 'lenis';

function MainContent() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const timelineDetailScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = timelineData.find((item) => item.id === itemId);
      if (item) {
        setSelectedItem(item);
        // 모바일에서는 drawer 열기
        if (window.innerWidth < 1024) {
          setIsDrawerOpen(true);
        }
      }
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
      setIsDrawerOpen(false);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!timelineDetailScrollRef.current) return;

    const lenis = new Lenis({
      wrapper: timelineDetailScrollRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id);
    window.history.replaceState({}, '', url.toString());

    // 모바일에서는 drawer 열기
    if (window.innerWidth < 1024) {
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
          className='w-full px-6 lg:px-10 h-full lg:overflow-hidden'
        >
          {/* Desktop Layout */}
          <div className='hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 h-full'>
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
              className='lg:col-span-4 pr-2'
            >
              <Timeline
                items={timelineData}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
              />
            </motion.div>

            {/* Timeline Detail with scroll - Desktop only */}
            <motion.div
              ref={timelineDetailScrollRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className='lg:col-span-5 overflow-y-auto max-h-[calc(100vh-6rem)] pr-2'
            >
              <div className='rounded-xl p-6 pb-8 min-h-[600px]'>
                <TimelineDetail
                  key={selectedItem?.id || 'empty'}
                  item={selectedItem}
                  isVisible={!!selectedItem}
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile Layout */}
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
              className='-mx-6 px-6'
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

function Main() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}

export default Main;
