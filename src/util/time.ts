// 시간 포맷팅 함수 (로케일에 맞게)
export const formatTime = (date: Date, currentLocale: string): string => {
  const locale =
    currentLocale === 'ko'
      ? 'ko-KR'
      : currentLocale === 'ja'
      ? 'ja-JP'
      : currentLocale === 'en'
      ? 'en-US'
      : 'ko-KR';

  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
