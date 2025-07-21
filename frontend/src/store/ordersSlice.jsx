import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// --- ASYNC THUNKS (UPDATED) ---

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api('/api/manage/orders/'); 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch orders.');
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api('/api/manage/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api(`/api/manage/orders/${orderId}/update-status/`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update order status.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE DEFINITION (no changes needed here) ---
const initialState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetCreateStatus(state) {
        state.createStatus = 'idle';
        state.createError = null;
    },
    resetUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(createOrder.pending, (state) => { state.createStatus = 'loading'; state.createError = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.createStatus = 'succeeded'; state.items.unshift(action.payload); })
      .addCase(createOrder.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.payload; })
      .addCase(updateOrderStatus.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.items.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { resetCreateStatus, resetUpdateStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
