import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setFilter,
  toggleFormat,
  resetFilters,
  selectFilters,
  selectPriceBounds,
  selectGenres,
} from '@/store';
import { FORMATS } from '@/data/booksSeed.js';
import { Button, Checkbox, Select } from '@/components/ui';
import { useDebounce } from '@/hooks';
import styles from './BookFilters.module.css';

/**
 * BookFilters — панель фильтров каталога.
 * Поиск дебаунсится (useDebounce), остальные фильтры применяются сразу.
 * Всё состояние живёт в Redux, поэтому фильтры переживают переход между страницами.
 */
export default function BookFilters({ resultCount }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const bounds = useSelector(selectPriceBounds);
  const genres = useSelector(selectGenres);

  // Локальное состояние поля поиска, чтобы ввод был мгновенным.
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 300);

  // Когда пользователь перестал печатать — кладём значение в Redux.
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilter({ key: 'search', value: debouncedSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Если фильтры сбросили извне — синхронизируем локальное поле.
  useEffect(() => {
    setSearch(filters.search);
  }, [filters.search]);

  const change = (key) => (event) => {
    const { type, checked, value } = event.target;
    dispatch(setFilter({ key, value: type === 'checkbox' ? checked : value }));
  };

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.genre !== 'all' ? 1 : 0) +
    filters.formats.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onlyNew ? 1 : 0) +
    (filters.priceMax < bounds.max ? 1 : 0);

  return (
    <aside className={styles.filters} aria-label="Фільтри каталогу">
      <div className={styles.head}>
        <h3 className={styles.heading}>Фільтри</h3>
        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={() => dispatch(resetFilters())}>
            Скинути ({activeCount})
          </button>
        )}
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-search">Пошук</label>
        <input
          id="filter-search"
          type="search"
          className={styles.input}
          placeholder="Назва, автор, ISBN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <Select
          label="Жанр"
          value={filters.genre}
          onChange={change('genre')}
          options={[
            { value: 'all', label: 'Усі жанри' },
            ...genres.map((g) => ({ value: g, label: g })),
          ]}
        />
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.label}>Формат</legend>
        {FORMATS.map((f) => (
          <Checkbox
            key={f.value}
            label={f.label}
            checked={filters.formats.includes(f.value)}
            onChange={() => dispatch(toggleFormat(f.value))}
          />
        ))}
      </fieldset>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-price">
          Ціна до: <strong>{filters.priceMax} ₴</strong>
        </label>
        <input
          id="filter-price"
          type="range"
          className={styles.range}
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={Math.min(filters.priceMax, bounds.max)}
          onChange={(e) => dispatch(setFilter({ key: 'priceMax', value: Number(e.target.value) }))}
        />
        <div className={styles.rangeLabels}>
          <span>{bounds.min} ₴</span>
          <span>{bounds.max} ₴</span>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-rating">
          Рейтинг від: <strong>{filters.minRating.toFixed(1)}</strong>
        </label>
        <input
          id="filter-rating"
          type="range"
          className={styles.range}
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(e) => dispatch(setFilter({ key: 'minRating', value: Number(e.target.value) }))}
        />
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.label}>Додатково</legend>
        <Checkbox
          label="Тільки в наявності"
          checked={filters.inStockOnly}
          onChange={change('inStockOnly')}
        />
        <Checkbox label="Тільки новинки" checked={filters.onlyNew} onChange={change('onlyNew')} />
      </fieldset>

      <p className={styles.result}>
        Знайдено: <strong>{resultCount}</strong>
      </p>

      <Button variant="secondary" size="sm" fullWidth onClick={() => dispatch(resetFilters())}>
        Скинути фільтри
      </Button>
    </aside>
  );
}

BookFilters.propTypes = { resultCount: PropTypes.number.isRequired };
