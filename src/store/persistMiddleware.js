import { STORAGE_KEYS, localStore } from '@/core/storage';

export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const type = String(action.type);

  if (type.startsWith('cart/')) {
    localStore.set(STORAGE_KEYS.CART, store.getState().cart.items);
  }
  if (type.startsWith('filters/')) {
    const filters = { ...store.getState().filters };
    delete filters.page;
    localStore.set(STORAGE_KEYS.FILTERS, filters);
  }

  return result;
};
