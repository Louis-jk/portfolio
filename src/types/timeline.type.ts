export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string[];
  link: string;
  thumbnail: string;
  details?: {
    fullDescription: string;
    technologies: string[];
    challenges: string[];
    achievements: string[];
    image?: string;
  };
};

export const timelineData: TimelineItem[] = [
  {
    id: 'personal-projects',
    date: '2025.01 – Present',
    title: '🎯 Personal Projects & Study',
    description: [
      'Frontend Job Matching Platform (Next.js + Firebase)',
      '3D Portfolio with React Three Fiber',
      'IELTS preparation & job search in AU/NZ market',
    ],
    link: '/work/personal',
    thumbnail: '/images/work/study.png',
    details: {
      fullDescription:
        'Currently focusing on personal development and preparing for international opportunities. Building innovative projects while improving language skills for the Australian/New Zealand job market.',
      technologies: [
        'Next.js',
        'Firebase',
        'React Three Fiber',
        'TypeScript',
        'Tailwind CSS',
      ],
      challenges: [
        'Balancing multiple projects simultaneously',
        'Preparing for international job market',
        'Learning new technologies',
      ],
      achievements: [
        'Completed 3D portfolio with interactive elements',
        'Built job matching platform',
        'Improved IELTS score',
      ],
      image: '/images/work/study.png',
    },
  },
  {
    id: 'japanese-startup',
    date: '2024.09 – 2024.12',
    title: '💼 Confidential Japanese Startup (Remote)',
    description: [
      'Frontend development for Web3 internal platform',
      'UI animations with GSAP',
      'NFT ticket integration using wagmi & Merkle tree CLI',
    ],
    link: '/work/confidential',
    thumbnail: '/images/work/b2c.png',
    details: {
      fullDescription:
        'Worked as a remote frontend developer for a Japanese startup, focusing on Web3 technologies and creating engaging user experiences with advanced animations.',
      technologies: [
        'React',
        'GSAP',
        'wagmi',
        'Web3',
        'TypeScript',
        'Tailwind CSS',
      ],
      challenges: [
        'Remote collaboration with international team',
        'Complex Web3 integration',
        'Performance optimization for animations',
      ],
      achievements: [
        'Successfully integrated NFT ticket system',
        'Improved UI/UX with smooth animations',
        'Reduced bundle size by 30%',
      ],
      image: '/images/work/b2c.png',
    },
  },
  {
    id: 'web3-campaign',
    date: '2023.11 – 2024.05',
    title: '🎯 Web3 Campaign Project (Freelance)',
    description: [
      'Landing page & NFT minting frontend (Next.js 13 → 14)',
      'Multilingual support, architecture refactoring',
      'Integration with RainbowKit / Metamask UI',
    ],
    link: '/work/web3',
    thumbnail: '/images/work/web3.png',
    details: {
      fullDescription:
        'Developed a comprehensive Web3 campaign platform with NFT minting capabilities, featuring multilingual support and seamless wallet integration.',
      technologies: [
        'Next.js 13/14',
        'RainbowKit',
        'Metamask',
        'Web3',
        'i18n',
        'TypeScript',
      ],
      challenges: [
        'Migrating from Next.js 13 to 14',
        'Implementing multilingual support',
        'Ensuring wallet compatibility',
      ],
      achievements: [
        'Successfully launched NFT minting campaign',
        'Improved site performance by 40%',
        'Supported 3 languages',
      ],
      image: '/images/work/web3.png',
    },
  },
];
