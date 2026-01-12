'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { SkillCategory } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function SkillsSection() {
  const t = useTranslations();
  const { cvData, addSkillCategory, updateSkillCategory, removeSkillCategory } = useCVData();
  const { skills } = cvData;

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
        <div className="space-y-6">
          {skills.map((category, index) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('categoryNumber', { number: index + 1 })}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeSkillCategory(category.id)}
                >
                  {t('common.remove')}
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
          ))}
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
  const t = useTranslations();
  const [newSkill, setNewSkill] = useState('');

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
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {skill}
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
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
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
