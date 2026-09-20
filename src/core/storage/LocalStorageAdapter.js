import StorageAdapter from './StorageAdapter.js';

export default class LocalStorageAdapter extends StorageAdapter {
  static isAvailable() {
    try {
      const probe = '__probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }

  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(this.buildKey(key));
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      window.localStorage.setItem(this.buildKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key) {
    window.localStorage.removeItem(this.buildKey(key));
  }

  clearAll() {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${this.prefix}:`))
      .forEach((k) => window.localStorage.removeItem(k));
  }
}
