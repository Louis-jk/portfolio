'use client';

import { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import loadingBlackData from '../../../public/lottie/loading_black.json';
import loadingWhiteData from '../../../public/lottie/loading_white.json';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'react-responsive';

interface LoadingScreenProps {
  showProgress?: boolean;
  onComplete?: () => void;
  duration?: number; // 로딩 지속 시간 (ms)
}

export default function LoadingScreen({
  showProgress = true,
  onComplete,
  duration = 2000, // 2초로 증가
}: LoadingScreenProps) {
  const { resolvedTheme } = useTheme();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
  const [mounted, setMounted] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { View } = useLottie({
    animationData:
      resolvedTheme === 'dark' ? loadingBlackData : loadingWhiteData,
    loop: true,
    autoplay: true,
  });

  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        // 더 부드러운 증가: 1-8% 사이에서 랜덤하게 증가
        return prev + Math.random() * 7 + 1;
      });
    }, 150); // 더 빠른 업데이트

    return () => clearInterval(interval);
  }, [showProgress]);

  useEffect(() => {
    // 지정된 시간 후에 로딩 완료
    const timer = setTimeout(() => {
      // 90%에서 100%까지 부드럽게 증가
      const finalInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(finalInterval);
            // 100% 표시 후 약간의 지연을 두고 완료 콜백 실행
            setTimeout(() => {
              onComplete?.();
            }, 300);
            return 100;
          }
          return prev + 1; // 1%씩 부드럽게 증가
        });
      }, 50); // 50ms마다 1%씩 증가
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div
          className={cn(
            `${mounted && (isMobile || isTablet ? 'w-75 h-75' : 'w-100 h-100')}`
          )}
        >
          {View}
        </div>

        {/* 진행 바 */}
        {mounted && showProgress && (
          <div className='w-64'>
            <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-2'>
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
