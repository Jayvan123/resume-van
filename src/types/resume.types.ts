/**
 * ResumeVan - Core Type Definitions
 */

export interface PersonalInfo {
  fullName: string;
  titles: string[];
  email: string;
  phone: string;
  location: string;
  links?: string[];
  summary: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  dates: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
}

export type TabId = 'personal' | 'experience' | 'education' | 'skills' | 'certifications';

export interface TabConfig {
  id: TabId;
  label: string;
}
