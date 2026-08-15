import { useEffect, useState } from 'react';

/**
 * useDebounce — откладывает обновление значения.
 * Нужен для поля поиска: перефильтровываем каталог не на каждую букву,
 * а через 300 мс после того, как пользователь перестал печатать.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Функция очистки: отменяет предыдущий таймер при каждом новом вводе.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
