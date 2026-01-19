'use client';

import React from 'react';
import {
  MDXEditor,
  listsPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  UndoRedo,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
  id?: string;
}

/**
 * WYSIWYG Markdown editor using MDXEditor.
 * Provides rich text editing with toolbar for formatting.
 */
export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  className,
  id,
}: MarkdownEditorProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={cn(
          'mdx-editor-wrapper border rounded-md overflow-hidden [&_.mdxeditor]:font-sans',
          '[&_.mdxeditor-toolbar]:border-b [&_.mdxeditor-toolbar]:border-gray-200 [&_.mdxeditor-toolbar]:bg-gray-50',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-1',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-1',
          '[&_li]:text-gray-900',
          '[&_p]:my-1 [&_p]:text-gray-900',
          error ? 'border-red-300' : 'border-gray-300'
        )}
      >
        <MDXEditor
          markdown={value}
          onChange={(val) => onChange(val || '')}
          placeholder={placeholder}
          contentEditableClassName="min-h-[150px] px-3 py-2 focus:outline-none text-sm text-gray-900"
          plugins={[
            listsPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle options={['bullet', 'number']} />
                </>
              ),
            }),
          ]}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}
