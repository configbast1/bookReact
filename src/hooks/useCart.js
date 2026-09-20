import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

const PROMO_CODES = {
  BOOK10: 10,
  READMORE: 15,
  STUDENT: 20,
};

export default function useCart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();

  const items = useSelector(selectCartModels);
  const totals = useSelector(selectCartTotals);
  const count = useSelector(selectCartCount);
  const promo = useSelector(selectPromo);

  const add = useCallback(
    (book, quantity = 1) => {
      if (!book.inStock) {
        toast.error(t('cartToast.outOfStock', { title: book.title }));
        return;
      }

      dispatch(addToCart({ bookId: book.id, quantity }));
      toast.success(t('cartToast.added', { title: book.title }));
    },
    [dispatch, toast, t],
  );

  const remove = useCallback((bookId) => dispatch(removeFromCart(bookId)), [dispatch]);

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
        toast.error(t('summary.promoUnknown'));
        return false;
      }

      dispatch(applyPromo({ code: normalized, percent }));
      toast.success(t('summary.promoApplied', { code: normalized, percent }));
      return true;
    },
    [dispatch, toast, t],
  );

  const has = useCallback((bookId) => items.some((item) => item.book.id === bookId), [items]);

  const quantityOf = useCallback(
    (bookId) => items.find((item) => item.book.id === bookId)?.quantity ?? 0,
    [items],
  );

  return {
    items,
    totals,
    count,
    promo,
    add,
    remove,
    setQty,
    clear,
    applyPromoCode,
    has,
    quantityOf,
  };
}
