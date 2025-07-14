'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TimelineItem } from '@/types/timeline.type';
import LiquidButton from '../button/LiquidButton';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Lenis from 'lenis';

interface TimelineProps {
  items: TimelineItem[];
  selectedItem: TimelineItem | null;
  onItemClick: (item: TimelineItem) => void;
}

export default function Timeline({
  items,
  selectedItem,
  onItemClick,
}: TimelineProps) {
  const t = useTranslations('timeline');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const lenisRef = useRef<Lenis | null>(null);

  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [visibleItems, setVisibleItems] = useState(5); // 모바일에서 처음 5개만 보이기
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const selectedIndex = items.findIndex((item) => item.id === selectedItem?.id);

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 스크롤 감지하여 아이템 점진적 표시 (모바일에서만)
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;

    const handleScroll = () => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 스크롤이 80% 이상일 때 더 많은 아이템 표시
      if (scrollPercentage > 0.8 && visibleItems < items.length) {
        setVisibleItems((prev) => Math.min(prev + 3, items.length));
      }
    };

    const scrollElement = scrollRef.current;
    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [isMobile, visibleItems, items.length]);

  // Lenis 초기화
  useEffect(() => {
    if (!scrollRef.current || isMobile) return;

    const wrapper = scrollRef.current;

    lenisRef.current = new Lenis({
      wrapper,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isMobile]);

  // 키보드 방향키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!items.length || selectedIndex === -1) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(selectedIndex - 1, 0);
        onItemClick(items[prevIndex]);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(selectedIndex + 1, items.length - 1);
        onItemClick(items[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemClick]);

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

  // 선택된 아이템 위치로 Lenis 스크롤 이동
  useEffect(() => {
    if (!selectedItem || isMobile) return;

    const scrollContainer = scrollRef.current;
    const itemEl = itemRefs.current.get(selectedItem.id);
    const lenis = lenisRef.current;

    if (!scrollContainer || !itemEl || !lenis) return;

    const headerOffset = 80;
    const containerRect = scrollContainer.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    if (itemRect.top < containerRect.top + headerOffset) {
      // 🔼 위쪽에 가려진 경우 → scrollTo로 부드럽게 이동
      const offset = itemEl.offsetTop - headerOffset - 20;
      setTimeout(() => {
        lenis.scrollTo(offset);
      }, 20);
    } else if (itemRect.bottom > containerRect.bottom) {
      // 🔽 아래쪽에 가려진 경우 → scrollTo로 부드럽게 이동
      const offset =
        itemEl.offsetTop -
        scrollContainer.clientHeight +
        itemEl.offsetHeight +
        80; // 더 많은 여백 추가
      setTimeout(() => {
        lenis.scrollTo(offset);
      }, 20);
    }
  }, [selectedItem, isMobile]);

  const handleMouseEnter = (e: React.MouseEvent, item: TimelineItem) => {
    if (selectedItem?.id === item.id) {
      return;
    }

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

  // 모바일에서는 visibleItems만큼만 렌더링
  const itemsToRender = isMobile ? items.slice(0, visibleItems) : items;

  return (
    <div className='flex flex-col'>
      <h2 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 mt-6'>
        Works & Experiences
      </h2>
      <div
        ref={scrollRef}
        className={`${
          isMobile
            ? 'pr-0'
            : 'pr-2 h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'
        }`}
      >
        {itemsToRender.map((item, index) => (
          <div key={item.id}>
            <motion.div
              ref={(el) => {
                itemRefs.current.set(item.id, el);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg  ${
                selectedItem?.id === item.id
                  ? 'bg-gray-100 dark:bg-gray-800/70'
                  : ''
              } ${isMobile ? 'p-3 mb-2' : 'p-4'}`}
              onClick={() => onItemClick(item)}
              onMouseEnter={
                !isMobile ? (e) => handleMouseEnter(e, item) : undefined
              }
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            >
              <div
                className={`${
                  isMobile
                    ? 'pr-0 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'
                    : ''
                }`}
              >
                <div className='flex items-start gap-3'>
                  {!isMobile && (
                    <div className='flex-shrink-0 mt-1'>
                      {selectedItem?.id === item.id ? (
                        <Check className='w-4 h-4 text-purple-500 dark:text-purple-400' />
                      ) : (
                        <div className='w-4 h-4' />
                      )}
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 justify-between'>
                      <h3
                        className={`font-bold text-base max-w-4/6 truncate transition-colors duration-200 ${
                          selectedItem?.id === item.id
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {t(item.title)}
                      </h3>
                      <p className='text-base font-medium dark:text-gray-400 mt-1'>
                        {t(item.region)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 justify-between'>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        {t(item.role)}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        {t(item.date)}
                      </p>
                    </div>
                    <ul className='list-disc ml-5 mt-3 text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                      {item.description.map((line: string, i: number) => (
                        <li key={i}>{t(line)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            {index < itemsToRender.length - 1 && (
              <div className='h-px border-t border-dashed border-gray-200 dark:border-gray-700 mx-4' />
            )}
          </div>
        ))}

        {/* 모바일에서 더 보기 버튼 */}
        {isMobile && visibleItems < items.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-4 text-center'
          >
            <button
              onClick={() =>
                setVisibleItems((prev) => Math.min(prev + 5, items.length))
              }
              className='px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              더 보기 ({visibleItems}/{items.length})
            </button>
          </motion.div>
        )}

        {/* 하단 여백 */}
        <div className='h-24'></div>
      </div>

      {showThumbnail &&
        hoveredItem &&
        !isMobile &&
        createPortal(
          <LiquidButton x={springX} y={springY}>
            Click!
          </LiquidButton>,
          document.body
        )}
    </div>
  );
}
