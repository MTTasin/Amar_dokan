import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const API_BASE_URL = 'https://amardokan.pythonanywhere.com/api';

// --- ASYNC THUNKS ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category__slug', filters.category);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.colors && filters.colors.length > 0) {
        params.append('colors__name__in', filters.colors.join(','));
      }
      if (filters.sizes && filters.sizes.length > 0) {
        params.append('sizes__name__in', filters.sizes.join(','));
      }
      
      const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW: Dedicated thunk to fetch only featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/?is_featured=true`);
      if (!response.ok) throw new Error('Failed to fetch featured products.');
      const data = await response.json();
      return data.results || []; // Return the results array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      
      const response = await api(`/api/manage/products/?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch admin products.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`);
      if (!response.ok) throw new Error('Failed to fetch product details.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/products/', {
        method: 'POST',
        body: productFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api(`/api/manage/products/${productId}/`, {
        method: 'PATCH',
        body: isFormData ? data : JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(responseData));
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/products/${productId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'products/deleteProductImage',
  async ({ productId, imageId }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/products/${productId}/images/${imageId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return { imageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const payload = { ...reviewData, product: productId };
      const response = await api('/api/manage/reviews/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  items: [],
  featured: [], // NEW: State to hold featured products
  selectedProduct: { details: null, status: 'idle', error: null },
  listStatus: 'idle',
  listError: null,
  mutationStatus: 'idle',
  mutationError: null,
  pagination: { count: 0, next: null, previous: null },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
        state.selectedProduct = initialState.selectedProduct;
    },
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.listStatus = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.results;
        state.pagination = { count: action.payload.count, next: action.payload.next, previous: action.payload.previous };
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.listStatus = 'failed'; state.listError = action.payload; })
      
      // NEW: Cases for fetching featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      
      .addCase(fetchAdminProducts.pending, (state) => { state.listStatus = 'loading'; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.results;
        state.pagination = { count: action.payload.count, next: action.payload.next, previous: action.payload.previous };
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => { state.listStatus = 'failed'; state.listError = action.payload; })

      .addCase(fetchProductById.pending, (state) => { state.selectedProduct.status = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.selectedProduct.status = 'succeeded'; state.selectedProduct.details = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.selectedProduct.status = 'failed'; state.selectedProduct.error = action.payload; })
      
      .addCase(createProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createProduct.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.items.unshift(action.payload); })
      .addCase(createProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      .addCase(updateProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedProduct.details?.id === action.payload.id) state.selectedProduct.details = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        if (state.selectedProduct.details) {
          state.selectedProduct.details.images = state.selectedProduct.details.images.filter(
            img => img.id !== action.payload.imageId
          );
        }
      })
      
      .addCase(deleteProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      .addCase(addProductReview.pending, (state) => { 
        state.mutationStatus = 'loading'; 
        state.mutationError = null; 
      })
      .addCase(addProductReview.fulfilled, (state, action) => { 
        state.mutationStatus = 'succeeded';
        if (state.selectedProduct.details) {
          state.selectedProduct.details.reviews.unshift(action.payload);
        }
      })
      .addCase(addProductReview.rejected, (state, action) => { 
        state.mutationStatus = 'failed'; 
        state.mutationError = action.payload; 
      });
  },
});

export const { clearSelectedProduct, clearMutationStatus } = productsSlice.actions;
export default productsSlice.reducer;
