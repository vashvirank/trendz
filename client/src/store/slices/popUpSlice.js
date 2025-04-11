import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addOrderPopup: false,
    cancelOrderPopup: false,
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleaddOrderPopup(state) {
      state.addOrderPopup = !state.addOrderPopup;
    },
    togglecancelOrderPopup(state) {
      state.cancelOrderPopup = !state.cancelOrderPopup;
    },
    closeAllPopup() {
      state.settingPopup = false;
      state.addOrderPopup = false;
      state.cancelOrderPopup = false;
    },
  },
});

export const {
  toggleSettingPopup,
  toggleaddOrderPopup,
  togglecancelOrderPopup,
  closeAllPopup,
} = popupSlice.actions;

export default popupSlice.reducer;
