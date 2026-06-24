import type {
  I18nStringArrayDto,
  I18nStringDto,
  ProjectAdminView,
} from '@/modules/projects';

export type AdminProjectListItem = Pick<
  ProjectAdminView,
  | 'id'
  | 'imageUrl'
  | 'startDate'
  | 'endDate'
  | 'isPublic'
  | 'platformCategories'
  | 'domainTags'
  | 'title'
>;

/** Serialized for client preview (dates as ISO strings from the route page). */
export type AdminProjectPreview = {
  id: number;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories?: string[];
  domainTags?: string[];
  title: I18nStringDto;
  company: I18nStringDto;
  region: I18nStringDto;
  role: I18nStringDto;
  overview: I18nStringDto;
  description: I18nStringArrayDto;
  challenges: I18nStringArrayDto;
  achievements: I18nStringArrayDto;
  platforms: {
    webLink: string | null;
    iosLink: string | null;
    androidLink: string | null;
    desktopLink: string | null;
  } | null;
  tools: {
    development: string[];
    communication: string[];
    design: string[];
    debugging: string[];
  } | null;
};
