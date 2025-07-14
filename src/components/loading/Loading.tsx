'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  onComplete?: () => void;
  duration?: number; // 로딩 지속 시간 (ms)
}

export default function LoadingScreen({
  title = 'Portfolio',
  subtitle = 'Loading your experience...',
  showProgress = true,
  onComplete,
  duration = 2000, // 2초로 증가
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

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
    <div className='h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        {/* 로고 또는 타이틀 */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
            {title}
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>{subtitle}</p>
        </div>

        {/* 멋진 로딩 스피너 */}
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full'></div>
          <div className='absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin'></div>
          <div
            className='absolute top-2 left-2 w-12 h-12 border-2 border-transparent border-b-purple-400 rounded-full animate-spin'
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        {/* 진행 바 */}
        {showProgress && (
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
