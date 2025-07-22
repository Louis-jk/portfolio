'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Renderer from '../avatar/Renderer';
import Links from '../links/Links';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { FaCode } from 'react-icons/fa';

function Intro() {
  const t = useTranslations();
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const { resolvedTheme } = useTheme();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleStyle, setBubbleStyle] = useState({});

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
          className='text-5xl font-bold text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Joonho Kim
        </motion.h1>
        {locale === 'ko' && (
          <motion.p
            className='text-2xl font-bold text-center mb-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            김 준호
          </motion.p>
        )}
        {locale === 'ja' && (
          <motion.p
            className='text-2xl font-semibold text-center mb-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            金 俊皓 &nbsp;
            <span className='w-[0.2em] h-1 text-gray-200'>|</span>
            &nbsp; <span className='text-gray-400'>きむ じゅの</span>
          </motion.p>
        )}

        <Links />

        <motion.div
          className='flex flex-col items-center mt-5 px-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <motion.h3
            className='flex items-center justify-start text-2xl font-bold mb-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            <FaCode className='mr-2' color='#ad46ff' size={25} />
            console.log&#40;&quot;me&quot;&#41;
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
