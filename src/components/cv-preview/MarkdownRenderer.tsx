'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content for CV preview using react-markdown.
 * Styles output to match CV design (teal bullets, proper text sizing).
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        components={{
          // Style paragraphs to match CV text
          p: ({ children }) => <p className="em-text-sm text-gray-700 mb-1">{children}</p>,
          // Style unordered lists with teal bullets
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 space-y-1 marker:text-teal-600">
              {children}
            </ul>
          ),
          // Style ordered lists
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 space-y-1 marker:text-teal-600">
              {children}
            </ol>
          ),
          // Style list items
          li: ({ children }) => <li className="em-text-sm text-gray-700">{children}</li>,
          // Style bold text
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          // Style italic text
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
