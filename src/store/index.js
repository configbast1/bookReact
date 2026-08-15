import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice.js';
import cartReducer from './cartSlice.js';
import filtersReducer from './filtersSlice.js';
import ordersReducer from './ordersSlice.js';
import { persistMiddleware } from './persistMiddleware.js';

/** Глобальное хранилище Redux Toolkit. */
export const store = configureStore({
  reducer: {
    books: booksReducer,
    cart: cartReducer,
    filters: filtersReducer,
    orders: ordersReducer,
  },
  middleware: (getDefault) => getDefault().concat(persistMiddleware),
  devTools: import.meta.env.MODE !== 'production',
});

export * from './booksSlice.js';
export * from './cartSlice.js';
export * from './filtersSlice.js';
export * from './ordersSlice.js';
export * from './selectors.js';
