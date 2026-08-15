import LocalStorageAdapter from './LocalStorageAdapter.js';
import CookieAdapter from './CookieAdapter.js';
import MemoryStorageAdapter from './MemoryStorageAdapter.js';

export { default as StorageAdapter } from './StorageAdapter.js';
export { LocalStorageAdapter, CookieAdapter, MemoryStorageAdapter };

/**
 * Готовые синглтоны хранилищ.
 * Если localStorage недоступен — прозрачно подменяем его памятью.
 * Остальному коду всё равно: интерфейс одинаковый (полиморфизм).
 */
export const localStore = LocalStorageAdapter.isAvailable()
  ? new LocalStorageAdapter('bookstore')
  : new MemoryStorageAdapter('bookstore');

export const cookieStore = CookieAdapter.isAvailable()
  ? new CookieAdapter('bookstore', 7)
  : new MemoryStorageAdapter('bookstore');

/** Ключи хранилища собраны в одном месте, чтобы не было опечаток. */
export const STORAGE_KEYS = {
  CART: 'cart',
  THEME: 'theme',
  SESSION: 'session',
  RECENT: 'recent',
  FILTERS: 'filters',
};
