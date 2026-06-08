'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ChatbotData } from '@/types/chatbot';
import type { ChatMessage } from '@/stores/chatbot-store';
import { formatTime } from '@/utils/time';
import { handleProjectLinkClick } from '@/features/chatbot/lib/handle-project-link-click';

function toDateSafe(value?: Date | string) {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

type ChatbotMessageListProps = {
  messages: ChatMessage[];
  currentLocale: string;
  resolvedTheme?: string;
  isMobile: boolean;
  isNavigatingProject: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  messagesStyle?: React.CSSProperties;
  chatbotData: ChatbotData;
  resetToStartLabel: string;
  router: AppRouterInstance;
  setOpen: (value: boolean) => void;
  setIsNavigatingProject: (value: boolean) => void;
  setMessages: (
    value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  onChoiceSelect: (text: string) => void;
};

export function ChatbotMessageList({
  messages,
  currentLocale,
  resolvedTheme,
  isMobile,
  isNavigatingProject,
  bottomRef,
  messagesStyle,
  chatbotData,
  resetToStartLabel,
  router,
  setOpen,
  setIsNavigatingProject,
  setMessages,
  onChoiceSelect,
}: ChatbotMessageListProps) {
  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden text-sm leading-relaxed w-full pt-4 ${
        resolvedTheme === 'dark' ? 'bg-[#111111]' : 'bg-white'
      }`}
      style={{
        ...messagesStyle,
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 ${
              m.from === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] ${
                m.from === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {m.from === 'bot' && (
                <div className='flex items-start gap-2'>
                  <Image
                    src='/images/chatbot_me.png'
                    alt='me'
                    width={40}
                    height={40}
                    className='rounded-full flex-shrink-0 select-none pointer-events-none'
                  />
                  <div className='flex flex-col'>
                    <div className='font-semibold bg-gray-100 text-black px-4 py-3 rounded-2xl break-words relative shadow-sm'>
                      {m.text.trim().length > 0 ? (
                        m.text
                      ) : (
                        <span
                          className='inline-flex items-center gap-1 text-gray-500'
                          aria-label='AI is typing'
                        >
                          <span className='size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]' />
                          <span className='size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]' />
                          <span className='size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]' />
                        </span>
                      )}
                      <div className='absolute left-1 top-4 w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-100' />
                    </div>
                    {m.timestamp && (
                      <div className='text-xs text-gray-500 mt-1 ml-2'>
                        {formatTime(
                          toDateSafe(m.timestamp) ?? new Date(),
                          currentLocale,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {m.from === 'user' && (
                <div className='flex items-start gap-2 flex-row-reverse mt-5 mb-3'>
                  <div className='flex flex-col items-end'>
                    <div
                      className={`font-normal ${
                        resolvedTheme === 'dark'
                          ? 'bg-purple-500'
                          : 'bg-purple-700'
                      } text-white px-4 py-3 rounded-2xl break-words relative shadow-sm`}
                    >
                      {m.text}
                    </div>
                    {m.timestamp && (
                      <div className='text-xs text-gray-500 mt-1 mr-2'>
                        {formatTime(
                          toDateSafe(m.timestamp) ?? new Date(),
                          currentLocale,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {m.isChoiceMessage && (
                <>
                  {m.contactButtons && m.contactButtons.length > 0 && (
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {m.contactButtons.map((button, buttonIndex) => (
                        <button
                          key={buttonIndex}
                          onClick={() => window.open(button.url, '_blank')}
                          className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                            resolvedTheme === 'dark'
                              ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                          }`}
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {m.goToProjectLink && m.goToProjectLink.length > 0 && (
                    <div className='mt-4 flex flex-col gap-2 w-full'>
                      {m.goToProjectLink.map((link, linkIndex) => (
                        <button
                          key={linkIndex}
                          onClick={() =>
                            handleProjectLinkClick({
                              url: link.url,
                              isMobile,
                              router,
                              setIsNavigatingProject,
                              setOpen,
                            })
                          }
                          disabled={isNavigatingProject}
                          className={`rounded-sm px-3 py-2 cursor-pointer text-sm select-none w-full max-w-full flex items-start transition-all duration-200 ${
                            resolvedTheme === 'dark'
                              ? 'bg-purple-500 hover:bg-purple-400 text-white'
                              : 'bg-purple-700 hover:bg-purple-600 text-white'
                          }`}
                        >
                          {link.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {m.choices && m.choices.length > 0 && (
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {m.choices.map((choice, choiceIndex) => (
                        <button
                          key={choiceIndex}
                          onClick={() => onChoiceSelect(choice.text)}
                          className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                            resolvedTheme === 'dark'
                              ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                          }`}
                        >
                          {choice.text}
                        </button>
                      ))}
                      {i > 0 && (
                        <button
                          onClick={() =>
                            setMessages([
                              {
                                id: `msg-${Date.now()}-reset`,
                                from: 'bot',
                                text: chatbotData.welcome.message,
                                timestamp: new Date(),
                                choices: chatbotData.welcome.choices.map(
                                  (id) => chatbotData.choices[id],
                                ),
                                isChoiceMessage: true,
                              },
                            ])
                          }
                          className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                            resolvedTheme === 'dark'
                              ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                          }`}
                        >
                          {resetToStartLabel}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
