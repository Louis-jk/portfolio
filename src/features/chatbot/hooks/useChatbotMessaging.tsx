'use client';

import { useCallback } from 'react';
import { FaLinkedin } from 'react-icons/fa6';
import { SiMinutemailer } from 'react-icons/si';
import { CiLink } from 'react-icons/ci';
import type { ChatbotData } from '@/types/chatbot';
import type { ProjectWithTranslations } from '@/lib/projects';
import type { ChatMessage } from '@/stores/chatbot-store';
import { getModerationWarning } from '@/features/chatbot/lib/chatbot-moderation';
import { buildProjectLinksFromIds } from '@/features/chatbot/components/chatbot-project-links';
import { resolveFaqReply } from '@/features/chatbot/lib/resolve-faq-reply';
import { useRagChatStream } from '@/features/chatbot/hooks/useRagChatStream';

type UseChatbotMessagingArgs = {
  chatbotData: ChatbotData;
  currentLocale: string;
  pathname: string;
  projects: ProjectWithTranslations[];
  setMessages: (
    value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  setIsStreamingReply: (value: boolean) => void;
  ragErrorText: string;
};

export function useChatbotMessaging({
  chatbotData,
  currentLocale,
  pathname,
  projects,
  setMessages,
  setIsStreamingReply,
  ragErrorText,
}: UseChatbotMessagingArgs) {
  const { streamRagReply } = useRagChatStream();

  const sendMessage = useCallback(
    async (userMsg: string) => {
      const trimmed = userMsg.trim();
      if (!trimmed) return;

      setMessages((msgs) => [
        ...msgs,
        {
          id: `msg-${Date.now()}-user`,
          from: 'user',
          text: trimmed,
          timestamp: new Date(),
        },
      ]);

      const warningMessage = getModerationWarning(trimmed, currentLocale);
      if (warningMessage) {
        setMessages((msgs) => [
          ...msgs,
          {
            id: `msg-${Date.now()}-warning`,
            from: 'bot',
            text: warningMessage,
            choices: chatbotData.welcome.choices.map(
              (id) => chatbotData.choices[id],
            ),
            isChoiceMessage: true,
          },
        ]);
        return;
      }

      const choice = Object.values(chatbotData.choices).find(
        (item) => item.text === trimmed,
      );

      if (choice) {
        const faq = resolveFaqReply({
          choice,
          chatbotData,
          projects,
          locale: currentLocale,
          basePath: pathname || `/${currentLocale}`,
        });

        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            {
              id: `msg-${Date.now()}-choice`,
              from: 'bot',
              text: faq.reply,
              timestamp: new Date(),
              choices: faq.nextChoices,
              contactButtons: faq.contactButtons?.map((button) => ({
                text: (
                  <p className='flex items-center gap-2'>
                    {button.action === 'email' ? (
                      <SiMinutemailer size={16} />
                    ) : (
                      <FaLinkedin size={16} />
                    )}
                    <span>{button.text}</span>
                  </p>
                ),
                action: button.action,
                url: button.url,
              })),
              goToProjectLink: faq.goToProjectLink?.map((link) =>
                typeof link.text === 'string'
                  ? {
                      text: (
                        <p className='flex items-center gap-2'>
                          <CiLink size={16} />
                          <span>{link.text}</span>
                        </p>
                      ),
                      url: link.url,
                    }
                  : link,
              ),
              isChoiceMessage: true,
            },
          ]);
        }, 800);
        return;
      }

      const botMessageId = `msg-${Date.now()}-rag`;
      setMessages((msgs) => [
        ...msgs,
        {
          id: botMessageId,
          from: 'bot',
          text: '',
          timestamp: new Date(),
        },
      ]);

      setIsStreamingReply(true);
      await streamRagReply({
        messageId: botMessageId,
        message: trimmed,
        locale: currentLocale,
        onChunk: (messageId, text) => {
          setMessages((msgs) =>
            msgs.map((msg) =>
              msg.id === messageId ? { ...msg, text } : msg,
            ),
          );
        },
        onComplete: (messageId, relatedProjectIds) => {
          if (relatedProjectIds.length === 0 || projects.length === 0) return;

          const basePath = pathname || `/${currentLocale}`;
          const projectLinks = buildProjectLinksFromIds(
            relatedProjectIds,
            projects,
            currentLocale,
            basePath,
          );

          if (projectLinks.length === 0) return;

          setMessages((msgs) =>
            msgs.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    isChoiceMessage: true,
                    goToProjectLink: projectLinks,
                  }
                : msg,
            ),
          );
        },
        onError: (messageId) => {
          setMessages((msgs) =>
            msgs.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    text: ragErrorText,
                    choices: chatbotData.welcome.choices.map(
                      (id) => chatbotData.choices[id],
                    ),
                    isChoiceMessage: true,
                  }
                : msg,
            ),
          );
        },
      });
      setIsStreamingReply(false);
    },
    [
      chatbotData,
      currentLocale,
      pathname,
      projects,
      ragErrorText,
      setIsStreamingReply,
      setMessages,
      streamRagReply,
    ],
  );

  return { sendMessage };
}
