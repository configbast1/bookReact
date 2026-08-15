import { createSelector } from '@reduxjs/toolkit';
import { BookFactory, CartItem } from '@/core/models';
import { selectRawBooks } from './booksSlice.js';
import { selectFilters } from './filtersSlice.js';
import { selectCartItems, selectPromo } from './cartSlice.js';

/**
 * Мемоизированные селекторы (reselect внутри Redux Toolkit).
 * Тяжёлые вычисления (фильтрация, сортировка) не повторяются,
 * пока не изменились входные данные.
 */

/** Сырые данные -> массив объектов классов Book/EBook/AudioBook. */
export const selectBookModels = createSelector([selectRawBooks], (raw) =>
  BookFactory.createMany(raw),
);

/** Компараторы сортировки — вынесены отдельно для читаемости. */
const comparators = {
  popular: (a, b) => b.reviewsCount - a.reviewsCount,
  priceAsc: (a, b) => a.getFinalPrice() - b.getFinalPrice(),
  priceDesc: (a, b) => b.getFinalPrice() - a.getFinalPrice(),
  ratingDesc: (a, b) => b.rating - a.rating,
  yearDesc: (a, b) => b.year - a.year,
  titleAsc: (a, b) => a.title.localeCompare(b.title, 'uk'),
};

/** Главный селектор каталога: поиск + фильтры + сортировка. */
export const selectFilteredBooks = createSelector(
  [selectBookModels, selectFilters],
  (books, f) => {
    const query = f.search.trim().toLowerCase();

    const filtered = books.filter((book) => {
      if (query && !book.getSearchIndex().includes(query)) return false;
      if (f.genre !== 'all' && book.genre !== f.genre) return false;
      if (f.formats.length && !f.formats.includes(book.format)) return false;
      const price = book.getFinalPrice();
      if (price < f.priceMin || price > f.priceMax) return false;
      if (book.rating < f.minRating) return false;
      if (f.inStockOnly && !book.inStock) return false;
      if (f.onlyNew && !book.isNew) return false;
      return true;
    });

    return filtered.sort(comparators[f.sort] ?? comparators.popular);
  },
);

/** Страница результатов + метаданные пагинации. */
export const selectPagedBooks = createSelector(
  [selectFilteredBooks, selectFilters],
  (books, f) => {
    const totalPages = Math.max(1, Math.ceil(books.length / f.perPage));
    const page = Math.min(f.page, totalPages);
    const start = (page - 1) * f.perPage;
    return {
      items: books.slice(start, start + f.perPage),
      total: books.length,
      page,
      totalPages,
    };
  },
);

/** Позиции корзины как объекты CartItem (с методами subtotal/savings). */
export const selectCartModels = createSelector(
  [selectBookModels, selectCartItems],
  (books, cart) =>
    cart
      .map(({ bookId, quantity }) => {
        const book = books.find((b) => b.id === bookId);
        return book ? new CartItem(book, quantity) : null;
      })
      .filter(Boolean),
);

/** Итоги корзины: сумма, доставка, скидка, всего. */
export const selectCartTotals = createSelector(
  [selectCartModels, selectPromo],
  (items, promo) => {
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const savings = items.reduce((sum, i) => sum + i.savings, 0);
    // Доставка = максимум по позициям; от 700 грн бесплатно.
    const shippingRaw = items.reduce(
      (max, i) => Math.max(max, i.book.getShippingCost?.() ?? 0),
      0,
    );
    const shipping = subtotal >= 700 || subtotal === 0 ? 0 : shippingRaw;
    const promoDiscount = promo ? Math.round(subtotal * (promo.percent / 100) * 100) / 100 : 0;
    const total = Math.max(0, subtotal + shipping - promoDiscount);
    return {
      subtotal: round(subtotal),
      savings: round(savings),
      shipping: round(shipping),
      promoDiscount: round(promoDiscount),
      total: round(total),
      count: items.reduce((s, i) => s + i.quantity, 0),
    };
  },
);

function round(value) {
  return Math.round(value * 100) / 100;
}

/** Диапазон цен в каталоге — для ползунка фильтра. */
export const selectPriceBounds = createSelector([selectBookModels], (books) => {
  if (!books.length) return { min: 0, max: 1000 };
  const prices = books.map((b) => b.getFinalPrice());
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
});

/** Список жанров, реально присутствующих в каталоге. */
export const selectGenres = createSelector([selectBookModels], (books) =>
  [...new Set(books.map((b) => b.genre))].sort((a, b) => a.localeCompare(b, 'uk')),
);
