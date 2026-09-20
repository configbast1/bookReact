import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectBookModels } from '@/store';
import { AudioBook, EBook, PaperBook } from '@/core/models';
import { Badge, BookCover, Button, EmptyState, Modal, Rating, Spinner } from '@/components/ui';
import { BookGrid } from '@/components/books';
import { ReviewForm, ReviewList } from '@/components/reviews';
import { useCart, usePersistentState, useReviews } from '@/hooks';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { STORAGE_KEYS } from '@/core/storage';
import { formatLabel, genreLabel } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './BookPage.module.css';

function Spec({ label, value }) {
  return (
    <div className={styles.spec}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

Spec.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

export default function BookPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const books = useSelector(selectBookModels);
  const { add, quantityOf } = useCart();
  const { reviews, addReview } = useReviews(id);

  const [quantity, setQuantity] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [, setRecent] = usePersistentState(STORAGE_KEYS.RECENT, []);

  const book = useMemo(() => books.find((item) => item.id === id) ?? null, [books, id]);

  useEffect(() => {
    if (!book) return;
    setRecent((previous) => [book.id, ...previous.filter((x) => x !== book.id)].slice(0, 8));
  }, [book, setRecent]);

  const similar = useMemo(
    () => books.filter((item) => item.genre === book?.genre && item.id !== book?.id).slice(0, 5),
    [books, book],
  );

  if (books.length === 0) return <Spinner label={t('common.loading')} />;

  if (!book) {
    return (
      <div className="container page">
        <EmptyState
          icon="📕"
          title={t('book.notFoundTitle')}
          description={t('book.notFoundText')}
          action={<Button onClick={() => navigate('/catalog')}>{t('book.toCatalog')}</Button>}
        />
      </div>
    );
  }

  const discount = book.getDiscountPercent();
  const inCart = quantityOf(book.id);

  return (
    <div className="container page">
      <nav className={styles.breadcrumbs} aria-label={t('nav.menu')}>
        <Link to="/">{t('nav.home')}</Link> <span>/</span> <Link to="/catalog">{t('nav.catalog')}</Link>{' '}
        <span>/</span> <span className={styles.current}>{book.title}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.coverBox}>
          <BookCover book={book} size="lg" />
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <Badge tone="info">{formatLabel(t, book.format)}</Badge>
            {book.isNew && <Badge tone="success">{t('home.novelties')}</Badge>}
            {discount > 0 && <Badge tone="danger">−{discount}%</Badge>}
          </div>

          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>{book.author}</p>

          <Rating value={book.rating} count={book.reviewsCount} />

          <p className={styles.description}>{book.description}</p>

          <div className={styles.priceBox}>
            <div>
              <span className={styles.price}>
                {book.getFinalPrice()} {currencySign}
              </span>
              {discount > 0 && (
                <span className={styles.oldPrice}>
                  {book.price} {currencySign}
                </span>
              )}
            </div>
            <span className={book.inStock ? styles.inStock : styles.outOfStock}>
              {book.inStock ? `✓ ${t('book.inStock')}` : `✕ ${t('book.outOfStock')}`}
            </span>
          </div>

          <div className={styles.actions}>
            <div className={styles.stepper}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={t('book.decrease')}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                aria-label={t('book.increase')}
              >
                +
              </button>
            </div>

            <Button size="lg" disabled={!book.inStock} onClick={() => add(book, quantity)}>
              {t('book.addToCart')}
            </Button>

            <Button size="lg" variant="secondary" onClick={() => setPreviewOpen(true)}>
              {t('book.preview')}
            </Button>

            {inCart > 0 && <span className={styles.inCart}>{t('book.inCart', { count: inCart })}</span>}
          </div>

          <dl className={styles.specs}>
            <Spec label={t('book.specs.genre')} value={genreLabel(t, book.genre)} />
            <Spec
              label={t('book.specs.year')}
              value={book.year > 0 ? book.year : t('book.specs.bce', { year: Math.abs(book.year) })}
            />
            <Spec label={t('book.specs.pages')} value={book.pages || '—'} />
            <Spec label={t('book.specs.language')} value={book.language.toUpperCase()} />
            <Spec label={t('book.specs.isbn')} value={book.isbn} />

            {book instanceof PaperBook && (
              <>
                <Spec
                  label={t('book.specs.cover')}
                  value={book.cover === 'hard' ? t('book.specs.coverHard') : t('book.specs.coverSoft')}
                />
                <Spec label={t('book.specs.weight')} value={`${book.weight} g`} />
                <Spec
                  label={t('book.specs.shipping')}
                  value={`${book.getShippingCost()} ${currencySign}`}
                />
              </>
            )}

            {book instanceof EBook && (
              <>
                <Spec label={t('book.specs.fileFormat')} value={book.fileFormat.toUpperCase()} />
                <Spec label={t('book.specs.fileSize')} value={`${book.fileSizeMb} MB`} />
                <Spec label={t('book.specs.shipping')} value={t('book.specs.instant')} />
              </>
            )}

            {book instanceof AudioBook && (
              <>
                <Spec label={t('book.specs.narrator')} value={book.narrator} />
                <Spec label={t('book.specs.duration')} value={book.getFormattedDuration()} />
                <Spec label={t('book.specs.shipping')} value={t('book.specs.inApp')} />
              </>
            )}
          </dl>
        </div>
      </div>

      <section className={styles.reviews}>
        <h2>{t('book.reviews.title')}</h2>
        <ReviewList reviews={reviews} />
        <ReviewForm
          defaultAuthor={user?.name ?? ''}
          onSubmit={(review) => {
            addReview(review);
            toast.success(t('book.reviews.added'));
          }}
        />
      </section>

      {similar.length > 0 && (
        <section className={styles.similar}>
          <h2>{t('book.similar')}</h2>
          <BookGrid books={similar} compact />
        </section>
      )}

      <Modal
        open={previewOpen}
        title={t('book.previewTitle')}
        onClose={() => setPreviewOpen(false)}
        width={640}
      >
        <p>{t('book.previewText')}</p>
        <p>
          <strong>{book.getDisplayName()}</strong>
        </p>
        <p>{book.description}</p>
      </Modal>
    </div>
  );
}
