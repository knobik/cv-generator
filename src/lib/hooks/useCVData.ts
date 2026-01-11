import { useCVContext } from '@/context/CVContext';

/**
 * Custom hook to access CV context
 * This is a convenience wrapper around useCVContext
 */
export function useCVData() {
  return useCVContext();
}
