type LayoutContext = {
  isMobile: boolean;
  isKeyboardOpen: boolean;
};

export function getChatbotPosition({ isMobile, isKeyboardOpen }: LayoutContext) {
  if (isMobile) return 'bottom-0';
  if (isKeyboardOpen) return 'bottom-4';
  return 'bottom-[100px]';
}

export function getChatbotHeight({ isMobile, isKeyboardOpen }: LayoutContext) {
  if (isMobile) return 'h-screen';
  if (isKeyboardOpen) return 'h-[50vh]';
  return 'h-[70vh]';
}

export function getChatbotWidth(isMobile: boolean) {
  return isMobile ? 'w-full left-0 right-0' : 'right-6 w-96';
}

export function getActualViewportHeight(
  isMobile: boolean,
  isKeyboardOpen: boolean,
) {
  if (!isMobile) return '100vh';
  if (typeof window === 'undefined') return '100vh';

  const vh = window.innerHeight;
  const vw = window.outerHeight;
  if (isKeyboardOpen || vh < vw * 0.9) return `${vh}px`;
  return '100vh';
}

export function getMobileKeyboardLayout(
  isMobile: boolean,
  isKeyboardOpen: boolean,
) {
  if (!isMobile) return {};
  if (isKeyboardOpen) {
    return {
      height: `${window.innerHeight}px`,
      transition: 'height 0.3s ease-in-out' as const,
    };
  }
  return { transition: 'height 0.3s ease-in-out' as const };
}

export function getMobileMessagesLayout(
  isMobile: boolean,
  isKeyboardOpen: boolean,
) {
  if (!isMobile) return {};
  if (isKeyboardOpen) {
    return {
      paddingTop: '70px',
      paddingBottom: '70px',
      height: `${window.innerHeight - 140}px`,
      overflowY: 'auto' as const,
      transition: 'all 0.3s ease-in-out' as const,
    };
  }
  return {
    paddingTop: '70px',
    paddingBottom: '0px',
    transition: 'all 0.3s ease-in-out' as const,
  };
}
