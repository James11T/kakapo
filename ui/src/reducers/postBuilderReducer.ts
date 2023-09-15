import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostBuilderState = {};

const initialState: PostBuilderState = {};

const postBuilderSlice = createSlice({
  name: "postBuilder",
  initialState,
  reducers: {},
});

export default postBuilderSlice.reducer;
export const {} = postBuilderSlice.actions;
