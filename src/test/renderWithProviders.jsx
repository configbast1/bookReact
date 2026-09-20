import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '@/store/booksSlice.js';
import cartReducer from '@/store/cartSlice.js';
import filtersReducer from '@/store/filtersSlice.js';
import ordersReducer from '@/store/ordersSlice.js';
import { ToastProvider } from '@/context/ToastContext.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { createQueryClient } from '@/lib/queryClient.js';
import i18n from '@/i18n';

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      books: booksReducer,
      cart: cartReducer,
      filters: filtersReducer,
      orders: ordersReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(ui, { store, route = '/', language = 'ru' } = {}) {
  const testStore = store ?? createTestStore();
  const queryClient = createQueryClient();

  i18n.changeLanguage(language);

  const wrapper = ({ children }) => (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Provider store={testStore}>
          <ThemeProvider>
            <ToastProvider>
              <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </ToastProvider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </I18nextProvider>
  );

  return { store: testStore, queryClient, ...render(ui, { wrapper }) };
}

export default renderWithProviders;
