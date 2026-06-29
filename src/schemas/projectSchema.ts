import { z } from 'zod';
import { PROJECT_LOCALES } from '@/entities/projects';

const optionalUrl = z.union([z.string().url(), z.literal('')]);

const lineItemSchema = z.object({ value: z.string() });

const translationFormSchema = z.object({
  title: z.string(),
  role: z.string(),
  overview: z.string(),
  region: z.string(),
  company: z.string(),
  description: z.array(lineItemSchema),
  challenges: z.array(lineItemSchema),
  achievements: z.array(lineItemSchema),
  detailImage: z.string(),
});

export const projectFormValuesSchema = z.object({
  imageUrl: z.string(),
  startDate: z.string().min(1, '시작일(Start Date)을 선택해 주세요.'),
  endDate: z.string().optional(),
  isPublic: z.boolean(),
  technologies: z.string(),
  tools: z.object({
    development: z.string(),
    communication: z.string(),
    design: z.string(),
    debugging: z.string(),
  }),
  platformCategories: z.array(z.string()),
  domainTags: z.array(z.string()),
  platforms: z.object({
    webLink: z.string(),
    iosLink: z.string(),
    androidLink: z.string(),
    desktopLink: z.string(),
  }),
  translations: z.object({
    ko: translationFormSchema,
    ja: translationFormSchema,
    en: translationFormSchema,
  }),
});

export type ProjectFormValues = z.infer<typeof projectFormValuesSchema>;
export type TranslationFormValues = ProjectFormValues['translations']['ko'];

const translationInputSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  region: z.string().optional(),
  role: z.string().optional(),
  overview: z.string().optional(),
  description: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  detailImage: z.string().nullable().optional(),
});

export const projectServerSchema = z.object({
  imageUrl: z.string().min(1, 'imageUrl and startDate are required'),
  startDate: z.string().min(1, 'imageUrl and startDate are required'),
  endDate: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  platformCategories: z.array(z.string()).optional(),
  domainTags: z.array(z.string()).optional(),
  platforms: z
    .object({
      webLink: optionalUrl.nullable().optional(),
      iosLink: optionalUrl.nullable().optional(),
      androidLink: optionalUrl.nullable().optional(),
      desktopLink: optionalUrl.nullable().optional(),
    })
    .optional(),
  tools: z
    .object({
      development: z.array(z.string()).optional(),
      communication: z.array(z.string()).optional(),
      design: z.array(z.string()).optional(),
      debugging: z.array(z.string()).optional(),
    })
    .optional(),
  translations: z
    .object({
      ko: translationInputSchema.optional(),
      ja: translationInputSchema.optional(),
      en: translationInputSchema.optional(),
    })
    .optional(),
});

/** @deprecated Use projectServerSchema — kept for existing tests */
export const projectSchema = projectServerSchema.extend({
  technologies: z.array(z.string()),
  isPublic: z.boolean().default(false),
  platforms: z.object({
    webLink: optionalUrl.optional(),
    iosLink: optionalUrl.optional(),
    androidLink: optionalUrl.optional(),
    desktopLink: optionalUrl.optional(),
  }),
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

export function parseProjectServerPayload(data: unknown) {
  return projectServerSchema.safeParse(data);
}

export function splitCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mapFormLines(lines: { value: string }[]) {
  return lines.map((line) => line.value).filter(Boolean);
}

export function buildProjectServerPayload(
  form: z.infer<typeof projectFormValuesSchema>,
  imageUrl: string,
) {
  const translations = Object.fromEntries(
    PROJECT_LOCALES.map((locale) => [
      locale,
      {
        ...form.translations[locale],
        description: mapFormLines(form.translations[locale].description),
        challenges: mapFormLines(form.translations[locale].challenges),
        achievements: mapFormLines(form.translations[locale].achievements),
      },
    ]),
  ) as z.infer<typeof projectServerSchema>['translations'];

  return {
    imageUrl,
    startDate: form.startDate,
    endDate: form.endDate || null,
    isPublic: form.isPublic,
    technologies: splitCommaSeparated(form.technologies),
    platformCategories: form.platformCategories,
    domainTags: form.domainTags,
    platforms: form.platforms,
    tools: {
      development: splitCommaSeparated(form.tools.development),
      communication: splitCommaSeparated(form.tools.communication),
      design: splitCommaSeparated(form.tools.design),
      debugging: splitCommaSeparated(form.tools.debugging),
    },
    translations,
  };
}
