import { useEffect } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/layout/Layout.jsx';
import RequireAuth from '@/components/layout/RequireAuth.jsx';
import {
  HomePage,
  CatalogPage,
  BookPage,
  CartPage,
  CheckoutPage,
  FavoritesPage,
  AboutMePage,
  LoginPage,
  AccountPage,
  ProfilePage,
  SettingsPage,
  OrdersPage,
  AdminPage,
  AdminStatsPage,
  AdminBooksPage,
  AdminOrdersPage,
  AdminAsyncFormPage,
  AdminFormikPage,
  NotFoundPage,
} from '@/pages';
import { fetchBooks, selectBooksStatus } from '@/store';

function ProductRedirect() {
  const { id } = useParams();
  return <Navigate to={`/book/${id}`} replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'book/:id', element: <BookPage /> },
      { path: 'products/:id', element: <ProductRedirect /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'about-me', element: <AboutMePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'account',
        element: <AccountPage />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          {
            path: 'profile',
            element: (
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            ),
          },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
      {
        path: 'admin',
        element: (
          <RequireAuth adminOnly>
            <AdminPage />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <AdminStatsPage /> },
          { path: 'books', element: <AdminBooksPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'quick-add', element: <AdminAsyncFormPage /> },
          { path: 'formik', element: <AdminFormikPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const status = useSelector(selectBooksStatus);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchBooks());
  }, [status, dispatch]);

  return <RouterProvider router={router} />;
}
