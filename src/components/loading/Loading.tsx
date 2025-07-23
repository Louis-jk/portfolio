'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number; // 로딩 지속 시간 (ms)
  isLoading?: boolean; // 실제 로딩 상태
}

export default function LoadingScreen({
  onComplete,
  duration = 800, // 0.8초로 단축
  isLoading = true, // 실제 로딩 상태를 받아옴
}: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('loading');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // 로딩이 완료되면 즉시 완료 콜백 실행
      setTimeout(() => {
        onComplete?.();
      }, 200);
      return;
    }

    // 지정된 시간 후에 로딩 완료 (fallback)
    const timer = setTimeout(() => {
      setTimeout(() => {
        onComplete?.();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete, isLoading]);

  // 로딩이 완료되면 컴포넌트를 숨김
  if (!isLoading) {
    return null;
  }

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        {mounted && (
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <div className='w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full'></div>
              <div className='absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin'></div>
              <div
                className='absolute top-2 left-2 w-8 h-8 border-2 border-transparent border-b-purple-400 rounded-full animate-spin'
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              ></div>
            </div>
            <p className='text-sm text-purple-600 dark:text-purple-400 font-medium'>
              {t('page')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
