import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisible: false,
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    showPopup(state) {
      state.isVisible = true;
    },

    hidePopup(state) {
      state.isVisible = false;
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;
export default popupSlice.reducer;
