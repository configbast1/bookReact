import { createSlice } from '@reduxjs/toolkit';
import { localStore, STORAGE_KEYS } from '@/core/storage';

/**
 * Корзина. В состоянии держим минимум: id книги и количество.
 * Цены и названия берём из каталога — так данные не рассинхронизируются.
 */
const persisted = localStore.get(STORAGE_KEYS.CART, []);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: Array.isArray(persisted) ? persisted : [], // [{ bookId, quantity }]
    promo: null, // { code, percent }
  },
  reducers: {
    addToCart(state, action) {
      const { bookId, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.bookId === bookId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ bookId, quantity });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    setQuantity(state, action) {
      const { bookId, quantity } = action.payload;
      const item = state.items.find((i) => i.bookId === bookId);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.bookId !== bookId);
      } else {
        item.quantity = Math.min(quantity, 99);
      }
    },
    applyPromo(state, action) {
      state.promo = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.promo = null;
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, applyPromo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectPromo = (state) => state.cart.promo;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
