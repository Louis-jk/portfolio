// src/schemas/projectSchema.ts
import { z } from 'zod';

export const projectSchema = z.object({
  // 공통 데이터
  imageUrl: z.string().min(1, '이미지 URL은 필수입니다.'),
  startDate: z.string(),
  endDate: z.string().optional(),
  isPublic: z.boolean().default(false),
  technologies: z.array(z.string()),

  // 플랫폼 링크
  platforms: z.object({
    webLink: z.string().url().optional().or(z.literal('')),
    iosLink: z.string().url().optional().or(z.literal('')),
    androidLink: z.string().url().optional().or(z.literal('')),
    desktopLink: z.string().url().optional().or(z.literal('')),
  }),

  // 다국어 데이터 (핵심!)
  translations: z.object({
    ko: z.object({
      title: z.string().min(1),
      role: z.string(),
      overview: z.string(),
    }),
    ja: z.object({
      title: z.string().min(1),
      role: z.string(),
      overview: z.string(),
    }),
    en: z.object({
      title: z.string().min(1),
      role: z.string(),
      overview: z.string(),
    }),
  }),
});
