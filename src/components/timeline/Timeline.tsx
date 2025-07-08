'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type TimelineItem, timelineData } from '@/types/timeline.type';
import LiquidButton from '../button/LiquidButton';
import { useTheme } from '../theme/ThemeProvider';

export default function Timeline() {
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

  return (
    <div className='relative mx-auto w-full max-w-md py-10'>
      <h2 className='text-3xl font-bold mb-5 text-center'>Work Experience</h2>
      <div
        className={`border-l-1 pl-7 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        }`}
      >
        {timelineData.map((item, index) => (
          <div
            key={index}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className='cursor-pointer'
          >
            <TimelineItem item={item} index={index} />
          </div>
        ))}
      </div>

      <div className='mt-12 text-center'>
        <Link href='/work'>
          <button className='px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full text-sm transition cursor-pointer'>
            View Full Timeline
          </button>
        </Link>
      </div>

      {showThumbnail &&
        hoveredItem &&
        createPortal(
          <LiquidButton x={springX} y={springY}>
            Click!
          </LiquidButton>,
          document.body
        )}
    </div>
  );
}

function TimelineItem({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Link href={item.link}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className='mb-5 cursor-pointer'
      >
        <div className='relative'>
          <div className='absolute -left-9 top-1 w-4 h-4 rounded-full border-4 bg-white' />
          <h3 className='text-lg font-semibold'>{item.date}</h3>
          <h4 className='text-xl font-bold mt-1'>{item.title}</h4>
          <ul className='list-disc ml-5 mt-2 text-sm space-y-1'>
            {item.description.map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Link>
  );
}
