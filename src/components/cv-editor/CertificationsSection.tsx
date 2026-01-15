'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { Certification } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function CertificationsSection() {
  const t = useTranslations('forms.certifications');
  const tCommon = useTranslations('common');
  const { cvData, addCertification, updateCertification, removeCertification, reorderCertifications } = useCVData();
  const { certifications } = cvData;

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
    items: certifications,
    onReorder: reorderCertifications,
  });

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
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="space-y-6"
          onDragLeave={handleContainerDragLeave}
        >
          {certifications.map((cert, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = draggedIndex !== null ? certifications[draggedIndex] : null;

            return (
              <React.Fragment key={cert.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.name || t('certificationNumber', { number: draggedIndex! + 1 })}
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
                  {t('certificationNumber', { number: index + 1 })}
                </h3>
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
                {placeholderPos === 'after' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {draggedItem?.name || t('certificationNumber', { number: draggedIndex! + 1 })}
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
