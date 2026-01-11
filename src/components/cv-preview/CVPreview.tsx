'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { formatDateRange, isEmpty } from '@/lib/utils';

export function CVPreview() {
  const t = useTranslations();
  const { cvData } = useCVData();
  const { personalInfo, professionalSummary, workExperience, education, skills, projects, certifications, languages } = cvData;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl">
      {/* Personal Info Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex items-start gap-6">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personalInfo.fullName || 'Your Name'}
            </h1>

            <div className="space-y-1 text-gray-600">
              {personalInfo.email && (
                <p className="flex items-center gap-2">
                  <span>{t('preview.email')}:</span> <span>{personalInfo.email}</span>
                </p>
              )}
              {personalInfo.phone && (
                <p className="flex items-center gap-2">
                  <span>{t('preview.phone')}:</span> <span>{personalInfo.phone}</span>
                </p>
              )}
              {personalInfo.location && (
                <p className="flex items-center gap-2">
                  <span>{t('preview.location')}:</span> <span>{personalInfo.location}</span>
                </p>
              )}
            </div>

            <div className="flex gap-4 mt-3">
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {t('preview.website')}
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {t('preview.linkedin')}
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {t('preview.github')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {!isEmpty(professionalSummary.summary) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.professionalSummary')}
          </h2>
          <p className="text-gray-700 leading-relaxed">{professionalSummary.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.workExperience')}
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  {exp.company} • {exp.location}
                </p>
                {exp.description && (
                  <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">{achievement}</li>
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
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.education')}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution} • {edu.location}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">{t('preview.gpa')}: {edu.gpa}</p>}
                    {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.skills')}
          </h2>
          <div className="space-y-3">
            {skills.map((category) => (
              <div key={category.id}>
                <h3 className="font-semibold text-gray-900 mb-2">{category.categoryName}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.projects')}
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-sm">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t('preview.viewProject')}
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t('preview.github')}
                    </a>
                  )}
                </div>
                {project.highlights.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">{highlight}</li>
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
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.certifications')}
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700 text-sm">{cert.issuer} • {cert.date}</p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {t('preview.viewCredential')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {t('preview.languages')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-900">{lang.language}</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
