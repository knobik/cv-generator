import { describe, expect, test, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CVProvider, useCVContext } from '../CVContext';
import { EMPTY_CV_DATA } from '@/types/cv';
import { saveCVData, loadCVData } from '@/lib/storage';
import {
  mockPersonalInfo,
  mockWorkExperience,
  mockEducation,
  mockSkillCategory,
  mockProject,
  mockCertification,
  mockLanguage,
  mockCVData,
} from '@/test/utils/testData';
import React from 'react';

// Mock the storage module
vi.mock('@/lib/storage', () => ({
  saveCVData: vi.fn(),
  loadCVData: vi.fn(),
}));

describe('CVContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    test('should initialize with empty CV data', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('');
      expect(result.current.cvData.workExperience).toEqual([]);
      expect(result.current.cvData.education).toEqual([]);
    });

    test('should load data from localStorage on mount', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('John Doe');
      expect(result.current.cvData.workExperience.length).toBe(1);
    });

    test('should provide CV data to children', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      expect(result.current.cvData).toBeDefined();
      expect(result.current.updatePersonalInfo).toBeDefined();
    });
  });

  describe('useCVContext Hook', () => {
    test('should throw error if used outside CVProvider', () => {
      expect(() => {
        renderHook(() => useCVContext());
      }).toThrow('useCVContext must be used within a CVProvider');
    });

    test('should provide access to all context methods', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      expect(result.current.updatePersonalInfo).toBeInstanceOf(Function);
      expect(result.current.updateProfessionalSummary).toBeInstanceOf(Function);
      expect(result.current.addWorkExperience).toBeInstanceOf(Function);
      expect(result.current.updateWorkExperience).toBeInstanceOf(Function);
      expect(result.current.removeWorkExperience).toBeInstanceOf(Function);
      expect(result.current.resetCV).toBeInstanceOf(Function);
      expect(result.current.loadCV).toBeInstanceOf(Function);
      expect(result.current.saveCV).toBeInstanceOf(Function);
    });
  });

  describe('Personal Info Updates', () => {
    test('should update personal info fields', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'Jane Smith' });
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('Jane Smith');
    });

    test('should merge partial updates', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'Jane Smith' });
      });

      act(() => {
        result.current.updatePersonalInfo({ email: 'jane@example.com' });
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('Jane Smith');
      expect(result.current.cvData.personalInfo.email).toBe('jane@example.com');
    });

    test('should trigger auto-save', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'Jane Smith' });
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(saveCVData).toHaveBeenCalled();
    });

    test('should maintain other CV data', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      const originalWorkExp = result.current.cvData.workExperience;

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'New Name' });
      });

      expect(result.current.cvData.workExperience).toEqual(originalWorkExp);
    });
  });

  describe('Professional Summary Updates', () => {
    test('should update summary text', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateProfessionalSummary({ summary: 'New summary' });
      });

      expect(result.current.cvData.professionalSummary.summary).toBe('New summary');
    });

    test('should merge partial updates', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateProfessionalSummary({ summary: 'Updated summary' });
      });

      expect(result.current.cvData.professionalSummary.summary).toBe('Updated summary');
    });

    test('should trigger auto-save', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateProfessionalSummary({ summary: 'New summary' });
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(saveCVData).toHaveBeenCalled();
    });
  });

  describe('Work Experience Operations', () => {
    test('should add new work experience', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addWorkExperience(mockWorkExperience);
      });

      expect(result.current.cvData.workExperience.length).toBe(1);
      expect(result.current.cvData.workExperience[0].jobTitle).toBe('Senior Software Engineer');
    });

    test('should generate unique ID when adding', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addWorkExperience(mockWorkExperience);
      });

      expect(result.current.cvData.workExperience[0].id).toBeDefined();
    });

    test('should trigger auto-save on add', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addWorkExperience(mockWorkExperience);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(saveCVData).toHaveBeenCalled();
    });

    test('should update existing work experience', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateWorkExperience('work-1', { jobTitle: 'Lead Engineer' });
      });

      expect(result.current.cvData.workExperience[0].jobTitle).toBe('Lead Engineer');
    });

    test('should merge partial updates in work experience', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      const originalCompany = result.current.cvData.workExperience[0].company;

      act(() => {
        result.current.updateWorkExperience('work-1', { jobTitle: 'Lead Engineer' });
      });

      expect(result.current.cvData.workExperience[0].company).toBe(originalCompany);
    });

    test('should not affect other entries on update', () => {
      const dataWithMultipleExp = {
        ...mockCVData,
        workExperience: [
          mockWorkExperience,
          { ...mockWorkExperience, id: 'work-2', jobTitle: 'Junior Dev' },
        ],
      };
      vi.mocked(loadCVData).mockReturnValue(dataWithMultipleExp);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateWorkExperience('work-1', { jobTitle: 'Lead Engineer' });
      });

      expect(result.current.cvData.workExperience[1].jobTitle).toBe('Junior Dev');
    });

    test('should remove work experience by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeWorkExperience('work-1');
      });

      expect(result.current.cvData.workExperience.length).toBe(0);
    });

    test('should not affect other entries on remove', () => {
      const dataWithMultipleExp = {
        ...mockCVData,
        workExperience: [
          mockWorkExperience,
          { ...mockWorkExperience, id: 'work-2', jobTitle: 'Junior Dev' },
        ],
      };
      vi.mocked(loadCVData).mockReturnValue(dataWithMultipleExp);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeWorkExperience('work-1');
      });

      expect(result.current.cvData.workExperience.length).toBe(1);
      expect(result.current.cvData.workExperience[0].id).toBe('work-2');
    });
  });

  describe('Education Operations', () => {
    test('should add new education entry', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addEducation(mockEducation);
      });

      expect(result.current.cvData.education.length).toBe(1);
      expect(result.current.cvData.education[0].degree).toBe(
        'Bachelor of Science in Computer Science'
      );
    });

    test('should update existing education', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateEducation('edu-1', { degree: 'Master of Science' });
      });

      expect(result.current.cvData.education[0].degree).toBe('Master of Science');
    });

    test('should remove education by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeEducation('edu-1');
      });

      expect(result.current.cvData.education.length).toBe(0);
    });
  });

  describe('Skill Category Operations', () => {
    test('should add new skill category', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addSkillCategory(mockSkillCategory);
      });

      expect(result.current.cvData.skills.length).toBe(1);
      expect(result.current.cvData.skills[0].categoryName).toBe('Programming Languages');
    });

    test('should update existing skill category', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateSkillCategory('skill-1', { categoryName: 'Frameworks' });
      });

      expect(result.current.cvData.skills[0].categoryName).toBe('Frameworks');
    });

    test('should remove skill category by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeSkillCategory('skill-1');
      });

      expect(result.current.cvData.skills.length).toBe(0);
    });
  });

  describe('Project Operations', () => {
    test('should add new project', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addProject(mockProject);
      });

      expect(result.current.cvData.projects.length).toBe(1);
      expect(result.current.cvData.projects[0].name).toBe('E-Commerce Platform');
    });

    test('should update existing project', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateProject('project-1', { name: 'New Project Name' });
      });

      expect(result.current.cvData.projects[0].name).toBe('New Project Name');
    });

    test('should remove project by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeProject('project-1');
      });

      expect(result.current.cvData.projects.length).toBe(0);
    });
  });

  describe('Certification Operations', () => {
    test('should add new certification', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addCertification(mockCertification);
      });

      expect(result.current.cvData.certifications.length).toBe(1);
      expect(result.current.cvData.certifications[0].name).toBe(
        'AWS Certified Solutions Architect'
      );
    });

    test('should update existing certification', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateCertification('cert-1', { name: 'Updated Cert Name' });
      });

      expect(result.current.cvData.certifications[0].name).toBe('Updated Cert Name');
    });

    test('should remove certification by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeCertification('cert-1');
      });

      expect(result.current.cvData.certifications.length).toBe(0);
    });
  });

  describe('Language Operations', () => {
    test('should add new language', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.addLanguage(mockLanguage);
      });

      expect(result.current.cvData.languages.length).toBe(1);
      expect(result.current.cvData.languages[0].language).toBe('English');
    });

    test('should update existing language', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateLanguage('lang-1', { proficiency: 'C2' });
      });

      expect(result.current.cvData.languages[0].proficiency).toBe('C2');
    });

    test('should remove language by ID', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.removeLanguage('lang-1');
      });

      expect(result.current.cvData.languages.length).toBe(0);
    });
  });

  describe('Global Operations', () => {
    test('should update CV locale', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateLocale('pl');
      });

      expect(result.current.cvData.metadata.locale).toBe('pl');
    });

    test('should trigger auto-save on locale update', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updateLocale('pl');
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(saveCVData).toHaveBeenCalled();
    });

    test('should reset to empty CV data', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.resetCV();
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('');
      expect(result.current.cvData.workExperience.length).toBe(0);
    });

    test('should save immediately on reset', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.resetCV();
      });

      expect(saveCVData).toHaveBeenCalledWith(EMPTY_CV_DATA);
    });

    test('should load CV from localStorage', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      // Initially empty
      expect(result.current.cvData.personalInfo.fullName).toBe('');

      // Mock loadCVData to return data for the next call
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      act(() => {
        result.current.loadCV();
      });

      expect(result.current.cvData.personalInfo.fullName).toBe('John Doe');
    });

    test('should handle missing data gracefully on load', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      vi.mocked(loadCVData).mockReturnValue(null);

      act(() => {
        result.current.loadCV();
      });

      // Should maintain current data if load returns null
      expect(result.current.cvData.personalInfo.fullName).toBe('John Doe');
    });

    test('should save CV to localStorage manually', () => {
      vi.mocked(loadCVData).mockReturnValue(mockCVData);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.saveCV();
      });

      expect(saveCVData).toHaveBeenCalledWith(mockCVData);
    });
  });

  describe('Auto-Save Functionality', () => {
    test('should debounce save operations', async () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'John' });
      });

      // Should not save immediately
      expect(saveCVData).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Still should not save (debounce is 2 seconds)
      expect(saveCVData).not.toHaveBeenCalled();
    });

    test('should save after 2-second delay', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'John' });
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(saveCVData).toHaveBeenCalled();
    });

    test('should cancel pending save on multiple updates', () => {
      vi.mocked(loadCVData).mockReturnValue(null);

      const { result } = renderHook(() => useCVContext(), {
        wrapper: CVProvider,
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'John' });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.updatePersonalInfo({ fullName: 'Jane' });
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should only have been called once (after the second update completes)
      expect(saveCVData).toHaveBeenCalledTimes(1);
    });
  });
});
