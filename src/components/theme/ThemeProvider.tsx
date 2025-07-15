'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // 항상 라이트모드로 시작
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 클라이언트에서만 테마 결정
    const savedTheme = localStorage.getItem('theme') as Theme;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 방법 1: matchMedia
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemPrefersDark1 = mediaQuery.matches;
      const systemPrefersDark = systemPrefersDark1;

      const newTheme = systemPrefersDark ? 'dark' : 'light';

      setTheme(newTheme);
    }

    // 시스템 설정 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 사용자가 명시적으로 테마를 선택하지 않은 경우에만 시스템 설정 따름
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 테마 변경 시 HTML 클래스와 로컬 스토리지 업데이트
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 마운트되기 전까지는 라이트모드로 렌더링
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
