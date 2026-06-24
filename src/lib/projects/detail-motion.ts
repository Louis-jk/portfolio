export function detailSectionMotion(isVisible: boolean, delay: number) {
  return {
    initial: { opacity: 0, y: 20 } as const,
    animate: isVisible
      ? ({ opacity: 1, y: 0 } as const)
      : ({ opacity: 0, y: 20 } as const),
    transition: { duration: 0.5, delay },
  };
}
