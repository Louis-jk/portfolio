'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Renderer from '../avatar/Renderer';
import Links from '../links/Links';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

function Intro() {
  const t = useTranslations();
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const { resolvedTheme } = useTheme();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const [showHeaderName, setShowHeaderName] = useState(false);
  const [headerNameStyle, setHeaderNameStyle] = useState({});
  const nameRef = useRef<HTMLHeadingElement>(null);

  // 메시지 세팅
  useEffect(() => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? t('homePage.intro.hello.morning')
        : hour < 17
        ? t('homePage.intro.hello.afternoon')
        : hour < 21
        ? t('homePage.intro.hello.evening')
        : t('homePage.intro.hello.night');

    const randoms = [
      t('homePage.intro.randomGreetings.0'),
      t('homePage.intro.randomGreetings.1'),
      t('homePage.intro.randomGreetings.2'),
      t('homePage.intro.randomGreetings.3'),
      t('homePage.intro.randomGreetings.4'),
    ];

    setMessages([greeting, ...randoms]);
    setShowGreeting(true);

    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  }, [t]);

  // 스크롤 감지하여 헤더 이름 애니메이션 (1024px 미만에서만)
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const handleScroll = () => {
      if (!nameRef.current) return;

      const nameRect = nameRef.current.getBoundingClientRect();
      const headerHeight = 65; // 헤더 높이
      const nameHeight = nameRect.height;
      const nameWidth = nameRect.width;

      // 이름이 헤더 영역에 들어오는지 확인
      if (nameRect.top <= headerHeight && nameRect.bottom >= 0) {
        console.log('Name is in header area');
      } else if (nameRect.bottom < 0) {
        console.log('Name is completely above header');
      }

      // h1이 헤더 영역에 들어오거나 완전히 위로 사라졌을 때 헤더 이름 표시
      console.log('Checking conditions:', {
        nameRectTop: nameRect.top,
        headerHeight,
        nameRectBottom: nameRect.bottom,
        shouldShow: nameRect.top <= headerHeight || nameRect.bottom < 0,
      });

      if (nameRect.top <= headerHeight || nameRect.bottom < 0) {
        console.log('Setting showHeaderName to true');
        setShowHeaderName(true);

        // h1 이름 위치 정보 (현재는 사용하지 않음)
        // const absoluteLeft = nameRect.left;
        // const absoluteTop = nameRect.top;

        // 헤더 중앙 위치 계산 - 고정된 값 사용
        const headerCenterLeft = window.innerWidth / 2 - 100; // 대략적인 중앙 위치
        const headerCenterTop = (headerHeight - nameHeight) / 2 + 8; // 약간 아래쪽으로 조정

        console.log('Header center position:', {
          headerCenterLeft,
          headerCenterTop,
          windowWidth: window.innerWidth,
          nameWidth,
          headerHeight,
          nameHeight,
        });

        // h1이 헤더 영역에 들어오면 바로 애니메이션 실행
        if (nameRect.top <= headerHeight) {
          setHeaderNameStyle({
            position: 'fixed',
            left: '50%',
            top: headerCenterTop,
            transform: 'translateX(-50%)',
            width: nameWidth,
            height: nameHeight,
            fontSize: '1.5rem', // 고정된 작은 크기
            filter: 'blur(0px)', // 선명하게
            opacity: 1, // 완전히 보이게
            transition: 'all 0.3s ease-out', // 부드러운 전환
          });
        }
      } else {
        setShowHeaderName(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 인사말 표시 타이밍
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (showGreeting || isHovered) {
      timer = setTimeout(() => setIsGreetingVisible(true), 300);
    } else {
      setIsGreetingVisible(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showGreeting, isHovered]);

  // 마우스 오버 시 메시지 변경
  const handleMouseEnter = () => {
    if (!showGreeting) {
      setIsHovered(true);
      const randomIndex = Math.floor(Math.random() * (messages.length - 1)) + 1;
      setMessageIndex(randomIndex);
    }
  };

  const currentMessage = showGreeting ? messages[0] : messages[messageIndex];

  // 말풍선 위치 계산
  useEffect(() => {
    if (!bubbleRef.current || !isGreetingVisible) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    const offsetY = -50 - rect.height / 1.5;

    setBubbleStyle({
      left: '50%',
      top: 0,
      transform: `translateX(-50%) translateY(${offsetY}px)`,
      width: 'auto',
      maxWidth: '90vw',
      minWidth: '120px',
      backgroundColor: resolvedTheme === 'dark' ? '#fff' : '#101010',
      color: resolvedTheme === 'dark' ? '#000' : '#fff',
      wordBreak: 'break-word',
    });
  }, [currentMessage, isGreetingVisible, resolvedTheme]);

  return (
    <section className='flex flex-col items-center justify-center'>
      {/* 헤더 애니메이션 이름 */}
      {showHeaderName && (
        <div className='fixed top-0 z-50 h-[71px] overflow-hidden'>
          <motion.p
            className='text-5xl font-bold absolute text-center'
            style={headerNameStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Joonho Kim
          </motion.p>
        </div>
      )}

      <div className='flex flex-col items-center gap-5 py-10'>
        <motion.div
          className='relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Renderer />

          {messages.length > 0 && isGreetingVisible && (
            <motion.div
              ref={bubbleRef}
              className='absolute z-50 px-4 py-2 rounded-2xl text-sm shadow-lg inline-block text-center font-bold leading-snug'
              style={bubbleStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: showGreeting ? 1.3 : 0.3,
                ease: 'easeOut',
              }}
            >
              {currentMessage}
              <div
                className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent'
                style={{
                  borderTopColor: resolvedTheme === 'dark' ? '#fff' : '#000',
                }}
              />
            </motion.div>
          )}
        </motion.div>

        <motion.h1
          ref={nameRef}
          className='text-5xl font-bold text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Joonho Kim
        </motion.h1>

        <Links />

        <motion.div
          className='flex flex-col items-center mt-5 px-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <motion.h3
            className='text-2xl font-bold mb-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            About Me
          </motion.h3>
          <motion.p
            className='text-base text-center whitespace-pre-line max-w-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          >
            {t('homePage.intro.about_me')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default Intro;
