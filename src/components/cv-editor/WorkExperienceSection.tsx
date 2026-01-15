'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { WorkExperience } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { FormDatePicker } from '../form/FormDatePicker';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function WorkExperienceSection() {
  const t = useTranslations();
  const { cvData, addWorkExperience, updateWorkExperience, removeWorkExperience, reorderWorkExperience } = useCVData();
  const { workExperience } = cvData;

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
    items: workExperience,
    onReorder: reorderWorkExperience,
  });

  const handleAdd = () => {
    const newExperience: WorkExperience = {
      id: generateId(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: null,
      current: false,
      description: '',
      achievements: [],
    };
    addWorkExperience(newExperience);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('forms.experience.title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('forms.experience.addExperience')}
          </Button>
        </div>
      }
    >
      {workExperience.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('forms.experience.noExperience')}
        </p>
      ) : (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="space-y-6"
          onDragLeave={handleContainerDragLeave}
        >
          {workExperience.map((exp, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = draggedIndex !== null ? workExperience[draggedIndex] : null;

            return (
              <React.Fragment key={exp.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.jobTitle || draggedItem?.company || t('forms.experience.experienceNumber', { number: draggedIndex! + 1 })}
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
                      {t('forms.experience.experienceNumber', { number: index + 1 })}
                    </h3>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeWorkExperience(exp.id)}
                    >
                      {t('common.remove')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label={t('forms.experience.jobTitle')}
                        placeholder="Software Engineer"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { jobTitle: e.target.value })
                        }
                      />

                      <FormInput
                        label={t('forms.experience.company')}
                        placeholder="Tech Corp"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                      />
                    </div>

                    <FormInput
                      label={t('forms.experience.location')}
                      placeholder="San Francisco, CA"
                      value={exp.location}
                      onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormDatePicker
                        label={t('forms.experience.startDate')}
                        value={exp.startDate}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { startDate: e.target.value })
                        }
                      />

                      <FormDatePicker
                        label={t('forms.experience.endDate')}
                        value={exp.endDate || ''}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { endDate: e.target.value || null })
                        }
                        disabled={exp.current}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, {
                            current: e.target.checked,
                            endDate: e.target.checked ? null : exp.endDate,
                          })
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${exp.id}`} className="ml-2 text-sm text-gray-700">
                        {t('forms.experience.current')}
                      </label>
                    </div>

                    <FormTextarea
                      label={t('forms.experience.description')}
                      placeholder="Describe your role and responsibilities..."
                      value={exp.description}
                      onChange={(e) =>
                        updateWorkExperience(exp.id, { description: e.target.value })
                      }
                      rows={4}
                    />

                    <AchievementsList
                      achievements={exp.achievements}
                      onChange={(achievements) =>
                        updateWorkExperience(exp.id, { achievements })
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
                      {draggedItem?.jobTitle || draggedItem?.company || t('forms.experience.experienceNumber', { number: draggedIndex! + 1 })}
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

function AchievementsList({
  achievements,
  onChange,
}: {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}) {
  const t = useTranslations();
  const [newAchievement, setNewAchievement] = useState('');

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newAchievements = [...achievements];
    const [draggedItem] = newAchievements.splice(fromIndex, 1);
    newAchievements.splice(toIndex, 0, draggedItem);
    onChange(newAchievements);
  };

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
    getDraggedItem,
  } = useDragReorder({
    items: achievements,
    onReorder: handleReorder,
  });

  const handleAdd = () => {
    if (newAchievement.trim()) {
      onChange([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, value: string) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = value;
    onChange(updatedAchievements);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('forms.experience.achievements')}
      </label>

      {achievements.length > 0 && (
        <ul
          ref={containerRef as React.RefObject<HTMLUListElement>}
          className="space-y-2 mb-3"
          onDragLeave={handleContainerDragLeave}
        >
          {achievements.map((achievement, index) => {
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
                    value={achievement}
                    onChange={(e) => handleUpdate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-2"
                  >
                    {t('common.remove')}
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
          placeholder="Add an achievement..."
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          {t('common.add')}
        </Button>
      </div>
    </div>
  );
}
