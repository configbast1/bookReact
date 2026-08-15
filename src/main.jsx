import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { ToastProvider } from '@/context/ToastContext.jsx';
import App from './App.jsx';
import './index.css';

/**
 * Точка входа.
 * Порядок провайдеров: Redux -> тема -> уведомления -> авторизация -> приложение.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
