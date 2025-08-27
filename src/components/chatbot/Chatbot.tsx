'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { chatbotDataByLocale } from '@/data/chatbot';
import type { ChatbotData, ChatbotChoice } from '@/types/chatbot';
import { profanityWords, sexualWords } from '@/data/chatbot/prohibited-words';
import { CiLink } from 'react-icons/ci';
import Image from 'next/image';

type Message = {
  from: 'user' | 'bot';
  text: string;
  choices?: ChatbotChoice[];
  isChoiceMessage?: boolean;
  contactButtons?: {
    text: React.ReactNode;
    action: string;
    url: string;
  }[];
  goToProjectLink?: {
    text: React.ReactNode;
    url: string;
  }[];
};

export default function Chatbot() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('modal.chatbot');
  const isKeyboardOpen = useDetectKeyboardOpen();

  // 현재 로케일 가져오기 (URL에서 추출)
  const getCurrentLocale = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const localeMatch = path.match(/^\/([a-z]{2})/);
      return localeMatch ? localeMatch[1] : 'ko';
    }
    return 'ko';
  };

  const currentLocale = getCurrentLocale();
  const chatbotData: ChatbotData =
    chatbotDataByLocale[currentLocale] || chatbotDataByLocale.ko;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: chatbotData.welcome.message,
      choices: chatbotData.welcome.choices.map((id) => chatbotData.choices[id]),
      isChoiceMessage: true,
    },
  ]);
  const [input, setInput] = useState('');

  const [isMobile, setIsMobile] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

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
    // 메시지가 추가될 때만 스크롤 다운 (챗봇을 처음 열 때는 스크롤하지 않음)
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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
    if (open) {
      // 챗봇이 열릴 때 메시지가 있으면 최신 메시지가 보이도록 스크롤
      if (messages.length > 1) {
        // 약간의 지연 후 스크롤 (애니메이션 완료 후)
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'instant' });
        }, 100);
      }
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

    // 사용자 메시지를 채팅창에 추가
    setMessages((msgs) => [...msgs, { from: 'user', text: trimmed }]);

    // 욕설 및 성적 표현 감지
    const hasProfanity = profanityWords.some((word) => trimmed.includes(word));
    const hasSexual = sexualWords.some((word) => trimmed.includes(word));

    if (hasProfanity || hasSexual) {
      let warningMessage = '';

      if (hasProfanity) {
        // 현재 로케일에 따라 욕설 경고 메시지 설정
        switch (currentLocale) {
          case 'en':
            warningMessage =
              'Please refrain from using profanity. I request a polite conversation.';
            break;
          case 'ja':
            warningMessage =
              '下品な言葉遣いはお控えください。丁寧な会話をお願いします。';
            break;
          default: // ko
            warningMessage =
              '욕은 좀 삼가해주십시오. 정중한 대화를 부탁드립니다.';
        }
      } else if (hasSexual) {
        // 현재 로케일에 따라 성적 표현 경고 메시지 설정
        switch (currentLocale) {
          case 'en':
            warningMessage =
              'Please refrain from inappropriate sexual expressions. I request a polite and healthy conversation.';
            break;
          case 'ja':
            warningMessage =
              '不適切な性的表現はお控えください。丁寧で健全な会話をお願いします。';
            break;
          default: // ko
            warningMessage =
              '부적절한 성적 표현은 삼가해주십시오. 정중하고 건전한 대화를 부탁드립니다.';
        }
      }

      // 경고 메시지 표시
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: warningMessage,
          choices: chatbotData.welcome.choices.map(
            (id) => chatbotData.choices[id]
          ),
          isChoiceMessage: true,
        },
      ]);
      return;
    }

    // 선택지에서 답변 찾기
    const choice = Object.values(chatbotData.choices).find(
      (choice) => choice.text === trimmed
    );

    let reply = '';
    let nextChoices: ChatbotChoice[] = [];
    let contactButtons:
      | { text: React.ReactNode; action: string; url: string }[]
      | undefined;
    let goToProjectLink: { text: React.ReactNode; url: string }[] | undefined;

    if (choice) {
      reply = choice.response;

      // 다음 선택지들 가져오기
      if (choice.nextChoices) {
        nextChoices = choice.nextChoices
          .map((id) => chatbotData.choices[id])
          .filter(Boolean);
      }

      // 연락 버튼들 처리
      if (choice.contactButtons) {
        contactButtons = choice.contactButtons.map((button) => ({
          text: (
            <p className='flex items-center gap-2'>
              {button.action === 'email' ? (
                <SiMinutemailer size={16} />
              ) : (
                <FaLinkedin size={16} />
              )}
              <span>{button.text}</span>
            </p>
          ),
          action: button.action,
          url: button.url,
        }));
      }

      // 프로젝트 링크 처리
      if (choice.goToProjectLink) {
        goToProjectLink = choice.goToProjectLink.map((link) => ({
          text: (
            <p className='flex items-center gap-2'>
              <CiLink size={16} />
              <span>{link.text}</span>
            </p>
          ),
          url: link.url,
        }));
      }
    } else {
      // 입력된 메시지가 선택지에 없는 경우
      reply = t('sorry');
      // 기본 선택지들 제공
      nextChoices = chatbotData.welcome.choices.map(
        (id) => chatbotData.choices[id]
      );
    }

    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: reply,
          choices: nextChoices,
          contactButtons: contactButtons,
          goToProjectLink: goToProjectLink,
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
      setInput(''); // 간단하게 input 비우기
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
                className={`flex-1 overflow-y-auto overflow-x-hidden text-sm leading-relaxed w-full pt-4 ${
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
                        {/* 봇 메시지: 아바타와 말풍선을 한 줄로 배치 */}
                        {m.from === 'bot' && (
                          <div className='flex items-start gap-2'>
                            <Image
                              src='/images/chatbot_me.png'
                              alt='me'
                              width={40}
                              height={40}
                              className='rounded-full flex-shrink-0 select-none pointer-events-none'
                            />
                            <div
                              className={`font-semibold bg-gray-100 text-black px-4 py-3 rounded-2xl break-words relative shadow-sm`}
                            >
                              {m.text}
                              {/* 말풍선 꼬리 */}
                              <div
                                className='absolute left-1 top-4 w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rotate-45'
                                style={{
                                  backgroundColor: '#f3f4f6',
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* 사용자 메시지: 말풍선과 아바타를 한 줄로 배치 */}
                        {m.from === 'user' && (
                          <div className='flex items-start gap-2 flex-row-reverse'>
                            <Image
                              src='/images/chatbot_visitor.png'
                              alt='you'
                              width={40}
                              height={40}
                              className='rounded-full flex-shrink-0 select-none pointer-events-none'
                            />
                            <div
                              className={`font-normal bg-${
                                resolvedTheme === 'dark'
                                  ? 'purple-500'
                                  : 'purple-700'
                              } text-white px-4 py-3 rounded-2xl break-words relative shadow-sm`}
                            >
                              {m.text}
                              {/* 말풍선 꼬리 */}
                              <div
                                className='absolute right-1 top-4 w-3 h-3 transform translate-x-1/2 -translate-y-1/2 rotate-45'
                                style={{
                                  backgroundColor:
                                    resolvedTheme === 'dark'
                                      ? '#ad46ff'
                                      : '#8200db',
                                }}
                              />
                            </div>
                          </div>
                        )}

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
                                        className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
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

                            {/* 프로젝트 링크 버튼들 */}
                            {m.goToProjectLink &&
                              m.goToProjectLink.length > 0 && (
                                <div className='mt-4 flex flex-wrap gap-2'>
                                  {m.goToProjectLink.map((link, linkIndex) => (
                                    <button
                                      key={linkIndex}
                                      onClick={() => {
                                        // 모바일에서는 새 탭, PC에서는 현재 페이지에서 push
                                        if (isMobile) {
                                          // 모바일: 새 탭에서 열기
                                          window.open(link.url, '_blank');
                                        } else {
                                          // PC: 현재 페이지에서 push
                                          if (link.url.startsWith('?')) {
                                            // 챗봇 닫기
                                            setOpen(false);
                                            // URL 업데이트 (페이지 이동 없이)
                                            window.history.pushState(
                                              {},
                                              '',
                                              link.url
                                            );
                                            // 페이지 새로고침 없이 URL만 변경
                                            // 프로젝트 상세 페이지는 URL 변경을 감지하여 표시됨
                                          } else {
                                            // 외부 링크는 새 탭에서 열기
                                            window.open(link.url, '_blank');
                                          }
                                        }
                                      }}
                                      className={`rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 flex items-center gap-2 transition-all duration-200 ${
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

                            {/* 선택지 버튼들 */}
                            {m.choices && m.choices.length > 0 && (
                              <div className='mt-4 flex flex-wrap gap-2'>
                                {m.choices.map((choice, choiceIndex) => (
                                  <button
                                    key={choiceIndex}
                                    onClick={() => sendMessage(choice.text)}
                                    className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                                      resolvedTheme === 'dark'
                                        ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                                    }`}
                                  >
                                    {choice.text}
                                  </button>
                                ))}
                                {/* 항상 마지막에 '처음으로' 버튼 추가 */}
                                <button
                                  onClick={() => {
                                    // welcome 메시지로 초기화
                                    setMessages([
                                      {
                                        from: 'bot',
                                        text: chatbotData.welcome.message,
                                        choices:
                                          chatbotData.welcome.choices.map(
                                            (id) => chatbotData.choices[id]
                                          ),
                                        isChoiceMessage: true,
                                      },
                                    ]);
                                  }}
                                  className={`border border-dashed rounded-sm px-2 py-2 cursor-pointer text-sm select-none flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                                    resolvedTheme === 'dark'
                                      ? 'bg-[#1a1a1a] border-gray-500 text-white hover:bg-purple-500 hover:border-purple-400 hover:text-white'
                                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-700 hover:border-purple-600 hover:text-white'
                                  }`}
                                >
                                  ↺ 처음으로
                                </button>
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className='flex gap-3 justify-center items-center'
                >
                  <div className='flex-1 relative'>
                    <input
                      ref={inputRef}
                      autoFocus={!isMobile}
                      type='text'
                      placeholder={t('placeholder')}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={handleInputFocus}
                      className={`w-full p-3 pr-12 rounded-lg border text-base font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        resolvedTheme === 'dark'
                          ? 'bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <button
                    type='submit'
                    disabled={!input.trim()}
                    className={cn(
                      'size-[50px] rounded-lg text-white transition-all duration-200 flex items-center justify-center cursor-pointer',
                      input.trim()
                        ? resolvedTheme === 'dark'
                          ? 'bg-purple-500 hover:bg-purple-600 active:scale-95'
                          : 'bg-gray-600 cursor-not-allowed'
                        : resolvedTheme === 'dark'
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-400 cursor-not-allowed'
                    )}
                  >
                    <IoSend size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
