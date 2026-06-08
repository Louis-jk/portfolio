'use client';

import { motion } from 'framer-motion';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { cn } from '@/lib/utils';
import type { ChatbotData } from '@/types/chatbot';
import type { ChatMessage } from '@/stores/chatbot-store';
import {
  getActualViewportHeight,
  getChatbotHeight,
  getChatbotPosition,
  getChatbotWidth,
  getMobileKeyboardLayout,
  getMobileMessagesLayout,
} from '@/features/chatbot/lib/chatbot-layout';
import { ChatbotInputArea } from '@/features/chatbot/components/ChatbotInputArea';
import { ChatbotMessageList } from '@/features/chatbot/components/ChatbotMessageList';

type ChatbotWindowProps = {
  open: boolean;
  isMobile: boolean;
  isKeyboardOpen: boolean;
  resolvedTheme?: string;
  title: string;
  placeholder: string;
  resetToStartLabel: string;
  navigatingLabel: string;
  currentLocale: string;
  input: string;
  messages: ChatMessage[];
  chatbotData: ChatbotData;
  isStreamingReply: boolean;
  isNavigatingProject: boolean;
  router: AppRouterInstance;
  headerRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputAreaRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (value: boolean) => void;
  setInput: (value: string) => void;
  setMessages: (
    value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  setIsNavigatingProject: (value: boolean) => void;
  onInputFocus: () => void;
  onSend: () => void;
  onChoiceSelect: (text: string) => void;
};

export function ChatbotWindow({
  open,
  isMobile,
  isKeyboardOpen,
  resolvedTheme,
  title,
  placeholder,
  resetToStartLabel,
  navigatingLabel,
  currentLocale,
  input,
  messages,
  chatbotData,
  isStreamingReply,
  isNavigatingProject,
  router,
  headerRef,
  bottomRef,
  inputRef,
  inputAreaRef,
  setOpen,
  setInput,
  setMessages,
  setIsNavigatingProject,
  onInputFocus,
  onSend,
  onChoiceSelect,
}: ChatbotWindowProps) {
  if (!open) return null;

  const layoutCtx = { isMobile, isKeyboardOpen };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : 20, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isMobile ? 0 : 20, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        `fixed ${
          isMobile
            ? 'bottom-0 w-full left-0 right-0'
            : `${getChatbotPosition(layoutCtx)} ${getChatbotWidth(isMobile)} ${getChatbotHeight(layoutCtx)}`
        } flex flex-col z-[10000] font-sans`,
        resolvedTheme === 'dark'
          ? 'shadow-[0_8px_24px_rgba(255,255,255,0.15)]'
          : 'shadow-[0_8px_24px_rgba(0,0,0,0.15)]',
      )}
      style={{
        ...(isMobile
          ? {
              height: getActualViewportHeight(isMobile, isKeyboardOpen),
              bottom: 0,
              ...getMobileKeyboardLayout(isMobile, isKeyboardOpen),
            }
          : {}),
        touchAction: 'none',
        overscrollBehavior: 'none',
      }}
    >
      <div
        ref={headerRef}
        className={cn(
          'px-4 py-3 font-bold text-lg select-none border-b flex items-center justify-between flex-shrink-0 z-20 rounded-t-lg',
          resolvedTheme === 'dark'
            ? 'bg-purple-500 text-white border-gray-700'
            : 'bg-purple-700 text-white border-gray-200',
          isMobile ? 'absolute top-0 left-0 right-0 rounded-none' : '',
        )}
      >
        <div className='flex items-center gap-3'>
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              className='p-1 hover:bg-white/20 rounded-full transition-colors'
            >
              <IoArrowBack size={20} />
            </button>
          )}
          <span>{title}</span>
        </div>
        {!isMobile && (
          <button
            onClick={() => setOpen(false)}
            className='p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer'
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      <ChatbotMessageList
        messages={messages}
        currentLocale={currentLocale}
        resolvedTheme={resolvedTheme}
        isMobile={isMobile}
        isNavigatingProject={isNavigatingProject}
        bottomRef={bottomRef}
        messagesStyle={getMobileMessagesLayout(isMobile, isKeyboardOpen)}
        chatbotData={chatbotData}
        resetToStartLabel={resetToStartLabel}
        router={router}
        setOpen={setOpen}
        setIsNavigatingProject={setIsNavigatingProject}
        setMessages={setMessages}
        onChoiceSelect={onChoiceSelect}
      />

      <ChatbotInputArea
        input={input}
        isMobile={isMobile}
        resolvedTheme={resolvedTheme}
        placeholder={placeholder}
        disabled={!input.trim() || isStreamingReply || isNavigatingProject}
        inputRef={inputRef}
        inputAreaRef={inputAreaRef}
        onInputChange={setInput}
        onFocus={onInputFocus}
        onSubmit={onSend}
      />

      {isNavigatingProject && (
        <div className='absolute inset-0 z-40 bg-black/55 backdrop-blur-[1px] flex items-center justify-center px-6'>
          <div className='rounded-xl bg-white/95 text-black px-4 py-3 flex items-center gap-3 shadow-lg'>
            <span className='size-4 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin' />
            <span className='text-sm font-semibold'>{navigatingLabel}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
