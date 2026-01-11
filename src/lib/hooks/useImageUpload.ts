import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
  clearImage: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 200 * 1024; // 200KB target for compressed image
const MAX_WIDTH = 400; // Maximum width for the photo
const MAX_HEIGHT = 400; // Maximum height for the photo

/**
 * Hook for handling image upload, compression, and base64 encoding
 */
export function useImageUpload(): UseImageUploadReturn {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels to get under target size
          let quality = 0.8;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Reduce quality until we're under the target size
          while (dataUrl.length > MAX_IMAGE_SIZE && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('File must be an image');
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error('File size must be less than 5MB');
        }

        // Compress and convert to base64
        const base64Image = await compressImage(file);

        setPreview(base64Image);
        setIsUploading(false);

        return base64Image;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMessage);
        setIsUploading(false);
        return null;
      }
    },
    [compressImage]
  );

  const clearImage = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  return {
    preview,
    isUploading,
    error,
    uploadImage,
    clearImage,
  };
}
