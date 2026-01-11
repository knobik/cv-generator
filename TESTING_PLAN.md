# CV Generator - Unit Testing Plan

## Document Purpose
This document outlines a comprehensive unit testing strategy for the CV Generator project. It serves as a roadmap for implementing tests across all functionality, ensuring code quality, reliability, and maintainability.

**Last Updated:** 2026-01-11
**Project:** CV Generator (Next.js 15 + React 18 + TypeScript)
**Current Testing Status:** No tests exist
**Target Coverage:** 80%+ code coverage

---

## Table of Contents
1. [Testing Stack & Setup](#testing-stack--setup)
2. [Testing Priorities](#testing-priorities)
3. [Detailed Testing Plan by Category](#detailed-testing-plan-by-category)
4. [Test Coverage Goals](#test-coverage-goals)
5. [Implementation Roadmap](#implementation-roadmap)

---

## Testing Stack & Setup

### Recommended Testing Tools

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "@types/jest": "^29.5.0",
    "happy-dom": "^12.0.0"
  }
}
```

### Initial Setup Tasks
- [ ] Install testing dependencies
- [ ] Configure Vitest (vitest.config.ts)
- [ ] Set up test utilities and mocks
- [ ] Configure coverage reporting
- [ ] Add test scripts to package.json
- [ ] Set up CI/CD test integration (if applicable)

---

## Testing Priorities

### Priority 1: Critical Business Logic (Start Here)
1. **Validation Layer** (`src/lib/validation.ts`) - 100% coverage required
2. **Storage Functions** (`src/lib/storage.ts`) - 100% coverage required
3. **Utility Functions** (`src/lib/utils.ts`) - 100% coverage required
4. **CVContext** (`src/context/CVContext.tsx`) - 95%+ coverage required

### Priority 2: Core Functionality
5. **Custom Hooks** (`src/lib/hooks/`)
6. **LocaleContext** (`src/context/LocaleContext.tsx`)
7. **Image Upload** (`src/components/form/ImageUpload.tsx`)

### Priority 3: UI Components
8. **Form Components** (`src/components/form/`)
9. **UI Components** (`src/components/ui/`)
10. **CV Editor Sections** (`src/components/cv-editor/`)

### Priority 4: Integration & Preview
11. **Preview Components** (`src/components/cv-preview/`)
12. **Layout Components** (`src/components/layout/`)

---

## Detailed Testing Plan by Category

### 1. Validation Layer (`src/lib/validation.ts`)

**Coverage Target:** 100%

#### Test Suites

##### 1.1 Email Validation
```typescript
describe('validateEmail', () => {
  // Valid emails
  test('should accept valid email addresses')
  test('should accept empty string')

  // Invalid emails
  test('should reject invalid email formats')
  test('should reject emails without @')
  test('should reject emails without domain')
})
```

##### 1.2 URL Validation
```typescript
describe('validateUrl', () => {
  // Valid URLs
  test('should accept valid HTTP URLs')
  test('should accept valid HTTPS URLs')
  test('should accept empty string')

  // Invalid URLs
  test('should reject malformed URLs')
  test('should reject URLs without protocol')
})
```

##### 1.3 Personal Info Schema
```typescript
describe('personalInfoSchema', () => {
  test('should validate complete personal info')
  test('should accept optional fields as undefined')
  test('should validate email format')
  test('should validate social media URLs')
  test('should reject invalid phone numbers')
})
```

##### 1.4 Professional Summary Schema
```typescript
describe('professionalSummarySchema', () => {
  test('should validate summary text')
  test('should accept empty summary')
})
```

##### 1.5 Work Experience Schema
```typescript
describe('workExperienceSchema', () => {
  test('should validate complete work experience')
  test('should require jobTitle, company, location')
  test('should validate date formats')
  test('should accept current position (endDate: null)')
  test('should validate achievements array')
  test('should validate responsibilities array')
})
```

##### 1.6 Education Schema
```typescript
describe('educationSchema', () => {
  test('should validate complete education entry')
  test('should require degree, institution, location')
  test('should validate date formats')
  test('should validate GPA format')
  test('should validate description array')
})
```

##### 1.7 Skill Category Schema
```typescript
describe('skillCategorySchema', () => {
  test('should validate skill category with skills')
  test('should require category name')
  test('should validate skills array')
  test('should reject empty skills array')
})
```

##### 1.8 Project Schema
```typescript
describe('projectSchema', () => {
  test('should validate complete project')
  test('should require name')
  test('should validate URL format')
  test('should validate technologies array')
  test('should validate highlights array')
})
```

##### 1.9 Certification Schema
```typescript
describe('certificationSchema', () => {
  test('should validate complete certification')
  test('should require name, issuer, date')
  test('should validate date format')
  test('should validate credential URL')
})
```

##### 1.10 Language Schema
```typescript
describe('languageSchema', () => {
  test('should validate language with proficiency')
  test('should require language name')
  test('should validate proficiency enum values')
  test('should reject invalid proficiency levels')
})
```

##### 1.11 Complete CV Data Schema
```typescript
describe('cvDataSchema', () => {
  test('should validate complete CV data structure')
  test('should validate all nested sections')
  test('should require metadata fields')
  test('should validate lastModified date')
})
```

##### 1.12 Validation Helper Functions
```typescript
describe('validatePersonalInfo', () => {
  test('should return success for valid data')
  test('should return error for invalid data')
  test('should include error messages')
})

describe('validateCVData', () => {
  test('should validate complete CV')
  test('should catch nested validation errors')
})
```

**Estimated Test Count:** ~50 tests

---

### 2. Storage Functions (`src/lib/storage.ts`)

**Coverage Target:** 100%

#### Test Suites

##### 2.1 Save CV Data
```typescript
describe('saveCVData', () => {
  beforeEach(() => localStorage.clear())

  test('should save CV data to localStorage')
  test('should update lastModified timestamp')
  test('should stringify data correctly')
  test('should handle quota exceeded error')
  test('should throw StorageError on failure')
})
```

##### 2.2 Load CV Data
```typescript
describe('loadCVData', () => {
  test('should load valid CV data from localStorage')
  test('should return null if no data exists')
  test('should return null for invalid JSON')
  test('should return null for invalid CV schema')
  test('should validate loaded data with Zod')
})
```

##### 2.3 Clear CV Data
```typescript
describe('clearCVData', () => {
  test('should remove CV data from localStorage')
  test('should not throw if no data exists')
})
```

##### 2.4 Export CV Data
```typescript
describe('exportCVData', () => {
  test('should export CV as formatted JSON string')
  test('should include all CV fields')
  test('should use 2-space indentation')
})
```

##### 2.5 Import CV Data
```typescript
describe('importCVData', () => {
  test('should import valid JSON string')
  test('should validate imported data')
  test('should throw on invalid JSON')
  test('should throw on invalid CV schema')
  test('should throw StorageError with message')
})
```

##### 2.6 Storage Size Utilities
```typescript
describe('getStorageSize', () => {
  test('should calculate storage size in bytes')
  test('should return 0 for empty storage')
})

describe('formatBytes', () => {
  test('should format bytes to human-readable string')
  test('should handle 0 bytes')
  test('should format KB correctly')
  test('should format MB correctly')
  test('should use 2 decimal places')
})
```

##### 2.7 Storage Availability
```typescript
describe('isStorageAvailable', () => {
  test('should return true if localStorage is available')
  test('should return false if localStorage is unavailable')
  test('should handle SecurityError gracefully')
})
```

##### 2.8 Locale Storage
```typescript
describe('saveLocale', () => {
  test('should save locale to localStorage')
  test('should overwrite existing locale')
})

describe('loadLocale', () => {
  test('should load saved locale')
  test('should return null if no locale saved')
})
```

##### 2.9 StorageError Class
```typescript
describe('StorageError', () => {
  test('should create error with message')
  test('should be instance of Error')
  test('should have correct name property')
})
```

**Estimated Test Count:** ~30 tests

---

### 3. Utility Functions (`src/lib/utils.ts`)

**Coverage Target:** 100%

#### Test Suites

##### 3.1 Class Name Merger
```typescript
describe('cn', () => {
  test('should merge class names')
  test('should handle Tailwind conflicts')
  test('should remove duplicate classes')
  test('should handle conditional classes')
  test('should handle undefined/null values')
})
```

##### 3.2 ID Generation
```typescript
describe('generateId', () => {
  test('should generate unique IDs')
  test('should not generate duplicate IDs in sequence')
  test('should include timestamp and random string')
  test('should generate IDs of consistent format')
})
```

##### 3.3 Date Formatting
```typescript
describe('formatDate', () => {
  test('should format date as MM/YYYY')
  test('should handle Date objects')
  test('should handle date strings')
  test('should pad single-digit months')
})

describe('formatDateRange', () => {
  test('should format date range with start and end')
  test('should show "Present" for null end date')
  test('should handle same month/year range')
  test('should format correctly for different years')
})
```

##### 3.4 Text Utilities
```typescript
describe('truncate', () => {
  test('should truncate text longer than max length')
  test('should not truncate shorter text')
  test('should add ellipsis to truncated text')
  test('should handle exact length match')
})

describe('isEmpty', () => {
  test('should return true for null')
  test('should return true for undefined')
  test('should return true for empty string')
  test('should return true for empty array')
  test('should return false for non-empty values')
  test('should return false for 0')
  test('should return false for false boolean')
})
```

**Estimated Test Count:** ~25 tests

---

### 4. CVContext (`src/context/CVContext.tsx`)

**Coverage Target:** 95%+

#### Test Suites

##### 4.1 Context Initialization
```typescript
describe('CVProvider', () => {
  test('should initialize with empty CV data')
  test('should load data from localStorage on mount')
  test('should provide CV data to children')
})
```

##### 4.2 Personal Info Updates
```typescript
describe('updatePersonalInfo', () => {
  test('should update personal info fields')
  test('should merge partial updates')
  test('should trigger auto-save')
  test('should maintain other CV data')
})
```

##### 4.3 Professional Summary Updates
```typescript
describe('updateProfessionalSummary', () => {
  test('should update summary text')
  test('should merge partial updates')
  test('should trigger auto-save')
})
```

##### 4.4 Work Experience CRUD
```typescript
describe('Work Experience Operations', () => {
  describe('addWorkExperience', () => {
    test('should add new work experience')
    test('should generate unique ID')
    test('should trigger auto-save')
  })

  describe('updateWorkExperience', () => {
    test('should update existing work experience')
    test('should merge partial updates')
    test('should not affect other entries')
    test('should trigger auto-save')
  })

  describe('removeWorkExperience', () => {
    test('should remove work experience by ID')
    test('should not affect other entries')
    test('should trigger auto-save')
  })
})
```

##### 4.5 Education CRUD
```typescript
describe('Education Operations', () => {
  describe('addEducation', () => {
    test('should add new education entry')
  })

  describe('updateEducation', () => {
    test('should update existing education')
  })

  describe('removeEducation', () => {
    test('should remove education by ID')
  })
})
```

##### 4.6 Skill Category CRUD
```typescript
describe('Skill Category Operations', () => {
  describe('addSkillCategory', () => {
    test('should add new skill category')
  })

  describe('updateSkillCategory', () => {
    test('should update existing skill category')
  })

  describe('removeSkillCategory', () => {
    test('should remove skill category by ID')
  })
})
```

##### 4.7 Projects CRUD
```typescript
describe('Project Operations', () => {
  describe('addProject', () => {
    test('should add new project')
  })

  describe('updateProject', () => {
    test('should update existing project')
  })

  describe('removeProject', () => {
    test('should remove project by ID')
  })
})
```

##### 4.8 Certifications CRUD
```typescript
describe('Certification Operations', () => {
  describe('addCertification', () => {
    test('should add new certification')
  })

  describe('updateCertification', () => {
    test('should update existing certification')
  })

  describe('removeCertification', () => {
    test('should remove certification by ID')
  })
})
```

##### 4.9 Languages CRUD
```typescript
describe('Language Operations', () => {
  describe('addLanguage', () => {
    test('should add new language')
  })

  describe('updateLanguage', () => {
    test('should update existing language')
  })

  describe('removeLanguage', () => {
    test('should remove language by ID')
  })
})
```

##### 4.10 Global Operations
```typescript
describe('Global Operations', () => {
  describe('updateLocale', () => {
    test('should update CV locale')
    test('should trigger auto-save')
  })

  describe('resetCV', () => {
    test('should reset to empty CV data')
    test('should clear localStorage')
    test('should update lastModified')
  })

  describe('loadCV', () => {
    test('should load CV from localStorage')
    test('should handle missing data gracefully')
  })

  describe('saveCV', () => {
    test('should save CV to localStorage manually')
    test('should update lastModified timestamp')
  })
})
```

##### 4.11 Auto-Save Functionality
```typescript
describe('Auto-Save', () => {
  test('should debounce save operations')
  test('should save after 2-second delay')
  test('should cancel pending save on multiple updates')
  test('should save on component unmount')
})
```

**Estimated Test Count:** ~50 tests

---

### 5. Custom Hooks (`src/lib/hooks/`)

**Coverage Target:** 95%+

#### Test Suites

##### 5.1 useCVData Hook
```typescript
describe('useCVData', () => {
  test('should return CV context value')
  test('should throw error if used outside CVProvider')
  test('should provide access to all context methods')
})
```

##### 5.2 useLocalStorage Hook
```typescript
describe('useLocalStorage', () => {
  test('should initialize with default value')
  test('should load value from localStorage')
  test('should save value to localStorage on update')
  test('should serialize objects to JSON')
  test('should deserialize JSON to objects')
  test('should handle SSR gracefully (no localStorage)')
  test('should handle localStorage errors')
  test('should remove value from localStorage')
  test('should update state on setValue')
})
```

##### 5.3 useImageUpload Hook
```typescript
describe('useImageUpload', () => {
  describe('File Validation', () => {
    test('should accept valid image files (jpg, png, gif)')
    test('should reject non-image files')
    test('should reject files over 5MB')
    test('should set error for invalid file type')
    test('should set error for oversized file')
  })

  describe('Image Compression', () => {
    test('should compress images to target size (200KB)')
    test('should maintain aspect ratio during resize')
    test('should limit max dimensions to 400x400')
    test('should reduce quality for compression')
    test('should handle very large images')
  })

  describe('Base64 Encoding', () => {
    test('should convert image to base64 string')
    test('should include data URL prefix')
    test('should handle compression before encoding')
  })

  describe('State Management', () => {
    test('should set preview URL after upload')
    test('should set isUploading during upload')
    test('should clear preview on clearImage')
    test('should clear error on successful upload')
  })

  describe('Error Handling', () => {
    test('should handle FileReader errors')
    test('should handle canvas rendering errors')
    test('should clear isUploading on error')
  })
})
```

**Estimated Test Count:** ~25 tests

---

### 6. LocaleContext (`src/context/LocaleContext.tsx`)

**Coverage Target:** 90%+

#### Test Suites

```typescript
describe('LocaleContext', () => {
  describe('Initialization', () => {
    test('should initialize with default locale')
    test('should load saved locale from localStorage')
    test('should fall back to default if invalid locale')
  })

  describe('setLocale', () => {
    test('should update locale state')
    test('should save locale to localStorage')
    test('should update messages for new locale')
  })

  describe('Message Loading', () => {
    test('should load English messages')
    test('should load Polish messages')
    test('should handle missing translations gracefully')
  })

  describe('useLocale Hook', () => {
    test('should return locale context')
    test('should throw error outside provider')
  })
})
```

**Estimated Test Count:** ~10 tests

---

### 7. Form Components (`src/components/form/`)

**Coverage Target:** 85%+

#### Test Suites

##### 7.1 FormInput
```typescript
describe('FormInput', () => {
  test('should render input with label')
  test('should display error message when provided')
  test('should display helper text')
  test('should apply error styling on error')
  test('should handle onChange events')
  test('should be disabled when disabled prop is true')
  test('should support different input types')
})
```

##### 7.2 FormTextarea
```typescript
describe('FormTextarea', () => {
  test('should render textarea with label')
  test('should display error message')
  test('should handle onChange events')
  test('should support maxLength')
  test('should display character count if maxLength provided')
})
```

##### 7.3 FormSelect
```typescript
describe('FormSelect', () => {
  test('should render select with options')
  test('should display label')
  test('should handle onChange events')
  test('should show placeholder option')
  test('should display error message')
  test('should be disabled when disabled prop is true')
})
```

##### 7.4 FormDatePicker
```typescript
describe('FormDatePicker', () => {
  test('should render date input')
  test('should handle date changes')
  test('should support "Present" checkbox')
  test('should disable date input when "Present" is checked')
  test('should display error message')
})
```

##### 7.5 FormError
```typescript
describe('FormError', () => {
  test('should display error message')
  test('should render nothing if no error')
  test('should apply error styling')
})
```

##### 7.6 ImageUpload
```typescript
describe('ImageUpload', () => {
  test('should render file input')
  test('should display preview when image is uploaded')
  test('should support drag and drop')
  test('should handle file selection via click')
  test('should display upload button when no image')
  test('should display remove button when image exists')
  test('should show loading state during upload')
  test('should display error message')
  test('should call onUpload callback with base64')
})
```

**Estimated Test Count:** ~35 tests

---

### 8. UI Components (`src/components/ui/`)

**Coverage Target:** 85%+

#### Test Suites

##### 8.1 Button
```typescript
describe('Button', () => {
  test('should render button with text')
  test('should handle onClick events')
  test('should support variant prop (primary, secondary, danger, ghost)')
  test('should support size prop (sm, md, lg)')
  test('should be disabled when disabled prop is true')
  test('should support fullWidth prop')
  test('should render children correctly')
})
```

##### 8.2 Card
```typescript
describe('Card', () => {
  test('should render card with children')
  test('should display header when provided')
  test('should apply correct styling')
  test('should support className prop')
})
```

##### 8.3 Badge
```typescript
describe('Badge', () => {
  test('should render badge with text')
  test('should support variant prop')
  test('should apply correct styling')
})
```

##### 8.4 Modal
```typescript
describe('Modal', () => {
  test('should render modal when isOpen is true')
  test('should not render when isOpen is false')
  test('should call onClose when close button clicked')
  test('should call onClose when backdrop clicked')
  test('should display title')
  test('should render children content')
  test('should prevent body scroll when open')
})
```

##### 8.5 LanguageSwitcher
```typescript
describe('LanguageSwitcher', () => {
  test('should render language options')
  test('should highlight current locale')
  test('should call setLocale on language change')
  test('should display locale names correctly')
})
```

**Estimated Test Count:** ~25 tests

---

### 9. CV Editor Sections (`src/components/cv-editor/`)

**Coverage Target:** 80%+

#### Testing Strategy
For each editor section, test:
- Rendering with empty data
- Rendering with populated data
- Form input handling
- Add/Edit/Remove operations
- Context integration
- Validation display

##### 9.1 PersonalInfoSection
```typescript
describe('PersonalInfoSection', () => {
  test('should render all personal info fields')
  test('should update context on field change')
  test('should display validation errors')
  test('should handle photo upload')
})
```

##### 9.2 ProfessionalSummarySection
```typescript
describe('ProfessionalSummarySection', () => {
  test('should render summary textarea')
  test('should display character count')
  test('should update context on change')
})
```

##### 9.3 WorkExperienceSection
```typescript
describe('WorkExperienceSection', () => {
  test('should render work experience list')
  test('should add new work experience')
  test('should edit existing work experience')
  test('should remove work experience')
  test('should handle "Present" checkbox for current job')
})
```

##### 9.4 EducationSection
```typescript
describe('EducationSection', () => {
  test('should render education list')
  test('should add new education entry')
  test('should edit existing education')
  test('should remove education entry')
})
```

##### 9.5 SkillsSection
```typescript
describe('SkillsSection', () => {
  test('should render skill categories')
  test('should add new skill category')
  test('should edit skill category')
  test('should remove skill category')
  test('should handle multiple skills per category')
})
```

##### 9.6 ProjectsSection
```typescript
describe('ProjectsSection', () => {
  test('should render projects list')
  test('should add new project')
  test('should edit existing project')
  test('should remove project')
})
```

##### 9.7 CertificationsSection
```typescript
describe('CertificationsSection', () => {
  test('should render certifications list')
  test('should add new certification')
  test('should edit certification')
  test('should remove certification')
})
```

##### 9.8 LanguagesSection
```typescript
describe('LanguagesSection', () => {
  test('should render languages list')
  test('should add new language')
  test('should edit language proficiency')
  test('should remove language')
  test('should display proficiency levels correctly')
})
```

**Estimated Test Count:** ~40 tests

---

### 10. Preview Components (`src/components/cv-preview/`)

**Coverage Target:** 75%+

#### Test Suites

##### 10.1 CVPreview
```typescript
describe('CVPreview', () => {
  test('should render complete CV preview')
  test('should display personal info section')
  test('should display professional summary')
  test('should display work experience entries')
  test('should display education entries')
  test('should display skills grouped by category')
  test('should display projects')
  test('should display certifications')
  test('should display languages with proficiency')
  test('should handle empty sections gracefully')
  test('should format dates correctly')
  test('should display "Present" for current positions')
})
```

##### 10.2 PrintPreview
```typescript
describe('PrintPreview', () => {
  test('should render print-optimized layout')
  test('should apply print-specific styling')
  test('should hide non-printable elements')
})
```

**Estimated Test Count:** ~15 tests

---

### 11. Layout Components (`src/components/layout/`)

**Coverage Target:** 70%+

#### Test Suites

```typescript
describe('Header', () => {
  test('should render header component')
  test('should display app title/logo')
  test('should render navigation elements')
  test('should integrate LanguageSwitcher')
})
```

**Estimated Test Count:** ~5 tests

---

## Test Coverage Goals

| Category | Target Coverage | Priority |
|----------|----------------|----------|
| Validation Layer | 100% | Critical |
| Storage Functions | 100% | Critical |
| Utility Functions | 100% | Critical |
| CVContext | 95%+ | High |
| Custom Hooks | 95%+ | High |
| LocaleContext | 90%+ | High |
| Form Components | 85%+ | Medium |
| UI Components | 85%+ | Medium |
| CV Editor Sections | 80%+ | Medium |
| Preview Components | 75%+ | Low |
| Layout Components | 70%+ | Low |
| **Overall Project** | **80%+** | - |

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal:** Set up testing infrastructure and test critical utilities

- [ ] Install testing dependencies
- [ ] Configure Vitest and coverage tools
- [ ] Set up test utilities, mocks, and helpers
- [ ] Test validation layer (50 tests)
- [ ] Test storage functions (30 tests)
- [ ] Test utility functions (25 tests)

**Deliverable:** ~105 tests, ~40% coverage

---

### Phase 2: Core Logic (Week 2)
**Goal:** Test state management and custom hooks

- [ ] Test CVContext (50 tests)
- [ ] Test custom hooks (25 tests)
- [ ] Test LocaleContext (10 tests)

**Deliverable:** ~190 total tests, ~65% coverage

---

### Phase 3: Components (Week 3)
**Goal:** Test form and UI components

- [ ] Test form components (35 tests)
- [ ] Test UI components (25 tests)

**Deliverable:** ~250 total tests, ~75% coverage

---

### Phase 4: Integration (Week 4)
**Goal:** Test editor sections and preview components

- [ ] Test CV editor sections (40 tests)
- [ ] Test preview components (15 tests)
- [ ] Test layout components (5 tests)

**Deliverable:** ~310 total tests, 80%+ coverage

---

### Phase 5: Refinement
**Goal:** Achieve coverage goals and improve test quality

- [ ] Address coverage gaps
- [ ] Add edge case tests
- [ ] Add integration tests
- [ ] Document testing patterns
- [ ] Set up CI/CD integration

**Deliverable:** Production-ready test suite

---

## Testing Best Practices

### General Guidelines
1. **Arrange-Act-Assert Pattern:** Structure all tests with clear setup, execution, and verification
2. **Test Behavior, Not Implementation:** Focus on what components do, not how they do it
3. **Isolation:** Each test should be independent and not rely on others
4. **Descriptive Names:** Use clear, descriptive test names (should/must format)
5. **Mock External Dependencies:** Mock localStorage, fetch, file APIs
6. **Test Edge Cases:** Empty states, null values, boundary conditions

### React Testing Library Principles
- Query by accessibility attributes (role, label, text)
- Avoid querying by implementation details (class names, IDs)
- Test user interactions with `userEvent`
- Wait for async updates with `waitFor`
- Use `screen` for queries

### Coverage Goals
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 85%+
- **Lines:** 80%+

---

## Mock Utilities Needed

### localStorage Mock
```typescript
// src/test/mocks/localStorage.ts
export const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
```

### Context Provider Wrapper
```typescript
// src/test/utils/Providers.tsx
export function TestProviders({ children }) {
  return (
    <CVProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </CVProvider>
  )
}
```

### Custom Render Function
```typescript
// src/test/utils/render.tsx
export function renderWithProviders(ui, options = {}) {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  })
}
```

---

## CI/CD Integration

### Recommended GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Summary

**Total Estimated Tests:** ~310 tests
**Estimated Implementation Time:** 4 weeks
**Target Coverage:** 80%+

This plan provides a comprehensive roadmap for implementing unit tests across the entire CV Generator application. Start with critical business logic (validation, storage, utilities) and progressively add tests for components and integrations.

**Next Steps:**
1. Review and approve this plan
2. Set up testing infrastructure (Phase 1, Day 1)
3. Begin implementing tests according to priority order
4. Monitor coverage and adjust as needed

---

**Document Version:** 1.0
**Created:** 2026-01-11
**For Future Reference:** This plan can be used by future AI sessions or developers to systematically add tests to the codebase.
