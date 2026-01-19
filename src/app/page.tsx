'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { PersonalInfoSection } from '@/components/cv-editor/PersonalInfoSection';
import { ProfessionalSummarySection } from '@/components/cv-editor/ProfessionalSummarySection';
import { WorkExperienceSection } from '@/components/cv-editor/WorkExperienceSection';
import { EducationSection } from '@/components/cv-editor/EducationSection';
import { SkillsSection } from '@/components/cv-editor/SkillsSection';
import { ProjectsSection } from '@/components/cv-editor/ProjectsSection';
import { CertificationsSection } from '@/components/cv-editor/CertificationsSection';
import { LanguagesSection } from '@/components/cv-editor/LanguagesSection';
import { InterestsSection } from '@/components/cv-editor/InterestsSection';
import { GDPRSection } from '@/components/cv-editor/GDPRSection';
import { CVPreview } from '@/components/cv-preview/CVPreview';
import { useCVData } from '@/lib/hooks/useCVData';

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794; // 210mm

export default function HomePage() {
  const t = useTranslations();
  const { cvData, updateSettings } = useCVData();
  const [activeSection, setActiveSection] = useState('personal');
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const fontSize = cvData.settings?.fontSize ?? 16;

  // Calculate scale to fit A4 page in container
  useEffect(() => {
    const calculateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 40; // subtract padding
        const scale = Math.min(containerWidth / A4_WIDTH_PX, 1);
        setPreviewScale(scale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const sections = [
    { id: 'personal', labelKey: 'navigation.personalInfo', component: PersonalInfoSection },
    { id: 'summary', labelKey: 'navigation.summary', component: ProfessionalSummarySection },
    { id: 'experience', labelKey: 'navigation.experience', component: WorkExperienceSection },
    { id: 'education', labelKey: 'navigation.education', component: EducationSection },
    { id: 'skills', labelKey: 'navigation.skills', component: SkillsSection },
    { id: 'projects', labelKey: 'navigation.projects', component: ProjectsSection },
    {
      id: 'certifications',
      labelKey: 'navigation.certifications',
      component: CertificationsSection,
    },
    { id: 'languages', labelKey: 'navigation.languages', component: LanguagesSection },
    { id: 'interests', labelKey: 'navigation.interests', component: InterestsSection },
    { id: 'gdpr', labelKey: 'navigation.gdpr', component: GDPRSection },
  ];

  const ActiveSectionComponent =
    sections.find((s) => s.id === activeSection)?.component || PersonalInfoSection;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(section.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <ActiveSectionComponent />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>{t('messages.note')}:</strong> {t('messages.autoSaveNote')}
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start print:static print:p-0">
            <div className="mb-4 print:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('preview.livePreview')}
                  </h2>
                  <p className="text-sm text-gray-600">{t('preview.previewDescription')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="fontSize" className="text-sm text-gray-600">
                    {t('preview.fontSize')}:
                  </label>
                  <input
                    type="number"
                    id="fontSize"
                    min="8"
                    max="16"
                    value={fontSize}
                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
            <div
              ref={previewContainerRef}
              className="a4-preview-container rounded-lg max-h-[calc(100vh-200px)] print:overflow-visible print:max-h-none print:bg-white print:p-0"
            >
              <div className="a4-preview-wrapper" style={{ transform: `scale(${previewScale})` }}>
                <CVPreview />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
