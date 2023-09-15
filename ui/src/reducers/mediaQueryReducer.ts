import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MediaQueryState = {
  prefersDarkMode: boolean;
};

const initialState: MediaQueryState = {
  prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};

const mediaQuerySlice = createSlice({
  name: "mediaQueries",
  initialState,
  reducers: {
    setPrefersDarkMode: (state, action: PayloadAction<boolean>) => {
      state.prefersDarkMode = action.payload;
    },
  },
});

export default mediaQuerySlice.reducer;
export const { setPrefersDarkMode } = mediaQuerySlice.actions;
