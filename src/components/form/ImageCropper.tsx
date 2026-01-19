'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useTranslations } from 'next-intl';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ImageCropperProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
}

export function ImageCropper({
  image,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = 'round',
}: ImageCropperProps) {
  const t = useTranslations('forms.personalInfo');
  const tCommon = useTranslations('common');

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async (): Promise<string> => {
    if (!croppedAreaPixels) {
      throw new Error('No crop area defined');
    }

    const img = new Image();
    img.src = image;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to cropped area
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        // Draw the cropped portion
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        // Convert to base64
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(croppedImageUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }, [image, croppedAreaPixels]);

  const handleSave = useCallback(async () => {
    try {
      const croppedImage = await createCroppedImage();
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Failed to crop image:', error);
    }
  }, [createCroppedImage, onCropComplete, onClose]);

  const handleCancel = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('cropImage')}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel}>
            {tCommon('cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('applyCrop')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('zoom')}</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm text-gray-500 min-w-[3rem] text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <p className="text-sm text-gray-500">{t('cropInstructions')}</p>
      </div>
    </Modal>
  );
}
