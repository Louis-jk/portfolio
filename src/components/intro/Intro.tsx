'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Renderer from '../avatar/Renderer';
import Links from '../links/Links';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/components/theme/ThemeProvider';

function Intro() {
  const t = useTranslations();
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const { theme } = useTheme();

  // 메시지 세팅
  useEffect(() => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? t('HomePage.intro.hello.morning')
        : hour < 17
        ? t('HomePage.intro.hello.afternoon')
        : hour < 21
        ? t('HomePage.intro.hello.evening')
        : t('HomePage.intro.hello.night');

    const randoms = [
      t('HomePage.intro.random_greetings.0'),
      t('HomePage.intro.random_greetings.1'),
      t('HomePage.intro.random_greetings.2'),
      t('HomePage.intro.random_greetings.3'),
      t('HomePage.intro.random_greetings.4'),
    ];

    setMessages([greeting, ...randoms]);
    setShowGreeting(true);

    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  }, [t]);

  // 말풍선 렌더링 타이밍 제어
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

  // 마우스 오버로 랜덤 인사말 변경
  const handleMouseEnter = () => {
    if (!showGreeting) {
      setIsHovered(true);
      const randomIndex = Math.floor(Math.random() * (messages.length - 1)) + 1;
      setMessageIndex(randomIndex);
    }
  };

  // 현재 메시지 가져오기
  const currentMessage = showGreeting ? messages[0] : messages[messageIndex];

  // 메시지 길이에 따른 말풍선 위치 계산
  const getBubblePosition = () => {
    if (!currentMessage)
      return { left: '50%', transform: 'translateX(-50%) translateY(-80%)' };

    const messageLength = currentMessage.length;

    // 짧은 메시지 (10자 이하)
    if (messageLength <= 10) {
      return {
        left: '50%',
        transform: 'translateX(-50%) translateY(-80%)',
        maxWidth: '150px',
      };
    }
    // 중간 메시지 (11-20자)
    else if (messageLength <= 20) {
      return {
        left: '50%',
        transform: 'translateX(-50%) translateY(-100%)',
        maxWidth: '200px',
      };
    }
    // 긴 메시지 (21자 이상)
    else {
      return {
        left: '50%',
        transform: 'translateX(-50%) translateY(-120%)',
        maxWidth: '280px',
      };
    }
  };

  return (
    <section className='flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-5 py-10'>
        <motion.div
          className='relative'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Renderer isFacingUser={isHovered} />

          {messages.length > 0 && isGreetingVisible && (
            <motion.div
              className='absolute -top-10 z-100 px-4 py-2 rounded-2xl text-sm whitespace-nowrap shadow-lg'
              style={{
                ...getBubblePosition(),
                minWidth: '120px',
                right: 'auto',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%) translateY(-50%)',
                backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                color: theme === 'dark' ? '#000000' : '#ffffff',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: showGreeting ? 1.3 : 0.3,
                ease: 'easeOut',
              }}
            >
              <p className='text-center font-bold'>
                {showGreeting ? messages[0] : messages[messageIndex]}
              </p>
              <div
                className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent'
                style={{
                  borderTopColor: theme === 'dark' ? '#ffffff' : '#000000',
                }}
              ></div>
            </motion.div>
          )}
        </motion.div>

        <motion.h1
          className='text-5xl font-bold'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Joonho Kim
        </motion.h1>

        <Links />

        <div className='flex flex-col items-center mt-10'>
          <h3 className='text-3xl font-bold mb-5'>About Me</h3>
          <p className='text-lg text-center whitespace-pre-line'>
            {t('HomePage.intro.about_me')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Intro;
