import { create } from 'zustand';

type StoryFabState = {
  /** Story or project drawer controls bottom FAB visibility on mobile. */
  overlayFabSyncEnabled: boolean;
  fabVisible: boolean;
  setOverlayFabSyncEnabled: (enabled: boolean) => void;
  setFabVisible: (fabVisible: boolean) => void;
  resetFabVisible: () => void;
  resetOverlayFabSync: () => void;
};

export const useStoryFabStore = create<StoryFabState>((set) => ({
  overlayFabSyncEnabled: false,
  fabVisible: true,
  setOverlayFabSyncEnabled: (overlayFabSyncEnabled) =>
    set({ overlayFabSyncEnabled }),
  setFabVisible: (fabVisible) => set({ fabVisible }),
  resetFabVisible: () => set({ fabVisible: true }),
  resetOverlayFabSync: () =>
    set({ fabVisible: true, overlayFabSyncEnabled: false }),
}));
