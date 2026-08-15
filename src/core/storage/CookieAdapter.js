import StorageAdapter from './StorageAdapter.js';

/**
 * Хранение в cookie: токен сессии и выбранная тема.
 * Cookie отличаются от localStorage сроком жизни и тем,
 * что автоматически отправляются на сервер вместе с запросом.
 */
export default class CookieAdapter extends StorageAdapter {
  constructor(prefix = 'bs', defaultDays = 7) {
    super(prefix);
    this.defaultDays = defaultDays;
  }

  static isAvailable() {
    return typeof document !== 'undefined' && navigator.cookieEnabled;
  }

  get(key, fallback = null) {
    const name = `${this.buildKey(key)}=`;
    const found = document.cookie
      .split('; ')
      .find((part) => part.startsWith(name));
    if (!found) return fallback;
    try {
      return JSON.parse(decodeURIComponent(found.slice(name.length)));
    } catch {
      return fallback;
    }
  }

  set(key, value, days = this.defaultDays) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const encoded = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${this.buildKey(key)}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
    return true;
  }

  remove(key) {
    document.cookie = `${this.buildKey(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
