import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import preferencesReducer from "./reducers/preferencesReducer";
import uiReducer from "./reducers/uiReducer";
import gidReducer from "./reducers/gifReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    preferences: preferencesReducer,
    ui: uiReducer,
    gifs: gidReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default store;
export type { RootState, AppDispatch };
