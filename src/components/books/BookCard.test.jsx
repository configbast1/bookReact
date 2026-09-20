import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookFactory } from '@/core/models';
import { booksSeed } from '@/data/booksSeed.js';
import { renderWithProviders, createTestStore } from '@/test/renderWithProviders.jsx';
import BookCard from './BookCard.jsx';

const seed = booksSeed[0];
const book = BookFactory.create(seed);

describe('BookCard', () => {
  it('shows the title, the author and the price', () => {
    const store = createTestStore({ books: { items: booksSeed, status: 'succeeded', error: null } });
    renderWithProviders(<BookCard book={book} />, { store });

    expect(screen.getByRole('heading', { name: seed.title })).toBeInTheDocument();
    expect(screen.getAllByText(seed.author).length).toBeGreaterThan(0);
    expect(screen.getByText(`${seed.price} ₴`)).toBeInTheDocument();
  });

  it('adds the book to the cart on click', async () => {
    const store = createTestStore({ books: { items: booksSeed, status: 'succeeded', error: null } });
    renderWithProviders(<BookCard book={book} />, { store, language: 'en' });

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    const cart = store.getState().cart.items;
    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({ bookId: seed.id, quantity: 1 });
  });

  it('translates the format badge', () => {
    const store = createTestStore({ books: { items: booksSeed, status: 'succeeded', error: null } });
    const { rerender } = renderWithProviders(<BookCard book={book} />, { store, language: 'en' });

    expect(screen.getByText('Paper')).toBeInTheDocument();

    rerender(<BookCard book={book} />);
  });
});
