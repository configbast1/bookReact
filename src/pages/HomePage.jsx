import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBookModels, selectBooksStatus } from '@/store';
import { BookGrid } from '@/components/books';
import { Button, SkeletonGrid } from '@/components/ui';
import { usePersistentState } from '@/hooks';
import { STORAGE_KEYS } from '@/core/storage';
import styles from './HomePage.module.css';

/** HomePage — витрина: герой-баннер, подборки, недавно просмотренные. */
export default function HomePage() {
  const books = useSelector(selectBookModels);
  const status = useSelector(selectBooksStatus);
  const [recentIds] = usePersistentState(STORAGE_KEYS.RECENT, []);

  // useMemo: подборки пересчитываются только при изменении каталога.
  const bestsellers = useMemo(
    () => [...books].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5),
    [books],
  );

  const novelties = useMemo(
    () => [...books].sort((a, b) => b.year - a.year).slice(0, 5),
    [books],
  );

  const discounted = useMemo(
    () => books.filter((b) => b.getDiscountPercent() > 0).slice(0, 5),
    [books],
  );

  const recent = useMemo(
    () => recentIds.map((id) => books.find((b) => b.id === id)).filter(Boolean).slice(0, 5),
    [recentIds, books],
  );

  if (status === 'loading') {
    return (
      <div className="container page">
        <SkeletonGrid count={5} />
      </div>
    );
  }

  return (
    <div className="page">
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Книги, які варто прочитати</h1>
            <p className={styles.heroText}>
              Паперові, електронні та аудіокниги в одному каталозі.
              Зручні фільтри, кошик і швидке оформлення замовлення.
            </p>
            <div className={styles.heroActions}>
              <Link to="/catalog"><Button size="lg">Перейти до каталогу</Button></Link>
              <Link to="/catalog"><Button size="lg" variant="secondary">Знижки до −15%</Button></Link>
            </div>
            <dl className={styles.stats}>
              <div><dt>{books.length}</dt><dd>книг у каталозі</dd></div>
              <div><dt>3</dt><dd>формати</dd></div>
              <div><dt>700₴</dt><dd>безкоштовна доставка</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <div className="container">
        <Section title="Бестселери" books={bestsellers} />
        <Section title="Новинки" books={novelties} />
        {discounted.length > 0 && <Section title="Зі знижкою" books={discounted} />}
        {recent.length > 0 && <Section title="Ви нещодавно дивились" books={recent} />}
      </div>
    </div>
  );
}

/** Локальный подкомпонент секции — принимает пропсы title и books. */
function Section({ title, books }) {
  if (!books.length) return null;
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
        <Link to="/catalog" className={styles.more}>Дивитись усі →</Link>
      </div>
      <BookGrid books={books} compact />
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
};
