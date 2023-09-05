import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreference } from "../types";

const initialState: UserPreference = {
  accountPrivacy: "PRIVATE",
  messagePrivacy: "MUTUALS",
  dateOfBirth: Number(new Date()),
};

type SetPreferencePayload<TPreference extends keyof UserPreference> = {
  preference: TPreference;
  value: UserPreference[TPreference];
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialState,
  reducers: {
    setPreference: <TPreference extends keyof UserPreference>(
      state: UserPreference,
      action: PayloadAction<SetPreferencePayload<TPreference>>
    ) => {
      state[action.payload.preference] = action.payload.value;
    },
    resetPreferences: () => initialState,
    loadPreferences: (
      state,
      preferences: PayloadAction<Partial<UserPreference>>
    ) => {
      return { ...state, ...preferences.payload };
    },
  },
});

const setPreference = preferencesSlice.actions.setPreference as <
  TPreference extends keyof UserPreference
>({
  preference,
  value,
}: SetPreferencePayload<TPreference>) => {
  payload: SetPreferencePayload<TPreference>;
  type: "preferences/setPreference";
};

export default preferencesSlice.reducer;
export const { resetPreferences, loadPreferences } = preferencesSlice.actions;
export { setPreference };
