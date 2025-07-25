import { useReducer, useCallback } from 'react';

// 상태 타입 정의
interface IntroState {
  isHovered: boolean;
  messageIndex: number;
  showGreeting: boolean;
  isGreetingVisible: boolean;
  messages: string[];
  bubbleStyle: React.CSSProperties;
}

// 액션 타입 정의
type IntroAction =
  | { type: 'SET_HOVERED'; payload: boolean }
  | { type: 'SET_MESSAGE_INDEX'; payload: number }
  | { type: 'SET_SHOW_GREETING'; payload: boolean }
  | { type: 'SET_GREETING_VISIBLE'; payload: boolean }
  | { type: 'SET_MESSAGES'; payload: string[] }
  | { type: 'SET_BUBBLE_STYLE'; payload: React.CSSProperties }
  | { type: 'RESET_GREETING' }
  | { type: 'SET_RANDOM_MESSAGE' };

// 초기 상태
const initialState: IntroState = {
  isHovered: false,
  messageIndex: 1, // 0이 아닌 1로 시작 (첫 번째 랜덤 메시지)
  showGreeting: false,
  isGreetingVisible: false,
  messages: [],
  bubbleStyle: {},
};

// Reducer 함수
function introReducer(state: IntroState, action: IntroAction): IntroState {
  switch (action.type) {
    case 'SET_HOVERED':
      return { ...state, isHovered: action.payload };
    case 'SET_MESSAGE_INDEX':
      return { ...state, messageIndex: action.payload };
    case 'SET_SHOW_GREETING':
      return { ...state, showGreeting: action.payload };
    case 'SET_GREETING_VISIBLE':
      return { ...state, isGreetingVisible: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_BUBBLE_STYLE':
      return { ...state, bubbleStyle: action.payload };
    case 'RESET_GREETING':
      return {
        ...state,
        showGreeting: false,
        isGreetingVisible: false,
        isHovered: false,
      };
    case 'SET_RANDOM_MESSAGE':
      // 이전 인덱스와 다른 랜덤 인덱스 선택
      let randomIndex;
      do {
        randomIndex =
          Math.floor(Math.random() * (state.messages.length - 1)) + 1;
      } while (randomIndex === state.messageIndex && state.messages.length > 2);

      return {
        ...state,
        messageIndex: randomIndex,
        isHovered: true,
      };
    default:
      return state;
  }
}

export function useIntroState() {
  const [state, dispatch] = useReducer(introReducer, initialState);

  // 액션 생성자들 (Action Creators) - useCallback으로 메모이제이션
  const actions = {
    setIsHovered: useCallback(
      (isHovered: boolean) =>
        dispatch({ type: 'SET_HOVERED', payload: isHovered }),
      []
    ),

    setMessageIndex: useCallback(
      (index: number) =>
        dispatch({ type: 'SET_MESSAGE_INDEX', payload: index }),
      []
    ),

    setShowGreeting: useCallback(
      (show: boolean) => dispatch({ type: 'SET_SHOW_GREETING', payload: show }),
      []
    ),

    setIsGreetingVisible: useCallback(
      (visible: boolean) =>
        dispatch({ type: 'SET_GREETING_VISIBLE', payload: visible }),
      []
    ),

    setMessages: useCallback(
      (messages: string[]) =>
        dispatch({ type: 'SET_MESSAGES', payload: messages }),
      []
    ),

    setBubbleStyle: useCallback(
      (style: React.CSSProperties) =>
        dispatch({ type: 'SET_BUBBLE_STYLE', payload: style }),
      []
    ),

    resetGreeting: useCallback(() => dispatch({ type: 'RESET_GREETING' }), []),

    setRandomMessage: useCallback(
      () => dispatch({ type: 'SET_RANDOM_MESSAGE' }),
      []
    ),
  };

  return {
    // 상태
    ...state,
    // 액션
    ...actions,
  };
}
