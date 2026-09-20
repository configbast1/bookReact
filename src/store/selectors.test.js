import { describe, expect, it } from 'vitest';
import { booksSeed } from '@/data/booksSeed.js';
import { defaultFilters } from './filtersSlice.js';
import { selectFilteredBooks, selectCartTotals, selectGenreCounts } from './selectors.js';

function createState(filters = {}, cart = []) {
  return {
    books: { items: booksSeed, status: 'succeeded', error: null },
    filters: { ...defaultFilters, priceMax: 10000, ...filters },
    cart: { items: cart, promo: null },
    orders: { items: [], status: 'idle', error: null, lastOrderId: null },
  };
}

describe('catalog selectors', () => {
  it('filters books by search query', () => {
    const result = selectFilteredBooks(createState({ search: 'кобзар' }));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Кобзар');
  });

  it('filters books by format', () => {
    const result = selectFilteredBooks(createState({ formats: ['audio'] }));

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((book) => book.format === 'audio')).toBe(true);
  });

  it('sorts books by price ascending', () => {
    const result = selectFilteredBooks(createState({ sort: 'priceAsc' }));
    const prices = result.map((book) => book.getFinalPrice());

    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it('counts books per genre', () => {
    const counts = selectGenreCounts(createState());
    const total = counts.reduce((sum, entry) => sum + entry.count, 0);

    expect(total).toBe(booksSeed.length);
  });

  it('calculates cart totals with shipping', () => {
    const totals = selectCartTotals(createState({}, [{ bookId: 'b01', quantity: 2 }]));

    expect(totals.count).toBe(2);
    expect(totals.subtotal).toBe(640);
    expect(totals.total).toBeGreaterThanOrEqual(totals.subtotal);
  });
});
