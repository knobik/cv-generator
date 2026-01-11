'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  CVData,
  EMPTY_CV_DATA,
  PersonalInfo,
  ProfessionalSummary,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
  Language,
} from '@/types/cv';
import { saveCVData, loadCVData } from '@/lib/storage';

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateProfessionalSummary: (summary: Partial<ProfessionalSummary>) => void;
  addWorkExperience: (experience: WorkExperience) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkillCategory: (category: SkillCategory) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  updateLocale: (locale: string) => void;
  resetCV: () => void;
  loadCV: () => void;
  saveCV: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(EMPTY_CV_DATA);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load CV data from localStorage on mount
  useEffect(() => {
    const loadedData = loadCVData();
    if (loadedData) {
      setCvData(loadedData);
    }
  }, []);

  // Debounced auto-save function
  const debouncedSave = useCallback((data: CVData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCVData(data);
    }, 2000); // 2 second delay
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateProfessionalSummary = useCallback((summary: Partial<ProfessionalSummary>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        professionalSummary: { ...prev.professionalSummary, ...summary },
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addWorkExperience = useCallback((experience: WorkExperience) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        workExperience: [...prev.workExperience, experience],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateWorkExperience = useCallback((id: string, experience: Partial<WorkExperience>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        workExperience: prev.workExperience.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeWorkExperience = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        workExperience: prev.workExperience.filter((exp) => exp.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addEducation = useCallback((education: Education) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        education: [...prev.education, education],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateEducation = useCallback((id: string, education: Partial<Education>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        education: prev.education.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeEducation = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        education: prev.education.filter((edu) => edu.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addSkillCategory = useCallback((category: SkillCategory) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        skills: [...prev.skills, category],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateSkillCategory = useCallback((id: string, category: Partial<SkillCategory>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.map((skill) =>
          skill.id === id ? { ...skill, ...category } : skill
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeSkillCategory = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        skills: prev.skills.filter((skill) => skill.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addProject = useCallback((project: Project) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        projects: [...prev.projects, project],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateProject = useCallback((id: string, project: Partial<Project>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.map((proj) =>
          proj.id === id ? { ...proj, ...project } : proj
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeProject = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.filter((proj) => proj.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addCertification = useCallback((certification: Certification) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        certifications: [...prev.certifications, certification],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateCertification = useCallback((id: string, certification: Partial<Certification>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        certifications: prev.certifications.map((cert) =>
          cert.id === id ? { ...cert, ...certification } : cert
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeCertification = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        certifications: prev.certifications.filter((cert) => cert.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addLanguage = useCallback((language: Language) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        languages: [...prev.languages, language],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateLanguage = useCallback((id: string, language: Partial<Language>) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        languages: prev.languages.map((lang) =>
          lang.id === id ? { ...lang, ...language } : lang
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeLanguage = useCallback((id: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        languages: prev.languages.filter((lang) => lang.id !== id),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateLocale = useCallback((locale: string) => {
    setCvData((prev) => {
      const updated = {
        ...prev,
        metadata: {
          ...prev.metadata,
          locale,
        },
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const resetCV = useCallback(() => {
    setCvData(EMPTY_CV_DATA);
    saveCVData(EMPTY_CV_DATA);
  }, []);

  const loadCV = useCallback(() => {
    const loadedData = loadCVData();
    if (loadedData) {
      setCvData(loadedData);
    }
  }, []);

  const saveCV = useCallback(() => {
    saveCVData(cvData);
  }, [cvData]);

  const value: CVContextType = {
    cvData,
    updatePersonalInfo,
    updateProfessionalSummary,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    updateLocale,
    resetCV,
    loadCV,
    saveCV,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCVContext() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
}
