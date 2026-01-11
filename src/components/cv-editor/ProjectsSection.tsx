'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { Project } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function ProjectsSection() {
  const t = useTranslations('forms.projects');
  const tCommon = useTranslations('common');
  const { cvData, addProject, updateProject, removeProject } = useCVData();
  const { projects } = cvData;

  const handleAdd = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
      startDate: '',
      endDate: '',
      highlights: [],
    };
    addProject(newProject);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addProject')}
          </Button>
        </div>
      }
    >
      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noProjects')}
        </p>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('projectNumber', { number: index + 1 })}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                >
                  {tCommon('remove')}
                </Button>
              </div>

              <div className="space-y-4">
                <FormInput
                  label={t('name')}
                  placeholder="My Awesome Project"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, { name: e.target.value })
                  }
                />

                <FormTextarea
                  label={t('description')}
                  placeholder="Brief description of the project..."
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, { description: e.target.value })
                  }
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label={t('url')}
                    type="url"
                    placeholder="https://project.com"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  />

                  <FormInput
                    label={t('githubUrl')}
                    type="url"
                    placeholder="https://github.com/user/project"
                    value={project.githubUrl || ''}
                    onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label={t('startDate')}
                    type="month"
                    value={project.startDate || ''}
                    onChange={(e) =>
                      updateProject(project.id, { startDate: e.target.value })
                    }
                  />

                  <FormInput
                    label={t('endDate')}
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) =>
                      updateProject(project.id, { endDate: e.target.value })
                    }
                  />
                </div>

                <TechnologiesList
                  technologies={project.technologies}
                  onChange={(technologies) =>
                    updateProject(project.id, { technologies })
                  }
                />

                <HighlightsList
                  highlights={project.highlights}
                  onChange={(highlights) =>
                    updateProject(project.id, { highlights })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TechnologiesList({
  technologies,
  onChange,
}: {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}) {
  const t = useTranslations('forms.projects');
  const tCommon = useTranslations('common');
  const [newTech, setNewTech] = useState('');

  const handleAdd = () => {
    if (newTech.trim()) {
      onChange([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(technologies.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('technologies')}
      </label>

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-blue-700 hover:text-blue-900 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a technology..."
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          {tCommon('add')}
        </Button>
      </div>
    </div>
  );
}

function HighlightsList({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (highlights: string[]) => void;
}) {
  const t = useTranslations('forms.projects');
  const tCommon = useTranslations('common');
  const [newHighlight, setNewHighlight] = useState('');

  const handleAdd = () => {
    if (newHighlight.trim()) {
      onChange([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('highlights')}
      </label>

      {highlights.length > 0 && (
        <ul className="space-y-2 mb-3">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200"
            >
              <span className="flex-1 text-sm">{highlight}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                {tCommon('remove')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a highlight..."
          value={newHighlight}
          onChange={(e) => setNewHighlight(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          {tCommon('add')}
        </Button>
      </div>
    </div>
  );
}
