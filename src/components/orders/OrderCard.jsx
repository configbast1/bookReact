import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import { Order } from '@/core/models';
import { currencySign } from '@/config/env.js';
import styles from './OrderList.module.css';

const STATUS_TONE = {
  new: 'info',
  processing: 'warning',
  shipped: 'accent',
  done: 'success',
  cancelled: 'danger',
};

export default function OrderCard({ order, highlighted = false }) {
  const { t, i18n } = useTranslation();

  return (
    <article className={`${styles.order} ${highlighted ? styles.highlight : ''}`}>
      <header className={styles.head}>
        <div>
          <h2 className={styles.title}>
            {t('orders.number', { number: order.id.slice(-6).toUpperCase() })}
          </h2>
          <p className={styles.date}>
            {order.createdAt.toLocaleDateString(i18n.language, {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <Badge tone={STATUS_TONE[order.status]}>{t(`orders.status.${order.status}`)}</Badge>
      </header>

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.bookId}>
            <Link to={`/book/${item.bookId}`}>{item.title}</Link>
            <span className={styles.qty}>× {item.quantity}</span>
            <span className={styles.sum}>
              {Math.round(item.price * item.quantity)} {currencySign}
            </span>
          </li>
        ))}
      </ul>

      <footer className={styles.foot}>
        <span className={styles.delivery}>
          {order.customer.city}, {order.customer.address}
        </span>
        <span className={styles.total}>
          {t('orders.total')}:{' '}
          <strong>
            {order.total} {currencySign}
          </strong>
        </span>
      </footer>
    </article>
  );
}

OrderCard.propTypes = {
  order: PropTypes.instanceOf(Order).isRequired,
  highlighted: PropTypes.bool,
};
