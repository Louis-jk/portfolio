import { ChatbotData } from '@/types/chatbot';

// 日本語チャットボットデータ
export const chatbotDataJa: ChatbotData = {
  welcome: {
    message:
      'こんにちは。私はキム・ジュノのAIアシスタントです。ポートフォリオをご覧いただきありがとうございます。ご質問をいただければ、経歴やプロジェクト情報をもとにご案内します。',
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
      text: 'スキルは？',
      response:
        'フロントエンド: TypeScript, React, Next.js, React Native, Electron / バックエンド: Node.js, Go（個人プロジェクト経験） / データベース: MongoDB, MySQL, MariaDB / クラウド: AWS（EC2, S3, Route53, CloudFront）',
      nextChoices: ['experience'],
    },
    frontend: {
      id: 'frontend',
      text: 'フロントエンドスキルは？',
      response:
        'TypeScriptベースのReact、Next.js、React Native、Electronなどを使用しています。コンポーネントベースのアーキテクチャとパフォーマンス最適化に重点を置いて開発しています。',
      nextChoices: ['experience', 'contact'],
    },
    experience: {
      id: 'experience',
      text: 'プロジェクト経験は？',
      response:
        'ウェブサイト、レスポンシブウェブアプリ、モバイルアプリケーション、管理者ダッシュボードなど、様々なプロダクションレベルのプロジェクトを進めてきました。フリーランスとして国際クライアントとの協力経験があり、企画から開発、デプロイまで全体のワークフローを扱った経験があります。',
      nextChoices: ['website', 'mobileApp', 'desktopApp'],
    },
    website: {
      id: 'website',
      text: 'ウェブ開発経験は？',
      response:
        'ウェブサイト経験としては、日本の韓国料理店案内プラットフォームのリニューアルプロジェクトのフロントエンド開発担当、日本のWeb3プロジェクトのキャンペーンサイトフロントエンド開発担当、日本のB2Cサイトフロントエンド開発担当のプロジェクト経験があります。Next.jsバージョンは12から15まで使用した経験があります。',
      nextChoices: ['nextjs', 'mobileApp', 'desktopApp', 'contact'],
    },
    nextjs: {
      id: 'nextjs',
      text: 'Next.jsプロジェクト',
      response:
        'Next.jsを使用したプロジェクト経験としては、韓国の外食情報プラットフォームのリニューアルプロジェクトのフロントエンド開発担当、日本のWeb3プロジェクトのキャンペーンサイトフロントエンド開発担当、日本のB2Cサイトフロントエンド開発担当のプロジェクト経験があります。Next.jsバージョンは12から15まで使用した経験があります。',
      goToProjectLink: 'web',
      nextChoices: ['workStyle', 'contact'],
    },
    mobileApp: {
      id: 'mobileApp',
      text: 'モバイルアプリ開発経験は？',
      response:
        'モバイルアプリ開発経験としては、React Nativeを使用したフロントエンド開発で様々なプロジェクトに参加した経験があります。',
      goToProjectLink: 'mobile',
      nextChoices: ['workStyle', 'contact'],
    },
    desktopApp: {
      id: 'desktopApp',
      text: 'デスクトップアプリ開発経験は？',
      response:
        'デスクトップアプリ開発経験としては、Electron + Reactを使用したプロジェクト経験があります。下記のリンクでご確認いただけます。',
      goToProjectLink: 'desktop',
      nextChoices: ['workStyle', 'contact'],
    },
    backend: {
      id: 'backend',
      text: 'バックエンド技術は？',
      response:
        'Node.jsとGoを使用しています。Express、NestJS、Fiberなどのフレームワーク経験があり、RESTful API設計とマイクロサービスアーキテクチャに興味があります。',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    database: {
      id: 'database',
      text: 'データベース経験は？',
      response:
        'リレーショナルデータベース（MySQL、MariaDB）とNoSQL（MongoDB）の経験があります。データモデリングと最適化に興味があります。',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    cloud: {
      id: 'cloud',
      text: 'クラウド経験は？',
      response:
        'AWSクラウドプラットフォーム（EC2、S3、Route53、CloudFront）にサービスをデプロイした経験があります。',
      nextChoices: ['skills', 'experience', 'contact'],
    },
    projectTypes: {
      id: 'projectTypes',
      text: 'プロジェクトタイプ別に見せて',
      response:
        'B2Bサービス、印刷見積もりプラットフォーム、配送管理アプリ、多言語ウェブサイトなどを主に開発しています。各プロジェクトごとにクライアントの要件を正確に把握し、最適なソリューションを提供することに集中しています。',
      nextChoices: ['experience', 'contact'],
    },
    collaboration: {
      id: 'collaboration',
      text: '協力方式は？',
      response:
        'デザイナー、バックエンド開発者との協力経験が豊富で、リモートワーク環境でも積極的なコミュニケーションを通じてプロジェクトを進めています。',
      nextChoices: ['experience', 'contact'],
    },
    workflow: {
      id: 'workflow',
      text: '開発ワークフローは？',
      response:
        '企画段階から積極的に参加し、Gitを活用したバージョン管理、コードレビュー、CI/CDパイプライン構築などを通じて体系的な開発プロセスを運営しています。',
      nextChoices: ['experience', 'contact'],
    },
    languages: {
      id: 'languages',
      text: '言語能力は？',
      response:
        '韓国語が母国語で、ビジネスコミュニケーションのための日本語に堪能です。英語は基礎から勉強中で、簡単なコミュニケーションは可能ですが、さらに向上させるために努力しています。',
      nextChoices: ['korean', 'japanese', 'english'],
    },
    korean: {
      id: 'korean',
      text: '韓国語能力は？',
      response:
        '韓国語が母国語なので自然に使用できます。技術文書作成とコミュニケーションに問題はありません。',
      nextChoices: ['languages', 'contact'],
    },
    japanese: {
      id: 'japanese',
      text: '日本語能力は？',
      response:
        'ビジネスコミュニケーションのための日本語に堪能で、日本のクライアントとの協力経験があります。',
      nextChoices: ['languages', 'contact'],
    },
    english: {
      id: 'english',
      text: '英語能力は？',
      response:
        '基礎から勉強中で、簡単なコミュニケーションは可能ですが、さらに向上させるために努力しています。',
      nextChoices: ['languages', 'contact'],
    },
    workStyle: {
      id: 'workStyle',
      text: '働き方は？',
      response:
        '企画段階から積極的に参加し、明確なコミュニケーションを通じて協力します。スケジュール遵守に責任感を持ち、素早くフィードバックを反映し柔軟に対応します。',
      nextChoices: ['communication', 'environment', 'contact'],
    },
    communication: {
      id: 'communication',
      text: 'コミュニケーションスタイルは？',
      response:
        '明確で簡潔な説明を好み、技術的内容を非開発者も理解できるように説明することを得意としています。',
      nextChoices: ['workStyle', 'contact'],
    },
    learning: {
      id: 'learning',
      text: '学習方法は？',
      response:
        'オンライン講座、技術文書、オープンソースプロジェクト参加、技術ブログ執筆などを通じて継続的に学習しています。',
      nextChoices: ['workStyle', 'contact'],
    },
    environment: {
      id: 'environment',
      text: '業務環境の好みは？',
      response:
        '可能であればリモートワークを好みます。オフィスワークも可能ですが、柔軟な勤務時間を重要視しています。',
      nextChoices: ['workStyle', 'contact'],
    },
    strengths: {
      id: 'strengths',
      text: '強みは？',
      response:
        '問題を素早く把握し解決する能力が強みです。コンポーネント単位設計、パフォーマンス最適化、ユーザー中心のUI実装に強く、様々な環境でのクロスブラウジングとモバイル対応も得意としています。',
      nextChoices: ['techStack', 'teamwork', 'problemSolving', 'contact'],
    },
    techStack: {
      id: 'techStack',
      text: '技術スタックは？',
      response:
        'フロントエンド: TypeScript, React, Next.js, React Native, Electron / バックエンド: Node.js, Go（個人プロジェクト経験） / データベース: MongoDB, MySQL, MariaDB / クラウド: AWS（EC2, S3, Route53, CloudFront）',
      nextChoices: ['strengths', 'problemSolving', 'contact'],
    },
    teamwork: {
      id: 'teamwork',
      text: 'チームワークはどうしてる？',
      response:
        'リモートワーク環境でも積極的なコミュニケーションを通じてチームメンバーと協力し、コードレビューと知識共有を重要視しています。',
      nextChoices: ['strengths', 'contact'],
    },
    problemSolving: {
      id: 'problemSolving',
      text: '問題解決能力は？',
      response:
        '体系的なアプローチで問題を分析し、様々な解決策を提示し、最適なソリューションを見つけ出すことを好みます。',
      nextChoices: ['strengths', 'contact'],
    },
    interests: {
      id: 'interests',
      text: '興味のある分野は？',
      response:
        'ユーザーエクスペリエンスを考慮したフロントエンド開発に興味が深く、Web3、チャットボット、インタラクティブなUI/UX、グローバル多言語サービス構築にも情熱を持っています。',
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
      text: '改善している部分は？',
      response:
        'フロントエンド開発分野でより速く効率的な開発のために努力しています。',
      nextChoices: ['interests', 'contact'],
    },
    goals: {
      id: 'goals',
      text: '目標は？',
      response:
        '常に新しい技術と挑戦を通じてユーザーエクスペリエンスを改善し、チームと共に成長するフロントエンド開発者になることが目標です。',
      nextChoices: ['interests', 'contact'],
    },
    currentStudy: {
      id: 'currentStudy',
      text: '現在勉強中の技術は？',
      response:
        'フロントエンド開発分野とバックエンド開発分野を勉強しています。',
      nextChoices: ['interests', 'contact'],
    },
    futurePlans: {
      id: 'futurePlans',
      text: '将来の計画は？',
      response:
        'フロントエンド開発者からフルスタック開発者になることを目標とし、新しい技術を導入してユーザーに価値のあるサービスを提供することが計画です。',
      nextChoices: ['interests', 'contact'],
    },
    newChallenges: {
      id: 'newChallenges',
      text: '新しい挑戦についてどう思う？',
      response:
        '新しい技術とドメインへの挑戦を恐れず、学習曲線を楽しんでいます。',
      nextChoices: ['interests', 'contact'],
    },
    contact: {
      id: 'contact',
      text: '連絡先は？',
      response: '連絡したい場合は、下記のボタンをクリックしてください。',
      contactButtons: [
        {
          text: 'メールで連絡',
          action: 'email',
          url: 'mailto:joonhokim.dev@gmail.com',
        },
        {
          text: 'LinkedInで連絡',
          action: 'linkedin',
          url: 'https://www.linkedin.com/in/joonhokim0506',
        },
      ],
      nextChoices: ['skills'],
    },
  },
};
