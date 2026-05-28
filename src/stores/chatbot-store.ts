import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ReactNode } from 'react';
import type { ChatbotChoice } from '@/types/chatbot';

export type ChatMessage = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp?: string | Date;
  choices?: ChatbotChoice[];
  isChoiceMessage?: boolean;
  contactButtons?: {
    text: ReactNode;
    action: string;
    url: string;
  }[];
  goToProjectLink?: {
    text: ReactNode;
    url: string;
    projectId?: number;
    imageUrl?: string | null;
  }[];
};

type ChatbotState = {
  open: boolean;
  messages: ChatMessage[];
  input: string;
  isStreamingReply: boolean;
  isNavigatingProject: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  setMessages: (
    value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  setInput: (value: string | ((prev: string) => string)) => void;
  setIsStreamingReply: (value: boolean) => void;
  setIsNavigatingProject: (value: boolean) => void;
};

function resolveUpdater<T>(prev: T, value: T | ((current: T) => T)) {
  return typeof value === 'function' ? (value as (current: T) => T)(prev) : value;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      open: false,
      messages: [],
      input: '',
      isStreamingReply: false,
      isNavigatingProject: false,
      setOpen: (value) =>
        set((state) => ({ open: resolveUpdater(state.open, value) })),
      setMessages: (value) =>
        set((state) => ({ messages: resolveUpdater(state.messages, value) })),
      setInput: (value) =>
        set((state) => ({ input: resolveUpdater(state.input, value) })),
      setIsStreamingReply: (value) => set({ isStreamingReply: value }),
      setIsNavigatingProject: (value) => set({ isNavigatingProject: value }),
    }),
    {
      name: 'portfolio-chatbot-state',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        open: state.open,
        messages: state.messages.map((message) => ({
          id: message.id,
          from: message.from,
          text: message.text,
          timestamp:
            message.timestamp instanceof Date
              ? message.timestamp.toISOString()
              : message.timestamp,
        })),
        input: state.input,
      }),
    },
  ),
);
