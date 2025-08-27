import { ChatbotData } from '@/types/chatbot';
import { chatbotDataKo } from './faq-ko';
import { chatbotDataJa } from './faq-ja';
import { chatbotDataEn } from './faq-en';

// 언어별 데이터 매핑
export const chatbotDataByLocale: Record<string, ChatbotData> = {
  ko: chatbotDataKo,
  en: chatbotDataEn,
  ja: chatbotDataJa,
};

// 기본 데이터 (한국어)
export const chatbotData = chatbotDataKo;
