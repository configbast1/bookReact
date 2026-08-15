import { STORAGE_KEYS, localStore } from '@/core/storage';

/**
 * Собственный middleware Redux.
 * После каждого экшена сохраняет корзину и фильтры в localStorage.
 * Это ответ на требование "збереження даних (localStorage)".
 */
export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const type = String(action.type);

  if (type.startsWith('cart/')) {
    localStore.set(STORAGE_KEYS.CART, store.getState().cart.items);
  }
  if (type.startsWith('filters/')) {
    // eslint-disable-next-line no-unused-vars
    const { page, ...rest } = store.getState().filters; // страницу не сохраняем
    localStore.set(STORAGE_KEYS.FILTERS, rest);
  }

  return result;
};
