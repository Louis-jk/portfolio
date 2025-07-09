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

  // URL 파라미터로 초기 아이템 설정
  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = timelineData.find((item) => item.id === itemId);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [searchParams]);

  // 홈 경로(/)일 때 selectedItem 초기화 (단, URL 파라미터가 있을 때는 제외)
  useEffect(() => {
    console.log('Current pathname:', pathname);
    const itemId = searchParams.get('item');

    // URL에 item 파라미터가 있으면 초기화하지 않음
    if (itemId) {
      console.log('URL has item parameter, skipping home path reset');
      return;
    }

    if (
      pathname === '/' ||
      pathname === '/en' ||
      pathname === '/ko' ||
      pathname === '/ja'
    ) {
      console.log('Home path detected, clearing selectedItem');
      setSelectedItem(null);
    }
  }, [pathname, searchParams]);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    // URL 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set('item', item.id);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <main className='w-full flex flex-col mx-auto pt-16'>
      {/* 3열 레이아웃 (데스크톱), 세로 스택 (모바일) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className='w-full px-6 lg:px-10'
      >
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
          {/* 첫 번째 열: Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className='lg:col-span-3'
          >
            <Intro />
          </motion.div>

          {/* 두 번째 열: Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className='lg:col-span-4 h-[calc(100vh-8rem)]'
          >
            <Timeline
              items={timelineData}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
            />
          </motion.div>

          {/* 세 번째 열: Timeline Detail (데스크톱에서만 표시) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className='hidden lg:block lg:col-span-5'
          >
            <div className='rounded-xl p-6 min-h-[600px]'>
              <TimelineDetail item={selectedItem} isVisible={!!selectedItem} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
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
