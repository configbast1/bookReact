import { useCallback, useEffect, useState } from 'react';
import { localStore } from '@/core/storage';

export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => localStore.get(key, initialValue));

  useEffect(() => {
    localStore.set(key, value);
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
