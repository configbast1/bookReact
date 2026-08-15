import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { cookieStore, STORAGE_KEYS } from '@/core/storage';

/**
 * ThemeContext — пример useContext для сквозных данных.
 * Тема нужна почти в каждом компоненте, прокидывать её пропсами
 * через все уровни было бы неудобно (prop drilling).
 * Выбор темы сохраняется в COOKIE (требование "збереження даних: куки").
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = cookieStore.get(STORAGE_KEYS.THEME, null);
    if (saved === 'light' || saved === 'dark') return saved;
    // Если пользователь ничего не выбирал — берём системную тему.
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Побочный эффект: пишем тему в атрибут <html> и в cookie на 365 дней.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    cookieStore.set(STORAGE_KEYS.THEME, theme, 365);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = { children: PropTypes.node };

/** Кастомный хук-обёртка: сразу проверяет, что провайдер есть. */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme має використовуватись всередині <ThemeProvider>');
  return ctx;
}
