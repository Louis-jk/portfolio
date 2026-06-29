'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SCROLL_TO_TOP_REVEAL_PX } from '@/constants/story-layout';

type OverlayBottomFabStackProps = {
  mounted: boolean;
  visible: boolean;
  scrollRoot: HTMLElement | null;
  scrollToTopLabel: string;
  useWindowScroll?: boolean;
  showScrollToTop?: boolean;
  showClose?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  closeDisabled?: boolean;
  closeBusy?: boolean;
};

export function OverlayBottomFabStack({
  mounted,
  visible,
  scrollRoot,
  scrollToTopLabel,
  useWindowScroll = false,
  showScrollToTop = true,
  showClose = false,
  closeLabel,
  onClose,
  closeDisabled = false,
  closeBusy = false,
}: OverlayBottomFabStackProps) {
  const [canScrollToTop, setCanScrollToTop] = useState(false);

  useEffect(() => {
    if ((!scrollRoot && !useWindowScroll) || !showScrollToTop) {
      setCanScrollToTop(false);
      return;
    }

    const update = () => {
      const scrollTop = useWindowScroll
        ? window.scrollY
        : scrollRoot?.scrollTop ?? 0;
      setCanScrollToTop(scrollTop > SCROLL_TO_TOP_REVEAL_PX);
    };

    update();
    const target: HTMLElement | Window = useWindowScroll ? window : scrollRoot!;
    target.addEventListener('scroll', update, { passive: true });

    return () => {
      target.removeEventListener('scroll', update);
    };
  }, [scrollRoot, showScrollToTop, useWindowScroll]);

  const showCloseButton = showClose && onClose;
  const showScrollToTopButton = showScrollToTop && canScrollToTop;

  if (!mounted || (!showCloseButton && !showScrollToTop)) {
    return null;
  }

  if (!showCloseButton && !showScrollToTopButton) {
    return null;
  }

  const handleScrollToTop = () => {
    if (useWindowScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    scrollRoot?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return createPortal(
    <div
      aria-hidden={!visible}
      className={cn(
        'fixed right-6 bottom-24 z-10001 flex flex-row-reverse items-center gap-3 transition-all duration-300 ease-in-out',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none',
      )}
    >
      {showCloseButton ? (
        <Button
          type='button'
          variant='point'
          onClick={onClose}
          disabled={closeDisabled}
          aria-busy={closeBusy}
          aria-label={closeLabel}
          tabIndex={visible ? 0 : -1}
          className='size-15 cursor-pointer rounded-full shadow-lg disabled:cursor-wait'
        >
          <X size={28} strokeWidth={3} aria-hidden />
        </Button>
      ) : null}
      {showScrollToTopButton && visible ? (
        <Button
          type='button'
          variant='outline'
          onClick={handleScrollToTop}
          aria-label={scrollToTopLabel}
          className='size-15 cursor-pointer rounded-full border-2 bg-background/95 shadow-lg backdrop-blur hover:bg-muted'
        >
          <ArrowUp size={26} strokeWidth={2.5} aria-hidden />
        </Button>
      ) : null}
    </div>,
    document.body,
  );
}
