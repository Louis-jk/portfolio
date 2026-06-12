'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/** Smooth wheel scroll on a single wrapper element (project list desktop). */
export function useLenisWrapperScroll(enabled: boolean) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return { scrollRef, lenisRef };
}
