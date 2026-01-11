'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { Certification } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function CertificationsSection() {
  const t = useTranslations('forms.certifications');
  const tCommon = useTranslations('common');
  const { cvData, addCertification, updateCertification, removeCertification } = useCVData();
  const { certifications } = cvData;

  const handleAdd = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    };
    addCertification(newCertification);
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addCertification')}
          </Button>
        </div>
      }
    >
      {certifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noCertifications')}
        </p>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t('certificationNumber', { number: index + 1 })}</h3>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                >
                  {tCommon('remove')}
                </Button>
              </div>

              <div className="space-y-4">
                <FormInput
                  label={t('name')}
                  placeholder="AWS Certified Solutions Architect"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, { name: e.target.value })
                  }
                />

                <FormInput
                  label={t('issuer')}
                  placeholder="Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, { issuer: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label={t('date')}
                    type="month"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(cert.id, { date: e.target.value })
                    }
                  />

                  <FormInput
                    label={t('expiryDate')}
                    type="month"
                    value={cert.expiryDate || ''}
                    onChange={(e) =>
                      updateCertification(cert.id, { expiryDate: e.target.value })
                    }
                  />
                </div>

                <FormInput
                  label={t('credentialId')}
                  placeholder="ABC123XYZ"
                  value={cert.credentialId || ''}
                  onChange={(e) =>
                    updateCertification(cert.id, { credentialId: e.target.value })
                  }
                />

                <FormInput
                  label={t('credentialUrl')}
                  type="url"
                  placeholder="https://www.certmetrics.com/..."
                  value={cert.credentialUrl || ''}
                  onChange={(e) =>
                    updateCertification(cert.id, { credentialUrl: e.target.value })
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
