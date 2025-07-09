'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch 방지를 위해 마운트 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center gap-2'>
        <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
      </div>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // system theme인 경우
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    }
  };

  const getThemeInfo = () => {
    if (theme === 'system') {
      return `System (${systemTheme})`;
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='text-xs text-gray-500 dark:text-gray-400'>
        {getThemeInfo()}
      </span>
      <motion.button
        onClick={toggleTheme}
        className='p-2 rounded-full shadow-md border hover:scale-110 transition-transform duration-200 bg-card border-border'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label='Toggle theme'
      >
        {resolvedTheme === 'light' ? (
          // Moon icon for dark mode
          <svg
            className='w-5 h-5 text-foreground'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg
            className='w-5 h-5 text-yellow-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
