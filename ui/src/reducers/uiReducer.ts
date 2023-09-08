import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  title: string | undefined;
  notifications: number;
}

const initialState: UIState = {
  sidebarOpen: false,
  title: undefined,
  notifications: 0,
};

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
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTitle: (state, action: PayloadAction<UIState["title"]>) => {
      state.title = action.payload;
    },
    clearTitle: (state) => {
      state.title = undefined;
    },
    setNotifications: (
      state,
      action: PayloadAction<UIState["notifications"]>
    ) => {
      state.notifications = Math.max(action.payload, 0);
    },
    clearNotifications: (state) => {
      state.notifications = 0;
    },
    incrementNotifications: (state) => {
      state.notifications = Math.max(state.notifications + 1, 0);
    },
    decrementNotifications: (state) => {
      state.notifications = Math.max(state.notifications - 1, 0);
    },
  },
});

export default uiSlice.reducer;
export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setTitle,
  clearTitle,
  setNotifications,
  clearNotifications,
  incrementNotifications,
  decrementNotifications,
} = uiSlice.actions;
