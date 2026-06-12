import type { ReactNode } from 'react';
import type { ChatbotChoice, ChatbotData } from '@/types/chatbot';
import type { ProjectView } from '@/modules/projects';
import { renderProjectLinkLabel } from '@/features/chatbot/components/chatbot-project-links';

export type FaqContactButton = {
  action: string;
  url: string;
  text: string;
};

export type FaqStaticProjectLink = {
  text: string;
  url: string;
};

export type FaqReplyPayload = {
  reply: string;
  nextChoices: ChatbotChoice[];
  contactButtons?: FaqContactButton[];
  goToProjectLink?: { text: ReactNode; url: string }[];
};

export function resolveFaqReply(args: {
  choice: ChatbotChoice;
  chatbotData: ChatbotData;
  projects: ProjectView[];
  basePath: string;
}): FaqReplyPayload {
  const { choice, chatbotData, projects, basePath } = args;

  const nextChoices = (choice.nextChoices ?? [])
    .map((id) => chatbotData.choices[id])
    .filter(Boolean);

  const contactButtons = choice.contactButtons?.map((button) => ({
    action: button.action,
    url: button.url,
    text: button.text,
  }));

  let goToProjectLink: FaqReplyPayload['goToProjectLink'];

  const platformFilter =
    typeof choice.goToProjectLink === 'string' &&
    ['web', 'mobile', 'desktop'].includes(choice.goToProjectLink)
      ? choice.goToProjectLink
      : null;

  const projectsToShow =
    platformFilter && projects.length > 0
      ? projects.filter((p) =>
          (p.platformCategories ?? []).includes(platformFilter),
        )
      : projects;

  if (
    (choice.goToProjectLink === 'all' || platformFilter) &&
    projectsToShow.length > 0
  ) {
    goToProjectLink = projectsToShow.map((project) => ({
      text: renderProjectLinkLabel(project),
      url: `${basePath}?item=${project.id}`,
    }));
  } else if (
    Array.isArray(choice.goToProjectLink) &&
    choice.goToProjectLink.length > 0
  ) {
    goToProjectLink = choice.goToProjectLink.map((link) => ({
      text: link.text,
      url: link.url,
    }));
  }

  return {
    reply: choice.response,
    nextChoices,
    contactButtons,
    goToProjectLink,
  };
}
