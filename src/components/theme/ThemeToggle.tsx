'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GiStripedSun } from 'react-icons/gi';
import { FaMoon } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
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

  return (
    <div className='flex items-center gap-2'>
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'px-2 py-1 rounded-md bg-card cursor-pointer border',
          resolvedTheme === 'light' ? 'bg-black' : 'dark:bg-white'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label='Toggle theme'
      >
        {resolvedTheme === 'light' ? (
          <div className='flex items-center justify-center'>
            <p className='mr-1 text-white font-semibold'>Dark</p>
            <FaMoon className='w-5 h-5 text-white' />
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <p className='mr-1 text-black font-semibold'>Light</p>
            <GiStripedSun className='w-5 h-5 text-gray-900' />
          </div>
        )}
      </motion.button>
    </div>
  );
}
