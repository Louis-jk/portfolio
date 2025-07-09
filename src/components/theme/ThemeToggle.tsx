'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';

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
        className='p-2 rounded-full shadow-md border hover:scale-110 transition-transform duration-200 bg-card border-border'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label='Toggle theme'
      >
        {resolvedTheme === 'light' ? (
          // Moon icon for dark mode
          <FaMoon className='w-5 h-5 text-foreground' />
        ) : (
          // Sun icon for light mode
          <FaSun className='w-5 h-5 text-yellow-400' />
        )}
      </motion.button>
    </div>
  );
}
