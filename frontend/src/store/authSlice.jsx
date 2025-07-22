import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const API_BASE_URL = 'https://amardokan.pythonanywhere.com';

// --- HELPER FUNCTIONS ---
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (user && accessToken && refreshToken) {
      return { user: JSON.parse(user), accessToken, refreshToken, isAuthenticated: true };
    }
  } catch (e) { console.warn("Could not load user from storage", e); }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
};

// --- ASYNC THUNKS ---

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      const userResponse = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) return rejectWithValue(userData);
      const payload = { user: userData, accessToken: data.access, refreshToken: data.refresh };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      return payload;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
});

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

// Async thunk for user activation
export const activateUser = createAsyncThunk(
    'auth/activateUser',
    async ({ uid, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/users/activation/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, token }),
            });
            if (!response.ok) {
                 const errorData = await response.json();
                return rejectWithValue(errorData);
            }
            // Activation returns 204 No Content on success
            return {}; 
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);


export const fetchWishlist = createAsyncThunk('auth/fetchWishlist', async (_, { rejectWithValue }) => {
    try {
        const response = await api('/api/manage/wishlist/');
        if (!response.ok) return rejectWithValue(await response.json());
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});

export const addToWishlist = createAsyncThunk('auth/addToWishlist', async ({ productId, product }, { rejectWithValue }) => {
    try {
        const response = await api(`/api/manage/wishlist/${productId}/add/`, { method: 'POST' });
        if (!response.ok) return rejectWithValue(await response.json());
        return product;
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});

export const removeFromWishlist = createAsyncThunk('auth/removeFromWishlist', async (productId, { rejectWithValue }) => {
    try {
        const response = await api(`/api/manage/wishlist/${productId}/remove/`, { method: 'POST' });
        if (!response.ok) return rejectWithValue(await response.json());
        return { productId };
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});


// --- SLICE DEFINITION ---

const initialState = {
  ...getUserFromStorage(),
  status: 'idle',
  error: null,
  wishlist: { items: [], status: 'idle', error: null }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthStatus(state) {
        state.status = 'idle';
        state.error = null;
    },
    tokenRefreshed(state, action) {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.wishlist = initialState.wishlist;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => { 
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Activation cases
      .addCase(activateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Wishlist cases
      .addCase(fetchWishlist.pending, (state) => { state.wishlist.status = 'loading'; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.wishlist.status = 'succeeded'; state.wishlist.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.wishlist.status = 'failed'; state.wishlist.error = action.payload; })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.wishlist.items.some(item => item.id === action.payload.id)) {
            state.wishlist.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist.items = state.wishlist.items.filter(
            (item) => item.id !== action.payload.productId
        );
      });
  },
});

export const { logout, tokenRefreshed, clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
