# CV Generator

A modern, professional CV/Resume generator built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Currently Implemented
- **Personal Information**: Name, contact details, social links, profile photo upload
- **Professional Summary**: Compelling summary section with character count
- **Work Experience**: Multiple entries with job details, dates, achievements
- **Real-time Preview**: Live CV preview as you type
- **Auto-save**: Automatic saving to browser localStorage (2-second debounce)
- **Export/Import**: Export CV data as JSON and import it back
- **Image Compression**: Automatic photo compression to optimize storage

### Coming Soon
- Education section
- Skills section (categorized)
- Projects/Portfolio section
- Certifications section
- Languages section
- Multiple CV templates
- PDF export functionality
- Responsive mobile design improvements

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with CVProvider
│   └── page.tsx           # Main CV editor page
├── components/
│   ├── cv-editor/         # Editor section components
│   ├── cv-preview/        # CV preview component
│   ├── form/              # Reusable form components
│   ├── ui/                # Base UI components (Button, Card, etc.)
│   └── layout/            # Layout components (Header)
├── context/
│   └── CVContext.tsx      # Global CV state management
├── lib/
│   ├── hooks/             # Custom React hooks
│   ├── storage.ts         # localStorage utilities
│   ├── validation.ts      # Zod validation schemas
│   └── utils.ts           # Utility functions
└── types/
    └── cv.ts              # TypeScript type definitions
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Runtime validation
- **React Context** - State management
- **localStorage** - Data persistence

## Key Features Explained

### Auto-save
Your CV data is automatically saved to browser localStorage 2 seconds after you stop typing. This ensures your work is never lost.

### Data Export/Import
- Click "Export JSON" to download your CV data
- Click "Import JSON" to load previously exported data
- Useful for backing up or transferring CV data

### Image Upload
- Supports drag-and-drop or click to upload
- Automatic compression to ~200KB
- Converts to JPEG for optimal storage
- Maximum upload size: 5MB

### Storage
- All data stored in browser's localStorage
- Current storage usage displayed in header
- Maximum storage: ~5-10MB (browser dependent)

## Development

### Adding New Sections

1. Create type definition in `src/types/cv.ts`
2. Add Zod validation schema in `src/lib/validation.ts`
3. Update CVContext with actions in `src/context/CVContext.tsx`
4. Create editor component in `src/components/cv-editor/`
5. Update preview in `src/components/cv-preview/CVPreview.tsx`
6. Add section to main page in `src/app/page.tsx`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
