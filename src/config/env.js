const raw = import.meta.env ?? {};

function text(key, fallback) {
  const value = raw[key];
  return value === undefined || value === '' ? fallback : String(value);
}

function number(key, fallback) {
  const value = Number(raw[key]);
  return Number.isFinite(value) ? value : fallback;
}

export const env = {
  appName: text('VITE_APP_NAME', 'Bookstore'),
  apiUrl: text('VITE_API_URL', '/api'),
  apiTimeout: number('VITE_API_TIMEOUT', 5000),
  aboutMeUrl: text('VITE_ABOUT_ME_URL', '/api/about_me'),
  defaultLocale: text('VITE_DEFAULT_LOCALE', 'ru'),
  freeShippingFrom: number('VITE_FREE_SHIPPING_FROM', 700),
  currency: text('VITE_CURRENCY', 'UAH'),
  supportEmail: text('VITE_SUPPORT_EMAIL', 'support@bookstore.local'),
  isProduction: raw.MODE === 'production',
};

export const CURRENCY_SIGNS = { UAH: '₴', USD: '$', EUR: '€', PLN: 'zł' };

export const currencySign = CURRENCY_SIGNS[env.currency] ?? env.currency;

export default env;
