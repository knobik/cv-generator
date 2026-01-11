import { describe, expect, test, beforeEach, vi, afterEach } from 'vitest'
import {
  saveCVData,
  loadCVData,
  clearCVData,
  exportCVData,
  importCVData,
  getStorageSize,
  formatBytes,
  isStorageAvailable,
  saveLocale,
  loadLocale,
  StorageError,
} from '../storage'
import { CVData } from '@/types/cv'
import { mockCVData } from '@/test/utils/testData'

describe('Storage Functions', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('StorageError', () => {
    test('should create error with message', () => {
      const error = new StorageError('Test error')
      expect(error.message).toBe('Test error')
    })

    test('should be instance of Error', () => {
      const error = new StorageError('Test error')
      expect(error).toBeInstanceOf(Error)
    })

    test('should have correct name property', () => {
      const error = new StorageError('Test error')
      expect(error.name).toBe('StorageError')
    })
  })

  describe('saveCVData', () => {
    test('should save CV data to localStorage', () => {
      saveCVData(mockCVData)
      const stored = localStorage.getItem('cv-generator-data')
      expect(stored).not.toBeNull()
    })

    test('should update lastUpdated timestamp', () => {
      const beforeSave = new Date().toISOString()
      saveCVData(mockCVData)
      const stored = localStorage.getItem('cv-generator-data')
      const parsed = JSON.parse(stored!)
      const afterSave = new Date().toISOString()

      expect(parsed.metadata.lastUpdated).toBeDefined()
      expect(parsed.metadata.lastUpdated >= beforeSave).toBe(true)
      expect(parsed.metadata.lastUpdated <= afterSave).toBe(true)
    })

    test('should stringify data correctly', () => {
      saveCVData(mockCVData)
      const stored = localStorage.getItem('cv-generator-data')
      expect(() => JSON.parse(stored!)).not.toThrow()
    })

    test('should handle quota exceeded error', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      expect(() => saveCVData(mockCVData)).toThrow(StorageError)
      expect(() => saveCVData(mockCVData)).toThrow('Storage quota exceeded')

      // Restore original method
      localStorage.setItem = originalSetItem
    })

    test('should throw StorageError on generic failure', () => {
      // Mock localStorage.setItem to throw generic error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Generic error')
      })

      expect(() => saveCVData(mockCVData)).toThrow(StorageError)
      expect(() => saveCVData(mockCVData)).toThrow('Failed to save CV data')

      // Restore original method
      localStorage.setItem = originalSetItem
    })
  })

  describe('loadCVData', () => {
    test('should load valid CV data from localStorage', () => {
      saveCVData(mockCVData)
      const loaded = loadCVData()
      expect(loaded).not.toBeNull()
      expect(loaded?.personalInfo.fullName).toBe(mockCVData.personalInfo.fullName)
    })

    test('should return null if no data exists', () => {
      const loaded = loadCVData()
      expect(loaded).toBeNull()
    })

    test('should return null for invalid JSON', () => {
      localStorage.setItem('cv-generator-data', 'invalid json {')
      const loaded = loadCVData()
      expect(loaded).toBeNull()
    })

    test('should return null for invalid CV schema', () => {
      localStorage.setItem('cv-generator-data', JSON.stringify({ invalid: 'data' }))
      const loaded = loadCVData()
      expect(loaded).toBeNull()
    })

    test('should validate loaded data with Zod', () => {
      const invalidData = {
        personalInfo: {
          fullName: 'John',
          email: 'invalid-email', // Invalid email
          phone: '123',
          location: 'City',
        },
      }
      localStorage.setItem('cv-generator-data', JSON.stringify(invalidData))
      const loaded = loadCVData()
      expect(loaded).toBeNull()
    })
  })

  describe('clearCVData', () => {
    test('should remove CV data from localStorage', () => {
      saveCVData(mockCVData)
      expect(localStorage.getItem('cv-generator-data')).not.toBeNull()

      clearCVData()
      expect(localStorage.getItem('cv-generator-data')).toBeNull()
    })

    test('should not throw if no data exists', () => {
      expect(() => clearCVData()).not.toThrow()
    })

    test('should throw StorageError on failure', () => {
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      expect(() => clearCVData()).toThrow(StorageError)
      expect(() => clearCVData()).toThrow('Failed to clear CV data')

      localStorage.removeItem = originalRemoveItem
    })
  })

  describe('exportCVData', () => {
    test('should export CV as formatted JSON string', () => {
      const exported = exportCVData(mockCVData)
      expect(typeof exported).toBe('string')
    })

    test('should include all CV fields', () => {
      const exported = exportCVData(mockCVData)
      const parsed = JSON.parse(exported)
      expect(parsed.personalInfo).toBeDefined()
      expect(parsed.workExperience).toBeDefined()
      expect(parsed.education).toBeDefined()
    })

    test('should use 2-space indentation', () => {
      const exported = exportCVData(mockCVData)
      // Check that the exported string contains newlines and spaces (formatted)
      expect(exported).toContain('\n')
      expect(exported).toContain('  ')
    })

    test('should throw StorageError on failure', () => {
      // Create a circular reference to cause JSON.stringify to fail
      const circularData = { ...mockCVData } as any
      circularData.circular = circularData

      expect(() => exportCVData(circularData)).toThrow(StorageError)
      expect(() => exportCVData(circularData)).toThrow('Failed to export CV data')
    })
  })

  describe('importCVData', () => {
    test('should import valid JSON string', () => {
      const jsonString = JSON.stringify(mockCVData)
      const imported = importCVData(jsonString)
      expect(imported.personalInfo.fullName).toBe(mockCVData.personalInfo.fullName)
    })

    test('should validate imported data', () => {
      const validJson = JSON.stringify(mockCVData)
      expect(() => importCVData(validJson)).not.toThrow()
    })

    test('should throw on invalid JSON', () => {
      expect(() => importCVData('invalid json {')).toThrow(StorageError)
      expect(() => importCVData('invalid json {')).toThrow('Failed to parse JSON data')
    })

    test('should throw on invalid CV schema', () => {
      const invalidData = JSON.stringify({ invalid: 'data' })
      expect(() => importCVData(invalidData)).toThrow(StorageError)
      expect(() => importCVData(invalidData)).toThrow('Invalid CV data format')
    })

    test('should throw StorageError with message', () => {
      try {
        importCVData('invalid')
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError)
        expect((error as StorageError).message).toBeDefined()
      }
    })
  })

  describe('getStorageSize', () => {
    test('should calculate storage size in bytes', () => {
      saveCVData(mockCVData)
      const size = getStorageSize()
      expect(size).toBeGreaterThan(0)
      expect(typeof size).toBe('number')
    })

    test('should return 0 for empty storage', () => {
      clearCVData()
      const size = getStorageSize()
      expect(size).toBe(0)
    })

    test('should return 0 on error', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      const size = getStorageSize()
      expect(size).toBe(0)

      localStorage.getItem = originalGetItem
    })
  })

  describe('formatBytes', () => {
    test('should handle 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
    })

    test('should format bytes correctly', () => {
      expect(formatBytes(100)).toBe('100 Bytes')
      expect(formatBytes(500)).toContain('Bytes')
    })

    test('should format KB correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(2048)).toBe('2 KB')
      expect(formatBytes(1536)).toBe('1.5 KB')
    })

    test('should format MB correctly', () => {
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(2097152)).toBe('2 MB')
      expect(formatBytes(1572864)).toBe('1.5 MB')
    })

    test('should use 2 decimal places', () => {
      const result = formatBytes(1234567)
      expect(result).toMatch(/\d+\.\d{1,2}\s(KB|MB)/)
    })
  })

  describe('isStorageAvailable', () => {
    test('should return true if localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })

    test('should return false if localStorage is unavailable', () => {
      const originalSetItem = localStorage.setItem
      const originalRemoveItem = localStorage.removeItem

      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage unavailable')
      })

      expect(isStorageAvailable()).toBe(false)

      localStorage.setItem = originalSetItem
      localStorage.removeItem = originalRemoveItem
    })

    test('should handle SecurityError gracefully', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        const error = new Error('SecurityError')
        error.name = 'SecurityError'
        throw error
      })

      expect(isStorageAvailable()).toBe(false)

      localStorage.setItem = originalSetItem
    })

    test('should clean up test data', () => {
      isStorageAvailable()
      // The test key should not exist after the check
      expect(localStorage.getItem('__storage_test__')).toBeNull()
    })
  })

  describe('saveLocale', () => {
    test('should save locale to localStorage', () => {
      saveLocale('en')
      expect(localStorage.getItem('cv-generator-locale')).toBe('en')
    })

    test('should overwrite existing locale', () => {
      saveLocale('en')
      saveLocale('pl')
      expect(localStorage.getItem('cv-generator-locale')).toBe('pl')
    })

    test('should not throw on error', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      expect(() => saveLocale('en')).not.toThrow()

      localStorage.setItem = originalSetItem
    })
  })

  describe('loadLocale', () => {
    test('should load saved locale', () => {
      saveLocale('pl')
      const loaded = loadLocale()
      expect(loaded).toBe('pl')
    })

    test('should return null if no locale saved', () => {
      const loaded = loadLocale()
      expect(loaded).toBeNull()
    })

    test('should return null on error', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      const loaded = loadLocale()
      expect(loaded).toBeNull()

      localStorage.getItem = originalGetItem
    })
  })
})
