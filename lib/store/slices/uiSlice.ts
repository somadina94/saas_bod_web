import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UiState = {
  /** Persisted: user dismissed welcome banner etc. */
  dismissedTips: string[];
};

const initialState: UiState = {
  dismissedTips: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    dismissTip(state, action: PayloadAction<string>) {
      if (!state.dismissedTips.includes(action.payload)) {
        state.dismissedTips.push(action.payload);
      }
    },
  },
});

export const { dismissTip } = uiSlice.actions;
export default uiSlice.reducer;
