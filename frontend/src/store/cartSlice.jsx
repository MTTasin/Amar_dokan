// store/cartSlice.jsx

import { createSlice } from '@reduxjs/toolkit';

// Function to get cart data from localStorage
const getCartFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
    const cart = JSON.parse(serializedState);
    // Ensure totalAmount is a number
    cart.totalAmount = Number(cart.totalAmount) || 0;
    return cart;
  } catch (e) {
    console.warn("Could not load cart from storage", e);
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

// Function to save cart data to localStorage
const saveCartToStorage = (cartState) => {
  try {
    const serializedState = JSON.stringify(cartState);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.warn("Could not save cart to storage", e);
  }
};


const initialState = getCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      // Removed .toString().replace('$', '') as backend sends clean numeric strings
      const price = parseFloat(newItem.price);
      if (isNaN(price)) return; // Don't add if price is invalid

      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: price, // Use the parsed price
          quantity: 1,
          totalPrice: price, // Initial total price for this item
          name: newItem.name,
          image: newItem.image_url, // Use image_url from backend
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += price;
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      saveCartToStorage(state);
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return; // Do nothing if item not in cart

      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state);
    }
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
