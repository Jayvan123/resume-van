import { z } from 'zod';

export const personalSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  title: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
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
