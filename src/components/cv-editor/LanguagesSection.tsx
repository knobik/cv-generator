'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { Language, ProficiencyLevel } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const proficiencyLevels: ProficiencyLevel[] = ['Native', 'C2', 'C2+', 'C1', 'C1+', 'B2', 'B2+', 'B1', 'B1+', 'A2', 'A2+', 'A1', 'A1+'];

export function LanguagesSection() {
  const t = useTranslations('forms.languages');
  const tCommon = useTranslations('common');
  const { cvData, addLanguage, updateLanguage, removeLanguage, reorderLanguages } = useCVData();
  const { languages } = cvData;

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
    items: languages,
    onReorder: reorderLanguages,
  });

  const handleAdd = () => {
    const newLanguage: Language = {
      id: generateId(),
      language: '',
      proficiency: 'B1',
    };
    addLanguage(newLanguage);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addLanguage')}
          </Button>
        </div>
      }
    >
      {languages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noLanguages')}
        </p>
      ) : (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="space-y-6"
          onDragLeave={handleContainerDragLeave}
        >
          {languages.map((lang, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = draggedIndex !== null ? languages[draggedIndex] : null;

            return (
              <React.Fragment key={lang.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.language || t('languageNumber', { number: draggedIndex! + 1 })}
                    </div>
                  </div>
                )}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`border border-gray-200 rounded-lg p-4 bg-white cursor-grab active:cursor-grabbing ${
                    isDragging(index) ? 'opacity-30' : ''
                  }`}
                >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400 cursor-grab">⋮⋮</span>
                  {t('languageNumber', { number: index + 1 })}
                </h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                >
                  {tCommon('remove')}
                </Button>
              </div>

              <div className="space-y-4">
                <FormInput
                  label={t('language')}
                  placeholder="English, Spanish, Mandarin, etc."
                  value={lang.language}
                  onChange={(e) =>
                    updateLanguage(lang.id, { language: e.target.value })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('proficiency')}
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) =>
                      updateLanguage(lang.id, { proficiency: e.target.value as ProficiencyLevel })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {t(`proficiencyLevels.${level}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                </div>
                {placeholderPos === 'after' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.language || t('languageNumber', { number: draggedIndex! + 1 })}
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
