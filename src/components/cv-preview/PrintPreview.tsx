'use client';

import React, { useEffect, useRef } from 'react';
import { CVPreview } from './CVPreview';
import { Button } from '../ui/Button';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPreview({ isOpen, onClose }: PrintPreviewProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
              <Button onClick={onClose} variant="secondary" size="md">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview - centered and optimized for printing */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div className="print:shadow-none">
          <CVPreview />
        </div>
      </div>
    </div>
  );
}
