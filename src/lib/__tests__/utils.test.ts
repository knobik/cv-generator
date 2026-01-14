import { describe, expect, test, vi } from 'vitest'
import { cn, generateId, formatDate, formatDateRange, truncate, isEmpty } from '../utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    test('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    test('should handle Tailwind conflicts', () => {
      // twMerge should keep the last class when there's a conflict
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })

    test('should remove duplicate classes', () => {
      const result = cn('flex', 'flex')
      expect(result).toBe('flex')
    })

    test('should handle conditional classes', () => {
      const result = cn('base', { active: true, disabled: false })
      expect(result).toContain('base')
      expect(result).toContain('active')
      expect(result).not.toContain('disabled')
    })

    test('should handle undefined/null values', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toBe('class1 class2')
    })

    test('should handle arrays', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    test('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    test('should not generate duplicate IDs in sequence', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateId())
      }
      expect(ids.size).toBe(100)
    })

    test('should include timestamp and random string', () => {
      const id = generateId()
      expect(id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    test('should generate IDs of consistent format', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).toContain('-')
      expect(id2).toContain('-')
    })

    test('should generate IDs with reasonable length', () => {
      const id = generateId()
      expect(id.length).toBeGreaterThan(10)
      expect(id.length).toBeLessThan(30)
    })
  })

  describe('formatDate', () => {
    test('should format date as YYYY.MM', () => {
      const result = formatDate('2021-03-15')
      expect(result).toBe('2021.03')
    })

    test('should handle Date objects', () => {
      const date = new Date('2021-12-25')
      const result = formatDate(date.toISOString())
      expect(result).toBe('2021.12')
    })

    test('should handle date strings', () => {
      expect(formatDate('2020-01-01')).toBe('2020.01')
      expect(formatDate('2023-12-31')).toBe('2023.12')
    })

    test('should pad single-digit months', () => {
      const result = formatDate('2021-05-15')
      expect(result).toBe('2021.05')
    })

    test('should return empty string for null', () => {
      expect(formatDate(null)).toBe('')
    })

    test('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('')
    })

    test('should return empty string for empty string', () => {
      expect(formatDate('')).toBe('')
    })

    test('should handle invalid dates', () => {
      // Note: Invalid dates return 'NaN.NaN' in the current implementation
      // This could be improved to return '' by checking d.getTime()
      const result = formatDate('invalid-date')
      expect(result).toBe('NaN.NaN')
    })
  })

  describe('formatDateRange', () => {
    test('should format date range with start and end', () => {
      const result = formatDateRange('2020-01-01', '2021-12-31', false)
      expect(result).toBe('2020.01 - 2021.12')
    })

    test('should show "Present" for null end date', () => {
      const result = formatDateRange('2020-01-01', null, false)
      expect(result).toBe('2020.01 - Present')
    })

    test('should show "Present" when current is true', () => {
      const result = formatDateRange('2020-01-01', '2021-12-31', true)
      expect(result).toBe('2020.01 - Present')
    })

    test('should handle same month/year range', () => {
      const result = formatDateRange('2021-03-01', '2021-03-31', false)
      expect(result).toBe('2021.03 - 2021.03')
    })

    test('should format correctly for different years', () => {
      const result = formatDateRange('2018-06-01', '2022-08-31', false)
      expect(result).toBe('2018.06 - 2022.08')
    })

    test('should prioritize current flag over endDate', () => {
      // Even if endDate is provided, current=true should show Present
      const result = formatDateRange('2020-01-01', '2021-12-31', true)
      expect(result).toContain('Present')
    })
  })

  describe('truncate', () => {
    test('should truncate text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = truncate(text, 20)
      expect(result.length).toBe(20)
      expect(result).toBe('This is a very lo...')
    })

    test('should not truncate shorter text', () => {
      const text = 'Short text'
      const result = truncate(text, 20)
      expect(result).toBe('Short text')
    })

    test('should add ellipsis to truncated text', () => {
      const text = 'This text will be truncated'
      const result = truncate(text, 15)
      expect(result).toContain('...')
    })

    test('should handle exact length match', () => {
      const text = 'Exactly twenty chars'
      const result = truncate(text, 20)
      expect(result).toBe('Exactly twenty chars')
    })

    test('should handle very short max length', () => {
      const text = 'Hello World'
      const result = truncate(text, 5)
      expect(result).toBe('He...')
      expect(result.length).toBe(5)
    })

    test('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })

    test('should handle text shorter by one character', () => {
      const text = 'Hello'
      const result = truncate(text, 6)
      expect(result).toBe('Hello')
    })
  })

  describe('isEmpty', () => {
    test('should return true for null', () => {
      expect(isEmpty(null)).toBe(true)
    })

    test('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true)
    })

    test('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    test('should return true for whitespace-only string', () => {
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty('\t')).toBe(true)
      expect(isEmpty('\n')).toBe(true)
    })

    test('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })

    test('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false)
    })

    test('should return false for non-empty array', () => {
      expect(isEmpty(['item'])).toBe(false)
    })

    test('should return false for 0', () => {
      expect(isEmpty(0)).toBe(false)
    })

    test('should return false for false boolean', () => {
      expect(isEmpty(false)).toBe(false)
    })

    test('should return false for objects', () => {
      expect(isEmpty({})).toBe(false)
      expect(isEmpty({ key: 'value' })).toBe(false)
    })

    test('should return false for numbers', () => {
      expect(isEmpty(42)).toBe(false)
      expect(isEmpty(-1)).toBe(false)
    })

    test('should trim strings before checking', () => {
      expect(isEmpty('  hello  ')).toBe(false)
    })
  })
})
