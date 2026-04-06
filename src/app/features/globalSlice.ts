import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface IGlobalState {
  isOpenCartDrawer: boolean;
  onOpenCartDrawer: boolean;
  onCloseCartDrawer: boolean;
}

const initialState: IGlobalState = {
  isOpenCartDrawer: false,
  onOpenCartDrawer: false,
  onCloseCartDrawer: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    onOpenCartDrawerAction: (state) => {
      state.onOpenCartDrawer = true;
      state.isOpenCartDrawer = true;
    },
    onCloseCartDrawerAction: (state) => {
      state.onCloseCartDrawer = false;
      state.isOpenCartDrawer = false;
    },
  },
});

export const {
  onCloseCartDrawerAction,
  onOpenCartDrawerAction,
} = globalSlice.actions;
export const selectGlobal = ({ global }: RootState) => global;
export default globalSlice.reducer;
