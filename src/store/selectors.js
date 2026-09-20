import { createSelector } from '@reduxjs/toolkit';
import env from '@/config/env.js';
import { BookFactory, CartItem } from '@/core/models';
import { selectRawBooks } from './booksSlice.js';
import { selectFilters } from './filtersSlice.js';
import { selectCartItems, selectPromo } from './cartSlice.js';

export const selectBookModels = createSelector([selectRawBooks], (raw) =>
  BookFactory.createMany(raw),
);

const comparators = {
  popular: (a, b) => b.reviewsCount - a.reviewsCount,
  priceAsc: (a, b) => a.getFinalPrice() - b.getFinalPrice(),
  priceDesc: (a, b) => b.getFinalPrice() - a.getFinalPrice(),
  ratingDesc: (a, b) => b.rating - a.rating,
  yearDesc: (a, b) => b.year - a.year,
  titleAsc: (a, b) => a.title.localeCompare(b.title),
};

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

export const selectCartTotals = createSelector(
  [selectCartModels, selectPromo],
  (items, promo) => {
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const savings = items.reduce((sum, i) => sum + i.savings, 0);
    const shippingRaw = items.reduce(
      (max, i) => Math.max(max, i.book.getShippingCost?.() ?? 0),
      0,
    );
    const shipping = subtotal >= env.freeShippingFrom || subtotal === 0 ? 0 : shippingRaw;
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

export const selectPriceBounds = createSelector([selectBookModels], (books) => {
  if (!books.length) return { min: 0, max: 1000 };
  const prices = books.map((b) => b.getFinalPrice());
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
});

export const selectGenres = createSelector([selectBookModels], (books) =>
  [...new Set(books.map((b) => b.genre))].sort((a, b) => a.localeCompare(b)),
);

export const selectGenreCounts = createSelector([selectBookModels], (books) => {
  const counts = new Map();
  books.forEach((book) => counts.set(book.genre, (counts.get(book.genre) ?? 0) + 1));
  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
});
