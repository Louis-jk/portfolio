'use client';

import { IoChatboxEllipses, IoClose } from 'react-icons/io5';
import { cn } from '@/lib/utils';

type ChatbotToggleButtonProps = {
  open: boolean;
  resolvedTheme?: string;
  ariaLabel: string;
  onToggle: () => void;
};

export function ChatbotToggleButton({
  open,
  resolvedTheme,
  ariaLabel,
  onToggle,
}: ChatbotToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={ariaLabel}
      className={cn(
        'fixed bottom-6 right-6 w-15 h-15 rounded-full text-white border-none cursor-pointer z-[10000] text-2xl flex items-center justify-center select-none transition-all duration-300 ease-in-out',
        resolvedTheme === 'dark'
          ? 'bg-purple-500 hover:bg-purple-500 shadow-[0_4px_8px_rgba(255,255,255,0.3)]'
          : 'bg-purple-700 hover:bg-purple-700 shadow-[0_4px_8px_rgba(0,0,0,0.3)]',
      )}
    >
      {open ? <IoClose size={30} /> : <IoChatboxEllipses size={30} />}
    </button>
  );
}
