'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { SkillCategory } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function SkillsSection() {
  const t = useTranslations('forms.skills');
  const tCommon = useTranslations('common');
  const { cvData, addSkillCategory, updateSkillCategory, removeSkillCategory, reorderSkillCategories } = useCVData();
  const { skills } = cvData;

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
    items: skills,
    onReorder: reorderSkillCategories,
  });

  const handleAdd = () => {
    const newCategory: SkillCategory = {
      id: generateId(),
      categoryName: '',
      skills: [],
    };
    addSkillCategory(newCategory);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addCategory')}
          </Button>
        </div>
      }
    >
      {skills.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noSkills')}
        </p>
      ) : (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="space-y-4"
          onDragLeave={handleContainerDragLeave}
        >
          {skills.map((category, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedCategory = draggedIndex !== null ? skills[draggedIndex] : null;

            return (
              <React.Fragment key={category.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedCategory?.categoryName || t('categoryNumber', { number: draggedIndex! + 1 })}
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
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        className="text-gray-400 cursor-grab hover:text-gray-600"
                      >
                        ⋮⋮
                      </span>
                      {t('categoryNumber', { number: index + 1 })}
                    </h3>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeSkillCategory(category.id)}
                    >
                      {tCommon('remove')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label={t('categoryName')}
                      placeholder="e.g., Programming Languages, Tools, Frameworks"
                      value={category.categoryName}
                      onChange={(e) =>
                        updateSkillCategory(category.id, { categoryName: e.target.value })
                      }
                    />

                    <SkillsList
                      skills={category.skills}
                      onChange={(skills) =>
                        updateSkillCategory(category.id, { skills })
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
                      {draggedCategory?.categoryName || t('categoryNumber', { number: draggedIndex! + 1 })}
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

function SkillsList({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const t = useTranslations('forms.skills');
  const tCommon = useTranslations('common');
  const [newSkill, setNewSkill] = useState('');

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newSkills = [...skills];
    const [draggedSkill] = newSkills.splice(fromIndex, 1);
    newSkills.splice(toIndex, 0, draggedSkill);
    onChange(newSkills);
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
    items: skills,
    onReorder: handleReorder,
    autoScroll: false, // Skills are inline, no need for page scroll
  });

  const handleAdd = () => {
    if (newSkill.trim()) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('skills')}
      </label>

      {skills.length > 0 && (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="flex flex-wrap gap-2 mb-3"
          onDragLeave={handleContainerDragLeave}
        >
          {skills.map((skill, index) => {
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
                  {skill}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="text-blue-700 hover:text-blue-900 font-bold"
                    title="Remove"
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
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
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
