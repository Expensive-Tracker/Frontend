import { userSliceState } from "@/util/interface/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userSliceState = {
  userDetail: {
    username: "",
    email: "",
    _id: "",
  },
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
    handleChangeUserData: (state, action) => {
      state.userDetail = {
        ...action.payload,
      };
    },
  },
});

export const { handleSignIn, handleChangeUserData, handleHydrateToken } =
  userSlice.actions;
const userSliceReducer = userSlice.reducer;

export default userSliceReducer;
