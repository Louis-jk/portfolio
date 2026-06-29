/** Public home overlay: /{locale}?item={id}&story=1 */
export function getPublicStoryUrl(locale: string, projectId: number) {
  return `/${locale}?item=${projectId}&story=1`;
}
