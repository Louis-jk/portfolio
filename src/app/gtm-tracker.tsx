'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function GTMTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const dataLayer = (
      window as {
        dataLayer?: { push: (data: { event: string; page: string }) => void };
      }
    )?.dataLayer;
    if (typeof window !== 'undefined' && dataLayer) {
      dataLayer.push({
        event: 'pageview',
        page: pathname,
      });
    }
  }, [pathname]);

  return null;
}
