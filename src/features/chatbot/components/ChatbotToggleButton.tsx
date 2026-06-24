'use client';

import { IoChatboxEllipses, IoClose } from 'react-icons/io5';
import { cn } from '@/lib/utils';

type ChatbotToggleButtonProps = {
  open: boolean;
  resolvedTheme?: string;
  ariaLabel: string;
  visible?: boolean;
  onToggle: () => void;
};

export function ChatbotToggleButton({
  open,
  resolvedTheme,
  ariaLabel,
  visible = true,
  onToggle,
}: ChatbotToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed bottom-6 right-6 w-15 h-15 rounded-full text-white border-none cursor-pointer z-[10000] text-2xl flex items-center justify-center select-none transition-all duration-300 ease-in-out',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none',
        resolvedTheme === 'dark'
          ? 'bg-purple-500 hover:bg-purple-500 shadow-[0_4px_8px_rgba(255,255,255,0.3)]'
          : 'bg-purple-700 hover:bg-purple-700 shadow-[0_4px_8px_rgba(0,0,0,0.3)]',
      )}
    >
      {open ? <IoClose size={30} /> : <IoChatboxEllipses size={30} />}
    </button>
  );
}
