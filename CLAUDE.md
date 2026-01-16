# CV Generator - Project Guidelines

## Project Overview

A Next.js 15 CV/Resume generator with real-time preview, drag-and-drop reordering, and export capabilities. Static export deployment to GitHub Pages.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript 5.7 (strict mode)
- **Styling**: Tailwind CSS 3.4 (no CSS modules)
- **State**: React Context (CVContext for data, LocaleContext for i18n)
- **Validation**: Zod schemas
- **i18n**: next-intl (English + Polish)
- **Testing**: Vitest + Testing Library (96%+ coverage)

## Commands

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build (static export to ./out)
npm test             # Run all tests
npm run test:coverage # Coverage report (maintain 80%+ threshold)
npm run lint         # ESLint
```

## Directory Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── cv-editor/    # Form sections (PersonalInfoSection, WorkExperienceSection, etc.)
│   ├── cv-preview/   # CV display and print/export components
│   ├── form/         # Reusable form components (FormInput, FormSelect, etc.)
│   ├── ui/           # Base UI components (Button, Card, Modal, etc.)
│   └── layout/       # Layout components (Header)
├── context/          # React contexts (CVContext, LocaleContext)
├── lib/
│   ├── hooks/        # Custom hooks (useCVData, useDragReorder, useImageUpload)
│   ├── validation.ts # Zod schemas
│   ├── storage.ts    # localStorage utilities
│   └── utils.ts      # Helper functions
├── types/cv.ts       # TypeScript interfaces
├── i18n/locales/     # Translation files (en.json, pl.json)
└── test/             # Test setup, mocks, and utilities
```

## Coding Conventions

### Components
- Use `'use client'` directive for client components
- Define Props interface above component
- Use functional component syntax
- Keep components focused and small

### State Management
- Use CVContext for all CV data operations
- Debounced auto-save to localStorage
- No Redux needed - Context is sufficient

### Styling
- Tailwind CSS classes only (use `clsx` and `tailwind-merge`)
- Print-specific styles with `print:` prefix
- Responsive: `sm:`, `lg:` breakpoints

### Validation
- Define Zod schemas in `src/lib/validation.ts`
- Use `safeParse` for error handling

### TypeScript
- Strict mode enabled - always type parameters and returns
- Path alias: `@/*` maps to `./src/*`

## Testing

- Always run tests before committing
- Use custom render from `src/test/utils/render.tsx`
- Use test data factory from `src/test/utils/testData.ts`
- Follow Arrange-Act-Assert pattern
- Maintain 80%+ coverage threshold

## i18n

- Translations in `src/i18n/locales/{en,pl}.json`
- Always update both locale files when adding UI text
- Use `useTranslations` hook from `next-intl`

## Adding New CV Sections

1. Add types to `src/types/cv.ts`
2. Add Zod schema to `src/lib/validation.ts`
3. Create editor component in `src/components/cv-editor/`
4. Update CVPreview in `src/components/cv-preview/`
5. Add context operations in `src/context/CVContext.tsx`
6. Update translations in both locale files
7. Add tests for new functionality

## Code Quality and Accuracy Guidelines

**CRITICAL: Always use deliberate thinking before making changes**
- Before modifying any code, take time to understand the full context and implications
- Analyze the existing codebase structure, patterns, and conventions
- Consider edge cases and potential side effects of changes
- Verify your understanding by examining related files and dependencies

**Minimize Hallucinations**
- NEVER assume file contents, function signatures, or variable names without first reading the actual code
- ALWAYS verify that referenced files, directories, and code patterns actually exist in the codebase
- Use Read, Glob, and Grep tools extensively to confirm code structure before making changes
- When uncertain about syntax or patterns, examine existing similar code in the project

**Thorough Analysis Required**
- Read multiple related files to understand the complete context before making changes
- Examine import statements, dependencies, and usage patterns
- Check for existing tests and understand testing patterns before adding new functionality
- Review configuration files and environment setup to understand project constraints

**Best Practices Enforcement**
- When adding new blocks of code make sure to add general comments describing it's function so that it's readable for humans as well as for LLMs
- When commenting focus on bigger picture and functional/contextual aspect of the change, no need for obvious comments
- Follow all the idustry standard coding pattern when programming with emphases on DRY and functional approaches
- Follow the existing code style and patterns found in the project
- Maintain consistency with naming conventions, file organization, and architectural patterns
- Ensure all changes are backward compatible unless explicitly requested otherwise
- Add appropriate error handling and validation following project patterns

**Verification Steps**
- After making changes, use available tools to verify the modification is correct
- Check for syntax errors, import issues, and type mismatches
- Ensure changes don't break existing functionality
- Test changes where possible using project-specific testing approaches

**Response Methodology**
- Take additional time to provide accurate, well-reasoned responses
- Explain the reasoning behind code changes when they involve complex logic
- Acknowledge when you need to research or verify information before proceeding
- Ask clarifying questions when requirements are ambiguous rather than making assumptions
- Do not blindly accept what user is suggesting if it's against known best practices or just straight bad