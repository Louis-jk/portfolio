'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_UP_THRESHOLD_PX = 12;
const IDLE_REVEAL_MS = 1200;
const EDGE_THRESHOLD_PX = 4;

/**
 * Hides floating actions while scrolling down; reveals on scroll up, scroll idle, or at edges.
 */
export function useScrollRevealFab(
  scrollRoot: HTMLElement | null,
  enabled: boolean,
) {
  const [fabVisible, setFabVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setFabVisible(true);
      return;
    }

    const element = scrollRoot;
    if (!element) return;

    lastScrollTopRef.current = element.scrollTop;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const clearIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const scheduleIdleReveal = () => {
      clearIdleTimer();
      idleTimer = setTimeout(() => setFabVisible(true), IDLE_REVEAL_MS);
    };

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const delta = scrollTop - lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      const atTop = scrollTop <= EDGE_THRESHOLD_PX;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - EDGE_THRESHOLD_PX;

      if (atTop || atBottom) {
        clearIdleTimer();
        setFabVisible(true);
        return;
      }

      if (delta > 0) {
        clearIdleTimer();
        setFabVisible(false);
        return;
      }

      if (delta < -SCROLL_UP_THRESHOLD_PX) {
        clearIdleTimer();
        setFabVisible(true);
        return;
      }

      scheduleIdleReveal();
    };

    element.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', onScroll);
      clearIdleTimer();
    };
  }, [enabled, scrollRoot]);

  return fabVisible;
}
