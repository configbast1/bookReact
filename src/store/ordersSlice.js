import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderRepository } from '@/core/api';
import { Order } from '@/core/models';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return orderRepository.getAll();
});

export const placeOrder = createAsyncThunk('orders/place', async (payload) => {
  const order = new Order(payload);
  return orderRepository.create(order.toJSON());
});

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const updated = await orderRepository.changeStatus(id, status);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], status: 'idle', error: null, lastOrderId: null },
  reducers: {
    clearLastOrder(state) {
      state.lastOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.lastOrderId = action.payload.id;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.error = null;
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
