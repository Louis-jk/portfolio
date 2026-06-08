'use client';

import { IoSend } from 'react-icons/io5';
import { cn } from '@/lib/utils';

type ChatbotInputAreaProps = {
  input: string;
  isMobile: boolean;
  resolvedTheme?: string;
  placeholder: string;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputAreaRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
};

export function ChatbotInputArea({
  input,
  isMobile,
  resolvedTheme,
  placeholder,
  disabled,
  inputRef,
  inputAreaRef,
  onInputChange,
  onFocus,
  onSubmit,
}: ChatbotInputAreaProps) {
  return (
    <div
      ref={inputAreaRef}
      className={`border-t flex-shrink-0 ${
        resolvedTheme === 'dark'
          ? 'border-gray-700 bg-[#111111]'
          : 'border-gray-200 bg-gray-50'
      }`}
      style={{ padding: isMobile ? '12px 16px' : '16px' }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className='flex gap-3 justify-center items-center'
      >
        <div className='flex-1 relative'>
          <input
            ref={inputRef}
            autoFocus={!isMobile}
            type='text'
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={onFocus}
            className={`w-full p-3 pr-12 rounded-lg border text-base font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
              resolvedTheme === 'dark'
                ? 'bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <button
          type='submit'
          disabled={disabled}
          className={cn(
            'size-[50px] rounded-lg text-white transition-all duration-200 flex items-center justify-center cursor-pointer',
            input.trim()
              ? resolvedTheme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 active:scale-95'
                : 'bg-gray-600 cursor-not-allowed'
              : resolvedTheme === 'dark'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gray-400 cursor-not-allowed',
          )}
        >
          <IoSend size={20} />
        </button>
      </form>
    </div>
  );
}
