'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { FormInput } from '../form/FormInput';
import { ImageUpload } from '../form/ImageUpload';
import { Card } from '../ui/Card';

export function PersonalInfoSection() {
  const t = useTranslations();
  const { cvData, updatePersonalInfo } = useCVData();
  const { personalInfo } = cvData;

  return (
    <Card header={<h2 className="text-lg font-semibold">{t('forms.personalInfo.title')}</h2>}>
      <div className="space-y-4">
        <FormInput
          label={t('forms.personalInfo.fullName')}
          placeholder="John Doe"
          value={personalInfo.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          autoComplete="name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('forms.personalInfo.email')}
            type="email"
            placeholder="john.doe@example.com"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            autoComplete="email"
          />

          <FormInput
            label={t('forms.personalInfo.phone')}
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            autoComplete="tel"
          />
        </div>

        <FormInput
          label={t('forms.personalInfo.location')}
          placeholder="San Francisco, CA"
          value={personalInfo.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          autoComplete="address-level2"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label={t('forms.personalInfo.website')}
            type="url"
            placeholder="https://yourwebsite.com"
            value={personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            autoComplete="url"
          />

          <FormInput
            label={t('forms.personalInfo.linkedin')}
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            autoComplete="url"
          />

          <FormInput
            label={t('forms.personalInfo.github')}
            type="url"
            placeholder="https://github.com/johndoe"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            autoComplete="url"
          />
        </div>

        <ImageUpload
          label={t('forms.personalInfo.photo')}
          value={personalInfo.photo}
          onChange={(photo) => updatePersonalInfo({ photo: photo || undefined })}
        />
      </div>
    </Card>
  );
}
