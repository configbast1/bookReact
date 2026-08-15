import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPagedBooks, selectFilters, selectBooksStatus, setFilter, setPage, resetFilters } from '@/store';
import { BookFilters, BookGrid } from '@/components/books';
import { Button, EmptyState, Pagination, Select, SkeletonGrid } from '@/components/ui';
import { useMediaQuery } from '@/hooks';
import styles from './CatalogPage.module.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'priceAsc', label: 'Ціна: спочатку дешевші' },
  { value: 'priceDesc', label: 'Ціна: спочатку дорожчі' },
  { value: 'ratingDesc', label: 'За рейтингом' },
  { value: 'yearDesc', label: 'Спочатку нові' },
  { value: 'titleAsc', label: 'За назвою (А–Я)' },
];

/** CatalogPage — каталог с фильтрами, сортировкой и пагинацией. */
export default function CatalogPage() {
  const dispatch = useDispatch();
  const { items, total, page, totalPages } = useSelector(selectPagedBooks);
  const filters = useSelector(selectFilters);
  const status = useSelector(selectBooksStatus);

  const isMobile = useMediaQuery('(max-width: 900px)');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handlePageChange = (next) => {
    dispatch(setPage(next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container page">
      <div className="pageHeader">
        <h1>Каталог книг</h1>
        <div className={styles.controls}>
          {isMobile && (
            <Button variant="secondary" size="sm" onClick={() => setFiltersOpen((v) => !v)}>
              {filtersOpen ? 'Сховати фільтри' : 'Фільтри'}
            </Button>
          )}
          <Select
            className={styles.sort}
            aria-label="Сортування"
            value={filters.sort}
            onChange={(e) => dispatch(setFilter({ key: 'sort', value: e.target.value }))}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      <div className={styles.layout}>
        <div className={`${styles.sidebar} ${isMobile && !filtersOpen ? styles.hidden : ''}`}>
          <BookFilters resultCount={total} />
        </div>

        <div className={styles.content}>
          {status === 'loading' && <SkeletonGrid count={filters.perPage} />}

          {status !== 'loading' && items.length === 0 && (
            <EmptyState
              icon="🔍"
              title="Нічого не знайдено"
              description="Спробуйте змінити параметри пошуку або скинути фільтри."
              action={<Button onClick={() => dispatch(resetFilters())}>Скинути фільтри</Button>}
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
