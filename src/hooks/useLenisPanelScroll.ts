'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

type UseLenisPanelScrollOptions = {
  enabled: boolean;
  /** Resets scroll position when this value changes (e.g. selected project). */
  resetKey: unknown;
  /** Triggers lenis.resize() when content height may change. */
  resizeKey?: unknown;
};

/** Smooth scroll for a wrapper + inner content panel (project detail desktop). */
export function useLenisPanelScroll({
  enabled,
  resetKey,
  resizeKey,
}: UseLenisPanelScrollOptions) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || !scrollRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
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

  useEffect(() => {
    const lenis = lenisRef.current;
    const content = contentRef.current;
    if (!enabled || !lenis || !content) return;

    const syncScrollBounds = () => lenis.resize();
    syncScrollBounds();

    const observer = new ResizeObserver(syncScrollBounds);
    observer.observe(content);

    return () => observer.disconnect();
  }, [enabled, resizeKey]);

  useEffect(() => {
    if (!lenisRef.current) return;

    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      lenisRef.current?.scrollTo(0, { immediate: true });
    });
  }, [resetKey]);

  const notifyResize = () => lenisRef.current?.resize();

  return { scrollRef, contentRef, notifyResize };
}
