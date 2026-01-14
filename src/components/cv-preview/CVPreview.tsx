'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { formatDateRange, isEmpty } from '@/lib/utils';
import { ProficiencyLevel } from '@/types/cv';

// Helper to get proficiency level (1-6 scale) for segmented progress bar
function getProficiencyLevel(proficiency: ProficiencyLevel): number {
  const levels: Record<ProficiencyLevel, number> = {
    'A1': 1,
    'A2': 2,
    'B1': 3,
    'B2': 4,
    'C1': 5,
    'C2': 6,
    'Native': 6,
  };
  return levels[proficiency] || 3;
}

// Segmented progress bar component
function SegmentedProgressBar({ level, maxLevel = 6 }: { level: number; maxLevel?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLevel }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2 flex-1 rounded-sm ${
            idx < level ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// Section heading component
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-normal text-teal-700 mb-2 pb-1 border-b-2 border-teal-700">
      {children}
    </h2>
  );
}

// Left column section heading (smaller)
function LeftSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-normal text-teal-700 mb-2 pb-1 border-b-2 border-teal-700">
      {children}
    </h2>
  );
}

export function CVPreview() {
  const t = useTranslations();
  const { cvData } = useCVData();
  const { personalInfo, professionalSummary, workExperience, education, skills, projects, certifications, languages, interests, gdprClause } = cvData;

  // Split name for styling (first name bold, rest regular)
  const nameParts = (personalInfo.fullName || 'Your Name').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Get translated "present" text for date ranges
  const presentText = t('preview.present');

  return (
    <div className="a4-page bg-white shadow-2xl print:shadow-none" style={{ fontSize: '12px' }}>
      {/* Header - Two column layout matching content below */}
      <div className="bg-gray-100 py-3 px-8 print:bg-gray-100">
        <div className="flex flex-col md:flex-row gap-4 print:flex-row">
          {/* Left Column - Photo */}
          <div className="w-full md:w-1/3 print:w-1/3 flex justify-center items-center">
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            )}
          </div>

          {/* Right Column - Name and Title */}
          <div className="w-full md:w-2/3 print:w-2/3 flex flex-col justify-center items-center">
            <h1 className="text-2xl tracking-[0.2em] uppercase mb-2">
              <span className="font-bold">{firstName}</span>
              {lastName && <span className="font-light text-gray-600"> {lastName}</span>}
            </h1>
            {workExperience.length > 0 && workExperience[0].jobTitle && (
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500">
                {workExperience[0].jobTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col md:flex-row px-8 py-4 gap-6 print:flex-row">
        {/* Left Column - Contact & Summary */}
        <div className="w-full md:w-1/3 print:w-1/3">
          {/* Contact Section */}
          <section className="mb-4">
            <LeftSectionHeading>{t('preview.contact')}</LeftSectionHeading>
            <div className="space-y-1 text-sm text-gray-700">
              {personalInfo.location && (
                <p>{personalInfo.location}</p>
              )}
              {personalInfo.email && (
                <p className="text-teal-700">{personalInfo.email}</p>
              )}
              {personalInfo.phone && (
                <p>{personalInfo.phone}</p>
              )}
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-700 hover:underline"
                >
                  {t('preview.website')}
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-700 hover:underline"
                >
                  {t('preview.linkedin')}
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-700 hover:underline"
                >
                  {t('preview.github')}
                </a>
              )}
            </div>
          </section>

          {/* Summary Section */}
          {!isEmpty(professionalSummary.summary) && (
            <section className="mb-4">
              <LeftSectionHeading>{t('preview.professionalSummary')}</LeftSectionHeading>
              <p className="text-sm text-gray-700 leading-relaxed">{professionalSummary.summary}</p>
            </section>
          )}

          {/* Languages with segmented progress bars */}
          {languages.length > 0 && (
            <section className="mb-4">
              <LeftSectionHeading>{t('preview.languages')}</LeftSectionHeading>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{lang.language}</span>
                      <span className="text-sm text-gray-500">{t(`forms.languages.proficiencyLevelsShort.${lang.proficiency}`)}</span>
                    </div>
                    <SegmentedProgressBar level={getProficiencyLevel(lang.proficiency)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <section className="mb-4">
              <LeftSectionHeading>{t('preview.interests')}</LeftSectionHeading>
              <p className="text-sm text-gray-700">
                {interests.map((interest) => interest.name).join(', ')}
              </p>
            </section>
          )}
        </div>

        {/* Right Column - Experience, Education, Skills, Languages */}
        <div className="w-full md:w-2/3 print:w-2/3">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section className="mb-4">
              <SectionHeading>{t('preview.workExperience')}</SectionHeading>
              <div className="space-y-3">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-semibold text-teal-700">{exp.jobTitle}</h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current, presentText)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 italic mb-2">
                      {exp.company}, {exp.location}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-4">
              <SectionHeading>{t('preview.education')}</SectionHeading>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-semibold text-teal-700">{edu.degree}</h3>
                        <p className="text-sm text-gray-500 italic">
                          {edu.institution}, {edu.location}
                        </p>
                        {edu.gpa && <p className="text-sm text-gray-600">{t('preview.gpa')}: {edu.gpa}</p>}
                        {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDateRange(edu.startDate, edu.endDate, edu.current, presentText)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills - Inline comma-separated */}
          {skills.length > 0 && (
            <section className="mb-4">
              <SectionHeading>{t('preview.skills')}</SectionHeading>
              <div className="space-y-1">
                {skills.map((category) => (
                  <div key={category.id}>
                    {category.categoryName && (
                      <span className="font-semibold text-gray-800">{category.categoryName}: </span>
                    )}
                    <span className="text-sm text-teal-700">
                      {category.skills.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-4">
              <SectionHeading>{t('preview.projects')}</SectionHeading>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="text-base font-semibold text-teal-700">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:underline"
                        >
                          {t('preview.viewProject')}
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:underline"
                        >
                          {t('preview.github')}
                        </a>
                      )}
                    </div>
                    {project.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-2 space-y-1">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-4">
              <SectionHeading>{t('preview.certifications')}</SectionHeading>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-teal-700">{cert.name}</h3>
                    <p className="text-sm text-gray-500 italic">{cert.issuer} • {cert.date}</p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-700 hover:underline"
                      >
                        {t('preview.viewCredential')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* GDPR Clause Footer */}
      {gdprClause && !isEmpty(gdprClause.text) && (
        <footer className="px-8 py-2 border-t border-gray-300">
          <p className="text-xs text-gray-500 leading-relaxed italic">
            {gdprClause.text}
          </p>
        </footer>
      )}
    </div>
  );
}
