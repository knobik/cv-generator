export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photo?: string; // Base64 encoded image
}

export interface ProfessionalSummary {
  summary: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string | null; // null for current position
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export type ProficiencyLevel = 'Native' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export interface Language {
  id: string;
  language: string;
  proficiency: ProficiencyLevel;
}

export interface GDPRClause {
  text: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  gdprClause: GDPRClause;
  metadata: {
    lastUpdated: string;
    version: string;
    locale: string;
  };
}

export const EMPTY_CV_DATA: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  professionalSummary: {
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  gdprClause: {
    text: 'I hereby give consent for my personal data included in my application to be processed for the purposes of the recruitment process under the European Parliament and Council of the European Union Regulation on the protection of natural persons as of 27 April 2016, with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (Data Protection Directive).',
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    locale: 'en',
  },
};
