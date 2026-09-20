import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectBookModels, selectBooksStatus } from '@/store';
import { BookGrid } from '@/components/books';
import { Button, SkeletonGrid } from '@/components/ui';
import { usePersistentState } from '@/hooks';
import { STORAGE_KEYS } from '@/core/storage';
import env, { currencySign } from '@/config/env.js';
import styles from './HomePage.module.css';

function Section({ title, books }) {
  const { t } = useTranslation();

  if (!books.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
        <Link to="/catalog" className={styles.more}>
          {t('home.seeAll')}
        </Link>
      </div>
      <BookGrid books={books} compact />
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
};

export default function HomePage() {
  const { t } = useTranslation();
  const books = useSelector(selectBookModels);
  const status = useSelector(selectBooksStatus);
  const [recentIds] = usePersistentState(STORAGE_KEYS.RECENT, []);

  const bestsellers = useMemo(
    () => [...books].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5),
    [books],
  );

  const novelties = useMemo(() => [...books].sort((a, b) => b.year - a.year).slice(0, 5), [books]);

  const discounted = useMemo(
    () => books.filter((book) => book.getDiscountPercent() > 0).slice(0, 5),
    [books],
  );

  const recent = useMemo(
    () =>
      recentIds
        .map((id) => books.find((book) => book.id === id))
        .filter(Boolean)
        .slice(0, 5),
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
            <h1 className={styles.heroTitle}>{t('home.heroTitle')}</h1>
            <p className={styles.heroText}>{t('home.heroText')}</p>

            <div className={styles.heroActions}>
              <Link to="/catalog">
                <Button size="lg">{t('home.toCatalog')}</Button>
              </Link>
              <Link to="/favorites">
                <Button size="lg" variant="secondary">
                  {t('nav.favorites')}
                </Button>
              </Link>
            </div>

            <dl className={styles.stats}>
              <div>
                <dt>{books.length}</dt>
                <dd>{t('home.statsBooks')}</dd>
              </div>
              <div>
                <dt>3</dt>
                <dd>{t('home.statsFormats')}</dd>
              </div>
              <div>
                <dt>
                  {env.freeShippingFrom} {currencySign}
                </dt>
                <dd>{t('home.statsShipping')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="container">
        <Section title={t('home.bestsellers')} books={bestsellers} />
        <Section title={t('home.novelties')} books={novelties} />
        <Section title={t('home.sale')} books={discounted} />
        <Section title={t('home.recent')} books={recent} />
      </div>
    </div>
  );
}
