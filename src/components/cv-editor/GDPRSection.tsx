'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { FormTextarea } from '../form/FormTextarea';
import { Card } from '../ui/Card';

export function GDPRSection() {
  const t = useTranslations();
  const { cvData, updateGDPRClause } = useCVData();
  const { gdprClause } = cvData;

  return (
    <Card header={<h2 className="text-lg font-semibold">{t('forms.gdpr.title')}</h2>}>
      <p className="text-sm text-gray-600 mb-4">{t('forms.gdpr.description')}</p>
      <FormTextarea
        label={t('forms.gdpr.text')}
        placeholder="Enter your GDPR compliance clause..."
        value={gdprClause.text}
        onChange={(e) => updateGDPRClause({ text: e.target.value })}
        rows={6}
        showCharCount
        maxChars={1000}
        helperText={t('forms.gdpr.helperText')}
      />
    </Card>
  );
}
