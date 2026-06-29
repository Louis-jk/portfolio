'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OverlayBottomFabStack } from '@/features/projects/public/OverlayBottomFabStack';
import { useScrollRevealFab } from '@/hooks/useScrollRevealFab';

type MainMobileScrollToTopFabProps = {
  enabled: boolean;
};

export function MainMobileScrollToTopFab({
  enabled,
}: MainMobileScrollToTopFabProps) {
  const t = useTranslations('projects');
  const [isMounted, setIsMounted] = useState(false);
  const fabVisible = useScrollRevealFab(null, enabled, { useWindowScroll: true });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <OverlayBottomFabStack
      mounted={isMounted}
      visible={fabVisible}
      scrollRoot={null}
      useWindowScroll
      scrollToTopLabel={t('details.scrollToTop')}
      showScrollToTop
    />
  );
}
