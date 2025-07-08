'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type TimelineItem, timelineData } from '@/types/timeline.type';
import LiquidButton from '../button/LiquidButton';
import { useTheme } from '../theme/ThemeProvider';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import TimelineDetail from './TimelineDetail';
import TimelineDrawer from './TimelineDrawer';

interface TimelineProps {
  initialSelectedItemId?: string | null;
}

export default function Timeline({
  initialSelectedItemId = null,
}: TimelineProps) {
  const { theme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const router = useRouter();
  const pathname = usePathname();

  // 상세 내용 관련 상태
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // locale을 제거한 실제 경로 확인
  const pathWithoutLocale = pathname.replace(/^\/(en|ko|ja)/, '') || '/';
  const isHomePage = pathWithoutLocale === '/';
  const isWorkPage = pathWithoutLocale === '/work';

  // URL 파라미터로 초기 선택된 항목 설정
  useEffect(() => {
    if (initialSelectedItemId && isWorkPage) {
      const item = timelineData.find(
        (item) => item.id === initialSelectedItemId
      );
      if (item) {
        setSelectedItem(item);
        // 모바일에서는 drawer 열기
        if (window.innerWidth < 1024) {
          setIsDrawerOpen(true);
        }
      }
    }
  }, [initialSelectedItemId, isWorkPage]);
  const data = isHomePage
    ? timelineData.slice(0, 3)
    : isWorkPage
    ? timelineData
    : timelineData.slice(0, 3);

  useEffect(() => {
    if (!showThumbnail) return;
    const interval = setInterval(() => {
      // pathIdx 업데이트 로직은 LiquidButton에서 처리
    }, 400);
    return () => clearInterval(interval);
  }, [showThumbnail]);

  useEffect(() => {
    if (hoveredItem) {
      mouseX.set(target.x, false);
      mouseY.set(target.y, false);

      // 최초에만 토글
      if (!showThumbnail) {
        const timer = setTimeout(() => {
          setShowThumbnail(true);
        }, 30);
        return () => clearTimeout(timer);
      }
    } else {
      setShowThumbnail(false);
    }
  }, [target.x, target.y, hoveredItem, showThumbnail, mouseX, mouseY]);

  const handleMouseEnter = (e: React.MouseEvent, item: TimelineItem) => {
    const x = e.clientX + 20;
    const y = e.clientY - 40;
    setTarget({ x, y });
    setHoveredItem(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX + 20;
    const y = e.clientY - 40;
    setTarget({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setShowThumbnail(false);
    setTarget({ x: 0, y: 0 });
  };

  const handleItemClick = (item: TimelineItem) => {
    if (isWorkPage) {
      setSelectedItem(item);
      // URL 업데이트
      const url = new URL(window.location.href);
      url.searchParams.set('item', item.id);
      window.history.replaceState({}, '', url.toString());
      // 모바일에서는 drawer 열기
      if (window.innerWidth < 1024) {
        setIsDrawerOpen(true);
      }
    } else {
      // 홈페이지에서는 work 페이지로 이동하면서 해당 항목 ID 전달
      router.push(`/work?item=${item.id}`);
    }
  };

  return (
    <div
      className={cn(
        'relative mx-auto py-10',
        isWorkPage ? 'w-full lg:flex lg:gap-12' : 'max-w-md'
      )}
    >
      <div
        className={cn(isWorkPage ? 'lg:w-1/2 lg:sticky lg:top-8' : 'w-full')}
      >
        <h2
          className={cn(
            'text-3xl font-bold text-center',
            isWorkPage ? 'mb-10' : 'mb-5'
          )}
        >
          Work Experience
        </h2>
        <div
          className={cn(
            'border-l-1 pl-7',
            isWorkPage &&
              'bg-gray-50 dark:bg-zinc-900 dark:shadow-lg rounded-xl p-6 pl-8 border-0'
          )}
          style={{
            borderLeftColor: theme === 'dark' ? '#3f3f46' : '#d1d5db',
          }}
        >
          {data.map((item: TimelineItem, index: number) => (
            <div
              key={index}
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleItemClick(item)}
              className='cursor-pointer'
            >
              <TimelineItem item={item} index={index} isWorkPage={isWorkPage} />
            </div>
          ))}
        </div>
      </div>

      {isHomePage && (
        <div className='mt-12 text-center'>
          <button
            className='px-6 py-2 text-white rounded-full text-sm transition cursor-pointer'
            style={{
              backgroundColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#4f46e5' : '#4338ca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#6366f1' : '#4f46e5';
            }}
            onClick={() => router.push('/work')}
          >
            View All Experience
          </button>
        </div>
      )}

      {showThumbnail &&
        hoveredItem &&
        createPortal(
          <LiquidButton x={springX} y={springY}>
            Click!
          </LiquidButton>,
          document.body
        )}

      {/* 상세 내용 */}
      {isWorkPage && (
        <div className='hidden lg:block lg:w-full'>
          <h2
            className={cn(
              'text-3xl font-bold text-center',
              isWorkPage ? 'mb-10' : 'mb-5'
            )}
          >
            Detail View
          </h2>
          <div className='bg-gray-50 dark:bg-zinc-900 dark:shadow-lg rounded-xl p-8 border-0 min-h-[600px]'>
            <TimelineDetail item={selectedItem} isVisible={!!selectedItem} />
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <TimelineDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          // URL에서 파라미터 제거
          const url = new URL(window.location.href);
          url.searchParams.delete('item');
          window.history.replaceState({}, '', url.toString());
        }}
      />
    </div>
  );
}

function TimelineItem({
  item,
  index,
  isWorkPage,
}: {
  item: TimelineItem;
  index: number;
  isWorkPage: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={cn(
        'mb-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:shadow-md rounded-xl py-3 px-4 transition-all duration-300',
        isWorkPage && 'mb-8'
      )}
    >
      <div className='relative'>
        <div className='absolute -left-12.5 top-2 w-3 h-3 rounded-full border-4 border-black dark:border-white bg-black dark:bg-white' />
        <h3 className='text-lg font-semibold'>{item.date}</h3>
        <h4 className='text-xl font-bold mt-1'>{item.title}</h4>
        <ul className='list-disc ml-5 mt-2 text-sm space-y-1'>
          {item.description.map((line: string, i: number) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
