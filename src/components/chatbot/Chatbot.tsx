'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';
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
};

type FAQItem = {
  question: string;
  answer: string;
  followUpChoices?: string[];
};

export default function Chatbot() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('modal.chatbot');

  const faqs: FAQItem[] = [
    {
      question: t('whatIsMySkill.question'),
      answer: t('whatIsMySkill.answer'),
      followUpChoices: [
        '어떤 프로젝트 경험이 있어?',
        '일하는 방식은?',
        '강점은 뭐야?',
      ],
    },
    {
      question: t('projectExperience.question'),
      answer: t('projectExperience.answer'),
      followUpChoices: [
        '기술 스택은?',
        '팀워크는 어떻게 해?',
        '문제 해결 능력은?',
      ],
    },
    {
      question: t('languages.question'),
      answer: t('languages.answer'),
      followUpChoices: [
        '프레임워크 경험은?',
        '데이터베이스 경험은?',
        '클라우드 경험은?',
      ],
    },
    {
      question: t('workStyle.question'),
      answer: t('workStyle.answer'),
      followUpChoices: [
        '커뮤니케이션 스타일은?',
        '학습 방법은?',
        '업무 환경 선호도는?',
      ],
    },
    {
      question: t('strengths.question'),
      answer: t('strengths.answer'),
      followUpChoices: [
        '개선하고 있는 부분은?',
        '목표는 뭐야?',
        '더 자세히 설명해줘',
      ],
    },
    {
      question: t('interestedIn.question'),
      answer: t('interestedIn.answer'),
      followUpChoices: [
        '현재 공부 중인 기술은?',
        '미래 계획은?',
        '새로운 도전에 대한 생각은?',
      ],
    },
    {
      question: t('contact.question'),
      answer: t('contact.answer'),
      followUpChoices: [
        '이력서를 보내고 싶어',
        '프로젝트 협업 제안이 있어',
        '기술 상담을 받고 싶어',
      ],
    },
  ];

  // 추가 질문들에 대한 답변
  const additionalAnswers: Record<string, string> = {
    '어떤 프로젝트 경험이 있어?':
      '웹 개발, 모바일 앱, AI/ML 프로젝트 등 다양한 경험이 있습니다. 특히 React, Node.js를 활용한 풀스택 프로젝트를 많이 진행했어요.',
    '일하는 방식은?':
      '애자일 방법론을 선호하며, 빠른 프로토타이핑과 지속적인 피드백을 통해 효율적으로 개발합니다.',
    '강점은 뭐야?':
      '문제 해결 능력과 새로운 기술 학습에 대한 열정, 그리고 팀과의 원활한 소통이 제 강점입니다.',
    '기술 스택은?':
      'Frontend: React, Next.js, TypeScript / Backend: Node.js, Python, Java / Database: MongoDB, PostgreSQL / Cloud: AWS, Azure',
    '팀워크는 어떻게 해?':
      '원격 근무 환경에서도 적극적인 커뮤니케이션을 통해 팀원들과 협력하며, 코드 리뷰와 지식 공유를 중요하게 생각합니다.',
    '문제 해결 능력은?':
      '시스템적인 접근으로 문제를 분석하고, 다양한 해결책을 제시하며, 최적의 솔루션을 찾아내는 것을 좋아합니다.',
    '프레임워크 경험은?':
      'React, Next.js, Vue.js, Angular 등 주요 프론트엔드 프레임워크와 Express, FastAPI, Spring Boot 등 백엔드 프레임워크 경험이 있습니다.',
    '데이터베이스 경험은?':
      '관계형 데이터베이스(MySQL, PostgreSQL)와 NoSQL(MongoDB, Redis) 모두 경험이 있으며, 데이터 모델링과 최적화에 관심이 많습니다.',
    '클라우드 경험은?':
      'AWS, Azure, GCP 등 주요 클라우드 플랫폼에서 서비스 배포, CI/CD 파이프라인 구축, 인프라 관리 경험이 있습니다.',
    '커뮤니케이션 스타일은?':
      '명확하고 간결한 설명을 선호하며, 기술적 내용을 비개발자도 이해할 수 있도록 설명하는 것을 잘합니다.',
    '학습 방법은?':
      '온라인 강의, 기술 문서, 오픈소스 프로젝트 참여, 기술 블로그 작성 등을 통해 지속적으로 학습하고 있습니다.',
    '업무 환경 선호도는?':
      '원격 근무와 사무실 근무를 적절히 조합하는 하이브리드 방식을 선호하며, 유연한 근무 시간을 중요하게 생각합니다.',
    '개선하고 있는 부분은?':
      '클라우드 네이티브 기술, DevOps, 보안 등 새로운 영역에 대한 학습을 지속하고 있으며, 성능 최적화와 코드 품질 향상에 노력하고 있습니다.',
    '목표는 뭐야?':
      '사용자 경험을 향상시키는 혁신적인 서비스를 개발하고, 기술 리더로서 팀을 이끌어가는 것이 목표입니다.',
    '더 자세히 설명해줘':
      '어떤 부분에 대해 더 자세히 알고 싶으신지 구체적으로 말씀해 주시면 더 정확한 답변을 드릴 수 있습니다.',
    '현재 공부 중인 기술은?':
      'AI/ML, 블록체인, IoT 등 최신 기술 트렌드를 파악하고 있으며, 특히 AI를 활용한 웹 서비스 개발에 관심이 많습니다.',
    '미래 계획은?':
      '풀스택 개발자로서의 역량을 더욱 강화하고, 새로운 기술을 도입하여 사용자에게 가치 있는 서비스를 제공하는 것이 계획입니다.',
    '새로운 도전에 대한 생각은?':
      '새로운 기술과 도메인에 대한 도전을 두려워하지 않으며, 학습 곡선을 즐기고 있습니다.',
    '이력서를 보내고 싶어':
      '이력서를 보내주시면 검토 후 연락드리겠습니다. 이메일이나 LinkedIn을 통해 보내주세요.',
    '프로젝트 협업 제안이 있어':
      '프로젝트에 대한 자세한 내용을 이메일로 보내주시면 검토 후 답변드리겠습니다.',
    '기술 상담을 받고 싶어':
      '어떤 기술적 문제나 궁금한 점이 있으신지 구체적으로 말씀해 주시면 도움을 드리겠습니다.',
  };

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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // 어드레스바 상태 변화 감지를 위한 강제 리렌더링 상태
  const [headerHeight, setHeaderHeight] = useState(70);
  const [inputHeight, setInputHeight] = useState(50);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(faqs, { keys: ['question'], threshold: 0.3 });

  // 실제 헤더와 입력 영역 높이 측정
  useEffect(() => {
    if (open && isMobile) {
      const updateHeights = () => {
        if (headerRef.current && inputAreaRef.current) {
          const headerRect = headerRef.current.getBoundingClientRect();
          const inputRect = inputAreaRef.current.getBoundingClientRect();
          const newHeaderHeight = headerRect.height;
          const newInputHeight = inputRect.height;

          console.log('Height Debug:', {
            windowHeight: window.innerHeight,
            headerHeight: newHeaderHeight,
            inputHeight: newInputHeight,
            calculatedHeight:
              window.innerHeight - newHeaderHeight - newInputHeight,
          });

          setHeaderHeight(newHeaderHeight);
          setInputHeight(newInputHeight);
        }
      };

      // 초기 측정
      updateHeights();

      // 리사이즈 시 재측정
      const resizeObserver = new ResizeObserver(updateHeights);
      if (headerRef.current) resizeObserver.observe(headerRef.current);
      if (inputAreaRef.current) resizeObserver.observe(inputAreaRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [open, isMobile, forceUpdate]);

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
      const vh = window.innerHeight;
      const vw = window.outerHeight;

      // 키보드가 열렸는지 감지 (뷰포트 높이가 줄어들면 키보드가 열린 것으로 간주)
      // 더 안정적인 감지를 위해 임계값을 조정
      const isKeyboard = vh < vw * 0.75;

      // 상태가 실제로 변경되었을 때만 업데이트
      if (isKeyboard !== isKeyboardOpen) {
        setIsKeyboardOpen(isKeyboard);
      }
    };

    // 초기 설정
    updateViewportHeight();

    // 리사이즈 이벤트 리스너 (디바운싱 적용)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewportHeight, 150); // 키보드 감지에 더 긴 지연
    };

    window.addEventListener('resize', handleResize);

    // 모바일에서 키보드 열림/닫힘 감지
    if ('visualViewport' in window) {
      const visualViewport = (
        window as Window & { visualViewport: VisualViewport }
      ).visualViewport;
      visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if ('visualViewport' in window) {
        const visualViewport = (
          window as Window & { visualViewport: VisualViewport }
        ).visualViewport;
        visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isKeyboardOpen]);

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

  // 입력 필드 포커스 시 키보드 상태 업데이트
  const handleInputFocus = () => {
    // 모바일에서 입력 필드 포커스 시 약간의 지연 후 키보드 상태 체크
    setTimeout(() => {
      const vh = window.innerHeight;
      setIsKeyboardOpen(vh < window.outerHeight * 0.8);

      // 모바일에서 포커스 시 스크롤을 하단으로 조정
      if (isMobile) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }, 300);
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

    if (bestMatch) {
      reply = bestMatch.answer;
      followUpChoices = bestMatch.followUpChoices || [];
    } else if (additionalAnswers[trimmed]) {
      reply = additionalAnswers[trimmed];
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
          isChoiceMessage: true,
        },
      ]);
    }, 800);

    setInput('');

    // 모바일에서 메시지 전송 후 키보드 숨기기
    if (inputRef.current) {
      inputRef.current.blur();
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

  // 어드레스바 상태 변화를 더 정확하게 감지
  useEffect(() => {
    if (!isMobile) return;

    let resizeTimer: NodeJS.Timeout;

    const handleViewportChange = () => {
      // 디바운싱으로 과도한 리렌더링 방지
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // 키보드 상태가 아닌 어드레스바 상태만 체크
        const vh = window.innerHeight;
        const vw = window.outerHeight;
        const isAddressBarVisible = vh < vw * 0.9;

        // 어드레스바 상태가 실제로 변경되었을 때만 리렌더링
        if (isAddressBarVisible !== (isKeyboardOpen && vh < vw * 0.9)) {
          setForceUpdate((prev) => prev + 1);
        }
      }, 200); // 더 긴 지연으로 키보드 상태와 충돌 방지
    };

    // 어드레스바 관련 이벤트만 감지 (키보드 이벤트와 분리)
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    // visualViewport API 사용 (지원하는 브라우저에서)
    if ('visualViewport' in window) {
      const visualViewport = (
        window as Window & { visualViewport: VisualViewport }
      ).visualViewport;
      visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      clearTimeout(resizeTimer);
      // clearInterval(intervalTimer);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if ('visualViewport' in window) {
        const visualViewport = (
          window as Window & { visualViewport: VisualViewport }
        ).visualViewport;
        visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, [isMobile, isKeyboardOpen]);

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
                    }
                  : {}),
                touchAction: 'none',
                overscrollBehavior: 'none',
              }}
              key={forceUpdate} // 어드레스바 상태 변화 시 강제 리렌더링
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
                  maxHeight: isMobile
                    ? `${window.innerHeight - headerHeight - inputHeight}px`
                    : 'auto',
                  paddingTop: isMobile ? `${headerHeight}px` : '16px', // 모바일에서만 헤더 높이만큼 패딩
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingBottom: '0px',
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

                        {/* 선택지 버튼들 */}
                        {m.isChoiceMessage &&
                          m.choices &&
                          m.choices.length > 0 && (
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
