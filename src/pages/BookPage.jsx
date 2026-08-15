import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBookModels } from '@/store';
import { AudioBook, EBook, PaperBook } from '@/core/models';
import { Badge, BookCover, Button, EmptyState, Rating, Spinner } from '@/components/ui';
import { BookGrid } from '@/components/books';
import { useCart, usePersistentState } from '@/hooks';
import { STORAGE_KEYS } from '@/core/storage';
import styles from './BookPage.module.css';

/** BookPage — страница одной книги. Показывает поля, зависящие от класса товара. */
export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const books = useSelector(selectBookModels);
  const { add, quantityOf } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [, setRecent] = usePersistentState(STORAGE_KEYS.RECENT, []);

  const book = useMemo(() => books.find((b) => b.id === id) ?? null, [books, id]);

  // Записываем книгу в «нещодавно переглянуті» (localStorage).
  useEffect(() => {
    if (!book) return;
    setRecent((prev) => [book.id, ...prev.filter((x) => x !== book.id)].slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  const similar = useMemo(
    () => books.filter((b) => b.genre === book?.genre && b.id !== book?.id).slice(0, 5),
    [books, book],
  );

  if (books.length === 0) return <Spinner />;

  if (!book) {
    return (
      <div className="container page">
        <EmptyState
          icon="📕"
          title="Книгу не знайдено"
          description="Можливо, її вже немає в каталозі."
          action={<Button onClick={() => navigate('/catalog')}>До каталогу</Button>}
        />
      </div>
    );
  }

  const discount = book.getDiscountPercent();
  const inCart = quantityOf(book.id);

  return (
    <div className="container page">
      <nav className={styles.breadcrumbs} aria-label="Навігація">
        <Link to="/">Головна</Link> <span>/</span> <Link to="/catalog">Каталог</Link>{' '}
        <span>/</span> <span className={styles.current}>{book.title}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.coverBox}>
          <BookCover book={book} size="lg" />
        </div>

        <div className={styles.info}>
          <div className={styles.badges}>
            <Badge tone="info">{book.format === 'paper' ? 'Паперова' : book.format === 'ebook' ? 'Електронна' : 'Аудіокнига'}</Badge>
            {book.isNew && <Badge tone="success">Новинка</Badge>}
            {discount > 0 && <Badge tone="danger">−{discount}%</Badge>}
          </div>

          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>{book.author}</p>

          <Rating value={book.rating} count={book.reviewsCount} />

          <p className={styles.description}>{book.description}</p>

          <div className={styles.priceBox}>
            <div>
              <span className={styles.price}>{book.getFinalPrice()} ₴</span>
              {discount > 0 && <span className={styles.oldPrice}>{book.price} ₴</span>}
            </div>
            <span className={book.inStock ? styles.inStock : styles.outOfStock}>
              {book.inStock ? '✓ В наявності' : '✕ Немає в наявності'}
            </span>
          </div>

          <div className={styles.actions}>
            <div className={styles.stepper}>
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Менше">−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Більше">+</button>
            </div>
            <Button size="lg" disabled={!book.inStock} onClick={() => add(book, quantity)}>
              Додати до кошика
            </Button>
            {inCart > 0 && <span className={styles.inCart}>У кошику: {inCart} шт.</span>}
          </div>

          {/* Характеристики: часть полей зависит от конкретного класса книги */}
          <dl className={styles.specs}>
            <Spec label="Жанр" value={book.genre} />
            <Spec label="Рік видання" value={book.year > 0 ? book.year : `${Math.abs(book.year)} до н.е.`} />
            <Spec label="Сторінок" value={book.pages || '—'} />
            <Spec label="Мова" value={book.language === 'uk' ? 'Українська' : book.language} />
            <Spec label="ISBN" value={book.isbn} />

            {book instanceof PaperBook && (
              <>
                <Spec label="Обкладинка" value={book.cover === 'hard' ? 'Тверда' : 'Мʼяка'} />
                <Spec label="Вага" value={`${book.weight} г`} />
                <Spec label="Доставка" value={`${book.getShippingCost()} ₴`} />
              </>
            )}

            {book instanceof EBook && (
              <>
                <Spec label="Формат файлу" value={book.fileFormat.toUpperCase()} />
                <Spec label="Розмір файлу" value={`${book.fileSizeMb} МБ`} />
                <Spec label="Доставка" value="Миттєво на email" />
              </>
            )}

            {book instanceof AudioBook && (
              <>
                <Spec label="Читає" value={book.narrator} />
                <Spec label="Тривалість" value={book.getFormattedDuration()} />
                <Spec label="Доставка" value="Доступ у застосунку" />
              </>
            )}
          </dl>
        </div>
      </div>

      {similar.length > 0 && (
        <section className={styles.similar}>
          <h2>Схожі книги</h2>
          <BookGrid books={similar} compact />
        </section>
      )}
    </div>
  );
}

/** Маленький подкомпонент строки характеристик. */
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
