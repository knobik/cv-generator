import type { Metadata } from 'next';
import { CVProvider } from '@/context/CVContext';
import { LocaleProvider } from '@/context/LocaleContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Generator',
  description: 'Create professional CVs with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CVProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </CVProvider>
      </body>
    </html>
  );
}
