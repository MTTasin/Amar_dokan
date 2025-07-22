import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'https://amardokan.pythonanywhere.com/api';

// --- ASYNC THUNKS for COLORS ---

// Public endpoint
export const fetchColors = createAsyncThunk('filters/fetchColors', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/colors/`);
    if (!response.ok) throw new Error('Failed to fetch colors.');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const createColor = createAsyncThunk('filters/createColor', async (colorData, { rejectWithValue }) => {
  try {
    const response = await api('/api/colors/', {
      method: 'POST',
      body: JSON.stringify(colorData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const deleteColor = createAsyncThunk('filters/deleteColor', async (colorId, { rejectWithValue }) => {
  try {
    const response = await api(`/api/colors/${colorId}/`, {
      method: 'DELETE',
    });
    if (response.status !== 204) {
      const data = await response.json();
      throw new Error(JSON.stringify(data));
    }
    return colorId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


// --- ASYNC THUNKS for SIZES ---

// Public endpoint
export const fetchSizes = createAsyncThunk('filters/fetchSizes', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sizes/`);
    if (!response.ok) throw new Error('Failed to fetch sizes.');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const createSize = createAsyncThunk('filters/createSize', async (sizeData, { rejectWithValue }) => {
    try {
      const response = await api('/api/sizes/', {
        method: 'POST',
        body: JSON.stringify(sizeData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
// UPDATED: Uses the 'api' wrapper
export const deleteSize = createAsyncThunk('filters/deleteSize', async (sizeId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/sizes/${sizeId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return sizeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });


// --- SLICE DEFINITION ---

const initialState = {
  colors: { items: [], status: 'idle', error: null },
  sizes: { items: [], status: 'idle', error: null },
  mutationStatus: 'idle',
  mutationError: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Color Fetch
      .addCase(fetchColors.pending, (state) => { state.colors.status = 'loading'; })
      .addCase(fetchColors.fulfilled, (state, action) => { state.colors.status = 'succeeded'; state.colors.items = action.payload; })
      .addCase(fetchColors.rejected, (state, action) => { state.colors.status = 'failed'; state.colors.error = action.payload; })
      // Size Fetch
      .addCase(fetchSizes.pending, (state) => { state.sizes.status = 'loading'; })
      .addCase(fetchSizes.fulfilled, (state, action) => { state.sizes.status = 'succeeded'; state.sizes.items = action.payload; })
      .addCase(fetchSizes.rejected, (state, action) => { state.sizes.status = 'failed'; state.sizes.error = action.payload; })
      
      // Color Create
      .addCase(createColor.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createColor.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.colors.items.push(action.payload); })
      .addCase(createColor.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      // Color Delete
      .addCase(deleteColor.fulfilled, (state, action) => { state.colors.items = state.colors.items.filter(c => c.id !== action.payload); })
      
      // Size Create
      .addCase(createSize.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createSize.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.sizes.items.push(action.payload); })
      .addCase(createSize.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      // Size Delete
      .addCase(deleteSize.fulfilled, (state, action) => { state.sizes.items = state.sizes.items.filter(s => s.id !== action.payload); });
  },
});

export const { clearMutationStatus } = filtersSlice.actions;
export default filtersSlice.reducer;
