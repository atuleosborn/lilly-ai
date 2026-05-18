/**
 * useLocalStorage — Persistent state with auto-sync
 * Safely persists and syncs React state to localStorage
 */

import { useEffect, useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      console.warn(`[useLocalStorage] Failed to parse key "${key}"`);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`[useLocalStorage] Failed to set "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
