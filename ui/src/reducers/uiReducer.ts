import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  path: string[];
}

const initialState: UIState = { sidebarOpen: false, path: [] };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleSidebar: (state) => {
      console.log("Toggling sidebar");
      state.sidebarOpen = !state.sidebarOpen;
    },
    setPath: (state, action: PayloadAction<string[]>) => {
      state.path = action.payload;
    },
    clearPath: (state) => {
      state.path = [];
    },
    appendPath: (state, action: PayloadAction<string | string[]>) => {
      state.path = state.path.concat(
        Array.isArray(action.payload) ? action.payload : [action.payload]
      );
    },
  },
});

export default uiSlice.reducer;
export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setPath,
  clearPath,
  appendPath,
} = uiSlice.actions;
