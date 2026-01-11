'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { Education } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { FormDatePicker } from '../form/FormDatePicker';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function EducationSection() {
  const t = useTranslations();
  const { cvData, addEducation, updateEducation, removeEducation } = useCVData();
  const { education } = cvData;

  const handleAdd = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: null,
      current: false,
      gpa: '',
      description: '',
    };
    addEducation(newEducation);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('forms.education.title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('forms.education.addEducation')}
          </Button>
        </div>
      }
    >
      {education.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('forms.education.noEducation')}
        </p>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('forms.education.educationNumber', { number: index + 1 })}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                >
                  {t('common.remove')}
                </Button>
              </div>

              <div className="space-y-4">
                <FormInput
                  label={t('forms.education.degree')}
                  placeholder="Bachelor of Science in Computer Science"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label={t('forms.education.institution')}
                    placeholder="University of Example"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, { institution: e.target.value })
                    }
                  />

                  <FormInput
                    label={t('forms.education.location')}
                    placeholder="Boston, MA"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormDatePicker
                    label={t('forms.education.startDate')}
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, { startDate: e.target.value })
                    }
                  />

                  <FormDatePicker
                    label={t('forms.education.endDate')}
                    value={edu.endDate || ''}
                    onChange={(e) =>
                      updateEducation(edu.id, { endDate: e.target.value || null })
                    }
                    disabled={edu.current}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        current: e.target.checked,
                        endDate: e.target.checked ? null : edu.endDate,
                      })
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={`current-${edu.id}`} className="ml-2 text-sm text-gray-700">
                    {t('forms.education.current')}
                  </label>
                </div>

                <FormInput
                  label={t('forms.education.gpa')}
                  placeholder="3.8 / 4.0"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                />

                <FormTextarea
                  label={t('forms.education.description')}
                  placeholder="Additional details, honors, relevant coursework..."
                  value={edu.description || ''}
                  onChange={(e) =>
                    updateEducation(edu.id, { description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
