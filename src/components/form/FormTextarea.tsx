import React from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxChars?: number;
}

export function FormTextarea({
  label,
  error,
  helperText,
  showCharCount,
  maxChars,
  className,
  id,
  value,
  ...props
}: FormTextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {showCharCount && maxChars && (
            <span className="text-xs text-gray-500">
              {charCount}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        id={inputId}
        value={value}
        maxLength={maxChars}
        className={cn(
          'w-full px-3 py-2 border rounded-md shadow-sm text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'resize-y',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}
