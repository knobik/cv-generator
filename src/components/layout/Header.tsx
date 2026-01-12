'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { exportCVData, importCVData, clearCVData, getStorageSize, formatBytes, saveCVData } from '@/lib/storage';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { PrintPreview } from '../cv-preview/PrintPreview';

export function Header() {
  const t = useTranslations();
  const { cvData, resetCV, saveCV } = useCVData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [storageSize, setStorageSize] = useState(0);

  // Calculate storage size on client side only to avoid hydration mismatch
  useEffect(() => {
    setStorageSize(getStorageSize());
  }, [cvData]);

  const handleExport = () => {
    const jsonString = exportCVData(cvData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const importedData = importCVData(jsonString);
        saveCVData(importedData);
        window.location.reload();
      } catch (error) {
        alert(t('messages.importError'));
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (confirm(t('messages.confirmClear'))) {
      resetCV();
      clearCVData();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
            <p className="text-xs text-gray-500">
              {t('common.storage')}: {formatBytes(storageSize)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Button onClick={() => setShowPrintPreview(true)} variant="primary" size="sm">
              {t('common.printPdf')}
            </Button>

            <Button onClick={saveCV} variant="secondary" size="sm">
              {t('common.save')}
            </Button>

            <Button onClick={handleExport} variant="secondary" size="sm">
              {t('common.export')}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="sm"
            >
              {t('common.import')}
            </Button>

            <Button onClick={handleClear} variant="danger" size="sm">
              {t('common.clearAll')}
            </Button>
          </div>
        </div>
      </div>

      <PrintPreview
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
      />
    </header>
  );
}
