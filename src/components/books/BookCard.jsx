import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Book } from '@/core/models';
import { Badge, BookCover, Button, Rating } from '@/components/ui';
import { useCart } from '@/hooks';
import styles from './BookCard.module.css';

/** Подписи форматов книг. */
const FORMAT_LABELS = { paper: 'Паперова', ebook: 'Електронна', audio: 'Аудіо' };

/**
 * BookCard — карточка книги в каталоге.
 * Props: book (экземпляр класса Book), compact.
 * memo — карточка не перерисовывается, пока не изменился сам объект книги.
 */
function BookCard({ book, compact = false }) {
  const { add, has } = useCart();
  const discount = book.getDiscountPercent();
  const finalPrice = book.getFinalPrice();
  const inCart = has(book.id);

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <Link to={`/book/${book.id}`} className={styles.coverLink} tabIndex={-1}>
        <BookCover book={book} size={compact ? 'sm' : 'md'} />
        <div className={styles.badges}>
          {discount > 0 && <Badge tone="danger">−{discount}%</Badge>}
          {book.isNew && <Badge tone="success">Новинка</Badge>}
          {!book.inStock && <Badge tone="neutral">Немає</Badge>}
        </div>
      </Link>

      <div className={styles.body}>
        <Badge tone="info" className={styles.format}>{FORMAT_LABELS[book.format]}</Badge>

        <h3 className={styles.title}>
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>

        <p className={styles.author}>{book.author}</p>

        <Rating value={book.rating} count={book.reviewsCount} size="sm" />

        <div className={styles.priceRow}>
          <span className={styles.price}>{finalPrice} ₴</span>
          {discount > 0 && <span className={styles.oldPrice}>{book.price} ₴</span>}
        </div>

        <Button
          size="sm"
          fullWidth
          variant={inCart ? 'success' : 'primary'}
          disabled={!book.inStock}
          onClick={() => add(book)}
        >
          {inCart ? '✓ У кошику' : book.inStock ? 'До кошика' : 'Немає в наявності'}
        </Button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  // Проверяем, что пришёл именно объект класса Book (или его наследника).
  book: PropTypes.instanceOf(Book).isRequired,
  compact: PropTypes.bool,
};

export default memo(BookCard);
