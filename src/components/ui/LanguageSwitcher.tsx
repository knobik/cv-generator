'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { locales, Locale, localeNames } from '@/i18n/config';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc as Locale)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            locale === loc ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={`Switch to ${localeNames[loc]}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
