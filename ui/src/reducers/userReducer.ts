import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

type UserSliceState = {
  value: User | null;
};
const initialState: UserSliceState = { value: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = null;
    },
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
