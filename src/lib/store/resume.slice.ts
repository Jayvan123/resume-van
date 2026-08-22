import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, TabId, ResumeDraft, SkillMode } from '@/types/resume.types';
import { sampleResume } from '@/constants/sampleData';

const initialState: ResumeData = {
  personal: { fullName: '', titles: [], email: '', phone: '', location: '', links: [], summary: '' },
  experience: [],
  education: [],
  skills: [],
  hardSkills: [],
  softSkills: [],
  skillMode: 'combined',
  certifications: [],
};

const updateActiveDraft = (state: any) => {
  if (state.activeDraftId) {
    const draft = state.drafts.find((d: any) => d.id === state.activeDraftId);
    if (draft) {
      draft.data = JSON.parse(JSON.stringify(state.data));
      draft.selectedFont = state.selectedFont;
      draft.updatedAt = new Date().toISOString();
    }
  }
};

interface ResumeStore {
  // Data
  data: ResumeData;
  drafts: ResumeDraft[];
  activeDraftId: string | null;
  // UI state
  activeTab: TabId;
  selectedFont: string;
  isDownloading: boolean;

  // Personal actions
  updatePersonal: (field: keyof PersonalInfo, value: any) => void;
  setPersonal: (data: Partial<PersonalInfo>) => void;
  addTitle: (title: string) => void;
  updateTitle: (index: number, title: string) => void;
  removeTitle: (index: number) => void;
  addLink: (link: string) => void;
  updateLink: (index: number, link: string) => void;
  removeLink: (index: number) => void;

  // Experience actions
  addExperience: (experience: Omit<ExperienceEntry, 'id'>) => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;

  // Education actions
  addEducation: (education: Omit<EducationEntry, 'id'>) => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  // Skill actions (combined)
  addSkill: (skill: string) => void;
  updateSkill: (index: number, skill: string) => void;
  removeSkill: (index: number) => void;

  // Skill mode
  setSkillMode: (mode: SkillMode) => void;

  // Hard skill actions
  addHardSkill: (skill: string) => void;
  removeHardSkill: (index: number) => void;

  // Soft skill actions
  addSoftSkill: (skill: string) => void;
  removeSoftSkill: (index: number) => void;

  // Certification actions
  addCertification: (cert: string) => void;
  updateCertification: (index: number, cert: string) => void;
  removeCertification: (index: number) => void;
  reorderCertification: (fromIndex: number, toIndex: number) => void;

  // Draft actions
  saveDraft: (name: string) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  renameDraft: (id: string, name: string) => void;
  closeActiveDraft: () => void;

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
        drafts: [],
        activeDraftId: null,
        activeTab: 'personal',
        selectedFont: 'Poppins',
        isDownloading: false,

        updatePersonal: (field, value) =>
          set((state) => {
            state.data.personal[field] = value;
            updateActiveDraft(state);
          }),

        setPersonal: (data) =>
          set((state) => {
            Object.assign(state.data.personal, data);
            updateActiveDraft(state);
          }),

        addTitle: (title) =>
          set((state) => {
            const trimmed = title.trim();
            if (trimmed && !state.data.personal.titles.includes(trimmed)) {
              state.data.personal.titles.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        updateTitle: (index, title) =>
          set((state) => {
            const trimmed = title.trim();
            if (trimmed) {
              state.data.personal.titles[index] = trimmed;
            } else {
              state.data.personal.titles.splice(index, 1);
            }
            updateActiveDraft(state);
          }),

        removeTitle: (index) =>
          set((state) => {
            state.data.personal.titles.splice(index, 1);
            updateActiveDraft(state);
          }),

        addLink: (link) =>
          set((state) => {
            const trimmed = link.trim();
            if (!state.data.personal.links) {
              state.data.personal.links = [];
            }
            if (trimmed && !state.data.personal.links.includes(trimmed)) {
              state.data.personal.links.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        updateLink: (index, link) =>
          set((state) => {
            const trimmed = link.trim();
            if (state.data.personal.links) {
              if (trimmed) {
                state.data.personal.links[index] = trimmed;
              } else {
                state.data.personal.links.splice(index, 1);
              }
              updateActiveDraft(state);
            }
          }),

        removeLink: (index) =>
          set((state) => {
            if (state.data.personal.links) {
              state.data.personal.links.splice(index, 1);
              updateActiveDraft(state);
            }
          }),

        addExperience: (experience) =>
          set((state) => {
            state.data.experience.push({
              ...experience,
              id: crypto.randomUUID(),
            });
            updateActiveDraft(state);
          }),

        updateExperience: (id, data) =>
          set((state) => {
            const exp = state.data.experience.find((e) => e.id === id);
            if (exp) {
              Object.assign(exp, data);
              updateActiveDraft(state);
            }
          }),

        removeExperience: (id) =>
          set((state) => {
            state.data.experience = state.data.experience.filter((e) => e.id !== id);
            updateActiveDraft(state);
          }),

        reorderExperience: (fromIndex, toIndex) =>
          set((state) => {
            const items = state.data.experience;
            const [moved] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, moved);
            updateActiveDraft(state);
          }),

        addEducation: (education) =>
          set((state) => {
            state.data.education.push({
              ...education,
              id: crypto.randomUUID(),
            });
            updateActiveDraft(state);
          }),

        updateEducation: (id, data) =>
          set((state) => {
            const edu = state.data.education.find((e) => e.id === id);
            if (edu) {
              Object.assign(edu, data);
              updateActiveDraft(state);
            }
          }),

        removeEducation: (id) =>
          set((state) => {
            state.data.education = state.data.education.filter((e) => e.id !== id);
            updateActiveDraft(state);
          }),

        reorderEducation: (fromIndex, toIndex) =>
          set((state) => {
            const items = state.data.education;
            const [moved] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, moved);
            updateActiveDraft(state);
          }),

        addSkill: (skill) =>
          set((state) => {
            const trimmed = skill.trim();
            if (trimmed && !state.data.skills.includes(trimmed)) {
              state.data.skills.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        updateSkill: (index, skill) =>
          set((state) => {
            const trimmed = skill.trim();
            if (trimmed) {
              state.data.skills[index] = trimmed;
            } else {
              state.data.skills.splice(index, 1);
            }
            updateActiveDraft(state);
          }),

        removeSkill: (index) =>
          set((state) => {
            state.data.skills.splice(index, 1);
            updateActiveDraft(state);
          }),

        setSkillMode: (mode) =>
          set((state) => {
            state.data.skillMode = mode;
            updateActiveDraft(state);
          }),

        addHardSkill: (skill) =>
          set((state) => {
            const trimmed = skill.trim();
            if (!state.data.hardSkills) state.data.hardSkills = [];
            if (trimmed && !state.data.hardSkills.includes(trimmed)) {
              state.data.hardSkills.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        removeHardSkill: (index) =>
          set((state) => {
            if (state.data.hardSkills) {
              state.data.hardSkills.splice(index, 1);
              updateActiveDraft(state);
            }
          }),

        addSoftSkill: (skill) =>
          set((state) => {
            const trimmed = skill.trim();
            if (!state.data.softSkills) state.data.softSkills = [];
            if (trimmed && !state.data.softSkills.includes(trimmed)) {
              state.data.softSkills.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        removeSoftSkill: (index) =>
          set((state) => {
            if (state.data.softSkills) {
              state.data.softSkills.splice(index, 1);
              updateActiveDraft(state);
            }
          }),

        addCertification: (cert) =>
          set((state) => {
            const trimmed = cert.trim();
            if (trimmed && !state.data.certifications.includes(trimmed)) {
              state.data.certifications.push(trimmed);
              updateActiveDraft(state);
            }
          }),

        updateCertification: (index, cert) =>
          set((state) => {
            const trimmed = cert.trim();
            if (trimmed) {
              state.data.certifications[index] = trimmed;
            } else {
              state.data.certifications.splice(index, 1);
            }
            updateActiveDraft(state);
          }),

        removeCertification: (index) =>
          set((state) => {
            state.data.certifications.splice(index, 1);
            updateActiveDraft(state);
          }),

        reorderCertification: (fromIndex, toIndex) =>
          set((state) => {
            const items = state.data.certifications;
            const [moved] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, moved);
            updateActiveDraft(state);
          }),

        saveDraft: (name) =>
          set((state) => {
            if (state.drafts.length >= 5) return;
            const draftId = crypto.randomUUID();
            let draftName = name.trim();
            
            if (!draftName) {
              let baseName = '';
              const activeDraft = state.drafts.find((d: any) => d.id === state.activeDraftId);
              
              if (activeDraft) {
                baseName = `${activeDraft.name} (Copy)`;
              } else if (state.data.personal.fullName && state.data.personal.fullName.trim()) {
                baseName = `${state.data.personal.fullName.trim()} Resume`;
              } else {
                baseName = 'Draft';
              }
              
              draftName = baseName;
              if (state.drafts.some((d: any) => d.name.toLowerCase() === draftName.toLowerCase())) {
                let idx = 2;
                const template = baseName === 'Draft' ? 'Draft {}' : `${baseName} {}`;
                let proposedName = template.replace('{}', String(idx));
                while (state.drafts.some((d: any) => d.name.toLowerCase() === proposedName.toLowerCase())) {
                  idx++;
                  proposedName = template.replace('{}', String(idx));
                }
                draftName = proposedName;
              } else if (baseName === 'Draft') {
                draftName = 'Draft 1';
              }
            } else {
              let baseName = draftName;
              if (state.drafts.some((d: any) => d.name.toLowerCase() === baseName.toLowerCase())) {
                let idx = 2;
                let proposedName = `${baseName} ${idx}`;
                while (state.drafts.some((d: any) => d.name.toLowerCase() === proposedName.toLowerCase())) {
                  idx++;
                  proposedName = `${baseName} ${idx}`;
                }
                draftName = proposedName;
              }
            }

            const newDraft: ResumeDraft = {
              id: draftId,
              name: draftName,
              data: JSON.parse(JSON.stringify(state.data)),
              selectedFont: state.selectedFont,
              updatedAt: new Date().toISOString(),
            };
            state.drafts.push(newDraft);
            state.activeDraftId = draftId;
          }),

        loadDraft: (id) =>
          set((state) => {
            const draft = state.drafts.find((d) => d.id === id);
            if (draft) {
              state.data = JSON.parse(JSON.stringify(draft.data));
              state.selectedFont = draft.selectedFont;
              state.activeDraftId = id;
            }
          }),

        deleteDraft: (id) =>
          set((state) => {
            state.drafts = state.drafts.filter((d) => d.id !== id);
            if (state.activeDraftId === id) {
              state.activeDraftId = null;
            }
          }),

        renameDraft: (id, name) =>
          set((state) => {
            const draft = state.drafts.find((d) => d.id === id);
            if (draft) {
              draft.name = name.trim() || 'Untitled Draft';
              draft.updatedAt = new Date().toISOString();
            }
          }),

        closeActiveDraft: () =>
          set((state) => {
            state.activeDraftId = null;
          }),

        resetAll: () =>
          set((state) => {
            state.data = initialState;
            state.activeDraftId = null;
          }),

        loadSampleData: () =>
          set((state) => {
            state.data = sampleResume;
            state.activeDraftId = null;
          }),

        setActiveTab: (tab) =>
          set((state) => {
            state.activeTab = tab;
          }),

        setFontStyle: (font) =>
          set((state) => {
            state.selectedFont = font;
            updateActiveDraft(state);
          }),

        setIsDownloading: (value) =>
          set((state) => {
            state.isDownloading = value;
          }),
      }),
      {
        name: 'resume-van-storage',
        version: 2,
        // Persist workspace data, active draft, drafts list, and selected font
        partialize: (state) => ({
          data: state.data,
          selectedFont: state.selectedFont,
          drafts: state.drafts,
          activeDraftId: state.activeDraftId,
        }),
        // Migrate old persisted state missing new skill fields
        migrate: (persistedState: any, version: number) => {
          if (version < 2) {
            if (persistedState?.data) {
              persistedState.data.hardSkills = persistedState.data.hardSkills ?? [];
              persistedState.data.softSkills = persistedState.data.softSkills ?? [];
              persistedState.data.skillMode = persistedState.data.skillMode ?? 'combined';
            }
            if (persistedState?.drafts) {
              persistedState.drafts = persistedState.drafts.map((d: any) => ({
                ...d,
                data: {
                  ...d.data,
                  hardSkills: d.data?.hardSkills ?? [],
                  softSkills: d.data?.softSkills ?? [],
                  skillMode: d.data?.skillMode ?? 'combined',
                },
              }));
            }
          }
          return persistedState;
        },
      }
    )
  )
);
