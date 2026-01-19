import { CVData, EMPTY_CV_DATA } from '@/types/cv';
import { validateCVData } from './validation';

const STORAGE_KEY = 'cv-generator-data';
const LOCALE_STORAGE_KEY = 'cv-generator-locale';

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Save CV data to localStorage
 */
export function saveCVData(data: CVData): void {
  try {
    // Update last modified timestamp
    const dataToSave: CVData = {
      ...data,
      metadata: {
        ...data.metadata,
        lastUpdated: new Date().toISOString(),
      },
    };

    const jsonString = JSON.stringify(dataToSave);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded. Please remove some data or export your CV.');
    }
    throw new StorageError('Failed to save CV data');
  }
}

/**
 * Load CV data from localStorage
 * Returns null if no data exists or if data is invalid
 */
export function loadCVData(): CVData | null {
  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);

    if (!jsonString) {
      return null;
    }

    const parsedData = JSON.parse(jsonString);

    // Validate the loaded data
    const validationResult = validateCVData(parsedData);

    if (!validationResult.success) {
      console.error('Invalid CV data in localStorage:', validationResult.error);
      return null;
    }

    return validationResult.data as CVData;
  } catch (error) {
    console.error('Failed to load CV data:', error);
    return null;
  }
}

/**
 * Clear all CV data from localStorage
 */
export function clearCVData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    throw new StorageError('Failed to clear CV data');
  }
}

/**
 * Export CV data as JSON string
 */
export function exportCVData(data: CVData): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new StorageError('Failed to export CV data');
  }
}

/**
 * Import CV data from JSON string
 * Throws error if JSON is invalid or doesn't match schema
 */
export function importCVData(jsonString: string): CVData {
  try {
    const parsedData = JSON.parse(jsonString);

    const validationResult = validateCVData(parsedData);

    if (!validationResult.success) {
      throw new StorageError('Invalid CV data format');
    }

    return validationResult.data as CVData;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to parse JSON data');
  }
}

/**
 * Get the size of stored CV data in bytes
 */
export function getStorageSize(): number {
  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);
    if (!jsonString) return 0;

    // Approximate size in bytes (2 bytes per character in JavaScript strings)
    return new Blob([jsonString]).size;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Save locale preference to localStorage
 */
export function saveLocale(locale: string): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.error('Failed to save locale:', error);
  }
}

/**
 * Load locale preference from localStorage
 * Returns null if no preference is saved
 */
export function loadLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to load locale:', error);
    return null;
  }
}
