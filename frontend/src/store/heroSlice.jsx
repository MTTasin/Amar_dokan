import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the api utility

// --- ASYNC THUNKS ---
// UPDATED: This thunk now uses the 'api' utility to ensure correct request context.
export const fetchHeroSlides = createAsyncThunk(
  'hero/fetchSlides',
  async (_, { rejectWithValue }) => {
    try {
      // The backend view already handles filtering for active/all slides based on user role.
      // We just need to call the single endpoint.
      const response = await api('/api/hero-slides/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero slides.');
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createHeroSlide = createAsyncThunk(
  'hero/createSlide',
  async (slideFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/hero-slides/', {
        method: 'POST',
        body: slideFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHeroSlide = createAsyncThunk(
  'hero/updateSlide',
  async ({ slideId, slideFormData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/hero-slides/${slideId}/`, {
        method: 'PUT',
        body: slideFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHeroSlide = createAsyncThunk(
  'hero/deleteSlide',
  async (slideId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/hero-slides/${slideId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return slideId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  slides: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
  mutationError: null,
};

const heroSlice = createSlice({
  name: 'hero',
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
      .addCase(fetchHeroSlides.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        state.slides = action.payload;
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Create cases
      .addCase(createHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createHeroSlide.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.slides.push(action.payload); })
      .addCase(createHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      // Update cases
      .addCase(updateHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateHeroSlide.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.slides.findIndex(slide => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = action.payload;
        }
      })
      .addCase(updateHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      // Delete cases
      .addCase(deleteHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteHeroSlide.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.slides = state.slides.filter(slide => slide.id !== action.payload);
      })
      .addCase(deleteHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; });
  },
});

export const { clearMutationStatus } = heroSlice.actions;
export default heroSlice.reducer;
