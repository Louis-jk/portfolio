import { profanityWords, sexualWords } from '@/data/chatbot/prohibited-words';

type ModerationKind = 'profanity' | 'sexual';

const WARNING_MESSAGES: Record<ModerationKind, Record<string, string>> = {
  profanity: {
    en: 'Please refrain from using profanity. I request a polite conversation.',
    ja: '下品な言葉遣いはお控えください。丁寧な会話をお願いします。',
    ko: '욕은 좀 삼가해주십시오. 정중한 대화를 부탁드립니다.',
  },
  sexual: {
    en: 'Please refrain from inappropriate sexual expressions. I request a polite and healthy conversation.',
    ja: '不適切な性的表現はお控えください。丁寧で健全な会話をお願いします。',
    ko: '부적절한 성적 표현은 삼가해주십시오. 정중하고 건전한 대화를 부탁드립니다.',
  },
};

function matchesProhibitedWord(text: string, word: string) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(^|[^가-힣a-zA-Z0-9])${escapedWord}([^가-힣a-zA-Z0-9]|$)`,
    'i',
  );
  return regex.test(text);
}

export function getModerationWarning(
  text: string,
  locale: string,
): string | null {
  const trimmed = text.trim();
  const hasProfanity = profanityWords.some((word) =>
    matchesProhibitedWord(trimmed, word),
  );
  if (hasProfanity) {
    return WARNING_MESSAGES.profanity[locale] ?? WARNING_MESSAGES.profanity.ko;
  }

  const hasSexual = sexualWords.some((word) =>
    matchesProhibitedWord(trimmed, word),
  );
  if (hasSexual) {
    return WARNING_MESSAGES.sexual[locale] ?? WARNING_MESSAGES.sexual.ko;
  }

  return null;
}
