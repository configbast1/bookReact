import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Book } from '@/core/models';
import { Badge, BookCover, Button, Rating } from '@/components/ui';
import { useCart } from '@/hooks';
import { formatLabel } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './BookCard.module.css';

function BookCard({ book, compact = false }) {
  const { t } = useTranslation();
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
          {book.isNew && <Badge tone="success">{t('home.novelties')}</Badge>}
          {!book.inStock && <Badge tone="neutral">{t('book.outOfStock')}</Badge>}
        </div>
      </Link>

      <div className={styles.body}>
        <Badge tone="info" className={styles.format}>
          {formatLabel(t, book.format)}
        </Badge>

        <h3 className={styles.title}>
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>

        <p className={styles.author}>{book.author}</p>

        <Rating value={book.rating} count={book.reviewsCount} size="sm" />

        <div className={styles.priceRow}>
          <span className={styles.price}>
            {finalPrice} {currencySign}
          </span>
          {discount > 0 && (
            <span className={styles.oldPrice}>
              {book.price} {currencySign}
            </span>
          )}
        </div>

        <Button
          size="sm"
          fullWidth
          variant={inCart ? 'success' : 'primary'}
          disabled={!book.inStock}
          onClick={() => add(book)}
        >
          {inCart ? `✓ ${t('nav.cart')}` : book.inStock ? t('book.addToCart') : t('book.outOfStock')}
        </Button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.instanceOf(Book).isRequired,
  compact: PropTypes.bool,
};

export default memo(BookCard);
