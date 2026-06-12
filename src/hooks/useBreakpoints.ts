'use client';

import { useMediaQuery } from 'react-responsive';
import { mediaQueries } from '@/constants/breakpoints';

/**
 * Project detail panel breakpoints (≤767 / 768–1223 / ≥1224).
 * For home shell layout use {@link useLayoutBreakpoints}.
 */
export function useBreakpoints() {
  const isDesktopOrLaptop = useMediaQuery({
    query: mediaQueries.desktopOrLaptop,
  });
  const isTablet = useMediaQuery({ query: mediaQueries.tablet });
  const isMobile = useMediaQuery({ query: mediaQueries.mobile });

  return { isDesktopOrLaptop, isTablet, isMobile };
}
