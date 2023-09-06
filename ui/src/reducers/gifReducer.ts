import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GIF } from "../types";

type GIFSliceSate = {
  favorites: GIF[];
};
const initialState: GIFSliceSate = { favorites: [] };

const gifSlice = createSlice({
  name: "gifs",
  initialState: initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<GIF>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (gif) => gif.id !== action.payload
      );
    },
  },
});

export default gifSlice.reducer;
export const { addFavorite, removeFavorite } = gifSlice.actions;
