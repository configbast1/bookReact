import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addToCart,
  removeFromCart,
  setQuantity,
  clearCart,
  applyPromo,
  selectCartModels,
  selectCartTotals,
  selectCartCount,
  selectPromo,
} from '@/store';
import { useToast } from '@/context/ToastContext.jsx';

/** Промокоды магазина (в реальном проекте пришли бы с сервера). */
const PROMO_CODES = {
  BOOK10: 10,
  READMORE: 15,
  STUDENT: 20,
};

/**
 * useCart — фасад над Redux-корзиной.
 * Компоненты не знают про dispatch и названия экшенов —
 * они просто вызывают add(book) / setQty(id, n).
 */
export default function useCart() {
  const dispatch = useDispatch();
  const toast = useToast();

  const items = useSelector(selectCartModels);
  const totals = useSelector(selectCartTotals);
  const count = useSelector(selectCartCount);
  const promo = useSelector(selectPromo);

  const add = useCallback(
    (book, quantity = 1) => {
      if (!book.inStock) {
        toast.error(`«${book.title}» немає в наявності`);
        return;
      }
      dispatch(addToCart({ bookId: book.id, quantity }));
      toast.success(`«${book.title}» додано до кошика`);
    },
    [dispatch, toast],
  );

  const remove = useCallback(
    (bookId) => dispatch(removeFromCart(bookId)),
    [dispatch],
  );

  const setQty = useCallback(
    (bookId, quantity) => dispatch(setQuantity({ bookId, quantity })),
    [dispatch],
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  const applyPromoCode = useCallback(
    (code) => {
      const normalized = String(code).trim().toUpperCase();
      const percent = PROMO_CODES[normalized];
      if (!percent) {
        toast.error('Такого промокоду не існує');
        return false;
      }
      dispatch(applyPromo({ code: normalized, percent }));
      toast.success(`Промокод ${normalized} застосовано: −${percent}%`);
      return true;
    },
    [dispatch, toast],
  );

  const has = useCallback(
    (bookId) => items.some((i) => i.book.id === bookId),
    [items],
  );

  const quantityOf = useCallback(
    (bookId) => items.find((i) => i.book.id === bookId)?.quantity ?? 0,
    [items],
  );

  return { items, totals, count, promo, add, remove, setQty, clear, applyPromoCode, has, quantityOf };
}
