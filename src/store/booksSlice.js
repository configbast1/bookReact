import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookRepository } from '@/core/api';
import { Entity } from '@/core/models';

/**
 * Срез каталога книг.
 * В Redux храним ТОЛЬКО сериализуемые объекты (требование Redux),
 * а в классы Book их превращаем в селекторах/компонентах через BookFactory.
 */

export const fetchBooks = createAsyncThunk('books/fetchAll', async () => {
  return bookRepository.getAll();
});

export const createBook = createAsyncThunk('books/create', async (payload) => {
  const withId = { ...payload, id: payload.id || Entity.generateId('bk') };
  return bookRepository.create(withId);
});

export const updateBook = createAsyncThunk('books/update', async ({ id, changes }) => {
  await bookRepository.update(id, changes);
  return { id, changes };
});

export const deleteBook = createAsyncThunk('books/delete', async (id) => {
  await bookRepository.remove(id);
  return id;
});

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Локальное изменение остатка после оформления заказа.
    decreaseStock(state, action) {
      action.payload.forEach(({ bookId, quantity }) => {
        const book = state.items.find((b) => b.id === bookId);
        if (book && book.format === 'paper') {
          book.stock = Math.max(0, book.stock - quantity);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const index = state.items.findIndex((b) => b.id === id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export const { decreaseStock } = booksSlice.actions;
export default booksSlice.reducer;

// ---- простые селекторы ----
export const selectRawBooks = (state) => state.books.items;
export const selectBooksStatus = (state) => state.books.status;
export const selectBookById = (id) => (state) => state.books.items.find((b) => b.id === id) ?? null;
