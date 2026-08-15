import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CartItem } from '@/core/models';
import { BookCover, Badge } from '@/components/ui';
import { useCart } from '@/hooks';
import styles from './CartItemRow.module.css';

const FORMAT_LABELS = { paper: 'Паперова', ebook: 'Електронна', audio: 'Аудіо' };

/** CartItemRow — строка товара в корзине. */
export default function CartItemRow({ item }) {
  const { setQty, remove } = useCart();
  const { book, quantity } = item;

  return (
    <article className={styles.row}>
      <Link to={`/book/${book.id}`} className={styles.cover}>
        <BookCover book={book} size="sm" />
      </Link>

      <div className={styles.info}>
        <Badge tone="info">{FORMAT_LABELS[book.format]}</Badge>
        <h3 className={styles.title}>
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.unit}>
          {book.getFinalPrice()} ₴ / шт.
          {item.savings > 0 && <span className={styles.savings}> економія {item.savings} ₴</span>}
        </p>
      </div>

      <div className={styles.qty}>
        <button type="button" onClick={() => setQty(book.id, quantity - 1)} aria-label="Зменшити кількість">−</button>
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQty(book.id, Number(e.target.value))}
          aria-label={`Кількість: ${book.title}`}
        />
        <button type="button" onClick={() => setQty(book.id, quantity + 1)} aria-label="Збільшити кількість">+</button>
      </div>

      <div className={styles.subtotal}>{item.subtotal} ₴</div>

      <button
        type="button"
        className={styles.remove}
        onClick={() => remove(book.id)}
        aria-label={`Видалити ${book.title} з кошика`}
        title="Видалити"
      >
        ✕
      </button>
    </article>
  );
}

CartItemRow.propTypes = { item: PropTypes.instanceOf(CartItem).isRequired };
