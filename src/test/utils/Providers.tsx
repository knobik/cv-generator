import React from 'react';
import { CVProvider } from '@/context/CVContext';

/**
 * Test wrapper that provides all necessary context providers
 * Use this for components that need CVContext
 */
export function TestProviders({ children }: { children: React.ReactNode }) {
  return <CVProvider>{children}</CVProvider>;
}

/**
 * Minimal test wrapper for components that don't need context
 */
export function MinimalProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
