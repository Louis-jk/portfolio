'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 로컬 스토리지에서 테마 가져오기
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 시스템 설정 확인
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 테마 변경 시 HTML 클래스와 로컬 스토리지 업데이트
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // body 배경색과 텍스트 색상 직접 제어
    if (theme === 'dark') {
      body.style.backgroundColor = '#0a0a0a';
      body.style.color = '#ededed';
    } else {
      body.style.backgroundColor = '#fefefe';
      body.style.color = '#171717';
    }

    // 디버깅용 로그
    console.log('Theme changed to:', theme);
    console.log('HTML classes:', root.classList.toString());
  }, [theme, mounted]);

  // 초기 렌더링 시 HTML 클래스와 body 스타일 즉시 설정
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (!root.classList.contains('light') && !root.classList.contains('dark')) {
      root.classList.add(theme);
    }

    // 초기 body 스타일 설정
    if (theme === 'dark') {
      body.style.backgroundColor = '#0a0a0a';
      body.style.color = '#ededed';
    } else {
      body.style.backgroundColor = '#fefefe';
      body.style.color = '#171717';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
