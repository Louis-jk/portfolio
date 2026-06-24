'use client';

import { useMediaQuery } from 'react-responsive';
import { mediaQueries } from '@/constants/breakpoints';

/** Home shell layout: mobile (≤768) / 2-column (769–1279) / desktop (≥1280). */
export function useLayoutBreakpoints() {
  const isLayoutMobile = useMediaQuery({ query: mediaQueries.layoutMobile });
  const isLayoutTablet = useMediaQuery({ query: mediaQueries.layoutTablet });
  const isLayoutDesktop = useMediaQuery({ query: mediaQueries.layoutDesktop });

  return { isLayoutMobile, isLayoutTablet, isLayoutDesktop };
}
