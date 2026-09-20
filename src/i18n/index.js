import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { cookieStore, STORAGE_KEYS } from '@/core/storage';
import env from '@/config/env.js';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.some((l) => l.code === env.defaultLocale)
  ? env.defaultLocale
  : 'ru';

function detectLanguage() {
  const saved = cookieStore.get(STORAGE_KEYS.LANGUAGE, null);
  if (SUPPORTED_LANGUAGES.some((l) => l.code === saved)) return saved;

  const browser = typeof navigator === 'undefined' ? '' : navigator.language.slice(0, 2);
  if (SUPPORTED_LANGUAGES.some((l) => l.code === browser)) return browser;

  return DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: { ru: { translation: ru }, en: { translation: en } },
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on('languageChanged', (language) => {
  cookieStore.set(STORAGE_KEYS.LANGUAGE, language, 365);
  if (typeof document !== 'undefined') document.documentElement.lang = language;
});

export default i18n;
