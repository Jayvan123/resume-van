import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, TabId } from '@/types/resume.types';
import { sampleResume } from '@/constants/sampleData';

const initialState: ResumeData = {
  personal: { fullName: '', title: '', email: '', phone: '', location: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

interface ResumeStore {
  // Data
  data: ResumeData;
  // UI state
  activeTab: TabId;
  selectedFont: string;
  isDownloading: boolean;

  // Personal actions
  updatePersonal: (field: keyof PersonalInfo, value: string) => void;
  setPersonal: (data: Partial<PersonalInfo>) => void;

  // Experience actions
  addExperience: (experience: Omit<ExperienceEntry, 'id'>) => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;

  // Education actions
  addEducation: (education: Omit<EducationEntry, 'id'>) => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;

  // Skill actions
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;

  // Certification actions
  addCertification: (cert: string) => void;
  removeCertification: (index: number) => void;

  // Global actions
  resetAll: () => void;
  loadSampleData: () => void;
  setActiveTab: (tab: TabId) => void;
  setFontStyle: (font: string) => void;
  setIsDownloading: (value: boolean) => void;
}

export const useResumeStore = create<ResumeStore>()(
  immer(
    persist(
      (set) => ({
        data: initialState,
        activeTab: 'personal',
        selectedFont: 'Poppins',
        isDownloading: false,

        updatePersonal: (field, value) =>
          set((state) => {
            state.data.personal[field] = value;
          }),

        setPersonal: (data) =>
          set((state) => {
            Object.assign(state.data.personal, data);
          }),

        addExperience: (experience) =>
          set((state) => {
            state.data.experience.push({
              ...experience,
              id: crypto.randomUUID(),
            });
          }),

        updateExperience: (id, data) =>
          set((state) => {
            const exp = state.data.experience.find((e) => e.id === id);
            if (exp) Object.assign(exp, data);
          }),

        removeExperience: (id) =>
          set((state) => {
            state.data.experience = state.data.experience.filter((e) => e.id !== id);
          }),

        addEducation: (education) =>
          set((state) => {
            state.data.education.push({
              ...education,
              id: crypto.randomUUID(),
            });
          }),

        updateEducation: (id, data) =>
          set((state) => {
            const edu = state.data.education.find((e) => e.id === id);
            if (edu) Object.assign(edu, data);
          }),

        removeEducation: (id) =>
          set((state) => {
            state.data.education = state.data.education.filter((e) => e.id !== id);
          }),

        addSkill: (skill) =>
          set((state) => {
            const trimmed = skill.trim();
            if (trimmed && !state.data.skills.includes(trimmed)) {
              state.data.skills.push(trimmed);
            }
          }),

        removeSkill: (index) =>
          set((state) => {
            state.data.skills.splice(index, 1);
          }),

        addCertification: (cert) =>
          set((state) => {
            const trimmed = cert.trim();
            if (trimmed && !state.data.certifications.includes(trimmed)) {
              state.data.certifications.push(trimmed);
            }
          }),

        removeCertification: (index) =>
          set((state) => {
            state.data.certifications.splice(index, 1);
          }),

        resetAll: () =>
          set((state) => {
            state.data = initialState;
          }),

        loadSampleData: () =>
          set((state) => {
            state.data = sampleResume;
          }),

        setActiveTab: (tab) =>
          set((state) => {
            state.activeTab = tab;
          }),

        setFontStyle: (font) =>
          set((state) => {
            state.selectedFont = font;
          }),

        setIsDownloading: (value) =>
          set((state) => {
            state.isDownloading = value;
          }),
      }),
      {
        name: 'resume-van-storage',
        version: 1,
        // Only persist data, not transient UI state
        partialize: (state) => ({ data: state.data, selectedFont: state.selectedFont }),
      }
    )
  )
);
