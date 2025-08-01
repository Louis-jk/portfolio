'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';
import { IoChatboxEllipses, IoClose } from 'react-icons/io5';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function Chatbot() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('modal.chatbot');

  const faqs = [
    {
      question: t('whatIsMySkill.question'),
      answer: t('whatIsMySkill.answer'),
    },
    {
      question: t('projectExperience.question'),
      answer: t('projectExperience.answer'),
    },
    { question: t('languages.question'), answer: t('languages.answer') },
    { question: t('workStyle.question'), answer: t('workStyle.answer') },
    { question: t('strengths.question'), answer: t('strengths.answer') },
    { question: t('interestedIn.question'), answer: t('interestedIn.answer') },
    { question: t('contact.question'), answer: t('contact.answer') },
  ];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: t('description'),
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(faqs, { keys: ['question'], threshold: 0.3 });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  useEffect(() => {
    if (open && messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages.length]);

  const sendMessage = (userMsg: string) => {
    const trimmed = userMsg.trim();
    if (!trimmed) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: trimmed }]);

    const result = fuse.search(trimmed);
    const bestMatch = result.length > 0 ? result[0].item : null;
    const reply = bestMatch ? bestMatch.answer : t('sorry');

    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: 'bot', text: reply }]);
    }, 800);

    setInput('');
  };

  return (
    <>
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

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className='fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[9999]'
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'fixed bottom-[100px] right-6 left-6 md:left-auto md:w-96 h-[70vh] rounded-xl flex flex-col z-[10000] font-sans',
                resolvedTheme === 'dark'
                  ? 'bg-black shadow-[0_8px_24px_rgba(255,255,255,0.15)]'
                  : 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]  '
              )}
            >
              <div
                className={cn(
                  'px-4 py-3 font-bold text-base select-none rounded-t-xl border-b border-gray-200',
                  resolvedTheme === 'dark'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-700 text-white'
                )}
              >
                {t('title')}
              </div>

              <div
                className={`flex-1 px-1 py-3 overflow-y-auto overflow-x-hidden text-sm leading-relaxed w-full ${
                  resolvedTheme === 'dark' ? 'bg-[#111111]' : 'bg-white'
                }`}
              >
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-3 ${
                        m.from === 'user'
                          ? 'flex justify-end'
                          : 'flex justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] ${
                          m.from === 'user' ? 'ml-auto' : 'mr-auto pl-3'
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
                          } px-3 py-1.5 rounded-xl break-words relative`}
                        >
                          {m.text}
                          {/* 말풍선 꼬리 */}
                          <div
                            className={`absolute bottom-0 ${
                              m.from === 'user' ? 'right-3' : 'left-3'
                            } w-2 h-2 transform translate-y-1/2 rotate-45`}
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
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              <div
                className={`p-3 border-t ${
                  resolvedTheme === 'dark'
                    ? 'border-gray-600 bg-[#111111]'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='flex flex-wrap gap-2 mb-3'>
                  {faqs.map(({ question }) => (
                    <button
                      key={question}
                      onClick={() => sendMessage(question)}
                      className={`border-1 border-dotted rounded-full px-3 py-1.5 cursor-pointer text-xs select-none flex-shrink-0 transition-colors ${
                        resolvedTheme === 'dark'
                          ? 'bg-[#111111] border-gray-400 text-white hover:bg-purple-500 hover:text-white'
                          : 'bg-white border-gray-300 text-black hover:bg-purple-700 hover:text-white'
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
                <input
                  autoFocus
                  type='text'
                  placeholder={t('placeholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage(input);
                  }}
                  className={`w-full p-3 rounded-md border text-base font-bold outline-none focus:ring-0 focus:border-1 ${
                    resolvedTheme === 'dark'
                      ? 'bg-[#111111] border-purple-500 focus:border-purple-500 text-purple-500 placeholder-purple-500'
                      : 'bg-white border-purple-700 focus:border-purple-700 text-purple-700 placeholder-purple-700'
                  }`}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
