'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { FaLinkedin } from 'react-icons/fa6';
import { SiMinutemailer } from 'react-icons/si';

import {
  IoChatboxEllipses,
  IoClose,
  IoSend,
  IoArrowBack,
} from 'react-icons/io5';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type Message = {
  from: 'user' | 'bot';
  text: string;
  choices?: string[];
  isChoiceMessage?: boolean;
  contactButtons?: {
    text: React.ReactNode;
    action: string;
    url: string;
  }[];
};

type FAQItem = {
  question: string;
  answer: string;
  followUpChoices?: string[];
  contactButtons?: {
    text: React.ReactNode;
    action: string;
    url: string;
  }[];
};

export default function Chatbot() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('modal.chatbot');
  const isKeyboardOpen = useDetectKeyboardOpen();

  const faqs: FAQItem[] = useMemo(
    () => [
      {
        question: t('whatIsMySkill.question'),
        answer: t('whatIsMySkill.answer'),
        followUpChoices: [
          t('whatIsMySkill.followUpChoices.0.question'),
          t('whatIsMySkill.followUpChoices.1.question'),
          t('whatIsMySkill.followUpChoices.2.question'),
        ],
      },
      {
        question: t('projectExperience.question'),
        answer: t('projectExperience.answer'),
        followUpChoices: [
          t('projectExperience.followUpChoices.0.question'),
          t('projectExperience.followUpChoices.1.question'),
          t('projectExperience.followUpChoices.2.question'),
        ],
      },
      {
        question: t('languages.question'),
        answer: t('languages.answer'),
        followUpChoices: [
          t('languages.followUpChoices.0.question'),
          t('languages.followUpChoices.1.question'),
          t('languages.followUpChoices.2.question'),
        ],
      },
      {
        question: t('workStyle.question'),
        answer: t('workStyle.answer'),
        followUpChoices: [
          t('workStyle.followUpChoices.0.question'),
          t('workStyle.followUpChoices.1.question'),
          t('workStyle.followUpChoices.2.question'),
        ],
      },
      {
        question: t('strengths.question'),
        answer: t('strengths.answer'),
        followUpChoices: [
          t('strengths.followUpChoices.0.question'),
          t('strengths.followUpChoices.1.question'),
          t('strengths.followUpChoices.2.question'),
        ],
      },
      {
        question: t('interestedIn.question'),
        answer: t('interestedIn.answer'),
        followUpChoices: [
          t('interestedIn.followUpChoices.0.question'),
          t('interestedIn.followUpChoices.1.question'),
          t('interestedIn.followUpChoices.2.question'),
          t('interestedIn.followUpChoices.3.question'),
          t('interestedIn.followUpChoices.4.question'),
        ],
      },
      {
        question: t('contact.question'),
        answer: t('contact.answer'),
        contactButtons: [
          {
            text: (
              <p className='flex items-center gap-2'>
                <SiMinutemailer size={16} />
                <span>{t('contact.contactButtons.0.text')}</span>
              </p>
            ),
            action: t('contact.contactButtons.0.action'),
            url: t('contact.contactButtons.0.url'),
          },
          {
            text: (
              <p className='flex items-center gap-2'>
                <FaLinkedin size={16} />
                <span>{t('contact.contactButtons.1.text')}</span>
              </p>
            ),
            action: t('contact.contactButtons.1.action'),
            url: t('contact.contactButtons.1.url'),
          },
        ],
      },
    ],
    [t]
  );

  // faqs 배열에서 followUpChoices를 포함한 모든 답변을 수집
  const followUpAnswers = useMemo(() => {
    const answers: Record<string, string> = {};

    // faqs 배열에서 직접 followUpChoices 정보를 가져옴
    faqs.forEach((faq) => {
      if (faq.followUpChoices && Array.isArray(faq.followUpChoices)) {
        faq.followUpChoices.forEach((choice) => {
          if (typeof choice === 'string' && choice.trim() !== '') {
            // choice가 문자열인 경우, 해당 질문에 대한 답변을 찾아야 함
            // 이는 faqs 배열의 다른 항목에서 찾을 수 있음
            const matchingFaq = faqs.find((f) => f.question === choice);
            if (matchingFaq) {
              answers[choice] = matchingFaq.answer;
            }
          }
        });
      }
    });

    return answers;
  }, [faqs]); // faqs 배열을 의존성으로 추가

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: t('description'),
      choices: faqs.map((faq) => faq.question),
      isChoiceMessage: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(faqs, { keys: ['question'], threshold: 0.3 });

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 뷰포트 높이 감지 및 키보드 상태 체크
  useEffect(() => {
    const updateViewportHeight = () => {
      // 모바일에서만 키보드 상태 감지
      if (isMobile) {
        // 키보드 상태 변화는 use-detect-keyboard-open 라이브러리가 처리
        // 추가 리렌더링 불필요
      }
    };

    // 초기 설정
    updateViewportHeight();

    // 리사이즈 이벤트 리스너 (디바운싱 적용)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewportHeight, 100);
    };

    window.addEventListener('resize', handleResize);

    // 모바일에서 키보드 열림/닫힘 감지 (visualViewport API 사용)
    if ('visualViewport' in window && isMobile) {
      const visualViewport = (
        window as Window & { visualViewport: VisualViewport }
      ).visualViewport;
      visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if ('visualViewport' in window && isMobile) {
        const visualViewport = (
          window as Window & { visualViewport: VisualViewport }
        ).visualViewport;
        visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isKeyboardOpen, isMobile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && isMobile) {
      // 모바일에서만 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;

      return () => {
        // 컴포넌트 언마운트 시 스크롤 방지 해제
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      };
    }
  }, [open, isMobile]);

  // PC에서 스크롤 방지 없이 챗봇만 모달로 처리
  useEffect(() => {
    if (open && !isMobile) {
      // PC에서는 body에 클래스만 추가하여 CSS로 처리
      document.body.classList.add('chatbot-open');

      // backdrop을 body에 직접 추가하여 스크롤바 영역까지 완벽하게 덮기
      const backdrop = document.createElement('div');
      backdrop.className = 'chatbot-backdrop-overlay';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        pointer-events: auto;
      `;
      backdrop.onclick = () => setOpen(false);
      document.body.appendChild(backdrop);

      return () => {
        document.body.classList.remove('chatbot-open');
        // backdrop 제거
        const existingBackdrop = document.querySelector(
          '.chatbot-backdrop-overlay'
        );
        if (existingBackdrop) {
          existingBackdrop.remove();
        }
      };
    }
  }, [open, isMobile]);

  useEffect(() => {
    if (open && messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages.length]);

  // 키보드 상태 변화 시 스크롤 조정
  useEffect(() => {
    if (open && isMobile) {
      // 약간의 지연 후 스크롤 조정 (키보드 애니메이션 완료 후)
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isKeyboardOpen, open, isMobile]);

  // 입력 필드 포커스 시 스크롤 조정
  const handleInputFocus = () => {
    if (!isMobile) return;

    // 모바일에서 포커스 시 스크롤을 하단으로 조정
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const sendMessage = (userMsg: string) => {
    const trimmed = userMsg.trim();
    if (!trimmed) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: trimmed }]);

    // FAQ에서 답변 찾기
    const result = fuse.search(trimmed);
    const bestMatch = result.length > 0 ? result[0].item : null;

    let reply = '';
    let followUpChoices: string[] = [];
    let contactButtons:
      | { text: React.ReactNode; action: string; url: string }[]
      | undefined;

    if (bestMatch) {
      reply = bestMatch.answer;
      followUpChoices = bestMatch.followUpChoices || [];
      contactButtons = bestMatch.contactButtons;
    } else if (followUpAnswers[trimmed]) {
      reply = followUpAnswers[trimmed];
      // 추가 답변 후에도 기본 질문들 제공
      followUpChoices = faqs.map((faq) => faq.question);
    } else {
      reply = t('sorry');
      followUpChoices = faqs.map((faq) => faq.question);
    }

    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: reply,
          choices: followUpChoices,
          contactButtons: contactButtons,
          isChoiceMessage: true,
        },
      ]);
    }, 800);

    setInput('');

    // 모바일에서 메시지 전송 후 키보드 숨기기
    if (isMobile && inputRef.current) {
      bottomRef.current?.blur();
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
    }
  };

  // 키보드가 열렸을 때의 챗봇 위치 계산 (데스크톱만)
  const getChatbotPosition = () => {
    if (isMobile) return 'bottom-0';
    if (isKeyboardOpen) {
      return 'bottom-4';
    }
    return 'bottom-[100px]';
  };

  // 키보드가 열렸을 때의 챗봇 높이 계산 (데스크톱만)
  const getChatbotHeight = () => {
    if (isMobile) return 'h-screen';
    if (isKeyboardOpen) {
      return 'h-[50vh]';
    }
    return 'h-[70vh]';
  };

  // 모바일에서 전체화면, 데스크톱에서 기존 크기
  const getChatbotWidth = () => {
    if (isMobile) return 'w-full left-0 right-0';
    return 'right-6 w-96'; // 오른쪽 정렬로 수정
  };

  // 아이폰 사파리 어드레스바 문제 해결을 위한 실제 사용 가능한 높이 계산
  const getActualViewportHeight = () => {
    if (!isMobile) return '100vh';

    // 아이폰 사파리에서 어드레스바 상태를 고려한 높이 계산
    const vh = window.innerHeight;
    const vw = window.outerHeight;

    // 어드레스바가 올라와 있거나 키보드가 열려있을 때
    if (isKeyboardOpen || vh < vw * 0.9) {
      return `${vh}px`;
    }

    // 어드레스바가 내려가 있을 때는 전체 화면 사용
    return '100vh';
  };

  // 모바일에서 키보드 상태에 따른 레이아웃 조정
  const getMobileKeyboardLayout = () => {
    if (!isMobile) return {};

    if (isKeyboardOpen) {
      // 키보드가 열렸을 때는 헤더를 고정하고 컨텐츠를 스크롤 가능하게
      return {
        height: `${window.innerHeight}px`,
        // overflow: 'hidden' 제거하여 자연스러운 전환
        transition: 'height 0.3s ease-in-out' as const,
      };
    }

    return {
      transition: 'height 0.3s ease-in-out' as const,
    };
  };

  // 모바일에서 키보드 상태에 따른 메시지 영역 조정
  const getMobileMessagesLayout = () => {
    if (!isMobile) return {};

    if (isKeyboardOpen) {
      // 키보드가 열렸을 때는 헤더 아래부터 input 영역 위까지 스크롤
      return {
        paddingTop: '70px', // 헤더 높이
        paddingBottom: '70px', // input 영역 높이
        height: `${window.innerHeight - 140}px`, // 전체 높이 - 헤더 - input
        overflowY: 'auto' as const,
        transition: 'all 0.3s ease-in-out' as const,
      };
    }

    return {
      paddingTop: '70px',
      paddingBottom: '0px',
      transition: 'all 0.3s ease-in-out' as const,
    };
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? t('close') : t('open')}
        className={cn(
          'fixed bottom-6 right-6 w-15 h-15 rounded-full text-white border-none cursor-pointer z-[10000] text-2xl flex items-center justify-center select-none transition-all duration-300 ease-in-out',
          resolvedTheme === 'dark'
            ? 'bg-purple-500 hover:bg-purple-500 shadow-[0_4px_8px_rgba(255,255,255,0.3)]'
            : 'bg-purple-700 hover:bg-purple-700 shadow-[0_4px_8px_rgba(0,0,0,0.3)]'
        )}
      >
        {open ? <IoClose size={30} /> : <IoChatboxEllipses size={30} />}
      </button>

      {/* Chatbot */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className={cn(
                'fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[9999] chatbot-backdrop',
                !isMobile && 'hidden' // PC에서는 숨김 (별도 backdrop 사용)
              )}
              style={{
                touchAction: 'none',
                overscrollBehavior: 'none',
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Chat Window */}
            <motion.div
              initial={{
                opacity: 0,
                y: isMobile ? 0 : 20,
                scale: 1,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: isMobile ? 0 : 20,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                `fixed ${
                  isMobile
                    ? 'bottom-0 w-full left-0 right-0'
                    : `${getChatbotPosition()} ${getChatbotWidth()} ${getChatbotHeight()}`
                } flex flex-col z-[10000] font-sans`,
                resolvedTheme === 'dark'
                  ? 'shadow-[0_8px_24px_rgba(255,255,255,0.15)]'
                  : 'shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
              )}
              style={{
                ...(isMobile
                  ? {
                      height: getActualViewportHeight(),
                      bottom: 0,
                      ...getMobileKeyboardLayout(),
                    }
                  : {}),
                touchAction: 'none',
                overscrollBehavior: 'none',
              }}
            >
              {/* Header */}
              <div
                ref={headerRef}
                className={cn(
                  'px-4 py-3 font-bold text-lg select-none border-b flex items-center justify-between flex-shrink-0 z-20 rounded-t-lg',
                  resolvedTheme === 'dark'
                    ? 'bg-purple-500 text-white border-gray-700'
                    : 'bg-purple-700 text-white border-gray-200',
                  isMobile ? 'absolute top-0 left-0 right-0 rounded-none' : '' // 모바일에서만 absolute
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
                  <span>{t('title')}</span>
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

              {/* Messages */}
              <div
                className={`flex-1 overflow-y-auto overflow-x-hidden text-sm leading-relaxed w-full ${
                  resolvedTheme === 'dark' ? 'bg-[#111111]' : 'bg-white'
                }`}
                style={{
                  ...(isMobile ? getMobileMessagesLayout() : {}),
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-4 ${
                        m.from === 'user'
                          ? 'flex justify-end'
                          : 'flex justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] ${
                          m.from === 'user' ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div
                          className={`font-${
                            m.from === 'bot' ? 'semibold' : 'normal'
                          } bg-${
                            m.from === 'bot'
                              ? 'gray-100'
                              : resolvedTheme === 'dark'
                              ? 'purple-500'
                              : 'purple-700'
                          } text-${
                            m.from === 'bot' ? 'black' : 'white'
                          } px-4 py-3 rounded-2xl break-words relative shadow-sm`}
                        >
                          {m.text}
                          {/* 말풍선 꼬리 */}
                          <div
                            className={`absolute bottom-0 ${
                              m.from === 'user' ? 'right-4' : 'left-4'
                            } w-3 h-3 transform translate-y-1/2 rotate-45`}
                            style={{
                              backgroundColor:
                                m.from === 'bot'
                                  ? '#f3f4f6'
                                  : resolvedTheme === 'dark'
                                  ? '#ad46ff'
                                  : '#8200db',
                            }}
                          />
                        </div>

                        {/* 선택지 버튼들 또는 연락 버튼들 */}
                        {m.isChoiceMessage && (
                          <>
                            {/* 연락 버튼들 */}
                            {m.contactButtons &&
                              m.contactButtons.length > 0 && (
                                <div className='mt-4 flex flex-wrap gap-2'>
                                  {m.contactButtons.map(
                                    (button, buttonIndex) => (
                                      <button
                                        key={buttonIndex}
                                        onClick={() =>
                                          window.open(button.url, '_blank')
                                        }
                                        className={`border border-dashed rounded-full px-4 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                                          resolvedTheme === 'dark'
                                            ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                                        }`}
                                      >
                                        {button.text}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}

                            {/* 기존 선택지 버튼들 */}
                            {m.choices && m.choices.length > 0 && (
                              <div className='mt-4 flex flex-wrap gap-2'>
                                {m.choices.map((choice, choiceIndex) => (
                                  <button
                                    key={choiceIndex}
                                    onClick={() => sendMessage(choice)}
                                    className={`border border-dashed rounded-full px-4 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                                      resolvedTheme === 'dark'
                                        ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                                    }`}
                                  >
                                    {choice}
                                  </button>
                                ))}
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

              {/* Input Area */}
              <div
                ref={inputAreaRef}
                className={`border-t flex-shrink-0 ${
                  resolvedTheme === 'dark'
                    ? 'border-gray-700 bg-[#111111]'
                    : 'border-gray-200 bg-gray-50'
                }`}
                style={{
                  padding: isMobile ? '12px 16px' : '16px',
                }}
              >
                <div className='flex gap-3 justify-center items-center'>
                  <div className='flex-1 relative'>
                    <input
                      ref={inputRef}
                      autoFocus={!isMobile}
                      type='text'
                      placeholder={t('placeholder')}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={handleInputFocus}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      className={`w-full p-3 pr-12 rounded-lg border text-base font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        resolvedTheme === 'dark'
                          ? 'bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className={cn(
                      'size-[50px] rounded-lg text-white transition-all duration-200 flex items-center justify-center cursor-pointer',
                      input.trim()
                        ? resolvedTheme === 'dark'
                          ? 'bg-purple-500 hover:bg-purple-600 active:scale-95'
                          : 'bg-purple-700 hover:bg-purple-800 active:scale-95'
                        : resolvedTheme === 'dark'
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-400 cursor-not-allowed'
                    )}
                  >
                    <IoSend size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
