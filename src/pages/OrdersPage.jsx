import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, selectOrders, selectOrdersStatus } from '@/store';
import { Order } from '@/core/models';
import { useAuth } from '@/context/AuthContext.jsx';
import { Badge, Button, EmptyState, Spinner } from '@/components/ui';
import styles from './OrdersPage.module.css';

/** Цвет метки статуса. */
const STATUS_TONE = {
  new: 'info',
  processing: 'warning',
  shipped: 'accent',
  done: 'success',
  cancelled: 'danger',
};

/** OrdersPage — история заказов текущего пользователя. */
export default function OrdersPage() {
  const dispatch = useDispatch();
  const raw = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const { user, isAuthenticated } = useAuth();
  const [params] = useSearchParams();
  const highlight = params.get('highlight');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOrders());
  }, [status, dispatch]);

  // Превращаем сырые данные в модели Order, чтобы получить методы и геттеры.
  const orders = useMemo(() => {
    const list = raw.map((item) => new Order(item));
    // Гость видит только заказы без привязки к пользователю (свои в этой сессии).
    return isAuthenticated ? list.filter((o) => !o.userId || o.userId === user.id) : list;
  }, [raw, isAuthenticated, user]);

  if (status === 'loading') return <Spinner label="Завантажуємо замовлення…" />;

  if (orders.length === 0) {
    return (
      <div className="container page">
        <h1>Мої замовлення</h1>
        <EmptyState
          icon="📦"
          title="Замовлень поки немає"
          description="Оформіть перше замовлення — воно зʼявиться тут."
          action={<Link to="/catalog"><Button>До каталогу</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Мої замовлення</h1>

      <div className={styles.list}>
        {orders.map((order) => (
          <article
            key={order.id}
            className={`${styles.order} ${order.id === highlight ? styles.highlight : ''}`}
          >
            <header className={styles.head}>
              <div>
                <h2 className={styles.title}>{order.getDisplayName()}</h2>
                <p className={styles.date}>
                  {order.createdAt.toLocaleDateString('uk-UA', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <Badge tone={STATUS_TONE[order.status]}>{order.statusLabel}</Badge>
            </header>

            <ul className={styles.items}>
              {order.items.map((item) => (
                <li key={item.bookId}>
                  <Link to={`/book/${item.bookId}`}>{item.title}</Link>
                  <span className={styles.qty}>× {item.quantity}</span>
                  <span className={styles.sum}>{Math.round(item.price * item.quantity)} ₴</span>
                </li>
              ))}
            </ul>

            <footer className={styles.foot}>
              <span className={styles.delivery}>
                {order.customer.city}, {order.customer.address}
              </span>
              <span className={styles.total}>
                Разом: <strong>{order.total} ₴</strong>
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
