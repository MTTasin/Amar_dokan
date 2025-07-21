import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './uiSlice.jsx';
import productsSlice from './productsSlice.jsx';
import cartSlice from './cartSlice.jsx';
import authSlice from './authSlice.jsx';
import siteSlice from './siteSlice.jsx';
import filtersSlice from './filtersSlice.jsx';
import categoriesSlice from './categoriesSlice.jsx';
import ordersSlice from './ordersSlice.jsx';
import usersSlice from './usersSlice.jsx';
import heroSlice from './heroSlice.jsx'; // Import the new hero slice

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    products: productsSlice,
    cart: cartSlice,
    auth: authSlice,
    site: siteSlice,
    filters: filtersSlice,
    categories: categoriesSlice,
    orders: ordersSlice,
    users: usersSlice,
    hero: heroSlice, // Add the new slice to the reducer
  },
});
