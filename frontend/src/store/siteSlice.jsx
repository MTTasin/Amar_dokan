import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'https://amardokan.pythonanywhere.com/api';

// --- ASYNC THUNKS ---

// Public endpoint, no changes needed
export const fetchSiteConfig = createAsyncThunk(
  'site/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/site-config/`);
      if (!response.ok) {
        throw new Error('Failed to fetch site configuration.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const updateSiteConfig = createAsyncThunk(
  'site/updateConfig',
  async (configFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/site-config/', {
        method: 'PUT',
        body: configFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---

const initialState = {
  config: {
    site_name: 'The প্রফেসর',
    logo_url: null,
    about_title: '',
    about_image_url: null,
    about_story: '',
    about_mission: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    brand_video_url: '',
  },
  status: 'idle',
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    clearUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchSiteConfig.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.config = action.payload;
      })
      .addCase(fetchSiteConfig.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Update cases
      .addCase(updateSiteConfig.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateSiteConfig.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.config = action.payload;
      })
      .addCase(updateSiteConfig.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { clearUpdateStatus } = siteSlice.actions;
export default siteSlice.reducer;
