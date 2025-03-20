import { themeSliceState } from "@/util/interface/slice";
import { createSlice } from "@reduxjs/toolkit";

const initialState: themeSliceState = {
  theme: "light",
};

const themeSlice = createSlice({
  initialState,
  name: "theme",
  reducers: {
    handleThemeChange: (state) => {
      if (state.theme === "light") {
        state.theme = "dark";
      } else {
        state.theme = "light";
      }
    },
  },
});

export const { handleThemeChange } = themeSlice.actions;

const themeSliceReduce = themeSlice.reducer;

export default themeSliceReduce;
