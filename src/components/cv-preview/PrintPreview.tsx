'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CVPreview } from './CVPreview';
import { Button } from '../ui/Button';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPreview({ isOpen, onClose }: PrintPreviewProps) {
  const t = useTranslations();
  const modalRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportHtml = () => {
    if (!cvRef.current) return;

    // Get the CV content HTML
    const cvContent = cvRef.current.innerHTML;

    // Create standalone HTML document with Tailwind CDN
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
    }
    /* Custom em-text utilities (em-based font sizes) */
    .em-text-xs { font-size: 0.75em; }
    .em-text-sm { font-size: 0.875em; }
    .em-text-base { font-size: 1em; }
    .em-text-lg { font-size: 1.125em; }
    .em-text-xl { font-size: 1.25em; }
    .em-text-2xl { font-size: 1.5em; }
    .em-text-3xl { font-size: 1.875em; }
    .em-text-4xl { font-size: 2.25em; }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .a4-page {
        box-shadow: none !important;
      }
    }
    @page {
      size: A4;
      margin: 0;
    }
  </style>
</head>
<body>
  ${cvContent}
</body>
</html>`;

    // Download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto print:bg-white"
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose();
        }
      }}
    >
      {/* Header with actions - hidden when printing */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-xl font-semibold text-gray-900">Print Preview</h2>
            <div className="flex items-center gap-3">
              <Button onClick={handlePrint} variant="primary" size="md">
                Print / Save as PDF
              </Button>
              <Button onClick={handleExportHtml} variant="secondary" size="md">
                {t('common.exportHtml')}
              </Button>
              <Button onClick={onClose} variant="secondary" size="md">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview - centered and optimized for printing */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div ref={cvRef} className="print:shadow-none">
          <CVPreview />
        </div>
      </div>
    </div>
  );
}
