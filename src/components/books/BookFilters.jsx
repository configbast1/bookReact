import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  setFilter,
  toggleFormat,
  resetFilters,
  selectFilters,
  selectPriceBounds,
  selectGenres,
} from '@/store';
import { FORMAT_VALUES, genreOptions } from '@/data/dictionaries.js';
import { Button, Checkbox, Select } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { currencySign } from '@/config/env.js';
import styles from './BookFilters.module.css';

export default function BookFilters({ resultCount }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const bounds = useSelector(selectPriceBounds);
  const genres = useSelector(selectGenres);

  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilter({ key: 'search', value: debouncedSearch }));
    }
  }, [debouncedSearch, filters.search, dispatch]);

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
    <aside className={styles.filters} aria-label={t('catalog.filters.title')}>
      <div className={styles.head}>
        <h3 className={styles.heading}>{t('catalog.filters.title')}</h3>
        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={() => dispatch(resetFilters())}>
            {t('catalog.filters.resetCount', { count: activeCount })}
          </button>
        )}
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-search">
          {t('catalog.filters.search')}
        </label>
        <input
          id="filter-search"
          type="search"
          className={styles.input}
          placeholder={t('catalog.filters.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className={styles.group}>
        <Select
          label={t('catalog.filters.genre')}
          value={filters.genre}
          onChange={change('genre')}
          options={[
            { value: 'all', label: t('catalog.allGenres') },
            ...genreOptions(t, genres),
          ]}
        />
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.label}>{t('catalog.filters.format')}</legend>
        {FORMAT_VALUES.map((format) => (
          <Checkbox
            key={format}
            label={t(`format.${format}`)}
            checked={filters.formats.includes(format)}
            onChange={() => dispatch(toggleFormat(format))}
          />
        ))}
      </fieldset>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-price">
          {t('catalog.filters.priceUpTo')}:{' '}
          <strong>
            {filters.priceMax} {currencySign}
          </strong>
        </label>
        <input
          id="filter-price"
          type="range"
          className={styles.range}
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={Math.min(filters.priceMax, bounds.max)}
          onChange={(event) =>
            dispatch(setFilter({ key: 'priceMax', value: Number(event.target.value) }))
          }
        />
        <div className={styles.rangeLabels}>
          <span>
            {bounds.min} {currencySign}
          </span>
          <span>
            {bounds.max} {currencySign}
          </span>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="filter-rating">
          {t('catalog.filters.ratingFrom')}: <strong>{filters.minRating.toFixed(1)}</strong>
        </label>
        <input
          id="filter-rating"
          type="range"
          className={styles.range}
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(event) =>
            dispatch(setFilter({ key: 'minRating', value: Number(event.target.value) }))
          }
        />
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.label}>{t('catalog.filters.extra')}</legend>
        <Checkbox
          label={t('catalog.filters.inStock')}
          checked={filters.inStockOnly}
          onChange={change('inStockOnly')}
        />
        <Checkbox
          label={t('catalog.filters.onlyNew')}
          checked={filters.onlyNew}
          onChange={change('onlyNew')}
        />
      </fieldset>

      <p className={styles.result}>
        {t('catalog.filters.found')}: <strong>{resultCount}</strong>
      </p>

      <Button variant="secondary" size="sm" fullWidth onClick={() => dispatch(resetFilters())}>
        {t('catalog.filters.reset')}
      </Button>
    </aside>
  );
}

BookFilters.propTypes = { resultCount: PropTypes.number.isRequired };
