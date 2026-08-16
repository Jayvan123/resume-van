import { StateCreator } from 'zustand';

export interface UISlice {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const createUISlice: StateCreator<
  UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  activeTab: 'personal',
  setActiveTab: (tab) => set({ activeTab: tab })
});
