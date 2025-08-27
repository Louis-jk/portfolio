export interface ChatbotChoice {
  id: string;
  text: string;
  response: string;
  nextChoices?: string[]; // 다음 선택지들의 ID 배열
  contactButtons?: {
    text: string;
    action: string;
    url: string;
  }[];
  goToProjectLink?: {
    text: string;
    url: string;
  }[];
}

export interface ChatbotData {
  welcome: {
    message: string;
    choices: string[]; // 초기 선택지들의 ID 배열
  };
  choices: Record<string, ChatbotChoice>;
}
