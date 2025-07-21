import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

// --- ASYNC THUNKS ---

// UPDATED: Uses the correct '/api/manage/' prefix
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/users/');
      if (!response.ok) throw new Error('Failed to fetch users.');
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const fetchRoles = createAsyncThunk(
  'users/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/roles/');
      if (!response.ok) throw new Error('Failed to fetch roles.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const updateUserAdmin = createAsyncThunk(
  'users/updateUserAdmin',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/users/${userId}/`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/users/${userId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE DEFINITION (no changes needed here) ---
const initialState = {
  users: [],
  roles: [],
  status: 'idle',
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users cases
      .addCase(fetchAllUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Fetch roles cases
      .addCase(fetchRoles.fulfilled, (state, action) => { state.roles = action.payload; })
      
      // Update user cases
      .addCase(updateUserAdmin.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAdmin.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { clearUpdateStatus } = usersSlice.actions;
export default usersSlice.reducer;
