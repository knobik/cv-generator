import { z } from 'zod';

// Helper validators
const optionalUrl = z.string().url().optional().or(z.literal(''));
const optionalString = z.string().optional();

export const personalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().refine((val) => val === '' || z.string().email().safeParse(val).success, {
    message: 'Invalid email address',
  }),
  phone: z.string(),
  location: z.string(),
  website: optionalUrl,
  linkedin: optionalUrl,
  github: optionalUrl,
  photo: optionalString,
});

export const professionalSummarySchema = z.object({
  summary: z.string(),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  current: z.boolean(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  current: z.boolean(),
  gpa: optionalString,
  description: optionalString,
});

export const skillCategorySchema = z.object({
  id: z.string(),
  categoryName: z.string().min(1, 'Category name is required'),
  skills: z.array(z.string()),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string(),
  technologies: z.array(z.string()),
  url: optionalUrl,
  githubUrl: optionalUrl,
  startDate: optionalString,
  endDate: optionalString,
  highlights: z.array(z.string()),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  expiryDate: optionalString,
  credentialId: optionalString,
  credentialUrl: optionalUrl,
});

export const languageSchema = z.object({
  id: z.string(),
  language: z.string().min(1, 'Language is required'),
  proficiency: z.enum([
    'Native',
    'C2',
    'C2+',
    'C1',
    'C1+',
    'B2',
    'B2+',
    'B1',
    'B1+',
    'A2',
    'A2+',
    'A1',
    'A1+',
  ]),
});

export const gdprClauseSchema = z.object({
  text: z.string(),
});

export const interestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Interest is required'),
});

export const settingsSchema = z.object({
  fontSize: z.number().min(8).max(24),
});

export const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalSummary: professionalSummarySchema,
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillCategorySchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  interests: z.array(interestSchema).optional(),
  gdprClause: gdprClauseSchema.optional(),
  settings: settingsSchema.optional(),
  metadata: z.object({
    lastUpdated: z.string(),
    version: z.string(),
    locale: z.string().optional(),
  }),
});

// Validation helper functions
export function validatePersonalInfo(data: unknown) {
  return personalInfoSchema.safeParse(data);
}

export function validateCVData(data: unknown) {
  return cvDataSchema.safeParse(data);
}

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validateUrl(url: string): boolean {
  if (!url) return true; // Empty URLs are valid (optional)
  return z.string().url().safeParse(url).success;
}
