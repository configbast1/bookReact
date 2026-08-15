import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBook,
  updateBook,
  deleteBook,
  fetchOrders,
  changeOrderStatus,
  selectBookModels,
  selectOrders,
  selectOrdersError,
  selectOrdersStatus,
} from '@/store';
import { Order } from '@/core/models';
import { BookForm, DataTable, StatCard } from '@/components/admin';
import { Badge, Button, Modal, Select, Spinner } from '@/components/ui';
import { useToast } from '@/context/ToastContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import styles from './AdminPage.module.css';

const STATUS_TONE = {
  new: 'info',
  processing: 'warning',
  shipped: 'accent',
  done: 'success',
  cancelled: 'danger',
};

const FORMAT_LABELS = { paper: 'Паперова', ebook: 'Електронна', audio: 'Аудіо' };

/**
 * AdminPage — панель администратора.
 * Три вкладки: статистика, управление книгами (CRUD), управление заказами.
 * Доступ ограничен через <RequireAuth adminOnly> в маршрутах.
 */
export default function AdminPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useAuth();

  const books = useSelector(selectBookModels);
  const rawOrders = useSelector(selectOrders);
  const ordersStatus = useSelector(selectOrdersStatus);
  const ordersError = useSelector(selectOrdersError);

  const [tab, setTab] = useState('stats');
  const [editing, setEditing] = useState(null); // объект книги или 'new'
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (ordersStatus === 'idle') dispatch(fetchOrders());
  }, [ordersStatus, dispatch]);

  useEffect(() => {
    if (ordersError) toast.error(ordersError);
  }, [ordersError, toast]);

  const orders = useMemo(() => rawOrders.map((o) => new Order(o)), [rawOrders]);

  // Статистика магазина.
  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const outOfStock = books.filter((b) => !b.inStock).length;
    const avgRating = books.length
      ? books.reduce((s, b) => s + b.rating, 0) / books.length
      : 0;
    return {
      revenue: Math.round(revenue),
      orders: orders.length,
      newOrders: orders.filter((o) => o.status === 'new').length,
      books: books.length,
      outOfStock,
      avgRating: avgRating.toFixed(2),
      avgCheck: orders.length ? Math.round(revenue / orders.length) : 0,
    };
  }, [orders, books]);

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? books.filter((b) => b.getSearchIndex().includes(q)) : books;
  }, [books, search]);

  // --- обработчики CRUD ---

  const handleSave = async (values) => {
    if (editing === 'new') {
      await dispatch(createBook(values)).unwrap();
      toast.success(`Книгу «${values.title}» додано`);
    } else {
      await dispatch(updateBook({ id: editing.id, changes: values })).unwrap();
      toast.success('Зміни збережено');
    }
    setEditing(null);
  };

  const handleDelete = async () => {
    await dispatch(deleteBook(deleting.id)).unwrap();
    toast.success(`«${deleting.title}» видалено`);
    setDeleting(null);
  };

  const handleStatus = (order, next) => {
    dispatch(changeOrderStatus({ id: order.id, status: next }));
  };

  const bookColumns = [
    {
      key: 'title',
      title: 'Книга',
      render: (b) => (
        <div className={styles.bookCell}>
          <strong>{b.title}</strong>
          <span>{b.author}</span>
        </div>
      ),
    },
    { key: 'genre', title: 'Жанр' },
    { key: 'format', title: 'Формат', render: (b) => <Badge tone="info">{FORMAT_LABELS[b.format]}</Badge> },
    { key: 'price', title: 'Ціна', render: (b) => `${b.getFinalPrice()} ₴` },
    {
      key: 'stock',
      title: 'Склад',
      render: (b) =>
        b.format === 'paper' ? (
          <Badge tone={b.stock > 5 ? 'success' : b.stock > 0 ? 'warning' : 'danger'}>{b.stock} шт.</Badge>
        ) : (
          <Badge tone="neutral">∞</Badge>
        ),
    },
    { key: 'rating', title: 'Рейтинг', render: (b) => b.rating.toFixed(1) },
    {
      key: 'actions',
      title: 'Дії',
      render: (b) => (
        <div className={styles.rowActions}>
          <Button size="sm" variant="secondary" onClick={() => setEditing(b)}>Змінити</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(b)}>Видалити</Button>
        </div>
      ),
    },
  ];

  const orderColumns = [
    { key: 'id', title: 'Замовлення', render: (o) => o.getDisplayName() },
    {
      key: 'customer',
      title: 'Клієнт',
      render: (o) => (
        <div className={styles.bookCell}>
          <strong>{o.customer.name}</strong>
          <span>{o.customer.phone}</span>
        </div>
      ),
    },
    { key: 'items', title: 'Позицій', render: (o) => `${o.itemsCount} шт.` },
    { key: 'total', title: 'Сума', render: (o) => `${o.total} ₴` },
    {
      key: 'date',
      title: 'Дата',
      render: (o) => o.createdAt.toLocaleDateString('uk-UA'),
    },
    { key: 'status', title: 'Статус', render: (o) => <Badge tone={STATUS_TONE[o.status]}>{o.statusLabel}</Badge> },
    {
      key: 'change',
      title: 'Змінити статус',
      render: (o) => {
        const allowed = Order.TRANSITIONS[o.status] ?? [];
        if (!allowed.length) return <span className={styles.muted}>—</span>;
        return (
          <Select
            className={styles.statusSelect}
            value=""
            onChange={(e) => e.target.value && handleStatus(o, e.target.value)}
            options={[
              { value: '', label: 'Оберіть…' },
              ...allowed.map((s) => ({ value: s, label: Order.STATUS_LABELS[s] })),
            ]}
          />
        );
      },
    },
  ];

  if (ordersStatus === 'loading' && orders.length === 0) return <Spinner />;

  return (
    <div className="container page">
      <div className="pageHeader">
        <div>
          <h1>Панель адміністратора</h1>
          <p className={styles.subtitle}>Вітаємо, {user.getDisplayName()}</p>
        </div>
        {tab === 'books' && <Button onClick={() => setEditing('new')}>+ Додати книгу</Button>}
      </div>

      <div className={styles.tabs} role="tablist">
        {[
          ['stats', '📊 Статистика'],
          ['books', '📚 Книги'],
          ['orders', '📦 Замовлення'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? styles.tabActive : styles.tab}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <div className={styles.stats}>
          <StatCard icon="💰" label="Виторг" value={`${stats.revenue} ₴`} hint="без скасованих" />
          <StatCard icon="📦" label="Замовлень" value={stats.orders} hint={`нових: ${stats.newOrders}`} />
          <StatCard icon="🧾" label="Середній чек" value={`${stats.avgCheck} ₴`} />
          <StatCard icon="📚" label="Книг у каталозі" value={stats.books} hint={`немає в наявності: ${stats.outOfStock}`} />
          <StatCard icon="⭐" label="Середній рейтинг" value={stats.avgRating} />
          <StatCard icon="🔖" label="Позицій продано" value={orders.reduce((s, o) => s + o.itemsCount, 0)} />
        </div>
      )}

      {tab === 'books' && (
        <>
          <input
            type="search"
            className={styles.search}
            placeholder="Пошук по каталогу…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Пошук книг в адмінці"
          />
          <DataTable columns={bookColumns} rows={filteredBooks} empty="Книг не знайдено" />
        </>
      )}

      {tab === 'orders' && (
        <DataTable columns={orderColumns} rows={orders} empty="Замовлень ще немає" />
      )}

      <Modal
        open={Boolean(editing)}
        title={editing === 'new' ? 'Нова книга' : `Редагування: ${editing?.title ?? ''}`}
        onClose={() => setEditing(null)}
        width={760}
      >
        {editing && (
          <BookForm
            book={editing === 'new' ? null : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        title="Видалити книгу?"
        onClose={() => setDeleting(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Скасувати</Button>
            <Button variant="danger" onClick={handleDelete}>Видалити</Button>
          </>
        }
      >
        <p>Книга «{deleting?.title}» буде видалена з каталогу. Дію не можна скасувати.</p>
      </Modal>
    </div>
  );
}
