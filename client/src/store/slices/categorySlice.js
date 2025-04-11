import { createSlice } from "@reduxjs/toolkit";

const getInitialCategory = () =>
  sessionStorage.getItem("selectedCategory") || "all";

const getInitialItem = () => sessionStorage.getItem("selectedItem") || "Home";

const initialState = {
  selectedCategory: getInitialCategory(),
  selectedItem: getInitialItem(),
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      sessionStorage.setItem("selectedCategory", action.payload);
    },
    setItem: (state, action) => {
      state.selectedItem = action.payload;
      sessionStorage.setItem("selectedItem", action.payload);
    },
  },
});

export const { setCategory, setItem } = categorySlice.actions;
export default categorySlice.reducer;
