'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Renderer from '../avatar/Renderer';
import Links from '../links/Links';
import { useTranslations } from 'next-intl';

function Intro() {
  const t = useTranslations();
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

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
              className='absolute top-5 right-0 transform -translate-x-1/2 -translate-y-full z-10 bg-white text-black px-4 py-2 rounded-2xl text-sm whitespace-nowrap shadow-lg border border-gray-200'
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
              <div className='absolute top-full left-1/6 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white'></div>
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

        <div className='flex flex-col items-center gap-2'>
          <h3 className='text-xl font-bold'>About Me</h3>
          <p className='text-lg text-center'>
            I’m a frontend developer who builds responsive, fast web apps.
            <br />I love clean code and intuitive UX.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Intro;
