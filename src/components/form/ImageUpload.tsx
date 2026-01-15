'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { Button } from '../ui/Button';
import { ImageCropper } from './ImageCropper';

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (base64Image: string | null) => void;
  error?: string;
}

export function ImageUpload({ label, value, onChange, error }: ImageUploadProps) {
  const t = useTranslations('forms.personalInfo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { preview, isUploading, error: uploadError, uploadImage, clearImage, setPreview } = useImageUpload();

  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const displayImage = preview || value;
  const displayError = error || uploadError;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Read the file and open cropper
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setImageToCrop(imageDataUrl);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    // Process the cropped image through the upload hook for compression
    const processedImage = await uploadImage(croppedImage);
    if (processedImage) {
      onChange(processedImage);
    }
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleEditPhoto = () => {
    if (displayImage) {
      setImageToCrop(displayImage);
      setShowCropper(true);
    }
  };

  const handleRemove = () => {
    clearImage();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="flex items-start gap-4">
        {displayImage && (
          <div className="relative">
            <img
              src={displayImage}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
          </div>
        )}

        <div className="flex-1">
          <div
            onClick={handleClick}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              displayError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="mt-2 text-sm text-gray-600">
              {isUploading ? t('uploading') : t('uploadPrompt')}
            </p>
            <p className="mt-1 text-xs text-gray-500">{t('uploadFormat')}</p>
          </div>

          {displayImage && (
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleEditPhoto}
              >
                {t('editPhoto')}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemove}
              >
                {t('removePhoto')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {displayError && <p className="mt-2 text-sm text-red-600">{displayError}</p>}

      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          isOpen={showCropper}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
