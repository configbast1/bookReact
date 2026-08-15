import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/layout/Layout.jsx';
import RequireAuth from '@/components/layout/RequireAuth.jsx';
import {
  HomePage,
  CatalogPage,
  BookPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  LoginPage,
  AdminPage,
  NotFoundPage,
} from '@/pages';
import { fetchBooks, selectBooksStatus } from '@/store';

/**
 * Дерево маршрутов.
 * Layout — общий каркас, вложенные маршруты рендерятся в <Outlet />.
 * Приватные страницы обёрнуты в RequireAuth.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'book/:id', element: <BookPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'admin',
        element: (
          <RequireAuth adminOnly>
            <AdminPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const status = useSelector(selectBooksStatus);

  // Загружаем каталог один раз при старте приложения.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchBooks());
  }, [status, dispatch]);

  return <RouterProvider router={router} />;
}
