import { userSliceState } from "@/util/interface/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userSliceState = {
  userDetail: {
    username: "",
    email: "",
    _id: "",
  },
  token: "",
  isNew: {
    new: false,
    remain: {
      budgets: false,
      transaction: false,
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleIsUserNew: (state) => {
      state.isNew.new = true;
      state.isNew.remain.budgets = true;
      state.isNew.remain.transaction = true;
    },
    handleSetNewFalse: (state) => {
      state.isNew.new = false;
      state.isNew.remain.budgets = false;
      state.isNew.remain.transaction = false;
    },
    handleSetRemainTrue: (
      state,
      action: PayloadAction<keyof userSliceState["isNew"]["remain"]>
    ) => {
      state.isNew.remain[action.payload] = true;
    },
    handleSetRemainFalse: (
      state,
      action: PayloadAction<keyof userSliceState["isNew"]["remain"]>
    ) => {
      state.isNew.remain[action.payload] = false;
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
  handleSetRemainTrue,
  handleSetRemainFalse,
  handleSetNewFalse,
} = userSlice.actions;
const userSliceReducer = userSlice.reducer;

export default userSliceReducer;
