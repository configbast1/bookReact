import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/renderWithProviders.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';

describe('interface language', () => {
  it('renders Russian texts by default', () => {
    renderWithProviders(<NotFoundPage />, { language: 'ru' });

    expect(screen.getByText('404 — страница не найдена')).toBeInTheDocument();
  });

  it('renders English texts after switching', () => {
    renderWithProviders(<NotFoundPage />, { language: 'en' });

    expect(screen.getByText('404 — page not found')).toBeInTheDocument();
  });

  it('switches the language from the settings page', async () => {
    renderWithProviders(<SettingsPage />, { language: 'ru' });

    expect(screen.getByText('Настройки интерфейса')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(await screen.findByText('Interface settings')).toBeInTheDocument();
  });
});
