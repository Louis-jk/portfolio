import { create } from 'zustand';

type StoryFabState = {
  fabVisible: boolean;
  setFabVisible: (fabVisible: boolean) => void;
  resetFabVisible: () => void;
};

export const useStoryFabStore = create<StoryFabState>((set) => ({
  fabVisible: true,
  setFabVisible: (fabVisible) => set({ fabVisible }),
  resetFabVisible: () => set({ fabVisible: true }),
}));
