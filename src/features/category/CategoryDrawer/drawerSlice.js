import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const {toggleDrawer , openDrawer , closeDrawer} = drawerSlice.actions;
export default drawerSlice.reducer;
