import { describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCVData } from '../useCVData';
import { CVProvider } from '@/context/CVContext';
import { loadCVData } from '@/lib/storage';

vi.mock('@/lib/storage', () => ({
  saveCVData: vi.fn(),
  loadCVData: vi.fn(),
}));

describe('useCVData', () => {
  test('should return CV context value', () => {
    vi.mocked(loadCVData).mockReturnValue(null);

    const { result } = renderHook(() => useCVData(), {
      wrapper: CVProvider,
    });

    expect(result.current.cvData).toBeDefined();
    expect(result.current.updatePersonalInfo).toBeInstanceOf(Function);
    expect(result.current.saveCV).toBeInstanceOf(Function);
  });

  test('should throw error if used outside CVProvider', () => {
    expect(() => {
      renderHook(() => useCVData());
    }).toThrow('useCVContext must be used within a CVProvider');
  });

  test('should provide access to all context methods', () => {
    vi.mocked(loadCVData).mockReturnValue(null);

    const { result } = renderHook(() => useCVData(), {
      wrapper: CVProvider,
    });

    // Verify it has all the expected methods from CVContext
    expect(result.current).toHaveProperty('cvData');
    expect(result.current).toHaveProperty('updatePersonalInfo');
    expect(result.current).toHaveProperty('updateProfessionalSummary');
    expect(result.current).toHaveProperty('addWorkExperience');
    expect(result.current).toHaveProperty('updateWorkExperience');
    expect(result.current).toHaveProperty('removeWorkExperience');
    expect(result.current).toHaveProperty('addEducation');
    expect(result.current).toHaveProperty('updateEducation');
    expect(result.current).toHaveProperty('removeEducation');
    expect(result.current).toHaveProperty('addSkillCategory');
    expect(result.current).toHaveProperty('updateSkillCategory');
    expect(result.current).toHaveProperty('removeSkillCategory');
    expect(result.current).toHaveProperty('addProject');
    expect(result.current).toHaveProperty('updateProject');
    expect(result.current).toHaveProperty('removeProject');
    expect(result.current).toHaveProperty('addCertification');
    expect(result.current).toHaveProperty('updateCertification');
    expect(result.current).toHaveProperty('removeCertification');
    expect(result.current).toHaveProperty('addLanguage');
    expect(result.current).toHaveProperty('updateLanguage');
    expect(result.current).toHaveProperty('removeLanguage');
    expect(result.current).toHaveProperty('updateLocale');
    expect(result.current).toHaveProperty('resetCV');
    expect(result.current).toHaveProperty('loadCV');
    expect(result.current).toHaveProperty('saveCV');
  });
});
