import { ChatbotData } from '@/types/chatbot';

// 한국어 챗봇 데이터
export const chatbotDataKo: ChatbotData = {
  welcome: {
    message:
      '안녕하세요. 김준호입니다. 먼저 제 포트폴리오 사이트에 방문해주셔서 감사드립니다. 간단하더라도 궁금하신 점에 대해 답변드릴 수 있으면 좋겠습니다.',
    choices: [
      'skills',
      'experience',
      'languages',
      'workStyle',
      'strengths',
      'interests',
      'contact',
    ],
  },
  choices: {
    skills: {
      id: 'skills',
      text: '어떤 기술을 사용해?',
      response:
        '프론트엔드: TypeScript, React, Next.js, React Native, Electron / 백엔드: Node.js, Go(개인 프로젝트 경험) / 데이터베이스: MongoDB, MySQL, MariaDB / 클라우드: AWS(EC2, S3, Route53, CloudFront)',
      nextChoices: ['experience'],
    },
    frontend: {
      id: 'frontend',
      text: '프론트엔드 기술은?',
      response:
        'TypeScript를 기반으로 React, Next.js, React Native, Electron 등을 사용합니다. 컴포넌트 기반 아키텍처와 퍼포먼스 최적화에 중점을 두고 개발합니다.',
      nextChoices: ['experience', 'contact'],
    },
    experience: {
      id: 'experience',
      text: '프로젝트 경험은?',
      response:
        '웹사이트, 반응형 웹앱, 모바일 애플리케이션, 관리자 대시보드 등 다양한 프로덕션 레벨 프로젝트를 진행했습니다. 프리랜서로 국제 클라이언트와 협업한 경험이 있으며, 기획부터 개발, 배포까지 전체 워크플로우를 다룬 경험이 있습니다.',
      nextChoices: ['website', 'mobileApp', 'desktopApp'],
    },
    website: {
      id: 'website',
      text: '웹 개발 경험은?',
      response:
        '웹사이트 경험으로는 일본 한국 식당 안내 플랫폼의 리뉴얼 프로젝트의 프론트엔드 개발 담당, 일본 Web3 프로젝트의 캠페인 사이트 프론트엔드 개발 담당, 일본 B2C 사이트 프론트엔드 개발 담당 의 프로젝트 경험이 있습니다. Next.js 버전은 12부터 15까지 사용한 경험이 있습니다.',
      nextChoices: ['nextjs', 'mobileApp', 'desktopApp', 'contact'],
    },
    nextjs: {
      id: 'nextjs',
      text: 'Next.js 프로젝트',
      response:
        'Next.js를 사용한 프로젝트 경험으로는 한국 외식 정보 플랫폼의 리뉴얼 프로젝트의 프론트엔드 개발 담당, 일본 Web3 프로젝트의 캠페인 사이트 프론트엔드 개발 담당, 일본 B2C 사이트 프론트엔드 개발 담당 의 프로젝트 경험이 있습니다. Next.js 버전은 12부터 15까지 사용한 경험이 있습니다.',
      goToProjectLink: [
        {
          text: '한국 외식 정보 플랫폼 리뉴얼',
          url: '?item=projects.dmonster_diningcode',
        },
        {
          text: 'Web3-Wizardry',
          url: '?item=projects.turingum_web03_wizardry_campaign',
        },
        {
          text: 'Web3-Mystery Ticket',
          url: '?item=projects.turingum_web03_tokyo_beast_mystery_ticket',
        },
        {
          text: 'Web3-Tokyo Beast Base',
          url: '?item=projects.turingum_web03_tokyo_beast_base',
        },
        {
          text: '신규 B2C 사이트',
          url: '?item=projects.confidential_japanese_startup',
        },
        {
          text: '개인 프로젝트',
          url: '?item=projects.personal',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    mobileApp: {
      id: 'mobileApp',
      text: '모바일 앱 개발 경험은?',
      response:
        '모바일 앱 개발 경험으로는 React Native를 사용한 프론트엔드 개발로 다양한 프로젝트에 참여한 경험이 있습니다.',
      goToProjectLink: [
        {
          text: '공주로',
          url: '?item=projects.dmonster_gongjuro',
        },
        {
          text: '사라진 인사동',
          url: '?item=projects.dmonster_insadong',
        },
        {
          text: '페이퍼공작소-고객',
          url: '?item=projects.dmonster_paper_workshop_customers',
        },
        {
          text: '페이퍼공작소-파트너스',
          url: '?item=projects.dmonster_paper_workshop_partners',
        },
        {
          text: '아이드로우',
          url: '?item=projects.dmonster_idraw',
        },
        {
          text: '오늘의주문',
          url: '?item=projects.dmonster_todaysorder',
        },
        {
          text: '베가스통',
          url: '?item=projects.dmonster_vegastong',
        },
        {
          text: 'MOZAIQ',
          url: '?item=projects.dmonster_mozaiq',
        },
        {
          text: 'MOLI',
          url: '?item=projects.dmonster_moli',
        },
        {
          text: '동네북',
          url: '?item=projects.dmonster_dongnaebook',
        },
        {
          text: '테니스예약앱',
          url: '?item=projects.confidential_korean_startup',
        },
        {
          text: 'Crew Inc. 모바일 앱',
          url: '?item=projects.crewinc_mobile_frontend',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    desktopApp: {
      id: 'desktopApp',
      text: '데스크탑 앱 개발 경험은?',
      response:
        '데스크탑 앱 개발 경험으로는 electron + React를 사용한 프로젝트 경험이 있습니다. 아래 링크로 확인하실 수 있습니다.',
      goToProjectLink: [
        {
          text: '동네북 점주용 POS',
          url: '?item=projects.dmonster_dongnaebook',
        },
        {
          text: 'MOLI(모리)',
          url: '?item=projects.dmonster_moli',
        },
        {
          text: '오늘의 주문 점주용 POS',
          url: '?item=projects.dmonster_todaysorder',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    backend: {
      id: 'backend',
      text: '백엔드 기술은?',
      response:
        'Node.js와 Go를 사용합니다. Express, NestJS, Fiber 등의 프레임워크 경험이 있으며, RESTful API 설계와 마이크로서비스 아키텍처에 관심이 많습니다.',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    database: {
      id: 'database',
      text: '데이터베이스 경험은?',
      response:
        '관계형 데이터베이스(MySQL, MariaDB)와 NoSQL(MongoDB) 경험이 있습니다. 데이터 모델링과 최적화에 관심이 많습니다.',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    cloud: {
      id: 'cloud',
      text: '클라우드 경험은?',
      response:
        'AWS 클라우드 플랫폼(EC2, S3, Route53, CloudFront)에 서비스를 배포한 경험이 있습니다.',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    projectTypes: {
      id: 'projectTypes',
      text: '프로젝트 타입별로 보여줘',
      response:
        'B2B 서비스, 인쇄 견적 플랫폼, 배송 관리 앱, 다국어 웹사이트 등을 주로 개발했습니다. 각 프로젝트마다 클라이언트의 요구사항을 정확히 파악하고 최적의 솔루션을 제공하는 것에 집중합니다.',
      nextChoices: ['experience', 'contact'],
    },
    collaboration: {
      id: 'collaboration',
      text: '협업 방식은?',
      response:
        '디자이너, 백엔드 개발자와의 협업 경험이 풍부하며, 원격 근무 환경에서도 적극적인 커뮤니케이션을 통해 프로젝트를 진행합니다.',
      nextChoices: ['experience', 'contact'],
    },
    workflow: {
      id: 'workflow',
      text: '개발 워크플로우는?',
      response:
        '기획 단계부터 적극적으로 참여하고, Git을 활용한 버전 관리, 코드 리뷰, CI/CD 파이프라인 구축 등을 통해 체계적인 개발 프로세스를 운영합니다.',
      nextChoices: ['experience', 'contact'],
    },
    languages: {
      id: 'languages',
      text: '어떤 언어를 사용해?',
      response:
        '한국어가 모국어이고, 비즈니스 커뮤니케이션을 위한 일본어에 능숙합니다. 영어는 기초부터 공부 중이며, 간단한 커뮤니케이션은 가능하지만 더욱 향상시키기 위해 노력하고 있습니다.',
      nextChoices: ['korean', 'japanese', 'english'],
    },
    korean: {
      id: 'korean',
      text: '한국어 능력은?',
      response:
        '한국어가 모국어이므로 자연스럽게 사용할 수 있습니다. 기술 문서 작성과 커뮤니케이션에 문제가 없습니다.',
      nextChoices: ['languages', 'contact'],
    },
    japanese: {
      id: 'japanese',
      text: '일본어 능력은?',
      response:
        '비즈니스 커뮤니케이션을 위한 일본어에 능숙하며, 일본 클라이언트와의 협업 경험이 있습니다.',
      nextChoices: ['languages', 'contact'],
    },
    english: {
      id: 'english',
      text: '영어 능력은?',
      response:
        '기초부터 공부 중이며, 간단한 커뮤니케이션은 가능하지만 더욱 향상시키기 위해 노력하고 있습니다.',
      nextChoices: ['languages', 'contact'],
    },
    workStyle: {
      id: 'workStyle',
      text: '일하는 방식은?',
      response:
        '기획 단계부터 적극적으로 참여하고, 명확한 커뮤니케이션을 통해 협업합니다. 일정 준수에 책임감을 가지며, 빠르게 피드백을 반영하고 유연하게 대응합니다.',
      nextChoices: ['communication', 'environment', 'contact'],
    },
    communication: {
      id: 'communication',
      text: '커뮤니케이션 스타일은?',
      response:
        '명확하고 간결한 설명을 선호하며, 기술적 내용을 비개발자도 이해할 수 있도록 설명하는 것을 잘합니다.',
      nextChoices: ['workStyle', 'contact'],
    },
    learning: {
      id: 'learning',
      text: '학습 방법은?',
      response:
        '온라인 강의, 기술 문서, 오픈소스 프로젝트 참여, 기술 블로그 작성 등을 통해 지속적으로 학습하고 있습니다.',
      nextChoices: ['workStyle', 'contact'],
    },
    environment: {
      id: 'environment',
      text: '업무 환경 선호도는?',
      response:
        '가능하다면 원격 근무를 선호합니다. 사무실 근무도 가능하지만, 유연한 근무 시간을 중요하게 생각합니다.',
      nextChoices: ['workStyle', 'contact'],
    },
    strengths: {
      id: 'strengths',
      text: '강점은 뭐야?',
      response:
        '문제를 빠르게 파악하고 해결하는 능력이 강점입니다. 컴포넌트 단위 설계, 퍼포먼스 최적화, 사용자 중심의 UI 구현에 강하며, 다양한 환경에서의 크로스 브라우징과 모바일 대응도 잘합니다.',
      nextChoices: ['techStack', 'teamwork', 'problemSolving', 'contact'],
    },
    techStack: {
      id: 'techStack',
      text: '기술 스택은?',
      response:
        'Frontend: TypeScript, React, Next.js, React Native, Electron / Backend: Node.js, Go(개인 프로젝트 경험) / Database: MongoDB, MySQL, MariaDB / Cloud: AWS(EC2, S3, Route53, CloudFront)',
      nextChoices: ['strengths', 'problemSolving', 'contact'],
    },
    teamwork: {
      id: 'teamwork',
      text: '팀워크는 어떻게 해?',
      response:
        '원격 근무 환경에서도 적극적인 커뮤니케이션을 통해 팀원들과 협력하며, 코드 리뷰와 지식 공유를 중요하게 생각합니다.',
      nextChoices: ['strengths', 'contact'],
    },
    problemSolving: {
      id: 'problemSolving',
      text: '문제 해결 능력은?',
      response:
        '시스템적인 접근으로 문제를 분석하고, 다양한 해결책을 제시하며, 최적의 솔루션을 찾아내는 것을 좋아합니다.',
      nextChoices: ['strengths', 'contact'],
    },
    interests: {
      id: 'interests',
      text: '관심 있는 분야는?',
      response:
        '사용자 경험을 고려한 프론트엔드 개발에 관심이 많고, Web3, 챗봇, 인터랙티브한 UI/UX, 글로벌 다국어 서비스 구축에도 열정을 가지고 있습니다.',
      nextChoices: [
        'improvement',
        'goals',
        'currentStudy',
        'futurePlans',
        'newChallenges',
      ],
    },
    improvement: {
      id: 'improvement',
      text: '개선하고 있는 부분은?',
      response:
        '프론트엔드 개발 분야에서 더 빠르고 효율적인 개발을 위해 노력하고 있습니다.',
      nextChoices: ['interests', 'contact'],
    },
    goals: {
      id: 'goals',
      text: '목표는 뭐야?',
      response:
        '항상 새로운 기술과 도전을 통해 사용자 경험을 개선하고, 팀과 함께 성장하는 프론트엔드 개발자가 되는 것이 목표입니다.',
      nextChoices: ['interests', 'contact'],
    },
    currentStudy: {
      id: 'currentStudy',
      text: '현재 공부 중인 기술은?',
      response: '프론트엔드 개발 분야와 백엔드 개발 분야를 공부하고 있습니다.',
      nextChoices: ['interests', 'contact'],
    },
    futurePlans: {
      id: 'futurePlans',
      text: '미래 계획은?',
      response:
        '프론트엔드 개발자에서 풀스택 개발자로 되는 것을 목표로 하고, 새로운 기술을 도입하여 사용자에게 가치 있는 서비스를 제공하는 것이 계획입니다.',
      nextChoices: ['interests', 'contact'],
    },
    newChallenges: {
      id: 'newChallenges',
      text: '새로운 도전에 대한 생각은?',
      response:
        '새로운 기술과 도메인에 대한 도전을 두려워하지 않으며, 학습 곡선을 즐기고 있습니다.',
      nextChoices: ['interests', 'contact'],
    },
    contact: {
      id: 'contact',
      text: '어떻게 연락해?',
      response: '연락하고 싶으시다면 아래 버튼을 클릭해주세요.',
      contactButtons: [
        {
          text: '이메일로 연락하기',
          action: 'email',
          url: 'mailto:lippoint.surf0622@gmail.com',
        },
        {
          text: 'LinkedIn으로 연락하기',
          action: 'linkedin',
          url: 'https://www.linkedin.com/in/louis-jk',
        },
      ],
      nextChoices: ['skills'],
    },
  },
};
