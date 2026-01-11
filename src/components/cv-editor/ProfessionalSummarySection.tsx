'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { FormTextarea } from '../form/FormTextarea';
import { Card } from '../ui/Card';

export function ProfessionalSummarySection() {
  const t = useTranslations();
  const { cvData, updateProfessionalSummary } = useCVData();
  const { professionalSummary } = cvData;

  return (
    <Card header={<h2 className="text-lg font-semibold">{t('forms.summary.title')}</h2>}>
      <FormTextarea
        label={t('forms.summary.title')}
        placeholder="Brief overview of your professional background, key skills, and career objectives..."
        value={professionalSummary.summary}
        onChange={(e) => updateProfessionalSummary({ summary: e.target.value })}
        rows={6}
        showCharCount
        maxChars={500}
        helperText="Write a compelling summary that highlights your expertise and career goals"
      />
    </Card>
  );
}
