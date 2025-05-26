import { uiSliceState } from "@/util/interface/slice";
import { createSlice } from "@reduxjs/toolkit";

const initialState: uiSliceState = {
  sidebar: {
    isHovered: false,
    isOpen: true,
    mobileOpen: false,
  },
  refetch: false,
  modal: {
    isOpen: false,
  },
};

const uiSlice = createSlice({
  initialState,
  name: "uiSlice",
  reducers: {
    handleOpenAndClose: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    handleMobileMenuOpen: (state) => {
      state.sidebar.mobileOpen = !state.sidebar.mobileOpen;
    },
    handleHoverIn: (state) => {
      state.sidebar.isHovered = true;
    },
    handleHoverOut: (state) => {
      state.sidebar.isHovered = false;
    },
    handleOpenAndCloseModal: (state) => {
      state.modal.isOpen = !state.modal.isOpen;
    },
    handleRefetch: (state) => {
      state.refetch = !state.refetch;
    },
  },
});

export const {
  handleHoverIn,
  handleHoverOut,
  handleOpenAndClose,
  handleMobileMenuOpen,
  handleRefetch,
  handleOpenAndCloseModal,
} = uiSlice.actions;

const uiSliceReducer = uiSlice.reducer;

export default uiSliceReducer;
