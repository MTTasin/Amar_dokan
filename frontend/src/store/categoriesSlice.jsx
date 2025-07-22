import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- ASYNC THUNKS ---

// Public endpoint, no changes needed here
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories.');
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/categories/', {
        method: 'POST',
        body: categoryFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, categoryFormData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/categories/${categoryId}/`, {
        method: 'PUT',
        body: categoryFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/categories/${categoryId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
  mutationError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Create cases
      .addCase(createCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createCategory.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.items.push(action.payload); })
      .addCase(createCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      // Update cases
      .addCase(updateCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.items.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      // Delete cases
      .addCase(deleteCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; });
  },
});

export const { clearMutationStatus } = categoriesSlice.actions;
export default categoriesSlice.reducer;
