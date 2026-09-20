import { createSlice } from '@reduxjs/toolkit';
import { localStore, STORAGE_KEYS } from '@/core/storage';

export const defaultFilters = {
  search: '',
  genre: 'all',
  formats: [],
  priceMin: 0,
  priceMax: 1000,
  minRating: 0,
  inStockOnly: false,
  onlyNew: false,
  sort: 'popular',
  page: 1,
  perPage: 8,
};

const persisted = localStore.get(STORAGE_KEYS.FILTERS, null);

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { ...defaultFilters, ...(persisted ?? {}), page: 1 },
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
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
