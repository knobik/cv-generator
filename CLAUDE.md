# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 CV/Resume generator with real-time preview, drag-and-drop reordering, and export capabilities. Static export deployment to GitHub Pages.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 18, TypeScript 5.7 (strict mode)
- **Styling**: Tailwind CSS 3.4 (no CSS modules)
- **State**: React Context (CVContext for data, LocaleContext for i18n)
- **Validation**: Zod schemas
- **i18n**: next-intl (English + Polish)
- **Testing**: Vitest + Testing Library

## Commands

```bash
npm run dev              # Development server (port 3000)
npm run build            # Production build (static export to ./out)
npm test                 # Run all tests in watch mode
npm test -- --run        # Run all tests once
npm test -- path/to/file # Run single test file
npm run test:coverage    # Coverage report (80%+ threshold required)
npm run lint             # ESLint
npm run format           # Prettier format all files
```

## Architecture

### State Management
- `CVContext` (`src/context/CVContext.tsx`) is the central data store for all CV data
- Uses debounced auto-save (2 second delay) to localStorage
- Each CV section has add/update/remove/reorder operations
- `LocaleContext` handles i18n state

### Data Flow
1. User edits in cv-editor components
2. Components call CVContext methods (e.g., `updatePersonalInfo`)
3. CVContext updates state and triggers debounced save
4. CVPreview components read from CVContext and render

### Key Patterns
- All entities use string `id` fields (generate with `crypto.randomUUID()`)
- Zod schemas in `src/lib/validation.ts` define validation rules
- `EMPTY_CV_DATA` constant in `src/types/cv.ts` provides default state
- Path alias: `@/*` maps to `./src/*`

## Coding Conventions

### Components
- Use `'use client'` directive for client components
- Define Props interface above component
- Tailwind CSS classes only (use `clsx` and `tailwind-merge`)
- Print-specific styles with `print:` prefix

### Testing
- Use custom render from `src/test/utils/render.tsx`
- Use test data factory from `src/test/utils/testData.ts`
- `renderWithProviders()` for components needing context
- `renderMinimal()` for pure components

### i18n
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

## Adding New Languages (i18n)

1. Create locale file in `src/i18n/locales/` (e.g., `fr.json`)
2. Copy structure from `en.json` and translate
3. Add locale to `locales` array in `src/i18n/config.ts`
4. Add language name to `localeNames` object

## Code Quality Guidelines

**Before making changes:**
- Read related files to understand context and implications
- Verify that referenced files, functions, and patterns actually exist
- Check existing tests and understand testing patterns

**Best practices:**
- Add general comments describing function purpose for readability
- Follow DRY and functional approaches
- Maintain consistency with existing code style and patterns
- Do not blindly accept suggestions that go against best practices
