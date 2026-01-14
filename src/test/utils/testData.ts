import {
  CVData,
  PersonalInfo,
  ProfessionalSummary,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
  Language,
  GDPRClause,
} from '@/types/cv'

export const mockPersonalInfo: PersonalInfo = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-234-567-8900',
  location: 'New York, NY',
  website: 'https://johndoe.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  photo: '',
}

export const mockProfessionalSummary: ProfessionalSummary = {
  summary: 'Experienced software engineer with 5+ years in full-stack development.',
}

export const mockWorkExperience: WorkExperience = {
  id: 'work-1',
  jobTitle: 'Senior Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  startDate: '2020-01',
  endDate: null,
  current: true,
  description: 'Full-stack development',
  achievements: ['Led team of 5 developers', 'Improved performance by 40%'],
}

export const mockEducation: Education = {
  id: 'edu-1',
  degree: 'Bachelor of Science in Computer Science',
  institution: 'University of California',
  location: 'Berkeley, CA',
  startDate: '2012-09',
  endDate: '2016-05',
  current: false,
  gpa: '3.8',
  description: 'Cum Laude, Dean\'s List',
}

export const mockSkillCategory: SkillCategory = {
  id: 'skill-1',
  categoryName: 'Programming Languages',
  skills: ['JavaScript', 'TypeScript', 'Python'],
}

export const mockProject: Project = {
  id: 'project-1',
  name: 'E-Commerce Platform',
  url: 'https://github.com/johndoe/ecommerce',
  description: 'Full-stack e-commerce application',
  technologies: ['React', 'Node.js', 'MongoDB'],
  highlights: ['Processed 10k+ transactions', 'Integrated payment gateway'],
}

export const mockCertification: Certification = {
  id: 'cert-1',
  name: 'AWS Certified Solutions Architect',
  issuer: 'Amazon Web Services',
  date: '2021-03',
  credentialUrl: 'https://aws.amazon.com/verification/cert123',
}

export const mockLanguage: Language = {
  id: 'lang-1',
  language: 'English',
  proficiency: 'Native',
}

export const mockGDPRClause: GDPRClause = {
  text: 'I hereby give consent for my personal data included in my application to be processed for the purposes of the recruitment process under the European Parliament and Council of the European Union Regulation on the protection of natural persons as of 27 April 2016, with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (Data Protection Directive).',
}

export const mockCVData: CVData = {
  personalInfo: mockPersonalInfo,
  professionalSummary: mockProfessionalSummary,
  workExperience: [mockWorkExperience],
  education: [mockEducation],
  skills: [mockSkillCategory],
  projects: [mockProject],
  certifications: [mockCertification],
  languages: [mockLanguage],
  interests: [],
  gdprClause: mockGDPRClause,
  metadata: {
    lastUpdated: '2026-01-11T00:00:00.000Z',
    version: '1.0.0',
    locale: 'en',
  },
}
