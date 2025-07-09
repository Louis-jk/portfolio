export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  company: string;
  region: string;
  role: string;
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
