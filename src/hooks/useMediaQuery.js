import { useEffect, useState } from 'react';

/**
 * useMediaQuery — подписка на CSS media query из JS.
 * Нужен для адаптивности: на мобильном фильтры показываем в выдвижной панели.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia?.(query).matches ?? false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
