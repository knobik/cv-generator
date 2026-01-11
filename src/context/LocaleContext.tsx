'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, defaultLocale, locales } from '@/i18n/config';
import { saveLocale, loadLocale } from '@/lib/storage';
import { useCVContext } from './CVContext';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, any> | null>(null);
  const { cvData, updateLocale: updateCVLocale } = useCVContext();
  const [isLoading, setIsLoading] = useState(true);

  // Load translation messages for a locale
  const loadMessages = useCallback(async (loc: Locale) => {
    try {
      const messages = await import(`@/i18n/locales/${loc}.json`);
      setMessages(messages.default);
    } catch (error) {
      console.error(`Failed to load messages for locale ${loc}:`, error);
      // Fallback to default locale messages
      if (loc !== defaultLocale) {
        try {
          const fallbackMessages = await import(`@/i18n/locales/${defaultLocale}.json`);
          setMessages(fallbackMessages.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback messages:', fallbackError);
          setMessages({});
        }
      } else {
        setMessages({});
      }
    }
  }, []);

  // Load locale from localStorage or CV metadata on mount
  useEffect(() => {
    const initLocale = async () => {
      try {
        const savedLocale = loadLocale();
        const cvLocale = cvData.metadata.locale;

        // Priority: CV metadata > localStorage > default
        const initialLocale = cvLocale && locales.includes(cvLocale as Locale)
          ? (cvLocale as Locale)
          : savedLocale && locales.includes(savedLocale as Locale)
          ? (savedLocale as Locale)
          : defaultLocale;

        setLocaleState(initialLocale);
        await loadMessages(initialLocale);
      } catch (error) {
        console.error('Failed to initialize locale:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLocale();
  }, [cvData.metadata.locale, loadMessages]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
    loadMessages(newLocale);

    // Update CV metadata with new locale
    // This will trigger CVContext to auto-save
    if (cvData.metadata.locale !== newLocale) {
      updateCVLocale(newLocale);
    }
  }, [cvData.metadata.locale, updateCVLocale]);

  const value: LocaleContextType = {
    locale,
    setLocale,
  };

  // Don't render until messages are loaded
  if (isLoading || !messages) {
    return null;
  }

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
