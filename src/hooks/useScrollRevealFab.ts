'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_DIRECTION_THRESHOLD_PX = 4;
/** Ignore small upward deltas at the bottom (momentum / rubber-band bounce). */
const BOTTOM_BOUNCE_IGNORE_PX = 12;
const TOP_EDGE_THRESHOLD_PX = 4;

function readScrollMetrics(scrollRoot: HTMLElement | null, useWindowScroll: boolean) {
  if (useWindowScroll) {
    return {
      scrollTop: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: window.innerHeight,
    };
  }

  if (!scrollRoot) {
    return null;
  }

  return {
    scrollTop: scrollRoot.scrollTop,
    scrollHeight: scrollRoot.scrollHeight,
    clientHeight: scrollRoot.clientHeight,
  };
}

type UseScrollRevealFabOptions = {
  useWindowScroll?: boolean;
};

/**
 * Hides floating actions while scrolling down; reveals on intentional scroll up or at top.
 * Does not reveal when scroll momentum stops at the bottom after scrolling down.
 */
export function useScrollRevealFab(
  scrollRoot: HTMLElement | null,
  enabled: boolean,
  options?: UseScrollRevealFabOptions,
) {
  const useWindowScroll = options?.useWindowScroll ?? false;
  const [fabVisible, setFabVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setFabVisible(true);
      return;
    }

    if (!useWindowScroll && !scrollRoot) {
      return;
    }

    const initialMetrics = readScrollMetrics(scrollRoot, useWindowScroll);
    if (!initialMetrics) return;

    lastScrollTopRef.current = initialMetrics.scrollTop;

    const onScroll = () => {
      const metrics = readScrollMetrics(scrollRoot, useWindowScroll);
      if (!metrics) return;

      const { scrollTop, scrollHeight, clientHeight } = metrics;
      const delta = scrollTop - lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      if (scrollTop <= TOP_EDGE_THRESHOLD_PX) {
        setFabVisible(true);
        return;
      }

      if (delta > SCROLL_DIRECTION_THRESHOLD_PX) {
        setFabVisible(false);
        return;
      }

      if (delta < -SCROLL_DIRECTION_THRESHOLD_PX) {
        const atBottom =
          scrollTop + clientHeight >= scrollHeight - TOP_EDGE_THRESHOLD_PX;

        // Fling-down often ends with a tiny upward bounce at the bottom edge.
        if (atBottom && delta > -BOTTOM_BOUNCE_IGNORE_PX) {
          return;
        }

        setFabVisible(true);
      }
    };

    const target: HTMLElement | Window = useWindowScroll ? window : scrollRoot!;
    target.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      target.removeEventListener('scroll', onScroll);
    };
  }, [enabled, scrollRoot, useWindowScroll]);

  return fabVisible;
}
