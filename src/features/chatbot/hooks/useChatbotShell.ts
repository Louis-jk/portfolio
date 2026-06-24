'use client';

import { useEffect, useRef } from 'react';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';
import type { ChatbotData } from '@/types/chatbot';
import type { ProjectView } from '@/modules/projects';
import type { ChatMessage } from '@/stores/chatbot-store';
import { normalizeProjectLinkForLocale } from '@/features/chatbot/components/chatbot-project-links';

type UseChatbotShellArgs = {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  messages: ChatMessage[];
  setMessages: (
    value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  chatbotData: ChatbotData;
  currentLocale: string;
  pathname: string;
  projects: ProjectView[];
  isKeyboardOpen: boolean;
};

export function useChatbotShell({
  open,
  setOpen,
  messages,
  setMessages,
  chatbotData,
  currentLocale,
  pathname,
  projects,
  isKeyboardOpen,
}: UseChatbotShellArgs) {
  const { isLayoutMobile: isMobile } = useLayoutBreakpoints();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: `msg-${Date.now()}-welcome`,
          from: 'bot',
          text: chatbotData.welcome.message,
          timestamp: new Date(),
          choices: chatbotData.welcome.choices.map(
            (id) => chatbotData.choices[id],
          ),
          isChoiceMessage: true,
        },
      ]);
    }
  }, [chatbotData, messages.length, setMessages]);

  useEffect(() => {
    const localizedPathname = pathname || `/${currentLocale}`;
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        const nextMessage: ChatMessage = { ...message };
        if (message.choices?.length) {
          nextMessage.choices = message.choices.map(
            (choice) => chatbotData.choices[choice.id] ?? choice,
          );
        }
        if (message.id.includes('welcome') || message.id.includes('reset')) {
          nextMessage.text = chatbotData.welcome.message;
          nextMessage.choices = chatbotData.welcome.choices.map(
            (id) => chatbotData.choices[id],
          );
        }
        if (message.goToProjectLink?.length) {
          nextMessage.goToProjectLink = message.goToProjectLink.map((link) =>
            normalizeProjectLinkForLocale(link, projects, localizedPathname),
          );
        }
        return nextMessage;
      }),
    );
  }, [chatbotData, currentLocale, pathname, projects, setMessages]);

  useEffect(() => {
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!open || !isMobile) return;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || isMobile) return;
    document.body.classList.add('chatbot-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'chatbot-backdrop-overlay';
    backdrop.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9998;pointer-events:auto;';
    backdrop.onclick = () => setOpen(false);
    document.body.appendChild(backdrop);
    return () => {
      document.body.classList.remove('chatbot-open');
      document.querySelector('.chatbot-backdrop-overlay')?.remove();
    };
  }, [open, isMobile, setOpen]);

  useEffect(() => {
    if (!open || messages.length <= 1) return;
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }, 100);
    return () => clearTimeout(timer);
  }, [open, messages.length]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [isKeyboardOpen, open, isMobile]);

  const handleInputFocus = () => {
    if (!isMobile) return;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return {
    isMobile,
    bottomRef,
    inputRef,
    headerRef,
    inputAreaRef,
    handleInputFocus,
  };
}
