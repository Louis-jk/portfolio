// 현재 로케일 가져오기 (URL에서 추출)
export const getCurrentLocale = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/([a-z]{2})/);
    return localeMatch ? localeMatch[1] : 'ko';
  }
  return 'ko';
};
