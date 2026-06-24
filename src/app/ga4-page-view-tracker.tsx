'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackGa4PageView } from '@/lib/analytics/ga4';

export default function Ga4PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackGa4PageView(pagePath, document.title);
  }, [pathname, searchParams]);

  return null;
}
