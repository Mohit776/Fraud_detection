import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: localStorage.getItem("activeTab") || "contract", // default tab

};

const resultTabSlice = createSlice({
  name: "resultTab",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      localStorage.setItem("activeTab", action.payload);
    },
  },
});

export const { setActiveTab } = resultTabSlice.actions;
export default resultTabSlice.reducer;
