'use client';

import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/constants/breakpoints';

/** Detects physical tablet / coarse-pointer touch devices (not viewport width). */
export function useTabletDevice() {
  const [isTabletDevice, setIsTabletDevice] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTabletByUA = /iPad|Android|Tablet/i.test(navigator.userAgent);
      const isTabletByTouch =
        'ontouchstart' in window && window.innerWidth >= BREAKPOINTS.tabletMin;
      const isTabletByPointer = window.matchMedia('(pointer: coarse)').matches;

      setIsTabletDevice(isTabletByUA || (isTabletByTouch && isTabletByPointer));
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isTabletDevice;
}
