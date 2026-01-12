# CV Generator

A CV/Resume generator built with Next.js, React, TypeScript, and Tailwind CSS. Vibe coded for fun.

## Features

- Personal information with photo upload
- Professional summary
- Work experience
- Education
- Skills with proficiency levels
- Projects
- Certifications
- Languages (CEFR levels A1-C2)
- Real-time preview
- Print/PDF export
- Auto-save to localStorage
- JSON export/import
- Image compression (~200KB)
- Multi-language UI (English, Polish)
- Form validation with Zod

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Available Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Coverage report
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── cv-editor/         # Editor section components
│   ├── cv-preview/        # CV preview component
│   ├── form/              # Reusable form components
│   ├── ui/                # Base UI components
│   └── layout/            # Layout components
├── context/               # React Context for state management
├── i18n/                  # Internationalization
├── lib/
│   ├── hooks/             # Custom React hooks
│   ├── storage.ts         # localStorage utilities
│   ├── validation.ts      # Zod validation schemas
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- next-intl
- Zod
- Vitest
- Testing Library

## Development

### Adding New Sections

1. Create type definition in `src/types/cv.ts`
2. Add Zod validation schema in `src/lib/validation.ts`
3. Update CVContext in `src/context/CVContext.tsx`
4. Create editor component in `src/components/cv-editor/`
5. Update preview in `src/components/cv-preview/CVPreview.tsx`
6. Add translations in `src/i18n/locales/`
7. Register section in `src/app/page.tsx`

### Adding New Languages

1. Create locale file in `src/i18n/locales/` (e.g., `fr.json`)
2. Copy structure from `en.json` and translate
3. Add locale to `locales` array in `src/i18n/config.ts`
4. Add language name to `localeNames` object

## License

MIT
