import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartItem } from '@/core/models';
import { BookCover, Badge } from '@/components/ui';
import { useCart } from '@/hooks';
import { formatLabel } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './CartItemRow.module.css';

export default function CartItemRow({ item }) {
  const { t } = useTranslation();
  const { setQty, remove } = useCart();
  const { book, quantity } = item;

  return (
    <article className={styles.row}>
      <Link to={`/book/${book.id}`} className={styles.cover}>
        <BookCover book={book} size="sm" />
      </Link>

      <div className={styles.info}>
        <Badge tone="info">{formatLabel(t, book.format)}</Badge>
        <h3 className={styles.title}>
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.unit}>
          {book.getFinalPrice()} {currencySign} / {t('cart.unit')}
          {item.savings > 0 && (
            <span className={styles.savings}>
              {' '}
              {t('cart.savings')} {item.savings} {currencySign}
            </span>
          )}
        </p>
      </div>

      <div className={styles.qty}>
        <button
          type="button"
          onClick={() => setQty(book.id, quantity - 1)}
          aria-label={t('cart.decrease')}
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(event) => setQty(book.id, Number(event.target.value))}
          aria-label={t('cart.quantityOf', { title: book.title })}
        />
        <button
          type="button"
          onClick={() => setQty(book.id, quantity + 1)}
          aria-label={t('cart.increase')}
        >
          +
        </button>
      </div>

      <div className={styles.subtotal}>
        {item.subtotal} {currencySign}
      </div>

      <button
        type="button"
        className={styles.remove}
        onClick={() => remove(book.id)}
        aria-label={t('cart.remove', { title: book.title })}
        title={t('common.delete')}
      >
        ✕
      </button>
    </article>
  );
}

CartItemRow.propTypes = { item: PropTypes.instanceOf(CartItem).isRequired };
