import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../types";

type ChatState = {
  drafts: Record<string, string>;
  chatHistory: Message[];
};

const initialState: ChatState = {
  drafts: {},
  chatHistory: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDraft: (
      state,
      action: PayloadAction<{ uuid: string; text: string }>
    ) => {
      state.drafts[action.payload.uuid] = action.payload.text;
    },
    clearDraft: (state, action: PayloadAction<string>) => {
      state.drafts[action.payload] = "";
    },
  },
});

export default chatSlice.reducer;
export const { setDraft, clearDraft } = chatSlice.actions;
