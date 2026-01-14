'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { Interest } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function InterestsSection() {
  const t = useTranslations('forms.interests');
  const tCommon = useTranslations('common');
  const { cvData, addInterest, updateInterest, removeInterest } = useCVData();
  const interests = cvData.interests || [];

  const handleAdd = () => {
    const newInterest: Interest = {
      id: generateId(),
      name: '',
    };
    addInterest(newInterest);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addInterest')}
          </Button>
        </div>
      }
    >
      {interests.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noInterests')}
        </p>
      ) : (
        <div className="space-y-4">
          {interests.map((interest, index) => (
            <div key={interest.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('interestNumber', { number: index + 1 })}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeInterest(interest.id)}
                >
                  {tCommon('remove')}
                </Button>
              </div>

              <FormInput
                label={t('interest')}
                placeholder="Photography, Hiking, Reading, etc."
                value={interest.name}
                onChange={(e) =>
                  updateInterest(interest.id, { name: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
