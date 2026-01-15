'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { Project } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function ProjectsSection() {
  const t = useTranslations('forms.projects');
  const tCommon = useTranslations('common');
  const { cvData, addProject, updateProject, removeProject, reorderProjects } = useCVData();
  const { projects } = cvData;

  const {
    draggedIndex,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleContainerDragLeave,
    isDragging,
    getPlaceholderPosition,
  } = useDragReorder({
    items: projects,
    onReorder: reorderProjects,
  });

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
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="space-y-6"
          onDragLeave={handleContainerDragLeave}
        >
          {projects.map((project, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = draggedIndex !== null ? projects[draggedIndex] : null;

            return (
              <React.Fragment key={project.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.name || t('projectNumber', { number: draggedIndex! + 1 })}
                    </div>
                  </div>
                )}
                <div
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`border border-gray-200 rounded-lg p-4 bg-white ${
                    isDragging(index) ? 'opacity-30' : ''
                  }`}
                >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <span
                    draggable
                    onDragStart={(e) => {
                      const card = e.currentTarget.closest('.border') as HTMLElement;
                      if (card) {
                        e.dataTransfer.setDragImage(card, 20, 20);
                      }
                      handleDragStart(e, index);
                    }}
                    onDragEnd={handleDragEnd}
                    className="text-gray-400 cursor-grab hover:text-gray-600"
                  >
                    ⋮⋮
                  </span>
                  {t('projectNumber', { number: index + 1 })}
                </h3>
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
                {placeholderPos === 'after' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.name || t('projectNumber', { number: draggedIndex! + 1 })}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
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

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newTechnologies = [...technologies];
    const [draggedTech] = newTechnologies.splice(fromIndex, 1);
    newTechnologies.splice(toIndex, 0, draggedTech);
    onChange(newTechnologies);
  };

  const {
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleContainerDragLeave,
    isDragging,
    getPlaceholderPosition,
    getDraggedItem,
  } = useDragReorder({
    items: technologies,
    onReorder: handleReorder,
    autoScroll: false,
  });

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
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="flex flex-wrap gap-2 mb-3"
          onDragLeave={handleContainerDragLeave}
        >
          {technologies.map((tech, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = getDraggedItem();

            return (
              <React.Fragment key={index}>
                {placeholderPos === 'before' && (
                  <span
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-blue-400 rounded-full text-sm text-blue-400 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {draggedItem}
                  </span>
                )}
                <span
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-grab active:cursor-grabbing select-none ${
                    isDragging(index) ? 'opacity-30' : ''
                  }`}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="text-blue-700 hover:text-blue-900 font-bold"
                  >
                    ×
                  </button>
                </span>
                {placeholderPos === 'after' && (
                  <span
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-blue-400 rounded-full text-sm text-blue-400 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {draggedItem}
                  </span>
                )}
              </React.Fragment>
            );
          })}
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

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newHighlights = [...highlights];
    const [draggedHighlight] = newHighlights.splice(fromIndex, 1);
    newHighlights.splice(toIndex, 0, draggedHighlight);
    onChange(newHighlights);
  };

  const {
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleContainerDragLeave,
    isDragging,
    getPlaceholderPosition,
    getDraggedItem,
  } = useDragReorder({
    items: highlights,
    onReorder: handleReorder,
  });

  const handleAdd = () => {
    if (newHighlight.trim()) {
      onChange([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(highlights.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, value: string) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value;
    onChange(updatedHighlights);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('highlights')}
      </label>

      {highlights.length > 0 && (
        <ul
          ref={containerRef as React.RefObject<HTMLUListElement>}
          className="space-y-2 mb-3"
          onDragLeave={handleContainerDragLeave}
        >
          {highlights.map((highlight, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = getDraggedItem();

            return (
              <React.Fragment key={index}>
                {placeholderPos === 'before' && (
                  <li
                    className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-400 rounded-md bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <span className="text-blue-400 text-sm truncate">
                      {draggedItem}
                    </span>
                  </li>
                )}
                <li
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-2 ${
                    isDragging(index) ? 'opacity-30' : ''
                  }`}
                >
                  <span
                    draggable
                    onDragStart={(e) => {
                      const row = e.currentTarget.closest('li') as HTMLElement;
                      if (row) {
                        e.dataTransfer.setDragImage(row, 20, 20);
                      }
                      handleDragStart(e, index);
                    }}
                    onDragEnd={handleDragEnd}
                    className="text-gray-400 cursor-grab select-none hover:text-gray-600"
                  >
                    ⋮⋮
                  </span>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleUpdate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-2"
                  >
                    {tCommon('remove')}
                  </button>
                </li>
                {placeholderPos === 'after' && (
                  <li
                    className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-400 rounded-md bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <span className="text-blue-400 text-sm truncate">
                      {draggedItem}
                    </span>
                  </li>
                )}
              </React.Fragment>
            );
          })}
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
