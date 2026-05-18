/**
 * useAsync — Handle async operations cleanly
 * Returns status (idle | loading | success | error) and data
 */

import { useEffect, useState, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const response = await asyncFunction();
      if (isMountedRef.current) {
        setState({ status: 'success', data: response, error: null });
      }
      return response;
    } catch (error) {
      if (isMountedRef.current) {
        setState({ status: 'error', data: null, error: error as Error });
      }
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    isMountedRef.current = true;
    if (immediate) {
      execute();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, dependencies);

  return { ...state, execute };
}
