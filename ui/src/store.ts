import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import preferencesReducer from "./reducers/preferencesReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    preferences: preferencesReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default store;
export type { RootState, AppDispatch };
