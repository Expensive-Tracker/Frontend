import { userSliceState } from "@/util/interface/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userSliceState = {
  userDetail: {
    username: "",
    email: "",
    _id: "",
  },
  token: "",
  isNew: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleIsUserNew: (state) => {
      state.isNew = !state.isNew;
    },
    handleSignIn: (
      state,
      action: PayloadAction<userSliceState["userDetail"]>
    ) => {
      state.userDetail = action.payload;
    },
    handleHydrateToken: (
      state,
      action: PayloadAction<userSliceState["token"]>
    ) => {
      state.token = action.payload;
    },
    handleUserSignOut: (state) => {
      state.userDetail = {
        _id: "",
        email: "",
        username: "",
      };
      state.token = "";
    },
    handleChangeUserData: (state, action) => {
      state.userDetail = {
        ...action.payload,
      };
    },
  },
});

export const {
  handleSignIn,
  handleChangeUserData,
  handleHydrateToken,
  handleUserSignOut,
  handleIsUserNew,
} = userSlice.actions;
const userSliceReducer = userSlice.reducer;

export default userSliceReducer;
