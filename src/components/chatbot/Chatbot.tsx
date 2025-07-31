'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useLocale } from 'next-intl';
import { IoChatboxEllipses, IoClose } from 'react-icons/io5';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const faqData = {
  ko: [
    {
      question: '내 스킬이 뭐야?',
      answer: 'React, Next.js, TypeScript를 주로 사용합니다.',
    },
    {
      question: '프로젝트 경험?',
      answer: '웹, 모바일 앱, AI 챗봇 개발 경험이 있습니다.',
    },
    { question: '언어는?', answer: '한국어, 영어, 일본어 가능합니다.' },
  ],
  en: [
    {
      question: 'What are my skills?',
      answer: 'I mainly use React, Next.js, and TypeScript.',
    },
    {
      question: 'Project experience?',
      answer:
        'I have experience in web, mobile apps, and AI chatbot development.',
    },
    {
      question: 'Languages?',
      answer: 'I speak Korean, English, and Japanese.',
    },
  ],
};

export default function Chatbot() {
  const locale = useLocale();
  const faqs = faqData[locale as keyof typeof faqData] || faqData['en'];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text:
        locale === 'ko'
          ? '안녕하세요! 궁금한 질문을 선택하거나 직접 입력하세요.'
          : 'Hello! Choose or type a question.',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(faqs, { keys: ['question'], threshold: 0.3 });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sendMessage = (userMsg: string) => {
    const trimmed = userMsg.trim();
    if (!trimmed) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: trimmed }]);

    const result = fuse.search(trimmed);
    const bestMatch = result.length > 0 ? result[0].item : null;
    const reply = bestMatch
      ? bestMatch.answer
      : locale === 'ko'
      ? '죄송합니다. 답변을 준비 중입니다.'
      : 'Sorry, answer is not ready yet.';

    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: 'bot', text: reply }]);
    }, 800);

    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? '챗봇 닫기' : '챗봇 열기'}
        className='fixed bottom-6 right-6 w-15 h-15 rounded-full bg-[#ad46ff] text-white border-none cursor-pointer z-[10000] shadow-[0_4px_8px_rgba(0,0,0,0.3)] text-2xl flex items-center justify-center select-none'
      >
        {open ? <IoClose size={30} /> : <IoChatboxEllipses size={30} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='fixed bottom-[90px] right-6 w-80 md:w-96 h-[70vh] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col z-[10000] overflow-hidden font-sans'
          >
            <div className='px-4 py-3 border-b border-gray-200 font-bold bg-[#ad46ff] text-white text-base select-none'>
              {locale === 'ko' ? '포트폴리오 챗봇' : 'Portfolio Chatbot'}
            </div>

            <div className='flex-1 p-3 overflow-y-auto bg-white text-sm leading-relaxed w-full'>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex mb-2 ${
                      m.from === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className='relative'>
                      <div
                        className={`font-${
                          m.from === 'bot' ? 'semibold' : 'normal'
                        } bg-${
                          m.from === 'bot' ? 'gray-100' : '[#ad46ff]'
                        } text-${
                          m.from === 'bot' ? 'black' : 'white'
                        } px-3 py-1.5 rounded-xl max-w-[80%] break-words`}
                      >
                        {m.text}
                      </div>
                      {/* 말풍선 꼬리 */}
                      <div
                        className={`absolute bottom-0 ${
                          m.from === 'user' ? 'right-2' : 'left-2'
                        } w-2 h-2 transform translate-y-full rotate-45`}
                        style={{
                          backgroundColor:
                            m.from === 'bot' ? '#f3f4f6' : '#ad46ff',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            <div className='p-3 border-t border-gray-200 bg-gray-50'>
              <div className='flex flex-wrap gap-2 mb-3'>
                {faqs.map(({ question }) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className='bg-white border-1 border-gray-300 border-dotted text-black rounded-full px-3 py-1.5 cursor-pointer text-sm select-none flex-shrink-0 hover:bg-purple-400 hover:text-white transition-colors'
                  >
                    {question}
                  </button>
                ))}
              </div>
              <input
                type='text'
                placeholder={
                  locale === 'ko' ? '직접 질문 입력' : 'Type your question'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage(input);
                }}
                className='w-full p-2 rounded-md border border-gray-300 text-sm'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
