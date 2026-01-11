'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { Language, ProficiencyLevel } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const proficiencyLevels: ProficiencyLevel[] = ['Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

const proficiencyLabels: Record<ProficiencyLevel, string> = {
  'Native': 'Native',
  'C2': 'C2 - Proficiency',
  'C1': 'C1 - Advanced',
  'B2': 'B2 - Upper Intermediate',
  'B1': 'B1 - Intermediate',
  'A2': 'A2 - Elementary',
  'A1': 'A1 - Beginner',
};

export function LanguagesSection() {
  const t = useTranslations('forms.languages');
  const tCommon = useTranslations('common');
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCVData();
  const { languages } = cvData;

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
        <div className="space-y-6">
          {languages.map((lang, index) => (
            <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('languageNumber', { number: index + 1 })}</h3>
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
                        {proficiencyLabels[level]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
