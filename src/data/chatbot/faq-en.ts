import { ChatbotData } from '@/types/chatbot';

// English chatbot data
export const chatbotDataEn: ChatbotData = {
  welcome: {
    message:
      "Hello, I'm Joonho Kim. Thank you for visiting my portfolio site. If you have any questions, please don’t hesitate to ask.",
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
      text: 'What technologies do you use?',
      response:
        'Frontend: TypeScript, React, Next.js, React Native, Electron / Backend: Node.js, Go (personal project experience) / Database: MongoDB, MySQL, MariaDB / Cloud: AWS (EC2, S3, Route53, CloudFront)',
      nextChoices: ['experience'],
    },
    frontend: {
      id: 'frontend',
      text: 'What about frontend technologies?',
      response:
        'I use TypeScript-based React, Next.js, React Native, Electron, etc. I focus on component-based architecture and performance optimization in development.',
      nextChoices: ['experience', 'contact'],
    },
    experience: {
      id: 'experience',
      text: 'What is your project experience?',
      response:
        'I have worked on various production-level projects including websites, responsive web apps, mobile applications, and admin dashboards. I have experience collaborating with international clients as a freelancer, handling everything from planning to development and deployment.',
      nextChoices: ['website', 'mobileApp', 'desktopApp'],
    },
    website: {
      id: 'website',
      text: 'What about web development experience?',
      response:
        'My website experience includes frontend development for a Japanese Korean restaurant guide platform renewal project, frontend development for a Japanese Web3 project campaign site, and frontend development for a Japanese B2C site. I have experience using Next.js versions 12 through 15.',
      nextChoices: ['nextjs', 'mobileApp', 'desktopApp', 'contact'],
    },
    nextjs: {
      id: 'nextjs',
      text: 'Next.js projects',
      response:
        'My Next.js project experience includes frontend development for a Korean dining information platform renewal project, frontend development for a Japanese Web3 project campaign site, and frontend development for a Japanese B2C site. I have experience using Next.js versions 12 through 15.',
      goToProjectLink: [
        {
          text: 'Korean Dining Info Platform Renewal',
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
          text: 'New B2C Site',
          url: '?item=projects.confidential_japanese_startup',
        },
        {
          text: 'Personal Projects',
          url: '?item=projects.personal',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    mobileApp: {
      id: 'mobileApp',
      text: 'What about mobile app development experience?',
      response:
        'My mobile app development experience includes frontend development using React Native for various projects.',
      goToProjectLink: [
        {
          text: 'Gongjuro',
          url: '?item=projects.dmonster_gongjuro',
        },
        {
          text: 'Vanished Insadong',
          url: '?item=projects.dmonster_insadong',
        },
        {
          text: 'Paper Workshop - Customers',
          url: '?item=projects.dmonster_paper_workshop_customers',
        },
        {
          text: 'Paper Workshop - Partners',
          url: '?item=projects.dmonster_paper_workshop_partners',
        },
        {
          text: 'IDraw',
          url: '?item=projects.dmonster_idraw',
        },
        {
          text: "Today's Order",
          url: '?item=projects.dmonster_todaysorder',
        },
        {
          text: 'Vegastong',
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
          text: 'Dongnaebook',
          url: '?item=projects.dmonster_dongnaebook',
        },
        {
          text: 'Tennis Reservation App',
          url: '?item=projects.confidential_korean_startup',
        },
        {
          text: 'Crew Inc. Mobile App',
          url: '?item=projects.crewinc_mobile_frontend',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    desktopApp: {
      id: 'desktopApp',
      text: 'What about desktop app development experience?',
      response:
        'My desktop app development experience includes projects using Electron + React. You can check the details through the links below.',
      goToProjectLink: [
        {
          text: 'Dongnaebook Store Owner POS',
          url: '?item=projects.dmonster_dongnaebook',
        },
        {
          text: 'MOLI (Mori)',
          url: '?item=projects.dmonster_moli',
        },
        {
          text: "Today's Order Store Owner POS",
          url: '?item=projects.dmonster_todaysorder',
        },
      ],
      nextChoices: ['workStyle', 'contact'],
    },
    backend: {
      id: 'backend',
      text: 'What about backend technologies?',
      response:
        'I use Node.js and Go. I have experience with frameworks like Express, NestJS, Fiber, and I am interested in RESTful API design and microservice architecture.',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    database: {
      id: 'database',
      text: 'What about database experience?',
      response:
        'I have experience with relational databases (MySQL, MariaDB) and NoSQL (MongoDB). I am interested in data modeling and optimization.',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    cloud: {
      id: 'cloud',
      text: 'What about cloud experience?',
      response:
        'I have experience deploying services on AWS cloud platform (EC2, S3, Route53, CloudFront).',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    projectTypes: {
      id: 'projectTypes',
      text: 'Show me by project type',
      response:
        'I mainly develop B2B services, printing quote platforms, delivery management apps, and multilingual websites. For each project, I focus on accurately understanding client requirements and providing optimal solutions.',
      nextChoices: ['experience', 'contact'],
    },
    collaboration: {
      id: 'collaboration',
      text: 'How do you collaborate?',
      response:
        'I have rich experience collaborating with designers and backend developers, and I actively communicate even in remote work environments to progress projects.',
      nextChoices: ['experience', 'contact'],
    },
    workflow: {
      id: 'workflow',
      text: 'What is your development workflow?',
      response:
        'I actively participate from the planning stage and operate systematic development processes through Git-based version control, code reviews, and CI/CD pipeline construction.',
      nextChoices: ['experience', 'contact'],
    },
    languages: {
      id: 'languages',
      text: 'What languages do you use?',
      response:
        'Korean is my native language, and I am proficient in Japanese for business communication. I am studying English from the basics and can handle simple communication, but I am working to improve further.',
      nextChoices: ['korean', 'japanese', 'english'],
    },
    korean: {
      id: 'korean',
      text: 'What about your Korean ability?',
      response:
        'Korean is my native language, so I can use it naturally. I have no problems writing technical documents and communicating.',
      nextChoices: ['languages', 'contact'],
    },
    japanese: {
      id: 'japanese',
      text: 'What about your Japanese ability?',
      response:
        'I am proficient in Japanese for business communication and have experience collaborating with Japanese clients.',
      nextChoices: ['languages', 'contact'],
    },
    english: {
      id: 'english',
      text: 'What about your English ability?',
      response:
        'I am studying from the basics and can handle simple communication, but I am working to improve further.',
      nextChoices: ['languages', 'contact'],
    },
    workStyle: {
      id: 'workStyle',
      text: 'How do you work?',
      response:
        'I actively participate from the planning stage and collaborate through clear communication. I take responsibility for meeting deadlines and quickly incorporate feedback while responding flexibly.',
      nextChoices: ['communication', 'environment', 'contact'],
    },
    communication: {
      id: 'communication',
      text: 'What is your communication style?',
      response:
        'I prefer clear and concise explanations and am good at explaining technical content in a way that non-developers can understand.',
      nextChoices: ['workStyle', 'contact'],
    },
    learning: {
      id: 'learning',
      text: 'How do you learn?',
      response:
        'I continuously learn through online courses, technical documentation, open source project participation, and technical blog writing.',
      nextChoices: ['workStyle', 'contact'],
    },
    environment: {
      id: 'environment',
      text: 'What is your work environment preference?',
      response:
        'I prefer remote work if possible. Office work is also possible, but I value flexible working hours.',
      nextChoices: ['workStyle', 'contact'],
    },
    strengths: {
      id: 'strengths',
      text: 'What are your strengths?',
      response:
        'My strength is the ability to quickly identify and solve problems. I am strong in component-level design, performance optimization, and user-centered UI implementation, and I also handle cross-browsing and mobile responsiveness well in various environments.',
      nextChoices: ['techStack', 'teamwork', 'problemSolving', 'contact'],
    },
    techStack: {
      id: 'techStack',
      text: 'What is your tech stack?',
      response:
        'Frontend: TypeScript, React, Next.js, React Native, Electron / Backend: Node.js, Go (personal project experience) / Database: MongoDB, MySQL, MariaDB / Cloud: AWS (EC2, S3, Route53, CloudFront)',
      nextChoices: ['strengths', 'problemSolving', 'contact'],
    },
    teamwork: {
      id: 'teamwork',
      text: 'How do you handle teamwork?',
      response:
        'I actively communicate with team members even in remote work environments and value code reviews and knowledge sharing.',
      nextChoices: ['strengths', 'contact'],
    },
    problemSolving: {
      id: 'problemSolving',
      text: 'What about your problem-solving ability?',
      response:
        'I analyze problems systematically, present various solutions, and enjoy finding optimal solutions.',
      nextChoices: ['strengths', 'contact'],
    },
    interests: {
      id: 'interests',
      text: 'What areas are you interested in?',
      response:
        'I am very interested in frontend development that considers user experience, and I am passionate about building Web3, chatbots, interactive UI/UX, and global multilingual services.',
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
      text: 'What are you improving?',
      response:
        'I am working to develop faster and more efficiently in the frontend development field.',
      nextChoices: ['interests', 'contact'],
    },
    goals: {
      id: 'goals',
      text: 'What are your goals?',
      response:
        'My goal is to become a frontend developer who always improves user experience through new technologies and challenges, and grows together with the team.',
      nextChoices: ['interests', 'contact'],
    },
    currentStudy: {
      id: 'currentStudy',
      text: 'What technologies are you currently studying?',
      response: 'I am studying frontend development and backend development.',
      nextChoices: ['interests', 'contact'],
    },
    futurePlans: {
      id: 'futurePlans',
      text: 'What are your future plans?',
      response:
        'My plan is to become a full-stack developer from a frontend developer and provide valuable services to users by introducing new technologies.',
      nextChoices: ['interests', 'contact'],
    },
    newChallenges: {
      id: 'newChallenges',
      text: 'What do you think about new challenges?',
      response:
        'I am not afraid of challenges with new technologies and domains, and I enjoy the learning curve.',
      nextChoices: ['interests', 'contact'],
    },
    contact: {
      id: 'contact',
      text: 'How can I contact you?',
      response:
        'If you would like to contact me, please click the button below.',
      contactButtons: [
        {
          text: 'Contact by Email',
          action: 'email',
          url: 'mailto:lippoint.surf0622@gmail.com',
        },
        {
          text: 'Contact via LinkedIn',
          action: 'linkedin',
          url: 'https://www.linkedin.com/in/louis-jk',
        },
      ],
      nextChoices: ['skills'],
    },
  },
};
