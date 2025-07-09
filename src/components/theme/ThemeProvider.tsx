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
    console.log('=== ThemeProvider mounted ===');
    setMounted(true);

    // 클라이언트에서만 테마 결정
    const savedTheme = localStorage.getItem('theme') as Theme;
    console.log('Saved theme from localStorage:', savedTheme);

    if (savedTheme) {
      console.log('Using saved theme:', savedTheme);
      setTheme(savedTheme);
    } else {
      // 시스템 설정 확인 - 여러 방법 시도
      console.log('=== System theme detection ===');

      // 방법 1: matchMedia
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemPrefersDark1 = mediaQuery.matches;
      console.log('Method 1 - Media query matches (dark):', systemPrefersDark1);
      console.log('Method 1 - Media query string:', mediaQuery.media);

      // 방법 2: CSS 변수 확인
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const colorScheme = computedStyle.getPropertyValue('color-scheme');
      console.log('Method 2 - CSS color-scheme:', colorScheme);

      // 방법 3: 직접 확인
      const isDarkMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('Method 3 - Direct check:', isDarkMode);

      // 방법 4: 브라우저별 확인
      const userAgent = navigator.userAgent.toLowerCase();
      const isMac = userAgent.includes('mac');
      const isWindows = userAgent.includes('windows');
      console.log('Method 4 - OS detection:', { isMac, isWindows, userAgent });

      const systemPrefersDark = systemPrefersDark1;
      console.log('Final system prefers dark:', systemPrefersDark);

      const newTheme = systemPrefersDark ? 'dark' : 'light';
      console.log('Setting theme to:', newTheme);
      setTheme(newTheme);
    }

    // 시스템 설정 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('System theme changed!');
      console.log('New media query matches:', e.matches);
      console.log('Current localStorage theme:', localStorage.getItem('theme'));

      // 사용자가 명시적으로 테마를 선택하지 않은 경우에만 시스템 설정 따름
      if (!localStorage.getItem('theme')) {
        console.log('No saved theme, following system preference');
        setTheme(e.matches ? 'dark' : 'light');
      } else {
        console.log('Saved theme exists, ignoring system change');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log('=== Theme effect triggered ===');
    console.log('Current theme:', theme);
    console.log('Mounted:', mounted);

    // 테마 변경 시 HTML 클래스와 로컬 스토리지 업데이트
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    console.log('HTML classes after update:', root.classList.toString());
    console.log(
      'localStorage theme after update:',
      localStorage.getItem('theme')
    );
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 마운트되기 전까지는 라이트모드로 렌더링
  if (!mounted) {
    console.log('Rendering with light theme (not mounted)');
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  console.log('Rendering with theme:', theme);
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
