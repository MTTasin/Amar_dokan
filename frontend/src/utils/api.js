import { tokenRefreshed, logout } from '../store/authSlice';

const API_BASE_URL = 'https://amardokan.pythonanywhere.com';

// FIXED: Declare 'store' with 'let' so it can be assigned later.
let store;

// An exported function that allows us to inject the store
export const injectStore = (_store) => {
  store = _store;
};

// This is our custom fetch wrapper
const api = async (url, options = {}) => {
  // Get the current token from the injected Redux store
  let token = store.getState().auth.accessToken;

  // Set up the initial headers
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the initial request
  let response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  // Check if the token expired (401 Unauthorized)
  if (response.status === 401) {
    console.log('Access token expired. Attempting to refresh...');
    const refreshToken = store.getState().auth.refreshToken;

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/jwt/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (!refreshResponse.ok) {
          throw new Error('Refresh token is invalid or expired.');
        }

        console.log('Token refreshed successfully.');
        store.dispatch(tokenRefreshed({ accessToken: refreshData.access }));
        
        headers['Authorization'] = `Bearer ${refreshData.access}`;

        console.log('Retrying the original request...');
        response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

      } catch (error) {
        console.error('Failed to refresh token:', error);
        store.dispatch(logout());
        window.location.href = '/login'; 
        return Promise.reject('Session expired. Please log in again.');
      }
    } else {
      store.dispatch(logout());
      window.location.href = '/login';
      return Promise.reject('No refresh token available. Please log in again.');
    }
  }

  return response;
};

export default api;
