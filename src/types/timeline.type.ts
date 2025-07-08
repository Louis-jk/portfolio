export type TimelineItem = {
  date: string;
  title: string;
  description: string[];
  link: string;
  thumbnail: string;
};

export const timelineData: TimelineItem[] = [
  {
    date: '2025.01 – Present',
    title: '🎯 Personal Projects & Study',
    description: [
      'Frontend Job Matching Platform (Next.js + Firebase)',
      '3D Portfolio with React Three Fiber',
      'IELTS preparation & job search in AU/NZ market',
    ],
    link: '/work/personal',
    thumbnail: '/images/work/study.png',
  },
  {
    date: '2024.09 – 2024.12',
    title: '💼 Confidential Japanese Startup (Remote)',
    description: [
      'Frontend development for Web3 internal platform',
      'UI animations with GSAP',
      'NFT ticket integration using wagmi & Merkle tree CLI',
    ],
    link: '/work/confidential',
    thumbnail: '/images/work/b2c.png',
  },
  {
    date: '2023.11 – 2024.05',
    title: '🎯 Web3 Campaign Project (Freelance)',
    description: [
      'Landing page & NFT minting frontend (Next.js 13 → 14)',
      'Multilingual support, architecture refactoring',
      'Integration with RainbowKit / Metamask UI',
    ],
    link: '/work/web3',
    thumbnail: '/images/work/web3.png',
  },
];
