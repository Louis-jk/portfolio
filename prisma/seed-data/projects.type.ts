export type ProjectSeedItem = {
  id: string;
  date: string;
  title: string;
  company: string;
  region: string;
  role: string;
  description: string[];
  isNDA: boolean;
  isCommercial: boolean;
  personalLinks?: {
    title: string;
    github: string;
  }[];
  commercialPlatforms: {
    web: boolean;
    mobile: boolean;
    desktop: boolean;
  };
  commercialLinks: {
    web: string;
    ios: string;
    android: string;
    desktop: string;
  };
  thumbnail: string;
  details?: {
    overview: string;
    technologies: string[];
    tools?: {
      communication: string[];
      development: string[];
      design: string[];
      debugging: string[];
    };
    challenges: string[];
    achievements: string[];
    image?: string;
  };
};
