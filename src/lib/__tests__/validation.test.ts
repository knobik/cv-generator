import { describe, expect, test } from 'vitest'
import {
  personalInfoSchema,
  professionalSummarySchema,
  workExperienceSchema,
  educationSchema,
  skillCategorySchema,
  projectSchema,
  certificationSchema,
  languageSchema,
  cvDataSchema,
  validatePersonalInfo,
  validateCVData,
  validateEmail,
  validateUrl,
} from '../validation'

describe('Validation Layer', () => {
  describe('validateEmail', () => {
    test('should accept valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.user@domain.co.uk')).toBe(true)
      expect(validateEmail('name+tag@company.org')).toBe(true)
    })

    test('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('missing@domain')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user @domain.com')).toBe(false)
    })
  })

  describe('validateUrl', () => {
    test('should accept valid HTTP URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true)
      expect(validateUrl('http://www.example.com')).toBe(true)
    })

    test('should accept valid HTTPS URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true)
      expect(validateUrl('https://www.example.com/path')).toBe(true)
      expect(validateUrl('https://subdomain.example.com')).toBe(true)
    })

    test('should accept empty string', () => {
      expect(validateUrl('')).toBe(true)
    })

    test('should reject malformed URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
      expect(validateUrl('example.com')).toBe(false)
      expect(validateUrl('www.example.com')).toBe(false)
    })
  })

  describe('personalInfoSchema', () => {
    test('should validate complete personal info', () => {
      const validData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
        website: 'https://johndoe.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        photo: 'base64string',
      }
      const result = personalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('should accept empty email', () => {
      const data = {
        fullName: 'John Doe',
        email: '',
        phone: '+1234567890',
        location: 'New York',
        website: '',
        linkedin: '',
        github: '',
      }
      const result = personalInfoSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should reject invalid email format', () => {
      const data = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        location: 'New York',
      }
      const result = personalInfoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept empty optional fields', () => {
      const data = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York',
        website: '',
        linkedin: '',
        github: '',
        photo: '',
      }
      const result = personalInfoSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should reject invalid URLs', () => {
      const data = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York',
        website: 'not-a-url',
      }
      const result = personalInfoSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('professionalSummarySchema', () => {
    test('should validate summary text', () => {
      const data = { summary: 'Experienced developer with 5+ years.' }
      const result = professionalSummarySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should accept empty summary', () => {
      const data = { summary: '' }
      const result = professionalSummarySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require summary field', () => {
      const data = {}
      const result = professionalSummarySchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('workExperienceSchema', () => {
    test('should validate complete work experience', () => {
      const data = {
        id: 'work-1',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: '2023-12',
        current: false,
        description: 'Built web applications',
        achievements: ['Improved performance by 40%'],
      }
      const result = workExperienceSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require jobTitle, company, location', () => {
      const data = {
        id: 'work-1',
        jobTitle: '',
        company: '',
        location: '',
        startDate: '2020-01',
        endDate: null,
        current: false,
        description: '',
        achievements: [],
      }
      const result = workExperienceSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept current position (endDate: null)', () => {
      const data = {
        id: 'work-1',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: null,
        current: true,
        description: '',
        achievements: [],
      }
      const result = workExperienceSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should validate achievements array', () => {
      const data = {
        id: 'work-1',
        jobTitle: 'Developer',
        company: 'Company',
        location: 'City',
        startDate: '2020-01',
        endDate: null,
        current: true,
        description: '',
        achievements: ['Achievement 1', 'Achievement 2'],
      }
      const result = workExperienceSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('educationSchema', () => {
    test('should validate complete education entry', () => {
      const data = {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        institution: 'University',
        location: 'Boston, MA',
        startDate: '2016-09',
        endDate: '2020-05',
        current: false,
        gpa: '3.8',
        description: 'Computer Science Major',
      }
      const result = educationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require degree, institution, location', () => {
      const data = {
        id: 'edu-1',
        degree: '',
        institution: '',
        location: '',
        startDate: '2016-09',
        endDate: null,
        current: false,
      }
      const result = educationSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept optional GPA and description', () => {
      const data = {
        id: 'edu-1',
        degree: 'Bachelor',
        institution: 'University',
        location: 'City',
        startDate: '2016-09',
        endDate: '2020-05',
        current: false,
        gpa: '',
        description: '',
      }
      const result = educationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should accept current education (endDate: null)', () => {
      const data = {
        id: 'edu-1',
        degree: 'Master of Science',
        institution: 'University',
        location: 'City',
        startDate: '2020-09',
        endDate: null,
        current: true,
      }
      const result = educationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('skillCategorySchema', () => {
    test('should validate skill category with skills', () => {
      const data = {
        id: 'skill-1',
        categoryName: 'Programming Languages',
        skills: ['JavaScript', 'Python', 'TypeScript'],
      }
      const result = skillCategorySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require category name', () => {
      const data = {
        id: 'skill-1',
        categoryName: '',
        skills: ['JavaScript'],
      }
      const result = skillCategorySchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept empty skills array', () => {
      const data = {
        id: 'skill-1',
        categoryName: 'Tools',
        skills: [],
      }
      const result = skillCategorySchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('projectSchema', () => {
    test('should validate complete project', () => {
      const data = {
        id: 'project-1',
        name: 'E-Commerce Platform',
        description: 'Full-stack application',
        technologies: ['React', 'Node.js'],
        url: 'https://example.com',
        githubUrl: 'https://github.com/user/repo',
        startDate: '2021-01',
        endDate: '2021-12',
        highlights: ['Built payment integration'],
      }
      const result = projectSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require name', () => {
      const data = {
        id: 'project-1',
        name: '',
        description: '',
        technologies: [],
        highlights: [],
      }
      const result = projectSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept empty optional URLs', () => {
      const data = {
        id: 'project-1',
        name: 'Project',
        description: '',
        technologies: [],
        url: '',
        githubUrl: '',
        highlights: [],
      }
      const result = projectSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should validate URL formats', () => {
      const data = {
        id: 'project-1',
        name: 'Project',
        description: '',
        technologies: [],
        url: 'not-a-url',
        highlights: [],
      }
      const result = projectSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('certificationSchema', () => {
    test('should validate complete certification', () => {
      const data = {
        id: 'cert-1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2021-03',
        expiryDate: '2024-03',
        credentialId: 'ABC123',
        credentialUrl: 'https://aws.amazon.com/verification',
      }
      const result = certificationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require name, issuer, date', () => {
      const data = {
        id: 'cert-1',
        name: '',
        issuer: '',
        date: '',
      }
      const result = certificationSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should accept optional expiry and credential fields', () => {
      const data = {
        id: 'cert-1',
        name: 'Certification',
        issuer: 'Organization',
        date: '2021-01',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
      }
      const result = certificationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should validate credential URL format', () => {
      const data = {
        id: 'cert-1',
        name: 'Cert',
        issuer: 'Issuer',
        date: '2021-01',
        credentialUrl: 'invalid-url',
      }
      const result = certificationSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('languageSchema', () => {
    test('should validate language with proficiency', () => {
      const data = {
        id: 'lang-1',
        language: 'English',
        proficiency: 'Native',
      }
      const result = languageSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require language name', () => {
      const data = {
        id: 'lang-1',
        language: '',
        proficiency: 'Native',
      }
      const result = languageSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should validate proficiency enum values', () => {
      const proficiencies = ['Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1']
      proficiencies.forEach((proficiency) => {
        const data = {
          id: 'lang-1',
          language: 'English',
          proficiency,
        }
        const result = languageSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    test('should reject invalid proficiency levels', () => {
      const data = {
        id: 'lang-1',
        language: 'English',
        proficiency: 'Expert',
      }
      const result = languageSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('cvDataSchema', () => {
    test('should validate complete CV data structure', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York',
          website: '',
          linkedin: '',
          github: '',
        },
        professionalSummary: {
          summary: 'Experienced developer',
        },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        gdprClause: {
          text: 'GDPR consent clause',
        },
        metadata: {
          lastUpdated: '2026-01-11T00:00:00.000Z',
          version: '1.0.0',
        },
      }
      const result = cvDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should validate CV data without gdprClause', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York',
        },
        professionalSummary: {
          summary: 'Experienced developer',
        },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        metadata: {
          lastUpdated: '2026-01-11T00:00:00.000Z',
          version: '1.0.0',
        },
      }
      const result = cvDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should validate all nested sections', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York',
        },
        professionalSummary: {
          summary: 'Summary',
        },
        workExperience: [
          {
            id: 'work-1',
            jobTitle: 'Developer',
            company: 'Company',
            location: 'City',
            startDate: '2020-01',
            endDate: null,
            current: true,
            description: '',
            achievements: [],
          },
        ],
        education: [
          {
            id: 'edu-1',
            degree: 'Bachelor',
            institution: 'University',
            location: 'City',
            startDate: '2016-09',
            endDate: '2020-05',
            current: false,
          },
        ],
        skills: [
          {
            id: 'skill-1',
            categoryName: 'Languages',
            skills: ['JavaScript'],
          },
        ],
        projects: [
          {
            id: 'project-1',
            name: 'Project',
            description: '',
            technologies: [],
            highlights: [],
          },
        ],
        certifications: [
          {
            id: 'cert-1',
            name: 'Cert',
            issuer: 'Issuer',
            date: '2021-01',
          },
        ],
        languages: [
          {
            id: 'lang-1',
            language: 'English',
            proficiency: 'Native',
          },
        ],
        gdprClause: {
          text: 'GDPR consent clause',
        },
        metadata: {
          lastUpdated: '2026-01-11',
          version: '1.0.0',
        },
      }
      const result = cvDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    test('should require metadata fields', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York',
        },
        professionalSummary: { summary: '' },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        metadata: {},
      }
      const result = cvDataSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    test('should catch nested validation errors', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'invalid-email',
          phone: '+1234567890',
          location: 'New York',
        },
        professionalSummary: { summary: '' },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        metadata: {
          lastUpdated: '2026-01-11',
          version: '1.0.0',
        },
      }
      const result = cvDataSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('validatePersonalInfo', () => {
    test('should return success for valid data', () => {
      const data = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York',
      }
      const result = validatePersonalInfo(data)
      expect(result.success).toBe(true)
    })

    test('should return error for invalid data', () => {
      const data = {
        fullName: 'John Doe',
        email: 'invalid-email',
      }
      const result = validatePersonalInfo(data)
      expect(result.success).toBe(false)
    })

    test('should include error messages', () => {
      const data = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        location: 'New York',
      }
      const result = validatePersonalInfo(data)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('validateCVData', () => {
    test('should validate complete CV', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York',
        },
        professionalSummary: { summary: 'Summary' },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        gdprClause: {
          text: 'GDPR consent clause',
        },
        metadata: {
          lastUpdated: '2026-01-11',
          version: '1.0.0',
        },
      }
      const result = validateCVData(data)
      expect(result.success).toBe(true)
    })

    test('should catch nested validation errors', () => {
      const data = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'invalid',
        },
        metadata: {},
      }
      const result = validateCVData(data)
      expect(result.success).toBe(false)
    })

    test('should handle missing required fields', () => {
      const data = {}
      const result = validateCVData(data)
      expect(result.success).toBe(false)
    })
  })
})
