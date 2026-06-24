'use client';

import { Suspense, type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';

const storybookMessages = {
  projectStory: {
    viewStory: '스토리 보기',
    backToProject: '프로젝트로 돌아가기',
    storyLabel: 'Project Story',
    loading: '스토리를 불러오는 중…',
    empty: '아직 등록된 상세 스토리가 없습니다.',
    untitled: '제목 없음',
  },
};

export function StorybookProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale='ko' messages={storybookMessages}>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
