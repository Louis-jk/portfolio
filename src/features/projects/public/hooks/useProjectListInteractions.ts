'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import type { RefObject } from 'react';
import type Lenis from 'lenis';
import {
  getCenteredScrollOffset,
  getScrollOffsetToRevealItem,
  scrollLenisTo,
} from '@/entities/projects/lib/project-list-scroll';
import type { ProjectView } from '@/entities/projects';

const SCROLL_DELAY_MS = 20;

type UseProjectListScrollOptions = {
  enabled: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  lenisRef: RefObject<Lenis | null>;
  itemRefs: RefObject<Map<string, HTMLElement | null>>;
  selectedItem: ProjectView | null;
  isKeyboardSelection: boolean;
  onKeyboardScrollDone: () => void;
};

export function useProjectListScroll({
  enabled,
  scrollRef,
  lenisRef,
  itemRefs,
  selectedItem,
  isKeyboardSelection,
  onKeyboardScrollDone,
}: UseProjectListScrollOptions) {
  useEffect(() => {
    if (!enabled || !selectedItem) return;

    const scrollContainer = scrollRef.current;
    const itemEl = itemRefs.current?.get(selectedItem.id.toString());
    const lenis = lenisRef.current;

    if (!scrollContainer || !itemEl || !lenis) return;

    const offset = getScrollOffsetToRevealItem(scrollContainer, itemEl);
    if (offset != null) {
      scrollLenisTo(lenis, offset);
    }
  }, [enabled, selectedItem, scrollRef, lenisRef, itemRefs]);

  useEffect(() => {
    if (!enabled || !isKeyboardSelection || !selectedItem) return;

    const scrollContainer = scrollRef.current;
    const itemEl = itemRefs.current?.get(selectedItem.id.toString());
    const lenis = lenisRef.current;

    if (!scrollContainer || !itemEl || !lenis) return;

    scrollLenisTo(lenis, getCenteredScrollOffset(scrollContainer, itemEl));
    setTimeout(onKeyboardScrollDone, SCROLL_DELAY_MS);
  }, [
    enabled,
    isKeyboardSelection,
    selectedItem,
    scrollRef,
    lenisRef,
    itemRefs,
    onKeyboardScrollDone,
  ]);
}

export function useProjectListKeyboardNav(
  items: ProjectView[],
  selectedIndex: number,
  onItemClick: (item: ProjectView) => void,
  onKeyboardSelect: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!items.length || selectedIndex === -1) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onKeyboardSelect();
        onItemClick(items[Math.max(selectedIndex - 1, 0)]);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onKeyboardSelect();
        onItemClick(items[Math.min(selectedIndex + 1, items.length - 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemClick, onKeyboardSelect]);
}

export function useProjectListHoverPreview(
  selectedItem: ProjectView | null,
  enabled: boolean,
) {
  const [hoveredItem, setHoveredItem] = useState<ProjectView | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (hoveredItem) {
      mouseX.set(target.x);
      mouseY.set(target.y);

      if (!showPreview) {
        const timer = setTimeout(() => setShowPreview(true), 30);
        return () => clearTimeout(timer);
      }
    } else {
      setShowPreview(false);
    }
  }, [hoveredItem, showPreview, target.x, target.y, mouseX, mouseY]);

  const updateTarget = useCallback((x: number, y: number) => {
    setTarget({ x, y });
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, item: ProjectView) => {
      if (!enabled) return;
      if (selectedItem?.id.toString() === item.id.toString()) return;

      updateTarget(e.clientX + 20, e.clientY - 40);
      setHoveredItem(item);
    },
    [enabled, selectedItem, updateTarget],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      updateTarget(e.clientX + 20, e.clientY - 40);
    },
    [enabled, updateTarget],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
    setShowPreview(false);
    setTarget({ x: 0, y: 0 });
  }, []);

  return {
    hoveredItem,
    showPreview,
    springX,
    springY,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };
}

export function useLayoutTabletScrollReset(
  isLayoutTablet: boolean,
  scrollRef: RefObject<HTMLDivElement | null>,
) {
  const prevLayoutTablet = useRef(isLayoutTablet);

  useEffect(() => {
    if (prevLayoutTablet.current === isLayoutTablet) return;

    scrollRef.current?.scrollTo({ top: 0 });
    prevLayoutTablet.current = isLayoutTablet;
  }, [isLayoutTablet, scrollRef]);
}
