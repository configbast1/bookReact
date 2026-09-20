import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectBookModels, selectOrders } from '@/store';
import { Order } from '@/core/models';
import { StatList } from '@/components/admin';
import { currencySign } from '@/config/env.js';

export default function AdminStatsPage() {
  const { t } = useTranslation();
  const books = useSelector(selectBookModels);
  const rawOrders = useSelector(selectOrders);

  const orders = useMemo(() => rawOrders.map((item) => new Order(item)), [rawOrders]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((order) => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    const outOfStock = books.filter((book) => !book.inStock).length;
    const avgRating = books.length
      ? books.reduce((sum, book) => sum + book.rating, 0) / books.length
      : 0;

    return {
      revenue: Math.round(revenue),
      orders: orders.length,
      newOrders: orders.filter((order) => order.status === 'new').length,
      books: books.length,
      outOfStock,
      avgRating: avgRating.toFixed(2),
      avgCheck: orders.length ? Math.round(revenue / orders.length) : 0,
      sold: orders.reduce((sum, order) => sum + order.itemsCount, 0),
    };
  }, [orders, books]);

  const cards = [
    {
      key: 'revenue',
      icon: '💰',
      label: t('admin.cards.revenue'),
      value: `${stats.revenue} ${currencySign}`,
      hint: t('admin.cards.revenueHint'),
    },
    {
      key: 'orders',
      icon: '📦',
      label: t('admin.cards.orders'),
      value: stats.orders,
      hint: t('admin.cards.ordersHint', { count: stats.newOrders }),
    },
    {
      key: 'avgCheck',
      icon: '🧾',
      label: t('admin.cards.avgCheck'),
      value: `${stats.avgCheck} ${currencySign}`,
    },
    {
      key: 'books',
      icon: '📚',
      label: t('admin.cards.books'),
      value: stats.books,
      hint: t('admin.cards.booksHint', { count: stats.outOfStock }),
    },
    { key: 'rating', icon: '⭐', label: t('admin.cards.rating'), value: stats.avgRating },
    { key: 'sold', icon: '🔖', label: t('admin.cards.sold'), value: stats.sold },
  ];

  return <StatList stats={cards} />;
}
