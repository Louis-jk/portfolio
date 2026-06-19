import { Nanum_Gothic_Coding } from 'next/font/google';

/** Monospace for ASCII diagrams in story code blocks (next/font: latin subset only). */
export const storyCodeFont = Nanum_Gothic_Coding({
  variable: '--font-nanum-coding',
  subsets: ['latin'],
  weight: ['400'],
  display: 'block',
  preload: true,
});
