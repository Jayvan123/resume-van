import { z } from 'zod';

export const personalSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  titles: z.array(z.string()).optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  links: z.array(z.string()).optional(),
  summary: z.string().min(20, 'Summary should be at least 20 characters'),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job role is required'),
  dates: z.string().min(1, 'Employment dates are required'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
});

export const educationSchema = z.object({
  school: z.string().min(1, 'School name is required'),
  degree: z.string().min(1, 'Degree is required'),
  dates: z.string().min(1, 'Education dates are required'),
});

/**
 * Shape used for the AI Assist feature's structured output (api/ai-assist.ts).
 * Mirrors the field names/types of ResumeData (src/types/resume.types.ts) —
 * minus auto-generated `id`s (the store assigns those via addExperience/
 * addEducation) and minus hardSkills/softSkills/skillMode, which the live
 * preview and PDF export never read (see ResumeBuilder.tsx / lib/pdf/generate.ts).
 *
 * Deliberately more lenient than personalSchema/experienceSchema/
 * educationSchema above: those enforce UX rules for the manual-entry forms
 * (required fields, email format, minimum lengths). The AI must be free to
 * omit anything the user's freeform text didn't mention rather than being
 * forced to invent a value just to satisfy validation.
 */
export const aiExtractionSchema = z.object({
  personal: z.object({
    fullName: z.string().optional(),
    titles: z.array(z.string()).optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z.array(z.string()).optional(),
    summary: z.string().optional(),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      dates: z.string(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      dates: z.string(),
    })
  ),
  skills: z.array(z.string()),
  certifications: z.array(z.string()),
});

export type AiExtraction = z.infer<typeof aiExtractionSchema>;
