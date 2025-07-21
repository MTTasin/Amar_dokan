import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu(state) {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleMenu, closeMenu } = uiSlice.actions;
export default uiSlice.reducer;
