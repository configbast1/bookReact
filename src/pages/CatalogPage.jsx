import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  selectPagedBooks,
  selectFilters,
  selectBooksStatus,
  selectGenreCounts,
  setFilter,
  setPage,
  resetFilters,
} from '@/store';
import { BookFilters, BookGrid } from '@/components/books';
import { CategoryList } from '@/components/catalog';
import { Button, EmptyState, Pagination, Select, SkeletonGrid } from '@/components/ui';
import { useMediaQuery } from '@/hooks';
import { genreLabel } from '@/data/dictionaries.js';
import styles from './CatalogPage.module.css';

const SORT_KEYS = ['popular', 'priceAsc', 'priceDesc', 'ratingDesc', 'yearDesc', 'titleAsc'];

export default function CatalogPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { items, total, page, totalPages } = useSelector(selectPagedBooks);
  const filters = useSelector(selectFilters);
  const status = useSelector(selectBooksStatus);
  const genreCounts = useSelector(selectGenreCounts);

  const isMobile = useMediaQuery('(max-width: 900px)');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(
    () => [
      { value: 'all', label: t('catalog.allGenres'), count: total },
      ...genreCounts.map((entry) => ({
        value: entry.genre,
        label: genreLabel(t, entry.genre),
        count: entry.count,
      })),
    ],
    [genreCounts, total, t],
  );

  const handlePageChange = (next) => {
    dispatch(setPage(next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container page">
      <div className="pageHeader">
        <h1>{t('catalog.title')}</h1>

        <div className={styles.controls}>
          {isMobile && (
            <Button variant="secondary" size="sm" onClick={() => setFiltersOpen((v) => !v)}>
              {filtersOpen ? t('catalog.hideFilters') : t('catalog.showFilters')}
            </Button>
          )}
          <Select
            className={styles.sort}
            aria-label={t('catalog.sortLabel')}
            value={filters.sort}
            onChange={(event) => dispatch(setFilter({ key: 'sort', value: event.target.value }))}
            options={SORT_KEYS.map((key) => ({ value: key, label: t(`catalog.sort.${key}`) }))}
          />
        </div>
      </div>

      <div className={styles.layout}>
        <div className={`${styles.sidebar} ${isMobile && !filtersOpen ? styles.hidden : ''}`}>
          <CategoryList
            categories={categories}
            active={filters.genre}
            onSelect={(value) => dispatch(setFilter({ key: 'genre', value }))}
          />
          <BookFilters resultCount={total} />
        </div>

        <div className={styles.content}>
          {status === 'loading' && <SkeletonGrid count={filters.perPage} />}

          {status !== 'loading' && items.length === 0 && (
            <EmptyState
              icon="🔍"
              title={t('catalog.emptyTitle')}
              description={t('catalog.emptyText')}
              action={
                <Button onClick={() => dispatch(resetFilters())}>
                  {t('catalog.filters.reset')}
                </Button>
              }
            />
          )}

          {status !== 'loading' && items.length > 0 && (
            <>
              <BookGrid books={items} />
              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
