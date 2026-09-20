import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/renderWithProviders.jsx';
import ReviewList from './ReviewList.jsx';

const reviews = [
  { id: '1', author: 'Anna', rating: 5, date: '2026-01-01', text: { ru: 'Отлично', en: 'Great' } },
  { id: '2', author: 'Oleh', rating: 4, date: '2026-02-01', text: { ru: 'Хорошо', en: 'Good' } },
];

describe('ReviewList', () => {
  it('renders one item per review', () => {
    renderWithProviders(<ReviewList reviews={reviews} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.getByText('Oleh')).toBeInTheDocument();
  });

  it('shows review text in the active language', () => {
    renderWithProviders(<ReviewList reviews={reviews} />, { language: 'en' });

    expect(screen.getByText('Great')).toBeInTheDocument();
    expect(screen.queryByText('Отлично')).not.toBeInTheDocument();
  });

  it('shows the empty message when there are no reviews', () => {
    renderWithProviders(<ReviewList reviews={[]} />, { language: 'en' });

    expect(screen.getByText('No reviews yet. Be the first.')).toBeInTheDocument();
  });
});
