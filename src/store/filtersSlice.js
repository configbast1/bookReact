import { createSlice } from '@reduxjs/toolkit';
import { localStore, STORAGE_KEYS } from '@/core/storage';

/** Значения фильтров по умолчанию. */
export const defaultFilters = {
  search: '',
  genre: 'all',
  formats: [], // пустой массив = все форматы
  priceMin: 0,
  priceMax: 1000,
  minRating: 0,
  inStockOnly: false,
  onlyNew: false,
  sort: 'popular', // popular | priceAsc | priceDesc | ratingDesc | yearDesc | titleAsc
  page: 1,
  perPage: 8,
};

// Восстанавливаем сохранённые фильтры из localStorage (требование "збереження даних").
const persisted = localStore.get(STORAGE_KEYS.FILTERS, null);

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { ...defaultFilters, ...(persisted ?? {}), page: 1 },
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
      // Любое изменение фильтра сбрасывает пагинацию на первую страницу.
      if (key !== 'page') state.page = 1;
    },
    toggleFormat(state, action) {
      const format = action.payload;
      state.formats = state.formats.includes(format)
        ? state.formats.filter((f) => f !== format)
        : [...state.formats, format];
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    resetFilters() {
      return { ...defaultFilters };
    },
  },
});

export const { setFilter, toggleFormat, setPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

export const selectFilters = (state) => state.filters;
