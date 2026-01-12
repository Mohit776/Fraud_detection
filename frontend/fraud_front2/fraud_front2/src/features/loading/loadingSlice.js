import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    active: false,
  },
  reducers: {
    startLoading: (state) => {
      state.active = true;
    },
    stopLoading: (state) => {
      state.active = false;
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
