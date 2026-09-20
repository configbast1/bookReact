import LocalStorageAdapter from './LocalStorageAdapter.js';
import CookieAdapter from './CookieAdapter.js';
import MemoryStorageAdapter from './MemoryStorageAdapter.js';

export { default as StorageAdapter } from './StorageAdapter.js';
export { LocalStorageAdapter, CookieAdapter, MemoryStorageAdapter };

export const localStore = LocalStorageAdapter.isAvailable()
  ? new LocalStorageAdapter('bookstore')
  : new MemoryStorageAdapter('bookstore');

export const cookieStore = CookieAdapter.isAvailable()
  ? new CookieAdapter('bookstore', 7)
  : new MemoryStorageAdapter('bookstore');

export const STORAGE_KEYS = {
  CART: 'cart',
  THEME: 'theme',
  SESSION: 'session',
  RECENT: 'recent',
  FILTERS: 'filters',
  LANGUAGE: 'language',
  FAVORITES: 'favorites',
  REVIEWS: 'reviews',
};
