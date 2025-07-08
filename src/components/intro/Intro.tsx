'use client';

import { useState } from 'react';
import Renderer from '../avatar/Renderer';
import Links from '../links/Links';

function Intro() {
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    '안녕! 👋',
    'Hello! 🌟',
    'こんにちは! ✨',
    '반가워요! 😊',
    'Nice to meet you! 🎉',
    '오늘도 좋은 하루! 🌈',
    '코딩하세요! 💻',
    '포트폴리오 보세요! 📁',
  ];
  return (
    <section className='flex flex-col flex-wrap items-center justify-center'>
      <div className='flex flex-col items-center gap-5 px-30 py-10'>
        <div
          className='relative'
          onMouseEnter={() => {
            setIsHovered(true);
            setMessageIndex(Math.floor(Math.random() * messages.length));
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Renderer />
          {isHovered && (
            <div className='absolute top-5 right-0 transform -translate-x-1/2 -translate-y-full z-10 bg-white text-black px-4 py-2 rounded-2xl text-sm whitespace-nowrap shadow-lg border border-gray-200'>
              <p className='text-center font-bold'>{messages[messageIndex]}</p>
              <div className='absolute top-full left-1/6 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white'></div>
            </div>
          )}
        </div>
        <h1 className='text-5xl font-bold'>Joonho Kim</h1>
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
