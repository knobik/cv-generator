import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { TestProviders, MinimalProviders } from './Providers'

/**
 * Custom render function that wraps components with necessary providers
 * @param ui - Component to render
 * @param options - Render options
 * @returns Render result
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options })
}

/**
 * Render function without context providers
 * Use for pure components that don't need context
 */
export function renderMinimal(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: MinimalProviders, ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
