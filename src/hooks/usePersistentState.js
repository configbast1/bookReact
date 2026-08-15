import { useCallback, useEffect, useState } from 'react';
import { localStore } from '@/core/storage';

/**
 * usePersistentState — useState, который сам сохраняется в localStorage.
 * Используется для «нещодавно переглянутих» книг и мелких настроек UI.
 */
export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => localStore.get(key, initialValue));

  useEffect(() => {
    localStore.set(key, value);
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
