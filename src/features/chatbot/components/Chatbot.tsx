'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { chatbotDataByLocale } from '@/data/chatbot';
import type { ChatbotData } from '@/types/chatbot';
import { getCurrentLocale } from '@/utils/locale';
import { usePathname, useRouter } from 'next/navigation';
import type { ProjectView } from '@/modules/projects';
import { useChatbotStore } from '@/stores/chatbot-store';
import { useChatbotMessaging } from '@/features/chatbot/hooks/useChatbotMessaging';
import { useChatbotShell } from '@/features/chatbot/hooks/useChatbotShell';
import { ChatbotToggleButton } from '@/features/chatbot/components/ChatbotToggleButton';
import { ChatbotWindow } from '@/features/chatbot/components/ChatbotWindow';

interface ChatbotProps {
  projects?: ProjectView[];
}

function getNavigatingLabel(locale: string) {
  if (locale === 'ja') return 'プロジェクトに移動中...';
  if (locale === 'en') return 'Opening project...';
  return '프로젝트로 이동 중...';
}

export default function Chatbot({ projects = [] }: ChatbotProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('modal.chatbot');
  const isKeyboardOpen = useDetectKeyboardOpen();
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = getCurrentLocale();
  const chatbotData: ChatbotData =
    chatbotDataByLocale[currentLocale] || chatbotDataByLocale.ko;

  const open = useChatbotStore((state) => state.open);
  const setOpen = useChatbotStore((state) => state.setOpen);
  const messages = useChatbotStore((state) => state.messages);
  const setMessages = useChatbotStore((state) => state.setMessages);
  const input = useChatbotStore((state) => state.input);
  const setInput = useChatbotStore((state) => state.setInput);
  const isStreamingReply = useChatbotStore((state) => state.isStreamingReply);
  const setIsStreamingReply = useChatbotStore(
    (state) => state.setIsStreamingReply,
  );
  const isNavigatingProject = useChatbotStore(
    (state) => state.isNavigatingProject,
  );
  const setIsNavigatingProject = useChatbotStore(
    (state) => state.setIsNavigatingProject,
  );

  const {
    isMobile,
    bottomRef,
    inputRef,
    headerRef,
    inputAreaRef,
    handleInputFocus,
  } = useChatbotShell({
    open,
    setOpen,
    messages,
    setMessages,
    chatbotData,
    currentLocale,
    pathname,
    projects,
    isKeyboardOpen,
  });

  const { sendMessage } = useChatbotMessaging({
    chatbotData,
    currentLocale,
    pathname,
    projects,
    setMessages,
    setIsStreamingReply,
    ragErrorText: t('sorry'),
  });

  const handleSend = () => {
    if (!input.trim()) return;
    void sendMessage(input);
    setInput('');
  };

  return (
    <>
      <ChatbotToggleButton
        open={open}
        resolvedTheme={resolvedTheme}
        ariaLabel={open ? t('close') : t('open')}
        onToggle={() => setOpen((prev) => !prev)}
      />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className={cn(
                'fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[9999] chatbot-backdrop',
                !isMobile && 'hidden',
              )}
              style={{
                touchAction: 'none',
                overscrollBehavior: 'none',
                width: '100vw',
                height: '100vh',
              }}
            />

            <ChatbotWindow
              open={open}
              isMobile={isMobile}
              isKeyboardOpen={isKeyboardOpen}
              resolvedTheme={resolvedTheme}
              title={t('title')}
              placeholder={t('placeholder')}
              resetToStartLabel={t('resetToStart')}
              navigatingLabel={getNavigatingLabel(currentLocale)}
              currentLocale={currentLocale}
              input={input}
              messages={messages}
              chatbotData={chatbotData}
              isStreamingReply={isStreamingReply}
              isNavigatingProject={isNavigatingProject}
              router={router}
              headerRef={headerRef}
              bottomRef={bottomRef}
              inputRef={inputRef}
              inputAreaRef={inputAreaRef}
              setOpen={setOpen}
              setInput={setInput}
              setMessages={setMessages}
              setIsNavigatingProject={setIsNavigatingProject}
              onInputFocus={handleInputFocus}
              onSend={handleSend}
              onChoiceSelect={(text) => void sendMessage(text)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
